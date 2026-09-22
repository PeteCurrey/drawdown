import type { MetadataRoute } from 'next';
import { getAllPosts } from '../lib/blog.ts';
import { phases } from '../data/courses.ts';
import { tools } from '../data/tools.ts';
import { brokers } from '../data/brokers.ts';
import { PROP_FIRM_REVIEWS } from '../data/seo/prop-firms.ts';
import { createInternalSupabase } from '../lib/supabase/server.ts';
import { categoryToSlug } from '../lib/lobby-constants.ts';
import type { LobbyCategory } from '../types/lobby.ts';

const BASE_URL = 'https://drawdown.trading';
const SITE_BASELINE_DATE = '2026-04-20T00:00:00Z';

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
    lastModified: opts.lastModified ?? SITE_BASELINE_DATE,
    changeFrequency: opts.changeFrequency ?? 'monthly',
    priority: opts.priority ?? 0.5,
  };
}

// ─── Sitemap ─────────────────────────────────────────────────────────────────

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Dynamic published blog posts
  let dynamicBlogUrls: MetadataRoute.Sitemap = [];
  try {
    const posts = await getAllPosts();
    dynamicBlogUrls = posts.map((post) =>
      url(`/blog/${post.slug}`, {
        changeFrequency: 'monthly',
        priority: 0.7,
        lastModified: post.dateModified || post.publishedAt || SITE_BASELINE_DATE,
      })
    );
  } catch (err) {
    console.error('Error fetching dynamic blog posts for sitemap:', err);
  }

  // 2. Dynamic published Lobby articles
  let dynamicLobbyUrls: MetadataRoute.Sitemap = [];
  try {
    const supabase = createInternalSupabase();
    const { data: articles } = await supabase
      .from('lobby_articles')
      .select('slug, category, updated_at, published_at')
      .eq('status', 'PUBLISHED');

    if (articles && articles.length > 0) {
      dynamicLobbyUrls = articles.map((article) =>
        url(`/lobby/${categoryToSlug(article.category as LobbyCategory)}/${article.slug}`, {
          changeFrequency: 'weekly',
          priority: 0.7,
          lastModified: article.updated_at || article.published_at || SITE_BASELINE_DATE,
        })
      );
    }
  } catch (err) {
    console.error('Error fetching dynamic lobby articles for sitemap:', err);
  }

  // 3. Dynamic course routes
  const courseUrls: MetadataRoute.Sitemap = phases.map((phase) =>
    url(`/courses/${phase.slug}`, {
      changeFrequency: 'monthly',
      priority: 0.8,
      lastModified: '2026-04-01T00:00:00Z',
    })
  );

  // 4. Dynamic tools routes
  const toolUrls: MetadataRoute.Sitemap = tools.map((tool) =>
    url(`/tools/${tool.slug}`, {
      changeFrequency: 'monthly',
      priority: 0.8,
      lastModified: SITE_BASELINE_DATE,
    })
  );

  // 5. Dynamic prop firm reviews
  const propFirmUrls: MetadataRoute.Sitemap = PROP_FIRM_REVIEWS.map((review) =>
    url(`/prop-firms/${review.slug}`, {
      changeFrequency: 'weekly',
      priority: 0.75,
      lastModified: review.lastUpdated ? `${review.lastUpdated}T00:00:00Z` : SITE_BASELINE_DATE,
    })
  );

  // 6. Dynamic broker reviews (canonical paths)
  const brokerUrls: MetadataRoute.Sitemap = brokers.map((broker) =>
    url(`/brokers/${broker.slug || broker.id}`, {
      changeFrequency: 'monthly',
      priority: 0.7,
      lastModified: '2026-04-01T00:00:00Z',
    })
  );

  // 7. Base and Hub routes (strictly indexable, no redirects, no noindex)
  const baseRoutes: MetadataRoute.Sitemap = [
    // ── Core marketing pages ──────────────────────────────────────────────
    url('/', { changeFrequency: 'weekly', priority: 1.0, lastModified: SITE_BASELINE_DATE }),
    url('/pricing', { changeFrequency: 'weekly', priority: 0.95, lastModified: SITE_BASELINE_DATE }),
    url('/platform', { changeFrequency: 'monthly', priority: 0.9, lastModified: SITE_BASELINE_DATE }),
    url('/signal-centre', { changeFrequency: 'daily', priority: 0.9, lastModified: SITE_BASELINE_DATE }),
    url('/about', { changeFrequency: 'monthly', priority: 0.8, lastModified: SITE_BASELINE_DATE }),
    url('/how-it-works', { changeFrequency: 'monthly', priority: 0.8, lastModified: SITE_BASELINE_DATE }),
    url('/funded-pathway', { changeFrequency: 'monthly', priority: 0.8, lastModified: SITE_BASELINE_DATE }),
    url('/roadmap', { changeFrequency: 'monthly', priority: 0.7, lastModified: SITE_BASELINE_DATE }),
    url('/contact', { changeFrequency: 'yearly', priority: 0.6, lastModified: SITE_BASELINE_DATE }),
    url('/press', { changeFrequency: 'monthly', priority: 0.7, lastModified: SITE_BASELINE_DATE }),
    url('/for/prop-firm-traders', { changeFrequency: 'monthly', priority: 0.8, lastModified: SITE_BASELINE_DATE }),
    url('/for/day-traders', { changeFrequency: 'monthly', priority: 0.8, lastModified: SITE_BASELINE_DATE }),

    // ── Tools Hub ─────────────────────────────────────────────────────────
    url('/tools', { changeFrequency: 'monthly', priority: 0.85, lastModified: SITE_BASELINE_DATE }),
    url('/tools/tradingview', { changeFrequency: 'monthly', priority: 0.75, lastModified: SITE_BASELINE_DATE }),
    url('/tools/investment-centre', { changeFrequency: 'monthly', priority: 0.7, lastModified: SITE_BASELINE_DATE }),

    // ── Risk Management Authority Hub ─────────────────────────────────────
    url('/risk-management', { changeFrequency: 'monthly', priority: 0.85, lastModified: SITE_BASELINE_DATE }),

    // ── Calculators (All 9 + Hub) ──────────────────────────────────────────
    url('/calculators', { changeFrequency: 'monthly', priority: 0.85, lastModified: SITE_BASELINE_DATE }),
    url('/calculators/position-size', { changeFrequency: 'monthly', priority: 0.8, lastModified: SITE_BASELINE_DATE }),
    url('/calculators/risk', { changeFrequency: 'monthly', priority: 0.8, lastModified: SITE_BASELINE_DATE }),
    url('/calculators/drawdown', { changeFrequency: 'monthly', priority: 0.8, lastModified: SITE_BASELINE_DATE }),
    url('/calculators/drawdown-recovery', { changeFrequency: 'monthly', priority: 0.8, lastModified: SITE_BASELINE_DATE }),
    url('/calculators/pip-value', { changeFrequency: 'monthly', priority: 0.75, lastModified: SITE_BASELINE_DATE }),
    url('/calculators/compounding', { changeFrequency: 'monthly', priority: 0.75, lastModified: SITE_BASELINE_DATE }),
    url('/calculators/risk-of-ruin', { changeFrequency: 'monthly', priority: 0.75, lastModified: SITE_BASELINE_DATE }),
    url('/calculators/prop-firm-daily-loss', { changeFrequency: 'monthly', priority: 0.75, lastModified: SITE_BASELINE_DATE }),
    url('/calculators/prop-firm-maximum-loss', { changeFrequency: 'monthly', priority: 0.75, lastModified: SITE_BASELINE_DATE }),

    // ── Courses Hub ───────────────────────────────────────────────────────
    url('/courses', { changeFrequency: 'monthly', priority: 0.85, lastModified: SITE_BASELINE_DATE }),

    // ── Brokers Hub (Note: /brokers 301s to /brokers/all, so only /brokers/all is in sitemap) ──
    url('/brokers/all', { changeFrequency: 'monthly', priority: 0.75, lastModified: SITE_BASELINE_DATE }),
    url('/brokers/how-to-choose', { changeFrequency: 'monthly', priority: 0.8, lastModified: SITE_BASELINE_DATE }),

    // ── Prop Firms Hub & Compare ──────────────────────────────────────────
    url('/prop-firms', { changeFrequency: 'monthly', priority: 0.8, lastModified: SITE_BASELINE_DATE }),
    url('/prop-firms/compare', { changeFrequency: 'monthly', priority: 0.7, lastModified: SITE_BASELINE_DATE }),
    url('/prop-firms/how-to-pass', { changeFrequency: 'monthly', priority: 0.8, lastModified: SITE_BASELINE_DATE }),

    // ── Markets ───────────────────────────────────────────────────────────
    url('/markets', { changeFrequency: 'weekly', priority: 0.75, lastModified: SITE_BASELINE_DATE }),

    // ── The Lobby & The Wire ──────────────────────────────────────────────
    url('/lobby', { changeFrequency: 'daily', priority: 0.9, lastModified: SITE_BASELINE_DATE }),
    url('/lobby/archive', { changeFrequency: 'daily', priority: 0.75, lastModified: SITE_BASELINE_DATE }),
    url('/wire', { changeFrequency: 'daily', priority: 0.85, lastModified: SITE_BASELINE_DATE }),
    url('/lobby/markets', { changeFrequency: 'daily', priority: 0.8, lastModified: SITE_BASELINE_DATE }),
    url('/lobby/brokers', { changeFrequency: 'daily', priority: 0.8, lastModified: SITE_BASELINE_DATE }),
    url('/lobby/prop-firms', { changeFrequency: 'daily', priority: 0.8, lastModified: SITE_BASELINE_DATE }),
    url('/lobby/platforms', { changeFrequency: 'daily', priority: 0.8, lastModified: SITE_BASELINE_DATE }),
    url('/lobby/macro', { changeFrequency: 'daily', priority: 0.8, lastModified: SITE_BASELINE_DATE }),
    url('/lobby/regulation', { changeFrequency: 'daily', priority: 0.8, lastModified: SITE_BASELINE_DATE }),
    url('/lobby/trading-technology', { changeFrequency: 'daily', priority: 0.8, lastModified: SITE_BASELINE_DATE }),
    url('/lobby/trades', { changeFrequency: 'daily', priority: 0.8, lastModified: SITE_BASELINE_DATE }),
    url('/lobby/drawdown', { changeFrequency: 'daily', priority: 0.8, lastModified: SITE_BASELINE_DATE }),
    url('/lobby/education', { changeFrequency: 'daily', priority: 0.8, lastModified: SITE_BASELINE_DATE }),
    url('/lobby/industry', { changeFrequency: 'daily', priority: 0.8, lastModified: SITE_BASELINE_DATE }),
    url('/lobby/other', { changeFrequency: 'daily', priority: 0.7, lastModified: SITE_BASELINE_DATE }),

    // ── Blog Hub ──────────────────────────────────────────────────────────
    url('/blog', { changeFrequency: 'weekly', priority: 0.8, lastModified: SITE_BASELINE_DATE }),

    // ── Education & Glossary ──────────────────────────────────────────────
    url('/learn-to-trade', { changeFrequency: 'weekly', priority: 0.8, lastModified: SITE_BASELINE_DATE }),
    url('/glossary', { changeFrequency: 'monthly', priority: 0.7, lastModified: SITE_BASELINE_DATE }),
    url('/how-to', { changeFrequency: 'monthly', priority: 0.7, lastModified: SITE_BASELINE_DATE }),
    url('/compare', { changeFrequency: 'monthly', priority: 0.7, lastModified: SITE_BASELINE_DATE }),

    // ── Research Centre & Studies ─────────────────────────────────────────
    url('/research', { changeFrequency: 'monthly', priority: 0.8, lastModified: SITE_BASELINE_DATE }),
    url('/research/methodology', { changeFrequency: 'monthly', priority: 0.65, lastModified: SITE_BASELINE_DATE }),
    url('/research/broker-testing', { changeFrequency: 'monthly', priority: 0.65, lastModified: SITE_BASELINE_DATE }),
    url('/research/datasets', { changeFrequency: 'monthly', priority: 0.65, lastModified: SITE_BASELINE_DATE }),
    url('/research/prop-firms', { changeFrequency: 'monthly', priority: 0.65, lastModified: SITE_BASELINE_DATE }),
    url('/research/risk', { changeFrequency: 'monthly', priority: 0.65, lastModified: SITE_BASELINE_DATE }),
    url('/research/trading-costs', { changeFrequency: 'monthly', priority: 0.65, lastModified: SITE_BASELINE_DATE }),
    url('/research/position-sizing', { changeFrequency: 'monthly', priority: 0.7, lastModified: SITE_BASELINE_DATE }),
    url('/research/corrections', { changeFrequency: 'monthly', priority: 0.5, lastModified: SITE_BASELINE_DATE }),

    // ── Community & Best-Of ───────────────────────────────────────────────
    url('/community', { changeFrequency: 'monthly', priority: 0.7, lastModified: SITE_BASELINE_DATE }),
    url('/best', { changeFrequency: 'monthly', priority: 0.65, lastModified: SITE_BASELINE_DATE }),
    url('/best/prop-firm-uk', { changeFrequency: 'monthly', priority: 0.65, lastModified: SITE_BASELINE_DATE }),
    url('/best/tradingview-review-uk', { changeFrequency: 'monthly', priority: 0.65, lastModified: SITE_BASELINE_DATE }),
    url('/guides/tradingview', { changeFrequency: 'monthly', priority: 0.6, lastModified: SITE_BASELINE_DATE }),

    // ── Editorial & Standards ─────────────────────────────────────────────
    url('/editorial-standards', { changeFrequency: 'yearly', priority: 0.5, lastModified: SITE_BASELINE_DATE }),
    url('/editorial-policy', { changeFrequency: 'yearly', priority: 0.5, lastModified: SITE_BASELINE_DATE }),

    // ── Valid Regional Hubs ───────────────────────────────────────────────
    url('/au', { changeFrequency: 'weekly', priority: 0.8, lastModified: SITE_BASELINE_DATE }),
    url('/au/pricing', { changeFrequency: 'weekly', priority: 0.75, lastModified: SITE_BASELINE_DATE }),
    url('/us', { changeFrequency: 'weekly', priority: 0.8, lastModified: SITE_BASELINE_DATE }),
    url('/us/pricing', { changeFrequency: 'weekly', priority: 0.75, lastModified: SITE_BASELINE_DATE }),
    url('/sg', { changeFrequency: 'weekly', priority: 0.8, lastModified: SITE_BASELINE_DATE }),
    url('/sg/pricing', { changeFrequency: 'weekly', priority: 0.75, lastModified: SITE_BASELINE_DATE }),
    url('/hk', { changeFrequency: 'weekly', priority: 0.8, lastModified: SITE_BASELINE_DATE }),
    url('/hk/pricing', { changeFrequency: 'weekly', priority: 0.75, lastModified: SITE_BASELINE_DATE }),

    // ── Legal / Policy ────────────────────────────────────────────────────
    url('/terms', { changeFrequency: 'yearly', priority: 0.3, lastModified: SITE_BASELINE_DATE }),
    url('/privacy', { changeFrequency: 'yearly', priority: 0.3, lastModified: SITE_BASELINE_DATE }),
    url('/disclaimer', { changeFrequency: 'yearly', priority: 0.3, lastModified: SITE_BASELINE_DATE }),
    url('/cookies', { changeFrequency: 'yearly', priority: 0.3, lastModified: SITE_BASELINE_DATE }),
    url('/legal/financial-disclaimer', { changeFrequency: 'yearly', priority: 0.3, lastModified: SITE_BASELINE_DATE }),
    url('/legal/subscription-and-refunds', { changeFrequency: 'yearly', priority: 0.3, lastModified: SITE_BASELINE_DATE }),
    url('/community-guidelines', { changeFrequency: 'yearly', priority: 0.3, lastModified: SITE_BASELINE_DATE }),
  ];

  // Deduplicate and combine
  const seenUrls = new Set<string>();
  const combined: MetadataRoute.Sitemap = [];
  const allRoutes = [
    ...baseRoutes,
    ...courseUrls,
    ...toolUrls,
    ...propFirmUrls,
    ...brokerUrls,
    ...dynamicLobbyUrls,
    ...dynamicBlogUrls,
  ];

  for (const item of allRoutes) {
    if (!seenUrls.has(item.url)) {
      seenUrls.add(item.url);
      combined.push(item);
    }
  }

  return combined;
}
