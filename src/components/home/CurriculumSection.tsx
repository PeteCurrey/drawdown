"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { phases } from "@/data/courses";
import { useRegion } from "@/components/layout/RegionalLayout";

const phaseBranding: Record<string, { bg: string; border: string; glow: string }> = {
  "01": {
    bg: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&w=600&q=80", // Market Mechanics
    border: "var(--signal-navy)",
    glow: "rgba(10, 37, 64, 0.15)"
  },
  "02": {
    bg: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80", // Technical Foundation
    border: "var(--signal-navy)",
    glow: "rgba(10, 37, 64, 0.15)"
  },
  "03": {
    bg: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80", // Risk & Sizing
    border: "var(--signal-navy)",
    glow: "rgba(10, 37, 64, 0.15)"
  },
  "04": {
    bg: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80", // Algorithmic Modeling
    border: "var(--signal-navy)",
    glow: "rgba(10, 37, 64, 0.15)"
  },
  "05": {
    bg: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80", // Execution & APIs
    border: "var(--signal-navy)",
    glow: "rgba(10, 37, 64, 0.15)"
  },
  "06": {
    bg: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80", // High-Frequency AI
    border: "var(--signal-navy)",
    glow: "rgba(10, 37, 64, 0.15)"
  }
};

const defaultBranding = {
  bg: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
  border: "var(--ink-950)",
  glow: "rgba(10, 37, 64, 0.08)"
};

