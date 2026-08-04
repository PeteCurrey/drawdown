import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {}
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // Fetch user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    // Fetch trade journal entries
    const { data: journalEntries } = await supabase
      .from("trade_entries")
      .select("*")
      .eq("user_id", user.id);

    // Fetch user legal acceptances
    const { data: legalAcceptances } = await supabase
      .from("legal_acceptances")
      .select("*")
      .eq("user_id", user.id);

    const exportPayload = {
      exportMetadata: {
        exportedAt: new Date().toISOString(),
        userId: user.id,
        email: user.email,
        formatVersion: "1.0",
      },
      profile: profile || null,
      tradeJournals: journalEntries || [],
      consentHistory: legalAcceptances || [],
    };

    return new NextResponse(JSON.stringify(exportPayload, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="drawdown-data-export-${user.id.slice(0, 8)}.json"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to export data", details: error.message }, { status: 500 });
  }
}
