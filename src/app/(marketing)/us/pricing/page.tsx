"use client";

import { RegionalProvider } from "@/components/layout/RegionalLayout";
import { RegionalPricingClient } from "@/components/pricing/RegionalPricingClient";
import { TrackPageView } from "@/components/admin/TrackPageView";

export default function UnitedStatesPricingPage() {
  return (
    <RegionalProvider region="us">
      <TrackPageView path="/us/pricing" />
      <RegionalPricingClient />
    </RegionalProvider>
  );
}
