import type { Metadata } from "next";
import { HongKongPricingClient } from "./client";

const SITE_URL = "https://drawdown.trading";

export const metadata: Metadata = {
  title: "Drawdown Memberships — Hong Kong Pricing | Drawdown",
  description: "Compare Drawdown Free, Foundation, Edge and Floor memberships. Pricing shown in HKD for Hong Kong traders.",
  alternates: {
    canonical: `${SITE_URL}/hk/pricing`,
    languages: {
      "en-GB": `${SITE_URL}/pricing`,
      "en-US": `${SITE_URL}/us/pricing`,
      "en-HK": `${SITE_URL}/hk/pricing`,
      "en-SG": `${SITE_URL}/sg/pricing`,
      "x-default": `${SITE_URL}/pricing`,
    },
  },
};

export default function HongKongPricingPage() {
  return <HongKongPricingClient />;
}
