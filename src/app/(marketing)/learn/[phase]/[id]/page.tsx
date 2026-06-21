"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import { QuizEngine } from "@/components/quiz/QuizEngine";
import { quizData } from "@/data/quizzes";
import { CoursePlayer } from "@/components/video/CoursePlayer";
import { phases } from "@/data/courses";
import { courseContent } from "@/data/courseContent";
import { createClient } from "@/lib/supabase/client";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  CheckCircle2,
  Lock,
} from "lucide-react";

interface Props {
  params: Promise<{ phase: string; id: string }>;
}

export default function ModulePage({ params }: Props) {
  const { phase, id } = use(params);
  
  // Find phase and module configs
  const phaseObj = phases.find((p) => p.slug === phase);
  if (!phaseObj) {
    notFound();
    return null;
  }

  const phaseId = phaseObj.id;
  const moduleIndex = parseInt(id.replace("module-", "")) - 1;
  const totalModules = phaseObj.modules_list.length;

  if (moduleIndex < 0 || moduleIndex >= totalModules) {
    notFound();
  }

  const moduleTitle = phaseObj.modules_list[moduleIndex];

  // Find module content
  const phaseContent = courseContent[phase];
  const moduleContentObj = phaseContent ? phaseContent[id] : null;

  const playbackId = moduleContentObj?.playbackId || "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA";
  const durationText = moduleContentObj?.duration || "20 minutes";
  const notesHtml = moduleContentObj?.notes || `<p>No content available for this module.</p>`;
  const quizKey = moduleContentObj?.quizKey || `${phase}/${id}`;

  const [activeTab, setActiveTab] = useState<"notes" | "quiz" | "discussion">("notes");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [moduleCompleted, setModuleCompleted] = useState(false);
  // Sub-step tracking: persists which tab the user last viewed so the
  // dashboard card can deep-link them back to the exact step on resume.
  const [stepSaved, setStepSaved] = useState<string>("notes");

  // Load user progress
  useEffect(() => {
    const supabase = createClient();
    async function loadProgress() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }
        setUser(user);

        const { data: progressData } = await supabase
          .from("course_progress")
          .select("module")
          .eq("user_id", user.id)
          .eq("phase", phaseId)
          .eq("completed", true);

        // Fetch this specific module's row to restore last_step
        const { data: thisModuleRow } = await supabase
          .from("course_progress")
          .select("last_step")
          .eq("user_id", user.id)
          .eq("phase", phaseId)
          .eq("module", moduleIndex + 1)
          .maybeSingle();

        if (progressData) {
          const completedNums = (progressData as any[]).map((p) => p.module);
          setCompletedModules(completedNums);
          if (completedNums.includes(moduleIndex + 1)) {
            setModuleCompleted(true);
          }
        }

        // Restore last step: URL param (dashboard deep-link) wins, then DB value.
        const urlParams = new URLSearchParams(window.location.search);
        const stepParam = urlParams.get("step");
        const dbStep = (thisModuleRow as any)?.last_step;
        const validSteps = ["notes", "quiz", "discussion"];
        const restoredStep = validSteps.includes(stepParam ?? "") ? stepParam!
          : validSteps.includes(dbStep ?? "") ? dbStep
          : "notes";
        setActiveTab(restoredStep as "notes" | "quiz" | "discussion");
        setStepSaved(restoredStep);
      } catch (err) {
        console.error("Error loading progress:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProgress();
  }, [phase, id, moduleIndex, phaseId]);

  const questions = quizData[quizKey] || quizData["ground-zero/module-1"] || [];

  const handleQuizComplete = async (score: number, total: number) => {
    const pct = Math.round((score / total) * 100);
    // 70% passing grade
    if (pct >= 70) {
      setModuleCompleted(true);
      await trackProgress(true, score, "quiz");
    }
  };

  // Persist the current tab position to the DB (best-effort, non-blocking).
  const persistStep = async (step: "notes" | "quiz" | "discussion") => {
    if (!user || step === stepSaved) return;
    setStepSaved(step);
    try {
      await fetch("/api/learn/track-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module_id: id,
          phase_id: phase,
          completed: moduleCompleted,
          last_step: step,
        }),
      });
    } catch (err) {
      // Non-critical — step position is best-effort
      console.warn("Step persist error:", err);
    }
  };

  const handleTabChange = (tab: "notes" | "quiz" | "discussion") => {
    setActiveTab(tab);
    persistStep(tab);
  };

  const trackProgress = async (completed: boolean, quizScore?: number, step?: string) => {
    if (!user) return;
    try {
      const res = await fetch("/api/learn/track-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module_id: id,
          phase_id: phase,
          completed,
          quiz_score: quizScore,
          ...(step ? { last_step: step } : {}),
        }),
      });

      if (res.ok) {
        setModuleCompleted(completed);
        if (completed) {
          setCompletedModules((prev) => {
            if (prev.includes(moduleIndex + 1)) return prev;
            return [...prev, moduleIndex + 1];
          });
        } else {
          setCompletedModules((prev) => prev.filter((m) => m !== moduleIndex + 1));
        }
      }
    } catch (err) {
      console.error("Progress save error:", err);
    }
  };

  const handleVideoProgress = (currentTime: number, duration: number) => {
    // Optional video analytics integration
  };

  if (loading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-text-tertiary uppercase tracking-widest">Loading Module...</p>
        </div>
      </div>
    );
  }

  // Prev / Next slugs
  const prevModuleHref = moduleIndex > 0 ? `/learn/${phase}/module-${moduleIndex}` : null;
  const nextModuleHref = moduleIndex < totalModules - 1 ? `/learn/${phase}/module-${moduleIndex + 2}` : null;

  // Reading progress %
  const progressPercent = Math.round((completedModules.length / totalModules) * 100);

  return (
    <div className="pt-24 min-h-screen">
      {/* Module Navigation Header */}
      <div className="border-b border-border-slate/50 backdrop-blur-md sticky top-20 z-40 bg-background-primary/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href={`/learn/${phase}`}
            className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary hover:text-accent transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Phase
          </Link>

          <div className="flex flex-col items-center text-center">
            <span className="text-[10px] font-mono text-accent uppercase tracking-widest">
              Phase 0{phaseObj.id} — Module 0{moduleIndex + 1}
            </span>
            <h1 className="text-sm font-sans font-bold uppercase tracking-tight">
              {moduleTitle}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {prevModuleHref ? (
              <Link
                href={prevModuleHref}
                className="p-2 border border-border-slate/50 hover:border-border-slate text-text-tertiary hover:text-accent transition-all"
                title="Previous Module"
              >
                <ChevronLeft className="w-4 h-4" />
              </Link>
            ) : (
              <button
                disabled
                className="p-2 border border-border-slate/50/20 text-text-tertiary/20 cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            {nextModuleHref ? (
              <Link
                href={nextModuleHref}
                className="p-2 border border-border-slate/50 hover:border-border-slate text-text-tertiary hover:text-accent transition-all"
                title="Next Module"
              >
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <button
                disabled
                className="p-2 border border-border-slate/50/20 text-text-tertiary/20 cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-12">
            <CoursePlayer
              playbackId={playbackId}
              title={moduleTitle}
              onProgress={handleVideoProgress}
              onEnded={async () => {
                // Video finished — nudge to notes tab and persist the step.
                handleTabChange("notes");
              }}
            />

            {/* Lesson Content Tabs */}
            <div className="space-y-8">
              <div className="flex gap-8 border-b border-border-slate/50">
                {([
                  { key: "notes", label: "written notes" },
                  { key: "quiz", label: `evaluation (${questions.length} q)` },
                  { key: "discussion", label: "discussion" }
                ] as const).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => handleTabChange(tab.key)}
                    className={cn(
                      "pb-4 text-[10px] font-bold uppercase tracking-widest transition-all relative",
                      activeTab === tab.key
                        ? "text-accent"
                        : "text-text-tertiary hover:text-text-primary"
                    )}
                  >
                    {tab.label}
                    {activeTab === tab.key && (
                      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-accent" />
                    )}
                  </button>
                ))}
              </div>

              <div className="min-h-[400px]">
                {activeTab === "notes" && (
                  <div className="space-y-12">
                    <div className="flex items-center justify-between py-2 border-b border-border-slate/50/30">
                      <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
                        Reading Time: {durationText}
                      </span>
                      {moduleCompleted && (
                        <span className="text-[10px] font-mono text-profit uppercase tracking-widest flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                        </span>
                      )}
                    </div>
                    
                    <div 
                      className="prose prose-invert prose-drawdown max-w-none 
                        prose-headings:uppercase prose-headings:font-sans prose-headings:tracking-tight
                        prose-h2:text-2xl prose-h2:font-bold prose-h2:border-b prose-h2:border-border-slate/50/30 prose-h2:pb-3
                        prose-h3:text-lg prose-h3:font-semibold
                        prose-p:text-text-secondary prose-p:leading-relaxed prose-p:font-sans
                        prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-3 prose-ol:text-text-secondary
                        prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2 prose-ul:text-text-secondary
                        prose-strong:text-text-primary prose-strong:font-semibold
                        [&>div]:rounded-r-md"
                      dangerouslySetInnerHTML={{ __html: notesHtml }}
                    />

                    {/* Bottom Navigation inside tab */}
                    <div className="pt-8 border-t border-border-slate/50/30 flex justify-between items-center">
                      {prevModuleHref ? (
                        <Link
                          href={prevModuleHref}
                          className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-text-tertiary hover:text-accent transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" /> Previous Module
                        </Link>
                      ) : (
                        <div />
                      )}

                      {nextModuleHref ? (
                        <Link
                          href={nextModuleHref}
                          className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-text-tertiary hover:text-accent transition-colors"
                        >
                          Next Module <ChevronRight className="w-4 h-4" />
                        </Link>
                      ) : (
                        <Link
                          href={`/learn/${phase}`}
                          className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-text-tertiary hover:text-accent transition-colors"
                        >
                          Finish Phase <CheckCircle2 className="w-4 h-4 text-profit" />
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "quiz" && (
                  <QuizEngine
                    questions={questions}
                    moduleKey={quizKey}
                    onComplete={handleQuizComplete}
                  />
                )}

                {activeTab === "discussion" && (
                  <div className="space-y-8">
                    <div className="p-6 bg-background-elevated/40 border border-border-slate/50 flex gap-4">
                      <div className="w-10 h-10 bg-accent/20 border border-border-slate/50/20 rounded-full shrink-0 animate-pulse" />
                      <textarea
                        placeholder="Add to the discussion..."
                        className="flex-grow bg-transparent outline-none h-24 text-sm font-sans resize-none text-text-primary"
                      />
                    </div>
                    <div className="space-y-6">
                      <div className="p-6 border-l-2 border-border-slate/50 ml-4 space-y-4 bg-background-surface/20">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-text-primary">
                            Admin_Pete
                          </span>
                          <span className="text-[8px] font-mono text-accent uppercase tracking-widest border border-border-slate/50/30 px-2">
                            Floor
                          </span>
                        </div>
                        <p className="text-sm text-text-secondary">
                          Ensure you fully understand the foundational principles in this module before taking the evaluation. Ask questions here if anything is unclear!
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Module Outline & Progress */}
          <aside className="space-y-8 h-fit lg:sticky lg:top-36">
            {/* Reading Progress Indicator */}
            <div className="bg-background-surface/40 backdrop-blur-md border border-border-slate/50 p-6 space-y-4">
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
                Reading Progress
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono font-bold text-text-primary">
                  <span>{progressPercent}% COMPLETE</span>
                  <span>{completedModules.length}/{totalModules}</span>
                </div>
                <div className="w-full h-1 bg-border-slate/30 overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Course Outline */}
            <div className="bg-background-surface/40 backdrop-blur-md border border-border-slate/50 p-6">
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-6">
                Course Outline
              </h4>
              <div className="space-y-3">
                {phaseObj.modules_list.map((modName, idx) => {
                  const modNum = idx + 1;
                  const isCompleted = completedModules.includes(modNum);
                  const isCurrent = modNum === moduleIndex + 1;
                  // First module is always unlocked, others unlock if the previous is completed or it is already completed
                  const isUnlocked = idx === 0 || completedModules.includes(idx) || isCompleted;
                  const status = isCompleted ? "complete" : (isCurrent ? "current" : (isUnlocked ? "unlocked" : "locked"));

                  return (
                    <Link
                      key={idx}
                      href={isUnlocked ? `/learn/${phase}/module-${modNum}` : "#"}
                      className={cn(
                        "flex items-center gap-3 py-3 group border-b border-border-slate/50/30 transition-all",
                        status === "locked" && "opacity-40 cursor-not-allowed",
                        status === "current" && "border-b border-accent/30"
                      )}
                      onClick={(e) => {
                        if (status === "locked") e.preventDefault();
                      }}
                    >
                      <span
                        className={cn(
                          "text-sm font-sans font-bold",
                          status === "current" ? "text-accent" : "text-text-tertiary"
                        )}
                      >
                        0{modNum}
                      </span>
                      <p
                        className={cn(
                          "text-[9px] font-bold uppercase tracking-widest truncate max-w-[170px]",
                          status === "current"
                            ? "text-text-primary"
                            : "text-text-tertiary group-hover:text-text-primary transition-colors"
                        )}
                        title={modName}
                      >
                        {modName}
                      </p>
                      {status === "complete" && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-profit ml-auto shrink-0" />
                      )}
                      {status === "locked" && (
                        <Lock className="w-3.5 h-3.5 text-text-tertiary ml-auto shrink-0" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Complete Button */}
            {!moduleCompleted ? (
              <button
                onClick={() => trackProgress(true)}
                className="w-full py-5 bg-profit hover:bg-profit/90 text-background-primary text-center font-bold uppercase tracking-widest text-[10px] transition-colors flex items-center justify-center gap-2"
              >
                Mark Module Complete
              </button>
            ) : (
              <button
                onClick={() => trackProgress(false)}
                className="w-full py-5 bg-profit/10 border border-profit/30 text-profit text-center font-bold uppercase tracking-widest text-[10px] transition-colors flex items-center justify-center gap-2 group hover:bg-profit/20"
              >
                <CheckCircle2 className="w-4 h-4 text-profit" /> 
                <span className="group-hover:hidden">Module Complete</span>
                <span className="hidden group-hover:inline">Mark Incomplete</span>
              </button>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
