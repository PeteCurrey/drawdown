import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: string;
  accentColor?: string;
  /** Optional right-hand slot — accepts a status chip, badge, CTA, or any ReactNode */
  badge?: React.ReactNode;
  /** @deprecated use badge instead */
  children?: React.ReactNode;
  className?: string;
  theme?: "light" | "dark";
}

export function PageHeader({
  title,
  description,
  eyebrow,
  accentColor,
  badge,
  children,
  className,
  theme = "light",
}: PageHeaderProps) {
  const rightSlot = badge ?? children;
  const isDark = theme === "dark";

  // Clean eyebrow: strip leading '// ' if callers passed it
  const cleanEyebrow = eyebrow?.replace(/^\/\/\s*/, "");

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b",
        isDark ? "border-white/10" : "border-[#E8E6E1]",
        className
      )}
    >
      <div className="space-y-1">
        {cleanEyebrow && (
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.08em] block"
            style={{ color: accentColor || "var(--dd-accent, #F9771D)" }}
          >
            {cleanEyebrow}
          </span>
        )}
        <h1
          className={cn(
            "text-2xl md:text-3xl font-display font-bold tracking-tight",
            isDark ? "text-white" : "text-[#1A1A1A]"
          )}
        >
          {title}
        </h1>
        {description && (
          <p
            className={cn(
              "text-xs md:text-sm max-w-2xl leading-relaxed",
              isDark ? "text-white/60" : "text-[#555550]"
            )}
          >
            {description}
          </p>
        )}
      </div>
      {rightSlot && (
        <div className="flex items-center gap-3 shrink-0">{rightSlot}</div>
      )}
    </div>
  );
}

