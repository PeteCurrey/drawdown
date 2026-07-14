import { Metadata } from "next";
import { getMetadata } from "@/lib/metadata";
import { RegionalLearnHub } from "@/components/seo/RegionalLearnHub";

export const metadata: Metadata = getMetadata({
  title: "Learn to Trade Singapore | Professional Trading Academy",
  description: "Master the financial markets in Singapore with our structured, institutional-grade trading curriculum. Core modules tailored for MAS compliant traders.",
  path: "/sg/learn-to-trade",
});

export default function SgLearnHubPage() {
  return <RegionalLearnHub region="sg" />;
}
