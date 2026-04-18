export interface AnalysisPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  type: "daily" | "weekly" | "spotlight";
  date: string;
  instrument?: string;
  published: boolean;
}

export const expertAnalysis: AnalysisPost[] = [
  {
    slug: "daily-brief-april-18-cable-at-the-crossroads",
    title: "Daily Brief: Cable at the Crossroads",
    type: "daily",
    date: "2026-04-18",
    instrument: "GBPUSD",
    excerpt: "Sterling remains resilient above 1.2420 despite BoE cautiousness. Here's why I'm looking for a liquidity sweep below the Asian low.",
    published: true,
    content: `
      <p>Today's focus is squarely on the Sterling. Despite a relatively quiet economic calendar for the next 48 hours, the price action on GBPUSD is telling a story of institutional accumulation. We've seen three failed attempts to break below the 1.2400 handle, each met with aggressive buy-side liquidity.</p>
      
      <h3>The Setup</h3>
      <p>I'm watching the 1.2420 - 1.2440 range. We have a clear 'Fair Value Gap' on the 4-hour chart that needs to be filled. My bias is bullish for the session, but only if we see a clean sweep of the early London lows to clear out the retail stops before the New York crossover.</p>
      
      <h3>Risk Watch</h3>
      <p>The primary risk today is the US Gilt auction later this afternoon. If we see a spike in US yields, the DXY will catch a bid, which could invalidate our Cable long idea. Keep your stops tight and remember: no trade is also a trade.</p>
    `
  },
  {
    slug: "weekly-navigator-the-inflation-pivot",
    title: "Weekly Navigator: The Inflation Pivot",
    type: "weekly",
    date: "2026-04-15",
    excerpt: "The master guide for the week ahead. We analyze the shift in global inflation expectations and how it's repricing the FTSE 100.",
    published: true,
    content: `
      <p>Welcome to this week's Navigator. The theme for the next five sessions is 'The Great Repricing'. As inflation data from the Eurozone comes in softer than expected, the market is beginning to pivot its expectations for central bank action in the second half of the year.</p>
      
      <h3>Equities: FTSE 100 Strength</h3>
      <p>The UK index is showing remarkable strength in the energy and banking sectors. I'm targeting a move towards 8,200 by month-end, provided we hold the support at 7,850. The dividend yields on the 'Big Six' remain too attractive for the big funds to ignore in this environment.</p>
      
      <h3>Forex: Euro Weakness</h3>
      <p>The EURGBP pair is at a critical juncture. We're approaching the multi-year support at 0.8500. A break here opens the doors for a significant Sterling run. I'm looking for short opportunities on every relief rally in the Euro this week.</p>
    `
  }
];
