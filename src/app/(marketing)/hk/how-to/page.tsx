import { Metadata } from "next";
import { getMetadata } from "@/lib/metadata";
import { HOW_TO_PAGES_HK } from "@/data/seo/hk-data";
import { RegionalHowToIndex } from "@/components/seo/RegionalHowToIndex";

export const metadata: Metadata = getMetadata({
  title: "Trading How-To Guides Hong Kong | Drawdown",
  description: "Learn how to trade global markets from Hong Kong. Step-by-step tutorials on SFC compliance, broker selection, and tax-efficient trading.",
  path: "/hk/how-to",
});

export default function HkHowToIndexPage() {
  return <RegionalHowToIndex region="hk" data={HOW_TO_PAGES_HK} />;
}
