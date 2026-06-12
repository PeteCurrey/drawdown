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

  const rightColumnVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      rotateY: -8,
      rotateX: 3,
      transformPerspective: 1000
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateY: -8,
      rotateX: 3,
      transformPerspective: 1000,
      transition: {
        duration: 0.8,
        delay: 0.3,
        ease: "easeOut" as const,
      },
    },
  };

  const regionPrefix = region === "uk" ? "" : `/${region}`;

  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-white py-16 md:py-24 border-b border-[#E8E8E8]">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <div className="h-full w-full bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column (55% / 7 cols) */}
          <motion.div 
            className="lg:col-span-7 space-y-6 text-left flex flex-col items-start"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Tagline */}
            <motion.div variants={itemVariants}>
              <span className="text-xs font-semibold tracking-widest text-neutral-400 border border-neutral-200 rounded-full px-3 py-1 inline-block uppercase font-sans">
                // TRADING EDUCATION + INTELLIGENCE
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              variants={itemVariants}
              className="text-[clamp(48px,5.5vw,80px)] font-display font-bold text-[#0A0A0A] leading-[1.05] tracking-tight"
            >
              Trade the Truth.
            </motion.h1>

            {/* Sub-headline */}
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl font-sans text-[#6B6B6B] max-w-lg leading-relaxed mt-2"
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
                className="bg-black hover:bg-neutral-800 text-white px-7 py-4 rounded-lg font-medium text-center transition-colors duration-200 text-sm md:text-base font-sans"
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
              className="flex flex-col sm:flex-row flex-wrap gap-x-6 gap-y-2 pt-6 text-sm text-neutral-500 font-sans border-t border-neutral-100 w-full"
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

          {/* Right Column (45% / 5 cols) */}
          <div className="lg:col-span-5 relative w-full flex justify-center items-center select-none mt-8 lg:mt-0">
            <motion.div
              className="w-full relative max-w-md lg:max-w-none"
              variants={rightColumnVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ 
                rotateY: 0, 
                rotateX: 0, 
                scale: 1.02,
                transition: { duration: 0.6, ease: "easeOut" }
              }}
            >
              {/* Dark Card Placeholder */}
              <div className="relative w-full aspect-[4/3] rounded-2xl border border-neutral-200 shadow-2xl overflow-hidden bg-neutral-950 flex flex-col items-center justify-center p-8">
                {/* Subtle Grid Background */}
                <div className="absolute inset-0 opacity-40" style={{
                  backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                  backgroundSize: "24px 24px"
                }} />
                
                {/* Subtle Mock Chart Line */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 300">
                  <path d="M 0,220 Q 120,130 220,180 T 400,60" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="2" />
                  <path d="M 0,220 Q 120,130 220,180 T 400,60" fill="none" stroke="#00C2FF" strokeWidth="2" strokeDasharray="4 4" opacity="0.1" />
                </svg>

                {/* Wordmark and Preview info */}
                <div className="relative z-10 text-center space-y-2">
                  <h3 className="text-3xl md:text-4xl font-display font-bold text-white tracking-wider">
                    Drawdown.
                  </h3>
                  <p className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
                    INTELLIGENCE PORTAL PREVIEW
                  </p>
                </div>

                {/* Mini decorative status indicators */}
                <div className="absolute bottom-4 left-6 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] font-mono text-neutral-600 uppercase tracking-widest">LIVE FEED CONNECTED</span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
