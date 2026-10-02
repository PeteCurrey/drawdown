/**
 * src/lib/cron-registry.ts
 *
 * Drawdown Trading — Authoritative Background Scheduled Job Registry & Observability Engine
 *
 * Documents all 16 background scheduled routes across the system:
 *  - Cloudflare Scheduler jobs (every 5m, 15m, 30m, daily)
 *  - Internal cron endpoints in /api/cron
 *  - Expected cadences, timeout limits, grace periods, and freshness thresholds
 *  - Missed-run evaluation logic
 */

import { TIME_MS } from "./data-freshness-policy.ts";

export type CronJobCategory =
  | "MARKET_DATA"
  | "SIGNALS"
  | "EDITORIAL_INGEST"
  | "INTELLIGENCE_BRIEF"
  | "GAMIFICATION"
  | "COMMUNICATIONS";

export type CronRunStatus = "RUNNING" | "SUCCESS" | "FAILED" | "TIMEOUT";

export type CronHealthState = "OK" | "RUNNING" | "MISSED" | "STALE" | "FAILED" | "UNKNOWN";

export interface CronJobDefinition {
  id: string;
  name: string;
  category: CronJobCategory;
  description: string;
  endpoint: string;
  scheduleDescription: string;
  expectedIntervalMs: number;
  gracePeriodMs: number;
  timeoutMs: number;
  dataProduced: string;
  criticality: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
}

