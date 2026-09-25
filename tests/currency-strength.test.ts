import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { computeCurrencyStrengths } from "../src/lib/currency-strength.ts";
import type { CurrencyCode } from "../src/lib/currency-strength.ts";
import type { ScreenerRow } from "../src/lib/screener.ts";

describe("Currency Strength Meter Computation", () => {
  it("calculates correct directional scores and ranks currencies", () => {
    // Mock screener rows with known 24h % moves
    // EURUSD: EUR base (+1), USD quote (-1) -> if EURUSD is +1.0%, EUR gets +1.0%, USD gets -1.0%
    // GBPUSD: GBP base (+1), USD quote (-1) -> if GBPUSD is +2.0%, GBP gets +2.0%, USD gets -2.0%
    // USDJPY: USD base (+1), JPY quote (-1) -> if USDJPY is +1.5%, USD gets +1.5%, JPY gets -1.5%
    const mockRows: ScreenerRow[] = [
      {
        slug: "EURUSD",
        displayPair: "EUR/USD",
        category: "forex",
        price: 1.085,
        changePct: 1.0,
        rsi: 55,
        bias: "BULLISH",
        source: "twelvedata",
        cached_at: new Date().toISOString(),
        feed_offline: false,
      },
      {
        slug: "GBPUSD",
        displayPair: "GBP/USD",
        category: "forex",
        price: 1.295,
        changePct: 2.0,
        rsi: 60,
        bias: "BULLISH",
        source: "twelvedata",
        cached_at: new Date().toISOString(),
        feed_offline: false,
      },
      {
        slug: "USDJPY",
        displayPair: "USD/JPY",
        category: "forex",
        price: 155.0,
        changePct: 1.5,
        rsi: 52,
        bias: "BULLISH",
        source: "twelvedata",
        cached_at: new Date().toISOString(),
        feed_offline: false,
      },
    ];

    const results = computeCurrencyStrengths(mockRows);

    // There must be 8 currencies returned
    assert.equal(results.length, 8);

    const gbp = results.find((r) => r.currency === "GBP");
    const eur = results.find((r) => r.currency === "EUR");
    const usd = results.find((r) => r.currency === "USD");
    const jpy = results.find((r) => r.currency === "JPY");

    assert.ok(gbp && eur && usd && jpy);

    // GBP appears only in GBPUSD here (+2.0%)
    assert.equal(gbp.score, 2.0);
    assert.equal(gbp.activePairCount, 1);
    assert.equal(gbp.pairCount, 4);

    // EUR appears only in EURUSD here (+1.0%)
    assert.equal(eur.score, 1.0);
    assert.equal(eur.activePairCount, 1);
    assert.equal(eur.pairCount, 4);

    // USD contributions:
    // EURUSD: -1.0
    // GBPUSD: -2.0
    // USDJPY: +1.5
    // Mean: (-1.0 - 2.0 + 1.5) / 3 = -1.5 / 3 = -0.5
    assert.equal(usd.score, -0.5);
    assert.equal(usd.activePairCount, 3);
    assert.equal(usd.pairCount, 7);

    // JPY appears in USDJPY: -1.5%
    assert.equal(jpy.score, -1.5);
    assert.equal(jpy.activePairCount, 1);
    assert.equal(jpy.pairCount, 4);

    // Order should be strongest to weakest: GBP (2.0) > EUR (1.0) > USD (-0.5) > JPY (-1.5)
    const scored = results.filter((r) => r.score !== null);
    assert.equal(scored[0].currency, "GBP");
    assert.equal(scored[1].currency, "EUR");
    assert.equal(scored[2].currency, "USD");
    assert.equal(scored[3].currency, "JPY");
  });

  it("handles feed_offline and missing data gracefully", () => {
    const offlineRows: ScreenerRow[] = [
      {
        slug: "EURUSD",
        displayPair: "EUR/USD",
        category: "forex",
        price: null,
        changePct: null,
        rsi: null,
        bias: "NEUTRAL",
        source: "twelvedata",
        cached_at: new Date().toISOString(),
        feed_offline: true,
      },
    ];

    const results = computeCurrencyStrengths(offlineRows);
    assert.equal(results.length, 8);
    for (const r of results) {
      assert.equal(r.score, null);
      assert.equal(r.activePairCount, 0);
      assert.equal(r.feed_offline, true);
    }
  });
});
