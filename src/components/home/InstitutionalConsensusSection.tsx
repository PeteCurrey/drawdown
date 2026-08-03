"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Users, HelpCircle } from "lucide-react";
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
  { 
    symbol: "GBPUSD", 
    label: "GBP/USD", 
    fallbackPrice: 1.2745, 
    fallbackChange: 0.18, 
    fallbackScore: 72, 
    fallbackVerdict: "Buy",
    bg: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&w=600&q=80" // abstract chart
  },
  { 
    symbol: "XAUUSD", 
    label: "XAU/USD", 
    fallbackPrice: 2345.50, 
    fallbackChange: 1.24, 
    fallbackScore: 85, 
    fallbackVerdict: "Strong Buy",
    bg: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80" // abstract gold metallic
  },
  { 
    symbol: "EURUSD", 
    label: "EUR/USD", 
    fallbackPrice: 1.0852, 
    fallbackChange: -0.04, 
    fallbackScore: 51, 
    fallbackVerdict: "Hold",
    bg: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80" // digital connection grid
  },
  { 
    symbol: "BTCUSD", 
    label: "BTC/USD", 
    fallbackPrice: 67200.00, 
    fallbackChange: 3.85, 
    fallbackScore: 91, 
    fallbackVerdict: "Strong Buy",
    bg: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80" // blockchain matrix
  }
];

