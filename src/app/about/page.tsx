"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".reveal-text", {
        scrollTrigger: {
          trigger: ".reveal-text",
          start: "top 80%",
        },
        y: 60,
        opacity: 0,
        duration: 1.5,
        ease: "premium",
      });

      gsap.from(".mission-card", {
        scrollTrigger: {
          trigger: ".mission-grid",
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "premium",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="pt-32 bg-background-primary min-h-screen">
      <div className="container mx-auto px-6">
        {/* Anti-Guru Manifesto */}
        <div className="max-w-4xl mx-auto mb-32">
          <span className="text-accent font-mono tracking-widest uppercase text-sm mb-4 block">
            // OUR MANIFESTO
          </span>
          <h1 className="text-5xl md:text-8xl font-display font-extrabold uppercase leading-tight mb-12 reveal-text">
            Trading is hard. <br /> 
            Guru culture <br /> 
            is <span className="text-accent">toxic.</span>
          </h1>
          
          <div className="space-y-8 text-xl text-text-secondary leading-relaxed font-sans">
            <p>
              We founded Drawdown because the industry is broken. Every day, thousands of new traders 
              are lured in with promises of easy money, Lamborghinis, and "secret" signals. 
            </p>
            <p className="border-l-4 border-accent pl-8 py-4 bg-background-elevated/50 italic text-text-primary">
              "The truth is that 90% of retail traders lose money. They lose because they lack 
              discipline, lack risk management, and are trying to trade someone else's strategy 
              without understanding the why."
            </p>
            <p>
              Drawdown is the antidote. We don't sell dreams. We don't sell hope. 
              We sell education, AI-driven tools, and a framework built for sustainability. 
              A drawdown isn't a failure—it's part of the process. We teach you how to survive it.
            </p>
          </div>
        </div>

        {/* Pillars */}
        <div className="mission-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32 pt-24 border-t border-border-slate">
          {[
            { title: "Honesty", desc: "No fake stats. No promises of wealth. Just the hard truth about markets." },
            { title: "Discipline", desc: "Process over outcome. We teach you to follow rules, not emotions." },
            { title: "Edge", desc: "Tools and data that give you a statistical advantage over time." },
            { title: "Survival", desc: "The only goal is to stay in the game long enough to win." },
          ].map((item, i) => (
            <div key={i} className="mission-card space-y-4">
              <h3 className="text-2xl font-display font-bold uppercase tracking-widest">{item.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Founder note */}
        <div className="bg-background-surface p-12 md:p-24 border border-border-slate mb-24 reveal-text">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-display font-bold uppercase mb-8">From the Founder</h2>
            <p className="text-lg text-text-secondary leading-relaxed mb-8">
              "I've made £100K in a single day. I've also blown accounts and spent months in deep drawdowns. 
              Both experiences taught me the same thing: Success in trading isn't about being right. 
              It's about being disciplined when you're wrong."
            </p>
            <p className="font-mono text-accent uppercase tracking-widest">// PETE, FOUNDER</p>
          </div>
        </div>
      </div>
    </div>
  );
}
