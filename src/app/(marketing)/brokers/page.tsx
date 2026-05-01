"use client";

import { Shield, ArrowRight, Filter, ShieldCheck, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const topBrokers = [
  {
    id: "ig-markets",
    name: "IG Markets",
    category: "Best for UK Spread Betting",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2d/IG_Group_logo.svg",
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
    logoUrl: null, // Text fallback
    fallback: "PS",
    color: "#0032FF",
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
    logoUrl: null, // Text fallback
    fallback: "IC",
    color: "#2C2F36",
    spreads: "Raw 0.0 pips",
    platforms: "MT4, MT5, cTrader, TradingView",
    regulation: "ASIC, CySEC, FSA",
    features: ["High Leverage Options", "Deep Liquidity Pools", "No Dealing Desk"],
    link: "/go/ic-markets"
  }
];

export default function BrokerComparisonHub() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-background-primary overflow-hidden border-b border-border-slate">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl space-y-8">
            <div className="flex items-center gap-3 text-accent">
               <div className="w-8 h-[1px] bg-accent" />
               <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold">VERIFIED LIQUIDITY PROVIDERS</span>
            </div>
            
            <h1 className="  font-display font-extrabold uppercase tracking-tight leading-[0.9]">
              Trade With Brokers <br />
              <span className="text-text-primary">We Actually Use.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-text-secondary leading-relaxed max-w-3xl font-medium">
              Honest recommendations. No pay-to-play rankings. We filter the industry noise based on real execution speed, latency, and regulatory safety to find you an institutional-grade platform.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/brokers/quiz" className="px-8 py-4 bg-accent text-[#08090D] font-bold uppercase tracking-widest text-xs hover:bg-accent-hover transition-colors flex items-center gap-2">
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
      <section className="py-6 bg-background-surface border-b border-border-slate sticky top-[72px] z-40">
         <div className="container mx-auto px-6">
            <div className="flex flex-wrap items-center gap-4 text-sm font-mono uppercase tracking-widest">
               <div className="flex items-center gap-2 text-text-secondary mr-4">
                  <Filter className="w-4 h-4" /> Filter By:
               </div>
               <button className="px-4 py-2 border border-accent text-accent hover:bg-accent/10 transition-colors">All Brokers</button>
               <button className="px-4 py-2 border border-border-slate text-text-secondary hover:border-text-primary hover:text-text-primary transition-colors">UK Spread Betting</button>
               <button className="px-4 py-2 border border-border-slate text-text-secondary hover:border-text-primary hover:text-text-primary transition-colors">Forex / Gold</button>
               <button className="px-4 py-2 border border-border-slate text-text-secondary hover:border-text-primary hover:text-text-primary transition-colors">High Leverage</button>
            </div>
         </div>
      </section>

      {/* Top Picks List */}
      <section className="py-24 bg-background-primary">
         <div className="container mx-auto px-6">
            <div className="space-y-12">
               {topBrokers.map((broker, index) => (
                  <div key={broker.id} className="bg-background-surface border border-border-slate p-8 hover:border-accent/30 transition-colors relative overflow-hidden group">
                     {index === 0 && (
                        <div className="absolute top-0 right-0 bg-profit text-[#08090D] px-4 py-1 text-[10px] font-bold uppercase tracking-widest z-10">
                           Top Overall Pick
                        </div>
                     )}
                     
                     <div className="flex flex-col lg:flex-row gap-8 lg:items-center">
                        {/* Logo & Category */}
                        <div className="w-full lg:w-1/4 shrink-0 border-b lg:border-b-0 lg:border-r border-border-slate/50 pb-8 lg:pb-0 lg:pr-8">
                           <div className="text-[10px] font-mono tracking-widest uppercase text-accent font-bold mb-4">
                              // {broker.category}
                           </div>
                           <div className="h-16 flex items-center mb-4">
                              {broker.logoUrl ? (
                                 <div className="h-full bg-white px-4 py-2 flex items-center justify-center">
                                    <img src={broker.logoUrl} alt={broker.name} className="h-full object-contain max-w-[120px]" />
                                 </div>
                              ) : (
                                 <div className="w-16 h-16 flex items-center justify-center font-display font-black text-text-primary text-2xl" style={{ backgroundColor: broker.color }}>
                                    {broker.fallback}
                                 </div>
                              )}
                           </div>
                           <h3 className="text-2xl font-display font-bold uppercase text-text-primary">{broker.name}</h3>
                        </div>

                        {/* Stats Grid */}
                        <div className="w-full lg:w-2/4 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                           <div>
                              <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-1">Execution & Spreads</p>
                              <p className="text-sm font-bold text-text-primary">{broker.spreads}</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-1">Supported Platforms</p>
                              <p className="text-sm font-bold text-text-primary">{broker.platforms}</p>
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
                        <div className="w-full lg:w-1/4 shrink-0 flex flex-col justify-center space-y-4 pt-8 lg:pt-0 border-t lg:border-t-0 border-border-slate/50 lg:border-none lg:pl-8">
                           <a 
                              href={broker.link}
                              target="_blank"
                              rel="nofollow"
                              className="w-full py-4 bg-accent text-[#08090D] hover:bg-accent-hover transition-colors text-center text-xs font-bold uppercase tracking-widest block"
                           >
                              Open Account
                           </a>
                           <Link 
                              href={`/brokers/${broker.id}-review`}
                              className="w-full py-4 border border-border-slate hover:border-text-primary text-text-primary transition-colors text-center text-xs font-bold uppercase tracking-widest block"
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
               <Link href="/brokers/all" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-text-primary hover:text-accent transition-colors border-b border-transparent hover:border-accent pb-1">
                  View All Reviewed Brokers <ChevronRight className="w-4 h-4" />
               </Link>
            </div>
         </div>
      </section>

      {/* Trust & Methodology Disclosure */}
      <section className="py-24 bg-background-surface border-t border-border-slate">
         <div className="container mx-auto px-6 max-w-4xl text-center">
            <ShieldCheck className="w-12 h-12 text-premium mx-auto mb-6" />
            <h2 className="text-3xl font-display font-black uppercase mb-6">Our Review Methodology.</h2>
            <p className="text-text-secondary leading-relaxed mb-8">
               Unlike other portals, we do not rank brokers based on who pays the highest affiliate commission. Our engineering and trading desk tests every platform using real capital. We run automated latency scripts to verify execution speeds and cross-reference spread widening during NFP and CPI events.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
               <span className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-premium" /> Real Capital Testing</span>
               <span className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-premium" /> Latency Benchmarking</span>
               <span className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-premium" /> Withdrawal Verification</span>
            </div>
         </div>
      </section>
    </div>
  );
}
