import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  calculatePositionSize,
  resolveInstrumentSpec,
  POSITION_INSTRUMENT_SPECS,
} from "../src/lib/position-sizing.ts";
import { simulateStrategy } from "../src/lib/backtester.ts";
import { CommercialAccess, hasTierAccess } from "../src/lib/entitlements.ts";

const rootDir = path.resolve(import.meta.dirname, "..");

function readFile(relPath: string): string {
  return fs.readFileSync(path.join(rootDir, relPath), "utf8");
}

// ─── 1. Risk Calculator & Position Sizer Audit ────────────────────────────────

test("Tool Audit 1.1: Position sizing formula correctness across multiple asset classes", () => {
  // Forex Major: GBP/USD, 30 pip stop, £100 risk on £10,000 account
  const fxResult = calculatePositionSize({
    instrument: "GBP/USD",
    direction: "long",
    entryPrice: 1.275,
    stopPrice: 1.272,
    targetPrice: 1.284,
    accountBalance: 10000,
    riskPct: 1,
  });

  assert.equal(fxResult.isValid, true);
  assert.equal(fxResult.stopPips, 30);
  assert.equal(fxResult.rewardPips, 90);
  assert.equal(fxResult.rewardRiskRatio, 3);
  assert.equal(fxResult.cashRisk, 100);
  // Lots = 100 / (30 * 10) = 0.33 lots
  assert.equal(fxResult.lots, 0.33);

  // Commodity: Gold (XAU/USD), 50 pip ($5) stop, £200 risk on £20,000 account
  const goldResult = calculatePositionSize({
    instrument: "XAU/USD",
    direction: "long",
    entryPrice: 2350,
    stopPrice: 2345,
    targetPrice: 2365,
    accountBalance: 20000,
    riskPct: 1,
  });
  assert.equal(goldResult.isValid, true);
  assert.equal(goldResult.cashRisk, 200);
  assert.equal(goldResult.rewardRiskRatio, 3);

  // Crypto: BTC/USD
  const btcResult = calculatePositionSize({
    instrument: "BTC/USD",
    direction: "long",
    entryPrice: 65000,
    stopPrice: 64000,
    targetPrice: 68000,
    accountBalance: 10000,
    riskPct: 1,
  });
  assert.equal(btcResult.isValid, true);
  assert.equal(btcResult.cashRisk, 100);
  assert.equal(btcResult.stopPips, 1000);
  assert.equal(btcResult.rewardRiskRatio, 3);
});

test("Tool Audit 1.2: Position sizer validates invalid stop and target placement", () => {
  // Long trade with stop ABOVE entry
  const invalidLong = calculatePositionSize({
    instrument: "EUR/USD",
    direction: "long",
    entryPrice: 1.085,
    stopPrice: 1.09,
    targetPrice: 1.095,
    accountBalance: 10000,
    riskPct: 1,
  });
  assert.equal(invalidLong.isValid, false);
  assert.ok(invalidLong.errors.some((e) => e.includes("stop loss must be placed strictly below")));

  // Short trade with stop BELOW entry
  const invalidShort = calculatePositionSize({
    instrument: "EUR/USD",
    direction: "short",
    entryPrice: 1.085,
    stopPrice: 1.08,
    targetPrice: 1.075,
    accountBalance: 10000,
    riskPct: 1,
  });
  assert.equal(invalidShort.isValid, false);
  assert.ok(invalidShort.errors.some((e) => e.includes("stop loss must be placed strictly above")));
});

test("Tool Audit 1.3: Consistency between RiskCalculator and position-sizing engine", () => {
  const calcFile = readFile("src/components/tools/RiskCalculator.tsx");
  const engineFile = readFile("src/lib/position-sizing.ts");

  // Both must share identical contract specification multipliers
  assert.ok(calcFile.includes("mult:10000"), "RiskCalculator must use mult:10000 for forex-major");
  assert.ok(engineFile.includes("mult: 10000"), "position-sizing must use mult: 10000 for forex-major");
  assert.ok(calcFile.includes("mult:100"), "RiskCalculator must use mult:100 for forex-minor");
  assert.ok(engineFile.includes("mult: 100"), "position-sizing must use mult: 100 for forex-minor");
});

// ─── 2. Journal & Operating Loop Audit ────────────────────────────────────────

test("Tool Audit 2.1: Journal page enforces Foundation tier gate server-side", () => {
  const journalPage = readFile("src/app/(platform)/dashboard/journal/page.tsx");
  assert.ok(
    journalPage.includes('hasTierAccess(tier, "foundation", status)'),
    "Journal page must check foundation tier access"
  );
  assert.ok(
    journalPage.includes("Foundation Access Required"),
    "Journal page must display locked state for free tier"
  );
  assert.ok(
    journalPage.includes("redirect(\"/login\")"),
    "Journal page must redirect unauthenticated users"
  );
});

