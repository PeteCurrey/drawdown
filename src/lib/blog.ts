import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { createClient } from "@/lib/supabase/client";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

export interface BlogMetadata {
  title: string;
  excerpt: string;
  category: "Market Analysis" | "Education" | "Psychology" | "Tools" | "UK Trading" | "Risk Management";
  publishedAt: string;
  dateModified?: string;
  readingTime: number;
  author: "Pete Currey" | "Drawdown Team";
  slug: string;
  image: string;
  metaTitle: string;
  metaDescription: string;
  heroImage: {
    src: string;
    alt: string;
    caption?: string;
    credit?: string;
  };
  faq?: { question: string; answer: string }[];
  relatedTool?: string;
  relatedCourse?: string;
  internalLinks?: string[];
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

const STANDALONE_POSTS: BlogMetadata[] = [
  {
    slug: "coffeezilla-alexg-trading-education",
    title: "The Coffeezilla Video on fxAlexG: What It Actually Tells Us About Trading Education",
    excerpt: "Seven and a half million in course revenue. Thirty percent from actual trading. Here's what the numbers really mean — and what every trader should take from it.",
    category: "Education",
    publishedAt: "2026-06-20T12:00:00.000Z",
    dateModified: "2026-06-20T12:00:00.000Z",
    readingTime: 9,
    author: "Pete Currey",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80",
    metaTitle: "The Coffeezilla Video on fxAlexG: What It Actually Tells Us About Trading Education | Drawdown",
    metaDescription: "We break down what the fxAlexG situation really tells us about trading education, why gurus use demo accounts, and how traders can protect their capital.",
    heroImage: {
      src: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80",
      alt: "Trading charts on multiple monitors in a dark room"
    }
  },
  {
    slug: "why-trading-gurus-use-demo-accounts",
    title: "Why Trading Gurus Use Demo Accounts — And What It Actually Means",
    excerpt: "The hate is mostly misdirected. Demo trading isn't the problem. Here's what the real issue is — and why most traders are arguing about the wrong thing.",
    category: "Psychology",
    publishedAt: "2026-06-19T12:00:00.000Z",
    dateModified: "2026-06-19T12:00:00.000Z",
    readingTime: 7,
    author: "Pete Currey",
    image: "https://images.unsplash.com/photo-1642790551116-18e150f248e3?w=1200&q=80",
    metaTitle: "Why Trading Gurus Use Demo Accounts — And What It Actually Means | Drawdown",
    metaDescription: "The hate is mostly misdirected. Demo trading isn't the problem. Here's what the real issue is, and why most traders are arguing about the wrong thing.",
    heroImage: {
      src: "https://images.unsplash.com/photo-1642790551116-18e150f248e3?w=1200&q=80",
      alt: "Trader analysing candlestick charts on screen"
    }
  },
  {
    slug: "trading-education-business-model",
    title: "The Trading Education Business Model: How the Money Is Really Made",
    excerpt: "Courses. Affiliates. Broker referrals. The model isn't a secret — it's just rarely explained honestly. Here's exactly how it works, who benefits, and how to use that knowledge to make better decisions.",
    category: "Education",
    publishedAt: "2026-06-20T11:00:00.000Z",
    dateModified: "2026-06-20T11:00:00.000Z",
    readingTime: 8,
    author: "Pete Currey",
    image: "https://images.unsplash.com/photo-1559526324-593bc073d938?w=1200&q=80",
    metaTitle: "The Trading Education Business Model: How the Money Is Really Made | Drawdown",
    metaDescription: "Courses. Affiliates. Broker referrals. We explain how the trading education business model works, who benefits, and how you can make smarter decisions.",
    heroImage: {
      src: "https://images.unsplash.com/photo-1559526324-593bc073d938?w=1200&q=80",
      alt: "Financial data and market analysis dashboard"
    }
  }
];

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
        const { data, content } = matter(fileContent);
        const slug = file.replace(".mdx", "");
        
        const title = data.title || "";
        const excerpt = data.excerpt || "";
        
        // Auto-calculate reading time by word count of pure body content
        const cleanContent = content.replace(/<\/?[^>]+(>|$)/g, ""); // strip HTML/JSX elements
        const words = cleanContent.trim().split(/\s+/).filter(w => w.length > 0).length;
        const readingTime = Math.max(1, Math.ceil(words / 200));

