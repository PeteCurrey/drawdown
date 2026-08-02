import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BookOpen, Download, Lock, Check, Star, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Downloads — Drawdown Dashboard",
  description: "Access your purchased PDF guides and unlock new titles from Pete Currey's complete trading library.",
};

const EBOOKS = [
  {
    id: "prop-survival-kit",
    slug: "prop-firm-survival-kit",
    title: "Prop Challenge Survival Kit",
    subtitle: "The Complete Evaluation Blueprint",
    description: "Every rule, calculation, and psychological framework you need to pass your prop firm evaluation. Includes the Rule Decoder, Position Sizing Sheets, and the Tilt Protocol.",
    price: "£49",
    pages: 100,
    accentColor: "#C8F135",
    textColor: "#1A1A1A",
    storePath: "/store/prop-survival-kit",
    bucketPath: process.env.SUPABASE_SURVIVAL_KIT_PATH || "survival-kit/prop-challenge-survival-kit.pdf",
    bucket: process.env.SUPABASE_SURVIVAL_KIT_BUCKET || "store",
    tags: ["Prop Firms", "Risk Management", "Psychology"],
    chapters: ["The Rule Decoder", "Position Sizing Sheets", "The Tilt Protocol", "Daily Loss Calculator"],
  },
  {
    id: "how-to-trade",
    slug: "how-to-trade",
    title: "How to Trade",
    subtitle: "The Institutional Trading Framework",
    description: "100 pages covering market structure, session theory, order flow, execution mechanics, and professional risk management. The complete foundation every serious trader needs.",
    price: "£79",
    pages: 100,
    accentColor: "#F9771D",
    textColor: "#FFFFFF",
    storePath: "/store/how-to-trade",
    bucketPath: process.env.SUPABASE_EBOOK_HOW_TO_TRADE_PATH || "ebooks/how-to-trade.pdf",
    bucket: process.env.SUPABASE_EBOOK_BUCKET || "store",
    tags: ["Foundations", "Market Structure", "Execution"],
    chapters: ["Market Structure", "Session Theory", "Order Flow", "Trade Execution", "Risk Management"],
  },
  {
    id: "the-edge",
    slug: "the-edge",
    title: "The Edge Manual",
    subtitle: "Advanced Strategy & Proprietary Setups",
    description: "Pete's advanced playbook — liquidity theory, institutional order flow, confluence trading, proprietary setups, and the psychological framework that separates consistent traders from the rest.",
    price: "£59",
    pages: 100,
    accentColor: "#818cf8",
    textColor: "#FFFFFF",
    storePath: "/store/the-edge",
    bucketPath: process.env.SUPABASE_EBOOK_THE_EDGE_PATH || "ebooks/the-edge.pdf",
    bucket: process.env.SUPABASE_EBOOK_BUCKET || "store",
    tags: ["Advanced", "Liquidity Theory", "Psychology"],
    chapters: ["Liquidity Theory", "Confluence Framework", "Proprietary Setups", "The Mental Edge"],
  },
] as const;

