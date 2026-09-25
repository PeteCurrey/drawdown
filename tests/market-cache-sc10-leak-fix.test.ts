import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { slugMatches, getExpandedVariants } from "../src/hooks/useMarketCache.ts";
import { isTwelveDataExhausted, tripTwelveDataCircuitBreaker, resetTwelveDataCircuitBreaker } from "../src/lib/market-circuit-breaker.ts";

test("PROMPT SC10: Bidirectional alias resolution in useMarketCache", () => {
  // Direct and normalized matches
  assert.ok(slugMatches("EURUSD", "EUR/USD"), "EURUSD matches EUR/USD");
  assert.ok(slugMatches("EUR/USD", "EURUSD"), "EUR/USD matches EURUSD");
  
  // Crypto USDT <-> USD
  assert.ok(slugMatches("BTCUSDT", "BTC/USD"), "BTCUSDT matches BTC/USD");
  assert.ok(slugMatches("BTC/USD", "BTCUSDT"), "BTC/USD matches BTCUSDT");
  assert.ok(slugMatches("ETHUSDT", "ETH/USD"), "ETHUSDT matches ETH/USD");
  assert.ok(slugMatches("SOLUSDT", "SOL/USD"), "SOLUSDT matches SOL/USD");

  // Equivalence clusters
  assert.ok(slugMatches("UKX", "UK100"), "UKX matches UK100");
  assert.ok(slugMatches("UK100", "UKX"), "UK100 matches UKX");
  assert.ok(slugMatches("FTSE", "UKX"), "FTSE matches UKX");
  assert.ok(slugMatches("DAX", "GER40"), "DAX matches GER40");
  assert.ok(slugMatches("GER40", "DAX"), "GER40 matches DAX");
  assert.ok(slugMatches("SPX", "SPX500"), "SPX matches SPX500");
  assert.ok(slugMatches("SPX500", "US500"), "SPX500 matches US500");
  assert.ok(slugMatches("WTIUSD", "WTI/USD"), "WTIUSD matches WTI/USD");
  assert.ok(slugMatches("EURCHF", "EUR/CHF"), "EURCHF matches EUR/CHF");

  // Variants generation includes all representations
  const btcVariants = getExpandedVariants("BTCUSDT");
  assert.ok(btcVariants.includes("BTCUSD"), "BTCUSDT variants include BTCUSD");
  assert.ok(btcVariants.includes("BTC/USD"), "BTCUSDT variants include BTC/USD");

  const ukxVariants = getExpandedVariants("UKX");
  assert.ok(ukxVariants.includes("UK100"), "UKX variants include UK100");
  assert.ok(ukxVariants.includes("FTSE"), "UKX variants include FTSE");
});

test("PROMPT SC10: Twelve Data circuit breaker trips and resets", () => {
  resetTwelveDataCircuitBreaker();
  assert.equal(isTwelveDataExhausted(), false, "Initial circuit breaker is closed (not exhausted)");

  tripTwelveDataCircuitBreaker(60000);
  assert.equal(isTwelveDataExhausted(), true, "Circuit breaker is open (exhausted) after trip");

  resetTwelveDataCircuitBreaker();
  assert.equal(isTwelveDataExhausted(), false, "Circuit breaker resets cleanly");
});

test("PROMPT SC10: update-prices cron covers 38-instrument set and market-data/batch exists", () => {
  const cronFile = fs.readFileSync(
    path.join(process.cwd(), "src/app/api/cron/update-prices/route.ts"),
    "utf-8"
  );
  assert.ok(cronFile.includes("EUR/CHF"), "cron includes EUR/CHF");
  assert.ok(cronFile.includes("XRP/USD"), "cron includes XRP/USD");
  assert.ok(cronFile.includes("AAPL"), "cron includes AAPL");
  assert.ok(cronFile.includes("BARC"), "cron includes BARC");
  assert.ok(cronFile.includes("isTwelveDataExhausted"), "cron checks Twelve Data circuit breaker");

  const batchFile = fs.readFileSync(
    path.join(process.cwd(), "src/app/api/market-data/batch/route.ts"),
    "utf-8"
  );
  assert.ok(batchFile.includes("export async function GET"), "batch route exports GET");
  assert.ok(batchFile.includes("isTwelveDataExhausted"), "batch route checks Twelve Data circuit breaker");
  assert.ok(batchFile.includes("/price?symbol="), "batch route uses single /price query");
});
