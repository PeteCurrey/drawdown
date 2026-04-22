export interface Instrument {
  slug: string;
  name: string;
  symbol: string;
  type: 'forex' | 'index' | 'crypto' | 'commodity' | 'stock';
  description: string;
  keyFacts: {
    hours: string;
    spread: string;
    contractSize: string;
    leverage: string;
  };
  fundamentalDrivers: string[];
  tradingTips: string[];
  relatedInstruments: string[];
  bestBrokerId: string;
  relevantCoursePhase: string;
}

export const INSTRUMENTS: Instrument[] = [
  // FOREX
  {
    slug: 'gbpusd',
    name: 'GBP/USD',
    symbol: 'GBPUSD',
    type: 'forex',
    description: 'Known as "The Cable", GBP/USD is one of the oldest and most traded currency pairs in the world, representing the exchange rate between the British Pound and the US Dollar.',
    keyFacts: {
      hours: '24/5 (Mon-Fri)',
      spread: '0.8 - 1.2 pips',
      contractSize: '100,000 units',
      leverage: '1:30 (UK Retail)'
    },
    fundamentalDrivers: ['Bank of England Interest Rates', 'US Federal Reserve Policy', 'UK GDP Data', 'US Non-Farm Payrolls (NFP)'],
    tradingTips: [
      'High volatility during the London-New York session overlap (13:00 - 16:00 GMT).',
      'Often reacts strongly to Brexit-related news and UK political stability.',
      'Watch for "stop hunts" around psychological levels like 1.2500 or 1.3000.'
    ],
    relatedInstruments: ['eurusd', 'gbpjpy', 'eurpbp'],
    bestBrokerId: 'pepperstone',
    relevantCoursePhase: 'Phase 2: Market Mechanics'
  },
  {
    slug: 'eurusd',
    name: 'EUR/USD',
    symbol: 'EURUSD',
    type: 'forex',
    description: 'The world\'s most liquid currency pair, EUR/USD represents the two largest economies in the world: the Eurozone and the United States.',
    keyFacts: {
      hours: '24/5 (Mon-Fri)',
      spread: '0.6 - 1.0 pips',
      contractSize: '100,000 units',
      leverage: '1:30 (UK Retail)'
    },
    fundamentalDrivers: ['ECB Monetary Policy', 'US Federal Reserve Policy', 'Eurozone Inflation (HICP)', 'US Consumer Price Index (CPI)'],
    tradingTips: [
      'The most predictable pair for technical analysis due to high liquidity.',
      'Extremely sensitive to the interest rate differential between the US and EU.',
      'Excellent for beginners due to lower spreads and smoother trends.'
    ],
    relatedInstruments: ['gbpusd', 'usdchf', 'audusd'],
    bestBrokerId: 'ic-markets',
    relevantCoursePhase: 'Phase 2: Market Mechanics'
  },
  // INDICES
  {
    slug: 'ftse-100',
    name: 'FTSE 100',
    symbol: 'UK100',
    type: 'index',
    description: 'The Financial Times Stock Exchange 100 Index, representing the 100 largest companies listed on the London Stock Exchange by market capitalisation.',
    keyFacts: {
      hours: '08:00 - 16:30 GMT',
      spread: '1.0 - 2.0 points',
      contractSize: '£10 per point',
      leverage: '1:20 (UK Retail)'
    },
    fundamentalDrivers: ['UK Economic Health', 'Commodity Prices (Mining/Energy heavy)', 'GBP Strength (Inverse correlation)', 'Global Market Sentiment'],
    tradingTips: [
      'Highly correlated with the price of Oil and Copper due to its heavy weighting in mining and energy stocks.',
      'Often acts as a defensive play compared to the more volatile US indices.',
      'Best traded during the London open (08:00 GMT).'
    ],
    relatedInstruments: ['sp-500', 'dax-40', 'gbpusd'],
    bestBrokerId: 'ig-index',
    relevantCoursePhase: 'Phase 3: Technical Analysis'
  },
  {
    slug: 'sp-500',
    name: 'S&P 500',
    symbol: 'SPX500',
    type: 'index',
    description: 'The Standard & Poor\'s 500 is widely regarded as the best single gauge of large-cap US equities, covering 500 leading companies.',
    keyFacts: {
      hours: '23 hours a day (CME)',
      spread: '0.4 - 0.6 points',
      contractSize: '$50 per point',
      leverage: '1:20 (UK Retail)'
    },
    fundamentalDrivers: ['US Corporate Earnings', 'Federal Reserve Interest Rates', 'US Employment Data', 'Global Geopolitical Events'],
    tradingTips: [
      'The primary driver of global risk sentiment.',
      'Watch the 14:30 GMT New York open for the most significant volume.',
      'Key technical levels often act as magnets for price action.'
    ],
    relatedInstruments: ['nasdaq', 'dow-jones', 'ftse-100'],
    bestBrokerId: 'pepperstone',
    relevantCoursePhase: 'Phase 3: Technical Analysis'
  },
  // COMMODITIES
  {
    slug: 'gold-xauusd',
    name: 'Gold (XAU/USD)',
    symbol: 'XAUUSD',
    type: 'commodity',
    description: 'Gold is the world\'s primary safe-haven asset, traded against the US Dollar. It is a hedge against inflation and geopolitical instability.',
    keyFacts: {
      hours: '23 hours a day',
      spread: '15 - 25 cents',
      contractSize: '100 ounces',
      leverage: '1:20 (UK Retail)'
    },
    fundamentalDrivers: ['US Dollar Strength (Inverse)', 'Real Interest Rates', 'Geopolitical Tension', 'Central Bank Gold Reserves'],
    tradingTips: [
      'Prices typically rise when real interest rates fall.',
      'Watch for "Safe Haven" flows during times of war or economic crisis.',
      'Highly volatile during US economic data releases (NFP, CPI).'
    ],
    relatedInstruments: ['silver-xagusd', 'usdchf', 'audusd'],
    bestBrokerId: 'xtb',
    relevantCoursePhase: 'Phase 4: Advanced Strategy'
  },
  {
    slug: 'crude-oil-wti',
    name: 'Crude Oil (WTI)',
    symbol: 'WTI',
    type: 'commodity',
    description: 'West Texas Intermediate (WTI) is a grade of crude oil used as a benchmark in oil pricing. It is a light, sweet crude oil.',
    keyFacts: {
      hours: '23 hours a day',
      spread: '2.0 - 4.0 cents',
      contractSize: '1,000 barrels',
      leverage: '1:10 (UK Retail)'
    },
    fundamentalDrivers: ['OPEC+ Supply Decisions', 'US Inventory Data (EIA)', 'Global Economic Growth', 'US Dollar Strength'],
    tradingTips: [
      'Every Wednesday at 15:30 GMT, the EIA Inventory report causes massive volatility.',
      'Highly sensitive to geopolitical events in the Middle East.',
      'Correlates strongly with the Canadian Dollar (CAD).'
    ],
    relatedInstruments: ['crude-oil-brent', 'usdcad', 'gold-xauusd'],
    bestBrokerId: 'pepperstone',
    relevantCoursePhase: 'Phase 4: Advanced Strategy'
  },
  // CRYPTO
  {
    slug: 'bitcoin',
    name: 'Bitcoin (BTC)',
    symbol: 'BTCUSD',
    type: 'crypto',
    description: 'The first and largest cryptocurrency, Bitcoin is increasingly viewed as "Digital Gold" and a store of value.',
    keyFacts: {
      hours: '24/7/365',
      spread: 'Variable ($10 - $50)',
      contractSize: '1 BTC',
      leverage: '1:2 (UK Retail)'
    },
    fundamentalDrivers: ['Institutional Adoption', 'Bitcoin Halving Cycles', 'Regulatory News', 'Global Liquidity (M2 Money Supply)'],
    tradingTips: [
      'Extremely high volatility compared to traditional assets.',
      'Watch the "Whale" movements and exchange inflows/outflows.',
      'Weekend price action can often be "fake" due to lower institutional volume.'
    ],
    relatedInstruments: ['ethereum', 'solana', 'nasdaq'],
    bestBrokerId: 'etoro',
    relevantCoursePhase: 'Phase 5: The Intelligence Layer'
  },
  // STOCKS
  {
    slug: 'tesla-tsla',
    name: 'Tesla (TSLA)',
    symbol: 'TSLA',
    type: 'stock',
    description: 'Tesla, Inc. is an American multinational automotive and clean energy company led by Elon Musk.',
    keyFacts: {
      hours: '14:30 - 21:00 GMT',
      spread: 'Tight (Cents)',
      contractSize: '1 Share',
      leverage: '1:5 (UK Retail)'
    },
    fundamentalDrivers: ['Vehicle Delivery Numbers', 'Elon Musk Tweets/Statements', 'AI and Robotics Progress', 'US Interest Rates'],
    tradingTips: [
      'One of the most emotional and retail-heavy stocks in the world.',
      'Earnings calls are legendary for causing 10%+ gaps.',
      'Often trades as a tech/AI play rather than a pure car company.'
    ],
    relatedInstruments: ['nasdaq', 'nvidia-nvda', 'apple-aapl'],
    bestBrokerId: 'trading-212',
    relevantCoursePhase: 'Phase 4: Advanced Strategy'
  }
];

