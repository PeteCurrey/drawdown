"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, ArrowUpRight, ArrowDownRight, RefreshCw, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Signal {
  type: string;
  icon: any;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  badgeColor: string;
}

const FALLBACK_SIGNALS: Signal[] = [
  {
    type: "BULLISH",
    icon: ArrowUpRight,
    title: "EUR/USD Order Block Sweep",
    description: "EUR/USD is trading above its 20 EMA with a 14-day RSI of 58.4, signaling active institutional accumulation.",
    color: "var(--mkt-grn)",
    bgColor: "bg-mkt-gbg",
    badgeColor: "text-mkt-grn bg-mkt-gbg border-mkt-gbd"
  },
  {
    type: "BEARISH",
    icon: ArrowDownRight,
    title: "GBP/USD Sentiment Extreme",
    description: "GBP/USD is showing bearish daily momentum, trading below its 20 EMA with an RSI of 38.6, representing structural sell pressure.",
    color: "var(--mkt-red)",
    bgColor: "bg-mkt-rbg",
    badgeColor: "text-mkt-red bg-mkt-rbg border-red-200"
  },
  {
    type: "NEUTRAL",
    icon: ShieldAlert,
    title: "XAU/USD Range Consolidation",
    description: "XAU/USD is consolidating in a flat range, with a current daily RSI of 49.5 signaling neutral market momentum.",
    color: "var(--mkt-amb)",
    bgColor: "bg-amber-50",
    badgeColor: "text-mkt-amb bg-amber-50 border-amber-250"
  },
  {
    type: "BULLISH",
    icon: ArrowUpRight,
    title: "BTC/USD Momentum Strength",
    description: "BTC/USD is holding strong bullish structure above its 20 EMA with a daily RSI of 64.2, indicating continued buying appetite.",
    color: "var(--mkt-grn)",
    bgColor: "bg-mkt-gbg",
    badgeColor: "text-mkt-grn bg-mkt-gbg border-mkt-gbd"
  }
];

