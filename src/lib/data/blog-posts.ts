export interface BlogPost {
  slug: string;
  title: string;
  category: "Psychology" | "Market Analysis" | "Education";
  publishedAt: string;
  readingTime: number;
  author: string;
  excerpt: string;
  content: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "the-myth-of-the-100-percent-win-rate",
    title: "The Myth of the 100% Win Rate",
    category: "Psychology",
    publishedAt: "2026-04-12",
    readingTime: 5,
    author: "Pete",
    excerpt: "Why chasing perfection is the fastest way to blow your account, and what to focus on instead.",
    content: `
      <h2>The Number Everyone Obsesses Over</h2>
      <p>Ask any beginner trader what their goal is and most will say something like "I want to win every trade." It sounds logical. More wins equals more money, right?</p>
      <p>Wrong. Dead wrong. And this single misconception has blown more accounts than leverage ever has.</p>
      <p>Here's the truth that no guru will tell you: some of the most profitable traders in history have win rates below 50%. They lose more trades than they win — and they still make a fortune. How? Because win rate is only half the equation. The other half — and arguably the more important half — is risk-reward ratio.</p>

      <h2>The Maths That Changes Everything</h2>
      <p>Let's run a simple scenario. You take 100 trades. You win 40 of them and lose 60. That's a 40% win rate — sounds terrible, doesn't it?</p>
      <p>But here's the thing. Every time you win, you make £300. Every time you lose, you lose £100. Your risk-reward ratio is 1:3.</p>
      <p>The maths: (40 × £300) - (60 × £100) = £12,000 - £6,000 = £6,000 profit.</p>
      <p>A 40% win rate just made you six grand. Meanwhile, the trader chasing a 90% win rate is cutting winners short at £50 profit and holding losers until they hit £500. Their maths looks very different — and their account looks a lot emptier.</p>

      <h2>Why Beginners Chase 100%</h2>
      <p>It comes down to psychology. Losing feels bad. Every red trade feels like a personal failure. So beginners do everything they can to avoid that feeling — they take tiny profits the moment a trade goes green, they move stop losses to avoid getting stopped out, and they hold losing trades hoping they'll "come back."</p>
      <p>The result? They win lots of small trades and lose on a few massive ones. High win rate, negative P&L. The exact opposite of what works.</p>

      <h2>What Actually Matters</h2>
      <p>Instead of win rate, focus on these three metrics:</p>
      <p><strong>Profit Factor</strong> — your total gross profit divided by your total gross loss. Anything above 1.5 means your strategy has a genuine edge. Above 2.0 and you're in strong territory.</p>
      <p><strong>R-Multiple</strong> — how much you make per unit of risk. If you risk £100 and make £250, that's a 2.5R trade. Track your average R across all trades. If it's above 1.5R, you're doing well regardless of win rate.</p>
      <p><strong>Expectancy</strong> — the average amount you expect to make per trade over the long run. Calculated as: (Win Rate × Average Win) - (Loss Rate × Average Loss). If this number is positive, your strategy works. If it's negative, it doesn't — no matter how high your win rate is.</p>

      <h2>The Drawdown Approach</h2>
      <p>At Drawdown, we teach risk management before we teach entries. Phase 4 of our curriculum — "Staying Alive" — is entirely dedicated to position sizing, stop losses, and drawdown management. Because we believe the trader who survives the longest wins, not the trader who has the best week.</p>
      <p>Your win rate will fluctuate. Your discipline shouldn't.</p>
      <p>Stop counting wins. Start measuring edge.</p>
    `
  },
  {
    slug: "understanding-bank-of-england-rate-decisions",
    title: "Understanding BoE Rate Decisions",
    category: "Market Analysis",
    publishedAt: "2026-04-10",
    readingTime: 8,
    author: "Pete",
    excerpt: "How UK interest rate changes impact the GBP and how to position yourself for the volatility.",
    content: `
      <h2>Why Rate Decisions Move Markets</h2>
      <p>Eight times a year, the Bank of England's Monetary Policy Committee sits down and makes a decision that moves billions of pounds across global currency markets. Whether they raise rates, cut them, or hold — every outcome ripples through GBP pairs, UK equities, gilt yields, and even your spread betting margin requirements.</p>
      <p>If you're trading anything denominated in sterling, understanding how BoE rate decisions work isn't optional. It's survival.</p>

      <h2>How the MPC Works</h2>
      <p>The Monetary Policy Committee is made up of nine members — the Governor, three Deputy Governors, the Chief Economist, and four external members. They vote on the base rate, and the vote split often matters as much as the decision itself.</p>
      <p>A 9-0 hold tells a very different story to a 5-4 hold. The former says "we're comfortable." The latter says "we nearly moved — and next time we might."</p>
      <p>The minutes, published alongside the decision, reveal who voted which way and what their reasoning was. Hawkish language (concerns about inflation, mentions of tightening) tends to strengthen the pound. Dovish language (concerns about growth, mentions of easing) tends to weaken it.</p>

      <h2>The Three Scenarios</h2>
      <p><strong>Rate Hold (most common):</strong> When the BoE holds rates as expected, the reaction depends on the statement and vote split. A hawkish hold can strengthen GBP just as much as an actual hike. A dovish hold can weaken it. The market prices in expectations — so the surprise is in the language, not the decision.</p>
      <p><strong>Rate Hike:</strong> Typically strengthens GBP. Higher rates attract foreign capital seeking better yields. GBPUSD tends to spike, EURGBP tends to drop. But if the hike was already priced in, the reaction can be muted — or even reversed if the statement suggests "one and done."</p>
      <p><strong>Rate Cut:</strong> Typically weakens GBP. Lower rates push capital toward higher-yielding currencies. But again, context matters — a cut paired with optimistic forward guidance can limit the downside.</p>

      <h2>How to Trade It (Or How Not To)</h2>
      <p>Here's my honest advice: don't trade the announcement itself. The first 30 seconds after a rate decision are pure chaos — spreads blow out, liquidity vanishes, and you'll get filled at prices that make you want to throw your laptop.</p>
      <p>Instead, trade the reaction. Wait 15-30 minutes for the dust to settle. Watch how price responds to the key levels. If the move has conviction — sustained volume, clean break of structure — then consider positioning in the direction of the reaction.</p>
      <p>And always, always reduce your position size around events. This isn't the time for hero trades.</p>

      <h2>UK-Specific Considerations</h2>
      <p>If you're spread betting in the UK, rate decisions affect your overnight financing charges. Higher base rates mean higher financing costs for long positions. This matters if you're holding swing trades over multiple days or weeks.</p>
      <p>Also worth noting: spread betting profits are currently tax-free in the UK under HMRC rules (as of 2026), which makes sterling pairs particularly attractive for UK-based traders. But that's a tax benefit, not a reason to ignore risk management.</p>

      <h2>Where to Find BoE Dates</h2>
      <p>The Bank of England publishes its meeting schedule annually on bankofengland.co.uk. We also show upcoming BoE decisions in our Economic Calendar on the Markets page, with countdown timers and AI-powered event previews for Edge subscribers.</p>
      <p>Know the dates. Mark your calendar. Reduce risk beforehand. Trade the reaction, not the event.</p>
    `
  },
  {
    slug: "why-you-need-a-trade-journal",
    title: "Why You Need a Trade Journal",
    category: "Education",
    publishedAt: "2026-04-08",
    readingTime: 6,
    author: "Pete",
    excerpt: "If you aren't tracking your stats, you aren't trading — you're gambling. Here's how to start.",
    content: `
      <h2>The Difference Between Trading and Gambling</h2>
      <p>You want to know the single fastest way to tell if someone is a serious trader or just gambling with a chart open? Ask them about their last 50 trades.</p>
      <p>A gambler will tell you about the big win last Tuesday. A trader will tell you their win rate is 47%, their average R-multiple is 1.8, they perform 23% better during the London session, and their FOMO trades have a 28% win rate versus 61% when they're disciplined.</p>
      <p>The difference is a trade journal. And if you aren't keeping one, you're flying blind.</p>

      <h2>What Most Traders Get Wrong</h2>
      <p>Most traders who do journal make the same mistake: they only track the numbers. Entry, exit, P&L. That's a spreadsheet, not a journal.</p>
      <p>A real trade journal tracks the WHY behind every trade. Why did you enter? What was the setup? What was your emotional state? Were you following your plan or improvising? How did you feel when the trade was open? Did you move your stop loss?</p>
      <p>The numbers tell you what happened. The context tells you why it happened. And the "why" is where the real edge is hiding.</p>

      <h2>What to Log</h2>
      <p>Every trade, every time, no exceptions:</p>
      <p><strong>The basics:</strong> instrument, direction, entry price, exit price, position size, stop loss, take profit, P&L.</p>
      <p><strong>The context:</strong> which strategy you used, which session you traded, what the market conditions were, whether there was a news event.</p>
      <p><strong>The psychology:</strong> your emotional state when you entered (confident, anxious, FOMO, revenge, disciplined), your setup quality rating (1-5), and any notes about what you were thinking.</p>
      <p><strong>The screenshot:</strong> capture your chart at the time of entry. You'll thank yourself later when you're reviewing and can actually see what you were looking at.</p>

      <h2>What the Data Reveals</h2>
      <p>After 50 trades, patterns start emerging that you can't see in real time. Your journal might reveal that you lose 73% of trades taken in the first 15 minutes of market open — meaning your "early morning scalps" are actually draining your account. Or that your win rate on GBPUSD is 62% but only 34% on EURJPY — meaning you should stop trading euro-yen.</p>
      <p>One of the most powerful insights is the emotional correlation. At Drawdown, our AI Trade Journal tracks your P&L broken down by emotional state. And almost every trader who uses it discovers the same thing: their FOMO trades are catastrophic, and their most profitable trades are the ones where they felt calm and disciplined.</p>
      <p>That's not a coincidence. That's data telling you exactly what to fix.</p>

      <h2>Getting Started</h2>
      <p>You don't need fancy software to start. A Google Sheet works fine. Create columns for everything I listed above and commit to logging every single trade — winners and losers. Especially the losers.</p>
      <p>If you want something more powerful, our AI Trade Journal does the heavy lifting for you. It logs your trades, tracks your emotional state, generates a calendar heatmap of your P&L, and after 20+ trades, uses AI to identify the patterns that are costing you money and the habits that are making you money.</p>
      <p>But whatever you use — start today. Not next week. Today.</p>
      <p>If you can't explain why you entered a trade, you shouldn't have entered it. And if you can't explain why you lost, you'll lose the same way again tomorrow.</p>
    `
  }
];
