"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LayoutDashboard, Calculator, Scan, History, Mail } from "lucide-react";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const features = [
  {
    slug: "ai-trade-journal",
    icon: LayoutDashboard,
    name: "AI Trade Journal",
    description: "Your data is your edge. AI analyzes your patterns to find where you're actually winning.",
    tier: "Edge+",
    image: "/images/tools/ai-trade-journal.png",
  },
  {
    slug: "risk-calculator",
    icon: Calculator,
    name: "Risk Calculator",
    description: "Position sizing is how you stay alive. Protect your capital with professional grade risk tools.",
    tier: "Foundation+",
    image: "/images/tools/risk-calculator.png",
  },
  {
    slug: "ai-market-scanner",
    icon: Scan,
    name: "AI Market Scanner",
    description: "Don't just see what's moving — understand why. Real-time context for major market shifts.",
    tier: "Edge+",
    image: "/images/tools/ai-market-scanner.png",
  },
  {
    slug: "strategy-backtester",
    icon: History,
    name: "Strategy Backtester",
    description: "Test your ideas against history before risking a penny. Data-backed confidence for every entry.",
    tier: "Edge+",
    image: "/images/tools/strategy-backtester.png",
  },
  {
    slug: "ai-daily-briefing",
    icon: Mail,
    name: "AI Daily Briefing",
    description: "Personalised morning brief based on your watchlist and preferred trading markets.",
    tier: "Edge+",
    image: "/images/tools/ai-daily-briefing.png",
  }
];

export function FeatureShowcase() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".feature-card");
      
      gsap.to(cards, {
        xPercent: -100 * (cards.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: scrollRef.current,
          pin: true,
          pinSpacing: true,
          scrub: 1,
          snap: 1 / (cards.length - 1),
          start: "top 120px",
          end: () => `+=${cards.length * 400}`,
          anticipatePin: 1,
        }
      });
    }, scrollRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={scrollRef} className="relative z-10 bg-background-elevated border-y border-border-slate/50">
      <div className="h-screen flex items-center overflow-hidden">
        <div className="container mx-auto px-6 mb-12 absolute top-32 left-0 right-0 z-10">
          <span className="text-accent font-mono tracking-widest uppercase text-sm md:text-xs mb-4 block">
            // PLATFORM TOOLS
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-bold uppercase">
            Built by Traders. <br /> Enhanced by AI.
          </h2>
        </div>

        <div className="flex gap-8 pl-[10vw] min-w-max">
          {features.map((feature, i) => (
            <Link 
              key={i} 
              href={`/tools/${feature.slug}`}
              className="feature-card group relative w-[85vw] md:w-[450px] h-[550px] bg-background-surface border border-border-slate p-12 flex flex-col justify-between transition-premium hover:border-accent/50 overflow-hidden rounded-xl"
            >
              {/* Feature Background Image (Hover Reveal) */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={feature.image} 
                  alt="" 
                  className="w-full h-full object-cover transition-all duration-1000 scale-110 group-hover:scale-100 opacity-0 group-hover:opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background-surface via-background-surface/50 to-transparent" />
              </div>

              {/* Technical Grid Background */}
              <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none group-hover:opacity-[0.07] transition-opacity duration-1000">
                <div className="h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
              </div>

              {/* Decorative Corner Accents */}
              <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 flex flex-col h-full justify-between pointer-events-none">
                <div>
                  <div className="w-16 h-16 bg-accent/5 border border-accent/10 flex items-center justify-center text-accent mb-12 group-hover:scale-110 group-hover:bg-accent/10 transition-all duration-500">
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h4 className="text-3xl font-display font-bold uppercase mb-6 tracking-tight group-hover:text-accent transition-colors">
                    {feature.name}
                  </h4>
                  <p className="text-text-secondary leading-relaxed text-sm max-w-sm">
                    {feature.description}
                  </p>
                </div>
                
                <div className="flex justify-between items-end">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-text-tertiary">
                      Access Tier
                    </span>
                    <span className="text-sm md:text-xs font-mono font-bold text-accent">
                      {feature.tier}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary group-hover:text-text-primary transition-colors">
                      View Tool
                    </span>
                    <div className="w-8 h-[1px] bg-border-slate group-hover:bg-accent group-hover:w-16 transition-all duration-500" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
