"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Take {
  content: string;
  date: string;
}

export function PetesDailyTakeExcerpt() {
  const [take, setTake] = useState<Take | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchTake() {
      // Fetch latest daily brief from Supabase
      const { data } = await (supabase
        .from("daily_briefs")
        .select("summary, created_at") as any)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setTake({
          content: data.summary,
          date: new Date(data.created_at).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
          })
        });
      } else {
        // Fallback mockup
        setTake({
          content: "Major indices are showing strong resilience at key psychological levels despite mixed signals. Watch the upcoming volatility index release closely — any upside surprise will likely trigger a sharp rotation into safety.",
          date: new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
          })
        });
      }
    }
    fetchTake();
  }, []);

  if (!take) return null;

  return (
    <section className="py-24 bg-background-primary relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-background-surface border-l-4 border-accent border-y border-r border-border-slate p-12 relative group transition-premium hover:border-accent/30">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-bold">
                // PETE'S TAKE
              </span>
              <div className="h-px w-8 bg-border-slate" />
              <span className="text-[10px] font-mono tracking-widest uppercase text-text-tertiary">
                {take.date}
              </span>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-display font-medium leading-relaxed italic text-text-primary">
                "{take.content.length > 200 ? take.content.slice(0, 200) + "..." : take.content}"
              </h3>
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 flex items-center justify-center rounded-full">
                    <MessageSquare className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Pete Currey</span>
                    <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Founder, Drawdown</span>
                  </div>
                </div>

                <Link 
                  href="/tools/briefing" 
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent hover:underline group"
                >
                  Read Full Brief <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Abstract background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </section>
  );
}
