"use client";

import { useReducedMotion } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// SAMPLE DATA STATE
//
// The live data pipeline is tracked as a separate, unresolved work item.
// This component ships a clearly labelled static sample-data state.
// When the data pipe is fixed, replace sampleItems with a live fetch and
// update the badge from SAMPLE DATA → Prices delayed 60s.
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

// Duplicate once for seamless scroll
const marqueeItems = [...sampleItems, ...sampleItems];

export function PriceTicker() {
  const shouldReduce = useReducedMotion();

  return (
    <div
      className="w-full h-[44px] flex items-center overflow-hidden border-b select-none relative z-10"
      style={{ backgroundColor: "var(--paper-0)", borderColor: "var(--line-200)" }}
    >
      {/* Sample-data badge — left anchor */}
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
            color: "var(--graphite-600)",
            borderColor: "var(--line-200)",
            backgroundColor: "var(--paper-100)",
            borderRadius: 0,
          }}
        >
          Sample data
        </span>
      </div>

      {/* Marquee */}
      <div className="flex-grow overflow-hidden flex items-center pl-40 pr-36">
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

      {/* Right label */}
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
          Not live — for illustration only
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
