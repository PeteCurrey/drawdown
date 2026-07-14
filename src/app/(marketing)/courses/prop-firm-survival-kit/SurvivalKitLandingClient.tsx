"use client";

import Link from "next/link";
import { Lock, ArrowRight, Search, Bookmark, Edit3, MessageSquare } from "lucide-react";

interface ModuleData {
  id: string;
  title: string;
  subtitle: string;
  sort_order: number;
  slug: string;
  lessons_count: number;
}

interface SurvivalKitLandingClientProps {
  isAuthenticated: boolean;
  hasAccess: boolean;
  userName: string;
  avatarUrl?: string;
  passedModuleIds: string[];
  completedCount: number;
  modules: ModuleData[];
}

export default function SurvivalKitLandingClient({
  isAuthenticated,
  hasAccess,
  userName,
  avatarUrl,
  passedModuleIds,
  completedCount,
  modules,
}: SurvivalKitLandingClientProps) {
  
  // Calculate lock states
  const modulesWithLockState = modules.map((mod, index) => {
    if (index === 0) {
      return { ...mod, isLocked: false };
    }
    const prevMod = modules[index - 1];
    const prevPassed = passedModuleIds.includes(prevMod.id);
    return { ...mod, isLocked: !prevPassed };
  });

  const overallProgressPct = Math.round((completedCount / 40) * 100);
  const totalPassedModules = modules.filter(m => passedModuleIds.includes(m.id)).length;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col justify-between selection:bg-[#22C55E]/30 pb-[56px]">
      
      {/* ── MINIMAL TOP NAV ────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-[#1E1E1E] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-display font-black text-lg tracking-wider uppercase text-white hover:text-[#22C55E] transition-colors">
            Drawdown.
          </Link>
          <span className="text-[10px] font-mono text-[#6B7280] border border-[#1E1E1E] px-2 py-0.5 rounded tracking-widest uppercase">
            Survival Kit
          </span>
        </div>

        <div className="flex items-center gap-8 flex-1 max-w-md mx-12">
          <div className="text-[10px] font-mono text-[#6B7280] whitespace-nowrap uppercase tracking-wider">
            Progress {overallProgressPct}%
          </div>
          <div className="h-1.5 bg-[#1E1E1E] rounded-full w-full overflow-hidden">
            <div 
              className="h-full bg-[#22C55E] rounded-full transition-all duration-500" 
              style={{ width: `${overallProgressPct}%` }}
            />
          </div>
        </div>

        <div>
          {isAuthenticated ? (
            <Link 
              href="/dashboard/profile"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt={userName} className="w-7 h-7 rounded-full object-cover border border-[#1E1E1E]" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center justify-center text-[10px] font-bold text-[#22C55E]">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-xs font-mono text-white hidden sm:inline">{userName}</span>
            </Link>
          ) : (
            <Link 
              href="/login?next=/courses/prop-firm-survival-kit"
              className="text-xs font-mono text-white hover:text-[#22C55E] transition-colors tracking-widest uppercase"
            >
              Sign In
            </Link>
          )}
        </div>
      </header>

      {/* ── HERO SECTION ──────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20 md:py-32 flex flex-col items-start gap-8 z-10 relative">
        <div className="text-[11px] font-mono text-[#22C55E] tracking-widest uppercase">
          // PROP FIRM SURVIVAL — INTERACTIVE
        </div>

        <h1 className="font-display font-black text-5xl md:text-7xl leading-[1.05] tracking-tight uppercase max-w-4xl">
          Most traders don't fail the challenge.<br />
          <span className="text-[#6B7280]">They fail because nobody told them the real rules.</span>
        </h1>

        <p className="text-base md:text-lg text-[#9CA3AF] max-w-[560px] leading-relaxed">
          The Drawdown Prop Firm Survival Kit — now an immersive course. 
          Five modules, every rule decoded, every psychological spiral named. 
          Pass each module quiz to complete the kit.
        </p>

        {hasAccess ? (
          <Link
            href="/dashboard/courses/prop-firm-survival-kit"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-mono font-bold text-xs uppercase tracking-widest rounded hover:bg-neutral-200 transition-colors"
          >
            Start the course <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link
            href={isAuthenticated ? "/pricing" : "/login?next=/courses/prop-firm-survival-kit"}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-mono font-bold text-xs uppercase tracking-widest rounded hover:bg-neutral-200 transition-colors"
          >
            Get Survival Kit <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────── */}
      <section className="border-t border-[#1E1E1E] bg-[#0A0A0A] w-full">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4">
          <div className="p-8 border-b md:border-b-0 md:border-r border-[#1E1E1E] flex flex-col justify-center min-h-[140px]">
            <span className="font-display text-5xl font-black text-white">73%</span>
            <span className="text-[10px] font-mono uppercase text-[#6B7280] tracking-widest mt-2">
              OF CHALLENGES FAIL BEFORE DAY 5
            </span>
          </div>

          <div className="p-8 border-b md:border-b-0 md:border-r border-[#1E1E1E] flex flex-col justify-center min-h-[140px]">
            <span className="font-display text-5xl font-black text-white">£1,200</span>
            <span className="text-[10px] font-mono uppercase text-[#6B7280] tracking-widest mt-2">
              AVERAGE LOST TO FAILED EVALUATIONS
            </span>
          </div>

          <div className="p-8 border-b md:border-b-0 md:border-r border-[#1E1E1E] flex flex-col justify-center min-h-[140px]">
            <span className="font-display text-5xl font-black text-white">5%</span>
            <span className="text-[10px] font-mono uppercase text-[#6B7280] tracking-widest mt-2">
              DAILY DRAWDOWN — NO MARGIN FOR ERROR
            </span>
          </div>

          <div className="p-8 flex flex-col justify-center min-h-[140px]">
            <span className="font-display text-5xl font-black text-white">1</span>
            <span className="text-[10px] font-mono uppercase text-[#6B7280] tracking-widest mt-2">
              MISTAKE AWAY FROM ACCOUNT CLOSURE
            </span>
          </div>
        </div>
      </section>

      {/* ── MODULES LIST SECTION ─────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-24 w-full space-y-12">
        <div className="space-y-2">
          <h2 className="font-display text-4xl font-black uppercase text-white">
            Five modules. One survival framework.
          </h2>
        </div>

        <div className="border-t border-[#1E1E1E]">
          {modulesWithLockState.map((mod, i) => {
            const rowContent = (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-6 px-4 border-b border-[#1E1E1E] transition-colors group">
                <span className={`font-display text-5xl font-black shrink-0 w-16 mb-4 sm:mb-0 transition-colors ${mod.isLocked ? "text-[#374151]" : "text-white group-hover:text-[#22C55E]"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280]">
                      {mod.isLocked ? "LOCKED" : "NOT STARTED"}
                    </span>
                    <span className="text-[10px] font-mono uppercase text-[#6B7280]">
                      · {mod.lessons_count} lessons · quiz
                    </span>
                  </div>
                  <h3 className={`font-display text-xl font-bold uppercase transition-colors ${mod.isLocked ? "text-[#6B7280]" : "text-white group-hover:text-[#22C55E]"}`}>
                    {mod.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B7280] mt-1 italic">
                    {mod.isLocked ? "Locked — pass the previous module's quiz to unlock." : mod.subtitle}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-6 mt-4 sm:mt-0">
                  <span className="text-[12px] font-mono text-[#6B7280]">
                    0/{mod.lessons_count}
                  </span>
                  {mod.isLocked ? (
                    <Lock className="w-4 h-4 text-[#6B7280]" />
                  ) : (
                    <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                  )}
                </div>
              </div>
            );

            if (mod.isLocked) {
              return <div key={mod.id} className="relative select-none">{rowContent}</div>;
            }

            return (
              <Link 
                key={mod.id} 
                href={`/dashboard/courses/prop-firm-survival-kit/modules/${mod.slug}`}
                className="block hover:bg-[#111111] cursor-pointer"
              >
                {rowContent}
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── FIXED BOTTOM TOOLBAR ─────────────────────────────────── */}
      <footer className="fixed bottom-0 left-0 right-0 h-[56px] bg-[#0A0A0A] border-t border-[#1E1E1E] px-6 flex items-center justify-between z-40 select-none">
        <div className="flex items-center gap-6 text-[#6B7280]">
          <Search className="w-4 h-4 cursor-not-allowed" />
          <Bookmark className="w-4 h-4 cursor-not-allowed" />
          <Edit3 className="w-4 h-4 cursor-not-allowed" />
          <MessageSquare className="w-4 h-4 cursor-not-allowed" />
        </div>

        <div className="text-[10px] font-mono text-[#6B7280] tracking-widest uppercase">
          // YOUR PROGRESS
        </div>

        <div className="text-[10px] font-mono text-[#6B7280] tracking-widest uppercase">
          0/40 · 0/6 MODULES
        </div>
      </footer>

    </div>
  );
}
