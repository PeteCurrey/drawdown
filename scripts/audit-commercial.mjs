import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const { data: profiles } = await supabase.from('profiles').select('id, email, full_name, subscription_tier, subscription_status, role');
console.log('All Profiles:', JSON.stringify(profiles, null, 2));

const { data: subs } = await supabase.from('subscriptions').select('*').catch(() => ({ data: null }));
console.log('Subscriptions table:', subs);
