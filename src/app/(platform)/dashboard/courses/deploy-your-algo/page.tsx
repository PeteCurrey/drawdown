import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { checkCourseAccess } from "@/lib/course-access";
import { CourseSidebar } from "@/components/courses/CourseSidebar";
import { ArrowRight, BookOpen } from "lucide-react";

const COURSE_SLUG = "deploy-your-algo";

async function getCourseData(supabase: any) {
  const { data: course } = await supabase
    .from("courses")
    .select(`
      id, slug, title, subtitle,
      course_modules (
        id, title, subtitle, sort_order,
        course_lessons ( id, slug, title, estimated_minutes, sort_order, is_preview )
      )
    `)
    .eq("slug", COURSE_SLUG)
    .single();
  return course;
}

export default async function CourseHomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard/courses/deploy-your-algo");

  const access = await checkCourseAccess(supabase, user.id, COURSE_SLUG);
  if (!access.hasAccess) redirect("/courses/deploy-your-algo?locked=true");

  const course = await getCourseData(supabase);
  if (!course) redirect("/dashboard");

  // Sort modules + lessons
  const modules = [...(course.course_modules ?? [])].sort((a: any, b: any) => a.sort_order - b.sort_order)
    .map((m: any) => ({ ...m, course_lessons: [...(m.course_lessons ?? [])].sort((a: any, b: any) => a.sort_order - b.sort_order) }));

  const allLessons = modules.flatMap((m: any) => m.course_lessons);
  const totalLessons = allLessons.length;

  // Fetch progress
  const { data: progress } = await supabase
    .from("course_progress")
    .select("lesson_id")
    .eq("user_id", user.id)
    .eq("course_id", course.id);
  const completedIds: string[] = (progress ?? []).map((r: any) => r.lesson_id);
  const completedCount = completedIds.length;

  const firstLesson = allLessons[0];

  return (
    <div className="flex h-full min-h-screen bg-background-primary">
      {/* ── Sidebar ────────────────────────────────────────────── */}
      <div className="w-72 shrink-0 border-r border-border-slate/40 p-6 flex flex-col h-full sticky top-0 overflow-y-auto bg-background-surface/50">
        <CourseSidebar
          courseSlug={COURSE_SLUG}
          modules={modules}
          initialCompleted={completedIds}
          totalLessons={totalLessons}
          accessVia={access.via}
        />
      </div>

      {/* ── Main content ───────────────────────────────────────── */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-10">

          {/* Welcome card */}
          <div className="space-y-4">
            <p className="text-[10px] font-mono text-[#C8F135] uppercase tracking-widest">
              Mini Course // Algo Deployment
            </p>
            <h1 className="font-display text-4xl font-black uppercase text-text-primary leading-tight">
              Welcome to Deploy Your Algo
            </h1>
            <p className="text-text-secondary text-lg leading-relaxed">
              Start with Module 1 — it takes 15 minutes and gets your first Pine Script live on TradingView.
            </p>
          </div>

          {/* Progress summary */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Modules", value: `${Math.min(completedCount > 0 ? modules.filter((m: any) => m.course_lessons.every((l: any) => completedIds.includes(l.id))).length : 0, modules.length)}/5`, sub: "complete" },
              { label: "Lessons", value: `${completedCount}/${totalLessons}`, sub: "done" },
              { label: "Time Est.", value: "~100", sub: "minutes total" },
            ].map(s => (
              <div key={s.label} className="bg-background-surface border border-border-slate/40 rounded-xl p-5 text-center">
                <p className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary mb-1">{s.label}</p>
                <p className="text-3xl font-black font-mono text-text-primary">{s.value}</p>
                <p className="text-[10px] text-text-tertiary mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Access pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#C8F135]/30 bg-[#C8F135]/5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8F135]" />
            <span className="text-[10px] font-mono text-[#C8F135] uppercase tracking-widest">
              Access via: {access.via === "floor_tier" ? "Floor Tier (Included Free)" : "Course Purchase"}
            </span>
          </div>

          {/* Module overview */}
          <div className="space-y-3">
            <h2 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Course Modules</h2>
            <div className="space-y-2">
              {modules.map((mod: any, i: number) => {
                const modDone = mod.course_lessons.filter((l: any) => completedIds.includes(l.id)).length;
                const firstModLesson = mod.course_lessons[0];
                const pct = mod.course_lessons.length > 0 ? Math.round((modDone / mod.course_lessons.length) * 100) : 0;
                return (
                  <Link
                    key={mod.id}
                    href={firstModLesson ? `/dashboard/courses/${COURSE_SLUG}/${firstModLesson.slug}` : "#"}
                    className="flex items-center gap-4 p-4 bg-background-surface border border-border-slate/40 rounded-xl hover:border-[#C8F135]/40 transition-all group"
                  >
                    <span className="text-[11px] font-black font-mono text-[#C8F135] w-8 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-text-primary group-hover:text-[#C8F135] transition-colors truncate">{mod.subtitle}</p>
                      <p className="text-[10px] text-text-tertiary mt-0.5">{mod.course_lessons.length} lessons · {mod.course_lessons.reduce((s: number, l: any) => s + (l.estimated_minutes ?? 0), 0)} min</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="w-20 h-1 bg-border-slate/40 rounded-full overflow-hidden">
                        <div className="h-full bg-[#C8F135] rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[9px] font-mono text-text-tertiary w-8 text-right">{modDone}/{mod.course_lessons.length}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-text-tertiary group-hover:text-[#C8F135] transition-colors" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Start CTA */}
          {firstLesson && (
            <Link
              href={`/dashboard/courses/${COURSE_SLUG}/${firstLesson.slug}`}
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#C8F135] text-black font-bold rounded-xl hover:bg-[#b8e020] transition-colors text-sm"
            >
              <BookOpen className="w-4 h-4" />
              {completedCount > 0 ? "Continue Course" : "Start Module 1"} →
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
