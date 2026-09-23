// src/lib/wire.ts
// The Wire Briefing Layer & Distribution Logic

import { createClient } from "@supabase/supabase-js";
import type { 
  WireEdition, 
  WireEditionItem, 
  WireEditionType, 
  CreateWireEditionInput, 
  WireItemInput 
} from "../types/wire.ts";
import type { LobbyArticle } from "../types/lobby.ts";
import type { InvestorAttentionItem } from "./lobby";
import { DRAWDOWN_TOOLS } from "./lobby-constants.ts";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";
  return createClient(url, key);
}

/**
 * Builds standard UTM attribution parameters for links pointing back to The Lobby or Tools.
 */
export function buildUtmUrl(params: {
  path: string;
  source: 'wire' | 'x' | 'linkedin' | 'instagram' | 'email';
  medium: 'briefing' | 'social' | 'newsletter' | 'email';
  campaign: string;
  content?: string;
}): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://drawdown.trading";
  const cleanPath = params.path.startsWith('/') ? params.path : `/${params.path}`;
  
  const url = new URL(`${base}${cleanPath}`);
  url.searchParams.set("utm_source", params.source);
  url.searchParams.set("utm_medium", params.medium);
  url.searchParams.set("utm_campaign", params.campaign);
  if (params.content) {
    url.searchParams.set("utm_content", params.content);
  }
  return url.toString();
}

/**
 * Retrieves public published Wire editions (for /wire archive).
 */
export async function getWireEditions(options: {
  limit?: number;
  offset?: number;
  type?: WireEditionType;
} = {}): Promise<WireEdition[]> {
  try {
    const supabase = getSupabase();
    let query = supabase
      .from("wire_editions")
      .select(`
        *,
        items:wire_edition_items(
          *,
          article:lobby_articles(id, title, slug, category, hero_image_url)
        )
      `)
      .eq("status", "PUBLISHED")
      .order("published_at", { ascending: false });

    if (options.type) {
      query = query.eq("edition_type", options.type);
    }
    if (options.limit) {
      query = query.limit(options.limit);
    }
    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;
    if (error || !data) return [];
    return data as unknown as WireEdition[];
  } catch {
    return [];
  }
}

/**
 * Retrieves a single published Wire edition by slug with its items and canonical Lobby references.
 */
export async function getWireEditionBySlug(slug: string): Promise<WireEdition | null> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("wire_editions")
      .select(`
        *,
        items:wire_edition_items(
          *,
          article:lobby_articles(id, title, slug, category, hero_image_url)
        )
      `)
      .eq("slug", slug)
      .eq("status", "PUBLISHED")
      .maybeSingle();

    if (error || !data) return null;
    return data as unknown as WireEdition;
  } catch {
    return null;
  }
}

/**
 * Formats a clean URL slug for a Wire edition based on type and date.
 */
export function generateWireSlug(type: WireEditionType, date: Date = new Date()): string {
  const dateStr = date.toISOString().split('T')[0];
  const typeStr = type.toLowerCase();
  return `${typeStr}-${dateStr}`;
}

/**
 * Curates a briefing edition draft from a selection of canonical Lobby articles
 * and optional approved investor attention intelligence items.
 * Never creates duplicate article records; references canonical article IDs directly.
 */
