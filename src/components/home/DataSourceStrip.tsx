"use client";

import { motion } from "framer-motion";

const sources = [
  "Bloomberg",
  "Reuters",
  "Financial Times",
  "WSJ",
  "MarketWatch",
  "CNBC",
  "Yahoo Finance",
  "Investing.com"
];

export function DataSourceStrip() {
  // Triplicate the items for marquee loop
  const marqueeItems = [...sources, ...sources, ...sources];

  return (
    <section className="w-full bg-white border-b border-mkt-bd py-10 overflow-hidden relative z-10 select-none">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
        
        {/* Uppercase Centered Label */}
        <p className="text-[11px] font-sans font-bold text-mkt-i4 uppercase tracking-widest text-center mb-6">
          Aggregating institutional data from
        </p>

        {/* Scrolling Marquee */}
        <div className="w-full overflow-hidden flex items-center relative py-2">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="flex animate-marquee-data whitespace-nowrap items-center hover:[animation-play-state:paused] cursor-pointer">
            {marqueeItems.map((source, i) => (
              <div key={i} className="flex items-center">
                <span 
                  className="font-sans font-semibold text-[#C0C0C0] hover:text-mkt-i3 transition-colors duration-300 text-[13px] tracking-[-0.02em] font-sans"
                  style={{ fontWeight: 600 }}
                >
                  {source}
                </span>
                <span className="text-neutral-250 mx-8 select-none font-sans">&middot;</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes marquee-data {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee-data {
          animation: marquee-data 28s linear infinite;
        }
      `}</style>
    </section>
  );
}
