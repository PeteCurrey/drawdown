import type { Env } from "./types.ts";
import { SCHEDULED_JOBS } from "./config.ts";
import { dispatchScheduledEvent, executeJob } from "./dispatcher.ts";

// Export Workflow classes for Cloudflare Workflows runtime
export { MorningBriefWorkflow } from "./workflows/morning-brief.ts";
export { EveningWrapWorkflow } from "./workflows/evening-wrap.ts";
export { DailyReportWorkflow } from "./workflows/daily-report.ts";

export default {
  /**
   * Cloudflare Cron Trigger Entrypoint
   */
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(
      dispatchScheduledEvent(event.cron, event.scheduledTime, env).catch((err) => {
        console.error("[Worker] Unhandled scheduled event error:", err);
      })
    );
  },

  /**
   * HTTP Handler for Health Checks, Inventory, and Authenticated Manual Testing
   */
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // 1. Health check (unauthenticated)
    if (path === "/" || path === "/health") {
      return Response.json({
        status: "healthy",
        service: "drawdown-cloudflare-scheduler",
        environment: env.ENVIRONMENT || "production",
        targetUrl: env.DRAWDOWN_API_URL ? "configured" : "missing",
        registeredJobsCount: SCHEDULED_JOBS.length,
        timestamp: new Date().toISOString(),
      });
    }

    // 2. Schedule Inventory (unauthenticated metadata)
    if (path === "/inventory") {
      return Response.json({
        service: "drawdown-cloudflare-scheduler",
        environment: env.ENVIRONMENT,
        jobs: SCHEDULED_JOBS.map((j) => ({
          id: j.id,
          name: j.name,
          originalSchedule: j.originalSchedule,
          humanSchedule: j.humanSchedule,
          path: j.path,
          classification: j.classification,
          timeoutMs: j.timeoutMs,
          preventOverlap: j.preventOverlap,
        })),
      });
    }

    // 3. Authenticated Manual Trigger: POST /trigger/:jobId
    if (path.startsWith("/trigger/") && request.method === "POST") {
      const authHeader = request.headers.get("authorization");
      if (!env.CRON_SECRET || authHeader !== `Bearer ${env.CRON_SECRET}`) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }

      const jobId = path.replace("/trigger/", "").trim();
      const job = SCHEDULED_JOBS.find((j) => j.id === jobId);

      if (!job) {
        return Response.json(
          {
            error: `Job '${jobId}' not found. Available jobs: ${SCHEDULED_JOBS.map((j) => j.id).join(", ")}`,
          },
          { status: 404 }
        );
      }

      const result = await executeJob(job, env, "manual");
      return Response.json(result, {
        status: result.status === "SUCCESS" || result.status === "WORKFLOW_TRIGGERED" ? 200 : 500,
      });
    }

    return Response.json({ error: "Not found" }, { status: 404 });
  },
};
