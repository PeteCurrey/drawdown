const fs = require('fs');

let code = fs.readFileSync('src/lib/data/learn-to-trade.ts', 'utf8');

const riskManagementObj = `  {
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
        text: "In trading, your capital is your inventory. If you own a shoe store and all your shoes burn in a fire, you are out of business. In trading, if your capital drops to zero, you are out of business. The primary directive of any professional trader is not 'make money.' The primary directive is 'protect capital.'\\n\\nEvery strategy experiences 'drawdown'—a string of consecutive losses. Even a strategy with a 60% win rate will occasionally experience 8 or 9 losses in a row purely due to statistical variance. If you risk 10% of your account per trade, an 8-trade losing streak wipes out 80% of your account. You are mathematically ruined. If you risk 1% per trade, an 8-trade losing streak takes you down 8%. You survive.",
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
        text: "The institutional standard for retail traders is the 1% Rule. You must never, under any circumstances, risk more than 1% of your total account equity on a single trade. \\n\\nIf you have a £10,000 account, your absolute maximum loss on any setup must be capped at £100. This is the non-negotiable cost of doing business. When you limit your risk to 1%, you completely detach your ego from the trade. Losing £100 on a £10,000 account does not trigger the 'fight or flight' response. It does not cause panic. It allows you to operate mechanically.\\n\\nOnce you prove you are profitable over a 100-trade sample size, you do not increase your risk percentage; you increase your account size.",
        bullets: [
          "Risk 1% per trade. If you take 5 losses in a week, you are only down 5%.",
          "Never move your stop loss once the trade is active. A 1% loss is a business expense; a 5% loss is a lack of discipline.",
          "Use a hard stop-loss. 'Mental stops' do not work under pressure."
        ]
      },
      {
        heading: "Mathematical Position Sizing",
        text: "How do you ensure you only lose exactly 1%? You must calculate your position size before every single trade based on the distance to your stop loss. \\n\\nIf your entry is at 1.2500 and your technical stop loss is at 1.2480 (20 pips away), and you have a £5,000 account, your 1% risk is £50. \\nTo lose exactly £50 if the 20-pip stop is hit, you divide your risk by your stop distance: £50 / 20 pips = £2.50 per pip. \\n\\nIf the next trade requires a 50-pip stop loss because the volatility is higher, you run the math again: £50 / 50 pips = £1.00 per pip. Your risk in pounds never changes, only your lot size changes.",
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
        text: "Risk-to-Reward (RR) is the mathematical ratio between what you stand to lose and what you stand to gain on a trade. \\n\\nIf you risk £100 to make £200, your RR is 1:2. This is the holy grail of profitable trading. If you maintain an average RR of 1:2, you only need to win 34% of your trades to break even. If you win 50% of your trades with a 1:2 RR, you will be massively profitable over the long term. \\n\\nRetail traders often do the opposite. They take small £20 profits because they are scared of losing the win, but they let their losers run to -£100 because they refuse to be wrong. This creates a negative RR. With a negative RR, even a 90% win rate will eventually blow your account.",
        bullets: [
          "Always aim for a minimum 1:2 RR on every setup.",
          "Do not take a trade if the technical target does not provide at least a 1:2 ratio.",
          "Let your winners run to the target. Cut your losers immediately at the stop."
        ]
      },
      {
        heading: "The Three Setups for Capital Defense",
        text: "Professional risk management isn't just about math; it's about choosing the right setups. Here are three setups that provide inherently strong risk-to-reward ratios:\\n\\n1. **The Deep Pullback:** Waiting for a trend to pull back deeply into a massive 4-hour demand zone. Entering at the absolute extreme of the zone allows you to place a very tight stop loss (e.g., 10 pips) while targeting the high of the trend (e.g., 100 pips). This provides a massive 1:10 RR.\\n\\n2. **The Failed Breakout (Trap):** When price breaks a major high, triggers retail FOMO buyers, and immediately reverses. Entering short on the reversal allows you to put your stop loss tightly above the newly formed 'trap' wick. The risk is tiny, but the reward is the entire range.\\n\\n3. **The Inside Bar Breakout:** An inside bar represents severe volatility contraction. Placing an entry on the break of the inside bar allows you to place your stop loss just below the inside bar. Because the candle is so small, the stop is tight, but the resulting expansion is often explosive.",
        richBlocks: [
          {
            type: 'proTip',
            tip: 'The best risk management is sometimes taking no risk at all. Cash is a position. If the setups are not there, protecting your capital by doing nothing is a highly profitable decision.'
          } as ProTipBlock
        ]
      },
      {
        heading: "Understanding UK-Specific Risks",
        text: "If you are trading in the UK, there are specific structural risks you must mitigate. \\n\\nFirst is the danger of Spread Betting leverage. Because spread betting is tax-free and allows for high leverage (up to 30:1 for retail), it is very easy to over-leverage a small account. You must be hyper-vigilant that your 'per pip' stake does not exceed your 1% risk rule.\\n\\nSecond is broker risk. Always use an FCA-regulated broker. Unregulated offshore brokers may offer 500:1 leverage, but they operate 'B-Book' models where they actively trade against you. Furthermore, if an unregulated broker collapses, your money is gone. With an FCA broker, the Financial Services Compensation Scheme (FSCS) protects your deposits up to £85,000.",
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
        text: "You can know the math perfectly, but if you cannot psychologically accept the loss, you will fail. \\n\\nA loss is not a reflection of your intelligence. It is not the market 'punishing' you. A loss is simply the statistical cost of doing business. If you own a restaurant, you have to buy ingredients. You don't get angry at the supplier for charging you for flour. In trading, a 1% loss is your overhead.\\n\\nYou must reframe how you view a stop loss. Hitting a stop loss is not a failure. Hitting a stop loss *and sticking to your 1% risk limit* is a massive victory of discipline.",
        bullets: [
          "Reframe the loss: It is a business expense, not a personal failure.",
          "If you feel anger when stopped out, your position size is too large.",
          "The market owes you nothing. You must protect yourself."
        ]
      },
      {
        heading: "Tools for Professional Risk Management",
        text: "Do not rely on mental math when the market is moving fast. You need professional tools to automate your risk management.\\n\\nUse position size calculators before every entry. Many modern platforms allow you to input your risk percentage and automatically calculate the correct lot size based on where you drag your stop loss line on the chart.\\n\\nAdditionally, maintaining a strict trade journal is a form of risk management. By tracking your performance, you can identify 'drawdown days' (e.g., Fridays) and actively reduce your risk parameters on those days to protect capital.",
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
  }`;

