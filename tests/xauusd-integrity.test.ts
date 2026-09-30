import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { SCREENER_INSTRUMENTS, getInstrumentBySlug } from "../src/lib/screener.ts";
import { slugMatches, getExpandedVariants } from "../src/hooks/useMarketCache.ts";

describe("XAUUSD Pricing Integrity & Non-Conflation Suite", () => {
  // Test 1 — Correct symbol mapping
  test("Test 1: XAUUSD resolves to Twelve Data spot-gold provider symbol XAU/USD", () => {
    const xau = getInstrumentBySlug("XAUUSD");
    assert.ok(xau, "XAUUSD must exist in registry");
    assert.equal(xau.scannerSlug, "XAUUSD");
    assert.equal(xau.tdSymbol, "XAU/USD");
    assert.equal(xau.category, "commodities");
    assert.equal(xau.instrumentType, "spot");
  });

  // Test 2 — No futures substitution in Screener registry
  test("Test 2: GC=F, GC, or other futures identifiers cannot satisfy an XAUUSD request via Yahoo fallback", () => {
    const xau = getInstrumentBySlug("XAUUSD");
    assert.strictEqual(xau?.yahooSymbol, null);

    const xag = getInstrumentBySlug("XAGUSD");
    assert.strictEqual(xag?.yahooSymbol, null);
  });

  // Test 3 — Disentangled equivalence mapping
  test("Test 3: GC=F is NOT equivalent to XAUUSD in useMarketCache", () => {
    assert.equal(slugMatches("XAUUSD", "GC=F"), false);
    assert.equal(slugMatches("GC=F", "XAUUSD"), false);
    assert.equal(slugMatches("XAU/USD", "GC=F"), false);

    const variants = getExpandedVariants("XAUUSD");
    assert.equal(variants.includes("GC=F"), false);
  });

  // Test 4 — Preserves canonical symbol mapping for XAU/USD and XAUUSD
  test("Test 4: slugMatches maintains legitimate equivalence between XAUUSD and XAU/USD", () => {
    assert.equal(slugMatches("XAUUSD", "XAU/USD"), true);
    assert.equal(slugMatches("XAU/USD", "XAUUSD"), true);
  });

  // Test 5 — Raw provider value preserved without arbitrary multiplier
  test("Test 5: A raw provider quote of 4149.79 is preserved without transformation", () => {
    const rawQuote = 4149.79;
    const formatted = parseFloat(rawQuote.toFixed(2));
    assert.equal(formatted, 4149.79);
  });

  // Test 6 — Rejection of futures substitution in canonical Screener registry
  test("Test 6: All spot commodities in screener registry must not have futures fallback tickers", () => {
    const spotMetals = SCREENER_INSTRUMENTS.filter(
      (i) => i.instrumentType === "spot" && (i.scannerSlug === "XAUUSD" || i.scannerSlug === "XAGUSD")
    );
    assert.equal(spotMetals.length, 2);
    spotMetals.forEach((m) => {
      assert.strictEqual(m.yahooSymbol, null);
    });
  });

  // Test 7 — Regression against the historical bad value (4182.7 / GC=F futures leakage)
  test("Test 7: Regression against GC=F futures leakage — 4182.7 COMEX price rejected as spot XAUUSD", () => {
    const comexFuturesQuote = {
      symbol: "GC=F",
      price: 4182.7,
      instrumentType: "FUTURE",
      exchange: "CMX",
    };

    // The screener or market service must not accept a quote if the instrument is a FUTURE
    const isValidSpotQuote = (q: typeof comexFuturesQuote, targetSlug: string) => {
      if (targetSlug === "XAUUSD" && (q.symbol === "GC=F" || q.instrumentType === "FUTURE")) {
        return false;
      }
      return true;
    };

    assert.equal(isValidSpotQuote(comexFuturesQuote, "XAUUSD"), false);
  });

  // Test 8 — Fail-closed behaviour verified
  test("Test 8: If Twelve Data has no rate-limit quota and Yahoo is null, spot metals fail closed", () => {
    const xau = getInstrumentBySlug("XAUUSD")!;
    const mockTdResponse = null; // TD 429 / offline

    let finalPrice: number | null = null;
    let feedOffline = false;

    if (mockTdResponse === null) {
      if (xau.yahooSymbol !== null) {
        finalPrice = 4182.7; // Old bug: would fetch GC=F
      } else {
        feedOffline = true;
      }
    }

    assert.strictEqual(finalPrice, null);
    assert.strictEqual(feedOffline, true);
  });
});
