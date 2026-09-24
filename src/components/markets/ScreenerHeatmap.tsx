"use client";

import { useState, useMemo } from "react";
import { ScreenerRow, MarketCategory } from "@/lib/screener";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  AlertTriangle,
  LayoutGrid,
  Zap,
  ExternalLink,
  ChevronDown,
  Layers,
  Activity,
  Sliders,
  Sparkles
} from "lucide-react";

import { motion, useReducedMotion } from "framer-motion";

export type HeatmapMetric = "performance" | "rsi" | "bias" | "intensity";
export type HeatmapLayout = "matrix" | "grid";

interface ScreenerHeatmapProps {
  instruments: ScreenerRow[];
  selectedCategory?: MarketCategory | "all";
  onSelectCategory?: (category: MarketCategory | "all") => void;
  onSelect?: (instrument: ScreenerRow) => void;
  selectedSlug?: string | null;
  changedSlugs?: Map<string, "up" | "down">;
}

const CATEGORY_NAMES: Record<MarketCategory, string> = {
  forex: "Forex Majors & Crosses",
  commodities: "Commodities & Metals",
  indices: "Equity Benchmarks",
  crypto: "Digital Assets",
  "stocks-uk": "UK Equities",
  "stocks-us": "US Equities",
};

// Benchmark assets that receive visual hierarchy (CORE tag) in matrix view.
// NOTE: "CORE" represents Drawdown's editorial watchlist priority, NOT a claim of market capitalization or trading volume.
const BENCHMARK_SLUGS = new Set([
  "EURUSD",
  "GBPUSD",
  "USDJPY",
  "XAUUSD",
  "WTIUSD",
  "SPX",
  "NDX",
  "UKX",
  "BTCUSDT",
  "ETHUSDT",
  "SOLUSDT"
]);

