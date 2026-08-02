"use client";

import { useState, useEffect } from "react";
import { Check, ArrowRight, BookOpen, TrendingUp, Shield, Brain, Clock, Zap, Target, ChevronDown, ChevronUp } from "lucide-react";

function useRegion() {
  const [region, setRegion] = useState("uk");
  const [currencySymbol, setCurrencySymbol] = useState("£");
  useEffect(() => {
    const regionMap: Record<string, string> = {
      gb: "uk", au: "au", us: "us", sg: "sg", hk: "hk", ca: "ca",
      de: "de", fr: "de", ae: "ae", in: "in", my: "my", ph: "ph"
    };
    const symbolMap: Record<string, string> = {
      uk: "£", au: "A$", us: "$", sg: "S$", hk: "HK$",
      ca: "C$", de: "€", ae: "AED ", in: "₹", my: "RM ", ph: "₱"
    };
    fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3000) })
      .then(r => r.json())
      .then(d => {
        const code = regionMap[d.country_code?.toLowerCase()] || "uk";
        setRegion(code);
        setCurrencySymbol(symbolMap[code] || "£");
      })
      .catch(() => {});
  }, []);
  return { region, currencySymbol };
}

const chapters = [
  { num: "01", title: "Understanding Liquidity", desc: "Where institutional money is forced to buy and sell — and how to trade with it, not against it." },
  { num: "02", title: "Order Flow & Smart Money", desc: "How to read what institutions are doing in real-time, not what they did." },
  { num: "03", title: "Confluence Framework", desc: "Stacking structure, session, momentum and sentiment for maximum probability entries." },
  { num: "04", title: "Proprietary Setups", desc: "Pete's personal playbook of repeatable, named patterns that appear week after week." },
  { num: "05", title: "Position Management", desc: "How to scale in, scale out, move stops, and maximise the trades that actually work." },
  { num: "06", title: "The Psychological Edge", desc: "Why technically correct traders still lose — and the mental framework that changes that." },
  { num: "07", title: "Building Your Playbook", desc: "How to document, review and refine your own setups over time." },
  { num: "08", title: "Consistency Protocol", desc: "The daily and weekly routines that keep high-level traders performing consistently." },
];

const faqs = [
  { q: "Do I need to read 'How to Trade' first?", a: "Not strictly — but we recommend it if you're newer to structured trading. The Edge Manual assumes a solid understanding of market structure and execution basics." },
  { q: "Who is this for specifically?", a: "Traders who already understand the basics but are stuck at break-even or inconsistent. Also for funded traders who know how to pass evaluations but struggle to compound afterwards." },
  { q: "Is this based on specific indicators?", a: "No. The framework is based on price action, liquidity and order flow. The setups work with or without indicators — though we do reference how certain tools can confirm the framework." },
  { q: "How long is the PDF?", a: "100 pages. Dense, practical content — no filler. Most traders read it twice: once for the overview, then chapter by chapter as they apply each concept." },
  { q: "Will this work on my broker or prop firm platform?", a: "Yes. The approach is platform-agnostic. The concepts apply wherever you can see a price chart with volume information." },
  { q: "Is this available as a physical copy?", a: "No — it's a PDF for instant delivery. Many traders print it and keep it at their desk." },
  { q: "What is your refund policy?", a: "Due to the instant digital delivery nature of PDF downloads, we don't offer refunds. Email pete@drawdown.trading before purchasing if you have content questions." },
];

