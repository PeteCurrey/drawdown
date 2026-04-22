import { NextRequest, NextResponse } from "next/server";
import { brokers } from "@/data/brokers";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  
  // Find broker by ID or slug
  const broker = brokers.find((b) => b.id === slug || b.slug === slug || b.slug === `${slug}-review`);

  if (!broker) {
    return NextResponse.redirect(new URL("/brokers", request.url));
  }

  const supabase = await createClient();
  
  // Log the click for analytics
  try {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("broker_clicks").insert({
      broker_id: broker.id as any,
      user_id: user?.id || null,
      source_page: request.nextUrl.searchParams.get("source") || "seo_landing_page",
    });
  } catch (error) {
    console.error("Failed to log broker click:", error);
  }

  // Redirect to affiliate URL
  return NextResponse.redirect(new URL(broker.affiliateUrl));
}
