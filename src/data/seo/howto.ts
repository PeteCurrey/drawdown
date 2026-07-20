export interface HowToStep {
  title: string;
  content: string;
  image?: { src: string; alt: string };
}

export interface HowToPage {
  slug: string;
  title: string;
  eyebrow: string;
  readingTime: string | number;
  metaDescription: string;
  // Wave 2 additions — optional for backward compatibility
  metaTitle?: string;
  dek?: string;
  difficulty?: "Beginner" | "Intermediate";
  estimatedTime?: string;
  prerequisites?: string[];
  heroImage?: { src: string; alt: string };
  nextStep?: { label: string; href: string };
  internalLinks?: string[];
  introduction: string;
  steps: HowToStep[];
  commonMistakes: string[];
  drawdownApproach: {
    title?: string;
    content?: string;
    ctaText?: string;
    ctaLink?: string;
    text?: string;
    link?: string;
    linkText?: string;
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
      link: '/go/tradingview',
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
  },
  {
    slug: 'choose-broker-uk',
    title: 'How to Choose a Trading Broker in the UK',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '10 min',
    metaDescription: 'Don\'t get scammed. Learn exactly how to evaluate a UK broker based on FCA regulation, spreads, and payout reliability.',
    introduction: 'Your broker is your only partner in the markets. Choose the wrong one, and even a winning strategy won\'t save you from slippage, high fees, or withdrawal delays. Here is how to audit a broker like a professional.',
    steps: [
      { title: 'Check the FCA Register', content: 'Go to the Financial Services Register and verify the broker\'s firm reference number (FRN). If they aren\'t authorized for "investment services," walk away.' },
      { title: 'Compare Total Cost of Trade', content: 'Don\'t just look at the spread. Check for commissions, overnight swap rates, and inactivity fees. A "zero spread" account often has high commissions that make it more expensive.' },
      { title: 'Test Customer Support', content: 'Send a technical question to their support team. If they take 48 hours to reply now, imagine how long they\'ll take when you have a trade execution issue.' }
    ],
    commonMistakes: ['Falling for "deposit bonuses"', 'Ignoring the spread on the assets you actually trade', 'Trading with offshore, unregulated brokers'],
    drawdownApproach: {
      text: 'We only recommend brokers that we have personally funded and traded with.',
      link: '/best/forex-broker-uk',
      linkText: 'View Our Ranked Brokers'
    },
    faqs: [
      { question: 'Is a larger broker always better?', answer: 'Not necessarily, but larger, publicly-listed brokers (like IG) offer a level of transparency and capital security that smaller firms can\'t match.' }
    ]
  },
  {
    slug: 'start-spread-betting',
    title: 'How to Start Spread Betting — UK Beginner Guide',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '14 min',
    metaDescription: 'The ultimate guide to UK spread betting. Learn how to use this tax-efficient instrument to trade forex, stocks, and indices.',
    introduction: 'Spread betting is a uniquely British way to trade the financial markets. It is classified as betting, which makes it tax-free for most. However, it uses leverage, meaning you need to understand exactly how "pounds per point" works before you start.',
    steps: [
      { title: 'Understand "Pounds Per Point"', content: 'Unlike buying shares, you are betting a certain amount of money for every "point" the market moves. If you bet £1 per point on the FTSE 100 and it moves 10 points, you make or lose £10.' },
      { title: 'Select Your Instrument', content: 'You can spread bet on almost anything — GBP/USD, Gold, individual UK/US stocks, and global indices. Start with a major index like the FTSE 100 as it has lower volatility.' },
      { title: 'Calculate Your Margin', content: 'Leverage means you only need a small percentage of the trade value in your account. But remember, your losses are based on the full trade value, not just your margin.' }
    ],
    commonMistakes: ['Calculating risk based on "pounds" instead of "points"', 'Forgetting that spread betting is not available outside the UK/Ireland', 'Over-leveraging because of the low margin requirements'],
    drawdownApproach: {
      text: 'Spread betting is our preferred vehicle for UK-based swing trading.',
      link: '/best/spread-betting-platform-uk',
      linkText: 'Best Spread Betting Platforms'
    },
    faqs: [
      { question: 'Is spread betting really tax-free?', answer: 'Yes, as of 2026, spread betting is exempt from Capital Gains Tax and Stamp Duty in the UK. This can save you up to 20-28% on your profits compared to CFDs or real shares.' }
    ]
  },
  {
    slug: 'trade-with-100-pounds',
    title: 'How to Trade with £100 — A Survival Guide',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '8 min',
    metaDescription: 'Can you trade with just £100? Yes, but your goal isn\'t to get rich—it\'s to survive. Learn the math of small account trading.',
    introduction: 'Trading with £100 is "Hard Mode." Your biggest enemy isn\'t the market; it\'s your own impatience. If you try to double this in a week, you will lose it in a day. Here is how to treat £100 with the respect of £100,000.',
    steps: [
      { title: 'Use a Micro-Lot Broker', content: 'You must use a broker that allows 0.01 lot sizes. On a £100 account, a standard lot would blow your account in a single pip move.' },
      { title: 'Limit Your Risk per Trade', content: 'Even on a tiny account, you should only risk 1-2% (£1-£2) per trade. This requires very tight stop-losses and disciplined entry.' },
      { title: 'Focus on Process, Not Profit', content: 'You won\'t buy a Ferrari with £100. Your goal is to prove you can trade for 3 months without blowing the account. The skill is the asset, not the £100.' }
    ],
    commonMistakes: ['Using high leverage to "gamble" the £100', 'Ignoring the spread (which is a large % of a £100 account)', 'Expecting life-changing returns immediately'],
    drawdownApproach: {
      text: 'We recommend small accounts use our Risk Calculator to ensure they never over-leverage.',
      link: '/tools/risk-calculator',
      linkText: 'Use Risk Calculator'
    },
    faqs: [
      { question: 'Can I grow £100 into a career?', answer: 'Only if you use it to practice for a prop firm challenge. £100 is for learning; prop firms are for earning.' }
    ]
  },
  {
    slug: 'trade-with-1000-pounds',
    title: 'How to Trade with £1,000 — Professional Setup',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '11 min',
    metaDescription: 'A £1,000 account is the "sweet spot" for serious beginners. Learn how to allocate this capital across a professional trading plan.',
    introduction: 'With £1,000, you finally have enough capital to practice real risk management. You can survive a losing streak and actually see your P&L move in meaningful ways. Here is the professional roadmap for a four-figure account.',
    steps: [
      { title: 'The 1% Rule', content: 'Risk exactly £10 per trade. This gives you 100 "lives" before your account is gone. Most professionals never exceed this risk level.' },
      { title: 'Stick to 2-3 Pairs', content: 'Don\'t try to watch the whole market. Pick two major pairs (like GBP/USD and EUR/USD) and learn their personality intimately.' },
      { title: 'Build a Weekly Routine', content: 'Analyze on Sunday, trade Tuesday to Thursday, and review on Saturday. Trading is a job; treat it like one.' }
    ],
    commonMistakes: ['Thinking £1,000 is enough to quit your job', 'Taking "revenge trades" after a £10 loss', 'Adding to losing positions'],
    drawdownApproach: {
      text: 'Our Foundation course is specifically designed for traders starting with £1,000 - £5,000.',
      link: '/learn/foundation',
      linkText: 'Join Foundation'
    },
    faqs: [
      { question: 'How much can I make with £1,000?', answer: 'A realistic goal for a good trader is 2-5% per month (£20-£50). It sounds small, but compounding that consistently is how you build a real bankroll.' }
    ]
  },
  {
    slug: 'grow-small-trading-account',
    title: 'How to Grow a Small Trading Account Safely',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '13 min',
    metaDescription: 'Compounding is the 8th wonder of the world. Learn the mathematical reality of growing a small account into a significant fund.',
    introduction: 'Growing a small account is a marathon, not a sprint. The "secret" isn\'t finding a 90% win-rate strategy; it\'s staying in the game long enough for the math of compounding to take over. Here is the blueprint.',
    steps: [
      { title: 'The Power of Compounding', content: 'If you make 5% a month on £1,000, you don\'t just have £1,600 after a year. If you leave the profits in, you have nearly £1,800. After 3 years, you have over £5,000. Patience is your edge.' },
      { title: 'Avoid the "Lotto" Trade', content: 'Small accounts often blow up because the trader tries to "hit it big" on a single event. One bad trade can wipe out 6 months of disciplined growth.' },
      { title: 'Scale Your Position Sizing', content: 'As your account grows from £1,000 to £1,200, your 1% risk moves from £10 to £12. This "auto-scaling" is how you grow without increasing your emotional stress.' }
    ],
    commonMistakes: ['Withdrawing profits too early', 'Increasing risk percentage because you feel "bored"', 'Comparing your growth to fake accounts on Instagram'],
    drawdownApproach: {
      text: 'Track your growth path with our AI Trade Journal to see the compounding math in real-time.',
      link: '/tools/ai-trade-journal',
      linkText: 'Start Journaling'
    },
    faqs: [
      { question: 'What is the fastest way to grow a small account?', answer: 'The fastest way is to not blow it up. Consistency beats intensity every single time.' }
    ]
  },
  {
    slug: 'avoid-revenge-trading',
    title: 'How to Avoid Revenge Trading — Stop the Tilt',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '9 min',
    metaDescription: 'Revenge trading is the #1 account killer. Learn how to recognize the biological triggers and implement a "circuit breaker" for your trading.',
    introduction: 'We have all been there. A "perfect" setup fails, you feel cheated by the market, and you immediately double your position size to "get it back." This is revenge trading, and it is a biological response that you must learn to override.',
    steps: [
      { title: 'Recognize the Physiological Signs', content: 'When you lose a trade, your body releases cortisol. If you feel your heart racing, your face getting hot, or a desperate need to be "right," you are tilted. Your brain is no longer capable of objective analysis.' },
      { title: 'Walk Away Immediately', content: 'The only cure for tilt is time. Close your laptop, put your phone in another room, and go for a 15-minute walk. Do not look at the charts. The market will be there when your pre-frontal cortex is back in control.' },
      { title: 'Implement a Daily Loss Limit', content: 'Use a hard stop. If you lose 3% of your account in a day, you are done. No exceptions. This "circuit breaker" ensures that one bad day doesn\'t turn into a blown account.' }
    ],
    commonMistakes: ['Thinking you can "force" the market to pay you back', 'Increasing position size after a loss', 'Trading while emotional or tired'],
    drawdownApproach: {
      text: 'Our AI Psychology Coach is built specifically to detect and prevent revenge trading patterns.',
      link: '/tools/ai-coach',
      linkText: 'Get an AI Discipline Report'
    },
    faqs: [
      { question: 'Is revenge trading a sign I\'m a bad trader?', answer: 'No, it\'s a sign you are a human. Even pros feel the urge; the difference is they have the systems to prevent themselves from acting on it.' }
    ]
  },
  {
    slug: 'deal-with-losing-streak',
    title: 'How to Deal with a Losing Streak Like a Pro',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '12 min',
    metaDescription: 'Losing streaks are inevitable. Learn how to manage your capital and your confidence when the market isn\'t cooperating with your strategy.',
    introduction: 'Even the world\'s best strategies have periods where they don\'t work. A "Drawdown" is a normal part of the business. The goal isn\'t to avoid losing streaks; it\'s to survive them with your capital and your sanity intact.',
    steps: [
      { title: 'Verify Your Edge', content: 'Is the strategy failing, or are you? Review your journal. If you followed your rules and still lost, the market environment has simply changed. If you broke your rules, you don\'t have a losing streak; you have a discipline problem.' },
      { title: 'Reduce Your Risk', content: 'When in a drawdown, cut your risk in half. If you usually risk 1%, drop to 0.5%. This reduces the mathematical "slope" of your losses and preserves your capital while you wait for the market to align with your edge again.' },
      { title: 'Step Back to Demo', content: 'If you lose 5-10% of your account, stop trading live. Go back to a demo account until you have 5 winning trades in a row. This restores your confidence without costing you a penny.' }
    ],
    commonMistakes: ['Changing your strategy in the middle of a streak', 'Trying to "trade your way out" of a hole', 'Ignoring the psychological toll of consecutive losses'],
    drawdownApproach: {
      text: 'We use the "Equity Curve Simulator" to show traders that 10 losses in a row is statistically normal.',
      link: '/tools/simulator',
      linkText: 'Simulate Your Strategy'
    },
    faqs: [
      { question: 'When should I give up on a strategy?', answer: 'Only after at least 100 trades. A 5-trade losing streak is noise; a 50-trade losing streak is a failed strategy.' }
    ]
  },
  {
    slug: 'trade-london-session',
    title: 'How to Trade the London Session — The Volatility Hub',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '15 min',
    metaDescription: 'The London session is the world\'s liquidity engine. Learn how to trade the "London Open" breakout and the mid-morning trend.',
    introduction: 'London accounts for nearly 40% of global forex volume. If you want big moves and tight spreads, you need to be at your desk at 8 AM GMT. This guide covers the specific mechanics of the most important session in the world.',
    steps: [
      { title: 'The 8 AM "Initial Move"', content: 'When London opens, there is a massive injection of liquidity. This often leads to a "fakeout" move in the first 15 minutes followed by the real trend. Wait for the 8:15 AM candle to close before committing.' },
      { title: 'Identify the Session High/Low', content: 'The high and low set in the first hour of London trading often hold for the rest of the day. Trading breakouts of these levels is a classic institutional strategy.' },
      { title: 'Watch the "London Lunch" Fade', content: 'Around 12 PM GMT, volume often drops as European traders go to lunch. This is a dangerous time to enter new trades as liquidity is thin and moves can be erratic.' }
    ],
    commonMistakes: ['Trading before the 8 AM open', 'Ignoring the impact of the New York overlap at 1 PM', 'Trying to trade GBP pairs during the Asian session'],
    drawdownApproach: {
      text: 'Our "Session Pulse" tool shows you exactly when volume is peaking in London.',
      link: '/markets/pulse',
      linkText: 'Check Market Pulse'
    },
    faqs: [
      { question: 'What are the best pairs for the London session?', answer: 'Anything involving the GBP, EUR, or CHF. GBP/USD (The Cable) is the undisputed king of the London session.' }
    ]
  },
  {
    slug: 'trade-news-events',
    title: 'How to Trade News Events without Blowing Your Account',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '11 min',
    metaDescription: 'News trading can be lucrative or lethal. Learn how to manage the volatility of NFP, CPI, and interest rate decisions.',
    introduction: 'Economic news events like Non-Farm Payrolls (NFP) can move the market 100 pips in seconds. While tempting, news trading is where most beginners blow their accounts due to "slippage" and "spread widening." Here is the safe way to play it.',
    steps: [
      { title: 'The "No Trade" Zone', content: 'For most retail traders, the safest way to trade news is to NOT trade during the release. Wait 15-30 minutes for the initial volatility to settle and a clear direction to emerge.' },
      { title: 'Check the Economic Calendar', content: 'Use a tool like Forex Factory. Any "Red Folder" event means you should have no open trades or have your stops moved to break-even before the release.' },
      { title: 'Account for Slippage', content: 'During high-impact news, your stop-loss is NOT guaranteed. If the market "gaps" over your price, you will be filled at the next available price. Never risk more than you can afford to lose on a gap.' }
    ],
    commonMistakes: ['Trying to "guess" the news result', 'Using tight stops during high volatility', 'Trading with a broker that has poor news execution'],
    drawdownApproach: {
      text: 'We provide a Daily Briefing that highlights the "Red Folder" risks for the day.',
      link: '/dashboard/news',
      linkText: 'Read Today\'s Briefing'
    },
    faqs: [
      { question: 'What is the most important news event?', answer: 'US Consumer Price Index (CPI) and the Federal Reserve Interest Rate decisions (FOMC) are currently the biggest market movers in 2026.' }
    ]
  },
  {
    slug: 'use-tradingview',
    title: 'How to Use TradingView Like a Professional',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '14 min',
    metaDescription: 'TradingView is the most powerful charting tool in the world. Learn how to set up your workspace, use hotkeys, and create alerts.',
    introduction: 'If you are still using MT4/MT5 for your analysis, you are living in the stone age. TradingView is the industry standard for charting. This guide shows you how to optimize your setup for professional speed and clarity.',
    steps: [
      { title: 'Master the Keyboard Hotkeys', content: 'Efficiency is edge. Use "Alt + T" for trendlines, "Alt + H" for horizontal lines, and the number keys to switch timeframes instantly. You should be able to navigate your charts without touching your mouse.' },
      { title: 'Set Up Multi-Timeframe Layouts', content: 'Don\'t just look at one chart. Use the "Split Screen" feature to see the Daily, 4-Hour, and 15-Minute charts side-by-side. This ensures you never trade against the higher-timeframe trend.' },
      { title: 'Configure "Smart" Alerts', content: 'Don\'t stare at the screen all day. Set alerts on your key levels (support/resistance) and wait for TradingView to ping your phone. This prevents "boredom trading" and keeps your eyes fresh.' }
    ],
    commonMistakes: ['Cluttering charts with too many indicators', 'Using the "Free" version for serious multi-asset analysis', 'Ignoring the "Object Tree" for organization'],
    drawdownApproach: {
      text: 'Check our recommended list of indicators to supercharge your TradingView setup.',
      link: '/best/tradingview-indicators',
      linkText: 'Best TV Indicators'
    },
    faqs: [
      { question: 'Is TradingView free?', answer: 'There is a free version, but for serious traders, the "Pro" or "Pro+" plans are essential for multi-chart layouts and more alerts.' }
    ]
  },
  {
    slug: 'pass-prop-firm-challenge',
    title: 'How to Pass a Prop Firm Challenge — The Statistical Edge',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '18 min',
    metaDescription: '90% of traders fail their prop firm challenge. Learn the risk management secrets and psychological discipline needed to get funded.',
    introduction: 'Passing a prop firm challenge isn\'t about being a "great trader." It is about understanding the specific math of the rules. You are playing a game with strict boundaries, and if you play it like a normal account, you will lose.',
    steps: [
      { title: 'The Math of Drawdown', content: 'In a challenge, your "Daily Loss Limit" is your most important number. If you have a $100k account with a 5% daily limit ($5,000), you should never risk more than $500 per trade. This gives you 10 "shots" before you hit your daily limit.' },
      { title: 'Avoid "Big Win" Hunting', content: 'Most challenges have a 8-10% profit target. Traders fail because they try to hit this in 2 days. The secret is to aim for 0.5% - 1% per day. Slow and steady wins the funding.' },
      { title: 'Master the "Trailing Drawdown"', content: 'Some firms use a trailing drawdown based on your high-water mark. If you go up $2,000, your drawdown floor also moves up $2,000. You must lock in profits or close positions to prevent the floor from catching you.' }
    ],
    commonMistakes: ['Risking too much on the first trade', 'Trading through high-impact news', 'Over-trading to "get it over with"'],
    drawdownApproach: {
      text: 'Run your trade history through our Challenge Simulator before you pay for a real one.',
      link: '/tools/challenge-simulator',
      linkText: 'Test Your Edge'
    },
    faqs: [
      { question: 'Which firm is the easiest to pass?', answer: 'Firms with no time limits (like The5ers or FTMO) are the easiest because they remove the emotional pressure of a deadline.' }
    ]
  },
  {
    slug: 'trade-gbpusd',
    title: 'How to Trade GBP/USD — Mastering "The Cable"',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '13 min',
    metaDescription: 'GBP/USD is one of the most volatile and rewarding pairs. Learn the personality of the Pound and how to trade the London-NY overlap.',
    introduction: 'GBP/USD, known as "The Cable," is famous for its massive ranges and sharp reversals. It is the lifeblood of the London session. To trade it, you need to understand the relationship between the Bank of England and the Federal Reserve.',
    steps: [
      { title: 'Watch the 7 AM GMT "Pre-Open"', content: 'The Pound often starts moving an hour before London officially opens. This "pre-open" liquidity can provide early clues about the day\'s direction.' },
      { title: 'Understand the "Big Figure" Levels', content: 'GBP/USD loves round numbers (e.g., 1.2500, 1.3000). Institutional orders are often clustered at these levels, leading to significant support or resistance.' },
      { title: 'The 1 PM GMT Volatility Spike', content: 'When New York opens at 1 PM GMT, the overlap begins. This is the most volatile time for the Cable as both London and NY desks are active simultaneously.' }
    ],
    commonMistakes: ['Ignoring UK economic data (GDP, CPI)', 'Using too tight a stop-loss (The Cable is volatile)', 'Trading late in the New York session'],
    drawdownApproach: {
      text: 'Our Daily Briefing covers the specific BoE and Fed risks for the Cable every morning.',
      link: '/dashboard/news',
      linkText: 'Check GBP/USD Outlook'
    },
    faqs: [
      { question: 'Why is it called "The Cable"?', answer: 'It refers to the actual physical telegraph cable that was laid across the Atlantic in the 19th century to sync the exchange rates between London and New York.' }
    ]
  },
  {
    slug: 'trade-gold',
    title: 'How to Trade Gold (XAU/USD) — Safe Haven or Chaos?',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '16 min',
    metaDescription: 'Gold is a unique asset that reacts to inflation, war, and interest rates. Learn how to navigate the volatility of XAU/USD.',
    introduction: 'Gold is the ultimate "fear" gauge. It doesn\'t pay a dividend or interest, so its value is purely based on sentiment and the value of the US Dollar. It is one of the most respected technical assets in the world.',
    steps: [
      { title: 'The Inverse USD Correlation', content: '90% of the time, Gold moves opposite to the US Dollar. If the Dollar is strong, Gold is weak. Always check the DXY (Dollar Index) before taking a gold trade.' },
      { title: 'Trade the NY Open', content: 'Gold volume explodes at 1:30 PM GMT when the New York pits open. This is when the largest moves occur. Be careful with wide spreads during the Asian session.' },
      { title: 'Respect the Daily High/Low', content: 'Gold has a memory. It often revisits the previous day\'s high or low before continuing a trend. These levels are critical for placing your stop-losses.' }
    ],
    commonMistakes: ['Over-leveraging (Gold moves much faster than Forex)', 'Ignoring the "Real Yield" of US Treasuries', 'Trading Gold during quiet bank holidays'],
    drawdownApproach: {
      text: 'Gold is a core asset in our Institutional Mastery course.',
      link: '/learn/institutional',
      linkText: 'Master Gold Trading'
    },
    faqs: [
      { question: 'Is gold a good investment?', answer: 'As a trade, it\'s excellent for volatility. As an investment, it\'s a hedge against currency devaluation.' }
    ]
  },
  {
    slug: 'trade-bitcoin',
    title: 'How to Trade Bitcoin — Volatility Management',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '14 min',
    metaDescription: 'Bitcoin is the most volatile asset in the world. Learn how to apply professional risk management to the crypto markets.',
    introduction: 'Bitcoin trading isn\'t like forex. It is a 24/7 market driven by social sentiment, "whales," and institutional adoption. To survive, you need a strategy that accounts for 10% moves in a single hour.',
    steps: [
      { title: 'Ignore the Noise, Watch the Level', content: 'Crypto Twitter is full of "moon" predictions. Ignore them. Bitcoin respects horizontal support and resistance levels more than almost any other asset.' },
      { title: 'Check the "Funding Rate"', content: 'In crypto, if everyone is buying (long), they have to pay a fee to the sellers. If the funding rate is very high, a "long squeeze" is likely. This is a leading indicator of a price drop.' },
      { title: 'Use a Regulated UK Exchange', content: 'For UK traders, safety of funds is paramount. Use an FCA-registered entity or a reputable broker like Pepperstone for your Bitcoin exposure.' }
    ],
    commonMistakes: ['Keeping all your capital on an exchange', 'Trading with 100x leverage', 'FOMO (Fear Of Missing Out) after a big pump'],
    drawdownApproach: {
      text: 'Our AI Scanner tracks Bitcoin sentiment 24/7 to find high-probability setups.',
      link: '/tools/scanner',
      linkText: 'Check BTC Sentiment'
    },
    faqs: [
      { question: 'What is the best time to trade Bitcoin?', answer: 'Unlike Forex, Bitcoin is active 24/7, but the highest volume still occurs during the New York stock market hours.' }
    ]
  },
  {
    slug: 'use-leverage-safely',
    title: 'How to Use Leverage Safely — The Double-Edged Sword',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '12 min',
    metaDescription: 'Leverage is how you build wealth, and how you blow accounts. Learn the professional math of margin and effective leverage.',
    introduction: 'Leverage is simply a tool that allows you to control a large amount of money with a small amount of capital. Used correctly, it magnifies your edge. Used incorrectly, it is a mathematical certainty that you will go to zero.',
    steps: [
      { title: 'Distinguish Margin from Risk', content: 'Just because a broker gives you 30:1 leverage doesn\'t mean you should use it. Your "Risk" is determined by your stop-loss, not your leverage. Never risk more than 1% of your account regardless of leverage.' },
      { title: 'Calculate Your "Effective Leverage"', content: 'If you have £1,000 and control a £10,000 position, your effective leverage is 10:1. Professionals rarely exceed 5:1 effective leverage on their total account equity.' },
      { title: 'Always Have a Hard Stop', content: 'Leverage without a stop-loss is suicide. A small move against you can trigger a "Margin Call," where the broker closes your trades automatically at the worst possible price.' }
    ],
    commonMistakes: ['Trading with "Max" leverage to save money', 'Not understanding the "Margin Call" level', 'Ignoring the cost of leverage (swap rates)'],
    drawdownApproach: {
      text: 'Our Risk Calculator automatically calculates your required margin and leverage for every trade.',
      link: '/tools/risk-calculator',
      linkText: 'Calculate Your Risk'
    },
    faqs: [
      { question: 'Is high leverage bad?', answer: 'No, high leverage is actually safer because it requires less of your capital to be held by the broker. The "Bad" part is over-leveraging (trading too many lots).' }
    ]
  },
  {
    slug: 'create-trading-routine',
    title: 'How to Create a Winning Trading Routine',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '10 min',
    metaDescription: 'Trading is won before the market opens. Learn how to build a daily routine that ensures you are prepared, calm, and disciplined.',
    introduction: 'The difference between a gambler and a professional is their routine. If you sit down at your computer and start looking for trades immediately, you have already lost. You need a process that primes your brain for objective decision making.',
    steps: [
      { title: 'The Pre-Market Scan', content: 'Every morning at 7:30 AM GMT, check the economic calendar for "Red Folders." Scan your 10 favorite pairs and identify the "Key Levels" where you will take action.' },
      { title: 'The Psychological Check-In', content: 'Are you tired? Angry? Distracted? If you aren\'t at 100%, do not trade. Your "Session Quality" is more important than the number of trades you take.' },
      { title: 'The Post-Session Review', content: 'At the end of your session, journal every trade—even the ones you didn\'t take. What did you learn? Did you follow your rules? This is where the real growth happens.' }
    ],
    commonMistakes: ['Trading while working your 9-5 job', 'Skipping the weekend review', 'Not having a "Daily Stop" rule'],
    drawdownApproach: {
      text: 'Our Pre-Session Check-in tool helps you document your mindset before every trade.',
      link: '/dashboard/coach',
      linkText: 'Start Pre-Session Check-in'
    },
    faqs: [
      { question: 'How long should a routine take?', answer: 'A professional pre-market routine should take 30-45 minutes. Any less and you are guessing; any more and you are over-analyzing.' }
    ]
  },
  {
    slug: 'pay-trading-tax-uk',
    title: 'How to Pay Trading Tax in the UK — HMRC Guide',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '15 min',
    metaDescription: 'Don\'t let HMRC surprise you. Learn the difference between Spread Betting, CFDs, and Share Dealing taxes for UK residents.',
    introduction: 'If you are making money trading, you owe the taxman a cut. In the UK, how much you pay depends entirely on WHICH instrument you use. This guide simplifies the complex world of HMRC trading tax.',
    steps: [
      { title: 'Spread Betting: The Tax-Free Haven', content: 'Currently, spread betting is classified as "betting" and is exempt from Capital Gains Tax and Stamp Duty for individuals. This is the most tax-efficient way for UK retail traders to operate.' },
      { title: 'CFDs: Capital Gains Tax (CGT)', content: 'CFDs are subject to CGT (currently 10-20% depending on your bracket). The advantage is that you can "offset" your losses against other gains to reduce your overall tax bill.' },
      { title: 'Professional Status', content: 'If trading is your primary source of income and you trade with high frequency, HMRC may classify you as a "Trader" (Business), making you subject to Income Tax instead of CGT. This is a complex area—consult a specialist.' }
    ],
    commonMistakes: ['Not keeping records of your trades', 'Forgetting about the annual CGT allowance', 'Ignoring Stamp Duty on real UK share purchases'],
    drawdownApproach: {
      text: 'Our AI Trade Journal exports all your data in a format ready for your accountant.',
      link: '/tools/ai-trade-journal',
      linkText: 'Export Tax Data'
    },
    faqs: [
      { question: 'Do I need to report spread betting wins?', answer: 'Generally, no. Since it\'s tax-free, it doesn\'t need to be declared on a standard self-assessment, provided it is not your primary trade.' }
    ]
  },
  {
    slug: 'trade-indices',
    title: 'How to Trade Stock Indices (FTSE, S&P 500, DAX)',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '15 min',
    metaDescription: 'Learn how to trade global stock indices. A complete guide for UK traders on market hours, volatility, and the best strategies for index trading.',
    introduction: 'Trading indices allows you to speculate on the performance of an entire economy rather than a single company. This guide covers the mechanics and risks of index trading.',
    steps: [
      { title: 'Select Your Index', content: 'Each index has its own personality. The FTSE 100 is stable and dividend-heavy; the Nasdaq 100 is high-growth and volatile. Choose one that fits your risk profile.' },
      { title: 'Monitor Market Hours', content: 'Indices are most active during their local exchange hours. For the FTSE 100, this is 08:00 to 16:30 GMT. Trading outside these hours can lead to wider spreads.' },
      { title: 'Understand Weights', content: 'Indices are weighted. A big move in one or two major stocks (like Apple in the S&P 500) can move the entire index.' }
    ],
    commonMistakes: ['Ignoring correlation between indices', 'Trading during low-liquidity gaps'],
    drawdownApproach: {
      text: 'Our Market Scanner monitors all major indices for institutional volume spikes.',
      link: '/tools/ai-market-scanner',
      linkText: 'Scan Indices'
    },
    faqs: []
  },
  {
    slug: 'trade-commodities',
    title: 'How to Trade Commodities (Gold, Oil, Natural Gas)',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '18 min',
    metaDescription: 'Commodities are the raw materials of the global economy. Learn how to trade Gold, Oil, and Gas with this professional UK guide.',
    introduction: 'Commodity trading requires an understanding of global supply chains and geopolitical events. It is a high-reward, high-risk sector for active traders.',
    steps: [
      { title: 'Choose Your Commodity', content: 'Gold is a safe haven; Oil is a bet on global growth. Understand the fundamental drivers of the asset you choose.' },
      { title: 'Watch the US Dollar', content: 'Most commodities are priced in USD. A stronger Dollar usually makes commodities more expensive, leading to price declines.' },
      { title: 'Monitor Inventory Reports', content: 'For Oil and Gas, weekly inventory reports (like the EIA in the US) can cause massive, instantaneous price swings.' }
    ],
    commonMistakes: ['Over-leveraging on volatile oil moves', 'Ignoring the impact of seasonal demand'],
    drawdownApproach: {
      text: 'We provide real-time fundamental briefings for all major commodities.',
      link: '/tools/ai-daily-briefing',
      linkText: 'View Commodity Briefing'
    },
    faqs: []
  },
  {
    slug: 'use-fibonacci',
    title: 'How to Use Fibonacci Retracement Like a Pro',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '10 min',
    metaDescription: 'Master the Fibonacci tool. Learn how to identify hidden support and resistance levels to time your entries with institutional precision.',
    introduction: 'Fibonacci is a mathematical tool that reveals the "natural" retracement levels of a market trend. Professional traders use it to find value in an existing move.',
    steps: [
      { title: 'Identify the Trend', content: 'Fibonacci only works in a trending market. Find a clear move from a "Swing High" to a "Swing Low" (or vice versa).' },
      { title: 'Draw the Tool', content: 'Pull the tool from the start of the move to the end. Focus on the "Golden Zone" between 50% and 61.8%.' },
      { title: 'Wait for Confluence', content: 'Don\'t trade a Fib level in isolation. Look for a moving average or a previous support level to align with your Fib level.' }
    ],
    commonMistakes: ['Drawing the tool on a range-bound market', 'Using too many extension levels'],
    drawdownApproach: {
      text: 'Our charting tools automatically calculate institutional Fib levels.',
      link: '/tools/market-charts',
      linkText: 'Open Fibonacci Charts'
    },
    faqs: []
  },
  {
    slug: 'identify-trend',
    title: 'How to Identify a Market Trend (Uptrend vs Downtrend)',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '8 min',
    metaDescription: 'The trend is your friend. Learn the objective rules for identifying market direction using price action and moving averages.',
    introduction: 'Identifying the trend is the most basic yet most important skill in trading. If you are on the wrong side of the trend, the best entry in the world won\'t save you.',
    steps: [
      { title: 'Observe Market Structure', content: 'An uptrend is defined by Higher Highs and Higher Lows. A downtrend is defined by Lower Highs and Lower Lows.' },
      { title: 'Use a Filter (200 SMA)', content: 'If the price is above the 200-day Simple Moving Average, the long-term trend is bullish. If below, it is bearish.' },
      { title: 'Check Multiple Timeframes', content: 'A trend on the 15-minute chart might be a small correction on the Daily chart. Always align with the higher timeframe.' }
    ],
    commonMistakes: ['Trying to pick tops and bottoms', 'Ignoring the higher-timeframe trend'],
    drawdownApproach: {
      text: 'Our Trend Dashboard gives you a bird\'s-eye view of all market directions.',
      link: '/dashboard/pulse',
      linkText: 'Check Trends'
    },
    faqs: []
  },
  {
    slug: 'trade-breakouts',
    title: 'How to Trade Breakouts Safely (Avoid the Fakeout)',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '12 min',
    metaDescription: 'Breakouts offer high volatility and fast profits. Learn the professional strategy for entering breakouts while avoiding false signals.',
    introduction: 'Breakout trading is where big moves start, but it\'s also where most retail traders get "trapped." Learn how to identify high-probability breakouts.',
    steps: [
      { title: 'Identify a Range or Pattern', content: 'Look for a clear resistance or support level that has been tested at least 3 times. The tighter the range, the bigger the breakout.' },
      { title: 'Monitor Volume', content: 'A true breakout should be accompanied by a spike in volume. If price breaks out on low volume, it is likely a fakeout.' },
      { title: 'Wait for the Retest', content: 'The safest way to trade a breakout is to wait for price to return to the breakout level and confirm it as new support/resistance.' }
    ],
    commonMistakes: ['Entering before the candle closes', 'Placing stops too close to the breakout level'],
    drawdownApproach: {
      text: 'Our AI Scanner alerts you to volume-confirmed breakouts in real-time.',
      link: '/tools/ai-market-scanner',
      linkText: 'Find Breakouts'
    },
    faqs: []
  },
  {
    slug: 'trade-reversals',
    title: 'How to Trade Reversals (Catching the Turning Point)',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '14 min',
    metaDescription: 'Learn how to identify when a trend is ending. Master the reversal signals that professional traders use to enter at the very start of a new move.',
    introduction: 'Reversal trading is about identifying exhaustion in a trend. It offers the highest risk-to-reward ratios but requires extreme patience and precision.',
    steps: [
      { title: 'Look for Trend Exhaustion', content: 'Watch for signs like Divergence (Price making a higher high while RSI makes a lower high) or shrinking candle bodies.' },
      { title: 'Wait for a Structure Break', content: 'Do not sell an uptrend until the price makes a "Lower Low" on your timeframe of choice.' },
      { title: 'Identify a Reversal Pattern', content: 'Confirmation often comes in the form of a Head and Shoulders, Double Top, or a massive Engulfing Candle.' }
    ],
    commonMistakes: ['Fighting a strong trend too early', 'Ignoring higher-timeframe momentum'],
    drawdownApproach: {
      text: 'Our Reversal Dashboard monitors 50+ assets for institutional exhaustion signals.',
      link: '/dashboard/pulse',
      linkText: 'Scan for Reversals'
    },
    faqs: []
  },
  {
    slug: 'use-bollinger-bands',
    title: 'How to Use Bollinger Bands for Volatility Trading',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '11 min',
    metaDescription: 'Master the Bollinger Bands. Learn how to trade the "Squeeze" and identifying overextended markets with this professional guide.',
    introduction: 'Bollinger Bands are a volatility-based tool that help you identify when a market is quiet (the squeeze) or overextended (touching the bands).',
    steps: [
      { title: 'Identify the Squeeze', content: 'When the bands contract and become narrow, it signals low volatility. This is often the calm before a massive breakout.' },
      { title: 'Trade the Breakout', content: 'Enter in the direction of the candle that closes OUTSIDE the bands. Use the middle band (20 SMA) as your trailing stop.' },
      { title: 'Watch for Mean Reversion', content: 'In a range-bound market, the outer bands act as dynamic support and resistance. Sell at the top band, buy at the bottom.' }
    ],
    commonMistakes: ['Buying every touch of the upper band in a trend', 'Ignoring the slope of the bands'],
    drawdownApproach: {
      text: 'Our Charting Engine features custom Bollinger Band alerts for all timeframes.',
      link: '/tools/market-charts',
      linkText: 'Setup Band Alerts'
    },
    faqs: []
  },
  {
    slug: 'manage-multiple-positions',
    title: 'How to Manage Multiple Positions Without Stress',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '16 min',
    metaDescription: 'Scaling your trading requires managing multiple positions. Learn the professional workflow for tracking risk across a diverse portfolio.',
    introduction: 'Managing one trade is easy; managing five is a business. Learn how to track your total risk exposure and correlation across multiple markets.',
    steps: [
      { title: 'Calculate Total Account Risk', content: 'Ensure your total risk (the sum of all stops) does not exceed 5% of your account. Individual trades should still be 1% or less.' },
      { title: 'Check Correlation', content: 'If you are long EUR/USD and long GBP/USD, you are effectively double-exposed to the US Dollar. Treat them as one large position.' },
      { title: 'Use a Trade Journal', content: 'Log every entry and exit immediately. This keeps you focused on the plan rather than the floating profit/loss.' }
    ],
    commonMistakes: ['Over-exposure to a single currency', 'Getting overwhelmed by multiple alerts'],
    drawdownApproach: {
      text: 'The Drawdown Dashboard aggregates all your risk metrics into a single high-fidelity view.',
      link: '/dashboard/accounts',
      linkText: 'Manage Portfolio'
    },
    faqs: []
  },
  {
    slug: 'trade-part-time',
    title: 'How to Trade Part-Time While Working a Full-Time Job',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '13 min',
    metaDescription: 'You don\'t need to quit your job to trade. Learn the swing trading strategies that work for professionals with 9-to-5 commitments.',
    introduction: 'The most successful traders often start part-time. By removing the pressure to "make rent" from your trading, you can make more rational, objective decisions.',
    steps: [
      { title: 'Focus on Higher Timeframes', content: 'If you work a 9-to-5, ignore the 5-minute charts. Focus on the Daily and 4-Hour charts, which only require a few minutes of analysis per day.' },
      { title: 'Set Alerts, Not Orders', content: 'Use TradingView alerts to notify your phone when price hits a key level. This allows you to check the market only when something is actually happening.' },
      { title: 'Automate Your Exits', content: 'Always set your Stop Loss and Take Profit at the same time you enter. "Set and forget" is the best approach for part-time traders.' }
    ],
    commonMistakes: ['Trying to scalp during your lunch break', 'Overtiring yourself with late-night analysis'],
    drawdownApproach: {
      text: 'Our AI Briefing gives you a 2-minute summary of the market every morning before work.',
      link: '/tools/ai-daily-briefing',
      linkText: 'Get Morning Briefing'
    },
    faqs: []
  },
  {
    slug: 'build-trading-watchlist',
    title: 'How to Build a Professional Trading Watchlist',
    eyebrow: '// HOW-TO GUIDE',
    readingTime: '9 min',
    metaDescription: 'Stop chasing every move. Learn how to curate a high-probability watchlist of assets that fit your specific trading strategy.',
    introduction: 'A bloated watchlist leads to confusion. A professional watchlist is a curated list of assets that are currently showing the most potential for a setup.',
    steps: [
      { title: 'Filter for Liquidity', content: 'Only add assets that have high volume. This ensures tight spreads and reliable technical analysis. Avoid "exotic" pairs unless you have a specific reason.' },
      { title: 'Identify Assets with Setup Potential', content: 'Each weekend, scan 20-30 assets. Only move those that are approaching a major level or pattern to your "Active" list.' },
      { title: 'Refresh Daily', content: 'Remove assets that have invalidated their setup. A clean watchlist is a focused mind.' }
    ],
    commonMistakes: ['Keeping 50+ assets on a single list', 'Ignoring correlation between watchlist items'],
    drawdownApproach: {
      text: 'Our Global Pulse tool automatically highlights the 10 most "ready" assets every day.',
      link: '/dashboard/pulse',
      linkText: 'View Today\'s Watchlist'
    },
    faqs: []
  },

