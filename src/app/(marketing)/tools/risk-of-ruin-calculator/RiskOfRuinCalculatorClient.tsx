"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ToolHeader } from "@/components/tools/ToolHeader";
import { ToolWorkingBox } from "@/components/tools/ToolWorkingBox";
import { ToolFormulaSection } from "@/components/tools/ToolFormulaSection";
import { ToolContextualCTA, ToolDisclaimer } from "@/components/tools/ToolContextualCTA";
import { calculateRiskOfRuin } from "@/lib/tools/ruin-calc";
import { ShieldAlert, ShieldCheck, TrendingUp, AlertTriangle } from "lucide-react";

export function RiskOfRuinCalculatorClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialWinRate = Number(searchParams.get("winRate")) || 50;
  const initialRR = Number(searchParams.get("rr")) || 1.5;
  const initialRisk = Number(searchParams.get("risk")) || 1.5;
  const initialMaxDD = Number(searchParams.get("maxDD")) || 25;
  const initialTrades = Number(searchParams.get("trades")) || 100;

  const [winRate, setWinRate] = useState<number>(initialWinRate);
  const [rewardToRisk, setRewardToRisk] = useState<number>(initialRR);
  const [riskPerTrade, setRiskPerTrade] = useState<number>(initialRisk);
  const [maxDD, setMaxDD] = useState<number>(initialMaxDD);
  const [trades, setTrades] = useState<number>(initialTrades);

  // Sync to URL
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("winRate", winRate.toString());
    params.set("rr", rewardToRisk.toString());
    params.set("risk", riskPerTrade.toString());
    params.set("maxDD", maxDD.toString());
    params.set("trades", trades.toString());
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [winRate, rewardToRisk, riskPerTrade, maxDD, trades, router]);

  const result = useMemo(() => {
    return calculateRiskOfRuin({
      winRatePercent: winRate,
      rewardToRisk,
      riskPerTradePercent: riskPerTrade,
      maxDrawdownThresholdPercent: maxDD,
      numberOfTrades: trades,
    });
  }, [winRate, rewardToRisk, riskPerTrade, maxDD, trades]);

  return (
    <div className="w-full min-h-screen bg-[var(--surface-base)] pt-32 pb-24 text-[var(--text-primary)]">
      <div className="max-w-[1280px] mx-auto px-6">
        <ToolHeader
          badge="Quantitative Risk Model"
          title="Risk of Ruin Calculator"
          subtitle="Model the mathematical probability of hitting your account drawdown threshold over a given trade sample. Discover the exact boundary where a profitable system becomes dangerous."
        />

        {/* 2-Column Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Inputs Panel */}
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
                Strategy Parameters
              </span>
              <span className="text-xs font-mono text-[var(--text-tertiary)]">
                Statistical Model
              </span>
            </div>

            {/* Win Rate */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <label className="text-[var(--text-secondary)] uppercase tracking-wider">
                  Win Rate Percentage
                </label>
                <span className="font-bold text-[var(--text-primary)]">{winRate}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="80"
                step="1"
                value={winRate}
                onChange={(e) => setWinRate(Number(e.target.value))}
                className="w-full accent-[var(--accent)] cursor-pointer"
              />
            </div>

            {/* Reward to Risk */}
            <div className="space-y-2 pt-1">
              <div className="flex justify-between items-center text-xs font-mono">
                <label className="text-[var(--text-secondary)] uppercase tracking-wider">
                  Average Reward to Risk (R:R)
                </label>
                <span className="font-bold text-[var(--text-primary)]">1 : {rewardToRisk.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="4"
                step="0.1"
                value={rewardToRisk}
                onChange={(e) => setRewardToRisk(Number(e.target.value))}
                className="w-full accent-[var(--accent)] cursor-pointer"
              />
            </div>

            {/* Risk Per Trade */}
            <div className="space-y-2 pt-1">
              <div className="flex justify-between items-center text-xs font-mono">
                <label className="text-[var(--text-secondary)] uppercase tracking-wider">
                  Risk Per Trade (% of Account)
                </label>
                <span className="font-bold text-[var(--market-down)]">{riskPerTrade.toFixed(2)}%</span>
              </div>
              <input
                type="range"
                min="0.25"
                max="10"
                step="0.25"
                value={riskPerTrade}
                onChange={(e) => setRiskPerTrade(Number(e.target.value))}
                className="w-full accent-[var(--market-down)] cursor-pointer"
              />
            </div>

            {/* Max Drawdown Threshold */}
            <div className="space-y-2 pt-1">
              <div className="flex justify-between items-center text-xs font-mono">
                <label className="text-[var(--text-secondary)] uppercase tracking-wider">
                  Ruin / Max Drawdown Level
                </label>
                <span className="font-bold text-[var(--text-primary)]">{maxDD}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={maxDD}
                onChange={(e) => setMaxDD(Number(e.target.value))}
                className="w-full accent-[var(--accent)] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[var(--text-tertiary)]">
                <span>10% (Prop Firm Fail)</span>
                <span>25% (Serious Trough)</span>
                <span>100% (Account Blown)</span>
              </div>
            </div>

            {/* Trade Sample Horizon */}
            <div className="space-y-2 pt-1">
              <div className="flex justify-between items-center text-xs font-mono">
                <label className="text-[var(--text-secondary)] uppercase tracking-wider">
                  Trade Horizon (Sample Size)
                </label>
                <span className="font-bold text-[var(--text-primary)]">{trades} Trades</span>
              </div>
              <div className="flex gap-2">
                {[50, 100, 250, 500].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTrades(t)}
                    className="flex-1 py-1.5 text-xs font-mono border rounded transition-colors"
                    style={{
                      borderColor: trades === t ? "var(--accent)" : "var(--border-subtle)",
                      backgroundColor: trades === t ? "var(--accent)" : "transparent",
                      color: trades === t ? "#FFFFFF" : "var(--text-secondary)",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Output Card & Histogram */}
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
                    Mathematical Result
                  </span>
                  <div className="text-sm font-sans font-semibold text-[var(--text-primary)]">
                    Survival Probability
                  </div>
                </div>
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-mono font-medium ${
                    result.probabilityOfRuinPercent < 1
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : result.probabilityOfRuinPercent < 10
                      ? "border-amber-200 bg-amber-50 text-amber-800"
                      : "border-rose-200 bg-rose-50 text-rose-700"
                  }`}
                >
                  {result.probabilityOfRuinPercent < 1 ? "Institutional Grade" : result.probabilityOfRuinPercent < 10 ? "Moderate Danger" : "High Ruin Risk"}
                </div>
              </div>

              {/* Primary Callout: Risk of Ruin */}
              <div
                className="p-6 text-center space-y-1 border"
                style={{
                  backgroundColor: "rgba(22,33,62,0.025)",
                  borderColor: "rgba(22,33,62,0.08)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <div className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                  Probability of Touching -{maxDD}% Drawdown
                </div>
                <div
                  className={`text-4xl sm:text-5xl font-mono font-bold tracking-tight tabular-nums ${
                    result.probabilityOfRuinPercent < 1
                      ? "text-[var(--market-up)]"
                      : result.probabilityOfRuinPercent < 10
                      ? "text-amber-600"
                      : "text-[var(--market-down)]"
                  }`}
                >
                  {result.probabilityOfRuinPercent < 0.01 ? "<0.01%" : `${result.probabilityOfRuinPercent.toFixed(2)}%`}
                </div>
                <div className="text-xs font-mono text-[var(--text-secondary)] pt-1">
                  Expected Value: {result.expectedValueR > 0 ? "+" : ""}{result.expectedValueR.toFixed(2)}R per trade ({result.hasEdge ? "Positive Expectancy" : "Negative Edge"})
                </div>
              </div>

              {/* Metric Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-black/5 rounded bg-[var(--surface-raised)]">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] block">
                    Consecutive Losses to Ruin
                  </span>
                  <div className="text-xl font-mono font-bold text-[var(--text-primary)] mt-1">
                    {result.consecutiveLossesToRuin} Trades
                  </div>
                  <span className="text-[11px] font-mono text-[var(--text-secondary)]">
                    At {riskPerTrade}% fixed risk
                  </span>
                </div>

                <div className="p-4 border border-black/5 rounded bg-[var(--surface-raised)]">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] block">
                    Mathematical Edge
                  </span>
                  <div className="text-xl font-mono font-bold text-[var(--market-up)] mt-1">
                    {result.hasEdge ? "Statistically Valid" : "Sub-Zero Edge"}
                  </div>
                  <span className="text-[11px] font-mono text-[var(--text-secondary)]">
                    {result.expectedValuePercent > 0 ? `+${result.expectedValuePercent.toFixed(2)}%` : `${result.expectedValuePercent.toFixed(2)}%`} EV per trade
                  </span>
                </div>
              </div>

              {/* Drawdown Distribution Histogram */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                    Drawdown Probability Distribution
                  </span>
                  <span className="text-[11px] text-[var(--text-tertiary)]">
                    Over {trades} trades
                  </span>
                </div>

                <div className="space-y-2">
                  {result.drawdownDistribution.map((item) => (
                    <div key={item.drawdownThreshold} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-[var(--text-secondary)]">
                          -{item.drawdownThreshold}% Drawdown
                        </span>
                        <span className="font-bold text-[var(--text-primary)]">
                          {item.probabilityPercent.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all duration-300 rounded-full"
                          style={{
                            width: `${Math.min(100, item.probabilityPercent)}%`,
                            backgroundColor:
                              item.probabilityPercent > 50
                                ? "var(--market-down)"
                                : item.probabilityPercent > 15
                                ? "#d97706"
                                : "var(--market-up)",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Show The Working */}
        <ToolWorkingBox steps={result.formulaSteps} />

        {/* Educational Section */}
        <ToolFormulaSection
          title="The Mathematics Behind Risk of Ruin"
          description="Risk of Ruin originates in classical probability theory (gambler's ruin) and quantitative asset management. Formulated by Ralph Vince and Perry Kaufman, this analytical model determines the exact probability that an agent playing a positive expectancy game will breach an absorbing ruin barrier before their statistical edge manifests."
          formulaLatex="P_{\text{ruin}}(T) = \min\left(1.0, \left( \frac{1 - A}{1 + A} \right)^U \times \left(1 - e^{-T / (10 \times U)}\right)\right) \times 100 \quad \text{where} \quad A = \frac{W \times RR - L}{W \times RR + L}"
          variables={[
            {
              symbol: "W",
              name: "Win Rate",
              unit: "Fraction [0.01, 0.99]",
              description: "Statistical probability of any single independent trade closing in profit.",
            },
            {
              symbol: "L",
              name: "Loss Rate",
              unit: "Fraction (1 - W)",
              description: "Statistical probability of an individual trade closing at a loss.",
            },
            {
              symbol: "RR",
              name: "Reward-to-Risk (Payoff Ratio)",
              unit: "Ratio (Target R ÷ Risk R)",
              description: "Average profit magnitude relative to baseline 1.0 unit risk.",
            },
            {
              symbol: "A",
              name: "Edge Advantage Coefficient",
              unit: "Dimensionless [-1.0, 1.0]",
              description: "Normalized payoff edge margin. Values ≤ 0 denote negative expectancy (ruin = 99.9%).",
            },
            {
              symbol: "U",
              name: "Units of Risk Capital",
              unit: "Integer (MaxDD ÷ Risk)",
              description: "Number of standard fixed-risk trading units available before hitting the ruin threshold.",
            },
            {
              symbol: "N",
              name: "Consecutive Losses to Ruin",
              unit: "Trades (ln(1 - MaxDD) ÷ ln(1 - Risk))",
              description: "Number of back-to-back losing trades required to breach the drawdown threshold under capital decay.",
            },
            {
              symbol: "T",
              name: "Trade Sample Horizon",
              unit: "Number of Trades",
              description: "The evaluation window over which the ruin probability is calculated.",
            },
          ]}
          steps={[
            "Calculate expected value (EV) in R units: EV = (Win Rate × Reward) - (Loss Rate × 1.0). If EV ≤ 0, statistical ruin approaches 100%.",
            "Evaluate the edge advantage coefficient (A) as the normalized payoff margin between winning edge and loss probability.",
            "Determine integer units of risk capital available (U = ⌊Max Drawdown % ÷ Risk per Trade %⌋).",
            "Calculate the consecutive loss threshold under compounding equity decay (N = ⌈ln(1 - MaxDD) ÷ ln(1 - Risk)⌉).",
            "Compute the asymptotic ruin probability and scale by the finite trade horizon factor (1 - exp(-T / (10 × U))).",
          ]}
          workedExample={{
            title: "Analytical Worked Example: Prop Challenge Survival Modeling",
            scenario: "A trader with a 50% win rate and 1:1.5 reward-to-risk risks 1.5% per trade on an account with a 25% maximum drawdown threshold over a 100-trade sample horizon.",
            steps: [
              { label: "Expected Value (EV)", formula: "(0.50 × 1.5) - (0.50 × 1.0)", value: "+0.25 R (+0.38% EV per trade)" },
              { label: "Edge Coefficient (A)", formula: "(0.75 - 0.50) ÷ (0.75 + 0.50)", value: "0.2000 (Positive Statistical Edge)" },
              { label: "Units of Capital (U)", formula: "⌊25% ÷ 1.5%⌋", value: "16 risk units" },
              { label: "Consecutive Losses to Ruin (N)", formula: "⌈ln(0.75) ÷ ln(0.985)⌉", value: "20 consecutive losses" },
              { label: "Asymptotic Ruin Probability", formula: "((1 - 0.20) ÷ (1 + 0.20))^16", value: "0.152% (Infinite Horizon)" },
              { label: "Finite Horizon Factor (100 trades)", formula: "1 - exp(-100 ÷ 160)", value: "0.4647 (Finite Horizon Scalar)" },
              { label: "Calculated 100-Trade Ruin Probability", formula: "0.152% × 0.4647", value: "0.07% Risk of Ruin" },
            ],
            conclusion: "Because risk per trade is restricted to 1.5%, the trader maintains 16 units of risk buffer. Even across 100 trades, the probability of breaching the 25% drawdown limit is negligible (0.07%). If the trader increased risk to 3.0% (8 units), ruin probability would surge to over 3.7%.",
          }}
          assumptions={[
            "Trades represent independent, identically distributed (IID) Bernoulli trials.",
            "The absorbing ruin barrier stops trading immediately when touched (no capital replenishment).",
            "Win rate and payoff ratio remain stationary and do not decay during adverse variance.",
            "Risk per trade is sized as a fixed fraction of current equity without compounding leverage drift.",
          ]}
          limitations={[
            "Financial markets exhibit fat tails (leptokurtosis) and regime shifts; live losing runs often exceed pure Gaussian/Bernoulli predictions.",
            "Execution slippage and overnight financing drag are not modeled in the analytical payoff equation.",
            "In prop evaluations with daily drawdown caps, intra-day drawdowns can breach accounts even if multi-day ruin probability is low.",
          ]}
          relatedLinks={[
            {
              label: "Drawdown Modeler",
              href: "/calculators/drawdown",
              description: "Model consecutive loss streaks and capital decay under fixed-fractional sizing",
            },
            {
              label: "Position Size Calculator",
              href: "/tools/position-size-calculator",
              description: "Calculate exact lot sizes to keep individual trade risk strictly within survival bounds",
            },
            {
              label: "Drawdown Recovery Calculator",
              href: "/calculators/drawdown-recovery",
              description: "Model the exponential gain required to recover from drawdown thresholds",
            },
            {
              label: "Research Paper: Non-Linear Recovery Decay",
              href: "/research/risk",
              description: "Peer-reviewed analysis of capital preservation and survival dynamics in trading",
            },
          ]}
          faqs={[
            {
              question: "Can a profitable strategy have a 100% risk of ruin?",
              answer:
                "Yes. If you have a 60% win rate and 1:1 reward-to-risk, you possess a solid edge. However, if you risk 10% per trade and can only tolerate a 20% drawdown, two consecutive losses will blow the account. The probability of two consecutive losses over 100 trades is virtually guaranteed (99.8%).",
            },
            {
              question: "How do prop firms exploit this math?",
              answer:
                "Prop firms cap maximum drawdown at 8–10% and demand a 10% profit target within tight timelines. This forces traders to risk 1.5–2% per trade, pushing their probability of ruin above 60% even if their strategy is genuinely profitable.",
            },
          ]}
        />

        {/* Contextual CTA */}
        <ToolContextualCTA
          toolName="Risk of Ruin Calculator"
          lead="Statistical survival is the only prerequisite for profitability."
          benefit="The Drawdown curriculum teaches you how to structure risk per trade so your risk of ruin remains below 0.1% across every session."
        />

        <ToolDisclaimer />
      </div>
    </div>
  );
}
