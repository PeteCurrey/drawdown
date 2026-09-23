/**
 * DataEvent → LobbyArticle Bridge (Option B: Review Queue)
 *
 * Ingested DataEvents land as DRAFT lobby_articles — never auto-published.
 * Full source attribution is always preserved.
 */

import crypto from "crypto";
import { createInternalSupabase } from "@/lib/supabase/server";
import { LobbyFeedService, type LobbyFeedItem } from "@/lib/lobby-feed";
import type { DataEvent } from "./types";
import type { LobbyCategory, LobbySection, LobbyConfidence, LobbyImportance } from "@/types/lobby";

const FEED_SECTION_MAP: Record<LobbyFeedItem["section"], LobbySection> = {
  just_in:         "just_in",
  whats_happening: "whats_happening",
  coming_up:       "coming_up",
  broker_watch:    "broker_watch",
  prop_firm_watch: "prop_firm_watch",
  market_watch:    "whats_happening",
};

function mapEventTypeToCategory(eventType: string, entityIds: string[]): LobbyCategory {
  const et = eventType.toUpperCase();
  if (et.includes("BROKER"))                                                   return "BROKERS";
  if (et.includes("PROP"))                                                     return "PROP FIRMS";
  if (et.includes("PLATFORM") || et.includes("TECH"))                         return "TRADING TECHNOLOGY";
  if (et.includes("REGUL") || et.includes("FCA") || et.includes("CFTC"))     return "REGULATION";
  if (et.includes("CENTRAL_BANK") || et.includes("MACRO") || et.includes("YIELD")) return "MACRO";
  if (et.includes("FILING") || et.includes("EDGAR"))                          return "MARKETS";
  if (et.includes("ENERGY") || et.includes("WTI"))                            return "MARKETS";
  if (entityIds.some(id => id.startsWith("broker:")))                         return "BROKERS";
  if (entityIds.some(id => id.startsWith("prop:")))                           return "PROP FIRMS";
  if (entityIds.some(id => id.startsWith("reg:")))                            return "REGULATION";
  if (entityIds.some(id => id.startsWith("ind:")))                            return "MACRO";
  return "MARKETS";
}

function mapSeverityToImportance(severity: string): LobbyImportance {
  return (severity === "critical" || severity === "high") ? "featured" : "standard";
}

function generateSlug(title: string, seed?: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80)
    .replace(/-$/, "");
  return `${base}-${(seed ?? crypto.randomUUID()).slice(0, 6)}`;
}

function buildSourcesArray(event: DataEvent) {
  const sources: Array<{ name: string; url?: string; published_at?: string; source_type: string; classification: string }> = [];
  if (event.sourceIds[0] || event.primarySourceUrl) {
    sources.push({
      name: event.sourceIds[0] || "Primary Source",
      url: event.primarySourceUrl,
      published_at: event.occurredAt,
      source_type: "api_ingested",
      classification: "primary",
    });
  }
  for (const ref of event.corroboratingReferences ?? []) {
    sources.push({
      name: ref.sourceName,
      url: ref.url,
      published_at: ref.retrievedAt,
      source_type: "corroborating",
      classification: "secondary",
    });
  }
  return sources;
}

export interface BridgeResult {
  success: boolean;
  articleId?: string;
  slug?: string;
  skipped?: boolean;
  skipReason?: string;
  error?: string;
}

/**
 * Transforms a single DataEvent into a DRAFT lobby_article.
 * Idempotent — duplicate data_event_ids are detected and skipped.
 * Never auto-publishes.
 */
export async function bridgeEventToLobbyDraft(event: DataEvent): Promise<BridgeResult> {
  try {
    const feedItem = LobbyFeedService.transformEvent(event);
    if (!feedItem) {
      return { success: false, skipped: true, skipReason: `confidence=${event.confidence} rejected` };
    }

    const supabase = createInternalSupabase();

    if (event.id) {
      const { data: existing } = await supabase
        .from("lobby_articles")
        .select("id, slug")
        .eq("editorial_metadata->>data_event_id", event.id)
        .maybeSingle();

      if (existing) {
        return { success: true, skipped: true, skipReason: "already bridged", articleId: existing.id, slug: existing.slug };
      }
    }

    const category = mapEventTypeToCategory(event.eventType, event.entityIds);
    const section: LobbySection = FEED_SECTION_MAP[feedItem.section] ?? "just_in";
    const importance = mapSeverityToImportance(event.severity);
    const confidence = event.confidence as LobbyConfidence;
    const sources = buildSourcesArray(event);
    const slug = generateSlug(event.title, event.id);

    const articleRow = {
      title:   event.title,
      slug,
      excerpt: event.description.slice(0, 300),
      body:    event.description,
      category,
      article_type:  "NEWS",
      status:        "DRAFT",
      confidence,
      importance,
      section,
      author_name:   "Drawdown Intelligence",
      author_role:   "Data Platform (System)",
      reading_time_minutes: 1,
      tags: [
        event.eventType.toLowerCase().replace(/_/g, " "),
        ...(event.metadata?.centralBank ? [String(event.metadata.centralBank)] : []),
        ...(event.metadata?.currency    ? [String(event.metadata.currency)]    : []),
        ...(event.metadata?.formType    ? [String(event.metadata.formType)]    : []),
      ].filter(Boolean),
      sources,
      primary_source_name:           sources[0]?.name ?? null,
      primary_source_url:            event.primarySourceUrl ?? null,
      primary_source_date:           event.occurredAt,
      primary_source_type:           "api_ingested",
      primary_source_classification: event.sourceReliability === "PRIMARY" ? "primary" : "secondary",
      editorial_metadata: {
        data_event_id:               event.id ?? null,
        data_event_type:             event.eventType,
        source_reliability:          event.sourceReliability,
        corroborating_sources_count: (event.corroboratingReferences?.length ?? 0) + 1,
        pipeline_detected_at:        event.detectedAt,
        pipeline_confidence:         event.confidence,
        entity_ids:                  event.entityIds,
        source_ids:                  event.sourceIds,
        auto_generated:              true,
        requires_editorial_review:   true,
      },
    };

    const { data, error } = await supabase.from("lobby_articles").insert(articleRow).select("id, slug").single();

    if (error) {
      if (error.code === "23505") {
        const { data: r2, error: e2 } = await supabase
          .from("lobby_articles")
          .insert({ ...articleRow, slug: generateSlug(event.title, crypto.randomUUID()) })
          .select("id, slug")
          .single();
        if (e2) return { success: false, error: e2.message };
        return { success: true, articleId: r2.id, slug: r2.slug };
      }
      return { success: false, error: error.message };
    }

    return { success: true, articleId: data.id, slug: data.slug };
  } catch (err: any) {
    return { success: false, error: err?.message ?? "Unexpected bridge error" };
  }
}

export interface BatchBridgeResult {
  total: number;
  created: number;
  skipped: number;
  errors: number;
  articleIds: string[];
}

/**
 * Bridges a batch of confidence-gated DataEvents into DRAFT lobby_articles.
 * Sequential to prevent slug-collision races.
 */
export async function bridgeEventBatchToDrafts(events: DataEvent[]): Promise<BatchBridgeResult> {
  const result: BatchBridgeResult = { total: events.length, created: 0, skipped: 0, errors: 0, articleIds: [] };

  for (const event of events) {
    const r = await bridgeEventToLobbyDraft(event);
    if (r.skipped) {
      result.skipped++;
    } else if (r.success && r.articleId) {
      result.created++;
      result.articleIds.push(r.articleId);
    } else {
      result.errors++;
      console.error("[bridge] Failed:", event.id, r.error);
    }
  }

  return result;
}
