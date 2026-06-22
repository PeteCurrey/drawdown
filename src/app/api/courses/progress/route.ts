import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { lessonId, courseId } = await request.json();
    if (!lessonId || !courseId) {
      return NextResponse.json({ error: "lessonId and courseId are required" }, { status: 400 });
    }

    // Insert progress row
    const { error } = await supabase
      .from("course_progress" as any)
      .upsert(
        {
          user_id: user.id,
          lesson_id: lessonId,
          course_id: courseId,
          completed_at: new Date().toISOString(),
        },
        { onConflict: "user_id,lesson_id" }
      );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
