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
  const faqs = [
    {
      question: "Can a profitable strategy have a 100% risk of ruin?",
      answer:
        "Yes. If you have a 60% win rate and 1:1 reward-to-risk, you possess a solid edge. However, if you risk 10% per trade and can only tolerate a 20% drawdown, two consecutive losses will blow the account. The probability of two consecutive losses over 100 trades is virtually guaranteed (99.8%).",
    },
    {
      question: "How do prop firms exploit this math?",
      answer:
        "Prop firms cap maximum drawdown at 8–10% and demand a 10% profit target within tight timelines. This forces traders to risk 1.5–2% per trade, pushing their probability of ruin above 60% even if their strategy is genuinely profitable.",
    },
  ];

  const jsonLdData = [
    {
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
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map((f) => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.answer,
        },
      })),
    },
  ];

  return (
    <>
      <JsonLd data={jsonLdData} />
      <Suspense fallback={<div className="min-h-screen bg-[var(--surface-base)] pt-32 pb-24 text-center font-mono text-xs text-[var(--text-tertiary)]">Loading Risk of Ruin Calculator...</div>}>
        <RiskOfRuinCalculatorClient />
      </Suspense>
    </>
  );
}
