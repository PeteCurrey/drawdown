export interface StatCalloutBlock {
  type: 'statCallout';
  stat: string;
  context: string;
  source?: string;
}

export interface TradeExampleBlock {
  type: 'tradeExample';
  title: string;
  instrument: string;
  session: string;
  entry: string;
  stopLoss: string;
  takeProfit: string;
  riskReward: string;
  accountSize?: string;
  riskPercent?: string;
  positionSize?: string;
  result: string;
  isProfit?: boolean;
}

export interface ProTipBlock {
  type: 'proTip';
  tip: string;
}

export interface RiskWarningBlock {
  type: 'riskWarning';
  message?: string;
}

export interface BrokerCardBlock {
  type: 'brokerCard';
  brokerSlug: string;
  brokerName: string;
  bestFor: string;
  regulation: string;
  affiliateSlug: string;
  stat?: string;
}

export interface ToolCardBlock {
  type: 'toolCard';
  toolSlug: string;
  toolName: string;
  description: string;
  features: string[];
  tier: string;
}

export type RichBlock =
  | StatCalloutBlock
  | TradeExampleBlock
  | ProTipBlock
  | RiskWarningBlock
  | BrokerCardBlock
  | ToolCardBlock;

export interface ContentSection {
  heading: string;
  text: string;
  bullets?: string[];
  richBlocks?: RichBlock[];
}

export interface LearnTopic {
  slug: string;
  title: string;
  description: string;
  subtitle?: string;
  category: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  timeToLearn?: string;
  riskLevel?: 'Low' | 'Medium' | 'High' | 'Very High';
  heroImage: string;
  content: ContentSection[];
  honestReality?: string;
  faqs: {
    question: string;
    answer: string;
  }[];
  metaTitle: string;
  metaDescription: string;
  relatedModules?: { href: string; title: string; description: string }[];
}

