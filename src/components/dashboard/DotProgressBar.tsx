import React from "react";
import { cn } from "@/lib/utils";

interface DotProgressBarProps {
  percentage: number;
  label?: string;
  color?: string; // e.g. "bg-orange"
  className?: string;
}

export function DotProgressBar({
  percentage,
  label,
  color = "bg-[#F9771D]",
  className,
}: DotProgressBarProps) {
  // Ensure percentage is bounded between 0 and 100
  const boundedPercentage = Math.min(100, Math.max(0, percentage));

  return (
    <div className={cn("space-y-1.5 w-full", className)}>
      {label && (
        <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-[#555550]">
          <span>{label}</span>
          <span>{boundedPercentage}%</span>
        </div>
      )}
      <div className="relative h-2 w-full flex items-center">
        {/* Dashed line track background */}
        <div className="absolute inset-x-0 h-0.5 border-t border-dashed border-[#C8CBB8]/60" />
        
        {/* Filled overlay representing progress */}
        <div 
          className={cn("absolute h-1 left-0 rounded-none transition-all duration-500", color)}
          style={{ width: `${boundedPercentage}%` }}
        />
      </div>
    </div>
  );
}
