"use client";

import { motion } from "framer-motion";

const sources = [
  { name: "Bloomberg", logo: "/logos/partners/bloomberg.svg" },
  { name: "Reuters", logo: "/logos/partners/reuters.svg" },
  { name: "Financial Times", logo: "/logos/partners/financial_times.svg" },
  { name: "WSJ", logo: "/logos/partners/wsj.svg" },
  { name: "MarketWatch", logo: "/logos/partners/marketwatch.svg" },
  { name: "CNBC", logo: "/logos/partners/cnbc.svg" },
  { name: "Yahoo Finance", logo: "/logos/partners/yahoo_finance.svg" },
  { name: "Investing.com", logo: "/logos/partners/investing.svg" }
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
                <img 
                  src={source.logo}
                  alt={source.name}
                  className="h-5 md:h-6 w-auto object-contain brightness-0 opacity-40 hover:opacity-80 transition-opacity duration-300 select-none"
                />
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
