import { MARKETS_CONFIG, MarketInstrument } from "./markets-config";
import { GLOSSARY_TERMS, GlossaryTerm } from "@/data/seo/glossary";
import { HOW_TO_PAGES, HowToPage } from "@/data/seo/howto";
import { COMPARISON_PAGES, ComparisonPage } from "@/data/seo/compare";

export type PageCategory = 
  | 'forex' 
  | 'commodities' 
  | 'indices' 
  | 'crypto' 
  | 'shares' 
  | 'risk' 
  | 'psychology' 
  | 'tools' 
  | 'brokers'
  | 'basics'
  | 'technical';

export interface ContentNode {
  slug: string;
  title: string;
  category: PageCategory;
  pageType: 'market' | 'glossary' | 'how-to' | 'compare';
  url: string;
}

// Explicit override mapping for slugs that don't match standard keyword resolution
const EXPLICIT_CATEGORY_MAPPING: Record<string, PageCategory> = {
  'pip': 'forex',
  'spread': 'forex',
  'lot-size': 'forex',
  'leverage': 'forex',
  'margin': 'forex',
  'slippage': 'forex',
  'bid-ask-spread': 'forex',
  'swap-rates': 'forex',
  'cfd': 'brokers',
  'spread-betting': 'brokers',
  'fca-regulation': 'brokers',
  'drawdown': 'risk',
  'stop-loss': 'risk',
  'take-profit': 'risk',
  'risk-reward-ratio': 'risk',
  'position-sizing': 'risk',
  'trading-psychology': 'psychology',
  'fomo': 'psychology',
  'overtrading': 'psychology',
  'revenge-trading': 'psychology',
  'use-tradingview': 'tools',
  'start-trading-uk': 'basics',
  'trade-forex': 'forex',
  'spread-betting-vs-cfds': 'brokers',
  'ig-vs-pepperstone': 'brokers',
  'ig-vs-cmc': 'brokers',
  'day-trading-vs-swing-trading': 'psychology',
  'forex-vs-stocks': 'basics',
  'trading-vs-investing': 'basics',
  'technical-vs-fundamental': 'basics',
};

/**
 * Resolves the primary category of any slug based on content type and keywords.
 */
export function getCategoryForNode(slug: string, pageType: 'market' | 'glossary' | 'how-to' | 'compare'): PageCategory {
  const normSlug = slug.toLowerCase();
  
  if (EXPLICIT_CATEGORY_MAPPING[normSlug]) {
    return EXPLICIT_CATEGORY_MAPPING[normSlug];
  }

  if (pageType === 'market') {
    const inst = MARKETS_CONFIG.find(m => m.slug === slug);
    if (inst) return inst.category as PageCategory;
  }

  // Keyword rules
  if (normSlug.includes('risk') || normSlug.includes('stop') || normSlug.includes('size') || normSlug.includes('calculator') || normSlug.includes('exposure') || normSlug.includes('loss')) {
    return 'risk';
  }
  if (normSlug.includes('psych') || normSlug.includes('emotion') || normSlug.includes('mindset') || normSlug.includes('discipline') || normSlug.includes('bias') || normSlug.includes('fomo')) {
    return 'psychology';
  }
  if (normSlug.includes('chart') || normSlug.includes('rsi') || normSlug.includes('macd') || normSlug.includes('ema') || normSlug.includes('indicator') || normSlug.includes('level') || normSlug.includes('support') || normSlug.includes('resistance')) {
    return 'technical';
  }
  if (normSlug.includes('broker') || normSlug.includes('vs') || normSlug.includes('pepperstone') || normSlug.includes('review') || normSlug.includes('spread-bet')) {
    return 'brokers';
  }
  if (normSlug.includes('crypto') || normSlug.includes('bitcoin') || normSlug.includes('ethereum')) {
    return 'crypto';
  }
  if (normSlug.includes('gold') || normSlug.includes('silver') || normSlug.includes('oil') || normSlug.includes('commodity')) {
    return 'commodities';
  }
  if (normSlug.includes('index') || normSlug.includes('sp500') || normSlug.includes('nasdaq') || normSlug.includes('ftse')) {
    return 'indices';
  }

  return 'basics';
}

/**
 * Resolves URL for a page type
 */
export function getUrlForNode(slug: string, pageType: 'market' | 'glossary' | 'how-to' | 'compare'): string {
  if (pageType === 'market') {
    const inst = MARKETS_CONFIG.find(m => m.slug === slug);
    return `/markets/${inst?.category || 'forex'}/${slug}`;
  }
  return `/${pageType}/${slug}`;
}

/**
 * Gets the entire list of content nodes.
 */
