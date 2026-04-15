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

    const { module_id, phase_id, completed } = await request.json();

    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: user.id,
        module_id,
        phase_id,
        completed,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,module_id,phase_id'
      });

    if (error) throw error;

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Progress Tracking Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