  // ─── Wave 2 How-To Guides ──────────────────────────────────────────────────

  {
    slug: 'how-to-open-a-trading-account-uk',
    title: 'How to Open Your First Trading Account in the UK',
    eyebrow: '// HOW-TO GUIDE',
    metaTitle: 'How to Open Your First Trading Account in the UK',
    dek: 'Everything that happens between deciding to start trading and placing your first trade, in order.',
    readingTime: '15–20 min',
    difficulty: 'Beginner',
    estimatedTime: '15–20 minutes',
    metaDescription: 'A step-by-step walkthrough of opening a UK trading account, from choosing a regulated broker to making your first deposit, in under 20 minutes.',
    introduction: 'Opening a trading account is more straightforward than most people expect, but the order in which you make the decisions matters. Choosing the platform before the broker, or the account type before you know what you want to trade, leads to friction later. This guide takes you through each step in the right sequence.',
    prerequisites: [
      'A government-issued photo ID (passport or driving licence)',
      'Proof of address dated within the last three months (utility bill or bank statement)',
      'A rough idea of which markets you want to trade — forex, indices, commodities, or stocks',
    ],
    steps: [
      {
        title: 'Decide what you want to trade first',
        content: 'Narrow down the market before picking a broker, because not every broker covers every market equally well. A broker with competitive spreads on forex may have limited commodity coverage. Decide whether you are starting with forex, indices, stocks, or commodities, and keep that answer in mind when comparing brokers in the next step. If you are genuinely unsure, forex and indices are covered by the widest range of UK-regulated retail brokers.',
      },
      {
        title: 'Choose a regulated broker',
        content: 'Check the broker\'s FCA authorisation status on the FCA Register (register.fca.org.uk) before anything else. This is non-negotiable: an unregulated broker removes all the client protections that UK regulation provides, including segregated client funds and negative balance protection. Once FCA status is confirmed, compare spreads on the instruments you want to trade, check which platforms they support (MT4, MT5, cTrader, or proprietary), and read recent independent reviews. The sign-up bonus is irrelevant to this comparison.',
      },
      {
        title: 'Complete identity verification',
        content: 'All UK-regulated brokers are required by anti-money laundering regulations to verify your identity before activating your account. Upload a clear photo or scan of your government-issued ID and a proof of address dated within the last three months. Most brokers process this automatically within a few hours during business hours; some take up to two business days. This step is a regulatory requirement, not bureaucracy for its own sake: it is what keeps client funds protected and the platform compliant.',
      },
      {
        title: 'Choose your account type',
        content: 'Most UK retail brokers offer two main live account types: a standard account (spread betting or CFD) and sometimes an ISA-wrapped account for eligible products. For forex and indices, spread betting is the most common structure for UK retail traders because profits are currently exempt from Capital Gains Tax. Choose a demo account first if you want to test the platform before committing real funds. You can run both simultaneously with most brokers.',
      },
      {
        title: 'Fund your account',
        content: 'Payment methods vary by broker: bank transfer, debit card, and sometimes PayPal or other e-wallets. Bank transfers are the most reliable for larger deposits and typically settle within one business day. Card deposits are faster but may have lower limits. Check the minimum deposit requirement before funding — most UK retail brokers set this between £100 and £500, though some have no minimum. Do not deposit more than you are genuinely prepared to lose while you are learning.',
      },
      {
        title: 'Set up your trading platform',
        content: 'Install or log in to the platform your broker offers. If they support MT4 or MT5, download the desktop application rather than relying on the web version for better reliability. Add the instruments you plan to trade to your watchlist, set your chart timeframes, and spend time navigating the interface before placing any real trades. If you are unfamiliar with the platform, use the demo account to explore order types — market orders, limit orders, stop losses — before going live.',
      },
      {
        title: 'Place a small test trade before committing real size',
        content: 'Before trading at your intended position size, place one trade at the minimum size your broker allows. This sense-checks the whole pipeline: the order is received, executed at the expected price, your position shows correctly, and you know how to close it. It also ensures your payment was processed and your funds are live. Once you have confirmed everything works, you can trade at the size your risk management framework calls for.',
      },
    ],
    commonMistakes: [
      'Choosing a broker based on the sign-up bonus rather than regulated status and instrument coverage',
      'Skipping identity verification documents and then waiting days for manual review',
      'Depositing full intended capital before testing the platform on demo',
      'Opening a live account without checking which account type (spread bet vs CFD) is more tax-efficient for your situation',
    ],
    drawdownApproach: {
      text: 'Drawdown\'s broker comparison covers only FCA-regulated brokers, with honest notes on spreads, platforms, and who each broker actually suits.',
      link: '/brokers',
      linkText: 'Compare regulated UK brokers',
    },
    faqs: [
      {
        question: 'How long does broker identity verification usually take?',
        answer: 'Most FCA-regulated brokers with automated verification systems process ID within a few hours during business hours. Manual reviews can take one to two business days. If you need a faster turnaround, check the broker\'s stated verification time before applying.',
      },
      {
        question: 'Can you open more than one trading account with different brokers?',
        answer: 'Yes. There is no regulatory restriction on holding accounts with multiple brokers simultaneously. Many traders maintain accounts at two or three brokers to access different instruments, platform preferences, or spread structures. Each account goes through the same identity verification process.',
      },
      {
        question: 'What is the minimum deposit at most UK-regulated brokers?',
        answer: 'Most major UK retail brokers set minimum deposits between £100 and £500. Some have no stated minimum. However, the minimum deposit required to open an account is different from the minimum capital required to trade responsibly. With a 1% risk rule and a typical stop loss, you need considerably more than £100 to place a position at a meaningful size without over-leveraging.',
      },
    ],
    nextStep: {
      label: 'Compare regulated UK brokers',
      href: '/brokers',
    },
    internalLinks: ['/brokers', '/basic/what-is-a-broker', '/basic/what-is-a-demo-account'],
  },

