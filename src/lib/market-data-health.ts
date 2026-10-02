/**
 * Drawdown Trading — Market Data Health & Reliability Engine
 *
 * Provides authoritative metadata, semantic dataset-aware freshness classification,
 * time-series validation, and health state inspection across all platform market data feeds.
 *
 * Core Principle:
 * The platform must always know whether data is LIVE, RECENT, STALE, UNAVAILABLE, or ERROR.
 * Never silently disguise stale or synthetic fallback data as live verified data.
 */

export type DataFreshnessState =
  | "LIVE"
  | "RECENT"
  | "STALE"
  | "UNAVAILABLE"
  | "ERROR";

export type MarketDatasetType =
  | "quote"               // Real-time / tick quotes (10s - 30s frequency)
  | "intraday_candles"   // 1m - 15m candles
  | "hourly_candles"     // 1h - 4h candles
  | "daily_candles"      // 1D candles (accounts for market close / weekends)
  | "economic_calendar"  // Macroeconomic releases & events
  | "earnings_calendar"  // Corporate earnings dates
  | "daily_brief"        // Pete's Morning/Evening market briefs
  | "sentiment"          // Retail and news sentiment
  | "sec_filings";       // Congressional / Insider filings

export interface FreshnessWindow {
  liveWindowMs: number;
  recentWindowMs: number;
  staleWindowMs: number;
}

/**
 * Authoritative semantic freshness thresholds per dataset.
 * Prevents arbitrary global timeouts that falsely flag normal market behaviour.
 */
export const DATASET_FRESHNESS_THRESHOLDS_MS: Record<MarketDatasetType, FreshnessWindow> = {
  quote: {
    liveWindowMs: 60 * 1000,            // < 1 min = LIVE
    recentWindowMs: 5 * 60 * 1000,      // 1m - 5m = RECENT
    staleWindowMs: 15 * 60 * 1000,      // 5m - 15m = STALE (> 15m = UNAVAILABLE)
  },
  intraday_candles: {
    liveWindowMs: 15 * 60 * 1000,       // < 15 min
    recentWindowMs: 60 * 60 * 1000,     // 15m - 1 hour
    staleWindowMs: 3 * 60 * 60 * 1000,  // 1h - 3 hours
  },
  hourly_candles: {
    liveWindowMs: 4 * 60 * 60 * 1000,   // < 4 hours
    recentWindowMs: 12 * 60 * 60 * 1000,// 4h - 12 hours
    staleWindowMs: 24 * 60 * 60 * 1000, // 12h - 24 hours
  },
  daily_candles: {
    liveWindowMs: 26 * 60 * 60 * 1000,  // < 26 hours (daily close buffer)
    recentWindowMs: 72 * 60 * 60 * 1000,// Weekend gap tolerance
    staleWindowMs: 96 * 60 * 60 * 1000, // > 4 days = STALE
  },
  economic_calendar: {
    liveWindowMs: 24 * 60 * 60 * 1000,  // < 1 day
    recentWindowMs: 72 * 60 * 60 * 1000,// 1d - 3 days
    staleWindowMs: 7 * 24 * 60 * 60 * 1000, // Up to 7 days
  },
  earnings_calendar: {
    liveWindowMs: 24 * 60 * 60 * 1000,
    recentWindowMs: 72 * 60 * 60 * 1000,
    staleWindowMs: 14 * 24 * 60 * 60 * 1000,
  },
  daily_brief: {
    liveWindowMs: 26 * 60 * 60 * 1000,  // 26 hours (morning to next morning)
    recentWindowMs: 36 * 60 * 60 * 1000,
    staleWindowMs: 48 * 60 * 60 * 1000,
  },
  sentiment: {
    liveWindowMs: 2 * 60 * 60 * 1000,   // < 2 hours
    recentWindowMs: 6 * 60 * 60 * 1000, // 2h - 6 hours
    staleWindowMs: 24 * 60 * 60 * 1000, // 6h - 24 hours
  },
  sec_filings: {
    liveWindowMs: 24 * 60 * 60 * 1000,
    recentWindowMs: 72 * 60 * 60 * 1000,
    staleWindowMs: 30 * 24 * 60 * 60 * 1000,
  },
};

