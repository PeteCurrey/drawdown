import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { recordContentAudit } from "@/lib/content-os/audit";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing candidate ID" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { 
      editorial_status, 
      verification_status,
      source_claim, 
      verified_facts, 
      drawdown_interpretation,
      parent_event_id,
      entity_references
    } = body;

    const supabase = createServiceRoleClient();

    // Fetch current candidate for audit comparison
    const { data: current, error: fetchErr } = await supabase
      .from("news_candidates")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr || !current) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
    }

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (editorial_status !== undefined) updates.editorial_status = editorial_status;
    if (verification_status !== undefined) updates.verification_status = verification_status;
    if (source_claim !== undefined) updates.source_claim = source_claim;
    if (verified_facts !== undefined) updates.verified_facts = verified_facts;
    if (drawdown_interpretation !== undefined) updates.drawdown_interpretation = drawdown_interpretation;
    if (parent_event_id !== undefined) updates.parent_event_id = parent_event_id;
    if (entity_references !== undefined) updates.entity_references = entity_references;

    const { data: updated, error: updateErr } = await supabase
      .from("news_candidates")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    // Audit log
    await recordContentAudit({
      entity_type: "news_candidate",
      entity_id: id,
      actor_id: guard.user.id,
      previous_state: current.editorial_status,
      new_state: updated.editorial_status,
      reason: `Editorial review action by admin (${guard.user.email || 'staff'})`,
      metadata: updates
    });

    return NextResponse.json({ success: true, candidate: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Update error" }, { status: 500 });
  }
}
