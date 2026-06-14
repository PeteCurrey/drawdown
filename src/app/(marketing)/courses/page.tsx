"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, BookOpen, ChevronRight, Layers, Shield } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { StructuredData } from "@/components/StructuredData";
import { phases } from "@/data/courses";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { SectionA, SectionB, SectionC, SectionD, SectionE } from "@/components/courses/CourseSections";

// Contextually relevant Unsplash images per phase
const phaseImages = [
  "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1642790106117-e829e14a795f?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop",
];

const tierStyles: Record<string, { accent: string; badge: string }> = {
  Free:       { accent: "text-profit", badge: "bg-mkt-gbg border-mkt-gbd text-profit" },
  Foundation: { accent: "text-indigo-600", badge: "bg-indigo-50 border-indigo-200 text-indigo-700" },
  Edge:       { accent: "text-cyan-600",   badge: "bg-cyan-50 border-cyan-200 text-cyan-700" },
  Floor:      { accent: "text-amber-600",  badge: "bg-amber-50 border-amber-200 text-amber-700" },
};

export default function CoursesPage() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const courseSchema = {
    "@type": "ItemList",
    itemListElement: phases.map((phase, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Course",
        name: `Phase ${phase.number}: ${phase.name}`,
        description: phase.description,
        provider: { "@type": "Organization", name: "Drawdown", sameAs: "https://drawdown.trading" },
      },
    })),
  };

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <Breadcrumbs />
        <StructuredData type="ItemList" data={courseSchema} />

        {/* Page Header */}
        <header className="mb-20 max-w-3xl min-h-[calc(100vh-150px)] flex flex-col justify-center">
          <span className="text-[11px] font-sans font-bold text-text-tertiary uppercase tracking-widest block mb-4">
            // THE CURRICULUM
          </span>
          <h1 className="text-4xl md:text-6xl font-sans font-extrabold tracking-tight text-text-primary mb-6 leading-tight">
            A Phase-Based<br />Learning Path.
          </h1>
          <p className="text-lg text-text-tertiary leading-relaxed font-sans max-w-2xl">
            From complete beginner to professional-grade edge. 6 phases. 60+ modules.
            Built for traders who want to learn properly. No shortcuts. Just the truth.
          </p>
        </header>

        <SectionA />
        <SectionB />
        <SectionC />

        {/* Phase Rows */}
        <div className="space-y-6">
          {phases.map((phase, i) => {
            const tier = tierStyles[phase.tier] ?? tierStyles.Foundation;
            const isHovered = hoveredIdx === i;
            const image = phaseImages[i];

            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ delay: i * 0.06, duration: 0.5, ease: "easeOut" }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="relative border border-border-slate/50 rounded-[14px] overflow-hidden transition-all duration-300"
                style={{
                  backgroundColor: "white",
                  transform: isHovered ? "translateY(-2px)" : "translateY(0)",
                  boxShadow: isHovered ? "0 8px 32px rgba(0,0,0,0.07)" : "none",
                  borderColor: isHovered ? "rgba(0,0,0,0.14)" : undefined,
                }}
              >
                {/* Background image reveal */}
                <div className="absolute inset-0 pointer-events-none">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out"
                    style={{
                      backgroundImage: `url(${image})`,
                      opacity: isHovered ? 0.07 : 0.03,
                      transform: isHovered ? "scale(1)" : "scale(1.04)",
                    }}
                  />
                </div>

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 md:p-10">
                  {/* Phase number */}
                  <div className="lg:col-span-1 flex lg:flex-col lg:items-center lg:justify-start">
                    <span
                      className="text-4xl font-sans font-extrabold tracking-tighter transition-colors duration-300"
                      style={{ color: isHovered ? "#0A0A0A" : "#CCCCCC" }}
                    >
                      {phase.number}
                    </span>
                  </div>

                  {/* Main content */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={cn("text-[9px] font-sans font-bold px-2.5 py-1 rounded border uppercase tracking-wider", tier.badge)}>
                        {phase.tier} Tier
                      </span>
                      <span className="text-[10px] font-sans text-text-tertiary flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {phase.duration}
                      </span>
                    </div>

                    <div>
                      <h2 className="text-2xl md:text-3xl font-sans font-extrabold tracking-tight text-text-primary leading-snug">
                        {phase.name}
                      </h2>
                      <p className="text-xs text-text-tertiary uppercase tracking-widest mt-1 font-sans">{phase.subtitle}</p>
                    </div>

                    <p className="text-sm text-text-tertiary leading-relaxed font-sans border-l-2 border-border-slate/50 pl-4 italic">
                      {phase.description}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Link
                        href={`/courses/${phase.slug}`}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-sans font-semibold text-sm text-white transition-colors duration-150"
                        style={{ backgroundColor: "#0A0A0A" }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#3A3A3A")}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#0A0A0A")}
                      >
                        View Details <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href="/signup"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-sans font-semibold text-sm text-text-primary border border-border-slate/50 hover:border-border-slate transition-colors duration-150"
                      >
                        {phase.tier === "Free" ? "Start Free" : "Create Account"}
                      </Link>
                    </div>
                  </div>

                  {/* Module list */}
                  <div className="lg:col-span-4">
                    <div className="bg-background-elevated/40 border border-border-slate/50 rounded-[12px] p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Layers className="w-3.5 h-3.5 text-text-tertiary" />
                        <span className="text-[10px] font-sans font-bold text-text-tertiary uppercase tracking-widest">
                          {phase.modules_count} Modules
                        </span>
                      </div>
                      <ul className="space-y-2.5">
                        {phase.modules_list.slice(0, 5).map((mod, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs text-text-tertiary font-sans">
                            <span className="text-[9px] font-mono text-text-tertiary mt-0.5 shrink-0">
                              {(idx + 1).toString().padStart(2, "0")}
                            </span>
                            <span className="leading-relaxed">{mod}</span>
                          </li>
                        ))}
                        {phase.modules_list.length > 5 && (
                          <li className="text-[10px] font-sans text-text-tertiary pt-1">
                            +{phase.modules_list.length - 5} more modules →
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <SectionD />
        <SectionE />

        {/* Final CTA */}
        <div className="mt-20 border border-border-slate/50 rounded-[14px] p-12 md:p-16 text-center relative overflow-hidden bg-background-elevated/40">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-mkt-ink rounded-t-[14px]" />
          <div className="max-w-xl mx-auto space-y-6 relative z-10">
            <h2 className="text-2xl md:text-3xl font-sans font-extrabold tracking-tight text-text-primary">
              Ready to learn properly?
            </h2>
            <p className="text-sm text-text-tertiary leading-relaxed font-sans">
              Start with Phase 1 — completely free. No credit card required.
              Experience why Drawdown is the choice for disciplined traders.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg font-sans font-semibold text-sm text-white transition-colors duration-150"
              style={{ backgroundColor: "#0A0A0A" }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#3A3A3A")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#0A0A0A")}
            >
              Create Free Account <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <Shield className="absolute -bottom-10 -right-10 w-48 h-48 text-mkt-bd pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
