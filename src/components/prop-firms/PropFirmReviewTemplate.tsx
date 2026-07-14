"use client";

import React from "react";
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
  DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AffiliateDisclosure } from "@/components/seo/AffiliateDisclosure";
import { PropFirmReview } from "@/data/seo/prop-firms";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { getRelatedLinks } from "@/lib/linking";
import { LeadMagnet } from "@/components/seo/LeadMagnet";
import { PropSurvivalFloatingWidget } from "@/components/ui/PropSurvivalFloatingWidget";

interface PropFirmReviewTemplateProps {
  review: PropFirmReview;
}

export function PropFirmReviewTemplate({ review }: PropFirmReviewTemplateProps) {
  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Breadcrumbs */}
      <div className="border-b border-mkt-bd/30 py-4 mb-12 pt-32">
        <div className="container mx-auto px-6">
          <Breadcrumbs 
            items={[
              { label: "Prop Firms", href: "/prop-firms" },
              { label: `${review.name} Review`, href: `/prop-firms/${review.slug}` }
            ]}
          />
        </div>
      </div>

      <div className="container mx-auto px-6">
        {/* Header Title */}
        <div className="max-w-4xl mb-12">
          <div className="flex items-center gap-3 text-accent mb-6">
            <div className="w-8 h-[1px] bg-accent" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">{review.eyebrow}</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-sans font-black uppercase mb-8 leading-tight">
            {review.name} Review 2026 — <span className="text-accent italic">Is It Worth It?</span>
          </h1>
          <AffiliateDisclosure />
        </div>

        {/* Quick Verdict Box */}
        <div className="bg-white border border-mkt-bd p-8 md:p-12 mb-24 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 text-9xl font-sans font-black text-accent/5 select-none uppercase pointer-events-none">VERDICT</div>
          <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/4 flex flex-col items-center border-b md:border-b-0 md:border-r border-mkt-bd pb-8 md:pb-0 md:pr-12">
              <div className="w-20 h-20 bg-[#F7F7F7] border border-mkt-bd flex items-center justify-center text-3xl font-black mb-4">
                {review.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex items-center gap-1 mb-2 text-accent">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={cn("w-4 h-4", i < Math.floor(review.rating) ? "fill-current" : "text-mkt-i4")} />
                ))}
              </div>
              <span className="text-2xl font-sans font-black">{review.rating} / 5.0</span>
            </div>
            <div className="md:w-1/2">
              <h3 className="text-xl font-sans font-black uppercase mb-4 flex items-center gap-3">
                <span className="text-accent">{"//"}</span> Pete&apos;s Honest Take
              </h3>
              <p className="text-lg text-mkt-i2 leading-relaxed italic mb-0">
                &quot;{review.verdict}&quot;
              </p>
            </div>
            <div className="md:w-1/4 w-full">
              <a 
                href={`/go/${review.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-5 bg-mkt-ink text-white text-center text-[10px] font-black uppercase tracking-widest hover:bg-accent-hover transition-premium flex items-center justify-center gap-2"
              >
                Start Challenge <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Quick Specs Grid */}
        <div className="mb-24 py-10 px-8 border border-mkt-bd bg-[#F7F7F7]/30">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {[
              { label: "Profit Split", value: review.payoutSplit, icon: Percent },
              { label: "Max Leverage", value: review.maxLeverage, icon: Activity },
              { label: "Profit Target", value: review.profitTarget, icon: Target },
              { label: "Max Drawdown", value: review.maxDrawdown, icon: ShieldCheck },
              { label: "Daily Limit", value: review.dailyDrawdown, icon: AlertCircle },
              { label: "Entry Fee", value: review.feeStructure, icon: DollarSign },
            ].map((spec, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center gap-2 text-mkt-i4">
                  <spec.icon className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-mono uppercase tracking-widest">{spec.label}</span>
                </div>
                <div className="text-base font-sans font-black text-mkt-ink uppercase tracking-tight">
                  {spec.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-24">
            {/* Overview */}
            <section id="overview" className="scroll-mt-32">
              <h2 className="text-3xl font-sans font-black uppercase mb-8 flex items-center gap-4">
                <span className="text-accent text-sm font-mono tracking-tighter">01 //</span> Introduction
              </h2>
              <div className="prose prose-invert prose-slate max-w-none text-mkt-i2 leading-relaxed space-y-6">
                <p className="whitespace-pre-line">{review.introduction}</p>
              </div>
            </section>

            {/* Challenge Structure */}
            <section id="structure" className="scroll-mt-32">
              <h2 className="text-3xl font-sans font-black uppercase mb-8 flex items-center gap-4">
                <span className="text-accent text-sm font-mono tracking-tighter">02 //</span> Challenge Structure
              </h2>
              <div className="prose prose-invert prose-slate max-w-none text-mkt-i2 leading-relaxed space-y-6">
                <p className="whitespace-pre-line">{review.challengeStructure || review.challengeRules}</p>
              </div>
            </section>

            {/* Drawdown Rules */}
            <section id="drawdown" className="scroll-mt-32 space-y-8">
              <h2 className="text-3xl font-sans font-black uppercase flex items-center gap-4">
                <span className="text-accent text-sm font-mono tracking-tighter">03 //</span> Drawdown Rules
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 border border-mkt-bd space-y-4">
                  <h4 className="text-sm font-mono font-black uppercase tracking-widest text-red-500">Daily Loss Limit</h4>
                  <p className="text-sm text-mkt-i2 leading-relaxed m-0">
                    {review.dailyDrawdownRules || `Maximum daily loss is strictly limited to ${review.dailyDrawdown}. Calculated relative to balance or equity, whichever is higher.`}
                  </p>
                </div>
                <div className="p-8 border border-mkt-bd space-y-4">
                  <h4 className="text-sm font-mono font-black uppercase tracking-widest text-red-500">Maximum Drawdown</h4>
                  <p className="text-sm text-mkt-i2 leading-relaxed m-0">
                    {review.maxDrawdownRules || `The maximum overall loss allowed on the account is capped at ${review.maxDrawdown}. Account breach occurs if overall equity falls below this static/trailing floor.`}
                  </p>
                </div>
              </div>
            </section>

            {/* Profit Splits & Scaling */}
            <section id="scaling" className="scroll-mt-32 space-y-8">
              <h2 className="text-3xl font-sans font-black uppercase flex items-center gap-4">
                <span className="text-accent text-sm font-mono tracking-tighter">04 //</span> Splits & Scaling Plans
              </h2>
              <div className="prose prose-invert prose-slate max-w-none text-mkt-i2 leading-relaxed space-y-6">
                <p className="whitespace-pre-line">{review.profitSplitsDetail || `Profit split starts at ${review.payoutSplit}. Higher allocations are achievable upon hitting milestones.`}</p>
                {review.scalingPlan && (
                  <div className="p-8 bg-[#F7F7F7] border border-mkt-bd rounded-sm mt-6">
                    <div className="flex items-center gap-2 mb-4 text-accent">
                      <TrendingUp className="w-5 h-5" />
                      <h4 className="text-sm font-sans font-black uppercase m-0">Hyper Scaling Opportunity</h4>
                    </div>
                    <p className="text-sm text-mkt-i2 leading-relaxed m-0">{review.scalingPlan}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Payout History & Conditions */}
            <section id="payouts" className="scroll-mt-32">
              <h2 className="text-3xl font-sans font-black uppercase mb-8 flex items-center gap-4">
                <span className="text-accent text-sm font-mono tracking-tighter">05 //</span> Payout History & Speed
              </h2>
              <div className="prose prose-invert prose-slate max-w-none text-mkt-i2 leading-relaxed space-y-6">
                <p className="whitespace-pre-line">{review.payoutHistory || `Payouts are processed regularly. Fees refund is processed during the first profit withdrawal stage.`}</p>
              </div>
            </section>

            {/* Pros & Cons */}
            <section id="pros-cons" className="scroll-mt-32 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-xl font-sans font-black uppercase flex items-center gap-3">
                  <span className="text-mkt-grn">{"//"}</span> What We Like
                </h3>
                <ul className="space-y-4">
                  {review.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-mkt-i2 leading-relaxed">
                      <Check className="w-5 h-5 text-mkt-grn mt-0.5 shrink-0" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-6">
                <h3 className="text-xl font-sans font-black uppercase flex items-center gap-3">
                  <span className="text-red-500">{"//"}</span> What We Don&apos;t Like
                </h3>
                <ul className="space-y-4">
                  {review.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-mkt-i2 leading-relaxed">
                      <X className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Alternatives Comparison */}
            {review.alternatives && review.alternatives.length > 0 && (
              <section id="alternatives" className="scroll-mt-32 border-t border-mkt-bd pt-24">
                <h2 className="text-3xl font-sans font-black uppercase mb-8 flex items-center gap-4">
                  <span className="text-accent text-sm font-mono tracking-tighter">06 //</span> Alternatives Comparison
                </h2>
                <p className="text-sm text-mkt-i2 mb-8 leading-relaxed">
                  If {review.name} is not suitable for your trading style, evaluate these alternative funding choices:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {review.alternatives.map((alt) => (
                    <div key={alt.slug} className="p-8 bg-white border border-mkt-bd flex flex-col justify-between hover:border-accent transition-colors">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <h4 className="text-lg font-sans font-black uppercase tracking-tight text-mkt-ink">{alt.name}</h4>
                          <span className="text-xs font-mono font-bold text-accent">★ {alt.rating.toFixed(1)}</span>
                        </div>
                        <div className="space-y-1 text-xs">
                          <p className="text-mkt-i4 m-0 uppercase font-mono tracking-widest text-[8px]">Max Funding: {alt.maxFunding}</p>
                          <p className="text-mkt-i2 leading-relaxed">{alt.bestFor}</p>
                        </div>
                      </div>
                      <div className="pt-6">
                        <Link
                          href={`/prop-firms/${alt.slug}`}
                          className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent hover:text-mkt-ink transition-colors flex items-center gap-1 inline-flex"
                        >
                          Read Review <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Final Verdict */}
            <section id="verdict" className="scroll-mt-32 border-t border-mkt-bd pt-24">
              <h2 className="text-4xl md:text-6xl font-sans font-black uppercase mb-8">Pete&apos;s <span className="text-accent italic">Verdict</span></h2>
              <div className="prose prose-invert prose-slate max-w-none text-mkt-i2 leading-relaxed mb-12">
                <p className="whitespace-pre-line text-lg font-medium">{review.verdict}</p>
              </div>
              <a 
                href={`/go/${review.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-4 bg-mkt-ink text-white px-16 py-6 text-sm font-black uppercase tracking-widest hover:bg-accent-hover transition-premium"
              >
                Join {review.name} Program <ExternalLink className="w-4 h-4" />
              </a>
            </section>

            {/* FAQs */}
            {review.faqs && review.faqs.length > 0 && (
              <section id="faq" className="scroll-mt-32 pt-24 border-t border-mkt-bd">
                <h2 className="text-3xl font-sans font-black uppercase mb-12 flex items-center gap-4">
                  <HelpCircle className="w-8 h-8 text-accent" /> Frequently Asked Questions
                </h2>
                <div className="space-y-8">
                  {review.faqs.map((faq, i) => (
                    <div key={i} className="border-b border-mkt-bd pb-8">
                      <h3 className="text-lg font-bold text-mkt-ink uppercase tracking-tight mb-4">{faq.question}</h3>
                      <p className="text-sm text-mkt-i2 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {/* Related items / Topic clusters */}
            <section id="related" className="scroll-mt-32 pt-24 border-t border-mkt-bd">
              <h2 className="text-3xl font-sans font-black uppercase mb-12 flex items-center gap-4">
                <span className="text-accent text-sm font-mono tracking-tighter">07 //</span> Related Resources
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {getRelatedLinks(`/prop-firms/${review.slug}`).map((link, idx) => (
                  <Link 
                    key={idx}
                    href={link.href}
                    className="p-6 border border-mkt-bd hover:border-accent bg-white flex flex-col justify-between group transition-colors"
                  >
                    <div className="space-y-2">
                      <span className="text-[8px] font-mono uppercase tracking-widest text-accent font-bold">[{link.category}]</span>
                      <h4 className="text-sm font-black uppercase text-mkt-ink group-hover:text-accent transition-colors leading-tight">{link.title}</h4>
                    </div>
                    <div className="pt-4 text-[8px] font-mono font-bold uppercase tracking-widest text-mkt-i4 flex items-center gap-1 inline-flex">
                      Explore <ChevronRight className="w-3.5 h-3.5 text-accent" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Lead Magnet box */}
            <div className="pt-24 border-t border-mkt-bd">
              <LeadMagnet 
                resourceId="challenge-checklist"
                title="Download the 30-Day Evaluation Challenge Checklist PDF"
                description="Make sure you stay in line with daily limits, consistency schedules, and profit requirements with our visual tracker checklist."
              />
            </div>
          </div>

          {/* Sidebar Navigation */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-8">
              <div className="p-8 bg-white border border-mkt-bd">
                <h4 className="text-[10px] font-mono font-black uppercase tracking-widest text-mkt-i4 mb-6">{"//"} ON THIS PAGE</h4>
                <nav className="space-y-4">
                  {[
                    { id: "overview", label: "Introduction" },
                    { id: "structure", label: "Challenge Structure" },
                    { id: "drawdown", label: "Drawdown Rules" },
                    { id: "scaling", label: "Splits & Scaling" },
                    { id: "payouts", label: "Payout Speeds" },
                    { id: "pros-cons", label: "Pros & Cons" },
                    ...(review.alternatives && review.alternatives.length > 0 ? [{ id: "alternatives", label: "Alternatives" }] : []),
                    { id: "verdict", label: "Verdict" },
                    ...(review.faqs && review.faqs.length > 0 ? [{ id: "faq", label: "FAQs" }] : []),
                    { id: "related", label: "Related Resources" }
                  ].map((item) => (
                    <a 
                      key={item.id} 
                      href={`#${item.id}`} 
                      className="block text-[10px] font-bold uppercase tracking-widest text-mkt-i2 hover:text-accent transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>

              <div className="p-8 bg-accent/5 border border-accent/20">
                <h4 className="text-xl font-sans font-black uppercase text-mkt-ink mb-4">Start Challenge</h4>
                <p className="text-xs text-mkt-i2 mb-8 leading-relaxed">
                  Register with {review.name} via Drawdown and begin your path to managing institutional sizes.
                </p>
                <a 
                  href={`/go/${review.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-mkt-ink text-white text-center text-[10px] font-black uppercase tracking-widest hover:bg-accent-hover transition-premium flex items-center justify-center gap-2"
                >
                  Visit Prop Firm <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PropSurvivalFloatingWidget />
    </div>
  );
}
