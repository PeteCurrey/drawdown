import React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ArrowRight,
  Percent,
  Activity,
  TrendingUp,
  LineChart,
  Calculator,
  BookOpen,
  HelpCircle,
  Target,
  Layers,
} from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { getMetadata } from "@/lib/metadata";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = getMetadata({
  title: "Trading Risk Management | Position Sizing, Drawdown & Ruin",
  description:
    "The complete trading risk management framework: position sizing, drawdown control, risk-of-ruin analysis, and prop firm buffer management. Calculators, formulas, and research.",
  path: "/risk-management",
});

const CLUSTER: {
  section: string;
  icon: React.FC<{ className?: string }>;
  intro: string;
  links: { label: string; href: string; desc: string }[];
}[] = [
  {
    section: "Position Sizing",
    icon: Percent,
    intro:
      "Position sizing is the single most controllable variable in your trading system. A strategy with a 40% win rate and correct sizing will outperform a 70% win-rate strategy that sizes recklessly. The goal is to align every trade's cash exposure with a predetermined percentage of your current equity.",
    links: [
      {
        label: "Position Size Calculator",
        href: "/calculators/position-size",
        desc: "Calculate exact lot sizes from balance, risk %, and stop distance.",
      },
      {
        label: "Risk Calculator",
        href: "/calculators/risk",
        desc: "Verify the absolute cash risk on any planned lot size.",
      },
      {
        label: "Pip Value Calculator",
        href: "/calculators/pip-value",
        desc: "Convert pips to cash values across all pairs and account currencies.",
      },
    ],
  },
  {
    section: "Drawdown Control",
    icon: Activity,
    intro:
      "Drawdown is inevitable in any live trading system. The question is not whether you will experience a drawdown, but whether your risk framework is designed to survive it. Drawdown control begins with accurate probability modelling — understanding the likelihood and depth of adverse sequences before they occur.",
    links: [
      {
        label: "Drawdown Calculator",
        href: "/calculators/drawdown",
        desc: "Model consecutive loss probability and capital decay across win-rate regimes.",
      },
      {
        label: "Drawdown Recovery Calculator",
        href: "/calculators/drawdown-recovery",
        desc: "Understand non-linear recovery math — why a 50% loss requires 100% gain.",
      },
      {
        label: "Drawdown Research",
        href: "/research/risk",
        desc: "Quantitative studies on consecutive loss distributions and ruin probabilities.",
      },
    ],
  },
  {
    section: "Risk of Ruin",
    icon: ShieldAlert,
    intro:
      "Risk of ruin is the probability that a strategy will reach a drawdown so severe that recovery becomes mathematically implausible. Even high-edge strategies face meaningful ruin probability when risk per trade exceeds 3–5%. The Ralph Vince and Kelly frameworks both demonstrate that the primary protection against ruin is reducing fraction of capital risked — not improving win rate.",
    links: [
      {
        label: "Risk of Ruin Simulator",
        href: "/calculators/risk-of-ruin",
        desc: "Model ruin probability from win rate, RR ratio, and risk per trade.",
      },
      {
        label: "Compounding Calculator",
        href: "/calculators/compounding",
        desc: "Project long-term equity growth under different reinvestment assumptions.",
      },
    ],
  },
  {
    section: "Prop Firm Risk Management",
    icon: Calculator,
    intro:
      "Funded proprietary trading adds a second layer of risk management: the firm's drawdown rules. Unlike personal accounts where ruin is gradual, a prop account can be terminated instantly for breaching a daily or overall drawdown limit. Successful funded trading requires managing two parallel risk frameworks simultaneously — your own strategy's drawdown tolerance and the firm's rule compliance.",
    links: [
      {
        label: "Prop Firm Daily Loss Calculator",
        href: "/calculators/prop-firm-daily-loss",
        desc: "Calculate your exact daily buffer from midnight baseline equity.",
      },
      {
        label: "Prop Firm Maximum Loss Calculator",
        href: "/calculators/prop-firm-maximum-loss",
        desc: "Compare static vs trailing drawdown floors and remaining buffer.",
      },
      {
        label: "Prop Firm Directory",
        href: "/prop-firms",
        desc: "Compare drawdown rules, profit targets, and fee structures across firms.",
      },
    ],
  },
];

const PRINCIPLES = [
  {
    title: "Risk 0.5%–1.5% per trade",
    body: "Professional institutional standards. At 1% risk per trade, a 10-loss streak costs 9.56% of equity — recoverable. At 5%, the same streak costs 40.1% — psychologically and mathematically devastating.",
  },
  {
    title: "Size from current equity, not starting balance",
    body: "If your account is at $80,000 after a $20,000 drawdown, your 1% risk is $800 — not $1,000. Sizing off the original balance during a drawdown inflates real risk percentage and accelerates the spiral.",
  },
  {
    title: "Calculate pip value before calculating lot size",
    body: "For cross-currency pairs (EUR/GBP, GBP/JPY) and non-USD accounts, pip value is not fixed. Always determine the accurate pip value in your account currency before computing your position size.",
  },
  {
    title: "Aggregate correlated positions",
    body: "Two long positions in EUR/USD and GBP/USD during a USD event effectively double your currency exposure. Treat correlated pairs as a single combined position for risk management purposes.",
  },
  {
    title: "Scale down risk as drawdown deepens",
    body: "When your account falls below 90% of peak equity, reduce position sizes by 25–50%. When below 80%, reduce further or suspend trading. Risk management must adapt to current capital, not target capital.",
  },
  {
    title: "Model worst-case before live deployment",
    body: "Before trading a strategy live, run it through the drawdown calculator and risk-of-ruin simulator with conservative win rate assumptions. If the worst-case ruin probability exceeds 5%, reduce risk per trade before going live.",
  },
];

