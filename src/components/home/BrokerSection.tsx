"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";
import { useRegion } from "@/components/layout/RegionalLayout";
import { brokersAu } from "@/data/brokers-au";
import { brokersUs } from "@/data/brokers-us";
import { brokersSg, brokersHk } from "@/data/brokers-asia";

const ukBrokers = [
  {
    id: "ig",
    name: "IG Markets",
    logoUrl: "/logos/brokers/ig-markets.svg",
    bestFor: "Best for UK spread betting",
    stat: "Spreads from 0.6 pips",
    features: ["FCA Regulated", "Professional Grade"],
    regulation: "FCA PROTECTED"
  },
  {
    id: "pepperstone",
    name: "Pepperstone",
    logoUrl: "/logos/brokers/pepperstone.svg",
    bestFor: "Best for forex",
    stat: "Raw spreads from 0.0 pips",
    features: ["FCA Regulated", "Fast Execution", "Low Commission"],
    regulation: "FCA PROTECTED"
  },
  {
    id: "ic-markets",
    name: "IC Markets",
    logoUrl: "/logos/brokers/ic-markets.svg",
    bestFor: "Best for active traders",
    stat: "Ultra-low commissions",
    features: ["Global Depth", "Raw Spreads", "High Leverage"],
    regulation: "GLOBAL DEPTH"
  }
];

const brokerBranding: Record<string, { bg: string; glow: string; border: string }> = {
  "ig": {
    bg: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80",
    glow: "rgba(227, 6, 19, 0.15)",
    border: "#E30613"
  },
  "tastyfx": {
    bg: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80",
    glow: "rgba(240, 60, 60, 0.15)",
    border: "#F03C3C"
  },
  "pepperstone": {
    bg: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=600&q=80",
    glow: "rgba(0, 229, 201, 0.15)",
    border: "#00E5C9"
  },
  "ic-markets": {
    bg: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
    glow: "rgba(176, 255, 0, 0.15)",
    border: "#B0FF00"
  },
  "oanda": {
    bg: "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=600&q=80",
    glow: "rgba(255, 121, 0, 0.15)",
    border: "#FF7900"
  },
  "forex-com": {
    bg: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80",
    glow: "rgba(0, 162, 255, 0.15)",
    border: "#00A2FF"
  },
  "interactive-brokers": {
    bg: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80",
    glow: "rgba(255, 46, 46, 0.15)",
    border: "#FF2E2E"
  }
};

const defaultBranding = {
  bg: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
  glow: "rgba(10, 37, 64, 0.08)",
  border: "var(--ink-950)"
};

