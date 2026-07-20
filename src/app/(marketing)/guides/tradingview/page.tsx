import { Metadata } from "next";
import { TRADINGVIEW_GUIDES } from "@/data/seo/tradingview";
import { BookOpen, Clock, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "TradingView Mastery Guides — Tutorials & Pro Tips",
  description: "Master the world's most powerful charting platform. Explore our guides on getting started, custom Pine Script coding, indicators, alerts, and mobile trading.",
};

export default function TradingViewGuidesIndexPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="relative pt-32 pb-20 border-b border-border-slate/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <Breadcrumbs 
              items={[
                { label: 'Guides', href: '/guides/tradingview' },
                { label: 'TradingView', href: '/guides/tradingview' }
              ]} 
            />
            
            <div className="flex items-center gap-3 text-accent mt-8 mb-6">
               <div className="w-8 h-[1px] bg-accent" />
               <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold">PLATFORM MASTERY</span>
            </div>

            <h1 className="text-5xl md:text-8xl font-sans font-black uppercase leading-[0.85] tracking-tight mb-8">
              TradingView <br />Guides.
            </h1>

            <p className="text-xl md:text-2xl text-text-secondary leading-relaxed font-medium max-w-2xl">
              Standardize your analysis, build custom indicators, and master the world's most popular charting terminal. Explore our professional guides below.
            </p>
          </div>
        </div>

        {/* Decorative Grid */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-[0.03] pointer-events-none">
           <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-accent)_1px,transparent_1px),linear-gradient(180deg,var(--color-accent)_1px,transparent_1px)] [background-size:40px_40px]" />
        </div>
      </header>

      {/* Guides Grid */}
      <main className="max-w-7xl mx-auto px-6 py-20 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TRADINGVIEW_GUIDES.map((guide) => (
            <Link 
              key={guide.slug}
              href={`/guides/tradingview/${guide.slug}`}
              className="group flex flex-col justify-between p-8 bg-background-surface/40 backdrop-blur-md border border-border-slate/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,0,0,0.15)] hover:border-border-slate hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center gap-2 text-text-tertiary mb-6">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono uppercase tracking-widest">{guide.lastUpdated}</span>
                </div>

                <h3 className="text-2xl font-sans font-bold uppercase tracking-tight text-text-primary group-hover:text-accent transition-colors mb-4 leading-tight">
                  {guide.title.split(" — ")[0]}
                </h3>

                <p className="text-text-secondary text-sm leading-relaxed mb-8">
                  {guide.metaDescription}
                </p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-border-slate/30 text-xs font-mono uppercase tracking-widest text-text-tertiary group-hover:text-accent transition-colors">
                <span>Read Guide</span>
                <ChevronRight className="w-4 h-4 text-text-tertiary group-hover:text-accent transition-all group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>

        {/* Affiliate Promotion Banner */}
        <section className="mt-24 bg-background-elevated/40 border border-border-slate/50 p-12 text-center space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <BookOpen className="w-32 h-32 text-accent" />
          </div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-sans font-black uppercase text-text-primary tracking-tight">Upgrade Your Charting Terminal</h2>
            <p className="text-text-secondary text-base leading-relaxed">
              Unlock multi-chart layouts, advanced volume profile tools, and premium data feeds with a TradingView plan.
            </p>
            <div className="pt-4">
              <Link 
                href="/go/tradingview"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-3 bg-accent text-[#08090D] px-10 py-5 text-xs font-bold uppercase tracking-[0.2em] hover:bg-accent-hover transition-colors"
              >
                <span>Get Started on TradingView</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
