"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ExternalLink, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PartnerOffer {
  id: string;
  name: string;
  domain: string;
  type: "BROKER" | "PROP FIRM";
  badge: string;
  badgeStyle: string;
  headline: string;
  description: string;
  highlights: string[];
  affiliateUrl: string;
  ctaText: string;
  brandColors: {
    bg: string;
    border: string;
    text: string;
    ctaBg: string;
    ctaHover: string;
    ctaText: string;
  };
}

const PARTNER_OFFERS: PartnerOffer[] = [
  {
    id: "pepperstone",
    name: "Pepperstone",
    domain: "pepperstone.com",
    type: "BROKER",
    badge: "FCA REGULATED BROKER",
    badgeStyle: "text-[#00B259] bg-[#00B259]/10 border-[#00B259]/20",
    headline: "Institutional Raw Spreads from 0.0 Pips",
    description: "Pepperstone provides ultra-low latency execution across Forex, Gold, and Indices with full FCA regulation, UK segregated client accounts, and zero dealing desk intervention.",
    highlights: ["FCA Regulated & Segregated Funds", "Spreads from 0.0 pips + low commission", "TradingView, MT4/MT5, cTrader"],
    affiliateUrl: "/go/pepperstone",
    ctaText: "Open Pepperstone Account",
    brandColors: {
      bg: "bg-[#0A0A0A]",
      border: "border-[#1A1A1A]",
      text: "text-white",
      ctaBg: "bg-[#00B259]",
      ctaHover: "hover:bg-[#009249]",
      ctaText: "text-white",
    }
  },
  {
    id: "ftmo",
    name: "FTMO",
    domain: "ftmo.com",
    type: "PROP FIRM",
    badge: "TOP-RATED PROP FIRM",
    badgeStyle: "text-[#00E5FF] bg-[#00E5FF]/10 border-[#00E5FF]/20",
    headline: "Access Up to $200,000 in Capital",
    description: "FTMO is the industry benchmark for proprietary trading evaluations. Trade global markets with up to 90% profit splits, reliable payouts, and institutional execution environments.",
    highlights: ["Up to 90% Profit Split", "Over $100M+ paid out to traders", "Bi-weekly payout options"],
    affiliateUrl: "/go/ftmo",
    ctaText: "Start FTMO Challenge",
    brandColors: {
      bg: "bg-[#1B2A3D]",
      border: "border-[#253A52]",
      text: "text-white",
      ctaBg: "bg-[#00A1FF]",
      ctaHover: "hover:bg-[#0081CC]",
      ctaText: "text-white",
    }
  },
  {
    id: "ig-markets",
    name: "IG Markets",
    domain: "ig.com",
    type: "BROKER",
    badge: "UK SPREAD BETTING LEADER",
    badgeStyle: "text-[#D92C27] bg-[#D92C27]/10 border-[#D92C27]/20",
    headline: "Tax-Free Spread Betting on 17,000+ Markets",
    description: "FTSE 250 listed and FCA regulated since 1974. IG is the premier destination for UK spread betting with 0% Capital Gains Tax and deep liquidity across global indices and FX.",
    highlights: ["100% Tax-Free UK Spread Betting", "FCA Regulated & FTSE 250 Listed", "17,000+ Global Markets"],
    affiliateUrl: "/go/ig-markets",
    ctaText: "Trade Tax-Free on IG",
    brandColors: {
      bg: "bg-white",
      border: "border-[#E5E5E5]",
      text: "text-slate-900",
      ctaBg: "bg-[#D92C27]",
      ctaHover: "hover:bg-[#B9221D]",
      ctaText: "text-white",
    }
  },
  {
    id: "the5ers",
    name: "The5%ers",
    domain: "the5ers.com",
    type: "PROP FIRM",
    badge: "HYPER-GROWTH PROP FIRM",
    badgeStyle: "text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/20",
    headline: "Scale Up to $4,000,000 Funded Capital",
    description: "Designed for disciplined traders seeking long-term funding. The5%ers features hyper-growth scaling plans, low entry fees, and instant live account allocations.",
    highlights: ["Scale up to $4,000,000 capital", "Up to 100% Profit Split", "Real capital allocation"],
    affiliateUrl: "/go/the5ers",
    ctaText: "Explore The5%ers Funding",
    brandColors: {
      bg: "bg-[#111111]",
      border: "border-[#222222]",
      text: "text-white",
      ctaBg: "bg-[#D4AF37]",
      ctaHover: "hover:bg-[#B3932E]",
      ctaText: "text-black",
    }
  },
  {
    id: "ic-markets",
    name: "IC Markets",
    domain: "icmarkets.com",
    type: "BROKER",
    badge: "RAW SPREAD ECN BROKER",
    badgeStyle: "text-[#1DB77A] bg-[#1DB77A]/10 border-[#1DB77A]/20",
    headline: "High-Volume Algorithmic Execution Hub",
    description: "IC Markets is the top choice for automated strategies and high-volume traders. Experience razor-sharp ECN spreads, sub-10ms server latency, and high liquidity depth.",
    highlights: ["True ECN Raw Spreads from 0.0 pips", "Ideal for Algo & Pine Script bots", "Equinix NY4 server connectivity"],
    affiliateUrl: "/go/ic-markets",
    ctaText: "Trade on IC Markets",
    brandColors: {
      bg: "bg-[#000000]",
      border: "border-[#1A1A1A]",
      text: "text-white",
      ctaBg: "bg-[#1DB77A]",
      ctaHover: "hover:bg-[#159A65]",
      ctaText: "text-white",
    }
  }
];

