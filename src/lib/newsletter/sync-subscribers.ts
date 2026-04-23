import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function syncSubscribers() {
    console.log("Fetching users from auth...");
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
        console.error("Error listing users:", usersError);
        return;
    }

    console.log(`Found ${users?.length} users. Syncing to newsletter_subscribers...`);

    const subscribers = users.map(user => ({
        email: user.email
    }));

    const { data, error } = await supabase
        .from('newsletter_subscribers')
        .upsert(subscribers, { onConflict: 'email' });

    if (error) {
        console.error("Sync error:", error);
    } else {
        console.log("Successfully synced subscribers!");
    }
}

syncSubscribers();
