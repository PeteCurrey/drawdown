import { RichBlock, ProTipBlock, StatCalloutBlock, RiskWarningBlock, ToolCardBlock, BrokerCardBlock, TradeExampleBlock } from "@/lib/data/learn-to-trade";

export interface GlossaryTerm {
  term: string;
  slug: string;
  definition: string;
  detailedExplanation: string;
  example: string;
  richBlocks?: RichBlock[];
  relatedTerms: string[];
  relatedCoursePhase?: string;
  relatedTool?: string;
  faqs: {
    question: string;
    answer: string;
  }[];
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'Pip',
    slug: 'pip',
    definition: 'A "pip" (percentage in point) is the foundational unit of measurement in forex trading, representing the smallest standard price move in an exchange rate.',
    detailedExplanation: 'If you cannot calculate pip value instantly, you have no business trading live capital. \n\nFor most currency pairs (like GBP/USD or EUR/USD), a pip is the fourth decimal place. A move from 1.2500 to 1.2501 is exactly one pip. For pairs containing the Japanese Yen (JPY), the pip is the second decimal place (e.g., a move from 150.00 to 150.01). \n\nUnderstanding pips is the absolute bedrock of risk management. Without knowing exactly how much a 10-pip stop loss will cost you in cold, hard cash, you are not trading—you are gambling blindly.',
    example: 'If you go long on GBP/USD at 1.2600 and your take profit is hit at 1.2650, you have captured 50 pips of profit. If you risked £10 per pip, that is a £500 gain.',
    richBlocks: [
      {
        type: 'proTip',
        tip: 'Modern brokers use 5-digit pricing (or 3-digit for JPY). The final digit is a "pipette" (a tenth of a pip). Do not confuse pipettes with pips when setting your stop loss in MT4/MT5, or your stop will be 10x tighter than intended.'
      } as ProTipBlock,
      {
        type: 'statCallout',
        stat: '10 Pipettes = 1 Pip',
        context: 'If EUR/USD moves from 1.08000 to 1.08005, it has moved 5 pipettes (0.5 pips).',
        source: 'Pricing Mechanics'
      } as StatCalloutBlock
    ],
    relatedTerms: ['Spread', 'Lot Size', 'Leverage'],
    relatedCoursePhase: 'Phase 1: Foundations',
    relatedTool: 'Risk Calculator',
    faqs: [
      {
        question: 'What is a pipette?',
        answer: 'A pipette is a fractional pip, usually the 5th decimal place (or 3rd for JPY pairs). 10 pipettes make up 1 pip.'
      }
    ]
  },
  {
    term: 'Spread',
    slug: 'spread',
    definition: 'The spread is the difference between the bid (sell) price and the ask (buy) price. It is the immediate cost of executing a trade.',
    detailedExplanation: 'The spread is the broker’s primary source of revenue. When you open a trade, you are immediately down by the cost of the spread. If the EUR/USD bid price is 1.0800 and the ask price is 1.0801, the spread is 1 pip. \n\nSpreads are variable. During high-impact news events (like NFP or CPI), brokers pull their liquidity, causing spreads to "widen" massively. A spread that is normally 1 pip can instantly widen to 20 pips. This is why trading directly through news announcements is notoriously dangerous and often leads to catastrophic slippage on your stop loss.',
    example: 'You buy the FTSE 100 at 7601 (ask) while the sell price is 7600 (bid). You are instantly down 1 point. The market must move up 1 point just for you to break even.',
    richBlocks: [
      {
        type: 'riskWarning',
        message: 'Beware of "Zero Spread" accounts. Brokers will often advertise 0.0 pip spreads, but they compensate by charging a massive flat commission per lot traded. Always calculate the total cost of the trade (Spread + Commission).'
      } as RiskWarningBlock,
      {
        type: 'proTip',
        tip: 'Never hold a short-term day trade over the weekend. Spreads frequently widen to ridiculous levels when the market re-opens on Sunday night, easily triggering stop losses before the price stabilizes.'
      } as ProTipBlock
    ],
    relatedTerms: ['Pip', 'Liquidity', 'Slippage'],
    relatedCoursePhase: 'Phase 1: Foundations',
    faqs: [
      {
        question: 'Why does the spread change?',
        answer: 'Spreads are typically "variable," meaning they widen during periods of low liquidity or high volatility (like major news announcements).'
      }
    ]
  },
  {
    term: 'Lot Size',
    slug: 'lot-size',
    definition: 'A lot is the standardized unit used to measure the volume of a trade. It dictates exactly how much money each pip of movement is worth.',
    detailedExplanation: 'You do not buy "100 pounds" of a currency. You buy lots. \n\nIn Forex, a Standard Lot is 100,000 units of the base currency. A Mini Lot (0.1) is 10,000 units, and a Micro Lot (0.01) is 1,000 units. \n\nIf your account size is £1,000 and you open a 1.0 Standard Lot, you are massively over-leveraged. For a Standard Lot on EUR/USD, every pip movement is worth roughly $10. A standard 20-pip stop loss would cost you $200 (20% of your account). Position sizing based on lot size is the only mathematical way to ensure you never risk more than 1% of your account per trade.',
    example: 'You want to risk £50 on a trade with a 20-pip stop loss. You calculate that each pip must be worth £2.50. You adjust your lot size accordingly (roughly 0.25 lots) before entering the trade.',
    richBlocks: [
      {
        type: 'statCallout',
        stat: '1.0 Lot = 100,000 Units',
        context: 'For most major USD-quote pairs, trading 1 Standard Lot means 1 pip of movement equals exactly $10.',
        source: 'Volume Metrics'
      } as StatCalloutBlock,
      {
        type: 'toolCard',
        toolSlug: 'position-size-calculator',
        toolName: 'Position Size Calculator',
        description: 'Never guess your lot size. Use our calculator to instantly determine the exact lot size needed to maintain a strict 1% risk rule.',
        features: ['Exact Lot Sizing', 'Account Currency Conversion', 'Risk % Input'],
        tier: 'Free Tool'
      } as ToolCardBlock
    ],
    relatedTerms: ['Pip', 'Margin', 'Leverage'],
    relatedTool: 'Risk Calculator',
    faqs: []
  },
  {
    term: 'Leverage',
    slug: 'leverage',
    definition: 'Borrowed capital from your broker that lets you control a position larger than your deposit — amplifying both profits and losses equally.',
    detailedExplanation: 'Read the full guide: [What Is Leverage?](/basic/what-is-leverage)',
    example: 'With 30:1 leverage, a 3.33% drop in the asset\'s price will completely wipe out 100% of your account margin.',
    relatedTerms: ['Margin', 'Margin Call', 'Drawdown'],
    faqs: []
  },

  {
    term: 'Margin',
    slug: 'margin',
    definition: 'Margin is the portion of your account balance that the broker "locks away" as collateral to keep your leveraged position open.',
    detailedExplanation: 'Margin is not a transaction fee. It is a security deposit. \n\nIf you want to open a £100,000 position using 30:1 leverage, you must have at least £3,333 in your account as Margin. The broker freezes this amount. The remaining cash in your account is your "Free Margin." \n\nIf a trade goes against you and your floating losses eat through your Free Margin, your broker will issue a "Margin Call" (or simply auto-liquidate the position). This is the broker stepping in to protect themselves from you going into negative balance. You must always maintain sufficient Free Margin to allow your trades room to breathe.',
    example: 'Your account balance is £5,000. You open a trade that requires £1,000 in margin. You have £4,000 in Free Margin to absorb any temporary floating losses.',
    richBlocks: [
      {
        type: 'proTip',
        tip: 'Never risk your entire account on a single trade. A healthy risk management profile ensures that your required margin rarely exceeds 5-10% of your total account equity.'
      } as ProTipBlock
    ],
    relatedTerms: ['Leverage', 'Equity', 'Free Margin'],
    faqs: []
  },
  {
    term: 'Bull Market',
    slug: 'bull-market',
    definition: 'A market condition where prices are rising or expected to rise.',
    detailedExplanation: 'Named after the way a bull thrusts its horns up into the air. Bull markets are characterized by optimism, investor confidence, and expectations that strong results will continue.',
    example: 'The S&P 500 has been in a bull market for most of the last decade, trending consistently higher.',
    relatedTerms: ['Bear Market', 'Uptrend', 'Long'],
    faqs: []
  },
  {
    term: 'Bear Market',
    slug: 'bear-market',
    definition: 'A market condition where prices are falling or expected to fall.',
    detailedExplanation: 'Named after the way a bear swipes its paws down. A bear market is typically defined as a decline of 20% or more from recent highs, accompanied by widespread pessimism.',
    example: 'During the 2008 financial crisis, global stock markets entered a severe bear market.',
    relatedTerms: ['Bull Market', 'Downtrend', 'Short'],
    faqs: []
  },
  {
    term: 'Long Position',
    slug: 'long-position',
    definition: 'Buying an asset with the expectation that its value will increase.',
    detailedExplanation: 'When you "go long," you profit if the price rises and lose if the price falls. In spread betting, this is known as "buying" the market.',
    example: 'A trader goes long on GBP/USD at 1.2500, hoping to sell it later at 1.2600.',
    relatedTerms: ['Short Position', 'Bid', 'Bullish'],
    faqs: []
  },
  {
    term: 'Short Position',
    slug: 'short-position',
    definition: 'Selling an asset (or a contract) with the expectation that its value will decrease.',
    detailedExplanation: 'Shorting allows you to profit from falling prices. You are effectively selling something you don\'t own, intending to "buy it back" later at a lower price.',
    example: 'A trader shorts the FTSE 100 at 7800, expecting it to drop to 7600.',
    relatedTerms: ['Long Position', 'Ask', 'Bearish'],
    faqs: []
  },
  {
    term: 'Stop Loss',
    slug: 'stop-loss',
    definition: 'An order placed with a broker to sell (or buy) an asset when it reaches a certain price, to limit losses.',
    detailedExplanation: 'The most important tool for risk management. A stop loss automatically closes your trade at a pre-defined level if the market moves against you.',
    example: 'You buy at 1.2500 and set a stop loss at 1.2480 to ensure you only lose 20 pips if the trade fails.',
    relatedTerms: ['Take Profit', 'Limit Order', 'Slippage'],
    faqs: []
  },
  {
    term: 'Take Profit',
    slug: 'take-profit',
    definition: 'An order placed to close a profitable trade once it reaches a specific price target.',
    detailedExplanation: 'Take profit orders ensure you lock in gains without having to manually watch the screen. It is part of a "set and forget" trading strategy.',
    example: 'You buy at 1.2500 and set a take profit at 1.2550 to capture a 50-pip gain.',
    relatedTerms: ['Stop Loss', 'Limit Order', 'Trailing Stop'],
    faqs: []
  },
  {
    term: 'Slippage',
    slug: 'slippage',
    definition: 'The difference between the expected price of a trade and the price at which the trade is actually executed.',
    detailedExplanation: 'Slippage often occurs during periods of high volatility or low liquidity when the market "jumps" over your price before the broker can execute the order.',
    example: 'You set a stop loss at 1.2400, but during a news event, the market gapped and your trade closed at 1.2395.',
    relatedTerms: ['Volatility', 'Liquidity', 'Gapping'],
    faqs: []
  },
  {
    term: 'Liquidity',
    slug: 'liquidity',
    definition: 'The ease with which an asset can be bought or sold without affecting its price.',
    detailedExplanation: 'High liquidity means there are many buyers and sellers (e.g., EUR/USD). Low liquidity means few participants, which often leads to wider spreads and higher slippage.',
    example: 'Major currency pairs have high liquidity, while "exotic" pairs like USD/ZAR have much lower liquidity.',
    relatedTerms: ['Spread', 'Slippage', 'Volatility'],
    faqs: []
  },
  {
    term: 'Volatility',
    slug: 'volatility',
    definition: 'A measure of how much and how quickly the price of an asset changes over time.',
    detailedExplanation: 'High volatility means large price swings in short periods. Traders often use volatility indicators like the ATR (Average True Range) to adjust their stop loss distances.',
    example: 'Gold is known for its high volatility, often moving hundreds of pips in a single day.',
    relatedTerms: ['ATR', 'Liquidity', 'Momentum'],
    faqs: []
  },
  {
    term: 'Resistance',
    slug: 'resistance',
    definition: 'A price level where a rising market finds selling pressure and struggles to break above.',
    detailedExplanation: 'Resistance represents a "ceiling" on the chart where sellers have historically outweighed buyers. If price breaks above resistance, it often becomes a new support level.',
    example: 'The FTSE 100 has struggled to break above 8,000 multiple times, making it a major psychological resistance level.',
    relatedTerms: ['Support', 'Breakout', 'Supply Zone'],
    faqs: []
  },
  {
    term: 'Support',
    slug: 'support',
    definition: 'A price level where a falling market finds buying interest and struggles to break below.',
    detailedExplanation: 'Support represents a "floor" on the chart where buyers have historically outweighed sellers. It is a key area for finding high-probability "buy" setups.',
    example: 'Bitcoin has found strong support at $40,000, with buyers stepping in every time the price touches that level.',
    relatedTerms: ['Resistance', 'Breakout', 'Demand Zone'],
    faqs: []
  },
  {
    term: 'Drawdown',
    slug: 'drawdown-definition',
    definition: 'The peak-to-trough decline during a specific period for an investment or trading account.',
    detailedExplanation: 'Drawdown is a measure of risk. It tells you the maximum "pain" your account has suffered before returning to a new high. Managing drawdown is the key to long-term survival.',
    example: 'If your account goes from £10,000 to £8,000 before rising again, you have suffered a 20% drawdown.',
    relatedTerms: ['Risk Management', 'Equity Curve', 'Max Drawdown'],
    faqs: []
  },
  {
    term: 'Fundamental Analysis',
    slug: 'fundamental-analysis-def',
    definition: 'The study of economic, financial, and geopolitical factors to determine the value of an asset.',
    detailedExplanation: 'Fundamental analysts look at interest rates, GDP, employment data, and central bank speeches to predict the long-term direction of currencies or stocks.',
    example: 'A trader buys GBP because the UK inflation data was higher than expected, leading to a likely interest rate hike.',
    relatedTerms: ['Technical Analysis', 'Macroeconomics', 'Economic Calendar'],
    faqs: []
  },
  {
    term: 'Technical Analysis',
    slug: 'technical-analysis-def',
    definition: 'The study of past price action and volume to predict future price movements.',
    detailedExplanation: 'Technical analysts use charts, patterns, and indicators (like RSI or Moving Averages) to identify trends and time their market entries.',
    example: 'A trader identifies a "Head and Shoulders" pattern on the Daily chart and uses it as a signal to go short.',
    relatedTerms: ['Fundamental Analysis', 'Price Action', 'Indicator'],
    faqs: []
  },
  {
    term: 'Moving Average (MA)',
    slug: 'moving-average',
    definition: 'A technical indicator that smooths out price action by filtering out the "noise" from random short-term price fluctuations.',
    detailedExplanation: 'Moving averages are lagging indicators that follow the trend. The two most common types are the Simple Moving Average (SMA) and the Exponential Moving Average (EMA), which gives more weight to recent prices.',
    example: 'A trader uses the 200-day SMA to determine the long-term trend of a stock.',
    relatedTerms: ['EMA', 'SMA', 'Golden Cross'],
    faqs: []
  },
  {
    term: 'RSI (Relative Strength Index)',
    slug: 'rsi',
    definition: 'A momentum oscillator that measures the speed and change of price movements.',
    detailedExplanation: 'RSI oscillates between 0 and 100. Traditionally, a reading above 70 is considered "overbought" and below 30 is "oversold." However, in strong trends, these levels can remain extreme for long periods.',
    example: 'The RSI on EUR/USD hits 85, signaling that the current rally may be overextended.',
    relatedTerms: ['Momentum', 'Oscillator', 'Overbought'],
    faqs: []
  },
  {
    term: 'MACD',
    slug: 'macd',
    definition: 'Moving Average Convergence Divergence; a trend-following momentum indicator.',
    detailedExplanation: 'MACD shows the relationship between two moving averages of an asset’s price. It consists of the MACD line, the signal line, and the histogram, which represents the distance between the two.',
    example: 'A bullish crossover occurs when the MACD line crosses above the signal line.',
    relatedTerms: ['Momentum', 'Crossover', 'Histogram'],
    faqs: []
  },
  {
    term: 'Bollinger Bands',
    slug: 'bollinger-bands',
    definition: 'A technical analysis tool defined by a set of trendlines plotted two standard deviations away from a simple moving average.',
    detailedExplanation: 'Bollinger Bands expand and contract based on market volatility. When the bands "squeeze," it often precedes a period of high volatility and a potential breakout.',
    example: 'The price touches the upper Bollinger Band, suggesting it may be temporarily overextended.',
    relatedTerms: ['Volatility', 'Standard Deviation', 'Squeeze'],
    faqs: []
  },
  {
    term: 'Fibonacci Retracement',
    slug: 'fibonacci-retracement',
    definition: 'A technical analysis tool used to identify potential support and resistance levels based on the Fibonacci sequence.',
    detailedExplanation: 'Traders use horizontal lines to indicate areas of support or resistance at the key Fibonacci levels (23.6%, 38.2%, 50%, 61.8%, and 78.6%) before the price continues in the original direction.',
    example: 'After a big rally, the price retraces exactly to the 61.8% Fibonacci level before bouncing back up.',
    relatedTerms: ['Support', 'Resistance', 'Golden Ratio'],
    faqs: []
  },
  {
    term: 'Candlestick Chart',
    slug: 'candlestick-chart',
    definition: 'A style of financial chart used to describe price movements of a security, derivative, or currency.',
    detailedExplanation: 'Each "candle" typically shows one day, so a one-month chart may show 20 trading days as 20 candlesticks. They provide more visual information than line charts, showing the battle between buyers and sellers.',
    example: 'Traders prefer candlestick charts over line charts because they show the intraday range and sentiment.',
    relatedTerms: ['OHLC', 'Wick', 'Body'],
    faqs: []
  },
  {
    term: 'Doij',
    slug: 'doji',
    definition: 'A candlestick pattern that forms when a security\'s open and close are virtually equal.',
    detailedExplanation: 'A Doji represents indecision in the market. It suggests that neither buyers nor sellers could gain control. When found at the top or bottom of a trend, it can signal a potential reversal.',
    example: 'A long-legged Doji forms after a massive uptrend, suggesting the bulls are losing momentum.',
    relatedTerms: ['Reversal', 'Indecision', 'Hammer'],
    faqs: []
  },
  {
    term: 'Hammer',
    slug: 'hammer-candle',
    definition: 'A bullish reversal candlestick pattern that forms during a downtrend.',
    detailedExplanation: 'Characterized by a small body and a long lower wick. It shows that although sellers pushed the price down, buyers were strong enough to push it back up near the open.',
    example: 'A hammer candle forms at a major support level, signaling a high-probability buy opportunity.',
    relatedTerms: ['Pin Bar', 'Reversal', 'Bullish'],
    faqs: []
  },
  {
    term: 'Engulfing Pattern',
    slug: 'engulfing-pattern',
    definition: 'A reversal pattern that can be bearish or bullish depending on whether it appears at the end of an uptrend or downtrend.',
    detailedExplanation: 'A Bullish Engulfing pattern occurs when a small red candle is followed by a large green candle that completely "engulfs" the previous one, signaling a shift in momentum.',
    example: 'A Bearish Engulfing pattern on the Daily chart leads to a week-long sell-off in the FTSE 100.',
    relatedTerms: ['Reversal', 'Momentum', 'Price Action'],
    faqs: []
  },
  {
    term: 'Arbitrage',
    slug: 'arbitrage',
    definition: 'The simultaneous purchase and sale of the same asset in different markets to profit from tiny differences in the asset\'s listed price.',
    detailedExplanation: 'Arbitrage is common in high-frequency trading where algorithms exploit price discrepancies between exchanges. For retail traders, it is difficult to execute due to fees and speed requirements.',
    example: 'Buying Bitcoin on one exchange and selling it instantly on another where the price is $5 higher.',
    relatedTerms: ['High Frequency Trading', 'Market Efficiency', 'Spread'],
    faqs: []
  },
  {
    term: 'Ask Price',
    slug: 'ask-price',
    definition: 'The price a seller is willing to accept for a security.',
    detailedExplanation: 'Also known as the "offer" price. When you are "buying" (going long), you are buying at the ask price. It is always slightly higher than the bid price.',
    example: 'The quote for EUR/USD is 1.0800 / 1.0801. You buy at 1.0801 (the ask).',
    relatedTerms: ['Bid Price', 'Spread', 'Liquidity'],
    faqs: []
  },
  {
    term: 'Bid Price',
    slug: 'bid-price',
    definition: 'The price a buyer is willing to pay for a security.',
    detailedExplanation: 'When you are "selling" (going short), you are selling at the bid price. It is always slightly lower than the ask price.',
    example: 'The quote for EUR/USD is 1.0800 / 1.0801. You sell at 1.0800 (the bid).',
    relatedTerms: ['Ask Price', 'Spread', 'Execution'],
    faqs: []
  },
  {
    term: 'Breakout',
    slug: 'breakout',
    definition: 'When the price of an asset moves above a resistance level or below a support level with increased volume.',
    detailedExplanation: 'Breakouts often signal the start of a new trend. Many traders wait for a "retest" of the breakout level before entering to ensure it isn\'t a "fakeout."',
    example: 'Gold breaks out of a 6-month consolidation pattern, leading to a massive rally.',
    relatedTerms: ['Resistance', 'Support', 'Fakeout'],
    faqs: []
  },
  {
    term: 'Central Bank',
    slug: 'central-bank',
    definition: 'A national bank that provides financial and banking services for its country\'s government and commercial banking system.',
    detailedExplanation: 'The most important institutions in the Forex market. They set interest rates and conduct monetary policy (e.g., the Bank of England, the Federal Reserve, the ECB).',
    example: 'The Federal Reserve raises interest rates, causing the US Dollar to strengthen against other currencies.',
    relatedTerms: ['Monetary Policy', 'Interest Rates', 'Inflation'],
    faqs: []
  },
  {
    term: 'CFD (Contract for Difference)',
    slug: 'cfd',
    definition: 'A CFD lets you speculate on price movements without owning the underlying asset, using leverage — making it the primary instrument for UK retail traders.',
    detailedExplanation: 'Read the full guide: [What Is a CFD?](/basic/what-is-a-cfd)',
    example: 'Instead of buying Apple shares, a trader opens a CFD position to profit from the price move with less capital.',
    relatedTerms: ['Leverage', 'Spread Betting', 'Margin'],
    faqs: []
  },
  {
    term: 'Commodities',
    slug: 'commodities',
    definition: 'Raw materials and primary goods — gold, oil, wheat, coffee — traded on global markets as assets in their own right.',
    detailedExplanation: 'Read the full guide: [What Are Commodities?](/basic/what-are-commodities)',
    example: 'Traders often buy oil (WTI) when they expect global economic growth to accelerate.',
    relatedTerms: ['Gold', 'Oil', 'Inflation Hedge'],
    faqs: []
  },
  {
    term: 'Correlation',
    slug: 'correlation',
    definition: 'A statistical measure of how two securities move in relation to each other.',
    detailedExplanation: 'Positive correlation means they move in the same direction; negative correlation means they move in opposite directions. Understanding correlation is vital for portfolio diversification.',
    example: 'The Canadian Dollar (CAD) often has a high positive correlation with the price of oil.',
    relatedTerms: ['Diversification', 'Risk Management', 'Hedge'],
    faqs: []
  },
  {
    term: 'Day Trading',
    slug: 'day-trading-def',
    definition: 'The practice of buying and selling financial instruments within the same trading day.',
    detailedExplanation: 'Day traders close all positions before the market closes to avoid overnight risk. It is a high-intensity style that requires quick decision-making and strict discipline.',
    example: 'A day trader buys GBP/USD at 9:00 AM and sells it at 3:00 PM for a 20-pip profit.',
    relatedTerms: ['Scalping', 'Swing Trading', 'Intraday'],
    faqs: []
  },
  {
    term: 'Divergence',
    slug: 'divergence',
    definition: 'When the price of an asset moves in the opposite direction of a technical indicator.',
    detailedExplanation: 'Divergence is a powerful signal that the current trend may be weakening. For example, if price makes a higher high but the RSI makes a lower high, it is a "Bearish Divergence."',
    example: 'A bullish divergence on the 4H chart precedes a major reversal in the AUD/USD pair.',
    relatedTerms: ['RSI', 'MACD', 'Momentum'],
    faqs: []
  },
  {
    term: 'Dividend',
    slug: 'dividend',
    definition: 'A distribution of a portion of a company\'s earnings to its shareholders.',
    detailedExplanation: 'Dividends are typically paid in cash and are a way for investors to earn passive income from their stock holdings. In CFD trading, dividend adjustments are made to your account balance.',
    example: 'Apple announces a quarterly dividend of $0.24 per share.',
    relatedTerms: ['Yield', 'Ex-Dividend', 'Blue Chip'],
    faqs: []
  },
  {
    term: 'Economic Calendar',
    slug: 'economic-calendar-def',
    definition: 'A schedule of upcoming economic news releases and events.',
    detailedExplanation: 'Essential for all traders. It tracks events like GDP growth, inflation data, and central bank meetings which can cause massive volatility in the markets.',
    example: 'Traders check the economic calendar for the US Non-Farm Payroll (NFP) report every month.',
    relatedTerms: ['Fundamental Analysis', 'Volatility', 'NFP'],
    faqs: []
  },
  {
    term: 'Equity',
    slug: 'equity-def',
    definition: 'The total value of a trading account, including unrealized profits and losses.',
    detailedExplanation: 'Equity = Balance + Floating P/L. It represents the actual amount of money you would have if you closed all your open positions right now.',
    example: 'Your balance is £10,000, but you have an open trade with a £500 profit. Your equity is £10,500.',
    relatedTerms: ['Balance', 'Margin', 'Free Margin'],
    faqs: []
  },
  {
    term: 'Exchange Rate',
    slug: 'exchange-rate',
    definition: 'The value of one currency for the purpose of conversion to another.',
    detailedExplanation: 'In Forex, the exchange rate tells you how much of the quote currency is needed to buy one unit of the base currency.',
    example: 'If the EUR/USD exchange rate is 1.10, it costs $1.10 to buy €1.00.',
    relatedTerms: ['Base Currency', 'Quote Currency', 'Forex'],
    faqs: []
  },
  {
    term: 'Execution',
    slug: 'execution',
    definition: 'The completion of a buy or sell order in the market.',
    detailedExplanation: 'Execution speed (latency) is a critical factor for day traders. High-quality brokers provide lightning-fast execution to minimize slippage.',
    example: 'The trader clicked "Buy" and the execution happened in 15 milliseconds at the exact price requested.',
    relatedTerms: ['Slippage', 'Order Type', 'Latency'],
    faqs: []
  },
  {
    term: 'Exotic Pairs',
    slug: 'exotic-pairs',
    definition: 'Currency pairs that consist of one major currency and one from a developing or emerging economy.',
    detailedExplanation: 'Exotics have lower liquidity and much wider spreads than majors or minors. Examples include USD/TRY (Turkish Lira) or USD/ZAR (South African Rand).',
    example: 'Trading USD/MXN is considered trading an exotic pair and requires higher margin.',
    relatedTerms: ['Major Pairs', 'Minor Pairs', 'Liquidity'],
    faqs: []
  },
  {
    term: 'Fill Price',
    slug: 'fill-price',
    definition: 'The exact price at which a trade was executed.',
    detailedExplanation: 'Due to market movement and slippage, the fill price may sometimes be different from the price you initially requested when placing the order.',
    example: 'The trader requested a fill at 1.2500 but the actual fill price was 1.2501.',
    relatedTerms: ['Execution', 'Slippage', 'Requote'],
    faqs: []
  },
  {
    term: 'Gap',
    slug: 'gap',
    definition: 'A break in price action where no trading has occurred, typically between the Friday close and Sunday open.',
    detailedExplanation: 'Gaps often happen when major news breaks over the weekend while the market is closed. "Closing the gap" is a common trading strategy.',
    example: 'The S&P 500 gapped down 2% on Monday morning due to geopolitical tensions.',
    relatedTerms: ['Volatility', 'Liquidity', 'Weekend Risk'],
    faqs: []
  },
  {
    term: 'Guaranteed Stop Loss',
    slug: 'guaranteed-stop-loss',
    definition: 'A premium stop loss order that guarantees your trade will be closed at your exact price, regardless of market gaps or slippage.',
    detailedExplanation: 'Many UK brokers like IG offer this for a small fee. It is the only way to completely eliminate "gap risk" in your trading.',
    example: 'A trader uses a guaranteed stop loss on a volatile earnings trade to ensure they don\'t lose more than their defined risk.',
    relatedTerms: ['Stop Loss', 'Slippage', 'Gap'],
    faqs: []
  },
  {
    term: 'Hedging',
    slug: 'hedging',
    definition: 'An investment made with the intent of reducing the risk of adverse price movements in an asset.',
    detailedExplanation: 'Traders often hedge by taking an opposite position in a related asset. For example, a gold miner might sell gold futures to "lock in" a price for their future production.',
    example: 'To hedge a long UK stock portfolio, a trader might short the FTSE 100 index.',
    relatedTerms: ['Correlation', 'Risk Management', 'Derivative'],
    faqs: []
  },
  {
    term: 'Indicator',
    slug: 'indicator-def',
    definition: 'A mathematical calculation based on an asset\'s price and/or volume.',
    detailedExplanation: 'Indicators are used to identify trends, momentum, and volatility. They are usually categorized as either "Lagging" (following price) or "Leading" (predicting price).',
    example: 'The 50-period Moving Average is one of the most widely used trend indicators.',
    relatedTerms: ['Technical Analysis', 'Lagging Indicator', 'Leading Indicator'],
    faqs: []
  },
  {
    term: 'Inflation',
    slug: 'inflation',
    definition: 'The rate at which the general level of prices for goods and services is rising.',
    detailedExplanation: 'High inflation often leads to central banks raising interest rates, which typically causes that country\'s currency to strengthen.',
    example: 'The UK CPI data shows inflation is at 4%, increasing pressure on the Bank of England to raise rates.',
    relatedTerms: ['CPI', 'Central Bank', 'Interest Rate'],
    faqs: []
  },
  {
    term: 'Interest Rate',
    slug: 'interest-rate',
    definition: 'The amount charged by a lender to a borrower for the use of assets.',
    detailedExplanation: 'Central bank interest rates are the single most important factor in the Forex market, as they determine the "yield" of a currency.',
    example: 'The BOE raises interest rates to 5.25%, making the British Pound more attractive to international investors.',
    relatedTerms: ['Central Bank', 'Monetary Policy', 'Yield'],
    faqs: []
  },
  {
    term: 'Lot',
    slug: 'lot',
    definition: 'The standard unit for measuring the size of a trade.',
    detailedExplanation: 'In Forex, a standard lot is 100,000 units. A mini lot is 10,000 and a micro lot is 1,000. Many brokers now allow "Nano lots" or fractional position sizing.',
    example: 'A trader opens a 0.5 lot position on USD/JPY.',
    relatedTerms: ['Lot Size', 'Micro Lot', 'Mini Lot'],
    faqs: []
  },
  {
    term: 'Major Pairs',
    slug: 'major-pairs',
    definition: 'The most heavily traded currency pairs in the world, all of which contain the US Dollar.',
    detailedExplanation: 'Includes EUR/USD, GBP/USD, USD/JPY, USD/CHF, USD/CAD, AUD/USD, and NZD/USD. They offer the highest liquidity and lowest spreads.',
    example: 'EUR/USD is the most liquid major pair, accounting for over 20% of all forex volume.',
    relatedTerms: ['Minor Pairs', 'Exotic Pairs', 'Forex'],
    faqs: []
  },
  {
    term: 'Momentum',
    slug: 'momentum',
    definition: 'The speed or velocity of price changes in a security or market.',
    detailedExplanation: 'Momentum shows the strength of a trend. Traders use momentum indicators like the RSI or the Rate of Change (ROC) to identify when a trend is accelerating or slowing down.',
    example: 'The market has strong bullish momentum, making new highs every hour on high volume.',
    relatedTerms: ['Velocity', 'RSI', 'Trend'],
    faqs: []
  },
  {
    term: 'NFP (Non-Farm Payroll)',
    slug: 'nfp',
    definition: 'A key economic indicator for the US economy, representing the number of jobs added or lost in the previous month, excluding the farming industry.',
    detailedExplanation: 'Released on the first Friday of every month. It is one of the most closely watched reports in the world and almost always causes significant volatility in the US Dollar and global stock indices.',
    example: 'The NFP report came in much higher than expected, causing a 100-pip spike in the USD/JPY pair.',
    relatedTerms: ['Economic Calendar', 'Fundamental Analysis', 'Employment Data'],
    faqs: []
  },
  {
    term: 'Oscillator',
    slug: 'oscillator',
    definition: 'A technical analysis tool that constructs high and low bands between two extreme values, and then builds a trend indicator that fluctuates within these bounds.',
    detailedExplanation: 'Oscillators are used to discover short-term overbought or oversold conditions. When the value of the oscillator approaches the upper extreme value, it is considered overbought.',
    example: 'The Stochastic Oscillator is a popular tool for finding reversals in range-bound markets.',
    relatedTerms: ['RSI', 'Stochastic', 'Overbought'],
    faqs: []
  },
  {
    term: 'Overbought',
    slug: 'overbought',
    definition: 'A situation in which the price of an asset has risen to such a degree that it is considered to be above its intrinsic value.',
    detailedExplanation: 'Overbought levels are often used by technical analysts as a signal that the current uptrend may be nearing an end and a pullback or reversal is likely.',
    example: 'The RSI is at 80, signaling that the stock is in overbought territory.',
    relatedTerms: ['Oversold', 'RSI', 'Pullback'],
    faqs: []
  },
  {
    term: 'Oversold',
    slug: 'oversold',
    definition: 'A situation in which the price of an asset has fallen to such a degree that it is considered to be below its intrinsic value.',
    detailedExplanation: 'Oversold levels are often used as a signal that the current downtrend may be exhausted and a bounce or reversal is likely.',
    example: 'The price has dropped for 10 consecutive days and the RSI is at 20, suggesting it is oversold.',
    relatedTerms: ['Overbought', 'RSI', 'Bounce'],
    faqs: []
  },
  {
    term: 'Pattern',
    slug: 'pattern',
    definition: 'A distinctive formation created by the movement of security prices on a chart.',
    detailedExplanation: 'Patterns are the foundation of technical analysis. They include "Reversal Patterns" (like Head and Shoulders) and "Continuation Patterns" (like Flags and Pennants).',
    example: 'A Bull Flag pattern forms on the 1H chart, suggesting the uptrend is about to continue.',
    relatedTerms: ['Technical Analysis', 'Chart Pattern', 'Price Action'],
    faqs: []
  },
  {
    term: 'Pipette',
    slug: 'pipette',
    definition: 'A fractional pip, equal to one-tenth of a pip.',
    detailedExplanation: 'Most modern brokers provide 5-digit pricing (3-digit for JPY), where the final digit is the pipette. This allows for tighter spreads and more precise execution.',
    example: 'The EUR/USD price is 1.08005. The "5" at the end is the pipette.',
    relatedTerms: ['Pip', 'Spread', 'Precision'],
    faqs: []
  },
  {
    term: 'Pivot Point',
    slug: 'pivot-point',
    definition: 'A technical analysis indicator used to determine the overall trend of the market over different timeframes.',
    detailedExplanation: 'The pivot point itself is simply the average of the high, low, and closing prices from the previous trading day. Trading above the pivot point is thought to indicate ongoing bullish sentiment, while trading below indicates bearish sentiment.',
    example: 'The trader uses daily pivot points to identify potential intraday support and resistance levels.',
    relatedTerms: ['Support', 'Resistance', 'Technical Indicator'],
    faqs: []
  },
  {
    term: 'Position',
    slug: 'position',
    definition: 'The amount of a security, commodity, or currency that is owned (long) or borrowed (short) by an individual.',
    detailedExplanation: 'Opening a position is the act of entering a trade. Closing a position is the act of exiting a trade and realizing the profit or loss.',
    example: 'The trader currently has an open position of 2 lots on the GBP/USD.',
    relatedTerms: ['Long', 'Short', 'Execution'],
    faqs: []
  },
  {
    term: 'Price Action',
    slug: 'price-action-def',
    definition: 'The movement of a security\'s price plotted over time.',
    detailedExplanation: 'Price action forms the basis for all technical analysis of a stock, commodity, or other asset chart. Many short-term traders rely exclusively on price action and the formations and trends extrapolated from it to make trading decisions.',
    example: 'The trader ignores all indicators and focuses entirely on price action to find entries.',
    relatedTerms: ['Technical Analysis', 'Candlestick', 'Pattern'],
    faqs: []
  },
  {
    term: 'Pullback',
    slug: 'pullback',
    definition: 'A temporary fall in the price of an asset from its recent peak.',
    detailedExplanation: 'Pullbacks are often seen as opportunities to "buy the dip" in an ongoing uptrend. They represent a healthy pause in a trend where some traders take profits before new buyers enter.',
    example: 'The FTSE 100 has pulled back to its 50-day moving average, providing a potential entry point.',
    relatedTerms: ['Retracement', 'Correction', 'Trend'],
    faqs: []
  },
  {
    term: 'Quant',
    slug: 'quant',
    definition: 'A professional who uses quantitative analysis and algorithmic methods to trade financial markets.',
    detailedExplanation: 'Quants use complex mathematical models and high-speed computing to identify and exploit market inefficiencies. It is the core of most high-frequency trading firms.',
    example: 'The hedge fund hired a team of quants to develop a new arbitrage algorithm.',
    relatedTerms: ['Algorithmic Trading', 'High Frequency Trading', 'Mathematical Model'],
    faqs: []
  },
  {
    term: 'Quote',
    slug: 'quote',
    definition: 'The most recent price at which a security has traded, or the bid and ask prices currently available.',
    detailedExplanation: 'A quote typically shows the bid price (what you sell at) and the ask price (what you buy at).',
    example: 'The broker provided a quote of 1.2500 / 1.2501 for the GBP/USD.',
    relatedTerms: ['Bid', 'Ask', 'Spread'],
    faqs: []
  },
  {
    term: 'Rally',
    slug: 'rally',
    definition: 'A period of sustained increase in the prices of stocks, bonds, or indexes.',
    detailedExplanation: 'A rally can occur during either a bull or a bear market. In a bull market, it is part of the ongoing trend; in a bear market, it is often called a "bear market rally" or "dead cat bounce."',
    example: 'The market enjoyed a 5% rally following the positive inflation report.',
    relatedTerms: ['Bull Market', 'Uptrend', 'Momentum'],
    faqs: []
  },
  {
    term: 'Range',
    slug: 'range',
    definition: 'The difference between the high and low prices of an asset during a given period.',
    detailedExplanation: 'A "range-bound" market is one that moves sideways between clear support and resistance levels without establishing a trend.',
    example: 'The EUR/USD has been stuck in a 50-pip range for the entire Asian session.',
    relatedTerms: ['Volatility', 'Consolidation', 'Support'],
    faqs: []
  },
  {
    term: 'Risk-to-Reward Ratio (R:R)',
    slug: 'risk-to-reward-ratio',
    definition: 'A measure used by traders to compare the potential profit of a trade to its potential loss.',
    detailedExplanation: 'For example, if you risk £100 to make £300, your R:R is 1:3. Professionals aim for a positive R:R to ensure they can remain profitable even with a win rate below 50%.',
    example: 'The trade has a 1:2 risk-to-reward ratio, which meets the trader\'s minimum requirements.',
    relatedTerms: ['Risk Management', 'Stop Loss', 'Take Profit'],
    faqs: []
  },
  {
    term: 'Scalping',
    slug: 'scalping-def',
    definition: 'A trading style specializing in profiting from small price changes and making a fast profit off reselling.',
    detailedExplanation: 'Scalpers make dozens or even hundreds of trades a day, holding positions for only seconds or minutes. It requires extreme focus and low-latency execution.',
    example: 'The scalper makes 50 trades a day, aiming for a 2-pip profit on each.',
    relatedTerms: ['Day Trading', 'High Frequency Trading', 'Spread'],
    faqs: []
  },
  {
    term: 'Sentiment',
    slug: 'sentiment',
    definition: 'The overall attitude of investors toward a particular security or financial market.',
    detailedExplanation: 'Sentiment is often described as "Bullish" (optimistic) or "Bearish" (pessimistic). Traders use sentiment indicators like the "Fear & Greed Index" to identify potential market extremes.',
    example: 'Market sentiment has turned bearish following the central bank\'s hawkish comments.',
    relatedTerms: ['Fear & Greed', 'Bullish', 'Bearish'],
    faqs: []
  },
  {
    term: 'Sovereign Debt',
    slug: 'sovereign-debt',
    definition: 'Debt issued by a national government in a foreign currency, in order to finance the issuing country\'s growth and development.',
    detailedExplanation: 'Also known as "Government Bonds." The stability and credit rating of a country\'s sovereign debt directly affects its currency value.',
    example: 'Investors are flocking to US Treasuries as a safe-haven asset, strengthening the Dollar.',
    relatedTerms: ['Bonds', 'Yield', 'Credit Rating'],
    faqs: []
  },
  {
    term: 'Spread Betting',
    slug: 'spread-betting-def',
    definition: 'A tax-efficient way of speculating on the price movement of various types of financial instruments.',
    detailedExplanation: 'In the UK, spread betting is popular because it is exempt from Capital Gains Tax and Stamp Duty. You "bet" a certain amount per point of movement in the price of an asset.',
    example: 'A trader bets £5 per point on the FTSE 100 rising.',
    relatedTerms: ['CFD', 'Tax-Free', 'Leverage'],
    faqs: []
  },
  {
    term: 'Stochastic Oscillator',
    slug: 'stochastic-oscillator',
    definition: 'A momentum indicator comparing a particular closing price of a security to a range of its prices over a certain period of time.',
    detailedExplanation: 'The sensitivity of the oscillator to market movements is reducible by adjusting that time period or by taking a moving average of the result. It is used to generate overbought and oversold trading signals.',
    example: 'The Stochastic Oscillator crosses below 80, giving a potential sell signal.',
    relatedTerms: ['Oscillator', 'RSI', 'Overbought'],
    faqs: []
  },
  {
    term: 'Supply and Demand',
    slug: 'supply-and-demand',
    definition: 'The primary drivers of price in any free market.',
    detailedExplanation: 'When demand exceeds supply, price rises. When supply exceeds demand, price falls. Traders use "Supply Zones" and "Demand Zones" on a chart to identify where these imbalances occurred in the past.',
    example: 'The price has returned to a major daily demand zone, where we expect buyers to step in.',
    relatedTerms: ['Support', 'Resistance', 'Order Flow'],
    faqs: []
  },
  {
    term: 'Swing Trading',
    slug: 'swing-trading-def',
    definition: 'A style of trading that attempts to capture gains in a stock (or any financial instrument) over a period of a few days to several weeks.',
    detailedExplanation: 'Swing traders primarily use technical analysis to look for trading opportunities. They may use fundamental analysis in addition to analyzing price trends and patterns.',
    example: 'A swing trader buys Gold and holds it for 5 days to catch a 500-pip move.',
    relatedTerms: ['Day Trading', 'Position Trading', 'Trend'],
    faqs: []
  },
  {
    term: 'Tape Reading',
    slug: 'tape-reading',
    definition: 'A technique used by stock traders to analyze the price and volume of a given stock.',
    detailedExplanation: 'Historically, "The Tape" was a physical strip of paper showing every trade. Today, it is a digital "Time and Sales" window. It is the most granular level of market data.',
    example: 'The trader is reading the tape to see if aggressive buyers are hitting the ask price.',
    relatedTerms: ['Order Flow', 'Time and Sales', 'Execution'],
    faqs: []
  },
  {
    term: 'Technical Indicator',
    slug: 'technical-indicator-def',
    definition: 'A heuristic or pattern-based signal produced by the price, volume, and/or open interest of a security or contract used by traders who follow technical analysis.',
    detailedExplanation: 'Examples include Moving Averages, RSI, and MACD. They are used to simplify the market data into a more readable format.',
    example: 'The trader uses a combination of three technical indicators to confirm their entry signal.',
    relatedTerms: ['Technical Analysis', 'Lagging Indicator', 'Leading Indicator'],
    faqs: []
  },
  {
    term: 'Tick',
    slug: 'tick',
    definition: 'The smallest possible change in price for a financial instrument.',
    detailedExplanation: 'In futures trading, prices move in "ticks" rather than pips. Each tick has a specific monetary value.',
    example: 'The S&P 500 futures moved up by 5 ticks.',
    relatedTerms: ['Pip', 'Point', 'Futures'],
    faqs: []
  },
  {
    term: 'Trailing Stop',
    slug: 'trailing-stop',
    definition: 'A type of stop loss order that moves automatically as the price of an asset moves in your favor.',
    detailedExplanation: 'A trailing stop allows you to "lock in" profits as the trade progresses while still giving the trade room to move. It only moves in one direction—it never moves back.',
    example: 'You set a 50-pip trailing stop. As the price moves up 100 pips, your stop moves up 50 pips from your entry.',
    relatedTerms: ['Stop Loss', 'Risk Management', 'Take Profit'],
    faqs: []
  },
  {
    term: 'Trend',
    slug: 'trend',
    definition: 'The general direction in which a market or the price of an asset is moving.',
    detailedExplanation: 'Trends can be "Uptrends" (higher highs and higher lows), "Downtrends" (lower highs and lower lows), or "Sideways" (range-bound). "The trend is your friend" is a common trading maxim.',
    example: 'The Nasdaq 100 has been in a strong uptrend for the past six months.',
    relatedTerms: ['Bull Market', 'Bear Market', 'Momentum'],
    faqs: []
  },
  {
    term: 'Wick',
    slug: 'wick',
    definition: 'The thin line on a candlestick that shows the high and low prices reached during a specific period.',
    detailedExplanation: 'Also known as a "shadow." Long wicks often signal price rejection—if a candle has a long upper wick, it means buyers tried to push the price up but were met with strong selling pressure.',
    example: 'A long lower wick at a support level suggests a potential reversal to the upside.',
    relatedTerms: ['Candlestick', 'Body', 'Price Action'],
    faqs: []
  },
  {
    term: 'Yield',
    slug: 'yield',
    definition: 'The earnings generated and realized on an investment over a particular period of time.',
    detailedExplanation: 'It is expressed as a percentage based on the investment cost or current market value. In the context of currencies, the yield is determined by the central bank\'s interest rate.',
    example: 'The yield on the UK 10-year Gilt has risen to 4.5%.',
    relatedTerms: ['Interest Rate', 'Dividend', 'Return on Investment'],
    faqs: []
  },
  {
    term: 'Algorithm',
    slug: 'algorithm',
    definition: 'A set of rules designed to execute a trading strategy automatically.',
    detailedExplanation: 'Algorithms use mathematical models to make high-speed decisions based on price, timing, and volume.',
    example: 'An algorithm automatically buys EUR/USD when the 50 SMA crosses the 200 SMA.',
    relatedTerms: ['HFT', 'Quant', 'Automated Trading'],
    faqs: []
  },
  {
    term: 'Base Currency',
    slug: 'base-currency',
    definition: 'The first currency in a forex pair quotation.',
    detailedExplanation: 'In EUR/USD, the EUR is the base currency. The exchange rate shows how much of the quote currency is needed to buy one unit of the base currency.',
    example: 'If EUR/USD is 1.10, one Euro (base) costs 1.10 US Dollars (quote).',
    relatedTerms: ['Quote Currency', 'Forex Pair', 'Exchange Rate'],
    faqs: []
  },
  {
    term: 'Block Trade',
    slug: 'block-trade',
    definition: 'A significantly large trade, typically executed outside the open market.',
    detailedExplanation: 'Institutional investors use block trades to avoid causing a massive price spike or drop that would occur if the order was placed on public exchanges.',
    example: 'A mutual fund executes a block trade of 1 million shares of Apple.',
    relatedTerms: ['Dark Pool', 'Institutional Trading', 'Liquidity'],
    faqs: []
  },
  {
    term: 'Break-Even',
    slug: 'break-even',
    definition: 'The price point at which a trade has zero profit and zero loss.',
    detailedExplanation: 'Traders often move their stop loss to the break-even point once a trade is in profit, ensuring a risk-free position.',
    example: 'You buy at 100, the price goes to 110, you move your stop loss to 100. It is now a break-even trade.',
    relatedTerms: ['Risk-Free Trade', 'Stop Loss', 'Trailing Stop'],
    faqs: []
  },
  {
    term: 'Contango',
    slug: 'contango',
    definition: 'A situation in the futures market where the forward price of a commodity is higher than the spot price.',
    detailedExplanation: 'This usually implies that investors are willing to pay a premium for a commodity in the future, often due to storage costs.',
    example: 'The oil market is in contango, with the 6-month contract priced higher than the current spot price.',
    relatedTerms: ['Backwardation', 'Futures', 'Spot Price'],
    faqs: []
  },
  {
    term: 'Dead Cat Bounce',
    slug: 'dead-cat-bounce',
    definition: 'A temporary recovery in asset prices after a prolonged decline.',
    detailedExplanation: 'Derived from the phrase "even a dead cat will bounce if it falls from a great height," it represents a false signal that a downtrend has ended.',
    example: 'The stock dropped 40%, bounced up 5% in a dead cat bounce, and then continued to fall.',
    relatedTerms: ['Bear Market Rally', 'Downtrend', 'False Breakout'],
    faqs: []
  },
  {
    term: 'Dark Pool',
    slug: 'dark-pool',
    definition: 'A private financial exchange where institutional investors can trade without exposing their orders to the public.',
    detailedExplanation: 'Dark pools prevent heavy market impact and slippage for large block trades.',
    example: 'A pension fund uses a dark pool to silently accumulate 500,000 shares of a tech company.',
    relatedTerms: ['Block Trade', 'Liquidity', 'Institutional Trading'],
    faqs: []
  },
  {
    term: 'Drawdown Limit',
    slug: 'drawdown-limit',
    definition: 'The maximum allowed loss on a trading account before trading privileges are suspended.',
    detailedExplanation: 'Commonly used by proprietary trading firms to enforce strict risk management protocols on funded traders.',
    example: 'The prop firm enforces a strict 10% maximum drawdown limit on all accounts.',
    relatedTerms: ['Prop Firm', 'Risk Management', 'Max Drawdown'],
    faqs: []
  },
  {
    term: 'ECN Broker',
    slug: 'ecn-broker',
    definition: 'Electronic Communication Network; a broker that connects retail traders directly to Tier 1 liquidity providers.',
    detailedExplanation: 'ECN brokers typically offer raw spreads (often 0.0 pips) and charge a fixed commission per lot, providing highly transparent execution.',
    example: 'The trader prefers an ECN broker because it eliminates the conflict of interest found with market makers.',
    relatedTerms: ['Market Maker', 'STP', 'Liquidity Provider'],
    faqs: []
  },
  {
    term: 'Elliott Wave',
    slug: 'elliott-wave',
    definition: 'A form of technical analysis that looks for recurrent long-term price patterns related to persistent changes in investor sentiment.',
    detailedExplanation: 'The theory states that markets move in 5-wave impulse sequences and 3-wave corrective sequences.',
    example: 'An analyst predicts a major market top based on the completion of a 5th Elliott Wave.',
    relatedTerms: ['Technical Analysis', 'Fibonacci', 'Market Cycles'],
    faqs: []
  },
  {
    term: 'Fiat Currency',
    slug: 'fiat-currency',
    definition: 'A national currency that is not pegged to the price of a commodity such as gold or silver.',
    detailedExplanation: 'The value of fiat money is derived entirely from the trust and backing of the issuing government.',
    example: 'The US Dollar, Euro, and British Pound are all fiat currencies.',
    relatedTerms: ['Central Bank', 'Monetary Policy', 'Forex'],
    faqs: []
  },
  {
    term: 'Going Long',
    slug: 'going-long',
    definition: 'The act of buying an asset with the expectation that it will rise in value.',
    detailedExplanation: 'If you go long, your risk is technically limited to the amount invested (the asset cannot go below 0), while potential profit is theoretically infinite.',
    example: 'The trader is going long on Apple stock ahead of the earnings report.',
    relatedTerms: ['Bullish', 'Long Position', 'Buy'],
    faqs: []
  },
  {
    term: 'Going Short',
    slug: 'going-short',
    definition: 'The act of selling an asset you do not own with the expectation that it will fall in value.',
    detailedExplanation: 'Going short carries infinite theoretical risk, as there is no limit to how high a price can rise.',
    example: 'The hedge fund is going short on the overvalued tech stock.',
    relatedTerms: ['Bearish', 'Short Position', 'Sell'],
    faqs: []
  },
  {
    term: 'Half-Pip',
    slug: 'half-pip',
    definition: 'A price movement equal to 0.5 of a standard pip.',
    detailedExplanation: 'Often used by high-frequency traders and scalpers where extremely tight spreads are available.',
    example: 'The broker\'s commission structure equates to a cost of half-a-pip per round turn.',
    relatedTerms: ['Pip', 'Pipette', 'Spread'],
    faqs: []
  },
  {
    term: 'HFT',
    slug: 'hft',
    definition: 'High-Frequency Trading; a method of trading that uses powerful computer programs to transact a large number of orders in fractions of a second.',
    detailedExplanation: 'HFT algorithms are designed to capture microscopic market inefficiencies and rely heavily on co-location and ultra-low latency.',
    example: 'HFT firms dominate the order book liquidity in modern equity markets.',
    relatedTerms: ['Algorithmic Trading', 'Latency', 'Arbitrage'],
    faqs: []
  },
  {
    term: 'Intraday',
    slug: 'intraday',
    definition: 'Occurring within the course of a single business day.',
    detailedExplanation: 'Intraday price movements are significant to day traders who aim to execute multiple trades within a single session.',
    example: 'The stock experienced massive intraday volatility following the CPI announcement.',
    relatedTerms: ['Day Trading', 'Scalping', 'Session'],
    faqs: []
  },
  {
    term: 'Order Book',
    slug: 'order-book',
    definition: 'An electronic list of buy and sell orders for a specific security or financial instrument, organized by price level.',
    detailedExplanation: 'The order book shows the depth of market (DOM) and helps traders identify where the liquidity is concentrated.',
    example: 'The trader checked the order book and noticed a massive sell wall at the $50 level.',
    relatedTerms: ['Depth of Market', 'Level 2 Data', 'Liquidity'],
    faqs: []
  },
  {
    term: 'Quote Currency',
    slug: 'quote-currency',
    definition: 'The second currency in a currency pair quote.',
    detailedExplanation: 'In a forex pair (e.g., EUR/USD), the quote currency is the one on the right. It represents how much of that currency is needed to buy one unit of the base currency.',
    example: 'If EUR/USD is 1.10, the quote currency (USD) is worth less than the base currency.',
    relatedTerms: ['Base Currency', 'Exchange Rate', 'Forex Pair'],
    faqs: []
  },
  {
    term: 'Black Swan Event',
    slug: 'black-swan-event',
    definition: 'An unpredictable event that is beyond what is normally expected of a situation and has potentially severe consequences.',
    detailedExplanation: 'Black swan events are characterized by their extreme rarity, severe impact, and the widespread insistence that they were obvious in hindsight.',
    example: 'The 2008 financial crisis and the 2020 COVID-19 pandemic are classic black swan events.',
    relatedTerms: ['Volatility', 'Risk Management', 'Flash Crash'],
    faqs: []
  },
  {
    term: 'Capitulation',
    slug: 'capitulation',
    definition: 'The point in time when investors give up any previous gains by selling their positions during periods of decline.',
    detailedExplanation: 'Capitulation often marks the bottom of a bear market, as the "weak hands" have finished selling and only long-term holders remain.',
    example: 'After a 30% drop, the market saw a final 5% spike in volume, signaling capitulation.',
    relatedTerms: ['Panic Selling', 'Bear Market', 'Bottoming Out'],
    faqs: []
  },
  {
    term: 'Confirmation',
    slug: 'confirmation',
    definition: 'The use of an additional indicator or signal to verify a trade setup.',
    detailedExplanation: 'Traders use confirmation to avoid "false signals." For example, a breakout might be confirmed by a spike in volume or an RSI crossover.',
    example: 'The price broke resistance, but the trader waited for the 1H candle to close for confirmation.',
    relatedTerms: ['Confluence', 'Technical Analysis', 'Signal'],
    faqs: []
  },
  {
    term: 'Correlation Coefficient',
    slug: 'correlation-coefficient',
    definition: 'A statistical measure that calculates the strength of the relationship between the relative movements of two securities.',
    detailedExplanation: 'The values range between -1.0 and 1.0. A correlation of 1.0 means they move in perfect sync; -1.0 means they move in opposite directions.',
    example: 'The correlation coefficient between Gold and the US Dollar is often strongly negative.',
    relatedTerms: ['Correlation', 'Diversification', 'Risk Management'],
    faqs: []
  },
  {
    term: 'Direct Market Access (DMA)',
    slug: 'direct-market-access',
    definition: 'Electronic facilities that allow traders to interact directly with the order book of an exchange.',
    detailedExplanation: 'DMA provides greater transparency and faster execution than traditional broker routing. It is preferred by professional traders.',
    example: 'Advanced CFD traders use DMA to see the full depth of the order book before entering.',
    relatedTerms: ['ECN Broker', 'Order Book', 'Execution'],
    faqs: []
  },
  {
    term: 'Drawdown Recovery',
    slug: 'drawdown-recovery',
    definition: 'The amount of profit required to return an account to its previous peak after a loss.',
    detailedExplanation: 'Because losses are calculated from a smaller base, you always need a larger percentage gain to recover. For example, a 50% loss requires a 100% gain to break even.',
    example: 'The trader focused on drawdown recovery after a series of five losing trades.',
    relatedTerms: ['Drawdown', 'Risk Management', 'Compounding'],
    faqs: []
  },
  {
    term: 'Expert Advisor (EA)',
    slug: 'expert-advisor',
    definition: 'An automated trading system used in the MetaTrader platform.',
    detailedExplanation: 'EAs are written in MQL4 or MQL5 and can monitor markets, identify setups, and execute trades without human intervention.',
    example: 'The trader uses a trend-following Expert Advisor to manage their trades during the London session.',
    relatedTerms: ['Algorithmic Trading', 'MT4', 'MT5'],
    faqs: []
  },
  {
    term: 'Fat Finger Trade',
    slug: 'fat-finger-trade',
    definition: 'An error in an electronic trade caused by a human typing the wrong price or volume.',
    detailedExplanation: 'Fat finger trades can cause massive, short-term price spikes or crashes (flash crashes) if the order is large enough.',
    example: 'A trader accidentally sold 100 million units instead of 1 million, causing a sudden drop in the currency pair.',
    relatedTerms: ['Flash Crash', 'Execution', 'Slippage'],
    faqs: []
  },
  {
    term: 'Fibonacci Extension',
    slug: 'fibonacci-extension',
    definition: 'A tool used to predict potential price targets beyond the current trend.',
    detailedExplanation: 'Extensions are typically used to find where to take profit after a breakout. Common levels include 161.8% and 261.8%.',
    example: 'After the breakout, the price moved exactly to the 161.8% Fibonacci extension level.',
    relatedTerms: ['Fibonacci Retracement', 'Take Profit', 'Support'],
    faqs: []
  },
  {
    term: 'Hedging Strategy',
    slug: 'hedging-strategy',
    definition: 'A method of reducing risk by taking offsetting positions in related assets.',
    detailedExplanation: 'Hedging is not about making money; it is about protecting the money you have from adverse market moves.',
    example: 'An investor hedges their US stock portfolio by buying "Put" options on the S&P 500.',
    relatedTerms: ['Hedging', 'Risk Management', 'Options'],
    faqs: []
  },
  {
    term: 'Margin Call',
    slug: 'margin-call-definition',
    definition: 'A broker\'s demand that a trader deposit more money to cover potential losses on open positions.',
    detailedExplanation: 'If you do not meet the margin call, the broker will automatically close your positions (liquidate) to prevent your account from going negative.',
    example: 'The trader ignored the margin call and was automatically stopped out of all trades.',
    relatedTerms: ['Margin', 'Liquidation', 'Leverage'],
    faqs: []
  },
  {
    term: 'Market Sentiment Analysis',
    slug: 'market-sentiment-analysis',
    definition: 'The process of gauging the overall "mood" of market participants.',
    detailedExplanation: 'Includes analyzing COT reports, retail sentiment indices, and social media activity to find if the market is overly bullish or bearish.',
    example: 'Sentiment analysis showed that 90% of retail traders were long, suggesting a potential short opportunity.',
    relatedTerms: ['Sentiment', 'Contrarian Trading', 'COT Report'],
    faqs: []
  },
  {
    term: 'No Dealing Desk (NDD)',
    slug: 'no-dealing-desk',
    definition: 'A broker model where orders are passed directly to liquidity providers without being handled by a dealer.',
    detailedExplanation: 'NDD brokers (like ECN or STP) reduce the conflict of interest between the broker and the trader.',
    example: 'Professional scalpers prefer NDD brokers for their transparent execution and low latency.',
    relatedTerms: ['ECN Broker', 'STP', 'Market Maker'],
    faqs: []
  },
  {
    term: 'Over-Leveraging',
    slug: 'over-leveraging',
    definition: 'The practice of using too much borrowed capital relative to your account size.',
    detailedExplanation: 'Over-leveraging is the #1 reason why retail traders blow their accounts. It makes small price moves have a devastating impact on account equity.',
    example: 'The trader blew their account in one day due to extreme over-leveraging.',
    relatedTerms: ['Leverage', 'Margin', 'Risk Management'],
    faqs: []
  },
  {
    term: 'Pyramiding',
    slug: 'pyramiding',
    definition: 'The strategy of adding to a winning position as the price moves in your favor.',
    detailedExplanation: 'Pyramiding allows you to maximize profits in a strong trend while keeping your overall risk low by trailing your stops.',
    example: 'The trader added to their long position every time the price pulled back to the 20 EMA.',
    relatedTerms: ['Scaling In', 'Position Sizing', 'Trend Following'],
    faqs: []
  },
  {
    term: 'Risk-On / Risk-Off',
    slug: 'risk-on-risk-off',
    definition: 'A market environment where investors either seek out risk (Risk-On) or flee to safety (Risk-Off).',
    detailedExplanation: 'In Risk-On, stocks and high-yield currencies (AUD, NZD) rise. In Risk-Off, Gold and safe-haven currencies (USD, JPY) rise.',
    example: 'The geopolitical news caused a sudden shift to a Risk-Off sentiment.',
    relatedTerms: ['Safe Haven', 'Sentiment', 'Volatility'],
    faqs: []
  },
  {
    term: 'Scalp Trading',
    slug: 'scalp-trading',
    definition: 'A hyper-short-term trading style focusing on capturing tiny price moves.',
    detailedExplanation: 'Scalp trading requires high focus and very low spreads to be profitable over time.',
    example: 'The scalp trader makes 100 trades a day, targeting 1-3 pips per trade.',
    relatedTerms: ['Scalping', 'Day Trading', 'ECN Broker'],
    faqs: []
  },
  {
    term: 'Slippage Tolerance',
    slug: 'slippage-tolerance-def',
    definition: 'The maximum amount of price difference a trader is willing to accept to get an order filled.',
    detailedExplanation: 'If you set a tolerance of 1 pip and the market moves 2 pips before you are filled, the order will be rejected.',
    example: 'During the news release, the trader increased their slippage tolerance to ensure a fill.',
    relatedTerms: ['Slippage', 'Execution', 'Limit Order'],
    faqs: []
  },
  {
    term: 'Stop-Out Level',
    slug: 'stop-out-level',
    definition: 'The specific margin level at which a broker automatically closes a trader\'s open positions.',
    detailedExplanation: 'Usually expressed as a percentage (e.g., 50% margin level). It is the "safety net" to prevent an account from falling into negative balance.',
    example: 'The trader hit their stop-out level after the unexpected market gap.',
    relatedTerms: ['Margin Call', 'Liquidation', 'Margin'],
    faqs: []
  },
  {
    term: 'Trading Journal',
    slug: 'trading-journal',
    definition: 'A record of all trades made, including the rationale, entry/exit points, and psychological state.',
    detailedExplanation: 'A journal is the most powerful tool for improvement, allowing you to identify patterns in your own behavior.',
    example: 'Pete insists that all Drawdown students maintain a detailed trading journal.',
    relatedTerms: ['Psychology', 'Risk Management', 'Drawdown'],
    faqs: []
  },
  {
    term: 'Wash Trading',
    slug: 'wash-trading',
    definition: 'A form of market manipulation where a trader buys and sells the same asset to create misleading market activity.',
    detailedExplanation: 'Wash trading is illegal in regulated markets as it creates artificial volume and price movement.',
    example: 'The regulator investigated the firm for suspected wash trading to inflate the asset\'s value.',
    relatedTerms: ['Market Manipulation', 'Volume', 'FCA'],
    faqs: []
  },
  {
    term: 'Yield Curve',
    slug: 'yield-curve',
    definition: 'A line that plots the interest rates of bonds having equal credit quality but differing maturity dates.',
    detailedExplanation: 'An "Inverted Yield Curve" is historically one of the most reliable predictors of an upcoming economic recession.',
    example: 'Economists are watching the inverted yield curve as a sign of trouble ahead.',
    relatedTerms: ['Recession', 'Bonds', 'Interest Rate'],
    faqs: []
  },
  // INTERMEDIATE (25)
  {
    term: 'Risk of Ruin',
    slug: 'risk-of-ruin',
    definition: 'The probability that a trader will lose so much capital that they can no longer continue trading.',
    detailedExplanation: 'Risk of ruin is a mathematical concept that factors in win rate, risk-to-reward ratio, and the percentage of capital risked per trade. Even a profitable strategy can have a high risk of ruin if the position sizing is too aggressive.',
    example: 'If you risk 10% per trade, your risk of ruin is significantly higher than if you risk 1%, even with a 60% win rate.',
    relatedTerms: ['Kelly Criterion', 'Position Sizing', 'Max Drawdown'],
    faqs: []
  },
  {
    term: 'Kelly Criterion',
    slug: 'kelly-criterion',
    definition: 'A mathematical formula used to determine the optimal size of a series of bets to maximize long-term wealth.',
    detailedExplanation: 'In trading, it helps determine what percentage of your account to risk on a single trade based on your historical edge (win rate and average win/loss). Most traders use a "Fractional Kelly" (e.g., half-Kelly) to account for market uncertainty.',
    example: 'Using the Kelly Criterion, a trader with a 55% win rate and 1:2 R:R might calculate an optimal risk of 3.5% per trade.',
    relatedTerms: ['Position Sizing', 'Risk of Ruin', 'Probability'],
    faqs: []
  },
  {
    term: 'Convergence',
    slug: 'convergence',
    definition: 'When the price of an asset and a technical indicator move in the same direction, confirming the current trend.',
    detailedExplanation: 'Convergence suggests that the momentum behind a move is strong and the trend is likely to continue. It is the opposite of divergence.',
    example: 'The price makes a higher high and the RSI also makes a higher high, showing bullish convergence.',
    relatedTerms: ['Divergence', 'Momentum', 'Trend Following'],
    faqs: []
  },
  {
    term: 'Accumulation',
    slug: 'accumulation',
    definition: 'A phase in the market cycle where institutional investors are quietly buying a large position in an asset.',
    detailedExplanation: 'Accumulation typically occurs after a long downtrend or during a period of consolidation. It is characterized by sideways price action as the "smart money" absorbs supply without driving the price up too quickly.',
    example: 'After a year-long bear market, Bitcoin enters a 3-month accumulation phase before breaking higher.',
    relatedTerms: ['Distribution', 'Smart Money', 'Wyckoff Theory'],
    faqs: []
  },
  {
    term: 'Distribution',
    slug: 'distribution',
    definition: 'A phase in the market cycle where institutional investors are quietly selling their large positions to retail traders.',
    detailedExplanation: 'Distribution often happens at the top of a bull market. While retail traders are buying due to "FOMO," institutional players are exiting their positions, leading to a period of sideways or volatile price action before a trend reversal.',
    example: 'The stock market shows signs of distribution as volume increases while price fails to make new highs.',
    relatedTerms: ['Accumulation', 'Market Cycles', 'Retail Trader'],
    faqs: []
  },
  {
    term: 'Order Block',
    slug: 'order-block',
    definition: 'A specific area on a chart where institutional participants have placed large buy or sell orders.',
    detailedExplanation: 'Order blocks are identified by the last "opposite" candle before a strong move. They often act as powerful support or resistance zones when the price returns to them, as institutions may have unfilled orders left at those levels.',
    example: 'A bullish order block is formed at the bottom of a range before a massive 200-pip breakout.',
    relatedTerms: ['Fair Value Gap', 'Smart Money Concepts', 'Supply and Demand'],
    faqs: []
  },
  {
    term: 'Fair Value Gap (FVG)',
    slug: 'fair-value-gap',
    definition: 'An imbalance in price action where a candle moves so quickly that it leaves a "gap" in the price delivery.',
    detailedExplanation: 'FVGs are identified on a three-candle sequence where the wicks of the first and third candles do not overlap. Markets often return to "fill" these gaps to achieve price equilibrium.',
    example: 'The price gapped down so fast during the news that it left a 30-pip fair value gap that was filled later in the session.',
    relatedTerms: ['Imbalance', 'Order Flow', 'Liquidity'],
    faqs: []
  },
  {
    term: 'Imbalance',
    slug: 'imbalance',
    definition: 'A situation in the market where there is an excess of buy orders over sell orders (or vice versa).',
    detailedExplanation: 'Imbalances lead to rapid price movements as the market searches for the next level of liquidity to match the orders. In order flow trading, imbalances are visible on footprint charts.',
    example: 'A massive buying imbalance at the London open drove the FTSE 100 up by 50 points in minutes.',
    relatedTerms: ['Order Flow', 'Fair Value Gap', 'Liquidity'],
    faqs: []
  },
  {
    term: 'Liquidity Grab',
    slug: 'liquidity-grab',
    definition: 'A price movement designed to trigger stop-loss orders in order to "collect" liquidity for a larger move in the opposite direction.',
    detailedExplanation: 'Institutional players need high liquidity to enter large positions. They may push the price into a "pocket" of stops (e.g., just above a recent high) to fill their sell orders.',
    example: 'The price spiked above yesterday\'s high, triggered all the stops (liquidity grab), and then immediately reversed 100 pips lower.',
    relatedTerms: ['Stop Hunt', 'Smart Money', 'Market Maker'],
    faqs: []
  },
  {
    term: 'Stop Hunt',
    slug: 'stop-hunt',
    definition: 'A deliberate attempt to push the price of an asset to a level where many traders have placed their stop-loss orders.',
    detailedExplanation: 'While often blamed on "manipulation," stop hunts are a natural result of the market seeking liquidity. They typically occur at psychological levels or obvious structural highs and lows.',
    example: 'The market "hunted" the stops sitting at 1.2500 before continuing the original uptrend.',
    relatedTerms: ['Liquidity Grab', 'Support', 'Resistance'],
    faqs: []
  },
  {
    term: 'Market Maker',
    slug: 'market-maker',
    definition: 'A firm or individual that provides liquidity to a market by being ready to buy and sell at all times.',
    detailedExplanation: 'Market makers "make the market" by quoting both a bid and an ask price. They profit from the spread between these prices and help ensure that traders can always execute their orders.',
    example: 'Big banks like JP Morgan and Goldman Sachs act as major market makers in the Forex world.',
    relatedTerms: ['Liquidity Provider', 'Bid-Ask Spread', 'ECN Broker'],
    faqs: []
  },
  {
    term: 'Institutional Trading',
    slug: 'institutional-trading',
    definition: 'The buying and selling of assets by large organizations, such as banks, hedge funds, and pension funds.',
    detailedExplanation: 'Institutions account for the vast majority of market volume. Their trades are often so large that they must be executed in pieces or through private "dark pools" to avoid moving the market.',
    example: 'Institutional trading volume typically increases significantly during the New York session.',
    relatedTerms: ['Smart Money', 'Block Trade', 'Dark Pool'],
    faqs: []
  },
  {
    term: 'Smart Money',
    slug: 'smart-money',
    definition: 'Capital controlled by institutional investors, central banks, and other financial professionals.',
    detailedExplanation: 'Smart money is thought to be managed by those with a deeper understanding of the markets. Retail traders often try to "follow the smart money" by identifying institutional footprints on a chart.',
    example: 'The "Smart Money" began accumulating the asset weeks before the public breakout occurred.',
    relatedTerms: ['Retail Trader', 'Institutional Trading', 'Order Block'],
    faqs: []
  },
  {
    term: 'Retail Trader',
    slug: 'retail-trader',
    definition: 'An individual trader who trades for their own account, rather than for an organization.',
    detailedExplanation: 'Retail traders typically have smaller accounts and use retail brokers. While they are a small part of total volume, they are a significant source of "exit liquidity" for institutional players.',
    example: 'Most retail traders focus on technical analysis and use platforms like MetaTrader or TradingView.',
    relatedTerms: ['Smart Money', 'Broker', 'CFD'],
    faqs: []
  },
  {
    term: 'Pip Value',
    slug: 'pip-value',
    definition: 'The monetary value of a one-pip move in a currency pair, based on the position size.',
    detailedExplanation: 'Pip value changes depending on the pair you are trading and your account currency. For a standard lot (100k) of EUR/USD on a USD account, the pip value is exactly $10.',
    example: 'To risk exactly £100 on a trade with a 20-pip stop, your pip value must be £5 per pip.',
    relatedTerms: ['Pip', 'Lot Size', 'Position Sizing'],
    faqs: []
  },
  {
    term: 'Swap Rate',
    slug: 'swap-rate',
    definition: 'The interest rate differential between the two currencies in a forex pair, applied to positions held overnight.',
    detailedExplanation: 'Also known as "Rollover." If you hold a currency with a higher interest rate than the one you are shorting, you receive a "positive swap." If the opposite is true, you pay a "negative swap."',
    example: 'A trader earns a positive swap by holding a long position in a high-yielding currency like the Mexican Peso.',
    relatedTerms: ['Rollover', 'Carry Trade', 'Interest Rate'],
    faqs: []
  },
  {
    term: 'Rollover',
    slug: 'rollover',
    definition: 'The process of extending the settlement date of an open position to the next business day.',
    detailedExplanation: 'In Forex, rollover occurs at the end of the New York session (5:00 PM EST). This is when swap rates are calculated and applied to the account.',
    example: 'The trader closed their position before 5:00 PM to avoid the high rollover costs over the weekend.',
    relatedTerms: ['Swap Rate', 'Carry Trade', 'Forex'],
    faqs: []
  },
  {
    term: 'Carry Trade',
    slug: 'carry-trade',
    definition: 'A strategy that involves borrowing a currency with a low interest rate to buy a currency with a higher interest rate.',
    detailedExplanation: 'The goal is to profit from the interest rate differential (the "carry") while also potentially gaining from the exchange rate movement.',
    example: 'Borrowing Japanese Yen at 0% to buy Australian Dollars at 4.5% is a classic carry trade.',
    relatedTerms: ['Swap Rate', 'Interest Rate', 'Yield'],
    faqs: []
  },
  {
    term: 'Diversification',
    slug: 'diversification',
    definition: 'The practice of spreading investments across different assets to reduce overall risk.',
    detailedExplanation: 'By holding assets that are not perfectly correlated, a trader can reduce the impact of any single asset\'s poor performance on the total portfolio.',
    example: 'Instead of only trading Tech stocks, the investor adds Gold and Commodities for diversification.',
    relatedTerms: ['Correlation', 'Risk Management', 'Portfolio'],
    faqs: []
  },
  {
    term: 'Monte Carlo Simulation',
    slug: 'monte-carlo-simulation',
    definition: 'A mathematical technique used to estimate the probability of various outcomes in a process that cannot easily be predicted due to the intervention of random variables.',
    detailedExplanation: 'Traders use Monte Carlo simulations to test how a strategy might perform over thousands of randomized sequences of historical trades, helping to identify the worst-case drawdown.',
    example: 'A Monte Carlo simulation showed that the strategy had a 5% chance of hitting a 40% drawdown.',
    relatedTerms: ['Backtesting', 'Max Drawdown', 'Probability'],
    faqs: []
  },

  // ADVANCED (15)
  {
    term: 'Order Flow',
    slug: 'order-flow',
    definition: 'The stream of buy and sell orders currently entering the market.',
    detailedExplanation: 'Order flow analysis looks at the "immediacy" of the market—who is aggressive, who is passive, and where the "resting" orders are located on the book.',
    example: 'The trader switched to order flow analysis to see if large sellers were exhausting their supply at the low.',
    relatedTerms: ['Tape Reading', 'Depth of Market', 'Footprint Chart'],
    faqs: []
  },
  {
    term: 'Delta Volume',
    slug: 'delta-volume',
    definition: 'The difference between the volume traded at the ask price and the volume traded at the bid price.',
    detailedExplanation: 'Positive delta means more aggressive buying; negative delta means more aggressive selling. Delta helps identify who is in control of the price action at a granular level.',
    example: 'A high positive delta on a red candle suggests that sellers are struggling to push the price lower despite aggressive selling.',
    relatedTerms: ['Order Flow', 'Footprint Chart', 'Aggressive Order'],
    faqs: []
  },
  {
    term: 'Footprint Chart',
    slug: 'footprint-chart',
    definition: 'A type of candlestick chart that shows the specific volume traded at every price level within each candle.',
    detailedExplanation: 'Footprint charts provide a "look inside" the candle to see the battle between buyers and sellers. They are essential for advanced order flow trading.',
    example: 'The footprint chart revealed a massive buy imbalance at the very bottom of the wick.',
    relatedTerms: ['Order Flow', 'Delta Volume', 'Depth of Market'],
    faqs: []
  },
  {
    term: 'VWAP (Volume Weighted Average Price)',
    slug: 'vwap',
    definition: 'A technical indicator that calculates the average price of an asset weighted by total volume traded during a specific period (usually daily).',
    detailedExplanation: 'VWAP is considered the "fair value" for the day. Institutional traders often use it as a benchmark for their execution—buying below VWAP and selling above it.',
    example: 'The price pulled back to the VWAP line before continuing its intraday trend.',
    relatedTerms: ['Institutional Trading', 'Moving Average', 'TWAP'],
    faqs: []
  },
  {
    term: 'TWAP (Time Weighted Average Price)',
    slug: 'twap',
    definition: 'An algorithmic execution strategy that calculates the average price of an asset over a specific time period.',
    detailedExplanation: 'TWAP is used by large institutions to execute orders slowly over time to minimize market impact, rather than executing a single large block trade.',
    example: 'The hedge fund used a TWAP algorithm to exit their position over the course of the entire trading day.',
    relatedTerms: ['VWAP', 'Algorithmic Trading', 'Institutional Trading'],
    faqs: []
  },
  {
    term: 'Market Microstructure',
    slug: 'market-microstructure',
    definition: 'The study of how the specific rules and mechanisms of an exchange affect the trading process.',
    detailedExplanation: 'Microstructure analysis looks at things like latency, order types, matching engines, and the behavior of market makers and HFT algorithms.',
    example: 'Understanding market microstructure is vital for developing high-frequency trading strategies.',
    relatedTerms: ['HFT', 'Order Book', 'Liquidity'],
    faqs: []
  },
  {
    term: 'Backtesting',
    slug: 'backtesting',
    definition: 'The process of testing a trading strategy using historical data to see how it would have performed in the past.',
    detailedExplanation: 'Backtesting allows traders to identify the strengths and weaknesses of a strategy before risking real capital. It is the foundation of systematic trading.',
    example: 'After backtesting the strategy over 5 years of data, the trader found it had a 65% win rate.',
    relatedTerms: ['Forward Testing', 'Curve Fitting', 'Monte Carlo'],
    faqs: []
  },
  {
    term: 'Walk Forward Analysis',
    slug: 'walk-forward-analysis',
    definition: 'A technique for evaluating a trading strategy by optimizing it on one segment of data and testing it on a subsequent "out-of-sample" segment.',
    detailedExplanation: 'This process is repeated "walking forward" through time to ensure the strategy is robust and not simply "over-optimized" for a specific period.',
    example: 'The walk-forward analysis revealed that the strategy\'s performance decayed significantly outside of the original optimization period.',
    relatedTerms: ['Backtesting', 'Optimization', 'Curve Fitting'],
    faqs: []
  },
  {
    term: 'Curve Fitting',
    slug: 'curve-fitting',
    definition: 'The error of over-optimizing a trading strategy to fit historical data so perfectly that it fails in real-time trading.',
    detailedExplanation: 'A curve-fitted strategy looks "too good to be true" on paper but is useless for predicting future price movements because it has captured "noise" instead of market "signal."',
    example: 'The trader added 15 filters to their strategy to make the backtest look perfect, resulting in extreme curve fitting.',
    relatedTerms: ['Overfitting', 'Backtesting', 'Optimization'],
    faqs: []
  },
  {
    term: 'Overfitting',
    slug: 'overfitting',
    definition: 'A modeling error where a trading algorithm is so complex that it "memorizes" historical data rather than learning underlying patterns.',
    detailedExplanation: 'Overfitting is a common trap in quantitative trading and machine learning. Overfit models typically have excellent backtest results but fail immediately when exposed to new data.',
    example: 'The neural network was overfitted to the 2021 bull market and failed to handle the 2022 volatility.',
    relatedTerms: ['Curve Fitting', 'Quantitative Trading', 'Backtesting'],
    faqs: []
  },

  // CHART PATTERNS (10)
  {
    term: 'Bull Flag',
    slug: 'bull-flag',
    definition: 'A continuation pattern that occurs after a sharp price increase (the pole) followed by a short period of consolidation (the flag).',
    detailedExplanation: 'A breakout above the upper trendline of the flag signals a continuation of the previous uptrend. It is one of the most reliable bullish patterns.',
    example: 'The Nasdaq 100 broke out of a bull flag on the daily chart, leading to another 5% gain.',
    relatedTerms: ['Bear Flag', 'Continuation Pattern', 'Breakout'],
    faqs: []
  },
  {
    term: 'Bear Flag',
    slug: 'bear-flag',
    definition: 'A continuation pattern that occurs after a sharp price decline followed by a short period of upward consolidation.',
    detailedExplanation: 'A breakout below the lower trendline of the flag signals that the previous downtrend is resuming.',
    example: 'The currency pair formed a bear flag after the interest rate cut, suggesting further weakness.',
    relatedTerms: ['Bull Flag', 'Downtrend', 'Breakout'],
    faqs: []
  },
  {
    term: 'Head and Shoulders',
    slug: 'head-and-shoulders',
    definition: 'A reversal pattern consisting of a large peak (the head) between two smaller peaks (the shoulders).',
    detailedExplanation: 'A break below the "neckline" (the support level connecting the lows) confirms the pattern and suggests a major trend reversal from bullish to bearish.',
    example: 'The S&P 500 completed a head and shoulders pattern, signaling the end of the summer rally.',
    relatedTerms: ['Inverse Head and Shoulders', 'Reversal Pattern', 'Neckline'],
    faqs: []
  },
  {
    term: 'Double Top',
    slug: 'double-top',
    definition: 'A bearish reversal pattern that occurs after an asset reaches a high price twice with a moderate decline between the two peaks.',
    detailedExplanation: 'It is confirmed once price falls below the support level (the "valley" between the peaks). It shows that buyers have failed twice to push price higher.',
    example: 'Bitcoin formed a double top at $69,000 before entering a prolonged bear market.',
    relatedTerms: ['Double Bottom', 'Resistance', 'Reversal Pattern'],
    faqs: []
  },
  {
    term: 'Double Bottom',
    slug: 'double-bottom',
    definition: 'A bullish reversal pattern that occurs after an asset reaches a low price twice with a moderate rise between the two lows.',
    detailedExplanation: 'It is confirmed once price breaks above the resistance level between the two lows. It shows that sellers have exhausted their supply at that level.',
    example: 'The FTSE 100 formed a clear double bottom at 7,200 before rallying back to 7,500.',
    relatedTerms: ['Double Top', 'Support', 'W Bottom'],
    faqs: []
  },
  {
    term: 'Ascending Triangle',
    slug: 'ascending-triangle',
    definition: 'A continuation pattern characterized by a horizontal resistance line and an ascending support line.',
    detailedExplanation: 'It shows that while sellers are holding a specific price, buyers are becoming more aggressive and pushing the lows higher. It usually breaks to the upside.',
    example: 'Gold is consolidating in an ascending triangle on the 4H chart, suggesting a potential breakout.',
    relatedTerms: ['Descending Triangle', 'Breakout', 'Consolidation'],
    faqs: []
  },
  {
    term: 'Descending Triangle',
    slug: 'descending-triangle',
    definition: 'A continuation pattern characterized by a horizontal support line and a descending resistance line.',
    detailedExplanation: 'It shows that while buyers are holding a specific floor, sellers are becoming more aggressive and pushing the highs lower. It usually breaks to the downside.',
    example: 'The stock formed a descending triangle before falling below the $50 support level.',
    relatedTerms: ['Ascending Triangle', 'Bearish', 'Consolidation'],
    faqs: []
  },
  {
    term: 'Wedge Pattern',
    slug: 'wedge-pattern',
    definition: 'A chart pattern characterized by two converging trendlines, either rising or falling.',
    detailedExplanation: 'A "Rising Wedge" is typically bearish (as momentum slows), while a "Falling Wedge" is typically bullish. They represent a period of narrowing volatility before a breakout.',
    example: 'The market broke out of a massive falling wedge, signaling the start of a new bull run.',
    relatedTerms: ['Consolidation', 'Breakout', 'Volatility'],
    faqs: []
  },
  {
    term: 'Cup and Handle',
    slug: 'cup-and-handle',
    definition: 'A bullish continuation pattern where the price forms a "U" shape (the cup) followed by a slight downward drift (the handle).',
    detailedExplanation: 'The handle represents a final period of consolidation before the price breaks above the cup\'s resistance level to continue the uptrend.',
    example: 'The tech stock formed a perfect cup and handle over 6 months before breaking to all-time highs.',
    relatedTerms: ['Continuation Pattern', 'Breakout', 'Bullish'],
    faqs: []
  },
  {
    term: 'Engulfing Candle',
    slug: 'engulfing-candle',
    definition: 'A reversal pattern consisting of two candlesticks where the second candle completely "engulfs" the body of the first.',
    detailedExplanation: 'A Bullish Engulfing candle at the bottom of a trend is a strong buy signal, while a Bearish Engulfing candle at the top is a strong sell signal.',
    example: 'A massive bearish engulfing candle on the daily chart ended the three-week rally.',
    relatedTerms: ['Engulfing Pattern', 'Price Action', 'Reversal'],
    faqs: []
  },

  // ── /basic cross-reference stubs ─────────────────────────────────────────
  {
    term: 'Trading',
    slug: 'trading',
    definition: 'The buying and selling of financial instruments with the aim of profiting from price movements over shorter time frames than traditional investing.',
    detailedExplanation: 'Read the full guide: [What Is Trading?](/basic/what-is-trading)',
    example: 'A retail trader buys GBP/USD in the morning and closes the position in the afternoon for a 30-pip gain.',
    relatedTerms: ['Investing', 'Forex', 'CFD'],
    faqs: []
  },
  {
    term: 'Broker',
    slug: 'broker',
    definition: 'A regulated company or individual that executes trades on your behalf, providing market access, a trading platform, and account infrastructure in exchange for a spread or commission.',
    detailedExplanation: 'Read the full guide: [What Is a Broker?](/basic/what-is-a-broker)',
    example: 'A UK trader opens a spread betting account with an FCA-regulated broker to access the forex market.',
    relatedTerms: ['Spread Betting', 'CFD', 'FCA Regulation'],
    faqs: []
  },
  {
    term: 'Prop Firm',
    slug: 'prop-firm',
    definition: 'A proprietary trading firm that funds traders who pass an evaluation challenge, allowing them to trade larger capital in exchange for a share of profits.',
    detailedExplanation: 'Read the full guide: [What Is a Prop Firm?](/basic/what-is-a-prop-firm)',
    example: 'A trader passes a two-phase FTMO challenge and receives a £100,000 funded account, keeping 80% of profits.',
    relatedTerms: ['Funded Account', 'Drawdown Limit', 'Evaluation'],
    faqs: []
  },
  {
    term: 'Forex (FX)',
    slug: 'forex',
    definition: 'The global market where national currencies are exchanged — the world\'s largest and most liquid financial market, operating 24 hours a day, five days a week.',
    detailedExplanation: 'Read the full guide: [What Is Forex?](/basic/what-is-forex)',
    example: 'A UK trader buys GBP/USD, speculating that the pound will strengthen against the US dollar.',
    relatedTerms: ['Currency Pair', 'Spread Betting', 'Pip'],
    faqs: []
  },
  {
    term: 'Index / Indices',
    slug: 'indices',
    definition: 'A market index measures the combined performance of a defined group of stocks, such as the FTSE 100 (the 100 largest UK-listed companies) or the S&P 500.',
    detailedExplanation: 'Read the full guide: [What Are Indices?](/basic/what-are-indices)',
    example: 'A trader goes long on the FTSE 100 index via a CFD, profiting when the constituent companies\'s share prices rise.',
    relatedTerms: ['FTSE 100', 'Stock', 'CFD'],
    faqs: []
  },
  {
    term: 'Stock / Share',
    slug: 'stock',
    definition: 'A unit of ownership in a company, entitling the holder to a proportional share of its profits and assets.',
    detailedExplanation: 'Read the full guide: [What Is a Stock?](/basic/what-is-a-stock)',
    example: 'Buying 100 shares of Rolls-Royce gives you fractional ownership of the business and entitlement to any dividends paid.',
    relatedTerms: ['Dividend', 'Equity', 'CFD'],
    faqs: []
  },
  {
    term: 'Cryptocurrency',
    slug: 'cryptocurrency',
    definition: 'A digital currency secured by cryptography and operating on a decentralised blockchain network, traded 24/7 on global markets with high volatility.',
    detailedExplanation: 'Read the full guide: [What Is Cryptocurrency Trading?](/basic/what-is-cryptocurrency-trading)',
    example: 'A trader buys Bitcoin via a CFD broker, profiting when the price rises without needing to hold actual Bitcoin in a wallet.',
    relatedTerms: ['Bitcoin', 'Blockchain', 'Volatility'],
    faqs: []
  },
  {
    term: 'Demo Account',
    slug: 'demo-account',
    definition: 'A simulated trading account funded with virtual money, using real market prices and a real platform — allowing practice without financial risk.',
    detailedExplanation: 'Read the full guide: [What Is a Demo Account?](/basic/what-is-a-demo-account)',
    example: 'A beginner opens a demo account with £10,000 of virtual funds and practises executing trades on MT4 before risking real capital.',
    relatedTerms: ['Paper Trading', 'Broker', 'MetaTrader'],
    faqs: []
  },
  {
    term: 'Trading Platform',
    slug: 'trading-platform',
    definition: 'Software that connects traders to financial markets, enabling order placement, chart analysis, and position management — the primary interface between a trader and their broker.',
    detailedExplanation: 'Read the full guide: [What Is a Trading Platform?](/basic/what-is-a-trading-platform)',
    example: 'A trader uses MetaTrader 4 (MT4) to set entry orders, stop losses, and take profits on a GBP/USD position.',
    relatedTerms: ['MetaTrader', 'TradingView', 'Broker'],
    faqs: []
  },
  {
    term: 'Currency Pair',
    slug: 'currency-pair',
    definition: 'Two currencies quoted together, where one is bought and the other sold simultaneously — for example GBP/USD. The first currency listed is the base currency; the second is the quote currency.',
    detailedExplanation: 'Read the full guide: [What Is Forex?](/basic/what-is-forex)',
    example: 'Buying GBP/USD at 1.2700 means buying pounds and selling dollars at that exchange rate. A rise to 1.2800 produces a 100-pip profit.',
    relatedTerms: ['Forex', 'Pip', 'Base Currency', 'Quote Currency'],
    faqs: []
  },
  {
    term: 'Trading Account',
    slug: 'trading-account',
    definition: 'The account held with a broker that is used to fund and execute live trades, distinct from a demo account, which uses virtual funds instead of real capital.',
    detailedExplanation: 'Read the full guide: [What Is a Broker?](/basic/what-is-a-broker)',
    example: 'A trader deposits £1,000 into a live trading account with an FCA-regulated broker, enabling them to open real positions in forex and indices.',
    relatedTerms: ['Broker', 'Demo Account', 'Margin'],
    faqs: []
  },
  {
    term: 'Funded Account',
    slug: 'funded-account',
    definition: 'A live trading account funded with a prop firm\'s capital after a trader passes the firm\'s evaluation process, rather than the trader\'s own money.',
    detailedExplanation: 'Read the full guide: [What Is a Prop Firm?](/basic/what-is-a-prop-firm)',
    example: 'After passing a two-phase evaluation, a trader receives a £100,000 funded account and keeps 80% of any profits generated.',
    relatedTerms: ['Prop Firm', 'Evaluation', 'Profit Split'],
    faqs: []
  },
  {
    term: 'Asset Class',
    slug: 'asset-class',
    definition: 'A broad category of financial instruments that share similar characteristics and tend to behave similarly in the market — forex, equities, commodities, and indices are each their own asset class.',
    detailedExplanation: 'Read the full guide: [What Is Trading?](/basic/what-is-trading)',
    example: 'A trader diversifies across asset classes by holding a long position in gold (commodities) while also trading GBP/USD (forex).',
    relatedTerms: ['Forex', 'Commodities', 'Indices', 'Equities'],
    faqs: []
  },
];

