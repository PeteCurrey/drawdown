"use client";

import { useEffect, useRef } from "react";

interface TradingViewMiniChartProps {
  symbol: string;
  largeChartUrl: string;
  className?: string;
  height?: number;
}

export function TradingViewMiniChart({ 
  symbol, 
  largeChartUrl, 
  className = "w-full",
  height = 200
}: TradingViewMiniChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const containerDiv = containerRef.current;
    if (!containerDiv) return;

    containerDiv.innerHTML = "";

    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget w-full";
    widgetDiv.style.height = `${height}px`;
    containerDiv.appendChild(widgetDiv);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "symbol": symbol,
      "width": "100%",
      "height": height,
      "locale": "en",
      "dateRange": "1D",
      "colorTheme": "dark",
      "isTransparent": true,
      "autosize": false,
      "largeChartUrl": largeChartUrl
    });

    containerDiv.appendChild(script);

    return () => {
      if (containerDiv) {
        containerDiv.innerHTML = "";
      }
    };
  }, [symbol, largeChartUrl, height]);

  return (
    <div 
      className={`tradingview-widget-container ${className}`} 
      ref={containerRef}
      style={{ height: `${height}px` }}
    />
  );
}
