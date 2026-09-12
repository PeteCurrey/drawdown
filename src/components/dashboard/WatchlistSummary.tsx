"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useMarketCache } from "@/hooks/useMarketCache";
import { cn } from "@/lib/utils";
import { instrumentDecimals } from "@/lib/instruments";
import { DataProvenanceLabel } from "@/components/ui/DataProvenanceLabel";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

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
    if (!userCurrency || userCurrency.toUpperCase() === "USD") { setFxRate(1); return; }
    fetch(`https://api.frankfurter.dev/v1/latest?from=USD&to=${userCurrency.toUpperCase()}`)
      .then(r => r.json())
      .then(d => { const rate = d?.rates?.[userCurrency.toUpperCase()]; if (typeof rate === "number" && rate > 0) setFxRate(rate); })
      .catch(() => {});
  }, [userCurrency]);

  useEffect(() => {
    if (hookSlugs.length > 0) {
      const symList = hookSlugs.join(",");
      fetch(`/api/market/polygon-snapshot?symbols=${symList}`)
        .then(r => r.json())
        .then(d => { if (d.snapshots) setPolySnapshots(d.snapshots); })
        .catch(err => console.error("Error fetching Polygon snapshot for watchlist:", err));
    }
  }, [initialSymbols]);

  const displayMap = initialSymbols.reduce((acc, sym, i) => {
    acc[hookSlugs[i]] = sym;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="bg-white border border-[#E6E4DE] rounded-[8px] shadow-[0_1px_2px_rgba(14,13,10,0.04),0_2px_8px_rgba(14,13,10,0.05)] flex flex-col justify-between min-h-[200px] overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex justify-between items-center">
        <span className="text-[10px] font-semibold uppercase tracking-[0.09em] text-[#87877F]">Watchlist</span>
        <Link href="/dashboard/tools/technical-scanner" className="text-[11px] font-medium text-[#87877F] hover:text-[#F9771D] transition-colors">
          Scanner →
        </Link>
      </div>

      {/* Column Headers */}
      <div className="px-4 pb-1.5 grid grid-cols-[1fr_auto_auto_auto] gap-x-3 items-center border-b border-[#EEECE7]">
        <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#BBBAB4]">Instrument</span>
        <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#BBBAB4] text-right w-20">Price</span>
        <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#BBBAB4] text-center w-14">Trend</span>
        <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#BBBAB4] text-right w-12">24h</span>
      </div>

      {/* Rows */}
      <div className="flex-1">
        {initialSymbols.length > 0 ? (
          hookSlugs.slice(0, 5).map((slug) => {
            const item = data[slug];
            const poly = polySnapshots[slug];
            const displaySymbol = displayMap[slug];
            const rawPrice = item?.price ?? poly?.price ?? null;
            const convertedPrice = rawPrice !== null ? rawPrice * fxRate : null;
            const changePct = item?.change_pct ?? poly?.changePercent ?? 0;
            const isLoading = (item?.loading ?? true) && !poly;
            return (
              <WatchlistRow key={slug} slug={slug} displaySymbol={displaySymbol} price={convertedPrice} changePercent={changePct} loading={isLoading} />
            );
          })
        ) : (
          <p className="text-[11px] text-[#87877F] py-6 text-center px-4">No watchlist instruments configured</p>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[#EEECE7] flex justify-between items-center">
        <DataProvenanceLabel provider="Polygon.io" delayDescription="Live feed" status="live" />
        <span className="text-[10px] font-medium text-[#87877F]">{initialSymbols.length} tracked</span>
      </div>
    </div>
  );
}

function WatchlistRow({ slug, displaySymbol, price, changePercent, loading }: {
  slug: string; displaySymbol: string; price: number | null; changePercent: number; loading: boolean;
}) {
  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  const prevPrice = useRef<number | null>(price);

  useEffect(() => {
    if (price && prevPrice.current && price !== prevPrice.current) {
      setFlash(price > prevPrice.current ? "up" : "down");
      const t = setTimeout(() => setFlash(null), 800);
      prevPrice.current = price;
      return () => clearTimeout(t);
    } else if (price) { prevPrice.current = price; }
  }, [price]);

  const isUp = changePercent >= 0;
  const isFlat = changePercent === 0;
  const decimals = instrumentDecimals(slug);
  const TrendIcon = isFlat ? Minus : isUp ? TrendingUp : TrendingDown;

  return (
    <div className={cn(
      "px-4 py-2 grid grid-cols-[1fr_auto_auto_auto] gap-x-3 items-center transition-colors duration-150",
      flash === "up" ? "bg-[#F0FDF8]" : flash === "down" ? "bg-[#FDF2F2]" : "hover:bg-[#F5F4F1]"
    )}>
      <div className="flex items-center gap-2 min-w-0">
        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", isUp ? "bg-[#18B880]" : "bg-[#CE6969]")} />
        <span className="text-[12px] font-semibold text-[#181818] truncate">{displaySymbol}</span>
      </div>
      <span className="text-[12px] font-medium dd-tabular text-[#181818] text-right w-20">
        {loading || !price ? <span className="text-[#BBBAB4]">—</span> : price.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      </span>
      <div className="flex justify-center w-14">
        <TrendIcon className={cn("w-3 h-3", isFlat ? "text-[#BBBAB4]" : isUp ? "text-[#18B880]" : "text-[#CE6969]")} />
      </div>
      <span className={cn("text-[11px] font-semibold dd-tabular text-right w-12", isUp ? "text-[#18B880]" : "text-[#CE6969]")}>
        {isUp ? "+" : ""}{changePercent.toFixed(2)}%
      </span>
    </div>
  );
}
