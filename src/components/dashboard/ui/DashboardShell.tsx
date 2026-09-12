/**
 * src/components/dashboard/ui/DashboardShell.tsx
 *
 * Premium dashboard design system primitives.
 * Use these throughout the authenticated platform to ensure visual consistency.
 *
 * Design principles:
 * - Warm white surfaces (#FFFFFF panels on #F7F7F5 base)
 * - Restrained orange accent (#F9771D) — surgical use only
 * - Clean Outfit typography — no monospace for labels
 * - 8px panel radius, 6px control radius, 4px badge radius
 * - Subtle border-defined depth, not heavy shadows
 */

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ── DashboardPanel ───────────────────────────────────────────────────────────

interface DashboardPanelProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  elevated?: boolean;
  accent?: boolean;
}

export function DashboardPanel({
  children,
  className,
  noPadding = false,
  elevated = false,
  accent = false,
}: DashboardPanelProps) {
  return (
    <div
      className={cn(
        "bg-white border border-[#E8E6E1] rounded-lg transition-colors",
        elevated && "shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]",
        accent && "border-l-[3px] border-l-[#F9771D]",
        !noPadding && "p-5",
        className
      )}
    >
      {children}
    </div>
  );
}

// ── DashboardPanelHeader ─────────────────────────────────────────────────────

interface DashboardPanelHeaderProps {
  label: string;
  action?: React.ReactNode;
  className?: string;
}

export function DashboardPanelHeader({
  label,
  action,
  className,
}: DashboardPanelHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between mb-4", className)}>
      <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#888882]">
        {label}
      </span>
      {action && (
        <div className="flex items-center gap-2 text-[11px] text-[#888882]">
          {action}
        </div>
      )}
    </div>
  );
}

// ── DashboardSection ─────────────────────────────────────────────────────────

interface DashboardSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardSection({ children, className }: DashboardSectionProps) {
  return (
    <section className={cn("space-y-3", className)}>
      {children}
    </section>
  );
}

// ── DashboardMetric ──────────────────────────────────────────────────────────

interface DashboardMetricProps {
  label: string;
  value: React.ReactNode;
  note?: React.ReactNode;
  variant?: "default" | "profit" | "loss" | "accent" | "muted";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function DashboardMetric({
  label,
  value,
  note,
  variant = "default",
  size = "md",
  className,
}: DashboardMetricProps) {
  const valueColour = {
    default: "text-[#1A1A1A]",
    profit:  "text-[#18B880]",
    loss:    "text-[#CE6969]",
    accent:  "text-[#F9771D]",
    muted:   "text-[#888882]",
  }[variant];

  const valueSize = {
    sm: "text-sm font-semibold",
    md: "text-base font-semibold",
    lg: "text-2xl font-bold",
    xl: "text-3xl font-bold tracking-tight",
  }[size];

  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <span className="text-[11px] font-medium text-[#888882] uppercase tracking-[0.06em]">
        {label}
      </span>
      <span
        className={cn(
          "leading-tight dd-tabular",
          valueColour,
          valueSize
        )}
      >
        {value}
      </span>
      {note && (
        <span className="text-[11px] text-[#888882] leading-tight">{note}</span>
      )}
    </div>
  );
}

// ── DashboardDataRow ─────────────────────────────────────────────────────────

interface DashboardDataRowProps {
  label: string;
  value: React.ReactNode;
  divider?: boolean;
  valueVariant?: "default" | "profit" | "loss" | "accent" | "muted";
  className?: string;
}

export function DashboardDataRow({
  label,
  value,
  divider = true,
  valueVariant = "default",
  className,
}: DashboardDataRowProps) {
  const valueColour = {
    default: "text-[#1A1A1A]",
    profit:  "text-[#18B880]",
    loss:    "text-[#CE6969]",
    accent:  "text-[#F9771D]",
    muted:   "text-[#888882]",
  }[valueVariant];

  return (
    <div
      className={cn(
        "flex items-center justify-between py-2.5",
        divider && "border-b border-[#F0EEE9]",
        className
      )}
    >
      <span className="text-[12px] font-medium text-[#888882]">{label}</span>
      <span className={cn("text-[12px] font-semibold dd-tabular text-right", valueColour)}>
        {value}
      </span>
    </div>
  );
}

