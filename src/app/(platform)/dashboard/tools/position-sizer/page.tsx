"use client";

import { RiskCalculator } from "@/components/tools/RiskCalculator";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";

export default function PositionSizerPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <PageHeader
        eyebrow="Execution Systems · Position Sizer"
        title="Position Sizer"
        description="Precision position sizing, risk management, and drawdown protection. Every trade sized to protect your account."
      />

      <RiskCalculator />
    </div>
  );
}
