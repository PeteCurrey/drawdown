export interface PropFirmReview {
  slug: string;
  name: string;
  eyebrow: string;
  title: string;
  metaDescription: string;
  lastUpdated: string;
  rating: number;
  payoutSplit: string;
  maxLeverage: string;
  profitTarget: string;
  maxDrawdown: string;
  dailyDrawdown: string;
  minTradingDays: string;
  feeStructure: string;
  pros: string[];
  cons: string[];
  introduction: string;
  challengeRules: string;
  feeAndRefund: string;
  tradingConditions: string;
  verdict: string;
  faqs: {
    question: string;
    answer: string;
  }[];
  challengeStructure?: string;
  dailyDrawdownRules?: string;
  maxDrawdownRules?: string;
  profitSplitsDetail?: string;
  scalingPlan?: string;
  payoutHistory?: string;
  alternatives?: { name: string; slug: string; rating: number; maxFunding: string; bestFor: string }[];
}

export const PROP_FIRM_REVIEWS: PropFirmReview[] = [
  {
    slug: 'ftmo',
    name: 'FTMO',
    eyebrow: '// INSTITUTIONAL REVIEW',
    title: 'FTMO Review 2026 — Is the Industry Standard Still Worth It?',
    metaDescription: 'Complete FTMO review for 2026. We break down the challenge rules, drawdown limits, and payout history of the world\'s most trusted prop firm.',
    lastUpdated: '2026-04-30',
    rating: 4.9,
    payoutSplit: 'Up to 90%',
    maxLeverage: '100:1',
    profitTarget: '10% (Step 1), 5% (Step 2)',
    maxDrawdown: '10%',
    dailyDrawdown: '5%',
    minTradingDays: '4 Days',
    feeStructure: 'Refundable from €155',
    pros: [
      'Highest reputation in the industry',
      'Proprietary trading apps and tools',
      'Bi-weekly payouts after first month',
      'No time limit on evaluation phases'
    ],
    cons: [
      'Relatively high profit targets',
      'Strict daily drawdown rules',
      'Higher evaluation fees than newer competitors'
    ],
    introduction: 'FTMO is widely considered the gold standard of the prop firm industry. Founded in 2015, they have survived multiple regulatory shifts and industry collapses that wiped out dozens of competitors. But in 2026, with a flood of cheaper "high-stakes" firms entering the market, does FTMO still provide the best value for serious traders?',
    challengeRules: 'FTMO uses a two-step evaluation process. Step 1 requires a 10% profit target with a 5% daily drawdown limit and a 10% total drawdown limit. Step 2 (Verification) reduces the profit target to 5% while keeping the drawdown rules the same. Once passed, you become an FTMO Trader on a demo account where you receive real payouts based on your performance.',
    feeAndRefund: 'Fees range from €155 for a $10k account up to €1,080 for a $200k account. The fee is fully refundable with your first profit withdrawal, effectively making the evaluation free if you are successful.',
    tradingConditions: 'FTMO provides access to a wide range of markets including Forex, Commodities, Indices, Crypto, and Stocks. They use Tier 1 liquidity providers to ensure professional-grade spreads and minimal slippage. Their proprietary "FTMO Account" platform is highly optimized for speed.',
    verdict: 'FTMO remains the safest bet for any trader who values capital security and reputation over "cheap" fees. While their rules are strict, their payout history is impeccable. If you can pass FTMO, you are a professional trader.',
    faqs: [
      {
        question: 'How long does it take to get paid by FTMO?',
        answer: 'After you become an FTMO Trader, payouts are available on-demand every 14 days.'
      },
      {
        question: 'Does FTMO allow news trading?',
        answer: 'Yes, news trading is allowed on the evaluation accounts. However, restrictions apply to certain "Swing" account types on the funded stage.'
      }
    ],
    challengeStructure: 'FTMO relies on a standardized 2-Step Evaluation process. Phase 1 (10% target) has no time limit, followed by Phase 2 Verification (5% target), also with no time limit. Upon passing both, you receive a funded account demo and a full refund of your entry fee with your first payout.',
    dailyDrawdownRules: 'FTMO implements a 5% daily drawdown limit, calculated based on the previous day\'s midnight CET balance or equity, whichever is higher. Violating this rule at any millisecond results in immediate account breaches.',
    maxDrawdownRules: 'FTMO has a maximum static drawdown limit of 10% of the initial account balance. Unlike some newer firms, this limit does not trail your balance or equity, meaning it remains fixed relative to your starting size.',
    profitSplitsDetail: 'Funded FTMO Traders receive an 80% profit split by default. However, if you qualify for the scaling plan, your profit split can scale up to 90%. Payouts can be requested bi-weekly on-demand.',
    scalingPlan: 'The FTMO scaling plan increases your account size by 25% every 4 months, provided you meet the consistency criteria: achieving at least 10% net profit (20% for aggressive accounts) across four consecutive months, with at least two payouts processed.',
    payoutHistory: 'FTMO is legendary for its payout speed and reliability. Since 2015, they have paid out over $150M+ to retail traders globally, processing wire transfers, crypto (BTC, USDT), and Skrill/Neteller requests in under 8-24 hours.',
    alternatives: [
      { name: 'The5%ers', slug: 'the5ers', rating: 4.8, maxFunding: '$4,000,000', bestFor: 'Swing trading and scaling programs' },
      { name: 'FundedNext', slug: 'fundednext', rating: 4.7, maxFunding: '$200,000', bestFor: 'Balance-based drawdown models' }
    ]
  },
  {
    slug: 'the5ers',
    name: 'The5%ers',
    eyebrow: '// GROWTH REVIEW',
    title: 'The5%ers Review 2026 — The Best Scaling Plan in the Market?',
    metaDescription: 'A deep dive into The5%ers prop firm. Discover why their Hyper-Growth and High-Stakes programs are preferred by long-term swing traders.',
    lastUpdated: '2026-04-30',
    rating: 4.8,
    payoutSplit: 'Up to 100%',
    maxLeverage: '30:1 (Standard), 100:1 (High Stakes)',
    profitTarget: '8% - 10%',
    maxDrawdown: '10%',
    dailyDrawdown: '5%',
    minTradingDays: 'No minimum',
    feeStructure: 'From $39',
    pros: [
      'Incredible scaling plan (up to $4M)',
      'High-quality educational resources',
      'Daily payouts available',
      'Support for swing trading over weekends'
    ],
    cons: [
      'Complex program options can be confusing',
      'Lower leverage on certain programs',
      'Strict consistency rules'
    ],
    introduction: 'The5%ers (The Five Percenters) differentiate themselves by focusing on long-term trader growth rather than just the evaluation "churn." Their scaling plan is arguably the most aggressive in the industry, allowing profitable traders to reach millions in management capital faster than almost anywhere else.',
    challengeRules: 'They offer three main paths: Hyper-Growth (instant funding with scaling), High-Stakes (two-step evaluation), and Bootcamp (low-cost entry for proven traders). Each has its own drawdown and profit target parameters tailored to different risk appetites.',
    feeAndRefund: 'Fees are highly competitive, starting as low as $39 for the Bootcamp entry. Their High-Stakes evaluations are priced similarly to FTMO but often with more flexible trading conditions.',
    tradingConditions: 'The5%ers excel in their transparency. They provide a "Trader\'s Dashboard" that gives deep insights into your performance metrics, helping you stay within drawdown limits.',
    verdict: 'The best choice for swing traders and those looking for a long-term career path. Their scaling plan is real and proven.',
    faqs: [
      {
        question: 'Do The5%ers allow holding trades over the weekend?',
        answer: 'Yes, their Hyper-Growth and Bootcamp programs are specifically designed for swing traders and allow weekend holding.'
      }
    ],
    challengeStructure: 'The5%ers offer three paths: Hyper-Growth (instant funding starting with real money), High-Stakes (standard 2-step evaluation), and Bootcamp (a low-cost 3-stage demo program where you pay the rest of the fee only when you pass).',
    dailyDrawdownRules: 'The5%ers use a 5% daily drawdown limit on their High-Stakes accounts. Hyper-Growth accounts rely on a static overall maximum drawdown without daily drawdown limits, which is highly suited for swing trading.',
    maxDrawdownRules: 'High-Stakes accounts feature a 10% maximum static drawdown limit. Hyper-Growth accounts have a 6% overall drawdown limit relative to your starting balance.',
    profitSplitsDetail: 'The profit split starts at 50% for Hyper-Growth accounts but quickly scales up to 100% as you hit milestones. High-Stakes accounts feature an 80% to 100% split.',
    scalingPlan: 'The5%ers offer the best scaling plan in the industry. For Hyper-Growth, every time you hit a 10% profit target, they double your account size, scaling up to $4,000,000.',
    payoutHistory: 'Operating since 2016 from Israel and London, The5%ers are highly respected for processing payouts within 24 hours. Payouts are available via bank wire, Wise, Deel, and crypto (USDT).',
    alternatives: [
      { name: 'FTMO', slug: 'ftmo', rating: 4.9, maxFunding: '$200,000', bestFor: 'Strict day traders who want a premium portal' },
      { name: 'City Traders Imperium', slug: 'city-traders-imperium', rating: 4.8, maxFunding: '$4,000,000', bestFor: 'Direct funding and London regulation' }
    ]
  },
  {
    slug: 'fundednext',
    name: 'FundedNext',
    eyebrow: '// INNOVATION REVIEW',
    lastUpdated: '2026-04-30',
    title: 'FundedNext Review 2026 — Profit Sharing from the Evaluation Stage',
    metaDescription: 'Reviewing FundedNext: The prop firm that pays you while you are still in the challenge. Is their model sustainable for 2026?',
    rating: 4.7,
    payoutSplit: 'Up to 90%',
    maxLeverage: '100:1',
    profitTarget: '8% - 10%',
    maxDrawdown: '10%',
    dailyDrawdown: '5%',
    minTradingDays: '5 Days',
    feeStructure: 'From $49',
    pros: [
      '15% profit share during evaluation',
      'Personal account managers',
      'No time limits',
      'Balance-based drawdown (on certain plans)'
    ],
    cons: [
      'Relatively new compared to FTMO',
      'Platform can be laggy during high news',
      'Strict consistency rules on specific plans'
    ],
    introduction: 'FundedNext disrupted the industry by offering something no one else did: a 15% profit share even if you haven\'t passed the challenge yet. This "incentive" model has made them a favorite among retail traders looking for immediate ROI.',
    challengeRules: 'They offer two main types: Evaluation (Two-step) and Express (One-step). Their unique "Stellar" plan has no time limits and uses balance-based drawdown, which is much more trader-friendly than equity-based drawdown.',
    feeAndRefund: 'Starting at $49 for a $6k account. All fees are refundable with the first payout from the funded account.',
    tradingConditions: 'They use a proprietary "FundedNext" server which aims for zero commission and raw spreads. Execution is generally fast, though slippage can occur on "Express" accounts during volatile news.',
    verdict: 'Excellent for traders who want to earn while they learn. Their Stellar plan is one of the most flexible in the industry.',
    faqs: []
  },
  {
    slug: 'city-traders-imperium',
    name: 'City Traders Imperium',
    eyebrow: '// LONDON REVIEW',
    lastUpdated: '2026-04-30',
    title: 'City Traders Imperium Review 2026 — The Professional\'s Prop Firm',
    metaDescription: 'Reviewing London-based City Traders Imperium (CTI). A deep dive into their professional funding, scaling, and educational mentoring.',
    rating: 4.8,
    payoutSplit: 'Up to 100%',
    maxLeverage: '33:1',
    profitTarget: '10%',
    maxDrawdown: '10%',
    dailyDrawdown: '4%',
    minTradingDays: 'No minimum',
    feeStructure: 'From £109',
    pros: [
      'London-based with high transparency',
      'Direct funding options available',
      'World-class educational mentoring',
      'Up to 100% profit split'
    ],
    cons: [
      'Lower leverage than competitors',
      'Strict daily drawdown limit (4%)',
      'Higher barrier to entry for beginners'
    ],
    introduction: 'City Traders Imperium (CTI) is a London-based firm that prides itself on being run by actual traders. They focus heavily on education and mentoring, aiming to turn retail participants into professional-grade performers.',
    challengeRules: 'CTI offers both Evaluation and Direct Funding. Their evaluation is rigorous but fair, with a focus on long-term sustainability. They are one of the few firms that allow a 100% profit split for their top-tier traders.',
    feeAndRefund: 'Evaluation fees start at £109. While higher than some "disposable" prop firms, the quality of the environment and support justifies the cost for serious professionals.',
    tradingConditions: 'Excellent execution on major pairs. They discourage "gambling" style trading and reward those who follow a disciplined risk management plan.',
    verdict: 'If you are in the UK and want a firm you can actually visit and trust, CTI is the winner. They are a professional outfit, not a marketing machine.',
    faqs: []
  },
  {
    slug: 'funding-pips',
    name: 'Funding Pips',
    eyebrow: '// BUDGET REVIEW',
    title: 'Funding Pips Review 2026 — The Best Low-Cost Evaluation?',
    metaDescription: 'Is Funding Pips the best cheap prop firm in 2026? We analyze their rules, 5-day payout system, and Match-Trader integration.',
    lastUpdated: '2026-05-15',
    rating: 4.7,
    payoutSplit: 'Up to 90%',
    maxLeverage: '100:1',
    profitTarget: '8% (Step 1), 5% (Step 2)',
    maxDrawdown: '10%',
    dailyDrawdown: '5%',
    minTradingDays: 'No minimum',
    feeStructure: 'Refundable from $32',
    pros: [
      'Extremely low evaluation fees',
      'No minimum trading days',
      '5-day payout cycle',
      'Excellent MT5 alternative integration'
    ],
    cons: [
      'Relatively new track record',
      'Strict daily drawdown limit calculation',
      'Spreads can widen during high volatility'
    ],
    introduction: 'Funding Pips has rapidly risen to prominence as one of the most popular low-cost prop firms. With evaluation fees starting at just $32 for a $5k account and a 5-day payout cycle, they cater directly to undercapitalized traders who want high profit potential with minimal initial risk.',
    challengeRules: 'They use a standard 2-step evaluation model. Step 1 requires an 8% profit target, and Step 2 requires a 5% profit target. Daily drawdown is capped at 5%, and max drawdown is 10%. Daily drawdown is calculated based on the starting balance of each day.',
    feeAndRefund: 'Fees range from $32 for a $5k account to $399 for a $100k account. This fee is fully refunded on your first payout, making it highly competitive compared to legacy firms.',
    tradingConditions: 'Funding Pips utilizes Match-Trader and cTrader to offer alternative platforms for traders. Spreads are highly competitive, though they can experience widening during major news events.',
    verdict: 'An outstanding budget-friendly option. While they lack the ten-year track record of FTMO, their rapid payout speed and cheap entry costs make them a favorite for retail traders.',
    faqs: [
      {
        question: 'Does Funding Pips allow weekend holding?',
        answer: 'Yes, traders are permitted to hold positions over the weekend on all evaluation and master accounts.'
      }
    ],
    challengeStructure: '2-Step Evaluation process with no time limits and no minimum trading days, meaning you can get funded as fast as you can reach the targets.',
    dailyDrawdownRules: 'Daily drawdown limit is 5% of the starting balance of the day, reset at midnight server time.',
    maxDrawdownRules: 'Max drawdown limit is 10% static of the initial account balance.',
    profitSplitsDetail: 'Starts at 80% and can scale up to 90% as you hit consistency metrics.',
    scalingPlan: 'Accounts can scale up to double their initial balance as they hit 10% profit milestones, up to a maximum of $1,000,000.',
    payoutHistory: 'Very reliable processing of payouts via crypto (USDT, BTC) and third-party contract portals.'
  },
  {
    slug: 'fxify',
    name: 'FXIFY',
    eyebrow: '// LEVERAGE REVIEW',
    title: 'FXIFY Review 2026 — Premium Execution and cTrader Support',
    metaDescription: 'Detailed FXIFY review for 2026. Read about their cTrader integration, up to 90% payout splits, and news trading conditions.',
    lastUpdated: '2026-05-10',
    rating: 4.6,
    payoutSplit: 'Up to 90%',
    maxLeverage: '100:1',
    profitTarget: '10% (Step 1), 5% (Step 2)',
    maxDrawdown: '10%',
    dailyDrawdown: '5%',
    minTradingDays: 'No minimum',
    feeStructure: 'Refundable from $99',
    pros: [
      'cTrader, MT4, and MT5 support',
      'No news trading restrictions',
      'Customizable leverage options',
      'Direct payouts on demand'
    ],
    cons: [
      'Higher pricing than budget competitors',
      'Strict consistency rules on specific plans',
      'Customer support response times can vary'
    ],
    introduction: 'FXIFY has positioned itself as a premium prop firm, offering direct integration with major platforms like cTrader alongside standard Metatrader options. They appeal to advanced technical traders who value tight spreads, fast execution, and zero restrictions on news trading.',
    challengeRules: 'FXIFY offers both 1-step and 2-step evaluation challenges. The standard 2-step challenge requires a 10% target in Phase 1 and 5% in Phase 2, with a 5% daily drawdown and 10% overall drawdown limit.',
    feeAndRefund: 'Evaluation fees start at $99. Fees are fully refundable with your first payout, and you can purchase add-ons like bi-weekly payouts or higher leverage.',
    tradingConditions: 'FXIFY partners with FXDirect to provide tight spreads and low latency execution, making them highly suited for scalping and day trading.',
    verdict: 'A top-tier firm for traders who prefer cTrader and want to trade major news events without restrictions.',
    faqs: [
      {
        question: 'Does FXIFY allow news trading?',
        answer: 'Yes, news trading is fully permitted without any restrictions during both evaluation and funded stages.'
      }
    ],
    challengeStructure: 'Offers 1-Step and 2-Step challenges with customizable add-ons at checkout.',
    dailyDrawdownRules: 'Daily drawdown limit is 5%, calculated based on the previous day\'s ending balance or equity, whichever is higher.',
    maxDrawdownRules: 'Maximum drawdown limit is 10% static of the initial account balance.',
    profitSplitsDetail: 'Default profit split is 75%, scalable up to 90% with add-ons or scaling milestones.',
    scalingPlan: 'Accounts can scale up to $4,000,000 through consistent performance over 3-month cycles.',
    payoutHistory: 'Consistent payouts processed via crypto and bank wire.'
  },
  {
    slug: 'e8-funding',
    name: 'E8 Funding',
    eyebrow: '// FLEXIBLE REVIEW',
    title: 'E8 Funding Review 2026 — Customizable Risk Parameters',
    metaDescription: 'Explore E8 Funding features, customizable drawdown settings, and the E8 Track program. Read our honest review.',
    lastUpdated: '2026-04-28',
    rating: 4.6,
    payoutSplit: 'Up to 80%',
    maxLeverage: '50:1',
    profitTarget: '8% (Phase 1), 5% (Phase 2)',
    maxDrawdown: '8%',
    dailyDrawdown: '5%',
    minTradingDays: 'No minimum',
    feeStructure: 'Refundable from $88',
    pros: [
      'Customizable drawdown and risk settings',
      'Intuitive user interface and dashboard',
      'Low entry fees',
      'No minimum trading days'
    ],
    cons: [
      'Slightly lower payout split cap (80%)',
      'News restrictions on funded accounts',
      'Maximum funding limit is lower than competitors'
    ],
    introduction: 'E8 Funding is renowned for its state-of-the-art dashboard and highly customizable evaluation plans. They allow traders to tailor risk parameters to match their strategy, making them an excellent choice for systematic traders.',
    challengeRules: 'Their signature E8 challenge is a 2-step evaluation with an 8% Phase 1 target and 5% Phase 2 target. Maximum drawdown is 8%, and daily drawdown is 5%. No minimum trading days are required.',
    feeAndRefund: 'Fees start at $88 for a $10k account, with full refund availability on the first payout.',
    tradingConditions: 'E8 provides high-speed execution through top liquidity pools, ensuring tight spreads on Forex majors and indices.',
    verdict: 'An excellent choice for tech-oriented traders who appreciate custom drawdown options and a sleek trading interface.',
    faqs: [
      {
        question: 'What is the E8 Track program?',
        answer: 'E8 Track is a lower-cost, 3-phase challenge designed to test consistency over a longer period.'
      }
    ],
    challengeStructure: '2-Step and 3-Step evaluation programs with customizable risk rules.',
    dailyDrawdownRules: 'Daily drawdown limit is 5%, calculated dynamically relative to equity.',
    maxDrawdownRules: 'Max drawdown limit is 8% static of the initial account balance.',
    profitSplitsDetail: 'Standard profit split is 80%, with payouts available bi-weekly.',
    scalingPlan: 'Scaling program increases balance by 25% for every 10% profit generated and withdrawn.',
    payoutHistory: 'Very solid history of timely payouts processed globally.'
  },
  {
    slug: 'lux-trading',
    name: 'Lux Trading Firm',
    eyebrow: '// REAL CAPITAL REVIEW',
    title: 'Lux Trading Firm Review 2026 — Real Institutional Capital?',
    metaDescription: 'Honest review of Lux Trading Firm in 2026. Do they actually allocate real capital, and is their scaling program legit?',
    lastUpdated: '2026-05-01',
    rating: 4.5,
    payoutSplit: '75%',
    maxLeverage: '30:1',
    profitTarget: '6%',
    maxDrawdown: '6%',
    dailyDrawdown: 'None',
    minTradingDays: '29 Days',
    feeStructure: 'Refundable from £299',
    pros: [
      'Real capital trading (no demo)',
      'No daily drawdown limit',
      'Direct institutional career path',
      'Weekend holding allowed'
    ],
    cons: [
      'Very slow evaluation process',
      'High challenge fees',
      'Lower profit split (75%)'
    ],
    introduction: 'Lux Trading Firm stands out by allocating actual capital rather than keeping traders on simulated demo environments. Based in London, they offer an institutional pathway for professional traders who want to manage accounts up to $2,500,000.',
    challengeRules: 'Lux requires a 6% profit target with a 6% maximum drawdown limit. There is no daily drawdown limit. However, they require a minimum of 29 trading days to pass their evaluation stages, emphasizing consistency.',
    feeAndRefund: 'Fees are higher than simulated firms, starting at £299 for a $50k account. Fees are refunded upon reaching the first scaling milestone.',
    tradingConditions: 'Traders access real institutional liquidity with institutional-grade execution speed and raw spreads.',
    verdict: 'The ideal firm for patient, consistent swing traders who want to manage real capital and transition to asset management.',
    faqs: [
      {
        question: 'Are accounts on Lux Trading Firm simulated?',
        answer: 'No, Lux Trading Firm allocates real capital to live accounts once you pass the initial evaluation phases.'
      }
    ],
    challengeStructure: '2-Step real-capital evaluation phase requiring 29 minimum trading days.',
    dailyDrawdownRules: 'Lux Trading Firm does not enforce a daily drawdown limit, only a total drawdown limit.',
    maxDrawdownRules: 'Maximum drawdown limit is 6% static of the initial account balance.',
    profitSplitsDetail: 'Traders receive a flat 75% profit split from live trading profits.',
    scalingPlan: 'Very aggressive career path scaling up to $2,500,000 in institutional management capital.',
    payoutHistory: 'Very secure and audited payout process due to real capital and UK regulatory framework.'
  }
];
