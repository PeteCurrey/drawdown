"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useMarketCache } from "@/hooks/useMarketCache";
import { cn } from "@/lib/utils";
import { instrumentDecimals } from "@/lib/instruments";

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
    <div className="bg-white border border-[#EDEDED] rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex flex-col justify-between min-h-[220px] transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)] hover:-translate-y-1 duration-200">
      <div>
        <div className="flex justify-between items-start mb-4">
          <h5 className="font-semibold text-sm text-[#1A1A1A]">Active Watchlist</h5>
          <Link href="/dashboard" className="text-xs text-[#555550] hover:text-[#1A1A1A]">↗</Link>
        </div>
        
        <div className="space-y-2 text-xs">
          {initialSymbols.length > 0 ? (
            hookSlugs.slice(0, 3).map((slug) => {
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
            <p className="text-[10px] text-[#555550] font-mono uppercase">Empty watchlist</p>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-[#EDEDED] flex justify-between items-end">
        <span className="text-[10px] font-mono text-[#555550]">Watching (Polygon Stream)</span>
        <span className="text-2xl font-black font-mono leading-none">
          {initialSymbols.length}
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
      "flex justify-between items-center p-1 rounded transition-colors duration-300",
      flash === "up" ? "bg-profit/20" : flash === "down" ? "bg-loss/20" : "bg-transparent"
    )}>
      <span className="flex items-center gap-1.5 truncate pr-2">
        <span className={isUp ? "text-[#18B880]" : "text-[#CE6969]"}>
          {isUp ? "🟢" : "🔴"}
        </span>
        <span className="font-medium text-[#1A1A1A] truncate">{displaySymbol}</span>
      </span>
      <span className="font-mono text-[#555550] shrink-0">
        {loading || !price ? (
          <span className="animate-pulse">—</span>
        ) : (
          price.toLocaleString("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
          })
        )}
      </span>
    </div>
  );
}
