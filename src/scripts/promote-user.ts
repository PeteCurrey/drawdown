/**
 * USER PROMOTION SCRIPT
 * 
 * Usage: npx ts-node src/scripts/promote-user.ts <email>
 * 
 * This script elevates a user to the 'edge' tier (Unlimited) manually
 * using the Supabase Service Role Key.
 */

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey || supabaseUrl.includes('placeholder')) {
  console.error("ERROR: Missing or placeholder Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function promoteUser(email: string) {
  console.log(`Searching for user with email: ${email}...`);

  // 1. Find user in profiles
  const { data: profile, error: findError } = await supabase
    .from('profiles')
    .select('id, full_name, subscription_tier')
    .eq('email', email)
    .single();

  if (findError) {
    console.error(`ERROR: Could not find profile for ${email}. Ensure they have signed up first.`);
    return;
  }

  console.log(`Found profile: ${profile.full_name} (${profile.id})`);
  console.log(`Current Tier: ${profile.subscription_tier}`);

  // 2. Update Tier
  console.log(`Elevating to 'edge' tier...`);
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ 
      subscription_tier: 'edge',
      subscription_status: 'active',
      updated_at: new Date().toISOString()
    })
    .eq('id', profile.id);

  if (updateError) {
    console.error(`ERROR: Failed to update tier:`, updateError);
    return;
  }

  console.log(`SUCCESS: ${email} is now an UNLIMITED (Edge) client.`);
}

const emailArg = process.argv[2];
if (!emailArg) {
  console.log("Usage: npx ts-node src/scripts/promote-user.ts <email>");
  process.exit(0);
}

promoteUser(emailArg);