export function ScreenerHeatmap({
  instruments,
  selectedCategory = "all",
  onSelectCategory,
  onSelect,
  selectedSlug,
  changedSlugs,
}: ScreenerHeatmapProps) {
  const shouldReduceMotion = useReducedMotion();
  const [internalCat, setInternalCat] = useState<MarketCategory | "all">("all");
  const [metricMode, setMetricMode] = useState<HeatmapMetric>("performance");
  const [layoutMode, setLayoutMode] = useState<HeatmapLayout>("matrix");
  const [hoveredInstrument, setHoveredInstrument] = useState<ScreenerRow | null>(null);

  const activeCategory = onSelectCategory ? selectedCategory : internalCat;
  const setCategory = onSelectCategory || setInternalCat;

  const filteredInstruments = useMemo(() => {
    if (activeCategory === "all") return instruments;
    return instruments.filter(i => i.category === activeCategory);
  }, [instruments, activeCategory]);

  // Group by category for Matrix mode across all 6 asset classes
  const categorizedGroups = useMemo(() => {
    const categories: MarketCategory[] = [
      "forex",
      "commodities",
      "indices",
      "crypto",
      "stocks-uk",
      "stocks-us"
    ];
    return categories
      .map(cat => ({
        category: cat,
        label: CATEGORY_NAMES[cat] || cat,
        items: filteredInstruments.filter(i => i.category === cat),
      }))
      .filter(g => g.items.length > 0);
  }, [filteredInstruments]);

  // Resolve styling based on selected metric mode
  const getTileStyle = (item: ScreenerRow) => {
    if (item.feed_offline) {
      return {
        bg: "bg-amber-500/5 hover:bg-amber-500/10",
        border: "border-amber-500/30 hover:border-amber-500/50",
        stripe: "bg-amber-500",
        badge: "text-amber-800 bg-amber-100/60 border-amber-300",
        label: "OFFLINE",
      };
    }

    if (metricMode === "performance") {
      const change = item.changePct ?? 0;
      const absChange = Math.abs(change);
      const isBullish = change > 0;
      const isBearish = change < 0;

      if (isBullish) {
        const bg = absChange >= 2.0
          ? "bg-emerald-500/15 hover:bg-emerald-500/22"
          : absChange >= 0.8
          ? "bg-emerald-500/10 hover:bg-emerald-500/16"
          : "bg-emerald-500/5 hover:bg-emerald-500/10";
        const border = absChange >= 2.0
          ? "border-emerald-500/40 hover:border-emerald-600"
          : "border-emerald-500/25 hover:border-emerald-500/50";
        return {
          bg,
          border,
          stripe: absChange >= 2 ? "bg-emerald-600" : "bg-emerald-500",
          badge: "text-emerald-800 bg-emerald-100/80 border-emerald-300",
          label: `+${change.toFixed(2)}%`,
        };
      }

      if (isBearish) {
        const bg = absChange >= 2.0
          ? "bg-red-500/15 hover:bg-red-500/22"
          : absChange >= 0.8
          ? "bg-red-500/10 hover:bg-red-500/16"
          : "bg-red-500/5 hover:bg-red-500/10";
        const border = absChange >= 2.0
          ? "border-red-500/40 hover:border-red-600"
          : "border-red-500/25 hover:border-red-500/50";
        return {
          bg,
          border,
          stripe: absChange >= 2 ? "bg-red-600" : "bg-red-500",
          badge: "text-red-800 bg-red-100/80 border-red-300",
          label: `${change.toFixed(2)}%`,
        };
      }

      return {
        bg: "bg-slate-50 hover:bg-slate-100/80",
        border: "border-mkt-bd hover:border-slate-400",
        stripe: "bg-slate-300",
        badge: "text-mkt-i3 bg-slate-100 border-slate-200",
        label: "0.00%",
      };
    }

    if (metricMode === "rsi") {
      const rsi = item.rsi;
      if (rsi === null) {
        return {
          bg: "bg-slate-50",
          border: "border-mkt-bd",
          stripe: "bg-slate-300",
          badge: "text-mkt-i4 bg-slate-100 border-slate-200",
          label: "RSI —",
        };
      }
      if (rsi >= 70) {
        return {
          bg: "bg-red-500/12 hover:bg-red-500/18",
          border: "border-red-500/35 hover:border-red-600",
          stripe: "bg-red-600",
          badge: "text-red-800 bg-red-100/90 border-red-300",
          label: `RSI ${rsi.toFixed(1)} OB`,
        };
      }
      if (rsi <= 30) {
        return {
          bg: "bg-emerald-500/15 hover:bg-emerald-500/22",
          border: "border-emerald-500/40 hover:border-emerald-600",
          stripe: "bg-emerald-600",
          badge: "text-emerald-800 bg-emerald-100/90 border-emerald-300",
          label: `RSI ${rsi.toFixed(1)} OS`,
        };
      }
      return {
        bg: "bg-slate-50/70 hover:bg-slate-100/80",
        border: "border-mkt-bd hover:border-slate-400",
        stripe: "bg-slate-400",
        badge: "text-mkt-i2 bg-slate-100 border-slate-200",
        label: `RSI ${rsi.toFixed(1)}`,
      };
    }

    if (metricMode === "bias") {
      if (item.bias === "BULLISH") {
        return {
          bg: "bg-emerald-500/10 hover:bg-emerald-500/16",
          border: "border-emerald-500/35 hover:border-emerald-600",
          stripe: "bg-emerald-600",
          badge: "text-emerald-800 bg-emerald-100/80 border-emerald-300",
          label: "MSS BULLISH",
        };
      }
      if (item.bias === "BEARISH") {
        return {
          bg: "bg-red-500/10 hover:bg-red-500/16",
          border: "border-red-500/35 hover:border-red-600",
          stripe: "bg-red-600",
          badge: "text-red-800 bg-red-100/80 border-red-300",
          label: "MSS BEARISH",
        };
      }
      return {
        bg: "bg-slate-50/60 hover:bg-slate-100/80",
        border: "border-mkt-bd hover:border-slate-400",
        stripe: "bg-slate-300",
        badge: "text-mkt-i3 bg-slate-100 border-slate-200",
        label: "NEUTRAL",
      };
    }

    // Movement Intensity Mode: magnitude of the current 24H price move
    const change = item.changePct ?? 0;
    const absChange = Math.abs(change);
    if (absChange >= 2.0) {
      return {
        bg: "bg-accent/15 hover:bg-accent/22",
        border: "border-accent/40 hover:border-accent",
        stripe: "bg-accent",
        badge: "text-accent bg-accent/10 border-accent/30 font-bold",
        label: `MOVE ${absChange.toFixed(2)}%`,
      };
    }
    if (absChange >= 0.8) {
      return {
        bg: "bg-accent/8 hover:bg-accent/14",
        border: "border-accent/25 hover:border-accent/40",
        stripe: "bg-accent/70",
        badge: "text-accent bg-accent/8 border-accent/20",
        label: `MOVE ${absChange.toFixed(2)}%`,
      };
    }
    return {
      bg: "bg-slate-50/60 hover:bg-slate-100/80",
      border: "border-mkt-bd hover:border-slate-400",
      stripe: "bg-slate-300",
      badge: "text-mkt-i3 bg-slate-100 border-slate-200",
      label: `MOVE ${absChange.toFixed(2)}%`,
    };
  };

  const renderTile = (item: ScreenerRow, isFeatured = false, index = 0) => {
    const style = getTileStyle(item);
    const isSelected = selectedSlug === item.slug;
    const isBullish = (item.changePct ?? 0) > 0;
    const isBearish = (item.changePct ?? 0) < 0;

    // STEP 4: Heatmap tile pulse & one-shot glow
    const direction = changedSlugs?.get(item.slug);
    const glowShadow = direction === "up"
      ? "0 0 14px rgba(24, 184, 128, 0.45)"
      : direction === "down"
      ? "0 0 14px rgba(206, 105, 105, 0.45)"
      : "0 0 0px rgba(0, 0, 0, 0)";

    return (
      <motion.div
        key={item.slug}
        onClick={() => onSelect?.(item)}
        onMouseEnter={() => setHoveredInstrument(item)}
        onMouseLeave={() => setHoveredInstrument(null)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect?.(item);
          }
        }}
        // STEP 4: First-paint "power-on" sweep (initial-render choreography, ~20ms stagger)
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
        animate={{
          opacity: 1,
          scale: 1,
          boxShadow: direction
            ? [glowShadow, glowShadow, "0 0 0px rgba(0, 0, 0, 0)"]
            : isSelected
            ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            : "0 0 0px rgba(0, 0, 0, 0)",
        }}
        transition={
          direction
            ? (shouldReduceMotion ? { duration: 0 } : { duration: 0.6, ease: "easeOut" })
            : (shouldReduceMotion ? { duration: 0 } : { duration: 0.35, delay: index * 0.02, ease: "easeOut" })
        }
        className={cn(
          "group relative flex flex-col justify-between p-3 border transition-all duration-150 cursor-pointer select-none rounded-xs",
          style.bg,
          style.border,
          isFeatured ? "min-h-[110px] md:min-h-[120px]" : "min-h-[96px]",
          isSelected && "ring-2 ring-accent border-accent shadow-md -translate-y-0.5",
          "hover:-translate-y-0.5 hover:shadow-xs"
        )}
      >
        {/* Top Edge Indicator Stripe: intensifies for ~600ms on change */}
        <motion.div
          animate={{
            opacity: direction ? [1, 1, 0.85] : 0.85,
            filter: direction
              ? ["saturate(2.2) brightness(1.3)", "saturate(2.2) brightness(1.3)", "saturate(1) brightness(1)"]
              : "saturate(1) brightness(1)",
          }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, ease: "easeOut" }}
          className={cn("absolute top-0 left-0 right-0 h-1 transition-all", style.stripe)}
        />

        {/* Header Row: Symbol & Context */}
        <div className="flex justify-between items-start gap-1">
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className={cn(
                "font-mono font-extrabold tracking-tight text-mkt-ink group-hover:text-accent transition-colors leading-tight",
                isFeatured ? "text-sm sm:text-base" : "text-xs"
              )}>
                {item.displayPair}
              </h4>
              {isFeatured && (
                <span
                  title="Core Drawdown Market (Editorial Priority)"
                  className="text-[7px] font-mono uppercase px-1 py-0.2 bg-slate-200/80 text-mkt-i2 rounded-2xs font-bold cursor-help"
                >
                  CORE
                </span>
              )}
            </div>
            <span className="text-[8px] font-mono text-mkt-i4 uppercase tracking-widest block mt-0.5 font-medium">
              {item.category}
            </span>
          </div>

          <div
            className={cn(
              "w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center border rounded-xs text-[10px] shrink-0 bg-white/70",
              item.feed_offline
                ? "border-amber-500/30 text-amber-600"
                : isBullish
                ? "border-emerald-500/30 text-emerald-700"
                : isBearish
                ? "border-red-500/30 text-red-700"
                : "border-mkt-bd text-mkt-i4"
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

        {/* Bottom Row: Price & Dynamic Metric */}
        <div className="mt-2.5 pt-1.5 border-t border-black/5 flex items-baseline justify-between gap-1">
          <div>
            <span className="text-[7px] font-mono uppercase tracking-wider text-mkt-i4 block leading-none mb-0.5">
              Price
            </span>
            <span className={cn(
              "font-mono font-bold text-mkt-ink leading-none block",
              isFeatured ? "text-[12px] sm:text-[13px]" : "text-[11px]"
            )}>
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
                "inline-block font-mono font-extrabold px-1.5 py-0.5 border rounded-xs leading-none",
                isFeatured ? "text-[11px] sm:text-[12px]" : "text-[10px]",
                style.badge
              )}
            >
              {style.label}
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full bg-white border border-mkt-bd shadow-sm">
      {/* ── Heatmap Toolbar & Multi-Metric Selector ────────────────────────── */}
      <div className="px-5 py-4 border-b border-mkt-bd flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xs border border-mkt-bd/80 bg-white flex items-center justify-center text-accent shadow-xs">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-mono font-extrabold uppercase tracking-tight text-mkt-ink">
                Market Heatmap & Matrix
              </h2>
              <span className="text-[9px] font-mono font-bold bg-slate-200/80 text-mkt-i2 px-1.5 py-0.5 rounded-xs">
                {filteredInstruments.length} Assets
              </span>
            </div>
            <p className="text-[10px] font-mono text-mkt-i4">
              Visual intelligence mapping by 24h performance, RSI momentum, structural MSS bias, and movement intensity.
            </p>
          </div>
        </div>

        {/* Controls: Metric Selector + Layout Mode + Category Filter */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Metric Selector Dropdown / Pills */}
          <div className="flex items-center gap-1.5 bg-white border border-mkt-bd p-1 rounded-xs">
            <span className="text-[8px] font-mono uppercase tracking-widest text-mkt-i4 pl-1 font-bold">
              MAP BY:
            </span>
            {([
              { id: "performance" as const, label: "24H %", title: "24-hour percentage price change" },
              { id: "rsi" as const, label: "RSI (14)", title: "Relative Strength Index (14-period, 1-hour candles)" },
              { id: "bias" as const, label: "MSS Bias", title: "Market Structure Shift bias (1-hour candle structure)" },
              { id: "intensity" as const, label: "Intensity", title: "Movement Intensity: Magnitude of the current 24H price move" },
            ]).map((metric) => (
              <button
                key={metric.id}
                onClick={() => setMetricMode(metric.id)}
                title={metric.title}
                className={cn(
                  "px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-wider rounded-xs transition-all",
                  metricMode === metric.id
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-mkt-i3 hover:text-mkt-ink hover:bg-slate-100"
                )}
              >
                {metric.label}
              </button>
            ))}
          </div>

          {/* Layout Mode (Matrix vs Unified Grid) */}
          <div className="flex items-center border border-mkt-bd bg-white rounded-xs p-0.5">
            <button
              onClick={() => setLayoutMode("matrix")}
              className={cn(
                "px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-wider rounded-xs transition-colors",
                layoutMode === "matrix"
                  ? "bg-accent text-white"
                  : "text-mkt-i4 hover:text-mkt-ink"
              )}
              title="Organized by Asset Class Matrix"
            >
              Matrix
            </button>
            <button
              onClick={() => setLayoutMode("grid")}
              className={cn(
                "px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-wider rounded-xs transition-colors",
                layoutMode === "grid"
                  ? "bg-accent text-white"
                  : "text-mkt-i4 hover:text-mkt-ink"
              )}
              title="Flat Cross-Asset Grid"
            >
              All Grid
            </button>
          </div>

          {/* Color Scale Legend */}
          <div className="hidden xl:flex items-center gap-1.5 pl-2 text-[9px] font-mono text-mkt-i4">
            {metricMode === "performance" && (
              <>
                <span>-2%</span>
                <div className="flex h-2.5 w-20 rounded-xs overflow-hidden border border-black/10">
                  <div className="w-1/4 bg-red-600" />
                  <div className="w-1/4 bg-red-400" />
                  <div className="w-1/4 bg-emerald-400" />
                  <div className="w-1/4 bg-emerald-600" />
                </div>
                <span>+2%</span>
              </>
            )}
            {metricMode === "rsi" && (
              <>
                <span>OS &lt;30</span>
                <div className="flex h-2.5 w-20 rounded-xs overflow-hidden border border-black/10">
                  <div className="w-1/3 bg-emerald-500" />
                  <div className="w-1/3 bg-slate-300" />
                  <div className="w-1/3 bg-red-500" />
                </div>
                <span>OB &gt;70</span>
              </>
            )}
            {metricMode === "intensity" && (
              <>
                <span>0%</span>
                <div className="flex h-2.5 w-20 rounded-xs overflow-hidden border border-black/10">
                  <div className="w-1/3 bg-slate-200" />
                  <div className="w-1/3 bg-accent/40" />
                  <div className="w-1/3 bg-accent" />
                </div>
                <span>&gt;2%</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Category Sub-Tabs ──────────────────────────────────────────────── */}
      <div className="px-5 py-2 border-b border-mkt-bd/60 bg-white flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1">
          {[
            { id: "all" as const, label: "All Sectors" },
            { id: "forex" as const, label: "Forex" },
            { id: "commodities" as const, label: "Commodities" },
            { id: "indices" as const, label: "Indices" },
            { id: "crypto" as const, label: "Crypto" },
            { id: "stocks-uk" as const, label: "UK Stocks" },
            { id: "stocks-us" as const, label: "US Stocks" },
          ]
            .filter((tab) => tab.id === "all" || instruments.some((i) => i.category === tab.id))
            .map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCategory(tab.id)}
                className={cn(
                  "px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-wider rounded-xs transition-all",
                  activeCategory === tab.id
                    ? "bg-slate-200/90 text-mkt-ink font-extrabold"
                    : "text-mkt-i4 hover:text-mkt-ink hover:bg-slate-100"
                )}
              >
                {tab.label}
              </button>
            ))}
        </div>

        <span className="text-[9px] font-mono text-mkt-i4">
          Click any tile to open technical profile & TradingView chart
        </span>
      </div>

      {/* ── Main Heatmap / Matrix Body ──────────────────────────────────────── */}
      <div className="relative overflow-hidden p-4 sm:p-5 space-y-6">
        {/* STEP 1: Ambient Scan Sweep (continuous subtle diagonal shimmer, decorative only) */}
        {!shouldReduceMotion && (
          <div
            className="pointer-events-none absolute inset-0 z-[5] overflow-hidden"
            aria-hidden="true"
          >
            <motion.div
              animate={{
                x: ["-100%", "250%"],
              }}
              transition={{
                repeat: Infinity,
                duration: 4,
                ease: "linear",
              }}
              className="w-1/3 h-full absolute inset-y-0 -skew-x-12 bg-gradient-to-r from-transparent via-slate-400/[0.04] to-transparent"
            />
          </div>
        )}

        {filteredInstruments.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-mkt-bd/60 rounded">
            <p className="text-[10px] font-mono text-mkt-i4 uppercase tracking-widest">
              No instruments match current category filter
            </p>
          </div>
        ) : layoutMode === "matrix" && activeCategory === "all" ? (
          // ── MATRIX MODE: Grouped into distinct asset class clusters ─────────
          <div className="space-y-6 relative z-10">
            {categorizedGroups.map((group, groupIdx) => {
              const benchmarkItems = group.items.filter(i => BENCHMARK_SLUGS.has(i.slug));
              const secondaryItems = group.items.filter(i => !BENCHMARK_SLUGS.has(i.slug));

              const validItems = group.items.filter(i => !i.feed_offline && i.changePct !== null);
              const avgChange = validItems.length > 0
                ? validItems.reduce((acc, i) => acc + (i.changePct ?? 0), 0) / validItems.length
                : null;

              const baseIdx = groupIdx * 6;

              return (
                <div key={group.category} className="space-y-2.5 border-b border-mkt-bd/40 pb-5 last:border-b-0 last:pb-0">
                  {/* Category Cluster Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      <h3 className="text-xs font-mono font-extrabold uppercase tracking-wider text-mkt-ink">
                        {group.label}
                      </h3>
                      <span className="text-[8px] font-mono text-mkt-i4 bg-slate-100 px-1.5 py-0.2 rounded-2xs">
                        {group.items.length} assets
                      </span>
                    </div>

                    {avgChange !== null && (
                      <span className={cn(
                        "text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-2xs border",
                        avgChange >= 0
                          ? "text-emerald-800 bg-emerald-50 border-emerald-200"
                          : "text-red-800 bg-red-50 border-red-200"
                      )}>
                        {avgChange >= 0 ? "+" : ""}{avgChange.toFixed(2)}% Avg
                      </span>
                    )}
                  </div>

                  {/* Benchmark & Secondary Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-2.5">
                    {benchmarkItems.map((item, bIdx) => renderTile(item, true, baseIdx + bIdx))}
                    {secondaryItems.map((item, sIdx) => renderTile(item, false, baseIdx + benchmarkItems.length + sIdx))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // ── FLAT GRID MODE: Continuous responsive grid ─────────────────────
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-2.5 relative z-10">
            {filteredInstruments.map((item, idx) => renderTile(item, BENCHMARK_SLUGS.has(item.slug), idx))}
          </div>
        )}
      </div>

      {/* ── Heatmap Footer Strip ───────────────────────────────────────────── */}
      <div className="px-5 py-2.5 border-t border-mkt-bd/60 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3 text-[9px] font-mono text-mkt-i4">
        <div className="flex items-center gap-2">
          <span>Active Metric: <strong className="text-mkt-ink uppercase">{metricMode === "intensity" ? "Movement Intensity" : metricMode}</strong></span>
          <span>·</span>
          <span>Layout: <strong className="text-mkt-ink uppercase">{layoutMode}</strong></span>
        </div>
        <span className="flex items-center gap-1">
          <Zap className="w-2.5 h-2.5 text-accent" />
          Real-time Twelve Data &amp; Yahoo Finance feed · 60s cache
        </span>
      </div>
    </div>
  );
}
