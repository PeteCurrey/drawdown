// src/types/social.ts
// Distribution engine types for social channels (X, LinkedIn, Instagram)

export type SocialChannel = 'X' | 'LINKEDIN' | 'INSTAGRAM';

export type SocialPostStatus = 'DRAFT' | 'READY_FOR_REVIEW' | 'APPROVED' | 'SCHEDULED' | 'PUBLISHED';

export interface SocialUtmParams {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
}

export interface SocialPost {
  id: string;
  article_id: string;
  channel: SocialChannel;
  content_text: string;
  media_urls: string[];
  status: SocialPostStatus;
  scheduled_for?: string | null;
  utm_params: SocialUtmParams;
  created_at: string;
  updated_at: string;
}

export interface AdaptedSocialDrafts {
  x: {
    hook: string;
    body: string;
    bullets: string[];
    link: string;
    toolCallout?: string;
    fullPost: string;
  };
  linkedin: {
    title: string;
    commentary: string;
    takeaway: string;
    discussionPrompt: string;
    link: string;
    toolRecommendation?: string;
    fullPost: string;
  };
  instagram: {
    hookSlide: string;
    slides: string[];
    caption: string;
    hashtags: string[];
    cta: string;
  };
}
