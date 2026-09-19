"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// MARKET TICKER STRIP
//
// Dense financial data strip fetching quotes from `/api/market/prices` every
// 30 seconds with clean tabular monospace numerals and hairline instrument dividers.
// ─────────────────────────────────────────────────────────────────────────────

interface TickerItem {
  symbol: string;
  displaySymbol: string;
  price: string;
  change: string;
  positive: boolean;
  isZero: boolean;
}

const sampleItems: TickerItem[] = [
  { symbol: "GBPUSD", displaySymbol: "GBP/USD", price: "1.2714",   change: "+0.18%", positive: true,  isZero: false },
  { symbol: "EURUSD", displaySymbol: "EUR/USD", price: "1.0862",   change: "-0.09%", positive: false, isZero: false },
  { symbol: "USDJPY", displaySymbol: "USD/JPY", price: "157.34",   change: "+0.22%", positive: true,  isZero: false },
  { symbol: "EURGBP", displaySymbol: "EUR/GBP", price: "0.8545",   change: "-0.12%", positive: false, isZero: false },
  { symbol: "XAUUSD", displaySymbol: "XAU/USD", price: "2,338.40", change: "+0.41%", positive: true,  isZero: false },
  { symbol: "US500",  displaySymbol: "S&P 500", price: "5,471.05", change: "+0.33%", positive: true,  isZero: false },
  { symbol: "BTCUSD", displaySymbol: "BTC/USD", price: "67,240.00", change: "-0.88%", positive: false, isZero: false },
];

export function PriceTicker() {
  const shouldReduce = useReducedMotion();
  const [items, setItems] = useState<TickerItem[]>(sampleItems);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let active = true;
    async function fetchPrices() {
      try {
        const symbols = sampleItems.map(item => item.symbol).join(",");
        const res = await fetch(`/api/market/prices?symbols=${symbols}`);
        if (res.ok && active) {
          const livePrices = await res.json();
          if (Array.isArray(livePrices) && livePrices.length > 0) {
            const updated = sampleItems.map(item => {
              const live = livePrices.find((p: any) => p.symbol === item.symbol);
              if (live && live.price !== undefined && !Number.isNaN(live.price)) {
                let formattedPrice = String(live.price);
                if (item.symbol.includes("BTC")) {
                  formattedPrice = live.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                } else if (item.symbol.includes("XAU") || item.symbol === "US500") {
                  formattedPrice = live.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                } else if (item.symbol === "USDJPY" || item.symbol.includes("JPY")) {
                  formattedPrice = live.price.toFixed(2);
                } else {
                  formattedPrice = live.price.toFixed(4);
                }

                const changeVal = live.changePercent || 0;
                const isZero = Math.abs(changeVal) < 0.0001;
                const formattedChange = `${changeVal > 0 ? "+" : ""}${changeVal.toFixed(2)}%`;

                return {
                  ...item,
                  price: formattedPrice,
                  change: formattedChange,
                  positive: changeVal > 0,
                  isZero
                };
              }
              return item;
            });
            setItems(updated);
            setIsLive(true);
          }
        }
      } catch (err) {
        console.error("Failed to fetch live prices for ticker:", err);
      }
    }

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); // refresh every 30 seconds
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  // Duplicate items for seamless continuous marquee loop
  const marqueeItems = [...items, ...items, ...items];

  return (
    <div
      className="w-full h-[34px] flex items-center overflow-hidden border-b select-none relative z-10"
      style={{ 
        backgroundColor: "var(--surface-base)", 
        borderColor: "var(--border-subtle)",
      }}
    >
      {/* Left status label - plain inline text in --text-tertiary, no pill, no border-radius */}
      <div
        className="shrink-0 h-full flex items-center px-4 border-r z-20"
        style={{
          backgroundColor: "var(--surface-base)",
          borderColor: "var(--border-subtle)",
        }}
      >
        <span
          className="text-[9.5px] font-mono uppercase tracking-[0.12em] font-medium"
          style={{ color: "var(--text-tertiary)" }}
        >
          {isLive ? "Prices Delayed 60s" : "Delayed 60s"}
        </span>
      </div>

      {/* Marquee with subtle right edge fade */}
      <div 
        className="flex-grow overflow-hidden flex items-center h-full"
        style={{
          maskImage: "linear-gradient(to right, black calc(100% - 32px), transparent)",
          WebkitMaskImage: "linear-gradient(to right, black calc(100% - 32px), transparent)",
        }}
      >
        <div
          className={shouldReduce ? "flex items-center h-full" : "flex items-center h-full animate-marquee-ticker"}
        >
          {marqueeItems.map((item, i) => {
            const glyph = item.isZero ? "" : item.positive ? "▲ " : "▼ ";
            const changeColor = item.isZero 
              ? "var(--text-tertiary)" 
              : item.positive 
              ? "var(--market-up)" 
              : "var(--market-down)";

            return (
              <div 
                key={i} 
                className="flex items-center gap-2 px-3.5 h-full border-r shrink-0"
                style={{ borderColor: "var(--border-subtle)" }}
              >
                {/* Symbol */}
                <span
                  className="text-[11px] font-mono font-medium tracking-tight"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {item.displaySymbol}
                </span>

                {/* Price (Tabular Mono) */}
                <span
                  className="text-[11px] font-mono tabular-nums font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {item.price}
                </span>

                {/* % Change (Direct color, optional triangle glyph, zero pill/fill) */}
                <span
                  className="text-[10.5px] font-mono tabular-nums font-medium"
                  style={{ color: changeColor }}
                >
                  {glyph}{item.change}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes marquee-ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee-ticker {
          animation: marquee-ticker 35s linear infinite;
        }
        .animate-marquee-ticker:hover {
          animation-play-state: paused;
        }
      `}} />
    </div>
  );
}
