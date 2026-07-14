import { getTechnicalPatterns } from "@/lib/market";
import { 
  Zap, 
  Search, 
  Target, 
  TrendingUp, 
  TrendingDown,
  Activity,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default async function MarketScannerPage() {
  // Fetch sample patterns for key assets
  const symbols = ["AAPL", "TSLA", "NVDA", "GBPUSD", "EURUSD"];
  const allPatterns = await Promise.all(
    symbols.map(async (s) => ({
      symbol: s,
      patterns: await getTechnicalPatterns(s)
    }))
  );

  const flatPatterns = allPatterns.flatMap(p => 
    p.patterns.map((pt: any) => ({ ...pt, symbol: p.symbol }))
  ).sort((a, b) => b.atrp - a.atrp); // Sorting by ATRP (pattern strength)

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-24">
      <header className="border-b border-border-slate pb-8 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-premium mb-4">
            <Zap className="w-4 h-4 fill-premium" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Consensus_Engine // v2.0</span>
          </div>
          <h1 className="text-4xl font-display font-bold uppercase tracking-tight">Market <span className="text-premium">Scanner.</span></h1>
          <p className="text-sm text-text-tertiary mt-2">Automated pattern recognition and institutional technical consensus.</p>
        </div>
        <div className="flex items-center gap-4 px-6 py-3 bg-background-elevated border border-border-slate">
           <Activity className="w-4 h-4 text-profit animate-pulse" />
           <span className="text-[10px] font-mono uppercase tracking-widest text-text-primary">Live Scan Active</span>
        </div>
      </header>

      {/* Pattern Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {flatPatterns.length === 0 ? (
          <div className="col-span-full p-20 bg-background-surface border border-border-slate border-dashed text-center">
             <AlertCircle className="w-8 h-8 text-text-tertiary mx-auto mb-4" />
             <p className="text-xs text-text-tertiary font-mono uppercase">No high-conviction patterns detected in current cycle.</p>
          </div>
        ) : flatPatterns.slice(0, 9).map((pattern: any, i: number) => (
          <div key={i} className="p-8 bg-background-surface border border-border-slate hover:border-premium/50 transition-all group relative overflow-hidden">
             <div className="flex justify-between items-start mb-8">
                <div>
                   <h3 className="text-xl font-display font-bold uppercase tracking-tight group-hover:text-premium transition-colors">{pattern.symbol}</h3>
                   <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Daily Chart</p>
                </div>
                <div className={cn(
                  "px-2 py-1 text-[8px] font-mono font-bold uppercase border",
                  pattern.type === 'bullish' ? "border-profit/20 bg-profit/5 text-profit" : "border-loss/20 bg-loss/5 text-loss"
                )}>
                  {pattern.type}
                </div>
             </div>

             <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                   <span className="text-text-tertiary font-mono">Pattern</span>
                   <span className="font-bold text-text-secondary uppercase">{pattern.patternname}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                   <span className="text-text-tertiary font-mono">Conviction</span>
                   <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <div key={j} className={cn(
                          "w-3 h-1",
                          j < Math.round(pattern.atrp / 2) ? "bg-premium" : "bg-background-elevated"
                        )} />
                      ))}
                   </div>
                </div>
             </div>

             <div className="mt-8 pt-6 border-t border-border-slate/50 flex justify-between items-center">
                <span className="text-[9px] font-mono text-text-tertiary">SIGNAL AGE: 4H</span>
                <button className="flex items-center gap-1 text-[9px] font-bold uppercase text-premium hover:underline">
                   View Analysis <ChevronRight className="w-3 h-3" />
                </button>
             </div>

             {/* Background Decoration */}
             <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none">
                <Target className="w-24 h-24" />
             </div>
          </div>
        ))}
      </div>

      {/* Institutional Insights Footer */}
      <section className="p-10 bg-background-elevated border border-border-slate flex flex-col md:flex-row items-center justify-between gap-10">
         <div className="flex items-start gap-6">
            <ShieldCheck className="w-10 h-10 text-premium shrink-0 mt-1" />
            <div className="space-y-2">
               <h3 className="text-xl font-display font-bold uppercase tracking-tight">Technical Consensus</h3>
               <p className="text-xs text-text-secondary max-w-xl leading-relaxed">
                  Our scanner cross-references 14 indicators and 22 price patterns to find professional-grade setups. High ATRP scores indicate multi-timeframe alignment.
               </p>
            </div>
         </div>
         <button className="px-10 py-4 bg-premium text-background-primary text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all whitespace-nowrap">
            Configure Alerts
         </button>
      </section>
    </div>
  );
}
