"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Clock, ChevronRight, Layers, Shield, Check, X, ChevronDown, ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { phases } from "@/data/courses";
import { cn } from "@/lib/utils";
import { useRegion } from "@/components/layout/RegionalLayout";

// Rich thematic images with coordinates and custom subtle glow parameters
const phaseBranding: Record<string, { bg: string; border: string; glow: string }> = {
  "01": {
    bg: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&w=600&q=80",
    border: "var(--signal-navy)",
    glow: "rgba(22, 33, 62, 0.08)"
  },
  "02": {
    bg: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    border: "var(--signal-navy)",
    glow: "rgba(22, 33, 62, 0.08)"
  },
  "03": {
    bg: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80",
    border: "var(--signal-navy)",
    glow: "rgba(22, 33, 62, 0.08)"
  },
  "04": {
    bg: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
    border: "var(--signal-navy)",
    glow: "rgba(22, 33, 62, 0.08)"
  },
  "05": {
    bg: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    border: "var(--signal-navy)",
    glow: "rgba(22, 33, 62, 0.08)"
  },
  "06": {
    bg: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80",
    border: "var(--signal-navy)",
    glow: "rgba(22, 33, 62, 0.08)"
  },
  "07": {
    bg: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
    border: "var(--signal-navy)",
    glow: "rgba(22, 33, 62, 0.08)"
  },
  "08": {
    bg: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80",
    border: "var(--signal-navy)",
    glow: "rgba(22, 33, 62, 0.08)"
  },
  "09": {
    bg: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    border: "var(--signal-navy)",
    glow: "rgba(22, 33, 62, 0.08)"
  },
  "10": {
    bg: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
    border: "var(--signal-navy)",
    glow: "rgba(22, 33, 62, 0.08)"
  },
  "11": {
    bg: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
    border: "var(--signal-navy)",
    glow: "rgba(22, 33, 62, 0.08)"
  },
  "12": {
    bg: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    border: "var(--signal-navy)",
    glow: "rgba(22, 33, 62, 0.08)"
  },
  "13": {
    bg: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
    border: "var(--signal-navy)",
    glow: "rgba(22, 33, 62, 0.08)"
  }
};

const defaultBranding = {
  bg: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
  border: "var(--ink-950)",
  glow: "rgba(10, 37, 64, 0.05)"
};