export function generateWireDraftFromLobby(
  articles: LobbyArticle[],
  editionType: WireEditionType,
  attentionItems?: InvestorAttentionItem[]
): {
  edition: CreateWireEditionInput;
  items: WireItemInput[];
} {
  const now = new Date();
  const dateFormatted = now.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  
  let title = "";
  let subject = "";
  let preview = "";

  if (editionType === "MORNING") {
    title = `The Morning Wire — ${dateFormatted}`;
    subject = `Drawdown Morning Wire: Key catalysts and pre-market intelligence (${dateFormatted})`;
    preview = `Top market moves, broker updates, and what's worth watching before the open.`;
  } else if (editionType === "EVENING") {
    title = `The Evening Wire — ${dateFormatted}`;
    subject = `Drawdown Evening Wire: Market close wrap & tomorrow's preview (${dateFormatted})`;
    preview = `Institutional summary of today's price action and overnight risk catalysts.`;
  } else {
    title = `The Wire: Breaking Intelligence — ${dateFormatted}`;
    subject = `BREAKING: Market Intelligence Alert`;
    preview = `High-impact industry development reported by Drawdown.`;
  }

  const items: WireItemInput[] = articles.map((art, idx) => {
    // Pick the most relevant Drawdown tool recommendation based on article content
    let toolSlug: string | null = null;
    if (art.category === "MARKETS" || art.category === "MACRO") {
      toolSlug = "forex-market-hours";
    } else if (art.category === "BROKERS" || art.category === "PROP FIRMS") {
      toolSlug = "drawdown-recovery-calculator";
    } else if (art.category === "TRADES") {
      toolSlug = "position-size-calculator";
    } else {
      toolSlug = "signal-centre";
    }

    return {
      article_id: art.id,
      display_order: idx + 1,
      item_title: art.title,
      wire_summary: art.excerpt || art.title,
      why_it_matters: `Market participants should monitor potential volatility and risk asymmetry in ${art.category.toLowerCase()}.`,
      recommended_tool_slug: toolSlug,
      market_category: art.category,
      source_attribution: art.primary_source_name ? `${art.primary_source_name} (Primary)` : undefined
    };
  });

  // Append approved investor attention items if provided
  if (attentionItems && attentionItems.length > 0) {
    let orderOffset = items.length;
    for (const att of attentionItems) {
      orderOffset++;
      items.push({
        article_id: null,
        display_order: orderOffset,
        item_title: `[Investor Attention] ${att.title}`,
        wire_summary: att.source_claim ? `Source statement: "${att.source_claim}". ${att.drawdown_interpretation || ''}`.trim() : (att.drawdown_interpretation || att.title),
        why_it_matters: "Monitored external specialist account highlighting market catalysts. Unverified claim separated from facts.",
        recommended_tool_slug: "signal-centre",
        market_category: "INVESTOR ATTENTION",
        source_attribution: att.author_handle ? `@${att.author_handle} (${att.source})` : att.source
      });
    }
  }

  return {
    edition: {
      edition_type: editionType,
      title,
      slug: generateWireSlug(editionType, now),
      subject_line: subject,
      preview_text: preview,
      editorial_notes: `Generated from ${articles.length} canonical Lobby articles and ${attentionItems?.length || 0} attention items.`
    },
    items
  };
}

/**
 * Simple email HTML generator for The Wire briefing newsletter.
 */
