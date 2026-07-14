"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Calculator, Scan, LineChart, Newspaper, Cpu, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const stats = [
  { value: "6", label: "Custom AI Tools" },
  { value: "60s", label: "Real-time Refresh" },
  { value: "24/7", label: "Active Monitoring" },
  { value: "0", label: "Generic AI Prompts" }
];

const tools = [
  {
    icon: BookOpen,
    name: "AI Trade Journal",
    slug: "ai-trade-journal",
    description: "Uploads raw CSV executions and outputs natural language emotional profiles, identifying systemic leakage.",
    isFree: true,
    // Faded Indigo
    baseBg: "rgba(99, 102, 241, 0.015)",
    hoverBg: "rgba(99, 102, 241, 0.045)",
    borderColor: "rgba(99, 102, 241, 0.25)",
    iconColor: "rgb(99, 102, 241)",
    iconBg: "rgba(99, 102, 241, 0.08)",
    svgPath: (
      <svg className="absolute bottom-[-10px] right-[-10px] w-24 h-24 text-indigo-500 transition-opacity duration-500 pointer-events-none" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
        <rect x="20" y="15" width="60" height="70" rx="4" />
        <line x1="30" y1="30" x2="70" y2="30" />
        <line x1="30" y1="45" x2="70" y2="45" />
        <line x1="30" y1="60" x2="55" y2="60" />
      </svg>
    )
  },
  {
    icon: Calculator,
    name: "Risk Calculator",
    slug: "risk-calculator",
    description: "Computes kelly-criterion fraction allocations relative to your current drawdown boundaries.",
    isFree: true,
    // Faded Emerald
    baseBg: "rgba(16, 185, 129, 0.015)",
    hoverBg: "rgba(16, 185, 129, 0.045)",
    borderColor: "rgba(16, 185, 129, 0.25)",
    iconColor: "rgb(16, 185, 129)",
    iconBg: "rgba(16, 185, 129, 0.08)",
    svgPath: (
      <svg className="absolute bottom-[-10px] right-[-10px] w-24 h-24 text-emerald-500 transition-opacity duration-500 pointer-events-none" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
        <rect x="25" y="25" width="50" height="50" rx="6" />
        <circle cx="40" cy="40" r="4" />
        <circle cx="60" cy="40" r="4" />
        <line x1="35" y1="55" x2="65" y2="55" />
        <line x1="35" y1="62" x2="65" y2="62" />
      </svg>
    )
  },
  {
    icon: Scan,
    name: "AI Market Scanner",
    slug: "ai-market-scanner",
    description: "Monitors order flow delta and volume profiles across 40 FX/Crypto pairs to isolate structural sweeps.",
    isFree: false,
    // Faded Cyan
    baseBg: "rgba(6, 182, 212, 0.015)",
    hoverBg: "rgba(6, 182, 212, 0.045)",
    borderColor: "rgba(6, 182, 212, 0.25)",
    iconColor: "rgb(6, 182, 212)",
    iconBg: "rgba(6, 182, 212, 0.08)",
    svgPath: (
      <svg className="absolute bottom-[-10px] right-[-10px] w-24 h-24 text-cyan-500 transition-opacity duration-500 pointer-events-none" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
        <circle cx="50" cy="50" r="30" strokeDasharray="3 3" />
        <circle cx="50" cy="50" r="15" />
        <line x1="50" y1="10" x2="50" y2="90" />
        <line x1="10" y1="50" x2="90" y2="50" />
      </svg>
    )
  },
  {
    icon: LineChart,
    name: "Strategy Backtester",
    slug: "strategy-backtester",
    description: "Simulates strategy rulesets against 10 years of historical tick data, outputting Monte Carlo risk profiles.",
    isFree: false,
    // Faded Rose
    baseBg: "rgba(244, 63, 94, 0.015)",
    hoverBg: "rgba(244, 63, 94, 0.045)",
    borderColor: "rgba(244, 63, 94, 0.25)",
    iconColor: "rgb(244, 63, 94)",
    iconBg: "rgba(244, 63, 94, 0.08)",
    svgPath: (
      <svg className="absolute bottom-[-10px] right-[-10px] w-24 h-24 text-rose-500 transition-opacity duration-500 pointer-events-none" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
        <path d="M20,70 L35,50 L50,55 L65,30 L80,35" />
        <path d="M20,70 L80,70" />
        <circle cx="35" cy="50" r="2.5" fill="currentColor" />
        <circle cx="65" cy="30" r="2.5" fill="currentColor" />
      </svg>
    )
  },
  {
    icon: Newspaper,
    name: "Daily Intelligence Brief",
    slug: "intelligence-hub",
    description: "A pre-market systemic breakdown of institutional flows, macro events, and major consensus changes.",
    isFree: true,
    // Faded Amber
    baseBg: "rgba(245, 158, 11, 0.015)",
    hoverBg: "rgba(245, 158, 11, 0.045)",
    borderColor: "rgba(245, 158, 11, 0.25)",
    iconColor: "rgb(245, 158, 11)",
    iconBg: "rgba(245, 158, 11, 0.08)",
    svgPath: (
      <svg className="absolute bottom-[-10px] right-[-10px] w-24 h-24 text-amber-500 transition-opacity duration-500 pointer-events-none" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
        <rect x="20" y="20" width="60" height="60" rx="2" />
        <line x1="28" y1="32" x2="72" y2="32" strokeWidth="1" />
        <line x1="28" y1="45" x2="45" y2="45" />
        <line x1="28" y1="55" x2="45" y2="55" />
        <rect x="52" y="42" width="20" height="25" />
      </svg>
    )
  },
  {
    icon: Terminal,
    name: "Algo Strategy Builder",
    slug: "algo-strategy-builder",
    description: "Convert your trading rules into Pine Script or Python scripts automatically. Code and validate your edge without coding.",
    isFree: false,
    baseBg: "rgba(124, 58, 237, 0.015)",
    hoverBg: "rgba(124, 58, 237, 0.045)",
    borderColor: "rgba(124, 58, 237, 0.25)",
    iconColor: "rgb(124, 58, 237)",
    iconBg: "rgba(124, 58, 237, 0.08)",
    svgPath: (
      <svg className="absolute bottom-[-10px] right-[-10px] w-24 h-24 text-violet-500 transition-opacity duration-500 pointer-events-none" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
        <rect x="20" y="25" width="60" height="50" rx="4" />
        <path d="M30,45 L40,50 L30,55" />
        <line x1="45" y1="60" x2="55" y2="60" />
      </svg>
    )
  }
];

