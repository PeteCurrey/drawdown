export interface HowToStep {
  title: string;
  content: string;
}

export interface HowToPage {
  slug: string;
  title: string;
  eyebrow: string;
  readingTime: string;
  metaDescription: string;
  introduction: string;
  steps: HowToStep[];
  commonMistakes: string[];
  drawdownApproach: {
    text: string;
    link: string;
    linkText: string;
  };
  faqs: {
    question: string;
    answer: string;
  }[];
}

export const HOW_TO_PAGES: HowToPage[] = [
  {
    slug: 'start-trading-uk',
    title: 'How to Start Trading in the UK — Step by Step',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '12 min',
    metaDescription: 'Learn how to start trading in the UK. A complete step-by-step guide covering regulation, choosing a broker, and placing your first trade safely.',
    introduction: 'Starting your trading journey in the UK can be overwhelming. Between FCA regulations, different platform types, and the sheer volume of "advice" online, it\'s easy to get lost. This guide provides a clear, honest path for beginners to start trading the right way.',
    steps: [
      {
        title: 'Understand the Basics and Risks',
        content: 'Before putting any capital at risk, you must understand what trading actually is. It\'s the business of managing risk, not just picking winning directions. In the UK, most retail traders use Spread Betting or CFDs. Be aware that over 70% of retail traders lose money—your first job is to not be one of them.'
      },
      {
        title: 'Choose an FCA-Regulated Broker',
        content: 'Never trade with a broker that isn\'t regulated by the Financial Conduct Authority (FCA). This ensures your money is protected and the broker follows strict conduct rules. We recommend platforms like IG or Pepperstone for their reliability and UK-specific support.'
      },
      {
        title: 'Open a Demo Account',
        content: 'Do not start with real money. Every major broker offers a demo account where you can trade with virtual funds. Use this time to learn the software interface, how to place orders, and how to set stop-losses without any financial risk.'
      }
    ],
    commonMistakes: [
      'Starting with too much capital',
      'Ignoring the impact of leverage',
      'Trading without a stop-loss',
      'Following "signals" from unverified sources'
    ],
    drawdownApproach: {
      text: 'At Drawdown, we believe in a risk-first approach. Before you take your first live trade, we recommend completing our Foundation course.',
      link: '/learn/foundation',
      linkText: 'View Foundation Course'
    },
    faqs: [
      {
        question: 'Do I need a lot of money to start trading?',
        answer: 'No. You can start with as little as £100 with some brokers, though having £500-£1,000 allows for better risk management.'
      },
      {
        question: 'Is trading in the UK tax-free?',
        answer: 'Spread betting is currently exempt from Capital Gains Tax and Stamp Duty in the UK. CFD trading is subject to CGT but allows you to offset losses against future gains.'
      }
    ]
  },
  {
    slug: 'trade-forex',
    title: "How to Trade Forex — Beginner's Guide",
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '15 min',
    metaDescription: 'A complete beginner guide to forex trading. Learn about pips, lots, currency pairs, and how to place your first forex trade.',
    introduction: 'Forex is the largest financial market in the world, with over $6 trillion traded every day. For a retail trader, it offers high liquidity and 24/5 access. This guide breaks down exactly how to start trading currencies without the jargon.',
    steps: [
      {
        title: 'Understand Currency Pairs',
        content: 'Forex is always traded in pairs (e.g., EUR/USD). You are simultaneously buying one currency and selling another. The first currency is the "base" and the second is the "quote".'
      },
      {
        title: 'Learn about Pips and Lots',
        content: 'A "Pip" is the smallest price move a currency can make. A "Lot" is the size of your trade. For beginners, we always recommend starting with "Micro Lots" (0.01) to keep risk low.'
      }
    ],
    commonMistakes: ['Trading during low-liquidity sessions', 'Over-leveraging on exotic pairs', 'Ignoring interest rate announcements'],
    drawdownApproach: {
      text: 'Our Forex Mastery phase goes deep into the macroeconomic drivers of currency value.',
      link: '/learn/forex-mastery',
      linkText: 'Explore Forex Mastery'
    },
    faqs: [
      { question: 'What is the best pair for beginners?', answer: 'EUR/USD is usually the best because it has the lowest spreads and most predictable behavior.' }
    ]
  },
  {
    slug: 'day-trade',
    title: 'How to Day Trade — Step by Step',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '20 min',
    metaDescription: 'Master the art of day trading. Learn how to manage your time, choose instruments, and execute trades within a single day.',
    introduction: 'Day trading is a high-intensity profession where you enter and exit positions within the same trading day. It requires extreme discipline and a fast-acting strategy. This is the blueprint for a day trader\'s routine.',
    steps: [
      { title: 'Define Your Trading Window', content: 'You don\'t trade all day. Pick a 2-3 hour window (like the London Open) and focus entirely on that session.' },
      { title: 'Scan for High-Relative Volume', content: 'Day traders need volatility. Look for assets that are moving more than their 10-day average.' }
    ],
    commonMistakes: ['Over-trading', 'Chasing moves that have already happened', 'Trading while distracted'],
    drawdownApproach: {
      text: 'Day trading is 90% psychology. Our AI Journal identifies when your "day trading" turns into "gambling".',
      link: '/tools/ai-trade-journal',
      linkText: 'Check Your Psychology'
    },
    faqs: [
      { question: 'Can I day trade with a full-time job?', answer: 'It is very difficult. Most successful part-time day traders focus on the market open before they go to work.' }
    ]
  },
  {
    slug: 'read-candlestick-charts',
    title: 'How to Read Candlestick Charts',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '10 min',
    metaDescription: 'Stop looking at lines. Learn how to read Japanese candlestick charts to understand market sentiment and price action.',
    introduction: 'Candlesticks tell a story of a battle between buyers and sellers. Once you learn to read the "wicks" and "bodies", the chart becomes a map of human emotion.',
    steps: [
      { title: 'The Anatomy of a Candle', content: 'A candle shows the Open, High, Low, and Close (OHLC). The "wick" shows where price was rejected.' },
      { title: 'Identify Momentum', content: 'Large bodies with small wicks indicate strong momentum. Small bodies with long wicks indicate indecision or reversal.' }
    ],
    commonMistakes: ['Trading single candles in isolation', 'Ignoring the timeframe context'],
    drawdownApproach: {
      text: 'We teach Price Action as the primary signal, with indicators only used as secondary confirmation.',
      link: '/learn-to-trade/price-action',
      linkText: 'Learn Price Action'
    },
    faqs: [
      { question: 'Which timeframe is best for candles?', answer: 'The higher the timeframe (Daily, 4H), the more reliable the candlestick pattern.' }
    ]
  },
  {
    slug: 'set-stop-loss',
    title: 'How to Set a Stop Loss Properly',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '12 min',
    metaDescription: 'A stop-loss is your insurance policy. Learn how to place stops based on market structure rather than random numbers.',
    introduction: 'Most traders set their stops where it "hurts" to lose money. Professionals set their stops where the "trade idea is invalidated". There is a massive difference.',
    steps: [
      { title: 'Identify Invalidation Points', content: 'Find a level where, if price hits it, your reason for being in the trade no longer exists (e.g., below a recent swing low).' },
      { title: 'Add a "Buffer"', content: 'Market noise often triggers tight stops. Always add a small buffer (using ATR or a few pips) to allow for spread and noise.' }
    ],
    commonMistakes: ['Moving stops further away when losing', 'Setting stops based on a fixed dollar amount'],
    drawdownApproach: {
      text: 'Our Risk Calculator helps you determine the exact lot size based on your stop-loss distance.',
      link: '/tools/risk-calculator',
      linkText: 'Use Risk Calculator'
    },
    faqs: [
      { question: 'Should I ever trade without a stop-loss?', answer: 'Never. Trading without a stop-loss is like driving without brakes. You might be fine for a while, but eventually, you will crash.' }
    ]
  },
  {
    slug: 'keep-trade-journal',
    title: 'How to Keep a Trade Journal',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '10 min',
    metaDescription: 'Stop gambling and start trading. Learn the exact process for keeping a professional trading journal that identifies your edge.',
    introduction: 'A trading journal is the most powerful tool in your arsenal. It is the only way to objectively measure your performance and identify the psychological mistakes that are costing you money.',
    steps: [
      { title: 'Record the Technical Data', content: 'For every trade, record the entry price, exit price, lot size, and risk-reward ratio. This is your "hard" data.' },
      { title: 'Log the Emotional State', content: 'Record how you felt before, during, and after the trade. Were you anxious? Greedy? Revenge trading? This is where the real breakthroughs happen.' }
    ],
    commonMistakes: ['Only recording winning trades', 'Not reviewing the journal at the end of the week'],
    drawdownApproach: {
      text: 'Our AI Journal automates much of this process and provides psychological insights based on your entries.',
      link: '/tools/ai-trade-journal',
      linkText: 'Try AI Journaling'
    },
    faqs: [
      { question: 'How often should I review my journal?', answer: 'Review your trades every weekend and do a deep dive into your monthly statistics every 4 weeks.' }
    ]
  },
  {
    slug: 'trade-with-100-pounds',
    title: 'How to Trade with £100',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '15 min',
    metaDescription: 'Is £100 enough to start trading? Learn how to manage a tiny account, keep fees low, and focus on the right skills.',
    introduction: 'Trading with £100 is about learning, not earning. You won\'t get rich on a £100 account, but you can build the discipline needed to manage a £10,000 account.',
    steps: [
      { title: 'Choose a Commission-Free Broker', content: 'Fees will kill a £100 account. Use a broker like Trading 212 that offers commission-free trading on fractional shares or micro-lots.' },
      { title: 'Focus on Percentage Returns', content: 'Don\'t look at the pound amount. If you make £1, that is a 1% return—a great result. Build the habit of thinking in percentages.' }
    ],
    commonMistakes: ['Over-leveraging to "make it worth it"', 'Trading high-fee instruments'],
    drawdownApproach: {
      text: 'We recommend using a £100 account as a "live demo" after you have proven consistency on a virtual account.',
      link: '/learn/foundation',
      linkText: 'Learn the Foundation'
    },
    faqs: [
      { question: 'Can I grow £100 to £10,000?', answer: 'Mathematically, yes. Practically, it is extremely difficult and requires years of perfect discipline. View the £100 as your tuition fee.' }
    ]
  },
  {
    slug: 'avoid-revenge-trading',
    title: 'How to Stop Revenge Trading',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '12 min',
    metaDescription: 'Revenge trading is the fastest way to blow an account. Learn why it happens and how to build a "circuit breaker" for your emotions.',
    introduction: 'We\'ve all been there: a frustrating loss leads to an impulsive "get even" trade, which leads to a bigger loss. Revenge trading is a biological response to pain, and you need a system to stop it.',
    steps: [
      { title: 'Identify the "Tilt" Signal', content: 'Recognize the physical symptoms of anger or desperation (increased heart rate, heat in the face). This is your signal to stop.' },
      { title: 'Implement a Daily Loss Limit', content: 'If you lose a certain percentage of your account (e.g., 2%), your platform should be closed for the day. No exceptions.' }
    ],
    commonMistakes: ['Trying to "make back" a loss before the session ends', 'Increasing lot size after a loss'],
    drawdownApproach: {
      text: 'Our AI Journal tracks your sentiment and warns you when you are entering a "revenge trading" mindset.',
      link: '/tools/ai-trade-journal',
      linkText: 'Identify Your Tilt'
    },
    faqs: [
      { question: 'What should I do after a big loss?', answer: 'Walk away from the screen for at least 2 hours. Do something physical. The market will be there when your brain is back in control.' }
    ]
  },
  {
    slug: 'trade-london-session',
    title: 'How to Trade the London Session',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '15 min',
    metaDescription: 'The London session is where the big money moves. Learn how to trade the open, the mid-day lull, and the NY overlap.',
    introduction: 'For UK traders, the London session is our home turf. It is the most liquid period for EUR and GBP pairs. Mastering the "London Open" is a staple for many professional day traders.',
    steps: [
      { title: 'The 8 AM GMT Open', content: 'This is where volatility spikes. Look for breakouts of the "Asian Range" or institutional sweeps of early liquidity.' },
      { title: 'The Mid-Day Lull', content: 'From 11 AM to 1 PM GMT, volume often drops as London traders go to lunch. This is a dangerous time for trend traders.' }
    ],
    commonMistakes: ['Trading "dead" moves during the lunch lull', 'Chasing the initial 8 AM spike without confirmation'],
    drawdownApproach: {
      text: 'We provide daily session briefings for our Pro members, identifying key levels before the London open.',
      link: '/pricing',
      linkText: 'View Pro Features'
    },
    faqs: [
      { question: 'Which pairs are best for the London session?', answer: 'GBP/USD, EUR/USD, and EUR/GBP are the most active and offer the tightest spreads.' }
    ]
  },
  {
    slug: 'use-tradingview',
    title: 'How to Use TradingView — Beginner Guide',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '18 min',
    metaDescription: 'Master the world\'s best charting platform. Learn how to set up layouts, use indicators, and create alerts on TradingView.',
    introduction: 'TradingView is the industry standard for charting. Whether you are a beginner or a pro, its interface is the cleanest and most powerful tool for market analysis. This guide helps you set it up correctly.',
    steps: [
      { title: 'Customize Your Layout', content: 'Right-click the chart to change colors and hide noise. We recommend a clean dark theme with institutional colors (Blue/Grey).' },
      { title: 'Set Up Your Watchlist', content: 'Add the major pairs and indices you plan to trade. Organize them by session or asset class for quick switching.' }
    ],
    commonMistakes: ['Cluttering charts with too many indicators', 'Not using the "Alerts" feature to save screen time'],
    drawdownApproach: {
      text: 'We provide custom TradingView templates for our members to match our institutional style.',
      link: 'https://tradingview.com',
      linkText: 'Go to TradingView'
    },
    faqs: [
      { question: 'Is TradingView free?', answer: 'Yes, the basic version is free and more than enough for most beginners. You only need to pay if you want more than 3 indicators or intraday backtesting.' }
    ]
  },
  {
    slug: 'trade-gbpusd',
    title: 'How to Trade GBP/USD (The Cable)',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '15 min',
    metaDescription: 'Learn how to trade the British Pound vs US Dollar. Understand the volatility, session overlaps, and news events that drive "The Cable".',
    introduction: 'GBP/USD, known as "The Cable", is one of the most volatile and liquid pairs in the world. It is a favorite for UK traders but requires a deep understanding of both UK and US economic data.',
    steps: [
      { title: 'Monitor the 7 AM GMT Data', content: 'UK economic data (inflation, employment) is released at 7 AM GMT. This often sets the tone for the London session.' },
      { title: 'Watch the "London-NY" Overlap', content: 'Between 1 PM and 4 PM GMT, GBP/USD sees its highest volume and most significant moves.' }
    ],
    commonMistakes: ['Trading during the Asian session (low liquidity)', 'Ignoring BOE (Bank of England) interest rate decisions'],
    drawdownApproach: {
      text: 'Our Markets section provides real-time sentiment analysis for GBP/USD based on institutional flows.',
      link: '/markets/gbpusd',
      linkText: 'View GBP/USD Analysis'
    },
    faqs: [
      { question: 'Why is it called "The Cable"?', answer: 'It refers to the physical telegraph cable that was laid across the Atlantic in the 19th century to synchronize exchange rates between London and New York.' }
    ]
  },
  {
    slug: 'trade-gold',
    title: 'How to Trade Gold (XAUUSD)',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '20 min',
    metaDescription: 'Gold is the ultimate safe-haven asset. Learn the unique drivers of XAUUSD and how to manage the extreme volatility of the gold market.',
    introduction: 'Gold trading is not for the faint of heart. It is highly volatile and respects technical levels with precision, but it can also "wipe out" accounts in seconds during news events.',
    steps: [
      { title: 'Understand the Dollar Correlation', content: 'Gold is priced in US Dollars. Generally, when the Dollar is strong, Gold is weak, and vice versa.' },
      { title: 'Identify Supply and Demand Zones', content: 'Gold respects historical support and resistance better than almost any other asset. Use the Daily and 4H charts for your levels.' }
    ],
    commonMistakes: ['Using too much leverage (Gold is 10x more volatile than many FX pairs)', 'Ignoring geopolitical news'],
    drawdownApproach: {
      text: 'Our Risk Calculator is specially optimized for XAUUSD pip value calculations.',
      link: '/tools/risk-calculator',
      linkText: 'Calculate Gold Risk'
    },
    faqs: [
      { question: 'What is the best time to trade gold?', answer: 'The New York session (from 1:30 PM GMT) is when Gold sees its most significant and trend-defining moves.' }
    ]
  },
  {
    slug: 'trade-bitcoin',
    title: 'How to Trade Bitcoin',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '15 min',
    metaDescription: 'A beginner guide to trading Bitcoin. Learn about crypto volatility, security, and how to use technical analysis on BTCUSD.',
    introduction: 'Bitcoin has evolved from a niche asset to a global macro indicator. Trading BTC requires a mix of traditional technical analysis and an understanding of crypto-specific liquidity cycles.',
    steps: [
      { title: 'Manage the 24/7 Market', content: 'Unlike Forex, Bitcoin never sleeps. This means gaps can happen at any time. We recommend not holding high-leverage positions over the weekend.' },
      { title: 'Use Exchange Inflows as Data', content: 'Large amounts of BTC moving onto exchanges often signals potential selling pressure. Use on-chain data as a secondary signal.' }
    ],
    commonMistakes: ['FOMO (Fear Of Missing Out) during parabolic moves', 'Not using a stop-loss because "it will come back"'],
    drawdownApproach: {
      text: 'We cover Bitcoin in our Crypto Mastery phase, focusing on institutional adoption and market structure.',
      link: '/learn/crypto-mastery',
      linkText: 'Learn Crypto Trading'
    },
    faqs: [
      { question: 'Is Bitcoin more volatile than Forex?', answer: 'Significantly. Bitcoin can move 5-10% in a single day, which is rare for major currency pairs.' }
    ]
  },
  {
    slug: 'pay-trading-tax-uk',
    title: 'How to Pay Tax on Trading in the UK',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '12 min',
    metaDescription: 'Don\'t let HMRC surprise you. Learn about Capital Gains Tax, Stamp Duty, and why Spread Betting is the ultimate UK tax edge.',
    introduction: 'Trading is a business, and like any business, you need to understand your tax obligations. In the UK, the way you trade (Spread Betting vs CFDs vs Shares) drastically changes how much you pay.',
    steps: [
      { title: 'Determine Your Trading Status', content: 'HMRC differentiates between "investing" and "trading." For most retail traders, you will fall under Capital Gains Tax rules.' },
      { title: 'Leverage the Spread Betting Edge', content: 'Under current UK law, profits from spread betting are generally exempt from CGT and Stamp Duty because it is legally classified as gambling.' }
    ],
    commonMistakes: ['Not keeping records of losses (which can be offset in CFDs)', 'Assuming crypto is tax-free'],
    drawdownApproach: {
      text: 'We recommend consulting with a tax professional who specializes in financial markets for personalized advice.',
      link: '/blog/trading-taxes-uk-explained',
      linkText: 'Read Tax Deep-Dive'
    },
    faqs: [
      { question: 'Is spread betting tax-free for everyone?', answer: 'Generally yes for UK residents, but if trading is your primary source of income, HMRC may occasionally seek to reclassify your status. Always seek professional advice.' }
    ]
  },
  {
    slug: 'trade-news-events',
    title: 'How to Trade During News Events',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '15 min',
    metaDescription: 'News releases are the primary drivers of volatility. Learn how to trade the news without getting "smashed" by slippage and spreads.',
    introduction: 'High-impact news (like NFP or interest rate decisions) can move the market 100 pips in seconds. This is where most retail traders blow their accounts. This guide teaches you a professional approach to news volatility.',
    steps: [
      { title: 'Check the Economic Calendar', content: 'Every morning, check for "Red Folder" events. These are the high-impact releases you need to be aware of.' },
      { title: 'Avoid the Initial 5 Minutes', content: 'The first 5 minutes after a release are pure gambling. Spreads widen and slippage is rampant. Wait for the initial move to settle and trade the "retest".' }
    ],
    commonMistakes: ['Placing "straddle" orders right before news', 'Using tight stops during high volatility'],
    drawdownApproach: {
      text: 'We recommend staying flat (no open positions) during major news releases until you are an expert.',
      link: '/learn/forex-mastery',
      linkText: 'Learn News Drivers'
    },
    faqs: [
      { question: 'What is NFP?', answer: 'Non-Farm Payrolls. It is the most watched US economic indicator and released on the first Friday of every month.' }
    ]
  },
  {
    slug: 'pass-prop-firm-challenge',
    title: 'How to Pass a Prop Firm Challenge',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '20 min',
    metaDescription: 'Prop firm challenges are designed to be failed. Learn the math and psychology needed to pass and get funded.',
    introduction: 'The statistics are grim: over 90% of people fail their first prop firm challenge. Why? Because they trade the challenge like a sprint, not a marathon. Here is how to beat the rules.',
    steps: [
      { title: 'Focus on "Daily Drawdown"', content: 'The daily loss limit is the most common reason for failure. Set your own internal limit at half of the firm\'s limit.' },
      { title: 'Use a Lower Lot Size', content: 'There is no time limit on most modern challenges. Take your time. Lower your lot size so a losing streak doesn\'t end your challenge.' }
    ],
    commonMistakes: ['Trying to "hit the target" in one week', 'Violating minor rules like holding over the weekend'],
    drawdownApproach: {
      text: 'Our Prop Firm Mastery phase provides a specific risk-management framework for funded accounts.',
      link: '/best/prop-firm',
      linkText: 'Best Prop Firms'
    },
    faqs: [
      { question: 'Is prop trading gambling?', answer: 'It is if you don\'t have a proven edge. If you do, it is simply a way to access more leverage than a retail account allows.' }
    ]
  },
  {
    slug: 'use-leverage-safely',
    title: 'How to Use Leverage Without Blowing Your Account',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '12 min',
    metaDescription: 'Leverage is a double-edged sword. Learn how to use it to scale your profits while keeping your risk strictly under control.',
    introduction: 'In the UK, retail leverage is capped at 30:1 for major pairs. Even at this level, you can lose your entire account in minutes if you don\'t understand the math of margin.',
    steps: [
      { title: 'Calculate "Notional" Value', content: 'Understand that a 1-lot position on EUR/USD is worth $100,000. Leverage is simply the ratio between that value and your deposit.' },
      { title: 'Never Trade Based on Margin', content: 'Just because you *can* open 10 positions doesn\'t mean you should. Always calculate your risk based on your total account balance, not your available margin.' }
    ],
    commonMistakes: ['Over-leveraging to recover losses', 'Not understanding "Margin Calls"'],
    drawdownApproach: {
      text: 'Our Risk Calculator does the leverage math for you, ensuring you never take a position that exceeds your risk tolerance.',
      link: '/tools/risk-calculator',
      linkText: 'Check Your Leverage'
    },
    faqs: [
      { question: 'What is 30:1 leverage?', answer: 'It means for every £1 in your account, you can control £30 worth of an asset.' }
    ]
  },
  {
    slug: 'create-trading-routine',
    title: 'How to Create a Trading Routine',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '10 min',
    metaDescription: 'Consistency in the markets comes from consistency in your routine. Learn how to build a professional pre-market and post-market process.',
    introduction: 'If you just sit down and start clicking buttons, you aren\'t a trader—you\'re a gambler. A professional routine prepares your brain for the session and ensures you only take high-quality setups.',
    steps: [
      { title: 'The Pre-Market Scan', content: '30 minutes before your session, check the news, identify key support/resistance levels, and write down your "If/Then" scenarios.' },
      { title: 'The Post-Market Review', content: 'After the session, log your trades in your journal and reflect on your emotional state. This is where you actually learn.' }
    ],
    commonMistakes: ['Trading while tired or emotional', 'Skipping the pre-market prep'],
    drawdownApproach: {
      text: 'We provide a printable "Trader Daily Checklist" for all our members to help build this habit.',
      link: '/signup',
      linkText: 'Join Drawdown Free'
    },
    faqs: [
      { question: 'How long should a routine take?', answer: 'A good pre-market routine should take 20-30 minutes. The post-market review can be done in 10 minutes.' }
    ]
  },
  {
    slug: 'backtest-strategy',
    title: 'How to Backtest a Trading Strategy',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '15 min',
    metaDescription: 'Don\'t trust a strategy until you have proven it on historical data. Learn the right way to backtest without cheating.',
    introduction: 'Backtesting is the only way to gain confidence in your strategy. But most people "cheat" by looking ahead on the chart. Here is how to do it scientifically.',
    steps: [
      { title: 'Use "Bar Replay" Tools', content: 'Tools like TradingView\'s "Bar Replay" allow you to hide future price action. This is the only way to simulate real-time decision making.' },
      { title: 'Sample at least 100 Trades', content: 'A sample of 10 trades means nothing. You need at least 100 trades across different market conditions to see if your edge is real.' }
    ],
    commonMistakes: ['Changing the rules mid-backtest', 'Ignoring spreads and commissions in the results'],
    drawdownApproach: {
      text: 'We teach a "Triple-Blind" backtesting method in our advanced courses to ensure your data is statistically sound.',
      link: '/learn/advanced',
      linkText: 'Advanced Backtesting'
    },
    faqs: [
      { question: 'Is backtesting the same as live trading?', answer: 'No. Backtesting proves the strategy works; live trading proves *you* can execute it. Psychology is the missing variable in backtesting.' }
    ]
  },
  {
    slug: 'choose-broker-uk',
    title: 'How to Choose a Broker in the UK',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '12 min',
    metaDescription: 'Your broker is your business partner. Learn what to look for in regulation, fees, and technology before you deposit any money.',
    introduction: 'In the UK, we are lucky to have some of the best-regulated brokers in the world. But not every broker is right for every strategy. This is your checklist for choosing a partner.',
    steps: [
      { title: 'Verify FCA Regulation', content: 'Check the FCA Register. If they aren\'t on there, do not give them your money. It\'s that simple.' },
      { title: 'Compare Total Cost of Trade', content: 'Don\'t just look at spreads. Look at overnight financing fees (swaps), withdrawal fees, and inactivity fees.' }
    ],
    commonMistakes: ['Choosing a broker based on a "deposit bonus" (which are banned in the UK)', 'Ignoring the quality of the mobile app'],
    drawdownApproach: {
      text: 'We have pre-vetted the top UK brokers so you don\'t have to.',
      link: '/brokers',
      linkText: 'Compare Brokers'
    },
    faqs: [
      { question: 'Are offshore brokers safe?', answer: 'Generally, no. You lose the protection of the FSCS and the oversight of the FCA. We do not recommend offshore brokers for UK residents.' }
    ]
  },
  {
    slug: 'start-spread-betting',
    title: 'How to Start Spread Betting in the UK',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '15 min',
    metaDescription: 'Spread betting is the unique UK advantage. Learn how to open an account, place your first "bet", and manage your tax-free profits.',
    introduction: 'Spread betting is often misunderstood as "gambling" in the legal sense, but for a trader, it is a sophisticated financial instrument. This guide explains how to use it to your advantage.',
    steps: [
      { title: 'Understand "Pound per Point"', content: 'In spread betting, you don\'t buy "lots." You bet a certain amount of money for every point the market moves.' },
      { title: 'Manage Your Leverage', content: 'Because spread betting is so easy to access, it\'s easy to over-leverage. Always use the margin indicators on your platform.' }
    ],
    commonMistakes: ['Thinking spread betting is easier than other trading', 'Assuming you don\'t need to report huge wins to HMRC (even if they are tax-free)'],
    drawdownApproach: {
      text: 'We focus on Spread Betting as the primary vehicle for our UK students due to the tax efficiency.',
      link: '/learn-to-trade/spread-betting',
      linkText: 'Spread Betting Guide'
    },
    faqs: [
      { question: 'Is spread betting better than CFDs?', answer: 'For most UK retail traders, yes, because of the tax-free status. Professional traders may prefer CFDs for loss-harvesting.' }
    ]
  },
  {
    slug: 'grow-small-trading-account',
    title: 'How to Grow a Small Trading Account',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '15 min',
    metaDescription: 'Scaling a small account requires a different strategy than managing a large one. Learn how to grow safely without taking "suicide" risks.',
    introduction: 'Most traders blow their small accounts because they are in too much of a hurry. Scaling from £500 to £5,000 is a marathon, not a sprint. This is the professional way to scale.',
    steps: [
      { title: 'Focus on "A+" Setups Only', content: 'With a small account, you can\'t afford a string of losses. Be extremely selective. Only trade when the stars align.' },
      { title: 'Compound Your Wins', content: 'As your account grows, your lot size should grow proportionally. This is the power of compounding. Don\'t withdraw your profits too early.' }
    ],
    commonMistakes: ['Using 10% risk to "see faster results"', 'Adding more money every time you lose'],
    drawdownApproach: {
      text: 'We recommend using a small account to prove your strategy before applying for a Prop Firm challenge.',
      link: '/best/prop-firm',
      linkText: 'Scale with Prop Capital'
    },
    faqs: [
      { question: 'What is a "small" account?', answer: 'In the UK, anything under £2,000 is generally considered a small account for active trading.' }
    ]
  },
  {
    slug: 'calculate-position-size',
    title: 'How to Calculate Position Size',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '10 min',
    metaDescription: 'Stop guessing. Learn the exact formula for calculating your lot size based on your risk and stop-loss distance.',
    introduction: 'If you ask a beginner "how much are you risking?", they say "£50." If you ask a pro, they say "1%." This guide teaches you the math of professional risk management.',
    steps: [
      { title: 'Determine Your Risk Amount', content: 'Choose a fixed percentage (e.g., 1%) of your account balance. This is your "Risk at Risk".' },
      { title: 'Use the Position Size Formula', content: 'Lot Size = (Account Risk Amount) / (Stop Loss Distance in Pips * Pip Value). This ensures that no matter where your stop is, you only lose 1%.' }
    ],
    commonMistakes: ['Using the same lot size for every trade', 'Ignoring pip value differences between currency pairs'],
    drawdownApproach: {
      text: 'We built a free tool to do this math for you in 2 seconds.',
      link: '/tools/risk-calculator',
      linkText: 'Risk Calculator'
    },
    faqs: [
      { question: 'What is a pip value?', answer: 'It is the dollar/pound value of a single pip move. For most pairs on a standard lot, it is $10.' }
    ]
  },
  {
    slug: 'deal-with-losing-streak',
    title: 'How to Handle a Losing Streak',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '12 min',
    metaDescription: 'Losing streaks are a statistical certainty. Learn how to manage your capital and your sanity when the market isn\'t cooperating.',
    introduction: 'Every professional trader goes through losing streaks. The difference is how they handle them. A losing streak shouldn\'t kill your account; it should just be a "cost of doing business."',
    steps: [
      { title: 'Lower Your Risk', content: 'When you are in a "drawdown," lower your risk per trade to 0.5% or even 0.25%. This protects your capital while you wait for your edge to return.' },
      { title: 'Verify Your Edge', content: 'Review your recent losses. Were they "good" losses (following the plan) or "bad" losses (impulsive)? If they were good losses, keep going.' }
    ],
    commonMistakes: ['Increasing risk to "make it back"', 'Changing your strategy mid-streak'],
    drawdownApproach: {
      text: 'Our AI Journal identifies when your "losing streak" is actually just "bad behavior" and gives you the hard truth.',
      link: '/tools/ai-trade-journal',
      linkText: 'Analyze Your Streak'
    },
    faqs: [
      { question: 'How long can a losing streak last?', answer: 'Depending on your win rate, it is mathematically possible to have 10-15 losses in a row even with a good strategy.' }
    ]
  },
  {
    slug: 'build-trading-strategy',
    title: 'How to Build a Trading Strategy',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '20 min',
    metaDescription: 'Stop following "holy grail" systems. Learn how to build a personalized trading strategy based on logic and market structure.',
    introduction: 'A trading strategy is just a set of rules that gives you a statistical edge. It should be based on objective observations, not feelings. This is the 5-step process for building your own.',
    steps: [
      { title: 'Define Your "Setup"', content: 'What specific market condition are you looking for? (e.g., a pullback to the 20 EMA in an uptrend).' },
      { title: 'Define Your Entry and Exit', content: 'Exactly where do you click buy? Exactly where do you take profit? Exactly where do you admit you are wrong?' }
    ],
    commonMistakes: ['Making the rules too complex', 'Not writing the rules down'],
    drawdownApproach: {
      text: 'We provide 5 proven "Blueprint" strategies for our students to use as a starting point.',
      link: '/signup',
      linkText: 'Get the Blueprints'
    },
    faqs: [
      { question: 'Does a strategy need indicators?', answer: 'No. Some of the most profitable strategies are based entirely on price action and market structure.' }
    ]
  },
  {
    slug: 'swing-trade',
    title: 'How to Swing Trade — Complete Guide',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '18 min',
    metaDescription: 'Swing trading is the most sustainable way to trade for people with full-time jobs. Learn how to catch multi-day moves with minimal screen time.',
    introduction: 'Swing trading involves holding positions for several days to weeks. It allows you to catch large market moves while spending less than 30 minutes a day at your computer.',
    steps: [
      { title: 'Analyze the Daily Chart', content: 'The Daily chart is the primary timeframe for swing traders. Look for established trends and key institutional levels.' },
      { title: 'Manage Overnight Risk', content: 'Because you hold positions overnight, you must be aware of "gaps" and overnight financing costs. Keep your leverage lower than a day trader.' }
    ],
    commonMistakes: ['Checking the charts too often', 'Using day-trading-sized stops for swing-trading moves'],
    drawdownApproach: {
      text: 'Our Swing Mastery phase is specifically designed for professionals who want to trade alongside their career.',
      link: '/learn/swing-mastery',
      linkText: 'Learn Swing Trading'
    },
    faqs: [
      { question: 'What is the best timeframe for swing trading?', answer: 'The Daily and 4H charts are the "sweet spot" for identifying swing setups.' }
    ]
  },
  {
    slug: 'use-rsi',
    title: 'How to Use RSI — The Right Way',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '10 min',
    metaDescription: 'Most people use RSI wrong. Learn how to use the Relative Strength Index to identify momentum and divergence, not just "overbought" zones.',
    introduction: 'The Relative Strength Index (RSI) is the most popular momentum oscillator. But "Overbought" doesn\'t mean "Sell," and "Oversold" doesn\'t mean "Buy." This guide teaches you the professional way to use it.',
    steps: [
      { title: 'Identify Divergence', content: 'When price makes a higher high but RSI makes a lower high, momentum is fading. This is the most powerful signal the RSI provides.' },
      { title: 'Use the 50-Level as a Bias', content: 'If RSI is above 50, the trend is generally bullish. If below 50, it\'s bearish. Use this as a simple filter for your trades.' }
    ],
    commonMistakes: ['Selling just because RSI is above 70 in a strong uptrend', 'Ignoring the trend context'],
    drawdownApproach: {
      text: 'We use RSI as a confirmation tool, never as a standalone entry signal.',
      link: '/learn-to-trade/technical-analysis',
      linkText: 'Technical Analysis Guide'
    },
    faqs: [
      { question: 'What is the default RSI setting?', answer: 'The standard setting is 14 periods, which is what we recommend for most strategies.' }
    ]
  },
  {
    slug: 'use-macd',
    title: 'How to Use MACD for Trading',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '12 min',
    metaDescription: 'The MACD is a versatile trend-following indicator. Learn how to read the histogram and signal lines to find high-probability entries.',
    introduction: 'MACD (Moving Average Convergence Divergence) is a "momentum-trend" hybrid. It helps you identify when a trend is accelerating or beginning to lose steam.',
    steps: [
      { title: 'Watch the Histogram', content: 'The histogram shows the distance between the two MACD lines. When it gets larger, momentum is increasing. When it shrinks, a reversal may be near.' },
      { title: 'Identify Signal Crossovers', content: 'A crossover of the signal line can be an entry signal, but only when it happens in the direction of the overall trend.' }
    ],
    commonMistakes: ['Taking every "zero-line cross" as a trade', 'Using it on very low timeframes where it generates too much noise'],
    drawdownApproach: {
      text: 'Our indicators phase covers the mathematical reality behind the MACD so you know exactly what it\'s telling you.',
      link: '/learn-to-trade/technical-analysis',
      linkText: 'Master Indicators'
    },
    faqs: [
      { question: 'Which is better, RSI or MACD?', answer: 'Neither is "better." RSI measures price speed, while MACD measures the relationship between two moving averages. Many traders use both for confirmation.' }
    ]
  }
];
