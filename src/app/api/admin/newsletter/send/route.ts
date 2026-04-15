import { NextResponse } from "next/server";
import { sendNewsletterBroadcast } from "@/lib/email/resend";
import { getNewsletterTemplate } from "@/lib/email/templates/weekly-newsletter";

export async function POST(req: Request) {
  try {
    const { subject, content, audience } = await req.json();

    if (!subject || !content || !audience) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Convert raw markdown-ish or text to HTML if necessary, or just rely on Pete sending basic HTML paragraphs.
    // For now, assuming `content` is pre-formatted HTML from the rich text editor in Admin UI.
    
    // We wrap it in the proper HTML table skeleton
    const fullHtml = getNewsletterTemplate(content, subject);

    const result = await sendNewsletterBroadcast({
      subject,
      html: fullHtml,
      audience
    });

    if (result.success) {
      return NextResponse.json({ message: "Broadcast dispatched", count: result.count, id: result.id });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error("Newsletter API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
