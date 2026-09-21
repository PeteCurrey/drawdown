import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getAllPosts, getPostBySlug } from '../src/lib/blog.ts';
import sitemap from '../src/app/sitemap.ts';

const HISTORICAL_REQUIRED_SLUGS = [
  'bitcoin-ftse-100-correlation',
  'economic-calendar-guide',
  'fca-regulation-explained',
  'fomo-trading-anatomy',
  'friday-trading-traps',
  'backtesting-101',
  'kelly-criterion-position-sizing-mastery',
  'prop-firm-honest-review',
  'ict-michael-huddleston-honest-review',
  'ai-confluence-scanner-guide',
  'isa-vs-spread-betting-account',
  'uk-trading-tax-guide',
];

const HISTORICAL_ADDITIONAL_SLUGS = [
  'the-myth-of-the-100-percent-win-rate',
  'worthless-trading-courses',
  'geometry-of-liquid-markets',
  'spread-betting-vs-cfds',
];

const NEW_2026_EDITORIAL_SLUGS = [
  'anatomy-august-carry-trade-unwind',
  'why-fixed-monetary-risk-fails-volatility-spikes',
  'bank-of-england-august-split-vote-cable',
  'trailing-drawdown-traps-modern-prop-evaluations',
  'jackson-hole-2026-neutral-rate-debate',
  'order-flow-realities-footprint-charts-fx',
  'psychology-of-summer-liquidity-lull',
  'spread-betting-arbitrage-hmrc-rules-scalping',
  'september-seasonality-equities-statistical-edge',
  'solvency-stress-test-auditing-prop-firm-capital',
  'ecb-monetary-easing-cycle-cross-currency-dynamics-eurgbp',
  'why-backtest-overfitting-kills-retail-algos',
  'fca-regulatory-update-finfluencers-cfd-warnings',
  'federal-reserve-september-rate-decision-playbook',
  'drawdown-survival-formula-asymmetric-payoffs',
  'institutional-market-surveillance-lobby-control-room',
];

test('Blog System: getAllPosts returns at least 100 published posts in strict descending order', async () => {
  const posts = await getAllPosts();
  assert.ok(posts.length >= 100, `Expected at least 100 published posts, got ${posts.length}`);

  for (const post of posts) {
    assert.ok(post.slug, 'Post must have a slug');
    assert.ok(post.title, `Post ${post.slug} must have a title`);
    assert.ok(post.category, `Post ${post.slug} must have a category`);
    assert.ok(post.publishedAt, `Post ${post.slug} must have publishedAt`);
    assert.ok(post.heroImage.src, `Post ${post.slug} must have hero image src`);
    assert.ok(post.author, `Post ${post.slug} must have an author`);
  }

  // Check ordering by date descending
  for (let i = 0; i < posts.length - 1; i++) {
    const current = new Date(posts[i].publishedAt).getTime();
    const next = new Date(posts[i + 1].publishedAt).getTime();
    assert.ok(
      current >= next,
      `Posts must be in descending order: ${posts[i].slug} (${current}) >= ${posts[i + 1].slug} (${next})`
    );
  }
});

test('Blog System: all 84 historical articles remain intact with content and SEO', async () => {
  for (const slug of [...HISTORICAL_REQUIRED_SLUGS, ...HISTORICAL_ADDITIONAL_SLUGS]) {
    const post = await getPostBySlug(slug);
    assert.ok(post, `Historical post "${slug}" must exist and be intact`);
    assert.equal(post.slug, slug);
    assert.ok(post.title.length > 5, `Post "${slug}" must have a meaningful title: ${post.title}`);
    assert.ok(post.content.length > 200, `Post "${slug}" must have substantive body content (len=${post.content.length})`);
    assert.ok(!post.content.startsWith('\\n'), `Post "${slug}" content should not start with literal escaped \\n`);
    assert.ok(!post.content.includes('\\n\\n'), `Post "${slug}" content should not contain literal escaped \\n\\n`);
    assert.ok(post.metaTitle, `Post "${slug}" must have metaTitle`);
    assert.ok(post.metaDescription, `Post "${slug}" must have metaDescription`);
    assert.ok(post.heroImage?.src, `Post "${slug}" must have heroImage.src`);
  }
});

test('Blog System: all 16 August & September 2026 articles resolve with full body, author, and SEO', async () => {
  for (const slug of NEW_2026_EDITORIAL_SLUGS) {
    const post = await getPostBySlug(slug);
    assert.ok(post, `New editorial post "${slug}" must exist`);
    assert.equal(post.slug, slug);
    assert.ok(post.title.length > 10, `Post "${slug}" title must be substantive: ${post.title}`);
    assert.ok(post.content.length > 1000, `Post "${slug}" must have comprehensive depth (len=${post.content.length})`);
    assert.equal(post.author, 'Pete Currey', `Post "${slug}" author must be Pete Currey`);
    assert.ok(post.metaTitle, `Post "${slug}" must have metaTitle`);
    assert.ok(post.metaDescription, `Post "${slug}" must have metaDescription`);
    assert.ok(post.heroImage?.src, `Post "${slug}" must have valid hero image`);

    // Verify dates are in August or September 2026
    const pubDate = new Date(post.publishedAt);
    assert.equal(pubDate.getFullYear(), 2026, `Post "${slug}" must be published in 2026`);
    const month = pubDate.getMonth() + 1;
    assert.ok(month === 8 || month === 9, `Post "${slug}" must be published in August or September 2026 (month=${month})`);
  }
});

test('Blog System: unpublished or non-existent posts return null (protection)', async () => {
  const nonexistent = await getPostBySlug('definitely-non-existent-blog-slug-123456');
  assert.equal(nonexistent, null, 'Non-existent post must return null');
});

test('Blog System: sitemap dynamically includes all 100+ published blog posts', async () => {
  const items = await sitemap();
  assert.ok(Array.isArray(items), 'sitemap() must return an array');

  const blogUrls = items.filter(i => i.url.includes('/blog/'));
  assert.ok(blogUrls.length >= 100, `Expected at least 100 blog URLs in sitemap, got ${blogUrls.length}`);

  for (const slug of [...HISTORICAL_REQUIRED_SLUGS, ...NEW_2026_EDITORIAL_SLUGS]) {
    const expectedUrl = `https://drawdown.trading/blog/${slug}`;
    const found = items.some(i => i.url === expectedUrl);
    assert.ok(found, `Sitemap must contain ${expectedUrl}`);
  }
});
