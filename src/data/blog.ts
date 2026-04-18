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
      <p>In the world of social media trading, we are constantly bombarded with screenshots of "100% win rate" strategies and perfectly green P&L charts. But in the reality of the institutions and high-level retail traders, a 100% win rate is not just impossible—it's irrelevant. Chasing it is the fastest way to blow your account and burn out your mental capital.</p>
      
      <h2>The Psychological Trap of Perfection</h2>
      <p>Human beings are biologically wired to dislike being wrong. From a young age, we are taught in schools that being 'right' is rewarded and being 'wrong' is penalized. When we bring this mentality into the markets, it becomes a lethal liability. The trader who needs to be right will hold onto a losing position far too long, hoping it will turn around 'just this once'. They will move their stop loss, add to a losing position, or take profit prematurely on a winner just to 'lock in' the win and soothe their ego.</p>
      <p>Chasing a 100% win rate is ultimately a defense mechanism against the ego-pain of losing. But the market doesn't care about your ego. The market only cares about supply, demand, and liquidity. Until you can detach your self-worth from the outcome of a single trade, you will always be at the mercy of your emotions. If you win 99 trades and lose 1 because you didn't have a stop loss, you are down money. That's the cold, hard truth of the 100% chaser.</p>
      <p>Look at it like this: If you're obsessing over win rate, you're looking at the wrong map. You're trying to achieve a perfect record rather than a profitable one. I've seen traders with 90% win rates lose their entire house because their 10% of losses were catastrophic. Conversely, I know professionals who lose six out of ten trades but drive a Porsche because their wins are massive. Which one do you want to be?</p>

      <h2>The Profit Factor: The Real Metric That Matters</h2>
      <p>A trader with a 40% win rate can be significantly more profitable than a trader with an 80% win rate. It all comes down to the Risk-to-Reward Ratio (R:R). If your average win is £300 and your average loss is £100, you have a 3:1 R:R. At this ratio, you only need to be right 25% of the time to break even. If you are right 40% of the time, you are building wealth.</p>
      <p>Let's do the maths. If you win 4 out of 10 trades with a 3:1 reward-to-risk, and you risk £100 per trade:
      <ul>
        <li>4 wins x £300 = £1,200</li>
        <li>6 losses x £100 = £600</li>
        <li>Total Profit = £600</li>
      </ul>
      That's a 60% return on your total risk, despite losing more than half the time. This is what 'edge' looks like. It's not about being right; it's about being profitable.</p>
      <p>Conversely, many 'high win rate' strategies achieved through wide stops and small take-profits eventually suffer a 'Black Swan' event where one single loss wipes out fifty winners. This is called 'picking up pennies in front of a steamroller'. It looks great on paper for months, but the drawdown is inevitable and catastrophic. You can't outrun the maths forever.</p>

      <h2>Embracing the Drawdown</h2>
      <p>To trade properly, you must embrace the drawdown. You must accept that losses are not failures—they are the operating costs of the business. Imagine a shop owner who views paying rent as a failure. They would never stay in business. In trading, your losses are your rent. They are the price you pay to be in the game for the next opportunity.</p>
      <p>Drawdown management is what separates the survivors from the casualties. Professional traders don't ask "How much can I make?" they ask "How much can I lose?". By focusing on capital preservation, the profits take care of themselves. When you see a drawdown of 10% or 15%, the amateur panics and changes their strategy. The professional looks at their data, confirms their edge is still valid, and keeps clicking the mouse.</p>
      <p>If you haven't sat through a string of three, four, or five losses in a row, you haven't traded enough yet. It will happen. And if your ego can't handle it, the market will take everything you have. The discipline to stick to a proven process during a losing streak is the only thing that will get you to the other side.</p>

      <h2>Practical Steps to Unlearn the Win Rate Obsession</h2>
      <p>1. <strong>Stop looking at daily P&L.</strong> Focus on your process. Did you follow your rules? Did you enter where you said you would? Did you exit where you said you would? If yes, the trade was a success regardless of the outcome. You are building the habit of discipline, which is worth more than any single trade's profit.</p>
      <p>2. <strong>Calculate your expectancy.</strong> Use the formula: (Win % * Average Win) - (Loss % * Average Loss). If the number is positive, you have an edge. Trust it. If it's negative, your strategy is broken, or your R:R is too low. No amount of positive thinking or 'strong bias' will save a negative expectancy strategy.</p>
      <p>3. <strong>Use a Trade Journal.</strong> This is non-negotiable. When you see that your strategy actually works over a sample size of 100 trades, despite 40 or 50 losses, those individual losses lose their power over you. They just become data points in a larger, profitable curve. At Drawdown, we advocate tracking not just the result, but your MAEO (Maximum Adverse Excursion)—how much heat you took before the trade worked. If you're getting stopped out but the trade eventually goes to target, your stops are too tight or your entries are premature. That's a data-driven fix, not an emotional one.</p>
      <p>Drawdown isn't a failure. It's the truth of the market. It's the friction of capitalism. Stop counting wins. Start measuring edge. The moment you stop trying to be 100% right is the moment you start making 100% certain progress as a professional.</p>
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
      <p>For traders in the UK, the Bank of England (BoE) is the ultimate market mover. While the US Fed gets all the global headlines, it's the Monetary Policy Committee (MPC) in Threadneedle Street that dictates the volatility in the Pound. They meet eight times a year to decide the 'Bank Rate'—the interest rate that influences everything from mortgage rates to the value of the Sterling in your pocket.</p>

      <h2>How Interest Rates Move Currencies</h2>
      <p>In basic terms, higher interest rates attract foreign capital. Investors want the best return on their holdings, so if the BoE raises rates relative to the US Federal Reserve or the European Central Bank, the Pound (GBP) becomes more attractive. This increased demand drives the price up. It's simple supply and demand, scaled to a global level.</p>
      <p>However, the market is forward-looking. By the time the news hits the BBC, the big money has usually already made its move. The current rate decision is often already 'priced in'. What moves the market during the announcement is often the <strong>rhetoric</strong> in the MPC minutes and the Governor's speech. If the BoE raises rates but suggests they are finished with the hiking cycle (a 'dovish' hike), the GBP might actually fall. This is why you see "Good News" lead to a price drop—it wasn't as good as the market expected.</p>

      <h2>Inflation: The BoE's Target</h2>
      <p>The BoE has a strict mandate from the Government to keep inflation at 2%. This is their only real job. When inflation (measured by CPI) rises above this target, the BoE typically raises rates to cool the economy. When it falls too low, they lower rates to stimulate spending. As a UK trader, your eyes shouldn't just be on the BoE dates, but on the CPI releases that precede them.</p>
      <p>Wait for the data. If CPI comes in higher than expected, the market will begin 'betting' on a rate hike at the next meeting, causing GBP to appreciate even before the MPC meets. This is why 'trading the news' is so dangerous for retail traders—the big move often happens before the event itself. If you're trying to click 'buy' at 12:00:01 PM on rate day, you're competing with algorithms that have already processed the news and executed trades in milliseconds.</p>

      <h2>The MPC Vote Count</h2>
      <p>The MPC consists of nine members. Their vote count is critical. A 9-0 unanimous decision shows clear intent and institutional stability. A 5-4 split decision suggests uncertainty and a divided committee, which usually leads to massive volatility as the market tries to guess who will flip sides next time. Traders look for 'hawks' (members who favor higher rates to combat inflation) and 'doves' (those who favor lower rates to support growth). If a known dove suddenly votes for a hike, pay attention—the trend is shifting.</p>
      <p>You also need to understand the "Pathway." The BoE doesn't just look at today; they look at the next two years. Their forecasts for GDP growth and unemployment tell you how aggressive they are likely to be. If they forecast a recession but raise rates anyway, they are prioritising the currency's value over the domestic economy. That's a high-conviction signal for GBP strength.</p>

      <h2>How to Trade BoE Meetings Safely</h2>
      <p>1. <strong>Do not hold trades during the 12:00 PM GMT announcement.</strong> Spreads on GBPUSD or EURGBP can widen from 1 pip to 20 pips in a heartbeat. You can be 100% right on the direction and still get stopped out because liquidity thinned out and the spread hit your stop. It's not worth it. Wait for the dust to settle.</p>
      <p>2. <strong>Watch the 10-year Gilt yields.</strong> If bond yields are rising, it confirms the market believes the BoE's hawkish stance. If the BoE says they are being aggressive but the bond market isn't moving, the market doesn't believe them. Always trust the bond market over the press release.</p>
      <p>3. <strong>Read the summary, not just the number.</strong> The text tells the story of the next six months; the number only tells the story of today. Look for phrases like "further tightening may be required" (bullish) or "inflationary pressures are easing" (bearish).</p>
      <p>UK trading requires a UK-specific perspective. Don't try to trade the Pound using US-centric logic. Understand the BoE, watch the CPI, and keep your risk small when the big announcements are due. Protect your capital first.</p>
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
      <p>Ask any professional trader what their most valuable tool is, and they won't say their charting software or their Bloomberg terminal. They will say their Trade Journal. They might call it a ledger, a log, or a diary, but the purpose is the same: Data is the only thing that separates a trader from a gambler. If you aren't tracking your stats, you aren't trading; you're just clicking buttons and hoping for the best.</p>

      <h2>The Mirror of Truth</h2>
      <p>A trade journal is more than just a list of entries and exits. It's a mirror that reflects your psychological state. When you look back at a month of trades, you will start to see patterns that your brain hides from you in the heat of the moment. You'll notice that you consistently lose money on Friday afternoons when your focus is slipping. You'll see that you frequently 'revenge trade' after a loss on GBPUSD because you feel the pair 'owes' you something. It doesn't.</p>
      <p>Without this data, you are flying blind. You might think you have a 'strategy problem' when you actually have a 'time-of-day problem' or a 'pair-selection problem'. The journal externalizes your process, allowing you to analyze it objectively. Most traders fail because they can't see their own mistakes. A journal makes those mistakes impossible to ignore.</p>
      <p>I tell all our members the same thing: If you can't explain why you entered a trade, and you can't show me the data that supports that setup over 100 repetitions, you shouldn't have entered it. It's that simple. The journal is where you prove to yourself that you have a reason to be in the market.</p>

      <h2>The Metrics That Matter</h2>
      <p>A good journal tracks much more than P&L. Total profit is a vanity metric; it doesn't tell you if your process is sustainable. At Drawdown, we advocate tracking these three critical data points:
      <ul>
        <li><strong>MAEO (Maximum Adverse Excursion):</strong> How far did the trade go against you before it turned? If your average MAEO is 20 pips but your stop loss is 50 pips, you're leaving a lot of capital exposed for no reason. Refine your stops based on where the trade actually fails, not where you feel safe.</li>
        <li><strong>MFE (Maximum Favorable Excursion):</strong> How much profit did you actually leave on the table? Did the trade hit your 2:1 target and then run for 10:1? If your MFE is consistently much higher than your actual results, your exit strategy is too conservative. You're cutting your winners too short.</li>
        <li><strong>Emotional State:</strong> Were you bored? Fearful? Impatient? Identifying the link between emotion and outcome is the key to psychological edge. If 80% of your 'Impatience' trades end in a loss, the fix isn't a new indicator—it's a walk away from the screens.</li>
      </ul></p>

      <h2>Turning Data into an Edge</h2>
      <p>Once you have 100 trades logged, you can begin to 'curate' your trading. This is where you move from amateur to professional. You might find that if you simply stopped trading the London Open and only traded the New York overlap, your win rate would jump 15%. Or you might find that you're an expert at trading GBPUSD but a disaster at GOLD. So, stop trading GOLD. That's a decision based on hard facts, not a 'feeling'.</p>
      <p>This is how you find your edge—not by searching for a new 'holy grail' indicator on YouTube, but by trimming the fat from your own performance. Success in trading is a process of subtraction. You stop doing the things that lose you money, and you do more of the things that make you money. But you can't subtract what you don't measure.</p>
      <p>At Drawdown, we integrate AI into our journal to spot these patterns for you automatically, but even a simple spreadsheet or a physical notebook is better than nothing. Start logging today. Every trade you don't log is a missed lesson. Don't let your data go to waste. "The best time to start journaling was a year ago; the second best time is right now."</p>
      <p>Protect your capital. The opportunities will come. But only the traders with the data to recognize them will actually profit.</p>
    `
  }
];
