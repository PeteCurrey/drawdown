"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  ArrowUpDown, ArrowUp, ArrowDown, Lock,
  AlertTriangle, TrendingUp, TrendingDown, Minus, ChevronRight, X
} from "lucide-react";
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
}

// ─── Micro-visual Sub-components ──────────────────────────────────────────────

export function FeedOfflineBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[8px] font-mono font-bold uppercase tracking-wider border border-amber-500/40 text-amber-700 bg-amber-50 rounded-xs">
      <AlertTriangle className="w-2.5 h-2.5 text-amber-500" />
      FEED_OFFLINE
    </span>
  );
}

export function BiasBadge({ bias }: { bias: ScreenerRow["bias"] }) {
  if (bias === "BULLISH") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider rounded-xs text-emerald-700 bg-emerald-50 border border-emerald-200">
        <TrendingUp className="w-3 h-3 text-emerald-600" />
        Bullish MSS
      </span>
    );
  }
  if (bias === "BEARISH") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider rounded-xs text-red-700 bg-red-50 border border-red-200">
        <TrendingDown className="w-3 h-3 text-red-600" />
        Bearish MSS
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-mono font-medium uppercase tracking-wider rounded-xs text-mkt-i4 bg-slate-50 border border-mkt-bd">
      <Minus className="w-3 h-3 text-mkt-i4" />
      Neutral
    </span>
  );
}

export function RSIBadge({ rsi }: { rsi: number | null }) {
  if (rsi === null) return <span className="text-mkt-i4 font-mono">—</span>;
  
  if (rsi < 30) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold rounded-xs text-emerald-700 bg-emerald-50 border border-emerald-300 tabular-nums">
        {rsi.toFixed(1)} <span className="ml-1 text-[8px] opacity-75 font-normal">OS</span>
      </span>
    );
  }
  if (rsi > 70) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold rounded-xs text-red-700 bg-red-50 border border-red-300 tabular-nums">
        {rsi.toFixed(1)} <span className="ml-1 text-[8px] opacity-75 font-normal">OB</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-medium rounded-xs text-mkt-i2 bg-slate-50 border border-mkt-bd/60 tabular-nums">
      {rsi.toFixed(1)}
    </span>
  );
}

export function ChangeBadge({ changePct, feedOffline }: { changePct: number | null; feedOffline?: boolean }) {
  if (feedOffline) {
    return <FeedOfflineBadge />;
  }
  if (changePct === null) {
    return <span className="text-mkt-i4 font-mono">—</span>;
  }
  const isPositive = changePct >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center justify-end px-2 py-0.5 text-[10px] font-mono font-bold border rounded-xs tabular-nums min-w-[62px]",
        isPositive
          ? "text-emerald-700 bg-emerald-50 border-emerald-200"
          : "text-red-700 bg-red-50 border-red-200"
      )}
    >
      {isPositive ? "+" : ""}{changePct.toFixed(2)}%
    </span>
  );
}

function LockedCell({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[9px] font-mono font-medium text-mkt-i4/70 bg-slate-100/80 border border-slate-200 rounded-xs select-none">
      <Lock className="w-2.5 h-2.5 text-mkt-i4/60" />
      {label}
    </span>
  );
}

function SortIcon({ col, sort, dir }: { col: SortKey; sort: SortKey; dir: SortDir }) {
  if (sort !== col) return <ArrowUpDown className="w-3 h-3 opacity-30 text-mkt-i4" />;
  return dir === "asc"
    ? <ArrowUp className="w-3 h-3 text-accent stroke-[2.5]" />
    : <ArrowDown className="w-3 h-3 text-accent stroke-[2.5]" />;
}

// ─── Mini-chart modal ─────────────────────────────────────────────────────────

