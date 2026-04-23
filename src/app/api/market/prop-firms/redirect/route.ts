import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { propFirms } from "@/data/prop-firms";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const firmId = searchParams.get("id");
  const source = searchParams.get("source") || "unknown";

  if (!firmId) {
    return NextResponse.redirect(new URL("/prop-firms", request.url));
  }

  // Find the firm locally (or fetch from DB if they were stored there)
  const firm = propFirms.find((f) => f.slug === firmId || f.id === firmId);

  if (!firm) {
    console.error("Prop firm redirect error: Firm not found", firmId);
    return NextResponse.redirect(new URL("/prop-firms", request.url));
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
    await supabase.from("affiliate_clicks").insert({
      vertical: "prop_firm",
      target_id: firmId,
      source_page: source,
      ip_hash: "anonymous" // Real app: hash IP
    });

    // 2. Redirect to the affiliate URL
    return NextResponse.redirect(new URL(firm.affiliateUrl));
  } catch (error) {
    console.error("Prop firm redirect logging error:", error);
    // Redirect anyway even if logging fails
    return NextResponse.redirect(new URL(firm.affiliateUrl));
  }
}
