import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { 
  getLobbyArticleByIdAdmin, 
  updateLobbyArticle, 
  getLobbyArticleAuditLogs 
} from "@/lib/lobby-admin";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const adminEmail = process.env.ADMIN_EMAIL || "petecurrey@gmail.com";

  if (!user || user.email !== adminEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const article = await getLobbyArticleByIdAdmin(id);

  if (!article) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const auditLogs = await getLobbyArticleAuditLogs(id);
  return NextResponse.json({ article, auditLogs });
}

export async function PUT(request: Request, { params }: RouteParams) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const adminEmail = process.env.ADMIN_EMAIL || "petecurrey@gmail.com";

  if (!user || user.email !== adminEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const result = await updateLobbyArticle(id, body, {
      id: user.id,
      email: user.email || "staff@drawdown.trading"
    });

    if (!result.success) {
      return NextResponse.json({ errors: result.errors }, { status: 400 });
    }

    return NextResponse.json({ article: result.article });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update article" }, { status: 500 });
  }
}
