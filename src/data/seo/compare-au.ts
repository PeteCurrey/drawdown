import { ComparisonPage } from "./compare";

export const COMPARE_PAGES_AU: ComparisonPage[] = [
  {
    slug: 'pepperstone-vs-ic-markets',
    title: 'Pepperstone vs IC Markets — Which Australia-Based Broker Wins?',
    eyebrow: '// BROKER SHOWDOWN',
    metaDescription: 'A detailed comparison between Australia\'s two biggest brokers. We compare Pepperstone and IC Markets on speed, spreads, and local support.',
    quickVerdict: {
      winner: 'Pepperstone',
      reason: 'Slightly better execution quality and a more intuitive client portal, though IC Markets is a close second for raw spreads.',
      prosA: ['Sub-30ms latency', 'Superior support', 'TradingView integration'],
      prosB: ['Lowest raw spreads', 'Deep liquidity', 'Global reputation']
    },
    comparisonTable: [
      { feature: 'ASIC Regulated', a: 'Yes', b: 'Yes' },
      { feature: 'Avg Spread (EURUSD)', a: '0.1 Pips', b: '0.0 Pips' },
      { feature: 'Commission', a: 'A$3.50', b: 'A$3.50' },
    ],
    sections: [
      { title: 'Execution Performance', content: 'Both brokers utilize NY4 and LD5 data centers to ensure minimal slippage for their clients.' }
    ],
    whoShouldChooseA: ['Active day traders', 'TradingView users'],
    whoShouldChooseB: ['High-volume scalpers', 'EA users'],
    faqs: []
  },
  ...['fp-markets-vs-fusion-markets', 'eightcap-vs-pepperstone', 'axi-vs-ic-markets', 'cfd-vs-shares-australia'].map(slug => ({
    slug,
    title: `${slug.replace(/-/g, ' ').toUpperCase()} Comparison`,
    eyebrow: '// AUSTRALIA COMPARE',
    metaDescription: `Comparing ${slug.replace(/-/g, ' ')} for Australian traders. Professional analysis and data-driven results.`,
    quickVerdict: { winner: 'TBD', reason: 'Depends on your trading style.', prosA: [], prosB: [] },
    comparisonTable: [],
    sections: [],
    whoShouldChooseA: [],
    whoShouldChooseB: [],
    faqs: []
  }))
];
