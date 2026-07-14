import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { 
  Check, 
  X, 
  ExternalLink, 
  ChevronRight, 
  HelpCircle, 
  Star, 
  Wrench,
  AlertTriangle 
} from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { TrackPageView } from "@/components/admin/TrackPageView";
import { LeadMagnet } from "@/components/seo/LeadMagnet";
import { tradingTools } from "@/data/trading-tools";

export const dynamicParams = true;
export const revalidate = 3600; // hourly cache revalidation

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = tradingTools.find((t) => t.slug === slug);

  if (!tool) return {};

  return {
    title: `${tool.name} Review 2026 — Is It Still the Best? | Drawdown`,
    description: `Complete 2026 review of ${tool.name}. We analyze features, pros and cons, pricing, and suitability for active traders.`,
  };
}

export default async function TradingToolReviewPage({ params }: Props) {
  const { slug } = await params;
  const tool = tradingTools.find((t) => t.slug === slug);

  if (!tool) notFound();

  return (
    <div className="min-h-screen pb-24 pt-32 bg-background-primary text-text-primary">
      <TrackPageView path={`/trading-tools/${slug}`} />
      <div className="container mx-auto px-6 max-w-5xl">
        <Breadcrumbs 
          items={[
            { label: "Trading Tools", href: "/trading-tools" },
            { label: `${tool.name} Review`, href: `/trading-tools/${tool.slug}` }
          ]}
        />

        {/* Hero */}
        <div className="max-w-4xl mb-12">
          <div className="flex items-center gap-3 text-accent mb-6">
            <Wrench className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">{tool.category} Tool Review</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-sans font-black uppercase mb-8 leading-tight">
            {tool.name} Review 2026 — <span className="text-accent italic">Pete's Honest Take.</span>
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed max-w-2xl font-sans font-light">
            {tool.tagline}
          </p>
        </div>

        {/* Quick Verdict Box */}
        <div className="bg-background-surface/40 border border-border-slate/50 backdrop-blur-md p-8 md:p-12 mb-24 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 text-9xl font-sans font-black text-accent/5 select-none uppercase pointer-events-none">VERDICT</div>
          <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/4 flex flex-col items-center border-b md:border-b-0 md:border-r border-border-slate/50 pb-8 md:pb-0 md:pr-12">
              <div className="w-20 h-20 bg-background-primary border border-border-slate/50 flex items-center justify-center text-3xl font-black mb-4">
                {tool.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex items-center gap-1 mb-2 text-accent">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(tool.rating) ? "fill-current" : "text-text-tertiary"}`} />
                ))}
              </div>
              <span className="text-2xl font-sans font-black">{tool.rating} / 5.0</span>
            </div>
            <div className="md:w-1/2">
              <h3 className="text-xl font-sans font-black uppercase mb-4 flex items-center gap-3">
                <span className="text-accent">//</span> Pete's Take
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed italic mb-0">
                "{tool.verdict}"
              </p>
            </div>
            <div className="md:w-1/4 w-full">
              <a 
                href={tool.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-5 bg-mkt-ink text-white text-center text-[10px] font-black uppercase tracking-widest hover:bg-accent-hover transition-premium flex items-center justify-center gap-2"
              >
                Visit official Site <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-24">
            {/* Overview */}
            <section id="overview" className="scroll-mt-32">
              <h2 className="text-3xl font-sans font-black uppercase mb-8 flex items-center gap-4">
                <span className="text-accent text-sm font-mono tracking-tighter">01 //</span> Overview
              </h2>
              <div className="prose prose-invert prose-invert max-w-none text-text-secondary leading-relaxed space-y-6">
                <p className="whitespace-pre-line">{tool.overview}</p>
              </div>
            </section>

            {/* Specs Table */}
            <section id="specs" className="scroll-mt-32">
              <h2 className="text-3xl font-sans font-black uppercase mb-8 flex items-center gap-4">
                <span className="text-accent text-sm font-mono tracking-tighter">02 //</span> Specifications
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border-slate/50">
                  <tbody className="text-[10px] font-mono uppercase">
                    {[
                      { label: "Product Name", value: tool.name },
                      { label: "Category", value: tool.category },
                      { label: "Pricing Model", value: tool.pricing },
                      { label: "Rating Score", value: `${tool.rating} / 5.0` }
                    ].map((stat, i) => (
                      <tr key={i} className="border-b border-border-slate/50/50">
                        <td className="p-6 text-left font-bold border-r border-border-slate/50 bg-background-primary/30 w-1/3">{stat.label}</td>
                        <td className="p-6 text-text-primary">{stat.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Pros & Cons */}
            <section id="pros-cons" className="scroll-mt-32 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-xl font-sans font-black uppercase flex items-center gap-3">
                  <span className="text-mkt-grn">//</span> What We Like
                </h3>
                <ul className="space-y-4">
                  {tool.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text-secondary leading-relaxed">
                      <Check className="w-5 h-5 text-mkt-grn mt-0.5 shrink-0" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-6">
                <h3 className="text-xl font-sans font-black uppercase flex items-center gap-3">
                  <span className="text-red-500">//</span> What We Don't Like
                </h3>
                <ul className="space-y-4">
                  {tool.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text-secondary leading-relaxed">
                      <X className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* FAQs */}
            {tool.faqs && tool.faqs.length > 0 && (
              <section id="faq" className="scroll-mt-32 border-t border-border-slate/50 pt-24">
                <h2 className="text-3xl font-sans font-black uppercase mb-12 flex items-center gap-4">
                  <HelpCircle className="w-8 h-8 text-accent" /> Frequently Asked Questions
                </h2>
                <div className="space-y-8">
                  {tool.faqs.map((faq, i) => (
                    <div key={i} className="border-b border-border-slate/50 pb-8">
                      <h3 className="text-lg font-bold text-text-primary uppercase tracking-tight mb-4">{faq.question}</h3>
                      <p className="text-sm text-text-secondary leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Lead Magnet */}
            <div className="border-t border-border-slate/50 pt-24">
              <LeadMagnet 
                resourceId="journal-template" 
                title="Download the Drawdown Trading Journal Template"
                description="Maximize your journaling efficiency. Sync metrics, trace expectancy, and review consecutive streaks."
              />
            </div>
          </div>

          {/* Sidebar TOC */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-8">
              <div className="p-8 bg-background-surface/40 border border-border-slate/50 backdrop-blur-md">
                <h4 className="text-[10px] font-mono font-black uppercase tracking-widest text-text-tertiary mb-6">// ON THIS PAGE</h4>
                <nav className="space-y-4">
                  {[
                    { id: "overview", label: "Overview" },
                    { id: "specs", label: "Specifications" },
                    { id: "pros-cons", label: "Pros & Cons" },
                    ...(tool.faqs && tool.faqs.length > 0 ? [{ id: "faq", label: "FAQs" }] : [])
                  ].map((item) => (
                    <a 
                      key={item.id} 
                      href={`#${item.id}`} 
                      className="block text-[10px] font-bold uppercase tracking-widest text-text-secondary hover:text-accent transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>

              <div className="p-8 bg-accent/5 border border-accent/20">
                <h4 className="text-xl font-sans font-black uppercase text-text-primary mb-4">Official Deal</h4>
                <p className="text-xs text-text-secondary mb-8 leading-relaxed">
                  Support Drawdown by visiting {tool.name} using our verified link. Get the best pricing deals.
                </p>
                <a 
                  href={tool.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-mkt-ink text-white text-center text-[10px] font-black uppercase tracking-widest hover:bg-accent-hover transition-premium flex items-center justify-center gap-2"
                >
                  Visit Official Site <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
