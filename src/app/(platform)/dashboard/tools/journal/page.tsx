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
  CheckCircle2,
  X,
  Sliders,
  Check,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Info,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";

interface Trade {
  id: string;
  created_at: string;
  instrument: string;
  direction: 'long' | 'short';
  entry_price: number;
  exit_price: number | null;
  stop_loss: number;
  take_profit: number | null;
  position_size: number;
  entry_time: string;
  exit_time: string | null;
  session: 'london' | 'new_york' | 'asian' | 'overlap' | 'other' | null;
  risk_amount: number;
  risk_percentage: number;
  account_balance_at_entry: number;
  pnl: number | null;
  pnl_percentage: number | null;
  rrr_planned: number | null;
  rrr_achieved: number | null;
  emotional_state_entry: 'calm' | 'confident' | 'anxious' | 'fearful' | 'excited' | 'frustrated' | 'neutral';
  emotional_state_exit: 'calm' | 'satisfied' | 'disappointed' | 'relieved' | 'angry' | 'neutral' | null;
  followed_plan: boolean;
  setup_type: string | null;
  timeframe_analysis: string | null;
  entry_reason: string;
  exit_reason: string | null;
  notes: string | null;
  mistakes: string | null;
  status: 'open' | 'closed' | 'cancelled';
  tags: string[] | null;
}

interface AIAnalysis {
  id: string;
  created_at: string;
  analysis_type: string;
  analysis_content: string;
  patterns_detected: any;
  recommendations: any;
}

const EMOTIONS_ENTRY: Record<string, string> = {
  calm: "🧘 Calm",
  confident: "😎 Confident",
  anxious: "😰 Anxious",
  fearful: "😨 Fearful",
  excited: "🤑 Excited",
  frustrated: "😤 Frustrated",
  neutral: "😐 Neutral"
};

const EMOTIONS_EXIT: Record<string, string> = {
  calm: "🧘 Calm",
  satisfied: "😊 Satisfied",
  disappointed: "😞 Disappointed",
  relieved: "😮‍💨 Relieved",
  angry: "😡 Angry",
  neutral: "😐 Neutral"
};

const INSTRUMENTS = ["GBP/USD", "EUR/USD", "USD/JPY", "XAU/USD", "FTSE 100", "US30", "NAS100", "BTC/USD", "ETH/USD"];
const SESSIONS = ["london", "new_york", "asian", "overlap", "other"];
const SETUPS = ["breakout", "pullback", "reversal", "news"];

