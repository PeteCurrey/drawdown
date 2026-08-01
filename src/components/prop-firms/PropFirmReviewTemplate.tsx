"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Star, 
  Check, 
  X, 
  ExternalLink, 
  ChevronRight, 
  HelpCircle, 
  AlertCircle, 
  Percent, 
  Activity, 
  Target, 
  ShieldCheck, 
  TrendingUp,
  DollarSign,
  Award,
  Layers,
  Zap,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AffiliateDisclosure } from "@/components/seo/AffiliateDisclosure";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { getRelatedLinks } from "@/lib/linking";
import { LeadMagnet } from "@/components/seo/LeadMagnet";
import { PropSurvivalFloatingWidget } from "@/components/ui/PropSurvivalFloatingWidget";
import { PropFirmBrandHeader, getPropFirmBrandConfig } from "@/components/prop-firms/PropFirmBrandHeader";

interface PropFirmReviewTemplateProps {
  review: any;
}

export function PropFirmReviewTemplate({ review }: PropFirmReviewTemplateProps) {
  const brand = getPropFirmBrandConfig(review.slug, review.name);
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen pb-24 text-slate-900 font-sans">
      {/* 1. Immersive Brand Hero Header */}
      <PropFirmBrandHeader review={review} slug={review.slug} />

      {/* 2. Floating Sticky Navigation Bar on Scroll */}
      <div 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-white/10 transition-all duration-300 transform py-3 px-6 shadow-2xl",
          showStickyBar ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        )}
      >
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {brand.logoDarkBg ? (
              <img 
                src={brand.logoDarkBg} 
                alt={brand.brandName} 
                className="h-7 w-auto object-contain animate-fade-in" 
              />
            ) : (
              <span className="font-sans font-black text-white text-sm tracking-wider">{brand.brandName}</span>
            )}
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-300 border-l border-white/10 pl-4">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="font-bold text-white">{review.rating}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`#verdict`}
              className="hidden md:inline-flex text-xs font-mono font-bold uppercase tracking-widest text-slate-300 hover:text-white px-3 py-2"
            >
              The Verdict
            </a>
            <a
              href={`/go/${review.slug}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="px-6 py-2.5 text-xs font-sans font-black uppercase tracking-widest text-slate-950 rounded-md transition-transform hover:scale-105 flex items-center gap-2"
              style={{ 
                backgroundColor: brand.primaryColor === "#00F5A0" ? "#00F5A0" : brand.primaryColor === "#00E5FF" ? "#00E5FF" : brand.primaryColor === "#FF5A00" ? "#FF5A00" : "#7C3AED",
                color: brand.primaryColor === "#FF5A00" ? "#FFFFFF" : "#040D0A"
              }}
            >
              Start Challenge <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 pt-12">
        {/* Affiliate Disclosure Notice */}
        <div className="max-w-4xl mb-12">
          <AffiliateDisclosure />
        </div>

        {/* 3. Pete's Honest Take / Verdict Banner */}
        <div 
          className="bg-white border p-8 md:p-12 mb-20 relative overflow-hidden shadow-xl rounded-2xl group transition-all"
          style={{ borderColor: `${brand.primaryColor}30` }}
        >
          <div 
            className="absolute top-0 right-0 p-8 text-8xl md:text-9xl font-sans font-black select-none uppercase pointer-events-none opacity-5"
            style={{ color: brand.primaryColor }}
          >
            VERDICT
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-center">
            {/* Logo / Name Badge */}
            <div className="lg:w-1/4 flex flex-col items-center border-b lg:border-b-0 lg:border-r border-slate-200 pb-8 lg:pb-0 lg:pr-8 text-center">
              <div className="p-4 bg-slate-900 rounded-xl mb-4 border border-slate-800 shadow-md">
                {brand.logoDarkBg ? (
                  <img 
                    src={brand.logoDarkBg} 
                    alt={brand.brandName} 
                    className="h-8 w-auto object-contain"
                  />
                ) : (
                  <span className="text-white font-black font-sans text-xl uppercase tracking-wider">{brand.brandName}</span>
                )}
              </div>
              <div className="flex items-center gap-1 mb-2 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={cn("w-4 h-4", i < Math.floor(review.rating) ? "fill-current" : "text-slate-300")} />
                ))}
              </div>
              <span className="text-2xl font-sans font-black text-slate-900">{review.rating} / 5.0</span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mt-1">Pete&apos;s Score</span>
            </div>

            {/* Quote */}
            <div className="lg:w-1/2">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-widest" style={{ color: brand.primaryColor }}>
                  {"//"} Pete&apos;s Honest Take
                </span>
              </div>
              <p className="text-lg text-slate-700 leading-relaxed italic mb-0 font-medium">
                &quot;{review.verdict}&quot;
              </p>
            </div>

            {/* CTA */}
            <div className="lg:w-1/4 w-full">
              <a 
                href={`/go/${review.slug}`}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="w-full py-5 text-center text-xs font-sans font-black uppercase tracking-widest text-white rounded-xl shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
                style={{ 
                  backgroundColor: brand.primaryColor === "#00F5A0" ? "#00A382" : brand.primaryColor === "#00E5FF" ? "#0054FE" : brand.primaryColor === "#FF5A00" ? "#C2410C" : "#5B21B6"
                }}
              >
                Start Challenge <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-20">
            {/* 4. Overview Section */}
            <section id="overview" className="scroll-mt-32">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 rounded bg-slate-200 text-slate-700">01 // Overview</span>
                <h2 className="text-3xl font-sans font-black uppercase text-slate-900">
                  Introduction & Background
                </h2>
              </div>
              <div className="prose max-w-none text-slate-700 text-base leading-relaxed space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <p className="whitespace-pre-line leading-relaxed">{review.introduction}</p>
              </div>
            </section>

            {/* 5. Key Stats Specs Grid */}
            <section id="stats" className="scroll-mt-32">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 rounded bg-slate-200 text-slate-700">02 // Specifications</span>
                <h2 className="text-3xl font-sans font-black uppercase text-slate-900">
                  Verified Challenge Parameters
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                {[
                  { label: "Profit Split", value: review.payoutSplit, icon: Percent },
                  { label: "Max Leverage", value: review.maxLeverage, icon: Activity },
                  { label: "Profit Target", value: review.profitTarget, icon: Target },
                  { label: "Max Drawdown", value: review.maxDrawdown, icon: ShieldCheck },
                  { label: "Daily Limit", value: review.dailyDrawdown, icon: AlertCircle },
                  { label: "Entry Fee", value: review.feeStructure, icon: DollarSign },
                ].map((spec, i) => (
                  <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
                    <div className="flex items-center gap-2 text-slate-500">
                      <spec.icon className="w-4 h-4" />
                      <span className="text-[9px] font-mono uppercase tracking-widest">{spec.label}</span>
                    </div>
                    <div className="text-base font-sans font-black text-slate-900 uppercase tracking-tight">
                      {spec.value}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 6. Pros & Cons Cards */}
            <section id="pros-cons" className="scroll-mt-32 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-emerald-50/50 border border-emerald-200 rounded-2xl shadow-sm">
                <h3 className="text-xl font-sans font-black uppercase text-emerald-950 mb-6 flex items-center gap-3">
                  <Check className="w-6 h-6 text-emerald-600 shrink-0" />
                  What We Like
                </h3>
                <ul className="space-y-4">
                  {review.pros.map((pro: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-emerald-900 leading-relaxed font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-8 bg-rose-50/50 border border-rose-200 rounded-2xl shadow-sm">
                <h3 className="text-xl font-sans font-black uppercase text-rose-950 mb-6 flex items-center gap-3">
                  <X className="w-6 h-6 text-rose-600 shrink-0" />
                  What We Don&apos;t Like
                </h3>
                <ul className="space-y-4">
                  {review.cons.map((con: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-rose-900 leading-relaxed font-medium">
                      <span className="w-2 h-2 rounded-full bg-rose-500 mt-2 shrink-0" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* 7. Challenge Structure */}
            <section id="structure" className="scroll-mt-32">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 rounded bg-slate-200 text-slate-700">03 // Challenge</span>
                <h2 className="text-3xl font-sans font-black uppercase text-slate-900">
                  Challenge Structure & Rules
                </h2>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-slate-700 text-base leading-relaxed space-y-6">
                <p className="whitespace-pre-line leading-relaxed">{review.challengeStructure || review.challengeRules}</p>
                {review.feeAndRefund && (
                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl mt-4 text-sm font-medium">
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-500 block mb-1">Registration Fees & Refund Policy</span>
                    {review.feeAndRefund}
                  </div>
                )}
              </div>
            </section>

            {/* 8. Drawdown Rules */}
            <section id="drawdown" className="scroll-mt-32">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 rounded bg-slate-200 text-slate-700">04 // Risk Limits</span>
                <h2 className="text-3xl font-sans font-black uppercase text-slate-900">
                  Drawdown & Loss Rules
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
                  <h4 className="text-sm font-mono font-black uppercase tracking-widest text-red-600 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> Daily Loss Limit
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed m-0 font-medium">
                    {review.dailyDrawdownRules || `Maximum daily loss is strictly limited to ${review.dailyDrawdown}. Calculated relative to balance or equity, whichever is higher.`}
                  </p>
                </div>
                <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
                  <h4 className="text-sm font-mono font-black uppercase tracking-widest text-red-600 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Maximum overall Drawdown
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed m-0 font-medium">
                    {review.maxDrawdownRules || `The maximum overall loss allowed on the account is capped at ${review.maxDrawdown}. Account breach occurs if overall equity falls below this static/trailing floor.`}
                  </p>
                </div>
              </div>
            </section>

            {/* 9. Profit Splits & Scaling */}
            <section id="scaling" className="scroll-mt-32">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 rounded bg-slate-200 text-slate-700">05 // Growth</span>
                <h2 className="text-3xl font-sans font-black uppercase text-slate-900">
                  Splits & Scaling Plans
                </h2>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-slate-700 text-base leading-relaxed space-y-6">
                <p className="whitespace-pre-line leading-relaxed">{review.profitSplitsDetail || `Profit split starts at ${review.payoutSplit}. Higher allocations are achievable upon hitting milestones.`}</p>
                {review.scalingPlan && (
                  <div className="p-8 bg-slate-900 text-white border border-slate-800 rounded-2xl shadow-xl mt-6">
                    <div className="flex items-center gap-2.5 mb-4 text-[#00F5A0]">
                      <TrendingUp className="w-5 h-5 animate-bounce" />
                      <h4 className="text-sm font-sans font-black uppercase m-0">Hyper Scaling Opportunity</h4>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed m-0 font-medium">{review.scalingPlan}</p>
                  </div>
                )}
              </div>
            </section>

            {/* 10. Payout History & Conditions */}
            <section id="payouts" className="scroll-mt-32">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 rounded bg-slate-200 text-slate-700">06 // Payouts</span>
                <h2 className="text-3xl font-sans font-black uppercase text-slate-900">
                  Payout History & Processing Speed
                </h2>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-slate-700 text-base leading-relaxed">
                <p className="whitespace-pre-line leading-relaxed">{review.payoutHistory || `Payouts are processed regularly. Fees refund is processed during the first profit withdrawal stage.`}</p>
              </div>
            </section>

            {/* Alternatives */}
            {review.alternatives && review.alternatives.length > 0 && (
              <section id="alternatives" className="scroll-mt-32 pt-12 border-t border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 rounded bg-slate-200 text-slate-700">07 // Alternatives</span>
                  <h2 className="text-3xl font-sans font-black uppercase text-slate-900">
                    Alternative Choices
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {review.alternatives.map((alt: any) => (
                    <div key={alt.slug} className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-400 transition-all">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <h4 className="text-lg font-sans font-black uppercase tracking-tight text-slate-900">{alt.name}</h4>
                          <span className="text-xs font-mono font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded border border-amber-200">★ {alt.rating.toFixed(1)}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">{alt.bestFor}</p>
                      </div>
                      <div className="pt-6">
                        <Link
                          href={`/prop-firms/${alt.slug}`}
                          className="text-xs font-mono font-bold uppercase tracking-widest text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-1.5"
                        >
                          Read {alt.name} Review <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 11. Final Verdict */}
            <section id="verdict" className="scroll-mt-32 pt-12 border-t border-slate-200">
              <h2 className="text-4xl sm:text-5xl font-sans font-black uppercase text-slate-900 mb-6">
                Pete&apos;s <span className="italic text-slate-600">Verdict</span>
              </h2>
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm mb-8 text-lg font-medium text-slate-800 leading-relaxed">
                <p className="whitespace-pre-line leading-relaxed">{review.verdict}</p>
              </div>
              <a 
                href={`/go/${review.slug}`}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="inline-flex items-center gap-4 text-white px-12 py-5 text-sm font-sans font-black uppercase tracking-widest rounded-xl shadow-xl hover:scale-[1.02] transition-transform"
                style={{ 
                  backgroundColor: brand.primaryColor === "#00F5A0" ? "#00A382" : brand.primaryColor === "#00E5FF" ? "#0054FE" : brand.primaryColor === "#FF5A00" ? "#C2410C" : "#5B21B6"
                }}
              >
                Join {brand.brandName} Program <ExternalLink className="w-4 h-4" />
              </a>
            </section>

            {/* 12. FAQs */}
            {review.faqs && review.faqs.length > 0 && (
              <section id="faq" className="scroll-mt-32 pt-12 border-t border-slate-200">
                <h2 className="text-3xl font-sans font-black uppercase text-slate-900 mb-8 flex items-center gap-3">
                  <HelpCircle className="w-8 h-8 text-slate-700" /> Frequently Asked Questions
                </h2>
                <div className="space-y-6">
                  {review.faqs.map((faq: any, i: number) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight mb-3 flex items-start gap-2">
                        <span className="text-slate-400 font-mono">Q:</span> {faq.question}
                      </h3>
                      <p className="text-sm text-slate-700 leading-relaxed font-medium">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 13. Related items */}
            <section id="related" className="scroll-mt-32 pt-12 border-t border-slate-200">
              <h2 className="text-2xl font-sans font-black uppercase text-slate-900 mb-8">
                Related Resources
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {getRelatedLinks(`/prop-firms/${review.slug}`).map((link, idx) => (
                  <Link 
                    key={idx}
                    href={link.href}
                    className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-slate-400 transition-colors flex flex-col justify-between group shadow-sm"
                  >
                    <div className="space-y-2">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 font-bold">[{link.category}]</span>
                      <h4 className="text-sm font-black uppercase text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">{link.title}</h4>
                    </div>
                    <div className="pt-4 text-[9px] font-mono font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1">
                      Explore Guide <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Lead Magnet */}
            <div className="pt-12 border-t border-slate-200">
              <LeadMagnet 
                resourceId="challenge-checklist"
                title="Download the 30-Day Evaluation Challenge Checklist PDF"
                description="Make sure you stay in line with daily limits, consistency schedules, and profit requirements with our visual tracker checklist."
              />
            </div>
          </div>

          {/* Sidebar / On This Page Navigation */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-8">
              {/* Table of Contents */}
              <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <h4 className="text-xs font-mono font-black uppercase tracking-widest text-slate-400 mb-6">{"//"} ON THIS PAGE</h4>
                <nav className="space-y-3">
                  {[
                    { id: "overview", label: "Introduction" },
                    { id: "stats", label: "Specifications" },
                    { id: "pros-cons", label: "Pros & Cons" },
                    { id: "structure", label: "Structure & Rules" },
                    { id: "drawdown", label: "Drawdown rules" },
                    { id: "scaling", label: "Splits & Scaling" },
                    { id: "payouts", label: "Payout Speeds" },
                    ...(review.alternatives && review.alternatives.length > 0 ? [{ id: "alternatives", label: "Alternatives" }] : []),
                    { id: "verdict", label: "Final Verdict" },
                    ...(review.faqs && review.faqs.length > 0 ? [{ id: "faq", label: "FAQs" }] : []),
                    { id: "related", label: "Related" }
                  ].map((item) => (
                    <a 
                      key={item.id} 
                      href={`#${item.id}`} 
                      className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Direct CTA Sidebar Box */}
              <div className="p-8 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl space-y-6">
                <div className="flex items-center gap-3">
                  {brand.logoDarkBg ? (
                    <img 
                      src={brand.logoDarkBg} 
                      alt={brand.brandName} 
                      className="h-7 w-auto object-contain" 
                    />
                  ) : (
                    <span className="font-black text-white text-base font-sans uppercase tracking-wider">{brand.brandName}</span>
                  )}
                </div>
                <h4 className="text-xl font-sans font-black uppercase text-white leading-tight">Start Trading with {brand.brandName}</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  Begin your path to managing professional capital. Pass the evaluation, claim your fee refund, and split profits.
                </p>
                <a 
                  href={`/go/${review.slug}`}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="w-full py-4 text-center text-xs font-sans font-black uppercase tracking-widest text-slate-950 rounded-xl transition-transform hover:scale-105 flex items-center justify-center gap-2"
                  style={{ 
                    backgroundColor: brand.primaryColor === "#00F5A0" ? "#00F5A0" : brand.primaryColor === "#00E5FF" ? "#00E5FF" : brand.primaryColor === "#FF5A00" ? "#FF5A00" : "#7C3AED",
                    color: brand.primaryColor === "#FF5A00" ? "#FFFFFF" : "#040D0A"
                  }}
                >
                  Start Evaluation <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
