import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Layers } from "lucide-react";
import { StockSectorMap } from "@/components/market/StockSectorMap";
import { STOCK_DATA_V1, buildTreemapData, DATA_LAST_UPDATED } from "@/lib/data/stock-sectors";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "US Equities Sector Map — GICS Reference Heatmap | Drawdown Trading",
  description:
    "Interactive S&P 500 sector map showing GICS sector and industry distribution with approximate market-cap tile sizing across 55 top US large-cap equities. Reference data, not live prices.",
  alternates: { canonical: "https://drawdown.trading/markets/sector-map" },
  openGraph: {
    title: "US Equities Sector Map | Drawdown Trading",
    description:
      "Visualise GICS sector allocation and approximate market-cap weighting for 55 S&P 500 large caps. Reference data — not live market prices.",
    url: "https://drawdown.trading/markets/sector-map",
    type: "website",
  },
};

export default function StockSectorMapPage() {
  const treemapData = buildTreemapData(STOCK_DATA_V1);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Drawdown US Equities Sector Map",
    url: "https://drawdown.trading/markets/sector-map",
    description:
      "GICS sector heatmap for US large-cap equities. Tile sizing reflects approximate market capitalisation. Performance figures are illustrative reference data, not live market prices.",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      <div className="min-h-screen bg-background-primary text-text-primary selection:bg-accent selection:text-black">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <section className="border-b border-border-slate/50 bg-white/40">
          <div className="max-w-7xl mx-auto px-6 py-8 md:py-12 space-y-5">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-text-tertiary">
              <Link href="/markets" className="hover:text-accent transition-colors">
                Markets
              </Link>
              <ChevronRight className="w-3 h-3 text-text-tertiary/60" />
              <span className="text-accent font-bold">Sector Map</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 text-accent text-xs font-mono font-bold uppercase tracking-widest">
                  <Layers className="w-3.5 h-3.5" />
                  GICS Sector Reference
                </div>
                <h1 className="text-3xl md:text-5xl font-sans font-extrabold uppercase tracking-tight text-text-primary">
                  US Equities{" "}
                  <span className="text-accent">Sector Map.</span>
                </h1>
                <p className="text-sm md:text-base font-medium text-text-secondary leading-relaxed">
                  GICS sector and industry classification for 55 S&amp;P 500 large caps.
                  Tile area proportional to approximate market capitalisation (~{DATA_LAST_UPDATED}).
                  Performance figures are illustrative reference values — not live or historical data.
                </p>
              </div>
            </div>

            {/* Info strip */}
            <div className="bg-white border border-border-slate px-4 py-2.5 flex flex-wrap items-center gap-4 text-[10px] font-mono shadow-2xs">
              <span className="text-text-secondary">
                <strong className="text-text-primary">55 symbols</strong> · 10 GICS sectors
              </span>
              <span className="text-border-slate">|</span>
              <span className="text-text-secondary">
                Market-cap sizing: <strong className="text-text-primary">reference data</strong> (~{DATA_LAST_UPDATED})
              </span>
              <span className="text-border-slate">|</span>
              <span className="text-amber-700 font-bold">
                ⚠ Performance figures are illustrative only — not live prices
              </span>
            </div>
          </div>
        </section>

        {/* ── Map ────────────────────────────────────────────────────── */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          <StockSectorMap initialData={treemapData} rawStocks={STOCK_DATA_V1} />

          {/* Methodology note */}
          <div className="mt-8 border border-border-slate bg-white p-6 space-y-3 text-sm text-text-secondary leading-relaxed">
            <h2 className="text-base font-mono font-extrabold uppercase tracking-tight text-text-primary">
              About This Visualisation
            </h2>
            <p>
              Tile area is proportional to approximate <strong>market capitalisation</strong> sourced as
              reference data (~{DATA_LAST_UPDATED}). This gives an intuitive sense of GICS sector
              weighting within the S&amp;P 500 but should not be used for precise portfolio weighting.
            </p>
            <p>
              Tile colour reflects the <strong>illustrative % change</strong> values in the static dataset.
              These are <strong>not</strong> real daily moves, not historical data, and not derived from
              any live feed. They exist solely to demonstrate the colour-gradient layout of the
              visualisation.
            </p>
            <p className="text-[11px] font-mono text-text-tertiary border-t border-border-slate pt-3">
              Live equity price and performance data requires additional API integration (Yahoo Finance
              or equivalent batch feed for 55+ symbols). Deferred pending SC9 Twelve Data
              credit-budget review and infrastructure scoping.
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
