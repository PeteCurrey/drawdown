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
  Loader2,
  Activity
} from "lucide-react";

type BacktestStep = 'define' | 'params' | 'results';

import { simulateStrategy, BacktestResult, StrategyConfig } from "@/lib/backtester";
import { BacktestEquityChart } from "@/components/charts/BacktestEquityChart";



export default function BacktesterPage() {
  const [step, setStep] = useState<BacktestStep>('define');
  const [isSimulating, setIsSimulating] = useState(false);
  const [strategy, setStrategy] = useState("");
  const [results, setResults] = useState<BacktestResult | null>(null);

  const runSimulation = () => {
    setIsSimulating(true);
    
    // Generate Mock History for Simulation
    const mockHistory = Array.from({ length: 150 }).map((_, i) => ({
      time: (Date.now() / 1000) - (150 - i) * 3600,
      open: 1.2500 + Math.random() * 0.1,
      high: 1.2600 + Math.random() * 0.1,
      low: 1.2400 + Math.random() * 0.1,
      close: 1.2550 + Math.random() * 0.1,
    }));

    // Simulating strategy mapping - in real app, AI would pick the type
    const config: StrategyConfig = {
      type: strategy.toLowerCase().includes('ema') ? 'EMA_CROSS' : 'RSI_REVERSAL',
      params: {}
    };

    setTimeout(() => {
      const result = simulateStrategy(mockHistory, config, 10000);
      setResults(result);
      setIsSimulating(false);
      setStep('results');
    }, 2000);
  };

  return (
    <div className="pt-32 pb-24 bg-background-primary min-h-screen">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <span className="text-accent font-mono text-[10px] uppercase tracking-widest block mb-4 uppercase">// STRATEGIC VALIDATION</span>
            <h1 className="text-4xl md:text-6xl font-display font-bold uppercase mb-4 text-white">Backtester.</h1>
            <p className="text-text-secondary max-w-xl leading-relaxed">
              Validate your edge against historical data before risking a single pound. Natural language logic meets institutional math.
            </p>
          </div>
          
          {/* Step Indicator */}
          <div className="flex items-center gap-8">
            {[
              { id: 'define', label: '1. Logic' },
              { id: 'params', label: '2. Input' },
              { id: 'results', label: '3. Stats' },
            ].map((s) => (
              <div key={s.id} className="flex items-center gap-2">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full",
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
                  <span className="text-[10px] font-mono uppercase font-bold tracking-widest uppercase">Strategy Definition (Voice to Code)</span>
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
                  <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest max-w-xs leading-tight">
                    Our AI models will translate this into mechanical execution rules.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-accent/5 border border-accent/20 space-y-4">
                   <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent">Institutional Example</h4>
                   <p className="text-xs text-text-secondary leading-relaxed italic">
                     "Buy when price breaks out of the 20-day high with RSI {'='} 60. Exit when price closes below the 10-day EMA."
                   </p>
                </div>
                <div className="p-8 border border-border-slate space-y-4 flex items-center gap-4 text-left">
                   <AlertCircle className="w-6 h-6 text-text-tertiary shrink-0" />
                   <p className="text-[9px] text-text-tertiary leading-relaxed uppercase tracking-widest font-mono">
                     Simulated performance is not a guarantee of future results. Past performance does not account for slippage.
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
                        <select className="w-full bg-background-primary border border-border-slate px-4 py-3 text-xs font-mono uppercase outline-none focus:border-accent text-white">
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
                              <button key={tf} className="py-2 border border-border-slate text-[10px] font-bold text-text-secondary hover:border-accent hover:text-accent transition-colors">{tf}</button>
                           ))}
                        </div>
                     </div>
                  </div>
                  <div className="space-y-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Starting Capital (£)</label>
                        <input type="number" defaultValue={10000} className="w-full bg-background-primary border border-border-slate px-4 py-3 text-xs font-mono outline-none focus:border-accent text-white" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Data Range</label>
                        <div className="grid grid-cols-2 gap-4">
                           <input type="date" defaultValue="2024-01-01" className="bg-background-primary border border-border-slate px-4 py-3 text-xs font-mono outline-none text-white" />
                           <input type="date" defaultValue="2026-04-13" className="bg-background-primary border border-border-slate px-4 py-3 text-xs font-mono outline-none text-white" />
                        </div>
                     </div>
                  </div>
               </div>
               
               <div className="flex items-center gap-6">
                  <button 
                    onClick={runSimulation}
                    disabled={isSimulating}
                    className="flex items-center gap-3 px-10 py-5 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-all"
                  >
                    {isSimulating ? <><Loader2 className="w-4 h-4 animate-spin" /> Running Simulation...</> : <><History className="w-4 h-4" /> Start Simulation</>}
                  </button>
                  <button onClick={() => setStep('define')} className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary hover:text-text-primary transition-colors">← Edit Strategy</button>
               </div>
            </div>
          )}

          {step === 'results' && results && (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
              {/* Stats Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: "Net Profit", value: `£${results.totalNetProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, color: results.totalNetProfit >= 0 ? "text-profit" : "text-loss" },
                  { label: "Win Rate", value: `${results.winRate.toFixed(1)}%`, color: "text-white" },
                  { label: "Profit Factor", value: results.profitFactor.toFixed(2), color: "text-accent" },
                  { label: "Max Drawdown", value: `-${results.maxDrawdown.toFixed(1)}%`, color: "text-loss" },
                ].map((stat, i) => (
                  <div key={i} className="p-8 bg-background-surface border border-border-slate text-center group hover:border-accent/40 transition-colors">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-2">{stat.label}</p>
                    <p className={cn("text-3xl font-display font-black", stat.color)}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Equity Chart */}
              <div className="p-1 gap-2 bg-background-surface border border-border-slate group hover:border-accent/20 transition-colors">
                 <div className="p-8 border-b border-border-slate/50">
                    <div className="flex justify-between items-center">
                       <h3 className="text-xs font-mono uppercase font-bold tracking-widest text-text-secondary">Equity Growth History</h3>
                       <div className="flex items-center gap-2">
                          <Activity className="w-3 h-3 text-profit animate-pulse" />
                          <span className="text-[9px] font-mono text-profit uppercase tracking-widest">Growth Validated</span>
                       </div>
                    </div>
                 </div>
                 <div className="p-6">
                    <BacktestEquityChart data={results.equityCurve} />
                 </div>
              </div>

              {/* AI Strategy Coach */}
              <div className="p-10 bg-background-elevated border border-border-slate relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-5">
                    <BrainCircuit className="w-32 h-32 text-accent" />
                 </div>
                 <div className="relative z-10 space-y-6 text-left">
                    <div className="flex items-center gap-3 text-accent">
                       <BrainCircuit className="w-5 h-5" />
                       <span className="text-xs font-mono uppercase font-bold tracking-widest">Pete's Strategic Assessment</span>
                    </div>
                    <p className="text-lg text-text-primary leading-relaxed font-sans italic max-w-4xl">
                      {results.totalNetProfit > 0 ? (
                        `"The data doesn't lie. This strategy has a solid edge with a profit factor of ${results.profitFactor.toFixed(2)}. However, look at that drawdown — ${results.maxDrawdown.toFixed(1)}% is enough to shake most traders. Suggestion: Tighten your trail once you're at 2R profit to protect those gains."`
                      ) : (
                        `"Look, it's a wash. Backtesting is about failing fast so you don't fail in the market. This setup is getting chopped up in ranging periods. My advice? Add a volatility filter or sit on your hands until a clear structural shift (MSS) occurs."`
                      )}
                    </p>
                    <div className="flex flex-col md:flex-row gap-6 pt-4">
                       <button onClick={() => setStep('define')} className="px-8 py-4 border border-accent text-accent text-[10px] font-bold uppercase tracking-widest hover:bg-accent hover:text-background-primary transition-all">Refine Strategy</button>
                       <button className="px-8 py-4 border border-border-slate text-text-tertiary text-[10px] font-bold uppercase tracking-widest hover:text-text-primary transition-all">Download Detailed Report (PDF)</button>
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

