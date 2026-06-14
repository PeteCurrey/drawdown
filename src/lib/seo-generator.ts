import { brokers } from "@/data/brokers";

export interface ProgrammaticSeoPage {
  slug: string;
  title: string;
  metaDescription: string;
  introduction: string;
  topPickId: string;
  top3Ids: string[];
  reviews: {
    id: string;
    description: string;
    verdict: string;
    bestFor: string;
    pros: string[];
    cons: string[];
    ctaLink: string;
  }[];
  methodology: string;
  faqs: { question: string; answer: string }[];
  relatedPages: { title: string; slug: string }[];
  whoIsNotFor?: string;
}

// Clean capitalization helper
function capitalize(str: string) {
  return str.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export function resolveProgrammaticSeo(slug: string): ProgrammaticSeoPage | null {
  const s = slug.toLowerCase();

  // 1. BEST BROKER FOR [MARKET]
  if (s.startsWith("best-broker-for-")) {
    const market = s.replace("best-broker-for-", "");
    const marketName = capitalize(market);
    
    // Supported markets: gold, forex, crypto, stocks, oil, indices, silver, commodities
    const validMarkets = ["gold", "forex", "crypto", "stocks", "oil", "indices", "silver", "commodities"];
    if (!validMarkets.includes(market)) return null;

    // Rank brokers based on market compatibility
    let rankedIds = ["ig", "pepperstone", "ibkr"];
    if (market === "crypto") rankedIds = ["etoro", "pepperstone", "xtb"];
    if (market === "stocks") rankedIds = ["ig", "ibkr", "trading-212"];
    if (market === "forex") rankedIds = ["pepperstone", "ig", "cmc-markets"];

    return {
      slug,
      title: `Best Broker For ${marketName} Trading 2026 — Tested & Reviewed | Drawdown`,
      metaDescription: `Discover the top-rated brokers for trading ${marketName} in 2026. We compare spreads, execution speed, fees, and safety parameters.`,
      introduction: `Trading ${marketName} successfully requires a broker with tight spreads, high liquidity, and minimal execution slippage. In this guide, we analyze the top platforms to help you choose the best partner for your strategy.`,
      topPickId: rankedIds[0],
      top3Ids: rankedIds,
      reviews: rankedIds.map(id => {
        const b = brokers.find(x => x.id === id);
        return {
          id,
          description: `${b?.name} is highly recommended for ${marketName} due to its robust liqudity pools, low spreads, and stable platform.`,
          verdict: `An outstanding choice for ${marketName} trading, providing excellent speed and capital safety.`,
          bestFor: `Lowest transaction costs on ${marketName}`,
          pros: b?.pros || [],
          cons: b?.cons || [],
          ctaLink: `/go/${b?.slug}`
        };
      }),
      methodology: `Our analysis focuses on average spreads on ${marketName}, execution latency, and regulatory protection.`,
      faqs: [
        { question: `What is the best broker for ${marketName}?`, answer: `Based on our reviews, the best broker is ${brokers.find(x => x.id === rankedIds[0])?.name} due to competitive spreads and superior execution speeds.` }
      ],
      relatedPages: [
        { title: `Best Broker for Scalping`, slug: `best-broker-for-scalping` },
        { title: `Spread Betting vs CFDs`, slug: `spread-betting-vs-cfds` }
      ]
    };
  }

  // 2. BEST BROKER IN [COUNTRY]
  if (s.startsWith("best-broker-in-")) {
    const country = s.replace("best-broker-in-", "");
    const countryName = capitalize(country);

    // Supported countries: uk, australia, usa, singapore, germany, canada, south-africa, uae
    const validCountries = ["uk", "australia", "usa", "singapore", "germany", "canada", "south-africa", "uae"];
    if (!validCountries.includes(country)) return null;

    let rankedIds = ["ig", "pepperstone", "ibkr"];
    if (country === "usa") rankedIds = ["ibkr", "etoro", "plus500"];
    if (country === "australia") rankedIds = ["pepperstone", "ig", "ibkr"];

    return {
      slug,
      title: `Best Broker In ${countryName} 2026 — Top Platforms Reviewed | Drawdown`,
      metaDescription: `Compare the best regulated brokers in ${countryName} for 2026. We analyze local regulation, currency fees, and execution features.`,
      introduction: `Finding the right broker in ${countryName} depends heavily on local regulatory compliance, base currency fees, and execution speeds to global liquidity hubs. Here are our top reviewed choices.`,
      topPickId: rankedIds[0],
      top3Ids: rankedIds,
      reviews: rankedIds.map(id => {
        const b = brokers.find(x => x.id === id);
        return {
          id,
          description: `${b?.name} provides local currency accounts and regulatory protections suited for residents of ${countryName}.`,
          verdict: `A highly trusted and secure option for traders operating from ${countryName}.`,
          bestFor: `Regulatory safety and support in ${countryName}`,
          pros: b?.pros || [],
          cons: b?.cons || [],
          ctaLink: `/go/${b?.slug}`
        };
      }),
      methodology: `We rate brokers in ${countryName} based on local regulatory compliance, execution latency, and local funding options.`,
      faqs: [
        { question: `Is trading legal in ${countryName}?`, answer: `Yes, trading is legal and regulated in ${countryName} by official financial authorities.` }
      ],
      relatedPages: [
        { title: `Best low Spread Broker`, slug: `low-spread-broker-uk` },
        { title: `Best Day Trading Platform`, slug: `day-trading-platform-uk` }
      ]
    };
  }

  // 3. BEST BROKER FOR [STRATEGY]
  if (s.startsWith("best-broker-for-")) {
    const strategy = s.replace("best-broker-for-", "");
    const strategyName = capitalize(strategy);

    const validStrategies = ["scalping", "hedging", "copy-trading", "ea-trading", "day-trading", "swing-trading"];
    if (!validStrategies.includes(strategy)) return null;

    let rankedIds = ["pepperstone", "ig", "ibkr"];
    if (strategy === "copy-trading") rankedIds = ["etoro", "pepperstone", "xtb"];
    if (strategy === "scalping") rankedIds = ["pepperstone", "cmc-markets", "ig"];

    return {
      slug,
      title: `Best Broker For ${strategyName} 2026 — Maximise Your Edge | Drawdown`,
      metaDescription: `Which broker supports ${strategyName} best? We analyze execution speeds, margins, and platform APIs for ${strategyName} systems.`,
      introduction: `Executing a ${strategyName} strategy requires specific broker characteristics. Scalping requires raw spreads; swing trading requires low overnight swaps; and copy trading requires a large community pool. Here are our top picks.`,
      topPickId: rankedIds[0],
      top3Ids: rankedIds,
      reviews: rankedIds.map(id => {
        const b = brokers.find(x => x.id === id);
        return {
          id,
          description: `${b?.name} fits ${strategyName} strategies perfectly because of its tailored margin policies and fast execution.`,
          verdict: `A top-tier environment for executing your ${strategyName} rules.`,
          bestFor: `Execution speed for ${strategyName}`,
          pros: b?.pros || [],
          cons: b?.cons || [],
          ctaLink: `/go/${b?.slug}`
        };
      }),
      methodology: `We rank strategic compatibility based on slippage models, API support, and commissions.`,
      faqs: [
        { question: `Does my broker allow ${strategyName}?`, answer: `Yes, the listed brokers fully permit and support ${strategyName} strategies with no restrictions.` }
      ],
      relatedPages: [
        { title: `Best Broker for beginners`, slug: `broker-for-beginners-uk` },
        { title: `Forex Broker UK`, slug: `forex-broker-uk` }
      ]
    };
  }

  // 4. BEST PROP FIRM FOR [STYLE]
  if (s.startsWith("best-prop-firm-for-")) {
    const style = s.replace("best-prop-firm-for-", "");
    const styleName = capitalize(style);

    const validStyles = ["swing-trading", "news-trading", "ea-trading", "scalping", "high-leverage"];
    if (!validStyles.includes(style)) return null;

    let rankedIds = ["the5ers", "ftmo", "city-traders-imperium"];
    if (style === "news-trading") rankedIds = ["ftmo", "the5ers", "fundednext"];
    if (style === "high-leverage") rankedIds = ["ftmo", "fundednext", "the5ers"];

    return {
      slug,
      title: `Best Prop Firm For ${styleName} 2026 — Scaling Capital | Drawdown`,
      metaDescription: `Discover the best funded account challenges for ${styleName}. We compare drawdown guidelines and rules.`,
      introduction: `Managing a prop firm account for ${styleName} requires rules that won't trigger accidental breaches. Some firms restrict weekend holding, news trades, or EA bots. Here are the most flexible choices.`,
      topPickId: rankedIds[0],
      top3Ids: rankedIds,
      reviews: rankedIds.map(id => {
        const nameMap: Record<string, string> = { "ftmo": "FTMO", "the5ers": "The5%ers", "city-traders-imperium": "City Traders Imperium" };
        const name = nameMap[id] || id;
        return {
          id,
          description: `${name} provides the most accommodating rules and drawdown limits for executing ${styleName}.`,
          verdict: `A solid capital partner for ${styleName} traders.`,
          bestFor: `Flexible rules for ${styleName}`,
          pros: ["High profit split", "Reliable payout history"],
          cons: ["Evaluation entry fees apply"],
          ctaLink: `/go/${id}`
        };
      }),
      methodology: `We rate prop firms for ${styleName} based on profit split terms, scaling speed, and rules parameters.`,
      faqs: [
        { question: `Can I run EAs and bots?`, answer: `Yes, many modern prop firms fully support automated execution, although rules on copy trading vary.` }
      ],
      relatedPages: [
        { title: `FTMO vs The5ers`, slug: `ftmo-vs-the5ers` },
        { title: `Prop Firm Reviews`, slug: `prop-firm` }
      ]
    };
  }

  // 5. BEST TRADING TOOL FOR [USECASE]
  if (s.startsWith("best-trading-tool-for-")) {
    const usecase = s.replace("best-trading-tool-for-", "");
    const usecaseName = capitalize(usecase);

    const validUsecases = ["backtesting", "charting", "journaling", "risk-management"];
    if (!validUsecases.includes(usecase)) return null;

    let rankedIds = ["tradingview", "forex-tester", "tradervue"];
    if (usecase === "journaling") rankedIds = ["tradervue", "tradingview", "forex-tester"];
    if (usecase === "risk-management") rankedIds = ["tradingview", "tradervue", "forex-tester"];

    return {
      slug,
      title: `Best Trading Tool For ${usecaseName} 2026 — Complete Stack | Drawdown`,
      metaDescription: `Improve your performance with the best tools for ${usecaseName}. We review pricing and features.`,
      introduction: `Your trading stack determines your speed of execution and analysis. Here are the top-rated reviewed tools to master ${usecaseName} in 2026.`,
      topPickId: rankedIds[0],
      top3Ids: rankedIds,
      reviews: rankedIds.map(id => {
        const nameMap: Record<string, string> = { "tradingview": "TradingView", "tradervue": "Tradervue", "forex-tester": "Forex Tester" };
        const name = nameMap[id] || id;
        return {
          id,
          description: `${name} is our top recommendation for ${usecaseName} because of its feature depth and simplicity.`,
          verdict: `An absolute essential for ${usecaseName}.`,
          bestFor: `Highest utility for ${usecaseName}`,
          pros: ["Industry-standard features", "Saves execution analysis time"],
          cons: ["Advanced features require subscriptions"],
          ctaLink: `/go/${id}`
        };
      }),
      methodology: `We evaluate tools based on utility, speed, cost, and reliability.`,
      faqs: [
        { question: `Do I need paid tools?`, answer: `Many tools offer high-quality free versions that are fully sufficient for beginners. Reinvest your profits later to upgrade.` }
      ],
      relatedPages: [
        { title: `Trading Tools Hub`, slug: `trading-tools` },
        { title: `Best Trading Journal`, slug: `trading-journal` }
      ]
    };
  }

  return null;
}
