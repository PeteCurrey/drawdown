import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';

test('SEO Phase 2: All 9 calculator page.tsx files are Server Components without "use client"', () => {
  const calculatorSlugs = [
    'position-size',
    'risk',
    'drawdown',
    'drawdown-recovery',
    'pip-value',
    'compounding',
    'risk-of-ruin',
    'prop-firm-daily-loss',
    'prop-firm-maximum-loss',
  ];

  for (const slug of calculatorSlugs) {
    const pagePath = path.join(process.cwd(), `src/app/(marketing)/calculators/${slug}/page.tsx`);
    assert.ok(fs.existsSync(pagePath), `Calculator page must exist: ${slug}`);

    const content = fs.readFileSync(pagePath, 'utf8');
    // Ensure "use client" is NOT at the top of the file
    const firstLine = content.trim().split('\n')[0].replace(/['"]/g, '').trim();
    assert.notEqual(firstLine, 'use client;', `Calculator ${slug}/page.tsx must be a Server Component, not use client`);

    // Ensure it exports metadata
    assert.ok(content.includes('export const metadata'), `Calculator ${slug}/page.tsx must export metadata`);
    assert.ok(content.includes(`path: "/calculators/${slug}"`) || content.includes(`path: '/calculators/${slug}'`), `Calculator ${slug}/page.tsx must have explicit canonical path`);

    // Ensure it has JsonLd schema
    assert.ok(content.includes('JsonLd') || content.includes('WebApplication'), `Calculator ${slug}/page.tsx must embed structured data`);

    // Ensure it has contextual internal links
    assert.ok(content.includes('href="/calculators/') || content.includes("href='/calculators/"), `Calculator ${slug}/page.tsx must link to related calculators`);
  }
});

test('SEO Phase 2: Homepage metadata is concise and communicates brand proposition', () => {
  const homePath = path.join(process.cwd(), 'src/app/(marketing)/page.tsx');
  const content = fs.readFileSync(homePath, 'utf8');

  assert.ok(content.includes('title: "Drawdown — Trading Risk & Operating System"'), 'Homepage title must be concise Drawdown — Trading Risk & Operating System');
  assert.ok(content.includes('canonical: "https://drawdown.trading"'), 'Homepage canonical must be https://drawdown.trading');
});

test('SEO Phase 2: Tools [slug] is a Server Component with generateMetadata and generateStaticParams', () => {
  const toolSlugPath = path.join(process.cwd(), 'src/app/(marketing)/tools/[slug]/page.tsx');
  const content = fs.readFileSync(toolSlugPath, 'utf8');

  assert.ok(!content.includes('"use client"'), 'tools/[slug]/page.tsx must be a Server Component');
  assert.ok(content.includes('generateMetadata'), 'tools/[slug]/page.tsx must implement generateMetadata');
  assert.ok(content.includes('generateStaticParams'), 'tools/[slug]/page.tsx must implement generateStaticParams');
  assert.ok(content.includes('SoftwareApplication'), 'tools/[slug]/page.tsx must include SoftwareApplication schema');
});

test('SEO Phase 2: Prop Firm and Broker review pages have deterministic canonicals in metadata', () => {
  const propFirmSlugPath = path.join(process.cwd(), 'src/app/(marketing)/prop-firms/[slug]/page.tsx');
  const propContent = fs.readFileSync(propFirmSlugPath, 'utf8');
  assert.ok(propContent.includes('path: `/prop-firms/${slug}`'), 'prop-firms/[slug] must specify canonical path in getMetadata');

  const brokerSlugPath = path.join(process.cwd(), 'src/app/(marketing)/brokers/[broker]/page.tsx');
  const brokerContent = fs.readFileSync(brokerSlugPath, 'utf8');
  assert.ok(brokerContent.includes('path: `/brokers/${canonicalSlug}`'), 'brokers/[broker] must specify canonical path in getMetadata');
  assert.ok(brokerContent.includes('generateStaticParams()'), 'brokers/[broker] must have generateStaticParams');
});

test('SEO Phase 2: sitemap includes all 9 calculators, courses, tools, prop-firms and excludes redirects/noindex', async () => {
  const sitemapPath = path.join(process.cwd(), 'src/app/sitemap.ts');
  const { default: sitemap } = await import(sitemapPath);
  const items = await sitemap();

  const urls = items.map((i: any) => i.url);

  // All 9 calculators
  const expectedCalculators = [
    'https://drawdown.trading/calculators',
    'https://drawdown.trading/calculators/position-size',
    'https://drawdown.trading/calculators/risk',
    'https://drawdown.trading/calculators/drawdown',
    'https://drawdown.trading/calculators/drawdown-recovery',
    'https://drawdown.trading/calculators/pip-value',
    'https://drawdown.trading/calculators/compounding',
    'https://drawdown.trading/calculators/risk-of-ruin',
    'https://drawdown.trading/calculators/prop-firm-daily-loss',
    'https://drawdown.trading/calculators/prop-firm-maximum-loss',
  ];

  for (const calcUrl of expectedCalculators) {
    assert.ok(urls.includes(calcUrl), `Sitemap must include calculator: ${calcUrl}`);
  }

  // Check dynamic routes included
  assert.ok(urls.includes('https://drawdown.trading/courses/ground-zero'), 'Sitemap must include courses');
  assert.ok(urls.includes('https://drawdown.trading/tools/ai-trade-journal'), 'Sitemap must include tools');
  assert.ok(urls.includes('https://drawdown.trading/prop-firms/ftmo'), 'Sitemap must include FTMO review');
  assert.ok(urls.includes('https://drawdown.trading/brokers/all'), 'Sitemap must include brokers/all');

  // Check exclusions
  assert.ok(!urls.includes('https://drawdown.trading/brokers'), 'Sitemap must NOT include /brokers redirecting URL');
  assert.ok(!urls.includes('https://drawdown.trading/brokers/best-for-gold'), 'Sitemap must NOT include noindex route best-for-gold');
});

test('SEO Phase 2: hreflang in getMetadata strictly guards against 404 regional pages', async () => {
  const metadataPath = path.join(process.cwd(), 'src/lib/metadata.ts');
  const { getMetadata } = await import(metadataPath);

  // When called on homepage with regional variants: valid
  const homeMeta = getMetadata({ path: '/', hasRegionalVariants: true });
  assert.ok(homeMeta.alternates?.languages, 'Homepage must have regional languages');
  assert.equal(homeMeta.alternates?.languages?.['en-AU'], 'https://drawdown.trading/au');

  // When called on a course or calculator with regional variants: must NOT emit fake regional links
  const courseMeta = getMetadata({ path: '/courses/ground-zero', hasRegionalVariants: true });
  assert.equal(courseMeta.alternates?.languages, undefined, 'Course must NOT have regional languages because /au/courses/... does not exist');

  const calcMeta = getMetadata({ path: '/calculators/position-size', hasRegionalVariants: true });
  assert.equal(calcMeta.alternates?.languages, undefined, 'Calculator must NOT have regional languages because /au/calculators/... does not exist');
});
