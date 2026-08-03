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
