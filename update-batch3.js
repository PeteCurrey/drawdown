const fs = require('fs');

let code = fs.readFileSync('src/lib/data/learn-to-trade.ts', 'utf8');

const technicalAnalysisObj = `  {
    slug: "technical-analysis",
    title: "Technical Analysis",
    subtitle: "The art of reading institutional footprints. Forget magic indicators; focus on structure, liquidity, and momentum.",
    description: "The complete guide to technical analysis for modern traders. Learn how to read price action, identify true support and resistance, and trade alongside institutional order flow.",
    category: "Strategy",
    difficulty: "Intermediate",
    timeToLearn: "12-24 months",
    riskLevel: "Medium",
    heroImage: "/images/learn/technical-analysis.jpg",
    metaTitle: "Technical Analysis Guide UK 2026 | Master Price Action | Drawdown",
    metaDescription: "Learn to read market charts properly. From institutional support and resistance to advanced trend analysis, master the tools of technical trading.",
    honestReality: "The internet is flooded with 'gurus' selling complex trading algorithms that look like spaghetti on a chart. The reality is that institutional traders at hedge funds do not use MACD, RSI, or Stochastics to make million-dollar decisions. They use raw price action. They look at structure, volume, and areas of deep liquidity. Technical indicators are mathematically derived from past price; they are inherently lagging. By the time the moving average crosses over, the institutional move is already finished. We teach you to strip your charts bare and read the raw data.",
    content: [
      {
        heading: "The Language of the Market: Price Action",
        text: "Technical analysis (TA) is the study of past market data to forecast probable future price movements. It is based on the foundational premise that market action 'discounts' everything—meaning all known fundamental information, economic data, and geopolitical fears are already reflected in the current price on the chart.\\n\\n'Price Action' is the purest form of TA. It involves making trading decisions based entirely on the naked chart, without the distraction of lagging technical indicators. A price action trader looks at the size of the candles, the speed of the movement (momentum), and where the price struggles to pass (structure).",
        richBlocks: [
          {
            type: 'proTip',
            tip: 'Delete every indicator off your chart. Trade with naked candles for one week. You will instantly realize how much faster your brain processes market structure without the distraction of a glowing red line.'
          } as ProTipBlock
        ]
      },
      {
        heading: "Market Structure: The Only Thing That Matters",
        text: "The market only ever does three things: it trends up, it trends down, or it consolidates sideways. \\n\\nAn Uptrend is a series of Higher Highs (HH) and Higher Lows (HL).\\nA Downtrend is a series of Lower Highs (LH) and Lower Lows (LL).\\nA Consolidation (or Range) is when price bounces between equal highs and equal lows.\\n\\nYour entire job as a technical analyst is to identify the current structure and trade in the direction of it. The moment an uptrend fails to make a higher high, and instead breaks the previous higher low, the structure has shifted. This 'Break of Structure' (BoS) is your earliest signal that institutional momentum has reversed.",
        bullets: [
          "Trend Following: Buying the Higher Lows in an uptrend is statistically the highest probability trade you can take.",
          "Counter-Trend: Trying to pick the absolute top of a bullish trend is how retail traders lose all their money.",
          "Consolidation: Do not trade the middle of a range. Wait for the breakout."
        ]
      },
      {
        heading: "Support and Resistance vs. Supply and Demand",
        text: "Traditional TA teaches 'Support and Resistance' (S&R)—drawing a horizontal line where price has bounced multiple times. The theory is that if price hits the line a fourth time, it will bounce again. \\n\\nModern institutional TA focuses instead on 'Supply and Demand' zones. Supply and demand zones are specific areas where massive institutional orders were previously injected into the market, causing a rapid, aggressive price imbalance. \\n\\nInstead of a thin S&R line, you draw a broader zone encompassing the last candle before the massive explosive move. The thesis is that institutions have 'unfilled orders' remaining in that zone. When price returns to that zone weeks later, those unfilled orders trigger automatically, causing price to violently reject the zone.",
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
        text: "To succeed with Technical Analysis, you must master the execution of specific, repeatable setups. Here are the three primary setups used by professionals:\\n\\n1. **The Liquidity Sweep (The Trap):** Retail traders place their stop losses directly above obvious Resistance or below obvious Support. Institutions know this. They will intentionally drive the price slightly past the level, hit the retail stops (absorbing their liquidity), and immediately reverse the price. You enter on the reversal back inside the level.\\n\\n2. **The Break and Retest:** When a major structure level breaks with high volume, do not chase it. Wait for the inevitable pullback to retest the broken level. What was once resistance becomes support. Enter on the retest.\\n\\n3. **The Inside Bar Breakout:** An inside bar occurs when a candle's high and low are completely contained within the previous candle. It signals extreme volatility contraction. You trade the breakout of this contraction, placing a tight stop loss below the inside bar.",
        bullets: [
          "Never place your stop loss exactly on a major level. Always leave a buffer.",
          "Wait for the sweep to occur before entering a reversal.",
          "A fast wick below a key level followed by a strong close back inside the range is a powerful entry signal."
        ]
      },
      {
        heading: "Top-Down Analysis",
        text: "You can never look at a single timeframe in isolation. A 5-minute chart might look incredibly bullish, while the Daily chart shows you are driving directly into a massive institutional supply zone.\\n\\nProfessional traders use 'Top-Down Analysis'. This means determining the overall trend on the highest timeframe, and then dropping down to lower timeframes to find a precise entry.\\n\\n1. The Daily Chart (The Compass): Use this to determine the overall trend. Are we making Higher Highs or Lower Lows?\\n2. The 4-Hour Chart (The Map): Use this to draw your major Supply and Demand zones and identify key structure points.\\n3. The 15-Minute Chart (The Sniper Rifle): Use this to wait for price to enter your 4H zone, watch for a change of character, and execute the trade with a tight stop loss.",
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
        text: "Price can be manipulated on lower timeframes, but volume cannot be hidden. Volume is the actual footprint of institutional participation. If price breaks out of a major resistance level, but the volume is significantly lower than average, it is likely a false breakout.\\n\\nConversely, if price is dropping rapidly into a demand zone, but the volume on the down-candles is decreasing while the volume on the up-candles is increasing, it suggests that institutional selling pressure is exhausting and buyers are stepping in.",
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
        text: "You will not master Technical Analysis in a weekend. Reading price action is a visual skill that requires thousands of hours of screen time. It is exactly like learning to read a new language.\\n\\nIt typically takes 12 to 24 months to achieve profitability. The first 6 months are spent memorizing the patterns and losing money because you apply them in the wrong context. The next 6 months are spent learning that context is everything. The second year is when you finally develop the discipline to only trade your 3 specific setups.",
        bullets: [
          "Obvious patterns are usually traps.",
          "Trade the 'break and retest' rather than the initial break.",
          "Always ask: Where is the trapped retail liquidity?"
        ]
      },
      {
        heading: "UK Trading Advantages for TA",
        text: "Applying Technical Analysis in the UK comes with distinct structural advantages. If you use a Spread Betting account to execute your technical setups, your profits are entirely exempt from Capital Gains Tax (CGT) under HMRC rules.\\n\\nFurthermore, because the UK has no Pattern Day Trader (PDT) rule, you can execute as many intraday technical setups as your strategy demands, even on a small account. Finally, trading with an FCA-regulated broker ensures your capital is protected by the FSCS, allowing you to focus entirely on the charts.",
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
  }`;

