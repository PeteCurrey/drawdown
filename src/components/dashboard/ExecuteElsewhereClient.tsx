"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { 
  ShieldAlert, 
  ArrowRight, 
  AlertTriangle,
  XCircle,
  CheckCircle,
  HelpCircle,
  Info
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PlanDetails {
  id: string;
  instrument: string;
  direction: string;
  proposed_size: number;
}

export function ExecuteElsewhereClient({ planId }: { planId: string }) {
  const router = useRouter();
  const supabase = createClient() as any;
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<PlanDetails | null>(null);
  
  // Selection
  const [outcomeType, setOutcomeType] = useState<"placed" | "not_taken">("placed");
  const [notTakenReason, setNotTakenReason] = useState("setup_disappeared");
  const [otherReasonText, setOtherReasonText] = useState("");

  useEffect(() => {
    async function loadPlan() {
      const { data, error } = await supabase
        .from("trade_plans")
        .select("id, instrument, direction, proposed_size")
        .eq("id", planId)
        .single();

      if (!error && data) {
        setPlan(data);
      }
      setLoading(false);
    }
    loadPlan();
  }, [planId, supabase]);

  const handleConfirm = async () => {
    if (!plan) return;

    if (outcomeType === "placed") {
      // Mark as executed_elsewhere
      const { error } = await supabase
        .from("trade_plans")
        .update({ status: "executed_elsewhere" })
        .eq("id", planId);

      if (!error) {
        // Proceed to Record (Stage 4) passing the plan ID in query param
        router.push(`/dashboard/record?planId=${planId}`);
      }
    } else {
      // Mark as not_taken
      const finalReason = notTakenReason === "other" ? otherReasonText : notTakenReason;
      const { error } = await supabase
        .from("trade_plans")
        .update({ 
          status: "not_taken",
          target_logic: `Not taken: ${finalReason}`
        })
        .eq("id", planId);

      if (!error) {
        // Not taken is a valid process outcome. Send back to dashboard
        router.push("/dashboard");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-text-tertiary font-mono">
        // RETRIEVING PLAN REFERENCE...
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="max-w-xl mx-auto p-8 border border-border-slate/50 bg-background-elevated/40 rounded-xl space-y-4 text-center text-xs">
        <XCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-sm font-bold uppercase text-text-primary">Plan Reference Not Found</h2>
        <p className="text-text-tertiary">The specified strategy plan does not exist or has expired.</p>
        <Link href="/dashboard/plan" className="inline-block bg-background-elevated px-4 py-2 border rounded">
          Plan Workspace
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Explicit Boundary Alert */}
      <div className="p-6 border border-amber-500/30 bg-amber-500/5 rounded-xl space-y-3">
        <div className="flex items-center gap-2 text-amber-500">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider">Execute Elsewhere Boundary</h3>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">
          Place the trade independently through your chosen broker. Drawdown does not execute, route or transmit orders.
        </p>
      </div>

      <div className="p-6 bg-background-elevated/40 border border-border-slate/50 rounded-xl space-y-6">
        <div>
          <h3 className="text-xs font-mono font-bold uppercase text-text-primary mb-1">
            // PLAN REFERENCE: {plan.instrument} {plan.direction.toUpperCase()} ({plan.proposed_size} Lots)
          </h3>
          <p className="text-xs text-text-tertiary">Select the placement outcome to complete the workflow transition.</p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setOutcomeType("placed")}
              className={cn(
                "p-4 rounded-lg border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all",
                outcomeType === "placed"
                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                  : "bg-background-primary border-border-slate/40 text-text-tertiary hover:text-text-primary"
              )}
            >
              <CheckCircle className="w-4 h-4" /> Trade Placed
            </button>
            <button
              onClick={() => setOutcomeType("not_taken")}
              className={cn(
                "p-4 rounded-lg border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all",
                outcomeType === "not_taken"
                  ? "bg-rose-500/10 border-rose-500/40 text-rose-400"
                  : "bg-background-primary border-border-slate/40 text-text-tertiary hover:text-text-primary"
              )}
            >
              <XCircle className="w-4 h-4" /> Trade Not Taken
            </button>
          </div>

          {outcomeType === "not_taken" && (
            <div className="space-y-4 pt-2 border-t border-border-slate/20 animate-in fade-in duration-200">
              <label className="text-[10px] uppercase tracking-wider font-mono text-text-tertiary block">Reason for not placing the trade</label>
              <select 
                value={notTakenReason}
                onChange={e => setNotTakenReason(e.target.value)}
                className="w-full bg-background-primary border border-border-slate/50 rounded-lg p-3 text-xs text-text-primary focus:outline-none"
              >
                <option value="setup_disappeared">Setup / Scenario Disappeared</option>
                <option value="spread_too_wide">Spread too wide</option>
                <option value="risk_condition_changed">Risk condition changed</option>
                <option value="news_approached">High-impact news approached</option>
                <option value="personal_rule_prevented">Personal rule prevented entry</option>
                <option value="other">Other reason</option>
              </select>

              {notTakenReason === "other" && (
                <input 
                  type="text"
                  required
                  placeholder="Explain reason..."
                  value={otherReasonText}
                  onChange={e => setOtherReasonText(e.target.value)}
                  className="w-full bg-background-primary border border-border-slate/50 rounded-lg p-3 text-xs text-text-primary focus:outline-none focus:border-rose-500"
                />
              )}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-border-slate/20 flex gap-4">
          <Link 
            href="/dashboard"
            className="flex-1 border border-border-slate/50 text-text-secondary text-xs font-mono uppercase py-4 rounded-lg hover:bg-background-elevated text-center transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={handleConfirm}
            className="flex-1 bg-emerald-500 text-background-primary text-xs font-bold uppercase py-4 rounded-lg hover:bg-emerald-400 transition-colors"
          >
            {outcomeType === "placed" ? "I placed this trade through my broker" : "Confirm Trade Not Taken"}
          </button>
        </div>
      </div>
    </div>
  );
}
