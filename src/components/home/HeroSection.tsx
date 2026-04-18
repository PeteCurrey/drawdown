"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ChevronDown } from "lucide-react";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate headlines
      gsap.from(".hero-content > *", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power4.out",
      });

      // Animate candlestick chart background
      const candles = chartRef.current?.querySelectorAll(".candle");
      if (candles) {
        gsap.from(candles, {
          y: 40,
          opacity: 0,
          duration: 3,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.5,
        });

        // "Live Market" breathing animation
        candles.forEach((candle, i) => {
          gsap.to(candle, {
            opacity: 0.3 + Math.random() * 0.5,
            duration: 3 + Math.random() * 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.1 + 3,
          });
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Candlestick Chart Background */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none overflow-hidden">
        <svg
          ref={chartRef}
          viewBox="0 0 1000 500"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
        >
          {Array.from({ length: 20 }).map((_, i) => {
            const height = 100 + Math.random() * 200;
            const x = i * 60;
            const y = 300 - height / 2;
            const isBull = Math.random() > 0.4;
            
            return (
              <g key={i} className="candle">
                {/* Wick */}
                <line
                  x1={x + 10}
                  y1={y - 20}
                  x2={x + 10}
                  y2={y + height + 20}
                  stroke={isBull ? "#00E676" : "#FF3D57"}
                  strokeWidth="1"
                />
                {/* Body */}
                <rect
                  x={x}
                  y={y}
                  width="20"
                  height={height}
                  fill={isBull ? "#00E676" : "#FF3D57"}
                  opacity="0.6"
                />
              </g>
            );
          })}
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10 hero-content text-center">
        <div className="inline-block mb-8">
          <span className="text-xs md:text-sm font-mono tracking-widest-xl text-text-secondary uppercase">
            TRADING EDUCATION
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-9xl font-display font-extrabold uppercase tracking-tight mb-8">
          Trade the <span className="text-accent">Truth.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-12 font-sans leading-relaxed">
          Most traders lose money. The industry profits from selling you hope. 
          We teach you why — and how not to.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link 
            href="/signup" 
            className="w-full sm:w-auto px-10 py-5 bg-accent hover:bg-accent-hover text-background-primary text-sm font-bold uppercase tracking-widest transition-colors rounded-none"
          >
            Start for Free
          </Link>
          <Link 
            href="/pricing" 
            className="w-full sm:w-auto px-10 py-5 border border-border-slate hover:border-text-primary text-text-primary text-sm font-bold uppercase tracking-widest transition-colors rounded-none"
          >
            See Pricing
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-text-tertiary" />
      </div>
    </section>
  );
}
