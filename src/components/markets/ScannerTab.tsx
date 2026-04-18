"use client";

import { useEffect, useState } from "react";
import { Search, Percent, TrendingUp, TrendingDown, DollarSign, Database, Bitcoin } from "lucide-react";
import { cn } from "@/lib/utils";

const ASSET_CLASSES = [
  { id: "forex", label: "Forex", icon: DollarSign, symbols: ["GBP/USD", "EUR/USD", "USD/JPY", "AUD/USD", "USD/CAD", "EUR/GBP"] },
  { id: "crypto", label: "Crypto", icon: Bitcoin, symbols: ["BTC/USD", "ETH/USD", "SOL/USD", "XRP/USD"] },
  { id: "stocks-uk", label: "UK Stocks", icon: Database, symbols: ["BARC", "LLOY", "BP", "SHEL", "VOD", "HSBA"] },
  { id: "stocks-us", label: "US Stocks", icon: TrendingUp, symbols: ["AAPL", "TSLA", "NVDA", "MSFT", "AMZN"] },
  { id: "indices", label: "Indices", icon: TrendingUp, symbols: ["FTSE", "SPX", "NDX", "DAX", "DJI"] },
];

export function ScannerTab() {
  const [activeAsset, setActiveAsset] = useState("forex");
  const [prices, setPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedClass = ASSET_CLASSES.find(ac => ac.id === activeAsset);
  const symbols = selectedClass?.symbols || [];

  useEffect(() => {
    async function fetchScanner() {
      setLoading(true);
      try {
        const res = await fetch(`/api/market/prices?symbols=${symbols.join(",")}`);
        const data = await res.json();
        setPrices(data);
      } catch (err) {
        console.error("Scanner Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchScanner();
  }, [activeAsset]);

  const filteredPrices = prices.filter(p => 
    p.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Search & Asset Bar */}
      <div className="flex flex-col md:flex-row justify-between gap-6 border-b border-border-slate pb-8">
        <div className="flex flex-wrap gap-2">
          {ASSET_CLASSES.map((ac) => {
            const Icon = ac.icon;
            const isActive = activeAsset === ac.id;
            return (
              <button
                key={ac.id}
                onClick={() => setActiveAsset(ac.id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 text-[10px] font-bold uppercase tracking-widest transition-all",
                  isActive 
                    ? "bg-accent text-background-primary" 
                    : "bg-background-surface text-text-tertiary border border-border-slate hover:border-accent/40"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {ac.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input 
            type="text"
            placeholder="Search symbols..."
            className="w-full bg-background-surface border border-border-slate py-3 pl-12 pr-4 text-[10px] font-mono uppercase tracking-widest outline-none focus:border-accent transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
          Array(8).fill(0).map((_, i) => (
            <div key={i} className="h-40 bg-background-surface/20 border border-border-slate animate-pulse" />
          ))
        ) : filteredPrices.length > 0 ? (
          filteredPrices.map((item, i) => (
            <div key={i} className="group p-6 bg-background-surface border border-border-slate hover:border-accent transition-all duration-500">
              <div className="flex justify-between items-start mb-6">
                <div>
                   <h4 className="text-xl font-mono font-bold group-hover:text-accent transition-colors">{item.symbol}</h4>
                   <span className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">
                     Vol: {(item.volume / 1000).toFixed(1)}K
                   </span>
                </div>
                <div className={cn(
                  "px-2 py-1 text-[10px] font-mono font-bold border",
                  item.change >= 0 ? "text-profit border-profit/20 bg-profit/5" : "text-loss border-loss/20 bg-loss/5"
                )}>
                  {item.change >= 0 ? "+" : ""}{item.changePercent.toFixed(2)}%
                </div>
              </div>

              <div className="flex items-end justify-between">
                <span className="text-2xl font-mono font-bold leading-none tracking-tight">
                  {item.price.toFixed(5).replace(/\.?0+$/, '')}
                </span>
                <div className="flex gap-1 h-8 items-end">
                   {/* Simplified Sparkline Placeholder */}
                   {Array.from({length: 12}).map((_, j) => (
                     <div 
                        key={j} 
                        className={cn(
                          "w-1 rounded-full",
                          item.change >= 0 ? "bg-profit/20" : "bg-loss/20"
                        )}
                        style={{ height: `${Math.random() * 100}%` }}
                     />
                   ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border border-dashed border-border-slate/50">
             <Percent className="w-10 h-10 text-text-tertiary mx-auto mb-4 opacity-20" />
             <p className="text-[10px] font-mono uppercase text-text-tertiary tracking-widest">No active technical results for this search // 0x00</p>
          </div>
        )}
      </div>

      {/* Institutional CTA */}
      <div className="mt-8 p-10 border border-border-slate bg-background-surface/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Database className="w-32 h-32 text-accent" />
        </div>
        <div className="relative z-10 space-y-4">
           <h4 className="text-xl font-display font-bold uppercase">Advanced Technical Overlays</h4>
           <p className="text-sm text-text-secondary max-w-2xl leading-relaxed">
             Unlock real-time institutional technical consensus, order flow analysis, and liquidity heatmap for these symbols. Stay ahead of the retail crowd.
           </p>
           <button className="px-8 py-4 bg-background-primary border border-accent/40 text-accent hover:bg-accent hover:text-background-primary font-bold uppercase tracking-widest text-[10px] transition-all">
             Unlock Full Edge Dashboard
           </button>
        </div>
      </div>
    </div>
  );
}
