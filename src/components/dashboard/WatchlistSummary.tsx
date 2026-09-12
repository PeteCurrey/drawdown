"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useMarketCache } from "@/hooks/useMarketCache";
import { cn } from "@/lib/utils";
import { instrumentDecimals } from "@/lib/instruments";
import { DataProvenanceLabel } from "@/components/ui/DataProvenanceLabel";

interface WatchlistSummaryProps {
  initialSymbols: string[];
  userCurrency?: string;
}

export function WatchlistSummary({ initialSymbols, userCurrency = "USD" }: WatchlistSummaryProps) {
  const hookSlugs = initialSymbols.map(s => s.replace("/", "").toUpperCase());
  const data = useMarketCache(hookSlugs);
  const [fxRate, setFxRate] = useState<number>(1);
  const [polySnapshots, setPolySnapshots] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!userCurrency || userCurrency.toUpperCase() === "USD") {
      setFxRate(1);
      return;
    }
    fetch(`https://api.frankfurter.dev/v1/latest?from=USD&to=${userCurrency.toUpperCase()}`)
      .then(r => r.json())
      .then(d => {
        const rate = d?.rates?.[userCurrency.toUpperCase()];
        if (typeof rate === "number" && rate > 0) setFxRate(rate);
      })
      .catch(() => {});
  }, [userCurrency]);

  useEffect(() => {
    if (hookSlugs.length > 0) {
      const symList = hookSlugs.join(",");
      fetch(`/api/market/polygon-snapshot?symbols=${symList}`)
        .then(r => r.json())
        .then(d => {
          if (d.snapshots) setPolySnapshots(d.snapshots);
        })
        .catch(err => console.error("Error fetching Polygon snapshot for watchlist:", err));
    }
  }, [initialSymbols]);

  const displayMap = initialSymbols.reduce((acc, sym, i) => {
    acc[hookSlugs[i]] = sym;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="bg-white border border-[#E8E6E1] rounded-lg p-4 flex flex-col justify-between min-h-[200px] transition-colors">
      <div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#888882]">
            Watchlist
          </span>
          <Link 
            href="/dashboard/tools/technical-scanner" 
            className="text-[11px] font-medium text-[#888882] hover:text-[#F9771D] transition-colors"
          >
            Scanner →
          </Link>
        </div>
        
        <div className="divide-y divide-[#F0EEE9] text-xs">
          {initialSymbols.length > 0 ? (
            hookSlugs.slice(0, 4).map((slug) => {
              const item = data[slug];
              const poly = polySnapshots[slug];
              const displaySymbol = displayMap[slug];
              
              const rawPrice = item?.price ?? poly?.price ?? null;
              const convertedPrice = rawPrice !== null ? rawPrice * fxRate : null;
              const changePct = item?.change_pct ?? poly?.changePercent ?? 0;
              const isLoading = (item?.loading ?? true) && !poly;

              return (
                <WatchlistItem 
                  key={slug} 
                  slug={slug} 
                  displaySymbol={displaySymbol} 
                  price={convertedPrice} 
                  changePercent={changePct}
                  loading={isLoading}
                />
              );
            })
          ) : (
            <p className="text-[11px] text-[#888882] py-4 text-center">No watchlist instruments configured</p>
          )}
        </div>
      </div>

      <div className="pt-3 mt-3 border-t border-[#F0EEE9] flex justify-between items-center">
        <DataProvenanceLabel 
          provider="Polygon.io" 
          delayDescription="Live feed" 
          status="live" 
        />
        <span className="text-xs font-semibold text-[#888882]">
          {initialSymbols.length} tracked
        </span>
      </div>
    </div>
  );
}

function WatchlistItem({ slug, displaySymbol, price, changePercent, loading }: { slug: string; displaySymbol: string; price: number | null; changePercent: number; loading: boolean }) {
  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  const prevPrice = useRef<number | null>(price);

  useEffect(() => {
    if (price && prevPrice.current && price !== prevPrice.current) {
      setFlash(price > prevPrice.current ? "up" : "down");
      const t = setTimeout(() => setFlash(null), 1000);
      prevPrice.current = price;
      return () => clearTimeout(t);
    } else if (price) {
      prevPrice.current = price;
    }
  }, [price]);

  const isUp = changePercent >= 0;
  const decimals = instrumentDecimals(slug);

  return (
    <div className={cn(
      "flex justify-between items-center py-2 px-1 transition-colors duration-200",
      flash === "up" ? "bg-[#F0FDF8]" : flash === "down" ? "bg-[#FDF2F2]" : "bg-transparent"
    )}>
      <div className="flex items-center gap-2 truncate pr-2">
        <span className={cn(
          "w-1.5 h-1.5 rounded-full shrink-0",
          isUp ? "bg-[#18B880]" : "bg-[#CE6969]"
        )} />
        <span className="font-semibold text-[12px] text-[#1A1A1A] truncate">{displaySymbol}</span>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="font-medium text-[12px] dd-tabular text-[#1A1A1A]">
          {loading || !price ? (
            <span className="text-[#888882]">—</span>
          ) : (
            price.toLocaleString("en-US", {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals
            })
          )}
        </span>
        <span className={cn(
          "text-[10px] font-semibold dd-tabular w-12 text-right",
          isUp ? "text-[#18B880]" : "text-[#CE6969]"
        )}>
          {isUp ? "+" : ""}{changePercent.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}

