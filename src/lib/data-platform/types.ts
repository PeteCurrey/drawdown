/**
 * Drawdown Intelligence Data Platform — Core Types & Contracts
 *
 * Provider-agnostic canonical interfaces for sources, entities, observations,
 * events, raw audit, provider health, and confidence models.
 */

// ─── SOURCE CATEGORIES (24 categories) ─────────────────────────────────────────

export type SourceCategory =
  | "MARKET"
  | "MACRO"
  | "NEWS"
  | "CENTRAL_BANK"
  | "REGULATOR"
  | "CORPORATE"
  | "EARNINGS"
  | "POSITIONING"
  | "OPTIONS"
  | "FUTURES"
  | "BROKER"
  | "PROP_FIRM"
  | "PLATFORM"
  | "CRYPTO"
  | "WEATHER"
  | "SHIPPING"
  | "AIS"
  | "SATELLITE"
  | "ENERGY"
  | "AGRICULTURE"
  | "GEOPOLITICAL"
  | "SOCIAL"
  | "SEARCH_TRENDS"
  | "OTHER";

// ─── CANONICAL ENTITY TYPES (13 types) ────────────────────────────────────────

export type EntityType =
  | "company"
  | "market"
  | "instrument"
  | "broker"
  | "prop_firm"
  | "platform"
  | "regulator"
  | "central_bank"
  | "country"
  | "commodity"
  | "vessel"
  | "port"
  | "economic_indicator";

// ─── SOURCE RELIABILITY (5 levels) ────────────────────────────────────────────

export type SourceReliability =
  | "PRIMARY"                 // Direct official source (SEC, BoE, Fed, Companies House)
  | "AUTHORITATIVE_SECONDARY" // Tier-1 institutional news (Bloomberg, Reuters, FT, WSJ)
  | "SECONDARY"               // Specialist publications, accredited aggregators
  | "COMMUNITY"               // Trader communities, social sentiment, discussion
  | "UNVERIFIED";             // Single anonymous report, rumors, uncorroborated crawl

// ─── DATA CONFIDENCE MODEL (4 levels) ─────────────────────────────────────────

export type ConfidenceLevel =
  | "VERIFIED"   // Directly backed by a primary or official authority
  | "KNOWN"      // Supported by authoritative secondary or multiple corroborated sources
  | "INFERRED"   // Model-derived, computed or correlated from observations
  | "UNKNOWN";   // Insufficient evidence or uncorroborated report (retained, never published as fact)

// ─── INGESTION STATES (10 states) ─────────────────────────────────────────────

export type IngestionState =
  | "DISCOVERED"
  | "FETCHING"
  | "INGESTED"
  | "NORMALIZED"
  | "VALIDATED"
  | "CORRELATED"
  | "READY"
  | "FAILED"
  | "STALE"
  | "REJECTED";

// ─── SCHEDULING INTERVALS ─────────────────────────────────────────────────────

export type ScheduleInterval =
  | "realtime"
  | "every-minute"
  | "every-5-minutes"
  | "hourly"
  | "daily"
  | "weekly"
  | "event-driven";

// ─── AUTHENTICATION TYPES ─────────────────────────────────────────────────────

export type AuthenticationType =
  | "api_key_header"
  | "api_key_query"
  | "bearer_token"
  | "basic_auth"
  | "public_unauthenticated";

// ─── ENTITY SCHEMA ────────────────────────────────────────────────────────────

