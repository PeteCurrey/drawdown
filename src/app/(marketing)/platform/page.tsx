"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, ArrowRight, Brain, Calculator, Scan, LineChart, Newspaper, MessageSquare, Video, ShieldCheck, Activity } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { StructuredData } from "@/components/StructuredData";
import { FadeInSection } from "@/components/animations/FadeInSection";

export default function PlatformPage() {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["WebPage", "Organization"],
    name: "Drawdown Trading Platform",
    url: "https://drawdown.trading/platform",
    description: "Live market intelligence, AI-powered trading tools, and structured education.",
  };

  const faqs = [
    {
      q: "Is Drawdown a course or a platform?",
      a: "Both, and that's the distinction that matters. It's a platform — which means it's a live, ongoing product that you log into, use daily, and get value from even after you've completed the curriculum. The courses are one component of the platform. The tools, the market intelligence, the community, and The Wire are the others. Most 'trading courses' go dark after you buy them. Drawdown is something you use every trading day."
    },
    {
      q: "Do I need to complete the courses to use the tools?",
      a: "No. The tools are available from day one of your subscription. Many members use the Risk Calculator and Trade Journal before they've finished Phase 1. The curriculum teaches you how to use the tools properly — but you don't need to wait."
    },
    {
      q: "Is there a mobile app?",
      a: "The platform is fully responsive and works on mobile browsers. A dedicated iOS and Android app is in development and will be available to all subscribers at no additional cost when released."
    },
    {
      q: "How is this different from just using TradingView?",
      a: "TradingView is a charting platform. Drawdown is an education and intelligence platform. They serve different purposes — we actually recommend TradingView for charting and integrate with it directly. Drawdown provides the education, the risk tools, the AI analysis, the market context, and the community that TradingView doesn't provide."
    },
    {
      q: "Can I access the platform on multiple devices?",
      a: "Yes. Your subscription is tied to your account, not a device. Log in from any browser on any device. Your Trade Journal, watchlist, and settings sync automatically."
    },
    {
      q: "Is there a free trial of the paid tiers?",
      a: "Phase 1 and the core tools (Trade Journal, Risk Calculator, The Wire) are free permanently with no credit card required. This gives you genuine access to evaluate the platform before committing to a paid tier. There is no time-limited trial of Foundation or Edge — instead, the free tier is designed to be genuinely useful on its own."
    }
  ];

  return (
    <div className="flex flex-col bg-background-primary text-text-primary font-sans">
      <StructuredData type="WebSite" data={jsonLd} />

      {/* SECTION 1: PAGE HERO */}
      <section className="py-16 md:py-24 border-b border-border-slate/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl space-y-8">
            <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-widest block">
              // THE PLATFORM
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
              Everything serious traders need. In one place.
            </h1>
            <p className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl">
              Live intelligence. AI tools. Structured education. A community that doesn't tolerate guru nonsense. Drawdown is a complete trading operating system — not another course.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/signup" className="px-8 py-4 rounded-lg bg-mkt-ink text-mkt-bg font-bold text-sm hover:bg-mkt-i2 transition-colors flex items-center gap-2">
                Start Free — No Card Required <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/pricing" className="px-8 py-4 rounded-lg border border-border-slate/50 text-text-primary font-bold text-sm hover:border-border-slate transition-colors flex items-center gap-2">
                See Pricing <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-8 border-t border-border-slate/30">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <CheckCircle2 className="w-4 h-4 text-mkt-grn shrink-0" />
                <span>Full platform access from £49/month</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <CheckCircle2 className="w-4 h-4 text-mkt-grn shrink-0" />
                <span>Phase 1 free forever — no credit card</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <CheckCircle2 className="w-4 h-4 text-mkt-grn shrink-0" />
                <span>Cancel anytime, no minimum term</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: PLATFORM OVERVIEW */}
      <FadeInSection>
        <section className="py-16 md:py-24 bg-[#F7F7F7] border-b border-border-slate/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16">
              <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-widest block mb-4">
                // WHAT YOU GET
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                Four pillars. One subscription.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Block 1 */}
              <div className="relative p-8 md:p-10 bg-white border border-border-slate/50 rounded-[20px] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 group overflow-hidden">
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-[20px]">
                  <div className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out opacity-[0.06] scale-[1.03] group-hover:opacity-[0.18] group-hover:scale-100" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop)` }} />
                </div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-full bg-[rgba(29,78,216,0.04)] text-blue-600 flex items-center justify-center mb-6">
                    <Activity className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Live Market Intelligence</h3>
                  <p className="text-text-secondary leading-relaxed mb-8">
                    A real-time market hub updated every 60 seconds. Aggregated from Bloomberg, Reuters, FT, and institutional sources. Economic calendar, top movers, volatility windows, and institutional consensus data — all in one dashboard. The kind of intelligence retail traders don't usually have access to.
                  </p>
                  <Link href="/markets" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
                    Explore Markets <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Block 2 */}
              <div className="relative p-8 md:p-10 bg-white border border-border-slate/50 rounded-[20px] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 group overflow-hidden">
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-[20px]">
                  <div className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out opacity-[0.06] scale-[1.03] group-hover:opacity-[0.18] group-hover:scale-100" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop)` }} />
                </div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-full bg-[rgba(124,58,237,0.04)] text-purple-600 flex items-center justify-center mb-6">
                    <Brain className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">AI-Powered Trading Tools</h3>
                  <p className="text-text-secondary leading-relaxed mb-8">
                    Five purpose-built AI tools that do real work. The Trade Journal detects emotional patterns in your trading history. The Risk Calculator sizes positions precisely. The Market Scanner identifies confluence across 40+ instruments. The Backtester tests your edge against 3 years of historical data. These aren't generic AI wrappers — they're built specifically for traders.
                  </p>
                  <a href="#ai-tools" className="inline-flex items-center gap-2 text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors">
                    See the tools <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Block 3 */}
              <div className="relative p-8 md:p-10 bg-white border border-border-slate/50 rounded-[20px] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 group overflow-hidden">
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-[20px]">
                  <div className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out opacity-[0.06] scale-[1.03] group-hover:opacity-[0.18] group-hover:scale-100" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop)` }} />
                </div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-full bg-[rgba(22,163,74,0.04)] text-green-600 flex items-center justify-center mb-6">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Structured Trading Education</h3>
                  <p className="text-text-secondary leading-relaxed mb-8">
                    Six phases. 60+ modules. A curriculum built in the order you actually need it — risk management first, chart reading second, psychology throughout. Not the order that makes a good marketing brochure. Every phase has clear outcomes and connects directly to the tools you'll use on your own account.
                  </p>
                  <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-bold text-green-600 hover:text-green-700 transition-colors">
                    View the curriculum <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Block 4 */}
              <div className="relative p-8 md:p-10 bg-white border border-border-slate/50 rounded-[20px] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 group overflow-hidden">
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-[20px]">
                  <div className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out opacity-[0.06] scale-[1.03] group-hover:opacity-[0.18] group-hover:scale-100" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop)` }} />
                </div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-full bg-[rgba(217,119,6,0.04)] text-amber-600 flex items-center justify-center mb-6">
                    <Newspaper className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">The Wire — Daily Intelligence Brief</h3>
                  <p className="text-text-secondary leading-relaxed mb-8">
                    A curated market briefing at 7am and 4:30pm GMT. What's moving, why it's moving, and what to watch in the next session. Sent to your inbox every trading day. Free for all registered users — no subscription required.
                  </p>
                  <Link href="/signup" className="inline-flex items-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors">
                    Subscribe free <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* SECTION 3: AI TOOLS */}
      <FadeInSection>
        <section id="ai-tools" className="py-16 md:py-24 bg-[#0A0A0A] text-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-3xl mb-16">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest block mb-4">
                // AI TOOLS
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-8">
                Built for traders. Not built for demos.
              </h2>
              <p className="text-lg text-neutral-400 leading-relaxed">
                Every AI tool on this platform was designed around a specific failure mode that causes retail traders to lose money. The Trade Journal exists because emotional pattern blindness destroys accounts. The Risk Calculator exists because position sizing errors are the second most common cause of account blowouts. These aren't features added to make the platform look impressive — they're responses to real problems.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  name: "AI Trade Journal",
                  badge: "FREE",
                  badgeColor: "bg-neutral-800 text-neutral-300",
                  icon: <Brain className="w-8 h-8 text-purple-400" />,
                  desc: "Log every trade — entry, exit, rationale, emotional state at entry. The AI analyses your journal over time to identify patterns you can't see yourself: revenge trading cycles, overtrading after wins, hesitation after losses, session-time performance variance. Most traders who use this for 30 days discover at least one structural behaviour pattern they were completely unaware of.",
                  feature: "Pattern detection across 6 emotional trading categories"
                },
                {
                  name: "Risk Calculator",
                  badge: "FREE",
                  badgeColor: "bg-neutral-800 text-neutral-300",
                  icon: <Calculator className="w-8 h-8 text-blue-400" />,
                  desc: "Input your account size, risk percentage, entry price, and stop loss distance. The calculator outputs exact position size in lots or units, potential loss in currency, risk-to-reward ratio, and projected impact on account if the trade loses. Works for forex, indices, commodities, and crypto. Removes the mental arithmetic that causes errors under live market conditions.",
                  feature: "Real-time calculation across 12 asset classes"
                },
                {
                  name: "AI Market Scanner",
                  badge: "EDGE+",
                  badgeColor: "bg-accent/20 text-accent",
                  icon: <Scan className="w-8 h-8 text-green-400" />,
                  desc: "Scans 40+ instruments across multiple timeframes simultaneously, identifying technical confluence: trend alignment, key structure levels, and momentum conditions. Outputs a ranked watchlist by confluence strength. Replaces 2-3 hours of manual chart analysis each morning. Not a signal service — it identifies candidates for your own analysis.",
                  feature: "40+ instruments, 4 timeframe confluence analysis"
                },
                {
                  name: "Strategy Backtester",
                  badge: "EDGE+",
                  badgeColor: "bg-accent/20 text-accent",
                  icon: <LineChart className="w-8 h-8 text-amber-400" />,
                  desc: "Define your strategy rules in plain language: entry conditions, stop loss logic, take profit targets, session filters. The backtester runs your rules against 3 years of historical OHLC data and outputs win rate, expectancy, maximum drawdown, profit factor, and Sharpe ratio. Know whether your strategy has a genuine edge before risking capital on it.",
                  feature: "3 years of historical data, 12 performance metrics"
                },
                {
                  name: "Daily Intelligence Brief",
                  badge: "FREE",
                  badgeColor: "bg-neutral-800 text-neutral-300",
                  icon: <Newspaper className="w-8 h-8 text-rose-400" />,
                  desc: "Assembled from aggregated institutional data, economic calendar events, and overnight price action. Delivered to your inbox at 7:00am GMT before the London session opens, and at 4:30pm GMT as the London session closes and the US session takes over. Subscribers get this regardless of paid tier — it's part of what makes Drawdown worth bookmarking.",
                  feature: "Morning and afternoon sessions, 7 days per week"
                }
              ].map((tool, idx) => (
                <div key={idx} className="flex flex-col md:flex-row gap-8 p-8 md:p-10 border border-neutral-800 rounded-[20px] bg-neutral-900/50 hover:bg-neutral-900 transition-colors">
                  <div className="md:w-1/3 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-neutral-800 pb-6 md:pb-0 md:pr-8">
                    {tool.icon}
                    <div>
                      <h3 className="text-xl font-bold">{tool.name}</h3>
                      <span className={cn("inline-block mt-2 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest", tool.badgeColor)}>
                        {tool.badge}
                      </span>
                    </div>
                  </div>
                  <div className="md:w-2/3 flex flex-col justify-center">
                    <p className="text-neutral-400 leading-relaxed mb-6">{tool.desc}</p>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent" /> {tool.feature}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* SECTION 4: LIVE INTELLIGENCE */}
      <FadeInSection>
        <section className="py-16 md:py-24 bg-white border-b border-border-slate/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16">
              <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-widest block mb-4">
                // LIVE INTELLIGENCE
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                The data layer that makes the platform different.
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6 text-lg text-text-secondary leading-relaxed">
                <p>
                  Most trading platforms give you a chart and a buy button. Drawdown gives you context.
                </p>
                <p>
                  The market intelligence hub aggregates data from institutional sources — the same feeds that professional trading desks monitor. Economic calendar events with impact ratings. Real-time COT (Commitment of Traders) data showing what hedge funds and institutions are positioned in. Dark pool activity indicators. Volatility windows across major FX pairs, commodities, and indices.
                </p>
                <p>
                  The difference between a retail trader and a professional isn't strategy — it's context. Professionals know what the macro environment is, where institutions are positioned, and what events are on the calendar before they place a single trade. Now you do too.
                </p>
                <div className="pt-6">
                  <Link href="/markets" className="px-8 py-4 rounded-lg bg-mkt-ink text-white font-bold text-sm hover:bg-mkt-i2 transition-colors inline-flex items-center gap-2">
                    Open the Markets Hub <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              
              <div className="bg-background-surface/40 p-8 rounded-[20px] border border-border-slate/50">
                <ul className="space-y-6">
                  {[
                    "Real-time FX, commodities, crypto and index prices",
                    "Economic calendar with high/medium/low impact ratings",
                    "Institutional sentiment index (COT-derived)",
                    "Institutional consensus positioning — 4 major assets",
                    "Six-hour volatility windows per instrument",
                    "Live news feed aggregated from 8 institutional sources",
                    "Top movers — 1H, 4H, and daily timeframes"
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-4 items-start">
                      <CheckCircle2 className="w-6 h-6 text-mkt-grn shrink-0" />
                      <span className="font-bold text-text-primary">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* SECTION 5: COMMUNITY */}
      <FadeInSection>
        <section className="py-16 md:py-24 bg-[#F7F7F7] border-b border-border-slate/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
              <div>
                <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-widest block mb-4">
                  // COMMUNITY
                </span>
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-8">
                  A community of traders who've stopped pretending.
                </h2>
                <p className="text-lg text-text-secondary leading-relaxed mb-6">
                  Every paid tier includes access to the Drawdown community Discord. This is not a signals chat. It's not a place to post your winning trades for dopamine. It's a working community of traders who are building real edges, sharing real analysis, and holding each other accountable to the same standard the curriculum teaches.
                </p>
                <p className="text-lg text-text-secondary leading-relaxed">
                  Pete is active in the community. Questions get answered by someone who actually trades — not a community manager reading from a script.
                </p>
              </div>
              <div className="space-y-6">
                {[
                  { title: "Trading Journal Reviews", icon: <MessageSquare className="w-5 h-5 text-blue-600" />, desc: "Post your trade journal for community review. Get honest feedback on your edge, your risk management, and your decision-making process.", img: "https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=800&auto=format&fit=crop" },
                  { title: "Weekly Market Analysis Sessions", icon: <Video className="w-5 h-5 text-purple-600" />, desc: "Edge and Floor members get live market analysis sessions during the London session. Recorded for replay if you can't attend live.", img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop" },
                  { title: "No Signal Sharing. No Copy Trading.", icon: <ShieldCheck className="w-5 h-5 text-green-600" />, desc: "The community is explicitly not a place to share trade signals. We develop independent traders, not copy traders. This is a rule, not a preference.", img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop" }
                ].map((card, idx) => (
                  <div key={idx} className="relative p-6 bg-white border border-border-slate/50 rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:-translate-y-0.5">
                    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-xl">
                      <div className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out opacity-[0.03] scale-[1.03] group-hover:opacity-[0.12] group-hover:scale-100" style={{ backgroundImage: `url(${card.img})` }} />
                    </div>
                    <div className="relative z-10 flex gap-4">
                      <div className="mt-1">{card.icon}</div>
                      <div>
                        <h4 className="font-bold mb-2 text-text-primary">{card.title}</h4>
                        <p className="text-sm text-text-secondary leading-relaxed">{card.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* SECTION 6: TIER COMPARISON */}
      <FadeInSection>
        <section className="py-16 md:py-24 bg-white border-b border-border-slate/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-widest block mb-4">
                // ACCESS TIERS
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                Start free. Scale when you're ready.
              </h2>
            </div>

            <div className="w-full overflow-x-auto pb-8">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="border-b border-border-slate/50">
                    <th className="p-4 font-bold text-text-secondary">Feature</th>
                    <th className="p-4 font-bold text-center">Free</th>
                    <th className="p-4 font-bold text-center">Foundation <span className="block text-xs font-normal text-text-tertiary">£49/mo</span></th>
                    <th className="p-4 font-bold text-center text-accent">Edge <span className="block text-xs font-normal">£149/mo</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-slate/30">
                  {[
                    { label: "Phase 1", free: true, fnd: true, edge: true },
                    { label: "Phases 2-4", free: false, fnd: true, edge: true },
                    { label: "Phases 5-6", free: false, fnd: false, edge: true },
                    { label: "Trade Journal", free: true, fnd: true, edge: true },
                    { label: "Risk Calc", free: true, fnd: true, edge: true },
                    { label: "Market Scanner", free: false, fnd: false, edge: true },
                    { label: "Backtester", free: false, fnd: false, edge: true },
                    { label: "The Wire", free: true, fnd: true, edge: true },
                    { label: "Community", free: false, fnd: true, edge: true },
                    { label: "Live alerts", free: false, fnd: false, edge: true },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-background-surface/30 transition-colors">
                      <td className="p-4 text-sm font-medium">{row.label}</td>
                      <td className="p-4 text-center">{row.free ? <CheckCircle2 className="w-5 h-5 text-mkt-grn mx-auto" /> : <span className="text-text-tertiary text-sm">✗</span>}</td>
                      <td className="p-4 text-center">{row.fnd ? <CheckCircle2 className="w-5 h-5 text-mkt-grn mx-auto" /> : <span className="text-text-tertiary text-sm">✗</span>}</td>
                      <td className="p-4 text-center">{row.edge ? <CheckCircle2 className="w-5 h-5 text-accent mx-auto" /> : <span className="text-text-tertiary text-sm">✗</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap justify-center gap-4 pt-8">
              <Link href="/signup" className="px-8 py-4 rounded-lg bg-mkt-ink text-mkt-bg font-bold text-sm hover:bg-mkt-i2 transition-colors flex items-center gap-2">
                Start Free — No Card Required <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/pricing" className="px-8 py-4 rounded-lg border border-border-slate/50 text-text-primary font-bold text-sm hover:border-border-slate transition-colors flex items-center gap-2">
                See full pricing breakdown <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* SECTION 7: FAQ */}
      <FadeInSection>
        <section className="py-16 md:py-24 bg-[#F7F7F7]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-3xl mb-12">
              <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-widest block mb-4">
                // FAQ
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                Questions about the platform.
              </h2>
            </div>

            <div className="max-w-4xl border-t border-border-slate/50">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-border-slate/50">
                  <button
                    onClick={() => setOpenFaqIdx(openFaqIdx === i ? null : i)}
                    className="w-full text-left py-6 flex items-center justify-between group"
                  >
                    <span className="font-bold text-lg text-text-primary group-hover:text-mkt-ink transition-colors pr-8">
                      {faq.q}
                    </span>
                    <ChevronDown 
                      className={cn("w-5 h-5 text-text-tertiary transition-transform duration-300 shrink-0", openFaqIdx === i ? "rotate-180" : "")} 
                    />
                  </button>
                  <div 
                    className={cn(
                      "overflow-hidden transition-all duration-300 ease-in-out",
                      openFaqIdx === i ? "max-h-96 opacity-100 pb-6" : "max-h-0 opacity-0"
                    )}
                  >
                    <p className="text-text-secondary leading-relaxed pr-12">
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>
    </div>
  );
}
