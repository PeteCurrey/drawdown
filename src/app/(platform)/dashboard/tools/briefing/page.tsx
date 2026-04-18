"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  CloudSun, 
  Target, 
  Calendar, 
  History, 
  BrainCircuit,
  Bell,
  CheckCircle2,
  Mail,
  Clock,
  ExternalLink
} from "lucide-react";

export default function DailyBriefingPage() {
  const [isSubscribed, setIsSubscribed] = useState(true);

  return (
    <div className="pt-32 pb-24 bg-background-primary min-h-screen">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <span className="text-accent font-mono text-[10px] uppercase tracking-widest block mb-4">// MORNING INTEL</span>
            <h1 className="text-4xl md:text-6xl font-display font-bold uppercase mb-4">The Wire.</h1>
            <p className="text-text-secondary max-w-xl">
              Your personalized AI-generated briefing. Markets move while you sleep; we ensure you wake up prepared.
            </p>
          </div>
          <div className="flex items-center gap-4">
             <button 
                onClick={() => setIsSubscribed(!isSubscribed)}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 text-[10px] font-bold uppercase tracking-widest transition-all",
                  isSubscribed ? "bg-accent/10 border border-accent/20 text-accent" : "bg-background-surface border border-border-slate text-text-tertiary"
                )}
             >
                <Mail className="w-4 h-4" />
                {isSubscribed ? "Briefing: 06:30 AM" : "Enable Email Briefing"}
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Briefing Column */}
          <div className="lg:col-span-3 space-y-12">
            
            {/* Intel Card */}
            <div className="p-8 md:p-12 bg-background-surface border border-border-slate relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                  <CloudSun className="w-48 h-48 text-accent" />
               </div>
               
               <div className="relative z-10 space-y-12">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3 text-accent">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs font-mono font-bold uppercase tracking-widest">Monday, 13 April 2026 // 06:42 AM</span>
                     </div>
                     <span className="text-[10px] font-mono text-profit uppercase tracking-widest border border-profit/30 px-2 py-0.5">Markets: Open</span>
                  </div>

                  {/* Section 1: Overnight summary */}
                  <section className="space-y-4">
                     <div className="flex items-center gap-2">
                        <History className="w-4 h-4 text-text-tertiary" />
                        <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-text-tertiary">Overnight Summary</h2>
                     </div>
                     <p className="text-xl text-text-primary leading-relaxed font-sans">
                        US equities closed slightly higher after-hours following a surprising tech bounce. The BoJ signaled a potential policy shift, causing a 120-pip spike in USDJPY. Commodities remain ranging ahead of the London open.
                     </p>
                  </section>

                  {/* Section 2: Watchlist Key Levels */}
                  <section className="space-y-6">
                     <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-text-tertiary" />
                        <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-text-tertiary">Watchlist Key Levels</h2>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          { pair: "GBPUSD", level: "1.2580", action: "Support retested overnight, buyers holding." },
                          { pair: "XAUUSD", level: "2,342.00", action: "Resistance rejection on the 4H. No setup yet." },
                          { pair: "BTCUSD", level: "67,500", action: "Whale accumulation zone. Watch liquidity grab." },
                          { pair: "FTSE 100", level: "7,820", action: "Pivot point for today's UK session." },
                        ].map((item, i) => (
                          <div key={i} className="p-6 bg-background-elevated border border-border-slate/50 space-y-2">
                             <div className="flex justify-between items-center">
                                <span className="text-sm font-display font-bold uppercase">{item.pair}</span>
                                <span className="text-xs font-mono text-accent">{item.level}</span>
                             </div>
                             <p className="text-xs text-text-secondary leading-relaxed">{item.action}</p>
                          </div>
                        ))}
                     </div>
                  </section>

                  {/* Section 3: Today's Focus */}
                  <div className="p-8 bg-accent/5 border border-accent/20 space-y-4">
                     <div className="flex items-center gap-3 text-accent">
                        <BrainCircuit className="w-5 h-5" />
                        <h3 className="text-xs font-mono font-bold uppercase tracking-widest">AI Strategic Focus</h3>
                     </div>
                     <p className="text-lg text-text-primary leading-relaxed font-sans italic">
                       "Today is a high-impact news day for the UK. With the CPI release at 07:00, expect slippage on GBP pairs. If your strategy is breakout-based, consider lowering risk to 0.5% for the morning session."
                     </p>
                  </div>
               </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="space-y-8">
             <div className="p-8 bg-background-surface border border-border-slate space-y-6">
                <div className="flex items-center gap-2">
                   <Calendar className="w-4 h-4 text-text-tertiary" />
                   <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Economic Calendar</h4>
                </div>
                <div className="space-y-4">
                   {[
                     { time: "07:00", event: "UK CPI (YoY)", impact: "High" },
                     { time: "11:00", event: "EU ZEW Sentiment", impact: "Medium" },
                     { time: "13:30", event: "US PPI", impact: "High" },
                   ].map((e, i) => (
                     <div key={i} className="flex justify-between items-center group">
                        <div className="flex flex-col">
                           <span className="text-xs font-mono text-text-primary">{e.time}</span>
                           <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary group-hover:text-text-primary transition-colors">{e.event}</span>
                        </div>
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          e.impact === 'High' ? "bg-loss shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "bg-accent"
                        )} />
                     </div>
                   ))}
                </div>
                <button className="w-full pt-4 text-[10px] font-bold uppercase tracking-widest text-text-tertiary hover:text-accent transition-colors flex items-center justify-center gap-2">
                   View Full Calendar <ExternalLink className="w-3 h-3" />
                </button>
             </div>

             <div className="p-8 border border-border-slate space-y-4">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-secondary">Briefing Archive</h4>
                <div className="space-y-2">
                   {['Oct 12', 'Oct 11', 'Oct 10', 'Oct 09'].map(date => (
                      <div key={date} className="flex items-center justify-between py-2 border-b border-border-slate/30 group cursor-pointer">
                         <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest group-hover:text-text-primary transition-colors">{date} Briefing</span>
                         <CheckCircle2 className="w-3 h-3 text-profit opacity-40 group-hover:opacity-100 transition-opacity" />
                      </div>
                   ))}
                </div>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
