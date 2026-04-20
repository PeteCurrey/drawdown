require('dotenv').config({ path: '.env.local' });
require('dotenv').config(); // Fallback to .env
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function upgradeUser(email) {
  try {
    // We need to find the user ID. Since we are using Service Role, we can use the Admin API
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      console.error("Error fetching users:", userError);
      return;
    }

    const targetUser = users.find(u => u.email === email);

    if (!targetUser) {
      console.error(`User with email ${email} not found.`);
      return;
    }

    console.log(`Found user ${targetUser.id} for email ${email}. Upgrading tier...`);

    const { data, error } = await supabase
      .from('profiles')
      .update({ subscription_tier: 'floor' })
      .eq('id', targetUser.id)
      .select();

    if (error) {
      console.error("Error updating profile:", error);
    } else {
      console.log("Successfully upgraded user profile to 'floor' tier.");
      console.log(data);
    }
  } catch (err) {
    console.error("Unexpected error:", err);
  }
}

upgradeUser('petecurrey@gmail.com');
