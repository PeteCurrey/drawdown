"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle,
  Play, 
  ArrowRight, 
  Plus, 
  User, 
  Activity, 
  TrendingUp, 
  Check, 
  Sparkles, 
  Calendar,
  Lock,
  Wallet,
  Calculator
} from "lucide-react";
import Link from "next/link";
import { INSTRUMENTS_LIST } from "@/lib/instruments";

interface TradingAccount {
  id: string;
  name: string;
  account_type: "demo" | "personal" | "prop_evaluation" | "funded_prop";
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
  max_trades_per_session: number;
  minimum_reward_risk: number;
}

export function PrepareClient() {
  const supabase = createClient() as any;
  
  // Loading & State
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [accounts, setAccounts] = useState<TradingAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [activePolicy, setActivePolicy] = useState<RiskPolicy | null>(null);
  
  // Account Form
  const [showNewAccountForm, setShowNewAccountForm] = useState(false);
  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountType, setNewAccountType] = useState<TradingAccount["account_type"]>("demo");
  const [newBrokerName, setNewBrokerName] = useState("");
  const [newCurrency, setNewCurrency] = useState("GBP");
  const [newStartingBalance, setNewStartingBalance] = useState("10000");

  // Policy Form (if missing)
  const [showPolicyForm, setShowPolicyForm] = useState(false);
  const [maxRiskPercent, setMaxRiskPercent] = useState("1.0");
  const [maxRiskAmount, setMaxRiskAmount] = useState("100");
  const [maxDailyLossPercent, setMaxDailyLossPercent] = useState("5.0");
  const [maxWeeklyLossPercent, setMaxWeeklyLossPercent] = useState("10.0");
  const [maxTradesPerSession, setMaxTradesPerSession] = useState("3");
  const [minRewardRisk, setMinRewardRisk] = useState("2.0");

  // Readiness Checklist Form
  const [sessionType, setSessionType] = useState("london");
  const [selectedInstrument, setSelectedInstrument] = useState<string>(INSTRUMENTS_LIST[0]?.slug ?? "");
  const [sleepRating, setSleepRating] = useState<number>(5);
  const [focusRating, setFocusRating] = useState<number>(5);
  const [fomoRating, setFomoRating] = useState<number>(1); // 1 = low fomo, 5 = high fomo
  const [distractionRating, setDistractionRating] = useState<number>(1);
  const [recoveryUrgency, setRecoveryUrgency] = useState<number>(1); // desire to recover loss
  const [followPlanRating, setFollowPlanRating] = useState<number>(5); // willingness to follow rules
  const [overrideReason, setOverrideReason] = useState("");
  
  // Prep status
  const [prepSaved, setPrepSaved] = useState(false);
  const [savedOutcome, setSavedOutcome] = useState<"ready" | "caution" | "stand_down" | null>(null);

  // Load User and Accounts
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
      setLoading(false);
    }
    loadData();
  }, [supabase]);

  // Load Risk Policy when account changes
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
        setShowPolicyForm(false);
      } else {
        setActivePolicy(null);
        setShowPolicyForm(true);
      }
    }
    loadPolicy();
  }, [selectedAccountId, supabase]);

  // Handle Account Submission
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccountName || !newStartingBalance || !user) return;

    const startingBal = parseFloat(newStartingBalance);
    const { data, error } = await supabase
      .from("trading_accounts")
      .insert({
        user_id: user.id,
        name: newAccountName,
        account_type: newAccountType,
        broker_name: newBrokerName || null,
        currency: newCurrency,
        starting_balance: startingBal,
        current_equity: startingBal,
        equity_source: "manual"
      })
      .select()
      .single();

    if (!error && data) {
      setAccounts(prev => [...prev, data]);
      setSelectedAccountId(data.id);
      setShowNewAccountForm(false);
      // Reset fields
      setNewAccountName("");
      setNewBrokerName("");
    }
  };

  // Handle Policy Submission
  const handleCreatePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccountId || !user) return;

    const { data, error } = await supabase
      .from("risk_policies")
      .insert({
        account_id: selectedAccountId,
        user_id: user.id,
        version: 1,
        max_risk_per_trade_percent: parseFloat(maxRiskPercent),
        max_risk_per_trade_amount: parseFloat(maxRiskAmount),
        max_daily_loss_percent: parseFloat(maxDailyLossPercent),
        max_weekly_loss_percent: parseFloat(maxWeeklyLossPercent),
        max_trades_per_session: parseInt(maxTradesPerSession),
        minimum_reward_risk: parseFloat(minRewardRisk),
        user_confirmed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (!error && data) {
      setActivePolicy(data);
      setShowPolicyForm(false);
    }
  };

  // Evaluate outcomes based on checklist parameters
  const getOutcome = (): "ready" | "caution" | "stand_down" => {
    // Logic checklist
    if (followPlanRating < 3 || sleepRating <= 2) {
      return "stand_down";
    }
    if (fomoRating >= 4 || recoveryUrgency >= 4 || distractionRating >= 4) {
      return "caution";
    }
    return "ready";
  };

  const currentOutcome = getOutcome();

  // Save Session Prep
  const handleSavePrep = async (standDownSelected: boolean = false) => {
    if (!selectedAccountId || !user) return;

    const finalOutcome = standDownSelected ? "stand_down" : currentOutcome;
    
    // Create risk snapshot
    const currentAccount = accounts.find(a => a.id === selectedAccountId);
    const riskSnapshot = {
      starting_balance: currentAccount?.starting_balance || 0,
      current_equity: currentAccount?.current_equity || 0,
      max_risk_per_trade_percent: activePolicy?.max_risk_per_trade_percent || 1.0,
      max_trades_per_session: activePolicy?.max_trades_per_session || 3
    };

    const readinessAnswers = [
      { question: "Sleep Quality", score: sleepRating },
      { question: "Focus Level", score: focusRating },
      { question: "FOMO / Urgency", score: fomoRating },
      { question: "Distractions", score: distractionRating },
      { question: "Desire to recover losses", score: recoveryUrgency },
      { question: "Willingness to follow rules", score: followPlanRating }
    ];

    const { data, error } = await supabase
      .from("session_preparations")
      .insert({
        account_id: selectedAccountId,
        user_id: user.id,
        session_type: sessionType,
        readiness_answers: readinessAnswers,
        risk_snapshot: riskSnapshot,
        outcome: finalOutcome,
        override_reason: finalOutcome === "caution" && overrideReason ? overrideReason : null,
        completed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (!error && data) {
      setPrepSaved(true);
      setSavedOutcome(finalOutcome);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-[#87877F] text-xs font-medium">
        Retrieving operating environment…
      </div>
    );
  }

  // 1. Force Account Creation if none exists
  if (accounts.length === 0) {
    return (
      <div className="max-w-xl mx-auto p-8 border border-[#E6E4DE] bg-white rounded-[8px] shadow-[0_1px_2px_rgba(14,13,10,0.04),0_2px_8px_rgba(14,13,10,0.05)] space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight text-[#181818] flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#18B880]" /> Let's establish your trading account
          </h2>
          <p className="text-xs text-[#87877F] leading-relaxed">
            The Drawdown OS workflow requires an active account reference. We do not require broker passwords or credentials.
          </p>
        </div>

        <form onSubmit={handleCreateAccount} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.09em] font-semibold text-[#87877F] block">Account Label</label>
            <input 
              type="text" 
              required
              placeholder="e.g. My Personal Live Account"
              value={newAccountName}
              onChange={e => setNewAccountName(e.target.value)}
              className="w-full bg-white border border-[#E6E4DE] rounded-[6px] p-3 text-sm text-[#181818] focus:outline-none focus:border-[#F9771D] focus:ring-1 focus:ring-[#F9771D]/20 transition-all placeholder:text-[#87877F]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.09em] font-semibold text-[#87877F] block">Type</label>
              <select 
                value={newAccountType}
                onChange={e => setNewAccountType(e.target.value as any)}
                className="w-full bg-white border border-[#E6E4DE] rounded-[6px] p-3 text-sm text-[#181818] focus:outline-none focus:border-[#F9771D] focus:ring-1 focus:ring-[#F9771D]/20 transition-all"
              >
                <option value="demo">Demo / Paper</option>
                <option value="personal">Personal Live</option>
                <option value="prop_evaluation">Prop Evaluation</option>
                <option value="funded_prop">Funded Prop</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.09em] font-semibold text-[#87877F] block">Broker Name</label>
              <input 
                type="text" 
                placeholder="e.g. Pepperstone"
                value={newBrokerName}
                onChange={e => setNewBrokerName(e.target.value)}
                className="w-full bg-white border border-[#E6E4DE] rounded-[6px] p-3 text-sm text-[#181818] focus:outline-none focus:border-[#F9771D] focus:ring-1 focus:ring-[#F9771D]/20 transition-all placeholder:text-[#87877F]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.09em] font-semibold text-[#87877F] block">Currency</label>
              <input 
                type="text" 
                required
                value={newCurrency}
                onChange={e => setNewCurrency(e.target.value)}
                className="w-full bg-white border border-[#E6E4DE] rounded-[6px] p-3 text-sm text-[#181818] focus:outline-none focus:border-[#F9771D] focus:ring-1 focus:ring-[#F9771D]/20 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.09em] font-semibold text-[#87877F] block">Starting Balance</label>
              <input 
                type="number" 
                required
                value={newStartingBalance}
                onChange={e => setNewStartingBalance(e.target.value)}
                className="w-full bg-white border border-[#E6E4DE] rounded-[6px] p-3 text-sm text-[#181818] focus:outline-none focus:border-[#F9771D] focus:ring-1 focus:ring-[#F9771D]/20 transition-all"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#181818] text-white font-semibold uppercase tracking-wider text-xs py-3.5 rounded-[6px] hover:bg-[#2A2A2A] transition-colors"
          >
            Register Account & Proceed
          </button>
        </form>
      </div>
    );
  }

  // 2. Force Risk Policy Creation if none exists
  if (showPolicyForm || !activePolicy) {
    return (
      <div className="max-w-xl mx-auto p-8 border border-[#E6E4DE] bg-white rounded-[8px] shadow-[0_1px_2px_rgba(14,13,10,0.04),0_2px_8px_rgba(14,13,10,0.05)] space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight text-[#181818] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#18B880]" /> Define your Personal Risk Policy
          </h2>
          <p className="text-xs text-[#87877F] leading-relaxed">
            Specify the risk constraints for this account. The Drawdown OS will compare trade sizes and losses to these values.
          </p>
        </div>

        <form onSubmit={handleCreatePolicy} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.09em] font-semibold text-[#87877F] block">Max Risk Per Trade (%)</label>
              <input 
                type="number" 
                step="0.1" 
                required
                value={maxRiskPercent}
                onChange={e => setMaxRiskPercent(e.target.value)}
                className="w-full bg-white border border-[#E6E4DE] rounded-[6px] p-3 text-sm text-[#181818] focus:outline-none focus:border-[#F9771D] focus:ring-1 focus:ring-[#F9771D]/20 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.09em] font-semibold text-[#87877F] block">Max Risk Per Trade (Amt)</label>
              <input 
                type="number" 
                required
                value={maxRiskAmount}
                onChange={e => setMaxRiskAmount(e.target.value)}
                className="w-full bg-white border border-[#E6E4DE] rounded-[6px] p-3 text-sm text-[#181818] focus:outline-none focus:border-[#F9771D] focus:ring-1 focus:ring-[#F9771D]/20 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.09em] font-semibold text-[#87877F] block">Max Daily Loss Limit (%)</label>
              <input 
                type="number" 
                step="0.1" 
                required
                value={maxDailyLossPercent}
                onChange={e => setMaxDailyLossPercent(e.target.value)}
                className="w-full bg-white border border-[#E6E4DE] rounded-[6px] p-3 text-sm text-[#181818] focus:outline-none focus:border-[#F9771D] focus:ring-1 focus:ring-[#F9771D]/20 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.09em] font-semibold text-[#87877F] block">Max Weekly Loss Limit (%)</label>
              <input 
                type="number" 
                step="0.1" 
                required
                value={maxWeeklyLossPercent}
                onChange={e => setMaxWeeklyLossPercent(e.target.value)}
                className="w-full bg-white border border-[#E6E4DE] rounded-[6px] p-3 text-sm text-[#181818] focus:outline-none focus:border-[#F9771D] focus:ring-1 focus:ring-[#F9771D]/20 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.09em] font-semibold text-[#87877F] block">Max Trades per Session</label>
              <input 
                type="number" 
                required
                value={maxTradesPerSession}
                onChange={e => setMaxTradesPerSession(e.target.value)}
                className="w-full bg-white border border-[#E6E4DE] rounded-[6px] p-3 text-sm text-[#181818] focus:outline-none focus:border-[#F9771D] focus:ring-1 focus:ring-[#F9771D]/20 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.09em] font-semibold text-[#87877F] block">Min Planned RRR</label>
              <input 
                type="number" 
                step="0.1" 
                required
                value={minRewardRisk}
                onChange={e => setMinRewardRisk(e.target.value)}
                className="w-full bg-white border border-[#E6E4DE] rounded-[6px] p-3 text-sm text-[#181818] focus:outline-none focus:border-[#F9771D] focus:ring-1 focus:ring-[#F9771D]/20 transition-all"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#181818] text-white font-semibold uppercase tracking-wider text-xs py-3.5 rounded-[6px] hover:bg-[#2A2A2A] transition-colors"
          >
            Confirm & Save Policy Rules
          </button>
        </form>
      </div>
    );
  }

  // 3. Prep Completed View
  if (prepSaved) {
    return (
      <div className="max-w-xl mx-auto p-8 border border-[#E6E4DE] bg-white rounded-[8px] shadow-[0_1px_2px_rgba(14,13,10,0.04),0_2px_8px_rgba(14,13,10,0.05)] space-y-6 text-center">
        <div className="flex justify-center">
          {savedOutcome === "ready" && (
            <div className="w-14 h-14 rounded-full bg-[#F0FDF8] border border-[rgba(24,184,128,0.25)] flex items-center justify-center text-[#18B880]">
              <ShieldCheck className="w-7 h-7" />
            </div>
          )}
          {savedOutcome === "caution" && (
            <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <AlertTriangle className="w-7 h-7" />
            </div>
          )}
          {savedOutcome === "stand_down" && (
            <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <ShieldAlert className="w-7 h-7" />
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xl font-bold tracking-tight text-[#181818]">
            Session preparation complete
          </h2>
          <p className="text-xs text-[#87877F]">
            Your readiness assessment has been logged to the system registry.
          </p>
        </div>

        <div className="p-4 rounded-[6px] bg-[#F5F4F1] text-xs text-[#474744] leading-relaxed border border-[#EEECE7]">
          {savedOutcome === "ready" && "Outcome: Ready. Proceed to construct your pre-trade strategy plan."}
          {savedOutcome === "caution" && "Outcome: Caution. Follow the process rules carefully. Consider risk size constraints."}
          {savedOutcome === "stand_down" && "Outcome: Stand Down. Discipline requires stepping back from execution today."}
        </div>

        <div className="pt-2 flex gap-3">
          <Link 
            href="/dashboard"
            className="flex-1 border border-[#E6E4DE] text-[#181818] text-xs font-semibold uppercase py-3.5 rounded-[6px] hover:bg-[#F5F4F1] transition-colors"
          >
            Dashboard
          </Link>
          {savedOutcome !== "stand_down" ? (
            <Link 
              href="/dashboard/plan"
              className="flex-1 bg-[#181818] text-white text-xs font-semibold uppercase py-3.5 rounded-[6px] hover:bg-[#2A2A2A] transition-colors flex items-center justify-center gap-2"
            >
              Construct Strategy Plan <ArrowRight className="w-4 h-4 text-[#F9771D]" />
            </Link>
          ) : (
            <button
              onClick={() => {
                setPrepSaved(false);
                setSavedOutcome(null);
              }}
              className="flex-1 bg-[#F3F2EE] border border-[#E6E4DE] text-[#474744] text-xs font-semibold uppercase py-3.5 rounded-[6px] hover:bg-[#E6E4DE] transition-colors"
            >
              Reset Session Prep
            </button>
          )}
        </div>
      </div>
    );
  }

  // 4. Default Readiness Checklist
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Configuration Column */}
      <div className="space-y-6 lg:col-span-1">
        <div className="p-5 bg-white border border-[#E6E4DE] rounded-[8px] shadow-[0_1px_2px_rgba(14,13,10,0.04),0_2px_8px_rgba(14,13,10,0.05)] space-y-4">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.09em] text-[#87877F] flex items-center gap-2">
            <Wallet className="w-4 h-4 text-[#18B880]" /> Active Account Context
          </h2>
          
          <div className="space-y-4">
            <select 
              value={selectedAccountId}
              onChange={e => setSelectedAccountId(e.target.value)}
              className="w-full bg-white border border-[#E6E4DE] rounded-[6px] p-2.5 text-xs text-[#181818] focus:outline-none focus:border-[#F9771D]"
            >
              {accounts.map(a => (
                <option key={a.id} value={a.id}>{a.name} ({a.broker_name || "Self-Managed"})</option>
              ))}
            </select>
            
            <div className="p-3 bg-[#F5F4F1] rounded-[6px] border border-[#EEECE7] space-y-2 text-xs">
              <div className="flex justify-between text-[#87877F]">
                <span>Account Type</span>
                <span className="font-medium text-[#474744]">{accounts.find(a => a.id === selectedAccountId)?.account_type}</span>
              </div>
              <div className="flex justify-between text-[#87877F]">
                <span>Balance Limit</span>
                <span className="font-medium dd-tabular text-[#474744]">{accounts.find(a => a.id === selectedAccountId)?.currency} {accounts.find(a => a.id === selectedAccountId)?.starting_balance.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 bg-white border border-[#E6E4DE] rounded-[8px] shadow-[0_1px_2px_rgba(14,13,10,0.04),0_2px_8px_rgba(14,13,10,0.05)] space-y-4">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.09em] text-[#87877F] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#18B880]" /> Active Risk Limits
          </h2>
          
          <div className="space-y-3 text-xs">
            <div className="flex justify-between border-b border-[#EEECE7] pb-2">
              <span className="text-[#87877F]">Max Risk Per Trade</span>
              <span className="font-semibold dd-tabular text-[#181818]">{activePolicy?.max_risk_per_trade_percent}% / £{activePolicy?.max_risk_per_trade_amount}</span>
            </div>
            <div className="flex justify-between border-b border-[#EEECE7] pb-2">
              <span className="text-[#87877F]">Max Daily Drawdown</span>
              <span className="font-semibold dd-tabular text-[#181818]">{activePolicy?.max_daily_loss_percent}%</span>
            </div>
            <div className="flex justify-between border-b border-[#EEECE7] pb-2">
              <span className="text-[#87877F]">Max Weekly Drawdown</span>
              <span className="font-semibold dd-tabular text-[#181818]">{activePolicy?.max_weekly_loss_percent}%</span>
            </div>
            <div className="flex justify-between border-b border-[#EEECE7] pb-2">
              <span className="text-[#87877F]">Max Session Trades</span>
              <span className="font-semibold dd-tabular text-[#181818]">{activePolicy?.max_trades_per_session}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#87877F]">Minimum Plan RRR</span>
              <span className="font-semibold dd-tabular text-[#181818]">{activePolicy?.minimum_reward_risk}R</span>
            </div>
          </div>
        </div>
      </div>

      {/* Checklist and preparation questions */}
      <div className="lg:col-span-2 space-y-6">
        <div className="p-6 bg-white border border-[#E6E4DE] rounded-[8px] shadow-[0_1px_2px_rgba(14,13,10,0.04),0_2px_8px_rgba(14,13,10,0.05)] space-y-6">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-[#181818]">
              Session Readiness Checklist
            </h2>
            <p className="text-xs text-[#87877F] mt-1">
              Verify your physical, mental, and situational readiness parameters.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.09em] font-semibold text-[#87877F] block">Trading Session</label>
              <select 
                value={sessionType}
                onChange={e => setSessionType(e.target.value)}
                className="w-full bg-white border border-[#E6E4DE] rounded-[6px] p-3 text-xs text-[#181818] focus:outline-none focus:border-[#F9771D]"
              >
                <option value="london">London Open</option>
                <option value="new_york">New York Session</option>
                <option value="asian">Asian / Sydney</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.09em] font-semibold text-[#87877F] block">Primary Instrument Focus</label>
              <select 
                value={selectedInstrument}
                onChange={e => setSelectedInstrument(e.target.value)}
                className="w-full bg-white border border-[#E6E4DE] rounded-[6px] p-3 text-xs text-[#181818] focus:outline-none focus:border-[#F9771D]"
              >
                {INSTRUMENTS_LIST.map(inst => (
                  <option key={inst.slug} value={inst.slug}>{inst.slug}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Rating sliders */}
          <div className="space-y-4 pt-4 border-t border-[#EEECE7]">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-[#474744]">Sleep & Recovery Quality</span>
                <span className="font-medium text-[#87877F]">{sleepRating} / 5</span>
              </div>
              <input 
                type="range" min="1" max="5" value={sleepRating} 
                onChange={e => setSleepRating(parseInt(e.target.value))}
                className="w-full accent-[#F9771D]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-[#474744]">Mental Focus Level</span>
                <span className="font-medium text-[#87877F]">{focusRating} / 5</span>
              </div>
              <input 
                type="range" min="1" max="5" value={focusRating} 
                onChange={e => setFocusRating(parseInt(e.target.value))}
                className="w-full accent-[#F9771D]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-[#474744]">FOMO / Impatience Tendency</span>
                <span className="font-medium text-[#87877F]">{fomoRating} / 5 (1 = Low, 5 = High)</span>
              </div>
              <input 
                type="range" min="1" max="5" value={fomoRating} 
                onChange={e => setFomoRating(parseInt(e.target.value))}
                className="w-full accent-[#F9771D]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-[#474744]">Desire to Recover Prior Losses</span>
                <span className="font-medium text-[#87877F]">{recoveryUrgency} / 5</span>
              </div>
              <input 
                type="range" min="1" max="5" value={recoveryUrgency} 
                onChange={e => setRecoveryUrgency(parseInt(e.target.value))}
                className="w-full accent-[#F9771D]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-[#474744]">Willingness to strictly execute the pre-defined plan</span>
                <span className="font-medium text-[#87877F]">{followPlanRating} / 5</span>
              </div>
              <input 
                type="range" min="1" max="5" value={followPlanRating} 
                onChange={e => setFollowPlanRating(parseInt(e.target.value))}
                className="w-full accent-[#F9771D]"
              />
            </div>
          </div>

          {/* Outcome guidance indicator */}
          <div className="pt-4 border-t border-[#EEECE7] space-y-4">
            <div className="text-[10px] font-semibold uppercase tracking-[0.09em] text-[#87877F]">
              Process Direction
            </div>
            
            {currentOutcome === "ready" && (
              <div className="p-4 rounded-[6px] border border-[rgba(24,184,128,0.25)] bg-[#F0FDF8] text-xs text-[#18B880] flex gap-3">
                <ShieldCheck className="w-5 h-5 shrink-0 text-[#18B880]" />
                <div>
                  <span className="font-semibold uppercase block text-[#18B880]">Ready to trade</span>
                  <span className="text-[#474744]">System flags no psychological limits. Continue onto pre-trade planning.</span>
                </div>
              </div>
            )}

            {currentOutcome === "caution" && (
              <div className="space-y-3">
                <div className="p-4 rounded-[6px] border border-amber-200 bg-amber-50/60 text-xs text-amber-800 flex gap-3">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600" />
                  <div>
                    <span className="font-semibold uppercase block text-amber-900">Caution required</span>
                    <span className="text-amber-800">You have marked a strong desire to recover losses or elevated FOMO. Consider pausing before creating a new plan.</span>
                  </div>
                </div>
                <input 
                  type="text"
                  required
                  placeholder="Enter reason to override caution..."
                  value={overrideReason}
                  onChange={e => setOverrideReason(e.target.value)}
                  className="w-full bg-white border border-[#E6E4DE] rounded-[6px] p-3 text-xs text-[#181818] focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            {currentOutcome === "stand_down" && (
              <div className="p-4 rounded-[6px] border border-rose-200 bg-rose-50/60 text-xs text-rose-800 flex gap-3">
                <ShieldAlert className="w-5 h-5 shrink-0 text-rose-600" />
                <div>
                  <span className="font-semibold uppercase block text-rose-900">Stand Down Advisory</span>
                  <span className="text-rose-800">Checklist indicates compromised recovery or plan willingness. System suggests Standing Down today.</span>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={() => handleSavePrep(true)}
              className="flex-1 border border-rose-300 text-rose-600 text-xs font-semibold uppercase py-3.5 rounded-[6px] hover:bg-rose-50 transition-all"
            >
              No Trade Today
            </button>
            <button
              onClick={() => handleSavePrep(false)}
              disabled={currentOutcome === "caution" && !overrideReason}
              className={cn(
                "flex-1 text-white text-xs font-semibold uppercase py-3.5 rounded-[6px] transition-all",
                currentOutcome === "stand_down" 
                  ? "bg-rose-600 hover:bg-rose-700" 
                  : "bg-[#181818] hover:bg-[#2A2A2A]",
                currentOutcome === "caution" && !overrideReason && "opacity-50 cursor-not-allowed"
              )}
            >
              {currentOutcome === "stand_down" ? "Record Stand Down" : "Complete Preparation"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
