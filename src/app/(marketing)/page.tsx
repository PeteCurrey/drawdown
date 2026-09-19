import { Navigation } from "@/components/layout/Navigation";
import { HeroSection } from "@/components/home/HeroSection";
import { LiveDataStrip } from "@/components/home/LiveDataStrip";
import { FragmentedProblemSection } from "@/components/home/FragmentedProblemSection";
import { OperatingLoopSection } from "@/components/home/OperatingLoopSection";
import { RunMyTradeShowcase } from "@/components/home/RunMyTradeShowcase";
import { MarketIntelligenceSection } from "@/components/home/MarketIntelligenceSection";
import { MarketPulse } from "@/components/home/MarketPulse";
import { CurriculumSection } from "@/components/home/CurriculumSection";
import { ScrollQuoteSection } from "@/components/home/ScrollQuoteSection";
import { BrokerEcosystemSection } from "@/components/home/BrokerEcosystemSection";
import { PricingSection } from "@/components/home/PricingSection";
import { Footer } from "@/components/layout/Footer";
import { TrackPageView } from "@/components/admin/TrackPageView";
import JsonLd from "@/components/seo/JsonLd";
import type { Metadata } from "next";
import { createInternalSupabase } from "@/lib/supabase/server";

export const metadata: Metadata = {

  title: "Drawdown — A Trading Operating System for Serious Independent Traders",
  description:
    "Risk calculators, pre-trade analysis, AI-assisted journalling, and structured education — all in one platform. Start free. No card required.",
  alternates: { canonical: "https://drawdown.trading" },
  openGraph: {
    title: "Drawdown — A Trading Operating System for Serious Independent Traders",
    description:
      "Risk calculators, pre-trade analysis, AI-assisted journalling, and structured education — all in one platform. Start free.",
    url: "https://drawdown.trading",
    siteName: "Drawdown",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "https://drawdown.trading/og/default-og.png",
        width: 1200,
        height: 630,
        alt: "Drawdown — A Trading Operating System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Drawdown — A Trading Operating System for Serious Independent Traders",
    description:
      "Risk calculators, pre-trade analysis, AI-assisted journalling, and structured education. Start free.",
    images: ["https://drawdown.trading/og/default-og.png"],
    creator: "@drawdown_hq",
  },
};

export default async function Home() {
  const supabase = createInternalSupabase();

  let floorCap = 15;
  try {
    const { data } = await supabase
      .from('platform_settings')
      .select('setting_value')
      .eq('setting_key', 'floor_cap')
      .single();
    if (data?.setting_value) {
      floorCap = parseInt(data.setting_value as string, 10);
    }
  } catch {}

  let activeFloorSubs = 0;
  try {
    const { count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('subscription_tier', 'floor')
      .eq('subscription_status', 'active');
    activeFloorSubs = count || 0;
  } catch {}

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "var(--surface-base)", color: "var(--text-primary)" }}>
      <TrackPageView path="/" />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Drawdown Trading",
        "url": "https://drawdown.trading",
        "logo": "https://drawdown.trading/og/default-og.png",
        "description": "Phase-based trading education for independent traders. Structured curriculum, AI-powered tools and honest mentorship.",
        "founder": {
          "@type": "Person",
          "name": "Pete Currey",
          "jobTitle": "Founder",
          "url": "https://drawdown.trading/about"
        },
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Chesterfield",
          "addressRegion": "Derbyshire",
          "addressCountry": "GB"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer support",
          "email": "hello@drawdown.trading",
          "availableLanguage": "English"
        },
        "sameAs": [
          "https://twitter.com/drawdown_hq",
          "https://youtube.com/@drawdown"
        ]
      }} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Drawdown",
        "url": "https://drawdown.trading",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://drawdown.trading/blog?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      }} />
      
      {/* 1. Header */}
      <Navigation />

      {/* Main Content */}
      <main className="flex-grow pt-[58px]">
        {/* 1. Hero + Value Proposition */}
        <HeroSection />

        {/* 2. Consolidated Live Data Strip */}
        <LiveDataStrip />

        {/* 3. Live Market Briefing — news feed, economic calendar, top movers */}
        <MarketPulse />

        {/* 4. The Problem — Fragmented Workflow */}
        <FragmentedProblemSection />

        {/* 5. The Operating Loop */}
        <div id="operating-loop">
          <OperatingLoopSection />
        </div>

        {/* 6. Live Product Showcase: Plan My Trade */}
        <RunMyTradeShowcase />

        {/* 7. Market Intelligence Briefing */}
        <MarketIntelligenceSection />

        {/* 8. Curriculum — The 6 Phases */}
        <CurriculumSection />

        {/* 9. Founder Pull-Quote */}
        <ScrollQuoteSection />

        {/* 10. Broker & Tool Ecosystem */}
        <BrokerEcosystemSection />

        {/* 11. Pricing Tiers */}
        <PricingSection floorCap={floorCap} activeFloorSubs={activeFloorSubs} />
      </main>

      {/* 13. Footer */}
      <Footer />
    </div>
  );
}

