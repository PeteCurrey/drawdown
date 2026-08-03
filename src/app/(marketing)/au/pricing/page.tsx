"use client";

import { RegionalProvider } from "@/components/layout/RegionalLayout";
import { RegionalPricingClient } from "@/components/pricing/RegionalPricingClient";
import { TrackPageView } from "@/components/admin/TrackPageView";

export default function AustralianPricingPage() {
  return (
    <RegionalProvider region="au">
      <TrackPageView path="/au/pricing" />
      <RegionalPricingClient />
    </RegionalProvider>
  );
}