export interface MarketDataHealthRecord {
  source: string;
  dataset: MarketDatasetType;
  symbol?: string;
  timeframe?: string;
  status: DataFreshnessState;
  last_successful_fetch: string | null;
  last_attempted_fetch: string;
  last_record_timestamp?: string | null;
  record_count: number;
  freshness_age_ms: number | null;
  is_synthetic: boolean;
  is_fallback: boolean;
  error_reason?: "TIMEOUT" | "RATE_LIMIT" | "AUTH_FAILURE" | "MALFORMED_RESPONSE" | "EMPTY_RESPONSE" | "NETWORK_ERROR" | "PROVIDER_OFFLINE" | null;
  validation_errors?: string[];
}

export interface OHLCBar {
  time: number | string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface TimeSeriesValidationResult {
  isValid: boolean;
  barCount: number;
  errors: string[];
  duplicateCount: number;
  hasFutureTimestamps: boolean;
  hasInvertedOHLC: boolean;
  isChronological: boolean;
}

/**
 * Evaluates semantic dataset-aware freshness for a given record timestamp.
 */
export function evaluateDatasetFreshness(
  dataset: MarketDatasetType,
  recordTimestamp: string | number | Date | null | undefined,
  referenceTimeMs: number = Date.now()
): DataFreshnessState {
  if (!recordTimestamp) {
    return "UNAVAILABLE";
  }

  const recordTimeMs =
    typeof recordTimestamp === "number"
      ? (recordTimestamp < 1e11 ? recordTimestamp * 1000 : recordTimestamp)
      : new Date(recordTimestamp).getTime();

  if (isNaN(recordTimeMs)) {
    return "ERROR";
  }

  const ageMs = referenceTimeMs - recordTimeMs;

  // If timestamp is in the future by more than 2 minutes (allow clock drift)
  if (ageMs < -120_000) {
    return "ERROR";
  }

  const thresholds = DATASET_FRESHNESS_THRESHOLDS_MS[dataset] || DATASET_FRESHNESS_THRESHOLDS_MS.quote;

  if (ageMs <= thresholds.liveWindowMs) {
    return "LIVE";
  }
  if (ageMs <= thresholds.recentWindowMs) {
    return "RECENT";
  }
  if (ageMs <= thresholds.staleWindowMs) {
    return "STALE";
  }
  return "UNAVAILABLE";
}

/**
 * Validates a time series of OHLC bars against financial data integrity rules:
 * - Chronological ordering (oldest to newest)
 * - Duplicate timestamps
 * - Future timestamps
 * - Valid OHLC bounds (High >= Open, Close, Low; Low <= Open, Close, High)
 * - Non-negative, non-NaN prices
 */
export function validateTimeSeries(
  bars: OHLCBar[],
  referenceTimeMs: number = Date.now()
): TimeSeriesValidationResult {
  const errors: string[] = [];
  let duplicateCount = 0;
  let hasFutureTimestamps = false;
  let hasInvertedOHLC = false;
  let isChronological = true;

  if (!Array.isArray(bars) || bars.length === 0) {
    return {
      isValid: false,
      barCount: 0,
      errors: ["Empty or non-array bars passed to time-series validator."],
      duplicateCount: 0,
      hasFutureTimestamps: false,
      hasInvertedOHLC: false,
      isChronological: true,
    };
  }

  const seenTimestamps = new Set<number>();
  let previousTimestamp = -Infinity;

  for (let i = 0; i < bars.length; i++) {
    const bar = bars[i];
    const timeMs =
      typeof bar.time === "number"
        ? (bar.time < 1e11 ? bar.time * 1000 : bar.time)
        : new Date(bar.time).getTime();

    if (isNaN(timeMs)) {
      errors.push(`Bar ${i} has invalid/NaN timestamp: ${bar.time}`);
      continue;
    }

    // Check future timestamp (allow 2m clock drift)
    if (timeMs > referenceTimeMs + 120_000) {
      hasFutureTimestamps = true;
      errors.push(`Bar ${i} has future timestamp: ${new Date(timeMs).toISOString()}`);
    }

    // Check duplicates
    if (seenTimestamps.has(timeMs)) {
      duplicateCount++;
      errors.push(`Duplicate timestamp detected at index ${i} (${timeMs})`);
    } else {
      seenTimestamps.add(timeMs);
    }

    // Check chronological order
    if (timeMs < previousTimestamp) {
      isChronological = false;
      errors.push(`Chronological ordering violation at index ${i}: ${timeMs} < ${previousTimestamp}`);
    }
    previousTimestamp = timeMs;

    // Check OHLC values
    const { open, high, low, close } = bar;
    if (
      typeof open !== "number" || isNaN(open) ||
      typeof high !== "number" || isNaN(high) ||
      typeof low !== "number" || isNaN(low) ||
      typeof close !== "number" || isNaN(close)
    ) {
      errors.push(`Bar ${i} contains NaN or non-numeric OHLC price.`);
      continue;
    }

    if (open <= 0 || high <= 0 || low <= 0 || close <= 0) {
      errors.push(`Bar ${i} contains non-positive price (O:${open} H:${high} L:${low} C:${close}).`);
    }

    // Mathematical OHLC boundary checks
    if (high < low) {
      hasInvertedOHLC = true;
      errors.push(`Bar ${i} has High (${high}) strictly lower than Low (${low}).`);
    }
    if (high < open || high < close) {
      hasInvertedOHLC = true;
      errors.push(`Bar ${i} High (${high}) is less than Open (${open}) or Close (${close}).`);
    }
    if (low > open || low > close) {
      hasInvertedOHLC = true;
      errors.push(`Bar ${i} Low (${low}) is greater than Open (${open}) or Close (${close}).`);
    }
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    barCount: bars.length,
    errors,
    duplicateCount,
    hasFutureTimestamps,
    hasInvertedOHLC,
    isChronological,
  };
}

/**
 * Factory to build a standardized, sanitized MarketDataHealthRecord.
 * Automatically strips any API keys, credentials, or sensitive headers.
 */
export function buildDataHealthRecord(params: {
  source: string;
  dataset: MarketDatasetType;
  symbol?: string;
  timeframe?: string;
  last_successful_fetch?: string | null;
  last_attempted_fetch?: string;
  last_record_timestamp?: string | null;
  record_count?: number;
  is_synthetic?: boolean;
  is_fallback?: boolean;
  error_reason?: MarketDataHealthRecord["error_reason"];
  validation_errors?: string[];
  referenceTimeMs?: number;
}): MarketDataHealthRecord {
  const refTime = params.referenceTimeMs ?? Date.now();
  const lastAttempted = params.last_attempted_fetch ?? new Date(refTime).toISOString();
  const isSynthetic = Boolean(params.is_synthetic);
  const isFallback = Boolean(params.is_fallback);

  let status: DataFreshnessState = "UNAVAILABLE";
  let freshnessAgeMs: number | null = null;

  if (params.error_reason) {
    status = params.error_reason === "PROVIDER_OFFLINE" || params.error_reason === "RATE_LIMIT"
      ? "UNAVAILABLE"
      : "ERROR";
  } else if (params.validation_errors && params.validation_errors.length > 0) {
    status = "ERROR";
  } else if (isSynthetic) {
    // Synthetic data is strictly classified as UNAVAILABLE for real trading
    status = "UNAVAILABLE";
  } else if (params.last_record_timestamp) {
    status = evaluateDatasetFreshness(params.dataset, params.last_record_timestamp, refTime);
    const recMs = new Date(params.last_record_timestamp).getTime();
    if (!isNaN(recMs)) {
      freshnessAgeMs = Math.max(0, refTime - recMs);
    }
  } else if (params.last_successful_fetch) {
    status = evaluateDatasetFreshness(params.dataset, params.last_successful_fetch, refTime);
    const fetchMs = new Date(params.last_successful_fetch).getTime();
    if (!isNaN(fetchMs)) {
      freshnessAgeMs = Math.max(0, refTime - fetchMs);
    }
  }

  // Sanitize source string to ensure no accidental key exposure
  const sanitizedSource = (params.source || "unknown").replace(/([a-zA-Z0-9_-]{16,})/g, "[REDACTED]");

  return {
    source: sanitizedSource,
    dataset: params.dataset,
    symbol: params.symbol,
    timeframe: params.timeframe,
    status,
    last_successful_fetch: params.last_successful_fetch ?? null,
    last_attempted_fetch: lastAttempted,
    last_record_timestamp: params.last_record_timestamp ?? null,
    record_count: params.record_count ?? 0,
    freshness_age_ms: freshnessAgeMs,
    is_synthetic: isSynthetic,
    is_fallback: isFallback,
    error_reason: params.error_reason ?? null,
    validation_errors: params.validation_errors,
  };
}
