import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ChevronLeft, Lock, Play, CheckCircle2, Clock } from "lucide-react";
import { phases } from "@/data/courses";

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

export default async function PhaseOverviewPage({ params }: { params: { phase: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .single();

  const phaseConfig = phases.find(p => p.slug === params.phase);
  
  if (!phaseConfig) {
    redirect("/dashboard/curriculum");
  }

  const tier = (profile as any)?.subscription_tier as string | undefined;
  const userWeight = TIER_WEIGHT[tier ?? "free"] ?? 0;
  const minWeight = PHASE_MIN_WEIGHT[phaseConfig.slug] ?? 0;
  
  if (userWeight < minWeight) {
    redirect("/dashboard/curriculum");
  }

  const { data: modules } = await supabase
    .from("curriculum_modules")
    .select("module_number, title, subtitle, estimated_minutes, is_published")
    .eq("phase_slug", phaseConfig.slug)
    .order("module_number", { ascending: true });

  const { data: progressRows } = await supabase
    .from("course_progress")
    .select("module, completed")
    .eq("user_id", user.id)
    .eq("phase", phaseConfig.id);

  const completedModules = new Set(
    (progressRows || []).filter(r => r.completed).map(r => r.module)
  );

  const moduleList = modules || [];
  const totalCompleted = completedModules.size;
  const totalModules = phaseConfig.modules_count;
  const pct = totalModules > 0 ? Math.round((totalCompleted / totalModules) * 100) : 0;
  
  let firstIncomplete = 1;
  for (let m = 1; m <= totalModules; m++) {
    if (!completedModules.has(m)) {
      firstIncomplete = m;
      break;
    }
  }
  
  if (totalCompleted >= totalModules) {
    firstIncomplete = 1;
  }

  return (
    <div className="max-w-5xl space-y-8 animate-in fade-in duration-500 pb-24">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-text-tertiary">
        <Link href="/dashboard/curriculum" className="hover:text-white transition-colors">
          Curriculum
        </Link>
        <ChevronLeft className="w-3 h-3 mx-1 opacity-50" />
        <span className="text-accent">{phaseConfig.name}</span>
      </div>

      <header className="border-b border-[#222] pb-8 relative">
        <div className="flex items-start justify-between gap-6">
          <div>
            <span className="text-xl font-bold font-mono text-[#555] mb-2 block">{phaseConfig.number}</span>
            <h1 className="text-4xl md:text-5xl font-bold font-syne text-white tracking-tight">{phaseConfig.name}</h1>
            <p className="text-lg text-text-secondary mt-4 max-w-2xl">{phaseConfig.full_description}</p>
          </div>
          
          <div className="hidden md:flex flex-col items-end gap-2 shrink-0">
            <span className="px-3 py-1 bg-[#1A1A1A] text-text-secondary font-mono text-xs uppercase tracking-widest border border-[#333] rounded">
              {phaseConfig.duration}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 bg-[#111] border border-[#222] rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="w-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase tracking-widest text-text-tertiary">Phase Progress</span>
              <span className="text-xs font-bold text-white">{pct}% ({totalCompleted}/{totalModules})</span>
            </div>
            <div className="h-1.5 w-full bg-[#222] rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-1000"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
          
          <Link
            href={`/dashboard/curriculum/${phaseConfig.slug}/module-${firstIncomplete}`}
            className="px-6 py-3 bg-accent hover:bg-[#b5e02b] text-black text-xs font-bold uppercase tracking-widest transition-all rounded whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            {totalCompleted >= totalModules ? (
              <>Review Phase <ChevronLeft className="w-4 h-4 rotate-180" /></>
            ) : (
              <><Play className="w-4 h-4 fill-black" /> Continue Phase</>
            )}
          </Link>
        </div>
      </header>

      <div className="space-y-4">
        <h2 className="text-sm font-bold font-mono uppercase tracking-widest text-text-secondary mb-6">Modules in this Phase</h2>
        
        {moduleList.length === 0 ? (
          <div className="bg-[#111] border border-[#222] rounded-xl p-12 text-center text-text-secondary border-dashed">
            Modules are currently being developed for this phase. Check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {moduleList.map((mod) => {
              const isCompleted = completedModules.has(mod.module_number);
              
              return (
                <Link
                  key={mod.module_number}
                  href={`/dashboard/curriculum/${phaseConfig.slug}/module-${mod.module_number}`}
                  className={`flex flex-col md:flex-row md:items-center justify-between p-5 rounded-xl border transition-all duration-200 group ${
                    isCompleted 
                      ? "bg-[#111] border-[#222] hover:border-[#444]" 
                      : "bg-[#1A1A1A] border-[#333] hover:border-accent"
                  }`}
                >
                  <div className="flex items-start md:items-center gap-5">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 ${
                      isCompleted ? "bg-[#16a34a]/10 text-[#16a34a]" : "bg-[#222] text-text-secondary"
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <span className="font-mono font-bold text-xs">{mod.module_number}</span>}
                    </div>
                    
                    <div>
                      <h3 className={`text-base font-bold ${isCompleted ? 'text-text-secondary' : 'text-white'}`}>
                        {mod.title}
                      </h3>
                      {mod.subtitle && (
                        <p className="text-xs text-text-tertiary mt-1">{mod.subtitle}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex items-center gap-4 ml-14 md:ml-0">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-text-tertiary">
                      <Clock className="w-3.5 h-3.5" />
                      {mod.estimated_minutes} min
                    </div>
                    {!isCompleted && (
                      <span className="hidden md:inline-flex px-3 py-1 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded transition-opacity opacity-0 group-hover:opacity-100">
                        Start
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
