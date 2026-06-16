import { Metadata } from "next";
import { getMetadata } from "@/lib/metadata";
import { COMPARE_PAGES_SG } from "@/data/seo/sg-data";
import { RegionalCompareIndex } from "@/components/seo/RegionalCompareIndex";

export const metadata: Metadata = getMetadata({
  title: "Broker & Platform Comparisons Singapore | Drawdown",
  description: "Side-by-side technical comparisons of top trading platforms and MAS-regulated brokers for Singapore traders.",
  path: "/sg/compare",
});

export default function SgCompareIndexPage() {
  return <RegionalCompareIndex region="sg" data={COMPARE_PAGES_SG} />;
}
