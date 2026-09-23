import type { Metadata } from "next";
import { AustralianPricingClient } from "./client";

const SITE_URL = "https://drawdown.trading";

export const metadata: Metadata = {
  title: "Drawdown Memberships — Australia Pricing | Drawdown",
  description: "Compare Drawdown Free, Foundation, Edge and Floor memberships. Pricing shown in AUD for Australian traders.",
  alternates: {
    canonical: `${SITE_URL}/au/pricing`,
    languages: {
      "en-GB": `${SITE_URL}/pricing`,
      "en-AU": `${SITE_URL}/au/pricing`,
      "en-US": `${SITE_URL}/us/pricing`,
      "en-HK": `${SITE_URL}/hk/pricing`,
      "en-SG": `${SITE_URL}/sg/pricing`,
      "x-default": `${SITE_URL}/pricing`,
    },
  },
};

export default function AustralianPricingPage() {
  return <AustralianPricingClient />;
}
