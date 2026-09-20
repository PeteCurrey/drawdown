// src/lib/content-os/audit.ts
import { createServiceRoleClient } from "@/lib/supabase/server";
import { ContentAuditLog } from "./types";

export interface CreateAuditLogParams {
  entity_type: 'content_item' | 'content_channel' | 'social_delivery' | 'news_candidate';
  entity_id: string;
  actor_id: string;
  previous_state?: string | null;
  new_state: string;
  reason?: string | null;
  metadata?: Record<string, any>;
}

/**
 * Persists an audit log entry for Content OS state transitions.
 * Guaranteed not to throw fatal errors, and sanitises any sensitive fields.
 */
export async function recordContentAudit(params: CreateAuditLogParams): Promise<ContentAuditLog | null> {
  const timestamp = new Date().toISOString();
  
  // Structured logging (clean, no tokens)
  console.log(
    `[CONTENT_OS_AUDIT] [${timestamp}] ${params.entity_type}:${params.entity_id} transition: ${params.previous_state ?? 'NONE'} -> ${params.new_state} by ${params.actor_id}. Reason: ${params.reason ?? 'N/A'}`
  );

  try {
    const supabase = createServiceRoleClient();
    const payload = {
      entity_type: params.entity_type,
      entity_id: params.entity_id,
      actor_id: params.actor_id,
      previous_state: params.previous_state ?? null,
      new_state: params.new_state,
      reason: params.reason ?? null,
      metadata: params.metadata ?? {},
      created_at: timestamp,
    };

    const { data, error } = await supabase
      .from("content_audit_logs")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.warn(`[CONTENT_OS_AUDIT_WARNING] Failed to persist audit log to DB: ${error.message}`);
      return null;
    }

    return data as ContentAuditLog;
  } catch (err: any) {
    console.warn(`[CONTENT_OS_AUDIT_WARNING] DB audit log exception: ${err?.message || err}`);
    return null;
  }
}
