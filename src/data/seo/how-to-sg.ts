import { HowToPage } from "./howto";

export const HOW_TO_PAGES_SG: HowToPage[] = [
  {
    slug: 'trading-tax-singapore',
    title: 'Trading Taxes in Singapore — The 0% Capital Gains Advantage',
    eyebrow: '// TAX EFFICIENCY',
    readingTime: 12,
    metaDescription: 'Complete guide to trading taxes in Singapore. Learn why individuals pay 0% capital gains tax and how to structure your trading as a business.',
    introduction: 'Singapore is one of the most tax-efficient jurisdictions for traders in the world. For individuals, capital gains from personal trading activities are generally not taxed.',
    steps: [
      { title: '1. Understand the Individual Exemption', content: 'In Singapore, capital gains are not taxable for individuals unless you are deemed to be "trading in the course of business".' },
      { title: '2. Monitor Your Frequency', content: 'If you trade with a high frequency or intent to profit from short-term fluctuations, ensure you understand the distinction between capital gains and income.' },
    ],
    commonMistakes: ['Failing to track business vs personal expenses', 'Ignoring income tax if trading as a full-time professional entity'],
    drawdownApproach: {
      title: 'Our Singapore Blueprint',
      content: 'We help you capitalize on Singapore\'s tax efficiency through professional-grade discipline.',
      ctaText: 'Access SG Curriculum',
      ctaLink: '/sg/courses'
    },
    faqs: []
  },
  ...['start-trading-singapore', 'trade-forex-singapore', 'choose-broker-singapore', 'trade-sgx', 'trade-crypto-singapore', 'open-trading-account-singapore', 'trade-us-stocks-from-singapore', 'trade-asia-session', 'trade-during-london-from-asia'].map(slug => ({
    slug,
    title: `How to ${slug.replace(/-/g, ' ').toUpperCase()} in Singapore`,
    eyebrow: '// SG TRADING GUIDE',
    readingTime: 15,
    metaDescription: `A comprehensive Singapore-focused guide on how to ${slug.replace(/-/g, ' ')}. Professional insights for MAS-regulated markets.`,
    introduction: `Mastering ${slug.replace(/-/g, ' ')} is essential for any serious Singaporean trader.`,
    steps: [],
    commonMistakes: [],
    drawdownApproach: { title: 'The Drawdown Way', content: 'Process over outcome.', ctaText: 'Join Now', ctaLink: '/sg/signup' },
    faqs: []
  }))
];
