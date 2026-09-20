// src/lib/social-engine.ts
// Distribution engine adapting canonical Lobby articles into tailored social formats

import type { LobbyArticle } from "../types/lobby";
import type { AdaptedSocialDrafts, SocialUtmParams } from "../types/social";
import { buildUtmUrl } from "./wire";
import { DRAWDOWN_TOOLS } from "./lobby-constants";

/**
 * Generates UTM parameters for a social post.
 */
export function generateSocialUtm(params: {
  articleSlug: string;
  channel: 'x' | 'linkedin' | 'instagram';
  campaign?: string;
}): SocialUtmParams {
  return {
    utm_source: params.channel,
    utm_medium: 'social',
    utm_campaign: params.campaign || 'lobby-distribution',
    utm_content: params.articleSlug
  };
}

/**
 * Maps an article's category or content to the most relevant Drawdown tool.
 */
export function resolveRelatedTool(article: LobbyArticle): { slug: string; name: string; href: string } | null {
  const toolSlug = (article.related_tools && article.related_tools[0]) || (article.related_tool_slugs && article.related_tool_slugs[0]);
  if (toolSlug) {
    const matched = DRAWDOWN_TOOLS[toolSlug];
    if (matched) return matched;
  }

  if (article.category === 'MARKETS' || article.category === 'MACRO') {
    return DRAWDOWN_TOOLS['forex-market-hours'];
  }
  if (article.category === 'TRADES') {
    return DRAWDOWN_TOOLS['position-size-calculator'];
  }
  if (article.category === 'BROKERS' || article.category === 'PROP FIRMS') {
    return DRAWDOWN_TOOLS['drawdown-recovery-calculator'];
  }
  return DRAWDOWN_TOOLS['signal-centre'];
}

/**
 * Adapts a canonical Lobby article into native drafts for X, LinkedIn, and Instagram.
 * Never creates detached content; always routes readers back to the canonical Lobby URL.
 */
export function adaptLobbyArticleToSocial(article: LobbyArticle): AdaptedSocialDrafts {
  const categorySlug = article.category.toLowerCase().replace(/\s+/g, '-');
  const path = `/lobby/${categorySlug}/${article.slug}`;

  const xLink = buildUtmUrl({
    path,
    source: 'x',
    medium: 'social',
    campaign: 'lobby-distribution',
    content: article.slug
  });

  const linkedinLink = buildUtmUrl({
    path,
    source: 'linkedin',
    medium: 'social',
    campaign: 'lobby-distribution',
    content: article.slug
  });

  const tool = resolveRelatedTool(article);
  const toolMention = tool ? `Audit your risk with Drawdown's ${tool.name}: https://drawdown.trading${tool.href}` : undefined;

  // ─── 1. X (TWITTER) ─────────────────────────────────────────────────────────
  const xHook = `// DRAWDOWN LOBBY // ${article.category}\n\n${article.title}`;
  const xBullets = [
    `• ${article.excerpt || 'Key industry shift impacting market participants.'}`,
    `• Verified source: ${article.primary_source_name || 'Drawdown Desk'}`,
    `• Why it matters: Risk distribution and execution impact across ${article.category.toLowerCase()}.`
  ];
  const xFullPost = `${xHook}\n\n${xBullets.join('\n')}\n\nRead the full report on The Lobby:\n${xLink}${toolMention ? `\n\n${toolMention}` : ''}`;

  // ─── 2. LINKEDIN ───────────────────────────────────────────────────────────
  const linkedinTitle = `Market Intelligence: ${article.title}`;
  const linkedinCommentary = article.excerpt || article.title;
  const linkedinTakeaway = `In institutional and retail trading, information asymmetry creates unpriced downside. Understanding developments in ${article.category.toLowerCase()} is essential for active risk managers.`;
  const linkedinPrompt = `How is your desk or trading strategy adjusting to these developments in ${article.category.toLowerCase()}?`;
  
  const linkedinFullPost = `${linkedinTitle}\n\n${linkedinCommentary}\n\n${linkedinTakeaway}\n\n${linkedinPrompt}\n\nRead the canonical breakdown on Drawdown's Lobby:\n${linkedinLink}${toolMention ? `\n\n${toolMention}` : ''}`;

  // ─── 3. INSTAGRAM ──────────────────────────────────────────────────────────
  const hookSlide = `THE LOBBY\n${article.category}\n\n${article.title}`;
  const slides = [
    hookSlide,
    `THE CONTEXT\n\n${article.excerpt || 'Significant shift observed in market infrastructure.'}`,
    `THE DATA\n\nPrimary Source: ${article.primary_source_name || 'Drawdown Editorial'}\nConfidence: ${article.confidence || article.data_confidence || 'VERIFIED'}`,
    `THE TAKEAWAY\n\nHow traders can manage exposure and capitalise on volatility.`
  ];
  const igCaption = `${article.title}\n\n${article.excerpt || ''}\n\nFull analysis, data breakdowns and trade calculations are live on The Lobby.\n\n🔗 Link in bio to read full report.\n\n#trading #markets #riskmanagement #drawdown #propfirm #forex`;

  return {
    x: {
      hook: xHook,
      body: article.excerpt || '',
      bullets: xBullets,
      link: xLink,
      toolCallout: toolMention,
      fullPost: xFullPost
    },
    linkedin: {
      title: linkedinTitle,
      commentary: linkedinCommentary,
      takeaway: linkedinTakeaway,
      discussionPrompt: linkedinPrompt,
      link: linkedinLink,
      toolRecommendation: toolMention,
      fullPost: linkedinFullPost
    },
    instagram: {
      hookSlide,
      slides,
      caption: igCaption,
      hashtags: ['#trading', '#markets', '#riskmanagement', '#drawdown', '#propfirm', '#forex'],
      cta: 'Link in bio to read full report in The Lobby'
    }
  };
}
