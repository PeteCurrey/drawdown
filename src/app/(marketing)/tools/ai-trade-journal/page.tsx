"use client";

import { Activity, BrainCircuit, BarChart4, ArrowRight, ShieldCheck, CheckCircle2, Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AITradeJournalPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 bg-background-primary overflow-hidden border-b border-border-slate">
        <div className="container mx-auto px-6 relative z-10 text-center max-w-5xl">
          <div className="flex items-center justify-center gap-3 text-accent mb-8">
             <div className="w-8 h-[1px] bg-accent" />
             <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold">EDGE TIER EXCLUSIVE</span>
             <div className="w-8 h-[1px] bg-accent" />
          </div>
          
          <h1 className="  font-display font-extrabold uppercase tracking-tight leading-[0.9] mb-8">
            Data Beats <br />
            <span className="text-text-primary">Dopamine.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-text-secondary leading-relaxed max-w-3xl mx-auto font-medium mb-12">
            Stop lying to yourself in messy spreadsheets. Institutional-grade journaling that automatically identifies your toxic habits and calculates your true statistical edge.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/pricing" className="px-10 py-5 bg-accent text-[#08090D] font-display font-black uppercase tracking-[0.2em] text-sm hover:translate-y-[-2px] transition-all shadow-xl shadow-accent/20">
              Start 14-Day Free Trial
            </Link>
            <a href="#demo" className="px-10 py-5 border border-border-slate hover:border-text-primary text-text-primary font-display font-bold uppercase tracking-[0.2em] text-sm transition-colors flex items-center justify-center gap-2">
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
      <section className="py-24 bg-background-surface border-b border-border-slate overflow-hidden">
         <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               <div className="space-y-6 max-w-xl">
                  <h2 className="text-3xl md:text-5xl font-display font-black uppercase leading-tight mb-6">
                     Spreadsheets Don't Stop <br className="hidden md:block"/>
                     <span className="text-loss">Revenge Trading.</span>
                  </h2>
                  <p className="text-lg text-text-secondary leading-relaxed">
                     A standard journal just records what happened. Our AI Journal actively tells you <span className="text-text-primary font-bold">why it happened.</span>
                  </p>
                  <p className="text-lg text-text-secondary leading-relaxed">
                     It automatically correlates your PnL with your pre-trade emotional state, session time, and setup type to isolate the exact behaviors draining your account.
                  </p>

                  <ul className="space-y-4 pt-6">
                     <li className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-loss/10 flex items-center justify-center shrink-0 mt-1">
                           <Activity className="w-4 h-4 text-loss" />
                        </div>
                        <div>
                           <h4 className="text-text-primary font-bold uppercase tracking-widest text-sm mb-1">Identify Tilt Triggers</h4>
                           <p className="text-xs text-text-tertiary">"You give back 40% of your profits on Fridays after 2 PM."</p>
                        </div>
                     </li>
                     <li className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-profit/10 flex items-center justify-center shrink-0 mt-1">
                           <BarChart4 className="w-4 h-4 text-profit" />
                        </div>
                        <div>
                           <h4 className="text-text-primary font-bold uppercase tracking-widest text-sm mb-1">Isolate The Edge</h4>
                           <p className="text-xs text-text-tertiary">"Your A+ setup has a 68% win rate when holding over 2 hours."</p>
                        </div>
                     </li>
                  </ul>
               </div>

               {/* Mockup Area */}
               <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent blur-3xl opacity-30" />
                  <div className="relative bg-background-primary border border-border-slate p-2 shadow-2xl rounded-sm">
                     <div className="bg-background-surface border border-border-slate/50 p-6 aspect-[4/3] flex flex-col">
                        {/* Mock Header */}
                        <div className="flex justify-between items-center mb-8 pb-4 border-b border-border-slate/50">
                           <div className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Performance Attribution Model</div>
                           <div className="text-xs font-bold text-profit">+12.4R This Month</div>
                        </div>
                        {/* Mock Body */}
                        <div className="flex-grow flex flex-col justify-center items-center opacity-60">
                           <BarChart4 className="w-16 h-16 text-accent mb-4" />
                           <div className="text-sm font-mono text-center text-text-secondary">
                              [ Interactive Equity Curve Mockup Rendering ]<br/>
                              <span className="text-[10px] text-text-tertiary">Live data sync required for full view</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Feature Stack */}
      <section className="py-24 bg-background-primary">
         <div className="container mx-auto px-6">
            <div className="text-center mb-16">
               <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-bold block mb-4">
                 // THE ARCHITECTURE
               </span>
               <h2 className="text-4xl md:text-5xl font-display font-bold uppercase">
                 Engineered For Precision.
               </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="p-8 border border-border-slate bg-background-surface hover:border-accent/30 transition-colors">
                  <Zap className="w-8 h-8 text-accent mb-6" />
                  <h3 className="text-xl font-display font-bold uppercase mb-4 text-text-primary">Automated Import</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                     Syncs with MT4, MT5, cTrader, and major prop firms via read-only API in seconds. No more manual data entry or missed trades.
                  </p>
               </div>
               
               <div className="p-8 border border-border-slate bg-background-surface hover:border-accent/30 transition-colors">
                  <BrainCircuit className="w-8 h-8 text-premium mb-6" />
                  <h3 className="text-xl font-display font-bold uppercase mb-4 text-text-primary">Sentiment Tagging</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                     Log your physiological state before entry. The AI automatically cross-references your emotional state with your win rate.
                  </p>
               </div>

               <div className="p-8 border border-border-slate bg-background-surface hover:border-accent/30 transition-colors">
                  <ShieldCheck className="w-8 h-8 text-profit mb-6" />
                  <h3 className="text-xl font-display font-bold uppercase mb-4 text-text-primary">Performance Attribution</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                     Know exactly which asset class, session time, and setup pays you, and which ones are slowly bleeding your capital.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* Proof / Testimonial */}
      <section className="py-24 bg-background-surface border-y border-border-slate relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
         <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
            <h3 className="text-2xl md:text-4xl font-display italic text-text-primary leading-relaxed mb-8">
               "I realized I was giving back 40% of my profits on Friday afternoons trying to force a weekly quota. The data doesn't lie. I simply stopped trading Fridays and passed my evaluation."
            </h3>
            <div className="flex items-center justify-center gap-4">
               <div className="w-12 h-12 rounded-full bg-border-slate border border-accent/30" />
               <div className="text-left">
                  <p className="text-sm font-bold uppercase text-text-primary tracking-widest">James T.</p>
                  <p className="text-[10px] font-mono text-accent uppercase tracking-widest">Funded Trader ($200k)</p>
               </div>
            </div>
         </div>
      </section>

      {/* Bottom CTA / Pricing Hook */}
      <section className="py-32 bg-background-primary">
         <div className="container mx-auto px-6 text-center max-w-3xl">
            <h2 className="  font-display font-black uppercase tracking-tighter leading-none mb-6">
               Find Your Edge Today.
            </h2>
            <p className="text-xl text-text-secondary leading-relaxed mb-10">
               Access the AI Trade Journal, Market Scanner, and Strategy Backtester. <br />
               <span className="text-text-primary font-bold">Starts at £29/mo. Cheaper than one bad trade.</span>
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
               <Link href="/pricing" className="px-12 py-6 bg-accent text-[#08090D] font-display font-black uppercase tracking-[0.2em] text-sm hover:translate-y-[-2px] transition-all shadow-xl shadow-accent/20">
                  View Edge Tier Pricing
               </Link>
               <Link href="/tools" className="px-12 py-6 border border-border-slate hover:border-text-primary text-text-primary font-display font-bold uppercase tracking-[0.2em] text-sm transition-colors">
                  Explore Other Tools
               </Link>
            </div>
         </div>
      </section>
    </div>
  );
}
