import React from "react";
import Link from "next/link";
import {
  FileText,
  ArrowRight,
  Download,
  Mail,
  BarChart2,
  ShieldCheck,
  BookOpen,
  Code2,
  ExternalLink,
} from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { getMetadata } from "@/lib/metadata";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = getMetadata({
  title: "Press & Media | Drawdown Trading Research & Data",
  description:
    "Journalist resources from Drawdown Trading: original trading research, verified data benchmarks, embeddable calculators, spokesperson details, and citation guidelines.",
  path: "/press",
});

const DATA_BENCHMARKS = [
  {
    stat: "68%",
    context:
      "simulated probability of experiencing a >30% drawdown when risking the full Kelly fraction (4.5%) over 1,000 trades — despite Kelly being theoretically optimal for long-run growth (45% win rate, 1.5:1 RR, 10,000 Monte Carlo iterations)",
    source: "Drawdown Research — Position Sizing Monte Carlo Study (2026) [simulated/modelled data, not observed trader behaviour]",
    cite: "https://drawdown.trading/research/position-sizing",
  },
  {
    stat: "22%",
    context:
      "simulated probability of experiencing a >30% drawdown at any point during 1,000 trades at 1% risk per trade (45% win rate, 1.5:1 RR, 10,000 Monte Carlo iterations)",
    source: "Drawdown Research — Position Sizing Monte Carlo Study (2026) [simulated/modelled data, not observed trader behaviour]",
    cite: "https://drawdown.trading/research/position-sizing",
  },
  {
    stat: "38%",
    context:
      "simulated probability of account ruin when risking 3% per trade over 1,000 trades at 45% win rate — versus 2% ruin probability at 1% risk (10,000 Monte Carlo iterations)",
    source: "Drawdown Research — Position Sizing Monte Carlo Study (2026) [simulated/modelled data, not observed trader behaviour]",
    cite: "https://drawdown.trading/research/position-sizing",
  },
  {
    stat: "66.7%",
    context:
      "gain required to recover from a 40% drawdown — the non-linear mathematics of loss recovery that most retail traders underestimate",
    source: "Drawdown Research — Drawdown Recovery Mathematics (2026) [mathematical calculation]",
    cite: "https://drawdown.trading/calculators/drawdown-recovery",
  },
  {
    stat: "4.5%",
    context:
      "full-Kelly fraction for a 45% win rate, 1.5:1 RR strategy — producing >70% drawdown in 41% of simulated runs despite being theoretically optimal (10,000 Monte Carlo iterations)",
    source: "Drawdown Research — Position Sizing Monte Carlo Study (2026) [simulated/modelled data, not observed trader behaviour]",
    cite: "https://drawdown.trading/research/position-sizing",
  },
];

const EMBEDDABLE_TOOLS = [
  {
    name: "Position Size Calculator",
    desc: "Calculates correct lot sizes from account balance, risk percentage, and stop loss distance.",
    path: "/calculators/position-size",
    embedPath: "/embed/position-size",
  },
  {
    name: "Drawdown Recovery Calculator",
    desc: "Shows the non-linear gain required to recover from any percentage drawdown.",
    path: "/calculators/drawdown-recovery",
    embedPath: "/embed/drawdown-recovery",
  },
  {
    name: "Risk of Ruin Simulator",
    desc: "Models the probability of account termination based on win rate and risk per trade.",
    path: "/calculators/risk-of-ruin",
    embedPath: "/embed/risk-of-ruin",
  },
];

const RESEARCH_PAPERS = [
  {
    title: "Position Sizing: Fixed-Fractional vs Fixed-Lot — 10,000-Iteration Monte Carlo",
    url: "/research/position-sizing",
    published: "May 2026",
  },
  {
    title: "Prop Firm Challenge Economics: Survival Probability & Trailing Drawdown Mechanics",
    url: "/research/prop-firms",
    published: "April 2026",
  },
  {
    title: "Broker Cost Audit: Round-Trip Trading Costs Across 8 UK FCA-Regulated Brokers",
    url: "/research/trading-costs",
    published: "March 2026",
  },
  {
    title: "Quantitative Risk & Drawdown Recovery Studies",
    url: "/research/risk",
    published: "February 2026",
  },
];

