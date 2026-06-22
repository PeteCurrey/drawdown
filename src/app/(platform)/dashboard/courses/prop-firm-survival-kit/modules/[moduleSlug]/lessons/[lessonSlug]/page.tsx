import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { checkCourseAccess } from "@/lib/course-access";
import LessonReaderClient from "./LessonReaderClient";

const COURSE_SLUG = "prop-firm-survival-kit";

async function getCourseData(supabase: any) {
  const { data: course } = await supabase
    .from("courses")
    .select(`
      id, title, slug,
      course_modules (
        id, title, subtitle, sort_order, slug,
        course_lessons ( id, title, slug, estimated_minutes, sort_order, content_mdx, is_preview )
      )
    `)
    .eq("slug", COURSE_SLUG)
    .single();
  return course;
}

interface PageProps {
  params: Promise<{
    moduleSlug: string;
    lessonSlug: string;
  }>;
}

export default async function LessonPage({ params }: PageProps) {
  const { moduleSlug, lessonSlug } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/dashboard/courses/${COURSE_SLUG}/modules/${moduleSlug}/lessons/${lessonSlug}`);
  }

  const access = await checkCourseAccess(supabase, user.id, COURSE_SLUG);
  if (!access.hasAccess) {
    redirect(`/courses/${COURSE_SLUG}?locked=true`);
  }

  const course = await getCourseData(supabase);
  if (!course) {
    redirect("/dashboard");
  }

  // Sort modules + lessons
  const modules = [...(course.course_modules ?? [])]
    .sort((a: any, b: any) => a.sort_order - b.sort_order)
    .map((m: any) => ({
      ...m,
      course_lessons: [...(m.course_lessons ?? [])].sort((a: any, b: any) => a.sort_order - b.sort_order),
    }));

  const allLessons = modules.flatMap((m: any) => m.course_lessons.map((l: any) => ({ ...l, moduleSlug: m.slug })));
  const totalLessons = allLessons.length;

  // Find current lesson
  const currentIndex = allLessons.findIndex((l: any) => l.slug === lessonSlug);
  if (currentIndex === -1) notFound();

  const lesson = allLessons[currentIndex];

  // Find parent module
  const parentModule = modules.find((m: any) => m.slug === moduleSlug);
  if (!parentModule) notFound();

  // Gate: verify previous module is passed
  const { data: attempts } = await supabase
    .from("course_quiz_attempts")
    .select("module_id, score, passed")
    .eq("user_id", user.id)
    .eq("course_id", course.id);

  const passedModuleIds = attempts?.filter((a: any) => a.passed).map((a: any) => a.module_id) || [];

  const currentModIndex = modules.findIndex((m: any) => m.id === parentModule.id);
  if (currentModIndex > 0) {
    const prevModule = modules[currentModIndex - 1];
    if (!passedModuleIds.includes(prevModule.id)) {
      redirect(`/dashboard/courses/${COURSE_SLUG}?locked-module=true`);
    }
  }

  // Determine prev and next paths
  let prevLessonPath: string | null = null;
  let nextLessonPath: string | null = null;

  // If there's a previous lesson, link to it
  if (currentIndex > 0) {
    const prevL = allLessons[currentIndex - 1];
    prevLessonPath = `/dashboard/courses/${COURSE_SLUG}/modules/${prevL.moduleSlug}/lessons/${prevL.slug}`;
  }

  // Next path:
  // If this is the last lesson of the current module, the next step is the quiz for this module!
  const currentModuleLessons = parentModule.course_lessons || [];
  const lastLessonOfMod = currentModuleLessons[currentModuleLessons.length - 1];

  if (lesson.id === lastLessonOfMod.id) {
    nextLessonPath = `/dashboard/courses/${COURSE_SLUG}/modules/${moduleSlug}/quiz`;
  } else if (currentIndex < allLessons.length - 1) {
    const nextL = allLessons[currentIndex + 1];
    nextLessonPath = `/dashboard/courses/${COURSE_SLUG}/modules/${nextL.moduleSlug}/lessons/${nextL.slug}`;
  }

  // Fetch progress
  const { data: progress } = await supabase
    .from("course_progress")
    .select("lesson_id")
    .eq("user_id", user.id)
    .eq("course_id", course.id);
  const completedIds: string[] = (progress ?? []).map((r: any) => r.lesson_id);

  // For checklist lesson (or commandments), check if preview
  if (!lesson.is_preview && !access.hasAccess) {
    redirect(`/courses/${COURSE_SLUG}?locked=true`);
  }

  const lessonNumber = String(
    currentModuleLessons.findIndex((l: any) => l.id === lesson.id) + 1
  ).padStart(2, "0");

  const formattedModules = modules.map((m: any) => ({
    id: m.id,
    title: m.title,
    subtitle: m.subtitle,
    sort_order: m.sort_order,
    slug: m.slug,
    course_lessons: m.course_lessons.map((l: any) => ({
      id: l.id,
      slug: l.slug,
      title: l.title,
      estimated_minutes: l.estimated_minutes || 4,
      is_preview: l.is_preview,
      sort_order: l.sort_order,
    })),
  }));

  return (
    <LessonReaderClient
      courseId={course.id}
      courseSlug={COURSE_SLUG}
      courseTitle={course.title}
      moduleSlug={moduleSlug}
      lessonSlug={lessonSlug}
      lesson={{
        id: lesson.id,
        slug: lesson.slug,
        title: lesson.title,
        estimated_minutes: lesson.estimated_minutes || 4,
        is_preview: lesson.is_preview,
        sort_order: lesson.sort_order,
        content_mdx: lesson.content_mdx,
      }}
      modules={formattedModules}
      completedIds={completedIds}
      totalLessons={totalLessons}
      accessVia={access.via}
      prevLessonPath={prevLessonPath}
      nextLessonPath={nextLessonPath}
      moduleNumber={String(parentModule.sort_order).padStart(2, "0")}
      lessonNumber={lessonNumber}
      parentModuleTitle={parentModule.title}
    />
  );
}
