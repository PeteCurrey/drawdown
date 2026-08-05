"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle,
  Play, 
  ArrowRight, 
  Save, 
  Plus, 
  Calculator,
  ChevronRight,
  Sparkles,
  Lock,
  Wallet,
  Settings,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { INSTRUMENTS_LIST } from "@/lib/instruments";

interface TradingAccount {
  id: string;
  name: string;
  account_type: string;
  broker_name?: string;
  currency: string;
  starting_balance: number;
  current_equity: number;
}

interface RiskPolicy {
  id: string;
  max_risk_per_trade_percent: number;
  max_risk_per_trade_amount: number;
  max_daily_loss_percent: number;
  max_weekly_loss_percent: number;
  minimum_reward_risk: number;
}

interface Preparation {
  id: string;
  outcome: "ready" | "caution" | "stand_down";
  session_date: string;
}

export function PlanClient() {
  const supabase = createClient();
  
  // Loading & Base State
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [accounts, setAccounts] = useState<TradingAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [activePolicy, setActivePolicy] = useState<RiskPolicy | null>(null);
  const [recentPrep, setRecentPrep] = useState<Preparation | null>(null);

  // Form State
  const [instrument, setInstrument] = useState(INSTRUMENTS_LIST[0]);
  const [direction, setDirection] = useState<"long" | "short">("long");
  const [entryPrice, setEntryPrice] = useState("1.27500");
  const [stopLoss, setStopLoss] = useState("1.27200");
  const [invalidationLevel, setInvalidationLevel] = useState("1.27000");
  const [targetPrice, setTargetPrice] = useState("1.28500");
  const [proposedLots, setProposedLots] = useState("1.0");
  const [setupType, setSetupType] = useState("liquidity_void");
  const [reasoning, setReasoning] = useState("");
  const [contradictoryEvidence, setContradictoryEvidence] = useState("");
  const [confidence, setConfidence] = useState<number>(3); // 1-5 rating

  // Checklist items
  const [checklistItems, setChecklistItems] = useState([
    { text: "Higher timeframe direction checked", checked: false },
    { text: "No high-impact news within 15 minutes", checked: false },
    { text: "Calculated size matches risk parameters", checked: false },
    { text: "Invalidation level clearly identified on charts", checked: false }
  ]);

  const [planSaved, setPlanSaved] = useState(false);
  const [savedPlanId, setSavedPlanId] = useState<string | null>(null);

  // Load User, Accounts, and latest Preparation
  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUser(user);

      // Load accounts
      const { data: accountsData } = await supabase
        .from("trading_accounts")
        .select("*")
        .eq("is_active", true);

      if (accountsData && accountsData.length > 0) {
        setAccounts(accountsData);
        setSelectedAccountId(accountsData[0].id);
      }

      // Load latest preparation
      const { data: prepData } = await supabase
        .from("session_preparations")
        .select("id, outcome, session_date")
        .order("completed_at", { ascending: false })
        .limit(1);

      if (prepData && prepData.length > 0) {
        setRecentPrep(prepData[0]);
      }
      setLoading(false);
    }
    loadData();
  }, [supabase]);

  // Load active policy
  useEffect(() => {
    if (!selectedAccountId) return;

    async function loadPolicy() {
      const { data: policyData } = await supabase
        .from("risk_policies")
        .select("*")
        .eq("account_id", selectedAccountId)
        .order("version", { ascending: false })
        .limit(1);

      if (policyData && policyData.length > 0) {
        setActivePolicy(policyData[0]);
      } else {
        setActivePolicy(null);
      }
    }
    loadPolicy();
  }, [selectedAccountId, supabase]);

  // Calculate calculations
  const entryVal = parseFloat(entryPrice) || 0;
  const stopVal = parseFloat(stopLoss) || 0;
  const targetVal = parseFloat(targetPrice) || 0;
  const lotsVal = parseFloat(proposedLots) || 0;

  // Pip / Point Stop Distance calculation
  const isJpy = instrument.includes("JPY");
  const multiplier = isJpy ? 100 : 10000;
  const stopDistance = Math.abs(entryVal - stopVal) * multiplier;

  // Leverage unit calculation
  const riskUnits = lotsVal * 100000; // standard lot is 100,000 units
  const stopLossDistanceVal = Math.abs(entryVal - stopVal);
  const plannedRiskAmount = riskUnits * stopLossDistanceVal;

  const activeAccount = accounts.find(a => a.id === selectedAccountId);
  const balance = activeAccount?.current_equity || activeAccount?.starting_balance || 10000;
  const plannedRiskPercent = balance > 0 ? (plannedRiskAmount / balance) * 100 : 0;

  // Reward-to-Risk ratio
  const riskDist = Math.abs(entryVal - stopVal);
  const rewardDist = Math.abs(targetVal - entryVal);
  const calculatedRRR = riskDist > 0 ? rewardDist / riskDist : 0;

  // Checklist handler
  const handleCheck = (index: number) => {
    setChecklistItems(prev => {
      const updated = [...prev];
      updated[index].checked = !updated[index].checked;
      return updated;
    });
  };

  // Plan Quality Checks
  const qualityChecks: string[] = [];
  if (!invalidationLevel) {
    qualityChecks.push("No invalidation level specified.");
  }
  if (activePolicy) {
    if (plannedRiskPercent > activePolicy.max_risk_per_trade_percent) {
      qualityChecks.push("Your proposed risk is above the limit in your personal risk policy.");
    }
    if (calculatedRRR < activePolicy.minimum_reward_risk) {
      qualityChecks.push(`Planned RRR (${calculatedRRR.toFixed(1)}R) is below the minimum required (${activePolicy.minimum_reward_risk}R).`);
    }
  }
  const allChecked = checklistItems.every(i => i.checked);
  if (!allChecked) {
    qualityChecks.push("Required pre-trade checklist items are incomplete.");
  }

  // Save Trade Plan
  const handleSavePlan = async () => {
    if (!selectedAccountId || !user) return;

    const checklistResults = checklistItems.map(item => ({
      item: item.text,
      checked: item.checked
    }));

    const entryZone = { min: entryVal * 0.999, max: entryVal * 1.001 };

    // 1. Create plan
    const { data: planData, error: planError } = await supabase
      .from("trade_plans")
      .insert({
        user_id: user.id,
        account_id: selectedAccountId,
        preparation_id: recentPrep?.id || null,
        instrument,
        asset_class: instrument.includes("USD") || instrument.includes("JPY") || instrument.includes("EUR") ? "forex" : "index",
        direction,
        setup_id: setupType,
        entry_zone: entryZone,
        invalidation_level: parseFloat(invalidationLevel) || null,
        stop_loss: stopVal,
        target_logic: `Target RRR of ${calculatedRRR.toFixed(1)}R`,
        proposed_size: lotsVal,
        planned_risk_amount: plannedRiskAmount,
        planned_risk_percent: plannedRiskPercent,
        planned_reward_risk: calculatedRRR,
        reasoning,
        contradictory_evidence: contradictoryEvidence || null,
        checklist_results: checklistResults,
        status: "ready",
        ready_at: new Date().toISOString()
      })
      .select()
      .single();

    if (planError || !planData) {
      console.error(planError);
      return;
    }

    // 2. Create immutable snapshot (prevent hindsight bias)
    const snapshotData = {
      instrument,
      direction,
      entryPrice,
      stopLoss,
      invalidationLevel,
      targetPrice,
      proposedLots,
      plannedRiskAmount,
      plannedRiskPercent,
      calculatedRRR,
      checklistResults
    };

    const { error: snapshotError } = await supabase
      .from("trade_plan_snapshots")
      .insert({
        trade_plan_id: planData.id,
        user_id: user.id,
        snapshot_data: snapshotData
      });

    if (!snapshotError) {
      setPlanSaved(true);
      setSavedPlanId(planData.id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-text-tertiary font-mono">
        // RETRIEVING RISK ENVIRONMENT...
      </div>
    );
  }

  // Force Preparation first
  if (!recentPrep) {
    return (
      <div className="max-w-xl mx-auto p-8 border border-border-slate/50 bg-background-elevated/40 rounded-xl space-y-6 text-center">
        <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold uppercase text-text-primary">Preparation Required</h2>
          <p className="text-sm text-text-tertiary leading-relaxed">
            Please complete today's Preparation before planning a trade. This ensures you are psychologically prepared to place risk.
          </p>
        </div>
        <div className="pt-4">
          <Link 
            href="/dashboard/prepare"
            className="inline-flex bg-emerald-500 text-background-primary text-xs font-bold uppercase py-4 px-8 rounded-lg hover:bg-emerald-400 transition-colors"
          >
            Start Session Prep
          </Link>
        </div>
      </div>
    );
  }

  if (planSaved && savedPlanId) {
    return (
      <div className="max-w-xl mx-auto p-8 border border-border-slate/50 bg-background-elevated/40 rounded-xl space-y-6 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold uppercase text-text-primary">Trade Plan Preserved</h2>
          <p className="text-xs text-text-tertiary">
            Your original plan parameters are locked in the registry. Proceed to place the trade elsewhere.
          </p>
        </div>
        <div className="pt-4">
          <Link 
            href={`/dashboard/plan/${savedPlanId}/execute`}
            className="w-full inline-flex justify-center items-center gap-2 bg-emerald-500 text-background-primary font-bold uppercase tracking-wider text-xs py-4 rounded-lg hover:bg-emerald-400 transition-colors"
          >
            Proceed to Execute Elsewhere <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Parameters & Calculation */}
      <div className="lg:col-span-2 p-6 bg-background-elevated/40 border border-border-slate/50 rounded-xl space-y-6">
        <div>
          <h2 className="text-lg font-bold uppercase text-text-primary">New Strategy Plan</h2>
          <p className="text-xs text-text-tertiary">Define the entry criteria and invalidation zone before taking action.</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider font-mono text-text-tertiary block mb-2">Instrument</label>
            <select 
              value={instrument}
              onChange={e => setInstrument(e.target.value)}
              className="w-full bg-background-primary border border-border-slate/50 rounded-lg p-3 text-xs text-text-primary focus:outline-none"
            >
              {INSTRUMENTS_LIST.map(inst => (
                <option key={inst} value={inst}>{inst}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider font-mono text-text-tertiary block mb-2">Direction</label>
            <select 
              value={direction}
              onChange={e => setDirection(e.target.value as any)}
              className="w-full bg-background-primary border border-border-slate/50 rounded-lg p-3 text-xs text-text-primary focus:outline-none"
            >
              <option value="long">Buy / Long</option>
              <option value="short">Sell / Short</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider font-mono text-text-tertiary block mb-2">Lots / Size</label>
            <input 
              type="number" step="0.01" value={proposedLots} 
              onChange={e => setProposedLots(e.target.value)}
              className="w-full bg-background-primary border border-border-slate/50 rounded-lg p-3 text-xs text-text-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider font-mono text-text-tertiary block mb-2">Entry Price</label>
            <input 
              type="text" value={entryPrice} 
              onChange={e => setEntryPrice(e.target.value)}
              className="w-full bg-background-primary border border-border-slate/50 rounded-lg p-3 text-xs text-text-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider font-mono text-text-tertiary block mb-2">Stop Loss</label>
            <input 
              type="text" value={stopLoss} 
              onChange={e => setStopLoss(e.target.value)}
              className="w-full bg-background-primary border border-border-slate/50 rounded-lg p-3 text-xs text-text-primary focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider font-mono text-text-tertiary block mb-2">Target Exit</label>
            <input 
              type="text" value={targetPrice} 
              onChange={e => setTargetPrice(e.target.value)}
              className="w-full bg-background-primary border border-border-slate/50 rounded-lg p-3 text-xs text-text-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider font-mono text-text-tertiary block mb-2">Invalidation</label>
            <input 
              type="text" value={invalidationLevel} 
              onChange={e => setInvalidationLevel(e.target.value)}
              className="w-full bg-background-primary border border-border-slate/50 rounded-lg p-3 text-xs text-text-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-wider font-mono text-text-tertiary block">Trading Setup Type</label>
            <select 
              value={setupType}
              onChange={e => setSetupType(e.target.value)}
              className="w-full bg-background-primary border border-border-slate/50 rounded-lg p-3 text-xs text-text-primary focus:outline-none"
            >
              <option value="liquidity_void">Liquidity Void Reversal</option>
              <option value="fvg_imbalance">Fair Value Gap Fill</option>
              <option value="session_high_low">Session Range Break</option>
              <option value="order_block">Order Block Confluence</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-wider font-mono text-text-tertiary block">Your Confidence Rating</label>
            <input 
              type="range" min="1" max="5" value={confidence} 
              onChange={e => setConfidence(parseInt(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <span className="text-[10px] font-mono text-text-tertiary block text-right">Rating: {confidence} / 5</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-wider font-mono text-text-tertiary block">Primary Reason for taking this trade</label>
          <textarea 
            required
            rows={2}
            value={reasoning}
            onChange={e => setReasoning(e.target.value)}
            placeholder="Describe the technical setup and key observations..."
            className="w-full bg-background-primary border border-border-slate/50 rounded-lg p-3 text-xs text-text-primary focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-wider font-mono text-text-tertiary block">Contradictory evidence (Reason NOT to take the trade)</label>
          <textarea 
            rows={2}
            value={contradictoryEvidence}
            onChange={e => setContradictoryEvidence(e.target.value)}
            placeholder="Any upcoming high-impact news, correlated exposure constraints, or reasons to pause..."
            className="w-full bg-background-primary border border-border-slate/50 rounded-lg p-3 text-xs text-text-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Rules, checklist & verification */}
      <div className="space-y-6">
        {/* Calculations card */}
        <div className="p-6 bg-background-elevated/40 border border-border-slate/50 rounded-xl space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase text-text-primary">// METRICS CALCULATION</h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between border-b border-border-slate/20 pb-2">
              <span className="text-text-tertiary">Stop Distance</span>
              <span className="font-mono text-text-primary">{stopDistance.toFixed(1)} Pips</span>
            </div>
            <div className="flex justify-between border-b border-border-slate/20 pb-2">
              <span className="text-text-tertiary">Calculated Risk</span>
              <span className="font-mono text-text-primary">£{plannedRiskAmount.toFixed(2)} ({plannedRiskPercent.toFixed(2)}%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-tertiary">Reward-to-Risk (RRR)</span>
              <span className="font-mono font-bold text-emerald-500">{calculatedRRR.toFixed(2)}R</span>
            </div>
          </div>
        </div>

        {/* Pre-trade Checklist */}
        <div className="p-6 bg-background-elevated/40 border border-border-slate/50 rounded-xl space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase text-text-primary">// PRE-TRADE CHECKLIST</h3>
          <div className="space-y-3">
            {checklistItems.map((item, idx) => (
              <label key={idx} className="flex gap-3 items-center text-xs text-text-secondary cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={item.checked} 
                  onChange={() => handleCheck(idx)}
                  className="rounded bg-background-primary border-border-slate focus:ring-0 text-emerald-500"
                />
                <span>{item.text}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Quality Checks and Save */}
        <div className="p-6 bg-background-elevated/40 border border-border-slate/50 rounded-xl space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase text-text-primary">// PLAN VALIDATION</h3>
          
          {qualityChecks.length > 0 ? (
            <div className="p-4 rounded border border-amber-500/30 bg-amber-500/5 space-y-2">
              {qualityChecks.map((check, idx) => (
                <div key={idx} className="text-xs text-amber-500 flex gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{check}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded border border-emerald-500/30 bg-emerald-500/5 text-xs text-emerald-400 flex gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Strategy parameters confirm full risk rule compliance.</span>
            </div>
          )}

          <button
            onClick={handleSavePlan}
            disabled={!instrument || !reasoning}
            className="w-full bg-emerald-500 text-background-primary font-bold uppercase tracking-wider text-xs py-4 rounded-lg hover:bg-emerald-400 transition-colors disabled:opacity-50"
          >
            Lock Pre-Trade Plan
          </button>
        </div>
      </div>
    </div>
  );
}
