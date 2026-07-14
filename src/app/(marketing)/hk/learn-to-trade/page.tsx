import { Metadata } from "next";
import { getMetadata } from "@/lib/metadata";
import { RegionalLearnHub } from "@/components/seo/RegionalLearnHub";

export const metadata: Metadata = getMetadata({
  title: "Learn to Trade Hong Kong | Professional Trading Academy",
  description: "Master the financial markets in Hong Kong with our structured, institutional-grade trading curriculum. Core modules tailored for SFC compliant traders.",
  path: "/hk/learn-to-trade",
});

export default function HkLearnHubPage() {
  return <RegionalLearnHub region="hk" />;
}
