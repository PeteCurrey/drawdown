"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { CheckSquare, Clock, ArrowRight, FileText } from "lucide-react";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";

interface Props {
  userId: string;
}

export default function ReviewListingClient({ userId }: Props) {
  const supabase = createClient() as any;
  const [records, setRecords] = useState<any[]>([]);
  const [reviews, setReviews] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data: recordsData } = await supabase
          .from("trade_records")
          .select("id, trade_plan_id, instrument, direction, result_amount, opened_at, closed_at")
          .eq("user_id", userId)
          .order("opened_at", { ascending: false });

        const { data: reviewsData } = await supabase
          .from("trade_reviews")
          .select("trade_record_id, process_score, created_at")
          .eq("user_id", userId);

        const reviewMap: Record<string, any> = {};
        (reviewsData || []).forEach((r: any) => { reviewMap[r.trade_record_id] = r; });

        setRecords(recordsData || []);
        setReviews(reviewMap);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userId]);

  const pending = records.filter(r => !reviews[r.id]);
  const completed = records.filter(r => !!reviews[r.id]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-[#F3F2EE] rounded-[8px]" />
        <div className="h-40 bg-[#F3F2EE] rounded-[8px]" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Stage 5 · Review"
        title="Process Review"
        description="Evaluate plan adherence, risk discipline, and journal completeness. Outcomes are shown separately — process quality is the headline."
      />

      {/* Pending Reviews */}
      {pending.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.09em] text-[#87877F] flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            Reviews Due ({pending.length})
          </h2>
          <div className="space-y-3">
            {pending.map(record => (
              <Link
                key={record.id}
                href={`/dashboard/review/${record.id}`}
                className="flex items-center justify-between p-5 bg-white border border-amber-200/80 rounded-[8px] shadow-[0_1px_2px_rgba(14,13,10,0.04)] hover:shadow-[0_2px_8px_rgba(14,13,10,0.08)] hover:border-amber-300 transition-all group"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-[4px] uppercase tracking-wider">
                      Awaiting Review
                    </span>
                    {record.instrument && (
                      <span className="text-[10px] font-medium text-[#474744]">{record.instrument}</span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-[#181818]">
                    {record.direction ? record.direction.toUpperCase() : "Trade"} Record
                  </p>
                  <p className="text-xs text-[#87877F]">
                    {record.opened_at ? new Date(record.opened_at).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }) : "Unknown date"}
                    {record.result_amount !== null && (
                      <span className={cn("ml-2 font-semibold dd-tabular", record.result_amount >= 0 ? "text-[#18B880]" : "text-[#CE6969]")}>
                        {record.result_amount >= 0 ? "+" : ""}{record.result_amount?.toFixed(2)}
                      </span>
                    )}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#87877F] group-hover:text-[#181818] transition-colors" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {records.length === 0 && (
        <div className="p-10 border border-dashed border-[#E6E4DE] bg-white rounded-[8px] text-center space-y-3">
          <FileText className="w-8 h-8 text-[#87877F] mx-auto" />
          <p className="text-xs text-[#87877F]">No trade records yet. Record a trade first, then return here to begin your process review.</p>
          <Link
            href="/dashboard/journal"
            className="inline-block text-xs font-semibold text-[#F9771D] hover:underline uppercase tracking-wider"
          >
            Go to AI Trade Journal →
          </Link>
        </div>
      )}

      {/* Completed Reviews */}
      {completed.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.09em] text-[#87877F] flex items-center gap-2">
            <CheckSquare className="w-3.5 h-3.5 text-[#18B880]" />
            Completed Reviews ({completed.length})
          </h2>
          <div className="space-y-3">
            {completed.map(record => {
              const review = reviews[record.id];
              return (
                <Link
                  key={record.id}
                  href={`/dashboard/review/${record.id}`}
                  className="flex items-center justify-between p-5 bg-white border border-[#E6E4DE] rounded-[8px] shadow-[0_1px_2px_rgba(14,13,10,0.04)] hover:shadow-[0_2px_8px_rgba(14,13,10,0.08)] transition-all group"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-semibold bg-[#F0FDF8] text-[#18B880] border border-[rgba(24,184,128,0.25)] px-2 py-0.5 rounded-[4px] uppercase tracking-wider">
                        Reviewed
                      </span>
                      {record.instrument && (
                        <span className="text-[10px] font-medium text-[#474744]">{record.instrument}</span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-[#181818]">
                      {record.direction ? record.direction.toUpperCase() : "Trade"} Record
                    </p>
                    <div className="flex items-center gap-4 text-xs text-[#87877F]">
                      <span>
                        {record.opened_at ? new Date(record.opened_at).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }) : ""}
                      </span>
                      {review?.process_score !== undefined && (
                        <span className="font-semibold text-[#181818]">
                          Process Score: {review.process_score}/100
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#87877F] group-hover:text-[#181818] transition-colors" />
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
