"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

export interface CachedMarketData {
  symbol: string;
  price: number | null;
  change_pct: number | null;
  rsi: number | null;
  ema50: number | null;
  ema200: number | null;
  momentum_signal: "BULLISH" | "BEARISH" | "NEUTRAL" | null;
  source: string | null;
  fetched_at: string | null;
  loading: boolean;
  error: boolean;
  // Compatibility properties
  atr: number | null;
  volumePct: number | null;
  consensus?: any;
  bid: number | null;
  ask: number | null;
  spread: number | null;
  rows?: any[];
  keyLevels?: any;
  emaStack?: any;
  prevClose: number | null;
  freshness?: "LIVE" | "RECENT" | "STALE" | "UNAVAILABLE";
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const POLL_INTERVAL = 30_000;

// Map from dashboard hookSlug → the symbol string accepted by /api/market-data/[symbol]
const HOOKSLUG_TO_API: Record<string, string> = {
  WTIUSD:  "WTIUSD",
  NATGAS:  "NATGAS",
  COPPER:  "COPPER",
  SPX:     "SPX",
  NDX:     "NDX",
  DJI:     "DJI",
  FTSE:    "FTSE",
  DAX:     "DAX",
  NIKKEI:  "NIKKEI",
  ASX200:  "ASX200",
};

// Equivalence clusters: all representations of the same instrument
const EQUIVALENCE_GROUPS: string[][] = [
  ["UKX", "UK100", "FTSE"],
  ["SPX", "SPX500", "US500"],
  ["NDX", "NAS100", "US100"],
  ["DJI", "US30", "DOW"],
  ["DAX", "GER40"],
  ["NIKKEI", "JPN225"],
  ["ASX200", "AUS200"],
  ["WTIUSD", "WTI/USD", "WTI", "CL=F"],
  ["NATGAS", "NG=F"],
  ["COPPER", "HG=F"],
  ["XAUUSD", "XAU/USD", "GC=F"],
  ["XAGUSD", "XAG/USD", "SI=F"],
  ["EURCHF", "EUR/CHF"],
  ["BARC", "BARC:LSE", "BARC.L"],
  ["LLOY", "LLOY:LSE", "LLOY.L"],
  ["SHEL", "SHEL:LSE", "SHEL.L"],
];

function normSymbol(s: string): string {
  return (s || "").replace(/[\/\-_:\s]/g, "").toUpperCase();
}

// Bidirectional alias index built dynamically
const BIDIRECTIONAL_MAP = new Map<string, Set<string>>();

function registerEquivalence(a: string, b: string) {
  const na = normSymbol(a);
  const nb = normSymbol(b);
  if (!BIDIRECTIONAL_MAP.has(na)) BIDIRECTIONAL_MAP.set(na, new Set());
  if (!BIDIRECTIONAL_MAP.has(nb)) BIDIRECTIONAL_MAP.set(nb, new Set());
  BIDIRECTIONAL_MAP.get(na)!.add(nb).add(na);
  BIDIRECTIONAL_MAP.get(nb)!.add(na).add(nb);
}

EQUIVALENCE_GROUPS.forEach(group => {
  for (let i = 0; i < group.length; i++) {
    for (let j = 0; j < group.length; j++) {
      registerEquivalence(group[i], group[j]);
    }
  }
});

export function getExpandedVariants(s: string): string[] {
  const n = normSymbol(s);
  const variants = new Set<string>([s, n]);
  // Handle USDT <-> USD
  if (n.endsWith("USDT")) {
    const usd = n.slice(0, -4) + "USD";
    variants.add(usd);
    variants.add(n.slice(0, -4) + "/USD");
  } else if (n.endsWith("USD") && n.length === 6) {
    variants.add(n + "T");
    variants.add(n.slice(0, 3) + "/" + n.slice(3));
  } else if (n.length === 6 && !n.includes("/")) {
    variants.add(n.slice(0, 3) + "/" + n.slice(3));
  }
  const mapped = BIDIRECTIONAL_MAP.get(n);
  if (mapped) {
    mapped.forEach(v => variants.add(v));
  }
  return Array.from(variants);
}

function makeEmpty(s: string, loading = true): CachedMarketData {
  return {
    symbol: s, price: null, change_pct: null, rsi: null, ema50: null,
    ema200: null, momentum_signal: null, source: null, fetched_at: null,
    loading, error: false, bid: null, ask: null, spread: null, prevClose: null,
    atr: null, volumePct: null,
  };
}

export function slugMatches(hookSlug: string, rowSymbol: string): boolean {
  const na = normSymbol(hookSlug);
  const nb = normSymbol(rowSymbol);
  if (na === nb) return true;
  // Crypto USDT <-> USD
  if (na.endsWith("USDT") && na.slice(0, -4) + "USD" === nb) return true;
  if (nb.endsWith("USDT") && nb.slice(0, -4) + "USD" === na) return true;
  // Equivalence clusters in either direction
  const setA = BIDIRECTIONAL_MAP.get(na);
  if (setA && setA.has(nb)) return true;
  const setB = BIDIRECTIONAL_MAP.get(nb);
  if (setB && setB.has(na)) return true;
  return false;
}

/**
 * Fetch a single live price from /api/market-data/[symbol]?priceOnly=true.
 * This endpoint uses Twelve Data → Yahoo Finance; zero hardcoded values.
 * Returns an error state (price: null, error: true) if the feed is offline.
 */
async function fetchLivePrice(hookSlug: string): Promise<CachedMarketData> {
  const apiSymbol = HOOKSLUG_TO_API[hookSlug] ?? hookSlug;
  try {
    const res = await fetch(
      `/api/market-data/${encodeURIComponent(apiSymbol)}?priceOnly=true`,
      { cache: "no-store", signal: AbortSignal.timeout(8000) }
    );

    if (!res.ok) {
      return { ...makeEmpty(hookSlug, false), error: true };
    }

    const d = await res.json();

    if (d?.is_fallback || d?.price === null || d?.price === undefined) {
      return { ...makeEmpty(hookSlug, false), error: true };
    }

    return {
      symbol: hookSlug,
      price: d.price,
      change_pct: d.changePct ?? null,
      prevClose: d.prevClose ?? null,
      rsi: null,
      ema50: null,
      ema200: null,
      momentum_signal: null,
      source: d.source ?? "live",
      fetched_at: d.cached_at ?? new Date().toISOString(),
      loading: false,
      error: false,
      atr: null,
      volumePct: null,
      bid: null,
      ask: null,
      spread: null,
    };
  } catch {
    return { ...makeEmpty(hookSlug, false), error: true };
  }
}

export function useMarketCache(slugs: string[]): Record<string, CachedMarketData> {
  const key = slugs.join(",");

  const [data, setData] = useState<Record<string, CachedMarketData>>(() => {
    const init: Record<string, CachedMarketData> = {};
    slugs.forEach(s => { init[s] = makeEmpty(s); });
    return init;
  });

  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async () => {
    if (slugs.length === 0) return;

    // Build an expanded set of symbols to maximise Supabase cache hits
    const expandedSlugs = Array.from(new Set(slugs.flatMap(s => getExpandedVariants(s))));

    // ── Step 1: Try Supabase price_cache ──────────────────────────────────────
    // Track which slugs we find real data for
    const resolvedSlugs = new Set<string>();
    const nextData: Record<string, CachedMarketData> = {};

    try {
      const { data: rows, error } = await supabase
        .from("price_cache")
        .select("*")
        .in("symbol", expandedSlugs);

      if (error) {
        console.warn("[useMarketCache] Supabase error:", error.message);
      } else if (rows && rows.length > 0) {
        rows.forEach((row: any) => {
          const targetKey = slugs.find(s => slugMatches(s, row.symbol ?? ""));
          if (targetKey && !resolvedSlugs.has(targetKey)) {
            const ageMs = row.fetched_at ? Date.now() - new Date(row.fetched_at).getTime() : Infinity;
            const freshness: "LIVE" | "RECENT" | "STALE" | "UNAVAILABLE" =
              ageMs < 60_000 ? "LIVE" : ageMs < 300_000 ? "RECENT" : ageMs < 900_000 ? "STALE" : "UNAVAILABLE";

            // If the cached price is younger than 15 minutes, accept it
            if (ageMs < 900_000) {
              resolvedSlugs.add(targetKey);
            }

            nextData[targetKey] = {
              symbol: targetKey,
              price: row.price ?? null,
              change_pct: row.change_pct ?? null,
              rsi: row.rsi ?? null,
              ema50: row.ema50 ?? null,
              ema200: row.ema200 ?? null,
              momentum_signal: row.momentum_signal ?? null,
              source: row.source ?? null,
              fetched_at: row.fetched_at ?? null,
              loading: false,
              error: false,
              freshness,
              // These fields are not stored in DB — set to null (not fake)
              atr: null,
              volumePct: null,
              bid: null,
              ask: null,
              spread: null,
              prevClose: null,
            };
          }
        });
      }
    } catch (err: any) {
      console.warn("[useMarketCache] Supabase exception:", err.message);
    }

    // ── Step 2: Fetch live prices for any slug still missing (Batched single request) ──
    const missingSlugs = slugs.filter(s => !resolvedSlugs.has(s));

    if (missingSlugs.length > 0) {
      try {
        const batchRes = await fetch(
          `/api/market-data/batch?symbols=${encodeURIComponent(missingSlugs.join(","))}`,
          { signal: AbortSignal.timeout(8000) }
        );
        if (batchRes.ok) {
          const batchJson = await batchRes.json();
          missingSlugs.forEach(slug => {
            const item = batchJson[slug];
            if (item && item.price !== null) {
              nextData[slug] = {
                ...makeEmpty(slug, false),
                symbol: slug,
                price: item.price,
                change_pct: item.changePct ?? null,
                prevClose: item.prevClose ?? null,
                source: item.source ?? "batch",
                fetched_at: item.cached_at ?? new Date().toISOString(),
                error: false,
                loading: false,
                freshness: "LIVE",
              };
            }
          });
        }
      } catch (err: any) {
        console.warn("[useMarketCache] Batched fallback fetch error:", err.message);
      }

      // Any slug still unpopulated after batch falls back to individual fetchLivePrice as safeguard
      const stillMissing = missingSlugs.filter(s => !nextData[s]);
      if (stillMissing.length > 0) {
        const liveResults = await Promise.all(stillMissing.map(s => fetchLivePrice(s)));
        liveResults.forEach(result => {
          nextData[result.symbol] = result;
        });
      }
    }

    // Merge results — preserve any slugs that somehow weren't processed
    setData(prev => {
      const next: Record<string, CachedMarketData> = { ...prev };
      slugs.forEach(s => {
        if (nextData[s] !== undefined) {
          next[s] = nextData[s];
        }
      });
      return next;
    });
  }, [key]);

  useEffect(() => {
    load();
    timer.current = setInterval(load, POLL_INTERVAL);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [load]);

  return data;
}
