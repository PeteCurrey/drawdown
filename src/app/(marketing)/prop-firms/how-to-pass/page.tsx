import React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Calculator,
  BookOpen,
  HelpCircle,
  Target,
  Zap,
  Clock,
} from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { getMetadata } from "@/lib/metadata";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = getMetadata({
  title: "How to Pass a Prop Firm Challenge | Rules, Risk & Strategy",
  description:
    "A practical guide to passing prop firm evaluations: correct position sizing, daily loss management, profit target timelines, and the risk framework that separates funded traders from repeat buyers.",
  path: "/prop-firms/how-to-pass",
});

const PHASES = [
  {
    phase: "Phase 1: Understand Both Limits Before You Trade Day 1",
    body: "Every funded evaluation has two simultaneous drawdown limits: a daily loss limit and a maximum overall drawdown. Both apply at the same time. A large Monday morning position that swings to a floating -5% during a volatility event will breach the daily limit even if your overall drawdown is only 3%. Before entering any live trade, know the exact breach floor for each rule in absolute dollar terms — not just percentages.",
    icon: Target,
  },
  {
    phase: "Phase 2: Size Every Position from Your Drawdown Buffer, Not Your Profit Target",
    body: "The instinct is to calculate position size based on how much you need to earn. The correct method is to calculate it based on how much you can afford to lose. If your account is $100,000 with a 5% daily limit, your maximum intraday cash loss is $5,000. At 1% risk per trade, your position risk is $1,000. That means 5 losing trades in a session hit your daily limit exactly. Most traders do not make it to trade 3 because they increase lot sizes after early losses.",
    icon: Calculator,
  },
  {
    phase: "Phase 3: Trade Far Below Target Daily P&L, Not At It",
    body: "The failure mode is treating the profit target as a sprint. A 10% profit target over 30 trading days requires 0.33% net daily. Trading 1% risk per session with a 1:2 RR means you only need a 50% win rate on 5 trades per week. The traders who consistently pass treat each session as capital preservation — stopping after 1–2% daily gain rather than pushing for more.",
    icon: CheckCircle2,
  },
  {
    phase: "Phase 4: Manage Floating Positions Into the Midnight Reset",
    body: "The midnight equity snapshot is the most overlooked technical rule in prop trading. If you hold a trade with $3,000 floating profit into midnight, the firm's system records $103,000 as tomorrow's baseline on a $100,000 account. Tomorrow's 5% daily limit calculates from $103,000 — meaning a $3,150 loss breaches you, rather than $5,000. Floating profits raise your floor, not just your ceiling.",
    icon: Clock,
  },
  {
    phase: "Phase 5: Track Your Buffer Remaining, Not Your Profit Remaining",
    body: "Most traders obsessively check how far they are from their profit target. The professional mindset monitors how much loss buffer remains before each rule is triggered. Buffer remaining on daily limit. Buffer remaining on overall limit. These numbers dictate whether you can continue trading today, not how many pips you've made.",
    icon: ShieldAlert,
  },
];

const COMMON_FAILURES = [
  {
    failure: "Increasing lot size after an early loss",
    why: "Doubles your daily drawdown velocity. After a -1% loss, many traders double their next position to recover. If that also loses, they've consumed 3% of their daily allowance in two trades.",
  },
  {
    failure: "Trading news events without checking firm rules",
    why: "Many firms restrict news trading, define it as within 2–5 minutes of a high-impact release, or exclude certain pairs (GBP pairs during UK CPI). Check the firm's exact policy before each release.",
  },
  {
    failure: "Holding trades over the weekend without overnight swap audit",
    why: "Swap charges post at rollover, reducing equity overnight. On a large position, a negative swap rate can reduce your overnight equity by enough to tighten the following day's daily limit calculation significantly.",
  },
  {
    failure: "Not closing profitable trades before approaching target profit",
    why: "Some firms (notably The5%ers) do not allow you to exceed the profit target within a day — exceeding it intraday before the phase closes counts as a breach on certain account types. Check whether profits are measured on equity or balance and whether intraday equity spikes matter.",
  },
  {
    failure: "Treating the evaluation as a different environment from live trading",
    why: "Traders often take risks in challenges they would never accept on personal accounts. The evaluation is not a simulation — it is a filter. The firms that scale capital most aggressively are the ones that filter out traders who cannot maintain consistent risk management, not traders who cannot achieve high returns.",
  },
];

