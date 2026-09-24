"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  ArrowUpDown, ArrowUp, ArrowDown, Lock,
  AlertTriangle, TrendingUp, TrendingDown, Minus, ChevronRight, X
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { LineChart, Line } from "recharts";
import { cn } from "@/lib/utils";
import { ScreenerRow, MarketCategory } from "@/lib/screener";
import { TradingViewMiniChart } from "@/components/markets/TradingViewMiniChart";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SortKey = "displayPair" | "price" | "changePct" | "rsi" | "bias";
export type SortDir = "asc" | "desc";

interface ScreenerTableProps {
  instruments: ScreenerRow[];
  initialCategory?: MarketCategory | "all";
  /** Show locked premium columns (Signals, AI Brief) — always true on public screener */
  showLockedColumns?: boolean;
  /** Optional callback when an instrument is clicked */
  onSelectInstrument?: (row: ScreenerRow) => void;
  /** Currently selected instrument slug for row highlight */
  selectedSlug?: string | null;
  /** Backwards compatibility for embedded views */
  viewMode?: "table" | "heatmap";
  onViewModeChange?: (mode: "table" | "heatmap") => void;
  /** Theme mode for dark/light styling */
  theme?: "light" | "dark";
  /** Map of slugs that changed price on the latest poll ('up' | 'down') */
  changedSlugs?: Map<string, "up" | "down">;
  /** Client-side accumulated recent price points (last ~12 per slug) for micro sparklines */
  priceHistory?: Map<string, number[]>;
}

// ─── Micro-visual Sub-components ──────────────────────────────────────────────

export function FeedOfflineBadge({ theme = "light" }: { theme?: "light" | "dark" }) {
  const isDark = theme === "dark";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-1.5 py-0.5 text-[8px] font-mono font-bold uppercase tracking-wider rounded-xs",
        isDark
          ? "border border-amber-500/30 text-amber-400 bg-amber-500/10"
          : "border border-amber-500/40 text-amber-700 bg-amber-50"
      )}
    >
      <AlertTriangle className="w-2.5 h-2.5 text-amber-500" />
      FEED_OFFLINE
    </span>
  );
}

export function BiasBadge({ bias, theme = "light" }: { bias: ScreenerRow["bias"]; theme?: "light" | "dark" }) {
  const isDark = theme === "dark";
  if (bias === "BULLISH") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider rounded-xs",
          isDark
            ? "text-[#18B880] bg-[#18B880]/10 border border-[#18B880]/20"
            : "text-emerald-700 bg-emerald-50 border border-emerald-200"
        )}
      >
        <TrendingUp className={cn("w-3 h-3", isDark ? "text-[#18B880]" : "text-emerald-600")} />
        Bullish MSS
      </span>
    );
  }
  if (bias === "BEARISH") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider rounded-xs",
          isDark
            ? "text-[#CE6969] bg-[#CE6969]/10 border border-[#CE6969]/20"
            : "text-red-700 bg-red-50 border border-red-200"
        )}
      >
        <TrendingDown className={cn("w-3 h-3", isDark ? "text-[#CE6969]" : "text-red-600")} />
        Bearish MSS
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-mono font-medium uppercase tracking-wider rounded-xs",
        isDark
          ? "text-white/60 bg-white/5 border border-white/10"
          : "text-mkt-i4 bg-slate-50 border border-mkt-bd"
      )}
    >
      <Minus className={cn("w-3 h-3", isDark ? "text-white/40" : "text-mkt-i4")} />
      Neutral
    </span>
  );
}

