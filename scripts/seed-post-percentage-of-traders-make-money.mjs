/**
 * seed-post-percentage-of-traders-make-money.mjs
 *
 * Inserts the "What Percentage of Traders Actually Make Money?" blog post
 * into Supabase. If the slug already exists, logs a warning and exits cleanly.
 *
 * Run with: node scripts/seed-post-percentage-of-traders-make-money.mjs
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
const SLUG = 'percentage-of-traders-make-money';

const BODY_HTML = `<p>Every UK broker offering CFDs or spread betting is legally required to publish what percentage of its retail clients lose money. The figure is displayed on their websites, usually near the product risk warning. It is not buried. It is not difficult to find. It is just consistently discouraging, and almost nobody explains what it actually means or what to do with it.</p>

<p>The short version: a large majority of retail traders who use leveraged products lose money over any measured period. The precise figure varies by broker and changes over time, but the direction is consistent across every major UK-regulated provider. That is the starting point for an honest conversation about who actually makes money trading, and why.</p>

<h2>What the Published Numbers Actually Say</h2>

<p>The FCA requires brokers offering CFDs to publish client loss-rate data on their websites, updated regularly. Before taking these figures as a benchmark, verify the current published disclosures directly on the websites of major UK-regulated brokers, as they change quarterly and vary meaningfully between firms. What they have in common is that the majority figure consistently sits well above 50 percent of retail clients losing money.</p>

<p>A few things are worth understanding about what these numbers actually measure. They reflect retail clients, not professional clients. They reflect a specific period (typically 12 months). And they measure clients who lost money on their CFD account overall, not clients who lost on every single trade. A trader can be net profitable on some trades and still appear in the losing column if they are net negative for the year.</p>

<p>The figure does not tell you how much was lost. It does not separate active traders from people who opened an account, placed two trades, and stopped. It also does not tell you how long those traders had been active, whether they had any training, or whether they followed any defined strategy. The number is real and the direction it points is important, but it describes the population broadly rather than precisely.</p>

<h2>Why the Number Is So Consistently Bad</h2>

<p>The answer is not that the market is structurally rigged against retail traders, though the cost side of leveraged trading (spreads, overnight funding, slippage on volatile moves) is a real headwind that compounds over time. The bigger drivers are more basic.</p>

<p>Most retail traders start with insufficient capital relative to their income targets. A trader who wants to generate a meaningful return from a £500 account needs percentage returns that would require taking risks that make the probability of account destruction very high. The mismatch between capital, risk tolerance, and income expectations is the most common structural problem.</p>

<p>The second driver is the absence of a tested edge. Most new traders begin with a method they have seen work on a chart in hindsight, without any forward-testing, position-sizing framework, or defined drawdown limit. When conditions change or the strategy hits a losing streak, there is no framework for distinguishing a strategy that is in normal drawdown from one that has stopped working. The response to losing is usually to change the strategy rather than hold it, which means the edge is never actually applied long enough to produce its statistical result.</p>

<p>Third: emotional decision-making compounds both of the above. A trader with a real edge and adequate capital can still produce poor results through revenge trading, overtrading, or cutting winners short under pressure. The psychological component of trading is not a soft topic. It is a primary driver of underperformance at the retail level.</p>

<h2>What Separates the Profitable Minority</h2>

<p>The traders who sit on the right side of the loss-rate statistic consistently share a recognisable set of practices. It is not that they are smarter, have better technology, or have access to information that others do not. It is that they treat the activity differently from the outset.</p>

<table>
<thead>
<tr><th>Factor</th><th>Majority (net unprofitable)</th><th>Profitable minority</th></tr>
</thead>
<tbody>
<tr><td>Strategy testing</td><td>None or based on hindsight chart reading</td><td>Forward-tested across 100+ trade sample before going live</td></tr>
<tr><td>Risk per trade</td><td>Varies with emotion and position conviction</td><td>Fixed percentage, set in advance, applied consistently</td></tr>
<tr><td>Capitalisation</td><td>Under-capitalised for stated income goals</td><td>Realistic about what their capital can reasonably return</td></tr>
<tr><td>Time on demo</td><td>Rushed or skipped entirely</td><td>Extended, with results logged and reviewed</td></tr>
<tr><td>Response to losing streaks</td><td>Increase size, change strategy, or abandon rules</td><td>Reduce size, review execution, maintain the framework</td></tr>
</tbody>
</table>

<p>None of these are advanced. They are foundational. The persistent low profitability rate in retail trading is not primarily a competence problem. It is a process problem: most people start trading before they have built the process that makes it worth starting.</p>

<h2>Survivorship Bias and What You See Online</h2>

<p>The gap between the published loss-rate figures and the impression given by trading content online is not accidental. The traders who produce content are, by definition, the ones who are still around and motivated to share their experience. The traders who lost their capital and stopped are not posting recaps of their best trades.</p>

<p>This creates a systematic distortion in what visible trading looks like. You see the outlier results, the fast accounts, the clean equity curves. You see the traders for whom things worked early. The absence of all the people for whom it did not work is invisible, because they are absent.</p>

<blockquote>The published loss-rate figures are not the full story, but they are the right starting point. They are the corrective to a content landscape that is structurally biased toward showing you the cases where trading worked. Read both together, not one without the other.</blockquote>

<p>This does not mean success is not achievable. It means the visible examples of success are not representative of the full population of people who attempted it. Calibrating expectations against the full population rather than the visible minority is what separates a realistic plan from a hopeful one.</p>

<h2>What This Actually Means for Someone Starting Out</h2>

<p>The statistics are not an argument against trading. They are an argument against the approach that most traders take. The loss-rate figures describe what happens when the activity is treated as a shortcut to income rather than a skill that requires systematic development.</p>

<p>The implication for someone starting out is not to avoid it. It is to take the process seriously from day one rather than chasing the outlier story. That means spending real time on demo before deploying capital. It means testing your strategy across a meaningful sample before trusting it. It means defining your risk before every trade rather than after it goes wrong. And it means treating a losing period as data about your execution rather than a signal to change everything.</p>

<p>The minority who make money over time are not the people with the best setups or the most sophisticated platforms. They are the people who treated the foundational work as the actual job, not as the prerequisite they needed to get through before the real thing started.</p>

<p>Drawdown is built around that approach. The curriculum starts with risk management and execution process, not with finding the best entry signal. Phase one is free, no card required. Start there and build the foundation that the loss-rate statistics consistently show most retail traders skip.</p>

<h2>Frequently Asked Questions</h2>

<h3>Do these loss-rate statistics apply to all trading, or specifically to CFDs?</h3>
<p>The FCA-mandated disclosure requirement applies specifically to CFD and spread betting providers. The figures therefore reflect retail clients using leveraged products, not all retail trading. Traders using stocks and shares ISAs, direct equity accounts, or other non-leveraged products are not captured in these disclosures. Leverage amplifies both gains and losses, which is a significant factor in the loss rates observed. Non-leveraged long-term investing has a materially different statistical profile.</p>

<h3>Why are brokers required to publish this data?</h3>
<p>The FCA introduced the requirement as part of its consumer protection framework for retail leveraged trading products. The rationale is that clients should be able to make an informed decision about the product before opening an account, including understanding the documented loss rate across the broader population of clients using that broker. The requirement was introduced in response to documented evidence that retail clients were entering leveraged trading without adequate understanding of the risk profile.</p>

<h3>Does experience reliably improve a trader's odds over time?</h3>
<p>Experience improves outcomes when it is structured experience: consistent application of a tested process, careful review of trades against the defined plan, and deliberate adjustment of execution based on what the data shows. Unstructured experience, where you trade for years without logging results or reviewing your decision-making, tends to reinforce existing habits rather than correct them. Time in the market is not the same as deliberate practice. The traders who improve over time are those who treat every period of trading as a feedback loop, not simply as exposure.</p>`;

// ---------------------------------------------------------------------------
// Step 1: Resolve Drawdown Team author_id
// ---------------------------------------------------------------------------
console.log('\n🔍  Resolving Drawdown Team author profile...');
const { data: existingAuthor, error: authorFetchError } = await supabase
  .from('author_profiles')
  .select('id, name')
  .eq('name', 'Drawdown Team')
  .maybeSingle();

if (authorFetchError) {
  console.error(`❌  Error querying author_profiles: ${authorFetchError.message}`);
  process.exit(1);
}

let authorId;

if (existingAuthor) {
  authorId = existingAuthor.id;
  console.log(`✅  Found existing author: ${existingAuthor.name} (${authorId})`);
} else {
  console.log('ℹ️   Drawdown Team author not found — creating...');
  const { data: newAuthor, error: authorInsertError } = await supabase
    .from('author_profiles')
    .insert({
      name:       'Drawdown Team',
      role:       'Editorial',
      bio:        'The Drawdown editorial team.',
      avatar_url: '',
    })
    .select('id, name')
    .single();

  if (authorInsertError || !newAuthor) {
    console.error(`❌  Failed to create Drawdown Team author: ${authorInsertError?.message}`);
    process.exit(1);
  }

  authorId = newAuthor.id;
  console.log(`✅  Created new author: ${newAuthor.name} (${authorId})`);
}

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
    title:              'What Percentage of Traders Actually Make Money?',
    subtitle:           'Every UK broker offering CFDs must publish their retail client loss rate. The number is rarely flattering and almost never explained properly. Here is the full picture.',
    eyebrow:            'EDUCATION',
    category:           'Education',
    body:               BODY_HTML,
    hero_image_url:     'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
    hero_image_alt:     'Data analytics dashboard showing trading statistics and performance metrics',
    read_time:          '7 min read',
    published_at:       new Date('2026-07-02T09:00:00Z').toISOString(),
    is_published:       true,
    dark_background:    true,
    author_id:          authorId,
    related_post_slugs: [
      'is-trading-gambling',
      'can-you-make-a-living-trading',
      'worthless-trading-courses',
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
    meta_title:       'What Percentage of Traders Actually Make Money? | Drawdown',
    meta_description: 'The real, well-documented numbers on retail trader profitability, why the figure is so low, and what separates the minority who do make money.',
    og_title:         'What Percentage of Traders Actually Make Money?',
    og_description:   'Every UK CFD broker must publish its retail client loss rate. The number is consistently discouraging and rarely explained properly. Here is the full picture.',
    og_image_url:     'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
    canonical_url:    'https://drawdown.trading/blog/percentage-of-traders-make-money',
    schema_type:      'BlogPosting',
    no_index:         false,
    focus_keyword:    'percentage of traders that make money',
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
