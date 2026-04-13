"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Plus, 
  Search, 
  Filter, 
  TrendingUp, 
  Smile, 
  Calendar as CalendarIcon,
  ChevronDown,
  BarChart3,
  BrainCircuit,
  Loader2
} from "lucide-react";

const stats = [
  { label: "Win Rate", value: "64.2%", color: "text-profit" },
  { label: "Profit Factor", value: "1.85", color: "text-accent" },
  { label: "Avg R:R", value: "1:2.4", color: "text-text-primary" },
  { label: "Losing Streak", value: "3", color: "text-loss" },
];

export default function TradeJournalPage() {
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

  const runAIAnalysis = () => {
    setIsAnalyzing(true);
    // Simulate streaming for now
    setTimeout(() => {
      setAnalysis("Based on your last 50 trades, you perform 22% better during the London session. Your 'Revenge' emotional state accounts for 80% of your largest drawdowns. Recommendation: Tighten stop losses on GBPUSD and avoid trading after 4pm GMT.");
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="pt-32 pb-24 bg-background-primary min-h-screen">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <span className="text-accent font-mono text-[10px] uppercase tracking-widest block mb-4">// PERFORMANCE LOG</span>
            <h1 className="text-4xl md:text-6xl font-display font-bold uppercase">Trade Journal.</h1>
          </div>
          <button 
            onClick={() => setIsEntryModalOpen(true)}
            className="flex items-center gap-2 px-8 py-4 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors"
          >
            <Plus className="w-4 h-4" /> Log New Trade
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="p-8 bg-background-surface border border-border-slate flex flex-col items-center text-center">
              <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-2">{stat.label}</p>
              <p className={cn("text-3xl font-display font-black", stat.color)}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* AI Analysis Section */}
        <div className="mb-12 p-8 md:p-12 bg-background-elevated border border-border-slate relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <BrainCircuit className="w-32 h-32 text-accent" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 text-accent mb-6">
              <BrainCircuit className="w-5 h-5" />
              <span className="text-xs font-mono uppercase font-bold tracking-widest">AI Pattern Recognition</span>
            </div>
            
            {analysis ? (
              <div className="max-w-3xl space-y-6">
                <p className="text-xl text-text-primary leading-relaxed font-sans itali">
                  "{analysis}"
                </p>
                <div className="flex gap-4">
                  <button className="text-[10px] font-bold uppercase tracking-widest text-accent hover:underline">Full Report</button>
                  <button 
                    onClick={() => setAnalysis(null)}
                    className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary hover:text-text-primary"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-w-2xl space-y-6">
                <h3 className="text-3xl font-display font-bold uppercase">Unlock your trading edge.</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Our AI analyzes your performance, psychological state, and market timing to find the specific patterns holding you back. Edge tier required for advanced mapping.
                </p>
                <button 
                  onClick={runAIAnalysis}
                  disabled={isAnalyzing}
                  className="px-8 py-4 border border-accent text-accent text-[10px] font-bold uppercase tracking-widest hover:bg-accent hover:text-background-primary transition-all disabled:opacity-50"
                >
                  {isAnalyzing ? <><Loader2 className="w-3 h-3 animate-spin mr-2" /> Analyzing...</> : "Run AI Analysis"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Trade List Container */}
        <div className="bg-background-surface border border-border-slate">
          <div className="p-6 border-b border-border-slate flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-grow md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                <input 
                  type="text" 
                  placeholder="SEARCH INSTRUMENT..."
                  className="w-full bg-background-primary border border-border-slate pl-10 pr-4 py-2 text-[10px] font-mono uppercase tracking-widest focus:border-accent outline-none"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-border-slate text-[10px] font-bold uppercase tracking-widest hover:text-accent transition-colors">
                <Filter className="w-3 h-3" /> Filter
              </button>
            </div>
            <div className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
              Showing last 20 trades
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border-slate bg-background-elevated/30">
                  <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Date</th>
                  <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Instrument</th>
                  <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Type</th>
                  <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">P&L (£)</th>
                  <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Return (%)</th>
                  <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Strategy</th>
                  <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Session</th>
                  <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Feeling</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-slate/30">
                {[
                  { date: "12/04/26", pair: "GBPJPY", type: "LONG", pnl: "+1,240.20", ret: "+2.4%", strategy: "BREAKOUT", session: "LONDON", feel: "🎯" },
                  { date: "11/04/26", pair: "XAUUSD", type: "SHORT", pnl: "-450.00", ret: "-0.8%", strategy: "REVERSAL", session: "NY", feel: "😰" },
                  { date: "10/04/26", pair: "GBPUSD", type: "LONG", pnl: "+890.15", ret: "+1.7%", strategy: "TREND", session: "BOTH", feel: "😎" },
                ].map((trade, i) => (
                  <tr key={i} className="hover:bg-background-elevated/50 transition-colors cursor-pointer group">
                    <td className="px-6 py-6 font-mono text-xs">{trade.date}</td>
                    <td className="px-6 py-6 font-display font-bold text-sm tracking-widest uppercase">{trade.pair}</td>
                    <td className="px-6 py-6 text-[10px] font-bold uppercase tracking-widest">
                      <span className={cn(trade.type === 'LONG' ? 'text-profit' : 'text-loss')}>
                        {trade.type}
                      </span>
                    </td>
                    <td className={cn("px-6 py-6 font-mono font-bold text-sm", trade.pnl.startsWith('+') ? 'text-profit' : 'text-loss')}>
                      {trade.pnl}
                    </td>
                    <td className={cn("px-6 py-6 font-mono text-xs", trade.ret.startsWith('+') ? 'text-profit' : 'text-loss')}>
                      {trade.ret}
                    </td>
                    <td className="px-6 py-6 text-[10px] font-mono uppercase tracking-widest text-text-secondary">{trade.strategy}</td>
                    <td className="px-6 py-6 text-[10px] font-mono uppercase tracking-widest text-text-secondary">{trade.session}</td>
                    <td className="px-6 py-6 text-lg">{trade.feel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
