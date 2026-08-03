"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Shield, 
  TrendingUp, 
  Terminal as TerminalIcon, 
  Scale, 
  ArrowRight, 
  CheckCircle, 
  ChevronDown, 
  HelpCircle, 
  FileText, 
  Database, 
  Cpu, 
  Coins, 
  Clock, 
  Users, 
  Layers, 
  Percent, 
  Activity, 
  Check 
} from "lucide-react";
import { TrackPageView } from "@/components/admin/TrackPageView";

// Curated 6-Week Course Curriculum Details
const WEEK_CURRICULUM = [
  {
    week: "Week 01",
    title: "Quantitative Edge Engineering",
    tagline: "Move beyond subjective chart reading to mathematical expectation.",
    modules: [
      "Defining strategy parameters with zero room for human discretion",
      "Manual and statistical backtesting frameworks in TradingView (defeating hindsight bias)",
      "Metrics engineering: expected value (EV), Profit Factor, and Drawdown probability distribution",
      "Monte Carlo Simulation: testing historical sequences against sequence luck"
    ],
    deliverable: "Submit your verified 100-trade backtest showing a positive expectancy model.",
    tool: "Drawdown Strategy Backtester & Monte Carlo Simulator"
  },
  {
    week: "Week 02",
    title: "Macroeconomic Bias & Catalysts",
    tagline: "Learn the systemic fundamental forces that shift structural trends.",
    modules: [
      "Central Bank Mechanics: yield curves, quantitative tightening, and interest rate policies",
      "Key indicators: CPI (inflation), GDP (growth), and employment reports (NFP)",
      "Asymmetric trading: modeling market pricing deviations from consensus surprises",
      "Commitment of Traders (COT): tracing hedge fund positioning via structural data"
    ],
    deliverable: "Construct your weekly macroeconomic directional bias report.",
    tool: "Drawdown Global News Terminals & Macro Sentiment Tracker"
  },
  {
    week: "Week 03",
    title: "Microstructure & Order Flow",
    tagline: "Learn to read inside candle footprints to trace institutional liquidity.",
    modules: [
      "Auction Market Theory: Limit Order Book (LOB) mechanics and imbalances",
      "Delta footprint charts: identifying buy/sell pressure and passive market absorption",
      "Liquidity Pools & Stop Runs: finding precise manipulation points on higher timeframes",
      "Tape Reading & Speed of Tape: execution strategies for microsecond entries"
    ],
    deliverable: "Execute entries using Footprint delta imbalances in live markets.",
    tool: "Drawdown Microstructure Delta & Volume Footprint Viewer"
  },
  {
    week: "Week 04",
    title: "Systematic Pine Script & AI Automation",
    tagline: "Eliminate emotional execution by codifying your technical edge.",
    modules: [
      "Pine Script Fundamentals: coding your core strategy rules into an automated indicator",
      "Multi-market screening: scripting real-time asset alerts and volume scanners",
      "Stripe & Webhook Integrations: routing TradingView signals straight to brokers",
      "AI journaling pipelines: parsing trading transcripts for performance anomalies"
    ],
    deliverable: "Deploy your first automated TradingView webhook-to-broker trade loop.",
    tool: "Drawdown AI Journal API & Pine Script Engine"
  },
  {
    week: "Week 05",
    title: "UK Prop Firm Challenge Accelerator",
    tagline: "Maximize capital allocation using professional risk defense limits.",
    modules: [
      "Prop Firm Landscapes: comparing FTMO, 5ers, and Funding Pips structures",
      "Challenge math: aligning position sizes to comfortably clear daily drawdown levels",
      "The Consistency Rule Shield: structuring volume to prevent payout rejections",
      "UK HMRC Tax Optimization: Sole Trader vs. Ltd Company structures for funded trading"
    ],
    deliverable: "Complete a simulated 14-day evaluation demo adhering to strict prop rules.",
    tool: "Drawdown Prop Risk Simulator & HMRC Tax Calculator"
  },
  {
    week: "Week 06",
    title: "Sovereign Wealth & Portfolio Scaling",
    tagline: "Convert speculative income into a tax-efficient long-term legacy.",
    modules: [
      "Speculative vs. Core Allocations: the transition from active trading to compounding wealth",
      "Core-Satellite Models: low-correlation investing (bonds, physical gold, global equities)",
      "UK Tax Shields: optimizing portfolio growth utilizing ISAs, SIPPs, and VCTs",
      "Systematic Rebalancing: compounding dividends and hedging multi-asset drawdowns"
    ],
    deliverable: "Present your personal sovereign wealth allocation plan for feedback.",
    tool: "Drawdown Portfolio Architecture & Rebalancing Tool"
  }
];

