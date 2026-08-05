"use client";

import { useState, useEffect } from "react";
import { 
  Check, 
  ArrowRight, 
  BookOpen, 
  Shield, 
  Zap, 
  Users, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  HelpCircle
} from "lucide-react";
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

const manuals = [
  {
    title: "1. Prop Firm Survival Kit",
    subtitle: "The Evaluation Blueprint (100 Pages · Reg Price: £49)",
    desc: "The definitive guide to passing modern prop evaluations. Includes step-by-step guides on how FTC, FTMO, and 5ers calculate drawdown (daily, trailing, and balance-based), dynamic position-sizing grids to stay under daily limits, and the exact psychological protocol to recover from drawdown cycles.",
    bullets: [
      "Dynamic Daily Loss limit calculators",
      "Trailing drawdown recovery guide",
      "Passed-account rules and compliance checklist"
    ],
    accent: "#C8F135"
  },
  {
    title: "2. How to Trade Manual",
    subtitle: "Pete's Institutional Framework (100 Pages · Reg Price: £79)",
    desc: "A systematic structural trading blueprint. Teaches order flow footprint charts, session liquidity sweeps (London & NY session macros), institutional market structure breaks, professional execution triggers, and capital preservation algorithms.",
    bullets: [
      "London/NY session macro liquidity models",
      "Order block validation & entry logic",
      "Institutional risk distribution tables"
    ],
    accent: "#F9771D"
  },
  {
    title: "3. The Edge Manual",
    subtitle: "Advanced Confluence Playbook (80 Pages · Reg Price: £59)",
    desc: "Pete Currey's proprietary playbook containing high-probability systematic setups. Detailed instructions on identifying liquidity pools, entry triggers for sweep-and-go models, trade management protocols, and psychological edge parameters.",
    bullets: [
      "Bespoke liquidity sweep setups",
      "Multi-timeframe confluence checklists",
      "High R:R trade management guidelines"
    ],
    accent: "#818CF8"
  }
];

const faqs = [
  { 
    q: "How does the bundle work?", 
    a: "When you buy the bundle, you get lifetime permanent access to all three manuals. They will be added to your Drawdown dashboard immediately under the 'Downloads' section, and you will also receive an email with your download links." 
  },
  { 
    q: "How much do I save?", 
    a: "Purchased separately, the manuals cost £187 in total (£49 + £79 + £59). The bundle is priced at £129, giving you a programmatic saving of exactly £58." 
  },
  { 
    q: "Is there a physical version?", 
    a: "No, all manuals are provided as instant digital PDF downloads so you can start reading immediately on any device." 
  },
  { 
    q: "Will these principles work for indices and forex?", 
    a: "Yes. The core principles of session liquidity, risk management, and order flow are structural and apply to all liquid asset classes including forex, equity indices, and commodities." 
  },
  { 
    q: "What is your refund policy?", 
    a: "Due to the immediate digital delivery nature of PDF manuals, we do not offer refunds once access has been granted. If you have questions before buying, please reach out to support@drawdown.trading." 
  }
];

