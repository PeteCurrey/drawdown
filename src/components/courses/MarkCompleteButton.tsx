"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { CheckCircle2, ArrowLeft, ArrowRight, Trophy } from "lucide-react";
import confetti from "canvas-confetti";

interface MarkCompleteButtonProps {
  lessonId:    string;
  courseId:    string;
  courseSlug:  string;
  prevSlug:    string | null;
  nextSlug:    string | null;
  isCompleted: boolean;
}

export function MarkCompleteButton({
  lessonId, courseId, courseSlug, prevSlug, nextSlug, isCompleted,
}: MarkCompleteButtonProps) {
  const router                          = useRouter();
  const [done, setDone]                 = useState(isCompleted);
  const [loading, setLoading]           = useState(false);
  const [courseComplete, setCourseComplete] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  async function handleMarkComplete() {
    if (done || loading) return;
    setLoading(true);
    try {
      const res  = await fetch("/api/courses/progress", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ lessonId, courseId, courseSlug }),
      });
      const data = await res.json();
      if (res.ok) {
        setDone(true);
        // Update sidebar checkmarks without refresh
        if (typeof window !== "undefined" && (window as any).__courseMarkDone) {
          (window as any).__courseMarkDone(lessonId);
        }
        if (data.courseComplete) {
          setCourseComplete(true);
          setShowCompletion(true);
          // Confetti 🎉
          confetti({ particleCount: 180, spread: 90, origin: { y: 0.6 },
            colors: ["#C8F135", "#ffffff", "#a8cc2d", "#f0f0f0"] });
          setTimeout(() => confetti({
            particleCount: 80, angle: 60, spread: 55, origin: { x: 0 },
            colors: ["#C8F135", "#ffffff"],
          }), 300);
          setTimeout(() => confetti({
            particleCount: 80, angle: 120, spread: 55, origin: { x: 1 },
            colors: ["#C8F135", "#ffffff"],
          }), 500);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  function navTo(slug: string | null) {
    if (slug) router.push(`/dashboard/courses/${courseSlug}/${slug}`);
  }

  if (showCompletion) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6">
        <div className="bg-[#111] border border-[#C8F135]/30 rounded-2xl p-10 max-w-lg w-full text-center space-y-6 shadow-2xl">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full border-2 border-[#C8F135] flex items-center justify-center">
              <Trophy className="w-10 h-10 text-[#C8F135]" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-mono text-[#C8F135] uppercase tracking-widest">
              Course Complete
            </p>
            <h2 className="font-display text-2xl font-black uppercase text-white leading-tight">
              You've Deployed Your Algo
            </h2>
            <p className="text-sm text-white/60 leading-relaxed">
              Your next step: open the Algo Strategy Builder and generate your first real strategy.
            </p>
          </div>
          <a
            href="/dashboard/tools/algo-builder"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#C8F135] text-black font-bold text-sm rounded-lg hover:bg-[#b8e020] transition-colors"
          >
            Go to Algo Builder <ArrowRight className="w-4 h-4" />
          </a>
          <button
            onClick={() => setShowCompletion(false)}
            className="block mx-auto text-[11px] text-white/30 hover:text-white/60 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4">
      {/* Previous */}
      <button
        onClick={() => navTo(prevSlug)}
        disabled={!prevSlug}
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 rounded-lg text-[12px] font-bold transition-all",
          prevSlug
            ? "text-text-secondary hover:text-text-primary hover:bg-white/5 border border-border-slate/40"
            : "opacity-0 pointer-events-none"
        )}
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Previous
      </button>

      {/* Mark Complete */}
      <button
        onClick={handleMarkComplete}
        disabled={done || loading}
        className={cn(
          "flex items-center gap-2 px-6 py-2.5 rounded-lg text-[12px] font-bold transition-all",
          done
            ? "bg-[#C8F135]/10 text-[#C8F135] border border-[#C8F135]/30 cursor-default"
            : "bg-[#C8F135] text-black hover:bg-[#b8e020] active:scale-95"
        )}
      >
        <CheckCircle2 className="w-4 h-4" />
        {loading ? "Saving…" : done ? "Completed ✓" : "Mark Complete"}
      </button>

      {/* Next */}
      <button
        onClick={() => navTo(nextSlug)}
        disabled={!nextSlug}
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 rounded-lg text-[12px] font-bold transition-all",
          nextSlug
            ? "text-text-secondary hover:text-text-primary hover:bg-white/5 border border-border-slate/40"
            : courseComplete
              ? "px-5 bg-[#C8F135]/10 text-[#C8F135] border border-[#C8F135]/30 cursor-default"
              : "opacity-0 pointer-events-none"
        )}
      >
        {nextSlug ? (
          <> Next <ArrowRight className="w-3.5 h-3.5" /> </>
        ) : courseComplete ? (
          "Course Complete 🎯"
        ) : null}
      </button>
    </div>
  );
}
