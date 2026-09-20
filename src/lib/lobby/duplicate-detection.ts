// src/lib/lobby/duplicate-detection.ts
// Duplicate detection engine for Lobby articles and news events

/**
 * Normalises a headline into alphanumeric tokens for similarity comparison.
 */
export function tokeniseTitle(title: string): Set<string> {
  const stopWords = new Set([
    "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", 
    "with", "by", "about", "against", "between", "into", "through", "during",
    "before", "after", "above", "below", "from", "up", "down", "is", "are", 
    "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did"
  ]);

  return new Set(
    title
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter(t => t.length > 2 && !stopWords.has(t))
  );
}

/**
 * Calculates token Jaccard similarity between two headlines (0.0 to 1.0).
 */
export function calculateTitleSimilarity(titleA: string, titleB: string): number {
  const tokensA = tokeniseTitle(titleA);
  const tokensB = tokeniseTitle(titleB);

  if (tokensA.size === 0 || tokensB.size === 0) return 0.0;

  let intersectionCount = 0;
  for (const token of tokensA) {
    if (tokensB.has(token)) {
      intersectionCount++;
    }
  }

  const unionSize = new Set([...tokensA, ...tokensB]).size;
  return unionSize === 0 ? 0.0 : intersectionCount / unionSize;
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  similarityScore: number;
  matchedArticleId?: string;
  matchedTitle?: string;
  reason?: string;
}

/**
 * Checks an incoming candidate title and slug against existing articles.
 */
export function detectDuplicateArticle(
  candidateTitle: string,
  candidateSlug: string,
  existingArticles: Array<{ id: string; title: string; slug: string }>,
  similarityThreshold: number = 0.65
): DuplicateCheckResult {
  // 1. Exact Slug Match
  const slugMatch = existingArticles.find(
    a => a.slug.toLowerCase() === candidateSlug.toLowerCase()
  );
  if (slugMatch) {
    return {
      isDuplicate: true,
      similarityScore: 1.0,
      matchedArticleId: slugMatch.id,
      matchedTitle: slugMatch.title,
      reason: `Exact slug conflict with existing article "${slugMatch.title}"`
    };
  }

  // 2. High Title Similarity Match
  let maxSimilarity = 0.0;
  let mostSimilarArticle: { id: string; title: string } | null = null;

  for (const existing of existingArticles) {
    const similarity = calculateTitleSimilarity(candidateTitle, existing.title);
    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
      mostSimilarArticle = existing;
    }
  }

  if (maxSimilarity >= similarityThreshold && mostSimilarArticle) {
    return {
      isDuplicate: true,
      similarityScore: Number(maxSimilarity.toFixed(2)),
      matchedArticleId: mostSimilarArticle.id,
      matchedTitle: mostSimilarArticle.title,
      reason: `Title has ${(maxSimilarity * 100).toFixed(0)}% keyword overlap with "${mostSimilarArticle.title}"`
    };
  }

  return {
    isDuplicate: false,
    similarityScore: Number(maxSimilarity.toFixed(2)),
    matchedArticleId: mostSimilarArticle?.id,
    matchedTitle: mostSimilarArticle?.title
  };
}
