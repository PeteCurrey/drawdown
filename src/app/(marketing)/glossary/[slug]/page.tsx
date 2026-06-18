import { notFound } from "next/navigation";
import { GLOSSARY_TERMS } from "@/data/seo/glossary";
import { RichBlock } from "@/lib/data/learn-to-trade";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ArrowRight, BookOpen, Calculator, Play } from "lucide-react";
import { TrackPageView } from "@/components/admin/TrackPageView";
import { createClient } from "@/lib/supabase/server";
import {
  StatCallout,
  TradeExample,
  ProTip,
  RiskWarning,
  BrokerCard,
  ToolCard,
} from "@/components/content";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("seo_pages")
      .select("slug")
      .eq("page_type", "glossary");
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      return data.map((page) => ({
        slug: page.slug,
      }));
    }
  } catch (err) {
    console.error("Error in glossary generateStaticParams:", err);
  }

  // Fallback to static local list if DB is empty or fails
  return GLOSSARY_TERMS.map((term) => ({
    slug: term.slug,
  }));
}

async function getGlossaryTerm(slug: string) {
  console.log(`[Glossary] Querying Supabase for slug: ${slug}`);
  try {
    const supabase = await createClient();
    const { data: page, error } = await supabase
      .from("seo_pages")
      .select("*")
      .eq("slug", slug)
      .eq("page_type", "glossary")
      .maybeSingle();

    if (error) {
      console.error(`[Glossary] Supabase fetch error for slug ${slug}:`, error.message);
    }

    if (page) {
      console.log(`[Glossary] Supabase record found for slug: ${slug}`);
      return {
        term: page.title,
        slug: page.slug,
        definition: page.seo_description || "",
        detailedExplanation: page.content || "",
        example: "",
        relatedTerms: ['Pip', 'Spread', 'Lot Size', 'Leverage'].filter((t) => t.toLowerCase() !== page.title.toLowerCase()),
        faqs: [] as any[],
        richBlocks: [] as any[],
        relatedCoursePhase: null,
        relatedTool: null
      };
    }
  } catch (err: any) {
    console.error(`[Glossary] Exception fetching from Supabase for slug ${slug}:`, err.message);
  }

  // Check local data fallback
  console.log(`[Glossary] Checking local GLOSSARY_TERMS for slug: ${slug}`);
  const term = GLOSSARY_TERMS.find((t) => t.slug === slug);
  if (term) {
    console.log(`[Glossary] Local record found for slug: ${slug}`);
    return term;
  }

  console.log(`[Glossary] No record found in Supabase or local data for slug: ${slug}`);
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const glossaryTerm = await getGlossaryTerm(slug);

  if (!glossaryTerm) return {};

  return {
    title: `What is ${glossaryTerm.term}? — Trading Glossary | Drawdown`,
    description: glossaryTerm.definition,
    alternates: {
      canonical: `https://drawdown.trading/glossary/${slug}`,
    },
  };
}


function RichBlockRenderer({ block }: { block: RichBlock }) {
  switch (block.type) {
    case 'statCallout':
      return <StatCallout stat={block.stat} context={block.context} source={block.source} />;
    case 'tradeExample':
      return (
        <TradeExample
          title={block.title}
          instrument={block.instrument}
          session={block.session}
          entry={block.entry}
          stopLoss={block.stopLoss}
          takeProfit={block.takeProfit}
          riskReward={block.riskReward}
          accountSize={block.accountSize}
          riskPercent={block.riskPercent}
          positionSize={block.positionSize}
          result={block.result}
          isProfit={block.isProfit}
        />
      );
    case 'proTip':
      return <ProTip tip={block.tip} />;
    case 'riskWarning':
      return <RiskWarning message={block.message} />;
    case 'brokerCard':
      return (
        <BrokerCard
          brokerSlug={block.brokerSlug}
          brokerName={block.brokerName}
          bestFor={block.bestFor}
          regulation={block.regulation}
          affiliateSlug={block.affiliateSlug}
          stat={block.stat}
        />
      );
    case 'toolCard':
      return (
        <ToolCard
          toolSlug={block.toolSlug}
          toolName={block.toolName}
          description={block.description}
          features={block.features}
          tier={block.tier}
        />
      );
    default:
      return null;
  }
}

