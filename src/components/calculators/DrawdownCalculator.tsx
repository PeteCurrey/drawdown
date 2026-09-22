"use client";

import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";

export function DrawdownCalculator() {
  const [balance, setBalance] = useState<number>(10000);
  const [winRate, setWinRate] = useState<number>(50);
  const [streakLength, setStreakLength] = useState<number>(5);
  const [riskPerTrade, setRiskPerTrade] = useState<number>(1);

  const probability = Math.pow((100 - winRate) / 100, streakLength) * 100;
  
  let currentBalance = balance;
  for (let i = 0; i < streakLength; i++) {
    currentBalance = currentBalance * (1 - riskPerTrade / 100);
  }
  const capitalLost = balance - currentBalance;
  const drawdownPercent = (capitalLost / balance) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
      {/* Inputs Panel */}
      <div className="lg:col-span-5 p-8 border border-border-slate/50 bg-background-surface/40 backdrop-blur-md space-y-6">
        <h3 className="text-xs font-mono font-black uppercase tracking-widest text-accent">// PARAMETERS</h3>
        
        <div className="space-y-2">
          <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Account Balance ($ / £ / €)</label>
          <input 
            type="number"
            value={balance}
            onChange={(e) => setBalance(Number(e.target.value))}
            className="w-full bg-background-primary border border-border-slate/50 p-4 text-sm font-mono outline-none focus:border-accent"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest">
            <span className="text-text-tertiary">Estimated Win Rate</span>
            <span className="text-accent font-bold">{winRate}%</span>
          </div>
          <input 
            type="range"
            min="20"
            max="90"
            step="5"
            value={winRate}
            onChange={(e) => setWinRate(Number(e.target.value))}
            className="w-full h-1 bg-background-primary accent-accent appearance-none cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Consecutive Losing Trades</label>
          <input 
            type="number"
            min="1"
            max="20"
            value={streakLength}
            onChange={(e) => setStreakLength(Number(e.target.value))}
            className="w-full bg-background-primary border border-border-slate/50 p-4 text-sm font-mono outline-none focus:border-accent"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest">
            <span className="text-text-tertiary">Risk Per Trade</span>
            <span className="text-accent font-bold">{riskPerTrade}%</span>
          </div>
          <input 
            type="range"
            min="0.25"
            max="10"
            step="0.25"
            value={riskPerTrade}
            onChange={(e) => setRiskPerTrade(Number(e.target.value))}
            className="w-full h-1 bg-background-primary accent-accent appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Results Panel */}
      <div className="lg:col-span-7 flex flex-col justify-between gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          <div className="p-8 border border-border-slate/50 bg-background-primary/30 flex flex-col justify-between hover:border-accent transition-colors">
            <span className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">Probability of Streak</span>
            <div className="mt-8">
              <p className="text-3xl font-sans font-black text-accent">{probability.toFixed(3)}%</p>
              <p className="text-[9px] font-mono text-text-tertiary mt-2 uppercase tracking-widest">STATISTICAL ODDS</p>
            </div>
          </div>

          <div className="p-8 border border-border-slate/50 bg-background-primary/30 flex flex-col justify-between hover:border-accent transition-colors">
            <span className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">Projected Drawdown</span>
            <div className="mt-8">
              <p className="text-3xl font-sans font-black text-red-500">{drawdownPercent.toFixed(2)}%</p>
              <p className="text-[9px] font-mono text-text-tertiary mt-2 uppercase tracking-widest">-${capitalLost.toLocaleString(undefined, { maximumFractionDigits: 2 })} CASH LOST</p>
            </div>
          </div>
        </div>

        <div className="p-6 border border-accent/20 bg-accent/5 flex items-start gap-4">
          <AlertTriangle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-tight text-text-primary">Drawdown Warning</h4>
            <p className="text-[11px] text-text-secondary leading-relaxed mt-1">
              A {streakLength}-trade losing streak has a {probability.toFixed(1)}% chance of occurring in any random sequence of trades at a {winRate}% win rate. Ensure your capital base can withstand this sequence without triggering account liquidation or prop challenge breach.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
