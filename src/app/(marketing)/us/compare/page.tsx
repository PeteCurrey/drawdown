import { Metadata } from "next";
import { getMetadata } from "@/lib/metadata";
import { COMPARE_PAGES_US } from "@/data/seo/compare-us";
import { RegionalCompareIndex } from "@/components/seo/RegionalCompareIndex";

export const metadata: Metadata = getMetadata({
  title: "Broker & Platform Comparisons US | Drawdown",
  description: "Side-by-side technical comparisons of top trading platforms and CFTC/NFA regulated brokers for American traders.",
  path: "/us/compare",
});

export default function UsCompareIndexPage() {
  return <RegionalCompareIndex region="us" data={COMPARE_PAGES_US} />;
}
