"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Check, 
  X, 
  ChevronRight, 
  Download, 
  BookOpen, 
  FileText, 
  Lock, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  HelpCircle,
  ExternalLink,
  Award
} from "lucide-react";
import { cn } from "@/lib/utils";
import { STRIPE_CONFIG } from "@/config/stripe";
import { GET_DEFAULT_FEATURES, GET_EDGE_FEATURES, GET_FLOOR_FEATURES } from "@/data/pricing";

const tiers = [
  {
    name: "Signal Centre",
    tierKey: "signal-centre",
    price: { monthly: 39, yearly: 31 },
    description: "For traders who want intelligence, not lectures.",
    buttonText: "Start Signal Centre",
    highlight: false,
    badge: null,
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=600&auto=format&fit=crop",
    accentColor: "rgba(200, 241, 53, 0.06)",
    borderAccent: "#C8F135",
    savings: "96",
    leftBorder: true,
    features: [
      { name: "Live Signal Feed (Forex, Indices, Metals)", included: true },
      { name: "AI Consensus Panel — Claude + GPT-4o + Grok", included: true },
      { name: "Technical Confluence Grid (M15 to D1)", included: true },
      { name: "Crypto Intelligence Hub", included: true },
      { name: "Signal Archive & Performance Tracker", included: true },
      { name: "Push notifications for high-DCS signals", included: true },
      { name: "The Investment Centre", included: false, tierNote: "Add-on £99/mo" },
    ],
  },
  {
    name: "Foundation",
    tierKey: "foundation",
    price: { monthly: 49, yearly: 39 },
    description: "For beginners building their knowledge base.",
    buttonText: "Start Foundation",
    highlight: false,
    badge: null,
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop",
    accentColor: "rgba(99, 102, 241, 0.12)",
    borderAccent: "#6366f1",
    savings: "120",
    features: [
      ...GET_DEFAULT_FEATURES(),
      { name: "PDF Manuals: How to Trade & Prop Survival Kit", included: true, badge: "Included FREE" },
      { name: "The Investment Centre", included: false, tierNote: "Add-on £99/mo" },
    ],
  },
  {
    name: "Edge",
    tierKey: "edge",
    price: { monthly: 149, yearly: 119 },
    description: "For active traders seeking AI-powered edge.",
    buttonText: "Join Edge",
    highlight: true,
    badge: "MOST POPULAR",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600&auto=format&fit=crop",
    accentColor: "rgba(6, 182, 212, 0.10)",
    borderAccent: "#0891b2",
    savings: "360",
    features: [
      ...GET_EDGE_FEATURES(),
      { name: "All 3 PDF Manuals (Prop Kit, How to Trade, Edge)", included: true, badge: "Included FREE" },
      { name: "The Investment Centre", included: false, tierNote: "Add-on £99/mo" },
    ],
  },
  {
    name: "Floor",
    tierKey: "floor",
    price: { monthly: 299, yearly: 239 },
    description: "Direct access, full suite & institutional macro engine.",
    buttonText: "Enter the Floor",
    highlight: false,
    badge: "VIP INSTITUTIONAL",
    imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=600&auto=format&fit=crop",
    accentColor: "rgba(200, 241, 53, 0.12)",
    borderAccent: "#C8F135",
    savings: "720",
    features: [
      { name: "The Investment Centre Terminal", included: true, badge: "INCLUDED FREE (£99/mo value)", accent: true },
      ...GET_FLOOR_FEATURES(),
      { name: "Deploy Your Algo Mini Course", included: true, badge: "Included — £97 value", accent: true },
      { name: "All 3 PDF Ebooks & Manuals", included: true, badge: "Included FREE", accent: true },
    ],
  },
];