export const LEARN_TOPICS: LearnTopic[] = [
    {
    slug: "day-trading",
    title: "Day Trading",
    subtitle: "The reality of intraday execution. No Lamborghinis. No signal groups. Just process, risk management, and statistical edge.",
    description: "Master the highest-intensity trading environment. Learn how to navigate the London Open, manage intraday volatility, and treat day trading like a mechanical business rather than a casino.",
    category: "Strategy",
    difficulty: "Advanced",
    timeToLearn: "12-24 months",
    riskLevel: "Very High",
    heroImage: "/images/learn/day-trading.jpg",
    metaTitle: "Day Trading Guide UK 2026 | The Institutional Path | Drawdown",
    metaDescription: "Learn to day trade the UK markets without the guru fluff. Master the London Open, manage risk like a professional, and build a profitable edge.",
    honestReality: "The internet will tell you that day trading is a path to quick wealth. The honest reality is that 90% of day traders fail within 90 days. It takes a minimum of 12 to 24 months of consistent, disciplined practice to achieve profitability. You will not get rich this week. You will blow an account. But if you survive the learning curve, build a strict mechanical edge, and treat it like a data-driven business, it is a highly scalable profession. Stop looking for shortcuts.",
    content: [
      {
        heading: "What Day Trading Actually Is",
        text: "Day trading involves opening and closing financial positions within the same trading day. Unlike swing trading or investing, a day trader never holds a position overnight. The primary objective is to exploit small, highly liquid price movements during the most volatile hours of the day.\n\nRetail traders often view day trading as a fast-paced adrenaline rush. Professional day traders view it as incredibly boring. It is the repetitive execution of a strictly defined edge over hundreds of trades. The goal is not to 'make a killing' on a single trade, but to capture small, consistent percentage gains that compound over time.\n\nThe biggest advantage of day trading is the elimination of 'overnight risk.' Because you close all positions before the market closes, you are completely immune to catastrophic news events that happen while you are asleep. If a major geopolitical crisis breaks out on a Saturday, a day trader's capital is safely sitting in cash, while swing traders wake up on Monday morning to massive, unpreventable losses.",
        richBlocks: [
          {
            type: 'proTip',
            tip: 'If you feel adrenaline while in a trade, your position size is too big. Trading should feel like data entry. It should be entirely mechanical and devoid of emotion.'
          } as ProTipBlock
        ]
      },
      {
        heading: "The London Session — Your Home Advantage",
        text: "The financial markets are active 24/5, but they are not created equal. The most critical advantage a UK-based trader has is geography. The London session is the undisputed center of global foreign exchange trading, accounting for over 40% of all daily FX volume. \n\nThe London Open (8:00 AM GMT) provides the massive injection of institutional liquidity required for clean, directional price action. When the New York session opens at 1:00 PM GMT, creating the 'London/New York Overlap,' the market reaches its absolute peak volume.\n\nYou do not need to sit in front of the charts for 12 hours a day. The highest probability setups occur specifically during the first two hours of the London Open, and the first two hours of the New York Open. If you can dedicate 2-3 focused hours a day during these specific windows, you have access to the cleanest price action in the world.\n\nTrading outside of these high-volume windows (such as the late Asian session) often results in 'choppy,' unpredictable price action where technical setups fail due to a lack of institutional momentum.",
        bullets: [
          "London Open (8:00 AM GMT): Highest volatility, ideal for breakout and momentum strategies.",
          "London/NY Overlap (1:00 PM - 4:00 PM GMT): Maximum liquidity, ideal for trading major US economic data.",
          "Asian Session: Lower volume, best avoided by beginner day traders looking for large directional moves."
        ]
      },
      {
        heading: "UK-Specific Advantages: The Structural Edge",
        text: "Trading in the UK provides massive structural advantages over traders in the US or Europe. If you are serious about day trading, you must utilize these domestic benefits.\n\nFirst is the tax structure. Under current HMRC regulations, profits made from Spread Betting are classified as gambling, making them completely exempt from Capital Gains Tax (CGT) and Stamp Duty. This means you keep 100% of your profits. Conversely, trading via CFDs or traditional shares subjects you to CGT.\n\nSecond is the absence of the Pattern Day Trader (PDT) rule. In the United States, traders with under $25,000 in their account are legally restricted from taking more than three day trades in a five-day period. In the UK, there is no PDT rule. You can execute 50 trades a day on a £500 account if you wish.\n\nFinally, there is the Financial Services Compensation Scheme (FSCS). If you trade with an FCA-regulated broker, your capital is protected up to £85,000 if the broker goes bankrupt. This is a massive layer of security that offshore, unregulated brokers cannot provide.",
        richBlocks: [
          {
            type: 'riskWarning',
            title: 'HMRC and Spread Betting',
            warning: 'While spread betting is currently tax-free, this is only true if it is not your primary source of income. If you trade full-time and have no other income, HMRC may classify you as a professional, making your profits taxable. Always consult a tax professional.'
          } as RiskWarningBlock
        ]
      },
      {
        heading: "What You Actually Need to Start",
        text: "You do not need six monitors and a Bloomberg terminal to be a profitable day trader. You need three things: capital you can afford to lose, a fast execution platform, and a rigid data-collection system.\n\nCapital: Do not start day trading with money you need for rent or groceries. The psychological pressure of 'needing' to make money will force you to take terrible trades. Start with a small amount of risk capital, or better yet, use a demo account for the first 6 months to prove you have a statistical edge before risking real money.\n\nExecution: You need a broker with Direct Market Access (DMA) or an ECN model that provides 'raw spreads.' In day trading, you are fighting for pips. If your broker has a 2-pip spread on EUR/USD, you are starting every trade heavily in the negative. You need spreads of 0.0 to 0.2 pips with a small fixed commission per lot.\n\nData Collection: This is what separates the professionals from the gamblers. You must use a digital trade journal (like TradeZella or a custom spreadsheet) to track every single entry, exit, win rate, and drawdown. You cannot improve what you do not measure.",
        richBlocks: [
          {
            type: 'toolCard',
            toolSlug: 'tradingview',
            toolName: 'TradingView',
            description: 'The industry standard for charting. Clean UI, custom alerts, and essential for multi-timeframe analysis.',
            features: ['Cloud charting', 'Server-side alerts', 'Volume profile'],
            tier: 'Pro/Premium Recommended'
          } as ToolCardBlock
        ]
      },
      {
        heading: "Risk Management: The Only Rule That Matters",
        text: "Risk management is the only thing standing between you and a blown account. The market is an inherently chaotic environment; you cannot control what the price will do next. The only thing you can absolutely control is how much money you lose when you are wrong.\n\nThe golden rule of institutional trading is the 1% Rule. You must never risk more than 1% of your total account equity on any single trade. If you have a £10,000 account, your maximum acceptable loss per trade is £100.\n\nBy risking only 1%, you guarantee your survival. Even if you hit a terrible losing streak and lose 10 trades in a row, you have only lost roughly 10% of your account. You live to trade another day. Retail traders who risk 10% or 20% per trade will inevitably blow their entire account during their first normal drawdown period.",
        richBlocks: [
          {
            type: 'tradeExample',
            title: 'Mathematical Position Sizing',
            instrument: 'GBP/USD',
            session: 'London Open',
            entry: '1.2500',
            stopLoss: '1.2480 (20 Pips Risk)',
            takeProfit: '1.2540 (40 Pips Reward)',
            riskReward: '1:2',
            accountSize: '£5,000',
            riskPercent: '1% (£50 maximum loss)',
            positionSize: '£2.50 per pip (Spread Betting)',
            result: '+£100 Profit',
            isProfit: true
          } as TradeExampleBlock
        ]
      },
      {
        heading: "The Three Day Trading Setups That Actually Work",
        text: "To succeed in day trading, you do not need to know 50 different strategies. You only need to master one or two high-probability setups and execute them flawlessly. The following three setups are the foundation of institutional retail trading.\n\n1. The Liquidity Sweep: This occurs when price approaches a highly obvious support or resistance level (where retail traders have placed their stop-losses). The institutions drive the price quickly through the level, trigger the stops (absorbing the liquidity), and immediately reverse the price. You enter on the reversal back inside the range, placing your stop tightly behind the newly created wick.\n\n2. The Break and Retest: When a major market structure level is broken with high volume, do not chase the breakout. Wait for the inevitable 'pullback' or 'retest' of that broken level. What was once resistance becomes support. Enter on the retest, using a lower-timeframe confirmation (like an engulfing candle) to validate the entry.\n\n3. The Session Open Momentum Trade: This is specifically traded at 8:00 AM London Open or 1:00 PM NY Open. You identify the consolidation range that formed during the quiet Asian session. As London volume hits the market, price will aggressively break out of this range. You trade in the direction of the initial high-volume institutional push.",
        bullets: [
          "Never trade the initial breakout; always wait for the retest or the sweep.",
          "Volume is the ultimate validator. A breakout with low volume is a trap.",
          "Pick ONE of these three setups and master it. Ignore everything else."
        ]
      },
      {
        heading: "The Most Common Day Trading Mistakes",
        text: "The reason 90% of day traders fail is because human psychology is biologically wired to do the exact opposite of what profitable trading requires. \n\nThe most destructive mistake is 'Revenge Trading.' This occurs immediately after taking a painful loss. Instead of accepting the loss as a business expense, the trader gets angry and immediately re-enters the market with double the size, desperate to win their money back. This is how accounts are blown in a single afternoon.\n\nThe second major mistake is 'Over-Trading.' Because day trading is fast-paced, beginners feel the need to always be in a trade. If you take 10 trades a day, you are almost certainly forcing sub-par setups. A professional day trader might only take 2 or 3 extremely high-quality setups per week.\n\nFinally, there is the failure to use a hard stop-loss. Mental stop-losses do not work. When the price hits your mental stop, your ego will convince you to 'give it just a little more room to breathe.' A hard stop-loss removes the decision-making process entirely.",
        richBlocks: [
          {
            type: 'statCallout',
            stat: '80%',
            context: 'of day trading success is entirely psychological. Your ability to execute your plan perfectly after three consecutive losses is what separates the amateur from the professional.',
          } as StatCalloutBlock
        ]
      },
      {
        heading: "Choosing the Right UK Broker",
        text: "If you are day trading, your broker is your most critical business partner. You cannot trade effectively if your broker has massive slippage, wide spreads, or freezes during high-impact news events.\n\nFor UK day traders, we recommend FCA-regulated brokers that offer 'raw spread' accounts or tight spread betting options. You want a broker that uses an ECN (Electronic Communication Network) execution model, which routes your orders directly to tier-1 liquidity providers rather than taking the other side of your trade (B-Booking).\n\nAlways verify that the broker is fully regulated by the Financial Conduct Authority (FCA). This ensures your funds are segregated from the broker's operating capital and protects you under the FSCS framework.",
        richBlocks: [
          {
            type: 'brokerCard',
            brokerSlug: 'pepperstone',
            brokerName: 'Pepperstone',
            bestFor: 'Best for raw spreads and instant execution',
            regulation: 'FCA Regulated',
            affiliateSlug: 'pepperstone',
            stat: 'Razor account features 0.0 pip minimum spreads'
          } as BrokerCardBlock,
          {
            type: 'brokerCard',
            brokerSlug: 'ig',
            brokerName: 'IG Markets',
            bestFor: 'Best for advanced UK spread betting',
            regulation: 'FCA Regulated',
            affiliateSlug: 'ig',
            stat: 'Largest spread betting provider in the UK'
          } as BrokerCardBlock
        ]
      }
    ],
    faqs: [
      {
        question: "How much money do I need to start day trading in the UK?",
        answer: "You can open an account with as little as £100, but to trade safely with proper risk management (risking only 1% per trade), a starting balance of £1,000 to £5,000 is highly recommended. Spread betting allows for very small stake sizes (e.g., £0.50 per point), which makes small accounts viable if you are strict with your risk."
      },
      {
        question: "How long does it realistically take to become profitable?",
        answer: "The honest timeline is 12 to 24 months. The first 6 months are spent losing money and learning the mechanics. The next 6 months are spent breaking even and learning emotional control. The second year is when statistical profitability typically begins for the traders who survive the learning curve."
      },
      {
        question: "Is day trading tax-free in the UK?",
        answer: "If you use a Spread Betting account, your profits are currently exempt from Capital Gains Tax and Stamp Duty. However, if you trade via CFDs or direct share dealing, your profits are subject to CGT. Always consult a tax professional."
      },
      {
        question: "Do I have to quit my job to day trade?",
        answer: "Absolutely not. In fact, keeping your job is recommended to remove the psychological pressure of 'needing' to make money from the markets. Because the London Open is at 8:00 AM, many UK traders trade the first 90 minutes of the session before starting their normal workday."
      }
    ]
  },
  {
    slug: "swing-trading",
    title: "Swing Trading",
    description: "Capture medium-term price moves. Ideal for those with full-time jobs who want to trade the daily and 4-hour timeframes with precision.",
    category: "Strategy",
    heroImage: "/images/learn/swing-trading.jpg",
    metaTitle: "Swing Trading Strategy UK | Trade Part-Time | Drawdown",
    metaDescription: "Learn swing trading for the UK markets. Perfect for part-time traders, focusing on daily and 4-hour timeframes for consistent medium-term gains.",
    content: [
      {
        heading: "The Art of the Swing",
        text: "Swing trading is the practice of holding a trade for more than one day but typically no longer than a few weeks. The goal is to capture a 'swing' in price action—the move from one high to one low or vice versa. This style is often preferred by UK traders who have full-time commitments, as it focuses on higher timeframes like the 4-hour and Daily charts, which require significantly less 'screen time' than day trading."
      },
      {
        heading: "Technical Setups for Swing Traders",
        text: "Swing traders rely heavily on trend analysis and support/resistance levels. Common strategies include trend following (buying the dip in an uptrend) and mean reversion (trading back to a moving average). Because the holding time is longer, swing traders must be comfortable with overnight 'swap' fees and the potential for price gaps."
      }
    ],
    faqs: [
      {
        question: "Is swing trading less risky than day trading?",
        answer: "Not necessarily. While the pace is slower, you take on 'overnight risk'—the possibility that major news breaks while the market is closed. Your position size should reflect this increased risk."
      }
    ]
  },
    {
    slug: "forex-trading",
    title: "Forex Trading",
    subtitle: "The most liquid market on earth. Master currency pairs, leverage, and macroeconomic drivers without the guru promises of overnight wealth.",
    description: "The complete institutional guide to trading the Foreign Exchange market. Learn how to trade the major pairs, understand central bank policy, and manage extreme leverage.",
    category: "Market",
    difficulty: "Advanced",
    timeToLearn: "12-24 months",
    riskLevel: "High",
    heroImage: "/images/learn/forex-trading.jpg",
    metaTitle: "Forex Trading Guide UK 2026 | Master the Currency Markets | Drawdown",
    metaDescription: "Learn to trade Forex properly. Understand pips, lots, leverage, and the macroeconomic forces that actually move the currency markets.",
    honestReality: "The Forex industry is heavily marketed as a 'get rich quick' scheme to retail traders. The reality is that Forex is a highly efficient, hyper-competitive market dominated by central banks and institutional algorithms. The extreme leverage offered by brokers means you can double your money in a day, but it also means you can blow your entire account in a single bad trade. Success in FX requires a 12-24 month commitment to mastering both technical execution and deep macroeconomic understanding.",
    content: [
      {
        heading: "The Mechanics of the FX Market",
        text: "The Foreign Exchange (Forex) market is the largest and most liquid financial market in the world, processing over $7 trillion in daily volume. Unlike the stock market, which operates through centralized exchanges like the LSE or NYSE, Forex is completely decentralized. It is an Over-The-Counter (OTC) market where a global network of banks, institutions, and retail brokers trade currencies directly with one another.\n\nForex operates 24 hours a day, 5 days a week. The trading day follows the sun, opening in Sydney, moving to Tokyo, then to London, and finally closing in New York. \n\nCurrencies are always traded in pairs (e.g., GBP/USD). When you trade a pair, you are simultaneously buying one currency and selling the other. If you go 'long' on GBP/USD, you are betting that the British Pound will strengthen relative to the US Dollar. The extreme liquidity of the FX market means that 'slippage' is rarely an issue for major pairs, and execution is nearly instantaneous.",
        richBlocks: [
          {
            type: 'proTip',
            tip: 'Focus exclusively on the "Majors" (pairs containing the US Dollar, like EUR/USD, GBP/USD, USD/JPY) for your first year. They have the tightest spreads, the cleanest technical structure, and the most predictable volume.'
          } as ProTipBlock
        ]
      },
      {
        heading: "Understanding Pips, Lots, and Leverage",
        text: "To trade Forex, you must understand the mathematical language of the market.\n\n**The Pip:** A 'pip' (Percentage in Point) is the standard unit of measurement for price movement in Forex. For most pairs, it is the fourth decimal place. If GBP/USD moves from 1.2500 to 1.2501, it has moved 1 pip. \n\n**The Lot:** Because a 1-pip movement is mathematically tiny, you have to trade large amounts of currency to make a meaningful profit. A 'Standard Lot' is 100,000 units of currency. A 'Mini Lot' (0.10) is 10,000 units. A 'Micro Lot' (0.01) is 1,000 units.\n\n**Leverage:** How does a retail trader buy 100,000 units of currency? Leverage. Your broker lends you the money. Under UK FCA rules, retail traders are limited to 30:1 leverage for major pairs. This means to control a £100,000 position, you only need £3,333 in your account as 'margin.' Leverage multiplies your profits, but it equally multiplies your losses. It is a tool of destruction in the hands of an amateur.",
        bullets: [
          "Standard Lot (1.00) = Roughly $10 per pip movement.",
          "Mini Lot (0.10) = Roughly $1 per pip movement.",
          "Micro Lot (0.01) = Roughly $0.10 per pip movement."
        ]
      },
      {
        heading: "UK-Specific Advantages: The Structural Edge",
        text: "Trading Forex in the UK provides massive structural advantages over traders in the US or Europe. If you are serious about FX, you must utilize these domestic benefits.\n\nFirst is the tax structure. Under current HMRC regulations, profits made from Spread Betting are classified as gambling, making them completely exempt from Capital Gains Tax (CGT). You can trade the exact same FX pairs, with the exact same charts, but keep 100% of your profits. \n\nSecond is the absence of the Pattern Day Trader (PDT) rule. In the US, traders with small accounts are restricted from taking multiple day trades. In the UK, there is no PDT rule. \n\nFinally, there is the Financial Services Compensation Scheme (FSCS). If you trade with an FCA-regulated broker, your capital is protected up to £85,000 if the broker fails. This is a massive layer of security.",
        richBlocks: [
          {
            type: 'riskWarning',
            title: 'HMRC and Spread Betting',
            warning: 'While spread betting is currently tax-free, this is only true if it is not your primary source of income. If you trade full-time and have no other income, HMRC may classify you as a professional, making your profits taxable.'
          } as RiskWarningBlock
        ]
      },
      {
        heading: "The Three Specific Trading Setups",
        text: "You do not need to know 50 different strategies to trade FX. You need to master one or two high-probability setups.\n\n1. **The London Breakout (Session Open):** The Asian session (Tokyo/Sydney) is typically low-volume, causing price to consolidate in a tight range. When London opens at 8:00 AM GMT, massive institutional volume hits the market. You trade the aggressive breakout of the Asian consolidation range, following the institutional momentum.\n\n2. **The Liquidity Sweep:** Institutions need liquidity to fill massive orders. They find this liquidity where retail traders place their stop-losses (just above major highs or below major lows). The setup involves waiting for price to pierce a major level, trigger the retail stops, and then aggressively reverse back inside the range. You enter on the reversal.\n\n3. **The Break and Retest:** When a major support or resistance level is broken with high volume, do not chase the breakout. Wait for price to pull back and 'retest' the broken level. What was once resistance often becomes support. Enter on the retest using a lower-timeframe confirmation.",
        richBlocks: [
          {
            type: 'toolCard',
            toolSlug: 'tradingview',
            toolName: 'TradingView',
            description: 'The industry standard for charting. Clean UI, custom alerts, and essential for multi-timeframe analysis.',
            features: ['Cloud charting', 'Server-side alerts', 'Volume profile'],
            tier: 'Pro/Premium Recommended'
          } as ToolCardBlock
        ]
      },
      {
        heading: "Position Sizing: The Maths of Survival",
        text: "Risk management is the only thing standing between you and a blown account. The golden rule is the 1% Rule. You must never risk more than 1% of your total account equity on any single trade.\n\nTo do this, you must calculate your position size mathematically before every trade. You do not just guess and pick '0.5 lots'. You calculate the exact distance between your entry and your stop-loss, and adjust your lot size so that if the stop is hit, you lose exactly 1%.",
        richBlocks: [
          {
            type: 'tradeExample',
            title: 'Mathematical Position Sizing',
            instrument: 'GBP/USD',
            session: 'London Open',
            entry: '1.2500',
            stopLoss: '1.2480 (20 Pips Risk)',
            takeProfit: '1.2540 (40 Pips Reward)',
            riskReward: '1:2',
            accountSize: '£5,000',
            riskPercent: '1% (£50 maximum loss)',
            positionSize: '£2.50 per pip (Spread Betting)',
            result: '+£100 Profit',
            isProfit: true
          } as TradeExampleBlock
        ]
      },
      {
        heading: "Macroeconomics: The Engine of FX",
        text: "Technical analysis tells you *when* to enter a trade, but Macroeconomics tells you *why* the market is moving. Currencies are ultimately valued based on the economic health of their respective countries and the monetary policies of their Central Banks.\n\nThe single most important driver of currency valuation is Interest Rates. If the Bank of England (BoE) raises interest rates, it makes holding British Pounds more attractive to global investors, causing GBP to appreciate against other currencies. \n\nYou must track the 'Economic Calendar' daily. Major news events—like the US Non-Farm Payrolls (NFP) or Central Bank press conferences—will cause massive, immediate volatility. Professional traders do not guess what the news will be; they wait for the news to drop, let the algorithms battle it out, and then trade the resulting structural trend.",
        bullets: [
          "Always check the Economic Calendar before trading.",
          "Never hold a day trade through a major Tier-1 news event like CPI or NFP.",
          "Interest rate divergence between two countries dictates the long-term trend of their currency pair."
        ]
      },
      {
        heading: "The Danger of Correlation",
        text: "One of the most common ways retail traders blow their accounts is by ignoring currency correlation. \n\nIf you buy EUR/USD, buy GBP/USD, and buy AUD/USD at the same time, you might think you have taken three diversified trades. In reality, you have essentially taken the exact same trade three times: you are heavily shorting the US Dollar. \n\nIf the US Dollar suddenly strengthens due to a surprise news event, all three trades will hit your stop-loss simultaneously. Instead of risking 1% on one trade, you have just lost 3% on a highly correlated portfolio error. Always be aware of your total exposure to a single currency across all your open positions.",
        richBlocks: [
          {
            type: 'statCallout',
            stat: '80%',
            context: 'of day trading success is entirely psychological. Your ability to execute your plan perfectly after three consecutive losses is what separates the amateur from the professional.',
          } as StatCalloutBlock
        ]
      },
      {
        heading: "Choosing the Right UK Broker",
        text: "If you are trading Forex, your broker is your most critical business partner. You cannot trade effectively if your broker has massive slippage, wide spreads, or freezes during high-impact news events.\n\nFor UK traders, we recommend FCA-regulated brokers that offer 'raw spread' accounts or tight spread betting options. You want a broker that uses an ECN (Electronic Communication Network) execution model, which routes your orders directly to tier-1 liquidity providers.",
        richBlocks: [
          {
            type: 'brokerCard',
            brokerSlug: 'pepperstone',
            brokerName: 'Pepperstone',
            bestFor: 'Best for raw spreads and instant execution',
            regulation: 'FCA Regulated',
            affiliateSlug: 'pepperstone',
            stat: 'Razor account features 0.0 pip minimum spreads'
          } as BrokerCardBlock,
          {
            type: 'brokerCard',
            brokerSlug: 'ig',
            brokerName: 'IG Markets',
            bestFor: 'Best for advanced UK spread betting',
            regulation: 'FCA Regulated',
            affiliateSlug: 'ig',
            stat: 'Largest spread betting provider in the UK'
          } as BrokerCardBlock
        ]
      }
    ],
    faqs: [
      {
        question: "How much money do I need to start trading Forex?",
        answer: "You can open an account with as little as £100, but to trade safely with proper risk management (risking only 1% per trade), a starting balance of £1,000 to £5,000 is highly recommended. Spread betting allows for very small stake sizes (e.g., £0.50 per point), which makes small accounts viable if you are strict with your risk."
      },
      {
        question: "How long does it realistically take to become profitable?",
        answer: "The honest timeline is 12 to 24 months. The first 6 months are spent losing money and learning the mechanics. The next 6 months are spent breaking even and learning emotional control. The second year is when statistical profitability typically begins for the traders who survive the learning curve."
      },
      {
        question: "Is Forex trading tax-free in the UK?",
        answer: "If you use a Spread Betting account, your profits are currently exempt from Capital Gains Tax and Stamp Duty. However, if you trade via CFDs, your profits are subject to CGT. Always consult a tax professional."
      },
      {
        question: "What is the best time of day to trade Forex?",
        answer: "For UK traders, the best time is the London Open (8:00 AM GMT) and the overlap with the New York Open (1:00 PM to 4:00 PM GMT). These windows offer the highest liquidity and the most predictable directional moves."
      }
    ]
  },
  {
    slug: "crypto-trading",
    title: "Crypto Trading",
    subtitle: "The Wild West of finance. 24/7 volatility, zero regulation, and massive asymmetric upside.",
    description: "Navigate the high-volatility world of digital assets. Learn to trade Bitcoin, Ethereum, and altcoins with a strict focus on institutional risk management and capital preservation.",
    category: "Market",
    difficulty: "Advanced",
    timeToLearn: "2-4 months",
    riskLevel: "High",
    heroImage: "/images/learn/crypto-trading.jpg",
    metaTitle: "Crypto Trading Guide UK 2026 | Trade Bitcoin safely | Drawdown",
    metaDescription: "Learn to trade cryptocurrencies safely. From volatility management to cold storage, understand how to trade digital assets without blowing your account.",
    honestReality: "The crypto market is entirely driven by hype, liquidity cycles, and FOMO. There are no earnings reports or dividends to anchor the price of a meme coin. It is pure, unregulated speculation. This creates the most volatile market on earth, which is fantastic for trading, but catastrophic if you don't use a stop loss. In crypto, a 30% drop in a single day is normal. You must trade crypto with the understanding that the exchange could go bankrupt tomorrow (like FTX) or the coin could go to zero (like Luna). Never hold your long-term portfolio on a centralized exchange.",
    content: [
      {
        heading: "The Bitcoin Cycle",
        text: "The entire cryptocurrency market revolves around Bitcoin's 4-year 'Halving' cycle. Every four years, the reward given to Bitcoin miners is cut in half, artificially restricting the new supply of Bitcoin. \n\nHistorically, this supply shock, combined with steady demand, triggers a massive 12-18 month bull run across the entire crypto market. When Bitcoin goes up, it drags the rest of the market (Altcoins) up with it. When Bitcoin crashes, Altcoins crash harder. You cannot trade crypto successfully without constantly monitoring the price action and dominance of Bitcoin.",
        richBlocks: [
          {
            type: 'statCallout',
            stat: '24/7/365',
            context: 'Unlike Forex or Stocks, the crypto market never closes. This means weekend gap risk does not exist, but it also requires you to use automated take-profits and stop-losses while you sleep.',
            source: 'Market Mechanics'
          } as StatCalloutBlock
        ]
      },
      {
        heading: "Trading vs. Holding (HODLing)",
        text: "There is a massive difference between trading crypto and investing in it.\n\nTrading: You are using derivatives (like Perpetual Futures) to speculate on short-term price movements (both up and down). You keep your trading capital on an exchange (like Bybit or Binance), use leverage, and close positions within hours or days. Your goal is to accumulate more fiat currency (USD/GBP).\n\nInvesting (HODL): You are buying the actual underlying asset (spot buying) because you believe in the long-term technological vision. You immediately withdraw the asset from the exchange into a 'Cold Wallet' (like a Ledger or Trezor) where you hold the private keys. Your goal is long-term wealth preservation.",
        richBlocks: [
          {
            type: 'proTip',
            tip: 'Not your keys, not your coins. If you are holding crypto for the long term, take it off the exchange immediately. If the exchange goes bankrupt, your crypto becomes their asset in liquidation.'
          } as ProTipBlock
        ]
      },
      {
        heading: "UK Regulation on Crypto Derivatives",
        text: "For UK residents, trading crypto derivatives (like Futures or CFDs) is highly restricted. \n\nIn 2021, the FCA banned the sale of crypto-derivatives to retail consumers. This means you cannot open a highly-leveraged Bitcoin CFD account with a UK-regulated broker like IG or CMC Markets. \n\nTo trade crypto with leverage, many UK traders use offshore, unregulated (or loosely regulated) exchanges. If you choose to do this, understand that you have zero FCA protection. If the offshore exchange steals your money or gets hacked, you have no legal recourse. Only keep your active trading capital on these exchanges, never your life savings.",
        bullets: [
          "FCA Ban: Crypto derivatives are banned for retail traders in the UK.",
          "Spot Buying: Perfectly legal. You can buy physical Bitcoin on exchanges like Kraken or Coinbase.",
          "Taxation: Crypto profits are subject to Capital Gains Tax in the UK."
        ]
      }
    ],
    faqs: [
      {
        question: "What is an Altcoin?",
        answer: "Any cryptocurrency other than Bitcoin (e.g., Ethereum, Solana, Dogecoin). Altcoins generally have lower market caps, making them vastly more volatile than Bitcoin."
      },
      {
        question: "Can I spread bet crypto in the UK?",
        answer: "No. The FCA ban on retail crypto derivatives includes spread betting. UK regulated brokers cannot offer crypto spread bets to retail clients (only to Professional clients)."
      },
      {
        question: "What does 'DeFi' mean?",
        answer: "Decentralized Finance. These are financial applications built on blockchain networks (like Ethereum) that allow users to lend, borrow, or trade assets without a central bank or broker acting as an intermediary."
      }
    ]
  },
  {
    slug: "stock-trading-uk",
    title: "Stock Trading (UK)",
    subtitle: "Navigate the London Stock Exchange. Understand dividends, stamp duty, and blue-chip equities.",
    description: "A complete guide to trading the London Stock Exchange and UK-specific equities. Learn the mechanics of share dealing, how to avoid stamp duty, and LSE market hours.",
    category: "Market",
    difficulty: "Beginner",
    timeToLearn: "1-2 weeks",
    riskLevel: "Medium",
    heroImage: "/images/learn/stock-trading.jpg",
    metaTitle: "UK Stock Trading Guide 2026 | LSE Essentials | Drawdown",
    metaDescription: "Master the UK stock market. Learn how to trade LSE-listed companies, understand the impact of stamp duty, and navigate the FTSE 100 with confidence.",
    honestReality: "Day trading individual UK stocks is notoriously difficult. The London Stock Exchange lacks the massive liquidity and aggressive volatility found in the US markets (Nasdaq/NYSE). UK stocks tend to 'gap' on the open and then chop sideways for the rest of the day. Furthermore, if you buy physical UK shares, you are hit with a 0.5% Stamp Duty tax immediately, putting you in the red before the trade has even started. For active, short-term trading, you should be trading US stocks or global indices. Keep UK stocks for your long-term ISA portfolio.",
    content: [
      {
        heading: "The London Stock Exchange (LSE)",
        text: "The LSE is the primary stock exchange in the United Kingdom. It is home to massive, multinational corporations, particularly in the banking, energy, and mining sectors (e.g., BP, Shell, HSBC, Rio Tinto).\n\nThe LSE is divided into several indices, but the most important is the FTSE 100 (the 100 largest companies by market capitalization). These are known as 'Blue-Chip' stocks. They are generally considered safer and less volatile, but they offer lower growth potential compared to the high-flying tech stocks in the US.",
        richBlocks: [
          {
            type: 'statCallout',
            stat: '08:00 - 16:30',
            context: 'The official trading hours of the London Stock Exchange (GMT). The most volume occurs during the opening hour and the closing auction.',
            source: 'LSE Rules'
          } as StatCalloutBlock
        ]
      },
      {
        heading: "The Stamp Duty Problem",
        text: "When you buy physical shares of a UK company electronically (via a standard stockbroker), you must pay Stamp Duty Reserve Tax (SDRT). \n\nThis tax is currently set at 0.5% of the transaction value. This means if you buy £10,000 worth of Barclays shares, you instantly pay £50 in tax. If you are a day trader looking to make a quick 1% profit, giving away 0.5% in tax before you even start makes the math nearly impossible to overcome.\n\nThis is why professional short-term traders in the UK use Spread Betting or CFDs. Because you do not actually purchase the underlying share, Spread Bets and CFDs are exempt from UK Stamp Duty.",
        richBlocks: [
          {
            type: 'proTip',
            tip: 'Never day trade physical UK shares. Use a Spread Betting account to avoid the 0.5% Stamp Duty and protect your profit margin.'
          } as ProTipBlock
        ]
      },
      {
        heading: "Dividends and Yields",
        text: "The UK market is famous for its high dividend yields. A dividend is a portion of a company's profit paid out directly to shareholders. \n\nMany investors hold UK 'Blue-Chip' stocks specifically for the income they generate, rather than hoping for the stock price to skyrocket. If you hold a CFD or Spread Bet position on a UK stock when it goes 'ex-dividend' (the cutoff date to receive the dividend), your account will be credited with the dividend amount (if you are long) or debited (if you are short).",
        bullets: [
          "Ex-Dividend Date: You must own the stock before this date to receive the dividend payment.",
          "Price Drop: On the ex-dividend date, the stock price will mathematically drop by the exact amount of the dividend paid out.",
          "Yield: The annual dividend divided by the current stock price."
        ]
      }
    ],
    faqs: [
      {
        question: "Can I trade US stocks from the UK?",
        answer: "Yes, easily. Almost all major UK brokers allow you to trade US equities (like Apple or Tesla). However, you will be subject to currency conversion fees if your account is in GBP, and you will need to fill out a W-8BEN tax form."
      },
      {
        question: "What is the AIM market?",
        answer: "The Alternative Investment Market (AIM) is a sub-market of the LSE designed for smaller, growing companies. AIM stocks are highly volatile, much riskier, and often suffer from low liquidity, but they are exempt from Stamp Duty."
      },
      {
        question: "Is stock trading tax-free in an ISA?",
        answer: "Yes. If you buy physical shares inside a Stocks and Shares ISA, all capital gains and dividend income are 100% tax-free. However, you cannot use leverage or trade derivatives inside an ISA."
      }
    ]
  },
    {
    slug: "spread-betting",
    title: "Spread Betting for UK Traders — The Complete Guide",
    metaTitle: "Spread Betting UK Guide 2026 | Tax-Free Trading | Drawdown",
    subtitle: "The UK's tax-free trading loophole. Master the mechanics of stake size, margin, and keeping 100% of your profits.",
    description: "The complete guide to financial spread betting in the UK. Learn how to trade the global markets tax-free, understand how 'pounds per point' sizing works, and navigate the risks of high leverage.",
    category: "Market",
    difficulty: "Advanced",
    timeToLearn: "12-24 months",
    riskLevel: "High",
    heroImage: "/images/learn/spread-betting.jpg",
    metaDescription: "Learn how to use financial spread betting to trade tax-free in the UK. Master 'pounds per point' risk sizing, leverage, and the HMRC rules.",
    honestReality: "Spread betting is actively marketed as a tax-free wonderland for UK residents. While the tax benefits are entirely real and massive, spread betting is a highly leveraged derivative product. The broker is lending you money to multiply your exposure. This means you can wipe out your entire account in a matter of hours if you do not understand position sizing. You must treat spread betting as a dangerous, institutional-grade weapon that requires strict 1% risk management to wield effectively.",
    content: [
      {
        heading: "What is Financial Spread Betting?",
        text: "Financial spread betting is a derivative product available exclusively in the UK and Ireland. It allows you to speculate on the price movement of global financial markets (Forex, Indices, Commodities, Shares) without actually owning the underlying asset.\n\nInstead of buying 100 shares of Apple, you 'bet' a certain amount of money (e.g., £5) per 'point' that the price of Apple will move. If you bet £5 per point that the price will go up, and the price moves up 10 points, you make £50. If the price moves down 10 points, you lose £50.\n\nBecause it is legally structured as a 'bet' rather than an investment, HMRC classifies it under gambling laws. This provides UK traders with the single greatest structural advantage in global retail trading.",
        richBlocks: [
          {
            type: 'proTip',
            tip: 'The core mechanic is simple: Stake Size (£ per point) multiplied by Point Movement equals your total Profit or Loss.'
          } as ProTipBlock
        ]
      },
      {
        heading: "The Massive UK Tax Advantage",
        text: "The primary reason professional retail traders in the UK use spread betting over traditional CFDs or share dealing is the tax structure.\n\nCurrently, all profits generated from financial spread betting are completely exempt from Capital Gains Tax (CGT). Furthermore, because you are not purchasing the underlying asset, you are entirely exempt from the 0.5% UK Stamp Duty Reserve Tax.\n\nIf you make £50,000 trading CFDs, you must declare it to HMRC and pay Capital Gains Tax on the profits above your annual allowance. If you make £50,000 trading via a Spread Betting account, you keep every single penny.\n\nHowever, there is a catch. Because profits are tax-free, any losses you incur cannot be written off against other income. Additionally, if spread betting becomes your sole, primary source of income, HMRC *may* classify it as a taxable trade. Always consult a certified tax professional.",
        richBlocks: [
          {
            type: 'riskWarning',
            title: 'HMRC and Professional Status',
            warning: 'The tax-free status relies on spread betting being viewed as speculative gambling. If you trade full-time with no other income, HMRC may challenge this status. Consult an accountant.'
          } as RiskWarningBlock
        ]
      },
      {
        heading: "Margin and Leverage Explained",
        text: "Spread betting is a leveraged product. This means you only need to deposit a small fraction of the total trade value (the 'margin') to open a massive position.\n\nUnder FCA regulations, retail traders are offered up to 30:1 leverage on major Forex pairs. This requires a margin of just 3.33%. To control a £10,000 position on GBP/USD, you only need £333 in your account.\n\nLeverage is a double-edged sword. It amplifies your buying power, allowing small accounts to generate significant returns. But it equally amplifies your losses. If you use max leverage on a trade and the market moves against you by just 3%, your entire £333 margin will be wiped out, and the broker will close your trade (a Margin Call).",
        bullets: [
          "Leverage multiplies both profits and losses.",
          "Never use your entire account balance as margin for a single trade.",
          "The 1% risk rule applies to your total equity, regardless of leverage."
        ]
      },
      {
        heading: "Calculating 'Pounds Per Point' Risk",
        text: "In Forex, you calculate risk via lot sizes. In spread betting, you calculate risk via your 'Stake Size' (Pounds per Point). This requires strict mathematical discipline.\n\nIf you have a £5,000 account and use the 1% Rule, your maximum allowed loss per trade is £50.\n\nIf you identify a long setup on the FTSE 100 with an entry at 8,000 and a technical stop loss at 7,980, your stop distance is 20 points.\nTo ensure you only lose exactly £50 if the 20-point stop is hit, you divide your risk by the distance: £50 / 20 = £2.50 per point.\n\nYou place your spread bet at £2.50 per point. If the trade hits your stop, you lose exactly £50. If the trade hits your target 40 points higher, you make £100. This is professional risk management.",
        richBlocks: [
          {
            type: 'tradeExample',
            title: 'Spread Betting Mathematics',
            instrument: 'FTSE 100',
            session: 'London Open',
            entry: '8,100',
            stopLoss: '8,080 (20 Points)',
            takeProfit: '8,160 (60 Points)',
            riskReward: '1:3',
            accountSize: '£10,000',
            riskPercent: '1% (£100 maximum loss)',
            positionSize: '£5.00 per point',
            result: '+£300 Profit (Tax Free)',
            isProfit: true
          } as TradeExampleBlock
        ]
      },
      {
        heading: "The Three Setups for Spread Betting",
        text: "Because spread betting is leveraged, you must trade setups that offer tight stop-losses and massive directional momentum. \n\n1. **The London Session Index Breakout:** Trading the FTSE 100 or DAX 40 precisely at 8:00 AM GMT. The massive influx of institutional volume at the open creates strong directional trends. You wait for the first 15-minute consolidation to break, and trade the momentum.\n\n2. **The Liquidity Sweep (FX Majors):** Waiting for major pairs like GBP/USD to sweep liquidity below a daily support level, trap retail sellers, and violently reverse. This allows for a very tight stop-loss below the 'sweep' wick.\n\n3. **The 4-Hour Trend Continuation:** For those with day jobs, this is a swing-trading approach. Identify the macro trend on the Daily chart, wait for a pullback into a 4-Hour structural demand/supply zone, and enter the continuation with a wider stop-loss but a smaller 'pound per point' stake size.",
        bullets: [
          "Indices (FTSE/DAX) offer the best volatility during the London session.",
          "FX Majors (GBP/USD, EUR/USD) offer the tightest spreads.",
          "Always adjust your stake size based on the volatility of the asset."
        ]
      },
      {
        heading: "Overnight Financing (Holding Costs)",
        text: "Spread betting is primarily designed for short-term trading. If you hold a spread bet position overnight past the daily cutoff time (usually 10:00 PM UK time), you will be charged an overnight financing fee.\n\nThis fee is calculated based on the total leveraged value of your position, plus an admin fee from the broker. Over a few days, this cost is negligible. However, if you attempt to 'invest' via spread betting and hold a position for 6 months, the compounding daily financing fees will severely eat into your profits.\n\nFor long-term investing, use a traditional Stocks and Shares ISA. Use spread betting strictly for intraday and short-term swing trading.",
        richBlocks: [
          {
            type: 'statCallout',
            stat: '10:00 PM',
            context: 'The typical daily cutoff time in the UK. If you close your spread bet at 9:55 PM, you pay zero overnight financing costs.',
          } as StatCalloutBlock
        ]
      },
      {
        heading: "The 12-24 Month Timeline",
        text: "Mastering the mechanics of spread betting takes time. The extreme leverage means that mistakes are punished instantly and severely. \n\nYou must dedicate the first 6 months to trading minimum stake sizes (e.g., 50p per point) to learn the platform mechanics, how spreads widen during news events, and how to control your emotions when the numbers turn red.\n\nIt typically takes 12 to 24 months of rigorous, disciplined execution to build the mechanical edge required to pull consistent, tax-free profits from the market.",
        richBlocks: [
          {
            type: 'proTip',
            tip: 'Use a demo account for the first 3 months to practice calculating your pound-per-point sizing rapidly before trading live capital.'
          } as ProTipBlock
        ]
      },
      {
        heading: "Choosing an FCA-Regulated Broker",
        text: "You can only spread bet legally if you are a UK or Ireland resident. Therefore, you must use a broker regulated by the UK Financial Conduct Authority (FCA).\n\nThe FCA mandates strict rules, including 'Negative Balance Protection' for retail clients. This guarantees that no matter how violently the market gaps against you, you cannot lose more than the total funds deposited in your account. \n\nFurthermore, your funds are segregated and protected by the FSCS up to £85,000. Never trade with an offshore broker attempting to bypass FCA leverage restrictions.",
        richBlocks: [
          {
            type: 'brokerCard',
            brokerSlug: 'ig',
            brokerName: 'IG Markets',
            bestFor: 'Best for advanced UK spread betting',
            regulation: 'FCA Regulated',
            affiliateSlug: 'ig',
            stat: 'Largest spread betting provider in the UK'
          } as BrokerCardBlock,
          {
            type: 'brokerCard',
            brokerSlug: 'pepperstone',
            brokerName: 'Pepperstone',
            bestFor: 'Best for raw spreads and fast execution',
            regulation: 'FCA Regulated',
            affiliateSlug: 'pepperstone',
            stat: 'Integrates directly with TradingView'
          } as BrokerCardBlock
        ]
      }
    ],
    faqs: [
      {
        question: "Is spread betting completely tax-free?",
        answer: "Currently, yes. Under HMRC rules, spread betting is classified as gambling, making it exempt from Capital Gains Tax and Stamp Duty. However, if it is your sole source of income, HMRC may classify you as a professional, making it taxable. Consult a tax advisor."
      },
      {
        question: "Can I lose more than my deposit?",
        answer: "No. FCA regulations require brokers to provide Negative Balance Protection to retail clients. The maximum you can lose is the total amount deposited in your account."
      },
      {
        question: "What is the minimum stake size?",
        answer: "Most UK spread betting brokers allow a minimum stake size of £0.50 (50p) per point, making it highly accessible for beginners with small accounts."
      },
      {
        question: "How is it different from CFDs?",
        answer: "Mechanically they are similar (both are leveraged derivatives). The main difference is tax. CFDs are subject to Capital Gains Tax in the UK, while Spread Betting is currently tax-free. Spread betting also prices in 'pounds per point' rather than lots."
      }
    ]
  },
    {
    slug: "risk-management",
    title: "Risk Management",
    subtitle: "The mathematics of survival. How to structure your account so that blowing it becomes mathematically impossible.",
    description: "The most important skill in trading. Learn the 1% rule, how to calculate precise position sizing, and how to survive the inevitable drawdowns without emotional damage.",
    category: "Psychology",
    difficulty: "Intermediate",
    timeToLearn: "12-24 months",
    riskLevel: "Low",
    heroImage: "/images/learn/risk-management.jpg",
    metaTitle: "Risk Management in Trading UK | Position Sizing Guide | Drawdown",
    metaDescription: "Master the mathematics of trading survival. Learn the 1% rule, how to calculate position size, and how institutions manage risk.",
    honestReality: "You can have the best technical strategy in the world, with an 80% win rate, and you will still blow your account if you do not understand risk management. Professional trading is not about predicting the market; it is about risk control. The harsh reality is that most beginners trade too large, get emotional, and lose everything on a single bad day. You must spend your first 12-24 months learning how to *not lose money* before you can focus on making it. Capital preservation is priority one.",
    content: [
      {
        heading: "Defense First: The Primary Directive",
        text: "In trading, your capital is your inventory. If you own a shoe store and all your shoes burn in a fire, you are out of business. In trading, if your capital drops to zero, you are out of business. The primary directive of any professional trader is not 'make money.' The primary directive is 'protect capital.'\n\nEvery strategy experiences 'drawdown'—a string of consecutive losses. Even a strategy with a 60% win rate will occasionally experience 8 or 9 losses in a row purely due to statistical variance. If you risk 10% of your account per trade, an 8-trade losing streak wipes out 80% of your account. You are mathematically ruined. If you risk 1% per trade, an 8-trade losing streak takes you down 8%. You survive.",
        richBlocks: [
          {
            type: 'statCallout',
            stat: '100%',
            context: 'The return required to recover from a 50% drawdown. If you lose half your account, you have to double the remainder just to get back to breakeven. Do not go into deep drawdown.',
          } as StatCalloutBlock
        ]
      },
      {
        heading: "The 1% Rule of Survival",
        text: "The institutional standard for retail traders is the 1% Rule. You must never, under any circumstances, risk more than 1% of your total account equity on a single trade. \n\nIf you have a £10,000 account, your absolute maximum loss on any setup must be capped at £100. This is the non-negotiable cost of doing business. When you limit your risk to 1%, you completely detach your ego from the trade. Losing £100 on a £10,000 account does not trigger the 'fight or flight' response. It does not cause panic. It allows you to operate mechanically.\n\nOnce you prove you are profitable over a 100-trade sample size, you do not increase your risk percentage; you increase your account size.",
        bullets: [
          "Risk 1% per trade. If you take 5 losses in a week, you are only down 5%.",
          "Never move your stop loss once the trade is active. A 1% loss is a business expense; a 5% loss is a lack of discipline.",
          "Use a hard stop-loss. 'Mental stops' do not work under pressure."
        ]
      },
      {
        heading: "Mathematical Position Sizing",
        text: "How do you ensure you only lose exactly 1%? You must calculate your position size before every single trade based on the distance to your stop loss. \n\nIf your entry is at 1.2500 and your technical stop loss is at 1.2480 (20 pips away), and you have a £5,000 account, your 1% risk is £50. \nTo lose exactly £50 if the 20-pip stop is hit, you divide your risk by your stop distance: £50 / 20 pips = £2.50 per pip. \n\nIf the next trade requires a 50-pip stop loss because the volatility is higher, you run the math again: £50 / 50 pips = £1.00 per pip. Your risk in pounds never changes, only your lot size changes.",
        richBlocks: [
          {
            type: 'tradeExample',
            title: 'Calculating the 1% Risk',
            instrument: 'EUR/USD',
            session: 'New York Open',
            entry: '1.0800',
            stopLoss: '1.0775 (25 Pips)',
            takeProfit: '1.0850 (50 Pips)',
            riskReward: '1:2',
            accountSize: '£10,000',
            riskPercent: '1% (£100)',
            positionSize: '£4.00 per pip',
            result: 'Risk is perfectly contained.',
            isProfit: true
          } as TradeExampleBlock
        ]
      },
      {
        heading: "Risk-to-Reward Ratio (RR)",
        text: "Risk-to-Reward (RR) is the mathematical ratio between what you stand to lose and what you stand to gain on a trade. \n\nIf you risk £100 to make £200, your RR is 1:2. This is the holy grail of profitable trading. If you maintain an average RR of 1:2, you only need to win 34% of your trades to break even. If you win 50% of your trades with a 1:2 RR, you will be massively profitable over the long term. \n\nRetail traders often do the opposite. They take small £20 profits because they are scared of losing the win, but they let their losers run to -£100 because they refuse to be wrong. This creates a negative RR. With a negative RR, even a 90% win rate will eventually blow your account.",
        bullets: [
          "Always aim for a minimum 1:2 RR on every setup.",
          "Do not take a trade if the technical target does not provide at least a 1:2 ratio.",
          "Let your winners run to the target. Cut your losers immediately at the stop."
        ]
      },
      {
        heading: "The Three Setups for Capital Defense",
        text: "Professional risk management isn't just about math; it's about choosing the right setups. Here are three setups that provide inherently strong risk-to-reward ratios:\n\n1. **The Deep Pullback:** Waiting for a trend to pull back deeply into a massive 4-hour demand zone. Entering at the absolute extreme of the zone allows you to place a very tight stop loss (e.g., 10 pips) while targeting the high of the trend (e.g., 100 pips). This provides a massive 1:10 RR.\n\n2. **The Failed Breakout (Trap):** When price breaks a major high, triggers retail FOMO buyers, and immediately reverses. Entering short on the reversal allows you to put your stop loss tightly above the newly formed 'trap' wick. The risk is tiny, but the reward is the entire range.\n\n3. **The Inside Bar Breakout:** An inside bar represents severe volatility contraction. Placing an entry on the break of the inside bar allows you to place your stop loss just below the inside bar. Because the candle is so small, the stop is tight, but the resulting expansion is often explosive.",
        richBlocks: [
          {
            type: 'proTip',
            tip: 'The best risk management is sometimes taking no risk at all. Cash is a position. If the setups are not there, protecting your capital by doing nothing is a highly profitable decision.'
          } as ProTipBlock
        ]
      },
      {
        heading: "Understanding UK-Specific Risks",
        text: "If you are trading in the UK, there are specific structural risks you must mitigate. \n\nFirst is the danger of Spread Betting leverage. Because spread betting is tax-free and allows for high leverage (up to 30:1 for retail), it is very easy to over-leverage a small account. You must be hyper-vigilant that your 'per pip' stake does not exceed your 1% risk rule.\n\nSecond is broker risk. Always use an FCA-regulated broker. Unregulated offshore brokers may offer 500:1 leverage, but they operate 'B-Book' models where they actively trade against you. Furthermore, if an unregulated broker collapses, your money is gone. With an FCA broker, the Financial Services Compensation Scheme (FSCS) protects your deposits up to £85,000.",
        richBlocks: [
          {
            type: 'riskWarning',
            title: 'The Danger of 500:1 Leverage',
            warning: 'Offshore brokers offer massive leverage to entice beginners. At 500:1 leverage, a 0.2% move against you will completely wipe out your account. Stick to FCA-regulated brokers.'
          } as RiskWarningBlock
        ]
      },
      {
        heading: "The Psychology of Accepting the Loss",
        text: "You can know the math perfectly, but if you cannot psychologically accept the loss, you will fail. \n\nA loss is not a reflection of your intelligence. It is not the market 'punishing' you. A loss is simply the statistical cost of doing business. If you own a restaurant, you have to buy ingredients. You don't get angry at the supplier for charging you for flour. In trading, a 1% loss is your overhead.\n\nYou must reframe how you view a stop loss. Hitting a stop loss is not a failure. Hitting a stop loss *and sticking to your 1% risk limit* is a massive victory of discipline.",
        bullets: [
          "Reframe the loss: It is a business expense, not a personal failure.",
          "If you feel anger when stopped out, your position size is too large.",
          "The market owes you nothing. You must protect yourself."
        ]
      },
      {
        heading: "Tools for Professional Risk Management",
        text: "Do not rely on mental math when the market is moving fast. You need professional tools to automate your risk management.\n\nUse position size calculators before every entry. Many modern platforms allow you to input your risk percentage and automatically calculate the correct lot size based on where you drag your stop loss line on the chart.\n\nAdditionally, maintaining a strict trade journal is a form of risk management. By tracking your performance, you can identify 'drawdown days' (e.g., Fridays) and actively reduce your risk parameters on those days to protect capital.",
        richBlocks: [
          {
            type: 'toolCard',
            toolSlug: 'tradingview',
            toolName: 'TradingView Risk Tool',
            description: 'TradingView has built-in Long/Short position tools that visually calculate your Risk-to-Reward ratio and precise position size.',
            features: ['Visual RR calculation', 'Account size integration', 'Risk % inputs'],
            tier: 'Free / Pro'
          } as ToolCardBlock
        ]
      }
    ],
    faqs: [
      {
        question: "What is the 1% Rule?",
        answer: "The 1% Rule states that you must never risk more than 1% of your total account equity on a single trade. If you have £10,000, your maximum loss is £100. This ensures you can survive a long streak of losing trades without blowing your account."
      },
      {
        question: "How do I calculate position size?",
        answer: "Determine your risk amount in pounds (e.g., £50). Measure the distance from your entry to your stop loss in pips (e.g., 20 pips). Divide the risk by the pips (£50 / 20 = £2.50). You must stake £2.50 per pip."
      },
      {
        question: "What is a good Risk-to-Reward ratio?",
        answer: "A professional minimum is 1:2. You risk £1 to make £2. With a 1:2 RR, you only need to win 34% of your trades to be profitable."
      },
      {
        question: "Why do I keep moving my stop loss?",
        answer: "Because you are trading with ego rather than math. You are afraid to be 'wrong.' You must reframe the loss as a business expense. A hard stop-loss removes the decision-making process."
      }
    ]
  },
    {
    slug: "trading-psychology",
    title: "Trading Psychology — The Mental Edge Serious Traders Build",
    metaTitle: "Trading Psychology UK Guide | Master Your Mindset | Drawdown",
    subtitle: "The hardest battle isn't with the market; it's with yourself. Mastering fear, greed, and the illusion of control.",
    description: "Your technical analysis is useless if your psychology is compromised. Learn to build an emotionless, mechanical mindset that treats trading as a strict probability business.",
    category: "Psychology",
    difficulty: "Advanced",
    timeToLearn: "12-24 months",
    riskLevel: "Low",
    heroImage: "/images/learn/psychology.jpg",
    metaDescription: "Learn the psychology of institutional traders. Conquer FOMO, stop revenge trading, and develop the discipline required for long-term profitability.",
    honestReality: "You will spend your first year blaming your strategy, your broker, or 'the algorithm' for your losses. The reality is that you are losing because of your own biological wiring. Human beings are biologically programmed to seek comfort, avoid pain, and follow the herd. In the financial markets, these exact instincts will destroy your capital. Achieving profitability requires actively rewiring your brain over 12-24 months to embrace probability, accept losses mechanically, and execute without emotion.",
    content: [
      {
        heading: "The Myth of the 'Perfect Setup'",
        text: "Retail traders are obsessed with finding the 'Holy Grail' indicator or the perfect technical setup that never fails. This is a psychological defense mechanism against the fear of uncertainty. \n\nThe market is an infinitely chaotic environment. There is no such thing as a guaranteed outcome. Once you accept that every single trade—no matter how perfect the setup looks—has a random outcome, your psychology changes. You stop trying to predict the market and start trying to manage probability.\n\nA professional trader executes their edge mechanically, knowing that over 100 trades, the math will work in their favor, even if the next 5 trades are losers.",
        richBlocks: [
          {
            type: 'proTip',
            tip: 'Think in probabilities, not certainties. If your strategy has a 60% win rate, that means 40 out of 100 perfect setups will fail. Expect the failure. Plan for it.'
          } as ProTipBlock
        ]
      },
      {
        heading: "Revenge Trading: The Account Killer",
        text: "Revenge trading is the single fastest way to annihilate a trading account. It happens when you take a painful loss, feel a visceral sense of injustice, and immediately re-enter the market with double the size to 'prove the market wrong' and win your money back.\n\nWhen you revenge trade, the analytical part of your brain shuts down completely, and the primitive emotional brain takes over. You are no longer trading a statistical edge; you are gambling out of anger.\n\nThe only cure for revenge trading is a hard structural rule: the 'Walk Away' rule. If you take two consecutive losses, or if you feel your heart rate elevate, you must physically close your laptop and walk away for at least two hours.",
        bullets: [
          "Revenge trading ignores all risk management rules.",
          "It is driven by ego and the refusal to accept a loss.",
          "Use platform limits to lock yourself out if you hit a daily drawdown."
        ]
      },
      {
        heading: "The Fear of Missing Out (FOMO)",
        text: "You open your charts and see a massive, violent 100-pip green candle on GBP/USD. You missed the entry. As the price keeps climbing, the psychological pain of 'missing the money' becomes unbearable. You hit the 'Buy' button right at the absolute top of the spike.\n\nThe moment you enter, the institutional traders who bought the bottom begin taking their profit. The market violently reverses, and you are instantly trapped in a massive loss.\n\nFOMO is the market's mechanism for generating exit liquidity for the smart money. You must train yourself to feel absolutely nothing when you miss a move. The market provides infinite opportunities. Capital preservation is paramount.",
        richBlocks: [
          {
            type: 'tradeExample',
            title: 'The FOMO Trap',
            instrument: 'GBP/JPY',
            session: 'London Open',
            entry: '190.50 (Buying the absolute top of a spike)',
            stopLoss: 'No stop loss (Emotion-driven)',
            takeProfit: 'None',
            riskReward: 'Negative',
            accountSize: '£10,000',
            riskPercent: '5% (Over-leveraged)',
            positionSize: '£10 per pip',
            result: '-£500 (Market reversed immediately)',
            isProfit: false
          } as TradeExampleBlock
        ]
      },
      {
        heading: "The Three Psychological Trading Traps",
        text: "The market is designed to exploit three specific human psychological flaws. \n\n1. **The Need to be Right:** Traders will hold onto a losing position, moving their stop loss further and further away, simply because they refuse to admit their initial analysis was wrong. They would rather blow their account than damage their ego.\n\n2. **The Fear of Success:** You are in a winning trade. Your target is 50 pips away. The trade goes 20 pips in profit, pulls back slightly, and panic sets in. You close the trade early for a tiny profit because you are terrified the market will take it away. You just ruined your Risk-to-Reward ratio.\n\n3. **The Recency Bias:** You take three losing trades in a row. A perfect setup forms. Because you are traumatized by the recent losses, you freeze and do not take the trade. The trade goes perfectly to target without you.",
        bullets: [
          "Accepting a loss is a victory of discipline.",
          "Let your winners run to the predetermined target.",
          "Execute every valid setup, regardless of the previous trade's outcome."
        ]
      },
      {
        heading: "Building a Mechanical Mindset",
        text: "How do you overcome these biological flaws? By removing discretion from your trading.\n\nYou must build a trading plan that is so strict and mechanical that a computer could execute it. 'If A happens, and B happens, I execute C, with a stop loss at D.' There is no room for 'I feel like the market is going up.'\n\nWhen your rules are mechanical, trading becomes boring. Boring trading is profitable trading. You execute the data entry, walk away, and let the probabilities play out over a 100-trade sample size.",
        richBlocks: [
          {
            type: 'statCallout',
            stat: '100 Trades',
            context: 'The minimum sample size required to determine if a strategy is actually profitable. Do not judge your performance or change your strategy based on 5 trades.',
          } as StatCalloutBlock
        ]
      },
      {
        heading: "The 12-24 Month Timeline",
        text: "You must completely reset your expectations. You are learning a high-performance profession. You would not expect to perform surgery after watching a YouTube video; do not expect to extract money from institutional algorithms after a weekend course.\n\nThe first 6 months are for losing money and learning the brutal reality of the market. The next 6 months are for breaking even and learning to control your emotions. The second year is when statistical profitability begins to emerge for the traders who have built a rigid, mechanical discipline.\n\nGive yourself permission to be a beginner. Survive the learning curve.",
        richBlocks: [
          {
            type: 'proTip',
            tip: 'Trade on a demo account for the first 6 months. If you cannot make fake money following your rules, you will definitely not make real money when real emotion is involved.'
          } as ProTipBlock
        ]
      },
      {
        heading: "UK Regulatory Peace of Mind",
        text: "One way to improve your trading psychology is to remove external stressors. In the UK, trading with an FCA-regulated broker provides immense peace of mind.\n\nKnowing that your capital is protected up to £85,000 by the Financial Services Compensation Scheme (FSCS) allows you to focus entirely on the charts, rather than worrying if your offshore broker is going to steal your deposit. Furthermore, knowing that spread betting profits are tax-free under HMRC rules removes the complex anxiety of calculating Capital Gains Tax on hundreds of intraday trades.",
        bullets: [
          "Only use FCA-regulated brokers.",
          "Ensure negative balance protection is active on your account.",
          "Trade with capital you can mathematically afford to lose."
        ]
      },
      {
        heading: "The Power of the Trade Journal",
        text: "A trade journal is not just a ledger of profits and losses; it is a mirror reflecting your psychology. \n\nWhen you log every trade, you must log your emotional state. Did you take the trade out of boredom? Were you angry? Were you following your plan? \n\nOver time, the data will clearly show that the trades taken when you felt 'FOMO' or 'Revenge' resulted in massive drawdowns, while the trades taken when you felt 'Bored' and 'Mechanical' generated your profits. The journal provides the mathematical proof required to finally change your behavior.",
        richBlocks: [
          {
            type: 'toolCard',
            toolSlug: 'tradezella',
            toolName: 'TradeZella',
            description: 'The premier automated trading journal. Essential for tracking the psychological impact of your trades and finding the leaks in your strategy.',
            features: ['Automated syncing', 'Playbook tracking', 'Advanced analytics'],
            tier: 'Pro Recommended'
          } as ToolCardBlock
        ]
      }
    ],
    faqs: [
      {
        question: "Why do I keep closing my winning trades too early?",
        answer: "This is the 'Fear of Success' driven by loss aversion. You are so terrified of the market taking away your small unrealized profit that you close it, ruining your Risk-to-Reward ratio. You must trust your initial technical target and let the math play out."
      },
      {
        question: "How do I stop revenge trading?",
        answer: "Implement a strict 'Walk Away' rule. If you lose two trades in a row, you must physically step away from the computer for at least two hours. Use broker platform limits to lock your account for the day if a daily loss limit is hit."
      },
      {
        question: "Is trading essentially gambling?",
        answer: "If you trade without a proven edge and without strict risk management, yes, it is gambling. If you trade a mechanical system with positive expectancy and strict 1% risk rules over a large sample size, it is a statistical business."
      },
      {
        question: "How long does it take to control my emotions?",
        answer: "For most traders, it takes 12 to 24 months of consistent screen time. You have to experience the pain of blowing an account (or a demo account) multiple times before the psychological lessons truly override your biological instincts."
      }
    ]
  },
      {
    slug: "technical-analysis",
    title: "Technical Analysis for Beginners — A UK Trader's Guide",
    metaTitle: "Technical Analysis Guide UK 2026 | Master Price Action | Drawdown",
    subtitle: "The art of reading institutional footprints. Forget magic indicators; focus on structure, liquidity, and momentum.",
    description: "The complete guide to technical analysis for modern traders. Learn how to read price action, identify true support and resistance, and trade alongside institutional order flow.",
    category: "Strategy",
    difficulty: "Intermediate",
    timeToLearn: "12-24 months",
    riskLevel: "Medium",
    heroImage: "/images/learn/technical-analysis.jpg",
    metaDescription: "Learn to read market charts properly. From institutional support and resistance to advanced trend analysis, master the tools of technical trading.",
    honestReality: "The internet is flooded with 'gurus' selling complex trading algorithms that look like spaghetti on a chart. The reality is that institutional traders at hedge funds do not use MACD, RSI, or Stochastics to make million-dollar decisions. They use raw price action. They look at structure, volume, and areas of deep liquidity. Technical indicators are mathematically derived from past price; they are inherently lagging. By the time the moving average crosses over, the institutional move is already finished. We teach you to strip your charts bare and read the raw data.",
    content: [
      {
        heading: "The Language of the Market: Price Action",
        text: "Technical analysis (TA) is the study of past market data to forecast probable future price movements. It is based on the foundational premise that market action 'discounts' everything—meaning all known fundamental information, economic data, and geopolitical fears are already reflected in the current price on the chart.\n\n'Price Action' is the purest form of TA. It involves making trading decisions based entirely on the naked chart, without the distraction of lagging technical indicators. A price action trader looks at the size of the candles, the speed of the movement (momentum), and where the price struggles to pass (structure).",
        richBlocks: [
          {
            type: 'proTip',
            tip: 'Delete every indicator off your chart. Trade with naked candles for one week. You will instantly realize how much faster your brain processes market structure without the distraction of a glowing red line.'
          } as ProTipBlock
        ]
      },
      {
        heading: "Market Structure: The Only Thing That Matters",
        text: "The market only ever does three things: it trends up, it trends down, or it consolidates sideways. \n\nAn Uptrend is a series of Higher Highs (HH) and Higher Lows (HL).\nA Downtrend is a series of Lower Highs (LH) and Lower Lows (LL).\nA Consolidation (or Range) is when price bounces between equal highs and equal lows.\n\nYour entire job as a technical analyst is to identify the current structure and trade in the direction of it. The moment an uptrend fails to make a higher high, and instead breaks the previous higher low, the structure has shifted. This 'Break of Structure' (BoS) is your earliest signal that institutional momentum has reversed.",
        bullets: [
          "Trend Following: Buying the Higher Lows in an uptrend is statistically the highest probability trade you can take.",
          "Counter-Trend: Trying to pick the absolute top of a bullish trend is how retail traders lose all their money.",
          "Consolidation: Do not trade the middle of a range. Wait for the breakout."
        ]
      },
      {
        heading: "Support and Resistance vs. Supply and Demand",
        text: "Traditional TA teaches 'Support and Resistance' (S&R)—drawing a horizontal line where price has bounced multiple times. The theory is that if price hits the line a fourth time, it will bounce again. \n\nModern institutional TA focuses instead on 'Supply and Demand' zones. Supply and demand zones are specific areas where massive institutional orders were previously injected into the market, causing a rapid, aggressive price imbalance. \n\nInstead of a thin S&R line, you draw a broader zone encompassing the last candle before the massive explosive move. The thesis is that institutions have 'unfilled orders' remaining in that zone. When price returns to that zone weeks later, those unfilled orders trigger automatically, causing price to violently reject the zone.",
        richBlocks: [
          {
            type: 'tradeExample',
            title: 'Mathematical Position Sizing in TA',
            instrument: 'S&P 500',
            session: 'New York Open',
            entry: '5,100 (Tap into 4H Demand Zone)',
            stopLoss: '5,080 (20 Points Risk)',
            takeProfit: '5,160 (60 Points Reward)',
            riskReward: '1:3',
            accountSize: '£10,000',
            riskPercent: '1% (£100 maximum loss)',
            positionSize: '£5.00 per point',
            result: '+£300 (+3%)',
            isProfit: true
          } as TradeExampleBlock
        ]
      },
      {
        heading: "The Three Setups of Technical Mastery",
        text: "To succeed with Technical Analysis, you must master the execution of specific, repeatable setups. Here are the three primary setups used by professionals:\n\n1. **The Liquidity Sweep (The Trap):** Retail traders place their stop losses directly above obvious Resistance or below obvious Support. Institutions know this. They will intentionally drive the price slightly past the level, hit the retail stops (absorbing their liquidity), and immediately reverse the price. You enter on the reversal back inside the level.\n\n2. **The Break and Retest:** When a major structure level breaks with high volume, do not chase it. Wait for the inevitable pullback to retest the broken level. What was once resistance becomes support. Enter on the retest.\n\n3. **The Inside Bar Breakout:** An inside bar occurs when a candle's high and low are completely contained within the previous candle. It signals extreme volatility contraction. You trade the breakout of this contraction, placing a tight stop loss below the inside bar.",
        bullets: [
          "Never place your stop loss exactly on a major level. Always leave a buffer.",
          "Wait for the sweep to occur before entering a reversal.",
          "A fast wick below a key level followed by a strong close back inside the range is a powerful entry signal."
        ]
      },
      {
        heading: "Top-Down Analysis",
        text: "You can never look at a single timeframe in isolation. A 5-minute chart might look incredibly bullish, while the Daily chart shows you are driving directly into a massive institutional supply zone.\n\nProfessional traders use 'Top-Down Analysis'. This means determining the overall trend on the highest timeframe, and then dropping down to lower timeframes to find a precise entry.\n\n1. The Daily Chart (The Compass): Use this to determine the overall trend. Are we making Higher Highs or Lower Lows?\n2. The 4-Hour Chart (The Map): Use this to draw your major Supply and Demand zones and identify key structure points.\n3. The 15-Minute Chart (The Sniper Rifle): Use this to wait for price to enter your 4H zone, watch for a change of character, and execute the trade with a tight stop loss.",
        richBlocks: [
          {
            type: 'toolCard',
            toolSlug: 'tradingview',
            toolName: 'TradingView',
            description: 'The industry standard for technical charting. Essential for multi-timeframe analysis and drawing supply/demand zones.',
            features: ['Cloud-based charting', 'Custom alerts', 'Multi-chart layouts'],
            tier: 'Free / Pro'
          } as ToolCardBlock
        ]
      },
      {
        heading: "Volume as the Ultimate Validator",
        text: "Price can be manipulated on lower timeframes, but volume cannot be hidden. Volume is the actual footprint of institutional participation. If price breaks out of a major resistance level, but the volume is significantly lower than average, it is likely a false breakout.\n\nConversely, if price is dropping rapidly into a demand zone, but the volume on the down-candles is decreasing while the volume on the up-candles is increasing, it suggests that institutional selling pressure is exhausting and buyers are stepping in.",
        richBlocks: [
          {
            type: 'statCallout',
            stat: '80%',
            context: 'of false breakouts are accompanied by below-average volume. Always wait for volume confirmation before trading a break of structure.',
            source: 'Proprietary Trading Data'
          } as StatCalloutBlock
        ]
      },
      {
        heading: "The 12-24 Month Timeline",
        text: "You will not master Technical Analysis in a weekend. Reading price action is a visual skill that requires thousands of hours of screen time. It is exactly like learning to read a new language.\n\nIt typically takes 12 to 24 months to achieve profitability. The first 6 months are spent memorizing the patterns and losing money because you apply them in the wrong context. The next 6 months are spent learning that context is everything. The second year is when you finally develop the discipline to only trade your 3 specific setups.",
        bullets: [
          "Obvious patterns are usually traps.",
          "Trade the 'break and retest' rather than the initial break.",
          "Always ask: Where is the trapped retail liquidity?"
        ]
      },
      {
        heading: "UK Trading Advantages for TA",
        text: "Applying Technical Analysis in the UK comes with distinct structural advantages. If you use a Spread Betting account to execute your technical setups, your profits are entirely exempt from Capital Gains Tax (CGT) under HMRC rules.\n\nFurthermore, because the UK has no Pattern Day Trader (PDT) rule, you can execute as many intraday technical setups as your strategy demands, even on a small account. Finally, trading with an FCA-regulated broker ensures your capital is protected by the FSCS, allowing you to focus entirely on the charts.",
        richBlocks: [
          {
            type: 'brokerCard',
            brokerSlug: 'pepperstone',
            brokerName: 'Pepperstone',
            bestFor: 'Best for raw spreads and fast execution',
            regulation: 'FCA Regulated',
            affiliateSlug: 'pepperstone',
            stat: 'Average execution speed of 30ms'
          } as BrokerCardBlock,
          {
            type: 'brokerCard',
            brokerSlug: 'ig',
            brokerName: 'IG Markets',
            bestFor: 'Best for advanced charting integration',
            regulation: 'FCA Regulated',
            affiliateSlug: 'ig',
            stat: 'Direct TradingView integration'
          } as BrokerCardBlock
        ]
      }
    ],
    faqs: [
      {
        question: "Does technical analysis work on all markets?",
        answer: "Yes, because TA is ultimately the study of human psychology (fear and greed) visualized on a chart. Human psychology does not change whether you are trading Forex, Crypto, or UK Stocks. However, high-liquidity markets respect technical levels much cleaner than low-liquidity penny stocks."
      },
      {
        question: "What is the best technical indicator?",
        answer: "Price. All indicators (RSI, MACD, Bollinger Bands) are derivatives of price. They take past price data and run it through a mathematical formula to output a line. By definition, they are lagging. Learning to read raw price action is infinitely more valuable."
      },
      {
        question: "Why do my support lines keep breaking?",
        answer: "Because you are trading obvious retail liquidity. If a support line is too obvious, institutional algorithms will intentionally push the price below it to trigger retail stop-losses (a 'liquidity sweep') before reversing the price in the original direction."
      },
      {
        question: "How do I size my positions technically?",
        answer: "You must use mathematical position sizing. Place your technical stop loss (e.g., 20 pips away) based on market structure. If your 1% risk is £50, you divide £50 by 20 pips to stake £2.50 per pip via spread betting."
      }
    ]
  },
      {
    slug: "candlestick-patterns",
    title: "Candlestick Patterns",
    subtitle: "The visual language of the market. Learn to read the battle between buyers and sellers in real-time.",
    description: "Master Japanese candlestick patterns to time your entries. Learn to identify hammers, engulfing bars, and institutional footprints before the trend reverses.",
    category: "Strategy",
    difficulty: "Beginner",
    timeToLearn: "12-24 months",
    riskLevel: "Low",
    heroImage: "/images/learn/candlesticks.jpg",
    metaTitle: "Candlestick Patterns Guide UK 2026 | Timing Your Entries | Drawdown",
    metaDescription: "Learn the visual language of the markets. Master hammers, shooting stars, and engulfing patterns to improve your trade timing and execution.",
    honestReality: "Candlestick patterns are highly effective, but they are completely useless in isolation. A bullish engulfing candle in the middle of nowhere means absolutely nothing. Retail traders memorize 50 different candlestick patterns and try to trade every single one they see. Institutional traders look for one or two specific candlestick patterns, but *only* when they occur at predetermined, high-timeframe supply or demand zones. The context of the pattern is 10x more important than the pattern itself.",
    content: [
      {
        heading: "The Anatomy of a Candlestick",
        text: "Before you can read patterns, you must understand the single candle. A Japanese candlestick visually represents four data points over a specific timeframe (e.g., 5 minutes, 1 day):\n\n1. Open: The price at the start of the timeframe.\n2. High: The absolute highest price reached during the timeframe.\n3. Low: The absolute lowest price reached.\n4. Close: The price at the exact moment the timeframe ends.\n\nThe thick part of the candle is the 'Body' (the difference between open and close). The thin lines extending from the top and bottom are the 'Wicks' or 'Shadows' (the extreme highs and lows that were ultimately rejected). \n\nA long upper wick means buyers tried to push the price up, but sellers violently rejected them and drove the price back down. Wicks represent rejection.",
        richBlocks: [
          {
            type: 'proTip',
            tip: 'The close is the most important part of the candle. Never assume a candlestick pattern is valid until the candle actually closes. A candle can look like a perfect bullish hammer with 10 seconds left, and close as a bearish disaster.'
          } as ProTipBlock
        ]
      },
      {
        heading: "The Three Specific Setups",
        text: "Do not memorize 50 patterns. Master these three high-probability setups:\n\n1. **The Pin Bar (Liquidity Sweep):** The Pin Bar (or Hammer) has a small body and a long wick. It shows violent rejection. The setup is to wait for price to sweep below a major support level, trigger retail stops, and form a Bullish Pin Bar. You buy on the break of the Pin Bar's high.\n\n2. **The Engulfing Break and Retest:** An Engulfing pattern occurs when a large candle completely covers the body of the previous smaller candle. Trade this on the 'retest' of a broken structure level to confirm the new trend.\n\n3. **The Inside Bar Breakout:** An Inside Bar represents massive volatility contraction. The entire candle is inside the previous candle. Trade the breakout of the 'Mother Bar' during high-volume sessions like the London Open.",
        bullets: [
          "Wait for the Close: The engulfing candle must close completely enveloping the previous body.",
          "Volume Confirmation: The engulfing candle should ideally have higher volume than the previous candle.",
          "Location is Everything: Only trade engulfing patterns at high-timeframe key levels."
        ]
      },
      {
        heading: "Mathematical Position Sizing",
        text: "When trading candlestick patterns, your stop loss placement is critical, and it dictates your position size.\n\nIf you are trading a Bullish Pin Bar on GBP/USD, your stop loss MUST go below the extreme low of the wick. If the distance from your entry to the bottom of the wick is 30 pips, and your 1% account risk is £150, you divide £150 by 30 pips. Your stake size is £5 per pip.\n\nThis ensures that if the pattern fails (which it will 40% of the time), you only lose your strictly defined 1% overhead.",
        richBlocks: [
          {
            type: 'tradeExample',
            title: 'Trading a Bearish Pin Bar',
            instrument: 'GBP/USD',
            session: 'London Open',
            entry: '1.2740 (Break of Pin Bar Low)',
            stopLoss: '1.2760 (20 pips, above the wick)',
            takeProfit: '1.2680 (60 pips)',
            riskReward: '1:3',
            accountSize: '£5,000',
            riskPercent: '1% (£50)',
            positionSize: '£2.50 per pip (Spread Betting)',
            result: '+£150 (+3.0%)',
            isProfit: true
          } as TradeExampleBlock
        ]
      },
      {
        heading: "Combining Patterns with Confluence",
        text: "The secret to institutional trading is 'Confluence'—stacking multiple technical factors in your favor before executing a trade.\n\nA Bullish Engulfing pattern in the middle of a chart has a 50/50 win rate. But a Bullish Engulfing pattern that forms:\n1. In the direction of the Daily trend.\n2. At a 4-Hour Demand Zone.\n3. Immediately following a liquidity sweep of a previous low.\n\nThat pattern now has an 80%+ probability of playing out. Never trade the candle alone. Trade the context.",
        richBlocks: [
          {
            type: 'statCallout',
            stat: 'Contraction leads to Expansion',
            context: 'The tighter the Inside Bar consolidation, the more violent the subsequent breakout tends to be as trapped traders are forced to cover their positions.',
          } as StatCalloutBlock
        ]
      },
      {
        heading: "Timeframes and Reliability",
        text: "Not all candlestick patterns are created equal. The reliability of a pattern is directly proportional to the timeframe it forms on.\n\nA Pin Bar on the Daily chart represents 24 hours of sustained buying or selling pressure. It is highly significant and difficult for retail traders to manipulate. A Pin Bar on the 1-Minute chart represents 60 seconds of noise and is highly susceptible to random volatility.\n\nWe recommend beginners focus exclusively on identifying patterns on the 4-Hour and Daily charts until they achieve consistent profitability."
      },
      {
        heading: "The 12-24 Month Timeline",
        text: "You can memorize the shapes of candlesticks in an afternoon. You cannot master the execution of them in less than 12 to 24 months.\n\nDeveloping the 'screen time' required to instantly recognize subtle shifts in momentum, to understand when an Engulfing bar is a trap vs when it is a true institutional entry, requires thousands of hours of deliberate practice. Be patient. Survive your first year by using minimal risk.",
        richBlocks: [
          {
            type: 'toolCard',
            toolSlug: 'tradingview',
            toolName: 'TradingView',
            description: 'The best platform for identifying candlestick patterns and drawing zones of confluence.',
            features: ['Auto-pattern recognition', 'Custom timeframe candles', 'Volume analysis'],
            tier: 'Free / Pro'
          } as ToolCardBlock
        ]
      },
      {
        heading: "UK-Specific Advantages",
        text: "UK traders utilizing Candlestick patterns have significant structural advantages. By executing these patterns via a Spread Betting account, you can precisely control your 'pound per point' risk without having to calculate complex lot sizes.\n\nFurthermore, because spread betting profits are currently tax-free under HMRC (as they are classified as gambling), you keep 100% of your gains. Additionally, trading with an FCA-regulated broker means you have Negative Balance Protection, ensuring a massive market gap against your candlestick pattern will never put you in debt to the broker."
      },
      {
        heading: "Recommended Brokers for Charting",
        text: "To effectively trade candlestick patterns, you need a broker with high-quality data feeds. A delayed or inaccurate data feed can literally change the shape of the candle, causing you to see an Engulfing pattern that doesn't actually exist on the institutional feed.",
        richBlocks: [
          {
            type: 'brokerCard',
            brokerSlug: 'pepperstone',
            brokerName: 'Pepperstone',
            bestFor: 'Best for institutional-grade data feeds',
            regulation: 'FCA Regulated',
            affiliateSlug: 'pepperstone',
            stat: 'Raw pricing directly from tier-1 liquidity providers'
          } as BrokerCardBlock,
          {
            type: 'brokerCard',
            brokerSlug: 'ig',
            brokerName: 'IG Markets',
            bestFor: 'Best for proprietary charting platform',
            regulation: 'FCA Regulated',
            affiliateSlug: 'ig',
            stat: 'Award-winning native charts with pattern recognition'
          } as BrokerCardBlock
        ]
      }
    ],
    faqs: [
      {
        question: "Which timeframe is best for candlestick patterns?",
        answer: "Higher timeframes are always more reliable. A Daily or 4-Hour Pin Bar carries massive institutional weight. A 1-Minute Pin Bar is often just random algorithmic market noise and is highly unreliable."
      },
      {
        question: "Do I need to memorize all 50+ candlestick patterns?",
        answer: "Absolutely not. Professional traders focus on only 2 or 3 high-probability patterns (typically Pin Bars, Engulfing Bars, and Inside Bars) and master them completely."
      },
      {
        question: "What is a Doji?",
        answer: "A Doji is a candle where the open and close are almost exactly the same price, resulting in a cross-like shape. It represents total market indecision. A Doji after a long trend can signal an impending reversal."
      },
      {
        question: "How do I size my trade for a Pin Bar?",
        answer: "Place your stop loss behind the wick. Measure the distance from entry to stop in pips. Divide your total 1% risk amount by the pip distance to find your exact stake size per pip."
      }
    ]
  },
  {
    slug: "position-sizing",
    title: "Position Sizing",
    subtitle: "The exact mathematical formula that prevents you from ever blowing an account. Stop guessing your trade size.",
    description: "The complete guide to calculating position size in trading. Learn the exact formula for Forex, Indices, and Crypto to ensure you never risk more than 1% per trade.",
    category: "Foundation",
    difficulty: "Beginner",
    timeToLearn: "1 week",
    riskLevel: "Low",
    heroImage: "/images/learn/position-sizing.jpg",
    metaTitle: "Position Sizing Guide UK | The Maths of Trading Survival | Drawdown",
    metaDescription: "Never blow an account again. Learn the exact formula for calculating position size based on risk and stop-loss distance for UK spread betting and CFDs.",
    honestReality: "The reason 80% of retail traders lose their money is not because their strategy is bad. It is because they do not know how to size their positions. They trade a static amount—like '£5 a point'—regardless of how far away their stop loss is. This means on some trades they risk 1% of their account, and on others they risk 10%. One unexpected market movement wipes out weeks of profit. Professional trading is a game of standardized risk. If you do not calculate your exact position size before every single trade, you are gambling.",
    content: [
      {
        heading: "The Position Sizing Formula",
        text: "Your position size should never be determined by 'how confident' you feel about a trade. It is a strict mathematical calculation based on three variables:\n\n1. Account Balance: Your total trading capital.\n2. Risk Percentage: Usually 1% (your maximum loss on the trade).\n3. Stop Loss Distance: The distance from your entry price to your stop loss price (measured in pips or points).\n\nThe Formula:\nPosition Size = (Account Balance × Risk Percentage) ÷ (Stop Loss Distance × Pip Value)\n\nIf you have a £10,000 account, and you risk 1%, your maximum risk is £100.\nIf your Stop Loss is 20 pips away, you must divide your £100 risk by 20 pips.\n£100 ÷ 20 = £5 per pip.\n\nYour exact position size is £5 per pip. If the stop loss is hit, you lose exactly £100 (1%).",
        richBlocks: [
          {
            type: 'toolCard',
            toolSlug: 'risk-calculator',
            toolName: 'Drawdown Position Sizer',
            description: 'Stop doing the maths manually. Input your account size, stop loss distance, and instrument to get your exact lot size instantly.',
            features: ['Live pip value calculation', 'Multi-currency support', 'Instant lot sizing'],
            tier: 'Free'
          } as ToolCardBlock
        ]
      },
      {
        heading: "Dynamic Sizing: The Stop Loss Dictates the Size",
        text: "The most important concept to grasp is that your position size must be dynamic; it changes on every trade depending on the size of your stop loss.\n\nImagine you have two different trades, but you want to risk the exact same £100 on both:\n\nTrade A: A scalping trade on EUR/USD with a tight 10-pip stop loss.\nCalculation: £100 ÷ 10 = £10 per pip. \nYou can take a large position (£10/pip) because the stop is so tight.\n\nTrade B: A swing trade on GBP/JPY with a wide 100-pip stop loss.\nCalculation: £100 ÷ 100 = £1 per pip.\nYou must take a much smaller position (£1/pip) because the stop is very wide.\n\nIn both scenarios, if the trade completely fails and hits the stop loss, you lose exactly £100. Your risk remains perfectly static, while your position size adapts.",
        bullets: [
          "Tight Stop Loss = Larger Position Size (to reach your 1% risk).",
          "Wide Stop Loss = Smaller Position Size (to stay within your 1% risk).",
          "Never move a stop loss just to take a larger position size."
        ]
      },
      {
        heading: "Spread Betting vs. CFD Sizing",
        text: "How you input your position size depends entirely on the type of account you are using in the UK.\n\nSpread Betting Sizing:\nSpread betting is the easiest format to calculate. Your position size is literal pounds per point (£/pt). If the formula tells you to trade £5 per point, you literally enter '5' into the deal ticket. It is clean and transparent.\n\nCFD/Forex Lot Sizing:\nIf you use a standard CFD or ECN broker (like Pepperstone or IC Markets), you trade in 'Lots'.\n1 Standard Lot = 100,000 units (Roughly $10 a pip)\n1 Mini Lot = 10,000 units (Roughly $1 a pip)\n1 Micro Lot = 1,000 units (Roughly $0.10 a pip)\n\nIf your calculation dictates a risk of $3 per pip, you would open a position size of 0.30 Lots.",
        richBlocks: [
          {
            type: 'proTip',
            tip: 'Always double-check your pip value. In Forex, the pip value for EUR/USD is different from USD/JPY or GBP/AUD. A position size calculator handles these currency conversions automatically.'
          } as ProTipBlock
        ]
      }
    ],
    faqs: [
      {
        question: "Can I risk a fixed monetary amount instead of a percentage?",
        answer: "You can, but it is less effective than a percentage model. A percentage model naturally compounds your account. If your account grows from £10k to £20k, your 1% risk automatically scales from £100 to £200. A fixed amount stunts your compounding growth."
      },
      {
        question: "What happens if a market gap jumps over my stop loss?",
        answer: "This is called 'slippage'. If a market gaps over your stop loss over the weekend or during a major news event, you will lose more than your calculated 1% risk. The only way to prevent this is by using a Guaranteed Stop Loss (GSLO), which brokers charge a premium for."
      },
      {
        question: "Is £1 a point considered a big position?",
        answer: "Position size is relative entirely to your account balance. £1 a point on the FTSE 100 with a 50-point stop loss is £50 risk. If you have a £500 account, that is a massive 10% risk (reckless). If you have a £5,000 account, it is a perfect 1% risk."
      }
    ]
  },
  {
    slug: "trading-tax-uk",
    title: "Trading Tax (UK)",
    subtitle: "Keep what you kill. The definitive guide to HMRC regulations for UK retail traders.",
    description: "An honest look at HMRC rules for UK traders. Understand Stamp Duty, Capital Gains Tax, and the massive mathematical benefits of Spread Betting vs CFDs.",
    category: "Foundation",
    difficulty: "Beginner",
    timeToLearn: "1 week",
    riskLevel: "Low",
    heroImage: "/images/learn/trading-tax.jpg",
    metaTitle: "UK Trading Tax Guide 2026 | HMRC Rules for Traders | Drawdown",
    metaDescription: "Understand your tax obligations as a UK trader. Learn the specific HMRC rules regarding spread betting, CFDs, Capital Gains, and Income Tax.",
    honestReality: "We are not accountants, and this is not financial advice. However, understanding the basic structure of UK trading tax is essential for profitability. A trading system that generates a 20% annual return via CFDs will dramatically underperform the exact same system executed via a Spread Betting account, simply because of HMRC's Capital Gains Tax. If you trade from the UK and you are not using the tax advantages legally available to you, you are surrendering your edge to the government.",
    content: [
      {
        heading: "HMRC and the UK Trader",
        text: "In the United Kingdom, how you execute your trades completely changes your tax liability. HMRC views trading through three distinct lenses:\n\n1. Gambling (Spread Betting)\n2. Investing (CFDs and Traditional Share Dealing)\n3. Trading as a Business (Income Tax)\n\nFor the vast majority of retail traders (people who have a separate full-time job and trade on the side), you will fall into either category 1 or 2, depending entirely on the account type you open with your broker.",
        richBlocks: [
          {
            type: 'statCallout',
            stat: '£3,000',
            context: 'The current UK Capital Gains Tax allowance (as of 2024/25). Any profit above this limit in a CFD account is taxable.',
            source: 'HMRC'
          } as StatCalloutBlock
        ]
      },
      {
        heading: "The Tax-Free Option: Spread Betting",
        text: "Under current UK law, financial spread betting is classified as gambling. \n\nBecause it is gambling, all profits generated in a spread betting account are currently 100% exempt from both Capital Gains Tax (CGT) and Income Tax. Furthermore, because you do not physically purchase the underlying asset, you are exempt from the 0.5% Stamp Duty Reserve Tax that is normally charged when buying UK shares.\n\nHowever, this classification cuts both ways. Because spread betting is gambling, you cannot claim 'loss relief' on your losing trades. You cannot offset spread betting losses against other capital gains (like selling a second home) to reduce your overall tax bill.",
        richBlocks: [
          {
            type: 'proTip',
            tip: 'If you are consistently profitable, Spread Betting is mathematically superior. If you are a beginner expected to take losses, a CFD account allows you to offset those trading losses against other capital gains.'
          } as ProTipBlock
        ]
      },
      {
        heading: "The Taxable Option: CFDs and Share Dealing",
        text: "Contracts for Difference (CFDs) and traditional share dealing are classified by HMRC as 'investing'. \n\nProfits made in these accounts are subject to Capital Gains Tax (CGT). Currently, the CGT allowance in the UK is very low (£3,000 for the 24/25 tax year). This means if you make £10,000 profit trading CFDs, you will pay tax on £7,000 of it.\n\nThe CGT rate depends on your Income Tax band:\n— Basic Rate Taxpayers: Pay 10% on trading profits.\n— Higher/Additional Rate Taxpayers: Pay 20% on trading profits.\n\nThe advantage of a CFD account is loss relief. If you lose £5,000 trading CFDs, you can declare that capital loss to HMRC and offset it against future capital gains, reducing your overall tax burden.",
        bullets: [
          "CFD Profits: Taxable under Capital Gains Tax (after allowance).",
          "CFD Losses: Can be offset against other capital gains.",
          "UK Share CFDs: Exempt from 0.5% Stamp Duty (unlike physical share dealing)."
        ]
      },
      {
        heading: "The Danger Zone: 'Trading as a Trade'",
        text: "Many people dream of quitting their job to trade full-time. If you do this, HMRC's view of you may change.\n\nIf trading becomes your primary, sole source of income, and you rely on it to pay your mortgage and living expenses, HMRC may decide you are 'trading as a trade' (running a business). \n\nIf this happens, your profits are no longer subject to Capital Gains Tax; they are subject to Income Tax and National Insurance. This is a significantly higher tax bracket (potentially up to 45%). Even if you use a spread betting account, HMRC has successfully argued in court that professional gamblers who use systematic methods for their primary income are liable for Income Tax.",
        richBlocks: [
          {
            type: 'riskWarning',
            message: 'If you plan to trade full-time as your sole source of income, you must consult a specialist tax accountant. Do not assume your spread betting profits will remain tax-free if you quit your day job.'
          } as RiskWarningBlock
        ]
      }
    ],
    faqs: [
      {
        question: "Do I need to declare spread betting profits to HMRC?",
        answer: "No. If you are a casual retail trader using a spread betting account, your profits are currently tax-free and do not need to be declared on your self-assessment tax return."
      },
      {
        question: "Do I pay tax if I trade through a limited company?",
        answer: "Yes. If you set up a corporate trading account under a Limited Company, the company pays Corporation Tax on all trading profits, and you pay Dividend Tax when you extract the money. The spread betting 'gambling' exemption does not apply to corporations."
      },
      {
        question: "Can I use an ISA to trade Forex?",
        answer: "No. You cannot trade leveraged derivatives (like Forex CFDs or Spread Bets) inside a Stocks and Shares ISA. ISAs are strictly for unleveraged investments like physical shares and ETFs."
      }
    ]
  },
  {
    slug: "commodity-trading",
    title: "Commodity Trading",
    subtitle: "Trade the raw materials that power the global economy. High volatility driven by real-world supply and demand.",
    description: "The complete guide to trading global commodities in the UK. Understand the drivers of Gold, Silver, Crude Oil, and Natural Gas, and how to use them to diversify your portfolio.",
    category: "Market",
    difficulty: "Intermediate",
    timeToLearn: "2-4 weeks",
    riskLevel: "High",
    heroImage: "/images/learn/commodities.jpg",
    metaTitle: "Commodity Trading Guide UK 2026 | Trade Gold & Oil | Drawdown",
    metaDescription: "Learn to trade global commodities. Master the macroeconomic drivers of Gold, Silver, and Crude Oil, and understand the impact of geopolitical events.",
    honestReality: "Commodities are not for the faint of heart. Unlike a stock, which derives its value from a company's earnings, a commodity's price is driven entirely by global macroeconomics, weather patterns, and geopolitics. A single pipeline leak in the Middle East or a sudden shift in US Federal Reserve interest rates can cause violent, unpredictable price spikes. You must trade commodities with a firm grasp of fundamental analysis and extremely strict risk management. They offer massive opportunities, but they will relentlessly punish traders who rely solely on technical chart patterns.",
    content: [
      {
        heading: "Hard vs. Soft Commodities",
        text: "The commodity market is divided into two distinct categories, each with its own fundamental drivers:\n\n1. Hard Commodities: These are extracted or mined from the earth. The most heavily traded are Gold (XAU), Silver (XAG), US Crude Oil (WTI), Brent Crude, and Natural Gas. Hard commodities are heavily influenced by geopolitical stability, industrial demand, and the strength of the US Dollar.\n\n2. Soft Commodities: These are grown or bred. Examples include Coffee, Wheat, Corn, Sugar, and Lean Hogs. Soft commodities are highly susceptible to unpredictable weather patterns, crop diseases, and seasonal cycles. For retail traders, we strongly recommend sticking to Hard Commodities due to their superior liquidity and more predictable macroeconomic drivers.",
        richBlocks: [
          {
            type: 'proTip',
            tip: 'If you are trading commodities, you are effectively trading the US Dollar. Almost all global commodities are priced in USD. Therefore, if the Dollar strengthens, commodities typically become more expensive for foreign buyers, driving the price down.'
          } as ProTipBlock
        ]
      },
      {
        heading: "Trading Gold (XAU/USD)",
        text: "Gold is the undisputed king of the commodity market. It is uniquely positioned as both an industrial material and a global 'Safe Haven' asset.\n\nWhen global markets panic—due to war, a pandemic, or a banking crisis—institutional money pulls out of risky equities and flows into Gold to preserve wealth, driving the price up. Furthermore, Gold is a hedge against inflation. When central banks print too much money, eroding the purchasing power of fiat currencies, Gold retains its intrinsic value.\n\nTo trade Gold successfully, you must monitor US Interest Rates. Because Gold pays no yield (no dividends or interest), it becomes less attractive when interest rates are high (because investors can earn a guaranteed return in government bonds). Conversely, when interest rates are cut, Gold typically rallies.",
        richBlocks: [
          {
            type: 'statCallout',
            stat: 'Inverse Correlation',
            context: 'Gold historically shares an inverse correlation with the US Dollar and Real Interest Rates. Understanding this macro relationship is essential.',
            source: 'Macroeconomic Principles'
          } as StatCalloutBlock
        ]
      },
      {
        heading: "Trading Crude Oil (WTI & Brent)",
        text: "Crude Oil is the lifeblood of the global economy. There are two main benchmarks: WTI (West Texas Intermediate), which is the US standard, and Brent Crude, which is the global standard extracted from the North Sea.\n\nOil prices are a direct reflection of global economic health. If the world economy is booming, factories are running, and people are traveling, demand for oil surges, driving prices up. If a recession hits, demand collapses, and prices plummet.\n\nThe supply side is heavily manipulated by OPEC+ (The Organization of the Petroleum Exporting Countries). OPEC regularly holds meetings to agree on production cuts or increases to intentionally control the global price of oil. As an oil trader, the OPEC meeting dates are the most critical events on your economic calendar.",
        bullets: [
          "Demand Drivers: Global GDP growth, manufacturing output, summer driving seasons.",
          "Supply Drivers: OPEC+ production quotas, US shale output, geopolitical conflict in the Middle East.",
          "Inventory Data: Watch the US Energy Information Administration (EIA) weekly inventory report."
        ]
      }
    ],
    faqs: [
      {
        question: "How do I actually trade a commodity in the UK?",
        answer: "The most tax-efficient method is via a Spread Betting account. You do not buy physical barrels of oil; you place a bet on the price movement. You can also trade commodity CFDs or buy ETFs that track commodity prices (like the SPDR Gold Trust - GLD) through a standard brokerage account."
      },
      {
        question: "Why does the price of oil sometimes go negative?",
        answer: "This famously happened in April 2020 during the pandemic lockdowns. Because oil is a physical asset, it must be stored. When demand collapsed, storage facilities filled up entirely. Traders who held expiring oil futures contracts had to pay buyers to take the physical oil off their hands because they had nowhere to put it."
      },
      {
        question: "What is 'Contango' and 'Backwardation'?",
        answer: "These terms describe the shape of the futures curve. Contango is when future prices are higher than the current spot price (normal market condition). Backwardation is when future prices are lower than the current spot price, usually indicating a severe short-term supply shortage."
      }
    ]
  },
  {
    slug: "index-trading",
    title: "Index Trading",
    subtitle: "Trade the broader market. Ditch the single-stock risk and trade the overall sentiment of the global economy.",
    description: "The complete guide to trading global stock indices. Master the volatility of the DAX, the stability of the FTSE 100, and the momentum of the Nasdaq.",
    category: "Market",
    difficulty: "Beginner",
    timeToLearn: "1-2 weeks",
    riskLevel: "Medium",
    heroImage: "/images/learn/indices.jpg",
    metaTitle: "Index Trading Guide UK 2026 | Master the FTSE & S&P 500 | Drawdown",
    metaDescription: "Learn to trade global stock indices. Ditch single-stock risk and master the mechanics of trading the S&P 500, Nasdaq 100, and FTSE 100.",
    honestReality: "For the vast majority of retail day traders, trading an index is vastly superior to trading individual stocks. When you trade a single company like Tesla or Apple, you are exposed to 'idiosyncratic risk'—the CEO tweets something reckless, an earnings report misses by 1%, or a product gets recalled, and the stock gaps down 15% overnight, destroying your stop loss. An index dilutes that risk across hundreds of companies. It moves based on broader macroeconomic trends and technical levels, making it far more predictable and liquid for short-term trading.",
    content: [
      {
        heading: "What is an Index?",
        text: "A stock market index is a mathematical measurement of a specific section of the stock market. It tracks the performance of a basket of publicly traded companies.\n\nFor example, the FTSE 100 tracks the 100 largest companies listed on the London Stock Exchange. The S&P 500 tracks 500 of the largest companies in the United States. When you trade an index, you are not buying shares; you are speculating on the collective performance of those underlying companies. If the majority of the companies in the S&P 500 have a profitable day, the index price goes up.",
        richBlocks: [
          {
            type: 'statCallout',
            stat: 'Market Cap Weighting',
            context: 'Most major indices are weighted by market capitalization. This means massive companies like Apple and Microsoft have a vastly larger impact on the S&P 500\'s movement than smaller companies.',
            source: 'Index Mechanics'
          } as StatCalloutBlock
        ]
      },
      {
        heading: "The 'Big Three' US Indices",
        text: "The US markets provide the highest liquidity and the cleanest price action in the world. As a UK trader, these will likely become your primary instruments during the afternoon session.\n\n1. The S&P 500 (US 500): The benchmark of the US economy. It is highly liquid, respects technical levels beautifully, and is considered the gold standard for index day traders.\n\n2. The Nasdaq 100 (US Tech 100): Heavily weighted toward the technology sector. It is significantly more volatile and aggressive than the S&P 500. It offers massive daily ranges (great for profits), but the aggressive price swings require a wider stop loss and flawless risk management.\n\n3. The Dow Jones (Wall Street 30): Tracks 30 massive, 'blue-chip' industrial companies. It moves differently than the S&P and Nasdaq, often reacting more heavily to traditional economic data rather than tech-sector news.",
        bullets: [
          "S&P 500: Best for beginners. Clean structure, manageable volatility.",
          "Nasdaq 100: Best for experienced traders. High volatility, massive daily ranges.",
          "Trading Hours: The optimal time to trade US indices is the New York Open (14:30 UK time)."
        ]
      },
      {
        heading: "Trading the European Indices",
        text: "For UK traders who want to trade the morning session (08:00 UK time), the European indices offer excellent opportunities before the US market wakes up.\n\n1. The FTSE 100 (UK 100): The UK benchmark. It is heavily weighted toward banking, energy, and mining companies. It is notoriously slow-moving and 'choppy' compared to its international peers, making it less ideal for aggressive day trading but excellent for longer-term swing trades.\n\n2. The DAX 40 (Germany 40): The premier European index. It tracks the 40 largest German companies. The DAX is highly volatile, highly liquid, and the absolute favorite among European day traders. It provides excellent movement right from the 08:00 AM London Open.",
        richBlocks: [
          {
            type: 'tradeExample',
            title: 'DAX 40 London Open Breakout',
            instrument: 'DAX 40 (Germany)',
            session: 'London Open (08:00 GMT)',
            entry: '18,200 (Break of pre-market range)',
            stopLoss: '18,170 (30 points)',
            takeProfit: '18,290 (90 points)',
            riskReward: '1:3',
            accountSize: '£10,000',
            riskPercent: '1% (£100)',
            positionSize: '£3.33 per point',
            result: '+£300 (+3.0%)',
            isProfit: true
          } as TradeExampleBlock
        ]
      }
    ],
    faqs: [
      {
        question: "Do indices pay dividends?",
        answer: "If you trade an index via a standard CFD or Spread Bet (a daily funded bet), you will typically receive a 'dividend adjustment' credited to your account if you are holding a long position when a constituent company pays a dividend. If you are short, the adjustment will be deducted."
      },
      {
        question: "Can I trade indices outside of normal market hours?",
        answer: "Yes. Most brokers offer 24/5 trading on major indices like the S&P 500 by pricing the underlying futures contract. However, liquidity outside of the main New York session is very low, and spreads are significantly wider."
      },
      {
        question: "Why do my index charts look different on different brokers?",
        answer: "Because there is no central exchange for retail CFD/Spread Betting indices, brokers create their own 'synthetic' pricing based on the underlying futures market. While the broad movements will be identical, the exact micro-fluctuations (and wicks) may vary slightly between brokers."
      }
    ]
  },
  {
    slug: "scalping-strategies",
    title: "Scalping Strategies",
    subtitle: "The fastest game in town. High-frequency execution on the 1-minute chart.",
    description: "The complete guide to scalping the financial markets. Learn how to profit from tiny price moves using high-frequency execution, Level 2 data, and ultra-tight spreads.",
    category: "Strategy",
    difficulty: "Advanced",
    timeToLearn: "3-6 months",
    riskLevel: "High",
    heroImage: "/images/learn/scalping.jpg",
    metaTitle: "Forex Scalping Guide UK 2026 | 1-Minute Chart Trading | Drawdown",
    metaDescription: "Master the art of scalping. Learn to extract small profits from hundreds of daily trades using precise timing, DOM analysis, and institutional tools.",
    honestReality: "Scalping is the most difficult form of retail trading. It requires the reflexes of a fighter pilot and the emotional numbness of a sociopath. You are trading on the 1-minute chart, hunting for 3-5 pip movements. Because your profit targets are so small, your position sizes must be massive to make any real money. A single moment of hesitation, a sudden spike in spread, or a moment of internet lag will wipe out an entire day of scalping profits. If you have a full-time job or are easily stressed, do not scalp. Swing trade instead.",
    content: [
      {
        heading: "The Anatomy of a Scalp",
        text: "Unlike swing traders who hold positions for days hunting for 100-pip moves, scalpers are in and out of the market in seconds or minutes. \n\nA typical scalping setup involves waiting for price to reach a major 15-minute support level, dropping down to the 1-minute chart, and buying the exact moment the price rejects the level. The scalper might risk 5 pips to make 10 pips. They rely on an extremely high win rate (often 60-70%) and sheer volume of trades (taking 10-20 trades per session) to generate a daily profit.",
        richBlocks: [
          {
            type: 'proTip',
            tip: 'If you are scalping, you cannot afford to manually calculate your lot size. You must use a trade execution terminal (like Magic Keys or cTrader) that automatically calculates your risk and places your stop loss the millisecond you click buy.'
          } as ProTipBlock
        ]
      },
      {
        heading: "The Enemy of the Scalper: Spread and Commission",
        text: "When you are only hunting for 5 pips of profit, you cannot afford to pay a 2-pip spread to the broker. That is giving away 40% of your profit margin instantly.\n\nTo scalp profitably, you must have a 'Raw Spread' or 'ECN' account. These accounts offer spreads of 0.0 pips on major pairs like EUR/USD, and instead charge a flat commission (usually around £5 per lot traded). \n\nIf you try to scalp on a standard retail account with wide spreads, you will mathematically bleed your account to death through transaction costs, even if your win rate is decent.",
        richBlocks: [
          {
            type: 'brokerCard',
            brokerSlug: 'pepperstone',
            brokerName: 'Pepperstone',
            bestFor: 'Best for UK Scalpers — Razor Account',
            regulation: 'FCA Regulated',
            affiliateSlug: 'pepperstone',
            stat: '0.0 Pip spreads on major FX pairs'
          } as BrokerCardBlock
        ]
      },
      {
        heading: "Reading the DOM (Depth of Market)",
        text: "Professional scalpers do not rely heavily on traditional candlestick charts. They use the DOM (Depth of Market), also known as Level 2 data.\n\nThe DOM shows the actual order book. It displays exactly how many pending buy orders and sell orders are sitting at every price level. If a scalper sees a massive cluster of institutional buy orders sitting at 1.1050, they will 'front-run' that level, buying at 1.1051, knowing the massive institutional wall will likely bounce the price upward.",
        bullets: [
          "Tape Reading: Watching the speed of orders flowing into the market to gauge momentum.",
          "Spoofing: Beware of fake institutional orders that appear on the DOM to trick retail traders, only to vanish milliseconds before price hits them.",
          "Direct Market Access (DMA): Scalpers require DMA brokers to route their orders directly to liquidity providers with zero delay."
        ]
      }
    ],
    faqs: [
      {
        question: "Can I scalp on my phone?",
        answer: "Absolutely not. Scalping requires multiple monitors, Level 2 data, one-click execution software, and a hardwired ethernet connection. Mobile trading is too slow and inaccurate for scalping."
      },
      {
        question: "Which markets are best for scalping?",
        answer: "You must trade the highest liquidity, lowest spread instruments. EUR/USD, USD/JPY, the S&P 500, and the DAX 40 during their primary market open hours."
      },
      {
        question: "Do prop firms allow scalping?",
        answer: "Most do, but you must read the fine print. Some prop firms have rules against 'high-frequency trading' algorithms, or mandate a minimum time a trade must be held (e.g., 2 minutes) to prevent arbitrage abuse."
      }
    ]
  },
  {
    slug: "fundamental-analysis",
    title: "Fundamental Analysis",
    subtitle: "The engine that moves the market. Understand interest rates, inflation, and macroeconomics.",
    description: "Go beyond the charts. Understand GDP, inflation data, and Central Bank interest rates to build a high-conviction macroeconomic bias.",
    category: "Strategy",
    difficulty: "Advanced",
    timeToLearn: "2-4 months",
    riskLevel: "Medium",
    heroImage: "/images/learn/fundamentals.jpg",
    metaTitle: "Fundamental Analysis Guide UK 2026 | Macro Trading | Drawdown",
    metaDescription: "Learn the drivers of market value. Master interest rate policy, economic indicators (NFP, CPI), and geopolitical events to improve your trading edge.",
    honestReality: "Technical analysis tells you *when* to buy. Fundamental analysis tells you *what* to buy and *why*. Many retail traders ignore fundamentals because staring at a chart is easier than reading an inflation report from the Bank of England. But institutional money does not move billions of dollars because a 15-minute MACD crossed over. They move money based on interest rate differentials and economic growth. If you are trading against the fundamental macroeconomic trend, you are swimming against a tidal wave. You might catch a few short-term pips, but eventually, the macro wave will drown you.",
    content: [
      {
        heading: "The Core Driver: Interest Rates",
        text: "In the Forex market, currency valuation is almost entirely driven by Central Bank Interest Rates.\n\nMoney flows to where it is treated best. If the US Federal Reserve offers an interest rate of 5.0%, and the Bank of Japan offers an interest rate of 0.1%, global institutional investors will sell their Japanese Yen and buy US Dollars to capture that 4.9% 'yield differential'.\n\nThis creates a massive, sustained uptrend in USD/JPY. A fundamental trader understands this dynamic and will only look for technical setups to *buy* USD/JPY, completely ignoring any technical signals that suggest selling it.",
        richBlocks: [
          {
            type: 'statCallout',
            stat: 'The Carry Trade',
            context: 'Borrowing a currency with a low interest rate to buy a currency with a high interest rate. This fundamental strategy drives massive, multi-year Forex trends.',
            source: 'Macro FX Principles'
          } as StatCalloutBlock
        ]
      },
      {
        heading: "The Economic Calendar",
        text: "Interest rates are determined by the health of the economy, which is measured by specific data releases. Professional traders monitor an 'Economic Calendar' to know exactly when this data is released to the public.\n\nThe most important data releases (known as 'Tier 1' data) include:\n\n1. Inflation (CPI - Consumer Price Index): If inflation is too high, the central bank must raise interest rates to cool the economy down (usually Bullish for the currency).\n2. Employment (NFP - Non-Farm Payrolls): Released on the first Friday of every month in the US. Shows how many jobs were created. High job creation means a strong economy (Bullish for USD).\n3. GDP (Gross Domestic Product): The overall measurement of economic growth.",
        bullets: [
          "Expectation vs. Reality: The market prices in the 'expected' data. If inflation is expected to be 3.0%, and it comes in at 3.0%, the market won't move. Volatility only occurs when the data *misses* the expectation.",
          "Red Folder Events: On an economic calendar, high-impact events are marked in red. Never hold a tight stop loss during a red folder release."
        ]
      },
      {
        heading: "Trading the News: A Warning",
        text: "When Tier 1 data (like US NFP) is released at exactly 13:30 UK time, the market goes insane. Liquidity is pulled by the major banks, causing spreads to widen massively (from 0.5 pips to 15+ pips in a millisecond). Price will violently whip up and down in seconds.\n\nRetail traders try to 'gamble' on the news release, placing buy and sell stops just above and below the current price. This is a guaranteed way to lose money. The widening spread will trigger both of your orders and instantly stop you out in both directions (a 'spread widening sweep').\n\nProfessional fundamental traders do not trade *during* the news release. They wait 15 minutes for the initial volatility to settle, analyze what the data actually means for the macro picture, and then enter the trade based on the new fundamental bias.",
        richBlocks: [
          {
            type: 'riskWarning',
            message: 'Never attempt to scalp during a major news release. Brokers will widen spreads, execution will suffer massive slippage, and your stop loss may not be honored due to a lack of market liquidity.'
          } as RiskWarningBlock
        ]
      }
    ],
    faqs: [
      {
        question: "Where can I find an Economic Calendar?",
        answer: "Free calendars are available on sites like ForexFactory, Investing.com, and directly within premium charting platforms like TradingView. Ensure your calendar is synced to your local UK timezone."
      },
      {
        question: "What is 'Hawkish' and 'Dovish'?",
        answer: "These are terms used to describe Central Bank tone. A 'Hawkish' tone means the bank is aggressive, fighting inflation, and likely to raise interest rates (Bullish for the currency). A 'Dovish' tone means the bank is cautious, trying to stimulate growth, and likely to cut rates (Bearish for the currency)."
      },
      {
        question: "Does fundamental analysis work for day trading?",
        answer: "Yes, but differently than swing trading. For day traders, fundamentals provide the 'daily bias'. If UK inflation data comes out surprisingly high at 07:00 AM, a day trader will only look for technical 'long' setups on GBP pairs for the rest of the day session."
      }
    ]
  },
  {
    slug: "order-flow-trading",
    title: "Order Flow Trading",
    subtitle: "See inside the candles. Track institutional volume and liquidity to trade with the smart money.",
    description: "Master institutional order flow. Learn to read the DOM, Level 2 data, and footprint charts to identify exactly where the big money is buying and selling.",
    category: "Strategy",
    difficulty: "Advanced",
    timeToLearn: "3-6 months",
    riskLevel: "Medium",
    heroImage: "/images/learn/order-flow.jpg",
    metaTitle: "Order Flow Trading Guide UK 2026 | See Inside the Candles | Drawdown",
    metaDescription: "Master institutional order flow. Learn to read the DOM, Level 2 data, and footprint charts to identify where the big money is moving.",
    honestReality: "Order flow is the closest you will ever get to having 'insider information' without breaking the law. A standard candlestick chart only shows you the *result* of the battle between buyers and sellers. Order flow shows you the *actual battle* as it happens. You can see the exact volume of contracts being executed at every single price level. However, order flow platforms are expensive, the data feeds cost monthly subscriptions, and learning to read a footprint chart looks like reading the Matrix. It is a steep learning curve, but once you learn to read the tape, you will never look at a naked candlestick the same way again.",
    content: [
      {
        heading: "What is Order Flow?",
        text: "Order flow is the study of the actual, executed buy and sell orders in the market. \n\nIn standard technical analysis, if price hits a resistance line and forms a bearish candle, you assume sellers took control. With order flow, you don't have to assume. You look at the 'Footprint Chart' and see that exactly 2,400 sell orders aggressively hit the bid at that price level, overwhelming the 300 buy orders. You are trading based on verified, executed volume, not lagging mathematical indicators.",
        richBlocks: [
          {
            type: 'toolCard',
            toolSlug: 'sierrachart',
            toolName: 'Sierra Chart',
            description: 'The industry standard for professional order flow traders. It is ugly, complex, and incredibly powerful.',
            features: ['Advanced Footprint Charts', 'TPO / Market Profile', 'Direct CME Data Feeds'],
            tier: 'Professional'
          } as ToolCardBlock
        ]
      },
      {
        heading: "The Footprint Chart",
        text: "A Footprint Chart dissects a standard candlestick and shows you exactly how much volume was traded at every single price tick inside that candle.\n\nIt separates the volume into 'Aggressive Buyers' (who bought at the Ask) and 'Aggressive Sellers' (who sold at the Bid). By reading the footprint, you can spot 'Imbalances'—moments where buyers outnumbered sellers by 300% or more. If you see a massive buy imbalance at the bottom of a candle, but the price fails to move up, you know institutional sellers are 'absorbing' that buying pressure. This absorption is a massive leading indicator of a downward reversal.",
        bullets: [
          "Delta: The net difference between aggressive buyers and aggressive sellers in a candle.",
          "Imbalances: When one side of the market overwhelms the other (typically measured as a 3x ratio).",
          "Absorption: When massive aggressive orders are executed, but the price refuses to move, indicating a larger institutional player is holding the line."
        ]
      },
      {
        heading: "The DOM (Depth of Market) & Level 2 Data",
        text: "While the Footprint chart shows you orders that have *already* executed, the DOM shows you orders that are *waiting* to execute.\n\nLevel 2 data provides a live feed of the limit order book. You can see large blocks of institutional liquidity sitting at specific price levels. The market acts as a magnet toward these large pools of liquidity. Scalpers use the DOM to 'lean' on massive institutional orders, placing their stop-loss just behind the institutional wall, knowing it will take immense pressure to break through it.",
        richBlocks: [
          {
            type: 'proTip',
            tip: 'Order flow does not work effectively in the decentralized Forex market because there is no central exchange reporting total volume. To trade order flow, you must trade Futures contracts (like the ES or NQ) on a centralized exchange like the CME.'
          } as ProTipBlock
        ]
      }
    ],
    faqs: [
      {
        question: "Can I use order flow on MetaTrader 4?",
        answer: "No. MT4 does not process Level 2 data or tick-by-tick volume. You need a dedicated order flow platform like Sierra Chart, NinjaTrader, or ATAS, combined with a paid data feed (like Rithmic or CQG)."
      },
      {
        question: "Is Level 2 data free?",
        answer: "No. Because you are trading Futures on a centralized exchange (like the CME), you must pay the exchange a monthly fee for the live Level 2 data feed. This usually costs between $10 to $30 a month."
      },
      {
        question: "What is 'Spoofing' in the order book?",
        answer: "Spoofing is an illegal (but common) tactic where large players place massive fake limit orders on the DOM to trick retail traders into thinking there is a huge wall of support. Milliseconds before the price reaches the order, the algorithm cancels it. You must learn to distinguish between real resting liquidity and spoofed orders."
      }
    ]
  },
  {
    slug: "fibonacci-retracement",
    title: "Fibonacci Retracement",
    description: "Master the Golden Ratio. Learn how to identify natural pulling points in the market for precise entries and exits.",
    category: "Strategy",
    heroImage: "/images/learn/fibonacci.jpg",
    metaTitle: "Fibonacci Trading Guide | Master the Golden Ratio | Drawdown",
    metaDescription: "Learn to use Fibonacci retracement and extension levels like a professional. Identify high-probability reversal zones and profit targets.",
    content: [
      {
        heading: "The Geometry of the Markets",
        text: "Fibonacci levels are horizontal lines that indicate where support and resistance are likely to occur. They are based on the Fibonacci sequence found in nature. In trading, the 50% and 61.8% levels (The Golden Ratio) are the most watched, acting as 'magnets' where price often retraces before continuing its primary trend."
      }
    ],
    faqs: [
      {
        question: "Why do Fibonacci levels work?",
        answer: "They work largely because they are a self-fulfilling prophecy—millions of traders and institutional algorithms use them as anchor points for their orders."
      }
    ]
  },
  {
    slug: "moving-averages",
    title: "Moving Averages",
    description: "Smooth out the noise. Learn how to use the 50, 100, and 200 EMA to identify the dominant trend and dynamic support.",
    category: "Strategy",
    heroImage: "/images/learn/moving-averages.jpg",
    metaTitle: "Moving Average Guide | Master Trend Following | Drawdown",
    metaDescription: "Learn to use SMAs and EMAs properly. From the 'Golden Cross' to dynamic support, master the most popular indicators in trading.",
    content: [
      {
        heading: "Filtering the Market Noise",
        text: "Moving averages smooth out price data by creating a constantly updated average price. We focus on Exponential Moving Averages (EMA), which give more weight to recent prices. The 200 EMA on the Daily chart is the 'ultimate line in the sand' for institutional traders—if price is above it, the macro trend is bullish."
      }
    ],
    faqs: [
      {
        question: "Which moving average is best for day trading?",
        answer: "The 9 EMA and 20 EMA are very popular for intraday momentum, while the 50 EMA is often used for trend confirmation on the 5-minute or 15-minute charts."
      }
    ]
  },
  {
    slug: "volume-profile",
    title: "Volume Profile",
    description: "Find the Point of Control. Learn how to use volume by price to see where the market has found fair value and where it is imbalanced.",
    category: "Strategy",
    heroImage: "/images/learn/volume-profile.jpg",
    metaTitle: "Volume Profile Guide | Master Value Area Trading | Drawdown",
    metaDescription: "Learn to trade using Volume Profile. Identify the Point of Control (POC) and Value Areas to understand where institutional orders are clustered.",
    content: [
      {
        heading: "Trading Value, Not Just Price",
        text: "Unlike standard volume which shows volume by 'time', Volume Profile shows volume by 'price'. This identifies the 'Point of Control' (POC)—the price at which the most volume has traded. This is considered 'Fair Value' by the market. Professional traders use 'Value Area Highs and Lows' as target points for their mean-reversion strategies."
      }
    ],
    faqs: [
      {
        question: "Is Volume Profile better than standard volume?",
        answer: "It is much more precise for identifying where large orders are sitting. Standard volume tells you 'when' the market was active; Volume Profile tells you 'at what price' they were active."
      }
    ]
  },
  {
    slug: "algorithmic-trading",
    title: "Algorithmic Trading",
    description: "The complete guide to institutional-grade automated trading. Learn to codify your edge and remove biological emotion from your execution.",
    category: "Strategy",
    heroImage: "/images/learn/algo-trading.jpg",
    metaTitle: "Algorithmic Trading Guide | Systematic Edge & Automation | Drawdown",
    metaDescription: "Master algorithmic trading. From Pine Script to Python, learn how to build, backtest, and deploy automated trading systems with institutional discipline.",
    content: [
      {
        heading: "The Systematic Edge",
        text: "Algorithmic trading (or 'algo trading') is the process of using computer programmes to follow a defined set of instructions for placing a trade. In a world where 70% of market volume is driven by machines, manual traders are at a significant disadvantage unless they understand how these systems operate. The primary benefit of an algorithm isn't speed — it's the total removal of human emotion, fear, and greed from the execution process."
      },
      {
        heading: "Pine Script vs. Python: Choosing Your Stack",
        text: "For most retail traders, the journey begins with Pine Script (TradingView). It is highly accessible and integrated directly into the charts. However, for those seeking institutional-grade data analysis, machine learning integration, and complex multi-asset execution, Python is the industry standard. At Drawdown, we teach you how to prototype in Pine and scale into Python using libraries like Pandas, Backtrader, and TA-Lib."
      },
      {
        heading: "The Backtesting Trap: Avoiding Overfitting",
        text: "The biggest mistake new algo traders make is 'curve-fitting' — tweaking a strategy until it looks perfect in the past, only for it to fail miserably in live markets. We teach you 'Walk-Forward Analysis' and 'Monte Carlo Simulations' to ensure your strategy has a true predictive edge and isn't just a result of coincidental historical data."
      },
      {
        heading: "Connecting the API: Going Live",
        text: "Moving from a backtest to a live execution bot requires an API (Application Programming Interface). This allows your script to communicate directly with your broker's execution engine. We provide frameworks for connecting to major ECN brokers and prop firm platforms, ensuring your trades are executed with minimal latency and slippage."
      }
    ],
    faqs: [
      {
        question: "Do I need to be a professional coder to start?",
        answer: "No. With modern tools like Pine Script and the Drawdown Algo Builder, you can codify basic strategies with zero prior programming experience. We focus on 'Logic First, Syntax Second'."
      },
      {
        question: "Is algorithmic trading better than manual trading?",
        answer: "It is more consistent. An algorithm will never skip a trade because it's 'scared' or over-leverage because it's 'angry'. It simply executes the math."
      }
    ]
  },
  {
    slug: "cfd-trading",
    title: "CFD Trading",
    description: "The complete guide to Contracts for Difference. Learn how to trade price movements without owning the underlying asset.",
    category: "Foundation",
    heroImage: "/images/learn/cfd-trading.jpg",
    metaTitle: "CFD Trading Guide UK | Leverage & Margin Explained | Drawdown",
    metaDescription: "Master CFD trading. Understand how to use contracts for difference to trade global markets, manage leverage, and offset losses for tax purposes.",
    content: [
      {
        heading: "What is a CFD?",
        text: "A Contract for Difference (CFD) is a financial derivative that allows you to speculate on the rising or falling prices of fast-moving global financial markets. You don't buy the asset; you buy a contract that pays the difference in price between when you open and close the position. In the UK, CFDs are subject to Capital Gains Tax, unlike spread betting."
      }
    ],
    faqs: [
      { question: "Is CFD trading risky?", answer: "Yes, because it is a leveraged product. You can lose more than your initial deposit if you don't use stop-losses correctly." }
    ]
  },
  {
    slug: "options-trading",
    title: "Options Trading",
    description: "Learn to trade volatility and time. Understand calls, puts, and how to use options to hedge your portfolio.",
    category: "Strategy",
    heroImage: "/images/learn/options-trading.jpg",
    metaTitle: "Options Trading Guide | Master Greeks & Volatility | Drawdown",
    metaDescription: "Learn to trade options like a professional. Understand calls, puts, and 'The Greeks' to manage risk and profit from market volatility.",
    content: [
      {
        heading: "Trading Time and Volatility",
        text: "Options are contracts that give you the right, but not the obligation, to buy or sell an asset at a set price. Unlike stocks, options have an expiration date. Success in options requires understanding 'The Greeks' — Delta, Gamma, Theta, and Vega — which measure how the price reacts to time and volatility."
      }
    ],
    faqs: [
      { question: "What is the difference between a call and a put?", answer: "A 'Call' option gives you the right to buy (bullish), while a 'Put' option gives you the right to sell (bearish)." }
    ]
  },
  {
    slug: "price-action",
    title: "Price Action Trading",
    description: "The purest form of technical analysis. Learn to read the story of the market without any lagging indicators.",
    category: "Strategy",
    heroImage: "/images/learn/price-action.jpg",
    metaTitle: "Price Action Trading Guide | Read the Naked Charts | Drawdown",
    metaDescription: "Master price action trading. Learn to identify market structure, trends, and reversal signals using only the 'naked' price chart.",
    content: [
      {
        heading: "The Naked Chart Philosophy",
        text: "Price action traders believe that all available information is already reflected in the price. Instead of using indicators like RSI or MACD, we look at market structure (Higher Highs and Higher Lows) and key horizontal levels. This is how institutional traders often view the market — as a series of liquidity pools and supply/demand imbalances."
      }
    ],
    faqs: [
      { question: "Is price action better than indicators?", answer: "Price action is 'leading', while indicators are 'lagging' (calculated from past price). Most professionals prefer price action for its speed and clarity." }
    ]
  },
  {
    slug: "trading-courses",
    title: "Trading Courses",
    description: "Navigate the education minefield. Learn how to choose a legitimate trading course and what to avoid.",
    category: "Education",
    heroImage: "/images/learn/courses.jpg",
    metaTitle: "Trading Courses Guide | How to Choose Legit Education | Drawdown",
    metaDescription: "Avoid the gurus. Learn how to identify high-quality trading education that focuses on risk management and institutional process.",
    content: [
      {
        heading: "Cutting Through the Guru Fluff",
        text: "The trading education industry is full of 'get rich quick' promises. A legitimate trading course should focus on risk management, psychology, and a proven process, rather than showing off luxury cars. At Drawdown, we advocate for structured, phase-based learning that starts with the foundations."
      }
    ],
    faqs: [
      { question: "Are expensive trading courses worth it?", answer: "Only if they provide a community, a proven mentor, and a focus on long-term sustainability. Be wary of anything promising over 20% returns per month." }
    ]
  },
  {
    slug: "online-trading",
    title: "Online Trading",
    description: "The digital gateway to the world's markets. Learn how online trading has evolved and how to stay safe in 2026.",
    category: "Foundation",
    heroImage: "/images/learn/online-trading.jpg",
    metaTitle: "Online Trading Guide | Safety & Technology in 2026 | Drawdown",
    metaDescription: "Learn the essentials of online trading. From cybersecurity to platform choice, understand how to trade safely in the modern digital age.",
    content: [
      {
        heading: "The Digital Evolution",
        text: "Online trading has democratized the markets, allowing anyone with a smartphone to trade global assets. However, this accessibility comes with risks. In 2026, cybersecurity and choosing a high-speed, stable platform are just as important as your trading strategy."
      }
    ],
    faqs: [
      { question: "What is the best device for online trading?", answer: "A high-performance desktop or laptop with dual monitors is best for analysis, but a modern mobile app (like TradingView or IG) is essential for monitoring positions." }
    ]
  },
  {
    slug: "futures-trading",
    title: "Futures Trading",
    description: "Master the professional's market. Learn to trade standardized contracts for indices, commodities, and currencies.",
    category: "Market",
    heroImage: "/images/learn/futures-trading.jpg",
    metaTitle: "Futures Trading Guide | Master CME & Eurex Markets | Drawdown",
    metaDescription: "Learn to trade futures contracts. Master the mechanics of margin, expiration, and standardized contracts for global financial markets.",
    content: [
      {
        heading: "Institutional-Grade Contracts",
        text: "Futures are standardized contracts to buy or sell an asset at a future date. They are traded on centralized exchanges like the CME. Unlike CFDs, futures provide transparent volume data, making them the preferred choice for professional order flow traders."
      }
    ],
    faqs: [
      { question: "How much capital do I need for futures?", answer: "Futures typically require more capital than CFDs or spread betting, though 'Micro Futures' have made the market much more accessible to retail traders." }
    ]
  }
  ,
  {
    slug: "prop-firm-trading",
    title: "How to Trade with a Prop Firm in the UK",
    subtitle: "A complete institutional guide to trading funded capital, passing challenges, and handling HMRC taxes in the UK.",
    description: "The proprietary trading industry offers retail traders access to six-figure capital. But navigating the rules, trailing drawdowns, and payout compliance requires an institutional approach. Learn how to select a reputable firm, size risk, and trade professionally.",
    category: "Market",
    difficulty: "Advanced",
    timeToLearn: "6-12 months",
    riskLevel: "High",
    heroImage: "/images/learn/prop-firm.jpg",
    metaTitle: "Prop Firm Trading UK Guide 2026 | Passing Evaluations | Drawdown",
    metaDescription: "Master UK prop firm trading. Learn how evaluations work, drawdown rules, conservative sizing, and tax treatment of funded payouts.",
    honestReality: "Prop firms are not a lottery or a demo account with a cash prize. They are corporate capital managers. 95% of traders fail because they risk 2% to 5% per trade trying to pass in 48 hours. If you want to survive, you must risk 0.25% to 0.5% per trade, treat daily drawdown limits as the absolute ceiling, and build a consistent track record.",
    relatedModules: [
      { href: "/courses/prop-firm-mastery/module-1", title: "How Prop Firms Actually Work", description: "Uncover the demo vs. live server mechanics of prop firm operations." },
      { href: "/courses/prop-firm-mastery/module-3", title: "Challenge Rules Deep-Dive", description: "Learn the formulas firms use to calculate daily drawdowns at midnight." },
      { href: "/courses/prop-firm-mastery/module-5", title: "Prop Firm Risk Management", description: "How to scale and protect funded capital with institutional risk parameters." }
    ],
    content: [
      {
        heading: "The Rise of Prop Firm Capital",
        text: "The retail trading landscape has shifted dramatically over the past decade. Previously, if you wanted to trade full-time, you were limited by your own personal savings. If you had a £2,000 account, making a 5% monthly return only generated £100—not enough to live on. Proprietary trading firms (prop firms) solved this problem by providing funded accounts of £10k, £50k, or £200k to skilled traders in exchange for an evaluation fee.\n\nHowever, prop firms are businesses, not charities. They operate on strict risk limits. Under regulations monitored by the Financial Conduct Authority (<a href='https://www.fca.org.uk/' target='_blank' rel='noopener noreferrer'>FCA.org.uk</a>), retail brokers are capped at 30:1 leverage, but prop firms bypass this by keeping evaluations on demo servers. This means they can structure challenges with high leverage, but offset the risk by locking accounts that breach daily drawdown rules.",
      },
      {
        heading: "Selecting a Reputable Firm in the UK",
        text: "Due to the unregulated nature of the demo challenge ecosystem, many predatory firms have entered the market. These firms use wide spreads, hidden slippage, and arbitrary rules to force failures. UK traders should focus exclusively on established firms with multi-year payout histories, such as FTMO or The5ers, and avoid new firms offering 'no evaluation' instant accounts with trailing drawdowns.",
      },
      {
        heading: "Designing Your Sizing Playbook",
        text: "To pass a prop challenge, you must separate profit targets from risk limits. If a challenge has an 8% profit target and a 5% daily drawdown, you have a 1.6:1 ratio of target to risk. If you risk 1% per trade, five consecutive losses breaches the daily limit. However, if you risk 0.25% per trade, you have a 20-trade buffer. You execute your mechanical edge over a larger sample size, letting probability work in your favor.",
      },
      {
        heading: "UK Tax on Prop Payouts under HMRC",
        text: "Many UK traders believe prop payouts are tax-free under spread betting laws. This is false. Because you are trading demo capital and the prop firm pays you a contractor fee, HMRC classifies payouts as self-employed trading income, subject to standard Income Tax and National Insurance. Setting up a Limited Company is often the most tax-efficient method to manage payout drawdowns.",
      }
    ],
    faqs: [
      { question: "Are prop firm payouts tax-free in the UK?", answer: "No. Unlike spread betting, prop firm payouts are classified as self-employed service income by HMRC, subject to standard income tax. They are not tax-free." },
      { question: "What is the daily drawdown calculation?", answer: "Most firms calculate daily drawdown based on your equity or balance at midnight server time. If you have open floating profits at midnight, your daily limit moves up, creating a trailing risk for swing trades." },
      { question: "Can I use EAs or robots?", answer: "Reputable firms allow Expert Advisors (EAs), but forbid copy-trading or using public bots that generate identical trades across hundreds of accounts." },
      { question: "Which is better: 1-phase or 2-phase challenges?", answer: "2-phase challenges are generally better as they have static maximum drawdowns, whereas 1-phase challenges often use trailing drawdowns that lock in profits and squeeze your risk margin." }
    ]
  },
  {
    slug: "backtesting-strategies",
    title: "How to Backtest a Trading Strategy Properly",
    subtitle: "A rigorous mathematical guide to verifying trading edge across historical tick data.",
    description: "Most retail traders backtest three weeks of data, get a 70% win rate, and start trading real capital. This guide teaches the institutional approach: statistical sample sizing, MAE optimization, and Monte Carlo stress testing.",
    category: "Strategy",
    difficulty: "Intermediate",
    timeToLearn: "1-2 months",
    riskLevel: "Low",
    heroImage: "/images/learn/backtester.jpg",
    metaTitle: "How to Backtest a Trading Strategy Properly | Drawdown",
    metaDescription: "Learn how to backtest trading strategies like an institutional analyst. Master sample sizing, expectancy, profit factor & Monte Carlo stress testing.",
    honestReality: "Backtests are not proof of future profits. They are proof that your strategy rules were historically profitable. Hindsight is 20/20; it is easy to mark winning entries on a static chart. To build a valid backtest, you must use TradingView replay mode, advance bar-by-bar, and log execution slip and spread fees.",
    relatedModules: [
      { href: "/courses/the-backtester/module-2", title: "Manual Backtesting Method", description: "How to use bar replay in TradingView correctly to avoid hindsight bias." },
      { href: "/courses/the-backtester/module-5", title: "Key Metrics Explained", description: "Understand win rate, profit factor, and maximum adverse excursion (MAE)." },
      { href: "/courses/the-backtester/module-7", title: "Monte Carlo Simulation", description: "Stress-test strategy parameters against randomized trade sequences." }
    ],
    content: [
      {
        heading: "Why Backtesting is Non-Negotiable",
        text: "In any professional business, you wouldn't launch a product without testing it. In trading, your strategy is your product. Backtesting provides the statistical proof that your rules generate a positive expectancy over a large sample size. Without this data, you will abandon your strategy during the first normal drawdown sequence of 5 or 6 losses.",
      },
      {
        heading: "The Danger of Hindsight Bias",
        text: "The biggest mistake in backtesting is scrolling back on a chart and highlighting 'obvious' entries. In real-time, you do not see the right side of the screen. You must use TradingView's Bar Replay tool, pick a random start date, and make execution decisions bar-by-bar to replicate real-time market pressure.",
      },
      {
        heading: "Key Metrics: Beyond Win Rate",
        text: "A 70% win rate is useless if your average loss is three times your average win. You must focus on **Expectancy** and **Profit Factor**. Expectancy measures the average return per trade in R-multiples. A profit factor above 1.5 indicates a robust strategy that can survive structural market shifts.",
      },
      {
        heading: "Monte Carlo Stress Testing",
        text: "Markets are non-linear. Even if your strategy wins 60% of the time, those wins and losses are randomly distributed. A Monte Carlo simulation randomizes the sequence of your backtested trades thousands of times to calculate the probability of your account hitting drawdown limits under extreme volatility.",
      }
    ],
    faqs: [
      { question: "How many trades do I need for a valid backtest?", answer: "You need a minimum sample size of 100 to 200 trades, spanning at least 12 months, to ensure your strategy has been tested across varying market cycles." },
      { question: "What is Expectancy?", answer: "Expectancy is the average amount you win or lose per trade. It is calculated as (Win Rate * Average Win Size) - (Loss Rate * Average Loss Size). It must be positive." },
      { question: "What is MAE (Maximum Adverse Excursion)?", answer: "MAE measures the maximum drawdown a trade experiences before moving to target. Logging MAE helps you optimize stop-loss placement to prevent premature exits." },
      { question: "Should I automate my backtesting?", answer: "Automation via Pine Script is fast, but manual backtesting builds chart fluency. A hybrid approach of coding the rules and manually verifying wicks is recommended." }
    ]
  },
  {
    slug: "macro-trading",
    title: "Macro Trading for Retail Traders — Understanding the Big Picture",
    subtitle: "How to analyze central bank policy cycles, interest rates, and economic cycles to trade currencies.",
    description: "Price action shows you where price is, but macroeconomics tells you why it moves. Learn to read central bank statements, monitor interest rate differentials, and build a weekly directional bias.",
    category: "Market",
    difficulty: "Advanced",
    timeToLearn: "6-12 months",
    riskLevel: "Medium",
    heroImage: "/images/learn/macro.jpg",
    metaTitle: "Macro Trading for Retail Traders | Economic Data Cycles | Drawdown",
    metaDescription: "Learn macro trading. Master central bank policy cycles, interest rate differentials, inflation data (CPI/PPI/PCE), and weekly bias systems.",
    honestReality: "Macro trading is not about predicting the news. Professional desks do not guess NFP or CPI numbers. They analyze how deviations from market consensus shift central bank expectations, and trade the subsequent institutional trend.",
    relatedModules: [
      { href: "/courses/macro-trader/module-1", title: "Central Bank Policy Cycles", description: "How BoE, Fed, and ECB policy shifts drive global capital rotation." },
      { href: "/courses/macro-trader/module-9", title: "Building a Weekly Macro Bias", description: "Assemble a weekly playbook matching macro bias with technical charts." },
      { href: "/courses/macro-trader/module-10", title: "The Unified Model", description: "Learn to combine top-down macro bias with bottom-up technical entries." }
    ],
    content: [
      {
        heading: "Price Action is Only Half the Story",
        text: "Technical analysis is excellent for timing entries, but it operates in a vacuum. Major institutional trends on daily and weekly charts are driven entirely by macroeconomic capital flows. Yield-seeking capital flows globally to countries with high interest rates. Understanding this flow lets you trade with the macro tide.",
      },
      {
        heading: "Central Banks: The Engine of Yield",
        text: "Central banks like the Bank of England (<a href='https://www.bankofengland.co.uk/' target='_blank' rel='noopener noreferrer'>BoE.co.uk</a>) manipulate benchmark interest rates to balance inflation and growth. Under guidelines from the European Securities and Markets Authority (ESMA), retail brokers quote exchange rates that reflect these differentials. A central bank entering a tightening cycle triggers long-term currency appreciation.",
      },
      {
        heading: "The Economic Data Hierarchy",
        text: "Not all news moves price. Inflation data (CPI, PCE) and employment releases (NFP) carry the highest weight. We focus on Core Inflation metrics (excluding volatile food and energy) to gauge the underlying structural trends that central bank policymakers actually track.",
      },
      {
        heading: "Building a Weekly Macro Bias",
        text: "Professional traders build their directional playbook before the weekly open. By mapping central bank hawkish/dovish alignments and auditing the economic calendar, you define a weekly directional bias. You only take technical entries that align with the macro direction.",
      }
    ],
    faqs: [
      { question: "How do interest rates affect currencies?", answer: "Capital flows toward yield. A country raising interest rates attracts foreign investment, increasing demand for its currency and driving exchange rates up." },
      { question: "What is hawkish vs. dovish?", answer: "Hawkish policy favors high interest rates to cool inflation (bullish). Dovish policy favors low interest rates to stimulate growth (bearish)." },
      { question: "Should I trade during high-impact news releases?", answer: "No. Liquidity providers withdraw orders during releases like CPI or NFP, causing wide spreads and slippage. Wait for the data to print, and trade the subsequent trend." },
      { question: "What is the Carry Trade?", answer: "A carry trade involves borrowing capital in a currency with a low interest rate (like JPY) and investing it in a currency with a high interest rate (like AUD) to capture the yield spread." }
    ]
  },
  {
    slug: "ai-trading-tools",
    title: "AI Trading Tools in 2026 — What They Can and Can't Do",
    subtitle: "A practical guide to integrating large language models and automation into your trading workflow.",
    description: "Artificial intelligence is not replacing traders, but it is replacing traders who refuse to adapt. Learn how to use LLMs as research partners, build custom scanners, and automate TradingView strategies.",
    category: "Tools",
    difficulty: "Advanced",
    timeToLearn: "2-4 months",
    riskLevel: "Medium",
    heroImage: "/images/learn/ai-tools.jpg",
    metaTitle: "AI Trading Tools UK 2026 | Pine Script & Automation | Drawdown",
    metaDescription: "Learn to build custom AI trading workflows. Program Pine Script, automate journal analysis, and connect TradingView webhooks with Claude.",
    honestReality: "AI cannot predict price. If you ask an LLM for trading signals, you are gambling. AI is an execution assistant. It is a powerful tool to automate data logging, parse policy text, and write TradingView Pine Script rapidly.",
    relatedModules: [
      { href: "/courses/ai-trader/module-2", title: "AI Pre-Trade Research", description: "Use Claude to summarize policy statements and analyze economic calendars." },
      { href: "/courses/ai-trader/module-5", title: "Pine Script Fundamentals", description: "Learn to code your strategy rules into TradingView using AI code generators." },
      { href: "/courses/ai-trader/module-11", title: "Advanced Webhook Automation", description: "Connect TradingView alerts to automated execution engines securely." }
    ],
    content: [
      {
        heading: "The AI Revolution: Hype vs. Reality",
        text: "The financial markets are flooded with promises of automated AI trading bots. However, institutions don't use simple LLMs to place live trades. AI is an optimization tool. It allows retail traders to process vast amounts of macro news, code strategies, and audit logs with institutional efficiency.",
      },
      {
        heading: "Claude and GPT as Research Partners",
        text: "You can upload a central bank statement directly to Claude and ask it to highlight hawkish or dovish shifts compared to previous releases. This cuts research time from hours to seconds, letting you build a weekly directional playbook with ease.",
      },
      {
        heading: "No-Code Pine Script Coding",
        text: "Pine Script is TradingView's native coding language. AI has made scripting accessible to non-coders. By prompting Claude with precise mechanical rules, you can generate clean Pine Script indicators and strategy backtesters to verify your edge.",
      },
      {
        heading: "Webhook and API Bridge Automation",
        text: "Once you have verified a mechanical edge, you can configure TradingView to send alerts via JSON webhooks to execution bridges like PineConnector. This executes trades directly on your broker account, removing human execution latency and emotional bias.",
      }
    ],
    faqs: [
      { question: "Can Claude write TradingView indicators?", answer: "Yes. Claude is highly fluent in Pine Script. By providing precise rules, you can generate custom indicators and strategy testers without writing code." },
      { question: "How do I use AI to audit my trade journal?", answer: "Export your trade history in CSV format and upload it to Claude. Prompt it to analyze your execution times and drawdown sequences to find behavioral leaks." },
      { question: "Is automated trading safe for retail traders?", answer: "Only if you use strict API keys and daily exposure caps. Code bugs can empty an account rapidly; human-in-the-loop oversight is always recommended." },
      { question: "Do I need a coding background?", answer: "No. Modern AI tools allow you to generate code, scanners, and spreadsheets using simple natural language prompts." }
    ]
  },
  {
    slug: "ftmo-challenge",
    title: "How to Pass an FTMO Challenge — The Honest Guide",
    subtitle: "A math-driven guide to passing the FTMO evaluation without gambling your registration fee.",
    description: "FTMO is the industry benchmark for prop firm capital. But passing requires strict compliance with daily drawdowns and consistency rules. Learn the conservative sizing playbook to pass Phase 1 and Phase 2.",
    category: "Market",
    difficulty: "Advanced",
    timeToLearn: "3-6 months",
    riskLevel: "High",
    heroImage: "/images/learn/ftmo.jpg",
    metaTitle: "How to Pass an FTMO Challenge | The Sizing Playbook | Drawdown",
    metaDescription: "Learn how to pass the FTMO challenge. Master the 5% daily drawdown rule, consistency requirements, and conservative position sizing.",
    honestReality: "FTMO makes most of its money from failed challenge fees, not profit splits. The rules are designed to exploit retail greed. If you try to pass in 48 hours, you are gambling. Passing requires a multi-week, disciplined process.",
    relatedModules: [
      { href: "/courses/prop-firm-mastery/module-3", title: "Challenge Rules Deep-Dive", description: "Master the midnight daily drawdown calculations on FTMO." },
      { href: "/courses/prop-firm-mastery/module-4", title: "Passing a Challenge", description: "The conservative 0.5% risk playbook that passes evaluations systematically." }
    ],
    content: [
      {
        heading: "The Toughest Exam in Retail Trading",
        text: "FTMO offers funded accounts up to $200,000. However, the evaluation has a 90% failure rate. This is not because the targets are impossible, but because retail traders do not treat the challenge as a risk management test. The challenge is designed to filter out gamblers.",
      },
      {
        heading: "The Midnight Drawdown Rule",
        text: "FTMO calculates daily drawdown (5%) based on your equity or balance at midnight server time (CE(S)T). If you hold swing trades in profit at midnight, your daily stop-out limit moves up. If the market retraces the next day, you can breach the limit even if your account is in net profit.",
      },
      {
        heading: "Sizing Down to Survive",
        text: "To hit the 10% target in Phase 1, you do not need 3% risk per trade. A normal losing streak will breach your daily limit. Risk exactly 0.5% of starting equity per trade. This gives you a 10-trade buffer on daily limits, allowing you to survive volatility waves.",
      },
      {
        heading: "Consistency and News Trading Rules",
        text: "FTMO restricts trading during high-impact news releases for funded accounts. Holding trades through Tier-1 data like NFP or CPI can trigger immediate breaches. You must audit the economic calendar daily and close intraday trades before releases.",
      }
    ],
    faqs: [
      { question: "What is the daily loss limit on FTMO?", answer: "The daily loss limit is 5% of the starting balance of the day, reset at midnight CE(S)T. It includes both closed losses and open floating equity drawdown." },
      { question: "How long do I have to pass the FTMO challenge?", answer: "FTMO has no time limits. You can take as long as you need to achieve the profit target, which reduces the pressure to over-leverage." },
      { question: "Can I trade news on FTMO?", answer: "News trading is permitted during evaluation phases, but heavily restricted on funded (FTMO Account) stages, where you cannot execute trades 2 minutes before and after Tier-1 news." },
      { question: "What is the profit split on FTMO?", answer: "Successful funded traders receive an 80% split of profits, which can be scaled up to 90% through their enterprise growth scaling plan." }
    ]
  }
];
