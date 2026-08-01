"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Shield, ExternalLink, Star, ChevronRight, Zap, Award, Layers, Sparkles, Clock, CheckCircle2, TrendingUp } from "lucide-react";
import { Broker } from "@/data/brokers";

interface BrokerBrandHeaderProps {
  broker: Broker;
  slug: string;
}

export interface BrandConfig {
  brandName: string;
  tagline: string;
  badge: string;
  primaryColor: string;
  accentGlow: string;
  bgGradient: string;
  cardBorder: string;
  cardBg: string;
  logoDarkBg: string;
  logoLightBg: string;
  heroPills: string[];
  stats: { label: string; value: string; highlight?: boolean }[];
  spotlightTitle: string;
  spotlightDesc: string;
  spotlightBadges: { title: string; desc: string; icon: any }[];
  costCalc?: {
    spread: string;
    commission: string;
    totalCostPerLot: string;
    executionSpeed: string;
  };
}

export function getBrandConfig(brokerId: string): BrandConfig {
  const cleanId = brokerId.toLowerCase().replace("-review", "");

  if (cleanId.includes("ig")) {
    return {
      brandName: "IG Markets",
      tagline: "The Gold Standard for UK Spread Betting, CFDs & Multi-Asset Access",
      badge: "FTSE 250 LISTED // EST. 1974 LONDON",
      primaryColor: "#E01B1C",
      accentGlow: "rgba(224, 27, 28, 0.25)",
      bgGradient: "from-[#080B12] via-[#141824] to-[#080B12]",
      cardBorder: "border-[#E01B1C]/30",
      cardBg: "bg-[#111728]/90",
      logoDarkBg: "/logos/brokers/ig-markets.svg",
      logoLightBg: "/logos/brokers/ig-markets.svg",
      heroPills: [
        "FCA Authorized & FSCS £85k",
        "100% Tax-Free Spread Betting",
        "17,000+ Global Markets",
        "ProRealTime & L2 DMA"
      ],
      stats: [
        { label: "UK Regulation", value: "FCA (LSE: IGG)", highlight: true },
        { label: "Min Deposit", value: "£0 Minimum" },
        { label: "Spread Betting", value: "0.6 pips (Tax-Free)" },
        { label: "Asset Selection", value: "17,000+ Instruments" }
      ],
      spotlightTitle: "UK Tax-Free Spread Betting & Institutional Security",
      spotlightDesc: "IG Markets has led the UK retail trading market for over 50 years. For UK residents, IG offers spread betting with zero Capital Gains Tax and zero Stamp Duty, backed by a FTSE 250 listed parent company.",
      spotlightBadges: [
        { title: "Tax-Free Profits", desc: "No CGT or Stamp Duty on spread betting gains", icon: Award },
        { title: "17,000+ Markets", desc: "Indices, Forex, Shares, Commodities & Options", icon: Layers },
        { title: "ProRealTime & DMA", desc: "Institutional charting & L2 Direct Market Access", icon: Zap }
      ],
      costCalc: {
        spread: "0.6 pips (EUR/USD)",
        commission: "£0.00 (Spread Betting)",
        totalCostPerLot: "£6.00 / Lot",
        executionSpeed: "< 50ms"
      }
    };
  }

  if (cleanId.includes("ic")) {
    return {
      brandName: "IC Markets",
      tagline: "True ECN Raw Spreads from 0.0 Pips with Sub-1ms Latency",
      badge: "TRUE ECN LIQUIDITY // EQUINIX NY4 SERVERS",
      primaryColor: "#00FF87",
      accentGlow: "rgba(0, 255, 135, 0.22)",
      bgGradient: "from-[#020B08] via-[#071D17] to-[#020B08]",
      cardBorder: "border-[#00A382]/40",
      cardBg: "bg-[#061813]/90",
      logoDarkBg: "/logos/brokers/ic-markets-light.svg",
      logoLightBg: "/logos/brokers/ic-markets.svg",
      heroPills: [
        "True ECN Raw Spreads",
        "Sub-1ms NY4 Latency",
        "ASIC & CySEC Tier-1",
        "Zero Restrictions on EAs"
      ],
      stats: [
        { label: "Raw Spreads", value: "From 0.0 Pips", highlight: true },
        { label: "Server Latency", value: "< 1ms (NY4 / LD5)" },
        { label: "Commission", value: "$3.50/lot ($7 round-turn)" },
        { label: "Platforms", value: "MT4, MT5, cTrader, TV" }
      ],
      spotlightTitle: "Institutional NY4 Equinix Infrastructure & Deep ECN Pool",
      spotlightDesc: "IC Markets connects directly to 25+ top-tier liquidity providers inside New York (NY4) and London (LD5) data centers, delivering ultra-tight raw spreads and zero dealing-desk intervention.",
      spotlightBadges: [
        { title: "<1ms Execution", desc: "Hosted in Equinix NY4 & LD5 data centers", icon: Clock },
        { title: "Raw 0.0 Pips", desc: "Direct interbank pricing with low $3.50 commission", icon: Sparkles },
        { title: "Scalper Friendly", desc: "No stop-distance limits, unrestricted EA trading", icon: Zap }
      ],
      costCalc: {
        spread: "0.0 pips (EUR/USD)",
        commission: "$7.00 Round-Turn ($3.50/side)",
        totalCostPerLot: "$7.00 / Lot",
        executionSpeed: "< 1ms"
      }
    };
  }

  // Pepperstone (Default for Pepperstone)
  return {
    brandName: "Pepperstone",
    tagline: "Our Top Pick for Dedicated Forex Traders & TradingView Direct Execution",
    badge: "RAZOR PRECISION // TRADINGVIEW NATIVE PARTNER",
    primaryColor: "#0064FA",
    accentGlow: "rgba(0, 100, 250, 0.25)",
    bgGradient: "from-[#040A1D] via-[#0A1538] to-[#040A1D]",
    cardBorder: "border-[#0064FA]/40",
    cardBg: "bg-[#08153A]/90",
    logoDarkBg: "/logos/brokers/pepperstone-light.svg",
    logoLightBg: "/logos/brokers/pepperstone.svg",
    heroPills: [
      "TradingView Native Integration",
      "Razor 0.0 Pip Account",
      "FCA Regulated & FSCS £85k",
      "Capitalise.ai Automation"
    ],
    stats: [
      { label: "Razor Spreads", value: "From 0.0 Pips", highlight: true },
      { label: "Execution Speed", value: "Sub-30ms Average" },
      { label: "FCA Regulation", value: "FCA (UK) + ASIC (AU)" },
      { label: "Platforms", value: "TradingView, cTrader, MT4/5" }
    ],
    spotlightTitle: "Direct TradingView Integration & Razor Account Superiority",
    spotlightDesc: "Pepperstone allows traders to analyze charts and execute orders directly within TradingView without leaving the platform. Combined with their sub-30ms execution speed, it is the setup favored by serious technical traders.",
    spotlightBadges: [
      { title: "TradingView Direct", desc: "Trade straight from your TradingView charts", icon: Zap },
      { title: "Razor Spreads", desc: "Raw pricing from 0.0 pips with low £2.25 side commission", icon: Sparkles },
      { title: "FCA & FSCS", desc: "Full UK client money segregation & £85k protection", icon: Shield }
    ],
    costCalc: {
      spread: "0.0 pips (EUR/USD)",
      commission: "£4.50 Round-Turn (£2.25/side)",
      totalCostPerLot: "£4.50 / Lot",
      executionSpeed: "< 30ms"
    }
  };
}

