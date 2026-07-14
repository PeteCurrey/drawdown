export const SG_BROKERS = [
  {
    slug: 'ig-singapore',
    name: 'IG Singapore',
    regulation: 'MAS',
    badge: 'Best Overall',
    description: 'MAS-regulated market leader offering 17,000+ markets with world-class technology and deep liquidity.',
    pros: ['MAS Regulated', '17,000+ Markets', 'Premium Academy'],
    link: '/go/ig-markets'
  },
  {
    slug: 'saxo-markets-singapore',
    name: 'Saxo Markets',
    regulation: 'MAS',
    badge: 'Best Multi-Asset',
    description: 'A premium Danish investment bank with a massive Singapore presence. Best for sophisticated multi-asset traders.',
    pros: ['Professional-grade', '70,000+ instruments', 'VIP services'],
    link: 'https://home.saxo/en-sg'
  },
  {
    slug: 'cmc-markets-singapore',
    name: 'CMC Markets',
    regulation: 'MAS',
    badge: 'Best Platform',
    description: 'Offering the proprietary Next Generation platform with advanced charting and professional-grade features.',
    pros: ['Award-winning tech', 'Competitive spreads', '1Join Drawdown Free CFDs'],
    link: '/go/cmc-markets'
  },
  {
    slug: 'plus500-singapore',
    name: 'Plus500',
    regulation: 'MAS',
    badge: 'Most Intuitive',
    description: 'A publicly-listed CFD provider focused on a simple, intuitive user experience for retail traders.',
    pros: ['Clean interface', 'No commissions', 'Reliable mobile app'],
    link: '/go/plus500'
  },
  {
    slug: 'oanda-singapore',
    name: 'OANDA',
    regulation: 'MAS',
    badge: 'Best for Beginners',
    description: 'Renowned for transparency and ease of use. No minimum deposit and exceptional TradingView integration.',
    pros: ['No minimum deposit', 'TradingView direct', '68+ FX pairs'],
    link: 'https://oanda.com/sg-en'
  },
  {
    slug: 'city-index-singapore',
    name: 'City Index',
    regulation: 'MAS',
    badge: 'Best for Spreads',
    description: 'Part of the StoneX Group, providing a robust trading experience for experienced Singaporean traders.',
    pros: ['Fixed spreads available', 'StoneX backing', 'Advanced MT4 tools'],
    link: 'https://cityindex.com.sg'
  }
];

export const BEST_OF_PAGES_SG = [
  'forex-broker-singapore', 'trading-platform-singapore', 'cfd-broker-singapore', 
  'broker-for-beginners-singapore', 'crypto-trading-singapore', 'trading-course-singapore', 
  'broker-low-deposit-singapore', 'trading-app-singapore', 'prop-firm-singapore', 
  'ai-trading-tools-singapore'
].map(slug => ({
  slug,
  title: `Best ${slug.replace(/-/g, ' ').toUpperCase()} 2026`,
  metaDescription: `Reviewing the top ${slug.replace(/-/g, ' ')} for Singaporean traders.`,
  eyebrow: '// REGIONAL ANALYSIS'
}));

export const HOW_TO_PAGES_SG = [
  'start-trading-singapore', 'trade-forex-singapore', 'choose-broker-singapore', 
  'trade-sgx', 'trade-crypto-singapore', 'trading-tax-singapore', 
  'open-trading-account-singapore', 'trade-us-stocks-from-singapore',
  'trade-asia-session', 'trade-during-london-from-asia'
].map(slug => ({
  slug,
  title: `How to ${slug.replace(/-/g, ' ').toUpperCase()}`,
  metaDescription: `Guide on ${slug.replace(/-/g, ' ')} for Singapore investors.`
}));

export const COMPARE_PAGES_SG = [
  'ig-vs-saxo-singapore', 'cmc-vs-oanda-singapore', 'cfd-vs-stocks-singapore'
].map(slug => ({
  slug,
  title: `${slug.replace(/-/g, ' ').toUpperCase()} Comparison`,
  metaDescription: `Comparing top platforms in Singapore: ${slug.replace(/-/g, ' ')}.`
}));

export const SG_CITIES = ['Marina Bay', 'Orchard', 'Jurong', 'Tampines', 'Woodlands'];
export const SG_TOPICS = ['forex', 'stocks', 'options', 'crypto'];

export const CITY_CONTEXT_SG: Record<string, string> = {
  'Marina Bay': 'the global financial hub of the city',
  'Orchard': 'the premier retail and lifestyle destination',
  'Jurong': 'the industrial and innovation powerhouse',
  'Tampines': 'a major regional commercial center',
  'Woodlands': 'the strategic northern gateway'
};

export const TOPIC_DISPLAY_SG: Record<string, string> = {
  'forex': 'Foreign Exchange',
  'stocks': 'Equity Markets',
  'options': 'Derivative Options',
  'crypto': 'Digital Assets'
};
