"use client";

import { phases as allPhases, CoursePhase } from "@/data/courses";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { 
  ChevronRight, 
  Clock, 
  Layers, 
  ShieldCheck, 
  Target, 
  Zap, 
  CheckCircle2, 
  BookOpen,
  ArrowRight,
  Sparkles,
  HelpCircle,
  ChevronDown
} from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { useState } from "react";

interface PhaseGroupConfig {
  slug: string;
  badge: string;
  badgeStyle: string;
  title: string;
  subtitle: string;
  heroTagline: string;
  description: string;
  phaseIds: number[];
  outcomes: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
}

const GROUP_CONFIGS: Record<string, PhaseGroupConfig> = {
  "phase-1-2": {
    slug: "phase-1-2",
    badge: "PHASE 1–2 • FOUNDATION CURRICULUM",
    badgeStyle: "text-indigo-700 bg-indigo-50 border-indigo-200",
    title: "Ground Zero & Chart Reader",
    subtitle: "Master Market Geometry & Naked Price Action",
    heroTagline: "The essential starting point for retail traders transitioning to institutional discipline.",
    description: "Phases 1 & 2 establish your core analytical engine. Unlearn retail bad habits, understand market participants, master spread betting risk math, and read raw price action through market structure and liquidity zones.",
    phaseIds: [1, 2],
    outcomes: [
      { title: "Risk Math Survival", desc: "Calculate position sizes relative to drawdown limits with 0% risk of account ruin." },
      { title: "Naked Price Action", desc: "Identify institutional footprint, liquidity pools, and market geometry without lagging indicators." },
      { title: "Market Structure", desc: "Read break of structure (BOS), change of character (CHoCH), and multi-timeframe trends." },
      { title: "Execution Routine", desc: "Establish a professional pre-market scanning routine and trading environment." }
    ],
    faqs: [
      { q: "Is Phase 1 really free?", a: "Yes. Phase 1 (Ground Zero) is 100% free with no credit card or account registration required." },
      { q: "Do I need prior trading experience?", a: "No. Ground Zero is designed from first principles for absolute beginners and reset-seeking traders." },
      { q: "How long do Phases 1 & 2 take to complete?", a: "Approximately 12.5 total hours of direct video curriculum plus practice exercises." }
    ]
  },
  "phase-3-4": {
    slug: "phase-3-4",
    badge: "PHASE 3–4 • EDGE & RISK CURRICULUM",
    badgeStyle: "text-emerald-700 bg-emerald-50 border-emerald-200",
    title: "Strategist & Risk Manager",
    subtitle: "Build Mechanical Edge & Mathematical Survival",
    heroTagline: "Transform price action understanding into a systematic, statistical trading edge.",
    description: "Phases 3 & 4 turn discretionary chart reading into a mechanical execution ruleset. Define entry protocols, pullback rules, stop placements, Kelly sizing, and correlation risk models to build long-term profitability.",
    phaseIds: [3, 4],
    outcomes: [
      { title: "Mechanical Playbook", desc: "Define rigid entry, exit, and stop management rules for breakout and retest setups." },
      { title: "Statistical Backtesting", desc: "Simulate and verify strategy expectancy, win-rate, and profit factor over 1,000+ trades." },
      { title: "Kelly & Position Sizing", desc: "Deploy institutional position sizing formulas that scale capital while protecting equity." },
      { title: "Correlation Shield", desc: "Manage multi-asset risk to prevent compounding losses across correlated pairs." }
    ],
    faqs: [
      { q: "Which tier unlocks Phases 3 & 4?", a: "Phases 3 & 4 are included in our Foundation and Edge membership tiers." },
      { q: "Can I apply these setups to FX and Equities?", a: "Yes. All mechanical rulesets are instrument-agnostic and work across Forex, Indices, Gold, and Crypto." },
      { q: "Do I get access to the AI Risk Calculator?", a: "Yes. Active members get full access to our proprietary risk tools." }
    ]
  },
  "phase-5-6": {
    slug: "phase-5-6",
    badge: "PHASE 5–6 • SYSTEMATIC & PSYCHOLOGY CURRICULUM",
    badgeStyle: "text-rose-700 bg-rose-50 border-rose-200",
    title: "The Backtester & Mind Over Market",
    subtitle: "Master Strategy Expectancy & Advanced Psychology",
    heroTagline: "Establish your mathematical edge and master the emotional resilience needed to execute it.",
    description: "Phases 5 & 6 bridge the gap between discretionary chart reading and professional execution. Rigorously backtest your strategy rules to verify statistical expectancy, and build the psychological discipline to execute your edge flawlessly under drawdown.",
    phaseIds: [5, 6],
    outcomes: [
      { title: "Statistical Expectancy", desc: "Prove your strategy's win rate, profit factor, and return distribution over 1,000+ simulated trades." },
      { title: "Monte Carlo Stress-Testing", desc: "Simulate worst-case losing streaks against randomized trade sequences to verify survival." },
      { title: "Cognitive Bias Control", desc: "Identify and conquer FOMO, revenge trading, and winning/losing streak psychological traps." },
      { title: "Discipline Routine", desc: "Establish rigid pre-market and post-trade performance routines of elite institutional traders." }
    ],
    faqs: [
      { q: "Which tier covers Phases 5 & 6?", a: "Phases 5 & 6 are accessible on our Edge and Floor membership tiers." },
      { q: "Is the AI Backtester included?", a: "Yes. You get full instructions and integration guides for Drawdown's custom AI backtesting tool." },
      { q: "Why is backtesting placed here?", a: "Because statistical edge-verification must come immediately after core risk metrics, before attempting live or prop trading." }
    ]
  }
};

