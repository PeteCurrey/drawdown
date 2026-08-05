"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { 
  ArrowRight, 
  ShieldAlert, 
  Info, 
  Save,
  Lock
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

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
}

interface TradePlan {
  id: string;
  instrument: string;
  direction: string;
  proposed_size: number;
  stop_loss: number;
  planned_risk_amount: number;
  planned_risk_percent: number;
  planned_reward_risk: number;
  account_id: string;
}

export function RecordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("planId");
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [plan, setPlan] = useState<TradePlan | null>(null);
  const [snapshot, setSnapshot] = useState<PlanSnapshot | null>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState("");

  // Record form fields
  const [actualEntry, setActualEntry] = useState("");
  const [actualStop, setActualStop] = useState("");
  const [actualExit, setActualExit] = useState("");
  const [actualSize, setActualSize] = useState("");
  const [openedAt, setOpenedAt] = useState(new Date().toISOString().slice(0, 16));
  const [closedAt, setClosedAt] = useState("");
  const [fees, setFees] = useState("0");
  const [emotionNotes, setEmotionNotes] = useState("");
  const [postTradeNotes, setPostTradeNotes] = useState("");

  const [saving, setSaving] = useState(false);
  const [savedRecordId, setSavedRecordId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUser(user);

      const { data: accountsData } = await supabase
        .from("trading_accounts")
        .select("id, name, currency")
        .eq("is_active", true);

      if (accountsData) {
        setAccounts(accountsData);
        if (accountsData.length > 0) setSelectedAccountId(accountsData[0].id);
      }

      if (planId) {
        const { data: planData } = await supabase
          .from("trade_plans")
          .select("*")
          .eq("id", planId)
          .single();

        if (planData) {
          setPlan(planData);
          setActualEntry(String(planData.entry_zone?.min ?? ""));
          setActualStop(String(planData.stop_loss ?? ""));
          setActualSize(String(planData.proposed_size ?? ""));
          setSelectedAccountId(planData.account_id);
        }

        // Load snapshot
        const { data: snapData } = await supabase
          .from("trade_plan_snapshots")
          .select("snapshot_data")
          .eq("trade_plan_id", planId)
          .single();

        if (snapData?.snapshot_data) {
          setSnapshot(snapData.snapshot_data as PlanSnapshot);
        }
      }

      setLoading(false);
    }
    load();
  }, [planId, supabase]);

  const handleSave = async () => {
    if (!user || !selectedAccountId) return;
    setSaving(true);

    const entryVal = parseFloat(actualEntry) || 0;
    const exitVal = parseFloat(actualExit) || null;
    const stopVal = parseFloat(actualStop) || 0;
    const sizeVal = parseFloat(actualSize) || 0;

    const entryExecutions = [{ price: entryVal, size: sizeVal, time: openedAt }];
    const exitExecutions = exitVal ? [{ price: exitVal, size: sizeVal, time: closedAt }] : [];

    // Calculate result if closed
    let resultAmount = null;
    let resultR = null;
    if (exitVal && plan) {
      const pipValue = 10; // simplified
      const direction = plan.direction === "long" ? 1 : -1;
      resultAmount = (exitVal - entryVal) * direction * sizeVal * 100000;
      const riskDist = Math.abs(entryVal - stopVal);
      resultR = riskDist > 0 ? (Math.abs(exitVal - entryVal) / riskDist) * direction : 0;
    }

    const { data: recordData, error } = await supabase
      .from("trade_records")
      .insert({
        trade_plan_id: planId || null,
        user_id: user.id,
        account_id: selectedAccountId,
        entry_executions: entryExecutions,
        exit_executions: exitExecutions,
        opened_at: openedAt ? new Date(openedAt).toISOString() : null,
        closed_at: closedAt ? new Date(closedAt).toISOString() : null,
        fees: parseFloat(fees) || 0,
        result_amount: resultAmount,
        result_r: resultR,
        source: "manual"
      })
      .select()
      .single();

    setSaving(false);

    if (!error && recordData) {
      setSavedRecordId(recordData.id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-text-tertiary font-mono">
        // RETRIEVING PLAN CONTEXT...
      </div>
    );
  }

  if (savedRecordId) {
    return (
      <div className="max-w-xl mx-auto p-8 border border-border-slate/50 bg-background-elevated/40 rounded-xl space-y-6 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mx-auto">
          <Save className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold uppercase text-text-primary">Trade Recorded</h2>
          <p className="text-xs text-text-tertiary">
            Actual parameters locked. Proceed to compare against your original plan.
          </p>
        </div>
        <div className="pt-4 flex gap-4">
          <Link
            href="/dashboard"
            className="flex-1 border border-border-slate/50 text-text-secondary text-xs font-mono uppercase py-4 rounded-lg hover:bg-background-elevated text-center transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href={`/dashboard/review/${savedRecordId}`}
            className="flex-1 bg-emerald-500 text-background-primary text-xs font-bold uppercase py-4 rounded-lg hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2"
          >
            Review vs. Plan <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Immutable Plan Snapshot */}
      <div className="space-y-4">
        <div className="p-5 bg-background-elevated/30 border border-border-slate/50 rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-4 h-4 text-text-tertiary" />
            <h3 className="text-xs font-mono font-bold uppercase text-text-tertiary">Original Plan (Locked)</h3>
          </div>

          {snapshot ? (
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-border-slate/20">
                <span className="text-text-tertiary">Instrument</span>
                <span className="font-mono text-text-primary">{snapshot.instrument}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border-slate/20">
                <span className="text-text-tertiary">Direction</span>
                <span className={cn("font-mono font-bold", snapshot.direction === "long" ? "text-emerald-400" : "text-rose-400")}>
                  {snapshot.direction.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border-slate/20">
                <span className="text-text-tertiary">Planned Entry</span>
                <span className="font-mono">{snapshot.entryPrice}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border-slate/20">
                <span className="text-text-tertiary">Planned SL</span>
                <span className="font-mono text-rose-400">{snapshot.stopLoss}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border-slate/20">
                <span className="text-text-tertiary">Target</span>
                <span className="font-mono text-emerald-400">{snapshot.targetPrice}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border-slate/20">
                <span className="text-text-tertiary">Planned Size</span>
                <span className="font-mono">{snapshot.proposedLots} lots</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border-slate/20">
                <span className="text-text-tertiary">Planned Risk</span>
                <span className="font-mono">£{snapshot.plannedRiskAmount?.toFixed(2)} ({snapshot.plannedRiskPercent?.toFixed(2)}%)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-text-tertiary">Planned RRR</span>
                <span className="font-mono font-bold text-emerald-400">{snapshot.calculatedRRR?.toFixed(2)}R</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-text-tertiary italic">No plan linked. Manual record.</p>
          )}
        </div>

        {/* Account selector if no plan */}
        {!planId && (
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-wider font-mono text-text-tertiary block">Account</label>
            <select
              value={selectedAccountId}
              onChange={e => setSelectedAccountId(e.target.value)}
              className="w-full bg-background-primary border border-border-slate/50 rounded-lg p-3 text-xs text-text-primary focus:outline-none"
            >
              {accounts.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Actual Execution Form */}
      <div className="lg:col-span-2 p-6 bg-background-elevated/40 border border-border-slate/50 rounded-xl space-y-6">
        <div>
          <h2 className="text-lg font-bold uppercase text-text-primary">Record Actual Execution</h2>
          <p className="text-xs text-text-tertiary mt-1">
            Enter what actually happened through your broker. The original plan is immutable.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-wider font-mono text-text-tertiary block">Actual Entry Price</label>
            <input type="text" value={actualEntry} onChange={e => setActualEntry(e.target.value)}
              className="w-full bg-background-primary border border-border-slate/50 rounded-lg p-3 text-xs text-text-primary focus:outline-none focus:border-emerald-500" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-wider font-mono text-text-tertiary block">Actual Stop</label>
            <input type="text" value={actualStop} onChange={e => setActualStop(e.target.value)}
              className="w-full bg-background-primary border border-border-slate/50 rounded-lg p-3 text-xs text-text-primary focus:outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-wider font-mono text-text-tertiary block">Exit Price (if closed)</label>
            <input type="text" value={actualExit} onChange={e => setActualExit(e.target.value)}
              placeholder="Leave blank if open"
              className="w-full bg-background-primary border border-border-slate/50 rounded-lg p-3 text-xs text-text-primary focus:outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-wider font-mono text-text-tertiary block">Actual Lot Size</label>
            <input type="text" value={actualSize} onChange={e => setActualSize(e.target.value)}
              className="w-full bg-background-primary border border-border-slate/50 rounded-lg p-3 text-xs text-text-primary focus:outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-wider font-mono text-text-tertiary block">Opened At</label>
            <input type="datetime-local" value={openedAt} onChange={e => setOpenedAt(e.target.value)}
              className="w-full bg-background-primary border border-border-slate/50 rounded-lg p-3 text-xs text-text-primary focus:outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-wider font-mono text-text-tertiary block">Closed At (if closed)</label>
            <input type="datetime-local" value={closedAt} onChange={e => setClosedAt(e.target.value)}
              className="w-full bg-background-primary border border-border-slate/50 rounded-lg p-3 text-xs text-text-primary focus:outline-none" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-wider font-mono text-text-tertiary block">Fees / Commission / Spread Cost</label>
          <input type="number" value={fees} onChange={e => setFees(e.target.value)}
            className="w-full bg-background-primary border border-border-slate/50 rounded-lg p-3 text-xs text-text-primary focus:outline-none" />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-wider font-mono text-text-tertiary block">Post-Trade Notes</label>
          <textarea rows={3} value={postTradeNotes} onChange={e => setPostTradeNotes(e.target.value)}
            placeholder="What happened during the trade? Any notable observations..."
            className="w-full bg-background-primary border border-border-slate/50 rounded-lg p-3 text-xs text-text-primary focus:outline-none" />
        </div>

        <div className="p-4 border border-border-slate/30 bg-background-primary/40 rounded-lg text-xs text-text-tertiary flex gap-2">
          <Info className="w-4 h-4 shrink-0 text-text-tertiary mt-0.5" />
          <span>The original plan snapshot is permanently locked. Only actual execution parameters are being recorded here.</span>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || !actualEntry}
          className="w-full bg-emerald-500 text-background-primary font-bold uppercase tracking-wider text-xs py-4 rounded-lg hover:bg-emerald-400 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Trade Record"}
        </button>
      </div>
    </div>
  );
}
