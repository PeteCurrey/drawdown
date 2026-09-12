import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  evaluateDatasetFreshness,
  validateTimeSeries,
  buildDataHealthRecord,
  DATASET_FRESHNESS_THRESHOLDS_MS,
} from "../src/lib/market-data-health.ts";

const rootDir = path.resolve(import.meta.dirname, "..");

function readFile(relPath: string): string {
  return fs.readFileSync(path.join(rootDir, relPath), "utf8");
}

// ─── 1. Successful Fetch Classification ───────────────────────────────────────

test("Data Health 1: Successful fetch creates LIVE or RECENT record with proper metadata", () => {
  const now = Date.now();
  const record = buildDataHealthRecord({
    source: "twelvedata",
    dataset: "quote",
    symbol: "EUR/USD",
    last_attempted_fetch: new Date(now).toISOString(),
    last_successful_fetch: new Date(now - 10_000).toISOString(), // 10s ago
    last_record_timestamp: new Date(now - 10_000).toISOString(),
    record_count: 1,
    referenceTimeMs: now,
  });

  assert.equal(record.status, "LIVE");
  assert.equal(record.source, "twelvedata");
  assert.equal(record.is_synthetic, false);
  assert.equal(record.is_fallback, false);
  assert.equal(record.error_reason, null);
  assert.ok(record.freshness_age_ms !== null && record.freshness_age_ms <= 15_000);
});

// ─── 2. Failed Fetch Handling ─────────────────────────────────────────────────

test("Data Health 2: Failed fetch records ERROR or UNAVAILABLE status with specific error reason", () => {
  const now = Date.now();
  const record = buildDataHealthRecord({
    source: "twelvedata",
    dataset: "quote",
    symbol: "GBP/USD",
    last_attempted_fetch: new Date(now).toISOString(),
    last_successful_fetch: null,
    error_reason: "NETWORK_ERROR",
    referenceTimeMs: now,
  });

  assert.equal(record.status, "ERROR");
  assert.equal(record.error_reason, "NETWORK_ERROR");
  assert.equal(record.last_successful_fetch, null);
});

// ─── 3. Timeout Classification ────────────────────────────────────────────────

test("Data Health 3: Timeout error maps to ERROR status with TIMEOUT reason", () => {
  const now = Date.now();
  const record = buildDataHealthRecord({
    source: "yahoo_finance",
    dataset: "quote",
    symbol: "US30",
    error_reason: "TIMEOUT",
    referenceTimeMs: now,
  });

  assert.equal(record.status, "ERROR");
  assert.equal(record.error_reason, "TIMEOUT");
});

// ─── 4. Empty Response Handling ───────────────────────────────────────────────

test("Data Health 4: Empty response is distinguished from network failure", () => {
  const now = Date.now();
  const emptyRecord = buildDataHealthRecord({
    source: "finnhub",
    dataset: "economic_calendar",
    record_count: 0,
    error_reason: "EMPTY_RESPONSE",
    referenceTimeMs: now,
  });

  assert.equal(emptyRecord.status, "ERROR");
  assert.equal(emptyRecord.error_reason, "EMPTY_RESPONSE");
  assert.equal(emptyRecord.record_count, 0);
});

// ─── 5. Malformed Response Handling ───────────────────────────────────────────

test("Data Health 5: Malformed JSON or corrupted payload flags MALFORMED_RESPONSE", () => {
  const now = Date.now();
  const malformedRecord = buildDataHealthRecord({
    source: "twelvedata",
    dataset: "quote",
    symbol: "XAU/USD",
    error_reason: "MALFORMED_RESPONSE",
    referenceTimeMs: now,
  });

  assert.equal(malformedRecord.status, "ERROR");
  assert.equal(malformedRecord.error_reason, "MALFORMED_RESPONSE");
});

// ─── 6. Stale Data Classification ─────────────────────────────────────────────