export function PhaseGroupLandingPageClient({ slug }: { slug: string }) {
  const config = GROUP_CONFIGS[slug] || GROUP_CONFIGS["phase-1-2"];
  const groupPhases = allPhases.filter(p => config.phaseIds.includes(p.id));
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const totalModules = groupPhases.reduce((acc, p) => acc + p.modules_count, 0);

  return (
    <div className="pt-28 pb-24 bg-white text-slate-900 min-h-screen">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-slate-50 via-white to-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumbs />
          
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <span className={cn("inline-flex items-center gap-2 px-3 py-1 text-xs font-mono font-bold uppercase tracking-widest border rounded-full", config.badgeStyle)}>
                <Sparkles className="w-3.5 h-3.5" />
                {config.badge}
              </span>

              <h1 className="text-4xl md:text-6xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
                {config.title}
              </h1>

              <p className="text-lg md:text-xl font-sans font-medium text-slate-700 leading-relaxed">
                {config.subtitle}
              </p>

              <p className="text-base text-slate-600 leading-relaxed font-sans">
                {config.description}
              </p>

              {/* Stats Strip */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                <div>
                  <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">// Course Phases</p>
                  <p className="text-xl font-display font-bold text-slate-900 mt-1">{groupPhases.map(p => `Phase ${p.number}`).join(" & ")}</p>
                </div>
                <div>
                  <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">// Total Modules</p>
                  <p className="text-xl font-display font-bold text-slate-900 mt-1">{totalModules} Modules</p>
                </div>
                <div>
                  <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">// Access Level</p>
                  <p className="text-xl font-display font-bold text-emerald-600 mt-1">{groupPhases[0]?.tier} Tier</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  href={config.phaseIds.includes(1) ? "/courses/ground-zero" : "/signup"}
                  className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-sans font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  {config.phaseIds.includes(1) ? "Start Phase 1 Free" : "Enrol in Curriculum"}
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/courses"
                  className="px-8 py-4 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-sans font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
                >
                  View All 6 Phases
                </Link>
              </div>
            </div>

            {/* Right Feature Card */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)] space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">// Phase Group Overview</span>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold rounded-full uppercase">UK Verified</span>
                </div>

                <div className="space-y-4">
                  {groupPhases.map((phase) => (
                    <Link key={phase.id} href={`/courses/${phase.slug}`} className="group block p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/40 transition-all">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono font-bold text-indigo-600 uppercase">Phase {phase.number}</span>
                        <span className="text-xs font-sans text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {phase.duration}</span>
                      </div>
                      <h4 className="text-base font-sans font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center justify-between">
                        {phase.name}
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-all group-hover:translate-x-1" />
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{phase.description}</p>
                    </Link>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs font-sans text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Includes full module video breakdowns, rulesets & test quizzes.</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PHASE DEEP DIVE CARDS */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest">// PHASE MODULE BREAKDOWN</span>
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            Detailed Curriculum Included in {config.title}
          </h2>
          <p className="text-sm text-slate-600 font-sans">
            Click any phase to view its dedicated course page and full module list.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {groupPhases.map((phase) => (
            <div key={phase.id} className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-slate-900 text-white text-xs font-mono font-bold rounded-md">
                    PHASE {phase.number}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500 uppercase">{phase.duration}</span>
                </div>

                <h3 className="text-2xl font-display font-bold text-slate-900 mb-1">{phase.name}</h3>
                <p className="text-xs font-mono text-indigo-600 uppercase tracking-wider mb-4">{phase.subtitle}</p>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">{phase.full_description}</p>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6">
                  <h4 className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-600" /> Key Included Modules ({phase.modules_count})
                  </h4>
                  <ul className="space-y-2">
                    {phase.modules_list.slice(0, 6).map((mod, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs font-sans text-slate-700">
                        <span className="font-mono text-indigo-600 font-bold shrink-0">{(idx + 1).toString().padStart(2, "0")}</span>
                        <span>{mod}</span>
                      </li>
                    ))}
                    {phase.modules_list.length > 6 && (
                      <li className="text-xs font-mono text-indigo-600 pt-1 font-semibold">
                        + {phase.modules_list.length - 6} additional modules in full syllabus
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              <Link
                href={`/courses/${phase.slug}`}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-sans font-bold text-xs uppercase tracking-widest rounded-xl transition-all text-center flex items-center justify-center gap-2"
              >
                View Dedicated {phase.name} Course Page
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT YOU WILL ACHIEVE */}
      <section className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest">// LEARNING OUTCOMES</span>
            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
              What You Will Master in This Phase Group
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {config.outcomes.map((item, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-mono font-bold text-sm">
                  0{idx + 1}
                </div>
                <h4 className="text-base font-sans font-bold text-slate-900">{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INSTRUCTOR BIO */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col lg:flex-row items-center gap-10">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-slate-800 border-2 border-indigo-500/30 overflow-hidden shrink-0 flex items-center justify-center text-4xl font-display font-bold text-indigo-400">
            PC
          </div>
          <div className="space-y-4 text-center lg:text-left">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">// YOUR INSTRUCTOR</span>
            <h3 className="text-2xl md:text-3xl font-display font-bold text-white">Pete Currey — Lead Trader & Founder</h3>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              "Drawdown was built to eliminate retail financial noise. My goal is to teach you how financial markets actually function, how institutions position order flow, and how to protect your capital with rigorous mathematical discipline."
            </p>
            <div className="flex flex-wrap gap-4 pt-2 justify-center lg:justify-start text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 10+ Years Trading Experience</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> UK Tax & Spread Betting Specialist</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQS SECTION */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-6 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest">// FREQUENTLY ASKED QUESTIONS</span>
            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-slate-900">
              Common Questions About {config.title}
            </h2>
          </div>

          <div className="space-y-4">
            {config.faqs.map((faq, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left font-sans font-bold text-sm text-slate-900 flex items-center justify-between gap-4"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", openFaq === idx && "rotate-180")} />
                </button>
                {openFaq === idx && (
                  <div className="p-5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 font-sans">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 max-w-7xl mx-auto px-6 text-center">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-10 md:p-16 space-y-6 shadow-2xl relative overflow-hidden">
          <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest block">// READY TO BEGIN</span>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight">
            Start Your Journey Through {config.title}
          </h2>
          <p className="text-base text-slate-300 max-w-2xl mx-auto font-sans">
            Access our structured 6-phase curriculum. Join hundreds of disciplined UK traders building real market edge.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              href="/signup"
              className="px-10 py-5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-sans font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl flex items-center gap-2"
            >
              Create Free Account
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/pricing"
              className="px-10 py-5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-sans font-bold text-xs uppercase tracking-widest rounded-xl transition-all"
            >
              View Membership Pricing
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
