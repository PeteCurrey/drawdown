"use client";

import Link from "next/link";
import { Check } from "lucide-react";

export function TradingViewSection() {
  return (
    <section className="bg-[#0A0A0A] w-full py-16 md:py-24 border-y border-white/5 relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/[0.02] to-transparent pointer-events-none" />
      <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-white/[0.02] blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Copy */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/50">
                CHARTING PARTNER
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight leading-tight">
                The chart platform serious traders actually use.
              </h2>
            </div>

            <p className="text-[15px] text-white/70 leading-relaxed max-w-lg">
              TradingView is the global standard for retail and institutional charting. 
              60+ million traders worldwide. Real-time data across every major market. 
              Pine Script for custom indicators and strategies. A social layer where 
              the world's best analysts publish their ideas publicly.
              <br /><br />
              Every chart example in the Drawdown curriculum is built on TradingView. 
              We use it ourselves, every session, without exception. It's the one 
              tool we recommend without reservation.
            </p>

            <ul className="space-y-4 pt-2">
              {[
                "Real-time data — forex, stocks, crypto, commodities, indices",
                "100+ built-in indicators + Pine Script for custom strategies",
                "Multi-chart layouts — run 4-8 charts simultaneously",
                "Paper trading mode — test live without real capital"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-green-500/20 p-1 shrink-0">
                    <Check className="w-3 h-3 text-green-500" />
                  </div>
                  <span className="text-[14px] text-white/80">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="pt-6 space-y-4">
              <Link
                href="/go/tradingview"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-black rounded-lg font-bold text-sm tracking-wide hover:bg-neutral-200 transition-colors"
              >
                Try TradingView Free →
              </Link>
              <p className="text-[11px] text-white/40 max-w-sm">
                Affiliate link — we earn a commission if you upgrade to a paid plan. 
                We use TradingView ourselves and recommend it without qualification.
              </p>
            </div>
          </div>

          {/* Right Column: Visual Mockup */}
          <div className="relative group perspective-1000">
            {/* The tilted card */}
            <div 
              className="relative bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden transition-all duration-700 ease-out"
              style={{
                transform: "rotateY(-6deg) rotateX(2deg)",
                transformStyle: "preserve-3d"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "rotateY(-1deg) rotateX(0deg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "rotateY(-6deg) rotateX(2deg)";
              }}
            >
              {/* Fake UI Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  </div>
                  <div className="h-4 w-px bg-white/10 mx-2" />
                  <span className="text-xs font-mono text-white/80">GBP/USD · 1H</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-green-500">1.2734</span>
                </div>
              </div>

              {/* Fake UI Body */}
              <div className="flex h-[300px] md:h-[400px]">
                {/* Fake Sidebar */}
                <div className="w-12 border-r border-white/5 flex flex-col items-center py-4 gap-4 bg-white/[0.01]">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-5 h-5 rounded bg-white/10" />
                  ))}
                </div>

                {/* Chart Area */}
                <div className="flex-grow relative p-4 bg-[#0d0d0d]">
                  {/* Grid lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />
                  
                  {/* Fake Support/Resistance lines */}
                  <div className="absolute top-1/4 left-0 w-full h-px bg-white/10 border-b border-dashed border-white/20" />
                  <div className="absolute top-2/3 left-0 w-full h-px bg-white/10 border-b border-dashed border-white/20" />

                  {/* SVG Candlesticks */}
                  <svg className="w-full h-full relative z-10" viewBox="0 0 400 300" preserveAspectRatio="none">
                    {/* Just some dummy paths to look like candles */}
                    <g className="text-green-500" stroke="currentColor" fill="currentColor">
                      <line x1="40" y1="200" x2="40" y2="150" strokeWidth="2" />
                      <rect x="35" y="160" width="10" height="30" />
                      
                      <line x1="80" y1="180" x2="80" y2="100" strokeWidth="2" />
                      <rect x="75" y="110" width="10" height="50" />
                      
                      <line x1="160" y1="140" x2="160" y2="60" strokeWidth="2" />
                      <rect x="155" y="70" width="10" height="60" />
                      
                      <line x1="280" y1="160" x2="280" y2="90" strokeWidth="2" />
                      <rect x="275" y="100" width="10" height="40" />
                      
                      <line x1="360" y1="130" x2="360" y2="50" strokeWidth="2" />
                      <rect x="355" y="60" width="10" height="50" />
                    </g>
                    <g className="text-red-500" stroke="currentColor" fill="currentColor">
                      <line x1="120" y1="120" x2="120" y2="190" strokeWidth="2" />
                      <rect x="115" y="130" width="10" height="40" />
                      
                      <line x1="200" y1="80" x2="200" y2="210" strokeWidth="2" />
                      <rect x="195" y="90" width="10" height="100" />
                      
                      <line x1="240" y1="160" x2="240" y2="240" strokeWidth="2" />
                      <rect x="235" y="170" width="10" height="50" />
                      
                      <line x1="320" y1="110" x2="320" y2="180" strokeWidth="2" />
                      <rect x="315" y="120" width="10" height="50" />
                    </g>
                  </svg>

                  {/* Volume Bars */}
                  <div className="absolute bottom-0 left-12 right-0 h-16 flex items-end justify-around pb-2 opacity-50">
                    {[30, 50, 40, 80, 20, 60, 45, 70, 90].map((h, i) => (
                      <div 
                        key={i} 
                        className={`w-3 md:w-6 ${i % 2 === 0 ? 'bg-green-500/50' : 'bg-red-500/50'}`}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Stat Badges below */}
            <div className="flex flex-wrap gap-3 mt-6 justify-center lg:justify-start">
              {["60M+ Traders", "50+ Exchanges", "Free Plan Available"].map((stat, i) => (
                <div key={i} className="px-3 py-1.5 rounded-full border border-white/10 bg-[#111] text-white text-[12px] font-medium tracking-wide">
                  {stat}
                </div>
              ))}
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
