"use client";

import { useEffect, useRef } from "react";

interface Props {
  className?: string;
}

export default function TVTechnicalAnalysis({ className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const containerDiv = containerRef.current;
    if (!containerDiv) return;
    containerDiv.innerHTML = "";

    const widgetContainer = document.createElement("div");
    widgetContainer.className = "tradingview-widget-container";
    widgetContainer.style.height = "100%";
    widgetContainer.style.width = "100%";

    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget";
    widgetDiv.style.height = "100%";
    widgetDiv.style.width = "100%";

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "interval": "1h",
      "width": "100%",
      "isTransparent": true,
      "height": 425,
      "symbol": "FX:GBPUSD",
      "showIntervalTabs": true,
      "displayMode": "single",
      "locale": "en",
      "colorTheme": "light"
    });

    widgetContainer.appendChild(widgetDiv);
    widgetContainer.appendChild(script);
    containerDiv.appendChild(widgetContainer);

    return () => {
      if (containerDiv) {
        containerDiv.innerHTML = "";
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={className} 
      style={{ height: "100%", width: "100%" }} 
    />
  );
}
