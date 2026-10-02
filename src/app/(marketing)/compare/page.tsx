import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronRight, GitCompare, Shield, Zap, Sparkles, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrackPageView } from "@/components/admin/TrackPageView";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { createInternalSupabase } from "@/lib/supabase/server";
import { InteractiveCompareWidget } from "@/components/compare/InteractiveCompareWidget";

export const metadata: Metadata = {
  title: "Broker Comparisons 2026 | Head-to-Head Trading Platform Audits",
  description: "Interactive side-by-side broker comparisons for UK & global traders. Compare Pepperstone vs IG, IC Markets vs Pepperstone, CMC vs IG and more.",
  alternates: { canonical: "https://drawdown.trading/compare" }
};

export const revalidate = 3600;

export default async function CompareHub() {
  const supabase = createInternalSupabase();
  const { data: pages } = await supabase
    .from("seo_pages")
    .select("slug, title, seo_description, content")
    .eq("page_type", "compare")
    .eq("is_published", true);

  const COMPARISON_PAGES = (pages || []).map(p => ({
    slug: p.slug,
    title: p.title,
    metaDescription: p.seo_description,
    eyebrow: p.content?.eyebrow || "Broker Battle",
    quickVerdict: p.content?.quickVerdict || { reason: "Comprehensive head-to-head spread & latency evaluation.", winner: "Pepperstone / IG" }
  }));

  const featured = COMPARISON_PAGES[0] || { 
    slug: "pepperstone-vs-ig", 
    title: "Pepperstone vs IG Markets", 
    eyebrow: "Featured Battle", 
    quickVerdict: { reason: "Pepperstone wins for raw spreads and TradingView execution; IG wins for UK spread betting market depth.", winner: "Pepperstone for Scalping, IG for Spread Betting" } 
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <TrackPageView path="/compare" />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://drawdown.trading" },
        { name: "Compare Brokers", url: "https://drawdown.trading/compare" }
      ]} />

      {/* 1. IMMERSIVE AMBIENT HERO SECTION */}
      <section className="relative min-h-[80vh] flex flex-col justify-center pt-32 pb-20 border-b border-white/10 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* Background Ambient Radial Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-indigo-600/15 rounded-full blur-[160px] pointer-events-none z-0" />
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none z-0" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0" />

        <div className="container mx-auto px-6 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-slate-400 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-bold">Compare Brokers</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Header */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono font-bold uppercase tracking-widest">
                <GitCompare className="w-4 h-4" />
                <span>// HEAD-TO-HEAD INFRASTRUCTURE AUDITS</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-sans font-black uppercase tracking-tight leading-[0.95]">
                Broker Battles. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-white">Side by Side.</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 leading-relaxed font-normal max-w-2xl">
                Choosing your broker is an operational business decision. We compare live order execution speeds, raw spreads, commissions, and regulatory protection line by line.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <a 
                  href="#interactive-compare"
                  className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-sans font-black text-xs uppercase tracking-widest rounded-xl shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2"
                >
                  Interactive Compare Engine <Sparkles className="w-4 h-4" />
                </a>

                <Link
                  href="/brokers/all"
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-sans font-bold text-xs uppercase tracking-widest rounded-xl transition-all"
                >
                  View All Brokers Directory
                </Link>
              </div>
            </div>

            {/* Right Featured Spotlight Card */}
            <div className="lg:col-span-5">
              <div className="relative group">
                <div className="absolute inset-0 bg-indigo-500/20 blur-[90px] group-hover:bg-indigo-500/30 transition-all pointer-events-none" />
                <Link 
                  href={`/compare/${featured.slug}`}
                  className="relative block bg-slate-900 border border-indigo-500/40 rounded-3xl p-8 shadow-2xl hover:border-indigo-500 transition-all group overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-xs font-mono font-bold text-indigo-400">VS</div>
                      <span className="text-indigo-400 font-mono text-xs uppercase tracking-widest font-bold">Featured Battle</span>
                    </div>
                    <GitCompare className="w-5 h-5 text-indigo-400" />
                  </div>
                  
                  <div className="space-y-4 relative z-10">
                    <h3 className="text-3xl font-sans font-black uppercase leading-tight text-white group-hover:text-indigo-400 transition-colors">
                      {featured.title.split('—')[0]}
                    </h3>
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                      <p className="text-[10px] font-mono text-indigo-400 uppercase font-bold mb-1">Pete&apos;s Quick Take:</p>
                      <p className="text-xs text-slate-300 italic font-medium leading-relaxed m-0">
                        &quot;{featured.quickVerdict.reason}&quot;
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs font-mono font-bold uppercase tracking-wider text-white group-hover:text-indigo-400 transition-colors">
                      <span>Explore Head-to-Head Breakdown</span>
                      <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE COMPARE WIDGET SECTION */}
      <section id="interactive-compare" className="py-20">
        <div className="container mx-auto px-6 space-y-8">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400">// DYNAMIC MULTI-SELECTOR</span>
            <h2 className="text-3xl sm:text-4xl font-sans font-black uppercase text-white">
              Interactive Broker Comparison Tool
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Select any two brokers below to instantly compare spreads, licensing, latency, platforms, and tax-free status side-by-side.
            </p>
          </div>

          <InteractiveCompareWidget mode="broker" />
        </div>
      </section>

      {/* 3. FEATURED COMPARISON BATTLES GRID */}
      {COMPARISON_PAGES.length > 0 && (
        <section className="py-20 bg-slate-900 border-t border-white/10">
          <div className="container mx-auto px-6 space-y-12">
            <div className="max-w-3xl space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400">// PUBLISHED COMPARISON ARTICLES</span>
              <h2 className="text-3xl sm:text-4xl font-sans font-black uppercase text-white">
                Detailed Comparison Deep-Dives
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {COMPARISON_PAGES.map((page) => (
                <Link 
                  key={page.slug} 
                  href={`/compare/${page.slug}`}
                  className="group bg-slate-950 border border-slate-800 hover:border-indigo-500/60 rounded-2xl p-8 transition-all hover:-translate-y-1 flex flex-col justify-between h-[360px] relative overflow-hidden shadow-xl"
                >
                  <div className="relative z-10 space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="text-indigo-400 font-mono text-[10px] uppercase tracking-widest font-bold">{page.eyebrow}</span>
                      <GitCompare className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                    </div>
                    <h3 className="text-2xl font-sans font-black uppercase leading-tight text-white group-hover:text-indigo-400 transition-colors">
                      {page.title.split('—')[0]}
                    </h3>
                    <p className="text-slate-300 text-xs font-mono uppercase tracking-wide leading-relaxed line-clamp-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
                      Best for: {page.quickVerdict.winner}
                    </p>
                  </div>
                  
                  <div className="relative z-10 pt-6 border-t border-slate-800 flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-slate-300 group-hover:text-indigo-400 transition-colors">
                    <span>Read Full Battle</span>
                    <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
