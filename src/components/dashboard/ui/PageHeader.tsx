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
}

export function PageHeader({
  title,
  description,
  eyebrow,
  accentColor,
  badge,
  children,
  className,
}: PageHeaderProps) {
  const rightSlot = badge ?? children;
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#DEDDD8]",
        className
      )}
    >
      <div className="space-y-1">
        {eyebrow && (
          <span
            className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] block"
            style={{ color: accentColor || "var(--tool-accent-text, var(--tool-accent, #F9771D))" }}
          >
            // {eyebrow}
          </span>
        )}
        <h1 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tight text-[#1A1A1A]">
          {title}
        </h1>
        {description && (
          <p className="text-xs md:text-sm text-[#555550] max-w-2xl leading-relaxed">
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
