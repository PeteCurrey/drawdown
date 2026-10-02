/**
 * src/lib/data-freshness-policy.ts
 *
 * Drawdown Trading — Authoritative Platform Data Freshness & Eligibility Policy
 *
 * Core Principle:
 * TRUTH BEFORE FEATURES.
 * Production must display live, verified, and appropriately fresh data —
 * or explicitly show that the relevant feed is unavailable/empty.
 * It must NEVER silently fall back to stale, test, mock, placeholder,
 * or fabricated data.
 *
 * This file is the SINGLE SOURCE OF TRUTH for:
 *  - Freshness thresholds across all platform datasets (editorial, market, signals, macro, cron)
 *  - Eligibility gates for public presentation slots (Lead, Coming Up, Watchlist, etc.)
 *  - Semantic status classification (LIVE, RECENT, STALE, AGED, UNAVAILABLE, ERROR)
 *  - Retirement lifecycles
 */

// ─── Time Constants (in milliseconds) ─────────────────────────────────────────

export const TIME_MS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
} as const;

// ─── Freshness Status Bands ───────────────────────────────────────────────────

export type DataFreshnessBand =
  | "LIVE"         // Data is actively streaming or verified within target cadence
  | "RECENT"       // Data is still valid but outside immediate live update window
  | "STALE"        // Data has aged past normal refresh threshold; needs warning or deprioritisation
  | "AGED"         // Data is too old for hero/lead slots; demoted to archive
  | "UNAVAILABLE"  // Source offline, no data available, or data expired
  | "ERROR";       // Validation failed, malformed payload, or circuit breaker open

// ─── Dataset Freshness Windows ────────────────────────────────────────────────

export interface FreshnessWindowConfig {
  liveWindowMs: number;
  recentWindowMs: number;
  staleWindowMs: number;
  maxEligibilityAgeMs: number;
}

