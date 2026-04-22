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
  title: "Drawdown Australia — Trade the Truth",
  description: "The premium trading education platform for Australian traders. Built for ASIC compliance and the Australian market context. No gurus. No hype. Just edge.",
  path: "/au",
});

export default function AustraliaHome() {
  return (
    <RegionalProvider region="au">
      <div className="flex flex-col">
        <TrackPageView path="/au" />
        
        {/* Region Specific Hero Overwrite could happen here if needed */}
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

        {/* Australia Specific Note */}
        <section className="py-24 bg-background-elevated border-y border-border-slate">
          <div className="container mx-auto px-6 text-center">
            <span className="text-accent font-mono text-[10px] uppercase tracking-widest block mb-4">// REGIONAL COMPLIANCE</span>
            <h2 className="text-3xl font-display font-bold uppercase mb-6">Built for Australian Traders.</h2>
            <p className="text-text-secondary text-sm max-w-2xl mx-auto leading-relaxed">
              All broker recommendations and trading guides within the Australian portal are tailored for ASIC-regulated entities and the Australian tax environment (ATO). We prioritize your regulatory safety.
            </p>
          </div>
        </section>
      </div>
    </RegionalProvider>
  );
}
