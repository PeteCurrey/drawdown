"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight, CheckCircle2, Clock, Zap, BookOpen,
  TrendingUp, Terminal, Radio, Shield,
} from "lucide-react";

const MODULES = [
  { num: "01", title: "Your First Script on TradingView",  desc: "Where the code goes, how to open the Pine Script Editor, and how to add your strategy to any chart.", mins: 15, icon: BookOpen  },
  { num: "02", title: "Reading Backtest Results Like a Pro", desc: "The five stats that actually matter, why win rate is a lie on its own, and how to spot an overfitted result.", mins: 20, icon: TrendingUp },
  { num: "03", title: "Automating Your Alerts",             desc: "How TradingView alerts work, setting up your first webhook, and connecting to TradersPost.", mins: 20, icon: Radio      },
  { num: "04", title: "Running Python Backtests",           desc: "Install Python in 10 minutes, run your backtest script, and read the terminal output confidently.", mins: 25, icon: Terminal   },
  { num: "05", title: "Going Live — Brokers, APIs & Risk",  desc: "The honest truth about live algo trading, choosing a broker with an API, and your pre-live checklist.", mins: 20, icon: Shield     },
];

const WHO = [
  "Just generated your first Pine Script and have no idea what to do next",
  "Want to understand what your backtest results actually mean",
  "Ready to move from manual to semi-automated trading",
];

const INCLUDED = [
  "5 focused modules (~100 minutes total)",
  "Instant access — start immediately after purchase",
  "Lifetime access + free updates",
  "Works standalone or alongside your Floor tier",
  "Pine Script AND Python paths covered",
];

export default function DeployYourAlgoPage() {
  const router  = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleBuy() {
    setBusy(true);
    try {
      const res  = await fetch("/api/courses/checkout", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ courseSlug: "deploy-your-algo" }),
      });
      const data = await res.json();
      if (data.alreadyOwned)  { router.push(data.redirectUrl); return; }
      if (data.granted)       { router.push(data.redirectUrl); return; }
      if (data.checkoutUrl)   { window.location.href = data.checkoutUrl; return; }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-white/5">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#C8F135]/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 py-24 md:py-36 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#C8F135]/30 bg-[#C8F135]/5">
            <Zap className="w-3 h-3 text-[#C8F135]" />
            <span className="text-[10px] font-mono text-[#C8F135] uppercase tracking-widest">Mini Course // Algo Deployment</span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-black uppercase leading-none tracking-tight">
            Deploy Your<br />
            <span className="text-[#C8F135]">Algo</span>
          </h1>

          <p className="text-lg md:text-xl text-white/60 max-w-xl leading-relaxed">
            You've generated your Pine Script. Now what? Five modules.
            No fluff. Exact steps from generated code to live chart.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              onClick={handleBuy}
              disabled={busy}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#C8F135] text-black font-bold text-sm rounded-xl hover:bg-[#b8e020] active:scale-95 transition-all disabled:opacity-60"
            >
              {busy ? "Loading…" : <>Buy Now — £97 <ArrowRight className="w-4 h-4" /></>}
            </button>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white/60 font-bold text-sm rounded-xl hover:border-white/40 hover:text-white/80 transition-all"
            >
              Floor Members — Included Free
            </Link>
          </div>

          <p className="text-[11px] font-mono text-white/30 uppercase tracking-widest">
            One-time payment · Instant access · No subscription required
          </p>
        </div>
      </section>

      {/* ── MODULES ──────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20 space-y-10">
        <div className="space-y-2">
          <p className="text-[10px] font-mono text-[#C8F135] uppercase tracking-widest">What You'll Learn</p>
          <h2 className="font-display text-3xl md:text-4xl font-black uppercase">Five Modules. Zero Filler.</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {MODULES.map((m) => (
            <div key={m.num} className="p-6 bg-white/3 border border-white/8 rounded-2xl hover:border-[#C8F135]/30 transition-all group space-y-3">
              <div className="flex items-start justify-between">
                <span className="text-[#C8F135] font-black font-mono text-sm">{m.num}</span>
                <span className="flex items-center gap-1 text-[10px] font-mono text-white/30">
                  <Clock className="w-3 h-3" />{m.mins} min
                </span>
              </div>
              <div>
                <h3 className="font-display font-bold text-base uppercase text-white group-hover:text-[#C8F135] transition-colors leading-tight">{m.title}</h3>
                <p className="mt-1.5 text-sm text-white/50 leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
          {/* Total card */}
          <div className="p-6 bg-[#C8F135]/5 border border-[#C8F135]/20 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#C8F135]/10 border border-[#C8F135]/30 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 text-[#C8F135]" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-[#C8F135] uppercase tracking-widest mb-0.5">Total Runtime</p>
              <p className="text-2xl font-black font-mono text-white">~100 min</p>
              <p className="text-xs text-white/40">15 lessons across 5 modules</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ─────────────────────────────────────────── */}
      <section className="border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6 py-20 space-y-10">
          <div className="space-y-2">
            <p className="text-[10px] font-mono text-[#C8F135] uppercase tracking-widest">Who It's For</p>
            <h2 className="font-display text-3xl font-black uppercase">This Course Is For You If…</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {WHO.map((w, i) => (
              <div key={i} className="p-6 bg-white/3 border border-white/8 rounded-xl space-y-3">
                <span className="w-8 h-8 rounded-full bg-[#C8F135]/10 border border-[#C8F135]/20 flex items-center justify-center text-[#C8F135] font-black font-mono text-xs">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm text-white/70 leading-relaxed">{w}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PETE'S NOTE ──────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="p-8 bg-white/3 border border-white/8 rounded-2xl border-l-4 border-l-[#C8F135] space-y-4">
          <p className="text-base md:text-lg text-white/80 leading-relaxed italic">
            "I built this because the algo tool generates great code but leaves you staring at it.
            This course is the missing manual — the five things I wish someone had told me before I
            spent three hours clicking around TradingView wondering where to paste it."
          </p>
          <p className="text-[11px] font-mono text-[#C8F135] uppercase tracking-widest">
            — Pete Currey, Founder // Drawdown
          </p>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────── */}
      <section className="border-t border-white/5">
        <div className="max-w-2xl mx-auto px-6 py-24 space-y-10">
          <div className="text-center space-y-2">
            <p className="text-[10px] font-mono text-[#C8F135] uppercase tracking-widest">Pricing</p>
            <h2 className="font-display text-4xl font-black uppercase">One Price. Lifetime Access.</h2>
          </div>

          <div className="bg-white/3 border border-white/10 rounded-2xl p-8 space-y-6">
            <div className="flex items-end gap-3">
              <span className="font-display text-6xl font-black text-white">£97</span>
              <span className="text-white/40 font-mono text-sm mb-2">one-time payment</span>
            </div>

            <ul className="space-y-3">
              {INCLUDED.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-[#C8F135] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <button
              onClick={handleBuy}
              disabled={busy}
              className="w-full py-4 bg-[#C8F135] text-black font-bold rounded-xl hover:bg-[#b8e020] active:scale-95 transition-all disabled:opacity-60 text-base"
            >
              {busy ? "Loading…" : "Buy Now — £97"}
            </button>

            <p className="text-center text-[11px] text-white/30">
              Already a Floor member?{" "}
              <Link href="/login?next=/dashboard/courses/deploy-your-algo" className="text-[#C8F135] hover:underline">
                Sign in and access it free →
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
