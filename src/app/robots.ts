import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/dashboard',
          '/profile/',
          '/profile',
          '/admin/',
          '/admin',
          '/partner/',
          '/partner',
          '/api/',
          '/api',
          // Checkout and payment flows — never indexed
          '/checkout/',
          '/checkout',
          // Internal utility routes
          '/unsubscribe',
          '/newsletter/',
          '/newsletter',
          // Auth flows — not for indexing
          '/login',
          '/signup',
          '/forgot-password',
          // Store success/thank-you pages — no index value
          '/store/the-edge/success',
          '/store/prop-survival-kit/success',
          '/store/how-to-trade/success',
          '/store/manual-bundle/success',
          '/courses/deploy-your-algo/success',
        ],
      },
    ],
    sitemap: 'https://drawdown.trading/sitemap.xml',
  };
}
