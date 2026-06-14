"use client";

import { useState } from "react";
import { Shield, ArrowRight, Filter, ShieldCheck, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SectionA, SectionB, SectionC, SectionD } from "@/components/brokers/BrokerSections";

const topBrokers = [
  {
    id: "ig-markets",
    name: "IG Markets",
    category: "Best for UK Spread Betting",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ea/IG_Logo.svg",
    bgUrl: "/images/brokers/ig-bg.png",
    color: "#E11A27",
    spreads: "From 0.6 pips",
    platforms: "IG Platform, MT4, TradingView",
    regulation: "FCA, ASIC, NFA",
    features: ["Tax-Free UK Trading", "Institutional Liquidity", "Extended Hours"],
    link: "/go/ig-markets"
  },
  {
    id: "pepperstone",
    name: "Pepperstone",
    category: "Best for Raw Spreads (Gold & FX)",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/23/Pepperstone_logo.svg",
    bgUrl: "/images/brokers/pepperstone-bg.png",
    fallback: "PS",
    color: "#0054FE",
    spreads: "Raw 0.0 pips",
    platforms: "MT4, MT5, TradingView, Web",
    regulation: "FCA, ASIC, DFSA",
    features: ["Zero Spread Accounts", "Sub-30ms Execution", "Active Trader Rebates"],
    link: "/go/pepperstone"
  },
  {
    id: "ic-markets",
    name: "IC Markets",
    category: "Best for Global Liquidity Depth",
    logoUrl: "https://cdn.icmarkets.com/uploads/IC-logo-fsa.png",
    bgUrl: "/images/brokers/ic-bg.png",
    fallback: "IC",
    color: "#00A382",
    spreads: "Raw 0.0 pips",
    platforms: "MT4, MT5, cTrader, TradingView",
    regulation: "ASIC, CySEC, FSA",
    features: ["High Leverage Options", "Deep Liquidity Pools", "No Dealing Desk"],
    link: "/go/ic-markets"
  }
];

