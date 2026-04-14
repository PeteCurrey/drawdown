"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface MarketItem {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
}

export function MarketTicker() {
  const [data, setData] = useState<MarketItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/market/prices");
        const json = await res.json();
        if (Array.isArray(json)) {
          setData(json);
        }
      } catch (err) {
        console.error("Ticker fetch error:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (data.length === 0) return null;

  // Double the data for seamless infinite marquee
  const displayItems = [...data, ...data];

  return (
    <div className="w-full bg-[#06070A] border-b border-white/5 py-2 overflow-hidden flex whitespace-nowrap relative z-50">
      <div className="animate-marquee flex items-center gap-12">
        {displayItems.map((item, i) => (
          <div key={`${item.symbol}-${i}`} className="flex items-center gap-3">
            <span className="text-[10px] font-mono uppercase text-text-tertiary">
              {item.name}
            </span>
            <span className="text-[11px] font-mono font-bold text-text-primary">
              {item.price}
            </span>
            <span className={cn(
              "text-[9px] font-mono font-bold flex items-center gap-1",
              parseFloat(item.changePercent) >= 0 ? "text-profit" : "text-loss"
            )}>
              {parseFloat(item.changePercent) >= 0 ? "▲" : "▼"}
              {Math.abs(parseFloat(item.changePercent))}%
            </span>
          </div>
        ))}
      </div>
      
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </div>
  );
}
