import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart2,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
} from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { getMetadata } from "@/lib/metadata";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = getMetadata({
  title: "Drawdown for Day Traders | Risk Management & Position Sizing Tools",
  description:
    "Professional risk management tools for active day traders: real-time position sizing, session risk tracking, pip value calculation, and drawdown management built for traders who trade daily.",
  path: "/for/day-traders",
});

const PAIN_POINTS = [
  {
    problem: "Sizing positions inconsistently across different instruments or session conditions",
    solution: "The position size calculator takes your account balance, risk percentage, and stop loss in pips or points to return the exact lot size — across forex, gold, and indices. Consistent sizing is the foundation of consistent risk.",
    href: "/calculators/position-size",
    cta: "Position Size Calculator",
  },
  {
    problem: "Not knowing the cash value of a pip move in your account currency",
    solution: "Pip values differ across instruments and account currencies. A 10-pip move on gold in a GBP account has a different cash value than the same move in a USD account. The pip value calculator outputs exact monetary values per pip per lot.",
    href: "/calculators/pip-value",
    cta: "Pip Value Calculator",
  },
  {
    problem: "Continuing to trade after an already-bad session compounds the loss",
    solution: "The daily risk calculator shows exactly how much cash and percentage risk you have consumed in a session — and when to stop. Most profitable traders have a daily stop-loss rule; Drawdown calculates when you've hit it.",
    href: "/calculators/risk",
    cta: "Session Risk Calculator",
  },
  {
    problem: "Compounding ambitions don't account for the mathematical reality of drawdowns",
    solution: "Recovering from a 20% drawdown requires a 25% gain on remaining capital. A 40% drawdown requires 66.7%. The drawdown recovery calculator shows the exact gain required from any drawdown level — the number that most traders underestimate.",
    href: "/calculators/drawdown-recovery",
    cta: "Drawdown Recovery Calculator",
  },
];

const WHAT_IS_INCLUDED = [
  "9 professional risk management calculators — all free, no registration required",
  "Position sizing for forex, gold, indices — with pip value calculation in any account currency",
  "Session risk tracking — daily P&L vs risk limits",
  "Drawdown recovery mathematics — exact gain required from any drawdown level",
  "Compounding calculator — realistic projections with configurable win rate and RR",
  "Risk management framework — 6 principles, 4 formula references, prop firm applications",
];

