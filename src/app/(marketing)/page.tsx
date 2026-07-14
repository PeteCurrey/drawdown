import { Navigation } from "@/components/layout/Navigation";
import { HeroSection } from "@/components/home/HeroSection";
import { PriceTicker } from "@/components/home/PriceTicker";
import { StatsBar } from "@/components/home/StatsBar";
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
import { GSAPReveal } from "@/components/animations/GSAPReveal";
import { phases } from "@/data/courses";
import JsonLd from "@/components/seo/JsonLd";

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
      
      <Navigation />
      <HeroSection />
      <PriceTicker />
      
      {/* 1.5: No Lambos Section (Updated Stats) */}
      <GSAPReveal direction="up">
        <section className="py-24 md:py-32 bg-background-primary border-t border-border-slate overflow-hidden">
          <div className="container mx-auto px-6 text-center lg:text-left">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-8">
                <span className="text-[10px] font-mono tracking-widest uppercase text-text-tertiary">
                  PLATFORM INTEGRITY
                </span>
                <h2 className="  font-display font-bold uppercase leading-tight">
                  No Lambos. <br /> No Beach Photos. <br /> <span className="text-accent underline decoration-accent/30 underline-offset-8">Just Data.</span>
                </h2>
                <div className="space-y-4 max-w-xl mx-auto lg:mx-0">
                  <p className="text-lg text-text-secondary leading-relaxed">
                    Trading is a business of probabilities, risk management, and emotional detachment. We don't sell dreams; we provide the data and the discipline to survive the markets.
                  </p>
                  <p className="text-sm text-text-tertiary font-mono uppercase tracking-widest leading-relaxed">
                    Established in Chesterfield, UK. Built for traders who value truth over hype.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-8 py-10 border-y border-border-slate/50">
                <div className="flex flex-col">
                  <span className="text-3xl font-display font-black text-accent">{phases.filter(p => p.status === 'available').length}</span>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-text-tertiary">Phases</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-display font-black text-accent">{phases.filter(p => p.status === 'available').reduce((acc, curr) => acc + curr.modules_count, 0)}</span>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-text-tertiary">Modules</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-display font-black text-accent">5</span>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-text-tertiary">AI Tools</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-display font-black text-accent">LIVE</span>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-text-tertiary">Market Data</span>
                </div>
                <div className="flex flex-col col-span-2 md:col-span-1 lg:col-span-2">
                  <span className="text-3xl font-display font-black text-accent">100%</span>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-text-tertiary">UK Focused</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </GSAPReveal>

      {/* 2. Below fold components with staggered FadeInSection triggers */}
      <FadeInSection delay={0}>
        <StatsBar />
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
