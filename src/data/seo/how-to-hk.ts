import { HowToPage } from "./howto";

export const HOW_TO_PAGES_HK: HowToPage[] = [
  {
    slug: 'trading-tax-hong-kong',
    title: 'Trading Taxes in Hong Kong — The 0% Capital Gains Edge',
    eyebrow: '// TAX EFFICIENCY',
    readingTime: 12,
    metaDescription: 'Complete guide to trading taxes in Hong Kong. Learn why individuals pay 0% capital gains tax and how to leverage the SFC-regulated environment.',
    introduction: 'Hong Kong is one of the world\'s most tax-friendly jurisdictions for individual traders. Unlike many other global hubs, there is no capital gains tax on personal trading profits.',
    steps: [
      { title: '1. Understand the Territorial System', content: 'Hong Kong operates on a territorial basis. Capital gains from the disposal of assets (like stocks or FX) are generally not taxable for individuals.' },
      { title: '2. Distinguish Between Profit and Income', content: 'Ensure your trading activity is classified as capital gain rather than professional income if you are a full-time trader.' },
    ],
    commonMistakes: ['Failing to track professional income tax if applicable', 'Ignoring stamp duty on HSI stocks'],
    drawdownApproach: {
      title: 'Our HK Blueprint',
      content: 'We help you maximize Hong Kong\'s tax advantages through professional-grade performance.',
      ctaText: 'Access HK Curriculum',
      ctaLink: '/hk/courses'
    },
    faqs: []
  },
  ...['start-trading-hong-kong', 'trade-forex-hong-kong', 'choose-broker-hong-kong', 'trade-hsi', 'trade-us-stocks-from-hong-kong', 'trade-asia-session', 'trade-during-london-from-asia'].map(slug => ({
    slug,
    title: `How to ${slug.replace(/-/g, ' ').toUpperCase()} in Hong Kong`,
    eyebrow: '// HK TRADING GUIDE',
    readingTime: 15,
    metaDescription: `A comprehensive Hong Kong-focused guide on how to ${slug.replace(/-/g, ' ')}. Professional insights for SFC-regulated markets.`,
    introduction: `Mastering ${slug.replace(/-/g, ' ')} is essential for any serious Hong Kong trader.`,
    steps: [],
    commonMistakes: [],
    drawdownApproach: { title: 'The Drawdown Way', content: 'Process is everything.', ctaText: 'Join Now', ctaLink: '/hk/signup' },
    faqs: []
  }))
];
