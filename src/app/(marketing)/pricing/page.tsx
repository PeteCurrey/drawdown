import type { Metadata } from "next";
import { Suspense } from "react";
import PricingPage from "./PricingClient";
import JsonLd from "@/components/seo/JsonLd";
import { createInternalSupabase } from "@/lib/supabase/server";
import { PRICING_FAQS } from "@/data/pricing";
import { getMetadata } from "@/lib/metadata";

export const metadata: Metadata = getMetadata({
  title: "Avorria Core Membership — £24.99/month",
  description:
    "One subscription. Complete access to quantitative scanners, market intelligence, backtesting, AI trade journaling, and the complete trading curriculum.",
  path: "/pricing",
  hasRegionalVariants: true,
});

export default async function Page() {
  const supabase = createInternalSupabase();

  // Build FAQ structured data from the canonical FAQ list in pricing.ts
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PRICING_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  // Product structured data — Core Membership
  const productsStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Avorria Membership Plans",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "Product",
          name: "Avorria Free Access",
          description:
            "Free access to Phase 1 curriculum, basic risk calculators and manual trade journal. No card required.",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "GBP",
            availability: "https://schema.org/InStock",
            url: "https://avorria.com/pricing",
          },
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "Product",
          name: "Avorria Core Membership",
          description:
            "Complete core platform access: Quantitative Technical Scanner, Market Screener, Signal Centre, Investment Centre, AI Trade Journal, Strategy Backtester, and full curriculum.",
          offers: {
            "@type": "Offer",
            price: "24.99",
            priceCurrency: "GBP",
            billingDuration: "P1M",
            availability: "https://schema.org/InStock",
            url: "https://avorria.com/pricing",
          },
        },
      },
    ],
  };

  return (
    <>
      <JsonLd data={faqStructuredData} />
      <JsonLd data={productsStructuredData} />
      <Suspense fallback={<div className="min-h-screen bg-[#FAFAFA]" />}>
        <PricingPage />
      </Suspense>
    </>
  );
}
