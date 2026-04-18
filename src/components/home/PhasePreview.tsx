"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Lock } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const phases = [
  {
    number: "01",
    title: "Foundations",
    subtitle: "Ground Zero",
    tier: "Free",
    modules: ["What is Trading?", "Broker Setup", "Reading a Chart", "Order Types"]
  },
  {
    number: "02",
    title: "Technical",
    subtitle: "Reading the Room",
    tier: "Foundation",
    modules: ["Support & Resistance", "Trend ID", "Candlestick Patterns", "Indicators"]
  },
  {
    number: "03",
    title: "Strategy",
    subtitle: "Your Playbook",
    tier: "Foundation",
    modules: ["Entry & Exit", "Momentum Trading", "Swing Strategies", "Backtesting"]
  },
  {
    number: "04",
    title: "Risk",
    subtitle: "Staying Alive",
    tier: "Foundation",
    modules: ["Position Sizing", "Stop Losses", "Drawdown Management", "Correlation"]
  },
  {
    number: "05",
    title: "Psychology",
    subtitle: "The 80%",
    tier: "Edge",
    modules: ["FOMO & Overtrading", "Trading Routines", "Identity", "Losing Streaks"]
  },
  {
    number: "06",
    title: "Advanced",
    subtitle: "The Edge",
    tier: "Edge",
    modules: ["Order Flow", "Options Basics", "Algo Introduction", "Scaling"]
  }
];

export function PhasePreview() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".phase-card", {
        scrollTrigger: {
          trigger: ".phase-grid",
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative z-0 py-32 md:py-48 bg-background-primary border-y border-border-slate min-h-[600px]">
      <div className="container mx-auto px-6">
        <div className="mb-20">
          <span className="text-accent font-mono tracking-widest uppercase text-sm mb-4 block">
            THE CURRICULUM
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-bold uppercase">
            A Phase-Based <br /> Learning Path.
          </h2>
        </div>

        <div className="phase-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {phases.map((phase, i) => (
            <div 
              key={i} 
              className="phase-card group relative p-8 bg-background-surface border border-border-slate hover:border-accent/40 transition-premium"
            >
              <div className="flex justify-between items-start mb-8">
                <span className="text-4xl font-mono font-bold text-text-tertiary group-hover:text-accent transition-colors">
                  {phase.number}
                </span>
                <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-border-slate ${
                  phase.tier === 'Free' ? 'text-text-primary' : 
                  phase.tier === 'Foundation' ? 'text-accent border-accent/30' : 
                  'text-premium border-premium/30'
                }`}>
                  {phase.tier}
                </span>
              </div>
              
              <div className="mb-8">
                <h4 className="text-2xl font-display font-bold uppercase group-hover:translate-x-2 transition-transform duration-500">
                  {phase.title}
                </h4>
                <p className="text-text-tertiary text-xs uppercase tracking-widest font-mono group-hover:translate-x-2 transition-transform duration-500 delay-75">
                  {phase.subtitle}
                </p>
              </div>

              <ul className="space-y-3 pt-8 border-t border-border-slate/50">
                {phase.modules.map((module, j) => (
                  <li key={j} className="text-sm text-text-secondary flex items-center gap-2">
                    <div className="w-1 h-1 bg-accent/50 rounded-full" />
                    {module}
                  </li>
                ))}
              </ul>

              {phase.tier !== 'Free' && (
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-40 transition-opacity">
                  <Lock className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Link 
            href="/courses" 
            className="inline-flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-text-primary hover:text-accent transition-colors"
          >
            Explore Full Curriculum
            <div className="w-12 h-[1px] bg-accent" />
          </Link>
        </div>
      </div>
    </section>
  );
}
