import { Metadata } from "next";
import Link from "next/link";
import { COMPARISON_PAGES } from "@/data/seo/compare";
import { ArrowRight, ChevronRight, GitCompare } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrackPageView } from "@/components/admin/TrackPageView";

export const metadata: Metadata = {
  title: "Trading Tool Comparisons | Side-by-Side Analysis | Drawdown",
  description: "Deep-dive side-by-side comparisons of the world's leading trading platforms, brokers, and software. Find the right tool for your strategy.",
};

export default function CompareHub() {
  const featured = COMPARISON_PAGES[0];

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

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-center">
          <div className="space-y-8">
            <div>
              <span className="text-accent font-mono text-[10px] uppercase tracking-widest block mb-4 underline decoration-accent/30 underline-offset-8 decoration-2">// HEAD-TO-HEAD ANALYSIS</span>
              <h1 className="text-5xl md:text-8xl font-display font-bold uppercase text-text-primary leading-[0.85]">
                Side by <br /> Side.
              </h1>
            </div>
            <p className="text-xl text-text-secondary max-w-xl font-sans leading-relaxed">
              Choosing the right infrastructure is a business decision. We break down the technical differences between the market's leading tools.
            </p>
          </div>

          {/* Spotlight Comparison */}
          <div className="relative group">
            <div className="absolute inset-0 bg-accent/20 blur-[100px] group-hover:bg-accent/30 transition-all" />
            <Link 
              href={`/compare/${featured.slug}`}
              className="relative block bg-background-surface border border-accent/30 p-10 hover:border-accent transition-premium overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-[10px] font-bold">VS</div>
                    <span className="text-accent font-mono text-[10px] uppercase tracking-widest">Featured Battle</span>
                 </div>
                 <GitCompare className="w-5 h-5 text-accent" />
              </div>
              
              <div className="space-y-6 relative z-10">
                <h3 className="text-4xl font-display font-bold uppercase leading-none">
                   {featured.title.split('—')[0]}
                </h3>
                <div className="p-4 bg-background-elevated/50 border border-border-slate/50">
                   <p className="text-[10px] font-mono text-text-tertiary uppercase mb-2">Verdict:</p>
                   <p className="text-sm text-text-secondary italic">
                      "{featured.quickVerdict.reasoning.slice(0, 100)}..."
                   </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border-slate/50">
                   <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-primary group-hover:text-accent transition-colors">See the Comparison</span>
                   <ArrowRight className="w-5 h-5 text-accent" />
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Comparison Grid */}
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
                <p className="text-text-secondary text-[10px] font-mono uppercase tracking-widest leading-relaxed line-clamp-3 bg-background-elevated/30 p-4 border border-border-slate/30">
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