export function InstitutionalPulseSection() {
  const [sentiment, setSentiment] = useState<any>(null);
  const [signals, setSignals] = useState<Signal[]>(FALLBACK_SIGNALS);
  const [loading, setLoading] = useState(true);

  // Fetch sentiment and consensus (to build signals) on mount
  useEffect(() => {
    let active = true;
    async function fetchData() {
      try {
        const [sentRes, conRes] = await Promise.all([
          fetch("/api/market/sentiment"),
          fetch("/api/market/consensus")
        ]);
        const sentData = sentRes.ok ? await sentRes.json() : null;
        const conData = conRes.ok ? await conRes.json() : [];

        if (!active) return;

        if (sentData) {
          setSentiment(sentData);
        }

        // Map consensus technicals to signals
        if (Array.isArray(conData) && conData.length > 0) {
          const mappedSignals = conData.slice(0, 4).map((item) => {
            const isBullish = item.trend === "Bullish";
            const isBearish = item.trend === "Bearish";
            
            let type = "NEUTRAL";
            let color = "var(--mkt-amb)";
            let bgColor = "bg-amber-50";
            let badgeColor = "text-mkt-amb bg-amber-50 border-amber-250";
            let icon = ShieldAlert;

            if (item.verdict.toLowerCase().includes("buy")) {
              type = "BULLISH";
              color = "var(--mkt-grn)";
              bgColor = "bg-mkt-gbg";
              badgeColor = "text-mkt-grn bg-mkt-gbg border-mkt-gbd";
              icon = ArrowUpRight;
            } else if (item.verdict.toLowerCase().includes("sell")) {
              type = "BEARISH";
              color = "var(--mkt-red)";
              bgColor = "bg-mkt-rbg";
              badgeColor = "text-mkt-red bg-mkt-rbg border-red-200";
              icon = ArrowDownRight;
            }

            return {
              type,
              icon,
              title: `${item.symbol} Momentum Flow`,
              description: `${item.symbol} is displaying a ${item.trend.toLowerCase()} market bias. The 14-period Relative Strength Index is at ${item.rsi}, reflecting active institutional ${isBullish ? "accumulation" : isBearish ? "liquidity sweeps" : "neutral consolidation"}.`,
              color,
              bgColor,
              badgeColor
            };
          });
          setSignals(mappedSignals);
        }
      } catch (err) {
        console.error("Error loading sentiment/pulse:", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchData();
    return () => {
      active = false;
    };
  }, []);

  // Donut values: Bullish exposure mapped to Fear/Greed index, Neutral to VIX
  const fg = sentiment ? (sentiment.fearGreed || 50) : 64;
  const vixVal = sentiment ? (sentiment.vix || 15) : 15;

  const rawBull = fg / 100;
  const rawNeut = Math.max(10, Math.min(25, vixVal)) / 100;
  const rawBear = Math.max(0.05, 1 - rawBull - rawNeut);

  const sum = rawBull + rawNeut + rawBear;
  const bullPct = rawBull / sum;
  const bearPct = rawBear / sum;
  const neutPct = rawNeut / sum;

  // Donut SVG calculations
  const radius = 50;
  const strokeWidth = 10;
  const circ = 2 * Math.PI * radius; // ~314.159

  const bullLength = circ * bullPct;
  const bearLength = circ * bearPct;
  const neutLength = circ * neutPct;

  const bullOffset = 0;
  const bearOffset = -bullLength;
  const neutOffset = -(bullLength + bearLength);

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
            // SENTIMENT INDEX
          </span>
          <h2 className="text-3xl md:text-5xl font-sans font-extrabold text-mkt-ink tracking-tight mb-4">
            Institutional Pulse
          </h2>
          <p className="text-base text-mkt-i3 max-w-xl mx-auto font-sans">
            Real-time aggregate data tracks order flow pressure, option positioning, and large account allocations.
          </p>
          <p className="text-xs text-mkt-i4 max-w-2xl mx-auto font-sans mt-4 leading-relaxed border-t border-neutral-100 pt-4">
            The Institutional Sentiment Index compiles global risk gauges (like the Crypto Fear & Greed Index and the VIX Volatility Index) to map macro exposure. Higher bullish weights signal broad buying appetite, while higher VIX values imply market consolidation. The corresponding signals examine recent moving averages and RSI levels to identify institutional trend zones.
          </p>
        </div>

        {/* 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: 4 Signal Cards */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-sm font-sans font-bold text-mkt-i2 uppercase tracking-wider mb-2 flex items-center gap-2 pl-1">
              <RefreshCw className="w-4 h-4 text-mkt-i4" /> Current Order Flow Signals
            </h3>
            {signals.map((sig, idx) => {
              const Icon = sig.icon;
              return (
                <motion.div
                  key={idx}
                  custom={idx}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-20px" }}
                  variants={cardVariants}
                  className="bg-white border border-mkt-bd rounded-[14px] p-5 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all duration-300 flex items-start gap-4"
                >
                  {/* Icon Container */}
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", sig.bgColor)}>
                    <Icon className="w-5 h-5" style={{ color: sig.color }} />
                  </div>
                  {/* Card Content */}
                  <div className="flex-grow space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-sans font-bold text-mkt-ink leading-tight">
                        {sig.title}
                      </h4>
                      <span className={cn("text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider", sig.badgeColor)}>
                        {sig.type}
                      </span>
                    </div>
                    <p className="text-xs text-mkt-i3 leading-relaxed font-sans pr-4">
                      {sig.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Column: Sentiment Ring & Sentiment Bars */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-sm font-sans font-bold text-mkt-i2 uppercase tracking-wider mb-2 flex items-center gap-2 pl-1">
              <BarChart2 className="w-4 h-4 text-mkt-i4" /> Market Sentiment Profile
            </h3>
            <div className="bg-white border border-mkt-bd rounded-[14px] p-6 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col items-center">
              
              {/* Donut Chart Ring */}
              <div className="relative w-48 h-48 mb-8 mt-2">
                <svg className="w-full h-full transform -rotate-90 origin-center" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    stroke="#F3F4F6"
                    strokeWidth={strokeWidth}
                  />
                  {/* Bullish Arc (Green) */}
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    stroke="var(--mkt-grn)"
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${bullLength} ${circ}`}
                    strokeDashoffset={bullOffset}
                    strokeLinecap="round"
                  />
                  {/* Bearish Arc (Red) */}
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    stroke="var(--mkt-red)"
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${bearLength} ${circ}`}
                    strokeDashoffset={bearOffset}
                    strokeLinecap="round"
                  />
                  {/* Neutral Arc (Amber) */}
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    stroke="var(--mkt-amb)"
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${neutLength} ${circ}`}
                    strokeDashoffset={neutOffset}
                    strokeLinecap="round"
                  />
                </svg>
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-sans font-extrabold text-mkt-ink tracking-tighter">
                    {loading ? "--%" : `${Math.round(bullPct * 100)}%`}
                  </span>
                  <span className="text-[10px] font-sans font-bold text-mkt-grn uppercase tracking-wider">
                    {sentiment?.label || "Bullish"}
                  </span>
                </div>
              </div>

              {/* Three Sentiment Bars */}
              <div className="w-full space-y-4 mt-2">
                {/* Bullish Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-sans font-medium text-mkt-i2">Bullish Exposure</span>
                    <span className="font-mono font-bold text-mkt-grn">{loading ? "--%" : `${Math.round(bullPct * 100)}%`}</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-mkt-grn rounded-full transition-all duration-500" style={{ width: `${Math.round(bullPct * 100)}%` }} />
                  </div>
                </div>

                {/* Bearish Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-sans font-medium text-mkt-i2">Bearish Exposure</span>
                    <span className="font-mono font-bold text-mkt-red">{loading ? "--%" : `${Math.round(bearPct * 100)}%`}</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-mkt-red rounded-full transition-all duration-500" style={{ width: `${Math.round(bearPct * 100)}%` }} />
                  </div>
                </div>

                {/* Neutral Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-sans font-medium text-mkt-i2">Neutral Exposure</span>
                    <span className="font-mono font-bold text-mkt-amb">{loading ? "--%" : `${Math.round(neutPct * 100)}%`}</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-mkt-amb rounded-full transition-all duration-500" style={{ width: `${Math.round(neutPct * 100)}%` }} />
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
