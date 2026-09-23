import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { createServiceRoleClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("news_sources")
    .select("*")
    .order("priority", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ sources: data || [] });
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  try {
    const body = await req.json();
    const {
      name,
      platform = "rss",
      account_handle,
      source_category = "market_commentary",
      domain,
      feed_url,
      priority = 2,
      trust_tier = "tier_2_verified",
      active = true,
    } = body;

    if (!name || (!feed_url && !account_handle)) {
      return NextResponse.json(
        { error: "Name and either a Feed URL or Account Handle are required." },
        { status: 400 }
      );
    }

    const cleanDomain = domain || (feed_url ? new URL(feed_url).hostname : `${platform}.com`);
    const cleanFeedUrl = feed_url || `https://${platform}.com/${(account_handle || "").replace(/^@/, "")}`;

    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("news_sources")
      .insert({
        name,
        platform,
        account_handle: account_handle ? account_handle.replace(/^@/, "") : null,
        source_category,
        source_type: platform === "x" ? "api" : "rss",
        domain: cleanDomain,
        feed_url: cleanFeedUrl,
        priority: Number(priority),
        trust_tier,
        active: Boolean(active),
        monitoring_status: "configured",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, source: data });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Invalid payload" }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  try {
    const body = await req.json();
    const { id, active, priority, source_category, trust_tier, monitoring_status } = body;

    if (!id) {
      return NextResponse.json({ error: "Source ID is required" }, { status: 400 });
    }

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (typeof active === "boolean") updates.active = active;
    if (priority !== undefined) updates.priority = Number(priority);
    if (source_category !== undefined) updates.source_category = source_category;
    if (trust_tier !== undefined) updates.trust_tier = trust_tier;
    if (monitoring_status !== undefined) updates.monitoring_status = monitoring_status;

    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("news_sources")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, source: data });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Update error" }, { status: 400 });
  }
}
