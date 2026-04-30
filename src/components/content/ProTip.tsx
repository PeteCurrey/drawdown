'use client';

import React from 'react';
import { Brain } from 'lucide-react';

interface ProTipProps {
  tip: string;
}

export const ProTip: React.FC<ProTipProps> = ({ tip }) => {
  return (
    <div className="my-8 bg-surface border-l-4 border-profit p-6 md:p-8 rounded-r-lg relative overflow-hidden group">
      <div className="flex items-start gap-4">
        <div className="mt-1 bg-profit/10 p-2 rounded-lg text-profit">
          <Brain size={20} className="animate-pulse" />
        </div>
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-2 block">
            PETE&apos;S TIP
          </span>
          <p className="font-sans text-base md:text-lg text-white italic leading-relaxed">
            &quot;{tip}&quot;
          </p>
        </div>
      </div>
      
      {/* Subtle corner accent */}
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-profit/5 rounded-tl-full blur-2xl pointer-events-none group-hover:bg-profit/10 transition-colors duration-500" />
    </div>
  );
};
