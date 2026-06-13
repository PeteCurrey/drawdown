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
      <section className="relative pt-32 pb-20 bg-white overflow-hidden border-b border-mkt-bd">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-8">
            <span className="text-[11px] font-sans font-bold text-mkt-i4 uppercase tracking-widest block">
              // INSTITUTIONAL CAPITAL
            </span>
            
            <h1 className="text-4xl md:text-6xl font-sans font-extrabold tracking-tight text-mkt-ink leading-tight">
              Don't Fund Another<br />
              <span className="text-red-500">Failed Challenge.</span>
            </h1>
            
            <p className="text-base text-mkt-i3 leading-relaxed max-w-2xl font-sans">
              Stop gambling evaluation fees. Compare the hardest data on payouts, rules, and drawdown limits to find the firm that fits your exact strategy.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/prop-firms/quiz" className="px-7 py-3 rounded-lg bg-mkt-ink text-white font-sans font-semibold text-sm hover:bg-mkt-i2 transition-colors flex items-center gap-2">
                Find Your Match <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#comparison" className="px-7 py-3 rounded-lg border border-mkt-bd hover:border-mkt-bds text-mkt-ink font-sans font-semibold text-sm transition-colors">
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
      <section className="py-16 bg-white border-b border-mkt-bd">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
               <div>
                  <h2 className="text-2xl md:text-4xl font-sans font-black uppercase leading-tight mb-6">
                     The Math <br className="hidden md:block"/> Is Against You.
                  </h2>
                  <p className="text-lg text-mkt-i2 leading-relaxed">
                     <span className="text-mkt-ink font-bold">90% of traders fail their evaluations</span> because they trade the firm's rules, not their own edge. They over-leverage to hit arbitrary profit targets and blow their accounts on day three.
                  </p>
                  <p className="text-lg text-mkt-i2 leading-relaxed mt-4">
                     We break down the math, the latency, and the hidden restrictions so you can survive the drawdown and secure the funding.
                  </p>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-white border border-mkt-bd rounded-[12px] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all">
                     <Crosshair className="w-6 h-6 text-red-500 mb-4" />
                     <div className="text-3xl font-sans font-extrabold text-mkt-ink mb-1 tracking-tight">90%</div>
                     <p className="text-[10px] font-sans uppercase tracking-widest text-mkt-i4">Failure Rate</p>
                  </div>
                  <div className="p-6 bg-white border border-mkt-bd rounded-[12px] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all">
                     <Target className="w-6 h-6 text-mkt-grn mb-4" />
                     <div className="text-3xl font-sans font-extrabold text-mkt-ink mb-1 tracking-tight">&lt;1%</div>
                     <p className="text-[10px] font-sans uppercase tracking-widest text-mkt-i4">Reach First Payout</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* The Comparison Matrix */}
      <section id="comparison" className="py-24 bg-white">
         <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16">
               <span className="text-[11px] font-sans font-bold text-mkt-i4 uppercase tracking-widest block mb-4">
                 // THE DATA
               </span>
               <h2 className="text-3xl md:text-4xl font-sans font-extrabold tracking-tight text-mkt-ink">
                 Prop Firm Comparison.
               </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {propFirms.map((firm) => (
                  <div key={firm.id} className="bg-white border border-mkt-bd rounded-[14px] hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 transition-all duration-300 p-8 relative flex flex-col group">
                     {firm.badge && (
                        <div className="absolute top-0 right-0 bg-mkt-ink text-white px-3 py-1.5 rounded-bl-[10px] rounded-tr-[14px] text-[9px] font-sans font-bold uppercase tracking-widest">
                           {firm.badge}
                        </div>
                     )}
                     
                      <div className="mb-8">
                        <h3 className="text-3xl font-sans font-black uppercase mb-2 text-mkt-ink">{firm.name}</h3>
                        <p className="text-sm text-mkt-i2 h-10">{firm.description}</p>
                     </div>

                     <div className="space-y-4 mb-8 flex-grow">
                        <div className="flex justify-between items-center py-2 border-b border-mkt-bd/50">
                           <span className="text-xs font-mono uppercase text-mkt-i4">Profit Target</span>
                           <span className="text-sm font-bold text-mkt-ink">{firm.profitTarget}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-mkt-bd/50">
                           <span className="text-xs font-mono uppercase text-mkt-i4">Max Drawdown</span>
                           <span className="text-sm font-bold text-red-500">{firm.maxDrawdown}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-mkt-bd/50">
                           <span className="text-xs font-mono uppercase text-mkt-i4">Daily Drawdown</span>
                           <span className="text-sm font-bold text-red-500">{firm.dailyDrawdown}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-mkt-bd/50">
                           <span className="text-xs font-mono uppercase text-mkt-i4">News Trading</span>
                           <span className="text-sm font-bold text-mkt-ink">{firm.newsTrading}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-mkt-bd/50">
                           <span className="text-xs font-mono uppercase text-mkt-i4">Payout Split</span>
                           <span className="text-sm font-bold text-mkt-grn">{firm.payoutSplit}</span>
                        </div>
                     </div>

                     <div className="space-y-3">
                        <Link 
                           href={`/go/${firm.id}`}
                           className="w-full py-3 rounded-lg bg-mkt-ink text-white hover:bg-mkt-i2 transition-colors text-center text-xs font-sans font-semibold block"
                        >
                           Start Challenge
                        </Link>
                        <Link 
                           href={firm.link}
                           className="w-full py-3 rounded-lg border border-mkt-bd hover:border-mkt-bds text-mkt-i2 hover:text-mkt-ink transition-colors text-center text-xs font-sans font-semibold block"
                        >
                           Read Full Review
                        </Link>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Low-Ticket Upsell Banner */}
      <section className="py-24 bg-white border-y border-mkt-bd relative overflow-hidden">
         <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent via-background-primary to-background-primary" />
         
         <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <div className="max-w-3xl mx-auto">
               <ShieldCheck className="w-12 h-12 text-mkt-grn mx-auto mb-6" />
               <h2 className="text-3xl md:text-4xl font-sans font-extrabold tracking-tight text-mkt-ink mb-6">
                  Pass Your Next Evaluation.
               </h2>
               <p className="text-base text-mkt-i3 leading-relaxed font-sans mb-10">
                  Get the exact <span className="text-mkt-ink font-bold">£14 Survival Kit</span> our desk uses to manage challenge risk. Includes the Max-Drawdown Calculator Sheet, 30-Day Evaluation Checklist, and "The Tilt Protocol".
               </p>
               <Link href="/store/prop-survival-kit" className="inline-flex items-center gap-3 px-8 py-3.5 rounded-lg bg-mkt-ink text-white font-sans font-semibold text-sm hover:bg-mkt-i2 transition-colors">
                  Get The Playbook — £14
               </Link>
            </div>
         </div>
      </section>

      {/* Affiliate Disclosure */}
      <section className="py-12 bg-white">
         <div className="max-w-7xl mx-auto px-6 text-center max-w-4xl">
            <p className="text-[10px] font-mono text-mkt-i4 uppercase tracking-widest leading-relaxed opacity-60">
               Transparency Directive: Drawdown is reader-supported. If you sign up via our links, we may earn a commission. We only list firms with verified payouts and transparent trading conditions. Our rankings are determined by mathematical viability, not affiliate payouts.
            </p>
         </div>
      </section>
    </div>
  );
}
