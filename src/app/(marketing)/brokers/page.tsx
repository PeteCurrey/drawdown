"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Shield, 
  ChevronRight, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle,
  Star,
  Search,
  Filter
} from "lucide-react";
import Link from "next/link";

const categories = [
  "All", 
  "Best for Beginners", 
  "Best for Forex", 
  "Best for UK Spread Betting", 
  "Best for Crypto", 
  "Lowest Fees", 
  "FCA Regulated"
];

const brokers = [
  {
    id: "ig-markets",
    name: "IG Markets",
    slug: "ig-markets",
    logoColor: "#E11A27",
    logoText: "IG",
    bestFor: "UK Spread Betting",
    rating: 4.9,
    fca: true,
    minDeposit: "£0",
    spreads: "0.6 pips",
    platforms: ["IG Platform", "MT4", "ProRealTime"],
    leverage: "1:30",
    pros: [
      "FCA regulated & FTSE 250 listed",
      "Huge range of 17,000+ markets",
      "Excellent proprietary platform"
    ],
    cons: [
      "Share dealing fees can be higher",
      "ProRealTime requires active trading for fee waiver"
    ],
    verdict: "I've used IG for 15 years. It is the gold standard for UK spread betting."
  },
  {
    id: "pepperstone",
    name: "Pepperstone",
    slug: "pepperstone",
    logoColor: "#0032FF",
    logoText: "PS",
    bestFor: "Forex & ECN Execution",
    rating: 4.8,
    fca: true,
    minDeposit: "£0",
    spreads: "0.0 pips",
    platforms: ["MT4", "MT5", "cTrader", "TradingView"],
    leverage: "1:30",
    pros: [
      "Razor accounts with ultra-raw spreads",
      "Best-in-class cTrader integration",
      "No internal dealing desk intervention"
    ],
    cons: [
      "Strictly for CFDs and Spread Betting",
      "No proprietary web platform"
    ],
    verdict: "Best for experienced traders who want raw spreads and fast execution."
  },
  {
    id: "ic-markets",
    name: "IC Markets",
    slug: "ic-markets",
    logoColor: "#2C2F36",
    logoText: "IC",
    bestFor: "Active Scalpers",
    rating: 4.7,
    fca: false,
    minDeposit: "£200",
    spreads: "0.0 pips",
    platforms: ["MT4", "MT5", "cTrader"],
    leverage: "1:30 (Retail) / 1:500 (Pro)",
    pros: [
      "High volume liquidity providers",
      "Extremely low latency execution",
      "Competitive commission structure"
    ],
    cons: [
      "Global entity lacks FCA protection (choose AU/CY)",
      "Educational resources are basic"
    ],
    verdict: "The industry workhorse for high-frequency strategies and scalping."
  }
];

