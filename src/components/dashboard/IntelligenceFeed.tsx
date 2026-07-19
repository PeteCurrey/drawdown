"use client";

import React, { useEffect, useState } from "react";
import { 
  Zap, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface IntelligenceSignal {
  id: string;
  created_at: string;
  title: string;
  type: 'correlation' | 'unusual_volume' | 'insider_cluster';
  severity: 'high' | 'medium' | 'low';
  content: string;
  related_symbols: string[];
  confidence_score: number;
}

export function IntelligenceFeed() {
  const [signals, setSignals] = useState<IntelligenceSignal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSignals() {
      try {
        const response = await fetch("/api/intelligence/latest");
        const data = await response.json();
        setSignals(data);
      } catch (error) {
        console.error("Failed to fetch signals:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSignals();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-background-elevated border border-border-slate/50" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-display font-bold uppercase tracking-tight">Intelligence Feed</h2>
          <p className="text-xs font-mono text-text-tertiary uppercase tracking-widest mt-1">Live Market Signals</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
          <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
          <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-widest">Live Engine</span>
        </div>
      </div>

      {signals.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-border-slate/50 bg-background-surface">
          <p className="text-sm text-text-tertiary font-mono uppercase tracking-widest">No active signals in this window.</p>
        </div>
      ) : (
        signals.map((signal) => (
          <div 
            key={signal.id}
            className={cn(
              "p-8 border-l-4 transition-premium hover:bg-background-elevated group",
              signal.severity === 'high' ? "bg-loss/5 border-loss" : 
              signal.severity === 'medium' ? "bg-accent/5 border-accent" : 
              "bg-background-surface border-border-slate"
            )}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest border",
                    signal.type === 'correlation' ? "border-accent/30 text-accent bg-accent/5" :
                    signal.type === 'insider_cluster' ? "border-profit/30 text-profit bg-profit/5" :
                    "border-text-tertiary/30 text-text-tertiary"
                  )}>
                    {signal.type.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-mono text-text-tertiary">
                    {new Date(signal.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC
                  </span>
                </div>
                <h3 className="text-xl font-display font-bold uppercase group-hover:text-text-primary transition-colors">
                  {signal.title}
                </h3>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[9px] font-mono text-text-tertiary uppercase">Confidence</span>
                <span className="text-sm font-bold font-mono text-accent">{(signal.confidence_score * 100).toFixed(0)}%</span>
              </div>
            </div>

            <p className="text-sm text-text-secondary leading-relaxed mb-8 max-w-2xl">
              {signal.content}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  {signal.related_symbols.map(s => (
                    <span key={s} className="px-3 py-1 bg-background-primary border border-border-slate text-[10px] font-bold text-text-primary">
                      ${s}
                    </span>
                  ))}
                </div>
              </div>
              
              <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-accent hover:translate-x-1 transition-transform">
                Open Full Analysis <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))
      )}

      {/* Methodology Disclaimer */}
      <div className="mt-12 p-6 bg-background-elevated/30 border border-border-slate/50 flex gap-4 items-start">
        <ShieldCheck className="w-5 h-5 text-text-tertiary shrink-0" />
        <p className="text-[10px] text-text-tertiary leading-relaxed font-mono uppercase">
          Signals are generated by the Drawdown Intelligence Engine using professional-grade data. Past performance is not indicative of future results. Confirm all signals with technical confluence before execution.
        </p>
      </div>
    </div>
  );
}
