"use client";

import { PriceTicker } from "@/components/home/PriceTicker";
import { MacroIntelligenceStrip } from "@/components/home/MacroIntelligenceStrip";

export function LiveDataStrip() {
  return (
    <div className="w-full border-b select-none" style={{ borderColor: "var(--border-subtle)" }}>
      <PriceTicker />
      <MacroIntelligenceStrip />
    </div>
  );
}
