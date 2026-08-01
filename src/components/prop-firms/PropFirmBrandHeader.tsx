"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Shield, ExternalLink, Star, ChevronRight, Zap, Award, Layers, Sparkles, Clock, CheckCircle2, TrendingUp } from "lucide-react";

interface PropFirmBrandHeaderProps {
  review: any;
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
  logoDarkBg?: string;
  logoLightBg?: string;
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

export function getPropFirmBrandConfig(reviewSlug: string, reviewName: string): BrandConfig {
  const cleanId = reviewSlug.toLowerCase();

  if (cleanId === "ftmo") {
    return {
      brandName: "FTMO",
      tagline: "The Uncontested Gold Standard of Prop Firm Funding Since 2015",
      badge: "ESTABLISHED 2015 // IMPECCABLE PAYOUT RECORD",
      primaryColor: "#00E5FF",
      accentGlow: "rgba(0, 229, 255, 0.25)",
      bgGradient: "from-[#080B12] via-[#0E162B] to-[#080B12]",
      cardBorder: "border-[#00E5FF]/30",
      cardBg: "bg-[#101935]/90",
      logoDarkBg: "/prop-firms/ftmo-light.svg",
      logoLightBg: "/prop-firms/ftmo-dark.svg",
      heroPills: [
        "100% Impeccable Payout Record",
        "No Evaluation Time Limits",
        "FCA-Grade STP Execution",
        "Bi-Weekly Payout Frequency"
      ],
      stats: [
        { label: "Prop Score", value: "4.9 / 5.0 Rating", highlight: true },
        { label: "Profit Target", value: "10% Step 1, 5% Step 2" },
        { label: "Max Overall Loss", value: "10% Static Floor" },
        { label: "Entry Fee", value: "Refundable from €155" }
      ],
      spotlightTitle: "Legendary 9-Year Payout Track Record & Dynamic Tools",
      spotlightDesc: "FTMO is the longest-standing major prop firm in the space. They maintain a pristine reputation for sending wire transfers, Wise, and crypto payouts in under 24 hours, alongside providing custom trading apps (Mentor, MetriX).",
      spotlightBadges: [
        { title: "Pristine Payout Record", desc: "$150M+ processed reliably with zero delay issues", icon: Award },
        { title: "Static Max Loss", desc: "10% static overall limit (does not trail your balance)", icon: Layers },
        { title: "Premium Desk Tools", desc: "Access custom-built Mentor App, Margin Calc & Quick Trade", icon: Zap }
      ],
      costCalc: {
        spread: "Raw STP Spreads",
        commission: "$3.00/side ($6.00 round-turn)",
        totalCostPerLot: "Refundable Registration Fee",
        executionSpeed: "< 10ms"
      }
    };
  }

  if (cleanId === "the5ers" || cleanId === "5ers") {
    return {
      brandName: "The5%ers",
      tagline: "The Best Swing-Trading Rules & Growth Engine in the Market",
      badge: "ESTABLISHED 2016 // SCALE-TO-$4,000,000 PLATFORM",
      primaryColor: "#FF5A00",
      accentGlow: "rgba(255, 90, 0, 0.25)",
      bgGradient: "from-[#0D0A08] via-[#21140E] to-[#0D0A08]",
      cardBorder: "border-[#FF5A00]/30",
      cardBg: "bg-[#28170E]/90",
      logoDarkBg: "/prop-firms/the5ers-light.svg",
      logoLightBg: "/prop-firms/the5ers-dark.svg",
      heroPills: [
        "Real Capital instant allocation",
        "Milestones double to $4M",
        "Swing-friendly weekend holding",
        "Bootcamp entry from just $39"
      ],
      stats: [
        { label: "Growth Score", value: "4.8 / 5.0 Rating", highlight: true },
        { label: "Max Funding Ceiling", value: "Scale to $4,000,000" },
        { label: "Weekend Holding", value: "Allowed on all accounts" },
        { label: "Consistency Rules", value: "Highly trader-centric" }
      ],
      spotlightTitle: "Instant Real Money Allocation & Industry-Leading Scaling Plan",
      spotlightDesc: "The5%ers focus on developer growth. Their Hyper-Growth model allows you to manage actual real money from step one, doubling your account size at every 10% profit milestone up to a massive $4,000,000.",
      spotlightBadges: [
        { title: "Double Account Scaling", desc: "Account sizes double at every 10% milestone up to $4M", icon: Award },
        { title: "No Time Limits", desc: "Trade at your own pace without pressure", icon: Layers },
        { title: "Low Bootcamp Entry", desc: "Prove your edge for just $39 before paying full cost", icon: Zap }
      ],
      costCalc: {
        spread: "Tight STP Market Spreads",
        commission: "$4.00/side ($8.00 round-turn)",
        totalCostPerLot: "No Evaluation for Hyper-Growth",
        executionSpeed: "< 15ms"
      }
    };
  }

  if (cleanId === "funding-pips") {
    return {
      brandName: "Funding Pips",
      tagline: "The Budget Leader for Undercapitalized Traders & 5-Day Payout Cycles",
      badge: "ESTABLISHED 2022 // RETAIL COMMUNITY FAVORITE",
      primaryColor: "#00F5A0",
      accentGlow: "rgba(0, 245, 160, 0.25)",
      bgGradient: "from-[#020C09] via-[#09241C] to-[#020C09]",
      cardBorder: "border-[#00F5A0]/30",
      cardBg: "bg-[#0A261E]/90",
      logoDarkBg: "/prop-firms/funding-pips-light.svg",
      logoLightBg: "/prop-firms/funding-pips-dark.svg",
      heroPills: [
        "Refundable fees from $32",
        "No Minimum Trading Days",
        "cTrader & MatchTrader Platforms",
        "Rapid 5-Day Payout Cycle"
      ],
      stats: [
        { label: "Budget Score", value: "4.7 / 5.0 Rating", highlight: true },
        { label: "Evaluation Entry", value: "From $32 (100% Refundable)" },
        { label: "Max Overall Loss", value: "10% Static Floor" },
        { label: "Payout Frequency", value: "Every 5 Days" }
      ],
      spotlightTitle: "Low-Cost Challenges, High-End Execution & cTrader Access",
      spotlightDesc: "Funding Pips is the undisputed budget leader of the prop firm space. By eliminating minimum trading days and offering a short 5-day payout cycle, it is optimized for high-volume retail traders looking to pass quickly and pull profits.",
      spotlightBadges: [
        { title: "Vibrant Tech Stack", desc: "Robust direct integration with cTrader & MatchTrader", icon: Award },
        { title: "No Minimum Days", desc: "Pass both evaluation phases in a single day if rules met", icon: Layers },
        { title: "Rapid 5-Day Payouts", desc: "Receive processed profits twice a week with zero delay", icon: Zap }
      ],
      costCalc: {
        spread: "Tight Raw MatchTrader Spreads",
        commission: "$2.00/side ($4.00 round-turn)",
        totalCostPerLot: "Refundable Evaluation Fee",
        executionSpeed: "< 12ms"
      }
    };
  }

  // Fallback / Purple theme
  return {
    brandName: reviewName,
    tagline: `Professional Evaluation and Scaling Programs with ${reviewName}`,
    badge: "VERIFIED FUNDING PARTNER",
    primaryColor: "#7C3AED",
    accentGlow: "rgba(124, 58, 237, 0.25)",
    bgGradient: "from-[#0B0914] via-[#1C1530] to-[#0B0914]",
    cardBorder: "border-[#7C3AED]/30",
    cardBg: "bg-[#18122B]/90",
    heroPills: [
      "Flexible Challenge rules",
      "Refundable Evaluation fees",
      "Up to 90% Profit Split",
      "Rapid Client Support"
    ],
    stats: [
      { label: "Firm Score", value: "4.7 / 5.0 Rating", highlight: true },
      { label: "Target", value: "Standard 8-10% Targets" },
      { label: "Max Loss", value: "8-10% Overall Limit" },
      { label: "Fee Structure", value: "Refundable Registration" }
    ],
    spotlightTitle: "Structured Growth & Institutional Funding Platform",
    spotlightDesc: `${reviewName} offers competitive funding evaluations tailored to retail traders. Their dashboard, support, and scaling plans are designed to help you succeed in managing capital.`,
    spotlightBadges: [
      { title: "Professional Portals", desc: "Modern metrics, statistics, and consistency tracking", icon: Award },
      { title: "Flexible Drawdowns", desc: "Standard daily limits and static overall loss rules", icon: Layers },
      { title: "Fast Capital Scale", desc: "Scale your account as you achieve target percentages", icon: Zap }
    ],
    costCalc: {
      spread: "Standard STP Spreads",
      commission: "$3.50/side ($7.00 round-turn)",
      totalCostPerLot: "Refundable Registration Fee",
      executionSpeed: "< 15ms"
    }
  };
}

export function PropFirmBrandHeader({ review, slug }: PropFirmBrandHeaderProps) {
  const brand = getPropFirmBrandConfig(slug, review.name);
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
            <Link href="/prop-firms" className="hover:text-white transition-colors">Prop Firms</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-bold">{brand.brandName} Review</span>
          </nav>

          <div 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-mono font-black uppercase tracking-widest border"
            style={{ 
              backgroundColor: `${brand.primaryColor}15`, 
              borderColor: `${brand.primaryColor}40`,
              color: brand.primaryColor === "#00F5A0" ? "#00F5A0" : brand.primaryColor === "#00E5FF" ? "#00E5FF" : brand.primaryColor === "#FF5A00" ? "#F97316" : "#A78BFA"
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
            {brand.logoDarkBg ? (
              <div className="inline-block p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl">
                <img 
                  src={brand.logoDarkBg} 
                  alt={`${brand.brandName} Official Logo`} 
                  className="h-10 w-auto object-contain"
                  style={{ maxHeight: "40px" }}
                />
              </div>
            ) : (
              <div className="inline-block px-5 py-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl font-sans font-black text-2xl uppercase tracking-wider">
                {brand.brandName}
              </div>
            )}

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
                href={`/go/${slug}`}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="px-8 py-4 font-sans font-black text-xs uppercase tracking-widest text-slate-950 transition-all duration-300 rounded-lg shadow-xl hover:scale-[1.02] flex items-center gap-3"
                style={{ 
                  backgroundColor: brand.primaryColor === "#00F5A0" ? "#00F5A0" : brand.primaryColor === "#00E5FF" ? "#00E5FF" : brand.primaryColor === "#FF5A00" ? "#FF5A00" : "#7C3AED",
                  color: brand.primaryColor === "#FF5A00" ? "#FFFFFF" : "#040D0A"
                }}
              >
                Start Challenge <ExternalLink className="w-4 h-4" />
              </a>

              <div className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-xs font-mono text-slate-300">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="font-bold text-white text-sm">{review.rating} / 5.0</span>
                <span className="text-slate-400">Pete&apos;s Rating</span>
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
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">Verified Specifications</span>
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
                      <span className={`text-sm font-sans font-black ${st.highlight ? "text-white" : "text-slate-200"}`}>
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
                    <span className="text-slate-400">Trading Spreads:</span>
                    <span className="text-white font-bold">{brand.costCalc.spread}</span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg flex justify-between">
                    <span className="text-slate-400">Commission (per Lot):</span>
                    <span className="text-white font-bold">{brand.costCalc.commission}</span>
                  </div>
                  <div className="p-3.5 bg-white/10 rounded-lg flex justify-between border border-white/15">
                    <span className="text-slate-200 font-bold uppercase">Registration Cost:</span>
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
                  &quot;{review.verdict}&quot;
                </p>
              </div>

              {/* Direct Open Button */}
              <a
                href={`/go/${slug}`}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="w-full py-4 text-center font-sans font-black text-xs uppercase tracking-widest text-white rounded-lg transition-all flex items-center justify-center gap-2 hover:brightness-110"
                style={{ 
                  backgroundColor: brand.primaryColor === "#00F5A0" ? "#00A382" : brand.primaryColor === "#00E5FF" ? "#0054FE" : brand.primaryColor === "#FF5A00" ? "#C2410C" : "#5B21B6"
                }}
              >
                Visit Official Prop Firm <ExternalLink className="w-3.5 h-3.5" />
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
