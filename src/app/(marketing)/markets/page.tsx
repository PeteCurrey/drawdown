import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TradingViewTickerTape } from "@/components/markets/TradingViewTickerTape";

export const metadata = {
  title: "Markets Hub | Live Financial Charts & Analysis | Drawdown",
  description: "Live charts, technical analysis, and Drawdown curriculum context for Forex, Commodities, Indices, and Cryptocurrencies. Real-time TradingView widgets.",
};

const CATEGORIES = [
  {
    slug: "forex",
    name: "Forex",
    count: "6 Major Pairs",
    desc: "Live TradingView charts, technical analysis gauges, and curriculum context for GBP/USD, EUR/USD, USD/JPY, and other major forex pairs.",
    badge: "GBP/USD, EUR/USD, USD/JPY"
  },
  {
    slug: "commodities",
    name: "Commodities",
    count: "Precious Metals & Energy",
    desc: "Macro commodities including safe-haven assets (Gold, Silver) and energy (WTI Crude Oil) with key fundamental driver breakdowns.",
    badge: "Gold, Silver, Crude Oil"
  },
  {
    slug: "indices",
    name: "Indices",
    count: "US & UK Equity Benchmarks",
    desc: "Global equity benchmarks tracking UK and US economic health. Essential directional sentiment indicators for cross-asset trading.",
    badge: "FTSE 100, S&P 500, NASDAQ"
  },
  {
    slug: "crypto",
    name: "Cryptocurrencies",
    count: "24/7 Digital Assets",
    desc: "High-beta digital assets (Bitcoin, Ethereum, XRP) covered in Drawdown's Phase 6 advanced risk management modules.",
    badge: "Bitcoin, Ethereum, XRP"
  }
];

export default function MarketsHubPage() {
  return (
    <div className="flex flex-col bg-[#0A0A0A] text-white min-h-screen selection:bg-[#C8F135] selection:text-black">
      
      {/* Ticker Tape at the top of the page */}
      <div className="w-full bg-[#0d0d0d] border-b border-white/5">
        <TradingViewTickerTape />
      </div>

      {/* HERO SECTION */}
      <section className="relative w-full py-24 px-6 border-b border-white/5 bg-[#0A0A0A] overflow-hidden">
        
        {/* Background gradient flares */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none select-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#C8F135]/5 blur-[150px] rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <span className="text-xs font-sans font-bold tracking-widest text-[#C8F135] uppercase block">
            // DRAWDOWN MARKET INTELLIGENCE
          </span>
          
          <h1 className="text-4xl lg:text-6xl font-sans font-extrabold text-white tracking-tight leading-none uppercase">
            Markets Hub
          </h1>
          
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-sans leading-relaxed">
            Live charts, technical analysis and trading context for every major market we cover. Explore our categories to start.
          </p>
        </div>
      </section>

      {/* CATEGORY GRID SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CATEGORIES.map(cat => (
            <Link 
              key={cat.slug} 
              href={`/markets/${cat.slug}`}
              className="bg-white/[0.02] border border-white/8 rounded-2xl p-8 hover:border-white/20 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            >
              <div className="space-y-6">
                
                {/* Header Row */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-sans font-extrabold text-white tracking-tight group-hover:text-[#C8F135] transition-colors uppercase">
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
              <div className="flex justify-between items-center pt-8 border-t border-white/5 mt-8">
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

      {/* BOTTOM BANNER STRIP */}
      <section className="py-20 bg-[#C8F135]/5 border-y border-[#C8F135]/20 text-center select-none mt-auto">
        <div className="max-w-4xl mx-auto px-6 space-y-6">
          <h2 className="text-3xl md:text-4xl font-sans font-extrabold text-white tracking-tight leading-tight">
            Start Learning with Live Data Today
          </h2>
          <p className="text-sm md:text-base text-white/70 max-w-xl mx-auto font-sans leading-relaxed">
            Every charting resource in the Drawdown academy utilizes TradingView integration. Gain access to macro analysis, calculators, and tools.
          </p>
          
          <div className="pt-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-10 py-4 bg-[#C8F135] text-black font-bold text-base tracking-wide rounded-lg hover:opacity-95 shadow-xl shadow-[#C8F135]/5 font-sans"
            >
              Start Free on Drawdown &rarr;
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
