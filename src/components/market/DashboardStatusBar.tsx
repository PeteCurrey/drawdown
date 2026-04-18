"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Sparkline } from "./Sparkline";

interface MarketItem {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
  sparkline?: number[];
  high?: string;
  low?: string;
}

export function DashboardStatusBar() {
  const [data, setData] = useState<MarketItem[]>([]);
  const [session, setSession] = useState<{ name: string; open: boolean }>({ name: "London", open: true });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/market/prices");
        const json = await res.json();
        if (Array.isArray(json)) {
          // Add random sparkline data and high/low for UI demo
          const augmented = json.map(item => {
            const p = parseFloat(item.price);
            const variation = p * 0.005;
            return {
              ...item,
              sparkline: Array.from({ length: 15 }, () => p + (Math.random() - 0.5) * variation),
              high: (p * 1.002).toFixed(item.symbol.includes("/") ? 4 : 2),
              low: (p * 0.998).toFixed(item.symbol.includes("/") ? 4 : 2),
            };
          });
          setData(augmented);
        }
      } catch (err) {
        console.error("Dashboard status fetch error:", err);
      }
    };

    const updateSession = () => {
      const gmtHour = new Date().getUTCHours();
      // London: 08:00 - 16:00
      // NY: 13:00 - 21:00
      // Tokyo: 00:00 - 08:00
      if (gmtHour >= 8 && gmtHour < 13) setSession({ name: "London Session", open: true });
      else if (gmtHour >= 13 && gmtHour < 16) setSession({ name: "London/NY Overlap", open: true });
      else if (gmtHour >= 16 && gmtHour < 21) setSession({ name: "New York Session", open: true });
      else if (gmtHour >= 22 || gmtHour < 7) setSession({ name: "Tokyo Session", open: true });
      else setSession({ name: "Market Closed", open: false });
    };

    fetchData();
    updateSession();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-6 px-4 py-3 bg-background-elevated border-b border-border-slate overflow-x-auto scrollbar-hide theme-transition">
      {/* Session Indicator */}
      <div className="flex items-center gap-3 shrink-0 pr-6 border-r border-border-slate">
        <div className={cn(
          "w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]",
          session.open ? "bg-profit animate-pulse" : "bg-text-tertiary"
        )} />
        <span className="text-[10px] font-mono uppercase tracking-widest text-text-primary whitespace-nowrap">
          {session.name}
        </span>
      </div>

      {/* Instruments */}
      <div className="flex items-center gap-10">
        {data.map((item) => (
          <div key={item.symbol} className="flex items-center gap-4 shrink-0">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono uppercase text-text-tertiary">{item.name}</span>
                <span className={cn(
                  "text-[9px] font-mono font-bold",
                  parseFloat(item.changePercent) >= 0 ? "text-profit" : "text-loss"
                )}>
                  {parseFloat(item.changePercent) >= 0 ? "▲" : "▼"}
                  {Math.abs(parseFloat(item.changePercent))}%
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-text-primary leading-none">
                {item.price}
              </span>
            </div>

            {/* Range Bar */}
            <div className="flex flex-col gap-1 w-20">
               <div className="flex justify-between items-center text-[7px] font-mono text-text-tertiary uppercase">
                 <span>L: {item.low}</span>
                 <span>H: {item.high}</span>
               </div>
               <div className="h-0.5 w-full bg-white/5 relative overflow-hidden">
                 <div className="absolute top-0 bottom-0 left-[20%] right-[30%] bg-white/20" />
               </div>
            </div>

            {item.sparkline && (
              <Sparkline 
                data={item.sparkline} 
                color={parseFloat(item.changePercent) >= 0 ? "#00E676" : "#FF3D57"} 
                width={50}
                height={16}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
