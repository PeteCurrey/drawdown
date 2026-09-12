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
  const paddingMap = { sm: "p-4", md: "p-5", lg: "p-6" };
  return (
    <div
      className={cn(
        "bg-white border border-[#E8E6E1] shadow-[0_1px_3px_rgba(0,0,0,0.04)]",
        sharp ? "rounded-none" : "rounded-lg",
        paddingMap[padding],
        hover && "transition-all duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:-translate-y-0.5",
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
      <span className="text-[11px] font-medium text-[#888882] uppercase tracking-[0.06em]">{label}</span>
      <div className="flex items-baseline gap-1.5">
        <span
          className={cn(
            "text-2xl font-bold dd-tabular tracking-tight",
            accent ? "text-[#F9771D]" : "text-[#1A1A1A]"
          )}
        >
          {value}
        </span>
        {unit && <span className="text-xs text-[#888882]">{unit}</span>}
      </div>
      {typeof change === "number" && (
        <span
          className={cn(
            "text-[11px] font-semibold dd-tabular",
            isUp ? "text-[#18B880]" : isDown ? "text-[#CE6969]" : "text-[#888882]"
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
    accent:  "bg-[#FFF4EC] text-[#F9771D] border border-[rgba(249,119,29,0.25)]",
    profit:  "bg-[#F0FDF8] text-[#18B880] border border-[rgba(24,184,128,0.2)]",
    loss:    "bg-[#FDF2F2] text-[#CE6969] border border-[rgba(206,105,105,0.2)]",
    warning: "bg-[#FFFBEB] text-[#D97706] border border-[rgba(217,119,6,0.2)]",
    neutral: "bg-[#F4F3F0] text-[#888882] border border-[#E8E6E1]",
  };
  const sizes = { sm: "text-[9px] px-1.5 py-0.5", md: "text-[10px] px-2 py-0.5" };
  return (
    <span
      className={cn(
        "font-semibold uppercase tracking-wider border rounded",
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
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-3">
      {icon && (
        <div className="w-10 h-10 rounded-full bg-[#F4F3F0] border border-[#E8E6E1] flex items-center justify-center text-[#888882]">
          {icon}
        </div>
      )}
      <div className="space-y-1 max-w-xs">
        <p className="text-sm font-semibold text-[#1A1A1A]">{title}</p>
        {description && <p className="text-xs text-[#888882] leading-relaxed">{description}</p>}
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
        "dd-skeleton",
        sharp ? "rounded-none" : "rounded-lg",
        className
      )}
    />
  );
}

