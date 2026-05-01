"use client";

import { ShieldCheck, Crosshair, Target, ChevronRight, Activity, Percent, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const propFirms = [
  {
    id: "ftmo",
    name: "FTMO",
    description: "The industry standard. Best for aggressive day traders.",
    profitTarget: "10%",
    maxDrawdown: "10%",
    dailyDrawdown: "5%",
    timeLimit: "Unlimited",
    payoutSplit: "Up to 90%",
    newsTrading: "Allowed",
    badge: "Most Trusted",
    color: "#00A7E1", // FTMO brand color vibe
    link: "/prop-firms/ftmo-review"
  },
  {
    id: "the5ers",
    name: "The5%ers",
    description: "Aggressive scaling plan. Best for consistent swing traders.",
    profitTarget: "10%",
    maxDrawdown: "10%",
    dailyDrawdown: "5%",
    timeLimit: "Unlimited",
    payoutSplit: "Up to 100%",
    newsTrading: "Allowed",
    badge: "Best Scaling",
    color: "#D4A373", // Premium vibe
    link: "/prop-firms/the5ers-review"
  },
  {
    id: "funding-pips",
    name: "Funding Pips",
    description: "Low entry cost and tight rules. Best for tight risk models.",
    profitTarget: "8%",
    maxDrawdown: "10%",
    dailyDrawdown: "5%",
    timeLimit: "Unlimited",
    payoutSplit: "Up to 90%",
    newsTrading: "Restricted",
    badge: "Budget Friendly",
    color: "#00E676", // Growth vibe
    link: "/prop-firms/funding-pips-review"
  }
];

export default function PropFirmsHubPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-background-primary overflow-hidden border-b border-border-slate">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl space-y-8">
            <div className="flex items-center gap-3 text-accent transition-all duration-700">
               <div className="w-8 h-[1px] bg-accent" />
               <span className="text-[10px] font-mono uppercase tracking-[0.3em]">INSTITUTIONAL CAPITAL</span>
            </div>
            
            <h1 className="  font-display font-extrabold uppercase tracking-tight leading-[0.9]">
              Don't Fund Another <br />
              <span className="text-loss underline decoration-loss/20">Failed Challenge.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-text-secondary leading-relaxed max-w-2xl font-medium">
              Stop gambling evaluation fees. Compare the hardest data on payouts, rules, and drawdown limits to find the firm that fits your exact strategy.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/prop-firms/quiz" className="px-8 py-4 bg-accent text-[#08090D] font-bold uppercase tracking-widest text-xs hover:bg-accent-hover transition-colors flex items-center gap-2">
                Find Your Match <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#comparison" className="px-8 py-4 border border-border-slate hover:border-accent text-text-primary font-bold uppercase tracking-widest text-xs transition-colors">
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

      {/* Trust / Reality Check Module */}
      <section className="py-16 bg-background-surface border-b border-border-slate">
         <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
               <div>
                  <h2 className="text-2xl md:text-4xl font-display font-black uppercase leading-tight mb-6">
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
                  <div className="p-6 bg-background-primary border border-border-slate">
                     <Crosshair className="w-6 h-6 text-loss mb-4" />
                     <div className="text-3xl font-display font-black text-text-primary mb-1">90%</div>
                     <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Failure Rate</p>
                  </div>
                  <div className="p-6 bg-background-primary border border-border-slate">
                     <Target className="w-6 h-6 text-accent mb-4" />
                     <div className="text-3xl font-display font-black text-text-primary mb-1">&lt;1%</div>
                     <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Reach First Payout</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* The Comparison Matrix */}
      <section id="comparison" className="py-24 bg-background-primary">
         <div className="container mx-auto px-6">
            <div className="mb-16">
               <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-bold block mb-4">
                 // THE DATA
               </span>
               <h2 className="text-4xl md:text-5xl font-display font-bold uppercase">
                 Prop Firm Matrix.
               </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {propFirms.map((firm) => (
                  <div key={firm.id} className="bg-background-surface border border-border-slate hover:border-accent/30 transition-all p-8 relative flex flex-col group">
                     {firm.badge && (
                        <div className="absolute top-0 right-0 bg-accent text-[#08090D] px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                           {firm.badge}
                        </div>
                     )}
                     
                      <div className="mb-8">
                        <h3 className="text-3xl font-display font-black uppercase mb-2 text-text-primary">{firm.name}</h3>
                        <p className="text-sm text-text-secondary h-10">{firm.description}</p>
                     </div>

                     <div className="space-y-4 mb-8 flex-grow">
                        <div className="flex justify-between items-center py-2 border-b border-border-slate/50">
                           <span className="text-xs font-mono uppercase text-text-tertiary">Profit Target</span>
                           <span className="text-sm font-bold text-text-primary">{firm.profitTarget}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-border-slate/50">
                           <span className="text-xs font-mono uppercase text-text-tertiary">Max Drawdown</span>
                           <span className="text-sm font-bold text-loss">{firm.maxDrawdown}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-border-slate/50">
                           <span className="text-xs font-mono uppercase text-text-tertiary">Daily Drawdown</span>
                           <span className="text-sm font-bold text-loss">{firm.dailyDrawdown}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-border-slate/50">
                           <span className="text-xs font-mono uppercase text-text-tertiary">News Trading</span>
                           <span className="text-sm font-bold text-text-primary">{firm.newsTrading}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-border-slate/50">
                           <span className="text-xs font-mono uppercase text-text-tertiary">Payout Split</span>
                           <span className="text-sm font-bold text-profit">{firm.payoutSplit}</span>
                        </div>
                     </div>

                     <div className="space-y-3">
                        <Link 
                           href={`/go/${firm.id}`}
                           className="w-full py-4 border border-accent hover:bg-accent hover:text-[#08090D] transition-premium text-center text-[10px] font-bold uppercase tracking-widest block"
                        >
                           Start Challenge
                        </Link>
                        <Link 
                           href={firm.link}
                           className="w-full py-3 text-center text-[10px] font-bold uppercase tracking-widest text-text-secondary hover:text-text-primary transition-colors block"
                        >
                           Read Deep Dive Review
                        </Link>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Low-Ticket Upsell Banner */}
      <section className="py-24 bg-background-surface border-y border-border-slate relative overflow-hidden">
         <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent via-background-primary to-background-primary" />
         
         <div className="container mx-auto px-6 relative z-10 text-center">
            <div className="max-w-3xl mx-auto">
               <ShieldCheck className="w-12 h-12 text-accent mx-auto mb-6" />
               <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter leading-none mb-6">
                  Pass Your Next Evaluation.
               </h2>
               <p className="text-lg text-text-secondary leading-relaxed mb-10">
                  Get the exact <span className="text-text-primary font-bold">£14 Survival Kit</span> our desk uses to manage challenge risk. Includes the Max-Drawdown Calculator Sheet, 30-Day Evaluation Checklist, and "The Tilt Protocol".
               </p>
               <Link href="/store/prop-survival-kit" className="inline-flex items-center gap-4 bg-accent text-[#08090D] px-10 py-5 font-display font-black uppercase tracking-[0.2em] text-sm hover:translate-y-[-2px] transition-all shadow-xl shadow-accent/20">
                  Get The Playbook — £14
               </Link>
            </div>
         </div>
      </section>

      {/* Affiliate Disclosure */}
      <section className="py-12 bg-background-primary">
         <div className="container mx-auto px-6 text-center max-w-4xl">
            <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest leading-relaxed opacity-60">
               Transparency Directive: Drawdown is reader-supported. If you sign up via our links, we may earn a commission. We only list firms with verified payouts and transparent trading conditions. Our rankings are determined by mathematical viability, not affiliate payouts.
            </p>
         </div>
      </section>
    </div>
  );
}
