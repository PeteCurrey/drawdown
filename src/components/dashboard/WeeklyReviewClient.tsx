"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Calendar,
  RefreshCw,
  Save,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

interface WeekStats {
  tradeCount: number;
  avgProcessScore: number;
  ruleDeviations: number;
  netResult: number;
  avgR: number;
  closedCommitments: number;
}

interface WeeklyReviewData {
  week_start: string;
  week_end: string;
  process_consistency_score: number;
  net_result: number;
  trade_count: number;
  rule_deviations_count: number;
  commitment_progress: string;
  key_wins: string[];
  key_learnings: string[];
  plan_for_next_week: string;
  will_trade_next_week: boolean;
  skip_reason: string | null;
}

function getISOWeekStart(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function WeeklyReviewClient() {
  const supabase = createClient() as any;

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [weekStats, setWeekStats] = useState<WeekStats>({
    tradeCount: 0,
    avgProcessScore: 0,
    ruleDeviations: 0,
    netResult: 0,
    avgR: 0,
    closedCommitments: 0,
  });

  const [recentReviews, setRecentReviews] = useState<any[]>([]);

  // Form
  const [processScore, setProcessScore] = useState(75);
  const [keyWins, setKeyWins] = useState<string[]>([]);
  const [newWin, setNewWin] = useState("");
  const [keyLearnings, setKeyLearnings] = useState<string[]>([]);
  const [newLearning, setNewLearning] = useState("");
  const [planNextWeek, setPlanNextWeek] = useState("");
  const [willTrade, setWillTrade] = useState(true);
  const [skipReason, setSkipReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const weekStart = getISOWeekStart();
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const formatWeekRange = () =>
    `${weekStart.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – ${weekEnd.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`;

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUser(user);

      // Fetch trade records for this week
      const { data: records } = await supabase
        .from("trade_records")
        .select("result_amount, result_r, closed_at")
        .eq("user_id", user.id)
        .gte("opened_at", weekStart.toISOString())
        .lte("opened_at", weekEnd.toISOString());

      // Fetch trade reviews for this week's records
      const recordIds = (records || []).map((r: any) => r.id).filter(Boolean);
      let reviewData: any[] = [];
      if (recordIds.length > 0) {
        const { data: reviews } = await supabase
          .from("trade_reviews")
          .select("plan_adherence_score, risk_discipline_score, journal_completeness_score, deviations")
          .in("trade_record_id", recordIds);
        reviewData = reviews || [];
      }

      const avgProcess = reviewData.length > 0
        ? reviewData.reduce((sum, r) => {
          const composite = (r.plan_adherence_score + r.risk_discipline_score + r.journal_completeness_score) / 3;
          return sum + composite;
        }, 0) / reviewData.length
        : 0;

      const totalDeviations = reviewData.reduce((sum, r) => sum + (r.deviations?.length || 0), 0);

      const netResult = (records || []).reduce((sum: number, r: any) => sum + (r.result_amount || 0), 0);
      const avgR = records && records.length > 0
        ? (records as any[]).filter(r => r.result_r != null).reduce((sum, r) => sum + r.result_r, 0) / records.length
        : 0;

      // Closed improvement commitments this week
      const { data: closedCommitments } = await supabase
        .from("improvement_commitments")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "closed")
        .gte("closed_at", weekStart.toISOString());

      setWeekStats({
        tradeCount: records?.length || 0,
        avgProcessScore: Math.round(avgProcess),
        ruleDeviations: totalDeviations,
        netResult,
        avgR,
        closedCommitments: closedCommitments?.length || 0,
      });

      if (avgProcess > 0) setProcessScore(Math.round(avgProcess));

      // Recent weekly reviews
      const { data: recent } = await supabase
        .from("weekly_operating_reviews")
        .select("*")
        .eq("user_id", user.id)
        .order("week_start", { ascending: false })
        .limit(6);

      setRecentReviews(recent || []);

      setLoading(false);
    }
    load();
  }, [supabase]);

  const addWin = () => {
    if (!newWin.trim()) return;
    setKeyWins(prev => [...prev, newWin.trim()]);
    setNewWin("");
  };

  const addLearning = () => {
    if (!newLearning.trim()) return;
    setKeyLearnings(prev => [...prev, newLearning.trim()]);
    setNewLearning("");
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    await supabase.from("weekly_operating_reviews").insert({
      user_id: user.id,
      week_commencing: weekStart.toISOString().slice(0, 10),
      week_start: weekStart.toISOString().slice(0, 10),
      week_end: weekEnd.toISOString().slice(0, 10),
      process_metrics: {},
      process_consistency_score: processScore,
      net_result: weekStats.netResult,
      trade_count: weekStats.tradeCount,
      rule_deviations_count: weekStats.ruleDeviations,
      key_wins: keyWins,
      key_learnings: keyLearnings,
      plan_for_next_week: planNextWeek,
      will_trade_next_week: willTrade,
      skip_reason: !willTrade ? skipReason : null,
    });

    setSaving(false);
    setSaved(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-text-tertiary font-mono">
        // COMPILING WEEK DATA...
      </div>
    );
  }

  if (saved) {
    return (
      <div className="max-w-xl mx-auto p-8 border border-border-slate/50 bg-background-elevated/40 rounded-xl space-y-6 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mx-auto">
          <RefreshCw className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold uppercase text-text-primary">Week Closed</h2>
          <p className="text-xs text-text-tertiary">
            {formatWeekRange()} review saved. The loop resets Monday.
          </p>
          <div className="text-4xl font-bold font-mono text-emerald-500 py-2">{processScore}</div>
          <p className="text-xs text-text-tertiary">Process Consistency Score</p>
        </div>
        <div className="grid grid-cols-3 gap-3 pt-4 text-xs">
          <div className="p-3 bg-background-primary border border-border-slate/30 rounded-lg text-center">
            <div className="font-bold text-text-primary">{weekStats.tradeCount}</div>
            <div className="text-text-tertiary text-[10px]">Trades</div>
          </div>
          <div className="p-3 bg-background-primary border border-border-slate/30 rounded-lg text-center">
            <div className={cn("font-bold", weekStats.netResult >= 0 ? "text-emerald-400" : "text-rose-400")}>
              {weekStats.netResult >= 0 ? "+" : ""}£{Math.abs(weekStats.netResult).toFixed(0)}
            </div>
            <div className="text-text-tertiary text-[10px]">P&L</div>
          </div>
          <div className="p-3 bg-background-primary border border-border-slate/30 rounded-lg text-center">
            <div className="font-bold text-text-primary">{weekStats.closedCommitments}</div>
            <div className="text-text-tertiary text-[10px]">Commitments Closed</div>
          </div>
        </div>
        <Link
          href="/dashboard/prepare"
          className="w-full bg-emerald-500 text-background-primary text-xs font-bold uppercase py-4 rounded-lg hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 mt-4"
        >
          Start Next Week <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left — week stats */}
      <div className="space-y-4">
        <div className="p-5 bg-background-elevated/30 border border-border-slate/50 rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-text-tertiary" />
            <span className="text-xs font-mono font-bold uppercase text-text-tertiary">This Week</span>
          </div>
          <div className="text-xs text-text-tertiary mb-4">{formatWeekRange()}</div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-border-slate/20">
              <span className="text-text-tertiary">Trades Taken</span>
              <span className="font-mono font-bold text-text-primary">{weekStats.tradeCount}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border-slate/20">
              <span className="text-text-tertiary">Avg Process Score</span>
              <span className={cn("font-mono font-bold",
                weekStats.avgProcessScore >= 80 ? "text-emerald-400" : weekStats.avgProcessScore >= 60 ? "text-amber-400" : "text-rose-400"
              )}>
                {weekStats.avgProcessScore || "—"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-border-slate/20">
              <span className="text-text-tertiary">Rule Deviations</span>
              <span className={cn("font-mono font-bold",
                weekStats.ruleDeviations === 0 ? "text-emerald-400" : weekStats.ruleDeviations <= 2 ? "text-amber-400" : "text-rose-400"
              )}>
                {weekStats.ruleDeviations}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-border-slate/20">
              <span className="text-text-tertiary">Net P&L</span>
              <span className={cn("font-mono font-bold",
                weekStats.netResult > 0 ? "text-emerald-400" : weekStats.netResult < 0 ? "text-rose-400" : "text-text-tertiary"
              )}>
                {weekStats.netResult >= 0 ? "+" : ""}£{Math.abs(weekStats.netResult).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-border-slate/20">
              <span className="text-text-tertiary">Avg R</span>
              <span className="font-mono font-bold text-text-primary">
                {weekStats.avgR !== 0 ? `${weekStats.avgR.toFixed(2)}R` : "—"}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-text-tertiary">Commitments Closed</span>
              <span className="font-mono font-bold text-emerald-400">{weekStats.closedCommitments}</span>
            </div>
          </div>
        </div>

        {/* Streak / recent reviews */}
        {recentReviews.length > 0 && (
          <div className="p-5 bg-background-elevated/30 border border-border-slate/50 rounded-xl">
            <h3 className="text-xs font-mono font-bold uppercase text-text-tertiary mb-3">Recent Weeks</h3>
            <div className="space-y-2">
              {recentReviews.map(r => (
                <div key={r.id} className="flex justify-between items-center text-xs py-1">
                  <span className="text-text-tertiary">
                    {new Date(r.week_start).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className={cn("font-mono font-bold",
                      r.process_consistency_score >= 80 ? "text-emerald-400" : r.process_consistency_score >= 60 ? "text-amber-400" : "text-rose-400"
                    )}>
                      {r.process_consistency_score}
                    </span>
                    <span className={cn("text-[10px]",
                      r.net_result > 0 ? "text-emerald-400" : r.net_result < 0 ? "text-rose-400" : "text-text-tertiary"
                    )}>
                      {r.net_result >= 0 ? "+" : ""}£{Math.abs(r.net_result || 0).toFixed(0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right — Review form */}
      <div className="lg:col-span-2 p-6 bg-background-elevated/40 border border-border-slate/50 rounded-xl space-y-6">
        <div>
          <h2 className="text-lg font-bold uppercase text-text-primary">Weekly Process Review</h2>
          <p className="text-xs text-text-tertiary mt-1">
            Close the loop. Document what you executed well, what you'll improve, and whether you'll trade next week.
          </p>
        </div>

        {/* Process consistency score */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-bold text-text-secondary">Process Consistency Score</span>
            <span className={cn("font-mono font-bold", processScore >= 80 ? "text-emerald-500" : processScore >= 60 ? "text-amber-500" : "text-rose-500")}>
              {processScore} / 100
            </span>
          </div>
          <input type="range" min="0" max="100" value={processScore}
            onChange={e => setProcessScore(parseInt(e.target.value))}
            className="w-full accent-emerald-500" />
          <p className="text-[10px] text-text-tertiary">
            {weekStats.avgProcessScore > 0
              ? `Auto-computed from ${weekStats.tradeCount} trade review(s) this week. Adjust if needed.`
              : "No reviewed trades this week. Score manually."}
          </p>
        </div>

        {/* Key wins */}
        <div className="space-y-3 pt-4 border-t border-border-slate/20">
          <label className="text-[10px] uppercase tracking-wider font-mono text-text-tertiary block">Key Process Wins</label>
          <div className="flex gap-2">
            <input type="text" value={newWin} onChange={e => setNewWin(e.target.value)}
              placeholder="e.g. Waited for confirmation before entry..."
              onKeyDown={e => e.key === "Enter" && addWin()}
              className="flex-1 bg-background-primary border border-border-slate/50 rounded-lg p-3 text-xs text-text-primary focus:outline-none" />
            <button onClick={addWin} className="px-3 text-xs border border-border-slate/50 rounded-lg hover:bg-background-elevated transition-colors">Add</button>
          </div>
          {keyWins.map((w, i) => (
            <div key={i} className="text-xs text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 px-3 py-2 rounded flex items-center gap-2">
              <ShieldCheck className="w-3 h-3 shrink-0" /> {w}
            </div>
          ))}
        </div>

        {/* Key learnings */}
        <div className="space-y-3">
          <label className="text-[10px] uppercase tracking-wider font-mono text-text-tertiary block">Key Learnings</label>
          <div className="flex gap-2">
            <input type="text" value={newLearning} onChange={e => setNewLearning(e.target.value)}
              placeholder="e.g. Friday session showed thin liquidity — stay out..."
              onKeyDown={e => e.key === "Enter" && addLearning()}
              className="flex-1 bg-background-primary border border-border-slate/50 rounded-lg p-3 text-xs text-text-primary focus:outline-none" />
            <button onClick={addLearning} className="px-3 text-xs border border-border-slate/50 rounded-lg hover:bg-background-elevated transition-colors">Add</button>
          </div>
          {keyLearnings.map((l, i) => (
            <div key={i} className="text-xs text-amber-400 bg-amber-500/5 border border-amber-500/20 px-3 py-2 rounded flex items-center gap-2">
              <AlertTriangle className="w-3 h-3 shrink-0" /> {l}
            </div>
          ))}
        </div>

        {/* Next week plan */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-wider font-mono text-text-tertiary block">Plan for Next Week</label>
          <textarea rows={3} value={planNextWeek} onChange={e => setPlanNextWeek(e.target.value)}
            placeholder="Market focus, sessions, risk budget, key setups to watch..."
            className="w-full bg-background-primary border border-border-slate/50 rounded-lg p-3 text-xs text-text-primary focus:outline-none" />
        </div>

        {/* Trade next week decision */}
        <div className="p-4 bg-background-primary/40 border border-border-slate/30 rounded-xl space-y-3">
          <label className="text-[10px] uppercase tracking-wider font-mono text-text-tertiary block">Will you trade next week?</label>
          <div className="flex gap-3">
            <button
              onClick={() => setWillTrade(true)}
              className={cn(
                "flex-1 py-3 text-xs font-bold rounded-lg border uppercase transition-colors",
                willTrade ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400" : "border-border-slate/30 text-text-tertiary"
              )}
            >
              Yes — Trade
            </button>
            <button
              onClick={() => setWillTrade(false)}
              className={cn(
                "flex-1 py-3 text-xs font-bold rounded-lg border uppercase transition-colors",
                !willTrade ? "border-amber-500/50 bg-amber-500/10 text-amber-400" : "border-border-slate/30 text-text-tertiary"
              )}
            >
              Skip Week
            </button>
          </div>
          {!willTrade && (
            <input type="text" value={skipReason} onChange={e => setSkipReason(e.target.value)}
              placeholder="Reason for skipping (holiday, news week, drawdown limit reached...)"
              className="w-full bg-background-primary border border-border-slate/50 rounded-lg p-3 text-xs text-text-primary focus:outline-none" />
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-emerald-500 text-background-primary font-bold uppercase tracking-wider text-xs py-4 rounded-lg hover:bg-emerald-400 transition-colors disabled:opacity-50"
        >
          {saving ? "Closing Week..." : "Close Week & Commit to Next"}
        </button>
      </div>
    </div>
  );
}
