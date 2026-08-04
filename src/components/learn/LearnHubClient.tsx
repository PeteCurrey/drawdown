"use client";

import { useState } from "react";
import Link from "next/link";
import { LEARN_TOPICS } from "@/lib/data/learn-to-trade";
import { 
  ArrowRight, 
  GraduationCap, 
  CheckCircle2, 
  ChevronDown, 
  Activity, 
  Scale, 
  BarChart3, 
  BrainCircuit, 
  HelpCircle,
  Sparkles
} from "lucide-react";
import { TrackPageView } from "@/components/admin/TrackPageView";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { Region, REGIONS_MAP } from "@/lib/seo/hreflang";

interface LearnHubClientProps {
  region?: Region;
}

const FAQS = [
  {
    question: "How long does it realistically take to become a profitable trader?",
    answer: "Becoming consistently profitable typically takes 12 to 24 months of deliberate, structured practice. The first 6 months focus on understanding market mechanics and risk management math; the next 6 months are spent developing emotional discipline and backtesting; and year two is where statistical consistency develops for traders who survive the learning curve."
  },
  {
    question: "How much starting capital do I need to learn and execute safely?",
    answer: "You can start learning on a demo account or backtesting software for zero cost. When live trading, starting with £1,000 to £5,000 allows you to execute proper 1% risk management (£10 to £50 risk per trade). Spread betting allows micro-stake sizes (£0.50/point), making small accounts viable."
  },
  {
    question: "Why do 90% of retail traders lose money, and how is this curriculum different?",
    answer: "Most retail traders fail because they rely on emotional intuition, lack risk management, and fall for 'get-rich-quick' guru marketing. Drawdown treats trading as a data-driven business of probabilities. We teach institutional order flow, strict mathematical position sizing, and systematic backtesting."
  },
  {
    question: "Is financial spread betting tax-free in the UK?",
    answer: "Yes. Under current HMRC regulations, financial spread betting is classified as gambling, making all profits 100% exempt from UK Capital Gains Tax (CGT) and Stamp Duty for UK tax residents, provided trading is not your sole primary business trade. Always consult a tax professional."
  },
  {
    question: "Do I need expensive software or multi-monitor setups to start?",
    answer: "No. All you need is a reliable charting platform like TradingView, a disciplined digital trade journal to track metrics, and an FCA-regulated broker with raw spreads or low-cost spread betting. Complexity is the enemy of execution."
  }
];

