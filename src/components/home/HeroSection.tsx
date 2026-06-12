"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  const regionPrefix = region === "uk" ? "" : `/${region}`;

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-white pt-24 pb-16 md:pt-32 md:pb-24 border-b border-[#E8E8E8] z-20">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <div className="h-full w-full bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
        
        {/* Left-aligned Text Content block */}
        <motion.div 
          className="w-full max-w-4xl space-y-6 text-left flex flex-col items-start mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Tagline */}
          <motion.div variants={itemVariants}>
            <span className="text-xs font-semibold tracking-widest text-neutral-450 border border-neutral-200 rounded-full px-3.5 py-1 inline-block uppercase font-sans">
              // TRADING EDUCATION + INTELLIGENCE
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            variants={itemVariants}
            className="text-[clamp(44px,6vw,84px)] font-display font-bold text-[#0A0A0A] leading-[1.05] tracking-tight max-w-3xl"
          >
            Trade the Truth.
          </motion.h1>

          {/* Sub-headline */}
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl font-sans text-neutral-500 max-w-2xl leading-relaxed mt-2"
          >
            Live market intelligence. AI-powered tools. Honest education. Built for {demonym} traders.
          </motion.p>

          {/* CTAs */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 w-full sm:w-auto pt-4"
          >
            <Link 
              href={`${regionPrefix}/signup`} 
              className="bg-black hover:bg-neutral-800 text-white px-8 py-4 rounded-lg font-medium text-center transition-all duration-200 text-sm md:text-base font-sans shadow-[0_20px_40px_rgba(0,0,0,0.12)] hover:shadow-[0_10px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5"
            >
              Start Free — No Card Required
            </Link>
            <Link 
              href={`${regionPrefix}/courses`} 
              className="text-black hover:underline underline-offset-4 text-sm md:text-base font-medium text-center py-2 transition-all font-sans"
            >
              Explore the Platform &rarr;
            </Link>
          </motion.div>

          {/* Trust Signals */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row flex-wrap gap-x-6 gap-y-2 pt-6 text-sm text-neutral-400 font-sans border-t border-neutral-100 w-full"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-500 font-bold">&bull;</span> Phase 1 Free Forever
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-500 font-bold">&bull;</span> FCA-Registered Brokers Only
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-500 font-bold">&bull;</span> No Affiliate Hidden Rankings
            </div>
          </motion.div>
        </motion.div>

        {/* 3D Slanted Preview Area (Centered, stacked below the copy) */}
        <motion.div 
          className="w-full max-w-4xl flex justify-center items-center py-4 hero-3d-card-container"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          {/* Card Wrapper with hero-3d-card class */}
          <div className="w-full relative hero-3d-card aspect-[16/10] rounded-2xl border border-neutral-200 bg-neutral-950 flex flex-col items-center justify-center p-8 overflow-hidden select-none">
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 opacity-40" style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "24px 24px"
            }} />
            
            {/* Subtle Mock Chart Line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 450">
              <path d="M 0,320 Q 180,180 320,250 T 600,100" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
              <path d="M 0,320 Q 180,180 320,250 T 600,100" fill="none" stroke="#00C2FF" strokeWidth="2" strokeDasharray="6 6" opacity="0.1" />
            </svg>

            {/* Wordmark and Preview info */}
            <div className="relative z-10 text-center space-y-3">
              <h3 className="text-4xl md:text-5xl font-display font-bold text-white tracking-widest">
                Drawdown.
              </h3>
              <p className="text-[11px] font-mono tracking-[0.3em] text-neutral-500 uppercase">
                INTELLIGENCE PORTAL PREVIEW
              </p>
            </div>

            {/* Mini status indicator */}
            <div className="absolute bottom-6 left-8 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest">LIVE DATA CONNECTED</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