        // Format heroImage fallback
        const heroImage = data.heroImage || {
          src: data.image || SLUG_IMAGES[slug] || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800",
          alt: title
        };

        const metaTitle = data.metaTitle || `${title} | Drawdown Blog`;
        const metaDescription = data.metaDescription || excerpt || "";

        // Enforce 150-160 characters check at build time for metadata
        if (metaDescription.length < 150 || metaDescription.length > 160) {
          console.error(`\x1b[31m[ERROR] Blog post "${slug}" metaDescription length is ${metaDescription.length} characters. Must be strictly 150-160 characters.\x1b[0m`);
        }

        return {
          ...data,
          slug,
          readingTime,
          image: heroImage.src,
          heroImage,
          metaTitle,
          metaDescription,
          author: data.author || "Pete Currey",
          category: data.category || "Market Analysis",
          publishedAt: data.publishedAt || new Date().toISOString(),
          dateModified: data.dateModified || data.publishedAt || new Date().toISOString()
        } as unknown as BlogMetadata;
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
        const heroImage = {
          src: post.image || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800",
          alt: post.title
        };
        return {
          title: post.title,
          excerpt: post.excerpt || "",
          category: post.category || "Market Analysis",
          publishedAt: post.published_at,
          dateModified: post.published_at,
          readingTime,
          author: post.author || "Pete Currey",
          slug: post.slug,
          image: heroImage.src,
          heroImage,
          metaTitle: post.meta_title || `${post.title} | Drawdown Blog`,
          metaDescription: post.meta_description || post.excerpt || "",
        } as unknown as BlogMetadata;
      });
    }
  } catch (err) {
    console.error("Failed to query blog_posts table:", err);
  }
  
  const merged = [...localPosts, ...dbPosts, ...STANDALONE_POSTS];
  return merged.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  // Check standalone posts first
  const standalone = STANDALONE_POSTS.find(p => p.slug === slug);
  if (standalone) {
    return {
      ...standalone,
      content: ""
    } as BlogPost;
  }

  // 1. Try fetching from local file system first
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContent);
    
    const title = data.title || "";
    const excerpt = data.excerpt || "";

    // Auto-calculate reading time by word count of pure body content
    const cleanContent = content.replace(/<\/?[^>]+(>|$)/g, ""); // strip HTML/JSX elements
    const words = cleanContent.trim().split(/\s+/).filter(w => w.length > 0).length;
    const readingTime = Math.max(1, Math.ceil(words / 200));

    // Format heroImage fallback
    const heroImage = data.heroImage || {
      src: data.image || SLUG_IMAGES[slug] || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800",
      alt: title
    };

    const metaTitle = data.metaTitle || `${title} | Drawdown Blog`;
    const metaDescription = data.metaDescription || excerpt || "";

    if (metaDescription.length < 150 || metaDescription.length > 160) {
      console.error(`\x1b[31m[ERROR] Blog post "${slug}" metaDescription length is ${metaDescription.length} characters. Must be strictly 150-160 characters.\x1b[0m`);
    }

    return {
      ...data,
      slug,
      content,
      readingTime,
      image: heroImage.src,
      heroImage,
      metaTitle,
      metaDescription,
      author: data.author || "Pete Currey",
      category: data.category || "Market Analysis",
      publishedAt: data.publishedAt || new Date().toISOString(),
      dateModified: data.dateModified || data.publishedAt || new Date().toISOString()
    } as unknown as BlogPost;
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
      const heroImage = {
        src: post.image || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800",
        alt: post.title
      };

      return {
        title: post.title,
        excerpt: post.excerpt || "",
        category: post.category || "Market Analysis",
        publishedAt: post.published_at || post.created_at,
        dateModified: post.published_at || post.created_at,
        readingTime,
        author: post.author || "Pete Currey",
        slug: post.slug,
        image: heroImage.src,
        heroImage,
        metaTitle: post.meta_title || `${post.title} | Drawdown Blog`,
        metaDescription: post.meta_description || post.excerpt || "",
        content: post.content
      } as unknown as BlogPost;
    }
  } catch (err) {
    console.error(`Failed to find database blog post for slug ${slug}:`, err);
  }

  return null;
}
