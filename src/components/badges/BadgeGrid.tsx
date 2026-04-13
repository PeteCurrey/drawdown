"use client";

import { cn } from "@/lib/utils";
import {
  Trophy,
  Target,
  Flame,
  Shield,
  Zap,
  Brain,
  BookOpen,
  TrendingUp,
  Award,
  Lock,
} from "lucide-react";

export interface Badge {
  key: string;
  name: string;
  description: string;
  icon: React.ElementType;
  tier: "bronze" | "silver" | "gold";
  earned: boolean;
  earnedAt?: string;
}

const tierColors = {
  bronze: {
    bg: "bg-amber-900/20",
    border: "border-amber-700/40",
    text: "text-amber-500",
    glow: "shadow-amber-500/10",
  },
  silver: {
    bg: "bg-slate-400/10",
    border: "border-slate-400/30",
    text: "text-slate-300",
    glow: "shadow-slate-300/10",
  },
  gold: {
    bg: "bg-premium/10",
    border: "border-premium/30",
    text: "text-premium",
    glow: "shadow-premium/20",
  },
};

export const allBadges: Badge[] = [
  { key: "first_login", name: "First Blood", description: "Logged into the platform for the first time.", icon: Zap, tier: "bronze", earned: true, earnedAt: "2026-04-13" },
  { key: "phase_1_complete", name: "Ground Zero", description: "Completed all modules in Phase 1.", icon: Shield, tier: "silver", earned: true, earnedAt: "2026-04-12" },
  { key: "first_quiz_pass", name: "Sharp Mind", description: "Passed your first module quiz with 70%+.", icon: Brain, tier: "bronze", earned: true, earnedAt: "2026-04-11" },
  { key: "perfect_quiz", name: "Precision", description: "Scored 100% on any module quiz.", icon: Target, tier: "gold", earned: false },
  { key: "journal_10", name: "Discipline", description: "Logged 10 trades in the AI Journal.", icon: BookOpen, tier: "bronze", earned: false },
  { key: "journal_50", name: "Consistency", description: "Logged 50 trades in the AI Journal.", icon: BookOpen, tier: "silver", earned: false },
  { key: "streak_7", name: "On Fire", description: "Maintained a 7-day learning streak.", icon: Flame, tier: "silver", earned: false },
  { key: "streak_30", name: "Unstoppable", description: "Maintained a 30-day learning streak.", icon: Flame, tier: "gold", earned: false },
  { key: "first_backtest", name: "Theorist", description: "Ran your first strategy backtest.", icon: TrendingUp, tier: "bronze", earned: false },
  { key: "all_phases", name: "The Edge", description: "Completed every phase of the curriculum.", icon: Award, tier: "gold", earned: false },
];

export function BadgeGrid({ badges }: { badges: Badge[] }) {
  const earned = badges.filter((b) => b.earned);
  const locked = badges.filter((b) => !b.earned);

  return (
    <div className="space-y-12">
      {/* Progress Summary */}
      <div className="flex items-center gap-8 p-6 bg-background-surface border border-border-slate">
        <div className="text-center">
          <p className="text-3xl font-display font-black text-accent">{earned.length}</p>
          <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Earned</p>
        </div>
        <div className="h-12 w-px bg-border-slate" />
        <div className="text-center">
          <p className="text-3xl font-display font-black text-text-tertiary">{locked.length}</p>
          <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Locked</p>
        </div>
        <div className="h-12 w-px bg-border-slate" />
        <div className="flex-grow">
          <div className="h-2 bg-background-elevated rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-profit rounded-full transition-all duration-1000"
              style={{ width: `${(earned.length / badges.length) * 100}%` }}
            />
          </div>
          <p className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest mt-2">
            {Math.round((earned.length / badges.length) * 100)}% complete
          </p>
        </div>
      </div>

      {/* Earned Badges */}
      {earned.length > 0 && (
        <div>
          <h3 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-6">
            Achievements Unlocked
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {earned.map((badge) => {
              const colors = tierColors[badge.tier];
              const Icon = badge.icon;
              return (
                <div
                  key={badge.key}
                  className={cn(
                    "group p-6 border text-center space-y-4 transition-all hover:-translate-y-1 hover:shadow-xl cursor-default",
                    colors.bg,
                    colors.border,
                    colors.glow
                  )}
                >
                  <div className={cn("w-12 h-12 mx-auto flex items-center justify-center rounded-full", colors.bg)}>
                    <Icon className={cn("w-6 h-6", colors.text)} />
                  </div>
                  <div>
                    <p className={cn("text-xs font-display font-bold uppercase", colors.text)}>
                      {badge.name}
                    </p>
                    <p className="text-[9px] text-text-tertiary mt-1 leading-relaxed">
                      {badge.description}
                    </p>
                  </div>
                  {badge.earnedAt && (
                    <p className="text-[8px] font-mono text-text-tertiary uppercase tracking-widest">
                      {badge.earnedAt}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Locked Badges */}
      {locked.length > 0 && (
        <div>
          <h3 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-6">
            Locked
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {locked.map((badge) => (
              <div
                key={badge.key}
                className="p-6 border border-border-slate/30 bg-background-primary text-center space-y-4 opacity-40 grayscale"
              >
                <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-background-elevated">
                  <Lock className="w-5 h-5 text-text-tertiary" />
                </div>
                <div>
                  <p className="text-xs font-display font-bold uppercase text-text-tertiary">
                    {badge.name}
                  </p>
                  <p className="text-[9px] text-text-tertiary mt-1 leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
