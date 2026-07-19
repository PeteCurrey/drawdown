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

export function useMarketCache(slugs: string[]): Record<string, CachedMarketData> {
  const key = slugs.join(",");
  const makeInit = () => {
    const init: Record<string, CachedMarketData> = {};
    slugs.forEach(s => {
      init[s] = {
        symbol: s, price: null, change_pct: null, rsi: null, ema50: null, ema200: null,
        momentum_signal: null, source: null, fetched_at: null, loading: true, error: false, bid: null, ask: null, spread: null, prevClose: null, atr: null, volumePct: null
      };
    });
    return init;
  };

  const [data, setData] = useState<Record<string, CachedMarketData>>(makeInit);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async () => {
    if (slugs.length === 0) return;
    try {
      const { data: rows, error } = await supabase
        .from("price_cache")
        .select("*")
        .in("symbol", slugs);

      if (error) {
        console.error("useMarketCache Error:", error);
        return;
      }

      if (rows) {
        setData(prev => {
          const next = { ...prev };
          rows.forEach((row: any) => {
            if (next[row.symbol]) {
              next[row.symbol] = {
                ...next[row.symbol],
                price: row.price,
                change_pct: row.change_pct,
                rsi: row.rsi,
                ema50: row.ema50,
                ema200: row.ema200,
                momentum_signal: row.momentum_signal,
                source: row.source,
                fetched_at: row.fetched_at,
                loading: false,
                error: false,
              };
            }
          });
          // Mark loaded for those that weren't found in DB to clear loading skeleton
          slugs.forEach(s => {
            if (next[s] && next[s].loading) {
              next[s] = { ...next[s], loading: false, error: true };
            }
          });
          return next;
        });
      }
    } catch (err) {
      console.error("useMarketCache Catch Error:", err);
    }
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
