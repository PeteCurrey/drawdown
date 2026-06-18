import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Features / Tools
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

      // Compare / How-to / Best (General & Regional)
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
        source: "/hk/compare",
        destination: "/compare",
        permanent: false,
      },
      {
        source: "/hk/how-to",
        destination: "/how-to",
        permanent: false,
      },
      {
        source: "/sg/compare",
        destination: "/compare",
        permanent: false,
      },
      {
        source: "/sg/how-to",
        destination: "/how-to",
        permanent: false,
      },
      {
        source: "/us/compare",
        destination: "/compare",
        permanent: false,
      },
      {
        source: "/us/how-to",
        destination: "/how-to",
        permanent: false,
      },
      {
        source: "/compare/:slug",
        destination: "/brokers",
        permanent: true,
      },
      {
        source: "/how-to/:slug",
        destination: "/learn-to-trade",
        permanent: true,
      },
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
        source: "/best/:slug",
        destination: "/learn-to-trade",
        permanent: true,
      },

      // Regional Learn to Trade / Cities
      {
        source: "/us/learn-to-trade",
        destination: "/learn-to-trade",
        permanent: false,
      },
      {
        source: "/au/learn-to-trade",
        destination: "/learn-to-trade",
        permanent: false,
      },
      {
        source: "/us/learn-to-trade/:topic/:city",
        destination: "/learn-to-trade/:topic",
        permanent: false,
      },
      {
        source: "/au/learn-to-trade/:topic/:city",
        destination: "/learn-to-trade/:topic",
        permanent: false,
      },

      // Courses
      {
        source: "/courses/beginner-mastery",
        destination: "/courses",
        permanent: false,
      },

      // Broker redirects
      {
        source: "/brokers/quiz",
        destination: "/brokers",
        permanent: false,
      },
      {
        source: "/brokers/ig-index",
        destination: "/brokers/ig-markets-review",
        permanent: true,
      },

      // Auth pages
      {
        source: "/forgot-password",
        destination: "/login",
        permanent: false,
      },

      // Legacy learn paths
      {
        source: "/learn/:slug*",
        destination: "/learn-to-trade",
        permanent: true,
      },

      // Regional Brokers / Best / Compare / How-to
      {
        source: "/hk/brokers/:broker",
        destination: "/brokers",
        permanent: false,
      },
      {
        source: "/au/brokers/:broker",
        destination: "/brokers",
        permanent: false,
      },
      {
        source: "/hk/best/:slug",
        destination: "/brokers",
        permanent: false,
      },
      {
        source: "/au/best/:slug",
        destination: "/brokers",
        permanent: false,
      },
      {
        source: "/au/compare/:slug",
        destination: "/brokers",
        permanent: false,
      },
      {
        source: "/au/how-to/:slug",
        destination: "/learn-to-trade",
        permanent: false,
      },

      // Prop firm individual pages
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
        source: "/prop-firms/:slug",
        destination: "/prop-firms",
        permanent: true,
      },

      // Old blog page redirects
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
