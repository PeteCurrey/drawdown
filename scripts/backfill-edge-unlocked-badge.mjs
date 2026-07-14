/**
 * backfill-edge-unlocked-badge.mjs
 * 
 * One-time script to award the edge_unlocked badge to any existing user
 * with subscription_tier IN ('edge', 'floor') who doesn't already have it.
 * 
 * Run with: node scripts/backfill-edge-unlocked-badge.mjs
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

console.log('\n🔍  Finding users with edge or floor tier...');
const { data: eligibleProfiles, error: profilesError } = await supabase
  .from('profiles')
  .select('id, subscription_tier')
  .in('subscription_tier', ['edge', 'floor']);

if (profilesError) { console.error('❌  Profiles query failed:', profilesError.message); process.exit(1); }
if (!eligibleProfiles || eligibleProfiles.length === 0) {
  console.log('ℹ️   No edge/floor users found. Nothing to backfill.');
  process.exit(0);
}

console.log(`✅  Found ${eligibleProfiles.length} eligible user(s):\n`);
eligibleProfiles.forEach(p => console.log(`    • ${p.id} (${p.subscription_tier})`));

let awarded = 0;
let skipped = 0;
let failed  = 0;

for (const profile of eligibleProfiles) {
  // Check if badge already exists
  const { data: existing } = await supabase
    .from('user_badges')
    .select('badge_key')
    .eq('user_id', profile.id)
    .eq('badge_key', 'edge_unlocked')
    .maybeSingle();

  if (existing) {
    console.log(`  ⏭   ${profile.id} — already has edge_unlocked badge, skipping`);
    skipped++;
    continue;
  }

  // Award badge
  const { error: badgeError } = await supabase
    .from('user_badges')
    .upsert(
      { user_id: profile.id, badge_key: 'edge_unlocked', awarded_at: new Date().toISOString() },
      { onConflict: 'user_id,badge_key' }
    );

  if (badgeError) {
    console.error(`  ❌  ${profile.id} — badge award failed: ${badgeError.message}`);
    failed++;
    continue;
  }

  // Create in-app notification
  try {
    await supabase.from('notifications').insert({
      user_id: profile.id,
      type: 'achievement',
      title: 'Achievement Unlocked: Edge Unlocked',
      message: 'Gained full access to the AI intelligence engine.',
      action_url: '/dashboard/profile',
    });
  } catch (_) { /* Non-fatal if notifications table has issues */ }

  console.log(`  ✅  ${profile.id} (${profile.subscription_tier}) — edge_unlocked badge awarded`);
  awarded++;
}

console.log(`\n🎉  Backfill complete.`);
console.log(`    Awarded: ${awarded}`);
console.log(`    Skipped (already had badge): ${skipped}`);
console.log(`    Failed:  ${failed}\n`);
if (failed > 0) process.exit(1);
