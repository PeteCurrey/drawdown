import { Metadata } from "next";
import Link from "next/link";
import { COMPARISON_PAGES } from "@/data/seo/compare";
import { ArrowRight, ChevronRight, GitCompare } from "lucide-react";
import { TrackPageView } from "@/components/admin/TrackPageView";

export const metadata: Metadata = {
  title: "Trading Tool Comparisons | Side-by-Side Analysis | Drawdown",
  description: "Deep-dive side-by-side comparisons of the world's leading trading platforms, brokers, and software. Find the right tool for your strategy.",
};

export default function CompareHub() {
  return (
    <main className="min-h-screen bg-background-primary pt-32 pb-20 px-6">
      <TrackPageView path="/compare" />
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-8">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-text-primary">Compare</span>
        </nav>

        {/* Header */}
        <div className="mb-20">
          <span className="text-accent font-mono text-[10px] uppercase tracking-widest block mb-4">// HEAD-TO-HEAD ANALYSIS</span>
          <h1 className="text-5xl md:text-8xl font-display font-bold uppercase mb-8 text-text-primary">
            Side by <br className="hidden md:block" /> Side.
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl font-sans">
            Choosing the right infrastructure is a business decision. We break down the technical differences between the market's leading tools so you can trade with the best setup for your style.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {COMPARISON_PAGES.map((page) => (
            <Link 
              key={page.slug} 
              href={`/compare/${page.slug}`}
              className="group bg-background-surface border border-border-slate p-10 hover:border-accent transition-premium flex flex-col justify-between h-[380px] relative overflow-hidden"
            >
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-accent font-mono text-[10px] uppercase tracking-widest">{page.eyebrow}</span>
                  <GitCompare className="w-4 h-4 text-text-tertiary group-hover:text-accent transition-colors" />
                </div>
                <h2 className="text-3xl font-display font-bold uppercase leading-tight group-hover:text-accent transition-colors">
                  {page.title.split('—')[0]}
                </h2>
                <p className="text-text-secondary text-sm leading-relaxed line-clamp-3 font-mono uppercase tracking-tight">
                   Best for: {page.quickVerdict.winner}
                </p>
              </div>
              
              <div className="relative z-10 pt-8 border-t border-border-slate/50 flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-text-primary group-hover:text-accent transition-colors">Compare Logic</span>
                <ArrowRight className="w-4 h-4 text-text-tertiary group-hover:text-accent group-hover:translate-x-2 transition-all" />
              </div>

              {/* Decorative split background */}
              <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/5 -skew-x-12 translate-x-1/2 group-hover:bg-accent/10 transition-colors duration-1000" />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
