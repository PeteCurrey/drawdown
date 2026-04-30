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
    tradingConditions: 'FTMO provides access to a wide range of markets including Forex, Commodities, Indices, Crypto, and Stocks. They use Tier 1 liquidity providers to ensure institutional-grade spreads and minimal slippage. Their proprietary "FTMO Account" platform is highly optimized for speed.',
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
    introduction: 'City Traders Imperium (CTI) is a London-based firm that prides itself on being run by actual traders. They focus heavily on education and mentoring, aiming to turn retail participants into institutional-grade performers.',
    challengeRules: 'CTI offers both Evaluation and Direct Funding. Their evaluation is rigorous but fair, with a focus on long-term sustainability. They are one of the few firms that allow a 100% profit split for their top-tier traders.',
    feeAndRefund: 'Evaluation fees start at £109. While higher than some "disposable" prop firms, the quality of the environment and support justifies the cost for serious professionals.',
    tradingConditions: 'Excellent execution on major pairs. They discourage "gambling" style trading and reward those who follow a disciplined risk management plan.',
    verdict: 'If you are in the UK and want a firm you can actually visit and trust, CTI is the winner. They are a professional outfit, not a marketing machine.',
    faqs: []
  }
];
