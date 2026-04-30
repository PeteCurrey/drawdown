export const US_CITIES = [
  'new-york', 'los-angeles', 'chicago', 'houston', 'miami', 'san-francisco', 'seattle', 'denver', 'austin', 'atlanta'
];

export const US_TOPICS = [
  'day-trading', 'forex-trading', 'stock-trading', 'options-trading', 'trading-courses'
];

export const BEST_OF_PAGES_US = [
  'forex-broker-us', 'trading-platform-us', 'stock-broker-us', 'broker-for-beginners-us', 
  'day-trading-platform-us', 'options-trading-platform-us', 'crypto-trading-platform-us', 
  'broker-for-scalping-us', 'prop-firm-us', 'trading-course-us', 'trading-app-us', 
  'paper-trading-platform-us', 'broker-for-options-us', 'free-trading-tools-us', 
  'ai-trading-tools-us', 'trading-journal-us', 'futures-broker-us', 'penny-stock-broker-us', 
  'swing-trading-platform-us', 'broker-no-pdt-rule'
].map(slug => ({
  slug,
  title: `Best ${slug.replace(/-/g, ' ').toUpperCase()} 2026`,
  metaDescription: `Reviewing the top-rated ${slug.replace(/-/g, ' ')} for American traders.`,
  eyebrow: '// REGIONAL ANALYSIS'
}));

export const HOW_TO_PAGES_US = [
  'start-trading-us', 'trade-forex-us', 'day-trade-stocks-us', 'choose-broker-us', 
  'trade-options', 'trade-futures-us', 'avoid-pdt-rule', 'trade-with-small-account-us', 
  'trade-penny-stocks-us', 'pay-tax-trading-us', 'open-margin-account-us', 
  'trade-premarket-afterhours', 'use-level-2-data', 'trade-spy-options', 'pass-prop-firm-us'
].map(slug => ({
  slug,
  title: `How to ${slug.replace(/-/g, ' ').toUpperCase()} in the US`,
  metaDescription: `Complete guide on ${slug.replace(/-/g, ' ')} for US-based traders.`
}));

export const COMPARE_PAGES_US = [
  'oanda-vs-forex-com', 'tastyfx-vs-oanda', 'schwab-vs-fidelity', 'robinhood-vs-webull', 
  'interactive-brokers-vs-schwab', 'stocks-vs-forex-us', 'options-vs-futures', 
  'cash-account-vs-margin-account'
].map(slug => ({
  slug,
  title: `${slug.replace(/-/g, ' ').toUpperCase()} Comparison`,
  metaDescription: `Comparing the top US platforms: ${slug.replace(/-/g, ' ')}.`
}));

