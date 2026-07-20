"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TickerItem {
  symbol: string;
  price: number;
  changePercent: number;
}

const TICKER_SYMBOLS = [
  "GBPUSD", "EURUSD", "USDJPY", "EURGBP", "BTCUSD", "ETHUSD", "GBPEUR"
];

export function PriceTicker() {
  const [data, setData] = useState<TickerItem[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch(`/api/market/prices?symbols=${TICKER_SYMBOLS.join(",")}`);
        if (!res.ok) throw new Error();
        const prices = await res.json();
        // Ensure valid array is returned
        if (Array.isArray(prices)) {
          setData(prices);
          setError(false);
        } else {
          throw new Error();
        }
      } catch (err) {
        setError(true);
      }
    }

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatSymbol = (sym: string) => {
    if (sym.length === 6) {
      return `${sym.substring(0, 3)}/${sym.substring(3, 6)}`;
    }
    return sym;
  };

  const formatPrice = (price: number | null | undefined, symbol: string) => {
    if (price == null || typeof price !== "number" || Number.isNaN(price)) {
      return "--";
    }
    if (symbol.includes("JPY")) return price.toFixed(2);
    if (symbol.includes("BTC") || symbol.includes("ETH")) {
      return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return price.toFixed(4);
  };

  const formatChange = (change: number | null | undefined) => {
    if (change == null || typeof change !== "number" || Number.isNaN(change)) {
      return "";
    }
    return `${change >= 0 ? "▲" : "▼"} ${Math.abs(change).toFixed(2)}%`;
  };

  // Compile ticker list: use live data if available, otherwise fallback list with "--"
  const activeList: { symbol: string; price?: number; changePercent?: number }[] = 
    data.length > 0 && !error 
      ? data 
      : TICKER_SYMBOLS.map(sym => ({ symbol: sym }));

  // Triplicate the items for seamless CSS marquee scroll
  const marqueeItems = [...activeList, ...activeList, ...activeList];

  return (
    <div className="w-full bg-white h-[44px] flex items-center overflow-hidden border-y border-mkt-bd select-none relative z-10">
      
      {/* Live Badge */}
      <div className="absolute left-0 top-0 bottom-0 bg-white z-30 flex items-center px-4 border-r border-mkt-bd">
        <span className="text-[10px] font-bold text-white bg-mkt-grn px-2 py-0.5 rounded-sm uppercase tracking-wider font-sans">
          LIVE
        </span>
      </div>

      {/* Marquee Wrapper */}
      <div className="flex-grow overflow-hidden flex items-center pl-24 pr-44">
        <div className="flex animate-marquee-ticker whitespace-nowrap items-center hover:[animation-play-state:paused] cursor-pointer">
          {marqueeItems.map((item, i) => {
            const hasData = item.price !== undefined;
            const isPositive = item.changePercent !== undefined && item.changePercent >= 0;

            return (
              <div key={i} className="flex items-center gap-2 pr-12">
                {/* Pair Name: Geist Mono, dim */}
                <span className="text-mkt-i3 text-xs font-mono tracking-wide uppercase">
                  {formatSymbol(item.symbol)}
                </span>
                
                {/* Price: Geist Mono, dark, bold */}
                <span className="text-mkt-ink text-xs font-mono font-bold">
                  {formatPrice(item.price, item.symbol)}
                </span>
                
                {/* Change: Geist Mono, green if positive, red if negative */}
                {hasData && (
                  <span className={cn(
                    "text-xs font-mono font-semibold",
                    isPositive ? "text-mkt-grn" : "text-mkt-red"
                  )}>
                    {formatChange(item.changePercent)}
                  </span>
                )}
                
                {/* Dot separator */}
                <span className="text-mkt-bd ml-6 select-none font-sans">&bull;</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delayed pricing info */}
      <div className="absolute right-0 top-0 bottom-0 bg-white z-30 flex items-center px-4 border-l border-mkt-bd text-mkt-i3 text-[10px] uppercase font-mono tracking-widest">
        Prices delayed 60s
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes marquee-ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee-ticker {
          animation: marquee-ticker 38s linear infinite;
        }
      `}} />
    </div>
  );
}
