"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ToolHeader } from "@/components/tools/ToolHeader";
import { ToolWorkingBox } from "@/components/tools/ToolWorkingBox";
import { ToolFormulaSection } from "@/components/tools/ToolFormulaSection";
import { ToolContextualCTA, ToolDisclaimer } from "@/components/tools/ToolContextualCTA";
import { calculateDrawdownRecovery } from "@/lib/tools/drawdown-calc";
import { AlertTriangle, TrendingUp, TrendingDown, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export function DrawdownRecoveryCalculatorClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialBalance = Number(searchParams.get("balance")) || 25000;
  const initialLoss = Number(searchParams.get("drawdown")) || 20;
  const initialRisk = Number(searchParams.get("risk")) || 1.0;
  const initialWinRate = Number(searchParams.get("winRate")) || 50;
  const initialRR = Number(searchParams.get("rr")) || 1.5;

  const [balance, setBalance] = useState<number>(initialBalance);
  const [lossPercent, setLossPercent] = useState<number>(initialLoss);
  const [riskPerTrade, setRiskPerTrade] = useState<number>(initialRisk);
  const [winRate, setWinRate] = useState<number>(initialWinRate);
  const [rewardToRisk, setRewardToRisk] = useState<number>(initialRR);

  // Sync to URL
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("balance", balance.toString());
    params.set("drawdown", lossPercent.toString());
    params.set("risk", riskPerTrade.toString());
    params.set("winRate", winRate.toString());
    params.set("rr", rewardToRisk.toString());
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [balance, lossPercent, riskPerTrade, winRate, rewardToRisk, router]);

  const result = useMemo(() => {
    return calculateDrawdownRecovery({
      initialBalance: balance,
      drawdownPercent: lossPercent,
      riskPerTradePercent: riskPerTrade,
      winRatePercent: winRate,
      rewardToRisk,
    });
  }, [balance, lossPercent, riskPerTrade, winRate, rewardToRisk]);

  return (
    <div className="w-full min-h-screen bg-[var(--surface-base)] pt-32 pb-24 text-[var(--text-primary)]">
      <div className="max-w-[1280px] mx-auto px-6">
        <ToolHeader
          badge="Brand Core Philosophy"
          title="Drawdown Recovery Calculator"
          subtitle="Visualize the brutal mathematical asymmetry of trading losses. See exactly why avoiding deep drawdowns is infinitely more important than chasing high returns."
        />

        {/* 2-Column Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Input Sliders */}
          <div
            className="lg:col-span-5 p-6 sm:p-8 border space-y-6"
            style={{
              borderColor: "var(--border-subtle)",
              backgroundColor: "var(--surface-raised)",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <div className="flex items-center justify-between border-b border-black/5 pb-3">
              <span className="text-xs font-mono uppercase tracking-wider font-semibold text-[var(--text-primary)]">
                Drawdown Parameters
              </span>
              <span className="text-xs font-mono text-[var(--text-tertiary)]">
                Interactive Model
              </span>
            </div>

            {/* Starting Balance */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <label className="text-[var(--text-secondary)] uppercase tracking-wider">
                  Starting Account Balance
                </label>
                <span className="font-bold text-[var(--text-primary)]">
                  £{balance.toLocaleString()}
                </span>
              </div>
              <input
                type="number"
                value={balance}
                onChange={(e) => setBalance(Math.max(1, Number(e.target.value)))}
                className="w-full px-4 py-2.5 bg-[var(--surface-base)] border border-[var(--border-subtle)] font-mono text-sm rounded focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            {/* Loss Percentage Slider */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <label className="text-[var(--market-down)] uppercase tracking-wider font-semibold">
                  Current Drawdown (Loss)
                </label>
                <span className="text-base font-bold text-[var(--market-down)]">
                  -{lossPercent.toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="90"
                step="1"
                value={lossPercent}
                onChange={(e) => setLossPercent(Number(e.target.value))}
                className="w-full accent-[var(--market-down)] cursor-pointer"
              />
              {/* Quick loss buttons */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[5, 10, 20, 30, 50, 75].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setLossPercent(preset)}
                    className="px-2 py-0.5 text-xs font-mono border rounded transition-colors"
                    style={{
                      borderColor: lossPercent === preset ? "var(--market-down)" : "var(--border-subtle)",
                      backgroundColor: lossPercent === preset ? "rgba(206,105,105,0.08)" : "transparent",
                      color: lossPercent === preset ? "var(--market-down)" : "var(--text-secondary)",
                    }}
                  >
                    -{preset}%
                  </button>
                ))}
              </div>
            </div>

            {/* Expectancy Parameters Accordion */}
            <div className="space-y-4 pt-4 border-t border-black/5">
              <span className="text-xs font-mono uppercase tracking-wider font-semibold text-[var(--text-primary)] block">
                Strategy Recovery Expectancy
              </span>

              {/* Risk Per Trade */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[var(--text-secondary)]">Risk per Trade</span>
                  <span className="font-semibold text-[var(--text-primary)]">{riskPerTrade}%</span>
                </div>
                <input
                  type="range"
                  min="0.25"
                  max="3"
                  step="0.25"
                  value={riskPerTrade}
                  onChange={(e) => setRiskPerTrade(Number(e.target.value))}
                  className="w-full accent-[var(--accent)] cursor-pointer"
                />
              </div>

              {/* Win Rate */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[var(--text-secondary)]">Strategy Win Rate</span>
                  <span className="font-semibold text-[var(--text-primary)]">{winRate}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="70"
                  step="1"
                  value={winRate}
                  onChange={(e) => setWinRate(Number(e.target.value))}
                  className="w-full accent-[var(--accent)] cursor-pointer"
                />
              </div>

              {/* Reward to Risk */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[var(--text-secondary)]">Reward-to-Risk (R:R)</span>
                  <span className="font-semibold text-[var(--text-primary)]">1 : {rewardToRisk.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="4"
                  step="0.1"
                  value={rewardToRisk}
                  onChange={(e) => setRewardToRisk(Number(e.target.value))}
                  className="w-full accent-[var(--accent)] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Right: Output & Asymmetry Matrix */}
          <div className="lg:col-span-7 space-y-6">
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
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-tertiary)] block">
                    Break-Even Requirement
                  </span>
                  <div className="text-sm font-sans font-semibold text-[var(--text-primary)]">
                    Recovery Projection
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-amber-200 bg-amber-50 text-amber-800 text-xs font-mono font-medium">
                  {result.recoveryMultiplier.toFixed(2)}x Multiplier
                </div>
              </div>

              {/* Huge Callout Metric */}
              <div
                className="p-6 text-center space-y-1 border"
                style={{
                  backgroundColor: "rgba(22,33,62,0.025)",
                  borderColor: "rgba(22,33,62,0.08)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <div className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                  Gain Required to Break Even
                </div>
                <div className="text-4xl sm:text-5xl font-mono font-bold tracking-tight text-[var(--market-up)] tabular-nums">
                  +{result.recoveryGainPercent.toFixed(1)}%
                </div>
                <div className="text-xs font-mono text-[var(--text-secondary)] pt-1">
                  You must generate +£{result.cashDeficit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} from a surviving equity of £{result.troughBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-4 border border-black/5 rounded bg-[var(--surface-raised)]">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] block">
                    Trough Equity
                  </span>
                  <div className="text-lg font-mono font-bold text-[var(--market-down)] mt-1">
                    £{result.troughBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                  <span className="text-[11px] font-mono text-[var(--text-secondary)]">
                    -{result.drawdownPercent.toFixed(0)}% deficit
                  </span>
                </div>

                <div className="p-4 border border-black/5 rounded bg-[var(--surface-raised)]">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] block">
                    Capital Deficit
                  </span>
                  <div className="text-lg font-mono font-bold text-[var(--text-primary)] mt-1">
                    £{result.cashDeficit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                  <span className="text-[11px] font-mono text-[var(--text-secondary)]">
                    Net cash hole
                  </span>
                </div>

                <div className="p-4 border border-black/5 rounded bg-[var(--surface-raised)] col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] block">
                    Estimated Trades
                  </span>
                  <div className="text-lg font-mono font-bold text-[var(--accent)] mt-1">
                    {result.tradesToRecoverEstimate ? `~${result.tradesToRecoverEstimate} Trades` : "Unprofitable Edge"}
                  </div>
                  <span className="text-[11px] font-mono text-[var(--text-secondary)]">
                    {result.expectedValuePerTradePercent ? `+${result.expectedValuePerTradePercent.toFixed(2)}% EV / trade` : "Negative EV"}
                  </span>
                </div>
              </div>

              {/* Interactive Loss Asymmetry Comparison Table */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                    The Mathematical Asymmetry Curve
                  </span>
                  <span className="text-[11px] text-[var(--text-tertiary)]">
                    Compounding reality
                  </span>
                </div>

                <div className="border border-black/5 rounded overflow-hidden">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="bg-black/[0.03] border-b border-black/5 text-[10px] uppercase text-[var(--text-tertiary)]">
                        <th className="p-2.5">Loss %</th>
                        <th className="p-2.5">Remaining Equity</th>
                        <th className="p-2.5 text-right">Required Gain</th>
                        <th className="p-2.5 text-right">Difficulty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.asymmetryMatrix.map((row) => {
                        const isSelected = Math.abs(row.lossPercent - lossPercent) < 5;
                        return (
                          <tr
                            key={row.lossPercent}
                            className={`border-b border-black/5 transition-colors ${
                              isSelected ? "bg-amber-500/10 font-bold" : "hover:bg-black/[0.01]"
                            }`}
                          >
                            <td className="p-2.5 text-[var(--market-down)]">
                              -{row.lossPercent}%
                            </td>
                            <td className="p-2.5 text-[var(--text-secondary)]">
                              £{row.troughBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </td>
                            <td className="p-2.5 text-right font-bold text-[var(--market-up)]">
                              +{row.requiredGainPercent.toFixed(1)}%
                            </td>
                            <td className="p-2.5 text-right text-[var(--text-tertiary)]">
                              {row.multiplier.toFixed(1)}x
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Show The Working */}
        <ToolWorkingBox steps={result.formulaSteps} />

        {/* Theoretical Framework */}
        <ToolFormulaSection
          title="The Mathematics of Capital Preservation"
          description="Capital asymmetry is the primary reason the vast majority of retail traders fail. When capital declines linearly, the return required to reach parity expands exponentially. A 10% loss requires an 11.1% gain, but a 50% loss requires a 100% gain, and an 80% loss requires a 400% gain."
          formulaLatex="Required\ Recovery\ Gain\ \% = \left( \frac{Drawdown\ \%}{100 - Drawdown\ \%} \right) \times 100"
          steps={[
            "Record initial account equity before the losing sequence begins.",
            "Calculate trough balance: Starting Equity × (1 - (Loss% ÷ 100)).",
            "Calculate required percentage increase from trough balance back to initial equity: Cash Deficit ÷ Trough Balance × 100.",
            "Estimate trade recovery horizon by modeling expected value per trade: EV = (Win Rate × Reward) - (Loss Rate × Risk).",
          ]}
          faqs={[
            {
              question: "Why does a 50% loss require a 100% gain?",
              answer:
                "If an account falls from £10,000 to £5,000, you have lost £5,000 (50%). However, to rebuild that £5,000 back to £10,000 from the remaining £5,000 base, you must double your current capital—which represents a 100% return.",
            },
            {
              question: "How do institutional risk managers prevent catastrophic drawdowns?",
              answer:
                "Institutional desks enforce strict daily and monthly stop-loss limits. If a trader suffers a 3% drawdown in a day or 6% in a month, their trading permissions are automatically revoked or position sizes slashed by 50% to prevent the exponential asymmetry trap.",
            },
          ]}
        />

        {/* Contextual CTA */}
        <ToolContextualCTA
          toolName="Drawdown Recovery Calculator"
          lead="Never let an account cross the 10% drawdown barrier."
          benefit="Drawdown's pre-trade validation framework and risk calculators prevent catastrophic losing runs by capping risk at mathematical survival limits."
        />

        <ToolDisclaimer />
      </div>
    </div>
  );
}
