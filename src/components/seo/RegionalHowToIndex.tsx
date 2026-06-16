import Link from "next/link";
import { ArrowRight, ChevronRight, BookOpen } from "lucide-react";
import { TrackPageView } from "@/components/admin/TrackPageView";
import { RegionalProvider } from "@/components/layout/RegionalLayout";
import { Region, REGIONS_MAP } from "@/lib/seo/hreflang";

interface RegionalHowToIndexProps {
  region: Region;
  data: Array<{
    slug: string;
    title: string;
    metaDescription: string;
  }>;
}

export function RegionalHowToIndex({ region, data }: RegionalHowToIndexProps) {
  const regionName = REGIONS_MAP[region].label;

  return (
    <RegionalProvider region={region}>
      <main className="min-h-screen pt-32 pb-20 px-6">
        <TrackPageView path={`/${region}/how-to`} />
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-8">
            <Link href={`/${region}`} className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-text-primary">How-To</span>
          </nav>

          {/* Hero Section */}
          <div className="max-w-3xl mb-16">
            <span className="text-accent font-mono text-[10px] uppercase tracking-widest block mb-4 underline decoration-accent/30 underline-offset-8 decoration-2">// SYSTEMATIC GUIDES</span>
            <h1 className="text-5xl md:text-8xl font-sans font-bold uppercase text-text-primary leading-[0.85] mb-8">
              How-To <br />
              <span className="text-accent">Guides.</span>
            </h1>
            <p className="text-xl text-text-secondary font-sans leading-relaxed">
              Step-by-step instructions to set up accounts, configure charting templates, and execute mechanical systems tailored for traders in {regionName}.
            </p>
          </div>

          {/* Guides Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.map((page) => (
              <Link 
                key={page.slug} 
                href={`/${region}/how-to/${page.slug}`}
                className="group bg-background-surface/40 backdrop-blur-md border border-border-slate/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5 p-10 hover:border-border-slate flex flex-col justify-between h-[380px] relative overflow-hidden"
              >
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-accent font-mono text-[10px] uppercase tracking-widest">// STRATEGY TUTORIAL</span>
                    <BookOpen className="w-4 h-4 text-text-tertiary group-hover:text-accent transition-colors" />
                  </div>
                  <h2 className="text-3xl font-sans font-bold uppercase leading-tight group-hover:text-accent transition-colors">
                    {page.title.split('—')[0]}
                  </h2>
                  <p className="text-text-secondary text-sm leading-relaxed line-clamp-3">
                    {page.metaDescription}
                  </p>
                </div>
                
                <div className="relative z-10 pt-8 border-t border-border-slate/30 flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-text-primary group-hover:text-accent transition-colors">Learn System</span>
                  <ArrowRight className="w-4 h-4 text-text-tertiary group-hover:text-accent group-hover:translate-x-2 transition-all" />
                </div>

                {/* Decorative background circle */}
                <div className="absolute -right-16 -top-16 w-64 h-64 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors duration-700" />
              </Link>
            ))}
          </div>
        </div>
      </main>
    </RegionalProvider>
  );
}