export const DATASET_FRESHNESS_CONFIG: Record<string, FreshnessWindowConfig> = {
  /** Lobby Lead Story: must be < 24h for full fresh badge; strictly excluded if > 72h */
  lobby_lead: {
    liveWindowMs: 24 * TIME_MS.HOUR,
    recentWindowMs: 48 * TIME_MS.HOUR,
    staleWindowMs: 72 * TIME_MS.HOUR,
    maxEligibilityAgeMs: 72 * TIME_MS.HOUR, // Hard gate: articles > 72h CANNOT be lead
  },

  /** General Lobby Articles (What's Happening, Just In, etc.) */
  lobby_article_general: {
    liveWindowMs: 24 * TIME_MS.HOUR,
    recentWindowMs: 72 * TIME_MS.HOUR,
    staleWindowMs: 14 * TIME_MS.DAY,
    maxEligibilityAgeMs: 14 * TIME_MS.DAY, // After 14 days, demoted from homepage streams
  },

  /** Lobby Watchlist Briefs */
  lobby_watchlist: {
    liveWindowMs: 7 * TIME_MS.DAY,
    recentWindowMs: 14 * TIME_MS.DAY,
    staleWindowMs: 14 * TIME_MS.DAY,
    maxEligibilityAgeMs: 14 * TIME_MS.DAY, // Max 14 days for surveillance briefs
  },

  /** Real-time / Canonical Market Quotes */
  market_quote: {
    liveWindowMs: 60 * TIME_MS.SECOND,      // < 1m = LIVE
    recentWindowMs: 5 * TIME_MS.MINUTE,     // 1m - 5m = RECENT
    staleWindowMs: 15 * TIME_MS.MINUTE,     // 5m - 15m = STALE
    maxEligibilityAgeMs: 15 * TIME_MS.MINUTE, // > 15m = OFFLINE / UNAVAILABLE
  },

  /** Market Screener Batch Cache */
  market_screener: {
    liveWindowMs: 60 * TIME_MS.SECOND,
    recentWindowMs: 5 * TIME_MS.MINUTE,
    staleWindowMs: 15 * TIME_MS.MINUTE,
    maxEligibilityAgeMs: 15 * TIME_MS.MINUTE,
  },

  /** Intraday Candles (15m) */
  intraday_candles: {
    liveWindowMs: 15 * TIME_MS.MINUTE,
    recentWindowMs: 60 * TIME_MS.MINUTE,
    staleWindowMs: 3 * TIME_MS.HOUR,
    maxEligibilityAgeMs: 12 * TIME_MS.HOUR,
  },

  /** Hourly Candles (1h / 4h) */
  hourly_candles: {
    liveWindowMs: 4 * TIME_MS.HOUR,
    recentWindowMs: 12 * TIME_MS.HOUR,
    staleWindowMs: 24 * TIME_MS.HOUR,
    maxEligibilityAgeMs: 48 * TIME_MS.HOUR,
  },

  /** Daily Candles (accounts for weekend market close) */
  daily_candles: {
    liveWindowMs: 26 * TIME_MS.HOUR,
    recentWindowMs: 72 * TIME_MS.HOUR, // Weekend gap tolerance
    staleWindowMs: 96 * TIME_MS.HOUR,
    maxEligibilityAgeMs: 120 * TIME_MS.HOUR,
  },

  /** Signals: 15M Timeframe */
  signal_15m: {
    liveWindowMs: 60 * TIME_MS.MINUTE,
    recentWindowMs: 2 * TIME_MS.HOUR,
    staleWindowMs: 2 * TIME_MS.HOUR,
    maxEligibilityAgeMs: 2 * TIME_MS.HOUR, // 15M signal strictly expires after 2 hours
  },

  /** Signals: 1H Timeframe */
  signal_1h: {
    liveWindowMs: 2 * TIME_MS.HOUR,
    recentWindowMs: 4 * TIME_MS.HOUR,
    staleWindowMs: 4 * TIME_MS.HOUR,
    maxEligibilityAgeMs: 4 * TIME_MS.HOUR, // 1H signal strictly expires after 4 hours
  },

  /** Signals: 4H Timeframe */
  signal_4h: {
    liveWindowMs: 6 * TIME_MS.HOUR,
    recentWindowMs: 12 * TIME_MS.HOUR,
    staleWindowMs: 12 * TIME_MS.HOUR,
    maxEligibilityAgeMs: 12 * TIME_MS.HOUR, // 4H signal strictly expires after 12 hours
  },

  /** Signals: 1D Timeframe */
  signal_1d: {
    liveWindowMs: 24 * TIME_MS.HOUR,
    recentWindowMs: 48 * TIME_MS.HOUR,
    staleWindowMs: 48 * TIME_MS.HOUR,
    maxEligibilityAgeMs: 48 * TIME_MS.HOUR, // 1D signal strictly expires after 48 hours
  },

  /** Daily Market Briefs (Morning/Evening) */
  daily_brief: {
    liveWindowMs: 14 * TIME_MS.HOUR,        // Active during trading session
    recentWindowMs: 26 * TIME_MS.HOUR,
    staleWindowMs: 26 * TIME_MS.HOUR,
    maxEligibilityAgeMs: 26 * TIME_MS.HOUR, // After 26h, demoted until next day's brief
  },

  /** Breaking News / The Wire */
  breaking_news: {
    liveWindowMs: 60 * TIME_MS.MINUTE,      // < 1h is "breaking"
    recentWindowMs: 4 * TIME_MS.HOUR,       // 1h - 4h is intraday news
    staleWindowMs: 12 * TIME_MS.HOUR,
    maxEligibilityAgeMs: 24 * TIME_MS.HOUR,
  },

  /** Economic Calendar Releases */
  economic_calendar: {
    liveWindowMs: 24 * TIME_MS.HOUR,
    recentWindowMs: 72 * TIME_MS.HOUR,
    staleWindowMs: 7 * TIME_MS.DAY,
    maxEligibilityAgeMs: 30 * TIME_MS.DAY,
  },
};

// ─── Signal Window Helper ─────────────────────────────────────────────────────

export function getSignalFreshnessWindowMs(timeframe: string): number {
  const tf = (timeframe || "").toUpperCase().trim();
  if (tf === "15M") return DATASET_FRESHNESS_CONFIG.signal_15m.maxEligibilityAgeMs;
  if (tf === "1H") return DATASET_FRESHNESS_CONFIG.signal_1h.maxEligibilityAgeMs;
  if (tf === "4H") return DATASET_FRESHNESS_CONFIG.signal_4h.maxEligibilityAgeMs;
  if (tf === "1D" || tf === "1DAY" || tf === "D") return DATASET_FRESHNESS_CONFIG.signal_1d.maxEligibilityAgeMs;
  return DATASET_FRESHNESS_CONFIG.signal_1d.maxEligibilityAgeMs;
}

// ─── Generic Freshness Evaluation ─────────────────────────────────────────────

export interface EvaluatedFreshness {
  band: DataFreshnessBand;
  ageMs: number;
  isEligible: boolean;
  label: string | null;
}

