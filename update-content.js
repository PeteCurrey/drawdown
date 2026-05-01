
const fs = require('fs');
const path = require('path');

const TOPICS_CONTENT = {
  "day-trading": {
    "sections": [
      {
        "heading": "What Day Trading Really Is",
        "text": "Day trading involves opening and closing financial positions within the same trading day. Unlike swing trading or investing, a day trader never holds a position overnight. The primary objective is to exploit small, highly liquid price movements during the most volatile hours of the day. Retail traders often view day trading as a fast-paced adrenaline rush. Professional day traders view it as incredibly boring. It is the repetitive execution of a strictly defined edge over hundreds of trades. The goal is not to 'make a killing' on a single trade, but to capture small, consistent percentage gains that compound over time. The biggest advantage of day trading is the elimination of 'overnight risk.' Because you close all positions before the market closes, you are completely immune to catastrophic news events that happen while you are asleep."
      },
      {
        "heading": "The Honest Reality",
        "text": "The internet will tell you that day trading is a path to quick wealth. The honest reality is that 90% of day traders fail within 90 days. It takes a minimum of 12 to 24 months of consistent, disciplined practice to achieve profitability. You will not get rich this week. You will blow an account. But if you survive the learning curve, build a strict mechanical edge, and treat it like a data-driven business, it is a highly scalable profession. Stop looking for shortcuts."
      },
      {
        "heading": "What You Actually Need to Start",
        "text": "You do not need six monitors and a Bloomberg terminal. You need three things: capital you can afford to lose, a fast execution platform, and a rigid data-collection system. We recommend starting with a minimum of £1,000 in a dedicated trading account to allow for proper position sizing. You need an ECN (Electronic Communication Network) broker with spreads under 0.2 pips on EUR/USD and a commission-based structure. Most importantly, you need a trade journal to track every entry and exit. You cannot improve what you do not measure."
      },
      {
        "heading": "The Core Mechanics",
        "text": "Day trading success depends on identifying high-probability windows of institutional volume. In the UK, this is the London Open (8:00 AM GMT) and the New York Open (1:00 PM GMT). During these times, liquidity is at its peak, allowing for tight spreads and clean price action. You must master market structure: identifying whether the market is trending (making higher highs and higher lows) or ranging. You execute trades based on 'confluence'—where multiple factors like support levels, trendlines, and candlestick patterns align simultaneously. Never trade 'the middle' of a range; wait for price to interact with established levels of institutional interest."
      },
      {
        "heading": "A Worked Example",
        "text": "Let’s look at a typical day trade on GBP/USD. Account Balance: £5,000. Risk per trade: 1% (£50). Entry: 1.2500. Stop Loss: 1.2480 (20 pips risk). Take Profit: 1.2540 (40 pips target). To risk exactly £50 on a 20-pip move, your position size is £2.50 per pip. If price hits your target, you profit £100 (a 2% account gain). If it hits your stop, you lose £50 (1%). This 1:2 risk-to-reward ratio is the foundation of institutional profitability."
      },
      {
        "heading": "Common Day Trading Mistakes",
        "text": "1. Revenge Trading: Trying to 'win back' money immediately after a loss by doubling your position size. 2. Over-trading: Taking 10+ trades a day because you are bored. A pro might only take 3 setups a week. 3. Moving Stop Losses: Widening your stop because you 'believe' the trade will turn around. This is gambling, not trading."
      },
      {
        "heading": "How Long Does It Take?",
        "text": "The learning curve is steep. Months 1-6: Pure learning and mechanical practice (usually losing or breaking even). Months 6-12: Developing discipline and identifying your specific edge. Year 2: Achieving consistency and scaling position size. This is a 24-month professional qualification, not a weekend hobby."
      },
      {
        "heading": "UK-Specific Considerations",
        "text": "The UK is the global hub for retail trading. Profits from Spread Betting are currently exempt from Capital Gains Tax (CGT) and Stamp Duty for UK residents. Additionally, there is no 'Pattern Day Trader' (PDT) rule in the UK, meaning you don’t need £25k to trade frequently. Always ensure your broker is FCA regulated to protect your funds under the FSCS scheme."
      }
    ],
    "faqs": [
      { "question": "Is day trading gambling?", "answer": "If you trade without an edge and risk management, yes. If you trade a proven system with strict 1% risk rules, it is a business." },
      { "question": "Can I day trade with £100?", "answer": "You can, but the math of 1% risk makes it nearly impossible to grow. £1,000 is the recommended minimum." },
      { "question": "What is the best time to trade in the UK?", "answer": "8:00 AM to 10:00 AM (London Open) and 1:00 PM to 4:00 PM (NY/London overlap)." },
      { "question": "Do I need to pay tax on my profits?", "answer": "If you use a Spread Betting account, profits are currently tax-free for UK residents." },
      { "question": "What is a 'Stop Loss'?", "answer": "A hard order that automatically closes your trade if price hits a certain level, capping your loss at 1%." },
      { "question": "Is day trading stressful?", "answer": "Only if you are over-leveraged. Proper risk management makes trading feel mechanical and boring." }
    ]
  },
  "forex-trading": {
    "sections": [
      {
        "heading": "What Forex Really Is",
        "text": "Forex (Foreign Exchange) is the global marketplace for exchanging national currencies. With a daily volume exceeding $7 trillion, it is the most liquid market on earth. For a retail trader, Forex is the art of speculating on the relative strength of one economy against another. If you think the UK economy will outperform the Eurozone, you buy GBP/EUR. myths of 'easy money' or 'bot trading' often cloud the reality: Forex is a zero-sum game where you are competing against the world’s largest central banks and institutional algorithms. Success requires understanding price action, macroeconomics, and the psychological discipline to execute a plan under pressure."
      },
      {
        "heading": "The Honest Reality",
        "text": "The Forex industry is heavily marketed as a 'get rich quick' scheme. The reality is that currency markets are hyper-efficient. Most retail traders lose money because they use too much leverage and have no statistical edge. Expect a 12-24 month learning curve. You are not just 'watching lines on a chart'; you are learning to read global capital flows."
      },
      {
        "heading": "What You Actually Need to Start",
        "text": "Start with a reputable FCA-regulated broker that offers 'Raw Spreads' (meaning they don't mark up the price). You need a modern charting platform like TradingView and a stable internet connection. Capital-wise, while you can start with £100, £2,000 is the benchmark for serious risk management. You must use an ECN broker to ensure your orders go directly to the market rather than against the broker's own desk."
      },
      {
        "heading": "The Core Mechanics",
        "text": "Forex trades in 'pairs' (e.g., EUR/USD). You buy the base currency and sell the quote currency. The market moves in 'pips'—the fourth decimal place of a currency's value. You must master the concept of 'confluence': looking for areas where support/resistance, trendlines, and economic data align. Technical analysis tells you when to enter; macroeconomics tells you why the market is moving. Ignore one at your peril."
      },
      {
        "heading": "A Worked Example",
        "text": "Trade: Long EUR/USD. Entry: 1.0850. Stop Loss: 1.0830 (20 pips). Target: 1.0890 (40 pips). Account: £10,000. Risk: 1% (£100). To risk exactly £100 on a 20-pip move, you trade 0.50 lots (50,000 units). If the price hits 1.0890, you profit £200. If it hits 1.0830, you lose £100. This is the only way to trade long-term without blowing your account."
      },
      {
        "heading": "Common Forex Mistakes",
        "text": "1. Over-leveraging: Using 500:1 leverage on a small account. One 20-pip move wipes you out. 2. Trading the News: Trying to guess the NFP or CPI outcome. Pro traders wait for the news to drop and trade the reaction. 3. Ignoring Correlations: Buying GBP/USD and EUR/USD simultaneously—effectively doubling your risk on the US Dollar."
      },
      {
        "heading": "How Long Does It Take?",
        "text": "It takes roughly 6 months to master the mechanics of your platform and basic technical analysis. It takes another 12 months to build the psychological discipline to follow a plan. Most traders don't find consistent profitability until year 2 or 3. This is a marathon, not a sprint."
      },
      {
        "heading": "UK-Specific Considerations",
        "text": "The UK is the global FX capital. UK traders benefit from being in the timezone where the most volume occurs. Spread betting FX is tax-free in the UK. Ensure your broker is FCA regulated, providing you with FSCS protection up to £85,000. US traders face much stricter 'No Hedging' and leverage rules that do not apply to UK retail traders."
      }
    ],
    "faqs": [
      { "question": "What is a 'Pip'?", "answer": "Percentage in Point. It’s the unit of measurement for currency movement, usually the 4th decimal place." },
      { "question": "Is Forex trading legal in the UK?", "answer": "Yes, and it is highly regulated by the FCA to protect retail consumers." },
      { "question": "How much leverage can I use?", "answer": "Under FCA rules, retail traders are capped at 30:1 for major currency pairs like EUR/USD." },
      { "question": "What are the 'Majors'?", "answer": "The most liquid pairs: EUR/USD, GBP/USD, USD/JPY, USD/CHF, AUD/USD, USD/CAD, and NZD/USD." },
      { "question": "Can I trade Forex on my phone?", "answer": "Yes, but serious analysis should always be done on a desktop for better clarity and precision." },
      { "question": "What is 'The Spread'?", "answer": "The difference between the Buy and Sell price. This is the broker's primary cost to you." }
    ]
  },
  "risk-management": {
    "sections": [
      {
        "heading": "What Risk Management Really Is",
        "text": "Risk management is the only thing that separates a trader from a gambler. In the markets, you have zero control over what the price does, but you have 100% control over how much you lose when you are wrong. It is the process of mathematically ensuring that no single trade, or series of trades, can ever blow your account. Most beginners focus on finding 'the perfect strategy'—the holy grail of entries. Professionals focus exclusively on the math of survival. You must view every trade as a business expense, where the risk is the cost of doing business."
      },
      {
        "heading": "The Honest Reality",
        "text": "The market is a random environment. You can have a 70% win rate and still lose 10 trades in a row. This is a statistical certainty over a large enough sample size. If you risk 10% per trade, you are guaranteed to blow your account eventually. If you risk 1%, you can survive 50 losses and still have half your capital."
      },
      {
        "heading": "What You Actually Need to Start",
        "text": "You need a Position Sizing Calculator (most platforms like TradingView have this built-in). You need a strict set of rules that you never break, no matter how 'sure' you feel about a setup. Start with a risk-per-trade of 0.5% to 1.0%. Never exceed 2% total risk on all open positions at any one time. This ensures that even during a 'Black Swan' event, your account remains intact."
      },
      {
        "heading": "The Core Mechanics",
        "text": "Risk management relies on two pillars: Position Sizing and Risk-to-Reward (R:R). Position sizing ensures that the dollar value of your stop loss always equals your chosen risk (e.g., £100). R:R ensures that your winners are always larger than your losers. If you risk £100 to make £200, you only need to win 34% of your trades to break even. This takes the pressure off 'being right' and puts the focus on 'being profitable.'"
      },
      {
        "heading": "A Worked Example",
        "text": "Scenario: You want to trade Gold. Account: £10,000. Risk: 1% (£100). Stop Loss: 50 points. Calculation: £100 risk / 50 points = £2.00 per point position size. This is fixed. If your stop loss was 100 points, your size would be £1.00 per point. The monetary risk (£100) stays the same; only the position size changes. This is how pros stay in the game."
      },
      {
        "heading": "Common Risk Mistakes",
        "text": "1. Widening Stop Losses: Moving your stop further away to avoid being 'hit.' This is the #1 cause of blown accounts. 2. Trading Without a Stop: 'I'll just close it manually.' You won't. You'll freeze like a deer in headlights. 3. Risking More to 'Make it Back': Revenge trading after a loss by increasing your risk to 5% or 10%."
      },
      {
        "heading": "How Long Does It Take?",
        "text": "Mastering the math takes 10 minutes. Mastering the discipline to actually follow it takes months. You will likely break your risk rules at least once—this is usually a painful lesson that costs money. The goal is to reach the point where following your risk rules is second nature, even during a losing streak."
      },
      {
        "heading": "UK-Specific Considerations",
        "text": "In the UK, FCA-regulated brokers are required to provide 'Negative Equity Protection' for retail accounts. This means you can never lose more than the money in your account. However, during extreme market crashes (like the 2015 Swiss Franc move), even these protections can be tested. Stick to regulated brokers and avoid offshore firms that don't offer these safety nets."
      }
    ],
    "faqs": [
      { "question": "What is the 1% Rule?", "answer": "The non-negotiable rule that you never risk more than 1% of your total account on any single trade." },
      { "question": "What is Risk-to-Reward Ratio?", "answer": "The amount you are willing to lose versus the amount you aim to win. Pro traders aim for 1:2 or higher." },
      { "question": "Can I trade without a stop loss?", "answer": "No. Not if you want to be a trader. Without a stop loss, you are just a gambler waiting to lose everything." },
      { "question": "Should I risk a fixed dollar amount or a percentage?", "answer": "Percentage is better because it automatically scales your risk as your account grows or shrinks." },
      { "question": "What is Drawdown?", "answer": "The percentage drop from your peak account balance to its lowest point during a losing streak." },
      { "question": "What is a Margin Call?", "answer": "When your losses exceed your available capital and the broker automatically closes your trades." }
    ]
  },
  "trading-psychology": {
    "sections": [
      {
        "heading": "What Trading Psychology Really Is",
        "text": "Trading is 20% strategy and 80% psychology. Your biggest enemy in the markets is not the 'manipulative' banks or the algorithm; it is your own biological hardwiring. Humans are evolved for survival, which means we are naturally prone to 'loss aversion' (feeling the pain of a loss twice as much as the joy of a win) and the 'fight or flight' response. In trading, these instincts are deadly. Psychology is the practice of developing a 'probabilistic mindset'—the ability to accept that any single trade could be a loser, and that's okay, because your edge plays out over time."
      },
      {
        "heading": "The Honest Reality",
        "text": "You will feel physical pain when you lose money. Your brain treats a financial loss like a physical injury. Most traders fail because they cannot handle this emotional volatility. They panic, they hesitate, and they make impulsive decisions. Achieving a 'zen-like' state where you don't care about the outcome of a single trade takes years of exposure."
      },
      {
        "heading": "What You Actually Need to Start",
        "text": "You need a 'Trading Journal' that tracks your emotions, not just your numbers. Ask yourself: 'How did I feel when I entered? Was I nervous? Was I chasing?' You also need a dedicated workspace free from distractions. Most importantly, you need 'Risk Capital'—money you truly do not need for your life. If you are trading with rent money, your psychology is already broken."
      },
      {
        "heading": "The Core Mechanics",
        "text": "Psychological mastery is built on three pillars: Acceptance of Risk, Discipline, and Emotional Regulation. Acceptance means truly understanding that losing is part of the job. Discipline means following your rules even when it's hard. Emotional regulation means noticing when you are becoming 'greedy' or 'fearful' and stepping away from the screen before you make a mistake. Trading should be boring. If it's exciting, you're doing it wrong."
      },
      {
        "heading": "A Worked Example",
        "text": "Imagine you have had 4 losing trades in a row. You have lost 4% of your account. Your biological urge is to double your risk to 'win it back.' This is the 'Gambler's Fallacy.' A professional trader looks at their journal, sees that their strategy has a 50% win rate, and understands that 4 losses in a row is mathematically normal. They take the 5th trade with the exact same risk as the first four. This is psychological edge."
      },
      {
        "heading": "Common Psychological Mistakes",
        "text": "1. FOMO (Fear Of Missing Out): Entering a trade after price has already moved because you're afraid you'll miss the profit. 2. Analysis Paralysis: Being so afraid of losing that you hesitate to pull the trigger on a valid setup. 3. Ego Trading: Refusing to admit you're wrong and 'hoping' the market will turn around."
      },
      {
        "heading": "How Long Does It Take?",
        "text": "This is the longest part of the journey. You can learn a strategy in a week, but it takes 12-24 months of real-market exposure to build the 'emotional callouses' required to trade professionally. There are no shortcuts here; you have to experience the pain to learn to manage it."
      },
      {
        "heading": "UK-Specific Considerations",
        "text": "UK culture often emphasizes 'safety' and 'job security.' This can make the transition to trading—where there is zero security—psychologically difficult. Surround yourself with a community of serious traders who treat it as a business. Use Spread Betting to keep your tax reporting simple, which removes one layer of psychological clutter from your trading life."
      }
    ],
    "faqs": [
      { "question": "Can I learn psychology from a book?", "answer": "Books like 'Trading in the Zone' are essential, but you can only truly learn by trading real money and feeling the emotions." },
      { "question": "Why do I freeze when it's time to enter?", "answer": "This is 'Analysis Paralysis.' It usually happens because you are risking too much money and are afraid of the loss." },
      { "question": "How do I stop revenge trading?", "answer": "Set a 'Daily Loss Limit.' If you lose 3% in a day, your platform should lock you out. Discipline is often built with external constraints." },
      { "question": "Is meditation helpful for trading?", "answer": "Yes. Developing self-awareness through meditation helps you notice when your 'lizard brain' is trying to take control." },
      { "question": "What is the 'Gambler's Fallacy'?", "answer": "The mistaken belief that if something happens more frequently than normal (like 5 losses), it will happen less frequently in the future." },
      { "question": "How do I stay disciplined?", "answer": "By having a written plan for every possible scenario. If X happens, I do Y. No thinking required." }
    ]
  },
  "spread-betting": {
    "sections": [
      {
        "heading": "What Spread Betting Really Is",
        "text": "Financial spread betting is a derivative product available exclusively to residents of the UK and Ireland. It allows you to speculate on the price movement of global markets without actually owning the underlying asset. Instead of buying shares or currency, you 'bet' a certain amount of money per 'point' of price movement. It is often misunderstood as 'gambling' because of its legal structure, but in the hands of a professional, it is a sophisticated, tax-efficient trading tool. It is the preferred vehicle for UK-based retail day and swing traders because it combines institutional-grade market access with unprecedented tax benefits."
      },
      {
        "heading": "The Honest Reality",
        "text": "Spread betting is a leveraged product. This means you can control large positions with small amounts of capital. The honest reality is that leverage is a double-edged sword. If you bet £10 per point and the market moves 100 points against you, you lose £1,000. Beginner traders often ignore the underlying 'notional value' of their bet and get wiped out by moves they didn't anticipate."
      },
      {
        "heading": "What You Actually Need to Start",
        "text": "You need an account with an FCA-regulated spread betting provider (like IG, Pepperstone, or CMC Markets). You need a minimum of £1,000 to manage risk effectively. Because spread betting is leveraged, you must understand 'margin'—the amount of money the broker 'locks' in your account to keep a trade open. Always ensure you have enough 'buffer' in your account to avoid a margin call."
      },
      {
        "heading": "The Core Mechanics",
        "text": "In spread betting, there is a 'Bid' (sell) price and an 'Offer' (buy) price. The difference is 'the spread.' You choose a stake size (e.g., £2 per point). If you go 'long' on the FTSE 100 at 7,500 and it rises to 7,550, you make 50 points x £2 = £100. If it falls to 7,450, you lose £100. The mechanics are simple, but the mastery lies in choosing the right stake size based on your stop-loss distance."
      },
      {
        "heading": "A Worked Example",
        "text": "Trade: Long GBP/USD. Entry: 1.2500. Stop Loss: 1.2450 (50 points). Account: £5,000. Risk: 1% (£50). To risk exactly £50 on a 50-point move, your stake size is £1.00 per point. If the price moves to 1.2600, you profit 100 points x £1 = £100. If it hits 1.2450, you lose £50. Notice how the stake size is derived directly from your risk and stop-loss distance."
      },
      {
        "heading": "Common Spread Betting Mistakes",
        "text": "1. Ignoring Notional Value: Not realizing that £5 per point on the FTSE is actually a £35k+ position. 2. Chasing 'Wide Spreads': Trading illiquid markets where the broker's spread is so wide you start 10% in the red. 3. Treating it like Gambling: Taking random 'punts' because the profits are tax-free."
      },
      {
        "heading": "How Long Does It Take?",
        "text": "You can understand the mechanics in an hour. Learning to manage the leverage and position sizing correctly usually takes 3-6 months of consistent practice. Most traders use spread betting as their primary vehicle for years because of the tax advantages, but it requires the same level of professional study as any other form of trading."
      },
      {
        "heading": "UK-Specific Considerations",
        "text": "This is the ultimate UK advantage. Profits from spread betting are currently exempt from Capital Gains Tax and Stamp Duty. However, if spread betting is your only source of income, HMRC may classify you as a 'professional trader,' potentially making profits taxable. Always consult a tax advisor. Also, ensure your broker is FCA regulated so you are protected by the FSCS up to £85,000."
      }
    ],
    "faqs": [
      { "question": "Is spread betting really tax-free?", "answer": "For most UK retail traders, yes. It is exempt from CGT and Stamp Duty." },
      { "question": "What is 'Stake Size'?", "answer": "The amount you win or lose for every single point the market moves." },
      { "question": "Is spread betting different from CFDs?", "answer": "The mechanics are similar, but CFDs are subject to Capital Gains Tax and have different commission structures." },
      { "question": "What happens if I lose more than my balance?", "answer": "FCA-regulated brokers provide 'Negative Equity Protection,' so you cannot lose more than you deposited." },
      { "question": "Can I spread bet on stocks?", "answer": "Yes, you can spread bet on thousands of UK and US shares." },
      { "question": "What is a 'Margin Call'?", "answer": "When your account balance falls below the required level to maintain your open positions, and the broker closes them." }
    ]
  },
  "technical-analysis": {
    "sections": [
      {
        "heading": "What Technical Analysis Really Is",
        "text": "Technical Analysis (TA) is the study of historical price action to identify patterns and trends that suggest future price movement. It is based on the premise that 'the market discounts everything'—meaning all known information (news, earnings, macroeconomics) is already reflected in the price. For a retail trader, TA is a tool for finding 'areas of value' where the probability of a certain move is higher than average. It is not a crystal ball. It is a visual representation of human psychology—greed, fear, and institutional order flow—recorded in real-time on a chart."
      },
      {
        "heading": "The Honest Reality",
        "text": "Most TA indicators (like RSI, MACD, or Moving Averages) are 'lagging'—they tell you what *happened*, not what *will* happen. If you simply buy when an indicator 'crosses,' you will lose money. TA is an art of reading context. A pattern that works in a trending market will fail in a ranging market. The honest reality is that TA only works because enough institutional participants use similar levels to enter and exit, creating 'self-fulfilling prophecies.'"
      },
      {
        "heading": "What You Actually Need to Start",
        "text": "You need a high-quality charting platform like TradingView. You need to learn the basics of 'Candlestick Charts'—how to read the Open, High, Low, and Close of every time period. Start with a clean chart. Avoid 'Indicator Soup' (having 10 indicators on one screen). You need to master the 3 core components: Support/Resistance, Trendlines, and Market Structure (Higher Highs and Lower Lows)."
      },
      {
        "heading": "The Core Mechanics",
        "text": "Technical analysis is about identifying 'areas of confluence.' You look for horizontal support/resistance levels that have been tested multiple times. You then look for a trendline that aligns with that level. Finally, you look for a candlestick pattern (like an engulfing bar) that confirms institutional interest at that exact spot. If you have 3-4 reasons to enter, you have a high-probability trade. TA is the filter that keeps you out of 'random' market noise."
      },
      {
        "heading": "A Worked Example",
        "text": "Scenario: EUR/USD is in an uptrend (making higher highs). Price pulls back to a previous resistance level at 1.1000, which should now act as Support. You see a 50-period Moving Average also crossing at 1.1000. As price hits the level, a 'Pin Bar' candle forms. You have 3 confluences: Previous Resistance/Support, Moving Average, and Candlestick Confirmation. This is a high-probability setup with a clear stop loss below the pin bar."
      },
      {
        "heading": "Common Technical Mistakes",
        "text": "1. Over-complicating: Adding too many indicators until they give conflicting signals. 2. Ignoring the Higher Timeframe: Buying a 'breakout' on the 5-minute chart while the 4-hour chart is in a massive downtrend. 3. Fitting the Data: Forcing a trendline to work by ignoring certain price wicks."
      },
      {
        "heading": "How Long Does It Take?",
        "text": "You can learn the basic patterns in a weekend. Learning to apply them consistently across different market conditions takes 6-12 months. The hardest part is learning when *not* to use TA—for example, during high-impact news events when technical levels are often ignored by institutional volatility."
      },
      {
        "heading": "UK-Specific Considerations",
        "text": "UK traders should pay special attention to 'London Session' high and low levels. These are significant technical markers that often dictate price action for the rest of the global day. Most institutional TA in the UK focuses on clean, horizontal levels and 'Value Areas' rather than complex retail indicators."
      }
    ],
    "faqs": [
      { "question": "Does Technical Analysis actually work?", "answer": "Yes, because it identifies where large groups of people (and algorithms) are likely to place orders." },
      { "question": "What is the best timeframe to use?", "answer": "The Daily and 4-Hour charts are the most reliable for identifying major trends." },
      { "question": "What is 'Support and Resistance'?", "answer": "Support is a price level where a downtrend tends to pause due to buying interest. Resistance is where an uptrend pauses due to selling interest." },
      { "question": "Should I use indicators?", "answer": "Indicators should only be used to confirm what the price action is already telling you. Price is king." },
      { "question": "What is a 'Trendline'?", "answer": "A line drawn over pivot highs or under pivot lows to show the prevailing direction of price." },
      { "question": "What is 'Market Structure'?", "answer": "The basic framework of the market: uptrends (HH/HL), downtrends (LH/LL), or ranging (sideways)." }
    ]
  },
  "candlestick-patterns": {
    "sections": [
      {
        "heading": "What Candlestick Patterns Really Is",
        "text": "Candlestick charts were developed in 18th-century Japan to trade rice, and they remain the most powerful way to visualize market psychology today. Each 'candle' tells a story of the battle between buyers (bulls) and sellers (bears) over a specific timeframe. A candlestick pattern is a specific combination of one or more candles that suggests a high probability of a price reversal or continuation. It is the 'DNA' of price action. For a retail trader, mastering these patterns is like learning to read the market's body language—it reveals when the trend is exhausting and when new institutional momentum is entering."
      },
      {
        "heading": "The Honest Reality",
        "text": "A candlestick pattern by itself is almost useless. A 'Hammer' candle in the middle of nowhere means nothing. The honest reality is that patterns only have meaning when they occur at 'Key Levels' (Support, Resistance, or Moving Averages). Most retail traders lose money because they see a pattern and instantly trade it without looking at the broader context. Patterns are the *trigger*, but the level is the *reason* for the trade."
      },
      {
        "heading": "What You Actually Need to Start",
        "text": "You need to understand the anatomy of a candle: The Body (distance between Open and Close) and the Wicks (the High and Low). A large body shows strength; a long wick shows rejection. You only need to master 3-5 high-probability patterns: The Pin Bar (rejection), The Engulfing Bar (momentum), and The Inside Bar (consolidation). Forget the complex 5-candle patterns; the simple ones are the most effective."
      },
      {
        "heading": "The Core Mechanics",
        "text": "Candlesticks reveal the 'Closing Price'—the most important data point of the session. If price tries to break a support level but fails and closes significantly higher, it creates a long lower wick. This is institutional 'absorption' of sell orders. You wait for the candle to *close* before making a decision. Trading an incomplete candle is a classic amateur mistake that leads to 'getting wicked out' of a position."
      },
      {
        "heading": "A Worked Example",
        "text": "Scenario: GBP/USD is approaching a major resistance level at 1.3000. The previous candles were large and green, showing bullish momentum. As it hits 1.3000, the next candle is small and then followed by a massive red candle that 'engulfs' the entire body of the previous one. This 'Bearish Engulfing' pattern at a major psychological level is a high-probability signal that the trend is reversing. You enter on the close of the engulfing candle with a stop loss above its high."
      },
      {
        "heading": "Common Candlestick Mistakes",
        "text": "1. Trading Incomplete Candles: Entering before the timeframe (e.g., 1 hour) has finished. 2. Ignoring Wick Length: Not realizing that a tiny body with huge wicks on both sides signifies extreme indecision, not a trend. 3. Pattern Overload: Trying to memorize 50 different Japanese names instead of understanding the underlying psychology of the wicks."
      },
      {
        "heading": "How Long Does It Take?",
        "text": "You can learn to identify the patterns in an hour. Learning to wait for them at the right levels and having the discipline to ignore them when they appear in the 'noise' takes 3-6 months. Candlestick mastery is about developing 'screen time'—watching how price reacts in real-time as these candles form."
      },
      {
        "heading": "UK-Specific Considerations",
        "text": "The 8:00 AM London Open candle is often one of the most important of the day. Its high and low frequently set the technical boundaries for the session. UK traders should also pay close attention to the 4-hour candle closes (8 AM, 12 PM, 4 PM GMT) as these are when major institutional flows are often recorded on the charts."
      }
    ],
    "faqs": [
      { "question": "What is the most powerful candlestick pattern?", "answer": "The Pin Bar (or Hammer/Shooting Star) is widely considered the most reliable reversal signal when found at key levels." },
      { "question": "Why do I need to wait for the candle to close?", "answer": "Because a candle can look like a reversal for 59 minutes and then completely change in the last 60 seconds. The close is the only confirmed data." },
      { "question": "What do long wicks mean?", "answer": "Wicks represent price rejection. A long upper wick means the market tried to go higher but was aggressively sold back down." },
      { "question": "Should I use candlesticks on the 1-minute chart?", "answer": "Patterns are much more reliable on higher timeframes (1-hour, 4-hour, Daily) where market noise is filtered out." },
      { "question": "What is an 'Engulfing' candle?", "answer": "A candle whose body completely covers the body of the previous candle, showing a total shift in momentum." },
      { "question": "Is the color of the candle important?", "answer": "Yes, but the relationship between the body and the wicks is often more important than the color itself." }
    ]
  }
};

