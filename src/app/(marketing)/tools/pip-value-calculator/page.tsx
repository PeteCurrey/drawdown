import { Suspense } from "react";
import { Metadata } from "next";
import { PipValueCalculatorClient } from "./PipValueCalculatorClient";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Pip Value Calculator — Exact Pip & Point Values Across Currency Pairs | Drawdown",
  description:
    "Free pip value calculator. Calculate the exact monetary value of 1 pip, 10 pips, and 50 pips across Forex pairs, Gold, Oil, Indices, and Crypto in GBP, USD, EUR, AUD, and CAD.",
  alternates: { canonical: "https://drawdown.trading/tools/pip-value-calculator" },
  openGraph: {
    title: "Pip Value Calculator — Drawdown Trading",
    description: "Instant, transparent pip and point value calculation across standard, mini, and micro lots.",
    url: "https://drawdown.trading/tools/pip-value-calculator",
    type: "website",
  },
};

export default function PipValueCalculatorPage() {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Drawdown Pip Value Calculator",
    "url": "https://drawdown.trading/tools/pip-value-calculator",
    "description": "Calculate exact pip and point monetary values across 20+ markets and 5 account currencies.",
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
      <Suspense fallback={<div className="min-h-screen bg-[var(--surface-base)] pt-32 pb-24 text-center font-mono text-xs text-[var(--text-tertiary)]">Loading Pip Calculator...</div>}>
        <PipValueCalculatorClient />
      </Suspense>
    </>
  );
}
