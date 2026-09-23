"use client";

import { useState, useEffect } from "react";
import { MarketCategory, ScreenerRow } from "@/lib/screener";
import { ScreenerTable } from "@/components/markets/ScreenerTable";
import { DataProvenanceLabel } from "@/components/ui/DataProvenanceLabel";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface CategoryScreenerEmbedProps {
  category: MarketCategory;
}

export function CategoryScreenerEmbed({ category }: CategoryScreenerEmbedProps) {
  const [data, setData] = useState<ScreenerRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function fetchCatData() {
      try {
        const res = await fetch(`/api/market/screener?category=${category}`);
        if (res.ok) {
          const json = await res.json();
          if (active && Array.isArray(json)) {
            setData(json);
          }
        }
      } catch (err) {
        console.error("[CategoryScreenerEmbed] error:", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchCatData();
    const interval = setInterval(fetchCatData, 60_000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [category]);

  return (
    <div className="p-4 md:p-6 bg-[#0E0E0E] text-white space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-profit animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/50">
            {category} Screener · Real-Time
          </span>
        </div>
        <div className="flex items-center gap-3">
          <DataProvenanceLabel
            provider="Twelve Data"
            delayDescription="60s cache"
            status="cached"
          />
          <Link
            href="/markets/screener"
            className="hidden sm:inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-widest text-[#C8F135] hover:underline"
          >
            Full Screener <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3 py-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-white/5 rounded animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="[&_table]:text-white [&_input]:bg-white/5 [&_input]:border-white/10 [&_input]:text-white [&_button]:text-white/70">
          <ScreenerTable
            instruments={data}
            initialCategory={category}
            showLockedColumns={false}
            theme="dark"
          />
        </div>
      )}
    </div>
  );
}
