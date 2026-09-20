import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { 
  getLobbyArticlesAdmin, 
  createLobbyArticle 
} from "@/lib/lobby-admin";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const adminEmail = process.env.ADMIN_EMAIL || "petecurrey@gmail.com";

  if (!user || user.email !== adminEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as any;
  const category = searchParams.get("category") || undefined;
  const query = searchParams.get("q") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);

  const result = await getLobbyArticlesAdmin({
    status: status || undefined,
    category,
    query,
    page,
    pageSize: 20,
  });

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const adminEmail = process.env.ADMIN_EMAIL || "petecurrey@gmail.com";

  if (!user || user.email !== adminEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = await createLobbyArticle(body, {
      id: user.id,
      email: user.email || "staff@drawdown.trading"
    });

    if (!result.success) {
      return NextResponse.json({ errors: result.errors }, { status: 400 });
    }

    return NextResponse.json({ article: result.article });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to process request" }, { status: 500 });
  }
}
