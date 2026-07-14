"use client";

import { RiskCalculator } from "@/components/tools/RiskCalculator";

export default function PositionSizerPage() {
  const themeStyles = {
    "--tool-accent": "#10b981",
    "--tool-accent-hover": "#059669",
    "--tool-accent-tint": "#ecfdf5",
    "--tool-accent-border": "#a7f3d0",
    "--tool-accent-text": "#15803d",
  } as React.CSSProperties;

  return (
    <div className="space-y-8 animate-in fade-in duration-700" style={themeStyles}>
      {/* Page header — matches current dashboard design: accent eyebrow, italic accent word */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-accent font-mono text-[10px] uppercase tracking-widest block mb-3">
            // MODULE_05 // POSITION SIZER
          </span>
          <h1 className="text-4xl font-display font-bold uppercase text-text-primary">
            Position <span className="text-accent italic">Sizer.</span>
          </h1>
          <p className="text-text-secondary text-sm mt-2 max-w-xl">
            Precision position sizing, risk management, and drawdown protection. Every trade sized to protect your account.
          </p>
        </div>
      </header>

      <RiskCalculator />
    </div>
  );
}
