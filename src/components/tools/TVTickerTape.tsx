"use client";

import { useEffect, useRef } from "react";

interface Props {
  className?: string;
}

export default function TVTickerTape({ className }: Props) {
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
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "symbols": [
        {"proName": "FX:GBPUSD", "title": "GBP/USD"},
        {"proName": "FX:EURUSD", "title": "EUR/USD"},
        {"proName": "FX:USDJPY", "title": "USD/JPY"},
        {"proName": "FX:GBPJPY", "title": "GBP/JPY"},
        {"proName": "OANDA:XAUUSD", "title": "Gold"},
        {"proName": "SPREADEX:UK100", "title": "FTSE 100"},
        {"proName": "FOREXCOM:SPX500", "title": "S&P 500"},
        {"proName": "COINBASE:BTCUSD", "title": "Bitcoin"}
      ],
      "showSymbolLogo": false,
      "isTransparent": false,
      "displayMode": "adaptive",
      "colorTheme": "light",
      "locale": "en"
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
