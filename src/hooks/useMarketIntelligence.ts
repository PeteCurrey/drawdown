"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { 
  InstrumentKey, 
  INSTRUMENTS, 
} from "@/lib/instruments";
import {
  QuoteData,
  IndicatorData,
  KeyLevels,
  NewsItem,
  EconomicEvent,
  BiasScore
} from "@/lib/marketDataService";
import { calculateBiasScore } from "@/lib/biasEngine";
import { useTwelveData } from "@/hooks/useTwelveData";

export interface MarketIntelligenceState {
  quote: QuoteData | null;
  indicators: IndicatorData | null;
  bias: BiasScore | null;
  keyLevels: KeyLevels | null;
  news: NewsItem[];
  events: EconomicEvent[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  is_fallback?: boolean;
}

const EMPTY_STATE: MarketIntelligenceState = {
  quote: null,
  indicators: null,
  bias: null,
  keyLevels: null,
  news: [],
  events: [],
  loading: true,
  error: null,
  lastUpdated: null,
  is_fallback: false,
};

// Helper to resolve instrument key from hook slug or instrument slug
export function resolveInstrumentKey(slugOrHookSlug: string): InstrumentKey {
  const clean = slugOrHookSlug.replace("/", "").toUpperCase();
  
  if (clean === "DJI") return "US30";
  if (clean === "FTSE") return "UK100";
  if (clean === "SPX") return "SPX500";
  if (clean === "NDX") return "NAS100";
  
  if (clean in INSTRUMENTS) {
    return clean as InstrumentKey;
  }
  
  // Default fallback to GBPUSD to prevent runtime crashes
  return "GBPUSD";
}

export function useMarketIntelligence(
  slugOrHookSlug: string,
  timeframe: string
): MarketIntelligenceState {
  const [state, setState] = useState<MarketIntelligenceState>({ ...EMPTY_STATE });

  // ── Live price via useTwelveData (client-side, 30s poll, 5 calls only) ──────
  // This bypasses the server-side route entirely for price updates.
  const liveData = useTwelveData([slugOrHookSlug]);
  const liveInstrument = liveData[slugOrHookSlug];

  // ── Merge live price into state whenever useTwelveData updates ──────────────
  useEffect(() => {
    if (!liveInstrument || liveInstrument.loading || liveInstrument.error) return;
    if (liveInstrument.price === null) return;

    setState(prev => {
      if (!prev.quote) return prev; // Wait for initial full load
      const updatedQuote: QuoteData = {
        ...prev.quote,
        price: liveInstrument.price!,
        change: liveInstrument.price! - (liveInstrument.prevClose ?? liveInstrument.price!),
        changePercent: liveInstrument.changePct ?? prev.quote.changePercent,
        timestamp: Date.now(),
      };
      return {
        ...prev,
        quote: updatedQuote,
        is_fallback: false,
        lastUpdated: liveInstrument.lastUpdated ?? prev.lastUpdated,
      };
    });
  }, [liveInstrument?.price, liveInstrument?.changePct, slugOrHookSlug]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // 1. Reset state to loading on instrument/timeframe change
    setState({ ...EMPTY_STATE, loading: true });

    let active = true;
    let newsEventsTimer: NodeJS.Timeout | null = null;
    let indicatorTimer: NodeJS.Timeout | null = null;

    // Helper to fetch and map indicators + quote from the full market-data route
    const fetchIndicatorsAndBias = async (slug: string, tf: string) => {
      try {
        const res = await fetch(`/api/market-data/${encodeURIComponent(slug)}?interval=${tf}`);
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        const price = data.price ?? 0;

        const indicators: IndicatorData = {
          rsi: data.rsi,
          ema50: data.ema50,
          ema200: data.ema200,
          macdValue: data.macdLine,
          macdSignal: data.macdSignal,
          macdHistogram: data.macdHist,
          bbUpper: data.bbUpper,
          bbMiddle: data.bbMiddle,
          bbLower: data.bbLower,
          stochK: data.stochK,
          stochD: data.stochD,
          atr: data.atrCurrent,
          cci: data.cci,
          volumeAvg: data.avgVolume,
          currentVolume: data.volume,
        };

        const quote: QuoteData = {
          price: data.price,
          change: data.change,
          changePercent: data.changePct,
          high: data.high ?? price,
          low: data.low ?? price,
          volume: data.volume ?? 0,
          timestamp: Date.now(),
        };

        const keyLevels: KeyLevels = {
          support: data.support,
          resistance: data.resistance,
          ema50: data.ema50,
          ema200: data.ema200,
          atr: data.atrCurrent,
        };

        const bias = calculateBiasScore(indicators, price);

        return { quote, indicators, keyLevels, bias, is_fallback: data.is_fallback === true };
      } catch (err: any) {
        console.error(`[useMarketIntelligence] Failed to fetch indicators for ${slug}:`, err);
        return null;
      }
    };

    // Helper to fetch news and calendar events
    const fetchNewsAndEvents = async (slug: string) => {
      try {
        const [calendarRes, newsRes] = await Promise.allSettled([
          fetch(`/api/calendar/${encodeURIComponent(slug)}`).then(r => r.json()),
          fetch(`/api/intelligence/news-sentiment/${encodeURIComponent(slug)}`).then(r => r.json())
        ]);

        let events: EconomicEvent[] = [];
        let news: NewsItem[] = [];

        if (calendarRes.status === "fulfilled" && Array.isArray(calendarRes.value?.events)) {
          events = calendarRes.value.events.map((e: any, i: number) => {
            let timeMs = Date.now();
            if (e.time && typeof e.time === "string" && e.time.includes(":")) {
              const [h, m] = e.time.split(":").map(Number);
              const d = new Date();
              d.setUTCHours(h, m || 0, 0, 0);
              timeMs = d.getTime();
            } else if (e.time && !isNaN(Number(e.time))) {
              timeMs = Number(e.time);
            }

            return {
              id: `cal-${slug}-${i}`,
              event: e.event,
              country: e.country,
              currency: "",
              impact: e.impact as "high" | "medium" | "low",
              actual: null,
              estimate: e.estimate,
              prev: e.previous,
              time: timeMs,
            };
          });
        }

        if (newsRes.status === "fulfilled" && Array.isArray(newsRes.value?.articles)) {
          news = newsRes.value.articles.map((a: any) => ({
            id: String(a.url),
            headline: a.title,
            summary: "",
            source: a.source ?? "News",
            url: a.url,
            datetime: new Date(a.published_at).getTime(),
            category: "",
          }));
        }

        return { events, news };
      } catch (err: any) {
        console.error(`[useMarketIntelligence] Failed to fetch news/events for ${slug}:`, err);
        return null;
      }
    };

    // Initial load: fetch indicators + news/events together
    const initialFetch = async () => {
      try {
        const [marketRes, newsEventsRes] = await Promise.allSettled([
          fetchIndicatorsAndBias(slugOrHookSlug, timeframe),
          fetchNewsAndEvents(slugOrHookSlug)
        ]);

        if (!active) return;

        const resolvedMarket = marketRes.status === "fulfilled" ? marketRes.value : null;
        const resolvedNewsEvents = newsEventsRes.status === "fulfilled" ? newsEventsRes.value : null;

        if (!resolvedMarket) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: "Failed to connect to market data feeds. Please verify server connection."
          }));
          return;
        }

