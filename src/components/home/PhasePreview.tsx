"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Lock } from "lucide-react";
import { phases } from "@/data/courses";
import { cn } from "@/lib/utils";
import { useRegion } from "@/components/layout/RegionalLayout";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function PhasePreview() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial state for cards to avoid flash or sticking at 0
      gsap.set(".phase-card", { opacity: 0, y: 40 });

      gsap.to(".phase-card", {
        scrollTrigger: {
          trigger: ".phase-grid",
          start: "top 85%",
          toggleActions: "play none none none"
        },
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        onComplete: () => {
          ScrollTrigger.refresh();
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const { region } = useRegion();
  const regionPrefix = region === "uk" ? "" : `/${region}`;

  return (
    <section ref={containerRef} className="relative z-0 py-12 md:py-20 bg-white border-y border-mkt-bd min-h-[600px]">
      <div className="container mx-auto px-6">
        <div className="mb-20">
          <span className="text-accent font-mono tracking-widest uppercase text-sm mb-4 block">
            THE CURRICULUM
          </span>
          <h2 className="text-4xl md:text-6xl font-sans font-bold uppercase">
            A Phase-Based <br /> Learning Path.
          </h2>
        </div>

        <div className="phase-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {phases.map((phase) => (
            <div 
              key={phase.id} 
              className="phase-card group relative p-8 bg-white border border-mkt-bd hover:border-mkt-bds/40 transition-premium overflow-hidden rounded-xl"
            >
              {/* Background Image with Overlay */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={phase.image} 
                  alt="" 
                  className="w-full h-full object-cover opacity-5 group-hover:opacity-10 transition-opacity duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-background-surface via-background-surface/90 to-transparent" />
              </div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <span className="text-4xl font-mono font-bold text-mkt-i4 group-hover:text-accent transition-colors">
                    {phase.number}
                  </span>
                  <span className={cn(
                    "px-3 py-1 text-[10px] font-bold uppercase tracking-widest border",
                    phase.tier === 'Free' ? 'text-mkt-grn border-profit/30' : 
                    phase.tier === 'Foundation' ? 'text-accent border-accent/30' : 
                    'text-premium border-premium/30'
                  )}>
                    {phase.tier}
                  </span>
                </div>
                
                <div className="mb-8">
                  <h4 className="text-2xl font-sans font-bold uppercase group-hover:translate-x-2 transition-transform duration-500">
                    {phase.name}
                  </h4>
                  <p className="text-mkt-i4 text-sm md:text-xs uppercase tracking-widest font-mono group-hover:translate-x-2 transition-transform duration-500 delay-75">
                    {phase.subtitle}
                  </p>
                </div>

                <ul className="space-y-3 pt-8 border-t border-mkt-bd/50">
                  {phase.modules_list.slice(0, 4).map((module, j) => (
                    <li key={j} className="text-sm text-mkt-i2 flex items-center gap-2">
                      <div className="w-1 h-1 bg-accent/50 rounded-full" />
                      {module}
                    </li>
                  ))}
                </ul>

                {phase.tier !== 'Free' && (
                  <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-40 transition-opacity -translate-y-2 translate-x-2">
                    <Lock className="w-3 h-3" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Link 
            href={`${regionPrefix}/courses`} 
            className="inline-flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-mkt-ink hover:text-accent transition-colors"
          >
            Explore Full Curriculum
            <div className="w-12 h-[1px] bg-accent" />
          </Link>
        </div>
      </div>
    </section>
  );
}