export default async function GlossaryTermPage({ params }: Props) {
  const { slug } = await params;
  const glossaryTerm = await getGlossaryTerm(slug);

  if (!glossaryTerm) notFound();

  return (
    <main className="min-h-screen pt-32 pb-20 px-6">
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
          <h1 className="text-5xl md:text-6xl font-sans font-bold leading-tight">
            What is {glossaryTerm.term}?
          </h1>
        </div>

        {/* Quick Definition */}
        <div className="mb-12 p-8 bg-background-elevated/40 border-l-4 border-border-slate/50 relative">
          <div className="absolute top-0 right-0 p-4 opacity-5">
             <BookOpen className="w-16 h-16" />
          </div>
          <p className="text-2xl text-text-primary font-medium leading-relaxed italic">
            {glossaryTerm.definition}
          </p>
        </div>

        {/* Detailed Explanation */}
        <div className="prose prose-invert prose-invert max-w-none mb-16">
          <h2 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-6">In-Depth Explanation</h2>
          <div className="text-text-secondary text-lg leading-relaxed space-y-6 whitespace-pre-wrap">
            {glossaryTerm.detailedExplanation}
          </div>
        </div>

        {/* Rich Blocks */}
        {glossaryTerm.richBlocks && glossaryTerm.richBlocks.length > 0 && (
          <div className="space-y-8 mb-16">
            {glossaryTerm.richBlocks.map((block, index) => (
              <RichBlockRenderer key={index} block={block} />
            ))}
          </div>
        )}

        {/* Practical Example */}
        <section className="mb-16 bg-background-surface/40 backdrop-blur-md border border-border-slate/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5 p-8">
          <h2 className="text-[10px] font-mono uppercase tracking-widest text-accent mb-6 flex items-center space-x-2">
             <Play className="w-3 h-3 fill-accent" />
             <span>Practical Example</span>
          </h2>
          <p className="text-text-secondary font-mono text-sm leading-relaxed italic p-6 border border-border-slate/50">
            &quot;{glossaryTerm.example}&quot;
          </p>
        </section>

        {/* Related Assets */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {glossaryTerm.relatedCoursePhase && (
            <Link href="/learn" className="group p-6 bg-background-elevated/40 border border-border-slate/50 hover:border-border-slate transition-all">
               <span className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary block mb-4">Learn More In</span>
               <h3 className="text-lg font-bold group-hover:text-accent transition-colors">{glossaryTerm.relatedCoursePhase}</h3>
            </Link>
          )}
          {glossaryTerm.relatedTool && (
            <Link href="/tools" className="group p-6 bg-background-elevated/40 border border-border-slate/50 hover:border-border-slate transition-all">
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
                className="px-4 py-2 bg-background-surface/40 backdrop-blur-md border border-border-slate/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5 text-xs font-mono text-text-secondary hover:border-border-slate hover:text-accent transition-all"
              >
                {t}
              </Link>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <section className="bg-accent p-12 text-center space-y-6">
          <h2 className="text-4xl font-sans font-bold text-background-primary uppercase">Master the language of risk</h2>
          <p className="text-background-primary/80 font-mono text-sm max-w-md mx-auto">
            Knowing the terms is just the start. Learning how to apply them is where the edge is found.
          </p>
          <Link href="/signup" className="inline-flex items-center space-x-3 text-text-primary px-10 py-5 text-xs font-bold uppercase tracking-[0.2em] hover:bg-text-primary hover:text-background-primary transition-all">
            <span>Join Drawdown Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </div>
    </main>
  );
}
