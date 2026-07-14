"use client";

import Link from "next/link";
import { Lock, ArrowRight, BookOpen, Search, Bookmark, Edit3, MessageSquare } from "lucide-react";

interface LessonData {
  id: string;
  slug: string;
  title: string;
  sort_order: number;
}

interface ModuleData {
  id: string;
  title: string;
  subtitle: string;
  sort_order: number;
  slug: string;
  lessons: LessonData[];
  completedCount: number;
}

interface SurvivalKitDashboardClientProps {
  courseId: string;
  courseSlug: string;
  courseTitle: string;
  courseSubtitle: string;
  courseDescription: string;
  modules: ModuleData[];
  passedModuleIds: string[];
  completedLessonIds: string[];
  totalLessons: number;
  completedCount: number;
  accessVia: string | null;
}

export default function SurvivalKitDashboardClient({
  courseId,
  courseSlug,
  courseTitle,
  courseSubtitle,
  courseDescription,
  modules,
  passedModuleIds,
  completedLessonIds,
  totalLessons,
  completedCount,
  accessVia,
}: SurvivalKitDashboardClientProps) {

  // Map modules with dynamic unlock logic
  const enrichedModules = modules.map((mod, index) => {
    let isUnlocked = false;
    if (index === 0) {
      isUnlocked = true; // Module 1 always unlocked
    } else {
      const prevMod = modules[index - 1];
      isUnlocked = passedModuleIds.includes(prevMod.id);
    }

    return {
      ...mod,
      isUnlocked,
    };
  });

  const overallProgressPct = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Find next lesson to continue
  let nextLessonUrl = "";
  let continueLabel = "Start Course →";

  const allLessons = enrichedModules.flatMap(m => m.lessons.map(l => ({ ...l, moduleSlug: m.slug, isUnlocked: m.isUnlocked })));
  const firstLesson = allLessons[0];

  const firstIncomplete = allLessons.find(l => l.isUnlocked && !completedLessonIds.includes(l.id));

  if (firstIncomplete) {
    nextLessonUrl = `/dashboard/courses/${courseSlug}/modules/${firstIncomplete.moduleSlug}/lessons/${firstIncomplete.slug}`;
    continueLabel = completedCount > 0 ? "Continue Course →" : "Start Course →";
  } else if (firstLesson) {
    nextLessonUrl = `/dashboard/courses/${courseSlug}/modules/${enrichedModules[0].slug}/lessons/${firstLesson.slug}`;
    continueLabel = "Restart Course →";
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col justify-between selection:bg-[#22C55E]/30 pb-[56px] pt-4">
      
      {/* ── TOP NAV / MODULE PROGRESS HEADER ────────────────────── */}
      <div className="max-w-5xl mx-auto w-full px-6 flex items-center justify-between gap-8 py-4 border-b border-[#1E1E1E]">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="font-display font-black text-lg tracking-wider uppercase text-white hover:text-[#22C55E] transition-colors">
            Drawdown.
          </Link>
          <span className="text-[10px] font-mono text-[#6B7280] border border-[#1E1E1E] px-2 py-0.5 rounded tracking-widest uppercase">
            Survival Kit
          </span>
        </div>

        <div className="flex items-center gap-6 flex-1 max-w-sm">
          <span className="text-[10px] font-mono text-[#6B7280] uppercase tracking-widest shrink-0">
            Progress {overallProgressPct}%
          </span>
          <div className="h-1.5 bg-[#1E1E1E] rounded-full w-full overflow-hidden">
            <div 
              className="h-full bg-[#22C55E] rounded-full transition-all duration-500" 
              style={{ width: `${overallProgressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full space-y-12">
        <div className="space-y-4">
          <div className="text-[11px] font-mono text-[#22C55E] tracking-widest uppercase">
            // INTERACTIVE SURVIVAL BLUEPRINT
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-black uppercase text-white leading-tight">
            {courseTitle}
          </h1>
          <p className="text-[#9CA3AF] text-base sm:text-lg leading-relaxed max-w-2xl">
            {courseDescription}
          </p>
        </div>

        {/* Progress Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#111111] border border-[#1E1E1E] rounded p-5">
            <p className="text-[9px] font-mono uppercase tracking-widest text-[#6B7280] mb-1">Modules Done</p>
            <p className="text-3xl font-black font-mono text-white">
              {modules.filter(m => passedModuleIds.includes(m.id)).length}/6
            </p>
          </div>
          <div className="bg-[#111111] border border-[#1E1E1E] rounded p-5">
            <p className="text-[9px] font-mono uppercase tracking-widest text-[#6B7280] mb-1">Lessons Read</p>
            <p className="text-3xl font-black font-mono text-white">
              {completedCount}/{totalLessons}
            </p>
          </div>
          <div className="bg-[#111111] border border-[#1E1E1E] rounded p-5">
            <p className="text-[9px] font-mono uppercase tracking-widest text-[#6B7280] mb-1">Access Method</p>
            <p className="text-xs font-mono text-[#22C55E] uppercase tracking-wider mt-2.5">
              {accessVia === "floor_tier" ? "Floor Tier (Included) ✓" : "Individual License ✓"}
            </p>
          </div>
        </div>

        {/* Start / Continue Button */}
        {nextLessonUrl && (
          <Link
            href={nextLessonUrl}
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#22C55E] text-black font-mono font-bold text-xs uppercase tracking-widest rounded hover:bg-[#1db053] transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            {continueLabel}
          </Link>
        )}

        {/* Module overview */}
        <div className="space-y-4 pt-4">
          <h2 className="text-[10px] font-mono uppercase tracking-widest text-[#6B7280]">
            Curriculum Framework
          </h2>
          <div className="border-t border-[#1E1E1E]">
            {enrichedModules.map((mod, i) => {
              const pct = mod.lessons.length > 0 ? Math.round((mod.completedCount / mod.lessons.length) * 100) : 0;
              const hasPassedQuiz = passedModuleIds.includes(mod.id);

              const rowContent = (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-6 px-4 border-b border-[#1E1E1E] transition-colors group">
                  <span className={`font-display text-5xl font-black shrink-0 w-16 mb-4 sm:mb-0 transition-colors ${!mod.isUnlocked ? "text-[#374151]" : "text-white group-hover:text-[#22C55E]"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="flex-grow min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280]">
                        {!mod.isUnlocked ? "LOCKED" : (hasPassedQuiz ? "COMPLETED ✓" : "IN PROGRESS")}
                      </span>
                      <span className="text-[10px] font-mono uppercase text-[#6B7280]">
                        · {mod.lessons.length} lessons · quiz
                      </span>
                    </div>
                    <h3 className={`font-display text-xl font-bold uppercase transition-colors ${!mod.isUnlocked ? "text-[#6B7280]" : "text-white group-hover:text-[#22C55E]"}`}>
                      {mod.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#6B7280] mt-1 italic">
                      {!mod.isUnlocked ? "Locked — pass the previous module's quiz to unlock." : mod.subtitle}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-6 mt-4 sm:mt-0">
                    {mod.isUnlocked && (
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-1 bg-[#1E1E1E] rounded-full overflow-hidden hidden xs:block">
                          <div className="h-full bg-[#22C55E] rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[11px] font-mono text-[#6B7280]">
                          {mod.completedCount}/{mod.lessons.length}
                        </span>
                      </div>
                    )}
                    {!mod.isUnlocked ? (
                      <Lock className="w-4 h-4 text-[#6B7280]" />
                    ) : (
                      <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                    )}
                  </div>
                </div>
              );

              if (!mod.isUnlocked) {
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
        </div>
      </main>

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
          {completedCount}/{totalLessons} · {passedModuleIds.length}/6 MODULES
        </div>
      </footer>

    </div>
  );
}
