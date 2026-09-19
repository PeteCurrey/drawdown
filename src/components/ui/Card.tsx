import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: "flat" | "raised" | "overlay";
  interactive?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      elevation = "raised",
      interactive = false,
      padding = "md",
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const bgMap = {
      flat: "var(--surface-base)",
      raised: "var(--surface-raised)",
      overlay: "var(--surface-overlay)",
    };

    const shadowMap = {
      flat: "none",
      raised: "var(--elev-1)",
      overlay: "var(--elev-2)",
    };

    const paddingMap = {
      none: "p-0",
      sm: "p-3 sm:p-4",
      md: "p-5 sm:p-6",
      lg: "p-6 sm:p-8",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "border transition-all duration-150 relative",
          paddingMap[padding],
          interactive &&
            "cursor-pointer hover:-translate-y-[1px] hover:border-[var(--border-strong)] hover:shadow-[var(--elev-2)]",
          className
        )}
        style={{
          backgroundColor: bgMap[elevation],
          borderColor: "var(--border-subtle)",
          borderRadius: "var(--radius-md)",
          boxShadow: shadowMap[elevation],
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
