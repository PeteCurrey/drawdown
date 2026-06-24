"use client";
/**
 * useMarketData — single hook for all dashboard card data.
 *
 * Replaces the combination of useTwelveData + useTechnicalData + useExtraSignals
 * for the dashboard hero card and intelligence card. All data fetching is now
 * server-side (see /api/market-data/[symbol]/route.ts) so there are zero
 * client-side Twelve Data calls — no rate limit exposure.
 *
 * The hook polls our own API route every 60 seconds (matching the server cache TTL).
 * On instrument or interval change it immediately re-fetches and shows loading state.
 */

import { useEffect, useRef, useState } from "react";

export interface MarketData {
  // ── Price ──────────────────────────────────────────────────────────────────
  price:       number | null;
  prevClose:   number | null;
  change:      number | null;
  changePct:   number | null;
  bid:         number | null;
  ask:         number | null;
  /** ask - bid in price units */
  spread:      number | null;
  volume:      number | null;
  avgVolume:   number | null;
  /** current volume / 20-period average × 100 */
  volRatio:    number | null;

  // ── Indicators ────────────────────────────────────────────────────────────
  rsi:         number | null;
  macdLine:    number | null;
  macdSignal:  number | null;
  macdHist:    number | null;
  ema50:       number | null;
  ema200:      number | null;
  bbUpper:     number | null;
  bbMiddle:    number | null;
  bbLower:     number | null;
  stochK:      number | null;
  stochD:      number | null;
  cci:         number | null;

  // ── ATR ───────────────────────────────────────────────────────────────────
  atrCurrent:  number | null;
  atrAvg20:    number | null;
  /** atrCurrent / atrAvg20 — >1.25 elevated, >1.75 high */
  atrRatio:    number | null;

  // ── Key levels ────────────────────────────────────────────────────────────
  /** Swing high over selected interval's last 20 candles */
  resistance:  number | null;
  /** Swing low over selected interval's last 20 candles */
  support:     number | null;

  // ── Computed ──────────────────────────────────────────────────────────────
  /** 0–100 composite bias (RSI 30% + EMA 30% + MACD 20% + CCI 10% + BB 10%) */
  biasScore:   number | null;
  /** "ABOVE EMA" | "BELOW EMA" | "AT EMA" | "—" */
  trendLabel:  string;
  /** "above" | "below" | "at" | null */
  trendDir:    "above" | "below" | "at" | null;

  // ── Meta ──────────────────────────────────────────────────────────────────
  loading:     boolean;
  error:       string | null;
  lastUpdated: Date | null;
}

const EMPTY: MarketData = {
  price: null, prevClose: null, change: null, changePct: null,
  bid: null, ask: null, spread: null,
  volume: null, avgVolume: null, volRatio: null,
  rsi: null, macdLine: null, macdSignal: null, macdHist: null,
  ema50: null, ema200: null,
  bbUpper: null, bbMiddle: null, bbLower: null,
  stochK: null, stochD: null, cci: null,
  atrCurrent: null, atrAvg20: null, atrRatio: null,
  resistance: null, support: null,
  biasScore: null, trendLabel: "—", trendDir: null,
  loading: true, error: null, lastUpdated: null,
};

const POLL_MS = 60_000; // 60 s — matches server cache revalidate

export function useMarketData(hookSlug: string, interval: string): MarketData {
  const [data, setData] = useState<MarketData>({ ...EMPTY });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Reset to loading on slug/interval change
    setData({ ...EMPTY, loading: true, error: null });

    // Cancel any in-flight request from the previous render
    if (abortRef.current) abortRef.current.abort();
    if (timerRef.current) clearInterval(timerRef.current);

    const fetchData = async () => {
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch(
          `/api/market-data/${encodeURIComponent(hookSlug)}?interval=${interval}`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          const text = await res.text().catch(() => "unknown error");
          setData(prev => ({ ...prev, loading: false, error: `HTTP ${res.status}: ${text}` }));
          return;
        }

        const json = await res.json();

        if (json.error) {
          setData(prev => ({ ...prev, loading: false, error: json.error }));
          return;
        }

        setData({
          price:      json.price,
          prevClose:  json.prevClose,
          change:     json.change,
          changePct:  json.changePct,
          bid:        json.bid ?? null,
          ask:        json.ask ?? null,
          spread:     json.spread ?? null,
          volume:     json.volume,
          avgVolume:  json.avgVolume,
          volRatio:   json.volRatio,
          rsi:        json.rsi,
          macdLine:   json.macdLine,
          macdSignal: json.macdSignal,
          macdHist:   json.macdHist,
          ema50:      json.ema50,
          ema200:     json.ema200,
          bbUpper:    json.bbUpper,
          bbMiddle:   json.bbMiddle,
          bbLower:    json.bbLower,
          stochK:     json.stochK,
          stochD:     json.stochD,
          cci:        json.cci,
          atrCurrent: json.atrCurrent,
          atrAvg20:   json.atrAvg20,
          atrRatio:   json.atrRatio,
          resistance: json.resistance,
          support:    json.support,
          biasScore:  json.biasScore,
          trendLabel: json.trendLabel ?? "—",
          trendDir:   json.trendDir ?? null,
          loading:    false,
          error:      null,
          lastUpdated: new Date(),
        });
      } catch (err: any) {
        if (err?.name === "AbortError") return; // intentional cancel
        console.error("[useMarketData] fetch error:", err);
        setData(prev => ({ ...prev, loading: false, error: "Failed to load market data" }));
      }
    };

    fetchData();
    timerRef.current = setInterval(fetchData, POLL_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [hookSlug, interval]);

  return data;
}