// ── DashboardStatus ──────────────────────────────────────────────────────────

interface DashboardStatusProps {
  label: string;
  variant: "online" | "profit" | "loss" | "warning" | "neutral" | "accent";
  pulse?: boolean;
  className?: string;
}

export function DashboardStatus({
  label,
  variant,
  pulse = false,
  className,
}: DashboardStatusProps) {
  const dotColour = {
    online:  "bg-[#18B880]",
    profit:  "bg-[#18B880]",
    loss:    "bg-[#CE6969]",
    warning: "bg-[#D97706]",
    neutral: "bg-[#BBBBB5]",
    accent:  "bg-[#F9771D]",
  }[variant];

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full shrink-0",
          dotColour,
          pulse && "animate-pulse"
        )}
      />
      <span className="text-[11px] font-medium text-[#4A4A47]">{label}</span>
    </div>
  );
}

// ── DashboardBadge ───────────────────────────────────────────────────────────

interface DashboardBadgeProps {
  children: React.ReactNode;
  variant?: "accent" | "profit" | "loss" | "warning" | "neutral" | "stage";
  className?: string;
}

export function DashboardBadge({
  children,
  variant = "neutral",
  className,
}: DashboardBadgeProps) {
  const styles = {
    accent:  "bg-[#FFF4EC] text-[#F9771D] border border-[rgba(249,119,29,0.25)]",
    profit:  "bg-[#F0FDF8] text-[#18B880] border border-[rgba(24,184,128,0.2)]",
    loss:    "bg-[#FDF2F2] text-[#CE6969] border border-[rgba(206,105,105,0.2)]",
    warning: "bg-[#FFFBEB] text-[#D97706] border border-[rgba(217,119,6,0.2)]",
    neutral: "bg-[#F4F3F0] text-[#888882] border border-[#E8E6E1]",
    stage:   "bg-[#1A1A1A] text-white border border-[#1A1A1A]",
  }[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center text-[10px] font-semibold uppercase tracking-[0.07em] px-2 py-0.5 rounded",
        styles,
        className
      )}
    >
      {children}
    </span>
  );
}

// ── DashboardEmptyState ──────────────────────────────────────────────────────

interface DashboardEmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
  className?: string;
  compact?: boolean;
}

export function DashboardEmptyState({
  icon,
  title,
  description,
  action,
  className,
  compact = false,
}: DashboardEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "py-6 px-4 gap-2" : "py-10 px-6 gap-3",
        className
      )}
    >
      {icon && (
        <div className="w-9 h-9 rounded-full bg-[#F4F3F0] border border-[#E8E6E1] flex items-center justify-center text-[#888882]">
          {icon}
        </div>
      )}
      <div className={cn("space-y-1", compact ? "max-w-[200px]" : "max-w-xs")}>
        <p className={cn("font-semibold text-[#1A1A1A]", compact ? "text-xs" : "text-sm")}>
          {title}
        </p>
        {description && (
          <p className="text-[11px] text-[#888882] leading-relaxed">{description}</p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center text-[11px] font-semibold text-[#F9771D] hover:text-[#E06818] transition-colors mt-1"
        >
          {action.label} →
        </Link>
      )}
    </div>
  );
}

// ── DashboardSkeleton ────────────────────────────────────────────────────────

interface DashboardSkeletonProps {
  className?: string;
  height?: string;
}

export function DashboardSkeleton({ className, height = "h-4" }: DashboardSkeletonProps) {
  return (
    <div className={cn("rounded dd-skeleton", height, className)} />
  );
}

// ── DashboardDivider ─────────────────────────────────────────────────────────

export function DashboardDivider({ className }: { className?: string }) {
  return <div className={cn("border-t border-[#F0EEE9]", className)} />;
}

// ── DashboardActionLink ──────────────────────────────────────────────────────

interface DashboardActionLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function DashboardActionLink({ href, children, className }: DashboardActionLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1 text-[11px] font-semibold text-[#F9771D] hover:text-[#E06818] transition-colors",
        className
      )}
    >
      {children}
    </Link>
  );
}
