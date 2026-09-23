"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  ArrowUpDown, ArrowUp, ArrowDown, Search, Lock, Grid2x2, List,
  AlertTriangle, TrendingUp, TrendingDown, Minus, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScreenerRow, MarketCategory } from "@/lib/screener";
import { TradingViewMiniChart } from "@/components/markets/TradingViewMiniChart";
import { ScreenerHeatmap } from "@/components/markets/ScreenerHeatmap";

// ─── Types ────────────────────────────────────────────────────────────────────

type SortKey = "displayPair" | "price" | "changePct" | "rsi";
type SortDir = "asc" | "desc";

interface ScreenerTableProps {
  instruments: ScreenerRow[];
  initialCategory?: MarketCategory | "all";
  /** Show locked premium columns (Signals, AI Brief) — always true on public screener */
  showLockedColumns?: boolean;
  /** Controlled from parent for embedded use */
  viewMode?: "table" | "heatmap";
  onViewModeChange?: (mode: "table" | "heatmap") => void;
}

// ─── Category tabs ────────────────────────────────────────────────────────────

const TABS: { id: MarketCategory | "all"; label: string }[] = [
  { id: "all",         label: "All"        },
  { id: "forex",       label: "Forex"      },
  { id: "commodities", label: "Commodities"},
  { id: "indices",     label: "Indices"    },
  { id: "crypto",      label: "Crypto"     },
  { id: "stocks-uk",   label: "UK Stocks"  },
  { id: "stocks-us",   label: "US Stocks"  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function FeedOfflineBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[8px] font-mono font-bold uppercase tracking-widest border border-amber-500/40 text-amber-400 bg-amber-500/10">
      <AlertTriangle className="w-2.5 h-2.5" />
      FEED_OFFLINE
    </span>
  );
}

function BiasIcon({ bias }: { bias: ScreenerRow["bias"] }) {
  if (bias === "BULLISH") return <TrendingUp  className="w-3.5 h-3.5 text-profit" />;
  if (bias === "BEARISH") return <TrendingDown className="w-3.5 h-3.5 text-loss"  />;
  return <Minus className="w-3.5 h-3.5 text-mkt-i4" />;
}

function RSIBar({ rsi }: { rsi: number | null }) {
  if (rsi === null) return <span className="text-mkt-i4">—</span>;
  const color = rsi > 70 ? "text-loss" : rsi < 30 ? "text-profit" : "text-mkt-i2";
  return <span className={cn("font-mono font-bold", color)}>{rsi.toFixed(1)}</span>;
}

function LockedCell({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[9px] font-mono text-mkt-i4/50 select-none">
      <Lock className="w-2.5 h-2.5" />
      {label}
    </span>
  );
}

function SortIcon({ col, sort, dir }: { col: SortKey; sort: SortKey; dir: SortDir }) {
  if (sort !== col) return <ArrowUpDown className="w-3 h-3 opacity-30" />;
  return dir === "asc"
    ? <ArrowUp className="w-3 h-3 text-accent" />
    : <ArrowDown className="w-3 h-3 text-accent" />;
}

// ─── Mini-chart modal ─────────────────────────────────────────────────────────