export function renderWireEmailHtml(edition: WireEdition): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://drawdown.trading";

  const itemsHtml = (edition.items || []).map((item, index) => {
    const articleLink = item.article 
      ? buildUtmUrl({
          path: `/lobby/${item.article.category.toLowerCase().replace(/\s+/g, '-')}/${item.article.slug}`,
          source: 'wire',
          medium: 'email',
          campaign: edition.slug,
          content: item.article.slug
        })
      : buildUtmUrl({
          path: '/lobby',
          source: 'wire',
          medium: 'email',
          campaign: edition.slug
        });

    const tool = item.recommended_tool_slug && DRAWDOWN_TOOLS[item.recommended_tool_slug]
      ? DRAWDOWN_TOOLS[item.recommended_tool_slug]
      : null;

    const toolLink = tool
      ? buildUtmUrl({
          path: tool.href,
          source: 'wire',
          medium: 'email',
          campaign: edition.slug,
          content: tool.slug
        })
      : null;

    return `
      <div style="border-bottom: 1px solid #222; padding-bottom: 24px; margin-bottom: 24px;">
        <span style="font-family: monospace; font-size: 11px; text-transform: uppercase; color: #888; letter-spacing: 0.08em;">
          ITEM 0${index + 1} // ${item.market_category || 'INTELLIGENCE'}
        </span>
        <h2 style="font-family: 'Times New Roman', Georgia, serif; font-size: 20px; margin: 8px 0 12px 0; color: #ffffff; line-height: 1.3;">
          <a href="${articleLink}" style="color: #ffffff; text-decoration: none;">${item.item_title}</a>
        </h2>
        <p style="font-family: -apple-system, sans-serif; font-size: 14px; color: #b3b3b3; line-height: 1.6; margin: 0 0 12px 0;">
          ${item.wire_summary}
        </p>
        <div style="background-color: #111; border-left: 2px solid #2563eb; padding: 10px 14px; margin: 12px 0;">
          <strong style="font-family: monospace; font-size: 11px; text-transform: uppercase; color: #60a5fa;">Why It Matters:</strong>
          <p style="font-family: -apple-system, sans-serif; font-size: 13px; color: #cccccc; margin: 4px 0 0 0; line-height: 1.5;">
            ${item.why_it_matters}
          </p>
        </div>
        ${tool ? `
          <div style="margin-top: 12px; font-size: 12px; font-family: -apple-system, sans-serif;">
            <span style="color: #666;">Recommended Tool:</span>
            <a href="${toolLink}" style="color: #2563eb; text-decoration: underline; margin-left: 6px; font-weight: 500;">
              ${tool.name} →
            </a>
          </div>
        ` : ''}
        <div style="margin-top: 14px;">
          <a href="${articleLink}" style="font-family: monospace; font-size: 11px; text-transform: uppercase; color: #fff; background: #1c1c1c; padding: 6px 12px; text-decoration: none; border: 1px solid #333; display: inline-block;">
            Read Full Analysis on The Lobby →
          </a>
        </div>
      </div>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${edition.subject_line}</title>
      </head>
      <body style="margin: 0; padding: 32px 16px; background-color: #050505; color: #e5e5e5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #0a0a0a; border: 1px solid #222; padding: 32px;">
          <!-- Header -->
          <div style="border-bottom: 2px solid #ffffff; padding-bottom: 16px; margin-bottom: 28px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <span style="font-family: 'Times New Roman', Georgia, serif; font-size: 26px; font-weight: 900; letter-spacing: -0.03em; color: #ffffff;">
                DRAWDOWN <span style="color: #2563eb;">//</span> THE WIRE
              </span>
            </div>
            <div style="margin-top: 8px; font-family: monospace; font-size: 11px; text-transform: uppercase; color: #888; letter-spacing: 0.05em;">
              ${edition.edition_type} EDITION // CANONICAL BRIEFING LAYER
            </div>
          </div>

          <!-- Lead Subject -->
          <h1 style="font-family: 'Times New Roman', Georgia, serif; font-size: 24px; font-weight: normal; margin: 0 0 12px 0; color: #ffffff;">
            ${edition.title}
          </h1>
          ${edition.preview_text ? `
            <p style="font-size: 15px; color: #999; margin: 0 0 28px 0; line-height: 1.5;">
              ${edition.preview_text}
            </p>
          ` : ''}

          <!-- Items -->
          ${itemsHtml}

          <!-- Footer -->
          <div style="border-top: 1px solid #222; padding-top: 24px; margin-top: 32px; font-size: 11px; color: #555; text-align: center; font-family: monospace;">
            <p style="margin: 0 0 8px 0;">THE WIRE is Drawdown's curated institutional briefing layer.</p>
            <p style="margin: 0 0 8px 0;">All stories link to canonical reporting on <a href="${siteUrl}/lobby" style="color: #888;">The Lobby</a>.</p>
            <p style="margin: 0;">© Drawdown Trading. Educational and analytical purposes only. Not financial advice.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
