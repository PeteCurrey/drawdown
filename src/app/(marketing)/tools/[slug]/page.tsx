"use client";

import { useParams, notFound } from "next/navigation";
import { 
  ArrowRight,
  ShieldCheck,
  Terminal,
  Activity,
  Zap,
  Quote,
  CheckCircle2,
  ChevronDown,
  Check
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { tools } from "@/data/tools";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { TrackPageView } from "@/components/admin/TrackPageView";

interface ToolTheme {
  accentColor: string;      // Tailwind text class
  accentColorHex: string;   // Hex color for glows
  baseGlowClass: string;    // Gradient start
  badgeBorderClass: string;
  badgeBgClass: string;
  buttonBgClass: string;
  shadowColor: string;
}

const THEME_MAP: Record<string, ToolTheme> = {
  "ai-trade-journal": {
    accentColor: "text-indigo-600",
    accentColorHex: "#6366f1",
    baseGlowClass: "from-indigo-600/10 via-white to-white",
    badgeBorderClass: "border-indigo-200 text-indigo-700 bg-indigo-50",
    badgeBgClass: "bg-indigo-500/5",
    buttonBgClass: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20",
    shadowColor: "shadow-indigo-500/10"
  },
  "risk-calculator": {
    accentColor: "text-emerald-600",
    accentColorHex: "#10b981",
    baseGlowClass: "from-emerald-600/10 via-white to-white",
    badgeBorderClass: "border-emerald-200 text-emerald-700 bg-emerald-50",
    badgeBgClass: "bg-emerald-500/5",
    buttonBgClass: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20",
    shadowColor: "shadow-emerald-500/10"
  },
  "ai-market-scanner": {
    accentColor: "text-cyan-600",
    accentColorHex: "#06b6d4",
    baseGlowClass: "from-cyan-600/10 via-white to-white",
    badgeBorderClass: "border-cyan-200 text-cyan-700 bg-cyan-50",
    badgeBgClass: "bg-cyan-500/5",
    buttonBgClass: "bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-600/20",
    shadowColor: "shadow-cyan-500/10"
  },
  "strategy-backtester": {
    accentColor: "text-rose-600",
    accentColorHex: "#f43f5e",
    baseGlowClass: "from-rose-600/10 via-white to-white",
    badgeBorderClass: "border-rose-200 text-rose-700 bg-rose-50",
    badgeBgClass: "bg-rose-500/5",
    buttonBgClass: "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20",
    shadowColor: "shadow-rose-500/10"
  },
  "intelligence-hub": {
    accentColor: "text-amber-600",
    accentColorHex: "#f59e0b",
    baseGlowClass: "from-amber-600/10 via-white to-white",
    badgeBorderClass: "border-amber-200 text-amber-700 bg-amber-50",
    badgeBgClass: "bg-amber-500/5",
    buttonBgClass: "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20",
    shadowColor: "shadow-amber-500/10"
  }
};

const DEFAULT_THEME: ToolTheme = {
  accentColor: "text-cyan-600",
  accentColorHex: "#06b6d4",
  baseGlowClass: "from-cyan-600/10 via-white to-white",
  badgeBorderClass: "border-cyan-200 text-cyan-700 bg-cyan-50",
  badgeBgClass: "bg-cyan-500/5",
  buttonBgClass: "bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-600/20",
  shadowColor: "shadow-cyan-500/10"
};

export default function ToolDetailPage() {
  const { slug } = useParams();
  const tool = tools.find(t => t.slug === slug);

  if (!tool) {
    notFound();
  }

  const theme = THEME_MAP[tool.slug] || DEFAULT_THEME;
  const Icon = tool.icon;

  // Pricing configuration for the subscription section
  const pricingTiers = [
    {
      name: "Foundation",
      price: "£49",
      period: "month",
      desc: "For traders building their process and knowledge base.",
      cta: "Join Foundation",
      highlight: false,
      badge: ["risk-calculator", "intelligence-hub", "market-charts"].includes(tool.slug) ? "Includes This Tool" : null,
      features: [
        "Position Sizer (Manual)",
        "Technical Charts",
        "Expert Intelligence Hub",
        "Weekly Live Video Overviews",
        "Complete Course Library",
        "Discord Community Access"
      ]
    },
    {
      name: "Edge",
      price: "£149",
      period: "month",
      desc: "For active traders seeking systematic, AI-powered edge.",
      cta: "Join Edge Tier",
      highlight: true,
      badge: ["ai-trade-journal", "ai-market-scanner", "strategy-backtester"].includes(tool.slug) ? "Includes This Tool" : null,
      features: [
        "AI Trade Journal Integration",
        "AI Market Scanner Access",
        "Strategy Backtester Access",
        "Daily Live Trading Sessions",
        "Bi-weekly Group Mentorship",
        "Everything in Foundation"
      ]
    },
    {
      name: "Floor",
      price: "£299",
      period: "month",
      desc: "Direct desk access and custom strategy automation.",
      cta: "Enter The Floor",
      highlight: false,
      badge: ["algo-strategy-builder"].includes(tool.slug) ? "Includes This Tool" : null,
      features: [
        "Algo Strategy Builder (No-Code)",
        "Monthly 1-to-1 Mentorship",
        "Custom AI Portfolio Auditing",
        "Private Small-Group Webinars",
        "Early Beta Tools Access",
        "Everything in Edge"
      ]
    }
  ];

  // Links to the other 4 tools
  const otherTools = tools.filter(t => t.slug !== tool.slug).slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen bg-white text-mkt-ink font-sans selection:bg-neutral-100 selection:text-mkt-ink">
      <TrackPageView path={`/tools/${tool.slug}`} />

      {/* 1. FULL-SCREEN HERO */}
      <section className="h-screen min-h-[650px] relative flex flex-col justify-center items-center overflow-hidden border-b border-mkt-bd select-none">
        {/* Subtle grid lines background overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:40px_40px] z-0 pointer-events-none" />
        
        {/* Soft radial glow overlay based on tool's theme */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none transition-all duration-1000"
          style={{
            backgroundImage: `radial-gradient(circle at center, ${theme.accentColorHex}0a 0%, transparent 65%)`
          }}
        />

        {/* Top Floating Breadcrumbs */}
        <div className="absolute top-28 left-0 right-0 z-20 max-w-7xl mx-auto px-6">
          <Breadcrumbs />
        </div>

        {/* Hero Content */}
        <div className="max-w-5xl mx-auto px-6 relative z-10 flex flex-col items-center text-center space-y-8 mt-12">
          {/* Animated System Header */}
          <div className="flex items-center gap-3 text-mkt-i4 transition-all duration-500 animate-pulse">
            <Terminal className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono uppercase tracking-[0.4em]">SYSTEM_MODULE // {tool.slug}</span>
          </div>

          {/* Dynamic Huge Title */}
          <h1 className="text-5xl md:text-8xl lg:text-[100px] font-sans font-black uppercase tracking-tighter leading-none text-mkt-ink max-w-4xl">
            {tool.title.split(' ').map((word, i) => (
              <span key={i} className={i === tool.title.split(' ').length - 1 ? theme.accentColor : "text-mkt-ink"}>
                {word}{" "}
              </span>
            ))}
          </h1>

          {/* Tagline */}
          <p className="text-lg md:text-2xl text-mkt-i3 font-sans font-light leading-relaxed max-w-3xl">
            {tool.tagline}
          </p>

          {/* Direct CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
            <Link 
              href="#subscriptions"
              className={cn(
                "px-10 py-5 font-sans font-black uppercase tracking-[0.2em] text-xs transition-all duration-300 transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2",
                theme.buttonBgClass
              )}
            >
              Get Access Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="#specifications"
              className="px-10 py-5 border border-mkt-bd hover:border-mkt-ink hover:bg-neutral-50 text-mkt-ink font-sans font-bold uppercase tracking-[0.2em] text-xs transition-all duration-300 flex items-center justify-center"
            >
              Explore Specifications
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-1.5 opacity-60 z-10 animate-bounce">
          <span className="text-[8px] font-mono uppercase tracking-widest text-mkt-i4">Scroll to Spec</span>
          <ChevronDown className="w-4 h-4 text-mkt-i4" />
        </div>
      </section>

      {/* 2. SPECIFICATIONS SECTION */}
      <section id="specifications" className="py-24 border-b border-mkt-bd scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left Column: Product Breakdown */}
            <div className="lg:col-span-8 space-y-20">
              
              {/* Problem Statement */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-mkt-i4">01_The_Problem</span>
                  <div className="h-px flex-grow bg-mkt-bd" />
                </div>
                <h2 className="text-3xl font-sans font-extrabold uppercase text-mkt-ink">
                  {tool.sections.problem.title}
                </h2>
                <p className="text-base text-mkt-i3 leading-relaxed max-w-3xl font-sans">
                  {tool.sections.problem.content}
                </p>
              </div>

              {/* How it Works (Numbered Grid) */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-mkt-i4">02_How_It_Works</span>
                  <div className="h-px flex-grow bg-mkt-bd" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {tool.sections.howItWorks.steps.map((step, i) => (
                    <div 
                      key={i} 
                      className="p-6 border border-mkt-bd rounded-[14px] bg-[#F9F9F9] hover:bg-white hover:shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:border-mkt-bds transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        <span className={cn("text-xs font-mono font-bold block mb-4", theme.accentColor)}>
                          [{i + 1}]
                        </span>
                        <h4 className="text-sm font-sans font-bold uppercase text-mkt-ink mb-2">
                          {step.title}
                        </h4>
                        <p className="text-xs text-mkt-i3 leading-relaxed font-sans">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deep Dive Content (Markdown Parser) */}
              <div className="space-y-8 pt-8 border-t border-mkt-bd/80">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-mkt-i4">03_Technical_DeepDive</span>
                  <div className="h-px flex-grow bg-mkt-bd" />
                </div>
                
                <div className="prose max-w-none text-mkt-i3 leading-relaxed font-sans">
                  <h3 className="text-2xl font-sans font-extrabold uppercase text-mkt-ink mb-8">
                    {tool.deepDive.title}
                  </h3>
                  
                  {tool.deepDive.content.split('\n\n').map((para, i) => {
                    const cleanPara = para.trim();
                    if (!cleanPara) return null;

                    if (cleanPara.startsWith('## ')) {
                      return (
                        <h4 key={i} className={cn("text-lg font-sans font-bold uppercase mt-12 mb-4", theme.accentColor)}>
                          {cleanPara.replace('## ', '')}
                        </h4>
                      );
                    }
                    if (cleanPara.startsWith('### ')) {
                      return (
                        <h5 key={i} className="text-sm font-sans font-bold uppercase text-mkt-ink mt-8 mb-3">
                          {cleanPara.replace('### ', '')}
                        </h5>
                      );
                    }
                    if (cleanPara.startsWith('* ')) {
                      return (
                        <ul key={i} className="space-y-3 my-6 pl-1">
                          {cleanPara.split('\n').map((li, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-xs text-mkt-i3">
                              <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5 shrink-0", theme.accentColor.replace('text-', 'bg-'))} />
                              <span>{li.replace('* ', '').trim()}</span>
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    return (
                      <p key={i} className="text-xs sm:text-sm leading-relaxed mb-6">
                        {cleanPara}
                      </p>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right Column: Context Sidebar */}
            <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-8">
              
              {/* Founder's Take Quote */}
              <div className="p-6 border border-mkt-bd rounded-[14px] bg-[#FDFDFD] relative overflow-hidden group">
                <Quote className={cn("absolute -top-4 -right-4 w-20 h-20 opacity-[0.04]", theme.accentColor)} />
                <p className="text-xs italic text-mkt-i2 leading-relaxed relative z-10 mb-6 font-sans">
                  "{tool.sections.peteTake}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-[10px] font-bold text-mkt-ink">
                    P
                  </div>
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-mkt-ink block font-bold">Pete Currey</span>
                    <span className="text-[8px] font-mono uppercase tracking-widest text-mkt-i4 block">Founder // Drawdown</span>
                  </div>
                </div>
              </div>

              {/* AI Powered Callout */}
              <div className="p-6 border border-mkt-bd rounded-[14px] bg-[#FAF8FF] relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.01] to-transparent pointer-events-none" />
                <div className="relative z-10 space-y-3">
                  <h3 className={cn("text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-2", theme.accentColor)}>
                    <Zap className="w-3.5 h-3.5" /> {tool.sections.aiPowered.title}
                  </h3>
                  <p className="text-xs text-mkt-i3 leading-relaxed font-sans">
                    {tool.sections.aiPowered.content}
                  </p>
                </div>
              </div>

              {/* Feature List */}
              <div className="space-y-4 pt-4 border-t border-mkt-bd">
                <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-mkt-i4">
                  {tool.sections.features.title}
                </h3>
                <div className="space-y-4">
                  {tool.sections.features.items.map((item, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-mkt-grn shrink-0" />
                        <span className="text-xs font-sans font-bold text-mkt-ink tracking-tight uppercase">
                          {item.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-mkt-i3 leading-relaxed ml-5.5 font-sans">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Who It's For */}
              <div className="space-y-3 pt-6 border-t border-mkt-bd">
                <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-mkt-i4">
                  {tool.sections.whoItIsFor.title}
                </h3>
                <p className="text-xs text-mkt-i3 leading-relaxed font-sans">
                  {tool.sections.whoItIsFor.content}
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3. SUBSCRIPTIONS SECTION */}
      <section id="subscriptions" className="py-24 bg-[#FAF9F6] border-b border-mkt-bd scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-[10px] font-mono tracking-widest uppercase text-mkt-i4 font-bold block">
              // INTEGRATION GATEWAY
            </span>
            <h2 className="text-3xl md:text-5xl font-sans font-black uppercase text-mkt-ink leading-tight">
              Select Your Access Tier
            </h2>
            <p className="text-sm text-mkt-i3 leading-relaxed font-sans">
              All tools are fully integrated into our unified Client Dashboard. Choose a plan below to secure immediate license allocation.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            {pricingTiers.map((tier) => {
              const hasBadge = tier.badge != null;
              
              return (
                <div 
                  key={tier.name}
                  className={cn(
                    "bg-white border rounded-[14px] p-8 flex flex-col justify-between transition-all duration-300 relative",
                    tier.highlight 
                      ? "border-accent shadow-[0_12px_40px_rgba(6,182,212,0.08)] scale-[1.02]" 
                      : "border-mkt-bd hover:border-mkt-bds"
                  )}
                >
                  {/* Recommended Badge on Card */}
                  {hasBadge && (
                    <span 
                      className={cn(
                        "absolute -top-3 left-6 text-[9px] font-mono font-bold px-3 py-1 rounded border uppercase tracking-wider",
                        tier.highlight
                          ? "text-accent bg-cyan-50 border-accent/25"
                          : "text-mkt-ink bg-neutral-100 border-neutral-250"
                      )}
                    >
                      {tier.badge}
                    </span>
                  )}

                  {/* Header info */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-sans font-bold text-mkt-ink uppercase tracking-tight">
                        {tier.name}
                      </span>
                    </div>

                    <div className="flex items-baseline mb-6">
                      <span className="text-4xl font-sans font-black text-mkt-ink">{tier.price}</span>
                      <span className="text-xs text-mkt-i4 ml-2 font-mono font-medium uppercase">/ {tier.period}</span>
                    </div>

                    <p className="text-xs text-mkt-i3 leading-relaxed mb-6 font-sans h-10 border-b border-mkt-bd pb-4">
                      {tier.desc}
                    </p>

                    {/* Features list */}
                    <ul className="space-y-3 mb-8">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-mkt-i3 font-sans">
                          <Check className="w-3.5 h-3.5 text-mkt-grn shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Button */}
                  <Link 
                    href="/signup"
                    className={cn(
                      "w-full py-4 text-center font-sans font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-300 hover:translate-y-[-1px]",
                      tier.highlight
                        ? "bg-accent hover:bg-cyan-500 text-mkt-ink shadow-md"
                        : "bg-mkt-ink hover:bg-neutral-800 text-white"
                    )}
                  >
                    {tier.cta}
                  </Link>

                </div>
              );
            })}
          </div>

          {/* Refund Notice */}
          <div className="text-center mt-12">
            <p className="text-[10px] font-mono text-mkt-i4 uppercase tracking-widest">
              Secure Checkout // SSL Encrypted // Cancel Anytime in 1-Click
            </p>
          </div>

        </div>
      </section>

      {/* 4. COMPONENT MATRIX (INTER-LINKING SECTION) */}
      <section className="py-24 bg-white border-b border-mkt-bd">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="mb-16">
            <span className="text-[10px] font-mono tracking-widest uppercase text-mkt-i4 font-bold block mb-4">
              // COMPONENT MATRIX
            </span>
            <h2 className="text-3xl md:text-5xl font-sans font-extrabold text-mkt-ink uppercase tracking-tight">
              Explore Other Core Tools
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherTools.map((oTool) => {
              const oTheme = THEME_MAP[oTool.slug] || DEFAULT_THEME;
              const OIcon = oTool.icon;
              
              return (
                <Link 
                  href={`/tools/${oTool.slug}`}
                  key={oTool.slug}
                  className="bg-white border border-mkt-bd rounded-[14px] p-6 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:border-mkt-bds transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Bar: Icon */}
                    <div className="mb-6 flex justify-between items-start">
                      <div className={cn("p-2.5 rounded-lg border", oTheme.badgeBorderClass)}>
                        <OIcon className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-sm font-sans font-bold text-mkt-ink uppercase tracking-tight mb-2 group-hover:text-cyan-500 transition-colors">
                      {oTool.title}
                    </h3>
                    <p className="text-[11px] text-mkt-i3 leading-relaxed font-sans mb-6">
                      {oTool.description}
                    </p>
                  </div>

                  {/* bottom arrow link */}
                  <div className="flex items-center gap-1.5 text-[9px] font-sans font-black uppercase tracking-widest text-mkt-i3 group-hover:text-accent transition-colors pt-4 border-t border-mkt-bd">
                    Explore Spec <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>

                </Link>
              );
            })}
          </div>

        </div>
      </section>

    </div>
  );
}
