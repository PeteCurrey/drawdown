import type { Metadata } from "next";
import { PositionSizeCalculator } from "@/components/calculators/PositionSizeCalculator";

export const metadata: Metadata = {
  title: "Position Size Calculator | Drawdown",
  robots: { index: false, follow: false },
};

/**
 * Minimal embed surface for the Position Size Calculator.
 * Intended for use inside <iframe> on third-party publisher sites.
 * No site navigation, no marketing copy, no competing SEO content.
 */
export default function EmbedPositionSizePage() {
  return (
    <div className="min-h-screen bg-background-primary text-text-primary">
      <div className="w-full max-w-2xl mx-auto px-4 py-6">
        {/* Attribution link — required by embed terms */}
        <div className="mb-4 flex items-center justify-between text-xs text-text-tertiary">
          <span className="font-medium text-text-secondary">Position Size Calculator</span>
          <a
            href="https://drawdown.trading/calculators/position-size"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Full calculator on Drawdown →
          </a>
        </div>
        <PositionSizeCalculator />
      </div>
    </div>
  );
}