export function evaluateTimestampFreshness(
  datasetKey: string,
  timestamp: string | number | Date | null | undefined,
  referenceTimeMs: number = Date.now()
): EvaluatedFreshness {
  if (!timestamp) {
    return {
      band: "UNAVAILABLE",
      ageMs: Infinity,
      isEligible: false,
      label: "No timestamp",
    };
  }

  const timeMs =
    typeof timestamp === "number"
      ? (timestamp < 1e11 ? timestamp * 1000 : timestamp)
      : new Date(timestamp).getTime();

  if (isNaN(timeMs)) {
    return {
      band: "ERROR",
      ageMs: Infinity,
      isEligible: false,
      label: "Invalid timestamp",
    };
  }

  const ageMs = referenceTimeMs - timeMs;

  // Handle slight future clock skew (up to 5 mins ahead treated as LIVE)
  if (ageMs < 0) {
    return {
      band: "LIVE",
      ageMs: 0,
      isEligible: true,
      label: null,
    };
  }

  const config = DATASET_FRESHNESS_CONFIG[datasetKey] || DATASET_FRESHNESS_CONFIG.lobby_article_general;

  const isEligible = ageMs <= config.maxEligibilityAgeMs;

  let band: DataFreshnessBand;
  if (ageMs <= config.liveWindowMs) {
    band = "LIVE";
  } else if (ageMs <= config.recentWindowMs) {
    band = "RECENT";
  } else if (ageMs <= config.staleWindowMs) {
    band = "STALE";
  } else {
    band = "AGED";
  }

  // Label formatting
  let label: string | null = null;
  if (band === "RECENT" || band === "STALE" || band === "AGED") {
    const hours = Math.floor(ageMs / TIME_MS.HOUR);
    if (hours < 1) {
      const mins = Math.max(1, Math.floor(ageMs / TIME_MS.MINUTE));
      label = `${mins}m ago`;
    } else if (hours < 24) {
      label = `${hours}h ago`;
    } else {
      const days = Math.floor(hours / 24);
      label = `${days}d ago`;
    }
  }

  return {
    band,
    ageMs,
    isEligible,
    label,
  };
}

// ─── Coming Up Event Date Evaluation ──────────────────────────────────────────

export interface ComingUpEligibility {
  isUpcoming: boolean;
  eventDateUtc: string | null;
  reason: string;
}

/**
 * Evaluates whether an event is genuinely in the future or occurring today in UTC.
 * Strict rule: Any event whose primary_source_date is before today's start in UTC is PAST and REJECTED.
 */
export function evaluateComingUpEventEligibility(
  primarySourceDate: string | Date | null | undefined,
  nowUtc: Date = new Date()
): ComingUpEligibility {
  if (!primarySourceDate) {
    return {
      isUpcoming: false,
      eventDateUtc: null,
      reason: "Missing primary_source_date (cannot verify future catalyst)",
    };
  }

  const eventDate = typeof primarySourceDate === "string" ? new Date(primarySourceDate) : primarySourceDate;
  if (isNaN(eventDate.getTime())) {
    return {
      isUpcoming: false,
      eventDateUtc: null,
      reason: "Malformed primary_source_date",
    };
  }

  // Today's start in UTC (00:00:00.000)
  const todayStartUtc = new Date(Date.UTC(
    nowUtc.getUTCFullYear(),
    nowUtc.getUTCMonth(),
    nowUtc.getUTCDate(),
    0, 0, 0, 0
  ));

  // Max forward projection window: 30 days
  const maxFutureUtc = new Date(todayStartUtc.getTime() + 30 * TIME_MS.DAY);

  if (eventDate.getTime() < todayStartUtc.getTime()) {
    return {
      isUpcoming: false,
      eventDateUtc: eventDate.toISOString(),
      reason: `Event date (${eventDate.toISOString()}) has already passed relative to today UTC (${todayStartUtc.toISOString()})`,
    };
  }

  if (eventDate.getTime() > maxFutureUtc.getTime()) {
    return {
      isUpcoming: false,
      eventDateUtc: eventDate.toISOString(),
      reason: `Event date is beyond the 30-day forward horizon (${eventDate.toISOString()})`,
    };
  }

  return {
    isUpcoming: true,
    eventDateUtc: eventDate.toISOString(),
    reason: "Valid forward-looking catalyst",
  };
}

// ─── Signal Expiry & Freshness Check ──────────────────────────────────────────

export function isSignalEligibleForProduction(signal: {
  is_active: boolean;
  is_test?: boolean;
  data_classification?: string;
  created_at: string;
  expires_at: string;
  timeframe: string;
}, nowMs: number = Date.now()): boolean {
  if (!signal.is_active) return false;
  if (signal.is_test) return false;
  if (signal.data_classification && signal.data_classification !== "PRODUCTION_VERIFIED") return false;

  const expiresAtMs = new Date(signal.expires_at).getTime();
  if (isNaN(expiresAtMs) || expiresAtMs <= nowMs) {
    return false; // Hard expiry passed
  }

  const createdAtMs = new Date(signal.created_at).getTime();
  if (isNaN(createdAtMs)) return false;

  const maxAgeMs = getSignalFreshnessWindowMs(signal.timeframe);
  const ageMs = nowMs - createdAtMs;

  // If created_at is older than timeframe freshness window, signal is disqualified
  return ageMs <= maxAgeMs;
}
