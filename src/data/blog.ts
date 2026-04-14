export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: "Psychology" | "Market Analysis" | "Education";
  date: string;
  readingTime: string;
  author: string;
  ogImage?: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "the-myth-of-the-100-percent-win-rate",
    title: "The Myth of the 100% Win Rate",
    category: "Psychology",
    date: "April 12, 2026",
    readingTime: "8 min",
    author: "Pete (Founder)",
    excerpt: "Why chasing perfection is the fastest way to blow your account, and what to focus on instead.",
    content: `
      <p>In the world of social media trading, we are constantly bombarded with screenshots of "100% win rate" strategies and perfectly green P&L charts. But in the reality of the institutions and high-level retail traders, a 100% win rate is not just impossible—it's irrelevant.</p>
      
      <h2>The Psychological Trap of Perfection</h2>
      <p>Human beings are biologically wired to dislike being wrong. From a young age, we are taught in schools that being 'right' is rewarded and being 'wrong' is penalized. When we bring this mentality into the markets, it becomes a lethal liability. The trader who needs to be right will hold onto a losing position far too long, hoping it will turn around 'just this once'. They will move their stop loss, add to a losing position, or take profit prematurely on a winner just to 'lock in' the win and soothe their ego.</p>
      <p>Chasing a 100% win rate is ultimately a defense mechanism against the ego-pain of losing. But the market doesn't care about your ego. The market only cares about supply, demand, and liquidity. Until you can detach your self-worth from the outcome of a single trade, you will always be at the mercy of your emotions.</p>

      <h2>The Profit Factor: The Real Metric That Matters</h2>
      <p>A trader with a 40% win rate can be significantly more profitable than a trader with an 80% win rate. It all comes down to the Risk-to-Reward Ratio (R:R). If your average win is £300 and your average loss is £100, you have a 3:1 R:R. At this ratio, you only need to be right 25% of the time to break even. If you are right 40% of the time, you are building wealth.</p>
      <p>Conversely, many 'high win rate' strategies achieved through wide stops and small take-profits eventually suffer a 'Black Swan' event where one single loss wipes out fifty winners. This is called 'picking up pennies in front of a steamroller'. It looks great on paper for months, but the drawdown is inevitable and catastrophic.</p>

      <h2>Embracing the Drawdown</h2>
      <p>To trade properly, you must embrace the drawdown. You must accept that losses are not failures—they are the operating costs of the business. Imagine a shop owner who views paying rent as a failure. They would never stay in business. In trading, your losses are your rent. They are the price you pay to be in the game for the next opportunity.</p>
      <p>Drawdown management is what separates the survivors from the casualties. Professional traders don't ask "How much can I make?" they ask "How much can I lose?". By focusing on capital preservation, the profits take care of themselves.</p>

      <h2>Practical Steps to Unlearn the Win Rate Obsession</h2>
      <p>1. <strong>Stop looking at daily P&L.</strong> Focus on your process. Did you follow your rules? If yes, the trade was a success regardless of the outcome.</p>
      <p>2. <strong>Calculate your expectancy.</strong> Use the formula: (Win % * Average Win) - (Loss % * Average Loss). If the number is positive, you have an edge. Trust it.</p>
      <p>3. <strong>Use a Trade Journal.</strong> When you see that your strategy actually works over 100 trades despite 40 losses, the individual losses lose their power over you.</p>
      <p>Drawdown isn't a failure. It's the truth of the market. Learn to trade properly by focusing on your process, not your perfection.</p>
    `
  },
  {
    slug: "understanding-boe-rate-decisions",
    title: "Understanding BoE Rate Decisions",
    category: "Market Analysis",
    date: "April 13, 2026",
    readingTime: "10 min",
    author: "Pete (Founder)",
    excerpt: "A deep dive into how the Bank of England's monetary policy affects the GBP and what you should look for in the next MPC meeting.",
    content: `
      <p>For traders in the UK, the Bank of England (BoE) is the ultimate market mover. The Monetary Policy Committee (MPC) meets eight times a year to decide the 'Bank Rate'—the interest rate that influences everything from mortgage rates to the value of the Pound in your pocket.</p>

      <h2>How Interest Rates Move Currencies</h2>
      <p>In basic terms, higher interest rates attract foreign capital. Investors want the best return on their holdings, so if the BoE raises rates relative to the US Federal Reserve or the European Central Bank, the Pound (GBP) becomes more attractive. This increased demand drives the price up.</p>
      <p>However, the market is forward-looking. The current rate decision is often already 'priced in'. What moves the market during the announcement is often the <strong>rhetoric</strong> in the MPC minutes and the Governor's speech. If the BoE raises rates but suggests they are finished with the hiking cycle (a 'dovish' hike), the GBP might actually fall.</p>

      <h2>Inflation: The BoE's Target</h2>
      <p>The BoE has a strict mandate from the Government to keep inflation at 2%. When inflation (measured by CPI) rises above this target, the BoE typically raises rates to cool the economy. When it falls too low, they lower rates to stimulate spending.</p>
      <p>As a trader, you aren't just watching the rate decision; you're watching the CPI data leading up to it. If CPI comes in higher than expected, the market will begin 'betting' on a rate hike, causing GBP to appreciate even before the MPC meets. This is why 'trading the news' is so dangerous—the big move often happens before the event itself.</p>

      <h2>The MPC Vote Count</h2>
      <p>The MPC consists of nine members. Their vote count is critical. A 9-0 unanimous decision shows clear intent. A 5-4 split decision suggests uncertainty and a divided committee. Traders look for 'hawks' (members who favor higher rates) and 'doves' (those who favor lower rates). If a known dove suddenly votes for a hike, pay attention—the trend is shifting.</p>

      <h2>How to Trade BoE Meetings Safely</h2>
      <p>1. <strong>Do not hold trades during the 12:00 PM GMT announcement.</strong> Liquidity thins out, and spreads can widen significantly. You can be right on the direction and still get stopped out by 'noise'.</p>
      <p>2. <strong>Watch the 10-year Gilt yields.</strong> If bond yields are rising, it confirms the market believes the BoE's hawkish stance.</p>
      <p>3. <strong>Read the summary, not just the number.</strong> The text tells the story of the next six months; the number only tells the story of today.</p>
    `
  },
  {
    slug: "why-you-need-a-trade-journal",
    title: "Why You Need a Trade Journal",
    category: "Education",
    date: "April 14, 2026",
    readingTime: "9 min",
    author: "Pete (Founder)",
    excerpt: "Data is your edge. Without a journal, you are just gambling. Learn how to track the right metrics to find your path to profitability.",
    content: `
      <p>Ask any professional trader what their most valuable tool is, and they won't say their charting software or their Bloomberg terminal. They will say their Trade Journal. Data is the only thing that separates a trader from a gambler.</p>

      <h2>The Mirror of Truth</h2>
      <p>A trade journal is more than just a list of entries and exits. it's a mirror that reflects your psychological state. When you look back at a month of trades, you will start to see patterns that your brain hides from you in the heat of the moment. You'll notice that you consistently lose money on Friday afternoons. You'll see that you frequently 'revenge trade' after a loss on GBPUSD.</p>
      <p>Without this data, you are flying blind. You might think you have a 'strategy problem' when you actually have a 'time-of-day problem' or a 'pair-selection problem'. The journal externalizes your process, allowing you to analyze it objectively.</p>

      <h2>The Metrics That Matter</h2>
      <p>A good journal tracks more than P&L. At Drawdown, we advocate tracking:</p>
      <ul>
        <li><strong>MAEO (Maximum Adverse Excursion):</strong> How far did the trade go against you before turning? This helps you refine your stop losses.</li>
        <li><strong>MFE (Maximum Favorable Excursion):</strong> How much profit did you leave on the table? This helps you refine your take profits.</li>
        <li><strong>Emotional State:</strong> Were you bored? Fearful? Impatient? Identifying the link between emotion and outcome is the key to psychological edge.</li>
      </ul>

      <h2>Turning Data into an Edge</h2>
      <p>Once you have 100 trades logged, you can begin to 'curate' your trading. You might find that if you simply stopped trading the London Open and only traded the New York overlap, your win rate would jump 15%. This is how you find your edge—not by searching for a new indicator, but by trimming the fat from your own performance.</p>
      <p>At Drawdown, we integrate AI into our journal to spot these patterns for you. But even a simple spreadsheet is better than nothing. Start logging today. Don't let your data go to waste.</p>
    `
  }
];
