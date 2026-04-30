import { ComparisonPage } from "./compare";

export const COMPARE_PAGES_SG: ComparisonPage[] = [
  {
    slug: 'ig-vs-saxo-singapore',
    title: 'IG Singapore vs Saxo Markets — Which MAS Broker Wins?',
    eyebrow: '// BROKER SHOWDOWN',
    metaDescription: 'Comparing Singapore\'s two market leaders. We pit IG Singapore against Saxo Markets on execution, platform depth, and multi-asset access.',
    quickVerdict: {
      winner: 'IG Singapore',
      reason: 'IG wins for active day traders due to its superior technology and liquidity, while Saxo is the better choice for high-net-worth multi-asset investors.',
      prosA: ['17,000+ Markets', 'Premium Academy', 'Fast Execution'],
      prosB: ['70,000+ Instruments', 'VIP Tier Services', 'Strong Banking Pedigree']
    },
    comparisonTable: [
      { feature: 'MAS Regulated', a: 'Yes', b: 'Yes' },
      { feature: 'Avg Spread (EURUSD)', a: '0.6 Pips', b: '0.8 Pips' },
      { feature: 'Asset Classes', a: 'CFD, Forex', b: 'Stocks, CFD, Bonds' },
    ],
    sections: [],
    whoShouldChooseA: ['Day traders', 'FX specialists'],
    whoShouldChooseB: ['Long-term investors', 'Global fund managers'],
    faqs: []
  },
  ...['cmc-vs-oanda-singapore', 'cfd-vs-stocks-singapore'].map(slug => ({
    slug,
    title: `${slug.replace(/-/g, ' ').toUpperCase()} Comparison SG`,
    eyebrow: '// SG MARKET COMPARE',
    metaDescription: `Comparing ${slug.replace(/-/g, ' ')} for Singaporean traders. Professional analysis of MAS-regulated platforms.`,
    quickVerdict: { winner: 'TBD', reason: 'Depends on your style.', prosA: [], prosB: [] },
    comparisonTable: [],
    sections: [],
    whoShouldChooseA: [],
    whoShouldChooseB: [],
    faqs: []
  }))
];
