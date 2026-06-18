"use client";

import { useEffect, useRef } from "react";

interface TradingViewTechnicalAnalysisProps {
  symbol: string;
  className?: string;
}

export function TradingViewTechnicalAnalysis({ 
  symbol, 
  className = "w-full" 
}: TradingViewTechnicalAnalysisProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const containerDiv = containerRef.current;
    if (!containerDiv) return;

    containerDiv.innerHTML = "";

    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget w-full h-[450px]";
    containerDiv.appendChild(widgetDiv);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "interval": "1h",
      "width": "100%",
      "isTransparent": true,
      "height": 450,
      "symbol": symbol,
      "showIntervalTabs": true,
      "displayMode": "single",
      "locale": "en",
      "colorTheme": "dark"
    });

    containerDiv.appendChild(script);

    return () => {
      if (containerDiv) {
        containerDiv.innerHTML = "";
      }
    };
  }, [symbol]);

  return (
    <div 
      className={`tradingview-widget-container ${className}`} 
      ref={containerRef}
    />
  );
}