const candlestickPatternsObj = `  {
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
        text: "Before you can read patterns, you must understand the single candle. A Japanese candlestick visually represents four data points over a specific timeframe (e.g., 5 minutes, 1 day):\\n\\n1. Open: The price at the start of the timeframe.\\n2. High: The absolute highest price reached during the timeframe.\\n3. Low: The absolute lowest price reached.\\n4. Close: The price at the exact moment the timeframe ends.\\n\\nThe thick part of the candle is the 'Body' (the difference between open and close). The thin lines extending from the top and bottom are the 'Wicks' or 'Shadows' (the extreme highs and lows that were ultimately rejected). \\n\\nA long upper wick means buyers tried to push the price up, but sellers violently rejected them and drove the price back down. Wicks represent rejection.",
        richBlocks: [
          {
            type: 'proTip',
            tip: 'The close is the most important part of the candle. Never assume a candlestick pattern is valid until the candle actually closes. A candle can look like a perfect bullish hammer with 10 seconds left, and close as a bearish disaster.'
          } as ProTipBlock
        ]
      },
      {
        heading: "The Three Specific Setups",
        text: "Do not memorize 50 patterns. Master these three high-probability setups:\\n\\n1. **The Pin Bar (Liquidity Sweep):** The Pin Bar (or Hammer) has a small body and a long wick. It shows violent rejection. The setup is to wait for price to sweep below a major support level, trigger retail stops, and form a Bullish Pin Bar. You buy on the break of the Pin Bar's high.\\n\\n2. **The Engulfing Break and Retest:** An Engulfing pattern occurs when a large candle completely covers the body of the previous smaller candle. Trade this on the 'retest' of a broken structure level to confirm the new trend.\\n\\n3. **The Inside Bar Breakout:** An Inside Bar represents massive volatility contraction. The entire candle is inside the previous candle. Trade the breakout of the 'Mother Bar' during high-volume sessions like the London Open.",
        bullets: [
          "Wait for the Close: The engulfing candle must close completely enveloping the previous body.",
          "Volume Confirmation: The engulfing candle should ideally have higher volume than the previous candle.",
          "Location is Everything: Only trade engulfing patterns at high-timeframe key levels."
        ]
      },
      {
        heading: "Mathematical Position Sizing",
        text: "When trading candlestick patterns, your stop loss placement is critical, and it dictates your position size.\\n\\nIf you are trading a Bullish Pin Bar on GBP/USD, your stop loss MUST go below the extreme low of the wick. If the distance from your entry to the bottom of the wick is 30 pips, and your 1% account risk is £150, you divide £150 by 30 pips. Your stake size is £5 per pip.\\n\\nThis ensures that if the pattern fails (which it will 40% of the time), you only lose your strictly defined 1% overhead.",
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
        text: "The secret to institutional trading is 'Confluence'—stacking multiple technical factors in your favor before executing a trade.\\n\\nA Bullish Engulfing pattern in the middle of a chart has a 50/50 win rate. But a Bullish Engulfing pattern that forms:\\n1. In the direction of the Daily trend.\\n2. At a 4-Hour Demand Zone.\\n3. Immediately following a liquidity sweep of a previous low.\\n\\nThat pattern now has an 80%+ probability of playing out. Never trade the candle alone. Trade the context.",
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
        text: "Not all candlestick patterns are created equal. The reliability of a pattern is directly proportional to the timeframe it forms on.\\n\\nA Pin Bar on the Daily chart represents 24 hours of sustained buying or selling pressure. It is highly significant and difficult for retail traders to manipulate. A Pin Bar on the 1-Minute chart represents 60 seconds of noise and is highly susceptible to random volatility.\\n\\nWe recommend beginners focus exclusively on identifying patterns on the 4-Hour and Daily charts until they achieve consistent profitability."
      },
      {
        heading: "The 12-24 Month Timeline",
        text: "You can memorize the shapes of candlesticks in an afternoon. You cannot master the execution of them in less than 12 to 24 months.\\n\\nDeveloping the 'screen time' required to instantly recognize subtle shifts in momentum, to understand when an Engulfing bar is a trap vs when it is a true institutional entry, requires thousands of hours of deliberate practice. Be patient. Survive your first year by using minimal risk.",
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
        text: "UK traders utilizing Candlestick patterns have significant structural advantages. By executing these patterns via a Spread Betting account, you can precisely control your 'pound per point' risk without having to calculate complex lot sizes.\\n\\nFurthermore, because spread betting profits are currently tax-free under HMRC (as they are classified as gambling), you keep 100% of your gains. Additionally, trading with an FCA-regulated broker means you have Negative Balance Protection, ensuring a massive market gap against your candlestick pattern will never put you in debt to the broker."
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
  }`;

const start1 = code.indexOf('slug: "technical-analysis"') - 20;
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
code = code.substring(0, techStart) + technicalAnalysisObj + code.substring(techEnd);

const start2 = code.indexOf('slug: "candlestick-patterns"') - 20;
let candleStart = code.indexOf('{', start2);
let candleEnd = candleStart;
braces = 0;
for (let i = candleStart; i < code.length; i++) {
  if (code[i] === '{') braces++;
  if (code[i] === '}') {
    braces--;
    if (braces === 0) {
      candleEnd = i + 1;
      break;
    }
  }
}
code = code.substring(0, candleStart) + candlestickPatternsObj + code.substring(candleEnd);

fs.writeFileSync('src/lib/data/learn-to-trade.ts', code);
console.log('Batch 3 complete');
