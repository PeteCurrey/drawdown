"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";
import { phases } from "@/data/courses";
import { cn } from "@/lib/utils";
import { useRegion } from "@/components/layout/RegionalLayout";
import { motion } from "framer-motion";

const phaseThemeStyles = [
  {
    // Phase 1: Ground Zero - Slate
    baseBg: "rgba(71, 85, 105, 0.015)",
    hoverBg: "rgba(71, 85, 105, 0.045)",
    borderColor: "rgba(71, 85, 105, 0.22)",
    textColor: "rgb(71, 85, 105)",
    // Trading floor / discipline — person at desk with screens
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop",
    svgPath: (
      <svg className="absolute bottom-[-10px] right-[-10px] w-24 h-24 text-slate-500 transition-opacity duration-500 pointer-events-none" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
        <path d="M50,15 L20,30 L20,55 C20,72 35,83 50,88 C65,83 80,72 80,55 L80,30 L50,15 Z" />
        <path d="M50,25 L50,78" strokeDasharray="3 3" />
      </svg>
    )
  },
  {
    // Phase 2: Chart Reader - Emerald
    baseBg: "rgba(16, 185, 129, 0.015)",
    hoverBg: "rgba(16, 185, 129, 0.045)",
    borderColor: "rgba(16, 185, 129, 0.22)",
    textColor: "rgb(16, 185, 129)",
    // Candlestick / price chart on monitor
    imageUrl: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?q=80&w=800&auto=format&fit=crop",
    svgPath: (
      <svg className="absolute bottom-[-10px] right-[-10px] w-24 h-24 text-emerald-500 transition-opacity duration-500 pointer-events-none" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
        <rect x="25" y="35" width="12" height="30" />
        <line x1="31" y1="20" x2="31" y2="80" />
        <rect x="50" y="25" width="12" height="40" />
        <line x1="56" y1="15" x2="56" y2="85" />
        <rect x="75" y="45" width="12" height="20" />
        <line x1="81" y1="30" x2="81" y2="75" />
      </svg>
    )
  },
  {
    // Phase 3: Strategist - Indigo
    baseBg: "rgba(99, 102, 241, 0.015)",
    hoverBg: "rgba(99, 102, 241, 0.045)",
    borderColor: "rgba(99, 102, 241, 0.22)",
    textColor: "rgb(99, 102, 241)",
    // Strategy chess board / analytical thinking
    imageUrl: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=800&auto=format&fit=crop",
    svgPath: (
      <svg className="absolute bottom-[-10px] right-[-10px] w-24 h-24 text-indigo-500 transition-opacity duration-500 pointer-events-none" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
        <circle cx="50" cy="30" r="8" />
        <circle cx="30" cy="65" r="8" />
        <circle cx="70" cy="65" r="8" />
        <line x1="45" y1="37" x2="35" y2="58" />
        <line x1="55" y1="37" x2="65" y2="58" />
        <line x1="38" y1="65" x2="62" y2="65" />
      </svg>
    )
  },
  {
    // Phase 4: Risk Manager - Rose
    baseBg: "rgba(244, 63, 94, 0.015)",
    hoverBg: "rgba(244, 63, 94, 0.045)",
    borderColor: "rgba(244, 63, 94, 0.22)",
    textColor: "rgb(244, 63, 94)",
    // Risk / balance — financial dashboard with red/green indicators
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
    svgPath: (
      <svg className="absolute bottom-[-10px] right-[-10px] w-24 h-24 text-rose-500 transition-opacity duration-500 pointer-events-none" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
        <rect x="30" y="45" width="40" height="35" rx="3" />
        <path d="M40,45 L40,30 C40,23 60,23 60,30 L60,45" />
        <circle cx="50" cy="60" r="3" fill="currentColor" />
      </svg>
    )
  },
  {
    // Phase 5: Mind Over Market - Purple
    baseBg: "rgba(217, 70, 239, 0.015)",
    hoverBg: "rgba(217, 70, 239, 0.045)",
    borderColor: "rgba(217, 70, 239, 0.22)",
    textColor: "rgb(217, 70, 239)",
    // Psychology / mindset — meditation, focus, calm
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop",
    svgPath: (
      <svg className="absolute bottom-[-10px] right-[-10px] w-24 h-24 text-fuchsia-500 transition-opacity duration-500 pointer-events-none" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
        <circle cx="50" cy="50" r="35" strokeDasharray="2 2" />
        <path d="M50,15 C60,25 70,40 50,55 C30,40 40,25 50,15 Z" fill="none" />
        <path d="M50,55 C40,65 30,80 50,85 C70,80 60,65 50,55 Z" fill="none" />
        <circle cx="50" cy="50" r="4" fill="currentColor" />
      </svg>
    )
  },
  {
    // Phase 6: The Edge - Cyan
    baseBg: "rgba(6, 182, 212, 0.015)",
    hoverBg: "rgba(6, 182, 212, 0.045)",
    borderColor: "rgba(6, 182, 212, 0.22)",
    textColor: "rgb(6, 182, 212)",
    // AI / technology — neural network or AI data streams
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop",
    svgPath: (
      <svg className="absolute bottom-[-10px] right-[-10px] w-24 h-24 text-cyan-500 transition-opacity duration-500 pointer-events-none" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
        <path d="M25,25 L45,25 L45,45 L25,45 Z" />
        <path d="M55,55 L75,55 L75,75 L55,75 Z" />
        <path d="M45,35 L55,65" strokeDasharray="3 3" />
      </svg>
    )
  }
];

