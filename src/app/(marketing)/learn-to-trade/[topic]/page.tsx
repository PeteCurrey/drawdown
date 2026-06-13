import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { StructuredData } from "@/components/StructuredData";
import { LEARN_TOPICS, RichBlock } from "@/lib/data/learn-to-trade";
import { UK_LOCATIONS } from "@/lib/data/locations";
import Link from "next/link";
import { ArrowUpRight, AlertTriangle, MapPin, Clock, TrendingUp, Shield } from "lucide-react";
import { TrackPageView } from "@/components/admin/TrackPageView";
import {
  StatCallout,
  TradeExample,
  ProTip,
  RiskWarning,
  BrokerCard,
  ToolCard,
  CurriculumPreview,
} from "@/components/content";

interface Props {
  params: Promise<{ topic: string }>;
}

export async function generateStaticParams() {
  return LEARN_TOPICS.map((topic) => ({
    topic: topic.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic: topicSlug } = await params;
  const topic = LEARN_TOPICS.find((t) => t.slug === topicSlug);
  if (!topic) return {};

  return getMetadata({
    title: topic.metaTitle,
    description: topic.metaDescription,
  });
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

const DIFFICULTY_COLORS = {
  Beginner: 'text-mkt-grn border-profit/30 bg-profit/5',
  Intermediate: 'text-warning border-warning/30 bg-warning/5',
  Advanced: 'text-red-500 border-loss/30 bg-loss/5',
};

const RISK_COLORS = {
  Low: 'text-mkt-grn',
  Medium: 'text-warning',
  High: 'text-red-500',
  'Very High': 'text-red-500',
};

export default async function TopicPage({ params }: Props) {
  const { topic: topicSlug } = await params;
  const topic = LEARN_TOPICS.find((t) => t.slug === topicSlug);
  if (!topic) notFound();

  const faqSchema = {
    mainEntity: topic.faqs.map((f) => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer,
      },
    })),
  };

  return (
    <div className="pt-28 pb-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <Breadcrumbs />
        <TrackPageView path={`/learn-to-trade/${topicSlug}`} />
        <StructuredData type="FAQPage" data={faqSchema} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          <div className="lg:col-span-2">
            {/* Category & Meta badges */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-accent/10 border border-mkt-bd/20 text-accent text-[10px] font-mono uppercase tracking-widest">
                // DRAWDOWN GUIDE
              </span>
              <span className="text-[10px] font-mono text-mkt-i4 uppercase tracking-widest">
                {topic.category}
              </span>
              {topic.difficulty && (
                <span className={`px-3 py-1 border text-[10px] font-mono uppercase tracking-widest ${DIFFICULTY_COLORS[topic.difficulty]}`}>
                  {topic.difficulty}
                </span>
              )}
            </div>

            {/* H1 */}
            <h1 className="text-5xl md:text-8xl font-sans font-bold uppercase mb-6 leading-tight text-mkt-ink">
              Learn {topic.title} <br className="hidden md:block" />
              <span className="text-accent">— The Honest Guide.</span>
            </h1>

            {/* Subtitle */}
            {topic.subtitle && (
              <p className="text-xl text-mkt-i2 leading-relaxed mb-8 max-w-2xl font-sans italic border-l-2 border-mkt-bd/30 pl-4">
                {topic.subtitle}
              </p>
            )}

            {/* Quick stats pills */}
            {(topic.difficulty || topic.timeToLearn || topic.riskLevel) && (
              <div className="flex flex-wrap gap-4 mb-10 p-5 bg-surface border border-border rounded-xl">
                {topic.difficulty && (
                  <div className="flex items-center gap-2">
                    <TrendingUp size={14} className="text-mkt-i4" />
                    <span className="text-[10px] font-mono uppercase text-mkt-i4">Difficulty:</span>
                    <span className={`text-[10px] font-mono font-bold uppercase ${DIFFICULTY_COLORS[topic.difficulty].split(' ')[0]}`}>
                      {topic.difficulty}
                    </span>
                  </div>
                )}
                {topic.timeToLearn && (
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-mkt-i4" />
                    <span className="text-[10px] font-mono uppercase text-mkt-i4">Time to Learn:</span>
                    <span className="text-[10px] font-mono font-bold uppercase text-mkt-ink">{topic.timeToLearn}</span>
                  </div>
                )}
                {topic.riskLevel && (
                  <div className="flex items-center gap-2">
                    <Shield size={14} className="text-mkt-i4" />
                    <span className="text-[10px] font-mono uppercase text-mkt-i4">Risk Level:</span>
                    <span className={`text-[10px] font-mono font-bold uppercase ${RISK_COLORS[topic.riskLevel]}`}>
                      {topic.riskLevel}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <p className="text-xl text-mkt-i2 leading-relaxed mb-16 max-w-2xl font-sans">
              {topic.description}
            </p>

            {/* Honest Reality section */}
            {topic.honestReality && (
              <section className="mb-16 p-8 bg-loss/5 border border-loss/20 relative overflow-hidden">
                <div className="flex items-center gap-3 text-red-500 mb-4">
                  <AlertTriangle className="w-5 h-5" />
                  <h2 className="text-sm font-mono uppercase font-bold tracking-widest m-0">The Honest Reality</h2>
                </div>
                <p className="text-base text-mkt-i2 leading-relaxed">
                  {topic.honestReality}
                </p>
              </section>
            )}

            {/* Table of Contents */}
            {topic.content.length > 3 && (
              <section className="mb-16 p-6 bg-surface border border-border rounded-xl">
                <h2 className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4 mb-4 m-0">// WHAT YOU&apos;LL LEARN</h2>
                <ol className="space-y-2">
                  {topic.content.map((section, i) => (
                    <li key={i}>
                      <a
                        href={`#section-${i}`}
                        className="flex items-center gap-3 text-sm text-mkt-i2 hover:text-accent transition-colors group"
                      >
                        <span className="font-mono text-[10px] text-mkt-i4">{String(i + 1).padStart(2, '0')}.</span>
                        <span className="group-hover:underline">{section.heading}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* Main content sections */}
            <div className="space-y-20">
              {topic.content.map((section, i) => (
                <section
                  key={i}
                  id={`section-${i}`}
                  className="space-y-8 scroll-mt-32 animate-in fade-in slide-in-from-bottom-4 duration-700"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <h2 className="text-3xl md:text-4xl font-sans font-bold uppercase tracking-tight text-mkt-ink">
                    {i + 1}. {section.heading}
                  </h2>
                  <p className="text-mkt-i2 leading-relaxed text-lg whitespace-pre-line">
                    {section.text}
                  </p>
                  {section.bullets && (
                    <ul className="space-y-4 pt-4">
                      {section.bullets.map((bullet, j) => (
                        <li key={j} className="flex gap-4 text-mkt-i2">
                          <span className="text-accent font-bold shrink-0">/</span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                  {/* Rich blocks rendered after section text */}
                  {section.richBlocks && section.richBlocks.map((block, k) => (
                    <RichBlockRenderer key={k} block={block} />
                  ))}
                </section>
              ))}
            </div>

            {/* Curriculum preview */}
            <div className="mt-24">
              <CurriculumPreview />
            </div>

            {/* Anti-Guru warning */}
            <section className="mt-16 p-10 bg-loss/5 border border-loss/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-loss/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 text-red-500 mb-6">
                  <AlertTriangle className="w-6 h-6" />
                  <h3 className="text-xs font-mono uppercase font-bold tracking-widest m-0">Crucial Warning: The Guru Trap</h3>
                </div>
                <p className="text-lg text-mkt-i2 leading-relaxed italic max-w-3xl">
                  Most online guides for &quot;{topic.title}&quot; are designed to sell you indicators or signal groups. At Drawdown, we teach you strategy and discipline. If a guide promises &quot;guaranteed&quot; returns or &quot;100% win rates,&quot; it is a scam. Period.
                </p>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="sticky top-32 space-y-12">
            <div className="p-10 bg-white border border-mkt-bd hover:border-mkt-bds/30 transition-premium">
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4 mb-8">Related Intelligence</h4>
              <div className="space-y-6">
                {LEARN_TOPICS.filter(t => t.slug !== topicSlug).slice(0, 8).map(t => (
                  <Link
                    key={t.slug}
                    href={`/learn-to-trade/${t.slug}`}
                    className="flex items-center justify-between group py-3 border-b border-mkt-bd/30"
                  >
                    <span className="text-xs font-bold uppercase tracking-widest text-mkt-i2 group-hover:text-accent transition-colors">
                      {t.title}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-mkt-i4 group-hover:text-accent transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="p-10 bg-white border border-mkt-bd hover:border-mkt-bds/30 transition-premium">
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4 mb-8">Regional Learning</h4>
              <div className="space-y-4">
                <p className="text-xs text-mkt-i2 leading-relaxed">
                  We offer localised {topic.title} insights across the UK.
                </p>
                <div className="flex flex-wrap gap-2">
                  {require("@/lib/data/locations").UK_LOCATIONS.slice(0, 6).map((loc: { slug: string; name: string }) => (
                    <Link
                      key={loc.slug}
                      href={`/learn-to-trade/${topicSlug}/${loc.slug}`}
                      className="px-2 py-1 bg-white border border-mkt-bd text-[8px] font-mono uppercase tracking-widest text-mkt-i4 hover:border-mkt-bds hover:text-accent transition-colors"
                    >
                      {loc.name}
                    </Link>
                  ))}
                </div>
                <Link
                  href="#regional-hub"
                  className="text-[9px] font-bold uppercase tracking-widest text-accent hover:underline mt-4 inline-block"
                >
                  View All 30 Locations
                </Link>
              </div>
            </div>

            <div className="p-10 bg-mkt-ink text-white relative overflow-hidden group">
              <div className="relative z-10">
                <h4 className="text-2xl font-sans font-bold uppercase mb-4 leading-tight">Master Your Edge.</h4>
                <p className="text-sm opacity-80 leading-relaxed mb-8">
                  Start learning with Drawdown and master the business of risk.
                </p>
                <Link
                  href="/signup"
                  className="block w-full py-5 bg-white text-mkt-ink text-center text-[10px] font-bold uppercase tracking-widest hover:invert transition-all"
                >
                  Join Drawdown Free
                </Link>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
            </div>
          </aside>
        </div>

        {/* FAQs */}
        {topic.faqs.length > 0 && (
          <div className="mt-32 max-w-4xl border-t border-mkt-bd pt-20">
            <h2 className="text-4xl font-sans font-bold uppercase mb-16 text-mkt-ink">Common Questions.</h2>
            <div className="space-y-10">
              {topic.faqs.map((faq, i) => (
                <div key={i} className="space-y-4 pb-10 border-b border-mkt-bd/30 last:border-0">
                  <h3 className="text-xl font-sans font-bold uppercase text-mkt-ink">{faq.question}</h3>
                  <p className="text-mkt-i2 leading-relaxed text-base">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Localized Links for SEO Hub & Spoke */}
        <div id="regional-hub" className="mt-32 pt-20 border-t border-mkt-bd/30">
          <div className="flex items-center gap-3 mb-8">
            <MapPin className="w-4 h-4 text-accent" />
            <h2 className="text-3xl font-sans font-bold uppercase text-mkt-ink tracking-tight">
              Learn {topic.title} Near You.
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-4 gap-x-8">
            {UK_LOCATIONS.map((loc) => (
              <Link
                key={loc.slug}
                href={`/learn-to-trade/${topicSlug}/${loc.slug}`}
                className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4 hover:text-accent transition-colors py-2 border-b border-mkt-bd/10 hover:border-mkt-bds/30 flex items-center justify-between group"
              >
                <span>{topic.title} in {loc.name}</span>
                <ArrowUpRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
