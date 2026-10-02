import { NextRequest, NextResponse } from "next/server";
import { createClient, createInternalSupabase } from "@/lib/supabase/server";
import {
  extractClaimsWithClaude,
  verifyClaimsAgainstSources,
} from "@/lib/lobby/instagram-verifier";

async function verifyAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminEmail = process.env.ADMIN_EMAIL || "petecurrey@gmail.com";
  if (!user || (user.email !== adminEmail && (user as any).role !== "admin")) {
    // Also check profiles table
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      if (profile?.role === "admin") {
        return { user, supabase };
      }
    }
    return { user: null, supabase };
  }
  return { user, supabase };
}

export async function GET(request: NextRequest) {
  const { user } = await verifyAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const internalSupabase = createInternalSupabase();

  // Fetch active monitored sources
  const { data: sources, error: sourcesError } = await internalSupabase
    .from("monitored_sources")
    .select("*")
    .order("handle", { ascending: true });

  if (sourcesError) {
    return NextResponse.json({ error: sourcesError.message }, { status: 500 });
  }

  // Fetch recent lobby_items with source data
  const { data: items, error: itemsError } = await internalSupabase
    .from("lobby_items")
    .select(`
      id,
      source_id,
      original_url,
      posted_at,
      extracted_claims,
      verified_facts,
      status,
      created_at,
      monitored_sources:source_id (
        id,
        platform,
        handle,
        ingest_mode,
        active
      )
    `)
    .order("created_at", { ascending: false })
    .limit(50);

  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  return NextResponse.json({
    sources: sources || [],
    items: items || [],
  });
}

export async function POST(request: NextRequest) {
  const { user } = await verifyAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const internalSupabase = createInternalSupabase();

  try {
    const contentType = request.headers.get("content-type") || "";

    let original_url = "";
    let handle = "";
    let caption = "";
    let posted_at = new Date().toISOString();
    let imageBase64: string | undefined;
    let imageMediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif" | undefined;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      original_url = String(formData.get("original_url") || "").trim();
      handle = String(formData.get("handle") || "").trim().replace(/^@/, "");
      caption = String(formData.get("caption") || "").trim();
      const customPostedAt = formData.get("posted_at");
      if (customPostedAt) posted_at = new Date(String(customPostedAt)).toISOString();

      const imageFile = formData.get("screenshot") as File | null;
      if (imageFile && imageFile.size > 0) {
        const buffer = await imageFile.arrayBuffer();
        imageBase64 = Buffer.from(buffer).toString("base64");
        imageMediaType = (imageFile.type as any) || "image/png";
      }
    } else {
      const body = await request.json();
      original_url = String(body.original_url || "").trim();
      handle = String(body.handle || "").trim().replace(/^@/, "");
      caption = String(body.caption || "").trim();
      if (body.posted_at) posted_at = new Date(body.posted_at).toISOString();
      imageBase64 = body.imageBase64;
      imageMediaType = body.imageMediaType || "image/png";
    }

    if (!original_url) {
      return NextResponse.json({ error: "Instagram post URL is required." }, { status: 400 });
    }
    if (!handle) {
      return NextResponse.json({ error: "Source handle is required." }, { status: 400 });
    }

    // 1. Ensure source exists in monitored_sources (Platform Instagram)
    const { data: sourceRecord, error: sourceError } = await internalSupabase
      .from("monitored_sources")
      .upsert(
        {
          platform: "instagram",
          handle,
          ingest_mode: "inbox",
          active: true,
        },
        { onConflict: "platform,handle" }
      )
      .select("id")
      .single();

    if (sourceError || !sourceRecord) {
      return NextResponse.json(
        { error: sourceError?.message || "Failed to resolve source handle." },
        { status: 500 }
      );
    }

    // 2. Extraction via Claude Vision / Caption parsing
    const extracted = await extractClaimsWithClaude({
      caption,
      imageBase64,
      imageMediaType,
    });

    // 3. Verification against authoritative primary sources (FRED, EIA, Price Feed)
    const { verified_facts, drawdown_commentary } = await verifyClaimsAgainstSources(
      extracted.claims,
      extracted.headline
    );

    const payloadClaims = {
      headline: extracted.headline,
      claims: extracted.claims,
      drawdown_commentary,
    };

    // 4. Save to lobby_items as status = 'draft'
    const { data: newItem, error: insertError } = await internalSupabase
      .from("lobby_items")
      .insert({
        source_id: sourceRecord.id,
        original_url,
        posted_at,
        extracted_claims: payloadClaims,
        verified_facts,
        status: "draft",
      })
      .select(`
        id,
        source_id,
        original_url,
        posted_at,
        extracted_claims,
        verified_facts,
        status,
        created_at,
        monitored_sources:source_id (
          id,
          platform,
          handle,
          ingest_mode,
          active
        )
      `)
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      item: newItem,
    });
  } catch (err: any) {
    console.error("Error processing lobby inbox post:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const { user } = await verifyAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const internalSupabase = createInternalSupabase();

  try {
    const body = await request.json();
    const { id, status, extracted_claims, verified_facts } = body;

    if (!id) {
      return NextResponse.json({ error: "Item ID is required." }, { status: 400 });
    }

    const updates: Record<string, any> = {};
    if (status) {
      if (!["draft", "published", "rejected"].includes(status)) {
        return NextResponse.json({ error: "Invalid status value." }, { status: 400 });
      }
      updates.status = status;
    }
    if (extracted_claims) updates.extracted_claims = extracted_claims;
    if (verified_facts) updates.verified_facts = verified_facts;

    const { data, error } = await internalSupabase
      .from("lobby_items")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, item: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update item." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { user } = await verifyAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Item ID required" }, { status: 400 });
  }

  const internalSupabase = createInternalSupabase();
  const { error } = await internalSupabase.from("lobby_items").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
