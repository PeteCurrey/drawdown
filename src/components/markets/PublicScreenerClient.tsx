"use client";

import { useState, useEffect } from "react";
import { ScreenerRow } from "@/lib/screener";
import { ScreenerTable } from "@/components/markets/ScreenerTable";
import { ScreenerUpsellRows } from "@/components/markets/ScreenerUpsellRows";
import { DataProvenanceLabel } from "@/components/ui/DataProvenanceLabel";
import { Activity, RefreshCw } from "lucide-react";

export function PublicScreenerClient() {
  const [data, setData] = useState<ScreenerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  async function loadData(manual = false) {
    if (manual) setIsRefreshing(true);
    try {
      const res = await fetch("/api/market/screener");
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json)) {
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

  useEffect(() => {
    loadData();
    const interval = setInterval(() => loadData(), 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      {/* Top provenance & refresh status bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-mkt-bd/60">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-profit animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4">
            Live Market Feed · 60s auto-refresh
          </span>
          {lastUpdated && (
            <span className="text-[9px] font-mono text-mkt-i4/60">
              ({lastUpdated.toLocaleTimeString("en-GB")})
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadData(true)}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-mkt-bd text-[9px] font-mono uppercase tracking-widest text-mkt-i4 hover:text-mkt-ink hover:border-mkt-ink transition-colors bg-white disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <DataProvenanceLabel
            provider="Twelve Data"
            delayDescription="60s cache"
            status="cached"
          />
        </div>
      </div>

      {/* Main Table or Skeleton */}
      {loading ? (
        <div className="space-y-3">
          <div className="h-10 bg-white border border-mkt-bd animate-pulse" />
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-14 bg-white/40 border border-mkt-bd/60 animate-pulse" />
          ))}
        </div>
      ) : (
        <ScreenerTable instruments={data} showLockedColumns={true} />
      )}

      {/* Finviz Elite style Locked-columns / Feature Upsell */}
      <ScreenerUpsellRows />
    </div>
  );
}
