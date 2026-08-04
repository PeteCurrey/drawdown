import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';
import pg from 'pg';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const PROJECT_REF = SUPABASE_URL.replace('https://', '').replace('.supabase.co', '');
const user = `postgres.${PROJECT_REF}`;
const sqlPath = join(__dirname, '../supabase/migrations/20260804_add_challenge_status_to_profiles.sql');
const sql = readFileSync(sqlPath, 'utf-8');

const REGIONS = [
  'eu-west-2',     // London
  'eu-west-1',     // Ireland
  'eu-central-1',  // Frankfurt
  'us-east-1',     // N. Virginia
  'us-east-2',     // Ohio
  'us-west-1',     // N. California
  'us-west-2',     // Oregon
  'ap-southeast-1' // Singapore
];

async function applyMigration() {
  let successfulClient = null;
  let activeRegion = null;
  
  console.log(`Scanning regional poolers for Supabase project ${PROJECT_REF}...`);
  
  for (const region of REGIONS) {
    const host = `aws-0-${region}.pooler.supabase.com`;
    const connStr = `postgresql://${user}:${encodeURIComponent(SERVICE_ROLE_KEY)}@${host}:5432/postgres`;
    
    console.log(`Trying pooler in region ${region} (${host})...`);
    const client = new pg.Client({
      connectionString: connStr,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000 // fast timeout for scanning
    });
    
    try {
      await client.connect();
      console.log(`\n✅ SUCCESS! Connected to active pooler in region: ${region}`);
      successfulClient = client;
      activeRegion = region;
      break;
    } catch (err) {
      console.log(`   Region ${region} failed: ${err.message.split('\n')[0]}`);
      await client.end().catch(() => {});
    }
  }
  
  if (!successfulClient) {
    console.error('\n❌ Could not connect to any regional database pooler. Please check credentials or run the SQL in your Supabase dashboard.');
    process.exit(1);
  }
  
  try {
    console.log(`Executing schema changes on region ${activeRegion}...`);
    await successfulClient.query(sql);
    console.log('✅ Migration applied successfully via active pg pooler!');
    
    // Verify columns exist
    const verifyResult = await successfulClient.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'profiles' AND column_name IN ('challenge_status', 'challenge_prop_firm_id', 'challenge_tier');
    `);
    console.log('Verified columns on profiles table:');
    console.log(verifyResult.rows);
  } catch (error) {
    console.error('❌ Migration query failed:', error.message);
    process.exit(1);
  } finally {
    await successfulClient.end();
  }
}

applyMigration().catch(console.error);
