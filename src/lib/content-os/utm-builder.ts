// src/lib/content-os/utm-builder.ts

export interface UTMParams {
  source: string;     // e.g. 'instagram', 'x', 'linkedin', 'threads'
  medium?: string;    // defaults to 'social'
  campaign: string;   // e.g. 'drawdown-101', 'market-history', 'daily-pulse'
  content: string;    // unique content identifier / slug
}

export class UTMBuilder {
  /**
   * Generates deterministic, traceable Drawdown UTM links.
   * Format: https://drawdown.trading/[path]?utm_source=[source]&utm_medium=social&utm_campaign=[series]&utm_content=[id]
   */
  static buildUrl(baseDestination: string, params: UTMParams): string {
    const cleanBase = baseDestination.trim();
    let url: URL;

    try {
      url = new URL(cleanBase.startsWith('http') ? cleanBase : `https://drawdown.trading${cleanBase.startsWith('/') ? cleanBase : `/${cleanBase}`}`);
    } catch {
      url = new URL(`https://drawdown.trading/`);
    }

    url.searchParams.set('utm_source', params.source.toLowerCase().trim());
    url.searchParams.set('utm_medium', (params.medium || 'social').toLowerCase().trim());
    url.searchParams.set('utm_campaign', params.campaign.toLowerCase().replace(/[^a-z0-9_-]/g, '-'));
    url.searchParams.set('utm_content', params.content.toLowerCase().replace(/[^a-z0-9_-]/g, '-'));

    return url.toString();
  }
}
