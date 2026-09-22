"use client";

import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";

export function PropFirmMaximumLossCalculator() {
  const [accountSize, setAccountSize] = useState<number>(100000);
  const [maxLimitPercent, setMaxLimitPercent] = useState<number>(10);
  const [currentEquity, setCurrentEquity] = useState<number>(98000);

  const allowedMaxLoss = (accountSize * maxLimitPercent) / 100;
  const maxLossFloor = accountSize - allowedMaxLoss;
  const distanceToBreach = currentEquity - maxLossFloor;
  const percentToBreach = accountSize > 0 ? (distanceToBreach / accountSize) * 100 : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
      {/* Inputs Panel */}
      <div className="lg:col-span-5 p-8 border border-border-slate/50 bg-background-surface/40 backdrop-blur-md space-y-6">
        <h3 className="text-xs font-mono font-black uppercase tracking-widest text-accent">// PARAMETERS</h3>

        <div className="space-y-2">
          <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Initial Account Size ($ / £ / €)</label>
          <input 
            type="number"
            value={accountSize}
            onChange={(e) => setAccountSize(Number(e.target.value))}
            className="w-full bg-background-primary border border-border-slate/50 p-4 text-sm font-mono outline-none focus:border-accent"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest">
            <span className="text-text-tertiary">Max Drawdown Limit</span>
            <span className="text-accent font-bold">{maxLimitPercent}%</span>
          </div>
          <input 
            type="range"
            min="5"
            max="15"
            step="0.5"
            value={maxLimitPercent}
            onChange={(e) => setMaxLimitPercent(Number(e.target.value))}
            className="w-full h-1 bg-background-primary accent-accent appearance-none cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Current Account Equity ($ / £ / €)</label>
          <input 
            type="number"
            value={currentEquity}
            onChange={(e) => setCurrentEquity(Number(e.target.value))}
            className="w-full bg-background-primary border border-border-slate/50 p-4 text-sm font-mono outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Results Panel */}
      <div className="lg:col-span-7 flex flex-col justify-between gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          <div className="p-8 border border-border-slate/50 bg-background-primary/30 flex flex-col justify-between hover:border-accent transition-colors">
            <span className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">Max Drawdown Floor</span>
            <div className="mt-8">
              <p className="text-3xl font-sans font-black text-red-500">${maxLossFloor.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className="text-[9px] font-mono text-text-tertiary mt-2 uppercase tracking-widest">ABSOLUTE BREACH LEVEL</p>
            </div>
          </div>

          <div className="p-8 border border-border-slate/50 bg-background-primary/30 flex flex-col justify-between hover:border-accent transition-colors">
            <span className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">Remaining Buffer</span>
            <div className="mt-8">
              <p className="text-3xl font-sans font-black text-accent">${distanceToBreach.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className="text-[9px] font-mono text-text-tertiary mt-2 uppercase tracking-widest">{percentToBreach.toFixed(2)}% TOTAL BUFFER REMAINING</p>
            </div>
          </div>
        </div>

        <div className="p-6 border border-accent/20 bg-accent/5 flex items-start gap-4">
          <AlertTriangle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-tight text-text-primary">Static vs Trailing Max Drawdown</h4>
            <p className="text-[11px] text-text-secondary leading-relaxed mt-1">
              Static drawdown rules (FTMO) lock the loss floor permanently below your starting balance. Trailing drawdown models (e.g. Apex, TradeDay) trail your highest equity mark until reaching starting balance. Ensure you are applying the exact model used by your evaluation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