  {
    slug: 'how-to-choose-a-broker',
    title: 'How to Choose a Broker — A Step-by-Step Framework',
    eyebrow: '// HOW-TO GUIDE',
    metaTitle: 'How to Choose a Broker — A Step-by-Step Framework',
    dek: 'A repeatable checklist for comparing brokers properly, instead of picking whichever one has the loudest sign-up offer.',
    readingTime: '20–30 min',
    difficulty: 'Beginner',
    estimatedTime: '20–30 minutes of research',
    metaDescription: 'A practical framework for comparing UK brokers properly, covering regulation, costs, platform and support, instead of picking on bonus offers alone.',
    introduction: 'Most traders choose a broker based on whichever one they encounter first, which one has a compelling sign-up offer, or which one a YouTuber mentioned. None of those are useful signals. This framework gives you a repeatable process for comparing brokers on the factors that actually determine whether working with them is a good experience.',
    prerequisites: [
      'A clear idea of which markets you want to trade (forex, indices, stocks, or commodities)',
    ],
    steps: [
      {
        title: 'Confirm FCA regulation first — before anything else',
        content: 'Go to register.fca.org.uk and search for the broker by name. Confirm they are "Authorised" — not "Registered" or "Appointed Representative" alone. Check that the permissions listed include the activity you want to do (dealing in investments as principal or agent). An FCA-regulated broker provides segregated client funds, negative balance protection, FSCS eligibility, and enforceable conduct standards. Everything else in this framework sits behind this filter. If the broker is not on the FCA Register, stop here.',
      },
      {
        title: 'Compare the real cost of trading',
        content: 'The headline cost is the spread: the difference between the buy and sell price on any instrument. On EUR/USD, a 0.6-pip spread versus a 1.2-pip spread on a 1-lot position represents a real difference in cost per trade. Some brokers charge a commission per trade instead of, or in addition to, a spread. Compare the total round-trip cost (spread plus commission) across the instruments you plan to trade, not just the headline "zero commission" claim. Also check the overnight financing rate (swap rate), which applies to positions held past the daily rollover time. On longer trades this becomes a meaningful cost.',
      },
      {
        title: 'Check platform options',
        content: 'Confirm the broker actually supports the specific platform you want to use, not just any platform. If you want MT4, check they offer MT4 specifically — some brokers offer only MT5 or a proprietary platform and market this as equivalent. If you are committed to TradingView as your charting tool, check whether the broker supports TradingView integration for order execution, or whether you will be running two separate applications. Test the web and mobile version of the platform before opening an account, most brokers allow this on demo.',
      },
      {
        title: 'Test customer support before you need it',
        content: 'Send a pre-account question by chat or email before opening. Ask something specific: "Do you support MT4 for forex trading, and what are the typical spreads on GBP/USD during the London open?" The quality and speed of the response tells you more about support than any number of review site scores. If the answer is slow, vague, or clearly automated, that is the same support you will receive when your account has a real problem.',
      },
      {
        title: 'Read the withdrawal process, not just the deposit process',
        content: 'Deposits at brokers are almost always fast and easy. Withdrawals are where the friction shows up. Read the broker\'s withdrawal policy in their terms, not in their marketing. Check: what methods are available for withdrawal, whether withdrawals go back to the original payment source, what the processing time is, and whether there are any withdrawal fees. Reputable FCA-regulated brokers have straightforward withdrawal processes. Firms where withdrawals are slow or complicated without clear justification are a meaningful warning sign.',
      },
      {
        title: 'Check minimum deposit and account types against your starting capital',
        content: 'Confirm the minimum deposit for the account type you want. More importantly, confirm that the minimum position size on your chosen instruments allows you to apply your risk management framework at your actual account size. A broker with a £100 minimum deposit may have minimum position sizes that require over-leveraging at £100. Check the math: if you are risking 1% of your account per trade, what is the minimum lot or contract size available, and does that work at your starting capital?',
      },
      {
        title: 'Treat the sign-up bonus as irrelevant to the decision',
        content: 'Broker sign-up bonuses are a marketing cost, not a product feature. They are subject to terms that make them difficult or impossible to withdraw and are unrelated to whether the broker is competitively priced, well-regulated, or has good customer support. A broker that wins your business through a bonus offer rather than through the quality of the product is signalling something about where their priorities sit. Use the framework above instead.',
      },
    ],
    commonMistakes: [
      'Choosing a broker based on the sign-up bonus',
      'Not checking FCA authorisation status directly on the FCA Register',
      'Comparing headline spreads without accounting for overnight financing costs',
      'Not testing the platform on demo before opening a funded account',
    ],
    drawdownApproach: {
      text: 'Every broker in Drawdown\'s comparison has been checked for FCA authorisation, and the comparisons include typical spreads on common instruments alongside platform and withdrawal notes.',
      link: '/brokers',
      linkText: 'See our broker comparisons',
    },
    faqs: [
      {
        question: 'Is a larger, more well-known broker always safer than a smaller one?',
        answer: 'Not necessarily. Safety comes from FCA authorisation and the protections it requires, not from brand size. A smaller, fully FCA-authorised broker offers the same client money segregation and FSCS eligibility as a large one. That said, larger established brokers are less likely to face operational or liquidity issues. FCA regulation is the minimum check; the broker\'s track record and years of operation are useful secondary indicators.',
      },
      {
        question: 'What is the single biggest red flag when comparing brokers?',
        answer: 'Not appearing on the FCA Register as Authorised. Everything else can be worked around. Unregulated status cannot. After that, a withdrawal policy that is vague, slow, or discouraging is a strong warning sign that the broker\'s interests and the client\'s are not well aligned.',
      },
      {
        question: 'Should cost be the main factor in choosing a broker?',
        answer: 'Cost matters, but it is not the main factor. A marginally cheaper spread from an unregulated or poorly supported broker is not a good trade-off. The order of priority in this framework reflects what actually matters: regulation first, then cost, then platform, then support, then withdrawal process, then account mechanics. A broker that scores well across all six is the right choice, not the one that wins on any single factor.',
      },
    ],
    nextStep: {
      label: 'See our broker comparisons',
      href: '/brokers',
    },
    internalLinks: ['/brokers', '/basic/what-is-a-broker', '/blog/fca-regulation-explained'],
  },

