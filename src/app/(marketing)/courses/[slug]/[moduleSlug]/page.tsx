"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { phases } from "@/data/courses";
import { courseContent } from "@/data/courseContent";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  Play, 
  BookOpen, 
  Lock, 
  CheckCircle2,
  Sparkles,
  Shield,
  Layers,
  ChevronRight
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string; moduleSlug: string }>;
}

interface PhaseTheme {
  color: string;
  colorHex: string;
  borderClass: string;
  glowClass: string;
  buttonBgClass: string;
}

const THEME_MAP: Record<string, PhaseTheme> = {
  "ground-zero": {
    color: "text-slate-600",
    colorHex: "#64748b",
    borderClass: "border-slate-200 text-slate-700 bg-slate-50",
    glowClass: "from-slate-600/10 via-white to-white",
    buttonBgClass: "bg-slate-600 hover:bg-slate-700 text-white shadow-slate-600/20"
  },
  "chart-reader": {
    color: "text-emerald-600",
    colorHex: "#10b981",
    borderClass: "border-emerald-200 text-emerald-700 bg-emerald-50",
    glowClass: "from-emerald-600/10 via-white to-white",
    buttonBgClass: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
  },
  "strategist": {
    color: "text-indigo-600",
    colorHex: "#6366f1",
    borderClass: "border-indigo-200 text-indigo-700 bg-indigo-50",
    glowClass: "from-indigo-600/10 via-white to-white",
    buttonBgClass: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20"
  },
  "risk-manager": {
    color: "text-rose-600",
    colorHex: "#f43f5e",
    borderClass: "border-rose-200 text-rose-700 bg-rose-50",
    glowClass: "from-rose-600/10 via-white to-white",
    buttonBgClass: "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20"
  },
  "mind-over-market": {
    color: "text-purple-600",
    colorHex: "#a855f7",
    borderClass: "border-purple-200 text-purple-700 bg-purple-50",
    glowClass: "from-purple-600/10 via-white to-white",
    buttonBgClass: "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/20"
  },
  "the-edge": {
    color: "text-cyan-600",
    colorHex: "#06b6d4",
    borderClass: "border-cyan-200 text-cyan-700 bg-cyan-50",
    glowClass: "from-cyan-600/10 via-white to-white",
    buttonBgClass: "bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-600/20"
  },
  "fundamental-edge": {
    color: "text-amber-600",
    colorHex: "#d97706",
    borderClass: "border-amber-200 text-amber-700 bg-amber-50",
    glowClass: "from-amber-600/10 via-white to-white",
    buttonBgClass: "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20"
  },
  "derivatives-options": {
    color: "text-violet-600",
    colorHex: "#7c3aed",
    borderClass: "border-violet-200 text-violet-700 bg-violet-50",
    glowClass: "from-violet-600/10 via-white to-white",
    buttonBgClass: "bg-violet-600 hover:bg-violet-700 text-white shadow-violet-600/20"
  },
  "portfolio-architect": {
    color: "text-emerald-600",
    colorHex: "#059669",
    borderClass: "border-emerald-200 text-emerald-700 bg-emerald-50",
    glowClass: "from-emerald-600/10 via-white to-white",
    buttonBgClass: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
  }
};

const DEFAULT_THEME: PhaseTheme = {
  color: "text-cyan-600",
  colorHex: "#06b6d4",
  borderClass: "border-cyan-200 text-cyan-700 bg-cyan-50",
  glowClass: "from-cyan-600/10 via-white to-white",
  buttonBgClass: "bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-600/20"
};

