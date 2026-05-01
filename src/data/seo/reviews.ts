export interface ReviewContent {
  overview: string;
  accountTypes: string;
  platformsTools: string;
  feesCosts: string;
  regulationSafety: string;
  whoShouldUse: string[];
  whoShouldNotUse: string[];
  whoShouldNotUseLong: string;
  verdict: string;
  faqs: { question: string; answer: string }[];
}

export const BROKER_REVIEWS: Record<string, ReviewContent> = {
  ig: {
    overview: `IG Markets (formerly IG Index) is the grandfather of the UK spread betting and CFD industry. Founded in 1974 by Stuart Wheeler, it has grown from a gold-betting specialist into a global FTSE 250 powerhouse. For UK traders, IG is often the first and last broker they ever use.

The reason for IG's dominance isn't just their age; it's their reach. They offer over 17,000 markets across every asset class imaginable — from major forex pairs to obscure small-cap UK stocks and even weekend markets on major indices.

Regulation is the bedrock of the IG offering. They are a publicly-listed company on the London Stock Exchange (LSE: IGG) and are directly authorized by the Financial Conduct Authority (FCA). This provides a level of institutional security that smaller offshore brokers simply cannot match. If you are managing significant capital, IG's stability is a primary reason to choose them.`,
    accountTypes: `IG offers three primary account types for UK residents:

1. Spread Betting Account: The most popular choice for UK residents. All profits are currently tax-free (no Capital Gains Tax or Stamp Duty). You trade in "pounds per point."
2. CFD Trading Account: Used by those who want to hedge existing portfolios or offset losses for tax purposes. CFDs are subject to CGT but offer access to global markets with leverage.
3. Share Dealing & ISA: For long-term investors. You can own physical stocks and hold them in a tax-efficient ISA wrapper.

Professional accounts are also available for those who meet the criteria (large portfolio, significant trading frequency, or professional background), offering higher leverage in exchange for lower regulatory protection.`,
    platformsTools: `IG's technology stack is split between proprietary brilliance and industry-standard integration:

IG Web Platform: One of the best web-based platforms in the world. It is highly customizable, stable, and features integrated News from Reuters and analysis from Autochartist.

L2 Dealer: A specialized platform for DMA (Direct Market Access) trading. It allows you to see the full market depth (Order Book) and trade directly into the exchange liquidity.

MT4: For those who rely on Expert Advisors (EAs), IG provides a solid MT4 bridge, though their native platform offers better charting.

ProRealTime: An advanced technical analysis platform that is free for IG clients who trade a minimum of 4 times per month. It features automated trading and deep historical data.`,
    feesCosts: `IG is not the cheapest broker on the market (that title usually goes to raw-spread brokers like Pepperstone), but they are highly competitive.

Spreads: Fixed spreads start at 0.6 pips on EURUSD and 1 point on the FTSE 100 and Wall Street. 

Overnight Funding: For spread betting and CFDs, you pay a financing charge for holding positions overnight. This is usually based on the relevant interbank rate plus a 2.5% admin fee.

Inactivity Fees: If you don't trade for 2 years, a £12 monthly fee applies.

Deposit/Withdrawal: Most methods are free, including fast bank transfers to UK accounts.`,
    regulationSafety: `IG is the gold standard for safety. 
- FCA Regulated (UK)
- ASIC Regulated (Australia)
- CFTC/NFA Regulated (USA via tastyfx)
- Publicly Listed (FTSE 250)
- Segregated Client Funds: All retail client money is held in separate bank accounts from the company's own capital.
- FSCS Protection: UK clients are protected up to £85,000 per person if the firm fails.`,
    whoShouldUse: [
      "Traders who want tax-free spread betting",
      "Large capital managers who value safety",
      "Traders who need a massive range of stocks (17k+)",
      "Users who want a high-quality web platform"
    ],
    whoShouldNotUse: [
      "Ultra-high frequency scalpers looking for 0.0 pip spreads",
      "Traders who prefer a very simple, eToro-style social interface",
      "US residents (must use tastyfx instead)"
    ],
    whoShouldNotUseLong: "IG is not for the hobbyist who wants a 'gamified' trading experience. The platform is professional and requires a learning curve. If you are just starting with £50 and want to 'copy trade' others, eToro is a better starting point.",
    verdict: "IG remains the undisputed leader for serious UK retail traders. Their combination of safety, market range, and platform stability is unrivaled. If you can only have one broker account, this should be it.",
    faqs: [
      { question: "Is IG Markets safe?", answer: "Yes. IG is FCA regulated, FTSE 250 listed, and has a 50-year track record of reliability." },
      { question: "Is spread betting tax-free at IG?", answer: "Yes, for UK residents, spread betting profits are exempt from Capital Gains Tax and Stamp Duty." }
    ]
  },
  pepperstone: {
    overview: `Pepperstone was founded in Melbourne in 2010 with a single goal: to provide retail traders with the same execution quality and low costs that were previously only available to institutional desks. Since then, they have become one of the world's most respected forex and CFD brokers.

What sets Pepperstone apart is their "No Dealing Desk" execution. They aggregate liquidity from multiple Tier-1 banks and providers, ensuring that you get the tightest possible spreads and sub-30ms execution. They don't trade against you; they benefit when you trade frequently, which aligns their interests with yours.

For UK traders, Pepperstone operates under their FCA-regulated entity (Pepperstone Limited), providing the full suite of retail protections while maintaining their reputation for razor-thin spreads on major forex pairs.`,
    accountTypes: `Pepperstone keeps things simple with two primary account types:

1. Razor Account: The choice for professionals and scalpers. You get raw spreads (often 0.0 pips on majors) and pay a small commission per trade (£2.25 per lot per side).
2. Standard Account: No commission, but spreads are wider (typically starting at 1.0 pips on majors).

Both accounts offer access to the same 1,200+ instruments across forex, indices, stocks, and commodities. Pro accounts are also available with higher leverage for qualified traders.`,
    platformsTools: `Pepperstone doesn't have a proprietary platform; instead, they integrate with the best third-party software on the market:

cTrader: The gold standard for manual execution. It features advanced order types, Level 2 pricing, and a highly intuitive interface.

TradingView: You can connect your Pepperstone account directly to TradingView, allowing you to execute trades directly from the world's best charting software.

MT4 & MT5: The classic choices for automated trading and EA users. Pepperstone's MT4/5 bridge is exceptionally fast.

Capitalise.ai: A unique tool that allows you to automate your trading strategies using plain English, no coding required.`,
    feesCosts: `Pepperstone's fee structure is built for active traders.

Spreads: On the Razor account, EURUSD spreads consistently hit 0.0 pips. The Standard account is also competitive but includes the broker's mark-up.

Commissions: £4.50 per round-turn lot on the Razor account (GBP). This is among the lowest in the industry for FCA-regulated entities.

No Inactivity Fees: Unlike many competitors, Pepperstone does not punish you for taking a break from trading.

Deposit/Withdrawal: Zero fees for bank transfers or cards. Fast processing to UK bank accounts.`,
    regulationSafety: `Pepperstone is highly regulated and trusted worldwide:
- FCA Regulated (UK)
- ASIC Regulated (Australia)
- CySEC Regulated (Europe)
- SCB Regulated (Bahamas)
- DFSA Regulated (Dubai)
- Segregated Client Funds: Client capital is held with top-tier banks and never used for company operations.
- FSCS Protection: UK clients are covered up to £85,000.`,
    whoShouldUse: [
      "Active forex scalpers and day traders",
      "Users who want direct TradingView execution",
      "Automated traders using EAs or Capitalise.ai",
      "Traders who want raw, institutional-grade spreads"
    ],
    whoShouldNotUse: [
      "Traders who need 1Join Drawdown Free individual stocks (use IG)",
      "Long-term investors looking for tax-free ISAs",
      "Absolute beginners who want a community-driven social feed"
    ],
    whoShouldNotUseLong: "If you are a 'buy and hold' stock investor looking to put £500 into Apple shares for 5 years, Pepperstone is not for you. They are a leveraged trading specialist built for active speculation.",
    verdict: "Pepperstone is the best choice for dedicated forex and CFD traders who value execution speed and low costs over all else. Their integration with TradingView and cTrader makes them a modern powerhouse.",
    faqs: [
      { question: "Does Pepperstone allow scalping?", answer: "Yes, Pepperstone has no restrictions on scalping and offers the low latency required for high-frequency strategies." },
      { question: "Can I use TradingView with Pepperstone?", answer: "Yes, Pepperstone natively supports TradingView for both charting and direct trade execution." }
    ]
  },
  "interactive-brokers": {
    overview: `Interactive Brokers (IBKR) is widely considered the ultimate choice for professional traders, hedge funds, and sophisticated retail investors. Founded by Thomas Peterffy in 1978, the firm has been a pioneer in electronic trading, automating almost every aspect of the process to provide the lowest possible costs.

Operating in over 150 markets across 33 countries, IBKR offers an unparalleled depth of assets. Whether you want to trade US equities, European options, Asian futures, or obscure emerging market currencies, IBKR provides a single portal to the global financial system.

For UK residents, IBKR operates under its FCA-regulated entity, providing a secure, institutional-grade environment. While the platform is notoriously complex, the trade-off is a set of tools and a fee structure that is simply unmatched by retail-only brokers.`,
    accountTypes: `IBKR offers a variety of account types, but for most individuals, the "Lite" and "Pro" distinction (mostly in the US) or the tiered vs. fixed pricing (in the UK) is the key:

1. Individual/Joint Accounts: Standard accounts for single or shared ownership.
2. ISA & SIPP: IBKR offers tax-efficient wrappers for UK residents, allowing for long-term stock and bond investment.
3. Professional/Institutional: Dedicated setups for hedge funds, family offices, and introducing brokers.

Pricing Models:
- Tiered Pricing: Best for active traders. You pay a low commission that decreases as your monthly volume increases.
- Fixed Pricing: A straightforward flat rate per share or per trade.`,
    platformsTools: `IBKR's technology is built for power, not simplicity:

Trader Workstation (TWS): The flagship desktop platform. It is an institutional-grade terminal with every imaginable order type, risk management tool, and data scanner. It has a steep learning curve but is incredibly powerful.

IBKR Mobile: One of the most advanced mobile trading apps on the market, offering almost all the functionality of the desktop version.

Client Portal: A simplified web-based interface for account management and basic trading.

IBKR GlobalTrader: A streamlined app designed specifically for beginners and casual investors who want to trade global stocks without the complexity of TWS.`,
    feesCosts: `IBKR is famous for its "rock-bottom" commissions.
- Stocks & ETFs: Commissions start as low as £0.005 per share, with minimums often around £1.00 or $1.00.
- Forex: IBKR provides direct access to interbank quotes with no hidden markups, only a small transparent commission (typically 0.08 to 0.20 basis points).
- Interest Rates: They offer some of the highest interest rates in the industry on uninvested cash balances.
- Inactivity Fees: IBKR famously removed their inactivity fees in 2021, making the platform accessible even for less frequent traders.`,
    regulationSafety: `IBKR is one of the most stable financial institutions in the world:
- FCA Regulated (UK)
- SEC/FINRA Regulated (USA)
- ASIC Regulated (Australia)
- Publicly Listed (NASDAQ: IBKR)
- Massive Capital Position: They hold billions in excess of regulatory requirements.
- SIPC/FSCS Protection: Providing the highest standard of client fund security.`,
    whoShouldUse: [
      "Professional and semi-professional traders",
      "Institutional-grade capital managers",
      "Options and futures specialists",
      "Traders needing access to 150+ global markets"
    ],
    whoShouldNotUse: [
      "Absolute beginners who need a 'simple' interface",
      "Casual investors who find TWS overwhelming",
      "Traders looking for tax-free spread betting (IBKR is CFD/Stock focused)"
    ],
    whoShouldNotUseLong: "If you want a 'set and forget' platform that looks like a modern smartphone app, you will likely find Trader Workstation (TWS) frustrating. It is built for function, not aesthetics.",
    verdict: "Interactive Brokers is the king of institutional trading for retail individuals. If you can handle the learning curve, you will never need another broker.",
    faqs: [
      { question: "Does IBKR have a minimum deposit?", answer: "No, IBKR removed their minimum deposit requirement for most account types in 2021." },
      { question: "Is IBKR safe?", answer: "Yes, they are one of the most highly regulated and well-capitalized brokerage firms globally." }
    ]
  },
  "trading-212": {
    overview: `Trading 212 has disrupted the UK and European investment landscape by being the first to offer truly commission-free stock trading. Based in London and Sofia, they have amassed millions of users by combining a sleek, modern interface with a zero-cost model that appeals to a new generation of investors.

While many "free" brokers have hidden costs, Trading 212 is remarkably transparent. They offer three distinct modes: Invest (physical stocks), ISA (tax-free stocks), and CFD (leveraged trading). This allows users to grow from casual long-term investors into more active traders within the same ecosystem.

For UK residents, their Stocks & Shares ISA is particularly popular, offering the ability to invest up to £20,000 per year without paying tax on dividends or capital gains.`,
    accountTypes: `Trading 212 offers three main account modes:

1. Trading 212 Invest: For long-term physical stock and ETF investing. Zero commission, no limit on trades.
2. Trading 212 ISA: The same as Invest but within the UK government's tax-free wrapper.
3. Trading 212 CFD: Leveraged trading on forex, indices, and commodities. This is where the broker makes most of its revenue through the spread.

Fractional Shares: All accounts support fractional shares, meaning you can buy £1 worth of a high-priced stock like Berkshire Hathaway.`,
    platformsTools: `Trading 212 focuses on simplicity and ease of use:

Mobile App: Consistently the highest-rated trading app in the UK. It is incredibly intuitive, featuring 'Pies and AutoInvest' which allows you to build custom portfolios and automate your monthly contributions.

Web Platform: A mirror of the mobile experience, optimized for larger screens. It includes basic technical analysis tools and clean, fast charting.

Pies & AutoInvest: A unique feature that allows you to copy established portfolios or create your own, automatically rebalancing your investments as you add capital.`,
    feesCosts: `The primary selling point is the zero-commission model.
- Invest/ISA: Zero commission on trades.
- FX Fee: A very low 0.15% fee applies when buying stocks in a different currency.
- CFD: No commission, but spreads are dynamic and typically wider than institutional brokers like Pepperstone.
- 24/7 Interest: They pay daily interest on uninvested cash at competitive market rates.`,
    regulationSafety: `Trading 212 is a secure, well-regulated broker:
- FCA Regulated (UK)
- CySEC Regulated (Europe)
- FSC Regulated (Bulgaria)
- FSCS Protection: UK clients are covered up to £85,000 by the FSCS.
- Private Insurance: They hold additional private insurance (up to €1M) for clients in certain jurisdictions.
- Segregated Funds: Client money is held in top-tier banks, separate from the firm's assets.`,
    whoShouldUse: [
      "Beginners and casual investors",
      "UK residents looking for a free ISA",
      "Investors building custom portfolios via 'Pies'",
      "Traders who want fractional share access"
    ],
    whoShouldNotUse: [
      "Professional day traders needing L2 data",
      "Users of MT4/MT5 or TradingView (not supported)",
      "Traders who need specialized institutional platforms"
    ],
    whoShouldNotUseLong: "Trading 212 is not for the 'power user' who needs complex order types or algorithmic trading support. It is a streamlined gateway for the mass market.",
    verdict: "Trading 212 is the best all-around platform for UK retail investors who want to build a long-term portfolio without being eaten alive by commissions.",
    faqs: [
      { question: "Is Trading 212 actually free?", answer: "Yes, there are zero commissions on the Invest and ISA accounts. They make money through FX fees and the CFD spread." },
      { question: "Can I transfer my ISA to Trading 212?", answer: "Yes, they support full ISA transfers from other UK providers." }
    ]
  },
  "etoro": {
    overview: `eToro is the world's leading social trading platform, having pioneered the concept of "CopyTrading." Founded in Israel in 2007, it has evolved into a global multi-asset platform that combines stocks, crypto, forex, and commodities with a social media-style feed.

The core philosophy of eToro is "democratizing" the markets. They make trading feel accessible and collaborative. Instead of analyzing charts in isolation, users can follow successful traders (Popular Investors), see their performance history, and automatically copy their trades with a single click.

For UK traders, eToro offers a mix of commission-free physical stocks and leveraged CFDs, all under the oversight of the FCA.`,
    accountTypes: `eToro uses a unified account structure that allows you to switch between different asset classes:

1. Retail Account: The standard account for most users, providing access to all social and trading features.
2. Professional Account: For those who meet the regulatory requirements, offering higher leverage and dedicated support.
3. Virtual Account: A $100,000 demo account that is available for life to practice strategies.

CopyTrader: Not a separate account, but a core feature that allows you to allocate a portion of your capital to copy the real-time moves of other traders.`,
    platformsTools: `The eToro experience is centered around its proprietary web and mobile platform:

Social Feed: A real-time stream where traders share insights, charts, and sentiment. It feels very similar to Twitter/X or LinkedIn.

CopyTrader: The flagship tool. You can filter traders by risk score, historical return, and asset class.

Smart Portfolios: Curated thematic portfolios (e.g., 'Big Tech' or 'Renewable Energy') that allow for diversified exposure with one click.

eToro Academy: A massive library of educational content for beginners.`,
    feesCosts: `eToro's fee structure is unique and has some caveats.
- Stocks & ETFs: Zero commission on physical stock purchases.
- Forex/CFD: No commission, but spreads are higher than average (e.g., 1.0 pips on EURUSD).
- Withdrawal Fee: A flat $5 fee for all withdrawals.
- Inactivity Fee: $10 per month after 12 months of no login.
- Currency Conversion: Since all accounts are in USD, UK users pay a fee when depositing or withdrawing in GBP.`,
    regulationSafety: `eToro is a global firm with multiple licenses:
- FCA Regulated (UK)
- ASIC Regulated (Australia)
- CySEC Regulated (Europe)
- FINRA Regulated (USA)
- FSCS Protection: UK clients are covered up to £85,000.
- Public Reputation: While not listed on an exchange yet, they are one of the most recognizable brands in the industry.`,
    whoShouldUse: [
      "Beginners who want to learn from others",
      "Investors looking for passive 'CopyTrading'",
      "Traders who value a social, community feel",
      "Users wanting a mix of stocks and crypto in one place"
    ],
    whoShouldNotUse: [
      "Technical traders who need advanced charting (TradingView/MT4)",
      "High-volume forex traders (spreads are too high)",
      "Privacy-conscious users who don't want a social profile"
    ],
    whoShouldNotUseLong: "eToro is not built for the lone-wolf technical analyst. If you use Pine Script or need sub-millisecond execution, you will find the platform restrictive.",
    verdict: "eToro is the undisputed champion of social trading. It is the perfect starting point for someone who wants to trade but doesn't have the time to master technical analysis.",
    faqs: [
      { question: "Is CopyTrading free?", answer: "Yes, there are no additional management fees for copying other traders. You only pay the standard spreads on the trades executed." },
      { question: "What is the minimum to copy someone?", answer: "The minimum amount required to copy another trader is typically $200." }
    ]
  },
  "xtb": {
    overview: `XTB is one of the largest publicly listed forex and CFD brokers in the world. Based in Poland but with a major presence in London, they have built a reputation for combining a powerful, proprietary platform (xStation 5) with an excellent educational offering.

What makes XTB stand out is their commitment to providing a "premium" feel to retail trading. Their xStation platform is widely regarded as one of the best in the industry, often rivaling IG's web platform for speed and usability.

They offer a vast range of markets (over 5,000) including forex, indices, commodities, and thousands of real stocks and ETFs for UK and European clients with zero commission.`,
    accountTypes: `XTB keeps its offering focused on two tiers:

1. Standard Account: The primary choice for retail traders. It offers competitive spreads and zero commission on stock trading up to €100k monthly volume.
2. Professional Account: For those who meet the EU/UK criteria, offering 1:300 leverage and lower spreads.

Cash Interest: XTB pays interest on uninvested funds, allowing your capital to work even when you aren't in a trade.`,
    platformsTools: `The jewel in XTB's crown is its software:

xStation 5: A multi-award-winning platform that is incredibly fast and feature-rich. It includes an integrated economic calendar, market sentiment indicators, and a 'Trade Calculator' that shows your exact risk before you click buy.

xStation Mobile: A high-performance app that brings the full power of the desktop platform to your phone. It is particularly well-known for its stable price alerts.

Market Analysis: XTB has one of the best in-house research teams, providing daily updates and deep-dive technical webinars.`,
    feesCosts: `XTB's pricing is aggressive and transparent.
- Forex: Spreads from 0.5 pips on majors.
- Stocks/ETFs: 0% commission on physical stocks (up to €100,000 monthly volume).
- Deposits/Withdrawals: Free for almost all methods.
- Inactivity: A €10 fee applies after 12 months of no trading.`,
    regulationSafety: `XTB is a publicly-traded, highly transparent firm:
- FCA Regulated (UK)
- KNF Regulated (Poland)
- CySEC Regulated (Europe)
- Publicly Listed (WSE: XTB): Their financials are audited and available to the public.
- FSCS Protection: UK retail clients are covered up to £85,000.`,
    whoShouldUse: [
      "Traders who want a high-performance web platform",
      "Investors looking for 0% commission stocks",
      "Traders who value high-quality education and research",
      "UK residents who want a reliable, publicly-listed broker"
    ],
    whoShouldNotUse: [
      "MetaTrader 4/5 enthusiasts (XTB phased out MT4 in many regions)",
      "Users who want direct TradingView integration",
      "Traders needing complex DMA (Direct Market Access)"
    ],
    whoShouldNotUseLong: "If your trading strategy relies on specific MT4 indicators or automated Expert Advisors, XTB may not be for you as they prioritize their own xStation software.",
    verdict: "XTB is a top-tier all-rounder. Their xStation platform is a joy to use, and their 0% commission on stocks makes them a direct competitor to both IG and Trading 212.",
    faqs: [
      { question: "Is xStation better than MT4?", answer: "For manual trading, most users find xStation 5 to be more modern and intuitive than MT4. However, MT4 is still superior for automated trading." },
      { question: "Does XTB offer crypto?", answer: "Yes, XTB offers a wide range of crypto CFDs, though restrictions apply for UK retail clients per FCA rules." }
    ]
  },
  "cmc-markets": {
    overview: `CMC Markets is a pioneer of the UK trading industry, founded in 1989 by Lord Peter Cruddas. As a FTSE 250 listed company, they are one of the most stable and respected names in the spread betting and CFD space.

Their "Next Generation" platform is often cited by technical analysts as having the best native charting tools in the industry. They offer a staggering 1Join Drawdown Free instruments, ensuring that no matter how niche your strategy, you can find a market on CMC.

For the serious UK trader, CMC provides a professional-grade alternative to IG, often preferred by those who find IG's interface too cluttered or who need more advanced charting capabilities.`,
    accountTypes: `CMC Markets offers a few distinct account paths:

1. Spread Betting Account: Tax-free trading in GBP per point.
2. CFD Account: Leveraged trading across all 12k markets.
3. CMC Pro: A dedicated account for professional traders with lower spreads and higher leverage.
4. Alpha: A premium service for high-net-worth individuals with dedicated relationship managers.`,
    platformsTools: `CMC's strength lies in its proprietary technology:

Next Generation Platform: A masterpiece of technical engineering. It features over 115 technical indicators, 70+ chart patterns, and unique tools like 'Client Sentiment' and 'Chart Forum'.

Mobile App: One of the most stable and powerful trading apps, having won multiple awards for its execution and charting.

MT4: CMC also provides an MT4 bridge for those who need to run automated strategies.

Price Projection Tool: A unique tool that helps you analyze the potential volatility and price targets of an asset based on historical patterns.`,
    feesCosts: `CMC is competitive, particularly for active traders.
- Forex Spreads: Starting at 0.7 pips on majors.
- Indices: 1.0 point on the UK 100 and Wall Street.
- Inactivity: A £10 monthly fee applies after 12 months of no trading.
- Market Data: Some advanced data feeds for stocks carry a monthly cost, though these are often rebated for active traders.`,
    regulationSafety: `Safety is a non-issue with CMC:
- FCA Regulated (UK)
- ASIC Regulated (Australia)
- Publicly Listed (FTSE 250)
- Segregated Client Funds: Held in top-tier banks.
- FSCS Protection: UK clients are protected up to £85,000.`,
    whoShouldUse: [
      "Advanced technical analysts who need elite charting",
      "Active UK spread bettors looking for a professional platform",
      "Traders needing access to a massive range of niche assets",
      "Institutional-grade retail traders"
    ],
    whoShouldNotUse: [
      "Absolute beginners (the platform is complex)",
      "Casual investors looking for 0% commission physical stocks",
      "Traders who want a simple, social interface"
    ],
    whoShouldNotUseLong: "The 'Next Generation' platform is a professional terminal. If you find it hard to navigate a complex dashboard with multiple windows, you might prefer the simplicity of Trading 212 or Plus500.",
    verdict: "CMC Markets is the 'analyst's broker.' If you spend your day drawing complex patterns and analyzing market sentiment, their platform is unbeatable.",
    faqs: [
      { question: "Is CMC Markets better than IG?", answer: "It depends. IG has more markets and a better news feed, but CMC has superior technical charting tools." },
      { question: "Does CMC Markets offer an ISA?", answer: "Currently, CMC Markets focus is on leveraged Spread Betting and CFDs rather than physical stock ISAs." }
    ]
  },
  "plus500": {
    overview: `Plus500 has built its entire business model on one word: simplicity. While competitors fight to offer the most complex institutional tools, Plus500 has focused on providing the cleanest, most accessible mobile trading experience for the mass retail market.

Founded in Israel and listed on the London Stock Exchange, they are a global CFD specialist. They don't offer physical stocks or ISAs; they focus exclusively on leveraged trading across forex, stocks, indices, and crypto.

For the trader who wants to log in, place a trade on their phone in 5 seconds, and log out, Plus500 is often the preferred choice.`,
    accountTypes: `Plus500 keeps it incredibly simple with essentially one account type:

Retail Account: The standard CFD account. No commission, no hidden tiers. You get exactly what you see on the dashboard.

Professional Account: Available for those who meet the criteria, offering higher leverage.

Plus500 Invest: A newer branch of the firm allowing for physical stock investment in certain regions, though their CFD platform remains the core product.`,
    platformsTools: `Plus500's platform is the antithesis of Interactive Brokers:

WebTrader & Mobile App: The same interface across all devices. It is extremely clean, using a sidebar for navigation and a large, simplified chart in the center.

Trading Academy: A simplified set of videos and articles for beginners.

Economic Calendar: Integrated directly into the platform to show upcoming high-impact news.

Insights: A unique tool that shows current trends and news sentiment for every asset.`,
    feesCosts: `Plus500 makes their money through the spread.
- No Commission: You never pay a flat fee per trade.
- Spreads: Dynamic and competitive, though generally wider than raw-spread brokers.
- Inactivity Fee: $10 per month after 3 months of no login (one of the stricter policies).
- Overnight Funding: Standard financing charges for held positions.`,
    regulationSafety: `Plus500 is a highly regulated, global firm:
- FCA Regulated (UK)
- ASIC Regulated (Australia)
- CySEC Regulated (Europe)
- Publicly Listed (LSE: PLUS): A major constituent of the FTSE 250.
- FSCS Protection: UK retail clients are covered up to £85,000.`,
    whoShouldUse: [
      "Casual mobile-first traders",
      "Beginners who find other platforms too complex",
      "Traders who want a fast, reliable CFD platform",
      "Users who value simplicity over advanced features"
    ],
    whoShouldNotUse: [
      "Serious technical analysts (charting is too basic)",
      "Automated traders (MT4/5 and TradingView are not supported)",
      "Long-term investors looking for tax-free ISAs",
      "Institutional-grade capital managers"
    ],
    whoShouldNotUseLong: "Plus500 is not for the 'power user.' If you need deep market history, Pine Script, or complex algorithmic execution, you will quickly outgrow this platform.",
    verdict: "Plus500 is the best 'fast-food' broker in the world. It is reliable, clean, and does exactly what it says on the tin. Perfect for the casual CFD trader.",
    faqs: [
      { question: "Can I trade crypto on Plus500?", answer: "Yes, Plus500 offers a wide range of crypto CFDs, but UK retail traders are restricted from crypto CFDs by the FCA." },
      { question: "Is Plus500 commission-free?", answer: "Yes, there are zero commissions on all trades. They make money through the spread." }
    ]
  },
  "ic-markets": {
    overview: `IC Markets is one of the world's only true "Raw Spread" brokers. Founded in Sydney in 2007, they were built by traders for traders, with a focus on providing institutional-grade liquidity and lightning-fast execution.

The core differentiator for IC Markets is their infrastructure. They utilize Equinix NY4 data center servers in New York and LD5 in London, the same infrastructure used by major investment banks. This results in sub-1ms latency and almost zero slippage for most orders.

While they are not directly FCA regulated for their main global entity, they are heavily regulated by ASIC (Australia) and CySEC (Europe), making them a top choice for serious high-frequency scalpers and algorithmic traders who need the absolute lowest latency and tightest spreads.`,
    accountTypes: `IC Markets offers three primary account types:

1. Raw Spread (MetaTrader): The most popular choice. Spreads from 0.0 pips with a small commission of $3.50 per lot per side.
2. Raw Spread (cTrader): Optimized for the cTrader platform with a slightly lower commission of $3.00 per $100k traded.
3. Standard Account: No commission, with spreads starting from 0.6 pips.

All accounts provide access to 60+ forex pairs and over 1,000 CFDs across indices, stocks, and commodities.`,
    platformsTools: `IC Markets focuses on providing the best third-party platforms:

MT4 & MT5: The industry standards, optimized with IC Markets' deep liquidity and fast execution.

cTrader: A superior platform for manual traders, offering Level 2 market depth and advanced charting.

TradingView: Full integration for charting and direct trade execution.

Social Trading: They support third-party social trading via Myfxbook AutoTrade and ZuluTrade.`,
    feesCosts: `IC Markets is built for the lowest possible cost of trading.
- Forex Spreads: Consistently 0.0 pips on EURUSD and other majors.
- Commissions: $7.00 round-turn per lot (Standard) or $6.00 (cTrader).
- Deposits/Withdrawals: Zero fees for almost all methods, including credit cards and international bank transfers.
- No Inactivity Fee: They do not charge for dormant accounts.`,
    regulationSafety: `IC Markets is a global firm with strong Tier-1 licenses:
- ASIC Regulated (Australia)
- CySEC Regulated (Europe)
- FSA Regulated (Seychelles)
- Segregated Client Funds: All client capital is held in top-tier banks like Westpac and NAB.
- Professional Indemnity Insurance: Providing an extra layer of security for client funds.`,
    whoShouldUse: [
      "High-frequency scalpers",
      "Algorithmic traders and EA users",
      "Traders needing 0.0 pip raw spreads",
      "Users who value lightning-fast execution"
    ],
    whoShouldNotUse: [
      "UK traders who strictly require FSCS protection (ASIC/CySEC entities)",
      "Absolute beginners who need simple mobile-only apps",
      "Long-term stock investors"
    ],
    whoShouldNotUseLong: "If you are a UK retail trader who values the security of the FCA and FSCS protection above all else, the lack of a direct UK retail license for IC Markets' primary entity might be a deterrent.",
    verdict: "IC Markets is the ultimate choice for the technical power-user. Their execution speed is unmatched in the retail space.",
    faqs: [
      { question: "Is IC Markets an ECN broker?", answer: "Yes, IC Markets uses a true ECN/Raw Spread model with deep institutional liquidity." },
      { question: "What is the minimum deposit?", answer: "The minimum deposit for IC Markets is $200." }
    ]
  },
  "spreadex": {
    overview: `Spreadex is a unique UK-based firm that combines financial spread betting with sports betting. Founded in 1999, it is one of the longest-standing financial firms in the UK and is directly authorized and regulated by the FCA.

Unlike global giants that focus on CFDs, Spreadex has a deep commitment to the UK spread betting market. This means their platform is built specifically for the tax-free trading needs of British residents.

While their interface may feel slightly more traditional than the high-tech dashboards of competitors like XTB, Spreadex offers a level of stability and personal service that is highly valued by its long-term client base.`,
    accountTypes: `Spreadex keeps its financial offering focused on two main account types:

1. Financial Spread Betting Account: The core product for UK residents, offering tax-free trading on thousands of markets.
2. CFD Trading Account: For those who prefer the CFD model for hedging or tax offsetting.

Credit Account: Spreadex is one of the few firms that allows eligible clients to apply for a credit limit, allowing them to trade without depositing the full margin upfront.`,
    platformsTools: `Spreadex provides a stable, proprietary platform:

Web Platform: A clean, traditional interface that is easy to navigate. It includes basic charting and a very efficient order entry system.

Mobile App: A highly functional app that mirrors the web experience, optimized for fast trade execution on the go.

iPad App: A specialized version of their platform that takes full advantage of the larger screen for better charting and market overview.`,
    feesCosts: `Spreadex is known for its competitive, all-inclusive spreads.
- No Commission: Like all spread betting firms, the cost is built into the spread.
- Spreads: 0.6 points on the UK 100 and 0.8 pips on EURUSD.
- No Inactivity Fee: They do not penalize clients for not trading.
- Withdrawals: Fast and free to UK bank accounts.`,
    regulationSafety: `Spreadex is a highly secure UK institution:
- FCA Regulated (UK)
- FSCS Protection: UK clients are covered up to £85,000.
- 20+ Year Track Record: A stable, profitable UK business.
- Segregated Funds: All client capital is held in accordance with FCA client money rules.`,
    whoShouldUse: [
      "UK residents looking for tax-free spread betting",
      "Traders who value traditional, reliable service",
      "Users who also participate in sports spread betting",
      "Eligible clients needing credit trading facilities"
    ],
    whoShouldNotUse: [
      "Global traders outside the UK",
      "Users who need advanced platforms like MT4 or TradingView",
      "High-frequency algorithmic traders"
    ],
    whoShouldNotUseLong: "Spreadex is a specialist UK firm. If you are looking for a global institutional platform with deep API access and automated trading, you will find their proprietary software limiting.",
    verdict: "Spreadex is the 'reliable veteran' of the UK market. It's the perfect choice for the traditional British trader who values safety and simplicity.",
    faqs: [
      { question: "Is Spreadex safe?", answer: "Yes, Spreadex is FCA regulated and has a 25-year history of financial stability in the UK." },
      { question: "Can I bet on sports and finance in one account?", answer: "Yes, Spreadex allows you to manage both your financial and sports betting from a unified login." }
    ]
  },
  "city-index": {
    overview: `City Index is a heavyweight in the UK trading scene, part of the StoneX Group (a NASDAQ-listed Fortune 500 company). With over 40 years of experience, they provide a robust platform for spread betting and CFD trading.

They are known for their "Advantage" platform, which offers a balance between advanced institutional tools and retail-friendly usability. Their Parent company, StoneX, provides deep liquidity and a level of financial backing that few other brokers can match.

For UK traders, City Index offers the security of FCA regulation combined with a massive range of over 13,000 markets.`,
    accountTypes: `City Index offers three primary account levels:

1. Standard Account: The entry point for most traders, offering access to all platforms and markets.
2. Premium Trader: For high-volume traders, offering dedicated account management and lower costs.
3. Professional Account: Offering higher leverage for those who meet the criteria.`,
    platformsTools: `City Index provides a diverse technology stack:

Advantage Web: A powerful HTML5 platform with over 80 technical indicators and one-click trading.

Mobile App: Award-winning app featuring live news from Reuters and integrated technical analysis from Trading Central.

MT4: Full support for automated trading with City Index's competitive pricing.

Performance Analytics: A unique tool (PlayMock) that helps you analyze your trading behavior to identify psychological biases and improve your edge.`,
    feesCosts: `City Index is highly competitive on major markets.
- Spreads: 0.5 points on the UK 100 and 0.8 pips on EURUSD.
- No Commission: For spread betting and most CFDs (stock CFDs carry a small commission).
- Inactivity Fee: £12 per month after 12 months of no trading.`,
    regulationSafety: `City Index is backed by massive institutional capital:
- FCA Regulated (UK)
- parent company StoneX is NASDAQ-listed.
- FSCS Protection: Covered up to £85,000.
- Segregated Client Funds: Strict adherence to FCA rules.`,
    whoShouldUse: [
      "Traders who want institutional-grade backing",
      "UK residents seeking tax-free spread betting",
      "Traders using Performance Analytics to improve their edge",
      "Users who want a mix of MT4 and a solid web platform"
    ],
    whoShouldNotUse: [
      "Beginners who might find 'Advantage Web' too complex",
      "Traders strictly looking for 0% commission physical stocks",
      "US residents"
    ],
    whoShouldNotUseLong: "City Index is a comprehensive platform. If you only want to buy $50 worth of Tesla shares, the platform's professional tools might be overkill.",
    verdict: "City Index is a top-tier choice for serious UK traders who value the stability of a NASDAQ-listed parent company and the insight of advanced performance analytics.",
    faqs: [
      { question: "Is City Index good for beginners?", answer: "Yes, they have an excellent educational hub, though their main platform has a slight learning curve." },
      { question: "Does City Index have TradingView?", answer: "City Index charts are powered by TradingView, though direct account integration via the TradingView site is handled differently than Pepperstone." }
    ]
  },
  "fp-markets": {
    overview: `FP Markets (First Prudential Markets) is an Australian-based powerhouse that has been a favorite of serious traders since 2005. They are famous for their "IRESS" platform, which provides direct market access (DMA) to global stock exchanges.

While they have a strong retail presence, FP Markets is fundamentally an institutional-grade broker. They focus on transparency, using an ECN model to provide raw spreads and ultra-low latency execution.

For global traders (particularly those in Australia and Asia), FP Markets is often the primary alternative to IC Markets, offering a broader range of stock DMA than most other forex specialists.`,
    accountTypes: `FP Markets offers a wide range of account types:

1. Raw Account: Spreads from 0.0 pips with a $3.00 commission per side.
2. Standard Account: No commission, spreads from 1.0 pips.
3. IRESS Accounts (Standard/Platinum/Premier): Specialized accounts for professional stock traders requiring DMA and advanced order types.`,
    platformsTools: `FP Markets offers the world's best trading software:

MT4 & MT5: Optimized for fast ECN execution.

cTrader: A modern, intuitive platform for manual traders.

IRESS: The professional's choice for stock trading, offering Level 2 data and direct exchange access.

TradingView: Full integration for charting and execution.`,
    feesCosts: `FP Markets is built for the active trader.
- Forex Spreads: Consistently 0.0 pips on majors.
- Commissions: One of the lowest at $6.00 round-turn for Raw accounts.
- Stock DMA: Competitive commissions for physical stock trading via IRESS.
- No Inactivity Fee: No penalties for not trading.`,
    regulationSafety: `FP Markets is a Tier-1 regulated global broker:
- ASIC Regulated (Australia)
- CySEC Regulated (Europe)
- Segregated Client Funds: Held with top-tier Australian banks.
- 15+ Year History: A long-standing, stable reputation in the industry.`,
    whoShouldUse: [
      "Serious stock DMA traders",
      "Active forex scalpers",
      "Automated traders needing fast ECN execution",
      "Traders who want the flexibility of IRESS and MT5"
    ],
    whoShouldNotUse: [
      "UK traders who strictly require FCA/FSCS protection",
      "Casual investors looking for a simple mobile app",
      "Absolute beginners"
    ],
    whoShouldNotUseLong: "FP Markets is an institutional-grade broker. If you don't understand what DMA or ECN means, you will likely find the platform and fee structure overly complex.",
    verdict: "FP Markets is the best choice for traders who need both high-performance forex execution and professional stock DMA in one place.",
    faqs: [
      { question: "What is IRESS?", answer: "IRESS is a professional-grade trading platform used for Direct Market Access (DMA) to global stock exchanges." },
      { question: "Is FP Markets safe?", answer: "Yes, they are ASIC regulated and have a 15-year track record of reliability." }
    ]
  },
  "oanda": {
    overview: `OANDA is a titan of the retail forex industry, founded in 1996 in the United States. They were one of the first companies to provide free currency exchange information on the internet and pioneered the retail trading model that we see today.

They are known for their "Institutional Integrity." They provide historical exchange rate data to major corporations and accounting firms (including the Big Four), which speaks to the accuracy and reliability of their data.

For UK and US traders, OANDA is often the most trusted choice due to its extreme regulatory transparency and its focus on being a "pure" forex specialist.`,
    accountTypes: `OANDA keeps its account structure simple:

1. Standard Account: The primary choice for most traders, offering access to their proprietary platform and MT4.
2. Core Account: A lower-spread account with a transparent commission (best for active traders).
3. Elite Trader: For high-volume clients, offering rebates and dedicated support.

OANDA is famous for its "Any Size" trading — you can trade as little as 1 unit of currency, meaning you don't have to trade in fixed "lots."`,
    platformsTools: `OANDA provides a mix of proprietary and industry-standard tools:

OANDA Trade: Their proprietary web and mobile platform, known for its stability and clean design.

MT4: Full support for automated trading and EAs.

TradingView: OANDA was one of the first brokers to fully integrate with TradingView, and many traders use them specifically for this reason.

FXLabs: A suite of advanced tools including historical volatility analysis and currency heat maps.`,
    feesCosts: `OANDA's pricing is transparent and competitive.
- Spreads: Starting at 0.6 pips on the Core account.
- Commissions: Transparently stated on the Core tier.
- No Minimum Deposit: You can start with literally any amount.
- Inactivity Fee: $10 per month after 12 months of no trading.`,
    regulationSafety: `OANDA is the most regulated broker in the world:
- FCA Regulated (UK)
- CFTC/NFA Regulated (USA)
- ASIC Regulated (Australia)
- MAS Regulated (Singapore)
- IIROC Regulated (Canada)
- Segregated Client Funds: Held in accordance with the strictest global rules.`,
    whoShouldUse: [
      "US-based forex traders",
      "Traders needing historical data accuracy",
      "Users who want to trade small amounts (no fixed lots)",
      "Direct TradingView users"
    ],
    whoShouldNotUse: [
      "Traders needing thousands of individual stocks (OANDA is FX/CFD focused)",
      "Scalpers looking for 0.0 pip 'raw' spreads (IBKR or Pepperstone are often lower)",
      "Long-term stock investors"
    ],
    whoShouldNotUseLong: "OANDA is a forex specialist. If you want to build a diversified portfolio of physical stocks, ISAs, or crypto, OANDA's focused offering will be too narrow for you.",
    verdict: "OANDA is the most 'trustworthy' broker in the industry. If you want to know that your data is accurate and your funds are secure across every global jurisdiction, this is your choice.",
    faqs: [
      { question: "Is OANDA better than IG?", answer: "For pure forex and TradingView integration, OANDA is excellent. However, IG has a far wider range of markets including 17,000+ stocks." },
      { question: "Can I trade 1 unit of currency?", answer: "Yes, OANDA is unique in allowing you to trade any unit size, rather than being restricted to micro or mini lots." }
    ]
  },
  "tastyfx": {
    overview: `tastyfx (formerly IG US) is the US-focused retail forex arm of the IG Group. They were launched to bring the power and stability of the global IG brand specifically to the United States market, where retail forex regulation is notoriously strict.

While their parent company (IG) is a global multi-asset giant, tastyfx focuses exclusively on the US forex market. They provide an intuitive, high-performance platform that is designed to compete with OANDA and FOREX.com.

For US traders, tastyfx provides a modern, sleek alternative that benefits from the 50-year institutional history of the IG Group.`,
    accountTypes: `tastyfx focuses on a streamlined account offering for US residents:

Standard Forex Account: Providing access to 80+ currency pairs with no commission and competitive spreads.

Corporate Account: For businesses looking to hedge currency exposure.

Demo Account: A risk-free environment to practice on the tastyfx platform.`,
    platformsTools: `tastyfx utilizes a refined version of the IG technology stack:

tastyfx Web: A simplified, fast version of the IG web platform, optimized for the US forex market.

tastyfx Mobile: A top-rated mobile app with integrated news, alerts, and one-tap execution.

MT4: Full support for automated trading and custom indicators.

Educational Hub: Extensive resources specifically tailored to the unique regulatory environment of US forex trading.`,
    feesCosts: `tastyfx is built on a transparent, no-commission model.
- No Commissions: All costs are included in the spread.
- Spreads: Highly competitive for the US market, starting at 0.8 pips on EURUSD.
- No Minimum Deposit: Start trading with any amount.
- Withdrawals: Fast and free for US domestic bank transfers.`,
    regulationSafety: `tastyfx is fully compliant with strict US rules:
- CFTC Regulated (USA)
- NFA Regulated (USA)
- Parent Company (IG Group) is FTSE 250 listed.
- Segregated Funds: All US client funds are held in domestic banks.`,
    whoShouldUse: [
      "US-based retail forex traders",
      "Traders who want the backing of a FTSE 250 company",
      "Users who value a simple, modern interface",
      "Beginners in the US market"
    ],
    whoShouldNotUse: [
      "Traders outside of the United States",
      "Users looking for stocks, options, or crypto (must use tastytrade)",
      "High-frequency scalpers needing 0.0 pip raw spreads"
    ],
    whoShouldNotUseLong: "tastyfx is for forex only. If you want to trade options or stocks in the US, you should use their sister company, tastytrade. They do not accept non-US residents.",
    verdict: "tastyfx is the best new entrant to the US forex market. It combines the reliability of a 50-year-old firm with a clean, modern user experience.",
    faqs: [
      { question: "Is tastyfx the same as tastytrade?", answer: "No. tastyfx is for forex trading, while tastytrade is for options, stocks, and futures. Both are owned by the IG Group." },
      { question: "Is tastyfx safe?", answer: "Yes, they are highly regulated by the CFTC and NFA and are backed by one of the largest brokerage firms in the world." }
    ]
  }
};
