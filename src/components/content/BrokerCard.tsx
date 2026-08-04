'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink, Shield } from 'lucide-react';

interface BrokerCardProps {
  brokerSlug: string;
  brokerName: string;
  bestFor: string;
  regulation: string;
  affiliateSlug: string;
  stat?: string;
}

export const BrokerCard: React.FC<BrokerCardProps> = ({
  brokerSlug,
  brokerName,
  bestFor,
  regulation,
  affiliateSlug,
  stat
}) => {
  return (
    <div 
      className="my-8 p-6 md:p-8 border flex flex-col md:flex-row gap-6 items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
      style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}
    >
      <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
        <div 
          className="w-14 h-14 border flex items-center justify-center font-display font-bold text-2xl shrink-0"
          style={{ backgroundColor: "var(--paper-0)", borderColor: "var(--line-200)", color: "var(--signal-navy)" }}
        >
          {brokerName.charAt(0)}
        </div>
        
        <div className="space-y-1">
          <div className="flex flex-col md:flex-row items-center gap-2">
            <h4 className="font-display text-xl font-semibold uppercase tracking-tight" style={{ color: "var(--ink-950)" }}>
              {brokerName}
            </h4>
            <span 
              className="flex items-center gap-1 px-2 py-0.5 border text-[10px] font-mono font-bold uppercase tracking-[0.08em]"
              style={{ backgroundColor: "var(--paper-0)", borderColor: "var(--line-200)", color: "var(--signal-navy)" }}
            >
              <Shield size={11} /> {regulation}
            </span>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.08em]" style={{ color: "var(--graphite-600)" }}>
            {bestFor}
          </p>
          {stat && (
            <p className="font-sans text-xs font-semibold pt-1" style={{ color: "var(--signal-navy)" }}>
              {stat}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
        <Link 
          href={`/brokers/${brokerSlug}`}
          className="px-5 py-2.5 border text-xs font-mono font-bold uppercase tracking-[0.08em] transition-colors text-center"
          style={{ backgroundColor: "var(--paper-0)", borderColor: "var(--line-200)", color: "var(--ink-950)" }}
        >
          Full Review
        </Link>
        <a 
          href={`/go/${affiliateSlug}`}
          className="px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-[0.08em] transition-colors flex items-center justify-center gap-2"
          style={{ backgroundColor: "var(--signal-navy)", color: "#FAFAF9" }}
          rel="sponsored"
        >
          Open Account <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
};

