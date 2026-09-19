"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ShieldCheck, Calculator, Lock, TrendingUp } from "lucide-react";
import { useRegion } from "@/components/layout/RegionalLayout";
import { TelemetryGrid } from "@/components/ui/TelemetryGrid";

export function HeroSection() {
  const { region, regulatoryBody } = useRegion();
  const regionPrefix = region === "uk" ? "" : `/${region}`;
  const regShort = regulatoryBody ? regulatoryBody.split(" ")[0] : "FCA";
  const shouldReduce = useReducedMotion();

  // Interactive calculator state for Right Column
  const [balance, setBalance] = useState<number>(25000);
  const [riskPercent, setRiskPercent] = useState<number>(1.0);
  const stopPips = 18.4;
  const riskAmount = (balance * (riskPercent / 100));
  // Lot calculation: RiskAmount / (StopPips * PipValueForStandardLot ~ $10 / £7.85)
  const pipValueGbp = 7.85;
  const calculatedLots = (riskAmount / (stopPips * pipValueGbp)).toFixed(2);
  const maxDrawdownImpact = ((riskAmount / balance) * 100 * 0.8).toFixed(1);

  const currencySymbol = region === "de" ? "€" : "£";

  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : 8 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.24, ease: [0.16, 1, 0.3, 1] as const },
    }),
  };

  return (
    <section
      className="relative w-full min-h-[calc(100vh-58px)] flex flex-col justify-center overflow-hidden pt-16 pb-24 md:pt-20 md:pb-28 border-b"
      style={{
        backgroundColor: "var(--surface-base)",
        borderColor: "var(--border-subtle)",
      }}
    >
      {/* Background grid */}
      <TelemetryGrid opacity={0.03} />

      <div className="w-full max-w-[1280px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column (7 cols): Editorial Typography & CTA */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Eyebrow */}
            <motion.div
              variants={fadeUp}
              custom={0}
              initial="hidden"
              animate="visible"
            >
              <span
                className="type-label uppercase tracking-widest font-mono font-medium block"
                style={{ color: "var(--text-secondary)" }}
              >
                TRADING OPERATING SYSTEM
              </span>
            </motion.div>

            {/* Headline — Instrument Serif display-xl */}
            <motion.h1
              variants={fadeUp}
              custom={1}
              initial="hidden"
              animate="visible"
              className="type-display-xl font-normal tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              A disciplined operating system for serious independent traders.
            </motion.h1>

            {/* Sub-headline — Inter body-lg max-w-[54ch] */}
            <motion.p
              variants={fadeUp}
              custom={2}
              initial="hidden"
              animate="visible"
              className="type-body-lg font-normal max-w-[54ch] leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              Connect market preparation, position sizing, trade execution, and journal review into one structured workflow. Built for traders who treat the market as a profession.
            </motion.p>

            {/* Single Primary CTA */}
            <motion.div
              variants={fadeUp}
              custom={3}
              initial="hidden"
              animate="visible"
              className="pt-2"
            >
              <Link
                href={`${regionPrefix}/signup`}
                id="hero-cta-primary"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 font-sans text-sm font-medium transition-all duration-150 active:translate-y-0.5 cursor-pointer"
                style={{
                  backgroundColor: "var(--accent)",
                  color: "var(--surface-base)",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "var(--elev-2)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--accent-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--accent)")}
              >
                Start Free — Phase 1 Included
                <ArrowRight size={16} strokeWidth={1.5} />
              </Link>
            </motion.div>

            {/* Trust Signals Row */}
            <motion.div
              variants={fadeUp}
              custom={4}
              initial="hidden"
              animate="visible"
              className="flex flex-col sm:flex-row flex-wrap gap-x-8 gap-y-3 pt-6 border-t text-xs font-sans"
              style={{ borderColor: "var(--border-subtle)", color: "var(--text-tertiary)" }}
            >
              <span className="flex items-center gap-2">
                <ShieldCheck size={15} strokeWidth={1.5} style={{ color: "var(--accent)" }} />
                Phase 1 free forever
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck size={15} strokeWidth={1.5} style={{ color: "var(--accent)" }} />
                {regShort}-regulated broker coverage
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck size={15} strokeWidth={1.5} style={{ color: "var(--accent)" }} />
                No financial advice — analytics only
              </span>
            </motion.div>

          </div>

          {/* Right Column (5 cols): High-Fidelity RUN MY TRADE Calculator Card */}
          <div className="lg:col-span-5">
            <div
              className="border p-6 md:p-8 space-y-6 relative"
              style={{
                backgroundColor: "var(--surface-raised)",
                borderColor: "var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--elev-1)",
              }}
            >
              {/* Card Topbar */}
              <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: "var(--border-subtle)" }}>
                <div className="flex items-center gap-2.5">
                  <Calculator className="w-4 h-4 text-[var(--accent)]" strokeWidth={1.5} />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-primary)" }}>
                    RUN MY TRADE
                  </span>
                </div>
                <span
                  className="font-mono text-[10px] uppercase px-2 py-0.5 border"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--market-up) 10%, transparent)",
                    borderColor: "color-mix(in srgb, var(--market-up) 25%, transparent)",
                    color: "var(--market-up)",
                    borderRadius: "var(--radius-pill)",
                  }}
                >
                  PRE-TRADE SIZING
                </span>
              </div>

              {/* Instrument & Account Selector */}
              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="font-sans text-xs" style={{ color: "var(--text-secondary)" }}>Instrument</span>
                  <span className="font-mono text-xs font-bold" style={{ color: "var(--text-primary)" }}>GBP/USD · Spot FX</span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <span className="font-sans text-xs" style={{ color: "var(--text-secondary)" }}>Account Balance</span>
                    <span className="font-mono tabular-nums text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                      {currencySymbol}{balance.toLocaleString()}
                    </span>
                  </div>
                  {/* Account Size Toggle Pills */}
                  <div className="grid grid-cols-4 gap-1.5 pt-1">
                    {[10000, 25000, 50000, 100000].map((val) => (
                      <button
                        key={val}
                        onClick={() => setBalance(val)}
                        className="py-1 text-[11px] font-mono tabular-nums border transition-all duration-150 cursor-pointer text-center"
                        style={{
                          backgroundColor: balance === val ? "var(--surface-overlay)" : "var(--surface-base)",
                          borderColor: balance === val ? "var(--accent)" : "var(--border-subtle)",
                          color: balance === val ? "var(--text-primary)" : "var(--text-secondary)",
                          borderRadius: "var(--radius-sm)",
                        }}
                      >
                        {currencySymbol}{val >= 1000 ? `${val / 1000}k` : val}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-sans text-xs" style={{ color: "var(--text-secondary)" }}>Risk Allocation</span>
                    <span className="font-mono tabular-nums text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                      {riskPercent.toFixed(1)}% ({currencySymbol}{riskAmount.toFixed(2)})
                    </span>
                  </div>
                  {/* Risk Slider */}
                  <input
                    type="range"
                    min="0.5"
                    max="2.5"
                    step="0.25"
                    value={riskPercent}
                    onChange={(e) => setRiskPercent(parseFloat(e.target.value))}
                    className="w-full accent-[var(--accent)] cursor-pointer"
                  />
                </div>

                <div className="flex justify-between items-baseline pt-1">
                  <span className="font-sans text-xs" style={{ color: "var(--text-secondary)" }}>Stop Invalidation</span>
                  <span className="font-mono tabular-nums text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                    {stopPips} pips
                  </span>
                </div>
              </div>

              {/* Sizing Results Output Block */}
              <div
                className="p-4 border space-y-3"
                style={{
                  backgroundColor: "var(--surface-base)",
                  borderColor: "var(--border-subtle)",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="type-label uppercase" style={{ color: "var(--text-secondary)" }}>CALCULATED POSITION</span>
                  <span className="font-mono tabular-nums text-xl font-bold" style={{ color: "var(--accent)" }}>
                    {calculatedLots} lots
                  </span>
                </div>
                <div className="flex items-center justify-between border-t pt-2 text-xs" style={{ borderColor: "var(--border-subtle)" }}>
                  <span className="font-sans" style={{ color: "var(--text-secondary)" }}>Drawdown Impact</span>
                  <span className="font-mono tabular-nums font-semibold" style={{ color: "var(--market-up)" }}>
                    {maxDrawdownImpact}% buffer
                  </span>
                </div>
              </div>

              {/* Plan Lock Verification Bar */}
              <div className="flex items-center justify-between pt-1 text-[11px] font-mono" style={{ color: "var(--text-secondary)" }}>
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[var(--accent)]" strokeWidth={1.5} />
                  <span>Pre-commit snapshot required</span>
                </span>
                <span className="text-[10px] uppercase font-semibold" style={{ color: "var(--market-up)" }}>
                  ● VALIDATED
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
