/**
 * Currency Strength Meter — pure derivation utility.
 *
 * Takes ScreenerRow[] (already fetched from /api/market/screener) and computes a
 * relative momentum score for each of the 8 FX majors.
 *
 * Formula:
 *   score(C) = mean( sign × changePct )  for every pair containing currency C
 *   where sign = +1 when C is the base currency, −1 when C is the quote currency.
 *
 * This is a relative momentum indicator only — NOT an absolute currency value or
 * a fabricated unit. It reflects average 24h % move direction for each currency
 * across all currently tracked cross pairs in SCREENER_INSTRUMENTS.
 *
 * No Twelve Data calls are made here. Zero new API credits consumed.
 *
 * v2 note: Full 7-pair-per-currency coverage (28 pairs total) would require adding
 * 14 additional SCREENER_INSTRUMENTS entries and new Twelve Data credits. Deferred
 * until SC9 (Twelve Data usage investigation) is resolved and credit headroom confirmed.
 */

import type { ScreenerRow } from "@/lib/screener";

export type CurrencyCode = "USD" | "EUR" | "GBP" | "JPY" | "CHF" | "CAD" | "AUD" | "NZD";

export interface CurrencyStrength {
  currency: CurrencyCode;
  /** Human-readable name */
  label: string;
  /**
   * Average signed 24h % contribution across all pairs containing this currency.
   * Positive = net stronger over 24h, Negative = net weaker.
   * null when all contributing pairs are feed_offline or changePct is null.
   */
  score: number | null;
  /** Number of tracked pairs this currency appears in */
  pairCount: number;
  /** Total pairs that had live (non-null) data used in the calculation */
  activePairCount: number;
  /** Array of screener slugs used in calculation */
  pairsUsed: string[];
  /** True if none of the pairs had usable data */
  feed_offline: boolean;
}

const CURRENCY_LABELS: Record<CurrencyCode, string> = {
  USD: "US Dollar",
  EUR: "Euro",
  GBP: "British Pound",
  JPY: "Japanese Yen",
  CHF: "Swiss Franc",
  CAD: "Canadian Dollar",
  AUD: "Australian Dollar",
  NZD: "New Zealand Dollar",
};

/**
 * Maps every FX pair slug (from SCREENER_INSTRUMENTS) to the currencies it
 * contributes to, with the sign applied to changePct for each.
 *
 * sign convention: if changePct is positive (pair rose), base currency strengthened
 * relative to the quote, so base gets +1 × changePct, quote gets −1 × changePct.
 *
 * Only pairs whose category === "forex" are relevant; non-FX slugs are ignored.
 */
const PAIR_CONTRIBUTIONS: Record<
  string, // screener slug
  Array<{ currency: CurrencyCode; sign: 1 | -1 }>
> = {
  // ── FX Majors ──────────────────────────────────────────────────────────────
  EURUSD: [
    { currency: "EUR", sign: 1 },
    { currency: "USD", sign: -1 },
  ],
  GBPUSD: [
    { currency: "GBP", sign: 1 },
    { currency: "USD", sign: -1 },
  ],
  USDJPY: [
    { currency: "USD", sign: 1 },
    { currency: "JPY", sign: -1 },
  ],
  USDCHF: [
    { currency: "USD", sign: 1 },
    { currency: "CHF", sign: -1 },
  ],
  AUDUSD: [
    { currency: "AUD", sign: 1 },
    { currency: "USD", sign: -1 },
  ],
  NZDUSD: [
    { currency: "NZD", sign: 1 },
    { currency: "USD", sign: -1 },
  ],
  USDCAD: [
    { currency: "USD", sign: 1 },
    { currency: "CAD", sign: -1 },
  ],
  EURGBP: [
    { currency: "EUR", sign: 1 },
    { currency: "GBP", sign: -1 },
  ],
  // ── FX Crosses ─────────────────────────────────────────────────────────────
  GBPJPY: [
    { currency: "GBP", sign: 1 },
    { currency: "JPY", sign: -1 },
  ],
  EURJPY: [
    { currency: "EUR", sign: 1 },
    { currency: "JPY", sign: -1 },
  ],
  GBPCAD: [
    { currency: "GBP", sign: 1 },
    { currency: "CAD", sign: -1 },
  ],
  AUDCAD: [
    { currency: "AUD", sign: 1 },
    { currency: "CAD", sign: -1 },
  ],
  CADJPY: [
    { currency: "CAD", sign: 1 },
    { currency: "JPY", sign: -1 },
  ],
  EURCHF: [
    { currency: "EUR", sign: 1 },
    { currency: "CHF", sign: -1 },
  ],
};

/** All 8 FX major currency codes, in a stable display order (before ranking). */
const ALL_CURRENCIES: CurrencyCode[] = [
  "USD", "EUR", "GBP", "JPY", "CHF", "CAD", "AUD", "NZD",
];

/**
 * Compute relative strength scores for the 8 FX majors.
 *
 * @param rows - Full screener row array from /api/market/screener (forex or all).
 * @returns Array of 8 CurrencyStrength entries, sorted strongest → weakest.
 *          Currencies with no live data sort to the bottom.
 */
export function computeCurrencyStrengths(rows: ScreenerRow[]): CurrencyStrength[] {
  // Index screener rows by slug for O(1) lookup
  const rowBySlug = new Map<string, ScreenerRow>();
  for (const row of rows) {
    rowBySlug.set(row.slug, row);
  }

  const results: CurrencyStrength[] = ALL_CURRENCIES.map((currency) => {
    // Find all pair slugs that contribute to this currency
    const contributingEntries = Object.entries(PAIR_CONTRIBUTIONS).filter(([, contributions]) =>
      contributions.some((c) => c.currency === currency)
    );

    const pairSlugs = contributingEntries.map(([slug]) => slug);
    const pairCount = pairSlugs.length;

    // Accumulate signed contributions from live pairs
    const contributions: number[] = [];

    for (const [slug, contribList] of contributingEntries) {
      const row = rowBySlug.get(slug);
      if (!row || row.feed_offline || row.changePct === null) continue;

      const entry = contribList.find((c) => c.currency === currency);
      if (!entry) continue;

      contributions.push(entry.sign * row.changePct);
    }

    const activePairCount = contributions.length;

    const score =
      activePairCount > 0
        ? parseFloat(
            (contributions.reduce((acc, v) => acc + v, 0) / activePairCount).toFixed(4)
          )
        : null;

    return {
      currency,
      label: CURRENCY_LABELS[currency],
      score,
      pairCount,
      activePairCount,
      pairsUsed: pairSlugs,
      feed_offline: activePairCount === 0,
    };
  });

  // Sort: live currencies strongest first, offline currencies at bottom
  return results.sort((a, b) => {
    if (a.score === null && b.score === null) return 0;
    if (a.score === null) return 1;
    if (b.score === null) return -1;
    return b.score - a.score;
  });
}
