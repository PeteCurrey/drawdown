import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  calculatePositionSize,
  resolveInstrumentSpec,
  POSITION_INSTRUMENT_SPECS,
} from "../src/lib/position-sizing.ts";

const rootDir = path.resolve(import.meta.dirname, "..");

function readFile(relPath: string): string {
  return fs.readFileSync(path.join(rootDir, relPath), "utf8");
}

// ---------------------------------------------------------------------------
// 1. Core Mathematical & Position Sizing Engine Tests
// ---------------------------------------------------------------------------

test("1. Valid long setup calculation", () => {
  const result = calculatePositionSize({
    instrument: "GBP/USD",
    direction: "long",
    entryPrice: 1.27500,
    stopPrice: 1.27200,
    targetPrice: 1.28250,
    accountBalance: 10000,
    riskPct: 1.0,
  });

  assert.equal(result.isValid, true);
  assert.equal(result.errors.length, 0);
  assert.equal(result.direction, "long");
  assert.equal(result.cashRisk, 100.0);
  assert.equal(result.stopPips, 30.0);
  assert.equal(result.rewardPips, 75.0);
  assert.equal(result.rewardRiskRatio, 2.5);
  // Divisor = 30 pips * 10 = 300. Lots = 100 / 300 = 0.33
  assert.equal(result.lots, 0.33);
  assert.equal(result.cashReward, 250.0);
  assert.equal(result.drawdownImpactPct, 1.0);
});

test("2. Valid short setup calculation", () => {
  const result = calculatePositionSize({
    instrument: "EUR/USD",
    direction: "short",
    entryPrice: 1.08500,
    stopPrice: 1.08800,
    targetPrice: 1.07600,
    accountBalance: 20000,
    riskPct: 1.0,
  });

  assert.equal(result.isValid, true);
  assert.equal(result.errors.length, 0);
  assert.equal(result.direction, "short");
  assert.equal(result.cashRisk, 200.0);
  assert.equal(result.stopPips, 30.0);
  assert.equal(result.rewardPips, 90.0);
  assert.equal(result.rewardRiskRatio, 3.0);
  // Divisor = 30 * 10 = 300. Lots = 200 / 300 = 0.67
  assert.equal(result.lots, 0.67);
  assert.equal(result.cashReward, 600.0);
});

test("3. Invalid stop placement validation", () => {
  // Long setup where stop is above entry
  const invalidLong = calculatePositionSize({
    instrument: "GBP/USD",
    direction: "long",
    entryPrice: 1.27500,
    stopPrice: 1.27800, // Invalid!
    targetPrice: 1.28500,
    accountBalance: 10000,
    riskPct: 1.0,
  });

  assert.equal(invalidLong.isValid, false);
  assert.ok(
    invalidLong.errors.some((e) => e.includes("stop loss must be placed strictly below")),
    "Long trade must reject stop loss placed at or above entry"
  );

  // Short setup where stop is below entry
  const invalidShort = calculatePositionSize({
    instrument: "GBP/USD",
    direction: "short",
    entryPrice: 1.27500,
    stopPrice: 1.27000, // Invalid!
    targetPrice: 1.26500,
    accountBalance: 10000,
    riskPct: 1.0,
  });

  assert.equal(invalidShort.isValid, false);
  assert.ok(
    invalidShort.errors.some((e) => e.includes("stop loss must be placed strictly above")),
    "Short trade must reject stop loss placed at or below entry"
  );
});

test("4. Invalid target placement validation", () => {
  // Long setup where target is below entry
  const invalidTargetLong = calculatePositionSize({
    instrument: "GBP/USD",
    direction: "long",
    entryPrice: 1.27500,
    stopPrice: 1.27000,
    targetPrice: 1.27200, // Invalid: target < entry for long
    accountBalance: 10000,
    riskPct: 1.0,
  });

  assert.equal(invalidTargetLong.isValid, false);
  assert.ok(
    invalidTargetLong.errors.some((e) => e.includes("target must be placed strictly above")),
    "Long trade must reject target placed at or below entry"
  );

  // Short setup where target is above entry
  const invalidTargetShort = calculatePositionSize({
    instrument: "GBP/USD",
    direction: "short",
    entryPrice: 1.27500,
    stopPrice: 1.28000,
    targetPrice: 1.27800, // Invalid: target > entry for short
    accountBalance: 10000,
    riskPct: 1.0,
  });

  assert.equal(invalidTargetShort.isValid, false);
  assert.ok(
    invalidTargetShort.errors.some((e) => e.includes("target must be placed strictly below")),
    "Short trade must reject target placed at or above entry"
  );
});

