import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return [] },
        setAll() {},
      },
    }
  );

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { module_id, phase_id, completed, quiz_score } = await request.json();

    // Map string phase slug to integer
    let phase = 1;
    if (phase_id === "ground-zero") phase = 1;
    else if (phase_id === "chart-reader") phase = 2;
    else if (phase_id === "strategist") phase = 3;
    else if (phase_id === "risk-manager") phase = 4;
    else if (phase_id === "mind-over-market") phase = 5;
    else if (phase_id === "the-edge") phase = 6;
    else {
      const parsed = parseInt(phase_id);
      if (!isNaN(parsed)) phase = parsed;
    }

    // Map module string ID (e.g. "module-1") to integer
    let moduleNum = 1;
    if (typeof module_id === "string") {
      const match = module_id.match(/\d+/);
      if (match) {
        moduleNum = parseInt(match[0]);
      }
    } else if (typeof module_id === "number") {
      moduleNum = module_id;
    }

    const { error } = await supabase
      .from('course_progress')
      .upsert({
        user_id: user.id,
        phase,
        module: moduleNum,
        completed,
        quiz_score: quiz_score !== undefined ? quiz_score : null,
        completed_at: completed ? new Date().toISOString() : null
      }, {
        onConflict: 'user_id,phase,module'
      });

    if (error) throw error;

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Progress Tracking Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
