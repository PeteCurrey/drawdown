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

async function checkAffiliates() {
  console.log('Checking affiliate links and clicks tables...');
  
  // 1. Count links
  const { data: links, error: linksError } = await supabase
    .from('affiliate_links')
    .select('*');
    
  if (linksError) {
    console.error('❌ Error fetching affiliate_links:', linksError.message);
  } else {
    console.log(`✅ affiliate_links table exists: ${links.length} rows found.`);
    if (links.length > 0) {
      console.log('Sample links:', JSON.stringify(links.slice(0, 3), null, 2));
    }
  }

  // 2. Count clicks
  const { data: clicks, error: clicksError } = await supabase
    .from('affiliate_clicks')
    .select('count');
    
  if (clicksError) {
    console.error('❌ Error fetching affiliate_clicks:', clicksError.message);
  } else {
    console.log(`✅ affiliate_clicks table exists:`, clicks);
  }
}

checkAffiliates().catch(console.error);
