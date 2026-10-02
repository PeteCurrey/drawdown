import { Suspense } from "react";
import { Metadata } from "next";
import { DrawdownRecoveryCalculatorClient } from "./DrawdownRecoveryCalculatorClient";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Drawdown Recovery Calculator — The Asymmetry of Trading Losses | Drawdown",
  description:
    "Interactive drawdown recovery calculator. Calculate the exact percentage gain and trades required to recover from trading losses. See why a 50% loss requires 100% gain to break even.",
  alternates: { canonical: "https://drawdown.trading/tools/drawdown-recovery-calculator" },
  openGraph: {
    title: "Drawdown Recovery Calculator — The Mathematics of Capital Preservation",
    description: "Calculate required break-even percentage gain and estimated recovery trades from equity drawdowns.",
    url: "https://drawdown.trading/tools/drawdown-recovery-calculator",
    type: "website",
  },
};

export default function DrawdownRecoveryCalculatorPage() {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Drawdown Recovery Calculator",
    "url": "https://drawdown.trading/tools/drawdown-recovery-calculator",
    "description": "Calculate required gain percentage and expectancy trades to recover from any trading account drawdown.",
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
      <Suspense fallback={<div className="min-h-screen bg-[var(--surface-base)] pt-32 pb-24 text-center font-mono text-xs text-[var(--text-tertiary)]">Loading Drawdown Calculator...</div>}>
        <DrawdownRecoveryCalculatorClient />
      </Suspense>
    </>
  );
}
