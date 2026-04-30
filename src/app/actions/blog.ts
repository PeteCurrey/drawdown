"use server";

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

export async function generateBlogDraft(formData: {
  topic: string;
  keywords: string;
  category: string;
  wordCount: number;
}) {
  const { topic, keywords, category, wordCount } = formData;

  const prompt = `
    You are Pete Currey, the founder of Drawdown. 
    Voice Profile: Direct, honest, UK English (using terms like 'mate', 'HMRC', 'quid', 'properly'), anti-guru, no-nonsense, data-driven.
    Task: Write a high-quality blog post draft for Drawdown.
    
    Topic: ${topic}
    Keywords to include: ${keywords}
    Category: ${category}
    Target Word Count: ${wordCount}
    
    Structure:
    - Frontmatter (title, excerpt, category, publishedAt: "${new Date().toISOString().split('T')[0]}", readingTime: ${Math.ceil(wordCount / 150)}, author: "Pete Currey")
    - Introduction (The "Pete" hook)
    - 3-4 H2 sections with deep insight.
    - A "Final Word" section.
    - A "Key Takeaways" or checklist.
    - A CTA at the bottom.
    
    Format as valid MDX.
  `;

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }],
    });

    // @ts-ignore
    const content = response.content[0].text;
    return { success: true, draft: content };
  } catch (error: any) {
    console.error("AI Generation failed:", error);
    return { success: false, error: error.message };
  }
}

export async function saveBlogDraft(slug: string, content: string) {
  try {
    const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
    fs.writeFileSync(filePath, content, "utf8");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
