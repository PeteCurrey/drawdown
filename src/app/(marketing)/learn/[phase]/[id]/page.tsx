"use client";

import { useState, use } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { QuizEngine } from "@/components/quiz/QuizEngine";
import { quizData } from "@/data/quizzes";
import { CoursePlayer } from "@/components/video/CoursePlayer";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  CheckCircle2,
} from "lucide-react";

interface Props {
  params: Promise<{ phase: string; id: string }>;
}

export default function ModulePage({ params }: Props) {
  const { phase, id } = use(params);
  const [activeTab, setActiveTab] = useState<"notes" | "quiz" | "discussion">("notes");
  const [moduleCompleted, setModuleCompleted] = useState(false);

  const quizKey = `${phase}/${id}`;
  const questions = quizData[quizKey] || quizData["ground-zero/module-3"] || [];

  const handleQuizComplete = async (score: number, total: number) => {
    const pct = Math.round((score / total) * 100);
    if (pct >= 70) {
      setModuleCompleted(true);
      await trackProgress(true);
    }
  };

  const trackProgress = async (completed: boolean) => {
    try {
      await fetch("/api/learn/track-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module_id: id,
          phase_id: phase,
          completed
        })
      });
    } catch (err) {
      console.error("Progress save error:", err);
    }
  };

  const handleVideoProgress = (currentTime: number, duration: number) => {
    // Optionally track video progress to API here every N seconds
  };

  return (
    <div className="pt-24 min-h-screen bg-background-primary">
      {/* Module Navigation Header */}
      <div className="border-b border-border-slate bg-background-surface/50 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href={`/learn/${phase}`}
            className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary hover:text-accent transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Phase
          </Link>

          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono text-accent uppercase tracking-widest">
              Phase 01 — Module 03
            </span>
            <h1 className="text-sm font-display font-bold uppercase tracking-tight">
              The Math of Survivability
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 border border-border-slate hover:border-accent text-text-tertiary hover:text-accent transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-2 border border-border-slate hover:border-accent text-text-tertiary hover:text-accent transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-12">
            <CoursePlayer 
              playbackId="FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA" // Standard Mux public test video
              title="The Math of Survivability"
              onProgress={handleVideoProgress}
              onEnded={() => {
                if (!moduleCompleted) {
                  // Optionally mark watch complete or prompt for quiz
                }
              }}
            />

            {/* Lesson Content Tabs */}
            <div className="space-y-8">
              <div className="flex gap-8 border-b border-border-slate">
                {(["notes", "quiz", "discussion"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "pb-4 text-[10px] font-bold uppercase tracking-widest transition-all relative",
                      activeTab === tab
                        ? "text-accent"
                        : "text-text-tertiary hover:text-text-primary"
                    )}
                  >
                    {tab}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-accent" />
                    )}
                  </button>
                ))}
              </div>

              <div className="min-h-[400px]">
                {activeTab === "notes" && (
                  <div className="prose prose-invert prose-drawdown max-w-none">
                    <h2>Mastering the Math</h2>
                    <p>
                      Trading is often taught as a series of chart patterns, but the
                      reality is much more clinical. It&apos;s a game of statistics,
                      probability, and risk management.
                    </p>
                    <p>
                      In this lesson, we break down the formula for{" "}
                      <strong>Expected Value (EV)</strong> and why focusing on your
                      P&amp;L instead of your process is the fastest way to lose your
                      account.
                    </p>
                    <ul>
                      <li>The formula for Expected Value</li>
                      <li>Understanding the sample size of 20 trades</li>
                      <li>Why drawdown is your only real enemy</li>
                    </ul>
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
                    <div className="p-6 bg-background-elevated border border-border-slate flex gap-4">
                      <div className="w-10 h-10 bg-accent/20 border border-accent/20 rounded-full shrink-0" />
                      <textarea
                        placeholder="Add to the discussion..."
                        className="flex-grow bg-transparent outline-none h-24 text-sm font-sans resize-none"
                      />
                    </div>
                    <div className="space-y-6">
                      <div className="p-6 border-l-2 border-border-slate ml-4 space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-text-primary">
                            Admin_Pete
                          </span>
                          <span className="text-[8px] font-mono text-accent uppercase tracking-widest border border-accent/30 px-2">
                            Floor
                          </span>
                        </div>
                        <p className="text-sm text-text-secondary">
                          If you&apos;re struggling with the EV formula, check out the
                          resources tab in Phase 1 Module 2.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Module Outline */}
          <aside className="space-y-8 h-fit lg:sticky lg:top-32">
            <div className="bg-background-surface border border-border-slate p-8">
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-6">
                Course Outline
              </h4>
              <div className="space-y-4">
                {[
                  { id: 1, title: "Industry Toxins", status: "complete" },
                  { id: 2, title: "The Edge Gap", status: "complete" },
                  { id: 3, title: "Math of Survival", status: "current" },
                  { id: 4, title: "Capital vs Ego", status: "locked" },
                ].map((mod) => (
                  <div
                    key={mod.id}
                    className={cn(
                      "flex items-center gap-4 py-3 group cursor-pointer border-b border-border-slate/30",
                      mod.status === "locked" && "opacity-40"
                    )}
                  >
                    <span
                      className={cn(
                        "text-lg font-display font-bold",
                        mod.status === "current"
                          ? "text-accent"
                          : "text-text-tertiary"
                      )}
                    >
                      0{mod.id}
                    </span>
                    <p
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-widest",
                        mod.status === "current"
                          ? "text-text-primary"
                          : "text-text-tertiary group-hover:text-text-primary transition-colors"
                      )}
                    >
                      {mod.title}
                    </p>
                    {mod.status === "complete" && (
                      <CheckCircle2 className="w-3 h-3 text-profit ml-auto" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setModuleCompleted(true)}
              className={cn(
                "w-full py-5 text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                moduleCompleted
                  ? "bg-profit/20 text-profit border border-profit/30 cursor-default"
                  : "bg-profit text-background-primary hover:bg-profit/90"
              )}
            >
              {moduleCompleted ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Module Complete
                </>
              ) : (
                "Mark Module Complete"
              )}
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
