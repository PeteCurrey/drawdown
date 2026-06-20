/**
 * apply-schema.mjs
 * Applies the blog CMS schema to Supabase using the Management API.
 * Requires SUPABASE_ACCESS_TOKEN (personal access token) OR falls back
 * to running the SQL via individual statements using the Postgres REST API.
 *
 * Run: node scripts/apply-schema.mjs
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dotenv = await import('dotenv');
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PROJECT_REF = SUPABASE_URL.replace('https://', '').replace('.supabase.co', '');
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN; // optional PAT

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Missing env vars');
  process.exit(1);
}

const sqlFile = join(__dirname, '..', 'supabase', 'migrations', '20260620200000_blog_cms.sql');
const fullSQL = readFileSync(sqlFile, 'utf-8');

console.log(`\n🔧 Applying schema to project: ${PROJECT_REF}\n`);

// ── Strategy 1: Management API (needs PAT) ──────────────────────────────────
async function tryManagementAPI() {
  const token = ACCESS_TOKEN || SERVICE_KEY;
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: fullSQL }),
    }
  );
  if (res.ok) {
    console.log('✅ Schema applied via Management API');
    return true;
  }
  const body = await res.text();
  console.log(`   Management API: ${res.status} — ${body.slice(0, 120)}`);
  return false;
}

// ── Strategy 2: pg connection string via Supabase's PSQL-style REST ─────────
// Supabase exposes a REST endpoint that can run raw SQL when using service role
async function tryDirectSQL() {
  // Supabase REST API doesn't natively support DDL, but we can use the
  // undocumented /rest/v1/ approach with rpc if exec_sql exists.
  // Try creating a helper function first via a raw POST.
  
  // Actually, the cleanest non-PAT approach: use the Supabase Postgres
  // connection string with pg package
  try {
    const pg = await import('pg').catch(() => null);
    if (!pg) {
      console.log('   pg package not available');
      return false;
    }
    
    // Supabase connection string (session mode pooler)
    const connStr = `postgresql://postgres.${PROJECT_REF}:${SERVICE_KEY}@aws-0-eu-west-2.pooler.supabase.com:5432/postgres`;
    const client = new pg.default.Client({ connectionString: connStr, ssl: { rejectUnauthorized: false } });
    await client.connect();
    await client.query(fullSQL);
    await client.end();
    console.log('✅ Schema applied via direct pg connection');
    return true;
  } catch (err) {
    console.log(`   Direct pg: ${err.message}`);
    return false;
  }
}

// ── Strategy 3: Print instructions if all else fails ────────────────────────
function printInstructions() {
  console.log('\n' + '═'.repeat(70));
  console.log('⚠️  MANUAL STEP REQUIRED — 30 seconds to complete');
  console.log('═'.repeat(70));
  console.log('\n1. Go to: https://supabase.com/dashboard/project/' + PROJECT_REF + '/sql/new');
  console.log('\n2. Click "New query"');
  console.log('\n3. Paste and run the SQL from:');
  console.log('   ' + sqlFile);
  console.log('\n4. After running, come back here and press Enter to continue seeding.\n');
}

// ── Run strategies ──────────────────────────────────────────────────────────
let applied = await tryManagementAPI();
if (!applied) applied = await tryDirectSQL();

if (!applied) {
  printInstructions();
  // Wait for user to confirm
  await new Promise(resolve => {
    process.stdin.resume();
    process.stdin.once('data', resolve);
  });
  process.stdin.pause();
}

// ── Verify tables exist ─────────────────────────────────────────────────────
console.log('\n🔍 Verifying tables...');
const { createClient } = await import('@supabase/supabase-js');
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const checks = ['author_profiles', 'blog_posts', 'blog_post_seo'];
let allGood = true;
for (const table of checks) {
  const { error } = await supabase.from(table).select('id').limit(1);
  if (error) {
    console.log(`   ❌ ${table}: ${error.message}`);
    allGood = false;
  } else {
    console.log(`   ✅ ${table}`);
  }
}

if (!allGood) {
  console.log('\n❌ Tables still missing. Please run the SQL manually in the Supabase dashboard,');
  console.log('   then run: node scripts/seed-blog-posts.mjs\n');
  process.exit(1);
}

console.log('\n✅ All tables ready. Running seed script...\n');

// ── Chain into seed ─────────────────────────────────────────────────────────
const { execSync } = await import('child_process');
try {
  execSync('node scripts/seed-blog-posts.mjs', {
    cwd: join(__dirname, '..'),
    stdio: 'inherit'
  });
} catch (err) {
  console.error('Seed failed:', err.message);
  process.exit(1);
}
