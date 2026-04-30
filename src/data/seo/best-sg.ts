import { BestOfPage } from "./best";

export const BEST_OF_PAGES_SG: BestOfPage[] = [
  {
    slug: 'forex-broker-singapore',
    title: 'Best Forex Brokers in Singapore 2026 — MAS Regulated',
    eyebrow: '// REGULATED REVIEW',
    readingTime: 12,
    metaDescription: 'Compare the best MAS-regulated forex brokers in Singapore. We review IG, Saxo, and OANDA on execution, spreads, and local support.',
    introduction: 'Singapore is Asia\'s premier forex hub. With MAS oversight and a sophisticated financial infrastructure, Singaporean traders have access to world-class platforms. Here is our 2026 shortlist.',
    bestOverall: { name: 'IG Singapore', reason: 'Unmatched market access and deep liquidity under MAS regulation.', link: '/go/ig-markets' },
    comparisonTable: [
      { broker: 'IG Singapore', spread: '0.6 Pips', leverage: '20:1', rating: '4.9/5' },
      { broker: 'Saxo Markets', spread: '0.8 Pips', leverage: '20:1', rating: '4.8/5' },
    ],
    sections: [],
    drawdownApproach: { title: 'The SG Standard', content: 'Compliance and execution are the only metrics that matter.', ctaText: 'View Shortlist', ctaLink: '/sg/brokers' },
    faqs: []
  },
  ...['trading-platform-singapore', 'cfd-broker-singapore', 'broker-for-beginners-singapore', 'crypto-trading-singapore', 'trading-course-singapore', 'broker-low-deposit-singapore', 'trading-app-singapore', 'prop-firm-singapore', 'ai-trading-tools-singapore'].map(slug => ({
    slug,
    title: `Best ${slug.replace(/-/g, ' ').toUpperCase()} 2026`,
    eyebrow: '// SG MARKET REVIEW',
    readingTime: 10,
    metaDescription: `Reviewing the top-rated ${slug.replace(/-/g, ' ')} for Singaporean traders. MAS compliant platforms only.`,
    introduction: `Finding the right ${slug.replace(/-/g, ' ')} is the foundation of any successful Singaporean trading career.`,
    bestOverall: { name: 'Saxo Markets', reason: 'Institutional grade tools and deep multi-asset liquidity.', link: 'https://home.saxo/en-sg' },
    comparisonTable: [],
    sections: [],
    drawdownApproach: { title: 'The Drawdown Choice', content: 'Institutional standards for retail traders.', ctaText: 'Join Drawdown', ctaLink: '/sg/signup' },
    faqs: []
  }))
];
