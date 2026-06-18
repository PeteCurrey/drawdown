import { Metadata } from "next";
import Link from "next/link";
import { Check, X, Star } from "lucide-react";
import { StructuredData } from "@/components/StructuredData";
import { FadeInSection } from "@/components/animations/FadeInSection";
import TVTickerTape from "@/components/tools/TVTickerTape";
import TVTechnicalAnalysis from "@/components/tools/TVTechnicalAnalysis";
import { TradingViewChart } from "@/components/markets/TradingViewChart";

export const metadata: Metadata = {
  title: "TradingView Review for UK Traders (2026) — Is It Worth It? | Drawdown",
  description: "An honest TradingView review from traders who use it daily. Free vs paid plans compared, UK-specific features, and why it's the charting platform we recommend to every Drawdown member.",
  alternates: {
    canonical: "https://drawdown.trading/tools/tradingview",
  },
  openGraph: {
    type: "article",
    title: "TradingView Review for UK Traders (2026) — Is It Worth It? | Drawdown",
    description: "An honest TradingView review from traders who use it daily. Free vs paid plans compared, UK-specific features, and why it's the charting platform we recommend to every Drawdown member.",
    url: "https://drawdown.trading/tools/tradingview",
    siteName: "Drawdown",
  }
};

export default function TradingViewReview() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "TradingView Review for UK Traders (2026) — Is It Worth It?",
    "author": {
      "@type": "Person",
      "name": "Pete Currey"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Drawdown",
      "logo": {
        "@type": "ImageObject",
        "url": "https://drawdown.trading/logo.png"
      }
    },
    "datePublished": "2026-06-14",
    "dateModified": "2026-06-14"
  };

  return (
    <article className="pb-24">
      <StructuredData type="Article" data={articleSchema} />

      {/* SECTION 1: HERO */}
      <section className="bg-mkt-bg pt-16 pb-12 md:pt-24 md:pb-16 border-b border-border-slate/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
              TOOL REVIEW
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-text-primary tracking-tight leading-tight">
              TradingView — The Honest Review for UK Traders.
            </h1>
            <p className="text-lg text-text-tertiary max-w-2xl mx-auto">
              Used by 60+ million traders worldwide. Here's what you actually need to know before you sign up — including whether the free plan is enough.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/go/tradingview"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-mkt-ink text-white rounded-lg font-bold text-sm tracking-wide hover:bg-mkt-i2 transition-colors"
            >
              Try TradingView Free →
            </Link>
            <Link
              href="#uk-features"
              className="w-full sm:w-auto px-8 py-4 bg-background-surface/40 border border-border-slate/50 backdrop-blur-md text-text-primary rounded-lg font-bold text-sm tracking-wide hover:bg-background-elevated/40 transition-colors"
            >
              Jump to UK-specific features ↓
            </Link>
          </div>

          <div className="mt-8 max-w-xl mx-auto p-4 bg-amber-50 border border-amber-200 rounded-lg text-left">
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>Disclosure:</strong> the links on this page are affiliate links. If you upgrade to a paid TradingView plan, we earn a commission. This doesn't affect our review — we use TradingView ourselves on every trading session and would recommend it regardless.
            </p>
          </div>
        </div>
      </section>

      {/* Ticker Tape Separator */}
      <div className="w-full bg-white border-b border-border-slate/50 py-2.5">
        <TVTickerTape className="h-full w-full" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 pt-16">
        
        {/* SECTION 2: WHAT IS TRADINGVIEW */}
        <FadeInSection>
          <section className="space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">OVERVIEW</span>
              <h2 className="text-3xl font-display font-bold text-text-primary">What is TradingView?</h2>
            </div>
            <div className="prose prose-lg prose-neutral text-text-tertiary max-w-none">
              <p>
                TradingView is a browser-based charting and market analysis platform launched in 2011. It has grown to become the default charting environment for the majority of retail traders globally — not because it's the cheapest option, but because it's genuinely the best.
              </p>
              <p>
                The platform combines professional-grade charting tools with a social layer where analysts and traders publish their ideas, scripts, and strategies publicly. This creates a searchable library of tens of millions of published chart analyses — more market perspective than any single trading desk could generate.
              </p>
              <p>
                For UK traders specifically, TradingView covers the instruments UK spread bettors actually trade: FTSE 100, FTSE 250, major FX pairs, Gold, Brent Crude, and the major indices. All with real-time or delayed data depending on your plan.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
              {[
                { val: "60M+", label: "Active users worldwide" },
                { val: "50+", label: "Connected exchanges and data sources" },
                { val: "2011", label: "Founded (15 years of stability)" },
                { val: "100K+", label: "Published Pine Script indicators" }
              ].map((stat, i) => (
                <div key={i} className="p-4 bg-background-surface/40 border border-border-slate/50 backdrop-blur-md rounded-xl">
                  <div className="text-2xl font-bold text-text-primary">{stat.val}</div>
                  <div className="text-xs text-text-tertiary mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>
        </FadeInSection>

        {/* SECTION 3: FREE VS PAID */}
        <FadeInSection>
          <section className="space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">PLANS</span>
              <h2 className="text-3xl font-display font-bold text-text-primary">Free plan or paid? Here's the honest answer.</h2>
            </div>
            <p className="text-lg text-text-tertiary">
              Most TradingView reviews tell you to go Pro immediately. We don't think that's right. The free plan is genuinely useful for a significant portion of retail traders. Here's exactly what you get and where the limitations start to matter.
            </p>

            <div className="overflow-x-auto rounded-xl border border-border-slate/50">
              <table className="w-full text-sm text-left">
                <thead className="bg-background-elevated/40 text-text-primary border-b border-border-slate/50">
                  <tr>
                    <th className="px-6 py-4 font-bold">Feature</th>
                    <th className="px-6 py-4 font-bold">Free</th>
                    <th className="px-6 py-4 font-bold">Essential ~£12/mo</th>
                    <th className="px-6 py-4 font-bold">Plus ~£22/mo</th>
                    <th className="px-6 py-4 font-bold">Premium ~£46/mo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-slate/50 bg-background-surface/40 backdrop-blur-md">
                  {[
                    { f: "Charts per layout", r1: "1", r2: "2", r3: "4", r4: "8" },
                    { f: "Saved chart layouts", r1: "1", r2: "5", r3: "10", r4: "Unlimited" },
                    { f: "Indicators per chart", r1: "3", r2: "5", r3: "10", r4: "25+" },
                    { f: "Real-time data", r1: "Delayed", r2: "✓", r3: "✓", r4: "✓" },
                    { f: "Alerts", r1: "1", r2: "20", r3: "100", r4: "Unlimited" },
                    { f: "No ads", r1: "✗", r2: "✓", r3: "✓", r4: "✓" },
                    { f: "Bar replay", r1: "✗", r2: "✓", r3: "✓", r4: "✓" },
                    { f: "Second-based charts", r1: "✗", r2: "✗", r3: "✗", r4: "✓" },
                    { f: "Volume Profile", r1: "✗", r2: "✗", r3: "✓", r4: "✓" },
                    { f: "Auto chart patterns", r1: "✗", r2: "✗", r3: "✓", r4: "✓" },
                  ].map((row, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 font-medium text-text-primary">{row.f}</td>
                      <td className="px-6 py-4 text-text-tertiary">{row.r1 === "✓" ? <Check className="w-4 h-4 text-green-500"/> : row.r1 === "✗" ? <X className="w-4 h-4 text-red-500"/> : row.r1}</td>
                      <td className="px-6 py-4 text-text-tertiary">{row.r2 === "✓" ? <Check className="w-4 h-4 text-green-500"/> : row.r2 === "✗" ? <X className="w-4 h-4 text-red-500"/> : row.r2}</td>
                      <td className="px-6 py-4 text-text-tertiary">{row.r3 === "✓" ? <Check className="w-4 h-4 text-green-500"/> : row.r3 === "✗" ? <X className="w-4 h-4 text-red-500"/> : row.r3}</td>
                      <td className="px-6 py-4 text-text-tertiary">{row.r4 === "✓" ? <Check className="w-4 h-4 text-green-500"/> : row.r4 === "✗" ? <X className="w-4 h-4 text-red-500"/> : row.r4}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-background-elevated/40 border border-border-slate/50 p-6 rounded-xl relative">
              <div className="text-xs font-bold uppercase tracking-widest text-text-tertiary mb-4">Pete's Recommendation</div>
              <blockquote className="text-text-primary italic text-lg leading-relaxed">
                "For most traders starting out: use the free plan for 3-6 months. If you find yourself annoyed by the single chart limitation or needing more indicators, Essential at ~£12/mo is the right upgrade. Plus is the sweet spot for active traders — 4 charts simultaneously and 100 alerts covers most real workflows. Premium is for professionals running systematic approaches who need second-level data and Volume Profile."
              </blockquote>
              <div className="mt-4 text-sm font-bold text-text-tertiary">— Pete Currey, Drawdown</div>
            </div>

            <div className="pt-2">
              <Link
                href="/go/tradingview"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex px-8 py-4 bg-mkt-ink text-white rounded-lg font-bold text-sm tracking-wide hover:bg-mkt-i2 transition-colors"
              >
                Start with the free plan →
              </Link>
              <p className="text-[10px] text-text-tertiary mt-2">Affiliate link — we may earn a commission at no cost to you.</p>
            </div>
          </section>
        </FadeInSection>
      </div> {/* End of max-w-4xl */}

      {/* SECTION: LIVE CHART DEMO */}
      <section className="bg-[#0A0A0A] py-16 lg:py-20 text-white w-full border-t border-b border-white/5 relative z-10">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center space-y-8">
          
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-widest text-gray-400 font-bold font-sans">
              LIVE CHART
            </span>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-white tracking-tight leading-tight">
              This is what you'll be working with.
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto font-sans leading-relaxed">
              Every example in the Drawdown curriculum is built on TradingView. This is GBP/USD on the 1-hour timeframe — exactly how we'd set it up for a London session analysis.
            </p>
          </div>

          {/* Chart Container */}
          <div className="mt-8 rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#0A0A0A] text-left">
            <div className="flex items-center justify-between px-4 h-11 bg-[#111111] border-b border-white/10 select-none">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C8F135] inline-block animate-pulse" />
                <span className="text-xs font-bold text-[#C8F135] uppercase tracking-wider font-mono">
                  LIVE
                </span>
                <span className="text-xs font-semibold text-white font-mono ml-1">
                  GBP/USD · 1H
                </span>
              </div>
              <div className="text-xs text-gray-600 font-sans">
                Powered by TradingView
              </div>
            </div>

            <div className="w-full h-[360px] lg:h-[520px]">
              <TradingViewChart symbol="FX:GBPUSD" className="h-full w-full" />
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <p className="text-gray-500 text-sm font-sans">
              ↑ This is a live, interactive chart. Click to change pairs, timeframes or add indicators.
            </p>
            <div>
              <Link
                href="/go/tradingview"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-2 border border-white/20 text-white rounded-lg text-sm hover:bg-white/5 transition font-semibold font-sans animate-none"
              >
                Try TradingView Free →
              </Link>
            </div>
            <p className="text-gray-600 text-xs font-sans">
              Affiliate link — commission earned on paid plan upgrades.
            </p>
          </div>

        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 pt-24">

        {/* SECTION 4: UK-SPECIFIC FEATURES */}
        <FadeInSection>
          <section id="uk-features" className="space-y-8 scroll-mt-24">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">UK TRADERS</span>
              <h2 className="text-3xl font-display font-bold text-text-primary">What UK spread bettors actually need to know.</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-background-surface/40 border border-border-slate/50 backdrop-blur-md p-6 rounded-xl">
                <h3 className="text-xl font-bold text-text-primary mb-3">UK Market Coverage</h3>
                <p className="text-text-tertiary leading-relaxed">
                  TradingView covers all UK spread betting instruments: FTSE 100 (UK100), FTSE 250 (UK250), GBP/USD, EUR/GBP, GBP/JPY and all major FX crosses, Gold (XAUUSD), Brent Crude (UKOIL), and the major US indices (SPX, NAS100, DJI). Real-time data for most instruments requires a Plus plan or above.
                </p>
              </div>

              <div className="bg-background-surface/40 border border-border-slate/50 backdrop-blur-md p-6 rounded-xl">
                <h3 className="text-xl font-bold text-text-primary mb-3">Broker Integration</h3>
                <p className="text-text-tertiary leading-relaxed">
                  TradingView integrates directly with several FCA-regulated brokers for direct-from-chart trading. Pepperstone and IG Markets both offer TradingView integration — meaning you can execute spread betting or CFD trades directly from your TradingView chart without switching platforms. This is the workflow most serious UK retail traders use.
                </p>
              </div>

              <div className="bg-background-surface/40 border border-border-slate/50 backdrop-blur-md p-6 rounded-xl">
                <h3 className="text-xl font-bold text-text-primary mb-3">No Additional Software Required</h3>
                <p className="text-text-tertiary leading-relaxed">
                  TradingView runs entirely in your browser. No download, no installation, no MT4 or MT5 required. This matters for UK spread bettors because IG Markets' own platform and the spread betting interface work better alongside a dedicated charting platform than trying to chart and trade in the same window.
                </p>
              </div>
            </div>

            {/* New Subsection: Technical Analysis */}
            <div className="pt-10 border-t border-border-slate/50 mt-10 space-y-6">
              <div className="text-left space-y-3">
                <h3 className="text-xl font-bold text-text-primary">
                  Technical Analysis — Built In
                </h3>
                <p className="text-sm md:text-base text-text-tertiary leading-relaxed">
                  TradingView's built-in Technical Analysis gauge aggregates signals from moving averages and oscillators across multiple timeframes. It's not a signal service — it's a useful secondary reference when forming your own view.
                </p>
              </div>
              <div className="max-w-sm mx-auto pt-4 border border-border-slate/50 rounded-xl overflow-hidden bg-background-surface/40 backdrop-blur-md">
                <TVTechnicalAnalysis />
              </div>
            </div>
          </section>
        </FadeInSection>

        {/* SECTION 5: PROS AND CONS */}
        <FadeInSection>
          <section className="space-y-8">
            <h2 className="text-3xl font-display font-bold text-text-primary">What we like — and what we don't.</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  PROS
                </h3>
                <ul className="space-y-3">
                  {[
                    "Best charting interface available at any price point",
                    "Pine Script is genuinely powerful for custom indicators",
                    "Social layer — millions of published analyses searchable",
                    "Browser-based — works on any device, no installation",
                    "Free plan is actually useful (not crippled like most)",
                    "Broker integration with IG and Pepperstone",
                    "Paper trading mode for strategy testing without risk",
                    "Active development — new features added regularly",
                    "Alert system is comprehensive even on free plan"
                  ].map((pro, i) => (
                    <li key={i} className="flex gap-3 text-text-tertiary text-sm">
                      <Check className="w-5 h-5 text-green-500 shrink-0" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <X className="w-5 h-5 text-red-600" />
                  </div>
                  CONS
                </h3>
                <ul className="space-y-3">
                  {[
                    "Real-time data requires paid plan (free = delayed)",
                    "Historical data depth limited on lower plans",
                    "Volume Profile locked to Plus plan and above",
                    "Second-based charts Premium only (most don't need this)",
                    "Social layer can be noisy — lots of low quality ideas",
                    "Pine Script has a learning curve for non-developers",
                    "Mobile app is functional but desktop is significantly better for serious analysis"
                  ].map((con, i) => (
                    <li key={i} className="flex gap-3 text-text-tertiary text-sm">
                      <X className="w-5 h-5 text-red-500 shrink-0" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </FadeInSection>

        {/* SECTION 6: HOW DRAWDOWN USES TRADINGVIEW */}
        <FadeInSection>
          <section className="space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">OUR WORKFLOW</span>
              <h2 className="text-3xl font-display font-bold text-text-primary">How we integrate TradingView into the Drawdown system.</h2>
            </div>
            <div className="prose prose-lg prose-neutral text-text-tertiary max-w-none">
              <p>
                Every example chart in the Drawdown curriculum is built on TradingView. When we reference price levels, structure, or setups in any course module, the chart is from TradingView. This means from Phase 1 onwards, you're learning to read charts in the same environment you'll use when you trade live.
              </p>
              <p>
                Our specific setup: TradingView Plus or Premium for multi-chart layouts (4 charts: 15m, 1H, 4H, Daily for the same instrument), clean charts with price action only (no indicators except volume), and direct connection to Pepperstone for execution. The AI Trade Journal on Drawdown runs alongside TradingView — we analyse trades in TradingView, log them in Drawdown.
              </p>
              <p>
                You don't need this setup to start. Free TradingView + free Drawdown account is a legitimate starting configuration that costs nothing.
              </p>
            </div>
          </section>
        </FadeInSection>
      </div>

      {/* SECTION 7: VERDICT + FINAL CTA */}
      <section className="mt-24 bg-[#0A0A0A] py-24 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white">Our verdict: use it.</h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            TradingView is the best charting platform available to retail traders. There is no credible alternative at any price point that matches its data coverage, indicator library, and social analysis layer. The free plan is a legitimate starting point. The paid plans are worth the cost once you know what you're doing.
            <br /><br />
            Start free. Upgrade when the limitations start to bother you. That's the right order.
          </p>

          <div className="flex flex-col items-center justify-center pt-4">
            <div className="text-6xl font-mono font-bold text-green-500 tracking-tight">4.9 <span className="text-3xl text-white/50">/ 5</span></div>
            <div className="flex gap-1 mt-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-6 h-6 ${i === 4 ? "text-green-500 fill-green-500 opacity-90" : "text-green-500 fill-green-500"}`} />
              ))}
            </div>
            <div className="text-sm font-bold uppercase tracking-widest text-white/50 mt-4">Drawdown Rating</div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 pt-8 max-w-lg mx-auto w-full">
            <Link
              href="/go/tradingview"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-white text-black font-semibold text-center rounded-lg hover:bg-gray-100 transition duration-200 text-sm font-sans"
            >
              Try TradingView Free →
            </Link>
            <Link
              href="/signup"
              className="px-8 py-3 border border-white/30 text-white font-semibold text-center rounded-lg hover:bg-white/5 transition duration-200 text-sm font-sans"
            >
              Start Drawdown Free →
            </Link>
          </div>

          <p className="text-gray-500 text-xs text-center mt-4 font-sans">
            Affiliate disclosure — we earn a commission on TradingView paid plan upgrades. Drawdown sign-up is always free.
          </p>
        </div>
      </section>

      {/* SECTION: INTERNAL LINKING STRIP */}
      <div className="bg-gray-50 border-t border-gray-200 py-8 select-none">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap gap-x-8 gap-y-2 items-center justify-start">
          <span className="text-xs uppercase tracking-widest text-gray-400 font-medium mr-4 font-sans">
            LIVE MARKET CHARTS:
          </span>
          <Link href="/markets/forex/eurusd" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-sans">
            EUR/USD Chart &rarr;
          </Link>
          <Link href="/markets/forex/gbpusd" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-sans">
            GBP/USD Chart &rarr;
          </Link>
          <Link href="/markets/commodities/gold" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-sans">
            Gold Chart &rarr;
          </Link>
          <Link href="/markets/indices/uk100" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-sans">
            FTSE 100 Chart &rarr;
          </Link>
          <Link href="/markets/crypto/bitcoin" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-sans">
            Bitcoin Chart &rarr;
          </Link>
          <Link href="/markets/forex/usdjpy" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-sans">
            USD/JPY Chart &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}
