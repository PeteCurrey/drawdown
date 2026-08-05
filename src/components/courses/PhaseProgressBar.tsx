"use client";

import { cn } from "@/lib/utils";

interface PhaseProgressBarProps {
  completed: number;
  total: number;
  label?: string;
  className?: string;
  accentColor?: string; // e.g. "bg-emerald-500" or "bg-accent"
}

export function PhaseProgressBar({
  completed,
  total,
  label = "Phase Progress",
  className,
  accentColor = "bg-emerald-500"
}: PhaseProgressBarProps) {
  const percentage = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-text-tertiary uppercase tracking-widest">{label}</span>
        <span className="font-bold text-text-primary">
          {completed} of {total} Modules ({percentage}%)
        </span>
      </div>

      <div className="h-2 w-full bg-border-slate/50 rounded-full overflow-hidden relative">
        <div
          className={cn("h-full transition-all duration-500 ease-out rounded-full", accentColor)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
