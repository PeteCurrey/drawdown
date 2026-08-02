"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ExternalLink, ShieldCheck, Award, TrendingUp, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PartnerOffer {
  id: string;
  name: string;
  type: "BROKER" | "PROP FIRM";
  badge: string;
  badgeStyle: string;
  headline: string;
  description: string;
  highlights: string[];
  affiliateUrl: string;
  ctaText: string;
}

const PARTNER_OFFERS: PartnerOffer[] = [
  {
    id: "pepperstone",
    name: "Pepperstone",
    type: "BROKER",
    badge: "FCA REGULATED BROKER",
    badgeStyle: "text-emerald-700 bg-emerald-50 border-emerald-200",
    headline: "Institutional Raw Spreads from 0.0 Pips",
    description: "Pepperstone provides ultra-low latency execution across Forex, Gold, and Indices with full FCA regulation, UK segregated client accounts, and zero dealing desk intervention.",
    highlights: ["FCA Regulated & Segregated Funds", "Spreads from 0.0 pips + low commission", "TradingView, MT4/MT5, cTrader"],
    affiliateUrl: "/go/pepperstone",
    ctaText: "Open Pepperstone Account"
  },
  {
    id: "ftmo",
    name: "FTMO",
    type: "PROP FIRM",
    badge: "TOP-RATED PROP FIRM",
    badgeStyle: "text-indigo-700 bg-indigo-50 border-indigo-200",
    headline: "Access Up to $200,000 in Capital",
    description: "FTMO is the industry benchmark for proprietary trading evaluations. Trade global markets with up to 90% profit splits, reliable payouts, and institutional execution environments.",
    highlights: ["Up to 90% Profit Split", "Over $100M+ paid out to traders", "Bi-weekly payout options"],
    affiliateUrl: "/go/ftmo",
    ctaText: "Start FTMO Challenge"
  },
  {
    id: "ig-markets",
    name: "IG Markets",
    type: "BROKER",
    badge: "UK SPREAD BETTING LEADER",
    badgeStyle: "text-rose-700 bg-rose-50 border-rose-200",
    headline: "Tax-Free Spread Betting on 17,000+ Markets",
    description: "FTSE 250 listed and FCA regulated since 1974. IG is the premier destination for UK spread betting with 0% Capital Gains Tax and deep liquidity across global indices and FX.",
    highlights: ["100% Tax-Free UK Spread Betting", "FCA Regulated & FTSE 250 Listed", "17,000+ Global Markets"],
    affiliateUrl: "/go/ig-markets",
    ctaText: "Trade Tax-Free on IG"
  },
  {
    id: "the5ers",
    name: "The5%ers",
    type: "PROP FIRM",
    badge: "HYPER-GROWTH PROP FIRM",
    badgeStyle: "text-amber-700 bg-amber-50 border-amber-200",
    headline: "Scale Up to $4,000,000 Funded Capital",
    description: "Designed for disciplined traders seeking long-term funding. The5%ers features hyper-growth scaling plans, low entry fees, and instant live account allocations.",
    highlights: ["Scale up to $4,000,000 capital", "Up to 100% Profit Split", "Real capital allocation"],
    affiliateUrl: "/go/the5ers",
    ctaText: "Explore The5%ers Funding"
  },
  {
    id: "ic-markets",
    name: "IC Markets",
    type: "BROKER",
    badge: "RAW SPREAD ECN BROKER",
    badgeStyle: "text-cyan-700 bg-cyan-50 border-cyan-200",
    headline: "High-Volume Algorithmic Execution Hub",
    description: "IC Markets is the top choice for automated strategies and high-volume traders. Experience razor-sharp ECN spreads, sub-10ms server latency, and high liquidity depth.",
    highlights: ["True ECN Raw Spreads from 0.0 pips", "Ideal for Algo & Pine Script bots", "Equinix NY4 server connectivity"],
    affiliateUrl: "/go/ic-markets",
    ctaText: "Trade on IC Markets"
  }
];

export function AffiliateMarketingSection() {
  const [partner, setPartner] = useState<PartnerOffer>(PARTNER_OFFERS[0]);

  useEffect(() => {
    // Randomize selection on client mount so reader sees varied partner offers
    const randomIndex = Math.floor(Math.random() * PARTNER_OFFERS.length);
    setPartner(PARTNER_OFFERS[randomIndex]);
  }, []);

  return (
    <div className="my-10 p-6 md:p-8 bg-slate-50 border border-slate-200 rounded-none text-slate-900 shadow-sm relative font-sans">
      
      {/* Top Header Label */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
        <div className="flex items-center gap-2">
          <span className={cn("px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest border", partner.badgeStyle)}>
            {partner.badge}
          </span>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">// FEATURED PARTNER</span>
        </div>
        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider hidden sm:inline">
          DISCLOSED AFFILIATE
        </span>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Copy Column */}
        <div className="md:col-span-8 space-y-3">
          <h4 className="text-lg md:text-xl font-display font-extrabold text-slate-900 uppercase tracking-tight leading-snug">
            {partner.name} — {partner.headline}
          </h4>

          <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
            {partner.description}
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-2 text-xs text-slate-700 font-sans">
            {partner.highlights.map((h, i) => (
              <span key={i} className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{h}</span>
              </span>
            ))}
          </div>
        </div>

        {/* CTA Column */}
        <div className="md:col-span-4 flex flex-col items-stretch md:items-end justify-center space-y-2">
          <Link
            href={partner.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-5 bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-none transition-all text-center flex items-center justify-center gap-2 shadow-md"
          >
            {partner.ctaText}
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <span className="text-[9px] font-mono text-slate-400 text-center md:text-right">
            Disclosed referral link • We test every partner
          </span>
        </div>

      </div>

    </div>
  );
}
