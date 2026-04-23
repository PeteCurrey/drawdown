import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetId = searchParams.get("id");
  const source = searchParams.get("source") || "unknown";

  // We are currently only using this for TradingView
  if (targetId !== "tradingview") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const affiliateUrl = "https://www.tradingview.com/?aff_id=165855";

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
    await supabase.from("affiliate_clicks").insert({
      vertical: "software",
      target_id: targetId,
      source_page: source,
      ip_hash: "anonymous" // Real app: hash IP
    });

    // 2. Redirect to the affiliate URL
    return NextResponse.redirect(new URL(affiliateUrl));
  } catch (error) {
    console.error("Affiliate redirect logging error:", error);
    // Redirect anyway even if logging fails
    return NextResponse.redirect(new URL(affiliateUrl));
  }
}
