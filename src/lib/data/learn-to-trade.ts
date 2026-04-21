export interface LearnTopic {
  slug: string;
  title: string;
  description: string;
  category: string;
  heroImage: string;
  content: {
    heading: string;
    text: string;
    bullets?: string[];
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  metaTitle: string;
  metaDescription: string;
}

export const LEARN_TOPICS: LearnTopic[] = [
  {
    slug: "day-trading",
    title: "Day Trading",
    description: "The complete guide to institutional-grade day trading in the UK. Learn how to navigate the markets with discipline, not just indicators.",
    category: "Strategy",
    heroImage: "/images/learn/day-trading.jpg",
    metaTitle: "Day Trading Guide UK | Institutional Strategy & Discipline | Drawdown",
    metaDescription: "Master day trading with our comprehensive guide. From London session dynamics to risk-reward ratios, learn how to trade like a professional in the UK.",
    content: [
      {
        heading: "What Day Trading Really Is",
        text: "Day trading is the practice of buying and selling financial instruments within the same trading day. All positions are closed before the market shuts. While social media often portrays it as a way to get rich quick, the reality is that it's a high-performance profession that requires extreme discipline, a proven edge, and professional-grade risk management. In the UK, day trading typically centers around major currency pairs (GBPUSD, EURGBP), UK indices like the FTSE 100, and US markets during the 'overlap' session."
      },
      {
        heading: "The London Session Dynamics",
        text: "For UK traders, the London Open (8:00 AM GMT) is the most critical time of the day. This is when massive institutional volume enters the market, creating the volatility necessary for day trading. We focus on the 'London Breakout' and the 'Morning Trend' as primary intraday setups. Understanding liquidity cycles is far more important than any RSI or MACD crossover. You are trading against some of the smartest algorithms in the world — your only edge is understanding where the big money is moving and following the 'path of least resistance'."
      },
      {
        heading: "Essential Tools for the Day Trader",
        text: "You don't need a Bloomberg terminal to start, but you do need professional tools. At Drawdown, we advocate for TradingView as the industry standard for charting. For execution, focus on brokers with direct market access (DMA) or ultra-low latency ECN execution. In the UK, spread betting is often the preferred vehicle due to its tax-free status, but you must ensure your broker has deep liquidity and honest pricing. Beyond charts, a reliable economic calendar and a low-latency news feed are non-negotiable."
      },
      {
        heading: "The 'No-Hype' Strategy: Price Action and Volume",
        text: "Most beginners clutter their charts with too many indicators. At Drawdown, we strip it back to basics: Price, Volume, and Level. We teach you how to identify 'Institutional Footprints' — areas where big banks are accumulating or distributing positions. The goal is to enter on a high-probability retest after a breakout, with a stop loss positioned where the trade idea is invalidated. If you can't explain why a trade is valid in two sentences, it's not a trade; it's a gamble."
      },
      {
        heading: "The Psychology of Intraday Fatigue",
        text: "Day trading is mentally exhausting. Decision fatigue is a real threat to your capital. This is why we advocate for 'Session Trading' — pick a 2-3 hour window (like the London/NY overlap) and trade ONLY during that time. Sitting in front of the charts for 12 hours a day will only lead to revenge trading and poor decision making. A professional knows when to step away. If your plan says walk away after two wins or one loss, you walk away. No exceptions."
      },
      {
        heading: "Risk Management: The Survivor's Edge",
        text: "Day trading is a game of probability. You will lose trades. Anyone telling you otherwise is selling something. Your job isn't to avoid losses; it's to ensure no single loss ruins you. We advocate for risking no more than 0.5% to 1% of your account per trade. This allows you to survive a 'losing streak' without losing your mental capital. The math of drawdown is unforgiving — losing 50% of your account requires a 100% gain just to break even. Protect your downside, and the upside takes care of itself."
      }
    ],
    faqs: [
      {
        question: "How much money do I need to start day trading in the UK?",
        answer: "While some brokers allow £100 accounts, we recommend at least £1,000 to allow for proper risk management. With £1,000, risking 1% is £10. On some pairs, this is the minimum position size allowed by spread betting brokers."
      },
      {
        question: "Is day trading taxable in the UK?",
        answer: "If you use spread betting, profits are currently exempt from Capital Gains Tax and Stamp Duty in the UK. However, if you trade CFDs or direct stocks, you are liable for CGT. Always consult a tax professional."
      }
    ]
  },
  {
    slug: "forex-trading",
    title: "Forex Trading",
    description: "Navigate the world's most liquid market. From pip calculations to central bank policy, master the mechanics of FX.",
    category: "Market",
    heroImage: "/images/learn/forex-trading.jpg",
    metaTitle: "Forex Trading Guide | Master FX Market Mechanics | Drawdown",
    metaDescription: "Learn Forex trading properly. Understand currency pairs, pips, leverage, and the impact of central bank policies on the global FX market.",
    content: [
      {
        heading: "Understanding the Global FX Machine",
        text: "The Foreign Exchange (Forex) market is the largest financial market in the world, with over $6 trillion traded daily. Unlike the stock market, Forex has no central exchange. It's a decentralized global network of banks, hedge funds, and retail traders. You are essentially betting on the relative strength of one country's economy against another. In the FX world, you always trade in pairs (e.g., GBP/USD). You are buying the base currency and selling the quote currency simultaneously."
      },
      {
        heading: "The Mechanics: Pips, Lots, and Leverage",
        text: "In Forex, price movements are measured in 'pips' (Percentage in Point). For most pairs, this is the fourth decimal place. A 'pipette' is the fifth decimal place. To make meaningful money from these tiny moves, traders use 'lots' (Standard, Mini, or Micro) and 'leverage'. Leverage allows you to control a large position with a small amount of capital. While it magnifies profits, it equally magnifies losses. In the UK, FCA regulations cap leverage for retail traders at 1:30 for major pairs to prevent catastrophic losses."
      },
      {
        heading: "Fundamental Analysis: The Central Bank Pulse",
        text: "Forex is driven by the 'Big Picture'. Interest rates are the primary driver of currency value. When the Bank of England raises rates, the pound typically becomes more attractive to global investors, increasing demand. We teach you how to read economic indicators like CPI (Inflation), GDP (Growth), and NFP (US Employment) to understand where the 'fundamental trend' is heading. If the fundamentals are bullish and the technicals are bullish, that's where the institutional-grade edge lies."
      },
      {
        heading: "Technical Analysis: Mapping the Levels",
        text: "While fundamentals tell you 'what', technicals tell you 'when'. We focus on market structure — identifying highs and lows to determine if a market is trending or ranging. We emphasize the importance of 'Supply and Demand Zones' rather than just support and resistance lines. These are the specific areas where massive sell or buy orders were previously sitting. When price returns to these zones, it often reacts predictably. Mastering 'Price Action' means learning to read the chart like a map, not a crystal ball."
      },
      {
        heading: "The Importance of Currency Correlation",
        text: "Many beginners make the mistake of trading multiple pairs that move in the same direction. For example, GBPUSD and EURUSD are highly correlated. If you buy both, you are effectively doubling your risk on the US Dollar. A professional trader understands these relationships. We teach you how to use correlation matrices to ensure you aren't over-exposed to a single currency without realizing it. Diversification in FX is about trading uncorrelated assets, not just more pairs."
      }
    ],
    faqs: [
      {
        question: "What is the best time to trade Forex in the UK?",
        answer: "The best time is during the London-New York overlap (1:00 PM to 4:00 PM GMT). This is when liquidity is highest and spreads are narrowest. The London open (8:00 AM GMT) is also excellent for volatility."
      },
      {
        question: "Can I trade Forex on a part-time basis?",
        answer: "Yes. Many successful traders use 'Swing Trading' strategies on the daily or 4-hour charts, which only require 30 minutes of analysis per day. You don't need to be glued to the screen 24/5."
      }
    ]
  },
  {
    slug: "risk-management",
    title: "Risk Management",
    description: "The boring part that keeps you in the game. Learn the mathematics of survival and why protecting your capital is your #1 job.",
    category: "Foundation",
    heroImage: "/images/learn/risk-management.jpg",
    metaTitle: "Trading Risk Management | The Mathematics of Survival | Drawdown",
    metaDescription: "Master the most important skill in trading: Risk Management. Learn about position sizing, drawdown, R-multiples, and the psychology of losing safely.",
    content: [
      {
        heading: "The Business of Trading: Managing Overhead",
        text: "Think of trading like any other business. Your losses are your 'overhead' or your 'rent'. A business that can't manage its overhead will eventually go bust. In trading, 'risk management' is the process of ensuring that no single loss — or even a string of losses — puts you out of business. Most traders focus 90% of their time on finding the perfect entry, but it's the 10% of time spent on risk management that actually determines if they will be profitable in a year's time."
      },
      {
        heading: "The Golden Rule: The 1% Risk Model",
        text: "We advocate for the 'Fixed Fractional' risk model. This means never risking more than 1% of your current account balance on any single trade. If you have £10,000, you risk £100. If you lose, your next trade's risk is based on £9,900. This automatically scales down your risk during a losing streak and scales it up during a winning streak. It is the most robust way to protect your capital. Beginners often confuse 'risk' with 'position size'. Your risk is the distance between your entry and your stop loss, multiplied by your position size."
      },
      {
        heading: "Understanding the Mathematics of Drawdown",
        text: "Drawdown is the peak-to-trough decline in your account balance. It is inevitable. The problem is that the math of recovery is non-linear. If you lose 10%, you need an 11% gain to get back to even. If you lose 25%, you need a 33% gain. If you lose 50%, you need a 100% gain. This is why preserving your capital is so critical. The deeper you go into drawdown, the harder it is to climb out. Professional traders are risk-averse; they only click the button when the potential reward significantly outweighs the risk."
      },
      {
        heading: "The R-Multiple: Measuring Your Edge",
        text: "Profit is a vanity metric. What matters is your 'R-Multiple'. If you risk £100 to make £300, that is a 3R trade. If you have a strategy with a 40% win rate and an average 3R winner, you are a profitable trader. You can lose 60% of your time and still build wealth. Most beginners struggle because they take '1R' or '0.5R' winners but let their losers hit '2R' or '3R'. This inverse risk-reward is a mathematical death sentence. You must aim for a positive expectancy over a large sample size of trades."
      },
      {
        heading: "The Psychology of a Stop Loss",
        text: "A stop loss is not a failure. It is a data point. It tells you that your current trade idea was wrong, and it prevents a 'wrong idea' from becoming a 'catastrophic financial event'. Moving your stop loss into wider territory is the ultimate sin in trading — it's emotional denial. A professional trader accepts the loss immediately and moves on to the next opportunity. Discipline isn't about being right; it's about following your risk rules even when it hurts your ego."
      }
    ],
    faqs: [
      {
        question: "Should I always use a hard stop loss?",
        answer: "Yes. Always. A 'mental stop' is an invitation for your ego to negotiate. In volatile markets or during news events, price can move hundreds of pips in seconds. A hard stop loss is your only insurance against a total account wipeout."
      },
      {
        question: "How do I calculate my position size?",
        answer: "Use the formula: Position Size = (Account Balance * Risk %) / (Stop Loss Distance in Pips * Value per Pip). Or use a dedicated position size calculator tool to do the math for you before every entry."
      }
    ]
  },
  {
    slug: "trading-psychology",
    title: "Trading Psychology",
    description: "The battle between your ears. Learn how to conquer fear, greed, and the biological impulses that sabotage your P&L.",
    category: "Mindset",
    heroImage: "/images/learn/trading-psychology.jpg",
    metaTitle: "Trading Psychology Guide | Conquering Fear & Greed | Drawdown",
    metaDescription: "Master your mindset. Understand the cognitive biases that ruin traders and learn how to develop the institutional discipline required for consistent profitability.",
    content: [
      {
        heading: "Your Brain: The Trading Saboteur",
        text: "The human brain evolved to survive on the savannah, not to trade digital numbers on a screen. Our biological impulses — fear and greed — were life-saving millions of years ago, but in the markets, they are lethal. Fear makes us cut winners early to 'protect' profit. Greed makes us hold losers too long hoping for a 'recovery'. To become a professional trader, you must learn to override your biology. You aren't just fighting the market; you are fighting your own amygdala."
      },
      {
        heading: "The Trap of Social Proof",
        text: "We are social creatures. We want to be part of the 'crowd'. When everyone on social media is buying Bitcoin, your brain screams at you to join in. This is 'FOMO' (Fear of Missing Out). However, the market is a zero-sum game. If everyone is already buying, the buying power is exhausted and a reversal is usually imminent. Professional traders are often contrarians — they have the psychological strength to stand alone when the data contradicts the crowd."
      },
      {
        heading: "Recency Bias: The Memory Myth",
        text: "Our brains overemphasize recent events. If your last three trades were losers, you will feel 'fearful' on the fourth trade, even if the setup is perfect. If your last three were winners, you will feel 'overconfident' and might increase your risk. This is a cognitive bias. Each trade is an independent event with a unique outcome. A professional views their performance in blocks of 20 or 50 trades, never letting the outcome of the 'last one' influence the 'next one'."
      },
      {
        heading: "Developing Institutional Discipline",
        text: "Discipline is the bridge between a strategy and a profit. A strategy is just words on a page until it's executed with 100% consistency. We teach you how to build a 'Trading Routine' — a set of non-negotiable rules that remove the need for 'choice' and 'emotion' during market hours. The goal is to reach a state of 'Unconscious Competence' where following your plan becomes as automatic as breathing. If you can't follow your rules, the best strategy in the world won't save you."
      },
      {
        heading: "The Concept of Probabilistic Thinking",
        text: "Most beginners think in 'Certainty'. They want to know 'will this trade work?'. The professional thinks in 'Probability'. They know that over 100 trades, their strategy will win 45 times and lose 55 times, and they will make money. They don't care about the outcome of a single trade because they believe in their 'Edge'. This shift from 'Certainty' to 'Probability' is the single most important psychological breakthrough a trader can make. It removes the stress of being 'wrong'."
      }
    ],
    faqs: [
      {
        question: "How do I deal with a long losing streak?",
        answer: "Lower your risk to 0.25%, take a break from the screens for 24 hours, and review your journal. Ensure you are actually following your rules. If you are, then the losing streak is just a statistical probability playing out. Don't change your strategy because of a week of bad luck."
      },
      {
        question: "Why do I feel so much stress when I have a trade open?",
        answer: "Usually, it's because your position size is too large. If you are stressed, you are risking too much money. Lower your risk until you can watch price move against you without feeling a physical reaction. Trading should be boring, not an adrenaline rush."
      }
    ]
  }
];