export default function HowToPassPropFirmPage() {
  const faqs = [
    {
      question: "How long does it typically take to pass a prop firm challenge?",
      answer:
        "At the institutional standard of 0.5%–1% net daily return, reaching a 10% profit target takes 10–20 trading days depending on win rate and RR. Most evaluations have no minimum time limit (FTMO, The5%ers, FundingPips), so passing in fewer days is possible — but attempting to rush completion dramatically increases daily drawdown breach probability.",
    },
    {
      question: "What is the best risk per trade for a prop firm evaluation?",
      answer:
        "0.5%–1.0% per trade is the range used by consistently-funded traders. At 1% per trade, a 5% daily limit allows 5 full-risk losing trades before breach. At 2% per trade, only 2.5 losing trades are permitted. The lower your risk per trade, the more decision space you have during adverse sessions.",
    },
    {
      question: "Does the profit target include unrealized open profits?",
      answer:
        "It depends on the firm. FTMO and most CFD prop firms calculate the profit target on account balance (closed profits only). Some firms use equity (including open P&L). Always verify with the specific firm's terms before assuming a floating profit counts toward the target.",
    },
    {
      question: "Can I trade multiple accounts simultaneously to increase pass rate?",
      answer:
        "Many firms explicitly permit multi-account trading but impose copy-trading restrictions that prohibit simultaneous identical trades across multiple accounts to prevent risk manipulation. Always verify the firm's specific stance on correlated multi-account trading before attempting it.",
    },
    {
      question: "What is the most common reason traders fail evaluations?",
      answer:
        "Daily loss limit violations — not overall drawdown. The daily limit is triggered by floating equity, not closed balance, and resets from the midnight equity snapshot which many traders fail to monitor. A single volatile news session with an oversized position is the most common mechanism for instant evaluation termination.",
    },
    {
      question: "Should I aim to hit the profit target as quickly as possible?",
      answer:
        "No. Rushing to hit the target in 5 days forces higher daily return targets (2% per day), which requires higher risk per trade or more trades — both of which increase daily limit breach probability. A consistent 0.5% daily approach over 20 days is mathematically lower-risk than 2% daily over 5 days, even at identical expected returns.",
    },
  ];

  return (
    <div className="min-h-screen pb-24 pt-32 bg-background-primary text-text-primary">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Pass a Prop Firm Challenge",
            "url": "https://drawdown.trading/prop-firms/how-to-pass",
            "description":
              "A practical guide to passing prop firm evaluations using correct risk management and position sizing.",
            "step": PHASES.map((p, i) => ({
              "@type": "HowToStep",
              "position": i + 1,
              "name": p.phase,
              "text": p.body,
            })),
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
            { label: "Prop Firms", href: "/prop-firms" },
            { label: "How to Pass a Challenge", href: "/prop-firms/how-to-pass" },
          ]}
        />

        {/* Hero */}
        <header className="mb-16 max-w-3xl space-y-5">
          <div className="flex items-center gap-3 text-accent">
            <ShieldAlert className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Prop Trading</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-sans font-black uppercase leading-tight">
            How to Pass a Prop Firm <span className="text-accent italic">Challenge.</span>
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed max-w-2xl">
            The majority of evaluation failures come from the same three mistakes: misunderstanding the midnight equity reset, oversizing after an early loss, and treating the profit target as the primary objective rather than the drawdown limit. This guide covers the risk framework that separates consistently-funded traders from repeat challenge buyers.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/calculators/prop-firm-daily-loss"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-background-primary text-[10px] font-mono font-black uppercase tracking-widest hover:bg-accent/90 transition"
            >
              Daily Loss Calculator <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/prop-firms"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-border-slate/50 text-text-secondary text-[10px] font-mono uppercase tracking-widest hover:border-accent hover:text-text-primary transition"
            >
              Compare Prop Firms <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-20">
          {[
            { stat: ">80%", label: "Evaluations fail on daily loss, not overall drawdown" },
            { stat: "0.5–1%", label: "Risk per trade used by consistently-funded traders" },
            { stat: "20 days", label: "Optimal timeline for 10% target at 0.5% net daily" },
            { stat: "5%", label: "Typical daily loss limit that most traders underestimate" },
          ].map((s) => (
            <div key={s.label} className="p-4 border border-border-slate/40 bg-background-surface/30 space-y-1 text-center">
              <p className="text-2xl font-black text-accent font-mono">{s.stat}</p>
              <p className="text-[10px] text-text-secondary leading-tight">{s.label}</p>
            </div>
          ))}
        </div>

        {/* 5-Phase Protocol */}
        <section className="mb-20">
          <h2 className="text-2xl font-sans font-black uppercase text-text-primary flex items-center gap-3 mb-10">
            <Target className="w-5 h-5 text-accent flex-shrink-0" />
            The 5-Phase Challenge Protocol
          </h2>
          <div className="space-y-6">
            {PHASES.map(({ phase, body, icon: Icon }, i) => (
              <div key={i} className="flex gap-5 p-6 border border-border-slate/40 bg-background-surface/30">
                <div className="flex-shrink-0 w-8 h-8 border border-accent/40 flex items-center justify-center text-accent text-[10px] font-mono font-black">
                  {i + 1}
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-text-primary">{phase}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tool CTAs */}
        <section className="mb-20">
          <h2 className="text-2xl font-sans font-black uppercase text-text-primary mb-8">
            Calculators for Every Phase
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                label: "Prop Firm Daily Loss Calculator",
                desc: "Know your exact breach floor before you place your first trade each day.",
                href: "/calculators/prop-firm-daily-loss",
              },
              {
                label: "Prop Firm Maximum Loss Calculator",
                desc: "Compare your remaining buffer under static and trailing rule sets.",
                href: "/calculators/prop-firm-maximum-loss",
              },
              {
                label: "Position Size Calculator",
                desc: "Correct lot size from balance, risk %, and stop loss pips. Every trade.",
                href: "/calculators/position-size",
              },
              {
                label: "Risk of Ruin Simulator",
                desc: "Model whether your strategy profile can statistically reach the profit target before triggering the overall drawdown limit.",
                href: "/calculators/risk-of-ruin",
              },
            ].map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="p-5 border border-border-slate/40 bg-background-surface/30 hover:border-accent group transition-colors space-y-2"
              >
                <p className="text-xs font-bold text-text-primary group-hover:text-accent uppercase tracking-wide transition-colors">
                  {t.label}
                </p>
                <p className="text-xs text-text-secondary leading-relaxed">{t.desc}</p>
                <div className="flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-widest text-text-tertiary group-hover:text-accent transition-colors pt-1">
                  Open <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Common Failures */}
        <section className="mb-20">
          <h2 className="text-2xl font-sans font-black uppercase text-text-primary flex items-center gap-3 mb-8">
            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            Five Failure Modes (And Why They Happen)
          </h2>
          <div className="space-y-4">
            {COMMON_FAILURES.map((f, i) => (
              <div key={i} className="p-5 border border-red-400/20 bg-red-400/5 space-y-2">
                <p className="text-xs font-bold text-red-400 uppercase tracking-wide">{f.failure}</p>
                <p className="text-xs text-text-secondary leading-relaxed">{f.why}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Platform CTA */}
        <section className="mb-20 p-8 border border-accent/30 bg-accent/5 flex flex-col sm:flex-row sm:items-center gap-8">
          <div className="flex-1 space-y-2">
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-accent">Built for funded traders</p>
            <h3 className="text-sm font-bold uppercase tracking-tight text-text-primary">
              Monitor Both Drawdown Limits in Real Time
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed max-w-xl">
              The Drawdown platform connects to your broker and displays your live daily loss buffer and overall drawdown buffer side by side. Set threshold alerts before you approach breach levels — not after.
            </p>
          </div>
          <Link
            href="/pricing"
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-accent text-background-primary text-[10px] font-mono font-black uppercase tracking-widest hover:bg-accent/90 transition"
          >
            View Plans <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </section>

        {/* Prop Firm Directory Links */}
        <section className="mb-20">
          <h2 className="text-xl font-bold uppercase text-text-primary mb-6">Individual Firm Challenge Guides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              { name: "FTMO", slug: "ftmo" },
              { name: "The5%ers", slug: "the5ers" },
              { name: "FundedNext", slug: "fundednext" },
              { name: "Funding Pips", slug: "funding-pips" },
              { name: "FXIFY", slug: "fxify" },
              { name: "E8 Funding", slug: "e8-funding" },
            ].map((firm) => (
              <Link
                key={firm.slug}
                href={`/prop-firms/${firm.slug}`}
                className="flex items-center justify-between p-3 border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>{firm.name} — Rules, Fees & Drawdown Analysis</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="mb-8">
          <h2 className="text-2xl font-sans font-black uppercase text-text-primary flex items-center gap-3 mb-8">
            <HelpCircle className="w-6 h-6 text-accent flex-shrink-0" />
            Frequently Asked Questions
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

        {/* Risk Management Hub Link */}
        <div className="flex items-center justify-between p-4 border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group text-xs">
          <span>Complete Risk Management Framework</span>
          <Link href="/risk-management" className="flex items-center gap-1 text-accent group-hover:underline">
            /risk-management <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
