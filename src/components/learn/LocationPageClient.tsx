"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  AlertTriangle,
  MapPin,
  ShieldCheck,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import { TrackPageView } from "@/components/admin/TrackPageView";
import { StructuredData } from "@/components/StructuredData";
import { LEARN_TOPICS } from "@/lib/data/learn-to-trade";

export interface LocationPageProps {
  /** The topic title (e.g. "Forex Trading") */
  topicTitle: string;
  topicSlug: string;
  /** The city / location name (e.g. "Manchester") */
  locationName: string;
  locationSlug: string;
  /** Brief contextual blurb about trading in this city */
  locationContext: string;
  /** Content sections from the topic */
  contentSections: {
    heading: string;
    text: string;
    bullets?: string[];
  }[];
  /** Page tracking path prefix e.g. "/learn-to-trade" or "/au/learn-to-trade" */
  pathPrefix?: string;
  /** Localised compliance items shown in the sidebar card */
  complianceItems?: string[];
  complianceBadge?: string;
  /** Sidebar CTA href and label override */
  ctaHref?: string;
  ctaLabel?: string;
  /** FAQs — shown in local FAQ section. If omitted, defaults are generated. */
  faqs?: { question: string; answer: string }[];
  /** JSON-LD FAQ schema data */
  faqSchema?: object;
  /** Region prefix for breadcrumb root (e.g. "/au") */
  regionPrefix?: string;
  /** Full page breadcrumb label for region (e.g. "AU") */
  regionLabel?: string;
}

const DEFAULT_COMPLIANCE_ITEMS_UK = [
  "FCA Regulated Platforms",
  "Spread Betting Tax Efficiency",
  "GBP Denominated Analysis",
  "London Session Focus",
];

