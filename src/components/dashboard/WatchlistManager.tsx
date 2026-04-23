"use client";

import { useState } from "react";
import { 
  List, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  MoreVertical, 
  Plus,
  Star,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WatchlistItem {
  symbol: string;
  price: number;
  change: number;
  sentiment: "bullish" | "bearish" | "neutral";
}

const initialWatchlist: WatchlistItem[] = [
  { symbol: "GBPUSD", price: 1.2642, change: 0.12, sentiment: "bullish" },
  { symbol: "EURUSD", price: 1.0854, change: -0.05, sentiment: "neutral" },
  { symbol: "XAUUSD", price: 2342.10, change: 1.42, sentiment: "bullish" },
  { symbol: "BTCUSD", price: 64231.50, change: -2.10, sentiment: "bearish" },
  { symbol: "FTSE100", price: 8123.40, change: 0.45, sentiment: "bullish" },
];

export function WatchlistManager() {
  const [watchlist, setWatchlist] = useState(initialWatchlist);

  return (
    <div className="bg-background-surface border border-border-slate flex flex-col h-full group">
      <div className="p-6 border-b border-border-slate flex items-center justify-between bg-background-elevated/30">
        <div className="flex items-center gap-3 text-accent">
          <List className="w-4 h-4" />
          <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest">Global_Watchlist_01</h3>
        </div>
        <button className="p-1 hover:bg-background-primary transition-colors">
          <Plus className="w-4 h-4 text-text-tertiary" />
        </button>
      </div>

      <div className="p-4 border-b border-border-slate bg-background-primary/50">
        <div className="relative">
          <Search className="w-3 h-3 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input 
            type="text" 
            placeholder="ADD SYMBOL..." 
            className="w-full bg-background-surface border border-border-slate pl-9 pr-4 py-2 text-[10px] font-mono outline-none focus:border-accent"
          />
        </div>
      </div>

      <div className="flex-grow overflow-auto custom-scrollbar">
        <div className="divide-y divide-border-slate/30">
          {watchlist.map((item) => (
            <div key={item.symbol} className="p-5 flex items-center justify-between hover:bg-background-elevated/20 transition-all cursor-pointer group/item">
              <div className="flex items-center gap-4">
                <Star className="w-3 h-3 text-text-tertiary group-hover/item:text-accent transition-colors" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-text-primary">{item.symbol}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Activity className={cn(
                      "w-2 h-2",
                      item.sentiment === "bullish" ? "text-profit" : item.sentiment === "bearish" ? "text-loss" : "text-text-tertiary"
                    )} />
                    <span className="text-[8px] font-mono text-text-tertiary uppercase">{item.sentiment}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-xs font-mono font-bold text-text-primary">{item.price.toLocaleString()}</p>
                <div className={cn(
                  "flex items-center justify-end gap-1 text-[9px] font-mono mt-0.5",
                  item.change >= 0 ? "text-profit" : "text-loss"
                )}>
                  {item.change >= 0 ? <TrendingUp className="w-2 h-2" /> : <TrendingDown className="w-2 h-2" />}
                  {item.change >= 0 ? "+" : ""}{item.change}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-border-slate bg-background-elevated/10">
        <button className="w-full py-3 text-[9px] font-bold uppercase tracking-widest text-text-tertiary hover:text-accent transition-colors border border-dashed border-border-slate hover:border-accent/50">
          Create New List
        </button>
      </div>
    </div>
  );
}
