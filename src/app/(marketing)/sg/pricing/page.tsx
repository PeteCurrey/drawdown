"use client";

import { RegionalProvider } from "@/components/layout/RegionalLayout";
import { RegionalPricingClient } from "@/components/pricing/RegionalPricingClient";
import { TrackPageView } from "@/components/admin/TrackPageView";

export default function SingaporePricingPage() {
  return (
    <RegionalProvider region="sg">
      <TrackPageView path="/sg/pricing" />
      <RegionalPricingClient />
    </RegionalProvider>
  );
}
