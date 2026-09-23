"use client";

import { useMemo } from "react";
import { ScreenerRow } from "@/lib/screener";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Activity, Sparkles, Clock, Globe } from "lucide-react";

interface ScreenerMarketPulseProps {
  instruments: ScreenerRow[];
  lastUpdated?: Date | null;
}

export function ScreenerMarketPulse({ instruments, lastUpdated }: ScreenerMarketPulseProps) {
  const stats = useMemo(() => {
    const valid = instruments.filter(i => !i.feed_offline && i.changePct !== null);
    if (valid.length === 0) return null;

    const advancers = valid.filter(i => (i.changePct ?? 0) > 0);
    const decliners = valid.filter(i => (i.changePct ?? 0) < 0);
    const unchanged = valid.filter(i => (i.changePct ?? 0) === 0);

    const advCount = advancers.length;
    const decCount = decliners.length;
    const unchCount = unchanged.length;
    const totalCount = valid.length;

    const advancePct = Math.round((advCount / totalCount) * 100);

    // Top gainer & decliner
    const sorted = [...valid].sort((a, b) => (b.changePct ?? 0) - (a.changePct ?? 0));
    const topGainer = sorted[0];
    const topDecliner = sorted[sorted.length - 1];

    // Category momentum averages
    const categories = ["forex", "commodities", "indices", "crypto"] as const;
    const catStats = categories.map(cat => {
      const items = valid.filter(i => i.category === cat);
      if (items.length === 0) return { cat, avg: 0, count: 0 };
      const avg = items.reduce((sum, i) => sum + (i.changePct ?? 0), 0) / items.length;
      return { cat, avg, count: items.length };
    }).filter(c => c.count > 0);

    // Find strongest and weakest category
    const sortedCats = [...catStats].sort((a, b) => b.avg - a.avg);
    const strongestCat = sortedCats[0];
    const weakestCat = sortedCats[sortedCats.length - 1];

    // Bullish MSS bias count
    const bullishBiasCount = valid.filter(i => i.bias === "BULLISH").length;
    const bullishBiasPct = Math.round((bullishBiasCount / totalCount) * 100);

    return {
      advCount,
      decCount,
      unchCount,
      totalCount,
      advancePct,
      topGainer,
      topDecliner,
      catStats,
      strongestCat,
      weakestCat,
      bullishBiasPct,
    };
  }, [instruments]);

  if (!stats) return null;

  return (
    <div className="w-full bg-white border border-mkt-bd shadow-sm">
      {/* Top micro-bar: Section title & Feed Status */}
      <div className="px-5 py-2.5 border-b border-mkt-bd/60 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold uppercase tracking-wider text-mkt-ink flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-accent" />
            Market Breadth & Pulse
          </span>
          <span className="text-mkt-i4 hidden sm:inline">
            · Real-Time Statistical Summary across {stats.totalCount} Assets
          </span>
        </div>

        <div className="flex items-center gap-3 text-mkt-i4">
          {lastUpdated && (
            <span className="flex items-center gap-1 text-[9px]">
              <Clock className="w-2.5 h-2.5" />
              Updated {lastUpdated.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
          )}
          <span className="px-1.5 py-0.5 border border-mkt-bd bg-white rounded text-[8px] uppercase tracking-wider font-semibold">
            60s Edge Cache
          </span>
        </div>
      </div>

      {/* Main Pulse 4-Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-mkt-bd/60">
        {/* Metric 1: Advancers vs Decliners */}
        <div className="p-4 sm:p-5 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4 font-medium">
              Market Breadth
            </span>
            <span className="text-[9px] font-mono font-bold text-mkt-ink bg-slate-100 px-1.5 py-0.5 rounded">
              {stats.advancePct}% Bullish
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between font-mono">
              <span className="text-xl font-extrabold text-emerald-700 flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                {stats.advCount}
                <span className="text-[10px] font-normal text-emerald-700/80 uppercase">Adv</span>
              </span>
              <span className="text-xs text-mkt-i4 font-medium">
                {stats.unchCount} Flat
              </span>
              <span className="text-xl font-extrabold text-red-700 flex items-center gap-1">
                {stats.decCount}
                <span className="text-[10px] font-normal text-red-700/80 uppercase">Dec</span>
                <TrendingDown className="w-4 h-4 text-red-600" />
              </span>
            </div>

            {/* Split Bar */}
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
              <div 
                className="bg-emerald-500 h-full transition-all duration-500" 
                style={{ width: `${(stats.advCount / stats.totalCount) * 100}%` }} 
                title={`${stats.advCount} Advancing`}
              />
              <div 
                className="bg-slate-300 h-full transition-all duration-500" 
                style={{ width: `${(stats.unchCount / stats.totalCount) * 100}%` }} 
                title={`${stats.unchCount} Flat`}
              />
              <div 
                className="bg-red-500 h-full transition-all duration-500" 
                style={{ width: `${(stats.decCount / stats.totalCount) * 100}%` }} 
                title={`${stats.decCount} Declining`}
              />
            </div>
          </div>
        </div>

        {/* Metric 2: Top Mover Spotlight */}
        <div className="p-4 sm:p-5 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4 font-medium">
              Top Mover (24h)
            </span>
            <span className="text-[9px] font-mono font-bold text-accent uppercase">
              Volatility Leader
            </span>
          </div>

          {stats.topGainer && (
            <div className="flex items-baseline justify-between">
              <div>
                <span className="font-mono text-lg font-bold text-mkt-ink block leading-none">
                  {stats.topGainer.displayPair}
                </span>
                <span className="text-[9px] font-mono text-mkt-i4 uppercase mt-1 block">
                  {stats.topGainer.category} · {stats.topGainer.price !== null ? (stats.topGainer.price >= 10 ? stats.topGainer.price.toFixed(2) : stats.topGainer.price.toFixed(4)) : "—"}
                </span>
              </div>
              <span className="font-mono text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                +{(stats.topGainer.changePct ?? 0).toFixed(2)}%
              </span>
            </div>
          )}
        </div>

        {/* Metric 3: Asset Class Regime */}
        <div className="p-4 sm:p-5 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4 font-medium">
              Sector Performance
            </span>
            <span className="text-[9px] font-mono text-mkt-i4">
              Avg 24h %
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
            {stats.catStats.map((item) => {
              const isPos = item.avg >= 0;
              return (
                <div key={item.cat} className="flex items-center justify-between border border-mkt-bd/40 px-2 py-1 bg-slate-50/40 rounded">
                  <span className="capitalize text-mkt-i3 truncate">{item.cat}</span>
                  <span className={cn("font-bold text-[9px]", isPos ? "text-emerald-700" : "text-red-700")}>
                    {isPos ? "+" : ""}{item.avg.toFixed(2)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Metric 4: MSS Bias Sentiment */}
        <div className="p-4 sm:p-5 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4 font-medium">
              MSS Structural Bias
            </span>
            <span className="text-[9px] font-mono font-bold text-mkt-ink bg-slate-100 px-1.5 py-0.5 rounded">
              1H Confluence
            </span>
          </div>

          <div>
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="font-mono text-xs font-semibold text-mkt-i2">
                Bullish Market Shifts
              </span>
              <span className="font-mono text-sm font-bold text-mkt-ink">
                {stats.bullishBiasPct}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="bg-accent h-full transition-all duration-500" 
                style={{ width: `${stats.bullishBiasPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
