export interface TradingViewGuide {
  slug: string;
  title: string;
  eyebrow: string;
  lastUpdated: string;
  metaDescription: string;
  introduction: string;
  sections: {
    title: string;
    content: string;
  }[];
  tips: string[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export const TRADINGVIEW_GUIDES: TradingViewGuide[] = [
  {
    slug: 'getting-started',
    title: 'TradingView Getting Started Guide — 2026 Masterclass',
    eyebrow: '// PLATFORM GUIDE',
    lastUpdated: '2026-04-30',
    metaDescription: 'Master TradingView from scratch. Learn how to set up your charts, use essential shortcuts, and customize your workspace for professional trading.',
    introduction: 'TradingView is the world\'s most powerful charting platform. Whether you are a beginner or a pro, setting up your workspace correctly is the first step to clarity. This guide takes you from opening your first chart to a fully optimized trading station.',
    sections: [
      {
        title: '1. Setting Up Your Layout',
        content: 'The first thing you should do is clean up the clutter. Hide the watchlist on the right if you don\'t need it, and use the "Chart Settings" (cog icon) to customize your colors. We recommend a high-contrast dark theme to reduce eye strain during long sessions.'
      },
      {
        title: '2. Essential Shortcuts',
        content: 'Speed is everything. Use "Alt+P" for percentage view, "Alt+H" for horizontal lines, and simply type a number (e.g., "15") to instantly switch timeframes. Mastering these will save you hours of clicking.'
      },
      {
        title: '3. Connecting Your Broker',
        content: 'You don\'t need to switch apps to trade. Use the "Trading Panel" at the bottom to link brokers like Pepperstone or IG directly. This allows for one-tap execution from your charts.'
      }
    ],
    tips: [
      'Use the Favorites bar for your most-used tools.',
      'Sync your layouts across mobile and desktop.',
      'Always use the "Lock" feature on your drawings.'
    ],
    faqs: [
      {
        question: 'Is TradingView free?',
        answer: 'Yes, the basic version is free. However, for multiple charts per tab and advanced volume profile tools, a Pro or Premium subscription is recommended.'
      }
    ]
  },
  {
    slug: 'best-indicators',
    title: 'The Best TradingView Indicators — Professional Picks 2026',
    eyebrow: '// PLATFORM GUIDE',
    lastUpdated: '2026-04-30',
    metaDescription: 'Stop using laggy indicators. Discover the best TradingView indicators, from the Volume Profile to community-built Pine Script legends.',
    introduction: 'The TradingView library has over 100,000 indicators. 99% of them are noise. This guide highlights the professional-grade tools that actually provide an edge.',
    sections: [
      {
        title: '1. Volume Profile (Fixed & Anchorable)',
        content: 'This is the most powerful tool in the library. It shows you WHERE volume was traded at specific price levels, revealing institutional "Fair Value" and high-liquidity zones.'
      },
      {
        title: '2. VWAP (Volume Weighted Average Price)',
        content: 'Essential for intraday traders. It provides a real-time anchor for market value and trend direction.'
      },
      {
        title: '3. Community Scripts',
        content: 'Look for indicators with high "Boosts" and open-source Pine Script. Some of the best tools for sentiment and seasonality are built by the community.'
      }
    ],
    tips: [
      'Don\'t use more than 3 indicators at once.',
      'The best indicators are often the simplest ones.',
      'Always understand the math behind the tool.'
    ],
    faqs: []
  },
  {
    slug: 'pine-script-basics',
    title: 'Pine Script Basics — Build Your Own TradingView Indicators',
    eyebrow: '// PLATFORM GUIDE',
    lastUpdated: '2026-04-30',
    metaDescription: 'Learn the fundamentals of Pine Script. Build your own indicators, backtest strategies, and automate your alerts with our beginner-friendly guide.',
    introduction: 'Pine Script is TradingView\'s proprietary coding language. It is designed to be easy to learn even if you have zero coding experience. Building your own tools is the ultimate way to standardize your edge.',
    sections: [
      {
        title: '1. The Pine Editor',
        content: 'Located at the bottom of your chart, the Pine Editor is where the magic happens. Every indicator starts with a `version` and an `indicator` (or `strategy`) declaration.'
      },
      {
        title: '2. Variables and Inputs',
        content: 'Learn how to create user-adjustable settings using the `input()` function. This allows you to change parameters (like length or color) without touching the code.'
      },
      {
        title: '3. Plotting and Alerts',
        content: 'The `plot()` function puts your data on the chart. Once your logic is built, use `alertcondition()` to send notifications to your phone or email.'
      }
    ],
    tips: [
      'Start by "studying" the source code of existing built-in indicators.',
      'Use the Pine Script reference manual (accessible via the editor).',
      'Always test your scripts on historical data first.'
    ],
    faqs: []
  },
  {
    slug: 'alerts',
    title: 'TradingView Alerts Masterclass — Never Miss a Trade Again',
    eyebrow: '// PLATFORM GUIDE',
    lastUpdated: '2026-04-30',
    metaDescription: 'Master the TradingView alert system. Learn how to set dynamic price alerts, indicator triggers, and webhook automation for 24/7 market monitoring.',
    introduction: 'The biggest mistake traders make is staring at charts all day. Professional traders set alerts and only interact with the market when their conditions are met.',
    sections: [
      {
        title: '1. Price and Trendline Alerts',
        content: 'Right-click any price level or trendline to set an alert. You can choose "Crossing," "Entering," or "Exiting" to filter for specific price action.'
      },
      {
        title: '2. Indicator Alerts',
        content: 'You can set alerts on almost any indicator. For example, "Alert me when RSI crosses below 30" or "Alert when the 50 EMA crosses the 200 EMA."'
      },
      {
        title: '3. Webhooks and Automation',
        content: 'For advanced users, webhooks allow you to send your TradingView alerts to external apps like Discord, Telegram, or even an automated execution bot.'
      }
    ],
    tips: [
      'Name your alerts clearly so you know exactly what happened when your phone pings.',
      'Set "Once Per Bar Close" for alerts that require a candle to finish.',
      'Use the "Alerts Log" to review missed opportunities.'
    ],
    faqs: []
  },
  {
    slug: 'mobile-app-trading',
    title: 'TradingView Mobile Mastery — Trading From Your Phone',
    eyebrow: '// PLATFORM GUIDE',
    lastUpdated: '2026-04-30',
    metaDescription: 'Don\'t let being away from your desk stop you. Learn how to optimize the TradingView mobile app for professional chart analysis and execution.',
    introduction: 'The TradingView mobile app is surprisingly powerful, but it requires a different approach than the desktop version. This guide shows you how to sync your layouts and manage trades on the go.',
    sections: [
      {
        title: '1. Syncing Layouts',
        content: 'Any drawing you make on your desktop will instantly appear on your mobile app if you are using the same layout name. This allows you to do the "heavy lifting" analysis at home and monitoring on the train.'
      },
      {
        title: '2. Mobile-Specific Shortcuts',
        content: 'Learn how to use haptic touch for precise price selection and the "Object Tree" to manage complex drawings on a small screen.'
      }
    ],
    tips: [
      'Use "Price Alerts" instead of staring at the mobile chart.',
      'Enable "Biometric Login" for faster trade execution.'
    ],
    faqs: []
  },
  {
    slug: 'paper-trading',
    title: 'TradingView Paper Trading — The Risk-Free Training Ground',
    eyebrow: '// PLATFORM GUIDE',
    lastUpdated: '2026-04-30',
    metaDescription: 'Learn how to use TradingView\'s built-in paper trading simulator to practice your strategies with fake money before risking real capital.',
    introduction: 'Paper trading is the bridge between learning a strategy and risking your hard-earned money. TradingView provides a high-fidelity simulator that mimics real market conditions perfectly.',
    sections: [
      {
        title: '1. Setting Up Your Paper Account',
        content: 'Open the "Trading Panel" at the bottom and select "Paper Trading by TradingView." You can reset your balance to any amount to match your real-world starting capital.'
      },
      {
        title: '2. Realistic Execution',
        content: 'The simulator includes spreads and commissions, allowing you to see if your strategy is actually profitable after costs. This is the only way to build true confidence.'
      }
    ],
    tips: [
      'Treat the fake money as if it were real to build psychological discipline.',
      'Journal your paper trades exactly like real ones.'
    ],
    faqs: []
  }
];
