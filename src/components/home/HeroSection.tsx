"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useRegion } from "@/components/layout/RegionalLayout";

export function HeroSection() {
  const { region, demonym } = useRegion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  const dashboardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      rotateY: -7,
      rotateX: 2.5,
      transformPerspective: 1100
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateY: -7,
      rotateX: 2.5,
      transformPerspective: 1100,
      transition: {
        duration: 0.6,
        delay: 0.3,
        ease: "easeOut" as const,
      },
    },
  };

  const regionPrefix = region === "uk" ? "" : `/${region}`;

  return (
    <section className="relative w-full min-h-[85vh] flex items-center overflow-hidden bg-white py-16 md:py-24 border-b border-mkt-bd z-20">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none">
        <div className="h-full w-full bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column (50%) */}
          <motion.div 
            className="space-y-6 text-left flex flex-col items-start"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Eyebrow Pill with blinking green dot */}
            <motion.div variants={itemVariants} className="flex items-center gap-2 px-3 py-1 border border-mkt-bd rounded-full">
              <span className="w-2 h-2 rounded-full bg-mkt-grn inline-block animate-pulse" />
              <span className="text-[11px] font-semibold tracking-wider text-mkt-i3 uppercase font-sans">
                TRADING EDUCATION + INTELLIGENCE
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              variants={itemVariants}
              className="text-[clamp(40px,5vw,72px)] font-sans font-extrabold text-mkt-ink leading-[1.05] tracking-tight"
              style={{ fontWeight: 800 }}
            >
              Trade the <span className="text-mkt-grn">Truth.</span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl font-sans text-mkt-i3 max-w-lg leading-relaxed mt-2"
            >
              Live market intelligence. AI-powered tools. Honest education. Built for {demonym} traders.
            </motion.p>

            {/* CTAs */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-4"
            >
              <Link 
                href={`${regionPrefix}/signup`} 
                className="bg-mkt-ink hover:bg-mkt-i2 text-white px-7 py-4 rounded-lg font-medium text-center transition-colors duration-200 text-sm md:text-base font-sans"
              >
                Start Free — No Card Required
              </Link>
              <Link 
                href={`${regionPrefix}/courses`} 
                className="text-mkt-ink hover:underline underline-offset-4 text-sm md:text-base font-medium text-center py-2 transition-all font-sans"
              >
                Explore the Platform &rarr;
              </Link>
            </motion.div>

            {/* Trust Signals */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row flex-wrap gap-x-6 gap-y-3 pt-6 text-sm text-mkt-i3 font-sans border-t border-mkt-bd w-full"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-mkt-grn" /> Phase 1 Free Forever
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-mkt-grn" /> FCA-Registered Brokers Only
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-mkt-grn" /> No Affiliate Hidden Rankings
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column (50%) */}
          <div className="relative w-full flex justify-center items-center select-none lg:h-[450px]">
            <motion.div
              className="w-full relative max-w-md lg:max-w-none transform-gpu"
              variants={dashboardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ 
                rotateY: -1, 
                rotateX: 0,
                transition: { duration: 0.6, ease: "easeOut" }
              }}
              style={{
                filter: "drop-shadow(0 25px 50px rgba(0, 0, 0, 0.15))"
              }}
            >
              {/* Dark Card Dashboard Mockup */}
              <div className="relative w-full bg-[#0D0D0D] border border-neutral-800 rounded-2xl p-6 overflow-hidden flex flex-col justify-between font-sans">
                
                {/* Topbar */}
                <div className="flex justify-between items-center pb-4 border-b border-neutral-850 mb-6">
                  {/* Traffic Lights */}
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                  </div>
                  {/* LIVE badge */}
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-mkt-grn animate-pulse" />
                    <span className="text-[10px] font-bold text-mkt-grn bg-mkt-gbg/10 border border-mkt-grn/30 px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                      LIVE
                    </span>
                  </div>
                </div>

                {/* Grid container */}
                <div className="space-y-6">
                  {/* Three Stat Tiles */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-[#141414] border border-neutral-800 rounded-lg p-3">
                      <p className="text-[10px] font-mono text-neutral-500 uppercase">GBP/USD</p>
                      <p className="text-xs font-mono font-bold text-white mt-1">1.2734</p>
                      <p className="text-[9px] font-mono text-mkt-grn mt-0.5">+0.12%</p>
                    </div>
                    <div className="bg-[#141414] border border-neutral-800 rounded-lg p-3">
                      <p className="text-[10px] font-mono text-neutral-500 uppercase">EUR/USD</p>
                      <p className="text-xs font-mono font-bold text-white mt-1">1.0845</p>
                      <p className="text-[9px] font-mono text-neutral-500 mt-0.5">0.00%</p>
                    </div>
                    <div className="bg-[#141414] border border-neutral-800 rounded-lg p-3">
                      <p className="text-[10px] font-mono text-neutral-500 uppercase">BTC/USD</p>
                      <p className="text-xs font-mono font-bold text-white mt-1">67,420</p>
                      <p className="text-[9px] font-mono text-mkt-grn mt-0.5">+1.45%</p>
                    </div>
                  </div>

                  {/* SVG Area Chart */}
                  <div className="relative h-28 bg-[#141414] border border-neutral-800 rounded-lg p-3 flex flex-col justify-between overflow-hidden">
                    <div className="flex justify-between items-center z-10">
                      <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest">GBPUSD 1H CHART</span>
                      <span className="text-[10px] font-mono text-white font-bold">1.2734</span>
                    </div>
                    
                    {/* SVG Chart paths */}
                    <div className="absolute inset-0 pt-6">
                      <svg className="w-full h-full" viewBox="0 0 300 80" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#16A34A" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#16A34A" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path 
                          d="M0,60 Q40,40 80,45 T160,30 T240,55 T300,20 L300,80 L0,80 Z" 
                          fill="url(#chartGrad)" 
                        />
                        <path 
                          d="M0,60 Q40,40 80,45 T160,30 T240,55 T300,20" 
                          fill="none" 
                          stroke="#16A34A" 
                          strokeWidth="1.5" 
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Four Pair Tiles 2x2 grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex justify-between items-center bg-[#141414] border border-neutral-800 rounded-lg p-2.5">
                      <span className="text-[10px] font-mono text-neutral-450">USDJPY</span>
                      <span className="text-[10px] font-mono font-bold text-white">156.42</span>
                    </div>
                    <div className="flex justify-between items-center bg-[#141414] border border-neutral-800 rounded-lg p-2.5">
                      <span className="text-[10px] font-mono text-neutral-450">GBPJPY</span>
                      <span className="text-[10px] font-mono font-bold text-white">199.12</span>
                    </div>
                    <div className="flex justify-between items-center bg-[#141414] border border-neutral-800 rounded-lg p-2.5">
                      <span className="text-[10px] font-mono text-neutral-450">AUDUSD</span>
                      <span className="text-[10px] font-mono font-bold text-white">0.6654</span>
                    </div>
                    <div className="flex justify-between items-center bg-[#141414] border border-neutral-800 rounded-lg p-2.5">
                      <span className="text-[10px] font-mono text-neutral-450">EURGBP</span>
                      <span className="text-[10px] font-mono font-bold text-white">0.8512</span>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
