"use client";

import { use } from "react";
import { phases, phaseIconMap } from "@/data/courses";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { 
  ChevronRight, 
  Clock, 
  Layers, 
  Shield, 
  Target, 
  Zap, 
  Globe,
  Quote,
  CheckCircle2,
  Terminal,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  Check
} from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { notFound } from "next/navigation";
import { StructuredData } from "@/components/StructuredData";

interface Props {
  params: Promise<{ slug: string }>;
}

interface PhaseTheme {
  color: string;
  colorHex: string;
  borderClass: string;
  glowClass: string;
  buttonBgClass: string;
}

const THEME_MAP: Record<string, PhaseTheme> = {
  "ground-zero": {
    color: "text-slate-600",
    colorHex: "#64748b",
    borderClass: "border-slate-200 text-slate-700 bg-slate-50",
    glowClass: "from-slate-600/10 via-white to-white",
    buttonBgClass: "bg-slate-600 hover:bg-slate-700 text-white shadow-slate-600/20"
  },
  "chart-reader": {
    color: "text-emerald-600",
    colorHex: "#10b981",
    borderClass: "border-emerald-200 text-emerald-700 bg-emerald-50",
    glowClass: "from-emerald-600/10 via-white to-white",
    buttonBgClass: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
  },
  "strategist": {
    color: "text-indigo-600",
    colorHex: "#6366f1",
    borderClass: "border-indigo-200 text-indigo-700 bg-indigo-50",
    glowClass: "from-indigo-600/10 via-white to-white",
    buttonBgClass: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20"
  },
  "risk-manager": {
    color: "text-rose-600",
    colorHex: "#f43f5e",
    borderClass: "border-rose-200 text-rose-700 bg-rose-50",
    glowClass: "from-rose-600/10 via-white to-white",
    buttonBgClass: "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20"
  },
  "mind-over-market": {
    color: "text-purple-600",
    colorHex: "#a855f7",
    borderClass: "border-purple-200 text-purple-700 bg-purple-50",
    glowClass: "from-purple-600/10 via-white to-white",
    buttonBgClass: "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/20"
  },
  "the-edge": {
    color: "text-cyan-600",
    colorHex: "#06b6d4",
    borderClass: "border-cyan-200 text-cyan-700 bg-cyan-50",
    glowClass: "from-cyan-600/10 via-white to-white",
    buttonBgClass: "bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-600/20"
  }
};

const DEFAULT_THEME: PhaseTheme = {
  color: "text-cyan-600",
  colorHex: "#06b6d4",
  borderClass: "border-cyan-200 text-cyan-700 bg-cyan-50",
  glowClass: "from-cyan-600/10 via-white to-white",
  buttonBgClass: "bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-600/20"
};