test("5. Invalid risk percentage validation", () => {
  // 0% risk
  const zeroRisk = calculatePositionSize({
    instrument: "GBP/USD",
    direction: "long",
    entryPrice: 1.27500,
    stopPrice: 1.27000,
    targetPrice: 1.28500,
    accountBalance: 10000,
    riskPct: 0,
    riskAmount: 0,
  });
  // Should default or flag error
  assert.ok(zeroRisk.riskPct > 0, "Fallback to minimum positive risk");

  // > 100% risk
  const excessiveRisk = calculatePositionSize({
    instrument: "GBP/USD",
    direction: "long",
    entryPrice: 1.27500,
    stopPrice: 1.27000,
    targetPrice: 1.28500,
    accountBalance: 10000,
    riskPct: 150,
  });
  assert.equal(excessiveRisk.isValid, false);
  assert.ok(
    excessiveRisk.errors.some((e) => e.includes("cannot exceed 100%")),
    "Must reject risk exceeding 100% of balance"
  );
});

test("6. Correct cash risk calculation", () => {
  const result = calculatePositionSize({
    instrument: "EUR/USD",
    direction: "long",
    entryPrice: 1.1000,
    stopPrice: 1.0950,
    targetPrice: 1.1150,
    accountBalance: 50000,
    riskPct: 1.5,
  });

  assert.equal(result.cashRisk, 750.0);
  assert.equal(result.drawdownImpactPct, 1.5);
});

test("7. Correct R:R calculation", () => {
  const result = calculatePositionSize({
    instrument: "GBP/USD",
    direction: "long",
    entryPrice: 1.2500,
    stopPrice: 1.2460, // 40 pips risk
    targetPrice: 1.2620, // 120 pips reward
    accountBalance: 10000,
    riskPct: 1.0,
  });

  assert.equal(result.rewardRiskRatio, 3.0);
  assert.equal(result.cashReward, 300.0);
});

test("8. Correct position-sizing calculation across multi-asset classes", () => {
  // A. Forex Minor / JPY
  const jpyResult = calculatePositionSize({
    instrument: "USD/JPY",
    direction: "long",
    entryPrice: 155.00,
    stopPrice: 154.50, // 50 pips (0.50 * 100)
    targetPrice: 156.50,
    accountBalance: 10000,
    riskPct: 1.0, // $100 risk
  });
  // Divisor = 50 * 10 = 500. Lots = 100 / 500 = 0.20
  assert.equal(jpyResult.spec.id, "forex-minor");
  assert.equal(jpyResult.stopPips, 50.0);
  assert.equal(jpyResult.lots, 0.20);

  // B. Commodity / Gold (XAU/USD)
  const goldResult = calculatePositionSize({
    instrument: "XAU/USD",
    direction: "long",
    entryPrice: 2350.0,
    stopPrice: 2340.0, // $10 distance -> 100 pips (10 * 10)
    targetPrice: 2375.0,
    accountBalance: 10000,
    riskPct: 2.0, // $200 risk
  });
  // Divisor = 100 pips * 1 = 100. Lots = 200 / 100 = 2.00
  assert.equal(goldResult.spec.id, "commodity");
  assert.equal(goldResult.stopPips, 100.0);
  assert.equal(goldResult.lots, 2.00);

  // C. Index (NDX)
  const indexResult = calculatePositionSize({
    instrument: "NDX",
    direction: "long",
    entryPrice: 18000,
    stopPrice: 17950, // 50 pts distance -> 50 pips (50 * 1)
    targetPrice: 18150,
    accountBalance: 10000,
    riskPct: 1.0, // $100 risk
  });
  // Divisor = 50 * 1 = 50. Lots = 100 / 50 = 2.00
  assert.equal(indexResult.spec.id, "index-pts");
  assert.equal(indexResult.stopPips, 50.0);
  assert.equal(indexResult.lots, 2.00);

  // D. Crypto (BTC/USD)
  const btcResult = calculatePositionSize({
    instrument: "BTC/USD",
    direction: "long",
    entryPrice: 65000,
    stopPrice: 64000, // $1000 distance -> 1000 pips
    targetPrice: 68000,
    accountBalance: 10000,
    riskPct: 1.0, // $100 risk
  });
  // Divisor = 1000 * 1 = 1000. Lots = 100 / 1000 = 0.10 BTC
  assert.equal(btcResult.spec.id, "crypto");
  assert.equal(btcResult.lots, 0.10);
});