export default function ModuleMarketingPage({ params }: Props) {
  const { slug, moduleSlug } = use(params);

  // Find parent phase
  const phaseIndex = phases.findIndex(p => p.slug === slug);
  const phase = phases[phaseIndex];

  if (!phase) {
    return notFound();
  }

  // Parse module index from module-X
  const moduleIndex = parseInt(moduleSlug.replace("module-", "")) - 1;
  const moduleTitle = phase.modules_list[moduleIndex];

  if (moduleIndex < 0 || moduleIndex >= phase.modules_list.length || !moduleTitle) {
    return notFound();
  }

  const theme = THEME_MAP[phase.slug] || DEFAULT_THEME;

  // Retrieve details from courseContent if exists
  const phaseContentObj = courseContent[phase.slug];
  const moduleContentObj = phaseContentObj ? phaseContentObj[moduleSlug] : null;

  const durationText = moduleContentObj?.duration || "25 min read / 15 min video";
  const notesHtml = moduleContentObj?.notes || null;

  // Calculate sequential navigation links (Previous / Next)
  let prevLink: { href: string; label: string } | null = null;
  let nextLink: { href: string; label: string } | null = null;

  // 1. Check if there's a previous module in the SAME phase
  if (moduleIndex > 0) {
    prevLink = {
      href: `/courses/${phase.slug}/module-${moduleIndex}`,
      label: `0${moduleIndex}: ${phase.modules_list[moduleIndex - 1]}`
    };
  } 
  // Else check if there's a PREVIOUS phase
  else if (phaseIndex > 0) {
    const prevPhaseObj = phases[phaseIndex - 1];
    prevLink = {
      href: `/courses/${prevPhaseObj.slug}/module-${prevPhaseObj.modules_list.length}`,
      label: `Phase ${prevPhaseObj.number} Final Chapter`
    };
  }

  // 2. Check if there's a next module in the SAME phase
  if (moduleIndex < phase.modules_list.length - 1) {
    nextLink = {
      href: `/courses/${phase.slug}/module-${moduleIndex + 2}`,
      label: `0${moduleIndex + 2}: ${phase.modules_list[moduleIndex + 1]}`
    };
  } 
  // Else check if there's a NEXT phase
  else if (phaseIndex < phases.length - 1) {
    const nextPhaseObj = phases[phaseIndex + 1];
    nextLink = {
      href: `/courses/${nextPhaseObj.slug}/module-1`,
      label: `Phase ${nextPhaseObj.number}: ${nextPhaseObj.modules_list[0]}`
    };
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-mkt-ink font-sans selection:bg-neutral-100 selection:text-mkt-ink">
      
      {/* 1. Module Hero Section */}
      <section className="h-[90vh] min-h-[600px] relative flex flex-col justify-center items-center overflow-hidden border-b border-mkt-bd select-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.012)_1px,transparent_1px)] bg-[size:40px_40px] z-0 pointer-events-none" />
        <div 
          className="absolute inset-0 z-0 pointer-events-none transition-all duration-1000"
          style={{
            backgroundImage: `radial-gradient(circle at center, ${theme.colorHex}08 0%, transparent 65%)`
          }}
        />

        <div className="absolute top-28 left-0 right-0 z-20 max-w-7xl mx-auto px-6">
          <Breadcrumbs />
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10 flex flex-col items-center text-center space-y-6">
          <div className="flex items-center gap-3 text-mkt-i4">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">
              Phase {phase.number} // Course Syllabus Chapter
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-sans font-black uppercase tracking-tighter leading-none text-mkt-ink">
            {moduleTitle}<span className={theme.color}>.</span>
          </h1>

          <p className="text-sm md:text-lg text-mkt-i3 font-sans max-w-2xl font-light">
            Part of our masterclass path. We systematically cover risk, logic, and mechanics to build professional edge.
          </p>

          <div className="flex items-center gap-4 text-xs font-mono pt-2">
            <span className={cn("px-2.5 py-0.5 rounded border uppercase tracking-wider", theme.borderClass)}>
              {phase.tier} Tier Access
            </span>
            <span className="text-mkt-i4 uppercase tracking-widest flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-mkt-i3" /> {durationText}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 w-full sm:w-auto">
            <Link 
              href="#overview"
              className={cn(
                "px-8 py-4 font-sans font-black uppercase tracking-[0.2em] text-xs transition-all duration-300 transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2",
                theme.buttonBgClass
              )}
            >
              Analyze Chapter Outline <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href={`/courses/${phase.slug}`}
              className="px-8 py-4 border border-mkt-bd hover:border-mkt-ink hover:bg-neutral-50 text-mkt-ink font-sans font-bold uppercase tracking-[0.2em] text-xs transition-all duration-300 flex items-center justify-center"
            >
              Back to Phase Overview
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Overview / Content Section */}
      <section id="overview" className="py-24 border-b border-mkt-bd scroll-mt-24 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left Content Area */}
            <div className="lg:col-span-8 space-y-16">
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-mkt-i4">01_Curriculum_Brief</span>
                  <div className="h-px flex-grow bg-mkt-bd" />
                </div>

                <h2 className="text-3xl font-sans font-extrabold uppercase text-mkt-ink">
                  What is covered in this chapter
                </h2>

                {notesHtml ? (
                  <div 
                    className="prose prose-drawdown max-w-none 
                      prose-headings:uppercase prose-headings:font-sans prose-headings:tracking-tight
                      prose-h2:text-xl prose-h2:font-bold prose-h2:border-b prose-h2:border-border-slate/50/30 prose-h2:pb-2
                      prose-h3:text-base prose-h3:font-semibold
                      prose-p:text-text-secondary prose-p:leading-relaxed prose-p:font-sans
                      prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-3 prose-ol:text-text-secondary
                      prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2 prose-ul:text-text-secondary
                      prose-strong:text-text-primary prose-strong:font-semibold"
                    dangerouslySetInnerHTML={{ __html: notesHtml }}
                  />
                ) : (
                  <div className="space-y-6 text-sm text-mkt-i3 leading-relaxed font-sans">
                    <p>
                      In this module, you will cover the core theoretical framework and mathematical modeling behind <strong>{moduleTitle}</strong>. 
                      You will examine how institutional desks assess these variables and how to structuralize your strategy to capitalize on market opportunities while preserving risk controls.
                    </p>
                    
                    <div className="p-6 bg-white border border-mkt-bd rounded-[14px] space-y-4 shadow-sm">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-mkt-ink flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" /> Key Educational Takeaways:
                      </h4>
                      <ul className="space-y-2.5 pl-5 list-disc text-xs text-mkt-i2">
                        <li>Deconstruct the core underlying mechanisms driving {moduleTitle}.</li>
                        <li>Identify the statistical patterns and edge behaviors surrounding this concept.</li>
                        <li>Implement a defined, mechanical ruleset for execution, entries, and exits.</li>
                        <li>Survive drawdown sequences by applying professional sizing formulas.</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Course Lock CTA Section */}
              <div className="p-10 border border-mkt-bd bg-white rounded-[14px] relative overflow-hidden group shadow-sm">
                <div className={cn("absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r", theme.color === "text-slate-600" ? "from-slate-500 to-slate-600" : "from-cyan-500 to-indigo-600")} />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="space-y-3 max-w-lg">
                    <div className="flex items-center gap-2 text-mkt-i4">
                      <Lock className="w-4 h-4" />
                      <span className="text-[9px] font-mono uppercase tracking-widest font-bold">Interactive Lesson Locked</span>
                    </div>
                    <h3 className="text-xl font-sans font-bold uppercase text-mkt-ink">Unlock Full Academy Access</h3>
                    <p className="text-xs text-mkt-i3 leading-relaxed">
                      Paying dashboard members get access to the high-definition video walkthroughs, interactive quizzes, downloadable PDFs, and community chat channels for this module.
                    </p>
                  </div>
                  <Link 
                    href="/signup" 
                    className="px-6 py-4 bg-mkt-ink hover:bg-neutral-800 text-white font-bold uppercase tracking-widest text-[10px] transition-colors shrink-0 text-center"
                  >
                    Start Free Trial
                  </Link>
                </div>
              </div>

            </div>

            {/* Right Sidebar Syllabus Outline */}
            <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-8">
              
              <div className="p-6 border border-mkt-bd rounded-[14px] bg-white space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-mkt-bd/80">
                  <Layers className="w-4 h-4 text-mkt-i4" />
                  <h4 className="text-[10px] font-mono uppercase tracking-widest font-bold text-mkt-ink">
                    Phase {phase.number} Chapters
                  </h4>
                </div>

                <div className="space-y-3">
                  {phase.modules_list.map((modName, idx) => {
                    const isCurrent = idx === moduleIndex;
                    return (
                      <Link
                        key={idx}
                        href={`/courses/${phase.slug}/module-${idx + 1}`}
                        className={cn(
                          "flex items-start gap-3 py-2.5 border-b border-neutral-100 hover:bg-neutral-50 transition-all rounded px-2 block",
                          isCurrent && "bg-neutral-50 border-l-2 border-l-mkt-ink pl-3"
                        )}
                      >
                        <span className={cn("text-xs font-mono font-bold mt-0.5", isCurrent ? theme.color : "text-mkt-i4")}>
                          {(idx + 1).toString().padStart(2, "0")}
                        </span>
                        <span className={cn("text-xs font-sans leading-tight", isCurrent ? "text-mkt-ink font-bold" : "text-mkt-i3 hover:text-mkt-ink")}>
                          {modName}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3. Sequential Chapter Traversal Navigation */}
      <section className="py-12 bg-white border-b border-mkt-bd">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            
            {prevLink ? (
              <Link 
                href={prevLink.href}
                className="flex items-center gap-3 group text-left w-full sm:w-auto p-4 border border-mkt-bd rounded-[14px] hover:border-mkt-bds hover:shadow-[0_8px_32px_rgba(0,0,0,0.04)] transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 text-mkt-i4 group-hover:-translate-x-1 transition-transform" />
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-mkt-i4 block">Previous Chapter</span>
                  <span className="text-xs font-sans font-bold uppercase text-mkt-ink max-w-[200px] truncate block">
                    {prevLink.label}
                  </span>
                </div>
              </Link>
            ) : (
              <div className="w-full sm:w-auto invisible" />
            )}

            <Link 
              href="/courses" 
              className="text-[10px] font-mono uppercase tracking-[0.2em] text-mkt-i3 hover:text-cyan-500 transition-colors font-bold"
            >
              View Full Path Map
            </Link>

            {nextLink ? (
              <Link 
                href={nextLink.href}
                className="flex items-center justify-end gap-3 group text-right w-full sm:w-auto p-4 border border-mkt-bd rounded-[14px] hover:border-mkt-bds hover:shadow-[0_8px_32px_rgba(0,0,0,0.04)] transition-all duration-300"
              >
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-mkt-i4 block">Next Chapter</span>
                  <span className="text-xs font-sans font-bold uppercase text-mkt-ink max-w-[200px] truncate block">
                    {nextLink.label}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-mkt-i4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <div className="w-full sm:w-auto invisible" />
            )}

          </div>
        </div>
      </section>

    </div>
  );
}
