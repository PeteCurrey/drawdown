// src/lib/content-os/news-radar.ts
import type { NewsCandidate, NewsTrustTier, ContentPriority } from "./types.ts";
import { NewsVerificationService, type VerificationEvidence } from "./verification.ts";
import { EditorialScoringService } from "./scoring.ts";
import { DeduplicationService } from "./deduplication.ts";

export interface NewsRadarIngestionItem {
  title: string;
  url: string;
  source: string;
  trustTier: NewsTrustTier;
  summary: string;
  publishedAt?: string;
  entities?: string[];
  symbols?: string[];
  eventType?: string;
  sourceClaim?: string;
  verifiedFacts?: Array<{
    claim: string;
    source: string;
    source_url?: string;
    verified_at?: string;
  }>;
  drawdownInterpretation?: string;
  platformPostId?: string;
  authorHandle?: string;
  sourceCategory?: string;
}

export interface RadarIngestionReport {
  ingestedTotal: number;
  newCandidatesCount: number;
  duplicatesCollapsedCount: number;
  highPriorityAlerts: Array<{
    title: string;
    priority: ContentPriority;
    potentialAngle: string;
    primarySourceVerified: boolean;
  }>;
}

export class NewsRadarEngine {
  /**
   * Evaluates incoming news items through the 10-step radar pipeline:
   * SOURCE -> INGEST -> NORMALISE -> DEDUPE -> VERIFY -> CLASSIFY -> SCORE -> EDITORIAL BRIEF -> DRAFT -> HUMAN APPROVAL -> PUBLISH
   * Distinguishes NEWS DETECTION from EDITORIAL DECISION from PUBLICATION.
   */
  static processIncomingBatch(
    items: NewsRadarIngestionItem[],
    existingCandidates: Array<Pick<NewsCandidate, 'id' | 'source_url' | 'title' | 'duplicate_key' | 'published_at'> & {
      platform_post_id?: string | null;
      entity_references?: string[];
    }>
  ): {
    candidatesToInsert: Partial<NewsCandidate>[];
    alerts: Array<{
      title: string;
      priority: ContentPriority;
      potentialAngle: string;
      primarySourceVerified: boolean;
      sources: string[];
    }>;
    report: RadarIngestionReport;
  } {
    const candidatesToInsert: Partial<NewsCandidate>[] = [];
    const alerts: Array<{
      title: string;
      priority: ContentPriority;
      potentialAngle: string;
      primarySourceVerified: boolean;
      sources: string[];
    }> = [];

    let duplicatesCount = 0;

    for (const item of items) {
      // 1. Deduplication evaluation
      const dedupe = DeduplicationService.evaluateDuplicate(
        {
          url: item.url,
          title: item.title,
          platformPostId: item.platformPostId,
          entityReferences: item.entities || [],
          publishedAt: item.publishedAt
        },
        existingCandidates
      );

      if (dedupe.isDuplicate) {
        duplicatesCount++;
        continue;
      }

      // 2. Verification Framework
      const verification = NewsVerificationService.verifyEvent({
        sources: [
          {
            name: item.source,
            url: item.url,
            trustTier: item.trustTier,
            claimText: item.sourceClaim || item.summary,
            publishedAt: item.publishedAt
          }
        ]
      });

      // 3. Deterministic Relevance & Priority Scoring
      const score = EditorialScoringService.scoreCandidate({
        title: item.title,
        summary: item.summary,
        sourceTrustTier: item.trustTier,
        entityReferences: item.entities || [],
        relatedSymbols: item.symbols || [],
        publishedAt: item.publishedAt,
        verificationEvidenceConfirmed: verification.status === 'verified'
      });

      const isPrimaryVerified = verification.status === 'verified' && item.trustTier === 'tier_1_primary';

      const candidateRecord: Partial<NewsCandidate> = {
        title: item.title,
        summary: item.summary,
        source: item.source,
        source_url: item.url,
        published_at: item.publishedAt || new Date().toISOString(),
        discovered_at: new Date().toISOString(),
        entity_references: item.entities || [],
        related_symbols: item.symbols || [],
        relevance_score: score.relevanceScore,
        market_impact_score: score.marketImpactScore,
        confidence_score: score.confidenceScore,
        priority_level: score.priorityLevel,
        scoring_reasons: score.reasons,
        duplicate_key: dedupe.duplicateKey,
        parent_event_id: dedupe.parentEventId || null,
        verification_status: verification.status,
        verification_evidence: verification.evidence,
        editorial_status: 'new', // Human approval required before draft/publish
        // Epistemic claim vs fact separation
        source_claim: item.sourceClaim || (item.authorHandle ? item.summary : null),
        verified_facts: item.verifiedFacts || [],
        drawdown_interpretation: item.drawdownInterpretation || null,
        platform_post_id: item.platformPostId || null,
        author_handle: item.authorHandle || null,
        investor_attention_score: dedupe.isCorroboratingAttention ? 75.0 : (item.authorHandle ? 50.0 : 0.0),
      };

      candidatesToInsert.push(candidateRecord);

      // 4. Alert generation for CRITICAL or HIGH priority candidates
      if (score.priorityLevel === 'critical' || score.priorityLevel === 'high') {
        alerts.push({
          title: item.title,
          priority: score.priorityLevel,
          potentialAngle: `Focus on macro and market structure implications for ${item.symbols?.join(', ') || 'portfolio assets'}.`,
          primarySourceVerified: isPrimaryVerified,
          sources: [item.source]
        });
      }
    }

    return {
      candidatesToInsert,
      alerts,
      report: {
        ingestedTotal: items.length,
        newCandidatesCount: candidatesToInsert.length,
        duplicatesCollapsedCount: duplicatesCount,
        highPriorityAlerts: alerts
      }
    };
  }
}
