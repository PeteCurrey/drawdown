/* eslint-disable @typescript-eslint/no-explicit-any */
import { test } from "node:test";
import assert from "node:assert/strict";
import { fetchAutochartistData } from "../src/lib/providers/autochartist.ts";
import { fetchTradingCentralData } from "../src/lib/providers/trading-central.ts";
import { fetchOnChainAnalytics } from "../src/lib/providers/onchain-analytics.ts";
import { NOT_CONNECTED } from "../src/lib/data-states.ts";

test("Autochartist provider returns NOT_CONNECTED and zero synthetic patterns when key is missing", async () => {
  delete process.env.AUTOCHARTIST_API_KEY;
  const result = await fetchAutochartistData("EUR/USD", "1H", 1.0850, 0.0040, "BULLISH");
  
  assert.equal(result.status, NOT_CONNECTED);
  assert.equal(result.provider, "Autochartist");
  assert.match(result.message, /not currently connected/i);
  // Ensure no synthetic patterns leaked
  assert.equal((result as any).activePatterns, undefined);
});

test("Trading Central provider returns NOT_CONNECTED and no synthetic consensus when key is missing", async () => {
  delete process.env.TRADING_CENTRAL_API_KEY;
  const result = await fetchTradingCentralData("GBP/USD", 1.2950, 0.0050, "BEARISH", 4);

  assert.equal(result.status, NOT_CONNECTED);
  assert.equal(result.provider, "Trading Central");
  assert.match(result.message, /not currently connected/i);
  assert.equal((result as any).tcConsensusScore, undefined);
  assert.equal((result as any).analystSignal, undefined);
});

test("On-Chain provider returns NOT_CONNECTED for crypto when key is missing, and null for non-crypto", async () => {
  delete process.env.GLASSNODE_API_KEY;
  
  // Non-crypto should return null (not applicable)
  const fxResult = await fetchOnChainAnalytics("EUR/USD", "BULLISH");
  assert.equal(fxResult, null);

  // Crypto without key should return NOT_CONNECTED
  const btcResult = await fetchOnChainAnalytics("BTC/USD", "BULLISH");
  assert.notEqual(btcResult, null);
  assert.equal(btcResult?.status, NOT_CONNECTED);
  assert.equal((btcResult as any)?.mvrvZScore, undefined);
  assert.equal((btcResult as any)?.galaxyScore, undefined);
});
