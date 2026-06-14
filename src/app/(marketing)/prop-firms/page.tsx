"use client";

import { useState } from "react";
import { ShieldCheck, Crosshair, Target, ChevronRight, Activity, Percent, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SectionA, SectionB, SectionD, SectionE, SectionF } from "@/components/prop-firms/PropFirmSections";

const propFirms = [
  {
    id: "ftmo",
    name: "FTMO",
    description: "The industry standard. Best for aggressive day traders.",
    bgUrl: "/images/prop-firms/ftmo-bg.png",
    profitTarget: "10%",
    maxDrawdown: "10%",
    dailyDrawdown: "5%",
    timeLimit: "Unlimited",
    payoutSplit: "Up to 90%",
    newsTrading: "Allowed",
    badge: "Most Trusted",
    color: "#00A7E1",
    link: "/prop-firms/ftmo"
  },
  {
    id: "the5ers",
    name: "The5%ers",
    description: "Aggressive scaling plan. Best for consistent swing traders.",
    bgUrl: "/images/prop-firms/the5ers-bg.png",
    profitTarget: "10%",
    maxDrawdown: "10%",
    dailyDrawdown: "5%",
    timeLimit: "Unlimited",
    payoutSplit: "Up to 100%",
    newsTrading: "Allowed",
    badge: "Best Scaling",
    color: "#D4A373",
    link: "/prop-firms/the5ers"
  },
  {
    id: "funding-pips",
    name: "Funding Pips",
    description: "Low entry cost and tight rules. Best for tight risk models.",
    bgUrl: "/images/prop-firms/funding-pips-bg.png",
    profitTarget: "8%",
    maxDrawdown: "10%",
    dailyDrawdown: "5%",
    timeLimit: "Unlimited",
    payoutSplit: "Up to 90%",
    newsTrading: "Restricted",
    badge: "Budget Friendly",
    color: "#00E676",
    link: "/prop-firms/funding-pips"
  },
  {
    id: "fxify",
    name: "FXIFY",
    description: "High leverage and fast scaling. Best for technical traders.",
    bgUrl: "/images/prop-firms/fxify-bg.png",
    profitTarget: "10%",
    maxDrawdown: "10%",
    dailyDrawdown: "5%",
    timeLimit: "Unlimited",
    payoutSplit: "Up to 90%",
    newsTrading: "Allowed",
    badge: "High Leverage",
    color: "#00B4D8",
    link: "/prop-firms/fxify"
  },
  {
    id: "e8-funding",
    name: "E8 Funding",
    description: "Customizable drawdowns. Best for tailored risk management.",
    bgUrl: "/images/prop-firms/e8-bg.png",
    profitTarget: "8%",
    maxDrawdown: "8%",
    dailyDrawdown: "5%",
    timeLimit: "Unlimited",
    payoutSplit: "Up to 80%",
    newsTrading: "Restricted",
    badge: "Flexible Rules",
    color: "#F4A261",
    link: "/prop-firms/e8-funding"
  },
  {
    id: "lux-trading",
    name: "Lux Trading Firm",
    description: "Real capital from day one. Best for institutional pathways.",
    bgUrl: "/images/prop-firms/lux-bg.png",
    profitTarget: "6%",
    maxDrawdown: "6%",
    dailyDrawdown: "None",
    timeLimit: "Unlimited",
    payoutSplit: "75%",
    newsTrading: "Allowed",
    badge: "Real Capital",
    color: "#E9C46A",
    link: "/prop-firms/lux-trading"
  }
];

