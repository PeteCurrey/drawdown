import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

export async function POST(request: NextRequest) {
  const { email, first_name, source, locale = 'uk' } = await request.json();
  const supabase = await createClient();

  try {
    // 1. Check if already exists
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('email', email)
      .single();

    if (existing && existing.status === 'active') {
      return NextResponse.json({ success: true, already_subscribed: true });
    }

    // 2. Add to Supabase
    const { data: subscriber, error: subError } = await supabase
      .from('newsletter_subscribers')
      .upsert({
        email,
        first_name,
        source,
        locale,
        status: 'active',
        subscribed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (subError) throw subError;

    // 3. Add to Resend Audience
    if (process.env.RESEND_AUDIENCE_ID) {
      await resend.contacts.create({
        email,
        firstName: first_name,
        audienceId: process.env.RESEND_AUDIENCE_ID,
      });
    }

    // 4. Send Welcome Email (Transactional)
    await resend.emails.send({
      from: "Pete @ Drawdown <thewire@drawdown.trading>",
      to: email,
      subject: "Welcome to The Wire",
      html: `
        <div style="font-family: sans-serif; background: #0a0a0a; color: #f5f5f5; padding: 40px;">
          <h1 style="font-family: serif; color: #f59e0b;">Welcome to The Wire.</h1>
          <p>You're on the list. The next edition lands in your inbox at 07:00 GMT tomorrow.</p>
          <p>Expect professional-grade market intelligence, direct from Drawdown.</p>
          <a href="https://drawdown.trading" style="display: inline-block; padding: 12px 24px; border: 1px solid #f59e0b; color: #f59e0b; text-decoration: none; margin-top: 20px;">
            EXPLORE THE PLATFORM →
          </a>
        </div>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscription failed:", error);
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  }
}
