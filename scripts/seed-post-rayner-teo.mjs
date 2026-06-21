/**
 * seed-post-rayner-teo.mjs
 *
 * Inserts the "Rayner Teo: The Most Underrated Free Trading Education
 * on the Internet" blog post into Supabase.
 * If the slug already exists, logs a warning and exits cleanly.
 *
 * Run with: node scripts/seed-post-rayner-teo.mjs
 */

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const dotenv = await import('dotenv');
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const { createClient } = await import('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const SLUG = 'rayner-teo-honest-review';

// published_at = today
const publishedAt = new Date().toISOString();

const BODY_HTML = `<h2>Who Rayner Teo Is</h2>

<p>Rayner Teo does not get talked about enough and I think the reason is exactly what makes him worth talking about. He does not generate controversy. He does not build a lifestyle narrative around his trading. He does not have a dramatic origin story or a high-ticket course with a countdown timer. He just produces consistently clear, honest, well-structured trading education and puts it out for free.</p>

<p>In a space that runs on drama and aspiration, quietly competent does not travel as fast as controversial. Which is a shame, because for someone actually trying to learn to trade rather than trying to find the most exciting content to watch, Rayner is one of the first names I would mention.</p>

<p>He is Singapore-based, has been trading and teaching since around 2012, and has built one of the larger independent trading education audiences without the controversy that tends to follow size in this space. That combination — large audience, clean reputation — is rarer than it should be.</p>

<h2>What He Teaches and How He Teaches It</h2>

<p>Rayner's content focuses on price action, trend following, and swing trading. His approach is systematic — he teaches frameworks with defined rules rather than discretionary feel-based approaches, which makes the content considerably more transferable than a lot of what is out there.</p>

<p>The thing I appreciate most about his teaching style is the clarity. He explains concepts in plain language without oversimplifying them. He uses real chart examples consistently. And he is honest about the limitations of what he is teaching — he does not claim his methodology works in all conditions or that following his approach guarantees profitability. That kind of intellectual honesty is not as common as it should be.</p>

<p>His content on risk management is particularly worth calling out because it is treated as a core component of the education rather than an afterthought. Position sizing, expectancy, win rate versus reward to risk ratio — these concepts are woven throughout rather than relegated to a single module most people skip. That reflects a genuine understanding of what actually determines trading outcomes at the retail level.</p>

<h2>The Free Content Question</h2>

<p>One of the things I look at when I am evaluating a trading educator is what they give away for free versus what they charge for. It tells you something about how they think about their audience.</p>

<p>Rayner gives away an extraordinary amount. His YouTube channel, his website, his free guides — there is enough there to build a serious foundation in price action and swing trading without spending a penny. The paid products exist but they are not the gateway to the core content. That order of operations — give genuine value first, monetise second — is the right way to build in this space and he has done it consistently.</p>

<p>I am also not aware of any meaningful controversy around his affiliate relationships or broker recommendations. That is worth noting in a space where undisclosed affiliate revenue is the norm rather than the exception.</p>

<h2>Who It Is Best For</h2>

<p>Rayner's content sits well at the beginner-to-intermediate level. If you are new to trading and want to build a solid foundation in how markets move, how to read price action, and how to think about risk before you put real capital on the line, his free content is one of the better starting points available.</p>

<p>If you are more advanced and looking for institutional methodology or more complex frameworks, you will probably exhaust what Rayner offers relatively quickly. That is not a criticism — teaching the fundamentals well is its own skill and a genuinely valuable one. It just means knowing what you are looking for before you start.</p>

<p>For traders at the stage where they want structured curriculum alongside the YouTube content — risk calculators, a proper trade journal, honest prop firm guidance — that is exactly where Drawdown sits. The two complement each other well at that stage of the learning curve.</p>

<h2>My Verdict</h2>

<p>Rayner Teo is one of the most reliable recommendations I can make in trading education. No caveats about controversy. No warnings about undisclosed affiliates. No concerns about whether the methodology is real. Just honest, clear, well-structured content from someone who has been doing this properly for over a decade.</p>

<p>In a space where that is genuinely unusual, it deserves to be said plainly. If you are building your trading education and you have not spent time with Rayner's content, go and do that. It will not waste your time.</p>

<p>And when you want a structured framework to sit alongside it — curriculum, tools, community, honest broker and prop firm reviews — Drawdown is here. Phase one is free. No card. No catch.</p>`;

// ---------------------------------------------------------------------------
// Step 1: Resolve Pete's author_id
// ---------------------------------------------------------------------------
console.log('\n🔍  Resolving author profile...');
const { data: authors, error: authorFetchError } = await supabase
  .from('author_profiles')
  .select('id, name')
  .limit(1);

if (authorFetchError || !authors || authors.length === 0) {
  console.error('❌  Could not find author profile. Run seed-blog-posts.mjs first.');
  process.exit(1);
}

const authorId = authors[0].id;
console.log(`✅  Using author: ${authors[0].name} (${authorId})`);

// ---------------------------------------------------------------------------
// Step 2: Check if slug already exists
// ---------------------------------------------------------------------------
console.log(`\n🔍  Checking if slug "${SLUG}" already exists...`);
const { data: existing } = await supabase
  .from('blog_posts')
  .select('id, slug')
  .eq('slug', SLUG)
  .maybeSingle();

if (existing) {
  console.warn(`⚠️   Slug "${SLUG}" already exists (id: ${existing.id}). Skipping insert.`);
  console.log('    To update the post, delete it first or edit it via /admin/blog.\n');
  process.exit(0);
}

// ---------------------------------------------------------------------------
// Step 3: Insert blog_posts record
// ---------------------------------------------------------------------------
console.log('\n📝  Inserting blog post...');
const { data: post, error: postError } = await supabase
  .from('blog_posts')
  .insert({
    slug:               SLUG,
    title:              'Rayner Teo: The Most Underrated Free Trading Education on the Internet',
    subtitle:           'No controversy. No drama. No Lamborghini. Just consistently good trading education delivered clearly and for free. Here is why Rayner deserves more credit than he gets.',
    eyebrow:            'FROM PETE',
    category:           'FROM PETE',
    body:               BODY_HTML,
    hero_image_url:     'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80',
    hero_image_alt:     'Clean trading desk setup with charts and market data',
    read_time:          '6 min read',
    published_at:       publishedAt,
    is_published:       true,
    dark_background:    true,
    author_id:          authorId,
    related_post_slugs: [
      'trade-with-pat-honest-review',
      'ict-michael-huddleston-honest-review',
      'anton-kreil-itpm-honest-review',
    ],
  })
  .select('id')
  .single();

if (postError) {
  console.error(`❌  blog_posts insert failed: ${postError.message}`);
  process.exit(1);
}

const postId = post.id;
console.log(`✅  blog_posts record created. id=${postId}`);

// ---------------------------------------------------------------------------
// Step 4: Insert blog_post_seo record
// ---------------------------------------------------------------------------
console.log('\n📝  Inserting SEO record...');
const { error: seoError } = await supabase
  .from('blog_post_seo')
  .insert({
    post_id:          postId,
    meta_title:       'Rayner Teo Honest Review | Drawdown',
    meta_description: 'Rayner Teo produces some of the clearest free trading education available. No drama, no lifestyle marketing, no catch. Pete gives his honest take on why Rayner is one of the most underrated educators in the space.',
    og_title:         'Rayner Teo: The Most Underrated Free Trading Education on the Internet',
    og_description:   "No controversy. No drama. No Lamborghini. Just consistently good free trading education. Pete's honest take on Rayner Teo.",
    og_image_url:     'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80',
    canonical_url:    'https://drawdown.trading/blog/rayner-teo-honest-review',
    schema_type:      'BlogPosting',
    no_index:         false,
    focus_keyword:    'Rayner Teo review',
  });

if (seoError) {
  console.warn(`⚠️   blog_post_seo insert failed: ${seoError.message}`);
  console.warn('    Post was created — add SEO manually via /admin/blog.');
} else {
  console.log('✅  blog_post_seo record created.');
}

// ---------------------------------------------------------------------------
// Done
// ---------------------------------------------------------------------------
console.log(`
🎉  Done!
    Slug:  ${SLUG}
    ID:    ${postId}
    URL:   https://drawdown.trading/blog/${SLUG}
    Theme: Dark (#0A0A0A)
    Live:  true
`);
