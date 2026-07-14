// Script to apply the blog CMS migration via Supabase Management API
// Run: node scripts/apply-migration.mjs

import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const sqlPath = join(__dirname, '../supabase/migrations/20260620200000_blog_cms.sql');
const sql = readFileSync(sqlPath, 'utf-8');

// Split into individual statements (handle triggers, functions, etc.)
// We'll run the whole thing via the REST API rpc call
async function applyMigration() {
  console.log('Applying blog CMS migration...');
  
  const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
  
  if (error) {
    console.log('RPC exec_sql not available, trying individual statements...');
    // Try running individual statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    let failed = 0;
    for (const stmt of statements) {
      const { error: stmtError } = await supabase.rpc('exec_sql', { sql_query: stmt });
      if (stmtError) {
        console.error(`Statement failed: ${stmt.substring(0, 60)}... Error: ${stmtError.message}`);
        failed++;
      }
    }
    if (failed > 0) {
      console.log(`Warning: ${failed} statements failed`);
    }
  } else {
    console.log('Migration applied successfully!');
  }
  
  // Verify tables exist
  const { data: tables, error: tableError } = await supabase
    .from('author_profiles')
    .select('id')
    .limit(1);
  
  if (!tableError) {
    console.log('✅ Tables verified: author_profiles exists');
  } else {
    console.error('❌ Table check failed:', tableError.message);
    console.log('You may need to run the SQL manually in the Supabase dashboard.');
    console.log('SQL file: supabase/migrations/20260620200000_blog_cms.sql');
  }
}

applyMigration().catch(console.error);
