"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { tdSymbol } from "./useTwelveData";

export type Signal = "BUY" | "SELL" | "NEUTRAL";
export type Consensus = "STRONG BUY" | "BUY" | "NEUTRAL" | "SELL" | "STRONG SELL";

export interface TimeframeRow {
  tf: string; label: string;
  maSignal: Signal; rsi: number | null; rsiSignal: Signal;
  macdSignal: Signal; overall: Signal; score: number;
}
export interface EMAStack {
  ema20: number | null; ema50: number | null; ema200: number | null;
  above20: boolean | null; above50: boolean | null; above200: boolean | null;
}
export interface KeyLevels {
  pivot: number | null; r1: number | null; r2: number | null; s1: number | null; s2: number | null;
}
export interface TechnicalSummary {
  rows: TimeframeRow[]; totalScore: number; consensus: Consensus;
  emaStack: EMAStack; keyLevels: KeyLevels;
  lastUpdated: Date | null; loading: boolean; error: boolean;
}

const KEY  = () => process.env.NEXT_PUBLIC_TWELVE_DATA_KEY ?? "";
const BASE = "https://api.twelvedata.com";
const TF_MAP = [
  { tf: "15m", label: "15m",    tdInterval: "15min" },
  { tf: "1H",  label: "1H",     tdInterval: "1h"    },
  { tf: "4H",  label: "4H",     tdInterval: "4h"    },
  { tf: "1D",  label: "Daily",  tdInterval: "1day"  },
  { tf: "1W",  label: "Weekly", tdInterval: "1week" },
];

function rsiSignal(rsi: number | null): Signal {
  if (!rsi) return "NEUTRAL";
  if (rsi >= 60) return "BUY";
  if (rsi <= 40) return "SELL";
  return "NEUTRAL";
}
function signalScore(s: Signal): number { return s === "BUY" ? 1 : s === "SELL" ? -1 : 0; }
function majority(signals: Signal[]): Signal {
  const sc = signals.reduce((a, s) => a + signalScore(s), 0);
  return sc > 0 ? "BUY" : sc < 0 ? "SELL" : "NEUTRAL";
}
function scoreToConsensus(score: number): Consensus {
  if (score >= 4) return "STRONG BUY";
  if (score >= 2) return "BUY";
  if (score <= -4) return "STRONG SELL";
  if (score <= -2) return "SELL";
  return "NEUTRAL";
}

const CACHE = new Map<string, { data: TechnicalSummary; ts: number }>();
const CACHE_TTL = 5 * 60 * 1000;

const EMPTY: TechnicalSummary = {
  rows: [], totalScore: 0, consensus: "NEUTRAL",
  emaStack: { ema20: null, ema50: null, ema200: null, above20: null, above50: null, above200: null },
  keyLevels: { pivot: null, r1: null, r2: null, s1: null, s2: null },
  lastUpdated: null, loading: false, error: false,
};

