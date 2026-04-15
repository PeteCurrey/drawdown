const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'uk-markets': ['FTSE', 'London Stock Exchange', 'LSE', 'UK economy', 'Bank of England', 'BoE', 'sterling', 'GBP', 'HMRC', 'UK GDP', 'UK inflation', 'UK interest rate', 'chancellor', 'treasury', 'gilt', 'FTSE 100', 'FTSE 250', 'AIM'],
  'us-markets': ['S&P 500', 'Dow Jones', 'NASDAQ', 'NYSE', 'Wall Street', 'Fed', 'Federal Reserve', 'US economy', 'US GDP', 'US inflation', 'Jerome Powell', 'Treasury', 'US jobs', 'nonfarm', 'NFP'],
  'forex': ['forex', 'FX', 'currency', 'GBPUSD', 'EURUSD', 'USDJPY', 'exchange rate', 'pip', 'central bank', 'rate decision', 'monetary policy', 'dollar', 'euro', 'yen', 'pound'],
  'crypto': ['bitcoin', 'BTC', 'ethereum', 'ETH', 'crypto', 'blockchain', 'altcoin', 'DeFi', 'Binance', 'Coinbase', 'stablecoin', 'NFT', 'Web3', 'Solana', 'XRP'],
  'commodities': ['gold', 'XAUUSD', 'oil', 'crude', 'WTI', 'Brent', 'silver', 'copper', 'commodity', 'OPEC', 'natural gas', 'wheat', 'agriculture'],
  'world-economy': ['GDP', 'inflation', 'recession', 'trade war', 'tariff', 'IMF', 'World Bank', 'G7', 'G20', 'ECB', 'emerging markets', 'China economy', 'global growth', 'supply chain'],
};

export function categoriseArticle(title: string, excerpt: string): string[] {
  const text = `${title} ${excerpt}`.toLowerCase();
  const categories: string[] = [];
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(kw => text.includes(kw.toLowerCase()))) {
      categories.push(category);
    }
  }
  
  return categories.length > 0 ? categories : ['world-economy']; // default fallback
}
