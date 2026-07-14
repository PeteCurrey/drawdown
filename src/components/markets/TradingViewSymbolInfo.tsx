"use client";

import { useEffect, useRef } from "react";

interface TradingViewSymbolInfoProps {
  symbol: string;
  largeChartUrl?: string;
  className?: string;
}

export function TradingViewSymbolInfo({ 
  symbol, 
  largeChartUrl, 
  className = "w-full" 
}: TradingViewSymbolInfoProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const containerDiv = containerRef.current;
    if (!containerDiv) return;

    containerDiv.innerHTML = "";

    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget w-full";
    containerDiv.appendChild(widgetDiv);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "symbol": symbol,
      "width": "100%",
      "locale": "en",
      "colorTheme": "dark",
      "isTransparent": true,
      ...(largeChartUrl ? { "largeChartUrl": largeChartUrl } : {})
    });

    containerDiv.appendChild(script);

    return () => {
      if (containerDiv) {
        containerDiv.innerHTML = "";
      }
    };
  }, [symbol, largeChartUrl]);

  return (
    <div 
      className={`tradingview-widget-container ${className}`} 
      ref={containerRef}
    />
  );
}
