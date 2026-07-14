/**
 * seed-post-prop-firm-vs-funding-your-own-account.mjs
 * Run with: node scripts/seed-post-prop-firm-vs-funding-your-own-account.mjs
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

const SLUG = 'prop-firm-vs-funding-your-own-account';
const publishedAt = new Date('2026-07-09T09:00:00Z').toISOString();

const BODY_HTML = `<p>A prop firm challenge looks like a shortcut to trading bigger size sooner. In some ways it is. But it is a trade-off rather than a cheat code, and the question of whether it makes sense for you depends on where you actually are in your trading development, not on which option looks more exciting from a distance.</p>

<p>Both routes are legitimate. They serve different profiles at different stages. Understanding what each actually costs, what each actually demands, and where they can work together is more useful than treating them as a binary choice.</p>

<h2>The Two Routes Side by Side</h2>

<p>These are the core structural differences before any question of strategy or trading skill:</p>

<table>
<thead>
<tr><th>Factor</th><th>Prop Firm Route</th><th>Personal Account Route</th></tr>
</thead>
<tbody>
<tr><td>Upfront capital required</td><td>Challenge fee (typically £50–£500 depending on account size)</td><td>Full trading capital from your own savings</td></tr>
<tr><td>Capital you can trade</td><td>Firm's capital (£10k–£200k+ depending on challenge tier)</td><td>Your own capital only</td></tr>
<tr><td>Profit split</td><td>70–90% to trader, 10–30% to firm</td><td>100% to trader</td></tr>
<tr><td>Rules and constraints</td><td>Strict: daily drawdown limits, max drawdown, no news trading, minimum trading days</td><td>Self-imposed: only the rules you choose to follow</td></tr>
<tr><td>Account ownership</td><td>You trade the firm's capital; the account is theirs</td><td>Full ownership, full control</td></tr>
<tr><td>Risk of total loss</td><td>Challenge fee if you fail; no personal capital at risk beyond that</td><td>Personal capital at risk; no external rules to protect you from yourself</td></tr>
</tbody>
</table>

<h2>The Real Cost of the Prop Firm Route</h2>

<p>The challenge fee is only the visible cost. The less visible cost is what happens if you fail: the fee is gone, and if you want to try again, you pay it again. Traders who attempt the same tier multiple times before passing can accumulate fees that represent a meaningful outlay, particularly at the higher account size tiers where fees are larger.</p>

<p>The rules are also tighter than most traders realise before attempting an evaluation. Daily drawdown limits, maximum overall drawdown, restrictions on holding positions during high-impact news events, minimum trading day requirements: these are not designed to trip you up, but they create a compliance layer on top of the trading itself that requires active management. A perfectly executed trading strategy can still produce a breach on a day where position sizing was slightly aggressive and the market moved quickly.</p>

<p>The psychological environment is different too. Trading under evaluation conditions, knowing that one bad day can end the attempt, creates pressure that does not exist when trading your own capital at your own pace. That pressure is a genuine variable in trading performance and should be factored into the decision rather than dismissed.</p>

<h2>The Real Cost of the Personal Account Route</h2>

<p>Trading your own capital is slower in terms of reaching meaningful size, because capital growth depends entirely on compounding returns from a starting balance you fund yourself. There is no shortcut to scale.</p>

<p>The upside is complete freedom. No daily drawdown limits beyond those you impose yourself. No minimum trading day requirements. No constraints on which instruments you can trade or when. If you want to stay flat through a volatile week, you can. If you want to adapt your strategy to a change in market conditions without worrying about evaluation compliance, you can do that too.</p>

<p>The risk is the absence of external structure. Prop firm rules, for all their constraints, do impose a risk management framework on top of whatever you are doing. Trading your own capital removes that external check. If you do not have a robust internal risk management framework, the freedom of a personal account can work against you rather than for you.</p>

<h2>A Decision Framework</h2>

<p>The right choice depends on three questions. Answer them honestly rather than in the direction of the option that appeals more:</p>

<p><strong>How proven is your strategy?</strong> A strategy that has not been forward-tested in live conditions, or that has only been tested for a short period, is not ready for a prop firm evaluation. The additional pressure of evaluation conditions is likely to expose weaknesses that would not be visible on a personal demo or small live account. If the strategy is genuinely tested and documented, the evaluation environment is manageable. If it is not, the fee is almost certainly lost.</p>

<p><strong>How much capital do you have available?</strong> If your available capital is genuinely limited, a prop firm evaluation offers access to larger size at the cost of a fee and a set of rules. If you have adequate capital to trade your strategy at a meaningful size, the personal account route may offer a better starting environment for the same capital commitment.</p>

<p><strong>How do you respond to external constraints?</strong> Some traders perform better under clear, externally-imposed rules. Others find that compliance requirements distort their decision-making in ways that reduce performance. Be honest about which description fits you before paying for an evaluation.</p>

<h2>Can the Two Work Together</h2>

<p>The framing of prop firm versus personal account as a binary choice misses the most sensible approach for many traders: build and prove a strategy on a personal account first, then pursue funded evaluation once the strategy has a documented track record.</p>

<p>A personal account at small size, run for six to twelve months with a proper trade log and consistent results, provides the evidence base for approaching an evaluation with confidence rather than hope. The evaluation becomes the scaling mechanism for a strategy you already know works, rather than a test of an untested hypothesis under pressure.</p>

<blockquote>A prop firm challenge looks like a shortcut to bigger size sooner. For a trader with a proven strategy, it is. For a trader without one, it is an expensive way to find out that the strategy was not ready. The difference between those two situations is a trade log and a track record.</blockquote>

<h2>Frequently Asked Questions</h2>

<h3>Is a prop firm challenge worth attempting if you do not yet have a tested strategy?</h3>
<p>No. Prop firm evaluations are not the place to test whether a strategy works. They are the place to demonstrate, under structured conditions, that a strategy that already works can be applied consistently within a defined risk framework. Attempting an evaluation with an untested strategy is almost always a losing bet on the challenge fee, regardless of how confident you feel going in.</p>

<h3>What happens to the challenge fee if you fail the evaluation?</h3>
<p>The fee is non-refundable in all cases from every firm we are aware of. Some firms offer a fee rebate on your first funded withdrawal, but this only applies if you pass, which means it does not affect the downside calculation for a failed attempt. Factor the fee as a cost of the attempt, not a deposit to be returned.</p>

<h3>Can you run a personal account and a prop firm evaluation at the same time?</h3>
<p>Yes, and for many traders this is the sensible approach. Running a personal account at small size and an evaluation simultaneously lets you apply the same strategy in both environments, which provides useful data about whether your execution holds under the added compliance and psychological pressure of the evaluation. Just ensure your position sizing on each account is treated independently and appropriately for the capital at stake.</p>

<p>Drawdown covers both routes in depth. The prop firm comparison tool helps you evaluate which firms have rules that match how you actually trade, and the risk calculator is built to help you manage position sizing within the constraints of funded evaluation accounts. Both are free to use.</p>`;

// Resolve Pete's author
console.log('\n🔍  Resolving author profile...');
const { data: authors, error: authorFetchError } = await supabase
  .from('author_profiles').select('id, name').limit(1);
if (authorFetchError || !authors || authors.length === 0) {
  console.error('❌  Could not find author profile.'); process.exit(1);
}
const authorId = authors[0].id;
console.log(`✅  Using author: ${authors[0].name} (${authorId})`);

// Check slug
console.log(`\n🔍  Checking if slug "${SLUG}" already exists...`);
const { data: existing } = await supabase.from('blog_posts').select('id, slug').eq('slug', SLUG).maybeSingle();
if (existing) { console.warn(`⚠️   Slug "${SLUG}" already exists. Skipping.`); process.exit(0); }

// Insert post
console.log('\n📝  Inserting blog post...');
const { data: post, error: postError } = await supabase
  .from('blog_posts').insert({
    slug: SLUG,
    title: 'Prop Firm vs Funding Your Own Account: Which Should You Start With?',
    subtitle: 'A prop firm challenge looks like a shortcut to trading bigger size sooner. It is a trade-off, not a cheat code. Here is how to decide which route is actually right for where you are.',
    eyebrow: 'FROM PETE',
    category: 'Risk Management',
    body: BODY_HTML,
    hero_image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80',
    hero_image_alt: 'Two paths diverging — a visual metaphor for the prop firm vs personal account decision',
    read_time: '8 min read',
    published_at: publishedAt,
    is_published: true,
    dark_background: true,
    author_id: authorId,
    related_post_slugs: ['prop-firm-honest-review', 'can-you-make-a-living-trading', 'demo-vs-live-account-when-ready'],
  }).select('id').single();
if (postError) { console.error(`❌  Insert failed: ${postError.message}`); process.exit(1); }
const postId = post.id;
console.log(`✅  blog_posts created. id=${postId}`);

// Insert SEO
console.log('\n📝  Inserting SEO record...');
const { error: seoError } = await supabase.from('blog_post_seo').insert({
  post_id: postId,
  meta_title: 'Prop Firm vs Funding Your Own Account: Which to Start With? | Drawdown',
  meta_description: 'Weighing up a prop firm evaluation against saving and trading your own capital, including the real cost, risk and upside trade-offs of each route.',
  og_title: 'Prop Firm vs Funding Your Own Account: Which Should You Start With?',
  og_description: 'A prop firm challenge looks like a shortcut to bigger size sooner. It is a trade-off, not a cheat code. Here is how to decide.',
  og_image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80',
  canonical_url: `https://drawdown.trading/blog/${SLUG}`,
  schema_type: 'BlogPosting',
  no_index: false,
  focus_keyword: 'prop firm vs personal trading account',
});
if (seoError) { console.warn(`⚠️   SEO failed: ${seoError.message}`); }
else { console.log('✅  blog_post_seo created.'); }

console.log(`\n🎉  Done!\n    Slug:  ${SLUG}\n    ID:    ${postId}\n    URL:   https://drawdown.trading/blog/${SLUG}\n`);
