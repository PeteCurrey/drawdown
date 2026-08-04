"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Check,
  X,
  ChevronDown,
  Download,
  BookOpen,
  FileText,
  Zap,
  ShieldCheck,
  ArrowRight,
  HelpCircle,
  Users,
  Lock,
  BadgeCheck,
  Star,
  CircleDot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { STRIPE_CONFIG } from "@/config/stripe";
import {
  GBP_TIERS,
  PricingTier,
  FeatureRow,
  PRICING_FAQS,
  formatGBP,
} from "@/data/pricing";
import { CheckoutConsentModal } from "@/components/legal/CheckoutConsentModal";

// ─── Constants ───────────────────────────────────────────────────────────────

const MANUAL_BUNDLE_SAVING_GBP = 58; // £49 + £79 + £59 = £187 − £129 = £58

const PDF_BOOKS = [
  {
    id: "prop-survival-kit",
    slug: "prop-firm-survival-kit",
    title: "Prop Firm Survival Kit",
    subtitle: "100-page PDF — Permanent Download",
    description:
      "Rule decoder, position sizing calculators and psychological protocols for passing prop firm evaluations.",
    price: "£49",
    standaloneUrl: "/store/prop-survival-kit",
    sampleUrl: "/downloads/challenge-checklist.pdf",
    tags: ["Prop Firms", "Risk Management"],
    accentColor: "#C8F135",
    includedWith: "Annual Foundation+",
  },
  {
    id: "how-to-trade",
    slug: "how-to-trade",
    title: "How to Trade Manual",
    subtitle: "100-page PDF — Permanent Download",
    description:
      "Market structure, session theory, order flow, execution mechanics and professional risk — 100 pages.",
    price: "£79",
    standaloneUrl: "/store/how-to-trade",
    sampleUrl: "/downloads/how-to-trade-sample.pdf",
    tags: ["Foundations", "Order Flow"],
    accentColor: "#f97316",
    includedWith: "Annual Foundation+",
  },
  {
    id: "the-edge",
    slug: "the-edge-manual",
    title: "The Edge Manual",
    subtitle: "100-page PDF — Permanent Download",
    description:
      "Liquidity theory, institutional order flow, confluence framework and advanced setups.",
    price: "£59",
    standaloneUrl: "/store/the-edge",
    sampleUrl: "/downloads/edge-manual-sample.pdf",
    tags: ["Advanced", "Liquidity"],
    accentColor: "#818cf8",
    includedWith: "Annual Edge+",
  },
];

