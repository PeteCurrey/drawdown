"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, Scale, Award, TrendingUp, AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import { LEGAL_CONFIG } from "@/config/legal";

export default function AboutClient() {
  const shouldReduce = useReducedMotion();

  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
    }),
  };

  const timelineItems = [
    {
      period: "BEFORE 2016 — COMMERCIAL & OPERATIONAL EXPERIENCE",
      type: "Business Leadership",
      title: "Commercial Foundations",
      desc: "Prior to trading live financial markets full-time, Pete's career focused on commercial business leadership, operational risk evaluation, cash flow management, contract negotiation, and running commercial enterprises. This commercial background provided crucial grounding in cash management, risk exposure, and decision-making under uncertainty, but it was not institutional financial market trading.",
      icon: Scale,
    },
    {
      period: "2016 — LIVE TRADING BEGINS",
      type: "Live Execution Chronology",
      title: "Transition to Live Markets",
      desc: "Pete began trading live financial markets in 2016. This marks the start of Pete's active live-market trading chronology. Moving from simulated analysis to executing real capital across spot FX, index CFDs, and commodities introduced the inescapable reality of real-money trading psychology and execution discipline.",
      icon: TrendingUp,
      highlighted: true,
    },
    {
      period: "DEVELOPMENT OF MARKET EXPERIENCE",
      type: "Multi-Asset Execution",
      title: "Navigating Diverse Cycles",
      desc: "Over years of active execution, Pete traded major foreign exchange pairs (GBP/USD, EUR/USD, AUD/USD), gold and precious metals, equity index derivatives (FTSE 100, S&P 500, DAX 40), and digital assets. This execution provided first-hand experience with market liquidity cycles, news volatility, spread expansion, slippage, and broker execution mechanics.",
      icon: Award,
    },
    {
      period: "LOSSES, DRAWDOWNS & REAL LESSONS",
      type: "Transparent Account of Risk",
      title: "The Reality of Market Risk",
      desc: "Drawdown was not built from a pristine, loss-free trading record. Like every genuine active trader, Pete experienced painful drawdowns, execution mistakes, overleveraged setup losses, and the psychological trap of revenge trading during high-volatility events.",
      icon: ShieldCheck,
      details: [
        { title: "Leverage Magnifies Error", text: "High effective leverage can turn a routine statistical draw into an account emergency." },
        { title: "Free Margin Discipline", text: "Maintaining sufficient free margin is essential for surviving unexpected market gaps." },
        { title: "Stop Losses Are Mandatory", text: "Discipline is not optional — hard stop-loss limits protect against black-swan movements." },
        { title: "Survival Before Return", text: "Staying in the game precedes long-term consistency. Capital preservation comes first." },
      ]
    },
    {
      period: "DEVELOPMENT OF DRAWDOWN",
      type: "Platform Origin",
      title: "Systems Over Promises",
      desc: "Drawdown was built to combine structured risk education, quantitative indicator models, transparent market analysis, trade journaling, and AI-assisted performance review. It distills real market experience into an objective, data-driven framework.",
      icon: CheckCircle2,
    }
  ];

  return (
    <div style={{ backgroundColor: "var(--paper-0)", color: "var(--ink-950)" }} className="min-h-screen font-sans selection:bg-black/10">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 border-b" style={{ borderColor: "var(--line-200)" }}>
        {/* Background Grid Pattern - subtle and modern */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.02]" 
          style={{ 
            backgroundImage: "radial-gradient(var(--ink-950) 1px, transparent 1px)", 
            backgroundSize: "24px 24px" 
          }} 
        />
        <div className="max-w-[1280px] mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <motion.span 
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="inline-block text-[11px] font-mono uppercase tracking-[0.08em] mb-4"
              style={{ color: "var(--graphite-600)" }}
            >
              Foundry &amp; Platform Principles
            </motion.span>
            <motion.h1 
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-bold tracking-tight leading-[1.08] mb-8"
              style={{ color: "var(--ink-950)" }}
            >
              Built from real market execution. <br />
              <span style={{ color: "var(--graphite-600)" }}>Zero hype.</span>
            </motion.h1>
            <motion.p 
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-[18px] leading-[1.6] text-balance font-normal"
              style={{ color: "var(--graphite-600)" }}
            >
              Drawdown was created to solve a widespread problem in trading education: flashy lifestyle marketing, secret \"guaranteed\" algorithms, and unrealistic expectations sold to retail traders.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Philosophy / Quote block with founder photo */}
      <section className="py-16 border-b" style={{ borderColor: "var(--line-200)", backgroundColor: "var(--paper-100)" }}>
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            
            {/* Founder photo */}
            <div className="md:col-span-3 flex justify-center md:justify-start">
              <div className="relative">
                <div className="w-48 h-48 md:w-56 md:h-56 relative overflow-hidden border-2" style={{ borderColor: "var(--line-200)" }}>
                  <Image
                    src="/images/pete-currey-founder.jpg"
                    alt="Pete Currey, Founder of Drawdown"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 192px, 224px"
                  />
                </div>
                <div className="mt-3 text-center">
                  <p className="text-[11px] font-mono uppercase tracking-[0.08em] font-bold" style={{ color: "var(--ink-950)" }}>Pete Currey</p>
                  <p className="text-[10px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--graphite-600)" }}>Founder · Chesterfield, UK</p>
                </div>
              </div>
            </div>

            {/* Quote + focus */}
            <div className="md:col-span-9 space-y-6">
              <div>
                <span className="block text-[10px] font-mono uppercase tracking-[0.08em] mb-2" style={{ color: "var(--graphite-600)" }}>
                  Core Thesis
                </span>
                <p className="text-[20px] md:text-[22px] font-medium leading-[1.5] tracking-tight" style={{ color: "var(--ink-950)" }}>
                  "The reality is that retail trading is a high-stakes business of statistical probabilities. Over 75% of retail accounts lose money — not due to a lack of indicators, but due to poor risk management, emotional overexposure, and chasing unvalidated promises."
                </p>
                <span className="block text-xs font-mono mt-4" style={{ color: "var(--graphite-600)" }}>
                  — Pete Currey, Founder
                </span>
              </div>
              <div className="p-6 border bg-white" style={{ borderColor: "var(--line-200)" }}>
                <h4 className="font-display font-semibold text-[13px] uppercase tracking-[0.08em] mb-2">Our Focus</h4>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
                  Drawdown provides structured education, quantitative indicator models, signal analysis, and risk-first journaling software. We focus entirely on process, discipline, and capital preservation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chronology Section */}
      <section className="py-20 border-b" style={{ borderColor: "var(--line-200)" }}>
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="mb-12">
            <span className="block text-[11px] font-mono uppercase tracking-[0.08em] mb-2" style={{ color: "var(--graphite-600)" }}>
              History &amp; Milestones
            </span>
            <h2 className="font-display text-[28px] md:text-[36px] font-bold tracking-tight" style={{ color: "var(--ink-950)" }}>
              The Founder Chronology
            </h2>
            <p className="text-xs font-mono uppercase tracking-widest mt-1" style={{ color: "var(--graphite-600)" }}>
              Fact-Checked Timeline
            </p>
          </div>

          <div className="space-y-8 max-w-4xl">
            {timelineItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="p-8 border relative group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.07)] cursor-default"
                  style={{
                    backgroundColor: item.highlighted ? "var(--paper-100)" : "var(--paper-0)",
                    borderColor: item.highlighted ? "var(--ink-950)" : "var(--line-200)",
                  }}
                >
                  {/* Hover top accent line */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--signal-navy)] to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
                  <div className="flex items-start gap-5">
                    <div className="p-3 border rounded-none bg-white shrink-0 hidden sm:block transition-all duration-300 group-hover:border-[var(--signal-navy)] group-hover:shadow-sm" style={{ borderColor: "var(--line-200)" }}>
                      <Icon size={18} strokeWidth={1.5} style={{ color: "var(--ink-950)" }} />
                    </div>
                    <div className="space-y-3 w-full">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.08em]" style={{ color: "var(--graphite-600)" }}>
                          {item.period}
                        </span>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 border" style={{ borderColor: "var(--line-200)", color: "var(--graphite-600)" }}>
                          {item.type}
                        </span>
                      </div>
                      <h3 className="font-display font-semibold text-[18px] tracking-tight group-hover:text-[var(--signal-navy)] transition-colors duration-300" style={{ color: "var(--ink-950)" }}>
                        {item.title}
                      </h3>
                      <p className="text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
                        {item.desc}
                      </p>

                      {item.details && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t" style={{ borderColor: "var(--line-200)" }}>
                          {item.details.map((detail, idx) => (
                            <div key={idx} className="space-y-1">
                              <h5 className="text-[12px] font-semibold" style={{ color: "var(--ink-950)" }}>{detail.title}</h5>
                              <p className="text-[12px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>{detail.text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Current Risk Framework */}
      <section className="py-20 border-b" style={{ borderColor: "var(--line-200)", backgroundColor: "var(--paper-100)" }}>
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="mb-12">
            <span className="block text-[11px] font-mono uppercase tracking-[0.08em] mb-2" style={{ color: "var(--graphite-600)" }}>
              Execution Guidelines
            </span>
            <h2 className="font-display text-[28px] md:text-[36px] font-bold tracking-tight" style={{ color: "var(--ink-950)" }}>
              Current Risk Framework
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: "01", title: "Predefined Risk", body: "Risk per trade is strictly defined before entry (typically 0.5%–1% of total equity). No trades are opened without calculated stop parameters." },
              { num: "02", title: "Post-Trade Review", body: "Every trade is recorded in the AI Trade Journal to audit execution quality, emotional factors, and statistical compliance against the trading plan." },
              { num: "03", title: "Objective Confluence", body: "Decisions rely on multi-factor technical alignment, market data feeds, and quantitative indicators, rejecting single magic indicators or impulse entries." },
            ].map((card) => (
              <div
                key={card.num}
                className="p-8 border bg-white space-y-4 group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.07)]"
                style={{ borderColor: "var(--line-200)" }}
              >
                {/* Hover top accent line */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--signal-navy)] to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
                <div className="w-8 h-8 rounded-none border flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 group-hover:border-[var(--signal-navy)]" style={{ borderColor: "var(--line-200)" }}>
                  {card.num}
                </div>
                <h3 className="font-display font-semibold text-[16px] uppercase tracking-[0.08em] group-hover:text-[var(--signal-navy)] transition-colors duration-300">{card.title}</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explicit Disclosures (Transparency Notice) */}
      <section className="py-20 border-b" style={{ borderColor: "var(--line-200)" }}>
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="p-8 border bg-[#FAF5F5] border-red-200 space-y-6 max-w-4xl">
            <div className="flex items-center gap-3 text-red-800">
              <ShieldAlert size={20} strokeWidth={1.5} />
              <h3 className="font-mono text-xs font-bold uppercase tracking-[0.08em]">
                Transparency Notice: What Is Not Being Claimed
              </h3>
            </div>
            
            <p className="text-[15px] leading-relaxed font-medium italic" style={{ color: "var(--ink-950)" }}>
              "Drawdown is built from real experience, including mistakes and losses. It is not presented as a perfect trading record."
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px] list-disc pl-5" style={{ color: "var(--graphite-600)" }}>
              <li>No claim of 20 years or two decades of live market trading (live trading began in 2016).</li>
              <li>No claim of FCA authorisation or regulated financial adviser status.</li>
              <li>No claim of regulated broker, fund manager, or institutional mandate role.</li>
              <li>No claim of secret, guaranteed, or loss-proof trading strategies.</li>
              <li>No claim that past educational results guarantee future performance.</li>
              <li>No claim of audited institutional investment performance.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer Authority Box */}
      <section className="py-12" style={{ backgroundColor: "var(--paper-100)" }}>
        <div className="max-w-[1280px] mx-auto px-6 text-center space-y-4">
          <p className="text-[11px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--graphite-600)" }}>
            {LEGAL_CONFIG.fullTradingEntity} · {LEGAL_CONFIG.tradingAddress}
          </p>
          <p className="text-xs max-w-xl mx-auto" style={{ color: "var(--graphite-600)" }}>
            Questions about our platform, regulatory perimeter or founder journey? Contact{" "}
            <a href={`mailto:${LEGAL_CONFIG.supportEmail}`} className="underline font-semibold" style={{ color: "var(--ink-950)" }}>
              {LEGAL_CONFIG.supportEmail}
            </a>.
          </p>
        </div>
      </section>

    </div>
  );
}
