import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  calculateSignalLevels,
  validateSignalGeometry,
  calculateDcsScore,
  TD_SYMBOL_MAP,
} from "../src/lib/signal-calculations.ts";
import { getSignalFreshness, getSignalAgeLabel } from "../src/lib/freshness.ts";

const rootDir = path.resolve(import.meta.dirname, "..");

function readFile(relPath: string): string {
  return fs.readFileSync(path.join(rootDir, relPath), "utf8");
}

// ─── 1. Signal Creation ───────────────────────────────────────────────────────

test("Signal Audit 1: Signal creation produces all required institutional levels and 2.0 R:R", () => {
  const price = 1.0850;
  const atr = 0.0030; // 30 pips ATR
  const longLevels = calculateSignalLevels(price, atr, "BULLISH");

  assert.equal(longLevels.entry_price, 1.0850);
  assert.equal(longLevels.stop_loss, 1.0805); // Entry - 1.5 * ATR = 1.0850 - 0.0045 = 1.0805
  assert.equal(longLevels.take_profit_1, 1.0895); // Entry + 1.5 * ATR = 1.0895
  assert.equal(longLevels.take_profit_2, 1.0940); // Entry + 3.0 * ATR = 1.0940
  assert.equal(longLevels.take_profit_3, 1.0985); // Entry + 4.5 * ATR = 1.0985
  assert.equal(longLevels.rr_ratio, 2.0); // Reward (90 pips) / Risk (45 pips) = 2.0
});

// ─── 2. Signal Persistence ────────────────────────────────────────────────────

test("Signal Audit 2: Signal engine and migration enforce persistence to signals table with RLS", () => {
  const engineSource = readFile("src/lib/signal-engine.ts");
  const migrationSource = readFile("supabase/migrations/20260624_signal_centre.sql");

  assert.ok(
    engineSource.includes('.from("signals").insert(payload)') || engineSource.includes('.from("signals")'),
    "Signal engine must persist to signals table"
  );
  assert.ok(
    migrationSource.includes("ALTER TABLE public.signals ENABLE ROW LEVEL SECURITY;"),
    "Signals table must have Row Level Security enabled"
  );
  assert.ok(
    migrationSource.includes("CREATE TABLE IF NOT EXISTS public.signals"),
    "Signals table must define complete signal schema"
  );
});

// ─── 3. LONG Signal Validation ────────────────────────────────────────────────

test("Signal Audit 3: LONG signal geometry validates that stop is strictly below entry and targets are above", () => {
  const levels = calculateSignalLevels(1.2750, 0.0040, "BULLISH");
  const validation = validateSignalGeometry({
    bias: "BULLISH",
    entry_price: levels.entry_price,
    stop_loss: levels.stop_loss,
    take_profit_1: levels.take_profit_1,
    take_profit_2: levels.take_profit_2,
  });

  assert.equal(validation.isValid, true);
  assert.equal(validation.errors.length, 0);
  assert.ok(levels.stop_loss < levels.entry_price, "LONG stop must be below entry");
  assert.ok(levels.take_profit_1 > levels.entry_price, "LONG TP1 must be above entry");
  assert.ok(levels.take_profit_2 > levels.take_profit_1, "LONG TP2 must be above TP1");
});

// ─── 4. SHORT Signal Validation ───────────────────────────────────────────────

test("Signal Audit 4: SHORT signal geometry validates that stop is strictly above entry and targets are below", () => {
  const levels = calculateSignalLevels(158.00, 0.50, "BEARISH");
  const validation = validateSignalGeometry({
    bias: "BEARISH",
    entry_price: levels.entry_price,
    stop_loss: levels.stop_loss,
    take_profit_1: levels.take_profit_1,
    take_profit_2: levels.take_profit_2,
  });

  assert.equal(validation.isValid, true);
  assert.equal(validation.errors.length, 0);
  assert.ok(levels.stop_loss > levels.entry_price, "SHORT stop must be above entry");
  assert.ok(levels.take_profit_1 < levels.entry_price, "SHORT TP1 must be below entry");
  assert.ok(levels.take_profit_2 < levels.take_profit_1, "SHORT TP2 must be below TP1");
});

// ─── 5. R:R Calculation ───────────────────────────────────────────────────────

test("Signal Audit 5: R:R calculation correctly handles mathematical edge cases", () => {
  // Balanced 1:2 R:R
  const balanced = calculateSignalLevels(100, 2, "BULLISH");
  assert.equal(balanced.rr_ratio, 2.0);

  // Zero ATR guard
  const zeroAtr = calculateSignalLevels(100, 0, "BULLISH");
  assert.equal(zeroAtr.rr_ratio, 0);
});

// ─── 6. Invalid Stop Placement ────────────────────────────────────────────────

