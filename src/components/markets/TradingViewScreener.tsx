"use client";

import { useEffect, useRef } from "react";

interface TradingViewScreenerProps {
  screenerType: "forex" | "crypto_mkt" | "cfd";
  className?: string;
}

export function TradingViewScreener({ 
  screenerType, 
  className = "w-full h-[490px]" 
}: TradingViewScreenerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const containerDiv = containerRef.current;
    if (!containerDiv) return;

    containerDiv.innerHTML = "";

    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget w-full h-[490px]";
    containerDiv.appendChild(widgetDiv);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "width": "100%",
      "height": 490,
      "defaultColumn": "overview",
      "screener_type": screenerType,
      "displayCurrency": "USD",
      "colorTheme": "dark",
      "locale": "en",
      "isTransparent": true
    });

    containerDiv.appendChild(script);

    return () => {
      if (containerDiv) {
        containerDiv.innerHTML = "";
      }
    };
  }, [screenerType]);

  return (
    <div 
      className={`tradingview-widget-container ${className}`} 
      ref={containerRef}
    />
  );
}
