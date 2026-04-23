import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { TheWireTemplate } from "@/components/newsletter/TheWireTemplate";
import * as React from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const supabase = await createClient();
  const now = new Date().toISOString();

  try {
    // 1. Find scheduled editions
    const { data: editions } = await supabase
      .from('newsletter_editions')
      .select('*, newsletter_sections(*)')
      .eq('status', 'scheduled')
      .lte('scheduled_send_at', now);

    if (!editions || editions.length === 0) {
      return NextResponse.json({ message: "No editions to send" });
    }

    for (const edition of editions) {
      // 2. Prepare content
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

      // 3. Send via Resend (Using Broadcasts if audience is set, else transactional for now)
      // Note: Real broadcast usage would require Resend Broadcasts API which is in beta
      // For this build, we use the standard emails.send to all active subscribers
      const { data: subscribers } = await supabase
        .from('newsletter_subscribers')
        .select('email')
        .eq('status', 'active');

      if (subscribers && subscribers.length > 0) {
         // Batch sending or BCC for smaller lists, but ideally use Resend Audiences
         await resend.emails.send({
            from: "Pete @ Drawdown <thewire@drawdown.trading>",
            to: subscribers.map(s => s.email),
            subject: edition.subject_line,
            html: html
         });
      }

      // 4. Update Edition Status
      await supabase
        .from('newsletter_editions')
        .update({ 
          status: 'sent', 
          sent_at: new Date().toISOString() 
        })
        .eq('id', edition.id);
      
      console.log(`[CRON] Sent edition: ${edition.id}`);
    }

    return NextResponse.json({ success: true, count: editions.length });
  } catch (error) {
    console.error("[CRON] Scheduled send failed:", error);
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }
}
