"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { MoveUpRight, MoveDownRight } from "lucide-react";

interface TickerItem {
  symbol: string;
  price: number;
  changePercent: number;
}

const DEFAULT_SYMBOLS = [
  "FTSE", "SPX", "IXIC", "XAU/USD", "GBP/USD", "EUR/USD", "USD/JPY", "BTC/USD", "ETH/USD", "XRP/USD"
];

export function MarketTicker() {
  const [data, setData] = useState<TickerItem[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch(`/api/market/prices?symbols=${DEFAULT_SYMBOLS.join(",")}`);
        if (!res.ok) throw new Error();
        const prices = await res.json();
        setData(prices);
        setError(false);
      } catch (err) {
        setError(true);
      }
    }

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); // 30s cache match
    return () => clearInterval(interval);
  }, []);

  // Format data for the scrolling marquee (duplicate for seamless loop)
  const items = [...data, ...data, ...data];

  if (data.length === 0 && !error) return <div className="h-8 bg-[#06070A] w-full" />;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-8 bg-[#06070A] border-b border-white/5 flex items-center overflow-hidden pointer-events-none select-none">
      <div className="flex animate-marquee whitespace-nowrap items-center">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-4 px-8 border-r border-white/5 last:border-r-0">
            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#E4E2DD]">
              {item.symbol}
            </span>
            <span className="text-[10px] font-mono text-[#E4E2DD]/70">
              {item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className={cn(
              "text-[9px] font-mono flex items-center gap-0.5 font-bold",
              item.changePercent >= 0 ? "text-[#00E676]" : "text-[#FF3D57]"
            )}>
              {item.changePercent >= 0 ? (
                <MoveUpRight className="w-2.5 h-2.5" />
              ) : (
                <MoveDownRight className="w-2.5 h-2.5" />
              )}
              {Math.abs(item.changePercent).toFixed(2)}%
            </span>
            {error && i === 0 && (
              <span className="text-[8px] font-mono text-white/30 ml-2 italic">(delayed)</span>
            )}
          </div>
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
