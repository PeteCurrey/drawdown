"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Trophy,
  Minus
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface TradeRecord {
  id: string;
  trade_plan_id: string | null;
  result_amount: number | null;
  result_r: number | null;
  entry_executions: any[];
  exit_executions: any[];
  opened_at: string;
  closed_at: string | null;
}

interface PlanSnapshot {
  instrument: string;
  direction: string;
  entryPrice: string;
  stopLoss: string;
  targetPrice: string;
  proposedLots: string;
  plannedRiskAmount: number;
  plannedRiskPercent: number;
  calculatedRRR: number;
  checklistResults: { item: string; checked: boolean }[];
}

export function ReviewClient({ recordId }: { recordId: string }) {
  const router = useRouter();
  const supabase = createClient() as any;

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [record, setRecord] = useState<TradeRecord | null>(null);
  const [snapshot, setSnapshot] = useState<PlanSnapshot | null>(null);

  // Review scores
  const [planAdherenceScore, setPlanAdherenceScore] = useState(75);
  const [riskDisciplineScore, setRiskDisciplineScore] = useState(75);
  const [journalCompletenessScore, setJournalCompletenessScore] = useState(75);
  const [deviations, setDeviations] = useState<string[]>([]);
  const [newDeviation, setNewDeviation] = useState("");
  const [strengths, setStrengths] = useState<string[]>([]);
  const [newStrength, setNewStrength] = useState("");
  const [userReflection, setUserReflection] = useState("");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUser(user);

      const { data: recData } = await supabase
        .from("trade_records")
        .select("*")
        .eq("id", recordId)
        .single();

      if (recData) {
        setRecord(recData);

        // Load linked plan snapshot
        if (recData.trade_plan_id) {
          const { data: snapData } = await supabase
            .from("trade_plan_snapshots")
            .select("snapshot_data")
            .eq("trade_plan_id", recData.trade_plan_id)
            .single();

          if (snapData?.snapshot_data) {
            setSnapshot(snapData.snapshot_data as PlanSnapshot);
          }
        }
      }
      setLoading(false);
    }
    load();
  }, [recordId, supabase]);

  const addDeviation = () => {
    if (!newDeviation.trim()) return;
    setDeviations(prev => [...prev, newDeviation.trim()]);
    setNewDeviation("");
  };

  const addStrength = () => {
    if (!newStrength.trim()) return;
    setStrengths(prev => [...prev, newStrength.trim()]);
    setNewStrength("");
  };

  // Process quality guard — profitable trade with rule breaches cannot get perfect score
  const isWinner = record?.result_amount != null && record.result_amount > 0;
  const hasDeviations = deviations.length > 0;
  const cappedAdherence = isWinner && hasDeviations ? Math.min(planAdherenceScore, 79) : planAdherenceScore;

  const compositeScore = Math.round((cappedAdherence + riskDisciplineScore + journalCompletenessScore) / 3);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from("trade_reviews")
      .insert({
        trade_record_id: recordId,
        user_id: user.id,
        plan_adherence_score: cappedAdherence,
        risk_discipline_score: riskDisciplineScore,
        journal_completeness_score: journalCompletenessScore,
        deviations,
        strengths,
        user_reflection: userReflection,
        completed_at: new Date().toISOString()
      });

    setSaving(false);
    if (!error) setSaved(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-text-tertiary font-mono">
        // LOADING TRADE DATA...
      </div>
    );
  }

  if (!record) {
    return (
      <div className="text-center py-16 text-text-tertiary text-xs">
        Trade record not found.
      </div>
    );
  }

  if (saved) {
    return (
      <div className="max-w-xl mx-auto p-8 border border-border-slate/50 bg-background-elevated/40 rounded-xl space-y-6 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold uppercase text-text-primary">Review Complete</h2>
          <div className={cn(
            "text-4xl font-bold font-mono",
            compositeScore >= 80 ? "text-emerald-500" : compositeScore >= 60 ? "text-amber-500" : "text-rose-500"
          )}>
            {compositeScore}
          </div>
          <p className="text-xs text-text-tertiary">Process Quality Score</p>
          {isWinner && hasDeviations && (
            <p className="text-xs text-amber-400 italic">
              Note: A profitable trade with identified rule deviations cannot receive a perfect process score.
            </p>
          )}
        </div>
        <div className="pt-4 flex gap-4">
          <Link
            href="/dashboard"
            className="flex-1 border border-border-slate/50 text-text-secondary text-xs font-mono uppercase py-4 rounded-lg hover:bg-background-elevated text-center transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/improve"
            className="flex-1 bg-emerald-500 text-background-primary text-xs font-bold uppercase py-4 rounded-lg hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2"
          >
            Improvement Stage <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const actualEntry = record.entry_executions?.[0]?.price;
  const actualExit = record.exit_executions?.[0]?.price;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Plan vs Actual */}
      <div className="lg:col-span-1 space-y-4">
        {/* Financial Outcome — shown separately, not as headline */}
        {record.result_amount != null && (
          <div className={cn(
            "p-5 rounded-xl border",
            record.result_amount > 0
              ? "border-emerald-500/30 bg-emerald-500/5"
              : "border-rose-500/30 bg-rose-500/5"
          )}>
            <div className="flex items-center gap-2 mb-3">
              {record.result_amount > 0
                ? <TrendingUp className="w-4 h-4 text-emerald-500" />
                : <TrendingDown className="w-4 h-4 text-rose-500" />
              }
              <span className="text-[10px] font-mono uppercase tracking-wider text-text-tertiary">Financial Outcome</span>
            </div>
            <div className={cn(
              "text-3xl font-bold font-mono",
              record.result_amount > 0 ? "text-emerald-400" : "text-rose-400"
            )}>
              {record.result_amount > 0 ? "+" : ""}£{Math.abs(record.result_amount).toFixed(2)}
            </div>
            {record.result_r != null && (
              <div className="text-xs text-text-tertiary mt-1">
                {record.result_r.toFixed(2)}R achieved
                {snapshot && ` vs ${snapshot.calculatedRRR?.toFixed(2)}R planned`}
              </div>
            )}
          </div>
        )}

        {/* Plan snapshot comparison */}
        {snapshot && (
          <div className="p-5 bg-background-elevated/30 border border-border-slate/50 rounded-xl">
            <h3 className="text-xs font-mono font-bold uppercase text-text-tertiary mb-4">Plan vs. Actual</h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-text-tertiary">Entry</span>
                <div className="text-right">
                  <div className="text-text-tertiary line-through">{snapshot.entryPrice}</div>
                  <div className={cn("font-mono font-bold", actualEntry === parseFloat(snapshot.entryPrice) ? "text-emerald-400" : "text-amber-400")}>
                    {actualEntry ?? "—"}
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-tertiary">Stop</span>
                <div className="text-right">
                  <div className="text-text-tertiary line-through">{snapshot.stopLoss}</div>
                  <div className="font-mono">{record.entry_executions?.[0]?.price ?? "—"}</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-tertiary">Planned RRR</span>
                <span className="font-mono text-text-primary">{snapshot.calculatedRRR?.toFixed(2)}R</span>
              </div>
              {record.result_r != null && (
                <div className="flex justify-between items-center">
                  <span className="text-text-tertiary">Achieved RRR</span>
                  <span className={cn(
                    "font-mono font-bold",
                    record.result_r >= snapshot.calculatedRRR ? "text-emerald-400" : "text-amber-400"
                  )}>
                    {record.result_r.toFixed(2)}R
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Review Form */}
      <div className="lg:col-span-2 p-6 bg-background-elevated/40 border border-border-slate/50 rounded-xl space-y-6">
        <div>
          <h2 className="text-lg font-bold uppercase text-text-primary">Process Quality Review</h2>
          <p className="text-xs text-text-tertiary mt-1">
            Score the process — not the outcome. A losing trade with strong adherence scores higher than a winning trade with broken rules.
          </p>
        </div>

        {/* Score sliders */}
        <div className="space-y-5 pt-2">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-text-secondary">Plan Adherence</span>
              <span className={cn("font-mono font-bold", cappedAdherence >= 80 ? "text-emerald-500" : cappedAdherence >= 60 ? "text-amber-500" : "text-rose-500")}>
                {cappedAdherence} / 100
              </span>
            </div>
            <input type="range" min="0" max="100" value={planAdherenceScore}
              onChange={e => setPlanAdherenceScore(parseInt(e.target.value))}
              className="w-full accent-emerald-500" />
            {isWinner && hasDeviations && cappedAdherence > 79 && (
              <p className="text-[10px] text-amber-400">Score capped at 79 — profitable trade with identified rule deviations.</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-text-secondary">Risk Discipline</span>
              <span className={cn("font-mono font-bold", riskDisciplineScore >= 80 ? "text-emerald-500" : riskDisciplineScore >= 60 ? "text-amber-500" : "text-rose-500")}>
                {riskDisciplineScore} / 100
              </span>
            </div>
            <input type="range" min="0" max="100" value={riskDisciplineScore}
              onChange={e => setRiskDisciplineScore(parseInt(e.target.value))}
              className="w-full accent-emerald-500" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-text-secondary">Journal Completeness</span>
              <span className={cn("font-mono font-bold", journalCompletenessScore >= 80 ? "text-emerald-500" : journalCompletenessScore >= 60 ? "text-amber-500" : "text-rose-500")}>
                {journalCompletenessScore} / 100
              </span>
            </div>
            <input type="range" min="0" max="100" value={journalCompletenessScore}
              onChange={e => setJournalCompletenessScore(parseInt(e.target.value))}
              className="w-full accent-emerald-500" />
          </div>
        </div>

        <div className={cn(
          "p-4 rounded-lg border text-center",
          compositeScore >= 80 ? "border-emerald-500/30 bg-emerald-500/5" : compositeScore >= 60 ? "border-amber-500/30 bg-amber-500/5" : "border-rose-500/30 bg-rose-500/5"
        )}>
          <span className="text-[10px] font-mono uppercase tracking-wider text-text-tertiary block mb-1">Composite Process Score</span>
          <span className={cn("text-3xl font-bold font-mono", compositeScore >= 80 ? "text-emerald-500" : compositeScore >= 60 ? "text-amber-500" : "text-rose-500")}>
            {compositeScore}
          </span>
        </div>

        {/* Deviations */}
        <div className="space-y-3 pt-4 border-t border-border-slate/20">
          <label className="text-[10px] uppercase tracking-wider font-mono text-text-tertiary block">Rule Deviations Identified</label>
          <div className="flex gap-2">
            <input type="text" value={newDeviation} onChange={e => setNewDeviation(e.target.value)}
              placeholder="e.g. Moved stop loss after entry..."
              onKeyDown={e => e.key === "Enter" && addDeviation()}
              className="flex-1 bg-background-primary border border-border-slate/50 rounded-lg p-3 text-xs text-text-primary focus:outline-none" />
            <button onClick={addDeviation} className="px-3 text-xs border border-border-slate/50 rounded-lg hover:bg-background-elevated text-text-secondary transition-colors">Add</button>
          </div>
          {deviations.map((d, i) => (
            <div key={i} className="flex gap-2 items-center text-xs text-rose-400 bg-rose-500/5 border border-rose-500/20 px-3 py-2 rounded">
              <AlertTriangle className="w-3 h-3 shrink-0" />
              <span>{d}</span>
            </div>
          ))}
        </div>

        {/* Strengths */}
        <div className="space-y-3">
          <label className="text-[10px] uppercase tracking-wider font-mono text-text-tertiary block">Process Strengths</label>
          <div className="flex gap-2">
            <input type="text" value={newStrength} onChange={e => setNewStrength(e.target.value)}
              placeholder="e.g. Respected original invalidation level..."
              onKeyDown={e => e.key === "Enter" && addStrength()}
              className="flex-1 bg-background-primary border border-border-slate/50 rounded-lg p-3 text-xs text-text-primary focus:outline-none" />
            <button onClick={addStrength} className="px-3 text-xs border border-border-slate/50 rounded-lg hover:bg-background-elevated text-text-secondary transition-colors">Add</button>
          </div>
          {strengths.map((s, i) => (
            <div key={i} className="flex gap-2 items-center text-xs text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 px-3 py-2 rounded">
              <ShieldCheck className="w-3 h-3 shrink-0" />
              <span>{s}</span>
            </div>
          ))}
        </div>

        {/* Reflection */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-wider font-mono text-text-tertiary block">Personal Reflection</label>
          <textarea rows={3} value={userReflection} onChange={e => setUserReflection(e.target.value)}
            placeholder="What will you do differently next time?"
            className="w-full bg-background-primary border border-border-slate/50 rounded-lg p-3 text-xs text-text-primary focus:outline-none" />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-emerald-500 text-background-primary font-bold uppercase tracking-wider text-xs py-4 rounded-lg hover:bg-emerald-400 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving Review..." : "Complete Process Review"}
        </button>
      </div>
    </div>
  );
}
