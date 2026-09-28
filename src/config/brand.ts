/**
 * Avorria Trading — Central Brand Configuration
 *
 * Single source of truth for all brand identity values.
 * Import from this file rather than hardcoding brand strings anywhere else.
 *
 * DO NOT rename financial trading terms (drawdown, max_drawdown_type, etc.)
 * even if they contain the word "drawdown" — those are financial concepts, not brand identifiers.
 */

export const BRAND_CONFIG = {
  name: "Avorria",
  productName: "Avorria Trading",
  shortName: "Avorria",
  legalEntity: "Black & Rowan Management Group Limited",
  fullTradingEntity: "Black & Rowan Management Group Limited t/a Avorria Trading",

  tagline: "Professional Market Intelligence & Quantitative Trading Tools",
  coreProposition: "Professional market intelligence, trading tools and actionable market analysis.",

  domain: "https://avorria.com",
  canonicalHost: "avorria.com",

  founder: {
    name: "Pete Currey",
    role: "Founder, Avorria Trading",
    bio: "Founder, Avorria Trading. Trading live since 2016.",
    url: "https://avorria.com/about",
    image: "https://avorria.com/images/pete.jpg",
  },

  emails: {
    support: "support@avorria.com",
    privacy: "privacy@avorria.com",
    legal: "legal@avorria.com",
    complaints: "complaints@avorria.com",
    security: "security@avorria.com",
    theWire: "thewire@avorria.com",
    alerts: "alerts@avorria.com",
    news: "news@avorria.com",
    fromName: "Avorria Trading",
    fromAddress: "Avorria Trading <noreply@avorria.com>",
    peteFromAddress: "Pete Currey — Avorria Trading <thewire@avorria.com>",
  },

  social: {
    twitter: "https://x.com/avorriatrading",
    twitterHandle: "@avorriatrading",
    discord: "https://discord.gg/avorria",
    youtube: "https://youtube.com/@avorriatrading",
  },

  assets: {
    logo: "/brand/logo.svg",
    logoWhite: "/brand/logo-white.svg",
    mark: "/brand/mark.svg",
    favicon: "/favicon.png",
    ogImage: "/og/default-og.png",
    legacyLogo: "/assets/brand/logo.png",
  },
} as const;

export type BrandConfig = typeof BRAND_CONFIG;
