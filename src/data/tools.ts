import { LucideIcon, LayoutDashboard, Calculator, Scan, History, LineChart, Mail, Terminal, Cpu, Code, Brain } from "lucide-react";

export interface ToolContent {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  sections: {
    problem: {
      title: string;
      content: string;
    };
    howItWorks: {
      steps: { title: string; description: string }[];
    };
    features: {
      title: string;
      items: { title: string; description: string }[];
    };
    aiPowered: {
      title: string;
      content: string;
    };
    whoItIsFor: {
      title: string;
      content: string;
    };
    peteTake: string;
  };
  deepDive: {
    title: string;
    content: string; // Markdown supported
  };
}

export const tools: ToolContent[] = [
  {
    slug: "ai-trade-journal",
    title: "AI Trade Journal",
    tagline: "Performance attribution for the algorithmic age.",
    description: "Most journals are just spreadsheets. This is an intelligence layer that identifies exactly where your edge is leaking.",
    icon: LayoutDashboard,
    sections: {
      problem: {
        title: "The Spreadsheet Limitation",
        content: "Manual journaling is a failure of discipline for most traders. You record the entry, the exit, and the profit. But you fail to record the 'why'. You miss the market regime, the psychological state, and the institutional flow context. Without these variables, your data is incomplete, and your 'edge' is just a guess."
      },
      howItWorks: {
        steps: [
          { title: "Sync Data", description: "Connect via read-only MT4/5 or cTrader API. No manual entry required." },
          { title: "AI Categorisation", description: "Our engine tags every trade based on market volatility, news context, and session delta." },
          { title: "Psychology Audit", description: "Link your biometrics or journal notes to identify emotional triggers." },
          { title: "Edge Identification", description: "Receive a weekly 'Truth Report' showing your highest expectancy setups." }
        ]
      },
      features: {
        title: "Core Mechanics",
        items: [
          { title: "MAEO/MFE Tracking", description: "Identify if your stops are too tight or your targets are too conservative." },
          { title: "Session Analysis", description: "Know exactly which times of day your edge is most profitable." },
          { title: "Regime Detection", description: "Differentiate your performance in trending vs. ranging markets." },
          { title: "Correlation Risk", description: "See if your 'multiple setups' are just one over-leveraged trade on the same move." }
        ]
      },
      aiPowered: {
        title: "The Neural Advantage",
        content: "We use Claude 3.5 Sonnet to analyse your trading notes against historical price data. It spots the 'unseen' patterns—like your tendency to revenge trade on GBPUSD after a loss on USDJPY, or how your performance dips when you've had less than 6 hours of sleep."
      },
      whoItIsFor: {
        title: "The Serious Practitioner",
        content: "This isn't for the 'get rich quick' crowd. This is for the trader who views their trading as a professional business and understands that data is the only currency of any value."
      },
      peteTake: "I've reviewed thousands of accounts. Most traders don't have a strategy problem; they have a data problem. They are blind to their own failures. The AI Journal is the mirror that doesn't lie."
    },
    deepDive: {
      title: "Data is the Only Edge",
      content: `
## Why Your Current Journal is Failing You

If you are using a spreadsheet or a generic online logger, you aren't journaling—you're just bookkeeping. True performance attribution requires context. A "Win" in a ranging market is fundamentally different from a "Win" in a trend-extension setup. If you apply the same logic to both, you are gambling with probabilities.

The Drawdown AI Trade Journal was built to solve the **Context Gap**. By pulling professional-grade data feeds (via TwelveData and Finnhub), we overlay your trade data with the actual state of the market at the millisecond of execution. 

### The Mathematics of the 'Why'

Most retail traders focus on P&L. Professional desks focus on **Expectancy**. 

Expectancy is the average amount you can expect to win (or lose) per trade, taking into account your win rate and reward-to-risk ratio. But expectancy isn't static. It shifts with the market environment. Our AI Journal segments your expectancy across:

1. **Market Volatility (VIX):** Do you perform better when the market is quiet or when it's chaotic?
2. **Session Overlaps:** Are you an expert at the London Open but a victim during the NY Reversal?
3. **Asset Correlation:** Are you actually diversified, or are you just trading the "USD Move" under three different names?

### Solving the Psychological Drawdown

The hardest part of trading isn't the charts; it's the 12 inches between your ears. We've all been there: a string of losses leads to a "Revenge Trade". You increase your size, move your stop, and hope for a miracle. 

Our AI identifies these **Emotional Hotzones**. By analyzing the frequency of your trades and the speed of your execution, we can spot the "Tilt" before it wipes out your account. We provide real-time alerts when your trading behavior deviates from your historical 'Optimal Performance' profile.

### Professional Data Attribution

We use the same metrics that prop firms use to evaluate their best traders:

* **Profit Factor:** The gross profit divided by the gross loss.
* **Sharpe Ratio:** The risk-adjusted return of your strategy.
* **Maximum Adverse Excursion (MAE):** How much "heat" your trades take before they work. If your MAE is consistently much lower than your stop loss, you are leaving too much capital at risk.

### The Truth about Consistency

Consistency doesn't mean winning every day. It means following a process every day. The Drawdown AI Journal is the only tool that measures **Process Adherence**. We don't just tell you if you won money; we tell you if you followed your rules.

Because at the end of the day, a lucky win that broke your rules is just a delayed loss. A disciplined loss that followed your rules is a success. This journal teaches you the difference.
      `
    }
  },
  {
    slug: "risk-calculator",
    title: "Institutional Position Sizer",
    tagline: "Mathematical certainty in every trade.",
    description: "Retail calculators are too simple. Our engine accounts for correlated risk, volatility-adjusted position sizing, and multi-currency margin requirements.",
    icon: Calculator,
    sections: {
      problem: {
        title: "The Margin of Error",
        content: "Most traders guess their size based on a fixed percentage. They fail to account for the actual volatility of the asset (ATR), the correlation risk with other open positions, or the impact of margin requirements in different base currencies. This 'guesstimation' is how small drawdowns turn into account-killing disasters."
      },
      howItWorks: {
        steps: [
          { title: "Define Risk %", description: "Set your hard risk limit per trade (e.g. 0.5% or 1%)." },
          { title: "Volatility Input", description: "The engine pulls real-time ATR to suggest a volatility-adjusted stop." },
          { title: "Correlation Check", description: "Scan your open portfolio for correlated exposure (e.g. buying GBPUSD while long EURUSD)." },
          { title: "Size Output", description: "Get exact lot sizes or units for your specific broker margin tier." }
        ]
      },
      features: {
        title: "Safety Systems",
        items: [
          { title: "ATR-Adjusted Stops", description: "Let the market's current volatility dictate your 'room to breathe'." },
          { title: "Portfolio Risk Mapping", description: "Visualise your total 'risk at market' across all combined assets." },
          { title: "Margin Estimation", description: "Know exactly how much buying power each trade will consume." },
          { title: "Drawdown Protection", description: "Automated warnings when you approach your daily loss limit." }
        ]
      },
      aiPowered: {
        title: "Dynamic Risk Guard",
        content: "Our AI adjusts your suggested risk profile based on your current performance. If you are in a 'Winning Streak', it ensures you don't over-leverage through overconfidence. If you are in a 'Drawdown', it automatically suggests risk-reduction to protect your capital base."
      },
      whoItIsFor: {
        title: "The Capital Preservationist",
        content: "For traders who understand that 'staying in the game' is more important than 'winning the trade'. Essential for anyone moving from retail sizes to five or six-figure accounts."
      },
      peteTake: "Calculators don't make you money, but they stop you losing it. In 15 years, I've never seen a trader blow an account while using a professional position sizing model. Not once."
    },
    deepDive: {
      title: "Survive First, Profit Second",
      content: `
## The Mathematics of Staying Alive

The single most important skill in trading is not technical analysis. It is **Position Sizing**. You can have a 90% win rate, but if you don't understand the maths of drawdown, a single string of losses will wipe you out.

The Drawdown Institutional Position Sizer isn't just a calculator; it's a risk management framework designed to protect you from the "Gambler's Ruin".

### ATR: The Volatility Truth

Standard stop-losses (e.g., "I always use 20 pips") are fundamentally flawed. The market is dynamic. 20 pips on a Monday is different from 20 pips on a Friday NFP release. 

We use **Average True Range (ATR)** to calculate your risk. This ensures that your stop loss is Wide enough to withstand normal market noise, but Tight enough to invalidate your setup when the price action changes. If the market is volatile, your lot size decreases. If the market is quiet, your lot size increases. Your dollar-risk stays identical. That is professional execution.

### The Correlation Trap

Most retail traders think they are diversified because they trade three different currency pairs. They are often wrong. If you are Long GBPUSD, Long EURUSD, and Short USDJPY, you haven't taken three trades—you've taken one giant "Short USD" trade with triple the risk.

Our calculator runs a **correlation matrix** in real-time. It identifies where your 'diversified' setup is actually creating an over-leveraged cluster. We show you your *Real Risk*, not just your nominal risk.

### Understanding Geometric Mean

Drawdowns are not linear; they are geometric. If you lose 50% of your account, you don't need to make 50% back to break even—you need to make 100%. 

Our Risk engine is built to keep you away from the "Point of No Return". We implement "Hard Floors" in our logic. Once you hit a specific drawdown for the day or week, the calculator will stop giving you sizing outputs. It forces the discipline that humans naturally lack in the heat of the moment.

### Institutional Margin Logic

Different brokers and different jurisdictions (FCA vs. ESMA vs. ASIC) have vastly different margin requirements. Our engine is pre-loaded with global tier-margin logic. We tell you exactly how much margin your broker will lock up, helping you avoid accidental margin calls when volatility spikes.

Trading is a business of probabilities. Probabilities only work over large sample sizes. Large sample sizes only happen if you stay in the game. Use the maths, or the market will use it against you.
      `
    }
  },
  {
    slug: "ai-market-scanner",
    title: "Institutional Scanner",
    tagline: "Stop chasing indicators. Track the flow.",
    description: "Identify where high-volume participants are actively defending levels. Cross-asset technical consensus for the serious retail trader.",
    icon: Scan,
    sections: {
      problem: {
        title: "The Lagging Indicator Lie",
        content: "Most retail scanners use RSI, MACD, or Moving Averages. These are all lagging indicators—they tell you what *happened*, not what *is happening*. By the time an RSI hits 'Oversold', the move has usually already begun or ended. Institutional traders don't use RSI; they use Volume and Liquidity."
      },
      howItWorks: {
        steps: [
          { title: "Tick Search", description: "We scan 1,200+ symbols every 10 seconds for volume anomalies." },
          { title: "Level Identification", description: "The engine maps out S/D zones where institutional activity is concentrated." },
          { title: "Sentiment Overlay", description: "Cross-reference price action with real-time institutional leaning (L/S data)." },
          { title: "Alert Generation", description: "Receive high-confluence alerts when technicals align across multiple timeframes." }
        ]
      },
      features: {
        title: "Power Tools",
        items: [
          { title: "Supply/Demand Heatmaps", description: "Visualise where the most liquidity is sitting on the books." },
          { title: "Volume Profile Spikes", description: "Identify the exact price where the most trading occurred today." },
          { title: "Cross-Asset Confluence", description: "See if Gold and the US Dollar are confirming your setup direction." },
          { title: "Session Delta", description: "Know if the 'aggressive' money is buying or selling right now." }
        ]
      },
      aiPowered: {
        title: "News Sentiment Correlation",
        content: "Our AI reads breaking headlines and categorises them as Bullish or Bearish. It then cross-references this with the price action. If the news is Bearish but the price is rising, it signals 'Exhaustion'—one of the most powerful institutional reversal plays."
      },
      whoItIsFor: {
        title: "The Alpha Seeker",
        content: "For traders who are tired of 'Retail Traps' and want to transition to a more structural, data-driven approach to finding trade setups."
      },
      peteTake: "Retail traders look for patterns; professionals look for liquidity. This scanner shows you the liquidity. That's the only edge that matters."
    },
    deepDive: {
      title: "Seeing Through the Noise",
      content: `
## Why Price is the Only Truth

In a world of information overload, the only thing that matters is where people are putting their money. That is what our Institutional Scanner tracks. We don't care about "Golden Crosses" or "Head and Shoulders" patterns. We care about **Supply, Demand, and Liquidity**.

### The Liquidity Map

Institutional orders are so large that they cannot be hidden. They leave a "footprint" in the volume profile. When a large bank wants to buy 10,000 lots of GBP, they can't do it at a single price. They have to "work" the order, creating zones of extreme activity.

Our scanner identifies these **Institutional Footprints**. Instead of guessing where support might be, you can see exactly where the market had the most trouble passing through in the past. These aren't just lines on a chart; these are zones of historical commitment.

### Cross-Asset Intelligence

No market exists in a vacuum. The FTSE 100 is influenced by the Pound, which is influenced by Gilts, which are influenced by the US Fed. If you are trading one in isolation, you are missing 80% of the picture.

The Drawdown Scanner provides **Multi-Asset Confluence**. We show you if the "Correlation Engine" is working. If the US Dollar is strengthening and Gold is weakening, the "Inverse Correlation" is holding. If they are both rising together, something has changed. Our scanner flags these anomalies immediately.

### Timeframe Confluence (The Rule of 3)

A setup on the 5-minute chart is irrelevant if the H4 and Daily charts are against it. The scanner automatically filters for **Timeframe Alignment**. We only show you setups where the "Big Money" (Daily) is moving in the same direction as the "Momentum" (M15). 

This drastically reduces your "False Breakout" rate. Most retail traders get trapped because they trade a breakout on a small timeframe that is actually just a 'stop run' for a larger timeframe reversal. This scanner prevents that.

### Trade the Reaction, Not the Guess

The scanner doesn't predict the future; it identifies the present. It tells you "The market is currently reacting at an institutional level". Your job is to wait for the confirmation. We provide the "Where", you provide the "When". 

By focusing on high-volume zones and multi-asset confluence, you move from being a "Pattern Matcher" to a "Context Analyst". You stop trading what you hope will happen and start trading what is actually happening.
      `
    }
  },
  {
    slug: "strategy-backtester",
    title: "Strategy Backtester",
    tagline: "Stress-test your edge to 2012.",
    description: "Manual backtesting is prone to bias. Our sub-tick engine runs systematic, emotionless simulations on decade-long data to prove your statistical expectancy.",
    icon: History,
    sections: {
      problem: {
        title: "The Illusion of Success",
        content: "Most traders 'backtest' by scrolling back on a chart and looking for their setup. This is heavily flawed because your brain already knows what happens next. You ignore the 'fake-outs' and only see the 'winners'. Systematic backtesting is the only way to prove a strategy actually works over a large enough sample size to be statistically significant."
      },
      howItWorks: {
        steps: [
          { title: "Define Logic", description: "Input your exact entry, exit, and risk parameters." },
          { title: "Select Data", description: "Choose your timeframe and historical range (up to 12 years of tick data)." },
          { title: "Run Simulation", description: "The engine executes thousands of trades in seconds, accounting for spread and slippage." },
          { title: "Review Report", description: "Get a full breakdown of your Sharpe ratio, max drawdown, and recovery factor." }
        ]
      },
      features: {
        title: "Simulation Suite",
        items: [
          { title: "Tick-Level Precision", description: "Simulate exact price movement within a candle to ensure accurate fills." },
          { title: "Monte Carlo Stress Testing", description: "Run 1,000s of 'what if' scenarios to see how your strategy handles random order sequencing." },
          { title: "Variable Spread Modeling", description: "Test your strategy against 'worst-case' liquidity conditions." },
          { title: "Walk-Forward Optimisation", description: "Aprove your strategy on 'out-of-sample' data to prevent curve-fitting." }
        ]
      },
      aiPowered: {
        title: "AI Parameter Tuning",
        content: "Our AI analyzes your backtest results and identifies 'leaks'. It might suggest that increasing your stop by 5 pips would have saved 20% of your losing trades without significantly affecting your reward-to-risk. It optimizes your strategy for stability, not just peak profit."
      },
      whoItIsFor: {
        title: "The Systematic Trader",
        content: "For traders who want to move away from 'gut feel' and towards a rule-based, data-verified approach. If you can't prove it worked in the past, you shouldn't trade it in the present."
      },
      peteTake: "Confidence doesn't come from 'belief'; it comes from data. When you've seen your strategy survive 2008 and 2020 in a backtest, you don't panic during a 3-trade losing streak. You just keep clicking."
    },
    deepDive: {
      title: "The Truth in the Data",
      content: `
## Stop Guessing, Start Verifying

The difference between a gambler and a professional is the **Certainty of Edge**. A gambler hopes the next trade works. A professional knows that over the next 1,000 trades, they will be profitable because they have the data to prove it.

The Drawdown Strategy Backtester is designed to be the "Truth Machine" for your trading plan.

### Eliminating Observer Bias

Human beings are wired to seek patterns that confirm their existing beliefs. This is called "Confirmation Bias". When you scroll back on TradingView, you subconsciously ignore the losing trades that 'almost' met your criteria and focus on the clean winners.

Our backtester removes the human. It executes your rules exactly as written. If your rule says "Buy at the break of the high", it buys every single one. No hesitation, no "this time looks different". This is the only way to find your *True* Win Rate.

### The Monte Carlo Reality Check

A backtest might show you a 60% win rate over 100 trades. But what if those 40 losses all happen at the same time? That is called a "Sequence of Returns" risk.

Multi-iteration **Monte Carlo simulations** take your trade results and shuffle them thousands of times. It shows you the probability of hitting a 10% drawdown or a 50% drawdown based on your data. This is how you determine your "Maximum Risk of Ruin". If your strategy has a 5% chance of blowing your account, you shouldn't trade it. We give you that number.

### Curve Fitting: The Silent Killer

The biggest trap in backtesting is "Optimising" your strategy so much that it perfectly fits the past but fails in the future. This is called **Curve Fitting**. 

We prevent this through **Walk-Forward Analysis**. We test your strategy on one period of data, then "validate" those settings on a completely different period that the engine hasn't seen yet. If the strategy only works in 2021 but fails in 2022, it's not an edge—it's just a coincidence.

### Survivorship Bias & Slippage

Most retail backtesters ignore the cost of doing business. They assume you get filled at the exact price on the screen. In reality, you pay spread, and you experience slippage during high volatility.

Our engine models **Variable Transaction Costs**. We simulate the widening of spreads during news events and the delay in execution during low-liquidity periods. We show you your *Net Profit*, not just your Gross Profit. Because you can't pay your bills with Gross Profit.
      `
    }
  },
  {
    slug: "market-charts",
    title: "Technical Charts",
    tagline: "High-performance data visualisations.",
    description: "Optimised for speed and clarity. Built-in Drawdown proprietary indicators designed to highlight institutional levels and flow delta.",
    icon: LineChart,
    sections: {
      problem: {
        title: "Visual Overload",
        content: "Standard retail platforms are cluttered with useless indicators and 'lagging noise'. This leads to 'Analysis Paralysis'. When you have 10 different indicators telling you 10 different things, you end up doing nothing—or worse, doing the wrong thing at the wrong time."
      },
      howItWorks: {
        steps: [
          { title: "Clean Feed", description: "Direct data line from institutional providers (Twelvedata/Finnhub)." },
          { title: "Apply Engine", description: "Custom drawing tools and range-based candle logic pre-installed." },
          { title: "Overlay Intel", description: "One-click access to technical consensus and volume profile data." },
          { title: "Sync Everywhere", description: "Your drawings and alerts stay synced across mobile and desktop." }
        ]
      },
      features: {
        title: "Display Suite",
        items: [
          { title: "Proprietary Flow Indicators", description: "Visualise the delta between aggressive buying and selling pressure." },
          { title: "Institutional S/D Zones", description: "Auto-mapping of zones where price has historically reacted on high volume." },
          { title: "Multi-Pane Sync", description: "Analyse 4 timeframes at once with a single crosshair sync." },
          { title: "No-Lag Execution", description: "Optimised canvas rendering for zero-latency during fast market moves." }
        ]
      },
      aiPowered: {
        title: "Pattern Recognition AI",
        content: "Our AI constantly scans the background for 'High Confluence' setups. It identifies 'SMC' structures (Smart Money Concepts) like Fair Value Gaps and Order Blocks in real-time, highlighting them on your chart so you can focus on the trade, not the drawing."
      },
      whoItIsFor: {
        title: "The Visual Analyst",
        content: "For traders who want a clean, professional, and fast charting environment that prioritises price action over lagging indicators."
      },
      peteTake: "You don't need a Christmas tree on your screen. You need to see price. Our charts are designed to make the obvious setups actually look obvious."
    },
    deepDive: {
      title: "Clarity is Power",
      content: `
## Why Your Charts are Lying to You

Most retail platforms make money by keeping you engaged, not by making you profitable. They over-complicate the visual experience with hundreds of indicators that ultimately lead to confusion. 

The Drawdown Technical Charts are built on the philosophy of **Subtractive Analysis**. We remove everything that doesn't provide a direct edge, leaving you with a clean, high-performance canvas to track the only thing that matters: Price.

### The Physics of Price Action

Price doesn't move randomly. It moves between zones of high liquidity. Our charts are built with **Volume Profile and Market Profile** integration at the core. You don't just see where price went; you see where the most value was exchanged.

This allows you to identify the "Point of Control" (POC)—the price at which institutional participants were most active. Trading away from or towards the POC is the basis of almost all institutional execution. Mapping this visually is the key to understanding market regime.

### Eliminating Latency

In the time it takes for a standard retail platform to refresh its candle, a professional desk has already executed three trades. **Latency kills edge.**

Our charting engine is built on a custom WebGL canvas that renders thousands of data points in milliseconds. Whether you are on a 1-minute chart or a Daily chart, the responsiveness is identical. When price is moving fast during NFP or a BoE rate decision, you need a chart that can keep up.

### Proprietary Range Logic

Time is a human construct; the market doesn't care about "The 1PM Candle". It cares about the **Range of Price**. 

In addition to standard time-based candles, we offer **Range Charts and Renko Charts**. These filters out the "noise" of time, only printing a new bar when price has actually moved a specific distance. This makes trending vs. ranging markets immediately obvious to the naked eye. It forces you to stop trading when the market is "sideways" and only engage when there is actual momentum.

### The Multi-Timeframe Matrix

Professionals never look at a single chart. They look at the "Matrix". Our platform allows for **Seamless Multi-Pane Visualisation**. You can sync your drawings across the Monthly, Weekly, and Daily timeframes. 

When you draw a level on the Daily, it appears on the 15-minute chart automatically. This ensures that you never "Lose the Big Picture" when you are zoomed in for an entry. Alignment is the secret to high-probability trading.
      `
    }
  },
  {
    slug: "intelligence-hub",
    title: "Expert Intelligence Hub",
    tagline: "Information is liquidity.",
    description: "Direct access to the same market intel that Pete uses to trade. High-impact macro data, institutional bias, and technical zones delivered daily.",
    icon: Mail,
    sections: {
      problem: {
        title: "The Information Vacuum",
        content: "Most retail traders wake up, look at a chart, and start clicking. They have no idea what the 'Narrative' of the day is. They get blindsided by central bank speakers, economic releases, or shifts in global risk sentiment. Trading technicals without macro context is like driving a car without a steering wheel."
      },
      howItWorks: {
        steps: [
          { title: "Global Monitor", description: "Our team and AI monitor 50+ market data feeds 24/7." },
          { title: "Intel Synthesis", description: "We simplify the complex macro landscape into 3 'Key Themes' for the day." },
          { title: "Zone Mapping", description: "We identify the 3 highest-probability zones for GBP, EUR, and US Equities." },
          { title: "Direct Delivery", description: "Get the intelligence report 30 mins before the London or NY open." }
        ]
      },
      features: {
        title: "Intelligence Suite",
        items: [
          { title: "Daily Bias Report", description: "A clear 'Hawkish' or 'Dovish' leaning for major currencies." },
          { title: "Institutional Level Map", description: "Exact price points where we expect large orders to be sitting." },
          { title: "Sentiment Heatmap", description: "Know if the market is in 'Risk-On' or 'Risk-Off' mode immediately." },
          { title: "Macro Calendar Filter", description: "We highlight the ONLY events that actually matter for your session." }
        ]
      },
      aiPowered: {
        title: "AI Narrative Aggregator",
        content: "Our AI processes thousands of news stories and social sentiment signals to identify the 'Emerging Narrative'. It detects shifts in market focus—for example, when the market stops caring about Inflation and starts caring about Growth—allowing you to pivot your bias before the herd."
      },
      whoItIsFor: {
        title: "The Decision Maker",
        content: "For traders who value their time and want a professional 'Pre-Flight Briefing' before they risk their capital. Essential for part-time traders who need to get up to speed fast."
      },
      peteTake: "I don't start my day without checking the macro landscape. If you don't know who is in control of the narrative, you are the exit liquidity for those who do."
    },
    deepDive: {
      title: "The Power of Context",
      content: `
## Stop Chasing, Start Anticipating

Trading is an information game. The person with the best data and the fastest synthesis of that data wins. The Institutional Intelligence Hub is designed to give you the "Early Warning" signals that standard news outlets miss.

### The Macro Narrative

Price moves based on **Differentials**. Interest rate differentials, growth differentials, and inflation differentials. This is the "Engine" of the market. Our Intelligence Hub explains this engine in plain English.

We don't just tell you that "Inflation is up"; we tell you how the Bank of England is likely to react and what that means for the Pound over the next 48 hours. We provide the "Script" for the session, allowing you to anticipate moves rather than just reacting to spikes.

### The Level of Commitment

Institutions don't trade "Random Support/Resistance". They trade **Structural Levels**. These are prices determined by option expirations, central bank intervention zones, and heavy volume nodes. 

In every daily briefing, we provide the **Top 3 Levels** for the day. These aren't guesses; these are mathematically derived points of interest where the probability of a reaction is highest. If price hits Level A and the Sentiment is Risk-Off, we know exactly what our plan is. This is how you eliminate hesitation.

### Sentiment as an Edge

Market sentiment is the "Mood" of the market. When the market is "Risk-On", equities and high-beta currencies rise. When it is "Risk-Off", the Dollar and Gold rise.

Most traders get caught on the wrong side of the trend because they are trying to buy a pullback in a "Risk-Off" regime. Our **Sentiment Heatmap** prevents this. It acts as a "Red Light / Green Light" system for your strategy. If your system says Buy, but the Sentiment is Red, you stand aside. This one rule alone can increase your win rate by 15-20%.

### Session Specific Intelligence

The London Open is a different beast to the New York Overlap. The players are different, the liquidity is different, and the objectives are different.

We provide **Session-Specific Briefings**. We tell you what the "Theme" is for the specifically upcoming session. We identify the specific news "Spoilers" that could invalidate your technical setups, giving you the confidence to either aggressive execute or safely sit on your hands. Knowledge is the only true protection against market volatility.
      `
    }
  },
  {
    slug: "algo-strategy-builder",
    title: "Algo Strategy Builder",
    tagline: "Convert discretionary trading logic into production Python & Pine Script.",
    description: "Most traders fail to codify their edge. Describe your strategy in plain language, and our engine outputs optimized, institutional-grade Python and Pine Script code.",
    icon: Terminal,
    sections: {
      peteTake: "Discretionary trading is full of lies you tell yourself. Systematic trading is just math and code. This tool lets you bridge the gap and write the code without spending years learning syntax.",
      problem: {
        title: "The Code Bottleneck",
        content: "If you cannot backtest your strategy over 10 years of tick data, you do not have an edge—you have a wish list. But writing clean Python code using Pandas and NumPy, checking for look-ahead bias, and integrating complex broker APIs is a monumental barrier to entry. Discretionary traders get stuck backtesting manually, introducing hindsight bias and fatigue."
      },
      howItWorks: {
        steps: [
          {
            title: "Describe Your Strategy",
            description: "Provide your entry, exit, and risk rules in natural English (e.g. 'Enter long when 20-period EMA crosses above 50-period SMA, and RSI is oversold under 30')."
          },
          {
            title: "AI Translation",
            description: "Our professional-grade AI translates your natural language into optimized, bug-free Pine Script (v5) or Python."
          },
          {
            title: "Eliminate Hindsight Bias",
            description: "The builder automatically structures scripts to prevent look-ahead bias and double-trigger execution bugs, checking for statistical validity."
          },
          {
            title: "Export & Live Trade",
            description: "Download the complete python scripts or Pine codes. Connect directly to Interactive Brokers, MT5, or cTrader via our secure API bridge."
          }
        ]
      },
      features: {
        title: "Quantitative Engine Specifications",
        items: [
          {
            title: "Pandas & NumPy Vectorization",
            description: "High-performance data frames and multi-dimensional matrices for sub-millisecond calculation of technical indicators."
          },
          {
            title: "Moving Average & Oscillator Libraries",
            description: "Pre-integrated formulas for Simple Moving Average (SMA), Exponential Moving Average (EMA), Relative Strength Index (RSI), and volatility models."
          },
          {
            title: "Backtrader & PyAlgoTrade Ready",
            description: "Clean script structures ready for direct integration with popular Python backtesting libraries."
          },
          {
            title: "Dynamic Risk Modules",
            description: "Automatic integration of Kelly Criterion fraction sizing, Volatility-adjusted lot sizing, and ATR trailing stops."
          }
        ]
      },
      whoItIsFor: {
        title: "Built for Aspiring Systematic Quants",
        content: "Whether you want to automate a basic SMA crossover, stress-test an RSI-based mean reversion system, or generate Python execution code to trade through Interactive Brokers, this is your translation bridge."
      },
      aiPowered: {
        title: "QuantCoder LLM v3.5",
        content: "Our custom model trained on millions of lines of optimized Pine Script v5, Backtrader Python scripts, and API wrappers, adhering to institutional coding standards."
      }
    },
    deepDive: {
      title: "The Architecture of Algorithmic Python & Pine Script",
      content: `
## Coding the Edge: Python vs. Human Emotion

Discretionary trading fails because humans are biological organisms subject to fear, greed, and sleep deprivation. An algorithm executes trades with millisecond precision, ensuring 100% mathematical consistency. By translating your logic into code, you stop trading the chart and start trading the numbers.

### 1. Vectorized Data Processing with Pandas & NumPy

At the core of any Python-based quantitative strategy is the manipulation of time-series data. Using loops in Python is too slow for large historical datasets. We utilize **vectorized computations** through the Pandas library:

\`\`\`python
import pandas as pd
import numpy as np

# Vectorized Simple Moving Average (SMA) calculation
data['SMA_20'] = data['Adj Close'].rolling(window=20).mean()
data['SMA_50'] = data['Adj Close'].rolling(window=50).mean()

# Exponential Moving Average (EMA)
data['EMA_20'] = data['Adj Close'].ewm(span=20, adjust=False).mean()
\`\`\`

By vectorizing these calculations, you process 10 years of daily data in milliseconds, allowing rapid strategy iterations.

### 2. Formulating Signals: Moving Average Crossovers & RSI

The Algo Strategy Builder allows you to easily generate execution triggers. Here is the mathematical logic generated for a classic trend-following and momentum filter strategy:

\`\`\`python
# Generate Buy (1) and Sell (0) signals based on SMA Crossover
data['Signal'] = 0
data['Signal'][20:] = np.where(data['SMA_20'][20:] > data['SMA_50'][20:], 1, 0)
data['Position'] = data['Signal'].diff()
\`\`\`

For mean reversion strategies, we integrate Relative Strength Index (RSI) calculation models to target oversold and overbought conditions:

\`\`\`python
def calculate_rsi(data, window=14):
    delta = data['Adj Close'].diff(1)
    gain = (delta.where(delta > 0, 0)).rolling(window=window).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=window).mean()
    rs = gain / loss
    return 100 - (100 / (1 + rs))

data['RSI_14'] = calculate_rsi(data, 14)
\`\`\`

### 3. Evaluating Performance: Cumulative Returns & Volatility

Backtesting is meaningless without rigorous metrics. Our Python exports automatically compute the core statistics required to analyze risk:

* **Cumulative Returns**: \\((P_{final} - P_{initial}) / P_{initial}\\) to evaluate absolute profitability.
* **Sharpe Ratio**: Risk-adjusted performance relative to volatility.
* **Volatility (Standard Deviation of Daily Returns)**: Measuring the stability of the equity curve.

\`\`\`python
# Portfolio calculation snippet
initial_capital = 100000.0
data['Holdings'] = data['Adj Close'] * data['Position'].cumsum()
data['Cash'] = initial_capital - (data['Adj Close'] * data['Position']).cumsum()
data['Total'] = data['Cash'] + data['Holdings']
data['Returns'] = data['Total'].pct_change()

cumulative_return = (data['Total'].iloc[-1] - initial_capital) / initial_capital
volatility = data['Returns'].std()
\`\`\`

This systematic framework is what separates hobbyist retail traders from data-driven portfolio managers. Use the Algo Strategy Builder to write clean code, export it, and start executing with statistical backing.
      `
    }
  },
  {
    slug: "challenge-simulator",
    title: "Challenge Simulator",
    tagline: "Stress-test your data against prop firm rules.",
    description: "Don't guess if you can pass a challenge. Prove it by replaying your actual trading data against the exact rules of FTMO, Topstep, and more.",
    icon: Cpu,
    sections: {
      problem: {
        title: "The Breach Trap",
        content: "Most traders fail prop firm challenges not because of their strategy, but because they don't understand the nuance of the rules. Trailing drawdowns, daily loss limits based on equity, and minimum trading days are all designed to catch you out. Guessing your risk exposure is a recipe for a failed fee."
      },
      howItWorks: {
        steps: [
          { title: "Select Firm", description: "Choose from our database of 20+ prop firms with real-time updated rules." },
          { title: "Ingest Trades", description: "Upload your CSV or sync your account via API." },
          { title: "Run Replay", description: "Our engine replays every trade, second-by-second, to check for rule breaches." },
          { title: "AI Analysis", description: "Get a breakdown of exactly why you failed or how close you came to breaching." }
        ]
      },
      features: {
        title: "Simulation Suite",
        items: [
          { title: "Exact Rule Mapping", description: "From static to trailing intraday drawdowns, we model every detail." },
          { title: "Risk Exposure Score", description: "A proprietary 1-100 score on how likely you are to breach under pressure." },
          { title: "Profit Target Projection", description: "See the probability of hitting the target before the time limit expires." },
          { title: "Equity Curve Stress Test", description: "Visualise your worst-case drawdown scenarios." }
        ]
      },
      aiPowered: {
        title: "The Breaker Engine",
        content: "Our AI identifies 'Breach Clusters'—times of day or specific instruments where you are most likely to violate prop firm rules. It then generates a 30-day preparation plan to fix these specific leaks."
      },
      whoItIsFor: {
        title: "The Funded Trader",
        content: "Essential for anyone planning to take a $50k+ challenge. It's cheaper to fail a simulation than to fail a real evaluation."
      },
      peteTake: "I've reviewed thousands of accounts. Most traders don't have a strategy problem; they have a data problem. They are blind to their own failures. The AI Journal is the mirror that doesn't lie."
    },
    deepDive: {
      title: "Mastering the Evaluation",
      content: `
## The Mathematics of the Challenge

Prop firms are in the business of risk management. Their rules are designed to find traders who can manage capital, not just make profit. Most retail traders approach a challenge like a gamble. Professional traders approach it as a mathematical hurdle.

### Understanding Drawdown Types

Not all drawdowns are created equal. This is the #1 reason for failure:
* **Static Drawdown:** Based on your starting balance. The easiest to manage.
* **Trailing EOD Drawdown:** The floor moves up at the end of the day if your balance increased.
* **Trailing Intraday Drawdown:** The most dangerous. The floor moves up in real-time as your equity peaks.

Our simulator replays your trades against ALL of these types simultaneously, so you can see which firm's rules actually suit your trading style.

### The Buffer Strategy

To pass a challenge, you need a 'Buffer'. This is the space between your current balance and the breach point. Our AI calculates your 'Buffer Decay'—how fast you are consuming your allowed risk relative to your profit progress. If your decay is too high, you will breach before you hit the target.

### Preparing for the Funded Life

Passing the challenge is just the beginning. Staying funded is the real goal. Use this simulator to find your 'Sustainable Risk' level. Once you know you can pass a simulation 10 times in a row, the real challenge becomes a formality.
      `
    }
  },
  {
    slug: "ai-coach",
    title: "AI Psychology Coach",
    tagline: "Fix the brain, fix the P&L.",
    description: "The market is a psychological battleground. Our AI coach identifies your emotional triggers and behavioral biases in real-time.",
    icon: Brain,
    sections: {
      problem: {
        title: "The 12-Inch Gap",
        content: "You can have the best strategy in the world, but if you 'tilt' after a loss, move your stops, or revenge trade, the strategy is irrelevant. Most traders fail because of their own biology. High cortisol leads to poor decision-making, and without a third-party audit, you'll keep making the same mistakes."
      },
      howItWorks: {
        steps: [
          { title: "Behavioral Sync", description: "Connect your trade journal or log your session state." },
          { title: "Pattern Detection", description: "AI identifies revenge trading, overtrading, and inconsistent sizing." },
          { title: "Real-time Alerts", description: "Receive warnings when your behavior matches your 'Tilt Profile'." },
          { title: "Weekly Audit", description: "A full psychology report with a grade (A-F) and actionable fixes." }
        ]
      },
      features: {
        title: "Coach Mechanics",
        items: [
          { title: "Tilt Detection", description: "Spot the early signs of emotional trading before you click." },
          { title: "Discipline Scoring", description: "Gamify your process adherence, not just your profit." },
          { title: "Session Protocols", description: "Guided pre-trade and post-trade checklists to regulate your state." },
          { title: "Bias Identification", description: "Are you a victim of FOMO, Recency Bias, or Loss Aversion?" }
        ]
      },
      aiPowered: {
        title: "The Neural Mentor",
        content: "Using Claude 3.5, the coach acts as a seasoned institutional mentor. It doesn't just see the numbers; it sees the *intent* behind the trades. It provides direct, sometimes harsh, feedback to force the discipline required for professional trading."
      },
      whoItIsFor: {
        title: "The Developing Professional",
        content: "For traders who are profitable on paper but struggle with consistency and execution under pressure."
      },
      peteTake: "I've blown accounts because I thought I was 'smarter' than the market. I wasn't. I was just emotional. This coach is the mentor I wish I had 10 years ago."
    },
    deepDive: {
      title: "The Psychology of Performance",
      content: `
## Trading is 90% Mental

If you've ever closed a winner too early or let a loser run too long, you've experienced the 'Psychological Drawdown'. This is the gap between what you *know* you should do and what you *actually* do.

### The Biological Reality

When you are in a trade, your brain's amygdala—the 'fear center'—is hyper-active. This shifts your thinking from the rational pre-frontal cortex to the primal 'fight or flight' response. In this state, your ability to process risk is compromised.

Our AI coach monitors your execution quality and frequency to detect this shift. If you start clicking too fast after a loss, that's your amygdala talking. We flag it, and we force a 'Cool Down' period.

### Gamifying Discipline

Most traders focus on the 'Win'. We focus on the 'Process'. 

Our **Discipline Score** rewards you for following your rules, regardless of the outcome. A 'Perfect Loss' (followed all rules) is scored higher than a 'Lucky Win' (broke rules but made money). By shifting your dopamine reward from 'Money' to 'Discipline', we help you build the neural pathways of a professional.

### The Power of the Audit

Every Sunday, the coach generates a **Discipline Report**. It's a mirror. It shows you exactly which days you were a professional and which days you were a gambler. Over time, seeing these patterns is the only way to permanently fix them. You cannot fix what you do not measure.
      `
    }
  }
];