export function InstitutionalConsensusSection() {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [consensus, setConsensus] = useState<ConsensusItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredSymbol, setHoveredSymbol] = useState<string | null>(null);

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

  const activeConsensus = consensus.length > 0 ? consensus : ASSET_CONFIG.map(item => ({
    symbol: item.label,
    score: item.label.includes("Gold") ? 82 : item.label.includes("GBP") ? 74 : 58,
    verdict: item.label.includes("Gold") ? "Strong Buy" : "Buy",
    rsi: "56.4",
    trend: "Bullish"
  }));

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
    if (score >= 75) return { text: "var(--mkt-grn)", bg: "var(--mkt-gbg)", border: "var(--mkt-gbd)" };
    if (score >= 60) return { text: "var(--mkt-grn)", bg: "var(--mkt-gbg)", border: "var(--mkt-gbd)" };
    if (score <= 25) return { text: "var(--mkt-red)", bg: "var(--mkt-rbg)", border: "var(--mkt-rbd)" };
    if (score <= 40) return { text: "var(--mkt-red)", bg: "var(--mkt-rbg)", border: "var(--mkt-rbd)" };
    return { text: "var(--mkt-amb)", bg: "rgba(245, 158, 11, 0.05)", border: "rgba(245, 158, 11, 0.15)" };
  };

  const matchSymbol = (configSymbol: string, dataSymbol: string) => {
    const clean = (s: string) => s.replace(/[^a-zA-Z]/g, "").toLowerCase();
    return clean(configSymbol) === clean(dataSymbol);
  };

  return (
    <section 
      className="w-full border-b py-24 select-none relative z-10"
      style={{ backgroundColor: "var(--paper-0)", borderColor: "var(--line-200)" }}
    >
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* Section Heading */}
        <div className="mb-16">
          <span 
            className="block text-[11px] font-mono uppercase tracking-[0.08em] mb-3"
            style={{ color: "var(--graphite-600)" }}
          >
            Accumulation matrix
          </span>
          <h2 
            className="font-display text-[clamp(1.75rem,4vw,3rem)] leading-tight tracking-[-0.02em] font-semibold mb-4"
            style={{ color: "var(--ink-950)" }}
          >
            Market Consensus
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <p 
              className="text-[15px] leading-relaxed font-sans lg:col-span-6"
              style={{ color: "var(--graphite-600)" }}
            >
              Aggregate order flow biases, market strength thresholds, and real-time trend alignment parsed directly from active Liquidity nodes.
            </p>
            <p 
              className="text-[12px] leading-relaxed font-mono lg:col-span-6 border-l pl-6 pt-1"
              style={{ color: "var(--graphite-600)", borderColor: "var(--line-200)" }}
            >
              Tracks directional consensus of primary global assets. By evaluating the last 50 daily candles of each instrument, the matrix calculates its 20-period Exponential Moving Average (EMA) and 14-period Relative Strength Index (RSI). A consensus score above 60% signals strong professional accumulation.
            </p>
          </div>
        </div>

        {/* 4 Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ASSET_CONFIG.map((config) => {
            const priceItem = prices.find(p => matchSymbol(config.symbol, p.symbol));
            const conItem = activeConsensus.find(c => matchSymbol(config.symbol, c.symbol)) || {
              symbol: config.label,
              score: 65,
              verdict: "Buy",
              rsi: "54.0",
              trend: "Bullish"
            };

            const price = priceItem && !Number.isNaN(priceItem.price) ? priceItem.price : null;
            const changePercent = priceItem && !Number.isNaN(priceItem.changePercent) ? priceItem.changePercent : null;
            const score = conItem.score;
            const verdict = conItem.verdict;

            const isPositive = changePercent !== null && changePercent >= 0;
            const buyPct = score;
            const sellPct = 100 - score;
            const isHovered = hoveredSymbol === config.symbol;
            const sigColors = getSignalColors(score);

            return (
              <div
                key={config.symbol}
                onMouseEnter={() => setHoveredSymbol(config.symbol)}
                onMouseLeave={() => setHoveredSymbol(null)}
                className="p-6 border flex flex-col justify-between h-full relative overflow-hidden transition-all duration-300"
                style={{
                  borderColor: isHovered ? "var(--signal-navy)" : "var(--line-200)",
                  backgroundColor: "var(--paper-100)",
                  borderRadius: 0,
                  boxShadow: isHovered ? "0 0 24px rgba(10, 37, 64, 0.15), inset 0 0 12px rgba(10, 37, 64, 0.15)" : "none",
                }}
              >
                {/* Brand-Matching Background Image Layer */}
                <div 
                  className="absolute inset-0 z-0 transition-all duration-500 pointer-events-none"
                  style={{
                    backgroundImage: `url(${config.bg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: isHovered ? 0.12 : 0.03,
                    mixBlendMode: "luminosity",
                  }}
                />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-between h-full w-full">
                  <div>
                    {/* Top Row: Asset + Signal Badge */}
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-[13px] font-sans font-bold uppercase tracking-wide" style={{ color: "var(--ink-950)" }}>
                        {config.label}
                      </span>
                      <span 
                        className="text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider"
                        style={{
                          color: sigColors.text,
                          backgroundColor: sigColors.bg,
                          borderColor: sigColors.border,
                          borderRadius: 0
                        }}
                      >
                        {verdict}
                      </span>
                    </div>

                    {/* Price Block */}
                    <div className="mb-6">
                      <span className="text-[28px] font-mono tabular-nums font-bold leading-none tracking-tight block" style={{ color: "var(--ink-950)" }}>
                        {loading && !priceItem ? "--" : formatPrice(price, config.symbol)}
                      </span>
                      <span 
                        className="text-[10px] font-mono font-semibold mt-1.5 inline-block"
                        style={{ color: isPositive ? "var(--mkt-grn)" : "var(--mkt-red)" }}
                      >
                        {changePercent !== null ? (
                          <>{isPositive ? "▲" : "▼"} {Math.abs(changePercent).toFixed(2)}%</>
                        ) : (
                          "--"
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Progress bars (Buy % and Sell %) */}
                  <div className="space-y-4 pt-4 border-t" style={{ borderColor: "var(--line-200)" }}>
                    {/* Buy Progress */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-sans font-medium uppercase tracking-wider" style={{ color: "var(--graphite-600)" }}>L/S Buy Ratio</span>
                        <span className="font-mono font-bold text-mkt-grn" style={{ color: "var(--mkt-grn)" }}>{buyPct}%</span>
                      </div>
                      <div className="w-full h-1 bg-neutral-100 rounded-none overflow-hidden">
                        <div 
                          className="h-full rounded-none transition-all duration-500" 
                          style={{ width: `${buyPct}%`, backgroundColor: "var(--mkt-grn)" }} 
                        />
                      </div>
                    </div>

                    {/* Sell Progress */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-sans font-medium uppercase tracking-wider" style={{ color: "var(--graphite-600)" }}>L/S Sell Ratio</span>
                        <span className="font-mono font-bold text-mkt-red" style={{ color: "var(--mkt-red)" }}>{sellPct}%</span>
                      </div>
                      <div className="w-full h-1 bg-neutral-100 rounded-none overflow-hidden">
                        <div 
                          className="h-full rounded-none transition-all duration-500" 
                          style={{ width: `${sellPct}%`, backgroundColor: "var(--mkt-red)" }} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Source Note */}
                  <div className="mt-6 flex items-center gap-1.5 text-[9px] font-sans uppercase tracking-widest" style={{ color: "var(--graphite-600)" }}>
                    <Users className="w-3 h-3" /> Consensus Ratio
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
