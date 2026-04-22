import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

export interface BlogMetadata {
  title: string;
  excerpt: string;
  category: "Psychology" | "Market Analysis" | "Education";
  publishedAt: string;
  readingTime: number;
  author: string;
  slug: string;
}

export interface BlogPost extends BlogMetadata {
  content: string;
}

export function getAllPosts(): BlogMetadata[] {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  const files = fs.readdirSync(BLOG_DIR);
  
  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const filePath = path.join(BLOG_DIR, file);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContent);
      
      return {
        ...data,
        slug: file.replace(".mdx", ""),
      } as BlogMetadata;
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContent);
  
  return {
    ...data,
    slug,
    content,
  } as BlogPost;
}