export default function BrokersPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div className="pt-12 pb-24 bg-background-primary min-h-screen">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-16">
          <span className="text-accent font-mono text-[10px] uppercase tracking-widest block mb-4">// BROKER GUIDE</span>
          <h1 className="text-5xl md:text-8xl font-display font-bold uppercase mb-8">
            Brokers We <br className="hidden md:block" /> Actually Use.
          </h1>
          <div className="max-w-3xl space-y-6">
            <p className="text-lg text-text-secondary leading-relaxed">
              Every broker on this page is one we've personally traded with. We may earn a referral fee through our links — but that never influences our rankings or reviews. <b>Honest recommendations only.</b>
            </p>
            <div className="p-4 bg-background-elevated border border-border-slate flex items-start gap-4">
              <AlertTriangle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <p className="text-xs text-text-tertiary leading-relaxed uppercase tracking-widest font-mono">
                DISCLOSURE: CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. 67-84% of retail investor accounts lose money when trading CFDs.
              </p>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-2 text-[10px] font-bold uppercase tracking-widest border transition-premium",
                activeCategory === cat 
                  ? "bg-accent border-accent text-background-primary" 
                  : "bg-background-elevated border-border-slate text-text-tertiary hover:border-text-primary"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Broker Cards */}
        <div className="space-y-8">
          {brokers.map((broker) => (
            <div 
              key={broker.id}
              className="bg-[#111318] border border-border-slate overflow-hidden group hover:border-accent/30 transition-premium"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Logo & Rating */}
                <div className="lg:col-span-3 p-10 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-border-slate bg-background-primary/30">
                  <div 
                    className="w-24 h-24 flex items-center justify-center font-display font-black text-white text-4xl mb-6 shadow-2xl"
                    style={{ backgroundColor: broker.logoColor }}
                  >
                    {broker.logoText}
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={cn(
                          "w-4 h-4",
                          i < Math.floor(broker.rating) ? "fill-accent text-accent" : "text-border-slate"
                        )} 
                      />
                    ))}
                  </div>
                  <span className="text-xl font-display font-bold text-text-primary">{broker.rating}/5.0</span>
                  <Link 
                    href={`/brokers/${broker.slug}`}
                    className="mt-6 text-[10px] font-bold uppercase tracking-widest text-text-tertiary hover:text-accent underline"
                  >
                    Read Full Review
                  </Link>
                </div>

                {/* Main Details */}
                <div className="lg:col-span-6 p-10 space-y-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-3xl font-display font-bold uppercase mb-1">{broker.name}</h3>
                      <p className="text-[10px] font-mono text-accent uppercase tracking-widest">{broker.bestFor}</p>
                    </div>
                    {broker.fca && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-profit/10 border border-profit/20 rounded-full">
                        <Shield className="w-3.5 h-3.5 text-profit" />
                        <span className="text-[9px] font-mono font-bold text-profit uppercase tracking-widest">FCA Regulated</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-border-slate/50">
                    <div>
                      <p className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest mb-1">Min Deposit</p>
                      <p className="text-sm font-bold font-mono text-text-primary">{broker.minDeposit}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest mb-1">Spreads From</p>
                      <p className="text-sm font-bold font-mono text-text-primary">{broker.spreads}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest mb-1">Leverage</p>
                      <p className="text-sm font-bold font-mono text-text-primary">{broker.leverage}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest mb-1">Regulatory</p>
                      <p className="text-sm font-bold font-mono text-text-primary">{broker.fca ? 'FSCS/FCA' : 'Global'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <p className="text-[10px] font-mono text-profit uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5" /> What We Like
                      </p>
                      <ul className="space-y-2">
                        {broker.pros.map((pro, i) => (
                          <li key={i} className="text-xs text-text-secondary leading-relaxed flex gap-2">
                            <span className="text-profit">•</span> {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <p className="text-[10px] font-mono text-loss uppercase tracking-widest flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5" /> Watch Out For
                      </p>
                      <ul className="space-y-2">
                        {broker.cons.map((con, i) => (
                          <li key={i} className="text-xs text-text-secondary leading-relaxed flex gap-2">
                            <span className="text-loss">•</span> {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* CTA Column */}
                <div className="lg:col-span-3 p-10 flex flex-col justify-between bg-background-elevated/30">
                  <div className="space-y-4">
                    <p className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">Account Platforms</p>
                    <div className="flex flex-wrap gap-2">
                      {broker.platforms.map((p) => (
                        <span key={p} className="px-2 py-1 bg-background-primary border border-border-slate text-[8px] font-bold uppercase tracking-widest">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 mt-12 lg:mt-0">
                    <div className="p-4 bg-background-primary/50 border border-border-slate italic">
                       <p className="text-[11px] text-text-secondary leading-relaxed">
                         "{broker.verdict}"
                       </p>
                    </div>
                    <a 
                      href={`/api/market/brokers/redirect?id=${broker.id}&source=brokers_page`}
                      className="w-full py-5 bg-accent hover:bg-accent-hover text-background-primary text-[10px] font-bold uppercase tracking-widest transition-premium flex items-center justify-center gap-2"
                    >
                      Open Account <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table Section */}
        <div className="mt-32">
          <div className="mb-12">
            <h2 className="text-4xl font-display font-bold uppercase mb-4">Complete Matrix.</h2>
            <p className="text-sm font-sans text-text-secondary font-mono uppercase tracking-widest">Full feature comparison of every reviewed broker.</p>
          </div>

          <div className="bg-[#111318] border border-border-slate overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background-primary/50 border-b border-border-slate">
                  <th className="p-6 text-[10px] font-mono text-text-tertiary uppercase tracking-widest whitespace-nowrap">Broker Name</th>
                  <th className="p-6 text-[10px] font-mono text-text-tertiary uppercase tracking-widest whitespace-nowrap">Regulation</th>
                  <th className="p-6 text-[10px] font-mono text-text-tertiary uppercase tracking-widest whitespace-nowrap">Min Deposit</th>
                  <th className="p-6 text-[10px] font-mono text-text-tertiary uppercase tracking-widest whitespace-nowrap">EUR/USD Spread</th>
                  <th className="p-6 text-[10px] font-mono text-text-tertiary uppercase tracking-widest whitespace-nowrap">Platforms</th>
                  <th className="p-6 text-[10px] font-mono text-text-tertiary uppercase tracking-widest whitespace-nowrap text-right">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-slate/50">
                {brokers.map((broker) => (
                  <tr key={broker.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-6 font-bold uppercase text-sm tracking-tight">{broker.name}</td>
                    <td className="p-6 font-mono text-xs">{broker.fca ? '🇬🇧 FCA' : '🌎 Global'}</td>
                    <td className="p-6 font-mono text-xs">{broker.minDeposit}</td>
                    <td className="p-6 font-mono text-xs text-accent font-bold">{broker.spreads}</td>
                    <td className="p-6 text-[10px] uppercase font-bold tracking-widest text-text-tertiary">{broker.platforms.join(" / ")}</td>
                    <td className="p-6 text-right">
                      <Link href={`/api/market/brokers/redirect?id=${broker.id}&source=matrix`} className="text-accent hover:underline text-xs font-bold uppercase tracking-widest">
                        Open &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