const FAQS = [
  {
    question: "What makes the Institutional Accelerator different from normal courses?",
    answer: "Most trading programs sell pre-recorded, recycled retail indicators (like support and resistance lines) that offer no mathematical edge. The Drawdown Accelerator is a live, cohort-based, 6-week intensive program that couples proprietary software access (Strategy Backtester, AI Journal, Order Flow Delta) with institutional quantitative theory, ending in complete business legal packs for UK tax structures."
  },
  {
    question: "Do I need programming experience for the Pine Script modules in Week 4?",
    answer: "No prior coding experience is required. We teach you Pine Script from absolute scratch using our pre-built code blocks. We also provide our custom GPT-powered scripting models to help you translate your visual rules into clean, automated execution code."
  },
  {
    question: "How does the conditional 14-Day Performance Guarantee work?",
    answer: "We are committed to helping serious traders achieve consistency. If you participate in the first two weeks and decide the program isn't right for you, we will issue a full refund—provided you submit your completed Week 1 backtesting logs showing 100 manual trades compiled using our statistical backtesting sheets. This protects our intellectual property while assuring your success."
  },
  {
    question: "Is this program compliant with UK FCA rules?",
    answer: "Yes. Drawdown Trading is an educational and technology provider. We do not offer financial advice, execute trades on your behalf, or manage capital. The legal modules in Week 5 & 6 are conducted for educational purposes to help you set up compliant corporate structures and understand HMRC-allowable tax shields."
  },
  {
    question: "What is the capital requirement to join?",
    answer: "The cohort itself costs £1,500 (or 3 monthly payments of £550). Outside of this, you do not need substantial trading capital; we specifically train you to leverage institutional prop firm capital (up to $200,000+) using our evaluation accelerators, meaning you can trade professionally without risking personal assets."
  }
];

