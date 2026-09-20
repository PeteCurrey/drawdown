// src/lib/content-os/attribution.ts

export interface AttributionRecord {
  contentId: string;
  channel: string;
  impressions: number;
  clicks: number;
  sessions: number;
  toolUsages: number;
  leads: number;
  paidConversions: number;
  attributedRevenuePence: number;
}

export interface DerivedPerformanceMetrics {
  engagementRatePercent: number | null;
  clickThroughRatePercent: number | null;
  conversionRatePercent: number | null;
  revenuePerPostGbp: number;
  hasSufficientSampleSize: boolean;
}

export class AttributionEngine {
  /**
   * Calculates derived performance metrics with Bayesian safeguards.
   * Prevents 1 click / 1 conversion from reporting false 100% conversion superiority.
   */
  static calculateDerivedMetrics(record: AttributionRecord): DerivedPerformanceMetrics {
    const MIN_SAMPLE_IMPRESSIONS = 100;
    const MIN_SAMPLE_CLICKS = 10;

    const hasSufficientSample = record.impressions >= MIN_SAMPLE_IMPRESSIONS || record.clicks >= MIN_SAMPLE_CLICKS;

    const ctr = record.impressions > 0 
      ? Number(((record.clicks / record.impressions) * 100).toFixed(2)) 
      : null;

    const conversionRate = record.sessions > 0
      ? Number(((record.paidConversions / record.sessions) * 100).toFixed(2))
      : null;

    const revenueGbp = record.attributedRevenuePence / 100;

    return {
      engagementRatePercent: null, // Populated when social likes/comments available
      clickThroughRatePercent: hasSufficientSample ? ctr : null,
      conversionRatePercent: hasSufficientSample ? conversionRate : null,
      revenuePerPostGbp: revenueGbp,
      hasSufficientSampleSize: hasSufficientSample
    };
  }

  /**
   * Evaluates topic fatigue based on recent frequency.
   */
  static detectFatigue(recentTopics: string[]): { hasFatigue: boolean; warnings: string[] } {
    const warnings: string[] = [];
    const counts = new Map<string, number>();

    recentTopics.forEach(t => {
      const norm = t.toLowerCase().trim();
      counts.set(norm, (counts.get(norm) || 0) + 1);
    });

    // Check 1: Exact topic frequency
    counts.forEach((count, topic) => {
      const percentage = (count / recentTopics.length) * 100;
      if (percentage >= 30 && recentTopics.length >= 6) {
        warnings.push(`Content Fatigue Warning: '${topic}' accounts for ${Math.round(percentage)}% of recent output. Consider broader asset or topic coverage.`);
      }
    });

    // Check 2: Major asset / instrument over-exposure (e.g. Bitcoin, Gold, GBP)
    const trackedAssets = ['bitcoin', 'gold', 'oil', 'ethereum', 'sp500'];
    trackedAssets.forEach(asset => {
      const matches = recentTopics.filter(t => t.toLowerCase().includes(asset)).length;
      const percentage = (matches / recentTopics.length) * 100;
      if (percentage >= 30 && recentTopics.length >= 5) {
        warnings.push(`Content Fatigue Warning: ${asset.toUpperCase()}-related posts represent ${Math.round(percentage)}% of recent output. Consider broader asset coverage.`);
      }
    });

    return {
      hasFatigue: warnings.length > 0,
      warnings
    };
  }
}
