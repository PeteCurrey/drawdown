"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trophy, Award, ArrowRight, ShieldCheck, Zap, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhaseCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  phaseNumber: number;
  phaseSlug: string;
  phaseName: string;
}

export function PhaseCompletionModal({
  isOpen,
  onClose,
  phaseNumber,
  phaseSlug,
  phaseName
}: PhaseCompletionModalProps) {
  if (!isOpen) return null;

  const showFundedTeaser = phaseNumber >= 4;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background-primary/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl bg-background-surface border border-emerald-500/30 rounded-xl p-8 shadow-2xl shadow-emerald-500/10 text-center space-y-6 animate-in zoom-in-95 duration-300 overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-tertiary hover:text-text-primary p-2 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Milestone Icon */}
        <div className="relative mx-auto w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
          <Trophy className="w-10 h-10 animate-bounce" />
        </div>

        {/* Header */}
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Zap className="w-3 h-3" /> Phase {phaseNumber} Complete
          </span>
          <h2 className="text-3xl font-display font-black uppercase text-text-primary">
            You&apos;ve Mastered {phaseName}!
          </h2>
          <p className="text-sm text-text-secondary max-w-md mx-auto">
            Outstanding discipline. You have passed all module quizzes in Phase {phaseNumber} and demonstrated verified retention of market mechanics.
          </p>
        </div>

        {/* Certificate Banner */}
        <div className="p-4 bg-background-primary/50 border border-border-slate/50 rounded-lg flex items-center justify-between text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-mono font-bold text-text-primary">Verified Certificate Earned</p>
              <p className="text-[10px] text-text-tertiary font-mono">DDT-{phaseSlug.toUpperCase()}-VERIFIED</p>
            </div>
          </div>
          <Link
            href={`/dashboard/curriculum/certificate/${phaseSlug}`}
            className="px-4 py-2 bg-accent/10 border border-accent/30 text-accent text-xs font-mono font-bold uppercase tracking-wider rounded hover:bg-accent/20 transition-all"
          >
            View Certificate
          </Link>
        </div>

        {/* Funded Pathway Teaser for Phase 4+ */}
        {showFundedTeaser && (
          <div className="p-5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-xl text-left space-y-3">
            <div className="flex items-center gap-2 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
              <h4 className="text-sm font-display font-bold uppercase">Funded Pathway Unlocked</h4>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              With Risk Manager completed, you meet the baseline criteria to enter the **Drawdown Funded Pathway**. Evaluate your edge with institutional capital backing up to £200k.
            </p>
            <Link
              href="/funded-pathway"
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-background-primary font-mono text-xs font-bold uppercase tracking-wider rounded hover:bg-amber-400 transition-all"
            >
              Explore Funded Pathway <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 bg-emerald-500 text-background-primary font-mono text-xs font-bold uppercase tracking-widest rounded hover:bg-emerald-400 transition-all"
          >
            Continue Learning
          </button>
        </div>
      </div>
    </div>
  );
}