export default function PropFirmsHubPage() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 min-h-screen flex flex-col justify-center overflow-hidden border-b border-border-slate/50">
        <div className="w-full max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-8">
            <span className="text-[11px] font-sans font-bold text-text-tertiary uppercase tracking-widest block">
              // INSTITUTIONAL CAPITAL
            </span>
            
            <h1 className="text-4xl md:text-6xl font-sans font-extrabold tracking-tight text-text-primary leading-tight">
              Don't Fund Another<br />
              <span className="text-red-500">Failed Challenge.</span>
            </h1>
            
            <p className="text-base text-text-tertiary leading-relaxed max-w-2xl font-sans">
              Stop gambling evaluation fees. Compare the hardest data on payouts, rules, and drawdown limits to find the firm that fits your exact strategy.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/prop-firms/quiz" className="px-7 py-3 rounded-lg bg-mkt-ink text-white font-sans font-semibold text-sm hover:bg-mkt-i2 transition-colors flex items-center gap-2">
                Find Your Match <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#comparison" className="px-7 py-3 rounded-lg border border-border-slate/50 hover:border-border-slate text-text-primary font-sans font-semibold text-sm transition-colors">
                View Comparison Matrix
              </a>
            </div>
          </div>
        </div>

        {/* Aesthetic Background Pattern */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none overflow-hidden">
           <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_10%,var(--color-profit)_10.5%,transparent_11%)] [background-size:2vw_100%]" />
        </div>
      </section>

      <SectionA />

      {/* Trust / Reality Check Module */}
      <section className="py-16 border-b border-border-slate/50">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
               <div>
                  <h2 className="text-2xl md:text-4xl font-sans font-black uppercase leading-tight mb-6">
                     The Math <br className="hidden md:block"/> Is Against You.
                  </h2>
                  <p className="text-lg text-text-secondary leading-relaxed">
                     <span className="text-text-primary font-bold">90% of traders fail their evaluations</span> because they trade the firm's rules, not their own edge. They over-leverage to hit arbitrary profit targets and blow their accounts on day three.
                  </p>
                  <p className="text-lg text-text-secondary leading-relaxed mt-4">
                     We break down the math, the latency, and the hidden restrictions so you can survive the drawdown and secure the funding.
                  </p>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-background-surface/40 backdrop-blur-md border border-border-slate/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5 rounded-[12px] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all">
                     <Crosshair className="w-6 h-6 text-red-500 mb-4" />
                     <div className="text-3xl font-sans font-extrabold text-text-primary mb-1 tracking-tight">90%</div>
                     <p className="text-[10px] font-sans uppercase tracking-widest text-text-tertiary">Failure Rate</p>
                  </div>
                  <div className="p-6 bg-background-surface/40 backdrop-blur-md border border-border-slate/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5 rounded-[12px] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all">
                     <Target className="w-6 h-6 text-profit mb-4" />
                     <div className="text-3xl font-sans font-extrabold text-text-primary mb-1 tracking-tight">&lt;1%</div>
                     <p className="text-[10px] font-sans uppercase tracking-widest text-text-tertiary">Reach First Payout</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* The Comparison Matrix */}
      <section id="comparison" className="py-24">
         <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16">
               <span className="text-[11px] font-sans font-bold text-text-tertiary uppercase tracking-widest block mb-4">
                 // THE DATA
               </span>
               <h2 className="text-3xl md:text-4xl font-sans font-extrabold tracking-tight text-text-primary">
                 Prop Firm Comparison.
               </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {propFirms.map((firm, index) => (
                  <div 
                    key={firm.id} 
                    className="bg-background-surface/40 backdrop-blur-md border border-border-slate/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5 rounded-[14px] transition-all duration-300 p-8 relative flex flex-col group overflow-hidden"
                    style={{
                      transform: hoveredIdx === index ? "translateY(-2px)" : "translateY(0px)",
                      boxShadow: hoveredIdx === index ? "0 8px 32px rgba(0,0,0,0.07)" : "none",
                      borderColor: hoveredIdx === index ? "rgba(0,0,0,0.14)" : undefined
                    }}
                    onMouseEnter={() => setHoveredIdx(index)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  >
                     {/* Premium Background Reveal */}
                     <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                       {firm.bgUrl && (
                         <div
                           className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out"
                           style={{
                             backgroundImage: `url(${firm.bgUrl})`,
                             opacity: hoveredIdx === index ? 0.08 : 0.02,
                             transform: hoveredIdx === index ? "scale(1.05)" : "scale(1)",
                           }}
                         />
                       )}
                       <div 
                         className="absolute inset-0 transition-opacity duration-700 ease-out"
                         style={{
                           background: `linear-gradient(to top right, transparent, ${firm.color})`,
                           opacity: hoveredIdx === index ? 0.08 : 0
                         }}
                       />
                     </div>

                     {firm.badge && (
                        <div className="absolute top-0 right-0 bg-mkt-ink text-white px-3 py-1.5 rounded-bl-[10px] rounded-tr-[14px] text-[9px] font-sans font-bold uppercase tracking-widest z-10">
                           {firm.badge}
                        </div>
                     )}
                     
                      <div className="mb-8 relative z-10">
                        <h3 className="text-3xl font-sans font-black uppercase mb-2 text-text-primary">{firm.name}</h3>
                        <p className="text-sm text-text-secondary h-10">{firm.description}</p>
                     </div>

                     <div className="space-y-4 mb-8 flex-grow relative z-10">
                        <div className="flex justify-between items-center py-2 border-b border-border-slate/30">
                           <span className="text-xs font-mono uppercase text-text-tertiary">Profit Target</span>
                           <span className="text-sm font-bold text-text-primary">{firm.profitTarget}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-border-slate/30">
                           <span className="text-xs font-mono uppercase text-text-tertiary">Max Drawdown</span>
                           <span className="text-sm font-bold text-red-500">{firm.maxDrawdown}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-border-slate/30">
                           <span className="text-xs font-mono uppercase text-text-tertiary">Daily Drawdown</span>
                           <span className="text-sm font-bold text-red-500">{firm.dailyDrawdown}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-border-slate/30">
                           <span className="text-xs font-mono uppercase text-text-tertiary">News Trading</span>
                           <span className="text-sm font-bold text-text-primary">{firm.newsTrading}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-border-slate/30">
                           <span className="text-xs font-mono uppercase text-text-tertiary">Payout Split</span>
                           <span className="text-sm font-bold text-profit">{firm.payoutSplit}</span>
                        </div>
                     </div>

                     <div className="space-y-3 relative z-10">
                        <Link 
                           href={`/go/${firm.id}`}
                           className="w-full py-3 rounded-lg bg-mkt-ink text-white hover:bg-mkt-i2 transition-colors text-center text-xs font-sans font-semibold block"
                        >
                           Start Challenge
                        </Link>
                        <Link 
                           href={firm.link}
                           className="w-full py-3 rounded-lg border border-border-slate/50 hover:border-border-slate text-text-secondary hover:text-text-primary transition-colors text-center text-xs font-sans font-semibold block"
                        >
                           Read Full Review
                        </Link>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      <SectionB />
      <SectionD />
      <SectionE />
      <SectionF />

      {/* Low-Ticket Upsell Banner */}
      <section className="py-24 border-y border-border-slate/50 relative overflow-hidden">
         <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent via-background-primary to-background-primary" />
         
         <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <div className="max-w-3xl mx-auto">
               <ShieldCheck className="w-12 h-12 text-profit mx-auto mb-6" />
               <h2 className="text-3xl md:text-4xl font-sans font-extrabold tracking-tight text-text-primary mb-6">
                  Pass Your Next Evaluation.
               </h2>
               <p className="text-base text-text-tertiary leading-relaxed font-sans mb-10">
                  Get the exact <span className="text-text-primary font-bold">£14 Survival Kit</span> our desk uses to manage challenge risk. Includes the Max-Drawdown Calculator Sheet, 30-Day Evaluation Checklist, and "The Tilt Protocol".
               </p>
               <Link href="/store/prop-survival-kit" className="inline-flex items-center gap-3 px-8 py-3.5 rounded-lg bg-mkt-ink text-white font-sans font-semibold text-sm hover:bg-mkt-i2 transition-colors">
                  Get The Playbook — £14
               </Link>
            </div>
         </div>
      </section>

      {/* Affiliate Disclosure */}
      <section className="py-12">
         <div className="max-w-7xl mx-auto px-6 text-center max-w-4xl">
            <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest leading-relaxed opacity-60">
               Transparency Directive: Drawdown is reader-supported. If you sign up via our links, we may earn a commission. We only list firms with verified payouts and transparent trading conditions. Our rankings are determined by mathematical viability, not affiliate payouts.
            </p>
         </div>
      </section>
    </div>
  );
}
