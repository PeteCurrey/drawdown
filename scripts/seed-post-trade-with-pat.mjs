/**
 * seed-post-trade-with-pat.mjs
 *
 * Inserts the "Trade With Pat: What I Actually Think" blog post into Supabase.
 * If the slug already exists, logs a warning and exits cleanly.
 *
 * Run with: node scripts/seed-post-trade-with-pat.mjs
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
const SLUG = 'trade-with-pat-honest-review';

// published_at = 5 days ago
const publishedAt = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();

const BODY_HTML = `<h2>Who Pat Actually Is</h2>

<p>Before I say anything else, I want to be upfront about something. I am not being paid to write this. Pat has no idea I am writing it. There is no affiliate arrangement between Drawdown and Trade With Pat at the time of publishing. This is just my honest take on someone whose content I have spent time with and come away from thinking: this is one of the good ones.</p>

<p>Pat has been trading forex for seventeen years. Not seventeen years building a YouTube channel — seventeen years actually in the market, running his Forex Robot Nation blog long before YouTube was a viable career option for anyone. The channel came later. The experience came first. That order of events matters more than people realise when they are evaluating who to learn from.</p>

<p>The channel covers day trading across forex, gold, and indices. He talks about strategies, robots, signals, and indicators. It is not the flashiest content in the space. There is no sports car in the thumbnail. There is no dramatic music over a P&amp;L screenshot. It is a guy who knows what he is doing, explaining it clearly, consistently, without performing wealth at you.</p>

<h2>What He Does Well</h2>

<p>The thing I respect most about Pat's content is the tone. It is calm, methodical, and honest about the difficulty of what he is teaching. He does not promise you financial freedom in ninety days. He does not imply that his strategy is a cheat code. He teaches like someone who has lost money doing this and learned from it, which in my experience is the only kind of trading educator worth listening to.</p>

<p>The free course is genuinely free. No credit card at step three. No bait and switch into a £2,000 mentorship programme. The core education is accessible upfront, which tells you something about how he thinks about his audience. He is building trust before revenue, which is both the right ethical position and, as it happens, the smarter long-term business model.</p>

<p>His coverage of trading robots and automated strategies is also worth flagging because it is an area most educators either ignore completely or overstate wildly. Pat treats it as a tool, not a magic solution, which is the correct framing. Automation can remove emotion from execution but it cannot replace a genuine edge. He understands that distinction and communicates it clearly.</p>

<h2>Where I Would Push Back Slightly</h2>

<p>I want to be fair here because nobody gets everything right and a piece that only says positive things is not really useful to anyone.</p>

<p>Pat's content on signals and robots does walk a line that I think deserves some scrutiny from the audience. Not because he is being dishonest about them, but because signals and automated systems attract a certain type of beginner who wants to skip the learning phase entirely. The content is fine. The audience it sometimes attracts less so. If you are going to engage with that side of his content, go in with your eyes open about what signals actually are and what they are not.</p>

<p>I would also say his channel sits more comfortably in the intermediate space than the complete beginner space, despite being marketed to both. If you have never placed a trade in your life, I would spend some time on the fundamentals before diving into his strategy content. The Drawdown curriculum is built to cover exactly that foundation before you get into the methodology work.</p>

<h2>The Honest Comparison</h2>

<p>I have spent time thinking about what separates the trading educators I respect from the ones I do not. It is not really about how good a trader they are — though that matters. It is about whether the content serves the audience or serves the brand.</p>

<p>Pat's content serves the audience. It is not optimised for virality. It is not built around a lifestyle narrative. It is a person with genuine experience sharing what he knows in a format that is actually useful to someone trying to improve. In a space where that is genuinely rare, it is worth saying out loud.</p>

<p>I would point a beginner toward Trade With Pat without hesitation. Not as the only resource — nobody should rely on a single source for trading education — but as a solid, honest, experience-backed starting point. And in this space, that is a meaningful endorsement.</p>

<h2>Where Drawdown Fits Alongside This</h2>

<p>I built Drawdown because I wanted somewhere that combined structured curriculum, real tools, and honest broker information in one place. Pat's channel is not that — it is a YouTube channel, and a good one. They serve different purposes and I think they complement each other well.</p>

<p>If you are learning from Pat and want a structured framework to sit alongside it — risk calculators, an AI trade journal, honest prop firm reviews — that is what Drawdown is here for. Phase one is completely free. No credit card. Come and have a look.</p>`;

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
    title:              'Trade With Pat: What I Actually Think',
    subtitle:           'Seventeen years in the market. A free course. No Lamborghini in the thumbnail. Here is why Pat is one of the few I would point a beginner toward without hesitation.',
    eyebrow:            'FROM PETE',
    category:           'FROM PETE',
    body:               BODY_HTML,
    hero_image_url:     'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80',
    hero_image_alt:     'Trading charts on multiple monitors in a dark room',
    read_time:          '7 min read',
    published_at:       publishedAt,
    is_published:       true,
    dark_background:    true,
    author_id:          authorId,
    related_post_slugs: [
      'coffeezilla-alexg-trading-education',
      'why-trading-gurus-use-demo-accounts',
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
    meta_title:       'Trade With Pat: What I Actually Think | Drawdown',
    meta_description: 'Seventeen years trading forex, gold and indices. A free course with no catch. Pete gives his honest take on why Trade With Pat is one of the few trading educators he would recommend without hesitation.',
    og_title:         'Trade With Pat: What I Actually Think',
    og_description:   "Seventeen years in the market. A free course. No Lamborghini in the thumbnail. Pete's honest take on one of the few trading educators worth your time.",
    og_image_url:     'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80',
    canonical_url:    'https://drawdown.trading/blog/trade-with-pat-honest-review',
    schema_type:      'BlogPosting',
    no_index:         false,
    focus_keyword:    'Trade With Pat review',
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
