import type { ContentPriority, NewsTrustTier } from "./types";

export interface ScoringInput {
  title: string;
  summary?: string;
  sourceTrustTier: NewsTrustTier;
  entityReferences?: string[];
  relatedSymbols?: string[];
  publishedAt?: string | Date | null;
  discoveredAt?: string | Date | null;
  verificationEvidenceConfirmed?: boolean;
}

export interface ScoringResult {
  priorityLevel: ContentPriority;
  relevanceScore: number; // 0 - 100
  marketImpactScore: number; // 0 - 100
  confidenceScore: number; // 0 - 100
  reasons: string[];
}

/**
 * Deterministic First-Pass Priority Scoring System.
 * No arbitrary LLM hallucinated scores. Transparent mathematical rules.
 */
export class EditorialScoringService {
  private static CORE_SYMBOLS = new Set([
    'GBPUSD', 'EURUSD', 'FTSE', 'UK100', 'SPX', 'SP500', 'NDX', 'NASDAQ', 'BTC', 'ETH', 'XAU', 'GOLD', 'BRENT', 'WTI'
  ]);

  private static HIGH_MATERIALITY_KEYWORDS = [
    'leadership change', 'resigns', 'steps down', 'ceo', 'fca sanction', 'sec enforcement',
    'interest rate', 'rate cut', 'rate hike', 'emergency meeting', 'liquidation', 'drawdown',
    'bank collapse', 'bankruptcy', 'acquisition', 'earnings miss', 'margin call', 'black swan'
  ];

  private static DRAWDOWN_THEMATIC_KEYWORDS = [
    'drawdown', 'risk management', 'leverage', 'position sizing', 'prop firm',
    'loss', 'recovery', 'volatility', 'liquidity', 'spread betting', 'execution leak'
  ];

  static scoreCandidate(input: ScoringInput): ScoringResult {
    let relevanceScore = 0;
    let marketImpactScore = 0;
    let confidenceScore = 50; // base confidence
    const reasons: string[] = [];

    const fullText = `${input.title} ${input.summary || ''}`.toLowerCase();

    // 1. Source Trust Dimension
    switch (input.sourceTrustTier) {
      case 'tier_1_primary':
        relevanceScore += 35;
        confidenceScore += 35;
        reasons.push("Primary official source verified (Regulator / Central Bank / Corporate IR).");
        break;
      case 'tier_2_verified':
        relevanceScore += 25;
        confidenceScore += 20;
        reasons.push("Reputable verified financial news source.");
        break;
      case 'tier_3_secondary':
        relevanceScore += 10;
        confidenceScore += 5;
        reasons.push("Secondary general news source.");
        break;
      case 'tier_4_untrusted':
        relevanceScore += 0;
        confidenceScore -= 30;
        reasons.push("Untrusted/unverified source tier.");
        break;
    }

    // 2. Market Relevance (Core Drawdown Instruments)
    const matchedSymbols = (input.relatedSymbols || []).filter(s => 
      this.CORE_SYMBOLS.has(s.toUpperCase().replace(/[^A-Z]/g, ''))
    );
    if (matchedSymbols.length > 0) {
      relevanceScore += 20;
      marketImpactScore += 25;
      reasons.push(`Directly affects core tracked instruments: ${matchedSymbols.join(', ')}.`);
    }

    // 3. Materiality Keywords
    const matchedMateriality = this.HIGH_MATERIALITY_KEYWORDS.filter(kw => fullText.includes(kw));
    if (matchedMateriality.length > 0) {
      marketImpactScore += 35;
      relevanceScore += 15;
      reasons.push(`High materiality trigger detected: "${matchedMateriality.slice(0, 2).join('", "')}".`);
    }

    // 4. Drawdown Editorial Audience Angle
    const matchedAngle = this.DRAWDOWN_THEMATIC_KEYWORDS.filter(kw => fullText.includes(kw));
    if (matchedAngle.length > 0) {
      relevanceScore += 20;
      reasons.push(`Strong alignment with Drawdown risk/discipline pillars (${matchedAngle[0]}).`);
    }

    // 5. Verification status boost
    if (input.verificationEvidenceConfirmed) {
      confidenceScore += 15;
      reasons.push("Factual claims corroborated across multiple evidence records.");
    }

    // 6. Time Sensitivity (Recency Decay)
    if (input.publishedAt) {
      const hoursOld = (Date.now() - new Date(input.publishedAt).getTime()) / (1000 * 60 * 60);
      if (hoursOld <= 4) {
        relevanceScore += 10;
        reasons.push("Breaking recency window (< 4 hours).");
      } else if (hoursOld > 48) {
        relevanceScore = Math.max(0, relevanceScore - 15);
        reasons.push("Story is older than 48 hours; novelty decayed.");
      }
    }

    // Normalise 0 - 100
    const finalRelevance = Math.min(100, Math.max(0, relevanceScore));
    const finalImpact = Math.min(100, Math.max(0, marketImpactScore));
    const finalConfidence = Math.min(100, Math.max(0, confidenceScore));

    // Determine Priority Bucket
    let priorityLevel: ContentPriority = 'low';
    if (finalRelevance >= 75 && finalImpact >= 50) {
      priorityLevel = 'critical';
    } else if (finalRelevance >= 55 || (finalImpact >= 60 && finalConfidence >= 60)) {
      priorityLevel = 'high';
    } else if (finalRelevance >= 35) {
      priorityLevel = 'medium';
    } else {
      priorityLevel = 'low';
      if (reasons.length === 0) {
        reasons.push("Minor market movement with limited Drawdown-specific angle.");
      }
    }

    return {
      priorityLevel,
      relevanceScore: finalRelevance,
      marketImpactScore: finalImpact,
      confidenceScore: finalConfidence,
      reasons
    };
  }
}
