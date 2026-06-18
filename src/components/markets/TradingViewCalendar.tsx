"use client";

import { useEffect, useRef } from "react";

interface TradingViewCalendarProps {
  countryFilter: string;
  className?: string;
}

export function TradingViewCalendar({ 
  countryFilter, 
  className = "w-full" 
}: TradingViewCalendarProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const containerDiv = containerRef.current;
    if (!containerDiv) return;

    containerDiv.innerHTML = "";

    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget w-full h-[550px]";
    containerDiv.appendChild(widgetDiv);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "colorTheme": "dark",
      "isTransparent": true,
      "width": "100%",
      "height": 550,
      "locale": "en",
      "importanceFilter": "0,1",
      "countryFilter": countryFilter
    });

    containerDiv.appendChild(script);

    return () => {
      if (containerDiv) {
        containerDiv.innerHTML = "";
      }
    };
  }, [countryFilter]);

  return (
    <div 
      className={`tradingview-widget-container ${className}`} 
      ref={containerRef}
    />
  );
}
