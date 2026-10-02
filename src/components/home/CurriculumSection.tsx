"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { phases } from "@/data/courses";
import { useRegion } from "@/components/layout/RegionalLayout";
import { Reveal } from "@/components/ui/Reveal";
import { CardAtmosphere, PatternType } from "@/components/ui/CardAtmosphere";

const phaseBranding: Record<string, { pattern: PatternType; border: string; glow: string }> = {
  "01": {
    pattern: "topographic", // Market Mechanics
    border: "var(--accent)",
    glow: "rgba(22, 33, 62, 0.08)"
  },
  "02": {
    pattern: "dot-matrix", // Technical Foundation
    border: "var(--accent)",
    glow: "rgba(22, 33, 62, 0.08)"
  },
  "03": {
    pattern: "plotted-curve", // Risk & Sizing
    border: "var(--accent)",
    glow: "rgba(22, 33, 62, 0.08)"
  },
  "04": {
    pattern: "circuit-lines", // Algorithmic Modeling
    border: "var(--accent)",
    glow: "rgba(22, 33, 62, 0.08)"
  },
  "05": {
    pattern: "grid-mesh", // Execution & APIs
    border: "var(--accent)",
    glow: "rgba(22, 33, 62, 0.08)"
  },
  "06": {
    pattern: "concentric-rings", // High-Frequency AI
    border: "var(--accent)",
    glow: "rgba(22, 33, 62, 0.08)"
  }
};

const defaultBranding = {
  pattern: "grid-mesh" as PatternType,
  border: "var(--border-subtle)",
  glow: "rgba(22, 33, 62, 0.04)"
};

