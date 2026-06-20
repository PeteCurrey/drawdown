"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import TiptapLink from "@tiptap/extension-link";
import Typography from "@tiptap/extension-typography";
import Placeholder from "@tiptap/extension-placeholder";
import {
  ArrowLeft, Sparkles, Loader2, Save, Upload, X,
  Bold, Italic, Quote, List, ListOrdered, Minus,
  Link2, Image as ImageIcon, Heading2, Heading3,
  Eye, CheckCircle, AlertCircle, Trash2, Sun, Moon
} from "lucide-react";
import { saveBlogPostAction, generateBlogWithAIAction, deleteBlogPostAction } from "@/app/actions/admin-actions";
import { createClient } from "@/lib/supabase/client";

const CATEGORIES = [
  "Market Analysis", "Education", "Psychology", "Tools",
  "UK Trading", "Risk Management", "Prop Firms", "Broker News"
];

interface SeoData {
  meta_title?: string;
  meta_description?: string;
  og_title?: string;
  og_description?: string;
  og_image_url?: string;
  canonical_url?: string;
  no_index?: boolean;
  focus_keyword?: string;
}

interface Post {
  id?: string;
  title?: string;
  slug?: string;
  category?: string;
  eyebrow?: string;
  subtitle?: string;
  body?: string;
  hero_image_url?: string;
  hero_image_alt?: string;
  read_time?: string;
  published_at?: string;
  is_published?: boolean;
  dark_background?: boolean;
  related_post_slugs?: string[];
  seo?: SeoData;
}

interface BlogEditorProps {
  post?: Post;
}

function TiptapToolbar({ editor }: { editor: any }) {
  if (!editor) return null;

  const btnClass = (active?: boolean) =>
    `p-1.5 rounded transition-all cursor-pointer ${
      active
        ? "bg-mkt-ink text-white"
        : "text-mkt-i3 hover:bg-neutral-100 hover:text-mkt-ink border border-transparent hover:border-mkt-bd"
    }`;

  const addImage = () => {
    const url = window.prompt("Enter image URL");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const setLink = () => {
    const url = window.prompt("Enter URL");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-mkt-bd bg-neutral-50 rounded-t-lg">
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive("heading", { level: 2 }))}>
        <Heading2 className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btnClass(editor.isActive("heading", { level: 3 }))}>
        <Heading3 className="w-4 h-4" />
      </button>
      <div className="w-px h-5 bg-mkt-bd mx-1" />
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive("bold"))}>
        <Bold className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive("italic"))}>
        <Italic className="w-4 h-4" />
      </button>
      <div className="w-px h-5 bg-mkt-bd mx-1" />
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnClass(editor.isActive("blockquote"))}>
        <Quote className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive("bulletList"))}>
        <List className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive("orderedList"))}>
        <ListOrdered className="w-4 h-4" />
      </button>
      <div className="w-px h-5 bg-mkt-bd mx-1" />
      <button type="button" onClick={setLink} className={btnClass(editor.isActive("link"))}>
        <Link2 className="w-4 h-4" />
      </button>
      <button type="button" onClick={addImage} className={btnClass()}>
        <ImageIcon className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btnClass()}>
        <Minus className="w-4 h-4" />
      </button>
    </div>
  );
}

