import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { fetchNews } from "@/lib/news";

const CACHE_TTL_SECONDS = 900; // 15 minutes

export async function GET(request: NextRequest) {
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
    // 1. Fetch live news (or check cache in production if you want to optimize further)
    // For now, we fetch live since RSS is fast
    const news = await fetchNews();

    return NextResponse.json(news);
  } catch (error: any) {
    console.error("News Feed API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
