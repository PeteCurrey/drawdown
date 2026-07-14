import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  ChevronLeft,
  CheckCircle2,
  Clock,
  PlayCircle,
  BookOpen,
  ChevronRight,
  Lock,
  Circle,
} from "lucide-react";
import { phases } from "@/data/courses";
import { CurriculumQuiz } from "@/components/curriculum/CurriculumQuiz";
import { ReadingProgressBar } from "@/components/curriculum/ModulePageClient";

const TIER_WEIGHT: Record<string, number> = {
  free:       0,
  foundation: 1,
  edge:       2,
  floor:      3,
};

const PHASE_MIN_WEIGHT: Record<string, number> = {
  "ground-zero":      0,
  "chart-reader":     1,
  "strategist":       1,
  "risk-manager":     1,
  "mind-over-market": 2,
  "the-edge":         3,
};

export default async function ModulePage({ params }: { params: Promise<{ phase: string; module: string }> }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { phase, module } = await params;

  const phaseConfig = phases.find((p) => p.slug === phase);
  if (!phaseConfig) redirect("/dashboard/curriculum");

  // Tier gate
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .single();

  const tier = (profile as any)?.subscription_tier as string | undefined;
  const userWeight = TIER_WEIGHT[tier ?? "free"] ?? 0;
  const minWeight  = PHASE_MIN_WEIGHT[phaseConfig.slug] ?? 0;

  if (userWeight < minWeight) redirect("/dashboard/curriculum");

  // Parse module number
  const moduleNumberStr = module.replace("module-", "");
  const moduleNumber    = parseInt(moduleNumberStr, 10);
  if (isNaN(moduleNumber)) redirect(`/dashboard/curriculum/${phase}`);

  // ── Fetch data ──
  let allModules: any[]        = [];
  let currentModule: any       = null;
  let completedModules         = new Set<number>();
  let dbError                  = false;

  try {
    const [modulesRes, currentRes, progressRes] = await Promise.all([
      supabase
        .from("curriculum_modules")
        .select("module_number, title, estimated_minutes, is_published")
        .eq("phase_slug", phaseConfig.slug)
        .order("module_number", { ascending: true }),
      supabase
        .from("curriculum_modules")
        .select("*")
        .eq("phase_slug", phaseConfig.slug)
        .eq("module_number", moduleNumber)
        .maybeSingle(),
      supabase
        .from("course_progress")
        .select("module, completed")
        .eq("user_id", user.id)
        .eq("phase", phaseConfig.id),
    ]);

    if (modulesRes.error && modulesRes.error.code === "42P01") {
      dbError = true;
    } else {
      allModules       = modulesRes.data ?? [];
      currentModule    = currentRes.data ?? null;
      completedModules = new Set(
        (progressRes.data ?? []).filter((r) => r.completed).map((r) => r.module)
      );
    }
  } catch {
    dbError = true;
  }

  // ── Module not yet seeded or DB error ──
  if (dbError || !currentModule) {
    return (
      <>
        <ReadingProgressBar />
        <div className="min-h-screen" style={{ background: "#0a0a0a" }}>
          <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in duration-500">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest mb-10"
              style={{ color: "rgba(255,255,255,0.35)" }}>
              <Link href="/dashboard/curriculum" className="hover:text-white transition-colors">Curriculum</Link>
              <ChevronRight className="w-3 h-3 mx-0.5 opacity-50" />
              <Link href={`/dashboard/curriculum/${phase}`} className="hover:text-white transition-colors">{phaseConfig.name}</Link>
              <ChevronRight className="w-3 h-3 mx-0.5 opacity-50" />
              <span style={{ color: "#C8F135" }}>Module {moduleNumber}</span>
            </div>

            <div className="rounded-2xl border border-dashed p-16 text-center"
              style={{ borderColor: "rgba(255,255,255,0.1)", background: "#111111" }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: "rgba(200,241,53,0.08)", border: "1px solid rgba(200,241,53,0.2)" }}>
                <BookOpen className="w-6 h-6" style={{ color: "#C8F135" }} />
              </div>
              <h2 className="text-2xl font-bold font-syne text-white mb-3">
                {phaseConfig.modules_list[moduleNumber - 1] ?? `Module ${moduleNumber}`}
              </h2>
              <p className="text-sm max-w-md mx-auto mb-8" style={{ color: "rgba(255,255,255,0.45)" }}>
                This module is currently being developed. Full written content will be available shortly.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link href={`/dashboard/curriculum/${phase}`}
                  className="px-5 py-2.5 text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-colors"
                  style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.12)" }}>
                  ← Back to Phase
                </Link>
                {moduleNumber < phaseConfig.modules_count && (
                  <Link href={`/dashboard/curriculum/${phase}/module-${moduleNumber + 1}`}
                    className="px-5 py-2.5 text-black text-xs font-bold uppercase tracking-widest rounded-lg transition-colors"
                    style={{ background: "#C8F135" }}>
                    Next Module →
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Full module view ──
  const moduleList    = allModules;
  const nextModule    = moduleList.find((m) => m.module_number === moduleNumber + 1);
  const prevModule    = moduleList.find((m) => m.module_number === moduleNumber - 1);
  const nextModuleUrl = nextModule
    ? `/dashboard/curriculum/${phase}/module-${nextModule.module_number}`
    : null;

  const paddedNum = String(moduleNumber).padStart(2, "0");
  const readingTime = currentModule.estimated_minutes
    ? `~${currentModule.estimated_minutes} min read`
    : "~15 min read";

  return (
    <>
      {/* Reading progress bar — fixed top */}
      <ReadingProgressBar />

      <div className="pb-24 animate-in fade-in duration-700" style={{ background: "#0a0a0a", minHeight: "100vh" }}>
        <div className="flex flex-col lg:flex-row gap-8 max-w-screen-2xl mx-auto px-4 lg:px-8 pt-8">

          {/* ── Left Sidebar ── */}
          <aside className="w-full lg:w-72 shrink-0 order-2 lg:order-1">
            <div className="sticky top-24 rounded-2xl overflow-hidden"
              style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.08)" }}>

              {/* Sidebar header */}
              <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <p className="text-[9px] font-mono font-bold uppercase tracking-widest mb-0.5"
                  style={{ color: "#C8F135" }}>
                  Phase {phaseConfig.number}
                </p>
                <h3 className="text-xs font-semibold text-white">{phaseConfig.name}</h3>
              </div>

              <div className="p-3 space-y-1">
                {moduleList.map((mod) => {
                  const isCompleted = completedModules.has(mod.module_number);
                  const isActive    = mod.module_number === moduleNumber;
                  const isLocked    = !mod.is_published;

                  return (
                    <Link
                      key={mod.module_number}
                      href={`/dashboard/curriculum/${phase}/module-${mod.module_number}`}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group"
                      style={{
                        background: isActive
                          ? "rgba(200,241,53,0.07)"
                          : "transparent",
                        borderLeft: isActive
                          ? "2px solid #C8F135"
                          : "2px solid transparent",
                        opacity: isLocked ? 0.4 : 1,
                        pointerEvents: isLocked ? "none" : "auto",
                      }}
                    >
                      {/* Status icon */}
                      <div className="shrink-0">
                        {isCompleted ? (
                          <div className="w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: "#C8F135" }}>
                            <CheckCircle2 className="w-3 h-3 text-black" strokeWidth={3} />
                          </div>
                        ) : isLocked ? (
                          <div className="w-5 h-5 rounded-full border flex items-center justify-center"
                            style={{ borderColor: "rgba(255,255,255,0.2)" }}>
                            <Lock className="w-2.5 h-2.5" style={{ color: "rgba(255,255,255,0.3)" }} />
                          </div>
                        ) : isActive ? (
                          <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                            style={{ borderColor: "#C8F135" }}>
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#C8F135" }} />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border flex items-center justify-center"
                            style={{ borderColor: "rgba(255,255,255,0.25)" }}>
                            <span className="text-[9px] font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>
                              {mod.module_number}
                            </span>
                          </div>
                        )}
                      </div>

                      <span
                        className="text-xs font-medium leading-tight transition-colors"
                        style={{
                          color: isActive
                            ? "#ffffff"
                            : isCompleted
                            ? "rgba(255,255,255,0.55)"
                            : "rgba(255,255,255,0.45)",
                        }}
                      >
                        {mod.title}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* ── Main Content ── */}
          <main className="flex-1 order-1 lg:order-2 min-w-0">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest mb-8 flex-wrap"
              style={{ color: "rgba(255,255,255,0.3)" }}>
              <Link href="/dashboard/curriculum" className="hover:text-white transition-colors">Curriculum</Link>
              <ChevronRight className="w-3 h-3 opacity-50" />
              <Link href={`/dashboard/curriculum/${phase}`} className="hover:text-white transition-colors">
                Phase {phaseConfig.number}
              </Link>
              <ChevronRight className="w-3 h-3 opacity-50" />
              <span style={{ color: "#C8F135" }}>Module {moduleNumber}</span>
            </div>

            {/* ── Module Header Card ── */}
            <div className="relative rounded-2xl overflow-hidden mb-8"
              style={{
                background: "#111111",
                borderTop: "3px solid #C8F135",
                border: "1px solid rgba(255,255,255,0.08)",
                borderTopColor: "#C8F135",
              }}>

              {/* Giant ghost number */}
              <div className="absolute right-6 top-2 font-mono font-black select-none pointer-events-none"
                style={{
                  fontSize: "clamp(5rem, 14vw, 9rem)",
                  lineHeight: 1,
                  color: "rgba(200,241,53,0.06)",
                  letterSpacing: "-0.04em",
                }}>
                {paddedNum}
              </div>

              <div className="relative z-10 p-8 pb-7">
                {/* Phase label */}
                <p className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] mb-3"
                  style={{ color: "#C8F135" }}>
                  Phase {phaseConfig.number} · {phaseConfig.name}
                </p>

                {/* Title */}
                <h1 className="font-syne font-bold text-white mb-3 leading-tight"
                  style={{ fontSize: "clamp(1.7rem, 4vw, 2.4rem)" }}>
                  {currentModule.title}
                </h1>

                {/* Subtitle */}
                {currentModule.subtitle && (
                  <p className="text-lg italic mb-5" style={{ color: "rgba(255,255,255,0.55)", fontFamily: "DM Sans, Outfit, sans-serif" }}>
                    {currentModule.subtitle}
                  </p>
                )}

                {/* Meta row */}
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold"
                    style={{ background: "rgba(200,241,53,0.1)", color: "#C8F135", border: "1px solid rgba(200,241,53,0.2)" }}>
                    <Clock className="w-3 h-3" />
                    {readingTime}
                  </div>
                  {completedModules.has(moduleNumber) && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold"
                      style={{ background: "rgba(24,184,128,0.1)", color: "#18B880", border: "1px solid rgba(24,184,128,0.2)" }}>
                      <CheckCircle2 className="w-3 h-3" />
                      Completed
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Content Card ── */}
            <div className="rounded-2xl overflow-hidden"
              style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)" }}>

              <div className="p-8 lg:p-12">
                {/* Video embed */}
                {currentModule.video_url && (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-10 group cursor-pointer"
                    style={{ border: "1px solid rgba(255,255,255,0.1)", background: "#000" }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center z-10">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                        style={{ background: "rgba(200,241,53,0.15)", border: "2px solid #C8F135" }}>
                        <PlayCircle className="w-8 h-8" style={{ color: "#C8F135" }} />
                      </div>
                    </div>
                    <img
                      src={`https://img.youtube.com/vi/${currentModule.video_url.split("v=")[1]}/maxresdefault.jpg`}
                      alt="Video thumbnail"
                      className="w-full h-full object-cover opacity-60"
                    />
                  </div>
                )}

                {/* ── Written content ── */}
                {currentModule.content_html ? (
                  <div
                    className="prose prose-invert max-w-none
                      prose-h2:text-white prose-h2:font-syne prose-h2:text-2xl
                      prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b
                      prose-h2:border-white/10 prose-h2:pb-3
                      prose-h3:text-white/90 prose-h3:font-syne prose-h3:text-lg
                      prose-p:text-white/70 prose-p:leading-relaxed prose-p:mb-4
                      prose-li:text-white/70 prose-li:mb-1
                      prose-blockquote:border-l-[#C8F135] prose-blockquote:bg-white/5
                      prose-blockquote:rounded-r-lg prose-blockquote:py-3
                      prose-blockquote:px-4 prose-blockquote:text-white/80
                      prose-strong:text-white"
                    dangerouslySetInnerHTML={{ __html: currentModule.content_html }}
                  />
                ) : (
                  /* Empty state */
                  <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(200,241,53,0.1)", border: "1px solid rgba(200,241,53,0.2)" }}>
                      <BookOpen className="w-5 h-5" style={{ color: "#C8F135" }} />
                    </div>
                    <h3 className="text-white font-syne text-lg">Content Coming Soon</h3>
                    <p className="text-sm max-w-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                      This module is being prepared by our trading educators.
                      Check back shortly — we&apos;re publishing new content daily.
                    </p>
                  </div>
                )}
              </div>

              {/* ── Quiz section ── */}
              {currentModule.quiz && currentModule.quiz.length > 0 && (
                <>
                  {/* Visual separator + header */}
                  <div className="px-8 lg:px-12 pt-2 pb-8"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>

                    <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-3"
                      style={{ color: "#C8F135" }}>
                      // KNOWLEDGE CHECK
                    </p>
                    <h2 className="font-syne font-bold text-white text-2xl mb-1">
                      Test Your Understanding
                    </h2>
                    <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                      Complete the quiz to mark this module as done. You need 75% to pass.
                    </p>
                  </div>

                  <div className="px-8 lg:px-12 pb-8">
                    <CurriculumQuiz
                      phaseSlug={phaseConfig.slug}
                      moduleNumber={moduleNumber}
                      questions={currentModule.quiz}
                      nextModuleUrl={nextModuleUrl}
                    />
                  </div>
                </>
              )}
            </div>

            {/* ── Navigation Footer ── */}
            <div className="mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
              style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              {prevModule ? (
                <Link
                  href={`/dashboard/curriculum/${phase}/module-${prevModule.module_number}`}
                  className="flex items-center gap-2 px-6 py-3 text-white text-xs font-bold uppercase tracking-widest transition-all rounded-xl w-full md:w-auto justify-center hover:brightness-110"
                  style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.12)" }}
                >
                  <ChevronLeft className="w-4 h-4" /> Previous Module
                </Link>
              ) : (
                <div />
              )}

              {(!currentModule.quiz || currentModule.quiz.length === 0) && (
                <div className="text-center md:text-right w-full md:w-auto">
                  <p className="text-[10px] font-mono mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>
                    No quiz required for this module.
                  </p>
                  <Link
                    href={nextModuleUrl || `/dashboard/curriculum/${phase}`}
                    className="flex items-center gap-2 px-8 py-3 text-black text-xs font-bold uppercase tracking-widest transition-all rounded-xl w-full md:w-auto justify-center hover:brightness-105"
                    style={{ background: "#C8F135" }}
                  >
                    Mark Complete &amp; Next <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </main>

          {/* ── Right Sidebar: Key Takeaways ── */}
          <aside className="hidden xl:block w-64 shrink-0 order-3">
            <div className="sticky top-24 space-y-5">
              {currentModule.key_takeaways && currentModule.key_takeaways.length > 0 && (
                <div className="rounded-2xl overflow-hidden"
                  style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="px-5 py-4 flex items-center gap-2"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(200,241,53,0.04)" }}>
                    <BookOpen className="w-4 h-4 shrink-0" style={{ color: "#C8F135" }} />
                    <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-white">
                      Key Takeaways
                    </h3>
                  </div>
                  <ul className="p-5 space-y-4">
                    {currentModule.key_takeaways.map((takeaway: string, idx: number) => (
                      <li key={idx} className="flex gap-3 text-sm leading-relaxed"
                        style={{ color: "rgba(255,255,255,0.6)" }}>
                        <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                          style={{ background: "#C8F135" }} />
                        {takeaway}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Phase progress summary */}
              <div className="rounded-2xl p-5"
                style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.08)" }}>
                <p className="text-[9px] font-mono font-bold uppercase tracking-widest mb-3"
                  style={{ color: "rgba(255,255,255,0.35)" }}>
                  Phase Progress
                </p>
                <div className="flex items-end justify-between mb-2">
                  <span className="text-white font-mono font-bold text-xl">
                    {completedModules.size}
                    <span className="text-sm font-normal" style={{ color: "rgba(255,255,255,0.4)" }}>
                      /{moduleList.length}
                    </span>
                  </span>
                  <span className="text-xs font-mono" style={{ color: "#C8F135" }}>
                    {moduleList.length > 0
                      ? Math.round((completedModules.size / moduleList.length) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${moduleList.length > 0 ? (completedModules.size / moduleList.length) * 100 : 0}%`,
                      background: "linear-gradient(90deg, #C8F135, #a8e010)",
                    }}
                  />
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </>
  );
}
