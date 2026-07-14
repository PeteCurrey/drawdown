import type { Metadata } from "next";
import Link from "next/link";
import { SignalCentreMarketingClient } from "./SignalCentreMarketingClient";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Signal Centre | AI Consensus Trading Signals — Drawdown",
  description:
    "Three AI models — Claude, GPT-4o, and Grok — analyse live market data simultaneously and produce a single consensus score. Signal Centre: institutional-grade intelligence for serious traders. 7-day free trial, £39/mo.",
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
