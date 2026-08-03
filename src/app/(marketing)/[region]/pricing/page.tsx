"use client";

import { RegionalProvider } from "@/components/layout/RegionalLayout";
import { RegionalPricingClient } from "@/components/pricing/RegionalPricingClient";
import { TrackPageView } from "@/components/admin/TrackPageView";
import { useParams } from "next/navigation";
import { Region } from "@/lib/seo/hreflang";

export default function RegionalPricingPage() {
  const params = useParams();
  const region = (params.region as Region) || "uk";

  return (
    <RegionalProvider region={region}>
      <TrackPageView path={`/${region}/pricing`} />
      <RegionalPricingClient />
    </RegionalProvider>
  );
}
