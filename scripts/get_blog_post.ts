import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

async function run() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error("No Supabase URL or key found!");
    process.exit(1);
  }

  const supabase = createClient(url, key);
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, title, slug, body")
    .ilike("title", "%Bank of England%")
    .limit(5);

  if (error) {
    console.error("Error fetching post:", error.message);
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.log("No posts found matching 'Bank of England' in database.");
  } else {
    for (const post of data) {
      console.log("=========================================");
      console.log(`ID: ${post.id}`);
      console.log(`TITLE: ${post.title}`);
      console.log(`SLUG: ${post.slug}`);
      console.log(`BODY:\n${post.body}`);
      console.log("=========================================");
    }
  }
}

run();
