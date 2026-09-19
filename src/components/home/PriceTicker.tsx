"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// MARKET TICKER STRIP — MODERN PREMIUM
// ─────────────────────────────────────────────────────────────────────────────

interface TickerItem {
  symbol: string;
  displaySymbol: string;
  price: string;
  change: string;
  positive: boolean;
  isZero: boolean;
  href: string;
}

const sampleItems: TickerItem[] = [
  { symbol: "GBPUSD", displaySymbol: "GBP/USD", price: "1.2714",   change: "+0.18%", positive: true,  isZero: false, href: "/markets/forex/gbpusd" },
  { symbol: "EURUSD", displaySymbol: "EUR/USD", price: "1.0862",   change: "-0.09%", positive: false, isZero: false, href: "/markets/forex/eurusd" },
  { symbol: "USDJPY", displaySymbol: "USD/JPY", price: "157.34",   change: "+0.22%", positive: true,  isZero: false, href: "/markets/forex/usdjpy" },
  { symbol: "EURGBP", displaySymbol: "EUR/GBP", price: "0.8545",   change: "-0.12%", positive: false, isZero: false, href: "/markets/forex/eurgbp" },
  { symbol: "XAUUSD", displaySymbol: "XAU/USD", price: "2,338.40", change: "+0.41%", positive: true,  isZero: false, href: "/markets/commodities/xauusd" },
  { symbol: "US500",  displaySymbol: "S&P 500", price: "5,471.05", change: "+0.33%", positive: true,  isZero: false, href: "/markets/indices/spx" },
  { symbol: "BTCUSD", displaySymbol: "BTC/USD", price: "67,240.00", change: "-0.88%", positive: false, isZero: false, href: "/markets/crypto/btcusd" },
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
      className="w-full h-[52px] flex items-center overflow-hidden border-t border-b select-none relative z-10"
      style={{ 
        backgroundColor: "#FFFFFF", 
        borderColor: "rgba(0,0,0,0.05)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px -12px rgba(0,0,0,0.10)",
      }}
    >
      {/* Far Left Status Label: Small-caps with subtle 2s pulsing dot */}
      <div
        className="shrink-0 h-full flex items-center gap-2 px-4 sm:px-6 border-r z-20"
        style={{
          backgroundColor: "#FFFFFF",
          borderColor: "rgba(0,0,0,0.05)",
        }}
      >
        <span 
          className="w-1.5 h-1.5 rounded-full inline-block"
          style={{ 
            backgroundColor: "var(--text-tertiary)",
            animation: shouldReduce ? "none" : "pulse-opacity 2.8s ease-in-out infinite",
          }}
        />
        <span
          className="text-[10px] font-mono uppercase tracking-[0.14em] font-medium whitespace-nowrap"
          style={{ color: "var(--text-tertiary)" }}
        >
          {isLive ? "Prices Delayed 60s" : "Delayed 60s"}
        </span>
      </div>

      {/* Marquee with subtle 48px left and right edge fade masks */}
      <div 
        className="flex-grow overflow-hidden flex items-center h-full"
        style={{
          maskImage: "linear-gradient(to right, transparent 0px, black 48px, black calc(100% - 48px), transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0px, black 48px, black calc(100% - 48px), transparent 100%)",
        }}
      >
        <div
          className={shouldReduce ? "flex items-center h-full" : "flex items-center h-full animate-marquee-ticker"}
        >
          {marqueeItems.map((item, i) => {
            const glyph = item.isZero ? "" : item.positive ? "▲" : "▼";
            const changeColor = item.isZero 
              ? "var(--text-tertiary)" 
              : item.positive 
              ? "var(--market-up)" 
              : "var(--market-down)";

            return (
              <div key={i} className="flex items-center h-full shrink-0">
                {/* Clickable instrument link */}
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-5 py-2 h-[38px] my-auto rounded-[6px] transition-colors duration-120 hover:bg-[rgba(22,33,62,0.02)] cursor-pointer group"
                >
                  {/* Symbol (small caps) */}
                  <span
                    className="text-[11px] font-mono uppercase tracking-wider font-medium"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {item.displaySymbol}
                  </span>

                  {/* Price (Tabular Mono, Semibold) */}
                  <span
                    className="text-[12.5px] font-mono tabular-nums font-semibold tracking-tight"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.price}
                  </span>

                  {/* % Change (Mono, Market Colour, small glyph with 0.7 opacity) */}
                  <span
                    className="text-[11px] font-mono tabular-nums font-medium flex items-center gap-1"
                    style={{ color: changeColor }}
                  >
                    {glyph && (
                      <span className="text-[8px] opacity-70 leading-none">
                        {glyph}
                      </span>
                    )}
                    <span>{item.change}</span>
                  </span>
                </Link>

                {/* Short Centred Hairline Separator at 40% Row Height */}
                <div 
                  className="h-[20px] w-px self-center shrink-0" 
                  style={{ backgroundColor: "rgba(0,0,0,0.06)" }} 
                />
              </div>
            );
          })}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes pulse-opacity {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1.0; }
        }
        @keyframes marquee-ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee-ticker {
          animation: marquee-ticker 38s linear infinite;
        }
        .animate-marquee-ticker:hover {
          animation-play-state: paused;
        }
      `}} />
    </div>
  );
}