export default function TradeJournalPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [analyses, setAnalyses] = useState<AIAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form mode: Quick vs Full
  const [formMode, setFormMode] = useState<"quick" | "full">("quick");
  const [dbError, setDbError] = useState(false);

  // Autocomplete state
  const [instrumentSearch, setInstrumentSearch] = useState("");
  const [showInstrumentsList, setShowInstrumentsList] = useState(false);

  // Close Trade Dialog State
  const [closingTrade, setClosingTrade] = useState<Trade | null>(null);
  const [exitPrice, setExitPrice] = useState("");
  const [exitReason, setExitReason] = useState("");
  const [exitEmotion, setExitEmotion] = useState("neutral");

  // Filters State
  const [filterInstrument, setFilterInstrument] = useState<string>("All");
  const [filterDirection, setFilterDirection] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterEmotion, setFilterEmotion] = useState<string>("All");
  const [filterPlan, setFilterPlan] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Sorting State
  const [sortField, setSortField] = useState<keyof Trade>("entry_time");
  const [sortAscending, setSortAscending] = useState(false);

  // AI analysis panel states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<AIAnalysis | null>(null);
  const [showAnalysisHistory, setShowAnalysisHistory] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setDbError(false);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch trades
      const { data: tradesData, error: tradesError } = await (supabase as any)
        .from('trades')
        .select('*')
        .eq('user_id', user.id)
        .order('entry_time', { ascending: false });

      if (tradesError) {
        if (tradesError.message.includes("relation") && tradesError.message.includes("does not exist")) {
          setDbError(true);
        } else {
          throw tradesError;
        }
      } else if (tradesData) {
        setTrades(tradesData as Trade[]);
      }

      // Fetch analyses
      const res = await fetch("/api/ai/journal-analysis");
      if (res.ok) {
        const data = await res.json();
        setAnalyses(data.history || []);
        if (data.history && data.history.length > 0) {
          setCurrentAnalysis(data.history[0]);
        }
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }

  // Handle delete
  async function handleDelete(tradeId: string) {
    if (!confirm("Are you sure you want to delete this trade from your journal?")) return;
    try {
      const { error } = await (supabase as any).from('trades').delete().eq('id', tradeId);
      if (!error) {
        setTrades(prev => prev.filter(t => t.id !== tradeId));
      } else {
        alert("Delete failed: " + error.message);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Handle closing trade
  async function handleCloseTradeSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!closingTrade) return;

    const exitVal = parseFloat(exitPrice);
    if (isNaN(exitVal)) {
      alert("Please enter a valid exit price");
      return;
    }

    try {
      const entryPriceVal = Number(closingTrade.entry_price);
      const isLong = closingTrade.direction === 'long';
      const balance = Number(closingTrade.account_balance_at_entry) || 10000;
      const risk = Number(closingTrade.risk_amount) || 100;

      // Calculate P&L
      const multiplier = closingTrade.instrument.toUpperCase().includes("JPY") ? 1000 : 100000;
      const pnlVal = (isLong ? (exitVal - entryPriceVal) : (entryPriceVal - exitVal)) * Number(closingTrade.position_size) * multiplier;
      const pnlPercentageVal = (pnlVal / balance) * 100;
      
      const rrrAchievedVal = pnlVal / risk;

      const { error } = await (supabase as any)
        .from('trades')
        .update({
          exit_price: exitVal,
          exit_time: new Date().toISOString(),
          status: 'closed' as const,
          pnl: pnlVal,
          pnl_percentage: pnlPercentageVal,
          rrr_achieved: rrrAchievedVal,
          exit_reason: exitReason,
          emotional_state_exit: exitEmotion as any
        })
        .eq('id', closingTrade.id);

      if (!error) {
        setClosingTrade(null);
        setExitPrice("");
        setExitReason("");
        setExitEmotion("neutral");
        fetchData();
      } else {
        alert("Failed to close trade: " + error.message);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Handle add/edit trade
  async function handleAddTrade(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const inst = formData.get('instrument') as string;
    const dir = formData.get('direction') as 'long' | 'short';
    const entryPriceVal = parseFloat(formData.get('entry_price') as string);
    const stopLossVal = parseFloat(formData.get('stop_loss') as string);
    const posSizeVal = parseFloat(formData.get('position_size') as string);
    const entryReasonVal = formData.get('entry_reason') as string;
    const emotionalStateEntryVal = formData.get('emotional_state_entry') as string;
    const followedPlanVal = formData.get('followed_plan') === 'true';

    // Validation
    if (!inst || !dir || isNaN(entryPriceVal) || isNaN(stopLossVal) || isNaN(posSizeVal)) {
      alert("Please fill in all required fields with valid numbers");
      setIsSubmitting(false);
      return;
    }

    try {
      const balanceVal = parseFloat(formData.get('account_balance_at_entry') as string) || 10000;
      const takeProfitVal = parseFloat(formData.get('take_profit') as string) || null;
      const sessionVal = (formData.get('session') as string) || null;
      const setupTypeVal = (formData.get('setup_type') as string) || null;
      const tfAnalysisVal = (formData.get('timeframe_analysis') as string) || null;
      const notesVal = (formData.get('notes') as string) || null;
      const tagsVal = formData.get('tags') 
        ? (formData.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean) 
        : null;

      // Auto-calculations
      const distance = Math.abs(entryPriceVal - stopLossVal);
      const isJpy = inst.toUpperCase().includes("JPY");
      const multiplier = isJpy ? 1000 : 100000;
      
      const riskAmountVal = distance * posSizeVal * multiplier;
      const riskPercentageVal = (riskAmountVal / balanceVal) * 100;

      let rrrPlannedVal = null;
      if (takeProfitVal) {
        rrrPlannedVal = Math.abs(takeProfitVal - entryPriceVal) / distance;
      }

      const newTrade = {
        user_id: user.id,
        instrument: inst,
        direction: dir,
        entry_price: entryPriceVal,
        stop_loss: stopLossVal,
        position_size: posSizeVal,
        entry_time: new Date().toISOString(),
        entry_reason: entryReasonVal,
        emotional_state_entry: emotionalStateEntryVal as any,
        followed_plan: followedPlanVal,
        account_balance_at_entry: balanceVal,
        take_profit: takeProfitVal,
        session: sessionVal as any,
        setup_type: setupTypeVal,
        timeframe_analysis: tfAnalysisVal,
        notes: notesVal,
        risk_amount: riskAmountVal,
        risk_percentage: riskPercentageVal,
        rrr_planned: rrrPlannedVal,
        status: 'open' as const,
        tags: tagsVal
      };

      const { error } = await (supabase as any).from('trades').insert([newTrade]);
      if (!error) {
        setShowAddForm(false);
        // Keep instrument / direction for speedy subsequent logging
        setInstrumentSearch(inst);
        fetchData();
      } else {
        alert("Failed to commit trade: " + error.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle AI analysis triggering
  async function triggerAIAnalysis() {
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/ai/journal-analysis", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setCurrentAnalysis(data);
        fetchData(); // Refresh history
      } else {
        alert(data.error || "Failed to analyze trades");
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  // Aggregate metrics
  const closedTrades = trades.filter(t => t.status === 'closed');
  const openTrades = trades.filter(t => t.status === 'open');
  
  const totalPnL = closedTrades.reduce((acc, curr) => acc + Number(curr.pnl || 0), 0);
  const totalTradesCount = trades.length;
  
  const winCount = closedTrades.filter(t => Number(t.pnl) > 0).length;
  const winRate = closedTrades.length > 0 ? Math.round((winCount / closedTrades.length) * 100) : 0;
  
  const totalPlannedRR = closedTrades.reduce((acc, curr) => acc + Number(curr.rrr_planned || 0), 0);
  const avgRRPlanned = closedTrades.filter(t => t.rrr_planned).length > 0
    ? (totalPlannedRR / closedTrades.filter(t => t.rrr_planned).length).toFixed(1)
    : "0.0";

  const totalAchievedRR = closedTrades.reduce((acc, curr) => acc + Number(curr.rrr_achieved || 0), 0);
  const avgRRAchieved = closedTrades.length > 0
    ? (totalAchievedRR / closedTrades.length).toFixed(1)
    : "0.0";

  const largestWin = closedTrades.length > 0 
    ? Math.max(0, ...closedTrades.map(t => Number(t.pnl || 0)))
    : 0;

  // Best session & Most traded
  const sessionWins: Record<string, number> = {};
  const instrumentCounts: Record<string, number> = {};
  closedTrades.forEach(t => {
    if (t.session) {
      sessionWins[t.session] = (sessionWins[t.session] || 0) + (Number(t.pnl || 0) > 0 ? 1 : 0);
    }
    instrumentCounts[t.instrument] = (instrumentCounts[t.instrument] || 0) + 1;
  });

  const bestSession = Object.entries(sessionWins).sort((a,b) => b[1]-a[1])[0]?.[0] || "london";
  const mostTradedPair = Object.entries(instrumentCounts).sort((a,b) => b[1]-a[1])[0]?.[0] || "GBP/USD";

  // Calculate current losing streak
  let currentLosingStreak = 0;
  // Sort trades chronologically to calculate streak
  const chronologicalClosedTrades = [...closedTrades].sort((a, b) => new Date(a.entry_time).getTime() - new Date(b.entry_time).getTime());
  for (let i = chronologicalClosedTrades.length - 1; i >= 0; i--) {
    if (Number(chronologicalClosedTrades[i].pnl || 0) < 0) {
      currentLosingStreak++;
    } else if (Number(chronologicalClosedTrades[i].pnl || 0) > 0) {
      break;
    }
  }

  // Cumulative P&L chart data
  let cumSum = 0;
  const chartData = chronologicalClosedTrades.map((t, idx) => {
    cumSum += Number(t.pnl || 0);
    return {
      tradeNumber: `Trade ${idx + 1}`,
      instrument: t.instrument,
      pnl: Number(t.pnl || 0),
      "Cumulative P&L": Number(cumSum.toFixed(2))
    };
  });

  // Sort and filter trades list
  const filteredTrades = trades.filter(t => {
    const matchSearch = t.instrument.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (t.entry_reason || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchInst = filterInstrument === "All" || t.instrument === filterInstrument;
    const matchDir = filterDirection === "All" || t.direction === filterDirection.toLowerCase();
    const matchStatus = filterStatus === "All" || t.status === filterStatus.toLowerCase();
    const matchEmotion = filterEmotion === "All" || t.emotional_state_entry === filterEmotion.toLowerCase();
    const matchPlan = filterPlan === "All" || (filterPlan === "Yes" ? t.followed_plan : !t.followed_plan);

    return matchSearch && matchInst && matchDir && matchStatus && matchEmotion && matchPlan;
  }).sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === "entry_time" || sortField === "exit_time") {
      aVal = aVal ? new Date(aVal as string).getTime() : 0;
      bVal = bVal ? new Date(bVal as string).getTime() : 0;
    } else if (typeof aVal === "string") {
      aVal = (aVal as string).toLowerCase();
      bVal = (bVal as string).toLowerCase();
    } else {
      aVal = Number(aVal || 0);
      bVal = Number(bVal || 0);
    }

    if (aVal < bVal) return sortAscending ? -1 : 1;
    if (aVal > bVal) return sortAscending ? 1 : -1;
    return 0;
  });

  const toggleSort = (field: keyof Trade) => {
    if (sortField === field) {
      setSortAscending(!sortAscending);
    } else {
      setSortField(field);
      setSortAscending(true);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-border-slate/50 pb-8 bg-background-primary/30">
        <div>
          <h1 className="text-3xl font-display font-bold uppercase mb-2">AI Performance Journal</h1>
          <p className="text-sm text-text-tertiary">Log your execution rules, emotional triggers, and let Pete audit your behavior.</p>
        </div>
        <button 
          onClick={() => {
            setShowAddForm(true);
            setInstrumentSearch("");
          }}
          className="flex items-center gap-2 px-6 py-4 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors rounded-sm"
        >
          <Plus className="w-4.5 h-4.5" /> Journal Trade
        </button>
      </header>

      {/* Database Missing Warning */}
      {dbError && (
        <div className="p-6 bg-loss/10 border border-loss/20 text-loss flex flex-col md:flex-row gap-4 items-start md:items-center justify-between rounded-sm">
          <div className="flex gap-3 items-start">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="font-bold text-xs uppercase font-sans">Database Tables Missing</h5>
              <p className="text-xs text-text-secondary">
                The tables `trades` and `journal_ai_analysis` are missing in your Supabase DB. Run the migration SQL in <code className="bg-background-primary px-1.5 py-0.5 rounded font-mono">supabase/migrations/20260617_create_trade_journal.sql</code> to fix this.
              </p>
            </div>
          </div>
          <button 
            onClick={fetchData}
            className="px-4 py-2 border border-loss/30 text-[9px] font-bold uppercase tracking-widest hover:bg-loss/20 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Onboarding Empty State */}
      {!loading && !dbError && trades.length === 0 && (
        <div className="p-16 border border-dashed border-border-slate/80 text-center max-w-2xl mx-auto space-y-6 bg-background-surface/20 rounded-sm">
          <div className="w-12 h-12 bg-background-elevated border border-border-slate/50 flex items-center justify-center mx-auto">
            <Sliders className="w-5 h-5 text-accent" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-sans font-bold uppercase text-text-primary">Your Journal is Empty</h3>
            <p className="text-xs text-text-tertiary max-w-sm mx-auto leading-relaxed">
              Log your first mock or live trade to populate your statistics, unlock compounding charts, and receive behavioral AI critiques.
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors"
          >
            Add First Entry
          </button>
        </div>
      )}

      {trades.length > 0 && !dbError && (
        <>
          {/* Row 1 Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: "Total P&L (Month)", value: `${totalPnL >= 0 ? "+" : ""}${totalPnL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, sub: "closed trades", isPnl: true },
              { label: "Win Rate (All Time)", value: `${winRate}%`, sub: `${winCount} wins / ${closedTrades.length} closed` },
              { label: "Avg R:R Achieved", value: `${avgRRAchieved} R`, sub: `Planned: ${avgRRPlanned} R` },
              { label: "Largest Win", value: `+£${largestWin.toLocaleString(undefined, { maximumFractionDigits: 2 })}`, sub: "single trade peak", color: "text-profit" },
            ].map((stat, i) => {
              const isPositive = stat.isPnl ? totalPnL >= 0 : true;
              return (
                <div key={i} className="p-6 bg-background-surface border border-border-slate flex flex-col justify-between h-32 rounded-sm shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                   <span className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">{stat.label}</span>
                   <div className="space-y-1">
                     <span className={cn(
                       "text-2xl font-display font-black",
                       stat.isPnl ? (isPositive ? "text-profit" : "text-loss") : (stat.color || "text-text-primary")
                     )}>
                       {stat.value}
                     </span>
                     <p className="text-[8px] font-mono text-text-tertiary uppercase tracking-widest">{stat.sub}</p>
                   </div>
                </div>
              );
            })}
          </div>

          {/* Row 2 Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: "Total Trades Logged", value: totalTradesCount, desc: `${openTrades.length} currently open` },
              { label: "Current Losing Streak", value: currentLosingStreak, desc: currentLosingStreak > 0 ? `${currentLosingStreak} consecutive losses` : "No active streak", color: currentLosingStreak > 2 ? "text-loss" : "text-text-primary" },
              { label: "Best Session", value: bestSession.toUpperCase(), desc: "Highest average win" },
              { label: "Most Traded Pair", value: mostTradedPair, desc: `${instrumentCounts[mostTradedPair] || 0} total entries` },
            ].map((stat, i) => (
              <div key={i} className="p-5 bg-background-surface/60 border border-border-slate/50 flex flex-col justify-between h-28 rounded-sm">
                 <span className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">{stat.label}</span>
                 <div className="space-y-1">
                   <span className={cn("text-lg font-sans font-bold", stat.color || "text-text-primary")}>{stat.value}</span>
                   <p className="text-[8px] font-mono text-text-tertiary uppercase">{stat.desc}</p>
                 </div>
              </div>
            ))}
          </div>

          {/* Line Chart */}
          {closedTrades.length > 0 && (
            <div className="p-6 bg-background-surface border border-border-slate rounded-sm space-y-6">
              <div>
                <h4 className="text-xs font-mono uppercase tracking-widest text-text-tertiary">// CUMULATIVE PERFORMANCE</h4>
                <p className="text-sm font-sans font-bold uppercase mt-1">Equity Curve Analysis</p>
              </div>
              <div className="h-64 w-full text-xs font-mono">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2e3d" />
                    <XAxis dataKey="tradeNumber" stroke="#68707f" />
                    <YAxis stroke="#68707f" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#10141f', borderColor: '#2d3343' }} 
                      labelStyle={{ color: '#a0aab8', fontWeight: 'bold' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Cumulative P&L" 
                      stroke="#10b981" 
                      strokeWidth={2} 
                      dot={{ r: 4, strokeWidth: 1 }} 
                      activeDot={{ r: 6 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* AI Coach & Trades Layout */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Trades List */}
            <div className="flex-grow bg-background-surface border border-border-slate rounded-sm">
               {/* Controls Bar */}
               <div className="p-4 border-b border-border-slate flex flex-wrap gap-4 justify-between items-center bg-background-elevated/30">
                  <div className="relative w-full md:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                    <input 
                      type="text" 
                      placeholder="SEARCH TRADES..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-background-primary border border-border-slate pl-10 pr-4 py-2.5 text-[9px] font-mono outline-none focus:border-accent uppercase tracking-widest"
                    />
                  </div>
                  
                  {/* Quick Filters */}
                  <div className="flex flex-wrap items-center gap-3">
                    <select 
                      value={filterInstrument}
                      onChange={(e) => setFilterInstrument(e.target.value)}
                      className="bg-background-primary border border-border-slate px-3 py-2 text-[9px] font-mono outline-none focus:border-accent uppercase"
                    >
                      <option value="All">All Pairs</option>
                      {INSTRUMENTS.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>

                    <select 
                      value={filterDirection}
                      onChange={(e) => setFilterDirection(e.target.value)}
                      className="bg-background-primary border border-border-slate px-3 py-2 text-[9px] font-mono outline-none focus:border-accent uppercase"
                    >
                      <option value="All">All Directions</option>
                      <option value="Long">Longs</option>
                      <option value="Short">Shorts</option>
                    </select>

                    <select 
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="bg-background-primary border border-border-slate px-3 py-2 text-[9px] font-mono outline-none focus:border-accent uppercase"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Open">Open</option>
                      <option value="Closed">Closed</option>
                    </select>

                    <select 
                      value={filterPlan}
                      onChange={(e) => setFilterPlan(e.target.value)}
                      className="bg-background-primary border border-border-slate px-3 py-2 text-[9px] font-mono outline-none focus:border-accent uppercase"
                    >
                      <option value="All">Plan Filter</option>
                      <option value="Yes">Followed Plan</option>
                      <option value="No">Strategy Drift</option>
                    </select>
                  </div>
               </div>
               
               {/* Main Table */}
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-background-primary text-[9px] font-mono uppercase tracking-widest text-text-tertiary border-b border-border-slate">
                      <tr>
                        <th className="px-6 py-4 cursor-pointer hover:text-text-primary transition-colors" onClick={() => toggleSort("entry_time")}>Date</th>
                        <th className="px-6 py-4 cursor-pointer hover:text-text-primary transition-colors" onClick={() => toggleSort("instrument")}>Instrument</th>
                        <th className="px-6 py-4 cursor-pointer hover:text-text-primary transition-colors" onClick={() => toggleSort("direction")}>Dir</th>
                        <th className="px-6 py-4 text-right">Entry</th>
                        <th className="px-6 py-4 text-right">Exit</th>
                        <th className="px-6 py-4 text-right cursor-pointer hover:text-text-primary transition-colors" onClick={() => toggleSort("pnl")}>P&L</th>
                        <th className="px-6 py-4 text-center">R:R</th>
                        <th className="px-6 py-4 text-center">Emotion</th>
                        <th className="px-6 py-4 text-center">Plan</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-slate/30">
                      {filteredTrades.map((trade) => {
                        const isWin = Number(trade.pnl || 0) > 0;
                        const isClosed = trade.status === 'closed';
                        
                        return (
                          <tr key={trade.id} className="hover:bg-background-elevated/20 transition-colors group">
                            <td className="px-6 py-4 text-[9px] font-mono text-text-tertiary">
                              {new Date(trade.entry_time).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 font-display font-bold text-xs">
                              {trade.instrument}
                            </td>
                            <td className="px-6 py-4">
                               <span className={cn(
                                 "text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 border rounded-sm",
                                 trade.direction === 'long' ? "text-profit border-profit/20 bg-profit/5" : "text-loss border-loss/20 bg-loss/5"
                               )}>
                                 {trade.direction}
                               </span>
                            </td>
                            <td className="px-6 py-4 text-right font-mono text-xs text-text-secondary">
                              {Number(trade.entry_price).toFixed(trade.instrument.includes("JPY") ? 3 : 5)}
                            </td>
                            <td className="px-6 py-4 text-right font-mono text-xs text-text-secondary">
                              {trade.exit_price 
                                ? Number(trade.exit_price).toFixed(trade.instrument.includes("JPY") ? 3 : 5)
                                : "—"}
                            </td>
                            <td className={cn(
                              "px-6 py-4 text-right font-mono text-xs font-semibold",
                              isClosed ? (isWin ? "text-profit" : "text-loss") : "text-text-tertiary"
                            )}>
                              {isClosed 
                                ? `${isWin ? "+" : ""}£${Number(trade.pnl || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
                                : "OPEN"}
                            </td>
                            <td className="px-6 py-4 text-center font-mono text-xs text-text-secondary">
                              {isClosed 
                                ? `${Number(trade.rrr_achieved || 0).toFixed(1)}R` 
                                : `${Number(trade.rrr_planned || 0).toFixed(1)}R`}
                            </td>
                            <td className="px-6 py-4 text-center text-xs">
                              <span title={trade.emotional_state_entry} className="cursor-help">
                                {EMOTIONS_ENTRY[trade.emotional_state_entry]?.split(' ')[0] || "😐"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              {trade.followed_plan ? (
                                <span className="text-profit font-sans text-xs" title="Rule Compliant">✓</span>
                              ) : (
                                <span className="text-loss font-sans text-xs" title="Strategy Drift">✗</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={cn(
                                "text-[7px] font-mono uppercase tracking-widest px-1.5 py-0.5 border rounded-sm",
                                isClosed ? "text-text-tertiary border-border-slate/50" : "text-accent border-accent/20 bg-accent/5 animate-pulse"
                              )}>
                                {trade.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right space-x-2">
                              {!isClosed && (
                                <button 
                                  onClick={() => setClosingTrade(trade)}
                                  className="px-2 py-1 bg-accent/10 border border-accent/20 text-accent text-[8px] font-bold uppercase tracking-widest hover:bg-accent hover:text-background-primary transition-colors rounded-sm"
                                >
                                  Close
                                </button>
                              )}
                              <button 
                                onClick={() => handleDelete(trade.id)}
                                className="px-2 py-1 bg-loss/5 border border-loss/20 text-loss text-[8px] font-bold uppercase tracking-widest hover:bg-loss hover:text-white transition-colors rounded-sm"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredTrades.length === 0 && (
                        <tr>
                          <td colSpan={11} className="p-16 text-center text-xs uppercase font-mono tracking-widest text-text-tertiary">
                            No matching records found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
               </div>
            </div>

            {/* Sidebar AI Insights */}
            <div className="w-full lg:w-96 shrink-0 space-y-6">
              {/* Onboarding AI */}
              {closedTrades.length < 5 ? (
                <div className="p-8 bg-background-surface border border-border-slate rounded-sm space-y-6">
                  <div className="flex items-center gap-3">
                     <BrainCircuit className="w-5 h-5 text-accent" />
                     <h3 className="text-sm font-display font-bold uppercase">AI Behavior Coach</h3>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                     Pete needs at least 5 completed trades logged in the database to perform a structural auditing of your setups and emotional leaks.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
                      <span>Progress</span>
                      <span>{closedTrades.length} / 5 trades</span>
                    </div>
                    <div className="w-full h-1.5 bg-border-slate/30 overflow-hidden rounded-sm">
                      <div 
                        className="h-full bg-accent transition-all duration-500" 
                        style={{ width: `${(closedTrades.length / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-[9px] font-mono text-text-tertiary uppercase">
                    Log {5 - closedTrades.length} more closed trades to unlock
                  </p>
                </div>
              ) : (
                <div className="p-8 bg-accent/5 border border-accent/20 rounded-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <BrainCircuit className="w-5 h-5 text-accent" />
                       <h3 className="text-sm font-display font-bold uppercase">AI Behavior Coach</h3>
                    </div>
                    <span className="text-[8px] font-mono px-2 py-0.5 bg-accent/10 text-accent uppercase tracking-widest border border-accent/20">
                      Enabled
                    </span>
                  </div>
                  
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Audits your last 20 closed executions for emotional leaks, session biases, and strategic non-compliance.
                  </p>

                  <button 
                    onClick={triggerAIAnalysis}
                    disabled={isAnalyzing}
                    className="w-full py-4 bg-accent hover:bg-accent-hover text-background-primary text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 rounded-sm"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Analyzing Tape...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" /> Run AI Coach Audit
                      </>
                    )}
                  </button>

                  {analyses.length > 0 && (
                    <button 
                      onClick={() => setShowAnalysisHistory(!showAnalysisHistory)}
                      className="w-full py-3 border border-border-slate/80 text-text-secondary text-[9px] font-bold uppercase tracking-widest hover:border-border-slate hover:text-text-primary transition-colors flex items-center justify-center gap-1"
                    >
                      History ({analyses.length}) <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", showAnalysisHistory && "rotate-180")} />
                    </button>
                  )}

                  {/* History List */}
                  {showAnalysisHistory && (
                    <div className="divide-y divide-border-slate/30 border border-border-slate/50 max-h-48 overflow-y-auto bg-background-primary/30 p-2 space-y-1 rounded-sm">
                      {analyses.map((a, idx) => (
                        <button
                          key={a.id}
                          onClick={() => {
                            setCurrentAnalysis(a);
                            setShowAnalysisHistory(false);
                          }}
                          className={cn(
                            "w-full text-left py-2 px-3 text-[10px] font-mono uppercase tracking-widest text-text-secondary hover:text-accent flex justify-between",
                            currentAnalysis?.id === a.id && "text-accent bg-accent/5 font-semibold"
                          )}
                        >
                          <span>Report 0{analyses.length - idx}</span>
                          <span>{new Date(a.created_at).toLocaleDateString()}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Analysis Display */}
              {currentAnalysis && (
                <div className="p-8 bg-background-surface border border-border-slate rounded-sm space-y-6 text-xs shadow-2xl animate-in slide-in-from-right duration-300">
                  <div className="flex justify-between items-center border-b border-border-slate pb-4">
                    <span className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">
                      Audit Date: {new Date(currentAnalysis.created_at).toLocaleDateString()}
                    </span>
                    <span className="text-[9px] font-mono text-accent uppercase tracking-widest flex items-center gap-1 font-bold">
                      <Sparkles className="w-3 h-3" /> Pete's Report
                    </span>
                  </div>

                  <div 
                    className="prose prose-invert max-w-none text-text-secondary leading-relaxed font-sans space-y-4
                      prose-h2:text-accent prose-h2:text-[10px] prose-h2:font-mono prose-h2:uppercase prose-h2:tracking-widest prose-h2:mb-2 prose-h2:mt-6 prose-h2:border-b prose-h2:border-accent/10 prose-h2:pb-1
                      prose-p:mt-0 prose-p:mb-4
                      prose-ul:list-disc prose-ul:pl-4 prose-ul:space-y-1
                      prose-li:text-text-secondary"
                    dangerouslySetInnerHTML={{ 
                      // Convert Markdown headers to fit formatting
                      __html: currentAnalysis.analysis_content
                        .replace(/## (.*)/g, '<h2 class="text-accent text-[10px] font-mono uppercase tracking-widest mb-2 mt-6 border-b border-accent/20 pb-1">$1</h2>')
                        .replace(/\* (.*)/g, '<li class="text-text-secondary">$1</li>')
                        .replace(/\n\n/g, '<p></p>')
                    }}
                  />

                  {currentAnalysis.recommendations && (
                    <div className="p-4 bg-accent/5 border-l-2 border-accent text-text-secondary space-y-2 mt-6 rounded-r-md">
                      <span className="text-[9px] font-mono text-accent uppercase tracking-widest block font-bold">Primary Recommendation</span>
                      <p className="font-sans italic">{currentAnalysis.recommendations.primary_focus}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Add Trade Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background-primary/80 backdrop-blur-sm">
           <div className="absolute inset-0" onClick={() => setShowAddForm(false)} />
           <div className="relative w-full max-w-2xl bg-background-surface border border-border-slate p-8 md:p-10 shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh] rounded-sm">
              
              <div className="flex justify-between items-center mb-8 border-b border-border-slate/50 pb-4">
                <div>
                  <h2 className="text-2xl font-display font-bold uppercase">New Journal Entry</h2>
                  <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest mt-1">Commit your rules to the tape</p>
                </div>
                <button 
                  onClick={() => setShowAddForm(false)} 
                  className="p-2 border border-border-slate/50 hover:border-border-slate text-text-tertiary hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mode Toggle Button */}
              <div className="flex gap-4 mb-6 border-b border-border-slate/30 pb-4">
                {(["quick", "full"] as const).map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setFormMode(mode)}
                    className={cn(
                      "text-[9px] font-bold uppercase tracking-widest pb-2 transition-colors relative",
                      formMode === mode ? "text-accent" : "text-text-tertiary hover:text-text-primary"
                    )}
                  >
                    {mode === 'quick' ? "Quick Entry (Standard)" : "Full Performance Entry"}
                    {formMode === mode && (
                      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-accent" />
                    )}
                  </button>
                ))}
              </div>

              <form onSubmit={handleAddTrade} className="space-y-6">
                 
                 {/* Standard Fields */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Autocomplete Instrument */}
                    <div className="space-y-2 relative">
                       <label className="text-[9px] font-mono uppercase text-text-tertiary tracking-widest block">Instrument *</label>
                       <input 
                         name="instrument" 
                         type="text"
                         required 
                         placeholder="e.g. GBP/USD"
                         value={instrumentSearch}
                         onChange={(e) => {
                           setInstrumentSearch(e.target.value);
                           setShowInstrumentsList(true);
                         }}
                         onFocus={() => setShowInstrumentsList(true)}
                         className="w-full bg-background-primary border border-border-slate p-3 text-sm outline-none focus:border-accent uppercase" 
                       />
                       {showInstrumentsList && (
                         <div className="absolute top-full left-0 w-full bg-background-elevated border border-border-slate/80 shadow-xl z-50 divide-y divide-border-slate/30 max-h-40 overflow-y-auto mt-1">
                           {INSTRUMENTS.filter(i => i.toLowerCase().includes(instrumentSearch.toLowerCase())).map(i => (
                             <button
                               key={i}
                               type="button"
                               onClick={() => {
                                 setInstrumentSearch(i);
                                 setShowInstrumentsList(false);
                               }}
                               className="w-full text-left px-4 py-2.5 text-xs text-text-secondary hover:bg-accent hover:text-background-primary uppercase font-mono font-bold"
                             >
                               {i}
                             </button>
                           ))}
                         </div>
                       )}
                    </div>

                    {/* Direction Long/Short toggle */}
                    <div className="space-y-2">
                       <label className="text-[9px] font-mono uppercase text-text-tertiary tracking-widest block">Direction *</label>
                       <div className="flex gap-4">
                          <button
                            type="button"
                            onClick={() => {
                              const el = document.getElementById("dir-input") as HTMLInputElement;
                              if (el) el.value = "long";
                              const longBtn = document.getElementById("long-btn");
                              const shortBtn = document.getElementById("short-btn");
                              longBtn?.classList.add("bg-profit", "text-background-primary", "border-profit");
                              longBtn?.classList.remove("text-profit", "border-profit/30");
                              shortBtn?.classList.add("text-loss", "border-loss/30");
                              shortBtn?.classList.remove("bg-loss", "text-background-primary", "border-loss");
                            }}
                            id="long-btn"
                            className="flex-1 py-3 border border-profit/30 text-profit font-bold text-[10px] uppercase tracking-widest transition-all rounded-sm hover:bg-profit/10"
                          >
                            LONG (BUY)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const el = document.getElementById("dir-input") as HTMLInputElement;
                              if (el) el.value = "short";
                              const longBtn = document.getElementById("long-btn");
                              const shortBtn = document.getElementById("short-btn");
                              shortBtn?.classList.add("bg-loss", "text-background-primary", "border-loss");
                              shortBtn?.classList.remove("text-loss", "border-loss/30");
                              longBtn?.classList.add("text-profit", "border-profit/30");
                              longBtn?.classList.remove("bg-profit", "text-background-primary", "border-profit");
                            }}
                            id="short-btn"
                            className="flex-1 py-3 border border-loss/30 text-loss font-bold text-[10px] uppercase tracking-widest transition-all rounded-sm hover:bg-loss/10"
                          >
                            SHORT (SELL)
                          </button>
                          <input type="hidden" id="dir-input" name="direction" defaultValue="long" />
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                       <label className="text-[9px] font-mono uppercase text-text-tertiary tracking-widest block">Entry Price *</label>
                       <input name="entry_price" type="number" step="0.00001" required placeholder="1.25000" className="w-full bg-background-primary border border-border-slate p-3 text-sm outline-none focus:border-accent font-mono" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-mono uppercase text-text-tertiary tracking-widest block">Stop Loss *</label>
                       <input name="stop_loss" type="number" step="0.00001" required placeholder="1.24500" className="w-full bg-background-primary border border-border-slate p-3 text-sm outline-none focus:border-accent font-mono" />
                    </div>
                    <div className="space-y-2 relative">
                       <label className="text-[9px] font-mono uppercase text-text-tertiary tracking-widest block flex justify-between">
                         <span>Position Size *</span>
                         <Link href="/dashboard/tools/position-sizer" className="text-accent underline lowercase font-sans text-[8px] hover:text-accent-hover">Position Sizer</Link>
                       </label>
                       <input name="position_size" type="number" step="0.0001" required placeholder="0.20" className="w-full bg-background-primary border border-border-slate p-3 text-sm outline-none focus:border-accent font-mono" />
                    </div>
                 </div>

                 {/* Entry reason & Mindset */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2 md:col-span-2">
                       <label className="text-[9px] font-mono uppercase text-text-tertiary tracking-widest block">Entry Reason *</label>
                       <input name="entry_reason" maxLength={200} required placeholder="Why did you click buy/sell? (e.g. 1H order block sweep)" className="w-full bg-background-primary border border-border-slate p-3 text-sm outline-none focus:border-accent" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-mono uppercase text-text-tertiary tracking-widest block">Plan Followed? *</label>
                       <select name="followed_plan" className="w-full bg-background-primary border border-border-slate p-3 text-sm outline-none focus:border-accent">
                          <option value="true">✓ Yes (Compliant)</option>
                          <option value="false">✗ No (FOMO/Overtrade)</option>
                       </select>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[9px] font-mono uppercase text-text-tertiary tracking-widest block">Emotional State at Entry *</label>
                       <select name="emotional_state_entry" className="w-full bg-background-primary border border-border-slate p-3 text-sm outline-none focus:border-accent">
                          {Object.entries(EMOTIONS_ENTRY).map(([key, val]) => (
                            <option key={key} value={key}>{val}</option>
                          ))}
                       </select>
                    </div>
                    
                    <div className="space-y-2">
                       <label className="text-[9px] font-mono uppercase text-text-tertiary tracking-widest block">Account Balance at Entry</label>
                       <input name="account_balance_at_entry" type="number" step="1" placeholder="10000" className="w-full bg-background-primary border border-border-slate p-3 text-sm outline-none focus:border-accent font-mono" />
                    </div>
                 </div>

                 {/* Full entry expands here */}
                 {formMode === 'full' && (
                   <div className="space-y-6 pt-4 border-t border-border-slate/50 animate-in slide-in-from-bottom duration-300">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                           <label className="text-[9px] font-mono uppercase text-text-tertiary tracking-widest block font-bold text-accent">Take Profit</label>
                           <input name="take_profit" type="number" step="0.00001" placeholder="1.26500" className="w-full bg-background-primary border border-border-slate p-3 text-sm outline-none focus:border-accent font-mono" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-mono uppercase text-text-tertiary tracking-widest block">Trading Session</label>
                           <select name="session" className="w-full bg-background-primary border border-border-slate p-3 text-sm outline-none focus:border-accent uppercase">
                              <option value="">Choose session...</option>
                              {SESSIONS.map(s => <option key={s} value={s}>{s}</option>)}
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-mono uppercase text-text-tertiary tracking-widest block">Setup Model Type</label>
                           <select name="setup_type" className="w-full bg-background-primary border border-border-slate p-3 text-sm outline-none focus:border-accent uppercase">
                              <option value="">Choose setup...</option>
                              {SETUPS.map(s => <option key={s} value={s}>{s}</option>)}
                           </select>
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[9px] font-mono uppercase text-text-tertiary tracking-widest block">Timeframe Confluence / Analysis</label>
                        <textarea name="timeframe_analysis" rows={2} className="w-full bg-background-primary border border-border-slate p-3 text-sm outline-none focus:border-accent resize-none" placeholder="Daily trend: bearish. 4H zone: retest. 1H entry: breakout." />
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[9px] font-mono uppercase text-text-tertiary tracking-widest block">General notes</label>
                           <textarea name="notes" rows={3} className="w-full bg-background-primary border border-border-slate p-3 text-sm outline-none focus:border-accent resize-none" placeholder="Add custom commentary, links to charts, correlation check..." />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-mono uppercase text-text-tertiary tracking-widest block">Session Tags</label>
                           <textarea name="tags" rows={3} className="w-full bg-background-primary border border-border-slate p-3 text-sm outline-none focus:border-accent resize-none" placeholder="FOMO, HighNews, Backtested, PropSetup (comma-separated)" />
                        </div>
                     </div>
                   </div>
                 )}

                 <div className="flex gap-4 pt-6 border-t border-border-slate/50">
                    <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 py-4 border border-border-slate text-[10px] font-bold uppercase tracking-widest hover:bg-background-elevated transition-colors rounded-sm">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover disabled:opacity-50 transition-colors rounded-sm flex items-center justify-center">
                       {isSubmitting ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : "Commit to Journal"}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Close Trade Modal */}
      {closingTrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background-primary/80 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setClosingTrade(null)} />
          <div className="relative w-full max-w-md bg-background-surface border border-border-slate p-8 shadow-2xl rounded-sm">
            <div className="flex justify-between items-center mb-6 border-b border-border-slate pb-3">
              <div>
                <h3 className="text-lg font-display font-bold uppercase">Close Position</h3>
                <p className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">Log execution results</p>
              </div>
              <button onClick={() => setClosingTrade(null)} className="text-text-tertiary hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCloseTradeSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-mono uppercase text-text-tertiary tracking-widest block">Exit Price *</label>
                <input 
                  type="number" 
                  step="0.00001" 
                  required 
                  value={exitPrice}
                  onChange={(e) => setExitPrice(e.target.value)}
                  placeholder="e.g. 1.25850"
                  className="w-full bg-background-primary border border-border-slate p-3 text-sm outline-none focus:border-accent font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-mono uppercase text-text-tertiary tracking-widest block">Emotional State at Exit *</label>
                <select 
                  value={exitEmotion}
                  onChange={(e) => setExitEmotion(e.target.value)}
                  className="w-full bg-background-primary border border-border-slate p-3 text-sm outline-none focus:border-accent"
                >
                  {Object.entries(EMOTIONS_EXIT).map(([key, val]) => (
                    <option key={key} value={key}>{val}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-mono uppercase text-text-tertiary tracking-widest block">Exit Reason / Notes</label>
                <textarea 
                  value={exitReason}
                  onChange={(e) => setExitReason(e.target.value)}
                  rows={3}
                  className="w-full bg-background-primary border border-border-slate p-3 text-sm outline-none focus:border-accent resize-none"
                  placeholder="Hit profit target / trailing stop triggered / manual exit due to structure change..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setClosingTrade(null)} className="flex-1 py-3 border border-border-slate text-[9px] font-bold uppercase tracking-widest hover:bg-background-elevated transition-colors rounded-sm">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-profit text-background-primary text-[9px] font-bold uppercase tracking-widest hover:bg-profit/90 transition-colors rounded-sm font-black">Close Position</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
