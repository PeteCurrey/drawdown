import { createInternalSupabase } from '@/lib/supabase/server';

// ---------------------------------------------------------------------------
// Fallback hero images keyed by slug (used when hero_image_url is null in DB)
// ---------------------------------------------------------------------------
const SLUG_IMAGES: Record<string, string> = {
  'institutional-vs-retail-psychology': 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=800',
  'why-free-signals-cost-money': 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=800',
  'worthless-trading-courses': 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=800',
  'gbpusd-trading-guide': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800',
  'understanding-market-liquidity': 'https://images.unsplash.com/photo-1498084393753-b411b2d26b34?q=80&w=800',
  'economic-calendar-guide': 'https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=800',
  'the-trading-routine': 'https://images.unsplash.com/photo-1488998460682-e47007415509?q=80&w=800',
  'uk-trading-tax-guide': 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?q=80&w=800',
  'ftse-100-playbook': 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800',
  'the-myth-of-the-100-percent-win-rate': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800',
  'high-cost-of-retail-alpha': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800',
  'cost-of-revenge-trading': 'https://images.unsplash.com/photo-1494178244203-0f6987e8cd36?q=80&w=800',
  'how-i-blew-my-first-account': 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=800',
  'geometry-of-liquid-markets': 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=800',
  'why-most-uk-traders-fail': 'https://images.unsplash.com/photo-1428908728789-d2de25dbd4e2?q=80&w=800',
  'spread-betting-vs-cfds': 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800',
  'case-for-full-automation': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800',
  'why-your-backtest-is-lying': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800',
  'prop-firm-honest-review': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800',
  'trading-taxes-uk-explained': 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800',
  'friday-trading-traps': 'https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?q=80&w=800',
  'tradingview-pro-setup': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800',
  'the-1-percent-rule': 'https://images.unsplash.com/photo-1453733190148-c44698c265f8?q=80&w=800',
  'the-only-three-indicators': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800',
};
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800';

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface BlogMetadata {
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  dateModified?: string;
  readingTime: number;
  author: string;
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
  contentFormat?: 'mdx' | 'html';
  dark_background?: boolean;
  // Extended fields populated for Supabase-backed posts
  subtitle?: string;
  eyebrow?: string;
  authorProfile?: {
    name: string;
    role: string;
    bio: string;
    avatar_url: string;
  };
  seoSettings?: Record<string, unknown>;
  relatedPostSlugs?: string[];
}

// ---------------------------------------------------------------------------
// getAllPosts — queries Supabase only, returns BlogMetadata[]
// ---------------------------------------------------------------------------
export async function getAllPosts(): Promise<BlogMetadata[]> {
  try {
    const supabase = createInternalSupabase();
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        slug,
        title,
        subtitle,
        category,
        published_at,
        hero_image_url,
        hero_image_alt,
        read_time,
        author_profiles (
          name
        )
      `)
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) {
      console.error('getAllPosts: Supabase query error:', error.message);
      return [];
    }

    if (!data) return [];

    return data.map((post: any) => {
      const readingTime = parseInt(post.read_time) || 5;
      const heroSrc =
        post.hero_image_url ||
        SLUG_IMAGES[post.slug] ||
        DEFAULT_IMAGE;
      const heroImage = {
        src: heroSrc,
        alt: post.hero_image_alt || post.title,
      };
      const authorName =
        post.author_profiles && !Array.isArray(post.author_profiles)
          ? post.author_profiles.name
          : 'Pete Currey';

      return {
        title: post.title,
        excerpt: post.subtitle || '',
        category: post.category || 'Market Analysis',
        publishedAt: post.published_at,
        dateModified: post.published_at,
        readingTime,
        author: authorName,
        slug: post.slug,
        image: heroSrc,
        heroImage,
        metaTitle: `${post.title} | Drawdown Blog`,
        metaDescription: post.subtitle || '',
      } as BlogMetadata;
    });
  } catch (err) {
    console.error('getAllPosts: unexpected error:', err);
    return [];
  }
}

// ---------------------------------------------------------------------------
// getPostBySlug — queries Supabase only, returns extended BlogPost
// ---------------------------------------------------------------------------
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const supabase = createInternalSupabase();
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        author_profiles (
          name,
          role,
          bio,
          avatar_url
        ),
        blog_post_seo (
          meta_title,
          meta_description,
          og_title,
          og_description,
          og_image_url,
          canonical_url,
          schema_type,
          no_index,
          focus_keyword
        )
      `)
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle();

    if (error) {
      console.error(`getPostBySlug [${slug}]: Supabase query error:`, error.message);
      return null;
    }

    if (!post) return null;

    const readingTime = parseInt(post.read_time) || 5;

    const heroSrc =
      post.hero_image_url ||
      SLUG_IMAGES[slug] ||
      DEFAULT_IMAGE;
    const heroImage = {
      src: heroSrc,
      alt: post.hero_image_alt || post.title,
      caption: post.hero_image_caption || undefined,
      credit: post.hero_image_credit || undefined,
    };

    const authorProfile =
      post.author_profiles && !Array.isArray(post.author_profiles)
        ? post.author_profiles
        : {
            name: 'Pete Currey',
            role: 'Founder, Drawdown',
            bio: 'Building Drawdown to be the trading education platform that actually tells you the truth.',
            avatar_url: '',
          };

    // blog_post_seo may be a single object or an array depending on join type
    const seo =
      post.blog_post_seo && !Array.isArray(post.blog_post_seo)
        ? post.blog_post_seo
        : post.blog_post_seo && post.blog_post_seo[0]
        ? post.blog_post_seo[0]
        : {};

    // Determine content format from SEO schema_type
    const schemaType: string = seo.schema_type || (post.seo as any)?.schema_type || 'BlogPosting';
    const contentFormat: 'mdx' | 'html' = schemaType === 'mdx' ? 'mdx' : 'html';

    // Pull FAQ from the seo JSON column if present (set during MDX seed)
    const seoJson = post.seo as any;
    const faq = seoJson?.faq || undefined;
    const relatedTool = seoJson?.relatedTool || undefined;
    const relatedCourse = seoJson?.relatedCourse || undefined;
    const internalLinks = seoJson?.internalLinks || undefined;

    return {
      title: post.title,
      excerpt: post.subtitle || '',
      category: post.category || 'Market Analysis',
      publishedAt: post.published_at || post.created_at,
      dateModified: post.published_at || post.created_at,
      readingTime,
      author: authorProfile.name,
      slug: post.slug,
      image: heroSrc,
      heroImage,
      metaTitle: seo.meta_title || `${post.title} | Drawdown Blog`,
      metaDescription: seo.meta_description || post.subtitle || '',
      content: post.body || '',
      contentFormat,
      // Extended fields
      subtitle: post.subtitle,
      eyebrow: post.eyebrow,
      authorProfile,
      seoSettings: seo,
      relatedPostSlugs: post.related_post_slugs || [],
      faq,
      relatedTool,
      relatedCourse,
      internalLinks,
      dark_background: post.dark_background ?? false,
    } as unknown as BlogPost;
  } catch (err) {
    console.error(`getPostBySlug [${slug}]: unexpected error:`, err);
    return null;
  }
}
