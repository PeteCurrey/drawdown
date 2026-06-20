"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ShieldAlert, Download, Lock, Zap, ChevronDown, Check } from "lucide-react";
import Link from "next/link";
import { PropSurvivalFloatingWidget } from "@/components/ui/PropSurvivalFloatingWidget";

export default function PropSurvivalKitPage() {
  const [includeBump, setIncludeBump] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/store/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: "prop-survival-kit", includeBump }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Checkout failed. Please try again.");
      }
    } catch {
      alert("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const backgroundCandles = [
    { x: 40, open: 220, close: 200, high: 230, low: 190 },
    { x: 80, open: 200, close: 210, high: 215, low: 195 },
    { x: 120, open: 210, close: 190, high: 220, low: 180 },
    { x: 160, open: 190, close: 170, high: 200, low: 160 },
    { x: 200, open: 170, close: 180, high: 185, low: 165 },
    { x: 240, open: 180, close: 150, high: 190, low: 140 },
    { x: 280, open: 150, close: 130, high: 160, low: 120 },
    { x: 320, open: 130, close: 140, high: 145, low: 125 },
    { x: 360, open: 140, close: 110, high: 150, low: 100 },
    { x: 400, open: 110, close: 90, high: 120, low: 80 },
    { x: 440, open: 90, close: 100, high: 105, low: 85 },
    { x: 480, open: 100, close: 80, high: 110, low: 70 },
    { x: 520, open: 80, close: 70, high: 90, low: 60 },
    { x: 560, open: 70, close: 95, high: 105, low: 65 },
    { x: 600, open: 95, close: 85, high: 100, low: 80 },
    { x: 640, open: 85, close: 110, high: 120, low: 80 },
    { x: 680, open: 110, close: 100, high: 115, low: 95 },
    { x: 720, open: 100, close: 125, high: 135, low: 95 },
    { x: 760, open: 125, close: 115, high: 130, low: 110 },
    { x: 800, open: 115, close: 140, high: 150, low: 110 },
    { x: 840, open: 140, close: 130, high: 145, low: 125 },
    { x: 880, open: 130, close: 160, high: 170, low: 125 },
    { x: 920, open: 160, close: 150, high: 165, low: 145 },
    { x: 960, open: 150, close: 180, high: 190, low: 140 },
    { x: 1000, open: 180, close: 170, high: 185, low: 165 },
    { x: 1040, open: 170, close: 200, high: 210, low: 160 },
    { x: 1080, open: 200, close: 190, high: 205, low: 185 },
    { x: 1120, open: 190, close: 220, high: 230, low: 180 },
    { x: 1160, open: 220, close: 210, high: 225, low: 200 }
  ];

  const maPeriod = 5;
  const longMaPeriod = 12;

  const maPathPoints = backgroundCandles.map((c, idx) => {
    const start = Math.max(0, idx - maPeriod + 1);
    const subset = backgroundCandles.slice(start, idx + 1);
    const sum = subset.reduce((acc, curr) => acc + (curr.open + curr.close) / 2, 0);
    const avg = sum / subset.length;
    return `${c.x},${avg}`;
  });

  const longMaPathPoints = backgroundCandles.map((c, idx) => {
    const start = Math.max(0, idx - longMaPeriod + 1);
    const subset = backgroundCandles.slice(start, idx + 1);
    const sum = subset.reduce((acc, curr) => acc + (curr.open + curr.close) / 2, 0);
    const avg = sum / subset.length;
    return `${c.x},${avg}`;
  });

  const maPathD = `M ${maPathPoints.join(" L ")}`;
  const longMaPathD = `M ${longMaPathPoints.join(" L ")}`;

  return (
    <div className="flex flex-col bg-[#0A0A0A] text-white min-h-screen selection:bg-[#C8F135] selection:text-black font-sans overflow-hidden">
      
      {/* SECTION 1 — HERO (full viewport, 100vh) */}
      <section className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden bg-[#0A0A0A] border-b border-white/5 px-6">
        
        {/* Background candle chart pattern with low opacity */}
        <div className="absolute inset-0 z-0 opacity-[0.045] pointer-events-none select-none flex items-center justify-center overflow-hidden">
          <svg className="w-full h-[70%] min-h-[350px]" viewBox="0 0 1200 300" fill="none" preserveAspectRatio="none">
            <path 
              d={maPathD} 
              fill="none" 
              stroke="#ffffff" 
              strokeWidth="1.5" 
              strokeDasharray="4 4" 
            />
            <path 
              d={longMaPathD} 
              fill="none" 
              stroke="#ffffff" 
              strokeWidth="1.5" 
            />
            {backgroundCandles.map((c, i) => {
              const isBullish = c.close < c.open;
              const color = isBullish ? "#22c55e" : "#ef4444";
              const bodyY = Math.min(c.open, c.close);
              const bodyHeight = Math.max(Math.abs(c.open - c.close), 2);
              return (
                <g key={i}>
                  <line 
                    x1={c.x} 
                    y1={c.high} 
                    x2={c.x} 
                    y2={c.low} 
                    stroke={color} 
                    strokeWidth="1.5" 
                  />
                  <rect 
                    x={c.x - 5} 
                    y={bodyY} 
                    width="10" 
                    height={bodyHeight} 
                    fill={color} 
                    rx="1"
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Fade masks for visual blending */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0A0A0A] to-transparent pointer-events-none z-0" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0A0A0A] to-transparent pointer-events-none z-0" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none z-0" />

        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
          {/* Eyebrow */}
          <span className="text-xs tracking-widest uppercase opacity-40 font-mono font-semibold">
            // PROP FIRM SURVIVAL
          </span>

          {/* Heading */}
          <h1 className="text-5xl lg:text-7xl font-display font-bold leading-[1.15] tracking-tight mt-6 max-w-4xl">
            Most traders don't fail the challenge.<br className="hidden md:inline" />
            They fail because nobody told them<br className="hidden md:inline" />
            the real rules.
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl lg:text-2xl opacity-60 max-w-2xl mt-8 font-sans leading-relaxed">
            The Drawdown Prop Firm Survival Kit is what we wish existed when we started. Every rule decoded. Every trap mapped. Every psychological spiral named.
          </p>

          {/* Stat Strip */}
          <div className="flex gap-x-12 gap-y-6 justify-center flex-wrap mt-16 max-w-4xl mx-auto border-t border-white/5 pt-12">
            {[
              { val: "73%", label: "of challenges fail before day 5" },
              { val: "£1,200", label: "average lost to failed evaluations" },
              { val: "5%", label: "daily drawdown — no margin for error" },
              { val: "1", label: "mistake away from account closure" },
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center text-center px-4">
                <span className="text-white text-3xl font-mono font-bold">{stat.val}</span>
                <span className="text-[10px] opacity-40 uppercase tracking-widest mt-2 font-mono max-w-[200px] leading-snug">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div 
          onClick={() => document.getElementById("problem-section")?.scrollIntoView({ behavior: "smooth" })}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer select-none opacity-30 hover:opacity-100 transition-opacity z-10"
        >
          <span className="text-[9px] uppercase tracking-[0.3em] font-mono">Scroll</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </div>

      </section>

      {/* SECTION 2 — THE PROBLEM (py-24, max-w-5xl mx-auto px-6) */}
      <section id="problem-section" className="py-24 max-w-5xl mx-auto px-6 relative z-10 scroll-mt-12">
        <div className="space-y-4">
          <span className="text-xs tracking-widest uppercase opacity-40 font-mono font-semibold">
            // THE REAL PROBLEM
          </span>
          <h2 className="text-4xl lg:text-5xl font-display font-bold max-w-3xl leading-tight">
            The prop firm industry is designed around your failure.
          </h2>
        </div>

        {/* Three-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {[
            {
              num: "01",
              title: "The Rules Are Intentionally Complex",
              body: "Prop firms publish their rules in pages of dense legal copy. Daily drawdown. Max drawdown. Trailing drawdown. Equity-based vs balance-based. Intraday vs end-of-day. Each firm calculates it differently. Miss the distinction and your account closes on a day you thought you were winning."
            },
            {
              num: "02",
              title: "The Psychology Is Never Mentioned",
              body: "You can understand every rule perfectly and still blow the account. The pressure of trading funded capital — even simulated — triggers decisions you'd never make on a demo. Revenge trading after a loss. Overholding a winner. Cutting profits early out of fear. Nobody warns you. Nobody prepares you."
            },
            {
              num: "03",
              title: "The Firms Know Most of You Will Fail",
              body: "The evaluation fee is the product. A firm that passes 90% of challenges isn't running a sustainable business. They need failure rates to stay high. That isn't a conspiracy — it's a business model. Understanding that changes how you approach the whole thing."
            }
          ].map((card, idx) => (
            <div 
              key={idx} 
              className="bg-white/3 rounded-2xl border border-white/8 p-8 flex flex-col justify-between hover:border-white/15 transition-all duration-350"
            >
              <div>
                <div className="text-5xl font-mono text-white/10 mb-6 select-none font-bold">
                  {card.num}
                </div>
                <h3 className="text-lg font-bold mb-3 tracking-tight">{card.title}</h3>
                <p className="text-sm opacity-60 leading-relaxed font-sans">{card.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pull Quote */}
        <div className="mt-16 border-l-4 border-[#C8F135] pl-8 max-w-3xl">
          <p className="text-xl italic opacity-70 leading-relaxed">
            "I've watched traders with genuinely good strategies lose £3,000 in evaluation fees because they didn't understand a single rule about how their drawdown was being calculated."
          </p>
          <p className="text-sm opacity-45 mt-4 font-mono font-medium">
            — Pete Currey, Founder — Drawdown Trading
          </p>
        </div>
      </section>

      {/* SECTION 3 — PETE'S CREDIBILITY (py-24, full bleed with subtle bg texture: bg-white/[0.02]) */}
      <section className="py-24 w-full bg-white/[0.02] border-t border-b border-white/5 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <span className="text-xs tracking-widest uppercase opacity-40 font-mono font-semibold block mb-4">
            // WHO BUILT THIS AND WHY
          </span>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column - Text Content */}
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-display font-bold leading-tight">
                This was built by someone who trades, not someone who sells courses.
              </h2>
              
              <div className="text-base opacity-70 leading-relaxed space-y-4 font-sans">
                <p>
                  I'm Pete Currey. I built Drawdown because the trading education industry is full of people who profit from your confusion. The Prop Firm Survival Kit isn't a repurposed YouTube script. It's the document I compiled after watching traders in our community repeat the same expensive mistakes — and after making several of them myself.
                </p>
                <p>
                  I've run my own businesses for over 20 years. I've deployed and managed capital under pressure. I understand what it means to operate with real stakes. When I approached prop trading, I treated it the same way I'd approach any high-stakes professional environment: understand the system first, execute second.
                </p>
                <p>
                  The Survival Kit is the system. Every rule decoded. Every psychological trap named. Every pre-trade checklist stress-tested against real evaluation conditions. If you go through a prop firm challenge without it, you're paying for a lesson that's already been written.
                </p>
              </div>

              {/* Credential Strip */}
              <div className="flex flex-wrap gap-3 pt-4 select-none">
                {[
                  "20+ Years in Business",
                  "Founder, Drawdown Trading",
                  "UK-Based, FX & Indices",
                  "Phase 1–6 Curriculum Author",
                  "Chesterfield, Derbyshire"
                ].map((pill, idx) => (
                  <span 
                    key={idx} 
                    className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs font-mono text-white/60"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column - Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { val: "6 Phases", desc: "of structured curriculum covering psychology to AI" },
                { val: "60+ Modules", desc: "built and verified against live market conditions" },
                { val: "FCA Only", desc: "brokers — we don't recommend unregulated firms" },
                { val: "Zero", desc: "pay-to-rank partnerships — all recommendations are honest" }
              ].map((card, idx) => (
                <div 
                  key={idx} 
                  className="bg-white/3 rounded-xl border border-white/8 p-6 flex flex-col justify-between hover:border-[#C8F135]/20 transition-all duration-300"
                >
                  <div>
                    <div className="text-3xl font-mono font-bold text-[#C8F135]">
                      {card.val}
                    </div>
                    <p className="text-sm opacity-50 mt-2 font-sans leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4 — WHAT KILLS CHALLENGES (py-24, max-w-5xl mx-auto px-6) */}
      <section className="py-24 max-w-5xl mx-auto px-6 relative z-10">
        <span className="text-xs tracking-widest uppercase opacity-40 font-mono font-semibold block mb-4">
          // THE KILL SHOTS
        </span>
        <h2 className="text-4xl font-display font-bold mb-4">
          The seven things that end funded accounts.
        </h2>
        <p className="text-base opacity-50 mb-12 font-sans max-w-2xl">
          These aren't opinions. They're the most common documented reasons for prop firm account breaches. Every single one is covered in the Survival Kit.
        </p>

        {/* Numbered Row Cards */}
        <div className="space-y-4">
          {[
            {
              num: "01",
              title: "Misunderstanding your drawdown type",
              body: "Intraday trailing vs end-of-day vs static — three entirely different risk models. Miss which one applies to your account and you'll breach it on a day you thought you were performing well.",
              tag: "Chapter 2 — Rule Decoder"
            },
            {
              num: "02",
              title: "Trading too large after a good start",
              body: "Early profit creates a dangerous illusion of safety. Traders increase size as confidence grows, then a single volatile session wipes the buffer and breaches the max drawdown limit. The rules don't care about your previous days.",
              tag: "Chapter 4 — Position Protocol"
            },
            {
              num: "03",
              title: "Holding through high-impact news events",
              body: "A 50-pip spike during NFP or a central bank announcement can close a funded account in seconds. This isn't a risk management failure — it's a rule violation. Most firms prohibit holding through specific events. Most traders don't check.",
              tag: "Chapter 3 — Event Rules"
            },
            {
              num: "04",
              title: "The revenge trade spiral after a loss",
              body: "Losing 1.5% of your account on a bad trade doesn't end the challenge. Revenge trading the next hour and losing another 3% does. The psychological mechanics of this spiral are identical across thousands of failed accounts. It has a name. It has a fix.",
              tag: "Chapter 5 — Psychology"
            },
            {
              num: "05",
              title: "Ignoring the daily drawdown reset",
              body: "Daily drawdown calculations reset at midnight UTC at most firms. But open positions at midnight affect the next day's calculation. A winning trade that's in profit at 23:59 and reverses at 00:01 can breach the new day's daily limit before you've even woken up.",
              tag: "Chapter 2 — Rule Decoder"
            },
            {
              num: "06",
              title: "Starting the funded phase with the same risk as the evaluation",
              body: "The evaluation is for passing. The funded phase is for keeping. Most traders who pass their challenge breach their funded account within 30 days because they treat them identically. They are not the same environment.",
              tag: "Chapter 6 — Funded Protocol"
            },
            {
              num: "07",
              title: "Treating the challenge like a demo account",
              body: "A demo account has no stakes. A funded evaluation has real money on the line — your evaluation fee, at minimum. The psychological response to those two environments is completely different, and that gap kills more accounts than any rule ever does.",
              tag: "Chapter 5 — Psychology"
            }
          ].map((item, idx) => (
            <div 
              key={idx}
              className="flex flex-col md:flex-row items-start md:items-center gap-6 bg-white/[0.02] rounded-xl border border-white/6 p-6 hover:border-white/15 hover:bg-white/[0.04] transition duration-300"
            >
              <div className="text-4xl font-mono font-bold text-white/10 w-16 shrink-0 select-none">
                {item.num}
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="text-lg font-semibold tracking-tight">{item.title}</h4>
                <p className="text-sm opacity-60 leading-relaxed font-sans">{item.body}</p>
              </div>
              <div className="mt-3 md:mt-0 lg:flex shrink-0 ml-auto">
                <span className="bg-[#C8F135]/10 text-[#C8F135] border border-[#C8F135]/20 rounded-full px-3 py-1 text-xs font-mono font-semibold">
                  {item.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5 — WHAT'S IN THE KIT (py-24, bg-white/[0.02] full bleed, border-y border-white/5) */}
      <section className="py-24 w-full bg-white/[0.02] border-t border-b border-white/5 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <span className="text-xs tracking-widest uppercase opacity-40 font-mono font-semibold block text-center mb-4">
            // WHAT YOU GET
          </span>
          <h2 className="text-4xl font-display font-bold text-center mb-4">
            The Prop Firm Survival Kit — Contents
          </h2>
          <p className="text-center opacity-50 mb-16 max-w-2xl mx-auto font-sans leading-relaxed text-sm md:text-base">
            Not a checklist. Not a PDF with stock photos. A proper working document — built to be used before, during and after your challenge.
          </p>

          {/* Chapters Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              {
                ch: "CHAPTER 1",
                title: "The Prop Firm Landscape",
                desc: "How prop firms actually work, how they make money, and why understanding the business model changes your strategy.",
                bullets: [
                  "How evaluation fees fund the firm's model",
                  "The real pass rate across major firms",
                  "UK-specific prop firms vs international: key differences",
                  "How to read a firm's small print before paying"
                ]
              },
              {
                ch: "CHAPTER 2",
                title: "The Rule Decoder",
                desc: "Every drawdown mechanic explained with worked examples. Static, trailing, intraday, end-of-day — in plain English.",
                bullets: [
                  "Daily vs max drawdown: what resets and when",
                  "Intraday trailing vs EOD: same trade, different outcomes",
                  "Balance-based vs equity-based: the calculation that catches traders out",
                  "Overnight and weekend risk across different firm models"
                ]
              },
              {
                ch: "CHAPTER 3",
                title: "The Event Minefield",
                desc: "High-impact news events, forbidden trading windows, and the specific scenarios most firm rules prohibit.",
                bullets: [
                  "NFP, CPI, central bank decisions — the sessions to avoid",
                  "How to check your firm's specific news trading rules",
                  "Hedging restrictions: what counts and what doesn't",
                  "Weekend gap risk and how firms handle it"
                ]
              },
              {
                ch: "CHAPTER 4",
                title: "The Position Protocol",
                desc: "A pre-trade sizing system built specifically for prop firm constraints — not generic trading advice.",
                bullets: [
                  "The 0.5% personal daily limit rule: why it exists",
                  "Position sizing based on drawdown buffer, not account size",
                  "When to reduce size (the trigger levels to set before you trade)",
                  "The scaling protocol for when the funded phase begins"
                ]
              },
              {
                ch: "CHAPTER 5",
                title: "The Psychology Files",
                desc: "The specific mental patterns that kill funded accounts — named, mapped, and pre-interrupted.",
                bullets: [
                  "The revenge spiral: anatomy and circuit breaker",
                  "The overconfidence trap after a strong run",
                  "Why funded trading feels different and how to neutralise it",
                  "The daily stop protocol: your exit from the screens"
                ]
              },
              {
                ch: "CHAPTER 6",
                title: "The Funded Phase Protocol",
                desc: "What changes after you pass — and why most traders who breach do so in the first 30 days of funded trading.",
                bullets: [
                  "Why the funded phase demands a different mindset to the evaluation",
                  "The first 10-trade rule for new funded accounts",
                  "Scaling: when to request account increases and when not to",
                  "Payout strategy: protecting capital while extracting profit"
                ]
              }
            ].map((chapter, idx) => (
              <div 
                key={idx}
                className="bg-[#0A0A0A] rounded-2xl border border-white/8 p-8 hover:border-[#C8F135]/35 transition-colors duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-mono text-[#C8F135]/80 font-bold select-none tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C8F135] inline-block" />
                    {chapter.ch}
                  </div>
                  <h3 className="text-xl font-semibold mt-4 mb-3 tracking-tight">{chapter.title}</h3>
                  <p className="text-sm opacity-60 leading-relaxed font-sans mb-6">{chapter.desc}</p>
                </div>
                
                <ul className="space-y-2 border-t border-white/5 pt-4">
                  {chapter.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2.5 text-xs text-white/70 font-sans">
                      <span className="text-[#C8F135] font-bold shrink-0 mt-0.5">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Pure CSS Document Preview Mockup */}
          <div className="mt-16 text-center">
            <div className="bg-[#111111] rounded-2xl border border-white/10 p-8 max-w-md mx-auto shadow-2xl relative text-left">
              {/* Top Bar with window control dots */}
              <div className="flex items-center gap-1.5 border-b border-white/5 pb-4 mb-6 select-none">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
              </div>

              {/* Title inside document */}
              <div className="font-mono text-xs text-white/40 tracking-wider font-semibold uppercase">
                PROP FIRM SURVIVAL KIT
              </div>
              <div className="text-[10px] text-white/20 mt-1 font-mono tracking-wide">
                Drawdown Trading — Pete Currey
              </div>

              {/* Fake Content Lines */}
              <div className="space-y-3 mt-8">
                <div className="w-full h-1.5 rounded bg-white/10" />
                <div className="w-4/5 h-1.5 rounded bg-white/10" />
                
                {/* Chartreuse highlighted section */}
                <div className="w-full h-1.5 rounded bg-white/10 relative">
                  <div className="absolute inset-y-0 left-0 w-3/5 bg-[#C8F135]/40 rounded" />
                </div>
                
                <div className="w-3/4 h-1.5 rounded bg-white/10" />
                <div className="w-full h-1.5 rounded bg-white/10" />
                <div className="w-2/3 h-1.5 rounded bg-white/10" />
              </div>

              <div className="space-y-3 mt-6">
                <div className="w-full h-1.5 rounded bg-white/5" />
                <div className="w-5/6 h-1.5 rounded bg-white/5" />
                <div className="w-1/2 h-1.5 rounded bg-white/5" />
              </div>
            </div>
            <p className="text-[11px] opacity-30 mt-4 font-mono uppercase tracking-widest">
              Formatted PDF — optimised for print and screen
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 6 — THE PURCHASE SECTION */}
      <section id="purchase-section" className="py-24 max-w-4xl mx-auto px-6 relative z-10 scroll-mt-8">
        <div className="text-center flex flex-col items-center">
          <span className="text-xs tracking-widest uppercase opacity-40 font-mono font-semibold">
            // GET THE KIT
          </span>
          <h2 className="text-4xl font-display font-bold mt-4 leading-tight">
            One purchase. Use it on every challenge you ever take.
          </h2>
          <p className="text-base opacity-50 mt-4 mb-12 max-w-xl font-sans leading-relaxed">
            A one-time download. No subscription. No upsell. The Drawdown Prop Firm Survival Kit — yours to keep.
          </p>

          {/* Stripe Purchase Box */}
          <div className="bg-[#111111] border border-white/10 p-8 text-left shadow-2xl rounded-2xl text-white w-full max-w-lg">
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-white/10">
              <div>
                <h4 className="text-lg font-bold uppercase tracking-tight text-white">
                  Prop Challenge Survival Kit
                </h4>
                <p className="text-xs text-white/50 font-sans mt-0.5">
                  Digital PDF & Google Sheets Templates
                </p>
              </div>
              <div className="text-3xl font-mono font-bold text-[#C8F135]">£14</div>
            </div>

            {/* Bump Offer */}
            <label className="bg-white/5 border border-white/10 p-5 flex gap-4 items-start cursor-pointer hover:bg-white/10 transition-all duration-300 rounded-xl select-none">
              <input
                type="checkbox"
                checked={includeBump}
                onChange={(e) => setIncludeBump(e.target.checked)}
                className="mt-1 w-5 h-5 accent-[#C8F135] cursor-pointer"
              />
              <div className="flex-1">
                <p className="text-sm font-bold uppercase text-[#C8F135] flex items-center gap-1.5 tracking-wide">
                  <Zap className="w-4 h-4 fill-[#C8F135]" /> Add 30 Days of Drawdown Edge
                </p>
                <p className="text-xs text-white/60 mt-1 leading-relaxed font-sans">
                  Yes! Give me 30 days full access to the AI Trade Journal and Market Scanner to execute my challenge flawlessly. (Normally £29/mo, add today for just £19).
                </p>
              </div>
            </label>

            {/* Complete Purchase Button */}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full mt-8 py-5 bg-[#C8F135] text-black font-sans font-black uppercase tracking-[0.2em] text-sm hover:bg-[#d4ff3a] transition-colors disabled:opacity-60 cursor-pointer shadow-xl rounded-xl flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              {loading ? "Redirecting to Checkout..." : `Complete Purchase — £${includeBump ? '33' : '14'}`}
            </button>
            
            <p className="text-[10px] font-mono uppercase tracking-wider text-white/40 flex items-center gap-2 mt-4 justify-center">
              <Lock className="w-3.5 h-3.5 text-[#C8F135]" /> Secure Checkout via Stripe
            </p>
          </div>

          <p className="text-xs text-white/40 leading-relaxed max-w-md mx-auto mt-8 font-sans">
            <strong className="text-white">100% No-BS 14-Day Guarantee.</strong> If you apply these frameworks and still feel unprepared for your challenge, email us. We will refund your £14 immediately. No questions asked.
          </p>

          {/* Trust Strip */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-16 pt-8 border-t border-white/5 w-full select-none">
            {[
              "✓ Instant PDF download",
              "✓ One-time payment — no subscription",
              "✓ Works for all major prop firms",
              "✓ UK-focused, FCA-aware context",
              "✓ Built by a trader, not a marketer"
            ].map((trust, idx) => (
              <span key={idx} className="text-xs opacity-40 font-mono text-white flex items-center gap-1">
                {trust}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 — OBJECTION HANDLING / FAQ (py-24, max-w-3xl mx-auto px-6) */}
      <section className="py-24 max-w-3xl mx-auto px-6 relative z-10">
        <span className="text-xs tracking-widest uppercase opacity-40 font-mono font-semibold block mb-4">
          // HONEST ANSWERS
        </span>
        <h2 className="text-3xl font-display font-bold mb-12">
          Questions we'd ask if we were you.
        </h2>

        {/* FAQ Items */}
        <div className="space-y-1">
          {[
            {
              q: "Is this just a repackaged checklist?",
              a: "No. It's 6 structured chapters with worked examples, specific rule breakdowns by drawdown type, a pre-trade sizing protocol, a psychology framework, and a funded phase transition guide. A checklist is one page. This is a working document."
            },
            {
              q: "Does it work for all prop firms?",
              a: "The core frameworks — drawdown mechanics, position protocol, psychology, funded transition — apply universally. Chapter 1 includes a section on how to apply the Rule Decoder to any specific firm's documentation. We also call out the most common UK-relevant firms by name where the rules differ materially."
            },
            {
              q: "I've already done a challenge. Is it still useful?",
              a: "Probably more useful. Most traders who've failed a challenge failed for one of the seven reasons in Section 4. Reading it after a breach is cheaper than repeating the same mistake on a second evaluation fee."
            },
            {
              q: "Why isn't this free?",
              a: "The research, testing and structure behind this took months. Free content gets skimmed. Paid content gets used. If you're spending £100+ on an evaluation fee, the cost of this is a rounding error — and if it prevents one breach, it's returned its value many times over."
            },
            {
              q: "Can I get a refund if it's not what I expected?",
              a: "Contact us within 7 days. If the document doesn't match what's described on this page, we'll refund it without argument. We've written this page specifically to avoid misaligned expectations — you know exactly what you're getting."
            },
            {
              q: "Is this relevant for UK traders specifically?",
              a: "Yes. The curriculum and framing is built around UK spread betting and CFD environments, FCA-regulated broker context, and the UK tax treatment of prop firm income. International traders will still find the core frameworks useful, but the UK context is deliberate."
            },
            {
              q: "Is Pete actually a trader or just an educator?",
              a: "Both. Pete built this curriculum because good trading education in the UK is either too expensive, too vague, or too agenda-driven. He trades GBP/USD and indices personally. The curriculum, including this Kit, is built from that experience — not sourced from other people's content."
            }
          ].map((faq, idx) => (
            <div key={idx} className="border-b border-white/8 py-6">
              <h3 className="text-base font-semibold mb-3 tracking-tight">{faq.q}</h3>
              <p className="text-sm opacity-60 leading-relaxed font-sans">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 8 — BOTTOM CTA (py-24, bg-[#C8F135]/5 border-t border-[#C8F135]/20) */}
      <section className="py-24 w-full bg-[#C8F135]/5 border-t border-[#C8F135]/20 relative z-10 text-center px-6">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4 tracking-tight leading-tight">
            Stop funding their business model with failed evaluations.
          </h2>
          <p className="text-base opacity-60 mb-8 max-w-lg font-sans leading-relaxed">
            One document. Built by someone who's done the work. Everything the prop firm doesn't put in their welcome email.
          </p>

          {/* Two CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
            <button 
              onClick={() => document.getElementById("purchase-section")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-4 bg-[#C8F135] text-black font-semibold rounded-lg hover:bg-[#d4ff3a] transition shadow-md font-sans text-sm tracking-wide"
            >
              Get the Survival Kit →
            </button>
            <Link 
              href="/courses"
              className="px-8 py-4 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/5 transition font-sans text-sm tracking-wide"
            >
              Explore the Drawdown Curriculum →
            </Link>
          </div>

          {/* Risk Note */}
          <p className="text-[10px] opacity-35 max-w-md mx-auto mt-8 font-mono uppercase tracking-wider leading-relaxed">
            Prop firm trading involves significant financial risk. This document is for educational purposes. Past challenge results are not indicative of future performance.
          </p>
        </div>
      </section>

      <PropSurvivalFloatingWidget />
    </div>
  );
}
