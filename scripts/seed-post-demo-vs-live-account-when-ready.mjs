/**
 * seed-post-demo-vs-live-account-when-ready.mjs
 * Run with: node scripts/seed-post-demo-vs-live-account-when-ready.mjs
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

const SLUG = 'demo-vs-live-account-when-ready';
const publishedAt = new Date('2026-07-07T09:00:00Z').toISOString();

const BODY_HTML = `<p>The most common reason traders move from a demo account to a live account is not readiness. It is boredom. Two weeks of profitable demo trading, an impatience with the lack of real stakes, a sense that the only way to know if you are ready is to try it with real money: these are the feelings that drive most switches, and they are not a reliable guide to whether the switch is the right call.</p>

<p>The signs of genuine readiness are specific. They are not about how you feel when things are going well on demo. They are about whether your process holds up when it is under pressure, even simulated pressure, and whether you have documented evidence to back up what you believe about your own trading.</p>

<h2>Why Two Profitable Weeks on Demo Is Not the Test</h2>

<p>Demo accounts remove the two factors that most significantly affect trading psychology: real financial consequence and real emotional state. When there is no real money at stake, the physiological response to a losing trade is categorically different from what happens when you watch the same loss in a live account. Cortisol levels, decision speed, tolerance for sitting in a losing position, and the temptation to exit a winning trade early all change when the money is real.</p>

<p>Two weeks of profitable demo trading tells you one useful thing: your strategy is capable of producing positive results in current market conditions. It does not tell you whether you can apply it consistently under real psychological pressure, which is the thing that actually determines live account performance.</p>

<p>The psychological gap between demo and live is real and well-documented. Most traders who have made the switch report a measurable drop in performance immediately after going live, even when nothing about their strategy changes. Some recover it quickly. Others find that the gap reveals habits that did not surface on demo: holding losers longer, cutting winners early, overtrading on volatile days.</p>

<h2>The Readiness Signs That Actually Matter</h2>

<p>Readiness is not a feeling. It is an evidence base. These are the things that tell you the switch has a reasonable foundation:</p>

<table>
<thead>
<tr><th>Readiness factor</th><th>Not ready</th><th>Ready</th></tr>
</thead>
<tbody>
<tr><td>Sample size</td><td>Fewer than 50 demo trades, or no trade log</td><td>100+ demo trades with results logged and reviewed</td></tr>
<tr><td>Consistency</td><td>Win rate and metrics vary significantly week to week</td><td>Stable performance metrics across at least 8 weeks</td></tr>
<tr><td>Plan adherence</td><td>Some trades taken outside the defined plan</td><td>Followed the plan on 90% or more of demo trades</td></tr>
<tr><td>Drawdown response</td><td>Increased size or abandoned rules after losses on demo</td><td>Maintained defined rules through losing periods on demo</td></tr>
<tr><td>Reason for switching</td><td>Boredom, impatience, or feeling ready without evidence</td><td>Evidence of consistent results across a meaningful sample</td></tr>
</tbody>
</table>

<p>If the answer to most of these is in the not-ready column, the switch is premature regardless of how the last two weeks felt. The discomfort of that conclusion is part of the test.</p>

<h2>The Biggest Reason Traders Switch Too Early</h2>

<p>Boredom disguised as confidence is the most reliable predictor of a premature switch from demo to live. It feels, from the inside, like you have learned what you need to learn and that the only remaining variable is the psychological one you can only address by experiencing it for real. There is some truth in that reasoning, which is what makes it dangerous.</p>

<p>The actual problem is that boredom on demo is often a signal that the process is working rather than that you are ready to leave it. If you are following a defined plan, taking trades only when your criteria are met, and waiting through sessions where no criteria trigger, demo will sometimes feel slow. That is what discipline feels like when conditions do not suit your strategy. It is not a sign that demo has run its course.</p>

<blockquote>Most traders do not switch to live trading because they are ready. They switch because they are bored of demo. Those two things feel identical from the inside, which is precisely what makes boredom so effective at producing premature switches. The test is not how you feel during a good run. It is whether the evidence in your trade log justifies it.</blockquote>

<h2>A Practical Bridge Between Demo and Full Live Trading</h2>

<p>The sharpest version of the demo-to-live transition is also the riskiest: switching directly from demo to the position size you intend to trade live at full size. There is a better option: using micro position sizes in a live account as the bridge between the two environments.</p>

<p>Opening a live account and trading with 10% of your intended position size achieves two things that demo cannot. It reintroduces real financial consequence, the psychological variable that demo cannot replicate, while keeping the actual pound value of losses small enough that a losing period does not cause meaningful financial harm.</p>

<p>The goal at this stage is not to produce income. The goal is to find out whether your demo performance holds under real psychological conditions. If it does, scale up gradually, adding position size only as the evidence from the live account justifies it. If it does not, you have learned something valuable at the cost of small losses rather than large ones.</p>

<h2>What to Do If Live Trading Immediately Falls Apart</h2>

<p>Returning to demo after a difficult start on live is not failure. It is data, and it is the correct response if the live account is revealing habits that were not visible on demo.</p>

<p>A poor live start typically reveals one of three things: the strategy has a flaw that only appears under real conditions, the execution is breaking down under psychological pressure, or the position size was too large for the emotional state to handle. All three are fixable. None of them require giving up on the activity.</p>

<p>Go back to demo with a specific focus: the habit that broke down on live. Log every trade against the plan. Identify whether the deviation was systematic (a flaw in the strategy) or behavioural (a pattern in execution). Fix the thing you found before returning to live. That process, repeated, is what builds the execution consistency that live trading actually requires.</p>

<h2>Frequently Asked Questions</h2>

<h3>How long should you realistically stay on a demo account before going live?</h3>
<p>Long enough to have 100 or more trades logged and reviewed, and to have followed your defined plan consistently across at least 8 weeks of varied market conditions. For most traders this is a minimum of three to six months. There is no upper limit: if the demo results are not consistent yet, staying longer is the right call. Time on demo is not wasted. It is the cheapest form of market education available.</p>

<h3>Should you start live trading with the same position size you used on demo?</h3>
<p>No. Start with a fraction of your intended live position size, around 10%, to reintroduce real psychological stakes gradually rather than all at once. Scale up only as the evidence from live trading confirms that your execution holds under real conditions. There is no rush to reach full size. The goal of the early live period is to confirm that demo performance transfers, not to generate maximum returns immediately.</p>

<h3>Is it normal for performance to drop when switching from demo to live?</h3>
<p>Yes, and it is well-documented. The psychological difference between demo and live affects decision-making in ways that are difficult to anticipate until you experience them. A drop in performance at the point of switching does not mean your strategy is flawed. It means the real-money psychological variables are in play for the first time. Managing that gap is a skill built through the bridge approach: small live positions, deliberate scaling, and treating the early live period as a continuation of the learning phase rather than a graduation from it.</p>

<p>The Drawdown AI Trade Journal works for both demo and live accounts. Log your demo trades before you switch, and your live trades after. The comparison between the two will show you exactly where your execution changes when the money is real, which is the most useful information available for closing that gap. Start logging today.</p>`;

// Step 1: Resolve author
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
    title: 'Demo Account vs Live Account: When You Are Actually Ready to Switch',
    subtitle: 'Most traders do not switch to live trading because they are ready. They switch because they are bored of demo. Here is how to tell the difference.',
    eyebrow: 'FROM PETE',
    category: 'Psychology',
    body: BODY_HTML,
    hero_image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80',
    hero_image_alt: 'Trading platform screens showing market data and order entry panels',
    read_time: '7 min read',
    published_at: publishedAt,
    is_published: true,
    dark_background: true,
    author_id: authorId,
    related_post_slugs: ['is-trading-gambling', 'cost-of-revenge-trading', 'the-trading-routine'],
  })
  .select('id').single();
if (postError) { console.error(`❌  blog_posts insert failed: ${postError.message}`); process.exit(1); }
const postId = post.id;
console.log(`✅  blog_posts record created. id=${postId}`);

// Step 4: Insert SEO
console.log('\n📝  Inserting SEO record...');
const { error: seoError } = await supabase.from('blog_post_seo').insert({
  post_id: postId,
  meta_title: 'Demo vs Live Account: When Are You Actually Ready? | Drawdown',
  meta_description: 'The honest signs that you are ready to move from a demo account to live trading, and the most common reason traders switch too early.',
  og_title: 'Demo Account vs Live Account: When You Are Actually Ready to Switch',
  og_description: 'Most traders switch from demo to live because they are bored, not because they are ready. Here is how to tell the difference.',
  og_image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80',
  canonical_url: `https://drawdown.trading/blog/${SLUG}`,
  schema_type: 'BlogPosting',
  no_index: false,
  focus_keyword: 'demo account vs live account',
});
if (seoError) { console.warn(`⚠️   SEO insert failed: ${seoError.message}`); }
else { console.log('✅  blog_post_seo record created.'); }

console.log(`\n🎉  Done!\n    Slug:  ${SLUG}\n    ID:    ${postId}\n    URL:   https://drawdown.trading/blog/${SLUG}\n`);
