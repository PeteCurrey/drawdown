"use client";

import { useState, useEffect } from "react";
import { Check, ArrowRight, BookOpen, TrendingUp, Shield, Brain, Clock, Zap, Users, ChevronDown, ChevronUp } from "lucide-react";
import { CheckoutConsentModal } from "@/components/legal/CheckoutConsentModal";

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
  { num: "01", title: "The Trader's Mindset", desc: "Why most retail traders are wired to lose — and how to rewire." },
  { num: "02", title: "Market Structure", desc: "How price moves, why it moves, and what institutional order flow looks like." },
  { num: "03", title: "Session Theory", desc: "London, New York & Asian sessions — where the real opportunity lies." },
  { num: "04", title: "Reading Price Action", desc: "Candlesticks, patterns, and what price is actually telling you." },
  { num: "05", title: "Trade Execution", desc: "Entries, stop placement, and the complete anatomy of a professional trade." },
  { num: "06", title: "Risk Management", desc: "Position sizing, R:R ratios, and protecting your capital like a business." },
  { num: "07", title: "Building a Trade Plan", desc: "How to construct a repeatable framework — not a gambling system." },
  { num: "08", title: "From Demo to Live", desc: "The exact transition process from practice to real-money trading." },
];

const faqs = [
  { q: "Who is this for?", a: "Anyone who is new to trading or who has been trading for a while but hasn't yet found consistency. If you're still guessing entries, this is for you." },
  { q: "Is this beginner-friendly?", a: "Yes. The guide starts from first principles and builds up logically. No jargon without explanation. No assumptions about prior knowledge." },
  { q: "How long is it?", a: "100 pages. It's designed to be read in full on a weekend and then kept as a reference. Most people re-read specific chapters before each trading week." },
  { q: "Is this a physical book?", a: "No — it's an instant PDF download. You'll receive a link to download immediately after purchase and also via email." },
  { q: "Will this work for forex, indices, commodities?", a: "Yes. The framework is instrument-agnostic. The principles of market structure and execution apply across all liquid markets." },
  { q: "What if I already have some trading experience?", a: "Many experienced traders who read this say it fills in important gaps and helps them articulate why certain setups work. It's a framework, not just a beginner guide." },
  { q: "Can I get a refund?", a: "Due to the instant digital delivery nature of PDF downloads, we don't offer refunds. If you have questions about the content before purchasing, email pete@drawdown.trading." },
];