function InstrumentModal({
  row,
  onClose,
}: {
  row: ScreenerRow;
  onClose: () => void;
}) {
  // Map scannerSlug → tvSymbol from the SCREENER_INSTRUMENTS table
  // We receive tvSymbol via ScreenerRow — but the row doesn't carry tvSymbol.
  // We resolve it from the parent's instruments prop by slug.
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg mx-4 bg-mkt-bg border border-mkt-bd p-6 space-y-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-mono font-bold text-mkt-ink">{row.displayPair}</h3>
            <p className="text-[9px] font-mono text-mkt-i4 uppercase tracking-widest">{row.category}</p>
          </div>
          <button
            onClick={onClose}
            className="text-mkt-i4 hover:text-mkt-ink transition-colors text-sm font-mono"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-6 items-baseline">
          <span className="text-2xl font-mono font-bold">
            {row.price !== null ? row.price.toFixed(5).replace(/\.?0+$/, "") : "—"}
          </span>
          {row.changePct !== null && (
            <span className={cn(
              "text-sm font-mono font-bold",
              row.changePct >= 0 ? "text-profit" : "text-loss"
            )}>
              {row.changePct >= 0 ? "+" : ""}{row.changePct.toFixed(2)}%
            </span>
          )}
          {row.feed_offline && <FeedOfflineBadge />}
        </div>

        {/* Mini-chart — reuses existing TradingViewMiniChart component */}
        <div className="h-48 border border-mkt-bd">
          <TradingViewMiniChart
            symbol={row.slug}
            largeChartUrl={`/dashboard/tools/technical-scanner?symbol=${row.slug}`}
            className="w-full h-full"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[9px] font-mono uppercase tracking-widest border border-mkt-bd text-mkt-i4 hover:border-accent hover:text-accent transition-colors"
          >
            Close
          </button>
          <Link
            href={`/dashboard/tools/technical-scanner?symbol=${row.slug}`}
            className="px-4 py-2 text-[9px] font-mono uppercase tracking-widest bg-mkt-ink text-white hover:bg-accent transition-colors"
          >
            Full Analysis →
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ScreenerTable({
  instruments,
  initialCategory = "all",
  showLockedColumns = true,
  viewMode: controlledViewMode,
  onViewModeChange,
}: ScreenerTableProps) {
  const [activeTab, setActiveTab] = useState<MarketCategory | "all">(initialCategory);
  const [search, setSearch]       = useState("");
  const [sort, setSort]           = useState<SortKey>("changePct");
  const [sortDir, setSortDir]     = useState<SortDir>("desc");
  const [modalRow, setModalRow]   = useState<ScreenerRow | null>(null);
  const [internalView, setInternalView] = useState<"table" | "heatmap">("table");

  const viewMode = controlledViewMode ?? internalView;
  const setViewMode = onViewModeChange ?? setInternalView;

  const handleSort = useCallback((col: SortKey) => {
    setSort(prev => {
      if (prev === col) setSortDir(d => d === "asc" ? "desc" : "asc");
      else { setSortDir("desc"); }
      return col;
    });
  }, []);

  const filtered = useMemo(() => {
    let rows = instruments;
    if (activeTab !== "all") rows = rows.filter(r => r.category === activeTab);
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(r =>
        r.slug.toLowerCase().includes(q) || r.displayPair.toLowerCase().includes(q)
      );
    }
    return [...rows].sort((a, b) => {
      const valA = sort === "displayPair" ? a.displayPair : (a[sort] ?? -Infinity);
      const valB = sort === "displayPair" ? b.displayPair : (b[sort] ?? -Infinity);
      if (valA === valB) return 0;
      if (sortDir === "asc") return valA < valB ? -1 : 1;
      return valA > valB ? -1 : 1;
    });
  }, [instruments, activeTab, search, sort, sortDir]);

  // ─── Available tabs (only show tabs that have data) ────────────────────────
  const availableTabs = useMemo(() => {
    const cats = new Set(instruments.map(i => i.category));
    return TABS.filter(t => t.id === "all" || cats.has(t.id as MarketCategory));
  }, [instruments]);

  return (
    <div className="space-y-6">
      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 border-b border-mkt-bd pb-6">
        {/* Tab row + view toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {availableTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-2 text-[9px] font-mono font-bold uppercase tracking-widest transition-all",
                  activeTab === tab.id
                    ? "bg-mkt-ink text-white"
                    : "bg-transparent text-mkt-i4 border border-mkt-bd hover:border-mkt-bds/40"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex gap-1 border border-mkt-bd">
            <button
              onClick={() => setViewMode("table")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "table" ? "bg-mkt-ink text-white" : "text-mkt-i4 hover:text-mkt-ink"
              )}
              title="Table view"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("heatmap")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "heatmap" ? "bg-mkt-ink text-white" : "text-mkt-i4 hover:text-mkt-ink"
              )}
              title="Heatmap view"
            >
              <Grid2x2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-mkt-i4" />
          <input
            type="text"
            placeholder="Search symbol or name…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-mkt-bd py-2.5 pl-9 pr-4 text-[10px] font-mono uppercase tracking-widest outline-none focus:border-accent transition-colors"
          />
        </div>
      </div>

      {/* ── Table (desktop) ─────────────────────────────────────────────────── */}
      {viewMode === "table" && (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse text-[10px] font-mono">
              <thead>
                <tr className="border-b border-mkt-bd">
                  {([
                    { key: "displayPair", label: "Symbol"    },
                    { key: "price",       label: "Price"     },
                    { key: "changePct",   label: "24h %"     },
                    { key: "rsi",         label: "RSI (14)"  },
                  ] as { key: SortKey; label: string }[]).map(col => (
                    <th key={col.key} className="text-left py-3 px-4 font-bold uppercase tracking-widest text-mkt-i4">
                      <button
                        onClick={() => handleSort(col.key)}
                        className="flex items-center gap-1.5 hover:text-mkt-ink transition-colors"
                      >
                        {col.label}
                        <SortIcon col={col.key} sort={sort} dir={sortDir} />
                      </button>
                    </th>
                  ))}
                  <th className="text-left py-3 px-4 font-bold uppercase tracking-widest text-mkt-i4">Bias</th>
                  {showLockedColumns && (
                    <>
                      <th className="text-left py-3 px-4 font-bold uppercase tracking-widest text-mkt-i4/40 select-none">
                        <span className="flex items-center gap-1"><Lock className="w-2.5 h-2.5" />Signals</span>
                      </th>
                      <th className="text-left py-3 px-4 font-bold uppercase tracking-widest text-mkt-i4/40 select-none">
                        <span className="flex items-center gap-1"><Lock className="w-2.5 h-2.5" />AI Brief</span>
                      </th>
                    </>
                  )}
                  <th className="py-3 px-4" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr
                    key={row.slug}
                    className="border-b border-mkt-bd/50 hover:bg-mkt-bd/10 cursor-pointer transition-colors group"
                    onClick={() => setModalRow(row)}
                  >
                    {/* Symbol */}
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-bold text-mkt-ink group-hover:text-accent transition-colors">{row.displayPair}</p>
                        <p className="text-[8px] text-mkt-i4 uppercase">{row.category}</p>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-4">
                      {row.feed_offline ? (
                        <FeedOfflineBadge />
                      ) : row.price !== null ? (
                        <span className="font-bold text-mkt-ink">
                          {row.price >= 1000
                            ? row.price.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                            : row.price >= 10
                            ? row.price.toFixed(3)
                            : row.price.toFixed(5)}
                        </span>
                      ) : "—"}
                    </td>

                    {/* 24h % */}
                    <td className="py-4 px-4">
                      {row.changePct !== null ? (
                        <span className={cn(
                          "inline-flex px-2 py-0.5 font-bold border",
                          row.changePct >= 0
                            ? "text-profit border-profit/20 bg-profit/5"
                            : "text-loss border-loss/20 bg-loss/5"
                        )}>
                          {row.changePct >= 0 ? "+" : ""}{row.changePct.toFixed(2)}%
                        </span>
                      ) : "—"}
                    </td>

                    {/* RSI */}
                    <td className="py-4 px-4">
                      <RSIBar rsi={row.rsi} />
                    </td>

                    {/* Bias */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        <BiasIcon bias={row.bias} />
                        <span className={cn(
                          "text-[9px] uppercase font-bold",
                          row.bias === "BULLISH" ? "text-profit" : row.bias === "BEARISH" ? "text-loss" : "text-mkt-i4"
                        )}>
                          {row.bias}
                        </span>
                      </div>
                    </td>

                    {/* Locked columns */}
                    {showLockedColumns && (
                      <>
                        <td className="py-4 px-4 opacity-40 blur-[1px] select-none">
                          <LockedCell label="3/5 TF" />
                        </td>
                        <td className="py-4 px-4 opacity-40 blur-[1px] select-none">
                          <LockedCell label="View brief" />
                        </td>
                      </>
                    )}

                    {/* CTA */}
                    <td className="py-4 px-4">
                      <ChevronRight className="w-3.5 h-3.5 text-mkt-i4 group-hover:text-accent transition-colors" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="py-16 text-center border-b border-mkt-bd">
                <p className="text-[10px] font-mono text-mkt-i4 uppercase tracking-widest">No instruments match this filter</p>
              </div>
            )}
          </div>

          {/* Mobile: stacked cards (< 768px) */}
          <div className="md:hidden space-y-3">
            {filtered.map((row) => (
              <div
                key={row.slug}
                className="border border-mkt-bd bg-white p-4 cursor-pointer hover:border-mkt-bds/40 transition-all group"
                onClick={() => setModalRow(row)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold font-mono text-sm text-mkt-ink group-hover:text-accent transition-colors">{row.displayPair}</p>
                    <p className="text-[8px] font-mono text-mkt-i4 uppercase">{row.category}</p>
                  </div>
                  {row.feed_offline ? (
                    <FeedOfflineBadge />
                  ) : row.changePct !== null && (
                    <span className={cn(
                      "text-[10px] font-mono font-bold px-2 py-0.5 border",
                      row.changePct >= 0 ? "text-profit border-profit/20 bg-profit/5" : "text-loss border-loss/20 bg-loss/5"
                    )}>
                      {row.changePct >= 0 ? "+" : ""}{row.changePct.toFixed(2)}%
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-lg font-mono font-bold text-mkt-ink">
                    {row.price !== null
                      ? (row.price >= 1000
                          ? row.price.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                          : row.price.toFixed(5).replace(/\.?0+$/, ""))
                      : "—"}
                  </span>
                  <div className="flex items-center gap-3">
                    {row.rsi !== null && <RSIBar rsi={row.rsi} />}
                    <BiasIcon bias={row.bias} />
                  </div>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="py-10 text-center border border-dashed border-mkt-bd/50">
                <p className="text-[10px] font-mono text-mkt-i4 uppercase tracking-widest">No instruments match this filter</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Heatmap view ────────────────────────────────────────────────────── */}
      {viewMode === "heatmap" && (
        <ScreenerHeatmap instruments={filtered} onSelect={setModalRow} />
      )}

      {/* ── Instrument detail modal ─────────────────────────────────────────── */}
      {modalRow && (
        <InstrumentModal row={modalRow} onClose={() => setModalRow(null)} />
      )}

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-2 border-t border-mkt-bd/50">
        <p className="text-[8px] font-mono text-mkt-i4 uppercase tracking-widest">
          {filtered.length} instruments · Live prices · 60s cache · Twelve Data / Yahoo Finance
        </p>
        <p className="text-[8px] font-mono text-mkt-i4 uppercase tracking-widest">
          Not financial advice
        </p>
      </div>
    </div>
  );
}
