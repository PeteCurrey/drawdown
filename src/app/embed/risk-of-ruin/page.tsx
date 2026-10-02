import type { Metadata } from "next";
import { RiskOfRuinSimulator } from "@/components/calculators/RiskOfRuinSimulator";

export const metadata: Metadata = {
  title: "Risk of Ruin Calculator | Drawdown",
  robots: { index: false, follow: false },
};

/**
 * Minimal embed surface for the Risk of Ruin Simulator.
 * Intended for use inside <iframe> on third-party publisher sites.
 * No site navigation, no marketing copy, no competing SEO content.
 */
export default function EmbedRiskOfRuinPage() {
  return (
    <div className="min-h-screen bg-background-primary text-text-primary">
      <div className="w-full max-w-2xl mx-auto px-4 py-6">
        <div className="mb-4 flex items-center justify-between text-xs text-text-tertiary">
          <span className="font-medium text-text-secondary">Risk of Ruin Calculator</span>
          <a
            href="https://drawdown.trading/calculators/risk-of-ruin"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Full calculator on Drawdown →
          </a>
        </div>
        <RiskOfRuinSimulator />
      </div>
    </div>
  );
}
