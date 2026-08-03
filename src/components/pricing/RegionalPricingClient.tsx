"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Check, 
  X, 
  ChevronRight, 
  Download, 
  FileText, 
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { STRIPE_CONFIG } from "@/config/stripe";
import { 
  REGIONAL_PRICING, 
  REGION_CURRENCY_SYMBOL, 
  REGION_PDF_PRICES 
} from "@/data/pricing";
import { useRegion } from "@/components/layout/RegionalLayout";
import { REGIONS_MAP } from "@/lib/seo/hreflang";

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

export function RegionalPricingClient({ floorCap = 15, activeFloorSubs = 0 }: { floorCap?: number; activeFloorSubs?: number }) {
  const { region, label, currencySymbol } = useRegion();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);

  const symbol = REGION_CURRENCY_SYMBOL[region] || currencySymbol || "$";
  const pdfPrices = REGION_PDF_PRICES[region] || REGION_PDF_PRICES.uk;
  const tiers = REGIONAL_PRICING[region] || REGIONAL_PRICING.uk;
  const currencyCode = REGIONS_MAP[region]?.currency || "USD";

  const pdfBooks = [
    {
      id: "prop-survival-kit",
      slug: "prop-firm-survival-kit",
      title: "Prop Challenge Survival Kit",
      subtitle: "The Evaluation Blueprint (100 Pages)",
      description: "Rule decoder, position sizing calculators, and psychological protocols for passing prop firm evaluations.",
      price: pdfPrices.propKit,
      accessTier: "Free with Foundation+",
      storeUrl: "/store/prop-survival-kit",
      downloadUrl: "/downloads/challenge-checklist.pdf",
      tags: ["Prop Firms", "Risk Management", "Calculators"],
    },
    {
      id: "how-to-trade",
      slug: "how-to-trade",
      title: "How to Trade Manual",
      subtitle: "Institutional Framework (100 Pages)",
      description: "100 pages covering market structure, session theory, order flow, execution mechanics, and professional risk.",
      price: pdfPrices.howTo,
      accessTier: "Free with Foundation+",
      storeUrl: "/store/how-to-trade",
      downloadUrl: "/downloads/risk-management-guide.pdf",
      tags: ["Foundations", "Order Flow", "Structure"],
    },
    {
      id: "the-edge",
      slug: "the-edge",
      title: "The Edge Manual",
      subtitle: "Advanced Setups & Playbook (100 Pages)",
      description: "Liquidity theory, institutional order flow, confluence framework, and Pete's proprietary setups.",
      price: pdfPrices.edge,
      accessTier: "Free with Edge+",
      storeUrl: "/store/the-edge",
      downloadUrl: "/downloads/risk-management-guide.pdf",
      tags: ["Advanced", "Liquidity", "Setups"],
    },
  ];

  const handleSubscribe = async (tierName: string) => {
    if (tierName === "Floor" && activeFloorSubs >= floorCap) {
      window.location.href = `/waitlist?tier=floor&region=${region}`;
      return;
    }

    setLoadingTier(tierName);
    try {
      const tierId = tierName === "Signal Centre"
        ? "signal-centre"
        : tierName.toLowerCase().replace("the ", "");
      const priceConfig = STRIPE_CONFIG.prices[tierId as keyof typeof STRIPE_CONFIG.prices]?.[
        billingCycle === "monthly" ? "monthly" : "annual"
      ];
      const priceId = (priceConfig as any)?.[region] || (priceConfig as any)?.["gbp"];

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, tier: tierId, region }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (response.status === 401) {
        window.location.href = `/login?redirect=/${region}/pricing`;
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
            // {label.toUpperCase()} PRICING &amp; MEMBERSHIP PLANS ({currencyCode})
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 font-sans">
            Choose Your Level.
          </h1>
          <p className="text-base text-slate-600 max-w-2xl mx-auto font-sans leading-relaxed">
            Professional education, AI-driven market scanner tools, and institutional PDF manuals tailored for traders in {label}. Select the tier that matches your commitment.
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

        {/* Tier Cards Grid (4 Columns Layout) */}
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
                  borderColor: isHovered ? (tier.borderAccent || "#0891b2") : tier.highlight ? "#0891b2" : "#E5E7EB",
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
                        {symbol}{tier.price[billingCycle]}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">/month</span>
                    </div>
                    {tier.name === "Floor" && (
                      <p className="text-[10px] font-mono text-emerald-700 mt-1.5 font-bold flex items-center gap-1">
                        <span>★</span> Includes Investment Centre Terminal FREE
                      </p>
                    )}
                    {billingCycle === "yearly" && (
                      <p className="text-[10px] font-mono text-emerald-600 mt-1 font-semibold">
                        Billed annually ({currencyCode})
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
                          <Check className={cn("w-4 h-4 shrink-0 mt-0.5", feature.accent ? "text-emerald-600 font-bold" : "text-emerald-600")} />
                        ) : feature.tierNote ? (
                          <span className="w-4 h-4 shrink-0 mt-0.5 flex items-center justify-center text-[10px] text-slate-400 font-mono">◎</span>
                        ) : (
                          <X className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                        )}
                        <span className={cn("font-sans leading-relaxed flex-1", feature.included ? "text-slate-800 font-medium" : "text-slate-400")}>
                          {feature.name}
                        </span>
                        {feature.tierNote && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold font-mono uppercase tracking-wide text-slate-600 bg-slate-100 border border-slate-200 shrink-0 ml-1">
                            {feature.tierNote}
                          </span>
                        )}
                        {feature.badge && !feature.tierNote && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold font-mono uppercase tracking-wide text-slate-900 bg-[#C8F135] border border-[#b5db2e] shrink-0 ml-1">
                            {feature.badge}
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
          Already on Foundation, Edge, or Floor? <span className="text-slate-900 font-bold">Signal Centre live feed is 100% included at no extra cost.</span>
        </p>

        {/* ── PDF EBOOKS & MANUALS DOWNLOADS SECTION ── */}
        <section id="downloads" className="pt-16 pb-16 border-t border-slate-200 space-y-10">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-100 border border-slate-200 text-slate-800 text-xs font-mono font-bold uppercase tracking-widest">
              <Download className="w-3.5 h-3.5 text-slate-700" />
              // INSTITUTIONAL PDF MANUALS &amp; EBOOKS ({label.toUpperCase()})
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
            {pdfBooks.map((book) => (
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
            {label.toUpperCase()} PLATFORM NOTICE &amp; INTELLECTUAL PROPERTY GUARANTEE
          </h4>
          <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
            Subscription tiers represent access levels to educational content, institutional research, and proprietary analysis tools. Drawdown does not provide financial advice or trade signals. All strategies tested or journals analyzed remain the intellectual property of the user. Prices denominated in {currencyCode}. 7-day money-back guarantee on all subscription upgrades.
          </p>
        </div>
      </div>
    </div>
  );
}
