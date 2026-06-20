/**
 * seed-post-ict-michael-huddleston.mjs
 *
 * Inserts the "ICT — Michael Huddleston" blog post into Supabase.
 * If the slug already exists, logs a warning and exits cleanly.
 *
 * Run with: node scripts/seed-post-ict-michael-huddleston.mjs
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
const SLUG = 'ict-michael-huddleston-honest-review';

// published_at = 2 days ago
const publishedAt = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();

const BODY_HTML = `<h2>Who ICT Is — And Why You Have Probably Already Heard of Him</h2>

<p>If you have spent any meaningful time learning to trade in the last five years, you have encountered ICT concepts whether you knew it or not. Smart Money Concepts. Order blocks. Liquidity sweeps. Fair value gaps. Optimal trade entry. This entire vocabulary that now saturates retail trading forums, Discord servers, and YouTube comments sections traces back to one person: Michael J. Huddleston, known online as The Inner Circle Trader, or simply ICT.</p>

<p>His reach is difficult to overstate. Millions of followers across platforms. An entire generation of retail traders who learned to read market structure through his lens. Free content on YouTube that runs to hundreds of hours. A methodology so widely adopted that you now have a second generation of educators teaching ICT concepts to people who have never heard of the original source.</p>

<p>And alongside all of that, more controversy than almost anyone else in the trading education space. Accusations of cult-like following. Questions about verified live trading performance. A complicated personal history that his critics return to repeatedly. He is not a simple figure to write about and I am not going to pretend otherwise.</p>

<h2>What the Methodology Actually Is</h2>

<p>Before we get into the controversy, I want to spend some time on the actual content because I think it deserves a fair assessment on its own terms.</p>

<p>ICT's framework is built around the idea that retail traders consistently lose because they are trading against institutional order flow rather than with it. The concept of Smart Money — the institutions, banks, and large funds that actually move markets — is central to everything he teaches. The premise is that if you learn to read where institutional orders are placed, where liquidity is being hunted, and where the market is likely to engineer runs before reversing, you can position yourself on the right side of those moves.</p>

<p>Whether you fully accept that framing or not, the mechanical tools it produces are genuinely useful. Order blocks as zones of institutional interest. Fair value gaps as areas of price inefficiency the market tends to return to. Liquidity as a resource the market hunts before reversing. These are not magic — they are frameworks for reading price action that have enough internal logic to be worth understanding, regardless of whether you adopt them wholesale.</p>

<p>The content itself, particularly the earlier YouTube material, is some of the most detailed free trading education available anywhere. Long, dense, sometimes exhausting to work through — but genuinely substantive in a way that a lot of trading content is not. If you are willing to put the hours in, there is real material there.</p>

<h2>The Controversy — And What I Actually Think About It</h2>

<p>I want to be straight with you here because glossing over the controversy would not be honest and you deserve better than that.</p>

<p>The criticisms of ICT fall into a few categories. The first is the absence of verified live trading performance. Despite building an entire methodology around institutional order flow, ICT has not publicly shared audited live trading results that would confirm he is profitable using his own framework at meaningful size. For a space where the proof of concept is supposed to be real money performance, that is a legitimate gap.</p>

<p>The second is the community dynamic. The ICT following has at times taken on characteristics that make critical evaluation difficult. Questioning the methodology in certain forums attracts a level of pushback that is not conducive to learning. Any educator whose community cannot tolerate scrutiny of the methodology is worth approaching with some caution, regardless of the quality of the underlying content.</p>

<p>The third is complexity creep. The ICT methodology has expanded over the years to the point where the framework has an answer for almost every market scenario in hindsight. That kind of explanatory flexibility is worth watching for in any trading system. A methodology that can explain everything after the fact but struggles to produce clear mechanical rules before the fact is not as useful as it appears.</p>

<p>None of this makes ICT a fraud in my view. The methodology is real, the content is substantive, and the influence on how retail traders read the market has been genuinely significant. But I think you should go in with clear eyes rather than as a believer, and that distinction matters.</p>

<h2>Who It Is and Is Not For</h2>

<p>ICT content is not for complete beginners. The concepts assume you already understand what a candlestick is, what support and resistance means, and how basic market structure works. If you are starting from zero, the Drawdown curriculum will get you to the point where ICT content becomes useful faster than jumping straight in.</p>

<p>It is well suited to traders who have already spent time with technical analysis and feel like something is missing. If you understand the basics but the market still does not make sense to you, the institutional order flow framework has a way of recontextualising what you are seeing that a lot of people find genuinely clarifying. That experience is real even if the underlying theory is not universally accepted.</p>

<p>Approach it as a framework to evaluate rather than a system to adopt wholesale. Take the concepts that add value to your read of the market. Leave the ones that add complexity without clarity. And do not let any community, however large, make you feel that critical thinking about a methodology is a betrayal of it.</p>

<h2>My Verdict</h2>

<p>ICT is worth your time with the right expectations. The free YouTube content contains more genuine trading education than most paid courses in this space. The methodology has real substance underneath the controversy. And understanding Smart Money Concepts — even if you ultimately develop your own framework — will make you a more informed reader of market structure.</p>

<p>But go in as a student doing due diligence, not as a convert. Verify what you can. Test the concepts on your own charts before you trust them with real capital. And remember that no methodology, however widely followed, is a substitute for a documented edge that you have personally validated.</p>

<p>That is what the Drawdown AI Trade Journal is built for — logging your trades, tracking your edge, and building the evidence base that tells you whether what you are doing actually works. Phase one is free. Come and build the habit before you bet on the system.</p>`;

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
  console.log('    To update the post, delete it first or edit via /admin/blog.\n');
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
    title:              'ICT — Michael Huddleston: The Most Controversial Educator in Trading. Is He Worth Your Time?',
    subtitle:           'Millions of followers. Free content that changed how retail traders read the market. And more controversy than almost anyone else in the space. Here is my honest take.',
    eyebrow:            'FROM PETE',
    category:           'FROM PETE',
    body:               BODY_HTML,
    hero_image_url:     'https://images.unsplash.com/photo-1642790551116-18e150f248e3?w=1200&q=80',
    hero_image_alt:     'Candlestick charts and market structure on a trading screen',
    read_time:          '9 min read',
    published_at:       publishedAt,
    is_published:       true,
    dark_background:    true,
    author_id:          authorId,
    related_post_slugs: [
      'trade-with-pat-honest-review',
      'coffeezilla-alexg-trading-education',
      'trading-education-business-model',
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
    meta_title:       'ICT Michael Huddleston: Honest Review | Drawdown',
    meta_description: 'Michael Huddleston, known as ICT or The Inner Circle Trader, is one of the most followed and most controversial figures in trading education. Pete gives his honest, balanced take on whether the methodology is worth your time.',
    og_title:         'ICT — Michael Huddleston: Is He Worth Your Time?',
    og_description:   'Millions of followers. Free institutional trading concepts. More controversy than almost anyone in the space. Pete\'s honest take on ICT.',
    og_image_url:     'https://images.unsplash.com/photo-1642790551116-18e150f248e3?w=1200&q=80',
    canonical_url:    'https://drawdown.trading/blog/ict-michael-huddleston-honest-review',
    schema_type:      'BlogPosting',
    no_index:         false,
    focus_keyword:    'ICT Michael Huddleston review',
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