export function CurriculumSection() {
  const { region } = useRegion();
  const regionPrefix = region === "uk" ? "" : `/${region}`;
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
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
        
        {/* Section Heading */}
        <div className="mb-16 text-center">
          <span className="text-[11px] font-sans font-bold text-mkt-i4 uppercase tracking-widest block mb-4">
            // EDUCATIONAL PATH
          </span>
          <h2 className="text-3xl md:text-5xl font-sans font-extrabold text-mkt-ink tracking-tight mb-4">
            The Curriculum
          </h2>
          <p className="text-base text-mkt-i3 max-w-xl mx-auto font-sans">
            A phase-based learning progression designed to take you from raw market mechanics to high-frequency AI integrations.
          </p>
        </div>

        {/* 3x2 Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {phases.map((phase, idx) => {
            const isFree = phase.tier === "Free";
            const theme = phaseThemeStyles[idx] || phaseThemeStyles[0];
            const isHovered = hoveredIdx === idx;
            
            return (
              <motion.div
                key={phase.id}
                custom={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-20px" }}
                variants={cardVariants}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="relative border rounded-[14px] p-6 flex flex-col justify-between cursor-pointer overflow-hidden transition-all duration-300"
                style={{
                  backgroundColor: isHovered ? theme.hoverBg : theme.baseBg,
                  borderColor: isHovered ? theme.borderColor : "rgba(229, 229, 229, 0.7)",
                  transform: isHovered ? "translateY(-2px)" : "translateY(0px)",
                  boxShadow: isHovered ? "0 8px 32px rgba(0, 0, 0, 0.06)" : "none"
                }}
              >
                {/* Background image — gentle reveal on hover */}
                <div
                  className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-[14px]"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out"
                    style={{
                      backgroundImage: `url(${theme.imageUrl})`,
                      opacity: isHovered ? 0.18 : 0.06,
                      transform: isHovered ? "scale(1)" : "scale(1.03)"
                    }}
                  />
                </div>

                {/* Subtle bottom-right SVG decorative illustration */}
                <div 
                  className="absolute inset-0 z-0 overflow-hidden pointer-events-none transition-opacity duration-300"
                  style={{ opacity: isHovered ? 0.07 : 0.015 }}
                >
                  {theme.svgPath}
                </div>

                <div className="z-10">
                  {/* Top: Phase Number & Tier Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <span 
                      className="text-3xl font-mono font-extrabold tracking-tighter transition-colors duration-300"
                      style={{ color: isHovered ? theme.textColor : "var(--mkt-ink)" }}
                    >
                      {phase.number}
                    </span>
                    <span className={cn(
                      "text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider transition-colors duration-300",
                      isFree
                        ? "text-mkt-grn bg-mkt-gbg border-mkt-gbd"
                        : "text-mkt-i3 bg-neutral-100 border-neutral-200"
                    )}>
                      {phase.tier}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2 mb-6">
                    <h3 className="text-lg font-sans font-bold text-mkt-ink leading-snug">
                      {phase.name}
                    </h3>
                    <p className="text-xs text-mkt-i3 leading-relaxed font-sans min-h-[60px]">
                      {phase.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Stats: Modules Count & Lock Info */}
                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between z-10">
                  <span className="text-[10px] font-sans font-medium text-mkt-i4 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-mkt-i3" /> {phase.modules_count} Modules
                  </span>
                  
                  <span className="text-[10px] font-mono text-mkt-i4 uppercase tracking-widest">
                    {phase.duration}
                  </span>
                </div>

              </motion.div>
            );
          })}
        </div>

        {/* Explore Full Path Link */}
        <div className="mt-16 text-center">
          <Link 
            href={`${regionPrefix}/courses`} 
            className="inline-flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-widest text-mkt-ink hover:underline"
          >
            Explore Full Curriculum <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
