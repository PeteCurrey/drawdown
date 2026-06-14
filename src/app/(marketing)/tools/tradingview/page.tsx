import { Metadata } from "next";
import Link from "next/link";
import { Check, X, Star } from "lucide-react";
import { StructuredData } from "@/components/StructuredData";
import { FadeInSection } from "@/components/animations/FadeInSection";

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
      <section className="bg-mkt-bg pt-16 pb-12 md:pt-24 md:pb-16 border-b border-mkt-bd">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-mkt-i3">
              TOOL REVIEW
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-mkt-ink tracking-tight leading-tight">
              TradingView — The Honest Review for UK Traders.
            </h1>
            <p className="text-lg text-mkt-i3 max-w-2xl mx-auto">
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
              className="w-full sm:w-auto px-8 py-4 bg-white border border-mkt-bd text-mkt-ink rounded-lg font-bold text-sm tracking-wide hover:bg-neutral-50 transition-colors"
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 pt-16">
        
        {/* SECTION 2: WHAT IS TRADINGVIEW */}
        <FadeInSection>
          <section className="space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-mkt-i3">OVERVIEW</span>
              <h2 className="text-3xl font-display font-bold text-mkt-ink">What is TradingView?</h2>
            </div>
            <div className="prose prose-lg prose-neutral text-mkt-i3 max-w-none">
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
                <div key={i} className="p-4 bg-white border border-mkt-bd rounded-xl">
                  <div className="text-2xl font-bold text-mkt-ink">{stat.val}</div>
                  <div className="text-xs text-mkt-i3 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>
        </FadeInSection>

        {/* SECTION 3: FREE VS PAID */}
        <FadeInSection>
          <section className="space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-mkt-i3">PLANS</span>
              <h2 className="text-3xl font-display font-bold text-mkt-ink">Free plan or paid? Here's the honest answer.</h2>
            </div>
            <p className="text-lg text-mkt-i3">
              Most TradingView reviews tell you to go Pro immediately. We don't think that's right. The free plan is genuinely useful for a significant portion of retail traders. Here's exactly what you get and where the limitations start to matter.
            </p>

            <div className="overflow-x-auto rounded-xl border border-mkt-bd">
              <table className="w-full text-sm text-left">
                <thead className="bg-neutral-50 text-mkt-ink border-b border-mkt-bd">
                  <tr>
                    <th className="px-6 py-4 font-bold">Feature</th>
                    <th className="px-6 py-4 font-bold">Free</th>
                    <th className="px-6 py-4 font-bold">Essential ~£12/mo</th>
                    <th className="px-6 py-4 font-bold">Plus ~£22/mo</th>
                    <th className="px-6 py-4 font-bold">Premium ~£46/mo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mkt-bd bg-white">
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
                      <td className="px-6 py-4 font-medium text-mkt-ink">{row.f}</td>
                      <td className="px-6 py-4 text-mkt-i3">{row.r1 === "✓" ? <Check className="w-4 h-4 text-green-500"/> : row.r1 === "✗" ? <X className="w-4 h-4 text-red-500"/> : row.r1}</td>
                      <td className="px-6 py-4 text-mkt-i3">{row.r2 === "✓" ? <Check className="w-4 h-4 text-green-500"/> : row.r2 === "✗" ? <X className="w-4 h-4 text-red-500"/> : row.r2}</td>
                      <td className="px-6 py-4 text-mkt-i3">{row.r3 === "✓" ? <Check className="w-4 h-4 text-green-500"/> : row.r3 === "✗" ? <X className="w-4 h-4 text-red-500"/> : row.r3}</td>
                      <td className="px-6 py-4 text-mkt-i3">{row.r4 === "✓" ? <Check className="w-4 h-4 text-green-500"/> : row.r4 === "✗" ? <X className="w-4 h-4 text-red-500"/> : row.r4}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-neutral-50 border border-mkt-bd p-6 rounded-xl relative">
              <div className="text-xs font-bold uppercase tracking-widest text-mkt-i3 mb-4">Pete's Recommendation</div>
              <blockquote className="text-mkt-ink italic text-lg leading-relaxed">
                "For most traders starting out: use the free plan for 3-6 months. If you find yourself annoyed by the single chart limitation or needing more indicators, Essential at ~£12/mo is the right upgrade. Plus is the sweet spot for active traders — 4 charts simultaneously and 100 alerts covers most real workflows. Premium is for professionals running systematic approaches who need second-level data and Volume Profile."
              </blockquote>
              <div className="mt-4 text-sm font-bold text-mkt-i3">— Pete Currey, Drawdown</div>
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
              <p className="text-[10px] text-mkt-i4 mt-2">Affiliate link — we may earn a commission at no cost to you.</p>
            </div>
          </section>
        </FadeInSection>

        {/* SECTION 4: UK-SPECIFIC FEATURES */}
        <FadeInSection>
          <section id="uk-features" className="space-y-8 scroll-mt-24">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-mkt-i3">UK TRADERS</span>
              <h2 className="text-3xl font-display font-bold text-mkt-ink">What UK spread bettors actually need to know.</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white border border-mkt-bd p-6 rounded-xl">
                <h3 className="text-xl font-bold text-mkt-ink mb-3">UK Market Coverage</h3>
                <p className="text-mkt-i3 leading-relaxed">
                  TradingView covers all UK spread betting instruments: FTSE 100 (UK100), FTSE 250 (UK250), GBP/USD, EUR/GBP, GBP/JPY and all major FX crosses, Gold (XAUUSD), Brent Crude (UKOIL), and the major US indices (SPX, NAS100, DJI). Real-time data for most instruments requires a Plus plan or above.
                </p>
              </div>

              <div className="bg-white border border-mkt-bd p-6 rounded-xl">
                <h3 className="text-xl font-bold text-mkt-ink mb-3">Broker Integration</h3>
                <p className="text-mkt-i3 leading-relaxed">
                  TradingView integrates directly with several FCA-regulated brokers for direct-from-chart trading. Pepperstone and IG Markets both offer TradingView integration — meaning you can execute spread betting or CFD trades directly from your TradingView chart without switching platforms. This is the workflow most serious UK retail traders use.
                </p>
              </div>

              <div className="bg-white border border-mkt-bd p-6 rounded-xl">
                <h3 className="text-xl font-bold text-mkt-ink mb-3">No Additional Software Required</h3>
                <p className="text-mkt-i3 leading-relaxed">
                  TradingView runs entirely in your browser. No download, no installation, no MT4 or MT5 required. This matters for UK spread bettors because IG Markets' own platform and the spread betting interface work better alongside a dedicated charting platform than trying to chart and trade in the same window.
                </p>
              </div>
            </div>
          </section>
        </FadeInSection>

        {/* SECTION 5: PROS AND CONS */}
        <FadeInSection>
          <section className="space-y-8">
            <h2 className="text-3xl font-display font-bold text-mkt-ink">What we like — and what we don't.</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-mkt-ink flex items-center gap-2">
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
                    <li key={i} className="flex gap-3 text-mkt-i3 text-sm">
                      <Check className="w-5 h-5 text-green-500 shrink-0" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-mkt-ink flex items-center gap-2">
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
                    <li key={i} className="flex gap-3 text-mkt-i3 text-sm">
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
              <span className="text-[10px] font-mono uppercase tracking-widest text-mkt-i3">OUR WORKFLOW</span>
              <h2 className="text-3xl font-display font-bold text-mkt-ink">How we integrate TradingView into the Drawdown system.</h2>
            </div>
            <div className="prose prose-lg prose-neutral text-mkt-i3 max-w-none">
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

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <div className="flex flex-col items-center">
              <Link
                href="/go/tradingview"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-10 py-5 bg-white text-black rounded-lg font-bold text-sm tracking-wide hover:bg-neutral-200 transition-colors"
              >
                Try TradingView Free →
              </Link>
              <p className="text-[10px] text-white/40 mt-2">Affiliate link — we may earn a commission at no cost to you.</p>
            </div>
            <Link
              href="/platform"
              className="w-full sm:w-auto px-10 py-5 border border-white/20 text-white rounded-lg font-bold text-sm tracking-wide hover:bg-white/5 transition-colors mt-[-24px] sm:mt-0 sm:mb-[24px]"
            >
              Back to all tools →
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