export default async function DownloadsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch user's purchases for ebook slugs
  const ebookSlugs = EBOOKS.map(e => e.slug);
  const { data: courses } = await supabase
    .from("courses")
    .select("id, slug")
    .in("slug", ebookSlugs);

  const courseIds = (courses || []).map(c => c.id);
  const { data: purchases } = await supabase
    .from("course_purchases")
    .select("course_id, purchased_at")
    .eq("user_id", user.id)
    .in("course_id", courseIds);

  // Map course_id → slug for owned check
  const ownedCourseIds = new Set((purchases || []).map(p => p.course_id));
  const courseIdToSlug = Object.fromEntries((courses || []).map(c => [c.id, c.slug]));
  const ownedSlugs = new Set(
    Array.from(ownedCourseIds).map(id => courseIdToSlug[id]).filter(Boolean)
  );

  // Generate signed URLs for owned ebooks
  const signedUrls: Record<string, string> = {};
  for (const ebook of EBOOKS) {
    if (ownedSlugs.has(ebook.slug)) {
      try {
        const { data } = await supabase.storage
          .from(ebook.bucket)
          .createSignedUrl(ebook.bucketPath, 60 * 60 * 24 * 7); // 7 day signed URL
        if (data?.signedUrl) signedUrls[ebook.slug] = data.signedUrl;
      } catch {
        // signed URL generation failed
      }
    }
  }

  const ownedCount = ownedSlugs.size;

  return (
    <div
      className="space-y-10 pb-24"
      style={{
        "--tool-accent": "#181818",
        "--tool-accent-text": "#555550",
      } as React.CSSProperties}
    >
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#DEDDD8]">
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] block text-[#555550]">
            // KNOWLEDGE VAULT
          </span>
          <h1 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tight text-[#1A1A1A]">
            Your Downloads
          </h1>
          <p className="text-xs md:text-sm text-[#555550] max-w-2xl leading-relaxed">
            Your personal PDF library. Purchase any title to unlock instant access — download to keep forever.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 px-4 py-2 bg-[#F8F8F8] border border-[#DEDDD8] rounded-xl">
            <BookOpen className="w-3.5 h-3.5 text-[#555550]" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#1A1A1A]">
              {ownedCount} / {EBOOKS.length} Owned
            </span>
          </div>
        </div>
      </div>

      {/* Ebook Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {EBOOKS.map((ebook) => {
          const isOwned = ownedSlugs.has(ebook.slug);
          const signedUrl = signedUrls[ebook.slug];

          return (
            <div
              key={ebook.id}
              className="bg-white border border-[#DEDDD8] rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex flex-col transition-shadow hover:shadow-[0_4px_24px_rgba(0,0,0,0.1)]"
            >
              {/* Card Header — accent color block */}
              <div
                className="relative h-44 flex flex-col justify-end p-6"
                style={{ backgroundColor: ebook.accentColor }}
              >
                {/* Status badge */}
                {isOwned ? (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                    <Check className="w-3 h-3" style={{ color: ebook.textColor }} />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest" style={{ color: ebook.textColor }}>Owned</span>
                  </div>
                ) : (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-black/20 backdrop-blur-sm rounded-full">
                    <Lock className="w-3 h-3 text-white/80" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/80">{ebook.price}</span>
                  </div>
                )}

                {/* Book icon decoration */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10">
                  <BookOpen className="w-20 h-20" style={{ color: ebook.textColor }} />
                </div>

                <div className="relative">
                  <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-1" style={{ color: ebook.textColor === '#FFFFFF' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)' }}>
                    {ebook.pages} Pages · PDF
                  </p>
                  <h2 className="text-xl font-display font-bold uppercase leading-tight" style={{ color: ebook.textColor }}>
                    {ebook.title}
                  </h2>
                  <p className="text-sm font-medium mt-0.5" style={{ color: ebook.textColor === '#FFFFFF' ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.6)' }}>
                    {ebook.subtitle}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1 gap-4">
                <p className="text-xs text-[#555550] leading-relaxed">{ebook.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {ebook.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-[#F8F8F8] border border-[#DEDDD8] text-[10px] font-mono font-bold uppercase tracking-widest text-[#555550] rounded-lg">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Chapter list (owned only) */}
                {isOwned && (
                  <div className="space-y-1.5 border-t border-[#DEDDD8] pt-4">
                    <p className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-[#AAAAAA] mb-2">Contents</p>
                    {ebook.chapters.map((ch, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full flex items-center justify-center bg-[#F0F9F0] shrink-0">
                          <Check className="w-2.5 h-2.5 text-green-600" />
                        </span>
                        <span className="text-xs text-[#555550]">{ch}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA — push to bottom */}
                <div className="mt-auto pt-2">
                  {isOwned ? (
                    <div className="space-y-2">
                      {signedUrl ? (
                        <a
                          href={signedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#181818] hover:bg-[#2a2a2a] transition-colors text-white text-[11px] font-mono font-bold uppercase tracking-widest rounded-xl"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download PDF
                        </a>
                      ) : (
                        <div className="text-center py-3 text-xs text-[#555550]">
                          Download link unavailable — <a href="mailto:pete@drawdown.trading" className="underline">contact support</a>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={ebook.storePath}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#F8F8F8] hover:bg-[#F0F0F0] border border-[#DEDDD8] hover:border-[#1A1A1A] transition-all text-[#1A1A1A] text-[11px] font-mono font-bold uppercase tracking-widest rounded-xl group"
                    >
                      Unlock for {ebook.price}
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upsell Strip */}
      {ownedCount < EBOOKS.length && (
        <div className="bg-[#F8F8F8] border border-[#DEDDD8] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-[#F9771D]" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#555550]">Complete the Library</span>
            </div>
            <p className="text-lg font-display font-bold uppercase text-[#1A1A1A]">
              You're {EBOOKS.length - ownedCount} guide{EBOOKS.length - ownedCount > 1 ? 's' : ''} away from the full Drawdown library
            </p>
            <p className="text-sm text-[#555550] mt-1">Every guide is written by Pete and designed to be read, re-read, and applied to every session.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            {EBOOKS.filter(e => !ownedSlugs.has(e.slug)).map(e => (
              <Link
                key={e.id}
                href={e.storePath}
                className="px-5 py-2.5 bg-[#181818] hover:bg-[#2a2a2a] transition-colors text-white text-[11px] font-mono font-bold uppercase tracking-widest rounded-xl"
              >
                Get {e.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Fully owned state */}
      {ownedCount === EBOOKS.length && (
        <div className="bg-[#F8F8F8] border border-[#DEDDD8] rounded-2xl p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Check className="w-5 h-5 text-green-600" />
            <span className="text-sm font-bold uppercase tracking-widest text-[#1A1A1A]">Complete Library Owned</span>
          </div>
          <p className="text-sm text-[#555550]">You own all 3 guides. New titles will appear here as they're released.</p>
        </div>
      )}
    </div>
  );
}