export default function ManualBundleClient() {
  const { region, currencySymbol } = useRegion();
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showConsent, setShowConsent] = useState(false);

  const PRICE = 129;

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
          productId: "manual-bundle",
          region,
          terms_accepted: consentData.terms_accepted,
          immediate_supply_requested: consentData.immediate_supply_requested,
          marketing_consent: consentData.marketing_consent,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090D] text-[#E4E2DD] font-sans pt-24 pb-20">
      
      {/* Glow effects */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[150px] pointer-events-none" />

      {/* ── Hero Section ──────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col justify-center items-center text-center px-6 py-16 overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(129,140,248,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(129,140,248,0.02) 1px, transparent 1px)`,
          backgroundSize: "60px 60px"
        }} />
        
        <div className="relative max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-indigo-500/30 rounded-full bg-indigo-500/5 text-indigo-400 text-xs font-mono uppercase tracking-widest mx-auto">
            <Sparkles className="w-3.5 h-3.5" />
            Bundle Deal · Save £58 Instantly
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-tight leading-none text-white">
            The Complete
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Manual Collection.</span>
          </h1>

          <p className="text-base md:text-lg text-[#9A9A95] max-w-2xl mx-auto leading-relaxed">
            Equip your trading desk with the full library. Get the Prop Firm Survival Kit, the How to Trade Manual, and The Edge Manual in one permanent PDF collection.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => handleCheckout()}
              disabled={loading}
              className="w-full sm:w-auto px-10 py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-mono font-bold uppercase tracking-widest rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? "Redirecting..." : `Get The Bundle — ${currencySymbol}${PRICE}`}
            </button>
            <a href="#collection-details" className="text-sm text-[#7A7D85] hover:text-white transition-colors underline underline-offset-4">
              Explore the Collection ↓
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#555550] pt-6">
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Secure Stripe Checkout</span>
            <span className="text-[#333]">|</span>
            <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> Instant PDF Delivery</span>
            <span className="text-[#333]">|</span>
            <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Permanent Dashboard Access</span>
          </div>
        </div>
      </section>

      {/* ── Comparison Banner ─────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 mb-20">
        <div className="bg-[#11131A] border border-indigo-500/20 rounded-xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="text-xs font-mono uppercase text-indigo-400">// PRICING COMPARISON</div>
            <h3 className="text-lg font-bold text-white uppercase">Separate Retail Total: £187</h3>
            <p className="text-xs text-[#9A9A95]">
              Prop Kit (£49) + How to Trade (£79) + The Edge (£59) = £187 if purchased separately.
            </p>
          </div>
          <div className="text-center md:text-right shrink-0">
            <div className="text-xs text-[#9A9A95] line-through font-mono">£187</div>
            <div className="text-4xl font-extrabold text-[#C8F135] font-mono">£129</div>
            <div className="text-[10px] font-mono text-emerald-400 mt-1 uppercase font-bold">You Save £58 (31%)</div>
          </div>
        </div>
      </section>

      {/* ── Collection Details ───────────────────────────────────────────────── */}
      <section id="collection-details" className="max-w-5xl mx-auto px-6 space-y-16 mb-24">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold uppercase text-white tracking-tight">What's in the Bundle?</h2>
          <p className="text-sm text-[#9A9A95] max-w-xl mx-auto">
            Three distinct playbooks addressing three critical areas: challenge rules, systematic execution, and custom edge.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {manuals.map((man, i) => (
            <div key={i} className="bg-[#0E1015] border border-[#1C1F26] rounded-xl p-6 md:p-8 flex flex-col md:flex-row gap-8 relative overflow-hidden group hover:border-[#2C313C] transition-colors">
              <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: man.accent }} />
              
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-xl font-bold uppercase text-white tracking-tight">{man.title}</h3>
                  <div className="text-[11px] font-mono text-[#7A7D85] mt-1 uppercase tracking-wider">{man.subtitle}</div>
                </div>
                <p className="text-sm text-[#9A9A95] leading-relaxed font-sans">{man.desc}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {man.bullets.map((b, j) => (
                    <div key={j} className="flex items-center gap-2 text-xs text-[#E4E2DD]">
                      <Check className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQs ─────────────────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 mb-24">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-2xl font-bold uppercase text-white flex items-center justify-center gap-2">
            <HelpCircle className="w-6 h-6 text-indigo-400" /> Frequently Asked Questions
          </h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-[#0E1015] border border-[#1C1F26] rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-[#151820] transition-colors"
              >
                <span className="text-sm font-semibold uppercase tracking-wide text-white">{faq.q}</span>
                {openFaq === i ? <ChevronUp className="w-4 h-4 text-[#7A7D85]" /> : <ChevronDown className="w-4 h-4 text-[#7A7D85]" />}
              </button>
              {openFaq === i && (
                <div className="px-6 pb-6 pt-2 border-t border-[#1C1F26] text-xs text-[#9A9A95] leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 text-center">
        <div className="bg-[#11131A] border border-indigo-500/20 rounded-2xl p-8 md:p-12 space-y-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5" />
          <h2 className="text-3xl font-extrabold uppercase text-white tracking-tight relative">Get Instant Lifetime Access</h2>
          <p className="text-sm text-[#9A9A95] max-w-lg mx-auto relative leading-relaxed">
            Secure checkout, instant PDF delivery, and permanent access inside the student dashboard. Start building your edge today.
          </p>
          <div className="pt-2 relative">
            <button
              onClick={() => handleCheckout()}
              disabled={loading}
              className="px-10 py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-mono font-bold uppercase tracking-widest rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? "Redirecting..." : `Get The Bundle — ${currencySymbol}${PRICE}`}
            </button>
          </div>
        </div>
      </section>

      {/* Checkout Consent Modal */}
      <CheckoutConsentModal
        isOpen={showConsent}
        onClose={() => setShowConsent(false)}
        onConfirm={handleCheckout}
        loading={loading}
        productName="Complete Manual Collection (Bundle)"
        priceString={`${currencySymbol}${PRICE}.00`}
      />
    </div>
  );
}
