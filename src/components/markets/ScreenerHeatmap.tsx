"use client";

import { useState, useMemo } from "react";
import { ScreenerRow, MarketCategory } from "@/lib/screener";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Minus, AlertTriangle, LayoutGrid, Zap, ExternalLink } from "lucide-react";

interface ScreenerHeatmapProps {
  instruments: ScreenerRow[];
  selectedCategory?: MarketCategory | "all";
  onSelectCategory?: (category: MarketCategory | "all") => void;
  onSelect?: (instrument: ScreenerRow) => void;
  selectedSlug?: string | null;
}

export function ScreenerHeatmap({
  instruments,
  selectedCategory = "all",
  onSelectCategory,
  onSelect,
  selectedSlug,
}: ScreenerHeatmapProps) {
  const [internalCat, setInternalCat] = useState<MarketCategory | "all">("all");
  const activeCategory = onSelectCategory ? selectedCategory : internalCat;
  const setCategory = onSelectCategory || setInternalCat;

  const displayedInstruments = useMemo(() => {
    if (activeCategory === "all") return instruments;
    return instruments.filter(i => i.category === activeCategory);
  }, [instruments, activeCategory]);

  return (
    <div className="w-full bg-white border border-mkt-bd shadow-sm">
      {/* Heatmap Header & Controls */}
      <div className="px-5 py-4 border-b border-mkt-bd flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/40">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded border border-mkt-bd/80 bg-white flex items-center justify-center text-accent shadow-xs">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-mono font-extrabold uppercase tracking-tight text-mkt-ink">
                Market Performance Heatmap
              </h2>
              <span className="text-[9px] font-mono font-bold bg-slate-200/80 text-mkt-i2 px-1.5 py-0.5 rounded">
                {displayedInstruments.length} Assets
              </span>
            </div>
            <p className="text-[10px] font-mono text-mkt-i4">
              Real-time relative performance mapping across global asset classes. Click any tile for instant technical profile.
            </p>
          </div>
        </div>

        {/* Category Pills & Intensity Legend */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-1 bg-white p-1 border border-mkt-bd/80 rounded">
            {[
              { id: "all" as const, label: "All Assets" },
              { id: "forex" as const, label: "Forex" },
              { id: "commodities" as const, label: "Commodities" },
              { id: "indices" as const, label: "Indices" },
              { id: "crypto" as const, label: "Crypto" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCategory(tab.id)}
                className={cn(
                  "px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-wider transition-all rounded-xs",
                  activeCategory === tab.id
                    ? "bg-mkt-ink text-white shadow-xs"
                    : "text-mkt-i3 hover:text-mkt-ink hover:bg-slate-100/70"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Color Scale Legend */}
          <div className="hidden xl:flex items-center gap-1.5 pl-3 border-l border-mkt-bd/60 text-[9px] font-mono text-mkt-i4">
            <span>-2%</span>
            <div className="flex h-2.5 w-24 rounded-xs overflow-hidden border border-black/10">
              <div className="w-1/4 bg-red-600" title="-2% or lower" />
              <div className="w-1/4 bg-red-400" title="-0.5% to -1.5%" />
              <div className="w-1/4 bg-emerald-400" title="+0.5% to +1.5%" />
              <div className="w-1/4 bg-emerald-600" title="+2% or higher" />
            </div>
            <span>+2%</span>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="p-4 sm:p-5">
        {displayedInstruments.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-mkt-bd/60 rounded">
            <p className="text-[10px] font-mono text-mkt-i4 uppercase tracking-widest">
              No instruments match current category filter
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3">
            {displayedInstruments.map((item) => {
              const change = item.changePct ?? 0;
              const isBullish = change > 0;
              const isBearish = change < 0;
              const absChange = Math.abs(change);
              const isSelected = selectedSlug === item.slug;

              // Drawdown's restrained, light-first semantic market colors
              let bgStyle = "bg-white hover:bg-slate-50/80";
              let borderStyle = "border-mkt-bd hover:border-slate-400";
              let percentBadgeColor = "text-mkt-i3 bg-slate-100 border-slate-200";

              if (item.feed_offline) {
                bgStyle = "bg-amber-500/5 hover:bg-amber-500/10";
                borderStyle = "border-amber-500/30 hover:border-amber-500/50";
                percentBadgeColor = "text-amber-800 bg-amber-100/60 border-amber-300";
              } else if (isBullish) {
                if (absChange >= 2.0) {
                  bgStyle = "bg-emerald-500/15 hover:bg-emerald-500/22";
                  borderStyle = "border-emerald-500/40 hover:border-emerald-600";
                  percentBadgeColor = "text-emerald-800 bg-emerald-100/90 border-emerald-300";
                } else if (absChange >= 0.8) {
                  bgStyle = "bg-emerald-500/10 hover:bg-emerald-500/16";
                  borderStyle = "border-emerald-500/30 hover:border-emerald-500";
                  percentBadgeColor = "text-emerald-800 bg-emerald-100/70 border-emerald-300";
                } else {
                  bgStyle = "bg-emerald-500/5 hover:bg-emerald-500/10";
                  borderStyle = "border-emerald-500/20 hover:border-emerald-500/40";
                  percentBadgeColor = "text-emerald-800 bg-emerald-100/50 border-emerald-200";
                }
              } else if (isBearish) {
                if (absChange >= 2.0) {
                  bgStyle = "bg-red-500/15 hover:bg-red-500/22";
                  borderStyle = "border-red-500/40 hover:border-red-600";
                  percentBadgeColor = "text-red-800 bg-red-100/90 border-red-300";
                } else if (absChange >= 0.8) {
                  bgStyle = "bg-red-500/10 hover:bg-red-500/16";
                  borderStyle = "border-red-500/30 hover:border-red-500";
                  percentBadgeColor = "text-red-800 bg-red-100/70 border-red-300";
                } else {
                  bgStyle = "bg-red-500/5 hover:bg-red-500/10";
                  borderStyle = "border-red-500/20 hover:border-red-500/40";
                  percentBadgeColor = "text-red-800 bg-red-100/50 border-red-200";
                }
              }

              return (
                <div
                  key={item.slug}
                  onClick={() => onSelect?.(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelect?.(item);
                    }
                  }}
                  className={cn(
                    "group relative flex flex-col justify-between p-3.5 border transition-all duration-200 cursor-pointer select-none rounded-xs min-h-[114px]",
                    bgStyle,
                    borderStyle,
                    isSelected && "ring-2 ring-accent border-accent shadow-md -translate-y-0.5",
                    "hover:-translate-y-0.5 hover:shadow-xs"
                  )}
                >
                  {/* Top Edge Indicator Stripe */}
                  <div
                    className={cn(
                      "absolute top-0 left-0 right-0 h-1 transition-all",
                      item.feed_offline
                        ? "bg-amber-500"
                        : isBullish
                        ? absChange >= 2 ? "bg-emerald-600" : "bg-emerald-500"
                        : isBearish
                        ? absChange >= 2 ? "bg-red-600" : "bg-red-500"
                        : "bg-slate-300"
                    )}
                  />

                  {/* Header Row: Symbol & Direction Icon */}
                  <div className="flex justify-between items-start gap-1">
                    <div>
                      <h3 className="font-mono font-extrabold text-[13px] tracking-tight text-mkt-ink group-hover:text-accent transition-colors leading-tight">
                        {item.displayPair}
                      </h3>
                      <span className="text-[8px] font-mono text-mkt-i4 uppercase tracking-widest block mt-0.5 font-medium">
                        {item.category}
                      </span>
                    </div>

                    <div
                      className={cn(
                        "w-5 h-5 flex items-center justify-center border rounded-xs text-[10px] shrink-0",
                        item.feed_offline
                          ? "border-amber-500/30 text-amber-600 bg-amber-50"
                          : isBullish
                          ? "border-emerald-500/30 text-emerald-700 bg-white/70"
                          : isBearish
                          ? "border-red-500/30 text-red-700 bg-white/70"
                          : "border-mkt-bd text-mkt-i4 bg-white/70"
                      )}
                    >
                      {item.feed_offline ? (
                        <AlertTriangle className="w-2.5 h-2.5 text-amber-500" />
                      ) : isBullish ? (
                        <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                      ) : isBearish ? (
                        <ArrowDownRight className="w-3 h-3 text-red-600" />
                      ) : (
                        <Minus className="w-3 h-3 text-mkt-i4" />
                      )}
                    </div>
                  </div>

                  {/* Bottom Row: Price & 24h Move */}
                  <div className="mt-3 pt-2 border-t border-black/5 flex items-baseline justify-between">
                    <div>
                      <span className="text-[7px] font-mono uppercase tracking-wider text-mkt-i4 block leading-none mb-0.5">
                        Price
                      </span>
                      <span className="text-[12px] font-mono font-bold text-mkt-ink leading-none">
                        {item.feed_offline
                          ? "—"
                          : item.price !== null
                          ? item.price >= 1000
                            ? item.price.toLocaleString("en-GB", { minimumFractionDigits: 1, maximumFractionDigits: 2 })
                            : item.price >= 10
                            ? item.price.toFixed(2)
                            : item.price.toFixed(4)
                          : "—"}
                      </span>
                    </div>

                    <div className="text-right">
                      <span
                        className={cn(
                          "inline-block text-[11px] font-mono font-extrabold px-1.5 py-0.5 border rounded-xs",
                          percentBadgeColor
                        )}
                      >
                        {item.feed_offline
                          ? "OFFLINE"
                          : item.changePct !== null
                          ? `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`
                          : "—"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Heatmap Footer Strip */}
      <div className="px-5 py-2.5 border-t border-mkt-bd/60 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3 text-[9px] font-mono text-mkt-i4">
        <span>
          Showing {displayedInstruments.length} assets with continuous 1H rolling calculations
        </span>
        <span className="flex items-center gap-1">
          <Zap className="w-2.5 h-2.5 text-accent" />
          Click any instrument to open live TradingView chart & scanner details
        </span>
      </div>
    </div>
  );
}