export const CRON_JOB_REGISTRY: Record<string, CronJobDefinition> = {
  "signal-scan": {
    id: "signal-scan",
    name: "Signal Scan Engine",
    category: "SIGNALS",
    description: "Multi-timeframe technical indicator calculation & AI consensus generation",
    endpoint: "/api/signals/scan",
    scheduleDescription: "Every 5 minutes",
    expectedIntervalMs: 5 * TIME_MS.MINUTE,
    gracePeriodMs: 10 * TIME_MS.MINUTE,
    timeoutMs: 60 * TIME_MS.SECOND,
    dataProduced: "Active records in public.signals",
    criticality: "CRITICAL",
  },
  "market-sync": {
    id: "market-sync",
    name: "Market Data Sync",
    category: "MARKET_DATA",
    description: "Pre-caches insider flow, political trading, economic calendar, and market sentiment",
    endpoint: "/api/cron/market-sync",
    scheduleDescription: "Every 30 minutes (:00, :30)",
    expectedIntervalMs: 30 * TIME_MS.MINUTE,
    gracePeriodMs: 30 * TIME_MS.MINUTE,
    timeoutMs: 120 * TIME_MS.SECOND,
    dataProduced: "Cache entries in Supabase and memory",
    criticality: "HIGH",
  },
  "update-prices": {
    id: "update-prices",
    name: "Batch Price Updater",
    category: "MARKET_DATA",
    description: "Syncs latest Twelve Data quotes and Finnhub prices for 40 watch symbols",
    endpoint: "/api/cron/update-prices",
    scheduleDescription: "Every 30 minutes (:00, :30)",
    expectedIntervalMs: 30 * TIME_MS.MINUTE,
    gracePeriodMs: 30 * TIME_MS.MINUTE,
    timeoutMs: 300 * TIME_MS.SECOND,
    dataProduced: "Rows in price_cache & market_data_cache",
    criticality: "CRITICAL",
  },
  "morning-brief-weekday": {
    id: "morning-brief-weekday",
    name: "Morning Brief (Weekdays)",
    category: "INTELLIGENCE_BRIEF",
    description: "Generates Pete's audio and markdown morning market analysis and dispatches via Resend",
    endpoint: "/api/cron/morning-brief",
    scheduleDescription: "07:00 UTC Monday–Friday",
    expectedIntervalMs: 24 * TIME_MS.HOUR,
    gracePeriodMs: 60 * TIME_MS.MINUTE,
    timeoutMs: 180 * TIME_MS.SECOND,
    dataProduced: "daily_briefs row & email dispatches",
    criticality: "HIGH",
  },
  "morning-brief-weekend": {
    id: "morning-brief-weekend",
    name: "Morning Brief (Weekends)",
    category: "INTELLIGENCE_BRIEF",
    description: "Generates weekend edition morning briefing",
    endpoint: "/api/cron/morning-brief",
    scheduleDescription: "08:00 UTC Saturday & Sunday",
    expectedIntervalMs: 24 * TIME_MS.HOUR,
    gracePeriodMs: 60 * TIME_MS.MINUTE,
    timeoutMs: 180 * TIME_MS.SECOND,
    dataProduced: "daily_briefs row & email dispatches",
    criticality: "MEDIUM",
  },
  "evening-wrap": {
    id: "evening-wrap",
    name: "Evening Wrap",
    category: "INTELLIGENCE_BRIEF",
    description: "Daily market wrap-up and session review",
    endpoint: "/api/cron/evening-wrap",
    scheduleDescription: "17:00 UTC Monday–Friday",
    expectedIntervalMs: 24 * TIME_MS.HOUR,
    gracePeriodMs: 60 * TIME_MS.MINUTE,
    timeoutMs: 180 * TIME_MS.SECOND,
    dataProduced: "daily_briefs (evening) row & email dispatches",
    criticality: "HIGH",
  },
  "breaking-news": {
    id: "breaking-news",
    name: "The Wire: Breaking News",
    category: "COMMUNICATIONS",
    description: "Monitors Finnhub general news feed for breaking market alerts and sends push/email",
    endpoint: "/api/the-wire/breaking-news",
    scheduleDescription: "Every 15 minutes",
    expectedIntervalMs: 15 * TIME_MS.MINUTE,
    gracePeriodMs: 30 * TIME_MS.MINUTE,
    timeoutMs: 90 * TIME_MS.SECOND,
    dataProduced: "email_sends records and news notifications",
    criticality: "HIGH",
  },
  "social-ingest": {
    id: "social-ingest",
    name: "Social & Pilot Account Ingestion",
    category: "EDITORIAL_INGEST",
    description: "Polls active X and RSS sources for curated market insights into candidate queue",
    endpoint: "/api/cron/social-ingest",
    scheduleDescription: "Every 15 minutes",
    expectedIntervalMs: 15 * TIME_MS.MINUTE,
    gracePeriodMs: 30 * TIME_MS.MINUTE,
    timeoutMs: 180 * TIME_MS.SECOND,
    dataProduced: "Rows in public.news_candidates",
    criticality: "MEDIUM",
  },
  "instagram-ingest": {
    id: "instagram-ingest",
    name: "Instagram Monitored Intelligence Ingestion",
    category: "EDITORIAL_INGEST",
    description: "Daily Meta Business Discovery query for professional trading accounts with extraction & fact verification (gated behind INSTAGRAM_API_ENABLED)",
    endpoint: "/api/cron/instagram-ingest",
    scheduleDescription: "Daily 06:30 Europe/London",
    expectedIntervalMs: 24 * TIME_MS.HOUR,
    gracePeriodMs: 60 * TIME_MS.MINUTE,
    timeoutMs: 60 * TIME_MS.SECOND,
    dataProduced: "lobby_items draft records",
    criticality: "MEDIUM",
  },
  "lobby-ingest": {
    id: "lobby-ingest",
    name: "Lobby Ingestion Pipeline",
    category: "EDITORIAL_INGEST",
    description: "Ingests 7 primary regulatory, central bank, and macro feeds into data_events and lobby_articles",
    endpoint: "/api/cron/lobby-ingest",
    scheduleDescription: "Every 15 minutes",
    expectedIntervalMs: 15 * TIME_MS.MINUTE,
    gracePeriodMs: 30 * TIME_MS.MINUTE,
    timeoutMs: 300 * TIME_MS.SECOND,
    dataProduced: "data_events, data_observations, lobby_articles (DRAFT)",
    criticality: "CRITICAL",
  },
  "daily-report": {
    id: "daily-report",
    name: "Daily Intelligence Report",
    category: "INTELLIGENCE_BRIEF",
    description: "Runs institutional multi-asset summary and publishes daily report",
    endpoint: "/api/cron/daily-report",
    scheduleDescription: "06:00 UTC Daily",
    expectedIntervalMs: 24 * TIME_MS.HOUR,
    gracePeriodMs: 60 * TIME_MS.MINUTE,
    timeoutMs: 300 * TIME_MS.SECOND,
    dataProduced: "Rows in daily_reports",
    criticality: "HIGH",
  },
  "discipline-report": {
    id: "discipline-report",
    name: "Discipline Weekly Audit",
    category: "GAMIFICATION",
    description: "Weekly audit of user trade entries against trading plans",
    endpoint: "/api/cron/discipline-report",
    scheduleDescription: "20:00 UTC Sunday",
    expectedIntervalMs: 7 * TIME_MS.DAY,
    gracePeriodMs: 2 * TIME_MS.HOUR,
    timeoutMs: 180 * TIME_MS.SECOND,
    dataProduced: "Weekly discipline scores",
    criticality: "LOW",
  },
  "check-price-alerts": {
    id: "check-price-alerts",
    name: "Price Trigger Alerts",
    category: "MARKET_DATA",
    description: "Checks user-defined price alerts against current quotes",
    endpoint: "/api/cron/check-price-alerts",
    scheduleDescription: "Continuous / Triggered",
    expectedIntervalMs: 15 * TIME_MS.MINUTE,
    gracePeriodMs: 30 * TIME_MS.MINUTE,
    timeoutMs: 60 * TIME_MS.SECOND,
    dataProduced: "User price alert notifications",
    criticality: "MEDIUM",
  },
  "daily-brief": {
    id: "daily-brief",
    name: "Daily Brief Runner",
    category: "INTELLIGENCE_BRIEF",
    description: "Generates daily macro voice overview",
    endpoint: "/api/cron/daily-brief",
    scheduleDescription: "06:30 UTC Daily",
    expectedIntervalMs: 24 * TIME_MS.HOUR,
    gracePeriodMs: 60 * TIME_MS.MINUTE,
    timeoutMs: 180 * TIME_MS.SECOND,
    dataProduced: "Rows in daily_briefs",
    criticality: "MEDIUM",
  },
  "discipline-badges": {
    id: "discipline-badges",
    name: "Discipline Badge Awards",
    category: "GAMIFICATION",
    description: "Awards trader consistency and risk adherence badges",
    endpoint: "/api/cron/discipline-badges",
    scheduleDescription: "00:00 UTC Daily",
    expectedIntervalMs: 24 * TIME_MS.HOUR,
    gracePeriodMs: 2 * TIME_MS.HOUR,
    timeoutMs: 120 * TIME_MS.SECOND,
    dataProduced: "User badge updates",
    criticality: "LOW",
  },
  "market-call": {
    id: "market-call",
    name: "Weekly Market Call Settlement",
    category: "GAMIFICATION",
    description: "Settles user weekly direction votes against market closes",
    endpoint: "/api/cron/market-call",
    scheduleDescription: "22:00 UTC Friday",
    expectedIntervalMs: 7 * TIME_MS.DAY,
    gracePeriodMs: 4 * TIME_MS.HOUR,
    timeoutMs: 300 * TIME_MS.SECOND,
    dataProduced: "Market call points & badges",
    criticality: "LOW",
  },
  "newsletter": {
    id: "newsletter",
    name: "Weekly Broadsheet Newsletter",
    category: "COMMUNICATIONS",
    description: "Compiles top published lobby stories and sends weekly newsletter",
    endpoint: "/api/cron/newsletter",
    scheduleDescription: "10:00 UTC Saturday",
    expectedIntervalMs: 7 * TIME_MS.DAY,
    gracePeriodMs: 4 * TIME_MS.HOUR,
    timeoutMs: 300 * TIME_MS.SECOND,
    dataProduced: "Email sends via Resend",
    criticality: "MEDIUM",
  },
};

