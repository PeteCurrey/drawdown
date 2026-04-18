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
    image: "/images/tools/terminal.png",
  },
  {
    slug: "risk-calculator",
    icon: Calculator,
    name: "Risk Calculator",
    description: "Position sizing is how you stay alive. Protect your capital with professional grade risk tools.",
    tier: "Foundation+",
    image: "/images/tools/terminal.png",
  },
  {
    slug: "ai-market-scanner",
    icon: Scan,
    name: "AI Market Scanner",
    description: "Don't just see what's moving — understand why. Real-time context for major market shifts.",
    tier: "Edge+",
    image: "/images/tools/scanner.png",
  },
  {
    slug: "strategy-backtester",
    icon: History,
    name: "Strategy Backtester",
    description: "Test your ideas against history before risking a penny. Data-backed confidence for every entry.",
    tier: "Edge+",
    image: "/images/tools/terminal.png",
  },
  {
    slug: "ai-daily-briefing",
    icon: Mail,
    name: "AI Daily Briefing",
    description: "Personalised morning brief based on your watchlist and preferred trading markets.",
    tier: "Edge+",
    image: "/images/tools/scanner.png",
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
    <section ref={scrollRef} className="relative z-10 bg-background-elevated">
      <div className="h-screen flex items-center overflow-hidden">
        <div className="container mx-auto px-6 mb-12 absolute top-32 left-0 right-0 z-10">
          <span className="text-accent font-mono tracking-widest uppercase text-sm mb-4 block">
            PLATFORM TOOLS
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-bold uppercase">
            Built by Traders. <br /> Enhanced by AI.
          </h2>
        </div>

        <div className="flex gap-8 pl-[10vw] min-w-max">
          {features.map((feature, i) => (
            <Link 
              key={i} 
              href={`/features/${feature.slug}`}
              className="feature-card group relative w-[80vw] md:w-[400px] h-[500px] bg-background-surface border border-border-slate p-12 flex flex-col justify-between transition-premium hover:border-accent/50 overflow-hidden"
            >
              {/* Image Reveal Background */}
              <div 
                className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-all duration-1000 ease-out scale-110 group-hover:scale-100 grayscale-[50%] group-hover:grayscale-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${feature.image})` }}
              >
                <div className="absolute inset-0 bg-background-elevated/80 z-10 mix-blend-overlay group-hover:bg-background-elevated/40 transition-colors duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-background-elevated via-background-elevated/80 to-transparent z-10" />
              </div>

              {/* Geometric Grid Background (Secondary) */}
              <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <div className="h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />
              </div>

              <div className="relative z-10 flex flex-col h-full justify-between pointer-events-none">
                <div>
                  <div className="text-accent mb-8 group-hover:scale-110 transition-transform duration-500">
                    <feature.icon className="w-12 h-12" />
                  </div>
                  <h4 className="text-2xl font-display font-bold uppercase mb-4 group-hover:text-accent transition-colors">
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
                  <div className="w-8 h-[1px] bg-border-slate group-hover:bg-accent group-hover:w-12 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