const filePath = path.join(process.cwd(), 'src/lib/data/learn-to-trade.ts');
let content = fs.readFileSync(filePath, 'utf8');

for (const [slug, data] of Object.entries(TOPICS_CONTENT)) {
  const slugRegex = new RegExp(`slug:\\s*"${slug}"`, 'g');
  const startIndex = content.search(slugRegex);
  if (startIndex === -1) {
    console.error(`Could not find slug: ${slug}`);
    continue;
  }

  // Find content array and faqs array for this specific topic
  // This is a rough search, better to find the object bounds
  let objectEndIndex = content.indexOf('  },', startIndex);
  if (objectEndIndex === -1) objectEndIndex = content.length;

  const topicBlock = content.substring(startIndex, objectEndIndex);
  
  // Format content sections
  const newContentStr = JSON.stringify(data.sections, null, 2)
    .replace(/"([^"]+)":/g, '$1:') // remove quotes from keys
    .replace(/"/g, "'") // use single quotes
    .split('\n').map(line => '        ' + line).join('\n').trim();

  // Format faqs
  const newFaqsStr = JSON.stringify(data.faqs, null, 2)
    .replace(/"([^"]+)":/g, '$1:')
    .replace(/"/g, "'")
    .split('\n').map(line => '        ' + line).join('\n').trim();

  // Replace content property
  const contentRegex = /content:\s*\[[\s\S]*?\],/m;
  const faqsRegex = /faqs:\s*\[[\s\S]*?\]/m;

  let newTopicBlock = topicBlock.replace(contentRegex, `content: ${newContentStr},`);
  newTopicBlock = newTopicBlock.replace(faqsRegex, `faqs: ${newFaqsStr}`);

  content = content.substring(0, startIndex) + newTopicBlock + content.substring(objectEndIndex);
}

fs.writeFileSync(filePath, content);
console.log('Successfully updated all parent topic content.');