export default function ForDayTradersPage() {
  const faqs = [
    {
      question: "What is fixed-fractional position sizing and why does it matter for day traders?",
      answer:
        "Fixed-fractional sizing means risking a consistent percentage of your current account balance on each trade — typically 0.5% to 2%. This means your lot sizes automatically scale down after losses (reducing risk when the account is depleted) and scale up after gains. Day traders who use fixed-lot sizing instead face an accelerating risk problem: the same lot size represents a higher percentage of a reduced balance, increasing effective risk at precisely the wrong time.",
    },
    {
      question: "Should I use the same position size for all instruments?",
      answer:
        "No. Because pip values differ significantly between instruments, a 20-pip stop on EUR/USD represents a different cash risk to a 20-pip stop on GBP/JPY or a 20-point stop on the S&P 500 index. The position size calculator accounts for instrument-specific pip values to ensure your risk-per-trade in cash terms is consistent regardless of which instrument you trade.",
    },
    {
      question: "How do I set a daily loss limit?",
      answer:
        "A day trader's daily loss limit should be defined before the session begins — not during. A common standard is 2–3× your average win, or a percentage of account (e.g. 3–5%). The risk calculator tracks your cumulative session loss against this limit. When you reach it, you stop for the day — no exceptions. This single discipline prevents most catastrophic loss days.",
    },
    {
      question: "How accurate are the compounding calculator projections?",
      answer:
        "The compounding calculator uses your specified win rate, average reward:risk ratio, and number of trades to model expected equity growth. It does not account for drawdown variance. Real equity curves are never smooth — the position sizing research shows that even at identical win rates, terminal balances vary enormously between simulation runs. Treat projections as central-case estimates, not guarantees.",
    },
  ];

  return (
    <div className="min-h-screen pb-24 pt-32 bg-background-primary text-text-primary">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Drawdown for Day Traders",
            "url": "https://drawdown.trading/for/day-traders",
            "description": "Professional risk management tools for active day traders: position sizing, pip value, session risk tracking, and drawdown management.",
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://drawdown.trading" },
                { "@type": "ListItem", "position": 2, "name": "For Day Traders", "item": "https://drawdown.trading/for/day-traders" },
              ],
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map((f) => ({
              "@type": "Question",
              "name": f.question,
              "acceptedAnswer": { "@type": "Answer", "text": f.answer },
            })),
          },
        ]}
      />

      <div className="container mx-auto px-6 max-w-5xl">
        <Breadcrumbs items={[{ label: "For Day Traders", href: "/for/day-traders" }]} />

        {/* Hero */}
        <header className="mb-16 max-w-3xl space-y-5">
          <div className="flex items-center gap-3 text-accent">
            <Clock className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">For Day Traders</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-sans font-black uppercase leading-tight">
            Trade Every Day.<br />
            <span className="text-accent italic">Manage Risk Every Trade.</span>
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed max-w-2xl">
            Nine professional risk management calculators for traders who operate daily. Position sizing, pip values, session risk limits, drawdown recovery — the maths that separates consistent traders from lottery players.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/pricing" className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-background-primary text-[10px] font-mono font-black uppercase tracking-widest hover:bg-accent/90 transition">
              Start Free <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/calculators/position-size" className="inline-flex items-center gap-2 px-5 py-2.5 border border-border-slate/50 text-text-secondary text-[10px] font-mono uppercase tracking-widest hover:border-accent hover:text-text-primary transition">
              Position Size Calculator <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Pain Points → Solutions */}
        <section className="mb-20">
          <h2 className="text-2xl font-sans font-black uppercase text-text-primary mb-8">Common Day Trading Problems — And the Specific Tool That Addresses Each</h2>
          <div className="space-y-4">
            {PAIN_POINTS.map((p, i) => (
              <div key={i} className="p-5 border border-border-slate/40 bg-background-surface/30 space-y-3">
                <div className="flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-red-400">{p.problem}</p>
                </div>
                <div className="pl-7">
                  <p className="text-xs text-text-secondary leading-relaxed">{p.solution}</p>
                </div>
                <div className="pl-7">
                  <Link href={p.href} className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-accent hover:underline">
                    {p.cta} <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What's included */}
        <section className="mb-20 p-6 border border-border-slate/40 bg-background-surface/30 space-y-5">
          <h2 className="text-xl font-bold uppercase text-text-primary">What's Included</h2>
          <ul className="space-y-3">
            {WHAT_IS_INCLUDED.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-xs text-text-secondary leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
          <div className="pt-2">
            <Link href="/pricing" className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-background-primary text-[10px] font-mono font-black uppercase tracking-widest hover:bg-accent/90 transition">
              View Plans & Pricing <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* Tools grid */}
        <section className="mb-20">
          <h2 className="text-xl font-bold uppercase text-text-primary mb-6">All Day Trading Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              { label: "Position Size Calculator", href: "/calculators/position-size" },
              { label: "Pip Value Calculator", href: "/calculators/pip-value" },
              { label: "Risk Calculator", href: "/calculators/risk" },
              { label: "Drawdown Calculator", href: "/calculators/drawdown" },
              { label: "Drawdown Recovery Calculator", href: "/calculators/drawdown-recovery" },
              { label: "Compounding Calculator", href: "/calculators/compounding" },
              { label: "Risk of Ruin Simulator", href: "/calculators/risk-of-ruin" },
              { label: "Risk Management Framework", href: "/risk-management" },
            ].map((t) => (
              <Link key={t.href} href={t.href} className="flex items-center justify-between p-3 border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group rounded-sm">
                <span>{t.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </section>

        {/* Research link */}
        <section className="mb-20 p-5 border border-border-slate/40 bg-background-surface/30 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-bold text-text-primary">Position Sizing Research — Monte Carlo Study</p>
            <p className="text-xs text-text-secondary leading-relaxed">
              10,000-iteration simulation showing survival probabilities, ruin rates, and drawdown distributions at 5 risk levels for a 45% win rate, 1.5:1 RR strategy.
            </p>
          </div>
          <Link href="/research/position-sizing" className="flex-shrink-0 inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-accent hover:underline">
            Read <ArrowRight className="w-3 h-3" />
          </Link>
        </section>

        {/* FAQs */}
        <section className="mb-8">
          <h2 className="text-2xl font-sans font-black uppercase text-text-primary flex items-center gap-3 mb-8">
            <HelpCircle className="w-6 h-6 text-accent flex-shrink-0" />
            Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="p-5 border border-border-slate/40 bg-background-surface/30 space-y-2">
                <h3 className="text-sm font-bold text-text-primary">{faq.question}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
