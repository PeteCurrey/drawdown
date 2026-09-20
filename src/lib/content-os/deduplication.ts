import type { NewsCandidate } from "./types";

/**
 * Normalises a URL by stripping tracking parameters, anchors, and trailing slashes.
 */
export function normaliseUrl(url: string): string {
  try {
    const parsed = new URL(url);
    // Strip tracking queries
    const paramsToStrip = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'ref', 'source', 'fbclid', 'gclid'];
    paramsToStrip.forEach(p => parsed.searchParams.delete(p));
    
    // Lowercase hostname, trim trailing slash from pathname
    let cleanPath = parsed.pathname.replace(/\/+$/, '');
    if (!cleanPath) cleanPath = '/';
    
    return `${parsed.protocol}//${parsed.hostname.toLowerCase()}${cleanPath}${parsed.search ? parsed.search : ''}`;
  } catch {
    return url.trim().toLowerCase().replace(/\/+$/, '');
  }
}

/**
 * Normalises a headline into a canonical token key.
 * Removes punctuation, stop words, and sorts essential semantic tokens.
 */
export function normaliseTitleTokens(title: string): string {
  const stopWords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
    'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
    'to', 'was', 'were', 'will', 'with'
  ]);

  const clean = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 0 && !stopWords.has(token));

  // Light financial stemming for identical action concepts (e.g. holds/held -> hold, steps/stepped -> step)
  const stemmed = clean.map(token => {
    if (token === 'holds' || token === 'held' || token === 'holding') return 'hold';
    if (token === 'steps' || token === 'stepped' || token === 'stepping') return 'step';
    if (token === 'cuts' || token === 'cutting') return 'cut';
    if (token === 'hikes' || token === 'hiked' || token === 'hiking') return 'hike';
    if (token === 'rises' || token === 'rising' || token === 'rose') return 'rise';
    if (token === 'falls' || token === 'falling' || token === 'fell') return 'fall';
    return token;
  });

  // Return sorted unique tokens
  return Array.from(new Set(stemmed)).sort().join(' ');
}

/**
 * Generates an event-level composite deduplication key.
 * If 10 sources report the same event (e.g., Warren Buffett stepping down),
 * they share the same key components:
 * `norm_tokens` + `primary_entity` + `approximate_time_bucket` (e.g. 48 hours).
 */
export function generateDuplicateKey(params: {
  url: string;
  title: string;
  entityReferences?: string[];
  publishedAt?: string | Date | null;
}): string {
  const tokens = normaliseTitleTokens(params.title);
  
  // 48-hour time window bucket
  const timestamp = params.publishedAt ? new Date(params.publishedAt).getTime() : Date.now();
  const bucketHours = 48;
  const timeBucket = Math.floor(timestamp / (bucketHours * 60 * 60 * 1000));

  // Sorted entity tags
  const entities = (params.entityReferences || [])
    .map(e => e.toLowerCase().trim())
    .sort()
    .slice(0, 3)
    .join(':');

  return `evt_${tokens.slice(0, 80)}_${entities || 'none'}_${timeBucket}`;
}

export interface DeduplicationResult {
  isDuplicate: boolean;
  duplicateKey: string;
  matchedCandidateId?: string;
  parentEventId?: string;
  reason?: string;
}

export class DeduplicationService {
  /**
   * Evaluates an incoming news item against existing candidates.
   * If a duplicate is identified, returns the matched candidate so secondary sources
   * can be attached to the existing event instead of spawning a new editorial candidate.
   */
  static evaluateDuplicate(
    incoming: {
      url: string;
      title: string;
      entityReferences?: string[];
      publishedAt?: string | null;
    },
    existingCandidates: Pick<NewsCandidate, 'id' | 'source_url' | 'title' | 'duplicate_key' | 'published_at'>[]
  ): DeduplicationResult {
    const normIncomingUrl = normaliseUrl(incoming.url);
    const incomingKey = generateDuplicateKey(incoming);
    const incomingTokens = new Set(normaliseTitleTokens(incoming.title).split(' '));

    for (const cand of existingCandidates) {
      // 1. Exact canonical URL match
      if (normaliseUrl(cand.source_url) === normIncomingUrl) {
        return {
          isDuplicate: true,
          duplicateKey: incomingKey,
          matchedCandidateId: cand.id,
          parentEventId: cand.id,
          reason: `Exact canonical URL match with candidate ${cand.id}`
        };
      }

      // 2. Duplicate key match (entity + token window)
      if (cand.duplicate_key === incomingKey) {
        return {
          isDuplicate: true,
          duplicateKey: incomingKey,
          matchedCandidateId: cand.id,
          parentEventId: cand.id,
          reason: `Composite event key collision with candidate ${cand.id}`
        };
      }

      // 3. High Jaccard token similarity (> 0.75) within 48h
      const candTokens = new Set(normaliseTitleTokens(cand.title).split(' '));
      const intersection = new Set([...incomingTokens].filter(x => candTokens.has(x)));
      const union = new Set([...incomingTokens, ...candTokens]);
      const jaccard = union.size > 0 ? intersection.size / union.size : 0;

      if (jaccard >= 0.75) {
        return {
          isDuplicate: true,
          duplicateKey: incomingKey,
          matchedCandidateId: cand.id,
          parentEventId: cand.id,
          reason: `High semantic title similarity (${Math.round(jaccard * 100)}%) with candidate ${cand.id}`
        };
      }
    }

    return {
      isDuplicate: false,
      duplicateKey: incomingKey
    };
  }
}