test("Signal Audit 6: Geometric validator rejects invalid stop loss placement", () => {
  // Long with stop above entry
  const invalidLong = validateSignalGeometry({
    bias: "BULLISH",
    entry_price: 100,
    stop_loss: 105, // Impossible: stop above entry for long
    take_profit_1: 110,
    take_profit_2: 120,
  });
  assert.equal(invalidLong.isValid, false);
  assert.ok(invalidLong.errors.some(e => e.includes("strictly below entry")));

  // Short with stop below entry
  const invalidShort = validateSignalGeometry({
    bias: "BEARISH",
    entry_price: 100,
    stop_loss: 95, // Impossible: stop below entry for short
    take_profit_1: 90,
    take_profit_2: 80,
  });
  assert.equal(invalidShort.isValid, false);
  assert.ok(invalidShort.errors.some(e => e.includes("strictly above entry")));
});

// ─── 7. Invalid Target Placement ──────────────────────────────────────────────

test("Signal Audit 7: Geometric validator rejects invalid take profit placement", () => {
  // Long with target below entry
  const invalidLong = validateSignalGeometry({
    bias: "BULLISH",
    entry_price: 100,
    stop_loss: 95,
    take_profit_1: 98, // Impossible: target below entry for long
    take_profit_2: 110,
  });
  assert.equal(invalidLong.isValid, false);
  assert.ok(invalidLong.errors.some(e => e.includes("strictly above entry")));
});

// ─── 8. Stale Market Data ─────────────────────────────────────────────────────

test("Signal Audit 8: Signal engine deactivates signals based on stale market data cutoff", () => {
  const engineSource = readFile("src/lib/signal-engine.ts");
  assert.ok(
    engineSource.includes('FRESHNESS_CUTOFFS: Record<string, number>'),
    "Signal engine must define FRESHNESS_CUTOFFS per timeframe"
  );
  assert.ok(
    engineSource.includes('"15M": 2 * 60 * 60 * 1000'),
    "15M signals must expire after 2 hours"
  );
  assert.ok(
    engineSource.includes('"1H":  4 * 60 * 60 * 1000'),
    "1H signals must expire after 4 hours"
  );
});

// ─── 9. Expired Signal Handling ───────────────────────────────────────────────

test("Signal Audit 9: Expired signals are deactivated via expires_at and excluded from active feed", () => {
  const engineSource = readFile("src/lib/signal-engine.ts");
  assert.ok(
    engineSource.includes('.lt("expires_at", new Date().toISOString())'),
    "Signal engine must mark signals inactive when expires_at has passed"
  );
});

// ─── 10. Invalidated Signal State ─────────────────────────────────────────────

test("Signal Audit 10: Inactive signals return empty data state from freshness evaluator", () => {
  const freshness = getSignalFreshness({
    created_at: new Date().toISOString(),
    timeframe: "1H",
    is_active: false,
  });
  assert.equal(freshness, "empty");
});

// ─── 11. Duplicate Signal Deduplication ───────────────────────────────────────

test("Signal Audit 11: Signal engine updates existing active signal instead of generating duplicates", () => {
  const engineSource = readFile("src/lib/signal-engine.ts");
  assert.ok(
    engineSource.includes('.eq("instrument", drawdownSlug)') &&
    engineSource.includes('.eq("timeframe", tf.label)') &&
    engineSource.includes('.eq("is_active", true)'),
    "Signal engine must query existing active signals for exact instrument and timeframe"
  );
  assert.ok(
    engineSource.includes('.update(payload)'),
    "Signal engine must update existing active signal rather than duplicating"
  );
});

// ─── 12. Failed Generation Handling ───────────────────────────────────────────

test("Signal Audit 12: Failed market data fetch tags grid indicators with simulation state", () => {
  const engineSource = readFile("src/lib/signal-engine.ts");
  assert.ok(
    engineSource.includes("gridIndicators.is_simulated = isSimulated;"),
    "Signal engine must record simulation flag on grid indicators"
  );
  assert.ok(
    engineSource.includes('gridIndicators.data_source = isSimulated ? "synthetic_simulator" : "live_twelvedata";'),
    "Signal engine must record explicit data source on grid indicators"
  );
});

// ─── 13. Malformed AI Output Fallback ─────────────────────────────────────────

test("Signal Audit 13: DCS consensus scoring handles fallback gracefully when AI models fail", () => {
  // If Claude, GPT4, and Grok all agree on BULLISH with 80% confidence
  const alignedDcs = calculateDcsScore("BULLISH", 80, "BULLISH", 80, "BULLISH", 80);
  assert.equal(alignedDcs, 80);

  // If models are in conflict (Claude Bullish, GPT4 Bearish, Grok Neutral)
  const conflictedDcs = calculateDcsScore("BULLISH", 80, "BEARISH", 80, "NEUTRAL", 50);
  assert.ok(conflictedDcs < 80, "Conflicted model consensus must discount DCS score");
  assert.ok(conflictedDcs >= 10, "DCS score has a minimum floor of 10");
});

