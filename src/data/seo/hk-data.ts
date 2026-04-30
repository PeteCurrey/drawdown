export const HK_BROKERS = [
  {
    slug: 'ig-hong-kong',
    name: 'IG Hong Kong',
    regulation: 'SFC (Type 3)',
    badge: 'Best Overall',
    description: 'SFC-regulated powerhouse providing professional Hong Kong traders with access to global markets and deep liquidity.',
    pros: ['SFC Licensed', '17,000+ Markets', 'Local HK Support'],
    link: 'https://ig.com/hk'
  },
  {
    slug: 'saxo-markets-hong-kong',
    name: 'Saxo Markets',
    regulation: 'SFC',
    badge: 'Premium Choice',
    description: 'A top-tier investment bank platform offering extensive asset classes and professional-grade research for HK investors.',
    pros: ['Multi-asset leader', 'SFC Type 1, 2, 3', 'High-net-worth services'],
    link: 'https://home.saxo/en-hk'
  },
  {
    slug: 'interactive-brokers-hong-kong',
    name: 'Interactive Brokers',
    regulation: 'SFC',
    badge: 'Pro Trader Choice',
    description: 'The global standard for professional execution, providing HK traders with the lowest margin rates and direct market access.',
    pros: ['Lowest commissions', '150+ Markets', 'Robust API'],
    link: 'https://interactivebrokers.com.hk'
  },
  {
    slug: 'cmc-markets-hong-kong',
    name: 'CMC Markets',
    regulation: 'SFC',
    badge: 'Best for CFDs',
    description: 'SFC-regulated CFD provider featuring advanced charting and institutional-grade pricing on global indices and FX.',
    pros: ['Award-winning tech', 'Competitive spreads', 'Professional education'],
    link: 'https://cmcmarkets.com/en-hk'
  },
  {
    slug: 'oanda-hong-kong',
    name: 'OANDA',
    regulation: 'SFC',
    badge: 'Beginner Friendly',
    description: 'Specializing in forex education and reliable execution for Hong Kong retail traders. No minimum deposit.',
    pros: ['No minimum deposit', 'Superior UI', 'SFC Type 3 Licensed'],
    link: 'https://oanda.com/hk-en'
  }
];

export const BEST_OF_PAGES_HK = [
  'forex-broker-hong-kong', 'trading-platform-hong-kong', 'cfd-broker-hong-kong', 
  'broker-for-beginners-hong-kong', 'crypto-trading-hong-kong', 'trading-course-hong-kong', 
  'trading-app-hong-kong', 'prop-firm-hong-kong'
].map(slug => ({
  slug,
  title: `Best ${slug.replace(/-/g, ' ').toUpperCase()} 2026`,
  metaDescription: `Reviewing the top ${slug.replace(/-/g, ' ')} for HK traders.`
}));

export const HOW_TO_PAGES_HK = [
  'start-trading-hong-kong', 'trade-forex-hong-kong', 'choose-broker-hong-kong', 
  'trade-hsi', 'trading-tax-hong-kong', 'trade-us-stocks-from-hong-kong',
  'trade-asia-session', 'trade-during-london-from-asia'
].map(slug => ({
  slug,
  title: `How to ${slug.replace(/-/g, ' ').toUpperCase()}`,
  metaDescription: `Guide on ${slug.replace(/-/g, ' ')} for Hong Kong investors.`
}));

export const COMPARE_PAGES_HK = [
  'ig-vs-saxo-hong-kong', 'interactive-brokers-vs-saxo-hong-kong'
].map(slug => ({
  slug,
  title: `${slug.replace(/-/g, ' ').toUpperCase()} Comparison`,
  metaDescription: `Comparing top platforms in Hong Kong: ${slug.replace(/-/g, ' ')}.`
}));

export const HK_CITIES = ['Central', 'Tsim Sha Tsui', 'Causeway Bay', 'Wan Chai', 'Mong Kok'];
export const HK_TOPICS = ['forex', 'stocks', 'options', 'crypto'];

export const CITY_CONTEXT_HK: Record<string, string> = {
  'Central': 'the heart of the financial district',
  'Tsim Sha Tsui': 'a major retail and commercial hub',
  'Causeway Bay': 'one of the world\'s most vibrant shopping districts',
  'Wan Chai': 'a dynamic business and residential area',
  'Mong Kok': 'the highest population density area in HK'
};

export const TOPIC_DISPLAY_HK: Record<string, string> = {
  'forex': 'Foreign Exchange',
  'stocks': 'Equity Markets',
  'options': 'Derivative Options',
  'crypto': 'Digital Assets'
};
