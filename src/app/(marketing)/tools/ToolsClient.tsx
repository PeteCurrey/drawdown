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
  Shield,
  CheckCircle2,
  Lock,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const toolCategories = [
  {
    slug: "risk-calculator",
    title: "Position Sizer",
    description: "Advanced risk-of-ruin management and complex multi-asset positioning.",
    icon: Percent,
    features: ["Drawdown Modeling", "Margin Optimization", "Position Sizing"],
    tier: "Free",
    stage: "Stage 1: Prepare",
    stageNum: "01"
  },
  {
    slug: "intelligence-hub",
    title: "Intelligence Hub",
    description: "Expert market takes and analysis delivered to your dashboard every session.",
    icon: Cpu,
    features: ["Pete's Daily Bias", "Macro Calendar", "Sentiment Gauge"],
    tier: "Foundation+",
    stage: "Stage 1: Prepare",
    stageNum: "01"
  },
  {
    slug: "market-charts",
    title: "Technical Charts",
    description: "High-performance charting with proprietary multi-timeframe indicators and logic.",
    icon: BarChart3,
    features: ["Custom Indicators", "Drawing Tools", "Multi-Device Sync"],
    tier: "Foundation+",
    stage: "Stage 2: Plan",
    stageNum: "02"
  },
  {
    slug: "strategy-backtester",
    title: "Strategy Backtester",
    description: "Validate your edge on decade-long historical data with rapid precision.",
    icon: History,
    features: ["Optimization Engine", "Monte Carlo Sim", "Detailed Stats"],
    tier: "Edge+",
    stage: "Stage 2: Plan",
    stageNum: "02"
  },
  {
    slug: "ai-trade-journal",
    title: "AI Trade Journal",
    description: "Advanced trade logging with sentiment analysis and performance attribution.",
    icon: LayoutDashboard,
    features: ["Automated Logging", "Sentiment Tracking", "Visual Equity Curve"],
    tier: "Edge+",
    stage: "Stage 4: Record",
    stageNum: "04"
  },
  {
    slug: "ai-market-scanner",
    title: "Technical Scanner",
    description: "Cross-asset technical consensus & price action relative to key macro levels.",
    icon: Zap,
    features: ["Macro Correlation", "Technical Consensus", "Multi-Timeframe Scan"],
    tier: "Edge+",
    stage: "Stage 5: Review",
    stageNum: "05"
  },
  {
    slug: "algo-strategy-builder",
    title: "Algo Strategy Builder",
    description: "Describe your strategy. Get the code. AI-powered conversion of rules to Pine Script or Python.",
    icon: Terminal,
    features: ["Natural Language Input", "Pine Script v5", "Python Backtrader"],
    tier: "Floor",
    stage: "Stage 6: Improve",
    stageNum: "06"
  },
  {
    slug: "/investment-centre",
    title: "The Investment Centre",
    description: "Autonomous cross-asset macro synthesis, tri-model AI council, and quantitative risk analysis.",
    icon: Cpu,
    features: ["18 Real-Time Feeds", "1,420 Metrics 24/7", "HMAC Risk Tokens"],
    tier: "Foundation Add-on",
    stage: "Stage 7: Repeat Weekly",
    stageNum: "07"
  }
];

const stageGroups = [
  { id: "Stage 1: Prepare", num: "01", title: "Prepare Stage", desc: "Confirm account risk boundaries, session metrics, and current bias prior to taking any trade." },
  { id: "Stage 2: Plan", num: "02", title: "Plan Stage", desc: "Draft precise stop, targets, entry conditions, and run decadal backtests to validate your edge." },
  { id: "Stage 4: Record", num: "04", title: "Record Stage", desc: "Log real fill details, commission drag, slip, trade screenshots, and journal emotional notes." },
  { id: "Stage 5: Review", num: "05", title: "Review Stage", desc: "Verify plan adherence, compliance metrics, process scores, and generate automated AI summaries." },
  { id: "Stage 6: Improve", num: "06", title: "Improve Stage", desc: "Focus on one single process optimization commitment at a time alongside targeted lessons." },
  { id: "Stage 7: Repeat Weekly", num: "07", title: "Repeat Weekly", desc: "Compile sessional statistics, sign off weekly consistency score sheets, and set next week's focus." }
];

