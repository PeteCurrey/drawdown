import { NextRequest, NextResponse } from "next/server";
import { fetchNews } from "@/lib/news";

const CACHE_TTL_SECONDS = 900; // 15 minutes

export async function GET(request: NextRequest) {
  try {
    // Fetch live news (RSS is fast; no DB read required)
    const news = await fetchNews();

    return NextResponse.json(news);
  } catch (error: any) {
    console.error("News Feed API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
