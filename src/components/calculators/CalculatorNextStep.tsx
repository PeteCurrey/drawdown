"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

interface CalculatorNextStepProps {
  heading: string;
  body: string;
  cta: string;
  href: string;
  /** Use 'dark' on dark background pages (calculators), 'light' for light pages */
  theme?: "dark" | "light";
}

/**
 * Institutional product conversion module placed below calculator content.
 * Connects the manual calculation workflow to an automated Drawdown platform feature.
 * Non-intrusive: below the fold, after full editorial content.
 */
export function CalculatorNextStep({
  heading,
  body,
  cta,
  href,
  theme = "dark",
}: CalculatorNextStepProps) {
  const isDark = theme === "dark";

  return (
    <section
      className={[
        "my-16 p-8 border flex flex-col sm:flex-row sm:items-center gap-8",
        isDark
          ? "border-accent/30 bg-accent/5"
          : "border-slate-200 bg-slate-50",
      ].join(" ")}
    >
      {/* Icon */}
      <div
        className={[
          "flex-shrink-0 w-12 h-12 flex items-center justify-center border",
          isDark ? "border-accent/40 text-accent" : "border-slate-300 text-slate-700",
        ].join(" ")}
      >
        <Zap className="w-5 h-5" />
      </div>

      {/* Copy */}
      <div className="flex-1 space-y-1">
        <p
          className={[
            "text-[10px] font-mono uppercase tracking-[0.25em]",
            isDark ? "text-accent" : "text-slate-500",
          ].join(" ")}
        >
          Next logical step
        </p>
        <h3
          className={[
            "text-sm font-bold uppercase tracking-tight",
            isDark ? "text-text-primary" : "text-slate-900",
          ].join(" ")}
        >
          {heading}
        </h3>
        <p
          className={[
            "text-xs leading-relaxed max-w-xl",
            isDark ? "text-text-secondary" : "text-slate-600",
          ].join(" ")}
        >
          {body}
        </p>
      </div>

      {/* CTA */}
      <Link
        href={href}
        className={[
          "flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 text-[10px] font-mono font-black uppercase tracking-widest transition-all",
          isDark
            ? "bg-accent text-background-primary hover:bg-accent/90"
            : "bg-slate-900 text-white hover:bg-slate-700",
        ].join(" ")}
      >
        {cta}
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </section>
  );
}
