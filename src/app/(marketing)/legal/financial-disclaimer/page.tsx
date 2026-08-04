import { getMetadata } from "@/lib/metadata";
import { Suspense } from "react";
import { FinancialDisclaimerClient } from "./FinancialDisclaimerClient";

export const metadata = getMetadata({
  title: "Legal, Financial & Tax Disclaimer | Drawdown",
  description: "Comprehensive multi-region legal, financial non-advisory perimeter, trade signals disclosure, and regional tax disclaimers (UK, US, AU, SG, HK, EU).",
});

export default function FinancialDisclaimerPage() {
  return (
    <Suspense fallback={
      <div className="pt-32 pb-24 text-center min-h-screen font-mono text-xs uppercase" style={{ backgroundColor: "var(--paper-0)", color: "var(--graphite-600)" }}>
        Loading Legal &amp; Tax Disclaimers...
      </div>
    }>
      <FinancialDisclaimerClient />
    </Suspense>
  );
}
