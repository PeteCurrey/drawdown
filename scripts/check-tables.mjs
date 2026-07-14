// Check if blog CMS tables already exist
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTables() {
  console.log('Checking if blog CMS tables exist...');
  
  const checks = [
    { table: 'author_profiles', select: 'id, name, role' },
    { table: 'blog_posts', select: 'id, slug, title, body, is_published' },
    { table: 'blog_post_seo', select: 'id, post_id, schema_type' },
  ];
  
  for (const { table, select } of checks) {
    const { data, error } = await supabase.from(table).select(select).limit(3);
    if (error) {
      console.log(`❌ ${table}: ${error.message}`);
    } else {
      console.log(`✅ ${table}: exists (${data.length} rows found)`);
      if (data.length > 0) {
        console.log(`   Sample: ${JSON.stringify(data[0]).substring(0, 100)}`);
      }
    }
  }
}

checkTables().catch(console.error);
