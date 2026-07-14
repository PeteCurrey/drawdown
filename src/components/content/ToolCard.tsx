'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Wrench } from 'lucide-react';

interface ToolCardProps {
  toolSlug: string;
  toolName: string;
  description: string;
  features: string[];
  tier: string;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  toolSlug,
  toolName,
  description,
  features,
  tier
}) => {
  return (
    <div className="my-10 bg-surface border border-border rounded-2xl p-6 md:p-8 relative overflow-hidden group hover:border-mkt-bds/30 transition-all duration-300">
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-elevated border border-border rounded-xl group-hover:bg-accent/5 group-hover:border-mkt-bds transition-colors">
            <Wrench size={24} className="text-accent" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 bg-accent/5 border border-accent/20 text-accent rounded">
            {tier}
          </span>
        </div>
        
        <h4 className="font-sans text-xl text-white mb-3 uppercase tracking-tight">
          {toolName}
        </h4>
        <p className="font-sans text-sm text-mkt-i2 leading-relaxed mb-6">
          {description}
        </p>
        
        <div className="space-y-3 mb-8">
          {features.slice(0, 3).map((feature, i) => (
            <div key={i} className="flex items-center gap-3">
              <CheckCircle2 size={14} className="text-accent/40" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-mkt-i4">
                {feature}
              </span>
            </div>
          ))}
        </div>
        
        <Link 
          href={`/tools/${toolSlug}`}
          className="inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest text-accent hover:gap-4 transition-all"
        >
          Try This Tool <ArrowRight size={14} />
        </Link>
      </div>
      
      {/* Decorative background element */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors pointer-events-none" />
    </div>
  );
};
