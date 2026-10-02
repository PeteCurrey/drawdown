"use client";

import React, { useState, useMemo } from "react";
import { ShieldAlert, BarChart2, Download, Code, Info } from "lucide-react";
import { EmbedWidgetModal } from "./EmbedWidgetModal";

export const RiskOfRuinSimulator: React.FC = () => {
  const [winRatePct, setWinRatePct] = useState<number>(50);
  const [rewardToRisk, setRewardToRisk] = useState<number>(1.5);
  const [riskPerTradePct, setRiskPerTradePct] = useState<number>(2.0);
  const [maxAcceptableDD, setMaxAcceptableDD] = useState<number>(30.0);
  const [tradeCount, setTradeCount] = useState<number>(100);
  const [showEmbed, setShowEmbed] = useState<boolean>(false);

  const simulationResults = useMemo(() => {
    const W = winRatePct / 100;
    const L = 1 - W;
    const R = rewardToRisk;
    const r = riskPerTradePct / 100;
    const maxDD = maxAcceptableDD / 100;

    // Expected Value in R units
    const evInR = (W * R) - (L * 1);

    // Simplified analytical approximation for Risk of Ruin (Perry Kaufman / Vince model)
    // If EV <= 0, Risk of Ruin is 100%
    let ruinProb = 100;
    if (evInR > 0) {
      // Units of capital tolerable before maximum drawdown threshold is breached
      const unitsToRuin = maxDD / r;
      // Formula: ((1 - EV) / (1 + EV)) ^ unitsToRuin
      const p = (L / W); // simplified ratio
      ruinProb = Math.min(100, Math.max(0, Math.pow(p, unitsToRuin) * 100));
    }

    // Generate outcome distribution histogram steps (10 bins)
    const bins = Array.from({ length: 8 }, (_, i) => {
      const ddBin = (i + 1) * 10;
      const prob = evInR <= 0 ? 100 : Math.min(100, Math.pow(L / W, ddBin / (r * 100)) * 100);
      return { drawdown: ddBin, probability: Number(prob.toFixed(1)) };
    });

    return {
      evInR,
      ruinProb: Number(ruinProb.toFixed(1)),
      unitsToRuin: Math.round(maxAcceptableDD / riskPerTradePct),
      bins,
    };
  }, [winRatePct, rewardToRisk, riskPerTradePct, maxAcceptableDD, tradeCount]);

  const handleDownload = () => {
    const textData = `RISK OF RUIN SIMULATION REPORT — DRAWDOWN TRADING
Generated: ${new Date().toISOString().split("T")[0]}
--------------------------------------------------
Win Rate:               ${winRatePct}%
Reward-to-Risk Ratio:   1:${rewardToRisk}
Risk Per Trade:         ${riskPerTradePct}%
Max Acceptable Drawdown: ${maxAcceptableDD}%
Sample Horizon:         ${tradeCount} trades
--------------------------------------------------
Expected Value per Trade: ${simulationResults.evInR.toFixed(2)} R
Probability of Breaching ${maxAcceptableDD}% Drawdown: ${simulationResults.ruinProb}%
Consecutive Loss Capital Units: ${simulationResults.unitsToRuin} trades
--------------------------------------------------
Disclaimer: Risk of ruin calculations are statistical estimations based on constant parameters. Past performance and historical win rates do not guarantee future performance.
https://drawdown.trading/calculators/risk-of-ruin`;

    const blob = new Blob([textData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Risk-of-Ruin-Report-${winRatePct}win-${riskPerTradePct}risk.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-background-secondary border border-border-primary rounded-2xl p-6 sm:p-8 shadow-xl my-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border-primary/60">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-accent/10 text-accent">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary">Risk-of-Ruin Simulator</h2>
            <p className="text-xs text-text-tertiary">
              Statistical model of drawdown breach probability based on win rate and risk parameters.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEmbed(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-background-primary border border-border-primary/60 text-xs font-medium text-text-secondary hover:text-text-primary hover:border-accent transition"
          >
            <Code className="w-3.5 h-3.5" />
            Embed
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-accent text-background-primary text-xs font-semibold hover:bg-accent/90 transition"
          >
            <Download className="w-3.5 h-3.5" />
            Download Summary
          </button>
        </div>
      </div>

      {/* Grid Inputs / Outputs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-3">
            Simulation Inputs
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Win Rate (%)</label>
              <input
                type="number"
                value={winRatePct}
                onChange={(e) => setWinRatePct(Number(e.target.value))}
                className="w-full bg-background-primary border border-border-primary rounded-xl px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Reward-to-Risk (RRR)</label>
              <input
                type="number"
                step="0.1"
                value={rewardToRisk}
                onChange={(e) => setRewardToRisk(Number(e.target.value))}
                className="w-full bg-background-primary border border-border-primary rounded-xl px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Risk Per Trade (%)</label>
              <input
                type="number"
                step="0.1"
                value={riskPerTradePct}
                onChange={(e) => setRiskPerTradePct(Number(e.target.value))}
                className="w-full bg-background-primary border border-border-primary rounded-xl px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Max Acceptable DD (%)</label>
              <input
                type="number"
                value={maxAcceptableDD}
                onChange={(e) => setMaxAcceptableDD(Number(e.target.value))}
                className="w-full bg-background-primary border border-border-primary rounded-xl px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-accent"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-3">
            Ruin & Breach Probability
          </h3>

          <div className="bg-background-primary border border-border-primary rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-tertiary">Strategy EV / Trade</span>
              <span className={`text-sm font-mono font-bold ${simulationResults.evInR > 0 ? "text-emerald-400" : "text-red-400"}`}>
                {simulationResults.evInR > 0 ? `+${simulationResults.evInR.toFixed(2)} R` : `${simulationResults.evInR.toFixed(2)} R`}
              </span>
            </div>

            <div className="pt-3 border-t border-border-primary/40 flex items-center justify-between">
              <span className="text-xs font-medium text-text-secondary">
                Probability of Breaching {maxAcceptableDD}% DD
              </span>
              <span className={`text-2xl font-mono font-extrabold ${simulationResults.ruinProb > 20 ? "text-red-400" : simulationResults.ruinProb > 5 ? "text-amber-400" : "text-emerald-400"}`}>
                {simulationResults.ruinProb}%
              </span>
            </div>

            <div className="pt-3 border-t border-border-primary/40 flex items-center justify-between">
              <span className="text-xs text-text-tertiary">Loss Trades to Breach Threshold</span>
              <span className="text-sm font-mono font-bold text-text-primary">
                {simulationResults.unitsToRuin} consecutive trades
              </span>
            </div>
          </div>
        </div>
      </div>

      <EmbedWidgetModal
        toolTitle="Risk-of-Ruin Simulator"
        toolSlug="risk-of-ruin"
        isOpen={showEmbed}
        onClose={() => setShowEmbed(false)}
      />
    </div>
  );
};
