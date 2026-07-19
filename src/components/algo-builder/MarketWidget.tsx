"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { useMarketCache } from "@/hooks/useMarketCache";

const C = "var(--tool-accent)";

export function MarketWidget({ instrument }: { instrument: string }) {
  const dataMap = useMarketCache([instrument]);
  const data = dataMap[instrument];

  if (!data || data.loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 bg-white">
          <span className="text-[10px] font-mono font-bold text-gray-900 uppercase tracking-widest">
            {instrument}
          </span>
          <span className="text-[8px] font-mono text-gray-400">Loading…</span>
        </div>
        <div className="px-4 py-4 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: C }} />
          <span className="text-[9px] font-mono text-gray-400 animate-pulse">Fetching live data…</span>
        </div>
      </div>
    );
  }

  const positive = (data.change_pct ?? 0) >= 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 bg-white">
        <span className="text-[10px] font-mono font-bold text-gray-900 uppercase tracking-widest">
          {instrument}
        </span>
        <span className="text-[8px] font-mono text-gray-400">Live · {data.source || "DB Cache"}</span>
      </div>

      <div className="px-4 py-3 flex items-center gap-6">
        {/* Price + change */}
        <div>
          <p className="text-xl font-display font-bold text-gray-900">
            {data.price ? data.price.toFixed(data.price > 100 ? 2 : 5) : "—"}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            {positive
              ? <TrendingUp  className="w-3 h-3 text-green-600" />
              : <TrendingDown className="w-3 h-3 text-red-600" />}
            <span className={`text-[10px] font-mono font-bold ${positive ? "text-green-600" : "text-red-600"}`}>
              {positive ? "+" : ""}{data.change_pct ? data.change_pct.toFixed(2) : "—"}%
            </span>
          </div>
        </div>

        {/* Indicators */}
        <div className="space-y-0.5">
          <p className="text-[8px] font-mono text-gray-400 uppercase tracking-wider">Signals</p>
          <p className="text-[10px] font-mono text-gray-500">
            RSI: {data.rsi ? data.rsi.toFixed(1) : "—"} | EMA50: {data.ema50 ? data.ema50.toFixed(data.price && data.price > 100 ? 2 : 4) : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
