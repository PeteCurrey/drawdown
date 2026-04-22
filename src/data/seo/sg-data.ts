export const BEST_OF_PAGES_SG = [
  {
    slug: "forex-broker-singapore",
    eyebrow: "TRADING GATEWAYS // SINGAPORE",
    title: "Best Forex Brokers in Singapore for 2026",
    metaDescription: "Compare the best MAS-regulated forex brokers in Singapore. Expert reviews of IG, Saxo, and OANDA Singapore.",
    lastUpdated: "APRIL 2026",
    introduction: "Singapore is the leading forex hub in Asia. For traders here, using a Monetary Authority of Singapore (MAS) regulated broker ensures the highest levels of investor protection and capital security.",
    methodology: "We evaluated MAS-regulated brokers based on their SGD funding options, proximity to Singapore-based data centers, and compliance with MAS retail leverage rules.",
    comparisonTable: [
      { rank: 1, name: "IG Singapore", bestFor: "Overall / Variety", keyStat: "17,000+ Markets", rating: 4.9, link: "https://ig.com/sg" },
      { rank: 2, name: "Saxo Markets", bestFor: "Multi-Asset / Premium", keyStat: "Institutional Grade", rating: 4.8, link: "https://home.saxo/en-sg" },
      { rank: 3, name: "OANDA SG", bestFor: "Beginners", keyStat: "No Min Deposit", rating: 4.7, link: "https://oanda.com/sg-en" },
    ],
    reviews: [
      {
        name: "IG Singapore",
        description: "IG is the market leader in Singapore for a reason. Their platform is robust, and they are one of the few to offer a massive range of markets alongside deep local support.",
        pros: ["MAS Regulated", "SGD Denominated Accounts", "Superior Mobile App", "Local Physical Office"],
        cons: ["Capped leverage (1:20)", "Interface can be busy for new users"],
        bestFor: "ALL-ROUND PERFORMANCE",
        ctaLink: "https://ig.com/sg"
      }
    ],
    faqs: [
      { question: "Is trading tax-free in Singapore?", answer: "Generally, yes. Singapore does not have a capital gains tax. However, if trading is your primary source of income, it may be treated as taxable income." }
    ]
  }
];

export const HOW_TO_PAGES_SG = [
  {
    slug: "start-trading-singapore",
    eyebrow: "GETTING STARTED // SINGAPORE",
    title: "How to Start Trading in Singapore",
    metaDescription: "The complete guide to starting your trading journey in Singapore. MAS rules, tax benefits, and broker selection.",
    lastUpdated: "APRIL 2026",
    introduction: "Singapore offers one of the most favorable environments for traders globally. This guide covers the essential steps to get started correctly.",
    steps: [
      { title: "Select an MAS Broker", content: "Ensure your broker is licensed by the Monetary Authority of Singapore for peace of mind." },
      { title: "Fund in SGD", content: "Use PayNow or local bank transfers to avoid currency conversion costs." },
    ],
    faqs: [
      { question: "Do I need a high income to trade in SG?", answer: "No, but you must pass a Customer Knowledge Assessment (CKA) to trade certain products." }
    ]
  }
];

export const SG_CITIES = [
  "central-area", "jurong-east", "woodlands", "tampines", "orchard", "marina-bay", "changi", "bukit-timah"
];

export const SG_TOPICS = [
  "forex-trading", "stock-trading", "crypto-trading", "day-trading"
];

export const CITY_CONTEXT_SG: Record<string, string> = {
  "central-area": "In the heart of the CBD, traders are surrounded by the pulse of Asia's financial markets.",
  "jurong-east": "The gateway to Singapore's second CBD, Jurong traders lead the way in innovative trading strategies.",
  woodlands: "The northern hub for traders leveraging Singapore's robust connectivity to regional markets.",
  tampines: "The bustling eastern regional center is home to a growing community of disciplined retail traders.",
  orchard: "Sophisticated traders in the Orchard area demand premium tools and institutional-grade intelligence.",
  "marina-bay": "At the pinnacle of Singapore's financial scene, Marina Bay traders operate at the highest level of the market.",
  "changi": "Changi's global connectivity is mirrored in its forward-thinking trading community.",
  "bukit-timah": "Bukit Timah residents access institutional-grade insights for building resilient, long-term portfolios."
};

export const TOPIC_DISPLAY_SG: Record<string, string> = {
  "forex-trading": "Forex Trading",
  "stock-trading": "Stock Trading",
  "options-trading": "Options Trading",
  "crypto-trading": "Crypto Trading",
  "day-trading": "Day Trading",
};
