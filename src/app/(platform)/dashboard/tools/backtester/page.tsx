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

// ─── Design token — exact match to Trade Journal (JournalClient.tsx) ──────────
const C = "var(--tool-accent)";

export default function BacktesterPage() {
  const themeStyles = {
    "--tool-accent": "#f43f5e",
    "--tool-accent-hover": "#e11d48",
    "--tool-accent-tint": "#fff1f2",
    "--tool-accent-border": "#fecdd3",
    "--tool-accent-text": "#be123c",
  } as React.CSSProperties;

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
 
    // Simulating strategy mapping
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
    <div style={themeStyles}>
      <div className="space-y-10 animate-in fade-in duration-700 pb-24">
      {/* ── Header — Journal eyebrow + H1 + subtitle pattern ─────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-200 pb-8">
        <div>
          {/* Eyebrow — exact match to "AI_JOURNAL // PERFORMANCE" */}
          <p
            className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] block mb-2"
            style={{ color: C }}
          >
            BACKTESTER // STRATEGIC VALIDATION
          </p>
          {/* H1 — near-black bold + teal period, matching "TRADE JOURNAL." */}
          <h1 className="text-3xl md:text-4xl font-display font-black uppercase text-gray-900 leading-none">
            Backtester<span style={{ color: C }}>.</span>
          </h1>
          {/* Subtitle — #6b7280 text-sm, matches Journal subtitle */}
          <p className="text-gray-500 text-sm mt-2 max-w-2xl leading-relaxed">
            Validate your edge against historical data before risking a single pound. Natural language logic meets institutional math.
          </p>
        </div>
        
        {/* ── Step Indicator — teal active dot + text, grey inactive ──────── */}
        <div className="flex items-center gap-3 shrink-0">
          {[
            { id: 'define',  label: '1. Logic' },
            { id: 'params',  label: '2. Input' },
            { id: 'results', label: '3. Stats'  },
          ].map((s, i) => {
            const isActive = step === s.id;
            return (
              <div key={s.id} className="flex items-center gap-2">
                {/* Separator dot between steps */}
                {i > 0 && (
                  <div className="w-1 h-1 rounded-full bg-gray-300 mr-1" />
                )}
                <div
                  className={cn("w-1.5 h-1.5 rounded-full transition-colors", isActive && "animate-pulse")}
                  style={{ backgroundColor: isActive ? C : "#d1d5db" }}
                />
                <span
                  className="text-[10px] font-mono uppercase tracking-widest font-bold transition-colors"
                  style={{ color: isActive ? C : "#9ca3af" }}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
 
      <div className="max-w-6xl">
        {/* ── STEP 1: DEFINE ────────────────────────────────────────────────── */}
        {step === 'define' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Main strategy composer card — white, Journal card style */}
            <div className="bg-white border border-gray-200 p-8 md:p-12 space-y-8 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
              {/* Section header — teal icon + teal label */}
              <div className="flex items-center gap-3 mb-2" style={{ color: C }}>
                <Terminal className="w-5 h-5" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em]">
                  Strategy Definition (Voice to Code)
                </span>
              </div>
              {/* Textarea — white, Journal input style */}
              <textarea 
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
                placeholder="E.g. Buy when the 20-day EMA crosses above the 50-day EMA and RSI is below 40. Close when RSI hits 70..."
                className="w-full h-48 bg-white border border-gray-200 p-6 text-sm font-sans text-gray-900 outline-none resize-none placeholder:text-gray-300 leading-relaxed rounded-lg transition-colors"
                onFocus={e => { e.currentTarget.style.borderColor = C; e.currentTarget.style.boxShadow = `0 0 0 2px ${C}20`; }}
                onBlur={e =>  { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "none"; }}
              />
              <div className="flex items-center gap-6">
                {/* Confirm Logic — Journal primary button (teal bg, black text) */}
                <button 
                  onClick={() => setStep('params')}
                  disabled={!strategy}
                  className="px-8 py-4 text-[10px] font-mono font-bold uppercase tracking-widest transition-all disabled:opacity-50 rounded-lg hover:opacity-90 disabled:cursor-not-allowed"
                  style={{ backgroundColor: C, color: "#000" }}
                >
                  Confirm Logic
                </button>
                {/* Helper text — muted grey, no accent colour */}
                <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest max-w-xs leading-tight">
                  Our AI models will translate this into mechanical execution rules.
                </p>
              </div>
            </div>
 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Institutional Example card — teal-tinted, left border accent */}
              <div
                className="p-8 space-y-4 rounded-xl border-l-[3px]"
                style={{
                  backgroundColor: "var(--tool-accent-tint)",
                  borderColor: "var(--tool-accent-border)",
                  border: "1px solid var(--tool-accent-border)",
                  borderLeftWidth: 3,
                  borderLeftColor: "var(--tool-accent)",
                }}
              >
                <h4
                  className="text-[10px] font-mono font-bold uppercase tracking-[0.3em]"
                  style={{ color: C }}
                >
                  Institutional Example
                </h4>
                <p className="text-xs text-gray-700 leading-relaxed italic">
                  &quot;Buy when price breaks out of the 20-day high with RSI {'='} 60. Exit when price closes below the 10-day EMA.&quot;
                </p>
              </div>
              {/* Disclaimer card — muted grey, no orange */}
              <div className="p-8 bg-white border border-gray-200 space-y-4 flex items-center gap-4 text-left rounded-xl">
                <AlertCircle className="w-6 h-6 text-gray-300 shrink-0" />
                <p className="text-[9px] text-gray-400 leading-relaxed uppercase tracking-widest font-mono">
                  Simulated performance is not a guarantee of future results. Past performance does not account for slippage.
                </p>
              </div>
            </div>
          </div>
        )}
 
        {/* ── STEP 2: INPUT / PARAMS ───────────────────────────────────────── */}
        {step === 'params' && (
          <div className="bg-white border border-gray-200 p-8 md:p-12 animate-in fade-in slide-in-from-right-4 duration-700 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block">Select Instrument</label>
                  <select
                    className="w-full bg-white border border-gray-200 px-4 py-3 text-xs font-mono uppercase outline-none text-gray-900 rounded-lg transition-colors"
                    onFocus={e => { e.currentTarget.style.borderColor = C; }}
                    onBlur={e  => { e.currentTarget.style.borderColor = "#e5e7eb"; }}
                  >
                    <option>GBPUSD (Forex)</option>
                    <option>XAUUSD (Gold)</option>
                    <option>BTCUSD (Crypto)</option>
                    <option>FTSE 100 (Index)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block">Timeframe</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['15M', '1H', '4H', '1D'].map(tf => (
                      <button
                        key={tf}
                        className="py-2 border border-gray-200 text-[10px] font-bold text-gray-500 transition-colors rounded-lg hover:text-black"
                        style={{}}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C; (e.currentTarget as HTMLButtonElement).style.color = C; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#e5e7eb"; (e.currentTarget as HTMLButtonElement).style.color = "#6b7280"; }}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block">Starting Capital (£)</label>
                  <input
                    type="number"
                    defaultValue={10000}
                    className="w-full bg-white border border-gray-200 px-4 py-3 text-xs font-mono outline-none text-gray-900 rounded-lg transition-colors"
                    onFocus={e => { e.currentTarget.style.borderColor = C; e.currentTarget.style.boxShadow = `0 0 0 2px ${C}20`; }}
                    onBlur={e =>  { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "none"; }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block">Data Range</label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="date"
                      defaultValue="2024-01-01"
                      className="bg-white border border-gray-200 px-4 py-3 text-xs font-mono outline-none text-gray-900 rounded-lg transition-colors"
                      onFocus={e => { e.currentTarget.style.borderColor = C; }}
                      onBlur={e =>  { e.currentTarget.style.borderColor = "#e5e7eb"; }}
                    />
                    <input
                      type="date"
                      defaultValue="2026-04-13"
                      className="bg-white border border-gray-200 px-4 py-3 text-xs font-mono outline-none text-gray-900 rounded-lg transition-colors"
                      onFocus={e => { e.currentTarget.style.borderColor = C; }}
                      onBlur={e =>  { e.currentTarget.style.borderColor = "#e5e7eb"; }}
                    />
                  </div>
                </div>
              </div>
            </div>
             
            <div className="flex items-center gap-6">
              {/* Start Simulation — Journal primary button */}
              <button 
                onClick={runSimulation}
                disabled={isSimulating}
                className="flex items-center gap-3 px-8 py-4 text-[10px] font-mono font-bold uppercase tracking-widest transition-all disabled:opacity-50 rounded-lg hover:opacity-90 disabled:cursor-not-allowed"
                style={{ backgroundColor: C, color: "#000" }}
              >
                {isSimulating
                  ? <><Loader2 className="w-4 h-4 animate-spin" />Running Simulation...</>
                  : <><History className="w-4 h-4" />Start Simulation</>}
              </button>
              {/* Edit Strategy — Journal secondary link style */}
              <button
                onClick={() => setStep('define')}
                className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
              >
                ← Edit Strategy
              </button>
            </div>
          </div>
        )}
 
        {/* ── STEP 3: RESULTS / STATS ──────────────────────────────────────── */}
        {step === 'results' && results && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
            {/* Stats overview cards — white, Journal card style */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  label: "Net Profit",
                  value: `£${results.totalNetProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                  color: results.totalNetProfit >= 0 ? "#16a34a" : "#dc2626",
                },
                { label: "Win Rate",      value: `${results.winRate.toFixed(1)}%`,    color: "#111827" },
                { label: "Profit Factor", value: results.profitFactor.toFixed(2),      color: C         },
                { label: "Max Drawdown",  value: `-${results.maxDrawdown.toFixed(1)}%`, color: "#dc2626" },
              ].map((stat, i) => (
                <div key={i} className="p-8 bg-white border border-gray-200 text-center rounded-xl hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-2">{stat.label}</p>
                  <p className="text-3xl font-display font-black" style={{ color: stat.color }}>{stat.value}</p>
                </div>
              ))}
            </div>
 
            {/* Equity Chart — white card */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all">
              <div className="p-8 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-mono uppercase font-bold tracking-widest text-gray-600">Equity Growth History</h3>
                  <div className="flex items-center gap-2">
                    <Activity className="w-3 h-3 text-green-500 animate-pulse" />
                    <span className="text-[9px] font-mono text-green-500 uppercase tracking-widest">Growth Validated</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <BacktestEquityChart data={results.equityCurve} />
              </div>
            </div>
 
            {/* AI Strategy Coach — teal-tinted card */}
            <div
              className="p-10 relative overflow-hidden rounded-xl border"
              style={{ backgroundColor: "var(--tool-accent-tint)", borderColor: "var(--tool-accent-border)" }}
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <BrainCircuit className="w-32 h-32" style={{ color: C }} />
              </div>
              <div className="relative z-10 space-y-6 text-left">
                <div className="flex items-center gap-3" style={{ color: C }}>
                  <BrainCircuit className="w-5 h-5" />
                  <span className="text-xs font-mono uppercase font-bold tracking-widest">Pete's Strategic Assessment</span>
                </div>
                <p className="text-lg text-gray-800 leading-relaxed font-sans italic max-w-4xl">
                  {results.totalNetProfit > 0 ? (
                    `"The data doesn't lie. This strategy has a solid edge with a profit factor of ${results.profitFactor.toFixed(2)}. However, look at that drawdown — ${results.maxDrawdown.toFixed(1)}% is enough to shake most traders. Suggestion: Tighten your trail once you're at 2R profit to protect those gains."`
                  ) : (
                    `"Look, it's a wash. Backtesting is about failing fast so you don't fail in the market. This setup is getting chopped up in ranging periods. My advice? Add a volatility filter or sit on your hands until a clear structural shift (MSS) occurs."`
                  )}
                </p>
                <div className="flex flex-col md:flex-row gap-4 pt-4">
                  {/* Refine Strategy — Journal outline secondary style with teal */}
                  <button
                    onClick={() => setStep('define')}
                    className="px-6 py-3 text-[10px] font-mono font-bold uppercase tracking-widest transition-all rounded-lg border"
                    style={{ borderColor: C, color: C }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = `${C}0d`; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
                  >
                    Refine Strategy
                  </button>
                  {/* Download — Journal secondary outline grey */}
                  <button className="px-6 py-3 border border-gray-200 text-gray-400 text-[10px] font-mono font-bold uppercase tracking-widest hover:text-gray-900 hover:border-gray-400 transition-all rounded-lg">
                    Download Detailed Report (PDF)
                  </button>
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
