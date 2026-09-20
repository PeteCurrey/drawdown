// src/lib/lobby-admin.ts
// Admin operations, status lifecycle transitions, and audit logging for The Lobby CMS

import { createInternalSupabase } from "./supabase/server";
import type { 
  LobbyArticle, 
  LobbyStatus, 
  LobbyAuditLog 
} from "../types/lobby";
import { validateLobbyArticleGuardrails } from "./lobby/guardrails";
import { detectDuplicateArticle } from "./lobby/duplicate-detection";

export interface AdminActor {
  id: string;
  email?: string;
}

export interface AdminArticleListOptions {
  status?: LobbyStatus;
  category?: string;
  page?: number;
  pageSize?: number;
  query?: string;
}

/**
 * Fetch articles for admin CMS table with pagination and status filters.
 */
export async function getLobbyArticlesAdmin(
  options: AdminArticleListOptions = {}
): Promise<{ articles: LobbyArticle[]; totalCount: number; totalPages: number }> {
  const page = Math.max(1, options.page || 1);
  const pageSize = options.pageSize || 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  try {
    const supabase = createInternalSupabase();
    let query = supabase
      .from("lobby_articles")
      .select("*", { count: "exact" })
      .order("updated_at", { ascending: false });

    if (options.status) {
      query = query.eq("status", options.status);
    }
    if (options.category) {
      query = query.eq("category", options.category);
    }
    if (options.query && options.query.trim().length > 0) {
      const q = `%${options.query.trim()}%`;
      query = query.or(`title.ilike.${q},slug.ilike.${q},excerpt.ilike.${q}`);
    }

    query = query.range(from, to);

    const { data, count, error } = await query;
    if (error) {
      console.error("getLobbyArticlesAdmin error:", error.message);
      return { articles: [], totalCount: 0, totalPages: 0 };
    }

    const totalCount = count || 0;
    return {
      articles: (data || []) as LobbyArticle[],
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize)
    };
  } catch (err) {
    console.error("getLobbyArticlesAdmin unexpected error:", err);
    return { articles: [], totalCount: 0, totalPages: 0 };
  }
}

/**
 * Fetch a single article by ID for editing in CMS.
 */
export async function getLobbyArticleByIdAdmin(
  id: string
): Promise<LobbyArticle | null> {
  try {
    const supabase = createInternalSupabase();
    const { data, error } = await supabase
      .from("lobby_articles")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) return null;
    return data as LobbyArticle;
  } catch (err) {
    console.error(`getLobbyArticleByIdAdmin [${id}] error:`, err);
    return null;
  }
}

/**
 * Fetch audit logs for an article.
 */
export async function getLobbyArticleAuditLogs(
  articleId: string
): Promise<LobbyAuditLog[]> {
  try {
    const supabase = createInternalSupabase();
    const { data, error } = await supabase
      .from("lobby_article_audit_logs")
      .select("*")
      .eq("article_id", articleId)
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data as LobbyAuditLog[];
  } catch (err) {
    console.error("getLobbyArticleAuditLogs error:", err);
    return [];
  }
}

/**
 * Record an action in the editorial audit trail.
 */
export async function logLobbyAudit(log: {
  articleId: string;
  action: LobbyAuditLog['action'];
  actor: AdminActor;
  previousStatus?: string | null;
  newStatus?: string | null;
  notes?: string;
}): Promise<void> {
  try {
    const supabase = createInternalSupabase();
    await supabase.from("lobby_article_audit_logs").insert({
      article_id: log.articleId,
      action: log.action,
      actor_id: log.actor.id,
      actor_email: log.actor.email || "staff@drawdown.trading",
      previous_status: log.previousStatus || null,
      new_status: log.newStatus || null,
      notes: log.notes || null,
    });
  } catch (err) {
    console.error("logLobbyAudit error:", err);
  }
}

/**
 * Create a new Lobby article with guardrails and duplicate checking.
 */
