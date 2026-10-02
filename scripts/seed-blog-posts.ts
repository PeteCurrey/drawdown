import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

function extractBodyHTML(filePath: string): string {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  
  const content = fs.readFileSync(filePath, "utf8");
  
  const columnSearchText = '<div className="lg:col-span-8 space-y-16">';
  const columnStartIndex = content.indexOf(columnSearchText);
  if (columnStartIndex === -1) {
    throw new Error(`Column div not found in ${filePath}`);
  }
  
  let openDivs = 1;
  let index = columnStartIndex + columnSearchText.length;
  while (openDivs > 0 && index < content.length) {
    if (content.substr(index, 4) === "<div") {
      openDivs++;
      index += 4;
    } else if (content.substr(index, 6) === "</div>") {
      openDivs--;
      index += 6;
    } else {
      index++;
    }
  }
  
  let bodyHTML = content.substring(columnStartIndex + columnSearchText.length, index - 6).trim();
  
  // Replace React attribute syntax with standard HTML
  bodyHTML = bodyHTML.replace(/className=/g, "class=");
  
  // Convert Next.js <Image /> tags to standard <img /> tags
  bodyHTML = bodyHTML.replace(/<Image\s+([^>]*?)\/?>/g, (match, attrs) => {
    const srcMatch = attrs.match(/src=\{?["'](.*?)["']\}?/);
    const altMatch = attrs.match(/alt=\{?["'](.*?)["']\}?/);
    const src = srcMatch ? srcMatch[1] : "";
    const alt = altMatch ? altMatch[1] : "";
    return `<img src="${src}" alt="${alt}" class="w-full h-full object-cover block" />`;
  });
  
  // Remove JSX comment brackets {/* ... */}
  bodyHTML = bodyHTML.replace(/\{\/\*[\s\S]*?\*\/\}/g, "");
  
  // Keep only the article body sections and discard subsequent components (related courses, sidebar templates, etc.)
  const lastSectionEnd = bodyHTML.lastIndexOf("</section>");
  if (lastSectionEnd !== -1) {
    bodyHTML = bodyHTML.substring(0, lastSectionEnd + 10);
  }
  
  return bodyHTML;
}

const POSTS_METADATA = [
  {
    slug: "coffeezilla-alexg-trading-education",
    title: "The Coffeezilla Video on fxAlexG: What It Actually Tells Us About Trading Education",
    subtitle: "Seven and a half million in course revenue. Thirty percent from actual trading. Here's what the numbers really mean — and what every trader should take from it.",
    eyebrow: "TRADING EDUCATION",
    category: "Education",
    read_time: "9 min read",
    hero_image_url: "/images/blog/alexg-bugatti.png",
    hero_image_alt: "Deep blue and purple Bugatti Chiron",
    published_at: "2026-06-20T12:00:00.000Z",
    related_post_slugs: ["why-trading-gurus-use-demo-accounts", "trading-education-business-model"],
    client_file: "src/app/(marketing)/blog/coffeezilla-alexg-trading-education/CoffeezillaAlexGClient.tsx",
    seo: {
      meta_title: "The Coffeezilla Video on fxAlexG: What It Actually Tells Us About Trading Education | Drawdown",
      meta_description: "Seven and a half million in course revenue. Demo accounts. Undisclosed affiliates. We break down what the fxAlexG situation really tells us about trading education — and what traders should actually do with that information.",
      og_title: "The Coffeezilla Video on fxAlexG: What It Actually Tells Us About Trading Education | Drawdown",
      og_description: "Seven and a half million in course revenue. Demo accounts. Undisclosed affiliates. We break down what the fxAlexG situation really tells us about trading education — and what traders should actually do with that information.",
      og_image_url: "https://drawdown.trading/images/blog/alexg-bugatti.png",
      canonical_url: "https://drawdown.trading/blog/coffeezilla-alexg-trading-education",
      focus_keyword: "trading education"
    }
  },
  {
    slug: "why-trading-gurus-use-demo-accounts",
    title: "Why Trading Gurus Use Demo Accounts — And What It Actually Means",
    subtitle: "The hate is mostly misdirected. Demo trading isn't the problem. Here's what the real issue is — and why most traders are arguing about the wrong thing.",
    eyebrow: "TRADING PSYCHOLOGY",
    category: "Psychology",
    read_time: "7 min read",
    hero_image_url: "https://images.unsplash.com/photo-1642790551116-18e150f248e3?w=1200&q=80",
    hero_image_alt: "Trader analysing candlestick charts on screen",
    published_at: "2026-06-19T12:00:00.000Z",
    related_post_slugs: ["coffeezilla-alexg-trading-education", "trading-education-business-model"],
    client_file: "src/app/(marketing)/blog/why-trading-gurus-use-demo-accounts/WhyGurusDemoClient.tsx",
    seo: {
      meta_title: "Why Trading Gurus Use Demo Accounts — And What It Actually Means | Drawdown",
      meta_description: "The hate around demo accounts in trading content is mostly misdirected. Here's the honest reason gurus use them, why the omission is the real problem, and what traders should actually be looking for.",
      og_title: "Why Trading Gurus Use Demo Accounts — And What It Actually Means | Drawdown",
      og_description: "The hate around demo accounts in trading content is mostly misdirected. Here's the honest reason gurus use them, why the omission is the real problem, and what traders should actually be looking for.",
      og_image_url: "https://images.unsplash.com/photo-1642790551116-18e150f248e3?w=1200&q=80",
      canonical_url: "https://drawdown.trading/blog/why-trading-gurus-use-demo-accounts",
      focus_keyword: "demo accounts"
    }
  },
  {
    slug: "trading-education-business-model",
    title: "The Trading Education Business Model: How the Money Is Really Made",
    subtitle: "Courses. Affiliates. Broker referrals. The model isn't a secret — it's just rarely explained honestly. Here's exactly how it works, who benefits, and how to use that knowledge to make better decisions.",
    eyebrow: "INDUSTRY INSIGHT",
    category: "Education",
    read_time: "8 min read",
    hero_image_url: "https://images.unsplash.com/photo-1559526324-593bc073d938?w=1200&q=80",
    hero_image_alt: "Financial data and market analysis dashboard",
    published_at: "2026-06-20T11:00:00.000Z",
    related_post_slugs: ["coffeezilla-alexg-trading-education", "why-trading-gurus-use-demo-accounts"],
    client_file: "src/app/(marketing)/blog/trading-education-business-model/TradingEducationModelClient.tsx",
    seo: {
      meta_title: "The Trading Education Business Model: How the Money Is Really Made | Drawdown",
      meta_description: "Courses. Affiliates. Broker referrals. The trading education business model isn't a secret — it's just rarely explained honestly. Here's exactly how it works, who benefits, and what traders should do with that knowledge.",
      og_title: "The Trading Education Business Model: How the Money Is Really Made | Drawdown",
      og_description: "Courses. Affiliates. Broker referrals. The trading education business model isn't a secret — it's just rarely explained honestly. Here's exactly how it works, who benefits, and what traders should do with that knowledge.",
      og_image_url: "https://images.unsplash.com/photo-1559526324-593bc073d938?w=1200&q=80",
      canonical_url: "https://drawdown.trading/blog/trading-education-business-model",
      focus_keyword: "business model"
    }
  }
];

async function seed() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error("Missing Supabase credentials in .env.local");
    return;
  }

  const supabase = createClient(url, serviceKey);

  console.log("1. Upserting default author profile for Pete...");
  const { data: authorData, error: authorError } = await supabase
    .from("author_profiles")
    .upsert({
      name: "Pete",
      role: "Founder, Drawdown",
      bio: "Building Drawdown to be the trading education platform that actually tells you the truth.",
      avatar_url: "/images/pete.jpg"
    }, { onConflict: "name" })
    .select("id")
    .single();

  if (authorError) {
    console.error("Failed to seed author profile:", authorError.message);
    return;
  }

  const authorId = authorData.id;
  console.log(`Pete author profile upserted with ID: ${authorId}`);

  console.log("2. Processing and seeding blog posts...");
  for (const postInfo of POSTS_METADATA) {
    console.log(`Processing post: ${postInfo.slug}...`);
    try {
      const bodyHTML = extractBodyHTML(path.join(process.cwd(), postInfo.client_file));
      console.log(`Extracted HTML body length: ${bodyHTML.length} characters.`);

      // Upsert blog_posts
      const { data: postData, error: postError } = await supabase
        .from("blog_posts")
        .upsert({
          slug: postInfo.slug,
          title: postInfo.title,
          subtitle: postInfo.subtitle,
          eyebrow: postInfo.eyebrow,
          body: bodyHTML,
          author_id: authorId,
          hero_image_url: postInfo.hero_image_url,
          hero_image_alt: postInfo.hero_image_alt,
          read_time: postInfo.read_time,
          published_at: postInfo.published_at,
          is_published: true,
          related_post_slugs: postInfo.related_post_slugs,
          category: postInfo.category
        }, { onConflict: "slug" })
        .select("id")
        .single();

      if (postError) {
        console.error(`Failed to upsert post ${postInfo.slug}:`, postError.message);
        continue;
      }

      const postId = postData.id;
      console.log(`Blog post upserted with ID: ${postId}`);

      // Upsert blog_post_seo
      const { error: seoError } = await supabase
        .from("blog_post_seo")
        .upsert({
          post_id: postId,
          meta_title: postInfo.seo.meta_title,
          meta_description: postInfo.seo.meta_description,
          og_title: postInfo.seo.og_title,
          og_description: postInfo.seo.og_description,
          og_image_url: postInfo.seo.og_image_url,
          canonical_url: postInfo.seo.canonical_url,
          schema_type: "BlogPosting",
          no_index: false,
          focus_keyword: postInfo.seo.focus_keyword
        }, { onConflict: "post_id" });

      if (seoError) {
        console.error(`Failed to upsert SEO for post ${postInfo.slug}:`, seoError.message);
      } else {
        console.log(`SEO records upserted for post: ${postInfo.slug}`);
      }
    } catch (err: any) {
      console.error(`Error seeding post ${postInfo.slug}:`, err.message);
    }
  }

  console.log("Seeding complete!");
}

seed();
