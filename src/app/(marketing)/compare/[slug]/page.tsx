import { notFound } from "next/navigation";
import { COMPARISON_PAGES } from "@/data/seo/compare";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ArrowRight, Check, ShieldCheck, Zap } from "lucide-react";
import { TrackPageView } from "@/components/admin/TrackPageView";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return COMPARISON_PAGES.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = COMPARISON_PAGES.find((p) => p.slug === slug);

  if (!page) return {};

  return {
    title: page.title,
    description: page.metaDescription,
    alternates: {
      canonical: `https://drawdown.trading/compare/${slug}`,
    },
  };
}

export default async function ComparisonPage({ params }: Props) {
  const { slug } = await params;
  const page = COMPARISON_PAGES.find((p) => p.slug === slug);

  if (!page) notFound();

  return (
    <main className="min-h-screen pt-32 pb-20 px-6">
      <TrackPageView path={`/compare/${slug}`} />
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-8">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/compare" className="hover:text-accent transition-colors">Compare</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-text-primary">{page.slug.replace(/-/g, ' vs ')}</span>
        </nav>

        {/* Header */}
        <div className="space-y-4 mb-12 text-center">
          <div className="text-accent font-mono text-xs tracking-[0.2em] uppercase">
            {page.eyebrow}
          </div>
          <h1 className="font-sans font-bold leading-tight uppercase tracking-tighter">
            {page.title}
          </h1>
        </div>

        {/* Quick Verdict */}
        <div className="mb-16 bg-background-elevated/40 border border-border-slate/50/20 p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <ShieldCheck className="w-12 h-12 text-profit" />
          </div>
          <h2 className="text-[10px] font-mono uppercase tracking-[0.3em] text-accent mb-4">The Drawdown Verdict</h2>
          <div className="space-y-4">
            <h3 className="text-2xl font-sans font-bold">Best Choice: <span className="text-accent uppercase">{page.quickVerdict.winner}</span></h3>
            <p className="text-text-secondary text-lg leading-relaxed italic">
              &quot;{page.quickVerdict.reason}&quot;
            </p>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mb-16 overflow-hidden border border-border-slate/50">
          <div className="grid grid-cols-3 bg-background-elevated/40 border-b border-border-slate/50">
            <div className="p-6 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Feature</div>
            <div className="p-6 text-center font-sans font-bold uppercase tracking-wider text-accent border-x border-border-slate/50">Option A</div>
            <div className="p-6 text-center font-sans font-bold uppercase tracking-wider text-accent">Option B</div>
          </div>
          {page.comparisonTable.map((row) => (
            <div key={row.feature} className="grid grid-cols-3 border-b border-border-slate/50 last:border-b-0 hover:bg-background-elevated/50 transition-colors">
              <div className="p-6 text-xs font-mono text-text-tertiary flex items-center uppercase tracking-widest">{row.feature}</div>
              <div className="p-6 text-center text-sm font-medium border-x border-border-slate/50">{row.optionA}</div>
              <div className="p-6 text-center text-sm font-medium">{row.optionB}</div>
            </div>
          ))}
        </div>

        {/* Sections */}
        <div className="space-y-16 mb-20">
          {page.sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-3xl font-sans font-bold mb-6 uppercase tracking-tight">{section.title}</h2>
              <div className="prose prose-invert prose-slate max-w-none text-text-secondary text-lg leading-relaxed">
                {section.content}
              </div>
            </section>
          ))}
        </div>

        {/* Choice Guides */}
        {(page.whoShouldChooseA || page.whoShouldChooseB) && (
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {page.whoShouldChooseA && (
              <div className="bg-background-elevated/40 border border-border-slate/50 p-8">
                <h3 className="text-lg font-sans font-bold mb-6 uppercase tracking-widest flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-accent" />
                  <span>Choose Option A If...</span>
                </h3>
                <ul className="space-y-4">
                  {page.whoShouldChooseA.map((point) => (
                    <li key={point} className="flex items-start space-x-3 text-sm text-text-secondary">
                      <Check className="w-4 h-4 text-profit mt-1 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {page.whoShouldChooseB && (
              <div className="bg-background-elevated/40 border border-border-slate/50 p-8">
                <h3 className="text-lg font-sans font-bold mb-6 uppercase tracking-widest flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-accent" />
                  <span>Choose Option B If...</span>
                </h3>
                <ul className="space-y-4">
                  {page.whoShouldChooseB.map((point) => (
                    <li key={point} className="flex items-start space-x-3 text-sm text-text-secondary">
                      <Check className="w-4 h-4 text-profit mt-1 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Footer CTA */}
        <section className="bg-accent p-12 text-center space-y-6">
          <h2 className="text-4xl font-sans font-bold text-background-primary uppercase">Trade the right way</h2>
          <p className="text-background-primary/80 font-mono text-sm max-w-md mx-auto">
            Whichever tool you choose, the strategy remains the same: manage your risk or the market will do it for you.
          </p>
          <Link href="/signup" className="inline-flex items-center space-x-3 text-text-primary px-10 py-5 text-xs font-bold uppercase tracking-[0.2em] hover:invert transition-all">
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </div>
    </main>
  );
}
