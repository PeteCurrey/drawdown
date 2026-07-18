"use client";

import { motion } from "framer-motion";
import { TrackPageView } from "@/components/admin/TrackPageView";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const pillars = [
  {
    title: "Honesty",
    desc: "No fake stats. No promises of wealth. Just the hard truth about markets.",
    imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=600&auto=format&fit=crop",
    color: "rgba(99, 102, 241, 0.1)",
    borderColor: "rgba(99, 102, 241, 0.2)",
  },
  {
    title: "Discipline",
    desc: "Process over outcome. We teach you to follow rules, not emotions.",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop",
    color: "rgba(16, 185, 129, 0.08)",
    borderColor: "rgba(16, 185, 129, 0.2)",
  },
  {
    title: "Edge",
    desc: "Tools and data that give you a statistical advantage over time.",
    imageUrl: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?q=80&w=600&auto=format&fit=crop",
    color: "rgba(6, 182, 212, 0.08)",
    borderColor: "rgba(6, 182, 212, 0.2)",
  },
  {
    title: "Survival",
    desc: "The only goal is to stay in the game long enough to win.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop",
    color: "rgba(244, 63, 94, 0.08)",
    borderColor: "rgba(244, 63, 94, 0.2)",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function AboutPage() {
  return (
    <div className="pt-28 pb-24 min-h-screen">
      <TrackPageView path="/about" />
      <div className="max-w-7xl mx-auto px-6">

        {/* Manifesto */}
        <motion.div
          className="max-w-3xl mb-24"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="text-[11px] font-sans font-bold text-text-tertiary uppercase tracking-widest block mb-5">
            // OUR MANIFESTO
          </span>
          <h1 className="text-4xl md:text-6xl font-sans font-extrabold tracking-tight text-text-primary leading-tight mb-10">
            Trading is hard.<br />
            Guru culture<br />
            is <span className="text-profit">toxic.</span>
          </h1>

          <div className="space-y-6 text-base text-text-tertiary leading-relaxed font-sans max-w-2xl">
            <p>
              We founded Drawdown because the industry is broken. Every day, thousands of new traders
              are lured in with promises of easy money, Lamborghinis, and "secret" signals.
            </p>
            <blockquote className="border-l-2 border-border-slate/50 pl-6 py-3 bg-background-elevated/40 rounded-r-[12px] italic text-text-secondary">
              "The truth is that 90% of retail traders lose money. They lose because they lack
              discipline, lack risk management, and are trying to trade someone else's strategy
              without understanding the why."
            </blockquote>
            <p>
              Drawdown is the antidote. We don't sell dreams. We don't sell hope.
              We sell education, AI-driven tools, and a framework built for sustainability.
              A drawdown isn't a failure — it's part of the process. We teach you how to survive it.
            </p>
          </div>
        </motion.div>

        {/* Pillars */}
        <div className="mb-24 pt-12 border-t border-border-slate/50">
          <span className="text-[11px] font-sans font-bold text-text-tertiary uppercase tracking-widest block mb-10">
            // OUR FOUR PILLARS
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-20px" }}
                variants={cardVariants}
                className="relative border border-border-slate/50 rounded-[14px] p-6 overflow-hidden group cursor-default transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)]"
                style={{ backgroundColor: "white", borderColor: undefined }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = pillar.borderColor;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "";
                }}
              >
                {/* BG image reveal */}
                <div className="absolute inset-0 pointer-events-none">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out opacity-[0.05] group-hover:opacity-[0.12] scale-105 group-hover:scale-100"
                    style={{ backgroundImage: `url(${pillar.imageUrl})` }}
                  />
                </div>
                <div className="relative z-10">
                  <h3 className="text-xl font-sans font-extrabold tracking-tight text-text-primary mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-text-tertiary leading-relaxed font-sans">{pillar.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Founder Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24 pt-12 border-t border-border-slate/50">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="text-[11px] font-sans font-bold text-text-tertiary uppercase tracking-widest block mb-5">
              // THE FOUNDER
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-extrabold tracking-tight text-text-primary mb-8 leading-snug">
              The Man Behind the Data.
            </h2>
            <div className="space-y-5 text-sm text-text-tertiary leading-relaxed font-sans">
              <p>
                Pete Currey didn't start as a systematic trader. Like most, he started as a speculator,
                lured by the high-octane volatility of the London open and the promise of rapid wealth.
              </p>
              <p>
                "I've spent two decades watching retail traders get chewed up by the markets, mostly because they were sold a lie by a fake guru," Pete says. "Trading isn't about getting rich quick. It's a high-stakes business of probabilities and risk management."
              </p>
              <p>
                The next three years were spent in deep study. Not just of price action, but of human
                psychology and probability theory. Pete stripped away every indicator that didn't have a
                mathematical edge and began building the precursor to what would eventually become the
                Drawdown Framework.
              </p>
              <p className="font-semibold text-text-secondary">
                Drawdown was built out of a necessity for survival. It represents ten years of hard-won
                experience, distilled into a platform that treats trading like the high-stakes business it is.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="relative"
          >
            <div className="aspect-[4/5] border border-border-slate/50 rounded-[14px] overflow-hidden relative group">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop)",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white font-sans font-bold text-base">Pete Currey</p>
                <p className="text-white/70 font-sans text-xs mt-1">Founder, Drawdown Trading · Chesterfield, UK</p>
              </div>
            </div>
            {/* Accent badge */}
            <div className="absolute -bottom-5 -right-5 bg-mkt-ink text-white px-5 py-3 rounded-[10px] text-[10px] font-sans font-bold uppercase tracking-widest">
              CHESTERFIELD // UK
            </div>
          </motion.div>
        </div>

        {/* Closing Mission */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-background-elevated/40 border border-border-slate/50 rounded-[14px] p-12 md:p-16 text-center relative overflow-hidden"
        >
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h2 className="text-2xl md:text-3xl font-sans font-extrabold tracking-tight text-text-primary">
              "We don't trade for the thrill.<br />We trade for the edge."
            </h2>
            <p className="text-sm text-text-tertiary leading-relaxed font-sans">
              Our commitment is to transparency. Every tool we build, every lesson we teach, and every
              update we push is focused on one goal: Keeping you in the game long enough to find your
              consistency.
            </p>
            <p className="text-[10px] font-sans font-bold text-text-tertiary uppercase tracking-widest">
              // Pete Currey, Founder
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-lg font-sans font-semibold text-sm text-white transition-colors duration-150"
              style={{ backgroundColor: "#0A0A0A" }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#3A3A3A")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#0A0A0A")}
            >
              Join the Platform <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
