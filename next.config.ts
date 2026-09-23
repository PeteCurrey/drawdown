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
      // NOTE: www ↔ non-www redirect direction is controlled at the Vercel platform
      // level (Vercel dashboard → Domains). The application cannot safely add a
      // www→non-www redirect here because Vercel's platform-level redirect fires
      // first (before Next.js), creating an infinite loop. To make non-www the
      // canonical host: go to Vercel → Project → Settings → Domains and set
      // drawdown.trading as primary with www.drawdown.trading redirecting to it.
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

      // Entity category remediation (Pepperstone is an FCA/ASIC broker, not a prop firm)
      {
        source: "/prop-firms/pepperstone",
        destination: "/brokers/pepperstone",
        permanent: true,
      },

      // Hub Page Redirects
      {
        source: "/brokers",
        destination: "/brokers/all",
        permanent: true,
      },
      {
        source: "/:region(uk|us|au|sg|hk)/brokers",
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
        // Fixed redirect chain: was /brokers/quiz → /brokers → /brokers/all (2-hop chain)
        // Now points directly to the canonical destination
        source: "/brokers/quiz",
        destination: "/brokers/all",
        permanent: false,
      },
      {
        source: "/brokers/ig-index",
        destination: "/brokers/ig-markets-review",
        permanent: true,
      },
      {
        source: "/brokers/review-methodology",
        destination: "/methodology/broker-research",
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


      // SEO Audit Phase 1 — Group C: /best/ URL remediation
      // REMOVED: blanket /best/broker-for-day-trading-uk → /brokers (chained to /brokers/all)
      // Each /best/ URL now either:
      //   (a) Renders a real page from the seo_pages database
      //   (b) Returns 404 via notFound() in /best/[slug]/page.tsx
      //   (c) Gets a specific redirect below to the genuinely equivalent destination
      // A /best/* URL may only redirect to /brokers/all where the original search
      // intent was a BROAD broker-directory query. All other intents get topic-specific destinations.
      {
        // "best forex broker uk" → broker list filtered to forex
        source: "/best/forex-broker-uk",
        destination: "/brokers/all",
        permanent: false, // temporary until the /best/forex-broker-uk page is restored
      },
      // Note: /best/broker-for-day-trading-uk is intentionally NOT redirected to /brokers/all.
      // Its intent is day-trading-specific. Until a proper page exists, it returns 404.


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
      // Section 3.1 Static Redirects
      { source: "/trading-journal", destination: "/tools/ai-trade-journal", permanent: true },
      { source: "/position-size-calculator", destination: "/tools/risk-calculator", permanent: true },
      { source: "/economic-calendar", destination: "/tools/daily-briefing", permanent: true },
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/terms-of-service", destination: "/terms", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/faq", destination: "/help", permanent: true },
    ];
  },
  async headers() {
    return [
      // ── Embed routes: allow iframing by third-party publishers ──────────
      // Must come BEFORE the global rule — Next.js applies the first matching rule.
      {
        source: "/embed/:path*",
        headers: [
          // Omit X-Frame-Options entirely for embed routes (allows any origin to iframe)
          // Content-Security-Policy frame-ancestors is the modern replacement
          { key: "Content-Security-Policy", value: "frame-ancestors *" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
      // ── Global security headers for all non-embed routes ─────────────────
      {
        source: "/((?!embed).*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },
};

export default nextConfig;
