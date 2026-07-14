/**
 * seed-post-can-you-make-a-living-trading.mjs
 * Run with: node scripts/seed-post-can-you-make-a-living-trading.mjs
 */
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const dotenv = await import('dotenv');
dotenv.config({ path: join(__dirname, '..', '.env.local') });
const { createClient } = await import('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) { console.error('❌  Missing env vars'); process.exit(1); }

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const SLUG = 'can-you-make-a-living-trading';
const publishedAt = new Date('2026-07-04T09:00:00Z').toISOString();

const BODY_HTML = `<p>You can make a living trading. Some people do. But the question most people are actually asking when they type this into a search engine is a different one: could <em>I</em> make a living trading, on my current capital, within a timeframe that makes sense given my life? That version of the question has a more specific answer, and it starts with the mathematics rather than the aspiration.</p>

<p>The honest answer for most people who are currently early in their trading journey is: not yet, and probably not for some time. That is not a reason to stop. It is a reason to be clear about what stage you are actually at and what a realistic next milestone looks like, rather than measuring yourself against a goal that requires years of compounded skill and capital to reach.</p>

<h2>The Capital Question First</h2>

<p>The most useful way to approach this is to work backwards. Start with a monthly income target and trace it back to the capital and return rate required to produce it. This is arithmetic, not opinion, and it tends to be sobering when you run it properly.</p>

<p>Take a net income target of £2,500 per month, which sits roughly in line with a moderate UK salary. That is £30,000 per year from trading. Apply a range of annual return rates and see what capital is required to generate that figure:</p>

<table>
<thead>
<tr><th>Annual return rate</th><th>Capital for £1,500/month</th><th>Capital for £2,000/month</th><th>Capital for £2,500/month</th></tr>
</thead>
<tbody>
<tr><td>10%</td><td>£180,000</td><td>£240,000</td><td>£300,000</td></tr>
<tr><td>15%</td><td>£120,000</td><td>£160,000</td><td>£200,000</td></tr>
<tr><td>20%</td><td>£90,000</td><td>£120,000</td><td>£150,000</td></tr>
<tr><td>25%</td><td>£72,000</td><td>£96,000</td><td>£120,000</td></tr>
</tbody>
</table>

<p>These figures assume trading via spread betting (currently exempt from Capital Gains Tax in the UK) and do not account for platform costs, data subscriptions, or the psychological cost of variable monthly income. Add those back and the capital requirement rises further.</p>

<h2>Why Realistic Return Rate Is the Part Most Content Skips</h2>

<p>The table above immediately raises the question of which row is realistic. And this is where most content about making a living from trading quietly steps off the edge.</p>

<p>A consistent 25% annual return, sustained over multiple years, would place a retail trader among the top-performing professional fund managers globally. Most institutional funds do not consistently hit 25% annually. Planning a life around exceeding that figure, before you have documented evidence your strategy produces it, is not planning. It is hoping.</p>

<p>For a skilled retail trader with a tested strategy and disciplined execution, a realistic sustainable annual return sits somewhere in the range of 10 to 20 percent across market conditions. That is not a ceiling. There are traders who exceed it. But the practical implication is that at realistic return rates, the capital requirement to replace a meaningful income is large. Most traders starting out do not have that capital, and cannot accumulate it quickly from trading alone, because the returns needed to accumulate it faster require taking risks that threaten the capital being built.</p>

<h2>The Consistency Requirement</h2>

<p>Capital and return rate are only part of the picture. The other element that gets left out is consistency: not one good year, but a sustained track record across market conditions that vary enough to test whether the edge is real or whether it worked because conditions happened to suit it.</p>

<p>A strategy that produces strong returns in a trending market may produce very different results in a choppy, low-volatility environment. A trader who has only operated in one type of market condition does not yet know whether their edge is robust or condition-dependent. Finding out is not optional when the income target is real rather than aspirational.</p>

<p>A realistic minimum for claiming consistent results is two or three years of forward-tested live trading across a range of conditions, with a trade log that confirms the results were produced by applying a defined strategy. That is the evidence base from which a decision to rely on trading income should be made.</p>

<h2>The Overlooked Cost Side</h2>

<p>Income from trading is variable in a way that salary income is not. A run of losing months does not reduce your rent. The psychological cost of variable income when it is your only income source is substantially higher than most traders anticipate, and it directly affects trading performance because financial pressure compounds emotional decision-making.</p>

<p>The practical costs are real too. Platform subscriptions, data feeds, a VPS if you run automated strategies, accountancy if trading through a business structure: these sit above the trading P&amp;L and reduce the effective annual return. A strategy producing 15% before costs may produce significantly less net of a properly equipped setup.</p>

<h2>A More Honest Staged Path</h2>

<p>The model that makes practical sense for the large majority of traders who do reach genuine profitability is not a sharp switch from employment to full-time trading. It is a staged transition over years, not months.</p>

<p>Stage one is building a track record: trading part-time alongside other income, logging every trade, reviewing execution against the plan, and accumulating evidence that the strategy works in live conditions. This stage is measured in years, not weeks.</p>

<p>Stage two is scaling capital: once the track record is genuine and documented, growing the account systematically, or pursuing funded accounts through prop firms as a lower-capital route to larger size.</p>

<p>Stage three is a partial transition: reducing hours or moving to contract work before eliminating other income entirely, so that a sequence of losing months does not create financial pressure that affects trading decisions.</p>

<blockquote>Quit your job and trade for a living is a marketing line, not a plan. The plan requires knowing your capital, your documented return rate, your costs, and what stage of the journey you are actually at. Most people who reach the destination took the long way around, deliberately. The ones who tried to skip it mostly did not reach it.</blockquote>

<h2>Frequently Asked Questions</h2>

<h3>How much capital would realistically be needed to replace an average UK salary through trading alone?</h3>
<p>Working backwards from a net salary of approximately £2,000 to £2,500 per month, at a sustainable annual return of 15%, the capital requirement sits between £160,000 and £200,000. At 10%, it rises to £240,000 to £300,000. These figures do not account for income variability, tax obligations depending on the trading vehicle, or the running costs of a properly equipped setup. The honest answer is that replacing an average UK income requires more capital than most people starting out have available, which is why the staged approach is the realistic path for the majority.</p>

<h3>Is trading full-time a sensible goal for most people who start trading?</h3>
<p>As a long-term goal, yes, for those who approach the process seriously. As an immediate plan for someone new to trading, no. The skills, capital, and documented track record required to make it work are built over years of structured practice. The goal is legitimate. The timeline most people attach to it is not, and that mismatch is responsible for a significant proportion of the losses traders sustain trying to reach the destination before they have built the foundation it requires.</p>

<h3>What is a more realistic first milestone than quitting a job?</h3>
<p>Six consecutive months of positive returns in live trading, produced by following a defined strategy rather than a series of discretionary decisions that happened to work. That evidence base tells you whether the edge you believe you have is real in live conditions. Twelve months introduces enough market variation to test whether the strategy is robust or condition-dependent. These are the milestones that build the foundation for a staged income transition. They are less exciting than a resignation letter and considerably more useful.</p>

<p>Drawdown is built around structured, measurable progression. The curriculum starts with risk management and process, the tools include a trade journal that logs and reviews your execution, and the guidance is honest about what stage you are at. Phase one is free, no card required.</p>`;

// Step 1: Resolve Pete's author_id
console.log('\n🔍  Resolving author profile...');
const { data: authors, error: authorFetchError } = await supabase
  .from('author_profiles').select('id, name').limit(1);
if (authorFetchError || !authors || authors.length === 0) {
  console.error('❌  Could not find author profile.'); process.exit(1);
}
const authorId = authors[0].id;
console.log(`✅  Using author: ${authors[0].name} (${authorId})`);

// Step 2: Check slug
console.log(`\n🔍  Checking if slug "${SLUG}" already exists...`);
const { data: existing } = await supabase.from('blog_posts').select('id, slug').eq('slug', SLUG).maybeSingle();
if (existing) {
  console.warn(`⚠️   Slug "${SLUG}" already exists (id: ${existing.id}). Skipping.`);
  process.exit(0);
}

// Step 3: Insert blog_posts
console.log('\n📝  Inserting blog post...');
const { data: post, error: postError } = await supabase
  .from('blog_posts')
  .insert({
    slug: SLUG,
    title: 'Can You Actually Make a Living Trading? The Real Numbers',
    subtitle: '"Quit your job and trade for a living" is a marketing line, not a plan. Here is what the mathematics actually requires, without the inflated promises.',
    eyebrow: 'FROM PETE',
    category: 'Education',
    body: BODY_HTML,
    hero_image_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&q=80',
    hero_image_alt: 'Calculator and financial planning documents on a desk',
    read_time: '8 min read',
    published_at: publishedAt,
    is_published: true,
    dark_background: true,
    author_id: authorId,
    related_post_slugs: ['percentage-of-traders-make-money', 'prop-firm-honest-review', 'is-trading-gambling'],
  })
  .select('id').single();
if (postError) { console.error(`❌  blog_posts insert failed: ${postError.message}`); process.exit(1); }
const postId = post.id;
console.log(`✅  blog_posts record created. id=${postId}`);

// Step 4: Insert blog_post_seo
console.log('\n📝  Inserting SEO record...');
const { error: seoError } = await supabase.from('blog_post_seo').insert({
  post_id: postId,
  meta_title: 'Can You Make a Living Trading? The Real Numbers | Drawdown',
  meta_description: 'What it actually takes in capital, consistency and time before trading could realistically replace an income. The maths, without the inflated promises.',
  og_title: 'Can You Actually Make a Living Trading? The Real Numbers',
  og_description: '"Quit your job and trade" is a marketing line. Here is what the maths actually requires in capital, consistency, and time.',
  og_image_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&q=80',
  canonical_url: `https://drawdown.trading/blog/${SLUG}`,
  schema_type: 'BlogPosting',
  no_index: false,
  focus_keyword: 'can you make a living trading',
});
if (seoError) { console.warn(`⚠️   blog_post_seo insert failed: ${seoError.message}`); }
else { console.log('✅  blog_post_seo record created.'); }

console.log(`\n🎉  Done!\n    Slug:  ${SLUG}\n    ID:    ${postId}\n    URL:   https://drawdown.trading/blog/${SLUG}\n`);
