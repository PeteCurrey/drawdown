const fs = require('fs');

let code = fs.readFileSync('src/lib/data/learn-to-trade.ts', 'utf8');

const dayTradingObj = `  {
    slug: "day-trading",
    title: "Day Trading",
    subtitle: "The reality of intraday execution. No Lamborghinis. No signal groups. Just process, risk management, and statistical edge.",
    description: "Master the highest-intensity trading environment. Learn how to navigate the London Open, manage intraday volatility, and treat day trading like a mechanical business rather than a casino.",
    category: "Strategy",
    difficulty: "Very High",
    timeToLearn: "12-24 months",
    riskLevel: "Very High",
    heroImage: "/images/learn/day-trading.jpg",
    metaTitle: "Day Trading Guide UK 2026 | The Institutional Path | Drawdown",
    metaDescription: "Learn to day trade the UK markets without the guru fluff. Master the London Open, manage risk like a professional, and build a profitable edge.",
    honestReality: "The internet will tell you that day trading is a path to quick wealth. The honest reality is that 90% of day traders fail within 90 days. It takes a minimum of 12 to 24 months of consistent, disciplined practice to achieve profitability. You will not get rich this week. You will blow an account. But if you survive the learning curve, build a strict mechanical edge, and treat it like a data-driven business, it is a highly scalable profession. Stop looking for shortcuts.",
    content: [
      {
        heading: "What Day Trading Actually Is",
        text: "Day trading involves opening and closing financial positions within the same trading day. Unlike swing trading or investing, a day trader never holds a position overnight. The primary objective is to exploit small, highly liquid price movements during the most volatile hours of the day.\\n\\nRetail traders often view day trading as a fast-paced adrenaline rush. Professional day traders view it as incredibly boring. It is the repetitive execution of a strictly defined edge over hundreds of trades. The goal is not to 'make a killing' on a single trade, but to capture small, consistent percentage gains that compound over time.\\n\\nThe biggest advantage of day trading is the elimination of 'overnight risk.' Because you close all positions before the market closes, you are completely immune to catastrophic news events that happen while you are asleep. If a major geopolitical crisis breaks out on a Saturday, a day trader's capital is safely sitting in cash, while swing traders wake up on Monday morning to massive, unpreventable losses.",
        richBlocks: [
          {
            type: 'proTip',
            tip: 'If you feel adrenaline while in a trade, your position size is too big. Trading should feel like data entry. It should be entirely mechanical and devoid of emotion.'
          } as ProTipBlock
        ]
      },
      {
        heading: "The London Session — Your Home Advantage",
        text: "The financial markets are active 24/5, but they are not created equal. The most critical advantage a UK-based trader has is geography. The London session is the undisputed center of global foreign exchange trading, accounting for over 40% of all daily FX volume. \\n\\nThe London Open (8:00 AM GMT) provides the massive injection of institutional liquidity required for clean, directional price action. When the New York session opens at 1:00 PM GMT, creating the 'London/New York Overlap,' the market reaches its absolute peak volume.\\n\\nYou do not need to sit in front of the charts for 12 hours a day. The highest probability setups occur specifically during the first two hours of the London Open, and the first two hours of the New York Open. If you can dedicate 2-3 focused hours a day during these specific windows, you have access to the cleanest price action in the world.\\n\\nTrading outside of these high-volume windows (such as the late Asian session) often results in 'choppy,' unpredictable price action where technical setups fail due to a lack of institutional momentum.",
        bullets: [
          "London Open (8:00 AM GMT): Highest volatility, ideal for breakout and momentum strategies.",
          "London/NY Overlap (1:00 PM - 4:00 PM GMT): Maximum liquidity, ideal for trading major US economic data.",
          "Asian Session: Lower volume, best avoided by beginner day traders looking for large directional moves."
        ]
      },
      {
        heading: "UK-Specific Advantages: The Structural Edge",
        text: "Trading in the UK provides massive structural advantages over traders in the US or Europe. If you are serious about day trading, you must utilize these domestic benefits.\\n\\nFirst is the tax structure. Under current HMRC regulations, profits made from Spread Betting are classified as gambling, making them completely exempt from Capital Gains Tax (CGT) and Stamp Duty. This means you keep 100% of your profits. Conversely, trading via CFDs or traditional shares subjects you to CGT.\\n\\nSecond is the absence of the Pattern Day Trader (PDT) rule. In the United States, traders with under $25,000 in their account are legally restricted from taking more than three day trades in a five-day period. In the UK, there is no PDT rule. You can execute 50 trades a day on a £500 account if you wish.\\n\\nFinally, there is the Financial Services Compensation Scheme (FSCS). If you trade with an FCA-regulated broker, your capital is protected up to £85,000 if the broker goes bankrupt. This is a massive layer of security that offshore, unregulated brokers cannot provide.",
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
        text: "You do not need six monitors and a Bloomberg terminal to be a profitable day trader. You need three things: capital you can afford to lose, a fast execution platform, and a rigid data-collection system.\\n\\nCapital: Do not start day trading with money you need for rent or groceries. The psychological pressure of 'needing' to make money will force you to take terrible trades. Start with a small amount of risk capital, or better yet, use a demo account for the first 6 months to prove you have a statistical edge before risking real money.\\n\\nExecution: You need a broker with Direct Market Access (DMA) or an ECN model that provides 'raw spreads.' In day trading, you are fighting for pips. If your broker has a 2-pip spread on EUR/USD, you are starting every trade heavily in the negative. You need spreads of 0.0 to 0.2 pips with a small fixed commission per lot.\\n\\nData Collection: This is what separates the professionals from the gamblers. You must use a digital trade journal (like TradeZella or a custom spreadsheet) to track every single entry, exit, win rate, and drawdown. You cannot improve what you do not measure.",
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
        text: "Risk management is the only thing standing between you and a blown account. The market is an inherently chaotic environment; you cannot control what the price will do next. The only thing you can absolutely control is how much money you lose when you are wrong.\\n\\nThe golden rule of institutional trading is the 1% Rule. You must never risk more than 1% of your total account equity on any single trade. If you have a £10,000 account, your maximum acceptable loss per trade is £100.\\n\\nBy risking only 1%, you guarantee your survival. Even if you hit a terrible losing streak and lose 10 trades in a row, you have only lost roughly 10% of your account. You live to trade another day. Retail traders who risk 10% or 20% per trade will inevitably blow their entire account during their first normal drawdown period.",
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
        text: "To succeed in day trading, you do not need to know 50 different strategies. You only need to master one or two high-probability setups and execute them flawlessly. The following three setups are the foundation of institutional retail trading.\\n\\n1. The Liquidity Sweep: This occurs when price approaches a highly obvious support or resistance level (where retail traders have placed their stop-losses). The institutions drive the price quickly through the level, trigger the stops (absorbing the liquidity), and immediately reverse the price. You enter on the reversal back inside the range, placing your stop tightly behind the newly created wick.\\n\\n2. The Break and Retest: When a major market structure level is broken with high volume, do not chase the breakout. Wait for the inevitable 'pullback' or 'retest' of that broken level. What was once resistance becomes support. Enter on the retest, using a lower-timeframe confirmation (like an engulfing candle) to validate the entry.\\n\\n3. The Session Open Momentum Trade: This is specifically traded at 8:00 AM London Open or 1:00 PM NY Open. You identify the consolidation range that formed during the quiet Asian session. As London volume hits the market, price will aggressively break out of this range. You trade in the direction of the initial high-volume institutional push.",
        bullets: [
          "Never trade the initial breakout; always wait for the retest or the sweep.",
          "Volume is the ultimate validator. A breakout with low volume is a trap.",
          "Pick ONE of these three setups and master it. Ignore everything else."
        ]
      },
      {
        heading: "The Most Common Day Trading Mistakes",
        text: "The reason 90% of day traders fail is because human psychology is biologically wired to do the exact opposite of what profitable trading requires. \\n\\nThe most destructive mistake is 'Revenge Trading.' This occurs immediately after taking a painful loss. Instead of accepting the loss as a business expense, the trader gets angry and immediately re-enters the market with double the size, desperate to win their money back. This is how accounts are blown in a single afternoon.\\n\\nThe second major mistake is 'Over-Trading.' Because day trading is fast-paced, beginners feel the need to always be in a trade. If you take 10 trades a day, you are almost certainly forcing sub-par setups. A professional day trader might only take 2 or 3 extremely high-quality setups per week.\\n\\nFinally, there is the failure to use a hard stop-loss. Mental stop-losses do not work. When the price hits your mental stop, your ego will convince you to 'give it just a little more room to breathe.' A hard stop-loss removes the decision-making process entirely.",
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
        text: "If you are day trading, your broker is your most critical business partner. You cannot trade effectively if your broker has massive slippage, wide spreads, or freezes during high-impact news events.\\n\\nFor UK day traders, we recommend FCA-regulated brokers that offer 'raw spread' accounts or tight spread betting options. You want a broker that uses an ECN (Electronic Communication Network) execution model, which routes your orders directly to tier-1 liquidity providers rather than taking the other side of your trade (B-Booking).\\n\\nAlways verify that the broker is fully regulated by the Financial Conduct Authority (FCA). This ensures your funds are segregated from the broker's operating capital and protects you under the FSCS framework.",
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
  }`;

