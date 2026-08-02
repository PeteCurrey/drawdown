import { Metadata } from "next";
import { PhaseGroupLandingPageClient } from "@/components/courses/PhaseGroupLandingPageClient";
import { getMetadata } from "@/lib/metadata";

export const metadata: Metadata = getMetadata({
  title: "Phases 1–2: Foundation Trading Curriculum | Ground Zero & Chart Reader",
  description: "Master naked price action, market structure, risk math and UK spread betting mechanics in Phases 1 & 2 of Drawdown's trading curriculum.",
  path: "/courses/phase-1-2",
  hasRegionalVariants: true,
});

export default function Phase1To2Page() {
  return <PhaseGroupLandingPageClient slug="phase-1-2" />;
}