test("Data Health 6: Records older than dataset threshold are classified as STALE", () => {
  const now = Date.now();
  // For quote: 5m to 15m is STALE
  const staleQuoteTime = new Date(now - 8 * 60 * 1000).toISOString(); // 8 mins ago
  const status = evaluateDatasetFreshness("quote", staleQuoteTime, now);
  assert.equal(status, "STALE");

  // For daily candles: 72h to 96h is STALE
  const staleDailyTime = new Date(now - 80 * 60 * 60 * 1000).toISOString();
  const dailyStatus = evaluateDatasetFreshness("daily_candles", staleDailyTime, now);
  assert.equal(dailyStatus, "STALE");
});

// ─── 7. Recent Data Classification ────────────────────────────────────────────

test("Data Health 7: Records within secondary refresh window are classified as RECENT", () => {
  const now = Date.now();
  // For quote: 1m to 5m is RECENT
  const recentQuoteTime = new Date(now - 3 * 60 * 1000).toISOString(); // 3 mins ago
  const status = evaluateDatasetFreshness("quote", recentQuoteTime, now);
  assert.equal(status, "RECENT");
});

// ─── 8. Live Data Classification ──────────────────────────────────────────────

test("Data Health 8: Records within primary refresh window are classified as LIVE", () => {
  const now = Date.now();
  // For quote: < 1m is LIVE
  const liveQuoteTime = new Date(now - 30 * 1000).toISOString(); // 30s ago
  const status = evaluateDatasetFreshness("quote", liveQuoteTime, now);
  assert.equal(status, "LIVE");
});

// ─── 9. Partial Data Detection ────────────────────────────────────────────────

test("Data Health 9: Time-series validator detects missing fields and non-numeric prices", () => {
  const now = Math.floor(Date.now() / 1000);
  const corruptedBars = [
    { time: now - 300, open: 1.25, high: 1.26, low: 1.24, close: 1.255 },
    { time: now - 240, open: NaN, high: 1.26, low: 1.24, close: 1.255 }, // NaN open
    { time: now - 180, open: 1.255, high: 1.27, low: 1.25, close: 1.265 },
  ];

  const validation = validateTimeSeries(corruptedBars);
  assert.equal(validation.isValid, false);
  assert.ok(validation.errors.some(e => e.includes("NaN or non-numeric")));
});

// ─── 10. Missing Timestamp Validation ─────────────────────────────────────────

test("Data Health 10: Time-series validator rejects bars with missing/invalid timestamps", () => {
  const corruptedBars = [
    { time: "invalid_time", open: 1.25, high: 1.26, low: 1.24, close: 1.255 },
  ];

  const validation = validateTimeSeries(corruptedBars);
  assert.equal(validation.isValid, false);
  assert.ok(validation.errors.some(e => e.includes("invalid/NaN timestamp")));
});

// ─── 11. Duplicate Timestamp Detection ────────────────────────────────────────

test("Data Health 11: Time-series validator catches duplicate timestamps in bar sequences", () => {
  const now = 1700000000;
  const duplicateBars = [
    { time: now, open: 1.25, high: 1.26, low: 1.24, close: 1.255 },
    { time: now + 60, open: 1.255, high: 1.27, low: 1.25, close: 1.265 },
    { time: now + 60, open: 1.256, high: 1.272, low: 1.251, close: 1.266 }, // Duplicate timestamp
  ];

  const validation = validateTimeSeries(duplicateBars);
  assert.equal(validation.isValid, false);
  assert.equal(validation.duplicateCount, 1);
  assert.ok(validation.errors.some(e => e.includes("Duplicate timestamp")));
});

// ─── 12. Invalid OHLC Validation (High < Low, etc.) ───────────────────────────

test("Data Health 12: Time-series validator rejects impossible OHLC relationships", () => {
  const now = 1700000000;
  // High < Low is mathematically impossible in financial markets
  const invertedBars = [
    { time: now, open: 1.25, high: 1.20, low: 1.30, close: 1.25 },
  ];

  const validation = validateTimeSeries(invertedBars);
  assert.equal(validation.isValid, false);
  assert.equal(validation.hasInvertedOHLC, true);
  assert.ok(validation.errors.some(e => e.includes("strictly lower than Low")));
});

// ─── 13. Cache Expiry Handling ────────────────────────────────────────────────

