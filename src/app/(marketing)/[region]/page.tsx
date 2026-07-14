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
import { RegionalProvider } from "@/components/layout/RegionalLayout";
import { Region, REGIONS, REGIONS_MAP } from "@/lib/seo/hreflang";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getMetadata } from "@/lib/metadata";

export const dynamicParams = true;
export const revalidate = 3600; // hourly cache revalidation

interface Props {
  params: Promise<{ region: string }>;
}

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { region } = await params;
  const regionKey = region as Region;
  if (!REGIONS.includes(regionKey)) return {};

  const regionData = REGIONS_MAP[regionKey];
  const regionName = regionData.label;
  
  return getMetadata({
    title: `Drawdown ${regionName} — Trade the Truth`,
    description: `The premium trading education platform for ${regionName} traders. Localized content and regulatory compliance. No gurus. No hype. Just edge.`,
    path: `/${region}`,
    hasRegionalVariants: true,
  });
}

export default async function RegionalHome({ params }: Props) {
  const { region: regionParam } = await params;
  const region = regionParam as Region;

  if (!REGIONS.includes(region)) {
    notFound();
  }

  const regionName = REGIONS_MAP[region]?.label ?? region.toUpperCase();

  return (
    <RegionalProvider region={region}>
      <div className="flex flex-col">
        <TrackPageView path={`/${region}`} />
        
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

        <section className="py-24 bg-background-elevated border-y border-border-slate">
          <div className="container mx-auto px-6 text-center">
            <span className="text-accent font-mono text-[10px] uppercase tracking-widest block mb-4">// REGIONAL COMPLIANCE</span>
            <h2 className="text-3xl font-display font-bold uppercase mb-6">Built for {regionName} Traders.</h2>
            <p className="text-text-secondary text-sm max-w-2xl mx-auto leading-relaxed">
              All broker recommendations and trading guides within the {regionName} portal are tailored for local regulatory environments. We prioritize safety, transparency, and professional-grade edge for all global members.
            </p>
          </div>
        </section>
      </div>
    </RegionalProvider>
  );
}
