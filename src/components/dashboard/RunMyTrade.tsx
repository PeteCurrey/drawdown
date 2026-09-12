"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Info,
  CheckCircle2,
  Lock,
  ExternalLink,
  Activity,
  BarChart2,
  FileText,
  Clock,
  Sparkles,
  HelpCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { INSTRUMENTS_LIST, instrumentBySlug, tdSymbol } from "@/lib/instruments";
import {
  calculatePositionSize,
  PositionCalculationResult,
  resolveInstrumentSpec,
} from "@/lib/position-sizing";
import { useMarketData } from "@/hooks/useMarketData";

interface TradingAccount {
  id: string;
  name: string;
  account_type: string;
  broker_name?: string;
  currency: string;
  starting_balance: number;
  current_equity: number;
}

interface RunMyTradeProps {
  initialInstrument?: string;
  onPlanSaved?: (planId: string) => void;
}

const POPULAR_INSTRUMENTS = [
  "GBP/USD",
  "EUR/USD",
  "USD/JPY",
  "XAU/USD",
  "NDX",
  "SPX",
  "BTC/USD",
];

export function RunMyTrade({ initialInstrument, onPlanSaved }: RunMyTradeProps) {
  const router = useRouter();
  const supabase = createClient() as any;

  // 1. Account & Environment State
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [accounts, setAccounts] = useState<TradingAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [dailyLossLimitPct, setDailyLossLimitPct] = useState<number>(5.0);
  const [maxDrawdownLimitPct, setMaxDrawdownLimitPct] = useState<number>(10.0);
  const [todayLoss, setTodayLoss] = useState<number>(0);

  // 2. Setup Inputs
  const [instrument, setInstrument] = useState<string>(
    initialInstrument || "GBP/USD"
  );
  const [direction, setDirection] = useState<"long" | "short">("long");
  const [entryPrice, setEntryPrice] = useState<string>("1.27500");
  const [stopPrice, setStopPrice] = useState<string>("1.27200");
  const [targetPrice, setTargetPrice] = useState<string>("1.28250");
  const [riskPct, setRiskPct] = useState<number>(1.0);

  // 3. Discipline Inputs
  const [thesis, setThesis] = useState<string>("");
  const [invalidationCriteria, setInvalidationCriteria] = useState<string>("");
  const [rulesChecked, setRulesChecked] = useState<{
    riskDefined: boolean;
    invalidationClear: boolean;
    noImpendingNews: boolean;
  }>({
    riskDefined: true,
    invalidationClear: false,
    noImpendingNews: false,
  });

  // 4. Persistence & Flow State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [savedPlan, setSavedPlan] = useState<{
    id: string;
    calculation: PositionCalculationResult;
  } | null>(null);

  // Load User & Accounts
  useEffect(() => {
    async function initUserAndAccounts() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          const { data: accountsData } = await supabase
            .from("trading_accounts")
            .select("id, name, account_type, broker_name, currency, starting_balance, current_equity, is_active")
            .eq("user_id", user.id)
            .eq("is_active", true);

          if (accountsData && accountsData.length > 0) {
            setAccounts(accountsData);
            setSelectedAccountId(accountsData[0].id);
          }
        }
      } catch (e) {
        console.error("Failed to load accounts:", e);
      } finally {
        setLoading(false);
      }
    }
    initUserAndAccounts();
  }, [supabase]);

  // Load account risk policy when selected account changes
  useEffect(() => {
    if (!selectedAccountId || selectedAccountId === "reference-account") return;

    async function loadPolicy() {
      try {
        const { data: policy } = await supabase
          .from("risk_policies")
          .select("max_daily_loss_percent, max_weekly_loss_percent, max_risk_per_trade_percent")
          .eq("account_id", selectedAccountId)
          .order("version", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (policy) {
          if (policy.max_daily_loss_percent) {
            setDailyLossLimitPct(policy.max_daily_loss_percent);
          }
          if (policy.max_weekly_loss_percent) {
            setMaxDrawdownLimitPct(policy.max_weekly_loss_percent);
          }
        }
      } catch (err) {
        console.error("Failed to load policy:", err);
      }
    }
    loadPolicy();
  }, [selectedAccountId, supabase]);

  // Active Account resolution
  const activeAccount = useMemo(() => {
    return accounts.find((a) => a.id === selectedAccountId);
  }, [accounts, selectedAccountId]);

  const activeBalance = activeAccount
    ? activeAccount.current_equity || activeAccount.starting_balance || 10000
    : 10000;

  const activeCurrency = activeAccount?.currency || "GBP";
  const currencySymbol = activeCurrency === "USD" ? "$" : activeCurrency === "EUR" ? "€" : "£";

  // Calculate position sizing and risk metrics authoritatively
  const calculation = useMemo<PositionCalculationResult>(() => {
    return calculatePositionSize({
      instrument,
      direction,
      entryPrice: parseFloat(entryPrice) || 0,
      stopPrice: parseFloat(stopPrice) || 0,
      targetPrice: parseFloat(targetPrice) || 0,
      accountBalance: activeBalance,
      riskPct,
      accountLimits: {
        dailyLossLimitPct,
        maxDrawdownLimitPct,
        todayLoss,
      },
    });
  }, [
    instrument,
    direction,
    entryPrice,
    stopPrice,
    targetPrice,
    activeBalance,
    riskPct,
    dailyLossLimitPct,
    maxDrawdownLimitPct,
    todayLoss,
  ]);

  // Market Data resolution (non-intrusive context)
  const matchedInstrument = instrumentBySlug(instrument);
  const hookSlug = matchedInstrument?.hookSlug || instrument.replace(/[\/\-_]/g, "");
  const marketData = useMarketData(hookSlug, "1h");

  // Determine market data freshness
  const freshness = useMemo(() => {
    if (marketData.loading && !marketData.price) {
      return { status: "LOADING", label: "FETCHING", color: "text-[#87877F] border-[#E6E4DE]" };
    }
    if (marketData.error || marketData.price === null) {
      return { status: "UNAVAILABLE", label: "NO FEED", color: "text-[#87877F] border-[#E6E4DE]" };
    }
    if (marketData.is_fallback) {
      return { status: "STALE", label: "CACHED", color: "text-amber-500/80 border-amber-500/30" };
    }
    if (marketData.lastUpdated) {
      const ageMs = Date.now() - marketData.lastUpdated.getTime();
      if (ageMs < 120_000) {
        return { status: "LIVE", label: "LIVE FEED", color: "text-profit border-profit/30 bg-profit/10" };
      }
      if (ageMs < 900_000) {
        return { status: "RECENT", label: "RECENT", color: "text-accent border-accent/30 bg-accent/10" };
      }
      return { status: "STALE", label: "STALE", color: "text-amber-500/80 border-amber-500/30" };
    }
    return { status: "RECENT", label: "FEED READY", color: "text-[#474744] border-[#E6E4DE]" };
  }, [marketData]);

  // Quick risk selection
  const handleSelectRiskPct = (val: number) => {
    setRiskPct(val);
  };

  // Submit Trade Plan
  const handleSavePlan = async () => {
    if (!calculation.isValid) return;

    setIsSubmitting(true);
    setSubmitError(null);

    // If user has no account in DB yet, direct them or prompt
    const accountIdToUse = activeAccount?.id || accounts[0]?.id;

    if (!accountIdToUse) {
      setSubmitError(
        "You must connect or select a trading account before saving a trade plan to your registry."
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/trade-plans/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instrument: calculation.instrument,
          direction: calculation.direction,
          entryPrice: calculation.entryPrice,
          stopPrice: calculation.stopPrice,
          targetPrice: calculation.targetPrice,
          accountId: accountIdToUse,
          riskPct: calculation.riskPct,
          thesis,
          invalidationCriteria,
          checklistResults: [
            { item: "Risk strictly quantified within limits", checked: rulesChecked.riskDefined },
            { item: "Invalidation level clearly identified", checked: rulesChecked.invalidationClear },
            { item: "No impending high-impact economic news", checked: rulesChecked.noImpendingNews },
          ],
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setSubmitError(data.error || "Failed to save trade plan.");
        setIsSubmitting(false);
        return;
      }

      setSavedPlan({
        id: data.planId,
        calculation,
      });

      if (onPlanSaved) {
        onPlanSaved(data.planId);
      }
    } catch (err: any) {
      console.error("Error saving trade plan:", err);
      setSubmitError("An unexpected error occurred while saving the plan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Render Execution Boundary Post-Save ─────────────────────────────────
  if (savedPlan) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
        {/* Success Banner */}
        <div className="p-6 md:p-8 bg-white border border-[#18B880]/40 rounded-none relative overflow-hidden shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 border border-[#18B880]/40 bg-[#18B880]/10 flex items-center justify-center text-[#18B880] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#18B880] font-bold">
                  // TRADE PLAN REGISTERED & SNAPSHOTTED
                </span>
                <span className="text-[9px] font-mono text-[#87877F] dd-tabular">
                  ID: {savedPlan.id.slice(0, 8)}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-display font-extrabold uppercase text-[#181818] tracking-tight">
                Plan Immutable in Registry
              </h2>
              <p className="text-xs text-[#474744] leading-relaxed max-w-xl">
                Your quantitative risk parameters, invalidation criteria, and position size
                are permanently recorded to prevent hindsight bias.
              </p>
            </div>
          </div>
        </div>

        {/* Quantified Plan Summary Card */}
        <div className="p-6 bg-white border border-[#E6E4DE] shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#E6E4DE] pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#87877F]">
                INSTRUMENT & DIRECTION
              </span>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xl font-mono font-bold text-[#181818] tracking-tight">
                  {savedPlan.calculation.instrument}
                </span>
                <span
                  className={cn(
                    "text-[10px] font-mono uppercase font-extrabold px-2 py-0.5 border",
                    savedPlan.calculation.direction === "long"
                      ? "text-[#18B880] border-[#18B880]/30 bg-[#18B880]/10"
                      : "text-[#CE6969] border-[#CE6969]/30 bg-[#CE6969]/10"
                  )}
                >
                  {savedPlan.calculation.direction.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#87877F]">
                POSITION SIZE
              </span>
              <div className="text-xl font-mono font-bold text-[#F9771D] mt-1 dd-tabular">
                {savedPlan.calculation.lots.toFixed(2)} Lots
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3.5 bg-[#FBFBFA] border border-[#EEECE7]">
              <span className="text-[10px] text-[#87877F] block uppercase tracking-wider">Planned Entry</span>
              <span className="text-[#181818] font-bold text-sm block mt-1 dd-tabular">
                {savedPlan.calculation.entryPrice.toFixed(savedPlan.calculation.spec.mult > 100 ? 5 : 2)}
              </span>
            </div>
            <div className="p-3.5 bg-[#FBFBFA] border border-[#EEECE7]">
              <span className="text-[10px] text-[#87877F] block uppercase tracking-wider">Invalidation / Stop</span>
              <span className="text-[#CE6969] font-bold text-sm block mt-1 dd-tabular">
                {savedPlan.calculation.stopPrice.toFixed(savedPlan.calculation.spec.mult > 100 ? 5 : 2)}
              </span>
            </div>
            <div className="p-3.5 bg-[#FBFBFA] border border-[#EEECE7]">
              <span className="text-[10px] text-[#87877F] block uppercase tracking-wider">Target Price</span>
              <span className="text-[#18B880] font-bold text-sm block mt-1 dd-tabular">
                {savedPlan.calculation.targetPrice.toFixed(savedPlan.calculation.spec.mult > 100 ? 5 : 2)}
              </span>
            </div>
            <div className="p-3.5 bg-[#FBFBFA] border border-[#EEECE7]">
              <span className="text-[10px] text-[#87877F] block uppercase tracking-wider">Reward / Risk</span>
              <span className="text-[#F9771D] font-bold text-sm block mt-1 dd-tabular">
                {savedPlan.calculation.rewardRiskRatio.toFixed(2)}R
              </span>
            </div>
          </div>

          <div className="p-4 bg-[#FBFBFA] border border-[#E6E4DE] flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-[#87877F] block text-[10px] uppercase tracking-wider">Cash Risk Allocated</span>
              <span className="text-[#181818] font-bold dd-tabular">
                {currencySymbol}
                {savedPlan.calculation.cashRisk.toFixed(2)} ({savedPlan.calculation.riskPct}%)
              </span>
            </div>
            <div className="text-right">
              <span className="text-[#87877F] block text-[10px] uppercase tracking-wider">Target Potential Profit</span>
              <span className="text-[#18B880] font-bold dd-tabular">
                +{currencySymbol}
                {savedPlan.calculation.cashReward.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* The Authoritative Operating Boundary */}
        <div className="p-6 bg-white border border-[#E6E4DE] shadow-xs space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 border border-[#E6E4DE] flex items-center justify-center text-[#87877F] shrink-0 mt-0.5">
              <ExternalLink className="w-4 h-4" />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-[#F9771D] uppercase tracking-widest block font-bold">
                // EXECUTION BOUNDARY NOTICE
              </span>
              <h3 className="text-sm font-bold uppercase text-[#181818] tracking-tight">
                Drawdown Does Not Execute Orders
              </h3>
              <p className="text-xs text-[#87877F] leading-relaxed">
                Drawdown is a decision-support and risk-discipline operating system. We never route
                orders, custody funds, or execute trades. You must place this trade independently on
                your broker platform (MetaTrader, cTrader, TradingView, Interactive Brokers, etc.).
              </p>
            </div>
          </div>

          {/* Workflow Sequence Indicator */}
          <div className="pt-2 border-t border-[#E6E4DE]">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#87877F] mb-3">
              Operating Sequence:
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono">
              <span className="px-2.5 py-1 bg-[#F0FDF8] border border-[rgba(24,184,128,0.25)] text-[#18B880] font-bold">
                1. TRADE PLAN [DONE]
              </span>
              <ArrowRight className="w-3 h-3 text-[#87877F]" />
              <span className="px-2.5 py-1 bg-[#FFF7ED] border border-[#FFEDD5] text-[#F9771D] font-bold">
                2. EXECUTE AT BROKER
              </span>
              <ArrowRight className="w-3 h-3 text-[#87877F]" />
              <span className="px-2.5 py-1 bg-[#FBFBFA] border border-[#E6E4DE] text-[#87877F]">
                3. RECORD ACTUAL
              </span>
              <ArrowRight className="w-3 h-3 text-[#87877F]" />
              <span className="px-2.5 py-1 bg-[#FBFBFA] border border-[#E6E4DE] text-[#87877F]">
                4. REVIEW
              </span>
            </div>
          </div>

          {/* Explicit Boundary Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link
              href={`/dashboard/plan/${savedPlan.id}/execute`}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#18B880] text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#18B880]/90 transition-colors shadow-xs"
            >
              EXECUTE AT BROKER <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href={`/dashboard/record?planId=${savedPlan.id}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-[#D4D2CC] text-[#474744] font-mono text-xs font-bold uppercase tracking-wider hover:text-[#181818] hover:border-[#181818] transition-colors"
            >
              Record Actual Execution
            </Link>

            <button
              onClick={() => setSavedPlan(null)}
              className="inline-flex items-center justify-center px-4 py-3.5 bg-white border border-[#E6E4DE] text-[#87877F] font-mono text-xs uppercase hover:text-[#181818] hover:border-[#D4D2CC] transition-colors"
            >
              Plan Another Trade
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main Decision-Support Workspace ────────────────────────────────────
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E4DE] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-profit uppercase tracking-widest font-bold">
              // FLAGSHIP DECISION WORKSPACE
            </span>
            <span className="text-[9px] font-mono text-[#87877F] border border-[#E6E4DE] px-1.5 py-0.5">
              NON-ROUTING
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-black uppercase text-[#181818] tracking-tight mt-1">
            Run My Trade
          </h2>
          <p className="text-xs text-[#87877F] mt-0.5">
            Turn your trade setup into an exact, quantified risk plan before touching your broker.
          </p>
        </div>

        {/* Quick Popular Instrument Selector */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono text-[#87877F] mr-1 uppercase tracking-wider">QUICK:</span>
          {POPULAR_INSTRUMENTS.map((sym) => (
            <button
              key={sym}
              type="button"
              onClick={() => setInstrument(sym)}
              className={cn(
                "px-2.5 py-1 text-[11px] font-mono uppercase border transition-all cursor-pointer",
                instrument === sym
                  ? "bg-[#181818] border-[#181818] text-white font-bold"
                  : "bg-white border-[#E6E4DE] text-[#474744] hover:text-[#181818] hover:border-[#D4D2CC]"
              )}
            >
              {sym}
            </button>
          ))}
        </div>
      </div>

      {submitError && (
        <div className="p-4 bg-loss/10 border border-loss/30 text-loss text-xs font-mono flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block uppercase">Validation / Save Failure</span>
            <p>{submitError}</p>
          </div>
        </div>
      )}

      {/* Grid: 2 Columns on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: TRADE IDEA */}
          <div className="p-5 bg-white border border-[#E6E4DE] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#F9771D] uppercase tracking-widest font-bold">
                1. TRADE IDEA
              </span>
              <span className="text-[10px] font-mono text-[#87877F]">
                SPEC: {calculation.spec.id.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Instrument Input / Selector */}
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-[#87877F] block mb-1.5">
                  Instrument
                </label>
                <input
                  type="text"
                  value={instrument}
                  onChange={(e) => setInstrument(e.target.value.toUpperCase())}
                  placeholder="e.g. GBP/USD, XAU/USD, NDX"
                  className="w-full bg-[#FDFDFD] border border-[#D4D2CC] px-3 py-2.5 text-sm font-mono text-[#181818] placeholder:text-[#87877F]/60 focus:outline-none focus:border-[#181818] focus:ring-1 focus:ring-[#181818]/10 shadow-xs transition-colors"
                />
              </div>

              {/* Direction Toggle */}
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-[#87877F] block mb-1.5">
                  Direction
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDirection("long")}
                    className={cn(
                      "py-2.5 px-3 text-xs font-mono font-bold uppercase border transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                      direction === "long"
                        ? "bg-[#18B880]/15 border-[#18B880] text-[#18B880]"
                        : "bg-white border-[#E6E4DE] text-[#87877F] hover:text-[#181818] hover:border-[#D4D2CC]"
                    )}
                  >
                    <TrendingUp className="w-3.5 h-3.5" /> LONG
                  </button>
                  <button
                    type="button"
                    onClick={() => setDirection("short")}
                    className={cn(
                      "py-2.5 px-3 text-xs font-mono font-bold uppercase border transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                      direction === "short"
                        ? "bg-[#CE6969]/15 border-[#CE6969] text-[#CE6969]"
                        : "bg-white border-[#E6E4DE] text-[#87877F] hover:text-[#181818] hover:border-[#D4D2CC]"
                    )}
                  >
                    <TrendingDown className="w-3.5 h-3.5" /> SHORT
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 2: PRICE LEVELS */}
          <div className="p-5 bg-white border border-[#E6E4DE] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#F9771D] uppercase tracking-widest font-bold">
                2. PRICE LEVELS
              </span>
              <span className="text-[10px] font-mono text-[#87877F]">
                DECIMALS: {calculation.spec.mult > 100 ? "5" : "2"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Entry */}
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-[#87877F] block mb-1.5">
                  Proposed Entry
                </label>
                <input
                  type="number"
                  step="any"
                  inputMode="decimal"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  className="w-full bg-[#FDFDFD] border border-[#D4D2CC] px-3 py-2.5 text-sm font-mono text-[#181818] dd-tabular focus:outline-none focus:border-[#181818] focus:ring-1 focus:ring-[#181818]/10 shadow-xs transition-colors"
                />
              </div>

              {/* Stop Loss */}
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-[#87877F] block mb-1.5">
                  Invalidation / Stop
                </label>
                <input
                  type="number"
                  step="any"
                  inputMode="decimal"
                  value={stopPrice}
                  onChange={(e) => setStopPrice(e.target.value)}
                  className={cn(
                    "w-full bg-[#FDFDFD] border px-3 py-2.5 text-sm font-mono dd-tabular focus:outline-none shadow-xs transition-colors",
                    calculation.errors.some((e) => e.includes("stop loss"))
                      ? "border-loss focus:border-loss text-loss"
                      : "border-[#D4D2CC] text-[#181818] focus:border-[#181818] focus:ring-1 focus:ring-[#181818]/10"
                  )}
                />
              </div>

              {/* Target Price */}
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-[#87877F] block mb-1.5">
                  Target Price (TP)
                </label>
                <input
                  type="number"
                  step="any"
                  inputMode="decimal"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  className={cn(
                    "w-full bg-[#FDFDFD] border px-3 py-2.5 text-sm font-mono dd-tabular focus:outline-none shadow-xs transition-colors",
                    calculation.errors.some((e) => e.includes("target"))
                      ? "border-loss focus:border-loss text-loss"
                      : "border-[#D4D2CC] text-[#181818] focus:border-[#181818] focus:ring-1 focus:ring-[#181818]/10"
                  )}
                />
              </div>
            </div>

            {/* Invalidation / Geometry errors */}
            {calculation.errors.length > 0 && (
              <div className="p-3 bg-loss/10 border border-loss/30 text-loss text-xs font-mono space-y-1">
                {calculation.errors.map((err, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{err}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* STEP 3: ACCOUNT & RISK ALLOCATION */}
          <div className="p-5 bg-white border border-[#E6E4DE] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#F9771D] uppercase tracking-widest font-bold">
                3. ACCOUNT & RISK
              </span>
              <span className="text-[10px] font-mono text-[#87877F] dd-tabular">
                BALANCE: {currencySymbol}{activeBalance.toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Account Selector */}
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-[#87877F] block mb-1.5">
                  Trading Account
                </label>
                {accounts.length > 0 ? (
                  <select
                    value={selectedAccountId}
                    onChange={(e) => setSelectedAccountId(e.target.value)}
                    className="w-full bg-white border border-[#D4D2CC] px-3 py-2.5 text-xs font-mono text-[#181818] focus:outline-none focus:border-[#181818] focus:ring-1 focus:ring-[#181818]/10 shadow-xs transition-colors"
                  >
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} ({acc.account_type}) — {acc.currency}{" "}
                        {(acc.current_equity || acc.starting_balance).toLocaleString()}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-2.5 bg-[#FBFBFA] border border-[#E6E4DE] text-xs font-mono text-[#474744] flex items-center justify-between">
                    <span>Reference £10,000</span>
                    <Link
                      href="/dashboard/accounts"
                      className="text-[10px] text-[#F9771D] hover:underline uppercase font-bold"
                    >
                      Connect Real
                    </Link>
                  </div>
                )}
              </div>

              {/* Risk % Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#87877F]">
                    Risk Percentage
                  </label>
                  <div className="flex items-center gap-1">
                    {[0.5, 1.0, 2.0].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => handleSelectRiskPct(pct)}
                        className={cn(
                          "text-[9px] font-mono px-1.5 py-0.5 border cursor-pointer transition-colors",
                          riskPct === pct
                            ? "bg-[#181818] border-[#181818] text-white font-bold"
                            : "bg-white border-[#E6E4DE] text-[#87877F] hover:text-[#181818] hover:border-[#D4D2CC]"
                        )}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="100"
                    inputMode="decimal"
                    value={riskPct}
                    onChange={(e) => setRiskPct(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#FDFDFD] border border-[#D4D2CC] px-3 py-2.5 text-sm font-mono text-[#181818] dd-tabular focus:outline-none focus:border-[#181818] focus:ring-1 focus:ring-[#181818]/10 shadow-xs transition-colors pr-10"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-mono text-[#87877F] pointer-events-none">
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 6: DISCIPLINE CHECK */}
          <div className="p-5 bg-white border border-[#E6E4DE] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#F9771D] uppercase tracking-widest font-bold">
                6. DISCIPLINE & INVALIDATION CHECK
              </span>
              <span className="text-[10px] font-mono text-[#87877F]">
                PROCESS VERIFICATION
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-[#87877F] block mb-1">
                  Why am I taking this trade? (Thesis)
                </label>
                <input
                  type="text"
                  value={thesis}
                  onChange={(e) => setThesis(e.target.value)}
                  placeholder="e.g. 4H demand retest, liquidity swept on London open..."
                  className="w-full bg-[#FDFDFD] border border-[#D4D2CC] px-3 py-2 text-xs font-mono text-[#181818] placeholder:text-[#87877F]/60 focus:outline-none focus:border-[#181818] focus:ring-1 focus:ring-[#181818]/10 shadow-xs transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-[#87877F] block mb-1">
                  What specifically invalidates this setup?
                </label>
                <input
                  type="text"
                  value={invalidationCriteria}
                  onChange={(e) => setInvalidationCriteria(e.target.value)}
                  placeholder="e.g. 15m candle close below 1.2720..."
                  className="w-full bg-[#FDFDFD] border border-[#D4D2CC] px-3 py-2 text-xs font-mono text-[#181818] placeholder:text-[#87877F]/60 focus:outline-none focus:border-[#181818] focus:ring-1 focus:ring-[#181818]/10 shadow-xs transition-colors"
                />
              </div>

              {/* Checklist */}
              <div className="pt-2 space-y-2">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-mono text-[#474744] select-none hover:text-[#181818]">
                  <input
                    type="checkbox"
                    checked={rulesChecked.riskDefined}
                    onChange={(e) =>
                      setRulesChecked((prev) => ({ ...prev, riskDefined: e.target.checked }))
                    }
                    className="w-4 h-4 rounded-none accent-[#181818] border-[#D4D2CC]"
                  />
                  <span>Risk is calculated and quantified to my exact limit</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-mono text-[#474744] select-none hover:text-[#181818]">
                  <input
                    type="checkbox"
                    checked={rulesChecked.invalidationClear}
                    onChange={(e) =>
                      setRulesChecked((prev) => ({ ...prev, invalidationClear: e.target.checked }))
                    }
                    className="w-4 h-4 rounded-none accent-[#181818] border-[#D4D2CC]"
                  />
                  <span>Invalidation level is objective and identified prior to entry</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-mono text-[#474744] select-none hover:text-[#181818]">
                  <input
                    type="checkbox"
                    checked={rulesChecked.noImpendingNews}
                    onChange={(e) =>
                      setRulesChecked((prev) => ({ ...prev, noImpendingNews: e.target.checked }))
                    }
                    className="w-4 h-4 rounded-none accent-[#181818] border-[#D4D2CC]"
                  />
                  <span>No high-impact economic releases scheduled during entry window</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Drawdown Analysis & Market Context (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* STEP 4: DRAWDOWN ANALYSIS */}
          <div className="p-6 bg-white border-2 border-[#181818] shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#E6E4DE] pb-3">
              <span className="text-[10px] font-mono text-[#181818] uppercase tracking-widest font-bold flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#F9771D]" /> 4. DRAWDOWN ANALYSIS
              </span>
              <span className="text-[9px] font-mono text-[#87877F] uppercase tracking-wider">
                DETERMINISTIC MATH
              </span>
            </div>

            {/* Core Calculated Results */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-[#FBFBFA] border border-[#E6E4DE]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#87877F] block">
                  POSITION SIZE
                </span>
                <div className="text-2xl font-mono font-bold text-[#181818] mt-1 dd-tabular">
                  {calculation.lots.toFixed(2)}{" "}
                  <span className="text-xs font-normal text-[#474744]">Lots</span>
                </div>
                <span className="text-[10px] font-mono text-[#87877F] block mt-0.5 dd-tabular">
                  {calculation.units.toLocaleString()} Units
                </span>
              </div>

              <div className="p-4 bg-[#FBFBFA] border border-[#E6E4DE]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#87877F] block">
                  REWARD / RISK
                </span>
                <div
                  className={cn(
                    "text-2xl font-mono font-bold mt-1 dd-tabular",
                    calculation.rewardRiskRatio >= 2.0
                      ? "text-[#18B880]"
                      : calculation.rewardRiskRatio >= 1.0
                      ? "text-[#F9771D]"
                      : "text-[#CE6969]"
                  )}
                >
                  {calculation.rewardRiskRatio.toFixed(2)}R
                </div>
                <span className="text-[10px] font-mono text-[#87877F] block mt-0.5 dd-tabular">
                  {calculation.rewardPips} pips / {calculation.stopPips} pips
                </span>
              </div>
            </div>

            {/* Financial Risk Details */}
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-3 bg-[#FBFBFA] border border-[#E6E4DE]">
                <span className="text-[#87877F]">Cash Risk at Stop Loss</span>
                <span className="font-bold text-[#CE6969] dd-tabular">
                  -{currencySymbol}{calculation.cashRisk.toFixed(2)} ({calculation.riskPct}%)
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#FBFBFA] border border-[#E6E4DE]">
                <span className="text-[#87877F]">Potential Reward at Target</span>
                <span className="font-bold text-[#18B880] dd-tabular">
                  +{currencySymbol}{calculation.cashReward.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#FBFBFA] border border-[#E6E4DE]">
                <span className="text-[#87877F]">Notional Account Exposure</span>
                <span className="font-bold text-[#181818] dd-tabular">
                  {currencySymbol}{calculation.notionalValue.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Drawdown & Limit Compliance */}
            <div className="pt-2 border-t border-[#E6E4DE] space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#87877F] uppercase tracking-wider text-[10px]">Daily Loss Buffer:</span>
                <span
                  className={cn(
                    "font-bold dd-tabular",
                    calculation.isWithinDailyLimit ? "text-[#18B880]" : "text-[#CE6969]"
                  )}
                >
                  {calculation.dailyLossImpactPct}% / {dailyLossLimitPct}% Limit
                </span>
              </div>

              <div className="w-full bg-[#E6E4DE] h-1.5 overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all",
                    calculation.dailyLossImpactPct > dailyLossLimitPct
                      ? "bg-[#CE6969]"
                      : calculation.dailyLossImpactPct > dailyLossLimitPct * 0.7
                      ? "bg-amber-500"
                      : "bg-[#18B880]"
                  )}
                  style={{
                    width: `${Math.min(100, (calculation.dailyLossImpactPct / dailyLossLimitPct) * 100)}%`,
                  }}
                />
              </div>

              {calculation.warnings.length > 0 && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-700 text-[11px] font-mono space-y-1">
                  {calculation.warnings.map((w, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{w}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* STEP 5: MARKET CONTEXT (Non-intrusive) */}
          <div className="p-5 bg-white border border-[#E6E4DE] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E6E4DE] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-[#F9771D] uppercase tracking-widest font-bold">
                  5. MARKET CONTEXT
                </span>
                <span
                  className={cn(
                    "text-[9px] font-mono font-bold px-1.5 py-0.5 border",
                    freshness.color
                  )}
                >
                  {freshness.label}
                </span>
              </div>
              <span className="text-[9px] font-mono text-[#87877F] uppercase tracking-wider">
                NON-MUTATING
              </span>
            </div>

            {marketData.price !== null ? (
              <div className="space-y-3 text-xs font-mono">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-[#FBFBFA] border border-[#E6E4DE]">
                    <span className="text-[10px] text-[#87877F] block uppercase tracking-wider">Market Price</span>
                    <span className="text-[#181818] font-bold block mt-0.5 text-sm dd-tabular">
                      {marketData.price.toFixed(calculation.spec.mult > 100 ? 5 : 2)}
                    </span>
                  </div>
                  <div className="p-3 bg-[#FBFBFA] border border-[#E6E4DE]">
                    <span className="text-[10px] text-[#87877F] block uppercase tracking-wider">14-Period ATR</span>
                    <span className="text-[#181818] font-bold block mt-0.5 text-sm dd-tabular">
                      {marketData.atrCurrent ? `${(marketData.atrCurrent * calculation.spec.mult).toFixed(1)} pips` : "—"}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-[#FBFBFA] border border-[#E6E4DE] flex items-center justify-between">
                  <span className="text-[#87877F]">Bias / Direction</span>
                  <span
                    className={cn(
                      "font-bold uppercase",
                      marketData.trendLabel.includes("ABOVE")
                        ? "text-[#18B880]"
                        : marketData.trendLabel.includes("BELOW")
                        ? "text-[#CE6969]"
                        : "text-[#474744]"
                    )}
                  >
                    {marketData.trendLabel}
                  </span>
                </div>

                <p className="text-[10px] font-mono text-[#87877F] leading-relaxed">
                  Market context is informational only. Drawdown will never overwrite your
                  entry, stop, or target parameters.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-[#FBFBFA] border border-[#E6E4DE] text-center space-y-2">
                <Activity className="w-5 h-5 text-[#87877F] mx-auto" />
                <p className="text-xs font-mono text-[#87877F]">
                  Live feed unavailable for {instrument}. Core risk quantification remains 100% active.
                </p>
              </div>
            )}
          </div>

          {/* STEP 7: SAVE ACTION CTA */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              disabled={!calculation.isValid || isSubmitting}
              onClick={handleSavePlan}
              className={cn(
                "w-full py-4 px-6 font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 border",
                calculation.isValid && !isSubmitting
                  ? "bg-[#18B880] border-[#18B880] text-white hover:bg-[#18B880]/90 cursor-pointer shadow-xs"
                  : "bg-white border-[#E6E4DE] text-[#87877F] cursor-not-allowed"
              )}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  PERSISTING PLAN TO REGISTRY...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  SAVE TRADE PLAN
                </>
              )}
            </button>

            <div className="text-center text-[10px] font-mono text-[#87877F]">
              Drawdown strictly enforces pre-trade discipline. Order routing occurs at your broker.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
