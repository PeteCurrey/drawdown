"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { 
  LobbyArticle, 
  LobbyCategory, 
  LobbyArticleType, 
  LobbyStatus, 
  LobbyConfidence, 
  LobbyImportance, 
  LobbySection, 
  LobbySource,
  LobbyAuditLog 
} from "@/types/lobby";
import { LOBBY_CATEGORIES, LOBBY_ARTICLE_TYPES, DRAWDOWN_TOOLS, DRAWDOWN_ENTITIES } from "@/lib/lobby";
import { validateLobbyArticleGuardrails } from "@/lib/lobby/guardrails";
import { 
  Save, 
  Send, 
  CheckCircle2, 
  Archive, 
  Eye, 
  Plus, 
  Trash2, 
  AlertTriangle,
  ArrowLeft,
  Clock,
  ShieldCheck
} from "lucide-react";

interface LobbyArticleEditorProps {
  initialArticle?: LobbyArticle | null;
  auditLogs?: LobbyAuditLog[];
}

export function LobbyArticleEditor({ initialArticle, auditLogs = [] }: LobbyArticleEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isEditing = !!initialArticle?.id;

  // Form State
  const [title, setTitle] = useState(initialArticle?.title || "");
  const [slug, setSlug] = useState(initialArticle?.slug || "");
  const [excerpt, setExcerpt] = useState(initialArticle?.excerpt || "");
  const [body, setBody] = useState(initialArticle?.body || "");
  const [category, setCategory] = useState<LobbyCategory>(initialArticle?.category || "MARKETS");
  const [subcategory, setSubcategory] = useState(initialArticle?.subcategory || "");
  const [articleType, setArticleType] = useState<LobbyArticleType>(initialArticle?.article_type || "NEWS");
  const [status, setStatus] = useState<LobbyStatus>(initialArticle?.status || "DRAFT");
  const [confidence, setConfidence] = useState<LobbyConfidence>(initialArticle?.confidence || "VERIFIED");
  const [importance, setImportance] = useState<LobbyImportance>(initialArticle?.importance || "standard");
  const [section, setSection] = useState<LobbySection>(initialArticle?.section || "standard");
  const [authorName, setAuthorName] = useState(initialArticle?.author_name || "Pete Currey");
  const [authorRole, setAuthorRole] = useState(initialArticle?.author_role || "Founder & Head of Trading");
  const [heroImageUrl, setHeroImageUrl] = useState(initialArticle?.hero_image_url || "");
  const [heroImageAlt, setHeroImageAlt] = useState(initialArticle?.hero_image_alt || "");
  const [heroImageCaption, setHeroImageCaption] = useState(initialArticle?.hero_image_caption || "");
  const [heroImageCredit, setHeroImageCredit] = useState(initialArticle?.hero_image_credit || "");
  const [readingTime, setReadingTime] = useState(initialArticle?.reading_time_minutes || 4);
  const [tags, setTags] = useState(initialArticle?.tags?.join(", ") || "");

  // Sources State
  const [sources, setSources] = useState<LobbySource[]>(
    initialArticle?.sources?.length 
      ? initialArticle.sources 
      : [{ name: "", url: "", source_type: "Regulatory Filing", classification: "primary", notes: "" }]
  );

  // Relationships State
  const [selectedTools, setSelectedTools] = useState<string[]>(initialArticle?.related_tool_slugs || []);
  const [selectedBrokers, setSelectedBrokers] = useState<string[]>(initialArticle?.related_broker_slugs || []);
  const [selectedPropFirms, setSelectedPropFirms] = useState<string[]>(initialArticle?.related_prop_firm_slugs || []);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(initialArticle?.related_platform_slugs || []);
  const [relatedMarkets, setRelatedMarkets] = useState(initialArticle?.related_markets?.join(", ") || "");

  // SEO Fields
  const [metaTitle, setMetaTitle] = useState(initialArticle?.meta_title || "");
  const [metaDescription, setMetaDescription] = useState(initialArticle?.meta_description || "");
  const [schemaType, setSchemaType] = useState<'Article' | 'NewsArticle'>(initialArticle?.schema_type || "Article");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Auto-generate slug from title if new
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!isEditing && !slug) {
      setSlug(
        newTitle
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-")
          .replace(/^-+|-+$/g, "")
      );
    }
  };

  // Add & Remove Sources
  const addSource = () => {
    setSources(prev => [
      ...prev,
      { name: "", url: "", source_type: "Official Release", classification: "primary", notes: "" }
    ]);
  };

  const removeSource = (index: number) => {
    setSources(prev => prev.filter((_, i) => i !== index));
  };

  const updateSource = (index: number, field: keyof LobbySource, value: any) => {
    setSources(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Toggle relations
  const toggleTool = (toolSlug: string) => {
    setSelectedTools(prev => 
      prev.includes(toolSlug) ? prev.filter(s => s !== toolSlug) : [...prev, toolSlug]
    );
  };

  const toggleBroker = (brokerSlug: string) => {
    setSelectedBrokers(prev =>
      prev.includes(brokerSlug) ? prev.filter(s => s !== brokerSlug) : [...prev, brokerSlug]
    );
  };

  const togglePropFirm = (propFirmSlug: string) => {
    setSelectedPropFirms(prev =>
      prev.includes(propFirmSlug) ? prev.filter(s => s !== propFirmSlug) : [...prev, propFirmSlug]
    );
  };

  // Live guardrails validation
  const currentPayload: Partial<LobbyArticle> = {
    title,
    slug,
    excerpt,
    body,
    category,
    article_type: articleType,
    status,
    confidence,
    sources: sources.filter(s => s.name || s.url),
    meta_description: metaDescription
  };
  const guardrails = validateLobbyArticleGuardrails(currentPayload, status);

  // Submit Handler
  const handleSave = async (targetStatus: LobbyStatus) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate for targeted status
    const targetValidation = validateLobbyArticleGuardrails(currentPayload, targetStatus);
    if (targetStatus === 'PUBLISHED' && !targetValidation.canPublish) {
      setErrorMessage(targetValidation.errors.join(" "));
      return;
    }

    const payload: Partial<LobbyArticle> = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim(),
      body: body.trim(),
      category,
      subcategory: subcategory.trim() || null,
      article_type: articleType,
      status: targetStatus,
      confidence,
      importance,
      section,
      author_name: authorName.trim(),
      author_role: authorRole.trim() || null,
      hero_image_url: heroImageUrl.trim() || null,
      hero_image_alt: heroImageAlt.trim() || null,
      hero_image_caption: heroImageCaption.trim() || null,
      hero_image_credit: heroImageCredit.trim() || null,
      reading_time_minutes: Number(readingTime) || 4,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      sources: sources.filter(s => s.name && s.url),
      primary_source_name: sources[0]?.name || null,
      primary_source_url: sources[0]?.url || null,
      primary_source_type: sources[0]?.source_type || null,
      primary_source_classification: sources[0]?.classification || 'primary',
      related_tool_slugs: selectedTools,
      related_broker_slugs: selectedBrokers,
      related_prop_firm_slugs: selectedPropFirms,
      related_platform_slugs: selectedPlatforms,
      related_markets: relatedMarkets.split(",").map(m => m.trim().toUpperCase()).filter(Boolean),
      meta_title: metaTitle.trim() || null,
      meta_description: metaDescription.trim() || null,
      schema_type: schemaType,
    };

    startTransition(async () => {
      try {
        const url = isEditing 
          ? `/api/admin/lobby/${initialArticle.id}` 
          : `/api/admin/lobby`;
        const method = isEditing ? "PUT" : "POST";

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!res.ok) {
          const errList = data.errors ? data.errors.join("; ") : (data.error || "Save failed");
          setErrorMessage(errList);
        } else {
          setSuccessMessage(`Article successfully saved as ${targetStatus}!`);
          setStatus(targetStatus);
          if (!isEditing && data.article?.id) {
            router.push(`/admin/lobby/${data.article.id}`);
          } else {
            router.refresh();
          }
        }
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to communicate with API.");
      }
    });
  };

  return (
    <div className="space-y-8 max-w-5xl pb-16">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-mkt-bd">
        <div className="flex items-center gap-2">
          <Link 
            href="/admin/lobby" 
            className="inline-flex items-center gap-1 text-xs font-mono text-mkt-i3 hover:text-mkt-ink uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All Stories
          </Link>
          <span className="text-mkt-bd">•</span>
          <span className="text-xs font-mono text-mkt-i4 uppercase tracking-widest">
            {isEditing ? "EDITING STORY" : "NEW EDITORIAL DISPATCH"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isEditing && (
            <Link
              href={`/lobby/preview/${initialArticle.id}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-mkt-bd text-xs font-mono rounded-lg hover:bg-neutral-50 text-mkt-ink"
            >
              <Eye className="w-3.5 h-3.5" /> Preview
            </Link>
          )}

          <button
            type="button"
            disabled={isPending}
            onClick={() => handleSave("DRAFT")}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-mkt-bd text-xs font-mono rounded-lg hover:bg-neutral-50 text-mkt-ink"
          >
            <Save className="w-3.5 h-3.5" /> Save Draft
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={() => handleSave("REVIEW")}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono rounded-lg hover:bg-amber-100 font-semibold"
          >
            <Send className="w-3.5 h-3.5" /> Submit Review
          </button>

          {status === "PUBLISHED" ? (
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleSave("DRAFT")}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono rounded-lg hover:bg-rose-100 font-semibold"
            >
              <Archive className="w-3.5 h-3.5" /> Unpublish
            </button>
          ) : (
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleSave("PUBLISHED")}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#16213E] text-white text-xs font-mono font-semibold rounded-lg hover:bg-black transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Publish Live
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-900 rounded-lg text-xs font-mono flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg text-xs font-mono flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Main Content (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Headline & Slug */}
          <div className="bg-white p-6 border border-mkt-bd rounded-xl space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-mkt-i3 mb-1.5 font-bold">
                Headline / Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={e => handleTitleChange(e.target.value)}
                placeholder="e.g. FCA Issues Supervisory Alert on CFD Margin Practices"
                className="w-full text-base sm:text-lg font-display font-semibold px-3 py-2 bg-neutral-50/50 border border-mkt-bd rounded-lg focus:outline-none focus:border-mkt-ink"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-mkt-i4 mb-1">
                Canonical URL Slug *
              </label>
              <div className="flex items-center text-xs font-mono bg-neutral-50 border border-mkt-bd rounded-lg overflow-hidden">
                <span className="px-3 text-mkt-i4 bg-neutral-100 py-2 border-r border-mkt-bd">
                  /lobby/{category.toLowerCase().replace(/\s+/g, '-')}/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  placeholder="fca-issues-supervisory-alert-cfd"
                  className="flex-1 px-3 py-2 bg-transparent focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-mkt-i3 mb-1.5 font-bold">
                Deck / Excerpt (Lead Paragraph) *
              </label>
              <textarea
                rows={3}
                value={excerpt}
                onChange={e => setExcerpt(e.target.value)}
                placeholder="2-3 sentence executive summary explaining the core development and market significance..."
                className="w-full text-xs font-sans px-3 py-2 bg-neutral-50/50 border border-mkt-bd rounded-lg focus:outline-none focus:border-mkt-ink"
              />
            </div>
          </div>

          {/* Body Editor */}
          <div className="bg-white p-6 border border-mkt-bd rounded-xl space-y-2">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-mono uppercase tracking-wider text-mkt-i3 font-bold">
                Article Body (Markdown / Text) *
              </label>
              <span className="text-[10px] font-mono text-mkt-i4">
                {body.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
            <textarea
              rows={16}
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Full article content formatted with paragraphs. Be factual, concise, and cite documentation..."
              className="w-full text-xs sm:text-sm font-sans px-4 py-3 bg-neutral-50/50 border border-mkt-bd rounded-lg focus:outline-none focus:border-mkt-ink font-mono leading-relaxed"
            />
          </div>

          {/* First-Class Source Builder */}
          <div className="bg-white p-6 border border-mkt-bd rounded-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-mkt-bd">
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-mkt-ink">
                  Documented Sources &amp; Evidence
                </h3>
                <p className="text-[11px] text-mkt-i4 font-sans">
                  Mandatory for News, Broker Watch, and Prop Firm Watch. Separates external facts from Drawdown analysis.
                </p>
              </div>
              <button
                type="button"
                onClick={addSource}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono bg-neutral-100 border border-mkt-bd rounded-lg hover:bg-neutral-200"
              >
                <Plus className="w-3 h-3" /> Add Source
              </button>
            </div>

            <div className="space-y-3">
              {sources.map((s, idx) => (
                <div key={idx} className="p-3.5 bg-neutral-50 border border-mkt-bd rounded-lg space-y-3 relative">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-mkt-i4 mb-1">
                        Source Name *
                      </label>
                      <input
                        type="text"
                        value={s.name}
                        onChange={e => updateSource(idx, "name", e.target.value)}
                        placeholder="e.g. FCA Register / Official Statement"
                        className="w-full text-xs font-mono px-2.5 py-1.5 bg-white border border-mkt-bd rounded focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-mkt-i4 mb-1">
                        Source URL *
                      </label>
                      <input
                        type="url"
                        value={s.url}
                        onChange={e => updateSource(idx, "url", e.target.value)}
                        placeholder="https://..."
                        className="w-full text-xs font-mono px-2.5 py-1.5 bg-white border border-mkt-bd rounded focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 items-center">
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-mkt-i4 mb-1">
                        Type
                      </label>
                      <input
                        type="text"
                        value={s.source_type}
                        onChange={e => updateSource(idx, "source_type", e.target.value)}
                        placeholder="Regulatory / Press"
                        className="w-full text-xs font-mono px-2.5 py-1 bg-white border border-mkt-bd rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-mkt-i4 mb-1">
                        Classification
                      </label>
                      <select
                        value={s.classification}
                        onChange={e => updateSource(idx, "classification", e.target.value)}
                        className="w-full text-xs font-mono px-2 py-1 bg-white border border-mkt-bd rounded"
                      >
                        <option value="primary">Primary Source</option>
                        <option value="secondary">Secondary Source</option>
                      </select>
                    </div>
                    <div className="flex justify-end pt-3 sm:pt-0">
                      {sources.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSource(idx)}
                          className="text-rose-600 hover:text-rose-800 text-xs font-mono inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Taxonomies, Relations & Audit (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quality Guardrails Status Card */}
          <div className="bg-white p-5 border border-mkt-bd rounded-xl">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-mkt-ink mb-2">
              Quality &amp; Publishing Guardrails
            </h4>
            {guardrails.errors.length > 0 ? (
              <ul className="space-y-1.5 text-xs text-rose-700 font-mono">
                {guardrails.errors.map((err, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-rose-600 font-bold">•</span>
                    <span>{err}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-xs font-mono text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>All publication guardrails satisfied. Ready for live deployment.</span>
              </div>
            )}
          </div>

          {/* Editorial Classification */}
          <div className="bg-white p-5 border border-mkt-bd rounded-xl space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-mkt-ink border-b border-mkt-bd pb-2">
              Taxonomy &amp; Placement
            </h4>

            <div>
              <label className="block text-[10px] font-mono uppercase text-mkt-i4 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as LobbyCategory)}
                className="w-full text-xs font-mono px-3 py-1.5 bg-neutral-50 border border-mkt-bd rounded-lg"
              >
                {LOBBY_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-mkt-i4 mb-1">
                Structured Article Type *
              </label>
              <select
                value={articleType}
                onChange={e => setArticleType(e.target.value as LobbyArticleType)}
                className="w-full text-xs font-mono px-3 py-1.5 bg-neutral-50 border border-mkt-bd rounded-lg"
              >
                {LOBBY_ARTICLE_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-mkt-i4 mb-1">
                Homepage Section Destination
              </label>
              <select
                value={section}
                onChange={e => setSection(e.target.value as LobbySection)}
                className="w-full text-xs font-mono px-3 py-1.5 bg-neutral-50 border border-mkt-bd rounded-lg"
              >
                <option value="standard">Standard Chronological Feed</option>
                <option value="lead">Lead Story (Top Hero)</option>
                <option value="whats_happening">What&apos;s Happening (Desk Grid)</option>
                <option value="just_in">Just In (Wire Ticker)</option>
                <option value="broker_watch">Broker Watch Feature</option>
                <option value="prop_firm_watch">Prop Firm Watch Feature</option>
                <option value="platform_spotlight">Platform Spotlight</option>
                <option value="trade_of_the_month">Trade of the Month</option>
                <option value="drawdown_desk">Drawdown Desk Original</option>
                <option value="explained">Explained Educational Primer</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono uppercase text-mkt-i4 mb-1">
                  Confidence
                </label>
                <select
                  value={confidence}
                  onChange={e => setConfidence(e.target.value as LobbyConfidence)}
                  className="w-full text-xs font-mono px-2 py-1 bg-neutral-50 border border-mkt-bd rounded-lg"
                >
                  <option value="VERIFIED">VERIFIED</option>
                  <option value="KNOWN">KNOWN</option>
                  <option value="INFERRED">INFERRED</option>
                  <option value="UNKNOWN">UNKNOWN</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-mkt-i4 mb-1">
                  Priority / Importance
                </label>
                <select
                  value={importance}
                  onChange={e => setImportance(e.target.value as LobbyImportance)}
                  className="w-full text-xs font-mono px-2 py-1 bg-neutral-50 border border-mkt-bd rounded-lg"
                >
                  <option value="lead">Lead Priority</option>
                  <option value="featured">Featured</option>
                  <option value="standard">Standard</option>
                  <option value="bulletin">Bulletin</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contextual Relationships Selector */}
          <div className="bg-white p-5 border border-mkt-bd rounded-xl space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-mkt-ink border-b border-mkt-bd pb-2">
              Contextual Relationships
            </h4>

            <div>
              <label className="block text-[10px] font-mono uppercase text-mkt-i4 mb-1.5">
                Related Drawdown Tools
              </label>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {Object.values(DRAWDOWN_TOOLS).map(tool => (
                  <label key={tool.slug} className="flex items-center gap-2 text-xs font-mono cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTools.includes(tool.slug)}
                      onChange={() => toggleTool(tool.slug)}
                      className="rounded"
                    />
                    <span>{tool.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-mkt-i4 mb-1.5">
                Related Entities (Brokers &amp; Prop Firms)
              </label>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {Object.values(DRAWDOWN_ENTITIES).map(ent => (
                  <label key={ent.slug} className="flex items-center gap-2 text-xs font-mono cursor-pointer">
                    <input
                      type="checkbox"
                      checked={
                        ent.type === 'broker' 
                          ? selectedBrokers.includes(ent.slug) 
                          : selectedPropFirms.includes(ent.slug)
                      }
                      onChange={() => ent.type === 'broker' ? toggleBroker(ent.slug) : togglePropFirm(ent.slug)}
                      className="rounded"
                    />
                    <span>{ent.name} ({ent.type})</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Audit Trail History */}
          {auditLogs.length > 0 && (
            <div className="bg-white p-5 border border-mkt-bd rounded-xl space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-mkt-ink border-b border-mkt-bd pb-2">
                Editorial Audit Trail
              </h4>
              <ol className="space-y-2 text-[11px] font-mono text-mkt-i3">
                {auditLogs.map((log) => (
                  <li key={log.id} className="pb-1.5 border-b border-neutral-100 last:border-0">
                    <div className="flex items-center justify-between text-mkt-ink font-semibold">
                      <span className="capitalize">{log.action.replace(/_/g, ' ')}</span>
                      <time className="text-[10px] text-mkt-i4 font-normal">
                        {new Date(log.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      </time>
                    </div>
                    <span className="text-[10px] text-mkt-i4 block">
                      By {log.actor_email} {log.notes && `• ${log.notes}`}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
