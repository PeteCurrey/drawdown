import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Layers, Compass, TrendingUp, ShieldCheck } from "lucide-react";
import { StockSectorMap } from "@/components/market/StockSectorMap";
import { STOCK_DATA_V1, buildTreemapData } from "@/lib/data/stock-sectors";
import { MarketTicker } from "@/components/market/MarketTicker";

export const metadata: Metadata = {
  title: "US Equities Sector Map | Live Market Heatmap | Drawdown Trading",
  description:
    "Interactive S&P 500 Stock Sector Map showing GICS sector & industry distribution, market-cap sizing, and real-time daily performance across 55 top US large-cap equities."
};

export default function StockSectorMapPage() {
  const treemapData = buildTreemapData(STOCK_DATA_V1);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#C8F135] selection:text-black">
      {/* Top Ticker Bar */}
      <MarketTicker />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm text-zinc-400">
          <Link
            href="/markets"
            className="flex items-center gap-1.5 hover:text-[#C8F135] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Markets Hub</span>
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-white font-medium">Stock Sector Map</span>
        </div>

        {/* Hero Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-zinc-800 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-[#C8F135] mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>MACRO SECTOR ALLOCATION</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Stock Sector Map
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 mt-2 max-w-2xl">
              Visualize capital flow, sector rotation, and relative market strength across
              the top 55 S&P 500 large caps organized by GICS industry classification.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/market-intelligence"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-sm font-medium text-white transition-colors"
            >
              <TrendingUp className="w-4 h-4 text-[#18B880]" />
              <span>Market Intelligence</span>
            </Link>
          </div>
        </div>

        {/* Treemap Component */}
        <div className="mb-12">
          <StockSectorMap initialData={treemapData} rawStocks={STOCK_DATA_V1} />
        </div>

        {/* Explanatory Guide Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-zinc-900">
          <div className="bg-[#111113] p-5 rounded-xl border border-zinc-800/80">
            <div className="flex items-center gap-2 text-white font-semibold text-sm mb-2">
              <Layers className="w-4 h-4 text-[#C8F135]" />
              <h3>GICS Sector Hierarchy</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Equities are organized into 9 primary sectors: Information Technology, Financials, Health Care,
              Consumer Discretionary, Consumer Staples, Energy, Industrials, Utilities, and Real Estate.
            </p>
          </div>

          <div className="bg-[#111113] p-5 rounded-xl border border-zinc-800/80">
            <div className="flex items-center gap-2 text-white font-semibold text-sm mb-2">
              <TrendingUp className="w-4 h-4 text-[#18B880]" />
              <h3>Proportional Market Cap</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Tile area directly correlates with market capitalization (USD). Mega-caps like Apple, Microsoft,
              and NVIDIA occupy proportionally larger rectangles reflecting their S&P weighting.
            </p>
          </div>

          <div className="bg-[#111113] p-5 rounded-xl border border-zinc-800/80">
            <div className="flex items-center gap-2 text-white font-semibold text-sm mb-2">
              <ShieldCheck className="w-4 h-4 text-[#C8F135]" />
              <h3>Zero-Rate Limit Architecture</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Pre-computed market structures eliminate external quota locks and third-party downtime, delivering
              instant client-side responsiveness.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
