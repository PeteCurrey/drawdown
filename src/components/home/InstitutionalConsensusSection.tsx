"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarketItem {
  symbol: string;
  price: number;
  changePercent: number;
}

const CONSENSUS_CONFIG = [
  { 
    symbol: "GBPUSD", 
    label: "GBP/USD", 
    signal: "BUY", 
    signalColor: "text-mkt-grn bg-mkt-grn/10 border-mkt-grn/20",
    buyPct: 72, 
    sellPct: 28,
    fallbackPrice: 1.2745,
    fallbackChange: 0.18
  },
  { 
    symbol: "XAUUSD", 
    label: "XAU/USD", 
    signal: "STRONG BUY", 
    signalColor: "text-mkt-grn bg-mkt-grn/15 border-mkt-grn/30",
    buyPct: 85, 
    sellPct: 15,
    fallbackPrice: 2345.50,
    fallbackChange: 1.24
  },
  { 
    symbol: "EURUSD", 
    label: "EUR/USD", 
    signal: "HOLD", 
    signalColor: "text-mkt-amb bg-mkt-amb/10 border-mkt-amb/20",
    buyPct: 51, 
    sellPct: 49,
    fallbackPrice: 1.0852,
    fallbackChange: -0.04
  },
  { 
    symbol: "BTCUSD", 
    label: "BTC/USD", 
    signal: "STRONG BUY", 
    signalColor: "text-mkt-grn bg-mkt-grn/15 border-mkt-grn/30",
    buyPct: 91, 
    sellPct: 9,
    fallbackPrice: 67200.00,
    fallbackChange: 3.85
  }
];

export function InstitutionalConsensusSection() {
  const [data, setData] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const symbols = CONSENSUS_CONFIG.map(c => c.symbol).join(",");
        const res = await fetch(`/api/market/prices?symbols=${symbols}`);
        if (!res.ok) throw new Error();
        const prices = await res.json();
        if (Array.isArray(prices)) {
          setData(prices);
          setError(false);
        } else {
          throw new Error();
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number | null | undefined, symbol: string) => {
    if (price == null || typeof price !== "number" || Number.isNaN(price)) {
      return "--";
    }
    if (symbol.includes("BTC")) {
      return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    if (symbol.includes("XAU")) {
      return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return price.toFixed(4);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.5,
        ease: "easeOut" as const
      }
    })
  };

  return (
    <section className="w-full bg-white border-b border-mkt-bd py-24 select-none relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="mb-16 text-center">
          <span className="text-[11px] font-sans font-bold text-mkt-i4 uppercase tracking-widest block mb-4">
            // ACCUMULATION MATRIX
          </span>
          <h2 className="text-3xl md:text-5xl font-sans font-extrabold text-mkt-ink tracking-tight mb-4">
            Institutional Consensus
          </h2>
          <p className="text-base text-mkt-i3 max-w-xl mx-auto font-sans">
            Aggregate long/short ratios, positioning grids, and daily directional bias across primary assets.
          </p>
        </div>

        {/* 4 Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CONSENSUS_CONFIG.map((config, idx) => {
            const item = data.find(d => d.symbol === config.symbol);
            // Use live data if returned and valid; otherwise fallback to realistic values
            const price = (item && !Number.isNaN(item.price)) ? item.price : config.fallbackPrice;
            const changePercent = (item && !Number.isNaN(item.price)) ? item.changePercent : config.fallbackChange;
            const isPositive = changePercent >= 0;

            return (
              <motion.div
                key={config.symbol}
                custom={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-20px" }}
                variants={cardVariants}
                className="bg-white border border-mkt-bd rounded-[14px] p-6 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Asset and Signal Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm font-sans font-bold text-mkt-ink tracking-tight uppercase">
                      {config.label}
                    </span>
                    <span className={cn(
                      "text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider",
                      config.signalColor
                    )}>
                      {config.signal}
                    </span>
                  </div>

                  {/* Price info */}
                  <div className="mb-6">
                    <span className="text-2xl font-mono font-bold text-mkt-ink tracking-tight block">
                      {loading && !item ? "--" : formatPrice(price, config.symbol)}
                    </span>
                    <span className={cn(
                      "text-[10px] font-mono font-semibold mt-1 inline-block",
                      isPositive ? "text-mkt-grn" : "text-mkt-red"
                    )}>
                      {isPositive ? "▲" : "▼"} {Math.abs(changePercent).toFixed(2)}%
                    </span>
                  </div>
                </div>

                {/* Progress bars (Buy % and Sell %) */}
                <div className="space-y-4 pt-4 border-t border-mkt-bd">
                  {/* Buy Progress */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-sans font-medium text-mkt-i3 uppercase tracking-wider">L/S Buy Ratio</span>
                      <span className="font-mono font-bold text-mkt-grn">{config.buyPct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-full bg-mkt-grn rounded-full" style={{ width: `${config.buyPct}%` }} />
                    </div>
                  </div>

                  {/* Sell Progress */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-sans font-medium text-mkt-i3 uppercase tracking-wider">L/S Sell Ratio</span>
                      <span className="font-mono font-bold text-mkt-red">{config.sellPct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-full bg-mkt-red rounded-full" style={{ width: `${config.sellPct}%` }} />
                    </div>
                  </div>
                </div>

                {/* Bottom Source Note */}
                <div className="mt-6 flex items-center gap-1.5 text-[9px] font-sans text-mkt-i3 uppercase tracking-widest">
                  <Users className="w-3 h-3" /> Consensus Ratio
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
