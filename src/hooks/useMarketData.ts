"use client";
/**
 * useMarketData — Canonical hook for all market data consumers.
 *
 * All market data is strictly fetched from /api/market-data/[symbol]
 * which runs canonicalMarketService with validated mathematical indicator calculations
 * and the verified 4-pillar composite bias engine.
 */

import { useEffect, useRef, useState } from "react";
import type { CompositeBiasResult } from "@/lib/biasEngine";

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
  adx:         number | null;

  // ── ATR ───────────────────────────────────────────────────────────────────
  atrCurrent:  number | null;
  atrAvg20:    number | null;
  atrRatio:    number | null;

  // ── Key levels ────────────────────────────────────────────────────────────
  resistance:  number | null;
  support:     number | null;

  // ── 4-Pillar Composite Bias Engine ─────────────────────────────────────────
  biasScore:   number | null;
  compositeBias: CompositeBiasResult | null;
  trendLabel:  string;
  trendDir:    "above" | "below" | "at" | null;

  // ── Meta & Provenance ─────────────────────────────────────────────────────
  source:      string;
  feedStatus:  "LIVE" | "DELAYED" | "STALE" | "OFFLINE" | "UNAVAILABLE";
  loading:     boolean;
  error:       string | null;
  lastUpdated: Date | null;
  providerTimestamp: string | null;
  is_fallback: boolean;
}

const EMPTY: MarketData = {
  price: null, prevClose: null, change: null, changePct: null,
  bid: null, ask: null, spread: null,
  volume: null, avgVolume: null, volRatio: null,
  rsi: null, macdLine: null, macdSignal: null, macdHist: null,
  ema50: null, ema200: null,
  bbUpper: null, bbMiddle: null, bbLower: null,
  stochK: null, stochD: null, cci: null, adx: null,
  atrCurrent: null, atrAvg20: null, atrRatio: null,
  resistance: null, support: null,
  biasScore: null, compositeBias: null, trendLabel: "—", trendDir: null,
  source: "canonical", feedStatus: "LIVE",
  loading: true, error: null, lastUpdated: null, providerTimestamp: null, is_fallback: false,
};

const POLL_MS = 30_000; // 30s poll

export function useMarketData(
  hookSlug: string,
  interval: string = "4h",
  currency: string = "USD"
): MarketData {
  const [data, setData] = useState<MarketData>({ ...EMPTY });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setData({ ...EMPTY, loading: true, error: null });

    if (abortRef.current) abortRef.current.abort();
    if (timerRef.current) clearInterval(timerRef.current);

    const fetchData = async () => {
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch(
          `/api/market-data/${encodeURIComponent(hookSlug)}?interval=${encodeURIComponent(interval)}&currency=${encodeURIComponent(currency)}`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          const json = await res.json().catch(() => null);
          setData(prev => ({
            ...prev,
            loading: false,
            error: json?.error ?? `HTTP ${res.status}`,
            feedStatus: "OFFLINE",
            price: null,
          }));
          return;
        }

        const json = await res.json();

        if (json.error && !json.price) {
          setData(prev => ({
            ...prev,
            loading: false,
            error: json.error,
            feedStatus: json.feed_status ?? "OFFLINE",
            price: null,
          }));
          return;
        }

        setData({
          price:         json.price ?? null,
          prevClose:     json.prevClose ?? null,
          change:        json.change ?? null,
          changePct:     json.changePct ?? null,
          bid:           json.bid ?? null,
          ask:           json.ask ?? null,
          spread:        json.spread ?? null,
          volume:        json.volume ?? null,
          avgVolume:     json.avgVolume ?? null,
          volRatio:      json.volRatio ?? null,
          rsi:           json.rsi ?? null,
          macdLine:      json.macdLine ?? null,
          macdSignal:    json.macdSignal ?? null,
          macdHist:      json.macdHist ?? null,
          ema50:         json.ema50 ?? null,
          ema200:        json.ema200 ?? null,
          bbUpper:       json.bbUpper ?? null,
          bbMiddle:      json.bbMiddle ?? null,
          bbLower:       json.bbLower ?? null,
          stochK:        json.stochK ?? null,
          stochD:        json.stochD ?? null,
          cci:           json.cci ?? null,
          adx:           json.adx ?? null,
          atrCurrent:    json.atrCurrent ?? null,
          atrAvg20:      json.atrAvg20 ?? null,
          atrRatio:      json.atrRatio ?? null,
          resistance:    json.resistance ?? null,
          support:       json.support ?? null,
          biasScore:     json.biasScore ?? null,
          compositeBias: json.composite_bias ?? null,
          trendLabel:    json.trendLabel ?? "—",
          trendDir:      json.trendDir ?? null,
          source:        json.source ?? "canonical",
          feedStatus:    json.feed_status ?? (json.price !== null ? "LIVE" : "OFFLINE"),
          loading:       false,
          error:         null,
          lastUpdated:   new Date(),
          providerTimestamp: json.provider_timestamp ?? null,
          is_fallback:   json.is_fallback === true,
        });
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        console.error("[useMarketData] fetch error:", err);
        setData(prev => ({
          ...prev,
          loading: false,
          error: "Failed to load canonical market data",
          feedStatus: "OFFLINE",
          price: null,
        }));
      }
    };

    fetchData();
    timerRef.current = setInterval(fetchData, POLL_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [hookSlug, interval, currency]);

  return data;
}
