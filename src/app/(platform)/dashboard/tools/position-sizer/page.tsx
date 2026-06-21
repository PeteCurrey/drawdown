"use client";

import { Percent } from "lucide-react";
import { RiskCalculator } from "@/components/tools/RiskCalculator";

export default function PositionSizerPage() {
  return (
    <div className="space-y-12 animate-in fade-in duration-700 max-w-5xl">
      <header className="border-b border-border-slate pb-8">
        <div className="flex items-center gap-3 text-profit mb-4">
          <Percent className="w-5 h-5" />
          <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Tool // Position Sizer</span>
        </div>
        <h1 className="text-4xl font-display font-bold uppercase tracking-tight">Position <span className="text-accent">Sizer.</span></h1>
        <p className="text-sm text-text-tertiary mt-2">Precision position sizing and drawdown protection engine.</p>
      </header>

      <RiskCalculator />
    </div>
  );
}
