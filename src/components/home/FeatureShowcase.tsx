"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LayoutDashboard, Calculator, Scan, History, Mail } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const features = [
  {
    icon: LayoutDashboard,
    name: "AI Trade Journal",
    description: "Your data is your edge. AI analyzes your patterns to find where you're actually winning.",
    tier: "Edge+"
  },
  {
    icon: Calculator,
    name: "Risk Calculator",
    description: "Position sizing is how you stay alive. Protect your capital with professional grade risk tools.",
    tier: "Foundation+"
  },
  {
    icon: Scan,
    name: "AI Market Scanner",
    description: "Don't just see what's moving — understand why. Real-time context for major market shifts.",
    tier: "Edge+"
  },
  {
    icon: History,
    name: "Strategy Backtester",
    description: "Test your ideas against history before risking a penny. Data-backed confidence for every entry.",
    tier: "Edge+"
  },
  {
    icon: Mail,
    name: "AI Daily Briefing",
    description: "Personalised morning brief based on your watchlist and preferred trading markets.",
    tier: "Edge+"
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
          scrub: 1,
          snap: 1 / (cards.length - 1),
          start: "top top",
          end: () => `+=${scrollRef.current?.offsetWidth}`,
        }
      });
    }, scrollRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={scrollRef} className="bg-background-elevated overflow-hidden">
      <div className="h-screen flex items-center">
        <div className="container mx-auto px-6 mb-12 absolute top-20 left-0 right-0 z-10">
          <span className="text-accent font-mono tracking-widest uppercase text-sm mb-4 block">
            // PLATFORM TOOLS
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-bold uppercase">
            Built by Traders. <br /> Enhanced by AI.
          </h2>
        </div>

        <div className="flex gap-8 pl-[10vw] min-w-max">
          {features.map((feature, i) => (
            <div 
              key={i} 
              className="feature-card w-[80vw] md:w-[400px] h-[500px] bg-background-surface border border-border-slate p-12 flex flex-col justify-between transition-premium hover:border-accent/50"
            >
              <div>
                <div className="text-accent mb-8">
                  <feature.icon className="w-12 h-12" />
                </div>
                <h4 className="text-2xl font-display font-bold uppercase mb-4">
                  {feature.name}
                </h4>
                <p className="text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold tracking-widest text-text-tertiary">
                  Tier: {feature.tier}
                </span>
                <div className="w-8 h-[1px] bg-border-slate group-hover:bg-accent transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
