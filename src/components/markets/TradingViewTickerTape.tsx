"use client";

import { useEffect, useRef } from "react";
import { MARKETS_CONFIG } from "@/lib/markets-config";

export function TradingViewTickerTape() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const containerDiv = containerRef.current;
    if (!containerDiv) return;

    containerDiv.innerHTML = "";

    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget w-full";
    containerDiv.appendChild(widgetDiv);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "symbols": MARKETS_CONFIG.map(inst => ({
        "proName": inst.ticker,
        "title": inst.displayPair
      })),
      "showSymbolLogo": true,
      "colorTheme": "dark",
      "isTransparent": true,
      "displayMode": "adaptive",
      "locale": "en"
    });

    containerDiv.appendChild(script);

    return () => {
      if (containerDiv) {
        containerDiv.innerHTML = "";
      }
    };
  }, []);

  return (
    <div 
      className="tradingview-widget-container w-full" 
      ref={containerRef}
    />
  );
}
