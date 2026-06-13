import { Metadata } from "next";
import { getMetadata } from "@/lib/metadata";
import { BEST_OF_PAGES_AU } from "@/data/seo/best-au";
import Link from "next/link";
import { ChevronRight, ArrowRight, Star } from "lucide-react";
import { RegionalProvider } from "@/components/layout/RegionalLayout";
import { TrackPageView } from "@/components/admin/TrackPageView";

export const metadata: Metadata = getMetadata({
  title: "Best of Trading Australia — Expert Rankings & Reviews",
  description: "The definitive rankings of the best forex brokers, trading platforms, and tools for Australian traders. Tailored for ASIC compliance.",
  path: "/au/best",
});

export default function AustralianBestIndex() {
  return (
    <RegionalProvider region="au">
      <div className="pt-28 pb-24 bg-white min-h-screen">
        <TrackPageView path="/au/best" />
        <div className="max-w-7xl mx-auto px-6">
          <header className="mb-16 max-w-4xl">
            <span className="text-accent font-mono text-[10px] uppercase tracking-widest block mb-4">// RANKINGS & REVIEWS</span>
            <h1 className="text-5xl md:text-8xl font-sans font-bold uppercase mb-8 leading-tight">
              Best of <br />
              <span className="text-accent">Australia.</span>
            </h1>
            <p className="text-xl text-mkt-i2 leading-relaxed max-w-2xl">
              We rank the best trading gateways, software, and services for the Australian market. Our rankings are updated monthly to ensure you always have the most accurate intelligence.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {BEST_OF_PAGES_AU.map((page) => (
              <Link 
                key={page.slug}
                href={`/au/best/${page.slug}`}
                className="group p-10 bg-white border border-mkt-bd hover:border-mkt-bds/30 transition-premium flex flex-col justify-between h-80"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-[10px] font-mono text-accent uppercase tracking-[0.2em]">{page.eyebrow}</span>
                    <Star className="w-4 h-4 text-mkt-grn group-hover:text-accent transition-colors" />
                  </div>
                  <h3 className="text-3xl font-sans font-bold uppercase group-hover:text-mkt-ink transition-colors">{page.title}</h3>
                  <p className="text-sm text-mkt-i4 mt-4 line-clamp-2">{page.metaDescription}</p>
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
