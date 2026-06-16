import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/features/ai-trade-journal",
        destination: "/tools/ai-trade-journal",
        permanent: true,
      },
      {
        source: "/features/risk-calculator",
        destination: "/tools/risk-calculator",
        permanent: true,
      },
      {
        source: "/features/ai-market-scanner",
        destination: "/tools/institutional-scanner",
        permanent: true,
      },
      {
        source: "/features/strategy-backtester",
        destination: "/tools/backtester",
        permanent: true,
      },
      {
        source: "/features/ai-daily-briefing",
        destination: "/tools/daily-briefing",
        permanent: true,
      },
      {
        source: "/features/technical-charts",
        destination: "/tools/market-charts",
        permanent: true,
      },
      // 1. Compare pages
      {
        source: "/compare/ftmo-vs-:slug",
        destination: "/prop-firms",
        permanent: true,
      },
      {
        source: "/compare/funding-pips-vs-:slug",
        destination: "/prop-firms",
        permanent: true,
      },
      {
        source: "/compare/:slug*",
        destination: "/brokers",
        permanent: true,
      },
      // 2. How-to pages
      {
        source: "/how-to/:slug*",
        destination: "/learn-to-trade",
        permanent: true,
      },
      // 3. Best pages
      {
        source: "/best/spread-betting-platform-uk",
        destination: "/brokers",
        permanent: true,
      },
      {
        source: "/best/day-trading-platform-uk",
        destination: "/brokers",
        permanent: true,
      },
      {
        source: "/best/broker-:slug",
        destination: "/brokers",
        permanent: true,
      },
      {
        source: "/best/trading-app-uk",
        destination: "/brokers",
        permanent: true,
      },
      {
        source: "/best/forex-broker-australia",
        destination: "/au/brokers",
        permanent: true,
      },
      {
        source: "/best/:slug*",
        destination: "/learn-to-trade",
        permanent: true,
      },
      // 4. Prop firm individual pages
      {
        source: "/prop-firms/ftmo",
        destination: "/prop-firms",
        permanent: true,
      },
      {
        source: "/prop-firms/the5ers",
        destination: "/prop-firms",
        permanent: true,
      },
      {
        source: "/prop-firms/funding-pips",
        destination: "/prop-firms",
        permanent: true,
      },
      {
        source: "/prop-firms/:slug*",
        destination: "/prop-firms",
        permanent: true,
      },
      // 6. Old blog page redirects
      {
        source: "/blog/why-you-need-a-trade-journal",
        destination: "/blog/the-trading-routine",
        permanent: true,
      },
      {
        source: "/blog/understanding-boe-rate-decisions",
        destination: "/blog/economic-calendar-guide",
        permanent: true,
      },
      {
        source: "/blog/understanding-bank-of-england-rate-decisions",
        destination: "/blog/economic-calendar-guide",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
