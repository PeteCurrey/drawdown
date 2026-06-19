"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Loader2, Save, Eye, EyeOff } from "lucide-react";
import { saveBlogPostAction, generateBlogWithAIAction } from "@/app/actions/admin-actions";

const CATEGORIES = [
  "Market Analysis",
  "Education",
  "Psychology",
  "Tools",
  "UK Trading",
  "Risk Management",
  "Prop Firms",
  "Broker News"
];

interface Post {
  id?: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  tags: string[];
  published: boolean;
  featured?: boolean;
  meta_title?: string;
  meta_description?: string;
}

interface BlogEditorProps {
  post?: Post;
}

export function BlogEditor({ post }: BlogEditorProps) {
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [category, setCategory] = useState(post?.category || "Market Analysis");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [content, setContent] = useState(post?.content || "");
  const [tagsInput, setTagsInput] = useState(post?.tags?.join(", ") || "");
  const [published, setPublished] = useState(post?.published ?? true);
  const [featured, setFeatured] = useState(post?.featured ?? false);
  const [metaTitle, setMetaTitle] = useState(post?.meta_title || "");
  const [metaDescription, setMetaDescription] = useState(post?.meta_description || "");

  const [saving, setSaving] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [generating, setGenerating] = useState(false);

  // Auto-generate slug and meta tags from title/excerpt
  useEffect(() => {
    if (!post?.id && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setSlug(generatedSlug);
      setMetaTitle(`${title} | Drawdown`);
    }
  }, [title, post?.id]);

  useEffect(() => {
    if (!post?.id && excerpt) {
      setMetaDescription(excerpt.slice(0, 155));
    }
  }, [excerpt, post?.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !content) {
      alert("Please fill in all required fields (Title, Slug, Content).");
      return;
    }

    setSaving(true);
    try {
      const tags = tagsInput
        .split(",")
        .map(t => t.trim())
        .filter(t => t.length > 0);

      const payload = {
        id: post?.id,
        title,
        slug,
        category,
        excerpt,
        content,
        tags,
        published,
        featured,
        meta_title: metaTitle,
        meta_description: metaDescription
      };

      const res = await saveBlogPostAction(payload);
      if (res.success) {
        window.location.href = "/admin/blog";
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to save blog post.");
    } finally {
      setSaving(false);
    }
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt) {
      alert("Please provide a prompt for Claude.");
      return;
    }

    setGenerating(true);
    try {
      const res = await generateBlogWithAIAction(aiPrompt);
      if (!res.success || !res.blog) {
        throw new Error(res.error || "Generation returned empty response.");
      }

      const { title: aiTitle, slug: aiSlug, category: aiCategory, excerpt: aiExcerpt, content: aiContent, tags: aiTags } = res.blog;

      setTitle(aiTitle || "");
      setSlug(aiSlug || "");
      setCategory(aiCategory || "Market Analysis");
      setExcerpt(aiExcerpt || "");
      setContent(aiContent || "");
      setTagsInput(aiTags?.join(", ") || "");
      setMetaTitle(`${aiTitle} | Drawdown`);
      setMetaDescription(aiExcerpt || "");
      setShowAiModal(false);

    } catch (err: any) {
      console.error(err);
      alert(err.message || "Claude generation failed. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/blog" className="p-1 border border-white/10 hover:border-white/20 text-[#8C8B87] hover:text-white rounded transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-3xl font-display font-black uppercase text-white tracking-tight">
              {post?.id ? "Edit Blog Post" : "Create Blog Post"}
            </h1>
            <p className="text-xs text-[#8C8B87] font-mono uppercase tracking-widest mt-1">
              {post?.id ? "Modify existing article catalog" : "Publish a new piece of market intelligence"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowAiModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#C8F135] hover:bg-[#D8F155] text-[#08090D] text-xs font-mono font-bold uppercase tracking-widest transition-all duration-150 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          Generate with AI
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main fields (Left) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0F111A] border border-[#1C1F2B] p-6 rounded-xl space-y-6">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-[#8C8B87] uppercase tracking-wider block">
                Post Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a compelling title..."
                className="w-full bg-[#12141F] border border-white/10 rounded px-4 py-3 text-sm text-white font-sans outline-none focus:border-[#C8F135] transition-colors placeholder:text-[#5C5B57]"
              />
            </div>

            {/* Slug & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-[#8C8B87] uppercase tracking-wider block">
                  Slug (URL) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="post-url-slug"
                  className="w-full bg-[#12141F] border border-white/10 rounded px-4 py-3 text-sm text-white font-mono outline-none focus:border-[#C8F135] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-[#8C8B87] uppercase tracking-wider block">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#12141F] border border-white/10 rounded px-4 py-3 text-sm text-white outline-none focus:border-[#C8F135] transition-colors"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Excerpt */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-[#8C8B87] uppercase tracking-wider block font-semibold">
                Excerpt (Max 200 chars)
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value.slice(0, 200))}
                rows={3}
                placeholder="Brief summary of the article..."
                className="w-full bg-[#12141F] border border-white/10 rounded px-4 py-3 text-sm text-white font-sans outline-none focus:border-[#C8F135] transition-colors placeholder:text-[#5C5B57] resize-none"
              />
              <span className="text-[10px] font-mono text-[#5C5B57] block text-right">{excerpt.length}/200</span>
            </div>

            {/* Content (Markdown) */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-[#8C8B87] uppercase tracking-wider block">
                Content (Markdown) <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={18}
                placeholder="Write your blog content here in markdown format..."
                className="w-full bg-[#12141F] border border-white/10 rounded p-4 text-sm text-white font-mono outline-none focus:border-[#C8F135] transition-colors placeholder:text-[#5C5B57] resize-y"
              />
            </div>
          </div>
        </div>

        {/* Sidebar settings (Right) */}
        <div className="space-y-6">
          <div className="bg-[#0F111A] border border-[#1C1F2B] p-6 rounded-xl space-y-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#8C8B87] font-bold border-b border-white/5 pb-4">
              // Publication Settings
            </h3>

            {/* Published Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-[#8C8B87] uppercase tracking-wider block font-bold">Published</span>
                <span className="text-[9px] text-[#5C5B57]">Visibility on client blog page</span>
              </div>
              <button
                type="button"
                onClick={() => setPublished(!published)}
                className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                  published ? "bg-[#C8F135]" : "bg-white/10"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-[#08090D] shadow transition-transform duration-200 ${
                    published ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Featured Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-[#8C8B87] uppercase tracking-wider block font-bold">Featured Post</span>
                <span className="text-[9px] text-[#5C5B57]">Prioritise in lists & displays</span>
              </div>
              <button
                type="button"
                onClick={() => setFeatured(!featured)}
                className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                  featured ? "bg-[#C8F135]" : "bg-white/10"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-[#08090D] shadow transition-transform duration-200 ${
                    featured ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-[#8C8B87] uppercase tracking-wider block font-bold">Tags (Comma-separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="market, psychology, automated"
                className="w-full bg-[#12141F] border border-white/10 rounded px-3 py-2 text-xs text-white outline-none focus:border-[#C8F135] transition-colors font-sans placeholder:text-[#5C5B57]"
              />
            </div>
          </div>

          <div className="bg-[#0F111A] border border-[#1C1F2B] p-6 rounded-xl space-y-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#8C8B87] font-bold border-b border-white/5 pb-4">
              // SEO Meta Configuration
            </h3>

            {/* Meta Title */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-[#8C8B87] uppercase tracking-wider block font-bold">Meta Title</label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Custom HTML title tag"
                className="w-full bg-[#12141F] border border-white/10 rounded px-3 py-2 text-xs text-white outline-none focus:border-[#C8F135] transition-colors font-sans"
              />
            </div>

            {/* Meta Description */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-[#8C8B87] uppercase tracking-wider block font-bold">Meta Description</label>
              <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value.slice(0, 160))}
                rows={3}
                placeholder="SEO search snippet..."
                className="w-full bg-[#12141F] border border-white/10 rounded px-3 py-2 text-xs text-white outline-none focus:border-[#C8F135] transition-colors font-sans placeholder:text-[#5C5B57] resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 bg-[#C8F135] hover:bg-[#D8F155] disabled:opacity-60 text-[#08090D] text-xs font-mono font-bold uppercase tracking-widest transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save & Publish
          </button>
        </div>
      </form>

      {/* Claude AI Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-[#0F111A] border border-[#1C1F2B] max-w-lg w-full rounded-xl p-8 relative overflow-hidden shadow-2xl space-y-6">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#C8F135]" />
            <div className="space-y-2 text-center">
              <div className="w-12 h-12 bg-[#C8F135]/10 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6 text-[#C8F135]" />
              </div>
              <h3 className="text-xl font-display font-bold uppercase text-white tracking-tight">Generate with Claude</h3>
              <p className="text-xs text-[#8C8B87]">
                Claude will write a full market intelligence article conforming to Pete's honest, direct brand voice.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold text-[#8C8B87] uppercase tracking-wider">
                Writing Instructions / Topic
              </label>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                disabled={generating}
                rows={4}
                placeholder="e.g., Write a post about GBP/USD price action after the Bank of England decision today..."
                className="w-full bg-[#12141F] border border-white/10 rounded p-4 text-xs text-white outline-none focus:border-[#C8F135] transition-colors placeholder:text-[#5C5B57] resize-none"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                disabled={generating}
                className="flex-1 py-3 bg-[#161824] hover:bg-[#1E2130] text-white text-xs font-mono font-bold uppercase tracking-widest transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAiGenerate}
                disabled={generating}
                className="flex-1 py-3 bg-[#C8F135] hover:bg-[#D8F155] disabled:opacity-50 text-[#08090D] text-xs font-mono font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
