"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

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

  // Quadruple the data for a very long, seamless infinite marquee
  const displayItems = [...data, ...data, ...data, ...data];

  return (
    <div className="fixed top-0 left-0 w-full h-[36px] bg-[#06070A] border-b border-white/5 overflow-hidden flex items-center whitespace-nowrap z-[60]">
      <div className="animate-marquee flex items-center gap-12">
        {displayItems.map((item, i) => (
          <Link 
            key={`${item.symbol}-${i}`} 
            href={`/tools/scanner?symbol=${item.symbol}`}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
          >
            <span className="text-[10px] font-mono uppercase text-text-tertiary group-hover:text-text-primary transition-colors">
              {item.name}
            </span>
            <span className="text-[11px] font-mono font-bold text-text-primary whitespace-nowrap">
              {item.price}
            </span>
            <span className={cn(
              "text-[9px] font-mono font-bold flex items-center gap-0.5",
              parseFloat(item.changePercent) >= 0 ? "text-profit" : "text-loss"
            )}>
              {parseFloat(item.changePercent) >= 0 ? "▲" : "▼"}
              {Math.abs(parseFloat(item.changePercent))}%
            </span>
          </Link>
        ))}
      </div>
      
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
