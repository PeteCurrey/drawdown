import { NextRequest, NextResponse } from "next/server";
import { generateNewsletterEdition } from "@/lib/newsletter/generation";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { TheWireTemplate } from "@/components/newsletter/TheWireTemplate";
import * as React from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  
  // 1. Generate the edition
  const editionId = await generateNewsletterEdition('daily');
  
  // 2. Fetch the newly created edition with its sections
  const { data: edition } = await supabase
    .from('newsletter_editions')
    .select('*, newsletter_sections(*)')
    .eq('id', editionId)
    .single();

  if (!edition) return NextResponse.json({ error: "Generation failed" }, { status: 500 });

  // 3. Render the HTML
  const sections = edition.newsletter_sections.map((s: any) => ({
    key: s.section_key,
    title: s.section_title,
    content: s.ai_content,
    display_order: s.display_order
  }));

  const html = await render(
    React.createElement(TheWireTemplate, {
      subject: edition.subject_line,
      preview: edition.preview_text,
      date: new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
      type: 'daily',
      sections: sections
    })
  );

  // 4. Fetch all active subscribers
  const { data: subscribers } = await supabase
    .from('newsletter_subscribers')
    .select('email')
    .eq('status', 'active');

  if (!subscribers || subscribers.length === 0) {
    return NextResponse.json({ 
      success: true, 
      message: "Edition generated but no active subscribers found to send to.",
      editionId 
    });
  }

  // 5. Send via Resend
  const emails = subscribers.map(s => s.email);
  const { data: sendData, error: sendError } = await resend.emails.send({
    from: "Pete @ Drawdown <thewire@drawdown.trading>",
    to: emails,
    subject: edition.subject_line,
    html: html
  });

  if (sendError) {
    console.error("Resend error:", sendError);
    return NextResponse.json({ error: "Email send failed", details: sendError }, { status: 500 });
  }

  // 6. Mark as sent
  await supabase
    .from('newsletter_editions')
    .update({ 
      status: 'sent', 
      sent_at: new Date().toISOString(),
      recipient_count: emails.length
    })
    .eq('id', editionId);

  return NextResponse.json({ 
    success: true, 
    message: `Successfully generated and sent to ${emails.length} users.`,
    editionId,
    resendId: sendData?.id
  });
}
