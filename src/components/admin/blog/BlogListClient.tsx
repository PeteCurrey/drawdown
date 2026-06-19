"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Plus, Edit2, Eye, Trash2, CheckCircle2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { deleteBlogPostAction } from "@/app/actions/admin-actions";

interface BlogPostInfo {
  id: string;
  title: string;
  category: string;
  published: boolean;
  published_at: string;
  tags: string[];
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

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

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

  const getPageUrl = (page: number) => {
    return `/admin/blog?page=${page}`;
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-display font-black uppercase text-white tracking-tight">Blog Manager</h1>
          <p className="text-xs text-[#8C8B87] font-mono uppercase tracking-widest mt-1">Articles & Briefs Catalog</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/blog/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#C8F135] hover:bg-[#D8F155] text-[#08090D] text-xs font-mono font-bold uppercase tracking-widest transition-all duration-150"
          >
            <Plus className="w-4 h-4" />
            New Post
          </Link>
          <Link href="/admin" className="text-xs font-mono uppercase tracking-widest text-[#8C8B87] hover:text-white transition-colors">
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Main Blog Logs Table */}
      <div className="bg-[#0F111A] border border-[#1C1F2B] p-6 rounded-xl space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#8C8B87]">
            <thead>
              <tr className="border-b border-white/5 pb-2 text-[10px] uppercase font-mono tracking-wider">
                <th className="py-3 font-semibold">Date</th>
                <th className="py-3 font-semibold">Title</th>
                <th className="py-3 font-semibold">Category</th>
                <th className="py-3 font-semibold">Status</th>
                <th className="py-3 font-semibold text-center">Auto-generated</th>
                <th className="py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts && posts.length > 0 ? (
                posts.map((post) => {
                  const isAuto = post.tags && post.tags.includes("automated");
                  return (
                    <tr key={post.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 font-mono">
                        {new Date(post.published_at || post.created_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </td>
                      <td className="py-4 font-medium text-white max-w-[280px] truncate">{post.title}</td>
                      <td className="py-4 font-mono text-[10px]">{post.category}</td>
                      <td className="py-4">
                        {post.published ? (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-emerald-500/10 text-emerald-400 uppercase">PUBLISHED</span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-white/5 text-[#8C8B87] border border-white/5 uppercase">DRAFT</span>
                        )}
                      </td>
                      <td className="py-4 text-center">
                        {isAuto ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                        ) : (
                          <span className="text-[#42413D] mx-auto">-</span>
                        )}
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            href={`/admin/blog/${post.id}`}
                            className="p-1.5 border border-white/5 hover:border-white/15 text-[#8C8B87] hover:text-white rounded transition-all"
                            title="Edit Post"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Link>
                          {post.published && (
                            <Link
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              className="p-1.5 border border-white/5 hover:border-white/15 text-[#8C8B87] hover:text-white rounded transition-all"
                              title="View Article"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Link>
                          )}
                          <button
                            onClick={() => handleDelete(post.id, post.title)}
                            disabled={deletingId === post.id}
                            className="p-1.5 border border-rose-500/5 hover:border-rose-500/20 text-[#8C8B87] hover:text-rose-400 rounded transition-all disabled:opacity-50 cursor-pointer"
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
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#5C5B57] font-mono">
                    No articles found in the database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-white/5 pt-4 text-xs font-mono">
            <span className="text-[#5C5B57]">
              Showing {from + 1} - {Math.min(to + 1, totalRecords)} of {totalRecords} articles
            </span>
            <div className="flex items-center gap-2">
              {currentPage > 1 ? (
                <Link
                  href={getPageUrl(currentPage - 1)}
                  className="p-2 border border-white/10 hover:border-white/20 text-[#8C8B87] hover:text-white rounded"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              ) : (
                <button disabled className="p-2 border border-white/5 text-[#42413D] rounded opacity-40">
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}

              <span className="px-3 text-white">Page {currentPage} of {totalPages}</span>

              {currentPage < totalPages ? (
                <Link
                  href={getPageUrl(currentPage + 1)}
                  className="p-2 border border-white/10 hover:border-white/20 text-[#8C8B87] hover:text-white rounded"
                >
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <button disabled className="p-2 border border-white/5 text-[#42413D] rounded opacity-40">
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
