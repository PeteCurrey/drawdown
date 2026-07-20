"use client";

import { useState } from "react";
import { brokers } from "@/data/brokers";
import { Search, Star, ShieldCheck, ChevronRight, ExternalLink, Filter } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function BrokersAllPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Beginner", "Forex", "Stocks", "Institutional", "Global"];

  const filteredBrokers = brokers.filter((broker) => {
    const matchesSearch = 
      broker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      broker.oneLine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      broker.platforms.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "All" || broker.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background-primary">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16 space-y-4 max-w-3xl">
          <span className="text-accent font-mono text-[10px] uppercase tracking-widest block">// AUDITED PLATFORMS</span>
          <h1 className="text-4xl md:text-5xl font-sans font-black uppercase text-text-primary">
            All Reviewed Brokers.
          </h1>
          <p className="text-text-secondary text-sm md:text-base leading-relaxed max-w-2xl">
            A complete directory of every trading broker and liquidity provider audited by the Drawdown research team. 
            We review spreads, regulation, platform support, and speed to help you trade safe. We may earn a referral fee — disclosed on every link.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center pb-8 border-b border-border-slate/30 mb-12">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-4 py-2 rounded-full text-[10px] font-sans font-bold uppercase tracking-widest border transition-all duration-200",
                  selectedCategory === cat
                    ? "bg-mkt-ink border-mkt-ink text-white shadow-sm"
                    : "border-border-slate/50 text-text-tertiary hover:border-border-slate hover:text-text-primary"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-text-tertiary" />
            </span>
            <input
              type="text"
              placeholder="Search brokers or platforms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-background-elevated/40 border border-border-slate/50 rounded-lg text-xs font-sans text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>

        {/* Brokers Grid */}
        {filteredBrokers.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border-slate/50 rounded-xl space-y-4">
            <Search className="w-8 h-8 text-text-tertiary mx-auto opacity-50" />
            <h3 className="text-sm font-sans font-bold uppercase text-text-primary">No brokers found</h3>
            <p className="text-xs text-text-tertiary">Try refining your search query or switching categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBrokers.map((broker) => {
              // Standardize local logo paths
              let logoSrc = broker.logo;
              if (broker.id === "ig" || broker.slug === "ig") {
                logoSrc = "/logos/brokers/ig-markets.svg";
              } else if (broker.id === "pepperstone" || broker.slug === "pepperstone") {
                logoSrc = "/logos/brokers/pepperstone.svg";
              } else if (broker.id === "ic-markets" || broker.slug === "ic-markets") {
                logoSrc = "/logos/brokers/ic-markets.svg";
              }

              return (
                <div
                  key={broker.id}
                  className="bg-background-surface/40 backdrop-blur-md border border-border-slate/50 hover:border-border-slate rounded-xl p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 flex flex-col justify-between h-full group"
                >
                  <div className="space-y-6">
                    {/* Card Header (Logo & Rating) */}
                    <div className="flex justify-between items-start gap-4">
                      <div className="h-10 flex items-center">
                        <img 
                          src={logoSrc} 
                          alt={broker.name} 
                          className="h-full object-contain max-w-[120px] transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            // Fallback to placeholder on image loading failure
                            e.currentTarget.style.display = 'none';
                            const sibling = e.currentTarget.nextElementSibling as HTMLElement;
                            if (sibling) sibling.style.display = 'flex';
                          }}
                        />
                        <div 
                          className="hidden w-10 h-10 items-center justify-center font-sans font-black text-white text-xs rounded"
                          style={{ 
                            backgroundColor: 
                              broker.category === "Forex" ? "#0054FE" : 
                              broker.category === "Stocks" ? "#E11A27" : 
                              broker.category === "Institutional" ? "#7A1CFC" : "#2C2F36" 
                          }}
                        >
                          {broker.name.substring(0, 2).toUpperCase()}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-accent/10 px-2 py-1 rounded text-accent font-sans font-bold text-[10px]">
                        <Star className="w-3 h-3 fill-current" /> {broker.rating.toFixed(1)}
                      </div>
                    </div>

                    {/* Broker Name & Info */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-sans font-bold uppercase text-text-primary group-hover:text-accent transition-colors">
                        {broker.name}
                      </h3>
                      <p className="text-xs text-text-tertiary line-clamp-2 min-h-[32px] leading-relaxed">
                        {broker.oneLine}
                      </p>
                    </div>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-border-slate/20 text-[11px] font-sans">
                      <div>
                        <span className="text-text-tertiary block mb-0.5">Spreads</span>
                        <span className="font-bold text-text-primary">{broker.spreads}</span>
                      </div>
                      <div>
                        <span className="text-text-tertiary block mb-0.5">Min Deposit</span>
                        <span className="font-bold text-text-primary">{broker.minDeposit}</span>
                      </div>
                    </div>

                    {/* Platforms */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary block">Platforms</span>
                      <div className="flex flex-wrap gap-1.5">
                        {broker.platforms.map((plat, idx) => (
                          <span 
                            key={idx} 
                            className="px-2 py-1 bg-background-elevated/40 border border-border-slate/30 text-[8px] font-mono uppercase tracking-wide rounded text-text-secondary"
                          >
                            {plat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="space-y-3 mt-6 pt-4 border-t border-border-slate/10">
                    <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider">
                      <span className="text-text-tertiary">Category: {broker.category}</span>
                      <span className={cn("flex items-center gap-1", broker.fcaRegulated ? "text-profit" : "text-text-tertiary")}>
                        <ShieldCheck className="w-3.5 h-3.5" /> {broker.fcaRegulated ? "FCA Regulated" : "Globally Regulated"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <Link
                        href={`/brokers/${broker.slug}-review`}
                        className="py-2.5 rounded-lg border border-border-slate/50 hover:border-border-slate text-text-primary hover:bg-background-elevated/30 transition-all text-center text-[10px] font-sans font-bold uppercase tracking-widest"
                      >
                        Read Review
                      </Link>
                      <a
                        href={broker.affiliateUrl}
                        target="_blank"
                        rel="nofollow sponsored"
                        className="py-2.5 rounded-lg bg-mkt-ink text-white hover:bg-mkt-i2 transition-colors text-center text-[10px] font-sans font-bold uppercase tracking-widest flex items-center justify-center gap-1"
                      >
                        Open Acc <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
