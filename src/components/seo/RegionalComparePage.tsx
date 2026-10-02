import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Calendar, Info, ArrowRight } from "lucide-react";
import { TrackPageView } from "@/components/admin/TrackPageView";
import { RegionalProvider } from "@/components/layout/RegionalLayout";
import { getMetadata } from "@/lib/metadata";

import { Region, REGIONS, REGIONS_MAP } from "@/lib/seo/hreflang";

interface RegionalComparePageProps {
  region: Region;
  slug: string;
  data: any[];
}

export function RegionalComparePage({ region, slug, data }: RegionalComparePageProps) {
  const page = data.find((p) => p.slug === slug);

  if (!page) notFound();

  const brokers = page.slug.split('-vs-');
  const regionName = REGIONS_MAP[region].label;

  return (
    <RegionalProvider region={region}>
      <main className="min-h-screen bg-white pt-32 pb-20 px-6">
        <TrackPageView path={`/${region}/compare/${slug}`} />
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-mkt-i4 mb-8">
            <Link href={`/${region}`} className="hover:text-accent transition-colors">{region.toUpperCase()} Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/${region}/compare`} className="hover:text-accent transition-colors">Compare</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-mkt-ink">{page.slug.replace(/-/g, ' ')}</span>
          </nav>

          {/* Header */}
          <div className="text-center space-y-4 mb-16">
            <div className="text-accent font-mono text-xs tracking-[0.2em] uppercase">
              {page.eyebrow}
            </div>
            <h1 className="text-4xl md:text-7xl font-sans font-bold leading-tight uppercase">
              {brokers[0].toUpperCase()} <span className="text-mkt-i4 italic">vs</span> {brokers[1].toUpperCase()}
            </h1>
            <p className="text-mkt-i4 font-mono text-[10px] uppercase tracking-widest pt-4">Direct Head-to-Head Analysis // Region: {regionName}</p>
          </div>

          {/* Introduction */}
          {page.introduction && (
            <div className="prose prose-invert prose-slate max-w-none mb-16">
              <p className="text-xl text-mkt-i2 leading-relaxed font-medium text-center max-w-3xl mx-auto italic">
                &quot;{page.introduction}&quot;
              </p>
            </div>
          )}

          {/* Comparison Matrix */}
          {page.comparisonMatrix && page.comparisonMatrix.length > 0 && (
            <div className="mb-20">
              <div className="bg-[#F7F7F7] border border-mkt-bd overflow-hidden">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-mkt-bd bg-white">
                      <th className="p-6 text-left text-[10px] font-mono uppercase tracking-widest text-mkt-i4">Feature</th>
                      <th className="p-6 text-center text-sm font-sans font-bold uppercase">{brokers[0]}</th>
                      <th className="p-6 text-center text-sm font-sans font-bold uppercase">{brokers[1]}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-slate/50">
                    {page.comparisonMatrix.map((row: any) => (
                      <tr key={row.feature} className="hover:bg-white/30 transition-colors">
                        <td className="p-6 text-[10px] font-mono uppercase tracking-widest text-mkt-i4">{row.feature}</td>
                        <td className="p-6 text-center text-sm font-bold text-mkt-ink">{row.b1}</td>
                        <td className="p-6 text-center text-sm font-bold text-mkt-ink">{row.b2}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Verdict */}
          {page.verdict && (
            <section className="bg-white border border-mkt-bd p-12 relative overflow-hidden mb-20">
              <div className="absolute top-0 left-0 w-2 h-full bg-accent" />
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <Info className="w-6 h-6 text-accent" />
                </div>
                <h2 className="text-2xl font-sans font-bold uppercase">The Drawdown Verdict</h2>
              </div>
              <p className="text-lg text-mkt-i2 leading-relaxed mb-10">
                {page.verdict}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#" className="flex-1 py-4 bg-[#F7F7F7] border border-mkt-bd text-center text-[10px] font-bold uppercase tracking-widest hover:border-mkt-bds transition-colors">Visit {brokers[0].toUpperCase()}</a>
                <a href="#" className="flex-1 py-4 bg-[#F7F7F7] border border-mkt-bd text-center text-[10px] font-bold uppercase tracking-widest hover:border-mkt-bds transition-colors">Visit {brokers[1].toUpperCase()}</a>
              </div>
            </section>
          )}

          {/* Footer CTA */}
          <section className="text-center space-y-6">
            <h2 className="text-4xl font-sans font-bold uppercase">Choose Your Edge.</h2>
            <p className="text-mkt-i4 font-mono text-[10px] max-w-md mx-auto uppercase tracking-widest">
              Regardless of the broker you choose, your success depends on your ability to manage risk correctly.
            </p>
            <Link href="/courses" className="inline-flex items-center space-x-3 text-accent hover:underline text-xs font-bold uppercase tracking-[0.2em]">
              <span>Master Risk Management</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </section>
        </div>
      </main>
    </RegionalProvider>
  );
}
