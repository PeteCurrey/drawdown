"use client";

import { useState } from "react";
import { Shield, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRegion } from "@/components/layout/RegionalLayout";
import { brokersAu } from "@/data/brokers-au";
import { brokersUs } from "@/data/brokers-us";
import { brokersSg, brokersHk } from "@/data/brokers-asia";
import { cn } from "@/lib/utils";

const ukBrokers = [
  {
    id: "ig-markets",
    name: "IG Markets",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ea/IG_Logo.svg",
    bgUrl: "/images/brokers/ig-bg.png",
    logoPlaceholder: "IG",
    bestFor: "Best for UK spread betting",
    stat: "Spreads from 0.6 pips",
    features: ["FCA Regulated", "Institutional Grade", "Pete's pick"],
    color: "#E11A27",
    regulation: "FCA PROTECTED"
  },
  {
    id: "pepperstone",
    name: "Pepperstone",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/23/Pepperstone_logo.svg",
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
    logoUrl: "https://cdn.icmarkets.com/uploads/IC-logo-fsa.png",
    bgUrl: "/images/brokers/ic-bg.png",
    logoPlaceholder: "IC",
    bestFor: "Best for active traders",
    stat: "Ultra-low commissions",
    features: ["Global Depth", "Raw Spreads", "High Leverage"],
    color: "#00A382",
    regulation: "GLOBAL DEPTH"
  }
];

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

function hexToRGBA(hex: string, alpha: number) {
  const cleanHex = hex.replace("#", "");
  // fallback if shorthand hex
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function BrokerSection() {
  const { region } = useRegion();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const getRegionalData = (): { brokers: Broker[], link: string } => {
    switch (region) {
      case "au":
        return {
          brokers: brokersAu.slice(0, 3).map(b => ({
            id: b.slug,
            name: b.name,
            logoUrl: b.name.includes("IG") ? "https://upload.wikimedia.org/wikipedia/commons/e/ea/IG_Logo.svg" : b.name.includes("Pepperstone") ? "https://upload.wikimedia.org/wikipedia/commons/2/23/Pepperstone_logo.svg" : b.name.includes("IC Markets") ? "https://cdn.icmarkets.com/uploads/IC-logo-fsa.png" : undefined,
            bgUrl: b.name.includes("IG") ? "/images/brokers/ig-bg.png" : b.name.includes("Pepperstone") ? "/images/brokers/pepperstone-bg.png" : b.name.includes("IC Markets") ? "/images/brokers/ic-bg.png" : undefined,
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
            bgUrl: b.name.includes("tastyfx") ? "/images/brokers/ig-bg.png" : b.name.includes("OANDA") ? "/images/brokers/pepperstone-bg.png" : undefined,
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
            logoUrl: b.name.includes("IG") ? "https://upload.wikimedia.org/wikipedia/commons/e/ea/IG_Logo.svg" : undefined,
            bgUrl: b.name.includes("IG") ? "/images/brokers/ig-bg.png" : b.name.includes("Saxo") ? "/images/brokers/pepperstone-bg.png" : undefined,
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
            logoUrl: b.name.includes("IG") ? "https://upload.wikimedia.org/wikipedia/commons/e/ea/IG_Logo.svg" : undefined,
            bgUrl: b.name.includes("IG") ? "/images/brokers/ig-bg.png" : undefined,
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

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.5,
        ease: "easeOut" as const
      }
    })
  };

  return (
    <section className="w-full bg-white border-b border-mkt-bd py-24 select-none relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="mb-16 text-center">
          <span className="text-[11px] font-sans font-bold text-mkt-i4 uppercase tracking-widest block mb-4">
            // RECOMMENDED BROKERS
          </span>
          <h2 className="text-3xl md:text-5xl font-sans font-extrabold text-mkt-ink tracking-tight mb-4">
            Trade with brokers we actually use
          </h2>
          <p className="text-base text-mkt-i3 max-w-xl mx-auto font-sans">
            Honest recommendations. No pay-to-play rankings. We may earn a referral fee — but only from platforms we personally trade on.
          </p>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {regionalBrokers.map((broker, idx) => {
            const isHovered = hoveredIdx === idx;
            const brandColor = broker.color || "#2C2F36";
            
            return (
              <motion.div 
                key={broker.id}
                custom={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-20px" }}
                variants={cardVariants}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="border rounded-[14px] p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 relative overflow-hidden group"
                style={{
                  backgroundColor: "white",
                  borderColor: isHovered ? hexToRGBA(brandColor, 0.22) : "rgba(229, 229, 229, 0.7)",
                  transform: isHovered ? "translateY(-3px)" : "translateY(0px)"
                }}
              >
                {/* Image background reveal */}
                <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-[14px]">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out"
                    style={{
                      backgroundImage: broker.bgUrl ? `url(${broker.bgUrl})` : "none",
                      opacity: isHovered ? 0.08 : 0.02,
                      transform: isHovered ? "scale(1.05)" : "scale(1)",
                    }}
                  />
                  <div 
                    className="absolute inset-0 transition-opacity duration-700 ease-out"
                    style={{
                      background: `linear-gradient(to top right, transparent, ${brandColor})`,
                      opacity: isHovered ? 0.08 : 0
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
                        <span 
                          className="font-sans font-extrabold text-lg uppercase tracking-wider transition-colors duration-300"
                          style={{ color: brandColor }}
                        >
                          {broker.logoPlaceholder}
                        </span>
                      )}
                    </div>
                    
                    {/* Regulation Badge */}
                    <span className="text-[10px] font-sans font-bold text-mkt-grn bg-mkt-gbg border border-mkt-gbd rounded-full px-2.5 py-0.5 uppercase tracking-wide flex items-center gap-1">
                      <Shield className="w-3 h-3" /> {broker.regulation}
                    </span>
                  </div>

                  <h3 className="text-xl font-sans font-bold text-mkt-ink leading-tight mt-6 mb-1">{broker.name}</h3>
                  <p className="text-[10px] font-sans font-bold text-mkt-i4 uppercase tracking-widest mb-6">{broker.bestFor}</p>
                  
                  <div className="py-3 border-y border-neutral-100 mb-6">
                    <p className="text-sm font-mono text-mkt-ink font-semibold">{broker.stat}</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {broker.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-mkt-i3 font-sans">
                        <span className="text-mkt-grn font-bold">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <a 
                  href={`/go/${broker.id}`}
                  className="w-full relative z-10 text-white rounded-lg py-3 text-sm font-semibold text-center transition-all font-sans flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: isHovered ? brandColor : "#0A0A0A"
                  }}
                >
                  Open Account &rarr;
                </a>
              </motion.div>
            );
          })}
        </div>

        {/* Disclosure & Footer Links */}
        <div className="mt-12 pt-8 border-t border-neutral-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-mkt-i4 font-sans text-center md:text-left">
            Honest recommendations. We may earn a referral fee — disclosed on every link.
          </p>
          <Link 
            href={link}
            className="text-xs font-sans font-bold uppercase tracking-widest text-mkt-ink hover:underline flex items-center gap-1.5"
          >
            See All Broker Reviews <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
