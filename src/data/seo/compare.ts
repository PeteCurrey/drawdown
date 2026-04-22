export interface ComparisonSection {
  title: string;
  content: string;
}

export interface ComparisonPage {
  slug: string;
  title: string;
  eyebrow: string;
  metaDescription: string;
  quickVerdict: {
    winner: string;
    reason: string;
  };
  comparisonTable: {
    feature: string;
    optionA: string;
    optionB: string;
  }[];
  sections: ComparisonSection[];
  whoShouldChooseA: string[];
  whoShouldChooseB: string[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export const COMPARISON_PAGES: ComparisonPage[] = [
  {
    slug: 'spread-betting-vs-cfds',
    title: 'Spread Betting vs CFDs — Which Is Better for UK Traders?',
    eyebrow: '// COMPARISON GUIDE',
    metaDescription: 'The definitive guide to Spread Betting vs CFDs in the UK. Compare tax implications, costs, and flexibility to find the right vehicle for your trading.',
    quickVerdict: {
      winner: 'Spread Betting',
      reason: 'For most UK retail traders, spread betting is superior due to its tax-free status on gains and exemption from stamp duty.'
    },
    comparisonTable: [
      { feature: 'Tax Treatment', optionA: 'Tax-Free (No CGT)', optionB: 'Subject to Capital Gains Tax' },
      { feature: 'Stamp Duty', optionA: 'Exempt', optionB: 'Exempt' },
      { feature: 'Costs', optionA: 'Built into Spread', optionB: 'Spread + Commission' },
      { feature: 'Loss Offsetting', optionA: 'Cannot offset losses', optionB: 'Can offset losses against gains' }
    ],
    sections: [
      {
        title: 'The Tax Advantage of Spread Betting',
        content: 'The primary reason spread betting is so popular in the UK is that it is categorized as gambling for tax purposes by HMRC. This means you do not pay Capital Gains Tax on any profits you make. For a successful trader, this can increase net returns by up to 20% compared to CFDs.'
      },
      {
        title: 'When to Use CFDs Instead',
        content: 'CFDs have one major advantage: loss offsetting. If you have other capital gains (e.g., from selling a house or shares), you can use your CFD losses to reduce your overall tax bill. Professional traders also sometimes prefer the direct market access (DMA) pricing available with some CFD accounts.'
      }
    ],
    whoShouldChooseA: [
      'Retail traders focused on tax efficiency',
      'Beginners wanting a simple cost structure',
      'Traders with small to medium accounts'
    ],
    whoShouldChooseB: [
      'Traders who want to offset losses for tax purposes',
      'Professional traders requiring DMA access',
      'International traders outside the UK/Ireland'
    ],
    faqs: [
      {
        question: 'Can I have both a spread betting and CFD account?',
        answer: 'Yes, most major UK brokers like IG allow you to hold both types of accounts simultaneously.'
      }
    ]
  },
  {
    slug: 'ig-vs-pepperstone',
    title: 'IG vs Pepperstone — Honest Comparison for UK Traders',
    eyebrow: '// COMPARISON GUIDE',
    metaDescription: 'Choosing between the UK\'s biggest broker and the raw-spread specialist? We compare IG vs Pepperstone on fees, platforms, and execution.',
    quickVerdict: {
      winner: 'Pepperstone (for Low Cost)',
      reason: 'If you prioritize raw spreads and execution speed, Pepperstone wins. If you want the widest market range, IG wins.'
    },
    comparisonTable: [
      { feature: 'Min Spread', optionA: '0.6 pips', optionB: '0.0 pips (Razor)' },
      { feature: 'Market Range', optionA: '17,000+', optionB: '1,200+' },
      { feature: 'Regulation', optionA: 'FCA (UK)', optionB: 'FCA (UK)' },
      { feature: 'Platforms', optionA: 'Proprietary, MT4, L2', optionB: 'cTrader, MT4, MT5, TradingView' }
    ],
    sections: [
      {
        title: 'Execution Quality',
        content: 'Pepperstone is built for the active day trader. Their raw spread model and Equinix NY4 infrastructure mean you get institutional-grade execution. IG, while fast, is more focused on providing a stable, all-in-one ecosystem for multi-asset traders.'
      }
    ],
    whoShouldChooseA: ['Multi-asset traders', 'Traders needing guaranteed stops', 'Long-term spread bettors'],
    whoShouldChooseB: ['Forex scalpers', 'cTrader/TradingView users', 'Cost-sensitive day traders'],
    faqs: []
  },
  {
    slug: 'ig-vs-cmc',
    title: 'IG vs CMC Markets — Which Is Better for 2026?',
    eyebrow: '// COMPARISON GUIDE',
    metaDescription: 'The battle of the UK titans. We compare IG Index vs CMC Markets on their proprietary platforms and spread betting features.',
    quickVerdict: {
      winner: 'IG (for Stability)',
      reason: 'IG offers a slightly more robust mobile experience and a wider range of markets, though CMC\'s charting is arguably superior.'
    },
    comparisonTable: [
      { feature: 'Markets', optionA: '17k+', optionB: '12k+' },
      { feature: 'Charting', optionA: 'ProRealTime', optionB: 'Next Generation' },
      { feature: 'Trust', optionA: 'FTSE 250', optionB: 'UK Listed' }
    ],
    sections: [
      {
        title: 'Platform Comparison',
        content: 'CMC\'s "Next Generation" platform is a work of art for chartists. It offers more technical indicators and drawing tools out of the box than IG. However, IG\'s integration with ProRealTime provides a more "institutional" feel for those who want to automate or use advanced volume analysis.'
      }
    ],
    whoShouldChooseA: ['Traders who want the largest community', 'Mobile-first traders', 'MT4 users'],
    whoShouldChooseB: ['Technical analysis purists', 'Traders who love custom charting', 'Cost-conscious index traders'],
    faqs: []
  },
  {
    slug: 'day-trading-vs-swing-trading',
    title: 'Day Trading vs Swing Trading — Which Suits You?',
    eyebrow: '// COMPARISON GUIDE',
    metaDescription: 'Pace vs Peace. We compare day trading and swing trading to help you find the strategy that fits your lifestyle and psychology.',
    quickVerdict: {
      winner: 'Swing Trading (for most people)',
      reason: 'Swing trading is more sustainable for those with jobs and generally leads to better psychological outcomes for beginners.'
    },
    comparisonTable: [
      { feature: 'Time Commitment', optionA: 'High (4-6 hours/day)', optionB: 'Low (30 mins/day)' },
      { feature: 'Pace', optionA: 'Fast/Stressful', optionB: 'Slow/Deliberate' },
      { feature: 'Hold Time', optionA: 'Seconds to Hours', optionB: 'Days to Weeks' }
    ],
    sections: [
      {
        title: 'Psychology of the Clock',
        content: 'Day trading requires you to make split-second decisions under pressure. If you have an impulsive personality, this can be disastrous. Swing trading allows you to analyze the market when it\'s closed, placing orders that execute while you are away, which naturally filters out emotional noise.'
      }
    ],
    whoShouldChooseA: ['Professional traders', 'People who love high intensity', 'Those with high emotional discipline'],
    whoShouldChooseB: ['Part-time traders', 'People with full-time jobs', 'Patient investors'],
    faqs: []
  },
  {
    slug: 'forex-vs-stocks',
    title: 'Forex vs Stocks — Which Should You Trade?',
    eyebrow: '// COMPARISON GUIDE',
    metaDescription: 'Liquidity vs Ownership. We compare the Forex market and Stock market on leverage, hours, and profit potential.',
    quickVerdict: {
      winner: 'Forex (for Leverage)',
      reason: 'Forex is better for those starting with smaller capital who want to use leverage. Stocks are better for those wanting to own pieces of businesses.'
    },
    comparisonTable: [
      { feature: 'Market Hours', optionA: '24/5', optionB: 'Exchange Hours (e.g. 8-4:30)' },
      { feature: 'Leverage', optionA: 'High (up to 30:1)', optionB: 'Low (typically 5:1)' },
      { feature: 'Ownership', optionA: 'None (Speculative)', optionB: 'Equity in Companies' }
    ],
    sections: [
      {
        title: 'Market Drivers',
        content: 'Forex is driven by macroeconomics—interest rates, inflation, and geopolitics. Stocks are driven by microeconomics—earnings reports, product launches, and CEO changes. Choose the market that matches what you find more interesting to study.'
      }
    ],
    whoShouldChooseA: ['Macro geeks', 'Night owls', 'Leverage-seeking traders'],
    whoShouldChooseB: ['Fundamental analysts', 'Long-term builders', 'Daytime traders'],
    faqs: []
  },
  {
    slug: 'trading-vs-investing',
    title: 'Trading vs Investing — What\'s the Difference?',
    eyebrow: '// COMPARISON GUIDE',
    metaDescription: 'Active vs Passive. We break down the differences between trading and investing to help you allocate your capital correctly.',
    quickVerdict: {
      winner: 'Both',
      reason: 'Most successful individuals use trading to generate active income and investing to build long-term wealth.'
    },
    comparisonTable: [
      { feature: 'Goal', optionA: 'Cash Flow', optionB: 'Wealth Building' },
      { feature: 'Risk', optionA: 'High Per Trade', optionB: 'Market Beta' },
      { feature: 'Timeframe', optionA: 'Short Term', optionB: 'Years/Decades' }
    ],
    sections: [
      {
        title: 'Capital Velocity',
        content: 'Trading is about "velocity of capital"—turning over your money frequently to capture small edges. Investing is about "compounding of capital"—letting time and growth do the work for you.'
      }
    ],
    whoShouldChooseA: ['Those seeking active income', 'Skills-focused individuals', 'Risk-tolerant people'],
    whoShouldChooseB: ['Passive income seekers', 'Retirement planners', 'Low-maintenance builders'],
    faqs: []
  },
  {
    slug: 'technical-vs-fundamental',
    title: 'Technical vs Fundamental Analysis',
    eyebrow: '// COMPARISON GUIDE',
    metaDescription: 'Charts vs Data. We compare technical and fundamental analysis to help you build a complete trading framework.',
    quickVerdict: {
      winner: 'Hybrid Approach',
      reason: 'The best traders use fundamentals to find "What" to trade and technicals to find "When" to trade.'
    },
    comparisonTable: [
      { feature: 'Source', optionA: 'Price Charts', optionB: 'Economic Data' },
      { feature: 'Focus', optionA: 'Timing/Sentiment', optionB: 'Value/Macro' },
      { feature: 'Tools', optionA: 'Indicators/Patterns', optionB: 'News/Balance Sheets' }
    ],
    sections: [
      {
        title: 'The "When" and the "Why"',
        content: 'Fundamental analysis tells you why a move should happen (e.g. the BoE is raising rates). Technical analysis shows you exactly when the market is starting to price that move in. Using both removes the guesswork of pure chart patterns.'
      }
    ],
    whoShouldChooseA: ['Short-term traders', 'Visual thinkers', 'Scalpers'],
    whoShouldChooseB: ['Long-term investors', 'Macro strategists', 'Data-driven traders'],
    faqs: []
  },
  {
    slug: 'ftmo-vs-the5ers',
    title: 'FTMO vs The 5%ers — Prop Firm Comparison',
    eyebrow: '// COMPARISON GUIDE',
    metaDescription: 'Which prop firm should you trust with your talent? We compare FTMO and The 5%ers on challenge rules and payout reliability.',
    quickVerdict: {
      winner: 'FTMO (for Scaling)',
      reason: 'FTMO is the industry giant with a perfect record. The 5%ers is better for those who prefer a lower-risk, low-leverage "funding" approach.'
    },
    comparisonTable: [
      { feature: 'Profit Target', optionA: '10% (Phase 1)', optionB: '6-10%' },
      { feature: 'Daily Loss', optionA: '5%', optionB: '4%' },
      { feature: 'Time Limit', optionA: 'None', optionB: 'None' }
    ],
    sections: [
      {
        title: 'Challenge Philosophies',
        content: 'FTMO wants to see aggressive but controlled performance. The 5%ers focus more on long-term consistency and offer "instant funding" paths that don\'t require a two-step evaluation.'
      }
    ],
    whoShouldChooseA: ['Proven traders needing large capital', 'Aggressive trend traders'],
    whoShouldChooseB: ['Conservative traders', 'Those who hate challenges', 'Risk-averse scalpers'],
    faqs: []
  },
  {
    slug: 'mt4-vs-mt5',
    title: 'MT4 vs MT5 — Which Platform Is Better?',
    eyebrow: '// COMPARISON GUIDE',
    metaDescription: 'The classic battle of MetaQuotes platforms. We compare MT4 and MT5 for speed, indicators, and asset compatibility.',
    quickVerdict: {
      winner: 'MT5 (for the Future)',
      reason: 'MT5 is faster, supports more assets, and is actively being updated. MT4 is only better if you have specific legacy indicators or EAs.'
    },
    comparisonTable: [
      { feature: 'Speed', optionA: '32-bit (Older)', optionB: '64-bit (Faster)' },
      { feature: 'Timeframes', optionA: '9 Standard', optionB: '21 Standard' },
      { feature: 'Assets', optionA: 'Forex/CFD', optionB: 'Forex, Stocks, Futures' }
    ],
    sections: [
      {
        title: 'The Coding Gap',
        content: 'MT4 uses MQL4, while MT5 uses MQL5. MQL5 is much closer to C++ and is significantly more powerful for building complex trading robots (EAs).'
      }
    ],
    whoShouldChooseA: ['Beginners with basic needs', 'Traders with old MT4 EAs'],
    whoShouldChooseB: ['Modern traders', 'Multi-asset traders', 'Strategy developers'],
    faqs: []
  },
  {
    slug: 'scalping-vs-day-trading',
    title: 'Scalping vs Day Trading — Pros and Cons',
    eyebrow: '// COMPARISON GUIDE',
    metaDescription: 'Seconds vs Hours. We compare scalping and day trading to help you find your intraday edge.',
    quickVerdict: {
      winner: 'Day Trading (for Sanity)',
      reason: 'Scalping requires extreme focus and perfect execution. Day trading allows for more breathing room and better risk-reward setups.'
    },
    comparisonTable: [
      { feature: 'Trade Duration', optionA: 'Seconds to Minutes', optionB: 'Minutes to Hours' },
      { feature: 'Trades per Day', optionA: '20 - 100+', optionB: '1 - 5' },
      { feature: 'Win Rate Need', optionA: 'Very High (70%+)', optionB: 'Medium (40-60%)' }
    ],
    sections: [
      {
        title: 'The Cost of Scalping',
        content: 'Scalpers are at the mercy of the spread. If your average winner is 5 pips and your spread is 1 pip, you are losing 20% of your profit to the broker. Day traders capture 30-50 pips, making the spread negligible.'
      }
    ],
    whoShouldChooseA: ['High-focus individuals', 'Traders with raw-spread accounts', 'Those who love fast action'],
    whoShouldChooseB: ['Most intraday traders', 'Pattern-focused individuals', 'Those wanting better R:R'],
    faqs: []
  }
];
