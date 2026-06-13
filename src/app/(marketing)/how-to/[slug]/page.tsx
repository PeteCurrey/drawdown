import { notFound } from "next/navigation";

export const dynamic = "force-static";
export const dynamicParams = true;
import { HOW_TO_PAGES } from "@/data/seo/howto";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Clock, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import { TrackPageView } from "@/components/admin/TrackPageView";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return HOW_TO_PAGES.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = HOW_TO_PAGES.find((p) => p.slug === slug);

  if (!page) return {};

  return {
    title: page.title,
    description: page.metaDescription,
    alternates: {
      canonical: `https://drawdown.trading/how-to/${slug}`,
    },
  };
}

export default async function HowToPage({ params }: Props) {
  const { slug } = await params;
  const page = HOW_TO_PAGES.find((p) => p.slug === slug);

  if (!page) notFound();

  return (
    <main className="min-h-screen bg-white pt-32 pb-20 px-6">
      <TrackPageView path={`/how-to/${slug}`} />
      
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-mkt-i4 mb-8">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/how-to" className="hover:text-accent transition-colors">How-To</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-mkt-ink">{page.slug.replace(/-/g, ' ')}</span>
        </nav>

        {/* Header */}
        <div className="space-y-6 mb-16">
          <div className="flex items-center space-x-3">
            <span className="text-accent font-mono text-xs tracking-[0.2em] uppercase">
              {page.eyebrow}
            </span>
            <div className="flex items-center space-x-2 text-[10px] font-mono text-mkt-i4 border-l border-mkt-bd pl-3">
              <Clock className="w-3 h-3" />
              <span>{page.readingTime} READ</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-8xl font-sans font-bold leading-[0.9] uppercase tracking-tighter text-mkt-ink">
            {page.title}
          </h1>
          <p className="text-xl text-mkt-i2 leading-relaxed max-w-2xl font-sans italic border-l-2 border-mkt-bd pl-6 py-2">
            {page.introduction}
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-24 mb-24">
          {page.steps.map((step, index) => (
            <section key={step.title} className="relative group">
              <div className="absolute -left-12 top-0 text-8xl font-sans font-black text-mkt-grn select-none transition-colors group-hover:text-mkt-grn">
                0{index + 1}
              </div>
              <div className="relative space-y-6">
                <h2 className="text-3xl md:text-4xl font-sans font-bold uppercase tracking-tight text-mkt-ink pt-4">
                  {step.title}
                </h2>
                <div className="text-mkt-i2 leading-relaxed text-lg whitespace-pre-line">
                  {step.content}
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Common Mistakes */}
        <section className="mb-24 p-10 bg-loss/5 border border-loss/20 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 text-red-500 mb-8">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-xs font-mono uppercase font-bold tracking-[0.3em]">Common Mistakes to Avoid</h3>
            </div>
            <ul className="grid md:grid-cols-2 gap-6">
              {page.commonMistakes.map((mistake, i) => (
                <li key={i} className="flex items-start space-x-3 text-sm text-mkt-i2">
                  <span className="text-red-500 font-bold mt-0.5">/</span>
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Drawdown Approach */}
        <section className="mb-24 p-10 bg-white border border-mkt-bd flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-xs font-mono uppercase tracking-[0.3em] text-accent">The Drawdown Way</h3>
            <p className="text-mkt-ink font-medium max-w-lg leading-relaxed">
              {page.drawdownApproach.text || page.drawdownApproach.content}
            </p>
          </div>
          <Link 
            href={page.drawdownApproach.link || page.drawdownApproach.ctaLink || "#"}
            className="whitespace-nowrap px-8 py-4 bg-text-primary text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent hover:text-background-primary transition-all"
          >
            {page.drawdownApproach.linkText || page.drawdownApproach.ctaText || "Learn More"}
          </Link>
        </section>

        {/* FAQs */}
        <section className="mb-24 space-y-12">
          <h2 className="text-4xl font-sans font-bold uppercase text-mkt-ink">Questions & Answers.</h2>
          <div className="space-y-4">
            {page.faqs.map((faq) => (
              <div key={faq.question} className="border border-mkt-bd p-8 hover:border-mkt-bds/30 transition-colors bg-white/30">
                <h3 className="text-xl font-bold mb-4 uppercase tracking-tight">{faq.question}</h3>
                <p className="text-mkt-i2 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-accent p-16 text-center space-y-8 relative overflow-hidden group">
          <div className="relative z-10 space-y-6">
            <h2 className="  font-sans font-bold text-background-primary uppercase tracking-tighter">
              Ready to trade the truth?
            </h2>
            <p className="text-background-primary/80 font-mono text-sm max-w-md mx-auto">
              Stop guessing. Start learning with Drawdown and master the business of managing risk.
            </p>
            <Link 
              href="/signup" 
              className="inline-flex items-center space-x-4 bg-white text-mkt-ink px-12 py-6 text-xs font-bold uppercase tracking-[0.2em] hover:invert transition-all"
              id="how-to-final-cta"
            >
              <span>Join Drawdown Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-1000" />
        </section>
      </div>
    </main>
  );
}
