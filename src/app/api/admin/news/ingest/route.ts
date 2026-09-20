import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { DeduplicationService } from "@/lib/content-os/deduplication";
import { EditorialScoringService } from "@/lib/content-os/scoring";
import { NewsVerificationService } from "@/lib/content-os/verification";
import { recordContentAudit } from "@/lib/content-os/audit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  try {
    const body = await request.json();
    const { items } = body; // Array of incoming news items from RSS / API

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Payload must contain an 'items' array." }, { status: 400 });
    }

    const supabase = createServiceRoleClient();

    // Fetch existing candidates for deduplication evaluation
    const { data: existingCandidates } = await supabase
      .from("news_candidates")
      .select("id, source_url, title, duplicate_key, published_at")
      .order("discovered_at", { ascending: false })
      .limit(200);

    const createdCandidates = [];
    const duplicatesLinked = [];

    for (const item of items) {
      const dedupeResult = DeduplicationService.evaluateDuplicate(
        {
          url: item.url || item.source_url,
          title: item.title,
          entityReferences: item.entity_references || [],
          publishedAt: item.published_at
        },
        existingCandidates || []
      );

      if (dedupeResult.isDuplicate && dedupeResult.matchedCandidateId) {
        // Link to existing parent event
        duplicatesLinked.push({
          sourceUrl: item.url,
          matchedCandidateId: dedupeResult.matchedCandidateId,
          reason: dedupeResult.reason
        });

        // Add corroborating source to existing record
        await supabase
          .from("news_candidates")
          .update({
            updated_at: new Date().toISOString()
          })
          .eq("id", dedupeResult.matchedCandidateId);

        continue;
      }

      // Run verification framework on incoming item
      const verification = NewsVerificationService.verifyEvent({
        sources: [
          {
            name: item.source || "Unknown",
            url: item.url || item.source_url,
            trustTier: item.trust_tier || "tier_2_verified",
            claimText: item.summary || item.title,
            publishedAt: item.published_at
          }
        ]
      });

      // Run deterministic scoring
      const scoreResult = EditorialScoringService.scoreCandidate({
        title: item.title,
        summary: item.summary,
        sourceTrustTier: item.trust_tier || "tier_2_verified",
        entityReferences: item.entity_references || [],
        relatedSymbols: item.related_symbols || [],
        publishedAt: item.published_at,
        verificationEvidenceConfirmed: verification.status === "verified"
      });

      const candidatePayload = {
        title: item.title,
        summary: item.summary || "",
        source: item.source || "External",
        source_url: item.url || item.source_url,
        published_at: item.published_at ? new Date(item.published_at).toISOString() : null,
        entity_references: item.entity_references || [],
        related_symbols: item.related_symbols || [],
        asset_classes: item.asset_classes || [],
        relevance_score: scoreResult.relevanceScore,
        market_impact_score: scoreResult.marketImpactScore,
        confidence_score: scoreResult.confidenceScore,
        priority_level: scoreResult.priorityLevel,
        scoring_reasons: scoreResult.reasons,
        duplicate_key: dedupeResult.duplicateKey,
        verification_status: verification.status,
        verification_evidence: verification.evidence,
        editorial_status: "new",
        raw_payload: item
      };

      const { data: newCandidate, error: insertErr } = await supabase
        .from("news_candidates")
        .insert(candidatePayload)
        .select()
        .single();

      if (!insertErr && newCandidate) {
        createdCandidates.push(newCandidate);
        await recordContentAudit({
          entity_type: "news_candidate",
          entity_id: newCandidate.id,
          actor_id: guard.user.id,
          previous_state: null,
          new_state: "new",
          reason: `Ingested news candidate. Priority: ${scoreResult.priorityLevel}`
        });
      }
    }

    return NextResponse.json({
      ingested: createdCandidates.length,
      duplicatesIdentified: duplicatesLinked.length,
      candidates: createdCandidates,
      duplicates: duplicatesLinked
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Ingestion error" }, { status: 500 });
  }
}
