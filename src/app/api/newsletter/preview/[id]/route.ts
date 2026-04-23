import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { render } from "@react-email/render";
import { TheWireTemplate } from "@/components/newsletter/TheWireTemplate";
import * as React from "react";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: edition } = await supabase
    .from('newsletter_editions')
    .select('*, newsletter_sections(*)')
    .eq('id', id)
    .single();

  if (!edition) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // Combine AI content and edited content
  const sections = edition.newsletter_sections.map((s: any) => ({
    key: s.section_key,
    title: s.section_title,
    content: s.edited_content || s.ai_content,
    display_order: s.display_order
  }));

  const html = await render(
    React.createElement(TheWireTemplate, {
      subject: edition.subject_line,
      preview: edition.preview_text,
      date: new Date(edition.scheduled_send_at).toLocaleDateString('en-GB', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }),
      type: edition.edition_type,
      sections: sections
    })
  );

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
