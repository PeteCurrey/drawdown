import React from "react";
import Link from "next/link";
import { DollarSign, ArrowRight, Percent, ShieldAlert, BookOpen, HelpCircle, Users, Table2 } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LeadMagnet } from "@/components/seo/LeadMagnet";
import { PipValueCalculator } from "@/components/calculators/PipValueCalculator";
import { CalculatorNextStep } from "@/components/calculators/CalculatorNextStep";
import { getMetadata } from "@/lib/metadata";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = getMetadata({
  title: "Pip Value Calculator | Forex, Metals & Indices",
  description:
    "Convert pips to absolute cash values in your local currency across forex pairs, metals, and index contracts for precise position sizing.",
  path: "/calculators/pip-value",
});

export default function PipValueCalculatorPage() {
  const faqs = [
    {
      question: "What is a pip in forex trading?",
      answer:
        "A pip (percentage in point) is the standard unit of measurement representing the smallest price change in an exchange rate. For most currency pairs, a pip is 0.0001 (the fourth decimal place). For Japanese Yen pairs, one pip is 0.01 (the second decimal place).",
    },
    {
      question: "How is pip value calculated for EUR/USD?",
      answer:
        "On a standard contract (100,000 units) of EUR/USD, one pip equals 0.0001 × 100,000 = $10.00 USD. If your account currency is GBP or EUR, that $10 USD is converted into your base currency using the current spot exchange rate.",
    },
    {
      question: "What is the difference between a pip and a pipette?",
      answer:
        "A pipette is a fractional pip equal to one-tenth (0.1) of a pip. Modern brokers display prices with 5 decimal places (e.g. 1.08543), where the last digit is the pipette.",
    },
    {
      question: "Why do gold and commodities have different pip values?",
      answer:
        "Gold (XAU/USD) is priced in troy ounces and one standard lot represents 100 oz. One pip on gold is $0.01 movement × 100 oz = $1.00 per pip per standard lot. Index contracts have their own point values defined by the exchange or broker's contract specification.",
    },
    {
      question: "Does pip value change throughout the trading day?",
      answer:
        "For cross currency pairs and assets priced in a currency other than your account currency, pip value fluctuates as exchange rates move. EUR/USD pip value stays fixed at $10 per standard lot for a USD account because both currencies are involved. But USD/JPY pip value changes in real-time as the JPY/USD rate shifts.",
    },
  ];

  return (
    <div className="min-h-screen pb-24 pt-32 bg-background-primary text-text-primary">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Pip Value Calculator",
            "url": "https://drawdown.trading/calculators/pip-value",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "All",
            "description":
              "Calculate the monetary value of a pip in your base currency across forex, gold, and index contracts.",
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
            { label: "Pip Value", href: "/calculators/pip-value" },
          ]}
        />

        {/* Hero */}
        <header className="mb-12 max-w-3xl space-y-4">
          <div className="flex items-center gap-3 text-accent">
            <DollarSign className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Execution Specs</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-sans font-black uppercase leading-tight">
            Pip Value <span className="text-accent italic">Calculator.</span>
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            Convert pips to absolute cash values in your local currency across forex pairs, metals, and index contracts. Input your lot size to know your exact monetary price sensitivity.
          </p>
        </header>

        {/* Interactive Calculator Section */}
        <PipValueCalculator />

        {/* SEO Explanatory Content */}
        <article className="prose prose-invert max-w-none text-text-secondary leading-relaxed mb-16 space-y-8 border-t border-border-slate/50/30 pt-16">

          {/* Who this is for */}
          <div className="space-y-4">
            <h2 className="text-3xl font-sans font-black uppercase text-text-primary flex items-center gap-3">
              <Users className="w-6 h-6 text-accent flex-shrink-0" />
              Who This Calculator Is For
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  title: "Cross-Currency Pair Traders",
                  body: "Trading EUR/GBP, GBP/JPY, or other non-USD pairs on a USD or GBP account. The pip value in your account currency is not fixed and must be calculated before setting your lot size.",
                },
                {
                  title: "Multi-Asset Traders",
                  body: "Trading gold (XAU/USD), silver, crude oil, or stock indices alongside forex. Each asset class has a different contract specification and pip/point value that must be known for accurate risk calculations.",
                },
                {
                  title: "Position Size Calculator Users",
                  body: "The pip value output from this tool is the direct input into the Position Size Calculator. Calculate pip value first, then pass the result to the sizing calculator for precise lot sizing.",
                },
              ].map((persona) => (
                <div key={persona.title} className="p-4 border border-border-slate/40 bg-background-surface/30 space-y-2">
                  <p className="text-xs font-bold text-text-primary uppercase tracking-wide">{persona.title}</p>
                  <p className="text-xs text-text-secondary leading-relaxed">{persona.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Formula */}
          <div className="space-y-3">
            <h2 className="text-3xl font-sans font-black uppercase text-text-primary">
              Understanding Pip Valuation & Contract Sizing
            </h2>
            <p>
              Pip value is the monetary gain or loss generated when an asset moves by one single pip. Because position sizing depends directly on stop loss distance in pips, understanding the exact cash value of each pip is crucial for calculating genuine market exposure.
            </p>
            <h3 className="text-xl font-bold uppercase text-text-primary">The Core Pip Value Formula</h3>
            <p>
              When the quote currency matches your account currency (e.g. trading EUR/USD with a USD account):
            </p>
            <div className="bg-background-primary p-6 border border-border-slate/50 font-mono text-xs overflow-x-auto text-text-primary">
              Pip Value = One Pip Decimal (0.0001) × Contract Size (100,000 for Standard Lot) = $10.00 per Lot
            </div>

            <p>
              When trading cross currency pairs (e.g. USD/JPY on a USD account):
            </p>
            <div className="bg-background-primary p-6 border border-border-slate/50 font-mono text-xs overflow-x-auto text-text-primary">
              Pip Value = (One Pip Decimal / Exchange Rate) × Contract Size
            </div>
          </div>

          {/* Variable Definitions */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold uppercase text-text-primary flex items-center gap-2">
              <Table2 className="w-4 h-4 text-accent" />
              Input Variable Definitions
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-border-slate/50">
                <thead className="bg-background-surface/60 font-mono text-text-tertiary uppercase">
                  <tr>
                    <th className="p-3 border-b border-border-slate/50">Variable</th>
                    <th className="p-3 border-b border-border-slate/50">Units</th>
                    <th className="p-3 border-b border-border-slate/50">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-slate/30">
                  <tr>
                    <td className="p-3 font-semibold text-text-primary">Currency Pair / Instrument</td>
                    <td className="p-3 font-mono">Ticker (e.g. EUR/USD)</td>
                    <td className="p-3">Determines the pip decimal (0.0001 or 0.01 for JPY pairs) and which currencies are involved in the conversion to your account currency.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-text-primary">Lot Size</td>
                    <td className="p-3 font-mono">Standard Lots</td>
                    <td className="p-3">Position size in standard lots. 1.00 = 100,000 units; 0.10 = 10,000 (mini); 0.01 = 1,000 (micro).</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-text-primary">Account Currency</td>
                    <td className="p-3 font-mono">ISO code (USD, GBP…)</td>
                    <td className="p-3">The currency of your brokerage account. Pip value will be expressed in this currency. Required for cross-currency pair calculations.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-text-primary">Current Exchange Rate</td>
                    <td className="p-3 font-mono">Decimal price</td>
                    <td className="p-3">Only needed when the quote currency differs from your account currency. This rate converts the pip value into your account currency and changes as markets move.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Lot size matrix */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold uppercase text-text-primary">Standard Lot Sizing Matrix</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-border-slate/50">
                <thead className="bg-background-surface/60 font-mono text-text-tertiary uppercase">
                  <tr>
                    <th className="p-3 border-b border-border-slate/50">Lot Type</th>
                    <th className="p-3 border-b border-border-slate/50">Volume (Lots)</th>
                    <th className="p-3 border-b border-border-slate/50">Units</th>
                    <th className="p-3 border-b border-border-slate/50">EUR/USD Pip Value (USD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-slate/30">
                  <tr>
                    <td className="p-3 font-semibold text-text-primary">Standard Lot</td>
                    <td className="p-3 font-mono">1.00</td>
                    <td className="p-3 font-mono">100,000</td>
                    <td className="p-3 font-mono text-accent">$10.00</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-text-primary">Mini Lot</td>
                    <td className="p-3 font-mono">0.10</td>
                    <td className="p-3 font-mono">10,000</td>
                    <td className="p-3 font-mono text-accent">$1.00</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-text-primary">Micro Lot</td>
                    <td className="p-3 font-mono">0.01</td>
                    <td className="p-3 font-mono">1,000</td>
                    <td className="p-3 font-mono text-accent">$0.10</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Worked Example */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold uppercase text-text-primary">Worked Example: GBP/USD on a GBP Account</h3>
            <p>
              You trade <strong>0.50 lots of GBP/USD</strong> from a <strong>GBP-denominated account</strong>. Current GBP/USD rate: <strong>1.2700</strong>.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Pip decimal:</strong> 0.0001 (standard 4-decimal pair).</li>
              <li><strong>Pip value in USD:</strong> 0.0001 × 100,000 × 0.50 lots = $5.00 USD per pip.</li>
              <li><strong>Convert to GBP:</strong> $5.00 / 1.2700 = <strong>£3.94 per pip</strong>.</li>
              <li><strong>Implication:</strong> A 30-pip stop loss on this trade risks £3.94 × 30 = <strong>£118.11</strong>. On a £10,000 account, that is <strong>1.18% account risk</strong> — within the institutional 1–1.5% guideline.</li>
            </ul>
          </div>

          {/* Common Pitfalls */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold uppercase text-text-primary">Common Pip Value Pitfalls</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Applying $10 pip value to all pairs regardless of account currency:</strong> EUR/USD is $10 per lot only on a USD account. On a GBP account at 1.27, it is approximately £7.87 per lot — a meaningful difference when sizing to a precise risk level.</li>
              <li><strong>Forgetting JPY pairs use 0.01 as one pip:</strong> USD/JPY at a rate of 150.00 has a pip value of approximately $6.67 per standard lot — not $10. Using $10 will cause you to undersize, but more commonly traders assume the same pip value and oversize JPY trades by 30–50%.</li>
              <li><strong>Using a stale exchange rate for cross-pair conversions:</strong> If GBP/USD moves from 1.27 to 1.30 during a trading session, your pip value in GBP changes by over 2%. Recalculate for each trade entry rather than using yesterday's rate.</li>
              <li><strong>Not verifying broker contract specifications:</strong> Some brokers offer non-standard contract sizes (e.g. 10,000 unit "mini" standard lots rather than 100,000). Always verify the broker's actual contract size before applying standard pip value formulas.</li>
            </ul>
          </div>

          {/* Conversion Module */}
          <CalculatorNextStep
            heading="Feed This Pip Value Into the Position Size Calculator"
            body="Copy the pip value output from this calculator directly into the Position Size Calculator to get your precise lot size for any trade — ensuring your actual cash risk matches your intended percentage on every single entry."
            cta="Calculate Position Size"
            href="/calculators/position-size"
          />

          {/* Contextual Internal Links Network */}
          <div className="mt-8 p-6 rounded-xl bg-background-surface/50 border border-border-slate/50 space-y-4">
            <h4 className="text-sm font-bold uppercase text-text-primary tracking-wider">
              Connected Risk & Execution Tools
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
                href="/calculators/risk"
                className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>Risk Calculator (Total Cash Exposure)</span>
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
                href="/research/trading-costs"
                className="flex items-center justify-between p-3 rounded-lg bg-background-primary border border-border-slate/40 hover:border-accent text-text-secondary hover:text-text-primary transition group"
              >
                <span>Empirical Broker Trading Cost Audit</span>
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
