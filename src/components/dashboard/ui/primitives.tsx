import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  hover?: boolean;
  /** Zero radius — use for financial/data-dense elements */
  sharp?: boolean;
}

export function Card({ children, className, padding = "md", hover = false, sharp = false }: CardProps) {
  const paddingMap = { sm: "p-4", md: "p-6", lg: "p-8" };
  return (
    <div
      className={cn(
        "bg-background-surface border border-border-slate/50 shadow-[0_4px_16px_rgba(0,0,0,0.04)]",
        sharp ? "rounded-none" : "rounded-xl",
        paddingMap[padding],
        hover && "transition-all duration-200 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5",
        className
      )}
    >
      {children}
    </div>
  );
}

interface StatTileProps {
  label: string;
  value: string | number;
  change?: number | null;
  unit?: string;
  /** Highlight the value in the page accent colour */
  accent?: boolean;
  className?: string;
}

export function StatTile({ label, value, change, unit, accent = false, className }: StatTileProps) {
  const isUp = typeof change === "number" && change > 0;
  const isDown = typeof change === "number" && change < 0;
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">{label}</span>
      <div className="flex items-baseline gap-1.5">
        <span
          className={cn(
            "text-2xl font-black font-mono tracking-tight",
            accent ? "text-[var(--tool-accent,#F9771D)]" : "text-text-primary"
          )}
        >
          {value}
        </span>
        {unit && <span className="text-xs font-mono text-text-tertiary">{unit}</span>}
      </div>
      {typeof change === "number" && (
        <span
          className={cn(
            "text-[10px] font-mono font-bold",
            isUp ? "text-profit" : isDown ? "text-loss" : "text-text-tertiary"
          )}
        >
          {isUp ? "+" : ""}{change.toFixed(2)}%
        </span>
      )}
    </div>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: "accent" | "profit" | "loss" | "warning" | "neutral";
  size?: "sm" | "md";
}

export function Badge({ children, variant = "accent", size = "sm" }: BadgeProps) {
  const variants = {
    accent:  "bg-[var(--tool-accent,#F9771D)]/10 text-[var(--tool-accent,#F9771D)] border-[var(--tool-accent,#F9771D)]/20",
    profit:  "bg-profit/10 text-profit border-profit/20",
    loss:    "bg-loss/10 text-loss border-loss/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    neutral: "bg-background-elevated text-text-tertiary border-border-slate/60",
  };
  const sizes = { sm: "text-[8px] px-1.5 py-0.5", md: "text-[10px] px-2 py-1" };
  return (
    <span
      className={cn(
        "font-mono font-bold uppercase tracking-wider border rounded-sm",
        variants[variant],
        sizes[size]
      )}
    >
      {children}
    </span>
  );
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center space-y-4">
      {icon && (
        <div className="w-12 h-12 rounded-full bg-background-elevated border border-border-slate/50 flex items-center justify-center text-text-tertiary">
          {icon}
        </div>
      )}
      <div className="space-y-1 max-w-xs">
        <p className="text-sm font-bold uppercase tracking-wide text-text-primary">{title}</p>
        {description && <p className="text-xs text-text-tertiary leading-relaxed">{description}</p>}
      </div>
      {action}
    </div>
  );
}

interface LoadingSkeletonProps {
  className?: string;
  /** Zero radius for financial tables/rows */
  sharp?: boolean;
}

export function LoadingSkeleton({ className, sharp = false }: LoadingSkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-background-elevated",
        sharp ? "rounded-none" : "rounded-xl",
        className
      )}
    />
  );
}
