import Link from "next/link";
import { ArrowRight, ChevronRight, GitCompare } from "lucide-react";
import { TrackPageView } from "@/components/admin/TrackPageView";
import { RegionalProvider } from "@/components/layout/RegionalLayout";
import { Region, REGIONS_MAP } from "@/lib/seo/hreflang";

interface RegionalCompareIndexProps {
  region: Region;
  data: Array<{
    slug: string;
    title: string;
    metaDescription: string;
  }>;
}

export function RegionalCompareIndex({ region, data }: RegionalCompareIndexProps) {
  const regionName = REGIONS_MAP[region].label;

  return (
    <RegionalProvider region={region}>
      <main className="min-h-screen pt-32 pb-20 px-6">
        <TrackPageView path={`/${region}/compare`} />
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-8">
            <Link href={`/${region}`} className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-text-primary">Compare</span>
          </nav>

          {/* Hero Section */}
          <div className="max-w-3xl mb-16">
            <span className="text-accent font-mono text-[10px] uppercase tracking-widest block mb-4 underline decoration-accent/30 underline-offset-8 decoration-2">// HEAD-TO-HEAD ANALYSIS</span>
            <h1 className="text-5xl md:text-8xl font-sans font-bold uppercase text-text-primary leading-[0.85] mb-8">
              Compare <br />
              <span className="text-accent">Tools.</span>
            </h1>
            <p className="text-xl text-text-secondary font-sans leading-relaxed">
              Choosing the right trading infrastructure is a business decision. We break down the technical differences between the leading brokers and software for traders in {regionName}.
            </p>
          </div>

          {/* Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.map((page) => (
              <Link 
                key={page.slug} 
                href={`/${region}/compare/${page.slug}`}
                className="group bg-background-surface/40 backdrop-blur-md border border-border-slate/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5 p-10 hover:border-border-slate flex flex-col justify-between h-[380px] relative overflow-hidden"
              >
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-accent font-mono text-[10px] uppercase tracking-widest">// COMPARISON</span>
                    <GitCompare className="w-4 h-4 text-text-tertiary group-hover:text-accent transition-colors" />
                  </div>
                  <h2 className="text-3xl font-sans font-bold uppercase leading-tight group-hover:text-accent transition-colors">
                    {page.title.split('—')[0]}
                  </h2>
                  <p className="text-text-secondary text-[10px] font-mono uppercase tracking-widest leading-relaxed line-clamp-3 bg-background-elevated/30 p-4 border border-border-slate/30">
                    {page.metaDescription}
                  </p>
                </div>
                
                <div className="relative z-10 pt-8 border-t border-border-slate/30 flex items-center justify-between">
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
    </RegionalProvider>
  );
}
