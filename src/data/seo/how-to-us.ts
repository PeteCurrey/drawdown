import { HowToPage } from "./howto";

export const HOW_TO_PAGES_US: HowToPage[] = [
  {
    slug: 'pay-tax-trading-us',
    title: 'How to Pay Taxes on Trading in the US — Section 988 vs 1256',
    eyebrow: '// IRS COMPLIANCE',
    readingTime: 18,
    metaDescription: 'Complete guide to US trading taxes. Understand the difference between Section 988 and 1256, the wash sale rule, and how to report to the IRS.',
    introduction: 'The IRS treats trading profits differently depending on the asset class and your tax election. Understanding Section 1256 contracts and Section 988 can save you thousands in tax liabilities.',
    steps: [
      { title: '1. Identify Your Asset Class', content: 'Forex is generally taxed under Section 988 (Ordinary Income), while Futures and some Options qualify for 60/40 capital gains treatment under Section 1256.' },
      { title: '2. Understand the Wash Sale Rule', content: 'Avoid the common mistake of claiming losses on stocks or options if you repurchase the same security within 30 days.' },
    ],
    commonMistakes: [
      'Ignoring the Wash Sale rule on stock options',
      'Failing to opt-out of Section 988 for forex if capital gains treatment is more favorable',
      'Mixing business and personal trading expenses'
    ],
    drawdownApproach: {
      title: 'Our Tax Efficiency Philosophy',
      content: 'We advocate for rigorous record-keeping and professional tax planning as part of your business operations.',
      ctaText: 'Access Tax Modules',
      ctaLink: '/us/courses'
    },
    faqs: []
  },
  ...['start-trading-us', 'trade-forex-us', 'day-trade-stocks-us', 'choose-broker-us', 'trade-options', 'trade-futures-us', 'avoid-pdt-rule', 'trade-with-small-account-us', 'trade-penny-stocks-us', 'open-margin-account-us', 'trade-premarket-afterhours', 'use-level-2-data', 'trade-spy-options', 'pass-prop-firm-us'].map(slug => ({
    slug,
    title: `How to ${slug.replace(/-/g, ' ').toUpperCase()} in the USA`,
    eyebrow: '// US TRADING GUIDE',
    readingTime: 15,
    metaDescription: `A comprehensive US-focused guide on how to ${slug.replace(/-/g, ' ')}. Master the American markets with professional insights.`,
    introduction: `Learning how to ${slug.replace(/-/g, ' ')} correctly is essential for navigating the complex US regulatory environment.`,
    steps: [],
    commonMistakes: [],
    drawdownApproach: { title: 'The Drawdown Method', content: 'Rule-based execution is the only path.', ctaText: 'Join Now', ctaLink: '/us/signup' },
    faqs: []
  }))
];
