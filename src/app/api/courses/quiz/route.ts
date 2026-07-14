import { createClient } from "@/lib/supabase/server";
import { checkCourseAccess } from "@/lib/course-access";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { moduleId, courseId, answers } = await request.json();
    if (!moduleId || !courseId || !answers) {
      return NextResponse.json({ error: "moduleId, courseId, and answers are required" }, { status: 400 });
    }

    // Verify course access
    const access = await checkCourseAccess(supabase, user.id, "prop-firm-survival-kit");
    if (!access.hasAccess) {
      return NextResponse.json({ error: "Forbidden - No course access" }, { status: 403 });
    }

    // Fetch quiz questions
    const { data: questions, error: qErr } = await supabase
      .from("course_quiz_questions" as any)
      .select("id, correct_option_id")
      .eq("module_id", moduleId);

    if (qErr || !questions || questions.length === 0) {
      return NextResponse.json({ error: "Quiz questions not found" }, { status: 404 });
    }

    const total = questions.length;
    let score = 0;
    const correctAnswersMap: Record<string, string> = {};

    questions.forEach((q: any) => {
      correctAnswersMap[q.id] = q.correct_option_id;
      if (answers[q.id] === q.correct_option_id) {
        score++;
      }
    });

    const passed = (score / total) >= 0.8;

    // Upsert to attempts keeping the best score
    const { data: existingAttempt } = await supabase
      .from("course_quiz_attempts" as any)
      .select("score, passed")
      .eq("user_id", user.id)
      .eq("module_id", moduleId)
      .maybeSingle();

    const finalScore = Math.max(score, (existingAttempt as any)?.score ?? 0);
    const finalPassed = passed || ((existingAttempt as any)?.passed ?? false);

    const { error: upsertErr } = await supabase
      .from("course_quiz_attempts" as any)
      .upsert({
        user_id: user.id,
        module_id: moduleId,
        course_id: courseId,
        score: finalScore,
        total_questions: total,
        passed: finalPassed,
        answers,
        attempted_at: new Date().toISOString(),
      }, { onConflict: "user_id,module_id" });

    if (upsertErr) {
      return NextResponse.json({ error: upsertErr.message }, { status: 500 });
    }

    // If passed, auto-complete all lessons in the module that aren't already completed
    if (finalPassed) {
      const { data: lessons } = await supabase
        .from("course_lessons" as any)
        .select("id")
        .eq("module_id", moduleId);

      if (lessons && lessons.length > 0) {
        const progressInserts = lessons.map((l: any) => ({
          user_id: user.id,
          lesson_id: l.id,
          course_id: courseId,
          completed_at: new Date().toISOString(),
        }));
        await supabase
          .from("course_progress" as any)
          .upsert(progressInserts, { onConflict: "user_id,lesson_id" });
      }
    }

    return NextResponse.json({
      score,
      total,
      passed,
      correctAnswers: correctAnswersMap,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
