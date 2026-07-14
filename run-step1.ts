import { createClient } from "@supabase/supabase-js";

const db = {
  url: "https://miiasjbonwlleggiukyf.supabase.co",
  key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1paWFzamJvbndsbGVnZ2l1a3lmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjE1Njc1OCwiZXhwIjoyMDkxNzMyNzU4fQ.FZdZVV4N0JTZ61HAwdxzHP3HrUmDy3UBFcB_OapIzng"
};

async function run() {
  const client = createClient(db.url, db.key);
  
  console.log("=== QUERY 1 ===");
  const { data: q1Data, error: q1Err } = await client
    .from("seo_pages")
    .select("slug, page_type, title, seo_description, content, is_published")
    .order("page_type")
    .order("slug")
    .limit(50);
    
  if (q1Err) {
    console.error("Query 1 Error:", q1Err.message);
  } else {
    console.log(`Results: ${q1Data.length} rows`);
    if (q1Data.length > 0) {
      console.log("| slug | page_type | title | meta_description | content_preview | status | total_count |");
      console.log("| --- | --- | --- | --- | --- | --- | --- |");
      q1Data.forEach(row => {
        const preview = (row.content || "").substring(0, 100).replace(/\n/g, " ");
        const status = row.is_published ? "published" : "draft";
        console.log(`| ${row.slug} | ${row.page_type} | ${row.title} | ${row.seo_description || ""} | ${preview} | ${status} | ${q1Data.length} |`);
      });
    } else {
      console.log("(No rows returned)");
    }
  }

  console.log("\n=== QUERY 2 ===");
  const { data: q2Data, error: q2Err } = await client
    .from("seo_pages")
    .select("page_type");
    
  if (q2Err) {
    console.error("Query 2 Error:", q2Err.message);
  } else {
    const counts: Record<string, number> = {};
    (q2Data || []).forEach(row => {
      counts[row.page_type] = (counts[row.page_type] || 0) + 1;
    });
    const sortedCounts = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    
    console.log(`Results: ${sortedCounts.length} rows`);
    if (sortedCounts.length > 0) {
      console.log("| page_type | count |");
      console.log("| --- | --- |");
      sortedCounts.forEach(([type, count]) => {
        console.log(`| ${type} | ${count} |`);
      });
    } else {
      console.log("(No rows returned)");
    }
  }
}

run();
