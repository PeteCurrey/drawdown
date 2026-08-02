'use client';

import React, { useState, useEffect } from "react";
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
import { PageHeader } from "@/components/dashboard/ui/PageHeader";


export default function CoachPage() {
  const [activeTab, setActiveTab] = useState<'live' | 'history' | 'checkin'>('live');
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trades, setTrades] = useState<any[]>([]);
  const [account, setAccount] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      
      const reportsRes = await supabase.from('discipline_reports').select('*').order('week_ending', { ascending: false }) as any;
      const tradesRes = await supabase.from('individual_trades').select('*').order('entry_time', { ascending: false }).limit(20) as any;
      const accountRes = await supabase.from('funded_accounts').select('*').eq('account_status', 'active').limit(1).single() as any;

      if (reportsRes.error) {
        setError("Unable to load coaching reports");
      } else if (reportsRes.data && reportsRes.data.length > 0) {
        setReports(reportsRes.data);
      } else {
        setReports([]);
      }

      if (tradesRes.data) setTrades(tradesRes.data);
      if (accountRes.data) setAccount(accountRes.data);

      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div
      className="max-w-6xl mx-auto space-y-12 pb-24"
      style={{
        "--tool-accent": "#ec4899",
        "--tool-accent-hover": "#db2777",
        "--tool-accent-tint": "#fdf2f8",
        "--tool-accent-border": "#fbcfe8",
        "--tool-accent-text": "#9d174d",
      } as React.CSSProperties}
    >
      <PageHeader
        eyebrow="// BEHAVIORAL ANALYTICS"
        title="Psychology Coach"
        description="We don't just track your P&L — we track the discipline behind it. Detect revenge trading, tilt indicators, and cognitive fatigue."
        badge={
          <div className="flex bg-white border border-[#DEDDD8] p-1 rounded-xl shadow-sm">
            {[
              { id: 'live', label: 'Live Analysis', icon: Brain },
              { id: 'history', label: 'Weekly Reports', icon: History },
              { id: 'checkin', label: 'Session Start', icon: Zap },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-[10px] font-mono uppercase tracking-widest transition-all rounded-lg",
                  activeTab === tab.id
                    ? "bg-[#181818] text-white font-bold"
                    : "text-[#555550] hover:text-[#1A1A1A] hover:bg-[#F8F8F8]"
                )}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        }
      />

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
                {trades.length === 0 ? (
                  <div className="bg-background-surface border border-border-slate p-8 text-center py-16 space-y-4">
                    <Brain className="w-8 h-8 text-accent mx-auto" />
                    <p className="text-sm text-text-primary font-mono uppercase tracking-widest font-bold">
                      NO LIVE COGNITIVE FEEDBACK YET
                    </p>
                    <p className="text-xs text-text-secondary max-w-md mx-auto">
                      Please log your first trade in the Journal to enable live psychology coaching.
                    </p>
                  </div>
                ) : (
                  <div className="bg-background-surface border border-border-slate p-8">
                     <PsychologyCoach trades={trades} account={account} />
                  </div>
                )}

                {/* Session Weakness Map — computed from trade timestamps */}
                {(() => {
                  // Build a 7×3 (day × session) loss frequency map from real trades
                  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
                  const sessions = ['London','NY','Asia'];
                  // Count trades per day slot (using entry_time weekday)
                  const grid = Array(21).fill(0).map(() => ({ total: 0, losses: 0 }));
                  trades.forEach((t: any) => {
                    const d = new Date(t.entry_time);
                    const dayIdx = (d.getUTCDay() + 6) % 7; // Mon=0…Sun=6
                    const h = d.getUTCHours();
                    const sessionIdx = h < 8 ? 2 : h < 13 ? 0 : 1; // rough session mapping
                    const cellIdx = dayIdx * 3 + sessionIdx;
                    grid[cellIdx].total++;
                    if ((t.profit_loss ?? t.pnl ?? 0) < 0) grid[cellIdx].losses++;
                  });

                  const hasData = trades.length > 0;
                  return (
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
                        {hasData ? 'Session Weakness Map (Loss Frequency)' : 'Session Weakness Map'}
                      </h4>
                      {!hasData ? (
                        <div className="p-8 bg-background-surface border border-border-slate text-center space-y-2">
                          <p className="text-xs font-mono text-text-tertiary uppercase tracking-widest">No trade data yet</p>
                          <p className="text-[10px] text-text-tertiary/60">Log trades in the Journal to activate your session weakness map.</p>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-7 gap-2">
                            {grid.map((cell, i) => {
                              const lossRate = cell.total > 0 ? cell.losses / cell.total : 0;
                              const bg = lossRate > 0.6 ? 'bg-loss/40 border-loss/30'
                                : lossRate > 0.3 ? 'bg-warning/20 border-warning/20'
                                : cell.total > 0 ? 'bg-profit/10 border-profit/20'
                                : 'bg-background-elevated border-border-slate/20';
                              const dayLabel = days[Math.floor(i / 3)];
                              const sessionLabel = sessions[i % 3];
                              return (
                                <div
                                  key={i}
                                  className={`aspect-square border ${bg}`}
                                  title={cell.total > 0 ? `${dayLabel} ${sessionLabel}: ${cell.losses}/${cell.total} losses` : `${dayLabel} ${sessionLabel}: no trades`}
                                />
                              );
                            })}
                          </div>
                          <div className="flex justify-between text-[8px] font-mono uppercase text-text-tertiary">
                            {days.map(d => <span key={d}>{d}</span>)}
                          </div>
                          <div className="flex items-center gap-4 text-[8px] font-mono text-text-tertiary">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-loss/40 inline-block" /> High loss rate</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-warning/20 inline-block" /> Moderate</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-profit/10 inline-block" /> Strong</span>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                {error ? (
                  <div className="p-8 bg-background-surface border border-loss/30 text-center py-16 space-y-4">
                    <AlertTriangle className="w-8 h-8 text-loss mx-auto" />
                    <p className="text-sm text-loss font-mono uppercase tracking-widest font-bold">
                      {error}
                    </p>
                  </div>
                ) : reports.length === 0 ? (
                  <div className="p-8 bg-background-surface border border-border-slate text-center py-16 space-y-4">
                    <ShieldAlert className="w-8 h-8 text-accent mx-auto" />
                    <p className="text-sm text-text-primary font-mono uppercase tracking-widest font-bold">
                      NO COACHING REPORTS AVAILABLE
                    </p>
                    <p className="text-xs text-text-secondary max-w-md mx-auto">
                      Please log your first trade in the Journal to generate cognitive feedback.
                    </p>
                  </div>
                ) : (
                  reports.map((report) => (
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
                  ))
                )}
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
                       <span className="text-sm font-display font-bold">
                         {reports.length > 0
                           ? `${Math.round(reports.slice(0,4).reduce((s: number, r: any) => s + (r.discipline_score ?? 0), 0) / Math.min(reports.length, 4))}%`
                           : '—'}
                       </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-border-slate/50">
                       <span className="text-[10px] font-mono text-text-tertiary uppercase">Weekly Reports</span>
                       <span className="text-sm font-display font-bold">{reports.length > 0 ? reports.length : '—'}</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                       <span className="text-[10px] font-mono text-text-tertiary uppercase">Trades Logged</span>
                       <span className="text-sm font-display font-bold">{trades.length > 0 ? trades.length : '—'}</span>
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
