import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { checkCourseAccess } from "@/lib/course-access";
import ModulePageClient from "./ModulePageClient";

const COURSE_SLUG = "prop-firm-survival-kit";

async function getModuleData(supabase: any, moduleSlug: string) {
  const { data: course } = await supabase
    .from("courses")
    .select(`
      id, slug,
      course_modules (
        id, title, subtitle, sort_order, slug,
        course_lessons ( id, title, slug, estimated_minutes, sort_order )
      )
    `)
    .eq("slug", COURSE_SLUG)
    .single();

  if (!course) return null;

  const currentMod = course.course_modules?.find((m: any) => m.slug === moduleSlug);
  return {
    courseId: course.id,
    courseSlug: course.slug,
    module: currentMod,
    allModules: course.course_modules || [],
  };
}

interface PageProps {
  params: Promise<{
    moduleSlug: string;
  }>;
}

export default async function ModuleDetailPage({ params }: PageProps) {
  const { moduleSlug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/dashboard/courses/${COURSE_SLUG}/modules/${moduleSlug}`);
  }

  const access = await checkCourseAccess(supabase, user.id, COURSE_SLUG);
  if (!access.hasAccess) {
    redirect(`/courses/${COURSE_SLUG}?locked=true`);
  }

  const data = await getModuleData(supabase, moduleSlug);
  if (!data || !data.module) {
    redirect(`/dashboard/courses/${COURSE_SLUG}`);
  }

  const { courseId, courseSlug, module: currentModule, allModules } = data;

  // Verify previous module quiz was passed
  const sortedAllModules = [...allModules].sort((a: any, b: any) => a.sort_order - b.sort_order);
  const currentModIndex = sortedAllModules.findIndex((m: any) => m.id === currentModule.id);

  // Fetch quiz attempts
  const { data: attempts } = await supabase
    .from("course_quiz_attempts")
    .select("module_id, score, total_questions, passed")
    .eq("user_id", user.id)
    .eq("course_id", courseId);

  const passedModuleIds = attempts?.filter((a: any) => a.passed).map((a: any) => a.module_id) || [];

  if (currentModIndex > 0) {
    const prevModule = sortedAllModules[currentModIndex - 1];
    const prevPassed = passedModuleIds.includes(prevModule.id);
    if (!prevPassed) {
      redirect(`/dashboard/courses/${COURSE_SLUG}?locked-module=true`);
    }
  }

  // Fetch user progress for lesson completion
  const { data: progress } = await supabase
    .from("course_progress")
    .select("lesson_id")
    .eq("user_id", user.id)
    .eq("course_id", courseId);

  const completedLessonIds: string[] = progress?.map((p: any) => p.lesson_id) || [];

  // Map lessons
  const lessons = [...(currentModule.course_lessons || [])]
    .sort((a: any, b: any) => a.sort_order - b.sort_order)
    .map((l: any) => ({
      id: l.id,
      slug: l.slug,
      title: l.title,
      estimated_minutes: l.estimated_minutes || 4,
      sort_order: l.sort_order,
      completed: completedLessonIds.includes(l.id),
    }));

  const userAttempt = attempts?.find((a: any) => a.module_id === currentModule.id);

  // Calculate overall count
  const allLessons = sortedAllModules.flatMap((m: any) => m.course_lessons || []);
  const totalLessonsCount = allLessons.length;
  const completedLessonsCount = allLessons.filter((l: any) => completedLessonIds.includes(l.id)).length;
  const passedModulesCount = attempts?.filter((a: any) => a.passed).length || 0;

  const overallProgressString = `${completedLessonsCount}/${totalLessonsCount} · ${passedModulesCount}/6 MODULES`;

  return (
    <ModulePageClient
      moduleNumber={String(currentModule.sort_order).padStart(2, "0")}
      moduleSlug={moduleSlug}
      moduleTitle={currentModule.title}
      moduleSubtitle={currentModule.subtitle}
      courseSlug={courseSlug}
      courseId={courseId}
      lessons={lessons}
      quizPassed={userAttempt?.passed ?? false}
      quizAttempted={!!userAttempt}
      quizScore={userAttempt?.score ?? null}
      quizTotal={userAttempt?.total_questions ?? null}
      overallProgress={overallProgressString}
    />
  );
}
