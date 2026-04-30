import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Calendar, Info, ArrowRight } from "lucide-react";
import { TrackPageView } from "@/components/admin/TrackPageView";
import { RegionalProvider } from "@/components/layout/RegionalLayout";
import { getMetadata } from "@/lib/metadata";

import { Region, REGIONS, REGIONS_MAP } from "@/lib/seo/hreflang";

interface RegionalHowToPageProps {
  region: Region;
  slug: string;
  data: any[];
}

export function RegionalHowToPage({ region, slug, data }: RegionalHowToPageProps) {
  const page = data.find((p) => p.slug === slug);

  if (!page) notFound();

  const regionName = REGIONS_MAP[region].label;

  return (
    <RegionalProvider region={region}>
      <main className="min-h-screen bg-background-primary pt-32 pb-20 px-6">
        <TrackPageView path={`/${region}/how-to/${slug}`} />
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-8">
            <Link href={`/${region}`} className="hover:text-accent transition-colors">{region.toUpperCase()} Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/${region}/how-to`} className="hover:text-accent transition-colors">How-To</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-text-primary">{page.slug.replace(/-/g, ' ')}</span>
          </nav>

          {/* Header */}
          <div className="space-y-4 mb-12">
            <div className="text-accent font-mono text-xs tracking-[0.2em] uppercase">
              {page.eyebrow}
            </div>
            <h1 className="text-4xl md:text-7xl font-display font-bold leading-tight uppercase">
              {page.title}
            </h1>
            <div className="flex items-center space-x-4 text-xs font-mono text-text-tertiary border-y border-border-slate py-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-3 h-3" />
                <span>LAST UPDATED: {page.lastUpdated}</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-border-slate" />
              <span>REGION: {regionName.toUpperCase()}</span>
            </div>
          </div>

          {/* Introduction */}
          <div className="prose prose-invert prose-slate max-w-none mb-16">
            <p className="text-xl text-text-secondary leading-relaxed font-medium">
              {page.introduction}
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-12 mb-20">
            {page.steps.map((step: any, index: number) => (
              <div key={step.title} className="flex gap-8 group">
                <div className="flex-shrink-0 w-12 h-12 bg-background-elevated border border-border-slate flex items-center justify-center font-display font-bold text-accent group-hover:bg-accent group-hover:text-background-primary transition-colors">
                  {index + 1}
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-display font-bold uppercase">{step.title}</h3>
                  <p className="text-text-secondary leading-relaxed text-lg">
                    {step.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Localized Info Box */}
          <section className="mb-20 bg-background-surface border border-border-slate p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1 h-full bg-accent" />
            <div className="flex items-center space-x-3 mb-4">
              <Info className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-display font-bold uppercase tracking-wider">{regionName} Compliance Note</h2>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed font-mono">
              The information in this guide is specific to the {regionName} regulatory and financial landscape. Trading in {regionName} is governed by local authorities, and tax treatment is determined by regional tax laws. Always ensure you are following the latest regional guidelines.
            </p>
          </section>

          {/* FAQs */}
          <section className="mb-20 space-y-8 border-t border-border-slate pt-16">
            <h2 className="text-3xl font-display font-bold uppercase">FAQs</h2>
            <div className="space-y-8">
              {page.faqs.map((faq: any) => (
                <div key={faq.question} className="space-y-3">
                  <h3 className="text-xl font-bold text-text-primary">{faq.question}</h3>
                  <p className="text-text-secondary leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Footer CTA */}
          <section className="bg-background-elevated border border-border-slate p-12 text-center space-y-6">
            <h2 className="text-3xl font-display font-bold uppercase">Master the Markets in {regionName}.</h2>
            <p className="text-text-tertiary font-mono text-xs max-w-md mx-auto uppercase tracking-widest">
              Join the institutional-grade curriculum built for serious {regionName} traders.
            </p>
            <Link href="/signup" className="inline-flex items-center space-x-3 bg-accent text-background-primary px-10 py-5 text-xs font-bold uppercase tracking-[0.2em] hover:bg-accent-hover transition-all">
              <span>Start Phase 1 Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </section>
        </div>
      </main>
    </RegionalProvider>
  );
}
