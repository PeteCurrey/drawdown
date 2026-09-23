"use client";

import { useMemo } from "react";
import { ScreenerRow } from "@/lib/screener";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Gauge,
  SlidersHorizontal,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Layers,
  BarChart3
} from "lucide-react";

interface ScreenerMarketConditionsProps {
  instruments: ScreenerRow[];
  onSelect?: (instrument: ScreenerRow) => void;
  selectedSlug?: string | null;
}

export function ScreenerMarketConditions({
  instruments,
  onSelect,
  selectedSlug,
}: ScreenerMarketConditionsProps) {
  // Extract real metrics from live feed
  const analysis = useMemo(() => {
    const valid = instruments.filter(i => !i.feed_offline && i.changePct !== null);
    if (valid.length === 0) return null;

    const total = valid.length;
    const advancers = valid.filter(i => (i.changePct ?? 0) > 0);
    const decliners = valid.filter(i => (i.changePct ?? 0) < 0);
    const unchanged = valid.filter(i => (i.changePct ?? 0) === 0);

    const advPct = Math.round((advancers.length / total) * 100);
    const decPct = Math.round((decliners.length / total) * 100);
    const unchPct = 100 - advPct - decPct;

    // Movement Intensity Tiers (magnitude of 24H move)
    const elevatedMove = valid.filter(i => Math.abs(i.changePct ?? 0) >= 1.5);
    const moderateMove = valid.filter(
      i => Math.abs(i.changePct ?? 0) >= 0.5 && Math.abs(i.changePct ?? 0) < 1.5
    );
    const lowMove = valid.filter(i => Math.abs(i.changePct ?? 0) < 0.5);

    // Structural shifts on 1H candle structure
    const bullishMSS = valid.filter(i => i.bias === "BULLISH");
    const bearishMSS = valid.filter(i => i.bias === "BEARISH");

    // Leaderboard sorts
    const sortedByGain = [...valid].sort((a, b) => (b.changePct ?? 0) - (a.changePct ?? 0));
    const topGainers = sortedByGain.slice(0, 4);
    const topDecliners = [...sortedByGain].reverse().slice(0, 4);

    const sortedByAbs = [...valid].sort(
      (a, b) => Math.abs(b.changePct ?? 0) - Math.abs(a.changePct ?? 0)
    );
    const mostIntense = sortedByAbs.slice(0, 4);
    const lowestMove = [...sortedByAbs].reverse().slice(0, 4);

    // RSI Momentum Rank
    const withRSI = valid.filter(i => i.rsi !== null);
    const topRSI = [...withRSI].sort((a, b) => (b.rsi ?? 0) - (a.rsi ?? 0)).slice(0, 4);

    return {
      total,
      advCount: advancers.length,
      decCount: decliners.length,
      unchCount: unchanged.length,
      advPct,
      decPct,
      unchPct,
      elevatedMoveCount: elevatedMove.length,
      moderateMoveCount: moderateMove.length,
      lowMoveCount: lowMove.length,
      bullishMSSCount: bullishMSS.length,
      bearishMSSCount: bearishMSS.length,
      topGainers,
      topDecliners,
      mostIntense,
      lowestMove,
      topRSI,
    };
  }, [instruments]);

  if (!analysis) {
    return null;
  }

  return (
    <section className="w-full bg-white border border-mkt-bd shadow-sm">
      {/* Editorial Section Header */}
      <div className="px-5 py-4 border-b border-mkt-bd bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <h2 className="text-sm font-mono font-extrabold uppercase tracking-tight text-mkt-ink">
              Market Conditions
            </h2>
            <span className="text-[9px] font-mono font-bold bg-slate-200/80 text-mkt-i2 px-1.5 py-0.5 rounded-xs">
              4 Pillars
            </span>
          </div>
          <p className="text-[11px] font-sans text-mkt-i3">
            Where is the market moving, where is price movement expanding, and what is the cross-market dispersion?
          </p>
        </div>

        <div className="flex items-center gap-2 text-[9px] font-mono text-mkt-i4">
          <span className="hidden sm:inline">Universe: {analysis.total} Global Instruments</span>
          <span className="hidden sm:inline">·</span>
          <span>True Cross-Asset Calculation</span>
        </div>
      </div>

      {/* ── Four Pillars Overview Board ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-mkt-bd border-b border-mkt-bd">
        {/* Pillar 1: Market Breadth */}
        <div className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono uppercase tracking-widest font-bold text-mkt-i3 flex items-center gap-1.5">
              <BarChart3 className="w-3 h-3 text-accent" />
              Market Breadth
            </span>
            <span className={cn(
              "text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded-xs border",
              analysis.advPct >= 55
                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                : analysis.decPct >= 55
                ? "bg-red-50 text-red-800 border-red-300"
                : "bg-slate-100 text-mkt-i2 border-slate-200"
            )}>
              {analysis.advPct >= 55 ? "BULLISH BIAS" : analysis.decPct >= 55 ? "BEARISH BIAS" : "BALANCED FLOW"}
            </span>
          </div>

          {/* Segmented Breadth Bar */}
          <div className="space-y-1.5">
            <div className="h-2 w-full flex overflow-hidden rounded-xs border border-black/10 bg-slate-100">
              <div
                style={{ width: `${analysis.advPct}%` }}
                className="bg-emerald-600 transition-all duration-500"
                title={`Advancing: ${analysis.advCount} (${analysis.advPct}%)`}
              />
              <div
                style={{ width: `${analysis.unchPct}%` }}
                className="bg-slate-300 transition-all duration-500"
                title={`Unchanged: ${analysis.unchCount} (${analysis.unchPct}%)`}
              />
              <div
                style={{ width: `${analysis.decPct}%` }}
                className="bg-red-600 transition-all duration-500"
                title={`Declining: ${analysis.decCount} (${analysis.decPct}%)`}
              />
            </div>
            <div className="flex justify-between items-center text-[9px] font-mono">
              <span className="text-emerald-700 font-bold">
                ▲ {analysis.advCount} ({analysis.advPct}%)
              </span>
              <span className="text-mkt-i4">
                — {analysis.unchCount}
              </span>
              <span className="text-red-700 font-bold">
                ▼ {analysis.decCount} ({analysis.decPct}%)
              </span>
            </div>
          </div>

          <p className="text-[10px] font-mono text-mkt-i3 leading-tight pt-1">
            {analysis.advPct > analysis.decPct
              ? `${analysis.advPct}% of assets are gaining against benchmark closes.`
              : `${analysis.decPct}% of assets are facing net selling pressure.`}
          </p>
        </div>

        {/* Pillar 2: Movement Intensity */}
        <div className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono uppercase tracking-widest font-bold text-mkt-i3 flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-accent" />
              Movement Intensity
            </span>
            <span className="text-[9px] font-mono font-bold text-mkt-i4">
              24H Magnitude
            </span>
          </div>

          {/* Intensity Tiers */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-mkt-i2">Elevated Move (&gt;1.5%)</span>
              <span className="font-bold text-mkt-ink">{analysis.elevatedMoveCount} assets</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-xs overflow-hidden">
              <div
                className="bg-accent h-full"
                style={{ width: `${(analysis.elevatedMoveCount / analysis.total) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono pt-1">
              <span className="text-mkt-i4">Moderate (0.5%–1.5%)</span>
              <span className="font-semibold text-mkt-i2">{analysis.moderateMoveCount}</span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-mkt-i4">Low Movement (&lt;0.5%)</span>
              <span className="font-semibold text-mkt-i4">{analysis.lowMoveCount}</span>
            </div>
          </div>
        </div>

        {/* Pillar 3: Momentum (RSI & MSS) */}
        <div className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono uppercase tracking-widest font-bold text-mkt-i3 flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-accent" />
              Momentum (RSI &amp; MSS)
            </span>
            <span className="text-[9px] font-mono font-bold text-mkt-i4">
              1H Structure
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-slate-50 border border-mkt-bd/60 rounded-xs">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[10px] font-mono font-bold text-mkt-ink">Bullish Shifts</span>
              </div>
              <span className="text-[11px] font-mono font-extrabold text-emerald-700">
                {analysis.bullishMSSCount}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 bg-slate-50 border border-mkt-bd/60 rounded-xs">
              <div className="flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5 text-red-600" />
                <span className="text-[10px] font-mono font-bold text-mkt-ink">Bearish Shifts</span>
              </div>
              <span className="text-[11px] font-mono font-extrabold text-red-700">
                {analysis.bearishMSSCount}
              </span>
            </div>
          </div>
        </div>

        {/* Pillar 4: Movement Range */}
        <div className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono uppercase tracking-widest font-bold text-mkt-i3 flex items-center gap-1.5">
              <Gauge className="w-3 h-3 text-accent" />
              Movement Range
            </span>
            <span className="text-[9px] font-mono font-bold text-mkt-i4">
              Price Dispersion
            </span>
          </div>

          <div className="space-y-2 text-[10px] font-mono">
            <div className="flex justify-between items-baseline border-b border-mkt-bd/40 pb-1.5">
              <span className="text-mkt-i3">Max Expansion:</span>
              <span className="font-extrabold text-emerald-700">
                {analysis.topGainers[0]?.displayPair || "—"} ({analysis.topGainers[0]?.changePct !== null ? `+${analysis.topGainers[0]?.changePct}%` : "—"})
              </span>
            </div>
            <div className="flex justify-between items-baseline border-b border-mkt-bd/40 pb-1.5">
              <span className="text-mkt-i3">Max Drawdown:</span>
              <span className="font-extrabold text-red-700">
                {analysis.topDecliners[0]?.displayPair || "—"} ({analysis.topDecliners[0]?.changePct !== null ? `${analysis.topDecliners[0]?.changePct}%` : "—"})
              </span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-mkt-i4">Dispersion Spread:</span>
              <span className="font-mono text-mkt-ink font-bold">
                {analysis.topGainers[0]?.changePct !== null && analysis.topDecliners[0]?.changePct !== null
                  ? `${((analysis.topGainers[0]?.changePct ?? 0) - (analysis.topDecliners[0]?.changePct ?? 0)).toFixed(2)}% spread`
                  : "—"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Four Compact Summary Leaderboards ──────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-mkt-bd bg-slate-50/30">
        {/* Leaderboard 1: Top Movers */}
        <div className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-mkt-bd pb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest font-extrabold text-mkt-ink flex items-center gap-1.5">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
              Top Movers
            </span>
            <span className="text-[8px] font-mono text-mkt-i4 uppercase">24H Move</span>
          </div>

          <div className="space-y-1.5">
            {analysis.topGainers.map((item) => (
              <div
                key={item.slug}
                onClick={() => onSelect?.(item)}
                className={cn(
                  "flex items-center justify-between p-2 rounded-xs border border-transparent hover:border-mkt-bd hover:bg-white transition-all cursor-pointer group",
                  selectedSlug === item.slug && "bg-white border-accent"
                )}
              >
                <div>
                  <span className="font-mono text-[11px] font-bold text-mkt-ink group-hover:text-accent transition-colors block">
                    {item.displayPair}
                  </span>
                  <span className="font-mono text-[8px] text-mkt-i4 uppercase">
                    {item.category}
                  </span>
                </div>
                <div className="text-right">
                  <span className="inline-block font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-xs">
                    +{item.changePct?.toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard 2: Weakest Movers */}
        <div className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-mkt-bd pb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest font-extrabold text-mkt-ink flex items-center gap-1.5">
              <ArrowDownRight className="w-3.5 h-3.5 text-red-600" />
              Weakest
            </span>
            <span className="text-[8px] font-mono text-mkt-i4 uppercase">24H Move</span>
          </div>

          <div className="space-y-1.5">
            {analysis.topDecliners.map((item) => (
              <div
                key={item.slug}
                onClick={() => onSelect?.(item)}
                className={cn(
                  "flex items-center justify-between p-2 rounded-xs border border-transparent hover:border-mkt-bd hover:bg-white transition-all cursor-pointer group",
                  selectedSlug === item.slug && "bg-white border-accent"
                )}
              >
                <div>
                  <span className="font-mono text-[11px] font-bold text-mkt-ink group-hover:text-accent transition-colors block">
                    {item.displayPair}
                  </span>
                  <span className="font-mono text-[8px] text-mkt-i4 uppercase">
                    {item.category}
                  </span>
                </div>
                <div className="text-right">
                  <span className="inline-block font-mono text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-xs">
                    {item.changePct?.toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard 3: RSI Leaders */}
        <div className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-mkt-bd pb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest font-extrabold text-mkt-ink flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-accent" />
              RSI Leaders
            </span>
            <span className="text-[8px] font-mono text-mkt-i4 uppercase">RSI (14) Rank</span>
          </div>

          <div className="space-y-1.5">
            {analysis.topRSI.map((item) => (
              <div
                key={item.slug}
                onClick={() => onSelect?.(item)}
                className={cn(
                  "flex items-center justify-between p-2 rounded-xs border border-transparent hover:border-mkt-bd hover:bg-white transition-all cursor-pointer group",
                  selectedSlug === item.slug && "bg-white border-accent"
                )}
              >
                <div>
                  <span className="font-mono text-[11px] font-bold text-mkt-ink group-hover:text-accent transition-colors block">
                    {item.displayPair}
                  </span>
                  <span className="font-mono text-[8px] text-mkt-i4 uppercase">
                    {item.bias}
                  </span>
                </div>
                <div className="text-right">
                  <span className={cn(
                    "inline-block font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-xs border",
                    (item.rsi ?? 0) >= 65
                      ? "text-emerald-800 bg-emerald-50 border-emerald-200"
                      : "text-mkt-i2 bg-slate-100 border-slate-200"
                  )}>
                    RSI {item.rsi?.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard 4: Lowest Movement */}
        <div className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-mkt-bd pb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest font-extrabold text-mkt-ink flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-mkt-i3" />
              Lowest Movement
            </span>
            <span className="text-[8px] font-mono text-mkt-i4 uppercase">Smallest Net Move</span>
          </div>

          <div className="space-y-1.5">
            {analysis.lowestMove.map((item) => (
              <div
                key={item.slug}
                onClick={() => onSelect?.(item)}
                className={cn(
                  "flex items-center justify-between p-2 rounded-xs border border-transparent hover:border-mkt-bd hover:bg-white transition-all cursor-pointer group",
                  selectedSlug === item.slug && "bg-white border-accent"
                )}
              >
                <div>
                  <span className="font-mono text-[11px] font-bold text-mkt-ink group-hover:text-accent transition-colors block">
                    {item.displayPair}
                  </span>
                  <span className="font-mono text-[8px] text-mkt-i4 uppercase">
                    {item.category}
                  </span>
                </div>
                <div className="text-right">
                  <span className="inline-block font-mono text-[10px] font-medium text-mkt-i3 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-xs">
                    {Math.abs(item.changePct ?? 0).toFixed(2)}% net
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
