/**
 * seed-post-is-forex-trading-safe.mjs
 * Run with: node scripts/seed-post-is-forex-trading-safe.mjs
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

const SLUG = 'is-forex-trading-safe';
const publishedAt = new Date('2026-07-11T09:00:00Z').toISOString();

const BODY_HTML = `<p>"Safe" is the wrong word for forex trading, and using it tends to produce either false reassurance or unnecessary alarm depending on which direction the question is coming from. The better question is what FCA regulation actually protects you from, and what it never could. Those are two very different things, and conflating them is how traders end up either complacent about real risks or deterred by imaginary ones.</p>

<p>The honest answer is that forex trading through an FCA-regulated UK broker carries meaningful, genuine protections that matter. It also carries risks that regulation cannot and does not attempt to address. Both are worth understanding clearly before you open an account.</p>

<h2>What FCA Regulation Actually Protects You From</h2>

<p>FCA authorisation requires brokers to meet specific standards that protect retail clients in ways that unregulated brokers are not required to match.</p>

<p><strong>Client money segregation</strong> is the most fundamental protection. FCA-regulated brokers are required to hold your funds in accounts that are separate from the firm's own operating capital. If the broker fails as a business, your money is not part of the firm's assets available to creditors. This does not guarantee you get all your money back — it means your funds are protected from the broker's financial failure in a way that they would not be if funds were commingled.</p>

<p><strong>Conduct standards</strong> require regulated brokers to treat customers fairly, provide best execution, disclose conflicts of interest, and publish client loss rates. These are enforceable obligations, not voluntary commitments.</p>

<p><strong>FSCS compensation</strong> provides an additional safety net. If a regulated firm fails and cannot return client funds, the Financial Services Compensation Scheme covers eligible claimants. [VERIFY: check current FSCS compensation limit for investment products on the FSCS website before publishing — the figure changes periodically.] This protection applies to the firm's failure, not to trading losses.</p>

<p><strong>Leverage limits</strong> for retail clients are capped by FCA rules. [VERIFY: confirm current FCA retail leverage limits for major pairs on the FCA website before publishing, as they are subject to regulatory review.] These caps exist specifically because unregulated leverage was identified as a primary driver of retail client losses.</p>

<p><strong>Negative balance protection</strong> for retail clients means you cannot lose more than the funds in your trading account. This is a specific, meaningful protection. We will cover it separately below because it deserves its own explanation.</p>

<h2>What Regulation Does Not Protect You From</h2>

<p>Regulation does not protect you from market risk. If you open a trade and the market moves against you, you lose money. No regulatory framework changes that. The market does not care about your FCA authorisation status.</p>

<p>Regulation does not protect you from your own decision-making. If you overtrade, size positions too large for your account, revenge trade after a loss, or ignore your own rules, regulation provides no backstop for the consequences of those decisions.</p>

<p>Regulation does not guarantee solvency. The FSCS covers eligible claims up to a limit if a firm fails, but it does not prevent firms from failing or guarantee full recovery of all funds in all circumstances.</p>

<p>And regulation does not protect you from choosing an unregulated broker. That choice removes all the protections above. This matters because unregulated offshore brokers often appear legitimate and can be difficult to distinguish from regulated ones without checking the FCA Register directly.</p>

<table>
<thead>
<tr><th>Protection</th><th>Covered by FCA regulation</th><th>Not covered by regulation</th></tr>
</thead>
<tbody>
<tr><td>Broker insolvency risk</td><td>Client money segregation, FSCS (up to limit)</td><td>—</td></tr>
<tr><td>Broker conduct</td><td>Conduct standards, best execution rules</td><td>—</td></tr>
<tr><td>Leverage limits</td><td>FCA retail leverage caps</td><td>—</td></tr>
<tr><td>Negative balance</td><td>Mandatory negative balance protection for retail clients</td><td>—</td></tr>
<tr><td>Market risk</td><td>—</td><td>Not regulated; your risk entirely</td></tr>
<tr><td>Your own execution decisions</td><td>—</td><td>Not regulated; your risk entirely</td></tr>
<tr><td>Poor trading outcomes from strategy</td><td>—</td><td>Not regulated; your risk entirely</td></tr>
</tbody>
</table>

<h2>Negative Balance Protection: What It Actually Means</h2>

<p>Negative balance protection is a specific rule that prevents retail clients from losing more than the total funds deposited in their trading account. Without it, a fast-moving market event or a highly leveraged position could theoretically result in losses exceeding your account balance, leaving you owing money to the broker.</p>

<p>For UK retail clients trading through FCA-regulated brokers, this is mandatory. If a series of losses or a market gap event depletes your account and pushes it below zero, the broker is required to absorb the negative balance rather than pursuing you for the deficit. Your maximum loss is capped at what you deposited.</p>

<p>This is a genuinely meaningful protection. Historically, events such as the Swiss franc shock in 2015 resulted in retail clients at some unregulated or less-protected brokers ending up with negative balances and owing money to their broker. FCA-regulated retail accounts now have a structural protection against that outcome.</p>

<p>It does not mean your losses are capped at zero. It means your losses are capped at your account balance. You can still lose everything you deposited.</p>

<h2>Regulated Broker as the Starting Point, Not the Finish Line</h2>

<p>Choosing an FCA-regulated broker is the non-negotiable first step in any sensible approach to forex trading in the UK. It is not, by itself, a guarantee of a good outcome or a substitute for risk management. It is the minimum standard, not the complete picture.</p>

<p>Verifying a broker's FCA authorisation status takes two minutes on the FCA Register. Check it before opening any account, even if the broker appears established and legitimate. The register shows current authorisation status, any restrictions on the firm's permissions, and any complaints or enforcement action on record.</p>

<blockquote>"Safe" is the wrong word for forex trading. The right question is what is specifically protected and what is specifically your responsibility. Regulation provides a meaningful framework around the broker side of the relationship. The trading side remains entirely your risk, and no amount of regulatory protection changes that.</blockquote>

<h2>The Risk That Is Entirely on the Trader</h2>

<p>The single largest driver of retail forex losses is not broker misconduct, platform failure, or regulatory gaps. It is leverage used without a corresponding risk management framework. A retail trader who deposits £2,000 and opens positions at the maximum available leverage, without defined stop losses or position sizing rules, has created a situation where normal market movement can produce account-threatening losses. Regulation caps the maximum leverage available. It does not manage the leverage you choose to use within that cap.</p>

<p>Position sizing, risk per trade, stop loss placement, and maximum account drawdown rules are the trader's responsibility. They are not provided by the broker, mandated by the FCA, or covered by any regulatory framework. They are what makes the difference between an account that survives losing periods and one that does not.</p>

<h2>Frequently Asked Questions</h2>

<h3>Can a UK retail trader lose more than their account balance in forex trading?</h3>
<p>No, provided they are trading through an FCA-regulated broker. Negative balance protection is mandatory for retail clients at FCA-regulated firms. If losses exceed the account balance due to leverage or a market gap event, the broker is required to absorb the negative balance. Traders at unregulated offshore brokers do not have this protection and can in principle owe money to their broker beyond their initial deposit.</p>

<h3>What does negative balance protection actually cover?</h3>
<p>It covers the scenario where your account balance is driven below zero by losses on open positions, including during fast-moving market events where slippage may take a position past a stop loss. The protection means your liability to the broker is capped at your deposited funds. It does not protect you from losses up to that level. You can still lose your entire account balance.</p>

<h3>Is unregulated forex trading ever a reasonable choice for a UK trader?</h3>
<p>No. Unregulated brokers operating offshore remove client money segregation requirements, FSCS eligibility, conduct standards, and negative balance protection. The regulatory framework exists specifically because retail forex trading without these protections has a poor documented outcome for the majority of participants. There is no benefit to a UK retail trader from choosing an unregulated broker that justifies the removal of these protections.</p>

<p>Drawdown's broker comparison tool covers only FCA-regulated brokers. Every comparison on the site starts from the assumption that regulation is non-negotiable, not a filter to be applied optionally. Find a regulated broker that fits how you trade.</p>`;

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
    title: 'Is Forex Trading Safe? What Regulation Actually Protects You From',
    subtitle: '"Safe" is the wrong word for forex trading. The better question is what FCA regulation actually protects you from, and what it never could.',
    eyebrow: 'FROM PETE',
    category: 'UK Trading',
    body: BODY_HTML,
    hero_image_url: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=1200&q=80',
    hero_image_alt: 'UK regulatory documents and financial compliance materials',
    read_time: '8 min read',
    published_at: publishedAt,
    is_published: true,
    dark_background: true,
    author_id: authorId,
    related_post_slugs: ['spread-betting-vs-cfds', 'uk-trading-tax-guide', 'do-you-need-a-licence-to-trade'],
  }).select('id').single();
if (postError) { console.error(`❌  Insert failed: ${postError.message}`); process.exit(1); }
const postId = post.id;
console.log(`✅  blog_posts created. id=${postId}`);

// Insert SEO
console.log('\n📝  Inserting SEO record...');
const { error: seoError } = await supabase.from('blog_post_seo').insert({
  post_id: postId,
  meta_title: 'Is Forex Trading Safe? What FCA Regulation Actually Protects | Drawdown',
  meta_description: 'What FCA regulation genuinely protects UK forex traders from, what it does not, and the real risks that no amount of regulation removes.',
  og_title: 'Is Forex Trading Safe? What Regulation Actually Protects You From',
  og_description: '"Safe" is the wrong word. The right question is what FCA regulation specifically protects and what remains entirely your risk.',
  og_image_url: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=1200&q=80',
  canonical_url: `https://drawdown.trading/blog/${SLUG}`,
  schema_type: 'BlogPosting',
  no_index: false,
  focus_keyword: 'is forex trading safe',
});
if (seoError) { console.warn(`⚠️   SEO failed: ${seoError.message}`); }
else { console.log('✅  blog_post_seo created.'); }

console.log(`\n🎉  Done!\n    Slug:  ${SLUG}\n    ID:    ${postId}\n    URL:   https://drawdown.trading/blog/${SLUG}\n`);