export default function ToolsMarketingPage() {
  const shouldReduce = useReducedMotion();

  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : 12 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.06, duration: 0.25, ease: "easeOut" as const },
    }),
  };

  return (
    <div 
      className="flex flex-col min-h-screen select-none"
      style={{ backgroundColor: "var(--paper-0)", color: "var(--ink-950)" }}
    >
      {/* ── 1. Hero Section ──────────────────────────────────────────────────────── */}
      <section
        className="relative w-full py-24 md:py-32 border-b overflow-hidden"
        style={{ backgroundColor: "var(--paper-0)", borderColor: "var(--line-200)" }}
      >
        {/* Subtle background texture */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]"
          style={{ 
            backgroundImage: "radial-gradient(var(--ink-950) 1px, transparent 1px)", 
            backgroundSize: "24px 24px" 
          }}
        />

        <div className="w-full max-w-[1280px] mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-6">
            
            {/* Eyebrow */}
            <motion.span
              variants={fadeUp}
              custom={0}
              initial="hidden"
              animate="visible"
              className="block text-[11px] font-mono uppercase tracking-[0.08em]"
              style={{ color: "var(--graphite-600)" }}
            >
              Proprietary Technology Stack · Data-Driven Infrastructure
            </motion.span>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              custom={1}
              initial="hidden"
              animate="visible"
              className="font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.08] tracking-[-0.02em] font-semibold"
              style={{ color: "var(--ink-950)" }}
            >
              The Alpha Stack. <br />
              <span style={{ color: "var(--graphite-600)" }}>
                Precision tools engineered for institutional discipline.
              </span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              variants={fadeUp}
              custom={2}
              initial="hidden"
              animate="visible"
              className="text-[17px] leading-[1.6] font-sans max-w-2xl"
              style={{ color: "var(--graphite-600)" }}
            >
              Precision analytical tools built by active traders. No generic alerts. No retail noise. Just data-led market intelligence, risk modeling, and execution tracking.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              variants={fadeUp}
              custom={3}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-4 pt-4"
            >
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-[13px] font-medium uppercase tracking-[0.06em] transition-colors duration-150"
                style={{
                  backgroundColor: "var(--signal-navy)",
                  color: "#FFFFFF",
                  borderRadius: 0,
                }}
              >
                Get All Access <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-[13px] font-medium uppercase tracking-[0.06em] border transition-colors duration-150"
                style={{
                  borderColor: "var(--line-200)",
                  color: "var(--ink-950)",
                  backgroundColor: "var(--paper-100)",
                  borderRadius: 0,
                }}
              >
                View Pricing Tiers
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── 2. Philosophy & Transparency Section ─────────────────────────────────── */}
      <section
        className="w-full py-20 md:py-28 border-b"
        style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}
      >
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <span
                className="block text-[11px] font-mono uppercase tracking-[0.08em]"
                style={{ color: "var(--graphite-600)" }}
              >
                Platform Integrity
              </span>

              <h2
                className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight tracking-[-0.02em] font-semibold"
                style={{ color: "var(--ink-950)" }}
              >
                We Built What <br />
                <span style={{ color: "var(--signal-navy)" }}>We Couldn't Find Elsewhere.</span>
              </h2>

              <p
                className="text-[15px] leading-[1.65] font-sans"
                style={{ color: "var(--graphite-600)" }}
              >
                The retail trading software market is flooded with lagging indicators, unverified strategy claims, and retail-grade charting add-ons. We got tired of using fragmented tools to manage live account risk.
              </p>

              <p
                className="text-[15px] leading-[1.65] font-sans"
                style={{ color: "var(--graphite-600)" }}
              >
                Drawdown&apos;s suite is engineered from first principles for risk control, statistical validity, and process accountability. Every tool exists because our own live trading desk demanded it.
              </p>

              <div className="pt-4 grid grid-cols-2 gap-6 border-t" style={{ borderColor: "var(--line-200)" }}>
                <div>
                  <div className="text-[28px] font-display font-semibold" style={{ color: "var(--ink-950)" }}>
                    100%
                  </div>
                  <p className="text-[11px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--graphite-600)" }}>
                    Data-Driven Logic
                  </p>
                </div>
                <div>
                  <div className="text-[28px] font-display font-semibold" style={{ color: "var(--ink-950)" }}>
                    100%
                  </div>
                  <p className="text-[11px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--graphite-600)" }}>
                    Transparent Methodology
                  </p>
                </div>
              </div>
            </div>

            {/* Right Quote Card */}
            <div className="lg:col-span-5">
              <div
                className="p-8 border relative"
                style={{
                  backgroundColor: "var(--paper-0)",
                  borderColor: "var(--line-200)",
                  borderRadius: 0,
                }}
              >
                <div className="flex items-center gap-4 mb-6 pb-6 border-b" style={{ borderColor: "var(--line-200)" }}>
                  <div 
                    className="w-12 h-12 overflow-hidden relative border"
                    style={{ borderColor: "var(--line-200)" }}
                  >
                    <Image 
                      src="/images/pete.jpg" 
                      alt="Pete Currey" 
                      fill 
                      className="object-cover grayscale" 
                    />
                  </div>
                  <div>
                    <h4 className="font-display text-[15px] font-semibold" style={{ color: "var(--ink-950)" }}>
                      Pete Currey
                    </h4>
                    <p className="text-[11px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--graphite-600)" }}>
                      Founder & Head of Trading
                    </p>
                  </div>
                </div>

                <blockquote 
                  className="text-[15px] leading-[1.65] font-sans italic"
                  style={{ color: "var(--graphite-600)" }}
                >
                  &ldquo;If a tool doesn&apos;t give us a measurable statistical edge or enforce risk discipline, we don&apos;t build it. Period. We aren&apos;t here to sell magic indicators; we&apos;re here to give you the infrastructure to survive and scale.&rdquo;
                </blockquote>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 3. Workflow Tools Grid ─────────────────────────────────────────────────── */}
      <section className="w-full py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-6 space-y-16">
          
          {stageGroups.map((group) => {
            const stageTools = toolCategories.filter(t => t.stage === group.id);
            if (stageTools.length === 0) return null;

            return (
              <div key={group.id} className="space-y-6">
                
                {/* Stage Header */}
                <div className="pb-4 border-b" style={{ borderColor: "var(--line-200)" }}>
                  <div className="flex items-center gap-3 mb-1">
                    <span 
                      className="text-[13px] font-mono font-semibold uppercase tracking-[0.08em]" 
                      style={{ color: "var(--signal-navy)" }}
                    >
                      [{group.num}]
                    </span>
                    <span 
                      className="text-[11px] font-mono uppercase tracking-[0.08em]"
                      style={{ color: "var(--graphite-600)" }}
                    >
                      {group.id}
                    </span>
                  </div>
                  <h3 className="font-display text-[22px] font-semibold tracking-[-0.01em]" style={{ color: "var(--ink-950)" }}>
                    {group.title}
                  </h3>
                  <p className="text-[14px] leading-relaxed font-sans max-w-2xl mt-1" style={{ color: "var(--graphite-600)" }}>
                    {group.desc}
                  </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stageTools.map((tool, idx) => {
                    const Icon = tool.icon;
                    return (
                      <motion.div
                        key={tool.slug}
                        variants={fadeUp}
                        custom={idx % 3}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        className="p-6 border flex flex-col justify-between transition-colors duration-150 group"
                        style={{
                          backgroundColor: "var(--paper-100)",
                          borderColor: "var(--line-200)",
                          borderRadius: 0,
                        }}
                      >
                        <div>
                          {/* Header row */}
                          <div className="flex items-center justify-between mb-4">
                            <div 
                              className="p-2 border"
                              style={{ 
                                backgroundColor: "var(--paper-0)", 
                                borderColor: "var(--line-200)" 
                              }}
                            >
                              <Icon size={18} strokeWidth={1.5} style={{ color: "var(--ink-950)" }} />
                            </div>

                            <span 
                              className="text-[10px] font-mono uppercase tracking-[0.08em] px-2 py-0.5 border"
                              style={{
                                borderColor: "var(--line-200)",
                                color: tool.tier === "Free" ? "var(--green-700, #15803d)" : "var(--graphite-600)",
                                backgroundColor: "var(--paper-0)",
                              }}
                            >
                              {tool.tier}
                            </span>
                          </div>

                          {/* Title */}
                          <h4 
                            className="font-display text-[17px] font-semibold mb-2 transition-colors duration-150 group-hover:text-[var(--signal-navy)]"
                            style={{ color: "var(--ink-950)" }}
                          >
                            {tool.title}
                          </h4>

                          {/* Description */}
                          <p 
                            className="text-[13px] leading-[1.55] font-sans mb-6 min-h-[40px]"
                            style={{ color: "var(--graphite-600)" }}
                          >
                            {tool.description}
                          </p>

                          {/* Features list */}
                          <ul className="space-y-2 mb-6 border-t pt-4" style={{ borderColor: "var(--line-200)" }}>
                            {tool.features.map((feat, fIdx) => (
                              <li key={fIdx} className="flex items-center gap-2">
                                <CheckCircle2 size={13} style={{ color: "var(--graphite-600)" }} />
                                <span className="text-[11px] font-mono uppercase tracking-[0.06em]" style={{ color: "var(--graphite-600)" }}>
                                  {feat}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* CTA Link */}
                        <Link
                          href={tool.slug.startsWith("/") ? tool.slug : `/tools/${tool.slug}`}
                          className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.08em] pt-2 transition-colors duration-150"
                          style={{ color: "var(--ink-950)" }}
                        >
                          Access Tool <ArrowRight size={13} className="transition-transform duration-150 group-hover:translate-x-1" />
                        </Link>

                      </motion.div>
                    );
                  })}
                </div>

              </div>
            );
          })}

        </div>
      </section>

      {/* ── 4. Trust & Security Standards ─────────────────────────────────────────── */}
      <section
        className="w-full py-20 md:py-28 border-t select-none"
        style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}
      >
        <div className="max-w-[1280px] mx-auto px-6">
          
          <div className="max-w-2xl mb-12">
            <span
              className="block text-[11px] font-mono uppercase tracking-[0.08em] mb-2"
              style={{ color: "var(--graphite-600)" }}
            >
              Data Integrity & Infrastructure
            </span>
            <h2
              className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight tracking-[-0.02em] font-semibold"
              style={{ color: "var(--ink-950)" }}
            >
              Engineered for absolute accuracy
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div
              className="p-8 border"
              style={{
                backgroundColor: "var(--paper-0)",
                borderColor: "var(--line-200)",
                borderRadius: 0,
              }}
            >
              <div className="mb-4">
                <ShieldCheck size={24} strokeWidth={1.5} style={{ color: "var(--ink-950)" }} />
              </div>
              <h3 className="font-display text-[18px] font-semibold mb-3" style={{ color: "var(--ink-950)" }}>
                Rigorously Backtested Architecture
              </h3>
              <p className="text-[14px] leading-[1.6] font-sans" style={{ color: "var(--graphite-600)" }}>
                Every indicator, scanner algorithm, and macro aggregation model is verified against multi-year tick data before public release. We publish empirical proof, not unverified claims.
              </p>
            </div>

            <div
              className="p-8 border"
              style={{
                backgroundColor: "var(--paper-0)",
                borderColor: "var(--line-200)",
                borderRadius: 0,
              }}
            >
              <div className="mb-4">
                <Lock size={24} strokeWidth={1.5} style={{ color: "var(--ink-950)" }} />
              </div>
              <h3 className="font-display text-[18px] font-semibold mb-3" style={{ color: "var(--ink-950)" }}>
                Strict Privacy & Encryption
              </h3>
              <p className="text-[14px] leading-[1.6] font-sans" style={{ color: "var(--graphite-600)" }}>
                Your trade logs, account balances, and API credentials remain end-to-end encrypted. We do not sell user data, counter-trade member positions, or share proprietary journal entries.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── 5. Bottom CTA Banner ──────────────────────────────────────────────────── */}
      <section
        className="w-full py-24 md:py-32 border-t text-center select-none"
        style={{ backgroundColor: "var(--paper-0)", borderColor: "var(--line-200)" }}
      >
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <span
              className="block text-[11px] font-mono uppercase tracking-[0.08em]"
              style={{ color: "var(--graphite-600)" }}
            >
              Operational Edge
            </span>
            <h2
              className="font-display text-[clamp(2rem,4vw,3.25rem)] leading-tight tracking-[-0.02em] font-semibold"
              style={{ color: "var(--ink-950)" }}
            >
              Ready to execute with data?
            </h2>
            <p className="text-[15px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--graphite-600)" }}>
              Data-driven discipline is one decision away.
            </p>
            <div className="pt-4">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[14px] font-medium uppercase tracking-[0.06em] transition-colors duration-150"
                style={{
                  backgroundColor: "var(--signal-navy)",
                  color: "#FFFFFF",
                  borderRadius: 0,
                }}
              >
                Secure Your Access <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
