import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const supabase = await createClient();
  const { subject_line, preview_text, status, sections } = await request.json();

  try {
    // 1. Update Edition
    const { error: editionError } = await supabase
      .from('newsletter_editions')
      .update({
        subject_line,
        preview_text,
        status,
        human_edited: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (editionError) throw editionError;

    // 2. Update Sections
    for (const section of sections) {
      const { error: sectionError } = await supabase
        .from('newsletter_sections')
        .update({
          edited_content: section.edited_content,
          updated_at: new Date().toISOString()
        })
        .eq('id', section.id);
      
      if (sectionError) throw sectionError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update edition:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
