"use client";

import React, { useState, useMemo } from "react";
import { ShieldCheck, DollarSign, Download, Code, AlertCircle } from "lucide-react";
import { EmbedWidgetModal } from "./EmbedWidgetModal";

export const PropFirmChallengeCalculator: React.FC = () => {
  const [accountSize, setAccountSize] = useState<number>(100000);
  const [challengeFee, setChallengeFee] = useState<number>(499);
  const [resetFee, setResetFee] = useState<number>(399);
  const [attempts, setAttempts] = useState<number>(2);
  const [profitTargetPct, setProfitTargetPct] = useState<number>(10);
  const [maxDrawdownPct, setMaxDrawdownPct] = useState<number>(10);
  const [payoutSplitPct, setPayoutSplitPct] = useState<number>(80);
  const [showEmbed, setShowEmbed] = useState<boolean>(false);

  const calculations = useMemo(() => {
    const totalFeesPaid = challengeFee + Math.max(0, attempts - 1) * resetFee;
    const profitTargetCurrency = accountSize * (profitTargetPct / 100);
    const maxDrawdownCurrency = accountSize * (maxDrawdownPct / 100);

    // Required return relative to tolerable loss space
    // To make 10% profit with 10% max drawdown space requires a 1:1 gain relative to max risk limit.
    const riskAdjustedDifficulty = (profitTargetCurrency / maxDrawdownCurrency) * 100;

    // First payout breakeven calculation
    // To recover total upfront fees, how much net profit must trader generate after payout split?
    // Trader share = Net Profit * (Split / 100) = totalFeesPaid => Net Profit = totalFeesPaid / (Split / 100)
    const netProfitToBreakevenFees = payoutSplitPct > 0 ? totalFeesPaid / (payoutSplitPct / 100) : 0;
    const breakevenReturnPct = accountSize > 0 ? (netProfitToBreakevenFees / accountSize) * 100 : 0;

    return {
      totalFeesPaid,
      profitTargetCurrency,
      maxDrawdownCurrency,
      riskAdjustedDifficulty,
      netProfitToBreakevenFees,
      breakevenReturnPct,
    };
  }, [accountSize, challengeFee, resetFee, attempts, profitTargetPct, maxDrawdownPct, payoutSplitPct]);

  const handleDownload = () => {
    const textData = `PROP FIRM CHALLENGE COST REPORT — DRAWDOWN TRADING
Generated: ${new Date().toISOString().split("T")[0]}
--------------------------------------------------
Account Size:               £${accountSize.toLocaleString()}
Upfront Challenge Fee:      £${challengeFee}
Reset Fee:                  £${resetFee}
Expected Attempts:          ${attempts}
--------------------------------------------------
TOTAL OUT-OF-POCKET FEES:   £${calculations.totalFeesPaid.toLocaleString()}
Profit Target:              £${calculations.profitTargetCurrency.toLocaleString()} (${profitTargetPct}%)
Max Risk Space (Max DD):    £${calculations.maxDrawdownCurrency.toLocaleString()} (${maxDrawdownPct}%)
Payout Split:               ${payoutSplitPct}% Trader / ${100 - payoutSplitPct}% Firm
--------------------------------------------------
Net Profit Needed to Recover Fees: £${calculations.netProfitToBreakevenFees.toFixed(2)} (${calculations.breakevenReturnPct.toFixed(2)}% account gain)
--------------------------------------------------
Disclaimer: Prop-firm challenges involve trailing drawdown mechanics and strict loss limits. This tool calculates effective monetary break-even metrics based on user parameters.
https://drawdown.trading/calculators/prop-firm-challenge`;

    const blob = new Blob([textData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Prop-Firm-Cost-Report-${accountSize}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-background-secondary border border-border-primary rounded-2xl p-6 sm:p-8 shadow-xl my-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border-primary/60">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-accent/10 text-accent">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary">Prop-Firm Challenge Cost & Break-Even Calculator</h2>
            <p className="text-xs text-text-tertiary">
              Calculate total effective upfront fees and required profit to achieve genuine monetary break-even.
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
        {/* Inputs */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-3">
            Challenge Parameters
          </h3>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Evaluation Account Size (£)</label>
            <input
              type="number"
              value={accountSize}
              onChange={(e) => setAccountSize(Number(e.target.value))}
              className="w-full bg-background-primary border border-border-primary rounded-xl px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-accent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Initial Fee (£)</label>
              <input
                type="number"
                value={challengeFee}
                onChange={(e) => setChallengeFee(Number(e.target.value))}
                className="w-full bg-background-primary border border-border-primary rounded-xl px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Reset Fee (£)</label>
              <input
                type="number"
                value={resetFee}
                onChange={(e) => setResetFee(Number(e.target.value))}
                className="w-full bg-background-primary border border-border-primary rounded-xl px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Attempts</label>
              <input
                type="number"
                min={1}
                value={attempts}
                onChange={(e) => setAttempts(Number(e.target.value))}
                className="w-full bg-background-primary border border-border-primary rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Target (%)</label>
              <input
                type="number"
                value={profitTargetPct}
                onChange={(e) => setProfitTargetPct(Number(e.target.value))}
                className="w-full bg-background-primary border border-border-primary rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Payout (%)</label>
              <input
                type="number"
                value={payoutSplitPct}
                onChange={(e) => setPayoutSplitPct(Number(e.target.value))}
                className="w-full bg-background-primary border border-border-primary rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-3">
            Effective Out-of-Pocket & Break-Even
          </h3>

          <div className="bg-background-primary border border-border-primary rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-tertiary">Total Upfront Fees Paid</span>
              <span className="text-sm font-mono font-bold text-amber-400">
                £{calculations.totalFeesPaid.toLocaleString()}
              </span>
            </div>

            <div className="pt-3 border-t border-border-primary/40 flex items-center justify-between">
              <span className="text-xs font-medium text-text-secondary">
                Net Profit Required to Recover Fees
              </span>
              <span className="text-2xl font-mono font-extrabold text-accent">
                £{calculations.netProfitToBreakevenFees.toFixed(0)}
              </span>
            </div>

            <div className="pt-3 border-t border-border-primary/40 flex items-center justify-between">
              <span className="text-xs text-text-tertiary">Account Return to Break Even</span>
              <span className="text-sm font-mono font-bold text-text-primary">
                +{calculations.breakevenReturnPct.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <EmbedWidgetModal
        toolTitle="Prop-Firm Challenge Cost Calculator"
        toolSlug="prop-firm-challenge"
        isOpen={showEmbed}
        onClose={() => setShowEmbed(false)}
      />
    </div>
  );
};
