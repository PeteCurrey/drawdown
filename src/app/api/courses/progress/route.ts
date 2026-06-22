import { createClient } from "@/lib/supabase/server";
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { checkCourseAccess } from "@/lib/course-access";

// ── POST /api/courses/progress — mark a lesson complete ─────────────────────
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { lessonId, courseId, courseSlug } = await request.json();
  if (!lessonId || !courseId) {
    return NextResponse.json({ error: "lessonId and courseId required" }, { status: 400 });
  }

  // Verify access
  const slug = courseSlug ?? "";
  const access = slug ? await checkCourseAccess(supabase, user.id, slug) : { hasAccess: true };
  if (!access.hasAccess) {
    return NextResponse.json({ error: "No course access" }, { status: 403 });
  }

  // Use service role for insert (bypasses RLS)
  const admin = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll() { return []; }, setAll() {} } }
  );

  // Idempotent insert
  await admin.from("course_progress" as any).insert({
    user_id:   user.id,
    lesson_id: lessonId,
    course_id: courseId,
  }).then(); // ignore unique-violation (ON CONFLICT DO NOTHING not available via insert — handled by upsert)

  // Count progress
  const { count: completedCount } = await admin
    .from("course_progress" as any)
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("course_id", courseId);

  const { count: totalLessons } = await admin
    .from("course_lessons" as any)
    .select("id", { count: "exact", head: true })
    .eq("course_id", courseId);

  const courseComplete = (completedCount ?? 0) >= (totalLessons ?? 999);

  return NextResponse.json({ completedCount, totalLessons, courseComplete });
}

// ── GET /api/courses/progress?courseSlug=xxx — fetch completed lesson IDs ───
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ completedLessonIds: [] });

  const courseSlug = request.nextUrl.searchParams.get("courseSlug");
  if (!courseSlug) return NextResponse.json({ error: "courseSlug required" }, { status: 400 });

  const { data: course } = await supabase
    .from("courses" as any)
    .select("id")
    .eq("slug", courseSlug)
    .single();

  if (!course) return NextResponse.json({ completedLessonIds: [] });

  const { data: progress } = await supabase
    .from("course_progress" as any)
    .select("lesson_id")
    .eq("user_id", user.id)
    .eq("course_id", (course as any).id);

  const completedLessonIds = (progress ?? []).map((r: any) => r.lesson_id);
  return NextResponse.json({ completedLessonIds });
}
