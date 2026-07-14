"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Edit2, Eye, Trash2, ChevronLeft, ChevronRight, Loader2, Moon, Sun } from "lucide-react";
import { deleteBlogPostAction, togglePublishAction } from "@/app/actions/admin-actions";

interface BlogPostInfo {
  id: string;
  title: string;
  category: string;
  is_published: boolean;
  dark_background?: boolean;
  published_at: string | null;
  created_at: string;
  slug: string;
}

interface BlogListClientProps {
  posts: BlogPostInfo[];
  totalRecords: number;
  currentPage: number;
  totalPages: number;
  from: number;
  to: number;
}

export function BlogListClient({
  posts: initialPosts,
  totalRecords: initialCount,
  currentPage,
  totalPages,
  from,
  to
}: BlogListClientProps) {
  const [posts, setPosts] = useState<BlogPostInfo[]>(initialPosts);
  const [totalRecords, setTotalRecords] = useState(initialCount);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    setDeletingId(id);
    try {
      const res = await deleteBlogPostAction(id);
      if (res.success) {
        setPosts(prev => prev.filter(p => p.id !== id));
        setTotalRecords(prev => prev - 1);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete post.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleTogglePublish = async (id: string, currentState: boolean) => {
    setTogglingId(id);
    try {
      const res = await togglePublishAction(id, currentState);
      if (res.success) {
        setPosts(prev => prev.map(p => p.id === id ? { ...p, is_published: res.is_published } : p));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingId(null);
    }
  };

  const getPageUrl = (page: number) => `/admin/blog?page=${page}`;

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-mkt-bd pb-6">
        <div>
          <h1 className="text-3xl font-display font-black uppercase text-mkt-ink tracking-tight">Blog Manager</h1>
          <p className="text-xs text-mkt-i3 font-mono uppercase tracking-widest mt-1">
            {totalRecords} article{totalRecords !== 1 ? "s" : ""} in the database
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/blog/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-mkt-ink hover:bg-mkt-i2 text-white text-xs font-mono font-bold uppercase tracking-widest transition-all duration-150 rounded-lg shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Post
          </Link>
          <Link href="/admin" className="text-xs font-mono uppercase tracking-widest text-mkt-i3 hover:text-mkt-ink transition-colors">
            &larr; Dashboard
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-mkt-bd p-6 rounded-xl space-y-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-mkt-i2">
            <thead>
              <tr className="border-b border-mkt-bd text-[10px] uppercase font-mono tracking-wider text-mkt-i3">
                <th className="py-3 font-semibold">Date</th>
                <th className="py-3 font-semibold">Title</th>
                <th className="py-3 font-semibold">Category</th>
                <th className="py-3 font-semibold">Theme</th>
                <th className="py-3 font-semibold">Status</th>
                <th className="py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts && posts.length > 0 ? (
                posts.map((post) => (
                  <tr key={post.id} className="border-b border-mkt-bd hover:bg-neutral-50 transition-colors">
                    <td className="py-4 font-mono text-mkt-i3 whitespace-nowrap">
                      {new Date(post.published_at || post.created_at).toLocaleDateString("en-GB", {
                        day: "numeric", month: "short", year: "numeric"
                      })}
                    </td>
                    <td className="py-4 font-semibold text-mkt-ink max-w-[260px] truncate pr-4">
                      {post.title}
                    </td>
                    <td className="py-4 font-mono text-[10px] text-mkt-i3 whitespace-nowrap">
                      {post.category}
                    </td>
                    <td className="py-4">
                      <span
                        title={post.dark_background ? "Dark theme — From Pete" : "Light theme — General Editorial"}
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase border ${
                          post.dark_background
                            ? "border-[#C8F135]/30 text-[#5a6e00] bg-[#C8F135]/10"
                            : "border-mkt-bd text-mkt-i4 bg-neutral-50"
                        }`}
                      >
                        {post.dark_background ? <Moon className="w-2.5 h-2.5" /> : <Sun className="w-2.5 h-2.5" />}
                        {post.dark_background ? "Dark" : "Light"}
                      </span>
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => handleTogglePublish(post.id, post.is_published)}
                        disabled={togglingId === post.id}
                        className="cursor-pointer disabled:opacity-50"
                        title="Toggle published state"
                      >
                        {togglingId === post.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-mkt-i4" />
                        ) : post.is_published ? (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-mkt-gbg border border-mkt-gbd text-mkt-grn uppercase">
                            LIVE
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-neutral-50 text-mkt-i3 border border-mkt-bd uppercase">
                            DRAFT
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/blog/${post.id}`}
                          className="p-1.5 border border-mkt-bd hover:bg-neutral-50 text-mkt-i3 hover:text-mkt-ink rounded transition-all"
                          title="Edit Post"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                        {post.is_published && (
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="p-1.5 border border-mkt-bd hover:bg-neutral-50 text-mkt-i3 hover:text-mkt-ink rounded transition-all"
                            title="View Live"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                        )}
                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          disabled={deletingId === post.id}
                          className="p-1.5 border border-red-100 hover:border-red-200 text-mkt-i3 hover:text-red-500 hover:bg-red-50 rounded transition-all disabled:opacity-50 cursor-pointer"
                          title="Delete Post"
                        >
                          {deletingId === post.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-mkt-i4 font-mono">
                    No articles found. <Link href="/admin/blog/new" className="text-mkt-ink underline">Create the first post →</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-mkt-bd pt-4 text-xs font-mono">
            <span className="text-mkt-i3">
              Showing {from + 1}–{Math.min(to + 1, totalRecords)} of {totalRecords} articles
            </span>
            <div className="flex items-center gap-2">
              {currentPage > 1 ? (
                <Link href={getPageUrl(currentPage - 1)} className="p-2 border border-mkt-bd hover:bg-neutral-50 text-mkt-i3 hover:text-mkt-ink rounded">
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              ) : (
                <button disabled className="p-2 border border-mkt-bd text-mkt-i4 rounded opacity-40">
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              <span className="px-3 text-mkt-ink">Page {currentPage} of {totalPages}</span>
              {currentPage < totalPages ? (
                <Link href={getPageUrl(currentPage + 1)} className="p-2 border border-mkt-bd hover:bg-neutral-50 text-mkt-i3 hover:text-mkt-ink rounded">
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <button disabled className="p-2 border border-mkt-bd text-mkt-i4 rounded opacity-40">
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
