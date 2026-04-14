"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { BadgeGrid, allBadges } from "@/components/badges/BadgeGrid";
import { 
  Play, 
  ArrowUpRight, 
  TrendingUp, 
  Calendar,
  AlertCircle
} from "lucide-react";

export default function DashboardPage() {
  const [greeting, setGreeting] = useState("Morning");
  const [name] = useState("Pete"); // Mock user name

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Morning");
    else if (hour < 18) setGreeting("Afternoon");
    else setGreeting("Evening");
  }, []);

  return (
    <div className="space-y-10 stagger-children">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold uppercase mb-2">{greeting}, {name}.</h1>
        <p className="text-text-secondary font-mono text-xs uppercase tracking-widest">// Market Status: London Open</p>
      </div>

      {/* Daily Briefing Card */}
      <div className="p-8 bg-background-elevated border border-border-slate relative group overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
        <div className="flex flex-col md:flex-row justify-between gap-8 relative z-10">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2 text-accent">
              <AlertCircle className="w-4 h-4" />
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest">Daily Briefing</span>
            </div>
            <h3 className="text-2xl font-display font-bold uppercase">UK CPI data came in below expectations.</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Inflation cooled more than forecast this morning, putting pressure on GBP. 
              Keep an eye on the 1.2680 level for potential support. No high-impact US news until 1:30 PM.
            </p>
          </div>
          <button className="self-end md:self-center px-8 py-3 border border-border-slate hover:border-accent hover:text-accent transition-colors text-xs font-bold uppercase tracking-widest">
            Full Analysis
          </button>
        </div>
        <TrendingUp className="absolute -bottom-10 -right-10 w-64 h-64 text-accent/5 -rotate-12 pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Continue Learning */}
        <div className="lg:col-span-2 space-y-6">
          <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Continue Learning</h4>
          <div className="p-8 bg-background-surface border border-border-slate flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-48 aspect-video bg-background-elevated flex items-center justify-center border border-border-slate group cursor-pointer">
              <Play className="w-8 h-8 text-accent group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex-grow space-y-4">
              <div>
                <span className="text-[10px] font-mono text-accent uppercase tracking-widest">Phase 2: Technical analysis</span>
                <h5 className="text-xl font-display font-bold uppercase mt-1">Reading Candlestick Shadows</h5>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono uppercase text-text-tertiary">
                  <span>Module Progress</span>
                  <span>65%</span>
                </div>
                <div className="h-1 bg-background-elevated w-full">
                  <div className="h-full bg-accent w-[65%]" />
                </div>
              </div>
              <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-primary hover:text-accent transition-colors">
                Resume Lesson <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Recent Journal */}
        <div className="space-y-6">
          <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Recent Trades</h4>
          <div className="p-8 bg-background-surface border border-border-slate space-y-6">
            {[
              { pair: "GBPUSD", type: "Long", pnl: "+£450.00", status: "win" },
              { pair: "BTCUSD", type: "Short", pnl: "-£120.50", status: "loss" },
              { pair: "EURJPY", type: "Long", pnl: "+£890.12", status: "win" },
            ].map((trade, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-border-slate/50 last:border-0">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest">{trade.pair}</p>
                  <p className="text-[10px] font-mono text-text-tertiary uppercase">{trade.type}</p>
                </div>
                <p className={cn(
                  "text-xs font-mono font-bold",
                  trade.status === 'win' ? 'text-profit' : 'text-loss'
                )}>
                  {trade.pnl}
                </p>
              </div>
            ))}
            <button className="w-full py-3 bg-background-elevated border border-border-slate text-[10px] font-bold uppercase tracking-widest hover:border-text-primary transition-colors">
              View Journal
            </button>
          </div>
        </div>
      </div>

      {/* Account Stats */}
      <div className="space-y-6">
        <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Account Stats</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Win Rate", value: "64.2%", color: "text-profit" },
            { label: "Max Drawdown", value: "-12.5%", color: "text-loss" },
            { label: "Total Profit", value: "£4,231.10", color: "text-profit" },
            { label: "Current Streak", value: "3 Wins", color: "text-profit" },
          ].map((stat, i) => (
            <div key={i} className="p-6 bg-background-surface border border-border-slate text-center">
              <p className="text-[8px] font-mono uppercase tracking-widest text-text-tertiary mb-2">{stat.label}</p>
              <p className={cn("text-lg font-display font-bold uppercase", stat.color)}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="space-y-6">
        <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Achievements</h4>
        <BadgeGrid badges={allBadges} />
      </div>
    </div>
  );
}
