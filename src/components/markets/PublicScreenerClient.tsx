"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { ScreenerRow, MarketCategory } from "@/lib/screener";
import { ScreenerMarketPulse } from "@/components/markets/ScreenerMarketPulse";
import { ScreenerHeatmap } from "@/components/markets/ScreenerHeatmap";
import { ScreenerMarketConditions } from "@/components/markets/ScreenerMarketConditions";
import {
  ScreenerFilterWorkstation,
  FilterState,
} from "@/components/markets/ScreenerFilterWorkstation";
import { ScreenerTable, InstrumentModal } from "@/components/markets/ScreenerTable";
import { ScreenerUpsellRows } from "@/components/markets/ScreenerUpsellRows";
import { DataProvenanceLabel } from "@/components/ui/DataProvenanceLabel";
import { RefreshCw, Activity, SlidersHorizontal, Table } from "lucide-react";
import { cn } from "@/lib/utils";

export function PublicScreenerClient({ initialData }: { initialData?: ScreenerRow[] }) {
  const [data, setData] = useState<ScreenerRow[]>(initialData && initialData.length > 0 ? initialData : []);
  const [loading, setLoading] = useState(initialData && initialData.length > 0 ? false : true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(
    initialData && initialData.length > 0 ? new Date() : null
  );

  // STEP 1: Single source of truth value-diff engine
  const prevDataRef = useRef<Map<string, ScreenerRow>>(
    new Map(initialData?.map((r) => [r.slug, r]) ?? [])
  );
  const [changedSlugs, setChangedSlugs] = useState<Map<string, "up" | "down">>(new Map());
  const clearDiffTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // STEP 6: Client-side accumulated price history (last ~12 points per slug)
  const [priceHistory, setPriceHistory] = useState<Map<string, number[]>>(() => {
    const initialMap = new Map<string, number[]>();
    if (initialData && initialData.length > 0) {
      for (const row of initialData) {
        if (!row.feed_offline && row.price !== null) {
          initialMap.set(row.slug, [row.price]);
        }
      }
    }
    return initialMap;
  });

  // STEP 5: Live freshness indicator clock (< 20s = solid/pulsing, >= 20s = dimmed)
  const [currentTime, setCurrentTime] = useState<number>(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const isFresh = lastUpdated ? currentTime - lastUpdated.getTime() < 20_000 : false;

  // Active modal instrument
  const [modalInstrument, setModalInstrument] = useState<ScreenerRow | null>(null);

  // Filter workstation state
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "all",
    performance: "all",
    rsi: "all",
    bias: "all",
    preset: null,
  });

  async function loadData(manual = false) {
    if (manual) setIsRefreshing(true);
    try {
      const res = await fetch("/api/market/screener");
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json) && json.length > 0) {
          // Compute price-diff map across instruments
          const diff = new Map<string, "up" | "down">();
          if (prevDataRef.current.size > 0) {
            for (const row of json) {
              const prev = prevDataRef.current.get(row.slug);
              if (
                prev &&
                !row.feed_offline &&
                !prev.feed_offline &&
                row.price !== null &&
                prev.price !== null
              ) {
                if (row.price > prev.price) {
                  diff.set(row.slug, "up");
                } else if (row.price < prev.price) {
                  diff.set(row.slug, "down");
                }
              }
            }
          }

          // Update ref snapshot
          const newMap = new Map<string, ScreenerRow>();
          for (const row of json) {
            newMap.set(row.slug, row);
          }
          prevDataRef.current = newMap;

          // Dispatch changedSlugs & schedule 1200ms auto-clear
          if (clearDiffTimeoutRef.current) {
            clearTimeout(clearDiffTimeoutRef.current);
          }
          if (diff.size > 0) {
            setChangedSlugs(diff);
            clearDiffTimeoutRef.current = setTimeout(() => {
              setChangedSlugs(new Map());
            }, 1200);
          } else {
            setChangedSlugs(new Map());
          }

          // Accumulate real price points up to 12
          setPriceHistory((prev) => {
            const next = new Map(prev);
            for (const row of json) {
              if (!row.feed_offline && row.price !== null) {
                const existing = next.get(row.slug) || [];
                next.set(row.slug, [...existing, row.price].slice(-12));
              }
            }
            return next;
          });

          setData(json);
          setLastUpdated(new Date());
        }
      }
    } catch (err) {
      console.error("[PublicScreener] fetch error:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }

  // STEP 2: Tightened 15s client poll (server revalidate=60 untouched)
  useEffect(() => {
    if (!initialData || initialData.length === 0) {
      loadData();
    }
    const interval = setInterval(() => loadData(), 15_000);
    return () => {
      clearInterval(interval);
      if (clearDiffTimeoutRef.current) clearTimeout(clearDiffTimeoutRef.current);
    };
  }, []);

  // Filtered dataset matching workstation & quick screens
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      // Category filter
      if (filters.category !== "all" && row.category !== filters.category) {
        return false;
      }

      // Search query
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase().trim();
        const matchSymbol = row.slug.toLowerCase().includes(q);
        const matchPair = row.displayPair.toLowerCase().includes(q);
        if (!matchSymbol && !matchPair) return false;
      }

      // Performance filter
      if (filters.performance === "gainers") {
        if (row.changePct === null || row.changePct <= 0) return false;
      } else if (filters.performance === "decliners") {
        if (row.changePct === null || row.changePct >= 0) return false;
      } else if (filters.performance === "big_movers") {
        if (row.changePct === null || Math.abs(row.changePct) < 1.5) return false;
      }

      // RSI filter
      if (filters.rsi === "oversold") {
        if (row.rsi === null || row.rsi >= 30) return false;
      } else if (filters.rsi === "neutral") {
        if (row.rsi === null || row.rsi < 30 || row.rsi > 70) return false;
      } else if (filters.rsi === "overbought") {
        if (row.rsi === null || row.rsi <= 70) return false;
      }

      // Bias filter
      if (filters.bias !== "all") {
        if (row.bias !== filters.bias) return false;
      }

      return true;
    });
  }, [data, filters]);

  // Handle category selection from Heatmap to keep workstation in sync
  const handleHeatmapCategoryChange = (cat: MarketCategory | "all") => {
    setFilters((prev) => ({
      ...prev,
      category: cat,
      preset: null,
    }));
  };

  return (
    <div className="space-y-8">
      {/* ── 1. Top Provenance & Live Feed Status Bar ────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-mkt-bd/80">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-mkt-ink">
            Live Feed Stream
          </span>
          <span className="text-[9px] font-mono text-mkt-i4">
            · Continuous 60s cache
          </span>
          {lastUpdated && (
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[9px] font-mono text-mkt-i4/80 bg-slate-100 px-2 py-0.5 rounded-xs">
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-opacity duration-300",
                  isFresh ? "bg-emerald-500 animate-pulse opacity-100" : "bg-slate-400 opacity-30"
                )}
                title={isFresh ? "Feed fresh (<20s)" : "Sync pending (>20s)"}
              />
              Updated {lastUpdated.toLocaleTimeString("en-GB")}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={() => loadData(true)}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-mkt-bd text-[9px] font-mono uppercase tracking-widest font-bold text-mkt-i3 hover:text-mkt-ink hover:border-slate-400 transition-colors bg-white shadow-2xs disabled:opacity-50 rounded-xs"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Syncing..." : "Refresh Feed"}
          </button>
          <div className="flex items-center gap-2">
            {/* STEP 5: Live status indicator (solid when data <20s old, dimmed otherwise) */}
            <span
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300 shrink-0",
                isFresh ? "bg-emerald-500 animate-pulse opacity-100 shadow-[0_0_6px_rgba(24,184,128,0.6)]" : "bg-slate-400 opacity-35"
              )}
              title={isFresh ? "Data fresh (<20s)" : "Data aged (>20s)"}
            />
            <DataProvenanceLabel
              provider="Twelve Data"
              delayDescription="60s cache"
              status="cached"
            />
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="space-y-6">
          <div className="h-28 bg-white border border-mkt-bd animate-pulse rounded-xs" />
          <div className="h-80 bg-white border border-mkt-bd animate-pulse rounded-xs" />
          <div className="h-16 bg-white border border-mkt-bd animate-pulse rounded-xs" />
          <div className="h-96 bg-white border border-mkt-bd animate-pulse rounded-xs" />
        </div>
      ) : (
        <>
          {/* ── 2. Market Pulse & Macro Breadth Strip ───────────────────────── */}
          <ScreenerMarketPulse instruments={data} lastUpdated={lastUpdated} />

          {/* ── 3. Heatmap / Market Map Hero Anchor ────────────────────────── */}
          <div className="space-y-2">
            <ScreenerHeatmap
              instruments={filteredData}
              selectedCategory={filters.category}
              onSelectCategory={handleHeatmapCategoryChange}
              onSelect={(inst) => setModalInstrument(inst)}
              selectedSlug={modalInstrument?.slug}
              changedSlugs={changedSlugs}
            />
          </div>

          {/* ── 4. Market Conditions (Four Pillars & Leaderboards) ────────────── */}
          <div className="space-y-2">
            <ScreenerMarketConditions
              instruments={data}
              onSelect={(inst) => setModalInstrument(inst)}
              selectedSlug={modalInstrument?.slug}
            />
          </div>

          {/* ── 5. Unified Filter Workstation & Quick Screens ────────────────── */}
          <div className="pt-2">
            <ScreenerFilterWorkstation
              filters={filters}
              onFilterChange={setFilters}
              totalCount={data.length}
              matchedCount={filteredData.length}
            />
          </div>

          {/* ── 5. Terminal Results Table ───────────────────────────────────── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Table className="w-4 h-4 text-mkt-ink" />
                <h3 className="text-xs font-mono font-extrabold uppercase tracking-wider text-mkt-ink">
                  Terminal Data Grid
                </h3>
                <span className="text-[9px] font-mono text-mkt-i4">
                  ({filteredData.length} records)
                </span>
              </div>
            </div>

            <ScreenerTable
              instruments={filteredData}
              showLockedColumns={true}
              onSelectInstrument={(inst) => setModalInstrument(inst)}
              selectedSlug={modalInstrument?.slug}
              changedSlugs={changedSlugs}
              priceHistory={priceHistory}
            />
          </div>
        </>
      )}

      {/* ── 6. Shared Instrument Detail Modal ─────────────────────────────── */}
      {modalInstrument && (
        <InstrumentModal
          row={modalInstrument}
          onClose={() => setModalInstrument(null)}
        />
      )}

      {/* ── 7. Foundation Tier Upsell & Pro Discovery ─────────────────────── */}
      <ScreenerUpsellRows />
    </div>
  );
}
