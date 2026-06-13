"use client";

import { useState, useEffect } from "react";
import { PatternDetector, PsychologyPattern } from "@/lib/coach/pattern-detector";
import { IndividualTrade, FundedAccount } from "@/types/dashboard";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, ShieldAlert, Zap, Brain, ChevronRight } from "lucide-react";

interface PsychologyCoachProps {
  trades: IndividualTrade[];
  account: FundedAccount;
}

export function PsychologyCoach({ trades, account }: PsychologyCoachProps) {
  const [patterns, setPatterns] = useState<PsychologyPattern[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate engine analysis
    const timer = setTimeout(() => {
      const detector = new PatternDetector({ trades, account });
      setPatterns(detector.detectPatterns());
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [trades, account]);

  if (loading) {
    return (
      <div className="p-8 bg-background-surface/40 backdrop-blur-md border border-border-slate/50 space-y-6 animate-pulse">
        <div className="flex items-center gap-3">
          <Brain className="w-5 h-5 text-text-tertiary" />
          <div className="h-4 bg-white/5 w-48 rounded" />
        </div>
        <div className="space-y-3">
          <div className="h-20 bg-white/5 w-full rounded" />
          <div className="h-20 bg-white/5 w-full rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative">
             <Brain className="w-5 h-5 text-accent" />
             <div className="absolute -top-1 -right-1 w-2 h-2 bg-profit rounded-full animate-ping" />
          </div>
          <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-primary">AI Psychology Coach</h4>
        </div>
        <span className="text-[8px] font-mono text-text-tertiary uppercase">Analysis: Live</span>
      </div>

      <div className="space-y-4">
        {patterns.length === 0 ? (
          <div className="p-8 bg-background-surface/40 backdrop-blur-md border border-profit/30 flex flex-col items-center text-center space-y-4 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,230,118,0.1)] hover:-translate-y-0.5">
            <CheckCircle2 className="w-8 h-8 text-profit" />
            <div className="space-y-1">
               <p className="text-sm font-display font-bold uppercase">Discipline Maintained</p>
               <p className="text-xs text-text-tertiary">No negative behavioral patterns detected in your last 10 trades.</p>
            </div>
          </div>
        ) : (
          patterns.map((pattern) => (
            <div 
              key={pattern.id}
              className={cn(
                "p-6 border-l-4 transition-all hover:translate-x-1",
                pattern.severity === 'critical' ? "bg-loss/5 border-loss" : 
                pattern.severity === 'high' ? "bg-warning/5 border-warning" : 
                "bg-accent/5 border-accent"
              )}
            >
              <div className="flex items-start gap-4">
                {pattern.severity === 'critical' ? (
                  <ShieldAlert className="w-5 h-5 text-loss shrink-0 mt-1" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-1" />
                )}
                <div className="space-y-3">
                  <div>
                    <h5 className="text-sm font-display font-bold uppercase leading-none mb-2">{pattern.name}</h5>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {pattern.description}
                    </p>
                  </div>
                  
                  <div className="p-3 bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center gap-2">
                       <Zap className="w-3 h-3 text-accent" />
                       <span className="text-[10px] font-mono uppercase font-bold text-text-primary">Recommendation</span>
                    </div>
                    <p className="text-[11px] text-text-tertiary italic leading-normal">
                      {pattern.recommendation}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                     <span className="text-[8px] font-mono text-text-tertiary uppercase">Detected: {new Date(pattern.detectedAt).toLocaleTimeString()}</span>
                     <button className="text-[8px] font-mono uppercase tracking-widest text-accent hover:underline flex items-center gap-1">
                        Review Trade <ChevronRight className="w-2 h-2" />
                     </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 bg-background-elevated/50 border border-border-slate/50">
         <p className="text-[9px] text-text-tertiary text-center leading-relaxed font-mono uppercase tracking-tight">
            The coach is watching your equity curve in real-time. Stay disciplined.
         </p>
      </div>
    </div>
  );
}
