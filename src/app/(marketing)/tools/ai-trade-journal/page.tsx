"use client";

import { Activity, BrainCircuit, BarChart4, ArrowRight, ShieldCheck, CheckCircle2, Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AITradeJournalPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-28 pb-24 bg-white overflow-hidden border-b border-mkt-bd">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center max-w-5xl">
          <div className="flex items-center justify-center gap-3 text-accent mb-8">
             <div className="w-8 h-[1px] bg-accent" />
             <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold">EDGE TIER EXCLUSIVE</span>
             <div className="w-8 h-[1px] bg-accent" />
          </div>
          
          <h1 className="  font-sans font-extrabold uppercase tracking-tight leading-[0.9] mb-8">
            Data Beats <br />
            <span className="text-mkt-ink">Dopamine.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-mkt-i2 leading-relaxed max-w-3xl mx-auto font-medium mb-12">
            Stop lying to yourself in messy spreadsheets. Institutional-grade journaling that automatically identifies your toxic habits and calculates your true statistical edge.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/pricing" className="px-10 py-5 bg-accent text-[#08090D] font-sans font-black uppercase tracking-[0.2em] text-sm hover:translate-y-[-2px] transition-all shadow-xl shadow-accent/20">
              Start 14-Day Free Trial
            </Link>
            <a href="#demo" className="px-10 py-5 border border-mkt-bd hover:border-text-primary text-mkt-ink font-sans font-bold uppercase tracking-[0.2em] text-sm transition-colors flex items-center justify-center gap-2">
              Watch Walkthrough
            </a>
          </div>
        </div>

        {/* Hero Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl opacity-5 pointer-events-none">
           <BrainCircuit className="w-full h-full text-accent" />
        </div>
      </section>

      {/* UI Showcase / Agitation */}
      <section className="py-24 bg-white border-b border-mkt-bd overflow-hidden">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               <div className="space-y-6 max-w-xl">
                  <h2 className="text-3xl md:text-5xl font-sans font-black uppercase leading-tight mb-6">
                     Spreadsheets Don't Stop <br className="hidden md:block"/>
                     <span className="text-red-500">Revenge Trading.</span>
                  </h2>
                  <p className="text-lg text-mkt-i2 leading-relaxed">
                     A standard journal just records what happened. Our AI Journal actively tells you <span className="text-mkt-ink font-bold">why it happened.</span>
                  </p>
                  <p className="text-lg text-mkt-i2 leading-relaxed">
                     It automatically correlates your PnL with your pre-trade emotional state, session time, and setup type to isolate the exact behaviors draining your account.
                  </p>

                  <ul className="space-y-4 pt-6">
                     <li className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-loss/10 flex items-center justify-center shrink-0 mt-1">
                           <Activity className="w-4 h-4 text-red-500" />
                        </div>
                        <div>
                           <h4 className="text-mkt-ink font-bold uppercase tracking-widest text-sm mb-1">Identify Tilt Triggers</h4>
                           <p className="text-xs text-mkt-i4">"You give back 40% of your profits on Fridays after 2 PM."</p>
                        </div>
                     </li>
                     <li className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-profit/10 flex items-center justify-center shrink-0 mt-1">
                           <BarChart4 className="w-4 h-4 text-mkt-grn" />
                        </div>
                        <div>
                           <h4 className="text-mkt-ink font-bold uppercase tracking-widest text-sm mb-1">Isolate The Edge</h4>
                           <p className="text-xs text-mkt-i4">"Your A+ setup has a 68% win rate when holding over 2 hours."</p>
                        </div>
                     </li>
                  </ul>
               </div>

               {/* Mockup Area */}
               <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent blur-3xl opacity-30" />
                  <div className="relative bg-white border border-mkt-bd p-2 shadow-2xl rounded-sm">
                     <div className="bg-white border border-mkt-bd/50 p-6 aspect-[4/3] flex flex-col">
                        {/* Mock Header */}
                        <div className="flex justify-between items-center mb-8 pb-4 border-b border-mkt-bd/50">
                           <div className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4">Performance Attribution Model</div>
                           <div className="text-xs font-bold text-mkt-grn">+12.4R This Month</div>
                        </div>
                        {/* Mock Body */}
                        <div className="flex-grow flex flex-col justify-center items-center opacity-60">
                           <BarChart4 className="w-16 h-16 text-accent mb-4" />
                           <div className="text-sm font-mono text-center text-mkt-i2">
                              [ Interactive Equity Curve Mockup Rendering ]<br/>
                              <span className="text-[10px] text-mkt-i4">Live data sync required for full view</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Feature Stack */}
      <section className="py-24 bg-white">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
               <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-bold block mb-4">
                 // THE ARCHITECTURE
               </span>
               <h2 className="text-4xl md:text-5xl font-sans font-bold uppercase">
                 Engineered For Precision.
               </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="p-8 border border-mkt-bd bg-white hover:border-mkt-bds/30 transition-colors">
                  <Zap className="w-8 h-8 text-accent mb-6" />
                  <h3 className="text-xl font-sans font-bold uppercase mb-4 text-mkt-ink">Automated Import</h3>
                  <p className="text-sm text-mkt-i2 leading-relaxed">
                     Syncs with MT4, MT5, cTrader, and major prop firms via read-only API in seconds. No more manual data entry or missed trades.
                  </p>
               </div>
               
               <div className="p-8 border border-mkt-bd bg-white hover:border-mkt-bds/30 transition-colors">
                  <BrainCircuit className="w-8 h-8 text-premium mb-6" />
                  <h3 className="text-xl font-sans font-bold uppercase mb-4 text-mkt-ink">Sentiment Tagging</h3>
                  <p className="text-sm text-mkt-i2 leading-relaxed">
                     Log your physiological state before entry. The AI automatically cross-references your emotional state with your win rate.
                  </p>
               </div>

               <div className="p-8 border border-mkt-bd bg-white hover:border-mkt-bds/30 transition-colors">
                  <ShieldCheck className="w-8 h-8 text-mkt-grn mb-6" />
                  <h3 className="text-xl font-sans font-bold uppercase mb-4 text-mkt-ink">Performance Attribution</h3>
                  <p className="text-sm text-mkt-i2 leading-relaxed">
                     Know exactly which asset class, session time, and setup pays you, and which ones are slowly bleeding your capital.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* Proof / Testimonial */}
      <section className="py-24 bg-white border-y border-mkt-bd relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
         <div className="max-w-7xl mx-auto px-6 relative z-10 text-center max-w-4xl">
            <h3 className="text-2xl md:text-4xl font-sans italic text-mkt-ink leading-relaxed mb-8">
               "I realized I was giving back 40% of my profits on Friday afternoons trying to force a weekly quota. The data doesn't lie. I simply stopped trading Fridays and passed my evaluation."
            </h3>
            <div className="flex items-center justify-center gap-4">
               <div className="w-12 h-12 rounded-full bg-border-slate border border-mkt-bd/30" />
               <div className="text-left">
                  <p className="text-sm font-bold uppercase text-mkt-ink tracking-widest">James T.</p>
                  <p className="text-[10px] font-mono text-accent uppercase tracking-widest">Funded Trader ($200k)</p>
               </div>
            </div>
         </div>
      </section>

      {/* Bottom CTA / Pricing Hook */}
      <section className="py-32 bg-white">
         <div className="max-w-7xl mx-auto px-6 text-center max-w-3xl">
            <h2 className="  font-sans font-black uppercase tracking-tighter leading-none mb-6">
               Find Your Edge Today.
            </h2>
            <p className="text-xl text-mkt-i2 leading-relaxed mb-10">
               Access the AI Trade Journal, Market Scanner, and Strategy Backtester. <br />
               <span className="text-mkt-ink font-bold">Starts at £29/mo. Cheaper than one bad trade.</span>
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
               <Link href="/pricing" className="px-12 py-6 bg-accent text-[#08090D] font-sans font-black uppercase tracking-[0.2em] text-sm hover:translate-y-[-2px] transition-all shadow-xl shadow-accent/20">
                  View Edge Tier Pricing
               </Link>
               <Link href="/tools" className="px-12 py-6 border border-mkt-bd hover:border-text-primary text-mkt-ink font-sans font-bold uppercase tracking-[0.2em] text-sm transition-colors">
                  Explore Other Tools
               </Link>
            </div>
         </div>
      </section>
    </div>
  );
}