test("Data Health 13: useMarketCache marks prices older than 15 minutes as stale/unresolved", () => {
  const hookSource = readFile("src/hooks/useMarketCache.ts");
  assert.ok(
    hookSource.includes("ageMs < 900_000"),
    "useMarketCache must enforce 15 minute (900,000ms) cache validity window"
  );
  assert.ok(
    hookSource.includes('freshness: "LIVE" | "RECENT" | "STALE" | "UNAVAILABLE"'),
    "useMarketCache must compute semantic freshness"
  );
});

// ─── 14. Fallback Behaviour & Explicit Tagging ────────────────────────────────

test("Data Health 14: Fallbacks must never be silent and must be explicitly tagged", () => {
  const marketSource = readFile("src/lib/market.ts");
  const historyRoute = readFile("src/app/api/market/history/route.ts");
  const scannerSource = readFile("src/components/dashboard/ScannerClient.tsx");

  // market.ts must tag synthetic history
  assert.ok(
    marketSource.includes("is_synthetic: true"),
    "getMarketHistory must tag fallback candles with is_synthetic: true"
  );

  // history route must expose x-is-synthetic and x-data-source headers
  assert.ok(
    historyRoute.includes('"x-is-synthetic"'),
    "API history route must expose x-is-synthetic header"
  );
  assert.ok(
    historyRoute.includes('"x-data-source"'),
    "API history route must expose x-data-source header"
  );

  // Scanner must show FEED OFFLINE when sentiment provider fails
  assert.ok(
    scannerSource.includes("FEED OFFLINE"),
    "Scanner fundamentals tab must display FEED OFFLINE when sentiment fails"
  );
});

// ─── 15. Scheduled Job Failure Recording ──────────────────────────────────────

test("Data Health 15: update-prices cron monitors success rate and alerts on drop below threshold", () => {
  const cronSource = readFile("src/app/api/cron/update-prices/route.ts");
  assert.ok(
    cronSource.includes("SUCCESS_THRESHOLD = 0.8"),
    "update-prices cron must check 80% threshold"
  );
  assert.ok(
    cronSource.includes("sendLowSuccessAlert"),
    "update-prices cron must send low success alert on failure"
  );
});

// ─── 16. Recovery After Failure ───────────────────────────────────────────────

test("Data Health 16: Synthetic fallback data is cached for max 60s to ensure immediate recovery", () => {
  const marketSource = readFile("src/lib/market.ts");
  assert.ok(
    marketSource.includes("await setCacheData(cacheKey, fallback, 60);"),
    "Synthetic fallback history must only be cached for 60s to allow rapid live recovery"
  );
});

// ─── 17. Dataset-Aware Semantic Freshness ─────────────────────────────────────

test("Data Health 17: Freshness thresholds differ semantically between quotes and economic calendar", () => {
  const quoteThreshold = DATASET_FRESHNESS_THRESHOLDS_MS.quote.liveWindowMs;
  const calendarThreshold = DATASET_FRESHNESS_THRESHOLDS_MS.economic_calendar.liveWindowMs;

  // Real-time quotes have a 1-minute live window, whereas economic releases have a 24-hour live window
  assert.equal(quoteThreshold, 60 * 1000);
  assert.equal(calendarThreshold, 24 * 60 * 60 * 1000);
  assert.ok(calendarThreshold > quoteThreshold, "Calendar live window must exceed quote live window");
});

// ─── 18. Security & Zero Secret Leakage ───────────────────────────────────────

test("Data Health 18: buildDataHealthRecord sanitizes credentials and health API exposes zero secrets", () => {
  const secretKey = "td_live_secret_key_1234567890abcdef";
  const record = buildDataHealthRecord({
    source: `twelvedata_${secretKey}`,
    dataset: "quote",
  });

  assert.ok(!record.source.includes(secretKey), "API key must not appear in health record source");
  assert.ok(record.source.includes("[REDACTED]"), "API key must be redacted in health record source");

  const healthApi = readFile("src/app/api/health/market-data/route.ts");
  assert.ok(!healthApi.includes("process.env.TWELVEDATA_API_KEY ? process.env.TWELVEDATA_API_KEY"), "Health API must never echo API keys");
});