export default function BrokerComparisonHub() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-border-slate/50 min-h-screen flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-8">
            <span className="text-[11px] font-sans font-bold text-text-tertiary uppercase tracking-widest block">
              // VERIFIED LIQUIDITY PROVIDERS
            </span>
            
            <h1 className="text-4xl md:text-6xl font-sans font-extrabold tracking-tight text-text-primary leading-tight">
              Trade With Brokers<br />
              We Actually Use.
            </h1>
            
            <p className="text-base text-text-tertiary leading-relaxed max-w-2xl font-sans">
              Honest recommendations. No pay-to-play rankings. We filter the industry noise based on real execution speed, latency, and regulatory safety to find you an institutional-grade platform.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/brokers/quiz" className="px-7 py-3 rounded-lg bg-mkt-ink text-white font-sans font-semibold text-sm hover:bg-mkt-i2 transition-colors flex items-center gap-2">
                Find Your Broker Match <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Aesthetic Background Pattern */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none overflow-hidden">
           <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_10%,var(--color-premium)_10.5%,transparent_11%)] [background-size:2vw_100%]" />
        </div>
      </section>

      {/* Quick Filter Bar (Visual Mockup) */}
      <section className="py-5 border-b border-border-slate/50 sticky top-[58px] z-40">
         <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap items-center gap-2 text-sm font-sans">
               <div className="flex items-center gap-2 text-text-tertiary text-[10px] uppercase tracking-widest font-bold mr-2">
                  <Filter className="w-3.5 h-3.5" /> Filter:
               </div>
               <button className="px-3.5 py-1.5 rounded-full border border-mkt-ink bg-mkt-ink text-white text-[10px] font-sans font-bold uppercase tracking-widest transition-colors">All Brokers</button>
               <button className="px-3.5 py-1.5 rounded-full border border-border-slate/50 text-text-tertiary hover:border-border-slate hover:text-text-primary text-[10px] font-sans font-bold uppercase tracking-widest transition-colors">UK Spread Betting</button>
               <button className="px-3.5 py-1.5 rounded-full border border-border-slate/50 text-text-tertiary hover:border-border-slate hover:text-text-primary text-[10px] font-sans font-bold uppercase tracking-widest transition-colors">Forex / Gold</button>
               <button className="px-3.5 py-1.5 rounded-full border border-border-slate/50 text-text-tertiary hover:border-border-slate hover:text-text-primary text-[10px] font-sans font-bold uppercase tracking-widest transition-colors">High Leverage</button>
            </div>
         </div>
      </section>

      {/* Top Picks List */}
      <section className="py-24">
         <div className="max-w-7xl mx-auto px-6">
            <div className="space-y-12">
               {topBrokers.map((broker, index) => (
                  <div 
                    key={broker.id} 
                    className="bg-background-surface/40 backdrop-blur-md border border-border-slate/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5 rounded-[14px] p-8 transition-all duration-300 relative overflow-hidden group"
                    style={{
                      transform: hoveredIdx === index ? "translateY(-2px)" : "translateY(0px)",
                      boxShadow: hoveredIdx === index ? "0 8px 32px rgba(0,0,0,0.07)" : "none",
                      borderColor: hoveredIdx === index ? "rgba(0,0,0,0.14)" : undefined
                    }}
                    onMouseEnter={() => setHoveredIdx(index)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  >
                     {/* Premium Background Reveal */}
                     <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-[14px]">
                       <div
                         className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out"
                         style={{
                           backgroundImage: broker.bgUrl ? `url(${broker.bgUrl})` : "none",
                           opacity: hoveredIdx === index ? 0.08 : 0.02,
                           transform: hoveredIdx === index ? "scale(1.05)" : "scale(1)",
                         }}
                       />
                       <div 
                         className="absolute inset-0 transition-opacity duration-700 ease-out"
                         style={{
                           background: `linear-gradient(to top right, transparent, ${broker.color})`,
                           opacity: hoveredIdx === index ? 0.08 : 0
                         }}
                       />
                     </div>

                     {index === 0 && (
                        <div className="absolute top-0 right-0 bg-mkt-ink text-white px-4 py-1.5 rounded-bl-[10px] text-[9px] font-sans font-bold uppercase tracking-widest z-10">
                           Top Overall Pick
                        </div>
                     )}
                     
                     <div className="flex flex-col lg:flex-row gap-8 lg:items-center relative z-10">
                        {/* Logo & Category */}
                        <div className="w-full lg:w-1/4 shrink-0 border-b lg:border-b-0 lg:border-r border-border-slate/30 pb-8 lg:pb-0 lg:pr-8">
                           <div className="text-[10px] font-sans tracking-widest uppercase text-profit font-bold mb-4">
                              // {broker.category}
                           </div>
                           <div className="h-16 flex items-center mb-4">
                              {broker.logoUrl ? (
                                 <div className="h-full px-4 py-2 flex items-center justify-center">
                                    <img src={broker.logoUrl} alt={broker.name} className="h-full object-contain max-w-[120px]" />
                                 </div>
                              ) : (
                                 <div className="w-16 h-16 flex items-center justify-center font-sans font-black text-white text-2xl rounded-xl" style={{ backgroundColor: broker.color }}>
                                    {broker.fallback}
                                 </div>
                              )}
                           </div>
                           <h3 className="text-2xl font-sans font-bold uppercase text-text-primary">{broker.name}</h3>
                        </div>

                        {/* Stats Grid */}
                        <div className="w-full lg:w-2/4 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                           <div>
                              <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-1">Execution & Spreads</p>
                              <p className="text-sm font-bold text-text-primary">{broker.spreads}</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-1">Supported Platforms</p>
                              <p className="text-sm font-bold text-text-primary">
                                {broker.platforms.split('TradingView').map((part, i, arr) => (
                                  <span key={i}>
                                    {part}
                                    {i < arr.length - 1 && (
                                      <Link href="/tools/tradingview" className="text-blue-600 hover:underline">
                                        TradingView
                                      </Link>
                                    )}
                                  </span>
                                ))}
                              </p>
                           </div>
                           <div className="col-span-2">
                              <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-3">Key Edges</p>
                              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                 {broker.features.map((feat, i) => (
                                    <li key={i} className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-text-secondary">
                                       <CheckCircle2 className="w-3 h-3 text-profit" /> {feat}
                                    </li>
                                 ))}
                              </ul>
                           </div>
                        </div>

                        {/* CTA Area */}
                        <div className="w-full lg:w-1/4 shrink-0 flex flex-col justify-center space-y-4 pt-8 lg:pt-0 border-t lg:border-t-0 border-border-slate/30 lg:border-none lg:pl-8">
                           <a 
                              href={broker.link}
                              target="_blank"
                              rel="nofollow"
                              className="w-full py-3 rounded-lg bg-mkt-ink text-white hover:bg-mkt-i2 transition-colors text-center text-xs font-sans font-semibold block"
                           >
                              Open Account
                           </a>
                           <Link 
                              href={`/brokers/${broker.id}-review`}
                              className="w-full py-3 rounded-lg border border-border-slate/50 hover:border-border-slate text-text-primary transition-colors text-center text-xs font-sans font-semibold block"
                           >
                              Read Full Review
                           </Link>
                           <div className="flex items-center justify-center gap-1 text-[10px] font-mono uppercase text-profit">
                              <Shield className="w-3 h-3" /> Regulated: {broker.regulation.split(",")[0]}
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            <div className="mt-16 text-center">
               <Link href="/brokers/all" className="inline-flex items-center gap-2 text-sm font-sans font-semibold text-text-primary hover:underline underline-offset-2 transition-colors">
                  View All Reviewed Brokers <ChevronRight className="w-4 h-4" />
               </Link>
            </div>
         </div>
      </section>

      <SectionA />
      <SectionB />
      <SectionC />
      <SectionD />
    </div>
  );
}
