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

export const metadata: Metadata = getMetadata({
  title: "Drawdown Singapore — Trade the Truth",
  description: "The premium trading education platform for Singapore traders. MAS compliant content. No gurus. No hype. Just edge.",
  path: "/sg",
});

export default function SingaporeHome() {
  return (
    <RegionalProvider region="sg">
      <div className="flex flex-col">
        <TrackPageView path="/sg" />
        
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
            <h2 className="text-3xl font-display font-bold uppercase mb-6">Built for Singapore Traders.</h2>
            <p className="text-text-secondary text-sm max-w-2xl mx-auto leading-relaxed">
              Tailored for the MAS-regulated environment. Discover the advantages of trading in Singapore, including the zero capital gains tax benefit.
            </p>
          </div>
        </section>
      </div>
    </RegionalProvider>
  );
}
