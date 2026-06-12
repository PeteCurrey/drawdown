"use client";

import { cn } from "@/lib/utils";
import { Shield, ChevronRight, ExternalLink } from "lucide-react";
import Link from "next/link";

import { useRegion } from "@/components/layout/RegionalLayout";
import { brokersAu } from "@/data/brokers-au";
import { brokersUs } from "@/data/brokers-us";
import { brokersSg, brokersHk } from "@/data/brokers-asia";

const ukBrokers = [
  {
    id: "ig-markets",
    name: "IG Markets",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d7/IG_Group_logo.svg",
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
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/2/2a/Pepperstone_Logo.svg",
    logoPlaceholder: "PS",
    bestFor: "Best for forex",
    stat: "Raw spreads from 0.0 pips",
    features: ["FCA Regulated", "Fast Execution", "Low Commission"],
    color: "#0032FF",
    regulation: "FCA PROTECTED"
  },
  {
    id: "ic-markets",
    name: "IC Markets",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9e/IC_Markets_Logo.svg",
    logoPlaceholder: "IC",
    bestFor: "Best for active traders",
    stat: "Ultra-low commissions",
    features: ["Global Depth", "Raw Spreads", "High Leverage"],
    color: "#2C2F36",
    regulation: "GLOBAL DEPTH"
  }
];

interface Broker {
  id: string;
  name: string;
  logoUrl?: string;
  logoPlaceholder: string;
  bestFor: string;
  stat: string;
  features: string[];
  color: string;
  regulation: string;
}

export function BrokerHubPreview() {
  const { region } = useRegion();

  const getRegionalData = (): { brokers: Broker[], link: string } => {
    switch (region) {
      case "au":
        return {
          brokers: brokersAu.slice(0, 3).map(b => ({
            id: b.slug,
            name: b.name,
            logoUrl: b.name.includes("IG") ? "https://upload.wikimedia.org/wikipedia/commons/2/2d/IG_Group_logo.svg" : undefined,
            logoPlaceholder: b.name.substring(0, 2).toUpperCase(),
            bestFor: b.bestFor,
            stat: b.minDeposit === "$0" ? "No Minimum Deposit" : `Min Deposit: ${b.minDeposit}`,
            features: b.features,
            color: b.name.includes("Pepperstone") ? "#0032FF" : b.name.includes("IG") ? "#E11A27" : "#2C2F36",
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
            color: b.name.includes("tastyfx") ? "#E11A27" : b.name.includes("OANDA") ? "#0032FF" : "#2C2F36",
            regulation: "CFTC / NFA"
          })),
          link: "/us/brokers"
        };
      case "sg":
        return {
          brokers: brokersSg.slice(0, 3).map(b => ({
            id: b.slug,
            name: b.name,
            logoUrl: b.name.includes("IG") ? "https://upload.wikimedia.org/wikipedia/commons/2/2d/IG_Group_logo.svg" : undefined,
            logoPlaceholder: b.name.substring(0, 2).toUpperCase(),
            bestFor: b.bestFor,
            stat: b.maxLeverage,
            features: b.features,
            color: b.name.includes("IG") ? "#E11A27" : b.name.includes("Saxo") ? "#0032FF" : "#2C2F36",
            regulation: "MAS REGULATED"
          })),
          link: "/sg/brokers"
        };
      case "hk":
        return {
          brokers: brokersHk.slice(0, 3).map(b => ({
            id: b.slug,
            name: b.name,
            logoUrl: b.name.includes("IG") ? "https://upload.wikimedia.org/wikipedia/commons/2/2d/IG_Group_logo.svg" : undefined,
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
    <section className="py-12 md:py-20 bg-background-primary relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-bold block mb-4">
            // RECOMMENDED BROKERS
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-bold uppercase mb-6">
            Trade With Brokers <br /> We Actually Use.
          </h2>
          <p className="text-sm font-sans text-text-secondary max-w-xl">
            Honest recommendations. No pay-to-play rankings. We may earn a referral fee — but only from platforms we personally trade on.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {regionalBrokers.map((broker) => (
            <div 
              key={broker.id}
              className="bg-background-surface border border-border-slate p-8 flex flex-col justify-between group hover:border-accent/30 transition-premium rounded-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div 
                    className="w-12 h-12 flex items-center justify-center font-display font-black text-white text-xl overflow-hidden bg-white p-1"
                    style={{ backgroundColor: broker.logoUrl ? '#FFFFFF' : broker.color }}
                  >
                    {broker.logoUrl ? (
                      <img src={broker.logoUrl} alt={broker.name} className="w-full h-full object-contain" />
                    ) : (
                      broker.logoPlaceholder
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-profit uppercase">
                    <Shield className="w-3 h-3" /> {broker.regulation}
                  </div>
                </div>

                <h3 className="text-2xl font-display font-bold uppercase mb-2">{broker.name}</h3>
                <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest mb-8">{broker.bestFor}</p>
                
                <div className="py-4 border-y border-border-slate/30 mb-8">
                  <p className="text-sm font-bold text-accent">{broker.stat}</p>
                </div>

                <ul className="space-y-3 mb-10">
                  {broker.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-[10px] font-mono text-text-secondary uppercase tracking-widest">
                      <div className="w-1 h-1 bg-accent" /> {f}
                    </li>
                  ))}
                </ul>
              </div>

              <a 
                href={`/go/${broker.id}`}
                className="w-full py-4 border border-accent hover:bg-accent hover:text-background-primary transition-premium text-center text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 rounded-lg"
              >
                Open Account <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-12 border-t border-border-slate/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest italic">
            See our full broker Disclosure & Review Methodology at {link}.
          </p>
          <Link 
            href={link}
            className="text-sm md:text-xs font-bold uppercase tracking-widest text-text-primary hover:text-accent transition-colors flex items-center gap-2"
          >
            See All Broker Reviews <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
