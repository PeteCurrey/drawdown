import type { Metadata } from "next";
import FundedPathwayClient from "./FundedPathwayClient";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Funded Account Pathway | Earn Institutional Capital",
  description: "Stop risking your own capital. Our anti-hype funded pathway guides you through Phase 4 (Risk Manager) to applying with trusted prop firm challenges.",
  alternates: { canonical: "https://drawdown.trading/funded-pathway" }
};

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
