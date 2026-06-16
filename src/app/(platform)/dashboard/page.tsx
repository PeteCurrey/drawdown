"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { BadgeGrid, allBadges } from "@/components/badges/BadgeGrid";
import { 
  Play, 
  ArrowUpRight, 
  TrendingUp, 
  AlertCircle,
  Zap
} from "lucide-react";
import { BrokerWidget } from "@/components/market/BrokerWidget";
import { NewsWidget } from "@/components/market/NewsWidget";
import { MarketConsensus } from "@/components/market/MarketConsensus";
import { EmotionalPnL } from "@/components/dashboard/EmotionalPnL";
import { WatchlistManager } from "@/components/dashboard/WatchlistManager";
import { AlertCentre } from "@/components/dashboard/AlertCentre";
import { PsychologyCoach } from "@/components/dashboard/PsychologyCoach";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

// Mock data for the coach demonstration
const mockAccount = {
  id: "acc_1",
  user_id: "user_1",
  prop_firm_id: "ftmo",
  account_name: "FTMO Challenge",
  account_size: 100000,
  current_balance: 98500,
  daily_loss_limit: 5000,
  daily_loss_type: 'balance_based' as const,
  max_drawdown_limit: 10000,
  max_drawdown_type: 'static' as const,
  days_traded: 12,
  account_phase: 'challenge_phase1' as const,
  account_status: 'active' as const,
  currency: "USD",
  platform: 'mt5' as const,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const mockTrades = [
  {
    id: "t1",
    account_id: "acc_1",
    user_id: "user_1",
    instrument: "GBPUSD",
    direction: 'long' as const,
    lot_size: 5.0,
    entry_price: 1.2650,
    exit_price: 1.2680,
    entry_time: new Date().toISOString(),
    exit_time: new Date().toISOString(),
    net_pnl: 1500,
  },
  {
    id: "t2",
    account_id: "acc_1",
    user_id: "user_1",
    instrument: "GBPUSD",
    direction: 'long' as const,
    lot_size: 10.0, // Aggressive increase detected!
    entry_price: 1.2680,
    exit_price: 1.2640,
    entry_time: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    exit_time: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    net_pnl: -4000, // Large loss detected!
  }
];

export default function DashboardPage() {
  const [greeting, setGreeting] = useState("Morning");
  const [name] = useState("Pete"); // Mock user name

  const [latestBrief, setLatestBrief] = useState<any>(null);
  const [loadingBrief, setLoadingBrief] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Morning");
    else if (hour < 18) setGreeting("Afternoon");
    else setGreeting("Evening");

    const fetchBrief = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('daily_briefs')
          .select('*')
          .order('brief_date', { ascending: false })
          .limit(1)
          .single();
        
        if (data) setLatestBrief(data);
      } catch (err) {
        // Silently fail, use fallback
      } finally {
        setLoadingBrief(false);
      }
    };

    fetchBrief();
  }, []);

  return (
    <div className="space-y-10 stagger-children">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold uppercase mb-2 text-text-primary">{greeting}, {name}.</h1>
        <p className="text-text-tertiary font-mono text-xs uppercase tracking-widest">// Market Status: London Open</p>
      </div>

      {/* Daily Briefing Card ("The Wire") */}
      <div className="p-8 bg-background-surface/40 border border-border-slate/50 rounded-[20px] relative group overflow-hidden transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:-translate-y-0.5">
        <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
        <div className="flex flex-col md:flex-row justify-between gap-8 relative z-10">
          <div className="space-y-4 max-w-2xl text-left">
            <div className="flex items-center gap-2 text-accent">
              <AlertCircle className="w-4 h-4" />
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest">The Wire — Latest Briefing</span>
            </div>
            
            {loadingBrief ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-6 bg-white/5 w-3/4 rounded-sm" />
                <div className="h-4 bg-white/5 w-full rounded-sm" />
              </div>
            ) : latestBrief ? (
              <>
                <h3 className="text-2xl font-display font-bold uppercase leading-tight text-text-primary">
                  {latestBrief.content_html.split('\n')[0].replace('#', '').replace('*', '').trim() || "Market Update"}
                </h3>
                <div className="text-text-tertiary text-sm leading-relaxed prose prose-sm max-w-none line-clamp-3">
                  {latestBrief.content_text.replace(/#/g, '').slice(0, 200)}...
                </div>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-display font-bold uppercase text-text-primary">UK CPI data came in below expectations.</h3>
                <p className="text-text-tertiary text-sm leading-relaxed">
                  Inflation cooled more than forecast this morning, putting pressure on GBP. 
                  Keep an eye on the 1.2680 level for potential support. No high-impact US news until 1:30 PM.
                </p>
              </>
            )}
          </div>
          <Link 
            href="/dashboard/news"
            className="self-start md:self-center px-8 py-3 bg-mkt-ink text-white hover:bg-mkt-i2 rounded-lg transition-colors text-xs font-bold uppercase tracking-widest shrink-0"
          >
            {latestBrief ? "Read Full Brief" : "Full Analysis"}
          </Link>
        </div>
        <TrendingUp className="absolute -bottom-10 -right-10 w-64 h-64 text-accent/5 -rotate-12 pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Learning */}
        <div className="lg:col-span-2 space-y-10">
          <div className="space-y-6">
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4">Continue Learning</h4>
            <div className="p-8 bg-background-surface/40 border border-border-slate/50 rounded-[20px] flex flex-col md:flex-row gap-8 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:-translate-y-0.5">
              <div className="w-full md:w-48 aspect-video bg-neutral-100 rounded-lg flex items-center justify-center group cursor-pointer">
                <Play className="w-8 h-8 text-accent group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex-grow space-y-4">
                <div>
                  <span className="text-[10px] font-mono text-accent uppercase tracking-widest">Phase 2: Technical analysis</span>
                  <h5 className="text-xl font-display font-bold uppercase mt-1 text-text-primary">Reading Candlestick Shadows</h5>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono uppercase text-text-tertiary">
                    <span>Module Progress</span>
                    <span>65%</span>
                  </div>
                  <div className="h-1 bg-neutral-100 rounded-full w-full">
                    <div className="h-full bg-accent rounded-full w-[65%]" />
                  </div>
                </div>
                <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-primary hover:text-accent transition-colors">
                  Resume Lesson <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Account Stats */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4">Account Stats</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Win Rate", value: "64.2%", color: "text-mkt-grn" },
                { label: "Max Drawdown", value: "-12.5%", color: "text-mkt-red" },
                { label: "Total Profit", value: "£4,231.10", color: "text-mkt-grn" },
                { label: "Current Streak", value: "3 Wins", color: "text-mkt-grn" },
              ].map((stat, i) => (
                <div key={i} className="p-6 bg-background-surface/40 border border-border-slate/50 rounded-[20px] text-center transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:-translate-y-0.5">
                  <p className="text-[8px] font-mono uppercase tracking-widest text-text-tertiary mb-2">{stat.label}</p>
                  <p className={cn("text-lg font-display font-bold uppercase", stat.color)}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Market Intelligence / Consensus */}
          <section className="pt-4">
            <MarketConsensus />
          </section>
        </div>

        {/* Right Column: Sidebar Widgets */}
        <div className="space-y-12">
          {/* AI Psychology Coach */}
          <PsychologyCoach trades={mockTrades as any} account={mockAccount as any} />

          <BrokerWidget />
          <EmotionalPnL />
          <NewsWidget />
        </div>
      </div>

      {/* Execution Hub: Watchlist & Alerts */}
      <section className="space-y-6">
        <h4 className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4">Execution Hub</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 h-[500px]">
          <div className="lg:col-span-1">
            <WatchlistManager />
          </div>
          <div className="lg:col-span-1">
            <AlertCentre />
          </div>
          <div className="lg:col-span-1 p-8 bg-background-surface/40 border border-border-slate/50 rounded-[20px] flex flex-col justify-center items-center text-center space-y-6 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:-translate-y-0.5">
             <div className="w-16 h-16 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-accent animate-pulse" />
             </div>
             <div className="space-y-2">
                <h5 className="text-sm font-display font-bold uppercase text-text-primary">Ready to Automate?</h5>
                <p className="text-xs text-text-tertiary leading-relaxed px-4">
                   Use the Algo Strategy Builder to convert your manual rules into professional code.
                </p>
             </div>
             <Link 
               href="/dashboard/tools/algo-builder"
               className="px-8 py-3 bg-mkt-ink text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-mkt-i2 transition-colors"
             >
                Open Algo Builder
             </Link>
          </div>
        </div>
      </section>

      {/* Achievements at Bottom */}
      <div className="space-y-6">
        <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Achievements</h4>
        <div className="p-8 bg-background-surface/40 backdrop-blur-md border border-border-slate/50">
          <BadgeGrid badges={allBadges} />
        </div>
      </div>
    </div>
  );
}
