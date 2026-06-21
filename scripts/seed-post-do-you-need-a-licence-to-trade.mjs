/**
 * seed-post-do-you-need-a-licence-to-trade.mjs
 * Run with: node scripts/seed-post-do-you-need-a-licence-to-trade.mjs
 * Author: Drawdown Team
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

const SLUG = 'do-you-need-a-licence-to-trade';
const publishedAt = new Date('2026-07-14T09:00:00Z').toISOString();

const BODY_HTML = `<p>No. You do not need a licence to trade your own money in the UK. There is no such thing as a personal trading licence or a trading certification that UK law requires you to obtain before accessing financial markets with your own capital. You can open a regulated brokerage account and place trades without any formal qualification or accreditation.</p>

<p>The question is worth asking clearly because confusion on this point is common, and the confusion tends to come from mixing up two different things: the FCA authorisation that <em>brokers</em> must hold, and a "trading licence" that <em>individual retail traders</em> do not need and that does not exist as a concept under UK law.</p>

<h2>Why This Surprises People</h2>

<p>The confusion is understandable. Financial services is heavily regulated in the UK. Banks, brokers, investment managers, and financial advisers all require FCA authorisation. It is reasonable to assume that trading, as a financial activity, sits behind a similar gate for the individual.</p>

<p>The distinction the FCA draws is between providing a regulated financial service and engaging in regulated activity for your own account. Running a brokerage that executes other people's trades requires authorisation. Acting as an investment manager for other people's money requires authorisation. Giving regulated financial advice to other people for payment requires authorisation.</p>

<p>Trading your own money for your own account is not a regulated activity under the Financial Services and Markets Act 2000 in the way that providing those services to others is. You are a customer of a regulated service, not a provider of one. The regulatory requirements apply to the broker, not to you.</p>

<h2>When It Changes</h2>

<p>The picture changes as soon as the activity moves from trading your own capital to doing something financial for, or on behalf of, other people.</p>

<p><strong>Managing other people's money</strong> triggers regulatory requirements immediately. If you are making investment decisions on behalf of clients and receiving payment for doing so, you are operating as a discretionary investment manager. This requires FCA authorisation. The threshold for "managing investments" is not high: informal arrangements where you make trading decisions on behalf of friends or family members for payment can fall within the regulatory perimeter.</p>

<p><strong>Running a collective investment scheme or fund</strong> similarly requires authorisation. If you are pooling capital from multiple investors and trading on their behalf, the activity is regulated regardless of the size of the fund.</p>

<p><strong>Providing financial advice</strong> in a regulated sense requires authorisation. This means recommending specific regulated investments to specific people, not general financial commentary or education. The FCA's guidance on the distinction between regulated advice and general financial information is worth reading if you are creating public content that touches on financial products. [VERIFY: check current FCA guidance on the advice/guidance boundary before publishing, as the regulatory perimeter guidance is periodically updated.]</p>

<p><strong>Prop firm employment</strong> is a specific case. If a prop firm employs you as a trader rather than funding you through an evaluation model, and particularly if they are FCA-regulated in their business activities, they may require employees to hold relevant regulatory qualifications such as those administered by the Chartered Institute for Securities and Investment (CISI). This applies to employed professional traders, not to self-funded or prop firm challenge participants.</p>

<table>
<thead>
<tr><th>Activity</th><th>Licence or authorisation required?</th></tr>
</thead>
<tbody>
<tr><td>Trading your own money on your own account</td><td>No. No personal licence required.</td></tr>
<tr><td>Trading through a prop firm evaluation (self-funded)</td><td>No. You are a customer of the prop firm, not a regulated provider.</td></tr>
<tr><td>Managing other people's money for payment</td><td>Yes. FCA authorisation required (or work within an authorised firm).</td></tr>
<tr><td>Running a fund or pooled investment vehicle</td><td>Yes. FCA authorisation required.</td></tr>
<tr><td>Giving regulated financial advice for payment</td><td>Yes. FCA authorisation required.</td></tr>
<tr><td>Working as an employed trader at a regulated firm</td><td>Varies by firm and role. Many require CISI or equivalent qualification.</td></tr>
</tbody>
</table>

<h2>Qualifications That Help Without Being Required</h2>

<p>The absence of a legal requirement does not mean qualifications have no value. Several programmes are worth knowing about, not because they are legally necessary, but because they teach things that are actually useful:</p>

<p>The <strong>CISI Investment Operations Certificate</strong> and related qualifications cover financial markets, regulation, and investment principles. They are valued by employers in financial services and provide a structured foundation that overlaps meaningfully with what a serious independent trader needs to understand.</p>

<p>The <strong>CFA (Chartered Financial Analyst)</strong> designation is the most demanding and internationally recognised qualification in investment analysis. It covers portfolio management, financial analysis, ethics, and economics at a level of rigour that most retail trading education does not approach. It is designed for institutional asset management careers but the curriculum is genuinely educational for any serious market participant.</p>

<p>These qualifications are not gateways to retail trading. They are credentials that signal competence in financial markets to employers, counterparties, and clients. If trading forms part of a broader financial career, they are worth investigating. If you are purely a self-funded retail trader, they are useful education, not a ticket you need to obtain.</p>

<h2>The Real Gatekeeper Is Not a Licence</h2>

<p>The question of whether you need a licence to trade is less useful than the question of whether you have the process, risk management discipline, and capital to trade effectively. No qualification, certification, or licensing requirement has ever prevented a poorly prepared trader from losing money. The barrier to participation is deliberately low. The barrier to consistent profitability is very high.</p>

<blockquote>The real gatekeeper in trading is not a licence or a qualification. It is capital, risk management, and a tested process. The regulatory framework puts obligations on the broker, not on you. The discipline and preparation required to trade well are entirely your own responsibility, and no amount of professional certification substitutes for them.</blockquote>

<h2>Frequently Asked Questions</h2>

<h3>Do you need a licence to trade through a prop firm?</h3>
<p>No, for the typical prop firm evaluation model where you pay a challenge fee, pass an evaluation, and trade the firm's capital as a contractor or participant. You are using the firm's platform and capital, not providing a regulated service. Some prop firms that are themselves FCA-regulated may have specific requirements for employees in certain roles, but this is an employment relationship question, not a retail participation question.</p>

<h3>What is the actual difference between trading your own money and managing someone else's?</h3>
<p>Trading your own money is using your own capital to take market positions for your own benefit. Managing someone else's money means making investment decisions on behalf of another person or entity, typically for a fee or a share of returns. The regulatory distinction is clear: the second activity is a regulated financial service; the first is not. The line is crossed the moment you are making decisions about other people's capital, not your own.</p>

<h3>Are trading qualifications worth pursuing even though they are not legally required?</h3>
<p>Depends on your goals. If you want to work in financial services, qualifications from CISI, CFA Institute, or equivalent bodies are valuable signals to employers. If you are a self-funded retail trader with no interest in institutional employment, the same qualifications provide educational value but are not necessary. What is necessary for trading well is a tested strategy, risk management discipline, and capital appropriate to your income expectations. A qualification does not substitute for any of those, and the absence of one does not prevent you from developing them.</p>

<p>Drawdown's curriculum covers the practical knowledge relevant to retail traders: market structure, risk management, strategy development, and the psychological side of trading. It is not a qualification programme. It is structured education designed to help you build the process that actually determines trading outcomes. Phase one is free.</p>`;

// ---------------------------------------------------------------------------
// Step 1: Resolve Drawdown Team author (create if needed)
// ---------------------------------------------------------------------------
console.log('\n🔍  Resolving Drawdown Team author...');
const { data: teamAuthor } = await supabase
  .from('author_profiles').select('id, name').eq('name', 'Drawdown Team').maybeSingle();

let authorId;
if (teamAuthor) {
  authorId = teamAuthor.id;
  console.log(`✅  Found existing Drawdown Team author (${authorId})`);
} else {
  const { data: newAuthor, error: createError } = await supabase
    .from('author_profiles')
    .insert({ name: 'Drawdown Team', role: 'Editorial', bio: 'The Drawdown editorial team.', avatar_url: '' })
    .select('id').single();
  if (createError) { console.error(`❌  Failed to create author: ${createError.message}`); process.exit(1); }
  authorId = newAuthor.id;
  console.log(`✅  Created new Drawdown Team author (${authorId})`);
}

// Step 2: Check slug
console.log(`\n🔍  Checking if slug "${SLUG}" already exists...`);
const { data: existing } = await supabase.from('blog_posts').select('id, slug').eq('slug', SLUG).maybeSingle();
if (existing) { console.warn(`⚠️   Slug "${SLUG}" already exists. Skipping.`); process.exit(0); }

// Step 3: Insert post
console.log('\n📝  Inserting blog post...');
const { data: post, error: postError } = await supabase
  .from('blog_posts').insert({
    slug: SLUG,
    title: 'Do You Need a Licence or Qualification to Trade?',
    subtitle: 'No, you do not need a licence to trade your own money in the UK. The more useful question is when that stops being true.',
    eyebrow: 'EDUCATION',
    category: 'UK Trading',
    body: BODY_HTML,
    hero_image_url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80',
    hero_image_alt: 'UK regulatory documents and certificates on a desk',
    read_time: '7 min read',
    published_at: publishedAt,
    is_published: true,
    dark_background: true,
    author_id: authorId,
    related_post_slugs: ['is-forex-trading-safe', 'uk-trading-tax-guide', 'worthless-trading-courses'],
  }).select('id').single();
if (postError) { console.error(`❌  Insert failed: ${postError.message}`); process.exit(1); }
const postId = post.id;
console.log(`✅  blog_posts created. id=${postId}`);

// Step 4: Insert SEO
console.log('\n📝  Inserting SEO record...');
const { error: seoError } = await supabase.from('blog_post_seo').insert({
  post_id: postId,
  meta_title: 'Do You Need a Licence or Qualification to Trade? | Drawdown',
  meta_description: 'Whether UK retail traders need any licence or formal qualification to trade their own money, and when that changes if trading becomes a business.',
  og_title: 'Do You Need a Licence or Qualification to Trade?',
  og_description: 'No licence needed to trade your own money in the UK. Here is when that stops being true and what actually gates consistent trading outcomes.',
  og_image_url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80',
  canonical_url: `https://drawdown.trading/blog/${SLUG}`,
  schema_type: 'BlogPosting',
  no_index: false,
  focus_keyword: 'do you need a licence to trade',
});
if (seoError) { console.warn(`⚠️   SEO failed: ${seoError.message}`); }
else { console.log('✅  blog_post_seo created.'); }

console.log(`\n🎉  Done!\n    Slug:  ${SLUG}\n    ID:    ${postId}\n    URL:   https://drawdown.trading/blog/${SLUG}\n`);
