import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TradingViewTickerTape } from "@/components/markets/TradingViewTickerTape";
import { TradingViewMiniChart } from "@/components/markets/TradingViewMiniChart";
import { getCategoryInstruments } from "@/lib/markets-config";

export const metadata = {
  title: "Markets Hub | Live Financial Charts & Analysis | Drawdown",
  description: "Live charts, technical analysis, and Drawdown curriculum context for Forex, Commodities, Indices, and Cryptocurrencies. Real-time TradingView widgets.",
};

const CATEGORIES = [
  {
    slug: "forex" as const,
    name: "Forex",
    count: "6 Major Pairs",
    desc: "Live TradingView charts, technical analysis gauges, and curriculum context for GBP/USD, EUR/USD, USD/JPY, and other major forex pairs.",
    badge: "GBP/USD, EUR/USD, USD/JPY",
    bgImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800"
  },
  {
    slug: "commodities" as const,
    name: "Commodities",
    count: "Precious Metals & Energy",
    desc: "Macro commodities including safe-haven assets (Gold, Silver) and energy (WTI Crude Oil) with key fundamental driver breakdowns.",
    badge: "Gold, Silver, Crude Oil",
    bgImage: "https://images.unsplash.com/photo-1610374792793-f016b77ca51a?q=80&w=800"
  },
  {
    slug: "indices" as const,
    name: "Indices",
    count: "US & UK Equity Benchmarks",
    desc: "Global equity benchmarks tracking UK and US economic health. Essential directional sentiment indicators for cross-asset trading.",
    badge: "FTSE 100, S&P 500, NASDAQ",
    bgImage: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800"
  },
  {
    slug: "crypto" as const,
    name: "Cryptocurrencies",
    count: "24/7 Digital Assets",
    desc: "High-beta digital assets (Bitcoin, Ethereum, XRP) covered in Drawdown's Phase 6 advanced risk management modules.",
    badge: "Bitcoin, Ethereum, XRP",
    bgImage: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=800"
  }
];

