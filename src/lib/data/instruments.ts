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
  // FOREX (20)
  {
    slug: 'gbpusd',
    name: 'GBP/USD',
    symbol: 'GBPUSD',
    type: 'forex',
    description: 'Known as "The Cable", GBP/USD is one of the oldest and most traded currency pairs in the world, representing the exchange rate between the British Pound and the US Dollar.',
    keyFacts: { hours: '24/5 (Mon-Fri)', spread: '0.8 - 1.2 pips', contractSize: '100,000 units', leverage: '1:30 (UK Retail)' },
    fundamentalDrivers: ['Bank of England Interest Rates', 'US Federal Reserve Policy', 'UK GDP Data', 'US Non-Farm Payrolls (NFP)'],
    tradingTips: ['High volatility during London-NY overlap.', 'Reacts to Brexit/UK political stability.', 'Watch psychological levels like 1.3000.'],
    relatedInstruments: ['eurusd', 'gbpjpy', 'eurgbp'],
    bestBrokerId: 'pepperstone',
    relevantCoursePhase: 'Phase 2: Market Mechanics'
  },
  {
    slug: 'eurusd',
    name: 'EUR/USD',
    symbol: 'EURUSD',
    type: 'forex',
    description: 'The world\'s most liquid currency pair, EUR/USD represents the two largest economies in the world: the Eurozone and the United States.',
    keyFacts: { hours: '24/5 (Mon-Fri)', spread: '0.6 - 1.0 pips', contractSize: '100,000 units', leverage: '1:30 (UK Retail)' },
    fundamentalDrivers: ['ECB Monetary Policy', 'US Federal Reserve Policy', 'Eurozone Inflation', 'US CPI'],
    tradingTips: ['Predictable for technical analysis.', 'Sensitive to interest rate differentials.', 'Excellent for beginners.'],
    relatedInstruments: ['gbpusd', 'usdchf', 'audusd'],
    bestBrokerId: 'ic-markets',
    relevantCoursePhase: 'Phase 2: Market Mechanics'
  },
  {
    slug: 'usdjpy',
    name: 'USD/JPY',
    symbol: 'USDJPY',
    type: 'forex',
    description: 'Known as "The Ninja", USD/JPY represents the exchange rate between the US Dollar and the Japanese Yen. It is a major indicator of Asian market sentiment.',
    keyFacts: { hours: '24/5 (Mon-Fri)', spread: '0.7 - 1.1 pips', contractSize: '100,000 units', leverage: '1:30 (UK Retail)' },
    fundamentalDrivers: ['Bank of Japan Policy', 'US Treasury Yields', 'Safe Haven Flows', 'Asian Equity Performance'],
    tradingTips: ['Correlates with US 10-Year yields.', 'Watch for BoJ intervention rumors.', 'High volume during Tokyo open.'],
    relatedInstruments: ['eurjpy', 'gbpjpy', 'audjpy'],
    bestBrokerId: 'pepperstone',
    relevantCoursePhase: 'Phase 2: Market Mechanics'
  },
  {
    slug: 'gbpjpy',
    name: 'GBP/JPY',
    symbol: 'GBPJPY',
    type: 'forex',
    description: 'The "Dragon" or "Beast", GBP/JPY is one of the most volatile major crosses, known for its massive daily ranges and trend-following characteristics.',
    keyFacts: { hours: '24/5 (Mon-Fri)', spread: '1.5 - 2.5 pips', contractSize: '100,000 units', leverage: '1:30 (UK Retail)' },
    fundamentalDrivers: ['UK Interest Rates', 'BoJ Sentiment', 'Global Risk Appetite', 'Carry Trade Dynamics'],
    tradingTips: ['Not for the faint-hearted.', 'Respect stop losses strictly.', 'Moves in thousands of pips per trend.'],
    relatedInstruments: ['gbpusd', 'usdjpy', 'eurjpy'],
    bestBrokerId: 'ic-markets',
    relevantCoursePhase: 'Phase 4: Advanced Strategy'
  },
  {
    slug: 'eurgbp',
    name: 'EUR/GBP',
    symbol: 'EURGBP',
    type: 'forex',
    description: 'The "Chunnel", EUR/GBP tracks the relationship between the two most influential European currencies. It is often less volatile than other GBP pairs.',
    keyFacts: { hours: '24/5 (Mon-Fri)', spread: '0.9 - 1.3 pips', contractSize: '100,000 units', leverage: '1:30 (UK Retail)' },
    fundamentalDrivers: ['UK vs EU GDP Growth', 'Relative Interest Rates', 'Trade Balance', 'Political Stability'],
    tradingTips: ['Prone to long periods of range-bound price action.', 'Good for mean-reversion strategies.', 'Low spread on UK brokers.'],
    relatedInstruments: ['eurusd', 'gbpusd', 'eurchf'],
    bestBrokerId: 'pepperstone',
    relevantCoursePhase: 'Phase 2: Market Mechanics'
  },
  { slug: 'audusd', name: 'AUD/USD', symbol: 'AUDUSD', type: 'forex', description: 'The "Aussie" represents the Australian Dollar vs US Dollar. It is a commodity currency, heavily influenced by iron ore and coal prices.', keyFacts: { hours: '24/5', spread: '0.7-1.1', contractSize: '100k', leverage: '1:30' }, fundamentalDrivers: ['Commodity Prices', 'China GDP', 'RBA Rates'], tradingTips: ['Follows Gold and Iron Ore.', 'Strong trend following.'], relatedInstruments: ['nzdusd', 'usdcad', 'gold-xauusd'], bestBrokerId: 'ic-markets', relevantCoursePhase: 'Phase 2' },
  { slug: 'usdchf', name: 'USD/CHF', symbol: 'USDCHF', type: 'forex', description: 'The "Swissy" is a classic safe-haven pair. It inversely correlates with EUR/USD and rises during times of US Dollar strength and global stability.', keyFacts: { hours: '24/5', spread: '1.0-1.5', contractSize: '100k', leverage: '1:30' }, fundamentalDrivers: ['SNB Policy', 'Safe Haven Flows', 'US Data'], tradingTips: ['Inverse of EUR/USD.', 'Watch SNB floor rumors.'], relatedInstruments: ['eurusd', 'eurchf', 'gbpusd'], bestBrokerId: 'pepperstone', relevantCoursePhase: 'Phase 2' },
  { slug: 'nzdusd', name: 'NZD/USD', symbol: 'NZDUSD', type: 'forex', description: 'The "Kiwi" represents the New Zealand Dollar. Like the Aussie, it is a commodity currency, but more focused on dairy and agricultural exports.', keyFacts: { hours: '24/5', spread: '0.9-1.4', contractSize: '100k', leverage: '1:30' }, fundamentalDrivers: ['Dairy Prices', 'RBNZ Policy', 'China Demand'], tradingTips: ['More volatile than AUD/USD.', 'Watch GDT auction results.'], relatedInstruments: ['audusd', 'usdcad', 'audnzd'], bestBrokerId: 'ic-markets', relevantCoursePhase: 'Phase 2' },
  { slug: 'usdcad', name: 'USD/CAD', symbol: 'USDCAD', type: 'forex', description: 'The "Loonie" is heavily correlated with the price of Crude Oil, as Canada is a major oil exporter.', keyFacts: { hours: '24/5', spread: '1.0-1.5', contractSize: '100k', leverage: '1:30' }, fundamentalDrivers: ['Oil Prices', 'BoC Policy', 'US-Canada Trade'], tradingTips: ['Oil is the main driver.', 'Watch BOC rate decisions.'], relatedInstruments: ['audusd', 'nzdusd', 'crude-oil-wti'], bestBrokerId: 'pepperstone', relevantCoursePhase: 'Phase 2' },
  { slug: 'eurjpy', name: 'EUR/JPY', symbol: 'EURJPY', type: 'forex', description: 'A major cross pair representing the Euro vs the Yen. It is a popular vehicle for the "carry trade" and tracks global risk sentiment.', keyFacts: { hours: '24/5', spread: '1.0-1.8', contractSize: '100k', leverage: '1:30' }, fundamentalDrivers: ['ECB Sentiment', 'BoJ Policy', 'Stock Market Risk'], tradingTips: ['Strong correlation with equities.', 'Volatile Asian session.'], relatedInstruments: ['usdjpy', 'gbpjpy', 'eurusd'], bestBrokerId: 'ic-markets', relevantCoursePhase: 'Phase 3' },
  { slug: 'gbpaud', name: 'GBP/AUD', symbol: 'GBPAUD', type: 'forex', description: 'A highly volatile cross between the Pound and the Aussie. Known for large swings and trend strength.', keyFacts: { hours: '24/5', spread: '2.5-4.0', contractSize: '100k', leverage: '1:30' }, fundamentalDrivers: ['UK Economy', 'Commodity Supercycle', 'Interest Rate Gap'], tradingTips: ['Massive daily ranges.', 'Use wider stops.'], relatedInstruments: ['gbpnzd', 'audusd', 'gbpusd'], bestBrokerId: 'pepperstone', relevantCoursePhase: 'Phase 4' },
  { slug: 'euraud', name: 'EUR/AUD', symbol: 'EURAUD', type: 'forex', description: 'Tracks the Euro against the commodity-heavy Australian Dollar.', keyFacts: { hours: '24/5', spread: '1.8-2.5', contractSize: '100k', leverage: '1:30' }, fundamentalDrivers: ['EU Economy', 'China Growth', 'Risk Sentiment'], tradingTips: ['Good for diversification.', 'Watch Aussie session opens.'], relatedInstruments: ['gbpaud', 'audusd', 'eurnzd'], bestBrokerId: 'ic-markets', relevantCoursePhase: 'Phase 3' },
  { slug: 'eurchf', name: 'EUR/CHF', symbol: 'EURCHF', type: 'forex', description: 'A barometer for European political and economic stability.', keyFacts: { hours: '24/5', spread: '1.2-1.8', contractSize: '100k', leverage: '1:30' }, fundamentalDrivers: ['SNB Policy', 'EU Politics', 'Inflation Gap'], tradingTips: ['Very range bound.', 'Mean reversion candidate.'], relatedInstruments: ['usdchf', 'eurusd', 'eurgbp'], bestBrokerId: 'pepperstone', relevantCoursePhase: 'Phase 2' },
  { slug: 'cadjpy', name: 'CAD/JPY', symbol: 'CADJPY', type: 'forex', description: 'A play on Crude Oil vs the safe-haven Japanese Yen.', keyFacts: { hours: '24/5', spread: '1.5-2.2', contractSize: '100k', leverage: '1:30' }, fundamentalDrivers: ['Oil Prices', 'Global Risk On/Off', 'BoJ Rates'], tradingTips: ['Direct Oil correlation.', 'Good for risk-on themes.'], relatedInstruments: ['usdcad', 'usdjpy', 'eurjpy'], bestBrokerId: 'ic-markets', relevantCoursePhase: 'Phase 3' },
  { slug: 'audnzd', name: 'AUD/NZD', symbol: 'AUDNZD', type: 'forex', description: 'The "Apple" pair, tracking the two closest antipodean economies.', keyFacts: { hours: '24/5', spread: '1.5-2.5', contractSize: '100k', leverage: '1:30' }, fundamentalDrivers: ['Dairy vs Iron Ore', 'RBA vs RBNZ', 'Trade Wars'], tradingTips: ['Slow mover.', 'Technical patterns hold well.'], relatedInstruments: ['audusd', 'nzdusd', 'gbpaud'], bestBrokerId: 'pepperstone', relevantCoursePhase: 'Phase 2' },
  { slug: 'gbpcad', name: 'GBP/CAD', symbol: 'GBPCAD', type: 'forex', description: 'Pound Sterling vs the Canadian Dollar.', keyFacts: { hours: '24/5', spread: '2.0-3.5', contractSize: '100k', leverage: '1:30' }, fundamentalDrivers: ['UK GDP', 'Oil Prices', 'Trade Terms'], tradingTips: ['Strong trending pair.', 'Watch Oil session opens.'], relatedInstruments: ['gbpusd', 'usdcad', 'gbpaud'], bestBrokerId: 'ic-markets', relevantCoursePhase: 'Phase 3' },
  { slug: 'gbpnzd', name: 'GBP/NZD', symbol: 'GBPNZD', type: 'forex', description: 'Extremely volatile cross between the Pound and the Kiwi.', keyFacts: { hours: '24/5', spread: '3.0-5.0', contractSize: '100k', leverage: '1:30' }, fundamentalDrivers: ['UK Rates', 'NZ Dairy', 'Carry Trade'], tradingTips: ['Highest volatility.', 'High margin required.'], relatedInstruments: ['gbpaud', 'nzdusd', 'gbpusd'], bestBrokerId: 'pepperstone', relevantCoursePhase: 'Phase 4' },
  { slug: 'audcad', name: 'AUD/CAD', symbol: 'AUDCAD', type: 'forex', description: 'Iron Ore vs Crude Oil.', keyFacts: { hours: '24/5', spread: '1.5-2.5', contractSize: '100k', leverage: '1:30' }, fundamentalDrivers: ['Global Commmodities', 'China vs US Trade', 'Relative Rates'], tradingTips: ['Pure commodity cross.', 'Good for macro plays.'], relatedInstruments: ['audusd', 'usdcad', 'nzdusd'], bestBrokerId: 'ic-markets', relevantCoursePhase: 'Phase 3' },
  { slug: 'chfjpy', name: 'CHF/JPY', symbol: 'CHFJPY', type: 'forex', description: 'The battle of the safe havens.', keyFacts: { hours: '24/5', spread: '2.0-3.5', contractSize: '100k', leverage: '1:30' }, fundamentalDrivers: ['SNB vs BoJ', 'Global Risk', 'Yield Spreads'], tradingTips: ['Defensive trading vehicle.', 'Watch for intervention.'], relatedInstruments: ['usdchf', 'usdjpy', 'eurjpy'], bestBrokerId: 'pepperstone', relevantCoursePhase: 'Phase 3' },
  { slug: 'nzdjpy', name: 'NZD/JPY', symbol: 'NZDJPY', type: 'forex', description: 'Kiwi vs Yen. A popular risk-on/risk-off indicator.', keyFacts: { hours: '24/5', spread: '1.5-2.5', contractSize: '100k', leverage: '1:30' }, fundamentalDrivers: ['Equities', 'RBNZ Policy', 'Safe Haven Flows'], tradingTips: ['Follows SP500 closely.', 'Active in Tokyo session.'], relatedInstruments: ['audjpy', 'usdjpy', 'nzdusd'], bestBrokerId: 'ic-markets', relevantCoursePhase: 'Phase 3' },

  // INDICES (8)
  {
    slug: 'ftse-100',
    name: 'FTSE 100',
    symbol: 'UK100',
    type: 'index',
    description: 'The Financial Times Stock Exchange 100 Index, representing the 100 largest companies listed on the London Stock Exchange.',
    keyFacts: { hours: '08:00 - 16:30 GMT', spread: '1.0 - 2.0 pts', contractSize: '£10 per pt', leverage: '1:20' },
    fundamentalDrivers: ['UK Economy', 'Commodity Prices', 'GBP Strength'],
    tradingTips: ['Heavy weighting in mining/energy.', 'Acts as defensive play.', 'London open is key.'],
    relatedInstruments: ['sp-500', 'dax-40', 'gbpusd'],
    bestBrokerId: 'ig-index',
    relevantCoursePhase: 'Phase 3'
  },
  { slug: 'sp-500', name: 'S&P 500', symbol: 'SPX500', type: 'index', description: 'The gold standard for US large-cap equities.', keyFacts: { hours: '23h', spread: '0.4-0.6', contractSize: '$50', leverage: '1:20' }, fundamentalDrivers: ['Corporate Earnings', 'Fed Rates', 'Jobs Data'], tradingTips: ['Primary risk sentiment driver.', 'Watch NY open at 14:30 GMT.'], relatedInstruments: ['nasdaq', 'dow-jones', 'ftse-100'], bestBrokerId: 'pepperstone', relevantCoursePhase: 'Phase 3' },
  { slug: 'dow-jones', name: 'Dow Jones 30', symbol: 'DJ30', type: 'index', description: 'The Wall Street benchmark of 30 blue-chip industrial stocks.', keyFacts: { hours: '23h', spread: '1.0-2.0', contractSize: '$5', leverage: '1:20' }, fundamentalDrivers: ['US Industrials', 'Earnings', 'Macro Stability'], tradingTips: ['Less tech-heavy than Nasdaq.', 'Strong psychological levels.'], relatedInstruments: ['sp-500', 'nasdaq', 'apple-aapl'], bestBrokerId: 'ic-markets', relevantCoursePhase: 'Phase 3' },
  { slug: 'nasdaq', name: 'Nasdaq 100', symbol: 'NAS100', type: 'index', description: 'The tech-heavy index of the top 100 non-financial US companies.', keyFacts: { hours: '23h', spread: '0.8-1.5', contractSize: '$20', leverage: '1:20' }, fundamentalDrivers: ['Tech Earnings', 'Yields', 'AI Sentiment'], tradingTips: ['Most volatile major index.', 'Highly sensitive to rates.'], relatedInstruments: ['sp-500', 'nvidia-nvda', 'bitcoin'], bestBrokerId: 'pepperstone', relevantCoursePhase: 'Phase 4' },
  { slug: 'dax-40', name: 'DAX 40', symbol: 'GER40', type: 'index', description: 'The benchmark index for the German economy.', keyFacts: { hours: '08:00-21:00', spread: '1.0-1.5', contractSize: '€25', leverage: '1:20' }, fundamentalDrivers: ['EU Growth', 'German Manufacturing', 'ECB Rates'], tradingTips: ['Correlates with SP500.', 'Heavy export focus.'], relatedInstruments: ['ftse-100', 'cac-40', 'eurusd'], bestBrokerId: 'ic-markets', relevantCoursePhase: 'Phase 3' },
  { slug: 'cac-40', name: 'CAC 40', symbol: 'FRA40', type: 'index', description: 'The benchmark French stock market index.', keyFacts: { hours: '08:00-16:30', spread: '1.0-2.0', contractSize: '€10', leverage: '1:20' }, fundamentalDrivers: ['Luxury Goods', 'EU Policy', 'Euro Strength'], tradingTips: ['Watch LVMH and luxury sector.', 'Closely tracks DAX.'], relatedInstruments: ['dax-40', 'ftse-100', 'eurusd'], bestBrokerId: 'pepperstone', relevantCoursePhase: 'Phase 3' },
  { slug: 'nikkei-225', name: 'Nikkei 225', symbol: 'JPN225', type: 'index', description: 'The primary index for the Tokyo Stock Exchange.', keyFacts: { hours: '00:00-06:00', spread: '5.0-8.0', contractSize: '¥1000', leverage: '1:20' }, fundamentalDrivers: ['BoJ Policy', 'Export Demand', 'JPY Strength'], tradingTips: ['Inverse to JPY.', 'Active during Asian session.'], relatedInstruments: ['hang-seng', 'usdjpy', 'sp-500'], bestBrokerId: 'ic-markets', relevantCoursePhase: 'Phase 3' },
  { slug: 'hang-seng', name: 'Hang Seng', symbol: 'HK50', type: 'index', description: 'The benchmark for Hong Kong listed companies.', keyFacts: { hours: '01:30-08:00', spread: '5.0-10.0', contractSize: '$50 HKD', leverage: '1:20' }, fundamentalDrivers: ['China GDP', 'HK Property', 'US-China Trade'], tradingTips: ['Extremely volatile.', 'China policy is king.'], relatedInstruments: ['nikkei-225', 'sp-500', 'audusd'], bestBrokerId: 'pepperstone', relevantCoursePhase: 'Phase 4' },

  // CRYPTO (8)
  {
    slug: 'bitcoin',
    name: 'Bitcoin (BTC)',
    symbol: 'BTCUSD',
    type: 'crypto',
    description: 'The first and largest cryptocurrency, viewed as "Digital Gold".',
    keyFacts: { hours: '24/7', spread: 'Variable', contractSize: '1 BTC', leverage: '1:2' },
    fundamentalDrivers: ['Adoption', 'Halving', 'Regulatory News'],
    tradingTips: ['Extremely high volatility.', 'Watch whale movements.', 'Weekend price action can be fake.'],
    relatedInstruments: ['ethereum', 'solana', 'nasdaq'],
    bestBrokerId: 'etoro',
    relevantCoursePhase: 'Phase 5'
  },
  { slug: 'ethereum', name: 'Ethereum (ETH)', symbol: 'ETHUSD', type: 'crypto', description: 'The leading smart contract platform.', keyFacts: { hours: '24/7', spread: 'Variable', contractSize: '1 ETH', leverage: '1:2' }, fundamentalDrivers: ['Network Upgrades', 'Gas Fees', 'DeFi Volume'], tradingTips: ['Correlates with BTC.', 'Staking demand is key.'], relatedInstruments: ['bitcoin', 'solana', 'chainlink'], bestBrokerId: 'etoro', relevantCoursePhase: 'Phase 5' },
  { slug: 'solana', name: 'Solana (SOL)', symbol: 'SOLUSD', type: 'crypto', description: 'High-speed layer 1 blockchain.', keyFacts: { hours: '24/7', spread: 'Variable', contractSize: '1 SOL', leverage: '1:2' }, fundamentalDrivers: ['TPS Stats', 'App Growth', 'Ecosystem Funding'], tradingTips: ['Outperforms in bull runs.', 'Watch for outages.'], relatedInstruments: ['bitcoin', 'ethereum', 'avalanche'], bestBrokerId: 'etoro', relevantCoursePhase: 'Phase 5' },
  { slug: 'xrp', name: 'XRP', symbol: 'XRPUSD', type: 'crypto', description: 'Digital asset for cross-border payments.', keyFacts: { hours: '24/7', spread: 'Variable', contractSize: '1 XRP', leverage: '1:2' }, fundamentalDrivers: ['SEC Lawsuit', 'Bank Partnerships', 'Utility'], tradingTips: ['Highly news dependent.', 'Fastest settlement.'], relatedInstruments: ['bitcoin', 'ethereum', 'cardano'], bestBrokerId: 'etoro', relevantCoursePhase: 'Phase 5' },
  { slug: 'cardano', name: 'Cardano (ADA)', symbol: 'ADAUSD', type: 'crypto', description: 'Peer-reviewed blockchain platform.', keyFacts: { hours: '24/7', spread: 'Variable', contractSize: '1 ADA', leverage: '1:2' }, fundamentalDrivers: ['Research Papers', 'Ecosystem Launch', 'Voting'], tradingTips: ['Slower momentum.', 'Strong community.'], relatedInstruments: ['ethereum', 'solana', 'polygon'], bestBrokerId: 'etoro', relevantCoursePhase: 'Phase 5' },
  { slug: 'polygon', name: 'Polygon (MATIC)', symbol: 'MATICUSD', type: 'crypto', description: 'Layer 2 scaling for Ethereum.', keyFacts: { hours: '24/7', spread: 'Variable', contractSize: '1 MATIC', leverage: '1:2' }, fundamentalDrivers: ['ETH Scaling Needs', 'Partnerships', 'Zk-Tech'], tradingTips: ['Proxy play on ETH.', 'High developer activity.'], relatedInstruments: ['ethereum', 'cardano', 'chainlink'], bestBrokerId: 'etoro', relevantCoursePhase: 'Phase 5' },
  { slug: 'avalanche', name: 'Avalanche (AVAX)', symbol: 'AVAXUSD', type: 'crypto', description: 'Eco-friendly smart contract platform.', keyFacts: { hours: '24/7', spread: 'Variable', contractSize: '1 AVAX', leverage: '1:2' }, fundamentalDrivers: ['Subnet Adoption', 'Total Value Locked', 'Funding'], tradingTips: ['Strong institutional interest.', 'High TVL focus.'], relatedInstruments: ['solana', 'ethereum', 'bitcoin'], bestBrokerId: 'etoro', relevantCoursePhase: 'Phase 5' },
  { slug: 'chainlink', name: 'Chainlink (LINK)', symbol: 'LINKUSD', type: 'crypto', description: 'The industry-standard oracle network.', keyFacts: { hours: '24/7', spread: 'Variable', contractSize: '1 LINK', leverage: '1:2' }, fundamentalDrivers: ['Oracle Demand', 'CCIP Integration', 'Staking'], tradingTips: ['Utility driven.', 'Vital for DeFi.'], relatedInstruments: ['ethereum', 'polygon', 'bitcoin'], bestBrokerId: 'etoro', relevantCoursePhase: 'Phase 5' },

  // COMMODITIES (8)
  { slug: 'gold-xauusd', name: 'Gold', symbol: 'XAUUSD', type: 'commodity', description: 'The ultimate safe-haven asset.', keyFacts: { hours: '23h', spread: '15-25c', contractSize: '100oz', leverage: '1:20' }, fundamentalDrivers: ['Real Rates', 'USD Strength', 'Geopolitics'], tradingTips: ['Inverse to USD.', 'Safe haven flows.', 'Watch NFP.'], relatedInstruments: ['silver-xagusd', 'usdchf', 'audusd'], bestBrokerId: 'xtb', relevantCoursePhase: 'Phase 4' },
  { slug: 'silver-xagusd', name: 'Silver', symbol: 'XAGUSD', type: 'commodity', description: 'Industrial and precious metal.', keyFacts: { hours: '23h', spread: '1-3c', contractSize: '5000oz', leverage: '1:10' }, fundamentalDrivers: ['Industrial Demand', 'Gold Ratio', 'Green Energy'], tradingTips: ['More volatile than Gold.', 'Gold/Silver ratio is key.'], relatedInstruments: ['gold-xauusd', 'copper', 'sp-500'], bestBrokerId: 'xtb', relevantCoursePhase: 'Phase 4' },
  { slug: 'crude-oil-wti', name: 'Crude Oil WTI', symbol: 'WTI', type: 'commodity', description: 'The US oil benchmark.', keyFacts: { hours: '23h', spread: '2-4c', contractSize: '1000bbl', leverage: '1:10' }, fundamentalDrivers: ['OPEC+', 'EIA Inventories', 'Demand'], tradingTips: ['NFP and EIA are key.', 'Correlates with CAD.'], relatedInstruments: ['crude-oil-brent', 'usdcad', 'gold-xauusd'], bestBrokerId: 'pepperstone', relevantCoursePhase: 'Phase 4' },
  { slug: 'crude-oil-brent', name: 'Crude Oil Brent', symbol: 'BRENT', type: 'commodity', description: 'The global oil benchmark.', keyFacts: { hours: '23h', spread: '2-4c', contractSize: '1000bbl', leverage: '1:10' }, fundamentalDrivers: ['Global Growth', 'Geopolitics', 'Shipping'], tradingTips: ['Watch Middle East news.', 'Premium to WTI usually.'], relatedInstruments: ['crude-oil-wti', 'gbpusd', 'ftse-100'], bestBrokerId: 'pepperstone', relevantCoursePhase: 'Phase 4' },
  { slug: 'natural-gas', name: 'Natural Gas', symbol: 'NATGAS', type: 'commodity', description: 'Global energy benchmark.', keyFacts: { hours: '23h', spread: 'Variable', contractSize: '10000MMBtu', leverage: '1:10' }, fundamentalDrivers: ['Weather', 'Storage Data', 'Geopolitics'], tradingTips: ['Extremely volatile.', 'Seasonal patterns.'], relatedInstruments: ['crude-oil-wti', 'dax-40', 'usdcad'], bestBrokerId: 'pepperstone', relevantCoursePhase: 'Phase 4' },
  { slug: 'copper', name: 'Copper', symbol: 'COPPER', type: 'commodity', description: 'The "Dr. Copper" indicator for global health.', keyFacts: { hours: '23h', spread: 'Variable', contractSize: '25000lbs', leverage: '1:10' }, fundamentalDrivers: ['China GDP', 'Industrial Output', 'Inventories'], tradingTips: ['Tracks global growth.', 'Correlates with AUD.'], relatedInstruments: ['gold-xauusd', 'audusd', 'ftse-100'], bestBrokerId: 'pepperstone', relevantCoursePhase: 'Phase 4' },
  { slug: 'platinum', name: 'Platinum', symbol: 'PLAT', type: 'commodity', description: 'Rare industrial metal.', keyFacts: { hours: '23h', spread: 'Variable', contractSize: '50oz', leverage: '1:10' }, fundamentalDrivers: ['Auto Industry', 'Mining Supply', 'USD'], tradingTips: ['Used in catalysts.', 'South Africa supply news.'], relatedInstruments: ['gold-xauusd', 'palladium', 'silver-xagusd'], bestBrokerId: 'xtb', relevantCoursePhase: 'Phase 4' },
  { slug: 'palladium', name: 'Palladium', symbol: 'PALL', type: 'commodity', description: 'Industrial metal for auto sector.', keyFacts: { hours: '23h', spread: 'Variable', contractSize: '100oz', leverage: '1:10' }, fundamentalDrivers: ['Auto Demand', 'Supply Chain', 'USD'], tradingTips: ['Highly volatile.', 'Critical for EVs.'], relatedInstruments: ['platinum', 'gold-xauusd', 'nvidia-nvda'], bestBrokerId: 'xtb', relevantCoursePhase: 'Phase 4' },

  // STOCKS (6)
  { slug: 'apple-aapl', name: 'Apple', symbol: 'AAPL', type: 'stock', description: 'The consumer tech giant.', keyFacts: { hours: '14:30-21:00', spread: 'Tight', contractSize: '1 Share', leverage: '1:5' }, fundamentalDrivers: ['iPhone Sales', 'Services Revenue', 'Yields'], tradingTips: ['Safe haven stock.', 'Massive buybacks.'], relatedInstruments: ['nasdaq', 'sp-500', 'microsoft-msft'], bestBrokerId: 'trading-212', relevantCoursePhase: 'Phase 4' },
  { slug: 'tesla-tsla', name: 'Tesla', symbol: 'TSLA', type: 'stock', description: 'The EV and AI leader.', keyFacts: { hours: '14:30-21:00', spread: 'Variable', contractSize: '1 Share', leverage: '1:5' }, fundamentalDrivers: ['Deliveries', 'Musk Tweets', 'AI Progress'], tradingTips: ['High emotion stock.', 'Massive volatility.'], relatedInstruments: ['nasdaq', 'nvidia-nvda', 'apple-aapl'], bestBrokerId: 'trading-212', relevantCoursePhase: 'Phase 4' },
  { slug: 'nvidia-nvda', name: 'Nvidia', symbol: 'NVDA', type: 'stock', description: 'The AI chip powerhouse.', keyFacts: { hours: '14:30-21:00', spread: 'Tight', contractSize: '1 Share', leverage: '1:5' }, fundamentalDrivers: ['Data Center Demand', 'AI Scaling', 'Capex'], tradingTips: ['Momentum king.', 'Earnings are massive.'], relatedInstruments: ['nasdaq', 'tesla-tsla', 'microsoft-msft'], bestBrokerId: 'trading-212', relevantCoursePhase: 'Phase 4' },
  { slug: 'amazon-amzn', name: 'Amazon', symbol: 'AMZN', type: 'stock', description: 'E-commerce and cloud leader.', keyFacts: { hours: '14:30-21:00', spread: 'Tight', contractSize: '1 Share', leverage: '1:5' }, fundamentalDrivers: ['AWS Growth', 'Retail Margins', 'Ad Revenue'], tradingTips: ['Proxy for US consumer.', 'AWS is the margin driver.'], relatedInstruments: ['nasdaq', 'sp-500', 'apple-aapl'], bestBrokerId: 'trading-212', relevantCoursePhase: 'Phase 4' },
  { slug: 'microsoft-msft', name: 'Microsoft', symbol: 'MSFT', type: 'stock', description: 'The enterprise software giant.', keyFacts: { hours: '14:30-21:00', spread: 'Tight', contractSize: '1 Share', leverage: '1:5' }, fundamentalDrivers: ['Azure Growth', 'AI Integration', 'Enterprise Spend'], tradingTips: ['Consistent compounder.', 'Lower volatility.'], relatedInstruments: ['nasdaq', 'apple-aapl', 'nvidia-nvda'], bestBrokerId: 'trading-212', relevantCoursePhase: 'Phase 4' },
  { slug: 'astrazeneca-azn', name: 'AstraZeneca', symbol: 'AZN', type: 'stock', description: 'The UK pharma leader.', keyFacts: { hours: '08:00-16:30', spread: 'Tight', contractSize: '1 Share', leverage: '1:5' }, fundamentalDrivers: ['Drug Pipeline', 'R&D Success', 'GBP/USD'], tradingTips: ['Defensive UK play.', 'Dividends are key.'], relatedInstruments: ['ftse-100', 'gbpusd', 'cac-40'], bestBrokerId: 'ig-index', relevantCoursePhase: 'Phase 3' }
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
