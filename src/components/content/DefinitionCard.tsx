'use client';

import React from 'react';

interface DefinitionCardProps {
  term: string;
  definition: string;
  category?: string;
}

export const DefinitionCard: React.FC<DefinitionCardProps> = ({ term, definition, category }) => {
  return (
    <div className="my-8 bg-surface border-2 border-accent/20 rounded-xl p-8 relative overflow-hidden animate-in fade-in">
      <div className="relative z-10">
        {category && (
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-4 block">
            // {category}
          </span>
        )}
        <h2 className="font-display text-3xl md:text-4xl text-white mb-4 m-0 leading-tight">
          {term}
        </h2>
        <p className="font-sans text-lg md:text-xl text-text-primary leading-relaxed max-w-3xl">
          {definition}
        </p>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
    </div>
  );
};
