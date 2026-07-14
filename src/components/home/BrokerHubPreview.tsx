"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Shield, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import { useRegion } from "@/components/layout/RegionalLayout";
import { brokersAu } from "@/data/brokers-au";
import { brokersUs } from "@/data/brokers-us";
import { brokersSg, brokersHk } from "@/data/brokers-asia";

const ukBrokers = [
  {
    id: "ig-markets",
    name: "IG Markets",
    logoUrl: "/logos/brokers/ig-markets.svg",
    bgUrl: "/images/brokers/ig-bg.png",
    logoPlaceholder: "IG",
    bestFor: "Best for UK spread betting",
    stat: "Spreads from 0.6 pips",
    features: ["FCA Regulated", "Professional-Grade", "Pete's pick"],
    color: "#E11A27",
    regulation: "FCA PROTECTED"
  },
  {
    id: "pepperstone",
    name: "Pepperstone",
    logoUrl: "/logos/brokers/pepperstone.svg",
    bgUrl: "/images/brokers/pepperstone-bg.png",
    logoPlaceholder: "PS",
    bestFor: "Best for forex",
    stat: "Raw spreads from 0.0 pips",
    features: ["FCA Regulated", "Fast Execution", "Low Commission"],
    color: "#0054FE",
    regulation: "FCA PROTECTED"
  },
  {
    id: "ic-markets",
    name: "IC Markets",
    logoUrl: "/logos/brokers/ic-markets.svg",
    bgUrl: "/images/brokers/ic-bg.png",
    logoPlaceholder: "IC",
    bestFor: "Best for active traders",
    stat: "Ultra-low commissions",
    features: ["Global Depth", "Raw Spreads", "High Leverage"],
    color: "#00A382",
    regulation: "GLOBAL DEPTH"
  }
];