        setState({
          quote: resolvedMarket.quote,
          indicators: resolvedMarket.indicators,
          bias: resolvedMarket.bias,
          keyLevels: resolvedMarket.keyLevels,
          news: resolvedNewsEvents?.news ?? [],
          events: resolvedNewsEvents?.events ?? [],
          is_fallback: resolvedMarket.is_fallback,
          loading: false,
          error: null,
          lastUpdated: new Date()
        });

        // Indicators refresh every 5 minutes (not 30s — useTwelveData handles price updates)
        indicatorTimer = setInterval(async () => {
          const updatedMarket = await fetchIndicatorsAndBias(slugOrHookSlug, timeframe);
          if (active && updatedMarket) {
            setState(prev => ({
              ...prev,
              indicators: updatedMarket.indicators,
              bias: updatedMarket.bias,
              keyLevels: updatedMarket.keyLevels,
              // Only update quote from server if useTwelveData hasn't given us a better price
              quote: prev.quote && prev.is_fallback === false
                ? { ...prev.quote } // keep existing live price from useTwelveData
                : updatedMarket.quote,
              is_fallback: updatedMarket.is_fallback,
              lastUpdated: new Date()
            }));
          }
        }, 300_000); // 5 minutes

        // News/events refresh every 5 minutes
        newsEventsTimer = setInterval(async () => {
          const updatedNewsEvents = await fetchNewsAndEvents(slugOrHookSlug);
          if (active && updatedNewsEvents) {
            setState(prev => ({
              ...prev,
              news: updatedNewsEvents.news,
              events: updatedNewsEvents.events,
              lastUpdated: new Date()
            }));
          }
        }, 300_000); // 5 minutes

      } catch (err: any) {
        if (active) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: err.message || "An unexpected error occurred."
          }));
        }
      }
    };

    initialFetch();

    return () => {
      active = false;
      if (indicatorTimer) clearInterval(indicatorTimer);
      if (newsEventsTimer) clearInterval(newsEventsTimer);
    };
  }, [slugOrHookSlug, timeframe]);

  return state;
}
