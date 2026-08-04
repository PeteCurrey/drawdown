"use client";

import { useState } from "react";
import Link from "next/link";
import { LEARN_TOPICS, RichBlock, LearnTopic } from "@/lib/data/learn-to-trade";
import { UK_LOCATIONS } from "@/lib/data/locations";
import { 
  ArrowUpRight, 
  AlertTriangle, 
  MapPin, 
  Clock, 
  TrendingUp, 
  Shield, 
  ChevronDown, 
  BookOpen,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { TrackPageView } from "@/components/admin/TrackPageView";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import {
  StatCallout,
  TradeExample,
  ProTip,
  RiskWarning,
  BrokerCard,
  ToolCard,
  CurriculumPreview,
} from "@/components/content";

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
      return <RiskWarning message={block.message} title={(block as any).title} warning={(block as any).warning} />;
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

interface TopicPageClientProps {
  topic: LearnTopic;
}

export function TopicPageClient({ topic }: TopicPageClientProps) {
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setExpandedFaqIndex(expandedFaqIndex === index ? null : index);
  };

  const faqSchemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": topic.faqs.map((f) => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer,
      },
    })),
  };

  const articleSchemaData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "name": topic.title,
    "headline": topic.metaTitle || topic.title,
    "description": topic.metaDescription || topic.description,
    "image": topic.heroImage.startsWith('http') ? topic.heroImage : `https://drawdown.trading${topic.heroImage}`,
    "author": {
      "@type": "Person",
      "name": "Pete Currey",
      "url": "https://drawdown.trading/about",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Drawdown Trading",
      "url": "https://drawdown.trading",
      "logo": {
        "@type": "ImageObject",
        "url": "https://drawdown.trading/og/default-og.png"
      }
    },
    "datePublished": "2026-01-15T08:00:00Z",
    "dateModified": "2026-08-04T08:00:00Z",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://drawdown.trading/learn-to-trade/${topic.slug}`
    }
  };

  return (
    <div className="pt-28 pb-24 min-h-screen select-none font-sans" style={{ backgroundColor: "var(--paper-0)", color: "var(--ink-950)" }}>
      <TrackPageView path={`/learn-to-trade/${topic.slug}`} />
      <JsonLd data={faqSchemaData} />
      <JsonLd data={articleSchemaData} />

      <div className="max-w-[1280px] mx-auto px-6">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Breadcrumbs 
            items={[
              { label: 'Learn to Trade', href: '/learn-to-trade' },
              { label: topic.title, href: `/learn-to-trade/${topic.slug}` }
            ]} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Content Area */}
          <main className="lg:col-span-8 space-y-12">
            
            {/* Header Meta Badges */}
            <div className="space-y-4 border-b pb-8" style={{ borderColor: "var(--line-200)" }}>
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono uppercase tracking-[0.08em]">
                <span className="px-2.5 py-1 border font-semibold" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)", color: "var(--signal-navy)" }}>
                  Drawdown Guide
                </span>
                <span className="px-2.5 py-1 border" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)", color: "var(--graphite-600)" }}>
                  {topic.category}
                </span>
                {topic.difficulty && (
                  <span className="px-2.5 py-1 border font-semibold" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)", color: "var(--ink-950)" }}>
                    Difficulty: {topic.difficulty}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="font-display text-[clamp(2.5rem,5vw,4.25rem)] leading-[1.05] tracking-[-0.02em] font-semibold">
                Learn {topic.title} <br />
                <span style={{ color: "var(--signal-navy)" }}>— The Data-Driven Guide.</span>
              </h1>

              {/* Subtitle */}
              {topic.subtitle && (
                <p className="text-[16px] leading-[1.65] font-sans italic border-l-2 pl-4 max-w-2xl" style={{ borderColor: "var(--signal-navy)", color: "var(--graphite-600)" }}>
                  {topic.subtitle}
                </p>
              )}

              {/* Stats Bar */}
              {(topic.difficulty || topic.timeToLearn || topic.riskLevel) && (
                <div className="p-4 border flex flex-wrap items-center justify-between gap-4 font-mono text-[12px]" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}>
                  {topic.difficulty && (
                    <div className="flex items-center gap-2">
                      <TrendingUp size={14} style={{ color: "var(--signal-navy)" }} />
                      <span style={{ color: "var(--graphite-600)" }}>Level:</span>
                      <span className="font-bold" style={{ color: "var(--ink-950)" }}>{topic.difficulty}</span>
                    </div>
                  )}
                  {topic.timeToLearn && (
                    <div className="flex items-center gap-2">
                      <Clock size={14} style={{ color: "var(--signal-navy)" }} />
                      <span style={{ color: "var(--graphite-600)" }}>Est. Time:</span>
                      <span className="font-bold" style={{ color: "var(--ink-950)" }}>{topic.timeToLearn}</span>
                    </div>
                  )}
                  {topic.riskLevel && (
                    <div className="flex items-center gap-2">
                      <Shield size={14} style={{ color: "var(--risk-amber)" }} />
                      <span style={{ color: "var(--graphite-600)" }}>Risk Profile:</span>
                      <span className="font-bold" style={{ color: "var(--risk-amber)" }}>{topic.riskLevel}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-[17px] leading-[1.65] font-sans font-normal" style={{ color: "var(--ink-950)" }}>
              {topic.description}
            </p>

            {/* Honest Reality section */}
            {topic.honestReality && (
              <section 
                className="p-6 md:p-8 border border-l-4 space-y-3 transition-all duration-300"
                style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)", borderLeftColor: "var(--risk-amber)" }}
              >
                <div className="flex items-center gap-2 text-[12px] font-mono font-bold uppercase tracking-[0.08em]" style={{ color: "var(--risk-amber)" }}>
                  <AlertTriangle size={16} />
                  <span>The Honest Reality</span>
                </div>
                <p className="text-[14px] leading-relaxed font-sans" style={{ color: "var(--ink-950)" }}>
                  {topic.honestReality}
                </p>
              </section>
            )}

            {/* Table of Contents */}
            {topic.content.length > 2 && (
              <section className="p-6 border space-y-3" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}>
                <span className="text-[11px] font-mono uppercase tracking-[0.08em] font-semibold block" style={{ color: "var(--signal-navy)" }}>
                  Curriculum Outline &amp; Structure
                </span>
                <ol className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[13px] font-sans">
                  {topic.content.map((section, i) => (
                    <li key={i}>
                      <a
                        href={`#section-${i}`}
                        className="hover:underline flex items-center gap-2 transition-colors"
                        style={{ color: "var(--graphite-600)" }}
                      >
                        <span className="font-mono text-[11px] font-bold" style={{ color: "var(--signal-navy)" }}>
                          {String(i + 1).padStart(2, '0')}.
                        </span>
                        <span className="truncate">{section.heading}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* Content Sections */}
            <div className="space-y-16">
              {topic.content.map((section, i) => (
                <section
                  key={i}
                  id={`section-${i}`}
                  className="space-y-6 pt-6 border-t scroll-mt-32"
                  style={{ borderColor: "var(--line-200)" }}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[14px] font-bold px-2 py-0.5 border" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)", color: "var(--signal-navy)" }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h2 className="font-display text-[26px] md:text-[30px] font-semibold tracking-[-0.01em]" style={{ color: "var(--ink-950)" }}>
                      {section.heading}
                    </h2>
                  </div>

                  <p className="text-[15px] leading-relaxed font-sans whitespace-pre-line" style={{ color: "var(--graphite-600)" }}>
                    {section.text}
                  </p>

                  {section.bullets && (
                    <ul className="space-y-3 pt-2 font-sans text-[14px]">
                      {section.bullets.map((bullet, j) => (
                        <li key={j} className="flex gap-3 items-start" style={{ color: "var(--ink-950)" }}>
                          <span className="font-mono font-bold shrink-0" style={{ color: "var(--signal-navy)" }}>/</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Rich blocks */}
                  {section.richBlocks && section.richBlocks.map((block, k) => (
                    <RichBlockRenderer key={k} block={block} />
                  ))}
                </section>
              ))}
            </div>

            {/* Curriculum Accelerator CTA */}
            {(() => {
              const TOPIC_CURRICULUM_CTAS: Record<string, { href: string; label: string }[]> = {
                "forex-trading": [
                  { href: "/courses", label: "Phase 02: Chart Reader" },
                  { href: "/courses", label: "Phase 09: Macro Trader" }
                ],
                "risk-management": [
                  { href: "/courses", label: "Phase 04: Risk Manager" },
                  { href: "/courses", label: "Phase 05: The Backtester" }
                ],
                "day-trading": [
                  { href: "/courses", label: "Phase 03: Strategist" },
                  { href: "/courses", label: "Phase 06: Mind Over Market" }
                ]
              };

              const ctas = TOPIC_CURRICULUM_CTAS[topic.slug];
              if (!ctas) return null;

              return (
                <div className="p-8 border space-y-4" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}>
                  <span className="text-[11px] font-mono uppercase tracking-[0.08em] font-semibold block" style={{ color: "var(--signal-navy)" }}>
                    Curriculum Accelerator
                  </span>
                  <h3 className="font-display text-[24px] font-semibold" style={{ color: "var(--ink-950)" }}>
                    Master {topic.title} in the Structured Academy
                  </h3>
                  <p className="text-[14px] leading-relaxed font-sans" style={{ color: "var(--graphite-600)" }}>
                    Accelerate your learning path. Access structured curriculum phases built specifically to master this domain with quantitative precision.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    {ctas.map((cta, idx) => (
                      <Link
                        key={idx}
                        href={cta.href}
                        className="px-6 py-3 text-[11px] font-mono font-bold uppercase tracking-[0.08em] flex items-center justify-center gap-2 border transition-all duration-200 hover:-translate-y-0.5"
                        style={{ backgroundColor: "var(--signal-navy)", borderColor: "var(--signal-navy)", color: "#FAFAF9" }}
                      >
                        <span>{cta.label}</span>
                        <ArrowUpRight size={14} />
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Related Modules */}
            {topic.relatedModules && topic.relatedModules.length > 0 && (
              <div className="space-y-6 pt-8 border-t" style={{ borderColor: "var(--line-200)" }}>
                <span className="text-[11px] font-mono uppercase tracking-[0.08em] block" style={{ color: "var(--signal-navy)" }}>
                  Related Curriculum
                </span>
                <h3 className="font-display text-[24px] font-semibold" style={{ color: "var(--ink-950)" }}>
                  Deepen Your Quantitative Edge
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {topic.relatedModules.map((mod, idx) => (
                    <Link
                      key={idx}
                      href={mod.href}
                      className="p-6 border transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between group"
                      style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}
                    >
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--signal-navy)" }}>
                          Module Lesson
                        </span>
                        <h4 className="font-display text-[18px] font-semibold group-hover:text-[var(--signal-navy)] transition-colors" style={{ color: "var(--ink-950)" }}>
                          {mod.title}
                        </h4>
                        <p className="text-[13px] leading-relaxed font-sans line-clamp-2" style={{ color: "var(--graphite-600)" }}>
                          {mod.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-mono font-bold uppercase tracking-[0.08em] pt-4 mt-auto" style={{ color: "var(--signal-navy)" }}>
                        <span>Study Module</span>
                        <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Curriculum Preview */}
            <div className="pt-8">
              <CurriculumPreview />
            </div>

            {/* Crucial Anti-Guru Warning */}
            <section 
              className="p-8 border border-l-4 space-y-3"
              style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)", borderLeftColor: "var(--risk-amber)" }}
            >
              <div className="flex items-center gap-2 text-[12px] font-mono font-bold uppercase tracking-[0.08em]" style={{ color: "var(--risk-amber)" }}>
                <AlertTriangle size={16} />
                <span>Crucial Warning: The Guru Trap</span>
              </div>
              <p className="text-[14px] leading-relaxed font-sans italic" style={{ color: "var(--ink-950)" }}>
                Most online guides for &quot;{topic.title}&quot; are designed to sell you indicators or signal groups. At Drawdown, we teach strategy and discipline. If a guide promises &quot;guaranteed&quot; returns or &quot;100% win rates,&quot; it is a scam. Period.
              </p>
            </section>

            {/* FAQs Accordion */}
            {topic.faqs && topic.faqs.length > 0 && (
              <section className="space-y-6 pt-8 border-t" style={{ borderColor: "var(--line-200)" }}>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-[0.08em] block mb-1" style={{ color: "var(--signal-navy)" }}>
                    Frequently Asked Questions
                  </span>
                  <h3 className="font-display text-[26px] font-semibold tracking-[-0.01em]" style={{ color: "var(--ink-950)" }}>
                    Common Questions on {topic.title}
                  </h3>
                </div>

                <div className="space-y-3">
                  {topic.faqs.map((faq, index) => {
                    const isOpen = expandedFaqIndex === index;
                    return (
                      <div
                        key={index}
                        className="border transition-colors"
                        style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}
                      >
                        <button
                          onClick={() => toggleFaq(index)}
                          className="w-full p-5 text-left flex items-center justify-between gap-4 font-sans font-semibold text-[14px]"
                          style={{ color: "var(--ink-950)" }}
                          aria-expanded={isOpen}
                        >
                          <span>{faq.question}</span>
                          <ChevronDown
                            size={16}
                            className={`shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                            style={{ color: "var(--signal-navy)" }}
                          />
                        </button>

                        {isOpen && (
                          <div className="px-5 pb-5 pt-1 text-[13px] leading-relaxed font-sans border-t" style={{ borderColor: "var(--line-200)", color: "var(--graphite-600)" }}>
                            <p>{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Localized Links for SEO Hub & Spoke */}
            <section id="regional-hub" className="pt-8 border-t" style={{ borderColor: "var(--line-200)" }}>
              <details className="group">
                <summary className="flex items-center gap-2 cursor-pointer list-none select-none font-display text-[22px] font-semibold" style={{ color: "var(--ink-950)" }}>
                  <MapPin size={18} style={{ color: "var(--signal-navy)" }} />
                  <span>Learn {topic.title} Near You</span>
                  <span className="text-xs font-mono font-normal transition-transform group-open:rotate-180" style={{ color: "var(--graphite-600)" }}>▼</span>
                </summary>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-6 pt-4 border-t" style={{ borderColor: "var(--line-200)" }}>
                  {UK_LOCATIONS.map((loc) => (
                    <Link
                      key={loc.slug}
                      href={`/learn-to-trade/${topic.slug}/${loc.slug}`}
                      className="text-[11px] font-mono uppercase tracking-[0.05em] py-1.5 border-b hover:underline flex items-center justify-between group/loc"
                      style={{ borderColor: "var(--line-200)", color: "var(--graphite-600)" }}
                    >
                      <span className="truncate">{topic.title} in {loc.name}</span>
                      <ArrowUpRight size={12} className="shrink-0 transition-transform group-hover/loc:translate-x-0.5 group-hover/loc:-translate-y-0.5" style={{ color: "var(--signal-navy)" }} />
                    </Link>
                  ))}
                </div>
              </details>
            </section>

          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="p-6 border space-y-6" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}>
              <span className="text-[11px] font-mono uppercase tracking-[0.08em] font-bold block" style={{ color: "var(--signal-navy)" }}>
                Related Intelligence
              </span>
              <div className="space-y-3 text-[13px] font-sans">
                {LEARN_TOPICS.filter(t => t.slug !== topic.slug).slice(0, 8).map(t => (
                  <Link
                    key={t.slug}
                    href={`/learn-to-trade/${t.slug}`}
                    className="flex items-center justify-between group py-2 border-b transition-colors hover:underline"
                    style={{ borderColor: "var(--line-200)", color: "var(--ink-950)" }}
                  >
                    <span className="font-semibold">{t.title}</span>
                    <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" style={{ color: "var(--signal-navy)" }} />
                  </Link>
                ))}
              </div>
            </div>

            <div className="p-6 border space-y-4" style={{ backgroundColor: "var(--signal-navy)", borderColor: "var(--signal-navy)", color: "#FAFAF9" }}>
              <h3 className="font-display text-[22px] font-semibold leading-tight">
                Master Your Edge.
              </h3>
              <p className="text-[13px] leading-relaxed opacity-90 font-sans">
                Start learning with Drawdown and master the business of mathematical risk.
              </p>
              <Link
                href="/signup"
                className="block w-full py-3 text-center text-[11px] font-mono font-bold uppercase tracking-[0.08em] transition-all hover:opacity-90"
                style={{ backgroundColor: "var(--paper-0)", color: "var(--ink-950)" }}
              >
                Join Drawdown Free
              </Link>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
