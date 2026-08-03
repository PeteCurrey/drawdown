"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// LIVE DATA PIPELINE INJECTION
//
// Dynamically fetches rates from the `/api/market/prices` endpoint with a
// 30-second interval refresh, falling back to clean static averages if offline.
// ─────────────────────────────────────────────────────────────────────────────

interface TickerItem {
  symbol: string;
  displaySymbol: string;
  price: string;
  change: string;
  positive: boolean;
}

const sampleItems: TickerItem[] = [
  { symbol: "GBPUSD", displaySymbol: "GBP/USD", price: "1.2714",  change: "+0.18%", positive: true  },
  { symbol: "EURUSD", displaySymbol: "EUR/USD", price: "1.0862",  change: "-0.09%", positive: false },
  { symbol: "USDJPY", displaySymbol: "USD/JPY", price: "157.34",  change: "+0.22%", positive: true  },
  { symbol: "EURGBP", displaySymbol: "EUR/GBP", price: "0.8545",  change: "-0.12%", positive: false },
  { symbol: "XAUUSD", displaySymbol: "XAU/USD", price: "2,338.40", change: "+0.41%", positive: true  },
  { symbol: "US500",  displaySymbol: "S&P 500", price: "5,471.05", change: "+0.33%", positive: true  },
  { symbol: "BTCUSD", displaySymbol: "BTC/USD", price: "67,240.00", change: "-0.88%", positive: false },
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
                } else if (item.symbol.includes("XAU")) {
                  formattedPrice = live.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                } else if (item.symbol === "US500") {
                  formattedPrice = live.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                } else {
                  formattedPrice = live.price.toFixed(4);
                }

                const changeVal = live.changePercent || 0;
                const formattedChange = `${changeVal >= 0 ? "+" : ""}${changeVal.toFixed(2)}%`;

                return {
                  ...item,
                  price: formattedPrice,
                  change: formattedChange,
                  positive: changeVal >= 0
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

  // Duplicate once for seamless scroll
  const marqueeItems = [...items, ...items];

  return (
    <div
      className="w-full h-[44px] flex items-center overflow-hidden border-b select-none relative z-10"
      style={{ backgroundColor: "var(--paper-0)", borderColor: "var(--line-200)" }}
    >
      {/* Dynamic Status Badge — left anchor */}
      <div
        className="absolute left-0 top-0 bottom-0 flex items-center px-4 border-r z-30"
        style={{
          backgroundColor: "var(--paper-0)",
          borderColor: "var(--line-200)",
        }}
      >
        <span
          className="text-[10px] font-mono uppercase tracking-[0.08em] px-2 py-0.5 border"
          style={{
            color: isLive ? "var(--mkt-grn)" : "var(--graphite-600)",
            borderColor: isLive ? "var(--mkt-gbd)" : "var(--line-200)",
            backgroundColor: isLive ? "var(--mkt-gbg)" : "var(--paper-100)",
            borderRadius: 0,
          }}
        >
          {isLive ? "Prices Delayed 60s" : "Sample Data"}
        </span>
      </div>

      {/* Marquee */}
      <div className="flex-grow overflow-hidden flex items-center pl-44 pr-36">
        <div
          className={shouldReduce ? "flex gap-0 items-center" : "flex items-center animate-marquee-ticker"}
        >
          {marqueeItems.map((item, i) => (
            <div key={i} className="flex items-center gap-2 pr-10 shrink-0">
              {/* Symbol */}
              <span
                className="text-[11px] font-mono tabular"
                style={{ color: "var(--graphite-600)" }}
              >
                {item.displaySymbol}
              </span>
              {/* Price */}
              <span
                className="text-[11px] font-mono tabular font-medium"
                style={{ color: "var(--ink-950)" }}
              >
                {item.price}
              </span>
              {/* Change */}
              <span
                className="text-[11px] font-mono tabular"
                style={{
                  color: item.positive ? "#18B880" : "#CE6969",
                }}
              >
                {item.change}
              </span>
              {/* Hairline separator */}
              <span
                className="pl-8"
                style={{ color: "var(--line-200)" }}
                aria-hidden="true"
              >
                |
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Right label */}
      <div
        className="absolute right-0 top-0 bottom-0 flex items-center px-4 border-l z-30"
        style={{
          backgroundColor: "var(--paper-0)",
          borderColor: "var(--line-200)",
        }}
      >
        <span
          className="text-[10px] font-mono uppercase tracking-[0.08em]"
          style={{ color: "var(--graphite-600)" }}
        >
          {isLive ? "Institutional Price Feeds" : "Not Live — For Illustration Only"}
        </span>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes marquee-ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-ticker {
          animation: marquee-ticker 40s linear infinite;
        }
      `}} />
    </div>
  );
}