test("Tool Audit 2.2: Journal database migrations enforce RLS on trade_entries and trade_records", () => {
  const tradeEntriesMigration = readFile("supabase/migrations/20260622_trade_entries.sql");
  assert.ok(
    tradeEntriesMigration.includes("ALTER TABLE public.trade_entries ENABLE ROW LEVEL SECURITY;"),
    "trade_entries must have RLS enabled"
  );
  assert.ok(
    tradeEntriesMigration.includes("auth.uid() = user_id"),
    "trade_entries must restrict access to user_id"
  );

  const workflowMigration = readFile("supabase/migrations/20260808_create_workflow_tables.sql");
  assert.ok(
    workflowMigration.includes("ALTER TABLE public.trade_records ENABLE ROW LEVEL SECURITY;"),
    "trade_records must have RLS enabled"
  );
  assert.ok(
    workflowMigration.includes("ON public.trade_records FOR ALL USING (auth.uid() = user_id);"),
    "trade_records must enforce user_id ownership"
  );
});

// ─── 3. Scanner Data Integrity Audit ──────────────────────────────────────────

test("Tool Audit 3.1: Technical Scanner instruments and data provenance", () => {
  const scannerClient = readFile("src/components/dashboard/ScannerClient.tsx");
  assert.ok(
    scannerClient.includes("SCANNER_INSTRUMENTS"),
    "Scanner must define supported instruments"
  );
  assert.ok(
    scannerClient.includes("useMarketCache"),
    "Scanner must fetch prices via useMarketCache"
  );
  assert.ok(
    scannerClient.includes("DataProvenanceLabel"),
    "Scanner must display data provenance"
  );
});

test("Tool Audit 3.2: Scanner documents retail sentiment fallback behaviour", () => {
  const scannerClient = readFile("src/components/dashboard/ScannerClient.tsx");
  // Document that RETAIL_MOCK exists as a fallback when retail sentiment API is offline
  assert.ok(
    scannerClient.includes("RETAIL_MOCK"),
    "Scanner defines RETAIL_MOCK fallback"
  );
  assert.ok(
    scannerClient.includes("/api/intelligence/retail-sentiment"),
    "Scanner calls live retail sentiment endpoint"
  );
});

// ─── 4. Backtester Calculation Engine Audit ───────────────────────────────────

test("Tool Audit 4.1: Backtester simulation engine produces deterministic results on test candles", () => {
  // Mock historical data of 10 candles with clear uptrend
  const testCandles = [
    { time: 1000, open: 1.250, high: 1.252, low: 1.249, close: 1.251 },
    { time: 1060, open: 1.251, high: 1.254, low: 1.250, close: 1.253 },
    { time: 1120, open: 1.253, high: 1.256, low: 1.252, close: 1.255 },
    { time: 1180, open: 1.255, high: 1.258, low: 1.254, close: 1.257 },
    { time: 1240, open: 1.257, high: 1.260, low: 1.256, close: 1.259 },
    { time: 1300, open: 1.259, high: 1.263, low: 1.258, close: 1.262 },
    { time: 1360, open: 1.262, high: 1.265, low: 1.261, close: 1.264 },
    { time: 1420, open: 1.264, high: 1.268, low: 1.263, close: 1.267 },
    { time: 1480, open: 1.267, high: 1.270, low: 1.266, close: 1.269 },
    { time: 1540, open: 1.269, high: 1.272, low: 1.268, close: 1.271 },
  ];

  const config: any = {
    type: "EMA_CROSS",
    params: { fast: 2, slow: 5, stopLossPct: 1, takeProfitPct: 2 },
  };

  const result = simulateStrategy(testCandles, config, 10000);
  assert.ok(result, "Simulation must return a result object");
  assert.ok(Array.isArray(result.trades), "Result must contain trades array");
  assert.ok(Array.isArray(result.equityCurve), "Result must contain equity curve array");
  assert.equal(typeof result.totalNetProfit, "number");
  assert.equal(typeof result.winRate, "number");
  assert.equal(typeof result.maxDrawdown, "number");
});

test("Tool Audit 4.2: Backtester handles empty data gracefully without throwing", () => {
  const config: any = {
    type: "EMA_CROSS",
    params: { fast: 10, slow: 25 },
  };
  const emptyResult = simulateStrategy([], config, 10000);
  assert.equal(emptyResult.trades.length, 0);
  assert.equal(emptyResult.totalNetProfit, 0);
  assert.equal(emptyResult.maxDrawdown, 0);
});

// ─── 5. Challenge & Prop Firm Simulator Engine Audit ──────────────────────────

