export const BEST_OF_PAGES_HK = [
  {
    slug: "forex-broker-hong-kong",
    eyebrow: "TRADING GATEWAYS // HONG KONG",
    title: "Best Forex Brokers in Hong Kong for 2026",
    metaDescription: "Compare the best SFC-regulated forex brokers in Hong Kong. Expert reviews of IG, Interactive Brokers, and Saxo HK.",
    lastUpdated: "APRIL 2026",
    introduction: "Hong Kong remains a critical gateway to global markets. For traders in HK, using an Securities and Futures Commission (SFC) regulated broker is essential for regulatory protection.",
    methodology: "We analyzed SFC Type 3 licensed brokers, focusing on their multi-asset capabilities, HKD funding efficiency, and platform localized for the HK market.",
    comparisonTable: [
      { rank: 1, name: "IG Hong Kong", bestFor: "Overall / Global Reach", keyStat: "SFC Licensed", rating: 4.9, link: "https://ig.com/hk" },
      { rank: 2, name: "Interactive Brokers HK", bestFor: "Low Cost / Professional", keyStat: "Global Assets", rating: 4.8, link: "https://interactivebrokers.com.hk" },
    ],
    reviews: [
      {
        name: "IG Hong Kong",
        description: "IG is a premier SFC-regulated broker in Hong Kong, providing access to thousands of global markets with a highly reliable platform.",
        pros: ["SFC Licensed (Type 3)", "HKD Denominated Accounts", "Advanced Technical Tools", "Professional Support"],
        cons: ["Leverage capped at 1:20", "Higher margin requirements for retail"],
        bestFor: "PROFESSIONAL RETAIL TRADERS",
        ctaLink: "https://ig.com/hk"
      }
    ],
    faqs: [
      { question: "Is trading tax-free in Hong Kong?", answer: "Yes, Hong Kong generally does not tax capital gains for individuals. This makes it one of the best places in the world to trade." }
    ]
  }
];

export const HK_CITIES = [
  "central", "tst", "kowloon", "wan-chai", "causeway-bay"
];

export const HK_TOPICS = [
  "forex-trading", "stock-trading", "options-trading", "crypto-trading", "day-trading"
];

export const CITY_CONTEXT_HK: Record<string, string> = {
  central: "In the heart of the global financial engine, Central traders operate with institutional precision.",
  tst: "Tsim Sha Tsui's vibrant energy is matched by its community of high-performance retail traders.",
  kowloon: "Kowloon is a major hub for independent traders who leverage the city's world-class digital infrastructure.",
  "wan-chai": "Wan Chai's dynamic business environment is home to many sophisticated multi-asset traders.",
  "causeway-bay": "Traders in Causeway Bay demand the best-in-class mobile tools for fast-paced market analysis.",
};

export const TOPIC_DISPLAY_HK: Record<string, string> = {
  "forex-trading": "Forex Trading",
  "stock-trading": "Stock Trading",
  "options-trading": "Options Trading",
  "crypto-trading": "Crypto Trading",
  "day-trading": "Day Trading",
};