const FREE_DOWNLOADS = [
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

// ─── Feature indicator ────────────────────────────────────────────────────────

function FeatureIndicator({ feature }: { feature: FeatureRow }) {
  if (!feature.included) {
    return <X className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />;
  }
  if (feature.status === "beta") {
    return (
      <span className="w-4 h-4 shrink-0 mt-0.5 flex items-center justify-center">
        <BadgeCheck className="w-4 h-4 text-blue-500" />
      </span>
    );
  }
  if (feature.status === "in_development") {
    return (
      <span className="w-4 h-4 shrink-0 mt-0.5 flex items-center justify-center">
        <CircleDot className="w-4 h-4 text-slate-400" />
      </span>
    );
  }
  if (feature.annualOnly) {
    return (
      <span className="w-4 h-4 shrink-0 mt-0.5 flex items-center justify-center">
        <Star className="w-4 h-4 text-amber-500" />
      </span>
    );
  }
  return <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />;
}

// ─── Tier card ────────────────────────────────────────────────────────────────

function TierCard({
  tier,
  billingCycle,
  onSubscribe,
  loadingTier,
  isCapacityReached,
}: {
  tier: PricingTier;
  billingCycle: "monthly" | "yearly";
  onSubscribe: (tierId: string) => void;
  loadingTier: string | null;
  isCapacityReached: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const isFree = tier.id === "free";
  const isFloor = tier.id === "floor";
  const showAnnualPrice =
    billingCycle === "yearly" && tier.hasAnnualOption && !isFree;

  const displayPrice = showAnnualPrice
    ? Math.round(tier.annualPrice / 12)
    : tier.monthlyPrice;

  const ctaLabel = isCapacityReached && isFloor
    ? "Join Waitlist"
    : tier.buttonText;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex flex-col bg-white border rounded-xl overflow-hidden transition-all duration-300 shadow-sm",
        tier.highlight
          ? "border-2 border-[#0891b2] shadow-xl"
          : "border-slate-200"
      )}
      style={{
        borderColor: hovered
          ? tier.borderAccent
          : tier.highlight
          ? "#0891b2"
          : "#E5E7EB",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 10px 30px rgba(0,0,0,0.08)"
          : tier.highlight
          ? "0 10px 30px rgba(8,145,178,0.12)"
          : "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      {/* Highlighted badge */}
      {tier.highlight && (
        <div className="relative z-10 text-center py-1.5 text-[10px] font-mono font-extrabold uppercase tracking-widest bg-[#0891b2] text-white">
          Most Selected
        </div>
      )}

      <div className="relative z-10 p-6 flex flex-col flex-1">
        {/* Header */}
        <div className="mb-6 space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 font-sans tracking-tight">
              {tier.shortName}
            </h3>
            {isFloor && (
              <span className="text-[9px] font-mono font-bold text-slate-700 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded">
                CAP: {tier.capacity}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600 font-sans leading-relaxed min-h-[32px]">
            {tier.description}
          </p>
        </div>

        {/* Price */}
        <div className="mb-6 pb-6 border-b border-slate-200">
          {isFree ? (
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black font-mono text-slate-900">
                Free
              </span>
            </div>
          ) : (
            <>
              <div className="flex items-baseline gap-1 flex-nowrap whitespace-nowrap overflow-hidden">
                <span className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-black font-mono text-slate-900 tracking-tight shrink-0">
                  £{displayPrice.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 font-mono shrink-0">
                  /month
                </span>
              </div>
              {showAnnualPrice && (
                <p className="text-[10px] font-mono text-slate-500 mt-1">
                  Billed annually at £{tier.annualPrice.toLocaleString()}/yr
                </p>
              )}
              {showAnnualPrice && tier.annualSavingDescription && (
                <p className="text-[10px] font-mono text-emerald-700 mt-1 font-semibold">
                  {tier.annualSavingDescription}
                </p>
              )}
              {!tier.hasAnnualOption && !isFree && (
                <p className="text-[10px] font-mono text-slate-400 mt-1">
                  Monthly billing
                </p>
              )}
            </>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={() => onSubscribe(tier.id)}
          disabled={loadingTier !== null}
          className={cn(
            "w-full py-3 rounded-lg text-xs font-mono font-extrabold uppercase tracking-wider mb-6 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60",
            tier.highlight
              ? "bg-[#0891b2] text-white hover:bg-[#0e7490] shadow-md"
              : isFloor
              ? "bg-[#C8F135] text-slate-900 hover:bg-[#b3d82a] border border-[#b5db2e] shadow-md font-black"
              : isFree
              ? "bg-slate-900 text-white hover:bg-slate-800"
              : "bg-slate-900 text-white hover:bg-slate-800"
          )}
        >
          {loadingTier === tier.id ? (
            "Processing…"
          ) : (
            <>
              {ctaLabel}
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>

        {/* Floor — capacity note */}
        {isFloor && (
          <p className="text-[10px] font-mono text-slate-500 text-center -mt-4 mb-4">
            {isCapacityReached
              ? "Capacity reached. Join the waitlist."
              : `${tier.capacity} member cap — checkout closes when full`}
          </p>
        )}

        {/* Features */}
        <div className="space-y-3 pt-2 flex-1">
          <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-3">
            What&apos;s included:
          </p>
          {tier.releasedFeatures.map((feature, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">
              <FeatureIndicator feature={feature} />
              <span
                className={cn(
                  "font-sans leading-relaxed flex-1",
                  feature.included ? "text-slate-800 font-medium" : "text-slate-400"
                )}
              >
                {feature.name}
              </span>
              {feature.note && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold font-mono uppercase tracking-wide text-slate-600 bg-slate-100 border border-slate-200 shrink-0 ml-1 whitespace-nowrap">
                  {feature.note}
                </span>
              )}
            </div>
          ))}
          {tier.plannedFeatures.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-100">
              <p className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-2">
                Coming to {tier.shortName}:
              </p>
              {tier.plannedFeatures.map((f, i) => (
                <div key={i} className="flex items-start gap-2 text-xs mb-1.5">
                  <CircleDot className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                  <span className="text-slate-400 font-sans leading-relaxed">
                    {f}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── FAQ section ──────────────────────────────────────────────────────────────

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section id="faq" className="pt-16 pb-4 border-t border-slate-200">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 font-sans mb-8 text-center tracking-tight">
          Questions about membership
        </h2>
        <div className="space-y-2">
          {PRICING_FAQS.map((faq, i) => (
            <div
              key={i}
              className="border border-slate-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-colors font-sans"
              >
                <span className="flex items-center gap-2.5 pr-4">
                  <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200",
                    openIndex === i && "rotate-180"
                  )}
                />
              </button>
              {openIndex === i && (
                <div className="px-4 pb-4 pt-0 text-sm text-slate-600 font-sans leading-relaxed border-t border-slate-100 bg-slate-50/50">
                  <div className="pt-3">{faq.answer}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PricingPage({
  floorCap = 20,
  activeFloorSubs = 0,
}: {
  floorCap?: number;
  activeFloorSubs?: number;
}) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [showConsent, setShowConsent] = useState(false);
  const [pendingTier, setPendingTier] = useState<string | null>(null);

  const tiers = GBP_TIERS;
  const isFloorCapReached = activeFloorSubs >= floorCap;

  const handleSubscribe = async (tierId: string, consentData?: {
    terms_accepted: boolean;
    immediate_supply_requested: boolean;
    marketing_consent: boolean;
  }) => {
    // Free tier → go to register
    if (tierId === "free") {
      window.location.href = "/register";
      return;
    }

    // Floor at capacity → waitlist
    if (tierId === "floor" && isFloorCapReached) {
      window.location.href = "/waitlist?tier=floor";
      return;
    }

    if (!consentData) {
      setPendingTier(tierId);
      setShowConsent(true);
      return;
    }

    setLoadingTier(tierId);
    setShowConsent(false);
    try {
      const interval =
        billingCycle === "monthly" ? "monthly" : "annual";
      const priceConfig = (STRIPE_CONFIG.prices as any)[tierId]?.[interval];
      const priceId = priceConfig?.["gbp"];

      if (!priceId) {
        throw new Error(`No Stripe price ID configured for ${tierId} ${interval}`);
      }

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          tier: tierId,
          terms_accepted: consentData.terms_accepted,
          immediate_supply_requested: consentData.immediate_supply_requested,
          marketing_consent: consentData.marketing_consent,
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (response.status === 401) {
        window.location.href = `/login?redirect=/pricing`;
      } else {
        throw new Error(data.error || "Checkout unavailable. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Unable to start checkout. Please try again or contact support.");
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <>
    <div className="pt-28 pb-24 min-h-screen bg-[#FAFAFA] text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ── Page Header ── */}
        <div className="text-center mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-100 border border-slate-200 text-slate-800 text-xs font-mono font-bold uppercase tracking-widest">
            <Zap className="w-3.5 h-3.5 text-slate-700" />
            Memberships &amp; products
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 font-sans">
            Choose the level of structure<br className="hidden md:block" /> and support you need.
          </h1>
          <p className="text-base text-slate-600 max-w-2xl mx-auto font-sans leading-relaxed">
            Start free. Upgrade when the released curriculum, tools and support justify it.
            Planned features are never counted as current membership value.
          </p>
        </div>

        {/* ── Billing toggle ── */}
        <div className="flex items-center justify-center gap-4 mb-14">
          <span
            className={cn(
              "text-sm font-sans font-medium transition-colors",
              billingCycle === "monthly"
                ? "text-slate-900 font-bold"
                : "text-slate-500"
            )}
          >
            Monthly
          </span>
          <button
            id="billing-toggle"
            onClick={() =>
              setBillingCycle((prev) =>
                prev === "monthly" ? "yearly" : "monthly"
              )
            }
            aria-pressed={billingCycle === "yearly"}
            aria-label="Toggle annual billing"
            className="w-14 h-7 bg-slate-200 border border-slate-300 rounded-full p-0.5 relative transition-colors cursor-pointer"
          >
            <div
              className="absolute top-0.5 left-0.5 w-6 h-6 bg-slate-900 rounded-full transition-transform duration-300 shadow-md"
              style={{
                transform:
                  billingCycle === "yearly"
                    ? "translateX(28px)"
                    : "translateX(0)",
              }}
            />
          </button>
          <span
            className={cn(
              "text-sm font-sans font-medium transition-colors flex items-center gap-1.5",
              billingCycle === "yearly"
                ? "text-slate-900 font-bold"
                : "text-slate-500"
            )}
          >
            Annual
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              2 months free
            </span>
          </span>
        </div>

        {/* ── Tier Cards — 4 columns ── */}
        <div
          id="membership-tiers"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-10"
        >
          {tiers.map((tier) => (
            <TierCard
              key={tier.id}
              tier={tier}
              billingCycle={billingCycle}
              onSubscribe={handleSubscribe}
              loadingTier={loadingTier}
              isCapacityReached={isFloorCapReached}
            />
          ))}
        </div>

        {/* ── Annual download note ── */}
        <div className="mb-20 p-4 bg-amber-50 border border-amber-200 rounded-lg max-w-3xl mx-auto">
          <div className="flex items-start gap-3">
            <Star className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 font-sans leading-relaxed">
              <span className="font-bold">Annual plan download entitlements</span>{" "}
              — Manuals marked with a star are permanently yours when purchased
              via an annual plan. Monthly members can access manuals inside the
              platform while their subscription is active, or purchase individually at{" "}
              <Link href="/store" className="underline font-semibold">
                the store
              </Link>
              .
            </div>
          </div>
        </div>

        {/* ── Accelerator banner ── */}
        <section
          id="accelerator"
          className="mb-20 rounded-2xl bg-[#0B0E12] border border-[#E2B755]/20 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-2 text-center md:text-left">
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-[#E2B755]">
              Six-Week Live Cohort
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              The Drawdown Institutional Accelerator
            </h2>
            <p className="text-sm text-[#9CA3AF] max-w-xl leading-relaxed">
              A structured six-week programme for serious traders. Maximum 15 accepted participants per cohort.
              Application required — places are confirmed manually.
              Includes 12 months Edge membership.
            </p>
            <p className="text-sm font-mono font-bold text-white">
              £1,500 single payment &nbsp;·&nbsp;{" "}
              <span className="text-[#E2B755]">or 3 × £550 = £1,650</span>
            </p>
          </div>
          <div className="flex flex-col gap-3 shrink-0 text-center">
            <Link
              href="/institutional-accelerator/apply"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-[#E2B755] to-[#C59235] hover:from-[#F3C475] hover:to-[#E2B755] text-[#0B0E12] font-semibold tracking-wide text-sm transition-all duration-300 shadow-lg"
            >
              Submit Application <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/institutional-accelerator"
              className="text-[10px] font-mono text-[#9CA3AF] hover:text-white transition-colors text-center underline underline-offset-2"
            >
              View full curriculum
            </Link>
          </div>
        </section>

        {/* ── PDF Manuals & Downloads ── */}
        <section id="downloads" className="pt-16 pb-16 border-t border-slate-200 space-y-10">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-100 border border-slate-200 text-slate-800 text-xs font-mono font-bold uppercase tracking-widest">
              <BookOpen className="w-3.5 h-3.5 text-slate-700" />
              Premium PDF Manuals
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
              Pete Currey&apos;s Trading Playbook Series
            </h2>
            <p className="text-slate-600 text-sm font-sans leading-relaxed">
              Each manual is a standalone permanent purchase. Annual Foundation and Edge
              members receive specified manuals as a permanent download entitlement — these
              remain yours regardless of your membership status thereafter.
            </p>
          </div>

          {/* 3 Manual Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PDF_BOOKS.map((book) => (
              <div
                key={book.id}
                className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border text-slate-700 bg-slate-50 border-slate-200"
                    >
                      {book.tags[0]}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-500 border border-slate-200 rounded px-2 py-0.5 bg-slate-50">
                      {book.includedWith}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-sans">
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      {book.subtitle}
                    </p>
                  </div>
                  <p className="text-xs text-slate-600 font-sans leading-relaxed">
                    {book.description}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500">Standalone price:</span>
                    <span className="text-slate-900 font-bold text-sm">
                      {book.price}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={book.sampleUrl}
                      download
                      className="py-2.5 px-3 bg-slate-100 border border-slate-300 hover:bg-slate-200 text-slate-800 text-center font-mono font-bold text-[11px] uppercase tracking-wider rounded flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-700" />
                      Sample
                    </a>
                    <Link
                      href={book.standaloneUrl}
                      className="py-2.5 px-3 bg-slate-900 text-white font-mono font-extrabold text-[11px] uppercase tracking-wider rounded text-center flex items-center justify-center gap-1 hover:bg-slate-800 transition-colors"
                    >
                      Buy Now →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bundle card */}
          <div className="bg-slate-900 text-white rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#C8F135]">
                Bundle — All Three Manuals
              </span>
              <h3 className="text-2xl font-bold tracking-tight">
                Complete Manual Collection
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed max-w-md">
                Prop Firm Survival Kit, How to Trade Manual and The Edge Manual — three permanent
                PDF downloads in one purchase.
              </p>
            </div>
            <div className="text-center shrink-0">
              <div className="text-xs font-mono text-slate-400 mb-0.5">
                Individual total: £187 &nbsp;·&nbsp;{" "}
                <span className="text-[#C8F135] font-bold">
                  Save £{MANUAL_BUNDLE_SAVING_GBP}
                </span>
              </div>
              <div className="text-4xl font-black font-mono text-white mb-4">
                £129
              </div>
              <Link
                href="/store/manual-bundle"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-[#C8F135] text-slate-900 font-mono font-extrabold text-xs uppercase tracking-wider hover:bg-[#b3d82a] transition-colors"
              >
                Buy Bundle <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[10px] font-mono text-slate-500 mt-2">
                Permanent download — yours to keep
              </p>
            </div>
          </div>

          {/* Free downloads strip */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-600" />
              <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider">
                Free PDF Downloads &amp; Worksheets
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {FREE_DOWNLOADS.map((item, idx) => (
                <a
                  key={idx}
                  href={item.downloadUrl}
                  download
                  className="p-4 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-400 transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                      {item.format} · {item.size}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-slate-700 transition-colors font-sans">
                      {item.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-slate-600 font-bold">
                    <Download className="w-3 h-3" /> Free download
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <FAQSection />

        {/* ── Notices ── */}
        <div className="mt-16 p-6 bg-slate-100 border border-slate-200 rounded-xl max-w-4xl mx-auto text-center space-y-2">
          <h4 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
            Platform Notice
          </h4>
          <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
            Membership tiers represent access levels to educational content, research tools
            and quantitative analysis features. Drawdown does not provide financial advice.
            Market intelligence, signal feeds and analysis tools reflect automated outputs
            derived from data inputs — they are not trade recommendations and outcomes
            are not guaranteed. All strategies tested, journals analysed and plans created
            inside the platform remain the intellectual property of the user.
          </p>
          <p className="text-[11px] text-slate-500 leading-relaxed font-sans mt-2">
            Prices shown are inclusive of UK VAT where applicable. Drawdown reserves the right
            to update plan features in line with the{" "}
            <Link href="/roadmap" className="underline">
              public product roadmap
            </Link>
            . No currently planned feature is counted toward existing membership value.
          </p>
        </div>
      </div>
    </div>

    {pendingTier && (
      <CheckoutConsentModal
        isOpen={showConsent}
        onClose={() => { setShowConsent(false); setPendingTier(null); }}
        onConfirm={(consentData) => { if (pendingTier) handleSubscribe(pendingTier, consentData); }}
        loading={loadingTier !== null}
        productName={`Drawdown ${pendingTier.charAt(0).toUpperCase() + pendingTier.slice(1)}`}
        priceString={billingCycle === "monthly" ? "from £49/mo" : "from £39/mo (annual)"}
      />
    )}
    </>
  );
}
