import { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { TrackPageView } from "@/components/admin/TrackPageView";
import { ChevronRight, Star, ArrowRight, ShieldCheck } from "lucide-react";
import { createInternalSupabase } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Best Trading Platforms & Tools 2026",
  description: "Independent rankings and reviews of the best trading brokers, tools, and prop firms. We run rigorous tests on every platform so you don't have to.",
};

export const revalidate = 3600;

export default async function BestHub() {
  const supabase = createInternalSupabase();
  const { data: pages } = await supabase
    .from("seo_pages")
    .select("slug, title, seo_description, content")
    .eq("page_type", "best")
    .eq("is_published", true);

  const BEST_OF_PAGES = (pages || []).map(p => ({
    slug: p.slug,
    title: p.title,
    metaDescription: p.seo_description,
    eyebrow: p.content?.eyebrow || "Best Of",
    introduction: p.content?.introduction || "",
    comparisonTable: p.content?.comparisonTable || [{ name: "Top Pick" }]
  }));

  const categories = ["All", "Brokers", "Tools", "Prop Firms", "Education"];
  
  const featured = BEST_OF_PAGES.find(p => p.slug === 'forex-broker-uk') || BEST_OF_PAGES[0] || { slug: "", title: "", eyebrow: "", introduction: "", comparisonTable: [{name: ""}] };

  return (
    <main className="min-h-screen pt-32 pb-20 px-6">
      <TrackPageView path="/best" />
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-8">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-text-primary">Best Rankings</span>
        </nav>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-center">
          <div>
            <span className="text-accent font-mono text-[10px] uppercase tracking-widest block mb-4 underline decoration-accent/30 underline-offset-8 decoration-2">// INDEPENDENT RANKINGS</span>
            <h1 className="text-5xl md:text-8xl font-sans font-bold uppercase mb-8 text-text-primary leading-[0.85]">
              The Gold <br /> Standard.
            </h1>
            <p className="text-xl text-text-secondary max-w-xl font-sans leading-relaxed">
              We don't do "top 10" lists for SEO. We only rank tools and platforms that meet our institutional testing standards. If it's on this list, it's because we trust it.
            </p>
          </div>

          {/* Spotlight Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-accent/20 blur-[100px] group-hover:bg-accent/30 transition-all" />
            <Link 
              href={`/best/${featured.slug}`}
              className="relative block bg-background-surface/40 backdrop-blur-md border border-border-slate/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5/30 p-12 hover:border-border-slate transition-premium overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6">
                 <div className="bg-mkt-ink text-white text-[8px] font-mono font-black uppercase tracking-[0.2em] px-3 py-1">
                    2026 Top Pick
                 </div>
              </div>

              <div className="space-y-8 relative z-10">
                <div className="space-y-2">
                  <span className="text-accent font-mono text-[10px] uppercase tracking-widest">{featured.eyebrow}</span>
                  <h3 className="text-4xl font-sans font-bold uppercase">{featured.title}</h3>
                </div>
                
                <div className="p-6 bg-background-elevated/40/50 border border-border-slate/30">
                   <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-mono text-text-tertiary uppercase">Winner: {featured.comparisonTable[0].name}</span>
                      <div className="flex items-center gap-1">
                         {[1,2,3,4,5].map(s => <Star key={s} className="w-2.5 h-2.5 text-accent fill-accent" />)}
                      </div>
                   </div>
                   <p className="text-sm text-text-secondary line-clamp-2 italic">
                      "{featured.introduction.slice(0, 120)}..."
                   </p>
                </div>

                <div className="flex items-center justify-between pt-4">
                   <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-primary group-hover:text-accent transition-colors">Read Full Analysis</span>
                   <ArrowRight className="w-5 h-5 text-accent" />
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-12 border-b border-border-slate/30 pb-8">
           <span className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mr-4">Filter By:</span>
           {categories.map((cat, i) => (
             <button 
               key={cat}
               className={cn(
                 "px-6 py-2 text-[10px] font-mono uppercase tracking-widest border transition-all",
                 i === 0 ? "bg-accent border-border-slate/50 text-background-primary font-bold" : "bg-transparent border-border-slate/50 text-text-tertiary hover:border-text-primary hover:text-text-primary"
               )}
             >
               {cat}
             </button>
           ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BEST_OF_PAGES.map((page) => (
            <Link 
              key={page.slug} 
              href={`/best/${page.slug}`}
              className="group bg-background-surface/40 backdrop-blur-md border border-border-slate/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5 p-10 hover:border-border-slate transition-premium flex flex-col justify-between h-[420px] relative overflow-hidden"
            >
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-accent font-mono text-[10px] uppercase tracking-widest">{page.eyebrow}</span>
                  <div className="flex items-center space-x-2 text-[10px] font-mono text-text-tertiary uppercase">
                    <ShieldCheck className="w-3 h-3 text-profit" />
                    <span>Verified Review</span>
                  </div>
                </div>
                <h2 className="text-4xl font-sans font-bold uppercase leading-[0.9] group-hover:text-accent transition-colors">
                  {page.title.split('—')[0]}
                </h2>
                <p className="text-text-secondary text-sm leading-relaxed line-clamp-3">
                  {page.metaDescription}
                </p>
              </div>
              
              <div className="relative z-10 pt-8 border-t border-border-slate/30 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-accent fill-accent" />
                    <span className="text-[10px] font-mono uppercase text-text-primary">Top Choice: {page.comparisonTable[0].name}</span>
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
