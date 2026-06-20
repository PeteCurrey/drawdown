import { Navigation } from "@/components/layout/Navigation";
import { HeroSection } from "@/components/home/HeroSection";
import { PriceTicker } from "@/components/home/PriceTicker";
import { StatsBar } from "@/components/home/StatsBar";
import { DataSourceStrip } from "@/components/home/DataSourceStrip";
import { ScrollQuoteSection } from "@/components/home/ScrollQuoteSection";
import { LiveNewsSection } from "@/components/home/LiveNewsSection";
import { GlobalFluxSection } from "@/components/home/GlobalFluxSection";
import { InstitutionalPulseSection } from "@/components/home/InstitutionalPulseSection";
import { InstitutionalConsensusSection } from "@/components/home/InstitutionalConsensusSection";
import { AIToolsSection } from "@/components/home/AIToolsSection";
import { TradingViewSection } from "@/components/homepage/TradingViewSection";
import { CurriculumSection } from "@/components/home/CurriculumSection";
import { HorizontalScrollSection } from "@/components/home/HorizontalScrollSection";
import { BrokerSection } from "@/components/home/BrokerSection";
import { PricingSection } from "@/components/home/PricingSection";
import { Footer } from "@/components/layout/Footer";
import { FadeInSection } from "@/components/animations/FadeInSection";
import { TrackPageView } from "@/components/admin/TrackPageView";
import { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: 'Drawdown — Learn to Trade Properly | UK Trading Education',
  description: 'Phase-based trading education for UK traders. Structured curriculum, AI-powered tools, honest mentorship. Start free — no card required.',
  openGraph: {
    title: 'Drawdown — Learn to Trade Properly',
    description: 'Phase-based trading education for UK traders. No gurus. No hype. Just edge.',
    url: 'https://drawdown.trading',
  },
  alternates: {
    canonical: 'https://drawdown.trading',
  }
}

export default function Home() {
  return (
    <div className="flex flex-col">
      <TrackPageView path="/" />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Drawdown Trading",
        "url": "https://drawdown.trading",
        "logo": "https://drawdown.trading/og/default-og.png",
        "description": "Phase-based trading education for UK traders. Structured curriculum, AI-powered tools and honest mentorship.",
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
          "https://twitter.com/drawdowntrading",
          "https://youtube.com/@drawdowntrading"
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
      
      {/* 1. Above fold components (not animated by FadeInSection) */}
      <Navigation />
      <HeroSection />
      <PriceTicker />

      {/* 2. Below fold components with staggered FadeInSection triggers */}
      <FadeInSection delay={0}>
        <StatsBar />
      </FadeInSection>

      <FadeInSection delay={0.1}>
        <DataSourceStrip />
      </FadeInSection>

      <ScrollQuoteSection />

      <FadeInSection delay={0.2}>
        <LiveNewsSection />
      </FadeInSection>

      <FadeInSection delay={0}>
        <GlobalFluxSection />
      </FadeInSection>

      <FadeInSection delay={0.1}>
        <InstitutionalPulseSection />
      </FadeInSection>

      <FadeInSection delay={0.2}>
        <InstitutionalConsensusSection />
      </FadeInSection>

      <FadeInSection delay={0}>
        <AIToolsSection />
      </FadeInSection>

      <FadeInSection delay={0.1}>
        <TradingViewSection />
      </FadeInSection>

      <FadeInSection delay={0.2}>
        <CurriculumSection />
      </FadeInSection>

      <FadeInSection delay={0.2}>
        <HorizontalScrollSection />
      </FadeInSection>

      <FadeInSection delay={0}>
        <BrokerSection />
      </FadeInSection>

      <FadeInSection delay={0.1}>
        <PricingSection />
      </FadeInSection>

      <FadeInSection delay={0.2}>
        <Footer />
      </FadeInSection>
    </div>
  );
}