export function InstrumentModal({
  row,
  onClose,
}: {
  row: ScreenerRow;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white border border-mkt-bd p-6 space-y-5 shadow-2xl rounded-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start border-b border-mkt-bd/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-mono font-extrabold text-mkt-ink tracking-tight">
                {row.displayPair}
              </h3>
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-mkt-i3 border border-slate-200 rounded-xs">
                {row.category}
              </span>
            </div>
            <p className="text-[10px] font-mono text-mkt-i4 mt-1">
              Symbol: {row.slug} · 60s Cached Feed
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-mkt-i4 hover:text-mkt-ink transition-colors p-1.5 hover:bg-slate-100 rounded-xs"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 border border-mkt-bd/60 rounded-xs">
          <div>
            <span className="text-[8px] font-mono uppercase tracking-widest text-mkt-i4 block mb-0.5">
              Live Price
            </span>
            <span className="text-lg font-mono font-bold text-mkt-ink tabular-nums">
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
            <span className="text-[8px] font-mono uppercase tracking-widest text-mkt-i4 block mb-0.5">
              24h Change
            </span>
            <ChangeBadge changePct={row.changePct} feedOffline={row.feed_offline} />
          </div>

          <div>
            <span className="text-[8px] font-mono uppercase tracking-widest text-mkt-i4 block mb-0.5">
              Structure & RSI
            </span>
            <div className="flex items-center gap-1.5">
              <RSIBadge rsi={row.rsi} />
            </div>
          </div>
        </div>

        {/* Mini-chart */}
        <div className="h-60 border border-mkt-bd bg-slate-50 rounded-xs overflow-hidden">
          <TradingViewMiniChart
            symbol={row.slug}
            largeChartUrl={`/dashboard/tools/technical-scanner?symbol=${row.slug}`}
            className="w-full h-full"
          />
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <span className="text-[9px] font-mono text-mkt-i4">
            MSS Bias: <span className="font-bold text-mkt-ink">{row.bias}</span>
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 text-[9px] font-mono uppercase tracking-widest border border-mkt-bd text-mkt-i4 hover:border-slate-400 hover:text-mkt-ink transition-colors rounded-xs"
            >
              Close
            </button>
            <Link
              href={`/dashboard/tools/technical-scanner?symbol=${row.slug}`}
              className="flex-1 sm:flex-initial px-5 py-2.5 text-[9px] font-mono font-bold uppercase tracking-widest bg-mkt-ink text-white hover:bg-accent hover:text-black transition-colors rounded-xs flex items-center justify-center gap-1.5 shadow-sm"
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
}: ScreenerTableProps) {
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

  return (
    <div className="w-full bg-white border border-mkt-bd shadow-sm">
      {/* ── Table (desktop) ─────────────────────────────────────────────────── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse text-[10px] font-mono">
          <thead>
            <tr className="border-b border-mkt-bd bg-slate-50/90 sticky top-0 z-10 backdrop-blur-xs">
              {/* Symbol */}
              <th className="text-left py-3.5 px-4 font-bold uppercase tracking-wider text-mkt-i3 w-[22%]">
                <button
                  onClick={() => handleSort("displayPair")}
                  className="flex items-center gap-1.5 hover:text-mkt-ink transition-colors"
                >
                  Symbol / Asset
                  <SortIcon col="displayPair" sort={sort} dir={sortDir} />
                </button>
              </th>

              {/* Price (Right-aligned) */}
              <th className="text-right py-3.5 px-4 font-bold uppercase tracking-wider text-mkt-i3 w-[15%]">
                <button
                  onClick={() => handleSort("price")}
                  className="inline-flex items-center gap-1.5 hover:text-mkt-ink transition-colors ml-auto"
                >
                  Last Price
                  <SortIcon col="price" sort={sort} dir={sortDir} />
                </button>
              </th>

              {/* 24h % (Right-aligned) */}
              <th className="text-right py-3.5 px-4 font-bold uppercase tracking-wider text-mkt-i3 w-[14%]">
                <button
                  onClick={() => handleSort("changePct")}
                  className="inline-flex items-center gap-1.5 hover:text-mkt-ink transition-colors ml-auto"
                >
                  24h Change
                  <SortIcon col="changePct" sort={sort} dir={sortDir} />
                </button>
              </th>

              {/* RSI (Right-aligned) */}
              <th className="text-right py-3.5 px-4 font-bold uppercase tracking-wider text-mkt-i3 w-[13%]">
                <button
                  onClick={() => handleSort("rsi")}
                  className="inline-flex items-center gap-1.5 hover:text-mkt-ink transition-colors ml-auto"
                >
                  RSI (14)
                  <SortIcon col="rsi" sort={sort} dir={sortDir} />
                </button>
              </th>

              {/* Bias */}
              <th className="text-left py-3.5 px-4 font-bold uppercase tracking-wider text-mkt-i3 w-[16%]">
                <button
                  onClick={() => handleSort("bias")}
                  className="flex items-center gap-1.5 hover:text-mkt-ink transition-colors"
                >
                  1H Structure
                  <SortIcon col="bias" sort={sort} dir={sortDir} />
                </button>
              </th>

              {/* Locked columns */}
              {showLockedColumns && (
                <>
                  <th className="text-left py-3.5 px-4 font-bold uppercase tracking-wider text-mkt-i4/50 select-none w-[10%]">
                    Signals
                  </th>
                  <th className="text-left py-3.5 px-4 font-bold uppercase tracking-wider text-mkt-i4/50 select-none w-[10%]">
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
              return (
                <tr
                  key={row.slug}
                  className={cn(
                    "border-b border-mkt-bd/40 cursor-pointer transition-colors group",
                    isSelected ? "bg-accent/10" : "hover:bg-slate-50/90"
                  )}
                  onClick={() => handleRowClick(row)}
                >
                  {/* Symbol */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="font-extrabold text-mkt-ink text-[11px] group-hover:text-accent transition-colors leading-tight">
                          {row.displayPair}
                        </p>
                        <p className="text-[8px] text-mkt-i4 uppercase tracking-widest mt-0.5">
                          {row.category}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Price (Right-aligned, tabular figures) */}
                  <td className="py-3.5 px-4 text-right">
                    {row.feed_offline ? (
                      <FeedOfflineBadge />
                    ) : row.price !== null ? (
                      <span className="font-bold font-mono tabular-nums text-mkt-ink text-[11px]">
                        {row.price >= 1000
                          ? row.price.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                          : row.price >= 10
                          ? row.price.toFixed(3)
                          : row.price.toFixed(5)}
                      </span>
                    ) : (
                      <span className="text-mkt-i4 font-mono">—</span>
                    )}
                  </td>

                  {/* 24h % (Right-aligned) */}
                  <td className="py-3.5 px-4 text-right">
                    <ChangeBadge changePct={row.changePct} feedOffline={row.feed_offline} />
                  </td>

                  {/* RSI (Right-aligned) */}
                  <td className="py-3.5 px-4 text-right">
                    <RSIBadge rsi={row.rsi} />
                  </td>

                  {/* Bias */}
                  <td className="py-3.5 px-4">
                    <BiasBadge bias={row.bias} />
                  </td>

                  {/* Locked columns */}
                  {showLockedColumns && (
                    <>
                      <td className="py-3.5 px-4 opacity-50 select-none">
                        <LockedCell label="3/5 TF" />
                      </td>
                      <td className="py-3.5 px-4 opacity-50 select-none">
                        <LockedCell label="Brief" />
                      </td>
                    </>
                  )}

                  {/* CTA */}
                  <td className="py-3.5 px-4 text-right">
                    <ChevronRight className="w-3.5 h-3.5 text-mkt-i4 group-hover:text-accent group-hover:translate-x-0.5 transition-all inline-block" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {sortedRows.length === 0 && (
          <div className="py-16 text-center border-b border-mkt-bd">
            <p className="text-[10px] font-mono text-mkt-i4 uppercase tracking-widest">
              No instruments match the active filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Mobile: stacked cards (< 768px) */}
      <div className="md:hidden divide-y divide-mkt-bd/60">
        {sortedRows.map((row) => (
          <div
            key={row.slug}
            className="p-4 cursor-pointer hover:bg-slate-50 transition-colors group"
            onClick={() => handleRowClick(row)}
          >
            <div className="flex justify-between items-start mb-2.5">
              <div>
                <p className="font-extrabold font-mono text-[13px] text-mkt-ink group-hover:text-accent transition-colors leading-tight">
                  {row.displayPair}
                </p>
                <p className="text-[8px] font-mono text-mkt-i4 uppercase tracking-wider mt-0.5">
                  {row.category}
                </p>
              </div>
              <ChangeBadge changePct={row.changePct} feedOffline={row.feed_offline} />
            </div>

            <div className="flex justify-between items-center pt-1">
              <div>
                <span className="text-[8px] font-mono uppercase tracking-wider text-mkt-i4 block">
                  Price
                </span>
                <span className="text-sm font-mono font-bold text-mkt-ink tabular-nums">
                  {row.feed_offline
                    ? "—"
                    : row.price !== null
                    ? row.price >= 1000
                      ? row.price.toLocaleString("en-GB", { minimumFractionDigits: 1, maximumFractionDigits: 2 })
                      : row.price.toFixed(4)
                    : "—"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <RSIBadge rsi={row.rsi} />
                <BiasBadge bias={row.bias} />
              </div>
            </div>
          </div>
        ))}

        {sortedRows.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-[10px] font-mono text-mkt-i4 uppercase tracking-widest">
              No instruments match the active filter criteria
            </p>
          </div>
        )}
      </div>

      {/* ── Table Footer ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-5 py-3 border-t border-mkt-bd/60 bg-slate-50/50 text-[9px] font-mono text-mkt-i4">
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
        />
      )}
    </div>
  );
}
