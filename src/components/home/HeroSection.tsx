"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { useRegion } from "@/components/layout/RegionalLayout";

export function HeroSection() {
  const { label } = useRegion();
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate headlines
      gsap.from(".hero-content > *", {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
      });

      // Subtle grid animation
      if (gridRef.current) {
        gsap.to(gridRef.current, {
          opacity: 0.3,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative h-[65vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-background-primary border-b border-border-slate/50"
    >
      {/* Subtle Animated Grid Background */}
      <div 
        ref={gridRef}
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
      >
        <div className="h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background-primary/50 to-background-primary" />
      </div>

      <div className="container mx-auto px-6 relative z-10 hero-content text-center flex flex-col items-center">
        <span className="text-[10px] md:text-xs font-mono tracking-[0.3em] text-accent uppercase mb-6 block">
          // TRADING EDUCATION + INTELLIGENCE
        </span>
        
        <h1 className="text-[clamp(2.5rem,8vw,5.5rem)] font-display font-black uppercase tracking-tighter leading-[0.9] mb-8">
          Trade <br className="md:hidden" /> the <span className="text-accent underline decoration-accent/20 underline-offset-8">Truth.</span>
        </h1>
        
        <p className="text-base md:text-lg text-text-secondary max-w-xl mx-auto mb-12 font-sans leading-relaxed">
          Live market intelligence. AI-powered tools. Honest education. <br className="hidden md:block" /> Built for {label} traders.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto">
          <Link 
            href="/signup" 
            className="w-full sm:w-auto px-10 py-5 bg-accent hover:bg-accent-hover text-background-primary text-[10px] font-bold uppercase tracking-[0.2em] transition-premium shadow-2xl shadow-accent/20"
          >
            Start Free
          </Link>
          <Link 
            href="/markets" 
            className="w-full sm:w-auto px-10 py-5 border border-border-slate hover:border-text-primary text-text-primary text-[10px] font-bold uppercase tracking-[0.2em] transition-premium backdrop-blur-sm"
          >
            Explore Markets
          </Link>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}
