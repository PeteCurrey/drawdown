import { Metadata } from "next";
import { Suspense } from "react";
import { CurrencyStrengthMeter } from "@/components/markets/CurrencyStrengthMeter";
import JsonLd from "@/components/seo/JsonLd";
import { ScreenerRow } from "@/lib/screener";
import Link from "next/link";
import { ChevronRight, BarChart2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Currency Strength Meter — Live FX Relative Strength Ranking | Drawdown",
  description:
    "Live relative strength ranking across 8 major currencies (USD, EUR, GBP, JPY, CHF, CAD, AUD, NZD). Derived from real-time 24h % change across all tracked FX pairs. Free, no sign-up required.",
  alternates: { canonical: "https://drawdown.trading/tools/currency-strength-meter" },
  openGraph: {
    title: "Currency Strength Meter — Drawdown Trading",
    description:
      "See which of the 8 FX majors is strongest and weakest right now, ranked by average 24h momentum across all tracked pairs.",
    url: "https://drawdown.trading/tools/currency-strength-meter",
    type: "website",
  },
};

// Revalidate matches the screener cache interval
export const revalidate = 60;

async function getInitialScreenerData(): Promise<ScreenerRow[]> {
  try {
    const res = await fetch("https://drawdown.trading/api/market/screener", {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch {
    // Non-fatal — client will hydrate on first poll
  }
  return [];
}

export default async function CurrencyStrengthMeterPage() {
  const initialData = await getInitialScreenerData();

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Drawdown Currency Strength Meter",
    url: "https://drawdown.trading/tools/currency-strength-meter",
    description:
      "Real-time relative strength ranking of 8 major currencies derived from 24h percentage change across tracked FX pairs.",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "GBP",
    },
  };

  return (
    <>
      <JsonLd data={jsonLdData} />

      <div className="min-h-screen bg-background-primary text-text-primary selection:bg-accent selection:text-black">
        {/* ── Page header ──────────────────────────────────────────────────── */}
        <section className="border-b border-border-slate/50 bg-white/40">
          <div className="max-w-5xl mx-auto px-6 py-8 md:py-12 space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-text-tertiary">
              <Link href="/tools" className="hover:text-accent transition-colors">
                Tools
              </Link>
              <ChevronRight className="w-3 h-3 text-text-tertiary/60" />
              <span className="text-accent font-bold">Currency Strength Meter</span>
            </div>

            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 text-accent text-xs font-mono font-bold uppercase tracking-widest">
                <BarChart2 className="w-3.5 h-3.5" />
                Live · FX Intelligence
              </div>
              <h1 className="text-3xl md:text-5xl font-sans font-extrabold uppercase tracking-tight text-text-primary">
                Currency{" "}
                <span className="text-accent">Strength.</span>
              </h1>
              <p className="text-sm md:text-base font-medium text-text-secondary leading-relaxed">
                Ranked relative strength for all 8 FX majors — derived from 24h momentum
                across every tracked pair. No fabricated units. Updates every 15 seconds
                from the same live screener feed.
              </p>
            </div>

            {/* Methodology strip */}
            <div className="bg-white border border-border-slate px-4 py-2.5 flex flex-wrap items-center gap-4 text-[10px] font-mono shadow-2xs">
              <span className="text-text-secondary">
                <strong className="text-text-primary">Formula:</strong> avg(signed 24h % change per pair)
              </span>
              <span className="text-border-slate">|</span>
              <span className="text-text-secondary">
                <strong className="text-text-primary">14 pairs</strong> across 8 currencies
              </span>
              <span className="text-border-slate">|</span>
              <span className="text-text-secondary">
                <strong className="text-text-primary">0</strong> new API calls — uses shared screener cache
              </span>
              <span className="text-border-slate hidden sm:inline">|</span>
              <span className="text-text-secondary hidden sm:inline">
                60s edge cache · 15s client poll
              </span>
            </div>
          </div>
        </section>

        {/* ── Main meter ───────────────────────────────────────────────────── */}
        <main className="max-w-5xl mx-auto px-6 py-8">
          <Suspense
            fallback={
              <div className="w-full bg-white border border-mkt-bd shadow-sm p-8 text-center font-mono text-xs text-mkt-i4">
                Loading strength data…
              </div>
            }
          >
            <CurrencyStrengthMeter initialData={initialData} />
          </Suspense>

          {/* Methodology explainer */}
          <div className="mt-8 border border-border-slate bg-white p-6 space-y-4 text-sm text-text-secondary leading-relaxed">
            <h2 className="text-base font-mono font-extrabold uppercase tracking-tight text-text-primary">
              How the Score Is Calculated
            </h2>
            <p>
              Each currency's <strong>Relative Strength Score</strong> is the simple
              unweighted average of its signed 24h percentage change contribution across
              all tracked FX pairs in the Drawdown screener.
            </p>
            <p>
              When a currency is the <strong>base</strong> (left side of the pair, e.g. GBP
              in GBP/USD), a positive daily move strengthens it, so the full{" "}
              <code className="text-[11px] bg-slate-100 px-1 py-0.5 rounded font-mono">
                +changePct
              </code>{" "}
              is credited. When a currency is the <strong>quote</strong> (right side, e.g.
              USD in GBP/USD), a rising pair means the quote is weakening, so the score
              contribution is{" "}
              <code className="text-[11px] bg-slate-100 px-1 py-0.5 rounded font-mono">
                −changePct
              </code>
              .
            </p>
            <p>
              This is a <strong>relative momentum indicator</strong> only. It does not
              represent an absolute currency value, an exchange rate, or any fabricated
              index. Currencies with fewer tracked pairs (e.g. AUD at 2 pairs, NZD at 1
              pair) have wider confidence intervals — pair counts are displayed on every
              bar for full transparency.
            </p>
            <p className="text-[11px] font-mono text-text-tertiary border-t border-border-slate pt-3 mt-3">
              v2 note: expanding to ~28 pairs (7 per currency) would require new Twelve
              Data symbols. Deferred pending SC9 credit-budget review.
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
