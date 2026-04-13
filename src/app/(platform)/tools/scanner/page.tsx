"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Eye, 
  BrainCircuit, 
  Zap, 
  BarChart2,
  ExternalLink,
  ChevronDown
} from "lucide-react";

export default function MarketScannerPage() {
  const [activeTab, setActiveTab] = useState<'movers' | 'watchlist' | 'sectors'>('movers');
  
  return (
    <div className="pt-32 pb-24 bg-background-primary min-h-screen">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <span className="text-accent font-mono text-[10px] uppercase tracking-widest block mb-4">// REAL-TIME SCANNER</span>
            <h1 className="text-4xl md:text-6xl font-display font-bold uppercase mb-4">Market Radar.</h1>
            <p className="text-text-secondary max-w-xl">
              AI-assisted identification of high-probability opportunities across Forex, Crypto, and UK Equities.
            </p>
          </div>
          <div className="flex items-center gap-4">
             <div className="px-4 py-2 bg-profit/10 border border-profit/20 rounded-full flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-profit animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-profit uppercase tracking-widest">Live Feed Active</span>
             </div>
          </div>
        </div>

        {/* Scanner Tabs */}
        <div className="flex gap-8 border-b border-border-slate mb-12">
          {[
            { id: 'movers', label: "Today's Movers", icon: Zap },
            { id: 'watchlist', label: "My Watchlist", icon: Eye },
            { id: 'sectors', label: "Sector Heatmap", icon: BarChart2 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "pb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all relative",
                  activeTab === tab.id ? "text-accent" : "text-text-tertiary hover:text-text-primary"
                )}
              >
                <Icon className="w-3 h-3" />
                {tab.label}
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-accent" />}
              </button>
            );
          })}
        </div>

        {activeTab === 'movers' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Movers Column */}
            <div className="space-y-6">
              {[
                { pair: "GBPUSD", price: "1.2642", change: "+1.2%", type: "forex" },
                { pair: "BTCUSD", price: "68,432.10", change: "-2.4%", type: "crypto" },
                { pair: "VOD.L", price: "72.45", change: "+4.8%", type: "stock" },
                { pair: "LLOY.L", price: "52.12", change: "+0.5%", type: "stock" },
              ].map((item, i) => (
                <div key={i} className="group p-6 bg-background-surface border border-border-slate hover:border-accent transition-premium flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className={cn(
                      "w-12 h-12 flex items-center justify-center border",
                      item.change.startsWith('+') ? "border-profit/20 bg-profit/5 text-profit" : "border-loss/20 bg-loss/5 text-loss"
                    )}>
                      {item.change.startsWith('+') ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold uppercase tracking-tight">{item.pair}</h3>
                      <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">{item.type} • {item.price}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={cn("text-lg font-mono font-bold", item.change.startsWith('+') ? "text-profit" : "text-loss")}>
                      {item.change}
                    </span>
                    <button className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-widest text-accent hover:underline">
                      <BrainCircuit className="w-3 h-3" /> Why is this moving?
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Insights Sidebar */}
            <div className="space-y-8">
              <div className="p-8 bg-background-elevated border border-border-slate relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                   <BrainCircuit className="w-24 h-24 text-accent" />
                </div>
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3 text-accent">
                    <Zap className="w-4 h-4" />
                    <span className="text-xs font-mono uppercase font-bold tracking-widest text-accent">Intraday Opportunity</span>
                  </div>
                  <h3 className="text-2xl font-display font-bold uppercase leading-tight">GBPUSD Volume Spike Detected</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Unusual institutional flows detected near 1.2580 support. Technical setup aligned with Phase 3 Strategy A. Watch for hourly close above 1.2610 for confirmation.
                  </p>
                  <div className="pt-4 flex gap-4">
                    <button className="px-6 py-3 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest">Open Chart</button>
                    <button className="px-6 py-3 border border-border-slate text-text-tertiary text-[10px] font-bold uppercase tracking-widest">Dismiss</button>
                  </div>
                </div>
              </div>

              <div className="p-8 border border-border-slate space-y-4">
                 <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Economic Impact Today</h4>
                 {[
                   { time: "13:00", event: "US CPI (YoY)", impact: "High", color: "text-loss" },
                   { time: "14:30", event: "Fed Chair Speaks", impact: "High", color: "text-loss" },
                   { time: "16:00", event: "Oil Inventories", impact: "Medium", color: "text-accent" },
                 ].map((event, i) => (
                   <div key={i} className="flex justify-between items-center py-2 border-b border-border-slate/50 last:border-0">
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-mono text-text-primary">{event.time}</span>
                        <span className="text-[10px] font-display font-bold uppercase tracking-tight">{event.event}</span>
                      </div>
                      <span className={cn("text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 border", 
                        event.color === 'text-loss' ? 'border-loss/30 text-loss bg-loss/5' : 'border-accent/30 text-accent bg-accent/5'
                      )}>
                        {event.impact}
                      </span>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sectors' && (
          <div className="p-12 border border-border-slate text-center space-y-8">
             <BarChart2 className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
             <h3 className="text-2xl font-display font-bold uppercase">Sector Heatmap Coming in Phase 3.</h3>
             <p className="text-text-secondary max-w-lg mx-auto leading-relaxed">
               We are currently integrating deeper UK stock market data to provide granular heatmap visualization of the FTSE indices.
             </p>
          </div>
        )}
      </div>
    </div>
  );
}
