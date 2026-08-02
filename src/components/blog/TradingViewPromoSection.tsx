"use client";

import Link from "next/link";
import { ExternalLink, LineChart, ShieldCheck, Zap } from "lucide-react";

export function TradingViewPromoSection() {
  return (
    <div className="my-10 p-6 md:p-8 bg-slate-900 border border-slate-800 rounded-none text-white shadow-xl relative overflow-hidden font-sans">
      {/* Subtle Background Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        {/* Left Copy Column */}
        <div className="space-y-3 max-w-xl">
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>PROPRIETARY CHARTING PARTNER</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">DISCLOSED AFFILIATE</span>
          </div>

          <h3 className="text-xl md:text-2xl font-display font-extrabold uppercase text-white tracking-tight leading-snug">
            Chart Like a Professional with <span className="text-cyan-400">TradingView</span>
          </h3>

          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            Every technical layout, liquidity zone, and order flow chart on Drawdown is powered by TradingView. Access real-time tick data, multi-chart layouts, Pine Script strategy backtesting, and instant webhooks.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-slate-400 pt-1">
            <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-cyan-400" /> Ultra-fast tick rendering</span>
            <span className="flex items-center gap-1"><LineChart className="w-3 h-3 text-cyan-400" /> 100+ Built-in indicators</span>
            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-400" /> Official Partner</span>
          </div>
        </div>

        {/* Right CTA Button */}
        <div className="shrink-0 flex flex-col items-stretch md:items-end gap-2 w-full md:w-auto">
          <Link
            href="/go/tradingview"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold uppercase tracking-wider text-xs rounded-none transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            Try TradingView Free
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <span className="text-[9px] font-mono text-slate-500 text-center md:text-right">
            Disclosed affiliate link. We use TV daily.
          </span>
        </div>

      </div>
    </div>
  );
}
