import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { ContentStateMachine } from "@/lib/content-os/state-machine";
import { recordContentAudit } from "@/lib/content-os/audit";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  const { id } = await props.params;
  const supabase = createServiceRoleClient();

  const { data: item, error: fetchErr } = await supabase
    .from("content_items")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchErr || !item) {
    return NextResponse.json({ error: "Content item not found" }, { status: 404 });
  }

  // State machine transition validation
  const validation = ContentStateMachine.validateContentTransition(item, 'approved', guard.user.id);
  if (!validation.isValid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { data: updated, error: updateErr } = await supabase
    .from("content_items")
    .update({
      status: 'approved',
      approved_by: guard.user.id,
      approved_at: new Date().toISOString()
    })
    .eq("id", id)
    .select()
    .single();

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  await recordContentAudit({
    entity_type: 'content_item',
    entity_id: id,
    actor_id: guard.user.id,
    previous_state: item.status,
    new_state: 'approved',
    reason: 'Human editorial approval granted'
  });

  return NextResponse.json({ item: updated });
}
