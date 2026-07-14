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
            <strong>Psychological and Discipline Collapses:</strong> This manifests as "revenge trading" (increasing position sizes after a loss to try and win it back), "overtrading" due to boredom, or changing strategy rules after just two or three losing trades in a row. Understanding these mental traps is the first step; learn how to master them in our <a href="/courses/mind-over-market/module-1">Mind Over Market Psychology Course</a>.
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
  ,
  "macro-trader": {
    "module-1": {
      title: "Central Bank Policy Cycles — How the BoE, Fed, and ECB Move Markets",
      duration: "25 min read / 15 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "macro-trader/module-1",
      notes: `
        <h2>The Central Bank Monetary policy Cycle</h2>
        <p>
          Institutional price movement does not begin on a TradingView chart. It begins inside the boardroom of the Federal Reserve, the Bank of England, and the European Central Bank. If you want to trade currencies without understanding the interest rate cycle, you are simply speculating on noise. Central banks are the ultimate market participants, and their primary mandate is price stability and economic growth.
        </p>
        <div class="p-6 bg-accent/5 border-l-2 border-accent my-6">
          <strong>Institutional Truth:</strong> Every sustainable trend on higher timeframes has a macroeconomic driver behind it. Capital is not sentimental; it flows globally in search of yield and stability. The interest rate differential between two economies is the primary force that drives exchange rates over weeks and months.
        </div>
        <h3>The Tightening and Easing Cycle</h3>
        <p>
          Central banks manipulate interest rates to control inflation and stimulate growth. When inflation rises above target, banks enter a <strong>tightening cycle</strong>, raising interest rates to cool economic activity. This attracts global yield-seeking capital, strengthening the currency. When the economy slows or enters a recession, banks enter an <strong>easing cycle</strong>, lowering rates and printing liquidity via Quantitative Easing (QE) to stimulate borrowing. This increases supply and lowers yields, weakening the currency.
        </p>
        <p>
          Traders who ignore these policy shifts often find themselves trading against the macro tide, attempting to take technical buy setups on a currency that is fundamentally devaluing.
        </p>
      `
    },
    "module-2": {
      title: "Reading a Monetary Policy Statement Like a Trader",
      duration: "20 min read / 12 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "macro-trader/module-2",
      notes: `
        <h2>Deconstructing the Central Bank Statement</h2>
        <p>
          When a central bank announces its interest rate decision, the headline number (e.g., raising rates by 25 basis points) is only half the story. The real market volatility is triggered by the accompanying <strong>Monetary Policy Statement</strong>. This document is dissected word-by-word by institutional algorithms and desk analysts looking for hawkish or dovish shifts in tone.
        </p>
        <div class="p-6 bg-accent/5 border-l-2 border-accent my-6">
          <strong>Key Distinction:</strong> <em>Hawkish</em> indicates a bias toward higher interest rates to fight inflation (bullish for the currency). <em>Dovish</em> indicates a bias toward lower interest rates to support growth (bearish for the currency).
        </div>
        <h3>Parsing Forward Guidance</h3>
        <p>
          Central banks use forward guidance to prepare the market for future policy decisions. A change of a single word in a statement—such as shifting from 'further rate increases will be required' to 'further rate increases may be appropriate'—signals that the central bank is nearing the end of its tightening cycle. Algorithms detect these shifts in milliseconds, triggering massive order flows before a human trader can finish reading the first paragraph.
        </p>
        <p>
          In this module, we walk through historical statements from the Fed and Bank of England to show you how to identify the subtle linguistic shifts that signal major reversals in trend direction.
        </p>
      `
    },
    "module-3": {
      title: "CPI, PPI & PCE — Which Inflation Data Actually Moves Price",
      duration: "25 min read / 15 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "macro-trader/module-3",
      notes: `
        <h2>The Inflation Data Hierarchy</h2>
        <p>
          Central banks are data-dependent, which means economic releases dictate policy changes. Inflation data is the highest-impact indicator on the economic calendar. However, not all inflation metrics are treated equally by institutional desks. To build an effective macro directional bias, you must understand the difference between CPI, PPI, and PCE.
        </p>
        <h3>The Primary Metrics</h3>
        <ul>
          <li><strong>CPI (Consumer Price Index):</strong> Measures the average change over time in the prices paid by urban consumers for a market basket of consumer goods and services. It is the headline metric that media outlets report and retail traders watch.</li>
          <li><strong>PPI (Producer Price Index):</strong> Measures the average change over time in the selling prices received by domestic producers for their output. PPI is a leading indicator for CPI, as rising producer costs are eventually passed on to consumers.</li>
          <li><strong>PCE (Personal Consumption Expenditures):</strong> The Federal Reserve's preferred measure of inflation. It tracks actual consumer behavior more accurately than CPI by accounting for substitution (e.g., consumers buying chicken when beef prices rise).</li>
        </ul>
        <p>
          A professional trader looks beyond the headline figures. We focus on <strong>Core Inflation</strong> (which strips out volatile food and energy prices) to identify the structural inflation trends that central banks actually trade.
        </p>
      `
    },
    "module-4": {
      title: "Employment Data — Trading NFP, UK Claimant Count, and ADP",
      duration: "20 min read / 12 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "macro-trader/module-4",
      notes: `
        <h2>Trading Labor Market Volatility</h2>
        <p>
          A central bank's mandate is rarely just inflation; it almost always includes maximizing employment. Therefore, employment releases are major market catalysts. The most famous of these is the U.S. <strong>Non-Farm Payrolls (NFP)</strong>, released on the first Friday of every month. It is notorious for triggering extreme volatility, clearing out retail stop-losses in seconds.
        </p>
        <div class="p-6 bg-accent/5 border-l-2 border-accent my-6">
          <strong>The Gold Rule:</strong> We do not gamble on the NFP release. We do not place buy or sell stop orders right before the release hoping to catch the spike. We wait for the data to drop, let the institutional desks digest the numbers, and trade the subsequent structural trend.
        </div>
        <h3>The Employment Indicators</h3>
        <p>
          To understand the health of the labor market, you must track multiple data points:
        </p>
        <ul>
          <li><strong>NFP (Non-Farm Payrolls):</strong> The net change in the number of jobs created in the U.S. during the previous month, excluding the farming sector.</li>
          <li><strong>Average Hourly Earnings:</strong> Measures wage inflation. Even if job creation is strong, weak wage growth can prevent a central bank from raising interest rates.</li>
          <li><strong>Unemployment Rate:</strong> The percentage of the total labor force that is unemployed and actively seeking employment.</li>
          <li><strong>UK Claimant Count:</strong> The UK equivalent, tracking the number of people claiming unemployment-related benefits.</li>
        </ul>
      `
    },
    "module-5": {
      title: "GDP, PMI & Leading Indicators — Building Your Macro Map",
      duration: "22 min read / 12 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "macro-trader/module-5",
      notes: `
        <h2>Leading vs. Lagging Indicators</h2>
        <p>
          To trade macro cycles, you must separate indicators that tell you what has already happened from those that tell you what is about to happen. <strong>GDP (Gross Domestic Product)</strong> is a lagging indicator; it tells you how the economy performed in the previous quarter. By the time GDP data is published, institutional capital has already priced it in.
        </p>
        <h3>PMIs: The Ultimate Leading Indicator</h3>
        <p>
          <strong>PMI (Purchasing Managers' Index)</strong> is a leading indicator based on monthly surveys of purchasing managers in the manufacturing and services sectors. Purchasing managers have early visibility into demand, supply chains, and employment needs. A PMI reading above 50 indicates economic expansion; a reading below 50 indicates contraction.
        </p>
        <p>
          In this module, we teach you how to map GDP cycles, manufacturing and service PMIs, and consumer confidence reports to build a cohesive map of economic health, letting you anticipate central bank policy shifts before they are announced.
        </p>
      `
    },
    "module-6": {
      title: "Interest Rate Differentials & Currency Carry Dynamics",
      duration: "25 min read / 15 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "macro-trader/module-6",
      notes: `
        <h2>The Engine of Capital Flows</h2>
        <p>
          Currencies do not exist in a vacuum. They are traded in pairs, representing a relative exchange rate. The primary force driving the exchange rate between two currencies is the <strong>interest rate differential</strong>—the difference between the interest rates of the base currency and the quote currency.
        </p>
        <div class="p-6 bg-accent/5 border-l-2 border-accent my-6">
          <strong>The Carry Trade:</strong> A strategy where a trader borrows money in a currency with a low interest rate (like the Japanese Yen) and invests it in an asset denominated in a currency with a high interest rate (like the Australian Dollar). The trader profits from the interest rate difference (the carry), provided the exchange rate remains stable.
        </div>
        <h3>The Impact on Spreads and Swap</h3>
        <p>
          Interest rate differentials dictate the daily swap charges (overnight financing fees) on your trading account. If you hold a long position on a pair where the base currency has a significantly higher rate than the quote currency, you earn positive interest daily. Conversely, if you hold a short position, you pay the interest differential.
        </p>
      `
    },
    "module-7": {
      title: "The Dollar Cycle — Risk-On and Risk-Off Asset Rotation",
      duration: "25 min read / 15 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "macro-trader/module-7",
      notes: `
        <h2>The Global Reserve Currency</h2>
        <p>
          The US Dollar (USD) is the cornerstone of the global financial system, involved in nearly 90% of all foreign exchange transactions. To trade any currency, commodity, or index, you must understand the <strong>Dollar Cycle</strong> and how it dictates risk rotation.
        </p>
        <h3>Risk-On vs. Risk-Off Dynamics</h3>
        <ul>
          <li><strong>Risk-On (Equities and High-Yield FX Rally):</strong> When global economic growth is strong and stable, investors seek higher returns. They sell the safe-haven US Dollar and buy riskier assets like equities, commodities, and high-yield currencies (such as the AUD or NZD). The Dollar depreciates.</li>
          <li><strong>Risk-Off (Safe-Haven Flows):</strong> When geopolitical tensions rise, inflation spikes, or global growth slows, investors panic. They liquidate their risky assets and buy safe-havens, primarily the US Dollar and US Treasury bonds. The Dollar appreciates.</li>
        </ul>
        <p>
          We analyze the Dollar Index (DXY) to gauge global risk sentiment, helping you align your trade selection with macro asset rotation.
        </p>
      `
    },
    "module-8": {
      title: "Geopolitical Event Risk — How to Size and Stay in the Trade",
      duration: "20 min read / 12 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "macro-trader/module-8",
      notes: `
        <h2>Trading Through Geopolitical Chaos</h2>
        <p>
          Wars, elections, trade tariffs, and sudden headlines can break a technical chart in milliseconds. These are classified as <strong>geopolitical event risks</strong>. While they are impossible to predict, they are entirely manageable if you use proper risk sizing and defensive execution.
        </p>
        <div class="p-6 bg-accent/5 border-l-2 border-accent my-6">
          <strong>Pete's Rule:</strong> During periods of extreme geopolitical tension (such as elections or war outbreaks), we do not stop trading entirely. Instead, we cut our standard position sizes in half (e.g., from 1% risk to 0.5% risk) and widen our stop-losses to absorb the increased spread volatility.
        </div>
        <h3>Managing Slip and Liquidity Gaps</h3>
        <p>
          During major geopolitical events, bank liquidity providers temporarily withdraw their limit orders from the market to protect themselves. This causes spreads to widen dramatically, leading to severe <strong>slippage</strong> on market orders. We cover how to use limit orders instead of market orders to guarantee entry price and prevent slippage during news events.
        </p>
      `
    },
    "module-9": {
      title: "Building a Weekly Macro Bias — Your Directional Framework",
      duration: "25 min read / 15 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "macro-trader/module-9",
      notes: `
        <h2>Developing Your Weekly Playbook</h2>
        <p>
          Amateur traders open their charts on Monday morning and look for setups. Professional traders build their <strong>weekly directional bias</strong> during the weekend, before a single market price updates. A weekly bias framework filters out the noise, ensuring you only trade in the direction of institutional capital flows.
        </p>
        <h3>The Macro Bias Checklist</h3>
        <ol>
          <li><strong>Central Bank Mapping:</strong> Which central banks are hawkish, which are dovish, and where are they in their respective rate cycles?</li>
          <li><strong>Economic Calendar Audit:</strong> Which high-impact (Tier-1) data releases are scheduled for the coming week, and when?</li>
          <li><strong>Risk Sentiment Check:</strong> Is the market operating in a Risk-On or Risk-Off environment? What is the Dollar Index (DXY) signaling?</li>
        </ol>
        <p>
          By combining these variables, you write down a strict ruleset for the week: e.g., 'Only buy GBP/USD on technical pullbacks. Do not take sell setups, regardless of chart appearance.'
        </p>
      `
    },
    "module-10": {
      title: "Combining Macro Bias With Technical Entries — The Unified Model",
      duration: "30 min read / 18 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "macro-trader/module-10",
      notes: `
        <h2>The Unified Trading Model</h2>
        <p>
          Macroeconomics gives you the direction. Technical analysis gives you the entry. If you try to trade macro alone, you will get stopped out constantly because your entries are sloppy. If you trade technicals alone, you will get run over by central bank decisions. The <strong>Unified Model</strong> combines both without contradiction.
        </p>
        <div class="p-6 bg-accent/5 border-l-2 border-accent my-6">
          <strong>The Workflow:</strong> Macro Bias tells you *what* to trade and *which direction* to take. Technical Analysis (structure, supply and demand, and liquidity sweeps) tells you *where* and *when* to execute.
        </div>
        <h3>Synthesizing the Trade</h3>
        <p>
          If your macro bias is long GBP/JPY (hawkish BoE vs. dovish BoJ), you do not buy immediately at the weekly open. You wait for price to pull back to a technical support zone, such as a 4-hour demand zone, or wait for a liquidity sweep of a previous session low. When the technical trigger fires in the direction of the macro bias, you execute with maximum confidence.
        </p>
      `
    }
  },
  "prop-firm-mastery": {
    "module-1": {
      title: "How Prop Firms Actually Work — The Business Model Explained",
      duration: "20 min read / 12 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "prop-firm-mastery/module-1",
      notes: `
        <h2>The Business Model of Proprietary Trading</h2>
        <p>
          Proprietary trading firms (prop firms) do not charge evaluation fees out of charity. They are highly profitable businesses with a model that relies on a single statistic: <strong>over 95% of retail traders fail their evaluations</strong>. To succeed in this industry, you must discard the marketing hype and understand how they actually make money.
        </p>
        <h3>The Two Books: Demo vs. Live</h3>
        <ul>
          <li><strong>Evaluation Stage (Demo):</strong> The evaluation fees paid by failing traders fund the operations and payouts of the tiny percentage of traders who pass. Most prop firms keep funded accounts on demo servers, copying only a select few to live liquidity.</li>
          <li><strong>Funded Stage (Copy Trading):</strong> Firms use proprietary risk algorithms to monitor successful traders. If a trader shows consistent, professional risk parameters, their trades are copied onto the firm's real corporate account. The firm splits the profit with the trader (typically an 80/20 split).</li>
        </ul>
        <p>
          Understanding this model tells you exactly what they want: consistency and strict risk compliance, not explosive short-term gains.
        </p>
      `
    },
    "module-2": {
      title: "Evaluation Structures — 1-Phase, 2-Phase & Instant Funding Compared",
      duration: "22 min read / 12 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "prop-firm-mastery/module-2",
      notes: `
        <h2>Selecting Your Evaluation Channel</h2>
        <p>
          Prop firms offer multiple challenge structures. Choosing the right one depends on your trading style, risk tolerance, and timeframe. We compare the three primary models.
        </p>
        <h3>1. Two-Phase Evaluation (Standard)</h3>
        <p>The industry benchmark. Phase 1 requires a 8-10% profit target with a 5% daily / 10% max loss limit, usually in 30 days. Phase 2 requires a 5% profit target under the same risk limits in 60 days. This offers the best value and lowest fees.</p>
        <h3>2. One-Phase Evaluation (Speed)</h3>
        <p>Requires a single phase to get funded, but carries stricter rules. The profit target is typically 10%, and the maximum drawdown is often <strong>trailing</strong> rather than static. Trailing drawdown moves up with your account balance, locking in profits and narrowing your margin of error.</p>
        <h3>3. Instant Funding (No Exam)</h3>
        <p>You bypass the evaluation entirely and manage funded capital immediately. However, the registration fees are significantly higher, the leverage is heavily restricted, and the profit split starts much lower (typically 50%).</p>
      `
    },
    "module-3": {
      title: "Challenge Rules Deep-Dive — Daily Drawdown, Max Loss & Profit Targets",
      duration: "25 min read / 15 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "prop-firm-mastery/module-3",
      notes: `
        <h2>Mastering the Rules of the Exam</h2>
        <p>
          More traders fail evaluations due to technical rule violations than because they lack a profitable strategy. The rules are the actual test. You must understand the mathematics behind daily drawdown limits, max loss, and consistency requirements.
        </p>
        <div class="p-6 bg-accent/5 border-l-2 border-accent my-6">
          <strong>Daily Drawdown Limit:</strong> The maximum equity or balance decrease allowed in a single day (typically 5%). It is calculated based on the previous day's midnight server balance. If you have open trades floating in profit at midnight, your daily limit moves up, creating a trap for swing traders. Learn more about managing drawdowns in our <a href="/courses/risk-manager/module-4">Drawdown Recovery Guide</a>.
        </div>
        <h3>The Rule Mechanics</h3>
        <ul>
          <li><strong>Maximum Loss (Static):</strong> The absolute lowest balance/equity your account is allowed to reach (typically 10% below starting balance). Violation results in instant breach.</li>
          <li><strong>Consistency Rule:</strong> Prevents gambling. No single trade or single trading day can account for more than 30% to 50% of your total profit target.</li>
        </ul>
      `
    },
    "module-4": {
      title: "Passing a Challenge — The Conservative Approach That Actually Works",
      duration: "22 min read / 12 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "prop-firm-mastery/module-4",
      notes: `
        <h2>The Low-Risk Evaluation Playbook</h2>
        <p>
          Retail forums are full of traders who passed a £100k challenge in two days. Those traders are almost always back to buying new evaluations the following week. Passing a challenge in 48 hours requires taking massive leverage and risk—gambling. To build a career, you need a conservative, repeatable process.
        </p>
        <h3>The Conservative Formula</h3>
        <p>
          Instead of risking 2% to 5% per trade to hit the target quickly, you risk exactly <strong>0.5% of the starting balance</strong> per trade. If your stop loss is hit, you lose 0.5%. To breach the 5% daily drawdown, you would have to lose 10 trades in a single day without a single win—a mathematical improbability if you execute a proven edge.
        </p>
        <p>
          This approach takes longer, but it removes the psychological panic of being close to the drawdown limit, letting you execute with precision.
        </p>
      `
    },
    "module-5": {
      title: "Prop Firm Risk Management — Stricter Rules Than Your Own Money",
      duration: "20 min read / 12 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "prop-firm-mastery/module-5",
      notes: `
        <h2>Defensive Sizing on Funded Accounts</h2>
        <p>
          When you manage funded capital, you do not own the money. You are managing the firm's capital under their strict parameters. Therefore, you must apply stricter risk controls than you would on your own personal account.
        </p>
        <div class="p-6 bg-accent/5 border-l-2 border-accent my-6">
          <strong>Funded Rule:</strong> On a personal account, you might risk 1% per trade. On a funded account, once you pass, you immediately drop your risk to <strong>0.25% to 0.5%</strong>. Your objective is not to double the account; it is to secure small, consistent payouts (1% to 3% monthly) which generate massive returns on high capital sizes.
        </div>
        <h3>Dealing With Correlation Risk</h3>
        <p>
          You cannot hold multiple correlated positions (e.g. buying EUR/USD and GBP/USD) on a funded account. A single USD-strengthening event will trigger both stop-losses, leading to a 1% drawdown and potentially breaching your daily limit.
        </p>
      `
    },
    "module-6": {
      title: "Scaling Plans — Going from £10k to £200k in Funded Capital",
      duration: "22 min read / 12 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "prop-firm-mastery/module-6",
      notes: `
        <h2>The Capital Scaling Blueprint</h2>
        <p>
          A £10k funded account will not generate full-time income if you practice proper risk management. But a £200k account will. The real power of the prop firm model is the <strong>scaling plan</strong>, which rewards consistent risk management with free capital increases.
        </p>
        <h3>How Scaling Works</h3>
        <p>
          Most major firms offer a scaling plan that increases your account size by 25% every 3 to 4 months, provided you satisfy two conditions:
        </p>
        <ol>
          <li>You achieve a total net profit of 10% over the 4-month period.</li>
          <li>You do not breach any daily or maximum drawdown limits during that time.</li>
        </ol>
        <p>
          By scaling systematically, you can grow a modest initial challenge fee into a massive portfolio managing hundreds of thousands of pounds.
        </p>
      `
    },
    "module-7": {
      title: "Prop Firm Red Flags — The Firms That Don't Pay Out",
      duration: "20 min read / 12 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "prop-firm-mastery/module-7",
      notes: `
        <h2>Navigating the Industry Minefield</h2>
        <p>
          The prop firm boom has attracted many predatory operators. These firms design rules specifically to trap traders, or simply refuse to pay out profits once a trader passes. You must perform strict due diligence on any firm before paying an evaluation fee.
        </p>
        <h3>Red Flags to Watch For</h3>
        <ul>
          <li><strong>Hidden Spreads and Slippage:</strong> Firms that run demo servers with artificially widened spreads during news releases to force rule breaches.</li>
          <li><strong>Vague 'Consistency' Rules:</strong> Rules that allow the firm to deny payouts based on subjective definitions of trading style.</li>
          <li><strong>Unreasonable Payout Timelines:</strong> Firms that delay payouts for 30 or 60 days, hoping you will trade and blow the account in the meantime.</li>
        </ul>
        <p>
          We list the confirmed, reputable firms (like FTMO and The5ers) that have multi-year histories of consistent payouts to UK traders.
        </p>
      `
    },
    "module-8": {
      title: "UK Tax on Prop Firm Payouts — What HMRC Expects",
      duration: "25 min read / 15 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "prop-firm-mastery/module-8",
      notes: `
        <h2>HMRC and Prop Firm Payouts</h2>
        <p>
          One of the biggest misconceptions among UK traders is that prop firm payouts are tax-free under spread betting laws. This is a dangerous mistake. Prop firm payouts are <strong>not tax-free</strong>. You must structure your business and report your earnings correctly to avoid HMRC audits.
        </p>
        <div class="p-6 bg-accent/5 border-l-2 border-accent my-6">
          <strong>HMRC Classification:</strong> Because you do not hold a personal trading account with a broker, but are instead contracted by a firm to provide trading services, your payouts are classified as <strong>self-employed service income</strong>, subject to Income Tax.
        </div>
        <h3>Structuring Your Business</h3>
        <p>
          You have two primary options: registering as a Sole Trader or establishing a Limited Company. We compare the tax efficiency of both, including corporate tax rates, dividend extraction, and writing off business expenses (like data feeds and charting platforms).
        </p>
      `
    }
  },
  "ai-trader": {
    "module-1": {
      title: "What AI Can and Cannot Do in Trading — Separating Signal From Hype",
      duration: "20 min read / 12 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "ai-trader/module-1",
      notes: `
        <h2>The Truth About AI in Trading</h2>
        <p>
          Artificial intelligence is the most hyped technology in finance. YouTube is flooded with videos promoting 'automated AI bots that generate 100% win rates.' This is marketing garbage. To use AI effectively, you must understand its actual technical capabilities and limitations.
        </p>
        <h3>The Reality of LLMs</h3>
        <p>
          Large language models (like Claude or GPT-4) cannot predict future price movements. They have no access to real-time interbank order flows and cannot 'see' the future. If you ask an AI 'will EUR/USD go up today?', its response is simply a guess based on historical patterns.
        </p>
        <p>
          AI is not a fortune teller. It is an <strong>analyst, assistant, and automation infrastructure</strong>. It excels at parsing unstructured data, generating code, and summarizing macro events. We focus on these practical use cases.
        </p>
      `
    },
    "module-2": {
      title: "Using Claude and GPT as Pre-Trade Research Tools",
      duration: "22 min read / 12 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "ai-trader/module-2",
      notes: `
        <h2>AI-Assisted Pre-Trade Research</h2>
        <p>
          A professional trader spends hours preparing pre-session briefs, summarizing monetary statements, and auditing economic calendars. AI can reduce this workflow to minutes, allowing you to focus entirely on execution.
        </p>
        <div class="p-6 bg-accent/5 border-l-2 border-accent my-6">
          <strong>Use Case:</strong> You can upload a 10-page central bank policy statement into Claude and ask: 'Summarize the key hawk/dove changes compared to last month's statement, and list any changes in inflation or growth forecasts.'
        </div>
        <h3>The Research Prompts</h3>
        <p>
          We provide custom prompts designed to scrape economic websites, analyze sentiment, and output clean briefings directly into your dashboard before the London open.
        </p>
      `
    },
    "module-3": {
      title: "Building a Custom AI Trade Journal Prompt System",
      duration: "25 min read / 15 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "ai-trader/module-3",
      notes: `
        <h2>Custom Prompting for Trade Logs</h2>
        <p>
          A trade journal is only useful if you audit the data. Standard journals show you your win rate and expectancy, but they cannot tell you *why* you violated your rules. By building a custom AI prompting system, you can upload your trade logs and receive objective feedback on your execution discipline.
        </p>
        <h3>The AI Journal Prompt</h3>
        <p>
          We design a system prompt that turns Claude into a strict trading coach. You input your strategy ruleset, entry screenshots, and trade notes. The AI parses the inputs, checks for strategy compliance, and calculates a <strong>Discipline Score</strong>, highlighting any deviations from your playbook.
        </p>
      `
    },
    "module-4": {
      title: "Automating Your Morning Briefing With AI-Scraped Macro Data",
      duration: "22 min read / 12 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "ai-trader/module-4",
      notes: `
        <h2>Morning Briefing Automation</h2>
        <p>
          To trade macro bias, you need to know the state of yields, global indices, commodities, and upcoming economic releases every morning. Automating this data collection ensures you start your day with a clear macro map.
        </p>
        <h3>The Automation Pipeline</h3>
        <p>
          We walk through a simple, no-code pipeline that uses tools like Make.com to scrape economic calendars and yield feeds, passes the raw data to OpenAI's API, and sends a summarized morning briefing directly to your Telegram or Discord channel at 7:00 AM GMT.
        </p>
      `
    },
    "module-5": {
      title: "Pine Script Fundamentals — Coding Your Strategy Rules in TradingView",
      duration: "25 min read / 15 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "ai-trader/module-5",
      notes: `
        <h2>Writing Pine Script for TradingView</h2>
        <p>
          TradingView's native coding language, <strong>Pine Script</strong>, allows you to build custom indicators and strategy backtesters. Coding your rules removes all ambiguity from your trading, forcing you to define entries and exits mathematically.
        </p>
        <h3>Pine Script Basics</h3>
        <p>
          No coding experience is required. We teach you variables, conditional logic ('if' statements), plotting shapes, and setting alerts. We show you how to use Claude to generate Pine Script syntax rapidly, debug compilation errors, and install scripts directly onto your TradingView charts.
        </p>
      `
    },
    "module-6": {
      title: "Backtesting in TradingView — Strategy Tester, Inputs & Monte Carlo",
      duration: "30 min read / 18 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "ai-trader/module-6",
      notes: `
        <h2>Automated Backtesting and Optimization</h2>
        <p>
          Once you code your strategy rules in Pine Script, you can run them against a decade of tick data in seconds using TradingView's <strong>Strategy Tester</strong>. This module covers how to interpret the results and stress-test performance.
        </p>
        <div class="p-6 bg-accent/5 border-l-2 border-accent my-6">
          <strong>Backtest Note:</strong> Do not fall into the trap of over-optimizing parameters (curve fitting) to achieve a perfect backtest curve. We cover manual verification workflows; check out the <a href="/courses/the-backtester/module-2">Manual Backtesting workflow</a> to compare results.
        </div>
        <h3>The Strategy Metrics</h3>
        <p>
          We analyze profit factor, drawdown, and expectancy, and show you how to export the trade list to run Monte Carlo simulations.
        </p>
      `
    },
    "module-7": {
      title: "Building an AI Market Scanner — Prompts, Filters & Alert Logic",
      duration: "25 min read / 15 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "ai-trader/module-7",
      notes: `
        <h2>Building Custom Market Scanners</h2>
        <p>
          You cannot watch 30 currency pairs and indices simultaneously. An automated market scanner does the watching for you, alerting you only when a pair satisfies your precise technical rules.
        </p>
        <h3>Programming the Scanner</h3>
        <p>
          We show you how to code a multi-pair scanner in TradingView that checks for structural alignments (e.g. price tapping daily demand while the 15-minute chart breaks structure), filters out low-volume sessions, and sends instant alerts.
        </p>
      `
    },
    "module-8": {
      title: "Creating a Personal AI Trading Playbook",
      duration: "20 min read / 12 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "ai-trader/module-8",
      notes: `
        <h2>The Digital Strategy Playbook</h2>
        <p>
          A professional playbook contains entry templates, invalidation rules, exit targets, and execution checklists. By structuring this document digitally, you can feed it to Claude to ensure your daily journals are audited against the correct strategy version.
        </p>
        <h3>AI Playbook Construction</h3>
        <p>
          We show you how to format your trading strategies into Markdown files, document your edge parameters, and write a system prompt that evaluates your daily trades against your official playbook.
        </p>
      `
    },
    "module-9": {
      title: "Automating Your Trade Log — CSV to AI Analysis Pipeline",
      duration: "22 min read / 12 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "ai-trader/module-9",
      notes: `
        <h2>Automated Trade Auditing</h2>
        <p>
          Manually entering data into a journal is tedious, leading to missed logs. By automating your trade log pipeline, you ensure every trade is recorded and analyzed without friction.
        </p>
        <h3>The API Pipeline</h3>
        <p>
          We demonstrate how to set up an automated script that monitors your MetaTrader or TradingView trade history, exports execution metrics (price, time, slippage, profit) into a CSV file, and passes it to Claude to generate weekly behavioral reports.
        </p>
      `
    },
    "module-10": {
      title: "Using AI to Detect Emotional Patterns in Your Trading History",
      duration: "25 min read / 15 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "ai-trader/module-10",
      notes: `
        <h2>AI Emotional Analytics</h2>
        <p>
          Your trading log contains hidden behavioral patterns. You might lose most of your money on Friday afternoons, or consistently revenge trade after a loss on GBP/USD. AI can detect these patterns across hundreds of logs.
        </p>
        <h3>Behavioral Pattern Detection</h3>
        <p>
          We provide a custom Python script (runnable in Google Colab) that imports your trade journal CSV, aggregates execution times and drawdown sequences, and uses an LLM to output a psychological report detailing your specific behavioral leaks.
        </p>
      `
    },
    "module-11": {
      title: "Advanced — Connecting TradingView Webhooks to Automated Systems",
      duration: "30 min read / 18 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "ai-trader/module-11",
      notes: `
        <h2>Automating Execution via Webhooks</h2>
        <p>
          Once you have a fully mechanical strategy backtested and coded, the final step is automating execution. This removes human emotion entirely from the click.
        </p>
        <div class="p-6 bg-accent/5 border-l-2 border-accent my-6">
          <strong>Caution:</strong> Live automation is high-risk. A coding bug can empty your account in minutes. We cover strict safety features, including API key restrictions and max exposure caps.
        </div>
        <h3>The Webhook Workflow</h3>
        <p>
          We explain how to connect TradingView alerts (using JSON payloads) to a bridge service (like PineConnector), which instantly translates the alert into a buy or sell order on your MetaTrader account.
        </p>
      `
    },
    "module-12": {
      title: "Ethics and Risk of Automation — When to Keep the Human in the Loop",
      duration: "20 min read / 12 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "ai-trader/module-12",
      notes: `
        <h2>The Human-in-the-Loop Framework</h2>
        <p>
          Fully automated systems operate well during normal market conditions, but fail during black-swan events or surprise interest rate decisions. A professional retail trader does not walk away from the desk entirely; they use a <strong>human-in-the-loop</strong> model.
        </p>
        <h3>The Separation of Roles</h3>
        <ul>
          <li><strong>AI Role:</strong> Scanning charts, calculating position sizing, and managing trailing stops on active trades.</li>
          <li><strong>Human Role:</strong> Checking the macro calendar, pausing the bots before high-impact releases, and auditing execution logs.</li>
        </ul>
      `
    }
  },
  "the-backtester": {
    "module-1": {
      title: "What Backtesting Actually Tells You — and What It Lies About",
      duration: "20 min read / 12 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "the-backtester/module-1",
      notes: `
        <h2>The Philosophy of Backtesting</h2>
        <p>
          Backtesting is the practice of executing your strategy rules against historical market data to verify statistical edge. It is the only way to build the psychological conviction required to trade through a drawdown. However, backtests can lie if they are executed incorrectly.
        </p>
        <h3>The Lies of Backtesting</h3>
        <ul>
          <li><strong>Hindsight Bias:</strong> Selecting trade entries that look obvious in retrospect, but would have been impossible to execute in real-time.</li>
          <li><strong>Ignoring Slippage and Spreads:</strong> Assuming perfect execution fills that do not exist during real market conditions.</li>
          <li><strong>Over-Optimization (Curve Fitting):</strong> Tweaking strategy parameters until they fit historical data perfectly, resulting in a system that fails immediately on live charts.</li>
        </ul>
      `
    },
    "module-2": {
      title: "Manual Backtesting Method — The Right Way to Do It in TradingView",
      duration: "25 min read / 15 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "the-backtester/module-2",
      notes: `
        <h2>The Rigorous Manual Backtest</h2>
        <p>
          Automated backtesting is fast, but manual backtesting is where you build chart fluency. Manual backtesting forces you to train your eyes to see market structure shifts and liquidity zones under simulated live conditions.
        </p>
        <h3>The Replay Workflow</h3>
        <p>
          We use TradingView's <strong>Bar Replay</strong> tool. You select a date in the past, hide the future price action, and advance the chart bar-by-bar. When your mechanical ruleset triggers an entry, you log the trade metrics into a spreadsheet.
        </p>
        <p>
          We cover how to prevent bias by scrolling randomly to start dates, and how to record execution times and spreads accurately.
        </p>
      `
    },
    "module-3": {
      title: "Defining Your Strategy Rules With Zero Ambiguity",
      duration: "22 min read / 12 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "the-backtester/module-3",
      notes: `
        <h2>Codifying Your Trading Playbook</h2>
        <p>
          You cannot backtest a strategy if your rules contain subjective words like 'strong momentum' or 'clear trend.' Subjectivity allows your ego to cheat during the backtest, logging entries that fit the win criteria.
        </p>
        <div class="p-6 bg-accent/5 border-l-2 border-accent my-6">
          <strong>Rule Test:</strong> If you cannot hand your strategy checklist to a 12-year-old child and have them identify the exact same trades on the chart, your rules are too ambiguous.
        </div>
        <h3>Codifying Entry and Exit Rules</h3>
        <p>
          We show you how to turn subjective patterns into mechanical criteria: e.g. replacing 'strong candle close' with 'candle body must be at least 70% of the total range and close above the previous swing high.'
        </p>
      `
    },
    "module-4": {
      title: "Sample Size — How Many Trades Before Your Data Means Something",
      duration: "20 min read / 12 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "the-backtester/module-4",
      notes: `
        <h2>The Mathematics of Sample Sizes</h2>
        <p>
          A common rookie mistake is backtesting 20 trades, seeing a 70% win rate, and assuming they have found an edge. Under probability theory, a 20-trade sample size is statistically meaningless; it is noise.
        </p>
        <h3>The Laws of Large Numbers</h3>
        <p>
          To achieve statistical validity, you need a minimum sample size of <strong>100 to 200 trades</strong>, spanning at least 12 months of market data. This ensures your strategy is tested across different market environments: uptrends, downtrends, consolidations, and high-impact news weeks.
        </p>
        <p>
          We explain how variance behaves across different sample sizes, proving why a larger dataset protects you from choosing a failing strategy.
        </p>
      `
    },
    "module-5": {
      title: "Key Metrics — Win Rate, R:R, Expectancy & Profit Factor Explained",
      duration: "25 min read / 15 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "the-backtester/module-5",
      notes: `
        <h2>Deconstructing Strategy Metrics</h2>
        <p>
          Win rate is the metric retail traders focus on. Expectancy is the metric professionals trade. You can have a 30% win rate and be highly profitable, or a 90% win rate and go broke.
        </p>
        <h3>The Professional Metrics</h3>
        <ul>
          <li><strong>Expectancy:</strong> The average dollar amount you expect to win or lose per trade. Formula: (Win Rate * Average Win Size) - (Loss Rate * Average Loss Size). A positive expectancy is the definition of edge.</li>
          <li><strong>Profit Factor:</strong> The ratio of gross profits to gross losses. A profit factor above 1.5 is strong.</li>
          <li><strong>MAE (Maximum Adverse Excursion):</strong> Tracks how deep into drawdown a trade goes before returning to profit. Essential for optimizing stop-loss placement.</li>
        </ul>
      `
    },
    "module-6": {
      title: "Forward Testing and Walk-Forward Analysis",
      duration: "22 min read / 12 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "the-backtester/module-6",
      notes: `
        <h2>Bridging the Gap to Live Charts</h2>
        <p>
          A backtest shows you how a strategy performed in the past. <strong>Forward testing</strong> (demo trading or trading minimum stake sizes in real-time) shows you how the strategy performs under actual execution conditions.
        </p>
        <h3>Walk-Forward Analysis</h3>
        <p>
          We teach you the institutional workflow: you optimize your strategy parameters on a historical dataset (in-sample data), and then test those parameters on a separate dataset (out-of-sample data) to verify performance. This tells you if your edge is durable or merely fitted to past history.
        </p>
      `
    },
    "module-7": {
      title: "Monte Carlo Simulation — Stress-Testing Your Strategy Against Randomness",
      duration: "25 min read / 15 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "the-backtester/module-7",
      notes: `
        <h2>Stress-Testing Strategy Longevity</h2>
        <p>
          If your backtest of 100 trades has a 60% win rate, you might still experience a string of 10 consecutive losses purely due to random distribution. Will your account survive that streak? <strong>Monte Carlo simulation</strong> answers this question.
        </p>
        <div class="p-6 bg-accent/5 border-l-2 border-accent my-6">
          <strong>The Simulation:</strong> A Monte Carlo simulator takes your backtest trade list and randomizes the order of execution thousands of times. It calculates the probability of your account hitting various drawdown thresholds (e.g. the probability of hitting a 10% drawdown) during these randomized sequences.
        </div>
        <p>
          If the simulator shows a high probability of hitting maximum prop firm drawdowns, you must reduce your risk per trade before going live.
        </p>
      `
    },
    "module-8": {
      title: "Using the Drawdown AI Backtester Tool — Live Walkthrough",
      duration: "30 min read / 15 min video",
      playbackId: "FuM49N00B9bC2o01Q01q6M6Hh1m16V86S00kUSF02y01y7yA",
      quizKey: "the-backtester/module-8",
      notes: `
        <h2>The Drawdown Backtester Interface</h2>
        <p>
          In this final module, we walk through a live demonstration of the Drawdown AI Backtester tool integrated inside your dashboard.
        </p>
        <h3>The Execution Pipeline</h3>
        <p>
          We show you how to upload your TradingView backtest logs (in CSV format), select your starting capital and daily drawdown constraints, and run automated Monte Carlo analysis. You will learn how to read the risk report and adjust your position sizing to satisfy prop firm rules.
        </p>
      `
    }
  }
};
