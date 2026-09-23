/**
 * POST /api/admin/lobby/bulk-approve
 *
 * Bulk-publishes a selection of DRAFT or REVIEW lobby_articles in one request.
 * Used by the admin Lobby list view's "Approve Selected" action for the daily
 * 2-minute review queue pass.
 *
 * Body: { ids: string[] }   — up to 50 article IDs per call
 *
 * Each article:
 *   - status → PUBLISHED
 *   - published_at → now() (if not already set)
 *   - An audit log entry is written for each approval.
 *
 * Only DRAFT / REVIEW articles are affected; PUBLISHED / ARCHIVED rows in the
 * selection are silently ignored (idempotent).
 *
 * Auth: admin session cookie (same check as all other /api/admin/* routes).
 */

import { NextResponse } from "next/server";
import { createClient, createInternalSupabase } from "@/lib/supabase/server";

const MAX_IDS = 50;

export async function POST(request: Request) {
  // Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const adminEmail = process.env.ADMIN_EMAIL || "petecurrey@gmail.com";

  if (!user || user.email !== adminEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let ids: string[];
  try {
    const body = await request.json();
    ids = Array.isArray(body?.ids) ? body.ids : [];
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (ids.length === 0) {
    return NextResponse.json({ error: "No article IDs provided" }, { status: 400 });
  }
  if (ids.length > MAX_IDS) {
    return NextResponse.json({ error: `Maximum ${MAX_IDS} IDs per request` }, { status: 400 });
  }

  const db = createInternalSupabase();
  const now = new Date().toISOString();

  // Update only DRAFT / REVIEW rows (ignore already-published)
  const { data: updated, error } = await db
    .from("lobby_articles")
    .update({
      status: "PUBLISHED",
      published_at: now,
      updated_at: now,
    })
    .in("id", ids)
    .in("status", ["DRAFT", "REVIEW"])
    .select("id, title, slug, status");

  if (error) {
    console.error("[bulk-approve] Update error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const approvedIds = (updated ?? []).map((r: { id: string }) => r.id);

  // Write audit log for each approved article
  if (approvedIds.length > 0) {
    const auditRows = approvedIds.map((articleId: string) => ({
      article_id: articleId,
      action: "PUBLISHED",
      actor_id: user.id,
      actor_email: user.email,
      changes: { status: { from: "DRAFT", to: "PUBLISHED" }, bulk_approve: true },
      created_at: now,
    }));

    const { error: auditError } = await db
      .from("lobby_article_audit_logs")
      .insert(auditRows);

    if (auditError) {
      // Non-fatal: approval succeeded; audit log failure is logged only
      console.error("[bulk-approve] Audit log write failed:", auditError.message);
    }
  }

  return NextResponse.json({
    success: true,
    approved: approvedIds.length,
    skipped: ids.length - approvedIds.length,
    approvedIds,
  });
}