export function BlogEditor({ post }: BlogEditorProps) {
  const isEdit = !!post?.id;

  // Content state
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [category, setCategory] = useState(post?.category || "Market Analysis");
  const [eyebrow, setEyebrow] = useState(post?.eyebrow || "");
  const [subtitle, setSubtitle] = useState(post?.subtitle || "");
  const [heroImageUrl, setHeroImageUrl] = useState(post?.hero_image_url || "");
  const [heroImageAlt, setHeroImageAlt] = useState(post?.hero_image_alt || "");
  const [readTime, setReadTime] = useState(post?.read_time || "");
  const [publishedAt, setPublishedAt] = useState(
    post?.published_at ? post.published_at.slice(0, 16) : new Date().toISOString().slice(0, 16)
  );
  const [isPublished, setIsPublished] = useState(post?.is_published ?? false);
  const [darkBackground, setDarkBackground] = useState(post?.dark_background ?? false);

  // SEO state
  const [metaTitle, setMetaTitle] = useState(post?.seo?.meta_title || "");
  const [metaDescription, setMetaDescription] = useState(post?.seo?.meta_description || "");
  const [ogTitle, setOgTitle] = useState(post?.seo?.og_title || "");
  const [ogDescription, setOgDescription] = useState(post?.seo?.og_description || "");
  const [ogImageUrl, setOgImageUrl] = useState(post?.seo?.og_image_url || "");
  const [canonicalUrl, setCanonicalUrl] = useState(
    post?.seo?.canonical_url || `https://drawdown.trading/blog/${post?.slug || ""}`
  );
  const [noIndex, setNoIndex] = useState(post?.seo?.no_index ?? false);
  const [focusKeyword, setFocusKeyword] = useState(post?.seo?.focus_keyword || "");

  // UI state
  const [saving, setSaving] = useState(false);
  const [heroUploading, setHeroUploading] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [seoOpen, setSeoOpen] = useState(true);
  const [socialOpen, setSocialOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  // TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapImage,
      TiptapLink.configure({ openOnClick: false }),
      Typography,
      Placeholder.configure({ placeholder: "Write your blog content here…" }),
    ],
    content: post?.body || "",
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[400px] p-4 outline-none focus:outline-none text-mkt-ink font-sans",
      },
    },
  });

  const showToast = useCallback((type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // Auto-generate slug & meta title from title (new posts only)
  useEffect(() => {
    if (!isEdit && title) {
      const generated = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      setSlug(generated);
      setMetaTitle(`${title} | Drawdown`);
      setCanonicalUrl(`https://drawdown.trading/blog/${generated}`);
    }
  }, [title, isEdit]);

  // Auto-populate meta description from subtitle
  useEffect(() => {
    if (!isEdit && subtitle) {
      setMetaDescription(subtitle.slice(0, 160));
    }
  }, [subtitle, isEdit]);

  // Keep canonical in sync with slug
  useEffect(() => {
    if (slug) {
      setCanonicalUrl(`https://drawdown.trading/blog/${slug}`);
    }
  }, [slug]);

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      showToast("error", "Only JPG, PNG, and WebP images are accepted.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast("error", "Hero image must be under 2MB.");
      return;
    }

    setHeroUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const filename = `heroes/${slug || "post"}-${Date.now()}.${ext}`;
      const { data, error } = await supabase.storage
        .from("blog-assets")
        .upload(filename, file, { upsert: true, contentType: file.type });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("blog-assets").getPublicUrl(data.path);
      setHeroImageUrl(urlData.publicUrl);
      if (!heroImageAlt) setHeroImageAlt(title);
      showToast("success", "Hero image uploaded.");
    } catch (err: any) {
      showToast("error", err.message || "Upload failed.");
    } finally {
      setHeroUploading(false);
    }
  };

  const handleSave = async (publish?: boolean) => {
    const body = editor?.getHTML() || "";
    if (!title || !slug || !body) {
      showToast("error", "Title, Slug, and Body content are required.");
      return;
    }

    setSaving(true);
    try {
      const res = await saveBlogPostAction({
        id: post?.id,
        title,
        slug,
        category,
        eyebrow,
        subtitle,
        body,
        hero_image_url: heroImageUrl,
        hero_image_alt: heroImageAlt,
        read_time: readTime,
        published_at: publishedAt ? new Date(publishedAt).toISOString() : undefined,
        is_published: publish !== undefined ? publish : isPublished,
        dark_background: darkBackground,
        meta_title: metaTitle,
        meta_description: metaDescription,
        og_title: ogTitle,
        og_description: ogDescription,
        og_image_url: ogImageUrl,
        canonical_url: canonicalUrl,
        no_index: noIndex,
        focus_keyword: focusKeyword,
      });

      if (res.success) {
        showToast("success", publish ? "Post published!" : "Draft saved.");
        if (publish) setIsPublished(true);
        // Redirect to edit URL if new post
        if (!post?.id && res.postId) {
          setTimeout(() => { window.location.href = `/admin/blog/${res.postId}`; }, 800);
        }
      }
    } catch (err: any) {
      showToast("error", err.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!post?.id) return;
    setDeleting(true);
    try {
      await deleteBlogPostAction(post.id);
      window.location.href = "/admin/blog";
    } catch (err: any) {
      showToast("error", err.message || "Delete failed.");
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt) { showToast("error", "Please enter a prompt."); return; }
    setGenerating(true);
    try {
      const res = await generateBlogWithAIAction(aiPrompt);
      if (!res.success || !res.blog) throw new Error(res.error || "Generation failed.");
      const { title: t, slug: s, category: c, excerpt: ex, body: b, eyebrow: ey } = res.blog;
      setTitle(t || ""); setSlug(s || ""); setCategory(c || "Market Analysis");
      setSubtitle(ex || ""); setEyebrow(ey || "");
      if (b) editor?.commands.setContent(b);
      setMetaTitle(`${t} | Drawdown`);
      setMetaDescription(ex?.slice(0, 160) || "");
      setShowAiModal(false);
    } catch (err: any) {
      showToast("error", err.message || "AI generation failed.");
    } finally {
      setGenerating(false);
    }
  };

  // Google preview (live)
  const previewTitle = metaTitle || title;
  const previewDesc = metaDescription || subtitle;
  const previewUrl = `drawdown.trading/blog/${slug || "your-post-slug"}`;

  const SectionToggle = ({ label, open, onToggle }: { label: string; open: boolean; onToggle: () => void }) => (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between text-[10px] font-mono font-bold text-mkt-i3 uppercase tracking-widest cursor-pointer py-3 border-b border-mkt-bd hover:text-mkt-ink transition-colors"
    >
      {label}
      <span className="text-mkt-i4">{open ? "▲" : "▼"}</span>
    </button>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-mkt-bd pb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/blog" className="p-1 border border-mkt-bd hover:bg-neutral-50 text-mkt-i3 hover:text-mkt-ink rounded transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-3xl font-display font-black uppercase text-mkt-ink tracking-tight">
              {isEdit ? "Edit Post" : "New Post"}
            </h1>
            <p className="text-xs text-mkt-i3 font-mono uppercase tracking-widest mt-1">
              {isEdit ? "Modify existing article" : "Publish a new piece"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowAiModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-neutral-100 border border-mkt-bd hover:bg-neutral-200 text-mkt-ink text-xs font-mono font-bold uppercase tracking-widest transition-all cursor-pointer rounded-lg"
        >
          <Sparkles className="w-4 h-4 text-mkt-grn" />
          Generate with AI
        </button>
      </div>

      {/* Two-Column Layout: 65% / 35% */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
        {/* ── LEFT COLUMN: Content ── */}
        <div className="space-y-6">
          <div className="bg-white border border-mkt-bd p-6 rounded-xl space-y-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">

            {/* Eyebrow */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-mkt-i3 uppercase tracking-wider block">
                Eyebrow / Category Label
              </label>
              <input type="text" value={eyebrow} onChange={(e) => setEyebrow(e.target.value.toUpperCase())}
                placeholder="TRADING EDUCATION"
                className="w-full bg-neutral-50 border border-mkt-bd rounded px-4 py-3 text-sm text-mkt-ink font-mono outline-none focus:border-mkt-ink transition-colors placeholder:text-mkt-i4 focus:ring-1 focus:ring-mkt-ink"
              />
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-mkt-i3 uppercase tracking-wider block">
                Title <span className="text-rose-500">*</span>
              </label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a compelling title…"
                className="w-full bg-neutral-50 border border-mkt-bd rounded px-4 py-3 text-lg font-display font-bold text-mkt-ink outline-none focus:border-mkt-ink transition-colors placeholder:text-mkt-i4 focus:ring-1 focus:ring-mkt-ink"
              />
            </div>

            {/* Subtitle */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-mkt-i3 uppercase tracking-wider block">
                Subtitle / Lead
              </label>
              <textarea value={subtitle} onChange={(e) => setSubtitle(e.target.value)} rows={2}
                placeholder="One-sentence hook that appears under the title…"
                className="w-full bg-neutral-50 border border-mkt-bd rounded px-4 py-3 text-sm text-mkt-ink font-sans outline-none focus:border-mkt-ink transition-colors placeholder:text-mkt-i4 focus:ring-1 focus:ring-mkt-ink resize-none"
              />
            </div>

            {/* Slug & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-mkt-i3 uppercase tracking-wider block">
                  Slug <span className="text-rose-500">*</span>
                </label>
                <input type="text" required value={slug} onChange={(e) => setSlug(e.target.value)}
                  placeholder="post-url-slug"
                  className="w-full bg-neutral-50 border border-mkt-bd rounded px-4 py-3 text-sm text-mkt-ink font-mono outline-none focus:border-mkt-ink transition-colors focus:ring-1 focus:ring-mkt-ink"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-mkt-i3 uppercase tracking-wider block">
                  Category
                </label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-neutral-50 border border-mkt-bd rounded px-4 py-3 text-sm text-mkt-ink outline-none focus:border-mkt-ink transition-colors focus:ring-1 focus:ring-mkt-ink"
                >
                  {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>

            {/* Hero Image */}
            <div className="space-y-3">
              <label className="text-[10px] font-mono font-bold text-mkt-i3 uppercase tracking-wider block">
                Hero Image
              </label>
              {heroImageUrl && (
                <div className="relative aspect-[16/9] w-full overflow-hidden border border-mkt-bd rounded-lg">
                  <Image src={heroImageUrl} alt={heroImageAlt || "Hero"} fill className="object-cover" />
                  <button type="button" onClick={() => setHeroImageUrl("")}
                    className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-3">
                <label className={`flex items-center gap-2 px-4 py-2 border border-mkt-bd hover:bg-neutral-50 text-mkt-ink text-xs font-mono font-bold uppercase tracking-wider transition-all rounded-lg cursor-pointer ${heroUploading ? "opacity-50 pointer-events-none" : ""}`}>
                  {heroUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  {heroUploading ? "Uploading…" : "Upload Image"}
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleHeroUpload} className="hidden" />
                </label>
                <span className="text-[10px] text-mkt-i4 font-mono">or paste URL:</span>
                <input type="url" value={heroImageUrl} onChange={(e) => setHeroImageUrl(e.target.value)}
                  placeholder="https://…"
                  className="flex-1 bg-neutral-50 border border-mkt-bd rounded px-3 py-2 text-xs text-mkt-ink font-mono outline-none focus:border-mkt-ink transition-colors"
                />
              </div>
              <input type="text" value={heroImageAlt} onChange={(e) => setHeroImageAlt(e.target.value)}
                placeholder="Alt text description…"
                className="w-full bg-neutral-50 border border-mkt-bd rounded px-4 py-2 text-xs text-mkt-ink font-sans outline-none focus:border-mkt-ink transition-colors placeholder:text-mkt-i4"
              />
            </div>

            {/* TipTap Body Editor */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-mkt-i3 uppercase tracking-wider block">
                Body Content <span className="text-rose-500">*</span>
              </label>
              <div className="border border-mkt-bd rounded-lg overflow-hidden bg-white">
                <TiptapToolbar editor={editor} />
                <EditorContent editor={editor} />
              </div>
            </div>

            {/* Read Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-mkt-i3 uppercase tracking-wider block">
                  Read Time
                </label>
                <input type="text" value={readTime} onChange={(e) => setReadTime(e.target.value)}
                  placeholder="9 min read"
                  className="w-full bg-neutral-50 border border-mkt-bd rounded px-4 py-3 text-sm text-mkt-ink font-mono outline-none focus:border-mkt-ink transition-colors placeholder:text-mkt-i4"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-mkt-i3 uppercase tracking-wider block">
                  Published Date
                </label>
                <input type="datetime-local" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)}
                  className="w-full bg-neutral-50 border border-mkt-bd rounded px-4 py-3 text-sm text-mkt-ink font-mono outline-none focus:border-mkt-ink transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: SEO + Publish ── */}
        <div className="space-y-5">

          {/* SEO Panel */}
          <div className="bg-white border border-mkt-bd rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="px-6 pt-6 pb-2">
              <h3 className="text-xs font-mono uppercase tracking-widest text-mkt-i3 font-bold">
                // SEO &amp; Metadata
              </h3>
            </div>

            {/* Search Appearance */}
            <div className="px-6 pb-4 space-y-4">
              <SectionToggle label="Search Appearance" open={seoOpen} onToggle={() => setSeoOpen(!seoOpen)} />
              {seoOpen && (
                <div className="space-y-4 pt-2">
                  {/* Meta Title */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-mono font-bold text-mkt-i3 uppercase tracking-wider">Meta Title</label>
                      <span className={`text-[10px] font-mono ${metaTitle.length > 60 ? "text-red-500 font-bold" : "text-mkt-i4"}`}>
                        {metaTitle.length}/60
                      </span>
                    </div>
                    <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)}
                      placeholder={title ? `${title} | Drawdown` : "Custom meta title…"}
                      className={`w-full bg-neutral-50 border rounded px-3 py-2 text-xs text-mkt-ink outline-none transition-colors font-sans ${metaTitle.length > 60 ? "border-red-300 focus:border-red-400" : "border-mkt-bd focus:border-mkt-ink"}`}
                    />
                  </div>

                  {/* Meta Description */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-mono font-bold text-mkt-i3 uppercase tracking-wider">Meta Description</label>
                      <span className={`text-[10px] font-mono ${metaDescription.length > 160 ? "text-red-500 font-bold" : "text-mkt-i4"}`}>
                        {metaDescription.length}/160
                      </span>
                    </div>
                    <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3}
                      placeholder="SEO description that appears in Google results…"
                      className={`w-full bg-neutral-50 border rounded px-3 py-2 text-xs text-mkt-ink outline-none transition-colors font-sans resize-none ${metaDescription.length > 160 ? "border-red-300 focus:border-red-400" : "border-mkt-bd focus:border-mkt-ink"}`}
                    />
                  </div>

                  {/* Focus Keyword */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold text-mkt-i3 uppercase tracking-wider block">Focus Keyword</label>
                    <input type="text" value={focusKeyword} onChange={(e) => setFocusKeyword(e.target.value)}
                      placeholder="e.g. trading education UK"
                      className="w-full bg-neutral-50 border border-mkt-bd rounded px-3 py-2 text-xs text-mkt-ink outline-none focus:border-mkt-ink transition-colors font-sans"
                    />
                  </div>

                  {/* Google Preview */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold text-mkt-i3 uppercase tracking-wider block">Google Preview</label>
                    <div className="border border-mkt-bd rounded-lg p-4 bg-neutral-50 space-y-1">
                      <p className="text-[11px] text-green-700 font-mono truncate">{previewUrl}</p>
                      <p className="text-[13px] text-blue-600 font-sans leading-tight truncate hover:underline cursor-default">
                        {previewTitle || "Your post title here"}
                      </p>
                      <p className="text-[11px] text-neutral-500 font-sans leading-relaxed line-clamp-2">
                        {previewDesc || "Your meta description will appear here. Make it compelling and under 160 characters."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Social Sharing */}
              <SectionToggle label="Social Sharing" open={socialOpen} onToggle={() => setSocialOpen(!socialOpen)} />
              {socialOpen && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold text-mkt-i3 uppercase tracking-wider block">OG Title</label>
                    <input type="text" value={ogTitle} onChange={(e) => setOgTitle(e.target.value)}
                      placeholder={metaTitle || "Falls back to Meta Title"}
                      className="w-full bg-neutral-50 border border-mkt-bd rounded px-3 py-2 text-xs text-mkt-ink outline-none focus:border-mkt-ink transition-colors font-sans"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold text-mkt-i3 uppercase tracking-wider block">OG Description</label>
                    <textarea value={ogDescription} onChange={(e) => setOgDescription(e.target.value)} rows={2}
                      placeholder={metaDescription || "Falls back to Meta Description"}
                      className="w-full bg-neutral-50 border border-mkt-bd rounded px-3 py-2 text-xs text-mkt-ink outline-none focus:border-mkt-ink transition-colors font-sans resize-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold text-mkt-i3 uppercase tracking-wider block">OG Image URL</label>
                    <input type="url" value={ogImageUrl} onChange={(e) => setOgImageUrl(e.target.value)}
                      placeholder={heroImageUrl || "1200 × 630px recommended"}
                      className="w-full bg-neutral-50 border border-mkt-bd rounded px-3 py-2 text-xs text-mkt-ink font-mono outline-none focus:border-mkt-ink transition-colors"
                    />
                    {ogImageUrl && (
                      <div className="mt-2 aspect-[1200/630] w-full overflow-hidden border border-mkt-bd rounded relative">
                        <Image src={ogImageUrl} alt="OG Preview" fill className="object-cover" />
                      </div>
                    )}
                    <p className="text-[10px] text-mkt-i4 font-mono">1200 × 630px recommended</p>
                  </div>
                </div>
              )}

              {/* Advanced */}
              <SectionToggle label="Advanced" open={advancedOpen} onToggle={() => setAdvancedOpen(!advancedOpen)} />
              {advancedOpen && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold text-mkt-i3 uppercase tracking-wider block">Canonical URL</label>
                    <input type="url" value={canonicalUrl} onChange={(e) => setCanonicalUrl(e.target.value)}
                      className="w-full bg-neutral-50 border border-mkt-bd rounded px-3 py-2 text-xs text-mkt-ink font-mono outline-none focus:border-mkt-ink transition-colors"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono font-bold text-mkt-i3 uppercase tracking-wider block">Hide from Search Engines</span>
                      <span className="text-[9px] text-mkt-i4">Sets noindex on this post</span>
                    </div>
                    <button type="button" onClick={() => setNoIndex(!noIndex)}
                      className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${noIndex ? "bg-red-400" : "bg-neutral-200"}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${noIndex ? "translate-x-6" : "translate-x-0"}`} />
                    </button>
                  </div>
                  {noIndex && (
                    <p className="text-[10px] font-mono text-red-500 font-bold">
                      ⚠ This post will not appear in Google search results.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Publish Settings */}
          <div className="bg-white border border-mkt-bd p-6 rounded-xl space-y-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <h3 className="text-xs font-mono uppercase tracking-widest text-mkt-i3 font-bold border-b border-mkt-bd pb-4">
              // Publish Settings
            </h3>

            {/* Background Theme Toggle */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono font-bold text-mkt-i3 uppercase tracking-wider block">
                    Background Theme
                  </span>
                  {darkBackground ? (
                    <span className="text-[9px] font-mono font-bold" style={{ color: "#C8F135" }}>
                      Dark — From Pete
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono text-mkt-i4">
                      Light — General Editorial
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {/* Swatch Preview */}
                  <div
                    className="w-8 h-8 border border-mkt-bd rounded flex items-center justify-center shrink-0 transition-colors"
                    style={{ backgroundColor: darkBackground ? "#0A0A0A" : "#FFFFFF" }}
                  >
                    {darkBackground ? (
                      <Moon className="w-3.5 h-3.5" style={{ color: "#C8F135" }} />
                    ) : (
                      <Sun className="w-3.5 h-3.5 text-mkt-i3" />
                    )}
                  </div>
                  {/* Toggle */}
                  <button
                    type="button"
                    onClick={() => setDarkBackground(!darkBackground)}
                    className="w-12 h-6 rounded-full p-0.5 transition-colors duration-200 cursor-pointer"
                    style={{ backgroundColor: darkBackground ? "#C8F135" : "#D1D5DB" }}
                  >
                    <div
                      className={`w-5 h-5 rounded-full shadow transition-transform duration-200 ${darkBackground ? "translate-x-6" : "translate-x-0"}`}
                      style={{ backgroundColor: darkBackground ? "#0A0A0A" : "#FFFFFF" }}
                    />
                  </button>
                </div>
              </div>
              <p className="text-[9px] text-mkt-i4 font-sans">
                {darkBackground
                  ? "Dark #0A0A0A background. Opinion pieces and Pete's voice."
                  : "Standard blog layout. Used for Drawdown Team posts."}
              </p>
            </div>

            {/* Published Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-bold text-mkt-i3 uppercase tracking-wider block">Status</span>
                <span className="text-[9px] text-mkt-i4">
                  {isPublished ? "Live on the site" : "Hidden from readers"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-mono font-bold uppercase ${isPublished ? "text-mkt-grn" : "text-mkt-i4"}`}>
                  {isPublished ? "Published" : "Draft"}
                </span>
                <button type="button" onClick={() => setIsPublished(!isPublished)}
                  className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${isPublished ? "bg-mkt-grn" : "bg-neutral-200"}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${isPublished ? "translate-x-6" : "translate-x-0"}`} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button type="button" onClick={() => handleSave(false)} disabled={saving}
                className="w-full py-3 border border-mkt-bd hover:bg-neutral-50 text-mkt-ink text-xs font-mono font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer rounded-lg disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Draft
              </button>
              <button type="button" onClick={() => handleSave(true)} disabled={saving}
                className="w-full py-3 bg-mkt-ink hover:bg-mkt-i2 disabled:opacity-60 text-white text-xs font-mono font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer rounded-lg shadow-md"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                Publish
              </button>
              {isEdit && (
                <button type="button" onClick={() => setShowDeleteModal(true)}
                  className="w-full py-2.5 border border-red-100 hover:border-red-200 hover:bg-red-50 text-red-400 hover:text-red-500 text-xs font-mono font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer rounded-lg"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Post
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white border border-mkt-bd max-w-sm w-full rounded-xl p-8 space-y-5 shadow-2xl">
            <div className="space-y-2">
              <h3 className="text-xl font-display font-bold uppercase text-mkt-ink">Delete Post?</h3>
              <p className="text-sm text-mkt-i3 font-sans leading-relaxed">
                This will permanently delete <strong>&ldquo;{title}&rdquo;</strong> and cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowDeleteModal(false)} disabled={deleting}
                className="flex-1 py-3 bg-neutral-100 hover:bg-neutral-200 text-mkt-ink text-xs font-mono font-bold uppercase tracking-widest transition-all cursor-pointer rounded-lg border border-mkt-bd"
              >
                Cancel
              </button>
              <button type="button" onClick={handleDelete} disabled={deleting}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-mono font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer rounded-lg"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Claude AI Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white border border-mkt-bd max-w-lg w-full rounded-xl p-8 relative overflow-hidden shadow-2xl space-y-6">
            <div className="absolute top-0 left-0 right-0 h-1 bg-mkt-ink" />
            <div className="space-y-2 text-center">
              <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6 text-mkt-ink" />
              </div>
              <h3 className="text-xl font-display font-bold uppercase text-mkt-ink">Generate with Claude</h3>
              <p className="text-xs text-mkt-i3">
                Claude will write a full article in Pete's honest, direct brand voice.
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold text-mkt-i3 uppercase tracking-wider block">Topic / Instructions</label>
              <textarea value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} disabled={generating} rows={4}
                placeholder="e.g. Write a post about GBP/USD price action after the Bank of England decision…"
                className="w-full bg-neutral-50 border border-mkt-bd rounded p-4 text-xs text-mkt-ink outline-none focus:border-mkt-ink transition-colors placeholder:text-mkt-i4 resize-none"
              />
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={() => setShowAiModal(false)} disabled={generating}
                className="flex-1 py-3 bg-neutral-100 hover:bg-neutral-200 text-mkt-ink text-xs font-mono font-bold uppercase tracking-widest transition-all cursor-pointer border border-mkt-bd rounded-lg"
              >
                Cancel
              </button>
              <button type="button" onClick={handleAiGenerate} disabled={generating}
                className="flex-1 py-3 bg-mkt-ink hover:bg-mkt-i2 disabled:opacity-50 text-white text-xs font-mono font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer rounded-lg"
              >
                {generating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</> : <><Sparkles className="w-4 h-4" /> Generate</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[400] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl border text-sm font-sans animate-in slide-in-from-bottom-4 duration-300 ${toast.type === "success" ? "bg-white border-mkt-gbd text-mkt-grn" : "bg-white border-red-200 text-red-600"}`}>
          {toast.type === "success" ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          {toast.message}
        </div>
      )}
    </div>
  );
}
