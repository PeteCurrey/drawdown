'use client';

import React from 'react';

interface StatCalloutProps {
  stat: string;
  context: string;
  source?: string;
}

export const StatCallout: React.FC<StatCalloutProps> = ({ stat, context, source }) => {
  return (
    <div className="my-8 relative overflow-hidden bg-surface border-l-4 border-accent p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col gap-2">
        <span className="font-mono text-4xl md:text-5xl font-bold text-white tracking-tight">
          {stat}
        </span>
        <p className="font-sans text-sm md:text-base text-mkt-i2 max-w-lg leading-relaxed">
          {context}
        </p>
        {source && (
          <span className="mt-4 font-sans text-xs text-mkt-i4 uppercase tracking-widest">
            Source: {source}
          </span>
        )}
      </div>
      
      {/* Subtle background glow */}
      <div className="absolute -right-12 -top-12 w-32 h-32 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};
