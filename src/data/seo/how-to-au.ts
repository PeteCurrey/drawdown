import { HowToPage } from "./howto";

export const HOW_TO_PAGES_AU: HowToPage[] = [
  {
    slug: 'start-trading-australia',
    title: 'How to Start Trading in Australia — The Complete 2026 Guide',
    eyebrow: '// GETTING STARTED',
    readingTime: 15,
    metaDescription: 'Step-by-step guide on how to start trading in Australia. From ASIC regulations to opening your first live account with an AFSL broker.',
    introduction: 'Starting your trading journey in Australia requires more than just a laptop. You need to understand the regulatory landscape and the institutional players that define the market.',
    steps: [
      { title: '1. Understand ASIC Regulations', content: 'Ensure you are aware of the 1:30 leverage cap for retail traders.' },
      { title: '2. Select an AFSL Broker', content: 'Always check the AFSL number on the ASIC registry.' },
    ],
    commonMistakes: ['Over-leveraging despite the 1:30 cap', 'Ignoring ATO tax obligations'],
    drawdownApproach: {
      title: 'Our Australian Blueprint',
      content: 'We focus on long-term capital growth through disciplined risk management.',
      ctaText: 'Start Curriculum',
      ctaLink: '/au/courses'
    },
    faqs: []
  },
  ...['trade-forex-australia', 'choose-broker-australia', 'trade-asx', 'trade-audusd', 'pay-tax-trading-australia', 'trade-crypto-australia', 'use-leverage-australia', 'open-trading-account-australia', 'trade-gold-australia'].map(slug => ({
    slug,
    title: `How to ${slug.replace(/-/g, ' ').toUpperCase()}`,
    eyebrow: '// AUSTRALIA GUIDE',
    readingTime: 12,
    metaDescription: `A comprehensive guide on how to ${slug.replace(/-/g, ' ')} in Australia. Professional insights and step-by-step instructions.`,
    introduction: `Mastering the art of ${slug.replace(/-/g, ' ')} is a critical skill for any Australian trader.`,
    steps: [],
    commonMistakes: [],
    drawdownApproach: { title: 'The Drawdown Way', content: 'Execution is everything.', ctaText: 'Join Now', ctaLink: '/au/signup' },
    faqs: []
  }))
];
