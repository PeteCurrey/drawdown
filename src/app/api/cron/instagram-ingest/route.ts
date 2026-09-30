import { NextRequest, NextResponse } from "next/server";
import { createInternalSupabase } from "@/lib/supabase/server";
import {
  extractClaimsWithClaude,
  verifyClaimsAgainstSources,
} from "@/lib/lobby/instagram-verifier";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // 60 seconds max execution time for Vercel Cron

/**
 * Daily Vercel Cron 06:30 Europe/London
 * For each source with ingest_mode='api', calls Meta Business Discovery for the last 24h of media.
 * On "not a professional account" error, updates that source to 'inbox' and logs it.
 * Runs extraction + verification pipeline and saves items as 'draft'.
 * STRICTLY GATED BEHIND INSTAGRAM_API_ENABLED='true'.
 */
export async function GET(request: NextRequest) {
  // 1. Authorization check for Vercel Cron
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    // In local or unauthenticated external access, check if admin or cron token
    const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
    const urlSecret = request.nextUrl.searchParams.get("secret");
    if (urlSecret !== cronSecret && urlSecret !== bypassSecret && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Unauthorized cron execution" }, { status: 401 });
    }
  }

  // 2. Strict Gate: only after Meta approval
  const isApiEnabled = process.env.INSTAGRAM_API_ENABLED === "true";
  if (!isApiEnabled) {
    return NextResponse.json({
      status: "skipped",
      reason: "INSTAGRAM_API_ENABLED is false or not set. Feature gated until Meta Business Discovery approval.",
      timestamp: new Date().toISOString(),
    });
  }

  const fbPageId = process.env.INSTAGRAM_PAGE_ID;
  const fbAccessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!fbPageId || !fbAccessToken) {
    return NextResponse.json({
      status: "error",
      message: "INSTAGRAM_PAGE_ID or INSTAGRAM_ACCESS_TOKEN missing.",
    }, { status: 500 });
  }

  const supabase = createInternalSupabase();

  // 3. Fetch sources with ingest_mode='api'
  const { data: sources, error: sourcesErr } = await supabase
    .from("monitored_sources")
    .select("id, handle, platform, ingest_mode, active")
    .eq("platform", "instagram")
    .eq("ingest_mode", "api")
    .eq("active", true);

  if (sourcesErr) {
    return NextResponse.json({ error: sourcesErr.message }, { status: 500 });
  }

  if (!sources || sources.length === 0) {
    return NextResponse.json({
      status: "completed",
      message: "No sources configured with ingest_mode='api'. All active sources are currently in 'inbox' mode.",
      processedCount: 0,
    });
  }

  const cutoff24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const results: any[] = [];

  for (const source of sources) {
    try {
      const url = `https://graph.facebook.com/v19.0/${fbPageId}?fields=business_discovery.username(${encodeURIComponent(
        source.handle
      )}){media{caption,media_type,permalink,timestamp}}&access_token=${encodeURIComponent(fbAccessToken)}`;

      const res = await fetch(url);
      const data = await res.json();

      // Check for "not a professional account" or business account error
      if (data.error) {
        const errMsg = String(data.error.message || "").toLowerCase();
        const subcode = data.error.error_subcode;
        const isNotProfessional = 
          subcode === 2207052 || 
          errMsg.includes("not a business") || 
          errMsg.includes("not a professional") || 
          errMsg.includes("unsupported request");

        if (isNotProfessional) {
          console.warn(`Source @${source.handle} is not a professional/business Instagram account. Downgrading to 'inbox'.`);
          await supabase
            .from("monitored_sources")
            .update({ ingest_mode: "inbox" })
            .eq("id", source.id);

          results.push({
            handle: source.handle,
            status: "downgraded_to_inbox",
            reason: data.error.message,
          });
          continue;
        }

        results.push({
          handle: source.handle,
          status: "api_error",
          error: data.error.message,
        });
        continue;
      }

      const mediaItems = data.business_discovery?.media?.data || [];
      let ingestedCount = 0;

      for (const media of mediaItems) {
        const mediaTime = new Date(media.timestamp);
        if (mediaTime < cutoff24h) continue;

        const permalink = media.permalink;
        // Avoid duplicate ingest
        const { data: existing } = await supabase
          .from("lobby_items")
          .select("id")
          .eq("original_url", permalink)
          .maybeSingle();

        if (existing) continue;

        // Run extraction + verification pipeline
        const extracted = await extractClaimsWithClaude({
          caption: media.caption || "",
        });

        const { verified_facts, avorria_commentary } = await verifyClaimsAgainstSources(
          extracted.claims,
          extracted.headline
        );

        await supabase.from("lobby_items").insert({
          source_id: source.id,
          original_url: permalink,
          posted_at: media.timestamp,
          extracted_claims: {
            headline: extracted.headline,
            claims: extracted.claims,
            avorria_commentary,
          },
          verified_facts,
          status: "draft", // Saved as draft
        });

        ingestedCount++;
      }

      results.push({
        handle: source.handle,
        status: "processed",
        ingestedCount,
      });
    } catch (sourceErr: any) {
      console.error(`Error processing @${source.handle}:`, sourceErr);
      results.push({
        handle: source.handle,
        status: "exception",
        error: sourceErr.message,
      });
    }
  }

  return NextResponse.json({
    status: "success",
    timestamp: new Date().toISOString(),
    results,
  });
}
