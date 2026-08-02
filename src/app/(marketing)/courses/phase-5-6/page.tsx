import { Metadata } from "next";
import { PhaseGroupLandingPageClient } from "@/components/courses/PhaseGroupLandingPageClient";
import { getMetadata } from "@/lib/metadata";

export const metadata: Metadata = getMetadata({
  title: "Phases 5–6: Mastery & Scale | Mind Over Market & The Edge",
  description: "Conquer trading psychology, master footprint delta order flow, and automate TradingView webhooks into prop firm funded accounts.",
  path: "/courses/phase-5-6",
  hasRegionalVariants: true,
});

export default function Phase5To6Page() {
  return <PhaseGroupLandingPageClient slug="phase-5-6" />;
}
