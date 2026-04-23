"use client";

import Link from "next/link";
import { ExternalLink, BarChart2, Monitor, Layers, Zap, ChevronRight } from "lucide-react";

const TV_AFFILIATE_URL = "https://www.tradingview.com/?aff_id=165855";

const features = [
  {
    icon: BarChart2,
    title: "Industry-Standard Charts",
    description: "Used by professional traders worldwide. 100+ chart types, 400+ built-in indicators."
  },
  {
    icon: Monitor,
    title: "Multi-Timeframe Analysis",
    description: "Effortlessly switch between M1 and Monthly views on any market, any asset."
  },
  {
    icon: Layers,
    title: "Strategy Backtesting",
    description: "Pine Script allows you to test and automate strategies with a full historical dataset."
  },
  {
    icon: Zap,
    title: "Real-Time Alerts",
    description: "Price alerts, indicator alerts and drawing alerts sent directly to your phone."
  }
];

export function TradingViewSection() {
  return (
    <section className="py-24 md:py-32 bg-background-elevated border-y border-border-slate relative overflow-hidden transition-colors duration-500">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: "repeating-linear-gradient(45deg, #00C2FF 0, #00C2FF 1px, transparent 0, transparent 50%)",
        backgroundSize: "24px 24px"
      }} />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <span className="text-accent font-mono text-[10px] uppercase tracking-[0.3em] block mb-4">
              // RECOMMENDED TOOLKIT
            </span>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-4xl md:text-6xl font-display font-bold uppercase leading-tight">
                The Chart Platform <br />We Use Every Day.
              </h2>
            </div>
            {/* Discount Badge */}
            <div className="inline-flex items-center gap-3 px-5 py-3 bg-profit/10 border border-profit/30 mb-8">
              <span className="text-2xl font-display font-black text-profit">$15 OFF</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-profit">Exclusive via Drawdown</p>
                <p className="text-[9px] font-mono text-text-tertiary uppercase">Use our link for instant savings</p>
              </div>
            </div>
            <p className="text-lg text-text-secondary leading-relaxed mb-8">
              TradingView is the industry standard for charting. Every pattern, indicator, and analysis concept taught in Drawdown is demonstrated using TradingView — because it&apos;s simply the best tool available.
            </p>
            <a
              href={TV_AFFILIATE_URL}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-flex items-center gap-3 px-10 py-5 bg-accent hover:bg-accent-hover text-background-primary text-[10px] font-bold uppercase tracking-widest transition-premium shadow-xl shadow-accent/20 hover:-translate-y-0.5"
            >
              Claim $15 Off TradingView <ExternalLink className="w-4 h-4" />
            </a>
            <div className="mt-4 flex items-center gap-4">
              <p className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">
                Affiliate link • We may earn a commission
              </p>
              <div className="w-px h-3 bg-border-slate" />
              <Link 
                href="/best/tradingview-review-uk" 
                className="text-[9px] font-mono text-accent uppercase tracking-widest hover:underline flex items-center gap-1"
              >
                Read Our Full Review <ChevronRight className="w-2.5 h-2.5" />
              </Link>
            </div>
          </div>

          {/* TradingView "terminal" mockup */}
          <div className="relative">
            <div className="bg-[#131722] border border-border-slate overflow-hidden shadow-2xl">
              {/* Titlebar */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border-slate/50 bg-black/20">
                <div className="w-2.5 h-2.5 rounded-full bg-loss/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-accent/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-profit/70" />
                <span className="ml-4 text-[9px] font-mono text-text-tertiary uppercase tracking-widest">EURUSD • 1H • TradingView</span>
              </div>
              {/* Chart lines mockup using CSS */}
              <div className="p-6 h-48 relative">
                <svg viewBox="0 0 400 150" className="w-full h-full" preserveAspectRatio="none">
                  {/* Grid lines */}
                  {[0, 30, 60, 90, 120, 150].map((y) => (
                    <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#1F2937" strokeWidth="0.5" />
                  ))}
                  {/* Candlestick approximation */}
                  <polyline
                    points="0,120 40,110 80,95 120,105 160,80 200,60 240,75 280,55 320,40 360,50 400,35"
                    fill="none"
                    stroke="#00C2FF"
                    strokeWidth="2"
                  />
                  <polyline
                    points="0,120 40,110 80,95 120,105 160,80 200,60 240,75 280,55 320,40 360,50 400,35"
                    fill="url(#tvGrad)"
                    strokeWidth="0"
                    opacity="0.15"
                  />
                  <defs>
                    <linearGradient id="tvGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00C2FF" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#00C2FF" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Current price tag */}
                  <rect x="330" y="28" width="70" height="16" fill="#00C2FF" />
                  <text x="365" y="40" fontSize="8" fill="#0A0B0F" fontFamily="monospace" textAnchor="middle" fontWeight="bold">1.08412</text>
                </svg>
                <div className="absolute bottom-2 right-4 flex gap-4">
                  <span className="text-[8px] font-mono text-accent">RSI(14): 62.4</span>
                  <span className="text-[8px] font-mono text-profit">MACD: +0.0012</span>
                </div>
              </div>
            </div>
            {/* Overlay badge */}
            <div className="absolute -top-4 -right-4 bg-accent px-4 py-2 text-background-primary text-[9px] font-black uppercase tracking-widest shadow-lg">
              Our #1 Recommended
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div key={i} className="bg-background-primary border border-border-slate p-8 group hover:border-accent/50 transition-premium">
              <feature.icon className="w-8 h-8 text-accent mb-6 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-base font-display font-bold uppercase mb-3 text-text-primary group-hover:text-accent transition-colors">{feature.title}</h3>
              <p className="text-xs text-text-tertiary leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 p-8 bg-background-primary border border-profit/20">
          <div className="flex items-center gap-6">
            <div className="shrink-0 text-center">
              <p className="text-3xl font-display font-black text-profit">$15</p>
              <p className="text-[8px] font-mono font-bold uppercase tracking-widest text-profit">Savings</p>
            </div>
            <div className="w-px h-12 bg-border-slate" />
            <div>
              <p className="text-sm font-display font-bold uppercase text-text-primary mb-1">Save $15 via our exclusive partner link.</p>
              <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Applied automatically at checkout — no code required. Pro plans from $14.95/mo.</p>
            </div>
          </div>
          <a
            href={TV_AFFILIATE_URL}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="shrink-0 flex items-center gap-2 px-8 py-4 bg-profit text-background-primary text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-premium"
          >
            Claim Discount <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
