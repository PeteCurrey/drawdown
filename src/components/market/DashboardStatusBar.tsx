"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { MARKETS_CONFIG } from "@/lib/markets-config";

export function DashboardStatusBar() {
  const [session, setSession] = useState<{ name: string; open: boolean }>({ name: "London", open: true });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

    updateSession();
    const interval = setInterval(updateSession, 60000);

    const containerDiv = containerRef.current;
    if (containerDiv) {
      containerDiv.innerHTML = "";

      const widgetDiv = document.createElement("div");
      widgetDiv.className = "tradingview-widget-container__widget w-full h-full";
      containerDiv.appendChild(widgetDiv);

      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
      script.async = true;
      script.innerHTML = JSON.stringify({
        "symbols": MARKETS_CONFIG.map(inst => ({
          "proName": inst.ticker,
          "title": inst.displayPair
        })),
        "showSymbolLogo": false,
        "colorTheme": "light",
        "isTransparent": true,
        "displayMode": "adaptive",
        "locale": "en"
      });

      containerDiv.appendChild(script);
    }

    return () => {
      clearInterval(interval);
      if (containerDiv) {
        containerDiv.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="flex items-center w-full px-4 border-b border-border-slate/50 bg-background-surface/30 backdrop-blur-md relative z-10 h-12 overflow-hidden">
      {/* Session Indicator */}
      <div className="flex items-center gap-3 shrink-0 pr-6 border-r border-border-slate/50 h-full">
        <div className={cn(
          "w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.2)]",
          session.open ? "bg-profit animate-pulse" : "bg-text-tertiary"
        )} />
        <span className="text-[10px] font-mono uppercase tracking-widest text-text-primary whitespace-nowrap">
          {session.name}
        </span>
      </div>

      {/* TradingView Ticker Tape */}
      <div className="flex-grow h-full min-w-0" ref={containerRef} />
    </div>
  );
}
