"use client";

import React, { useState } from "react";
import { ShieldAlert, ChevronRight, HelpCircle, AlertTriangle, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LeadMagnet } from "@/components/seo/LeadMagnet";
import { cn } from "@/lib/utils";

export default function RiskOfRuinCalculatorPage() {
  const [winRate, setWinRate] = useState<number>(45);
  const [winLossRatio, setWinLossRatio] = useState<number>(2.0); // Reward to Risk
  const [riskPerTrade, setRiskPerTrade] = useState<number>(2);
  const [ruinThreshold, setRuinThreshold] = useState<number>(50); // Loss level for ruin

  const p = winRate / 100;
  const q = 1 - p;
  const expectedValue = (p * winLossRatio) - q;
  
  let riskOfRuin = 100;
  if (expectedValue > 0) {
    const r = q / (p * winLossRatio);
    const capitalUnits = ruinThreshold / riskPerTrade;
    riskOfRuin = Math.pow(r, capitalUnits) * 100;
  }

  return (
    <div className="bg-white min-h-screen pb-24 pt-32 text-mkt-ink">
      <div className="container mx-auto px-6 max-w-5xl">
        <Breadcrumbs 
          items={[
            { label: "Calculators", href: "/calculators" },
            { label: "Risk Of Ruin", href: "/calculators/risk-of-ruin" }
          ]}
        />

        {/* Hero */}
        <header className="mb-12 max-w-3xl space-y-4">
          <div className="flex items-center gap-3 text-accent">
            <ShieldAlert className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Risk Modeler</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-sans font-black uppercase leading-tight">
            Risk of Ruin <span className="text-accent italic">Calculator.</span>
          </h1>
          <p className="text-sm text-mkt-i2 leading-relaxed">
            Calculate the statistical probability of drawing down your trading account to a point of ruin.
          </p>
        </header>

        {/* Interactive Calculator Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          {/* Inputs Panel */}
          <div className="lg:col-span-5 p-8 border border-mkt-bd bg-white space-y-6">
            <h3 className="text-xs font-mono font-black uppercase tracking-widest text-accent">// PARAMETERS</h3>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest">
                <span className="text-mkt-i4">Win Rate</span>
                <span className="text-accent font-bold">{winRate}%</span>
              </div>
              <input 
                type="range"
                min="20"
                max="80"
                step="1"
                value={winRate}
                onChange={(e) => setWinRate(Number(e.target.value))}
                className="w-full h-1 bg-[#F7F7F7] accent-accent appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4">Reward-to-Risk Ratio (R:R)</label>
              <input 
                type="number"
                step="0.1"
                value={winLossRatio}
                onChange={(e) => setWinLossRatio(Number(e.target.value))}
                className="w-full bg-[#F7F7F7] border border-mkt-bd p-4 text-sm font-mono outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4">Risk Per Trade (%)</label>
              <input 
                type="number"
                step="0.5"
                value={riskPerTrade}
                onChange={(e) => setRiskPerTrade(Number(e.target.value))}
                className="w-full bg-[#F7F7F7] border border-mkt-bd p-4 text-sm font-mono outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4">Ruin Threshold (% Account Loss)</label>
              <input 
                type="number"
                value={ruinThreshold}
                onChange={(e) => setRuinThreshold(Number(e.target.value))}
                className="w-full bg-[#F7F7F7] border border-mkt-bd p-4 text-sm font-mono outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              <div className="p-8 border border-mkt-bd bg-[#F7F7F7]/30 flex flex-col justify-between hover:border-accent transition-colors">
                <span className="text-[9px] font-mono text-mkt-i4 uppercase tracking-widest">Expectancy Value</span>
                <div className="mt-8">
                  <p className={cn(
                    "text-3xl font-sans font-black",
                    expectedValue > 0 ? "text-accent" : "text-red-500"
                  )}>
                    {expectedValue > 0 ? `+${expectedValue.toFixed(2)} R` : `${expectedValue.toFixed(2)} R`}
                  </p>
                  <p className="text-[9px] font-mono text-mkt-i4 mt-2 uppercase tracking-widest">NET EXPECTANCY PER TRADE</p>
                </div>
              </div>

              <div className="p-8 border border-mkt-bd bg-[#F7F7F7]/30 flex flex-col justify-between hover:border-accent transition-colors">
                <span className="text-[9px] font-mono text-mkt-i4 uppercase tracking-widest">Risk of Ruin</span>
                <div className="mt-8">
                  <p className={cn(
                    "text-3xl font-sans font-black",
                    riskOfRuin > 1 ? "text-red-500" : "text-mkt-grn"
                  )}>
                    {riskOfRuin >= 100 ? "100%" : `${riskOfRuin.toFixed(3)}%`}
                  </p>
                  <p className="text-[9px] font-mono text-mkt-i4 mt-2 uppercase tracking-widest">PROBABILITY OF HIT THRESHOLD</p>
                </div>
              </div>
            </div>

            <div className="p-6 border border-accent/20 bg-accent/5 flex items-start gap-4">
              <AlertTriangle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-tight text-mkt-ink">Mathematical Inevitability</h4>
                <p className="text-[11px] text-mkt-i2 leading-relaxed mt-1">
                  {expectedValue <= 0 ? (
                    "Your system has a negative expected value. If you trade infinitely under these conditions, your risk of ruin is mathematically guaranteed to hit 100%."
                  ) : (
                    `With positive expectancy (+${expectedValue.toFixed(2)}), your risk of ruin is low (${riskOfRuin.toFixed(3)}%), assuming consistent size execution.`
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Article Content */}
        <article className="prose prose-slate max-w-none text-mkt-i2 leading-relaxed mb-20 space-y-8 border-t border-mkt-bd/30 pt-16">
          <h2 className="text-3xl font-sans font-black uppercase text-mkt-ink">What is Risk of Ruin in Trading?</h2>
          <p>
            The Risk of Ruin is a mathematical concept that calculates the probability that a trader will lose a specific amount of capital (the "ruin threshold") before achieving their growth targets. Ruin does not necessarily mean losing 100% of your account; in prop firm challenges, losing 5% to 10% constitutes ruin, and for retail accounts, losing 50% is often considered a point of no return.
          </p>

          <h3 className="text-xl font-bold uppercase text-mkt-ink">Mathematical Logic</h3>
          <p>
            The Risk of Ruin depends on three main variables: your strategy's win rate, its reward-to-risk ratio, and the size of your risk relative to your ruin threshold:
          </p>
          <div className="bg-[#F7F7F7] p-6 border border-mkt-bd font-mono text-xs overflow-x-auto text-mkt-ink">
            Expected Value = (Win Rate × Reward) - (Loss Rate × Risk)
          </div>
          <p>
            If your expectancy value is negative, you will eventually reach ruin. If your expected value is positive, the risk of ruin decreases exponentially as your capital units (Threshold / Risk Size) increase. This is why keeping your risk per trade small (e.g. 1% instead of 5%) dramatically reduces your probability of blowing the account.
          </p>
        </article>

        {/* Lead Magnet */}
        <LeadMagnet 
          resourceId="risk-guide" 
          title="Download the Complete Risk Management Guide PDF"
          description="Access Pete Currey's advanced mathematical models for portfolio safety and drawdowns."
        />
      </div>
    </div>
  );
}
