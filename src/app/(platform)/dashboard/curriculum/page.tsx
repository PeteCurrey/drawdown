import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Lock, CheckCircle2, ChevronRight, Play } from "lucide-react";
import { DotProgressBar } from "@/components/dashboard/DotProgressBar";
import { phases } from "@/data/courses";

// ─── Tier access ──────────────────────────────────────────────────────────────
const TIER_WEIGHT: Record<string, number> = {
  free:       0,
  foundation: 1,
  edge:       2,
  floor:      3,
};

// Maps phase slug → integer (matching the course_progress DB schema)
const PHASE_NUM: Record<string, number> = {
  "ground-zero":      1,
  "chart-reader":     2,
  "strategist":       3,
  "risk-manager":     4,
  "mind-over-market": 5,
  "ai-integration":   6,
};

// Minimum tier weight to access each phase
const PHASE_MIN_WEIGHT: Record<string, number> = {
  "ground-zero":      0,
  "chart-reader":     1,
  "strategist":       1,
  "risk-manager":     1,
  "mind-over-market": 2,
  "ai-integration":   2,
};

// Total modules per phase (from courses.ts)
const PHASE_MODULE_COUNTS: Record<string, number> = {
  "ground-zero":      8,
  "chart-reader":     12,
  "strategist":       10,
  "risk-manager":     6,
  "mind-over-market": 8,
  "ai-integration":   10,
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CurriculumPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .single();

  const tier = (profile as any)?.subscription_tier as string | undefined;
  const userWeight = TIER_WEIGHT[tier ?? "free"] ?? 0;
  const tierLabel = tier ? tier.charAt(0).toUpperCase() + tier.slice(1) : "Free";

  // ── Fetch ALL progress for this user in one query ──────────────────────────
  const { data: progressRows } = await supabase
    .from("course_progress")
    .select("phase, module, completed")
    .eq("user_id", user.id);

  const allProgress: { phase: number; module: number; completed: boolean }[] =
    (progressRows as any[]) ?? [];

  // ── Build per-phase progress map ───────────────────────────────────────────
  // completedByPhase[phaseNum] = Set of completed module numbers
  const completedByPhase: Record<number, Set<number>> = {};
  allProgress.forEach(row => {
    if (row.completed) {
      if (!completedByPhase[row.phase]) completedByPhase[row.phase] = new Set();
      completedByPhase[row.phase].add(row.module);
    }
  });

  // ── Compute overall progress (all modules across all phases) ───────────────
  const totalModules = Object.values(PHASE_MODULE_COUNTS).reduce((a, b) => a + b, 0);
  let totalCompleted = 0;
  Object.values(completedByPhase).forEach(set => { totalCompleted += set.size; });
  const overallPct = totalModules > 0 ? Math.round((totalCompleted / totalModules) * 100) : 0;

  // ── Build phase data with real progress ────────────────────────────────────
  const curriculumPhases = phases.map(phase => {
    const phaseNum = PHASE_NUM[phase.slug] ?? 0;
    const moduleCount = PHASE_MODULE_COUNTS[phase.slug] ?? phase.modules_count;
    const minWeight = PHASE_MIN_WEIGHT[phase.slug] ?? 0;
    const isAccessible = userWeight >= minWeight;
    const completedSet = completedByPhase[phaseNum] ?? new Set<number>();
    const completedCount = completedSet.size;
    const pct = moduleCount > 0 ? Math.round((completedCount / moduleCount) * 100) : 0;
    const isCompleted = completedCount >= moduleCount;

    // Find the first incomplete module (1-indexed)
    let firstIncompleteModule = 1;
    for (let m = 1; m <= moduleCount; m++) {
      if (!completedSet.has(m)) { firstIncompleteModule = m; break; }
    }
    // If all completed, link to module 1 for review
    if (isCompleted) firstIncompleteModule = 1;

    const continueRoute = `/dashboard/curriculum/${phase.slug}/module-${firstIncompleteModule}`;
    const reviewRoute = `/dashboard/curriculum/${phase.slug}`;

    return {
      ...phase,
      phaseNum,
      moduleCount,
      minWeight,
      isAccessible,
      completedCount,
      pct,
      isCompleted,
      firstIncompleteModule,
      continueRoute,
      reviewRoute,
    };
  });

  // ── Active phase: first IN_PROGRESS or first accessible incomplete ─────────
  const activePhase = curriculumPhases.find(p => p.isAccessible && !p.isCompleted && p.completedCount > 0)
    ?? curriculumPhases.find(p => p.isAccessible && !p.isCompleted)
    ?? curriculumPhases[0];

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">
      <header className="border-b border-[#EDEDED] pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">Curriculum</h1>
        <p className="text-sm text-[#555550] mt-2 max-w-xl">
          Phase-based trading education built in the order you actually need it.
        </p>
      </header>

      {/* ── FIX 1: Progress banner — white background ─────────────────────── */}
      <section
        className="bg-white border border-[#e5e7eb] rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[#6b7280] uppercase tracking-widest">
              Active Tier
            </span>
            <span className="px-2 py-0.5 bg-[#F9771D] text-white font-bold text-[9px] rounded-[3px]">
              {tierLabel.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-[#111827] font-medium">
            {totalCompleted} of {totalModules} modules complete
          </p>
        </div>

        <div className="w-full md:w-96 flex flex-col gap-1.5 shrink-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono text-[#6b7280] uppercase tracking-widest">
              Curriculum Progress
            </span>
            <span className="text-[12px] font-bold text-[#111827]">{overallPct}%</span>
          </div>
          {/* Progress bar — white-friendly track */}
          <div className="h-1.5 w-full rounded-full" style={{ background: "#e5e7eb" }}>
            <div
              className="h-full rounded-full bg-[#F9771D] transition-all"
              style={{ width: `${overallPct}%` }}
            />
          </div>
        </div>

        {/* FIX 2: Banner continue button — wired to first incomplete module */}
        <Link
          href={activePhase.continueRoute}
          className="px-6 py-3 bg-[#F9771D] hover:bg-[#e0600d] text-white text-xs font-bold uppercase tracking-widest transition-all rounded-[4px] shrink-0 whitespace-nowrap"
        >
          Continue → {activePhase.name}
        </Link>
      </section>

      {/* ── Phase Cards Grid ──────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {curriculumPhases.map((phase) => {
          const isLocked = !phase.isAccessible;

          return (
            <div
              key={phase.slug}
              className="bg-white border border-[#e5e7eb] rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] flex flex-col justify-between min-h-[260px] relative transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)] hover:-translate-y-0.5 duration-200"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xl font-bold font-mono text-[#9ca3af]">{phase.number}</span>
                  <span
                    className={`px-2 py-0.5 text-[8px] font-mono font-bold rounded-[3px] ${
                      phase.tier === "Free"
                        ? "border border-[#16a34a] text-[#16a34a]"
                        : phase.tier === "Edge"
                        ? "bg-[#7c3aed] text-white"
                        : "bg-[#F9771D] text-white"
                    }`}
                  >
                    {phase.tier.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#1A1A1A] mb-2">{phase.name}</h3>
                <p className="text-xs text-[#555550] leading-relaxed mb-4">{phase.description}</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-mono text-[#6b7280]">
                  <span>{phase.modules_count} Modules · {phase.duration}</span>
                  <span className="font-bold" style={{ color: isLocked ? "#9ca3af" : "#111827" }}>
                    {phase.pct}%
                  </span>
                </div>

                {/* Progress bar — white-friendly track */}
                <div className="h-1.5 w-full rounded-full" style={{ background: "#e5e7eb" }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${phase.pct}%`,
                      background: isLocked ? "#d1d5db" : "#F9771D",
                    }}
                  />
                </div>

                {/* CTA Button — FIX 2 */}
                {isLocked ? (
                  // Truly locked (wrong tier)
                  <Link
                    href="/dashboard/billing"
                    className="w-full py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-[4px] transition-colors flex items-center justify-center gap-1.5 border"
                    style={{ borderColor: "#F9771D", color: "#F9771D", background: "transparent" }}
                  >
                    Unlock with {phase.tier} →
                  </Link>
                ) : phase.isCompleted ? (
                  // Completed — link to phase for review
                  <Link
                    href={phase.reviewRoute}
                    className="w-full py-2.5 bg-[#111827] hover:bg-[#1f2937] text-white text-[10px] font-bold uppercase tracking-widest rounded-[4px] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Completed ✓
                  </Link>
                ) : phase.completedCount > 0 ? (
                  // In progress — continue to first incomplete module
                  <Link
                    href={phase.continueRoute}
                    className="w-full py-2.5 bg-[#F9771D] hover:bg-[#e0600d] text-white text-[10px] font-bold uppercase tracking-widest rounded-[4px] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    Continue — Module {phase.firstIncompleteModule} →
                  </Link>
                ) : (
                  // Accessible but not started
                  <Link
                    href={phase.continueRoute}
                    className="w-full py-2.5 bg-[#F9771D] hover:bg-[#e0600d] text-white text-[10px] font-bold uppercase tracking-widest rounded-[4px] transition-colors flex items-center justify-center gap-1.5"
                  >
                    Start Phase {phase.number} →
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
