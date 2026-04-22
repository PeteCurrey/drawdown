export interface GlossaryTerm {
  term: string;
  slug: string;
  definition: string;
  detailedExplanation: string;
  example: string;
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
    definition: 'A "pip" (percentage in point) is the smallest price move that a given exchange rate makes based on market convention.',
    detailedExplanation: 'For most currency pairs, such as the EUR/USD, it is the fourth decimal place. For example, a move from 1.0800 to 1.0801 is one pip. For JPY pairs, a pip is the second decimal place (e.g., 145.01 to 145.02). Understanding pips is fundamental to calculating your profit, loss, and risk per trade.',
    example: 'If you buy GBP/USD at 1.2500 and the price rises to 1.2550, the price has moved up by 50 pips.',
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
    definition: 'The spread is the difference between the buy (bid) price and the sell (ask) price of a financial instrument.',
    detailedExplanation: 'The spread is essentially the cost of the trade. Brokers often do not charge a separate commission on spread betting accounts, instead making their money through the spread. A "tight" spread means there is a small difference between the prices, which is better for the trader.',
    example: 'If the bid price for FTSE 100 is 7600 and the ask price is 7601, the spread is 1 point.',
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
    definition: 'The standardized quantity of a financial instrument used in trading.',
    detailedExplanation: 'In Forex, a standard lot is 100,000 units of the base currency. A mini lot is 10,000 (0.1), and a micro lot is 1,000 (0.01). Your lot size determines how much each pip movement is worth in your currency.',
    example: 'On a standard lot of EUR/USD, 1 pip is worth $10. On a micro lot, 1 pip is worth $0.10.',
    relatedTerms: ['Pip', 'Margin', 'Leverage'],
    relatedTool: 'Risk Calculator',
    faqs: []
  },
  {
    term: 'Leverage',
    slug: 'leverage',
    definition: 'The use of borrowed capital to increase the potential return (and risk) of an investment.',
    detailedExplanation: 'Leverage allows you to control a large position with a small amount of capital (margin). In the UK, retail leverage is capped at 30:1 for major forex pairs by the FCA.',
    example: 'With 30:1 leverage, you can control £30,000 worth of currency with a £1,000 deposit.',
    relatedTerms: ['Margin', 'Margin Call', 'Drawdown'],
    faqs: []
  },
  {
    term: 'Margin',
    slug: 'margin',
    definition: 'The amount of money required in your account to open and maintain a leveraged position.',
    detailedExplanation: 'Margin is not a fee; it is a portion of your account balance "locked" by the broker as collateral for your leveraged trade. If your account equity falls below the required margin, your positions may be liquidated.',
    example: 'To open a £100,000 trade with 30:1 leverage, you need £3,333.33 in margin.',
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
    definition: 'An agreement to exchange the difference in the value of an asset from the time the contract is opened to when it is closed.',
    detailedExplanation: 'CFDs allow you to trade price movements without owning the underlying asset. They are leveraged products and are popular for trading stocks, indices, and commodities.',
    example: 'Instead of buying Apple shares, a trader opens a CFD position to profit from the price move with less capital.',
    relatedTerms: ['Leverage', 'Spread Betting', 'Margin'],
    faqs: []
  },
  {
    term: 'Commodities',
    slug: 'commodities',
    definition: 'Raw materials or primary agricultural products that can be bought and sold, such as copper or coffee.',
    detailedExplanation: 'In trading, commodities are usually split into "Hard" (mined, like gold and oil) and "Soft" (grown, like wheat and sugar). They are often used as a hedge against inflation.',
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
    definition: 'The second currency in a forex pair quotation.',
    detailedExplanation: 'In EUR/USD, USD is the quote currency. It indicates how much of the quote currency is needed to buy one unit of the base currency.',
    example: 'If EUR/USD is 1.10, the quote currency (USD) is worth less than the base currency.',
    relatedTerms: ['Base Currency', 'Exchange Rate', 'Forex Pair'],
    faqs: []
  }
];
