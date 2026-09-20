// src/types/wire.ts
// Domain types for The Wire briefing layer & distribution engine

export type WireEditionType = 'MORNING' | 'EVENING' | 'BREAKING';

export type WireEditionStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED';

export interface WireEditionItem {
  id: string;
  edition_id: string;
  article_id: string | null;
  display_order: number;
  item_title: string;
  wire_summary: string;
  why_it_matters: string;
  recommended_tool_slug?: string | null;
  market_category?: string | null;
  source_attribution?: string | null;
  created_at: string;
  // Hydrated canonical Lobby article details if available
  article?: {
    id: string;
    title: string;
    slug: string;
    category: string;
    hero_image_url?: string | null;
  } | null;
}

export interface WireEdition {
  id: string;
  edition_type: WireEditionType;
  title: string;
  slug: string;
  scheduled_for?: string | null;
  published_at?: string | null;
  status: WireEditionStatus;
  subject_line: string;
  preview_text?: string | null;
  editorial_notes?: string | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
  items?: WireEditionItem[];
}

export interface CreateWireEditionInput {
  edition_type: WireEditionType;
  title: string;
  slug?: string;
  subject_line: string;
  preview_text?: string;
  editorial_notes?: string;
  scheduled_for?: string;
}

export interface WireItemInput {
  article_id?: string | null;
  display_order: number;
  item_title: string;
  wire_summary: string;
  why_it_matters: string;
  recommended_tool_slug?: string | null;
  market_category?: string | null;
  source_attribution?: string | null;
}
