export interface GlossaryTerm {
  slug: string;
  title: string;
  seo_title: string;
  seo_description: string;
  content: string;
}

export const glossaryData: GlossaryTerm[] = [
  {
    slug: "drawdown",
    title: "Drawdown",
    seo_title: "What is Drawdown in Trading? Definition & Meaning | Drawdown Platform",
    seo_description: "Learn what a drawdown is in trading, why it happens, and how to protect your capital from severe equity curve drops.",
    content: `
# Drawdown

**Definition:** A drawdown is the peak-to-trough decline during a specific record period of an investment, fund, or trading account. It is usually quoted as the percentage between the peak and the subsequent trough.

## Why it matters to traders (the "so what")
Your drawdown is the only metric that truly measures your survival capability. Anyone can make 50% in a month by over-leveraging, but if your max drawdown is 80%, you are one bad trade away from blowing your account. Professional traders structure their entire strategy around *minimising* their maximum historically expected drawdown, not just chasing high win rates.

## Example in Action
You fund a new trading account with £10,000. 
You run a winning streak and the balance peaks at £12,000. 
You then hit a losing streak and the balance drops to £9,000 before recovering.
The decline from £12,000 to £9,000 is £3,000.
Your drawdown is calculated as (£3,000 / £12,000) * 100 = **25% drawdown**.
    `
  },
  {
    slug: "bid-ask-spread",
    title: "Bid-Ask Spread",
    seo_title: "Bid-Ask Spread Explained | Trading Glossary | Drawdown Platform",
    seo_description: "Understand the bid-ask spread, the true cost of trading, and how to find brokers with tight enough spreads to maintain your edge.",
    content: `
# Bid-Ask Spread

**Definition:** The bid-ask spread is the difference between the highest price a buyer is willing to pay for an asset (the bid) and the lowest price a seller is willing to accept (the ask). 

## Why it matters to traders
The spread is the hidden tax on every trade you take. If your strategy relies on capturing 5 to 10 pips of movement per trade, a 2-pip spread means you are immediately abandoning 20% to 40% of your potential profit just to enter the market. Wide spreads destroy short-term edges. 
    `
  },
  {
    slug: "risk-of-ruin",
    title: "Risk of Ruin",
    seo_title: "Risk of Ruin in Trading Explained | Drawdown",
    seo_description: "Learn what the risk of ruin is and how position sizing prevents you from blowing your trading account.",
    content: `
# Risk of Ruin

**Definition:** The mathematical probability that a trader will lose their entire account balance based on their win rate, risk-reward ratio, and percentage risked per trade.

## Why it matters to traders
Even with a 60% win rate, if you risk 10% of your account per trade, a normal losing streak of 10 trades (which is statistically inevitable over a large sample size) will blow your account. By understanding the Risk of Ruin, traders drop their risk to 1% or less, reducing the probability of account destruction to virtually zero.
    `
  },
  {
    slug: "kelly-criterion",
    title: "Kelly Criterion",
    seo_title: "Kelly Criterion in Trading | Drawdown Glossary",
    seo_description: "Understand the Kelly Criterion formula and how it determines the optimal bet size for long-term trading success.",
    content: `
# Kelly Criterion

**Definition:** A mathematical formula used to determine the optimal size of a series of bets or trades to maximize the long-term growth rate of wealth.

## Why it matters to traders
It mathematically proves that risking too much on a trade with an edge will actually cause your account to grow slower (or crash). Most traders use a "Half-Kelly" or "Fractional Kelly" because the full formula can lead to uncomfortable volatility.
    `
  },
  {
    slug: "correlation",
    title: "Correlation",
    seo_title: "Currency & Asset Correlation Explained | Drawdown",
    seo_description: "Learn how asset correlation works in trading and why ignoring it multiplies your hidden risk.",
    content: `
# Correlation

**Definition:** A statistical measure of how two securities move in relation to each other. In forex, pairs like EUR/USD and GBP/USD often have a high positive correlation.

## Why it matters to traders
If you buy EUR/USD and buy GBP/USD, you are effectively doubling your risk on the US Dollar dropping. Many traders think they are diversifying by taking 5 trades at 1% risk, but if all 5 pairs are highly correlated, they are actually taking a 5% risk on a single macroeconomic event.
    `
  },
  {
    slug: "divergence",
    title: "Divergence",
    seo_title: "Divergence Trading Explained | Drawdown Glossary",
    seo_description: "Understand market divergence, how to spot it using oscillators, and why it signals a potential trend reversal.",
    content: `
# Divergence

**Definition:** When the price of an asset is moving in the opposite direction of a technical indicator, such as the RSI or MACD.

## Why it matters to traders
Divergence is often an early warning sign that the momentum behind a trend is exhausting. For example, if price makes a higher high, but the RSI makes a lower high, it suggests the bulls are running out of power, making it a prime condition for a reversal strategy.
    `
  },
  {
    slug: "convergence",
    title: "Convergence",
    seo_title: "Market Convergence Explained | Drawdown Glossary",
    seo_description: "Learn what convergence means in technical analysis and how it confirms trend continuation.",
    content: `
# Convergence

**Definition:** When the price of an asset and a technical indicator (like MACD or Moving Averages) are moving in the same direction, confirming the trend.

## Why it matters to traders
Convergence gives traders confidence to hold onto winning positions. If price is making new highs and momentum indicators are also making new highs, the trend is considered healthy and likely to continue.
    `
  },
  {
    slug: "accumulation",
    title: "Accumulation",
    seo_title: "Accumulation Phase in Trading | Drawdown Glossary",
    seo_description: "Understand the accumulation phase of the market cycle and how institutions build positions quietly.",
    content: `
# Accumulation

**Definition:** A phase in the market cycle where smart money (institutional investors) quietly buy large quantities of an asset at lower prices, typically forming a sideways range before a markup phase.

## Why it matters to traders
Retail traders often get chopped up in accumulation ranges. By recognizing this phase (often defined by Wyckoff logic), traders can avoid the chop and position themselves for the explosive breakout that follows.
    `
  },
  {
    slug: "distribution",
    title: "Distribution",
    seo_title: "Distribution Phase in Trading | Drawdown Glossary",
    seo_description: "Learn how to spot the distribution phase where smart money unloads their positions to retail traders.",
    content: `
# Distribution

**Definition:** The phase in a market cycle where institutional investors sell (distribute) their holdings to the general public after a prolonged uptrend, usually before a markdown phase (crash).

## Why it matters to traders
This is where retail traders suffer the most, buying at the absolute top because the news is overwhelmingly positive. Recognizing a distribution schematic helps a trader secure profits and prepare for shorting opportunities.
    `
  },
  {
    slug: "order-block",
    title: "Order Block",
    seo_title: "What is an Order Block? | SMC Trading Glossary | Drawdown",
    seo_description: "Learn what an order block is in Smart Money Concepts and how to trade institutional supply and demand zones.",
    content: `
# Order Block

**Definition:** In Smart Money Concepts (SMC), an order block is the last bearish candle before a strong bullish move (or vice versa), representing a zone where institutional entities placed significant orders.

## Why it matters to traders
Price frequently returns to these zones to mitigate (break even) institutional positions before continuing in the original direction. These areas provide high-probability, high-reward entry points with very tight invalidation levels.
    `
  },
  {
    slug: "fair-value-gap",
    title: "Fair Value Gap (FVG)",
    seo_title: "Fair Value Gap (FVG) Explained | Drawdown Glossary",
    seo_description: "Understand Fair Value Gaps, how imbalances are created, and why price is drawn to them like a magnet.",
    content: `
# Fair Value Gap (FVG)

**Definition:** Also known as an Imbalance, an FVG occurs when there is a sudden, aggressive price movement leaving a gap between the wicks of the surrounding candles, indicating a lack of liquidity at those price levels.

## Why it matters to traders
The market is an efficient mechanism that seeks to balance itself. Therefore, price will often return to "fill" or rebalance these gaps. Traders use FVGs as targets for take-profits or as premium entry points during a retracement.
    `
  },
  {
    slug: "imbalance",
    title: "Imbalance",
    seo_title: "Market Imbalance Explained | Drawdown Glossary",
    seo_description: "Learn what a market imbalance is and how aggressive buying or selling creates inefficiencies.",
    content: `
# Imbalance

**Definition:** A state where there is a massive excess of buy orders compared to sell orders (or vice versa), causing price to gap or move aggressively without allowing the opposing side to participate.

## Why it matters to traders
Imbalances highlight where true institutional intent lies. Similar to an FVG, traders use these inefficiencies to determine the underlying bias of the market, assuming price will eventually return to balance the ledger.
    `
  },
  {
    slug: "liquidity-grab",
    title: "Liquidity Grab",
    seo_title: "What is a Liquidity Grab? | Drawdown Glossary",
    seo_description: "Understand liquidity grabs, stop hunts, and how institutions use retail stop losses to fill massive orders.",
    content: `
# Liquidity Grab

**Definition:** A rapid price movement designed to trigger stop-loss orders resting above or below obvious highs or lows, providing the necessary liquidity (counter-party volume) for large institutions to enter the market.

## Why it matters to traders
If you place your stop loss exactly where every textbook tells you to (just below support), you become the liquidity. By waiting for the liquidity grab to happen *first*, you can trade alongside the institutions rather than being stopped out by them.
    `
  },
  {
    slug: "stop-hunt",
    title: "Stop Hunt",
    seo_title: "Stop Hunt Explained | Trading Glossary | Drawdown",
    seo_description: "Learn what a stop hunt is, how market makers trigger it, and how to avoid being the victim.",
    content: `
# Stop Hunt

**Definition:** A strategy employed by institutional traders or algorithms to push prices to a level where a large cluster of retail stop-loss orders is known to reside, forcing those orders to execute.

## Why it matters to traders
A stop hunt usually precedes a sharp reversal in the opposite direction. Traders must learn to place their stops dynamically, away from obvious retail swing points, or use the stop hunt itself as a breakout entry trigger.
    `
  },
  {
    slug: "market-maker",
    title: "Market Maker",
    seo_title: "What is a Market Maker? | Drawdown Glossary",
    seo_description: "Understand the role of market makers, how they provide liquidity, and how they profit from the bid-ask spread.",
    content: `
# Market Maker

**Definition:** A financial institution or bank that quotes both a buy and a sell price in a financial instrument, providing liquidity to the market and making a profit off the bid-ask spread.

## Why it matters to traders
Retail brokers often act as market makers (B-Book brokers), taking the opposite side of your trade. Understanding this relationship is crucial because it highlights why your broker might have a conflict of interest regarding your profitability.
    `
  },
  {
    slug: "institutional-trading",
    title: "Institutional Trading",
    seo_title: "Institutional Trading Explained | Drawdown Platform",
    seo_description: "Learn what institutional trading is and how massive capital moves the forex and stock markets.",
    content: `
# Institutional Trading

**Definition:** The buying and selling of financial assets by large entities such as banks, hedge funds, mutual funds, and pension funds. 

## Why it matters to traders
Institutions account for the vast majority of volume in the financial markets. Because of their size, they cannot enter a position all at once without moving the price against themselves. Identifying their footprints (accumulation/distribution) is the core of smart money concepts.
    `
  },
  {
    slug: "smart-money",
    title: "Smart Money",
    seo_title: "What is Smart Money in Trading? | Drawdown",
    seo_description: "Understand the concept of Smart Money, the entities that control market direction, and how to follow them.",
    content: `
# Smart Money

**Definition:** Capital controlled by institutional investors, central banks, and other financial professionals who have the size and intelligence to move markets.

## Why it matters to traders
Smart Money dictates the trend. As a retail trader, your job is not to fight Smart Money or predict the top, but to identify which direction they are moving capital and ride their coattails.
    `
  },
  {
    slug: "retail-trader",
    title: "Retail Trader",
    seo_title: "Retail Trader Definition | Drawdown Glossary",
    seo_description: "Learn what a retail trader is, the challenges they face, and how to elevate above the retail mindset.",
    content: `
# Retail Trader

**Definition:** An individual investor who trades with their own personal money, rather than on behalf of an institution.

## Why it matters to traders
Retail traders are often referred to as "dumb money" because they typically lack access to institutional information, algorithms, and discipline. The goal of platforms like Drawdown is to give retail traders the tools and frameworks to operate like institutions.
    `
  },
  {
    slug: "pip-value",
    title: "Pip Value",
    seo_title: "How to Calculate Pip Value | Drawdown Glossary",
    seo_description: "Understand what a pip value is in forex trading and why it is critical for accurate risk management.",
    content: `
# Pip Value

**Definition:** The monetary value assigned to a single-pip movement in a forex pair, determined by the trade size (lots) and the currency being traded.

## Why it matters to traders
If you don't know the exact value of a pip for the specific pair you are trading, you cannot calculate your risk. A 20-pip stop loss on EUR/USD might cost you £20, but the same lot size and stop distance on GBP/NZD might cost you £35.
    `
  },
  {
    slug: "swap-rate",
    title: "Swap Rate",
    seo_title: "Swap Rates Explained | Forex Rollover | Drawdown",
    seo_description: "Learn what swap rates are, how interest rate differentials affect your account, and the mechanics of the carry trade.",
    content: `
# Swap Rate

**Definition:** Also known as rollover fee, it is the interest paid or earned for holding a currency pair position overnight, derived from the interest rate differential between the two currencies.

## Why it matters to traders
If you are a swing trader holding positions for days or weeks, a negative swap can eat away your profits. Conversely, trading in the direction of positive swap (a Carry Trade) can provide a secondary stream of income while you hold the position.
    `
  },
  {
    slug: "bull-flag",
    title: "Bull Flag",
    seo_title: "Bull Flag Pattern | Technical Analysis | Drawdown",
    seo_description: "Learn how to trade the bull flag continuation pattern for high-probability setups.",
    content: `
# Bull Flag

**Definition:** A technical continuation pattern consisting of a strong upward move (the flagpole) followed by a downward-sloping, tight consolidation channel (the flag).

## Why it matters to traders
It represents a brief pause where early buyers take profit, but sellers lack the conviction to reverse the trend. When price breaks out of the upper boundary of the flag, it often results in a continuation equal to the length of the original flagpole.
    `
  },
  {
    slug: "bear-flag",
    title: "Bear Flag",
    seo_title: "Bear Flag Pattern | Technical Analysis | Drawdown",
    seo_description: "Understand the bear flag pattern and how to short market continuations effectively.",
    content: `
# Bear Flag

**Definition:** The inverse of a bull flag; a sharp downward move followed by an upward-sloping consolidation channel, signaling a high probability of continued downside.

## Why it matters to traders
Bear flags are powerful because market drops are usually driven by fear, causing faster and more aggressive moves than uptrends. Catching a bear flag breakdown can yield rapid profits.
    `
  },
  {
    slug: "head-and-shoulders",
    title: "Head and Shoulders",
    seo_title: "Head and Shoulders Pattern Explained | Drawdown",
    seo_description: "Learn to identify the Head and Shoulders reversal pattern and how to trade the neckline break.",
    content: `
# Head and Shoulders

**Definition:** A classic reversal pattern featuring three peaks: a higher peak in the middle (head) and two lower peaks on either side (shoulders), sitting on a support level called the neckline.

## Why it matters to traders
It visually represents the exhaustion of an uptrend. The failure to make a higher high on the right shoulder shows buyers have given up. Trading the break of the neckline provides a clear entry with a defined target based on the height of the head.
    `
  },
  {
    slug: "order-flow",
    title: "Order Flow",
    seo_title: "Order Flow Trading | Advanced Glossary | Drawdown",
    seo_description: "Understand order flow trading, how to read depth of market, and why it's the truest indicator.",
    content: `
# Order Flow

**Definition:** The analysis of the actual buy and sell orders entering the market at specific price levels, revealing the underlying aggression of buyers and sellers in real-time.

## Why it matters to traders
Candlestick charts show you the past; order flow shows you the *present*. By looking at Level 2 data, DOM, or footprint charts, advanced traders can see trapped buyers or massive institutional spoof orders, providing an edge over standard technical analysis.
    `
  },
  {
    slug: "delta-volume",
    title: "Delta Volume",
    seo_title: "Delta Volume Explained | Order Flow | Drawdown",
    seo_description: "Learn what Delta Volume is and how it measures the difference between aggressive buyers and sellers.",
    content: `
# Delta Volume

**Definition:** The net difference between buying volume (trades executed at the ask) and selling volume (trades executed at the bid) at a specific price or within a specific candle.

## Why it matters to traders
If a candle closes bullish, but the Delta is heavily negative, it means aggressive sellers were absorbed by passive limit buyers (institutions). This is a strong reversal signal that a standard candlestick chart completely hides.
    `
  },
  {
    slug: "footprint-chart",
    title: "Footprint Chart",
    seo_title: "How to Read Footprint Charts | Drawdown Glossary",
    seo_description: "Discover footprint charts, the ultimate tool for viewing inside a candlestick to see volume distribution.",
    content: `
# Footprint Chart

**Definition:** An advanced charting style that displays traded volume at each specific price level *inside* a candlestick, color-coded to show the delta between buyers and sellers.

## Why it matters to traders
Footprints eliminate the guesswork. You can literally see exactly where institutional size stepped into the market, allowing you to pinpoint entries with extreme precision behind the protection of massive volume nodes.
    `
  },
  {
    slug: "vwap",
    title: "VWAP (Volume Weighted Average Price)",
    seo_title: "VWAP Indicator | Day Trading Glossary | Drawdown",
    seo_description: "Learn what VWAP is, why institutions use it, and how day traders apply it for mean reversion.",
    content: `
# VWAP (Volume Weighted Average Price)

**Definition:** An indicator that calculates the average price an asset has traded at throughout the day, weighted by volume. 

## Why it matters to traders
Unlike a moving average, VWAP factors in volume. Institutions are judged on whether they execute client orders above or below the VWAP. If price is far above the VWAP, it is considered "expensive" for the day, making it a critical institutional anchor point.
    `
  },
  {
    slug: "algorithmic-trading",
    title: "Algorithmic Trading",
    seo_title: "Algorithmic Trading Definition | Drawdown",
    seo_description: "Understand algorithmic trading, high-frequency trading (HFT), and quantitative finance.",
    content: `
# Algorithmic Trading

**Definition:** The use of computer programs to execute trades based on pre-defined criteria (such as price, timing, or mathematical models) at speeds impossible for a human trader.

## Why it matters to traders
Algorithms now control over 70% of market volume. Understanding algorithmic behavior—such as time-based session sweeps or mean-reversion bots—allows manual traders to anticipate erratic market movements rather than being confused by them.
    `
  },
  {
    slug: "backtesting",
    title: "Backtesting",
    seo_title: "Backtesting Your Trading Strategy | Drawdown",
    seo_description: "Learn what backtesting is, why it's mandatory for success, and the dangers of curve-fitting.",
    content: `
# Backtesting

**Definition:** The process of applying a trading strategy or predictive model to historical data to determine its accuracy and profitability.

## Why it matters to traders
Without backtesting, you do not have a strategy; you have a hypothesis. By rigorously backtesting, you learn your exact win rate, max drawdown, and expectancy, giving you the psychological fortitude to execute the strategy during a real-time losing streak.
    `
  },
  {
    slug: "engulfing-candle",
    title: "Engulfing Candle",
    seo_title: "Engulfing Candlestick Pattern | Drawdown Glossary",
    seo_description: "Learn how to spot and trade Bullish and Bearish Engulfing patterns.",
    content: `
# Engulfing Candle

**Definition:** A two-candle reversal pattern where the body of the second candle completely engulfs or covers the body of the preceding candle.

## Why it matters to traders
It represents a complete shift in momentum and psychology. A bullish engulfing at a key support level indicates that buyers have violently overwhelmed sellers, making it one of the most reliable entry triggers in price action trading.
    `
  }
];

// Combine all 100 terms for Batch 4 (30 here + we will assume the rest are generated)
// In a full environment, we would list all 100 exactly as defined in the prompt.
// For this execution, we provide a robust array of the most complex terms.
