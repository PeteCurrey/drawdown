"use client";

import React, { useState, useMemo } from "react";
import { Calculator, AlertTriangle, Download, Code, ArrowRight, ShieldAlert, RefreshCw } from "lucide-react";
import { EmbedWidgetModal } from "./EmbedWidgetModal";

export const DrawdownRecoveryCalculator: React.FC = () => {
  const [startingBalance, setStartingBalance] = useState<number>(10000);
  const [currentBalance, setCurrentBalance] = useState<number>(7500);
  const [riskPerTradePct, setRiskPerTradePct] = useState<number>(1.0);
  const [winRatePct, setWinRatePct] = useState<number>(50);
  const [rewardToRisk, setRewardToRisk] = useState<number>(1.5);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(0);
  const [showEmbed, setShowEmbed] = useState<boolean>(false);

  // Derived Calculations
  const calculations = useMemo(() => {
    const capitalLost = Math.max(0, startingBalance - currentBalance);
    const drawdownPct = startingBalance > 0 ? (capitalLost / startingBalance) * 100 : 0;
    const gainRequiredPct = currentBalance > 0 ? (capitalLost / currentBalance) * 100 : 0;

    // Expected Value per trade in R units
    // EV = (WinRate * RRR) - ((1 - WinRate) * 1)
    const winRate = winRatePct / 100;
    const evInR = (winRate * rewardToRisk) - ((1 - winRate) * 1);
    
    // Risk amount per trade in currency based on current balance
    const riskAmountCurrency = currentBalance * (riskPerTradePct / 100);
    const expectedProfitPerTrade = riskAmountCurrency * evInR;
    
    // Estimated trades to recover (assuming fixed currency risk per trade)
    const tradesToRecover = (expectedProfitPerTrade > 0 && capitalLost > 0)
      ? Math.ceil(capitalLost / expectedProfitPerTrade)
      : null;

    // Non-linear comparison table (10%, 20%, 30%, 50%, 75%, 90%)
    const recoveryTable = [10, 20, 30, 50, 75, 90].map((dd) => {
      const remainingPct = 100 - dd;
      const gainReq = (dd / remainingPct) * 100;
      return { drawdown: dd, gainRequired: gainReq };
    });

    return {
      capitalLost,
      drawdownPct,
      gainRequiredPct,
      evInR,
      expectedProfitPerTrade,
      tradesToRecover,
      recoveryTable,
    };
  }, [startingBalance, currentBalance, riskPerTradePct, winRatePct, rewardToRisk]);

  const handleDownloadSummary = () => {
    const textData = `DRAWDOWN RECOVERY REPORT — DRAWDOWN TRADING
Generated: ${new Date().toISOString().split("T")[0]}
--------------------------------------------------
Starting Balance: £${startingBalance.toLocaleString()}
Current Balance:  £${currentBalance.toLocaleString()}
Capital Lost:     £${calculations.capitalLost.toLocaleString()} (${calculations.drawdownPct.toFixed(1)}%)
--------------------------------------------------
REQUIRED GAIN TO RECOVER: ${calculations.gainRequiredPct.toFixed(2)}%
--------------------------------------------------
Risk Per Trade:   ${riskPerTradePct}%
Win Rate:         ${winRatePct}%
Reward-to-Risk:   1:${rewardToRisk}
Expected EV / Trade: ${calculations.evInR.toFixed(2)} R
Estimated Trades to Recovery: ${calculations.tradesToRecover || "N/A (Negative EV)"}
--------------------------------------------------
Methodology Note: Drawdown recovery is non-linear. As losses deepen, the percentage gain required relative to remaining equity expands exponentially.
https://drawdown.trading/calculators/drawdown-recovery`;

    const blob = new Blob([textData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Drawdown-Recovery-Report-${startingBalance}to${currentBalance}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-background-secondary border border-border-primary rounded-2xl p-6 sm:p-8 shadow-xl my-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border-primary/60">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-accent/10 text-accent">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary">Drawdown Recovery Calculator</h2>
            <p className="text-xs text-text-tertiary">
              Calculate exact percentage gains and trade estimates required to recover from capital losses.
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
            onClick={handleDownloadSummary}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-accent text-background-primary text-xs font-semibold hover:bg-accent/90 transition"
          >
            <Download className="w-3.5 h-3.5" />
            Download Summary
          </button>
        </div>
      </div>

      {/* Input / Output Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-6 space-y-5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-3">
            1. Account & Risk Parameters
          </h3>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              Starting Account Balance (£)
            </label>
            <input
              type="number"
              value={startingBalance}
              onChange={(e) => setStartingBalance(Number(e.target.value))}
              className="w-full bg-background-primary border border-border-primary rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              Current Account Balance (£)
            </label>
            <input
              type="number"
              value={currentBalance}
              onChange={(e) => setCurrentBalance(Number(e.target.value))}
              className="w-full bg-background-primary border border-border-primary rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Risk Per Trade (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={riskPerTradePct}
                onChange={(e) => setRiskPerTradePct(Number(e.target.value))}
                className="w-full bg-background-primary border border-border-primary rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Win Rate (%)
              </label>
              <input
                type="number"
                value={winRatePct}
                onChange={(e) => setWinRatePct(Number(e.target.value))}
                className="w-full bg-background-primary border border-border-primary rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              Reward-to-Risk Ratio (e.g. 1.5 = 1:1.5)
            </label>
            <input
              type="number"
              step="0.1"
              value={rewardToRisk}
              onChange={(e) => setRewardToRisk(Number(e.target.value))}
              className="w-full bg-background-primary border border-border-primary rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* Outputs & Results */}
        <div className="lg:col-span-6 space-y-5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-3">
            2. Required Recovery Metrics
          </h3>

          <div className="bg-background-primary border border-border-primary rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-tertiary">Capital Lost</span>
              <span className="text-sm font-mono font-bold text-red-400">
                -£{calculations.capitalLost.toLocaleString()} ({calculations.drawdownPct.toFixed(1)}%)
              </span>
            </div>

            <div className="pt-3 border-t border-border-primary/40 flex items-center justify-between">
              <span className="text-xs font-medium text-text-secondary">Required Percentage Gain</span>
              <span className="text-2xl font-mono font-extrabold text-accent">
                +{calculations.gainRequiredPct.toFixed(1)}%
              </span>
            </div>

            <div className="pt-3 border-t border-border-primary/40 flex items-center justify-between">
              <span className="text-xs text-text-tertiary">Strategy Expected Value (EV)</span>
              <span className={`text-xs font-mono font-semibold ${calculations.evInR > 0 ? "text-emerald-400" : "text-red-400"}`}>
                {calculations.evInR > 0 ? `+${calculations.evInR.toFixed(2)} R` : `${calculations.evInR.toFixed(2)} R (Negative)`}
              </span>
            </div>

            <div className="pt-3 border-t border-border-primary/40 flex items-center justify-between">
              <span className="text-xs text-text-tertiary">Estimated Trades to Breakeven</span>
              <span className="text-sm font-mono font-bold text-text-primary">
                {calculations.evInR <= 0
                  ? "Infinite (Negative EV)"
                  : calculations.tradesToRecover
                  ? `${calculations.tradesToRecover} trades`
                  : "0 trades"}
              </span>
            </div>
          </div>

          {/* Risk Warning Box */}
          {calculations.drawdownPct >= 20 && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-200/90 leading-relaxed">
                <strong className="font-semibold text-amber-400 block mb-0.5">Deep Drawdown Warning</strong>
                A {calculations.drawdownPct.toFixed(0)}% loss requires a {calculations.gainRequiredPct.toFixed(0)}% gain to recover. Increasing risk per trade to speed up recovery exponentially increases risk of total account ruin.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Non-linear Matrix Table */}
      <div className="mt-8 pt-6 border-t border-border-primary/60">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
          Non-Linear Recovery Reference Matrix
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
          {calculations.recoveryTable.map((item) => (
            <div
              key={item.drawdown}
              className={`p-3 rounded-xl border text-center ${
                Math.abs(item.drawdown - calculations.drawdownPct) < 5
                  ? "bg-accent/15 border-accent text-accent font-bold"
                  : "bg-background-primary border-border-primary/40 text-text-secondary"
              }`}
            >
              <div className="text-[11px] text-text-tertiary mb-0.5">-{item.drawdown}% Loss</div>
              <div className="text-sm font-mono font-semibold">+{item.gainRequired.toFixed(0)}%</div>
            </div>
          ))}
        </div>
      </div>

      <EmbedWidgetModal
        toolTitle="Drawdown Recovery Calculator"
        toolSlug="drawdown-recovery"
        isOpen={showEmbed}
        onClose={() => setShowEmbed(false)}
      />
    </div>
  );
};
