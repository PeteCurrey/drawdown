export const BEST_OF_PAGES_CA = [
  {
    slug: "forex-broker-canada",
    eyebrow: "TRADING GATEWAYS // CANADA",
    title: "Best Forex Brokers in Canada for 2026",
    metaDescription: "Compare the best IIROC regulated forex brokers in Canada. Expert reviews of Interactive Brokers, OANDA, and CMC Markets.",
    lastUpdated: "APRIL 2026",
    introduction: "Canadian forex traders benefit from the protection of IIROC (now part of CIRO). Selecting an IIROC-regulated broker ensures your funds are protected by the Canadian Investor Protection Fund (CIPF).",
    methodology: "We evaluated Canadian brokers based on their IIROC compliance, CAD account support, and execution speeds for major and minor pairs.",
    comparisonTable: [
      { rank: 1, name: "Interactive Brokers", bestFor: "Institutional Tech", keyStat: "Direct CAD Access", rating: 4.9, link: "https://ibkr.ca" },
      { rank: 2, name: "OANDA Canada", bestFor: "User Experience", keyStat: "IIROC Regulated", rating: 4.8, link: "https://oanda.ca" },
      { rank: 3, name: "CMC Markets", bestFor: "Advanced Charting", keyStat: "10,000+ Instruments", rating: 4.7, link: "https://cmcmarkets.ca" },
    ],
    reviews: [
      {
        name: "Interactive Brokers",
        description: "IBKR is the top choice for Canadian professionals. They offer the lowest margin rates and direct access to global exchanges.",
        pros: ["IIROC Regulated", "Lowest Commissions", "Advanced TWS Platform", "Strong CAD Support"],
        cons: ["Platform has a steep learning curve", "Customer service can be slow"],
        bestFor: "PROFESSIONAL TRADERS",
        ctaLink: "https://ibkr.ca"
      }
    ],
    faqs: [
      { question: "Is forex trading legal in Canada?", answer: "Yes, forex trading is legal and regulated by IIROC in Canada." }
    ]
  }
];

export const HOW_TO_PAGES_CA = [
  {
    slug: "start-trading-canada",
    eyebrow: "GETTING STARTED // CANADA",
    title: "How to Start Trading in Canada (2026 Guide)",
    metaDescription: "A step-by-step guide for Canadians entering the financial markets. Learn about IIROC rules and TFSA/RRSP trading.",
    lastUpdated: "APRIL 2026",
    introduction: "Starting your trading journey in Canada involves choosing the right account type and ensuring regulatory compliance.",
    steps: [
      { title: "Choose Your Account Type", content: "Decide if you are trading in a taxable margin account or a tax-advantaged account like a TFSA or RRSP." },
      { title: "Find an IIROC Broker", content: "Ensure your broker is a member of CIRO (IIROC) to benefit from CIPF protection." },
      { title: "Understand Leverage Limits", content: "Canadian leverage limits vary by province but are generally stricter than offshore options." },
    ],
    faqs: [
      { question: "Can I trade forex in a TFSA?", answer: "Generally, no. The CRA has strict rules against active trading in TFSAs, though some long-term holdings may be allowed." }
    ]
  }
];

export const COMPARE_PAGES_CA = [
  {
    slug: "ibkr-vs-questrade",
    eyebrow: "BROKER DUEL // CANADA",
    title: "IBKR vs Questrade: Best for Canadians?",
    metaDescription: "Comparing Canada's two most popular platforms. We look at fees, platforms, and mobile accessibility.",
    lastUpdated: "APRIL 2026",
    introduction: "Interactive Brokers and Questrade are the heavyweights of Canadian retail trading. One wins on tech, the other on ease of use.",
    comparisonMatrix: [
      { feature: "Regulation", b1: "IIROC", b2: "IIROC" },
      { feature: "CAD Transfers", b1: "Excellent", b2: "Excellent" },
      { feature: "Options Trading", b1: "Industry Leading", b2: "Standard" },
    ],
    verdict: "IBKR is better for active, technical traders. Questrade is better for long-term investors and those wanting a simpler CAD interface."
  }
];

export const CA_CITIES = [
  "toronto", "vancouver", "montreal", "calgary", "ottawa", "edmonton", "winnipeg", "quebec-city"
];

export const CA_TOPICS = [
  "forex-trading", "stock-trading", "options-trading", "day-trading", "swing-trading"
];

export const CITY_CONTEXT_CA: Record<string, string> = {
  toronto: "Toronto is the financial heart of Canada, where Bay Street traders demand institutional-grade speed and reliability.",
  vancouver: "Vancouver's trading community is vibrant and globally connected, with a strong focus on Asia-Pacific market hours.",
  montreal: "Montreal traders benefit from a sophisticated financial ecosystem and a unique perspective on global market trends.",
  calgary: "Calgary's energy-rich economy fosters a trading community with a deep understanding of commodity and futures markets.",
};

export const TOPIC_DISPLAY_CA: Record<string, string> = {
  "forex-trading": "Forex Trading",
  "stock-trading": "Stock Trading",
  "options-trading": "Options Trading",
  "day-trading": "Day Trading",
  "swing-trading": "Swing Trading",
};
