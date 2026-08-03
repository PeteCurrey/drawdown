import { Navigation } from "@/components/layout/Navigation";
import { HeroSection } from "@/components/home/HeroSection";
import { PriceTicker } from "@/components/home/PriceTicker";
import { ScrollQuoteSection } from "@/components/home/ScrollQuoteSection";
import { InstitutionalPulseSection } from "@/components/home/InstitutionalPulseSection";
import { CurriculumSection } from "@/components/home/CurriculumSection";
import { HorizontalScrollSection } from "@/components/home/HorizontalScrollSection";
import { BrokerSection } from "@/components/home/BrokerSection";
import { PricingSection } from "@/components/home/PricingSection";
import { Footer } from "@/components/layout/Footer";
import { TrackPageView } from "@/components/admin/TrackPageView";
import JsonLd from "@/components/seo/JsonLd";
import { createInternalSupabase } from "@/lib/supabase/server";

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
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "var(--paper-0)", color: "var(--ink-950)" }}>
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

      {/* 2. Hero + Ticker */}
      <main className="flex-grow pt-[58px]">
        <HeroSection />
        <PriceTicker />
        
        {/* 3. Positioning Statement ("No Lambos. No Beach Photos.") — hairline border system */}
        <section
          className="w-full py-24 md:py-32 border-b select-none"
          style={{ backgroundColor: "var(--paper-0)", borderColor: "var(--line-200)" }}
        >
          <div className="max-w-[1280px] mx-auto px-6 text-center">
            <div className="max-w-2xl mx-auto space-y-6">
              <span
                className="block text-[11px] font-mono uppercase tracking-[0.08em]"
                style={{ color: "var(--graphite-600)" }}
              >
                Platform integrity
              </span>
              <h2
                className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-tight tracking-[-0.02em] font-semibold"
                style={{ color: "var(--ink-950)" }}
              >
                No Lambos. No Beach Photos. <br />
                <span style={{ color: "var(--signal-navy)" }}>Just Data.</span>
              </h2>
              <div className="space-y-3 max-w-lg mx-auto">
                <p
                  className="text-[16px] leading-[1.6] font-sans"
                  style={{ color: "var(--graphite-600)" }}
                >
                  Trading is a business of probabilities, risk management, and emotional detachment. We don't sell dreams; we provide the data and the discipline to survive the markets.
                </p>
                <p
                  className="text-[12px] font-mono uppercase tracking-[0.08em]"
                  style={{ color: "var(--graphite-600)" }}
                >
                  Chesterfield, UK · Built for traders who value truth over hype
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Founder Quote Block */}
        <ScrollQuoteSection />

        {/* 5. Curriculum Overview */}
        <CurriculumSection />

        {/* 6. Capabilities Grid */}
        <HorizontalScrollSection />

        {/* 7. Order Flow Signals / Market Pulse (bug fixed, claim wording untouched) */}
        <InstitutionalPulseSection />

        {/* 8. Recommended Brokers */}
        <BrokerSection />

        {/* 9. Pricing Tiers */}
        <PricingSection floorCap={floorCap} activeFloorSubs={activeFloorSubs} />
      </main>

      {/* 10. Footer */}
      <Footer />
    </div>
  );
}