export function RSIBadge({ rsi, theme = "light" }: { rsi: number | null; theme?: "light" | "dark" }) {
  const isDark = theme === "dark";
  if (rsi === null) return <span className={cn("font-mono", isDark ? "text-white/40" : "text-mkt-i4")}>—</span>;
  
  if (rsi < 30) {
    return (
      <span
        className={cn(
          "inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold rounded-xs tabular-nums",
          isDark
            ? "text-[#18B880] bg-[#18B880]/10 border border-[#18B880]/20"
            : "text-emerald-700 bg-emerald-50 border border-emerald-300"
        )}
      >
        {rsi.toFixed(1)} <span className="ml-1 text-[8px] opacity-75 font-normal">OS</span>
      </span>
    );
  }
  if (rsi > 70) {
    return (
      <span
        className={cn(
          "inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold rounded-xs tabular-nums",
          isDark
            ? "text-[#CE6969] bg-[#CE6969]/10 border border-[#CE6969]/20"
            : "text-red-700 bg-red-50 border border-red-300"
        )}
      >
        {rsi.toFixed(1)} <span className="ml-1 text-[8px] opacity-75 font-normal">OB</span>
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-medium rounded-xs tabular-nums",
        isDark
          ? "text-white/70 bg-white/5 border border-white/10"
          : "text-mkt-i2 bg-slate-50 border border-mkt-bd/60"
      )}
    >
      {rsi.toFixed(1)}
    </span>
  );
}

export function ChangeBadge({ changePct, feedOffline, theme = "light" }: { changePct: number | null; feedOffline?: boolean; theme?: "light" | "dark" }) {
  const isDark = theme === "dark";
  if (feedOffline) {
    return <FeedOfflineBadge theme={theme} />;
  }
  if (changePct === null) {
    return <span className={cn("font-mono", isDark ? "text-white/40" : "text-mkt-i4")}>—</span>;
  }
  const isPositive = changePct >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center justify-end px-2 py-0.5 text-[10px] font-mono font-bold border rounded-xs tabular-nums min-w-[62px]",
        isDark
          ? (isPositive ? "text-[#18B880] bg-[#18B880]/10 border-[#18B880]/20" : "text-[#CE6969] bg-[#CE6969]/10 border-[#CE6969]/20")
          : (isPositive ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-red-700 bg-red-50 border-red-200")
      )}
    >
      {isPositive ? "+" : ""}{changePct.toFixed(2)}%
    </span>
  );
}

// ─── STEP 6: Micro Sparkline (desktop rows only, 12 ticks accumulated) ─────────
export function MicroSparkline({ data }: { data?: number[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || !data || data.length < 2) {
    return <div className="w-[60px] h-[20px] inline-block shrink-0" />;
  }

  // Profit/Loss based on net direction over visible window
  const isProfit = data[data.length - 1] >= data[0];
  const stroke = isProfit ? "#18B880" : "#CE6969";
  const chartData = data.map((price, idx) => ({ idx, price }));

  return (
    <div
      className="w-[60px] h-[20px] inline-block shrink-0 overflow-hidden"
      title={`Tick Trend (${data.length} pts: ${isProfit ? "Net Profit" : "Net Loss"})`}
    >
      <LineChart width={60} height={20} data={chartData} margin={{ top: 2, right: 1, bottom: 2, left: 1 }}>
        <Line
          type="monotone"
          dataKey="price"
          stroke={stroke}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </div>
  );
}

function LockedCell({ label, theme = "light" }: { label: string; theme?: "light" | "dark" }) {
  const isDark = theme === "dark";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 text-[9px] font-mono font-medium rounded-xs select-none",
        isDark
          ? "text-white/40 bg-white/5 border border-white/10"
          : "text-mkt-i4/70 bg-slate-100/80 border border-slate-200"
      )}
    >
      <Lock className={cn("w-2.5 h-2.5", isDark ? "text-white/40" : "text-mkt-i4/60")} />
      {label}
    </span>
  );
}

function SortIcon({ col, sort, dir, theme = "light" }: { col: SortKey; sort: SortKey; dir: SortDir; theme?: "light" | "dark" }) {
  const isDark = theme === "dark";
  if (sort !== col) {
    return (
      <ArrowUpDown
        className={cn(
          "w-3 h-3",
          isDark ? "opacity-40 text-white/40" : "opacity-30 text-mkt-i4"
        )}
      />
    );
  }
  return dir === "asc"
    ? <ArrowUp className={cn("w-3 h-3 stroke-[2.5]", isDark ? "text-[#C8F135]" : "text-accent")} />
    : <ArrowDown className={cn("w-3 h-3 stroke-[2.5]", isDark ? "text-[#C8F135]" : "text-accent")} />;
}

