import { Metadata } from "next";
import { getMetadata } from "@/lib/metadata";
import { RegionalLearnHub } from "@/components/seo/RegionalLearnHub";

export const metadata: Metadata = getMetadata({
  title: "Learn to Trade United States | Professional Trading Academy",
  description: "Master the financial markets in the United States with our structured, institutional-grade trading curriculum. Core modules tailored for CFTC/NFA compliant traders.",
  path: "/us/learn-to-trade",
});

export default function UsLearnHubPage() {
  return <RegionalLearnHub region="us" />;
}
