import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function readFile(relPath: string) {
  return fs.readFileSync(path.join(process.cwd(), relPath), "utf-8");
}

test("DB3 Step 1: Backtester removes false AI/Pete branding and provides honest Rule-of-Thumb Assessment", () => {
  const backtester = fs.existsSync(path.join(process.cwd(), "src/app/(platform)/dashboard/tools/backtester/BacktesterClient.tsx"))
    ? readFile("src/app/(platform)/dashboard/tools/backtester/BacktesterClient.tsx")
    : readFile("src/app/(platform)/dashboard/tools/backtester/page.tsx");

  // False AI and personal persona branding must NOT exist
  assert.ok(
    !backtester.includes("Pete's Strategic Assessment"),
    "Must not attribute hardcoded ternary to Pete personally"
  );
  assert.ok(
    !backtester.includes("BrainCircuit"),
    "Must not use BrainCircuit AI iconography for mechanical ternary"
  );
  assert.ok(
    !backtester.includes("AI Strategy Coach"),
    "Must not claim hardcoded logic is an AI Strategy Coach"
  );

  // Honest labeling must be present
  assert.ok(
    backtester.includes("Rule-of-Thumb Assessment"),
    "Must label assessment honestly as Rule-of-Thumb Assessment"
  );
  assert.ok(
    backtester.includes("Mechanical Benchmark"),
    "Must clarify that it is a mechanical benchmark evaluation"
  );

  // Print/Save button is wired
  assert.ok(
    backtester.includes("window.print()"),
    "Print/Save button must have active window.print handler instead of dead button"
  );
});

test("DB3 Step 2: Market Pulse Squeeze card removes false TAAPI Live vendor label", () => {
  const marketPulse = readFile("src/app/(platform)/dashboard/market-intelligence/page.tsx");

  assert.ok(
    !marketPulse.includes("TAAPI Live"),
    "Must not claim TAAPI Live when calculated locally from Bollinger Bands"
  );
  assert.ok(
    marketPulse.includes("Bollinger Squeeze (Calculated)"),
    "Must honestly label source as Bollinger Squeeze (Calculated)"
  );
});

test("DB3 Step 3: Market Pulse COT card is wired to live CFTC endpoint with instrument-specific data", () => {
  const marketPulse = readFile("src/app/(platform)/dashboard/market-intelligence/page.tsx");

  // Endpoint connection
  assert.ok(
    marketPulse.includes("/api/intelligence/cot/"),
    "Market Pulse must fetch live COT data via /api/intelligence/cot/"
  );

  // Dynamic state
  assert.ok(
    marketPulse.includes("cotData"),
    "Market Pulse must maintain cotData state"
  );

  // MetricCard does not have static 'Weekly' string
  assert.ok(
    !marketPulse.includes('value="Weekly"'),
    "COT card must not display static 'Weekly' value"
  );

  // COT mapping expanded for gold, bitcoin, and major FX
  const cotRoute = readFile("src/app/api/intelligence/cot/[symbol]/route.ts");
  assert.ok(cotRoute.includes("XAUUSD"), "COT_MAP must include Gold (XAUUSD)");
  assert.ok(cotRoute.includes("BTCUSD"), "COT_MAP must include Bitcoin (BTCUSD)");
  assert.ok(cotRoute.includes("AUDUSD"), "COT_MAP must include AUDUSD");
});