export default function CourseLandingPage({ params }: Props) {
  const { slug } = use(params);
  const phase = phases.find(p => p.slug === slug);

  if (!phase) {
    return notFound();
  }

  const theme = THEME_MAP[phase.slug] || DEFAULT_THEME;
  const Icon = phaseIconMap[phase.icon] || Shield;

  const courseSchema = {
    "name": phase.name,
    "description": phase.full_description,
    "provider": {
      "@type": "Organization",
      "name": "Drawdown",
      "sameAs": "https://drawdown.trading"
    },
    "coursePrerequisites": phase.id > 1 ? `Completion of Phase ${phase.id - 1}` : "None"
  };

  const currentIndex = phases.findIndex(p => p.slug === phase.slug);
  const prevPhase = currentIndex > 0 ? phases[currentIndex - 1] : null;
  const nextPhase = currentIndex < phases.length - 1 ? phases[currentIndex + 1] : null;

  const pricingTiers = [
    {
      name: "Foundation",
      price: "£49",
      period: "month",
      desc: "For traders building their process and knowledge base.",
      cta: "Join Foundation",
      highlight: phase.tier === "Foundation",
      badge: phase.tier === "Foundation" ? "Recommended Plan" : null,
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
      highlight: phase.tier === "Edge",
      badge: phase.tier === "Edge" ? "Recommended Plan" : null,
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
      highlight: phase.tier === "Floor",
      badge: phase.tier === "Floor" ? "Recommended Plan" : null,
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

  return (
    <div className="flex flex-col min-h-screen bg-white text-mkt-ink font-sans selection:bg-neutral-100 selection:text-mkt-ink">
      <StructuredData type="Course" data={courseSchema} />

      <section className="h-screen min-h-[650px] relative flex flex-col justify-center items-center overflow-hidden border-b border-mkt-bd select-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:40px_40px] z-0 pointer-events-none" />
        
        <div 
          className="absolute inset-0 z-0 pointer-events-none transition-all duration-1000"
          style={{
            backgroundImage: `radial-gradient(circle at center, ${theme.colorHex}0a 0%, transparent 65%)`
          }}
        />

        <div className="absolute top-28 left-0 right-0 z-20 max-w-7xl mx-auto px-6">
          <Breadcrumbs />
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10 flex flex-col items-center text-center space-y-8 mt-12">
          <div className="flex items-center gap-3 text-mkt-i4 transition-all duration-500 animate-pulse">
            <Terminal className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono uppercase tracking-[0.4em]">EDUCATIONAL_MODULE // PHASE_{phase.number}</span>
          </div>

          <h1 className="text-5xl md:text-8xl lg:text-[100px] font-sans font-black uppercase tracking-tighter leading-none text-mkt-ink max-w-4xl">
            {phase.name}<span className={theme.color}>.</span>
          </h1>

          <p className="text-lg md:text-2xl text-mkt-i3 font-sans font-light leading-relaxed max-w-3xl">
            {phase.subtitle}
          </p>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className={cn("px-2.5 py-0.5 rounded border uppercase tracking-wider", theme.borderClass)}>
              {phase.tier} Access
            </span>
            <span className="text-mkt-i4 uppercase tracking-widest flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-mkt-i3" /> {phase.duration} Syllabus
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
            <Link 
              href="#subscriptions"
              className={cn(
                "px-10 py-5 font-sans font-black uppercase tracking-[0.2em] text-xs transition-all duration-300 transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2",
                theme.buttonBgClass
              )}
            >
              Unlock Access Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="#specifications"
              className="px-10 py-5 border border-mkt-bd hover:border-mkt-ink hover:bg-neutral-50 text-mkt-ink font-sans font-bold uppercase tracking-[0.2em] text-xs transition-all duration-300 flex items-center justify-center"
            >
              View Course Syllabus
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-1.5 opacity-60 z-10 animate-bounce">
          <span className="text-[8px] font-mono uppercase tracking-widest text-mkt-i4">Scroll to Spec</span>
          <ChevronDown className="w-4 h-4 text-mkt-i4" />
        </div>
      </section>

      <section id="specifications" className="py-24 border-b border-mkt-bd scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            <div className="lg:col-span-8 space-y-20">
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-mkt-i4">01_Overview</span>
                  <div className="h-px flex-grow bg-mkt-bd" />
                </div>
                <h2 className="text-3xl font-sans font-extrabold uppercase text-mkt-ink">
                  {phase.name} Syllabus Details
                </h2>
                <p className="text-base text-mkt-i3 leading-relaxed max-w-3xl font-sans italic border-l-2 border-mkt-bd pl-6 py-1">
                  {phase.full_description}
                </p>
                <p className="text-sm text-mkt-i3 leading-relaxed max-w-3xl font-sans">
                  {phase.description}
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-mkt-i4">02_Syllabus_Breakdown</span>
                  <div className="h-px flex-grow bg-mkt-bd" />
                </div>
                
                <h3 className="text-2xl font-sans font-bold uppercase flex items-center gap-3">
                  <Target className="w-6 h-6 text-mkt-ink" /> What You Will Master
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {phase.modules_list.map((module, i) => (
                    <div 
                      key={i} 
                      className="p-5 border border-mkt-bd rounded-[14px] bg-[#F9F9F9] hover:bg-white hover:shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:border-mkt-bds transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <span className={cn("text-[10px] font-mono font-bold mt-1 shrink-0", theme.color)}>
                          {(i + 1).toString().padStart(2, '0')}
                        </span>
                        <span className="text-xs font-sans font-bold uppercase tracking-tight text-mkt-ink leading-snug">
                          {module}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-8 pt-8 border-t border-mkt-bd/80">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-mkt-i4">03_Educational_Framework</span>
                  <div className="h-px flex-grow bg-mkt-bd" />
                </div>

                <div className="p-10 border border-mkt-bd rounded-[14px] relative overflow-hidden group bg-[#FAF8FF]">
                  <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500" />
                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                      <Zap className="w-8 h-8 text-cyan-500" />
                      <h4 className="text-base font-sans font-bold uppercase text-mkt-ink">Repeatable Process</h4>
                      <p className="text-xs text-mkt-i3 leading-relaxed">No arbitrary pattern matching or lagging theories. Just strictly codified mechanical rules built for professional execution.</p>
                    </div>
                    <div className="space-y-3">
                      <Globe className="w-8 h-8 text-cyan-500" />
                      <h4 className="text-base font-sans font-bold uppercase text-mkt-ink">Universal Edge</h4>
                      <p className="text-xs text-mkt-i3 leading-relaxed">Systematic algorithms and structural flow rules that apply cleanly across all liquid assets, including Forex, Metals, Indices, and Crypto.</p>
                    </div>
                    <div className="space-y-3">
                      <Shield className="w-8 h-8 text-cyan-500" />
                      <h4 className="text-base font-sans font-bold uppercase text-mkt-ink">Risk Centric</h4>
                      <p className="text-xs text-mkt-i3 leading-relaxed">Built from the ground up on capital preservation principles to ensure longevity, consistency, and compliance on any prop firm evaluation.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-8">
              
              <div className="p-6 border border-mkt-bd rounded-[14px] bg-[#FDFDFD] relative overflow-hidden group">
                <Quote className={cn("absolute -top-4 -right-4 w-20 h-20 opacity-[0.04]", theme.color)} />
                <p className="text-xs italic text-mkt-i2 leading-relaxed relative z-10 mb-6 font-sans">
                  "Most retail courses teach you how to look for setups. We teach you how to look for risk. The difference between an amateur and a professional trader is that the amateur focuses on how much they can make, while the professional focuses on how much they can lose."
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

              <div className="p-6 border border-mkt-bd rounded-[14px] bg-white space-y-6">
                <div className="flex items-center gap-2 text-mkt-i4 pb-2 border-b border-mkt-bd/80">
                  <Layers className="w-4 h-4 text-cyan-500" />
                  <h4 className="text-[10px] font-mono uppercase tracking-widest font-bold">Phase Specifications</h4>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                    <span className="text-[9px] font-mono uppercase text-mkt-i4">Syllabus Duration</span>
                    <span className="text-xs font-bold text-mkt-ink">{phase.duration}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                    <span className="text-[9px] font-mono uppercase text-mkt-i4">Learning Modules</span>
                    <span className="text-xs font-bold text-mkt-ink">{phase.modules_count} Chapters</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                    <span className="text-[9px] font-mono uppercase text-mkt-i4">Required Skill Level</span>
                    <span className="text-xs font-bold text-mkt-ink uppercase">{phase.id <= 1 ? "Foundational" : phase.id <= 4 ? "Core Practice" : "Expert Level"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-[9px] font-mono uppercase text-mkt-i4">Gateway Tier</span>
                    <span className="text-xs font-bold text-mkt-ink uppercase">{phase.tier} Tier</span>
                  </div>
                </div>

                <Link 
                  href="/signup" 
                  className="block w-full py-4 bg-mkt-ink hover:bg-neutral-800 text-white text-center font-bold uppercase tracking-widest text-[10px] transition-colors duration-200"
                >
                  Start This Course Phase
                </Link>
              </div>

            </div>

          </div>
        </div>
      </section>

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
              Curriculum phases are unlocked dynamically based on your membership tier. Choose a plan to secure immediate syllabus access.
            </p>
          </div>

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

                    <ul className="space-y-3 mb-8">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-mkt-i3 font-sans">
                          <Check className="w-3.5 h-3.5 text-mkt-grn shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

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

          <div className="text-center mt-12">
            <p className="text-[10px] font-mono text-mkt-i4 uppercase tracking-widest">
              Secure Checkout // SSL Encrypted // Cancel Anytime in 1-Click
            </p>
          </div>

        </div>
      </section>

      <section className="py-12 bg-white border-b border-mkt-bd">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            
            {prevPhase ? (
              <Link 
                href={`/courses/${prevPhase.slug}`}
                className="flex items-center gap-3 group text-left w-full sm:w-auto p-4 border border-mkt-bd rounded-[14px] hover:border-mkt-bds hover:shadow-[0_8px_32px_rgba(0,0,0,0.04)] transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 text-mkt-i4 group-hover:-translate-x-1 transition-transform" />
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-mkt-i4 block">Previous Phase</span>
                  <span className="text-xs font-sans font-bold uppercase text-mkt-ink">
                    Phase {prevPhase.number}: {prevPhase.name}
                  </span>
                </div>
              </Link>
            ) : (
              <div className="w-full sm:w-auto invisible" />
            )}

            <Link 
              href="/courses" 
              className="text-[10px] font-mono uppercase tracking-[0.2em] text-mkt-i3 hover:text-cyan-500 transition-colors font-bold"
            >
              View Full Path Map
            </Link>

            {nextPhase ? (
              <Link 
                href={`/courses/${nextPhase.slug}`}
                className="flex items-center justify-end gap-3 group text-right w-full sm:w-auto p-4 border border-mkt-bd rounded-[14px] hover:border-mkt-bds hover:shadow-[0_8px_32px_rgba(0,0,0,0.04)] transition-all duration-300"
              >
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-mkt-i4 block">Next Phase</span>
                  <span className="text-xs font-sans font-bold uppercase text-mkt-ink">
                    Phase {nextPhase.number}: {nextPhase.name}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-mkt-i4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <div className="w-full sm:w-auto invisible" />
            )}

          </div>
        </div>
      </section>

    </div>
  );
}
