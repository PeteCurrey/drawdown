"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface HeatmapProps {
  data?: { date: string; pnl: number }[];
}

export function PerformanceHeatmap({ data = [] }: HeatmapProps) {
  // Generate mock data for the last 12 weeks for the MVP
  const weeks = 12;
  const days = 7;
  
  const cells = useMemo(() => {
    return Array.from({ length: weeks * days }, (_, i) => {
      // Logic to mock some profits and losses
      const pnl = Math.random() > 0.6 ? (Math.random() * 500 - 150) : 0;
      return { pnl };
    });
  }, []);

  const dayLabels = ["M", "", "W", "", "F", "", "S"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">3-Month Performance Intensity</h4>
        <div className="flex items-center gap-4">
          <span className="text-[8px] font-mono uppercase text-text-tertiary">Loss</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-loss/20" />
            <div className="w-2 h-2 bg-loss/50" />
            <div className="w-2 h-2 bg-background-elevated" />
            <div className="w-2 h-2 bg-profit/40" />
            <div className="w-2 h-2 bg-profit" />
          </div>
          <span className="text-[8px] font-mono uppercase text-text-tertiary">Profit</span>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex flex-col justify-between gap-1 py-1">
          {dayLabels.map((label, i) => (
            <span key={i} className="text-[8px] font-mono text-text-tertiary h-3 leading-none flex items-center">
              {label}
            </span>
          ))}
        </div>
        
        <div className="grid grid-flow-col grid-rows-7 gap-1">
          {cells.map((cell, i) => (
            <div 
              key={i}
              className={cn(
                "w-3 h-3 transition-colors duration-500",
                cell.pnl === 0 && "bg-background-elevated",
                cell.pnl > 0 && cell.pnl < 100 && "bg-profit/30",
                cell.pnl >= 100 && "bg-profit",
                cell.pnl < 0 && cell.pnl > -100 && "bg-loss/30",
                cell.pnl <= -100 && "bg-loss"
              )}
              title={cell.pnl !== 0 ? `P&L: £${cell.pnl.toFixed(2)}` : "No trades"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
