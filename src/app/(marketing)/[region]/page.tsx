import { Metadata } from "next";
import { getMetadata } from "@/lib/metadata";
import { HeroSection } from "@/components/home/HeroSection";
import { NewsSourceStrip } from "@/components/home/NewsSourceStrip";
import { ProblemSection } from "@/components/home/ProblemSection";
import { LiveDashboardPreview } from "@/components/home/LiveDashboardPreview";
import { MarketPulse } from "@/components/home/MarketPulse";
import { EconomicCalendarWidget } from "@/components/home/EconomicCalendarWidget";
import { FeatureShowcase } from "@/components/home/FeatureShowcase";
import { PhasePreview } from "@/components/home/PhasePreview";
import { BrokerHubPreview } from "@/components/home/BrokerHubPreview";
import { TradingViewSection } from "@/components/home/TradingViewSection";
import { RegionalProvider } from "@/components/layout/RegionalLayout";
import { TrackPageView } from "@/components/admin/TrackPageView";
import { Region, REGIONS } from "@/lib/seo/hreflang";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ region: string }>;
}

export async function generateStaticParams() {
  // Only handle Phase 2 regions here to avoid conflict with existing folders
  return ["ca", "de", "ae", "in", "my", "ph"].map((region) => ({
    region,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { region } = await params;
  if (!REGIONS[region as Region]) return {};

  const regionName = REGIONS[region as Region].label;
  
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

  if (!REGIONS[region]) {
    notFound();
  }

  const regionName = REGIONS[region].label;

  return (
    <RegionalProvider region={region}>
      <div className="flex flex-col">
        <TrackPageView path={`/${region}`} />
        
        <HeroSection />

        <NewsSourceStrip />

        <LiveDashboardPreview />

        <ProblemSection />

        <MarketPulse />

        <EconomicCalendarWidget />

        <FeatureShowcase />

        <PhasePreview />

        <BrokerHubPreview />

        <TradingViewSection />

        <section className="py-24 bg-background-elevated border-y border-border-slate">
          <div className="container mx-auto px-6 text-center">
            <span className="text-accent font-mono text-[10px] uppercase tracking-widest block mb-4">// REGIONAL COMPLIANCE</span>
            <h2 className="text-3xl font-display font-bold uppercase mb-6">Built for {regionName} Traders.</h2>
            <p className="text-text-secondary text-sm max-w-2xl mx-auto leading-relaxed">
              All broker recommendations and trading guides within the {regionName} portal are tailored for local regulatory environments. We prioritize safety, transparency, and institutional-grade edge for all global members.
            </p>
          </div>
        </section>
      </div>
    </RegionalProvider>
  );
}
