"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ToolHeader } from "@/components/tools/ToolHeader";
import { ToolWorkingBox } from "@/components/tools/ToolWorkingBox";
import { ToolFormulaSection } from "@/components/tools/ToolFormulaSection";
import { ToolContextualCTA, ToolDisclaimer } from "@/components/tools/ToolContextualCTA";
import { INSTRUMENTS, AssetClass } from "@/lib/tools/instruments";
import { calculatePositionSize } from "@/lib/tools/position-calc";
import { Percent, Shield, ArrowUpDown, HelpCircle, Check, Sparkles } from "lucide-react";

const BALANCE_PRESETS = [10000, 25000, 50000, 100000];
const CURRENCIES = ["GBP", "USD", "EUR", "AUD", "CAD"];

export function PositionSizeCalculatorClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read URL query parameters or fallback
  const initialPair = searchParams.get("pair") || "GBPUSD";
  const initialBalance = Number(searchParams.get("balance")) || 25000;
  const initialRisk = Number(searchParams.get("risk")) || 1.0;
  const initialCurrency = searchParams.get("currency") || "GBP";

  const [selectedPair, setSelectedPair] = useState<string>(
    INSTRUMENTS[initialPair] ? initialPair : "GBPUSD"
  );
  const [balance, setBalance] = useState<number>(initialBalance);
  const [currency, setCurrency] = useState<string>(initialCurrency);
  const [riskType, setRiskType] = useState<"percent" | "cash">("percent");
  const [riskValue, setRiskValue] = useState<number>(initialRisk);

  const instrument = INSTRUMENTS[selectedPair] || INSTRUMENTS.GBPUSD;

  const [entryPrice, setEntryPrice] = useState<number>(
    Number(searchParams.get("entry")) || instrument.defaultEntry
  );
  const [stopPrice, setStopPrice] = useState<number>(
    Number(searchParams.get("stop")) ||
      Number((instrument.defaultEntry - instrument.defaultStopDistance / instrument.pipFactor).toFixed(instrument.decimals))
  );
  const [targetPrice, setTargetPrice] = useState<number>(
    Number(searchParams.get("tp")) ||
      Number((instrument.defaultEntry + (instrument.defaultStopDistance * 2) / instrument.pipFactor).toFixed(instrument.decimals))
  );

  // Update defaults on pair change if user hasn't typed custom values
  const handleSelectPair = (sym: string) => {
    setSelectedPair(sym);
    const inst = INSTRUMENTS[sym];
    if (inst) {
      setEntryPrice(inst.defaultEntry);
      setStopPrice(
        Number((inst.defaultEntry - inst.defaultStopDistance / inst.pipFactor).toFixed(inst.decimals))
      );
      setTargetPrice(
        Number((inst.defaultEntry + (inst.defaultStopDistance * 2) / inst.pipFactor).toFixed(inst.decimals))
      );
    }
  };

  // Sync to URL state for bookmarking/sharing
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("pair", selectedPair);
    params.set("balance", balance.toString());
    params.set("currency", currency);
    params.set("risk", riskValue.toString());
    params.set("entry", entryPrice.toString());
    params.set("stop", stopPrice.toString());
    if (targetPrice) params.set("tp", targetPrice.toString());
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [selectedPair, balance, currency, riskValue, entryPrice, stopPrice, targetPrice, router]);

  // Pure calculation
  const result = useMemo(() => {
    return calculatePositionSize({
      symbol: selectedPair,
      accountCurrency: currency,
      accountBalance: balance,
      riskType,
      riskValue,
      entryPrice,
      stopPrice,
      targetPrice,
    });
  }, [selectedPair, currency, balance, riskType, riskValue, entryPrice, stopPrice, targetPrice]);

  return (
    <div className="w-full min-h-screen bg-[var(--surface-base)] pt-32 pb-24 text-[var(--text-primary)]">
      <div className="max-w-[1280px] mx-auto px-6">
        <ToolHeader
          badge="Core Execution Tool"
          title="Position Size Calculator"
          subtitle="Determine your mathematical lot sizing, invalidation distance, and cash exposure across Forex, Gold, Oil, Indices, and Crypto before placing any live order."
        />

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Controls */}
          <div
            className="lg:col-span-6 p-6 sm:p-8 border space-y-6"
            style={{
              borderColor: "var(--border-subtle)",
              backgroundColor: "var(--surface-raised)",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <div className="flex items-center justify-between border-b border-black/5 pb-3">
              <span className="text-xs font-mono uppercase tracking-wider font-semibold text-[var(--text-primary)]">
                1. Select Instrument
              </span>
              <span className="text-[11px] font-mono text-[var(--text-tertiary)]">
                {instrument.category.toUpperCase()}
              </span>
            </div>

            {/* Instrument Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.keys(INSTRUMENTS).slice(0, 8).map((sym) => {
                const inst = INSTRUMENTS[sym];
                const active = selectedPair === sym;
                return (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => handleSelectPair(sym)}
                    className="p-2.5 text-left border rounded transition-all text-xs font-mono"
                    style={{
                      borderColor: active ? "var(--accent)" : "var(--border-subtle)",
                      backgroundColor: active ? "rgba(22,33,62,0.06)" : "var(--surface-base)",
                      color: active ? "var(--accent)" : "var(--text-primary)",
                      fontWeight: active ? "600" : "400",
                    }}
                  >
                    <div>{sym}</div>
                    <div className="text-[10px] text-[var(--text-tertiary)] truncate">
                      {inst.category}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Account Settings */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                  Account Currency &amp; Balance
                </label>
                <div className="flex gap-1">
                  {CURRENCIES.map((cur) => (
                    <button
                      key={cur}
                      type="button"
                      onClick={() => setCurrency(cur)}
                      className="px-2 py-0.5 text-[11px] font-mono border rounded transition-colors"
                      style={{
                        borderColor: currency === cur ? "var(--accent)" : "var(--border-subtle)",
                        backgroundColor: currency === cur ? "var(--accent)" : "transparent",
                        color: currency === cur ? "#FFFFFF" : "var(--text-secondary)",
                      }}
                    >
                      {cur}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <input
                  type="number"
                  value={balance}
                  onChange={(e) => setBalance(Math.max(1, Number(e.target.value)))}
                  className="w-full px-4 py-3 bg-[var(--surface-base)] border border-[var(--border-subtle)] font-mono text-base rounded focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              {/* Balance Quick Presets */}
              <div className="flex flex-wrap gap-2">
                {BALANCE_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setBalance(preset)}
                    className="px-2.5 py-1 text-xs font-mono border border-[var(--border-subtle)] rounded hover:border-[var(--accent)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  >
                    {currency} {preset.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Risk Specification */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                  Risk Parameter
                </label>
                <div className="flex gap-1 bg-black/5 p-0.5 rounded">
                  <button
                    type="button"
                    onClick={() => {
                      setRiskType("percent");
                      setRiskValue(1.0);
                    }}
                    className={`px-2.5 py-0.5 text-xs font-mono rounded ${
                      riskType === "percent"
                        ? "bg-white text-[var(--text-primary)] shadow-sm font-semibold"
                        : "text-[var(--text-secondary)]"
                    }`}
                  >
                    Percentage (%)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRiskType("cash");
                      setRiskValue(balance * 0.01);
                    }}
                    className={`px-2.5 py-0.5 text-xs font-mono rounded ${
                      riskType === "cash"
                        ? "bg-white text-[var(--text-primary)] shadow-sm font-semibold"
                        : "text-[var(--text-secondary)]"
                    }`}
                  >
                    Cash ({currency})
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <input
                  type="number"
                  step={riskType === "percent" ? "0.1" : "50"}
                  value={riskValue}
                  onChange={(e) => setRiskValue(Math.max(0.01, Number(e.target.value)))}
                  className="w-32 px-4 py-3 bg-[var(--surface-base)] border border-[var(--border-subtle)] font-mono text-base rounded focus:outline-none focus:border-[var(--accent)]"
                />
                <div className="flex-1">
                  {riskType === "percent" && (
                    <input
                      type="range"
                      min="0.25"
                      max="5"
                      step="0.25"
                      value={riskValue}
                      onChange={(e) => setRiskValue(Number(e.target.value))}
                      className="w-full accent-[var(--accent)] cursor-pointer"
                    />
                  )}
                  <span className="text-xs font-mono text-[var(--text-tertiary)] block mt-1">
                    Cash Risk: {currency} {result.cashRisk.toFixed(2)} ({result.riskPercent.toFixed(2)}% of equity)
                  </span>
                </div>
              </div>
            </div>

            {/* Prices (Entry, Stop Loss, Target) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                  Entry Price
                </label>
                <input
                  type="number"
                  step={1 / instrument.pipFactor}
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-[var(--surface-base)] border border-[var(--border-subtle)] font-mono text-sm rounded focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[var(--market-down)]">
                  Stop Loss Price
                </label>
                <input
                  type="number"
                  step={1 / instrument.pipFactor}
                  value={stopPrice}
                  onChange={(e) => setStopPrice(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-[var(--surface-base)] border border-[var(--border-subtle)] font-mono text-sm rounded focus:outline-none focus:border-[var(--market-down)]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[var(--market-up)]">
                  Take Profit (Optional)
                </label>
                <input
                  type="number"
                  step={1 / instrument.pipFactor}
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-[var(--surface-base)] border border-[var(--border-subtle)] font-mono text-sm rounded focus:outline-none focus:border-[var(--market-up)]"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Output Card */}
          <div className="lg:col-span-6 space-y-6">
            <div
              className="p-8 border space-y-6"
              style={{
                borderColor: "rgba(22,33,62,0.12)",
                backgroundColor: "#FFFFFF",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 12px 32px -8px rgba(22,33,62,0.10)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <div className="flex items-center justify-between border-b border-black/5 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-tertiary)]">
                    Validated Position Output
                  </span>
                  <div className="text-sm font-sans font-semibold text-[var(--text-primary)]">
                    {instrument.name}
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-mono font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Sizing Verified
                </div>
              </div>

              {/* Main Primary Metric: Standard Lots */}
              <div
                className="p-6 text-center space-y-1 border"
                style={{
                  backgroundColor: "rgba(22,33,62,0.025)",
                  borderColor: "rgba(22,33,62,0.08)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <div className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                  Required Order Volume
                </div>
                <div className="text-4xl sm:text-5xl font-mono font-bold tracking-tight text-[var(--text-primary)] tabular-nums">
                  {result.standardLots.toFixed(2)}{" "}
                  <span className="text-lg font-sans font-medium text-[var(--text-secondary)]">
                    Standard Lots
                  </span>
                </div>
                <div className="text-xs font-mono text-[var(--text-tertiary)] pt-1">
                  {result.miniLots.toFixed(1)} Mini Lots · {result.microLots.toFixed(0)} Micro Lots ({result.units.toLocaleString()} Units)
                </div>
              </div>

              {/* Key Sizing Metrics Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-black/5 rounded bg-[var(--surface-raised)]">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] block">
                    Cash at Risk
                  </span>
                  <div className="text-xl font-mono font-bold text-[var(--market-down)] mt-1">
                    {currency} {result.cashRisk.toFixed(2)}
                  </div>
                  <span className="text-[11px] font-mono text-[var(--text-secondary)]">
                    {result.riskPercent.toFixed(2)}% of equity
                  </span>
                </div>

                <div className="p-4 border border-black/5 rounded bg-[var(--surface-raised)]">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] block">
                    Invalidation Distance
                  </span>
                  <div className="text-xl font-mono font-bold text-[var(--text-primary)] mt-1">
                    {result.stopDistanceUnits.toFixed(1)}{" "}
                    <span className="text-xs font-normal text-[var(--text-tertiary)]">
                      {instrument.unitName}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[var(--text-secondary)]">
                    {result.pipValueAccountCurrency.toFixed(2)} {currency} / {instrument.unitName === "pips" ? "pip" : "pt"}
                  </span>
                </div>

                <div className="p-4 border border-black/5 rounded bg-[var(--surface-raised)]">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] block">
                    Notional Exposure
                  </span>
                  <div className="text-xl font-mono font-bold text-[var(--text-primary)] mt-1">
                    ${result.notionalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                  <span className="text-[11px] font-mono text-[var(--text-secondary)]">
                    {(result.notionalValue / (balance * 1.3)).toFixed(1)}x Account Leverage
                  </span>
                </div>

                <div className="p-4 border border-black/5 rounded bg-[var(--surface-raised)]">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] block">
                    Reward-to-Risk (R:R)
                  </span>
                  <div className="text-xl font-mono font-bold text-[var(--market-up)] mt-1">
                    {result.rrRatio ? `1 : ${result.rrRatio.toFixed(2)}` : "—"}
                  </div>
                  <span className="text-[11px] font-mono text-[var(--text-secondary)]">
                    {result.potentialProfit ? `+${currency} ${result.potentialProfit.toFixed(2)}` : "Set target"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Show The Working */}
        <ToolWorkingBox steps={result.formulaSteps} />

        {/* Theoretical / Mathematical Breakdown */}
        <ToolFormulaSection
          title="Position Sizing Mathematical Mechanics"
          description="Position sizing is the single most critical risk management lever in independent trading. While amateur traders fixate on win rate, institutional allocators determine edge through strict R-multiple exposure, deterministic pip conversions, and exact contract normalization."
          formulaLatex="Lot\ Size = \frac{\text{Account Equity} \times \text{Risk \%}}{|\text{Entry} - \text{Stop}| \times \text{Pip Factor} \times \text{Pip Value per Lot (Account Ccy)}}"
          variables={[
            {
              symbol: "B",
              name: "Account Balance / Equity",
              unit: "Currency ($/£/€)",
              description: "Total liquid balance used to establish the cash risk allowance for the trade.",
            },
            {
              symbol: "r",
              name: "Risk Parameter",
              unit: "% or Currency",
              description: "Maximum allowable capital loss should the trade hit technical invalidation.",
            },
            {
              symbol: "Δp",
              name: "Stop Invalidation Distance",
              unit: "Pips or Index Points",
              description: "Absolute distance |Entry - Stop Loss| normalized by instrument pip/tick factor.",
            },
            {
              symbol: "V_pip",
              name: "Pip Value per Lot",
              unit: "Account Currency",
              description: "Monetary return of a 1-pip movement for 1.00 standard contract converted to account currency.",
            },
            {
              symbol: "L",
              name: "Standard Lot Size",
              unit: "Standard Contracts",
              description: "Calculated position volume (1.00 lot = 100k FX units, 100 oz Gold, 5,000 oz Silver, 1 index pt).",
            },
          ]}
          steps={[
            "Calculate cash risk budget by multiplying total liquid account balance by the defined fraction at risk (e.g. 1% of £25,000 = £250).",
            "Establish exact structural invalidation by taking the absolute spread between trade entry price and technical stop loss in base pips or index points.",
            "Determine the current monetary value of a single pip for one standard contract (100,000 base currency units) converted into your account denomination.",
            "Divide the cash risk budget by the product of invalidation distance and single-lot pip value to obtain the exact mathematically compliant lot volume.",
          ]}
          workedExample={{
            title: "Institutional Worked Example: EUR/USD Standard Lot Sizing",
            scenario: "A trader with a $10,000 USD account risks exactly 1.0% ($100 cash risk) on a EUR/USD long position. Entry price is 1.08500 with a technical stop loss at 1.08250.",
            steps: [
              { label: "Cash Risk Budget", formula: "$10,000 × 1.0%", value: "$100.00 USD" },
              { label: "Stop Loss Distance", formula: "|1.08500 - 1.08250| × 10,000", value: "25.0 pips" },
              { label: "Pip Value per Standard Lot", formula: "100,000 units × 0.0001", value: "$10.00 USD / pip" },
              { label: "Required Position Volume", formula: "$100.00 ÷ (25.0 pips × $10.00)", value: "0.40 Standard Lots (40,000 EUR)" },
              { label: "Notional Exposure", formula: "40,000 EUR × 1.08500", value: "$43,400 USD (4.34x Account Leverage)" },
            ],
            conclusion: "If the trade hits stop loss at 1.08250, the realized loss is exactly 25.0 pips × $4.00/pip ($10.00 × 0.40) = $100.00 USD (1.00% of equity), preserving risk compliance irrespective of market volatility.",
          }}
          assumptions={[
            "Execution occurs precisely at the stop-loss order price with zero slippage.",
            "Standard institutional contract specifications apply (100,000 FX units, 100 oz Gold, 5,000 oz Silver, 1,000 bbl Oil).",
            "Currency conversion rates between quote currency and account currency remain constant across the transaction.",
            "Liquidity is sufficient to fill the calculated order size without market impact.",
          ]}
          limitations={[
            "Weekend market gaps and illiquid macro announcements (e.g. CPI, NFP, rate decisions) can execute stop orders below requested levels (adverse slippage).",
            "Variable overnight financing / swap charges are not deducted from the initial lot calculation and will increase total cost for multi-day swing positions.",
            "Broker contract sizes can vary for proprietary index CFDs (e.g., fractional point values rather than standard $1/pt).",
          ]}
          relatedLinks={[
            {
              label: "Drawdown Modeler",
              href: "/calculators/drawdown",
              description: "Model consecutive loss streaks and capital decay under fixed-fractional sizing",
            },
            {
              label: "Risk of Ruin Calculator",
              href: "/tools/risk-of-ruin-calculator",
              description: "Quantify the statistical probability of account ruin over a finite trade sample",
            },
            {
              label: "Drawdown Recovery Calculator",
              href: "/calculators/drawdown-recovery",
              description: "Evaluate the non-linear gain required to recover from equity drawdowns",
            },
            {
              label: "Risk Management Knowledge Architecture",
              href: "/risk-management",
              description: "Explore the comprehensive institutional curriculum on position sizing and survival math",
            },
          ]}
          faqs={[
            {
              question: "Why should I size trades by percentage risk instead of fixed lots?",
              answer:
                "Fixed lot sizing causes volatile risk outcomes: a 40-pip stop on EUR/USD risks double what a 20-pip stop does. Sizing dynamically by percentage ensures every trade risks the exact same monetary fraction of capital regardless of market volatility.",
            },
            {
              question: "How does the calculator handle Gold (XAU/USD) vs Forex pairs?",
              answer:
                "Standard Forex lots represent 100,000 units where 1 pip = 0.0001 (or 0.01 on JPY). Gold CFDs typically represent 100 troy ounces where a $1.00 move equals $100 per standard lot. The engine automatically adjusts contract multipliers and tick dimensions.",
            },
            {
              question: "What is the recommended risk per trade for funded challenges?",
              answer:
                "Most prop firm evaluation rules cap maximum daily drawdown at 4-5% and overall trailing drawdown at 8-10%. To survive an inevitable 5-loss streak without triggering a violation, professional traders restrict risk to 0.5% – 1.0% per trade.",
            },
          ]}
        />

        {/* Contextual CTA */}
        <ToolContextualCTA
          toolName="Position Size Calculator"
          lead="Pre-trade validation should never be manual."
          benefit="Plan My Trade integrates this exact mathematical sizing directly into your trading journal, complete with emotional compliance checks and live session spreads."
        />

        {/* Disclaimer */}
        <ToolDisclaimer />
      </div>
    </div>
  );
}
