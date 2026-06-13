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
    <div className="my-8 bg-surface border border-border rounded-xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center justify-between group hover:border-mkt-bds/30 transition-all duration-300">
      <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
        {/* Placeholder Logo */}
        <div className="w-16 h-16 bg-elevated rounded-lg flex items-center justify-center border border-border group-hover:scale-105 transition-transform">
          <span className="font-sans font-black text-2xl text-accent/20">
            {brokerName.charAt(0)}
          </span>
        </div>
        
        <div>
          <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
            <h4 className="font-sans text-xl text-white m-0 uppercase tracking-tight">
              {brokerName}
            </h4>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-profit/10 border border-profit/20 text-[9px] font-mono font-bold text-mkt-grn uppercase tracking-widest">
              <Shield size={10} /> {regulation}
            </div>
          </div>
          <p className="font-mono text-[10px] text-mkt-i4 uppercase tracking-widest mb-1">
            {bestFor}
          </p>
          {stat && (
            <p className="font-sans text-sm text-accent font-bold">
              {stat}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
        <Link 
          href={`/brokers/${brokerSlug}`}
          className="px-6 py-3 border border-border hover:bg-elevated text-white text-xs font-sans font-bold uppercase tracking-widest transition-colors text-center"
        >
          Full Review
        </Link>
        <a 
          href={`/go/${affiliateSlug}`}
          className="px-6 py-3 bg-mkt-ink hover:bg-mkt-i2 text-background-primary text-xs font-sans font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
        >
          Open Account <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
};
