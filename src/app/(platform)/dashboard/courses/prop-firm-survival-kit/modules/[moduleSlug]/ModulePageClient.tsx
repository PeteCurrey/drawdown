"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Lock, CheckCircle2, AlertCircle, HelpCircle, Search, Bookmark, Edit3, MessageSquare } from "lucide-react";

interface LessonData {
  id: string;
  slug: string;
  title: string;
  estimated_minutes: number;
  sort_order: number;
  completed: boolean;
}

interface ModulePageClientProps {
  moduleNumber: string;
  moduleSlug: string;
  moduleTitle: string;
  moduleSubtitle: string;
  courseSlug: string;
  courseId: string;
  lessons: LessonData[];
  quizPassed: boolean;
  quizAttempted: boolean;
  quizScore: number | null;
  quizTotal: number | null;
  overallProgress: string;
}

export default function ModulePageClient({
  moduleNumber,
  moduleSlug,
  moduleTitle,
  moduleSubtitle,
  courseSlug,
  courseId,
  lessons,
  quizPassed,
  quizAttempted,
  quizScore,
  quizTotal,
  overallProgress,
}: ModulePageClientProps) {

  const completedCount = lessons.filter(l => l.completed).length;
  const totalLessons = lessons.length;
  const isQuizUnlocked = completedCount === totalLessons;
  const progressPct = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col justify-between selection:bg-[#22C55E]/30 pb-[56px] pt-4">

      {/* ── TOP NAV ────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto w-full px-6 flex items-center justify-between gap-8 py-4 border-b border-[#1E1E1E]">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="font-display font-black text-lg tracking-wider uppercase text-white hover:text-[#22C55E] transition-colors">
            Drawdown.
          </Link>
          <span className="text-[10px] font-mono text-[#6B7280] border border-[#1E1E1E] px-2 py-0.5 rounded tracking-widest uppercase">
            Survival Kit
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/courses/prop-firm-survival-kit"
            className="text-[10px] font-mono text-[#6B7280] hover:text-[#22C55E] transition-colors uppercase tracking-wider"
          >
            ← All Modules
          </Link>
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
      <main className="flex-grow max-w-2xl mx-auto px-6 py-12 w-full space-y-10">
        
        {/* Module Header */}
        <div className="space-y-4">
          <p className="text-[11px] font-mono tracking-widest uppercase">
            <span className="text-[#22C55E] font-bold">// MODULE {moduleNumber}</span>
            <span className="text-[#6B7280]"> · {totalLessons} LESSONS · 1 QUIZ</span>
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-black uppercase text-white leading-tight">
            {moduleTitle}
          </h1>
          <p className="text-[#9CA3AF] text-sm sm:text-base leading-relaxed italic">
            {moduleSubtitle}
          </p>

          {/* Module Progress Bar */}
          <div className="space-y-2 pt-4">
            <div className="flex justify-between items-center text-[10px] font-mono uppercase text-[#6B7280]">
              <span>Module Progress</span>
              <span className="text-[#22C55E] font-bold">{completedCount}/{totalLessons}</span>
            </div>
            <div className="h-1.5 bg-[#1E1E1E] rounded-full w-full overflow-hidden">
              <div 
                className="h-full bg-[#22C55E] rounded-full transition-all duration-500" 
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        <hr className="border-[#1E1E1E]" />

        {/* Lessons section */}
        <div className="space-y-4">
          <p className="text-[11px] font-mono text-[#22C55E] tracking-widest uppercase font-bold">// LESSONS</p>
          
          <div className="space-y-2">
            {lessons.map((lesson, idx) => (
              <Link
                key={lesson.id}
                href={`/dashboard/courses/${courseSlug}/modules/${moduleSlug}/lessons/${lesson.slug}`}
                className="flex items-center justify-between p-5 bg-transparent border border-[#1E1E1E] hover:bg-[#111111] transition-all group"
              >
                <div className="flex items-center gap-4">
                  <span className="text-[12px] font-mono text-[#6B7280]">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-[#22C55E] transition-colors leading-tight">
                      {lesson.title}
                    </h4>
                    <p className="text-[10px] font-mono text-[#6B7280] uppercase tracking-wider mt-1">
                      {lesson.estimated_minutes} MIN READ
                    </p>
                  </div>
                </div>

                <span className={`text-[11px] font-mono transition-colors ${lesson.completed ? "text-[#22C55E]" : "text-[#6B7280] group-hover:text-white"}`}>
                  {lesson.completed ? "✓ DONE" : "→ READ"}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Quiz section */}
        <div className="space-y-4">
          <p className="text-[11px] font-mono text-[#6B7280] tracking-widest uppercase font-bold">// MODULE ASSESSMENT</p>
          
          <div className={`p-5 border transition-all ${isQuizUnlocked ? "bg-transparent border-[#1E1E1E] hover:bg-[#111111]" : "bg-transparent border-[#1E1E1E] opacity-60 select-none"}`}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${isQuizUnlocked ? "text-[#22C55E]" : "text-[#6B7280]"}`}>
                  ⬡
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">Module Quiz</h4>
                  <p className="text-[10px] font-mono text-[#6B7280] uppercase tracking-wider mt-1">
                    5 Questions · Pass 80% to unlock next module
                  </p>
                </div>
              </div>

              <div>
                {isQuizUnlocked ? (
                  quizPassed ? (
                    <Link
                      href={`/dashboard/courses/${courseSlug}/modules/${moduleSlug}/quiz`}
                      className="text-[11px] font-mono text-[#22C55E] font-bold"
                    >
                      ✓ PASSED
                    </Link>
                  ) : quizAttempted ? (
                    <Link
                      href={`/dashboard/courses/${courseSlug}/modules/${moduleSlug}/quiz`}
                      className="text-[11px] font-mono text-[#F59E0B] font-bold hover:underline"
                    >
                      ✗ RETRY
                    </Link>
                  ) : (
                    <Link
                      href={`/dashboard/courses/${courseSlug}/modules/${moduleSlug}/quiz`}
                      className="text-[11px] font-mono text-white font-bold hover:text-[#22C55E] transition-colors"
                    >
                      → TAKE QUIZ
                    </Link>
                  )
                ) : (
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#6B7280]">
                    <Lock className="w-3.5 h-3.5" />
                    <span>LOCKED</span>
                  </div>
                )}
              </div>
            </div>
            
            {!isQuizUnlocked && (
              <p className="text-[11px] text-[#6B7280] italic mt-3 pt-3 border-t border-[#1E1E1E]/50">
                Complete all lessons above to unlock this quiz.
              </p>
            )}
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
          {overallProgress}
        </div>
      </footer>

    </div>
  );
}
