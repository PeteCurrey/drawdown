import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing credentials');
  process.exit(1);
}

async function testREST() {
  console.log(`Connecting to REST API at ${SUPABASE_URL}...`);
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  
  const { data, error } = await supabase.from('profiles').select('id, email, display_name').limit(1);
  if (error) {
    console.error('❌ REST API test failed:', error.message);
    console.error(error);
  } else {
    console.log('✅ REST API test succeeded! Found profile:', data);
  }
}

testREST().catch(console.error);
