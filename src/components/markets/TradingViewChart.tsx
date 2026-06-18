"use client";

import { useEffect, useRef } from "react";

interface TradingViewChartProps {
  symbol: string;
  className?: string;
}

export function TradingViewChart({ symbol, className = "h-full w-full" }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const containerDiv = containerRef.current;
    if (!containerDiv) return;

    // Reset container
    containerDiv.innerHTML = "";

    // Create target widget div
    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget h-full w-full";
    containerDiv.appendChild(widgetDiv);

    // Create embed script
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": symbol,
      "interval": "60",
      "timezone": "Europe/London",
      "theme": "dark",
      "style": "1",
      "locale": "en",
      "backgroundColor": "rgba(10, 10, 10, 1)",
      "gridColor": "rgba(255, 255, 255, 0.04)",
      "hide_top_toolbar": false,
      "hide_legend": false,
      "save_image": false,
      "calendar": false,
      "hide_volume": false,
      "support_host": "https://www.tradingview.com"
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
