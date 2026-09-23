"use client";

import { useMemo } from "react";
import { ScreenerRow } from "@/lib/screener";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Activity, Sparkles, Clock, Globe } from "lucide-react";

interface ScreenerMarketPulseProps {
  instruments: ScreenerRow[];
  lastUpdated?: Date | null;
}

const CATEGORY_LABELS: Record<string, string> = {
  forex: "Forex",
  commodities: "Commodities",
  indices: "Indices",
  crypto: "Crypto",
  "stocks-uk": "UK Equities",
  "stocks-us": "US Equities",
};

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
    const declinePct = Math.round((decCount / totalCount) * 100);

    // Top gainer & decliner
    const sorted = [...valid].sort((a, b) => (b.changePct ?? 0) - (a.changePct ?? 0));
    const topGainer = sorted[0];
    const topDecliner = sorted[sorted.length - 1];

    // Category momentum averages
    const categories = ["forex", "commodities", "indices", "crypto", "stocks-uk", "stocks-us"] as const;
    const catStats = categories.map(cat => {
      const items = valid.filter(i => i.category === cat);
      if (items.length === 0) return { cat, label: CATEGORY_LABELS[cat] || cat, avg: 0, count: 0 };
      const avg = items.reduce((sum, i) => sum + (i.changePct ?? 0), 0) / items.length;
      return { cat, label: CATEGORY_LABELS[cat] || cat, avg, count: items.length };
    }).filter(c => c.count > 0);

    // Find strongest and weakest category
    const sortedCats = [...catStats].sort((a, b) => b.avg - a.avg);
    const strongestCat = sortedCats[0];
    const weakestCat = sortedCats[sortedCats.length - 1];

    // Bullish MSS bias count
    const bullishBiasCount = valid.filter(i => i.bias === "BULLISH").length;
    const bearishBiasCount = valid.filter(i => i.bias === "BEARISH").length;
    const bullishBiasPct = Math.round((bullishBiasCount / totalCount) * 100);

    return {
      advCount,
      decCount,
      unchCount,
      totalCount,
      advancePct,
      declinePct,
      topGainer,
      topDecliner,
      catStats,
      strongestCat,
      weakestCat,
      bullishBiasCount,
      bearishBiasCount,
      bullishBiasPct,
    };
  }, [instruments]);

  if (!stats) return null;

  return (
    <div className="w-full bg-white border border-mkt-bd shadow-sm">
      {/* Top micro-bar: Section title & Feed Status */}
      <div className="px-4 py-2 border-b border-mkt-bd/60 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-extrabold uppercase tracking-wider text-mkt-ink flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-accent" />
            Market Pulse
          </span>
          <span className="text-mkt-i4 hidden sm:inline">
            · Live Market-Status Orientation Strip ({stats.totalCount} Instruments)
          </span>
        </div>

        <div className="flex items-center gap-3 text-mkt-i4">
          {lastUpdated && (
            <span className="flex items-center gap-1 text-[9px]">
              <Clock className="w-2.5 h-2.5" />
              Synced {lastUpdated.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
          )}
          <span className="px-1.5 py-0.5 border border-mkt-bd bg-white rounded-xs text-[8px] uppercase tracking-wider font-semibold">
            60s Edge Cache
          </span>
        </div>
      </div>

      {/* Main Unified Status Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-mkt-bd">
        {/* Strip Segment 1: Market Breadth */}
        <div className="p-3.5 sm:p-4 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono uppercase tracking-widest text-mkt-i4 font-bold">
              Market Breadth
            </span>
            <span className={cn(
              "text-[8px] font-mono font-extrabold px-1.5 py-0.2 rounded-2xs border",
              stats.advancePct >= 55
                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                : stats.declinePct >= 55
                ? "bg-red-50 text-red-800 border-red-300"
                : "bg-slate-100 text-mkt-i2 border-slate-200"
            )}>
              {stats.advancePct >= 55 ? "BULLISH BREADTH" : stats.declinePct >= 55 ? "BEARISH BREADTH" : "MIXED FLOW"}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between font-mono text-xs">
              <span className="font-extrabold text-emerald-700 flex items-center gap-1">
                ▲ {stats.advCount} <span className="text-[9px] font-normal text-mkt-i4">Adv</span>
              </span>
              <span className="text-[10px] text-mkt-i4">
                {stats.unchCount} Flat
              </span>
              <span className="font-extrabold text-red-700 flex items-center gap-1">
                ▼ {stats.decCount} <span className="text-[9px] font-normal text-mkt-i4">Dec</span>
              </span>
            </div>

            {/* Split Distribution Bar */}
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex border border-black/5">
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

        {/* Strip Segment 2: Top Gainer & Decliner */}
        <div className="p-3.5 sm:p-4 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono uppercase tracking-widest text-mkt-i4 font-bold">
              Top 24H Movers
            </span>
            <span className="text-[8px] font-mono text-mkt-i4 uppercase">
              Extreme Move
            </span>
          </div>

          <div className="space-y-1.5 text-[11px] font-mono">
            {stats.topGainer && (
              <div className="flex items-center justify-between">
                <span className="font-bold text-mkt-ink truncate max-w-[120px]">
                  {stats.topGainer.displayPair}
                </span>
                <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-2xs">
                  +{(stats.topGainer.changePct ?? 0).toFixed(2)}%
                </span>
              </div>
            )}
            {stats.topDecliner && (
              <div className="flex items-center justify-between">
                <span className="font-bold text-mkt-ink truncate max-w-[120px]">
                  {stats.topDecliner.displayPair}
                </span>
                <span className="text-[9px] font-bold text-red-800 bg-red-50 border border-red-200 px-1.5 py-0.2 rounded-2xs">
                  {(stats.topDecliner.changePct ?? 0).toFixed(2)}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Strip Segment 3: Sector Regime */}
        <div className="p-3.5 sm:p-4 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono uppercase tracking-widest text-mkt-i4 font-bold">
              Sector Momentum
            </span>
            <span className="text-[8px] font-mono text-mkt-i4 uppercase">
              24H Category Avg
            </span>
          </div>

          <div className="space-y-1.5 text-[11px] font-mono">
            {stats.strongestCat && (
              <div className="flex items-center justify-between">
                <span className="text-mkt-i2 truncate max-w-[120px]">
                  ▲ {stats.strongestCat.label}
                </span>
                <span className={cn(
                  "text-[9px] font-bold px-1.5 py-0.2 rounded-2xs border",
                  stats.strongestCat.avg >= 0
                    ? "text-emerald-800 bg-emerald-50 border-emerald-200"
                    : "text-red-800 bg-red-50 border-red-200"
                )}>
                  {stats.strongestCat.avg >= 0 ? "+" : ""}{stats.strongestCat.avg.toFixed(2)}%
                </span>
              </div>
            )}
            {stats.weakestCat && (
              <div className="flex items-center justify-between">
                <span className="text-mkt-i2 truncate max-w-[120px]">
                  ▼ {stats.weakestCat.label}
                </span>
                <span className={cn(
                  "text-[9px] font-bold px-1.5 py-0.2 rounded-2xs border",
                  stats.weakestCat.avg >= 0
                    ? "text-emerald-800 bg-emerald-50 border-emerald-200"
                    : "text-red-800 bg-red-50 border-red-200"
                )}>
                  {stats.weakestCat.avg >= 0 ? "+" : ""}{stats.weakestCat.avg.toFixed(2)}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Strip Segment 4: MSS Structural Bias */}
        <div className="p-3.5 sm:p-4 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono uppercase tracking-widest text-mkt-i4 font-bold">
              1H MSS Bias
            </span>
            <span className="text-[8px] font-mono text-accent font-bold uppercase">
              Market Structure
            </span>
          </div>

          <div className="space-y-1.5 font-mono">
            <div className="flex items-baseline justify-between text-xs">
              <span className="text-mkt-i2 text-[10px]">
                {stats.bullishBiasCount} Bullish · {stats.bearishBiasCount} Bearish
              </span>
              <span className="font-extrabold text-mkt-ink text-xs">
                {stats.bullishBiasPct}% Bullish
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-black/5">
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
