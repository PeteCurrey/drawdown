"use client";

import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";
import { phases } from "@/data/courses";
import { cn } from "@/lib/utils";
import { useRegion } from "@/components/layout/RegionalLayout";
import { motion } from "framer-motion";

export function CurriculumSection() {
  const { region } = useRegion();
  const regionPrefix = region === "uk" ? "" : `/${region}`;

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
            
            return (
              <motion.div
                key={phase.id}
                custom={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-20px" }}
                variants={cardVariants}
                className="bg-white border border-mkt-bd rounded-[14px] p-6 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top: Phase Number & Tier Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-mono font-extrabold text-mkt-ink tracking-tighter">
                      {phase.number}
                    </span>
                    <span className={cn(
                      "text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider",
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
                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
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