export const US_BROKERS = [
  {
    slug: 'tastyfx',
    name: 'tastyfx',
    type: 'Forex',
    badge: 'Best for Tech',
    regulation: 'CFTC / NFA',
    description: 'The US-compliant arm of IG Group, offering high-speed execution and institutional-grade technology.',
    pros: ['CFTC Registered', 'Powerful Mobile App', 'Low Spreads'],
    link: 'https://tastyfx.com'
  },
  {
    slug: 'oanda',
    name: 'OANDA',
    type: 'Forex',
    badge: 'Most Trusted',
    regulation: 'CFTC / NFA',
    description: 'A global leader in currency trading for over 25 years. Offering 68+ pairs with no minimum deposit.',
    pros: ['Vesta proprietary tech', 'No minimum deposit', 'Deep liquidity'],
    link: 'https://oanda.com'
  },
  {
    slug: 'forex-com',
    name: 'FOREX.com',
    type: 'Forex',
    badge: 'Best Execution',
    regulation: 'CFTC / NFA',
    description: 'Owned by StoneX, a Fortune 100 company. Offers raw spreads from 0.0 pips and excellent market depth.',
    pros: ['82+ Forex pairs', 'DMA accounts', 'StoneX backing'],
    link: 'https://forex.com'
  },
  {
    slug: 'interactive-brokers',
    name: 'Interactive Brokers',
    type: 'Multi-Asset',
    badge: 'Pro Choice',
    regulation: 'SEC, CFTC, NFA, FINRA',
    description: 'The ultimate platform for professional traders, providing access to 150+ global markets from a single account.',
    pros: ['Lowest margin rates', '100+ FX pairs', 'Institutional tools'],
    link: '/go/interactive-brokers'
  },
  {
    slug: 'schwab',
    name: 'Charles Schwab',
    type: 'Stocks/Options',
    badge: 'Best Platform',
    regulation: 'SEC / FINRA',
    description: 'Home to the legendary thinkorswim platform. Offering $0 commissions and world-class educational resources.',
    pros: ['thinkorswim access', 'Zero commissions', 'Award-winning support'],
    link: 'https://schwab.com'
  },
  {
    slug: 'fidelity',
    name: 'Fidelity',
    type: 'Stocks',
    badge: 'Best for Investing',
    regulation: 'SEC / FINRA',
    description: 'A powerhouse in retail investing with a focus on no-fee funds and excellent order execution quality.',
    pros: ['Zero expense funds', 'Fractional shares', 'Deep research'],
    link: 'https://fidelity.com'
  },
  {
    slug: 'robinhood',
    name: 'Robinhood',
    type: 'Stocks/Crypto',
    badge: 'Best Mobile',
    regulation: 'SEC / FINRA',
    description: 'The pioneer of commission-free trading. Simple, elegant, and perfectly optimized for mobile-first traders.',
    pros: ['Sleek UX', 'Commission-free', '24/5 Trading'],
    link: 'https://robinhood.com'
  },
  {
    slug: 'webull',
    name: 'Webull',
    type: 'Stocks/Options',
    badge: 'Best Charting',
    regulation: 'SEC / FINRA',
    description: 'Bridging the gap between Robinhood simplicity and Schwab complexity. Offering advanced technical analysis tools.',
    pros: ['L2 market data', 'Extended hours', 'Paper trading'],
    link: 'https://webull.com'
  }
];

export const CITY_CONTEXT_US: Record<string, string> = {
  'new-york': "Wall Street is literally in your backyard. New York traders benefit from direct proximity to the NYSE and NASDAQ, plus the deepest liquidity pools during the US session.",
  'chicago': "Home to the CME and CBOT, Chicago is the futures capital of the world. Institutional order flow and commodity cycles define the local trading culture.",
  'miami': "Miami's growing finance scene and international trading community make it a hub for forex and crypto traders looking for a cross-border edge.",
  'san-francisco': "San Francisco's tech-first culture has produced a new generation of algorithmic and systematic traders who treat the market as a code challenge.",
  'austin': "Austin's tech boom has attracted a new wave of retail traders and fintech entrepreneurs fleeing the high costs of traditional financial centers.",
  'los-angeles': "LA's diverse economy and time zone advantage — opening during the Asian session close — gives local traders a unique daily rhythm for FX.",
  'houston': "Houston's energy sector heritage gives local traders a natural edge when trading oil, gas, and energy-correlated commodities.",
  'seattle': "Seattle's Amazon and Microsoft ecosystem has produced data-driven traders who apply cloud-scale engineering thinking to market micro-structure.",
  'denver': "Denver's growing tech scene and outdoor lifestyle attract traders building flexible income streams in the Mountain Time zone.",
  'atlanta': "Atlanta's major corporate hub and growing fintech scene support a community of active retail traders in the Southeast United States."
};

export const TOPIC_DISPLAY_US: Record<string, string> = {
  'day-trading': 'Day Trading',
  'forex-trading': 'Forex Markets',
  'stock-trading': 'Equity Trading',
  'options-trading': 'Options & Derivatives',
  'trading-courses': 'Education'
};
