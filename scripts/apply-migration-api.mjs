// Apply migration using Supabase Management API
// This uses the project ref to execute SQL directly
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Extract project ref from URL: https://miiasjbonwlleggiukyf.supabase.co
const projectRef = SUPABASE_URL.replace('https://', '').replace('.supabase.co', '');

const sqlPath = join(__dirname, '../supabase/migrations/20260620200000_blog_cms.sql');
const sql = readFileSync(sqlPath, 'utf-8');

async function applyViaManagementAPI() {
  console.log(`Project ref: ${projectRef}`);
  console.log('Applying migration via Supabase Management API...');
  
  const response = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sql }),
    }
  );
  
  const text = await response.text();
  console.log(`Status: ${response.status}`);
  console.log(`Response: ${text.substring(0, 500)}`);
  
  if (!response.ok) {
    console.log('\nManagement API failed. Trying alternative approach via REST...');
    
    // Alternative: Use the pg connection string via the REST endpoint
    // Try Supabase's built-in /rest/v1/rpc approach with service role
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      db: { schema: 'public' }
    });
    
    // Try using pg via the connection pooler info
    console.log('\nThe tables need to be created manually in the Supabase Dashboard.');
    console.log('Please go to: https://supabase.com/dashboard/project/miiasjbonwlleggiukyf/sql/new');
    console.log('And run the SQL from: supabase/migrations/20260620200000_blog_cms.sql');
    return false;
  }
  
  return true;
}

applyViaManagementAPI().catch(console.error);