export function CurriculumSection() {
  const { region } = useRegion();
  const regionPrefix = region === "uk" ? "" : `/${region}`;
  const [hoveredPhaseId, setHoveredPhaseId] = useState<number | null>(null);

  return (
    <section
      className="w-full border-b select-none relative z-10"
      style={{ backgroundColor: "var(--surface-base)", borderColor: "var(--border-subtle)", paddingTop: "var(--section-y-desktop)", paddingBottom: "var(--section-y-desktop)" }}
    >
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* Section Heading */}
        <Reveal>
          <div className="mb-16">
            <span
              className="block text-[11px] font-mono uppercase tracking-[0.08em] mb-3"
              style={{ color: "var(--text-tertiary)" }}
            >
              Structured learning path
            </span>
            <h2
              className="type-display-lg font-normal mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              The Curriculum
            </h2>
            <p
              className="type-body-lg font-normal"
              style={{ color: "var(--text-secondary)" }}
            >
              A six-phase learning progression designed to take you from raw market mechanics to high-frequency AI integrations.
            </p>
          </div>
        </Reveal>

        {/* 6-Phase Grid — 3x2, text-first, hairline dividers, IBM Plex Mono numbers, zero border-radius */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {phases.slice(0, 6).map((phase, idx) => {
            const isFree = phase.tier === "Free";
            const brand = phaseBranding[phase.number] || defaultBranding;
            const isHovered = hoveredPhaseId === phase.id;

            return (
              <Reveal key={phase.id} delay={idx * 0.07}>
              <Link
                href={`${regionPrefix}/courses/${phase.slug}`}
                className="block group h-full"
                onMouseEnter={() => setHoveredPhaseId(phase.id)}
                onMouseLeave={() => setHoveredPhaseId(null)}
              >
                <div
                  className="p-6 border flex flex-col justify-between h-full relative overflow-hidden transition-all duration-300 hover:shadow-[var(--elev-2)]"
                  style={{
                    borderColor: isHovered ? brand.border : "var(--border-subtle)",
                    backgroundColor: "var(--surface-raised)",
                    borderRadius: "var(--radius-md)",
                    boxShadow: "var(--elev-1)",
                  }}
                >
                  {/* Subtle, premium abstract atmosphere revealing on hover */}
                  <CardAtmosphere pattern={brand.pattern} accentColor="var(--accent)" />

                  {/* Content Layer */}
                  <div className="relative z-10 flex flex-col justify-between h-full w-full">
                    <div>
                      {/* Phase Number + Tier Label */}
                      <div className="flex items-center justify-between mb-6">
                        <span
                          className="text-[28px] font-mono tabular-nums font-medium leading-none"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {phase.number}
                        </span>
                        <span
                          className="text-[10px] font-mono uppercase tracking-[0.08em] px-2 py-0.5 border"
                          style={{
                            color: isFree ? "var(--accent)" : "var(--text-tertiary)",
                            borderColor: "var(--border-subtle)",
                            backgroundColor: isFree ? "var(--accent-muted)" : "var(--surface-overlay)",
                            borderRadius: "var(--radius-pill)",
                          }}
                        >
                          {phase.tier}
                        </span>
                      </div>

                      {/* Title + Description */}
                      <h3
                        className="text-[16px] font-medium leading-snug mb-2 font-sans group-hover:underline"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {phase.name}
                      </h3>
                      <p
                        className="text-[13px] leading-[1.6] font-sans min-h-[56px]"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {phase.description}
                      </p>
                    </div>

                    {/* Metadata Row — IBM Plex Mono */}
                    <div
                      className="pt-4 mt-6 border-t flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.08em]"
                      style={{
                        borderColor: "var(--border-subtle)",
                        color: "var(--text-tertiary)",
                      }}
                    >
                      <span>{phase.modules_count} Modules</span>
                      <span>{phase.duration}</span>
                    </div>
                  </div>

                </div>
              </Link>
              </Reveal>
            );
          })}
        </div>

        {/* Premium Institutional Accelerator Strip Card */}
        <Link href={`${regionPrefix}/institutional-accelerator`} className="block group mt-12">
          <div className="p-8 border relative overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_12px_40px_rgba(226,183,85,0.16)] cursor-pointer"
               style={{
                 borderColor: "rgba(226, 183, 85, 0.35)",
                 backgroundColor: "#FFFFFF",
                 boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 12px 32px -8px rgba(226,183,85,0.12)",
                 borderRadius: "var(--radius-lg)",
               }}
          >
            {/* Subtle gold line at top */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#E2B755] to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Subtle background glow */}
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#E2B755]/10 blur-[80px] rounded-full pointer-events-none transition-all duration-500 group-hover:scale-125 group-hover:bg-[#E2B755]/15" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 border text-[10px] font-mono font-bold uppercase tracking-wider transition-colors duration-300 group-hover:bg-[rgba(226,183,85,0.15)]"
                     style={{
                       color: "#8C6A18",
                       borderColor: "rgba(226, 183, 85, 0.35)",
                       backgroundColor: "rgba(226, 183, 85, 0.10)",
                       borderRadius: "var(--radius-pill)",
                     }}
                >
                  ★ Premium Executive Cohort
                </div>
                <h3 className="text-xl md:text-2xl font-display font-semibold tracking-tight text-[var(--text-primary)] leading-tight">
                  Drawdown Institutional Accelerator
                </h3>
                <p className="text-[13px] leading-relaxed text-[var(--text-secondary)] font-sans max-w-2xl">
                  Move beyond retail speculation. A premium 6-week higher education cohort combining systematic probability, custom Pine Script indicator engineering, live fund-level audits, and UK Limited Company tax structures.
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1 text-[11px] font-mono text-[var(--text-secondary)] uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 transition-colors duration-300 group-hover:text-[var(--text-primary)]">
                    <Check className="w-3.5 h-3.5 text-[#B8871E]" /> 15-Student Limit
                  </span>
                  <span className="flex items-center gap-1.5 transition-colors duration-300 group-hover:text-[var(--text-primary)]">
                    <Check className="w-3.5 h-3.5 text-[#B8871E]" /> Live Audits
                  </span>
                  <span className="flex items-center gap-1.5 transition-colors duration-300 group-hover:text-[var(--text-primary)]">
                    <Check className="w-3.5 h-3.5 text-[#B8871E]" /> Tax Compliance Kit
                  </span>
                </div>
              </div>

              <div className="flex items-center">
                <div
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 text-[11px] font-mono uppercase tracking-[0.08em] font-bold text-white transition-all duration-300 group-hover:shadow-lg group-hover:shadow-[#E2B755]/25 group-hover:scale-[1.02]"
                  style={{
                    background: "linear-gradient(to right, #C59235, #A8761E)",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  Apply for Cohort
                  <ArrowRight size={12} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Explore Link */}
        <div className="mt-12">
          <Link
            href={`${regionPrefix}/courses`}
            className="inline-flex items-center gap-2 text-[12px] font-mono uppercase tracking-[0.08em] hover:underline"
            style={{ color: "var(--text-primary)" }}
          >
            View the full curriculum
            <ArrowRight size={14} strokeWidth={1.5} />
          </Link>
        </div>

      </div>
    </section>
  );
}