function hexToRGBA(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

interface Broker {
  id: string;
  name: string;
  logoUrl?: string;
  bgUrl?: string;
  logoPlaceholder: string;
  bestFor: string;
  stat: string;
  features: string[];
  color: string;
  regulation: string;
}

export function BrokerHubPreview() {
  const { region } = useRegion();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const getRegionalData = (): { brokers: Broker[], link: string } => {
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
            color: b.name.includes("Pepperstone") ? "#0054FE" : b.name.includes("IG") ? "#E11A27" : b.name.includes("IC") ? "#00A382" : "#2C2F36",
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
            color: b.name.includes("tastyfx") ? "#E11A27" : b.name.includes("OANDA") ? "#0054FE" : "#2C2F36",
            regulation: "CFTC / NFA"
          })),
          link: "/us/brokers"
        };
      case "sg":
        return {
          brokers: brokersSg.slice(0, 3).map(b => ({
            id: b.slug,
            name: b.name,
            logoUrl: b.name.includes("IG") ? "/logos/brokers/ig-markets.svg" : undefined,
            logoPlaceholder: b.name.substring(0, 2).toUpperCase(),
            bestFor: b.bestFor,
            stat: b.maxLeverage,
            features: b.features,
            color: b.name.includes("IG") ? "#E11A27" : b.name.includes("Saxo") ? "#0054FE" : "#2C2F36",
            regulation: "MAS REGULATED"
          })),
          link: "/sg/brokers"
        };
      case "hk":
        return {
          brokers: brokersHk.slice(0, 3).map(b => ({
            id: b.slug,
            name: b.name,
            logoUrl: b.name.includes("IG") ? "/logos/brokers/ig-markets.svg" : undefined,
            logoPlaceholder: b.name.substring(0, 2).toUpperCase(),
            bestFor: b.bestFor,
            stat: b.maxLeverage,
            features: b.features,
            color: b.name.includes("IG") ? "#E11A27" : "#2C2F36",
            regulation: "SFC REGULATED"
          })),
          link: "/hk/brokers"
        };
      default:
        return {
          brokers: ukBrokers as Broker[],
          link: "/brokers"
        };
    }
  };

  const { brokers: regionalBrokers, link } = getRegionalData();

  return (
    <section className="py-24 bg-white border-y border-[#E8E8E8] relative overflow-hidden z-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="mb-16 text-center">
          <span className="text-xs font-semibold tracking-widest text-neutral-400 border border-neutral-200 rounded-full px-3 py-1 inline-block uppercase font-sans mb-4">
            // RECOMMENDED BROKERS
          </span>
          <h2 className="text-4xl md:text-5xl font-sans font-bold uppercase mb-4 text-[#0A0A0A] leading-tight">
            Trade With Brokers We Actually Use.
          </h2>
          <p className="text-base font-sans text-neutral-500 max-w-xl mx-auto leading-relaxed">
            Honest recommendations. No pay-to-play rankings. We may earn a referral fee — but only from platforms we personally trade on.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {regionalBrokers.map((broker, idx) => (
            <motion.div 
              key={broker.id}
              className="bg-white border border-neutral-100 rounded-[14px] p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 relative overflow-hidden group"
              style={{
                borderColor: hoveredIdx === idx ? hexToRGBA(broker.color, 0.22) : "rgba(229, 229, 229, 0.7)",
                transform: hoveredIdx === idx ? "translateY(-3px)" : "translateY(0px)"
              }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Image background reveal */}
              <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-[14px]">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out"
                  style={{
                    backgroundImage: broker.bgUrl ? `url(${broker.bgUrl})` : "none",
                    opacity: hoveredIdx === idx ? 0.08 : 0.02,
                    transform: hoveredIdx === idx ? "scale(1.05)" : "scale(1)",
                  }}
                />
                <div 
                  className="absolute inset-0 transition-opacity duration-700 ease-out"
                  style={{
                    background: `linear-gradient(to top right, transparent, ${broker.color})`,
                    opacity: hoveredIdx === idx ? 0.08 : 0
                  }}
                />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  {/* Logo Container */}
                  <div className="h-8 flex items-center justify-start">
                    {broker.logoUrl ? (
                      <img src={broker.logoUrl} alt={broker.name} className="max-h-8 object-contain" />
                    ) : (
                      <span className="font-sans font-semibold text-neutral-900 text-lg uppercase tracking-wider">{broker.logoPlaceholder}</span>
                    )}
                  </div>
                  
                  {/* Regulation Badge */}
                  <span className="text-[11px] font-sans font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full px-2.5 py-0.5 uppercase tracking-wide flex items-center gap-1">
                    <Shield className="w-3 h-3" /> {broker.regulation}
                  </span>
                </div>

                <h3 className="text-xl font-sans font-bold uppercase text-[#0A0A0A] mt-4 mb-1">{broker.name}</h3>
                <p className="text-xs font-sans text-neutral-500 uppercase tracking-widest font-semibold mb-6">{broker.bestFor}</p>
                
                <div className="py-3 border-y border-neutral-100 mb-6">
                  <p className="text-sm font-mono text-[#0A0A0A] font-semibold">{broker.stat}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {broker.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-neutral-600 font-sans">
                      <span className="text-green-600 font-bold">✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>

              <a 
                href={`/go/${broker.id}`}
                className="w-full relative z-10 bg-black hover:bg-neutral-800 text-white rounded-lg py-3 text-sm font-medium text-center transition-colors font-sans flex items-center justify-center gap-2"
              >
                Open Account &rarr;
              </a>
            </motion.div>
          ))}
        </div>

        {/* Disclosure & Footer Links */}
        <div className="mt-12 pt-8 border-t border-neutral-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-neutral-400 font-sans text-center md:text-left">
            Honest recommendations. We may earn a referral fee — disclosed on every link.
          </p>
          <Link 
            href={link}
            className="text-xs font-bold uppercase tracking-widest text-[#0A0A0A] hover:underline flex items-center gap-1.5 font-sans"
          >
            See All Broker Reviews <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
