import { createClient } from "@/lib/supabase/server";
import { checkCourseAccess } from "@/lib/course-access";
import SurvivalKitLandingClient from "./SurvivalKitLandingClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prop Firm Survival Kit",
  description: "The interactive prop firm course. Six modules, 40 lessons, six quizzes. Every rule decoded. Every psychological trap named. Pass the kit to unlock the next module.",
};

const COURSE_SLUG = "prop-firm-survival-kit";

async function getCourseData(supabase: any) {
  const { data: course } = await supabase
    .from("courses")
    .select(`
      id, slug, title, subtitle,
      course_modules (
        id, title, subtitle, sort_order, slug,
        course_lessons ( id )
      )
    `)
    .eq("slug", COURSE_SLUG)
    .single();
  return course;
}

export default async function PropFirmSurvivalKitLandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isAuthenticated = false;
  let hasAccess = false;
  let userName = "";
  let avatarUrl = "";
  let passedModuleIds: string[] = [];
  let completedCount = 0;

  const course = await getCourseData(supabase);

  if (user) {
    isAuthenticated = true;
    const access = await checkCourseAccess(supabase, user.id, COURSE_SLUG);
    hasAccess = access.hasAccess;

    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("id", user.id)
      .single();

    userName = (profile as any)?.display_name || user.email || "Trader";
    avatarUrl = (profile as any)?.avatar_url || "";

    if (course) {
      const { data: quizAttempts } = await supabase
        .from("course_quiz_attempts")
        .select("module_id, passed")
        .eq("user_id", user.id)
        .eq("course_id", course.id)
        .eq("passed", true);

      passedModuleIds = quizAttempts?.map((a: any) => a.module_id) || [];

      const { count } = await supabase
        .from("course_progress")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("course_id", course.id);

      completedCount = count || 0;
    }
  }

  const rawModules = course?.course_modules || [];
  const sortedModules = [...rawModules].sort((a: any, b: any) => a.sort_order - b.sort_order).map((mod: any) => ({
    id: mod.id,
    title: mod.title,
    subtitle: mod.subtitle,
    sort_order: mod.sort_order,
    slug: mod.slug,
    lessons_count: mod.course_lessons?.length || 0,
  }));

  return (
    <SurvivalKitLandingClient
      isAuthenticated={isAuthenticated}
      hasAccess={hasAccess}
      userName={userName}
      avatarUrl={avatarUrl}
      passedModuleIds={passedModuleIds}
      completedCount={completedCount}
      modules={sortedModules}
    />
  );
}
