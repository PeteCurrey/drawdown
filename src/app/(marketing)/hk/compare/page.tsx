import { Metadata } from "next";
import { getMetadata } from "@/lib/metadata";
import { COMPARE_PAGES_HK } from "@/data/seo/hk-data";
import { RegionalCompareIndex } from "@/components/seo/RegionalCompareIndex";

export const metadata: Metadata = getMetadata({
  title: "Broker & Platform Comparisons Hong Kong | Drawdown",
  description: "Side-by-side technical comparisons of top trading platforms and SFC-regulated CFD brokers for Hong Kong traders.",
  path: "/hk/compare",
});

export default function HkCompareIndexPage() {
  return <RegionalCompareIndex region="hk" data={COMPARE_PAGES_HK} />;
}
