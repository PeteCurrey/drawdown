"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AlertCircle, EyeOff, TrendingDown } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const problems = [
  {
    icon: AlertCircle,
    title: "The Guru Problem",
    description: "Fake P&Ls and rented Lamborghinis sell dreams, not discipline. We trade reality, not hype."
  },
  {
    icon: EyeOff,
    title: "Information Overload",
    description: "100 indicators and 24/7 noise lead to paralysis. We simplify the noise to focus on price."
  },
  {
    icon: TrendingDown,
    title: "The Emotional Spiral",
    description: "Revenge trading and FOMO kill accounts. Our framework is built to survive your emotions."
  }
];

export function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".problem-stat", {
        scrollTrigger: {
          trigger: ".problem-stat",
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "premium",
      });

      gsap.from(".problem-card", {
        scrollTrigger: {
          trigger: ".problem-grid",
          start: "top 80%",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "premium",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-48 bg-background-primary overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
          <div className="problem-stat">
            <h2 className="text-[12rem] md:text-[18rem] font-display font-extrabold leading-none text-accent/10 select-none">
              90%
            </h2>
            <div className="-mt-12 md:-mt-20">
              <h3 className="text-3xl md:text-5xl font-display font-bold uppercase mb-6">
                Of retail traders lose money.
              </h3>
              <p className="text-xl text-text-secondary max-w-xl leading-relaxed">
                The industry profits from selling you hope. Broken alerts, useless courses, and 
                get-rich-quick schemes are the norm. We'd rather sell you a framework.
              </p>
            </div>
          </div>
        </div>

        <div className="problem-grid grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((problem, i) => (
            <div 
              key={i} 
              className="problem-card group p-8 md:p-12 bg-background-surface border border-border-slate hover:border-accent/50 transition-premium"
            >
              <problem.icon className="w-12 h-12 text-accent mb-8 group-hover:scale-110 transition-transform duration-500" />
              <h4 className="text-xl font-display font-bold uppercase tracking-wider mb-4">
                {problem.title}
              </h4>
              <p className="text-text-secondary leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