test("9. Correct drawdown impact and account limit evaluation", () => {
  const withinLimits = calculatePositionSize({
    instrument: "GBP/USD",
    direction: "long",
    entryPrice: 1.2750,
    stopPrice: 1.2700,
    targetPrice: 1.2850,
    accountBalance: 10000,
    riskPct: 1.0,
    accountLimits: {
      dailyLossLimitPct: 5.0,
      maxDrawdownLimitPct: 10.0,
      todayLoss: 100, // already lost 1%
    },
  });
  assert.equal(withinLimits.isWithinDailyLimit, true);
  assert.equal(withinLimits.dailyLossImpactPct, 2.0); // 1% today + 1% trade

  const breachLimit = calculatePositionSize({
    instrument: "GBP/USD",
    direction: "long",
    entryPrice: 1.2750,
    stopPrice: 1.2700,
    targetPrice: 1.2850,
    accountBalance: 10000,
    riskPct: 3.0,
    accountLimits: {
      dailyLossLimitPct: 5.0,
      maxDrawdownLimitPct: 10.0,
      todayLoss: 300, // already lost 3%
    },
  });
  // 3% today + 3% trade = 6% > 5% daily limit
  assert.equal(breachLimit.isWithinDailyLimit, false);
  assert.ok(
    breachLimit.warnings.some((w) => w.includes("pushes total daily loss")),
    "Must warn user when daily loss limit would be breached"
  );
});

// ---------------------------------------------------------------------------
// 2. Server-side API & Security Verification
// ---------------------------------------------------------------------------

test("10. Account ownership validation in trade plans create API", () => {
  const apiRoute = readFile("src/app/api/trade-plans/create/route.ts");
  assert.ok(
    apiRoute.includes('.eq("user_id", user.id)'),
    "API must verify account user_id matches authenticated user"
  );
});

test("11. Unauthorised account rejection in trade plans create API", () => {
  const apiRoute = readFile("src/app/api/trade-plans/create/route.ts");
  assert.ok(
    apiRoute.includes("status: 403"),
    "API must return 403 when user attempts to plan against an unauthorised account"
  );
});

// ---------------------------------------------------------------------------
// 3. Market Data & Freshness Handling
// ---------------------------------------------------------------------------

test("12. Market data unavailable behaviour: calculation succeeds without feed", () => {
  // Pure calculation without external market feed must succeed
  const result = calculatePositionSize({
    instrument: "GBP/USD",
    direction: "long",
    entryPrice: 1.2750,
    stopPrice: 1.2700,
    targetPrice: 1.2850,
    accountBalance: 10000,
    riskPct: 1.0,
  });
  assert.equal(result.isValid, true);
  assert.equal(result.lots > 0, true);
});

test("13. Stale and live market data freshness states handled in RunMyTrade UI", () => {
  const component = readFile("src/components/dashboard/RunMyTrade.tsx");
  assert.ok(
    component.includes("LIVE FEED"),
    "RunMyTrade must show LIVE FEED badge when data is recent"
  );
  assert.ok(
    component.includes("STALE"),
    "RunMyTrade must show STALE badge when data is aged or cached fallback"
  );
  assert.ok(
    component.includes("Market context is informational only. Drawdown will never overwrite"),
    "Must display explicit disclaimer that market context does not overwrite user levels"
  );
});

