/**
 * src/components/dashboard/ui/DashboardShell.tsx
 *
 * Premium dashboard design system primitives.
 *
 * Elevation:
 *   elevated="sm"  — standard panel: border + elev-1 shadow (barely visible)
 *   elevated="md"  — raised hero: border + elev-2 (felt, not seen)
 *   elevated        — alias for "sm"
 *
 * Radius:
 *   badge/tag — 4px  |  button/control — 6px  |  panel — 8px  |  hero — 10px
 */

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ── DashboardPanel ───────────────────────────────────────────────────────────

interface DashboardPanelProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  elevated?: boolean | "sm" | "md";
  accent?: boolean;
  inset?: boolean;
}

export function DashboardPanel({
  children,
  className,
  noPadding = false,
  elevated = false,
  accent = false,
  inset = false,
}: DashboardPanelProps) {
  const elevVal = elevated === "md" ? "md" : elevated ? "sm" : false;

  return (
    <div
      className={cn(
        "border transition-colors",
        inset
          ? "bg-[#F3F2EE] border-[#EEECE7] rounded-[8px]"
          : "bg-white border-[#E6E4DE] rounded-[8px]",
        elevVal === "sm" &&
          "shadow-[0_1px_2px_rgba(14,13,10,0.04),0_2px_8px_rgba(14,13,10,0.05)]",
        elevVal === "md" &&
          "rounded-[10px] shadow-[0_1px_3px_rgba(14,13,10,0.05),0_6px_20px_rgba(14,13,10,0.08)]",
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
      <span className="text-[10px] font-semibold uppercase tracking-[0.09em] text-[#87877F]">
        {label}
      </span>
      {action && (
        <div className="flex items-center gap-2 text-[11px] text-[#87877F]">
          {action}
        </div>
      )}
    </div>
  );
}

// ── DashboardSection ─────────────────────────────────────────────────────────

export function DashboardSection({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cn("space-y-3", className)}>{children}</section>;
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
    default: "text-[#181818]",
    profit:  "text-[#18B880]",
    loss:    "text-[#CE6969]",
    accent:  "text-[#F9771D]",
    muted:   "text-[#87877F]",
  }[variant];

  const valueSize = {
    sm: "text-sm font-medium",
    md: "text-base font-semibold",
    lg: "text-2xl font-semibold",
    xl: "text-4xl font-light tracking-tight",
  }[size];

  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <span className="text-[10px] font-semibold text-[#87877F] uppercase tracking-[0.08em]">
        {label}
      </span>
      <span className={cn("leading-tight dd-tabular", valueColour, valueSize)}>
        {value}
      </span>
      {note && <span className="text-[11px] text-[#87877F] leading-tight">{note}</span>}
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
    default: "text-[#181818]",
    profit:  "text-[#18B880]",
    loss:    "text-[#CE6969]",
    accent:  "text-[#F9771D]",
    muted:   "text-[#87877F]",
  }[valueVariant];

  return (
    <div
      className={cn(
        "flex items-center justify-between py-2",
        divider && "border-b border-[#EEECE7]",
        className
      )}
    >
      <span className="text-[12px] font-medium text-[#87877F]">{label}</span>
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

export function DashboardStatus({ label, variant, pulse = false, className }: DashboardStatusProps) {
  const dotColour = {
    online:  "bg-[#18B880]",
    profit:  "bg-[#18B880]",
    loss:    "bg-[#CE6969]",
    warning: "bg-[#D97706]",
    neutral: "bg-[#BBBAB4]",
    accent:  "bg-[#F9771D]",
  }[variant];

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColour, pulse && "animate-pulse")} />
      <span className="text-[11px] font-medium text-[#474744]">{label}</span>
    </div>
  );
}

// ── DashboardBadge ───────────────────────────────────────────────────────────

interface DashboardBadgeProps {
  children: React.ReactNode;
  variant?: "accent" | "profit" | "loss" | "warning" | "neutral" | "stage";
  className?: string;
}

