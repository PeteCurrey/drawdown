import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import pg from 'pg';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing credentials');
  process.exit(1);
}

const PROJECT_REF = SUPABASE_URL.replace('https://', '').replace('.supabase.co', '');

// All standard Supabase AWS pooler regions
const regions = [
  'eu-west-2',      // London (default)
  'eu-west-1',      // Ireland
  'eu-central-1',   // Frankfurt
  'eu-central-2',   // Zurich
  'us-east-1',      // N. Virginia
  'us-east-2',      // Ohio
  'us-west-1',      // N. California
  'us-west-2',      // Oregon
  'ca-central-1',   // Canada Central
  'ap-southeast-1', // Singapore
  'ap-southeast-2', // Sydney
  'ap-northeast-1', // Tokyo
  'ap-northeast-2', // Seoul
  'ap-south-1',     // Mumbai
  'sa-east-1',      // Sao Paulo
];

async function scanRegions() {
  console.log(`Scanning pg pooler regions for project: ${PROJECT_REF}...`);
  
  for (const region of regions) {
    const host = `aws-0-${region}.pooler.supabase.com`;
    const user = `postgres.${PROJECT_REF}`;
    const connStr = `postgresql://${user}:${encodeURIComponent(SERVICE_ROLE_KEY)}@${host}:5432/postgres`;
    
    const client = new pg.Client({
      connectionString: connStr,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 3000 // fast timeout
    });
    
    try {
      await client.connect();
      console.log(`\n🎉 SUCCESS! Connected successfully to region: ${region} (${host})`);
      await client.end();
      return;
    } catch (err) {
      if (err.message.includes('tenant/user') || err.message.includes('not found')) {
        // Known rejection - project does not live in this region
        process.stdout.write('.');
      } else {
        // Different error (e.g. password, timeout, socket)
        console.log(`\n❓ Region ${region} returned unexpected error:`, err.message);
      }
    }
  }
  
  console.log('\n❌ Scan complete. No active region recognized our tenant.');
}

scanRegions().catch(console.error);
