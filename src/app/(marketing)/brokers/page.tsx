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
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

const TV_AFFILIATE_URL = "https://www.tradingview.com/?aff_id=165855";

const categories = [
  "All", 
  "Best for Beginners", 
  "Best for Forex", 
  "Best for UK Spread Betting", 
  "Best for Crypto", 
  "Lowest Fees", 
  "FCA Regulated"
];

import { brokers } from "@/data/brokers";

export default function BrokersPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredBrokers = brokers.filter(broker => {
    if (activeCategory === "All") return true;
    if (activeCategory === "FCA Regulated") return broker.fcaRegulated;
    if (activeCategory === "Best for Beginners") return broker.category === "Beginner";
    if (activeCategory === "Best for Forex") return broker.category === "Forex";
    if (activeCategory === "Best for UK Spread Betting") return broker.oneLine.toLowerCase().includes("spread betting");
    if (activeCategory === "Lowest Fees") return broker.spreads.includes("0.0") || broker.oneLine.toLowerCase().includes("commission");
    return true;
  });

  return (
    <div className="pt-32 pb-24 bg-background-primary min-h-screen transition-colors duration-500">
      <div className="container mx-auto px-6 max-w-7xl">
        <Breadcrumbs />
        
        {/* Header */}
        <div className="mb-16">
          <span className="text-accent font-mono text-[10px] uppercase tracking-widest block mb-4">// BROKER GUIDE</span>
          <h1 className="text-5xl md:text-8xl font-display font-bold uppercase mb-8 text-text-primary">
            Brokers We <br className="hidden md:block" /> Actually Use.
          </h1>
          <div className="max-w-3xl space-y-6">
            <p className="text-lg text-text-secondary leading-relaxed">
              Every broker on this page is one we've personally traded with. No hype, no fake reviews. We may earn a referral fee — but that never influences our honest feedback.
            </p>
            <div className="p-4 bg-background-elevated border border-border-slate flex items-start gap-4">
              <AlertTriangle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <p className="text-xs text-text-tertiary leading-relaxed uppercase tracking-widest font-mono">
                DISCLOSURE: CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. 67-84% of retail investor accounts lose money.
              </p>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-12 border-b border-border-slate pb-8">
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
          {filteredBrokers.map((broker) => (
            <div 
              key={broker.id}
              className="bg-background-surface border border-border-slate overflow-hidden group hover:border-accent/30 transition-premium"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Logo & Rating */}
                <div className="lg:col-span-3 p-10 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-border-slate bg-background-primary/30">
                  <div className="w-24 h-24 bg-background-elevated flex items-center justify-center border border-border-slate mb-6 shadow-2xl relative overflow-hidden group-hover:scale-105 transition-transform">
                    <img src={broker.logo} alt={broker.name} className="w-16 h-16 object-contain dark:invert" />
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
                      <h3 className="text-3xl font-display font-bold uppercase mb-1 text-text-primary">{broker.name}</h3>
                      <p className="text-[10px] font-mono text-accent uppercase tracking-widest">{broker.oneLine}</p>
                    </div>
                    {broker.fcaRegulated && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-profit/10 border border-profit/20 rounded-none">
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
                      <p className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest mb-1">Platforms</p>
                      <p className="text-sm font-bold font-mono text-text-primary">{broker.platforms.length}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest mb-1">Category</p>
                      <p className="text-sm font-bold font-mono text-text-primary">{broker.category}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <p className="text-[10px] font-mono text-profit uppercase tracking-widest flex items-center gap-2 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Core Strengths
                      </p>
                      <ul className="space-y-2">
                        {broker.pros.slice(0, 3).map((pro, i) => (
                          <li key={i} className="text-xs text-text-secondary leading-relaxed flex gap-2">
                            <span className="text-profit">•</span> {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <p className="text-[10px] font-mono text-loss uppercase tracking-widest flex items-center gap-2 font-bold">
                        <AlertTriangle className="w-3.5 h-3.5" /> Trade-offs
                      </p>
                      <ul className="space-y-2">
                        {broker.cons.slice(0, 3).map((con, i) => (
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
                    <p className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest mb-4">Supported Software</p>
                    <div className="flex flex-wrap gap-2">
                      {broker.platforms.map((p) => (
                        <span key={p} className="px-2 py-1 bg-background-primary border border-border-slate text-[8px] font-bold uppercase tracking-widest text-text-secondary">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 mt-12 lg:mt-0">
                    <a 
                      href={broker.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-5 bg-accent hover:bg-accent-hover text-background-primary text-[10px] font-bold uppercase tracking-widest transition-premium flex items-center justify-center gap-2"
                    >
                      Visit Broker <ExternalLink className="w-3.5 h-3.5" />
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
            <h2 className="text-4xl font-display font-bold uppercase mb-4 text-text-primary">Complete Matrix.</h2>
            <p className="text-sm font-sans text-text-secondary font-mono uppercase tracking-widest">Full feature comparison of institutional gateways.</p>
          </div>

          <div className="bg-background-surface border border-border-slate overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background-primary/50 border-b border-border-slate">
                  <th className="p-6 text-[10px] font-mono text-text-tertiary uppercase tracking-widest whitespace-nowrap">Broker Name</th>
                  <th className="p-6 text-[10px] font-mono text-text-tertiary uppercase tracking-widest whitespace-nowrap">Regulation</th>
                  <th className="p-6 text-[10px] font-mono text-text-tertiary uppercase tracking-widest whitespace-nowrap">Min Deposit</th>
                  <th className="p-6 text-[10px] font-mono text-text-tertiary uppercase tracking-widest whitespace-nowrap">Spread (avg)</th>
                  <th className="p-6 text-[10px] font-mono text-text-tertiary uppercase tracking-widest whitespace-nowrap">Category</th>
                  <th className="p-6 text-[10px] font-mono text-text-tertiary uppercase tracking-widest whitespace-nowrap text-right">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-slate/50">
                {brokers.map((broker) => (
                  <tr key={broker.id} className="hover:bg-accent/5 transition-colors">
                    <td className="p-6 font-bold uppercase text-sm tracking-tight text-text-primary">{broker.name}</td>
                    <td className="p-6 font-mono text-xs text-text-secondary">{broker.fcaRegulated ? '🇬🇧 FCA Authorised' : '🌎 Global Entity'}</td>
                    <td className="p-6 font-mono text-xs text-text-secondary">{broker.minDeposit}</td>
                    <td className="p-6 font-mono text-xs text-accent font-bold">{broker.spreads}</td>
                    <td className="p-6 text-[10px] uppercase font-bold tracking-widest text-text-tertiary">{broker.category}</td>
                    <td className="p-6 text-right">
                      <a href={broker.affiliateUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline text-xs font-bold uppercase tracking-widest">
                        Visit &rarr;
                      </a>
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
