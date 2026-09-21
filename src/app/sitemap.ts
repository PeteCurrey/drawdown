import type { MetadataRoute } from 'next';
import { getAllPosts } from '../lib/blog.ts';

const BASE_URL = 'https://drawdown.trading';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function url(
  path: string,
  opts: {
    changeFrequency?: MetadataRoute.Sitemap[number]['changeFrequency'];
    priority?: number;
    lastModified?: Date | string;
  } = {},
): MetadataRoute.Sitemap[number] {
  return {
    url: `${BASE_URL}${path}`,
    lastModified: opts.lastModified ?? new Date(),
    changeFrequency: opts.changeFrequency ?? 'monthly',
    priority: opts.priority ?? 0.5,
  };
}

// ─── Sitemap ─────────────────────────────────────────────────────────────────

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Fetch dynamic published blog posts from database
  let dynamicBlogUrls: MetadataRoute.Sitemap = [];
  try {
    const posts = await getAllPosts();
    dynamicBlogUrls = posts.map(post => url(`/blog/${post.slug}`, {
      changeFrequency: 'monthly',
      priority: 0.7,
      lastModified: post.dateModified || post.publishedAt || now,
    }));
  } catch (err) {
    console.error('Error fetching dynamic blog posts for sitemap:', err);
  }

  const baseRoutes: MetadataRoute.Sitemap = [
    // ── Core marketing pages ──────────────────────────────────────────────
    url('/', { changeFrequency: 'weekly', priority: 1.0, lastModified: now }),
    url('/pricing', { changeFrequency: 'weekly', priority: 0.95, lastModified: now }),
    url('/platform', { changeFrequency: 'monthly', priority: 0.9, lastModified: now }),
    url('/signal-centre', { changeFrequency: 'daily', priority: 0.9, lastModified: now }),
    url('/about', { changeFrequency: 'monthly', priority: 0.8, lastModified: now }),
    url('/how-it-works', { changeFrequency: 'monthly', priority: 0.8, lastModified: now }),
    url('/funded-pathway', { changeFrequency: 'monthly', priority: 0.8, lastModified: now }),
    url('/roadmap', { changeFrequency: 'monthly', priority: 0.7, lastModified: now }),
    url('/contact', { changeFrequency: 'yearly', priority: 0.6, lastModified: now }),

    // ── Tools ─────────────────────────────────────────────────────────────
    url('/tools', { changeFrequency: 'monthly', priority: 0.85, lastModified: now }),
    url('/tools/tradingview', { changeFrequency: 'monthly', priority: 0.75, lastModified: now }),
    url('/tools/investment-centre', { changeFrequency: 'monthly', priority: 0.7, lastModified: now }),

    // ── Calculators ───────────────────────────────────────────────────────
    url('/calculators', { changeFrequency: 'monthly', priority: 0.8, lastModified: now }),
    url('/calculators/position-size', { changeFrequency: 'monthly', priority: 0.75, lastModified: now }),
    url('/calculators/risk', { changeFrequency: 'monthly', priority: 0.75, lastModified: now }),
    url('/calculators/drawdown', { changeFrequency: 'monthly', priority: 0.75, lastModified: now }),
    url('/calculators/drawdown-recovery', { changeFrequency: 'monthly', priority: 0.7, lastModified: now }),
    url('/calculators/pip-value', { changeFrequency: 'monthly', priority: 0.7, lastModified: now }),
    url('/calculators/compounding', { changeFrequency: 'monthly', priority: 0.7, lastModified: now }),
    url('/calculators/risk-of-ruin', { changeFrequency: 'monthly', priority: 0.7, lastModified: now }),
    url('/calculators/prop-firm-daily-loss', { changeFrequency: 'monthly', priority: 0.7, lastModified: now }),
    url('/calculators/prop-firm-maximum-loss', { changeFrequency: 'monthly', priority: 0.7, lastModified: now }),

    // ── Courses ───────────────────────────────────────────────────────────
    url('/courses', { changeFrequency: 'monthly', priority: 0.85, lastModified: now }),
    url('/courses/ground-zero', { changeFrequency: 'monthly', priority: 0.8, lastModified: now }),
    url('/courses/chart-reader', { changeFrequency: 'monthly', priority: 0.8, lastModified: now }),
    url('/courses/strategist', { changeFrequency: 'monthly', priority: 0.8, lastModified: now }),
    url('/courses/risk-manager', { changeFrequency: 'monthly', priority: 0.8, lastModified: now }),
    url('/courses/mind-over-market', { changeFrequency: 'monthly', priority: 0.8, lastModified: now }),
    url('/courses/the-edge', { changeFrequency: 'monthly', priority: 0.8, lastModified: now }),
    url('/courses/fundamental-edge', { changeFrequency: 'monthly', priority: 0.8, lastModified: now }),
    url('/courses/derivatives-options', { changeFrequency: 'monthly', priority: 0.8, lastModified: now }),
    url('/courses/phase-1-2', { changeFrequency: 'monthly', priority: 0.7, lastModified: now }),
    url('/courses/phase-3-4', { changeFrequency: 'monthly', priority: 0.7, lastModified: now }),
    url('/courses/phase-5-6', { changeFrequency: 'monthly', priority: 0.7, lastModified: now }),
    url('/courses/prop-firm-survival-kit', { changeFrequency: 'monthly', priority: 0.75, lastModified: now }),

    // ── Brokers ───────────────────────────────────────────────────────────
    url('/brokers', { changeFrequency: 'monthly', priority: 0.75, lastModified: now }),
    url('/brokers/all', { changeFrequency: 'monthly', priority: 0.65, lastModified: now }),
    url('/brokers/best-for-gold', { changeFrequency: 'monthly', priority: 0.65, lastModified: now }),

    // ── Prop firms ────────────────────────────────────────────────────────
    url('/prop-firms', { changeFrequency: 'monthly', priority: 0.75, lastModified: now }),
    url('/prop-firms/compare', { changeFrequency: 'monthly', priority: 0.65, lastModified: now }),

    // ── Markets ───────────────────────────────────────────────────────────
    url('/markets', { changeFrequency: 'weekly', priority: 0.7, lastModified: now }),

    // ── The Lobby ─────────────────────────────────────────────────────────
    url('/lobby', { changeFrequency: 'daily', priority: 0.9, lastModified: now }),
    url('/lobby/archive', { changeFrequency: 'daily', priority: 0.75, lastModified: now }),
    url('/wire', { changeFrequency: 'daily', priority: 0.85, lastModified: now }),
    url('/lobby/markets', { changeFrequency: 'daily', priority: 0.8, lastModified: now }),
    url('/lobby/brokers', { changeFrequency: 'daily', priority: 0.8, lastModified: now }),
    url('/lobby/prop-firms', { changeFrequency: 'daily', priority: 0.8, lastModified: now }),
    url('/lobby/platforms', { changeFrequency: 'daily', priority: 0.8, lastModified: now }),
    url('/lobby/macro', { changeFrequency: 'daily', priority: 0.8, lastModified: now }),
    url('/lobby/regulation', { changeFrequency: 'daily', priority: 0.8, lastModified: now }),
    url('/lobby/trading-technology', { changeFrequency: 'daily', priority: 0.8, lastModified: now }),
    url('/lobby/trades', { changeFrequency: 'daily', priority: 0.8, lastModified: now }),
    url('/lobby/drawdown', { changeFrequency: 'daily', priority: 0.8, lastModified: now }),
    url('/lobby/education', { changeFrequency: 'daily', priority: 0.8, lastModified: now }),
    url('/lobby/industry', { changeFrequency: 'daily', priority: 0.8, lastModified: now }),
    url('/lobby/other', { changeFrequency: 'daily', priority: 0.7, lastModified: now }),

    // ── Blog ─────────────────────────────────────────────────────────────
    url('/blog', { changeFrequency: 'weekly', priority: 0.75, lastModified: now }),
    url('/blog/coffeezilla-alexg-trading-education', { changeFrequency: 'monthly', priority: 0.65, lastModified: now }),
    url('/blog/trading-education-business-model', { changeFrequency: 'monthly', priority: 0.65, lastModified: now }),
    url('/blog/why-trading-gurus-use-demo-accounts', { changeFrequency: 'monthly', priority: 0.65, lastModified: now }),

    // ── Glossary ──────────────────────────────────────────────────────────
    url('/glossary', { changeFrequency: 'monthly', priority: 0.65, lastModified: now }),

    // ── How-to guides ─────────────────────────────────────────────────────
    url('/how-to', { changeFrequency: 'monthly', priority: 0.65, lastModified: now }),

    // ── Compare ───────────────────────────────────────────────────────────
    url('/compare', { changeFrequency: 'monthly', priority: 0.65, lastModified: now }),

    // ── Research ──────────────────────────────────────────────────────────
    url('/research', { changeFrequency: 'monthly', priority: 0.65, lastModified: now }),
    url('/research/methodology', { changeFrequency: 'monthly', priority: 0.6, lastModified: now }),
    url('/research/broker-testing', { changeFrequency: 'monthly', priority: 0.6, lastModified: now }),
    url('/research/datasets', { changeFrequency: 'monthly', priority: 0.6, lastModified: now }),
    url('/research/prop-firms', { changeFrequency: 'monthly', priority: 0.6, lastModified: now }),
    url('/research/risk', { changeFrequency: 'monthly', priority: 0.6, lastModified: now }),
    url('/research/trading-costs', { changeFrequency: 'monthly', priority: 0.6, lastModified: now }),
    url('/research/corrections', { changeFrequency: 'monthly', priority: 0.5, lastModified: now }),

    // ── Community & best-of ───────────────────────────────────────────────
    url('/community', { changeFrequency: 'monthly', priority: 0.7, lastModified: now }),
    url('/best', { changeFrequency: 'monthly', priority: 0.65, lastModified: now }),
    url('/best/prop-firm-uk', { changeFrequency: 'monthly', priority: 0.65, lastModified: now }),
    url('/best/tradingview-review-uk', { changeFrequency: 'monthly', priority: 0.65, lastModified: now }),

    // ── Guides ────────────────────────────────────────────────────────────
    url('/guides/tradingview', { changeFrequency: 'monthly', priority: 0.6, lastModified: now }),

    // ── Methodology ───────────────────────────────────────────────────────
    url('/methodology', { changeFrequency: 'monthly', priority: 0.6, lastModified: now }),
    url('/editorial-standards', { changeFrequency: 'yearly', priority: 0.5, lastModified: now }),
    url('/editorial-policy', { changeFrequency: 'yearly', priority: 0.5, lastModified: now }),

    // ── Legal / policy ────────────────────────────────────────────────────
    url('/terms', { changeFrequency: 'yearly', priority: 0.3, lastModified: now }),
    url('/privacy', { changeFrequency: 'yearly', priority: 0.3, lastModified: now }),
    url('/disclaimer', { changeFrequency: 'yearly', priority: 0.3, lastModified: now }),
    url('/cookies', { changeFrequency: 'yearly', priority: 0.3, lastModified: now }),
    url('/legal/financial-disclaimer', { changeFrequency: 'yearly', priority: 0.3, lastModified: now }),
    url('/legal/subscription-and-refunds', { changeFrequency: 'yearly', priority: 0.3, lastModified: now }),
    url('/community-guidelines', { changeFrequency: 'yearly', priority: 0.3, lastModified: now }),
  ];

  const seenUrls = new Set<string>();
  const combined: MetadataRoute.Sitemap = [];
  for (const item of [...baseRoutes, ...dynamicBlogUrls]) {
    if (!seenUrls.has(item.url)) {
      seenUrls.add(item.url);
      combined.push(item);
    }
  }

  return combined;
}
