import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { SCREENER_INSTRUMENTS, PUBLIC_SCREENER_INSTRUMENTS } from "../src/lib/screener.ts";

const root = process.cwd();

test("Metric Semantics: ScreenerHeatmap does not misuse Activity or Liquidity", () => {
  const heatmapPath = path.join(root, "src/components/markets/ScreenerHeatmap.tsx");
  const content = fs.readFileSync(heatmapPath, "utf-8");

  // MAP BY selector must use Intensity, not generic Activity
  assert.ok(!content.includes('label: "Activity"'), 'MAP BY must not have label "Activity"');
  assert.ok(content.includes('id: "intensity"'), 'MAP BY must include "intensity" metric id');

  // No claims of liquidity
  assert.ok(!content.toLowerCase().includes("liquidity"), "Heatmap must not refer to liquidity");

  // CORE badge must have editorial priority explanation
  assert.ok(
    content.includes("Core Drawdown Market (Editorial Priority)"),
    "CORE badge must clearly document editorial priority"
  );
});

test("Metric Semantics: ScreenerHeatmap supports all 6 categories without dropping stocks", () => {
  const heatmapPath = path.join(root, "src/components/markets/ScreenerHeatmap.tsx");
  const content = fs.readFileSync(heatmapPath, "utf-8");

  const requiredCategories: string[] = [
    "forex",
    "commodities",
    "indices",
    "crypto",
    "stocks-uk",
    "stocks-us",
  ];

  for (const cat of requiredCategories) {
    assert.ok(
      content.includes(`"${cat}"`),
      `Heatmap categorizedGroups must support category "${cat}"`
    );
  }
});

test("Metric Semantics: ScreenerMarketConditions enforces honest naming", () => {
  const conditionsPath = path.join(root, "src/components/markets/ScreenerMarketConditions.tsx");
  const content = fs.readFileSync(conditionsPath, "utf-8");

  // Pillar 2: Movement Intensity
  assert.ok(content.includes("Movement Intensity"), "Pillar 2 must be named Movement Intensity");
  assert.ok(!content.includes("Market Activity"), "Pillar 2 must NOT be named Market Activity");
  assert.ok(!content.includes("High Velocity"), "Must not call price move velocity");
  assert.ok(content.includes("Elevated Move"), "Must call large moves Elevated Move");
  assert.ok(content.includes("Low Movement"), "Must call small moves Low Movement");

  // Pillar 3: Momentum (RSI & MSS)
  assert.ok(content.includes("Momentum (RSI &amp; MSS)"), "Pillar 3 must be Momentum (RSI & MSS)");
  assert.ok(content.includes("1H Structure"), "Pillar 3 subtitle must be 1H Structure");

  // Pillar 4: Movement Range (Dispersion)
  assert.ok(content.includes("Movement Range"), "Pillar 4 must be named Movement Range");
  assert.ok(!content.includes("Volatility Range"), "Pillar 4 must NOT be named Volatility Range");
  assert.ok(content.includes("Price Dispersion"), "Pillar 4 must specify Price Dispersion");
  assert.ok(content.includes("Dispersion Spread:"), "Pillar 4 must label spread as Dispersion Spread");

  // Leaderboards
  assert.ok(content.includes("RSI Leaders"), "Leaderboard 3 must be RSI Leaders");
  assert.ok(!content.includes("Momentum Leaders"), "Leaderboard 3 must NOT be Momentum Leaders");
  assert.ok(content.includes("Lowest Movement"), "Leaderboard 4 must be Lowest Movement");
  assert.ok(!content.includes("Compression Watch"), "Leaderboard 4 must NOT be Compression Watch");

  // Liquidity prohibition
  assert.ok(!content.toLowerCase().includes("liquidity"), "Market conditions must not claim liquidity");
});

test("Universe Integrity: Master and Public instrument universe consistency", () => {
  assert.equal(SCREENER_INSTRUMENTS.length, 38, "Master universe must contain 38 instruments");
  assert.equal(PUBLIC_SCREENER_INSTRUMENTS.length, 32, "Public universe must contain 32 instruments");

  // Verify all categories exist in master universe
  const categories = new Set(SCREENER_INSTRUMENTS.map((i) => i.category));
  assert.equal(categories.size, 6, "Master universe must contain all 6 asset categories");
  assert.ok(categories.has("forex"));
  assert.ok(categories.has("commodities"));
  assert.ok(categories.has("indices"));
  assert.ok(categories.has("crypto"));
  assert.ok(categories.has("stocks-uk"));
  assert.ok(categories.has("stocks-us"));
});

test("Data Integrity: Movement calculations and dispersion math", () => {
  const sampleData = [
    { slug: "A", changePct: 2.5, rsi: 72 },
    { slug: "B", changePct: -1.8, rsi: 28 },
    { slug: "C", changePct: 0.2, rsi: 50 },
    { slug: "D", changePct: -0.1, rsi: 45 },
  ];

  // Highest gainer and biggest decliner
  const sortedGain = [...sampleData].sort((a, b) => b.changePct - a.changePct);
  const maxExpansion = sortedGain[0].changePct;
  const maxDrawdown = sortedGain[sortedGain.length - 1].changePct;
  const dispersionSpread = maxExpansion - maxDrawdown;

  assert.equal(maxExpansion, 2.5);
  assert.equal(maxDrawdown, -1.8);
  assert.equal(Number(dispersionSpread.toFixed(2)), 4.3);

  // Lowest movement (ascending absolute change)
  const sortedAbsAsc = [...sampleData].sort(
    (a, b) => Math.abs(a.changePct) - Math.abs(b.changePct)
  );
  assert.equal(sortedAbsAsc[0].slug, "D", "Smallest net move is -0.1% (abs 0.1)");
  assert.equal(sortedAbsAsc[1].slug, "C", "Second smallest net move is 0.2%");

  // RSI leaders (descending RSI)
  const sortedRsi = [...sampleData].sort((a, b) => b.rsi - a.rsi);
  assert.equal(sortedRsi[0].slug, "A", "Highest RSI is 72");
  assert.equal(sortedRsi[sortedRsi.length - 1].slug, "B", "Lowest RSI is 28");
});