export function LocationPageClient({
  topicTitle,
  topicSlug,
  locationName,
  locationSlug,
  locationContext,
  contentSections,
  pathPrefix = "/learn-to-trade",
  complianceItems = DEFAULT_COMPLIANCE_ITEMS_UK,
  complianceBadge = "UK Compliance",
  ctaHref = "/signup",
  ctaLabel = "Join Drawdown Free",
  faqs,
  faqSchema,
  regionPrefix = "",
  regionLabel,
}: LocationPageProps) {
  const trackPath = `${regionPrefix}${pathPrefix}/${topicSlug}/${locationSlug}`;

  const defaultFaqs = [
    {
      question: `Are there trading courses in ${locationName}?`,
      answer: `Yes, while some traditional classroom courses exist in ${locationName}, Drawdown offers a professional-grade online alternative — accessible from anywhere at a fraction of the cost.`,
    },
    {
      question: `Can I learn ${topicTitle} from ${locationName}?`,
      answer: `Absolutely. Drawdown is built for remote traders. Whether you're in ${locationName} or surrounding areas, you get the tools, data, and community to master ${topicTitle} online.`,
    },
    {
      question: `How much does it cost to learn trading in ${locationName}?`,
      answer: `Traditional seminars in ${locationName} can cost £1,000–£5,000 for a single weekend. Drawdown starts from just £49/month — professional-grade education at a fraction of the price.`,
    },
    {
      question: `Do I need qualifications to trade from ${locationName}?`,
      answer: `No formal qualifications are needed. But markets are competitive — professional education and disciplined risk management are essential for long-term success.`,
    },
  ];

  const displayFaqs = faqs ?? defaultFaqs;

  const resolvedFaqSchema = faqSchema ?? {
    "@type": "FAQPage",
    mainEntity: displayFaqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const relatedTopics = LEARN_TOPICS.filter((t) => t.slug !== topicSlug).slice(0, 5);

  return (
    <main
      className="min-h-screen pt-32 pb-20"
      style={{ background: "var(--paper-0)", color: "var(--ink-950)" }}
    >
      <TrackPageView path={trackPath} />
      <StructuredData type="FAQPage" data={resolvedFaqSchema} />

      <div className="max-w-6xl mx-auto px-6">
        {/* ── Breadcrumbs ── */}
        <nav className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest mb-12" style={{ color: "var(--graphite-600)" }}>
          <Link href={regionPrefix || "/"} className="hover:opacity-70 transition-opacity">
            {regionLabel ?? "Home"}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`${regionPrefix}${pathPrefix}`} className="hover:opacity-70 transition-opacity">
            Learn
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`${regionPrefix}${pathPrefix}/${topicSlug}`} className="hover:opacity-70 transition-opacity">
            {topicTitle}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span style={{ color: "var(--ink-950)" }}>{locationName}</span>
        </nav>

        {/* ── Hero ── */}
        <div className="mb-24">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-4 h-4" style={{ color: "var(--signal-navy)" }} />
            <span
              className="font-mono text-[10px] uppercase tracking-widest"
              style={{ color: "var(--signal-navy)" }}
            >
              Regional Hub // {locationName}
            </span>
          </div>

          <h1
            className="text-5xl md:text-8xl font-sans font-bold uppercase mb-8 leading-[0.85]"
            style={{ color: "var(--ink-950)" }}
          >
            {topicTitle} in <br /> {locationName}.
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
            {/* Intro text */}
            <div className="lg:col-span-2 space-y-6">
              {locationContext && (
                <p
                  className="text-xl font-sans italic leading-relaxed"
                  style={{
                    color: "var(--ink-950)",
                    borderLeft: "4px solid var(--line-200)",
                    paddingLeft: "2rem",
                  }}
                >
                  {locationContext}
                </p>
              )}
              <p className="text-lg leading-relaxed" style={{ color: "var(--graphite-600)" }}>
                While {locationName} has its own unique financial landscape, the beauty of modern
                markets is that your location no longer dictates your edge. By learning{" "}
                {topicTitle} with Drawdown, you gain access to professional-grade tools and
                community intelligence once reserved for the institutions.
              </p>
              <p className="text-lg leading-relaxed" style={{ color: "var(--graphite-600)" }}>
                We've built Drawdown specifically for traders in hubs like {locationName} who demand
                professional-level education without the archaic costs of physical seminars.
              </p>
            </div>

            {/* Compliance card */}
            <div
              className="p-8 space-y-6 transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: "var(--paper-100)",
                border: "1px solid var(--line-200)",
              }}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" style={{ color: "var(--signal-navy)" }} />
                <span
                  className="text-[10px] font-mono uppercase tracking-widest font-bold"
                  style={{ color: "var(--ink-950)" }}
                >
                  {complianceBadge}
                </span>
              </div>
              <ul className="space-y-4">
                {complianceItems.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-xs"
                    style={{ color: "var(--graphite-600)" }}
                  >
                    <span
                      className="w-1 h-1 rounded-full shrink-0"
                      style={{ background: "var(--signal-navy)" }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Value comparison card ── */}
        <div
          className="p-8 mb-16 space-y-4 transition-all duration-300 hover:-translate-y-0.5"
          style={{ background: "var(--paper-100)", border: "1px solid var(--line-200)" }}
        >
          <span
            className="text-[10px] font-mono uppercase tracking-widest font-bold"
            style={{ color: "var(--graphite-600)" }}
          >
            // Cost Comparison
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            {[
              { label: "Classroom Course", value: "£1,500+", accent: false },
              { label: "Travel & Hotel", value: "£300+", accent: false },
              { label: "Drawdown Access", value: "£49/mo", accent: true },
            ].map((item) => (
              <div
                key={item.label}
                className="flex justify-between items-center text-sm pb-3 border-b"
                style={{ borderColor: "var(--line-200)" }}
              >
                <span style={{ color: "var(--graphite-600)" }}>{item.label}</span>
                <span
                  className="font-bold"
                  style={{ color: item.accent ? "var(--signal-navy)" : "var(--ink-950)" }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
          <p
            className="text-[10px] italic leading-relaxed"
            style={{ color: "var(--graphite-600)" }}
          >
            Save over £1,700 and get access to tools that classroom courses can't provide.
          </p>
        </div>

        {/* ── Main content + sidebar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start mb-32">
          <div className="lg:col-span-2 space-y-20">
            {contentSections.map((section, i) => (
              <section
                key={i}
                className="space-y-8 scroll-mt-32"
                style={{
                  animation: `fadeInUp 0.6s ease both`,
                  animationDelay: `${i * 80}ms`,
                }}
              >
                <h2
                  className="text-3xl md:text-4xl font-sans font-bold uppercase tracking-tight"
                  style={{ color: "var(--ink-950)" }}
                >
                  {i + 1}. {section.heading}
                </h2>
                <p
                  className="leading-relaxed text-lg whitespace-pre-line"
                  style={{ color: "var(--graphite-600)" }}
                >
                  {section.text}
                </p>
                {section.bullets && section.bullets.length > 0 && (
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    {section.bullets.map((bullet, j) => (
                      <li
                        key={j}
                        className="flex gap-4 text-sm p-4 transition-all duration-200 hover:-translate-y-0.5"
                        style={{
                          background: "var(--paper-100)",
                          border: "1px solid var(--line-200)",
                          color: "var(--graphite-600)",
                        }}
                      >
                        <span
                          className="font-bold shrink-0"
                          style={{ color: "var(--signal-navy)" }}
                        >
                          /
                        </span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {/* Sidebar */}
          <aside className="sticky top-32 space-y-8">
            {/* CTA card */}
            <div
              className="p-8 space-y-6 text-center transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: "var(--paper-100)", border: "1px solid var(--line-200)" }}
            >
              <GraduationCap className="w-10 h-10 mx-auto" style={{ color: "var(--signal-navy)" }} />
              <h4
                className="text-xl font-sans font-bold uppercase"
                style={{ color: "var(--ink-950)" }}
              >
                Master {topicTitle}
              </h4>
              <p className="text-xs leading-relaxed" style={{ color: "var(--graphite-600)" }}>
                Join Drawdown's structured curriculum and master the business of risk properly.
              </p>
              <Link
                href={ctaHref}
                className="block w-full py-4 text-[10px] font-bold uppercase tracking-widest transition-all hover:opacity-80"
                style={{
                  background: "var(--signal-navy)",
                  color: "var(--paper-0)",
                  textAlign: "center",
                }}
              >
                {ctaLabel}
              </Link>
            </div>

            {/* Related topics */}
            <div className="space-y-4">
              <h4
                className="text-[10px] font-mono uppercase tracking-widest"
                style={{ color: "var(--graphite-600)" }}
              >
                Other Topics in {locationName}
              </h4>
              {relatedTopics.map((t) => (
                <Link
                  key={t.slug}
                  href={`${regionPrefix}${pathPrefix}/${t.slug}/${locationSlug}`}
                  className="flex items-center justify-between py-3 group transition-all"
                  style={{
                    borderBottom: "1px solid var(--line-200)",
                    color: "var(--graphite-600)",
                  }}
                >
                  <span
                    className="text-[10px] font-mono uppercase tracking-widest group-hover:opacity-70 transition-opacity"
                  >
                    {t.title}
                  </span>
                  <ArrowUpRight
                    className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
                    style={{ color: "var(--signal-navy)" }}
                  />
                </Link>
              ))}
            </div>
          </aside>
        </div>

        {/* ── Local FAQ ── */}
        <section
          className="mb-32 pt-20"
          style={{ borderTop: "1px solid var(--line-200)" }}
        >
          <h2
            className="text-4xl font-sans font-bold uppercase mb-16"
            style={{ color: "var(--ink-950)" }}
          >
            Local FAQ: {locationName}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayFaqs.map((faq, i) => (
              <div
                key={i}
                className="p-8 space-y-4 transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: "var(--paper-100)",
                  border: "1px solid var(--line-200)",
                }}
              >
                <h4
                  className="text-lg font-sans font-bold uppercase"
                  style={{ color: "var(--ink-950)" }}
                >
                  {faq.question}
                </h4>
                <p
                  className="leading-relaxed text-sm"
                  style={{ color: "var(--graphite-600)" }}
                >
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Guru Warning ── */}
        <section
          className="mb-16 p-10 relative overflow-hidden group"
          style={{
            background: "var(--paper-100)",
            border: "1px solid var(--line-200)",
            borderLeft: "4px solid var(--risk-amber)",
          }}
        >
          <div className="flex items-center gap-3 mb-6" style={{ color: "var(--risk-amber)" }}>
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-xs font-mono uppercase font-bold tracking-widest m-0">
              Warning: Avoid the Guru Trap
            </h3>
          </div>
          <p
            className="text-base leading-relaxed italic max-w-3xl"
            style={{ color: "var(--graphite-600)" }}
          >
            Most trading courses targeting {locationName} are designed to sell you indicators or
            Telegram signals. At Drawdown, we teach process and discipline. If a guide promises
            &quot;guaranteed&quot; returns or &quot;100% win rates,&quot; it is a scam. Period.
          </p>
        </section>

        {/* ── Final CTA Banner ── */}
        <section
          className="p-16 relative overflow-hidden text-center"
          style={{ background: "var(--ink-950)" }}
        >
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-6xl font-sans font-bold uppercase leading-none" style={{ color: "var(--paper-0)" }}>
              Start Learning {topicTitle} <br /> from {locationName} Today.
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--paper-0)", opacity: 0.7 }}>
              No fluff. No gurus. Just process.
            </p>
            <Link
              href={ctaHref}
              className="inline-block px-12 py-6 text-[12px] font-bold uppercase tracking-widest transition-all hover:opacity-80"
              style={{ background: "var(--paper-0)", color: "var(--ink-950)" }}
            >
              {ctaLabel}
            </Link>
          </div>
          {/* Decorative letter */}
          <div
            className="absolute -right-20 -bottom-20 text-[300px] font-sans font-black select-none pointer-events-none"
            style={{ color: "var(--paper-0)", opacity: 0.05 }}
          >
            {locationName[0]}
          </div>
        </section>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
