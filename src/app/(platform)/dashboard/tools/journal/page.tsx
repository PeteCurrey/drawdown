"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Filter,
  MoreVertical,
  ChevronRight,
  BrainCircuit,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface TradeLog {
  id: string;
  date: string;
  symbol: string;
  type: string;
  entry_price: number;
  exit_price: number | null;
  pnl_amount: number | null;
  strategy: string;
  notes: string;
}

export default function TradeJournalPage() {
  const [trades, setTrades] = useState<TradeLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchTrades();
  }, []);

  async function fetchTrades() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await (supabase as any)
      .from('trade_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (data) setTrades(data);
    setLoading(false);
  }

  async function handleAddTrade(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const { data: { user } } = await supabase.auth.getUser();

    const newTrade = {
      user_id: user?.id,
      symbol: formData.get('symbol'),
      type: formData.get('type'),
      entry_price: parseFloat(formData.get('entry_price') as string),
      strategy: formData.get('strategy'),
      date: new Date().toISOString().split('T')[0],
      notes: formData.get('notes')
    };

    const { error } = await (supabase as any).from('trade_logs').insert([newTrade]);
    
    if (!error) {
      setShowAddForm(false);
      fetchTrades();
    }
    setIsSubmitting(false);
  }

  const totalPnL = trades.reduce((acc, curr) => acc + (curr.pnl_amount || 0), 0);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-border-slate pb-8">
        <div>
          <h1 className="text-3xl font-display font-bold uppercase mb-2">Trade Journal</h1>
          <p className="text-sm text-text-tertiary">Log your execution and let AI analyze your behavioral edge.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors"
        >
          <Plus className="w-4 h-4" /> New Entry
        </button>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Trades", value: trades.length, icon: Calendar },
          { label: "Win Rate", value: "64%", icon: CheckCircle2 },
          { label: "Total PnL", value: `$${totalPnL.toLocaleString()}`, icon: totalPnL >= 0 ? TrendingUp : TrendingDown, color: totalPnL >= 0 ? "text-profit" : "text-loss" },
          { label: "AI Edge Score", value: "B+", icon: BrainCircuit },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-background-surface border border-border-slate flex flex-col justify-between h-32">
             <div className="flex justify-between items-start">
               <span className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">{stat.label}</span>
               <stat.icon className={cn("w-4 h-4", stat.color || "text-text-tertiary/50")} />
             </div>
             <span className={cn("text-2xl font-display font-black", stat.color)}>{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Trade List */}
        <div className="flex-grow bg-background-surface border border-border-slate">
           <div className="p-4 border-b border-border-slate flex justify-between items-center bg-background-elevated/30">
              <div className="relative w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input 
                  type="text" 
                  placeholder="SEARCH LOGS..." 
                  className="w-full bg-background-primary border border-border-slate pl-10 pr-4 py-2 text-[10px] font-mono outline-none focus:border-accent"
                />
              </div>
              <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-tertiary hover:text-text-primary">
                <Filter className="w-4 h-4" /> Filter
              </button>
           </div>
           
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-background-primary text-[9px] font-mono uppercase tracking-widest text-text-tertiary border-b border-border-slate">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Symbol</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Strategy</th>
                    <th className="px-6 py-4 text-right">PnL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-slate/30">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="p-20 text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-accent" />
                      </td>
                    </tr>
                  ) : trades.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-20 text-center text-text-tertiary text-xs uppercase tracking-widest font-mono">
                        No entries found. Log your first trade.
                      </td>
                    </tr>
                  ) : trades.map((trade) => (
                    <tr key={trade.id} className="hover:bg-background-elevated/20 transition-colors group cursor-pointer">
                      <td className="px-6 py-4 text-[10px] font-mono text-text-tertiary">{trade.date}</td>
                      <td className="px-6 py-4 font-display font-bold text-sm">{trade.symbol}</td>
                      <td className="px-6 py-4">
                         <span className={cn(
                           "text-[9px] font-bold uppercase tracking-widest px-2 py-1 border",
                           trade.type === 'buy' ? "text-profit border-profit/20 bg-profit/5" : "text-loss border-loss/20 bg-loss/5"
                         )}>
                           {trade.type}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-[10px] text-text-secondary uppercase">{trade.strategy}</td>
                      <td className={cn(
                        "px-6 py-4 text-right font-mono text-xs",
                        (trade.pnl_amount || 0) >= 0 ? "text-profit" : "text-loss"
                      )}>
                        {(trade.pnl_amount || 0) >= 0 ? '+' : ''}${(trade.pnl_amount || 0).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </div>

        {/* Sidebar Insights */}
        <div className="w-full lg:w-80 space-y-6">
           <div className="p-8 bg-accent/5 border border-accent/20 rounded-sm">
              <div className="flex items-center gap-3 mb-6">
                 <BrainCircuit className="w-5 h-5 text-accent" />
                 <h3 className="text-sm font-display font-bold uppercase">Behavioral Alpha</h3>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed mb-6">
                 Your AI analysis suggests a <span className="text-accent font-bold">42% performance drop</span> during the NY Session overlap. Consider tightening your risk parameters after 14:30 GMT.
              </p>
              <button className="w-full py-3 border border-accent text-accent text-[9px] font-bold uppercase tracking-widest hover:bg-accent hover:text-background-primary transition-all">
                 Generate Full Report
              </button>
           </div>
        </div>
      </div>

      {/* Add Trade Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-background-primary/80 backdrop-blur-sm" onClick={() => setShowAddForm(false)} />
           <div className="relative w-full max-w-xl bg-background-surface border border-border-slate p-10 shadow-2xl animate-in zoom-in-95 duration-200">
              <h2 className="text-3xl font-display font-bold uppercase mb-8">Journal Entry</h2>
              <form onSubmit={handleAddTrade} className="space-y-6">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-mono uppercase text-text-tertiary">Symbol</label>
                       <input name="symbol" required placeholder="e.g. GBPUSD" className="w-full bg-background-primary border border-border-slate p-3 text-sm outline-none focus:border-accent" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-mono uppercase text-text-tertiary">Type</label>
                       <select name="type" className="w-full bg-background-primary border border-border-slate p-3 text-sm outline-none focus:border-accent">
                          <option value="buy">BUY</option>
                          <option value="sell">SELL</option>
                       </select>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-mono uppercase text-text-tertiary">Entry Price</label>
                       <input name="entry_price" type="number" step="0.0001" required className="w-full bg-background-primary border border-border-slate p-3 text-sm outline-none focus:border-accent" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-mono uppercase text-text-tertiary">Strategy</label>
                       <select name="strategy" className="w-full bg-background-primary border border-border-slate p-3 text-sm outline-none focus:border-accent">
                          <option value="Liquidity Grab">Liquidity Grab</option>
                          <option value="Order Block">Order Block</option>
                          <option value="Break & Retest">Break & Retest</option>
                       </select>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-text-tertiary">Behavioral Notes</label>
                    <textarea name="notes" rows={4} className="w-full bg-background-primary border border-border-slate p-3 text-sm outline-none focus:border-accent resize-none" placeholder="What were you feeling? Why this setup?" />
                 </div>
                 <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 py-4 border border-border-slate text-[10px] font-bold uppercase tracking-widest hover:bg-background-elevated">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover disabled:opacity-50">
                       {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Commit to Journal"}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
