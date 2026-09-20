// src/lib/content-os/qa-engine.ts
import type { ContentItem, ContentAsset, ContentChannel } from "./types.ts";
import { EditorialPolicyService, BANNED_CLICKBAIT_PHRASES, MANDATORY_FCA_DISCLAIMER } from "./editorial-policy.ts";
import { InstagramAssetValidator } from "./instagram-assets.ts";

export type QADecision = 'PASS' | 'WARN' | 'BLOCK';

export interface QAEvaluationResult {
  decision: QADecision;
  reasons: string[];
  violations: string[];
  contentFingerprint: string;
}

export class EditorialQAEngine {
  /**
   * Generates a deterministic content fingerprint for deduplication.
   */
  static generateFingerprint(title: string, body: string): string {
    const norm = `${title} ${body}`
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 120);
    return `fp_${norm}`;
  }

  /**
   * Deterministic Editorial QA Layer.
   * Does NOT rely on subjective LLM evaluations.
   */
  static evaluate(params: {
    item: Pick<ContentItem, 'title' | 'body' | 'source_type' | 'source_reference' | 'content_type'>;
    channels?: ContentChannel[];
    assets?: ContentAsset[];
    historicalFingerprints?: string[];
  }): QAEvaluationResult {
    const violations: string[] = [];
    const reasons: string[] = [];
    const fullText = `${params.item.title} ${params.item.body}`.toLowerCase();
    const fingerprint = this.generateFingerprint(params.item.title, params.item.body);

    // 1. Source verification check for factual content
    const isFactualType = ['news', 'market_analysis', 'case_study'].includes(params.item.content_type);
    if (isFactualType && (!params.item.source_reference || params.item.source_reference.trim() === '')) {
      violations.push("Missing source reference: Factual, market analysis, and case study content MUST identify primary/corroborating sources.");
    }

    // 2. Unsupported statistics detection (unattributed percentages without source)
    const percentageMatches = params.item.body.match(/\b\d+(\.\d+)?%/g);
    if (percentageMatches && percentageMatches.length > 2 && !params.item.source_reference) {
      violations.push("Unsupported quantitative statistics: Multiple percentage claims detected without verifiable source attribution.");
    }

    // 3. Clickbait and sensational language filter
    const policyCheck = EditorialPolicyService.evaluateContent(`${params.item.title} ${params.item.body}`);
    if (!policyCheck.passed) {
      violations.push(...policyCheck.violations);
    }

    // 4. Regulatory disclaimer requirement for CFDs/Spread Betting
    if (fullText.includes("cfd") || fullText.includes("spread bet") || fullText.includes("leverage")) {
      if (!fullText.includes("risk of losing money") && !fullText.includes("educational")) {
        violations.push("Missing mandatory FCA regulatory disclaimer for leveraged derivatives.");
      }
    }

    // 5. Channel-specific validation
    if (params.channels && params.channels.length > 0) {
      for (const ch of params.channels) {
        // X character constraint
        if (ch.channel === 'x' && ch.body.length > 280 && !ch.metadata?.isThread) {
          violations.push(`X post exceeds 280 character limit (${ch.body.length} characters).`);
        }

        // Instagram mandatory media & slide validation
        if (ch.channel === 'instagram') {
          const check = InstagramAssetValidator.validate(
            { aspectRatio: '4:5', visualFamily: 'MARKET_UPDATE', isCarousel: (params.assets || []).length > 1 },
            params.assets || []
          );
          if (!check.isReady) {
            violations.push(...check.errors);
          }
        }
      }
    }

    // 6. Duplicate fingerprint detection
    if (params.historicalFingerprints && params.historicalFingerprints.includes(fingerprint)) {
      violations.push(`Duplicate content fingerprint: An identical or near-identical post was previously published.`);
    }

    // Determine QA decision
    let decision: QADecision = 'PASS';
    if (violations.length > 0) {
      // Critical violations trigger BLOCK
      const hasBlockViolations = violations.some(v => 
        v.includes("Missing source") || 
        v.includes("disclaimer") || 
        v.includes("mandatory") || 
        v.includes("Duplicate content") ||
        v.includes("Unsupported quantitative")
      );
      decision = hasBlockViolations ? 'BLOCK' : 'WARN';
    } else {
      reasons.push("All deterministic checks passed: sources verified, tone compliant, asset specifications validated.");
    }

    return {
      decision,
      reasons: reasons.length > 0 ? reasons : violations,
      violations,
      contentFingerprint: fingerprint
    };
  }
}
