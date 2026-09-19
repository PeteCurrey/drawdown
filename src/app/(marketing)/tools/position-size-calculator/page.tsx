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
  const jsonLdData = {
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
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <Suspense fallback={<div className="min-h-screen bg-[var(--surface-base)] pt-32 pb-24 text-center font-mono text-xs text-[var(--text-tertiary)]">Loading Position Calculator...</div>}>
        <PositionSizeCalculatorClient />
      </Suspense>
    </>
  );
}
