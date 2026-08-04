import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

console.log('DATABASE_URL in .env.local:', process.env.DATABASE_URL);
console.log('DATABASE_URL in process.env:', process.env.DATABASE_URL);
console.log('Keys in process.env:', Object.keys(process.env).filter(k => k.includes('SUPABASE') || k.includes('ACCESS') || k.includes('TOKEN') || k.includes('KEY')));

