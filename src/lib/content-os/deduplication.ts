import type { NewsCandidate } from "./types.ts";

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
  isCorroboratingAttention?: boolean;
  matchedEntity?: string;
}

export class DeduplicationService {
  /**
   * Evaluates an incoming news or social item against existing candidates.
   * If a duplicate is identified, returns the matched candidate so secondary sources
   * can be attached to the existing event instead of spawning a new editorial candidate.
   * Also identifies cross-source discussions referring to the same underlying entity.
   */
  static evaluateDuplicate(
    incoming: {
      url: string;
      title: string;
      platformPostId?: string | null;
      entityReferences?: string[];
      publishedAt?: string | null;
    },
    existingCandidates: Array<Pick<NewsCandidate, 'id' | 'source_url' | 'title' | 'duplicate_key' | 'published_at'> & {
      platform_post_id?: string | null;
      entity_references?: string[];
    }>
  ): DeduplicationResult {
    const normIncomingUrl = normaliseUrl(incoming.url);
    const incomingKey = generateDuplicateKey(incoming);
    const incomingTokens = new Set(normaliseTitleTokens(incoming.title).split(' '));
    const incomingTimestamp = incoming.publishedAt ? new Date(incoming.publishedAt).getTime() : Date.now();

    let relatedEntityMatch: { candidateId: string; entity: string } | null = null;

    for (const cand of existingCandidates) {
      // 1. Exact platform external post ID match (e.g. tweet ID, bluesky post ID)
      if (incoming.platformPostId && cand.platform_post_id && incoming.platformPostId === cand.platform_post_id) {
        return {
          isDuplicate: true,
          duplicateKey: incomingKey,
          matchedCandidateId: cand.id,
          parentEventId: cand.id,
          reason: `Exact platform post ID collision (${incoming.platformPostId}) with candidate ${cand.id}`
        };
      }

      // 2. Exact canonical URL match
      if (normaliseUrl(cand.source_url) === normIncomingUrl) {
        return {
          isDuplicate: true,
          duplicateKey: incomingKey,
          matchedCandidateId: cand.id,
          parentEventId: cand.id,
          reason: `Exact canonical URL match with candidate ${cand.id}`
        };
      }

      // 3. Duplicate key match (entity + token window)
      if (cand.duplicate_key === incomingKey) {
        return {
          isDuplicate: true,
          duplicateKey: incomingKey,
          matchedCandidateId: cand.id,
          parentEventId: cand.id,
          reason: `Composite event key collision with candidate ${cand.id}`
        };
      }

      // 4. High Jaccard token similarity (> 0.75) within 48h
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

      // 5. Cross-source entity correlation within 24 hours:
      // If incoming discusses the same specific entity as an existing recent candidate,
      // record it so secondary sources can link to the parent event.
      if (!relatedEntityMatch && incoming.entityReferences && incoming.entityReferences.length > 0) {
        const candEntities = cand.entity_references || [];
        const sharedEntities = incoming.entityReferences.filter(e => 
          e && e.length > 2 && candEntities.some(ce => ce.toLowerCase() === e.toLowerCase())
        );

        if (sharedEntities.length > 0 && cand.published_at) {
          const candTimestamp = new Date(cand.published_at).getTime();
          const ageDiffHours = Math.abs(incomingTimestamp - candTimestamp) / (1000 * 60 * 60);

          if (ageDiffHours <= 24) {
            relatedEntityMatch = {
              candidateId: cand.id,
              entity: sharedEntities[0]
            };
          }
        }
      }
    }

    if (relatedEntityMatch) {
      return {
        isDuplicate: false, // Not a duplicate post, but a corroborating attention item
        duplicateKey: incomingKey,
        parentEventId: relatedEntityMatch.candidateId,
        isCorroboratingAttention: true,
        matchedEntity: relatedEntityMatch.entity,
        reason: `Associated with active entity ${relatedEntityMatch.entity} from candidate ${relatedEntityMatch.candidateId}`
      };
    }

    return {
      isDuplicate: false,
      duplicateKey: incomingKey
    };
  }
}
