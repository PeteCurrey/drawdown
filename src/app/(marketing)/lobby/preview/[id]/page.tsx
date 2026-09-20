import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getLobbyArticleByIdAdmin } from "@/lib/lobby-admin";
import { LobbyNav } from "@/components/lobby/LobbyNav";
import { LobbyImage } from "@/components/lobby/LobbyImage";
import { LobbySourceAttribution } from "@/components/lobby/LobbySourceAttribution";
import { LobbyInternalLinks } from "@/components/lobby/LobbyInternalLinks";
import { categoryToSlug } from "@/lib/lobby";
import { ShieldAlert, Clock, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Editorial Preview | The Lobby CMS",
  robots: { index: false, follow: false },
};

interface PreviewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function LobbyPreviewPage({ params }: PreviewPageProps) {
  // 1. Verify User is Authenticated Admin
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const adminEmail = process.env.ADMIN_EMAIL || "petecurrey@gmail.com";

  if (!user || user.email !== adminEmail) {
    redirect("/login");
  }

  const { id } = await params;
  const article = await getLobbyArticleByIdAdmin(id);

  if (!article) {
    notFound();
  }

  const categorySlug = categoryToSlug(article.category);

  return (
    <div className="w-full bg-[#FFFFFF] min-h-screen text-[#0B0E12] font-sans selection:bg-[#16213E] selection:text-[#FFFFFF]">
      {/* Admin Preview Top Banner */}
      <div className="bg-[#16213E] text-[#FFFFFF] py-2 px-6 text-xs font-mono flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>EDITORIAL PREVIEW MODE — STATUS: <strong>{article.status}</strong></span>
        </div>
        <div className="flex items-center gap-4">
          <Link href={`/admin/lobby/${article.id}`} className="underline text-amber-300 hover:text-white">
            Return to Editor &rarr;
          </Link>
        </div>
      </div>

      <LobbyNav />

      <article className="max-w-[1080px] mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#4B5157] mb-6">
          <Link href={`/admin/lobby`} className="inline-flex items-center gap-1 hover:text-[#16213E]">
            <ArrowLeft className="w-3 h-3" /> CMS Dashboard
          </Link>
          <span>•</span>
          <span className="text-[#16213E] font-bold">{article.category}</span>
          <span>•</span>
          <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded-[2px]">{article.status}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-black tracking-[-0.035em] text-[#0B0E12] leading-[1.08] mb-6">
          {article.title}
        </h1>

        <p className="text-lg sm:text-xl text-[#4B5157] font-sans leading-relaxed border-l-2 border-[#16213E] pl-4 sm:pl-6 my-6">
          {article.excerpt}
        </p>

        <div className="py-4 border-t border-b border-[#DEDDD8] flex items-center justify-between text-xs font-mono text-[#4B5157] my-8">
          <span>By {article.author_name} ({article.author_role})</span>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            <span>{article.reading_time_minutes} min read</span>
          </div>
        </div>

        <div className="my-8">
          <LobbyImage
            src={article.hero_image_url}
            alt={article.hero_image_alt || article.title}
            category={article.category}
            headline={article.title}
            aspectRatio="16/9"
            caption={article.hero_image_caption}
            credit={article.hero_image_credit}
          />
        </div>

        <div className="max-w-[760px] mx-auto py-6">
          <div className="prose prose-neutral max-w-none text-[#0B0E12] font-sans text-base sm:text-lg leading-[1.8] space-y-6">
            {article.body.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <LobbySourceAttribution
            sources={article.sources}
            primarySourceName={article.primary_source_name}
            primarySourceUrl={article.primary_source_url}
          />

          <LobbyInternalLinks
            toolSlugs={article.related_tool_slugs}
            brokerSlugs={article.related_broker_slugs}
            propFirmSlugs={article.related_prop_firm_slugs}
            platformSlugs={article.related_platform_slugs}
            relatedMarkets={article.related_markets}
          />
        </div>
      </article>
    </div>
  );
}
