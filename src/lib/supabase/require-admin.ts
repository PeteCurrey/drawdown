import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Server-side admin guard for API route handlers.
 *
 * Uses the cookie-based anon client — never the service-role key — so that
 * the session is genuinely tied to the incoming request cookies. The service-
 * role client ignores cookies and cannot be used to verify who is calling.
 *
 * Usage:
 *   const guard = await requireAdmin();
 *   if ("error" in guard) return guard.error;
 *   const { user } = guard;
 */
export async function requireAdmin(): Promise<
  { user: { id: string; email?: string } } | { error: NextResponse }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { user };
}
