import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { ContentStateMachine } from "@/lib/content-os/state-machine";
import { getSocialPublisher } from "@/lib/content-os/publisher";
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
    .select("*, content_channels(*), content_assets(*)")
    .eq("id", id)
    .single();

  if (fetchErr || !item) {
    return NextResponse.json({ error: "Content item not found" }, { status: 404 });
  }

  // Validate state transition from approved -> published
  const validation = ContentStateMachine.validateContentTransition(item, 'published', guard.user.id);
  if (!validation.isValid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const publisher = getSocialPublisher();
  const deliveryResults: any[] = [];
  const channels = item.content_channels || [];
  const assets = item.content_assets || [];

  for (const channelItem of channels) {
    // Generate idempotency key for this delivery attempt
    const idempotencyKey = `pub_${channelItem.id}_${Date.now()}`;
    const pubResult = await publisher.publish(channelItem, assets, idempotencyKey);

    // Record delivery receipt record
    const { data: deliveryRecord } = await supabase
      .from("social_deliveries")
      .insert({
        content_channel_id: channelItem.id,
        provider: publisher.providerName,
        channel: channelItem.channel,
        status: pubResult.status,
        provider_post_id: pubResult.providerPostId || null,
        published_at: pubResult.publishedAt || null,
        failure_reason: pubResult.failureReason || null,
        idempotency_key: idempotencyKey,
        raw_response: pubResult.rawResponse || {}
      })
      .select()
      .single();

    deliveryResults.push(deliveryRecord || pubResult);

    await recordContentAudit({
      entity_type: 'social_delivery',
      entity_id: deliveryRecord?.id || idempotencyKey,
      actor_id: guard.user.id,
      previous_state: 'queued',
      new_state: pubResult.status,
      reason: `Publish dispatched via ${publisher.providerName}: ${pubResult.status}`
    });
  }

  // Check if any published or if item should be marked published
  const anyPublished = deliveryResults.some(r => r.status === 'published');
  if (anyPublished) {
    await supabase
      .from("content_items")
      .update({
        status: 'published',
        published_at: new Date().toISOString()
      })
      .eq("id", id);

    await recordContentAudit({
      entity_type: 'content_item',
      entity_id: id,
      actor_id: guard.user.id,
      previous_state: item.status,
      new_state: 'published',
      reason: 'Published to social channels'
    });
  }

  return NextResponse.json({
    itemId: id,
    deliveries: deliveryResults
  });
}
