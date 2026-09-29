/**
 * src/lib/freshness.ts
 *
 * Signal and data freshness thresholds.
 *
 * COMPATIBILITY WRAPPER:
 * Delegates all thresholds and evaluation logic directly to the single
 * authoritative source of truth in src/lib/data-freshness-policy.ts.
 */

import type { DataState } from "./data-states";
import {
  DATASET_FRESHNESS_CONFIG,
  getSignalFreshnessWindowMs,
  evaluateTimestampFreshness,
  isSignalEligibleForProduction,
} from "./data-freshness-policy.ts";

// ─── Freshness Windows (Exported for legacy consumers) ─────────────────────────

export const FRESHNESS_WINDOWS_MS = {
  signal_15m: DATASET_FRESHNESS_CONFIG.signal_15m.maxEligibilityAgeMs,
  signal_1h: DATASET_FRESHNESS_CONFIG.signal_1h.maxEligibilityAgeMs,
  signal_4h: DATASET_FRESHNESS_CONFIG.signal_4h.maxEligibilityAgeMs,
  signal_1d: DATASET_FRESHNESS_CONFIG.signal_1d.maxEligibilityAgeMs,
  daily_brief: DATASET_FRESHNESS_CONFIG.daily_brief.maxEligibilityAgeMs,
  market_data: DATASET_FRESHNESS_CONFIG.market_quote.maxEligibilityAgeMs,
} as const;

export type FreshnessWindowKey = keyof typeof FRESHNESS_WINDOWS_MS;

// ─── Signal Freshness ─────────────────────────────────────────────────────────

type SignalTimeframe = "15M" | "15m" | "1H" | "1h" | "4H" | "4h" | "1D" | "1d" | "1day" | string;

/**
 * Returns the freshness state of a signal based on its created_at timestamp
 * and timeframe. Delegates to canonical data-freshness-policy.
 */
export function getSignalFreshness(signal: {
  created_at: string;
  timeframe: SignalTimeframe;
  is_active: boolean;
}): DataState {
  if (!signal.is_active) return "empty"; // expired/closed signal

  const windowMs = getSignalFreshnessWindowMs(signal.timeframe);
  const ageMs = Date.now() - new Date(signal.created_at).getTime();

  if (ageMs > windowMs) {
    return "stale";
  }

  return "live";
}

/**
 * Formats a human-readable age label for a signal.
 */
export function getSignalAgeLabel(createdAt: string): string {
  const ageMs = Date.now() - new Date(createdAt).getTime();
  const mins = Math.floor(ageMs / (60 * 1000));
  const hours = Math.floor(ageMs / (60 * 60 * 1000));
  const days = Math.floor(ageMs / (24 * 60 * 60 * 1000));

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) {
    const remMins = mins % 60;
    return remMins > 0 ? `${hours}h ${remMins}m ago` : `${hours}h ago`;
  }
  const remHours = hours % 24;
  return remHours > 0 ? `${days}d ${remHours}h ago` : `${days}d ago`;
}

export { isSignalEligibleForProduction };
