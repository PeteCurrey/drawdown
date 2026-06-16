import { Metadata } from "next";
import { getMetadata } from "@/lib/metadata";
import { COMPARE_PAGES_AU } from "@/data/seo/compare-au";
import { RegionalCompareIndex } from "@/components/seo/RegionalCompareIndex";

export const metadata: Metadata = getMetadata({
  title: "Broker & Platform Comparisons Australia | Drawdown",
  description: "Side-by-side technical comparisons of top trading platforms, CFD brokers, and tools for Australian traders. Tailored for ASIC compliance.",
  path: "/au/compare",
});

export default function AuCompareIndexPage() {
  return <RegionalCompareIndex region="au" data={COMPARE_PAGES_AU} />;
}
