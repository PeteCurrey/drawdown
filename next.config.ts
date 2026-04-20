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
    ];
  },
};

export default nextConfig;
