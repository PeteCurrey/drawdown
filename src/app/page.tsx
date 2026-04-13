import { HeroSection } from "@/components/home/HeroSection";
import { ProblemSection } from "@/components/home/ProblemSection";
import { FeatureShowcase } from "@/components/home/FeatureShowcase";
import { PhasePreview } from "@/components/home/PhasePreview";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <ProblemSection />
      <FeatureShowcase />
      <PhasePreview />
      
      {/* Social Proof Placeholder */}
      <section className="py-24 bg-background-primary border-t border-border-slate">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm font-mono tracking-widest uppercase text-text-tertiary mb-12">
            // JOIN THE TRADERS TRADING THE TRUTH
          </p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-40 grayscale filter">
            <div className="text-2xl font-display font-bold uppercase tracking-tighter italic">TradingView</div>
            <div className="text-2xl font-display font-bold uppercase tracking-tighter italic">MetaTrader</div>
            <div className="text-2xl font-display font-bold uppercase tracking-tighter italic">HMRC Compliant</div>
            <div className="text-2xl font-display font-bold uppercase tracking-tighter italic">Stripe Secure</div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 md:py-48 bg-background-surface">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-7xl font-display font-bold uppercase mb-12">
            Ready to trade <br /> the <span className="text-accent underline decoration-accent/30 underline-offset-8">truth?</span>
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a 
              href="/signup" 
              className="w-full sm:w-auto px-12 py-6 bg-accent hover:bg-accent-hover text-background-primary text-sm font-bold uppercase tracking-widest transition-colors"
            >
              Start for Free
            </a>
            <p className="text-text-tertiary text-xs md:text-sm font-mono uppercase tracking-widest">
              No card required. Just edge.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
