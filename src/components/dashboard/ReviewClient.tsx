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
      <div className="flex items-center justify-center min-h-[40vh] text-[#87877F] font-mono">
        // LOADING TRADE DATA...
      </div>
    );
  }

  if (!record) {
    return (
      <div className="text-center py-16 text-[#87877F] text-xs">
        Trade record not found.
      </div>
    );
  }

  if (saved) {
    return (
      <div className="max-w-xl mx-auto p-8 border border-[#E6E4DE] bg-white rounded-[8px] shadow-[0_1px_2px_rgba(14,13,10,0.04),0_2px_8px_rgba(14,13,10,0.05)] space-y-6 text-center">
        <div className="w-16 h-16 rounded-full bg-[#F0FDF8] border border-[rgba(24,184,128,0.25)] flex items-center justify-center text-[#18B880] mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold uppercase text-[#181818]">Review Complete</h2>
          <div className={cn(
            "text-4xl font-bold font-mono",
            compositeScore >= 80 ? "text-[#18B880]" : compositeScore >= 60 ? "text-amber-500" : "text-rose-500"
          )}>
            {compositeScore}
          </div>
          <p className="text-xs text-[#87877F]">Process Quality Score</p>
          {isWinner && hasDeviations && (
            <p className="text-xs text-amber-600 italic">
              Note: A profitable trade with identified rule deviations cannot receive a perfect process score.
            </p>
          )}
        </div>
        <div className="pt-4 flex gap-4">
          <Link
            href="/dashboard"
            className="flex-1 border border-[#E6E4DE] text-[#474744] text-xs font-mono uppercase py-4 rounded-[6px] hover:bg-[#F3F2EE] text-center transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/improve"
            className="flex-1 bg-[#181818] text-white text-xs font-semibold uppercase py-3.5 rounded-[6px] hover:bg-[#2A2A2A] transition-colors flex items-center justify-center gap-2"
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
            "p-5 rounded-[8px] border",
            record.result_amount > 0
              ? "border-[rgba(24,184,128,0.25)] bg-[#F0FDF8]"
              : "border-rose-500/30 bg-rose-500/5"
          )}>
            <div className="flex items-center gap-2 mb-3">
              {record.result_amount > 0
                ? <TrendingUp className="w-4 h-4 text-[#18B880]" />
                : <TrendingDown className="w-4 h-4 text-rose-500" />
              }
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#87877F]">Financial Outcome</span>
            </div>
            <div className={cn(
              "text-3xl font-bold font-mono",
              record.result_amount > 0 ? "text-[#18B880]" : "text-[#CE6969]"
            )}>
              {record.result_amount > 0 ? "+" : ""}£{Math.abs(record.result_amount).toFixed(2)}
            </div>
            {record.result_r != null && (
              <div className="text-xs text-[#87877F] mt-1">
                {record.result_r.toFixed(2)}R achieved
                {snapshot && ` vs ${snapshot.calculatedRRR?.toFixed(2)}R planned`}
              </div>
            )}
          </div>
        )}

        {/* Plan snapshot comparison */}
        {snapshot && (
          <div className="p-5 bg-[#F5F4F1] border border-[#E6E4DE] rounded-[8px]">
            <h3 className="text-xs font-mono font-bold uppercase text-[#87877F] mb-4">Plan vs. Actual</h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#87877F]">Entry</span>
                <div className="text-right">
                  <div className="text-[#87877F] line-through">{snapshot.entryPrice}</div>
                  <div className={cn("font-mono font-bold", actualEntry === parseFloat(snapshot.entryPrice) ? "text-[#18B880]" : "text-amber-600")}>
                    {actualEntry ?? "—"}
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#87877F]">Stop</span>
                <div className="text-right">
                  <div className="text-[#87877F] line-through">{snapshot.stopLoss}</div>
                  <div className="font-mono">{record.entry_executions?.[0]?.price ?? "—"}</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#87877F]">Planned RRR</span>
                <span className="font-mono text-[#181818]">{snapshot.calculatedRRR?.toFixed(2)}R</span>
              </div>
              {record.result_r != null && (
                <div className="flex justify-between items-center">
                  <span className="text-[#87877F]">Achieved RRR</span>
                  <span className={cn(
                    "font-mono font-bold",
                    record.result_r >= snapshot.calculatedRRR ? "text-[#18B880]" : "text-amber-600"
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
      <div className="lg:col-span-2 p-6 bg-white border border-[#E6E4DE] rounded-[8px] shadow-[0_1px_2px_rgba(14,13,10,0.04),0_2px_8px_rgba(14,13,10,0.05)] space-y-6">
        <div>
          <h2 className="text-lg font-bold uppercase text-[#181818]">Process Quality Review</h2>
          <p className="text-xs text-[#87877F] mt-1">
            Score the process — not the outcome. A losing trade with strong adherence scores higher than a winning trade with broken rules.
          </p>
        </div>

        {/* Score sliders */}
        <div className="space-y-5 pt-2">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-[#474744]">Plan Adherence</span>
              <span className={cn("font-mono font-bold", cappedAdherence >= 80 ? "text-[#18B880]" : cappedAdherence >= 60 ? "text-amber-500" : "text-rose-500")}>
                {cappedAdherence} / 100
              </span>
            </div>
            <input type="range" min="0" max="100" value={planAdherenceScore}
              onChange={e => setPlanAdherenceScore(parseInt(e.target.value))}
              className="w-full accent-[#F9771D]" />
            {isWinner && hasDeviations && cappedAdherence > 79 && (
              <p className="text-[10px] text-amber-600">Score capped at 79 — profitable trade with identified rule deviations.</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-[#474744]">Risk Discipline</span>
              <span className={cn("font-mono font-bold", riskDisciplineScore >= 80 ? "text-[#18B880]" : riskDisciplineScore >= 60 ? "text-amber-500" : "text-rose-500")}>
                {riskDisciplineScore} / 100
              </span>
            </div>
            <input type="range" min="0" max="100" value={riskDisciplineScore}
              onChange={e => setRiskDisciplineScore(parseInt(e.target.value))}
              className="w-full accent-[#F9771D]" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-[#474744]">Journal Completeness</span>
              <span className={cn("font-mono font-bold", journalCompletenessScore >= 80 ? "text-[#18B880]" : journalCompletenessScore >= 60 ? "text-amber-500" : "text-rose-500")}>
                {journalCompletenessScore} / 100
              </span>
            </div>
            <input type="range" min="0" max="100" value={journalCompletenessScore}
              onChange={e => setJournalCompletenessScore(parseInt(e.target.value))}
              className="w-full accent-[#F9771D]" />
          </div>
        </div>

        <div className={cn(
          "p-4 rounded-[6px] border text-center",
          compositeScore >= 80 ? "border-[rgba(24,184,128,0.25)] bg-[#F0FDF8]" : compositeScore >= 60 ? "border-amber-500/30 bg-amber-500/5" : "border-rose-500/30 bg-rose-500/5"
        )}>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#87877F] block mb-1">Composite Process Score</span>
          <span className={cn("text-3xl font-bold font-mono", compositeScore >= 80 ? "text-[#18B880]" : compositeScore >= 60 ? "text-amber-500" : "text-rose-500")}>
            {compositeScore}
          </span>
        </div>

        {/* Deviations */}
        <div className="space-y-3 pt-4 border-t border-[#EEECE7]">
          <label className="text-[10px] uppercase tracking-wider font-mono text-[#87877F] block">Rule Deviations Identified</label>
          <div className="flex gap-2">
            <input type="text" value={newDeviation} onChange={e => setNewDeviation(e.target.value)}
              placeholder="e.g. Moved stop loss after entry..."
              onKeyDown={e => e.key === "Enter" && addDeviation()}
              className="flex-1 bg-white border border-[#E6E4DE] rounded-[6px] p-3 text-xs text-[#181818] focus:outline-none" />
            <button onClick={addDeviation} className="px-3 text-xs border border-[#E6E4DE] rounded-[6px] hover:bg-[#F3F2EE] text-[#474744] transition-colors">Add</button>
          </div>
          {deviations.map((d, i) => (
            <div key={i} className="flex gap-2 items-center text-xs text-[#CE6969] bg-rose-500/5 border border-rose-500/20 px-3 py-2 rounded">
              <AlertTriangle className="w-3 h-3 shrink-0" />
              <span>{d}</span>
            </div>
          ))}
        </div>

        {/* Strengths */}
        <div className="space-y-3">
          <label className="text-[10px] uppercase tracking-wider font-mono text-[#87877F] block">Process Strengths</label>
          <div className="flex gap-2">
            <input type="text" value={newStrength} onChange={e => setNewStrength(e.target.value)}
              placeholder="e.g. Respected original invalidation level..."
              onKeyDown={e => e.key === "Enter" && addStrength()}
              className="flex-1 bg-white border border-[#E6E4DE] rounded-[6px] p-3 text-xs text-[#181818] focus:outline-none" />
            <button onClick={addStrength} className="px-3 text-xs border border-[#E6E4DE] rounded-[6px] hover:bg-[#F3F2EE] text-[#474744] transition-colors">Add</button>
          </div>
          {strengths.map((s, i) => (
            <div key={i} className="flex gap-2 items-center text-xs text-[#18B880] bg-[#F0FDF8] border border-[rgba(24,184,128,0.25)] px-3 py-2 rounded">
              <ShieldCheck className="w-3 h-3 shrink-0" />
              <span>{s}</span>
            </div>
          ))}
        </div>

        {/* Reflection */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-wider font-mono text-[#87877F] block">Personal Reflection</label>
          <textarea rows={3} value={userReflection} onChange={e => setUserReflection(e.target.value)}
            placeholder="What will you do differently next time?"
            className="w-full bg-white border border-[#E6E4DE] rounded-[6px] p-3 text-xs text-[#181818] focus:outline-none" />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-[#181818] text-white font-semibold uppercase tracking-wider text-xs py-3.5 rounded-[6px] hover:bg-[#2A2A2A] transition-colors disabled:opacity-50"
        >
          {saving ? "Saving Review..." : "Complete Process Review"}
        </button>
      </div>
    </div>
  );
}