export function BrokerBrandHeader({ broker, slug }: BrokerBrandHeaderProps) {
  const brand = getBrandConfig(broker.id || slug);
  const [activeTab, setActiveTab] = useState<"overview" | "calculator">("overview");

  return (
    <header className={`relative pt-32 pb-20 bg-gradient-to-b ${brand.bgGradient} text-white overflow-hidden border-b border-white/10`}>
      {/* Background ambient radial glow */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-[140px] pointer-events-none z-0 opacity-70"
        style={{ background: brand.accentGlow }}
      />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none z-0" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Top Breadcrumb & Badge */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/brokers" className="hover:text-white transition-colors">Brokers</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-bold">{brand.brandName} Review</span>
          </nav>

          <div 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-mono font-black uppercase tracking-widest border"
            style={{ 
              backgroundColor: `${brand.primaryColor}15`, 
              borderColor: `${brand.primaryColor}40`,
              color: brand.primaryColor === "#00FF87" ? "#00FF87" : brand.primaryColor === "#0064FA" ? "#60A5FA" : "#FF6B6B"
            }}
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            {brand.badge}
          </div>
        </div>

        {/* Main Hero Header Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Logo, H1, Tagline, Hero Pills */}
          <div className="lg:col-span-7 space-y-6">
            {/* Prominent Official SVG Logo */}
            <div className="inline-block p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl">
              <Image 
                src={brand.logoDarkBg} 
                alt={`${brand.brandName} Official Logo`} 
                width={220} 
                height={50} 
                className="h-10 w-auto object-contain"
                priority
              />
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-sans font-black uppercase tracking-tight leading-[0.95]">
              {brand.brandName} <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">Review 2026</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 font-medium leading-relaxed max-w-2xl">
              {brand.tagline}
            </p>

            {/* Hero Pills / Badges */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              {brand.heroPills.map((pill, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-2 px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-mono font-medium text-slate-200"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: brand.primaryColor }} />
                  <span>{pill}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href={`/go/${broker.slug}`}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="px-8 py-4 font-sans font-black text-xs uppercase tracking-widest text-slate-950 transition-all duration-300 rounded-lg shadow-xl hover:scale-[1.02] flex items-center gap-3"
                style={{ backgroundColor: brand.primaryColor === "#00FF87" ? "#00FF87" : brand.primaryColor === "#0064FA" ? "#3B82F6" : "#E01B1C", color: brand.primaryColor === "#00FF87" ? "#040D0A" : "#FFFFFF" }}
              >
                Open {brand.brandName} Account <ExternalLink className="w-4 h-4" />
              </a>

              <div className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-xs font-mono text-slate-300">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="font-bold text-white text-sm">{broker.rating} / 5.0</span>
                <span className="text-slate-400">Pete&apos;s Verified Rating</span>
              </div>
            </div>
          </div>

          {/* Right Column: Key Stats Card & Interactive Cost Spotlight */}
          <div className="lg:col-span-5">
            <div className={`p-8 rounded-2xl ${brand.cardBg} backdrop-blur-xl border ${brand.cardBorder} shadow-2xl space-y-6 relative overflow-hidden`}>
              <div 
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-40"
                style={{ background: brand.primaryColor }}
              />

              {/* Card Switcher Header */}
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: brand.primaryColor }} />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">Verified Specification</span>
                </div>
                <div className="flex gap-1 bg-white/5 p-1 rounded-lg border border-white/10 text-[10px] font-mono">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`px-3 py-1 rounded transition-colors ${activeTab === "overview" ? "bg-white/20 text-white font-bold" : "text-slate-400 hover:text-white"}`}
                  >
                    Metrics
                  </button>
                  {brand.costCalc && (
                    <button
                      onClick={() => setActiveTab("calculator")}
                      className={`px-3 py-1 rounded transition-colors ${activeTab === "calculator" ? "bg-white/20 text-white font-bold" : "text-slate-400 hover:text-white"}`}
                    >
                      Trading Cost
                    </button>
                  )}
                </div>
              </div>

              {/* Tab 1: Key Stats Grid */}
              {activeTab === "overview" && (
                <div className="grid grid-cols-2 gap-4">
                  {brand.stats.map((st, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-colors">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-1">{st.label}</span>
                      <span className={`text-base font-sans font-black ${st.highlight ? "text-white" : "text-slate-200"}`}>
                        {st.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 2: Cost Estimator */}
              {activeTab === "calculator" && brand.costCalc && (
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 bg-white/5 rounded-lg flex justify-between">
                    <span className="text-slate-400">Base EUR/USD Spread:</span>
                    <span className="text-white font-bold">{brand.costCalc.spread}</span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg flex justify-between">
                    <span className="text-slate-400">Commission (per Lot):</span>
                    <span className="text-white font-bold">{brand.costCalc.commission}</span>
                  </div>
                  <div className="p-3.5 bg-white/10 rounded-lg flex justify-between border border-white/15">
                    <span className="text-slate-200 font-bold uppercase">Estimated Cost / Lot:</span>
                    <span className="font-sans font-black text-sm" style={{ color: brand.primaryColor }}>
                      {brand.costCalc.totalCostPerLot}
                    </span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg flex justify-between">
                    <span className="text-slate-400">Avg Execution Latency:</span>
                    <span className="text-white font-bold">{brand.costCalc.executionSpeed}</span>
                  </div>
                </div>
              )}

              {/* Highlight Callout Box */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                <TrendingUp className="w-5 h-5 shrink-0 mt-0.5" style={{ color: brand.primaryColor }} />
                <p className="text-xs text-slate-300 leading-relaxed italic m-0">
                  &quot;{broker.oneLine}&quot;
                </p>
              </div>

              {/* Direct Open Button */}
              <a
                href={`/go/${broker.slug}`}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="w-full py-4 text-center font-sans font-black text-xs uppercase tracking-widest text-white rounded-lg transition-all flex items-center justify-center gap-2 hover:brightness-110"
                style={{ backgroundColor: brand.primaryColor === "#00FF87" ? "#00A382" : brand.primaryColor === "#0064FA" ? "#0054FE" : "#E01B1C" }}
              >
                Visit {brand.brandName} Site <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Feature Spotlight Bar below main hero */}
        <div className="mt-16 pt-12 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {brand.spotlightBadges.map((badge, idx) => {
            const IconComp = badge.icon;
            return (
              <div 
                key={idx} 
                className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex items-start gap-4"
              >
                <div 
                  className="p-3 rounded-lg bg-white/5 shrink-0 border border-white/10"
                  style={{ color: brand.primaryColor }}
                >
                  <IconComp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-sans font-bold text-white uppercase tracking-tight mb-1">{badge.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{badge.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
}
