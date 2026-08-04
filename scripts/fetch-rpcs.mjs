import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function fetchRpcs() {
  const url = `${SUPABASE_URL}/rest/v1/?apikey=${SERVICE_ROLE_KEY}`;
  const res = await fetch(url);
  const spec = await res.json();
  
  const paths = Object.keys(spec.paths || {});
  const rpcs = paths.filter(p => p.startsWith('/rpc/'));
  console.log('Available RPCs:');
  console.log(rpcs);
}

fetchRpcs().catch(console.error);
