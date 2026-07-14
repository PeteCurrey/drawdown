import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { checkCourseAccess } from "@/lib/course-access";
import QuizClient from "./QuizClient";

const COURSE_SLUG = "prop-firm-survival-kit";

async function getQuizData(supabase: any, moduleSlug: string) {
  const { data: course } = await supabase
    .from("courses")
    .select(`
      id, slug,
      course_modules (
        id, title, subtitle, sort_order, slug,
        course_lessons ( id, title, slug, sort_order )
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

export default async function ModuleQuizPage({ params }: PageProps) {
  const { moduleSlug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/dashboard/courses/${COURSE_SLUG}/modules/${moduleSlug}/quiz`);
  }

  const access = await checkCourseAccess(supabase, user.id, COURSE_SLUG);
  if (!access.hasAccess) {
    redirect(`/courses/${COURSE_SLUG}?locked=true`);
  }

  const data = await getQuizData(supabase, moduleSlug);
  if (!data || !data.module) {
    redirect(`/dashboard/courses/${COURSE_SLUG}`);
  }

  const { courseId, courseSlug, module: currentModule, allModules } = data;

  // 1. Fetch lesson completion progress
  const { data: progress } = await supabase
    .from("course_progress")
    .select("lesson_id")
    .eq("user_id", user.id)
    .eq("course_id", courseId);

  const completedLessonIds: string[] = progress?.map((p: any) => p.lesson_id) || [];
  const moduleLessons = currentModule.course_lessons || [];

  const completedLessonsInMod = moduleLessons.filter((l: any) => completedLessonIds.includes(l.id));

  // If not all lessons are completed, redirect back to module overview
  if (completedLessonsInMod.length < moduleLessons.length) {
    redirect(`/dashboard/courses/${courseSlug}/modules/${moduleSlug}?lessons-incomplete=true`);
  }

  // 2. Fetch quiz questions
  const { data: questions } = await supabase
    .from("course_quiz_questions" as any)
    .select("id, question, options, explanation, correct_option_id, sort_order")
    .eq("module_id", currentModule.id);

  const sortedQuestions = [...(questions || [])].sort((a, b) => a.sort_order - b.sort_order);

  // 3. Fetch previous quiz attempts
  const { data: attempts } = await supabase
    .from("course_quiz_attempts")
    .select("module_id, score, passed")
    .eq("user_id", user.id)
    .eq("course_id", courseId);

  const previousAttempt = attempts?.find((a: any) => a.module_id === currentModule.id) || null;

  // Determine next module
  const sortedModules = [...allModules].sort((a: any, b: any) => a.sort_order - b.sort_order);
  const currentModIndex = sortedModules.findIndex((m: any) => m.id === currentModule.id);

  let nextModuleSlug: string | null = null;
  let nextModuleTitle: string | null = null;

  if (currentModIndex >= 0 && currentModIndex < sortedModules.length - 1) {
    const nextMod = sortedModules[currentModIndex + 1];
    nextModuleSlug = nextMod.slug;
    nextModuleTitle = nextMod.title;
  }

  // Calculate overall count
  const allLessons = sortedModules.flatMap((m: any) => m.course_lessons || []);
  const totalLessonsCount = allLessons.length;
  const completedLessonsCount = allLessons.filter((l: any) => completedLessonIds.includes(l.id)).length;
  const passedModulesCount = attempts?.filter((a: any) => a.passed).length || 0;

  const overallProgressString = `${completedLessonsCount}/${totalLessonsCount} · ${passedModulesCount}/6 MODULES`;

  return (
    <QuizClient
      moduleNumber={String(currentModule.sort_order).padStart(2, "0")}
      moduleSlug={moduleSlug}
      moduleTitle={currentModule.title}
      moduleId={currentModule.id}
      courseId={courseId}
      courseSlug={courseSlug}
      questions={sortedQuestions}
      previousAttempt={previousAttempt ? { score: previousAttempt.score, passed: previousAttempt.passed } : null}
      overallProgress={overallProgressString}
      nextModuleSlug={nextModuleSlug}
      nextModuleTitle={nextModuleTitle}
    />
  );
}