export function getAllContentNodes(): ContentNode[] {
  const nodes: ContentNode[] = [];

  // Add Markets
  MARKETS_CONFIG.forEach(m => {
    nodes.push({
      slug: m.slug,
      title: m.displayPair,
      category: m.category as PageCategory,
      pageType: 'market',
      url: `/markets/${m.category}/${m.slug}`
    });
  });

  // Add Glossary
  GLOSSARY_TERMS.forEach(g => {
    nodes.push({
      slug: g.slug,
      title: g.term,
      category: getCategoryForNode(g.slug, 'glossary'),
      pageType: 'glossary',
      url: `/glossary/${g.slug}`
    });
  });

  // Add How-Tos
  HOW_TO_PAGES.forEach(h => {
    nodes.push({
      slug: h.slug,
      title: h.title,
      category: getCategoryForNode(h.slug, 'how-to'),
      pageType: 'how-to',
      url: `/how-to/${h.slug}`
    });
  });

  // Add Comparisons
  COMPARISON_PAGES.forEach(c => {
    nodes.push({
      slug: c.slug,
      title: c.title,
      category: getCategoryForNode(c.slug, 'compare'),
      pageType: 'compare',
      url: `/compare/${c.slug}`
    });
  });

  return nodes;
}

/**
 * Resolves related glossary terms dynamically
 */
export function getRelatedGlossaryTerms(category: PageCategory, currentSlug: string, limit = 4): GlossaryTerm[] {
  const currentTerm = GLOSSARY_TERMS.find(g => g.slug === currentSlug);
  
  if (currentTerm && currentTerm.relatedTerms && currentTerm.relatedTerms.length > 0) {
    const explicitTerms = currentTerm.relatedTerms
      .map(termName => GLOSSARY_TERMS.find(g => g.term.toLowerCase() === termName.toLowerCase() || g.slug === termName.toLowerCase().replace(/ /g, '-')))
      .filter((t): t is GlossaryTerm => !!t && t.slug !== currentSlug);
    
    if (explicitTerms.length >= limit) return explicitTerms.slice(0, limit);
    
    const siblingTerms = GLOSSARY_TERMS.filter(g => {
      if (g.slug === currentSlug) return false;
      if (explicitTerms.some(et => et.slug === g.slug)) return false;
      return getCategoryForNode(g.slug, 'glossary') === category;
    });

    return [...explicitTerms, ...siblingTerms].slice(0, limit);
  }

  return GLOSSARY_TERMS.filter(g => {
    if (g.slug === currentSlug) return false;
    return getCategoryForNode(g.slug, 'glossary') === category || category === 'basics';
  }).slice(0, limit);
}

/**
 * Resolves related how-to guides dynamically
 */
export function getRelatedHowToGuides(category: PageCategory, currentSlug: string, limit = 3): HowToPage[] {
  const matches = HOW_TO_PAGES.filter(h => {
    if (h.slug === currentSlug) return false;
    const cat = getCategoryForNode(h.slug, 'how-to');
    return cat === category || cat === 'basics';
  });

  if (matches.length > 0) {
    return matches.slice(0, limit);
  }

  return HOW_TO_PAGES.filter(h => h.slug !== currentSlug).slice(0, limit);
}

/**
 * Resolves related market instruments dynamically
 */
export function getRelatedInstruments(category: PageCategory, currentSlug: string, limit = 3): MarketInstrument[] {
  const currentInst = MARKETS_CONFIG.find(m => m.slug === currentSlug);

  if (currentInst && currentInst.relatedSlugs && currentInst.relatedSlugs.length > 0) {
    const explicit = currentInst.relatedSlugs
      .map(s => MARKETS_CONFIG.find(m => m.slug === s))
      .filter((m): m is MarketInstrument => !!m && m.slug !== currentSlug);

    if (explicit.length >= limit) return explicit.slice(0, limit);

    const siblings = MARKETS_CONFIG.filter(m => {
      if (m.slug === currentSlug) return false;
      if (explicit.some(e => e.slug === m.slug)) return false;
      return m.category === currentInst.category;
    });

    return [...explicit, ...siblings].slice(0, limit);
  }

  return MARKETS_CONFIG.filter(m => {
    if (m.slug === currentSlug) return false;
    return m.category === category || category === 'basics';
  }).slice(0, limit);
}

/**
 * Resolves related comparison pages dynamically
 */
export function getRelatedComparisons(category: PageCategory, currentSlug: string, limit = 3): ComparisonPage[] {
  const matches = COMPARISON_PAGES.filter(c => {
    if (c.slug === currentSlug) return false;
    const cat = getCategoryForNode(c.slug, 'compare');
    return cat === category || cat === 'brokers';
  });

  if (matches.length > 0) {
    return matches.slice(0, limit);
  }

  return COMPARISON_PAGES.filter(c => c.slug !== currentSlug).slice(0, limit);
}
