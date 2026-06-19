import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { createClient } from "@/lib/supabase/client";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

export interface BlogMetadata {
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readingTime: number;
  author: string;
  slug: string;
  image: string;
  metaTitle: string;
  metaDescription: string;
}

export interface BlogPost extends BlogMetadata {
  content: string;
}

const SLUG_IMAGES: Record<string, string> = {
  "institutional-vs-retail-psychology": "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=800",
  "why-free-signals-cost-money": "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=800",
  "worthless-trading-courses": "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=800",
  "gbpusd-trading-guide": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800",
  "understanding-market-liquidity": "https://images.unsplash.com/photo-1498084393753-b411b2d26b34?q=80&w=800",
  "economic-calendar-guide": "https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=800",
  "the-trading-routine": "https://images.unsplash.com/photo-1488998460682-e47007415509?q=80&w=800",
  "uk-trading-tax-guide": "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?q=80&w=800",
  "ftse-100-playbook": "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800",
  "the-myth-of-the-100-percent-win-rate": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800",
  "high-cost-of-retail-alpha": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800",
  "cost-of-revenge-trading": "https://images.unsplash.com/photo-1494178244203-0f6987e8cd36?q=80&w=800",
  "how-i-blew-my-first-account": "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=800",
  "geometry-of-liquid-markets": "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=800",
  "why-most-uk-traders-fail": "https://images.unsplash.com/photo-1428908728789-d2de25dbd4e2?q=80&w=800",
  "spread-betting-vs-cfds": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800",
  "case-for-full-automation": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800",
  "why-your-backtest-is-lying": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800",
  "prop-firm-honest-review": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800",
  "trading-taxes-uk-explained": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800",
  "friday-trading-traps": "https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?q=80&w=800",
  "tradingview-pro-setup": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800",
  "the-1-percent-rule": "https://images.unsplash.com/photo-1453733190148-c44698c265f8?q=80&w=800",
  "the-only-three-indicators": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800"
};

export async function getAllPosts(): Promise<BlogMetadata[]> {
  let localPosts: BlogMetadata[] = [];
  
  // 1. Fetch from local content directory
  if (fs.existsSync(BLOG_DIR)) {
    const files = fs.readdirSync(BLOG_DIR);
    localPosts = files
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => {
        const filePath = path.join(BLOG_DIR, file);
        const fileContent = fs.readFileSync(filePath, "utf8");
        const { data } = matter(fileContent);
        const slug = file.replace(".mdx", "");
        
        const title = data.title || "";
        const excerpt = data.excerpt || "";
        
        return {
          ...data,
          slug,
          image: data.image || SLUG_IMAGES[slug] || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800",
          metaTitle: data.metaTitle || `${title} | Drawdown Blog`,
          metaDescription: data.metaDescription || excerpt,
        } as BlogMetadata;
      });
  }

  // 2. Fetch from Supabase blog_posts table
  let dbPosts: BlogMetadata[] = [];
  try {
    const supabase = createClient() as any;
    const { data, error } = await supabase
      .from("blog_posts")
      .select("title, excerpt, category, published_at, author, slug, image, meta_title, meta_description, content")
      .eq("published", true);

    if (!error && data) {
      dbPosts = data.map((post: any) => {
        const words = post.content ? post.content.split(/\s+/).length : 0;
        const readingTime = Math.max(1, Math.ceil(words / 200));
        return {
          title: post.title,
          excerpt: post.excerpt || "",
          category: post.category || "Market Analysis",
          publishedAt: post.published_at,
          readingTime,
          author: post.author || "Pete Currey",
          slug: post.slug,
          image: post.image || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800",
          metaTitle: post.meta_title || `${post.title} | Drawdown Blog`,
          metaDescription: post.meta_description || post.excerpt || "",
        } as BlogMetadata;
      });
    }
  } catch (err) {
    console.error("Failed to query blog_posts table:", err);
  }
  
  const merged = [...localPosts, ...dbPosts];
  return merged.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  // 1. Try fetching from local file system first
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContent);
    
    const title = data.title || "";
    const excerpt = data.excerpt || "";

    return {
      ...data,
      slug,
      content,
      image: data.image || SLUG_IMAGES[slug] || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800",
      metaTitle: data.metaTitle || `${title} | Drawdown Blog`,
      metaDescription: data.metaDescription || excerpt,
    } as BlogPost;
  }

  // 2. Fallback to Supabase blog_posts table
  try {
    const supabase = createClient() as any;
    const { data: post, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (!error && post) {
      const words = post.content ? post.content.split(/\s+/).length : 0;
      const readingTime = Math.max(1, Math.ceil(words / 200));

      return {
        title: post.title,
        excerpt: post.excerpt || "",
        category: post.category || "Market Analysis",
        publishedAt: post.published_at || post.created_at,
        readingTime,
        author: post.author || "Pete Currey",
        slug: post.slug,
        image: post.image || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800",
        metaTitle: post.meta_title || `${post.title} | Drawdown Blog`,
        metaDescription: post.meta_description || post.excerpt || "",
        content: post.content
      } as BlogPost;
    }
  } catch (err) {
    console.error(`Failed to find database blog post for slug ${slug}:`, err);
  }

  return null;
}
