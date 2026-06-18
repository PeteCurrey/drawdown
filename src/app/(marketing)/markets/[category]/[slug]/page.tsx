import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronDown, ArrowRight } from "lucide-react";
import { 
  getInstrumentBySlug, 
  getAllSlugs, 
  MarketCategory 
} from "@/lib/markets-config";
import { TradingViewSymbolInfo } from "@/components/markets/TradingViewSymbolInfo";
import { TradingViewChart } from "@/components/markets/TradingViewChart";
import { TradingViewTechnicalAnalysis } from "@/components/markets/TradingViewTechnicalAnalysis";
import { TradingViewCalendar } from "@/components/markets/TradingViewCalendar";
import { TradingViewMiniChart } from "@/components/markets/TradingViewMiniChart";

interface PageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map(s => ({
    category: s.category,
    slug: s.slug
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const instrument = getInstrumentBySlug(slug);
  if (!instrument) return {};
  return {
    title: instrument.metaTitle,
    description: instrument.metaDescription,
  };
}

// Helper to map currencies/categories to TradingView economic calendar country filters
function getCountryFilter(category: MarketCategory, base: string, quote: string): string {
  if (category === "crypto") return "us";
  if (category === "commodities") return "us";
  
  if (category === "indices") {
    if (base.toLowerCase() === "gbp" || quote.toLowerCase() === "gbp") return "gb,us";
    return "us";
  }

  const mapCurrency = (curr: string): string => {
    const c = curr.toLowerCase();
    if (c === "eur") return "eu,de,fr";
    if (c === "gbp") return "gb";
    if (c === "usd") return "us";
    if (c === "jpy") return "jp";
    if (c === "aud") return "au";
    return "us";
  };

  const baseFilter = mapCurrency(base);
  const quoteFilter = mapCurrency(quote);
  return Array.from(new Set([...baseFilter.split(","), ...quoteFilter.split(",")])).join(",");
}

// Helper to determine the highlight range (0 to 24) for the GMT session bar
function getSessionRanges(slug: string): { start: number; end: number }[] {
  switch (slug) {
    case "eurusd":
      return [{ start: 8, end: 10 }, { start: 13, end: 17 }];
    case "gbpusd":
      return [{ start: 7, end: 9.5 }, { start: 13, end: 17 }];
    case "usdjpy":
      return [{ start: 0, end: 3 }, { start: 13, end: 17 }];
    case "gbpjpy":
      return [{ start: 7, end: 10 }];
    case "audusd":
      return [{ start: 0, end: 3 }, { start: 7, end: 9 }, { start: 23, end: 24 }];
    case "eurgbp":
      return [{ start: 7, end: 11 }];
    case "gold":
    case "silver":
      return [{ start: 13, end: 17 }];
    case "oil":
      return [{ start: 13, end: 20 }];
    case "uk100":
      return [{ start: 7, end: 9.5 }];
    case "us500":
    case "nas100":
    case "us30":
      return [{ start: 14.5, end: 21 }];
    case "bitcoin":
    case "ethereum":
    case "xrp":
      return [{ start: 13, end: 21 }];
    default:
      return [{ start: 8, end: 16 }];
  }
}

export default async function MarketInstrumentPage({ params }: PageProps) {
  const { slug } = await params;
  const instrument = getInstrumentBySlug(slug);

  if (!instrument) {
    notFound();
  }

  const countryFilter = getCountryFilter(instrument.category, instrument.baseCurrency, instrument.quoteCurrency);
  const sessionRanges = getSessionRanges(instrument.slug);

  return (
    <div className="flex flex-col bg-[#0A0A0A] text-white min-h-screen selection:bg-[#C8F135] selection:text-black">
      
      {/* SECTION 1: HERO */}
      <section className="relative w-full min-h-[calc(100vh-58px)] flex flex-col justify-center items-center py-20 px-6 overflow-hidden border-b border-white/5 bg-[#0A0A0A]">
        
        {/* Background Gradients */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none select-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C8F135]/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 blur-[120px] rounded-full" />
        </div>

        <div className="w-full max-w-4xl mx-auto text-center space-y-6 relative z-10">
          {/* Breadcrumbs */}
          <div className="text-xs uppercase tracking-widest text-white/30 font-semibold font-sans">
            Markets / <span className="text-white/50">{instrument.category}</span> / <span className="text-[#C8F135]">{instrument.displayPair}</span>
          </div>

          {/* Pair Title */}
          <h1 className="text-5xl lg:text-7xl font-mono font-bold tracking-tight text-white leading-none">
            {instrument.displayPair}
          </h1>
          <p className="text-xl opacity-50 font-sans tracking-wide">
            {instrument.name}
          </p>

          {/* Symbol Info Widget */}
          <div className="w-full max-w-3xl mx-auto pt-6">
            <TradingViewSymbolInfo 
              symbol={instrument.ticker}
              largeChartUrl={`https://drawdown.trading/markets/${instrument.category}/${instrument.slug}`}
            />
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 w-full max-w-md mx-auto">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-4 bg-[#C8F135] text-black font-bold text-sm tracking-wide rounded-lg hover:opacity-95 shadow-lg shadow-black/20 text-center font-sans"
            >
              Start Free on Drawdown →
            </Link>
            <Link
              href="/go/tradingview"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 border border-white/20 text-white font-bold text-sm tracking-wide rounded-lg hover:bg-white/5 text-center font-sans"
            >
              Try TradingView Free →
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <ChevronDown className="w-6 h-6 text-white/30" />
        </div>
      </section>

      {/* SECTION 2: INTRO */}
      <section className="py-24 max-w-4xl mx-auto px-6 text-center space-y-8 relative">
        <h2 className="text-3xl lg:text-4xl font-sans font-extrabold tracking-tight text-white">
          Understanding {instrument.name}
        </h2>
        <p className="text-lg text-white/70 leading-relaxed max-w-3xl mx-auto font-sans">
          {instrument.description}
        </p>
        <blockquote className="border-l-2 border-[#C8F135] pl-6 text-left max-w-2xl mx-auto text-base text-white/60 italic my-8 font-sans">
          {instrument.whyTrade}
        </blockquote>
        <div className="pt-2">
          <span className="inline-block bg-white/5 border border-white/10 rounded-full px-5 py-2 text-xs font-mono tracking-widest text-[#C8F135]">
            PEAK HOURS: {instrument.sessionPeak}
          </span>
        </div>
      </section>

      {/* SECTION 3: LIVE CHART */}
      <section className="w-full border-t border-b border-white/10 bg-[#0A0A0A] py-12">
        <div className="w-full max-w-7xl mx-auto px-6 mb-6">
          <span className="text-[11px] font-sans font-bold text-white/40 uppercase tracking-widest block mb-2">
            // LIVE CHART
          </span>
          <h2 className="text-2xl md:text-3xl font-sans font-extrabold text-white tracking-tight leading-tight">
            Live {instrument.displayPair} Chart
          </h2>
        </div>

        {/* Chart Header Bar */}
        <div className="w-full">
          <div className="border-y border-white/10 bg-[#0A0A0A]">
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-11 bg-[#111111] border-b border-white/5 select-none">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8F135] inline-block animate-pulse" />
                <span className="text-[10px] font-bold text-[#C8F135] uppercase tracking-wider font-mono">
                  LIVE
                </span>
                <span className="text-xs font-semibold text-white font-mono ml-1">
                  {instrument.displayPair} · 1H
                </span>
              </div>
              <div className="text-[10px] text-white/30 font-sans">
                Powered by TradingView
              </div>
            </div>
            
            {/* The Live Chart Embed */}
            <div className="w-full h-[400px] lg:h-[600px]">
              <TradingViewChart symbol={instrument.ticker} className="h-full w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: TWO-COLUMN ANALYTICS */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left Column: Technical Analysis */}
          <div className="space-y-6">
            <span className="text-[11px] font-sans font-bold text-white/40 uppercase tracking-widest block">
              // TECHNICAL ANALYSIS
            </span>
            <h3 className="text-xl md:text-2xl font-sans font-bold text-white">
              Market Sentiment
            </h3>
            <p className="text-sm text-white/60 font-sans max-w-md">
              Aggregated signals across multiple timeframes — powered by TradingView.
            </p>
            <div className="pt-4 border border-white/10 rounded-xl overflow-hidden bg-white/[0.01]">
              <TradingViewTechnicalAnalysis symbol={instrument.ticker} />
            </div>
          </div>

          {/* Right Column: Key Drivers & Session Clock */}
          <div className="space-y-8">
            <div className="space-y-6">
              <span className="text-[11px] font-sans font-bold text-white/40 uppercase tracking-widest block">
                // KEY DRIVERS
              </span>
              <h3 className="text-xl md:text-2xl font-sans font-bold text-white">
                What Moves {instrument.displayPair}
              </h3>
              
              <div className="space-y-4">
                {instrument.keyDrivers.map((driver, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-4 bg-white/[0.02] border border-white/5 rounded-xl p-5 hover:border-[#C8F135]/30 transition-all duration-300 group"
                  >
                    <span className="text-lg font-mono font-bold text-[#C8F135] group-hover:scale-105 transition-transform duration-200">
                      {(index + 1).toString().padStart(2, "0")}
                    </span>
                    <span className="text-sm md:text-base text-white/80 font-sans leading-relaxed">
                      {driver}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Session Clock Widget */}
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 space-y-4">
              <h4 className="text-xs uppercase tracking-widest text-white/50 font-bold font-sans">
                Best Trading Window
              </h4>
              <p className="text-sm font-semibold text-[#C8F135] font-sans">
                {instrument.sessionPeak}
              </p>

              {/* GMT Bar Clock */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-[10px] font-mono text-white/30 px-1">
                  <span>00:00 GMT</span>
                  <span>06:00</span>
                  <span>12:00</span>
                  <span>18:00</span>
                  <span>24:00</span>
                </div>

                <div className="relative h-6 bg-white/5 rounded-full overflow-hidden flex">
                  {/* Draw 24 hours segments */}
                  {[...Array(24)].map((_, hour) => {
                    const isActive = sessionRanges.some(r => {
                      if (r.start <= r.end) {
                        return hour >= r.start && hour < r.end;
                      } else {
                        // Wraps overnight (e.g. 23:00 to 03:00)
                        return hour >= r.start || hour < r.end;
                      }
                    });
                    return (
                      <div 
                        key={hour} 
                        className={`flex-grow h-full border-r border-[#0A0A0A]/20 last:border-0 transition-colors duration-300 ${
                          isActive ? "bg-[#C8F135] opacity-80" : "bg-transparent"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 5: ECONOMIC CALENDAR */}
      <section className="w-full py-24 border-t border-b border-white/10 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 space-y-6 mb-8">
          <span className="text-[11px] font-sans font-bold text-white/40 uppercase tracking-widest block">
            // CALENDAR
          </span>
          <h2 className="text-2xl md:text-3xl font-sans font-extrabold text-white tracking-tight">
            Economic Calendar
          </h2>
          <p className="text-sm text-white/60 font-sans">
            Key upcoming macro events affecting {instrument.displayPair}
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="border border-white/10 rounded-xl overflow-hidden bg-white/[0.01]">
            <TradingViewCalendar countryFilter={countryFilter} />
          </div>
        </div>
      </section>

      {/* SECTION 6: DRAWDOWN CONTEXT */}
      <section className="py-24 max-w-5xl mx-auto px-6 lg:px-16">
        <div className="bg-white/[0.02] rounded-2xl border border-white/8 p-8 lg:p-12 border-l-4 border-l-[#C8F135] relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            
            {/* Left Box */}
            <div className="space-y-6">
              <span className="text-[11px] font-sans font-bold text-[#C8F135] uppercase tracking-widest block">
                DRAWDOWN CURRICULUM
              </span>
              <h2 className="text-2xl lg:text-3xl font-sans font-bold text-white leading-tight">
                How We Teach {instrument.displayPair}
              </h2>
              <p className="text-sm text-white/70 leading-relaxed font-sans">
                {instrument.drawdownNote}
              </p>
              
              <div className="pt-2">
                <span className="inline-block bg-[#C8F135]/10 text-[#C8F135] border border-[#C8F135]/30 text-[10px] font-mono px-3 py-1.5 rounded-full uppercase tracking-wider">
                  INTRODUCED IN: {instrument.drawdownPhase}
                </span>
              </div>
            </div>

            {/* Right Box: Benefit list */}
            <div className="space-y-6">
              {[
                {
                  title: "Structured Learning",
                  desc: "Follow the Drawdown curriculum from Phase 1. No skipping ahead."
                },
                {
                  title: "Live Chart Examples",
                  desc: "Every lesson uses TradingView. You'll be familiar with the platform from day one."
                },
                {
                  title: "Risk-First Approach",
                  desc: "You won't touch " + instrument.displayPair + " in the curriculum until your risk framework is solid."
                }
              ].map((item, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <span 
                    className="w-2 h-2 rounded-full inline-block shrink-0 mt-1.5" 
                    style={{ backgroundColor: "#C8F135" }} 
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white font-sans">{item.title}</h4>
                    <p className="text-xs text-white/60 mt-1 font-sans leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Centered button block below card */}
          <div className="pt-12 border-t border-white/5 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#C8F135] text-black font-bold text-sm tracking-wide rounded-lg hover:opacity-95 text-center font-sans transition-all"
            >
              Start the Curriculum Free →
            </Link>
            <Link
              href="/courses"
              className="w-full sm:w-auto px-8 py-3.5 border border-white/10 text-white font-bold text-sm tracking-wide rounded-lg hover:bg-white/5 text-center font-sans transition-all"
            >
              Explore the Full Curriculum →
            </Link>
          </div>

        </div>
      </section>

      {/* SECTION 7: RELATED MARKETS */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-16 border-t border-white/5">
        <h2 className="text-xl md:text-2xl font-sans font-bold text-white mb-8">
          Related Markets
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {instrument.relatedSlugs.map(slug => {
            const rel = getInstrumentBySlug(slug);
            if (!rel) return null;
            return (
              <Link 
                key={rel.slug}
                href={`/markets/${rel.category}/${rel.slug}`}
                className="bg-white/[0.02] rounded-xl border border-white/8 p-6 hover:border-white/20 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-mono text-lg font-bold text-white tracking-tight">
                      {rel.displayPair}
                    </span>
                  </div>
                  
                  {/* Mini Chart Embed */}
                  <div className="w-full h-[200px] rounded-lg overflow-hidden bg-[#0A0A0A]">
                    <TradingViewMiniChart 
                      symbol={rel.ticker}
                      largeChartUrl={`https://drawdown.trading/markets/${rel.category}/${rel.slug}`}
                    />
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5">
                  <span className="text-xs text-white/50 block uppercase tracking-wider font-sans font-semibold">
                    {rel.name}
                  </span>
                  <span className="text-xs text-[#C8F135] font-bold block mt-1.5">
                    View Analysis &rarr;
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* SECTION 8: BOTTOM CTA STRIP */}
      <section className="py-20 bg-[#C8F135]/5 border-y border-[#C8F135]/20 text-center select-none">
        <div className="max-w-4xl mx-auto px-6 space-y-6">
          <h2 className="text-3xl md:text-4xl font-sans font-extrabold text-white tracking-tight leading-tight">
            Learn to Trade {instrument.displayPair} Properly
          </h2>
          <p className="text-sm md:text-base text-white/70 max-w-xl mx-auto font-sans leading-relaxed">
            Phase-based curriculum. AI-powered tools. Honest mentorship. Start free — no card required.
          </p>
          
          <div className="pt-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-10 py-4 bg-[#C8F135] text-black font-bold text-base tracking-wide rounded-lg hover:opacity-95 shadow-xl shadow-[#C8F135]/5 font-sans"
            >
              Start Free on Drawdown &rarr;
            </Link>
          </div>

          <p className="text-[10px] md:text-xs text-white/30 max-w-2xl mx-auto font-sans leading-relaxed pt-4">
            <strong>Risk Disclaimer:</strong> Trading {instrument.displayPair} carries significant risk. This page is for educational purposes only and does not constitute financial advice.
          </p>
        </div>
      </section>

    </div>
  );
}
