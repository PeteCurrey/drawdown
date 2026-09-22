"use client";

import React, { useState } from "react";
import { ShieldCheck } from "lucide-react";

export function CompoundingCalculator() {
  const [startBalance, setStartBalance] = useState<number>(10000);
  const [periodGain, setPeriodGain] = useState<number>(5);
  const [periods, setPeriods] = useState<number>(12);
  const [reinvestRate, setReinvestRate] = useState<number>(100);

  const compoundMultiplier = 1 + (periodGain * (reinvestRate / 100)) / 100;
  const endingBalance = startBalance * Math.pow(compoundMultiplier, periods);
  const netProfit = endingBalance - startBalance;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
      {/* Inputs Panel */}
      <div className="lg:col-span-5 p-8 border border-border-slate/50 bg-background-surface/40 backdrop-blur-md space-y-6">
        <h3 className="text-xs font-mono font-black uppercase tracking-widest text-accent">// PARAMETERS</h3>

        <div className="space-y-2">
          <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Starting Capital ($ / £ / €)</label>
          <input 
            type="number"
            value={startBalance}
            onChange={(e) => setStartBalance(Number(e.target.value))}
            className="w-full bg-background-primary border border-border-slate/50 p-4 text-sm font-mono outline-none focus:border-accent"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Gain Per Period (%)</label>
          <input 
            type="number"
            step="0.5"
            value={periodGain}
            onChange={(e) => setPeriodGain(Number(e.target.value))}
            className="w-full bg-background-primary border border-border-slate/50 p-4 text-sm font-mono outline-none focus:border-accent"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Number of Periods (Months / Quarters)</label>
          <input 
            type="number"
            value={periods}
            onChange={(e) => setPeriods(Number(e.target.value))}
            className="w-full bg-background-primary border border-border-slate/50 p-4 text-sm font-mono outline-none focus:border-accent"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest">
            <span className="text-text-tertiary">Reinvestment Rate</span>
            <span className="text-accent font-bold">{reinvestRate}%</span>
          </div>
          <input 
            type="range"
            min="10"
            max="100"
            step="10"
            value={reinvestRate}
            onChange={(e) => setReinvestRate(Number(e.target.value))}
            className="w-full h-1 bg-background-primary accent-accent appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Results Panel */}
      <div className="lg:col-span-7 flex flex-col justify-between gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          <div className="p-8 border border-border-slate/50 bg-background-primary/30 flex flex-col justify-between hover:border-accent transition-colors">
            <span className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">Ending Capital</span>
            <div className="mt-8">
              <p className="text-3xl font-sans font-black text-accent">${endingBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              <p className="text-[9px] font-mono text-text-tertiary mt-2 uppercase tracking-widest">PROJECTED BALANCES</p>
            </div>
          </div>

          <div className="p-8 border border-border-slate/50 bg-background-primary/30 flex flex-col justify-between hover:border-accent transition-colors">
            <span className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">Net Profits</span>
            <div className="mt-8">
              <p className="text-3xl font-sans font-black text-text-primary">${netProfit.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              <p className="text-[9px] font-mono text-text-tertiary mt-2 uppercase tracking-widest">TOTAL VALUE ADDED</p>
            </div>
          </div>
        </div>

        <div className="p-6 border border-accent/20 bg-accent/5 flex items-start gap-4">
          <ShieldCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-tight text-text-primary">Growth Expectancy Caution</h4>
            <p className="text-[11px] text-text-secondary leading-relaxed mt-1">
              Linear compounding calculations assume uniform periodic performance. Live trading returns exhibit volatility, variance, and periodic drawdowns that disrupt perfect compounding curves. Always evaluate risk alongside theoretical growth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
