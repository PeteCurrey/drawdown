import { notFound } from "next/navigation";
import { GLOSSARY_TERMS } from "@/data/seo/glossary";
import { RichBlock } from "@/lib/data/learn-to-trade";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ArrowRight, BookOpen, Calculator, Play } from "lucide-react";
import { TrackPageView } from "@/components/admin/TrackPageView";
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
  const glossaryTerm = GLOSSARY_TERMS.find((t) => t.slug === slug);

  if (!glossaryTerm) notFound();

  return (
    <main className="min-h-screen bg-white pt-32 pb-20 px-6">
      <TrackPageView path={`/glossary/${slug}`} />
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-mkt-i4 mb-8">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/glossary" className="hover:text-accent transition-colors">Glossary</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-mkt-ink">{glossaryTerm.term}</span>
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
        <div className="mb-12 p-8 bg-[#F7F7F7] border-l-4 border-mkt-bd relative">
          <div className="absolute top-0 right-0 p-4 opacity-5">
             <BookOpen className="w-16 h-16" />
          </div>
          <p className="text-2xl text-mkt-ink font-medium leading-relaxed italic">
            {glossaryTerm.definition}
          </p>
        </div>

        {/* Detailed Explanation */}
        <div className="prose prose-invert prose-slate max-w-none mb-16">
          <h2 className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4 mb-6">In-Depth Explanation</h2>
          <div className="text-mkt-i2 text-lg leading-relaxed space-y-6 whitespace-pre-wrap">
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
        <section className="mb-16 bg-white border border-mkt-bd p-8">
          <h2 className="text-[10px] font-mono uppercase tracking-widest text-accent mb-6 flex items-center space-x-2">
             <Play className="w-3 h-3 fill-accent" />
             <span>Practical Example</span>
          </h2>
          <p className="text-mkt-i2 font-mono text-sm leading-relaxed italic bg-white p-6 border border-mkt-bd">
            &quot;{glossaryTerm.example}&quot;
          </p>
        </section>

        {/* Related Assets */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {glossaryTerm.relatedCoursePhase && (
            <Link href="/learn" className="group p-6 bg-[#F7F7F7] border border-mkt-bd hover:border-mkt-bds transition-all">
               <span className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4 block mb-4">Learn More In</span>
               <h3 className="text-lg font-bold group-hover:text-accent transition-colors">{glossaryTerm.relatedCoursePhase}</h3>
            </Link>
          )}
          {glossaryTerm.relatedTool && (
            <Link href="/tools" className="group p-6 bg-[#F7F7F7] border border-mkt-bd hover:border-mkt-bds transition-all">
               <span className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4 block mb-4">Try the Tool</span>
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
          <h2 className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4 mb-6">Related Terms</h2>
          <div className="flex flex-wrap gap-3">
            {glossaryTerm.relatedTerms.map((t) => (
              <Link 
                key={t} 
                href={`/glossary/${t.toLowerCase().replace(/ /g, '-')}`}
                className="px-4 py-2 bg-white border border-mkt-bd text-xs font-mono text-mkt-i2 hover:border-mkt-bds hover:text-accent transition-all"
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
          <Link href="/signup" className="inline-flex items-center space-x-3 bg-white text-mkt-ink px-10 py-5 text-xs font-bold uppercase tracking-[0.2em] hover:bg-text-primary hover:text-background-primary transition-all">
            <span>Join Drawdown Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </div>
    </main>
  );
}
