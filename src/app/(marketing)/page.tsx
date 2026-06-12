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
import { GSAPReveal } from "@/components/animations/GSAPReveal";
import { getMetadata } from "@/lib/metadata";
import { StructuredData } from "@/components/StructuredData";

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

      {/* Institutional Logo Strip */}
      <NewsSourceStrip />

      {/* 3. Live Dashboard Preview (THE differentiator) */}
      <GSAPReveal direction="up" delay={0.2}>
        <LiveDashboardPreview />
      </GSAPReveal>

      {/* 90% Problem Section (KEEP as per Section 1.5) */}
      <GSAPReveal direction="up">
        <ProblemSection />
      </GSAPReveal>

      {/* 4. Market Pulse (News Cards) */}
      <GSAPReveal direction="up" stagger={0.1}>
        <MarketPulse />
      </GSAPReveal>

      {/* 5. Economic Calendar Widget */}
      <GSAPReveal direction="up">
        <EconomicCalendarWidget />
      </GSAPReveal>

      {/* 6. Platform Tools (FeatureShowcase) */}
      <GSAPReveal direction="up">
        <FeatureShowcase />
      </GSAPReveal>

      {/* 7. The Curriculum (PhasePreview) */}
      <GSAPReveal direction="up">
        <PhasePreview />
      </GSAPReveal>

      {/* 8. Broker Hub Preview */}
      <GSAPReveal direction="up">
        <BrokerHubPreview />
      </GSAPReveal>

      {/* Prop Firm Section */}
      <GSAPReveal direction="up">
        <PropFirmSection />
      </GSAPReveal>

      {/* TradingView Partner Section */}
      <GSAPReveal direction="up">
        <TradingViewSection />
      </GSAPReveal>

      {/* Founder Pledge */}
      <GSAPReveal direction="up">
        <FounderVideo />
      </GSAPReveal>

      {/* 9. Pete's Daily Take */}
      <GSAPReveal direction="up">
        <PetesDailyTakeExcerpt />
      </GSAPReveal>
      
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
                  <span className="text-3xl font-display font-black text-accent">6</span>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-text-tertiary">Phases</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-display font-black text-accent">60+</span>
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

      {/* 10. Final CTA */}
      <section className="py-24 md:py-48 bg-background-elevated relative overflow-hidden group">
        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl md:text-8xl font-display font-bold uppercase mb-12 leading-tight">
            Ready to trade <br /> the <span className="text-accent underline decoration-accent/30 underline-offset-8">truth?</span>
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <Link 
              href="/signup" 
              className="w-full sm:w-auto px-16 py-8 bg-accent hover:bg-accent-hover text-background-primary text-xs font-bold uppercase tracking-widest transition-all shadow-2xl shadow-accent/20 hover:-translate-y-1"
            >
              Start Free Trial
            </Link>
            <div className="text-left">
              <p className="text-text-primary text-xs font-bold uppercase tracking-widest mb-1">Phase 1 is Free.</p>
              <p className="text-text-tertiary text-[10px] font-mono uppercase tracking-widest">No credit card required to begin.</p>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 border border-accent/10 rounded-full blur-3xl" />
        <div className="absolute -top-24 -right-24 w-96 h-96 border border-accent/10 rounded-full blur-3xl" />
      </section>
    </div>
  );
}
