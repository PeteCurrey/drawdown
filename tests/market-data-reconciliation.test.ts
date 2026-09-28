import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { SCREENER_INSTRUMENTS, PUBLIC_SCREENER_INSTRUMENTS, getInstrumentBySlug } from "../src/lib/screener.ts";
import { slugMatches, getExpandedVariants } from "../src/hooks/useMarketCache.ts";

const root = process.cwd();

// ─── 1. Canonical Instrument Registry ─────────────────────────────────────────

test("Canonical Registry: Exactly 38 master instruments with uniform schema", () => {
  assert.equal(SCREENER_INSTRUMENTS.length, 38, "Master registry must contain exactly 38 instruments");
  for (const inst of SCREENER_INSTRUMENTS) {
    assert.ok(inst.scannerSlug, `Instrument must have scannerSlug`);
    assert.ok(inst.displayPair, `Instrument ${inst.scannerSlug} must have displayPair`);
    assert.ok(inst.category, `Instrument ${inst.scannerSlug} must have category`);
    assert.ok(inst.tvSymbol, `Instrument ${inst.scannerSlug} must have tvSymbol`);
    assert.ok(inst.tdSymbol, `Instrument ${inst.scannerSlug} must have tdSymbol`);
    assert.ok(inst.yahooSymbol, `Instrument ${inst.scannerSlug} must have yahooSymbol`);
  }
});

test("Canonical Registry: All 12 required test instruments exist and are correctly mapped", () => {
  const REQUIRED_SYMBOLS = [
    { slug: "XAUUSD",  display: "XAU/USD",  td: "XAU/USD",  yahoo: "GC=F",     tv: "OANDA:XAUUSD" },
    { slug: "NDX",     display: "NAS100",   td: "NDX",      yahoo: "^NDX",     tv: "TVC:NDX" },
    { slug: "EURUSD",  display: "EUR/USD",  td: "EUR/USD",  yahoo: "EURUSD=X", tv: "FX:EURUSD" },
    { slug: "GBPUSD",  display: "GBP/USD",  td: "GBP/USD",  yahoo: "GBPUSD=X", tv: "FX:GBPUSD" },
    { slug: "USDJPY",  display: "USD/JPY",  td: "USD/JPY",  yahoo: "USDJPY=X", tv: "FX:USDJPY" },
    { slug: "BTCUSDT", display: "BTC/USD",  td: "BTC/USD",  yahoo: "BTC-USD",  tv: "BINANCE:BTCUSDT" },
    { slug: "ETHUSDT", display: "ETH/USD",  td: "ETH/USD",  yahoo: "ETH-USD",  tv: "BINANCE:ETHUSDT" },
    { slug: "SPX",     display: "US500",    td: "SPX",      yahoo: "^GSPC",    tv: "TVC:SPX" },
    { slug: "DJI",     display: "US30",     td: "DJI",      yahoo: "^DJI",     tv: "TVC:DJI" },
    { slug: "UKX",     display: "UK100",    td: "FTSE",     yahoo: "^FTSE",    tv: "TVC:UKX" },
    { slug: "WTIUSD",  display: "WTI Oil",  td: "WTI/USD",  yahoo: "CL=F",     tv: "NYMEX:CL1!" },
    { slug: "XAGUSD",  display: "XAG/USD",  td: "XAG/USD",  yahoo: "SI=F",     tv: "OANDA:XAGUSD" },
  ];

  for (const item of REQUIRED_SYMBOLS) {
    const found = getInstrumentBySlug(item.slug);
    assert.ok(found, `Instrument ${item.slug} must be in canonical registry`);
    assert.equal(found.displayPair, item.display, `Display pair mismatch for ${item.slug}`);
    assert.equal(found.tdSymbol, item.td, `Twelve Data symbol mismatch for ${item.slug}`);
    assert.equal(found.yahooSymbol, item.yahoo, `Yahoo symbol mismatch for ${item.slug}`);
    assert.equal(found.tvSymbol, item.tv, `TradingView symbol mismatch for ${item.slug}`);
  }
});

// ─── 2. Single Source of Truth: Screener & Scanner Pipeline ───────────────────

test("Single Source of Truth: ScannerClient uses SCREENER_INSTRUMENTS from screener.ts", () => {
  const scannerPath = path.join(root, "src/components/dashboard/ScannerClient.tsx");
  const content = fs.readFileSync(scannerPath, "utf-8");
  assert.ok(
    content.includes('import { SCREENER_INSTRUMENTS'),
    "ScannerClient must import SCREENER_INSTRUMENTS from @/lib/screener"
  );
  assert.ok(
    content.includes("export const SCANNER_INSTRUMENTS: ScannerInstrument[] = SCREENER_INSTRUMENTS;"),
    "SCANNER_INSTRUMENTS must directly equal SCREENER_INSTRUMENTS"
  );
});