export function AIToolsSection() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const cardVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.5,
        ease: "easeOut" as const
      }
    })
  };

  return (
    <section className="w-full bg-white border-b border-mkt-bd py-24 select-none relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Heading and Stats */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="text-[11px] font-sans font-bold text-mkt-i4 uppercase tracking-widest block">
                // SYSTEM CORE
              </span>
              <h2 className="text-3xl md:text-5xl font-sans font-extrabold text-mkt-ink tracking-tight leading-tight">
                Built by Traders. <br />
                Enhanced by AI.
              </h2>
              <p className="text-base text-mkt-i3 leading-relaxed font-sans">
                Drawdown fuses raw algorithmic edge with next-generation machine intelligence to remove emotional bias and standardise risk models.
              </p>
            </div>

            {/* 2x2 Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, idx) => (
                <div 
                  key={idx} 
                  className="bg-[#F7F7F7] border border-mkt-bd rounded-[14px] p-5 hover:border-mkt-bds transition-colors duration-200"
                >
                  <span className="text-3xl font-sans font-extrabold text-mkt-ink tracking-tight block">
                    {stat.value}
                  </span>
                  <span className="text-[10px] font-sans font-medium text-mkt-i4 uppercase tracking-wider block mt-1">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Stacked Tool Cards */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-sm font-sans font-bold text-mkt-i2 uppercase tracking-wider mb-2 flex items-center gap-2 pl-1">
              <Cpu className="w-4 h-4 text-mkt-i4" /> Proprietary Intelligence Suite
            </h3>
            
            <div className="space-y-3">
              {tools.map((tool, idx) => {
                const Icon = tool.icon;
                const isHovered = hoveredIdx === idx;
                
                return (
                  <Link href={`/tools/${tool.slug}`} key={idx} className="block">
                    <motion.div
                      custom={idx}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-20px" }}
                      variants={cardVariants}
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onMouseLeave={() => setHoveredIdx(null)}
                      className="relative border rounded-[14px] p-5 flex items-start gap-4 cursor-pointer overflow-hidden transition-all duration-300"
                      style={{
                        backgroundColor: isHovered ? tool.hoverBg : tool.baseBg,
                        borderColor: isHovered ? tool.borderColor : "rgba(229, 229, 229, 0.7)",
                        transform: isHovered ? "translateY(-2px)" : "translateY(0px)",
                        boxShadow: isHovered ? "0 8px 32px rgba(0, 0, 0, 0.04)" : "none"
                      }}
                    >
                      {/* Subtle bottom-right SVG decorative illustration */}
                      <div 
                        className="absolute inset-0 z-0 overflow-hidden pointer-events-none transition-opacity duration-300"
                        style={{ opacity: isHovered ? 0.07 : 0.015 }}
                      >
                        {tool.svgPath}
                      </div>

                      {/* Animated Icon Container */}
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 z-10 transition-all duration-350"
                        style={{
                          backgroundColor: isHovered ? tool.iconColor : tool.iconBg,
                          color: isHovered ? "#FFFFFF" : tool.iconColor
                        }}
                      >
                        <Icon className="w-5 h-5 transition-transform duration-300" style={{ transform: isHovered ? "scale(1.08)" : "scale(1)" }} />
                      </div>

                      {/* Content */}
                      <div className="flex-grow space-y-1 z-10">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-sans font-bold text-mkt-ink leading-tight">
                            {tool.name}
                          </h4>
                          <span className={cn(
                            "text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider transition-colors duration-300",
                            tool.isFree
                              ? "text-mkt-grn bg-mkt-gbg border-mkt-gbd"
                              : "text-mkt-i3 bg-neutral-100 border-neutral-200"
                          )}>
                            {tool.isFree ? "Free" : "Premium"}
                          </span>
                        </div>
                        <p className="text-xs text-mkt-i3 leading-relaxed font-sans pr-4">
                          {tool.description}
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
