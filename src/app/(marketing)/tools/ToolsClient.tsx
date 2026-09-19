"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { 
  Percent, 
  LayoutDashboard, 
  History, 
  Cpu, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Terminal, 
  BarChart3, 
  Clock, 
  Sparkles,
  TrendingDown,
  Coins,
  ShieldAlert,
  Compass
} from "lucide-react";

// Tier 1 Flagship Free Organic Acquisition Tools
const flagshipFreeTools = [
  {
    slug: "position-size-calculator",
    title: "Position Size Calculator",
    subtitle: "Exact lot sizing, invalidation distance & cash risk across FX, Indices, Gold & Crypto.",
    icon: Percent,
    badge: "Most Popular",
    category: "Execution Math",
    highlight: "Full Multi-Asset Support",
  },
  {
    slug: "drawdown-recovery-calculator",
    title: "Drawdown Recovery Calculator",
    subtitle: "Visualize the exponential loss asymmetry curve and calculate break-even trade expectancy.",
    icon: TrendingDown,
    badge: "Core Philosophy",
    category: "Capital Preservation",
    highlight: "Loss Asymmetry Matrix",
  },
  {
    slug: "pip-value-calculator",
    title: "Pip Value Calculator",
    subtitle: "Exact pip & point values across 20+ pairs, contract tiers, and multi-currency accounts.",
    icon: Coins,
    badge: "Zero Slippage Math",
    category: "Execution Math",
    highlight: "Standard, Mini & Micro Tiers",
  },
  {
    slug: "risk-of-ruin-calculator",
    title: "Risk of Ruin Calculator",
    subtitle: "Statistical survival modeling using Ralph Vince & Kaufman analytical formulas.",
    icon: ShieldAlert,
    badge: "Quantitative",
    category: "Survival Statistics",
    highlight: "Drawdown Distribution Curve",
  },
  {
    slug: "forex-market-hours",
    title: "Forex Market Hours & Session Clock",
    subtitle: "Live Sydney, Tokyo, London, and New York radar with overlap highlighting.",
    icon: Clock,
    badge: "Live Clock",
    category: "Market Timing",
    highlight: "London/NY Overlap Tracker",
  },
];

const platformSuiteTools = [
  {
    slug: "/dashboard/run-my-trade",
    title: "Plan My Trade",
    description: "Interactive pre-trade sizing, risk validation, and discipline check prior to order execution.",
    icon: Zap,
    tier: "Free Tier Included",
    stage: "Stage 1: Prepare",
  },
  {
    slug: "intelligence-hub",
    title: "Intelligence Hub",
    description: "Expert market takes and analysis delivered to your dashboard every session.",
    icon: Cpu,
    tier: "Foundation+",
    stage: "Stage 1: Prepare",
  },
  {
    slug: "market-charts",
    title: "Technical Charts",
    description: "High-performance charting with proprietary multi-timeframe indicators and logic.",
    icon: BarChart3,
    tier: "Foundation+",
    stage: "Stage 2: Plan",
  },
  {
    slug: "strategy-backtester",
    title: "Strategy Backtester",
    description: "Validate your edge on historical price data with rapid precision.",
    icon: History,
    tier: "Edge+",
    stage: "Stage 2: Plan",
  },
  {
    slug: "ai-trade-journal",
    title: "AI Trade Journal",
    description: "Advanced trade logging with sentiment analysis and performance attribution.",
    icon: LayoutDashboard,
    tier: "Edge+",
    stage: "Stage 4: Record",
  },
  {
    slug: "ai-market-scanner",
    title: "Technical Scanner",
    description: "Cross-asset technical consensus & price action relative to key macro levels.",
    icon: Compass,
    tier: "Edge+",
    stage: "Stage 5: Review",
  },
  {
    slug: "algo-strategy-builder",
    title: "Algo Strategy Builder",
    description: "Describe your strategy. Get the code. AI-powered conversion of rules to Pine Script or Python.",
    icon: Terminal,
    tier: "Floor",
    stage: "Stage 6: Improve",
  },
  {
    slug: "/investment-centre",
    title: "The Investment Centre",
    description: "Autonomous cross-asset macro synthesis, tri-model AI council, and quantitative risk analysis.",
    icon: Cpu,
    tier: "Foundation Add-on",
    stage: "Stage 7: Repeat Weekly",
  },
];