export function DashboardBadge({ children, variant = "neutral", className }: DashboardBadgeProps) {
  const styles = {
    accent:  "bg-[#FFF4EC] text-[#F9771D] border border-[rgba(249,119,29,0.22)]",
    profit:  "bg-[#F0FDF8] text-[#18B880] border border-[rgba(24,184,128,0.2)]",
    loss:    "bg-[#FDF2F2] text-[#CE6969] border border-[rgba(206,105,105,0.2)]",
    warning: "bg-[#FFFBEB] text-[#D97706] border border-[rgba(217,119,6,0.2)]",
    neutral: "bg-[#F3F2EE] text-[#87877F] border border-[#E6E4DE]",
    stage:   "bg-[#181818] text-white border border-[#181818]",
  }[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center text-[10px] font-semibold uppercase tracking-[0.07em] px-2 py-0.5 rounded-[4px]",
        styles,
        className
      )}
    >
      {children}
    </span>
  );
}

// ── DashboardRiskBar ─────────────────────────────────────────────────────────
// Premium progress bar for risk/drawdown status display.

interface DashboardRiskBarProps {
  fillPct: number;
  leftLabel?: React.ReactNode;
  rightLabel?: React.ReactNode;
  noteLeft?: React.ReactNode;
  noteRight?: React.ReactNode;
  className?: string;
}

export function DashboardRiskBar({
  fillPct,
  leftLabel,
  rightLabel,
  noteLeft,
  noteRight,
  className,
}: DashboardRiskBarProps) {
  const pct = Math.min(100, Math.max(0, fillPct));
  const trackColour =
    pct > 75 ? "bg-[#CE6969]" : pct > 40 ? "bg-[#D97706]" : "bg-[#18B880]";

  return (
    <div className={cn("space-y-1.5 p-3 bg-[#F3F2EE] rounded-[8px] border border-[#EEECE7]", className)}>
      {(leftLabel || rightLabel) && (
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-[#474744]">{leftLabel}</span>
          <span className="text-[11px] font-medium text-[#87877F] dd-tabular">{rightLabel}</span>
        </div>
      )}
      <div className="w-full bg-[#E6E4DE] h-[5px] rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", trackColour)}
          style={{ width: `${Math.max(2, pct)}%` }}
        />
      </div>
      {(noteLeft || noteRight) && (
        <div className="flex justify-between text-[10px] text-[#87877F] dd-tabular">
          <span>{noteLeft}</span>
          <span>{noteRight}</span>
        </div>
      )}
    </div>
  );
}

// ── DashboardEmptyState ──────────────────────────────────────────────────────

interface DashboardEmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; href: string };
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
    <div className={cn("flex flex-col items-start", compact ? "py-4 gap-1.5" : "py-8 gap-2", className)}>
      {icon && (
        <div className="w-8 h-8 rounded-[6px] bg-[#F3F2EE] border border-[#E6E4DE] flex items-center justify-center text-[#87877F] mb-0.5">
          {icon}
        </div>
      )}
      <p className={cn("font-semibold text-[#181818] leading-snug", compact ? "text-xs" : "text-sm")}>
        {title}
      </p>
      {description && (
        <p className="text-[12px] text-[#87877F] leading-relaxed max-w-xs">{description}</p>
      )}
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#F9771D] hover:text-[#E06818] transition-colors mt-1"
        >
          {action.label} →
        </Link>
      )}
    </div>
  );
}

// ── DashboardSkeleton ────────────────────────────────────────────────────────

export function DashboardSkeleton({ className, height = "h-4" }: { className?: string; height?: string }) {
  return <div className={cn("rounded-[4px] dd-skeleton", height, className)} />;
}

// ── DashboardDivider ─────────────────────────────────────────────────────────

export function DashboardDivider({ className }: { className?: string }) {
  return <div className={cn("border-t border-[#EEECE7]", className)} />;
}

// ── DashboardActionLink ──────────────────────────────────────────────────────

export function DashboardActionLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
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
