import { Metadata } from "next";
import { getMetadata } from "@/lib/metadata";
import { HOW_TO_PAGES_US } from "@/data/seo/how-to-us";
import { RegionalHowToIndex } from "@/components/seo/RegionalHowToIndex";

export const metadata: Metadata = getMetadata({
  title: "Trading How-To Guides US | Drawdown",
  description: "Learn how to trade in the United States. Step-by-step tutorials on the PDT rule, tax optimization, and margin accounts.",
  path: "/us/how-to",
});

export default function UsHowToIndexPage() {
  return <RegionalHowToIndex region="us" data={HOW_TO_PAGES_US} />;
}
