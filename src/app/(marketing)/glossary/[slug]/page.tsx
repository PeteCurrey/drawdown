import { notFound } from "next/navigation";
import { GLOSSARY_TERMS } from "@/data/seo/glossary";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ArrowRight, BookOpen, Calculator, Play } from "lucide-react";
import { TrackPageView } from "@/components/admin/TrackPageView";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return GLOSSARY_TERMS.map((term) => ({
    slug: term.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const glossaryTerm = GLOSSARY_TERMS.find((t) => t.slug === slug);

  if (!glossaryTerm) return {};

  return {
    title: `What is ${glossaryTerm.term}? — Trading Glossary | Drawdown`,
    description: glossaryTerm.definition,
    alternates: {
      canonical: `https://drawdown.trading/glossary/${slug}`,
    },
  };
}

export default async function GlossaryTermPage({ params }: Props) {
  const { slug } = await params;
  const glossaryTerm = GLOSSARY_TERMS.find((t) => t.slug === slug);

  if (!glossaryTerm) notFound();

  return (
    <main className="min-h-screen bg-background-primary pt-32 pb-20 px-6">
      <TrackPageView path={`/glossary/${slug}`} />
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-8">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/glossary" className="hover:text-accent transition-colors">Glossary</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-text-primary">{glossaryTerm.term}</span>
        </nav>

        {/* Header */}
        <div className="space-y-4 mb-12">
          <div className="text-accent font-mono text-[10px] tracking-[0.3em] uppercase">
            // TRADING TERMINOLOGY
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold leading-tight">
            What is {glossaryTerm.term}?
          </h1>
        </div>

        {/* Quick Definition */}
        <div className="mb-12 p-8 bg-background-elevated border-l-4 border-accent relative">
          <div className="absolute top-0 right-0 p-4 opacity-5">
             <BookOpen className="w-16 h-16" />
          </div>
          <p className="text-2xl text-text-primary font-medium leading-relaxed italic">
            {glossaryTerm.definition}
          </p>
        </div>

        {/* Detailed Explanation */}
        <div className="prose prose-invert prose-slate max-w-none mb-16">
          <h2 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-6">In-Depth Explanation</h2>
          <div className="text-text-secondary text-lg leading-relaxed space-y-6">
            {glossaryTerm.detailedExplanation}
          </div>
        </div>

        {/* Practical Example */}
        <section className="mb-16 bg-background-surface border border-border-slate p-8">
          <h2 className="text-[10px] font-mono uppercase tracking-widest text-accent mb-6 flex items-center space-x-2">
             <Play className="w-3 h-3 fill-accent" />
             <span>Practical Example</span>
          </h2>
          <p className="text-text-secondary font-mono text-sm leading-relaxed italic bg-background-primary p-6 border border-border-slate">
            &quot;{glossaryTerm.example}&quot;
          </p>
        </section>

        {/* Related Assets */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {glossaryTerm.relatedCoursePhase && (
            <Link href="/learn" className="group p-6 bg-background-elevated border border-border-slate hover:border-accent transition-all">
               <span className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary block mb-4">Learn More In</span>
               <h3 className="text-lg font-bold group-hover:text-accent transition-colors">{glossaryTerm.relatedCoursePhase}</h3>
            </Link>
          )}
          {glossaryTerm.relatedTool && (
            <Link href="/tools" className="group p-6 bg-background-elevated border border-border-slate hover:border-accent transition-all">
               <span className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary block mb-4">Try the Tool</span>
               <h3 className="text-lg font-bold group-hover:text-accent transition-colors">{glossaryTerm.relatedTool}</h3>
               <div className="mt-4 flex items-center space-x-2 text-accent">
                 <Calculator className="w-4 h-4" />
                 <span className="text-[10px] font-mono uppercase tracking-widest">Launch Tool</span>
               </div>
            </Link>
          )}
        </div>

        {/* Related Terms */}
        <div className="mb-20">
          <h2 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-6">Related Terms</h2>
          <div className="flex flex-wrap gap-3">
            {glossaryTerm.relatedTerms.map((t) => (
              <Link 
                key={t} 
                href={`/glossary/${t.toLowerCase().replace(/ /g, '-')}`}
                className="px-4 py-2 bg-background-surface border border-border-slate text-xs font-mono text-text-secondary hover:border-accent hover:text-accent transition-all"
              >
                {t}
              </Link>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <section className="bg-accent p-12 text-center space-y-6">
          <h2 className="text-4xl font-display font-bold text-background-primary uppercase">Master the language of risk</h2>
          <p className="text-background-primary/80 font-mono text-sm max-w-md mx-auto">
            Knowing the terms is just the start. Learning how to apply them is where the edge is found.
          </p>
          <Link href="/signup" className="inline-flex items-center space-x-3 bg-background-primary text-text-primary px-10 py-5 text-xs font-bold uppercase tracking-[0.2em] hover:bg-text-primary hover:text-background-primary transition-all">
            <span>Join Drawdown Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </div>
    </main>
  );
}
