"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useRegion } from "@/components/layout/RegionalLayout";

export function HeroSection() {
  const { region, demonym, regulatoryBody } = useRegion();
  const regionPrefix = region === "uk" ? "" : `/${region}`;
  const regShort = regulatoryBody ? regulatoryBody.split(" ")[0] : "FCA";
  const shouldReduce = useReducedMotion();

  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.2, ease: "easeOut" as const },
    }),
  };

  const REGIONAL_SUB: Record<string, string> = {
    us: `A unified trading operating system for American traders. Connect market context, exact position sizing, trade planning, and journal review into one disciplined loop.`,
    au: `A unified trading operating system for Australian traders. ASIC-regulated broker coverage, AUD-normalised sizing, and one connected decision workflow.`,
    sg: `A unified trading operating system for Singapore traders. MAS-regulated broker coverage, SGD-normalised sizing, and structured risk discipline.`,
    hk: `A unified trading operating system for Hong Kong traders. SFC-regulated broker coverage, HKD-normalised sizing, and unified trade planning.`,
    uk: `The trading operating system for serious independent traders. Connect your market context, position sizing, trade journal, and review in one unbroken loop.`,
  };
  const sub = REGIONAL_SUB[region] ?? REGIONAL_SUB["uk"];

  return (
    <section
      className="relative w-full min-h-[calc(100vh-58px)] flex flex-col justify-center overflow-hidden pt-20 pb-32 md:pt-24 md:pb-40 border-b"
      style={{
        backgroundColor: "var(--paper-0)",
        borderColor: "var(--line-200)",
      }}
    >
      {/* Background candlestick chart — purely decorative, 3% opacity */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none select-none opacity-[0.03]"
        style={{ backgroundImage: "url('/images/dashboard-preview.png')", backgroundSize: "cover", backgroundPosition: "center" }}
      />

      <div className="w-full max-w-[1280px] mx-auto px-6 relative z-10">
        <div className="max-w-3xl space-y-8">

          {/* Eyebrow */}
          <motion.span
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate="visible"
            className="block text-[11px] uppercase tracking-[0.08em] font-mono"
            style={{ color: "var(--graphite-600)" }}
          >
            Trading Operating System · Decision-Support Infrastructure
          </motion.span>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate="visible"
            className="font-display text-[clamp(2.25rem,5vw,4rem)] leading-[1.08] tracking-[-0.02em] font-semibold"
            style={{ color: "var(--ink-950)" }}
          >
            A trading operating system{" "}
            <span style={{ color: "var(--graphite-600)" }}>
              for serious independent traders.
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            variants={fadeUp}
            custom={2}
            initial="hidden"
            animate="visible"
            className="text-[18px] leading-[1.6] font-normal"
            style={{ color: "var(--graphite-600)" }}
          >
            {sub}
          </motion.p>

          {/* CTAs — zero border-radius */}
          <motion.div
            variants={fadeUp}
            custom={3}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row gap-4 pt-2"
          >
            <Link
              href={`${regionPrefix}/signup`}
              id="hero-cta-primary"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-[14px] font-medium transition-colors duration-150"
              style={{
                backgroundColor: "var(--signal-navy)",
                color: "#FAFAF9",
                borderRadius: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Start free — no card required
              <ArrowRight size={16} strokeWidth={1.5} />
            </Link>
            <Link
              href="#operating-loop"
              id="hero-cta-secondary"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-[14px] font-medium border transition-colors duration-150"
              style={{
                color: "var(--ink-950)",
                borderColor: "var(--line-200)",
                borderRadius: 0,
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--ink-950)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--line-200)";
              }}
            >
              See the operating loop
            </Link>
          </motion.div>

          {/* Trust signals — hairline top rule, IBM Plex Mono */}
          <motion.div
            variants={fadeUp}
            custom={4}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row flex-wrap gap-x-8 gap-y-3 pt-6 border-t text-[13px]"
            style={{ borderColor: "var(--line-200)", color: "var(--graphite-600)" }}
          >
            <span className="flex items-center gap-2">
              <ShieldCheck size={16} strokeWidth={1.5} style={{ color: "var(--signal-navy)" }} />
              Phase 1 free forever
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck size={16} strokeWidth={1.5} style={{ color: "var(--signal-navy)" }} />
              {regShort}-regulated broker coverage
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck size={16} strokeWidth={1.5} style={{ color: "var(--signal-navy)" }} />
              No financial advice — decision-support only
            </span>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