export function CurriculumSection() {
  const { region } = useRegion();
  const regionPrefix = region === "uk" ? "" : `/${region}`;
  const [hoveredPhaseId, setHoveredPhaseId] = useState<number | null>(null);

  return (
    <section
      className="w-full py-24 border-b select-none relative z-10"
      style={{ backgroundColor: "var(--paper-0)", borderColor: "var(--line-200)" }}
    >
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* Section Heading */}
        <div className="mb-16">
          <span
            className="block text-[11px] font-mono uppercase tracking-[0.08em] mb-3"
            style={{ color: "var(--graphite-600)" }}
          >
            Structured learning path
          </span>
          <h2
            className="font-display text-[clamp(1.75rem,4vw,3rem)] leading-tight tracking-[-0.02em] font-semibold mb-4"
            style={{ color: "var(--ink-950)" }}
          >
            The Curriculum
          </h2>
          <p
            className="text-[15px] leading-relaxed max-w-xl font-sans"
            style={{ color: "var(--graphite-600)" }}
          >
            A six-phase learning progression designed to take you from raw market mechanics to high-frequency AI integrations.
          </p>
        </div>

        {/* 6-Phase Grid — 3x2, text-first, hairline dividers, IBM Plex Mono numbers, zero border-radius */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {phases.slice(0, 6).map((phase) => {
            const isFree = phase.tier === "Free";
            const brand = phaseBranding[phase.number] || defaultBranding;
            const isHovered = hoveredPhaseId === phase.id;

            return (
              <Link
                href={`${regionPrefix}/courses/${phase.slug}`}
                key={phase.id}
                className="block group"
                onMouseEnter={() => setHoveredPhaseId(phase.id)}
                onMouseLeave={() => setHoveredPhaseId(null)}
              >
                <div
                  className="p-6 border flex flex-col justify-between h-full relative overflow-hidden transition-all duration-300"
                  style={{
                    borderColor: isHovered ? brand.border : "var(--line-200)",
                    backgroundColor: "var(--paper-100)",
                    borderRadius: 0,
                    boxShadow: isHovered ? `0 0 24px ${brand.glow}, inset 0 0 12px ${brand.glow}` : "none",
                  }}
                >
                  {/* Brand-Matching Background Image Layer */}
                  <div 
                    className="absolute inset-0 z-0 transition-all duration-500 pointer-events-none"
                    style={{
                      backgroundImage: `url(${brand.bg})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      opacity: isHovered ? 0.12 : 0.03,
                      mixBlendMode: "luminosity",
                    }}
                  />

                  {/* Content Layer */}
                  <div className="relative z-10 flex flex-col justify-between h-full w-full">
                    <div>
                      {/* Phase Number + Tier Label */}
                      <div className="flex items-center justify-between mb-6">
                        <span
                          className="text-[28px] font-mono tabular font-medium leading-none"
                          style={{ color: "var(--ink-950)" }}
                        >
                          {phase.number}
                        </span>
                        <span
                          className="text-[10px] font-mono uppercase tracking-[0.08em] px-2 py-0.5 border"
                          style={{
                            color: isFree ? "var(--signal-navy)" : "var(--graphite-600)",
                            borderColor: "var(--line-200)",
                            backgroundColor: "var(--paper-0)",
                            borderRadius: 0,
                          }}
                        >
                          {phase.tier}
                        </span>
                      </div>

                      {/* Title + Description */}
                      <h3
                        className="text-[16px] font-medium leading-snug mb-2 font-sans group-hover:underline"
                        style={{ color: "var(--ink-950)" }}
                      >
                        {phase.name}
                      </h3>
                      <p
                        className="text-[13px] leading-[1.6] font-sans min-h-[56px]"
                        style={{ color: "var(--graphite-600)" }}
                      >
                        {phase.description}
                      </p>
                    </div>

                    {/* Metadata Row — IBM Plex Mono */}
                    <div
                      className="pt-4 mt-6 border-t flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.08em]"
                      style={{
                        borderColor: "var(--line-200)",
                        color: "var(--graphite-600)",
                      }}
                    >
                      <span>{phase.modules_count} Modules</span>
                      <span>{phase.duration}</span>
                    </div>
                  </div>

                </div>
              </Link>
            );
          })}
        </div>

        {/* Premium Institutional Accelerator Strip Card */}
        <div className="mt-12 p-8 border relative overflow-hidden group transition-all duration-500"
             style={{
               borderColor: "rgba(226, 183, 85, 0.2)",
               background: "linear-gradient(135deg, #0B0E12 0%, #151922 100%)",
               borderRadius: 0,
             }}
        >
          {/* Subtle gold line at top */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#E2B755] to-transparent" />
          
          {/* Subtle background glow */}
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#E2B755]/5 blur-[80px] rounded-full pointer-events-none transition-all duration-500 group-hover:scale-110" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 border text-[10px] font-mono font-bold uppercase tracking-wider"
                   style={{
                     color: "#E2B755",
                     borderColor: "rgba(226, 183, 85, 0.25)",
                     backgroundColor: "rgba(226, 183, 85, 0.08)",
                     borderRadius: 0,
                   }}
              >
                ★ Premium Executive Cohort
              </div>
              <h3 className="text-xl md:text-2xl font-display font-semibold tracking-tight text-white leading-tight">
                Drawdown Institutional Accelerator
              </h3>
              <p className="text-[13px] leading-relaxed text-gray-400 font-sans max-w-2xl">
                Move beyond retail speculation. A premium 6-week higher education cohort combining systematic probability, custom Pine Script indicator engineering, live fund-level audits, and UK Limited Company tax structures.
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1 text-[11px] font-mono text-gray-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <span className="text-[#E2B755]">✓</span> 15-Student Limit
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-[#E2B755]">✓</span> Live Audits
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-[#E2B755]">✓</span> Tax Compliance Kit
                </span>
              </div>
            </div>

            <div className="flex items-center">
              <Link
                href={`${regionPrefix}/institutional-accelerator`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 text-[11px] font-mono uppercase tracking-[0.08em] font-bold text-black transition-all duration-300 hover:shadow-lg hover:shadow-[#E2B755]/10"
                style={{
                  background: "linear-gradient(to right, #E2B755, #C59235)",
                  borderRadius: 0,
                }}
              >
                Apply for Cohort
                <ArrowRight size={12} strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>

        {/* Explore Link */}
        <div className="mt-12">
          <Link
            href={`${regionPrefix}/courses`}
            className="inline-flex items-center gap-2 text-[12px] font-mono uppercase tracking-[0.08em] hover:underline"
            style={{ color: "var(--ink-950)" }}
          >
            View the full curriculum
            <ArrowRight size={14} strokeWidth={1.5} />
          </Link>
        </div>

      </div>
    </section>
  );
}
