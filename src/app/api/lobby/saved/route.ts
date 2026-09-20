// src/app/api/lobby/saved/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createInternalSupabase } from "@/lib/supabase/server";
import { getUserSavedArticles, toggleSaveArticle } from "@/lib/lobby-personalisation";

export async function GET() {
  try {
    const supabase = await createInternalSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const saved = await getUserSavedArticles(user.id);
    return NextResponse.json(saved);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to load saved stories" }, { status: 500 });
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
    if (!body.articleId) {
      return NextResponse.json({ error: "articleId is required" }, { status: 400 });
    }

    const res = await toggleSaveArticle(user.id, body.articleId);
    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to toggle save" }, { status: 500 });
  }
}