export function LearnHubClient({ region }: LearnHubClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  const regionPrefix = region && region !== "uk" ? `/${region}` : "";
  const regionData = region ? REGIONS_MAP[region] : REGIONS_MAP.uk;

  const categories = ["All", "Strategy", "Market"];

  const filteredTopics = selectedCategory === "All"
    ? LEARN_TOPICS
    : LEARN_TOPICS.filter((t) => t.category === selectedCategory);

  const toggleFaq = (index: number) => {
    setExpandedFaqIndex(expandedFaqIndex === index ? null : index);
  };

  // Structured Data for SEO
  const itemListElement = LEARN_TOPICS.map((topic, idx) => ({
    "@type": "ListItem",
    "position": idx + 1,
    "name": topic.title,
    "description": topic.description,
    "url": `https://drawdown.trading${regionPrefix}/learn-to-trade/${topic.slug}`
  }));

  const faqSchemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="pt-28 pb-24 min-h-screen select-none font-sans" style={{ backgroundColor: "var(--paper-0)", color: "var(--ink-950)" }}>
      <TrackPageView path={`${regionPrefix}/learn-to-trade`} />
      
      {/* Schema Markup */}
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": `Drawdown Trading Academy - ${regionData.label}`,
        "description": "Structured, professional-grade trading education from market microstructure to behavioral risk control.",
        "itemListElement": itemListElement
      }} />
      <JsonLd data={faqSchemaData} />

      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* Breadcrumbs Navigation */}
        <div className="mb-8">
          <Breadcrumbs 
            items={[
              { label: 'Learn to Trade', href: `${regionPrefix}/learn-to-trade` }
            ]} 
          />
        </div>

        {/* Hero Section */}
        <header className="mb-16 border-b pb-12" style={{ borderColor: "var(--line-200)" }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.08em] px-2.5 py-1 border" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)", color: "var(--signal-navy)" }}>
              <GraduationCap size={14} />
              Trading Academy · {regionData.label}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-6">
              <h1 className="font-display text-[clamp(2.5rem,5.5vw,4.25rem)] leading-[1.05] tracking-[-0.02em] font-semibold">
                Trading Education, <br />
                <span style={{ color: "var(--signal-navy)" }}>Stripped of the Hype.</span>
              </h1>
              <p className="text-[16px] leading-[1.65] font-sans max-w-2xl" style={{ color: "var(--graphite-600)" }}>
                We don't sell signal groups or instant wealth. We provide a structured, institutional-grade curriculum designed to transform independent traders into disciplined risk managers. No shortcuts. Just quantitative data and market mechanics.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col justify-end">
              <div className="p-5 border space-y-3" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}>
                <div className="text-[11px] font-mono uppercase tracking-[0.08em] font-semibold" style={{ color: "var(--signal-navy)" }}>
                  Academy Overview
                </div>
                <div className="grid grid-cols-2 gap-3 text-[12px] font-mono">
                  <div>
                    <span className="block text-[10px] uppercase" style={{ color: "var(--graphite-600)" }}>Modules</span>
                    <span className="font-bold text-[14px]" style={{ color: "var(--ink-950)" }}>8 Core Pillars</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase" style={{ color: "var(--graphite-600)" }}>Max Risk</span>
                    <span className="font-bold text-[14px]" style={{ color: "var(--signal-navy)" }}>1.0% Per Trade</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase" style={{ color: "var(--graphite-600)" }}>Tax Status</span>
                    <span className="font-bold text-[13px]" style={{ color: "var(--ink-950)" }}>
                      {region === "uk" || !region ? "Tax-Free SB" : "ASIC/Global"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase" style={{ color: "var(--graphite-600)" }}>Horizon</span>
                    <span className="font-bold text-[13px]" style={{ color: "var(--ink-950)" }}>12-24 Months</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Flagship Course Banner */}
        <section className="mb-20">
          <div 
            className="group relative p-8 md:p-10 border transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg"
            style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-[0.08em] px-2.5 py-1 border" style={{ backgroundColor: "var(--signal-navy)", borderColor: "var(--signal-navy)", color: "#FAFAF9" }}>
                    <Sparkles size={13} />
                    Flagship Program
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--graphite-600)" }}>
                    12-Week Intensive
                  </span>
                </div>

                <h2 className="font-display text-[28px] md:text-[34px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
                  The Institutional Foundation &amp; Execution Pathway
                </h2>

                <p className="text-[14px] leading-relaxed font-sans max-w-3xl" style={{ color: "var(--graphite-600)" }}>
                  Our master program covering market microstructure, London session liquidity sweeps, mathematical position sizing, and cognitive risk management. Built for traders serious about capital survival.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="flex items-center gap-2 text-[12px] font-sans" style={{ color: "var(--ink-950)" }}>
                    <CheckCircle2 size={15} style={{ color: "var(--signal-navy)" }} className="shrink-0" />
                    <span>Order Flow &amp; Depth of Market</span>
                  </div>
                  <div className="flex items-center gap-2 text-[12px] font-sans" style={{ color: "var(--ink-950)" }}>
                    <CheckCircle2 size={15} style={{ color: "var(--signal-navy)" }} className="shrink-0" />
                    <span>Statistical Backtesting Math</span>
                  </div>
                  <div className="flex items-center gap-2 text-[12px] font-sans" style={{ color: "var(--ink-950)" }}>
                    <CheckCircle2 size={15} style={{ color: "var(--signal-navy)" }} className="shrink-0" />
                    <span>Prop Firm Evaluation Prep</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex justify-start lg:justify-end">
                <Link
                  href={`${regionPrefix}/courses`}
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 text-[12px] font-mono font-bold uppercase tracking-[0.08em] transition-all duration-300 group-hover:scale-[1.02] shrink-0 w-full sm:w-auto"
                  style={{ backgroundColor: "var(--signal-navy)", color: "#FAFAF9" }}
                >
                  <span>Explore Full Curriculum</span>
                  <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Modules Filter & Grid */}
        <section className="mb-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b pb-4" style={{ borderColor: "var(--line-200)" }}>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-[0.08em] block mb-1" style={{ color: "var(--graphite-600)" }}>
                Core Learning Modules
              </span>
              <h2 className="font-display text-[26px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
                Master the Financial Markets
              </h2>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className="px-4 py-2 text-[11px] font-mono uppercase tracking-[0.08em] border transition-all duration-200 shrink-0"
                    style={{
                      backgroundColor: isActive ? "var(--signal-navy)" : "var(--paper-0)",
                      borderColor: isActive ? "var(--signal-navy)" : "var(--line-200)",
                      color: isActive ? "#FAFAF9" : "var(--ink-950)",
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    {cat === "All" ? "All Modules" : cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Module Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics.map((topic) => (
              <Link
                key={topic.slug}
                href={`${regionPrefix}/learn-to-trade/${topic.slug}`}
                className="group relative flex flex-col justify-between p-7 border transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-md hover:border-[var(--signal-navy)]"
                style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}
              >
                <div className="space-y-5">
                  {/* Top Meta Tags */}
                  <div className="flex items-center justify-between gap-2 text-[10px] font-mono uppercase tracking-[0.08em]">
                    <span className="px-2 py-0.5 border" style={{ backgroundColor: "var(--paper-0)", borderColor: "var(--line-200)", color: "var(--signal-navy)" }}>
                      {topic.category}
                    </span>
                    {topic.difficulty && (
                      <span className="px-2 py-0.5 border" style={{ backgroundColor: "var(--paper-0)", borderColor: "var(--line-200)", color: "var(--graphite-600)" }}>
                        {topic.difficulty}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="font-display text-[22px] font-semibold tracking-[-0.01em] group-hover:text-[var(--signal-navy)] transition-colors" style={{ color: "var(--ink-950)" }}>
                      {topic.title}
                    </h3>
                    <p className="text-[13px] leading-relaxed font-sans line-clamp-3" style={{ color: "var(--graphite-600)" }}>
                      {topic.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Meta & Action */}
                <div className="pt-6 mt-6 border-t space-y-4" style={{ borderColor: "var(--line-200)" }}>
                  {topic.timeToLearn && (
                    <div className="flex items-center justify-between text-[11px] font-mono" style={{ color: "var(--graphite-600)" }}>
                      <span>Time Commitment:</span>
                      <span className="font-medium" style={{ color: "var(--ink-950)" }}>{topic.timeToLearn}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[12px] font-mono font-bold uppercase tracking-[0.08em]" style={{ color: "var(--signal-navy)" }}>
                    <span>Explore Module</span>
                    <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SEO Educational Philosophy Section */}
        <section className="mb-24 p-8 md:p-12 border space-y-10" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}>
          <div className="max-w-3xl space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.08em] block" style={{ color: "var(--signal-navy)" }}>
              The Drawdown Methodology
            </span>
            <h2 className="font-display text-[30px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              The Four Pillars of Institutional Execution
            </h2>
            <p className="text-[14px] leading-relaxed font-sans" style={{ color: "var(--graphite-600)" }}>
              Most retail trading education focuses on decorative indicators and hindsight chart patterns. Our curriculum is built around the four mechanical pillars that govern real financial markets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3 p-6 border bg-[var(--paper-0)]" style={{ borderColor: "var(--line-200)" }}>
              <div className="flex items-center gap-3">
                <div className="p-2 border" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)", color: "var(--signal-navy)" }}>
                  <Activity size={18} />
                </div>
                <h3 className="font-display text-[18px] font-semibold" style={{ color: "var(--ink-950)" }}>
                  1. Market Microstructure &amp; Order Flow
                </h3>
              </div>
              <p className="text-[13px] leading-relaxed font-sans" style={{ color: "var(--graphite-600)" }}>
                Understand how electronic communication networks (ECNs) matching engines, depth of market (DOM), and tier-1 bank liquidity pools interact. Learn why London Open volatility sweeps retail stop-losses before initiating major trends.
              </p>
            </div>

            <div className="space-y-3 p-6 border bg-[var(--paper-0)]" style={{ borderColor: "var(--line-200)" }}>
              <div className="flex items-center gap-3">
                <div className="p-2 border" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)", color: "var(--signal-navy)" }}>
                  <Scale size={18} />
                </div>
                <h3 className="font-display text-[18px] font-semibold" style={{ color: "var(--ink-950)" }}>
                  2. Mathematical Risk Management
                </h3>
              </div>
              <p className="text-[13px] leading-relaxed font-sans" style={{ color: "var(--graphite-600)" }}>
                Capital preservation is the prerequisite for profitability. Learn strict 1% risk modeling, mathematical lot size calculation, expected value (EV) formulas, and how to survive catastrophic market drawdowns without panic.
              </p>
            </div>

            <div className="space-y-3 p-6 border bg-[var(--paper-0)]" style={{ borderColor: "var(--line-200)" }}>
              <div className="flex items-center gap-3">
                <div className="p-2 border" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)", color: "var(--signal-navy)" }}>
                  <BrainCircuit size={18} />
                </div>
                <h3 className="font-display text-[18px] font-semibold" style={{ color: "var(--ink-950)" }}>
                  3. Behavioral Psychology &amp; Cognitive Control
                </h3>
              </div>
              <p className="text-[13px] leading-relaxed font-sans" style={{ color: "var(--graphite-600)" }}>
                Human evolution hardwires us to cut winners early and hold losers hoping for a turnaround. We teach mechanical trading frameworks that neutralize FOMO, revenge trading, and emotional over-leveraging.
              </p>
            </div>

            <div className="space-y-3 p-6 border bg-[var(--paper-0)]" style={{ borderColor: "var(--line-200)" }}>
              <div className="flex items-center gap-3">
                <div className="p-2 border" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)", color: "var(--signal-navy)" }}>
                  <BarChart3 size={18} />
                </div>
                <h3 className="font-display text-[18px] font-semibold" style={{ color: "var(--ink-950)" }}>
                  4. Quantitative Backtesting &amp; Edge Verification
                </h3>
              </div>
              <p className="text-[13px] leading-relaxed font-sans" style={{ color: "var(--graphite-600)" }}>
                If you cannot verify your statistical win-rate over 100 historical trades, you are gambling. Learn to log metrics, calculate Sharpe ratios, analyze sample sizes, and continuously refine your trading plan.
              </p>
            </div>
          </div>
        </section>

        {/* Interactive FAQ Section */}
        <section className="mb-20 max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.08em] flex items-center justify-center gap-2" style={{ color: "var(--signal-navy)" }}>
              <HelpCircle size={14} />
              Frequently Asked Questions
            </span>
            <h2 className="font-display text-[28px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              Realistic Answers to Common Questions
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = expandedFaqIndex === index;
              return (
                <div
                  key={index}
                  className="border transition-colors"
                  style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-sans font-semibold text-[15px]"
                    style={{ color: "var(--ink-950)" }}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                      style={{ color: "var(--signal-navy)" }}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 text-[14px] leading-relaxed font-sans border-t" style={{ borderColor: "var(--line-200)", color: "var(--graphite-600)" }}>
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom Callout Banner */}
        <section className="p-8 md:p-12 border text-center space-y-6" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}>
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--signal-navy)" }}>
              Ready to verify your edge?
            </span>
            <h3 className="font-display text-[26px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              Explore Our Suite of Professional Tools &amp; Data
            </h3>
            <p className="text-[14px] leading-relaxed font-sans" style={{ color: "var(--graphite-600)" }}>
              Complement your educational foundation with our quantitative risk calculators, broker analysis engine, and live market pulse monitors.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-2 font-mono text-[12px]">
            <Link
              href={`${regionPrefix}/tools`}
              className="px-6 py-3 border font-bold uppercase tracking-[0.08em] transition-all hover:-translate-y-0.5"
              style={{ backgroundColor: "var(--signal-navy)", borderColor: "var(--signal-navy)", color: "#FAFAF9" }}
            >
              Trading Tools &amp; Calculators
            </Link>
            <Link
              href={`${regionPrefix}/brokers`}
              className="px-6 py-3 border font-bold uppercase tracking-[0.08em] transition-all hover:-translate-y-0.5"
              style={{ backgroundColor: "var(--paper-0)", borderColor: "var(--line-200)", color: "var(--ink-950)" }}
            >
              Compare FCA Brokers
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