  {
    slug: 'how-to-use-a-demo-account',
    title: 'How to Set Up and Use a Demo Account Properly',
    eyebrow: '// HOW-TO GUIDE',
    metaTitle: 'How to Set Up and Use a Demo Account Properly',
    dek: 'A demo account only teaches you anything if you use it like a live one. Here is how to actually do that.',
    readingTime: '10 min',
    difficulty: 'Beginner',
    estimatedTime: '10 minutes setup, ongoing use',
    metaDescription: 'A step-by-step guide to setting up a demo account and actually using it to build real skill, not just clicking buttons with fake money.',
    introduction: 'Most traders open a demo account, trade carelessly because the money is not real, feel good about their results, and then discover that live trading feels nothing like what they practised. The demo account only has value if you use it deliberately: same conditions, same rules, same discipline as you would apply to a live account.',
    prerequisites: [
      'A chosen broker or platform offering demo account functionality (most FCA-regulated retail brokers do)',
    ],
    steps: [
      {
        title: 'Choose a demo account that matches your intended live conditions',
        content: 'Where possible, use a demo account with the same broker you plan to trade live with, running the same platform (MT4, MT5, or proprietary). This means the interface, order types, and spread behaviour you practise on demo will match what you encounter live. If you use a generic demo from a different broker, the experience may diverge in small but meaningful ways. Also check that the demo account uses real-time market prices rather than simulated prices, which most reputable broker demos do.',
      },
      {
        title: 'Set a realistic virtual balance',
        content: 'Many broker demo accounts default to £100,000 or more in virtual funds. If you plan to start live trading with £2,000, set your demo balance to £2,000. This forces you to practise position sizing relative to your actual capital, rather than developing habits at a scale that will not transfer. A £100,000 demo balance makes every mistake painless in a way that £2,000 will not, and it teaches you nothing useful about managing real drawdown.',
      },
      {
        title: 'Apply the same position sizing rules you would use live',
        content: 'Decide on your risk percentage before your first demo trade and apply it to every trade without exception. If you plan to risk 1% of your account per trade, that means working out the lot size for each trade based on your stop loss distance and applying it consistently. Do not take larger positions "because it\'s demo." The point of this phase is to build the habit of calculating and applying position sizes correctly, not to discover whether your strategy works when you ignore risk management.',
      },
      {
        title: 'Use it to test mechanics, not to prove you have an edge',
        content: 'Two weeks of profitable demo trading is not evidence that your strategy works. It is evidence that your strategy can produce positive results in a specific recent market environment, without the psychological pressure of real money. Use the demo phase to get comfortable with the platform mechanics: placing market orders and limit orders, setting stop losses and take profits, and modifying positions. These are the things that will trip you up live if you have not practised them. The strategy validation comes later, over a larger sample, in conditions that include losing periods.',
      },
      {
        title: 'Journal demo trades the same way you would journal live trades',
        content: 'Record every demo trade before you take it: the setup, the entry price, the stop loss, the take profit, the position size, and why you are taking the trade. Record the outcome. Review your notes weekly and look for patterns in what you followed and what you deviated from. Building the journalling habit on demo costs nothing. Discovering you lack the habit on live, when the cost of each deviation is real, costs considerably more.',
      },
      {
        title: 'Set a defined exit point for the demo phase before you start',
        content: 'Do not leave your demo phase open-ended. Decide on a consistency-based target before you start: for example, 100 trades logged and reviewed, positive return over 8 consecutive weeks, and 90% plan adherence on recorded trades. These are conditions you can check against, unlike "until I feel ready," which tends to resolve either through impatience or anxiety rather than through evidence. When you hit all three conditions, you have a basis for switching that is evidence-based rather than emotional.',
      },
      {
        title: 'Review demo performance honestly before going live',
        content: 'Before switching to a live account, review your trade journal for the demo period. What mistakes showed up consistently? Were any trades taken outside the plan? Were there losing periods, and how did you respond to them? If the review shows that your plan adherence was high and your results were consistent, you have a basis for the switch. If it shows significant deviations or emotional responses to losses, those will be worse on live, not better. Fix them on demo before they cost real capital.',
      },
    ],
    commonMistakes: [
      'Setting an unrealistically large demo balance that does not match intended live capital',
      'Trading carelessly because the money is not real, then expecting live performance to match demo',
      'Using demo to practise a strategy without journalling, then having no data to review before going live',
      'Switching to live because of boredom or impatience rather than meeting a defined consistency target',
    ],
    drawdownApproach: {
      text: 'The Drawdown AI Trade Journal works for both demo and live accounts. Log your demo trades now, review the data, and use it to time your switch to live with evidence rather than feeling.',
      link: '/tools/ai-trade-journal',
      linkText: 'Start logging trades for free',
    },
    faqs: [
      {
        question: 'Should demo account position sizing match what you would use live?',
        answer: 'Yes. Position sizing on demo should match what you intend to use live, calculated against a demo balance that matches your intended live starting capital. The purpose of demo is to build habits that transfer. If position sizing on demo bears no relation to what you will do live, you are not building a transferable habit — you are playing with a simulator.',
      },
      {
        question: 'Do demo accounts use real, live market prices?',
        answer: 'Most demo accounts at FCA-regulated retail brokers use live market prices. Some may have small differences in spreads or slippage behaviour compared to live accounts. This is worth checking with your specific broker before assuming demo conditions are perfectly representative of live conditions.',
      },
      {
        question: 'How do you actually know when to stop using a demo account and go live?',
        answer: 'By meeting a defined, pre-agreed consistency target rather than feeling ready. A reasonable target is 100 or more trades logged, a positive return across at least 8 weeks of demo trading, and plan adherence of 90% or more on recorded trades. When all three conditions are met, you have evidence to support the switch. When they are not, remaining on demo is the correct decision regardless of how you feel about it.',
      },
    ],
    nextStep: {
      label: 'Start free — no card required',
      href: '/signup',
    },
    internalLinks: ['/basic/what-is-a-demo-account', '/tools/ai-trade-journal', '/signup'],
  },

