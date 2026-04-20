"use client";

import { cn } from "@/lib/utils";
import { Shield, ChevronRight, ExternalLink } from "lucide-react";
import Link from "next/link";

const brokers = [
  {
    id: "ig-markets",
    name: "IG Markets",
    logoPlaceholder: "IG",
    bestFor: "Best for UK spread betting",
    stat: "Spreads from 0.6 pips",
    features: ["FCA Regulated", "Institutional Grade", "Pete's pick"],
    color: "#E11A27"
  },
  {
    id: "pepperstone",
    name: "Pepperstone",
    logoPlaceholder: "PS",
    bestFor: "Best for forex",
    stat: "Raw spreads from 0.0 pips",
    features: ["FCA Regulated", "Fast Execution", "Low Commission"],
    color: "#0032FF"
  },
  {
    id: "ic-markets",
    name: "IC Markets",
    logoPlaceholder: "IC",
    bestFor: "Best for active traders",
    stat: "Ultra-low commissions",
    features: ["Global Depth", "Raw Spreads", "High Leverage"],
    color: "#2C2F36"
  }
];

export function BrokerHubPreview() {
  return (
    <section className="py-24 bg-background-primary relative overflow-hidden">
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
          {brokers.map((broker) => (
            <div 
              key={broker.id}
              className="bg-[#111318] border border-border-slate p-8 flex flex-col justify-between group hover:border-accent/30 transition-premium"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div 
                    className="w-12 h-12 flex items-center justify-center font-display font-black text-white text-xl"
                    style={{ backgroundColor: broker.color }}
                  >
                    {broker.logoPlaceholder}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-profit uppercase">
                    <Shield className="w-3 h-3" /> FCA PROTECTED
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
                href={`/api/market/brokers/redirect?id=${broker.id}&source=home_preview`}
                className="w-full py-4 border border-accent hover:bg-accent hover:text-background-primary transition-premium text-center text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2"
              >
                Open Account <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-12 border-t border-border-slate/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest italic">
            See our full broker Disclosure & Review Methodology at /brokers.
          </p>
          <Link 
            href="/brokers" 
            className="text-xs font-bold uppercase tracking-widest text-text-primary hover:text-accent transition-colors flex items-center gap-2"
          >
            See All Broker Reviews <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
