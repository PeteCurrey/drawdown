import { ComparisonPage } from "./compare";

export const COMPARE_PAGES_HK: ComparisonPage[] = [
  {
    slug: 'ig-vs-saxo-hong-kong',
    title: 'IG Hong Kong vs Saxo Markets — Which SFC Broker Wins?',
    eyebrow: '// BROKER SHOWDOWN',
    metaDescription: 'Comparing Hong Kong\'s two market leaders. We pit IG Hong Kong against Saxo Markets on execution, SFC compliance, and global access.',
    quickVerdict: {
      winner: 'IG Hong Kong',
      reason: 'IG offers better overall technology and liquidity for active day traders, while Saxo is superior for long-term multi-asset wealth management.',
      prosA: ['SFC Type 3 Licensed', '17,000+ Markets', 'Local Support'],
      prosB: ['Institutional Heritage', '70,000+ Instruments', 'Professional Research']
    },
    comparisonTable: [
      { feature: 'SFC Regulated', a: 'Yes', b: 'Yes' },
      { feature: 'Avg Spread', a: '0.6 Pips', b: '0.8 Pips' },
      { feature: 'Base Currency', a: 'HKD, USD', b: 'HKD, USD' },
    ],
    sections: [],
    whoShouldChooseA: ['Day traders', 'FX scalpers'],
    whoShouldChooseB: ['HNW Investors', 'Fund managers'],
    faqs: []
  },
  ...['interactive-brokers-vs-saxo-hong-kong'].map(slug => ({
    slug,
    title: `${slug.replace(/-/g, ' ').toUpperCase()} Comparison HK`,
    eyebrow: '// HK MARKET COMPARE',
    metaDescription: `Comparing ${slug.replace(/-/g, ' ')} for Hong Kong traders. Professional analysis of SFC-regulated platforms.`,
    quickVerdict: { winner: 'TBD', reason: 'Depends on your capital.', prosA: [], prosB: [] },
    comparisonTable: [],
    sections: [],
    whoShouldChooseA: [],
    whoShouldChooseB: [],
    faqs: []
  }))
];