export function BrokerSection() {
  const { region } = useRegion();
  const [hoveredBrokerId, setHoveredBrokerId] = useState<string | null>(null);

  const getRegionalData = () => {
    switch (region) {
      case "au":
        return {
          brokers: brokersAu.slice(0, 3).map(b => ({
            id: b.slug,
            name: b.name,
            logoUrl: b.name.includes("IG") ? "/logos/brokers/ig-markets.svg" : b.name.includes("Pepperstone") ? "/logos/brokers/pepperstone.svg" : b.name.includes("IC Markets") ? "/logos/brokers/ic-markets.svg" : undefined,
            logoPlaceholder: b.name.substring(0, 2).toUpperCase(),
            bestFor: b.bestFor,
            stat: b.minDeposit === "$0" ? "No Minimum Deposit" : `Min Deposit: ${b.minDeposit}`,
            features: b.features,
            regulation: "ASIC REGULATED"
          })),
          link: "/au/brokers"
        };
      case "us":
        return {
          brokers: brokersUs.slice(0, 3).map(b => ({
            id: b.slug,
            name: b.name,
            logoUrl: undefined,
            logoPlaceholder: b.name.substring(0, 2).toUpperCase(),
            bestFor: b.bestFor,
            stat: b.maxLeverage,
            features: b.features,
            regulation: "CFTC / NFA"
          })),
          link: "/us/brokers"
        };
      default:
        return {
          brokers: ukBrokers,
          link: "/brokers"
        };
    }
  };

  const { brokers, link } = getRegionalData();

  return (
    <section
      className="w-full py-24 border-b select-none relative z-10"
      style={{ backgroundColor: "var(--paper-0)", borderColor: "var(--line-200)" }}
    >
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* Section Heading */}
        <div className="mb-16">
          <span
            className="block text-[11px] font-mono uppercase tracking-[0.08em] mb-3"
            style={{ color: "var(--graphite-600)" }}
          >
            Broker recommendations
          </span>
          <h2
            className="font-display text-[clamp(1.75rem,4vw,3rem)] leading-tight tracking-[-0.02em] font-semibold mb-4"
            style={{ color: "var(--ink-950)" }}
          >
            Recommended Brokers
          </h2>
          <p
            className="text-[15px] leading-relaxed max-w-xl font-sans"
            style={{ color: "var(--graphite-600)" }}
          >
            Honest recommendations, ranked on merit. Where our founder holds a live account, we say so. We may earn a referral fee — disclosed on every link.
          </p>
        </div>

        {/* Broker Cards Grid — zero border-radius, hairline borders, plain text regulatory labels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {brokers.map((broker) => {
            const brand = brokerBranding[broker.id] || defaultBranding;
            const isHovered = hoveredBrokerId === broker.id;

            return (
              <div
                key={broker.id}
                className="border p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300"
                onMouseEnter={() => setHoveredBrokerId(broker.id)}
                onMouseLeave={() => setHoveredBrokerId(null)}
                style={{
                  backgroundColor: "var(--paper-100)",
                  borderColor: isHovered ? brand.border : "var(--line-200)",
                  borderRadius: 0,
                  boxShadow: isHovered ? `0 0 24px ${brand.glow}, inset 0 0 12px ${brand.glow}` : "none",
                }}
              >
                {/* Brand-Matching Background Image Layer */}
                <div 
                  className="absolute inset-0 z-0 transition-all duration-500 pointer-events-none"
                  style={{
                    backgroundImage: `url(${brand.bg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: isHovered ? 0.12 : 0.03,
                    mixBlendMode: "luminosity",
                  }}
                />

                {/* Content Layer */}
                <div className="relative z-10 flex flex-col justify-between h-full w-full">
                  <div>
                    {/* Header: Logo / Name + Plain Text Regulation Label */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b" style={{ borderColor: "var(--line-200)" }}>
                      <div className="h-6 flex items-center">
                        {broker.logoUrl ? (
                          <img src={broker.logoUrl} alt={broker.name} className="h-6 object-contain" />
                        ) : (
                          <span className="font-mono font-bold text-[14px]" style={{ color: "var(--ink-950)" }}>
                            {(broker as any).logoPlaceholder || broker.name}
                          </span>
                        )}
                      </div>
                      {/* Regulatory label — plain text, no pill/badge */}
                      <span className="text-[11px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--graphite-600)" }}>
                        {broker.regulation}
                      </span>
                    </div>

                    <h3 className="text-[16px] font-medium font-sans mb-1" style={{ color: "var(--ink-950)" }}>
                      {broker.name}
                    </h3>
                    <p className="text-[12px] font-sans mb-4" style={{ color: "var(--graphite-600)" }}>
                      {broker.bestFor}
                    </p>

                    <div className="py-2 border-y mb-6" style={{ borderColor: "var(--line-200)" }}>
                      <span className="text-[13px] font-mono tabular font-medium" style={{ color: "var(--ink-950)" }}>
                        {broker.stat}
                      </span>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-2 mb-8">
                      {broker.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-[13px] font-sans" style={{ color: "var(--graphite-600)" }}>
                          <Check size={14} strokeWidth={1.5} style={{ color: "var(--ink-950)" }} />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button — zero radius */}
                  <a
                    href={`/go/${broker.id}`}
                    target="_blank"
                    rel="noopener sponsored"
                    className="w-full py-3 text-[13px] font-medium text-center border transition-all duration-150 flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: "var(--signal-navy)",
                      color: "#FAFAF9",
                      borderColor: "var(--signal-navy)",
                      borderRadius: 0,
                    }}
                  >
                    Open Account
                    <ChevronRight size={14} strokeWidth={1.5} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Prominent Disclosure */}
        <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: "var(--line-200)" }}>
          <p className="text-[12px] font-sans" style={{ color: "var(--graphite-600)" }}>
            Honest recommendations. We may earn a referral fee — disclosed on every link.
          </p>
          <Link
            href={link}
            className="text-[12px] font-mono uppercase tracking-[0.08em] flex items-center gap-1 hover:underline"
            style={{ color: "var(--ink-950)" }}
          >
            See All Broker Reviews <ChevronRight size={14} strokeWidth={1.5} />
          </Link>
        </div>

      </div>
    </section>
  );
}