const tradingPsychObj = `  {
    slug: "trading-psychology",
    title: "Trading Psychology",
    subtitle: "The hardest battle isn't with the market; it's with yourself. Mastering fear, greed, and the illusion of control.",
    description: "Your technical analysis is useless if your psychology is compromised. Learn to build an emotionless, mechanical mindset that treats trading as a strict probability business.",
    category: "Psychology",
    difficulty: "Very High",
    timeToLearn: "12-24 months",
    riskLevel: "Low",
    heroImage: "/images/learn/psychology.jpg",
    metaTitle: "Trading Psychology Guide UK | Master Your Mindset | Drawdown",
    metaDescription: "Learn the psychology of institutional traders. Conquer FOMO, stop revenge trading, and develop the discipline required for long-term profitability.",
    honestReality: "You will spend your first year blaming your strategy, your broker, or 'the algorithm' for your losses. The reality is that you are losing because of your own biological wiring. Human beings are biologically programmed to seek comfort, avoid pain, and follow the herd. In the financial markets, these exact instincts will destroy your capital. Achieving profitability requires actively rewiring your brain over 12-24 months to embrace probability, accept losses mechanically, and execute without emotion.",
    content: [
      {
        heading: "The Myth of the 'Perfect Setup'",
        text: "Retail traders are obsessed with finding the 'Holy Grail' indicator or the perfect technical setup that never fails. This is a psychological defense mechanism against the fear of uncertainty. \\n\\nThe market is an infinitely chaotic environment. There is no such thing as a guaranteed outcome. Once you accept that every single trade—no matter how perfect the setup looks—has a random outcome, your psychology changes. You stop trying to predict the market and start trying to manage probability.\\n\\nA professional trader executes their edge mechanically, knowing that over 100 trades, the math will work in their favor, even if the next 5 trades are losers.",
        richBlocks: [
          {
            type: 'proTip',
            tip: 'Think in probabilities, not certainties. If your strategy has a 60% win rate, that means 40 out of 100 perfect setups will fail. Expect the failure. Plan for it.'
          } as ProTipBlock
        ]
      },
      {
        heading: "Revenge Trading: The Account Killer",
        text: "Revenge trading is the single fastest way to annihilate a trading account. It happens when you take a painful loss, feel a visceral sense of injustice, and immediately re-enter the market with double the size to 'prove the market wrong' and win your money back.\\n\\nWhen you revenge trade, the analytical part of your brain shuts down completely, and the primitive emotional brain takes over. You are no longer trading a statistical edge; you are gambling out of anger.\\n\\nThe only cure for revenge trading is a hard structural rule: the 'Walk Away' rule. If you take two consecutive losses, or if you feel your heart rate elevate, you must physically close your laptop and walk away for at least two hours.",
        bullets: [
          "Revenge trading ignores all risk management rules.",
          "It is driven by ego and the refusal to accept a loss.",
          "Use platform limits to lock yourself out if you hit a daily drawdown."
        ]
      },
      {
        heading: "The Fear of Missing Out (FOMO)",
        text: "You open your charts and see a massive, violent 100-pip green candle on GBP/USD. You missed the entry. As the price keeps climbing, the psychological pain of 'missing the money' becomes unbearable. You hit the 'Buy' button right at the absolute top of the spike.\\n\\nThe moment you enter, the institutional traders who bought the bottom begin taking their profit. The market violently reverses, and you are instantly trapped in a massive loss.\\n\\nFOMO is the market's mechanism for generating exit liquidity for the smart money. You must train yourself to feel absolutely nothing when you miss a move. The market provides infinite opportunities. Capital preservation is paramount.",
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
        text: "The market is designed to exploit three specific human psychological flaws. \\n\\n1. **The Need to be Right:** Traders will hold onto a losing position, moving their stop loss further and further away, simply because they refuse to admit their initial analysis was wrong. They would rather blow their account than damage their ego.\\n\\n2. **The Fear of Success:** You are in a winning trade. Your target is 50 pips away. The trade goes 20 pips in profit, pulls back slightly, and panic sets in. You close the trade early for a tiny profit because you are terrified the market will take it away. You just ruined your Risk-to-Reward ratio.\\n\\n3. **The Recency Bias:** You take three losing trades in a row. A perfect setup forms. Because you are traumatized by the recent losses, you freeze and do not take the trade. The trade goes perfectly to target without you.",
        bullets: [
          "Accepting a loss is a victory of discipline.",
          "Let your winners run to the predetermined target.",
          "Execute every valid setup, regardless of the previous trade's outcome."
        ]
      },
      {
        heading: "Building a Mechanical Mindset",
        text: "How do you overcome these biological flaws? By removing discretion from your trading.\\n\\nYou must build a trading plan that is so strict and mechanical that a computer could execute it. 'If A happens, and B happens, I execute C, with a stop loss at D.' There is no room for 'I feel like the market is going up.'\\n\\nWhen your rules are mechanical, trading becomes boring. Boring trading is profitable trading. You execute the data entry, walk away, and let the probabilities play out over a 100-trade sample size.",
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
        text: "You must completely reset your expectations. You are learning a high-performance profession. You would not expect to perform surgery after watching a YouTube video; do not expect to extract money from institutional algorithms after a weekend course.\\n\\nThe first 6 months are for losing money and learning the brutal reality of the market. The next 6 months are for breaking even and learning to control your emotions. The second year is when statistical profitability begins to emerge for the traders who have built a rigid, mechanical discipline.\\n\\nGive yourself permission to be a beginner. Survive the learning curve.",
        richBlocks: [
          {
            type: 'proTip',
            tip: 'Trade on a demo account for the first 6 months. If you cannot make fake money following your rules, you will definitely not make real money when real emotion is involved.'
          } as ProTipBlock
        ]
      },
      {
        heading: "UK Regulatory Peace of Mind",
        text: "One way to improve your trading psychology is to remove external stressors. In the UK, trading with an FCA-regulated broker provides immense peace of mind.\\n\\nKnowing that your capital is protected up to £85,000 by the Financial Services Compensation Scheme (FSCS) allows you to focus entirely on the charts, rather than worrying if your offshore broker is going to steal your deposit. Furthermore, knowing that spread betting profits are tax-free under HMRC rules removes the complex anxiety of calculating Capital Gains Tax on hundreds of intraday trades.",
        bullets: [
          "Only use FCA-regulated brokers.",
          "Ensure negative balance protection is active on your account.",
          "Trade with capital you can mathematically afford to lose."
        ]
      },
      {
        heading: "The Power of the Trade Journal",
        text: "A trade journal is not just a ledger of profits and losses; it is a mirror reflecting your psychology. \\n\\nWhen you log every trade, you must log your emotional state. Did you take the trade out of boredom? Were you angry? Were you following your plan? \\n\\nOver time, the data will clearly show that the trades taken when you felt 'FOMO' or 'Revenge' resulted in massive drawdowns, while the trades taken when you felt 'Bored' and 'Mechanical' generated your profits. The journal provides the mathematical proof required to finally change your behavior.",
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
  }`;

