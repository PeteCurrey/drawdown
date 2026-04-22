import { notFound } from "next/navigation";
import { COMPARE_PAGES_AU } from "@/data/seo/compare-au";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Calendar, Info, Check, ArrowRight } from "lucide-react";
import { TrackPageView } from "@/components/admin/TrackPageView";
import { RegionalProvider } from "@/components/layout/RegionalLayout";
import { getMetadata } from "@/lib/metadata";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return COMPARE_PAGES_AU.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = COMPARE_PAGES_AU.find((p) => p.slug === slug);

  if (!page) return {};

  return getMetadata({
    title: page.title,
    description: page.metaDescription,
    path: `/au/compare/${slug}`,
    hasRegionalVariants: true,
  });
}

export default async function AustralianComparePage({ params }: Props) {
  const { slug } = await params;
  const page = COMPARE_PAGES_AU.find((p) => p.slug === slug);

  if (!page) notFound();

  const brokers = page.slug.split('-vs-');

  return (
    <RegionalProvider region="au">
      <main className="min-h-screen bg-background-primary pt-32 pb-20 px-6">
        <TrackPageView path={`/au/compare/${slug}`} />
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-8">
            <Link href="/au" className="hover:text-accent transition-colors">AU Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/au/compare" className="hover:text-accent transition-colors">Compare</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-text-primary">{page.slug.replace(/-/g, ' ')}</span>
          </nav>

          {/* Header */}
          <div className="text-center space-y-4 mb-16">
            <div className="text-accent font-mono text-xs tracking-[0.2em] uppercase">
              {page.eyebrow}
            </div>
            <h1 className="text-4xl md:text-7xl font-display font-bold leading-tight uppercase">
              {brokers[0]} <span className="text-text-tertiary italic">vs</span> {brokers[1]}
            </h1>
            <p className="text-text-tertiary font-mono text-[10px] uppercase tracking-widest pt-4">Direct Head-to-Head Analysis // Region: Australia</p>
          </div>

          {/* Introduction */}
          <div className="prose prose-invert prose-slate max-w-none mb-16">
            <p className="text-xl text-text-secondary leading-relaxed font-medium text-center max-w-3xl mx-auto">
              {page.introduction}
            </p>
          </div>

          {/* Comparison Matrix */}
          <div className="mb-20">
            <div className="bg-background-elevated border border-border-slate overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border-slate bg-background-surface">
                    <th className="p-6 text-left text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Feature</th>
                    <th className="p-6 text-center text-sm font-display font-bold uppercase">{brokers[0]}</th>
                    <th className="p-6 text-center text-sm font-display font-bold uppercase">{brokers[1]}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-slate/50">
                  {page.comparisonMatrix.map((row) => (
                    <tr key={row.feature} className="hover:bg-background-surface/30 transition-colors">
                      <td className="p-6 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">{row.feature}</td>
                      <td className="p-6 text-center text-sm font-bold text-text-primary">{row.b1}</td>
                      <td className="p-6 text-center text-sm font-bold text-text-primary">{row.b2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Verdict */}
          <section className="bg-background-surface border border-border-slate p-12 relative overflow-hidden mb-20">
            <div className="absolute top-0 left-0 w-2 h-full bg-accent" />
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <Info className="w-6 h-6 text-accent" />
              </div>
              <h2 className="text-2xl font-display font-bold uppercase">The Drawdown Verdict</h2>
            </div>
            <p className="text-lg text-text-secondary leading-relaxed mb-10">
              {page.verdict}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#" className="flex-1 py-4 bg-background-elevated border border-border-slate text-center text-[10px] font-bold uppercase tracking-widest hover:border-accent transition-colors">Visit {brokers[0]}</a>
              <a href="#" className="flex-1 py-4 bg-background-elevated border border-border-slate text-center text-[10px] font-bold uppercase tracking-widest hover:border-accent transition-colors">Visit {brokers[1]}</a>
            </div>
          </section>

          {/* Footer CTA */}
          <section className="text-center space-y-6">
            <h2 className="text-4xl font-display font-bold uppercase">Choose Your Edge.</h2>
            <p className="text-text-tertiary font-mono text-[10px] max-w-md mx-auto uppercase tracking-widest">
              Regardless of the broker you choose, your success depends on your ability to manage risk.
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
