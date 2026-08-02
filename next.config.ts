import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    cpus: 1
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/register",
        destination: "/signup",
        permanent: true,
      },
      // ─── Dashboard tool renames (permanent — old URLs redirect to new) ──
      {
        source: "/dashboard/tools/risk-calculator",
        destination: "/dashboard/tools/position-sizer",
        permanent: true,
      },
      {
        source: "/dashboard/tools/risk-calculator/:path*",
        destination: "/dashboard/tools/position-sizer/:path*",
        permanent: true,
      },
      {
        source: "/dashboard/tools/scanner",
        destination: "/dashboard/tools/technical-scanner",
        permanent: true,
      },
      {
        source: "/dashboard/tools/scanner/:path*",
        destination: "/dashboard/tools/technical-scanner/:path*",
        permanent: true,
      },

      // Hub Page Redirects
      {
        source: "/brokers",
        destination: "/brokers/all",
        permanent: true,
      },
      {
        source: "/:region/brokers",
        destination: "/:region/brokers/all",
        permanent: true,
      },
      // NOTE: /markets is the hub page — no redirect needed.
      // /markets/pulse is accessible via the hub navigation.

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


      // Regional Learn to Trade / Cities
      {
        source: "/us/learn-to-trade",
        destination: "/learn-to-trade",
        permanent: true,
      },
      {
        source: "/au/learn-to-trade",
        destination: "/learn-to-trade",
        permanent: true,
      },
      {
        source: "/us/learn-to-trade/:topic/:city",
        destination: "/learn-to-trade/:topic",
        permanent: true,
      },
      {
        source: "/au/learn-to-trade/:topic/:city",
        destination: "/learn-to-trade/:topic",
        permanent: true,
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



      // Legacy learn paths
      {
        source: "/learn/:slug*",
        destination: "/learn-to-trade",
        permanent: true,
      },

      // SEO Audit Phase 1 — Group A (UK City Pages to Parent Topic)
      {
        source: "/learn-to-trade/:topic/hull",
        destination: "/learn-to-trade/:topic",
        permanent: true,
      },
      {
        source: "/learn-to-trade/:topic/preston",
        destination: "/learn-to-trade/:topic",
        permanent: true,
      },
      {
        source: "/learn-to-trade/:topic/exeter",
        destination: "/learn-to-trade/:topic",
        permanent: true,
      },

      // SEO Audit Phase 1 — Group B (Retired Markets Instrument Pages → correct category/slug URLs)
      {
        source: "/markets/usdjpy",
        destination: "/markets/forex/usdjpy",
        permanent: true,
      },
      {
        source: "/markets/gbpnzd",
        destination: "/markets/forex",
        permanent: true,
      },
      {
        source: "/markets/platinum",
        destination: "/markets/commodities",
        permanent: true,
      },
      {
        source: "/markets/eurjpy",
        destination: "/markets/forex",
        permanent: true,
      },
      {
        source: "/markets/astrazeneca-azn",
        destination: "/markets/indices",
        permanent: true,
      },
      {
        source: "/markets/xrp",
        destination: "/markets/crypto/xrp",
        permanent: true,
      },
      {
        source: "/markets/gold-xauusd",
        destination: "/markets/commodities/gold",
        permanent: true,
      },
      {
        source: "/markets/chainlink",
        destination: "/markets/crypto",
        permanent: true,
      },
      {
        source: "/markets/audusd",
        destination: "/markets/forex/audusd",
        permanent: true,
      },
      {
        source: "/markets/nvidia-nvda",
        destination: "/markets/indices",
        permanent: true,
      },

      // SEO Audit Phase 1 — Group C (Redirect /best/ Day Trading UK)
      {
        source: "/best/broker-for-day-trading-uk",
        destination: "/brokers",
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
