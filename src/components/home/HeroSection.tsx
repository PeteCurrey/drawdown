"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  motion, 
  useReducedMotion, 
  useMotionValue, 
  useSpring, 
  useTransform, 
  useScroll, 
  useMotionTemplate 
} from "framer-motion";
import { ArrowRight, ShieldCheck, Calculator, Lock } from "lucide-react";
import { useRegion } from "@/components/layout/RegionalLayout";
import { TelemetryGrid } from "@/components/ui/TelemetryGrid";

export function HeroSection() {
  const { region, regulatoryBody } = useRegion();
  const regionPrefix = region === "uk" ? "" : `/${region}`;
  const regShort = regulatoryBody ? regulatoryBody.split(" ")[0] : "FCA";
  const shouldReduce = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice(
      window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window
    );
  }, []);

  // Pointer position tracking: normalized -0.5 to 0.5
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring damping settling cleanly over ~600ms on mouse leave
  const springConfig = { damping: 26, stiffness: 120, mass: 0.7 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Subtle perspective tilt: max 2.5 degrees in x and y
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [2.5, -2.5]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-2.5, 2.5]);

  // Shadow offset slightly away from cursor direction (fixed light source above and slightly left)
  const shadowOffsetX = useTransform(smoothX, [-0.5, 0.5], [6, -6]);
  const shadowOffsetY = useTransform(smoothY, [-0.5, 0.5], [20, 10]);

  // Dynamic layered shadow tracking pointer
  const dynamicShadow = useMotionTemplate`inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 2px rgba(16,24,40,0.04), ${shadowOffsetX}px ${shadowOffsetY}px 32px -8px rgba(16,24,40,0.12), 0 32px 64px -24px rgba(16,24,40,0.14)`;

  // Scroll depth: hero right-column card drifts upward ~4.5% as user scrolls through hero
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const cardScrollDrift = useTransform(scrollYProgress, [0, 1], ["0%", "-4.5%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduce || isTouchDevice || !cardContainerRef.current) return;
    const rect = cardContainerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsCardHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  // Interactive calculator state for Right Column
  const [balance, setBalance] = useState<number>(25000);
  const [riskPercent, setRiskPercent] = useState<number>(1.0);
  const [isCardHovered, setIsCardHovered] = useState(false);

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
      ref={sectionRef}
      className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden pt-[calc(58px+3rem)] pb-24 md:pt-[calc(58px+4rem)] md:pb-28 border-b"
      style={{
        backgroundColor: "#FFFFFF",
        borderColor: "rgba(0,0,0,0.05)",
      }}
    >
      {/* Soft off-centre 3.5% accent radial tint — 24s slow imperceptible position drift */}
      <div 
        className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden"
        aria-hidden="true"
      >
        <div 
          className="absolute w-[120%] h-[120%] -top-[10%] -left-[10%]"
          style={{
            background: "radial-gradient(ellipse 70% 60% at 75% 25%, rgba(22,33,62,0.035), transparent 70%)",
            animation: shouldReduce ? "none" : "hero-radial-drift 24s ease-in-out infinite",
            willChange: "transform",
          }}
        />
      </div>

      {/* Faded Client Dashboard Background */}
      <div 
        className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
        aria-hidden="true"
        style={{
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0) 65%)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0) 65%)",
        }}
      >
        <Image
          src="/images/dashboard-preview.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-top opacity-[0.08] mix-blend-multiply filter contrast-125 blur-[1px]"
        />
        <div 
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 50% 20%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.7) 45%, #FFFFFF 80%)",
          }}
        />
      </div>

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
              className="type-display-xl font-extralight tracking-tight"
              style={{ color: "var(--text-primary)", fontWeight: 200 }}
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
                  color: "#FFFFFF",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 1px 2px rgba(16,24,40,0.08), 0 3px 10px rgba(16,24,40,0.12)",
                  borderBottom: "1px solid rgba(0,0,0,0.22)",
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
              style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--text-tertiary)" }}
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

          {/* Right Column (5 cols): High-Fidelity PLAN MY TRADE Calculator Card — Modern Premium with Pointer Tilt & Scroll Drift */}
          <motion.div 
            className="lg:col-span-5"
            style={{
              y: shouldReduce ? 0 : cardScrollDrift,
              perspective: 1200,
            }}
          >
            <motion.div
              ref={cardContainerRef}
              className="p-6 md:p-8 space-y-6 relative group"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsCardHovered(true)}
              onMouseLeave={handleMouseLeave}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "16px",
                border: "1px solid rgba(0,0,0,0.06)",
                borderBottom: "1px solid rgba(0,0,0,0.09)",
                rotateX: shouldReduce || isTouchDevice ? 0 : rotateX,
                rotateY: shouldReduce || isTouchDevice ? 0 : rotateY,
                boxShadow: shouldReduce || isTouchDevice
                  ? "var(--elev-2)"
                  : dynamicShadow,
                transformStyle: "preserve-3d",
                willChange: "transform, box-shadow",
              }}
            >
              {/* Card Topbar */}
              <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                <div className="flex items-center gap-2.5">
                  <Calculator className="w-4 h-4 text-[var(--accent)]" strokeWidth={1.5} />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-primary)" }}>
                    PLAN MY TRADE
                  </span>
                </div>
                <span
                  className="font-mono text-[9.5px] uppercase tracking-wider px-2.5 py-0.5 border"
                  style={{
                    borderColor: "rgba(0,0,0,0.1)",
                    color: "var(--text-tertiary)",
                    borderRadius: "var(--radius-pill)",
                    backgroundColor: "transparent",
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
                  {/* Account Size Segmented Control */}
                  <div 
                    className="grid grid-cols-4 p-1 rounded-[10px] relative border"
                    style={{ 
                      backgroundColor: "rgba(0,0,0,0.035)",
                      borderColor: "rgba(0,0,0,0.04)" 
                    }}
                  >
                    {[10000, 25000, 50000, 100000].map((val) => {
                      const isActive = balance === val;
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setBalance(val)}
                          className="py-1.5 text-[11px] font-mono tabular-nums text-center transition-all duration-200 cursor-pointer"
                          style={{
                            backgroundColor: isActive ? "#FFFFFF" : "transparent",
                            color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                            fontWeight: isActive ? 600 : 400,
                            borderRadius: "7px",
                            boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)" : "none",
                          }}
                        >
                          {currencySymbol}{val >= 1000 ? `${val / 1000}k` : val}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-sans text-xs" style={{ color: "var(--text-secondary)" }}>Risk Allocation</span>
                    <span className="font-mono tabular-nums text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                      {riskPercent.toFixed(1)}% ({currencySymbol}{riskAmount.toFixed(2)})
                    </span>
                  </div>
                  {/* Custom Styled Risk Slider */}
                  <div className="relative flex items-center py-1">
                    <input
                      type="range"
                      min="0.5"
                      max="2.5"
                      step="0.25"
                      value={riskPercent}
                      onChange={(e) => setRiskPercent(parseFloat(e.target.value))}
                      className="pmt-slider w-full cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${((riskPercent - 0.5) / 2.0) * 100}%, rgba(0,0,0,0.08) ${((riskPercent - 0.5) / 2.0) * 100}%, rgba(0,0,0,0.08) 100%)`,
                      }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-baseline pt-1">
                  <span className="font-sans text-xs" style={{ color: "var(--text-secondary)" }}>Stop Invalidation</span>
                  <span className="font-mono tabular-nums text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                    {stopPips} pips
                  </span>
                </div>
              </div>

              {/* Sizing Results Output Block (Payoff: distinct 2.5% accent tint, radius 12px, display-lg figure with cross-fade) */}
              <div
                className="p-5 border space-y-3"
                style={{
                  backgroundColor: "rgba(22, 33, 62, 0.025)",
                  borderColor: "rgba(22, 33, 62, 0.07)",
                  borderRadius: "12px",
                }}
              >
                <div className="flex items-baseline justify-between">
                  <span className="type-label uppercase" style={{ color: "var(--text-secondary)" }}>CALCULATED POSITION</span>
                  <div className="text-right">
                    <span 
                      key={calculatedLots}
                      className="inline-block font-mono text-3xl md:text-4xl font-bold tabular-nums animate-crossfade"
                      style={{ color: "var(--accent)" }}
                    >
                      {calculatedLots}
                    </span>
                    <span className="font-mono text-base md:text-lg font-normal ml-1.5" style={{ color: "var(--text-secondary)" }}>
                      lots
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t pt-2.5 text-xs" style={{ borderColor: "rgba(22, 33, 62, 0.08)" }}>
                  <span className="font-sans" style={{ color: "var(--text-secondary)" }}>Drawdown Impact</span>
                  <span className="font-mono tabular-nums font-semibold" style={{ color: "var(--market-up)" }}>
                    {maxDrawdownImpact}% buffer
                  </span>
                </div>
              </div>

              {/* Plan Lock Verification Bar with slow 2.8s breathing pulse (opacity only, no scale) */}
              <div className="flex items-center justify-between pt-1 text-[11px] font-mono" style={{ color: "var(--text-secondary)" }}>
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[var(--accent)]" strokeWidth={1.5} />
                  <span>Pre-commit snapshot required</span>
                </span>
                <span className="flex items-center gap-1.5 text-[10px] uppercase font-semibold" style={{ color: "var(--market-up)" }}>
                  <span 
                    className="w-2 h-2 rounded-full inline-block"
                    style={{ 
                      backgroundColor: "var(--market-up)",
                      animation: shouldReduce ? "none" : "validated-breathe 2.8s ease-in-out infinite",
                    }}
                  />
                  VALIDATED
                </span>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes hero-radial-drift {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(-3%, 2.5%);
          }
        }
        @keyframes crossfade {
          0% { opacity: 0.35; }
          100% { opacity: 1; }
        }
        .animate-crossfade {
          animation: crossfade 200ms ease-out;
        }
        @keyframes validated-breathe {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .pmt-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 6px;
          border-radius: 999px;
          outline: none;
        }
        .pmt-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 2px solid var(--accent);
          box-shadow: 0 1px 3px rgba(16,24,40,0.12), 0 3px 8px rgba(16,24,40,0.08);
          cursor: pointer;
          transition: box-shadow 150ms ease, transform 150ms ease;
        }
        .pmt-slider::-webkit-slider-thumb:hover {
          transform: scale(1.05);
        }
        .pmt-slider:focus::-webkit-slider-thumb,
        .pmt-slider:active::-webkit-slider-thumb {
          box-shadow: 0 0 0 4px rgba(22, 33, 62, 0.15), 0 1px 3px rgba(16,24,40,0.12);
          transform: scale(1.08);
        }
      `}} />
    </section>
  );
}
