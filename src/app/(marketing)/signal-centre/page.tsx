import type { Metadata } from "next";
import Link from "next/link";
import { SignalCentreMarketingClient } from "./SignalCentreMarketingClient";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Signal Centre | AI Consensus Trading Signals — Drawdown",
  description: "Three AI models analyse live market data simultaneously and output a single consensus score. Institutional-grade intelligence for serious traders.",
  alternates: { canonical: "https://drawdown.trading/signal-centre" },
  openGraph: {
    title: "Signal Centre — AI Consensus Trading Signals",
    description:
      "Claude. GPT-4o. Grok. One consensus score. Every signal explained.",
    url: "https://drawdown.trading/signal-centre",
    type: "website",
  },
};

export default function SignalCentrePage() {
  return <SignalCentreMarketingClient />;
}
