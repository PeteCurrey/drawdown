import type { Metadata } from "next";
import FundedPathwayClient from "./FundedPathwayClient";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { getMetadata } from "@/lib/metadata";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = getMetadata({
  title: "Funded Account Pathway | Earn Institutional Capital Without Hype",
  description: "Stop risking your own capital. The Drawdown funded pathway guides you from Phase 1 (foundations) to prop firm evaluation — with risk management tools built in at every step.",
  path: "/funded-pathway",
});

export default function Page() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://drawdown.trading" },
        { name: "Funded Pathway", url: "https://drawdown.trading/funded-pathway" }
      ]} />
      <FundedPathwayClient />
    </>
  );
}
