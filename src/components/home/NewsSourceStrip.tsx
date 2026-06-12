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

export function NewsSourceStrip() {
  // Triple the items for marquee loop
  const marqueeItems = [...sources, ...sources, ...sources];

  // Floating variants for Section 8 (Floating logos)
  // Each index has a different delay so they float independently
  const floatVariants = (delay: number) => ({
    animate: {
      y: [0, -4, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut" as const,
        delay: delay
      }
    }
  });

  return (
    <div className="w-full bg-white border-y border-[#E8E8E8] py-12 overflow-hidden relative z-20">
      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
        
        {/* Centered Heading Layout matching reference design */}
        <h3 className="text-sm font-semibold tracking-wide text-neutral-800 text-center mb-1 uppercase font-sans">
          Trusted by active traders across markets.
        </h3>
        <p className="text-xs text-neutral-450 text-center mb-8 font-sans">
          Aggregating institutional data from key global networks.
        </p>
        
        {/* Scrolling Marquee Container */}
        <div className="w-full overflow-hidden flex items-center relative py-2">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="flex animate-marquee-logos whitespace-nowrap items-center hover:[animation-play-state:paused] cursor-pointer">
            {marqueeItems.map((source, i) => (
              <div key={i} className="flex items-center">
                <motion.span 
                  className="font-semibold text-neutral-300 hover:text-neutral-600 transition-colors duration-300 text-sm tracking-tight font-sans"
                  variants={floatVariants((i % 8) * 0.35)}
                  animate="animate"
                >
                  {source}
                </motion.span>
                <span className="text-neutral-200 mx-8 select-none">|</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee-logos {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee-logos {
          animation: marquee-logos 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