  {
    slug: 'how-to-read-a-candlestick-chart',
    title: 'How to Read Your First Candlestick Chart',
    eyebrow: '// HOW-TO GUIDE',
    metaTitle: 'How to Read Your First Candlestick Chart',
    dek: 'Every candle on a chart is telling you a short, specific story. Here is how to actually read it.',
    readingTime: '15 min',
    difficulty: 'Beginner',
    estimatedTime: '15 minutes',
    metaDescription: 'A step-by-step beginner\'s guide to reading candlestick charts, covering what each candle shows and how to read basic price action at a glance.',
    introduction: 'A candlestick chart is the standard way professional traders look at price data. Each candle represents a fixed period of time — one minute, one hour, one day — and shows four pieces of information at once: where the price started, where it finished, the highest point it reached, and the lowest point it reached. Once you know how to read a single candle, you can read any chart.',
    prerequisites: [
      'Access to any charting platform — TradingView (free at tradingview.com) is recommended for beginners',
    ],
    steps: [
      {
        title: 'Understand what a single candle represents',
        content: 'Each candle on a candlestick chart represents one unit of time — a minute, an hour, a day, or any other timeframe you select. During that time period, the price of the instrument moved. The candle records four data points: the opening price (where price was at the start of the period), the closing price (where price was at the end of the period), the high (the highest price reached during the period), and the low (the lowest price reached during the period). All four data points are visible in a single candle. This is what makes candlestick charts more information-dense than a simple line chart, which only shows the closing price.',
      },
      {
        title: 'Read the body and the wicks separately',
        content: 'The wide rectangular section of a candle is called the body. The body shows the range between the opening price and the closing price — it represents what happened over the majority of the period. The thin lines extending above and below the body are called wicks (or shadows). The upper wick extends from the top of the body up to the highest price reached during the period. The lower wick extends from the bottom of the body down to the lowest price reached. A long wick tells you the price moved significantly in that direction during the period but did not close there — the market rejected that extreme. A candle with no wicks means the opening and closing prices were also the high and low of the period.',
      },
      {
        title: 'Tell a bullish candle from a bearish candle at a glance',
        content: 'If the closing price is higher than the opening price, the candle is bullish: price moved up during that period. By convention on most platforms, bullish candles are shown in green (or sometimes white or hollow). If the closing price is lower than the opening price, the candle is bearish: price moved down during that period. Bearish candles are typically shown in red (or sometimes black or filled). The colour convention can vary by platform — what matters is which end of the body is the open and which is the close. On most platforms you can customise candle colours, but the default green/red scheme is widely used.',
      },
      {
        title: 'Change the timeframe and watch the same price action look different',
        content: 'In TradingView, click the timeframe selector at the top of the chart. Switch between a 1-minute chart and a daily chart on the same instrument. Notice that what appears as a long bullish candle on the daily chart is made up of hundreds of smaller candles on the 1-minute chart, some of them bearish. This is an important early intuition: the same price action looks different depending on the timeframe you are viewing. Higher timeframes (daily, weekly) show the broader structure. Lower timeframes (1-minute, 5-minute) show granular movement within that structure. Most traders analyse multiple timeframes before making a decision.',
      },
      {
        title: 'Spot a few basic single-candle patterns',
        content: 'At this stage, focus on two patterns. A doji is a candle where the opening and closing price are very close together, producing a tiny body with wicks on both sides. It suggests indecision: neither buyers nor sellers dominated that period. A strong bullish or bearish candle has a large body and short or no wicks, suggesting one side controlled the entire period. Do not attempt to memorise every named candlestick pattern — there are dozens, and most are only reliable in specific contexts. These two are sufficient to begin building chart reading intuition. Patterns matter less than the context they appear in.',
      },
      {
        title: 'Read a short sequence of candles together',
        content: 'Zoom out on your chart until you can see 20 to 30 candles clearly. Look for price areas where the candles have clustered, reversed, or stopped moving: these are support and resistance areas. A price level where several candles have wicks pointing down (price reached that level but closed higher) is a support area — buyers have responded at that level repeatedly. A price level where candles have wicks pointing up is a resistance area. You do not need to understand every candle individually to identify these zones. You are looking at the shape of the sequence, not dissecting each candle in isolation.',
      },
      {
        title: 'Practise on a real chart before moving on',
        content: 'Open TradingView and select any major forex pair or index (GBP/USD or the FTSE 100 are good starting points). Set the chart to a daily timeframe. Narrate the last five candles to yourself: is each one bullish or bearish, where are the wicks relative to the body, and what does that sequence of five candles suggest about what buyers and sellers were doing? Do this for five minutes without reading anything else. Active narration of charts is how the skill becomes intuitive — passive looking does not build the same pattern recognition.',
      },
    ],
    commonMistakes: [
      'Memorising pattern names before understanding what the open, high, low, and close actually represent',
      'Only reading one timeframe and missing the broader price structure',
      'Treating candle patterns as signals in isolation without considering the surrounding context',
      'Looking at charts passively rather than actively narrating what is happening',
    ],
    drawdownApproach: {
      text: 'The Drawdown curriculum builds chart reading as a foundation in Phase 1 — Chart Reader. Technical Analysis goes deeper into structure, support, resistance, and timeframe alignment.',
      link: '/learn-to-trade/technical-analysis',
      linkText: 'Go deeper on chart reading',
    },
    faqs: [
      {
        question: 'Why are candlestick charts more popular than simple line charts?',
        answer: 'A line chart only shows the closing price for each period. A candlestick shows four data points: open, high, low, and close. This gives you information about where price started, how far it moved in both directions, and where it ended up — all in a single visual element. That additional information is useful for identifying areas where price has reversed, rejected, or consolidated.',
      },
      {
        question: 'Does candle colour mean the same thing on every platform?',
        answer: 'Not necessarily. The convention of green for bullish and red for bearish is the most common default, but it can be customised on most platforms. Some traders use white/black as an alternative. The colour itself is not the information — the relationship between the opening and closing price is. Always confirm which colour represents bullish and which represents bearish on any platform you use, particularly if you have customised the settings.',
      },
      {
        question: 'Do you need to memorise every candlestick pattern that exists?',
        answer: 'No. There are dozens of named candlestick patterns, most of which offer marginal predictive value on their own. Understanding what the body and wicks tell you about the relationship between buyers and sellers during a period is more useful than memorising pattern names. A few patterns — the doji, the engulfing candle, the pin bar — appear in commonly traded setups and are worth understanding in context. The rest can wait until you have a solid grasp of why price moves, which is more important than what the individual candles are called.',
      },
    ],
    nextStep: {
      label: 'Go deeper on chart reading',
      href: '/learn-to-trade/technical-analysis',
    },
    internalLinks: ['/learn-to-trade/technical-analysis', '/blog/support-and-resistance-explained'],
  },
];