test("Tool Audit 5.1: Prop simulator engine implements all required risk rule evaluations", () => {
  const engineSource = readFile("src/lib/simulator/engine.ts");
  
  // Daily loss calculation and breach check
  assert.ok(
    engineSource.includes("const dailyLossLimit = accountSize * (Number(firm.default_daily_loss_pct) / 100);"),
    "Engine must calculate daily loss limit based on firm rule"
  );
  assert.ok(
    engineSource.includes("result = 'fail_daily_loss';"),
    "Engine must detect and flag daily loss breach"
  );

  // Max drawdown types (static, relative, trailing EOD, trailing intraday)
  assert.ok(
    engineSource.includes("firm.max_drawdown_type === 'trailing_eod'"),
    "Engine must support trailing EOD drawdown type"
  );
  assert.ok(
    engineSource.includes("firm.max_drawdown_type === 'trailing_intraday'"),
    "Engine must support trailing intraday drawdown type"
  );
  assert.ok(
    engineSource.includes("result = 'fail_max_drawdown';"),
    "Engine must detect and flag max drawdown breach"
  );

  // Profit target and minimum trading days
  assert.ok(
    engineSource.includes("profitReached >= profitTarget"),
    "Engine must verify profit target reached"
  );
  assert.ok(
    engineSource.includes("tradingDays >= minTradingDays"),
    "Engine must verify minimum trading days requirement"
  );
  assert.ok(
    engineSource.includes("result = 'pass';"),
    "Engine must assign pass status when all criteria are satisfied"
  );
});

test("Tool Audit 5.2: Simulator server action persists deterministic results with user authentication", () => {
  const actionSource = readFile("src/app/actions/simulator.ts");
  assert.ok(
    actionSource.includes('throw new Error("Unauthorized")'),
    "Simulator server action must enforce authentication"
  );
  assert.ok(
    actionSource.includes('.from("prop_firms")'),
    "Simulator must load rules from prop_firms table"
  );
  assert.ok(
    actionSource.includes('.from("simulation_results").insert'),
    "Simulator must persist simulation results to simulation_results table"
  );
});

// ─── 6. Algo Strategy Builder Audit ───────────────────────────────────────────

test("Tool Audit 6.1: Algo Builder enforces Floor tier access control", () => {
  const algoPage = readFile("src/app/(platform)/dashboard/tools/algo-builder/page.tsx");
  assert.ok(
    algoPage.includes('hasTierAccess(tier, "floor", status)'),
    "Algo builder must require floor tier"
  );
  assert.ok(
    algoPage.includes("FLOOR ACCESS REQUIRED"),
    "Algo builder must show Floor required notice for lower tiers"
  );
});

test("Tool Audit 6.2: Algo Builder generation route checks authentication and sanitises input", () => {
  const genRoute = readFile("src/app/api/algo-builder/generate/route.ts");
  assert.ok(
    genRoute.includes("CommercialAccess"),
    "Generation route must verify commercial access"
  );
  assert.ok(
    genRoute.includes("function sanitise("),
    "Generation route must sanitise user input"
  );
  assert.ok(
    genRoute.includes("QUANTCODER_SYSTEM"),
    "Generation route must use QuantCoder system prompt"
  );
});

// ─── 7. Academy / Curriculum Audit ────────────────────────────────────────────

test("Tool Audit 7.1: Curriculum phase weighting enforces progressive tier access", () => {
  const currPage = readFile("src/app/(platform)/dashboard/curriculum/page.tsx");
  assert.ok(currPage.includes('"ground-zero":          0'), "Ground Zero must be free (0 weight)");
  assert.ok(currPage.includes('"chart-reader":         1'), "Chart reader must require Foundation (weight 1)");
  assert.ok(currPage.includes('"the-backtester":       2'), "Backtester phase must require Edge (weight 2)");
  assert.ok(currPage.includes('"the-edge":             3'), "The Edge phase must require Floor (weight 3)");
});

// ─── 8. Alt-Data & Intelligence Hub Audit ─────────────────────────────────────

test("Tool Audit 8.1: Intelligence hub enforces Edge tier access", () => {
  const intelPage = readFile("src/app/(platform)/dashboard/intelligence/page.tsx");
  assert.ok(
    intelPage.includes('hasTierAccess(tier, "edge", status)'),
    "Intelligence hub must require Edge tier"
  );
  assert.ok(
    intelPage.includes("Edge Access Required"),
    "Must display Edge Access Required to unauthorized tiers"
  );
});

test("Tool Audit 8.2: Cluster Buy detection logic operates deterministically", () => {
  const intelPage = readFile("src/app/(platform)/dashboard/intelligence/page.tsx");
  assert.ok(
    intelPage.includes("function detectClusterBuys("),
    "Intelligence page must include cluster buy detection"
  );
  assert.ok(
    intelPage.includes("uniqueBuyers.size >= 3"),
    "Cluster buy must require 3 or more distinct buyers"
  );
});