// ─── Mini-chart modal ─────────────────────────────────────────────────────────

export function InstrumentModal({
  row,
  onClose,
  theme = "light",
}: {
  row: ScreenerRow;
  onClose: () => void;
  theme?: "light" | "dark";
}) {
  const isDark = theme === "dark";
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className={cn(
          "relative w-full max-w-xl p-6 space-y-5 shadow-2xl rounded-xs",
          isDark
            ? "bg-[#121212] border border-white/10 text-white"
            : "bg-white border border-mkt-bd text-mkt-ink"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={cn("flex justify-between items-start border-b pb-4", isDark ? "border-white/10" : "border-mkt-bd/80")}>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={cn("text-xl font-mono font-extrabold tracking-tight", isDark ? "text-white" : "text-mkt-ink")}>
                {row.displayPair}
              </h3>
              <span
                className={cn(
                  "text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs",
                  isDark
                    ? "bg-white/5 text-white/70 border border-white/10"
                    : "bg-slate-100 text-mkt-i3 border border-slate-200"
                )}
              >
                {row.category}
              </span>
            </div>
            <p className={cn("text-[10px] font-mono mt-1", isDark ? "text-white/40" : "text-mkt-i4")}>
              Symbol: {row.slug} · 60s Cached Feed
            </p>
          </div>
          <button
            onClick={onClose}
            className={cn(
              "transition-colors p-1.5 rounded-xs",
              isDark
                ? "text-white/40 hover:text-white hover:bg-white/10"
                : "text-mkt-i4 hover:text-mkt-ink hover:bg-slate-100"
            )}
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Metrics Bar */}
        <div
          className={cn(
            "grid grid-cols-3 gap-3 p-3 rounded-xs",
            isDark
              ? "bg-white/[0.03] border border-white/10"
              : "bg-slate-50 border border-mkt-bd/60"
          )}
        >
          <div>
            <span className={cn("text-[8px] font-mono uppercase tracking-widest block mb-0.5", isDark ? "text-white/40" : "text-mkt-i4")}>
              Live Price
            </span>
            <span className={cn("text-lg font-mono font-bold tabular-nums", isDark ? "text-white" : "text-mkt-ink")}>
              {row.feed_offline
                ? "—"
                : row.price !== null
                ? row.price >= 1000
                  ? row.price.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : row.price >= 10
                  ? row.price.toFixed(3)
                  : row.price.toFixed(5)
                : "—"}
            </span>
          </div>

          <div>
            <span className={cn("text-[8px] font-mono uppercase tracking-widest block mb-0.5", isDark ? "text-white/40" : "text-mkt-i4")}>
              24h Change
            </span>
            <ChangeBadge changePct={row.changePct} feedOffline={row.feed_offline} theme={theme} />
          </div>

          <div>
            <span className={cn("text-[8px] font-mono uppercase tracking-widest block mb-0.5", isDark ? "text-white/40" : "text-mkt-i4")}>
              Structure & RSI
            </span>
            <div className="flex items-center gap-1.5">
              <RSIBadge rsi={row.rsi} theme={theme} />
            </div>
          </div>
        </div>

        {/* Mini-chart */}
        <div className={cn("h-60 rounded-xs overflow-hidden", isDark ? "border border-white/10 bg-black" : "border border-mkt-bd bg-slate-50")}>
          <TradingViewMiniChart
            symbol={row.slug}
            largeChartUrl={`/dashboard/tools/technical-scanner?symbol=${row.slug}`}
            className="w-full h-full"
          />
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <span className={cn("text-[9px] font-mono", isDark ? "text-white/40" : "text-mkt-i4")}>
            MSS Bias: <span className={cn("font-bold", isDark ? "text-white" : "text-mkt-ink")}>{row.bias}</span>
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className={cn(
                "flex-1 sm:flex-initial px-4 py-2.5 text-[9px] font-mono uppercase tracking-widest border transition-colors rounded-xs",
                isDark
                  ? "border-white/10 text-white/60 hover:border-white/30 hover:text-white"
                  : "border-mkt-bd text-mkt-i4 hover:border-slate-400 hover:text-mkt-ink"
              )}
            >
              Close
            </button>
            <Link
              href={`/dashboard/tools/technical-scanner?symbol=${row.slug}`}
              className={cn(
                "flex-1 sm:flex-initial px-5 py-2.5 text-[9px] font-mono font-bold uppercase tracking-widest rounded-xs flex items-center justify-center gap-1.5 shadow-sm transition-all",
                isDark
                  ? "bg-[#C8F135] text-black hover:bg-[#b5db2e]"
                  : "bg-slate-900 text-white hover:bg-accent hover:text-black"
              )}
            >
              Open Technical Scanner <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ScreenerTable({
  instruments,
  initialCategory,
  showLockedColumns = true,
  onSelectInstrument,
  selectedSlug,
  theme = "light",
  changedSlugs,
  priceHistory,
}: ScreenerTableProps) {
  const shouldReduceMotion = useReducedMotion();
  const [sort, setSort] = useState<SortKey>("changePct");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [internalModalRow, setInternalModalRow] = useState<ScreenerRow | null>(null);

  const handleSort = useCallback((col: SortKey) => {
    setSort((prev) => {
      if (prev === col) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortDir(col === "displayPair" ? "asc" : "desc");
      }
      return col;
    });
  }, []);

  const handleRowClick = (row: ScreenerRow) => {
    if (onSelectInstrument) {
      onSelectInstrument(row);
    } else {
      setInternalModalRow(row);
    }
  };

  const baseRows = useMemo(() => {
    if (initialCategory && initialCategory !== "all") {
      return instruments.filter((i) => i.category === initialCategory);
    }
    return instruments;
  }, [instruments, initialCategory]);

  const sortedRows = useMemo(() => {
    return [...baseRows].sort((a, b) => {
      let valA: any = a[sort];
      let valB: any = b[sort];

      if (sort === "displayPair") {
        valA = a.displayPair;
        valB = b.displayPair;
        return sortDir === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      valA = valA ?? -Infinity;
      valB = valB ?? -Infinity;

      if (valA === valB) return 0;
      if (sortDir === "asc") return valA < valB ? -1 : 1;
      return valA > valB ? -1 : 1;
    });
  }, [instruments, sort, sortDir]);

  const isDark = theme === "dark";

  return (
    <div className={cn("w-full shadow-sm", isDark ? "bg-[#0E0E0E] border border-white/10 rounded-lg overflow-hidden" : "bg-white border border-mkt-bd")}>
      {/* ── Table (desktop) ─────────────────────────────────────────────────── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse text-[10px] font-mono">
          <thead>
            <tr className={cn("border-b sticky top-0 z-10 backdrop-blur-xs", isDark ? "border-white/10 bg-white/[0.03]" : "border-mkt-bd bg-slate-50/90")}>
              {/* Symbol */}
              <th className={cn("text-left py-3.5 px-4 font-bold uppercase tracking-wider w-[22%]", isDark ? "text-white/60" : "text-mkt-i3")}>
                <button
                  onClick={() => handleSort("displayPair")}
                  className={cn("flex items-center gap-1.5 transition-colors", isDark ? "hover:text-white" : "hover:text-mkt-ink")}
                >
                  Symbol / Asset
                  <SortIcon col="displayPair" sort={sort} dir={sortDir} theme={theme} />
                </button>
              </th>

              {/* Price (Right-aligned) */}
              <th className={cn("text-right py-3.5 px-4 font-bold uppercase tracking-wider w-[15%]", isDark ? "text-white/60" : "text-mkt-i3")}>
                <button
                  onClick={() => handleSort("price")}
                  className={cn("inline-flex items-center gap-1.5 transition-colors ml-auto", isDark ? "hover:text-white" : "hover:text-mkt-ink")}
                >
                  Last Price
                  <SortIcon col="price" sort={sort} dir={sortDir} theme={theme} />
                </button>
              </th>

              {/* 24h % (Right-aligned) */}
              <th className={cn("text-right py-3.5 px-4 font-bold uppercase tracking-wider w-[14%]", isDark ? "text-white/60" : "text-mkt-i3")}>
                <button
                  onClick={() => handleSort("changePct")}
                  className={cn("inline-flex items-center gap-1.5 transition-colors ml-auto", isDark ? "hover:text-white" : "hover:text-mkt-ink")}
                >
                  24h Change
                  <SortIcon col="changePct" sort={sort} dir={sortDir} theme={theme} />
                </button>
              </th>

              {/* RSI (Right-aligned) */}
              <th className={cn("text-right py-3.5 px-4 font-bold uppercase tracking-wider w-[13%]", isDark ? "text-white/60" : "text-mkt-i3")}>
                <button
                  onClick={() => handleSort("rsi")}
                  className={cn("inline-flex items-center gap-1.5 transition-colors ml-auto", isDark ? "hover:text-white" : "hover:text-mkt-ink")}
                >
                  RSI (14)
                  <SortIcon col="rsi" sort={sort} dir={sortDir} theme={theme} />
                </button>
              </th>

              {/* Bias */}
              <th className={cn("text-left py-3.5 px-4 font-bold uppercase tracking-wider w-[16%]", isDark ? "text-white/60" : "text-mkt-i3")}>
                <button
                  onClick={() => handleSort("bias")}
                  className={cn("flex items-center gap-1.5 transition-colors", isDark ? "hover:text-white" : "hover:text-mkt-ink")}
                >
                  1H Structure
                  <SortIcon col="bias" sort={sort} dir={sortDir} theme={theme} />
                </button>
              </th>

              {/* Locked columns */}
              {showLockedColumns && (
                <>
                  <th className={cn("text-left py-3.5 px-4 font-bold uppercase tracking-wider select-none w-[10%]", isDark ? "text-white/30" : "text-mkt-i4/50")}>
                    Signals
                  </th>
                  <th className={cn("text-left py-3.5 px-4 font-bold uppercase tracking-wider select-none w-[10%]", isDark ? "text-white/30" : "text-mkt-i4/50")}>
                    AI Brief
                  </th>
                </>
              )}

              {/* Row Action */}
              <th className="py-3.5 px-4 w-[4%]" />
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row) => {
              const isSelected = selectedSlug === row.slug;
              const direction = changedSlugs?.get(row.slug);
              const isProfit = direction === "up";
              const isLoss = direction === "down";
              const flashBg = isProfit
                ? (isDark ? "rgba(24, 184, 128, 0.18)" : "#F0FDF8")
                : isLoss
                ? (isDark ? "rgba(206, 105, 105, 0.18)" : "#FDF2F2")
                : "rgba(0, 0, 0, 0)";
              const yOffset = shouldReduceMotion ? 0 : direction === "down" ? -4 : 4;

              return (
                <motion.tr
                  key={row.slug}
                  animate={{
                    backgroundColor: direction ? [flashBg, "rgba(0, 0, 0, 0)"] : "rgba(0, 0, 0, 0)",
                  }}
                  transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.9, ease: "easeOut" }}
                  className={cn(
                    "cursor-pointer transition-colors group",
                    isDark
                      ? cn("border-b border-white/5", isSelected ? "bg-[#C8F135]/10" : "hover:bg-white/[0.04]")
                      : cn("border-b border-mkt-bd/40", isSelected ? "bg-accent/10" : "hover:bg-slate-50/90")
                  )}
                  onClick={() => handleRowClick(row)}
                >
                  {/* Symbol */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div>
                        <p className={cn("font-extrabold text-[11px] transition-colors leading-tight", isDark ? "text-white group-hover:text-[#C8F135]" : "text-mkt-ink group-hover:text-accent")}>
                          {row.displayPair}
                        </p>
                        <p className={cn("text-[8px] uppercase tracking-widest mt-0.5", isDark ? "text-white/40" : "text-mkt-i4")}>
                          {row.category}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Price (Right-aligned, tabular figures) with Micro Sparkline */}
                  <td className="py-3.5 px-4 text-right">
                    {row.feed_offline ? (
                      <FeedOfflineBadge theme={theme} />
                    ) : row.price !== null ? (
                      <div className="inline-flex items-center justify-end gap-2">
                        {/* STEP 6: Micro sparkline (desktop rows only) */}
                        <MicroSparkline data={priceHistory?.get(row.slug)} />
                        {/* STEP 3: Framer Motion AnimatePresence key-swap price */}
                        <div className="relative inline-flex items-center justify-end overflow-hidden">
                          <AnimatePresence mode="popLayout" initial={false}>
                            <motion.span
                              key={`${row.slug}-p-${row.price}`}
                              initial={shouldReduceMotion ? false : { opacity: 0, y: yOffset }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -yOffset }}
                              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.25, ease: "easeOut" }}
                              className={cn("font-bold font-mono tabular-nums text-[11px] inline-block", isDark ? "text-white" : "text-mkt-ink")}
                            >
                              {row.price >= 1000
                                ? row.price.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                : row.price >= 10
                                ? row.price.toFixed(3)
                                : row.price.toFixed(5)}
                            </motion.span>
                          </AnimatePresence>
                        </div>
                      </div>
                    ) : (
                      <span className={cn("font-mono", isDark ? "text-white/40" : "text-mkt-i4")}>—</span>
                    )}
                  </td>

                  {/* 24h % (Right-aligned) with AnimatePresence key-swap */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="relative inline-flex items-center justify-end overflow-hidden">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.div
                          key={`${row.slug}-c-${row.changePct}`}
                          initial={shouldReduceMotion ? false : { opacity: 0, y: yOffset }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={shouldReduceMotion ? undefined : { opacity: 0, y: -yOffset }}
                          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.25, ease: "easeOut" }}
                        >
                          <ChangeBadge changePct={row.changePct} feedOffline={row.feed_offline} theme={theme} />
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </td>

                  {/* RSI (Right-aligned) */}
                  <td className="py-3.5 px-4 text-right">
                    <RSIBadge rsi={row.rsi} theme={theme} />
                  </td>

                  {/* Bias */}
                  <td className="py-3.5 px-4">
                    <BiasBadge bias={row.bias} theme={theme} />
                  </td>

                  {/* Locked columns */}
                  {showLockedColumns && (
                    <>
                      <td className="py-3.5 px-4 opacity-50 select-none">
                        <LockedCell label="3/5 TF" theme={theme} />
                      </td>
                      <td className="py-3.5 px-4 opacity-50 select-none">
                        <LockedCell label="Brief" theme={theme} />
                      </td>
                    </>
                  )}

                  {/* CTA */}
                  <td className="py-3.5 px-4 text-right">
                    <ChevronRight className={cn("w-3.5 h-3.5 group-hover:translate-x-0.5 transition-all inline-block", isDark ? "text-white/30 group-hover:text-[#C8F135]" : "text-mkt-i4 group-hover:text-accent")} />
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>

        {sortedRows.length === 0 && (
          <div className={cn("py-16 text-center border-b", isDark ? "border-white/10" : "border-mkt-bd")}>
            <p className={cn("text-[10px] font-mono uppercase tracking-widest", isDark ? "text-white/40" : "text-mkt-i4")}>
              No instruments match the active filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Mobile: stacked cards (< 768px) */}
      <div className={cn("md:hidden", isDark ? "divide-y divide-white/5" : "divide-y divide-mkt-bd/60")}>
        {sortedRows.map((row) => {
          const direction = changedSlugs?.get(row.slug);
          const isProfit = direction === "up";
          const isLoss = direction === "down";
          const flashBg = isProfit
            ? (isDark ? "rgba(24, 184, 128, 0.18)" : "#F0FDF8")
            : isLoss
            ? (isDark ? "rgba(206, 105, 105, 0.18)" : "#FDF2F2")
            : "rgba(0, 0, 0, 0)";
          const yOffset = shouldReduceMotion ? 0 : direction === "down" ? -4 : 4;

          return (
            <motion.div
              key={row.slug}
              animate={{
                backgroundColor: direction ? [flashBg, "rgba(0, 0, 0, 0)"] : "rgba(0, 0, 0, 0)",
              }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.9, ease: "easeOut" }}
              className={cn("p-4 cursor-pointer transition-colors group", isDark ? "hover:bg-white/[0.04]" : "hover:bg-slate-50")}
              onClick={() => handleRowClick(row)}
            >
              <div className="flex justify-between items-start mb-2.5">
                <div>
                  <p className={cn("font-extrabold font-mono text-[13px] transition-colors leading-tight", isDark ? "text-white group-hover:text-[#C8F135]" : "text-mkt-ink group-hover:text-accent")}>
                    {row.displayPair}
                  </p>
                  <p className={cn("text-[8px] font-mono uppercase tracking-wider mt-0.5", isDark ? "text-white/40" : "text-mkt-i4")}>
                    {row.category}
                  </p>
                </div>
                <div className="relative inline-flex items-center justify-end overflow-hidden">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={`${row.slug}-mc-${row.changePct}`}
                      initial={shouldReduceMotion ? false : { opacity: 0, y: yOffset }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={shouldReduceMotion ? undefined : { opacity: 0, y: -yOffset }}
                      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.25, ease: "easeOut" }}
                    >
                      <ChangeBadge changePct={row.changePct} feedOffline={row.feed_offline} theme={theme} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex justify-between items-center pt-1">
                <div>
                  <span className={cn("text-[8px] font-mono uppercase tracking-wider block", isDark ? "text-white/40" : "text-mkt-i4")}>
                    Price
                  </span>
                  <div className="relative inline-flex items-center overflow-hidden">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={`${row.slug}-mp-${row.price}`}
                        initial={shouldReduceMotion ? false : { opacity: 0, y: yOffset }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={shouldReduceMotion ? undefined : { opacity: 0, y: -yOffset }}
                        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.25, ease: "easeOut" }}
                        className={cn("text-sm font-mono font-bold tabular-nums inline-block", isDark ? "text-white" : "text-mkt-ink")}
                      >
                        {row.feed_offline
                          ? "—"
                          : row.price !== null
                          ? row.price >= 1000
                            ? row.price.toLocaleString("en-GB", { minimumFractionDigits: 1, maximumFractionDigits: 2 })
                            : row.price.toFixed(4)
                          : "—"}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <RSIBadge rsi={row.rsi} theme={theme} />
                  <BiasBadge bias={row.bias} theme={theme} />
                </div>
              </div>
            </motion.div>
          );
        })}

        {sortedRows.length === 0 && (
          <div className="py-12 text-center">
            <p className={cn("text-[10px] font-mono uppercase tracking-widest", isDark ? "text-white/40" : "text-mkt-i4")}>
              No instruments match the active filter criteria
            </p>
          </div>
        )}
      </div>

      {/* ── Table Footer ──────────────────────────────────────────────────────── */}
      <div className={cn(
        "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-5 py-3 border-t text-[9px] font-mono",
        isDark ? "border-white/10 bg-white/[0.02] text-white/40" : "border-mkt-bd/60 bg-slate-50/50 text-mkt-i4"
      )}>
        <span>
          Showing {sortedRows.length} active instruments · Tabular precision alignment
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Click any row to view live chart modal & scanner confluence
        </span>
      </div>

      {/* ── Internal Modal (if onSelectInstrument not supplied) ──────────────── */}
      {internalModalRow && (
        <InstrumentModal
          row={internalModalRow}
          onClose={() => setInternalModalRow(null)}
          theme={theme}
        />
      )}
    </div>
  );
}