export default function PressPage() {
  return (
    <div className="min-h-screen pb-24 pt-32 bg-background-primary text-text-primary">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Drawdown Press & Media Centre",
            "url": "https://drawdown.trading/press",
            "description": "Journalist resources: original trading research, verified data benchmarks, embeddable calculators, and citation guidelines.",
            "publisher": {
              "@type": "Organization",
              "name": "Drawdown Trading",
              "url": "https://drawdown.trading",
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Press",
                "email": "press@drawdown.trading",
              },
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://drawdown.trading" },
                { "@type": "ListItem", "position": 2, "name": "Press", "item": "https://drawdown.trading/press" },
              ],
            },
          },
        ]}
      />

      <div className="container mx-auto px-6 max-w-5xl">
        <Breadcrumbs items={[{ label: "Press", href: "/press" }]} />

        {/* Hero */}
        <header className="mb-16 max-w-3xl space-y-5">
          <div className="flex items-center gap-3 text-accent">
            <FileText className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Media & Press</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-sans font-black uppercase leading-tight">
            Drawdown <span className="text-accent italic">Press.</span>
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed max-w-2xl">
            Original quantitative research, verified data benchmarks, and free embeddable trading calculators for financial journalists, content publishers, and researchers. All data is first-party and carries transparent methodology documentation.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="mailto:press@drawdown.trading"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-background-primary text-[10px] font-mono font-black uppercase tracking-widest hover:bg-accent/90 transition"
            >
              <Mail className="w-3.5 h-3.5" /> Press Enquiries
            </a>
            <Link
              href="/research"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-border-slate/50 text-text-secondary text-[10px] font-mono uppercase tracking-widest hover:border-accent hover:text-text-primary transition"
            >
              Research Centre <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Citable Data Benchmarks */}
        <section className="mb-20">
          <h2 className="text-2xl font-sans font-black uppercase text-text-primary flex items-center gap-3 mb-8">
            <BarChart2 className="w-5 h-5 text-accent flex-shrink-0" />
            Citable Data Benchmarks
          </h2>
          <p className="text-xs text-text-secondary mb-6 leading-relaxed max-w-3xl">
            The following statistics are drawn from Drawdown's first-party research studies. Each includes a source citation and a link to the full methodology. All may be cited with attribution to "Drawdown Trading Research".
          </p>
          <div className="space-y-4">
            {DATA_BENCHMARKS.map((b, i) => (
              <div key={i} className="p-5 border border-border-slate/40 bg-background-surface/30 space-y-2">
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 text-3xl font-black text-accent font-mono leading-none mt-0.5">
                    {b.stat}
                  </span>
                  <p className="text-sm text-text-primary leading-snug">{b.context}</p>
                </div>
                <div className="flex items-center gap-2 pt-1 pl-16">
                  <span className="text-[10px] text-text-tertiary font-mono">Source:</span>
                  <Link
                    href={b.cite}
                    className="text-[10px] text-accent hover:underline font-mono"
                  >
                    {b.source}
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-text-tertiary mt-4 italic">
            Citation format: "Drawdown Trading Research [Year]. [Title]. Retrieved from drawdown.trading"
          </p>
        </section>

        {/* Embeddable Calculators */}
        <section className="mb-20">
          <h2 className="text-2xl font-sans font-black uppercase text-text-primary flex items-center gap-3 mb-8">
            <Code2 className="w-5 h-5 text-accent flex-shrink-0" />
            Free Embeddable Calculators
          </h2>
          <p className="text-xs text-text-secondary mb-6 leading-relaxed max-w-3xl">
            The following calculators are available for free embedding on any publisher, blog, or educational website. No registration required. Attribution requested (link back to the tool page).
          </p>
          <div className="space-y-4">
            {EMBEDDABLE_TOOLS.map((tool) => (
              <div key={tool.path} className="p-5 border border-border-slate/40 bg-background-surface/30 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-text-primary">{tool.name}</p>
                    <p className="text-xs text-text-secondary leading-relaxed">{tool.desc}</p>
                  </div>
                  <Link
                    href={tool.path}
                    className="flex-shrink-0 text-[9px] font-mono font-bold uppercase tracking-widest text-accent hover:underline flex items-center gap-1"
                  >
                    Preview <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
                <div className="bg-background-primary border border-border-slate/50 p-3 font-mono text-[10px] text-text-secondary overflow-x-auto">
                  {`<iframe src="https://drawdown.trading${tool.embedPath}" width="100%" height="420" frameborder="0" title="${tool.name}"></iframe>`}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Published Research */}
        <section className="mb-20">
          <h2 className="text-2xl font-sans font-black uppercase text-text-primary flex items-center gap-3 mb-8">
            <BookOpen className="w-5 h-5 text-accent flex-shrink-0" />
            Published Research Papers
          </h2>
          <div className="space-y-3">
            {RESEARCH_PAPERS.map((paper) => (
              <Link
                key={paper.url}
                href={paper.url}
                className="flex items-center justify-between p-4 border border-border-slate/40 hover:border-accent bg-background-surface/30 group transition-colors"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors leading-snug">
                    {paper.title}
                  </p>
                  <p className="text-[10px] text-text-tertiary font-mono">Published: {paper.published}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-accent flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
          <div className="mt-4">
            <Link
              href="/research"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-secondary hover:text-accent transition border-b border-transparent hover:border-accent pb-0.5"
            >
              View All Research <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* Editorial Standards */}
        <section className="mb-20 p-6 border border-border-slate/40 bg-background-surface/30 space-y-4">
          <h2 className="text-lg font-bold uppercase text-text-primary flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-accent" />
            Editorial & Research Standards
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {[
              { label: "No affiliate influence on rankings", detail: "Broker and prop firm rankings are independent of commercial relationships. Affiliate disclosure appears on every link." },
              { label: "Transparent methodology", detail: "All research includes sampling methodology, sample size, date of collection, and a public corrections log." },
              { label: "No unsupported statistics", detail: "Every statistic is either first-party (with methodology documentation) or attributed to a named external source." },
              { label: "Public corrections log", detail: "All factual errors identified post-publication are logged and corrected publicly at /research/corrections." },
            ].map((s, i) => (
              <div key={i} className="space-y-1">
                <p className="font-bold text-text-primary">{s.label}</p>
                <p className="text-text-secondary leading-relaxed">{s.detail}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <Link href="/editorial-policy" className="text-[10px] font-mono text-accent hover:underline">
              Editorial Policy →
            </Link>
            <Link href="/research/methodology" className="text-[10px] font-mono text-accent hover:underline">
              Research Methodology →
            </Link>
            <Link href="/research/corrections" className="text-[10px] font-mono text-accent hover:underline">
              Corrections Log →
            </Link>
          </div>
        </section>

        {/* Contact */}
        <section className="p-6 border border-accent/30 bg-accent/5 flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex-1 space-y-1">
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-accent">Media enquiries</p>
            <p className="text-sm font-bold text-text-primary">
              For interviews, data licensing, or custom research requests
            </p>
            <p className="text-xs text-text-secondary">
              We provide spokesperson commentary on retail trading, prop firm industry trends, and retail investor behaviour. Response within 48 hours on business days.
            </p>
          </div>
          <a
            href="mailto:press@drawdown.trading"
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-accent text-background-primary text-[10px] font-mono font-black uppercase tracking-widest hover:bg-accent/90 transition"
          >
            <Mail className="w-3.5 h-3.5" /> press@drawdown.trading
          </a>
        </section>
      </div>
    </div>
  );
}
