"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Info, AlertCircle, RefreshCcw } from "lucide-react";

type InstrumentType = 'stocks' | 'forex' | 'crypto' | 'spread-betting';

export default function RiskCalculator() {
  const [accountSize, setAccountSize] = useState<number>(10000);
  const [riskPercent, setRiskPercent] = useState<number>(1);
  const [entryPrice, setEntryPrice] = useState<number>(0);
  const [stopLoss, setStopLoss] = useState<number>(0);
  const [takeProfit, setTakeProfit] = useState<number>(0);
  const [instrument, setInstrument] = useState<InstrumentType>('forex');

  // Calculated values
  const [riskAmount, setRiskAmount] = useState<number>(0);
  const [positionSize, setPositionSize] = useState<number>(0);
  const [rewardAmount, setRewardAmount] = useState<number>(0);
  const [rrRatio, setRrRatio] = useState<number>(0);

  useEffect(() => {
    const risk = (accountSize * riskPercent) / 100;
    setRiskAmount(risk);

    if (entryPrice > 0 && stopLoss > 0 && entryPrice !== stopLoss) {
      const priceRisk = Math.abs(entryPrice - stopLoss);
      let size = risk / priceRisk;
      
      if (instrument === 'forex') {
        // Assuming Standard Lot (100,000 units) and pairs like GBPUSD
        // This is a simplified calculation for the shell
        size = size / 100000; 
      }
      
      setPositionSize(size);

      if (takeProfit > 0) {
        const priceReward = Math.abs(takeProfit - entryPrice);
        setRewardAmount(size * priceReward * (instrument === 'forex' ? 100000 : 1));
        setRrRatio(priceReward / priceRisk);
      }
    } else {
      setPositionSize(0);
      setRewardAmount(0);
      setRrRatio(0);
    }
  }, [accountSize, riskPercent, entryPrice, stopLoss, takeProfit, instrument]);

  return (
    <div className="pt-32 pb-24 bg-background-primary min-h-screen">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <span className="text-accent font-mono text-[10px] uppercase tracking-widest block mb-4">// AI TOOLS</span>
          <h1 className="text-4xl md:text-6xl font-display font-bold uppercase mb-4">Risk Calculator.</h1>
          <p className="text-text-secondary max-w-xl">
            Professional position sizing to protect your capital. Calculate your edge, manage your drawdown.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Inputs */}
          <div className="bg-background-surface border border-border-slate p-8 md:p-12 space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Account Size (£)</label>
                <input 
                  type="number" 
                  value={accountSize} 
                  onChange={(e) => setAccountSize(Number(e.target.value))}
                  className="w-full bg-background-primary border border-border-slate px-4 py-3 font-mono text-sm focus:border-accent outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Risk Per Trade (%)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={riskPercent} 
                  onChange={(e) => setRiskPercent(Number(e.target.value))}
                  className="w-full bg-background-primary border border-border-slate px-4 py-3 font-mono text-sm focus:border-accent outline-none"
                />
              </div>
            </div>

            <div className="space-y-4">
               <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Instrument Type</label>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {(['forex', 'stocks', 'crypto', 'spread-betting'] as InstrumentType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setInstrument(type)}
                      className={cn(
                        "py-3 text-[10px] font-bold uppercase tracking-widest border transition-all",
                        instrument === type ? "bg-accent text-background-primary border-accent" : "border-border-slate text-text-tertiary hover:border-text-secondary"
                      )}
                    >
                      {type.replace('-', ' ')}
                    </button>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Entry Price</label>
                <input 
                  type="number" 
                  value={entryPrice} 
                  onChange={(e) => setEntryPrice(Number(e.target.value))}
                  className="w-full bg-background-primary border border-border-slate px-4 py-3 font-mono text-sm focus:border-accent outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Stop Loss</label>
                <input 
                  type="number" 
                  value={stopLoss} 
                  onChange={(e) => setStopLoss(Number(e.target.value))}
                  className="w-full bg-background-primary border border-border-slate px-4 py-3 font-mono text-sm focus:border-accent outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Take Profit</label>
                <input 
                  type="number" 
                  value={takeProfit} 
                  onChange={(e) => setTakeProfit(Number(e.target.value))}
                  className="w-full bg-background-primary border border-border-slate px-4 py-3 font-mono text-sm focus:border-accent outline-none"
                />
              </div>
            </div>
          </div>

          {/* Outputs */}
          <div className="space-y-8">
            <div className="bg-background-elevated border border-border-slate p-8 md:p-12 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
              <div className="relative z-10 space-y-12">
                <div className="grid grid-cols-2 gap-12">
                  <div className="space-y-2">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Position Size</p>
                    <p className="text-4xl font-display font-black text-text-primary">
                      {positionSize.toFixed(instrument === 'forex' ? 2 : 0)}
                      <span className="text-xs ml-2 text-text-tertiary font-mono uppercase">
                        {instrument === 'forex' ? 'Lots' : instrument === 'stocks' ? 'Shares' : 'Units'}
                      </span>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Risk Amount</p>
                    <p className="text-4xl font-display font-black text-loss">
                      £{riskAmount.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-12 pt-12 border-t border-border-slate">
                  <div className="space-y-2">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Reward Potential</p>
                    <p className="text-2xl font-display font-bold text-profit">
                      £{rewardAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">R:R Ratio</p>
                    <p className="text-2xl font-display font-bold text-accent">
                      1:{rrRatio.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insight Card */}
            <div className="p-6 bg-accent/5 border border-accent/20 flex gap-4">
              <Info className="w-5 h-5 text-accent shrink-0" />
              <div className="space-y-2">
                <p className="text-[10px] font-mono uppercase font-bold tracking-widest text-accent">Drawdown Insight</p>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  At <span className="text-text-primary font-bold">{riskPercent}% risk</span>, a losing streak of 10 trades would result in a <span className="text-loss font-bold">{(100 * (1 - Math.pow(1 - riskPercent/100, 10))).toFixed(1)}%</span> total account drawdown. Always respect your stop loss to ensure survival.
                </p>
              </div>
            </div>

            <div className="p-4 border border-border-slate text-[9px] font-mono uppercase tracking-widest text-text-tertiary flex items-center gap-2">
              <AlertCircle className="w-3 h-3" />
              Not financial advice. Calculations are theoretical.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
