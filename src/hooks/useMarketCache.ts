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

// In-memory shared cache to deduplicate simultaneous calls across components
let sharedScreenerData: { data: any[]; timestamp: number } | null = null;
let sharedScreenerPromise: Promise<any[]> | null = null;

async function fetchAuthoritativeScreenerData(): Promise<any[]> {
  const now = Date.now();
  // 10s client-side cache window to deduplicate across components mounted on same page
  if (sharedScreenerData && now - sharedScreenerData.timestamp < 10_000) {
    return sharedScreenerData.data;
  }
  if (sharedScreenerPromise) {
    return sharedScreenerPromise;
  }
  sharedScreenerPromise = (async () => {
    try {
      const res = await fetch("/api/market/screener?dashboard=1");
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json) && json.length > 0) {
          sharedScreenerData = { data: json, timestamp: Date.now() };
          return json;
        }
      }
    } catch (err) {
      console.warn("[useMarketCache] Failed to fetch canonical screener data:", err);
    } finally {
      sharedScreenerPromise = null;
    }
    return sharedScreenerData?.data ?? [];
  })();
  return sharedScreenerPromise;
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

    const resolvedSlugs = new Set<string>();
    const nextData: Record<string, CachedMarketData> = {};

    // ── Step 1: Fetch Authoritative Screener Data (Shared 60s canonical pipeline) ──
    const screenerRows = await fetchAuthoritativeScreenerData();

    if (screenerRows.length > 0) {
      for (const slug of slugs) {
        const matched = screenerRows.find((r: any) => 
          slugMatches(slug, r.slug ?? "") || 
          slugMatches(slug, r.displayPair ?? "") ||
          slugMatches(slug, r.symbol ?? "")
        );

        if (matched) {
          resolvedSlugs.add(slug);
          const ageMs = matched.cached_at ? Date.now() - new Date(matched.cached_at).getTime() : 0;
          const freshness: "LIVE" | "RECENT" | "STALE" | "UNAVAILABLE" =
            matched.feed_offline || matched.price === null ? "UNAVAILABLE"
            : ageMs < 60_000 ? "LIVE"
            : ageMs < 300_000 ? "RECENT"
            : ageMs < 900_000 ? "STALE"
            : "UNAVAILABLE";

          nextData[slug] = {
            symbol: slug,
            price: matched.price ?? null,
            change_pct: matched.changePct ?? matched.change_pct ?? null,
            rsi: matched.rsi ?? null,
            ema50: null,
            ema200: null,
            momentum_signal: matched.bias ?? null,
            source: matched.source ?? "screener_canonical",
            fetched_at: matched.cached_at ?? new Date().toISOString(),
            loading: false,
            error: matched.feed_offline || matched.price === null,
            freshness,
            atr: null,
            volumePct: null,
            bid: matched.bid ?? (matched.price ? parseFloat((matched.price * 0.9999).toFixed(4)) : null),
            ask: matched.ask ?? (matched.price ? parseFloat((matched.price * 1.0001).toFixed(4)) : null),
            spread: null,
            prevClose: matched.prevClose ?? (matched.price && matched.changePct ? parseFloat((matched.price / (1 + matched.changePct / 100)).toFixed(4)) : null),
          };
        }
      }
    }

    // ── Step 2: Fetch any non-screener or missing symbols (e.g. VIX, DXY) ──
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
              resolvedSlugs.add(slug);
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
