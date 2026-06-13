"use client";

import { useState } from "react";
import { Shield, ArrowRight, Filter, ShieldCheck, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const topBrokers = [
  {
    id: "ig-markets",
    name: "IG Markets",
    category: "Best for UK Spread Betting",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ea/IG_Logo.svg",
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
      <section className="relative pt-32 pb-20 bg-white overflow-hidden border-b border-mkt-bd">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-8">
            <span className="text-[11px] font-sans font-bold text-mkt-i4 uppercase tracking-widest block">
              // VERIFIED LIQUIDITY PROVIDERS
            </span>
            
            <h1 className="text-4xl md:text-6xl font-sans font-extrabold tracking-tight text-mkt-ink leading-tight">
              Trade With Brokers<br />
              We Actually Use.
            </h1>
            
            <p className="text-base text-mkt-i3 leading-relaxed max-w-2xl font-sans">
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
      <section className="py-5 bg-white border-b border-mkt-bd sticky top-[58px] z-40">
         <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap items-center gap-2 text-sm font-sans">
               <div className="flex items-center gap-2 text-mkt-i4 text-[10px] uppercase tracking-widest font-bold mr-2">
                  <Filter className="w-3.5 h-3.5" /> Filter:
               </div>
               <button className="px-3.5 py-1.5 rounded-full border border-mkt-ink bg-mkt-ink text-white text-[10px] font-sans font-bold uppercase tracking-widest transition-colors">All Brokers</button>
               <button className="px-3.5 py-1.5 rounded-full border border-mkt-bd text-mkt-i3 hover:border-mkt-bds hover:text-mkt-ink text-[10px] font-sans font-bold uppercase tracking-widest transition-colors">UK Spread Betting</button>
               <button className="px-3.5 py-1.5 rounded-full border border-mkt-bd text-mkt-i3 hover:border-mkt-bds hover:text-mkt-ink text-[10px] font-sans font-bold uppercase tracking-widest transition-colors">Forex / Gold</button>
               <button className="px-3.5 py-1.5 rounded-full border border-mkt-bd text-mkt-i3 hover:border-mkt-bds hover:text-mkt-ink text-[10px] font-sans font-bold uppercase tracking-widest transition-colors">High Leverage</button>
            </div>
         </div>
      </section>

      {/* Top Picks List */}
      <section className="py-24 bg-white">
         <div className="max-w-7xl mx-auto px-6">
            <div className="space-y-12">
               {topBrokers.map((broker, index) => (
                  <div 
                    key={broker.id} 
                    className="bg-white border border-mkt-bd rounded-[14px] p-8 transition-all duration-300 relative overflow-hidden group"
                    style={{
                      transform: hoveredIdx === index ? "translateY(-2px)" : "translateY(0px)",
                      boxShadow: hoveredIdx === index ? "0 8px 32px rgba(0,0,0,0.07)" : "none",
                      borderColor: hoveredIdx === index ? "rgba(0,0,0,0.14)" : undefined
                    }}
                    onMouseEnter={() => setHoveredIdx(index)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  >
                     {/* Background logo reveal & branding tint */}
                     <div className="absolute inset-0 pointer-events-none z-0">
                       <div
                         className="absolute inset-0 bg-contain bg-center bg-no-repeat transition-all duration-700 ease-out"
                         style={{
                           backgroundImage: broker.logoUrl ? `url(${broker.logoUrl})` : "none",
                           opacity: hoveredIdx === index ? 0.04 : 0.01,
                           transform: hoveredIdx === index ? "scale(1)" : "scale(1.05)",
                         }}
                       />
                       <div 
                         className="absolute inset-0 transition-opacity duration-700 ease-out"
                         style={{
                           background: `linear-gradient(to bottom right, transparent, ${broker.color})`,
                           opacity: hoveredIdx === index ? 0.05 : 0
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
                        <div className="w-full lg:w-1/4 shrink-0 border-b lg:border-b-0 lg:border-r border-mkt-bd/50 pb-8 lg:pb-0 lg:pr-8">
                           <div className="text-[10px] font-sans tracking-widest uppercase text-mkt-grn font-bold mb-4">
                              // {broker.category}
                           </div>
                           <div className="h-16 flex items-center mb-4">
                              {broker.logoUrl ? (
                                 <div className="h-full bg-white px-4 py-2 flex items-center justify-center">
                                    <img src={broker.logoUrl} alt={broker.name} className="h-full object-contain max-w-[120px]" />
                                 </div>
                              ) : (
                                 <div className="w-16 h-16 flex items-center justify-center font-sans font-black text-white text-2xl rounded-xl" style={{ backgroundColor: broker.color }}>
                                    {broker.fallback}
                                 </div>
                              )}
                           </div>
                           <h3 className="text-2xl font-sans font-bold uppercase text-mkt-ink">{broker.name}</h3>
                        </div>

                        {/* Stats Grid */}
                        <div className="w-full lg:w-2/4 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                           <div>
                              <p className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4 mb-1">Execution & Spreads</p>
                              <p className="text-sm font-bold text-mkt-ink">{broker.spreads}</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4 mb-1">Supported Platforms</p>
                              <p className="text-sm font-bold text-mkt-ink">{broker.platforms}</p>
                           </div>
                           <div className="col-span-2">
                              <p className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4 mb-3">Key Edges</p>
                              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                 {broker.features.map((feat, i) => (
                                    <li key={i} className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-mkt-i2">
                                       <CheckCircle2 className="w-3 h-3 text-mkt-grn" /> {feat}
                                    </li>
                                 ))}
                              </ul>
                           </div>
                        </div>

                        {/* CTA Area */}
                        <div className="w-full lg:w-1/4 shrink-0 flex flex-col justify-center space-y-4 pt-8 lg:pt-0 border-t lg:border-t-0 border-mkt-bd/50 lg:border-none lg:pl-8">
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
                              className="w-full py-3 rounded-lg border border-mkt-bd hover:border-mkt-bds text-mkt-ink transition-colors text-center text-xs font-sans font-semibold block"
                           >
                              Read Full Review
                           </Link>
                           <div className="flex items-center justify-center gap-1 text-[10px] font-mono uppercase text-mkt-grn">
                              <Shield className="w-3 h-3" /> Regulated: {broker.regulation.split(",")[0]}
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            <div className="mt-16 text-center">
               <Link href="/brokers/all" className="inline-flex items-center gap-2 text-sm font-sans font-semibold text-mkt-ink hover:underline underline-offset-2 transition-colors">
                  View All Reviewed Brokers <ChevronRight className="w-4 h-4" />
               </Link>
            </div>
         </div>
      </section>

      {/* Trust & Methodology Disclosure */}
      <section className="py-24 bg-white border-t border-mkt-bd">
         <div className="max-w-7xl mx-auto px-6 max-w-4xl text-center">
            <ShieldCheck className="w-12 h-12 text-premium mx-auto mb-6" />
            <h2 className="text-3xl font-sans font-black uppercase mb-6">Our Review Methodology.</h2>
            <p className="text-mkt-i2 leading-relaxed mb-8">
               Unlike other portals, we do not rank brokers based on who pays the highest affiliate commission. Our engineering and trading desk tests every platform using real capital. We run automated latency scripts to verify execution speeds and cross-reference spread widening during NFP and CPI events.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-[10px] font-mono text-mkt-i4 uppercase tracking-widest">
               <span className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-premium" /> Real Capital Testing</span>
               <span className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-premium" /> Latency Benchmarking</span>
               <span className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-premium" /> Withdrawal Verification</span>
            </div>
         </div>
      </section>
    </div>
  );
}
