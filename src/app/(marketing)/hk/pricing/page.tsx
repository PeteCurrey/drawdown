"use client";

import { RegionalProvider } from "@/components/layout/RegionalLayout";
import { RegionalPricingClient } from "@/components/pricing/RegionalPricingClient";
import { TrackPageView } from "@/components/admin/TrackPageView";

export default function HongKongPricingPage() {
  return (
    <RegionalProvider region="hk">
      <TrackPageView path="/hk/pricing" />
      <RegionalPricingClient />
    </RegionalProvider>
  );
}
