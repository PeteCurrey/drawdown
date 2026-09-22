import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowRight, Percent, Activity, BookOpen, HelpCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LeadMagnet } from "@/components/seo/LeadMagnet";
import { RiskCalculator } from "@/components/tools/RiskCalculator";
import { getMetadata } from "@/lib/metadata";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = getMetadata({
  title: "Trading Risk Calculator | Capital Exposure & Sizing Check",
  description:
    "Verify how much absolute capital is at risk on your trade and check your account survival metrics before executing in live markets.",
  path: "/calculators/risk",
});

export default function RiskCalculatorPage() {
  const faqs = [
    {
      question: "What is trade cash risk versus account risk?",
      answer:
        "Trade cash risk is the exact monetary amount you stand to lose if your stop loss is hit (e.g. $250). Account risk is that monetary loss expressed as a percentage of your total liquid equity (e.g. $250 / $25,000 = 1.0% account risk).",
    },
    {
      question: "How do I calculate risk per trade manually?",
      answer:
        "Multiply your lot size by the distance from entry to stop loss (in pips or points) and the pip value for the specific asset. Cash Risk = Position Size (Lots) × Stop Loss Distance × Pip Value.",
    },
    {
      question: "What is the 1% risk rule in trading?",
      answer:
        "The 1% rule states that an investor or trader should never risk more than 1% of total account capital on any single trade setup. Adhering to this rule mathematically prevents catastrophic drawdowns during adverse losing sequences.",
    },
  ];

  return (
    <div className="min-h-screen pb-24 pt-32 bg-background-primary text-text-primary">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Trading Risk Calculator",
            "url": "https://drawdown.trading/calculators/risk",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "All",
            "description":
              "Verify how much absolute capital is at risk on your trade and check your account survival metrics before executing.",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
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
            { label: "Calculators", href: "/calculators" },
            { label: "Risk Modeler", href: "/calculators/risk" },
          ]}
        />

        {/* Hero */}
        <header className="mb-12 max-w-3xl space-y-4">
          <div className="flex items-center gap-3 text-accent">
            <ShieldAlert className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Risk Modeler</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-sans font-black uppercase leading-tight">
            Risk <span className="text-accent italic">Calculator.</span>
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            Verify how much absolute capital is at risk on your trade and check your account survival metrics instantly. Prevent unforced errors before sending orders to your broker.
          </p>
        </header>

        {/* Interactive Calculator Section */}
        <div className="mb-20">
          <RiskCalculator />
        </div>

        {/* SEO Explanatory Content */}
        <article className="prose prose-invert max-w-none text-text-secondary leading-relaxed mb-16 space-y-8 border-t border-border-slate/50/30 pt-16">
          <h2 className="text-3xl font-sans font-black uppercase text-text-primary">
            Understanding Risk Exposure in Live Markets
          </h2>
          <p>
            While position sizing tells you how much volume to trade, the risk calculator displays the absolute capital cost of an idea being invalidated. By knowing your precise dollar downside before clicking execute, you prevent emotional decision-making when the market moves against your position.
          </p>

          <h3 className="text-xl font-bold uppercase text-text-primary">How to Check Capital Risk</h3>
          <p>
            The risk calculator multiplies your trade volume (lots) by the distance to your stop loss and the currency value of each pip:
          </p>
          <div className="bg-background-primary p-6 border border-border-slate/50 font-mono text-xs overflow-x-auto text-text-primary">
            Cash Risk = Position Size (Lots) × Stop Loss (Pips) × Pip Value
          </div>

          <h3 className="text-xl font-bold uppercase text-text-primary">Why Institutional Desks Enforce Strict Percentage Limits</h3>
          <p>
            Professional trading firms rarely permit traders to risk more than 0.5% to 1.5% of total capital on a discretionary trade. Sizing at 1% ensures that even a severe 10-trade losing sequence only depletes ~9.56% of account equity—a drawdown that can be recovered with a +10.57% rebound. Risking 5% or 10% per trade turns a standard losing streak into irreversible capital destruction.
          </p>

          {/* Contextual Internal Links Network */}
          <div className="mt-8 p-6 rounded-xl bg-background-surface/50 border border-border-slate/50 space-y-4">
            <h4 className="text-sm font-bold uppercase text-text-primary tracking-wider">
              Connected Risk Architecture
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <Link
                href="/calculators/position-size"
                className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>Position Size Calculator (Lot Sizing)</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/calculators/pip-value"
                className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>Pip Value Calculator</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/calculators/drawdown"
                className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>Drawdown Probability Calculator</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/research/risk"
                className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>Drawdown Research & Risk Papers</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div className="mt-12 space-y-6">
            <h3 className="text-xl font-bold uppercase text-text-primary flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-accent" />
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="p-5 rounded-lg bg-background-surface/30 border border-border-slate/40 space-y-2">
                  <h4 className="text-sm font-bold text-text-primary">{faq.question}</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </article>

        {/* Lead Magnet */}
        <LeadMagnet
          resourceId="risk-guide"
          title="Download the Complete Risk Management Guide PDF"
          description="Protect your capital from market swings. This manual covers advanced leverage management, position sizing sheets, and prop challenge protocols."
        />
      </div>
    </div>
  );
}
