import { Metadata } from "next";
import { notFound } from "next/navigation";
import { TRADINGVIEW_GUIDES } from "@/data/seo/tradingview";
import { BookOpen, Clock, ChevronRight, ArrowRight, Lightbulb, HelpCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return TRADINGVIEW_GUIDES.map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = TRADINGVIEW_GUIDES.find((g) => g.slug === params.slug);
  if (!guide) return {};

  return {
    title: guide.title,
    description: guide.metaDescription,
  };
}

export default function TradingViewGuidePage({ params }: Props) {
  const guide = TRADINGVIEW_GUIDES.find((g) => g.slug === params.slug);

  if (!guide) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Article Header */}
      <header className="relative pt-32 pb-20 border-b border-mkt-bd overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <Breadcrumbs 
              items={[
                { label: 'Guides', href: '/guides' },
                { label: 'TradingView', href: '/guides/tradingview' },
                { label: guide.slug.replace(/-/g, ' '), href: `/guides/tradingview/${guide.slug}` }
              ]} 
            />
            
            <div className="flex items-center gap-3 text-accent mt-8 mb-6 transition-all duration-700">
               <div className="w-8 h-[1px] bg-accent" />
               <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold">{guide.eyebrow}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-sans font-black uppercase leading-[0.95] tracking-tight mb-8">
              {guide.title}
            </h1>

            <div className="flex flex-wrap gap-8 items-center pt-4">
              <div className="flex items-center gap-2 text-mkt-i4">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-mono uppercase tracking-widest">Updated {guide.lastUpdated}</span>
              </div>
              <div className="flex items-center gap-2 text-mkt-i4">
                <BookOpen className="w-4 h-4" />
                <span className="text-xs font-mono uppercase tracking-widest">Mastery Level: Intermediate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Grid */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-[0.03] pointer-events-none">
           <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-accent)_1px,transparent_1px),linear-gradient(180deg,var(--color-accent)_1px,transparent_1px)] [background-size:40px_40px]" />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Article Content */}
          <article className="lg:col-span-8">
            <div className="prose prose-invert prose-slate max-w-none">
              <p className="text-xl md:text-2xl text-mkt-i2 leading-relaxed font-medium mb-16 border-l-4 border-mkt-bd pl-8 py-2">
                {guide.introduction}
              </p>

              {guide.sections.map((section, i) => (
                <div key={i} className="mb-20">
                  <h2 className="text-3xl font-sans font-bold uppercase tracking-tight mb-8 flex items-baseline gap-4">
                    <span className="text-accent font-mono text-sm opacity-50">0{i + 1}</span>
                    {section.title}
                  </h2>
                  <div className="text-lg leading-relaxed text-mkt-i2 space-y-6">
                    {section.content.split('\n').map((paragraph, pIndex) => (
                      <p key={pIndex}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              ))}

              {/* Pro Tips Module */}
              <div className="my-20 p-10 bg-accent/5 border border-mkt-bd/20 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Lightbulb className="w-24 h-24 text-accent" />
                 </div>
                 <h3 className="text-2xl font-sans font-black uppercase tracking-tight mb-8 flex items-center gap-3">
                    <Lightbulb className="w-6 h-6 text-accent" />
                    Pro Tips for Success.
                 </h3>
                 <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 list-none p-0 m-0">
                    {guide.tips.map((tip, i) => (
                      <li key={i} className="flex gap-4 text-sm text-mkt-i2 leading-relaxed m-0">
                        <span className="text-accent font-mono font-bold">»</span>
                        {tip}
                      </li>
                    ))}
                 </ul>
              </div>

              {/* FAQs Section */}
              {guide.faqs.length > 0 && (
                <div className="pt-20 border-t border-mkt-bd">
                   <h3 className="text-3xl font-sans font-black uppercase tracking-tight mb-12 flex items-center gap-4">
                      <HelpCircle className="w-8 h-8 text-accent" />
                      Frequently Asked.
                   </h3>
                   <div className="space-y-6">
                      {guide.faqs.map((faq, i) => (
                        <div key={i} className="p-8 bg-white border border-mkt-bd">
                           <h4 className="text-lg font-bold text-mkt-ink mb-4">{faq.question}</h4>
                           <p className="text-mkt-i2 leading-relaxed m-0">{faq.answer}</p>
                        </div>
                      ))}
                   </div>
                </div>
              )}
            </div>
          </article>

          {/* Sidebar - Quick Navigation & Related */}
          <aside className="lg:col-span-4 space-y-12">
            <div className="sticky top-32 space-y-12">
               {/* Call to Action: Tools */}
               <div className="p-8 bg-white border border-mkt-bd space-y-8 relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-xl font-sans font-bold uppercase tracking-tight leading-none mb-4">
                       Scale Your Analysis.
                    </h3>
                    <p className="text-sm text-mkt-i2 leading-relaxed mb-8">
                       Stop drawing manual support levels. Our AI Market Scanner identifies institutional zones across 50+ pairs instantly.
                    </p>
                    <Link 
                       href="/tools/ai-market-scanner"
                       className="w-full py-4 bg-accent text-[#08090D] font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-accent-hover transition-colors"
                    >
                       Open Market Scanner <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                  <div className="absolute -bottom-8 -right-8 opacity-[0.05]">
                     <Activity className="w-32 h-32 text-accent" />
                  </div>
               </div>

               {/* More in Series */}
               <div className="space-y-6">
                  <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] text-mkt-i4 font-bold">
                     More TradingView Mastery
                  </h3>
                  <div className="space-y-4">
                     {TRADINGVIEW_GUIDES.filter(g => g.slug !== guide.slug).map((g) => (
                        <Link 
                           key={g.slug} 
                           href={`/guides/tradingview/${g.slug}`}
                           className="group block p-6 border border-mkt-bd hover:border-mkt-bds/30 transition-all"
                        >
                           <h4 className="text-sm font-bold text-mkt-ink group-hover:text-accent transition-colors mb-2">
                              {g.title}
                           </h4>
                           <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono uppercase text-mkt-i4">Read Guide</span>
                              <ChevronRight className="w-4 h-4 text-mkt-i4 group-hover:text-accent transition-all group-hover:translate-x-1" />
                           </div>
                        </Link>
                     ))}
                  </div>
               </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Activity({ className }: { className?: string }) {
  return (
    <svg 
      className={className}
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </svg>
  );
}
