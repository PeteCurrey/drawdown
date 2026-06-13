import { Check, X, ChevronDown, Leaf, RefreshCw, Trophy } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function SectionA() {
  return (
    <section className="mb-24">
      <span className="text-[11px] font-sans font-bold text-text-tertiary uppercase tracking-widest block mb-4">
        // THE DIFFERENCE
      </span>
      <h2 className="text-3xl md:text-5xl font-sans font-extrabold tracking-tight text-text-primary mb-10 leading-tight max-w-3xl">
        Most trading education is broken. Here&apos;s why ours isn&apos;t.
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 border border-border-slate/50 rounded-[14px] bg-background-surface">
          <h3 className="text-xl font-sans font-bold mb-6 text-text-secondary">YouTube & Free Content</h3>
          <ul className="space-y-4 font-sans text-sm text-text-tertiary">
            <li className="flex items-start gap-3"><X className="w-5 h-5 text-loss shrink-0 mt-0.5" /> Random order, no structure</li>
            <li className="flex items-start gap-3"><X className="w-5 h-5 text-loss shrink-0 mt-0.5" /> Contradictory advice from different creators</li>
            <li className="flex items-start gap-3"><X className="w-5 h-5 text-loss shrink-0 mt-0.5" /> No accountability, no progression</li>
            <li className="flex items-start gap-3"><X className="w-5 h-5 text-loss shrink-0 mt-0.5" /> Entertainment disguised as education</li>
            <li className="flex items-start gap-3"><X className="w-5 h-5 text-loss shrink-0 mt-0.5" /> Zero context on risk management</li>
          </ul>
        </div>
        <div className="p-8 border border-border-slate/50 rounded-[14px] bg-background-surface">
          <h3 className="text-xl font-sans font-bold mb-6 text-text-secondary">Typical Paid Courses</h3>
          <ul className="space-y-4 font-sans text-sm text-text-tertiary">
            <li className="flex items-start gap-3"><X className="w-5 h-5 text-loss shrink-0 mt-0.5" /> One-time purchase, no ongoing support</li>
            <li className="flex items-start gap-3"><X className="w-5 h-5 text-loss shrink-0 mt-0.5" /> Guru-led with lifestyle marketing</li>
            <li className="flex items-start gap-3"><X className="w-5 h-5 text-loss shrink-0 mt-0.5" /> Static content, never updated</li>
            <li className="flex items-start gap-3"><X className="w-5 h-5 text-loss shrink-0 mt-0.5" /> No tools, no community</li>
            <li className="flex items-start gap-3"><X className="w-5 h-5 text-loss shrink-0 mt-0.5" /> £500-£2,000 upfront with no trial</li>
          </ul>
        </div>
        <div className="p-8 border border-profit/30 rounded-[14px] bg-profit/5 shadow-[0_0_30px_rgba(0,230,118,0.05)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-profit/10 blur-[40px] rounded-full pointer-events-none" />
          <h3 className="text-xl font-sans font-bold mb-6 text-text-primary">Drawdown</h3>
          <ul className="space-y-4 font-sans text-sm text-text-primary relative z-10">
            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-profit shrink-0 mt-0.5" /> Phase-based progression with clear outcomes</li>
            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-profit shrink-0 mt-0.5" /> Built by a trader, not a marketer</li>
            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-profit shrink-0 mt-0.5" /> AI tools integrated throughout</li>
            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-profit shrink-0 mt-0.5" /> Community + mentorship at every tier</li>
            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-profit shrink-0 mt-0.5" /> Start free — Phase 1 costs nothing</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export function SectionB() {
  return (
    <section className="mb-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 border border-border-slate/50 rounded-[14px] bg-background-surface flex flex-col h-full">
          <Leaf className="w-8 h-8 text-profit mb-6" />
          <span className="text-[10px] font-mono font-bold text-text-tertiary uppercase tracking-widest mb-2">Complete Beginners</span>
          <p className="font-sans text-sm text-text-secondary leading-relaxed mb-6 flex-grow">
            You&apos;ve heard about trading. Maybe you&apos;ve opened a demo account and lost money immediately. You don&apos;t know where to start and everything online seems designed to sell you something.
          </p>
          <Link href="/signup" className="group flex items-center font-sans text-sm font-bold text-text-primary hover:text-profit transition-colors pt-4 border-t border-border-slate/50">
            Start at Phase 1 — Ground Zero is built for you <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        <div className="p-8 border border-border-slate/50 rounded-[14px] bg-background-surface flex flex-col h-full">
          <RefreshCw className="w-8 h-8 text-accent mb-6" />
          <span className="text-[10px] font-mono font-bold text-text-tertiary uppercase tracking-widest mb-2">Self-Taught Traders Who Are Losing</span>
          <p className="font-sans text-sm text-text-secondary leading-relaxed mb-6 flex-grow">
            You&apos;ve been at this for a while. You&apos;ve read books, watched YouTube, maybe paid for a course. But your account is going backwards and you can&apos;t work out why.
          </p>
          <Link href="/signup" className="group flex items-center font-sans text-sm font-bold text-text-primary hover:text-accent transition-colors pt-4 border-t border-border-slate/50">
            Phase 3 Risk Manager and Phase 5 Psychology are where most self-taught traders find the gap <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        <div className="p-8 border border-border-slate/50 rounded-[14px] bg-background-surface flex flex-col h-full">
          <Trophy className="w-8 h-8 text-amber-500 mb-6" />
          <span className="text-[10px] font-mono font-bold text-text-tertiary uppercase tracking-widest mb-2">Experienced Traders Targeting Prop Capital</span>
          <p className="font-sans text-sm text-text-secondary leading-relaxed mb-6 flex-grow">
            You have an edge. You&apos;re consistently profitable on a personal account. Now you want to scale with funded capital but keep failing evaluations.
          </p>
          <Link href="/signup" className="group flex items-center font-sans text-sm font-bold text-text-primary hover:text-amber-500 transition-colors pt-4 border-t border-border-slate/50">
            Phase 6 Prop Ready is built specifically for this <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function SectionC() {
  return (
    <section className="mb-24 -mx-6 px-6 py-20 bg-[#0A0A0A] border-y border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row gap-12 items-start">
        <div className="w-full md:w-5/12 shrink-0">
          <blockquote className="text-3xl md:text-4xl font-sans font-medium italic text-white leading-tight">
            "I built Drawdown because I couldn't find a trading education platform I'd actually recommend to someone I cared about."
          </blockquote>
        </div>
        <div className="w-full md:w-7/12 border-l-2 border-profit pl-6 md:pl-10 space-y-6">
          <p className="text-neutral-400 font-sans text-lg leading-relaxed">
            Every platform I found was either built to sell you something — a course, a signal service, a broker referral — or was so academically dry it was useless in practice. The curriculum here is built in the order I wish I'd been taught. Not the order that makes a good marketing brochure.
          </p>
          <p className="text-neutral-400 font-sans text-lg leading-relaxed">
            Phase 1 is psychology and risk because that's what actually kills accounts. Chart reading comes second because it's useless without the foundation. Every phase exists because I personally traded through the lesson it teaches.
          </p>
          <p className="text-xs font-mono font-bold text-white uppercase tracking-widest pt-4">
            — Pete Currey, Founder, Drawdown
          </p>
        </div>
      </div>
    </section>
  );
}

export function SectionD() {
  const outcomes = [
    { num: "01", text: "Understand why most traders fail before they start. Set up a professional trading environment. Know your risk tolerance. Begin journaling your decision-making." },
    { num: "02", text: "Read a chart without indicators. Identify structure, liquidity zones, and supply/demand levels. See what institutional traders see." },
    { num: "03", text: "Build a mechanical trading strategy with defined entry, stop loss, and target rules. Backtest it properly. Know your edge statistics." },
    { num: "04", text: "Calculate precise position sizes for any account size and instrument. Never blow an account on a single trade again. Understand compounding." },
    { num: "05", text: "Identify your emotional trading triggers. Break revenge trading cycles. Maintain discipline during drawdown periods. Trade like a professional." },
    { num: "06", text: "Apply for and pass a prop firm evaluation. Manage funded capital at scale. Integrate AI tools into your workflow." },
  ];

  return (
    <section className="mb-24 mt-32">
      <h2 className="text-3xl font-sans font-extrabold tracking-tight text-text-primary mb-12">What you&apos;ll be able to do</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0 border-t border-border-slate/50">
        {outcomes.map((item, i) => (
          <div key={i} className="py-8 border-b border-border-slate/50 flex gap-6">
            <span className="text-2xl font-sans font-black text-text-tertiary">Phase {item.num}</span>
            <p className="font-sans text-text-secondary leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SectionE() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs = [
    {
      q: "How long does each phase take?",
      a: "Phase 1 typically takes 2-3 weeks at a comfortable pace. The full curriculum from Phase 1 to 6 is designed for 6-9 months of serious study alongside active demo trading. There are no deadlines — your subscription remains active and you progress at your own pace."
    },
    {
      q: "Do I need any prior trading experience?",
      a: "None. Phase 1 starts from absolute zero. If you've traded before, the early modules will reframe things you thought you knew — most experienced traders find this the most valuable part."
    },
    {
      q: "Is this suitable for UK spread betting?",
      a: "Yes. The curriculum covers spread betting specifically — the tax advantages, the specific mechanics, and the broker selection process for UK residents. This is one area where Drawdown is specifically stronger than US-focused trading education."
    },
    {
      q: "What's the difference between Foundation, Edge, and Floor tiers?",
      a: "Foundation gives you Phases 1-4 and the core AI tools. Edge adds Phases 5-6, advanced scanning, backtesting, and live market alerts. Floor adds direct 1-to-1 access with Pete — monthly sessions and portfolio review. Phase 1 is always free with no credit card required."
    },
    {
      q: "Can I cancel my subscription at any time?",
      a: "Yes. No minimum term, no cancellation fees. Cancel from your account settings and billing stops at the end of your current month."
    },
    {
      q: "Are there live trading sessions?",
      a: "Edge and Floor members get access to live market analysis sessions. The schedule is posted in the community Discord in advance."
    },
    {
      q: "Do you provide trade signals?",
      a: "No. Drawdown is an education platform, not a signal service. We teach you to generate your own signals using your own tested edge. Signal services create dependency — we create independence."
    },
    {
      q: "Is this suitable for forex, indices, crypto, or all?",
      a: "The curriculum is asset-class agnostic. The principles — risk management, price action, psychology — apply to any liquid market. Examples throughout the course use forex, gold, indices, and crypto. UK spread betting examples use FTSE, GBP pairs, and gold."
    },
    {
      q: "Is the content updated?",
      a: "Core curriculum modules are reviewed annually. Market analysis content, broker reviews, and prop firm data are updated continuously."
    },
    {
      q: "What if I get stuck or have questions?",
      a: "All paid tiers include Discord community access where Pete and other members answer questions. Floor members have direct access to Pete for 1-to-1 support."
    }
  ];

  return (
    <section className="mb-24">
      <span className="text-[11px] font-sans font-bold text-text-tertiary uppercase tracking-widest block mb-4">
        // FAQ
      </span>
      <h2 className="text-3xl font-sans font-extrabold tracking-tight text-text-primary mb-10">Frequently Asked Questions</h2>
      <div className="border-t border-border-slate/50">
        {faqs.map((faq, i) => (
          <div key={i} className="border-b border-border-slate/50">
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className="w-full text-left py-6 flex items-center justify-between group"
            >
              <span className="font-sans font-bold text-text-primary group-hover:text-accent transition-colors pr-8">
                {faq.q}
              </span>
              <ChevronDown 
                className={cn("w-5 h-5 text-text-tertiary transition-transform duration-300 shrink-0", openIdx === i ? "rotate-180" : "")} 
              />
            </button>
            <div 
              className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                openIdx === i ? "max-h-96 opacity-100 pb-6" : "max-h-0 opacity-0"
              )}
            >
              <p className="font-sans text-sm text-text-secondary leading-relaxed pr-12">
                {faq.a}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