// Helper function to get related instruments for a given slug
export function getRelatedInstruments(slug: string): Instrument[] {
  const instrument = INSTRUMENTS.find(i => i.slug === slug);
  if (!instrument) return [];
  return INSTRUMENTS.filter(i => instrument.relatedInstruments.includes(i.slug));
}

// Full list of 50 slugs for generateStaticParams
export const INSTRUMENT_SLUGS = [
  'gbpusd', 'eurusd', 'usdjpy', 'gbpjpy', 'eurgbp', 'audusd', 'usdchf', 'nzdusd', 'usdcad', 'eurjpy', 
  'gbpaud', 'euraud', 'eurchf', 'cadjpy', 'audnzd', 'gbpcad', 'gbpnzd', 'audcad', 'chfjpy', 'nzdjpy',
  'ftse-100', 'sp-500', 'dow-jones', 'nasdaq', 'dax-40', 'cac-40', 'nikkei-225', 'hang-seng',
  'bitcoin', 'ethereum', 'solana', 'xrp', 'cardano', 'polygon', 'avalanche', 'chainlink',
  'gold-xauusd', 'silver-xagusd', 'crude-oil-wti', 'crude-oil-brent', 'natural-gas', 'copper', 'platinum', 'palladium',
  'apple-aapl', 'tesla-tsla', 'nvidia-nvda', 'amazon-amzn', 'microsoft-msft', 'astrazeneca-azn'
];
