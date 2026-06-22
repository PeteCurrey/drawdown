"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Search, Bookmark, Edit3, MessageSquare, Check } from "lucide-react";
import { CourseSidebar } from "@/components/courses/CourseSidebar";
import { SurvivalKitLessonContent } from "@/components/courses/SurvivalKitLessonContent";
import { PreChallengeChecklist } from "@/components/courses/PreChallengeChecklist";
import { CommandmentCard } from "@/components/courses/CommandmentCard";

interface LessonData {
  id: string;
  slug: string;
  title: string;
  estimated_minutes: number;
  is_preview: boolean;
  sort_order: number;
  content_mdx: string | null;
}

interface ModuleData {
  id: string;
  title: string;
  subtitle: string;
  sort_order: number;
  slug: string;
  course_lessons: LessonData[];
}

interface LessonReaderClientProps {
  courseId: string;
  courseSlug: string;
  courseTitle: string;
  moduleSlug: string;
  lessonSlug: string;
  lesson: LessonData;
  modules: ModuleData[];
  completedIds: string[];
  totalLessons: number;
  accessVia: string | null;
  prevLessonPath: string | null;
  nextLessonPath: string | null;
  moduleNumber: string;
  lessonNumber: string;
  parentModuleTitle: string;
}

export default function LessonReaderClient({
  courseId,
  courseSlug,
  courseTitle,
  moduleSlug,
  lessonSlug,
  lesson,
  modules,
  completedIds,
  totalLessons,
  accessVia,
  prevLessonPath,
  nextLessonPath,
  moduleNumber,
  lessonNumber,
  parentModuleTitle,
}: LessonReaderClientProps) {
  const router = useRouter();
  const [completed, setCompleted] = useState<string[]>(completedIds);
  const [busy, setBusy] = useState(false);

  const isCompleted = completed.includes(lesson.id);

  const handleMarkComplete = async () => {
    if (isCompleted) {
      if (nextLessonPath) {
        router.push(nextLessonPath);
      }
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/courses/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: lesson.id, courseId }),
      });
      if (res.ok) {
        setCompleted(prev => [...prev, lesson.id]);
        // Update sidebar dynamically without reload
        if (typeof window !== "undefined" && (window as any).__courseMarkDone) {
          (window as any).__courseMarkDone(lesson.id);
        }

        // Redirect to next path
        if (nextLessonPath) {
          router.push(nextLessonPath);
        }
      }
    } catch (e) {
      // Fail silently
    } finally {
      setBusy(false);
    }
  };

  const isChecklistLesson = lesson.slug === "pre-challenge-checklist";
  const isCommandment1_4 = lesson.slug === "commandments-1-4";
  const isCommandment5_8 = lesson.slug === "commandments-5-8";
  const isCommandment9_10 = lesson.slug === "commandments-9-10";

  // Commandments descriptions
  const commandmentsList = [
    { num: 1, text: "Prop firms are businesses.", desc: "They operate on risk parameters and probability models. Treat your relationship with them as a business contract, not a personal trial." },
    { num: 2, text: "Challenge fees are part of the business model.", desc: "Firms monetize evaluation failures. Accept the entry fee as the cost of inventory, not a loss to win back immediately." },
    { num: 3, text: "Most traders fail due to behaviour, not strategy.", desc: "Overleveraging, revenge trading, and rule breaches wipe out accounts long before technical edge has a chance to fail." },
    { num: 4, text: "Risk management matters more than entries.", desc: "A mediocre entry with professional risk sizing survives; a perfect entry with oversized risk inevitably breaches limits." },
    { num: 5, text: "Passing a challenge is only the beginning.", desc: "A funded account is a license to trade, not a final payout. The real discipline starts when real equity is on the line." },
    { num: 6, text: "Protecting capital comes before generating profit.", desc: "Defend your drawdown buffer at all costs. Without buffer, you cannot express your edge." },
    { num: 7, text: "Consistency beats intensity.", desc: "A series of small, regulated gains creates a payout; one massive lucky trade creates a consistency breach or subsequent tailspin." },
    { num: 8, text: "Professional traders think in probabilities.", desc: "No single trade outcome matters. Focus on execution quality across a large sample size of setups." },
    { num: 9, text: "Long-term survival creates long-term profitability.", desc: "The longer you stay active in funded accounts, the more market cycles you navigate and compound." },
    { num: 10, text: "The objective is not to pass a challenge. The objective is to build a sustainable trading business.", desc: "Align your rules, lifestyle, and mindset to create longevity and withdraw capital systematically." }
  ];

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white overflow-hidden pb-[56px]">
      
      {/* ── SIDEBAR ──────────────────────────────────────────────── */}
      <div className="w-72 shrink-0 border-r border-[#1E1E1E] p-6 flex flex-col h-full sticky top-0 overflow-y-auto bg-[#0A0A0A]/50 hidden md:block">
        <CourseSidebar
          courseSlug={courseSlug}
          modules={modules as any}
          initialCompleted={completed}
          totalLessons={totalLessons}
          accessVia={accessVia}
          courseTitle={courseTitle}
        />
      </div>

      {/* ── MAIN CONTENT WORKSPACE ───────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto pb-24">
          <div className="max-w-[680px] mx-auto px-6 py-10 space-y-8">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-[10px] font-mono text-[#6B7280] uppercase tracking-widest">
              <span>Prop Firm Survival Kit</span>
              <span className="text-[#22C55E]">→</span>
              <span>Module {moduleNumber}</span>
              <span className="text-[#22C55E]">→</span>
              <span className="text-white">Lesson {lessonNumber}</span>
            </nav>

            {/* Lesson header */}
            <div className="space-y-3">
              <h1 className="font-display text-4xl sm:text-5xl font-black uppercase text-white leading-tight">
                {lesson.title}
              </h1>
              <div className="flex items-center gap-4 text-[11px] font-mono text-[#6B7280]">
                <span>{lesson.estimated_minutes} min read</span>
                <span>·</span>
                <span>Module {moduleNumber} of 6</span>
                {lesson.is_preview && (
                  <>
                    <span>·</span>
                    <span className="text-[#22C55E]">Free Preview</span>
                  </>
                )}
              </div>
            </div>

            {/* Custom Interactive Elements for Commandments */}
            {isCommandment1_4 && (
              <div className="space-y-4 my-6">
                {commandmentsList.slice(0, 4).map(c => (
                  <CommandmentCard key={c.num} num={c.num} title={c.text} description={c.desc} />
                ))}
              </div>
            )}

            {isCommandment5_8 && (
              <div className="space-y-4 my-6">
                {commandmentsList.slice(4, 8).map(c => (
                  <CommandmentCard key={c.num} num={c.num} title={c.text} description={c.desc} />
                ))}
              </div>
            )}

            {isCommandment9_10 && (
              <div className="space-y-4 my-6">
                {commandmentsList.slice(8, 10).map(c => (
                  <CommandmentCard key={c.num} num={c.num} title={c.text} description={c.desc} />
                ))}
              </div>
            )}

            {/* Custom Pre-Challenge Checklist element */}
            {isChecklistLesson && (
              <PreChallengeChecklist />
            )}

            {/* Markdown Content */}
            {!isChecklistLesson && (
              <SurvivalKitLessonContent mdx={lesson.content_mdx ?? ""} />
            )}

            {/* Navigation buttons */}
            <div className="flex gap-4 pt-10 border-t border-[#1E1E1E]">
              {prevLessonPath ? (
                <Link
                  href={prevLessonPath}
                  className="flex-1 py-3 border border-[#2A2A2A] text-white hover:text-[#22C55E] hover:border-[#22C55E] font-mono font-bold text-xs uppercase tracking-widest rounded text-center transition-all"
                >
                  ← PREVIOUS
                </Link>
              ) : (
                <Link
                  href={`/dashboard/courses/${courseSlug}`}
                  className="flex-1 py-3 border border-[#2A2A2A] text-[#6B7280] hover:text-white font-mono font-bold text-xs uppercase tracking-widest rounded text-center transition-all"
                >
                  ← INDEX
                </Link>
              )}

              <button
                onClick={handleMarkComplete}
                disabled={busy}
                className="flex-grow flex-1 py-3 bg-[#22C55E] text-black font-mono font-bold text-xs uppercase tracking-widest rounded hover:bg-[#1db053] transition-colors text-center inline-flex items-center justify-center gap-1"
              >
                {isCompleted ? (
                  nextLessonPath ? "NEXT LESSON →" : "TAKE MODULE QUIZ →"
                ) : (
                  busy ? "SAVING..." : "MARK COMPLETE + NEXT →"
                )}
              </button>
            </div>

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
          // LESSON READER
        </div>

        <div className="text-[10px] font-mono text-[#6B7280] tracking-widest uppercase">
          {completed.length}/{totalLessons} · MODULE {moduleNumber}
        </div>
      </footer>

    </div>
  );
}
