// src/lib/lobby/guardrails.ts
// Content quality guardrails for The Lobby publishing workflow

import type { LobbyArticle, LobbySource } from "../../types/lobby";

export interface GuardrailValidationResult {
  isValid: boolean;
  canPublish: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates an article before allowing publication.
 * Drafts can be saved with incomplete fields, but publishing strictly requires compliance.
 */
export function validateLobbyArticleGuardrails(
  article: Partial<LobbyArticle>,
  targetStatus: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED' = 'PUBLISHED'
): GuardrailValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Basic Structural Integrity
  if (!article.title || article.title.trim().length < 5) {
    errors.push("Title is required and must be at least 5 characters long.");
  }

  if (!article.slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug)) {
    errors.push("Slug must be URL-safe (lowercase alphanumeric with single hyphens).");
  }

  if (!article.category) {
    errors.push("Category must be selected from the 12 controlled categories.");
  }

  if (!article.article_type) {
    errors.push("Structured Article Type must be specified.");
  }

  // 2. Strict Rules when attempting to PUBLISH
  if (targetStatus === 'PUBLISHED') {
    if (!article.excerpt || article.excerpt.trim().length < 20) {
      errors.push("Publication requires a substantive deck/excerpt (minimum 20 characters).");
    }

    if (!article.body || article.body.trim().length < 100) {
      errors.push("Publication requires substantive article content (minimum 100 characters).");
    }

    // Source verification guardrail:
    // Non-opinion/non-explainer news and updates MUST have at least one verified source.
    const requiresVerifiedSource = [
      'NEWS', 
      'BROKER WATCH', 
      'PROP FIRM WATCH', 
      'INDUSTRY UPDATE', 
      'PLATFORM SPOTLIGHT'
    ].includes(article.article_type || '');

    const sources: LobbySource[] = Array.isArray(article.sources) ? article.sources : [];

    if (requiresVerifiedSource && sources.length === 0 && !article.primary_source_url) {
      errors.push(
        `Articles of type '${article.article_type}' require at least one verified external or regulatory source citation before publication.`
      );
    }

    // Validate provided sources have URLs and names
    sources.forEach((source, index) => {
      if (!source.name || source.name.trim().length === 0) {
        errors.push(`Source #${index + 1} is missing a source name.`);
      }
      if (!source.url || !isValidHttpUrl(source.url)) {
        errors.push(`Source #${index + 1} (${source.name || 'Unnamed'}) must provide a valid HTTP/HTTPS URL.`);
      }
    });

    // Confidence guardrail: Never publish UNKNOWN confidence as factual editorial
    if (article.confidence === 'UNKNOWN') {
      errors.push("Articles marked with 'UNKNOWN' data confidence cannot be published publicly.");
    }

    // SEO guardrails
    if (!article.meta_description && (!article.excerpt || article.excerpt.length < 10)) {
      warnings.push("No dedicated SEO meta description provided; using excerpt as fallback.");
    }
  }

  // Soft warnings for drafts/review
  if (targetStatus === 'REVIEW' || targetStatus === 'DRAFT') {
    if (!article.hero_image_url) {
      warnings.push("No hero image attached; will use broadsheet typographic fallback.");
    }
    if (!article.related_tool_slugs || article.related_tool_slugs.length === 0) {
      warnings.push("No Drawdown tools linked. Consider linking related calculators where applicable.");
    }
  }

  return {
    isValid: errors.length === 0,
    canPublish: errors.length === 0,
    errors,
    warnings,
  };
}

function isValidHttpUrl(string: string): boolean {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
}
