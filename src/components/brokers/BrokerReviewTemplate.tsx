"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Shield, Star, Check, X, ExternalLink, ChevronRight, AlertTriangle, HelpCircle, ArrowUpRight, Cpu, Layers, Zap, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { AffiliateDisclosure } from "@/components/seo/AffiliateDisclosure";
import { Broker } from "@/data/brokers";
import { getRelatedLinks } from "@/lib/linking";
import { LeadMagnet } from "@/components/seo/LeadMagnet";
import { BrokerBrandHeader, getBrandConfig } from "@/components/brokers/BrokerBrandHeader";

interface FAQItem {
  question: string;
  answer: string;
}

interface ReviewContent {
  overview: string;
  accountTypes: string;
  platformsTools: string;
  feesCosts: string;
  regulationSafety: string;
  whoShouldUse: string[];
  whoShouldNotUse: string[];
  whoShouldNotUseLong: string;
  verdict: string;
  faqs: FAQItem[];
  fundingMethods?: string;
  suitabilitySummary?: string;
  alternatives?: { name: string; slug: string; rating: number; bestFor: string }[];
}

interface BrokerReviewTemplateProps {
  broker: Broker;
  content: ReviewContent;
  slug: string;
}

export function BrokerReviewTemplate({
  broker,
  content,
  slug
}: BrokerReviewTemplateProps) {
  const brand = getBrandConfig(broker.id || slug);
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
      <BrokerBrandHeader broker={broker} slug={slug} />

      {/* 2. Floating Sticky Navigation Bar on Scroll */}
      <div 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-white/10 transition-all duration-300 transform py-3 px-6 shadow-2xl",
          showStickyBar ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        )}
      >
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Image 
              src={brand.logoDarkBg} 
              alt={brand.brandName} 
              width={140} 
              height={32} 
              className="h-7 w-auto object-contain" 
            />
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-300 border-l border-white/10 pl-4">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="font-bold text-white">{broker.rating}</span>
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
              href={`/go/${broker.slug}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="px-6 py-2.5 text-xs font-sans font-black uppercase tracking-widest text-slate-950 rounded-md transition-transform hover:scale-105 flex items-center gap-2"
              style={{ backgroundColor: brand.primaryColor === "#00FF87" ? "#00FF87" : brand.primaryColor === "#0064FA" ? "#3B82F6" : "#E01B1C", color: brand.primaryColor === "#00FF87" ? "#040D0A" : "#FFFFFF" }}
            >
              Open Account <ExternalLink className="w-3.5 h-3.5" />
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
            {/* Logo Badge */}
            <div className="lg:w-1/4 flex flex-col items-center border-b lg:border-b-0 lg:border-r border-slate-200 pb-8 lg:pb-0 lg:pr-8 text-center">
              <div className="p-4 bg-slate-900 rounded-xl mb-4 border border-slate-800 shadow-md">
                <Image 
                  src={brand.logoDarkBg} 
                  alt={brand.brandName} 
                  width={160} 
                  height={40} 
                  className="h-8 w-auto object-contain"
                />
              </div>
              <div className="flex items-center gap-1 mb-2 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={cn("w-4 h-4", i < Math.floor(broker.rating) ? "fill-current" : "text-slate-300")} />
                ))}
              </div>
              <span className="text-2xl font-sans font-black text-slate-900">{broker.rating} / 5.0</span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mt-1">Pete&apos;s Score</span>
            </div>

            {/* Quote */}
            <div className="lg:w-1/2">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-widest" style={{ color: brand.primaryColor }}>
                  {"//"} Pete&apos;s Honest Verdict
                </span>
              </div>
              <p className="text-lg text-slate-700 leading-relaxed italic mb-0 font-medium">
                &quot;{broker.oneLine}&quot;
              </p>
            </div>

            {/* CTA */}
            <div className="lg:w-1/4 w-full">
              <a 
                href={`/go/${broker.slug}`}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="w-full py-5 text-center text-xs font-sans font-black uppercase tracking-widest text-white rounded-xl shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
                style={{ backgroundColor: brand.primaryColor === "#00FF87" ? "#00A382" : brand.primaryColor === "#0064FA" ? "#0054FE" : "#E01B1C" }}
              >
                Open Live Account <ExternalLink className="w-4 h-4" />
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
                  {brand.brandName} Snapshot
                </h2>
              </div>
              <div className="prose max-w-none text-slate-700 text-base leading-relaxed space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <p className="whitespace-pre-line">{content.overview}</p>
              </div>
            </section>

            {/* 5. Key Stats Specs Table */}
            <section id="stats" className="scroll-mt-32">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 rounded bg-slate-200 text-slate-700">02 // Key Specifications</span>
                <h2 className="text-3xl font-sans font-black uppercase text-slate-900">
                  Verified Data & Specifications
                </h2>
              </div>
              <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-md bg-white">
                <table className="w-full border-collapse">
                  <tbody className="text-xs font-mono uppercase divide-y divide-slate-100">
                    {[
                      { label: "Broker Name", value: broker.name },
                      { label: "Primary Regulation", value: broker.fcaRegulated ? "FCA (UK) Authorized & FSCS Protected (£85k)" : "ASIC (AU) / CySEC (EU) Global Tier-1" },
                      { label: "Minimum Deposit", value: broker.minDeposit },
                      { label: "Spread Model", value: broker.spreads },
                      { label: "Supported Platforms", value: broker.platforms.join(", ") },
                      { label: "Execution Model", value: "No Dealing Desk (NDD) / ECN Liquidity" },
                      { label: "Asset Classes", value: "Forex, Indices, Commodities, Shares, Crypto" }
                    ].map((stat, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="p-5 font-bold border-r border-slate-200 bg-slate-50/70 w-1/3 text-slate-700">{stat.label}</td>
                        <td className="p-5 font-semibold text-slate-900">{stat.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                  {broker.pros.map((pro, i) => (
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
                  {broker.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-rose-900 leading-relaxed font-medium">
                      <span className="w-2 h-2 rounded-full bg-rose-500 mt-2 shrink-0" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* 7. Account Types */}
            <section id="accounts" className="scroll-mt-32">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 rounded bg-slate-200 text-slate-700">03 // Accounts</span>
                <h2 className="text-3xl font-sans font-black uppercase text-slate-900">
                  Account Structure & Options
                </h2>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-slate-700 text-base leading-relaxed">
                <p className="whitespace-pre-line">{content.accountTypes}</p>
              </div>
            </section>

            {/* 8. Platforms & Tools */}
            <section id="platforms" className="scroll-mt-32">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 rounded bg-slate-200 text-slate-700">04 // Technology</span>
                <h2 className="text-3xl font-sans font-black uppercase text-slate-900">
                  Trading Platforms & Software
                </h2>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-slate-700 text-base leading-relaxed space-y-6">
                <p className="whitespace-pre-line">{content.platformsTools}</p>
                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
                  {broker.platforms.map((plat, i) => (
                    <span key={i} className="px-3.5 py-1.5 bg-slate-100 text-slate-800 rounded-lg text-xs font-mono font-bold border border-slate-200">
                      ⚡ {plat}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* 9. Fees & Costs */}
            <section id="fees" className="scroll-mt-32">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 rounded bg-slate-200 text-slate-700">05 // Pricing</span>
                <h2 className="text-3xl font-sans font-black uppercase text-slate-900">
                  Spreads, Commissions & Fee Breakdown
                </h2>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-slate-700 text-base leading-relaxed">
                <p className="whitespace-pre-line">{content.feesCosts}</p>
              </div>
            </section>

            {/* Funding Methods */}
            {content.fundingMethods && (
              <section id="funding" className="scroll-mt-32">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 rounded bg-slate-200 text-slate-700">06 // Payments</span>
                  <h2 className="text-3xl font-sans font-black uppercase text-slate-900">
                    Deposits, Withdrawals & Banking
                  </h2>
                </div>
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-slate-700 text-base leading-relaxed">
                  <p className="whitespace-pre-line">{content.fundingMethods}</p>
                </div>
              </section>
            )}

            {/* 10. Regulation & Safety */}
            <section id="regulation" className="scroll-mt-32">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 rounded bg-slate-200 text-slate-700">07 // Safety</span>
                <h2 className="text-3xl font-sans font-black uppercase text-slate-900">
                  Regulatory Compliance & Trust
                </h2>
              </div>

              <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl mb-8 flex items-start gap-6 shadow-sm">
                <Shield className="w-10 h-10 text-emerald-600 shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-sans font-black uppercase text-emerald-950">
                    {broker.fcaRegulated ? "Directly Authorized by FCA (UK)" : "Globally Regulated Tier-1 Broker"}
                  </h3>
                  <p className="text-sm text-emerald-900 mt-1 leading-relaxed">
                    {broker.fcaRegulated 
                      ? "This broker holds a full Financial Conduct Authority (FCA) license in the UK. Eligible client funds are protected up to £85,000 under the Financial Services Compensation Scheme (FSCS)." 
                      : "Regulated by top-tier authorities (such as ASIC in Australia or CySEC in Europe), maintaining segregated client money accounts with major international banks."}
                  </p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-slate-700 text-base leading-relaxed">
                <p className="whitespace-pre-line">{content.regulationSafety}</p>
              </div>
            </section>

            {/* Suitability Summary */}
            {content.suitabilitySummary && (
              <div className="p-8 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400 block mb-3">{"//"} Trader Suitability Profile</span>
                <p className="text-sm leading-relaxed italic text-slate-200 m-0 font-medium">
                  {content.suitabilitySummary}
                </p>
              </div>
            )}

            {/* 11. Who Should Use / NOT Use */}
            <section id="audience" className="scroll-mt-32 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <h3 className="text-lg font-sans font-black uppercase text-slate-900 mb-6 flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-600" /> Ideal Fit For
                </h3>
                <ul className="space-y-4">
                  {content.whoShouldUse.map((item, i) => (
                    <li key={i} className="text-xs font-bold text-slate-800 uppercase tracking-tight flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <h3 className="text-lg font-sans font-black uppercase text-slate-900 mb-6 flex items-center gap-3">
                  <X className="w-5 h-5 text-rose-600" /> Not Recommended For
                </h3>
                <ul className="space-y-4">
                  {content.whoShouldNotUse.map((item, i) => (
                    <li key={i} className="text-xs font-bold text-slate-600 uppercase tracking-tight flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section id="who-not" className="scroll-mt-32 p-8 bg-rose-50 border border-rose-200 rounded-2xl">
               <h3 className="text-lg font-sans font-black uppercase mb-4 flex items-center gap-3 text-rose-950">
                 <AlertTriangle className="w-5 h-5 text-rose-600" /> Who Should NOT Choose {broker.name}?
               </h3>
               <p className="text-sm text-rose-900 leading-relaxed italic font-medium m-0">
                 {content.whoShouldNotUseLong}
               </p>
            </section>

            {/* Alternatives */}
            {content.alternatives && content.alternatives.length > 0 && (
              <section id="alternatives" className="scroll-mt-32 pt-12 border-t border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 rounded bg-slate-200 text-slate-700">08 // Alternatives</span>
                  <h2 className="text-3xl font-sans font-black uppercase text-slate-900">
                    Top Alternative Brokers
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {content.alternatives.map((alt) => (
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
                          href={`/brokers/${alt.slug}`}
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

            {/* 12. Final Verdict */}
            <section id="verdict" className="scroll-mt-32 pt-12 border-t border-slate-200">
              <h2 className="text-4xl sm:text-5xl font-sans font-black uppercase text-slate-900 mb-6">
                The Final <span className="italic text-slate-600">Verdict</span>
              </h2>
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm mb-8 text-lg font-medium text-slate-800 leading-relaxed">
                <p className="whitespace-pre-line">{content.verdict}</p>
              </div>
              <a 
                href={`/go/${broker.slug}`}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="inline-flex items-center gap-4 text-white px-12 py-5 text-sm font-sans font-black uppercase tracking-widest rounded-xl shadow-xl hover:scale-[1.02] transition-transform"
                style={{ backgroundColor: brand.primaryColor === "#00FF87" ? "#00A382" : brand.primaryColor === "#0064FA" ? "#0054FE" : "#E01B1C" }}
              >
                Join {brand.brandName} Today <ExternalLink className="w-4 h-4" />
              </a>
            </section>

            {/* 13. FAQs */}
            <section id="faq" className="scroll-mt-32 pt-12 border-t border-slate-200">
              <h2 className="text-3xl font-sans font-black uppercase text-slate-900 mb-8 flex items-center gap-3">
                <HelpCircle className="w-8 h-8 text-slate-700" /> Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                {content.faqs.map((faq, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight mb-3 flex items-start gap-2">
                      <span className="text-slate-400 font-mono">Q:</span> {faq.question}
                    </h3>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Related items */}
            <section id="related" className="scroll-mt-32 pt-12 border-t border-slate-200">
              <h2 className="text-2xl font-sans font-black uppercase text-slate-900 mb-8">
                Related Broker Resources
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {getRelatedLinks(`/brokers/${slug}`).map((link, idx) => (
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
                resourceId="risk-guide"
                title="Download Pete's Risk Management Playbook"
                description="Equip yourself with the exact position sizing sheet and volatility boundaries that our desk utilizes daily."
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
                    { id: "overview", label: "Overview" },
                    { id: "stats", label: "Specifications" },
                    { id: "pros-cons", label: "Pros & Cons" },
                    { id: "accounts", label: "Account Types" },
                    { id: "platforms", label: "Platforms & Tech" },
                    { id: "fees", label: "Fees & Spreads" },
                    ...(content.fundingMethods ? [{ id: "funding", label: "Banking & Funding" }] : []),
                    { id: "regulation", label: "Regulation & Safety" },
                    ...(content.alternatives && content.alternatives.length > 0 ? [{ id: "alternatives", label: "Top Alternatives" }] : []),
                    { id: "verdict", label: "Final Verdict" },
                    { id: "faq", label: "FAQs" }
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

              {/* Direct Broker CTA Sidebar Box */}
              <div className="p-8 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl space-y-6">
                <div className="flex items-center gap-3">
                  <Image 
                    src={brand.logoDarkBg} 
                    alt={brand.brandName} 
                    width={140} 
                    height={32} 
                    className="h-7 w-auto object-contain" 
                  />
                </div>
                <h4 className="text-xl font-sans font-black uppercase text-white leading-tight">Start Trading with {brand.brandName}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Access institutional-grade liquidity, fast execution, and transparent pricing.
                </p>
                <a 
                  href={`/go/${broker.slug}`}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="w-full py-4 text-center text-xs font-sans font-black uppercase tracking-widest text-slate-950 rounded-xl transition-transform hover:scale-105 flex items-center justify-center gap-2"
                  style={{ backgroundColor: brand.primaryColor === "#00FF87" ? "#00FF87" : brand.primaryColor === "#0064FA" ? "#3B82F6" : "#E01B1C", color: brand.primaryColor === "#00FF87" ? "#040D0A" : "#FFFFFF" }}
                >
                  Visit Official Site <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
