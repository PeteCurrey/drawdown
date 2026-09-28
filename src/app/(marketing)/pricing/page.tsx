import type { Metadata } from "next";
import { Suspense } from "react";
import PricingPage from "./PricingClient";
import JsonLd from "@/components/seo/JsonLd";
import { createInternalSupabase } from "@/lib/supabase/server";
import { PRICING_FAQS } from "@/data/pricing";
import { getMetadata } from "@/lib/metadata";

export const metadata: Metadata = getMetadata({
  title: "Avorria Memberships, Courses & Trading Manuals",
  description:
    "Compare Avorria Free, Foundation, Edge and Floor memberships. Permanent trading-manual downloads and the six-week Avorria Institutional Accelerator. Start free — no card required.",
  path: "/pricing",
  hasRegionalVariants: true,
});

export default async function Page() {
  const supabase = createInternalSupabase();

  // Floor capacity — reads from platform_settings if present, falls back to default
  let floorCap = 20;
  try {
    const { data } = await supabase
      .from("platform_settings")
      .select("setting_value")
      .eq("setting_key", "floor_cap")
      .single();
    if (data?.setting_value) {
      floorCap = parseInt(data.setting_value as string, 10);
    }
  } catch (_) {}

  let activeFloorSubs = 0;
  try {
    const { count } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("subscription_tier", "floor")
      .eq("subscription_status", "active");
    activeFloorSubs = count || 0;
  } catch (_) {}

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

  // Product structured data — active products only, no invented values
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
          name: "Avorria Free Membership",
          description:
            "Free access to Phase 1 curriculum, risk calculators and the manual trade journal. No card required.",
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
          name: "Avorria Foundation Membership",
          description:
            "Foundation curriculum, risk framework, Market Intelligence Hub and core analysis tools.",
          offers: [
            {
              "@type": "Offer",
              price: "49",
              priceCurrency: "GBP",
              billingDuration: "P1M",
              availability: "https://schema.org/InStock",
              url: "https://avorria.com/pricing",
            },
            {
              "@type": "Offer",
              price: "490",
              priceCurrency: "GBP",
              billingDuration: "P1Y",
              availability: "https://schema.org/InStock",
              url: "https://avorria.com/pricing",
            },
          ],
        },
      },
      {
        "@type": "ListItem",
        position: 3,
        item: {
          "@type": "Product",
          name: "Avorria Edge Membership",
          description:
            "Advanced curriculum, Investment Centre, AI journal review, strategy backtester and advanced briefings.",
          offers: [
            {
              "@type": "Offer",
              price: "99",
              priceCurrency: "GBP",
              billingDuration: "P1M",
              availability: "https://schema.org/InStock",
              url: "https://avorria.com/pricing",
            },
            {
              "@type": "Offer",
              price: "990",
              priceCurrency: "GBP",
              billingDuration: "P1Y",
              availability: "https://schema.org/InStock",
              url: "https://avorria.com/pricing",
            },
          ],
        },
      },
      {
        "@type": "ListItem",
        position: 4,
        item: {
          "@type": "Product",
          name: "Avorria Floor Membership",
          description:
            "Full released platform with Investment Centre, private community channel and defined founder-led process reviews. Capped at 20 members.",
          offers: {
            "@type": "Offer",
            price: "299",
            priceCurrency: "GBP",
            billingDuration: "P1M",
            availability:
              activeFloorSubs >= floorCap
                ? "https://schema.org/SoldOut"
                : "https://schema.org/InStock",
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
        <PricingPage floorCap={floorCap} activeFloorSubs={activeFloorSubs} />
      </Suspense>
    </>
  );
}
