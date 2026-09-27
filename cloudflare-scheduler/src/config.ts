import type { ScheduledJobDefinition } from "./types.ts";

/**
 * Authoritative Job Registry
 * Matches all 11 original cron schedules removed from Vercel Hobby deployment.
 * All time calculations are strictly in UTC.
 */
export const SCHEDULED_JOBS: ScheduledJobDefinition[] = [
  {
    id: "signal-scan",
    name: "Signal Scan",
    originalSchedule: "*/5 * * * *",
    humanSchedule: "Every 5 minutes",
    path: "/api/signals/scan",
    method: "GET",
    classification: "simple_api",
    timeoutMs: 60_000,
    preventOverlap: true,
    isDue: (d: Date) => d.getUTCMinutes() % 5 === 0,
  },
  {
    id: "market-sync",
    name: "Market Sync",
    originalSchedule: "*/30 * * * *",
    humanSchedule: "Every 30 minutes (:00, :30)",
    path: "/api/cron/market-sync",
    method: "GET",
    classification: "simple_api",
    timeoutMs: 120_000,
    preventOverlap: true,
    isDue: (d: Date) => d.getUTCMinutes() % 30 === 0,
  },
  {
    id: "update-prices",
    name: "Update Prices",
    originalSchedule: "*/30 * * * *",
    humanSchedule: "Every 30 minutes (:00, :30)",
    path: "/api/cron/update-prices",
    method: "GET",
    classification: "simple_api",
    timeoutMs: 300_000,
    preventOverlap: true,
    isDue: (d: Date) => d.getUTCMinutes() % 30 === 0,
  },
  {
    id: "morning-brief-weekday",
    name: "Morning Brief (Weekdays)",
    originalSchedule: "0 7 * * 1-5",
    humanSchedule: "07:00 UTC Monday–Friday",
    path: "/api/cron/morning-brief",
    method: "GET",
    classification: "durable_workflow",
    workflowBinding: "MORNING_BRIEF_WORKFLOW",
    timeoutMs: 180_000,
    preventOverlap: true,
    isDue: (d: Date) => {
      const min = d.getUTCMinutes();
      const hr = d.getUTCHours();
      const day = d.getUTCDay(); // 0 = Sun, 1 = Mon, ..., 5 = Fri, 6 = Sat
      return min === 0 && hr === 7 && day >= 1 && day <= 5;
    },
  },
  {
    id: "morning-brief-weekend",
    name: "Morning Brief (Weekends)",
    originalSchedule: "0 8 * * 0,6",
    humanSchedule: "08:00 UTC Saturday & Sunday",
    path: "/api/cron/morning-brief",
    method: "GET",
    classification: "durable_workflow",
    workflowBinding: "MORNING_BRIEF_WORKFLOW",
    timeoutMs: 180_000,
    preventOverlap: true,
    isDue: (d: Date) => {
      const min = d.getUTCMinutes();
      const hr = d.getUTCHours();
      const day = d.getUTCDay();
      return min === 0 && hr === 8 && (day === 0 || day === 6);
    },
  },
  {
    id: "evening-wrap",
    name: "Evening Wrap",
    originalSchedule: "0 17 * * 1-5",
    humanSchedule: "17:00 UTC Monday–Friday",
    path: "/api/cron/evening-wrap",
    method: "GET",
    classification: "durable_workflow",
    workflowBinding: "EVENING_WRAP_WORKFLOW",
    timeoutMs: 180_000,
    preventOverlap: true,
    isDue: (d: Date) => {
      const min = d.getUTCMinutes();
      const hr = d.getUTCHours();
      const day = d.getUTCDay();
      return min === 0 && hr === 17 && day >= 1 && day <= 5;
    },
  },
  {
    id: "breaking-news",
    name: "The Wire: Breaking News",
    originalSchedule: "*/15 * * * *",
    humanSchedule: "Every 15 minutes (:00, :15, :30, :45)",
    path: "/api/the-wire/breaking-news",
    method: "GET",
    classification: "simple_api",
    timeoutMs: 90_000,
    preventOverlap: true,
    isDue: (d: Date) => d.getUTCMinutes() % 15 === 0,
  },
  {
    id: "social-ingest",
    name: "Social Ingest",
    originalSchedule: "*/15 * * * *",
    humanSchedule: "Every 15 minutes (:00, :15, :30, :45)",
    path: "/api/cron/social-ingest",
    method: "GET",
    classification: "simple_api",
    timeoutMs: 180_000,
    preventOverlap: true,
    isDue: (d: Date) => d.getUTCMinutes() % 15 === 0,
  },
  {
    id: "discipline-report",
    name: "Discipline Report",
    originalSchedule: "0 20 * * 0",
    humanSchedule: "20:00 UTC Sunday",
    path: "/api/cron/discipline-report",
    method: "GET",
    classification: "simple_api",
    timeoutMs: 180_000,
    preventOverlap: true,
    isDue: (d: Date) => {
      const min = d.getUTCMinutes();
      const hr = d.getUTCHours();
      const day = d.getUTCDay();
      return min === 0 && hr === 20 && day === 0;
    },
  },
  {
    id: "daily-report",
    name: "Daily Intelligence Report",
    originalSchedule: "0 6 * * *",
    humanSchedule: "06:00 UTC Daily",
    path: "/api/cron/daily-report",
    method: "GET",
    classification: "durable_workflow",
    workflowBinding: "DAILY_REPORT_WORKFLOW",
    timeoutMs: 300_000,
    preventOverlap: true,
    isDue: (d: Date) => d.getUTCMinutes() === 0 && d.getUTCHours() === 6,
  },
  {
    id: "lobby-ingest",
    name: "Lobby Data Platform Ingest",
    originalSchedule: "*/15 * * * *",
    humanSchedule: "Every 15 minutes (:00, :15, :30, :45)",
    path: "/api/cron/lobby-ingest",
    method: "GET",
    classification: "simple_api",
    timeoutMs: 300_000,
    preventOverlap: true,
    isDue: (d: Date) => d.getUTCMinutes() % 15 === 0,
  },
];
