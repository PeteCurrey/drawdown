import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getAllPosts, getPostBySlug } from '../src/lib/blog.ts';
import sitemap from '../src/app/sitemap.ts';

const REQUIRED_SLUGS = [
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

const ADDITIONAL_SLUGS = [
  'the-myth-of-the-100-percent-win-rate',
  'worthless-trading-courses',
  'geometry-of-liquid-markets',
  'spread-betting-vs-cfds',
];

test('Blog Recovery: getAllPosts returns exactly 84 published posts in descending order', async () => {
  const posts = await getAllPosts();
  assert.equal(posts.length, 84, `Expected 84 published posts, got ${posts.length}`);

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
    assert.ok(current >= next, `Posts must be in descending order: ${posts[i].slug} (${current}) >= ${posts[i+1].slug} (${next})`);
  }
});

test('Blog Recovery: all 12 required URLs resolve with intact content and SEO metadata', async () => {
  for (const slug of REQUIRED_SLUGS) {
    const post = await getPostBySlug(slug);
    assert.ok(post, `Post for slug "${slug}" must exist and be returned`);
    assert.equal(post.slug, slug);
    assert.ok(post.title.length > 5, `Post "${slug}" must have a meaningful title: ${post.title}`);
    assert.ok(post.content.length > 200, `Post "${slug}" must have substantive body content (len=${post.content.length})`);

    // Verify no literal escaped \n strings at start of paragraphs
    assert.ok(!post.content.startsWith('\\n'), `Post "${slug}" content should not start with literal escaped \\n`);
    assert.ok(!post.content.includes('\\n\\n'), `Post "${slug}" content should not contain literal escaped \\n\\n`);

    // Verify SEO
    assert.ok(post.metaTitle, `Post "${slug}" must have metaTitle`);
    assert.ok(post.metaDescription, `Post "${slug}" must have metaDescription`);
    assert.ok(post.heroImage?.src, `Post "${slug}" must have heroImage.src`);
  }
});

test('Blog Recovery: additional verified articles resolve cleanly', async () => {
  for (const slug of ADDITIONAL_SLUGS) {
    const post = await getPostBySlug(slug);
    assert.ok(post, `Post "${slug}" must resolve`);
    assert.ok(post.content.length > 200, `Post "${slug}" content length: ${post.content.length}`);
    assert.ok(!post.content.startsWith('\\n'), `Post "${slug}" content should not start with literal escaped \\n`);
  }
});

test('Blog Recovery: unpublished or non-existent posts return null (protection)', async () => {
  const nonexistent = await getPostBySlug('definitely-non-existent-blog-slug-123456');
  assert.equal(nonexistent, null, 'Non-existent post must return null');
});

test('Blog Recovery: sitemap dynamically includes all 84 published blog posts', async () => {
  const items = await sitemap();
  assert.ok(Array.isArray(items), 'sitemap() must return an array');

  const blogUrls = items.filter(i => i.url.includes('/blog/'));
  assert.ok(blogUrls.length >= 84, `Expected at least 84 blog URLs in sitemap, got ${blogUrls.length}`);

  for (const slug of REQUIRED_SLUGS) {
    const expectedUrl = `https://drawdown.trading/blog/${slug}`;
    const found = items.some(i => i.url === expectedUrl);
    assert.ok(found, `Sitemap must contain ${expectedUrl}`);
  }
});
