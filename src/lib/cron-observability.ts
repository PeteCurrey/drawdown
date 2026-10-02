/**
 * src/lib/cron-observability.ts
 *
 * Drawdown Trading — Cron Run Telemetry & Execution Lifecycle Tracker
 *
 * Provides startCronRun and completeCronRun helpers for background cron routes.
 * Writes to public.cron_job_runs.
 */

import { SupabaseClient } from "@supabase/supabase-js";
import { CronRunStatus } from "./cron-registry.ts";

export interface StartCronRunOptions {
  jobName: string;
  endpoint: string;
  metadata?: Record<string, any>;
}

export interface CompleteCronRunOptions {
  status: CronRunStatus;
  recordsProcessed?: number;
  errorMessage?: string | null;
  metadata?: Record<string, any>;
}

/**
 * Inserts a RUNNING record into cron_job_runs.
 * Returns the run ID or null on failure (fail-safe so cron does not crash if DB is temporarily unreachable).
 */
export async function startCronRun(
  supabase: SupabaseClient,
  options: StartCronRunOptions
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("cron_job_runs")
      .insert({
        job_name: options.jobName,
        endpoint: options.endpoint,
        started_at: new Date().toISOString(),
        status: "RUNNING",
        metadata: options.metadata || {},
      })
      .select("id")
      .single();

    if (error) {
      console.warn(`[cron-observability] Failed to record start of ${options.jobName}:`, error.message);
      return null;
    }

    return data?.id || null;
  } catch (err) {
    console.warn(`[cron-observability] Unexpected error recording start of ${options.jobName}:`, err);
    return null;
  }
}

/**
 * Updates a cron_job_runs record with completion timestamp, status, duration, and processed metrics.
 */
export async function completeCronRun(
  supabase: SupabaseClient,
  runId: string | null,
  options: CompleteCronRunOptions
): Promise<void> {
  if (!runId) return;

  try {
    const completedAt = new Date();

    // Fetch started_at to compute accurate duration
    const { data: runRecord } = await supabase
      .from("cron_job_runs")
      .select("started_at, metadata")
      .eq("id", runId)
      .single();

    let durationMs: number | null = null;
    if (runRecord?.started_at) {
      durationMs = completedAt.getTime() - new Date(runRecord.started_at).getTime();
    }

    const mergedMetadata = {
      ...(runRecord?.metadata || {}),
      ...(options.metadata || {}),
    };

    await supabase
      .from("cron_job_runs")
      .update({
        completed_at: completedAt.toISOString(),
        status: options.status,
        duration_ms: durationMs,
        records_processed: options.recordsProcessed || 0,
        error_message: options.errorMessage || null,
        metadata: mergedMetadata,
      })
      .eq("id", runId);
  } catch (err) {
    console.warn(`[cron-observability] Unexpected error completing run ${runId}:`, err);
  }
}
