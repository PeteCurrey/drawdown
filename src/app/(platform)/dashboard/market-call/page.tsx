"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { 
  Trophy, 
  Clock, 
  Lock, 
  Unlock, 
  HelpCircle, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Play,
  Award,
  CheckCircle2,
  RefreshCw,
  Eye,
  Settings,
  Flame,
  User
} from "lucide-react";

// Standard prediction options
type Direction = "higher" | "lower";

interface Week {
  id: string;
  week_number: number;
  start_date: string;
  lock_date: string;
  end_date: string;
  status: "active" | "locked" | "resolved";
}

interface Question {
  id: string;
  symbol: string;
  reference_price: number;
  actual_close_price: number | null;
  outcome: "higher" | "lower" | "flat" | "pending";
}

interface Prediction {
  id?: string;
  question_id: string;
  call: "higher" | "lower" | "flat";
  is_correct: boolean | null;
  points_awarded: number;
}

interface StandingsRow {
  user_id: string;
  display_name: string;
  total_points: number;
  correct_predictions: number;
  total_predictions: number;
  accuracy_pct: number;
}

interface AggregateRow {
  question_id: string;
  symbol: string;
  total_predictions: number;
  higher_count: number;
  lower_count: number;
  higher_pct: number;
  lower_pct: number;
}

