// src/app/api/lobby/preferences/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createInternalSupabase } from "@/lib/supabase/server";
import { getUserPreferences, saveUserPreferences } from "@/lib/lobby-personalisation";

export async function GET() {
  try {
    const supabase = await createInternalSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prefs = await getUserPreferences(user.id);
    return NextResponse.json(prefs);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to load preferences" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createInternalSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const updated = await saveUserPreferences(user.id, body);
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to save preferences" }, { status: 500 });
  }
}
