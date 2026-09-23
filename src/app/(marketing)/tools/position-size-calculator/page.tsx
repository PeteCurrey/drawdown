import { Suspense } from "react";
import { Metadata } from "next";
import { PositionSizeCalculatorClient } from "./PositionSizeCalculatorClient";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Position Size Calculator — Exact Lot Sizing Across FX, Indices, Gold & Crypto | Drawdown",
  description:
    "Free institutional-grade position size calculator. Calculate exact lot sizing, cash risk, pip values, and drawdown impact for EUR/USD, Gold, S&P 500, Bitcoin, and 15+ markets.",
  alternates: { canonical: "https://drawdown.trading/tools/position-size-calculator" },
  openGraph: {
    title: "Position Size Calculator — Drawdown Trading",
    description: "Determine exact lot sizes, risk thresholds, and capital exposure in real-time. Transparent mathematical calculations.",
    url: "https://drawdown.trading/tools/position-size-calculator",
    type: "website",
  },
};

export default function PositionSizeCalculatorPage() {
  const faqs = [
    {
      question: "Why should I size trades by percentage risk instead of fixed lots?",
      answer:
        "Fixed lot sizing causes volatile risk outcomes: a 40-pip stop on EUR/USD risks double what a 20-pip stop does. Sizing dynamically by percentage ensures every trade risks the exact same monetary fraction of capital regardless of market volatility.",
    },
    {
      question: "How does the calculator handle Gold (XAU/USD) vs Forex pairs?",
      answer:
        "Standard Forex lots represent 100,000 units where 1 pip = 0.0001 (or 0.01 on JPY). Gold CFDs typically represent 100 troy ounces where a $1.00 move equals $100 per standard lot. The engine automatically adjusts contract multipliers and tick dimensions.",
    },
    {
      question: "What is the recommended risk per trade for funded challenges?",
      answer:
        "Most prop firm evaluation rules cap maximum daily drawdown at 4-5% and overall trailing drawdown at 8-10%. To survive an inevitable 5-loss streak without triggering a violation, professional traders restrict risk to 0.5% – 1.0% per trade.",
    },
  ];

  const jsonLdData = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Drawdown Position Size Calculator",
      "url": "https://drawdown.trading/tools/position-size-calculator",
      "description": "Calculate exact lot sizes and cash exposure across Forex, Commodities, Indices, and Crypto based on account balance and risk percentage.",
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
      <Suspense fallback={<div className="min-h-screen bg-[var(--surface-base)] pt-32 pb-24 text-center font-mono text-xs text-[var(--text-tertiary)]">Loading Position Calculator...</div>}>
        <PositionSizeCalculatorClient />
      </Suspense>
    </>
  );
}
