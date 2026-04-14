import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: NextRequest) {
  // 1. Verify Cron Secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    // return new Response('Unauthorized', { status: 401 });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return [] },
        setAll() {},
      },
    }
  );

  try {
    // 2. Fetch latest Roundup
    const { data: roundup, error: roundupError } = await supabase
      .from('weekly_roundups')
      .select('*')
      .order('week_ending', { ascending: false })
      .limit(1)
      .single();

    if (roundupError || !roundup) {
      return NextResponse.json({ message: "No roundup found to send." });
    }

    // 3. Fetch Subscribers
    const { data: subscribers, error: subError } = await supabase
      .from('newsletter_subscribers')
      .select('email')
      .eq('is_active', true);

    if (subError || !subscribers || subscribers.length === 0) {
      return NextResponse.json({ message: "No active subscribers found." });
    }

    const recipientEmails = subscribers.map(s => s.email);

    // 4. Send Email via Resend
    // Note: Resend has a batch send limit per request, but for MVP we send as BCC or individually
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'Drawdown <thewire@drawdown.co.uk>',
      to: 'thewire@drawdown.co.uk', // Send to self
      bcc: recipientEmails, // BCC all subscribers
      subject: `The Wire — Weekly Edition: ${new Date(roundup.week_ending).toLocaleDateString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #08090D; color: #E4E2DD; padding: 40px;">
          <h1 style="color: #00C2FF; text-transform: uppercase; font-size: 24px; letter-spacing: 2px;">Drawdown</h1>
          <p style="font-family: monospace; color: #8C8B87; font-size: 10px;">// WEEKLY ROUNDUP: ${roundup.week_ending}</p>
          <hr style="border: 0; border-top: 1px solid #1A1D24; margin: 20px 0;" />
          <div style="line-height: 1.6; font-size: 16px;">
            ${roundup.content_html.replace(/\n/g, '<br />')}
          </div>
          <hr style="border: 0; border-top: 1px solid #1A1D24; margin: 40px 0;" />
          <p style="font-size: 12px; color: #8C8B87; text-align: center;">
            You received this because you're subscribed to The Wire. 
            <br />
            Manage your subscription in the Drawdown Dashboard.
            <br /><br />
            © ${new Date().getFullYear()} Drawdown Platform Ltd.
          </p>
        </div>
      `,
    });

    if (emailError) throw emailError;

    // 5. Log the Send
    await supabase.from('newsletter_sends').insert({
      subject: `The Wire — Weekly Edition: ${roundup.week_ending}`,
      content_html: roundup.content_html,
      recipient_count: recipientEmails.length,
    });

    return NextResponse.json({ 
      success: true, 
      recipient_count: recipientEmails.length,
      roundup_date: roundup.week_ending 
    });

  } catch (error: any) {
    console.error("Newsletter Cron Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
