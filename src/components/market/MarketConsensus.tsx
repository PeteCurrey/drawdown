"use client";

import { useEffect, useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Search,
  Zap,
  ChevronRight,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ConsensusItem {
  symbol: string;
  score: number;
  verdict: string;
  rsi: string;
  trend: string;
}

export function MarketConsensus() {
  const [data, setData] = useState<ConsensusItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/market/consensus");
        const json = await res.json();
        if (Array.isArray(json)) setData(json);
      } catch (err) {
        console.error("Consensus fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = data.filter(item => 
    item.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-display font-black uppercase tracking-tight">Market Intelligence</h2>
          <p className="text-text-tertiary font-mono text-[10px] uppercase tracking-widest mt-1">
            Real-time technical consensus across 20+ pairs
          </p>
        </div>
        
        <div className="flex items-center gap-4 p-3 bg-background-surface border border-border-slate focus-within:border-accent transition-colors w-full md:w-80">
          <Search className="w-4 h-4 text-text-tertiary" />
          <input 
            type="text" 
            placeholder="FILTER SYMBOLS..."
            className="bg-transparent border-none outline-none font-mono text-[9px] uppercase tracking-widest text-text-primary w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          [...Array(12)].map((_, i) => (
            <div key={i} className="h-40 bg-background-surface border border-border-slate animate-pulse" />
          ))
        ) : filtered.map((item) => (
          <div key={item.symbol} className="group bg-background-surface border border-border-slate hover:border-accent/40 transition-premium p-6 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-display font-black uppercase tracking-tight">{item.symbol}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Activity className="w-3 h-3 text-text-tertiary" />
                  <span className="text-[9px] font-mono text-text-tertiary uppercase">Technical Consensus</span>
                </div>
              </div>
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                item.score > 60 ? "bg-profit/10" : item.score < 40 ? "bg-loss/10" : "bg-white/5"
              )}>
                {item.trend === "Bullish" ? (
                  <TrendingUp className={cn("w-5 h-5", item.score > 60 ? "text-profit" : "text-text-tertiary")} />
                ) : (
                  <TrendingDown className={cn("w-5 h-5", item.score < 40 ? "text-loss" : "text-text-tertiary")} />
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className={cn(
                  "text-lg font-display font-bold uppercase",
                  item.verdict.includes("Buy") ? "text-profit" : item.verdict.includes("Sell") ? "text-loss" : "text-text-secondary"
                )}>
                  {item.verdict}
                </span>
                <span className="text-[10px] font-mono text-text-tertiary uppercase">Score: {item.score}%</span>
              </div>
              
              <div className="h-1 w-full bg-background-elevated relative overflow-hidden">
                <div 
                  className={cn(
                    "h-full transition-all duration-1000",
                    item.score > 60 ? "bg-profit" : item.score < 40 ? "bg-loss" : "bg-text-secondary"
                  )} 
                  style={{ width: `${item.score}%` }} 
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border-slate/50 flex justify-between items-center">
              <div className="flex gap-4">
                <div className="flex flex-col">
                  <span className="text-[7px] font-mono text-text-tertiary uppercase">RSI</span>
                  <span className="text-[10px] font-mono font-bold text-text-primary">{item.rsi}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[7px] font-mono text-text-tertiary uppercase">Trend</span>
                  <span className="text-[10px] font-mono font-bold text-text-primary">{item.trend}</span>
                </div>
              </div>
              <Link 
                href={`/tools/scanner?symbol=${item.symbol}`}
                className="p-2 hover:bg-background-elevated text-text-tertiary hover:text-accent transition-colors"
                title="View Full Analysis"
              >
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 border border-border-slate bg-background-elevated/50 flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex gap-4 items-start max-w-2xl">
          <Zap className="w-5 h-5 text-accent shrink-0 mt-1" />
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-text-primary">AI Signal Synthesis</p>
            <p className="text-xs text-text-secondary leading-relaxed">
              These ratings are derived from a combination of EMA, RSI, and MACD indicators. 
              Always use your own judgment and risk management.
            </p>
          </div>
        </div>
        <button className="px-10 py-4 bg-accent hover:bg-accent-hover text-background-primary text-[10px] font-bold uppercase tracking-widest transition-all">
          Upgrade for Edge Signals
        </button>
      </div>
    </div>
  );
}
