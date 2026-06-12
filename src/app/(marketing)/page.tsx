import { HeroSection } from "@/components/home/HeroSection";
import { NewsSourceStrip } from "@/components/home/NewsSourceStrip";
import { ProblemSection } from "@/components/home/ProblemSection";
import { FounderVideo } from "@/components/home/FounderVideo";
import { FeatureShowcase } from "@/components/home/FeatureShowcase";
import { PhasePreview } from "@/components/home/PhasePreview";
import { MarketPulse } from "@/components/home/MarketPulse";
import { LiveDashboardPreview } from "@/components/home/LiveDashboardPreview";
import { EconomicCalendarWidget } from "@/components/home/EconomicCalendarWidget";
import { BrokerHubPreview } from "@/components/home/BrokerHubPreview";
import { PropFirmSection } from "@/components/home/PropFirmSection";
import { TradingViewSection } from "@/components/home/TradingViewSection";
import { PetesDailyTakeExcerpt } from "@/components/home/PetesDailyTakeExcerpt";
import Link from "next/link";
import { TrackPageView } from "@/components/admin/TrackPageView";
import { getMetadata } from "@/lib/metadata";
import { StructuredData } from "@/components/StructuredData";
import { FadeInSection } from "@/components/animations/FadeInSection";
import { PriceTicker } from "@/components/home/PriceTicker";
import { StatsCounters } from "@/components/home/StatsCounters";

export const metadata = getMetadata({
  path: "/",
});

export default function Home() {
  const orgSchema = {
    "name": "Drawdown",
    "url": "https://drawdown.trading",
    "logo": "https://drawdown.trading/og/default-og.png",
    "founder": {
      "@type": "Person",
      "name": "Pete Currey"
    },
    "sameAs": [
      "https://twitter.com/drawdowntrading",
      "https://youtube.com/@drawdowntrading"
    ]
  };

  return (
    <div className="flex flex-col">
      <TrackPageView path="/" />
      <StructuredData type="Organization" data={orgSchema} />
      
      {/* 2. Hero (Condensed) */}
      <HeroSection />

      {/* Live Market Price Ticker */}
      <PriceTicker />

      {/* Institutional Logo Strip */}
      <NewsSourceStrip />

      {/* 3. Live Dashboard Preview (THE differentiator) */}
      <FadeInSection delay={0.1}>
        <LiveDashboardPreview />
      </FadeInSection>

      {/* 90% Problem Section */}
      <FadeInSection>
        <ProblemSection />
      </FadeInSection>

      {/* 4. Market Pulse (News Cards) */}
      <FadeInSection>
        <MarketPulse />
      </FadeInSection>

      {/* 5. Economic Calendar Widget */}
      <FadeInSection>
        <EconomicCalendarWidget />
      </FadeInSection>

      {/* 6. Platform Tools (FeatureShowcase) */}
      <FadeInSection>
        <FeatureShowcase />
      </FadeInSection>

      {/* 7. The Curriculum (PhasePreview) */}
      <FadeInSection>
        <PhasePreview />
      </FadeInSection>

      {/* 8. Broker Hub Preview */}
      <FadeInSection>
        <BrokerHubPreview />
      </FadeInSection>

      {/* Prop Firm Section */}
      <FadeInSection>
        <PropFirmSection />
      </FadeInSection>

      {/* TradingView Partner Section */}
      <FadeInSection>
        <TradingViewSection />
      </FadeInSection>

      {/* Founder Pledge */}
      <FadeInSection>
        <FounderVideo />
      </FadeInSection>

      {/* 9. Pete's Daily Take */}
      <FadeInSection>
        <PetesDailyTakeExcerpt />
      </FadeInSection>
      
      {/* 1.5: No Lambos Section (Updated Stats) */}
      <FadeInSection>
        <section className="py-24 bg-white border-t border-[#E8E8E8] overflow-hidden z-20">
          <div className="container mx-auto px-6 text-center lg:text-left">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-8">
                <span className="text-xs font-semibold tracking-widest text-neutral-400 border border-neutral-200 rounded-full px-3 py-1 inline-block uppercase font-sans">
                  PLATFORM INTEGRITY
                </span>
                <h2 className="text-4xl md:text-5xl font-display font-bold uppercase leading-tight text-[#0A0A0A]">
                  No Lambos. <br /> No Beach Photos. <br /> <span className="underline decoration-neutral-250 underline-offset-8">Just Data.</span>
                </h2>
                <div className="space-y-4 max-w-xl mx-auto lg:mx-0 font-sans">
                  <p className="text-lg text-neutral-500 leading-relaxed">
                    Trading is a business of probabilities, risk management, and emotional detachment. We don't sell dreams; we provide the data and the discipline to survive the markets.
                  </p>
                  <p className="text-xs text-neutral-400 uppercase tracking-widest leading-relaxed">
                    Established in Chesterfield, UK. Built for traders who value truth over hype.
                  </p>
                </div>
              </div>
              
              <StatsCounters />
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* 10. Final CTA */}
      <FadeInSection>
        <section className="py-24 md:py-36 bg-white relative overflow-hidden group border-t border-[#E8E8E8] z-20">
          <div className="container mx-auto px-6 text-center relative z-10">
            <h2 className="text-5xl md:text-8xl font-display font-bold uppercase mb-12 leading-tight text-[#0A0A0A]">
              Ready to trade <br /> the truth?
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <Link 
                href="/signup" 
                className="w-full sm:w-auto px-12 py-5 bg-black hover:bg-neutral-800 text-white text-sm font-medium rounded-lg transition-colors font-sans"
              >
                Start Free Trial
              </Link>
              <div className="text-left font-sans">
                <p className="text-[#0A0A0A] text-sm font-bold uppercase tracking-wider mb-1">Phase 1 is Free.</p>
                <p className="text-neutral-450 text-xs">No credit card required to begin.</p>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>
    </div>
  );
}
