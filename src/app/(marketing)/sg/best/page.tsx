import { Metadata } from "next";
import { getMetadata } from "@/lib/metadata";
import { BEST_OF_PAGES_SG } from "@/data/seo/sg-data";
import Link from "next/link";
import { ChevronRight, ArrowRight, Star } from "lucide-react";
import { RegionalProvider } from "@/components/layout/RegionalLayout";
import { TrackPageView } from "@/components/admin/TrackPageView";

export const metadata: Metadata = getMetadata({
  title: "Best of Trading Singapore — Expert Rankings & Reviews",
  description: "The definitive rankings of the best forex brokers and trading tools for Singapore traders. Tailored for MAS compliance.",
  path: "/sg/best",
});

export default function SGBestIndex() {
  return (
    <RegionalProvider region="sg">
      <div className="pt-32 pb-24 bg-background-primary min-h-screen">
        <TrackPageView path="/sg/best" />
        <div className="container mx-auto px-6">
          <header className="mb-16 max-w-4xl">
            <span className="text-accent font-mono text-[10px] uppercase tracking-widest block mb-4">// RANKINGS & REVIEWS</span>
            <h1 className="text-5xl md:text-8xl font-display font-bold uppercase mb-8 leading-tight">
              Best of <br />
              <span className="text-accent">Singapore.</span>
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed max-w-2xl">
              We rank the best trading gateways and software for the Singapore market. Our rankings focus on MAS regulatory security and institutional performance.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {BEST_OF_PAGES_SG.map((page) => (
              <Link 
                key={page.slug}
                href={`/sg/best/${page.slug}`}
                className="group p-10 bg-background-surface border border-border-slate hover:border-accent/30 transition-premium flex flex-col justify-between h-80"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-[10px] font-mono text-accent uppercase tracking-[0.2em]">{page.eyebrow}</span>
                    <Star className="w-4 h-4 text-accent/20 group-hover:text-accent transition-colors" />
                  </div>
                  <h3 className="text-3xl font-display font-bold uppercase group-hover:text-text-primary transition-colors">{page.title}</h3>
                  <p className="text-sm text-text-tertiary mt-4 line-clamp-2">{page.metaDescription}</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-accent group-hover:translate-x-2 transition-transform">
                  View Rankings <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </RegionalProvider>
  );
}