export default function InstitutionalAccelerator() {
  const [activeWeek, setActiveWeek] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0B0E12] text-[#F3F4F6] font-display antialiased selection:bg-[#E2B755] selection:text-[#0B0E12]">
      <TrackPageView path="/institutional-accelerator" />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 border-b border-[#333330]/40 overflow-hidden">
        {/* Subtle decorative gold blur */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-[#E2B755]/5 blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 text-center">
          {/* Seats left alert badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E2B755]/10 border border-[#E2B755]/20 text-[#E2B755] text-xs font-semibold tracking-wide uppercase mb-6 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E2B755]" />
            September 2026 Cohort: Limited to 15 Seats
          </div>

          {/* Typography Header */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.1] max-w-4xl mx-auto">
            The Drawdown <br />
            <span className="bg-gradient-to-r from-[#E2B755] via-[#F3C475] to-[#C59235] bg-clip-text text-transparent">
              Institutional Accelerator
            </span>
          </h1>

          <p className="text-lg md:text-xl text-[#9CA3AF] max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            An intensive 6-week quantitative and macroeconomic coaching program designed for serious traders. Move away from retail guessing and build a systematic trading business.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="https://forms.gle/drawdown-accelerator-apply" 
              target="_blank"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-[#E2B755] to-[#C59235] hover:from-[#F3C475] hover:to-[#E2B755] text-[#0B0E12] font-semibold tracking-wide transition-all duration-300 shadow-lg shadow-[#E2B755]/10 hover:shadow-[#E2B755]/20 hover:scale-[1.02]"
            >
              Apply for Sept Cohort
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a 
              href="#syllabus" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-[#1F2937]/50 hover:bg-[#1F2937] border border-[#333330] text-white font-semibold tracking-wide transition-all duration-300"
            >
              Explore Study Plan
            </a>
          </div>

          {/* Social Proof metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mt-20 pt-8 border-t border-[#333330]/40">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">6 Weeks</div>
              <div className="text-xs md:text-sm text-[#9CA3AF]">Live Cohort Intensive</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">15 Slots</div>
              <div className="text-xs md:text-sm text-[#9CA3AF]">Strict Cap per Intake</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-[#E2B755] mb-1">£600+</div>
              <div className="text-xs md:text-sm text-[#9CA3AF]">Proprietary Software Included</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">HMRC</div>
              <div className="text-xs md:text-sm text-[#9CA3AF]">Legal Company Templates</div>
            </div>
          </div>
        </div>
      </section>

      {/* The Confrontational retail narrative */}
      <section className="py-20 md:py-28 border-b border-[#333330]/40 bg-[#07090D]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-semibold tracking-widest text-[#E2B755] uppercase mb-3">The Retail Illusion</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">Why Standard Trading Courses Fail</h3>
            <p className="text-[#9CA3AF] leading-relaxed font-light">
              Most online courses sell a fantasy of drawing arbitrary diagonal lines on a screen and clicking buttons next to a beach. In reality, retail tools are lagging and lack mathematical validation, leaving you exposed to systematic market sweeps.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Retail box */}
            <div className="p-8 rounded-xl bg-[#111317]/50 border border-red-500/10 hover:border-red-500/20 transition-all duration-300">
              <div className="inline-flex p-3 rounded-lg bg-red-500/10 text-red-400 mb-6">
                <Scale className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-4">Retail Discretionary Trading</h4>
              <ul className="space-y-3 text-sm text-[#9CA3AF]">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold mt-0.5">✕</span>
                  Relying on subjective geometric patterns (wedges, retail channels)
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold mt-0.5">✕</span>
                  No mathematical backtesting or sequence stress testing
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold mt-0.5">✕</span>
                  Glued to the screens with intense emotional micro-management
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold mt-0.5">✕</span>
                  No understanding of interest rate policies, CPI, or market delta
                </li>
              </ul>
            </div>

            {/* Institutional box */}
            <div className="p-8 rounded-xl bg-[#111317]/50 border border-[#E2B755]/10 hover:border-[#E2B755]/20 transition-all duration-300">
              <div className="inline-flex p-3 rounded-lg bg-[#E2B755]/10 text-[#E2B755] mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-4">Quantitative Systematic Strategy</h4>
              <ul className="space-y-3 text-sm text-[#9CA3AF]">
                <li className="flex items-start gap-3">
                  <span className="text-[#E2B755] font-bold mt-0.5">✓</span>
                  Rigorous statistical verification with expected win-rate metrics
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#E2B755] font-bold mt-0.5">✓</span>
                  Top-down macrodirectional bias aligned to Central Bank cycles
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#E2B755] font-bold mt-0.5">✓</span>
                  Automated Pine Script webhook alerts to eliminate execution errors
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#E2B755] font-bold mt-0.5">✓</span>
                  UK HMRC tax-structured legal entities for scaling payouts safely
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Timeline */}
      <section id="syllabus" className="py-20 md:py-28 border-b border-[#333330]/40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-semibold tracking-widest text-[#E2B755] uppercase mb-3">Syllabus Overview</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">The 6-Week Interactive Roadmap</h3>
            <p className="text-[#9CA3AF] font-light">
              Explore the intensive schedule from ground-zero expectancy, deep liquidity footprints, automated code engineering, and sovereign portfolio structures.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Timeline selector (Left) */}
            <div className="lg:col-span-4 space-y-3">
              {WEEK_CURRICULUM.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setActiveWeek(index)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-300 border ${
                    activeWeek === index 
                      ? "bg-gradient-to-r from-[#1E1E1E] to-[#111317] border-[#E2B755]/40 shadow-md shadow-[#E2B755]/5" 
                      : "bg-[#111317]/20 border-[#333330]/20 hover:bg-[#111317]/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-[#E2B755] tracking-widest uppercase">{item.week}</span>
                    {activeWeek === index && <span className="w-1.5 h-1.5 rounded-full bg-[#E2B755]" />}
                  </div>
                  <h4 className="text-base font-bold text-white">{item.title}</h4>
                </button>
              ))}
            </div>

            {/* Timeline Details Display (Right) */}
            <div className="lg:col-span-8 p-8 md:p-10 rounded-2xl bg-[#111317]/60 border border-[#333330]/30 min-h-[420px] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase bg-[#E2B755]/10 border border-[#E2B755]/20 text-[#E2B755] rounded">
                    {WEEK_CURRICULUM[activeWeek].week} Plan
                  </span>
                  <span className="text-xs text-[#9CA3AF]">Live Cohort Workshop & Tasks</span>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {WEEK_CURRICULUM[activeWeek].title}
                </h3>
                <p className="text-sm text-[#9CA3AF] mb-6 italic font-light">
                  "{WEEK_CURRICULUM[activeWeek].tagline}"
                </p>

                <h5 className="text-xs font-semibold tracking-wider text-white uppercase mb-3">Core Modules:</h5>
                <ul className="space-y-3 mb-8">
                  {WEEK_CURRICULUM[activeWeek].modules.map((mod, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#D1D5DB]">
                      <span className="text-[#E2B755] font-semibold mt-0.5">•</span>
                      {mod}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-[#333330]/40 grid md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="block text-[#9CA3AF] mb-1 uppercase font-semibold tracking-wider">Required Milestone:</span>
                  <span className="text-[#D1D5DB] font-medium">{WEEK_CURRICULUM[activeWeek].deliverable}</span>
                </div>
                <div>
                  <span className="block text-[#E2B755] mb-1 uppercase font-semibold tracking-wider">Proprietary Tooling:</span>
                  <span className="text-white font-medium">{WEEK_CURRICULUM[activeWeek].tool}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* High-Value Deliverables Grid */}
      <section className="py-20 md:py-28 border-b border-[#333330]/40 bg-[#07090D]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-semibold tracking-widest text-[#E2B755] uppercase mb-3">Comprehensive Value Stack</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Premium Deliverables Included</h3>
            <p className="text-[#9CA3AF] font-light">
              We package live mentorship with specialized UK compliance assets, custom software terminals, and AI audits.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Box 1 */}
            <div className="p-6 rounded-xl bg-[#111317]/50 border border-[#333330]/20 hover:border-[#E2B755]/30 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-lg bg-[#E2B755]/10 text-[#E2B755]">
                  <Cpu className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-white">AI Trade-Journal Audits</h4>
              </div>
              <p className="text-sm text-[#9CA3AF] leading-relaxed mb-4">
                Your trades are scanned and audited by our custom LLM modeling agent. You receive a structured "Monthly Blindspot Analysis" revealing trading-psychology triggers, size slippage, and optimal hour variances.
              </p>
              <span className="text-xs font-semibold text-[#E2B755] tracking-wide uppercase">Value: £500 / Year</span>
            </div>

            {/* Box 2 */}
            <div className="p-6 rounded-xl bg-[#111317]/50 border border-[#333330]/20 hover:border-[#E2B755]/30 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-lg bg-[#E2B755]/10 text-[#E2B755]">
                  <TerminalIcon className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-white">12-Month Drawdown Terminal Access</h4>
              </div>
              <p className="text-sm text-[#9CA3AF] leading-relaxed mb-4">
                Gain complete access to the **Drawdown Investment Centre Terminal** including our custom Strategy Backtesting Suite, Monte Carlo stress simulators, and global macro alerts.
              </p>
              <span className="text-xs font-semibold text-[#E2B755] tracking-wide uppercase">Value: £600 (Included)</span>
            </div>

            {/* Box 3 */}
            <div className="p-6 rounded-xl bg-[#111317]/50 border border-[#333330]/20 hover:border-[#E2B755]/30 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-lg bg-[#E2B755]/10 text-[#E2B755]">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-white">HMRC Compliant Legal Pack</h4>
              </div>
              <p className="text-sm text-[#9CA3AF] leading-relaxed mb-4">
                A professional, solicitor-approved corporate structure bundle for UK prop firm traders. Includes template articles of association for setting up a Limited Company to receive funded withdrawals under corporate tax rules.
              </p>
              <span className="text-xs font-semibold text-[#E2B755] tracking-wide uppercase">Value: £450 (Included)</span>
            </div>

            {/* Box 4 */}
            <div className="p-6 rounded-xl bg-[#111317]/50 border border-[#333330]/20 hover:border-[#E2B755]/30 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-lg bg-[#E2B755]/10 text-[#E2B755]">
                  <Coins className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-white">1-on-1 Portfolio Consultation</h4>
              </div>
              <p className="text-sm text-[#9CA3AF] leading-relaxed mb-4">
                A private 45-minute portfolio structuring consultation directly with founder Pete Currey. Review your speculative trading distributions and legally transition them into tax-sheltered wealth shields (ISAs, SIPPs).
              </p>
              <span className="text-xs font-semibold text-[#E2B755] tracking-wide uppercase">Value: £350 (Included)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Card & Guarantee */}
      <section className="py-20 md:py-28 relative">
        <div className="absolute inset-0 bg-[#E2B755]/2 blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl mx-auto rounded-2xl bg-gradient-to-b from-[#1A1A1A] to-[#111317] border border-[#E2B755]/30 p-8 md:p-12 shadow-xl shadow-[#E2B755]/5">
            <div className="grid md:grid-cols-12 gap-8 items-center">
              {/* Left pricing info */}
              <div className="md:col-span-7">
                <span className="text-xs font-bold text-[#E2B755] tracking-widest uppercase block mb-2">Accelerator Enrolment</span>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Secure September Cohort Access</h3>
                <p className="text-sm text-[#9CA3AF] leading-relaxed mb-6 font-light">
                  Secure your seat in our next 15-student live cohort. Under the mentorship of founder Pete Currey, you will receive active trade audits, prop evaluation templates, tax packs, and 12 months of full software licensing.
                </p>

                {/* Conditional Guarantee box */}
                <div className="p-4 rounded-lg bg-[#E2B755]/5 border border-[#E2B755]/10 text-xs text-[#D1D5DB] flex gap-3">
                  <Shield className="w-5 h-5 text-[#E2B755] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block mb-1">14-Day Performance Guarantee</span>
                    Participate in the first 2 weeks. If you decide the material isn't right, get a 100% refund upon submitting your completed Week 1 backtesting logs.
                  </div>
                </div>
              </div>

              {/* Right pricing callout */}
              <div className="md:col-span-5 text-center md:border-l border-[#333330]/40 md:pl-8">
                <div className="text-xs text-[#9CA3AF] uppercase font-semibold mb-1">Single Payment Plan</div>
                <div className="text-4xl md:text-5xl font-black text-white mb-2">£1,500</div>
                <div className="text-xs text-[#E2B755] mb-6">Or 3 monthly payments of £550</div>

                <Link 
                  href="https://forms.gle/drawdown-accelerator-apply" 
                  target="_blank"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-gradient-to-r from-[#E2B755] to-[#C59235] hover:from-[#F3C475] hover:to-[#E2B755] text-[#0B0E12] font-semibold text-sm tracking-wider transition-all duration-300"
                >
                  Apply to Enrol
                </Link>

                <div className="text-[10px] text-[#9CA3AF] mt-3">
                  Strictly limited to 15 seats. Secure registration.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accordion FAQ */}
      <section className="py-20 md:py-28 bg-[#07090D] border-t border-[#333330]/40">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-xs font-semibold tracking-widest text-[#E2B755] uppercase mb-3">FAQ Support</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div 
                key={index} 
                className="rounded-xl border border-[#333330]/20 bg-[#111317]/40 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left text-white font-bold hover:bg-[#111317]/80 transition-all duration-300"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-[#E2B755] shrink-0" />
                    {faq.question}
                  </span>
                  <ChevronDown 
                    className={`w-5 h-5 text-[#9CA3AF] transition-transform duration-300 ${openFaq === index ? "rotate-180" : ""}`} 
                  />
                </button>

                {openFaq === index && (
                  <div className="p-5 pt-0 text-sm text-[#9CA3AF] leading-relaxed border-t border-[#333330]/20 bg-[#111317]/20">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
