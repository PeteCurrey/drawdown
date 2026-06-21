"use client";

import { useEffect, useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Search,
  Zap,
  ChevronRight,
  Info,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type SubscriptionTier = 'free' | 'foundation' | 'edge' | 'floor';

interface ConsensusItem {
  symbol: string;
  score: number;
  verdict: string;
  rsi: string;
  trend: string;
}

interface MarketConsensusProps {
  /** The current user's subscription tier. Defaults to 'free' (locked state). */
  userTier?: SubscriptionTier;
}

export function MarketConsensus({ userTier = 'free' }: MarketConsensusProps) {
  const [data, setData] = useState<ConsensusItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Edge and Floor tiers have full AI signal access.
  // Free and Foundation see the upgrade CTA.
  const hasSignalAccess = userTier === 'edge' || userTier === 'floor';

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
          <h2 className="text-2xl font-sans font-black uppercase tracking-tight text-text-primary">Market Intelligence</h2>
          <p className="text-text-tertiary font-mono text-[10px] uppercase tracking-widest mt-1">
            Real-time technical consensus across 20+ pairs
          </p>
        </div>
        
        <div className="flex items-center gap-4 p-3 bg-background-surface/40 backdrop-blur-md border border-border-slate/50 focus-within:border-accent transition-colors w-full md:w-80">
          <Search className="w-4 h-4 text-text-tertiary" />
          <input 
            type="text" 
            placeholder="FILTER SYMBOLS..."
            className="bg-transparent border-none outline-none font-mono text-[9px] uppercase tracking-widest text-text-primary w-full placeholder-text-tertiary/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          [...Array(12)].map((_, i) => (
            <div key={i} className="h-40 bg-background-surface/40 backdrop-blur-md border border-border-slate/50 animate-pulse" />
          ))
        ) : filtered.map((item) => (
          <div key={item.symbol} className="group bg-background-surface/40 backdrop-blur-md border border-border-slate/50 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5 transition-all duration-300 p-5 space-y-4">
            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0">
                <h3 className="text-lg font-sans font-black uppercase tracking-tight truncate text-text-primary">{item.symbol}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <Activity className="w-3 h-3 text-text-tertiary" />
                  <span className="text-[8px] font-mono text-text-tertiary uppercase truncate">Technical Consensus</span>
                </div>
              </div>
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                item.score > 60 ? "bg-profit/10" : item.score < 40 ? "bg-loss/10" : "bg-white/5"
              )}>
                {item.trend === "Bullish" ? (
                  <TrendingUp className={cn("w-4 h-4", item.score > 60 ? "text-profit" : "text-text-tertiary")} />
                ) : (
                  <TrendingDown className={cn("w-4 h-4", item.score < 40 ? "text-loss" : "text-text-tertiary")} />
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-end gap-2">
                <span className={cn(
                  "text-base font-sans font-bold uppercase truncate",
                  item.verdict.includes("Buy") ? "text-profit" : item.verdict.includes("Sell") ? "text-loss" : "text-text-secondary"
                )}>
                  {item.verdict}
                </span>
                <span className="text-[9px] font-mono text-text-tertiary uppercase shrink-0">{item.score}%</span>
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

            <div className="pt-3 border-t border-border-slate/50 flex justify-between items-center">
              <div className="flex gap-3">
                <div className="flex flex-col">
                  <span className="text-[6px] font-mono text-text-tertiary uppercase">RSI</span>
                  <span className="text-[9px] font-mono font-bold text-text-primary">{item.rsi}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[6px] font-mono text-text-tertiary uppercase">Trend</span>
                  <span className="text-[9px] font-mono font-bold text-text-primary">{item.trend}</span>
                </div>
              </div>
              <Link 
                href={`/tools/scanner?symbol=${item.symbol}`}
                className="p-1.5 hover:bg-background-elevated text-text-tertiary hover:text-accent transition-colors"
                title="View Full Analysis"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* AI Signal Synthesis footer — unlocked for edge/floor, upgrade CTA for free/foundation */}
      <div className={cn(
        "p-8 border flex flex-col md:flex-row gap-6 items-center justify-between transition-all duration-300 hover:-translate-y-0.5",
        hasSignalAccess
          ? "bg-background-elevated/40 backdrop-blur-md border-accent/30 hover:shadow-[0_0_20px_rgba(0,167,225,0.12)] hover:border-accent/50"
          : "bg-background-elevated/40 backdrop-blur-md border-border-slate/50 hover:shadow-[0_0_20px_rgba(0,167,225,0.1)] hover:border-accent/30"
      )}>
        <div className="flex gap-4 items-start max-w-2xl">
          <div className={cn(
            "w-10 h-10 rounded-full border flex items-center justify-center shrink-0",
            hasSignalAccess ? "bg-profit/10 border-profit/20" : "bg-accent/10 border-accent/20"
          )}>
            {hasSignalAccess
              ? <CheckCircle2 className="w-5 h-5 text-profit" />
              : <Zap className="w-5 h-5 text-accent animate-pulse" />
            }
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-text-primary">AI Signal Synthesis</p>
            <p className="text-xs text-text-secondary leading-relaxed">
              These ratings are derived from a combination of EMA, RSI, and MACD indicators.{" "}
              {hasSignalAccess
                ? "Always use your own judgment and risk management."
                : "Upgrade to Edge or Floor to unlock live signal data."
              }
            </p>
          </div>
        </div>

        {/* Only show the upgrade CTA for free/foundation accounts */}
        {!hasSignalAccess && (
          <Link
            href="/pricing"
            className="px-10 py-4 bg-accent hover:bg-accent-hover text-background-primary text-[10px] font-bold uppercase tracking-widest transition-all shrink-0"
          >
            Upgrade for Edge Signals
          </Link>
        )}

        {/* Unlocked state: show a subtle active indicator instead of a CTA */}
        {hasSignalAccess && (
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-2 h-2 rounded-full bg-profit animate-pulse" />
            <span className="text-[9px] font-mono uppercase tracking-widest text-profit">Live Signals Active</span>
          </div>
        )}
      </div>
    </div>
  );
}
