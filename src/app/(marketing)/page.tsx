import { HeroSection } from "@/components/home/HeroSection";
import { ProblemSection } from "@/components/home/ProblemSection";
import { FounderVideo } from "@/components/home/FounderVideo";
import { FeatureShowcase } from "@/components/home/FeatureShowcase";
import { PhasePreview } from "@/components/home/PhasePreview";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <ProblemSection />
      <FounderVideo />
      <FeatureShowcase />
      <PhasePreview />
      
          {/* Social Proof & Integrity Section */}
      <section className="py-24 md:py-32 bg-background-primary border-t border-border-slate overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <span className="text-[10px] font-mono tracking-widest uppercase text-text-tertiary">
                PLATFORM INTEGRITY
              </span>
              <h2 className="text-4xl md:text-6xl font-display font-bold uppercase leading-tight">
                No Lambos. <br /> No Beach Photos. <br /> <span className="text-accent underline decoration-accent/30 underline-offset-8">Just Data.</span>
              </h2>
              <div className="space-y-4 max-w-xl">
                <p className="text-lg text-text-secondary leading-relaxed">
                  Trading is a business of probabilities, risk management, and emotional detachment. We don't sell dreams; we provide the data and the discipline to survive the markets.
                </p>
                <p className="text-sm text-text-tertiary font-mono uppercase tracking-widest leading-relaxed">
                  Established in Chesterfield, UK. Built for traders who value truth over hype.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-8 bg-background-surface border border-border-slate">
                <p className="text-4xl font-display font-black text-accent mb-2">6</p>
                <p className="text-[10px] font-mono tracking-widest uppercase text-text-tertiary">Curriculum Phases</p>
              </div>
              <div className="p-8 bg-background-surface border border-border-slate">
                <p className="text-4xl font-display font-black text-accent mb-2">60+</p>
                <p className="text-[10px] font-mono tracking-widest uppercase text-text-tertiary">Learning Modules</p>
              </div>
              <div className="p-8 bg-background-surface border border-border-slate">
                <p className="text-4xl font-display font-black text-accent mb-2">5</p>
                <p className="text-[10px] font-mono tracking-widest uppercase text-text-tertiary">AI-Powered Tools</p>
              </div>
              <div className="p-8 bg-background-surface border border-border-slate">
                <p className="text-4xl font-display font-black text-accent mb-2">100%</p>
                <p className="text-[10px] font-mono tracking-widest uppercase text-text-tertiary">UK Focused</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
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
              Start Your Free Trial
            </Link>
            <div className="text-left">
              <p className="text-text-primary text-xs font-bold uppercase tracking-widest mb-1">Phase 1 is Free.</p>
              <p className="text-text-tertiary text-[10px] font-mono uppercase tracking-widest">No credit card required to begin.</p>
            </div>
          </div>
        </div>
        {/* Abstract shapes for premium feel */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 border border-accent/10 rounded-full blur-3xl" />
        <div className="absolute -top-24 -right-24 w-96 h-96 border border-accent/10 rounded-full blur-3xl" />
      </section>
    </div>
  );
}