const spreadBettingObj = `  {
    slug: "spread-betting",
    title: "Spread Betting",
    subtitle: "The UK's tax-free trading loophole. Master the mechanics of stake size, margin, and keeping 100% of your profits.",
    description: "The complete guide to financial spread betting in the UK. Learn how to trade the global markets tax-free, understand how 'pounds per point' sizing works, and navigate the risks of high leverage.",
    category: "Market",
    difficulty: "High",
    timeToLearn: "12-24 months",
    riskLevel: "High",
    heroImage: "/images/learn/spread-betting.jpg",
    metaTitle: "Spread Betting Guide UK 2026 | Tax-Free Trading | Drawdown",
    metaDescription: "Learn how to use financial spread betting to trade tax-free in the UK. Master 'pounds per point' risk sizing, leverage, and the HMRC rules.",
    honestReality: "Spread betting is actively marketed as a tax-free wonderland for UK residents. While the tax benefits are entirely real and massive, spread betting is a highly leveraged derivative product. The broker is lending you money to multiply your exposure. This means you can wipe out your entire account in a matter of hours if you do not understand position sizing. You must treat spread betting as a dangerous, institutional-grade weapon that requires strict 1% risk management to wield effectively.",
    content: [
      {
        heading: "What is Financial Spread Betting?",
        text: "Financial spread betting is a derivative product available exclusively in the UK and Ireland. It allows you to speculate on the price movement of global financial markets (Forex, Indices, Commodities, Shares) without actually owning the underlying asset.\\n\\nInstead of buying 100 shares of Apple, you 'bet' a certain amount of money (e.g., £5) per 'point' that the price of Apple will move. If you bet £5 per point that the price will go up, and the price moves up 10 points, you make £50. If the price moves down 10 points, you lose £50.\\n\\nBecause it is legally structured as a 'bet' rather than an investment, HMRC classifies it under gambling laws. This provides UK traders with the single greatest structural advantage in global retail trading.",
        richBlocks: [
          {
            type: 'proTip',
            tip: 'The core mechanic is simple: Stake Size (£ per point) multiplied by Point Movement equals your total Profit or Loss.'
          } as ProTipBlock
        ]
      },
      {
        heading: "The Massive UK Tax Advantage",
        text: "The primary reason professional retail traders in the UK use spread betting over traditional CFDs or share dealing is the tax structure.\\n\\nCurrently, all profits generated from financial spread betting are completely exempt from Capital Gains Tax (CGT). Furthermore, because you are not purchasing the underlying asset, you are entirely exempt from the 0.5% UK Stamp Duty Reserve Tax.\\n\\nIf you make £50,000 trading CFDs, you must declare it to HMRC and pay Capital Gains Tax on the profits above your annual allowance. If you make £50,000 trading via a Spread Betting account, you keep every single penny.\\n\\nHowever, there is a catch. Because profits are tax-free, any losses you incur cannot be written off against other income. Additionally, if spread betting becomes your sole, primary source of income, HMRC *may* classify it as a taxable trade. Always consult a certified tax professional.",
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
        text: "Spread betting is a leveraged product. This means you only need to deposit a small fraction of the total trade value (the 'margin') to open a massive position.\\n\\nUnder FCA regulations, retail traders are offered up to 30:1 leverage on major Forex pairs. This requires a margin of just 3.33%. To control a £10,000 position on GBP/USD, you only need £333 in your account.\\n\\nLeverage is a double-edged sword. It amplifies your buying power, allowing small accounts to generate significant returns. But it equally amplifies your losses. If you use max leverage on a trade and the market moves against you by just 3%, your entire £333 margin will be wiped out, and the broker will close your trade (a Margin Call).",
        bullets: [
          "Leverage multiplies both profits and losses.",
          "Never use your entire account balance as margin for a single trade.",
          "The 1% risk rule applies to your total equity, regardless of leverage."
        ]
      },
      {
        heading: "Calculating 'Pounds Per Point' Risk",
        text: "In Forex, you calculate risk via lot sizes. In spread betting, you calculate risk via your 'Stake Size' (Pounds per Point). This requires strict mathematical discipline.\\n\\nIf you have a £5,000 account and use the 1% Rule, your maximum allowed loss per trade is £50.\\n\\nIf you identify a long setup on the FTSE 100 with an entry at 8,000 and a technical stop loss at 7,980, your stop distance is 20 points.\\nTo ensure you only lose exactly £50 if the 20-point stop is hit, you divide your risk by the distance: £50 / 20 = £2.50 per point.\\n\\nYou place your spread bet at £2.50 per point. If the trade hits your stop, you lose exactly £50. If the trade hits your target 40 points higher, you make £100. This is professional risk management.",
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
        text: "Because spread betting is leveraged, you must trade setups that offer tight stop-losses and massive directional momentum. \\n\\n1. **The London Session Index Breakout:** Trading the FTSE 100 or DAX 40 precisely at 8:00 AM GMT. The massive influx of institutional volume at the open creates strong directional trends. You wait for the first 15-minute consolidation to break, and trade the momentum.\\n\\n2. **The Liquidity Sweep (FX Majors):** Waiting for major pairs like GBP/USD to sweep liquidity below a daily support level, trap retail sellers, and violently reverse. This allows for a very tight stop-loss below the 'sweep' wick.\\n\\n3. **The 4-Hour Trend Continuation:** For those with day jobs, this is a swing-trading approach. Identify the macro trend on the Daily chart, wait for a pullback into a 4-Hour structural demand/supply zone, and enter the continuation with a wider stop-loss but a smaller 'pound per point' stake size.",
        bullets: [
          "Indices (FTSE/DAX) offer the best volatility during the London session.",
          "FX Majors (GBP/USD, EUR/USD) offer the tightest spreads.",
          "Always adjust your stake size based on the volatility of the asset."
        ]
      },
      {
        heading: "Overnight Financing (Holding Costs)",
        text: "Spread betting is primarily designed for short-term trading. If you hold a spread bet position overnight past the daily cutoff time (usually 10:00 PM UK time), you will be charged an overnight financing fee.\\n\\nThis fee is calculated based on the total leveraged value of your position, plus an admin fee from the broker. Over a few days, this cost is negligible. However, if you attempt to 'invest' via spread betting and hold a position for 6 months, the compounding daily financing fees will severely eat into your profits.\\n\\nFor long-term investing, use a traditional Stocks and Shares ISA. Use spread betting strictly for intraday and short-term swing trading.",
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
        text: "Mastering the mechanics of spread betting takes time. The extreme leverage means that mistakes are punished instantly and severely. \\n\\nYou must dedicate the first 6 months to trading minimum stake sizes (e.g., 50p per point) to learn the platform mechanics, how spreads widen during news events, and how to control your emotions when the numbers turn red.\\n\\nIt typically takes 12 to 24 months of rigorous, disciplined execution to build the mechanical edge required to pull consistent, tax-free profits from the market.",
        richBlocks: [
          {
            type: 'proTip',
            tip: 'Use a demo account for the first 3 months to practice calculating your pound-per-point sizing rapidly before trading live capital.'
          } as ProTipBlock
        ]
      },
      {
        heading: "Choosing an FCA-Regulated Broker",
        text: "You can only spread bet legally if you are a UK or Ireland resident. Therefore, you must use a broker regulated by the UK Financial Conduct Authority (FCA).\\n\\nThe FCA mandates strict rules, including 'Negative Balance Protection' for retail clients. This guarantees that no matter how violently the market gaps against you, you cannot lose more than the total funds deposited in your account. \\n\\nFurthermore, your funds are segregated and protected by the FSCS up to £85,000. Never trade with an offshore broker attempting to bypass FCA leverage restrictions.",
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
  }`;

const start1 = code.indexOf('slug: "risk-management"') - 20;
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
code = code.substring(0, techStart) + riskManagementObj + code.substring(techEnd);

const start2 = code.indexOf('slug: "trading-psychology"') - 20;
let psychStart = code.indexOf('{', start2);
let psychEnd = psychStart;
braces = 0;
for (let i = psychStart; i < code.length; i++) {
  if (code[i] === '{') braces++;
  if (code[i] === '}') {
    braces--;
    if (braces === 0) {
      psychEnd = i + 1;
      break;
    }
  }
}
code = code.substring(0, psychStart) + tradingPsychObj + code.substring(psychEnd);

const start3 = code.indexOf('slug: "spread-betting"') - 20;
let spreadStart = code.indexOf('{', start3);
let spreadEnd = spreadStart;
braces = 0;
for (let i = spreadStart; i < code.length; i++) {
  if (code[i] === '{') braces++;
  if (code[i] === '}') {
    braces--;
    if (braces === 0) {
      spreadEnd = i + 1;
      break;
    }
  }
}
code = code.substring(0, spreadStart) + spreadBettingObj + code.substring(spreadEnd);

fs.writeFileSync('src/lib/data/learn-to-trade.ts', code);
console.log('Batch 2 complete');
