"use client";

import { cn } from "@/lib/utils";
import { Brain, TrendingDown, TrendingUp, Minus } from "lucide-react";

const emotionData = [
  { emotion: "FOMO", pnl: -1250.40, count: 12, impact: "negative" },
  { emotion: "Boredom", pnl: -450.20, count: 5, impact: "negative" },
  { emotion: "Discipline", pnl: 5890.15, count: 22, impact: "positive" },
  { emotion: "Confidence", pnl: 1200.00, count: 8, impact: "positive" },
  { emotion: "Revenge", pnl: -890.00, count: 4, impact: "negative" },
];

export function EmotionalPnL() {
  const maxAbsPnL = Math.max(...emotionData.map(d => Math.abs(d.pnl)));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Emotional P&L Correlation</h4>
        <Brain className="w-3 h-3 text-text-tertiary" />
      </div>

      <div className="p-8 bg-background-surface border border-border-slate space-y-8">
        <div className="space-y-6">
          {emotionData.map((item, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between items-end text-[10px] font-mono uppercase tracking-widest">
                <span className="text-text-primary font-bold">{item.emotion} <span className="text-text-tertiary font-normal">({item.count} trades)</span></span>
                <span className={cn(item.pnl >= 0 ? "text-profit" : "text-loss")}>
                  {item.pnl >= 0 ? "+" : "-"}{Math.abs(item.pnl).toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}
                </span>
              </div>
              <div className="h-1.5 bg-background-elevated relative overflow-hidden flex items-center">
                <div 
                  className={cn(
                    "h-full transition-all duration-1000",
                    item.pnl >= 0 ? "bg-profit shadow-[0_0_8px_rgba(0,230,118,0.3)]" : "bg-loss shadow-[0_0_8px_rgba(255,61,87,0.3)]"
                  )}
                  style={{ width: `${(Math.abs(item.pnl) / maxAbsPnL) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-border-slate/50">
          <p className="text-[10px] text-text-secondary leading-relaxed font-light">
            <span className="text-accent font-bold uppercase tracking-widest mr-2 underline decoration-accent/30 decoration-2 underline-offset-4">// AI Insight:</span> 
            Your "Discipline" state generates 82% of your total profit. "FOMO" entries remain your single greatest equity leak, costing an average of £104 per occurrence.
          </p>
        </div>
      </div>
    </div>
  );
}
