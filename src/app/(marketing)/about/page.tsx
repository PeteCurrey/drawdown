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
            OUR MANIFESTO
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

        {/* The Founder's Journey */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32 pt-24 border-t border-border-slate">
          <div className="reveal-text">
            <h2 className="text-4xl font-display font-bold uppercase mb-8">The Man Behind the Data.</h2>
            <div className="space-y-6 text-text-secondary leading-relaxed">
              <p>
                Pete Currey didn't start as a systematic trader. Like most, he started as a speculator, lured by the high-octane 
                volatility of the London open and the promise of rapid wealth. 
              </p>
              <p>
                "I remember my first £50k week," Pete says. "I thought I was a genius. I bought the watch, I booked the holiday. 
                Two weeks later, I'd given it all back plus 20%. That was the moment I realized the industry isn't built to 
                help you win—it's built to keep you playing until you lose."
              </p>
              <p>
                The next three years were spent in deep study. Not just of price action, but of human psychology and 
                probability theory. Pete stripped away every indicator that didn't have a mathematical edge and began 
                building the precursor to what would eventually become the Drawdown Framework.
              </p>
              <p className="font-bold text-text-primary">
                Drawdown was built out of a necessity for survival. It represents ten years of hard-won experience, 
                distilled into a platform that treats trading like the high-stakes business it is.
              </p>
            </div>
          </div>
          <div className="relative group">
            <div className="aspect-[4/5] bg-background-elevated border border-border-slate overflow-hidden relative">
              <div className="absolute inset-0 bg-[#06070A] bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] opacity-30 group-hover:opacity-40 transition-opacity duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-background-primary via-transparent to-transparent opacity-60" />
            </div>
            <div className="absolute -bottom-6 -right-6 p-8 bg-accent text-background-primary font-mono text-xs uppercase tracking-[0.2em] font-bold">
              EST. 2024 // LDN
            </div>
          </div>
        </div>

        {/* Closing Mission */}
        <div className="bg-background-surface p-12 md:p-32 border border-border-slate mb-24 reveal-text text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-display font-bold uppercase mb-8 italic">"We don't trade for the thrill. We trade for the edge."</h2>
            <p className="text-xl text-text-secondary leading-relaxed mb-12">
              Our commitment is to transparency. Every tool we build, every lesson we teach, and every update we push is 
              focused on one goal: Keeping you in the game long enough to find your consistency.
            </p>
            <p className="font-mono text-accent uppercase tracking-widest text-sm">// PETE CURREY, FOUNDER</p>
          </div>
        </div>
      </div>
    </div>
  );
}
