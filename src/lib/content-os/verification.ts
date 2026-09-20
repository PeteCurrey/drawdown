import type { NewsTrustTier, NewsVerificationStatus } from "./types.ts";

export interface VerificationEvidence {
  primarySource?: {
    name: string;
    url: string;
    publishedAt: string;
    claimText: string;
  };
  supportingSources: Array<{
    name: string;
    url: string;
    trustTier: NewsTrustTier;
    publishedAt: string;
    claimText: string;
  }>;
  confirmedFacts: string[];
  unconfirmedClaims: string[];
  contradictionsIdentified: string[];
  verificationTimestamp: string;
}

export class NewsVerificationService {
  /**
   * Evaluates the verification state of a news candidate based on primary and corroborating sources.
   * Primary sources (regulatory filings, official central bank releases, exchange disclosures, IR statements)
   * provide definitive factual verification.
   */
  static verifyEvent(params: {
    primarySourceUrl?: string;
    primarySourceName?: string;
    sources: Array<{
      name: string;
      url: string;
      trustTier: NewsTrustTier;
      claimText: string;
      publishedAt?: string;
    }>;
  }): {
    status: NewsVerificationStatus;
    evidence: VerificationEvidence;
  } {
    const timestamp = new Date().toISOString();
    const primary = params.sources.find(s => s.trustTier === 'tier_1_primary');
    const secondary = params.sources.filter(s => s.trustTier === 'tier_2_verified');
    const untrusted = params.sources.filter(s => s.trustTier === 'tier_4_untrusted');

    const confirmedFacts: string[] = [];
    const unconfirmedClaims: string[] = [];
    const contradictions: string[] = [];

    // 1. Primary source presence
    if (primary) {
      confirmedFacts.push(`Primary source (${primary.name}) confirmed core statement: "${primary.claimText}"`);
    } else if (secondary.length >= 2) {
      // Corroborated by at least 2 independent verified financial sources
      confirmedFacts.push(`Multiple Tier 2 publications (${secondary.map(s => s.name).join(', ')}) corroborate event.`);
    } else if (secondary.length === 1) {
      unconfirmedClaims.push(`Single secondary source reported claim without corroboration.`);
    }

    if (untrusted.length > 0) {
      unconfirmedClaims.push(`Unverified assertions detected in Tier 4 feeds (${untrusted.map(u => u.name).join(', ')}).`);
    }

    let status: NewsVerificationStatus = 'unverified';
    if (primary) {
      status = 'verified';
    } else if (secondary.length >= 2) {
      status = 'verified';
    } else if (secondary.length === 1) {
      status = 'partially_verified';
    } else {
      status = 'unverified';
    }

    const evidence: VerificationEvidence = {
      primarySource: primary ? {
        name: primary.name,
        url: primary.url,
        publishedAt: primary.publishedAt || timestamp,
        claimText: primary.claimText
      } : undefined,
      supportingSources: params.sources.map(s => ({
        name: s.name,
        url: s.url,
        trustTier: s.trustTier,
        publishedAt: s.publishedAt || timestamp,
        claimText: s.claimText
      })),
      confirmedFacts,
      unconfirmedClaims,
      contradictionsIdentified: contradictions,
      verificationTimestamp: timestamp
    };

    return { status, evidence };
  }
}
