"use client";

import { NewsSourceLogo } from "@/components/ui/NewsSourceLogo";

const sources = [
  "Bloomberg",
  "Reuters",
  "Financial Times",
  "WSJ Markets",
  "MarketWatch",
  "CNBC Markets",
  "Yahoo Finance"
];

export function NewsSourceStrip() {
  return (
    <div className="w-full bg-background-surface border-y border-border-slate py-8 overflow-hidden relative">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background-surface to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background-surface to-transparent z-10 pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-0 flex flex-col items-center">
        <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-text-tertiary mb-6">
          Aggregating institutional data from
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-70 hover:opacity-100 transition-opacity duration-500">
          {sources.map((source, index) => (
            <NewsSourceLogo 
              key={index}
              source={source} 
              size="lg" 
              monochrome={true} 
              showText={false}
              className="grayscale hover:grayscale-0 transition-all duration-300 transform hover:scale-110 cursor-default"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