export async function createLobbyArticle(
  payload: Partial<LobbyArticle>,
  actor: AdminActor
): Promise<{ success: boolean; article?: LobbyArticle; errors?: string[] }> {
  // 1. Validate guardrails
  const validation = validateLobbyArticleGuardrails(payload, payload.status || 'DRAFT');
  if (!validation.isValid) {
    return { success: false, errors: validation.errors };
  }

  const supabase = createInternalSupabase();

  // 2. Check for slug duplicates
  const { data: existing } = await supabase
    .from("lobby_articles")
    .select("id, title, slug");

  if (existing && existing.length > 0) {
    const dupCheck = detectDuplicateArticle(
      payload.title || "",
      payload.slug || "",
      existing
    );
    if (dupCheck.isDuplicate && dupCheck.similarityScore === 1.0) {
      return { success: false, errors: [dupCheck.reason || "Slug is already in use."] };
    }
  }

  // 3. Set publication timestamp if publishing immediately
  const publishedAt = payload.status === 'PUBLISHED' 
    ? (payload.published_at || new Date().toISOString()) 
    : null;

  try {
    const { data, error } = await supabase
      .from("lobby_articles")
      .insert({
        title: payload.title,
        slug: payload.slug,
        excerpt: payload.excerpt || '',
        body: payload.body || '',
        category: payload.category,
        subcategory: payload.subcategory || null,
        article_type: payload.article_type || 'NEWS',
        status: payload.status || 'DRAFT',
        confidence: payload.confidence || 'VERIFIED',
        importance: payload.importance || 'standard',
        section: payload.section || 'standard',
        author_name: payload.author_name || 'Drawdown Editorial',
        author_role: payload.author_role || 'Editorial Desk',
        hero_image_url: payload.hero_image_url || null,
        hero_image_alt: payload.hero_image_alt || null,
        hero_image_caption: payload.hero_image_caption || null,
        hero_image_credit: payload.hero_image_credit || null,
        reading_time_minutes: payload.reading_time_minutes || 3,
        tags: payload.tags || [],
        sources: payload.sources || [],
        primary_source_name: payload.primary_source_name || null,
        primary_source_url: payload.primary_source_url || null,
        primary_source_date: payload.primary_source_date || null,
        primary_source_type: payload.primary_source_type || null,
        primary_source_classification: payload.primary_source_classification || 'primary',
        editorial_metadata: payload.editorial_metadata || {},
        related_article_slugs: payload.related_article_slugs || [],
        related_tool_slugs: payload.related_tool_slugs || [],
        related_broker_slugs: payload.related_broker_slugs || [],
        related_prop_firm_slugs: payload.related_prop_firm_slugs || [],
        related_platform_slugs: payload.related_platform_slugs || [],
        related_markets: payload.related_markets || [],
        meta_title: payload.meta_title || null,
        meta_description: payload.meta_description || payload.excerpt || null,
        schema_type: payload.schema_type || 'Article',
        canonical_url: payload.canonical_url || null,
        published_at: publishedAt,
      })
      .select()
      .single();

    if (error || !data) {
      return { success: false, errors: [error?.message || "Failed to create article."] };
    }

    // 4. Record audit log
    await logLobbyAudit({
      articleId: data.id,
      action: 'created',
      actor,
      newStatus: data.status,
      notes: `Initial creation as ${data.status}`
    });

    return { success: true, article: data as LobbyArticle };
  } catch (err: any) {
    return { success: false, errors: [err.message || "Unexpected creation failure."] };
  }
}

/**
 * Update an existing Lobby article.
 */
export async function updateLobbyArticle(
  id: string,
  payload: Partial<LobbyArticle>,
  actor: AdminActor
): Promise<{ success: boolean; article?: LobbyArticle; errors?: string[] }> {
  const current = await getLobbyArticleByIdAdmin(id);
  if (!current) {
    return { success: false, errors: ["Article not found."] };
  }

  const targetStatus = payload.status || current.status;
  const validation = validateLobbyArticleGuardrails(
    { ...current, ...payload },
    targetStatus
  );

  if (!validation.isValid) {
    return { success: false, errors: validation.errors };
  }

  const supabase = createInternalSupabase();

  // If slug is changing, verify no collision
  if (payload.slug && payload.slug !== current.slug) {
    const { data: existing } = await supabase
      .from("lobby_articles")
      .select("id, title, slug")
      .neq("id", id)
      .eq("slug", payload.slug)
      .maybeSingle();

    if (existing) {
      return { success: false, errors: [`Slug "${payload.slug}" is already in use by another article.`] };
    }
  }

  const isPublishingNow = current.status !== 'PUBLISHED' && targetStatus === 'PUBLISHED';
  const publishedAt = isPublishingNow 
    ? (payload.published_at || new Date().toISOString()) 
    : (payload.published_at !== undefined ? payload.published_at : current.published_at);

  try {
    const { data, error } = await supabase
      .from("lobby_articles")
      .update({
        ...payload,
        published_at: publishedAt,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      return { success: false, errors: [error?.message || "Failed to update article."] };
    }

    // Determine audit action
    let auditAction: LobbyAuditLog['action'] = 'edited';
    if (current.status !== targetStatus) {
      if (targetStatus === 'PUBLISHED') auditAction = 'published';
      else if (targetStatus === 'REVIEW') auditAction = 'submitted_for_review';
      else if (targetStatus === 'ARCHIVED') auditAction = 'archived';
      else if (current.status === 'PUBLISHED' && targetStatus === 'DRAFT') auditAction = 'unpublished';
    }

    await logLobbyAudit({
      articleId: id,
      action: auditAction,
      actor,
      previousStatus: current.status,
      newStatus: targetStatus,
      notes: `Updated by ${actor.email || 'staff'}`
    });

    return { success: true, article: data as LobbyArticle };
  } catch (err: any) {
    return { success: false, errors: [err.message || "Unexpected update failure."] };
  }
}

/**
 * Transitions an article's status (save draft, submit review, publish, unpublish, archive).
 */
export async function transitionArticleStatus(
  id: string,
  newStatus: LobbyStatus,
  actor: AdminActor,
  notes?: string
): Promise<{ success: boolean; errors?: string[] }> {
  return updateLobbyArticle(id, { status: newStatus }, actor);
}
