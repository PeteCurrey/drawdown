// src/app/api/admin/wire/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createInternalSupabase } from "@/lib/supabase/server";
import { generateWireSlug } from "@/lib/wire";
import type { CreateWireEditionInput, WireItemInput } from "@/types/wire";

export async function GET() {
  try {
    const supabase = await createInternalSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("wire_editions")
      .select(`
        *,
        items:wire_edition_items(count)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to load editions" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createInternalSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { edition, items } = body as {
      edition: CreateWireEditionInput;
      items: WireItemInput[];
    };

    if (!edition.title || !edition.edition_type || !edition.subject_line) {
      return NextResponse.json({ error: "Title, edition type, and subject line are required" }, { status: 400 });
    }

    const slug = edition.slug || generateWireSlug(edition.edition_type);

    // Insert edition
    const { data: newEdition, error: edError } = await supabase
      .from("wire_editions")
      .insert({
        edition_type: edition.edition_type,
        title: edition.title,
        slug,
        subject_line: edition.subject_line,
        preview_text: edition.preview_text || null,
        editorial_notes: edition.editorial_notes || null,
        scheduled_for: edition.scheduled_for || null,
        status: "DRAFT",
        created_by: user.id
      })
      .select()
      .single();

    if (edError || !newEdition) {
      throw edError || new Error("Failed to insert wire edition");
    }

    // Insert items if provided
    if (items && items.length > 0) {
      const itemsPayload = items.map((item, index) => ({
        edition_id: newEdition.id,
        article_id: item.article_id || null,
        display_order: item.display_order ?? (index + 1),
        item_title: item.item_title,
        wire_summary: item.wire_summary,
        why_it_matters: item.why_it_matters,
        recommended_tool_slug: item.recommended_tool_slug || null,
        market_category: item.market_category || null,
        source_attribution: item.source_attribution || null
      }));

      const { error: itemsError } = await supabase
        .from("wire_edition_items")
        .insert(itemsPayload);

      if (itemsError) throw itemsError;
    }

    return NextResponse.json({ success: true, edition: newEdition });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create edition" }, { status: 500 });
  }
}
