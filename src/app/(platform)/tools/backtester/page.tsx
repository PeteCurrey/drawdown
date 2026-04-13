"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Play, 
  Settings, 
  Terminal, 
  BarChart3, 
  History, 
  BrainCircuit,
  AlertCircle,
  ChevronRight,
  Loader2
} from "lucide-react";

type BacktestStep = 'define' | 'params' | 'results';

export default function BacktesterPage() {
  const [step, setStep] = useState<BacktestStep>('define');
  const [isSimulating, setIsSimulating] = useState(false);
  const [strategy, setStrategy] = useState("");

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setStep('results');
    }, 2500);
  };

  return (
    <div className="pt-32 pb-24 bg-background-primary min-h-screen">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <span className="text-accent font-mono text-[10px] uppercase tracking-widest block mb-4">// HYPOTHETICAL SIMULATION</span>
            <h1 className="text-4xl md:text-6xl font-display font-bold uppercase mb-4">Backtester.</h1>
            <p className="text-text-secondary max-w-xl">
              Turn your intuition into a mechanical edge. Validate your strategy against years of historical data.
            </p>
          </div>
          
          {/* Step Indicator */}
          <div className="flex items-center gap-8">
            {[
              { id: 'define', label: '1. Define' },
              { id: 'params', label: '2. Setup' },
              { id: 'results', label: '3. Stats' },
            ].map((s) => (
              <div key={s.id} className="flex items-center gap-2">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  step === s.id ? "bg-accent animate-pulse" : "bg-border-slate"
                )} />
                <span className={cn(
                  "text-[10px] font-mono uppercase tracking-widest",
                  step === s.id ? "text-text-primary" : "text-text-tertiary"
                )}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {step === 'define' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="bg-background-surface border border-border-slate p-8 md:p-12 space-y-8">
                <div className="flex items-center gap-3 text-accent mb-2">
                  <Terminal className="w-5 h-5" />
                  <span className="text-[10px] font-mono uppercase font-bold tracking-widest uppercase">Strategy Definition (Natural Language)</span>
                </div>
                <textarea 
                  value={strategy}
                  onChange={(e) => setStrategy(e.target.value)}
                  placeholder="E.g. Buy when the 20-day EMA crosses above the 50-day EMA and RSI is below 40. Close when RSI hits 70..."
                  className="w-full h-48 bg-background-primary border border-border-slate p-6 text-sm font-sans text-text-primary focus:border-accent outline-none resize-none placeholder:text-text-tertiary/50 leading-relaxed"
                />
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setStep('params')}
                    disabled={!strategy}
                    className="px-10 py-5 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors disabled:opacity-50"
                  >
                    Confirm Logic
                  </button>
                  <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest max-w-xs">
                    Our AI will translate your logic into backtestable rules.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-accent/5 border border-accent/20 space-y-4">
                   <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-accent">Example Strategy</h4>
                   <p className="text-xs text-text-secondary leading-relaxed italic">
                     "Buy when price breaks out of the 20-day high with RSI {'='} 60. Exit when price closes below the 10-day EMA."
                   </p>
                </div>
                <div className="p-8 border border-border-slate space-y-4 flex items-center gap-4">
                   <AlertCircle className="w-8 h-8 text-text-tertiary" />
                   <p className="text-[10px] text-text-tertiary leading-relaxed uppercase tracking-widest font-mono">
                     Backtest results are theoretical and do not include slippage or spread.
                   </p>
                </div>
              </div>
            </div>
          )}

          {step === 'params' && (
            <div className="bg-background-surface border border-border-slate p-8 md:p-12 animate-in fade-in slide-in-from-right-4 duration-700">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                  <div className="space-y-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Select Instrument</label>
                        <select className="w-full bg-background-primary border border-border-slate px-4 py-3 text-xs font-mono uppercase outline-none focus:border-accent">
                           <option>GBPUSD (Forex)</option>
                           <option>XAUUSD (Gold)</option>
                           <option>BTCUSD (Crypto)</option>
                           <option>FTSE 100 (Index)</option>
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Timeframe</label>
                        <div className="grid grid-cols-4 gap-2">
                           {['15M', '1H', '4H', '1D'].map(tf => (
                              <button key={tf} className="py-2 border border-border-slate text-[10px] font-bold hover:border-accent">{tf}</button>
                           ))}
                        </div>
                     </div>
                  </div>
                  <div className="space-y-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Starting Capital (£)</label>
                        <input type="number" defaultValue={10000} className="w-full bg-background-primary border border-border-slate px-4 py-3 text-xs font-mono outline-none focus:border-accent" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Data Range</label>
                        <div className="grid grid-cols-2 gap-4">
                           <input type="date" defaultValue="2024-01-01" className="bg-background-primary border border-border-slate px-4 py-3 text-xs font-mono outline-none" />
                           <input type="date" defaultValue="2026-04-13" className="bg-background-primary border border-border-slate px-4 py-3 text-xs font-mono outline-none" />
                        </div>
                     </div>
                  </div>
               </div>
               
               <div className="flex items-center gap-6">
                  <button 
                    onClick={runSimulation}
                    disabled={isSimulating}
                    className="flex items-center gap-3 px-10 py-5 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors"
                  >
                    {isSimulating ? <><Loader2 className="w-4 h-4 animate-spin" /> Simulating...</> : <><History className="w-4 h-4" /> Run Backtest</>}
                  </button>
                  <button onClick={() => setStep('define')} className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary hover:text-text-primary">← Edit Logic</button>
               </div>
            </div>
          )}

          {step === 'results' && (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
              {/* Stats Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: "Net Profit", value: "+£3,420.00", color: "text-profit" },
                  { label: "Win Rate", value: "48.5%", color: "text-text-primary" },
                  { label: "Profit Factor", value: "2.12", color: "text-accent" },
                  { label: "Max Drawdown", value: "-8.4%", color: "text-loss" },
                ].map((stat, i) => (
                  <div key={i} className="p-8 bg-background-surface border border-border-slate text-center">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-2">{stat.label}</p>
                    <p className={cn("text-3xl font-display font-black", stat.color)}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Chart Placeholder */}
              <div className="p-12 bg-background-surface border border-border-slate h-[400px] flex flex-col items-center justify-center space-y-4">
                 <BarChart3 className="w-12 h-12 text-text-tertiary/20" />
                 <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Equity Curve: TradingView Lightweight Charts Integration Ready</p>
              </div>

              {/* AI Strategy Coach */}
              <div className="p-10 bg-background-elevated border border-border-slate relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-5">
                    <BrainCircuit className="w-32 h-32 text-accent" />
                 </div>
                 <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3 text-accent">
                       <BrainCircuit className="w-5 h-5" />
                       <span className="text-xs font-mono uppercase font-bold tracking-widest">AI Strategy Assessment</span>
                    </div>
                    <p className="text-xl text-text-primary leading-relaxed font-sans italic max-w-4xl">
                      "This strategy shows a strong profit factor of 2.12, but your max drawdown occurred during high-volatility sessions. Suggestion: Add an ATR-based filter to avoid entries when volatility exceeds 2x the 14-day average. This would have increased your win rate by 4.2%."
                    </p>
                    <div className="flex gap-6">
                       <button onClick={() => setStep('define')} className="px-8 py-4 border border-accent text-accent text-[10px] font-bold uppercase tracking-widest hover:bg-accent hover:text-background-primary transition-all">Iterate Strategy</button>
                       <button className="px-8 py-4 border border-border-slate text-text-tertiary text-[10px] font-bold uppercase tracking-widest hover:text-text-primary transition-all">Export PDF Report</button>
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