// ─── Health & Missed-Run Calculation ──────────────────────────────────────────

export interface EvaluatedCronHealth {
  jobId: string;
  name: string;
  state: CronHealthState;
  lastStartedAt: string | null;
  lastCompletedAt: string | null;
  lastSuccessAt: string | null;
  durationMs: number | null;
  recordsProcessed: number;
  lastErrorMessage: string | null;
  isMissed: boolean;
  timeSinceLastSuccessMs: number | null;
}

export function evaluateCronJobHealth(
  jobDef: CronJobDefinition,
  latestRun: {
    started_at: string;
    completed_at?: string | null;
    status: CronRunStatus;
    duration_ms?: number | null;
    records_processed?: number | null;
    error_message?: string | null;
  } | null,
  lastSuccessRun: {
    completed_at: string;
  } | null,
  referenceTimeMs: number = Date.now()
): EvaluatedCronHealth {
  if (!latestRun) {
    return {
      jobId: jobDef.id,
      name: jobDef.name,
      state: "UNKNOWN",
      lastStartedAt: null,
      lastCompletedAt: null,
      lastSuccessAt: null,
      durationMs: null,
      recordsProcessed: 0,
      lastErrorMessage: null,
      isMissed: true,
      timeSinceLastSuccessMs: null,
    };
  }

  const lastStartedMs = new Date(latestRun.started_at).getTime();
  const lastSuccessMs = lastSuccessRun ? new Date(lastSuccessRun.completed_at).getTime() : (latestRun.status === "SUCCESS" && latestRun.completed_at ? new Date(latestRun.completed_at).getTime() : null);
  const timeSinceLastSuccessMs = lastSuccessMs ? referenceTimeMs - lastSuccessMs : null;

  // Check if job is currently running
  if (latestRun.status === "RUNNING") {
    const runDurationMs = referenceTimeMs - lastStartedMs;
    if (runDurationMs > jobDef.timeoutMs * 1.5) {
      return {
        jobId: jobDef.id,
        name: jobDef.name,
        state: "FAILED", // Hung / timed out
        lastStartedAt: latestRun.started_at,
        lastCompletedAt: null,
        lastSuccessAt: lastSuccessMs ? new Date(lastSuccessMs).toISOString() : null,
        durationMs: runDurationMs,
        recordsProcessed: latestRun.records_processed || 0,
        lastErrorMessage: `Job exceeded max execution timeout (${Math.round(runDurationMs / 1000)}s > ${Math.round(jobDef.timeoutMs / 1000)}s)`,
        isMissed: true,
        timeSinceLastSuccessMs,
      };
    }
    return {
      jobId: jobDef.id,
      name: jobDef.name,
      state: "RUNNING",
      lastStartedAt: latestRun.started_at,
      lastCompletedAt: null,
      lastSuccessAt: lastSuccessMs ? new Date(lastSuccessMs).toISOString() : null,
      durationMs: runDurationMs,
      recordsProcessed: latestRun.records_processed || 0,
      lastErrorMessage: null,
      isMissed: false,
      timeSinceLastSuccessMs,
    };
  }

  // Check if most recent run failed
  if (latestRun.status === "FAILED" || latestRun.status === "TIMEOUT") {
    return {
      jobId: jobDef.id,
      name: jobDef.name,
      state: "FAILED",
      lastStartedAt: latestRun.started_at,
      lastCompletedAt: latestRun.completed_at || null,
      lastSuccessAt: lastSuccessMs ? new Date(lastSuccessMs).toISOString() : null,
      durationMs: latestRun.duration_ms || null,
      recordsProcessed: latestRun.records_processed || 0,
      lastErrorMessage: latestRun.error_message || "Execution failed",
      isMissed: true,
      timeSinceLastSuccessMs,
    };
  }

  // Check for missed / stale execution
  const maxAllowedSilentPeriodMs = jobDef.expectedIntervalMs + jobDef.gracePeriodMs;
  const isMissed = timeSinceLastSuccessMs !== null && timeSinceLastSuccessMs > maxAllowedSilentPeriodMs;

  let state: CronHealthState = "OK";
  if (isMissed) {
    state = timeSinceLastSuccessMs > maxAllowedSilentPeriodMs * 2 ? "STALE" : "MISSED";
  }

  return {
    jobId: jobDef.id,
    name: jobDef.name,
    state,
    lastStartedAt: latestRun.started_at,
    lastCompletedAt: latestRun.completed_at || null,
    lastSuccessAt: lastSuccessMs ? new Date(lastSuccessMs).toISOString() : null,
    durationMs: latestRun.duration_ms || null,
    recordsProcessed: latestRun.records_processed || 0,
    lastErrorMessage: latestRun.error_message || null,
    isMissed,
    timeSinceLastSuccessMs,
  };
}
