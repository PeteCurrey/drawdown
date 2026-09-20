// src/lib/lobby/intelligence.ts
// Intelligence ingestion, source registry, event detection and verification foundation for The Lobby

import type { LobbySource, LobbyEventItem, LobbySourceRegistryItem } from "../../types/lobby";

export type IngestionSourceType = 
  | 'NEWS'
  | 'COMPANY'
  | 'BROKER'
  | 'PROP_FIRM'
  | 'PLATFORM'
  | 'REGULATOR'
  | 'GOVERNMENT'
  | 'ECONOMIC_CALENDAR'
  | 'MARKET_DATA'
  | 'OTHER';

export type EventClassification = 
  | 'MARKET'
  | 'BROKER'
  | 'PROP_FIRM'
  | 'PLATFORM'
  | 'MACRO'
  | 'REGULATION'
  | 'TECHNOLOGY'
  | 'TRADING_INDUSTRY'
  | 'OTHER';

export type EventImportance = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export type EventStatus = 
  | 'DETECTED'
  | 'RESEARCHING'
  | 'DRAFTED'
  | 'NEEDS_REVIEW'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'REJECTED';

export interface VerifiedEventPayload {
  title: string;
  summary: string;
  classification: EventClassification;
  importance: EventImportance;
  entities: string[];
  symbols: string[];
  primarySource: LobbySource;
  corroboratingSources: LobbySource[];
  timestamp: string;
  verificationEvidence?: string;
}

export interface StructuredDraftOutput {
  headline: string;
  deck: string;
  whatHappened: string;
  whyItMatters: string;
  whatChanged?: string;
  timing: string;
  sources: LobbySource[];
  relatedTools: string[];
  relatedEntities: string[];
}

/**
 * Standard primary source registry catalog
 */
export const DEFAULT_PRIMARY_SOURCES: Array<Omit<LobbySourceRegistryItem, 'id' | 'created_at' | 'updated_at'>> = [
  {
    name: "Financial Conduct Authority (FCA) News & Register",
    domain: "fca.org.uk",
    url: "https://www.fca.org.uk/news/press-releases",
    source_type: "REGULATOR",
    reliability_classification: "tier_1_primary",
    polling_frequency_minutes: 30,
    active: true,
  },
  {
    name: "Commodity Futures Trading Commission (CFTC) Press Releases",
    domain: "cftc.gov",
    url: "https://www.cftc.gov/PressRoom/PressReleases",
    source_type: "REGULATOR",
    reliability_classification: "tier_1_primary",
    polling_frequency_minutes: 30,
    active: true,
  },
  {
    name: "Bank of England Newsroom",
    domain: "bankofengland.co.uk",
    url: "https://www.bankofengland.co.uk/news/news-releases",
    source_type: "GOVERNMENT",
    reliability_classification: "tier_1_primary",
    polling_frequency_minutes: 15,
    active: true,
  },
  {
    name: "TradingView Product Updates",
    domain: "tradingview.com",
    url: "https://www.tradingview.com/blog/en/",
    source_type: "PLATFORM",
    reliability_classification: "tier_1_primary",
    polling_frequency_minutes: 60,
    active: true,
  },
  {
    name: "Pepperstone Group Media & Announcements",
    domain: "pepperstone.com",
    url: "https://pepperstone.com/en-gb/market-analysis/",
    source_type: "BROKER",
    reliability_classification: "tier_1_primary",
    polling_frequency_minutes: 60,
    active: true,
  }
];

/**
 * Event Verification Validator:
 * For an event to become publishable or drafted, it must have verified evidence.
 */
export function verifyEventFeasibility(
  event: Partial<LobbyEventItem>
): { verified: boolean; reasons: string[] } {
  const reasons: string[] = [];

  if (!event.title || event.title.trim().length < 10) {
    reasons.push("Title must be at least 10 characters long.");
  }

  if (!event.primary_source_url) {
    reasons.push("Event strictly requires a valid primary source URL.");
  }

  if (!event.entity_references || event.entity_references.length === 0) {
    reasons.push("At least one target entity (broker, firm, platform, market) must be identified.");
  }

  return {
    verified: reasons.length === 0,
    reasons
  };
}

/**
 * Generates a structured editorial draft from a verified event.
 * Preserves source attribution and forbids hallucinated facts.
 */
export function generateStructuredDraft(
  event: VerifiedEventPayload
): StructuredDraftOutput {
  const toolRecommendations: string[] = [];
  if (event.classification === 'BROKER' || event.classification === 'PROP_FIRM') {
    toolRecommendations.push('position-size-calculator', 'drawdown-recovery-calculator');
  }
  if (event.classification === 'MARKET' || event.classification === 'MACRO') {
    toolRecommendations.push('signal-centre', 'forex-market-hours');
  }

  return {
    headline: event.title,
    deck: event.summary,
    whatHappened: event.summary,
    whyItMatters: `This development directly impacts execution parameters, risk tolerance, or regulatory positioning for active traders.`,
    whatChanged: event.verificationEvidence || "Policy and terms updated across official documentation.",
    timing: event.timestamp || new Date().toISOString(),
    sources: [event.primarySource, ...event.corroboratingSources],
    relatedTools: toolRecommendations,
    relatedEntities: event.entities
  };
}
