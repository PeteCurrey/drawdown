import type { Metadata } from "next";
import RoadmapClient from "./RoadmapClient";

export const metadata: Metadata = {
  title: "Product Roadmap | Avorria",
  description: "Explore the system development roadmap of the Avorria trading platform. Follow our progress on core education modules, next-generation AI trade journaling, risk calculators, and process-improvement capabilities.",
  alternates: {
    canonical: "https://avorria.com/roadmap",
  },
};

export default function Page() {
  return <RoadmapClient />;
}
