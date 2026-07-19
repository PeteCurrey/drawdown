import * as dotenv from 'dotenv';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

// Import all data
import { BEST_OF_PAGES } from '../src/data/seo/best';
import { COMPARISON_PAGES } from '../src/data/seo/compare';
import { HOW_TO_PAGES } from '../src/data/seo/howto';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Supabase URL or Key is missing from .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function main() {
  console.log('Starting migration...');

  // Combine all items with their source type
  const allItems = [
    ...BEST_OF_PAGES.map((item: any) => ({ ...item, _source: 'best' })),
    ...COMPARISON_PAGES.map((item: any) => ({ ...item, _source: 'compare' })),
    ...HOW_TO_PAGES.map((item: any) => ({ ...item, _source: 'how_to' })),
  ];

  console.log(`Total items to migrate: ${allItems.length}`);

  const slugCounts: Record<string, number> = {};
  const duplicates: string[] = [];
  const insertedCount = 0;
  
  for (const item of allItems) {
    const originalSlug = item.slug;
    let finalSlug = originalSlug;

    // Track slug occurrences
    if (slugCounts[originalSlug]) {
      slugCounts[originalSlug]++;
      finalSlug = `${originalSlug}-duplicate-${slugCounts[originalSlug]}`;
      if (!duplicates.includes(originalSlug)) {
        duplicates.push(originalSlug);
      }
    } else {
      slugCounts[originalSlug] = 1;
    }

    // Determine page_type based on the source array or properties
    let pageType = 'how_to'; // Default fallback
    if (item._source === 'best') {
      pageType = 'best_of';
    } else if (item._source === 'compare') {
      pageType = 'compare';
    } else if (item._source === 'how_to') {
      pageType = 'how_to';
    }

    const { _source, ...contentData } = item;

    // Map to DB fields
    const record = {
      page_type: pageType,
      slug: finalSlug,
      title: item.title,
      seo_title: item.title,
      seo_description: item.metaDescription || '',
      content: JSON.stringify(contentData), // store full json in content or content_jsonb if available, wait the schema says `content TEXT`
      is_published: false,
      target_keywords: item.targetKeywords || [],
    };

    const { error } = await supabase.from('seo_pages').insert(record);
    if (error) {
      console.error(`Error inserting ${finalSlug}:`, error.message);
    } else {
      console.log(`Inserted: ${finalSlug}`);
    }
  }

  console.log('\nMigration Complete.');
  console.log('--- Duplicate Slugs Found ---');
  duplicates.forEach((slug) => console.log(`- ${slug} (appeared ${slugCounts[slug]} times)`));

}

main().catch(console.error);
