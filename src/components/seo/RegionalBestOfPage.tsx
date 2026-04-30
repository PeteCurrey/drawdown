import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Calendar, Star, Info, Check, X, ArrowRight } from "lucide-react";
import { TrackPageView } from "@/components/admin/TrackPageView";
import { RegionalProvider } from "@/components/layout/RegionalLayout";
import { getMetadata } from "@/lib/metadata";

import { Region, REGIONS, REGIONS_MAP } from "@/lib/seo/hreflang";

interface RegionalBestOfPageProps {
  region: Region;
  slug: string;
  data: any[];
}

export function RegionalBestOfPage({ region, slug, data }: RegionalBestOfPageProps) {
  const page = data.find((p) => p.slug === slug);

  if (!page) notFound();

  const regionName = REGIONS_MAP[region].label;

  return (
    <RegionalProvider region={region}>
      <main className="min-h-screen bg-background-primary pt-32 pb-20 px-6">
        <TrackPageView path={`/${region}/best/${slug}`} />
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-8">
            <Link href={`/${region}`} className="hover:text-accent transition-colors">{region.toUpperCase()} Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/${region}/best`} className="hover:text-accent transition-colors">Best</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-text-primary">{page.slug.replace(/-/g, ' ')}</span>
          </nav>

          {/* Header */}
          <div className="space-y-4 mb-12">
            <div className="text-accent font-mono text-xs tracking-[0.2em] uppercase">
              {page.eyebrow}
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight uppercase">
              {page.title}
            </h1>
            <div className="flex items-center space-x-4 text-xs font-mono text-text-tertiary border-y border-border-slate py-4">
              {page.lastUpdated && (
                <>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3 h-3" />
                    <span>LAST UPDATED: {page.lastUpdated}</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-border-slate" />
                </>
              )}
              <span>REGION: {regionName.toUpperCase()}</span>
            </div>
          </div>

          {/* Introduction */}
          <div className="prose prose-invert prose-slate max-w-none mb-12">
            <p className="text-lg text-text-secondary leading-relaxed font-medium italic border-l-2 border-accent pl-6">
              {page.introduction}
            </p>
          </div>

          {/* Comparison Table */}
          {page.comparisonTable && page.comparisonTable.length > 0 && (
            <div className="mb-16 overflow-x-auto">
              <table className="w-full border-collapse bg-background-elevated border border-border-slate">
                <thead>
                  <tr className="border-b border-border-slate bg-background-surface">
                    <th className="p-4 text-left text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Rank</th>
                    <th className="p-4 text-left text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Name</th>
                    <th className="p-4 text-left text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Best For</th>
                    <th className="p-4 text-left text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Key Stat</th>
                    <th className="p-4 text-left text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Rating</th>
                    <th className="p-4 text-right text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {page.comparisonTable.map((item: any) => (
                    <tr key={item.rank} className="border-b border-border-slate hover:bg-background-surface/50 transition-colors">
                      <td className="p-4 font-mono text-accent">#{item.rank}</td>
                      <td className="p-4 font-bold">{item.name}</td>
                      <td className="p-4 text-sm text-text-secondary">{item.bestFor}</td>
                      <td className="p-4 text-sm font-mono">{item.keyStat}</td>
                      <td className="p-4">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-accent fill-accent" />
                          <span className="text-sm font-bold">{item.rating}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <a href={item.link} className="inline-block bg-accent px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-background-primary hover:bg-accent-hover transition-colors">
                          Visit Site
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Detailed Reviews */}
          {page.reviews && page.reviews.length > 0 && (
            <div className="space-y-16 mb-20">
              {page.reviews.map((review: any, index: number) => (
                <div key={review.name} className="scroll-mt-32 border border-border-slate bg-background-elevated p-8 md:p-12 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 text-8xl font-display font-bold text-accent/5 select-none group-hover:text-accent/10 transition-colors">
                    0{index + 1}
                  </div>
                  
                  <h2 className="text-3xl font-display font-bold mb-6">{review.name} Review</h2>
                  <p className="text-text-secondary leading-relaxed mb-8 text-lg">
                    {review.description}
                  </p>

                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-4">
                      <h3 className="text-[10px] font-mono uppercase tracking-widest text-profit flex items-center space-x-2">
                        <Check className="w-3 h-3" />
                        <span>What we like</span>
                      </h3>
                      <ul className="space-y-2">
                        {review.pros && review.pros.map((pro: string) => (
                          <li key={pro} className="text-sm text-text-secondary flex items-start space-x-2">
                            <span className="text-profit mt-1">•</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-[10px] font-mono uppercase tracking-widest text-loss flex items-center space-x-2">
                        <X className="w-3 h-3" />
                        <span>Limitation</span>
                      </h3>
                      <ul className="space-y-2">
                        {review.cons && review.cons.map((con: string) => (
                          <li key={con} className="text-sm text-text-secondary flex items-start space-x-2">
                            <span className="text-loss mt-1">•</span>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-border-slate flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary block mb-1">Best For</span>
                      <span className="font-bold text-accent uppercase tracking-wider">{review.bestFor}</span>
                    </div>
                    <a href={review.ctaLink} className="bg-text-primary text-background-primary px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-accent hover:text-background-primary transition-all text-center">
                      Open Account with {review.name}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Methodology */}
          {page.methodology && (
            <section className="mb-20 bg-background-surface border border-border-slate p-8">
              <div className="flex items-center space-x-3 mb-4">
                <Info className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-display font-bold uppercase tracking-wider">Our Methodology</h2>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed font-mono">
                {page.methodology}
              </p>
            </section>
          )}

          {/* FAQs */}
          {page.faqs && page.faqs.length > 0 && (
            <section className="mb-20 space-y-8">
              <h2 className="text-3xl font-display font-bold uppercase">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {page.faqs.map((faq: any) => (
                  <div key={faq.question} className="border border-border-slate p-6 hover:border-accent transition-colors">
                    <h3 className="text-lg font-bold mb-3">{faq.question}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Footer CTA */}
          <section className="bg-accent p-12 text-center space-y-6">
            <h2 className="text-4xl font-display font-bold text-background-primary uppercase">Trade properly in {regionName}.</h2>
            <p className="text-background-primary/80 font-mono text-sm max-w-md mx-auto">
              Master the business of risk with Drawdown&apos;s institutional-grade education.
            </p>
            <Link href="/signup" className="inline-flex items-center space-x-3 bg-background-primary text-text-primary px-10 py-5 text-xs font-bold uppercase tracking-[0.2em] hover:bg-text-primary hover:text-background-primary transition-all">
              <span>Join Drawdown Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </section>
        </div>
      </main>
    </RegionalProvider>
  );
}
