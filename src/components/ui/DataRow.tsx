import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export interface DataRowProps {
  label: string;
  value: ReactNode;
  change?: {
    value: number | string;
    direction: "up" | "down" | "flat";
  };
  tooltip?: string;
  className?: string;
}

export function DataRow({
  label,
  value,
  change,
  tooltip,
  className,
}: DataRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between py-2.5 border-b last:border-b-0",
        className
      )}
      style={{ borderColor: "var(--border-subtle)" }}
      title={tooltip}
    >
      <span
        className="font-sans text-xs"
        style={{ color: "var(--text-secondary)" }}
      >
        {label}
      </span>
      <div className="flex items-center gap-2">
        <span
          className="font-mono tabular-nums text-sm font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          {value}
        </span>
        {change && (
          <span
            className={cn(
              "font-mono tabular-nums text-xs flex items-center gap-0.5",
              change.direction === "up" && "text-[var(--market-up)]",
              change.direction === "down" && "text-[var(--market-down)]",
              change.direction === "flat" && "text-[var(--market-flat)]"
            )}
          >
            {change.direction === "up" && <TrendingUp className="w-3 h-3" />}
            {change.direction === "down" && <TrendingDown className="w-3 h-3" />}
            {change.direction === "flat" && <Minus className="w-3 h-3" />}
            {change.value}
          </span>
        )}
      </div>
    </div>
  );
}
