"use client";

import { motion } from "framer-motion";
import { BookOpen, Calculator, Scan, LineChart, Newspaper, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  { value: "5", label: "Custom AI Tools" },
  { value: "60s", label: "Real-time Refresh" },
  { value: "24/7", label: "Active Monitoring" },
  { value: "0", label: "Generic AI Prompts" }
];

const tools = [
  {
    icon: BookOpen,
    name: "AI Trade Journal",
    description: "Uploads raw CSV executions and outputs natural language emotional profiles, identifying systemic leakage.",
    isFree: true
  },
  {
    icon: Calculator,
    name: "Risk Calculator",
    description: "Computes kelly-criterion fraction allocations relative to your current drawdown boundaries.",
    isFree: true
  },
  {
    icon: Scan,
    name: "AI Market Scanner",
    description: "Monitors order flow delta and volume profiles across 40 FX/Crypto pairs to isolate structural sweeps.",
    isFree: false
  },
  {
    icon: LineChart,
    name: "Strategy Backtester",
    description: "Simulates strategy rulesets against 10 years of historical tick data, outputting Monte Carlo risk profiles.",
    isFree: false
  },
  {
    icon: Newspaper,
    name: "Daily Intelligence Brief",
    description: "A pre-market systemic breakdown of institutional flows, macro events, and major consensus changes.",
    isFree: true
  }
];

export function AIToolsSection() {
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
                return (
                  <motion.div
                    key={idx}
                    custom={idx}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-20px" }}
                    variants={cardVariants}
                    className="bg-white border border-mkt-bd rounded-[14px] p-5 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all duration-300 flex items-start gap-4"
                  >
                    {/* Dark Icon Container */}
                    <div className="w-10 h-10 bg-neutral-950 text-white rounded-lg flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-grow space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-sans font-bold text-mkt-ink leading-tight">
                          {tool.name}
                        </h4>
                        <span className={cn(
                          "text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider",
                          tool.isFree
                            ? "text-mkt-grn bg-mkt-gbg border-mkt-gbd"
                            : "text-mkt-i3 bg-neutral-150 border-neutral-200"
                        )}>
                          {tool.isFree ? "Free" : "Premium"}
                        </span>
                      </div>
                      <p className="text-xs text-mkt-i3 leading-relaxed font-sans pr-4">
                        {tool.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
