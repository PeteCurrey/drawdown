"use client";

import { useMemo } from "react";
import { MarketCategory } from "@/lib/screener";
import { cn } from "@/lib/utils";
import { Search, Filter, RotateCcw, Sparkles, TrendingUp, TrendingDown, Zap, SlidersHorizontal } from "lucide-react";

export type PerformanceFilter = "all" | "gainers" | "decliners" | "big_movers";
export type RSIFilter = "all" | "oversold" | "neutral" | "overbought";
export type BiasFilter = "all" | "BULLISH" | "BEARISH";

export interface FilterState {
  search: string;
  category: MarketCategory | "all";
  performance: PerformanceFilter;
  rsi: RSIFilter;
  bias: BiasFilter;
  preset: string | null;
}

interface ScreenerFilterWorkstationProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  totalCount: number;
  matchedCount: number;
}

export function ScreenerFilterWorkstation({
  filters,
  onFilterChange,
  totalCount,
  matchedCount,
}: ScreenerFilterWorkstationProps) {
  const isFiltered = useMemo(() => {
    return (
      filters.search.trim() !== "" ||
      filters.category !== "all" ||
      filters.performance !== "all" ||
      filters.rsi !== "all" ||
      filters.bias !== "all" ||
      filters.preset !== null
    );
  }, [filters]);

  const handleReset = () => {
    onFilterChange({
      search: "",
      category: "all",
      performance: "all",
      rsi: "all",
      bias: "all",
      preset: null,
    });
  };

  const applyPreset = (presetKey: string) => {
    switch (presetKey) {
      case "all":
        handleReset();
        break;
      case "top_movers":
        onFilterChange({
          search: "",
          category: "all",
          performance: "big_movers",
          rsi: "all",
          bias: "all",
          preset: "top_movers",
        });
        break;
      case "momentum":
        onFilterChange({
          search: "",
          category: "all",
          performance: "gainers",
          rsi: "neutral",
          bias: "BULLISH",
          preset: "momentum",
        });
        break;
      case "oversold":
        onFilterChange({
          search: "",
          category: "all",
          performance: "all",
          rsi: "oversold",
          bias: "all",
          preset: "oversold",
        });
        break;
      case "overbought":
        onFilterChange({
          search: "",
          category: "all",
          performance: "all",
          rsi: "overbought",
          bias: "all",
          preset: "overbought",
        });
        break;
      case "breakouts":
        onFilterChange({
          search: "",
          category: "all",
          performance: "gainers",
          rsi: "all",
          bias: "BULLISH",
          preset: "breakouts",
        });
        break;
      case "new_highs":
        onFilterChange({
          search: "",
          category: "all",
          performance: "gainers",
          rsi: "all",
          bias: "all",
          preset: "new_highs",
        });
        break;
      case "new_lows":
        onFilterChange({
          search: "",
          category: "all",
          performance: "decliners",
          rsi: "all",
          bias: "all",
          preset: "new_lows",
        });
        break;
      default:
        break;
    }
  };

  const presets = [
    { key: "all", label: "All Markets" },
    { key: "top_movers", label: "Top Movers (≥1.5%)", icon: TrendingUp },
    { key: "momentum", label: "Strong Momentum", icon: Zap },
    { key: "oversold", label: "Oversold (RSI <30)" },
    { key: "overbought", label: "Overbought (RSI >70)" },
    { key: "breakouts", label: "Bullish MSS Breakouts", icon: Sparkles },
    { key: "new_highs", label: "Gainers Only" },
    { key: "new_lows", label: "Decliners Only" },
  ];

  return (
    <div className="w-full bg-white border border-mkt-bd shadow-sm">
      {/* Quick Screens Preset Strip */}
      <div className="px-5 py-3 border-b border-mkt-bd/80 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-mkt-ink shrink-0">
          <Zap className="w-3.5 h-3.5 text-accent" />
          Quick Screens:
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {presets.map((p) => {
            const isActive = (p.key === "all" && !filters.preset && !isFiltered) || filters.preset === p.key;
            return (
              <button
                key={p.key}
                onClick={() => applyPreset(p.key)}
                className={cn(
                  "px-3 py-1.5 text-[9px] font-mono font-bold uppercase tracking-wider whitespace-nowrap transition-all border rounded-xs flex items-center gap-1",
                  isActive
                    ? "bg-mkt-ink text-white border-mkt-ink shadow-xs"
                    : "bg-white text-mkt-i3 border-mkt-bd hover:border-slate-400 hover:text-mkt-ink"
                )}
              >
                {p.icon && <p.icon className="w-2.5 h-2.5" />}
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Controls Workstation Bar */}
      <div className="p-4 sm:p-5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Left: Input & Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-mkt-i4" />
            <input
              type="text"
              placeholder="Search pair or symbol…"
              value={filters.search}
              onChange={(e) =>
                onFilterChange({ ...filters, search: e.target.value, preset: null })
              }
              className="w-full bg-slate-50/60 border border-mkt-bd py-2 pl-9 pr-3 text-[10px] font-mono uppercase tracking-widest outline-none focus:border-accent focus:bg-white transition-colors rounded-xs"
            />
          </div>

          {/* Asset Category */}
          <div className="w-full sm:w-auto">
            <select
              value={filters.category}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  category: e.target.value as MarketCategory | "all",
                  preset: null,
                })
              }
              className="w-full bg-white border border-mkt-bd py-2 px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-mkt-i2 outline-none focus:border-accent rounded-xs cursor-pointer hover:border-slate-400"
            >
              <option value="all">Asset: All Classes</option>
              <option value="forex">Asset: Forex (14)</option>
              <option value="commodities">Asset: Commodities (4)</option>
              <option value="indices">Asset: Indices (6)</option>
              <option value="crypto">Asset: Crypto (8)</option>
            </select>
          </div>

          {/* Performance Band */}
          <div className="w-full sm:w-auto">
            <select
              value={filters.performance}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  performance: e.target.value as PerformanceFilter,
                  preset: null,
                })
              }
              className="w-full bg-white border border-mkt-bd py-2 px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-mkt-i2 outline-none focus:border-accent rounded-xs cursor-pointer hover:border-slate-400"
            >
              <option value="all">Performance: All</option>
              <option value="gainers">Performance: Gainers (&gt;0%)</option>
              <option value="decliners">Performance: Decliners (&lt;0%)</option>
              <option value="big_movers">Performance: Volatile (≥1.5%)</option>
            </select>
          </div>

          {/* RSI Momentum Band */}
          <div className="w-full sm:w-auto">
            <select
              value={filters.rsi}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  rsi: e.target.value as RSIFilter,
                  preset: null,
                })
              }
              className="w-full bg-white border border-mkt-bd py-2 px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-mkt-i2 outline-none focus:border-accent rounded-xs cursor-pointer hover:border-slate-400"
            >
              <option value="all">Technical: All RSI</option>
              <option value="oversold">Technical: Oversold (&lt;30)</option>
              <option value="neutral">Technical: Neutral (30–70)</option>
              <option value="overbought">Technical: Overbought (&gt;70)</option>
            </select>
          </div>

          {/* MSS Bias */}
          <div className="w-full sm:w-auto">
            <select
              value={filters.bias}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  bias: e.target.value as BiasFilter,
                  preset: null,
                })
              }
              className="w-full bg-white border border-mkt-bd py-2 px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-mkt-i2 outline-none focus:border-accent rounded-xs cursor-pointer hover:border-slate-400"
            >
              <option value="all">Structure: All Bias</option>
              <option value="BULLISH">Structure: Bullish MSS</option>
              <option value="BEARISH">Structure: Bearish MSS</option>
            </select>
          </div>
        </div>

        {/* Right: Active Count & Reset */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-mkt-bd/60 shrink-0">
          <div className="text-[10px] font-mono font-bold text-mkt-i3">
            Showing <span className="text-mkt-ink">{matchedCount}</span> of {totalCount}
          </div>

          {isFiltered && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-mono font-bold uppercase tracking-wider text-red-700 hover:text-white hover:bg-red-600 border border-red-200 transition-colors rounded-xs"
              title="Reset all filters"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
