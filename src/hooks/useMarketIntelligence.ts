"use client";

import { useEffect, useRef, useState } from "react";
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
  
  // Keep refs for mutable data to access in polling intervals without re-triggering effects
  const stateRef = useRef<MarketIntelligenceState>(state);
  stateRef.current = state;

  useEffect(() => {
    // 1. Reset state to loading on instrument/timeframe change
    setState({ ...EMPTY_STATE, loading: true });

    let active = true;

    // Fetch timers
    let marketDataTimer: NodeJS.Timeout | null = null;
    let newsEventsTimer: NodeJS.Timeout | null = null;

    // Helper to fetch and map market data
    const fetchMarketDataAndBias = async (slug: string, tf: string) => {
      try {
        const res = await fetch(`/api/market-data/${encodeURIComponent(slug)}?interval=${tf}`);
        if (!res.ok) {
          throw new Error(`HTTP Error ${res.status}`);
        }
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }

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
        console.error(`[useMarketIntelligence] Failed to fetch market data for ${slug}:`, err);
        return null;
      }
    };

    // Helper to fetch and map calendar and news
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

    // Orchestrator for initial loads and interval updates
    const initialFetch = async () => {
      try {
        const [marketRes, newsEventsRes] = await Promise.allSettled([
          fetchMarketDataAndBias(slugOrHookSlug, timeframe),
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

        // Setup Polling: 30 seconds for price/indicators
        marketDataTimer = setInterval(async () => {
          const updatedMarket = await fetchMarketDataAndBias(slugOrHookSlug, timeframe);
          if (active && updatedMarket) {
            setState(prev => ({
              ...prev,
              quote: updatedMarket.quote,
              indicators: updatedMarket.indicators,
              bias: updatedMarket.bias,
              keyLevels: updatedMarket.keyLevels,
              is_fallback: updatedMarket.is_fallback,
              lastUpdated: new Date()
            }));
          }
        }, 30000);

        // Setup Polling: 5 minutes for news/events
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
        }, 300000);

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
      if (marketDataTimer) clearInterval(marketDataTimer);
      if (newsEventsTimer) clearInterval(newsEventsTimer);
    };
  }, [slugOrHookSlug, timeframe]);

  return state;
}