const PDF_BOOKS = [
  {
    id: "prop-survival-kit",
    slug: "prop-firm-survival-kit",
    title: "Prop Challenge Survival Kit",
    subtitle: "The Evaluation Blueprint (100 Pages)",
    description: "Rule decoder, position sizing calculators, and psychological protocols for passing prop firm evaluations.",
    price: "£49",
    accessTier: "Free with Foundation+",
    storeUrl: "/store/prop-survival-kit",
    downloadUrl: "/downloads/challenge-checklist.pdf",
    tags: ["Prop Firms", "Risk Management", "Calculators"],
    color: "#C8F135",
  },
  {
    id: "how-to-trade",
    slug: "how-to-trade",
    title: "How to Trade Manual",
    subtitle: "Institutional Framework (100 Pages)",
    description: "100 pages covering market structure, session theory, order flow, execution mechanics, and professional risk.",
    price: "£79",
    accessTier: "Free with Foundation+",
    storeUrl: "/store/how-to-trade",
    downloadUrl: "/downloads/risk-management-guide.pdf",
    tags: ["Foundations", "Order Flow", "Structure"],
    color: "#F9771D",
  },
  {
    id: "the-edge",
    slug: "the-edge",
    title: "The Edge Manual",
    subtitle: "Advanced Setups & Playbook (100 Pages)",
    description: "Liquidity theory, institutional order flow, confluence framework, and Pete's proprietary setups.",
    price: "£59",
    accessTier: "Free with Edge+",
    storeUrl: "/store/the-edge",
    downloadUrl: "/downloads/risk-management-guide.pdf",
    tags: ["Advanced", "Liquidity", "Setups"],
    color: "#818cf8",
  },
];

const FREE_RESOURCES = [
  {
    title: "Drawdown Risk Management Guide",
    format: "PDF Document",
    size: "1.4 MB",
    downloadUrl: "/downloads/risk-management-guide.pdf",
  },
  {
    title: "30-Day Prop Evaluation Checklist",
    format: "PDF Checklist",
    size: "850 KB",
    downloadUrl: "/downloads/challenge-checklist.pdf",
  },
  {
    title: "Prop Firm Comparison Matrix",
    format: "Excel Worksheet",
    size: "230 KB",
    downloadUrl: "/downloads/prop-firm-comparison-sheet.xlsx",
  },
  {
    title: "Institutional Trade Journal Template",
    format: "Excel Template",
    size: "250 KB",
    downloadUrl: "/downloads/trading-journal-template.xlsx",
  },
];

