import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ChevronLeft, CheckCircle2, Clock, PlayCircle, BookOpen, ChevronRight } from "lucide-react";
import { phases } from "@/data/courses";
import { CurriculumQuiz } from "@/components/curriculum/CurriculumQuiz";

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
  const minWeight = PHASE_MIN_WEIGHT[phaseConfig.slug] ?? 0;

  if (userWeight < minWeight) redirect("/dashboard/curriculum");

  // Parse module number
  const moduleNumberStr = module.replace("module-", "");
  const moduleNumber = parseInt(moduleNumberStr, 10);
  if (isNaN(moduleNumber)) redirect(`/dashboard/curriculum/${phase}`);

  // ── Fetch data — wrapped in try/catch so a missing table shows a placeholder ──
  let allModules: any[] = [];
  let currentModule: any = null;
  let completedModules = new Set<number>();
  let dbError = false;

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
      // Table doesn't exist yet — migration hasn't been run
      dbError = true;
    } else {
      allModules = modulesRes.data ?? [];
      currentModule = currentRes.data ?? null;
      completedModules = new Set(
        (progressRes.data ?? []).filter((r) => r.completed).map((r) => r.module)
      );
    }
  } catch {
    dbError = true;
  }

  // ── Module not yet seeded or DB not migrated ──
  if (dbError || !currentModule) {
    return (
      <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-text-tertiary mb-10">
          <Link href="/dashboard/curriculum" className="hover:text-white transition-colors">
            Curriculum
          </Link>
          <ChevronRight className="w-3 h-3 mx-0.5 opacity-50" />
          <Link href={`/dashboard/curriculum/${phase}`} className="hover:text-white transition-colors">
            {phaseConfig.name}
          </Link>
          <ChevronRight className="w-3 h-3 mx-0.5 opacity-50" />
          <span className="text-accent">Module {moduleNumber}</span>
        </div>

        <div className="border border-[#222] border-dashed rounded-xl p-16 text-center">
          <div className="w-14 h-14 rounded-full bg-[#1A1A1A] border border-[#333] flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-6 h-6 text-accent" />
          </div>
          <h2 className="text-2xl font-bold font-syne text-white mb-3">
            {phaseConfig.modules_list[moduleNumber - 1] ?? `Module ${moduleNumber}`}
          </h2>
          <p className="text-text-secondary text-sm max-w-md mx-auto mb-8">
            This module is currently being developed. Full written content will be available shortly.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href={`/dashboard/curriculum/${phase}`}
              className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-[#222] border border-[#333] text-white text-xs font-bold uppercase tracking-widest rounded transition-colors"
            >
              ← Back to Phase
            </Link>
            {moduleNumber < phaseConfig.modules_count && (
              <Link
                href={`/dashboard/curriculum/${phase}/module-${moduleNumber + 1}`}
                className="px-5 py-2.5 bg-accent hover:bg-[#b5e02b] text-black text-xs font-bold uppercase tracking-widest rounded transition-colors"
              >
                Next Module →
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Full module view ──
  const moduleList = allModules;
  const nextModule = moduleList.find((m) => m.module_number === moduleNumber + 1);
  const prevModule = moduleList.find((m) => m.module_number === moduleNumber - 1);
  const nextModuleUrl = nextModule
    ? `/dashboard/curriculum/${phase}/module-${nextModule.module_number}`
    : null;

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-24 animate-in fade-in duration-700">

      {/* Left Sidebar: Navigation */}
      <aside className="w-full lg:w-72 shrink-0 order-2 lg:order-1 mt-12 lg:mt-0">
        <div className="sticky top-24 bg-[#111] border border-[#222] rounded-xl p-5">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-text-secondary mb-4 pb-4 border-b border-[#222]">
            Phase {phaseConfig.number} Modules
          </h3>
          <div className="space-y-1">
            {moduleList.map((mod) => {
              const isCompleted = completedModules.has(mod.module_number);
              const isActive = mod.module_number === moduleNumber;
              return (
                <Link
                  key={mod.module_number}
                  href={`/dashboard/curriculum/${phase}/module-${mod.module_number}`}
                  className={`flex items-start gap-3 p-2.5 rounded-lg transition-colors ${
                    isActive
                      ? "bg-accent/10 border border-accent/20"
                      : "hover:bg-[#1A1A1A] border border-transparent"
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className={`w-4 h-4 ${isActive ? "text-accent" : "text-[#16a34a]"}`} />
                    ) : (
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center text-[8px] font-bold ${
                          isActive ? "border-accent text-accent" : "border-[#444] text-[#666]"
                        }`}
                      >
                        {mod.module_number}
                      </div>
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium leading-tight ${
                      isActive ? "text-white" : isCompleted ? "text-text-secondary" : "text-[#888]"
                    }`}
                  >
                    {mod.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 order-1 lg:order-2 max-w-4xl">

        {/* Breadcrumb & Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-text-tertiary flex-wrap">
            <Link href="/dashboard/curriculum" className="hover:text-white transition-colors">
              Curriculum
            </Link>
            <ChevronRight className="w-3 h-3 mx-0.5 opacity-50" />
            <Link href={`/dashboard/curriculum/${phase}`} className="hover:text-white transition-colors">
              Phase {phaseConfig.number}
            </Link>
            <ChevronRight className="w-3 h-3 mx-0.5 opacity-50" />
            <span className="text-accent truncate max-w-[200px]">Module {moduleNumber}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono text-text-secondary bg-[#111] px-3 py-1.5 rounded-full border border-[#222]">
            <Clock className="w-3.5 h-3.5 text-accent" />
            {currentModule.estimated_minutes}m
          </div>
        </div>

        <article className="prose prose-invert prose-lg max-w-none prose-headings:font-syne prose-headings:font-bold prose-h2:text-white prose-p:text-text-secondary prose-a:text-accent">
          <h1 className="text-4xl md:text-5xl font-bold font-syne text-white tracking-tight mb-4 leading-tight">
            {currentModule.title}
          </h1>

          {currentModule.subtitle && (
            <p className="text-xl text-text-secondary mb-12 border-l-2 border-accent pl-6 py-1 italic">
              {currentModule.subtitle}
            </p>
          )}

          {currentModule.video_url && (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[#222] mb-12 bg-black flex items-center justify-center group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center">
                <PlayCircle className="w-20 h-20 text-white/80 group-hover:text-accent transition-all duration-300 group-hover:scale-110" />
              </div>
              <img
                src={`https://img.youtube.com/vi/${currentModule.video_url.split("v=")[1]}/maxresdefault.jpg`}
                alt="Video thumbnail"
                className="w-full h-full object-cover opacity-60"
              />
            </div>
          )}

          <div
            className="mt-8"
            dangerouslySetInnerHTML={{ __html: currentModule.content_html || "" }}
          />
        </article>

        {/* Quiz Section */}
        {currentModule.quiz && currentModule.quiz.length > 0 && (
          <CurriculumQuiz
            phaseSlug={phaseConfig.slug}
            moduleNumber={moduleNumber}
            questions={currentModule.quiz}
            nextModuleUrl={nextModuleUrl}
          />
        )}

        {/* Navigation Footer */}
        <div className="mt-16 pt-8 border-t border-[#222] flex flex-col md:flex-row items-center justify-between gap-4">
          {prevModule ? (
            <Link
              href={`/dashboard/curriculum/${phase}/module-${prevModule.module_number}`}
              className="flex items-center gap-2 px-6 py-3 bg-[#111] hover:bg-[#1A1A1A] border border-[#222] text-white text-xs font-bold uppercase tracking-widest transition-colors rounded-lg w-full md:w-auto justify-center"
            >
              <ChevronLeft className="w-4 h-4" /> Previous Module
            </Link>
          ) : (
            <div />
          )}

          {(!currentModule.quiz || currentModule.quiz.length === 0) && (
            <div className="text-center md:text-right w-full md:w-auto">
              <p className="text-xs text-text-tertiary mb-2">No quiz required for this module.</p>
              <Link
                href={nextModuleUrl || `/dashboard/curriculum/${phase}`}
                className="flex items-center gap-2 px-8 py-3 bg-accent hover:bg-[#b5e02b] text-black text-xs font-bold uppercase tracking-widest transition-colors rounded-lg w-full md:w-auto justify-center"
              >
                Mark Complete & Next <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Right Sidebar: Key Takeaways (Desktop only) */}
      <aside className="hidden xl:block w-72 shrink-0 order-3">
        <div className="sticky top-24 space-y-6">
          {currentModule.key_takeaways && currentModule.key_takeaways.length > 0 && (
            <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
              <div className="bg-[#1A1A1A] p-4 border-b border-[#222] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-accent" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-white">
                  Key Takeaways
                </h3>
              </div>
              <div className="p-5">
                <ul className="space-y-4">
                  {currentModule.key_takeaways.map((takeaway: string, idx: number) => (
                    <li key={idx} className="flex gap-3 text-sm text-text-secondary leading-relaxed">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 shrink-0" />
                      {takeaway}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
