import { Suspense } from "react";
import { Metadata } from "next";
import { RiskOfRuinCalculatorClient } from "./RiskOfRuinCalculatorClient";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Risk of Ruin Calculator — Statistical Probability of Account Loss | Drawdown",
  description:
    "Calculate your exact statistical probability of ruin and drawdown distribution using the Ralph Vince & Perry Kaufman models. Win rate, R:R, and risk per trade analysis.",
  alternates: { canonical: "https://drawdown.trading/tools/risk-of-ruin-calculator" },
  openGraph: {
    title: "Risk of Ruin Calculator — Quantitative Survival Modeling",
    description: "Discover why even a 60% win rate strategy can lead to account ruin if position sizing exceeds statistical thresholds.",
    url: "https://drawdown.trading/tools/risk-of-ruin-calculator",
    type: "website",
  },
};

export default function RiskOfRuinCalculatorPage() {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Drawdown Risk of Ruin Calculator",
    "url": "https://drawdown.trading/tools/risk-of-ruin-calculator",
    "description": "Calculate statistical probability of account ruin over a finite trade sample based on win rate, risk per trade, and payoff ratio.",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "GBP",
    },
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <Suspense fallback={<div className="min-h-screen bg-[var(--surface-base)] pt-32 pb-24 text-center font-mono text-xs text-[var(--text-tertiary)]">Loading Risk of Ruin Calculator...</div>}>
        <RiskOfRuinCalculatorClient />
      </Suspense>
    </>
  );
}
