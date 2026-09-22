import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  BarChart2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { getMetadata } from "@/lib/metadata";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = getMetadata({
  title: "Drawdown for Prop Firm Traders | Risk Tools & Challenge Preparation",
  description:
    "Risk management tools, challenge preparation guides, and prop firm comparisons — built specifically for traders preparing for or trading a funded evaluation account.",
  path: "/for/prop-firm-traders",
});

const PAIN_POINTS = [
  {
    problem: "Breaching the daily loss limit before end of session",
    solution: "Use the daily loss calculator before each session to know exactly how many pips or lots will trigger the limit — and at what account balance your current lot size becomes unsafe.",
    href: "/calculators/prop-firm-daily-loss",
    cta: "Daily Loss Calculator",
  },
  {
    problem: "Oversizing on winning streaks, then losing it back on a single trade",
    solution: "Fixed-fractional position sizing scales risk proportionally to balance. The position size calculator enforces this — preventing the common mistake of locking in percentage risk that was appropriate at a higher balance.",
    href: "/calculators/position-size",
    cta: "Position Size Calculator",
  },
  {
    problem: "Not knowing which prop firm to choose or how rules compare",
    solution: "The prop firm comparison tool compares daily loss rules, trailing vs static drawdown, consistency rules, and payout split across 8 reviewed firms — with individual review pages for each.",
    href: "/prop-firms/compare",
    cta: "Compare Prop Firms",
  },
  {
    problem: "Failing repeatedly without understanding the mathematical reason",
    solution: "Risk-of-ruin research shows that at 2% risk per trade with a 45% win rate, 38% of accounts will be terminated over 1,000 trades. The maths of evaluation failure is not psychological — it is probabilistic.",
    href: "/research/position-sizing",
    cta: "Read the Research",
  },
];

const WHAT_IS_INCLUDED = [
  "9 professional risk management calculators (daily loss, max loss, position size, risk of ruin, pip value, drawdown recovery, compounding, risk, and prop firm loss limits)",
  "Prop firm challenge protocol — 5-phase preparation guide from risk framework to evaluation execution",
  "8 individually reviewed prop firms with spread, payout, and rule analysis",
  "Prop firm comparison tool — rule-by-rule side-by-side for 8 firms",
  "Monte Carlo position sizing research — 10,000-iteration simulation data",
  "Risk management framework — 6 core principles with formula references",
];

export default function ForPropFirmTradersPage() {
  const faqs = [
    {
      question: "How does Drawdown help with prop firm challenges specifically?",
      answer:
        "Drawdown provides the daily loss calculator (to know when to stop trading in a session), the maximum loss calculator (to track overall drawdown headroom), and the position size calculator (to enforce fixed-fractional risk on every trade). These three tools together address the three most common reasons traders fail evaluations: session-level daily loss breach, account-level drawdown breach, and oversizing.",
    },
    {
      question: "Does Drawdown connect to prop firm accounts directly?",
      answer:
        "The platform calculators work independently — you enter your account parameters and current balance manually. There is no direct API connection to prop firm trading accounts. The risk management calculations are performed locally and do not require connecting your trading account.",
    },
    {
      question: "Which prop firms does Drawdown recommend?",
      answer:
        "Drawdown does not rank prop firms on commission rates. The prop firm comparison tool presents rule structures, drawdown types (trailing vs static), consistency requirements, and payout terms for 8 reviewed firms. Each firm has an individual review page. The 'right' firm depends on your strategy type, preferred drawdown model, and target account size.",
    },
    {
      question: "What risk per trade should I use during a prop firm evaluation?",
      answer:
        "The position sizing research data shows that 1% fixed-fractional risk per trade at a 45% win rate produces a 2% ruin probability over 1,000 trades, compared to 38% at 3% risk. For a 5% daily loss limit, 1% risk means five consecutive full-stop-loss losses will exactly consume the daily limit — appropriate for a disciplined intraday strategy. For more conservative approaches, 0.5% risk reduces the 1,000-trade ruin probability to under 1%.",
    },
  ];

  return (
    <div className="min-h-screen pb-24 pt-32 bg-background-primary text-text-primary">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Drawdown for Prop Firm Traders",
            "url": "https://drawdown.trading/for/prop-firm-traders",
            "description": "Risk management tools and challenge preparation resources for prop firm evaluation traders.",
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://drawdown.trading" },
                { "@type": "ListItem", "position": 2, "name": "For Prop Firm Traders", "item": "https://drawdown.trading/for/prop-firm-traders" },
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
        <Breadcrumbs items={[{ label: "For Prop Firm Traders", href: "/for/prop-firm-traders" }]} />

        {/* Hero */}
        <header className="mb-16 max-w-3xl space-y-5">
          <div className="flex items-center gap-3 text-accent">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">For Prop Firm Traders</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-sans font-black uppercase leading-tight">
            Pass Your Challenge.<br />
            <span className="text-accent italic">Without the Hype.</span>
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed max-w-2xl">
            The tools that matter for prop firm evaluations: daily loss tracking, position sizing that respects your drawdown rules, prop firm comparison across 8 reviewed firms, and the research that explains why most traders fail.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/pricing" className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-background-primary text-[10px] font-mono font-black uppercase tracking-widest hover:bg-accent/90 transition">
              Start Free <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/prop-firms/how-to-pass" className="inline-flex items-center gap-2 px-5 py-2.5 border border-border-slate/50 text-text-secondary text-[10px] font-mono uppercase tracking-widest hover:border-accent hover:text-text-primary transition">
              Challenge Protocol <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Pain Points → Solutions */}
        <section className="mb-20">
          <h2 className="text-2xl font-sans font-black uppercase text-text-primary mb-8">Common Evaluation Problems — And What to Do About Them</h2>
          <div className="space-y-4">
            {PAIN_POINTS.map((p, i) => (
              <div key={i} className="p-5 border border-border-slate/40 bg-background-surface/30 space-y-3">
                <div className="flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-red-400">{p.problem}</p>
                </div>
                <div className="flex items-start gap-3 pl-7">
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

        {/* What's Included */}
        <section className="mb-20 p-6 border border-border-slate/40 bg-background-surface/30 space-y-5">
          <h2 className="text-xl font-bold uppercase text-text-primary">What Drawdown Includes for Prop Firm Traders</h2>
          <ul className="space-y-3">
            {WHAT_IS_INCLUDED.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-xs text-text-secondary leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link href="/pricing" className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-background-primary text-[10px] font-mono font-black uppercase tracking-widest hover:bg-accent/90 transition">
              View Plans & Pricing <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* Quick links grid */}
        <section className="mb-20">
          <h2 className="text-xl font-bold uppercase text-text-primary mb-6">Prop Firm Tools & Research</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              { label: "Daily Loss Calculator", href: "/calculators/prop-firm-daily-loss" },
              { label: "Maximum Loss Calculator", href: "/calculators/prop-firm-maximum-loss" },
              { label: "Position Size Calculator", href: "/calculators/position-size" },
              { label: "Risk of Ruin Simulator", href: "/calculators/risk-of-ruin" },
              { label: "Compare Prop Firms", href: "/prop-firms/compare" },
              { label: "How to Pass a Prop Firm Challenge", href: "/prop-firms/how-to-pass" },
              { label: "Position Sizing Research", href: "/research/position-sizing" },
              { label: "Risk Management Framework", href: "/risk-management" },
            ].map((t) => (
              <Link key={t.href} href={t.href} className="flex items-center justify-between p-3 border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group rounded-sm">
                <span>{t.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
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
