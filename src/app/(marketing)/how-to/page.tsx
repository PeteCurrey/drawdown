import { Metadata } from "next";
import Link from "next/link";
import { HOW_TO_PAGES } from "@/data/seo/howto";
import { ArrowRight, Clock, ChevronRight } from "lucide-react";
import { TrackPageView } from "@/components/admin/TrackPageView";

export const metadata: Metadata = {
  title: "Trading Guides & How-To | Drawdown",
  description: "Step-by-step guides on how to start trading, manage risk, and master the markets. Honest, professional-grade trading education.",
};

export default function HowToHub() {
  return (
    <main className="min-h-screen bg-background-primary pt-32 pb-20 px-6">
      <TrackPageView path="/how-to" />
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-8">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-text-primary">How-To</span>
        </nav>

        {/* Header */}
        <div className="mb-20">
          <span className="text-accent font-mono text-[10px] uppercase tracking-widest block mb-4">// EXECUTION GUIDES</span>
          <h1 className="text-5xl md:text-8xl font-display font-bold uppercase mb-8 text-text-primary">
            Master the <br className="hidden md:block" /> Process.
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl font-sans">
            Trading isn't about being right; it's about being prepared. Our step-by-step guides show you the exact mechanics of professional risk management and execution.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {HOW_TO_PAGES.map((page) => (
            <Link 
              key={page.slug} 
              href={`/how-to/${page.slug}`}
              className="group bg-background-surface border border-border-slate p-10 hover:border-accent transition-premium flex flex-col justify-between h-[400px] relative overflow-hidden"
            >
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-accent font-mono text-[10px] uppercase tracking-widest">{page.eyebrow}</span>
                  <div className="flex items-center space-x-2 text-[10px] font-mono text-text-tertiary">
                    <Clock className="w-3 h-3" />
                    <span>{page.readingTime}</span>
                  </div>
                </div>
                <h2 className="text-3xl font-display font-bold uppercase leading-tight group-hover:text-accent transition-colors">
                  {page.title.split('—')[0]}
                </h2>
                <p className="text-text-secondary text-sm leading-relaxed line-clamp-3">
                  {page.metaDescription}
                </p>
              </div>
              
              <div className="relative z-10 pt-8 border-t border-border-slate/50 flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-text-primary group-hover:text-accent transition-colors">View Guide</span>
                <ArrowRight className="w-4 h-4 text-text-tertiary group-hover:text-accent group-hover:translate-x-2 transition-all" />
              </div>

              {/* Decorative background number */}
              <div className="absolute -right-8 -bottom-8 text-[120px] font-display font-black text-accent/5 select-none transition-colors group-hover:text-accent/10">
                ?
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
