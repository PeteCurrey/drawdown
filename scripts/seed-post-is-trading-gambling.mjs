/**
 * seed-post-is-trading-gambling.mjs
 *
 * Inserts the "Is Trading Just Gambling? An Honest Answer" blog post into Supabase.
 * If the slug already exists, logs a warning and exits cleanly.
 *
 * Run with: node scripts/seed-post-is-trading-gambling.mjs
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
const SLUG = 'is-trading-gambling';

const BODY_HTML = `<p>The honest answer is: it depends entirely on what you are actually doing. Trading and gambling share enough surface features that the comparison is understandable, but they are not the same thing — provided you are engaging in trading rather than something that only looks like it from the outside.</p>

<p>The version of this question designed to dismiss the activity altogether is not the useful one. The version worth sitting with is different: does your trading have a positive statistical expectancy, defined risk, and a repeatable process that you follow consistently? If yes, it is not gambling. If no, the distinction becomes much harder to defend.</p>

<h2>Why the Comparison Exists in the First Place</h2>

<p>The comparison is not unfair. Both trading and gambling involve deploying capital on uncertain outcomes. Both trigger a dopamine response when the outcome goes your way. Both carry real risk of compulsive behaviour. And for the majority of people who attempt them without preparation, both lead to significant financial loss.</p>

<p>Acknowledging these overlaps honestly is more useful than dismissing them. The psychological risks the comparison points toward are real, and traders who refuse to engage with the comparison seriously tend to be less equipped to manage the behavioural patterns that make it look accurate.</p>

<p>The shared features are genuine. The activity itself is what separates them, and that distinction rests on something specific: the presence or absence of a tested, positive-expectancy process.</p>

<h2>What Actually Separates a Structured Edge from a Bet</h2>

<p>A bet, in the strict sense, is a single attempt at a binary outcome where the odds are fixed against you and cannot be changed by skill. The house edge in roulette is built into the payout structure. You cannot study your way to a different expected outcome over time because the probabilities are not affected by anything you do.</p>

<p>A trading edge works differently. A strategy with positive expectancy produces a positive result over a sufficient sample size, not because any individual trade is certain, but because the mathematics of the outcome distribution favours the strategy over time. Win rate multiplied by average winner must exceed loss rate multiplied by average loser. When it does, consistently, the strategy makes money over time regardless of what any individual trade does.</p>

<p>The components of a genuine edge are: a positive expectancy verified across a realistic historical sample, defined risk per trade set before entry, and a process applied consistently rather than adjusted based on how a particular session feels. All three are necessary. A good win rate with inconsistent execution, or a positive expectancy that is abandoned when things go against you, does not produce the same result.</p>

<p>This is why testing a strategy before committing real capital is not optional. Without a documented basis for believing the edge exists, deploying capital on conviction is a bet on intuition rather than a strategy with a statistical foundation.</p>

<h2>Where the Line Genuinely Blurs</h2>

<p>Here is the part that tends to get left out of this conversation: a trader with a genuine, tested, positive-expectancy strategy can turn their trading into something gambling-shaped through behaviour alone. The underlying strategy does not change. The behaviour around it does.</p>

<p>Revenge trading after a loss is the clearest example. A plan says: maximum two trades per session, maximum one percent risk per trade. Both trades lose. A third trade is placed at double size to get back to flat. That third trade has no statistical basis in any tested strategy. It is a bet, placed in an emotional state, using capital that was not supposed to be deployed. The edge may still exist in principle. It is not what is producing that decision.</p>

<p>Overtrading is the same pattern across a longer time frame. A strategy that produces its edge during the London open produces a different result when applied fourteen times across three sessions because the screen was open. The edge was built for specific conditions. Applied consistently outside them, it stops being the edge.</p>

<p>The behaviour is what blurs the line, not the activity. A clear-eyed assessment of whether you follow your defined process when you are losing is more diagnostically useful than any philosophical debate about whether the activity is gambling in principle.</p>

<h2>The Regulatory Distinction in the UK</h2>

<p>In the UK, spread betting and CFD trading on financial markets fall under FCA regulation as financial services products, not under the Gambling Commission as gambling. The distinction is not cosmetic.</p>

<p>FCA regulation requires client money segregation, best execution obligations, leverage limits for retail clients, mandatory negative balance protection, and the requirement that brokers publish the percentage of their retail clients who lose money. These protections exist because of the documented risks to retail participants and are substantively different from those available under gambling regulation.</p>

<p>Spread betting uses the word betting in its name because of its historical origin in fixed-odds financial products. The regulatory treatment today reflects the structure of the instrument. Profits from spread betting are currently exempt from Capital Gains Tax in the UK, which is the direct result of it being classified as a financial instrument rather than a gambling product.</p>

<p>The Gambling Commission does regulate some fixed-odds financial products where the outcome is determined by a single event rather than ongoing price movement. Where your activity sits within that boundary matters because the regulatory protections available on each side differ in practice.</p>

<h2>A Self-Check Worth Running</h2>

<p>The practical test is not philosophical. It is behavioural. These four questions tell you more about which side of the line your trading actually sits on than any abstract discussion of probability:</p>

<table>
<thead>
<tr><th>Question</th><th>If yes</th><th>If no</th></tr>
</thead>
<tbody>
<tr><td>Have you tested your strategy across a meaningful sample of trades?</td><td>You have a documented basis for believing an edge exists</td><td>You are trading on intuition rather than evidence</td></tr>
<tr><td>Do you define your maximum risk before every entry?</td><td>Loss is bounded and deliberate</td><td>Loss is open-ended and reactive</td></tr>
<tr><td>Do you follow your plan consistently, including when you are losing?</td><td>You are expressing the edge you built</td><td>You are making decisions from emotion or impatience</td></tr>
<tr><td>Could you show every trade you have taken to someone who understands defined-risk trading?</td><td>The process is coherent and defensible</td><td>Some of those trades were outside any defined plan</td></tr>
</tbody>
</table>

<p>A no to any of these is useful information, not a verdict. It tells you what to address before the gap between trading and gambling closes on its own.</p>

<blockquote>The line is not drawn by the activity. It is drawn by the process, or the absence of one. The same screen, the same market, the same instrument: one approach is a tested edge expressed over time. The other is a bet dressed in the language of trading. The behaviour is what determines which one is actually happening.</blockquote>

<h2>Frequently Asked Questions</h2>

<h3>Is spread betting legally classed as gambling in the UK?</h3>
<p>No. Spread betting on financial markets is regulated by the FCA as a financial services product, not by the Gambling Commission. Despite the word betting in its name, the instrument is treated as a financial product for regulatory and tax purposes. Profits from spread betting are currently exempt from Capital Gains Tax in the UK as a result of this classification.</p>

<h3>Can trading become gambling even when you have a real strategy?</h3>
<p>Yes. A strategy only functions as an edge when applied consistently within its defined conditions. Decisions made outside your rules because of frustration, impatience, or the desire to recover a loss have no statistical basis in any tested edge. That decision is a bet, regardless of what the underlying strategy is. Whether your trading functions as one or the other is a question about execution, not just about whether you have a strategy document.</p>

<h3>What does expectancy mean and why does it matter here?</h3>
<p>Expectancy is the average outcome per trade across a large sample. It combines your win rate with your average winner and your average loser. A strategy with positive expectancy makes money over time when applied consistently, even though individual trades are uncertain. A bet at a casino has a built-in negative expectancy that cannot be changed by skill. A trading strategy can have positive expectancy if it has been built correctly and is actually applied as designed. That is the core of the distinction.</p>

<p>The Drawdown AI Trade Journal tracks your entries and exits and flags the patterns that separate your intended strategy from your actual one. If the gap between plan and execution is large, you will see it plainly. Start logging your trades and find out where you actually stand.</p>`;

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
    title:              'Is Trading Just Gambling? An Honest Answer',
    subtitle:           'The line between trading and gambling is not as clean as either side of the argument likes to pretend. Here is where it holds, where it blurs, and how to know which side of it you are actually on.',
    eyebrow:            'FROM PETE',
    category:           'Psychology',
    body:               BODY_HTML,
    hero_image_url:     'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80',
    hero_image_alt:     'Financial charts and market data displayed on multiple monitors',
    read_time:          '8 min read',
    published_at:       new Date('2026-06-30T09:00:00Z').toISOString(),
    is_published:       true,
    dark_background:    true,
    author_id:          authorId,
    related_post_slugs: [
      'cost-of-revenge-trading',
      'the-myth-of-the-100-percent-win-rate',
      'why-your-backtest-is-lying',
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
    meta_title:       'Is Trading Just Gambling? An Honest Answer | Drawdown',
    meta_description: 'An honest look at why trading and gambling get conflated, what actually separates a tested edge from a bet, and where the line genuinely blurs.',
    og_title:         'Is Trading Just Gambling? An Honest Answer',
    og_description:   'The line between trading and gambling is not as clean as either side pretends. An honest look at where it holds and where it blurs.',
    og_image_url:     'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80',
    canonical_url:    'https://drawdown.trading/blog/is-trading-gambling',
    schema_type:      'BlogPosting',
    no_index:         false,
    focus_keyword:    'is trading gambling',
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
