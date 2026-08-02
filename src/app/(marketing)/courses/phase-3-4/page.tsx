import { Metadata } from "next";
import { PhaseGroupLandingPageClient } from "@/components/courses/PhaseGroupLandingPageClient";
import { getMetadata } from "@/lib/metadata";

export const metadata: Metadata = getMetadata({
  title: "Phases 3–4: Edge & Risk Management | Strategist & Risk Manager",
  description: "Build a mechanical trading playbook, statistical backtest edge, and Kelly position sizing formulas in Phases 3 & 4 of Drawdown's curriculum.",
  path: "/courses/phase-3-4",
  hasRegionalVariants: true,
});

export default function Phase3To4Page() {
  return <PhaseGroupLandingPageClient slug="phase-3-4" />;
}
