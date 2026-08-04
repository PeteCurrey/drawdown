import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PROJECT_REF = SUPABASE_URL.replace('https://', '').replace('.supabase.co', '');

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const sqlPath = join(__dirname, '../supabase/migrations/20260804_add_cohort_accelerator_model.sql');
const sql = readFileSync(sqlPath, 'utf-8');

async function applyViaManagementAPI() {
  console.log(`Project ref: ${PROJECT_REF}`);
  console.log('Applying Institutional Accelerator migration via Supabase Management API...');
  
  const response = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
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
  console.log(`Response: ${text.substring(0, 1000)}`);
  
  if (response.ok) {
    console.log('✅ SQL migration executed successfully via Management API!');
  } else {
    console.error('❌ Management API SQL execution failed.');
  }
}

applyViaManagementAPI().catch(console.error);
