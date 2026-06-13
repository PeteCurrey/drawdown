"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useRegion } from "@/components/layout/RegionalLayout";

export function HeroSection() {
  const { region, demonym } = useRegion();
  const regionPrefix = region === "uk" ? "" : `/${region}`;

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
      y: 40,
      rotateX: 18,
      rotateY: 0,
      rotateZ: -18,
      transformPerspective: 1400
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 18,
      rotateY: 0,
      rotateZ: -18,
      transformPerspective: 1400,
      transition: {
        duration: 0.8,
        delay: 0.3,
        ease: "easeOut" as const,
      },
    },
  };

  const backgroundCandles = [
    { x: 40, open: 220, close: 200, high: 230, low: 190 },
    { x: 80, open: 200, close: 210, high: 215, low: 195 },
    { x: 120, open: 210, close: 190, high: 220, low: 180 },
    { x: 160, open: 190, close: 170, high: 200, low: 160 },
    { x: 200, open: 170, close: 180, high: 185, low: 165 },
    { x: 240, open: 180, close: 150, high: 190, low: 140 },
    { x: 280, open: 150, close: 130, high: 160, low: 120 },
    { x: 320, open: 130, close: 140, high: 145, low: 125 },
    { x: 360, open: 140, close: 110, high: 150, low: 100 },
    { x: 400, open: 110, close: 90, high: 120, low: 80 },
    { x: 440, open: 90, close: 100, high: 105, low: 85 },
    { x: 480, open: 100, close: 80, high: 110, low: 70 },
    { x: 520, open: 80, close: 70, high: 90, low: 60 },
    { x: 560, open: 70, close: 95, high: 105, low: 65 },
    { x: 600, open: 95, close: 85, high: 100, low: 80 },
    { x: 640, open: 85, close: 110, high: 120, low: 80 },
    { x: 680, open: 110, close: 100, high: 115, low: 95 },
    { x: 720, open: 100, close: 125, high: 135, low: 95 },
    { x: 760, open: 125, close: 115, high: 130, low: 110 },
    { x: 800, open: 115, close: 140, high: 150, low: 110 },
    { x: 840, open: 140, close: 130, high: 145, low: 125 },
    { x: 880, open: 130, close: 160, high: 170, low: 125 },
    { x: 920, open: 160, close: 150, high: 165, low: 145 },
    { x: 960, open: 150, close: 180, high: 190, low: 140 },
    { x: 1000, open: 180, close: 170, high: 185, low: 165 },
    { x: 1040, open: 170, close: 200, high: 210, low: 160 },
    { x: 1080, open: 200, close: 190, high: 205, low: 185 },
    { x: 1120, open: 190, close: 220, high: 230, low: 180 },
    { x: 1160, open: 220, close: 210, high: 225, low: 200 }
  ];

  // Moving average line computations for the background chart effect
  const maPeriod = 5;
  const longMaPeriod = 12;

  const maPathPoints = backgroundCandles.map((c, idx) => {
    const start = Math.max(0, idx - maPeriod + 1);
    const subset = backgroundCandles.slice(start, idx + 1);
    const sum = subset.reduce((acc, curr) => acc + (curr.open + curr.close) / 2, 0);
    const avg = sum / subset.length;
    return `${c.x},${avg}`;
  });

  const longMaPathPoints = backgroundCandles.map((c, idx) => {
    const start = Math.max(0, idx - longMaPeriod + 1);
    const subset = backgroundCandles.slice(start, idx + 1);
    const sum = subset.reduce((acc, curr) => acc + (curr.open + curr.close) / 2, 0);
    const avg = sum / subset.length;
    return `${c.x},${avg}`;
  });

  const maPathD = `M ${maPathPoints.join(" L ")}`;
  const longMaPathD = `M ${longMaPathPoints.join(" L ")}`;

  return (
    <section className="relative w-full min-h-[85vh] flex flex-col justify-center overflow-hidden bg-white pt-24 pb-36 md:pt-32 md:pb-52 border-b border-mkt-bd z-20">
      {/* Background candle chart pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.035] pointer-events-none select-none flex items-center justify-center overflow-hidden">
        <svg className="w-full h-[70%] min-h-[350px]" viewBox="0 0 1200 300" fill="none" preserveAspectRatio="none">
          {/* Moving Averages */}
          <path 
            d={maPathD} 
            fill="none" 
            stroke="#9ca3af" 
            strokeWidth="1.5" 
            strokeDasharray="4 4" 
          />
          <path 
            d={longMaPathD} 
            fill="none" 
            stroke="#6b7280" 
            strokeWidth="1.5" 
          />

          {/* Candlesticks */}
          {backgroundCandles.map((c, i) => {
            const isBullish = c.close < c.open;
            const color = isBullish ? "#22c55e" : "#ef4444";
            const bodyY = Math.min(c.open, c.close);
            const bodyHeight = Math.max(Math.abs(c.open - c.close), 2);
            return (
              <g key={i}>
                {/* Wick */}
                <line 
                  x1={c.x} 
                  y1={c.high} 
                  x2={c.x} 
                  y2={c.low} 
                  stroke={color} 
                  strokeWidth="1.5" 
                />
                {/* Body */}
                <rect 
                  x={c.x - 5} 
                  y={bodyY} 
                  width="10" 
                  height={bodyHeight} 
                  fill={color} 
                  rx="1"
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Fade masks for visual blending */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent pointer-events-none z-0" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent pointer-events-none z-0" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent pointer-events-none z-0" />

      <div className="w-full max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-start pt-8 md:pt-12">
        
        {/* Top Text Content Block */}
        <motion.div 
          className="space-y-6 text-left flex flex-col items-start max-w-3xl"
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
            className="text-[clamp(44px,6vw,84px)] font-sans font-extrabold text-mkt-ink leading-[1.05] tracking-tight"
            style={{ fontWeight: 800 }}
          >
            Trade the <span className="text-mkt-grn">Truth.</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl font-sans text-mkt-i3 max-w-2xl leading-relaxed mt-2"
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
              className="bg-mkt-ink hover:bg-mkt-i2 text-white px-7 py-4 rounded-lg font-medium text-center transition-colors duration-200 text-sm md:text-base font-sans shadow-lg shadow-black/10"
            >
              Start Free — No Card Required
            </Link>
            <Link 
              href={`${regionPrefix}/courses`} 
              className="text-mkt-ink hover:underline underline-offset-4 text-sm md:text-base font-semibold text-center py-2 transition-all font-sans flex items-center gap-1.5"
            >
              Explore the Platform &rarr;
            </Link>
          </motion.div>

          {/* Trust Signals */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row flex-wrap gap-x-6 gap-y-3 pt-6 text-sm text-mkt-i3 font-sans border-t border-mkt-bd w-full max-w-2xl"
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

        {/* Centered Tilted Mockup Container */}
        <div className="w-full flex justify-center items-center select-none mt-16 md:mt-24 relative hero-3d-card-container">
          <motion.div
            className="w-full relative max-w-5xl transform-gpu"
            variants={dashboardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ 
              rotateX: 10, 
              rotateY: 0, 
              rotateZ: -10,
              transition: { duration: 0.6, ease: "easeOut" }
            }}
            style={{
              filter: "drop-shadow(0 30px 60px rgba(0, 0, 0, 0.12))"
            }}
          >
            {/* Light Card Dashboard Mockup */}
            <div className="relative w-full bg-white border border-[#E2E2E2] rounded-2xl p-6 overflow-hidden flex flex-col justify-between font-sans shadow-sm">
              
              {/* Topbar */}
              <div className="flex justify-between items-center pb-4 border-b border-[#EBEBEB] mb-6">
                {/* Traffic Lights */}
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                </div>
                {/* LIVE badge */}
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-mkt-grn animate-pulse" />
                  <span className="text-[10px] font-bold text-mkt-grn bg-green-50 border border-green-200 px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                    LIVE
                  </span>
                </div>
              </div>

              {/* Grid container */}
              <div className="space-y-4">
                {/* Three Stat Tiles */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#F5F5F5] border border-[#E8E8E8] rounded-lg p-3">
                    <p className="text-[10px] font-mono text-[#888888] uppercase">GBP/USD</p>
                    <p className="text-xs font-mono font-bold text-[#0A0A0A] mt-1">1.2734</p>
                    <p className="text-[9px] font-mono text-mkt-grn mt-0.5">+0.12%</p>
                  </div>
                  <div className="bg-[#F5F5F5] border border-[#E8E8E8] rounded-lg p-3">
                    <p className="text-[10px] font-mono text-[#888888] uppercase">EUR/USD</p>
                    <p className="text-xs font-mono font-bold text-[#0A0A0A] mt-1">1.0845</p>
                    <p className="text-[9px] font-mono text-[#888888] mt-0.5">0.00%</p>
                  </div>
                  <div className="bg-[#F5F5F5] border border-[#E8E8E8] rounded-lg p-3">
                    <p className="text-[10px] font-mono text-[#888888] uppercase">BTC/USD</p>
                    <p className="text-xs font-mono font-bold text-[#0A0A0A] mt-1">67,420</p>
                    <p className="text-[9px] font-mono text-mkt-grn mt-0.5">+1.45%</p>
                  </div>
                </div>

                {/* SVG Area Chart */}
                <div className="relative h-32 bg-[#F5F5F5] border border-[#E8E8E8] rounded-lg p-3 flex flex-col justify-between overflow-hidden">
                  <div className="flex justify-between items-center z-10">
                    <span className="text-[9px] font-mono text-[#888888] uppercase tracking-widest">GBPUSD 1H CHART</span>
                    <span className="text-[10px] font-mono text-[#0A0A0A] font-bold">1.2734</span>
                  </div>
                  
                  {/* SVG Chart paths */}
                  <div className="absolute inset-0 pt-6">
                    <svg className="w-full h-full" viewBox="0 0 300 80" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGradLight" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#16A34A" stopOpacity="0.18" />
                          <stop offset="100%" stopColor="#16A34A" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path 
                        d="M0,60 Q40,40 80,45 T160,30 T240,55 T300,20 L300,80 L0,80 Z" 
                        fill="url(#chartGradLight)" 
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
                  <div className="flex justify-between items-center bg-[#F5F5F5] border border-[#E8E8E8] rounded-lg p-2.5">
                    <span className="text-[10px] font-mono text-[#888888]">USDJPY</span>
                    <span className="text-[10px] font-mono font-bold text-[#0A0A0A]">156.42</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#F5F5F5] border border-[#E8E8E8] rounded-lg p-2.5">
                    <span className="text-[10px] font-mono text-[#888888]">GBPJPY</span>
                    <span className="text-[10px] font-mono font-bold text-[#0A0A0A]">199.12</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#F5F5F5] border border-[#E8E8E8] rounded-lg p-2.5">
                    <span className="text-[10px] font-mono text-[#888888]">AUDUSD</span>
                    <span className="text-[10px] font-mono font-bold text-[#0A0A0A]">0.6654</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#F5F5F5] border border-[#E8E8E8] rounded-lg p-2.5">
                    <span className="text-[10px] font-mono text-[#888888]">EURGBP</span>
                    <span className="text-[10px] font-mono font-bold text-[#0A0A0A]">0.8512</span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
