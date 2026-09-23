import type { Metadata } from "next";
import { DrawdownRecoveryCalculator } from "@/components/calculators/DrawdownRecoveryCalculator";

export const metadata: Metadata = {
  title: "Drawdown Recovery Calculator | Drawdown",
  robots: { index: false, follow: false },
};

/**
 * Minimal embed surface for the Drawdown Recovery Calculator.
 * Intended for use inside <iframe> on third-party publisher sites.
 * No site navigation, no marketing copy, no competing SEO content.
 */
export default function EmbedDrawdownRecoveryPage() {
  return (
    <div className="min-h-screen bg-background-primary text-text-primary">
      <div className="w-full max-w-2xl mx-auto px-4 py-6">
        <div className="mb-4 flex items-center justify-between text-xs text-text-tertiary">
          <span className="font-medium text-text-secondary">Drawdown Recovery Calculator</span>
          <a
            href="https://drawdown.trading/calculators/drawdown-recovery"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Full calculator on Drawdown →
          </a>
        </div>
        <DrawdownRecoveryCalculator />
      </div>
    </div>
  );
}