const forexTradingObj = `  {
    slug: "forex-trading",
    title: "Forex Trading",
    subtitle: "The most liquid market on earth. Master currency pairs, leverage, and macroeconomic drivers without the guru promises of overnight wealth.",
    description: "The complete institutional guide to trading the Foreign Exchange market. Learn how to trade the major pairs, understand central bank policy, and manage extreme leverage.",
    category: "Market",
    difficulty: "High",
    timeToLearn: "12-24 months",
    riskLevel: "High",
    heroImage: "/images/learn/forex-trading.jpg",
    metaTitle: "Forex Trading Guide UK 2026 | Master the Currency Markets | Drawdown",
    metaDescription: "Learn to trade Forex properly. Understand pips, lots, leverage, and the macroeconomic forces that actually move the currency markets.",
    honestReality: "The Forex industry is heavily marketed as a 'get rich quick' scheme to retail traders. The reality is that Forex is a highly efficient, hyper-competitive market dominated by central banks and institutional algorithms. The extreme leverage offered by brokers means you can double your money in a day, but it also means you can blow your entire account in a single bad trade. Success in FX requires a 12-24 month commitment to mastering both technical execution and deep macroeconomic understanding.",
    content: [
      {
        heading: "The Mechanics of the FX Market",
        text: "The Foreign Exchange (Forex) market is the largest and most liquid financial market in the world, processing over $7 trillion in daily volume. Unlike the stock market, which operates through centralized exchanges like the LSE or NYSE, Forex is completely decentralized. It is an Over-The-Counter (OTC) market where a global network of banks, institutions, and retail brokers trade currencies directly with one another.\\n\\nForex operates 24 hours a day, 5 days a week. The trading day follows the sun, opening in Sydney, moving to Tokyo, then to London, and finally closing in New York. \\n\\nCurrencies are always traded in pairs (e.g., GBP/USD). When you trade a pair, you are simultaneously buying one currency and selling the other. If you go 'long' on GBP/USD, you are betting that the British Pound will strengthen relative to the US Dollar. The extreme liquidity of the FX market means that 'slippage' is rarely an issue for major pairs, and execution is nearly instantaneous.",
        richBlocks: [
          {
            type: 'proTip',
            tip: 'Focus exclusively on the "Majors" (pairs containing the US Dollar, like EUR/USD, GBP/USD, USD/JPY) for your first year. They have the tightest spreads, the cleanest technical structure, and the most predictable volume.'
          } as ProTipBlock
        ]
      },
      {
        heading: "Understanding Pips, Lots, and Leverage",
        text: "To trade Forex, you must understand the mathematical language of the market.\\n\\n**The Pip:** A 'pip' (Percentage in Point) is the standard unit of measurement for price movement in Forex. For most pairs, it is the fourth decimal place. If GBP/USD moves from 1.2500 to 1.2501, it has moved 1 pip. \\n\\n**The Lot:** Because a 1-pip movement is mathematically tiny, you have to trade large amounts of currency to make a meaningful profit. A 'Standard Lot' is 100,000 units of currency. A 'Mini Lot' (0.10) is 10,000 units. A 'Micro Lot' (0.01) is 1,000 units.\\n\\n**Leverage:** How does a retail trader buy 100,000 units of currency? Leverage. Your broker lends you the money. Under UK FCA rules, retail traders are limited to 30:1 leverage for major pairs. This means to control a £100,000 position, you only need £3,333 in your account as 'margin.' Leverage multiplies your profits, but it equally multiplies your losses. It is a tool of destruction in the hands of an amateur.",
        bullets: [
          "Standard Lot (1.00) = Roughly $10 per pip movement.",
          "Mini Lot (0.10) = Roughly $1 per pip movement.",
          "Micro Lot (0.01) = Roughly $0.10 per pip movement."
        ]
      },
      {
        heading: "UK-Specific Advantages: The Structural Edge",
        text: "Trading Forex in the UK provides massive structural advantages over traders in the US or Europe. If you are serious about FX, you must utilize these domestic benefits.\\n\\nFirst is the tax structure. Under current HMRC regulations, profits made from Spread Betting are classified as gambling, making them completely exempt from Capital Gains Tax (CGT). You can trade the exact same FX pairs, with the exact same charts, but keep 100% of your profits. \\n\\nSecond is the absence of the Pattern Day Trader (PDT) rule. In the US, traders with small accounts are restricted from taking multiple day trades. In the UK, there is no PDT rule. \\n\\nFinally, there is the Financial Services Compensation Scheme (FSCS). If you trade with an FCA-regulated broker, your capital is protected up to £85,000 if the broker fails. This is a massive layer of security.",
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
        text: "You do not need to know 50 different strategies to trade FX. You need to master one or two high-probability setups.\\n\\n1. **The London Breakout (Session Open):** The Asian session (Tokyo/Sydney) is typically low-volume, causing price to consolidate in a tight range. When London opens at 8:00 AM GMT, massive institutional volume hits the market. You trade the aggressive breakout of the Asian consolidation range, following the institutional momentum.\\n\\n2. **The Liquidity Sweep:** Institutions need liquidity to fill massive orders. They find this liquidity where retail traders place their stop-losses (just above major highs or below major lows). The setup involves waiting for price to pierce a major level, trigger the retail stops, and then aggressively reverse back inside the range. You enter on the reversal.\\n\\n3. **The Break and Retest:** When a major support or resistance level is broken with high volume, do not chase the breakout. Wait for price to pull back and 'retest' the broken level. What was once resistance often becomes support. Enter on the retest using a lower-timeframe confirmation.",
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
        text: "Risk management is the only thing standing between you and a blown account. The golden rule is the 1% Rule. You must never risk more than 1% of your total account equity on any single trade.\\n\\nTo do this, you must calculate your position size mathematically before every trade. You do not just guess and pick '0.5 lots'. You calculate the exact distance between your entry and your stop-loss, and adjust your lot size so that if the stop is hit, you lose exactly 1%.",
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
        text: "Technical analysis tells you *when* to enter a trade, but Macroeconomics tells you *why* the market is moving. Currencies are ultimately valued based on the economic health of their respective countries and the monetary policies of their Central Banks.\\n\\nThe single most important driver of currency valuation is Interest Rates. If the Bank of England (BoE) raises interest rates, it makes holding British Pounds more attractive to global investors, causing GBP to appreciate against other currencies. \\n\\nYou must track the 'Economic Calendar' daily. Major news events—like the US Non-Farm Payrolls (NFP) or Central Bank press conferences—will cause massive, immediate volatility. Professional traders do not guess what the news will be; they wait for the news to drop, let the algorithms battle it out, and then trade the resulting structural trend.",
        bullets: [
          "Always check the Economic Calendar before trading.",
          "Never hold a day trade through a major Tier-1 news event like CPI or NFP.",
          "Interest rate divergence between two countries dictates the long-term trend of their currency pair."
        ]
      },
      {
        heading: "The Danger of Correlation",
        text: "One of the most common ways retail traders blow their accounts is by ignoring currency correlation. \\n\\nIf you buy EUR/USD, buy GBP/USD, and buy AUD/USD at the same time, you might think you have taken three diversified trades. In reality, you have essentially taken the exact same trade three times: you are heavily shorting the US Dollar. \\n\\nIf the US Dollar suddenly strengthens due to a surprise news event, all three trades will hit your stop-loss simultaneously. Instead of risking 1% on one trade, you have just lost 3% on a highly correlated portfolio error. Always be aware of your total exposure to a single currency across all your open positions.",
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
        text: "If you are trading Forex, your broker is your most critical business partner. You cannot trade effectively if your broker has massive slippage, wide spreads, or freezes during high-impact news events.\\n\\nFor UK traders, we recommend FCA-regulated brokers that offer 'raw spread' accounts or tight spread betting options. You want a broker that uses an ECN (Electronic Communication Network) execution model, which routes your orders directly to tier-1 liquidity providers.",
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
  }`;

const start1 = code.indexOf('slug: "day-trading"') - 20;
let techStart = code.indexOf('{', start1);
let techEnd = techStart;
let braces = 0;
for (let i = techStart; i < code.length; i++) {
  if (code[i] === '{') braces++;
  if (code[i] === '}') {
    braces--;
    if (braces === 0) {
      techEnd = i + 1;
      break;
    }
  }
}
code = code.substring(0, techStart) + dayTradingObj + code.substring(techEnd);

const start2 = code.indexOf('slug: "forex-trading"') - 20;
let forexStart = code.indexOf('{', start2);
let forexEnd = forexStart;
braces = 0;
for (let i = forexStart; i < code.length; i++) {
  if (code[i] === '{') braces++;
  if (code[i] === '}') {
    braces--;
    if (braces === 0) {
      forexEnd = i + 1;
      break;
    }
  }
}
code = code.substring(0, forexStart) + forexTradingObj + code.substring(forexEnd);

fs.writeFileSync('src/lib/data/learn-to-trade.ts', code);
console.log('Batch 1 complete');
