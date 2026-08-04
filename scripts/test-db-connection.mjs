import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';
import pg from 'pg';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PROJECT_REF = SUPABASE_URL.replace('https://', '').replace('.supabase.co', '');

async function testConnection() {
  const host = `db.${PROJECT_REF}.supabase.co`;
  const port = 6543;
  const user = `postgres.${PROJECT_REF}`;
  
  console.log(`Testing connection to ${host}:${port} as user ${user}...`);
  const connStr = `postgresql://${user}:${encodeURIComponent(SERVICE_ROLE_KEY)}@${host}:${port}/postgres`;
  const client = new pg.Client({
    connectionString: connStr,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    console.log(`✅ SUCCESS! Connected to pooler on ${host}:${port}`);
    await client.end();
  } catch (err) {
    console.log(`❌ FAILED: ${err.message}`);
  }
}

testConnection().catch(console.error);
