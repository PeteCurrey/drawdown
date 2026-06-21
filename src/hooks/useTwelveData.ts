"use client";
import { useEffect, useRef, useState, useCallback } from "react";

export interface InstrumentData {
  symbol: string;
  price: number | null;
  prevClose: number | null;
  changePct: number | null;
  bid: number | null;
  ask: number | null;
  spread: number | null;
  atr: number | null;
  volume: number | null;
  avgVolume: number | null;
  volumePct: number | null;
  sparkline: number[];
  weeklyOpen: number | null;
  monthlyOpen: number | null;
  prevWeekHigh: number | null;
  prevWeekLow: number | null;
  prevMonthHigh: number | null;
  prevMonthLow: number | null;
  fiftyTwoWeekHigh: number | null;
  fiftyTwoWeekLow: number | null;
  loading: boolean;
  error: boolean;
  lastUpdated: Date | null;
}

const TD_MAP: Record<string, string> = {
  EURUSD: "EUR/USD", GBPUSD: "GBP/USD", USDJPY: "USD/JPY", GBPJPY: "GBP/JPY",
  XAGUSD: "XAG/USD", UKX: "FTSE", SPX: "SPX500", NDX: "QQQ", DJI: "DJI",
  BTCUSDT: "BTC/USD", ETHUSDT: "ETH/USD", XRPUSDT: "XRP/USD",
  VIX: "VIX", DXY: "DX-Y.NYB",
};
export const tdSymbol = (slug: string) => TD_MAP[slug] ?? slug;

const KEY = () => process.env.NEXT_PUBLIC_TWELVE_DATA_KEY ?? "";
const BASE = "https://api.twelvedata.com";

async function fetchInstrument(slug: string): Promise<Partial<InstrumentData>> {
  const sym = encodeURIComponent(tdSymbol(slug));
  const k = KEY();
  if (!k) return { error: true, loading: false };
  try {
    const [qRes, atrRes, tsRes, wRes, mRes] = await Promise.all([
      fetch(`${BASE}/quote?symbol=${sym}&apikey=${k}`),
      fetch(`${BASE}/atr?symbol=${sym}&interval=1h&time_period=14&outputsize=1&apikey=${k}`),
      fetch(`${BASE}/time_series?symbol=${sym}&interval=1h&outputsize=20&apikey=${k}`),
      fetch(`${BASE}/time_series?symbol=${sym}&interval=1week&outputsize=5&apikey=${k}`),
      fetch(`${BASE}/time_series?symbol=${sym}&interval=1month&outputsize=3&apikey=${k}`),
    ]);
    const [q, atrData, ts, weekly, monthly] = await Promise.all([
      qRes.json(), atrRes.json(), tsRes.json(), wRes.json(), mRes.json(),
    ]);
    if (q.code || q.status === "error") return { error: true, loading: false };

    const price     = parseFloat(q.close ?? q.price ?? "0") || null;
    const prevClose = parseFloat(q.previous_close ?? "0") || null;
    const changePct = parseFloat(q.percent_change ?? "0") || null;
    const volume    = parseInt(q.volume ?? "0", 10) || null;
    const avgVolume = parseInt(q.average_volume ?? "0", 10) || null;
    const volumePct = volume && avgVolume ? Math.round((volume / avgVolume) * 100) : null;
    const bid       = parseFloat(q.bid  ?? "0") || null;
    const ask       = parseFloat(q.ask  ?? "0") || null;
    const spread    = bid && ask ? parseFloat((ask - bid).toFixed(5)) : null;
    const atr       = atrData?.values?.[0]?.atr ? parseFloat(atrData.values[0].atr) : null;
    const sparkline: number[] = Array.isArray(ts?.values)
      ? [...ts.values].reverse().map((v: any) => parseFloat(v.close)).filter(Boolean) : [];

    const wVals = weekly?.values ?? [];
    const mVals = monthly?.values ?? [];
    const weeklyOpen      = wVals[0] ? parseFloat(wVals[0].open) : null;
    const prevWeekHigh    = wVals[1] ? parseFloat(wVals[1].high) : null;
    const prevWeekLow     = wVals[1] ? parseFloat(wVals[1].low)  : null;
    const monthlyOpen     = mVals[0] ? parseFloat(mVals[0].open) : null;
    const prevMonthHigh   = mVals[1] ? parseFloat(mVals[1].high) : null;
    const prevMonthLow    = mVals[1] ? parseFloat(mVals[1].low)  : null;
    const fiftyTwoWeekHigh= parseFloat(q.fifty_two_week?.high ?? "0") || null;
    const fiftyTwoWeekLow = parseFloat(q.fifty_two_week?.low  ?? "0") || null;

    return { price, prevClose, changePct, bid, ask, spread, atr, volume, avgVolume, volumePct,
      sparkline, weeklyOpen, monthlyOpen, prevWeekHigh, prevWeekLow, prevMonthHigh, prevMonthLow,
      fiftyTwoWeekHigh, fiftyTwoWeekLow, error: false, loading: false, lastUpdated: new Date() };
  } catch { return { error: true, loading: false }; }
}

const POLL = 30_000;

export function useTwelveData(slugs: string[]): Record<string, InstrumentData> {
  const key = slugs.join(",");
  const makeInit = () => {
    const init: Record<string, InstrumentData> = {};
    slugs.forEach(s => {
      init[s] = { symbol: s, price: null, prevClose: null, changePct: null, bid: null, ask: null,
        spread: null, atr: null, volume: null, avgVolume: null, volumePct: null, sparkline: [],
        weeklyOpen: null, monthlyOpen: null, prevWeekHigh: null, prevWeekLow: null,
        prevMonthHigh: null, prevMonthLow: null, fiftyTwoWeekHigh: null, fiftyTwoWeekLow: null,
        loading: true, error: false, lastUpdated: null };
    });
    return init;
  };
  const [data, setData] = useState<Record<string, InstrumentData>>(makeInit);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async () => {
    const BATCH = 3;
    for (let i = 0; i < slugs.length; i += BATCH) {
      const batch = slugs.slice(i, i + BATCH);
      const results = await Promise.all(batch.map(fetchInstrument));
      setData(prev => {
        const next = { ...prev };
        batch.forEach((slug, idx) => { next[slug] = { ...next[slug], symbol: slug, ...results[idx] } as InstrumentData; });
        return next;
      });
      if (i + BATCH < slugs.length) await new Promise(r => setTimeout(r, 400));
    }
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    load();
    timer.current = setInterval(load, POLL);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [load]);

  return data;
}
