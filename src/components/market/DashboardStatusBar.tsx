"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { MARKETS_CONFIG } from "@/lib/markets-config";

export function DashboardStatusBar() {
  const [session, setSession] = useState<{ name: string; open: boolean }>({ name: "London", open: true });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateSession = () => {
      const now = new Date();
      const utcHour = now.getUTCHours();
      const utcDay  = now.getUTCDay(); // 0 = Sunday … 6 = Saturday

      // Forex market closed window:
      //   • All of Saturday UTC
      //   • Friday 21:00 UTC onwards (NY session closes)
      //   • Sunday before 22:00 UTC (Sydney/Wellington open at ~22:00 Sun UTC)
      const marketClosed =
        utcDay === 6 ||                          // Saturday
        (utcDay === 5 && utcHour >= 21) ||       // Friday evening
        (utcDay === 0 && utcHour < 22);          // Sunday before Sydney open

      if (marketClosed) {
        setSession({ name: "Market Closed", open: false });
      } else if (utcHour >= 8 && utcHour < 13) {
        // London open 08:00, NY not yet (NY opens 13:00 UTC in winter / 12:00 BST)
        setSession({ name: "London Session", open: true });
      } else if (utcHour >= 13 && utcHour < 16) {
        // Both London and NY active — highest liquidity window
        setSession({ name: "London/NY Overlap", open: true });
      } else if (utcHour >= 16 && utcHour < 21) {
        // London closed, NY active until 21:00 UTC
        setSession({ name: "New York Session", open: true });
      } else {
        // 21:00–08:00 UTC (excluding weekend) — Asia/Pacific session
        // Covers: 22:00 Sun (Sydney) through Tokyo close ~08:00 Mon–Fri
        setSession({ name: "Asia Session", open: true });
      }
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
