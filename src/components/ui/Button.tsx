import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "destructive";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      className,
      style,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
    };

    const variantClasses = {
      primary:
        "text-[var(--surface-base)] bg-[var(--accent)] hover:brightness-110 active:brightness-95 border-transparent font-medium",
      secondary:
        "bg-transparent border border-[var(--border-strong)] text-[var(--text-primary)] hover:bg-[var(--surface-raised)] active:bg-[var(--surface-overlay)] font-medium",
      tertiary:
        "bg-transparent border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)] font-medium",
      destructive:
        "text-[var(--market-down)] bg-transparent border border-[color-mix(in_srgb,var(--market-down)_20%,transparent)] hover:bg-[color-mix(in_srgb,var(--market-down)_10%,transparent)] font-medium",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-sans transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:pointer-events-none select-none",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        style={{
          borderRadius: "var(--radius-md)",
          ...style,
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
