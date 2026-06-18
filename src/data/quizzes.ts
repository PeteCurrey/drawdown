import { QuizQuestion } from "@/components/quiz/QuizEngine";

export const quizData: Record<string, QuizQuestion[]> = {
  "ground-zero/module-1": [
    {
      id: "gz-1-1",
      question: "What percentage of retail traders lose money according to ESMA/FCA broker disclosures?",
      options: ["50-60%", "74-80%", "90-95%", "30-40%"],
      correctIndex: 1,
      explanation: "Under ESMA rules, major UK and European brokers disclose that 74-80% of retail accounts lose money. The actual long-term failure rate rises to 90% when accounting for account closures.",
    },
    {
      id: "gz-1-2",
      question: "Which of the following is NOT one of the four predictable behaviors of failure?",
      options: [
        "Undercapitalisation and over-leveraging",
        "Trading based on feeling without statistical edge",
        "Setting stop losses based on technical market structure",
        "Psychological collapses like revenge trading"
      ],
      correctIndex: 2,
      explanation: "Setting stop losses based on technical market structure is a best practice. The failure behavior is setting stops based on 'what I can afford to lose' or having no stop loss at all.",
    },
    {
      id: "gz-1-3",
      question: "What is the key mindset shift required regarding individual trades?",
      options: [
        "The market acts with personal intent against retail accounts",
        "The market is the aggregate of human decisions and does not care about your personal goals",
        "You should treat each trade as a make-or-break career moment",
        "Always expect to win every trade if your analysis is correct"
      ],
      correctIndex: 1,
      explanation: "Understanding that the market is simply the aggregate of millions of decisions and does not care about your account removes the emotional relationship with individual trades.",
    },
    {
      id: "gz-1-4",
      question: "What are the three questions you must answer before placing any trade?",
      options: [
        "How much profit will I make? When does the market close? Who else is buying?",
        "What is my edge? What is my maximum risk amount? Where will I be proven wrong?",
        "Is this a buy or sell? What is the daily news saying? What indicator is crossover?",
        "How much leverage can I use? What is my profit goal? Will this double my account?"
      ],
      correctIndex: 1,
      explanation: "You must know: 1) What is my statistical edge in this setup? 2) What is the maximum I will lose if I am wrong? 3) At what point will I know I am wrong (stop loss level)? If you can't answer all three, you are gambling.",
    }
  ],
  "ground-zero/module-2": [
    {
      id: "gz-2-1",
      question: "What is the average daily trading volume of the global foreign exchange (Forex) market?",
      options: ["$500 billion", "$1.2 trillion", "$7.5 trillion", "$15 trillion"],
      correctIndex: 2,
      explanation: "The global Forex market is the largest financial market in the world, with daily trading volume exceeding $7.5 trillion.",
    },
    {
      id: "gz-2-2",
      question: "What does it mean if a broker operates an ECN/STP (A-Book) model?",
      options: [
        "They take the opposite side of your trade, making your loss their profit",
        "They act as an intermediary, routing your order directly to liquidity providers",
        "They guarantee that you will never experience slippage",
        "They do not charge spreads or commissions on any instruments"
      ],
      correctIndex: 1,
      explanation: "An ECN/STP (A-Book) broker passes your orders to external liquidity providers (banks) and profits from a small markup on the spread or commissions, rather than your trading losses.",
    },
    {
      id: "gz-2-3",
      question: "Which market participants make up the vast majority (75-80%) of Forex volume?",
      options: ["Retail traders", "Hedge funds", "Commercial and interbank networks", "Central bank intervention desks"],
      correctIndex: 2,
      explanation: "Commercial and investment banks (the interbank network) account for 75-80% of all transactional volume in the currency market.",
    },
    {
      id: "gz-2-4",
      question: "Why is the scale and size of institutional participants actually an advantage for technical traders?",
      options: [
        "Institutions share their research reports and algorithms for free",
        "Because of their size, institutions cannot enter positions without moving price and leaving visible footprints",
        "They execute trades slowly, allowing retail to front-run them",
        "They only trade on the 1-minute chart, leaving higher timeframes to retail"
      ],
      correctIndex: 1,
      explanation: "Because institutions trade massive sizes, they cannot hide their entries. They leave footprints in price structure (accumulation, distribution, liquidity sweeps) which technical traders can identify.",
    }
  ],
  "ground-zero/module-3": [
    {
      id: "gz-3-1",
      question: "What does the body of a candlestick represent?",
      options: [
        "The highest and lowest price reached during the period",
        "The net price action between the open and the close of that period",
        "The volume of orders matched during that period",
        "The average price level of the last 20 candles"
      ],
      correctIndex: 1,
      explanation: "The body of the candlestick shows the net distance and direction between the opening price and the closing price of that specific time period.",
    },
    {
      id: "gz-3-2",
      question: "What does a candlestick with a very long lower wick and a small body near the high indicate?",
      options: [
        "Price moved lower, but buyers strongly rejected those levels and pushed price back up before close",
        "Price is about to drop significantly in the next candle",
        "Sellers are in complete control of the market direction",
        "Volume was extremely low during the candle duration"
      ],
      correctIndex: 0,
      explanation: "A long lower wick indicates that price moved significantly lower during the period but was aggressively bought back up, demonstrating strong demand and rejection of lower prices.",
    },
    {
      id: "gz-3-3",
      question: "Why do professional traders analyze higher timeframes (like Daily or 4-Hour) before lower timeframes?",
      options: [
        "Because lower timeframes do not show candlesticks",
        "Higher timeframes represent larger capital pools, making structural levels far more significant",
        "They only trade higher timeframes and never look at lower timeframes",
        "Spreads are lower when looking at daily charts"
      ],
      correctIndex: 1,
      explanation: "Higher timeframe levels and trends represent the actions of larger, institutional market participants. A lower timeframe entry signal is highly unreliable if it trades directly into a major higher timeframe barrier.",
    }
  ],
  "ground-zero/module-4": [
    {
      id: "gz-4-1",
      question: "What is the primary motivation for 'Hedgers' (Type 1 participants)?",
      options: [
        "To make speculative profits from short-term market trends",
        "To protect core commercial business operations from currency fluctuations",
        "To manipulate price to trigger retail stop losses",
        "To earn overnight interest on leverage accounts"
      ],
      correctIndex: 1,
      explanation: "Hedgers (like multinational corporations or airlines) trade currencies or commodities to eliminate business risk, not for speculative gain. They will execute orders regardless of price.",
    },
    {
      id: "gz-4-2",
      question: "Why do institutional speculators need 'stop hunts' or 'liquidity grabs'?",
      options: [
        "To force retail traders out of the industry entirely",
        "Because they require substantial liquidity (opposite orders) to fill their massive positions without severe slippage",
        "Because their brokers charge them higher commissions if they do not sweep stops",
        "To test if the retail platforms are working correctly"
      ],
      correctIndex: 1,
      explanation: "To enter or exit a huge position, an institution needs a counterparty. Clusters of retail stop-losses (which are buy/sell stops) provide a dense concentration of orders, allowing institutions to fill their orders efficiently.",
    },
    {
      id: "gz-4-3",
      question: "Which participant type is responsible for building and sustaining major daily and weekly trends?",
      options: ["Hedgers", "Retail Speculators", "Institutional Speculators (Hedge Funds/Asset Managers)", "Central Banks on a daily basis"],
      correctIndex: 2,
      explanation: "Institutional Speculators manage large capital pools and build trends over days and weeks as they accumulate or distribute positions.",
    }
  ],
  "ground-zero/module-5": [
    {
      id: "gz-5-1",
      question: "What makes spread betting tax-free for UK residents?",
      options: [
        "It is classified as a professional business trade",
        "HMRC classifies spread betting as gambling, which is exempt from CGT and income tax in the UK",
        "UK brokers pay your taxes directly to the government on your behalf",
        "All financial derivative products are tax-free under UK law"
      ],
      correctIndex: 1,
      explanation: "HMRC classifies spread betting as gambling. Under current UK tax laws, gambling winnings are exempt from Capital Gains Tax (CGT) and Income Tax.",
    },
    {
      id: "gz-5-2",
      question: "What is a main disadvantage of the tax-free classification of spread betting?",
      options: [
        "Spread betting spreads are always twice as wide as CFD spreads",
        "You cannot offset spread betting losses against other capital gains (e.g., property or shares) for tax purposes",
        "You are limited to a maximum of 5 trades per week by law",
        "It requires a physical license from the UK Gambling Commission"
      ],
      correctIndex: 1,
      explanation: "Because spread betting profits are tax-free, any losses you make cannot be used to offset capital gains tax liabilities on other assets.",
    },
    {
      id: "gz-5-3",
      question: "How is position sizing measured in a spread bet compared to CFDs?",
      options: [
        "You size in lots (standard/mini/micro), whereas CFDs use contract sizes",
        "You bet a specific cash amount per point of movement (e.g. £5 per point), whereas CFDs use contract lot sizes",
        "You must buy shares directly, whereas CFDs are leveraged",
        "There is no position sizing; risk is fixed by the broker"
      ],
      correctIndex: 1,
      explanation: "Spread betting is structured as a bet of currency-per-point of movement. CFDs are sized in contracts or lots.",
    }
  ],
  "ground-zero/module-6": [
    {
      id: "gz-6-1",
      question: "If you have a 40% win rate and a 1:2 R:R (Risk-to-Reward), what is the outcome over a sample of 10 trades risking £100 per trade?",
      options: ["Lose £200", "Break Even (£0)", "Make £200", "Make £400"],
      correctIndex: 2,
      explanation: "Out of 10 trades: 4 wins make 4 × £200 = £800. 6 losses lose 6 × £100 = £600. Net result = +£200.",
    },
    {
      id: "gz-6-2",
      question: "What is the primary goal of position sizing and risk management?",
      options: [
        "To double your account as fast as possible",
        "To stay in the game long enough to let your statistical edge play out",
        "To ensure that you never experience a losing trade",
        "To reduce broker commission charges"
      ],
      correctIndex: 1,
      explanation: "The core principle is defensive survival. Proper position sizing keeps you in the game during normal losing streaks (drawdowns) so your edge can express itself over many trades.",
    },
    {
      id: "gz-6-3",
      question: "What is the mathematical recovery required if you suffer a 50% account drawdown?",
      options: ["50% gain", "75% gain", "100% gain", "200% gain"],
      correctIndex: 2,
      explanation: "If an account falls from £10,000 to £5,000, it is down 50%. To get back to £10,000, the remaining £5,000 must increase by 100% (+£5,000). Drawdowns compound defensively against you.",
    },
    {
      id: "gz-6-4",
      question: "How should you calculate your position size?",
      options: [
        "Always trade the same lot size regardless of setup",
        "Risk Amount / (Stop Loss Distance × Pip Value)",
        "Account Balance / Stop Loss Distance",
        "Risk Amount × Leverage Ratio"
      ],
      correctIndex: 1,
      explanation: "Position Size = Risk Amount / (Stop Loss Distance in pips × Pip Value). This ensures that no matter how wide or narrow your stop loss is, you lose exactly your pre-determined risk amount.",
    }
  ],
  "ground-zero/module-7": [
    {
      id: "gz-7-1",
      question: "Why are Forex majors (e.g. GBP/USD, EUR/USD) recommended for beginners?",
      options: [
        "They move 500 pips every day",
        "They have the highest liquidity, tightest spreads, and most reliable technical behaviors",
        "They are not influenced by macroeconomic news",
        "Brokers do not require margin to trade them"
      ],
      correctIndex: 1,
      explanation: "Forex majors have massive daily volume, meaning spreads are very tight, executions are clean, and standard support/resistance and structures hold up reliably compared to exotic pairs.",
    },
    {
      id: "gz-7-2",
      question: "What is a main characteristic of trading stock indices like the FTSE 100 or S&P 500?",
      options: [
        "They tend to trend more smoothly than individual currency pairs",
        "They are completely independent of global risk sentiment",
        "They trade 24 hours a day without any daily close",
        "They do not respond to technical analysis"
      ],
      correctIndex: 0,
      explanation: "Indices represent baskets of stocks and tend to trend very cleanly and smoothly based on macro risk-on and risk-off sentiment.",
    },
    {
      id: "gz-7-3",
      question: "Why is cryptocurrency (e.g., Bitcoin) generally discouraged as a primary instrument for new traders?",
      options: [
        "It lacks liquidity",
        "It features extreme volatility, runs on a 24/7 schedule with no session boundaries, and is prone to price manipulation",
        "It cannot be analyzed using standard candlesticks",
        "It is illegal to trade in the UK"
      ],
      correctIndex: 1,
      explanation: "Cryptocurrency is highly volatile, lacks the distinct trading session structure (like London/New York opens) that structures retail flow, and is subject to unregulated liquidity sweeps.",
    }
  ],
  "ground-zero/module-8": [
    {
      id: "gz-8-1",
      question: "What is the recommended charting platform and setup for Phase 1?",
      options: [
        "TradingView, with a 1-hour GBP/USD chart and no indicators",
        "MetaTrader 5, with 10 different indicators on a 1-minute chart",
        "TradingView, with multiple moving averages and RSI overlays",
        "A broker's mobile app using line charts"
      ],
      correctIndex: 0,
      explanation: "We recommend TradingView with naked candlesticks on a 1-hour GBP/USD chart. Learning raw market geometry must happen before you add any indicator overlays.",
    },
    {
      id: "gz-8-2",
      question: "What account type should you use during all of Phase 1 and Phase 2?",
      options: [
        "A live micro account with £100",
        "A demo account with paper money",
        "A prop firm evaluation account",
        "A live standard account with at least £1,000"
      ],
      correctIndex: 1,
      explanation: "You must use a demo (paper trading) account to practice and prove your discipline before risking any real capital.",
    },
    {
      id: "gz-8-3",
      question: "Which of the following is NOT a requirement for a professional trading journal entry?",
      options: [
        "The reason for entry in one sentence",
        "Your emotional state at entry (neutral, excited, fearful)",
        "The opinions of other traders on Twitter/X about the instrument",
        "Planned stop loss and entry price"
      ],
      correctIndex: 2,
      explanation: "A professional journal records your plan, setup, and emotional state — external opinions are noise and should be excluded.",
    }
  ]
};