export interface DataEntity {
  id: string; // e.g. 'inst:eurusd', 'ind:us-fed-funds', 'comm:crude-wti'
  entityType: EntityType;
  name: string;
  symbol?: string;
  countryCode?: string;
  sector?: string;
  identifiers: Record<string, string>;
  metadata?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

// ─── DATA SOURCE REGISTRY ─────────────────────────────────────────────────────

export interface DataSource {
  id: string; // e.g. 'twelve-data-market', 'fred-api', 'eia-v2-api'
  name: string;
  providerId: string;
  category: SourceCategory;
  reliability: SourceReliability;
  sourceType: "api" | "rss" | "filing" | "scrape";
  url: string;
  documentationUrl?: string;
  licenseNotes?: string;
  attributionRequired: boolean;
  attributionText?: string;
  refreshFrequency: ScheduleInterval;
  active: boolean;
}

// ─── RAW INGESTION AUDIT RECORD ───────────────────────────────────────────────

export interface DataIngestionRecord {
  id: string;
  providerId: string;
  sourceId?: string;
  endpoint: string;
  requestParamsHash: string;
  responsePayloadHash: string;
  responsePayloadSnippet?: Record<string, unknown>;
  httpStatus: number;
  latencyMs: number;
  schemaVersion: string;
  state: IngestionState;
  errorDetails?: string;
  recordCount: number;
  fetchedAt: string;
  processedAt?: string;
}

// ─── DATA OBSERVATION (Normalized Quantitative Time-Series) ───────────────────

export interface DataObservation {
  id?: string;
  sourceId: string;
  ingestionRecordId?: string;
  entityId: string;
  metric: string;
  value: number;
  unit: string;
  currency?: string;
  period?: string;
  region?: string;
  observedAt: string; // ISO 8601 - Time of observation / event in real world
  receivedAt: string; // ISO 8601 - Time retrieved by Drawdown platform
  confidence: ConfidenceLevel;
  sourceReliability: SourceReliability;
  ingestionState: IngestionState;
  sourceReference?: string;
  metadata?: Record<string, unknown>;
}

// ─── DATA EVENT (Discrete Occurrences, Radar, Announcements) ──────────────────

export interface DataEvent {
  id?: string;
  eventType: string;
  title: string;
  description: string;
  entityIds: string[];
  sourceIds: string[];
  occurredAt: string; // ISO 8601
  detectedAt: string; // ISO 8601
  severity: "low" | "normal" | "high" | "critical";
  confidence: ConfidenceLevel;
  sourceReliability: SourceReliability;
  status: "DETECTED" | "RESEARCHING" | "READY" | "REJECTED";
  primarySourceUrl?: string;
  corroboratingReferences?: Array<{
    sourceId: string;
    sourceName: string;
    url?: string;
    reliability: SourceReliability;
    retrievedAt: string;
  }>;
  metadata?: Record<string, unknown>;
}

// ─── PROVIDER HEALTH & METRICS ────────────────────────────────────────────────

export type CircuitBreakerState = "CLOSED" | "OPEN" | "HALF_OPEN";

export interface ProviderHealth {
  providerId: string;
  name: string;
  status: "AVAILABLE" | "DEGRADED" | "UNAVAILABLE" | "STALE" | "NOT_CONFIGURED";
  successfulRequests: number;
  failedRequests: number;
  consecutiveFailures: number;
  averageLatencyMs: number;
  lastSuccessfulFetch?: string;
  lastAttemptedFetch?: string;
  lastErrorMessage?: string;
  circuitBreakerState: CircuitBreakerState;
  rateLimitResetAt?: string;
}

export interface ProviderHealthReport {
  isAvailable: boolean;
  status: "AVAILABLE" | "DEGRADED" | "UNAVAILABLE" | "STALE" | "NOT_CONFIGURED";
  latencyMs: number;
  error?: string;
  details?: Record<string, unknown>;
}

// ─── PROVIDER CONFIGURATION & CONTRACT ────────────────────────────────────────

export interface RateLimitConfig {
  maxRequestsPerMinute: number;
  maxRequestsPerDay?: number;
  cooldownPeriodMs: number;
}

export interface AttributionPolicy {
  required: boolean;
  notice?: string;
  linkBack?: string;
}

export interface LicensePolicy {
  commercialAllowed: boolean;
  redistributionAllowed: boolean;
  retentionAllowed: boolean;
  notes?: string;
}

export interface IngestionRequest {
  endpoint: string;
  params?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
  timeoutMs?: number;
}

export interface RawFetchResult {
  providerId: string;
  endpoint: string;
  httpStatus: number;
  latencyMs: number;
  payload: unknown;
  rawHash: string;
  fetchedAt: string;
}

export interface NormalizedIngestionBundle {
  observations: DataObservation[];
  events: DataEvent[];
  entities: DataEntity[];
  rawCount: number;
  errors?: string[];
}

export interface DataProvider {
  readonly id: string;
  readonly name: string;
  readonly categories: SourceCategory[];
  readonly sourceReliability: SourceReliability;
  readonly authenticationType: AuthenticationType;
  readonly rateLimits: RateLimitConfig;
  readonly attribution: AttributionPolicy;
  readonly licensing: LicensePolicy;

  /**
   * Check connection status and API accessibility.
   */
  checkHealth(): Promise<ProviderHealthReport>;

  /**
   * Thin fetch layer: executes HTTP request with authentication and rate limit tracking.
   */
  fetchRaw(request: IngestionRequest): Promise<RawFetchResult>;

  /**
   * Normalizes raw response payload into canonical observations and events.
   */
  normalize(raw: RawFetchResult): Promise<NormalizedIngestionBundle>;
}
