"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { 
  Shield, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle,
  Star
} from "lucide-react";
import Link from "next/link";

interface BrokerCardProps {
  broker: any;
  index: number;
  region?: string;
}

export function BrokerCard({ broker, index, region = "uk" }: BrokerCardProps) {
  const reviewPath = region === "uk" ? `/brokers/${broker.slug}` : `/${region}/brokers/${broker.slug}`;

  return (
    <div 
      className="bg-white border border-mkt-bd overflow-hidden group hover:border-mkt-bds/30 transition-premium animate-in fade-in slide-in-from-bottom-4 duration-700"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Logo & Rating */}
        <div className="lg:col-span-3 p-10 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-mkt-bd bg-white/30">
          <div className="w-24 h-24 bg-[#F7F7F7] flex items-center justify-center border border-mkt-bd mb-6 shadow-2xl relative overflow-hidden group-hover:scale-105 transition-transform">
             <div className="text-2xl font-sans font-black text-accent/20">{broker.name.charAt(0)}</div>
             {/* In production, use broker.logo if available */}
          </div>
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                className={cn(
                  "w-4 h-4",
                  i < Math.floor(broker.rating) ? "fill-accent text-accent" : "text-border-slate"
                )} 
              />
            ))}
          </div>
          <span className="text-xl font-sans font-bold text-mkt-ink">{broker.rating}/5.0</span>
          <Link 
            href={reviewPath}
            className="mt-6 text-[10px] font-bold uppercase tracking-widest text-mkt-i4 hover:text-accent underline"
          >
            Read Full Review
          </Link>
        </div>

        {/* Main Details */}
        <div className="lg:col-span-6 p-10 space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-3xl font-sans font-bold uppercase mb-1 text-mkt-ink">{broker.name}</h3>
              <p className="text-[10px] font-mono text-accent uppercase tracking-widest">{broker.bestFor || broker.oneLine}</p>
            </div>
            {(broker.fcaRegulated || broker.regulation?.includes("ASIC")) && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-profit/10 border border-profit/20 rounded-none">
                <Shield className="w-3.5 h-3.5 text-mkt-grn" />
                <span className="text-[9px] font-mono font-bold text-mkt-grn uppercase tracking-widest">
                  {broker.regulation || "Regulated"}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-mkt-bd/50">
            <div>
              <p className="text-[9px] font-mono text-mkt-i4 uppercase tracking-widest mb-1">Min Deposit</p>
              <p className="text-sm font-bold font-mono text-mkt-ink">{broker.minDeposit}</p>
            </div>
            <div>
              <p className="text-[9px] font-mono text-mkt-i4 uppercase tracking-widest mb-1">Spreads From</p>
              <p className="text-sm font-bold font-mono text-mkt-ink">{broker.spreads || "0.0 Pips"}</p>
            </div>
            <div>
              <p className="text-[9px] font-mono text-mkt-i4 uppercase tracking-widest mb-1">Platforms</p>
              <p className="text-sm font-bold font-mono text-mkt-ink">{broker.platforms?.length || 0}</p>
            </div>
            <div>
              <p className="text-[9px] font-mono text-mkt-i4 uppercase tracking-widest mb-1">Max Leverage</p>
              <p className="text-sm font-bold font-mono text-mkt-ink">{broker.maxLeverage || "1:30"}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <p className="text-[10px] font-mono text-mkt-grn uppercase tracking-widest flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Core Strengths
              </p>
              <ul className="space-y-2">
                {(broker.features || broker.pros || []).slice(0, 3).map((feature: string, i: number) => (
                  <li key={i} className="text-xs text-mkt-i2 leading-relaxed flex gap-2">
                    <span className="text-mkt-grn">•</span> {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-mono text-mkt-i4 uppercase tracking-widest flex items-center gap-2 font-bold">
                <AlertTriangle className="w-3.5 h-3.5" /> Key Limitation
              </p>
              <p className="text-xs text-mkt-i2 leading-relaxed">
                {broker.description ? broker.description.split('.')[0] + '.' : "Premium tier required for full tool integration."}
              </p>
            </div>
          </div>
        </div>

        {/* CTA Column */}
        <div className="lg:col-span-3 p-10 flex flex-col justify-between bg-[#F7F7F7]/30">
          <div className="space-y-4">
            <p className="text-[9px] font-mono text-mkt-i4 uppercase tracking-widest mb-4">Supported Software</p>
            <div className="flex flex-wrap gap-2">
              {(broker.platforms || []).map((p: string) => (
                <span key={p} className="px-2 py-1 bg-white border border-mkt-bd text-[8px] font-bold uppercase tracking-widest text-mkt-i2">
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4 mt-12 lg:mt-0">
            <a 
              href={broker.affiliateLink || broker.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-5 bg-mkt-ink hover:bg-mkt-i2 text-background-primary text-[10px] font-bold uppercase tracking-widest transition-premium flex items-center justify-center gap-2"
            >
              Visit Broker <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
