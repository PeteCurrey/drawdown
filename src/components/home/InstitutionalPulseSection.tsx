"use client";

import { motion } from "framer-motion";
import { ShieldAlert, ArrowUpRight, ArrowDownRight, RefreshCw, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

const signals = [
  {
    type: "BULLISH",
    icon: ArrowUpRight,
    title: "Institutional Order Block Sweep",
    description: "Aggressive buy blocks detected near EUR/USD 1.0820 support, indicating institutional liquidity accumulation.",
    color: "var(--mkt-grn)",
    bgColor: "bg-mkt-gbg",
    badgeColor: "text-mkt-grn bg-mkt-gbg border-mkt-gbd"
  },
  {
    type: "BEARISH",
    icon: ArrowDownRight,
    title: "Retail Sentiment Extreme",
    description: "Retail net-long exposure on GBP/USD reaches a 14-month high of 74.8%, signaling contrarian short risks.",
    color: "var(--mkt-red)",
    bgColor: "bg-mkt-rbg",
    badgeColor: "text-mkt-red bg-mkt-rbg border-red-200"
  },
  {
    type: "NEUTRAL",
    icon: ShieldAlert,
    title: "Macro Liquidity Sweep",
    description: "Systemic order book thinning observed ahead of tomorrow's Federal Reserve interest rate decision.",
    color: "var(--mkt-amb)",
    bgColor: "bg-amber-50",
    badgeColor: "text-mkt-amb bg-amber-50 border-amber-250"
  },
  {
    type: "BULLISH",
    icon: ArrowUpRight,
    title: "BTC Call Option Skew",
    description: "Heavy options open interest buying at the $68,000 strike price, with call-put skew tilting positive.",
    color: "var(--mkt-grn)",
    bgColor: "bg-mkt-gbg",
    badgeColor: "text-mkt-grn bg-mkt-gbg border-mkt-gbd"
  }
];

export function InstitutionalPulseSection() {
  // SVG Donut calculation
  const radius = 50;
  const strokeWidth = 10;
  const circ = 2 * Math.PI * radius; // 314.159

  // Percentages: Bullish 64%, Bearish 21%, Neutral 15%
  const bullPct = 0.64;
  const bearPct = 0.21;
  const neutPct = 0.15;

  const bullLength = circ * bullPct;
  const bearLength = circ * bearPct;
  const neutLength = circ * neutPct;

  // Offsets (starting from top, so we rotate SVG -90deg)
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
    <section className="w-full bg-[#F7F7F7] border-b border-mkt-bd py-24 select-none relative z-10">
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
                    64%
                  </span>
                  <span className="text-[10px] font-sans font-bold text-mkt-grn uppercase tracking-wider">
                    Bullish
                  </span>
                </div>
              </div>

              {/* Three Sentiment Bars */}
              <div className="w-full space-y-4 mt-2">
                {/* Bullish Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-sans font-medium text-mkt-i2">Bullish Exposure</span>
                    <span className="font-mono font-bold text-mkt-grn">64%</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-mkt-grn rounded-full" style={{ width: "64%" }} />
                  </div>
                </div>

                {/* Bearish Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-sans font-medium text-mkt-i2">Bearish Exposure</span>
                    <span className="font-mono font-bold text-mkt-red">21%</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-mkt-red rounded-full" style={{ width: "21%" }} />
                  </div>
                </div>

                {/* Neutral Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-sans font-medium text-mkt-i2">Neutral Exposure</span>
                    <span className="font-mono font-bold text-mkt-amb">15%</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-mkt-amb rounded-full" style={{ width: "15%" }} />
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
