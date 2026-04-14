import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { brokers } from "@/data/brokers";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const brokerId = searchParams.get("id");
  const sourcePage = searchParams.get("source") || "brokers_page";

  const broker = brokers.find((b) => b.id === brokerId);

  if (!broker) {
    return NextResponse.redirect(new URL("/brokers", request.url));
  }

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

  // Get user if logged in
  const { data: { user } } = await supabase.auth.getUser();

  // Log the click for analytics
  try {
    await supabase.from("broker_clicks").insert({
      broker_id: broker.id as any,
      user_id: user?.id || null,
      source_page: sourcePage,
    });
  } catch (error) {
    console.error("Failed to log broker click:", error);
    // Continue with redirect anyway
  }

  // Redirect to affiliate URL
  return NextResponse.redirect(new URL(broker.affiliateUrl));
}