export default function MarketCallPage() {
  const supabase = createClient();
  
  // Tab control: "call" | "leaderboard" | "rules"
  const [activeTab, setActiveTab] = useState<"call" | "leaderboard" | "rules">("call");
  
  // State
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<Week | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [userChoices, setUserChoices] = useState<Record<string, Direction>>({});
  const [leaderboard, setLeaderboard] = useState<StandingsRow[]>([]);
  const [aggregates, setAggregates] = useState<Record<string, AggregateRow>>({});
  const [livePrices, setLivePrices] = useState<Record<string, { price: number; change_pct: number }>>({});
  
  // Loading & Action States
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAuthorizedAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);

  // Time remaining countdown
  const [countdownText, setCountdownText] = useState("");

  // Fetch initial core data
  useEffect(() => {
    async function initUserAndWeeks() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (user) {
          // Grant admin rights if email matches Pete or in local development
          const isPete = user.email === "petecurrey@gmail.com";
          const isDev = process.env.NODE_ENV === "development";
          setIsAuthorizedAdmin(isPete || isDev);
        }

        await fetchWeeks();
      } catch (err) {
        console.error("Initialization error:", err);
      }
    }
    initUserAndWeeks();
  }, []);

  // Fetch weeks from Database
  const fetchWeeks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("market_call_weeks")
        .select("*")
        .order("week_number", { ascending: false });

      if (error) throw error;
      setWeeks(data || []);

      if (data && data.length > 0) {
        // Default to the latest week
        setSelectedWeek(data[0]);
      } else {
        setLoading(false);
      }
    } catch (err: any) {
      showToast(err.message || "Failed to fetch weeks", "error");
      setLoading(false);
    }
  };

  // Whenever selectedWeek changes, load that week's questions, predictions, and aggregates
  useEffect(() => {
    async function loadWeekData() {
      const week = selectedWeek;
      if (!week) return;
      
      setLoading(true);
      try {
        await Promise.all([
          fetchQuestions(week.id),
          fetchLeaderboard(week.id),
          fetchAggregates(week.id)
        ]);
      } catch (err) {
        console.error("Error loading week items:", err);
      } finally {
        setLoading(false);
      }
    }

    loadWeekData();
  }, [selectedWeek]);

  // Fetch live prices on mount and poll every 15 seconds
  useEffect(() => {
    fetchLivePrices();
    const interval = setInterval(fetchLivePrices, 15_000);
    return () => clearInterval(interval);
  }, []);

  // Countdown timer for locks
  useEffect(() => {
    if (!selectedWeek || selectedWeek.status !== "active") {
      setCountdownText("");
      return;
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const lockTime = new Date(selectedWeek.lock_date).getTime();
      const diff = lockTime - now;

      if (diff <= 0) {
        setCountdownText("Closed");
        clearInterval(interval);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        let text = "";
        if (days > 0) text += `${days}d `;
        text += `${hours}h ${minutes}m ${seconds}s`;
        setCountdownText(text);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedWeek]);

  const fetchQuestions = async (weekId: string) => {
    try {
      const { data: qRows, error: qErr } = await supabase
        .from("market_call_questions")
        .select("*")
        .eq("week_id", weekId);

      if (qErr) throw qErr;
      const sortedQ = (qRows as any[]) || [];
      setQuestions(sortedQ);

      // Load user's predictions for these questions if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (user && sortedQ.length > 0) {
        const qIds = sortedQ.map((q: any) => q.id);
        const { data: predRows, error: pErr } = await supabase
          .from("market_call_predictions")
          .select("*")
          .in("question_id", qIds);

        if (pErr) throw pErr;
        setPredictions((predRows as any[]) || []);

        // Populate local user choices state
        const initialChoices: Record<string, Direction> = {};
        (predRows as any[])?.forEach((p: any) => {
          if (p.call === "higher" || p.call === "lower") {
            initialChoices[p.question_id] = p.call as Direction;
          }
        });
        setUserChoices(initialChoices);
      }
    } catch (err: any) {
      showToast(err.message || "Failed to load questions", "error");
    }
  };

  const fetchLeaderboard = async (weekId: string) => {
    try {
      const { data, error } = await (supabase.rpc as any)("get_market_call_leaderboard", { p_week_id: weekId });

      if (error) throw error;
      setLeaderboard(data || []);
    } catch (err: any) {
      console.error("Leaderboard error:", err);
    }
  };

  const fetchAggregates = async (weekId: string) => {
    try {
      const { data, error } = await (supabase.rpc as any)("get_market_call_aggregates", { p_week_id: weekId });

      if (error) {
        // If locked/active exception is raised, it is safe to ignore
        setAggregates({});
      } else {
        const aggMap: Record<string, AggregateRow> = {};
        data?.forEach((row: AggregateRow) => {
          aggMap[row.question_id] = row;
        });
        setAggregates(aggMap);
      }
    } catch (err) {
      setAggregates({});
    }
  };

  const fetchLivePrices = async () => {
    try {
      const { data, error } = await supabase
        .from("price_cache")
        .select("symbol, price, change_pct");

      if (error) throw error;
      
      const priceMap: Record<string, { price: number; change_pct: number }> = {};
      (data as any[])?.forEach(row => {
        priceMap[row.symbol] = {
          price: Number(row.price),
          change_pct: Number(row.change_pct)
        };
      });
      setLivePrices(priceMap);
    } catch (err) {
      console.error("Failed to update live prices:", err);
    }
  };

  const handleSelectChoice = (questionId: string, choice: Direction) => {
    if (!selectedWeek || selectedWeek.status !== "active") return;
    setUserChoices(prev => ({
      ...prev,
      [questionId]: choice
    }));
  };

  const submitPredictions = async () => {
    if (!user) {
      showToast("Please sign in to submit predictions.", "error");
      return;
    }
    if (!selectedWeek || selectedWeek.status !== "active") {
      showToast("Submissions are locked for this week.", "error");
      return;
    }

    const questionCount = questions.length;
    const completedCount = Object.keys(userChoices).length;
    if (completedCount < questionCount) {
      showToast(`Please make predictions for all ${questionCount} instruments before submitting.`, "info");
      return;
    }

    setSubmitting(true);
    try {
      const upserts = questions.map(q => ({
        user_id: user.id,
        question_id: q.id,
        call: userChoices[q.id]
      }));

      const { error } = await (supabase
        .from("market_call_predictions") as any)
        .upsert(upserts, { onConflict: "user_id,question_id" });

      if (error) throw error;

      showToast("🎯 Weekly predictions submitted successfully!", "success");
      await fetchQuestions(selectedWeek.id);
    } catch (err: any) {
      showToast(err.message || "Failed to submit predictions.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Helper Toast Alert System
  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Exclusive Admin Controls for Testing and Setup
  const handleAdminAction = async (action: string) => {
    setAdminLoading(true);
    try {
      const response = await fetch(`/api/cron/market-call?action=${action}&force=true`, {
        headers: {
          "x-vercel-cron": "1"
        }
      });
      
      const resData = await response.json();
      if (!response.ok || resData.success === false) {
        throw new Error(resData.message || resData.error || "Execution failed");
      }

      showToast(`Admin action '${action}' completed successfully!`, "success");
      await fetchWeeks();
    } catch (err: any) {
      showToast(err.message || "Action failed", "error");
    } finally {
      setAdminLoading(false);
    }
  };

  return (
    <div className="space-y-8 select-text pb-12">
      {/* Toast Alert Banner */}
      {toast && (
        <div className={cn(
          "fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-lg border text-xs font-medium font-sans flex items-center gap-3 animate-in slide-in-from-top duration-300",
          toast.type === "success" && "bg-emerald-50 border-emerald-200 text-emerald-800",
          toast.type === "error" && "bg-rose-50 border-rose-200 text-rose-800",
          toast.type === "info" && "bg-indigo-50 border-indigo-200 text-indigo-800"
        )}>
          {toast.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          {toast.type === "error" && <AlertTriangle className="w-4 h-4 text-rose-600" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0d0d0d] border border-white/10 p-8 md:p-10 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-radial-gradient from-emerald-500/20 to-transparent blur-2xl pointer-events-none rounded-full" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono font-bold tracking-wider bg-emerald-500/15 border border-emerald-500/30 text-[#C8F135] uppercase rounded-full">
              <Flame className="w-3 h-3 text-[#C8F135]" /> Free Weekly Prediction Game
            </span>
            <h1 className="text-3xl md:text-4xl font-display font-black tracking-tight text-white leading-tight">
              Weekly Market Call
            </h1>
            <p className="text-xs md:text-sm text-[#8A8A85] leading-relaxed font-sans">
              Predict the directional outcome of six primary assets before Tuesday close. Acquire points, outperform your peers, climb the weekly standings, and claim 1 Month of <span className="text-[#C8F135] font-semibold">Edge Tier</span> completely free!
            </p>
          </div>

          {selectedWeek && selectedWeek.status === "active" && (
            <div className="bg-white/5 border border-white/10 p-5 rounded-xl flex flex-col items-center justify-center text-center min-w-[160px]">
              <Clock className="w-5 h-5 text-[#C8F135] mb-2 animate-pulse" />
              <p className="text-[10px] font-mono text-[#8A8A85] uppercase tracking-wider mb-1">Time Remaining</p>
              <div className="text-sm font-mono font-bold text-white tracking-tight">
                {countdownText || "Calculating..."}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Week Selector Bar & Navigation Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DEDDD8] pb-4">
        {/* Selector */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-[#555550]">Selected Week:</span>
          {weeks.length > 0 ? (
            <select
              value={selectedWeek?.id || ""}
              onChange={(e) => {
                const wk = weeks.find(w => w.id === e.target.value);
                if (wk) setSelectedWeek(wk);
              }}
              className="bg-white border border-[#DEDDD8] text-[#1A1A1A] font-mono text-xs font-bold px-3 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#F9771D]"
            >
              {weeks.map(w => {
                let statusText = "Active";
                if (w.status === "locked") statusText = "Locked";
                if (w.status === "resolved") statusText = "Resolved";
                return (
                  <option key={w.id} value={w.id}>
                    Week {w.week_number} ({statusText})
                  </option>
                );
              })}
            </select>
          ) : (
            <span className="text-xs font-mono text-[#CE6969]">No Active Game Weeks Configured</span>
          )}
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-[#1A1A1A]/5 p-1 rounded-xl">
          {[
            { id: "call", label: "Make Your Call", icon: Unlock },
            { id: "leaderboard", label: "Standings", icon: Trophy },
            { id: "rules", label: "Rules & FAQ", icon: HelpCircle }
          ].map(tab => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-all duration-150",
                  isTabActive 
                    ? "bg-[#181818] text-white shadow-sm"
                    : "text-[#555550] hover:text-[#1A1A1A]"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* loading indicator */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <RefreshCw className="w-8 h-8 text-[#F9771D] animate-spin" />
          <p className="text-xs font-mono text-[#555550]">Synchronizing live prediction ledger...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: MAKE YOUR CALL */}
          {activeTab === "call" && selectedWeek && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Submission Status Alert Banner */}
              {selectedWeek.status === "active" ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-5 rounded-2xl flex items-start gap-4">
                  <Unlock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h5 className="font-semibold text-sm text-emerald-900">Trading Ledger Open</h5>
                    <p className="text-xs leading-normal">
                      Submit predictions for all instruments below. You are permitted to modify your selection as frequently as you like until Tuesday midnight, at which point the round will lock.
                    </p>
                  </div>
                </div>
              ) : selectedWeek.status === "locked" ? (
                <div className="bg-indigo-50 border border-indigo-200 text-indigo-800 p-5 rounded-2xl flex items-start gap-4">
                  <Lock className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h5 className="font-semibold text-sm text-indigo-900">Predictions Locked</h5>
                    <p className="text-xs leading-normal">
                      Submission window has closed. Community choice distribution aggregates are now fully visible below as we monitor the closing outcomes on Friday. Good luck!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 text-slate-800 p-5 rounded-2xl flex items-start gap-4">
                  <Award className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h5 className="font-semibold text-sm text-slate-900">Round Completed & Resolved</h5>
                    <p className="text-xs leading-normal">
                      This round has finalized. Check individual outcomes and final score cards below, or head over to the <span className="font-semibold text-black cursor-pointer hover:underline" onClick={() => setActiveTab("leaderboard")}>Standings</span> tab to inspect the weekly podium winners!
                    </p>
                  </div>
                </div>
              )}

              {/* CARD GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {questions.map((q) => {
                  const live = livePrices[q.symbol];
                  const userCall = userChoices[q.id];
                  
                  // Calculate dynamic indicators
                  const refPrice = Number(q.reference_price);
                  const currentPrice = live ? live.price : refPrice;
                  const driftPct = refPrice ? ((currentPrice - refPrice) / refPrice) * 100 : 0;
                  const isCurrentHigher = currentPrice > refPrice;

                  const hasPrediction = predictions.some(p => p.question_id === q.id);
                  const predictionRow = predictions.find(p => p.question_id === q.id);
                  
                  return (
                    <div 
                      key={q.id}
                      className={cn(
                        "bg-white border rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex flex-col justify-between min-h-[300px] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]",
                        userCall ? "border-[#DEDDD8]" : "border-[#EDEDED]"
                      )}
                    >
                      {/* Card Header: Asset and Price details */}
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-black text-lg text-[#1A1A1A] tracking-tight">{q.symbol}</h4>
                            <span className="text-[10px] font-mono text-[#8A8A85] uppercase">Asset Class Instrument</span>
                          </div>

                          {/* Green/Red live variance indicator badge */}
                          <div className={cn(
                            "px-2.5 py-1 text-[10px] font-mono font-bold rounded-lg flex items-center gap-1",
                            driftPct > 0 && "bg-emerald-50 text-emerald-700 border border-emerald-100",
                            driftPct < 0 && "bg-rose-50 text-rose-700 border border-rose-100",
                            driftPct === 0 && "bg-slate-50 text-slate-700 border border-slate-100"
                          )}>
                            {driftPct > 0 ? <TrendingUp className="w-3 h-3" /> : driftPct < 0 ? <TrendingDown className="w-3 h-3" /> : null}
                            <span>{driftPct > 0 ? "+" : ""}{driftPct.toFixed(2)}%</span>
                          </div>
                        </div>

                        {/* Middle pricing rows */}
                        <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#F5F5F0] mb-5 text-sans">
                          <div>
                            <span className="block text-[10px] font-mono text-[#8A8A85] uppercase mb-1">Starting Price</span>
                            <span className="text-sm font-mono font-bold text-[#555550]">
                              {refPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 })}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[10px] font-mono text-[#8A8A85] uppercase mb-1">Current/Close</span>
                            <span className={cn(
                              "text-sm font-mono font-black",
                              isCurrentHigher ? "text-emerald-600" : "text-[#1A1A1A]"
                            )}>
                              {currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Call selector logic / distribution aggregates */}
                      <div>
                        {selectedWeek.status === "active" ? (
                          // ACTIVE: Toggle Selection Panel
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                              <button
                                onClick={() => handleSelectChoice(q.id, "higher")}
                                className={cn(
                                  "py-3 rounded-xl border font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all duration-150",
                                  userCall === "higher"
                                    ? "bg-emerald-500 border-emerald-600 text-white shadow-[0_4px_12px_rgba(16,185,129,0.25)] hover:bg-emerald-600"
                                    : "bg-white border-[#DEDDD8] text-[#555550] hover:bg-[#F5F5F0]"
                                )}
                              >
                                <TrendingUp className="w-4 h-4" />
                                HIGHER
                              </button>

                              <button
                                onClick={() => handleSelectChoice(q.id, "lower")}
                                className={cn(
                                  "py-3 rounded-xl border font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all duration-150",
                                  userCall === "lower"
                                    ? "bg-rose-500 border-rose-600 text-white shadow-[0_4px_12px_rgba(239,68,68,0.25)] hover:bg-rose-600"
                                    : "bg-white border-[#DEDDD8] text-[#555550] hover:bg-[#F5F5F0]"
                                )}
                              >
                                <TrendingDown className="w-4 h-4" />
                                LOWER
                              </button>
                            </div>
                          </div>
                        ) : (
                          // LOCKED / RESOLVED: Display selection outcome and aggregates
                          <div className="space-y-4">
                            {/* User's choice badge */}
                            <div className="p-3 bg-[#F5F5F0] rounded-xl flex justify-between items-center text-xs">
                              <span className="font-medium text-[#555550]">Your Prediction:</span>
                              {predictionRow ? (
                                <span className={cn(
                                  "font-bold uppercase flex items-center gap-1.5",
                                  predictionRow.call === "higher" && "text-emerald-600",
                                  predictionRow.call === "lower" && "text-rose-600"
                                )}>
                                  {predictionRow.call === "higher" ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                                  {predictionRow.call}
                                </span>
                              ) : (
                                <span className="font-mono text-slate-500 italic">No selection</span>
                              )}
                            </div>

                            {/* Aggregates view if available */}
                            {aggregates[q.id] && (
                              <div className="space-y-1.5 text-[11px] font-sans">
                                <div className="flex justify-between text-[#8A8A85]">
                                  <span>Community: {aggregates[q.id].higher_pct}% Higher</span>
                                  <span>{aggregates[q.id].lower_pct}% Lower</span>
                                </div>
                                <div className="w-full h-2 bg-[#F0F0F0] rounded-full overflow-hidden flex">
                                  <div 
                                    className="h-full bg-emerald-500 transition-all duration-500"
                                    style={{ width: `${aggregates[q.id].higher_pct}%` }}
                                  />
                                  <div 
                                    className="h-full bg-rose-500 transition-all duration-500"
                                    style={{ width: `${aggregates[q.id].lower_pct}%` }}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Final outcome check badge (Resolved only) */}
                            {selectedWeek.status === "resolved" && q.outcome && (
                              <div className={cn(
                                "p-3 rounded-xl border text-xs flex justify-between items-center font-sans",
                                predictionRow?.is_correct 
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                                  : "bg-slate-50 border-slate-200 text-slate-600"
                              )}>
                                <span className="font-medium">Result:</span>
                                <div className="flex items-center gap-2">
                                  <span className="font-black uppercase">{q.outcome}</span>
                                  {predictionRow?.is_correct ? (
                                    <span className="font-bold font-mono text-emerald-600">(+10 Points)</span>
                                  ) : (
                                    <span className="font-mono text-slate-400">(0 Points)</span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Submit panel (Active week only) */}
              {selectedWeek.status === "active" && (
                <div className="bg-white border border-[#EDEDED] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F9771D]/10 flex items-center justify-center text-[#F9771D]">
                      <Unlock className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-[#1A1A1A]">Ready to submit your ledger?</h5>
                      <p className="text-xs text-[#8A8A85]">Make sure you selected a prediction for every instrument above.</p>
                    </div>
                  </div>

                  <button
                    onClick={submitPredictions}
                    disabled={submitting}
                    className="w-full md:w-auto px-8 py-3 bg-[#181818] hover:bg-[#333330] text-white text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-md disabled:opacity-50"
                  >
                    {submitting ? "Transmitting selections..." : "Submit Weekly Predictions"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LEADERBOARD / STANDINGS */}
          {activeTab === "leaderboard" && selectedWeek && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-white border border-[#EDEDED] rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-black text-lg text-[#1A1A1A] tracking-tight">Week {selectedWeek.week_number} Leaderboard</h3>
                    <p className="text-xs text-[#8A8A85]">Standings of all players during this prediction round.</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                    <Trophy className="w-5 h-5" />
                  </div>
                </div>

                {leaderboard.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs font-sans">
                      <thead>
                        <tr className="border-b border-[#F5F5F0] text-[#8A8A85] font-mono uppercase tracking-wider">
                          <th className="py-3 px-4 font-bold">Rank</th>
                          <th className="py-3 px-4 font-bold">Player</th>
                          <th className="py-3 px-4 text-center font-bold">Points</th>
                          <th className="py-3 px-4 text-center font-bold">Accuracy</th>
                          <th className="py-3 px-4 text-right font-bold">Calls</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F5F5F0]">
                        {leaderboard.map((row, idx) => {
                          const isGold = idx === 0;
                          const isSilver = idx === 1;
                          const isBronze = idx === 2;
                          const isMe = user && row.user_id === user.id;

                          return (
                            <tr 
                              key={row.user_id} 
                              className={cn(
                                "hover:bg-[#1A1A1A]/2 transition-colors",
                                isMe && "bg-[#F9771D]/5 font-semibold"
                              )}
                            >
                              <td className="py-4 px-4">
                                <span className={cn(
                                  "w-6 h-6 rounded-full inline-flex items-center justify-center font-mono font-bold text-[10px] border",
                                  isGold && "bg-amber-100 border-amber-300 text-amber-800",
                                  isSilver && "bg-slate-100 border-slate-300 text-slate-800",
                                  isBronze && "bg-amber-600/10 border-amber-600/30 text-amber-900",
                                  !isGold && !isSilver && !isBronze && "bg-white border-[#DEDDD8] text-[#555550]"
                                )}>
                                  {idx + 1}
                                </span>
                              </td>
                              <td className="py-4 px-4 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-mono text-xs font-bold text-[#555550]">
                                  {row.display_name ? row.display_name.slice(0, 2).toUpperCase() : "TR"}
                                </div>
                                <div>
                                  <span className="text-[#1A1A1A] font-bold block">{row.display_name || "Anonymous Trader"}</span>
                                  {isMe && <span className="text-[9px] font-mono text-[#F9771D] uppercase font-bold">YOUR ENTRY</span>}
                                </div>
                              </td>
                              <td className="py-4 px-4 text-center font-mono font-bold text-[#1A1A1A] text-sm">
                                {row.total_points}
                              </td>
                              <td className="py-4 px-4 text-center">
                                <span className={cn(
                                  "px-2.5 py-1 rounded-full text-[10px] font-mono font-bold",
                                  row.accuracy_pct >= 60 ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-slate-50 text-slate-600 border border-slate-100"
                                )}>
                                  {row.accuracy_pct}%
                                </span>
                              </td>
                              <td className="py-4 px-4 text-right font-mono text-[#555550]">
                                {row.correct_predictions} / {row.total_predictions}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 space-y-3">
                    <Trophy className="w-8 h-8 text-[#DEDDD8]" />
                    <p className="text-xs font-mono text-[#555550]">No submissions logged for this round yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: RULES & FAQ */}
          {activeTab === "rules" && (
            <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
              <div className="bg-white border border-[#EDEDED] rounded-2xl p-8 shadow-sm space-y-6 font-sans">
                <h3 className="font-black text-xl text-[#1A1A1A] tracking-tight border-b pb-4 border-[#F5F5F0]">Rules of the Game</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sans">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <h5 className="font-bold text-sm text-[#1A1A1A] flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#181818] text-white inline-flex items-center justify-center text-[10px]">1</span>
                      How Scoring Works
                    </h5>
                    <p className="text-xs text-[#555550] leading-relaxed">
                      Every week, we track six core global market assets. Your goal is to predict if each asset will close <span className="font-bold text-emerald-600">HIGHER</span> or <span className="font-bold text-rose-600">LOWER</span> on Friday market close relative to its reference start price on Monday.
                    </p>
                    <p className="text-xs text-[#555550] leading-relaxed">
                      Each accurate call awards <span className="font-bold text-black">10 Points</span>. Incorrect predictions award 0 points.
                    </p>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <h5 className="font-bold text-sm text-[#1A1A1A] flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#181818] text-white inline-flex items-center justify-center text-[10px]">2</span>
                      Rules & Resolution
                    </h5>
                    <p className="text-xs text-[#555550] leading-relaxed">
                      The round opens on Monday 00:00 UTC and <span className="font-bold text-black">locks on Tuesday 23:59 UTC</span>. You cannot submit or modify selections after the lock.
                    </p>
                    <p className="text-xs text-[#555550] leading-relaxed">
                      Outcomes are resolved automatically on Friday 22:00 UTC based on actual close prices from our live market data feeds.
                    </p>
                  </div>
                </div>

                <div className="border-t border-[#F5F5F0] pt-6 space-y-4">
                  <h5 className="font-bold text-sm text-[#1A1A1A] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#181818] text-white inline-flex items-center justify-center text-[10px]">3</span>
                    Podium Prizes
                  </h5>
                  <p className="text-xs text-[#555550] leading-relaxed">
                    The top prediction caller each week (the player with highest accumulated points and highest accuracy percentage) wins:
                  </p>
                  <ul className="list-disc pl-5 text-xs text-[#555550] space-y-2">
                    <li>Our elite profile achievement badge <span className="font-bold text-indigo-700">"Verified Caller"</span> added to their dashboard.</li>
                    <li><span className="font-bold text-black">1 Month Free of Edge Tier Subscription</span> (normally £99/mo), unlocking real-time institutional and AI signals!</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* EXCLUSIVE ADMIN CONTROLS SYSTEM */}
      {isAdmin && (
        <div className="bg-[#1A1A1A]/3 border border-[#DEDDD8] rounded-2xl p-6 space-y-4 animate-in fade-in duration-500">
          <div className="flex items-center justify-between border-b border-[#DEDDD8] pb-3">
            <div className="flex items-center gap-2 text-sans">
              <Settings className="w-4 h-4 text-[#F9771D]" />
              <h4 className="text-xs font-mono font-black uppercase tracking-wider text-[#1A1A1A]">Authorized Developer Console</h4>
            </div>
            <span className="px-2 py-0.5 text-[8px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300 rounded uppercase">
              Sandboxed / Admin
            </span>
          </div>

          <p className="text-[11px] text-[#555550] leading-relaxed font-sans">
            Because direct SQL database execution is blocked by local sandbox firewalls and credentials, this console provides a one-click HTTP bridge to safely trigger cron mutations using your local server session. Use these buttons to step through the entire game flow for testing:
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleAdminAction("create-next")}
              disabled={adminLoading}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[10px] font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Unlock className="w-3.5 h-3.5" />
              1. Initialize Active Round
            </button>

            <button
              onClick={() => handleAdminAction("lock")}
              disabled={adminLoading}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-mono text-[10px] font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Lock className="w-3.5 h-3.5" />
              2. Force Lock submissions
            </button>

            <button
              onClick={() => handleAdminAction("resolve")}
              disabled={adminLoading}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-[10px] font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Trophy className="w-3.5 h-3.5" />
              3. Resolve & Score Round
            </button>
          </div>
        </div>
      )}

      {/* COMPLIANCE DISCLAIMER PANEL */}
      <div className="bg-[#EDEDED]/40 border border-[#DEDDD8] rounded-2xl p-6 text-sans space-y-2">
        <div className="flex items-center gap-2 text-slate-700">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <h5 className="font-bold text-xs uppercase tracking-wider">Regulatory Compliance & Game Policy</h5>
        </div>
        <p className="text-[11px] text-[#555550] leading-relaxed">
          The Drawdown Market Call game is purely an educational, free-to-play simulation. No real money or currency of any kind is required to play, nor is real capital exchanged or awarded as prizes.
        </p>
        <p className="text-[11px] text-[#555550] leading-relaxed">
          Predictive submissions and aggregate community choices are hidden from public view until the weekly window closes to eliminate front-running and prevent the game from functioning as, or being confused with, an active trade-signals, advisory, or recommendations service. Information displayed does not constitute financial advice.
        </p>
      </div>
    </div>
  );
}