async function fetchTechnical(slug: string): Promise<TechnicalSummary> {
  const hit = CACHE.get(slug);
  if (hit && Date.now() - hit.ts < CACHE_TTL) return hit.data;

  const sym = encodeURIComponent(tdSymbol(slug));
  const k = KEY();
  if (!k) return { ...EMPTY, error: true };

  try {
    // Build all requests: for each TF -> RSI, MACD, EMA20
    const tfRequests = TF_MAP.flatMap(({ tdInterval }) => [
      fetch(`${BASE}/rsi?symbol=${sym}&interval=${tdInterval}&time_period=14&outputsize=1&apikey=${k}`),
      fetch(`${BASE}/macd?symbol=${sym}&interval=${tdInterval}&outputsize=1&apikey=${k}`),
      fetch(`${BASE}/ema?symbol=${sym}&interval=${tdInterval}&time_period=20&outputsize=1&apikey=${k}`),
    ]);
    const extraRequests = [
      fetch(`${BASE}/ema?symbol=${sym}&interval=1day&time_period=50&outputsize=1&apikey=${k}`),
      fetch(`${BASE}/ema?symbol=${sym}&interval=1day&time_period=200&outputsize=1&apikey=${k}`),
      fetch(`${BASE}/time_series?symbol=${sym}&interval=1day&outputsize=1&apikey=${k}`),
    ];

    await new Promise(r => setTimeout(r, 200));
    const allRes = await Promise.all([...tfRequests, ...extraRequests]);
    const allData = await Promise.all(allRes.map(r => r.json()));

    const tfData = allData.slice(0, TF_MAP.length * 3);
    const [ema50Data, ema200Data, ohlcvData] = allData.slice(TF_MAP.length * 3);

    const latestClose = ohlcvData?.values?.[0] ? parseFloat(ohlcvData.values[0].close) : null;
    const latestHigh  = ohlcvData?.values?.[0] ? parseFloat(ohlcvData.values[0].high)  : null;
    const latestLow   = ohlcvData?.values?.[0] ? parseFloat(ohlcvData.values[0].low)   : null;

    const rows: TimeframeRow[] = TF_MAP.map(({ tf, label }, idx) => {
      const rsiData  = tfData[idx * 3];
      const macdData = tfData[idx * 3 + 1];
      const emaData  = tfData[idx * 3 + 2];

      const rsi      = rsiData?.values?.[0]?.rsi       ? parseFloat(rsiData.values[0].rsi)        : null;
      const ema20    = emaData?.values?.[0]?.ema        ? parseFloat(emaData.values[0].ema)        : null;
      const macdLine = macdData?.values?.[0]?.macd      ? parseFloat(macdData.values[0].macd)      : null;
      const macdSig  = macdData?.values?.[0]?.macd_signal ? parseFloat(macdData.values[0].macd_signal) : null;

      const maSignal: Signal  = latestClose && ema20 ? (latestClose > ema20 ? "BUY" : "SELL") : "NEUTRAL";
      const rsiSig            = rsiSignal(rsi);
      const macdSignal: Signal= macdLine !== null && macdSig !== null ? (macdLine > macdSig ? "BUY" : "SELL") : "NEUTRAL";
      const overall           = majority([maSignal, rsiSig, macdSignal]);
      return { tf, label, maSignal, rsi, rsiSignal: rsiSig, macdSignal, overall, score: signalScore(overall) };
    });

    const totalScore = rows.reduce((a, r) => a + r.score, 0);

    const ema20Val  = tfData[1 * 3 + 2]?.values?.[0]?.ema ? parseFloat(tfData[1 * 3 + 2].values[0].ema) : null;
    const ema50Val  = ema50Data?.values?.[0]?.ema  ? parseFloat(ema50Data.values[0].ema)  : null;
    const ema200Val = ema200Data?.values?.[0]?.ema ? parseFloat(ema200Data.values[0].ema) : null;

    let pivot = null, r1 = null, r2 = null, s1 = null, s2 = null;
    if (latestHigh && latestLow && latestClose) {
      pivot = (latestHigh + latestLow + latestClose) / 3;
      r1 = 2 * pivot - latestLow;
      r2 = pivot + (latestHigh - latestLow);
      s1 = 2 * pivot - latestHigh;
      s2 = pivot - (latestHigh - latestLow);
    }

    const result: TechnicalSummary = {
      rows, totalScore, consensus: scoreToConsensus(totalScore),
      emaStack: { ema20: ema20Val, ema50: ema50Val, ema200: ema200Val,
        above20:  latestClose && ema20Val  ? latestClose > ema20Val  : null,
        above50:  latestClose && ema50Val  ? latestClose > ema50Val  : null,
        above200: latestClose && ema200Val ? latestClose > ema200Val : null },
      keyLevels: { pivot, r1, r2, s1, s2 },
      lastUpdated: new Date(), loading: false, error: false,
    };
    CACHE.set(slug, { data: result, ts: Date.now() });
    return result;
  } catch { return { ...EMPTY, error: true }; }
}

export function useTechnicalData(slug: string, enabled: boolean): TechnicalSummary {
  const [data, setData] = useState<TechnicalSummary>({ ...EMPTY });
  const fetched = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled || fetched.current === slug) return;
    setData(prev => ({ ...prev, loading: true }));
    fetched.current = slug;
    fetchTechnical(slug).then(setData);
  }, [slug, enabled]);

  return data;
}