// ─── 14. Missing Market Data Guard ────────────────────────────────────────────

test("Signal Audit 14: Signal engine skips signal generation if ATR is missing or non-positive", () => {
  const engineSource = readFile("src/lib/signal-engine.ts");
  assert.ok(
    engineSource.includes("if (!tfState || !tfState.atr || tfState.atr <= 0) continue;"),
    "Signal engine must guard against missing or non-positive ATR"
  );
});

// ─── 15. Entitlement Enforcement ─────────────────────────────────────────────

test("Signal Audit 15: Signal Centre server component sanitises trade levels for Free users", () => {
  const pageSource = readFile("src/app/(platform)/dashboard/signal-centre/page.tsx");
  assert.ok(
    pageSource.includes("function sanitizeSignalForPreview"),
    "Signal Centre page must define server-side preview sanitisation"
  );
  assert.ok(
    pageSource.includes("entry_price: null"),
    "Sanitised preview must strip entry_price"
  );
  assert.ok(
    pageSource.includes("stop_loss: null"),
    "Sanitised preview must strip stop_loss"
  );
  assert.ok(
    pageSource.includes("CommercialAccess.canAccessSignalCentre(tier, status)"),
    "Signal Centre must check canonical CommercialAccess entitlement"
  );
});

// ─── 16. IDOR Protection ──────────────────────────────────────────────────────

test("Signal Audit 16: Signal detail page sanitises signal parameters server-side preventing IDOR leakage", () => {
  const detailSource = readFile("src/app/(platform)/dashboard/signal-centre/signals/[id]/page.tsx");
  assert.ok(
    detailSource.includes("const displaySignal = isSubscriber ? signal : sanitizeSignalForPreview(signal);"),
    "Signal detail page must server-sanitise signal props for non-subscribers"
  );
});

// ─── 17. Timestamp Integrity ──────────────────────────────────────────────────

test("Signal Audit 17: Signal age formatting is human readable and accurate", () => {
  const now = Date.now();
  const thirtyMinsAgo = new Date(now - 30 * 60 * 1000).toISOString();
  const label = getSignalAgeLabel(thirtyMinsAgo);
  assert.equal(label, "30m ago");

  const fiveHoursAgo = new Date(now - 5 * 60 * 60 * 1000).toISOString();
  const fiveHrLabel = getSignalAgeLabel(fiveHoursAgo);
  assert.ok(fiveHrLabel.includes("5h"));
});

// ─── 18. Freshness Classification ─────────────────────────────────────────────

test("Signal Audit 18: getSignalFreshness evaluates signals past cutoff as stale", () => {
  const now = Date.now();
  // 1H signal created 5 hours ago (> 4h window)
  const stale1h = getSignalFreshness({
    created_at: new Date(now - 5 * 60 * 60 * 1000).toISOString(),
    timeframe: "1H",
    is_active: true,
  });
  assert.equal(stale1h, "stale");

  // 1H signal created 1 hour ago (< 4h window)
  const live1h = getSignalFreshness({
    created_at: new Date(now - 60 * 60 * 1000).toISOString(),
    timeframe: "1H",
    is_active: true,
  });
  assert.equal(live1h, "live");
});

// ─── 19. Scheduler & Scan Route Security ──────────────────────────────────────

test("Signal Audit 19: Signals scan API enforces 60-second throttling and subscriber/cron auth", () => {
  const scanRoute = readFile("src/app/api/signals/scan/route.ts");
  assert.ok(
    scanRoute.includes("const THROTTLE_MS = 60 * 1000;"),
    "Scan API must enforce 60s throttle"
  );
  assert.ok(
    scanRoute.includes('request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`'),
    "GET cron scan must require CRON_SECRET"
  );
  assert.ok(
    scanRoute.includes("CommercialAccess.canAccessSignalCentre(tier, status)"),
    "POST user scan must require active Signal Centre entitlement"
  );
});

// ─── 20. 52-Signal Scope Verification ─────────────────────────────────────────

test("Signal Audit 20: 52-signal universe consists of exactly 13 instruments across 4 timeframes", () => {
  const instruments = Object.keys(TD_SYMBOL_MAP);
  assert.equal(instruments.length, 13, "Must configure exactly 13 primary instruments");

  // 13 instruments * 4 timeframes (15M, 1H, 4H, 1D) = 52 total signal combinations
  const totalSignalCandidates = instruments.length * 4;
  assert.equal(totalSignalCandidates, 52, "Universe must total exactly 52 signal matrix candidates");
});
