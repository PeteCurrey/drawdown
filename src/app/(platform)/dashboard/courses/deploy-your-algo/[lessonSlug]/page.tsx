import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { checkCourseAccess } from "@/lib/course-access";
import { CourseSidebar } from "@/components/courses/CourseSidebar";
import { MarkCompleteButton } from "@/components/courses/MarkCompleteButton";
import { LessonContent } from "@/components/courses/LessonContent";

const COURSE_SLUG = "deploy-your-algo";

async function getCourseData(supabase: any) {
  const { data: course } = await supabase
    .from("courses")
    .select(`
      id, slug, title,
      course_modules (
        id, title, subtitle, sort_order,
        course_lessons ( id, slug, title, estimated_minutes, sort_order, content_mdx, is_preview )
      )
    `)
    .eq("slug", COURSE_SLUG)
    .single();
  return course;
}

interface PageProps {
  params: Promise<{ lessonSlug: string }>;
}

export default async function LessonPage({ params }: PageProps) {
  const { lessonSlug } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/dashboard/courses/${COURSE_SLUG}/${lessonSlug}`);

  const access = await checkCourseAccess(supabase, user.id, COURSE_SLUG);

  const course = await getCourseData(supabase);
  if (!course) redirect("/dashboard");

  // Sort modules + lessons
  const modules = [...(course.course_modules ?? [])]
    .sort((a: any, b: any) => a.sort_order - b.sort_order)
    .map((m: any) => ({
      ...m,
      course_lessons: [...(m.course_lessons ?? [])].sort((a: any, b: any) => a.sort_order - b.sort_order),
    }));

  const allLessons = modules.flatMap((m: any) => m.course_lessons);
  const totalLessons = allLessons.length;

  // Find current lesson
  const currentIndex = allLessons.findIndex((l: any) => l.slug === lessonSlug);
  if (currentIndex === -1) notFound();

  const lesson       = allLessons[currentIndex];
  const prevLesson   = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson   = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  // Find parent module
  const parentModule = modules.find((m: any) =>
    m.course_lessons.some((l: any) => l.id === lesson.id)
  );

  // Gate: preview lessons are open, others require access
  if (!lesson.is_preview && !access.hasAccess) {
    redirect(`/courses/${COURSE_SLUG}?locked=true`);
  }

  // Fetch progress
  const { data: progress } = await supabase
    .from("course_progress")
    .select("lesson_id")
    .eq("user_id", user.id)
    .eq("course_id", course.id);
  const completedIds: string[] = (progress ?? []).map((r: any) => r.lesson_id);
  const isCompleted = completedIds.includes(lesson.id);

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

      {/* ── Lesson content ─────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto pb-24">
          <div className="max-w-[720px] mx-auto px-8 py-10 space-y-8">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
              <span>Deploy Your Algo</span>
              <span>/</span>
              <span>{parentModule?.subtitle}</span>
              <span>/</span>
              <span className="text-[#C8F135]">{lesson.title}</span>
            </nav>

            {/* Lesson header */}
            <div className="space-y-3">
              <p className="text-[10px] font-mono text-[#C8F135] uppercase tracking-widest">
                {parentModule?.title} // {parentModule?.subtitle}
              </p>
              <h1 className="font-display text-3xl md:text-4xl font-black uppercase text-text-primary leading-tight">
                {lesson.title}
              </h1>
              <div className="flex items-center gap-4 text-[11px] font-mono text-text-tertiary">
                <span>{lesson.estimated_minutes} min read</span>
                <span>·</span>
                <span>{parentModule?.title} of 5</span>
                {lesson.is_preview && (
                  <>
                    <span>·</span>
                    <span className="text-[#C8F135]">Free Preview</span>
                  </>
                )}
              </div>
            </div>

            {/* Content */}
            <LessonContent mdx={lesson.content_mdx ?? ""} />

          </div>
        </div>

        {/* Sticky bottom bar */}
        <div className="sticky bottom-0 bg-background-primary/95 backdrop-blur-md border-t border-border-slate/40 px-8 py-4">
          <div className="max-w-[720px] mx-auto">
            <MarkCompleteButton
              lessonId={lesson.id}
              courseId={course.id}
              courseSlug={COURSE_SLUG}
              prevSlug={prevLesson?.slug ?? null}
              nextSlug={nextLesson?.slug ?? null}
              isCompleted={isCompleted}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