export default function RiskManagementHubPage() {
  const faqs = [
    {
      question: "What is the most important principle of trading risk management?",
      answer:
        "Position sizing is the most important and most directly controllable risk management variable. Regardless of strategy win rate, consistently risking more than 2–3% of equity per trade will produce eventual account ruin due to the non-linear mathematics of consecutive losses on a compounding equity base.",
    },
    {
      question: "How do I calculate the correct position size for a trade?",
      answer:
        "Position Size (Standard Lots) = (Account Equity × Risk %) / (Stop Loss Pips × Pip Value). First determine your pip value for the specific instrument and account currency. Then apply your maximum risk percentage (recommended: 0.5%–1.5% of current equity) divided by the stop loss distance in pips times the pip value.",
    },
    {
      question: "What is the maximum drawdown I should tolerate before stopping a strategy?",
      answer:
        "Most professional risk frameworks use 20–30% maximum drawdown as the suspension threshold for a strategy. Beyond 25% drawdown, the required recovery gain is 33%, which is highly demanding. Beyond 40%, the required gain of 67% exceeds what most discretionary strategies can produce in a reasonable timeframe.",
    },
    {
      question: "What is the difference between daily drawdown and maximum drawdown in prop firms?",
      answer:
        "Daily drawdown measures how much your equity can decline from midnight's baseline within a single 24-hour session. Maximum drawdown measures the total decline from your account's initial balance (or highest point, for trailing models). Both limits apply simultaneously. Most evaluation breaches occur on the daily limit, not the overall maximum.",
    },
    {
      question: "How does risk of ruin relate to position sizing?",
      answer:
        "Risk of ruin decreases exponentially as the ratio of account capital to risk-per-trade increases. At 1% risk per trade, even a 40% win rate strategy with 1:1.5 risk-to-reward has a near-zero ruin probability over 1,000 trades. At 5% risk per trade, the same strategy faces meaningful ruin probability within 300–400 trades.",
    },
    {
      question: "Should I use fixed lot sizes or fixed fractional sizing?",
      answer:
        "Fixed fractional sizing (risking a constant percentage of current equity) is mathematically superior for capital preservation. Fixed lot sizes mean your risk percentage increases as your account declines — exactly the opposite of rational risk management. During drawdown, fixed lots expose you to progressively larger percentage losses on a shrinking base.",
    },
  ];

  return (
    <div className="min-h-screen pb-24 pt-32 bg-background-primary text-text-primary">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Trading Risk Management",
            "url": "https://drawdown.trading/risk-management",
            "description":
              "The complete trading risk management framework covering position sizing, drawdown control, risk-of-ruin analysis, and prop firm compliance.",
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://drawdown.trading" },
                { "@type": "ListItem", "position": 2, "name": "Risk Management", "item": "https://drawdown.trading/risk-management" },
              ],
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map((f) => ({
              "@type": "Question",
              "name": f.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": f.answer,
              },
            })),
          },
        ]}
      />

      <div className="container mx-auto px-6 max-w-5xl">
        <Breadcrumbs
          items={[
            { label: "Risk Management", href: "/risk-management" },
          ]}
        />

        {/* Hero */}
        <header className="mb-16 max-w-3xl space-y-5">
          <div className="flex items-center gap-3 text-accent">
            <ShieldAlert className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Risk Framework</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-sans font-black uppercase leading-tight">
            Trading Risk <span className="text-accent italic">Management.</span>
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed max-w-2xl">
            Most traders lose not because their strategy has no edge, but because their risk framework allows a single adverse sequence to become unrecoverable. This guide covers the complete architecture of professional trading risk management: correct position sizing, drawdown probability modelling, risk-of-ruin analysis, and prop firm compliance.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/calculators/position-size"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-background-primary text-[10px] font-mono font-black uppercase tracking-widest hover:bg-accent/90 transition"
            >
              Position Size Calculator <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/calculators"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-border-slate/50 text-text-secondary text-[10px] font-mono uppercase tracking-widest hover:border-accent hover:text-text-primary transition"
            >
              All Risk Calculators <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Core Risk Principles */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <Target className="w-5 h-5 text-accent flex-shrink-0" />
            <h2 className="text-2xl font-sans font-black uppercase text-text-primary">
              Six Core Risk Principles
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PRINCIPLES.map((p, i) => (
              <div key={i} className="p-5 border border-border-slate/40 bg-background-surface/30 space-y-2">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center border border-accent/40 text-accent text-[9px] font-mono font-black">
                    {i + 1}
                  </span>
                  <p className="text-xs font-bold text-text-primary uppercase tracking-wide leading-snug">
                    {p.title}
                  </p>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed pl-8">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Topic Cluster Sections */}
        {CLUSTER.map(({ section, icon: Icon, intro, links }) => (
          <section key={section} className="mb-20">
            <div className="flex items-center gap-3 mb-6">
              <Icon className="w-5 h-5 text-accent flex-shrink-0" />
              <h2 className="text-2xl font-sans font-black uppercase text-text-primary">
                {section}
              </h2>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed mb-8 max-w-3xl">{intro}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="p-5 border border-border-slate/40 bg-background-surface/30 hover:border-accent group transition-colors space-y-3"
                >
                  <p className="text-xs font-bold text-text-primary group-hover:text-accent uppercase tracking-wide transition-colors leading-snug">
                    {link.label}
                  </p>
                  <p className="text-xs text-text-secondary leading-relaxed">{link.desc}</p>
                  <div className="flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-widest text-text-tertiary group-hover:text-accent transition-colors pt-1">
                    Open <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {/* The Risk Management Formula Reference */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="w-5 h-5 text-accent flex-shrink-0" />
            <h2 className="text-2xl font-sans font-black uppercase text-text-primary">
              Core Formulas
            </h2>
          </div>
          <div className="space-y-4">
            {[
              {
                name: "Position Size",
                formula: "Lots = (Equity × Risk %) / (Stop Pips × Pip Value)",
                note: "Risk % should be current equity, not starting balance. Pip Value must be in your account currency for the specific pair.",
              },
              {
                name: "Cash Risk",
                formula: "Cash Risk = Position Size (Lots) × Stop Loss (Pips) × Pip Value",
                note: "Use this to verify the actual dollar cost of a planned trade before execution.",
              },
              {
                name: "Drawdown Recovery Gain Required",
                formula: "Recovery % = (Loss Amount / Remaining Equity) × 100",
                note: "A 20% drawdown requires 25% gain. A 40% drawdown requires 66.7% gain. Non-linear and accelerating.",
              },
              {
                name: "Consecutive Loss Probability",
                formula: "Streak Probability = (1 − Win Rate) ^ Streak Length",
                note: "The probability of a specific sequence. Use the drawdown calculator to find the cumulative probability over an entire trade sample.",
              },
              {
                name: "Compounding Equity Growth",
                formula: "Balance = Start × (1 + (Gain % × Reinvestment %)) ^ Periods",
                note: "Assumes consistent periodic gain. One severe adverse period disrupts the entire curve — always model alongside drawdown probability.",
              },
              {
                name: "Prop Firm Daily Breach Floor",
                formula: "Floor = MAX(Balance, Equity at Midnight) × (1 − Daily Limit %)",
                note: "Firms use the higher of balance or equity at midnight as the baseline. Profitable overnight positions raise this floor.",
              },
            ].map((f) => (
              <div key={f.name} className="p-5 border border-border-slate/40 space-y-2">
                <p className="text-[10px] font-mono uppercase tracking-widest text-accent">{f.name}</p>
                <div className="bg-background-primary border border-border-slate/50 px-4 py-3 font-mono text-xs text-text-primary overflow-x-auto">
                  {f.formula}
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">{f.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Risk Management & Platform CTA */}
        <section className="mb-20 p-8 border border-accent/30 bg-accent/5 flex flex-col sm:flex-row sm:items-center gap-8">
          <div className="flex-1 space-y-2">
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-accent">Built into the platform</p>
            <h3 className="text-sm font-bold uppercase tracking-tight text-text-primary">
              Automated Risk Management in the Drawdown Platform
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed max-w-xl">
              The Drawdown platform enforces your risk framework automatically — calculating correct lot sizes before you enter, monitoring live cash risk on all open trades, and alerting you before prop firm daily limits are approached.
            </p>
          </div>
          <Link
            href="/pricing"
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-accent text-background-primary text-[10px] font-mono font-black uppercase tracking-widest hover:bg-accent/90 transition"
          >
            View Plans <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </section>

        {/* FAQs */}
        <section className="mb-16">
          <h2 className="text-2xl font-sans font-black uppercase text-text-primary flex items-center gap-3 mb-8">
            <HelpCircle className="w-6 h-6 text-accent flex-shrink-0" />
            Risk Management FAQs
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

        {/* Bottom related content grid */}
        <section>
          <h2 className="text-xl font-bold uppercase text-text-primary mb-6">Related Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {[
              { label: "Research: Risk & Drawdown Mathematics", href: "/research/risk" },
              { label: "Prop Firm Comparison Directory", href: "/prop-firms" },
              { label: "Calculator Hub — All 9 Tools", href: "/calculators" },
              { label: "Trading Platform", href: "/platform" },
            ].map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="flex items-center justify-between p-3 border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>{r.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
