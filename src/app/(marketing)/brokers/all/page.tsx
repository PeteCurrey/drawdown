"use client";

import { useState } from "react";
import { brokers } from "@/data/brokers";
import { Search, Star, ShieldCheck, ChevronRight, ExternalLink, Shield, Zap, Award, Layers, Sparkles, Clock, CheckCircle2, ArrowDown, Filter, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AffiliateDisclosure } from "@/components/seo/AffiliateDisclosure";

export default function BrokersAllPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Beginner", "Forex", "Stocks", "Institutional", "Global"];

  const filteredBrokers = brokers.filter((broker) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      broker.name.toLowerCase().includes(query) ||
      broker.oneLine.toLowerCase().includes(query) ||
      broker.platforms.some(p => p.toLowerCase().includes(query)) ||
      broker.category.toLowerCase().includes(query);
    
    const matchesCategory = selectedCategory === "All" || broker.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getCategoryCount = (cat: string) => {
    if (cat === "All") return brokers.length;
    return brokers.filter(b => b.category === cat).length;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* 1. FULL-SCREEN IMMERSIVE HERO SECTION */}
      <section className="relative min-h-[85vh] flex flex-col justify-center pt-32 pb-20 border-b border-white/10 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* Background Ambient Radial Lighting */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-indigo-600/15 rounded-full blur-[160px] pointer-events-none z-0" />
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none z-0" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono font-bold uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" />
              <span>// 100% AUDITED & VERIFIED PLATFORMS</span>
            </div>

            {/* Headline H1 */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-sans font-black uppercase tracking-tight leading-[0.95]">
              All Reviewed <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-white">Brokers & Platforms.</span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed font-normal max-w-3xl mx-auto">
              Every broker in our database undergoes real-capital testing for raw spreads, tick latency, regulatory standing, and withdrawal reliability. <strong className="text-white">Zero offshore scams, zero hidden markups.</strong>
            </p>

            {/* Hero Quick Stat Counter Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 max-w-3xl mx-auto">
              {[
                { label: "Audited Platforms", value: `${brokers.length}+ Brokers` },
                { label: "Regulation", value: "100% Verified" },
                { label: "Raw Spreads", value: "From 0.0 Pips" },
                { label: "Execution Latency", value: "< 30ms Average" },
              ].map((st, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-1">{st.label}</span>
                  <span className="text-base font-sans font-black text-white">{st.value}</span>
                </div>
              ))}
            </div>

            {/* Hero Actions */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <a
                href="#directory"
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-sans font-black text-xs uppercase tracking-widest rounded-xl shadow-xl shadow-indigo-600/30 transition-all duration-300 hover:scale-[1.02] flex items-center gap-2"
              >
                Explore Broker Directory <ArrowDown className="w-4 h-4 animate-bounce" />
              </a>

              <a
                href="#methodology"
                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-sans font-bold text-xs uppercase tracking-widest rounded-xl transition-all"
              >
                Our Audit Guarantee
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTRO & AUDIT METHODOLOGY SECTION (BUILDING TRUST & CREDIBILITY) */}
      <section id="methodology" className="py-20 bg-slate-900 border-b border-white/10 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400">// UNBIASED STANDARDS</span>
            <h2 className="text-3xl sm:text-5xl font-sans font-black uppercase text-white">
              Pete&apos;s Broker Audit Methodology
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              We take broker verification seriously. Before a broker is listed in our directory, we test its infrastructure with real capital and verify its licensing directly against government financial registries.
            </p>
          </div>

          {/* 3 Pillar Trust Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="p-8 rounded-2xl bg-slate-950 border border-white/10 hover:border-indigo-500/50 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-sans font-black uppercase text-white">1. Direct Regulatory Audit</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                We verify every broker against official registries including the UK FCA (Financial Conduct Authority), Australian ASIC, and European CySEC. We never recommend unregulated offshore entities.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-950 border border-white/10 hover:border-indigo-500/50 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-sans font-black uppercase text-white">2. Live Tick & Speed Test</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                We test order execution speed directly in London (LD5) and New York (NY4) data centers across MetaTrader 4/5, cTrader, and TradingView to confirm true ECN/NDD latency.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-950 border border-white/10 hover:border-indigo-500/50 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-sans font-black uppercase text-white">3. True Cost Breakdown</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                We measure total cost per lot (base spread + commission per side + overnight financing swap rates) so you know your exact trading cost before opening an account.
              </p>
            </div>
          </div>

          {/* Affiliate Disclosure Notice Banner */}
          <div className="max-w-4xl mx-auto">
            <AffiliateDisclosure />
          </div>
        </div>
      </section>

      {/* 3. DIRECTORY & HIGH-CONTRAST SEARCH/FILTER SECTION */}
      <section id="directory" className="py-20">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400 block mb-2">// DIRECTORY SEARCH</span>
              <h2 className="text-3xl sm:text-4xl font-sans font-black uppercase text-white">
                Filter & Compare Platforms
              </h2>
            </div>
            <div className="text-xs font-mono text-slate-400">
              Showing <span className="text-white font-bold">{filteredBrokers.length}</span> of <span className="text-white font-bold">{brokers.length}</span> Brokers
            </div>
          </div>

          {/* High-Contrast Search & Category Filters */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl mb-12 space-y-6">
            <div className="flex flex-col lg:flex-row gap-6 justify-between items-stretch lg:items-center">
              {/* High Contrast Search Bar */}
              <div className="relative flex-1">
                <div className="relative flex items-center">
                  <Search className="w-5 h-5 text-indigo-400 absolute left-4 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search by broker name, platform (e.g. TradingView, cTrader), or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-10 py-3.5 bg-slate-950 border-2 border-slate-700 hover:border-slate-600 focus:border-indigo-500 rounded-xl text-sm font-sans text-white placeholder-slate-400 focus:outline-none transition-all shadow-inner"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Category Pills with High Contrast */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  const count = getCategoryCount(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        "px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 border",
                        isSelected
                          ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30 scale-105"
                          : "bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-600 hover:text-white hover:bg-slate-900"
                      )}
                    >
                      <span>{cat}</span>
                      <span className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded-full font-sans font-black",
                        isSelected ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
                      )}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Brokers Grid */}
          {filteredBrokers.length === 0 ? (
            <div className="text-center py-20 bg-slate-900 border border-dashed border-slate-800 rounded-2xl space-y-4">
              <Search className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="text-lg font-sans font-bold uppercase text-white">No brokers match your query</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Try searching for another platform like &quot;TradingView&quot;, &quot;MT4&quot;, or switch category to &quot;All&quot;.
              </p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                className="mt-4 px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-xs font-mono uppercase font-bold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBrokers.map((broker) => {
                // Determine logo src
                let logoSrc = broker.logo;
                if (broker.id === "ig" || broker.slug === "ig") {
                  logoSrc = "/logos/brokers/ig-markets.svg";
                } else if (broker.id === "pepperstone" || broker.slug === "pepperstone") {
                  logoSrc = "/logos/brokers/pepperstone-light.svg";
                } else if (broker.id === "ic-markets" || broker.slug === "ic-markets") {
                  logoSrc = "/logos/brokers/ic-markets-light.svg";
                }

                const isTopThree = ["ig", "pepperstone", "ic-markets"].includes(broker.id) || ["ig", "pepperstone", "ic-markets"].includes(broker.slug);

                return (
                  <div
                    key={broker.id}
                    className={cn(
                      "bg-slate-900 border rounded-2xl p-7 transition-all duration-300 flex flex-col justify-between h-full group hover:-translate-y-1 shadow-xl relative overflow-hidden",
                      isTopThree ? "border-indigo-500/40 hover:border-indigo-500 shadow-indigo-500/10" : "border-slate-800 hover:border-slate-600"
                    )}
                  >
                    {/* Top Highlight Badge for featured brokers */}
                    {isTopThree && (
                      <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[9px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-bl-lg">
                        TOP VERIFIED
                      </div>
                    )}

                    <div className="space-y-6">
                      {/* Card Header (Logo & Rating) */}
                      <div className="flex justify-between items-center gap-4 pt-2">
                        <div className="h-10 flex items-center">
                          <img 
                            src={logoSrc} 
                            alt={broker.name} 
                            className="h-9 w-auto object-contain max-w-[140px]"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const sibling = e.currentTarget.nextElementSibling as HTMLElement;
                              if (sibling) sibling.style.display = 'flex';
                            }}
                          />
                          <div 
                            className="hidden px-3 py-1.5 items-center justify-center font-sans font-black text-white text-xs rounded-lg"
                            style={{ 
                              backgroundColor: 
                                broker.category === "Forex" ? "#0054FE" : 
                                broker.category === "Stocks" ? "#E01B1C" : 
                                broker.category === "Institutional" ? "#7A1CFC" : "#2C2F36" 
                            }}
                          >
                            {broker.name}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg text-amber-400 font-mono font-bold text-xs">
                          <Star className="w-3.5 h-3.5 fill-current" /> {broker.rating.toFixed(1)}
                        </div>
                      </div>

                      {/* Broker Name & Info */}
                      <div className="space-y-2">
                        <h3 className="text-xl font-sans font-black uppercase text-white group-hover:text-indigo-400 transition-colors">
                          {broker.name}
                        </h3>
                        <p className="text-xs text-slate-300 line-clamp-2 min-h-[36px] leading-relaxed">
                          {broker.oneLine}
                        </p>
                      </div>

                      {/* Specs Grid */}
                      <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-800 text-xs font-mono">
                        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                          <span className="text-slate-400 text-[10px] uppercase block mb-0.5">Spreads</span>
                          <span className="font-bold text-white">{broker.spreads}</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                          <span className="text-slate-400 text-[10px] uppercase block mb-0.5">Min Deposit</span>
                          <span className="font-bold text-white">{broker.minDeposit}</span>
                        </div>
                      </div>

                      {/* Platforms Tags */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block font-bold">Supported Platforms</span>
                        <div className="flex flex-wrap gap-1.5">
                          {broker.platforms.map((plat, idx) => (
                            <span 
                              key={idx} 
                              className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-[9px] font-mono uppercase tracking-wide rounded-md text-slate-300"
                            >
                              ⚡ {plat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer & CTA Buttons */}
                    <div className="space-y-4 mt-8 pt-4 border-t border-slate-800">
                      <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider">
                        <span className="text-slate-400 font-bold">Category: {broker.category}</span>
                        <span className={cn("flex items-center gap-1 font-bold", broker.fcaRegulated ? "text-emerald-400" : "text-slate-300")}>
                          <ShieldCheck className="w-3.5 h-3.5" /> {broker.fcaRegulated ? "FCA UK Regulated" : "Tier-1 Regulated"}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <Link
                          href={`/brokers/${broker.slug}`}
                          className="py-3 rounded-xl border border-slate-700 hover:border-white text-white hover:bg-white/10 transition-all text-center text-xs font-sans font-bold uppercase tracking-widest flex items-center justify-center gap-1"
                        >
                          Read Review <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                        <a
                          href={broker.affiliateUrl}
                          target="_blank"
                          rel="nofollow sponsored"
                          className="py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all text-center text-xs font-sans font-black uppercase tracking-widest flex items-center justify-center gap-1 shadow-lg shadow-indigo-600/20"
                        >
                          Open Acc <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
