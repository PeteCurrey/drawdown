import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrackPageView } from "@/components/admin/TrackPageView";
import { DifficultyBadge } from "@/components/how-to/DifficultyBadge";
import { createInternalSupabase } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Trading Guides & How-To",
  description: "Step-by-step guides on how to start trading, manage risk, and master the markets. Honest, professional-grade trading education.",
};

export const revalidate = 3600;

export default async function HowToHub() {
  const supabase = createInternalSupabase();
  const { data: pages } = await supabase
    .from("seo_pages")
    .select("slug, title, seo_description, content")
    .eq("page_type", "how-to")
    .eq("is_published", true);

  const HOW_TO_PAGES = (pages || []).map(p => ({
    slug: p.slug,
    title: p.title,
    metaDescription: p.seo_description,
    eyebrow: p.content?.eyebrow || "Guide",
    difficulty: p.content?.difficulty,
    readingTime: p.content?.readingTime || "5 min read",
  }));

  const categories = ["All", "Psychology", "Technical", "Strategy", "Basics"];
  const featured = HOW_TO_PAGES.find(p => p.slug === 'start-trading-uk') || HOW_TO_PAGES[0] || { slug: "", title: "", eyebrow: "", metaDescription: "", difficulty: "", readingTime: "" };

  return (
    <main className="min-h-screen pt-32 pb-20 px-6">
      <TrackPageView path="/how-to" />
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-8">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-text-primary">How-To</span>
        </nav>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-center">
          <div className="space-y-8">
            <div>
              <span className="text-accent font-mono text-[10px] uppercase tracking-widest block mb-4">// EXECUTION GUIDES</span>
              <h1 className="text-5xl md:text-8xl font-sans font-bold uppercase text-text-primary leading-[0.85]">
                Master the <br /> Process.
              </h1>
            </div>
            <p className="text-xl text-text-secondary max-w-xl font-sans leading-relaxed">
              Trading isn't about being right; it's about being prepared. Our step-by-step guides show you the exact mechanics of professional risk management and execution.
            </p>
          </div>

          {/* Featured Guide Spotlight */}
          <div className="relative group">
            <div className="absolute inset-0 bg-accent/20 blur-[100px] group-hover:bg-accent/30 transition-all" />
            <Link 
              href={`/how-to/${featured.slug}`}
              className="relative block bg-background-surface/40 backdrop-blur-md border border-border-slate/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5/30 p-10 hover:border-border-slate transition-premium overflow-hidden"
            >
              <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between">
                   <span className="text-accent font-mono text-[10px] uppercase tracking-widest">Recommended Starter</span>
                   <div className="flex items-center gap-2">
                      {featured.difficulty && <DifficultyBadge difficulty={featured.difficulty} />}
                      <div className="flex items-center gap-2 text-[10px] font-mono text-text-tertiary">
                        <Clock className="w-3 h-3" />
                        <span>{featured.readingTime}</span>
                      </div>
                   </div>
                </div>
                <h3 className="text-4xl font-sans font-bold uppercase">{featured.title.split('—')[0]}</h3>
                <p className="text-text-secondary text-sm leading-relaxed line-clamp-2">
                  {featured.metaDescription}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-border-slate/30">
                   <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-primary group-hover:text-accent transition-colors">Begin Training</span>
                   <ArrowRight className="w-5 h-5 text-accent" />
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-12 border-b border-border-slate/30 pb-8">
           <span className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mr-4">Topic:</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {HOW_TO_PAGES.map((page) => (
            <Link 
              key={page.slug} 
              href={`/how-to/${page.slug}`}
              className="group bg-background-surface/40 backdrop-blur-md border border-border-slate/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5 p-10 hover:border-border-slate transition-premium flex flex-col justify-between h-[380px] relative overflow-hidden"
            >
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-accent font-mono text-[10px] uppercase tracking-widest">{page.eyebrow}</span>
                  <div className="flex items-center gap-2">
                    {page.difficulty && <DifficultyBadge difficulty={page.difficulty} />}
                    <div className="flex items-center space-x-2 text-[10px] font-mono text-text-tertiary">
                      <Clock className="w-3 h-3" />
                      <span>{page.readingTime}</span>
                    </div>
                  </div>
                </div>
                <h2 className="text-3xl font-sans font-bold uppercase leading-tight group-hover:text-accent transition-colors">
                  {page.title.split('—')[0]}
                </h2>
                <p className="text-text-secondary text-xs leading-relaxed line-clamp-3 font-mono uppercase tracking-tight">
                  {page.metaDescription}
                </p>
              </div>
              
              <div className="relative z-10 pt-8 border-t border-border-slate/30 flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-text-primary group-hover:text-accent transition-colors">View Guide</span>
                <ArrowRight className="w-4 h-4 text-text-tertiary group-hover:text-accent group-hover:translate-x-2 transition-all" />
              </div>

              {/* Decorative background number/element */}
              <div className="absolute -right-8 -bottom-8 text-[120px] font-sans font-black text-profit select-none transition-colors group-hover:text-profit">
                //
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