export default function ToolsMarketingPage() {
  const shouldReduce = useReducedMotion();

  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : 12 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.25, ease: "easeOut" as const },
    }),
  };

  return (
    <div 
      className="flex flex-col min-h-screen select-none"
      style={{ backgroundColor: "#FFFFFF", color: "var(--text-primary)" }}
    >
      {/* ── 1. Hero Section ──────────────────────────────────────────────────────── */}
      <section
        className="relative w-full pt-32 pb-20 md:pt-40 md:pb-24 border-b overflow-hidden"
        style={{ backgroundColor: "#FFFFFF", borderColor: "rgba(0,0,0,0.05)" }}
      >
        <div 
          className="absolute inset-0 pointer-events-none select-none z-0"
          style={{
            background: "radial-gradient(ellipse 65% 55% at 70% 30%, rgba(22,33,62,0.035), transparent 70%)",
          }}
        />

        <div className="w-full max-w-[1280px] mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-6">
            {/* Eyebrow */}
            <motion.div
              variants={fadeUp}
              custom={0}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/5 bg-black/[0.02]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--market-up)] inline-block" />
              <span className="text-[11px] font-mono uppercase tracking-[0.08em] text-[var(--text-secondary)] font-medium">
                Public Organic Tools Suite · 100% Free &amp; Un-gated
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              custom={1}
              initial="hidden"
              animate="visible"
              className="font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.08] tracking-[-0.02em] font-medium text-[var(--text-primary)]"
            >
              The Decision Tools. <br />
              <span className="text-[var(--text-secondary)]">
                Precision calculators engineered for capital preservation.
              </span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              variants={fadeUp}
              custom={2}
              initial="hidden"
              animate="visible"
              className="text-[16px] md:text-[18px] leading-[1.6] font-sans max-w-2xl text-[var(--text-secondary)]"
            >
              Free client-side trading calculators with complete mathematical transparency. No signups, no email capture, and zero friction. Built by real traders to eliminate mental math errors under pressure.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── 2. Tier 1 Flagship Public Tools Grid ─────────────────────────────────── */}
      <section 
        className="w-full py-16 md:py-24 border-b"
        style={{
          background: "linear-gradient(180deg, #FFFFFF 0%, #FCFCFD 100%)",
          borderColor: "rgba(0,0,0,0.05)",
        }}
      >
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--text-tertiary)] block mb-1">
                Zero-Gate Organic Assets
              </span>
              <h2 className="text-2xl md:text-3xl font-display font-medium text-[var(--text-primary)]">
                Flagship Calculators
              </h2>
            </div>
            <p className="text-xs font-mono text-[var(--text-tertiary)] max-w-md">
              Every tool runs locally in your browser with shareable URL parameters and full step-by-step mathematical breakdowns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flagshipFreeTools.map((tool, idx) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="group block p-7 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "rgba(0,0,0,0.06)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.03), 0 8px 24px -12px rgba(22,33,62,0.06)",
                    borderRadius: "var(--radius-lg)",
                  }}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg border border-black/5 bg-[var(--surface-raised)] flex items-center justify-center text-[var(--accent)] group-hover:scale-105 transition-transform duration-200">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full border border-black/5 bg-black/[0.02] text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)] font-medium">
                        {tool.badge}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-tertiary)] block mb-1">
                        {tool.category}
                      </span>
                      <h3 className="text-lg font-display font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-xs font-sans text-[var(--text-secondary)] leading-relaxed mt-1.5 min-h-[36px]">
                        {tool.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-black/5 flex items-center justify-between text-xs font-mono">
                    <span className="text-[11px] text-[var(--text-tertiary)]">
                      {tool.highlight}
                    </span>
                    <span className="font-semibold text-[var(--accent)] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Open Tool <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. Operating Loop Platform Tools ─────────────────────────────────────────── */}
      <section className="w-full py-16 md:py-24 border-b" style={{ backgroundColor: "#FFFFFF", borderColor: "rgba(0,0,0,0.05)" }}>
        <div className="max-w-[1280px] mx-auto px-6 space-y-12">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--text-tertiary)] block mb-1">
              Complete Operating System
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-medium text-[var(--text-primary)]">
              Drawdown Platform Suite
            </h2>
            <p className="text-sm font-sans text-[var(--text-secondary)] mt-1 max-w-2xl">
              Connected decision-support modules designed around the 6-stage professional trading workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {platformSuiteTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.slug}
                  href={tool.slug.startsWith("/") ? tool.slug : `/tools/${tool.slug}`}
                  className="p-6 border flex flex-col justify-between transition-all duration-200 group hover:border-[var(--accent)] hover:shadow-sm"
                  style={{
                    backgroundColor: "var(--surface-raised)",
                    borderColor: "var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded border border-black/5 bg-[var(--surface-base)] text-[var(--text-primary)]">
                        <Icon size={18} strokeWidth={1.5} />
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-black/5 text-[var(--text-tertiary)] bg-[var(--surface-base)]">
                        {tool.tier}
                      </span>
                    </div>

                    <h4 className="text-base font-display font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                      {tool.title}
                    </h4>
                    <p className="text-xs font-sans text-[var(--text-secondary)] leading-relaxed min-h-[48px]">
                      {tool.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-black/5 flex items-center justify-between text-[11px] font-mono text-[var(--text-tertiary)]">
                    <span>{tool.stage}</span>
                    <ArrowRight size={13} className="text-[var(--text-primary)] group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. Transparency & Methodology ─────────────────────────────────────────── */}
      <section
        className="w-full py-16 md:py-20 border-b select-none"
        style={{
          background: "linear-gradient(180deg, #FFFFFF 0%, #FCFCFD 100%)",
          borderColor: "rgba(0,0,0,0.05)",
        }}
      >
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[11px] font-mono uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                Zero Black-Box Math
              </span>
              <h2 className="text-2xl md:text-3xl font-display font-medium text-[var(--text-primary)]">
                Transparent Execution Infrastructure.
              </h2>
              <p className="text-sm font-sans text-[var(--text-secondary)] leading-relaxed">
                Most retail calculators hide their rounding rules or fail on cross-currency pairs. Drawdown’s tools execute in pure client-side IEEE floating-point arithmetic with full formula breakdowns on every output.
              </p>
              <div className="pt-2 grid grid-cols-2 gap-4 border-t border-black/5">
                <div>
                  <div className="text-2xl font-mono font-bold text-[var(--text-primary)]">
                    100% Client-Side
                  </div>
                  <p className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                    Zero latency, works offline
                  </p>
                </div>
                <div>
                  <div className="text-2xl font-mono font-bold text-[var(--text-primary)]">
                    No Sign-Up
                  </div>
                  <p className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                    Public, un-gated forever
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div
                className="p-6 border bg-white rounded-lg shadow-sm space-y-3"
                style={{ borderColor: "rgba(0,0,0,0.06)" }}
              >
                <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent)] font-semibold uppercase">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Institutional Principle</span>
                </div>
                <blockquote className="text-sm font-sans text-[var(--text-secondary)] italic leading-relaxed">
                  &ldquo;A trader who doesn&apos;t know their exact cash invalidation distance and single-pip conversion before pulling the trigger is not trading — they are gambling with leverage.&rdquo;
                </blockquote>
                <div className="text-xs font-mono text-[var(--text-primary)] font-medium pt-1">
                  — Pete Currey, Founder
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
