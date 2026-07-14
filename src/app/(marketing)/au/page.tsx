import { Navigation } from "@/components/layout/Navigation";
import { HeroSection } from "@/components/home/HeroSection";
import { PriceTicker } from "@/components/home/PriceTicker";
import { StatsBar } from "@/components/home/StatsBar";
import { DataSourceStrip } from "@/components/home/DataSourceStrip";
import { LiveNewsSection } from "@/components/home/LiveNewsSection";
import { GlobalFluxSection } from "@/components/home/GlobalFluxSection";
import { InstitutionalPulseSection } from "@/components/home/InstitutionalPulseSection";
import { InstitutionalConsensusSection } from "@/components/home/InstitutionalConsensusSection";
import { AIToolsSection } from "@/components/home/AIToolsSection";
import { CurriculumSection } from "@/components/home/CurriculumSection";
import { HorizontalScrollSection } from "@/components/home/HorizontalScrollSection";
import { BrokerSection } from "@/components/home/BrokerSection";
import { PricingSection } from "@/components/home/PricingSection";
import { Footer } from "@/components/layout/Footer";
import { FadeInSection } from "@/components/animations/FadeInSection";
import { TrackPageView } from "@/components/admin/TrackPageView";
import { StructuredData } from "@/components/StructuredData";
import { getMetadata } from "@/lib/metadata";

export const metadata = getMetadata({
  path: "/au",
});

export default function AustralianHome() {
  const orgSchema = {
    "name": "Drawdown",
    "url": "https://drawdown.trading/au",
    "logo": "https://drawdown.trading/og/default-og.png",
    "founder": {
      "@type": "Person",
      "name": "Pete Currey"
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-background-primary overflow-hidden border-b border-border-slate">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl space-y-8">
            <div className="flex items-center gap-3 text-accent transition-all duration-700">
               <div className="w-8 h-[1px] bg-accent" />
               <span className="text-[10px] font-mono uppercase tracking-[0.3em]">BUILT FOR AUSTRALIAN TRADERS</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-display font-extrabold uppercase tracking-tight leading-[0.9]">
              Trade The <br />
              <span className="text-accent underline decoration-accent/20">Truth.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-text-secondary leading-relaxed max-w-2xl font-medium">
              professional-grade education and data for Australia's most disciplined traders. ASIC-regulated insights, AUD-normalized analysis, and a professional edge.
            </p>

      <FadeInSection delay={0}>
        <StatsBar />
      </FadeInSection>

      <FadeInSection delay={0.1}>
        <DataSourceStrip />
      </FadeInSection>

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
