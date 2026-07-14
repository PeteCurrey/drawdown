"use client";

import { motion } from "framer-motion";

const features = [
  {
    emoji: "🛡️",
    title: "Risk Thresholds",
    description: "Hardcoded drawdown boundaries that enforce absolute risk discipline on every trade."
  },
  {
    emoji: "⚡",
    title: "Execution Speed",
    description: "Sub-millisecond routing protocols directly to institutional liquidity hubs."
  },
  {
    emoji: "📊",
    title: "Tax Efficiency",
    description: "Optimised account models designed to minimise spread betting tax liabilities."
  },
  {
    emoji: "🔍",
    title: "Spread Monitoring",
    description: "Real-time tracking of broker bid-ask spreads during high volatility sessions."
  },
  {
    emoji: "🧠",
    title: "Behavioral Logs",
    description: "Automated analysis that isolates emotional triggers and prevents revenge trading."
  },
  {
    emoji: "📉",
    title: "Backtest Depth",
    description: "Monte Carlo simulation engines run against historical tick data dating back to 2014."
  },
  {
    emoji: "👥",
    title: "Consensus Ratios",
    description: "Aggregated live client positioning feed sourced from five global broker systems."
  },
  {
    emoji: "📰",
    title: "Intelligence Briefs",
    description: "Daily pre-market mapping of core order blocks and macroeconomic calendars."
  }
];

export function HorizontalScrollSection() {
  // Duplicate features for seamless infinite scrolling loop
  const marqueeItems = [...features, ...features, ...features];

  return (
    <section className="w-full bg-white border-b border-mkt-bd py-24 select-none relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <span className="text-[11px] font-sans font-bold text-mkt-i4 uppercase tracking-widest block mb-4">
          // CAPABILITIES
        </span>
        <h2 className="text-3xl md:text-5xl font-sans font-extrabold text-mkt-ink tracking-tight">
          Everything a serious trader actually needs
        </h2>
      </div>

      {/* Marquee Outer Container: overflow-hidden */}
      <div className="w-full overflow-hidden flex items-center relative py-4">
        {/* Fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Marquee Inner Track */}
        <div className="flex gap-6 animate-marquee-features whitespace-nowrap items-center hover:[animation-play-state:paused] cursor-pointer pl-6">
          {marqueeItems.map((feat, idx) => (
            <div
              key={idx}
              className="w-[260px] min-w-[260px] max-w-[260px] bg-white border border-mkt-bd rounded-xl p-[18px_22px] flex flex-col gap-3 shrink-0 select-none"
            >
              <div className="text-2xl">{feat.emoji}</div>
              <div className="space-y-1">
                <h4 className="text-[13.5px] font-sans font-bold text-mkt-ink tracking-tight whitespace-normal leading-tight">
                  {feat.title}
                </h4>
                <p className="text-[12px] font-sans text-mkt-i3 whitespace-normal leading-relaxed">
                  {feat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee-features {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee-features {
          animation: marquee-features 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
