import React from "react";
import { ArrowRight } from "lucide-react";

export default function TradingViewBanner() {
  return (
    <div className="bg-[#111111] border border-[#1A1A1A] p-8 sm:p-10 text-center relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
        <svg className="w-24 h-24 text-[#C8F135]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
        </svg>
      </div>
      <div className="relative z-10 max-w-xl mx-auto space-y-5">
        <span className="text-[10px] font-mono text-[#C8F135] tracking-widest uppercase block">
          // RECOMMENDED TOOL
        </span>
        <h3 className="text-xl sm:text-2xl font-display font-black uppercase text-white tracking-tight leading-tight">
          Supercharge Your Charts With TradingView
        </h3>
        <p className="text-[#A0A0A0] text-sm leading-relaxed font-sans font-light">
          Unlock multi-chart layouts, advanced volume profile indicators, and lightning-fast data feeds. Join millions of traders who use TradingView daily.
        </p>
        <div className="pt-2">
          <a
            href="https://www.tradingview.com/?aff_id=165855"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-[#C8F135] text-black px-6 py-3.5 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            <span>Get Started on TradingView</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
