import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { checkCourseAccess } from "@/lib/course-access";
import SurvivalKitDashboardClient from "./SurvivalKitDashboardClient";

const COURSE_SLUG = "prop-firm-survival-kit";

async function getCourseData(supabase: any) {
  const { data: course } = await supabase
    .from("courses")
    .select(`
      id, title, subtitle, description, slug,
      course_modules (
        id, title, subtitle, sort_order, slug,
        course_lessons ( id, title, slug, sort_order )
      )
    `)
    .eq("slug", COURSE_SLUG)
    .single();
  return course;
}

export default async function PropFirmSurvivalKitDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/dashboard/courses/${COURSE_SLUG}`);
  }

  const access = await checkCourseAccess(supabase, user.id, COURSE_SLUG);
  if (!access.hasAccess) {
    redirect(`/courses/${COURSE_SLUG}?locked=true`);
  }

  const course = await getCourseData(supabase);
  if (!course) {
    redirect("/dashboard");
  }

  // Fetch progress
  const { data: progress } = await supabase
    .from("course_progress")
    .select("lesson_id")
    .eq("user_id", user.id)
    .eq("course_id", course.id);

  const completedLessonIds: string[] = progress?.map((p: any) => p.lesson_id) || [];
  const completedCount = completedLessonIds.length;

  // Fetch quiz attempts
  const { data: quizAttempts } = await supabase
    .from("course_quiz_attempts")
    .select("module_id, score, total_questions, passed")
    .eq("user_id", user.id)
    .eq("course_id", course.id)
    .eq("passed", true);

  const passedModuleIds = quizAttempts?.map((a: any) => a.module_id) || [];

  // Sort modules + lessons
  const modules = [...(course.course_modules ?? [])]
    .sort((a: any, b: any) => a.sort_order - b.sort_order)
    .map((mod: any) => {
      const lessons = [...(mod.course_lessons ?? [])]
        .sort((a: any, b: any) => a.sort_order - b.sort_order)
        .map((l: any) => ({
          id: l.id,
          slug: l.slug,
          title: l.title,
          sort_order: l.sort_order,
        }));

      const modCompletedCount = lessons.filter(l => completedLessonIds.includes(l.id)).length;

      return {
        id: mod.id,
        title: mod.title,
        subtitle: mod.subtitle,
        sort_order: mod.sort_order,
        slug: mod.slug,
        lessons,
        completedCount: modCompletedCount,
      };
    });

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);

  return (
    <SurvivalKitDashboardClient
      courseId={course.id}
      courseSlug={course.slug}
      courseTitle={course.title}
      courseSubtitle={course.subtitle}
      courseDescription={course.description || ""}
      modules={modules}
      passedModuleIds={passedModuleIds}
      completedLessonIds={completedLessonIds}
      totalLessons={totalLessons}
      completedCount={completedCount}
      accessVia={access.via}
    />
  );
}
