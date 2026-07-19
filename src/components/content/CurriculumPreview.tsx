'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface CurriculumPreviewProps {
  highlightPhase?: number;
}

const PHASES = [
  {
    number: 1,
    title: 'Ground Zero',
    description: 'Foundations of risk, market mechanics, and the survivor mindset.',
    duration: '2 weeks'
  },
  {
    number: 2,
    title: 'Chart Reader',
    description: 'Master price action, liquidity cycles, and technical intuition.',
    duration: '4 weeks'
  },
  {
    number: 3,
    title: 'Strategist',
    description: 'Developing your edge with high-probability professional setups.',
    duration: '4 weeks'
  },
  {
    number: 4,
    title: 'Risk Manager',
    description: 'Scaling positions, managing drawdown, and professional sizing.',
    duration: 'Ongoing'
  }
];

export const CurriculumPreview: React.FC<CurriculumPreviewProps> = ({ highlightPhase = 1 }) => {
  return (
    <div className="my-12 bg-surface border border-border rounded-2xl p-6 md:p-10 relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-accent mb-2 block">
              // THE DRAWDOWN PATH
            </span>
            <h3 className="font-display text-2xl md:text-3xl text-white m-0">
              professional-grade Curriculum
            </h3>
          </div>
          <Link 
            href="/signup"
            className="group bg-mkt-ink hover:bg-mkt-i2 text-background-primary px-6 py-3 rounded-full font-sans text-sm font-bold flex items-center gap-2 transition-all duration-300"
          >
            Start Phase 1 Free
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PHASES.map((phase) => (
            <div 
              key={phase.number}
              className={`p-5 rounded-xl border transition-all duration-300 ${
                phase.number === highlightPhase 
                  ? 'bg-accent/10 border-accent shadow-[0_0_20px_rgba(0,194,255,0.1)]' 
                  : 'bg-elevated/50 border-border hover:border-text-tertiary'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`font-mono text-xs font-bold ${phase.number === highlightPhase ? 'text-accent' : 'text-mkt-i4'}`}>
                  PHASE 0{phase.number}
                </span>
                {phase.number < highlightPhase && (
                  <CheckCircle2 size={16} className="text-mkt-grn" />
                )}
              </div>
              <h4 className="font-sans text-lg text-white mb-2 uppercase tracking-tight">
                {phase.title}
              </h4>
              <p className="font-sans text-xs text-mkt-i2 leading-relaxed mb-4">
                {phase.description}
              </p>
              <span className="font-mono text-[10px] text-mkt-i4 uppercase">
                {phase.duration}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
};