export default function MarketsHubPage() {
  return (
    <div className="flex flex-col bg-[#0A0A0A] text-white min-h-screen selection:bg-[#C8F135] selection:text-black">
      
      {/* SECTION 1 — HERO */}
      <section className="relative w-full py-32 px-6 bg-[#0A0A0A] text-center overflow-hidden">
        {/* Background gradient flares */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none select-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#C8F135]/5 blur-[150px] rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <span className="text-xs font-mono tracking-widest uppercase opacity-40 block mb-4">
            // LIVE MARKETS
          </span>
          
          <h1 className="text-5xl lg:text-7xl font-sans font-bold leading-tight max-w-4xl mx-auto uppercase">
            Every market. Live data.<br />
            Trading context that actually matters.
          </h1>
          
          <p className="text-xl text-white opacity-60 max-w-2xl mx-auto font-sans leading-relaxed mt-6">
            Real-time TradingView charts, technical analysis gauges, and Drawdown curriculum context for every major instrument we teach. Forex, commodities, indices and crypto — all in one place.
          </p>

          {/* Stat Row */}
          <div className="mt-12 flex flex-wrap justify-center gap-x-12 gap-y-4">
            <div>
              <span className="text-2xl font-mono font-bold text-white block">16</span>
              <span className="text-xs opacity-40 uppercase tracking-widest block mt-1 font-sans">Instruments Covered</span>
            </div>
            <div>
              <span className="text-2xl font-mono font-bold text-white block">4</span>
              <span className="text-xs opacity-40 uppercase tracking-widest block mt-1 font-sans">Asset Classes</span>
            </div>
            <div>
              <span className="text-2xl font-mono font-bold text-white block">24/7</span>
              <span className="text-xs opacity-40 uppercase tracking-widest block mt-1 font-sans">Crypto Coverage</span>
            </div>
            <div>
              <span className="text-2xl font-mono font-bold text-white block">Live</span>
              <span className="text-xs opacity-40 uppercase tracking-widest block mt-1 font-sans">TradingView Data</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — TICKER TAPE */}
      <div className="w-full bg-[#0d0d0d] border-y border-white/8">
        <TradingViewTickerTape />
      </div>

      {/* SECTION 3 — FOUR CATEGORY CARDS */}
      <section className="py-20 max-w-7xl mx-auto px-6 lg:px-16 w-full">
        <div className="text-xs font-mono tracking-widest uppercase opacity-40 mb-8">
          // EXPLORE BY ASSET CLASS
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CATEGORIES.map(cat => (
            <Link 
              key={cat.slug} 
              href={`/markets/${cat.slug}`}
              className="bg-white/[0.02] border border-white/8 rounded-2xl p-8 hover:border-white/20 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
            >
              {/* Animated background image */}
              <div className="absolute inset-0 z-0 pointer-events-none select-none">
                <img 
                  src={cat.bgImage} 
                  alt="" 
                  className="absolute inset-0 w-full h-full object-cover opacity-[0.06] group-hover:opacity-[0.18] scale-100 group-hover:scale-105 transition-all duration-700 ease-out mix-blend-luminosity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
              </div>

              <div className="space-y-6 relative z-10">
                {/* Header Row */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-xl lg:text-2xl font-sans font-extrabold text-white tracking-tight group-hover:text-[#C8F135] transition-colors uppercase">
                      {cat.name}
                    </h2>
                    <span className="inline-block mt-2 text-[10px] font-mono tracking-widest uppercase text-white/40">
                      {cat.count}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[#C8F135] bg-[#C8F135]/5 border border-[#C8F135]/15 px-3 py-1 rounded-full uppercase">
                    {cat.slug}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm md:text-base text-white/60 leading-relaxed font-sans">
                  {cat.desc}
                </p>
              </div>

              {/* Bottom Row */}
              <div className="flex justify-between items-center pt-8 border-t border-white/5 mt-8 relative z-10">
                <span className="text-xs text-white/40 font-mono tracking-wide">
                  {cat.badge}
                </span>
                
                <span className="text-sm font-bold text-[#C8F135] flex items-center gap-1.5 group-hover:underline">
                  Explore Category <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION 4 — FEATURED INSTRUMENTS */}
      <section className="py-20 max-w-7xl mx-auto px-6 lg:px-16 w-full border-t border-white/5">
        <div className="text-xs font-mono tracking-widest uppercase opacity-40 mb-4">
          // FEATURED INSTRUMENTS
        </div>
        <h2 className="text-3xl font-bold text-white mb-3 font-sans">
          Today's most-watched markets.
        </h2>
        <p className="text-base text-white opacity-50 mb-10 font-sans">
          The instruments our traders focus on most. Live mini charts updated in real time.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: GBP/USD */}
          <Link 
            href="/markets/forex/gbpusd"
            className="bg-white/3 rounded-2xl border border-white/8 overflow-hidden hover:border-white/20 transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="p-4 pb-0">
                <div className="text-lg font-mono font-bold text-white">GBP/USD</div>
                <div className="text-xs text-white opacity-40">British Pound / US Dollar</div>
              </div>
              <div className="w-full h-[160px] bg-[#0A0A0A] overflow-hidden mt-4">
                <TradingViewMiniChart 
                  symbol="FX:GBPUSD"
                  largeChartUrl="https://drawdown.trading/markets/forex/gbpusd"
                  height={160}
                />
              </div>
            </div>
            <div className="p-4 pt-3 border-t border-white/5">
              <span className="text-xs text-[#C8F135] font-mono flex items-center gap-1">
                View Full Analysis <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>

          {/* Card 2: Gold */}
          <Link 
            href="/markets/commodities/gold"
            className="bg-white/3 rounded-2xl border border-white/8 overflow-hidden hover:border-white/20 transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="p-4 pb-0">
                <div className="text-lg font-mono font-bold text-white">XAU/USD</div>
                <div className="text-xs text-white opacity-40">Gold Spot / US Dollar</div>
              </div>
              <div className="w-full h-[160px] bg-[#0A0A0A] overflow-hidden mt-4">
                <TradingViewMiniChart 
                  symbol="OANDA:XAUUSD"
                  largeChartUrl="https://drawdown.trading/markets/commodities/gold"
                  height={160}
                />
              </div>
            </div>
            <div className="p-4 pt-3 border-t border-white/5">
              <span className="text-xs text-[#C8F135] font-mono flex items-center gap-1">
                View Full Analysis <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>

          {/* Card 3: FTSE 100 */}
          <Link 
            href="/markets/indices/uk100"
            className="bg-white/3 rounded-2xl border border-white/8 overflow-hidden hover:border-white/20 transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="p-4 pb-0">
                <div className="text-lg font-mono font-bold text-white">UK100</div>
                <div className="text-xs text-white opacity-40">FTSE 100 Index</div>
              </div>
              <div className="w-full h-[160px] bg-[#0A0A0A] overflow-hidden mt-4">
                <TradingViewMiniChart 
                  symbol="SPREADEX:UK100"
                  largeChartUrl="https://drawdown.trading/markets/indices/uk100"
                  height={160}
                />
              </div>
            </div>
            <div className="p-4 pt-3 border-t border-white/5">
              <span className="text-xs text-[#C8F135] font-mono flex items-center gap-1">
                View Full Analysis <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>

          {/* Card 4: Bitcoin */}
          <Link 
            href="/markets/crypto/bitcoin"
            className="bg-white/3 rounded-2xl border border-white/8 overflow-hidden hover:border-white/20 transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="p-4 pb-0">
                <div className="text-lg font-mono font-bold text-white">BTC/USD</div>
                <div className="text-xs text-white opacity-40">Bitcoin / US Dollar</div>
              </div>
              <div className="w-full h-[160px] bg-[#0A0A0A] overflow-hidden mt-4">
                <TradingViewMiniChart 
                  symbol="COINBASE:BTCUSD"
                  largeChartUrl="https://drawdown.trading/markets/crypto/bitcoin"
                  height={160}
                />
              </div>
            </div>
            <div className="p-4 pt-3 border-t border-white/5">
              <span className="text-xs text-[#C8F135] font-mono flex items-center gap-1">
                View Full Analysis <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* SECTION 5 — WHY THIS EXISTS / DRAWDOWN CONTEXT */}
      <section className="py-20 bg-white/[0.02] border-y border-white/5 w-full">
        <div className="max-w-5xl mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column */}
            <div>
              <span className="text-xs font-mono tracking-widest uppercase opacity-40 block mb-4">
                // WHY WE BUILT THIS
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 font-sans">
                Market data without the noise.
              </h2>
              <div className="space-y-4 text-base text-white/70 leading-relaxed font-sans">
                <p>
                  Most market data sites bury you in numbers without context. They show you a price, a chart and a gauge — but nothing that helps you understand what you're actually looking at or how to trade it.
                </p>
                <p>
                  Every page in the Drawdown Markets Hub connects live TradingView data to curriculum context. You can see which phase covers each instrument, what drives it fundamentally, when it's most active, and what kinds of setups work on it. Data with a framework behind it.
                </p>
                <p>
                  It's free. No sign-up required to access any market page. If you find it useful and want to learn to trade properly, the Drawdown curriculum is where you go next.
                </p>
              </div>
              <div className="mt-8">
                <Link 
                  href="/courses"
                  className="border border-white/20 text-white px-6 py-3 rounded-lg text-sm hover:bg-white/5 transition inline-block font-sans font-semibold"
                >
                  Explore the Curriculum &rarr;
                </Link>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Feature 1 */}
              <div className="flex items-start gap-4 bg-white/3 rounded-xl border border-white/8 p-5 relative overflow-hidden group">
                {/* Animated background image */}
                <div className="absolute inset-0 z-0 pointer-events-none select-none">
                  <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600" 
                    alt="" 
                    className="absolute inset-0 w-full h-full object-cover opacity-[0.03] group-hover:opacity-[0.12] scale-100 group-hover:scale-105 transition-all duration-700 ease-out mix-blend-luminosity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/50" />
                </div>
                <div className="w-2 h-2 rounded-full bg-[#C8F135] mt-1.5 shrink-0 relative z-10" />
                <div className="relative z-10">
                  <h3 className="font-semibold text-sm text-white mb-1 font-sans">Live TradingView Charts</h3>
                  <p className="text-xs text-white/50 leading-relaxed font-sans">
                    Every instrument page embeds a live, interactive Advanced Chart. The same platform used throughout the Drawdown curriculum.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-4 bg-white/3 rounded-xl border border-white/8 p-5 relative overflow-hidden group">
                {/* Animated background image */}
                <div className="absolute inset-0 z-0 pointer-events-none select-none">
                  <img 
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600" 
                    alt="" 
                    className="absolute inset-0 w-full h-full object-cover opacity-[0.03] group-hover:opacity-[0.12] scale-100 group-hover:scale-105 transition-all duration-700 ease-out mix-blend-luminosity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/50" />
                </div>
                <div className="w-2 h-2 rounded-full bg-[#C8F135] mt-1.5 shrink-0 relative z-10" />
                <div className="relative z-10">
                  <h3 className="font-semibold text-sm text-white mb-1 font-sans">Technical Analysis Gauges</h3>
                  <p className="text-xs text-white/50 leading-relaxed font-sans">
                    Multi-timeframe sentiment indicators — from 1-minute to weekly — aggregated from TradingView's signal engine.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-4 bg-white/3 rounded-xl border border-white/8 p-5 relative overflow-hidden group">
                {/* Animated background image */}
                <div className="absolute inset-0 z-0 pointer-events-none select-none">
                  <img 
                    src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600" 
                    alt="" 
                    className="absolute inset-0 w-full h-full object-cover opacity-[0.03] group-hover:opacity-[0.12] scale-100 group-hover:scale-105 transition-all duration-700 ease-out mix-blend-luminosity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/50" />
                </div>
                <div className="w-2 h-2 rounded-full bg-[#C8F135] mt-1.5 shrink-0 relative z-10" />
                <div className="relative z-10">
                  <h3 className="font-semibold text-sm text-white mb-1 font-sans">Economic Calendar</h3>
                  <p className="text-xs text-white/50 leading-relaxed font-sans">
                    Filtered to the relevant currencies and regions for each instrument. Know what's coming before you trade.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex items-start gap-4 bg-white/3 rounded-xl border border-white/8 p-5 relative overflow-hidden group">
                {/* Animated background image */}
                <div className="absolute inset-0 z-0 pointer-events-none select-none">
                  <img 
                    src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600" 
                    alt="" 
                    className="absolute inset-0 w-full h-full object-cover opacity-[0.03] group-hover:opacity-[0.12] scale-100 group-hover:scale-105 transition-all duration-700 ease-out mix-blend-luminosity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/50" />
                </div>
                <div className="w-2 h-2 rounded-full bg-[#C8F135] mt-1.5 shrink-0 relative z-10" />
                <div className="relative z-10">
                  <h3 className="font-semibold text-sm text-white mb-1 font-sans">Curriculum Context</h3>
                  <p className="text-xs text-white/50 leading-relaxed font-sans">
                    Each page tells you which Drawdown phase covers that instrument, what drives it, and when it's most active for UK traders.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — FULL INSTRUMENT LIST */}
      <section className="py-20 max-w-7xl mx-auto px-6 lg:px-16 w-full">
        <div className="text-xs font-mono tracking-widest uppercase opacity-40 mb-4">
          // ALL INSTRUMENTS
        </div>
        <h2 className="text-3xl font-bold text-white mb-10 font-sans">
          Every market we cover.
        </h2>

        <div className="space-y-16">
          {[
            { key: "forex" as const, name: "Forex" },
            { key: "commodities" as const, name: "Commodities" },
            { key: "indices" as const, name: "Indices" },
            { key: "crypto" as const, name: "Cryptocurrencies" },
          ].map(cat => {
            const list = getCategoryInstruments(cat.key);
            return (
              <div key={cat.key} className="space-y-4">
                {/* Category Heading Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-white uppercase font-sans">
                      {cat.name}
                    </h3>
                    <span className="bg-white/5 rounded-full px-3 py-1 text-xs font-mono opacity-50 text-white">
                      {list.length}
                    </span>
                  </div>
                  <Link 
                    href={`/markets/${cat.key}`}
                    className="text-xs text-[#C8F135] font-mono hover:underline"
                  >
                    View all {cat.name} &rarr;
                  </Link>
                </div>

                {/* Instrument Rows */}
                <div className="border-t border-white/5">
                  {list.map(inst => (
                    <Link 
                      key={inst.slug}
                      href={`/markets/${inst.category}/${inst.slug}`}
                      className="flex items-center justify-between py-4 border-b border-white/5 hover:bg-white/[0.02] transition px-2 rounded cursor-pointer group"
                    >
                      <div className="flex items-baseline">
                        <span className="font-mono font-semibold text-sm text-white group-hover:text-[#C8F135] transition-colors">
                          {inst.displayPair}
                        </span>
                        <span className="text-xs text-white opacity-40 ml-3 hidden sm:inline">
                          {inst.name}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs font-mono bg-white/5 border border-white/10 rounded-full px-3 py-1 opacity-60 text-white">
                          {inst.drawdownPhase.split(" — ")[0]}
                        </span>
                        <span className="text-[#C8F135] ml-4 text-sm group-hover:translate-x-0.5 transition-transform">
                          →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 7 — BOTTOM CTA STRIP */}
      <section className="py-16 border-t border-white/8 w-full bg-[#0A0A0A]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-3 font-sans">
            Want to learn to trade these markets properly?
          </h2>
          <p className="text-base text-white opacity-50 mb-8 max-w-2xl mx-auto font-sans leading-relaxed">
            The Drawdown curriculum takes you from complete beginner to structured, risk-managed trader across forex, commodities, indices and crypto.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-[#C8F135] text-black font-semibold px-8 py-3 rounded-lg hover:opacity-95 transition font-sans text-center"
            >
              Start Free on Drawdown &rarr;
            </Link>
            <Link
              href="/courses"
              className="border border-white/20 text-white px-8 py-3 rounded-lg hover:bg-white/5 transition font-sans text-center"
            >
              View the Curriculum &rarr;
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
