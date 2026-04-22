import { Metadata } from "next";
import Link from "next/link";
import { BEST_OF_PAGES } from "@/data/seo/best";
import { ArrowRight, Star, ChevronRight, ShieldCheck } from "lucide-react";
import { TrackPageView } from "@/components/admin/TrackPageView";

export const metadata: Metadata = {
  title: "Best Trading Platforms & Tools 2026 | Drawdown",
  description: "Independent rankings and reviews of the best trading brokers, tools, and prop firms. We test them so you don't have to.",
};

export default function BestHub() {
  return (
    <main className="min-h-screen bg-background-primary pt-32 pb-20 px-6">
      <TrackPageView path="/best" />
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-8">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-text-primary">Best Rankings</span>
        </nav>

        {/* Header */}
        <div className="mb-20">
          <span className="text-accent font-mono text-[10px] uppercase tracking-widest block mb-4">// INDEPENDENT RANKINGS</span>
          <h1 className="text-5xl md:text-8xl font-display font-bold uppercase mb-8 text-text-primary">
            The Gold <br className="hidden md:block" /> Standard.
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl font-sans">
            We don't do "top 10" lists for SEO. We only rank tools and platforms that meet our institutional testing standards. If it's on this list, it's because we trust it.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BEST_OF_PAGES.map((page) => (
            <Link 
              key={page.slug} 
              href={`/best/${page.slug}`}
              className="group bg-background-surface border border-border-slate p-10 hover:border-accent transition-premium flex flex-col justify-between h-[450px] relative overflow-hidden"
            >
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-accent font-mono text-[10px] uppercase tracking-widest">{page.eyebrow}</span>
                  <div className="flex items-center space-x-2 text-[10px] font-mono text-text-tertiary uppercase">
                    <ShieldCheck className="w-3 h-3 text-profit" />
                    <span>Verified Review</span>
                  </div>
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-bold uppercase leading-[0.9] group-hover:text-accent transition-colors">
                  {page.title}
                </h2>
                <p className="text-text-secondary text-lg leading-relaxed line-clamp-3">
                  {page.metaDescription}
                </p>
              </div>
              
              <div className="relative z-10 pt-8 border-t border-border-slate/50 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-accent fill-accent" />
                    <span className="text-xs font-bold text-text-primary">Top Choice: {page.comparisonTable[0].name}</span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-text-tertiary group-hover:text-accent group-hover:translate-x-2 transition-all" />
              </div>

              {/* Decorative background circle */}
              <div className="absolute -right-16 -top-16 w-64 h-64 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors duration-700" />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
