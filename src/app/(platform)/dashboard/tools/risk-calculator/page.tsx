"use client";

import { useState, useEffect } from "react";
import { 
  Percent, 
  Target, 
  ShieldAlert, 
  Info,
  RefreshCw,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function RiskCalculator() {
  const [balance, setBalance] = useState<number>(50000);
  const [riskPercent, setRiskPercent] = useState<number>(1);
  const [entryPrice, setEntryPrice] = useState<number>(1.2500);
  const [stopLoss, setStopLoss] = useState<number>(1.2450);
  
  const riskAmount = (balance * riskPercent) / 100;
  const pipsAtRisk = Math.abs(entryPrice - stopLoss) * 10000;
  const positionSize = pipsAtRisk > 0 ? (riskAmount / (pipsAtRisk * 10)) : 0; // Standard lot pip value approx $10

  return (
    <div className="space-y-12 animate-in fade-in duration-700 max-w-5xl">
      <header className="border-b border-border-slate pb-8">
        <div className="flex items-center gap-3 text-profit mb-4">
          <Percent className="w-5 h-5" />
          <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Module_04 // Execution</span>
        </div>
        <h1 className="text-4xl font-display font-bold uppercase tracking-tight">Risk <span className="text-accent">Modeler.</span></h1>
        <p className="text-sm text-text-tertiary mt-2">Precision position sizing and drawdown protection engine.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Input Panel */}
        <div className="lg:col-span-5 space-y-8 bg-background-surface border border-border-slate p-8">
           <div className="space-y-4">
              <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Account Balance (GBP)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary font-mono">£</span>
                <input 
                  type="number" 
                  value={balance}
                  onChange={(e) => setBalance(Number(e.target.value))}
                  className="w-full bg-background-primary border border-border-slate p-4 pl-10 text-xl font-display font-bold outline-none focus:border-accent"
                />
              </div>
           </div>

           <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Risk Per Trade (%)</label>
                <span className="text-xs font-mono text-accent">{riskPercent}%</span>
              </div>
              <input 
                type="range" 
                min="0.25" 
                max="5" 
                step="0.25"
                value={riskPercent}
                onChange={(e) => setRiskPercent(Number(e.target.value))}
                className="w-full h-1 bg-background-elevated accent-accent appearance-none cursor-pointer"
              />
           </div>

           <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Entry Price</label>
                <input 
                  type="number" 
                  step="0.0001"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(Number(e.target.value))}
                  className="w-full bg-background-primary border border-border-slate p-4 text-lg font-mono outline-none focus:border-accent"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Stop Loss</label>
                <input 
                  type="number" 
                  step="0.0001"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(Number(e.target.value))}
                  className="w-full bg-background-primary border border-border-slate p-4 text-lg font-mono outline-none focus:border-loss/50"
                />
              </div>
           </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 flex flex-col gap-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
              <div className="p-8 bg-background-surface border border-border-slate flex flex-col justify-between group hover:border-accent transition-colors">
                 <div className="flex justify-between items-start">
                    <span className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">Amount at Risk</span>
                    <ShieldAlert className="w-4 h-4 text-loss opacity-50" />
                 </div>
                 <div className="mt-8">
                    <p className="text-3xl font-display font-black text-loss">£{riskAmount.toLocaleString()}</p>
                    <p className="text-[10px] font-mono text-text-tertiary mt-2 uppercase">TOTAL CASH EXPOSURE</p>
                 </div>
              </div>

              <div className="p-8 bg-background-surface border border-border-slate flex flex-col justify-between group hover:border-profit transition-colors">
                 <div className="flex justify-between items-start">
                    <span className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">Position Size</span>
                    <TrendingUp className="w-4 h-4 text-profit opacity-50" />
                 </div>
                 <div className="mt-8">
                    <p className="text-3xl font-display font-black text-profit">{positionSize.toFixed(2)} Lots</p>
                    <p className="text-[10px] font-mono text-text-tertiary mt-2 uppercase">STANDARD LOTS (MT4/MT5)</p>
                 </div>
              </div>
           </div>

           <div className="p-8 bg-accent/5 border border-accent/20 rounded-sm">
              <div className="flex items-start gap-4">
                 <AlertTriangle className="w-5 h-5 text-accent mt-1 shrink-0" />
                 <div>
                    <h4 className="text-sm font-display font-bold uppercase mb-2">Exposure Warning</h4>
                    <p className="text-xs text-text-secondary leading-relaxed">
                       A risk of {riskPercent}% on a £{balance.toLocaleString()} account means you can sustain <span className="text-text-primary font-bold">{Math.floor(100/riskPercent)}</span> consecutive losses before total liquidation. Always verify spread and commission before execution.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
