/**
 * Signal and data freshness thresholds.
 *
 * These are the authoritative freshness windows for Drawdown.
 * Every component that displays time-sensitive data must use these values
 * rather than implementing its own ad-hoc threshold.
 *
 * Rule: Stale data must be visibly stale. It must not appear current.
 */

import type { DataState } from "./data-states";

// ─── Freshness Windows ────────────────────────────────────────────────────────

export const FRESHNESS_WINDOWS_MS = {
  /** Intraday 15-minute signals expire after 2 hours */
  signal_15m: 2 * 60 * 60 * 1000,
  /** 1-hour signals expire after 4 hours */
  signal_1h: 4 * 60 * 60 * 1000,
  /** 4-hour signals expire after 12 hours */
  signal_4h: 12 * 60 * 60 * 1000,
  /** Daily signals expire after 48 hours */
  signal_1d: 48 * 60 * 60 * 1000,
  /** Daily intelligence briefs are considered stale after 26 hours */
  daily_brief: 26 * 60 * 60 * 1000,
  /** Market price quotes are stale after 15 minutes */
  market_data: 15 * 60 * 1000,
} as const;

export type FreshnessWindowKey = keyof typeof FRESHNESS_WINDOWS_MS;

// ─── Signal Freshness ─────────────────────────────────────────────────────────

type SignalTimeframe = "15M" | "15m" | "1H" | "1h" | "4H" | "4h" | "1D" | "1d" | "1day" | string;

function getSignalWindowMs(timeframe: SignalTimeframe): number {
  const tf = timeframe.toUpperCase();
  if (tf === "15M") return FRESHNESS_WINDOWS_MS.signal_15m;
  if (tf === "1H") return FRESHNESS_WINDOWS_MS.signal_1h;
  if (tf === "4H") return FRESHNESS_WINDOWS_MS.signal_4h;
  // 1D and any other longer timeframe
  return FRESHNESS_WINDOWS_MS.signal_1d;
}

/**
 * Returns the freshness state of a signal based on its created_at timestamp
 * and timeframe. This check is independent of is_active / expires_at and
 * provides a secondary layer of staleness detection.
 *
 * A signal that is `is_active: true` but was generated 40 days ago is STALE,
 * regardless of its expires_at value.
 */
export function getSignalFreshness(signal: {
  created_at: string;
  timeframe: SignalTimeframe;
  is_active: boolean;
}): DataState {
  if (!signal.is_active) return "empty"; // expired/closed signal
  const ageMs = Date.now() - new Date(signal.created_at).getTime();
  const windowMs = getSignalWindowMs(signal.timeframe);
  if (ageMs > windowMs) return "stale";
  return "live";
}

/**
 * Returns a human-readable staleness label for display in the UI.
 */
export function getSignalAgeLabel(createdAt: string): string {
  const ageMs = Date.now() - new Date(createdAt).getTime();
  const hours = Math.floor(ageMs / (60 * 60 * 1000));
  const minutes = Math.floor((ageMs % (60 * 60 * 1000)) / (60 * 1000));
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h ago`;
  if (hours > 0) return `${hours}h ${minutes}m ago`;
  return `${minutes}m ago`;
}

// ─── Brief Freshness ──────────────────────────────────────────────────────────

/**
 * Returns the freshness state of a daily brief record.
 */
export function getBriefFreshness(reportDate: string | null): DataState {
  if (!reportDate) return "empty";
  const briefDate = new Date(reportDate);
  const ageMs = Date.now() - briefDate.getTime();
  if (ageMs > FRESHNESS_WINDOWS_MS.daily_brief) return "stale";
  return "live";
}