export function AffiliateMarketingSection() {
  const [partner, setPartner] = useState<PartnerOffer>(PARTNER_OFFERS[0]);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    // Randomize selection on client mount so reader sees varied partner offers
    const randomIndex = Math.floor(Math.random() * PARTNER_OFFERS.length);
    setPartner(PARTNER_OFFERS[randomIndex]);
  }, []);

  const isDarkBg = partner.brandColors.bg !== "bg-white";

  return (
    <div className={cn("my-10 p-6 md:p-8 border rounded-none shadow-sm relative font-sans transition-colors duration-300", partner.brandColors.bg, partner.brandColors.border)}>
      
      {/* Top Header Label */}
      <div className={cn("flex items-center justify-between pb-4 border-b mb-6", partner.brandColors.border)}>
        <div className="flex items-center gap-2">
          <span className={cn("px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest border", partner.badgeStyle)}>
            {partner.badge}
          </span>
          <span className={cn("text-[10px] font-mono uppercase tracking-widest", isDarkBg ? "text-slate-400" : "text-slate-500")}>
            // FEATURED PARTNER
          </span>
        </div>
        <span className={cn("text-[9px] font-mono uppercase tracking-wider hidden sm:inline", isDarkBg ? "text-slate-500" : "text-slate-400")}>
          DISCLOSED AFFILIATE
        </span>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Logo + Copy Column */}
        <div className="md:col-span-8 space-y-4">
          <div className="flex items-center gap-4 mb-2">
            {!logoError ? (
              <img 
                src={`https://logo.clearbit.com/${partner.domain}`} 
                alt={`${partner.name} logo`} 
                className="w-10 h-10 object-contain rounded bg-white p-1"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="w-10 h-10 bg-slate-800 flex items-center justify-center rounded text-white font-bold font-display text-lg">
                {partner.name.charAt(0)}
              </div>
            )}
            <h4 className={cn("text-lg md:text-xl font-display font-extrabold uppercase tracking-tight leading-snug", partner.brandColors.text)}>
              {partner.name} — {partner.headline}
            </h4>
          </div>

          <p className={cn("text-xs md:text-sm leading-relaxed", isDarkBg ? "text-slate-300" : "text-slate-600")}>
            {partner.description}
          </p>

          <div className={cn("flex flex-wrap gap-x-4 gap-y-1.5 pt-2 text-xs font-sans", isDarkBg ? "text-slate-300" : "text-slate-700")}>
            {partner.highlights.map((h, i) => (
              <span key={i} className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className={cn("w-3.5 h-3.5 shrink-0", isDarkBg ? "text-emerald-400" : "text-emerald-600")} />
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
            className={cn(
              "w-full py-3 px-5 font-mono font-bold text-xs uppercase tracking-wider rounded-none transition-all text-center flex items-center justify-center gap-2 shadow-md",
              partner.brandColors.ctaBg,
              partner.brandColors.ctaHover,
              partner.brandColors.ctaText
            )}
          >
            {partner.ctaText}
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <span className={cn("text-[9px] font-mono text-center md:text-right mt-2", isDarkBg ? "text-slate-500" : "text-slate-400")}>
            Disclosed referral link • We test every partner
          </span>
        </div>

      </div>

    </div>
  );
}
