"use client";

import { useEffect, useRef } from "react";

interface LobbyTickerTapeProps {
  className?: string;
}

export function LobbyTickerTape({ className = "" }: LobbyTickerTapeProps) {
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
      symbols: [
        { proName: "FOREXCOM:SPX500", title: "S&P 500" },
        { proName: "FOREXCOM:NAS100", title: "NASDAQ" },
        { proName: "FX_IDC:EURUSD", title: "EUR/USD" },
        { proName: "OANDA:XAUUSD", title: "XAU/USD" },
        { proName: "BITSTAMP:BTCUSD", title: "BTC/USD" },
        { proName: "TVC:US10Y", title: "US 10Y" },
        { proName: "TVC:DXY", title: "DXY" },
        { proName: "FX_IDC:GBPUSD", title: "GBP/USD" },
        { proName: "SPREADEX:UK100", title: "FTSE 100" }
      ],
      showSymbolLogo: false,
      isTransparent: true,
      displayMode: "adaptive",
      colorTheme: "dark",
      locale: "en"
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
      className={`tradingview-widget-container w-full h-full flex items-center overflow-hidden ${className}`}
    >
      <div className="flex items-center gap-6 animate-pulse text-xs font-mono text-white/30 px-2">
        <span>S&P 500 ···</span>
        <span>NASDAQ ···</span>
        <span>EUR/USD ···</span>
        <span>XAU/USD ···</span>
        <span>BTC/USD ···</span>
        <span>US 10Y ···</span>
        <span>DXY ···</span>
      </div>
    </div>
  );
}
