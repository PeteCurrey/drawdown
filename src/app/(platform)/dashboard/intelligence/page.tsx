import { 
  getInsiderTransactions, 
  getCongressionalTrading,
  getSocialSentiment,
  getNewsSentiment
} from "@/lib/market";
import { getLatestSignals } from "@/lib/intelligence-ai";
import { 
  TrendingUp, 
  Landmark, 
  UserCheck, 
  ArrowUpRight,
  Info,
  Zap,
  Twitter,
  Newspaper,
  Gauge
} from "lucide-react";
import { cn } from "@/lib/utils";

export default async function IntelligenceHub() {
  const [insiderTrades, politicalTrades, aiSignals, socialNVDA, newsNVDA] = await Promise.all([
    getInsiderTransactions("NVDA"),
    getCongressionalTrading(),
    getLatestSignals(3),
    getSocialSentiment("NVDA"),
    getNewsSentiment("NVDA")
  ]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header>
        <h1 className="text-3xl font-display font-bold uppercase mb-2">Intelligence Hub</h1>
        <p className="text-sm text-text-tertiary">Real-time tracking of insider conviction and political capital flow.</p>
      </header>

      {/* AI Signals Strip */}
      {aiSignals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aiSignals.map((signal: any) => (
            <div key={signal.id} className="p-5 bg-accent/5 border border-accent/20 rounded-sm relative overflow-hidden group">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-3 h-3 text-accent animate-pulse" />
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-accent">AI Signal Detected</span>
              </div>
              <h3 className="text-sm font-display font-bold uppercase mb-2 group-hover:text-accent transition-colors">{signal.title}</h3>
              <p className="text-[11px] text-text-secondary leading-relaxed line-clamp-2">{signal.content}</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex gap-2">
                  {signal.related_symbols?.map((sym: string) => (
                    <span key={sym} className="px-2 py-0.5 bg-background-elevated text-[9px] font-mono text-text-tertiary">{sym}</span>
                  ))}
                </div>
                <span className={cn(
                  "text-[9px] font-bold uppercase",
                  signal.severity === 'high' ? "text-loss" : "text-profit"
                )}>
                  {signal.severity} Priority
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Insider Trading Tracker */}
        <section className="bg-background-surface border border-border-slate flex flex-col h-full">
          <div className="p-6 border-b border-border-slate flex justify-between items-center bg-background-elevated/30">
            <div className="flex items-center gap-3">
              <UserCheck className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-display font-bold uppercase">Insider Tracker</h2>
            </div>
            <span className="text-[10px] font-mono text-profit uppercase tracking-widest">NVDA LIVE</span>
          </div>
          
          <div className="flex-grow overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-background-primary/50 text-[9px] font-mono uppercase tracking-widest text-text-tertiary border-b border-border-slate">
                <tr>
                  <th className="px-6 py-4">Executive</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-slate/30">
                {insiderTrades.slice(0, 8).map((trade: any, i: number) => (
                  <tr key={i} className="hover:bg-background-elevated/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold truncate max-w-[150px]">{trade.name || 'OFFICER'}</span>
                        <span className="text-[9px] text-text-tertiary font-mono">CODE: {trade.transactionCode}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-[10px] font-bold uppercase",
                        trade.change > 0 ? "text-profit" : "text-loss"
                      )}>
                        {trade.change > 0 ? 'Buy' : 'Sell'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">${trade.transactionPrice?.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right text-[10px] font-mono text-text-tertiary">
                      {new Date(trade.transactionDate).toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-border-slate bg-background-elevated/10">
             <div className="flex items-start gap-3 p-3 bg-accent/5 border border-accent/10 rounded-sm">
                <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <p className="text-[10px] text-text-secondary leading-relaxed">
                  Insider buying is often a precursor to major announcements. We monitor "Cluster Buys" where multiple officers purchase within a 30-day window.
                </p>
             </div>
          </div>
        </section>

        {/* Political Alpha Tracker */}
        <section className="bg-background-surface border border-border-slate flex flex-col h-full">
          <div className="p-6 border-b border-border-slate flex justify-between items-center bg-background-elevated/30">
            <div className="flex items-center gap-3">
              <Landmark className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-display font-bold uppercase">Political Alpha</h2>
            </div>
            <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">U.S. CAPITOL</span>
          </div>

          <div className="flex-grow overflow-x-auto">
             <table className="w-full text-left">
              <thead className="bg-background-primary/50 text-[9px] font-mono uppercase tracking-widest text-text-tertiary border-b border-border-slate">
                <tr>
                  <th className="px-6 py-4">Representative</th>
                  <th className="px-6 py-4">Asset</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-slate/30">
                {politicalTrades.slice(0, 8).map((trade: any, i: number) => (
                  <tr key={i} className="hover:bg-background-elevated/20 transition-colors">
                    <td className="px-6 py-4">
                       <div className="flex flex-col">
                        <span className="text-sm font-bold truncate max-w-[150px]">{trade.name || 'U.S. REP'}</span>
                        <span className="text-[9px] text-text-tertiary font-mono">FILED: {new Date(trade.filingDate).toLocaleDateString('en-GB')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-accent font-bold">{trade.symbol}</td>
                    <td className="px-6 py-4">
                       <span className={cn(
                        "text-[10px] font-bold uppercase",
                        trade.transactionType === 'Purchase' ? "text-profit" : "text-loss"
                      )}>
                        {trade.transactionType === 'Purchase' ? 'BUY' : 'SELL'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-[10px] font-mono text-text-secondary whitespace-nowrap">
                      {trade.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-6 border-t border-border-slate">
             <button className="w-full flex items-center justify-center gap-2 py-3 bg-background-elevated border border-border-slate hover:border-accent hover:text-accent transition-colors text-[10px] font-bold uppercase tracking-widest">
                Search Legislator History <ArrowUpRight className="w-4 h-4" />
             </button>
          </div>
        </section>
      </div>

      {/* Sentiment Pulse Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-border-slate/50 pb-2">
          <Gauge className="w-5 h-5 text-accent" />
          <h2 className="text-xl font-display font-bold uppercase">Sentiment Pulse</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Social Sentiment */}
          <div className="p-8 bg-background-surface border border-border-slate flex flex-col gap-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Twitter className="w-5 h-5 text-[#1DA1F2]" />
                <h3 className="text-sm font-bold uppercase tracking-widest">Social Buzz (Reddit/X)</h3>
              </div>
              <span className="text-[10px] font-mono text-text-tertiary">NVDA — LAST 24H</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest">
                <span className="text-loss">Extreme Fear</span>
                <span className="text-profit">Extreme Greed</span>
              </div>
              <div className="h-2 bg-background-primary rounded-full overflow-hidden border border-border-slate">
                <div 
                  className="h-full bg-gradient-to-r from-loss via-accent to-profit transition-all duration-1000"
                  style={{ width: `${(socialNVDA?.score || 0.5) * 100}%` }}
                />
              </div>
              <div className="flex justify-between items-center">
                 <div className="flex flex-col">
                   <span className="text-2xl font-display font-black">{socialNVDA?.mentions || 0}</span>
                   <span className="text-[8px] font-mono text-text-tertiary uppercase">TOTAL MENTIONS</span>
                 </div>
                 <div className="text-right">
                   <span className="text-sm font-mono font-bold text-accent">{(socialNVDA?.score || 0.5 * 100).toFixed(0)}% BULLISH</span>
                 </div>
              </div>
            </div>
          </div>

          {/* News Sentiment */}
          <div className="p-8 bg-background-surface border border-border-slate flex flex-col gap-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Newspaper className="w-5 h-5 text-profit" />
                <h3 className="text-sm font-bold uppercase tracking-widest">Institutional News Bias</h3>
              </div>
              <span className="text-[10px] font-mono text-text-tertiary">NVDA — SECTOR AVG: {((newsNVDA?.sectorAvgSentiment || 0.5) * 100).toFixed(0)}%</span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
                <span>0% Bullish</span>
                <span>100% Bullish</span>
              </div>
              <div className="h-2 bg-background-primary rounded-full overflow-hidden border border-border-slate">
                <div 
                  className="h-full bg-profit transition-all duration-1000"
                  style={{ width: `${(newsNVDA?.sentiment || 0.5) * 100}%` }}
                />
              </div>
              <div className="flex justify-between items-center">
                 <div className="flex flex-col">
                   <span className="text-2xl font-display font-black">{((newsNVDA?.buzz || 0) * 100).toFixed(0)}%</span>
                   <span className="text-[8px] font-mono text-text-tertiary uppercase">BUZZ INDEX (REL TO AVG)</span>
                 </div>
                 <div className="text-right">
                   <span className="text-sm font-mono font-bold text-profit">{((newsNVDA?.sentiment || 0.5) * 100).toFixed(0)}% POSITIVE COVERAGE</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intelligence Insights (AI Integration Placeholder) */}
      <section className="p-8 bg-background-elevated border border-border-slate border-dashed flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="space-y-2">
            <h3 className="text-xl font-display font-bold uppercase">AI Correlation Engine</h3>
            <p className="text-xs text-text-tertiary max-w-lg leading-relaxed">
              Our AI models are cross-referencing this flow with active committee hearings and legislative drafts. Enable alerts to be notified of high-probability policy-driven moves.
            </p>
         </div>
         <button className="px-8 py-4 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-accent-hover transition-all shrink-0">
            Enable AI Signals
         </button>
      </section>
    </div>
  );
}
