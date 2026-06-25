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

export default async function ModulePage({ params }: { params: { phase: string, module: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login");
  }

  const phaseConfig = phases.find(p => p.slug === params.phase);
  if (!phaseConfig) redirect("/dashboard/curriculum");

  // Validate tier
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .single();

  const tier = (profile as any)?.subscription_tier as string | undefined;
  const userWeight = TIER_WEIGHT[tier ?? "free"] ?? 0;
  const minWeight = PHASE_MIN_WEIGHT[phaseConfig.slug] ?? 0;
  
  if (userWeight < minWeight) {
    redirect("/dashboard/curriculum");
  }

  // Parse module number
  const moduleNumberStr = params.module.replace('module-', '');
  const moduleNumber = parseInt(moduleNumberStr, 10);
  if (isNaN(moduleNumber)) redirect(\`/dashboard/curriculum/\${params.phase}\`);

  // Fetch all modules for sidebar
  const { data: allModules } = await supabase
    .from("curriculum_modules")
    .select("module_number, title, estimated_minutes, is_published")
    .eq("phase_slug", phaseConfig.slug)
    .order("module_number", { ascending: true });

  // Fetch current module content
  const { data: currentModule } = await supabase
    .from("curriculum_modules")
    .select("*")
    .eq("phase_slug", phaseConfig.slug)
    .eq("module_number", moduleNumber)
    .single();

  if (!currentModule) {
    // If we're seeding, the DB might not have the module yet, so just show a placeholder
    return (
      <div className="max-w-4xl mx-auto p-12 text-center text-text-secondary border border-[#222] rounded-xl border-dashed">
        Module {moduleNumber} is currently in development.
        <div className="mt-6">
          <Link href={\`/dashboard/curriculum/\${params.phase}\`} className="text-accent hover:underline">
            ← Back to Phase Overview
          </Link>
        </div>
      </div>
    );
  }

  // Fetch progress
  const { data: progressRows } = await supabase
    .from("course_progress")
    .select("module, completed")
    .eq("user_id", user.id)
    .eq("phase", phaseConfig.id);

  const completedModules = new Set(
    (progressRows || []).filter(r => r.completed).map(r => r.module)
  );

  const moduleList = allModules || [];
  const nextModule = moduleList.find(m => m.module_number === moduleNumber + 1);
  const prevModule = moduleList.find(m => m.module_number === moduleNumber - 1);
  const nextModuleUrl = nextModule ? \`/dashboard/curriculum/\${params.phase}/module-\${nextModule.module_number}\` : null;

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-24 animate-in fade-in duration-700">
      
      {/* Left Sidebar: Navigation */}
      <aside className="w-full lg:w-72 shrink-0 order-2 lg:order-1 mt-12 lg:mt-0">
        <div className="sticky top-24 bg-[#111] border border-[#222] rounded-xl p-5">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-text-secondary mb-4 pb-4 border-b border-[#222]">
            Phase {phaseConfig.number} Modules
          </h3>
          <div className="space-y-1">
            {moduleList.map(mod => {
              const isCompleted = completedModules.has(mod.module_number);
              const isActive = mod.module_number === moduleNumber;
              
              return (
                <Link
                  key={mod.module_number}
                  href={\`/dashboard/curriculum/\${params.phase}/module-\${mod.module_number}\`}
                  className={\`flex items-start gap-3 p-2.5 rounded-lg transition-colors \${
                    isActive 
                      ? "bg-accent/10 border border-accent/20" 
                      : "hover:bg-[#1A1A1A] border border-transparent"
                  }\`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className={\`w-4 h-4 \${isActive ? 'text-accent' : 'text-[#16a34a]'}\`} />
                    ) : (
                      <div className={\`w-4 h-4 rounded-full border flex items-center justify-center text-[8px] font-bold \${
                        isActive ? 'border-accent text-accent' : 'border-[#444] text-[#666]'
                      }\`}>
                        {mod.module_number}
                      </div>
                    )}
                  </div>
                  <span className={\`text-sm font-medium leading-tight \${
                    isActive ? "text-white" : isCompleted ? "text-text-secondary" : "text-[#888]"
                  }\`}>
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
            <Link href="/dashboard/curriculum" className="hover:text-white transition-colors">Curriculum</Link>
            <ChevronRight className="w-3 h-3 mx-0.5 opacity-50" />
            <Link href={\`/dashboard/curriculum/\${params.phase}\`} className="hover:text-white transition-colors">
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
              {/* In a real implementation, you'd use a real player. For now, a placeholder overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center">
                <PlayCircle className="w-20 h-20 text-white/80 group-hover:text-accent transition-all duration-300 group-hover:scale-110" />
              </div>
              <img src={\`https://img.youtube.com/vi/\${currentModule.video_url.split('v=')[1]}/maxresdefault.jpg\`} alt="Video thumbnail" className="w-full h-full object-cover opacity-60" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
          )}

          <div 
            className="mt-8 [&>h2]:text-2xl [&>h2]:mt-12 [&>h2]:mb-6 [&>h3]:text-xl [&>h3]:mt-8 [&>h3]:mb-4 [&>p]:mb-6 [&>ul]:mb-6 [&>ul]:space-y-2 [&>ul>li]:pl-2 [&>ul>li]:relative [&>ul>li]:before:content-[''] [&>ul>li]:before:absolute [&>ul>li]:before:left-[-15px] [&>ul>li]:before:top-[12px] [&>ul>li]:before:w-1.5 [&>ul>li]:before:h-1.5 [&>ul>li]:before:bg-accent [&>ul>li]:before:rounded-full" 
            dangerouslySetInnerHTML={{ __html: currentModule.content_html || '' }} 
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
              href={\`/dashboard/curriculum/\${params.phase}/module-\${prevModule.module_number}\`}
              className="flex items-center gap-2 px-6 py-3 bg-[#111] hover:bg-[#1A1A1A] border border-[#222] text-white text-xs font-bold uppercase tracking-widest transition-colors rounded-lg w-full md:w-auto justify-center"
            >
              <ChevronLeft className="w-4 h-4" /> Previous Module
            </Link>
          ) : <div />}
          
          {(!currentModule.quiz || currentModule.quiz.length === 0) && (
            <div className="text-center md:text-right w-full md:w-auto">
              {/* If no quiz, auto-mark complete button. The quiz handles it usually. */}
              <p className="text-xs text-text-tertiary mb-2">No quiz required for this module.</p>
              <Link 
                href={nextModuleUrl || \`/dashboard/curriculum/\${params.phase}\`}
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
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-white">Key Takeaways</h3>
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
