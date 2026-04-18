"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { 
  Plus, 
  Search, 
  Filter, 
  BrainCircuit,
  Loader2,
  Zap
} from "lucide-react";
import { LogTradeModal } from "@/components/tools/LogTradeModal";
import { PerformanceHeatmap } from "@/components/tools/PerformanceHeatmap";
import { EmotionCharts } from "@/components/tools/EmotionCharts";
import { TierLockOverlay } from "@/components/ui/TierLockOverlay";
import { createClient } from "@/lib/supabase/client";

export default function TradeJournalPage() {
  const [trades, setTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLockedByTier, setIsLockedByTier] = useState(false);
  const [search, setSearch] = useState("");
  
  const userTier = "edge" as "free" | "foundation" | "edge" | "floor"; // Mock for dev

  const fetchTrades = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('trade_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (data) setTrades(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/ai/journal-analysis", { method: "POST" });
      const data = await res.json();
      if (data.analysis) setAnalysis(data.analysis);
    } catch (err) {
      console.error("Analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const filteredTrades = trades.filter(t => 
    t.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: "Win Rate", value: trades.length > 0 ? `${((trades.filter(t => t.pnl_amount > 0).length / trades.length) * 100).toFixed(1)}%` : "0%", color: "text-profit" },
    { label: "Total Profit", value: `£${trades.reduce((acc, t) => acc + (t.pnl_amount || 0), 0).toFixed(2)}`, color: "text-accent" },
    { label: "Total Trades", value: trades.length.toString(), color: "text-text-primary" },
    { label: "Last Session", value: trades[0]?.session || "N/A", color: "text-text-tertiary" },
  ];

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          <div className="lg:col-span-2 space-y-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="p-6 bg-background-surface border border-border-slate flex flex-col items-center text-center">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-2">{stat.label}</p>
                  <p className={cn("text-2xl font-display font-black", stat.color)}>{stat.value}</p>
                </div>
              ))}
            </div>

            <EmotionCharts trades={trades} />

            <div className="bg-background-surface border border-border-slate p-8">
              <PerformanceHeatmap />
            </div>
          </div>

          {/* AI Analysis Section */}
          <div className="p-8 md:p-10 bg-background-elevated border border-border-slate relative overflow-hidden group h-fit">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <BrainCircuit className="w-32 h-32 text-accent" />
            </div>
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-3 text-accent">
                <BrainCircuit className="w-5 h-5" />
                <span className="text-xs font-mono uppercase font-bold tracking-widest">AI Performance Intelligence</span>
              </div>
              
              {analysis ? (
                <div className="space-y-6">
                  <div className="text-sm text-text-primary leading-relaxed font-sans prose prose-invert">
                    {analysis.split('\n').map((para, i) => <p key={i}>{para}</p>)}
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setAnalysis(null)}
                      className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary hover:text-text-primary"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-2xl font-display font-bold uppercase leading-tight">Identify your <br /> psychological edge.</h3>
                  <p className="text-text-secondary text-xs leading-relaxed">
                    Pete's AI voice analyzes your session timing and emotional states to find where you're leaking capital. Edge+ required.
                  </p>
                  <button 
                    onClick={() => (userTier === "free" || userTier === "foundation" ? setIsLockedByTier(true) : runAIAnalysis())}
                    disabled={isAnalyzing}
                    className="w-full py-4 border border-accent text-accent text-[10px] font-bold uppercase tracking-widest hover:bg-accent hover:text-background-primary transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3 fill-current" />}
                    {isAnalyzing ? "Processing Stats..." : "Analyse My Trading"}
                  </button>
                </div>
              )}
            </div>
            {isLockedByTier && (
              <TierLockOverlay 
                requiredTier="edge" 
                featureName="Psychological Edge Analysis" 
                description="Our AI identifies exactly where emotions are causing you to blow your risk rules."
                onClose={() => setIsLockedByTier(false)}
                className="z-50"
              />
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
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-background-primary border border-border-slate pl-10 pr-4 py-2 text-[10px] font-mono uppercase tracking-widest focus:border-accent outline-none"
                />
              </div>
            </div>
            <div className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
              Showing {filteredTrades.length} trades
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
                {loading ? (
                  <tr><td colSpan={8} className="p-20 text-center font-mono text-[10px] uppercase animate-pulse">Syncing data...</td></tr>
                ) : filteredTrades.map((trade, i) => (
                  <tr key={i} className="hover:bg-background-elevated/50 transition-colors cursor-pointer group">
                    <td className="px-6 py-6 font-mono text-xs">{new Date(trade.date).toLocaleDateString()}</td>
                    <td className="px-6 py-6 font-display font-bold text-sm tracking-widest uppercase">{trade.symbol}</td>
                    <td className="px-6 py-6 text-[10px] font-bold uppercase tracking-widest">
                      <span className={cn(trade.type === 'Long' ? 'text-profit' : 'text-loss')}>
                        {trade.type}
                      </span>
                    </td>
                    <td className={cn("px-6 py-6 font-mono font-bold text-sm", trade.pnl_amount >= 0 ? 'text-profit' : 'text-loss')}>
                      {trade.pnl_amount >= 0 ? '+' : ''}{trade.pnl_amount.toFixed(2)}
                    </td>
                    <td className={cn("px-6 py-6 font-mono text-xs", trade.pnl_percent >= 0 ? 'text-profit' : 'text-loss')}>
                      {trade.pnl_percent >= 0 ? '+' : ''}{trade.pnl_percent.toFixed(2)}%
                    </td>
                    <td className="px-6 py-6 text-[10px] font-mono uppercase tracking-widest text-text-secondary">{trade.strategy || '-'}</td>
                    <td className="px-6 py-6 text-[10px] font-mono uppercase tracking-widest text-text-secondary">{trade.session}</td>
                    <td className="px-6 py-6 text-lg">{trade.feeling}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <LogTradeModal 
        isOpen={isEntryModalOpen}
        onClose={() => setIsEntryModalOpen(false)}
        onSuccess={fetchTrades}
      />
    </div>
  );
}
