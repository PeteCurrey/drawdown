"use client";

import { useEffect, useRef, useState } from "react";
import { 
  InstrumentKey, 
  INSTRUMENTS, 
  InstrumentConfig 
} from "@/lib/instruments";
import {
  fetchQuote,
  fetchAllIndicators,
  fetchKeyLevels,
  fetchMarketNews,
  fetchEconomicCalendar,
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

  const resolvedKey = resolveInstrumentKey(slugOrHookSlug);
  const instrument = INSTRUMENTS[resolvedKey];

  useEffect(() => {
    // 1. Reset state to loading on instrument/timeframe change
    setState({ ...EMPTY_STATE, loading: true });

    let active = true;

    // Fetch timers
    let quoteTimer: NodeJS.Timeout | null = null;
    let indicatorTimer: NodeJS.Timeout | null = null;
    let newsTimer: NodeJS.Timeout | null = null;

    // Helper functions for polling updates (non-loading state)
    const updateQuote = async (config: InstrumentConfig) => {
      try {
        const quoteRes = await fetchQuote(config);
        if (!active || !quoteRes) return;

        setState(prev => {
          const currentPrice = quoteRes.price;
          const nextBias = prev.indicators 
            ? calculateBiasScore(prev.indicators, currentPrice)
            : prev.bias;

          return {
            ...prev,
            quote: quoteRes,
            bias: nextBias,
            lastUpdated: new Date()
          };
        });
      } catch (err: unknown) {
        console.error("[useMarketIntelligence] Failed to update quote:", err);
      }
    };

    const updateIndicatorsAndLevels = async (config: InstrumentConfig, tf: string) => {
      try {
        const indicatorsRes = await fetchAllIndicators(config, tf);
        if (!active || !indicatorsRes) return;

        // Fetch key levels using the updated indicators
        const currentPrice = stateRef.current.quote?.price ?? indicatorsRes.ema50 ?? 0;
        const levelsRes = await fetchKeyLevels(config, tf, currentPrice, indicatorsRes);

        setState(prev => {
          const price = prev.quote?.price ?? currentPrice;
          const nextBias = calculateBiasScore(indicatorsRes, price);

          return {
            ...prev,
            indicators: indicatorsRes,
            keyLevels: levelsRes,
            bias: nextBias,
            lastUpdated: new Date()
          };
        });
      } catch (err: unknown) {
        console.error("[useMarketIntelligence] Failed to update indicators & levels:", err);
      }
    };

    const updateNewsAndEvents = async (config: InstrumentConfig) => {
      try {
        const [newsRes, calendarRes] = await Promise.allSettled([
          fetchMarketNews(config),
          fetchEconomicCalendar(config)
        ]);

        if (!active) return;

        setState(prev => ({
          ...prev,
          news: newsRes.status === "fulfilled" ? newsRes.value : prev.news,
          events: calendarRes.status === "fulfilled" ? calendarRes.value : prev.events,
          lastUpdated: new Date()
        }));
      } catch (err: unknown) {
        console.error("[useMarketIntelligence] Failed to update news & events:", err);
      }
    };

    // Initial full fetch orchestration (with loading spinner)
    const initialFetch = async () => {
      try {
        const [quoteRes, indicatorsRes, newsRes, calendarRes] = await Promise.allSettled([
          fetchQuote(instrument),
          fetchAllIndicators(instrument, timeframe),
          fetchMarketNews(instrument),
          fetchEconomicCalendar(instrument)
        ]);

        if (!active) return;

        const resolvedQuote = quoteRes.status === "fulfilled" ? quoteRes.value : null;
        const resolvedIndicators = indicatorsRes.status === "fulfilled" ? indicatorsRes.value : null;
        const resolvedNews = newsRes.status === "fulfilled" ? newsRes.value : [];
        const resolvedEvents = calendarRes.status === "fulfilled" ? calendarRes.value : [];

        // Check if vital data failed (both quote and indicators missing is a critical error)
        if (!resolvedQuote && !resolvedIndicators) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: "Failed to connect to market data feeds. Please verify API keys."
          }));
          return;
        }

        const currentPrice = resolvedQuote?.price ?? resolvedIndicators?.ema50 ?? 0;
        
        // Fetch key levels using the resolved indicators
        let resolvedLevels: KeyLevels | null = null;
        if (resolvedIndicators) {
          try {
            resolvedLevels = await fetchKeyLevels(instrument, timeframe, currentPrice, resolvedIndicators);
          } catch (err) {
            console.error("[useMarketIntelligence] Key levels fetch failed:", err);
          }
        }

        const resolvedBias = resolvedIndicators
          ? calculateBiasScore(resolvedIndicators, currentPrice)
          : null;

        setState({
          quote: resolvedQuote,
          indicators: resolvedIndicators,
          bias: resolvedBias,
          keyLevels: resolvedLevels,
          news: resolvedNews,
          events: resolvedEvents,
          loading: false,
          error: null,
          lastUpdated: new Date()
        });

        // ─── Setup Polling Timers after initial load succeeds ───
        // Polling 1: Quotes - 30 seconds
        quoteTimer = setInterval(() => {
          updateQuote(instrument);
        }, 30000);

        // Polling 2: Indicators and Key Levels - 60 seconds
        indicatorTimer = setInterval(() => {
          updateIndicatorsAndLevels(instrument, timeframe);
        }, 60000);

        // Polling 3: News and Events - 5 minutes (300000 ms)
        newsTimer = setInterval(() => {
          updateNewsAndEvents(instrument);
        }, 300000);

      } catch (err: unknown) {
        if (active) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: err instanceof Error ? err.message : "An unexpected error occurred."
          }));
        }
      }
    };

    initialFetch();

    return () => {
      active = false;
      if (quoteTimer) clearInterval(quoteTimer);
      if (indicatorTimer) clearInterval(indicatorTimer);
      if (newsTimer) clearInterval(newsTimer);
    };
  }, [slugOrHookSlug, timeframe]);

  return state;
}
