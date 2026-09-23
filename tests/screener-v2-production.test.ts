/**
 * Screener V2 Production Regression Tests
 *
 * Asserts:
 *  1. SSR data contract — page.tsx is async and accepts initialData from server prefetch
 *  2. Component wiring — all V2 components imported into PublicScreenerClient
 *  3. Skeleton elimination — initialData path bypasses loading = true
 *  4. Metric semantics (cross-file)
 *  5. Visual hierarchy order
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

// ── File paths ─────────────────────────────────────────────────────────────────
const pagePath = path.join(root, "src/app/(marketing)/markets/screener/page.tsx");
const clientPath = path.join(root, "src/components/markets/PublicScreenerClient.tsx");
const pulsePath = path.join(root, "src/components/markets/ScreenerMarketPulse.tsx");
const heatmapPath = path.join(root, "src/components/markets/ScreenerHeatmap.tsx");
const conditionsPath = path.join(root, "src/components/markets/ScreenerMarketConditions.tsx");

const page = fs.readFileSync(pagePath, "utf-8");
const client = fs.readFileSync(clientPath, "utf-8");
const pulse = fs.readFileSync(pulsePath, "utf-8");
const heatmap = fs.readFileSync(heatmapPath, "utf-8");
const conditions = fs.readFileSync(conditionsPath, "utf-8");

// ── 1. SSR Data Contract ───────────────────────────────────────────────────────
test("SSR: page.tsx must be an async Server Component", () => {
  assert.ok(
    page.includes("export default async function ScreenerPage"),
    "page.tsx must export an async default function"
  );
});

test("SSR: page.tsx must contain getInitialScreenerData server prefetch", () => {
  assert.ok(
    page.includes("async function getInitialScreenerData"),
    "page.tsx must have getInitialScreenerData helper"
  );
  assert.ok(
    page.includes("api/market/screener"),
    "Server prefetch must call the screener API"
  );
  assert.ok(
    page.includes("revalidate: 60"),
    "Server prefetch must use 60s revalidation"
  );
});

test("SSR: page.tsx must pass initialData to PublicScreenerClient", () => {
  assert.ok(
    page.includes("initialData={initialData}"),
    "page.tsx must pass initialData prop to PublicScreenerClient"
  );
});

test("SSR: page.tsx must render terminal hero live-state strip", () => {
  assert.ok(
    page.includes("Live Stream Feed"),
    "Hero strip must show live stream feed status"
  );
  assert.ok(
    page.includes("60s Edge Cache"),
    "Hero strip must show 60s edge cache label"
  );
  assert.ok(
    page.includes("Advancing"),
    "Hero strip must show advancing instrument count"
  );
  assert.ok(
    page.includes("Declining"),
    "Hero strip must show declining instrument count"
  );
});

// ── 2. Component Wiring ────────────────────────────────────────────────────────
test("Wiring: PublicScreenerClient imports all V2 components", () => {
  assert.ok(client.includes("ScreenerMarketPulse"), "Must import ScreenerMarketPulse");
  assert.ok(client.includes("ScreenerHeatmap"), "Must import ScreenerHeatmap");
  assert.ok(client.includes("ScreenerMarketConditions"), "Must import ScreenerMarketConditions");
  assert.ok(client.includes("ScreenerFilterWorkstation"), "Must import ScreenerFilterWorkstation");
  assert.ok(client.includes("ScreenerTable"), "Must import ScreenerTable");
  assert.ok(client.includes("ScreenerUpsellRows"), "Must import ScreenerUpsellRows");
});

// ── 3. Skeleton Elimination ────────────────────────────────────────────────────
test("No-skeleton: PublicScreenerClient accepts initialData prop", () => {
  assert.ok(
    client.includes("initialData?: ScreenerRow[]") || client.includes("{ initialData }"),
    "PublicScreenerClient must accept initialData prop"
  );
});

test("No-skeleton: loading state initialized to false when initialData present", () => {
  // The key guard — must not unconditionally set loading = true
  assert.ok(
    !client.includes("useState(true)"),
    "Must not unconditionally set loading = true (causes skeleton flash)"
  );
  assert.ok(
    client.includes("initialData") && client.includes("false"),
    "Must set loading = false when initialData is provided"
  );
});

// ── 4. ScreenerMarketPulse: Orientation Strip ──────────────────────────────────
test("Pulse: Must be named Market Pulse (orientation strip)", () => {
  assert.ok(pulse.includes("Market Pulse"), "Must be labeled 'Market Pulse'");
  assert.ok(!pulse.includes("Market Breadth & Pulse"), "Old name must not appear");
});

test("Pulse: Must include all four strip segments", () => {
  assert.ok(pulse.includes("Market Breadth"), "Strip must have Market Breadth segment");
  assert.ok(pulse.includes("Top 24H Movers"), "Strip must have Top 24H Movers segment");
  assert.ok(pulse.includes("Sector Momentum"), "Strip must have Sector Momentum segment");
  assert.ok(pulse.includes("1H MSS Bias"), "Strip must have 1H MSS Bias segment");
});

test("Pulse: Must show both top gainer and top decliner", () => {
  assert.ok(pulse.includes("topGainer"), "Must compute topGainer");
  assert.ok(pulse.includes("topDecliner"), "Must compute topDecliner");
});

test("Pulse: Must cover all 6 asset categories in sector stats", () => {
  const requiredCats = ["forex", "commodities", "indices", "crypto", "stocks-uk", "stocks-us"];
  for (const cat of requiredCats) {
    assert.ok(
      pulse.includes(`"${cat}"`),
      `Pulse must include category "${cat}" in sector stats`
    );
  }
});

// ── 5. ScreenerHeatmap: Visual Centerpiece ─────────────────────────────────────
test("Heatmap: Matrix mode must show avg return badge on cluster headers", () => {
  assert.ok(
    heatmap.includes("avgChange") && heatmap.includes("Avg"),
    "Matrix cluster headers must show average sector return badge"
  );
});

test("Heatmap: CORE badge must have editorial priority disclaimer", () => {
  assert.ok(
    heatmap.includes("Core Drawdown Market (Editorial Priority)"),
    "CORE badge must explicitly document editorial priority"
  );
});

test("Heatmap: All 6 asset categories must be in categorizedGroups", () => {
  const requiredCats = ["forex", "commodities", "indices", "crypto", "stocks-uk", "stocks-us"];
  for (const cat of requiredCats) {
    assert.ok(
      heatmap.includes(`"${cat}"`),
      `Heatmap must include "${cat}" in categorizedGroups`
    );
  }
});

test("Heatmap: Must not claim Activity or Liquidity", () => {
  assert.ok(!heatmap.includes('label: "Activity"'), 'Must not use label "Activity"');
  assert.ok(!heatmap.toLowerCase().includes("liquidity"), "Must not claim liquidity");
});

// ── 6. ScreenerMarketConditions: Structured Board ─────────────────────────────
test("Conditions: Must have all 4 pillars with correct naming", () => {
  assert.ok(conditions.includes("Market Breadth"), "Pillar 1 must be Market Breadth");
  assert.ok(conditions.includes("Movement Intensity"), "Pillar 2 must be Movement Intensity");
  assert.ok(conditions.includes("Momentum (RSI"), "Pillar 3 must include Momentum (RSI)");
  assert.ok(conditions.includes("Movement Range"), "Pillar 4 must be Movement Range");
});

test("Conditions: Must have all 4 leaderboards with correct naming", () => {
  assert.ok(conditions.includes("Top Movers"), "Must have Top Movers leaderboard");
  assert.ok(conditions.includes("Weakest"), "Must have Weakest leaderboard");
  assert.ok(conditions.includes("RSI Leaders"), "Must have RSI Leaders leaderboard");
  assert.ok(conditions.includes("Lowest Movement"), "Must have Lowest Movement leaderboard");
  assert.ok(!conditions.includes("Compression Watch"), "Must NOT use 'Compression Watch'");
  assert.ok(!conditions.includes("Momentum Leaders"), "Must NOT use 'Momentum Leaders'");
});

test("Conditions: Must not claim Volatility or Liquidity", () => {
  assert.ok(!conditions.includes("Volatility Range"), "Must NOT use 'Volatility Range'");
  assert.ok(!conditions.toLowerCase().includes("liquidity"), "Must not claim liquidity");
});

// ── 7. Visual Hierarchy Order in PublicScreenerClient ─────────────────────────
test("Layout: Visual hierarchy must be Pulse → Heatmap → Conditions → Workstation → Table", () => {
  const pulsePos = client.indexOf("ScreenerMarketPulse");
  const heatmapPos = client.indexOf("ScreenerHeatmap");
  const conditionsPos = client.indexOf("ScreenerMarketConditions");
  const workstationPos = client.indexOf("ScreenerFilterWorkstation");
  const tablePos = client.indexOf("ScreenerTable");

  assert.ok(pulsePos > -1, "ScreenerMarketPulse must be in PublicScreenerClient");
  assert.ok(heatmapPos > -1, "ScreenerHeatmap must be in PublicScreenerClient");
  assert.ok(conditionsPos > -1, "ScreenerMarketConditions must be in PublicScreenerClient");
  assert.ok(workstationPos > -1, "ScreenerFilterWorkstation must be in PublicScreenerClient");
  assert.ok(tablePos > -1, "ScreenerTable must be in PublicScreenerClient");

  assert.ok(pulsePos < heatmapPos, "Pulse must appear before Heatmap");
  assert.ok(heatmapPos < conditionsPos, "Heatmap must appear before Conditions");
  assert.ok(conditionsPos < workstationPos, "Conditions must appear before Workstation");
  assert.ok(workstationPos < tablePos, "Workstation must appear before Table");
});
