'use client';

import { useState, useEffect } from "react";
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Zap, 
  History, 
  CheckCircle2, 
  AlertTriangle,
  ChevronRight,
  Clock,
  Calendar,
  Lock,
  ArrowRight,
  ShieldAlert,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { PsychologyCoach } from "@/components/dashboard/PsychologyCoach";

// Mock data for initial UI
const MOCK_REPORTS = [
  { id: '1', week_ending: '2024-04-28', discipline_score: 84, grade: 'B', public_id: 'r1' },
  { id: '2', week_ending: '2024-04-21', discipline_score: 62, grade: 'D', public_id: 'r2' },
  { id: '3', week_ending: '2024-04-14', discipline_score: 92, grade: 'A', public_id: 'r3' },
];

export default function CoachPage() {
  const [activeTab, setActiveTab] = useState<'live' | 'history' | 'checkin'>('live');
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [trades, setTrades] = useState<any[]>([]);
  const [account, setAccount] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      
      const [reportsRes, tradesRes, accountRes] = await Promise.all([
        supabase.from('discipline_reports').select('*').order('week_ending', { ascending: false }),
        supabase.from('individual_trades').select('*').order('entry_time', { ascending: false }).limit(20),
        supabase.from('funded_accounts').select('*').eq('account_status', 'active').limit(1).single()
      ]);

      if (reportsRes.data) setReports(reportsRes.data);
      else setReports(MOCK_REPORTS);

      if (tradesRes.data) setTrades(tradesRes.data);
      if (accountRes.data) setAccount(accountRes.data);

      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-accent font-mono text-[10px] uppercase tracking-widest block mb-3">// BEHAVIORAL ANALYTICS</span>
          <h1 className="text-4xl font-display font-bold uppercase text-text-primary">Psychology <span className="text-accent italic">Coach.</span></h1>
          <p className="text-text-secondary text-sm mt-2 max-w-xl">
            We don't just track your P&L. We track the brain behind it. Stop being your own worst enemy.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-background-surface border border-border-slate p-1">
          {[
            { id: 'live', label: 'Live Analysis', icon: Brain },
            { id: 'history', label: 'Weekly Reports', icon: History },
            { id: 'checkin', label: 'Session Start', icon: Zap },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-6 py-2 text-[10px] font-mono uppercase tracking-widest transition-all",
                activeTab === tab.id ? "bg-accent text-background-primary font-bold" : "text-text-tertiary hover:text-text-primary"
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {loading ? (
        <div className="h-[600px] flex items-center justify-center">
           <Loader2 className="w-8 h-8 text-accent animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-10">
            {activeTab === 'live' && (
              <div className="space-y-10 animate-in fade-in duration-500">
                {/* Live Analysis Feed */}
                <div className="bg-background-surface border border-border-slate p-8">
                   <PsychologyCoach trades={trades} account={account} />
                </div>

                {/* Behavioral Heatmap (Placeholder) */}
                <div className="space-y-6">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Session Weakness Map</h4>
                  <div className="grid grid-cols-7 gap-2">
                    {/* Simplified heatmap grid */}
                    {Array.from({ length: 21 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "aspect-square border border-border-slate/30",
                          i === 12 ? "bg-loss/40" : i === 8 || i === 15 ? "bg-warning/20" : "bg-background-elevated"
                        )}
                        title={i === 12 ? "High Revenge Trading Risk (NY Open)" : "Stable Session"}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-[8px] font-mono uppercase text-text-tertiary">
                    <span>Mon</span>
                    <span>Fri</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                {reports.map((report) => (
                  <div key={report.id} className="p-8 bg-background-surface border border-border-slate flex flex-col md:flex-row justify-between items-center gap-8 group hover:border-accent/40 transition-colors">
                     <div className="flex items-center gap-8">
                        <div className={cn(
                          "w-16 h-16 flex items-center justify-center font-display font-black text-3xl border-2",
                          report.grade === 'A' ? "text-profit border-profit/30" : report.grade === 'F' ? "text-loss border-loss/30" : "text-accent border-accent/30"
                        )}>
                           {report.grade}
                        </div>
                        <div>
                           <p className="text-[10px] font-mono text-text-tertiary uppercase">Week Ending</p>
                           <h4 className="text-xl font-display font-bold uppercase">{new Date(report.week_ending).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</h4>
                        </div>
                     </div>
                     <div className="flex items-center gap-12">
                        <div className="text-center">
                           <p className="text-[10px] font-mono text-text-tertiary uppercase mb-1">Score</p>
                           <p className="text-xl font-display font-bold">{report.discipline_score}/100</p>
                        </div>
                        <button className="flex items-center gap-2 px-8 py-3 bg-background-elevated border border-border-slate text-[10px] font-bold uppercase tracking-widest hover:border-accent transition-colors">
                           View Report <ChevronRight className="w-4 h-4 text-accent" />
                        </button>
                     </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'checkin' && (
              <div className="max-w-xl space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="space-y-4">
                    <h3 className="text-2xl font-display font-bold uppercase">Pre-Session <span className="text-accent">Protocol.</span></h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      Your biological state dictates your risk tolerance. Check in before you click "buy" or "sell".
                    </p>
                 </div>
                 
                 <div className="space-y-8 p-10 bg-background-surface border border-border-slate">
                    <div className="space-y-4">
                       <label className="block text-[10px] font-mono uppercase tracking-widest text-text-tertiary">How are you feeling right now?</label>
                       <div className="grid grid-cols-5 gap-2">
                          {[1,2,3,4,5].map((val) => (
                            <button key={val} className="py-4 border border-border-slate hover:border-accent transition-colors font-display font-bold text-xl">
                               {val === 1 ? '😤' : val === 2 ? '😐' : val === 3 ? '🙂' : val === 4 ? '😎' : '💎'}
                            </button>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-4">
                       <label className="block text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Risk Awareness Check</label>
                       <div className="space-y-3">
                          {[
                            "I have a defined stop loss for every trade today.",
                            "I am not trading with money I cannot afford to lose.",
                            "I will walk away after 2 consecutive losses.",
                          ].map((check, i) => (
                            <label key={i} className="flex items-center gap-4 p-4 bg-background-primary border border-border-slate/50 cursor-pointer hover:bg-background-elevated transition-colors">
                               <input type="checkbox" className="w-4 h-4 accent-accent" />
                               <span className="text-xs text-text-secondary">{check}</span>
                            </label>
                          ))}
                       </div>
                    </div>

                    <button className="w-full py-5 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:invert transition-all">
                       Submit Check-in & Unlock Tools
                    </button>
                 </div>
              </div>
            )}
          </div>

          {/* Sidebar / Stats */}
          <aside className="space-y-12">
             <div className="p-8 bg-background-elevated border border-border-slate space-y-6">
                <h5 className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold">Coach Stats (30d)</h5>
                <div className="space-y-4">
                   <div className="flex justify-between items-center py-3 border-b border-border-slate/50">
                      <span className="text-[10px] font-mono text-text-tertiary uppercase">Avg Discipline</span>
                      <span className="text-sm font-display font-bold">78%</span>
                   </div>
                   <div className="flex justify-between items-center py-3 border-b border-border-slate/50">
                      <span className="text-[10px] font-mono text-text-tertiary uppercase">Leaks Found</span>
                      <span className="text-sm font-display font-bold text-loss">12</span>
                   </div>
                   <div className="flex justify-between items-center py-3">
                      <span className="text-[10px] font-mono text-text-tertiary uppercase">Consistency</span>
                      <span className="text-sm font-display font-bold text-profit">Tier 2</span>
                   </div>
                </div>
             </div>

             <div className="p-8 bg-background-surface border border-border-slate space-y-4 text-center">
                <Target className="w-8 h-8 text-accent mx-auto mb-4" />
                <h6 className="text-xs font-display font-bold uppercase">The Objective</h6>
                <p className="text-[11px] text-text-tertiary leading-relaxed">
                   The market is a machine designed to transfer money from the impatient to the patient. Our goal is to make you the most patient operator in the world.
                </p>
             </div>
          </aside>

        </div>
      )}
    </div>
  );
}