export default function PricingPage({ floorCap = 15, activeFloorSubs = 0 }: { floorCap?: number, activeFloorSubs?: number }) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);

  const handleSubscribe = async (tierName: string) => {
    if (tierName === "Floor" && activeFloorSubs >= floorCap) {
      window.location.href = "/waitlist?tier=floor";
      return;
    }

    setLoadingTier(tierName);
    try {
      const tierId = tierName === "Signal Centre"
        ? "signal-centre"
        : tierName.toLowerCase().replace("the ", "");
      const priceConfig = STRIPE_CONFIG.prices[tierId as keyof typeof STRIPE_CONFIG.prices][
        billingCycle === "monthly" ? "monthly" : "annual"
      ];
      const priceId = (priceConfig as any)["gbp"];

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, tier: tierId }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (response.status === 401) {
        window.location.href = `/login?redirect=/pricing`;
      } else {
        throw new Error(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to start checkout. Please try again.");
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#FAFAFA] text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Page Header */}
        <div className="text-center mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-100 border border-slate-200 text-slate-800 text-xs font-mono font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            // PRICING &amp; MEMBERSHIP PLANS
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 font-sans">
            Choose Your Level.
          </h1>
          <p className="text-base text-slate-600 max-w-2xl mx-auto font-sans leading-relaxed">
            Professional education, AI-driven market scanner tools, and institutional PDF manuals. Select the tier that matches your trading commitment.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-14">
          <span className={cn("text-sm font-sans font-medium transition-colors", billingCycle === "monthly" ? "text-slate-900 font-bold" : "text-slate-500")}>
            Monthly Billing
          </span>
          <button
            onClick={() => setBillingCycle(prev => prev === "monthly" ? "yearly" : "monthly")}
            className="w-14 h-7 bg-slate-200 border border-slate-300 rounded-full p-0.5 relative transition-colors cursor-pointer"
          >
            <div
              className="absolute top-0.5 left-0.5 w-6 h-6 bg-slate-900 rounded-full transition-transform duration-300 shadow-md"
              style={{ transform: billingCycle === "yearly" ? "translateX(28px)" : "translateX(0)" }}
            />
          </button>
          <span className={cn("text-sm font-sans font-medium transition-colors flex items-center gap-1.5", billingCycle === "yearly" ? "text-slate-900 font-bold" : "text-slate-500")}>
            Yearly Billing
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              SAVE 20%
            </span>
          </span>
        </div>

        {/* Tier Cards Grid (4 Columns Layout Light Theme) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-20">
          {tiers.map((tier) => {
            const isHovered = hoveredTier === tier.name;
            const isFloorCapped = tier.name === "Floor" && activeFloorSubs >= floorCap;
            
            return (
              <div
                key={tier.name}
                onMouseEnter={() => setHoveredTier(tier.name)}
                onMouseLeave={() => setHoveredTier(null)}
                className={cn(
                  "relative flex flex-col bg-white border rounded-xl overflow-hidden transition-all duration-300 shadow-sm",
                  tier.highlight ? "border-2 border-[#0891b2] shadow-xl" : "border-slate-200",
                )}
                style={{
                  borderColor: isHovered ? tier.borderAccent : tier.highlight ? "#0891b2" : "#E5E7EB",
                  transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                  boxShadow: isHovered ? "0 10px 30px rgba(0,0,0,0.08)" : tier.highlight ? "0 10px 30px rgba(8,145,178,0.12)" : "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                {/* Header Badge */}
                {tier.badge && (
                  <div className={cn(
                    "relative z-10 text-center py-1.5 text-[10px] font-mono font-extrabold uppercase tracking-widest",
                    tier.name === "Edge" ? "bg-[#0891b2] text-white" : "bg-[#C8F135] text-slate-900 border-b border-slate-200"
                  )}>
                    {tier.badge}
                  </div>
                )}

                <div className="relative z-10 p-6 flex flex-col flex-1">
                  {/* Tier name + description */}
                  <div className="mb-6 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-black text-slate-900 font-sans tracking-tight">{tier.name}</h3>
                      {tier.name === "Floor" && (
                        <span className="text-[9px] font-mono font-bold text-slate-900 bg-[#C8F135] border border-[#b5db2e] px-2 py-0.5 rounded">
                          ALL INCLUDED
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 font-sans leading-relaxed min-h-[32px]">{tier.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-6 pb-6 border-b border-slate-200">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-black font-mono text-slate-900 tracking-tight">
                        £{tier.price[billingCycle]}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">/month</span>
                    </div>
                    {tier.name === "Floor" && (
                      <p className="text-[10px] font-mono text-emerald-700 mt-1.5 font-bold flex items-center gap-1">
                        <span>★</span> Includes £99/mo Investment Centre FREE
                      </p>
                    )}
                    {tier.name === "Foundation" && (
                      <p className="text-[10px] font-mono text-slate-500 mt-1.5">
                        + Investment Centre (£99/mo add-on)
                      </p>
                    )}
                    {tier.name === "Edge" && (
                      <p className="text-[10px] font-mono text-slate-500 mt-1.5">
                        + Investment Centre (£99/mo add-on)
                      </p>
                    )}
                    {billingCycle === "yearly" && (
                      <p className="text-[10px] font-mono text-emerald-600 mt-1 font-semibold">
                        Billed annually (Save £{tier.savings}/yr)
                      </p>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSubscribe(tier.name)}
                    disabled={loadingTier !== null}
                    className={cn(
                      "w-full py-3 rounded-lg text-xs font-mono font-extrabold uppercase tracking-wider mb-6 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60",
                      tier.highlight
                        ? "bg-[#0891b2] text-white hover:bg-[#0e7490] shadow-md"
                        : tier.name === "Floor"
                        ? "bg-[#C8F135] text-slate-900 hover:bg-[#b3d82a] border border-[#b5db2e] shadow-md font-black"
                        : "bg-slate-900 text-white hover:bg-slate-800"
                    )}
                  >
                    {loadingTier === tier.name ? "Processing..." : isFloorCapped ? "Join Waitlist" : tier.buttonText}
                    {loadingTier !== tier.name && <ChevronRight className="w-3.5 h-3.5" />}
                  </button>

                  {/* Features List */}
                  <div className="space-y-3 pt-2 flex-1">
                    <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-3">
                      Included Capabilities:
                    </p>
                    {tier.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        {feature.included ? (
                          <Check className={cn("w-4 h-4 shrink-0 mt-0.5", (feature as any).accent ? "text-emerald-600 font-bold" : "text-emerald-600")} />
                        ) : (feature as any).tierNote ? (
                          <span className="w-4 h-4 shrink-0 mt-0.5 flex items-center justify-center text-[10px] text-slate-400 font-mono">◎</span>
                        ) : (
                          <X className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                        )}
                        <span className={cn("font-sans leading-relaxed flex-1", feature.included ? "text-slate-800 font-medium" : "text-slate-400")}>
                          {feature.name}
                        </span>
                        {(feature as any).tierNote && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold font-mono uppercase tracking-wide text-slate-600 bg-slate-100 border border-slate-200 shrink-0 ml-1">
                            {(feature as any).tierNote}
                          </span>
                        )}
                        {(feature as any).badge && !(feature as any).tierNote && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold font-mono uppercase tracking-wide text-slate-900 bg-[#C8F135] border border-[#b5db2e] shrink-0 ml-1">
                            {(feature as any).badge}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Signal Centre inclusion note */}
        <p className="text-center text-xs text-slate-600 font-mono mb-20">
          Already on Foundation, Edge, or Floor? <span className="text-slate-900 font-bold">Signal Centre live feed is 100% included at £0 extra cost.</span>
        </p>

        {/* ── PDF EBOOKS & MANUALS DOWNLOADS SECTION ── */}
        <section id="downloads" className="pt-16 pb-16 border-t border-slate-200 space-y-10">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-100 border border-slate-200 text-slate-800 text-xs font-mono font-bold uppercase tracking-widest">
              <Download className="w-3.5 h-3.5 text-slate-700" />
              // INSTITUTIONAL PDF MANUALS &amp; EBOOKS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
              PDF Guides &amp; Downloadable Library
            </h2>
            <p className="text-slate-600 text-sm font-sans leading-relaxed">
              Access Pete Currey's complete institutional trading playbook series. Included free with Foundation, Edge, and Floor memberships or available for individual download.
            </p>
          </div>

          {/* 3 Ebook Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PDF_BOOKS.map((book) => (
              <div key={book.id} className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-slate-200 text-slate-700 bg-slate-50">
                      {book.tags[0]}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-700">
                      {book.accessTier}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-sans">{book.title}</h3>
                    <p className="text-xs text-slate-600 font-mono font-semibold mt-0.5">{book.subtitle}</p>
                  </div>

                  <p className="text-xs text-slate-600 font-sans leading-relaxed">
                    {book.description}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500">Standalone Price:</span>
                    <span className="text-slate-900 font-bold text-sm">{book.price}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={book.downloadUrl}
                      download
                      className="py-2.5 px-3 bg-slate-100 border border-slate-300 hover:bg-slate-200 text-slate-800 text-center font-mono font-bold text-[11px] uppercase tracking-wider rounded flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-700" />
                      Sample PDF
                    </a>
                    <Link
                      href={book.storeUrl}
                      className="py-2.5 px-3 bg-slate-900 text-white font-mono font-extrabold text-[11px] uppercase tracking-wider rounded text-center flex items-center justify-center gap-1 hover:bg-slate-800 transition-colors"
                    >
                      Full Book →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Free Resource Downloads Strip */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider">
                Instant Free PDF Downloads &amp; Worksheets
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {FREE_RESOURCES.map((item, idx) => (
                <a
                  key={idx}
                  href={item.downloadUrl}
                  download
                  className="p-4 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-400 transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{item.format} • {item.size}</span>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors font-sans">{item.title}</h4>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-mono text-indigo-600 font-bold">
                    <Download className="w-3 h-3" /> Download (.pdf)
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Educational Notice */}
        <div className="mt-12 p-6 bg-slate-100 border border-slate-200 rounded-xl max-w-4xl mx-auto text-center space-y-2">
          <h4 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
            PLATFORM NOTICE &amp; INTELLECTUAL PROPERTY GUARANTEE
          </h4>
          <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
            Subscription tiers represent access levels to educational content, institutional research, and proprietary analysis tools. Drawdown does not provide financial advice or trade signals. All strategies tested or journals analyzed remain the intellectual property of the user. 7-day money-back guarantee on all subscription upgrades.
          </p>
        </div>
      </div>
    </div>
  );
}
