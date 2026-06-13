"use client";

import { useEffect, useState, useRef } from "react";
import { Zap } from "lucide-react";
import { NewsSourceLogo } from "@/components/ui/NewsSourceLogo";

interface TickerItem {
  id: string;
  text: string;
  source: string;
}

export function PulseTicker() {
  const [items, setItems] = useState<TickerItem[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchTicker() {
      try {
        const res = await fetch("/api/news/feed");
        const data = await res.json();
        const tickerItems = data.slice(0, 10).map((item: any, idx: number) => ({
          id: `ticker-${idx}`,
          text: item.title,
          source: item.source
        }));
        setItems(tickerItems);
      } catch (err) {
        console.error("Ticker fetch error:", err);
      }
    }
    fetchTicker();
    const interval = setInterval(fetchTicker, 300000); // 5 mins
    return () => clearInterval(interval);
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="bg-[#F7F7F7] border-y border-mkt-bd w-full overflow-hidden h-12 flex items-center relative z-20">
      <div className="absolute left-0 top-0 bottom-0 bg-[#F7F7F7] px-4 flex items-center gap-2 z-30 border-r border-mkt-bd shadow-[10px_0_20px_rgba(0,0,0,0.5)]">
        <Zap className="w-3 h-3 text-accent animate-pulse" />
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent">Breaking</span>
      </div>
      
      <div className="flex animate-marquee whitespace-nowrap items-center hover:pause-animation">
        {[...items, ...items].map((item, idx) => (
          <div key={`${item.id}-${idx / items.length}`} className="inline-flex items-center gap-4 px-8 border-r border-mkt-bd/30">
            <NewsSourceLogo source={item.source} showText={false} size="xs" className="opacity-70 group-hover:opacity-100 transition-opacity" />
            <span className="text-[11px] font-medium text-mkt-ink uppercase tracking-wide hover:text-accent cursor-default transition-colors">
              {item.text}
            </span>
            <div className="w-1 h-1 rounded-full bg-border-slate" />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
        .pause-animation {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
