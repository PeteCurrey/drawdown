export interface ModuleContent {
  title: string;
  duration: string;
  playbackId: string;
  notes: string;
  quizKey: string;
}

export const courseContent: Record<string, Record<string, ModuleContent>> = {
  "ground-zero": {
    "module-1": {
      title: "Why 90% of Traders Lose Money",
      duration: "25 min read / 15 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "ground-zero/module-1",
      notes: `
        <h2>The Brutal Reality of Retail Trading</h2>
        <p>
          The statistic that <strong>90% of retail traders lose money</strong> is not marketing hype. It is a certified regulatory fact. Under European Securities and Markets Authority (ESMA) rules, CFD brokers in the UK and Europe are legally required to publish the exact percentage of their retail client accounts that lose money. If you look at the footer of any major broker, you will see it consistently listed between <strong>74% and 80%</strong>. When you factor in accounts that go inactive or are completely wiped out within the first 12 months, the true failure rate rises to 90%.
        </p>

        <div class="p-6 bg-accent/5 border-l-2 border-accent my-6">
          <strong>Key Concept:</strong> The market does not care about your account balance, your mortgage, your career goals, or your personal intelligence. It is simply the aggregate reflection of millions of human decisions and institutional order flow. Removing the emotional, personal relationship you have with individual trades is the first step toward professional execution.
        </div>

        <h3>The Four Predictable Behaviors of Failure</h3>
        <p>
          Retail traders do not fail because the markets are "rigged" or because they lack academic intelligence. They fail because they succumb to four predictable, structural behaviors:
        </p>
        <ol>
          <li>
            <strong>Undercapitalisation:</strong> Many beginners start with accounts of £500 or less, expecting to double it weekly. This forces them to take massive leverage and risk percentages (often 10% to 50% per trade). A minor, completely normal drawdown period of 5-6 consecutive losses wipes them out entirely before they can build experience.
          </li>
          <li>
            <strong>Trading Without a Defined Edge:</strong> Most retail participants trade based on "feelings," overnight news cycles, social media tips, or complex combinations of lagging indicators that they have never backtested. They do not have statistical verification that their strategy makes money over a large sample size of trades.
          </li>
          <li>
            <strong>Risk Management Neglect:</strong> Beginners either trade without stop losses entirely (leading to catastrophic single-trade account blowouts) or set their stop losses based on "what they can afford to lose" rather than the technical structure of the market.
          </li>
          <li>
            <strong>Psychological and Discipline Collapses:</strong> This manifests as "revenge trading" (increasing position sizes after a loss to try and win it back), "overtrading" due to boredom, or changing strategy rules after just two or three losing trades in a row.
          </li>
        </ol>

        <h3>The Three Questions You Must Answer</h3>
        <p>
          Before you click the buy or sell button on any platform, you must be able to write down clear answers to these three questions. If you cannot answer them instantly, you are gambling, not trading:
        </p>
        <ul>
          <li><strong>Q1: What is my statistical edge in this setup?</strong> (Which specific, pre-tested rule set is triggering this entry?)</li>
          <li><strong>Q2: What is the maximum cash amount I will lose if I am wrong?</strong> (This must be a fixed percentage, typically 0.5% to 2% of capital.)</li>
          <li><strong>Q3: At what price level will I be proven wrong?</strong> (Where does my stop loss reside based on technical structure?)</li>
        </ul>
      `
    },
    "module-2": {
      title: "How Financial Markets Actually Work",
      duration: "30 min read / 15 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "ground-zero/module-2",
      notes: `
        <h2>The Architecture of Liquidity</h2>
        <p>
          To trade successfully, you must understand the rules of the arena you are entering. The Foreign Exchange (Forex) market is the largest financial market in the world, moving over <strong>$7.5 trillion per day</strong>. Yet, unlike the London Stock Exchange or the New York Stock Exchange, Forex has no central physical exchange. It is an <strong>over-the-counter (OTC)</strong> market—a massive, decentralized network of banks, corporations, institutions, and brokers quoting exchange rates directly to one another.
        </p>

        <div class="p-6 bg-accent/5 border-l-2 border-accent my-6">
          <strong>Key Concept:</strong> You are not competing against other retail traders sitting at home. You are trading against multi-billion dollar algorithms run by institutional desks with 40-year historical data sets, direct market access, and sub-millisecond execution speeds. Survival requires absolute precision.
        </div>

        <h3>Retail Broker Models Explained</h3>
        <p>
          When you place a trade on a retail platform, your order does not go directly to a global interbank matching network. Instead, it is routed through your broker, who handles it in one of three ways:
        </p>
        <ul>
          <li>
            <strong>Market Makers (B-Book):</strong> The broker takes the opposite side of your trade. If you buy, they sell to you. If you lose, they keep the capital as profit. Because 90% of retail traders lose, this is a highly profitable model for brokers.
          </li>
          <li>
            <strong>ECN/STP (A-Book):</strong> The broker acts as an intermediary, passing your order directly to external liquidity providers (commercial banks like JP Morgan or Barclays). They profit solely by adding a small markup to the spread or charging a commission per trade.
          </li>
          <li>
            <strong>Hybrid Model:</strong> Most modern brokers use an algorithm to segment users. Unprofitable traders are kept on the B-Book (maximizing broker profits), while consistently profitable traders are routed to the A-Book (liquidity providers) to eliminate broker risk.
          </li>
        </ul>

        <h3>Market Participants and the Food Chain</h3>
        <p>
          The participants in this market are highly asymmetric in scale and intent:
        </p>
        <ol>
          <li>
            <strong>Central Banks:</strong> Set monetary policy, adjust interest rates, and directly intervene in currency values to stabilize their national economies.
          </li>
          <li>
            <strong>Commercial and Investment Banks:</strong> The market makers of the interbank market, handling 75-80% of all transaction volume.
          </li>
          <li>
            <strong>Hedge Funds and Portfolio Managers:</strong> Speculative giants trading massive capital sizes to beat market indexes.
          </li>
          <li>
            <strong>Corporations:</strong> Participating to hedge currency risks for international operations (e.g., buying raw materials abroad).
          </li>
          <li>
            <strong>Retail Speculators:</strong> Individual traders who represent less than 5% of global market volume.
          </li>
        </ol>
      `
    },
    "module-3": {
      title: "Understanding Price — What a Chart Really Shows",
      duration: "25 min read / 15 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "ground-zero/module-3",
      notes: `
        <h2>Decoding Market Sentiment</h2>
        <p>
          A price chart is not just a line drawing or a set of colored boxes. It is a real-time, historical record of the <strong>collective belief of all market participants</strong> regarding the value of an asset, weighted by the volume of capital they back it with.
        </p>

        <div class="p-6 bg-accent/5 border-l-2 border-accent my-6">
          <strong>Key Concept:</strong> Rejection wicks represent the battlefield footprints of large participants. A long lower wick on a daily candlestick is not just a line; it is empirical proof that sellers tried to push price down, only to be completely overwhelmed by buyers step-in liquidity.
        </div>

        <h3>Candlestick anatomy</h3>
        <p>
          Each candlestick on your screen represents price action over a specific, selected timeframe. Every candle consists of:
        </p>
        <ul>
          <li><strong>Open:</strong> The price at which the time period began.</li>
          <li><strong>High:</strong> The absolute highest price reached during the period.</li>
          <li><strong>Low:</strong> The absolute lowest price reached during the period.</li>
          <li><strong>Close:</strong> The price at the final second of the period.</li>
          <li><strong>Body:</strong> The colored area between the Open and Close.</li>
          <li><strong>Wicks (Shadows):</strong> The thin lines showing price extremes that were rejected before the candle closed.</li>
        </ul>

        <h3>The Hierarchy of Timeframes</h3>
        <p>
          Candles exist on multiple timeframes, from 1-minute to monthly charts:
        </p>
        <ol>
          <li>
            <strong>Higher Timeframes (HTF):</strong> The Daily, Weekly, and Monthly charts. These represent massive volumes of capital and hold the highest statistical significance.
          </li>
          <li>
            <strong>Medium Timeframes (MTF):</strong> The 1-Hour and 4-Hour charts. Used to define intraday trends and key intraday support/resistance zones.
          </li>
          <li>
            <strong>Lower Timeframes (LTF):</strong> The 1-Minute to 15-Minute charts. Used primarily for precise entry timing.
          </li>
        </ol>
        <p>
          The most common rookie mistake is analyzing only a lower timeframe. A perfect bullish setup on a 5-minute chart is statistically irrelevant if it is reacting against a major daily resistance level. Professional analysis always cascades from the top down.
        </p>
      `
    },
    "module-4": {
      title: "The Three Types of Market Participant",
      duration: "20 min read / 15 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "ground-zero/module-4",
      notes: `
        <h2>The Players on the Board</h2>
        <p>
          To navigate price correctly, you must know who is buying and selling, and why they are doing it. Market participants fall into three distinct categories, each acting under entirely different rules and motivations:
        </p>

        <div class="p-6 bg-accent/5 border-l-2 border-accent my-6">
          <strong>Key Concept:</strong> Stop hunts and liquidity sweeps are not personal conspiracies against you. Large institutions cannot enter a 10,000-lot position at a single price point without causing massive slippage. They actively look for areas where retail stop-losses are clustered to fill their own orders.
        </div>

        <h3>1. Hedgers (Commercial Participants)</h3>
        <p>
          Hedgers are corporations that use the financial markets to protect their core business operations from currency fluctuations. For example, if a UK-based airline buys jet fuel in US Dollars, they regularly buy USD and sell GBP to lock in exchange rates. 
        </p>
        <p>
          Hedgers do not trade to make a speculative profit; they trade to eliminate risk. They execute orders at fixed times or specific levels regardless of price, creating predictable, institutional order flow that technical traders can identify.
        </p>

        <h3>2. Speculators (Institutional Capital)</h3>
        <p>
          Hedge funds, proprietary trading firms, and asset managers trade solely for speculative profit. They manage billions of dollars and build positions slowly over days, weeks, or months. 
        </p>
        <p>
          These participants are the drivers of major trends on higher timeframes. Because of their scale, their footprints are easily visible on charts as they build orders in accumulation and distribution zones.
        </p>

        <h3>3. Speculators (Retail Capital)</h3>
        <p>
          Retail speculators represent individual traders. While their capital is small individually, they act in highly predictable psychological patterns. Because retail traders are taught the same basic textbook patterns, their stop losses are almost always clustered in the exact same obvious locations (just below support or just above resistance). Institutional algorithms exploit this predictability to clear out retail orders and capture liquidity.
        </p>
      `
    },
    "module-5": {
      title: "What Spread Betting Is and Why It Matters for UK Traders",
      duration: "20 min read / 15 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "ground-zero/module-5",
      notes: `
        <h2>The UK Tax Advantage</h2>
        <p>
          For residents of the United Kingdom, spread betting is one of the most structurally advantageous ways to trade financial markets. In spread betting, you do not purchase the underlying asset. Instead, you place a bet on the price movement of an instrument, risking a specified cash amount per point of price change.
        </p>

        <div class="p-6 bg-accent/5 border-l-2 border-accent my-6">
          <strong>Key Concept:</strong> Under current UK tax law, spread betting is classified as gambling by HM Revenue & Customs (HMRC). Winnings are 100% free from Capital Gains Tax (CGT) and Income Tax. This is a massive compounding advantage over traders in other countries.
        </div>

        <h3>Major Advantages for UK Traders</h3>
        <ul>
          <li>
            <strong>Tax-Free Profits:</strong> Every pound you make is yours to keep. If you grow an account by £10,000, you pay £0 in capital gains tax, whereas standard CFD trading would require CGT filing.
          </li>
          <li>
            <strong>No Stamp Duty:</strong> Direct purchases of UK shares carry a 0.5% Stamp Duty Reserve Tax. Spread betting bypasses this entirely since you are trading derivatives.
          </li>
          <li>
            <strong>Flexible Sizing:</strong> Sizing is set simply in pounds per point (e.g. £5 per point) rather than dealing with complex lot units or contract calculations.
          </li>
        </ul>

        <h3>The Legal Catch</h3>
        <p>
          While spread betting profits are tax-free, this status comes with specific regulatory constraints:
        </p>
        <ol>
          <li>
            <strong>No Loss Offsetting:</strong> Because spread betting profits are not subject to Capital Gains Tax, any losses you incur cannot be offset against other gains (such as property or stock sales) to reduce your tax bill.
          </li>
          <li>
            <strong>Professional Classification:</strong> If trading becomes your sole or primary source of livelihood and HMRC determines it is your primary trade, they reserve the right to classify it as taxable income.
          </li>
        </ol>
      `
    },
    "module-6": {
      title: "Understanding Risk — The Maths That Keep You in the Game",
      duration: "30 min read / 15 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "ground-zero/module-6",
      notes: `
        <h2>The Math of Long-Term Survival</h2>
        <p>
          This is the most critical module in Phase 1. A trader who masters position sizing and risk management can survive even with a mediocre strategy. A trader who ignores this will blow up their account, regardless of how good their entries are.
        </p>

        <div class="p-6 bg-accent/5 border-l-2 border-accent my-6">
          <strong>Key Concept:</strong> Your primary objective as a trader is not to maximize profit—it is defensive survival. You must protect your capital during inevitable drawdown streaks so that your statistical edge has enough time to play out.
        </div>

        <h3>The Mathematics of Ruin</h3>
        <p>
          Consider what happens to an account during a standard losing streak of 10 consecutive trades (a normal occurrence over a 100-trade sample size):
        </p>
        <ul>
          <li>
            <strong>At 10% Risk Per Trade:</strong> A run of 10 losses wipes out over <strong>65%</strong> of your account capital. To recover back to break-even from a 65% drawdown, you must generate a massive **185% return** on your remaining capital just to get back to zero.
          </li>
          <li>
            <strong>At 1% Risk Per Trade:</strong> A run of 10 consecutive losses draws your account down by only <strong>9.5%</strong>. A 10.5% return on your remaining balance gets you back to break-even. This is easily achievable and structurally manageable.
          </li>
        </ul>

        <h3>The Position Sizing Protocol</h3>
        <p>
          To keep risk fixed at exactly 1% on every trade, your position size must change depending on your stop loss distance:
        </p>
        <div className="bg-background-primary p-6 border border-border-slate/50 font-mono text-xs overflow-x-auto my-6 text-text-primary">
          Risk Amount = Balance × Risk% <br />
          Position Size (Lots) = Risk Amount / (Stop Loss Distance in Pips × Pip Value)
        </div>
        <p>
          If you have a £10,000 account and risk 1% (£100):
        </p>
        <ul>
          <li>A 50-pip stop loss means you trade exactly **0.20 lots**.</li>
          <li>A 25-pip stop loss means you trade exactly **0.40 lots**.</li>
        </ul>
        <p>
          In both cases, if the trade hits your stop loss, you lose exactly £100. Sizing positions this way completely removes the risk of catastrophic account damage.
        </p>
      `
    },
    "module-7": {
      title: "Choosing Your Instrument — What to Trade and Why",
      duration: "20 min read / 15 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "ground-zero/module-7",
      notes: `
        <h2>Structuring Your Watchlist</h2>
        <p>
          New traders often try to monitor 30 different markets, leading to analysis paralysis and low-quality executions. Professional traders build deep expertise in just one or two instruments.
        </p>

        <div class="p-6 bg-accent/5 border-l-2 border-accent my-6">
          <strong>Key Concept:</strong> Every asset class has its own personality, session structure, volatility range, and average transaction costs. Specializing in a single instrument lets you learn its specific daily rhythms and patterns.
        </div>

        <h3>The Primary Asset Classes</h3>
        <ol>
          <li>
            <strong>Forex Majors:</strong> Pairs containing the US Dollar (like GBP/USD, EUR/USD). These offer the highest liquidity, tightest spreads, and cleanest technical behaviors. For UK traders, <strong>GBP/USD</strong> (Cable) is an ideal starter pair due to tight spreads and clear session structure.
          </li>
          <li>
            <strong>Indices:</strong> Baskets of stocks (like the FTSE 100, S&P 500, or NASDAQ). Indices reflect macroeconomic sentiment. They tend to trend much more smoothly and cleanly than individual currencies.
          </li>
          <li>
            <strong>Commodities:</strong> Gold (XAU/USD) acts as a hedge against inflation and dollar strength. It has excellent technical structures but carries higher volatility. Oil is heavily driven by geopolitics and supply data, making it harder for beginners.
          </li>
          <li>
            <strong>Cryptocurrencies:</strong> Bitcoin and Ethereum. High volatility and 24/7 trading schedules mean there is no session structure. They are highly susceptible to sudden spikes and liquidity sweeps, making them dangerous for beginners.
          </li>
        </ol>
      `
    },
    "module-8": {
      title: "Setting Up Your Trading Environment",
      duration: "20 min read / 15 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "ground-zero/module-8",
      notes: `
        <h2>Building Your Infrastructure</h2>
        <p>
          Your trading environment dictates your execution. Professional environments are designed to reduce friction and eliminate emotional triggers.
        </p>

        <div class="p-6 bg-accent/5 border-l-2 border-accent my-6">
          <strong>Key Concept:</strong> Indicators do not predict price—they only summarize past price action. Set up your charts on TradingView with pure price action (naked candlesticks) and volume. Master reading market structure before adding indicators.
        </div>

        <h3>Your Daily Preparation Routine</h3>
        <p>
          Before you look for trade setups, you must execute a strict pre-market routine every single morning:
        </p>
        <ol>
          <li>
            <strong>Check the Economic Calendar:</strong> Identify high-impact releases (like CPI, Interest Rate decisions, or NFP). Never place a trade right before a high-impact news release.
          </li>
          <li>
            <strong>Define HTF Trend:</strong> Open the Daily chart and determine the directional bias (bullish/bearish).
          </li>
          <li>
            <strong>Mark Key Levels:</strong> Draw the previous day's High and Low, the weekly open, and major structural support/resistance zones.
          </li>
          <li>
            <strong>Write Your Plan:</strong> Define the exact conditions under which you will buy or sell today. If those conditions do not occur, you do not trade.
          </li>
        </ol>
        <p>
          You have now completed Phase 1 ("Ground Zero"). You understand market structure, risk math, and broker mechanics. Do not proceed to Phase 2 until you can answer the three core trade questions from Module 1 for any setup you see on a chart.
        </p>
      `
    }
  },
  "fundamental-edge": {
    "module-1": {
      title: "Macroeconomics 101: Central Banks & Interest Rates",
      duration: "25 min read / 15 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "fundamental-edge/module-1",
      notes: `
        <h2>The Engine of Exchange Rates</h2>
        <p>
          Interest rates are the single most powerful driver of currency values in the global financial markets. Central banks—such as the Federal Reserve (Fed), the Bank of England (BoE), and the European Central Bank (ECB)—manipulate interest rates to control inflation and stabilize economic growth.
        </p>
        <div class="p-6 bg-accent/5 border-l-2 border-accent my-6">
          <strong>Key Concept:</strong> Capital flows toward yield. When a central bank raises its benchmark interest rate, deposits denominated in that currency earn higher interest. Foreign investors buy that currency to capture the higher yield, driving demand and causing the currency to appreciate.
        </div>
        <h3>The Mandate of Central Banks</h3>
        <p>
          Central banks operate under a dual mandate: stable prices (controlling inflation, usually targeted at 2%) and maximum sustainable employment. Their policy tools include:
        </p>
        <ul>
          <li><strong>Interest Rate Policy:</strong> Adjusting lending rates to expand or contract economic borrowing.</li>
          <li><strong>Quantitative Easing/Tightening (QE/QT):</strong> Buying or selling government debt to inject or drain liquidity from the banking system.</li>
          <li><strong>Forward Guidance:</strong> Using speeches and reports to prepare the market for future policy adjustments.</li>
        </ul>
      `
    }
  },
  "derivatives-options": {
    "module-1": {
      title: "CFD Mechanics: Leverage, Margin & Financing Costs",
      duration: "20 min read / 12 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "derivatives-options/module-1",
      notes: `
        <h2>Understanding Derivative Leverage</h2>
        <p>
          Contracts for Difference (CFDs) are financial derivatives that allow traders to speculate on the price movement of asset classes without owning the underlying asset.
        </p>
        <div class="p-6 bg-accent/5 border-l-2 border-accent my-6">
          <strong>Key Concept:</strong> Leverage multiplies both gains and losses. A 1:30 leverage ratio means that for every £1,000 of position size, you only need to put up £33.33 of margin. However, a small price movement of just 3.3% against you will wipe out your margin entirely.
        </div>
        <h3>CFD Overhead Costs</h3>
        <p>
          CFD trading carries structural costs that you must calculate into your trading setups:
        </p>
        <ul>
          <li><strong>Spread:</strong> The difference between the buy (ask) and sell (bid) price quoted by your broker.</li>
          <li><strong>Commissions:</strong> Fixed charges per lot (primarily on equity CFDs).</li>
          <li><strong>Overnight Financing (Swap):</strong> The cost of borrowing funds to maintain a leveraged position overnight, determined by interbank interest rates.</li>
        </ul>
      `
    }
  },
  "portfolio-architect": {
    "module-1": {
      title: "Investing vs. Saving: The Power of Compounding",
      duration: "18 min read / 10 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "portfolio-architect/module-1",
      notes: `
        <h2>The Wealth Accumulation Matrix</h2>
        <p>
          Saving preserves money, but investing grows it. In an inflationary environment, holding cash in a standard savings account is a guaranteed way to lose purchasing power.
        </p>
        <div class="p-6 bg-accent/5 border-l-2 border-accent my-6">
          <strong>Key Concept:</strong> Compound interest is the eighth wonder of the world. Albert Einstein famously noted: "He who understands it, earns it... he who doesn't, pays it." Small, consistent investments compounding over decades grow exponentially.
        </div>
        <h3>The Rule of 72</h3>
        <p>
          To calculate how long it will take to double your investment capital at a given annual return rate, divide 72 by the interest rate:
        </p>
        <ul>
          <li>At a 6% annual return, your capital doubles in <strong>12 years</strong> (72 / 6).</li>
          <li>At a 10% annual return, your capital doubles in <strong>7.2 years</strong> (72 / 10).</li>
        </ul>
      `
    }
  }
};
