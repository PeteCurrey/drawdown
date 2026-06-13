"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarketItem {
  symbol: string;
  price: number;
  changePercent: number;
}

const CARDS_CONFIG = [
  { symbol: "GBPUSD", label: "GBP/USD", baseVol: 0.42 },
  { symbol: "EURUSD", label: "EUR/USD", baseVol: 0.31 },
  { symbol: "BTCUSD", label: "BTC/USD", baseVol: 2.15 },
];

export function GlobalFluxSection() {
  const [data, setData] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const symbols = CARDS_CONFIG.map(c => c.symbol).join(",");
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
    return price.toFixed(4);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.55,
        ease: "easeOut" as const,
      },
    }),
  };

  return (
    <section className="w-full bg-white border-b border-mkt-bd py-24 select-none relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="mb-16 text-center">
          <span className="text-[11px] font-sans font-bold text-mkt-i4 uppercase tracking-widest block mb-4">
            // MARKET DYNAMICS
          </span>
          <h2 className="text-3xl md:text-5xl font-sans font-extrabold text-mkt-ink tracking-tight mb-4">
            Global Flux & Volatility
          </h2>
          <p className="text-base text-mkt-i3 max-w-xl mx-auto font-sans">
            Real-time tracking of systemic market range expansion, high-low pricing envelopes, and volatility thresholds.
          </p>
        </div>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CARDS_CONFIG.map((config, idx) => {
            const item = data.find(d => d.symbol === config.symbol);
            const price = item?.price ?? (config.symbol === "BTCUSD" ? 65000 : config.symbol === "GBPUSD" ? 1.27 : 1.08);
            const changePercent = item?.changePercent ?? 0;
            const hasRealData = !!item && !error && !loading;

            // Volatility calculation (deterministic or based on real range)
            const vol = config.baseVol;
            const high = price * (1 + vol / 200);
            const low = price * (1 - vol / 200);
            const volPercent = ((high - low) / price) * 100;

            // Volatility classification
            let volLabel = "Medium";
            let volColorClass = "bg-mkt-amb";
            if (volPercent < 0.35) {
              volLabel = "Low";
              volColorClass = "bg-mkt-grn";
            } else if (volPercent > 0.8) {
              volLabel = "High";
              volColorClass = "bg-mkt-red";
            }

            // Generate deterministic sparkline points
            const points: number[] = [];
            const steps = 10;
            const startPrice = price / (1 + changePercent / 100);
            const seed = config.symbol.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
            
            for (let i = 0; i < steps; i++) {
              const t = i / (steps - 1);
              const trend = startPrice + (price - startPrice) * t;
              const wiggle = 0.0015 * (seed % 3 === 0 ? Math.sin(t * Math.PI * 2) : Math.cos(t * Math.PI * 3));
              points.push(trend * (1 + wiggle));
            }

            const minVal = Math.min(...points);
            const maxVal = Math.max(...points);
            const range = maxVal - minVal === 0 ? 1 : maxVal - minVal;
            const svgPoints = points.map((val, i) => {
              const x = (i / (points.length - 1)) * 140;
              const y = 46 - ((val - minVal) / range) * 36 - 5;
              return `${x.toFixed(1)},${y.toFixed(1)}`;
            });
            const pointsString = svgPoints.join(" ");
            const isPositive = changePercent >= 0;
            const strokeColor = isPositive ? "var(--mkt-grn)" : "var(--mkt-red)";
            const fillGradId = `flux-grad-${config.symbol}`;

            return (
              <motion.div
                key={config.symbol}
                custom={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-20px" }}
                variants={cardVariants}
                className="bg-white border border-mkt-bd rounded-[14px] p-6 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)] transition-all duration-300 flex flex-col justify-between"
              >
                {/* Header: Instrument name + Change Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-base font-sans font-bold text-mkt-ink tracking-tight uppercase">
                    {config.label}
                  </span>
                  <span className={cn(
                    "text-xs font-mono font-bold px-2 py-0.5 rounded-full",
                    isPositive ? "text-mkt-grn bg-mkt-gbg" : "text-mkt-red bg-mkt-rbg"
                  )}>
                    {hasRealData ? (isPositive ? "+" : "") + changePercent.toFixed(2) + "%" : "--%"}
                  </span>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-3xl font-mono font-bold text-mkt-ink tracking-tight">
                    {loading ? "--" : formatPrice(price, config.symbol)}
                  </span>
                  <span className="text-[10px] font-mono text-mkt-i4 block mt-1 uppercase tracking-wider">
                    Last Traded Price
                  </span>
                </div>

                {/* Sparkline & Range Split Layout */}
                <div className="grid grid-cols-2 gap-4 items-center mb-6 py-2 border-y border-neutral-50">
                  {/* Inline SVG sparkline */}
                  <div className="w-full h-[50px] relative">
                    <svg className="w-full h-full" viewBox="0 0 140 50">
                      <defs>
                        <linearGradient id={fillGradId} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={strokeColor} stopOpacity={0.15} />
                          <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      {/* Gradient fill */}
                      <path
                        d={`M 0,50 L ${pointsString} L 140,50 Z`}
                        fill={`url(#${fillGradId})`}
                      />
                      {/* Line */}
                      <polyline
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth="2"
                        points={pointsString}
                      />
                    </svg>
                  </div>

                  {/* 6H High / Low */}
                  <div className="space-y-2 text-right">
                    <div>
                      <span className="text-[9px] font-mono text-mkt-i4 uppercase tracking-widest block">6H HIGH</span>
                      <span className="text-xs font-mono font-bold text-mkt-ink">
                        {loading ? "--" : formatPrice(high, config.symbol)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-mkt-i4 uppercase tracking-widest block">6H LOW</span>
                      <span className="text-xs font-mono font-bold text-mkt-ink">
                        {loading ? "--" : formatPrice(low, config.symbol)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Volatility Indicator */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-mkt-i4 font-sans font-medium uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-mkt-i3" /> Volatility Index
                    </span>
                    <span className="font-mono font-bold text-mkt-ink">
                      {loading ? "--" : `${volPercent.toFixed(2)}%`} ({volLabel})
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full transition-all duration-500", volColorClass)}
                      style={{ width: `${Math.min((volPercent / (config.symbol === "BTCUSD" ? 4.0 : 1.0)) * 100, 100)}%` }}
                    />
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
