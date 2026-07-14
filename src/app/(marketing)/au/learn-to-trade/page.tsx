import { Metadata } from "next";
import { getMetadata } from "@/lib/metadata";
import { RegionalLearnHub } from "@/components/seo/RegionalLearnHub";

export const metadata: Metadata = getMetadata({
  title: "Learn to Trade Australia | Professional Trading Academy",
  description: "Master the financial markets in Australia with our structured, institutional-grade trading curriculum. Core modules tailored for ASIC compliant traders.",
  path: "/au/learn-to-trade",
});

export default function AuLearnHubPage() {
  return <RegionalLearnHub region="au" />;
}