export default function TheEdgeClient() {
  const { region, currencySymbol } = useRegion();
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const PRICE = 59;
  const ACC = "#818cf8";

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/store/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: "the-edge", region }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090D] text-[#E4E2DD] font-sans">
      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(129,140,248,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(129,140,248,0.03) 1px, transparent 1px)`,
          backgroundSize: "60px 60px"
        }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#08090D]" />

        <div className="relative max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#818cf8]/30 rounded-full bg-[#818cf8]/5 text-[#818cf8] text-xs font-mono uppercase tracking-widest">
            <Brain className="w-3.5 h-3.5" />
            Advanced Strategy · 100 Pages · Instant PDF
          </div>

          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tight leading-none">
            You Know How to Trade.
            <br />
            <span style={{ color: ACC }}>Find Your Edge.</span>
          </h1>

          <p className="text-lg md:text-xl text-[#9A9A95] max-w-2xl mx-auto leading-relaxed">
            Being technically correct isn't enough. The traders who win consistently have an edge — a repeatable framework built on liquidity, confluence, and psychological discipline.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-center">
            {[
              { val: "100", label: "Pages" },
              { val: "8", label: "Chapters" },
              { val: "4", label: "Setups" },
              { val: "1", label: "Playbook" },
            ].map(s => (
              <div key={s.label}>
                <div className="text-3xl font-bold" style={{ color: ACC }}>{s.val}</div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#555550]">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="px-10 py-4 text-white font-mono font-bold uppercase tracking-widest rounded-xl transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
              style={{ backgroundColor: ACC }}
            >
              {loading ? "Redirecting..." : `Get The Edge — ${currencySymbol}${PRICE}`}
            </button>
            <a href="#whats-inside" className="text-sm text-[#555550] hover:text-[#E4E2DD] transition-colors underline underline-offset-4">
              See what's inside ↓
            </a>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-[#555550]">
            <span className="flex items-center gap-1.5"><Shield className="w-3 h-3" /> Secure Checkout</span>
            <span className="text-[#333]">|</span>
            <span className="flex items-center gap-1.5"><Zap className="w-3 h-3" /> Instant PDF Delivery</span>
            <span className="text-[#333]">|</span>
            <span className="flex items-center gap-1.5"><BookOpen className="w-3 h-3" /> Keep Forever</span>
          </div>
        </div>
      </section>

      {/* ── The Problem ───────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#0B0C10]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#555550] mb-4">// THE PROBLEM</p>
            <h2 className="text-3xl md:text-4xl font-bold uppercase">Why Technically Correct Traders Still Lose</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: "Right Setup, Wrong Timing",
                body: "They identify the right direction but enter before institutional order flow confirms. The setup works — after they've been stopped out.",
              },
              {
                icon: Brain,
                title: "No Real Edge",
                body: "They trade every setup that looks like their system. Without a genuine edge, they're just churning positions and paying spread.",
              },
              {
                icon: TrendingUp,
                title: "Can't Stay Consistent",
                body: "Two good weeks followed by one bad week that undoes the gains. The psychology isn't there to sustain a streak.",
              },
            ].map(c => (
              <div key={c.title} className="p-6 bg-[#111318] border border-[#1A1D24] rounded-xl">
                <c.icon className="w-8 h-8 mb-4" style={{ color: ACC }} />
                <h3 className="text-lg font-bold uppercase mb-2">{c.title}</h3>
                <p className="text-sm text-[#7A7D85] leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pete Authority ────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.3em] mb-4" style={{ color: ACC }}>// PETE CURREY</p>
              <h2 className="text-3xl font-bold uppercase mb-6">Pete's Actual Playbook. Not Theory.</h2>
              <div className="space-y-4 text-sm text-[#7A7D85] leading-relaxed">
                <p>The Edge Manual is Pete's personal trading playbook — the exact setups, frameworks and mental routines he applies to his funded accounts. Not theory. Not recycled content.</p>
                <p>Every setup in this guide has been traded live, refined over time, and stress-tested under the pressure of real capital and prop firm rules.</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                "Multiple live funded accounts — all using this framework",
                "Institutional-grade liquidity analysis applied to retail",
                "Refined through years of live trading, not just analysis",
                "The same setups taught in 1-to-1 mentorship sessions",
              ].map(item => (
                <div key={item} className="flex items-start gap-3 p-4 bg-[#0B0C10] border border-[#1A1D24] rounded-lg">
                  <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: ACC }} />
                  <span className="text-sm text-[#E4E2DD]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── What's Inside ─────────────────────────────────────────────────────── */}
      <section id="whats-inside" className="py-24 px-6 bg-[#0B0C10]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#555550] mb-4">// WHAT'S INSIDE</p>
            <h2 className="text-3xl md:text-4xl font-bold uppercase">8 Chapters. Your Complete Edge.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chapters.map(ch => (
              <div key={ch.num} className="flex gap-4 p-5 bg-[#111318] border border-[#1A1D24] rounded-xl hover:border-[#818cf8]/30 transition-colors">
                <span className="text-2xl font-bold font-mono shrink-0" style={{ color: ACC }}>{ch.num}</span>
                <div>
                  <h3 className="font-bold uppercase text-sm mb-1">{ch.title}</h3>
                  <p className="text-xs text-[#7A7D85] leading-relaxed">{ch.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who It's For ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#555550] mb-4">// WHO IT'S FOR</p>
            <h2 className="text-3xl font-bold uppercase">This Is For You If...</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Target, title: "Intermediate Traders", body: "You understand market structure but can't find consistent, high-probability setups. The Edge gives you a clear filter." },
              { icon: Shield, title: "Funded Account Holders", body: "You passed the evaluation but struggle to compound consistently. This is the framework for the next phase." },
              { icon: Brain, title: "Break-Even Traders", body: "Your win rate is decent but the losers are too big. The psychological and position management chapters will fix this." },
            ].map(c => (
              <div key={c.title} className="p-6 border rounded-xl" style={{ borderColor: `${ACC}30`, background: `${ACC}05` }}>
                <c.icon className="w-7 h-7 mb-4" style={{ color: ACC }} />
                <h3 className="font-bold uppercase mb-2">{c.title}</h3>
                <p className="text-sm text-[#7A7D85] leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Purchase Section ──────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#0B0C10]">
        <div className="max-w-lg mx-auto">
          <div className="p-8 bg-[#111318] border-2 rounded-2xl" style={{ borderColor: ACC }}>
            <div className="text-center mb-8">
              <p className="text-xs font-mono uppercase tracking-[0.3em] mb-2" style={{ color: ACC }}>// YOUR INVESTMENT</p>
              <div className="text-5xl font-bold mb-1" style={{ color: ACC }}>{currencySymbol}{PRICE}</div>
              <p className="text-sm text-[#555550]">One-time payment · Instant PDF download</p>
            </div>

            <div className="space-y-3 mb-8">
              {[
                "100-page advanced strategy PDF — immediate download",
                "Liquidity theory, confluence & proprietary setups",
                "The psychological framework for consistent trading",
                "Keep forever — no subscriptions, no expiry",
                "Companion access to your Drawdown dashboard",
              ].map(item => (
                <div key={item} className="flex items-center gap-3">
                  <Check className="w-4 h-4 shrink-0" style={{ color: ACC }} />
                  <span className="text-sm text-[#E4E2DD]">{item}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-4 text-white font-mono font-bold uppercase tracking-widest rounded-xl transition-all hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: ACC }}
            >
              {loading ? "Redirecting to Checkout..." : `Get The Edge — ${currencySymbol}${PRICE}`}
            </button>

            <div className="flex justify-center gap-6 mt-4 text-xs text-[#555550]">
              <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Secure</span>
              <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Instant</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Keep Forever</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#555550] mb-4">// FAQ</p>
            <h2 className="text-3xl font-bold uppercase">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-[#1A1D24] rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-[#0B0C10] transition-colors"
                >
                  <span className="font-semibold text-sm">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="w-4 h-4 text-[#555550] shrink-0" /> : <ChevronDown className="w-4 h-4 text-[#555550] shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm text-[#7A7D85] leading-relaxed border-t border-[#1A1D24] pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#0B0C10]">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold uppercase">
            Stop Leaving Money
            <br />
            <span style={{ color: ACC }}>On the Table.</span>
          </h2>
          <p className="text-[#7A7D85] max-w-xl mx-auto">
            You already know how to trade. Now build the edge that makes you dangerous.
          </p>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="inline-flex items-center gap-3 px-10 py-4 text-white font-mono font-bold uppercase tracking-widest rounded-xl transition-all hover:opacity-90 hover:scale-[1.02] disabled:opacity-60"
            style={{ backgroundColor: ACC }}
          >
            {loading ? "Redirecting..." : `Get The Edge — ${currencySymbol}${PRICE}`}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
