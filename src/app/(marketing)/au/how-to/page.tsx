import { Metadata } from "next";
import { getMetadata } from "@/lib/metadata";
import { HOW_TO_PAGES_AU } from "@/data/seo/how-to-au";
import { RegionalHowToIndex } from "@/components/seo/RegionalHowToIndex";

export const metadata: Metadata = getMetadata({
  title: "Trading How-To Guides Australia | Drawdown",
  description: "Learn how to trade indices, forex, commodities, and crypto in Australia. Step-by-step tutorials on leverage, account setup, and charting.",
  path: "/au/how-to",
});

export default function AuHowToIndexPage() {
  return <RegionalHowToIndex region="au" data={HOW_TO_PAGES_AU} />;
}
