import { createServiceRoleClient } from "./server";

export interface AuditEventPayload {
  actor_id: string;
  action: string;
  target_id?: string;
  target_type?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

/**
 * Log security and administrative actions to public.audit_logs
 */
export async function logAuditEvent(payload: AuditEventPayload): Promise<void> {
  const timestamp = new Date().toISOString();
  
  // Always output structured log to stdout/stderr
  console.log(`[AUDIT] [${timestamp}] ${payload.action} by ${payload.actor_id}`, JSON.stringify(payload));

  try {
    const adminClient = createServiceRoleClient();
    const { error } = await adminClient.from("audit_logs").insert({
      actor_id: payload.actor_id,
      action: payload.action,
      target_id: payload.target_id || null,
      target_type: payload.target_type || null,
      details: payload.details || {},
      ip_address: payload.ip_address || null,
      user_agent: payload.user_agent || null,
      created_at: timestamp,
    });

    if (error) {
      // Non-fatal if audit_logs table schema does not exist yet
      console.warn(`[AUDIT WARNING] Failed to persist audit log to DB: ${error.message}`);
    }
  } catch (err: any) {
    console.warn(`[AUDIT WARNING] Audit logger failed: ${err?.message || err}`);
  }
}
