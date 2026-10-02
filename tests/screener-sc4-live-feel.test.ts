/**
 * Screener SC4 — Live Feel Verification Test Suite
 *
 * Verifies:
 *  1. Value-diff engine in PublicScreenerClient (single source of truth)
 *  2. 15s client-side polling interval
 *  3. Row flash with framer-motion (900ms fade) & AnimatePresence key-swap on price/%change
 *  4. Heatmap tile pulse (600ms stripe intensify + box-shadow glow)
 *  5. Genuine live status freshness indicator (<20s solid/pulsing, dimmed otherwise)
 *  6. Micro sparklines using recharts (60x20, desktop rows only, 12 tick window)
 *  7. Reduced motion support via useReducedMotion()
 *  8. Feed offline safety (never gets profit/loss flash)
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const clientPath = path.join(root, "src/components/markets/PublicScreenerClient.tsx");
const tablePath = path.join(root, "src/components/markets/ScreenerTable.tsx");
const heatmapPath = path.join(root, "src/components/markets/ScreenerHeatmap.tsx");

const client = fs.readFileSync(clientPath, "utf-8");
const table = fs.readFileSync(tablePath, "utf-8");
const heatmap = fs.readFileSync(heatmapPath, "utf-8");

// ── 1. Value-diff Engine (Step 1) ──────────────────────────────────────────────
test("SC4 Step 1: PublicScreenerClient maintains prevDataRef keyed by slug", () => {
  assert.ok(
    client.includes("prevDataRef = useRef<Map<string, ScreenerRow>>"),
    "Must maintain prevDataRef keyed by slug"
  );
  assert.ok(
    client.includes("changedSlugs"),
    "Must maintain changedSlugs state"
  );
});

test("SC4 Step 1: Diffs new vs prev per row for price up and price down", () => {
  assert.ok(
    client.includes('diff.set(row.slug, "up")'),
    "Must record price up in diff map"
  );
  assert.ok(
    client.includes('diff.set(row.slug, "down")'),
    "Must record price down in diff map"
  );
});

test("SC4 Step 1: Single source of truth passed to table and heatmap", () => {
  assert.ok(
    client.includes("changedSlugs={changedSlugs}"),
    "Must pass changedSlugs prop"
  );
});

test("SC4 Step 1: Offline rows never get added to diff map", () => {
  assert.ok(
    client.includes("!row.feed_offline") && client.includes("!prev.feed_offline"),
    "Must check feed_offline before diffing prices"
  );
});

// ── 2. 15s Client Poll (Step 2) ────────────────────────────────────────────────
test("SC4 Step 2: Client polling interval reduced to 15_000ms", () => {
  assert.ok(
    client.includes("15_000"),
    "Polling interval must be 15_000ms"
  );
  assert.ok(
    !client.includes("60_000);"),
    "Old 60_000ms interval must not be present in PublicScreenerClient"
  );
});

// ── 3. Row Flash & Key-swap (Step 3) ───────────────────────────────────────────
test("SC4 Step 3: ScreenerTable uses framer-motion backgroundColor animate on rows", () => {
  assert.ok(
    table.includes("<motion.tr"),
    "Desktop table rows must be motion.tr"
  );
  assert.ok(
    table.includes("<motion.div"),
    "Mobile stacked cards must be motion.div"
  );
  assert.ok(
    table.includes("#F0FDF8") && table.includes("#FDF2F2"),
    "Must use exact design tokens --dd-profit-tint (#F0FDF8) and --dd-loss-tint (#FDF2F2)"
  );
  assert.ok(
    table.includes("duration: 0.9"),
    "Row flash must transition over ~900ms"
  );
});

test("SC4 Step 3: Price and %change cells have AnimatePresence key-swap with 4px slide", () => {
  assert.ok(
    table.includes("<AnimatePresence"),
    "Must use AnimatePresence for key-swap"
  );
  assert.ok(
    table.includes("direction === \"down\" ? -4 : 4") || table.includes("-4 : 4"),
    "Must slide up/down 4px on price/change key-swap"
  );
});

// ── 4. Heatmap Tile Pulse (Step 4) ─────────────────────────────────────────────
test("SC4 Step 4: ScreenerHeatmap animates top-edge stripe and box-shadow glow", () => {
  assert.ok(
    heatmap.includes("changedSlugs?.get(item.slug)") || heatmap.includes("changedSlugs"),
    "Heatmap must receive and check changedSlugs"
  );
  assert.ok(
    heatmap.includes("24, 184, 128") || heatmap.includes("#18B880"),
    "Glow must use matching profit color (#18B880)"
  );
  assert.ok(
    heatmap.includes("206, 105, 105") || heatmap.includes("#CE6969"),
    "Glow must use matching loss color (#CE6969)"
  );
  assert.ok(
    heatmap.includes("duration: 0.6"),
    "Stripe & glow animation duration must be ~600ms"
  );
});

test("SC4 Step 4: CORE editorial priority and dimensions unchanged", () => {
  assert.ok(
    heatmap.includes("Core Drawdown Market (Editorial Priority)"),
    "CORE editorial tag disclaimer must be preserved"
  );
  assert.ok(
    heatmap.includes("min-h-[110px] md:min-h-[120px]"),
    "Featured tile dimensions must be preserved"
  );
});

// ── 5. Live Status Indicator (Step 5) ──────────────────────────────────────────
test("SC4 Step 5: Genuine freshness indicator tied to lastUpdated (<20s)", () => {
  assert.ok(
    client.includes("20_000"),
    "Freshness threshold must be exactly 20 seconds (20_000ms)"
  );
  assert.ok(
    client.includes("isFresh"),
    "Must derive isFresh state from lastUpdated"
  );
  assert.ok(
    client.includes("animate-pulse") && client.includes("opacity-100") && client.includes("opacity-35"),
    "Dot must be solid & pulsing when fresh, dimmed when aged"
  );
});

// ── 6. Micro Sparkline (Step 6) ────────────────────────────────────────────────
test("SC4 Step 6: MicroSparkline component uses recharts LineChart (60x20)", () => {
  assert.ok(
    table.includes("MicroSparkline"),
    "Must define and render MicroSparkline"
  );
  assert.ok(
    table.includes("<LineChart width={60} height={20}"),
    "Sparkline must be minimal 60x20 LineChart"
  );
  assert.ok(
    table.includes("stroke={stroke}") || table.includes("isProfit ? \"#18B880\" : \"#CE6969\""),
    "Sparkline stroke must be colored by profit/loss based on net direction"
  );
});

test("SC4 Step 6: Price history client-accumulated up to 12 points without backfill", () => {
  assert.ok(
    client.includes("slice(-12)"),
    "Price history must cap at 12 recent polled points"
  );
  assert.ok(
    client.includes("priceHistory"),
    "PublicScreenerClient must maintain and pass priceHistory"
  );
});

// ── 7. Reduced Motion Support (Step 7) ─────────────────────────────────────────
test("SC4 Step 7: ScreenerTable and ScreenerHeatmap use useReducedMotion", () => {
  assert.ok(
    table.includes("useReducedMotion"),
    "ScreenerTable must import and use useReducedMotion"
  );
  assert.ok(
    heatmap.includes("useReducedMotion"),
    "ScreenerHeatmap must import and use useReducedMotion"
  );
  assert.ok(
    table.includes("shouldReduceMotion"),
    "Table must check shouldReduceMotion"
  );
  assert.ok(
    heatmap.includes("shouldReduceMotion"),
    "Heatmap must check shouldReduceMotion"
  );
});