test("Single Source of Truth: useMarketCache consumes /api/market/screener?dashboard=1", () => {
  const cachePath = path.join(root, "src/hooks/useMarketCache.ts");
  const content = fs.readFileSync(cachePath, "utf-8");
  assert.ok(
    content.includes('/api/market/screener?dashboard=1'),
    "useMarketCache must fetch from canonical /api/market/screener?dashboard=1"
  );
  assert.ok(
    content.includes("fetchAuthoritativeScreenerData"),
    "useMarketCache must have shared deduplicated fetchAuthoritativeScreenerData function"
  );
});

test("Single Source of Truth: /api/market/screener exports 60s cache and dashboard support", () => {
  const screenerRoute = path.join(root, "src/app/api/market/screener/route.ts");
  const content = fs.readFileSync(screenerRoute, "utf-8");
  assert.ok(content.includes("export const revalidate = 60;"), "screener route must export revalidate = 60");
  assert.ok(content.includes('searchParams.get("dashboard") === "1"'), "screener route must support ?dashboard=1 mode");
  assert.ok(content.includes("market_data_cache"), "screener route must cache in Supabase market_data_cache table");
});

test("Single Source of Truth: /api/market-data/[symbol] integrates canonical screener cache", () => {
  const servicePath = path.join(root, "src/lib/canonicalMarketService.ts");
  const content = fs.readFileSync(servicePath, "utf-8");
  assert.ok(
    content.includes("getCanonicalQuoteFromCache"),
    "canonicalMarketService must check canonical quote cache"
  );
  assert.ok(
    content.includes("market_data_cache"),
    "canonicalMarketService must query market_data_cache for spot quote"
  );
});

// ─── 3. Alias & Equivalence Resolution ────────────────────────────────────────

test("Equivalence Resolution: slugMatches accurately bridges all platform variants", () => {
  // Gold variants
  assert.ok(slugMatches("XAUUSD", "XAU/USD"), "XAUUSD matches XAU/USD");
  assert.ok(slugMatches("XAU/USD", "XAUUSD"), "XAU/USD matches XAUUSD");

  // Nasdaq variants
  assert.ok(slugMatches("NDX", "NAS100"), "NDX matches NAS100");
  assert.ok(slugMatches("NAS100", "NDX"), "NAS100 matches NDX");
  assert.ok(slugMatches("US100", "NDX"), "US100 matches NDX");

  // FTSE variants
  assert.ok(slugMatches("UKX", "UK100"), "UKX matches UK100");
  assert.ok(slugMatches("FTSE", "UKX"), "FTSE matches UKX");

  // S&P variants
  assert.ok(slugMatches("SPX", "US500"), "SPX matches US500");
  assert.ok(slugMatches("SPX500", "SPX"), "SPX500 matches SPX");

  // Dow variants
  assert.ok(slugMatches("DJI", "US30"), "DJI matches US30");

  // Oil variants
  assert.ok(slugMatches("WTIUSD", "WTI/USD"), "WTIUSD matches WTI/USD");
  assert.ok(slugMatches("WTI", "WTIUSD"), "WTI matches WTIUSD");

  // Crypto variants
  assert.ok(slugMatches("BTCUSDT", "BTC/USD"), "BTCUSDT matches BTC/USD");
  assert.ok(slugMatches("BTCUSD", "BTC/USD"), "BTCUSD matches BTC/USD");
  assert.ok(slugMatches("ETHUSDT", "ETH/USD"), "ETHUSDT matches ETH/USD");
});

// ─── 4. Provenance and Timestamp Integrity ───────────────────────────────────

test("Data Provenance: ScreenerRow schema exposes timestamps and offline flags", () => {
  const screenerPath = path.join(root, "src/lib/screener.ts");
  const content = fs.readFileSync(screenerPath, "utf-8");
  assert.ok(content.includes("cached_at: string;"), "ScreenerRow must include cached_at");
  assert.ok(content.includes("provider_timestamp?: string | null;"), "ScreenerRow must include provider_timestamp");
  assert.ok(content.includes("feed_offline: boolean;"), "ScreenerRow must include feed_offline");
  assert.ok(content.includes("prevClose?: number | null;"), "ScreenerRow must include prevClose");
});

// ─── 5. Fail-Closed Guarantees ────────────────────────────────────────────────

test("Fail-Closed Safety: No synthetic fallback candles exist in production", () => {
  const marketPath = path.join(root, "src/lib/market.ts");
  const content = fs.readFileSync(marketPath, "utf-8");
  assert.ok(
    content.includes("export function generateFallbackHistory"),
    "generateFallbackHistory must be defined"
  );
  assert.ok(
    content.includes("return [];"),
    "generateFallbackHistory must always return empty array []"
  );
});

test("Fail-Closed Safety: signal-engine does not fall back to synthetic data", () => {
  const signalPath = path.join(root, "src/lib/signal-engine.ts");
  const content = fs.readFileSync(signalPath, "utf-8");
  assert.ok(
    !content.includes("data = generateSimulatedTwelveData("),
    "signal-engine must not call generateSimulatedTwelveData"
  );
  assert.ok(
    content.includes("Skipping signal generation — no synthetic fallback"),
    "signal-engine must explicitly skip when Twelve Data is unavailable"
  );
});
