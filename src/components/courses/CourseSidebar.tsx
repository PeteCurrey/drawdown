"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  CheckCircle2, Circle, ChevronDown, ChevronRight,
  Clock, ArrowLeft,
} from "lucide-react";

interface Lesson {
  id: string;
  slug: string;
  title: string;
  estimated_minutes: number;
  is_preview: boolean;
  sort_order: number;
}

interface Module {
  id: string;
  title: string;
  subtitle: string;
  sort_order: number;
  course_lessons: Lesson[];
}

interface CourseSidebarProps {
  courseSlug:          string;
  modules:             Module[];
  initialCompleted:    string[];   // lesson IDs already done
  totalLessons:        number;
  accessVia?:          string | null;
}

export function CourseSidebar({
  courseSlug,
  modules,
  initialCompleted,
  totalLessons,
  accessVia,
}: CourseSidebarProps) {
  const pathname            = usePathname();
  const [completed, setCompleted] = useState<Set<string>>(new Set(initialCompleted));
  // Expose setter so MarkCompleteButton can update without refresh
  if (typeof window !== "undefined") {
    (window as any).__courseMarkDone = (lessonId: string) => {
      setCompleted(prev => new Set([...prev, lessonId]));
    };
  }

  const [openModules, setOpenModules] = useState<Set<string>>(() => {
    // Auto-open the module containing the active lesson
    const activeSlug = pathname.split("/").pop() ?? "";
    const initial = new Set<string>();
    modules.forEach(m => {
      if (m.sort_order === 1) initial.add(m.id); // always open M1
      if (m.course_lessons.some(l => l.slug === activeSlug)) initial.add(m.id);
    });
    return initial;
  });

  const [backLabel, setBackLabel] = useState("Open Algo Strategy Builder →");
  const [backHref, setBackHref]   = useState("/dashboard/tools/algo-builder");

  useEffect(() => {
    if (typeof document !== "undefined" &&
        (document.referrer.includes("algo-builder") ||
         new URLSearchParams(window.location.search).get("from") === "algo-builder")) {
      setBackLabel("← Back to your strategy");
    }
  }, []);

  const toggle = (id: string) =>
    setOpenModules(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const doneCount = completed.size;
  const pct       = totalLessons > 0 ? Math.round((doneCount / totalLessons) * 100) : 0;

  return (
    <aside className="flex flex-col gap-6 h-full">
      {/* Course title + progress */}
      <div className="space-y-3">
        <h2 className="font-display font-extrabold text-lg uppercase tracking-wide text-text-primary leading-tight">
          Deploy Your Algo
        </h2>
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
              Progress
            </span>
            <span className="text-[10px] font-mono text-[#C8F135] font-bold">
              {doneCount}/{totalLessons}
            </span>
          </div>
          <div className="h-1 bg-border-slate/40 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, backgroundColor: "#C8F135" }}
            />
          </div>
        </div>
        {accessVia && (
          <p className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">
            {accessVia === "floor_tier" ? "✦ Floor Tier — Included" : "✦ Purchased"}
          </p>
        )}
      </div>

      {/* Module accordion */}
      <nav className="flex-1 overflow-y-auto space-y-1 -mx-2">
        {modules.map(mod => {
          const modOpen    = openModules.has(mod.id);
          const modLessons = [...mod.course_lessons].sort((a, b) => a.sort_order - b.sort_order);
          const modDone    = modLessons.filter(l => completed.has(l.id)).length;
          const modComplete = modDone === modLessons.length && modLessons.length > 0;

          return (
            <div key={mod.id}>
              <button
                onClick={() => toggle(mod.id)}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-left group"
              >
                {modComplete
                  ? <CheckCircle2 className="w-3.5 h-3.5 text-[#C8F135] shrink-0" />
                  : <span className="text-[9px] font-black font-mono text-[#C8F135] w-3.5 shrink-0">
                      {String(mod.sort_order).padStart(2, "0")}
                    </span>
                }
                <span className="flex-1 text-[11px] font-bold text-text-secondary group-hover:text-text-primary transition-colors leading-tight">
                  {mod.subtitle}
                </span>
                <span className="text-[9px] font-mono text-text-tertiary mr-1">{modDone}/{modLessons.length}</span>
                {modOpen
                  ? <ChevronDown className="w-3 h-3 text-text-tertiary shrink-0" />
                  : <ChevronRight className="w-3 h-3 text-text-tertiary shrink-0" />
                }
              </button>

              {modOpen && (
                <div className="ml-5 border-l border-border-slate/30 space-y-0.5 my-1">
                  {modLessons.map(lesson => {
                    const lessonPath = `/dashboard/courses/${courseSlug}/${lesson.slug}`;
                    const isActive   = pathname === lessonPath;
                    const isDone     = completed.has(lesson.id);

                    return (
                      <Link
                        key={lesson.id}
                        href={lessonPath}
                        className={cn(
                          "flex items-start gap-2 pl-3 pr-2 py-2 rounded-r-lg transition-all text-left group",
                          isActive
                            ? "border-l-2 border-[#C8F135] -ml-px bg-[#C8F135]/5 text-text-primary"
                            : "border-l-2 border-transparent hover:border-border-slate/50 hover:bg-white/5"
                        )}
                      >
                        {isDone
                          ? <CheckCircle2 className="w-3 h-3 text-[#C8F135] shrink-0 mt-0.5" />
                          : <Circle className={cn("w-3 h-3 shrink-0 mt-0.5",
                              isActive ? "text-[#C8F135]" : "text-text-tertiary/40")} />
                        }
                        <span className={cn(
                          "text-[11px] leading-snug flex-1",
                          isDone     ? "text-text-tertiary line-through" :
                          isActive   ? "text-text-primary font-semibold" :
                                       "text-text-secondary group-hover:text-text-primary"
                        )}>
                          {lesson.title}
                        </span>
                        <span className="flex items-center gap-0.5 text-[9px] font-mono text-text-tertiary/60 shrink-0 mt-0.5">
                          <Clock className="w-2.5 h-2.5" />{lesson.estimated_minutes}m
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Back link */}
      <Link
        href={backHref}
        className="flex items-center gap-2 text-[10px] font-mono text-text-tertiary hover:text-[#C8F135] transition-colors uppercase tracking-widest mt-auto"
      >
        <ArrowLeft className="w-3 h-3" />
        {backLabel}
      </Link>
    </aside>
  );
}
