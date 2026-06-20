// @ts-check
/**
 * Seed script: reads all 43 MDX blog posts from src/content/blog/
 * and upserts them into Supabase blog_posts + blog_post_seo tables.
 * Also seeds 3 editorial posts stored directly in Supabase.
 *
 * Run with:
 *   node scripts/seed-blog-posts.mjs
 */

import { createRequire } from 'module';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

// ---------------------------------------------------------------------------
// Load environment variables from .env.local
// ---------------------------------------------------------------------------
const dotenv = await import('dotenv');
dotenv.config({ path: join(__dirname, '..', '.env.local') });

// ---------------------------------------------------------------------------
// Dynamic imports for packages that may need require
// ---------------------------------------------------------------------------
const matter = (await import('gray-matter')).default;
const { createClient } = await import('@supabase/supabase-js');

// ---------------------------------------------------------------------------
// Supabase client (service role — bypasses RLS)
// ---------------------------------------------------------------------------
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// ---------------------------------------------------------------------------
// Fallback hero images keyed by slug
// ---------------------------------------------------------------------------
const SLUG_IMAGES = {
  'institutional-vs-retail-psychology': 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=800',
  'why-free-signals-cost-money': 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=800',
  'worthless-trading-courses': 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=800',
  'gbpusd-trading-guide': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800',
  'understanding-market-liquidity': 'https://images.unsplash.com/photo-1498084393753-b411b2d26b34?q=80&w=800',
  'economic-calendar-guide': 'https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=800',
  'the-trading-routine': 'https://images.unsplash.com/photo-1488998460682-e47007415509?q=80&w=800',
  'uk-trading-tax-guide': 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?q=80&w=800',
  'ftse-100-playbook': 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800',
  'the-myth-of-the-100-percent-win-rate': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800',
  'high-cost-of-retail-alpha': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800',
  'cost-of-revenge-trading': 'https://images.unsplash.com/photo-1494178244203-0f6987e8cd36?q=80&w=800',
  'how-i-blew-my-first-account': 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=800',
  'geometry-of-liquid-markets': 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=800',
  'why-most-uk-traders-fail': 'https://images.unsplash.com/photo-1428908728789-d2de25dbd4e2?q=80&w=800',
  'spread-betting-vs-cfds': 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800',
  'case-for-full-automation': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800',
  'why-your-backtest-is-lying': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800',
  'prop-firm-honest-review': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800',
  'trading-taxes-uk-explained': 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800',
  'friday-trading-traps': 'https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?q=80&w=800',
  'tradingview-pro-setup': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800',
  'the-1-percent-rule': 'https://images.unsplash.com/photo-1453733190148-c44698c265f8?q=80&w=800',
  'the-only-three-indicators': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800',
};
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800';

// ---------------------------------------------------------------------------
// Step 1: Upsert author_profiles record
// ---------------------------------------------------------------------------
console.log('\n📝  Upserting author profile for Pete...');

const { data: author, error: authorError } = await supabase
  .from('author_profiles')
  .upsert(
    {
      name: 'Pete',
      role: 'Founder, Drawdown',
      bio: 'Building Drawdown to be the trading education platform that actually tells you the truth.',
      avatar_url: '',
    },
    { onConflict: 'name' }
  )
  .select('id')
  .single();

if (authorError) {
  console.error('❌  Failed to upsert author_profiles:', authorError.message);
  process.exit(1);
}

const authorId = author.id;
console.log(`✅  Author profile upserted. id=${authorId}`);

// ---------------------------------------------------------------------------
// Step 2: Read all 43 MDX files and upsert into blog_posts + blog_post_seo
// ---------------------------------------------------------------------------
const BLOG_DIR = join(__dirname, '..', 'src', 'content', 'blog');
const mdxFiles = readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'));

console.log(`\n📂  Found ${mdxFiles.length} MDX files. Beginning upsert...\n`);

let mdxSuccessCount = 0;
let mdxErrorCount = 0;

