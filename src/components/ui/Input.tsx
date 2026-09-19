import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isNumeric?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ isNumeric = false, className, style, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full h-10 px-3 py-2 text-sm font-sans border outline-none transition-all duration-150",
          "focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]",
          "placeholder:text-[var(--text-tertiary)] disabled:opacity-50 disabled:pointer-events-none",
          isNumeric && "font-mono tabular-nums",
          className
        )}
        style={{
          backgroundColor: "var(--surface-inset)",
          borderColor: "var(--border-subtle)",
          color: "var(--text-primary)",
          borderRadius: "var(--radius-sm)",
          ...style,
        }}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, style, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "w-full h-10 px-3 py-2 text-sm font-sans border outline-none transition-all duration-150 cursor-pointer",
          "focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]",
          "disabled:opacity-50 disabled:pointer-events-none",
          className
        )}
        style={{
          backgroundColor: "var(--surface-inset)",
          borderColor: "var(--border-subtle)",
          color: "var(--text-primary)",
          borderRadius: "var(--radius-sm)",
          ...style,
        }}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = "Select";
