import { Metadata } from "next";
import { getMetadata } from "@/lib/metadata";
import { HOW_TO_PAGES_SG } from "@/data/seo/sg-data";
import { RegionalHowToIndex } from "@/components/seo/RegionalHowToIndex";

export const metadata: Metadata = getMetadata({
  title: "Trading How-To Guides Singapore | Drawdown",
  description: "Learn how to trade from Singapore. Step-by-step tutorials on MAS regulations, spread betting efficiency, and local session hours.",
  path: "/sg/how-to",
});

export default function SgHowToIndexPage() {
  return <RegionalHowToIndex region="sg" data={HOW_TO_PAGES_SG} />;
}
