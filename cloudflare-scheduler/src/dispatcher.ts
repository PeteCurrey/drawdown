import type { Env, ScheduledJobDefinition, JobExecutionResult } from "./types.ts";
import { SCHEDULED_JOBS } from "./config.ts";
import { lockManager } from "./lock.ts";
import { invokeDrawdownEndpoint } from "./invoker.ts";

/**
 * Identifies which jobs are due based on the trigger time and optional explicit cron string.
 */
export function getDueJobs(date: Date, explicitCron?: string): ScheduledJobDefinition[] {
  // If an explicit cron string was provided and matches one or more registered schedules,
  // execute those matching jobs.
  if (explicitCron && explicitCron !== "*/5 * * * *") {
    const matching = SCHEDULED_JOBS.filter((j) => j.originalSchedule === explicitCron);
    if (matching.length > 0) {
      return matching;
    }
  }

  // Otherwise, evaluate each job's UTC schedule against the current date
  return SCHEDULED_JOBS.filter((job) => job.isDue(date));
}

/**
 * Executes a single job definition, honoring concurrency locks and workflow routing.
 */
export async function executeJob(
  job: ScheduledJobDefinition,
  env: Env,
  executionSource: "cron" | "manual" = "cron"
): Promise<JobExecutionResult> {
  const startTime = Date.now();

  // 1. In-flight overlap protection
  if (job.preventOverlap) {
    const lockAcquired = lockManager.acquire(job.id, job.timeoutMs);
    if (!lockAcquired) {
      console.warn(
        JSON.stringify({
          level: "WARN",
          event: "JOB_SKIPPED_OVERLAP",
          jobId: job.id,
          reason: "Prior execution is still in-flight. Skipping to prevent duplicates.",
          timestamp: new Date().toISOString(),
        })
      );
      return {
        jobId: job.id,
        status: "SKIPPED_IN_FLIGHT",
        durationMs: 0,
      };
    }
  }

  try {
    // 2. Durable Workflow routing
    if (job.classification === "durable_workflow") {
      let workflowInstance: { id: string } | null = null;
      const instanceId = `${job.id}-${Date.now()}`;

      if (job.id.startsWith("morning-brief") && env.MORNING_BRIEF_WORKFLOW) {
        workflowInstance = await env.MORNING_BRIEF_WORKFLOW.create({
          id: instanceId,
          params: { triggeredAt: new Date().toISOString(), source: executionSource },
        });
      } else if (job.id === "evening-wrap" && env.EVENING_WRAP_WORKFLOW) {
        workflowInstance = await env.EVENING_WRAP_WORKFLOW.create({
          id: instanceId,
          params: { triggeredAt: new Date().toISOString(), source: executionSource },
        });
      } else if (job.id === "daily-report" && env.DAILY_REPORT_WORKFLOW) {
        // Idempotent daily report ID keyed to current date
        const dateKey = new Date().toISOString().split("T")[0];
        workflowInstance = await env.DAILY_REPORT_WORKFLOW.create({
          id: `daily-report-${dateKey}`,
          params: { triggeredAt: new Date().toISOString(), source: executionSource },
        });
      }

      if (workflowInstance) {
        const durationMs = Date.now() - startTime;
        console.log(
          JSON.stringify({
            level: "INFO",
            event: "WORKFLOW_TRIGGERED",
            jobId: job.id,
            workflowInstanceId: workflowInstance.id,
            durationMs,
            timestamp: new Date().toISOString(),
          })
        );
        return {
          jobId: job.id,
          status: "WORKFLOW_TRIGGERED",
          workflowInstanceId: workflowInstance.id,
          durationMs,
        };
      }

      // Fallback: If workflow binding is not present (e.g. in test env), invoke directly
      console.warn(`[Dispatcher] Workflow binding missing for ${job.id}, falling back to direct HTTP invocation`);
    }

    // 3. Simple API HTTP invocation
    return await invokeDrawdownEndpoint(job, env);
  } finally {
    if (job.preventOverlap) {
      lockManager.release(job.id);
    }
  }
}

/**
 * Main scheduled event handler.
 * Called by Cloudflare Workers runtime on every cron tick.
 */
export async function dispatchScheduledEvent(
  cron: string,
  scheduledTime: number,
  env: Env
): Promise<JobExecutionResult[]> {
  const triggerDate = new Date(scheduledTime || Date.now());
  const dueJobs = getDueJobs(triggerDate, cron);

  console.log(
    JSON.stringify({
      level: "INFO",
      event: "SCHEDULED_TICK",
      cron,
      triggerDateUtc: triggerDate.toISOString(),
      dueJobsCount: dueJobs.length,
      dueJobIds: dueJobs.map((j) => j.id),
      timestamp: new Date().toISOString(),
    })
  );

  if (dueJobs.length === 0) {
    return [];
  }

  // Execute all due jobs in parallel with isolated error boundaries
  const results = await Promise.allSettled(
    dueJobs.map((job) => executeJob(job, env, "cron"))
  );

  return results.map((res, idx) => {
    if (res.status === "fulfilled") {
      return res.value;
    }
    const failedJob = dueJobs[idx];
    return {
      jobId: failedJob.id,
      status: "ERROR",
      durationMs: 0,
      error: res.reason?.message || "Unknown dispatch failure",
    };
  });
}
