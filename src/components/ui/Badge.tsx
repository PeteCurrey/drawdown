import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "accent";
}

export function Badge({
  variant = "default",
  className,
  style,
  children,
  ...props
}: BadgeProps) {
  const colorStyles = {
    default: {
      color: "var(--text-secondary)",
      backgroundColor: "var(--surface-raised)",
      borderColor: "var(--border-subtle)",
    },
    success: {
      color: "var(--market-up)",
      backgroundColor: "color-mix(in srgb, var(--market-up) 12%, transparent)",
      borderColor: "color-mix(in srgb, var(--market-up) 25%, transparent)",
    },
    warning: {
      color: "var(--market-flat)",
      backgroundColor: "color-mix(in srgb, var(--market-flat) 12%, transparent)",
      borderColor: "color-mix(in srgb, var(--market-flat) 25%, transparent)",
    },
    danger: {
      color: "var(--market-down)",
      backgroundColor: "color-mix(in srgb, var(--market-down) 12%, transparent)",
      borderColor: "color-mix(in srgb, var(--market-down) 25%, transparent)",
    },
    accent: {
      color: "var(--accent)",
      backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)",
      borderColor: "color-mix(in srgb, var(--accent) 25%, transparent)",
    },
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 border font-mono text-xs uppercase tracking-wider font-semibold select-none",
        className
      )}
      style={{
        borderRadius: "var(--radius-pill)",
        ...colorStyles[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  );
}
