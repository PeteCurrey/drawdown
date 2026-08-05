import type { Metadata } from "next";
import RoadmapClient from "./RoadmapClient";

export const metadata: Metadata = {
  title: "Product Roadmap | Drawdown",
  description: "Explore the system development roadmap of the Drawdown trading platform. Follow our progress on core education modules, next-generation AI trade journaling, risk calculators, and process-improvement capabilities.",
  alternates: {
    canonical: "https://drawdown.trading/roadmap",
  },
};

export default function Page() {
  return <RoadmapClient />;
}
