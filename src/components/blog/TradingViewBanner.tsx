import React from "react";
import { ArrowRight } from "lucide-react";

export default function TradingViewBanner() {
  return (
    <div className="bg-[#111111] border border-[#1A1A1A] p-8 sm:p-10 text-center relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
        <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 text-[#C8F135] fill-current" aria-hidden="true">
          <title>TradingView</title>
          <path d="M15.8654 8.2789c0 1.3541-1.0978 2.4519-2.452 2.4519-1.354 0-2.4519-1.0978-2.4519-2.452 0-1.354 1.0978-2.4518 2.452-2.4518 1.3541 0 2.4519 1.0977 2.4519 2.4519M5.3655 22l2.452-4.2898h13.9218L24 22H5.3655zm.2452-6.5416L0 22h3.9228l1.6877-2.9531V22h3.6775v-7.3369c0-.5422-.2452-1.0845-.9808-1.0845s-.9808.5423-.9808 1.0845V22H4.713v-6.5416zm4.9039 0v6.5416h3.6775v-3.9228c0-.5422.2452-1.0845.9808-1.0845s.9808.5423.9808 1.0845v3.9228h3.6775v-6.5416H10.514z"/>
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
