"use client";

import { useState, useEffect, useRef } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

const C = "var(--tool-accent)";

interface QuoteData {
  price:    number;
  change:   number;
  changePct: number;
  high52w:  number;
  low52w:   number;
  sparkline: { v: number }[];
}

async function fetchQuote(instrument: string): Promise<QuoteData | null> {
  try {
    const res = await fetch(`/api/algo-builder/market-quote?symbol=${encodeURIComponent(instrument)}`);
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

export function MarketWidget({ instrument }: { instrument: string }) {
  const [data, setData]     = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hidden, setHidden] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevInstrument = useRef(instrument);

  async function load(inst: string) {
    const d = await fetchQuote(inst);
    if (d === null) {
      // FinnHub 429 or error — silently hide
      setHidden(true);
    } else {
      setData(d);
      setHidden(false);
    }
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    setData(null);
    load(instrument);
    prevInstrument.current = instrument;

    intervalRef.current = setInterval(() => load(instrument), 60_000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [instrument]);

  if (hidden || (!loading && !data)) return null;

  const positive = (data?.changePct ?? 0) >= 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 bg-white">
        <span className="text-[10px] font-mono font-bold text-gray-900 uppercase tracking-widest">
          {instrument}
        </span>
        <span className="text-[8px] font-mono text-gray-400">Live · FinnHub · 60s refresh</span>
      </div>

      {loading ? (
        <div className="px-4 py-4 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: C }} />
          <span className="text-[9px] font-mono text-gray-400 animate-pulse">Fetching live data…</span>
        </div>
      ) : data ? (
        <div className="px-4 py-3 flex items-center gap-6">
          {/* Price + change */}
          <div>
            <p className="text-xl font-display font-bold text-gray-900">
              {data.price.toFixed(data.price > 100 ? 2 : 5)}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              {positive
                ? <TrendingUp  className="w-3 h-3 text-green-600" />
                : <TrendingDown className="w-3 h-3 text-red-600" />}
              <span className={`text-[10px] font-mono font-bold ${positive ? "text-green-600" : "text-red-600"}`}>
                {positive ? "+" : ""}{data.change.toFixed(data.price > 100 ? 2 : 5)} ({positive ? "+" : ""}{data.changePct.toFixed(2)}%)
              </span>
            </div>
          </div>

          {/* 52w range */}
          <div className="space-y-0.5">
            <p className="text-[8px] font-mono text-gray-400 uppercase tracking-wider">52W Range</p>
            <p className="text-[10px] font-mono text-gray-500">
              {data.low52w.toFixed(2)} – {data.high52w.toFixed(2)}
            </p>
          </div>

          {/* Sparkline */}
          {data.sparkline.length > 2 && (
            <div className="flex-1 h-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.sparkline} margin={{ top: 2, bottom: 2, left: 0, right: 0 }}>
                  <defs>
                    <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={positive ? "#16a34a" : "#dc2626"} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={positive ? "#16a34a" : "#dc2626"} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke={positive ? "#16a34a" : "#dc2626"}
                    strokeWidth={1.5}
                    fill="url(#sparkGrad)"
                    dot={false}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
