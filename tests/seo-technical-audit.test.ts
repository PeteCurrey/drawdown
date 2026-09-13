import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';

test('SEO: sitemap.ts exports a valid sitemap function', async () => {
  const sitemapPath = path.join(process.cwd(), 'src/app/sitemap.ts');
  assert.ok(fs.existsSync(sitemapPath), 'src/app/sitemap.ts must exist');

  const content = fs.readFileSync(sitemapPath, 'utf8');
  assert.ok(!content.includes('2026-07-19'), 'Sitemap must not contain hardcoded 2026-07-19 date');
  assert.ok(content.includes('https://drawdown.trading'), 'Sitemap base URL must be drawdown.trading');

  // Verify function returns valid items
  // Dynamically import or evaluate
  const { default: sitemap } = await import(sitemapPath);
  const items = sitemap();
  assert.ok(Array.isArray(items), 'sitemap() must return an array');
  assert.ok(items.length >= 40, 'sitemap should contain at least 40 key curated routes');

  for (const item of items) {
    assert.ok(item.url.startsWith('https://drawdown.trading'), `Item URL must be absolute: ${item.url}`);
    if (item.priority !== undefined) {
      assert.ok(item.priority >= 0 && item.priority <= 1, `Priority must be between 0 and 1: ${item.priority}`);
    }
  }
});

test('SEO: robots.ts exports valid robots configuration', async () => {
  const robotsPath = path.join(process.cwd(), 'src/app/robots.ts');
  assert.ok(fs.existsSync(robotsPath), 'src/app/robots.ts must exist');

  const { default: robots } = await import(robotsPath);
  const config = robots();

  assert.equal(config.sitemap, 'https://drawdown.trading/sitemap.xml', 'Robots sitemap must point to canonical domain, not vercel.app');

  const rules = Array.isArray(config.rules) ? config.rules[0] : config.rules;
  assert.ok(rules, 'Robots must have rules defined');

  const disallowed = Array.isArray(rules.disallow) ? rules.disallow : [rules.disallow];
  assert.ok(disallowed.some((p: string) => p.includes('/dashboard')), 'Robots must disallow /dashboard');
  assert.ok(disallowed.some((p: string) => p.includes('/admin')), 'Robots must disallow /admin');
  assert.ok(disallowed.some((p: string) => p.includes('/api')), 'Robots must disallow /api');
});

test('SEO: public/robots.txt static file was removed in favor of app/robots.ts', () => {
  const staticRobots = path.join(process.cwd(), 'public/robots.txt');
  assert.ok(!fs.existsSync(staticRobots), 'public/robots.txt should not exist to avoid conflicting with app/robots.ts');
});

test('SEO: Key marketing pages export proper canonical URLs and metadata', () => {
  const filesToCheck = [
    'src/app/(marketing)/page.tsx',
    'src/app/(marketing)/pricing/page.tsx',
    'src/app/(marketing)/tools/page.tsx',
    'src/app/(marketing)/brokers/page.tsx',
    'src/app/(marketing)/signal-centre/page.tsx',
  ];

  for (const relPath of filesToCheck) {
    const fullPath = path.join(process.cwd(), relPath);
    assert.ok(fs.existsSync(fullPath), `${relPath} must exist`);
    const content = fs.readFileSync(fullPath, 'utf8');
    assert.ok(
      content.includes('metadata') || content.includes('generateMetadata'),
      `${relPath} must export metadata or generateMetadata`
    );
    assert.ok(
      content.includes('canonical') || content.includes('alternates'),
      `${relPath} must specify canonical alternate`
    );
  }
});

test('SEO: Thin pSEO city pages are marked noindex', () => {
  const pSeoPages = [
    'src/app/(marketing)/learn-to-trade/[topic]/[location]/page.tsx',
    'src/app/(marketing)/au/learn-to-trade/[topic]/[city]/page.tsx',
    'src/app/(marketing)/hk/learn-to-trade/[topic]/[city]/page.tsx',
    'src/app/(marketing)/sg/learn-to-trade/[topic]/[city]/page.tsx',
    'src/app/(marketing)/us/learn-to-trade/[topic]/[city]/page.tsx',
  ];

  for (const relPath of pSeoPages) {
    const fullPath = path.join(process.cwd(), relPath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      assert.ok(
        content.includes('index: false') || content.includes('noIndex: true'),
        `${relPath} must be set to noindex to prevent GSC crawl trap`
      );
    }
  }
});

test('SEO: No fabricated AggregateRating schema in marketing components', () => {
  const scanDir = path.join(process.cwd(), 'src/components');
  function checkDir(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        checkDir(fullPath);
      } else if (/\.(tsx|ts)$/.test(entry.name)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        assert.ok(
          !content.includes('@type": "AggregateRating"') && !content.includes("@type': 'AggregateRating'"),
          `Found fabricated AggregateRating in ${entry.name}`
        );
      }
    }
  }
  checkDir(scanDir);
});
