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
  const supabase = createClient();
  
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
  const [selectedInstrument, setSelectedInstrument] = useState(INSTRUMENTS_LIST[0]);
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
      <div className="flex items-center justify-center min-h-[60vh] text-text-tertiary font-mono">
        // RETRIEVING OPERATING ENVIRONMENT...
      </div>
    );
  }

  // 1. Force Account Creation if none exists
  if (accounts.length === 0) {
    return (
      <div className="max-w-xl mx-auto p-8 border border-border-slate/50 bg-background-elevated/40 rounded-xl space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-bold uppercase text-text-primary flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-500" /> Let's establish your trading account
          </h2>
          <p className="text-sm text-text-tertiary leading-relaxed">
            The Drawdown OS workflow requires an active account reference. We do not require broker passwords or credentials.
          </p>
        </div>

        <form onSubmit={handleCreateAccount} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-wider font-mono text-text-tertiary block">Account Label</label>
            <input 
              type="text" 
              required
              placeholder="e.g. My Personal Live Account"
              value={newAccountName}
              onChange={e => setNewAccountName(e.target.value)}
              className="w-full bg-background-primary border border-border-slate/50 rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider font-mono text-text-tertiary block">Type</label>
              <select 
                value={newAccountType}
                onChange={e => setNewAccountType(e.target.value as any)}
                className="w-full bg-background-primary border border-border-slate/50 rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:border-emerald-500"
              >
                <option value="demo">Demo / Paper</option>
                <option value="personal">Personal Live</option>
                <option value="prop_evaluation">Prop Evaluation</option>
                <option value="funded_prop">Funded Prop</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider font-mono text-text-tertiary block">Broker Name</label>
              <input 
                type="text" 
                placeholder="e.g. Pepperstone"
                value={newBrokerName}
                onChange={e => setNewBrokerName(e.target.value)}
                className="w-full bg-background-primary border border-border-slate/50 rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider font-mono text-text-tertiary block">Currency</label>
              <input 
                type="text" 
                required
                value={newCurrency}
                onChange={e => setNewCurrency(e.target.value)}
                className="w-full bg-background-primary border border-border-slate/50 rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider font-mono text-text-tertiary block">Starting Balance</label>
              <input 
                type="number" 
                required
                value={newStartingBalance}
                onChange={e => setNewStartingBalance(e.target.value)}
                className="w-full bg-background-primary border border-border-slate/50 rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-emerald-500 text-background-primary font-bold uppercase tracking-wider text-xs py-4 rounded-lg hover:bg-emerald-400 transition-colors"
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
      <div className="max-w-xl mx-auto p-8 border border-border-slate/50 bg-background-elevated/40 rounded-xl space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-bold uppercase text-text-primary flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" /> Define your Personal Risk Policy
          </h2>
          <p className="text-sm text-text-tertiary leading-relaxed">
            Specify the risk constraints for this account. The Drawdown OS will compare trade sizes and losses to these values.
          </p>
        </div>

        <form onSubmit={handleCreatePolicy} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider font-mono text-text-tertiary block">Max Risk Per Trade (%)</label>
              <input 
                type="number" 
                step="0.1" 
                required
                value={maxRiskPercent}
                onChange={e => setMaxRiskPercent(e.target.value)}
                className="w-full bg-background-primary border border-border-slate/50 rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider font-mono text-text-tertiary block">Max Risk Per Trade (Amt)</label>
              <input 
                type="number" 
                required
                value={maxRiskAmount}
                onChange={e => setMaxRiskAmount(e.target.value)}
                className="w-full bg-background-primary border border-border-slate/50 rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider font-mono text-text-tertiary block">Max Daily Loss Limit (%)</label>
              <input 
                type="number" 
                step="0.1" 
                required
                value={maxDailyLossPercent}
                onChange={e => setMaxDailyLossPercent(e.target.value)}
                className="w-full bg-background-primary border border-border-slate/50 rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider font-mono text-text-tertiary block">Max Weekly Loss Limit (%)</label>
              <input 
                type="number" 
                step="0.1" 
                required
                value={maxWeeklyLossPercent}
                onChange={e => setMaxWeeklyLossPercent(e.target.value)}
                className="w-full bg-background-primary border border-border-slate/50 rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider font-mono text-text-tertiary block">Max Trades per Session</label>
              <input 
                type="number" 
                required
                value={maxTradesPerSession}
                onChange={e => setMaxTradesPerSession(e.target.value)}
                className="w-full bg-background-primary border border-border-slate/50 rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider font-mono text-text-tertiary block">Min Planned RRR</label>
              <input 
                type="number" 
                step="0.1" 
                required
                value={minRewardRisk}
                onChange={e => setMinRewardRisk(e.target.value)}
                className="w-full bg-background-primary border border-border-slate/50 rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-emerald-500 text-background-primary font-bold uppercase tracking-wider text-xs py-4 rounded-lg hover:bg-emerald-400 transition-colors"
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
      <div className="max-w-xl mx-auto p-8 border border-border-slate/50 bg-background-elevated/40 rounded-xl space-y-6 text-center">
        <div className="flex justify-center">
          {savedOutcome === "ready" && (
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
              <ShieldCheck className="w-8 h-8" />
            </div>
          )}
          {savedOutcome === "caution" && (
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <AlertTriangle className="w-8 h-8" />
            </div>
          )}
          {savedOutcome === "stand_down" && (
            <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500">
              <ShieldAlert className="w-8 h-8" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold uppercase text-text-primary">
            Session preparation complete
          </h2>
          <p className="text-xs text-text-tertiary">
            Your readiness assessment has been logged to the system registry.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-background-primary/50 text-xs text-text-secondary leading-relaxed border border-border-slate/30">
          {savedOutcome === "ready" && "Outcome: Ready. Proceed to construct your pre-trade strategy plan."}
          {savedOutcome === "caution" && "Outcome: Caution. Follow the process rules carefully. Consider risk size constraints."}
          {savedOutcome === "stand_down" && "Outcome: Stand Down. Discipline requires stepping back from execution today."}
        </div>

        <div className="pt-4 flex gap-4">
          <Link 
            href="/dashboard"
            className="flex-1 border border-border-slate/50 text-text-primary text-xs font-mono uppercase py-4 rounded-lg hover:bg-background-elevated transition-colors"
          >
            Dashboard
          </Link>
          {savedOutcome !== "stand_down" ? (
            <Link 
              href="/dashboard/plan"
              className="flex-1 bg-emerald-500 text-background-primary text-xs font-bold uppercase py-4 rounded-lg hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2"
            >
              Construct Strategy Plan <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <button
              onClick={() => {
                setPrepSaved(false);
                setSavedOutcome(null);
              }}
              className="flex-1 bg-background-elevated border border-border-slate/50 text-text-secondary text-xs font-bold uppercase py-4 rounded-lg hover:bg-background-elevated/80 transition-colors"
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
        <div className="p-6 bg-background-elevated/40 border border-border-slate/50 rounded-xl space-y-4">
          <h2 className="text-xs font-mono font-bold uppercase text-text-primary flex items-center gap-2">
            <Wallet className="w-4 h-4 text-emerald-500" /> Active Account Context
          </h2>
          
          <div className="space-y-4">
            <select 
              value={selectedAccountId}
              onChange={e => setSelectedAccountId(e.target.value)}
              className="w-full bg-background-primary border border-border-slate/50 rounded-lg p-2.5 text-xs text-text-primary focus:outline-none"
            >
              {accounts.map(a => (
                <option key={a.id} value={a.id}>{a.name} ({a.broker_name || "Self-Managed"})</option>
              ))}
            </select>
            
            <div className="p-3 bg-background-primary/50 rounded border border-border-slate/20 space-y-2 text-xs">
              <div className="flex justify-between text-text-tertiary">
                <span>Account Type</span>
                <span className="font-mono text-text-secondary">{accounts.find(a => a.id === selectedAccountId)?.account_type}</span>
              </div>
              <div className="flex justify-between text-text-tertiary">
                <span>Balance Limit</span>
                <span className="font-mono text-text-secondary">{accounts.find(a => a.id === selectedAccountId)?.currency} {accounts.find(a => a.id === selectedAccountId)?.starting_balance.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-background-elevated/40 border border-border-slate/50 rounded-xl space-y-4">
          <h2 className="text-xs font-mono font-bold uppercase text-text-primary flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Active Risk Limits
          </h2>
          
          <div className="space-y-3 text-xs">
            <div className="flex justify-between border-b border-border-slate/20 pb-2">
              <span className="text-text-tertiary">Max Risk Per Trade</span>
              <span className="font-mono font-bold text-text-primary">{activePolicy?.max_risk_per_trade_percent}% / £{activePolicy?.max_risk_per_trade_amount}</span>
            </div>
            <div className="flex justify-between border-b border-border-slate/20 pb-2">
              <span className="text-text-tertiary">Max Daily Drawdown</span>
              <span className="font-mono font-bold text-text-primary">{activePolicy?.max_daily_loss_percent}%</span>
            </div>
            <div className="flex justify-between border-b border-border-slate/20 pb-2">
              <span className="text-text-tertiary">Max Weekly Drawdown</span>
              <span className="font-mono font-bold text-text-primary">{activePolicy?.max_weekly_loss_percent}%</span>
            </div>
            <div className="flex justify-between border-b border-border-slate/20 pb-2">
              <span className="text-text-tertiary">Max Session Trades</span>
              <span className="font-mono font-bold text-text-primary">{activePolicy?.max_trades_per_session}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-tertiary">Minimum Plan RRR</span>
              <span className="font-mono font-bold text-text-primary">{activePolicy?.minimum_reward_risk}R</span>
            </div>
          </div>
        </div>
      </div>

      {/* Checklist and preparation questions */}
      <div className="lg:col-span-2 space-y-6">
        <div className="p-6 bg-background-elevated/40 border border-border-slate/50 rounded-xl space-y-6">
          <div>
            <h2 className="text-lg font-bold uppercase text-text-primary">
              Session Readiness Checklist
            </h2>
            <p className="text-xs text-text-tertiary mt-1">
              Verify your physical, mental, and situational readiness parameters.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider font-mono text-text-tertiary block">Trading Session</label>
              <select 
                value={sessionType}
                onChange={e => setSessionType(e.target.value)}
                className="w-full bg-background-primary border border-border-slate/50 rounded-lg p-3 text-xs text-text-primary focus:outline-none"
              >
                <option value="london">London Open</option>
                <option value="new_york">New York Session</option>
                <option value="asian">Asian / Sydney</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider font-mono text-text-tertiary block">Primary Instrument Focus</label>
              <select 
                value={selectedInstrument}
                onChange={e => setSelectedInstrument(e.target.value)}
                className="w-full bg-background-primary border border-border-slate/50 rounded-lg p-3 text-xs text-text-primary focus:outline-none"
              >
                {INSTRUMENTS_LIST.map(inst => (
                  <option key={inst} value={inst}>{inst}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Rating sliders */}
          <div className="space-y-4 pt-4 border-t border-border-slate/20">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-text-secondary">Sleep & Recovery Quality</span>
                <span className="font-mono text-text-tertiary">{sleepRating} / 5</span>
              </div>
              <input 
                type="range" min="1" max="5" value={sleepRating} 
                onChange={e => setSleepRating(parseInt(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-text-secondary">Mental Focus Level</span>
                <span className="font-mono text-text-tertiary">{focusRating} / 5</span>
              </div>
              <input 
                type="range" min="1" max="5" value={focusRating} 
                onChange={e => setFocusRating(parseInt(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-text-secondary">FOMO / Impatience Tendency</span>
                <span className="font-mono text-text-tertiary">{fomoRating} / 5 (1 = Low, 5 = High)</span>
              </div>
              <input 
                type="range" min="1" max="5" value={fomoRating} 
                onChange={e => setFomoRating(parseInt(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-text-secondary">Desire to Recover Prior Losses</span>
                <span className="font-mono text-text-tertiary">{recoveryUrgency} / 5</span>
              </div>
              <input 
                type="range" min="1" max="5" value={recoveryUrgency} 
                onChange={e => setRecoveryUrgency(parseInt(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-text-secondary">Willingness to strictly execute the pre-defined plan</span>
                <span className="font-mono text-text-tertiary">{followPlanRating} / 5</span>
              </div>
              <input 
                type="range" min="1" max="5" value={followPlanRating} 
                onChange={e => setFollowPlanRating(parseInt(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>
          </div>

          {/* Outcome guidance indicator */}
          <div className="pt-4 border-t border-border-slate/20 space-y-4">
            <div className="text-xs uppercase tracking-wider font-mono text-text-tertiary">
              // PROCESS DIRECTION
            </div>
            
            {currentOutcome === "ready" && (
              <div className="p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5 text-xs text-emerald-400 flex gap-3">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <div>
                  <span className="font-bold uppercase block">Ready to trade</span>
                  System flags no psychological limits. Continue onto pre-trade planning.
                </div>
              </div>
            )}

            {currentOutcome === "caution" && (
              <div className="space-y-3">
                <div className="p-4 rounded-lg border border-amber-500/30 bg-amber-500/5 text-xs text-amber-400 flex gap-3">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <div>
                    <span className="font-bold uppercase block">Caution required</span>
                    You have marked a strong desire to recover losses or elevated FOMO. Consider pausing before creating a new plan.
                  </div>
                </div>
                <input 
                  type="text"
                  required
                  placeholder="Enter reason to override caution..."
                  value={overrideReason}
                  onChange={e => setOverrideReason(e.target.value)}
                  className="w-full bg-background-primary border border-border-slate/50 rounded-lg p-3 text-xs text-text-primary focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            {currentOutcome === "stand_down" && (
              <div className="p-4 rounded-lg border border-rose-500/30 bg-rose-500/5 text-xs text-rose-400 flex gap-3">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <div>
                  <span className="font-bold uppercase block">Stand Down Advisory</span>
                  Checklist indicates compromised recovery or plan willingness. System suggests Standing Down today.
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={() => handleSavePrep(true)}
              className="flex-1 border border-rose-500/40 text-rose-500 text-xs font-bold uppercase py-4 rounded-lg hover:bg-rose-500/10 transition-all"
            >
              No Trade Today
            </button>
            <button
              onClick={() => handleSavePrep(false)}
              disabled={currentOutcome === "caution" && !overrideReason}
              className={cn(
                "flex-1 text-background-primary text-xs font-bold uppercase py-4 rounded-lg transition-all",
                currentOutcome === "stand_down" 
                  ? "bg-rose-500 hover:bg-rose-400" 
                  : "bg-emerald-500 hover:bg-emerald-400",
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
