import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { SCREENER_INSTRUMENTS, PUBLIC_SCREENER_INSTRUMENTS } from "../src/lib/screener.ts";

test("Screener Registry: exactly 38 approved instruments in master universe", () => {
  assert.equal(SCREENER_INSTRUMENTS.length, 38);
});

test("Public Screener Registry: exactly 32 instruments (stocks excluded for anonymous rate limit safety)", () => {
  assert.equal(PUBLIC_SCREENER_INSTRUMENTS.length, 32);
  const stockCategories = PUBLIC_SCREENER_INSTRUMENTS.filter(
    (i) => i.category === "stocks-uk" || i.category === "stocks-us"
  );
  assert.equal(stockCategories.length, 0);
});

test("Screener Registry: all instruments have valid mappings", () => {
  for (const inst of SCREENER_INSTRUMENTS) {
    assert.ok(inst.scannerSlug, `Missing scannerSlug for ${inst.displayPair}`);
    assert.ok(inst.displayPair, `Missing displayPair for ${inst.scannerSlug}`);
    assert.ok(inst.category, `Missing category for ${inst.scannerSlug}`);
    assert.ok(inst.tvSymbol, `Missing tvSymbol for ${inst.scannerSlug}`);
    assert.ok(inst.tdSymbol, `Missing tdSymbol for ${inst.scannerSlug}`);
    assert.ok(inst.yahooSymbol, `Missing yahooSymbol for ${inst.scannerSlug}`);
  }
});

test("Dedupe Gate: TradingViewScreener.tsx and ScannerTab.tsx are removed", () => {
  const root = process.cwd();
  const tvScreenerPath = path.join(root, "src/components/markets/TradingViewScreener.tsx");
  const scannerTabPath = path.join(root, "src/components/markets/ScannerTab.tsx");

  assert.equal(fs.existsSync(tvScreenerPath), false, "TradingViewScreener.tsx must be deleted");
  assert.equal(fs.existsSync(scannerTabPath), false, "ScannerTab.tsx must be deleted");
});

test("Rate Limit Protection: /api/market-data/[symbol] exports revalidate = 60", () => {
  const routePath = path.join(process.cwd(), "src/app/api/market-data/[symbol]/route.ts");
  const content = fs.readFileSync(routePath, "utf-8");
  assert.ok(content.includes("export const revalidate = 60;"), "market-data route must export revalidate = 60");
});

test("Rate Limit Protection: /api/market/screener exports revalidate = 60", () => {
  const routePath = path.join(process.cwd(), "src/app/api/market/screener/route.ts");
  const content = fs.readFileSync(routePath, "utf-8");
  assert.ok(content.includes("export const revalidate = 60;"), "market screener route must export revalidate = 60");
});

test("Database Migration: saved_screens migration exists", () => {
  const migPath = path.join(process.cwd(), "supabase/migrations/20260923_saved_screens.sql");
  assert.equal(fs.existsSync(migPath), true, "20260923_saved_screens.sql must exist");
  const content = fs.readFileSync(migPath, "utf-8");
  assert.ok(content.includes("create table if not exists saved_screens"));
  assert.ok(content.includes("alter table saved_screens enable row level security;"));
});
