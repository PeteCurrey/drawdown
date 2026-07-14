/**
 * backfill-first-flight-badge.mjs
 *
 * One-time backfill: award the first_flight badge to any user who has at least
 * one row in the `trades` table (manual journal entries) or `individual_trades`
 * table (funded account imports) but does not yet have first_flight in user_badges.
 *
 * Run with: node scripts/backfill-first-flight-badge.mjs
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

console.log('\n🔍  Finding users with at least one logged trade...\n');

// Collect user IDs from trades table
const { data: tradeUsers, error: tradeErr } = await supabase
  .from('trades')
  .select('user_id');

if (tradeErr) { console.error('❌  trades query failed:', tradeErr.message); process.exit(1); }

// Collect user IDs from individual_trades table
const { data: indivUsers, error: indivErr } = await supabase
  .from('individual_trades')
  .select('user_id');

if (indivErr) { console.warn('⚠️   individual_trades query failed (table may not exist):', indivErr.message); }

// De-duplicate
const userSet = new Set([
  ...(tradeUsers ?? []).map((r) => r.user_id),
  ...(indivUsers ?? []).map((r) => r.user_id),
].filter(Boolean));

if (userSet.size === 0) {
  console.log('ℹ️   No users with logged trades found. Nothing to backfill.');
  process.exit(0);
}

console.log(`✅  Found ${userSet.size} user(s) with trade history:\n`);
[...userSet].forEach(id => console.log(`    • ${id}`));
console.log('');

let awarded = 0;
let skipped = 0;
let failed  = 0;

for (const userId of userSet) {
  // Check whether badge already exists
  const { data: existing } = await supabase
    .from('user_badges')
    .select('badge_key')
    .eq('user_id', userId)
    .eq('badge_key', 'first_flight')
    .maybeSingle();

  if (existing) {
    console.log(`  ⏭   ${userId} — already has first_flight, skipping`);
    skipped++;
    continue;
  }

  // Determine the earliest trade timestamp to anchor the awarded_at date
  const { data: earliestTrade } = await supabase
    .from('trades')
    .select('created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  const awardedAt = earliestTrade?.created_at ?? new Date().toISOString();

  const { error: badgeErr } = await supabase
    .from('user_badges')
    .upsert(
      { user_id: userId, badge_key: 'first_flight', awarded_at: awardedAt },
      { onConflict: 'user_id,badge_key' }
    );

  if (badgeErr) {
    console.error(`  ❌  ${userId} — badge award failed: ${badgeErr.message}`);
    failed++;
    continue;
  }

  // Non-fatal notification
  try {
    await supabase.from('notifications').insert({
      user_id: userId,
      type: 'achievement',
      title: 'Achievement Unlocked: First Flight',
      message: 'You logged your first trade entry.',
      action_url: '/dashboard/profile',
    });
  } catch (_) { /* notifications table optional */ }

  console.log(`  ✅  ${userId} — first_flight awarded (anchored to ${awardedAt})`);
  awarded++;
}

console.log(`\n🎉  Backfill complete.`);
console.log(`    Awarded: ${awarded}`);
console.log(`    Skipped (already had badge): ${skipped}`);
console.log(`    Failed:  ${failed}\n`);
if (failed > 0) process.exit(1);
