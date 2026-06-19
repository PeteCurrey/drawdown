"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarketPrice {
  symbol: string;
  price: number;
  changePercent: number;
}

interface ConsensusItem {
  symbol: string;
  score: number;
  verdict: string;
  rsi: string;
  trend: string;
}

const ASSET_CONFIG = [
  { symbol: "GBPUSD", label: "GBP/USD", fallbackPrice: 1.2745, fallbackChange: 0.18, fallbackScore: 72, fallbackVerdict: "Buy" },
  { symbol: "XAUUSD", label: "XAU/USD", fallbackPrice: 2345.50, fallbackChange: 1.24, fallbackScore: 85, fallbackVerdict: "Strong Buy" },
  { symbol: "EURUSD", label: "EUR/USD", fallbackPrice: 1.0852, fallbackChange: -0.04, fallbackScore: 51, fallbackVerdict: "Hold" },
  { symbol: "BTCUSD", label: "BTC/USD", fallbackPrice: 67200.00, fallbackChange: 3.85, fallbackScore: 91, fallbackVerdict: "Strong Buy" }
];

export function InstitutionalConsensusSection() {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [consensus, setConsensus] = useState<ConsensusItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch prices and consensus in parallel
  useEffect(() => {
    let active = true;
    async function fetchData() {
      try {
        const symbolList = ASSET_CONFIG.map(c => c.symbol).join(",");
        const [priceRes, conRes] = await Promise.all([
          fetch(`/api/market/prices?symbols=${symbolList}`),
          fetch("/api/market/consensus")
        ]);
        
        const priceData = priceRes.ok ? await priceRes.json() : [];
        const conData = conRes.ok ? await conRes.json() : [];

        if (active) {
          if (Array.isArray(priceData)) setPrices(priceData);
          if (Array.isArray(conData)) setConsensus(conData);
        }
      } catch (err) {
        console.error("Error loading consensus data:", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchData();
    return () => {
      active = false;
    };
  }, []);

  const formatPrice = (price: number | null | undefined, symbol: string) => {
    if (price == null || typeof price !== "number" || Number.isNaN(price)) {
      return "--";
    }
    if (symbol.includes("BTC") || symbol.includes("XAU")) {
      return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return price.toFixed(4);
  };

  const getSignalColors = (score: number) => {
    if (score >= 75) return "text-mkt-grn bg-mkt-grn/15 border-mkt-grn/30";
    if (score >= 60) return "text-mkt-grn bg-mkt-grn/10 border-mkt-grn/20";
    if (score <= 25) return "text-mkt-red bg-mkt-red/15 border-red-350";
    if (score <= 40) return "text-mkt-red bg-mkt-red/10 border-red-200";
    return "text-mkt-amb bg-amber-50 border-amber-250";
  };

  // Helper to normalize symbol matching (e.g. "GBPUSD" vs "GBP/USD")
  const matchSymbol = (configSymbol: string, dataSymbol: string) => {
    const clean = (s: string) => s.replace(/[^a-zA-Z]/g, "").toLowerCase();
    return clean(configSymbol) === clean(dataSymbol);
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
          <p className="text-xs text-mkt-i4 max-w-2xl mx-auto font-sans mt-4 leading-relaxed border-t border-neutral-100 pt-4">
            This consensus dashboard tracks the directional bias of primary global assets. By evaluating the last 50 daily candles of each instrument, the matrix calculates its 20-period Exponential Moving Average (EMA) and 14-period Relative Strength Index (RSI). A consensus buy percentage above 60% signals an active trend-following buy bias, while scores below 40% suggest structural sell pressure.
          </p>
        </div>

        {/* 4 Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ASSET_CONFIG.map((config, idx) => {
            const priceItem = prices.find(p => matchSymbol(config.symbol, p.symbol));
            const conItem = consensus.find(c => matchSymbol(config.symbol, c.symbol));

            const price = priceItem && !Number.isNaN(priceItem.price) ? priceItem.price : config.fallbackPrice;
            const changePercent = priceItem && !Number.isNaN(priceItem.changePercent) ? priceItem.changePercent : config.fallbackChange;
            const score = conItem ? conItem.score : config.fallbackScore;
            const verdict = conItem ? conItem.verdict : config.fallbackVerdict;

            const isPositive = changePercent >= 0;
            const buyPct = score;
            const sellPct = 100 - score;

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
                      getSignalColors(score)
                    )}>
                      {verdict}
                    </span>
                  </div>

                  {/* Price info */}
                  <div className="mb-6">
                    <span className="text-2xl font-mono font-bold text-mkt-ink tracking-tight block">
                      {loading && !priceItem ? "--" : formatPrice(price, config.symbol)}
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
                      <span className="font-mono font-bold text-mkt-grn">{buyPct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-full bg-mkt-grn rounded-full transition-all duration-500" style={{ width: `${buyPct}%` }} />
                    </div>
                  </div>

                  {/* Sell Progress */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-sans font-medium text-mkt-i3 uppercase tracking-wider">L/S Sell Ratio</span>
                      <span className="font-mono font-bold text-mkt-red">{sellPct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-full bg-mkt-red rounded-full transition-all duration-500" style={{ width: `${sellPct}%` }} />
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
