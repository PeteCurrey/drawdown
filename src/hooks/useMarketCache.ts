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
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
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

// Aliases: dashboard hookSlug → alternative symbols that may appear in price_cache
const ALIAS_MAP: Record<string, string[]> = {
  FTSE:   ["UK100", "UKX", "FTSE"],
  SPX:    ["SPX500", "SPX", "US500"],
  NDX:    ["NAS100", "NDX", "US100"],
  DJI:    ["US30", "DJI", "DOW"],
  NIKKEI: ["JPN225", "NIKKEI"],
  ASX200: ["AUS200", "ASX200"],
  DAX:    ["GER40", "DAX"],
  BTCUSD: ["BTC/USD", "BTCUSDT", "BTCUSD"],
  ETHUSD: ["ETH/USD", "ETHUSDT", "ETHUSD"],
  SOLUSD: ["SOL/USD", "SOLUSD"],
  WTIUSD: ["WTI/USD", "WTIUSD"],
};

function makeEmpty(s: string, loading = true): CachedMarketData {
  return {
    symbol: s, price: null, change_pct: null, rsi: null, ema50: null,
    ema200: null, momentum_signal: null, source: null, fetched_at: null,
    loading, error: false, bid: null, ask: null, spread: null, prevClose: null,
    atr: null, volumePct: null,
  };
}

function slugMatches(hookSlug: string, rowSymbol: string): boolean {
  const cleanS = hookSlug.replace("/", "").toUpperCase();
  const cleanRow = rowSymbol.replace("/", "").toUpperCase();
  if (cleanS === cleanRow) return true;
  const aliases = ALIAS_MAP[cleanS] ?? [];
  return aliases.some(a => a.replace("/", "").toUpperCase() === cleanRow);
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
    const expandedSlugs = Array.from(new Set([
      ...slugs,
      ...slugs.map(s => !s.includes("/") && s.length === 6 ? `${s.slice(0, 3)}/${s.slice(3)}` : s),
      ...slugs.flatMap(s => ALIAS_MAP[s] ?? []),
    ]));

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
            resolvedSlugs.add(targetKey);
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

    // ── Step 2: Fetch live prices for any slug still missing ─────────────────
    // Real data from /api/market-data; no hardcoded fallbacks whatsoever
    const missingSlugs = slugs.filter(s => !resolvedSlugs.has(s));

    if (missingSlugs.length > 0) {
      const liveResults = await Promise.all(
        missingSlugs.map(s => fetchLivePrice(s))
      );
      liveResults.forEach(result => {
        nextData[result.symbol] = result;
      });
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
