import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { ContentStateMachine } from "@/lib/content-os/state-machine";
import { recordContentAudit } from "@/lib/content-os/audit";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const limit = parseInt(searchParams.get("limit") || "50", 10);

  const supabase = createServiceRoleClient();
  let query = supabase
    .from("content_items")
    .select("*, content_channels(*), content_assets(*)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ items: data || [] });
}

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  try {
    const body = await request.json();
    const { title, slug, content_type, category, priority, body: contentBody, source_type, source_reference } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: "Title and slug are required." }, { status: 400 });
    }

    const supabase = createServiceRoleClient();
    const payload = {
      title,
      slug,
      content_type: content_type || 'market_analysis',
      status: 'draft',
      category: category || 'market_intelligence',
      priority: priority || 'medium',
      source_type: source_type || 'original',
      source_reference: source_reference || null,
      body: contentBody || '',
      created_by: guard.user.id
    };

    const { data, error } = await supabase
      .from("content_items")
      .insert(payload)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    await recordContentAudit({
      entity_type: 'content_item',
      entity_id: data.id,
      actor_id: guard.user.id,
      previous_state: null,
      new_state: 'draft',
      reason: 'Initial creation via Admin Content OS'
    });

    return NextResponse.json({ item: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Invalid request" }, { status: 500 });
  }
}