for (const file of mdxFiles) {
  const slug = file.replace('.mdx', '');
  const filePath = join(BLOG_DIR, file);
  const raw = readFileSync(filePath, 'utf8');
  const { data: fm, content } = matter(raw);

  // Calculate reading time
  const cleanContent = content.replace(/<\/?[^>]+(>|$)/g, '');
  const words = cleanContent.trim().split(/\s+/).filter((w) => w.length > 0).length;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  // Hero image
  const heroSrc =
    (fm.heroImage && fm.heroImage.src) ||
    fm.image ||
    SLUG_IMAGES[slug] ||
    DEFAULT_IMAGE;
  const heroAlt = (fm.heroImage && fm.heroImage.alt) || fm.title || slug;
  const heroCaption = (fm.heroImage && fm.heroImage.caption) || null;
  const heroCredit = (fm.heroImage && fm.heroImage.credit) || null;

  const metaTitle = fm.metaTitle || `${fm.title} | Drawdown Blog`;
  const metaDescription = fm.metaDescription || fm.excerpt || '';

  // SEO object stored in the seo column (optional JSON)
  const seoJson = {
    schema_type: 'mdx',
    faq: fm.faq || null,
    relatedTool: fm.relatedTool || null,
    relatedCourse: fm.relatedCourse || null,
    internalLinks: fm.internalLinks || null,
  };

  // Upsert blog_post
  const { data: upsertedPost, error: postError } = await supabase
    .from('blog_posts')
    .upsert(
      {
        slug,
        title: fm.title || slug,
        subtitle: fm.excerpt || '',
        eyebrow: fm.category ? fm.category.toUpperCase() : 'TRADING',
        category: fm.category || 'Market Analysis',
        published_at: fm.publishedAt || new Date().toISOString(),
        hero_image_url: heroSrc,
        hero_image_alt: heroAlt,
        hero_image_caption: heroCaption,
        hero_image_credit: heroCredit,
        read_time: `${readingTime} min read`,
        body: content, // raw MDX body (without frontmatter)
        is_published: true,
        author_id: authorId,
        related_post_slugs: fm.internalLinks || [],
        seo: seoJson,
        dark_background: false,
      },
      { onConflict: 'slug' }
    )
    .select('id')
    .single();

  if (postError) {
    console.error(`  ❌  [${slug}] blog_posts upsert failed: ${postError.message}`);
    mdxErrorCount++;
    continue;
  }

  const postId = upsertedPost.id;

  // Upsert blog_post_seo
  const { error: seoError } = await supabase
    .from('blog_post_seo')
    .upsert(
      {
        post_id: postId,
        meta_title: metaTitle,
        meta_description: metaDescription,
        og_title: fm.title,
        og_description: fm.excerpt || '',
        og_image_url: heroSrc,
        schema_type: 'mdx',
        focus_keyword: fm.category || null,
        no_index: false,
      },
      { onConflict: 'post_id' }
    );

  if (seoError) {
    console.warn(`  ⚠️   [${slug}] blog_post_seo upsert failed: ${seoError.message}`);
  }

  console.log(`  ✅  [${slug}] → id=${postId} (${readingTime} min read)`);
  mdxSuccessCount++;
}

console.log(`\n✅  MDX posts: ${mdxSuccessCount} upserted, ${mdxErrorCount} errors.`);

// ---------------------------------------------------------------------------
// Step 3: Seed 3 editorial posts
// ---------------------------------------------------------------------------
console.log('\n📰  Seeding editorial posts...\n');

const editorialPosts = [
  {
    slug: 'coffeezilla-alexg-trading-education',
    title: 'The Coffeezilla Video on fxAlexG: What It Actually Tells Us About Trading Education',
    eyebrow: 'TRADING EDUCATION',
    hero_image_url: '/images/blog/alexg-bugatti.png',
    published_at: '2026-06-20T12:00:00Z',
    category: 'Education',
    read_time: '9 min read',
    body: '<article class="prose-dark"><p>Full editorial content maintained in dark-theme format.</p></article>',
    schema_type: 'BlogPosting',
    related_post_slugs: [
      'why-trading-gurus-use-demo-accounts',
      'trading-education-business-model',
      'worthless-trading-courses',
    ],
  },
  {
    slug: 'why-trading-gurus-use-demo-accounts',
    title: 'Why Trading Gurus Use Demo Accounts — And What It Actually Means',
    eyebrow: 'TRADING EDUCATION',
    hero_image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200',
    published_at: '2026-06-19T12:00:00Z',
    category: 'Education',
    read_time: '8 min read',
    body: '<article class="prose-dark"><p>Full editorial content maintained in dark-theme format.</p></article>',
    schema_type: 'BlogPosting',
    related_post_slugs: [],
  },
  {
    slug: 'trading-education-business-model',
    title: 'The Trading Education Business Model: How the Money Is Really Made',
    eyebrow: 'TRADING EDUCATION',
    hero_image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200',
    published_at: '2026-06-18T12:00:00Z',
    category: 'Education',
    read_time: '10 min read',
    body: '<article class="prose-dark"><p>Full editorial content maintained in dark-theme format.</p></article>',
    schema_type: 'BlogPosting',
    related_post_slugs: [],
  },
];

for (const ep of editorialPosts) {
  const { data: upsertedEp, error: epError } = await supabase
    .from('blog_posts')
    .upsert(
      {
        slug: ep.slug,
        title: ep.title,
        subtitle: '',
        eyebrow: ep.eyebrow,
        category: ep.category,
        published_at: ep.published_at,
        hero_image_url: ep.hero_image_url,
        hero_image_alt: ep.title,
        read_time: ep.read_time,
        body: ep.body,
        is_published: true,
        author_id: authorId,
        related_post_slugs: ep.related_post_slugs,
        seo: { schema_type: ep.schema_type },
        dark_background: true,
      },
      { onConflict: 'slug' }
    )
    .select('id')
    .single();

  if (epError) {
    console.error(`  ❌  [${ep.slug}] editorial post upsert failed: ${epError.message}`);
    continue;
  }

  const epId = upsertedEp.id;

  // Upsert blog_post_seo for editorial
  const { error: epSeoError } = await supabase
    .from('blog_post_seo')
    .upsert(
      {
        post_id: epId,
        meta_title: `${ep.title} | Drawdown Blog`,
        meta_description: ep.title.substring(0, 155),
        og_title: ep.title,
        og_description: ep.title,
        og_image_url: ep.hero_image_url,
        schema_type: ep.schema_type,
        no_index: false,
      },
      { onConflict: 'post_id' }
    );

  if (epSeoError) {
    console.warn(`  ⚠️   [${ep.slug}] blog_post_seo upsert failed: ${epSeoError.message}`);
  }

  console.log(`  ✅  [${ep.slug}] → id=${epId}`);
}

console.log('\n🎉  Seeding complete!\n');