export function CoursesPageClient() {
  const [activeTab, setActiveTab] = useState<"all" | "foundation" | "edge" | "floor">("all");
  const [hoveredPhaseId, setHoveredPhaseId] = useState<number | null>(null);
  const [hoveredModuleId, setHoveredModuleId] = useState<string | null>(null);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);
  const { region } = useRegion();
  const shouldReduce = useReducedMotion();

  const regionPrefix = region === "uk" ? "" : `/${region}`;

  // Filter phases based on activeTab selection
  const filteredPhases = phases.filter((phase) => {
    if (activeTab === "all") return true;
    if (activeTab === "foundation") return phase.tier === "Free" || phase.tier === "Foundation";
    if (activeTab === "edge") return phase.tier === "Edge";
    if (activeTab === "floor") return phase.tier === "Floor";
    return true;
  });

  const faqs = [
    {
      q: "How long does each phase take?",
      a: "Phase 1 typically takes 2-3 weeks of structured focus. The core curriculum (Phases 1 to 4) is designed to be absorbed over 3-4 months, while advanced Edge & Floor modules offer deep quantitative, algorithmic, and AI integrations representing another 6-12 months of live operational learning."
    },
    {
      q: "Do I need any prior programming or trading experience?",
      a: "No. Our curriculum is built for progressive step-by-step development. Phase 1 starts from absolute ground zero—unlearning retail noise. Even the advanced 'AI Trader' modules require no prior programming background, as we focus on low-code and natural language prompt workflows."
    },
    {
      q: "Is the training specific to UK Spread Betting?",
      a: "Yes. In the core phases, we cover the exact tax mechanics, spread profile structures, and broker interfaces specifically optimized for UK Spread Betting, which provides complete tax-free status on individual trading profits for UK residents under HMRC."
    },
    {
      q: "What is the difference between Foundation, Edge, and Floor tiers?",
      a: "Foundation provides Phases 1-4 and our standard trade tracking tool suite. Edge introduces Phases 5-10, advanced Pine Script automation, Monte Carlo simulator frameworks, and live consensus intelligence feeds. Floor unlocks Phases 11-13, direct portfolio audits, and 1-on-1 strategy clinics with Pete."
    },
    {
      q: "Can I cancel my subscription at any time?",
      a: "Yes. Drawdown works on a flat month-to-month subscription with zero minimum commitment or locked terms. You can cancel with a single click inside your billing settings at any point."
    },
    {
      q: "Are there live trade alerts or signals?",
      a: "No. Drawdown is a professional education and data platform, not a retail signal channel. We do not spoonfeed trades. We provide the tools, indicators, and discipline so you can operate as a fully independent, data-driven market participant."
    }
  ];

  const outcomes = [
    { num: "01", text: "Deconstruct common retail speculation fallacies, master mathematical ruin limits, and establish professional operational setups." },
    { num: "02", text: "Read naked price charts, identify institutional order blocks, major liquidity zones, and structural market cycles without lagging metrics." },
    { num: "03", text: "Define and document a mechanical strategy with rigorous entry triggers, specific target formulas, and strict stop placement rules." },
    { num: "04", text: "Calculate exact position sizes based on capital thresholds, standard deviations of volatility, and correlated risk matrices." },
    { num: "05", text: "Run manual and programmatic backtests, calculate core statistics (Win-Rate, Expectancy, Profit Factor), and execute forward stress-testing." },
    { num: "06", text: "Formulate behavioral protocols to eliminate emotional revenge trading, survive drawdowns, and build professional performance routines." },
    { num: "07", text: "Deconstruct macroeconomic cycles, interpret central bank statements, CPI deviations, NFP releases, and exploit news volatility." },
    { num: "08", text: "Understand margin mechanics, funding premiums, options Greeks, and contract profiles across CFDs and Spread Betting structures." },
    { num: "09", text: "Build a top-down macro framework, align interest rate differentials, and trade the dollar-liquidity cycle with systematic technical entries." },
    { num: "10", text: "Select challenge parameters, master strict drawdowns, satisfied consistency metrics, and compile tax structures for funded payouts." },
    { num: "11", text: "Analyse order flows, interpret cumulative delta, volume profiles, and execute tape reading protocols in high-volatility environments." },
    { num: "12", text: "Prompt advanced custom LLM scanning engines, compile Pine Script alerts, and deploy Webhooks to execute systematic models on autopilot." },
    { num: "13", text: "Construct a diversified portfolio across equities, fixed income, real estate, and passive assets using SIPP and ISA tax wraps." }
  ];

  return (
    <div 
      className="pt-[58px] pb-32 min-h-screen select-none font-sans" 
      style={{ backgroundColor: "var(--paper-0)", color: "var(--ink-950)" }}
    >
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* Breadcrumb Navigation */}
        <div className="pt-10">
          <Breadcrumbs />
        </div>

        {/* Hero Header Section */}
        <header className="pt-8 pb-16 border-b" style={{ borderColor: "var(--line-200)" }}>
          <div className="max-w-4xl space-y-6">
            <span 
              className="block text-[11px] font-mono uppercase tracking-[0.08em]"
              style={{ color: "var(--graphite-600)" }}
            >
              The Curriculum · Complete Roadmap
            </span>
            <h1 className="font-display text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.08] tracking-[-0.02em] font-semibold">
              A Phase-Based <br />
              <span style={{ color: "var(--graphite-600)" }}>Learning Progression.</span>
            </h1>
            <p 
              className="text-[17px] md:text-[19px] leading-[1.6] font-normal max-w-3xl"
              style={{ color: "var(--graphite-600)" }}
            >
              A modern, systematic 13-phase curriculum designed to take you from foundational market mechanics to complex, data-driven quantitative workflows. No shortcuts. No hype. Just the raw, mathematical truth of trading.
            </p>
          </div>

          {/* Curriculum Stats Panel — Hairline grid, zero-radius */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 md:gap-y-0 pt-12 mt-12 border-t text-left" style={{ borderColor: "var(--line-200)" }}>
            <div className="space-y-1 md:border-r" style={{ borderColor: "var(--line-200)" }}>
              <span className="block text-[32px] font-mono font-medium leading-none">13</span>
              <span className="block text-[11px] font-mono uppercase tracking-wider" style={{ color: "var(--graphite-600)" }}>Specialized Phases</span>
            </div>
            <div className="space-y-1 md:px-6 md:border-r" style={{ borderColor: "var(--line-200)" }}>
              <span className="block text-[32px] font-mono font-medium leading-none">80+ Hours</span>
              <span className="block text-[11px] font-mono uppercase tracking-wider" style={{ color: "var(--graphite-600)" }}>Structured Video</span>
            </div>
            <div className="space-y-1 md:px-6 md:border-r" style={{ borderColor: "var(--line-200)" }}>
              <span className="block text-[32px] font-mono font-medium leading-none">60+</span>
              <span className="block text-[11px] font-mono uppercase tracking-wider" style={{ color: "var(--graphite-600)" }}>Core Modules</span>
            </div>
            <div className="space-y-1 md:pl-6">
              <span className="block text-[32px] font-mono font-medium leading-none" style={{ color: "var(--signal-navy)" }}>Phase 01</span>
              <span className="block text-[11px] font-mono uppercase tracking-wider" style={{ color: "var(--signal-navy)" }}>Free Forever Access</span>
            </div>
          </div>
        </header>

        {/* The Difference Section (Legacy SectionA redesign to match Phase 1 palette) */}
        <section className="py-24 border-b" style={{ borderColor: "var(--line-200)" }}>
          <div className="space-y-3 mb-16">
            <span className="block text-[11px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--graphite-600)" }}>The standard</span>
            <h2 className="font-display text-[clamp(1.75rem,4vw,3rem)] leading-tight tracking-[-0.02em] font-semibold">
              Most trading education is broken. <br />
              <span style={{ color: "var(--graphite-600)" }}>Here's how we fix it.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free/YouTube Column */}
            <div className="p-8 border flex flex-col justify-between" style={{ borderColor: "var(--line-200)", backgroundColor: "var(--paper-100)", borderRadius: 0 }}>
              <div className="space-y-6">
                <span className="text-[12px] font-mono uppercase tracking-wider" style={{ color: "var(--graphite-600)" }}>
                  YouTube & Free Info
                </span>
                <ul className="space-y-4 text-[13px] font-sans" style={{ color: "var(--graphite-600)" }}>
                  <li className="flex items-start gap-3"><X size={15} strokeWidth={2} className="text-red-600 shrink-0 mt-0.5" /> Random order, no cohesive structure</li>
                  <li className="flex items-start gap-3"><X size={15} strokeWidth={2} className="text-red-600 shrink-0 mt-0.5" /> Contradictory rules from different creators</li>
                  <li className="flex items-start gap-3"><X size={15} strokeWidth={2} className="text-red-600 shrink-0 mt-0.5" /> No accountability or statistical tracking</li>
                  <li className="flex items-start gap-3"><X size={15} strokeWidth={2} className="text-red-600 shrink-0 mt-0.5" /> Entertainment metrics disguised as edge</li>
                </ul>
              </div>
              <span className="block text-[11px] font-mono uppercase tracking-wider pt-6 mt-8 border-t" style={{ borderColor: "var(--line-200)", color: "var(--graphite-600)" }}>Cost: Your entire balance</span>
            </div>

            {/* Typical Paid Courses Column */}
            <div className="p-8 border flex flex-col justify-between" style={{ borderColor: "var(--line-200)", backgroundColor: "var(--paper-100)", borderRadius: 0 }}>
              <div className="space-y-6">
                <span className="text-[12px] font-mono uppercase tracking-wider" style={{ color: "var(--graphite-600)" }}>
                  Typical Paid Courses
                </span>
                <ul className="space-y-4 text-[13px] font-sans" style={{ color: "var(--graphite-600)" }}>
                  <li className="flex items-start gap-3"><X size={15} strokeWidth={2} className="text-red-600 shrink-0 mt-0.5" /> Static, outdated video modules</li>
                  <li className="flex items-start gap-3"><X size={15} strokeWidth={2} className="text-red-600 shrink-0 mt-0.5" /> Luxury lifestyle marketing and gurus</li>
                  <li className="flex items-start gap-3"><X size={15} strokeWidth={2} className="text-red-600 shrink-0 mt-0.5" /> No supporting software or tools</li>
                  <li className="flex items-start gap-3"><X size={15} strokeWidth={2} className="text-red-600 shrink-0 mt-0.5" /> £1,000+ upfront fee with zero trial</li>
                </ul>
              </div>
              <span className="block text-[11px] font-mono uppercase tracking-wider pt-6 mt-8 border-t" style={{ borderColor: "var(--line-200)", color: "var(--graphite-600)" }}>Cost: £1,000 - £3,000</span>
            </div>

            {/* Drawdown Column */}
            <div className="p-8 border flex flex-col justify-between relative overflow-hidden" style={{ borderColor: "var(--signal-navy)", backgroundColor: "var(--paper-0)", borderRadius: 0 }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--signal-navy)]/5 blur-[40px] rounded-full pointer-events-none" />
              <div className="space-y-6 relative z-10">
                <span className="text-[12px] font-mono uppercase tracking-wider" style={{ color: "var(--signal-navy)" }}>
                  ★ Drawdown Standard
                </span>
                <ul className="space-y-4 text-[13px] font-sans" style={{ color: "var(--ink-950)" }}>
                  <li className="flex items-start gap-3"><Check size={15} strokeWidth={2.5} className="text-emerald-600 shrink-0 mt-0.5" /> Rigorous 13-phase structural roadmap</li>
                  <li className="flex items-start gap-3"><Check size={15} strokeWidth={2.5} className="text-emerald-600 shrink-0 mt-0.5" /> Documented logic built by active traders</li>
                  <li className="flex items-start gap-3"><Check size={15} strokeWidth={2.5} className="text-emerald-600 shrink-0 mt-0.5" /> Native Pine indicators & AI backtester access</li>
                  <li className="flex items-start gap-3"><Check size={15} strokeWidth={2.5} className="text-emerald-600 shrink-0 mt-0.5" /> Fully functional community & regular live reviews</li>
                </ul>
              </div>
              <span className="block text-[11px] font-mono uppercase tracking-wider pt-6 mt-8 border-t font-semibold" style={{ borderColor: "var(--line-200)", color: "var(--signal-navy)" }}>Cost: Start free forever</span>
            </div>
          </div>
        </section>

        {/* Phase Navigation Filter Bar */}
        <section className="py-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-4 border-b" style={{ borderColor: "var(--line-200)" }}>
            <div className="space-y-1">
              <span className="block text-[11px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--graphite-600)" }}>Curriculum breakdown</span>
              <h2 className="text-xl md:text-2xl font-display font-semibold tracking-tight">Explore the Roadmap</h2>
            </div>

            {/* Filter Tabs — Flat, Zero-radius, monospaced */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "00 All Phases" },
                { id: "foundation", label: "01 Free & Foundation" },
                { id: "edge", label: "02 Advanced Edge" },
                { id: "floor", label: "03 Trading Floor" }
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className="px-4 py-2.5 text-[11px] font-mono uppercase tracking-[0.08em] border transition-all duration-150"
                    style={{
                      borderRadius: 0,
                      backgroundColor: isActive ? "var(--signal-navy)" : "transparent",
                      color: isActive ? "#FAFAF9" : "var(--graphite-600)",
                      borderColor: isActive ? "var(--signal-navy)" : "var(--line-200)",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.borderColor = "var(--ink-950)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.borderColor = "var(--line-200)";
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Courses Phases List */}
          <div className="space-y-10">
            <AnimatePresence mode="popLayout">
              {filteredPhases.map((phase, i) => {
                const isFree = phase.tier === "Free";
                const isHovered = hoveredPhaseId === phase.id;
                const brand = phaseBranding[phase.number] || defaultBranding;

                return (
                  <motion.div
                    key={phase.id}
                    layout={!shouldReduce}
                    initial={{ opacity: 0, y: shouldReduce ? 0 : 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: shouldReduce ? 1 : 0.98 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    onMouseEnter={() => setHoveredPhaseId(phase.id)}
                    onMouseLeave={() => setHoveredPhaseId(null)}
                    className="border flex flex-col relative overflow-hidden transition-all duration-300"
                    style={{
                      borderColor: isHovered ? "var(--signal-navy)" : "var(--line-200)",
                      backgroundColor: "var(--paper-100)",
                      borderRadius: 0,
                      boxShadow: isHovered ? `0 0 30px ${brand.glow}, inset 0 0 15px ${brand.glow}` : "none",
                    }}
                  >
                    {/* Background image overlay — luminosity blending */}
                    <div 
                      className="absolute inset-0 z-0 transition-all duration-500 pointer-events-none select-none"
                      style={{
                        backgroundImage: `url(${brand.bg})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        opacity: isHovered ? 0.12 : 0.03,
                        mixBlendMode: "luminosity",
                      }}
                    />

                    {/* Content Layer */}
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 md:p-10 items-stretch">
                      
                      {/* Left Block: Gigantic number + Tier Badge */}
                      <div className="lg:col-span-2 flex flex-row lg:flex-col justify-between items-center lg:items-start lg:justify-between border-b lg:border-b-0 lg:border-r pb-6 lg:pb-0 lg:pr-8" style={{ borderColor: "var(--line-200)" }}>
                        <span 
                          className="text-[48px] md:text-[64px] font-mono leading-none tracking-tighter font-medium transition-colors duration-300"
                          style={{ color: isHovered ? "var(--signal-navy)" : "var(--line-200)" }}
                        >
                          {phase.number}
                        </span>
                        
                        <div className="flex flex-col items-end lg:items-start gap-2 lg:mt-6">
                          <span 
                            className="text-[10px] font-mono uppercase tracking-[0.08em] px-2.5 py-0.5 border"
                            style={{
                              color: isFree ? "var(--signal-navy)" : "var(--graphite-600)",
                              borderColor: "var(--line-200)",
                              backgroundColor: "var(--paper-0)",
                              borderRadius: 0,
                            }}
                          >
                            {phase.tier} Tier
                          </span>
                          <span className="text-[10px] font-mono uppercase tracking-[0.08em] flex items-center gap-1.5" style={{ color: "var(--graphite-600)" }}>
                            <Clock size={11} strokeWidth={1.5} /> {phase.duration}
                          </span>
                        </div>
                      </div>

                      {/* Middle Block: Course Details & CTAs */}
                      <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
                        <div className="space-y-4">
                          <div className="space-y-1">
                            {phase.status === "in_development" && (
                              <span className="inline-block text-[9px] font-mono uppercase tracking-[0.1em] text-amber-700 bg-amber-50 border border-amber-200/50 px-2 py-0.5 mb-1">
                                In Development
                              </span>
                            )}
                            <h3 
                              className={cn(
                                "text-2xl font-semibold tracking-tight font-display text-[var(--ink-950)] leading-snug",
                                phase.status === "in_development" && "opacity-60"
                              )}
                            >
                              {phase.name}
                            </h3>
                            <span className="block text-[11px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--graphite-600)" }}>
                              {phase.subtitle}
                            </span>
                          </div>

                          <p 
                            className="text-[14px] leading-relaxed font-sans italic border-l-2 pl-4 py-1"
                            style={{ borderColor: "var(--line-200)", color: "var(--graphite-600)" }}
                          >
                            {phase.description}
                          </p>
                        </div>

                        {/* Flat Zero-radius CTAs */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2 relative z-20">
                          {phase.status === "available" ? (
                            <>
                              <Link
                                href={`${regionPrefix}/courses/${phase.slug}`}
                                className="inline-flex items-center justify-center gap-2 px-5 py-3 text-[11px] font-mono uppercase tracking-[0.08em] font-medium text-white transition-opacity"
                                style={{
                                  backgroundColor: "var(--signal-navy)",
                                  borderRadius: 0,
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                              >
                                View syllabus detail
                                <ChevronRight size={12} strokeWidth={2} />
                              </Link>
                              <Link
                                href={`${regionPrefix}/signup`}
                                className="inline-flex items-center justify-center gap-2 px-5 py-3 text-[11px] font-mono uppercase tracking-[0.08em] font-medium border transition-colors"
                                style={{
                                  color: "var(--ink-950)",
                                  borderColor: "var(--line-200)",
                                  borderRadius: 0,
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--ink-950)")}
                                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--line-200)")}
                              >
                                {isFree ? "Start phase 1 free" : "Create Account"}
                              </Link>
                            </>
                          ) : (
                            <span 
                              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-[11px] font-mono uppercase tracking-[0.08em] font-medium border opacity-50 select-none cursor-not-allowed"
                              style={{
                                color: "var(--graphite-600)",
                                borderColor: "var(--line-200)",
                                backgroundColor: "var(--paper-0)",
                                borderRadius: 0,
                              }}
                            >
                              Coming Soon
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right Block: Included Modules console (Syllabus) */}
                      <div className="lg:col-span-4 flex flex-col justify-center lg:pl-4">
                        <div 
                          className="p-6 border flex flex-col h-full justify-between"
                          style={{
                            borderColor: "var(--line-200)",
                            backgroundColor: "var(--paper-0)",
                            borderRadius: 0,
                          }}
                        >
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-3 border-b" style={{ borderColor: "var(--line-200)" }}>
                              <Layers size={13} style={{ color: "var(--signal-navy)" }} />
                              <span className="text-[10px] font-mono uppercase tracking-[0.08em] font-bold" style={{ color: "var(--graphite-600)" }}>
                                Included Modules ({phase.modules_count})
                              </span>
                            </div>

                            <ul className="space-y-2.5">
                              {phase.modules_list.slice(0, 5).map((mod, idx) => {
                                const modKey = `${phase.id}-${idx}`;
                                const isModHovered = hoveredModuleId === modKey;
                                return (
                                  <li 
                                    key={idx}
                                    onMouseEnter={() => setHoveredModuleId(modKey)}
                                    onMouseLeave={() => setHoveredModuleId(null)}
                                    className="text-[12px] font-sans flex items-start gap-2.5 transition-transform duration-150"
                                    style={{
                                      transform: isModHovered ? "translateX(2px)" : "none",
                                      color: isModHovered ? "var(--ink-950)" : "var(--graphite-600)"
                                    }}
                                  >
                                    <span 
                                      className="font-mono text-[9px] mt-0.5 shrink-0 transition-colors duration-150"
                                      style={{ color: isModHovered ? "var(--signal-navy)" : "var(--line-200)" }}
                                    >
                                      {(idx + 1).toString().padStart(2, "0")}
                                    </span>
                                    <span className={cn(isModHovered && "underline decoration-neutral-300")}>
                                      {mod}
                                    </span>
                                  </li>
                                );
                              })}
                              
                              {phase.modules_list.length > 5 && (
                                <li className="pt-2 border-t text-[11px] font-mono uppercase tracking-wider" style={{ borderColor: "var(--line-200)" }}>
                                  <Link 
                                    href={`${regionPrefix}/courses/${phase.slug}`}
                                    className="hover:underline flex items-center gap-1.5"
                                    style={{ color: "var(--signal-navy)" }}
                                  >
                                    +{phase.modules_list.length - 5} more modules
                                    <ChevronRight size={10} />
                                  </Link>
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </section>

        {/* Golden High-Ticket Institutional Accelerator Card */}
        <section className="py-16">
          <div 
            className="p-8 md:p-12 border relative overflow-hidden group transition-all duration-500"
            style={{
              borderColor: "rgba(226, 183, 85, 0.2)",
              background: "linear-gradient(135deg, #0B0E12 0%, #151922 100%)",
              borderRadius: 0,
            }}
          >
            {/* Subtle gold line at top */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#E2B755] to-transparent" />
            
            {/* Subtle background glow */}
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#E2B755]/5 blur-[80px] rounded-full pointer-events-none transition-all duration-500 group-hover:scale-110" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="space-y-4 max-w-3xl">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 border text-[10px] font-mono font-bold uppercase tracking-wider"
                  style={{
                    color: "#E2B755",
                    borderColor: "rgba(226, 183, 85, 0.25)",
                    backgroundColor: "rgba(226, 183, 85, 0.08)",
                    borderRadius: 0,
                  }}
                >
                  ★ Premium Executive Cohort
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-semibold tracking-tight text-white leading-tight">
                  Drawdown Institutional Accelerator
                </h3>
                <p className="text-[14px] leading-relaxed text-gray-400 font-sans">
                  Move beyond retail speculation. A premium 6-week higher education cohort combining systematic probability, custom Pine Script indicator engineering, live fund-level audits, and direct corporate Limited Company tax compliance structures.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 pt-2 text-[12px] font-sans text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className="text-[#E2B755] font-bold">✓</span> Limited to 15 active students per cohort
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#E2B755] font-bold">✓</span> Direct 1-on-1 portfolio and trade reviews
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#E2B755] font-bold">✓</span> Pine Script backtesting codebase license
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#E2B755] font-bold">✓</span> UK Limited Company tax compliance kit
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
                <Link
                  href={`${regionPrefix}/institutional-accelerator`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 text-[11px] font-mono uppercase tracking-[0.08em] font-bold text-black transition-all duration-300 hover:shadow-lg hover:shadow-[#E2B755]/10 text-center"
                  style={{
                    background: "linear-gradient(to right, #E2B755, #C59235)",
                    borderRadius: 0,
                  }}
                >
                  Explore Cohort Details
                  <ArrowRight size={12} strokeWidth={2} />
                </Link>
                <Link
                  href={`${regionPrefix}/legal/accelerator-agreement`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-[10px] font-mono uppercase tracking-[0.08em] font-medium border text-center transition-colors"
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    borderColor: "rgba(255,255,255,0.15)",
                    borderRadius: 0,
                    backgroundColor: "transparent"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "white";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                  }}
                >
                  Terms of Enrolment
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Outcomes Capabilities Section (SectionD Redesign) */}
        <section className="py-24 border-b" style={{ borderColor: "var(--line-200)" }}>
          <div className="space-y-3 mb-16">
            <span className="block text-[11px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--graphite-600)" }}>Key Outcomes</span>
            <h2 className="font-display text-[clamp(1.75rem,4vw,3rem)] leading-tight tracking-[-0.02em] font-semibold">
              What you'll be able to do.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0 border-t" style={{ borderColor: "var(--line-200)" }}>
            {outcomes.map((item, i) => (
              <div 
                key={i} 
                className="py-8 border-b flex gap-6 items-start"
                style={{ borderColor: "var(--line-200)" }}
              >
                <span className="text-[14px] font-mono font-medium leading-none shrink-0" style={{ color: "var(--signal-navy)" }}>
                  Phase {item.num}
                </span>
                <p className="text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs Accordion Block (SectionE Redesign) */}
        <section className="py-24 border-b" style={{ borderColor: "var(--line-200)" }}>
          <div className="space-y-3 mb-16">
            <span className="block text-[11px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--graphite-600)" }}>Common inquiries</span>
            <h2 className="font-display text-[clamp(1.75rem,4vw,3rem)] leading-tight tracking-[-0.02em] font-semibold">
              Frequently Asked Questions.
            </h2>
          </div>

          <div className="border-t" style={{ borderColor: "var(--line-200)" }}>
            {faqs.map((faq, i) => {
              const isOpen = openFaqIdx === i;
              return (
                <div 
                  key={i} 
                  className="border-b"
                  style={{ borderColor: "var(--line-200)" }}
                >
                  <button
                    onClick={() => setOpenFaqIdx(isOpen ? null : i)}
                    className="w-full text-left py-6 flex items-center justify-between group"
                  >
                    <span 
                      className="font-medium text-[16px] leading-snug pr-8 transition-colors duration-150"
                      style={{ color: isOpen ? "var(--signal-navy)" : "var(--ink-950)" }}
                    >
                      {faq.q}
                    </span>
                    <ChevronDown 
                      size={18}
                      className="transition-transform duration-300 shrink-0"
                      style={{ 
                        color: "var(--graphite-600)", 
                        transform: isOpen ? "rotate(180deg)" : "rotate(0)" 
                      }}
                    />
                  </button>
                  <div 
                    className={cn(
                      "overflow-hidden transition-all duration-300 ease-in-out",
                      isOpen ? "max-h-[300px] opacity-100 pb-6" : "max-h-0 opacity-0"
                    )}
                  >
                    <p className="text-[14px] leading-relaxed pr-12" style={{ color: "var(--graphite-600)" }}>
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Final CTA Block Redesign */}
        <section className="py-24 text-center">
          <div 
            className="max-w-4xl mx-auto p-12 md:p-20 border relative overflow-hidden"
            style={{
              borderColor: "var(--line-200)",
              backgroundColor: "var(--paper-100)",
              borderRadius: 0,
            }}
          >
            <div className="max-w-xl mx-auto space-y-8 relative z-10">
              <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight uppercase leading-tight">
                Ready to learn properly?
              </h2>
              <p className="text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
                Start with Phase 1 — Ground Zero. Completely free. No credit card required. Experience why Drawdown is the choice for disciplined, data-driven market participants.
              </p>
              
              <Link
                href={`${regionPrefix}/signup`}
                className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-mono uppercase tracking-[0.08em] text-[11px] font-bold transition-all duration-150 hover:bg-neutral-800"
                style={{
                  borderRadius: 0,
                  backgroundColor: "var(--signal-navy)"
                }}
              >
                Create Free Account
                <ChevronRight size={14} strokeWidth={2} />
              </Link>
            </div>

            {/* Subtle background Shield watermark */}
            <Shield 
              className="absolute -bottom-12 -right-12 w-48 h-48 pointer-events-none -rotate-12 transition-transform duration-700 group-hover:scale-105" 
              style={{ color: "var(--line-200)", opacity: 0.15 }}
            />
          </div>
        </section>

      </div>
    </div>
  );
}
