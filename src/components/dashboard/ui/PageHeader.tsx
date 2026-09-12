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
        isDark ? "border-white/10" : "border-[#E6E4DE]",
        className
      )}
    >
      <div className="space-y-1">
        {cleanEyebrow && (
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-1 h-3.5 bg-[#F9771D] rounded-full shrink-0" />
            <span
              className={cn(
                "text-[10px] font-semibold uppercase tracking-[0.09em] block",
                isDark ? "text-white/60" : "text-[#87877F]"
              )}
              style={accentColor ? { color: accentColor } : undefined}
            >
              {cleanEyebrow}
            </span>
          </div>
        )}
        <h1
          className={cn(
            "text-2xl md:text-3xl font-display font-bold tracking-tight",
            isDark ? "text-white" : "text-[#181818]"
          )}
        >
          {title}
        </h1>
        {description && (
          <p
            className={cn(
              "text-xs max-w-2xl leading-relaxed mt-0.5",
              isDark ? "text-white/60" : "text-[#87877F]"
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

