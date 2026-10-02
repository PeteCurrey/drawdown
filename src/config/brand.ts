/**
 * Drawdown Trading — Central Brand Configuration
 *
 * Single source of truth for all brand identity values.
 * Import from this file rather than hardcoding brand strings anywhere else.
 *
 * DO NOT rename financial trading terms (drawdown, max_drawdown_type, etc.)
 * even if they contain the word "drawdown" — those are financial concepts, not brand identifiers.
 */

export const BRAND_CONFIG = {
  name: "Drawdown",
  productName: "Drawdown Trading",
  shortName: "Drawdown",
  legalEntity: "Black & Rowan Management Group Limited",
  fullTradingEntity: "Black & Rowan Management Group Limited t/a Drawdown Trading",

  tagline: "Professional Market Intelligence & Quantitative Trading Tools",
  coreProposition: "Professional market intelligence, trading tools and actionable market analysis.",

  domain: "https://drawdown.trading",
  canonicalHost: "drawdown.trading",

  founder: {
    name: "Pete Currey",
    role: "Founder, Drawdown Trading",
    bio: "Founder, Drawdown Trading. Trading live since 2016.",
    url: "https://drawdown.trading/about",
    image: "https://drawdown.trading/images/pete.jpg",
  },

  emails: {
    support: "support@drawdown.trading",
    privacy: "privacy@drawdown.trading",
    legal: "legal@drawdown.trading",
    complaints: "complaints@drawdown.trading",
    security: "security@drawdown.trading",
    theWire: "thewire@drawdown.trading",
    alerts: "alerts@drawdown.trading",
    news: "news@drawdown.trading",
    fromName: "Drawdown Trading",
    fromAddress: "Drawdown Trading <noreply@drawdown.trading>",
    peteFromAddress: "Pete Currey — Drawdown Trading <thewire@drawdown.trading>",
  },

  social: {
    twitter: "https://x.com/drawdowntrading",
    twitterHandle: "@drawdowntrading",
    discord: "https://discord.gg/drawdown",
    youtube: "https://youtube.com/@drawdowntrading",
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
