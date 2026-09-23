/**
 * Drawdown Intelligence Data Platform — Ingestion Scheduling Engine
 *
 * Rules:
 *  - Do NOT hardcode schedules into provider modules.
 *  - Manages declarative intervals: realtime, every-minute, every-5-minutes,
 *    hourly, daily, weekly, event-driven.
 *  - Evaluates whether a source is due for ingestion based on last execution time.
 */

import type { ScheduleInterval } from "./types.ts";
export type { ScheduleInterval };

export const INTERVAL_MILLISECONDS: Record<ScheduleInterval, number> = {
  "realtime": 10_000,          // 10 seconds
  "every-minute": 60_000,      // 1 minute
  "every-5-minutes": 300_000,  // 5 minutes
  "hourly": 3_600_000,         // 1 hour
  "daily": 86_400_000,         // 24 hours
  "weekly": 604_800_000,       // 7 days
  "event-driven": 0,           // Triggered by webhook / external event
};

export class IngestionScheduler {
  /**
   * Determines if a source or dataset is due for ingestion.
   */
  static isDue(
    frequency: ScheduleInterval,
    lastFetchedAt: string | null | undefined,
    options?: { force?: boolean }
  ): boolean {
    if (options?.force) return true;
    if (frequency === "event-driven") return false;
    if (!lastFetchedAt) return true;

    const lastTime = new Date(lastFetchedAt).getTime();
    if (isNaN(lastTime)) return true;

    const intervalMs = INTERVAL_MILLISECONDS[frequency];
    return Date.now() - lastTime >= intervalMs;
  }

  /**
   * Returns milliseconds remaining until the next scheduled run.
   */
  static getTimeUntilNextRunMs(
    frequency: ScheduleInterval,
    lastFetchedAt: string | null | undefined
  ): number {
    if (frequency === "event-driven") return Infinity;
    if (!lastFetchedAt) return 0;

    const lastTime = new Date(lastFetchedAt).getTime();
    if (isNaN(lastTime)) return 0;

    const intervalMs = INTERVAL_MILLISECONDS[frequency];
    const elapsed = Date.now() - lastTime;
    return Math.max(0, intervalMs - elapsed);
  }
}
