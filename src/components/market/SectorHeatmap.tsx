"use client";

import { MarketSector } from "@/lib/data/sectors";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface SectorHeatmapProps {
  sectors: MarketSector[];
  onSelect?: (sector: MarketSector) => void;
}

export function SectorHeatmap({ sectors, onSelect }: SectorHeatmapProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sectors.map((sector) => {
        const isBullish = sector.performance > 0;
        const isBearish = sector.performance < 0;
        
        return (
          <div 
            key={sector.id}
            onClick={() => onSelect?.(sector)}
            className={cn(
              "group p-6 bg-background-surface border border-border-slate hover:border-accent transition-premium cursor-pointer relative overflow-hidden",
              isBullish && "hover:bg-profit/5",
              isBearish && "hover:bg-loss/5"
            )}
          >
            {/* Background Accent */}
            <div className={cn(
              "absolute top-0 left-0 w-1 h-full opacity-40",
              isBullish ? "bg-profit" : isBearish ? "bg-loss" : "bg-text-tertiary"
            )} />

            <div className="flex justify-between items-start mb-6 relative z-10">
              <div>
                <h3 className="text-sm font-display font-black uppercase tracking-tight text-text-primary">
                  {sector.name}
                </h3>
                <p className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest mt-1">
                  // {sector.topInstruments.join(', ')}
                </p>
              </div>
              <div className={cn(
                "w-8 h-8 flex items-center justify-center border",
                isBullish ? "border-profit/20 text-profit" : isBearish ? "border-loss/20 text-loss" : "border-border-slate text-text-tertiary"
              )}>
                {isBullish ? <ArrowUpRight className="w-4 h-4" /> : isBearish ? <ArrowDownRight className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
              </div>
            </div>

            <div className="flex justify-between items-end relative z-10">
              <div className="space-y-1">
                <span className="text-[7px] font-mono text-text-tertiary uppercase tracking-widest">Weight</span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "w-2 h-1",
                        i < sector.weight * 5 ? "bg-accent" : "bg-border-slate"
                      )} 
                    />
                  ))}
                </div>
              </div>
              <span className={cn(
                "text-2xl font-display font-black",
                isBullish ? "text-profit" : isBearish ? "text-loss" : "text-text-primary"
              )}>
                {isBullish ? '+' : ''}{sector.performance.toFixed(2)}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
