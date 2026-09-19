import { Metadata } from "next";
import { ForexMarketHoursClient } from "./ForexMarketHoursClient";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Forex Market Hours & Session Clock — Live Global Overlap Radar | Drawdown",
  description:
    "Live Forex market hours clock. Track Sydney, Tokyo, London, and New York sessions in real-time with automatic local timezone conversion, liquidity overlaps, and open/close countdowns.",
  alternates: { canonical: "https://drawdown.trading/tools/forex-market-hours" },
  openGraph: {
    title: "Forex Market Hours Clock & Global Session Radar — Drawdown Trading",
    description: "Live 24-hour visual market sessions clock with London/New York overlap highlighting.",
    url: "https://drawdown.trading/tools/forex-market-hours",
    type: "website",
  },
};

export default function ForexMarketHoursPage() {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Drawdown Forex Market Hours Clock",
    "url": "https://drawdown.trading/tools/forex-market-hours",
    "description": "Real-time interactive session clock for global financial markets, tracking Sydney, Tokyo, London, and New York trading sessions.",
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
      <ForexMarketHoursClient />
    </>
  );
}