export default function HowToTradeClient() {
  const { region, currencySymbol } = useRegion();
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showConsent, setShowConsent] = useState(false);

  const PRICE = 79;
  const ACC = "#F9771D";

  const handleCheckout = async (consentData?: {
    terms_accepted: boolean;
    immediate_supply_requested: boolean;
    marketing_consent: boolean;
  }) => {
    if (!consentData) {
      setShowConsent(true);
      return;
    }

    setLoading(true);
    setShowConsent(false);
    try {
      const res = await fetch("/api/store/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: "how-to-trade",
          region,
          terms_accepted: consentData.terms_accepted,
          immediate_supply_requested: consentData.immediate_supply_requested,
          marketing_consent: consentData.marketing_consent,
        }),
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
          backgroundImage: `linear-gradient(rgba(249,119,29,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(249,119,29,0.03) 1px, transparent 1px)`,
          backgroundSize: "60px 60px"
        }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#08090D]" />

        <div className="relative max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#F9771D]/30 rounded-full bg-[#F9771D]/5 text-[#F9771D] text-xs font-mono uppercase tracking-widest">
            <BookOpen className="w-3.5 h-3.5" />
            100-Page PDF Guide · Instant Download
          </div>

          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tight leading-none">
            Stop Losing
            <br />
            <span style={{ color: ACC }}>On Guesswork.</span>
          </h1>

          <p className="text-lg md:text-xl text-[#9A9A95] max-w-2xl mx-auto leading-relaxed">
            Most traders fail because they never learned to trade properly. This guide gives you the complete institutional framework — from market structure through to live execution.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-center">
            {[
              { val: "100", label: "Pages" },
              { val: "8", label: "Chapters" },
              { val: "∞", label: "Re-reads" },
              { val: "1", label: "Framework" },
            ].map(s => (
              <div key={s.label}>
                <div className="text-3xl font-bold" style={{ color: ACC }}>{s.val}</div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#555550]">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => handleCheckout()}
              disabled={loading}
              className="px-10 py-4 text-[#08090D] font-mono font-bold uppercase tracking-widest rounded-xl transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
              style={{ backgroundColor: ACC }}
            >
              {loading ? "Redirecting..." : `Get the Guide — ${currencySymbol}${PRICE}`}
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
            <h2 className="text-3xl md:text-4xl font-bold uppercase">Most Traders Never Learn to Trade Properly</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: "No Framework",
                body: "They copy setups without understanding why they work. When the market changes, they're lost.",
              },
              {
                icon: TrendingUp,
                title: "Chasing Price",
                body: "They buy tops and sell bottoms because they've never been taught how institutional order flow works.",
              },
              {
                icon: Shield,
                title: "No Risk Process",
                body: "One bad week wipes out a month of gains. They haven't built trading like a business.",
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

      {/* ── Who Is Pete ───────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.3em] mb-4" style={{ color: ACC }}>// PETE CURREY</p>
              <h2 className="text-3xl font-bold uppercase mb-6">Built by a Trader Who Has Actually Done It</h2>
              <div className="space-y-4 text-sm text-[#7A7D85] leading-relaxed">
                <p>Pete has traded live funded accounts across forex, indices and commodities for years. He built Drawdown because he couldn't find a single resource that taught trading the way he wished he'd been taught when he started.</p>
                <p>This guide isn't recycled YouTube content. It's the exact framework Pete uses — written the way he thinks, structured the way he teaches.</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                "Multiple funded accounts across forex & indices",
                "Institutional-style analysis applied to retail markets",
                "100s of traders mentored through the Drawdown platform",
                "Built a full trading education platform from scratch",
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
            <h2 className="text-3xl md:text-4xl font-bold uppercase">8 Chapters. One Complete Framework.</h2>
            <p className="text-[#7A7D85] mt-4 max-w-xl mx-auto">Built to be read cover-to-cover, then kept as a permanent reference for every trading week.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chapters.map(ch => (
              <div key={ch.num} className="flex gap-4 p-5 bg-[#111318] border border-[#1A1D24] rounded-xl hover:border-[#F9771D]/30 transition-colors">
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
              { icon: Users, title: "Complete Beginners", body: "You've heard about trading and want to start correctly — not by watching YouTube and winging it." },
              { icon: TrendingUp, title: "Struggling Traders", body: "You've been trading for 6-24 months but still can't find consistency. You need a foundation reset." },
              { icon: Brain, title: "Prop Firm Aspirants", body: "You want to pass a funded account evaluation and need to understand how to trade properly before the pressure begins." },
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
                "100-page PDF guide — immediate download",
                "Market structure, sessions, execution & risk",
                "Written by a funded trader, not a content creator",
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
              onClick={() => handleCheckout()}
              disabled={loading}
              className="w-full py-4 text-[#08090D] font-mono font-bold uppercase tracking-widest rounded-xl transition-all hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: ACC }}
            >
              {loading ? "Redirecting to Checkout..." : `Get How to Trade — ${currencySymbol}${PRICE}`}
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
            100 Pages That Will Change
            <br />
            <span style={{ color: ACC }}>How You See the Market</span>
          </h2>
          <p className="text-[#7A7D85] max-w-xl mx-auto">
            Every serious trader has a framework. Most never find theirs. This is yours.
          </p>
          <button
            onClick={() => handleCheckout()}
            disabled={loading}
            className="inline-flex items-center gap-3 px-10 py-4 text-[#08090D] font-mono font-bold uppercase tracking-widest rounded-xl transition-all hover:opacity-90 hover:scale-[1.02] disabled:opacity-60"
            style={{ backgroundColor: ACC }}
          >
            {loading ? "Redirecting..." : `Get How to Trade — ${currencySymbol}${PRICE}`}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <CheckoutConsentModal
        isOpen={showConsent}
        onClose={() => setShowConsent(false)}
        onConfirm={handleCheckout}
        loading={loading}
        productName="How to Trade Manual"
        priceString={`${currencySymbol}${PRICE} (One-time payment)`}
      />
    </div>
  );
}