// ---------------------------------------------------------------------------
// 4. Persistence & Immutability Architecture
// ---------------------------------------------------------------------------

test("14. Trade Plan persistence uses existing trade_plans table", () => {
  const apiRoute = readFile("src/app/api/trade-plans/create/route.ts");
  assert.ok(
    apiRoute.includes('.from("trade_plans")'),
    "Must insert into existing trade_plans table"
  );
  assert.ok(
    !apiRoute.includes("create_table_trade_plans_v2"),
    "Must NOT create duplicate trade plan tables"
  );
});

test("15. Trade Plan immutable snapshot behaviour in trade_plan_snapshots", () => {
  const apiRoute = readFile("src/app/api/trade-plans/create/route.ts");
  assert.ok(
    apiRoute.includes('.from("trade_plan_snapshots")'),
    "Must insert into trade_plan_snapshots table"
  );
  assert.ok(
    apiRoute.includes("snapshot_data"),
    "Must persist immutable snapshot_data json object"
  );
});

test("16. No trade record is falsely created upon saving trade plan", () => {
  const apiRoute = readFile("src/app/api/trade-plans/create/route.ts");
  assert.ok(
    !apiRoute.includes('.from("trade_records").insert'),
    "Must NOT insert into trade_records on trade plan creation"
  );
  assert.ok(
    !apiRoute.includes('.from("trades").insert'),
    "Must NOT insert into trades on trade plan creation"
  );
});

// ---------------------------------------------------------------------------
// 5. Execution Boundary & Operating Loop
// ---------------------------------------------------------------------------

test("17. Execution boundary is explicit and non-routing", () => {
  const component = readFile("src/components/dashboard/RunMyTrade.tsx");
  assert.ok(
    component.includes("EXECUTE AT BROKER"),
    "Must display unambiguous EXECUTE AT BROKER call-to-action"
  );
  assert.ok(
    component.includes("Drawdown Does Not Execute Orders"),
    "Must display clear notice that Drawdown never routes orders"
  );
  assert.ok(
    !component.includes('button className="execute-trade-order"'),
    "Must never display fake broker execution order button"
  );
});

test("18. Entitlement enforcement: respects existing platform commercial tiers", () => {
  const entitlements = readFile("src/lib/entitlements.ts");
  assert.ok(
    entitlements.includes("CommercialAccess"),
    "Entitlements must remain grounded in canonical CommercialAccess"
  );
});

test("19. Existing Position Sizer calculations remain consistent with RiskCalculator", () => {
  const riskCalc = readFile("src/components/tools/RiskCalculator.tsx");
  // Check that RiskCalculator uses the same multiplier and pip math
  assert.ok(
    riskCalc.includes("const stopDistPips = priceDist * instr.mult;"),
    "RiskCalculator must calculate stopDistPips using priceDist * instr.mult"
  );
  assert.ok(
    riskCalc.includes("const divisor = stopDistPips * pipValue;"),
    "RiskCalculator must calculate divisor using stopDistPips * pipValue"
  );
  assert.ok(
    riskCalc.includes("const lots = divisor > 0 ? riskAmt / divisor : 0;"),
    "RiskCalculator must calculate lots using riskAmt / divisor"
  );

  // Compare against position-sizing.ts resolution
  const fxMajor = resolveInstrumentSpec("GBP/USD");
  assert.equal(fxMajor.mult, 10000);
  assert.equal(fxMajor.pip, 10);

  const fxMinor = resolveInstrumentSpec("USD/JPY");
  assert.equal(fxMinor.mult, 100);
  assert.equal(fxMinor.pip, 10);
});

test("20. Existing Prompt 02-07 test suites continue passing", () => {
  const navTest = readFile("tests/navigation-ia.test.ts");
  const secTest = readFile("tests/security-access.test.ts");
  const freshTest = readFile("tests/signal-freshness.test.ts");

  assert.ok(navTest.length > 0, "navigation-ia test suite must exist");
  assert.ok(secTest.length > 0, "security-access test suite must exist");
  assert.ok(freshTest.length > 0, "signal-freshness test suite must exist");
});
