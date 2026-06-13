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
  path: "/us",
});

export default function UnitedStatesHome() {
  const orgSchema = {
    "name": "Drawdown",
    "url": "https://drawdown.trading/us",
    "logo": "https://drawdown.trading/og/default-og.png",
    "founder": {
      "@type": "Person",
      "name": "Pete Currey"
    }
  };

  return (
    <div className="flex flex-col">
      <TrackPageView path="/us" />
      <StructuredData type="Organization" data={orgSchema} />
      
      <Navigation />
      <HeroSection />
      <PriceTicker />

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
