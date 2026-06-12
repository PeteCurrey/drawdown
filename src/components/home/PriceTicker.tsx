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
        setData(prices);
        setError(false);
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

  const formatPrice = (price: number, symbol: string) => {
    if (symbol.includes("JPY")) return price.toFixed(2);
    if (symbol.includes("BTC") || symbol.includes("ETH")) {
      return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return price.toFixed(4);
  };

  // Duplicate items for seamless CSS marquee scroll
  const marqueeItems = [...data, ...data, ...data];

  return (
    <div className="w-full bg-[#0A0A0A] h-[44px] flex items-center overflow-hidden border-y border-[#1A1D24] select-none relative z-20">
      
      {/* Live Badge */}
      <div className="absolute left-0 top-0 bottom-0 bg-[#0A0A0A] z-30 flex items-center px-4 border-r border-[#1A1D24]">
        <span className="text-[10px] font-bold text-black bg-emerald-400 px-2 py-0.5 rounded-sm uppercase tracking-wider">
          LIVE
        </span>
      </div>

      {/* Marquee Wrapper */}
      <div className="flex-grow overflow-hidden flex items-center pl-20 pr-40">
        <div className="flex animate-marquee-ticker whitespace-nowrap items-center hover:[animation-play-state:paused] cursor-pointer">
          {data.length > 0 ? (
            marqueeItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-neutral-400 text-xs font-mono tracking-wide uppercase">
                  {formatSymbol(item.symbol)}
                </span>
                <span className="text-white text-xs font-mono font-semibold">
                  {formatPrice(item.price, item.symbol)}
                </span>
                <span className={cn(
                  "text-xs font-mono font-semibold",
                  item.changePercent >= 0 ? "text-emerald-400" : "text-rose-500"
                )}>
                  {item.changePercent >= 0 ? "▲" : "▼"} {Math.abs(item.changePercent).toFixed(2)}%
                </span>
                <span className="text-neutral-700 mx-6 select-none font-sans">&bull;</span>
              </div>
            ))
          ) : (
            <div className="text-neutral-500 text-xs font-mono pl-4">
              Connecting to market data feed...
            </div>
          )}
        </div>
      </div>

      {/* Delayed pricing info */}
      <div className="absolute right-0 top-0 bottom-0 bg-[#0A0A0A] z-30 flex items-center px-4 border-l border-[#1A1D24] text-neutral-500 text-[10px] uppercase font-mono tracking-widest">
        Prices delayed 60s
      </div>

      <style jsx>{`
        @keyframes marquee-ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee-ticker {
          animation: marquee-ticker 40s linear infinite;
        }
      `}</style>
    </div>
  );
}
