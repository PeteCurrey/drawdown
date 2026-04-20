import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const brokerId = searchParams.get("id");
  const source = searchParams.get("source") || "unknown";

  if (!brokerId) {
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

  try {
    // 1. Log the click
    // Note: We use service role here to bypass RLS for logging
    const { data: broker, error: fetchError } = await supabase
      .from("broker_affiliates")
      .select("affiliate_url, name")
      .eq("id", brokerId)
      .single();

    if (fetchError || !broker) {
      console.error("Broker redirect error: Broker not found", brokerId);
      return NextResponse.redirect(new URL("/brokers", request.url));
    }

    // Attempt to log click (fire and forget for latency, but wait briefly)
    await supabase.from("broker_clicks").insert({
      broker_id: brokerId,
      source_page: source,
      ip_hash: "anonymous" // In a real app, hash the IP for GDPR
    });

    // 2. Redirect to the affiliate URL
    return NextResponse.redirect(new URL(broker.affiliate_url));
  } catch (error) {
    console.error("Broker redirect fatal error:", error);
    return NextResponse.redirect(new URL("/brokers", request.url));
  }
}
